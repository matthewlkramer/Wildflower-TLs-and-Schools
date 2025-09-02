// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { json, sleep } from "@shared/http.ts";
import { log, sendConsole, logDebugErr } from "@shared/log.ts";
import { getValidAccessToken, refreshAccessToken, exchangeCode } from "@shared/google-auth.ts";
import { apiCallWithOAuth } from "@shared/api.ts";
import { setSyncStatus, setPeriodStatus } from "@shared/progress.ts";
import { upsertBatch } from "@shared/upsert.ts";
import { matchEmailsWeeklyGlobal } from "@shared/matching.ts";
import { preflight } from "@shared/cors.ts"

// ---- Tunables (optimized for speed) ----
const MESSAGE_ID_BATCH_SIZE = 500; // Bigger pages → far fewer list calls
const HEADER_BATCH_SIZE = 50; // Gmail batch API supports up to 100 requests per batch
const HEADER_STAGGER_MS = 10;
const BODY_BATCH_SIZE = 20; // Process 20 bodies at once
const MAX_EMPTY_RESPONSES = 3;
const RATE_LIMIT_DELAY_MS = 200; // Very short delay between batches since we're under quota
const LIST_PAGE_DELAY_MS = 500; // Short delay between list pages
const HEADER_TIMEOUT_MS = 10_000;
const FUNCTION_TIMEOUT_MS = 1.8 * 60 * 1000; // Function timeout (1.8 min) - aggressive timeout to ensure cleanup
const MAX_429_WAIT_MS = 120000; // ≤ 2 minutes
const MAX_QUOTA_WAIT_MS = 120000; // ≤ 2 minutes in gmailCall

const STARTS_FROM = '2016-04-01';
const GMAIL_SCOPES = "https://www.googleapis.com/auth/gmail.readonly";
const GMAIL_QUERY_FILTER_STRING = 
  `in:anywhere -label:trash -label:draft -category:social -category:promotions -category:updates ` +
  `-from:noreply -from:no-reply -from:donotreply -from:notifications -from:support -from:automated ` +
  `-from:mailer-daemon -from:postmaster -subject:"unsubscribe" -subject:"auto-reply" -subject:"out of office" -subject:"delivery failed"`;
const RUN_ID_CACHE = new Map(); // per-invocation cache
let syncStartTime = 0;

serve(async (req)=>{
  const pf = preflight(req);
  if (pf) return pf;
  if (req.method === "GET") return json({ok: true, function: "gmail-sync"});

  try {
    const body = await req.json().catch(()=>({}));
    const { action, code, redirect_uri, redirectUri } = body || {};
    const finalRedirectUri = redirect_uri || redirectUri;

    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader) return json({error: "Missing Authorization header"}, 401);
    const supabaseAuth = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_ANON_KEY") ?? "", {global: {headers: {Authorization: authHeader}}},);
    const { data: authData, error: authError } = await supabaseAuth.auth.getUser();
    if (authError || !authData?.user) return json({error: "Unauthorized"}, 401);
    const userId = authData.user.id;
    const supabase = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "");
    
    switch(action){
      case "get_auth_url": return await getAuthUrl(finalRedirectUri);
      case "exchange_code": return await handleExchangeCode(supabase, code, userId, finalRedirectUri);
      case "get_connection_status": return await getConnectionStatus(supabase, userId);
      case "start_sync": return await startSync(supabase, userId, body?.focus ?? null);
      case "pause_sync":
        await setSyncStatus(supabase,"gmail_sync_progress", userId, {sync_status: "paused"});
        await sendConsole(supabase, userId, RUN_ID_CACHE.get(userId) ?? null, "Sync paused", "milestone", "gmail");
        return json({ok: true, message: "Sync paused"});
      case "check_missing_bodies": return await checkMissingBodies(supabase, userId);
      default: return json({error: `Unknown action: ${action}`}, 400);
    }
  } catch (error) {
    log("Gmail-v3 error:", error);
    return json({error: (error as any)?.message ?? "Unknown error"}, 500);
  }
});

// ---------- AUTH FUNCTIONS ----------
async function getAuthUrl(redirectUri) {
  const clientId = Deno.env.get("GOOGLE_CLIENT_ID");
  if (!clientId) return json({error: "Missing Google Client ID"}, 500);
  const finalRedirect = encodeURIComponent(redirectUri || Deno.env.get("GOOGLE_REDIRECT_URI") || "http://wfcrm.vercel.app");
  const url = 
    `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}` + 
    `&redirect_uri=${finalRedirect}` +
    `&scope=${encodeURIComponent(GMAIL_SCOPES)}` + 
    `&response_type=code&access_type=offline&prompt=consent&include_granted_scopes=true`;
  return json({auth_url: url});
}

async function handleExchangeCode(supabase: any, code: string, userId: string, redirectUri?: string) {
  try {
    const finalRedirect = redirectUri || Deno.env.get("GOOGLE_REDIRECT_URI") || "http://wfcrm.vercel.app/oauth/callback";
    const result = await exchangeCode(supabase, code, userId, finalRedirect);
    return json(result);
  } catch (error: any) {
    log("error", "Token exchange failed:", error);
    return json({ error: error.message || "Failed to exchange code" }, 400);
  }
}

async function getConnectionStatus(supabase: any, userId: string) {
  const { data } = await supabase.from("google_auth_tokens").select("access_token").eq("user_id", userId).single();
  return json({connected: !!data?.access_token});
}

// ---------- SYNC FUNCTIONS ----------
async function startSync(supabase: any, userId: string, focus:string | null) {
  try {
    // refuse duplicate runs
    const { data: existing } = await supabase.from("gmail_sync_progress").select("sync_status, started_at").eq("user_id", userId).maybeSingle();
    if (existing?.sync_status === "running") {
      const secs = existing.started_at ? Math.round((Date.now() - new Date(existing.started_at).getTime()) / 1000) : "?";
      await sendConsole(supabase, userId, RUN_ID_CACHE.get(userId) ?? null, `⚠️ Sync already running for ${secs}s - ignoring duplicate request`, "milestone", "gmail");
      return json({ok: true, message: "Sync already running"});
    }
    // create & persist run_id BEFORE any messages
    const runId = crypto.randomUUID();
    RUN_ID_CACHE.set(userId, runId);
    const startedAt = new Date().toISOString();
    // Re-enabled progress updates

    await setSyncStatus(supabase,"gmail_sync_progress", userId, {sync_status: "running", started_at: startedAt, error_message: null});
    // Return immediately with run_id so UI can start subscription
    const response = json({ok: true, message: "Sync started", run_id: runId, started_at: startedAt});
    
    // Start the actual sync process AFTER returning response
    // This ensures the UI gets the run_id immediately
    processSync(supabase, userId, runId, focus)
      .then(async (reason) => {if (reason === 'completed') await sendConsole(supabase, userId, runId, "✅ Sync completed successfully", "milestone", "gmail")})
      .catch(async (e) => {
        await sendConsole(supabase, userId, runId, `❌ Sync failed: ${e.message}`, "milestone", "gmail");
        await setSyncStatus(supabase, "gmail_sync_progress", userId, { sync_status: "error", error_message: e.message });
      });
    await sendConsole(supabase, userId, runId, "✅ Starting Gmail Sync", "milestone", "gmail");
    return response;
  } catch (error:any) {
    await setSyncStatus(supabase, "gmail_sync_progress", userId, { sync_status: "error", error_message: error.message });
    await sendConsole(supabase, userId, RUN_ID_CACHE.get(userId) ?? null, `❌ Startup error: ${error.message}`, "milestone", "gmail");
    return json({ error: error.message },500);
  }
}


async function processSync(supabase: any, userId: string, runId: string, focus: string | null) {
  const start = Date.now();
  syncStartTime = start; // Store for timeout checks in nested functions
  await sendConsole(supabase, userId, runId, "📊 Checking for incomplete weeks...", "milestone", "gmail");
  
  // Priority processing for missing bodies
  if (focus === "missing_bodies") {
    try {
      // Get emails with contact matches but missing bodies
      const { data: missingBodies, error } = await supabase
        .from('g_emails')
        .select('id, gmail_message_id, contact_ids')
        .not('contact_ids', 'is', null)
        .is('body_text', null) 
        .is('body_html', null);
      const actual = (missingBodies ?? []).filter((email:any) => Array.isArray(email.contact_ids) && email.contact_ids.length > 0);
      await sendConsole(supabase, userId, runId, `🔍 Missing bodies ${actual.length}`, "milestone", "gmail");
      if (actual.length) {
        await processMissingBodies(supabase, userId, runId, actual);
        await sendConsole(supabase, userId, runId, "✅ Missing bodies updated", "milestone", "gmail");
      }
    } catch (err: any) {
        await sendConsole(supabase, userId, runId, `❌ Priority body fetch failed: ${err.message}`, "milestone", "gmail");
    }
  }

  while (true) {
    const elapsed = Date.now() - start;
    if (elapsed > FUNCTION_TIMEOUT_MS) {
      await sendConsole(supabase, userId, runId, `[AUTO-RESTART] ⏰ Function timeout (${Math.round(elapsed/1000)}s) - auto-pausing`, "milestone", "gmail");
      await setSyncStatus(supabase, "gmail_sync_progress", userId, { sync_status: "paused", error_message: "Auto-paused to prevent timeout" });
      return "timeout";
    }

    if (await isPaused(supabase, userId)) {
      await sendConsole(supabase, userId, runId, "⏸️ Sync paused", "milestone", "gmail");
      return "paused";
    }

    const nextWeek = await getNextIncompleteWeek(supabase, userId);
    if (!nextWeek) {
      await sendConsole(supabase, userId, runId, "✅ All weeks synced through current week!", "milestone", "gmail");
      await setSyncStatus(supabase, "gmail_sync_progress", userId, { sync_status: "completed", completed_at: new Date().toISOString() });
      return "completed";
    }
    await sendConsole(supabase, userId, runId, `🧭 Next week: ${nextWeek.year}-W${String(nextWeek.week).padStart(2,"0")} (gap/incomplete)`, "milestone", "gmail");
    const weekStr = `${nextWeek.year}-W${String(nextWeek.week).padStart(2, "0")}`;
    await sendConsole(supabase, userId, runId, `📅 Processing Week ${weekStr} (${nextWeek.startDate} to ${nextWeek.endDate})`, "milestone", "gmail");

    try {
      const result = await processWeek(supabase, userId, nextWeek.year, nextWeek.week, nextWeek.startDate, nextWeek.endDate, runId);
      await setPeriodStatus(
        supabase,
        "g_email_sync_progress",
        { user_id: userId, year: nextWeek.year, week: nextWeek.week, start_of_week: new Date(nextWeek.startDate + "T00:00:00.000Z").toISOString() },
        { sync_status: result?.isCurrent ? "partial" : "completed", completed_at: new Date().toISOString() },
        "user_id,year,week"
      );
      await sendConsole(supabase, userId, runId, `${weekStr}: ${result?.isCurrent ? "Current week synced (partial)" : "Week completed"}`, "milestone", "gmail");

      // Auto-pause after each week to avoid hitting function timeout; UI can auto-restart.
      await sendConsole(supabase, userId, runId, `[AUTO-RESTART] ✅ Week ${weekStr} completed - auto-restarting for next week`, "milestone", "gmail");
      await setSyncStatus(supabase, "gmail_sync_progress", userId, { sync_status: "paused", error_message: "Auto-paused after week completion" });
      return "week_completed_restart";
    } catch (error: any) {
      const isQuota =
        (error?.message ?? "").toLowerCase().includes("quota") ||
        (error?.message ?? "").toLowerCase().includes("429");

      if (isQuota) {
        await sendConsole(supabase, userId, runId, "🛑 Quota error detected — pausing to respect limits.", "milestone", "gmail");
        await setPeriodStatus(supabase, "g_email_sync_progress", {user_id: userId, year: nextWeek.year, week: nextWeek.week, start_of_week: new Date(nextWeek.startDate + "T00:00:00Z").toISOString() },
          { sync_status: "error", error_message: "Quota exceeded - paused for quota reset" },
          "user_id,year,week");
        await setSyncStatus(supabase, "gmail_sync_progress", userId, { sync_status: "paused", error_message: "Paused due to quota limits. Resume later." });
        return "quota_error";
      }

      await logDebugErr(supabase, "processWeek failure", "internal", { error }, `${nextWeek.year}-W${nextWeek.week}`, "Week processing", error?.message ?? String(error));
      await setPeriodStatus(
        supabase,
        "g_email_sync_progress",
        { user_id: userId, year: nextWeek.year, week: nextWeek.week, start_of_week: new Date(nextWeek.startDate + "T00:00:00.000Z").toISOString() },
        { sync_status: "error", error_message: error.message ?? "Unknown error" },
        "user_id,year,week"
      );
      await sendConsole(supabase, userId, runId, `❌ Week ${weekStr} failed: ${error.message ?? "Unknown error"} - will retry later`, "milestone", "gmail");
      await setSyncStatus(supabase, "gmail_sync_progress", userId, { sync_status: "paused", error_message: `Week ${weekStr} failed` });
      return "week_error";
    }
  }
}

async function processWeek(
  supabase: any,
  userId: string,
  year: number,
  week: number,
  startDate: string, // "YYYY-MM-DD"
  endDate: string,   // "YYYY-MM-DD"
  runId: string
) {
  const weekStr = `${year}-W${String(week).padStart(2, "0")}`;
  const accessToken = await getValidAccessToken(supabase, userId);
  if (!accessToken) throw new Error("No access token");

  if (syncStartTime && (Date.now() - syncStartTime) > FUNCTION_TIMEOUT_MS)
    throw new Error("[AUTO-RESTART] Function timeout reached during week processing");

  await setPeriodStatus(
    supabase,
    "g_email_sync_progress",
    { user_id: userId, year, week, start_of_week: new Date(startDate + "T00:00:00.000Z").toISOString() },
    { sync_status: "in_progress", started_at: new Date().toISOString() },
    "user_id,year,week"
  );
  
  // 1) List message IDs
  await sendConsole(supabase, userId, runId, `${weekStr}: Getting message IDs...`, "info", "gmail");
  const messageIds = await getAllMessageIdsForWeek(supabase, userId, accessToken, startDate, endDate);
  await sendConsole(supabase, userId, runId, `${weekStr}: Found ${messageIds.length} message IDs`, "milestone", "gmail");

  await setPeriodStatus(
    supabase, "g_email_sync_progress",
    { user_id: userId, year, week, start_of_week: new Date(startDate + "T00:00:00.000Z").toISOString() },
    { total_messages: messageIds.length },
    "user_id,year,week"
  );

  if (messageIds.length === 0) {
    await setPeriodStatus(
      supabase, "g_email_sync_progress",
      { user_id: userId, year, week, start_of_week: new Date(startDate + "T00:00:00.000Z").toISOString() },
      { sync_status: "completed", completed_at: new Date().toISOString(), messages_synced: 0, messages_matched: 0, bodies_fetched: 0 },
      "user_id,year,week"
    );
    await sendConsole(supabase, userId, runId, `${weekStr}: No messages found, marked complete`, "milestone", "gmail");
    return {};
  }

  // 2) Headers
  await sendConsole(supabase, userId, runId, `${weekStr}: Getting headers...`, "info", "gmail");
  if (syncStartTime && (Date.now() - syncStartTime) > FUNCTION_TIMEOUT_MS)
    throw new Error("[AUTO-RESTART] Function timeout reached before header fetching");

  const emailHeaders = await getHeaders(supabase, userId, accessToken, messageIds, `W${String(week).padStart(2, "0")}`, runId);
  await sendConsole(supabase, userId, runId, `${weekStr}: Retrieved ${emailHeaders.length} headers`, "milestone", "gmail");
  await setPeriodStatus(
    supabase, "g_email_sync_progress",
    { user_id: userId, year, week, start_of_week: new Date(startDate + "T00:00:00.000Z").toISOString() },
    { headers_fetched: emailHeaders.length },
    "user_id,year,week"
  );

  // 3) Save emails
  await sendConsole(supabase, userId, runId, `${weekStr}: Saving emails...`, "info", "gmail");
  await upsertBatch(supabase, "g_emails", emailHeaders.map(h => transformEmailForDB(h, userId)), "gmail_message_id,user_id", 100);
  await setPeriodStatus(
    supabase, "g_email_sync_progress",
    { user_id: userId, year, week, start_of_week: new Date(startDate + "T00:00:00.000Z").toISOString() },
    { messages_synced: emailHeaders.length },
    "user_id,year,week"
  );
  await sendConsole(supabase, userId, runId, `${weekStr}: Saved ${emailHeaders.length} emails to DB`, "milestone", "gmail");

  // 4) Matching
  await sendConsole(supabase, userId, runId, `${weekStr}: Running contact matching...`, "info", "gmail");
  const startIso = toStartIso(startDate);
  const endIso   = nextDayIso(endDate);
  await matchEmailsWeeklyGlobal(supabase, startIso, endIso);
  
  // Count matches based on newly saved headers with contact_ids
  const { data: matchedEmails } = await supabase
    .from("g_emails")
    .select("id")
    .eq("user_id", userId)
    .gte("received_at", startIso)
    .lt("received_at", endIso)
    .not("contact_ids", "is", null);
  const matchedCount = matchedEmails?.length || 0;

  await setPeriodStatus(
    supabase, "g_email_sync_progress",
    { user_id: userId, year, week, start_of_week: new Date(startDate + "T00:00:00.000Z").toISOString() },
    { messages_matched: matchedCount },
    "user_id,year,week"
  );
  await sendConsole(supabase, userId, runId, `${weekStr}: Matched ${matchedCount} emails`, "milestone", "gmail");

  if (syncStartTime && (Date.now() - syncStartTime) > FUNCTION_TIMEOUT_MS)
    throw new Error("[AUTO-RESTART] Function timeout reached after contact matching");


  // 6) Bodies
  await sendConsole(supabase, userId, runId, `${weekStr}: Getting bodies for matched emails...`, "info", "gmail");
  if (syncStartTime && (Date.now() - syncStartTime) > FUNCTION_TIMEOUT_MS)
    throw new Error("[AUTO-RESTART] Function timeout reached before body fetching");

  const bodiesCount = await getBodiesForWeek(supabase, userId, accessToken, startDate, endDate);
  await sendConsole(supabase, userId, runId, `${weekStr}: Downloaded ${bodiesCount} bodies`, "milestone", "gmail");
  await setPeriodStatus(
    supabase, "g_email_sync_progress",
    { user_id: userId, year, week, start_of_week: new Date(startDate + "T00:00:00.000Z").toISOString() },
    { bodies_fetched: bodiesCount },
    "user_id,year,week"
  );

  const now = new Date();
  const isCurrent = year === now.getFullYear() && week === getWeekNumber(now);
  return { isCurrent };
}

async function getAllMessageIdsForWeek(supabase: any, userId: string, accessToken: string, startDate: string, endDate: string) {
  const messageIds: string[] = [];
  let pageToken: string | undefined; let requestCount = 0;
  const query = `after:${ymdSlash(startDate)} before:${ymdSlash(endDate)} ${GMAIL_QUERY_FILTER_STRING}`;

  while (true) {
    if (await isPaused(supabase, userId)) return messageIds;
    requestCount++;

    const url =
      `https://www.googleapis.com/gmail/v1/users/me/messages` +
      `?q=${encodeURIComponent(query)}` +
      `&maxResults=${MESSAGE_ID_BATCH_SIZE}` +
      (pageToken ? `&pageToken=${pageToken}` : "") +
      `&fields=nextPageToken,messages/id`;

    const resp = await apiCallWithOAuth(
      url, accessToken, async () => await getValidAccessToken(supabase, userId),
      { max429: MAX_429_WAIT_MS, maxQuota: MAX_QUOTA_WAIT_MS }
    );
    const data = await resp.json();

    const stepInfo = `GET messages list (request ${requestCount})`;
    const errorCode = !resp.ok ? (data?.error?.code || data?.error?.message) : undefined;
    await logDebugErr(supabase, stepInfo, url, data, `${startDate} to ${endDate}`, stepInfo, errorCode);

    if (!resp.ok) throw new Error(`Gmail API error: ${data?.error?.message || resp.statusText}`);
    if (data?.messages?.length) messageIds.push(...data.messages.map((m: any) => m.id));

    if (!data?.nextPageToken) break;
    pageToken = data.nextPageToken; await sleep(LIST_PAGE_DELAY_MS);
  }
  return messageIds;
}

async function getHeaders(
  supabase: any, userId: string, accessToken: string, messageIds: string[], timeLabel: string, runId: string
): Promise<any[]> {
  const headers: any[] = [];
  let emptyBatchCount = 0;
  const MAX_HEADERS_IN_MEMORY = 1000;

  for (let i = 0; i < messageIds.length; i += HEADER_BATCH_SIZE) {
    if (await isPaused(supabase, userId)) return headers;

    const batch = messageIds.slice(i, i + HEADER_BATCH_SIZE);
    const batchNum = Math.floor(i / HEADER_BATCH_SIZE) + 1;

    let retryCount = 0; const maxRetries = 2; let batchHeaders: any[] = [];

    while (retryCount <= maxRetries) {
      try {
        const headerPromises = batch.map((messageId,i) =>
          sleep(i* HEADER_STAGGER_MS).then(async () => {
          const url = `https://www.googleapis.com/gmail/v1/users/me/messages/${messageId}` +
            `?format=metadata&metadataHeaders=From&metadataHeaders=To&metadataHeaders=Cc` +
            `&metadataHeaders=Bcc&metadataHeaders=Subject&metadataHeaders=Date`+
            `&fields=id,internalDate,payload/headers`;

          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Header fetch timeout")), HEADER_TIMEOUT_MS)
          );

          const fetchPromise = (async () => {
            const resp = await apiCallWithOAuth(
              url, accessToken, async () => await getValidAccessToken(supabase, userId),
              { max429: MAX_429_WAIT_MS, maxQuota: MAX_QUOTA_WAIT_MS }
            );
            const data = await resp.json();
            if (!resp.ok || !data?.payload) return null;
            return data;
          })();

          return await Promise.race([fetchPromise, timeoutPromise]).catch(() => null);
        })
      );  

        const results = await Promise.all(headerPromises);
        batchHeaders = results.filter((r) => r !== null) as any[];
        break;
      } catch {
        retryCount++;
        if (retryCount <= maxRetries)
          log("debug", `Headers batch ${batchNum}: timeout - retrying ${retryCount}/${maxRetries}`);
        else
          log("debug", `Headers batch ${batchNum}: failed after retries - continuing`);
      }
    }

    if (batchHeaders.length === 0) {
      emptyBatchCount++;
      if (emptyBatchCount >= MAX_EMPTY_RESPONSES) {
        await sendConsole(supabase, userId, runId, `WARNING: ${MAX_EMPTY_RESPONSES} empty header batches, stopping header fetch`, "milestone", "gmail");
        break;
      }
    } else {
      emptyBatchCount = 0;
      headers.push(...batchHeaders);

      if (headers.length >= MAX_HEADERS_IN_MEMORY) {
        const toSave = headers.length;
        const remaining = messageIds.length - (i + HEADER_BATCH_SIZE);
        await sendConsole(supabase, userId, runId, `${timeLabel}: Saving ${toSave} headers to database...`, "info", "gmail");
        await upsertBatch(supabase, "g_emails", headers.map(h => transformEmailForDB(h, userId)), "gmail_message_id,user_id", 100);
        await sendConsole(supabase, userId, runId, `${timeLabel}: Saved ${toSave} headers, ${remaining} remaining`, "info", "gmail");
        headers.length = 0;
      }
    }

    if (i + HEADER_BATCH_SIZE < messageIds.length) await sleep(RATE_LIMIT_DELAY_MS);
  }

  return headers;
}

// ---------- Data transforms ----------
function extractEmailAddress(emailString: string) {
  const match = emailString?.match?.(/<([^>]+)>/);
  return (match ? match[1] : emailString || "").toLowerCase();
}
function parseEmailList(emailString: string, maxEmails = 50) {
  if (!emailString) return [];
  const emails = emailString.split(",").map((e) => extractEmailAddress(e.trim())).filter(Boolean);
  return emails.length > maxEmails ? emails.slice(0, maxEmails) : emails;
}
function transformEmailForDB(message: any, userId: string) {
  const headers = message?.payload?.headers || [];
  const getHeader = (name: string) => headers.find((h: any) => h.name?.toLowerCase?.() === name.toLowerCase())?.value || "";
  const dateStr = getHeader("Date");
  const receivedAt = Number.isFinite(+new Date(dateStr))
    ? new Date(dateStr).toISOString()
    : new Date(parseInt(message.internalDate)).toISOString();
  const fromEmail = extractEmailAddress(getHeader("From"));
  return {
    user_id: userId,
    gmail_message_id: message.id,
    thread_id: message.threadId,
    subject: getHeader("Subject"),
    from_email: fromEmail,
    to_emails: parseEmailList(getHeader("To")),
    cc_emails: parseEmailList(getHeader("Cc")),
    bcc_emails: parseEmailList(getHeader("Bcc")),
    received_at: receivedAt,
    snippet: message.snippet || "",
    body_fetched: false
  };
}

function extractEmailBody(payload: any) {
  const result = { text: "", html: "", hasAttachments: false };
  if (payload?.body?.data) {
    const decoded = decodeBase64(payload.body.data);
    if (payload.mimeType === "text/html") result.html = decoded; else result.text = decoded;
    return result;
  }
  if (payload?.parts) extractBodyParts(payload.parts, result);
  return result;
}
function extractBodyParts(parts: any[], result: any) {
  for (const part of parts) {
    if (part?.mimeType === "text/plain" && part.body?.data && !result.text) result.text = decodeBase64(part.body.data);
    else if (part?.mimeType === "text/html" && part.body?.data && !result.html) result.html = decodeBase64(part.body.data);
    else if (part?.mimeType?.startsWith?.("multipart/") && part.parts) extractBodyParts(part.parts, result);
    else if (part?.filename || part?.body?.attachmentId) result.hasAttachments = true;
  }
}
function decodeBase64(data: string) {
  try { return atob(data.replace(/-/g, "+").replace(/_/g, "/")); } catch { return ""; }
}

// ---------- Bodies / Matching ----------
async function getBodiesForWeek(supabase: any, userId: string, accessToken: string, startDate: string, endDate: string) {
  const { data: matchedEmails } = await supabase
    .from("g_emails")
    .select("gmail_message_id")
    .eq("user_id", userId)
    .gte("received_at", startDate)
    .lt("received_at", endDate)
    .not("contact_ids", "is", null)
    .is("body_text", null);

  if (!matchedEmails?.length) return 0;

  let total = 0;
  for (let i = 0; i < matchedEmails.length; i += BODY_BATCH_SIZE) {
    if (await isPaused(supabase, userId)) return total;

    const batch = matchedEmails.slice(i, i + BODY_BATCH_SIZE);
    const bodyPromises = batch.map(async (email: any) => {
      const url = `https://www.googleapis.com/gmail/v1/users/me/messages/${email.gmail_message_id}?format=full`;
      try {
        const resp = await apiCallWithOAuth(
          url, accessToken, async () => await getValidAccessToken(supabase, userId),
          { max429: MAX_429_WAIT_MS, maxQuota: MAX_QUOTA_WAIT_MS }
        );
        const data = await resp.json();
        if (!resp.ok || !data?.payload) return false;

        const body = extractEmailBody(data.payload);
        if (body.text || body.html) {
          await supabase.from("g_emails").update({
            body_text: body.text,
            body_html: body.html,
            has_attachments: body.hasAttachments,
            body_fetched: true
          }).eq("gmail_message_id", email.gmail_message_id).eq("user_id", userId);
          return true;
        }
        return false;
      } catch { return false; }
    });

    const results = await Promise.all(bodyPromises);
    total += results.filter(Boolean).length;

    if (i + BODY_BATCH_SIZE < matchedEmails.length) await sleep(RATE_LIMIT_DELAY_MS);
  }
  return total;
}

async function getNextIncompleteWeek(supabase: any, userId: string) {
  const { data, error } = await supabase
    .rpc('get_oldest_incomplete_week', {user_id_param: userId, start_from: STARTS_FROM })
    .maybeSingle();              // returns 0 or 1 row

  if (error || !data) return null;
  return {
    year: data.year,
    week: data.week,
    startDate: data.start_date,  // "YYYY-MM-DD" (Monday)
    endDate: data.end_date       // "YYYY-MM-DD" (Sunday, inclusive)
  };
}


function getWeekNumber(date: Date) {
  const d = new Date(date); d.setHours(0,0,0,0);
  d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
  const week1 = new Date(d.getFullYear(), 0, 4);
  return 1 + Math.round(((+d - +week1) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}

async function isPaused(supabase: any, userId: string) {
  const { data } = await supabase
    .from("gmail_sync_progress")
    .select("sync_status")          // only the one column we need
    .eq("user_id", userId)
    .maybeSingle();
  return data?.sync_status === "paused";
}

// ---------- Ad-hoc tool ----------
async function checkMissingBodies(supabase: any, userId: string) {
  const { data: missing } = await supabase
    .from("g_emails").select("id, contact_ids, body_text, body_html")
    .not("contact_ids", "is", null).is("body_text", null).is("body_html", null);

  const actual = (missing ?? []).filter((e: any) => Array.isArray(e.contact_ids) && e.contact_ids.length > 0);
  const { data: allMatched } = await supabase.from("g_emails").select("id", { count: "exact" }).not("contact_ids", "is", null);

  return json({
    ok: true,
    missing_count: actual.length,
    total_matched: allMatched?.length || 0,
    sample: actual[0] ?? null
  });
}

// One-time function to fetch bodies for specific missing emails
async function processMissingBodies(supabase, userId, runId, missingEmails) {
  const accessToken = await getValidAccessToken(supabase, userId);
  if (!accessToken) {
    await sendConsole(supabase, userId, runId, "❌ No Gmail access token", "milestone", "gmail");
    return;
  }

  await sendConsole(supabase, userId, runId, `📥 Fetching bodies for ${missingEmails.length} emails...`, "milestone", "gmail");

  // Process in batches like the normal sync
  for (let i = 0; i < missingEmails.length; i += BODY_BATCH_SIZE) {
    const batch = missingEmails.slice(i, i + BODY_BATCH_SIZE);
    const batchNum = Math.floor(i / BODY_BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(missingEmails.length / BODY_BATCH_SIZE);

    await sendConsole(supabase, userId, runId, `📦 Processing body batch ${batchNum}/${totalBatches} (${batch.length} emails)`, "milestone", "gmail");

    try {
      // Fetch full emails for this batch using existing pattern
      const bodyPromises = batch.map(async (email) => {
        const url = `https://www.googleapis.com/gmail/v1/users/me/messages/${email.gmail_message_id}` +
          `?format=full&fields=id,payload(body/data,parts(mimeType,body/data))`;
        try {
          const resp = await apiCallWithOAuth(url, accessToken, async () => await getValidAccessToken(supabase, userId));
          const data = await resp.json();
          if (!resp.ok || !data?.payload) {
            return false;
          }
          const bodyData = extractEmailBody(data.payload);
          if (bodyData.text || bodyData.html) {
            await supabase.from("g_emails").update({
              body_text: bodyData.text,
              body_html: bodyData.html,
              has_attachments: bodyData.hasAttachments,
              body_fetched: true
            }).eq("id", email.id);
            return true;
          }
        } catch {
          return false;
        }
        return false;
      });
      
      const results = await Promise.all(bodyPromises);
      const updated = results.filter(Boolean).length;

      await sendConsole(supabase, userId, runId, `✅ Updated ${updated}/${batch.length} bodies in batch ${batchNum}`, "milestone", "gmail");

      // Small delay between batches
      if (i + BODY_BATCH_SIZE < missingEmails.length) {
        await sleep(RATE_LIMIT_DELAY_MS);
      }
      
    } catch (error) {
      await sendConsole(supabase, userId, runId, `❌ Body batch ${batchNum} failed: ${error.message}`, "milestone", "gmail");
    }
  }

  await sendConsole(supabase, userId, runId, `🎯 Missing bodies processing complete!`, "milestone", "gmail");
}

function toStartIso(d: string) { return d + "T00:00:00Z"; }
function nextDayIso(d: string) { return new Date(Date.parse(d + "T00:00:00Z") + 86400000).toISOString(); }
function ymdSlash(d: string) { return d.replaceAll("-", "/"); }
