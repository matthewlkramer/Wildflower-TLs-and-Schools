// supabase/functions/gcal-sync/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import { setSyncStatus, setPeriodStatus } from "@shared/progress.ts";
import { json, sleep } from "@shared/http.ts";
import { log, sendConsole, logDebugErr } from "@shared/log.ts";
import { getValidAccessToken, getValidAccessTokenOrThrow, exchangeCode } from "@shared/google-auth.ts";
import { apiCallWithOAuth } from "@shared/api.ts";
import { upsertBatch } from "@shared/upsert.ts";
import { matchEventsGlobal } from "@shared/matching.ts";
import { preflight } from "@shared/cors.ts";

// ---------- TUNING ----------
const CHUNKS = {
  EVENTS_PER_PAGE: 100,  // Reduced from 250
  WRITE_BUFFER: 25,      // Reduced from 100
};
const FUNCTION_TIMEOUT_MS = 8 * 60 * 1000;
const LIST_PAGE_DELAY_MS = 500;
const CURRENT_REFRESH_MS = +(Deno.env.get("CAL_CURRENT_REFRESH_MS") ?? 15 * 60 * 1000); // 15m
// const PREV_MONTH_GRACE_DAYS = +(Deno.env.get("CAL_PREV_MONTH_GRACE_DAYS") ?? 3);

const RUN_ID_CACHE = new Map<string, string>();

const OAUTH_SCOPES = "https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/calendar.readonly";

// ---------- TYPES ----------
interface CalendarEvent {
  id: string;
  summary?: string;
  description?: string;
  start?: { dateTime?: string; date?: string; timeZone?: string };
  end?:   { dateTime?: string; date?: string; timeZone?: string };
  attendees?: Array<{ email?: string; displayName?: string; responseStatus?: string }>;
  organizer?: { email?: string; displayName?: string };
  location?: string;
  status?: string;
  created?: string;
  updated?: string;
}

interface TokensRow {
  user_id: string;
  access_token: string;
  refresh_token: string;
  expires_at: string;
  updated_at?: string;
}

interface CalendarProgressRow {
  user_id: string;
  total_events?: number | null;
  processed_events?: number | null;
  last_sync_token?: string | null;
  sync_status?: "not_started" | "running" | "paused" | "completed" | "error" | null;
  current_batch_start?: number | null;
  error_message?: string | null;
  started_at?: string | null;
  completed_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

// ---------- SERVER ----------
serve(async (req) => {
  const pf = preflight(req);
  if (pf) return pf;
  if (req.method === "GET") return json({ ok: true, function: "gcal-sync", now: ts() });

  try {
    const body = await req.json().catch(() => ({}));
    const { action, code, redirect_uri: redirectUri } = body ?? {};
    if (!action) return json({ error: "Missing action" }, 400);

    // Auth user from JWT
    const authHeader = req.headers.get("Authorization") ?? "";
    const supabaseAuth = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: authData } = await supabaseAuth.auth.getUser();
    if (!authData?.user) return json({ error: "Unauthorized" }, 401);
    const userId = authData.user.id;

    // Service role client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    console.log(`Calendar-sync: Processing action "${action}" for user ${userId}`);
    
    switch (action) {
      case "get_auth_url": return await getAuthUrl(redirectUri);
      case "exchange_code": return await handleExchangeCode(supabase, code, userId, redirectUri);
      case "get_connection_status": return await getConnectionStatus(supabase, userId);
      case "start_sync": return await startSync(supabase, userId);
      case "pause_sync":
        await setSyncStatus(supabase, userId, { sync_status: "paused", error_message: null});
        await sendConsole(supabase, userId, RUN_ID_CACHE.get(userId) ?? null, "Sync paused", "milestone", "calendar");
        return json({ ok: true, message: "Sync paused" });
      default:
        return json({ error: "Invalid action" }, 400);
    }
  } catch (error) {
    log("error","Calendar sync error:", error);
    return json({ error: error instanceof Error ? error.message : "Unknown error" }, 500);
  }
});

// ---------- ACTIONS ----------
async function getAuthUrl(redirectUri?: string) {
  const clientId = Deno.env.get("GOOGLE_CLIENT_ID");
  if (!clientId) return json({ error: "Missing Google Client ID" }, 500);
  const finalRedirect = encodeURIComponent(redirectUri || Deno.env.get("GOOGLE_REDIRECT_URI") || "http://wfcrm.vercel.app");
  const url =
    `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}` +
    `&redirect_uri=${finalRedirect}` +
    `&scope=${encodeURIComponent(OAUTH_SCOPES)}` +
    `&response_type=code&access_type=offline&prompt=consent&include_granted_scopes=true` +
    `&state=gcal-sync`;
  return json({ auth_url: url, scopes_requested: OAUTH_SCOPES });
}

async function handleExchangeCode(supabase: SupabaseClient, code: string, userId: string, redirectUri?: string) {
  try {
    const finalRedirect = redirectUri || Deno.env.get("GOOGLE_REDIRECT_URI") || "https://yourapp.example.com/settings";
    const result = await exchangeCode(supabase, code, userId, finalRedirect);
    return json(result);
  } catch (error) {
    log("error", "Token exchange failed:", error);
    return json({ error: error.message || "Failed to exchange code" }, 400);
  }
}

async function getConnectionStatus(supabase: SupabaseClient, userId: string) {
  const token = await getValidAccessToken(supabase, userId);
  if (!token) return json({ connected: false, needsReauth: true, reason: "No token found" });

  const res = await fetch("https://www.googleapis.com/calendar/v3/users/me/calendarList?minAccessRole=owner&showDeleted=false", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.ok) return json({ connected: true, needsReauth: false });
  
  if (res.status === 403) {
    const errorBody = await res.text();
    if (errorBody.includes("insufficientPermissions") || errorBody.includes("ACCESS_TOKEN_SCOPE_INSUFFICIENT")) {
      return json({ 
        connected: false, 
        needsReauth: true, 
        reason: "Token missing Calendar scope. Please re-authenticate through Calendar settings.",
        scopeIssue: true 
      });
    }
  }
  
  return json({ connected: false, needsReauth: true, reason: "Authentication failed" });
}

// ---------- SYNC ACTIONS ----------
async function startSync(supabase: SupabaseClient, userId: string) {
  try {
    const { data: existing } = await supabase
      .from("calendar_sync_progress")
      .select("sync_status, started_at")
      .eq("user_id", userId)
      .maybeSingle();

    if (existing?.sync_status === "running") {
      const secs = existing.started_at ? Math.round((Date.now() - new Date(existing.started_at).getTime())/1000) : "?";
      await sendConsole(supabase, userId, RUN_ID_CACHE.get(userId) ?? null, `⚠️ Sync already running for ${secs}s - ignoring duplicate`, "milestone", "calendar");
      return json({ ok: true, message: "Sync already running" });
    }

    const runId = crypto.randomUUID();
    RUN_ID_CACHE.set(userId, runId);
    await setSyncStatus(supabase, userId, {sync_status: "running", started_at: ts(), current_run_id: runId, error_message: null});

    // respond immediately
    const response = json({ ok: true, message: "Sync started", run_id: runId, started_at: ts() });

    processCalendarSync(supabase, userId, runId)
      .then(async (reason) => {
        if (reason === "completed") await sendConsole(supabase, userId, runId, "✅ Calendar sync completed", "milestone", "calendar");
      })
      .catch(async (e) => {
        await sendConsole(supabase, userId, runId, `❌ Calendar sync failed: ${e.message}`, "milestone", "calendar");
        await setSyncStatus(supabase, userId, {sync_status: "error", error_message: e.message });
      });

    await sendConsole(supabase, userId, runId, "🚀 Starting Calendar sync...", "milestone", "calendar");
    return response;
  } catch (error: any) {
    await setSyncStatus(supabase, userId, { sync_status: "error", error_message: error.message });
    await sendConsole(supabase, userId, RUN_ID_CACHE.get(userId) ?? null, `❌ Error starting sync: ${error.message}`, "milestone", "calendar");
    return json({ error: error.message }, 500);
  }

}

async function processCalendarSync(supabase: SupabaseClient, userId: string, runId: string) {
  const start = Date.now();
  let reason: "completed" | "paused" | "timeout" | "error" = "completed";

  await sendConsole(supabase, userId, runId, "📊 Checking calendar status...", "milestone", "calendar");

  while (true) {
    const elapsed = Date.now() - start;
    if (elapsed > FUNCTION_TIMEOUT_MS) {
      await sendConsole(supabase, userId, runId, `⏰ Timeout ~${Math.round(elapsed/1000)}s — auto-pausing`, "milestone", "calendar");
      await setSyncStatus(supabase, userId, { sync_status: "paused", error_message: "Function timeout - resume to continue" });
      reason = "timeout";
      break;
    }

    const progress = await fetchProgressRow(supabase, userId);
    if (progress?.sync_status === "paused") {
      await sendConsole(supabase, userId, runId, "⏸️ Sync paused", "milestone", "calendar");
      reason = "paused";
      break;
    }

    const next = await getNextCalendarWorkItem(supabase, userId);
    if (!next) {
      await sendConsole(supabase, userId, runId, "✅ All months synced; nothing to do", "milestone", "calendar");
      await setSyncStatus(supabase, userId, { sync_status: "completed", completed_at: ts()});
      reason = "completed";
      break;
    }

    const token = await getValidAccessTokenOrThrow(supabase, userId);
    await sendConsole(supabase, userId, runId, `📅 Syncing ${next.year}-${String(next.month).padStart(2,"0")}`, "milestone", "calendar");
    const result = await syncSingleMonth(supabase, userId, token, next.calendar, next.year, next.month);
    if (result.status === "error") {
      await sendConsole(supabase, userId, runId, `❌ Month ${next.year}-${next.month} failed: ${result.error}`, "milestone", "calendar");
      await setSyncStatus(supabase,userId, { sync_status: "paused", error_message: `Month ${next.year}-${next.month} failed` });
      reason = "paused";
      break;
    }
  }

  return reason;
}

async function getNextCalendarWorkItem(
  supabase: SupabaseClient,
  userId: string
): Promise<null | { year: number; month: number; calendar: any }> {
  const token = await getValidAccessToken(supabase, userId);
  if (!token) return null;
  const calendar = await getPrimaryCalendar(supabase, userId, token);

  const now = new Date();
  const cy  = now.getFullYear();
  const cm  = now.getMonth() + 1;
  const day = now.getDate();

  // 1) Oldest incomplete (error/in_progress) has priority
  const { data: inc } = await supabase
    .from("g_event_sync_progress")
    .select("year, month, sync_status")
    .eq("user_id", userId)
    .eq("calendar_id", calendar.id)
    .in("sync_status", ["error", "in_progress"])
    .order("year", { ascending: true })
    .order("month", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (inc) return { year: inc.year, month: inc.month, calendar };

  // Helper to decide if a (y,m) needs refresh based on updated_at + CURRENT_REFRESH_MS
  async function needsRefresh(y: number, m: number): Promise<boolean> {
    const { data } = await supabase
      .from("g_event_sync_progress")
      .select("updated_at, sync_status")
      .eq("user_id", userId)
      .eq("calendar_id", calendar.id)
      .eq("year", y)
      .eq("month", m)
      .maybeSingle();
    if (!data) return true;                              // never synced
    if (data.sync_status !== "partial") return false;    // only re-run current month (partial)
    const last = new Date(data.updated_at ?? 0).getTime();
    return (Date.now() - last) > CURRENT_REFRESH_MS;
  }

  // 2) Advance month-by-month until caught up to current
  const { data: latest } = await supabase
    .from("g_event_sync_progress")
    .select("year, month")
    .eq("user_id", userId)
    .eq("calendar_id", calendar.id)
    .in("sync_status", ["completed", "partial"])
    .order("year", { ascending: false })
    .order("month", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (latest) {
    let y = latest.year, m = latest.month + 1;
    if (m === 13) { m = 1; y++; }
    if (y < cy || (y === cy && m <= cm)) {
      // Still have historical months to fill
      return { year: y, month: m, calendar };
    }
  } else {
    // No rows: start from earliest event or current month
    const { data: earliestEvent } = await supabase
      .from("g_events")
      .select("start_time")
      .eq("google_calendar_id", calendar.id)
      .order("start_time", { ascending: true })
      .limit(1)
      .maybeSingle();
    if (earliestEvent?.start_time) {
      const d = new Date(earliestEvent.start_time);
      return { year: d.getFullYear(), month: d.getMonth() + 1, calendar };
    }
    return { year: cy, month: cm, calendar };
  }

  // 3) We’re caught up historically. Consider a grace refresh for the previous month
  //if (day <= PREV_MONTH_GRACE_DAYS) {
  //  const prevY = cm === 1 ? cy - 1 : cy;
  //  const prevM = cm === 1 ? 12    : cm - 1;
    // Only refresh if it is still 'partial' AND stale — but prior month should be 'completed'.
    // If you want to allow a light re-run anyway, drop the sync_status check in needsRefresh().
  //  const prevNeeds = await needsRefresh(prevY, prevM);
  //  if (prevNeeds) return { year: prevY, month: prevM, calendar };
  //}

  // 4) Finally, re-run the current month when stale (it’s stored as 'partial')
  if (await needsRefresh(cy, cm)) {
    return { year: cy, month: cm, calendar };
  }

  // Nothing to do right now
  return null;
}


// ---------- SYNC IMPLEMENTATION ----------
async function syncSingleMonth(
  supabase: SupabaseClient, 
  userId: string, 
  accessToken: string, 
  primaryCalendar: any, 
  year: number, 
  month: number
): Promise<{ status: 'completed' | 'error', eventsSynced: number, error?: string }> {
  if (!primaryCalendar?.id) return { status: "error", eventsSynced: 0, error: "No calendar provided" };
    
  const keys = { user_id: userId, calendar_id: primaryCalendar.id, year, month };
  await setPeriodStatus(
    supabase,
    "g_event_sync_progress",
    keys,
    { sync_status: "in_progress", started_at: ts(), events_synced: 0, updated_at: ts() },
    "user_id,calendar_id,year,month"
  );

  const timeMin = new Date(year, month - 1, 1).toISOString();
  const timeMax = new Date(year, month, 0, 23, 59, 59, 999).toISOString();

  let pageToken: string | undefined;
  let eventsSynced = 0;
  let writeBuffer: any[] = [];

  const flush = async () => {
    if (!writeBuffer.length) return;
    await upsertBatch(supabase,"g_events", writeBuffer,"google_calendar_id,google_event_id", CHUNKS.WRITE_BUFFER);
    eventsSynced += writeBuffer.length;
    writeBuffer = []
    await setPeriodStatus(supabase, "g_event_sync_progress", keys, { events_synced: eventsSynced, updated_at: ts() }, "user_id,calendar_id,year,month");
  };

  try {
    do {
      const url = new URL(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(primaryCalendar.id)}/events`);
      url.searchParams.set("maxResults", CHUNKS.EVENTS_PER_PAGE.toString());
      url.searchParams.set("singleEvents", "true");
      url.searchParams.set("orderBy", "startTime");
      url.searchParams.set("timeMin", timeMin);
      url.searchParams.set("timeMax", timeMax);
      url.searchParams.set("showDeleted", "false");
      if (pageToken) url.searchParams.set("pageToken", pageToken);

      const res = await apiCallWithOAuth(url.toString(), accessToken, async () => await getValidAccessToken(supabase, userId));
      if (!res.ok) throw new Error(`Failed to fetch events: ${res.status}`);
      const { items = [], nextPageToken } = await res.json();
      
      for (const ev of items as CalendarEvent[]) {
        writeBuffer.push(transformEventForDB(ev, primaryCalendar.id));
        if (writeBuffer.length >= CHUNKS.WRITE_BUFFER) await flush();
      }

      pageToken = nextPageToken;
      if (pageToken) await sleep(LIST_PAGE_DELAY_MS);
    } while (pageToken);

    await flush();

    // Mark month as completed
    const now = new Date();
    const isCurrent = year === now.getFullYear() && month === (now.getMonth() + 1);

    await setPeriodStatus(supabase, "g_event_sync_progress", keys, 
      { sync_status: isCurrent ? "partial" : "completed", completed_at: ts(), events_synced: eventsSynced, updated_at: ts() },
      "user_id,calendar_id,year,month");

    // Run contact matching for this month's events
    if (eventsSynced > 0) {
      try {
        const matched = await matchEventsGlobal(supabase, timeMin, timeMax, primaryCalendar.id);
        await sendConsole(supabase, userId, RUN_ID_CACHE.get(userId) ?? null, `🔗 Contact matching updated ${matched} for ${year}-${String(month).padStart(2,"0")}`, "milestone", "calendar");
      } catch (e: any) {
        await sendConsole(supabase, userId, RUN_ID_CACHE.get(userId) ?? null, `⚠️ Matching error ${year}-${String(month).padStart(2,"0")}: ${e.message}`, "milestone", "calendar");
      }
    }
    return { status: 'completed', eventsSynced };
  } catch (e: any) {
    await setPeriodStatus(supabase, "g_event_sync_progress", keys, { sync_status: "error", error_message: e.message, updated_at: ts() }, "user_id,calendar_id,year,month")
    return { status: 'error', eventsSynced: 0, error: e.message };
  }
}

async function fetchProgressRow(supabase: SupabaseClient, userId: string): Promise<CalendarProgressRow | null> {
  const { data } = await supabase
    .from("calendar_sync_progress")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle<CalendarProgressRow>();
  return data ?? null;
}

// set sync status
async function getPrimaryCalendar(supabase: SupabaseClient, userId: string, accessToken: string) {
  const calListUrl = "https://www.googleapis.com/calendar/v3/users/me/calendarList?minAccessRole=owner&showDeleted=false";
  const calListRes = await apiCallWithOAuth(calListUrl, accessToken, async () => (await getValidAccessToken(supabase, userId)));

  if (!calListRes.ok) {
    const body = await calListRes.text();
    if (calListRes.status === 403 && (body.includes("insufficientPermissions") || body.includes("ACCESS_TOKEN_SCOPE_INSUFFICIENT"))) {
      throw new Error("Authentication has insufficient scopes. Please disconnect and reconnect with Calendar permissions.");
    }
    throw new Error(`Failed to fetch calendar list: ${calListRes.status} ${calListRes.statusText} - ${body}`);
  }
  
  const calList = await calListRes.json();
  const primaryCalendar = calList.items?.find((cal: any) => cal.primary) || calList.items?.[0];
  if (!primaryCalendar) throw new Error("No calendar found");
  return primaryCalendar;
}

// ---------- HELPER FUNCTIONS ----------
function transformEventForDB(event: CalendarEvent, calendarId: string) {
  const start = event.start?.dateTime || event.start?.date;
  const end = event.end?.dateTime || event.end?.date;
  const attendees = event.attendees?.map(a => a.email).filter(Boolean) || [];
  const isAllDay = !event.start?.dateTime;

  return {
    google_event_id: event.id,
    google_calendar_id: calendarId,
    title: event.summary || "Untitled Event",
    description: event.description || null,
    start_time: start ? new Date(start).toISOString() : null,
    end_time: end ? new Date(end).toISOString() : null,
    is_all_day: isAllDay,
    location: event.location || null,
    attendees,
    organizer_email: event.organizer?.email || null,
    status: event.status || 'confirmed',
    sync_source: 'google',
    last_synced_at: new Date().toISOString(),
    is_donor_meeting: false, 
  };
}

// ---------- PROGRESS & TOKEN HELPERS ----------
function ts() {
  return new Date().toISOString();
}