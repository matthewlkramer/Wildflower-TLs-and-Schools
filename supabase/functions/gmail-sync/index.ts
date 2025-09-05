// Minimal Supabase Edge Function for Gmail OAuth + status wiring
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { json, ts, sleep } from "@shared/http.ts";
import { preflight } from "@shared/cors.ts";
import { sendConsole } from "@shared/log.ts";
import { exchangeCode, getValidAccessToken, getValidAccessTokenOrThrow } from "@shared/google-auth.ts";
import { setSyncStatus, setPeriodStatus } from "@shared/progress.ts";

const GMAIL_SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/drive.readonly"
].join(' ');

serve(async (req) => {
  const pf = preflight(req);
  if (pf) return pf;
  if (req.method === 'GET') return json({ ok: true, function: 'gmail-sync', now: ts() });

  try {
    const body = await req.json().catch(() => ({}));
    const { action, code, redirect_uri, redirectUri, suppress_match } = body || {};
    const finalRedirect = redirect_uri || redirectUri || Deno.env.get('GOOGLE_REDIRECT_URI') || '';

    const authHeader = req.headers.get('Authorization') ?? '';
    if (!authHeader) return json({ error: 'Missing Authorization header' }, 401);
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseAnon = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const supabaseAuth = createClient(supabaseUrl, supabaseAnon, { global: { headers: { Authorization: authHeader } } });
    const { data: authData, error: authErr } = await supabaseAuth.auth.getUser();
    if (authErr || !authData?.user) return json({ error: 'Unauthorized' }, 401);
    const userId = authData.user.id;

    const serviceRole = Deno.env.get('SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, serviceRole);

    // Address helpers (no matching here; server-side functions perform matching)
    const extractEmail = (s?: string): string | null => {
      if (!s) return null;
      const m = s.match(/<([^>]+)>/);
      const raw = (m ? m[1] : s).trim().toLowerCase();
      // basic cleanup of name parts
      return raw.replace(/^mailto:/, '').replace(/^"|"$/g, '');
    };
    const splitAddresses = (v?: string): string[] => {
      if (!v) return [];
      return v.split(',').map(a => extractEmail(a) || '').filter(Boolean);
    };
    // No matching in this function; matching is handled by DB routines

    switch (action) {
      case 'get_synced_through': {
        // Return the max(sent_at) for this user's emails as the synced-through timestamp
        const { data: rows } = await supabase
          .from('g_emails')
          .select('sent_at')
          .eq('user_id', userId)
          .order('sent_at', { ascending: false })
          .limit(1);
        const iso = rows?.[0]?.sent_at ?? null;
        return json({ gmail_synced_through: iso });
      }
      case 'get_auth_url': {
        const clientId = Deno.env.get('GOOGLE_CLIENT_ID');
        if (!clientId) return json({ error: 'Missing Google Client ID' }, 500);
        const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}` +
          `&redirect_uri=${encodeURIComponent(finalRedirect)}` +
          `&scope=${encodeURIComponent(GMAIL_SCOPES)}` +
          `&response_type=code&access_type=offline&prompt=consent&include_granted_scopes=true`;
        return json({ auth_url: url });
      }
      case 'exchange_code': {
        await exchangeCode(supabase, code, userId, finalRedirect);
        await sendConsole(supabase, userId, null, 'Google tokens saved', 'milestone', 'gmail');
        return json({ ok: true });
      }
      case 'get_connection_status': {
        const tok = await getValidAccessToken(supabase, userId);
        return json({ connected: !!tok });
      }
      case 'start_sync': {
        // Respect per-user sync start date (default: first login / now)
        const { data: settings } = await supabase.from('google_sync_settings').select('sync_start_date').eq('user_id', userId).single();
        const START = settings?.sync_start_date ? new Date(settings.sync_start_date) : new Date();
        const now = new Date();
        const accessToken = await getValidAccessTokenOrThrow(supabase, userId);

        const isoWeek = (d: Date) => {
          const tmp = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
          const dayNum = tmp.getUTCDay() || 7;
          tmp.setUTCDate(tmp.getUTCDate() + 4 - dayNum);
          const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
          const week = Math.ceil((((tmp.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
          return { year: tmp.getUTCFullYear(), week };
        };
        const weekStart = (year: number, week: number) => {
          const simple = new Date(Date.UTC(year, 0, 1 + (week - 1) * 7));
          const dow = simple.getUTCDay();
          const ISOweekStart = new Date(simple);
          if (dow <= 4) ISOweekStart.setUTCDate(simple.getUTCDate() - simple.getUTCDay() + 1);
          else ISOweekStart.setUTCDate(simple.getUTCDate() + 8 - simple.getUTCDay());
          return ISOweekStart;
        };
        const fmt = (d: Date) => `${d.getUTCFullYear()}/${String(d.getUTCMonth() + 1).padStart(2, '0')}/${String(d.getUTCDate()).padStart(2, '0')}`;

        const { data: prog } = await supabase
          .from('g_email_sync_progress')
          .select('year, week, sync_status')
          .eq('user_id', userId)
          .order('year', { ascending: true })
          .order('week', { ascending: true });
        const completed = new Set<string>();
        for (const p of (prog || [])) if (p.sync_status === 'completed') completed.add(`${p.year}-${p.week}`);
        let cur = new Date(START);
        let target: { year: number; week: number } | null = null;
        let guard = 0;
        while (cur <= now && guard < 4000) {
          guard++;
          const iw = isoWeek(cur);
          const key = `${iw.year}-${iw.week}`;
          if (!completed.has(key)) { target = iw; break; }
          cur.setUTCDate(cur.getUTCDate() + 7);
        }
        if (!target) {
          return json({ ok: true, message: 'No pending weeks' });
        }
        const { year, week } = target;
        const runId = crypto.randomUUID();
        await setPeriodStatus(
          supabase,
          'g_email_sync_progress',
          { user_id: userId, year, week },
          { sync_status: 'running', started_at: ts(), error_message: null, current_run_id: runId },
          'user_id,year,week'
        );
        await sendConsole(supabase, userId, runId, `Gmail: processing week ${week} of ${year}`, 'milestone', 'gmail');

        const start = weekStart(year, week);
        const end = new Date(start); end.setUTCDate(start.getUTCDate() + 7);
        let pageToken: string | undefined = undefined;
        let processed = 0;
        let included = 0;

        const parseHeaders = (headers: any[]): Record<string, string> => {
          const map: Record<string, string> = {};
          for (const h of headers || []) {
            const name = String(h.name || '').toLowerCase();
            map[name] = String(h.value || '');
          }
          return map;
        };
        const parseAddressList = (v?: string): string[] => splitAddresses(v);

        const rows: any[] = [];
        const rangeQ = `after:${fmt(start)} before:${fmt(end)}`;
        do {
          const url = new URL('https://gmail.googleapis.com/gmail/v1/users/me/messages');
          url.searchParams.set('q', rangeQ);
          url.searchParams.set('maxResults', '100');
          if (pageToken) url.searchParams.set('pageToken', pageToken);
          const listRes = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
          if (!listRes.ok) throw new Error(`Gmail list error ${listRes.status}`);
          const listJson: any = await listRes.json();
          const ids: string[] = (listJson.messages || []).map((m: any) => m.id);
          pageToken = listJson.nextPageToken;
          for (const id of ids) {
            const detRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}?format=metadata&metadataHeaders=From&metadataHeaders=To&metadataHeaders=Cc&metadataHeaders=Bcc&metadataHeaders=Subject&metadataHeaders=Date`, {
              headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (!detRes.ok) continue;
            const msg: any = await detRes.json();
          const headers = parseHeaders(msg.payload?.headers || []);
          const subject = headers['subject'] || '';
          const fromRaw = headers['from'] || '';
          const from = extractEmail(fromRaw) || '';
          const to = parseAddressList(headers['to']);
          const cc = parseAddressList(headers['cc']);
          const bcc = parseAddressList(headers['bcc']);
          const dateStr = headers['date'];
          const sentAt = dateStr ? new Date(dateStr).toISOString() : null;

          // Extract body text/html (simple traversal)
          const extractParts = (p: any): { text?: string; html?: string } => {
            if (!p) return {};
            const stack = [p];
            let text = '', html = '';
            while (stack.length) {
              const node = stack.pop();
              if (!node) continue;
              if (node.parts) stack.push(...node.parts);
              const mime = node.mimeType || '';
              const data = node.body?.data;
              if (data) {
                const decoded = atob(data.replace(/-/g, '+').replace(/_/g, '/'));
                if (mime.includes('text/plain')) text += decoded;
                if (mime.includes('text/html')) html += decoded;
              }
            }
            return { text: text || undefined, html: html || undefined };
          };
          // Always store header-level record; bodies/attachments are backfilled separately when matched
          rows.push({
            user_id: userId,
            gmail_message_id: msg.id,
            thread_id: msg.threadId,
            from_email: from,
            to_emails: to,
            cc_emails: cc,
            bcc_emails: bcc,
            subject,
            body_text: null,
            body_html: null,
            sent_at: sentAt,
            updated_at: ts(),
          });
          included++;
          processed++;
          }
          if (rows.length) await supabase.from('g_emails').upsert(rows, { onConflict: 'gmail_message_id' });
        } while (pageToken);

        await sendConsole(supabase, userId, runId, `Processed ${processed} messages (${included} stored headers)`, 'milestone', 'gmail');
        await setPeriodStatus(
          supabase,
          'g_email_sync_progress',
          { user_id: userId, year, week },
          { sync_status: 'completed', processed_messages: included, completed_at: ts() },
          'user_id,year,week'
        );
        if (!suppress_match) {
          try {
            // Compute ISO week start (Monday) and end (Sunday), then derive month/year from week end
            const simple = new Date(Date.UTC(year, 0, 1 + (week - 1) * 7));
            const dow = simple.getUTCDay() || 7;
            const weekStartISO = new Date(simple);
            if (dow <= 4) weekStartISO.setUTCDate(simple.getUTCDate() - simple.getUTCDay() + 1);
            else weekStartISO.setUTCDate(simple.getUTCDate() + 8 - simple.getUTCDay());
            const weekEndISO = new Date(weekStartISO);
            weekEndISO.setUTCDate(weekStartISO.getUTCDate() + 6);
            const mYear = weekEndISO.getUTCFullYear();
            const mMonth = weekEndISO.getUTCMonth() + 1; // 1..12
            const { error } = await supabase.rpc('refresh_g_emails_matches', { p_user_id: userId, p_since: null, p_merge: false } as any);
            const ok = !error;
            await sendConsole(supabase, userId, runId, ok ? `Triggered email match refresh for ${mYear}-${String(mMonth).padStart(2,'0')}` : 'Email match refresh RPC not available', 'info', 'gmail');
          } catch (_) {
            // Non-fatal
          }
        }
        return json({ ok: true, message: 'Week synced' });
      }
      
      case 'backfill_bodies': {
        const batch = Number(Deno.env.get('GMAIL_BACKFILL_BATCH') || 30);
        const accessToken = await getValidAccessTokenOrThrow(supabase, userId);
        const { data: queue } = await supabase
          .from('g_email_backfill_queue')
          .select('gmail_message_id')
          .eq('user_id', userId)
          .in('status', ['queued', null] as any)
          .order('enqueued_at', { ascending: true })
          .limit(batch);
        let done = 0;
        for (let i = 0; i < (queue?.length || 0); i++) {
          const mid = queue![i].gmail_message_id;
          if (i > 0 && i % 10 === 0) await sleep(200);
          const fullRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${mid}?format=full`, { headers: { Authorization: `Bearer ${accessToken}` } });
          if (!fullRes.ok) {
            await supabase.from('g_email_backfill_queue').update({ status: 'error', attempts: 1, last_attempt_at: ts(), error_message: `HTTP ${fullRes.status}` }).eq('user_id', userId).eq('gmail_message_id', mid);
            continue;
          }
          const full = await fullRes.json();
          // Subject from headers
          const headersArr = full?.payload?.headers || [];
          let subject = '';
          for (const h of headersArr) {
            if ((h?.name || '').toLowerCase() === 'subject') { subject = h?.value || ''; break; }
          }
          // Extract bodies and attachments
          const extractParts = (p: any): { text?: string; html?: string; attachments?: Array<{ id: string; filename?: string; mimeType?: string; size?: number }> } => {
            if (!p) return {} as any;
            const stack = [p];
            let text = '', html = '';
            const attachments: Array<{ id: string; filename?: string; mimeType?: string; size?: number }> = [];
            while (stack.length) {
              const node = stack.pop();
              if (!node) continue;
              if (node.parts) stack.push(...node.parts);
              const mime = node.mimeType || '';
              const data = node.body?.data;
              if (data) {
                const decoded = atob(data.replace(/-/g, '+').replace(/_/g, '/'));
                if (mime.includes('text/plain')) text += decoded;
                if (mime.includes('text/html')) html += decoded;
              }
              const attachId = node.body?.attachmentId;
              if (attachId || node.filename) {
                attachments.push({ id: attachId || `${mid}-${attachments.length}`, filename: node.filename, mimeType: mime || undefined, size: node.body?.size });
              }
            }
            return { text: text || undefined, html: html || undefined, attachments };
          };
          const bodies = extractParts(full.payload);
          // Update subject and bodies
          await supabase.from('g_emails').update({ subject, body_text: bodies.text || null, body_html: bodies.html || null, updated_at: ts() }).eq('user_id', userId).eq('gmail_message_id', mid);
          // Ensure bucket exists for attachments
          try { await supabase.storage.createBucket('gmail-attachments', { public: false }); } catch {}
          for (const a of (bodies.attachments || [])) {
            if (!a.id) continue;
            const attRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${mid}/attachments/${a.id}`, { headers: { Authorization: `Bearer ${accessToken}` } });
            if (!attRes.ok) continue;
            const att = await attRes.json();
            const contentBase64 = (att?.data || '').replace(/-/g, '+').replace(/_/g, '/');
            const bin = Uint8Array.from(atob(contentBase64), c => c.charCodeAt(0));
            const key = `${userId}/${mid}/${a.id}-${(a.filename || 'attachment').replace(/[^a-zA-Z0-9._-]+/g,'_')}`;
            await supabase.storage.from('gmail-attachments').upload(key, new Blob([bin], { type: a.mimeType || 'application/octet-stream' }), { upsert: true });
            await supabase.from('g_email_attachments').upsert({
              user_id: userId,
              gmail_message_id: mid,
              attachment_id: a.id,
              filename: a.filename || null,
              mime_type: a.mimeType || null,
              size_bytes: att?.size || a.size || null,
              content_base64: null,
              storage_path: key,
            } as any, { onConflict: 'user_id,gmail_message_id,attachment_id' } as any);
          }
          await supabase.from('g_email_backfill_queue').update({ status: 'done', last_attempt_at: ts(), attempts: 1, error_message: null }).eq('user_id', userId).eq('gmail_message_id', mid);
          done++;
        }
        return json({ ok: true, backfilled: done });
      }
      case 'backfill_matched': {
        // Download full bodies for messages that have been matched by DB routines
        const batch = Number(Deno.env.get('GMAIL_BACKFILL_BATCH') || 30);
        const accessToken = await getValidAccessTokenOrThrow(supabase, userId);
        await sendConsole(supabase, userId, null, `Scanning for matched emails missing bodies (batch ${batch})`, 'info', 'gmail');
        const sel = 'gmail_message_id, matched_educator_ids, body_text, body_html, updated_at';
        const { data: rows, error: selErr } = await supabase
          .from('g_emails')
          .select(sel)
          .eq('user_id', userId)
          .is('body_text', null)
          .order('updated_at', { ascending: false })
          .limit(batch * 3); // fetch a bit larger window then cap
        if (selErr) {
          await sendConsole(supabase, userId, null, `Backfill query failed: ${selErr.message}`, 'error', 'gmail');
          return json({ ok: false, error: selErr.message }, 500);
        }
        let done = 0;
        let considered = 0;
        for (const r of rows || []) {
          const ids = (r as any).matched_educator_ids as string[] | null;
          const isPrivate = false; // privacy flag not implemented in schema yet
          considered++;
          if (!ids || ids.length === 0) continue;
          if (isPrivate) continue;
          if (done >= batch) break;
          const mid = (r as any).gmail_message_id;
          const fullRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${mid}?format=full`, { headers: { Authorization: `Bearer ${accessToken}` } });
          if (!fullRes.ok) continue;
          const full = await fullRes.json();
          const extractParts = (p: any): { text?: string; html?: string; attachments?: Array<{ id: string; filename?: string; mimeType?: string; size?: number }> } => {
            if (!p) return {};
            const stack = [p];
            let text = '', html = '';
            const attachments: Array<{ id: string; filename?: string; mimeType?: string; size?: number }> = [];
            while (stack.length) {
              const node = stack.pop();
              if (!node) continue;
              if (node.parts) stack.push(...node.parts);
              const mime = node.mimeType || '';
              const data = node.body?.data;
              if (data) {
                const decoded = atob(data.replace(/-/g, '+').replace(/_/g, '/'));
                if (mime.includes('text/plain')) text += decoded;
                if (mime.includes('text/html')) html += decoded;
              }
              const attachId = node.body?.attachmentId;
              if (attachId || node.filename) {
                attachments.push({ id: attachId || `${mid}-${attachments.length}`, filename: node.filename, mimeType: mime || undefined, size: node.body?.size });
              }
            }
            return { text: text || undefined, html: html || undefined, attachments };
          };
          const bodies = extractParts(full.payload);
          // Get subject
          const hdrs = full?.payload?.headers || [];
          let subj = '';
          for (const h of hdrs) { if ((h?.name || '').toLowerCase() === 'subject') { subj = h?.value || ''; break; } }
          // Update subject and bodies
          await supabase.from('g_emails').update({ subject: subj, body_text: bodies.text || null, body_html: bodies.html || null, updated_at: ts() }).eq('user_id', userId).eq('gmail_message_id', mid);
          // Download and store attachments
          // Ensure bucket exists
          try { await supabase.storage.createBucket('gmail-attachments', { public: false }); } catch {}
          for (const a of (bodies.attachments || [])) {
            if (!a.id) continue;
            const attRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${mid}/attachments/${a.id}`, { headers: { Authorization: `Bearer ${accessToken}` } });
            if (!attRes.ok) continue;
            const att = await attRes.json(); // { data: base64url, size } 
            const contentBase64 = (att?.data || '').replace(/-/g, '+').replace(/_/g, '/');
            // Upload to storage
            const bin = Uint8Array.from(atob(contentBase64), c => c.charCodeAt(0));
            const key = `${userId}/${mid}/${a.id}-${(a.filename || 'attachment').replace(/[^a-zA-Z0-9._-]+/g,'_')}`;
            await supabase.storage.from('gmail-attachments').upload(key, new Blob([bin], { type: a.mimeType || 'application/octet-stream' }), { upsert: true });
            await supabase.from('g_email_attachments').upsert({
              user_id: userId,
              gmail_message_id: mid,
              attachment_id: a.id,
              filename: a.filename || null,
              mime_type: a.mimeType || null,
              size_bytes: att?.size || a.size || null,
              content_base64: null,
              storage_path: key,
            } as any, { onConflict: 'user_id,gmail_message_id,attachment_id' } as any);
          }
          done++;
        }
        await sendConsole(supabase, userId, null, `Backfill finished. Considered ${considered}, downloaded ${done}`, 'info', 'gmail');
        return json({ ok: true, backfilled: done, considered });
      }
      case 'pause_sync': {
        await sendConsole(supabase, userId, null, 'Sync paused', 'milestone', 'gmail');
        return json({ ok: true });
      }
      case 'send_email': {
        const { to = [], cc = [], bcc = [], subject = '', body = '' } = body || {};
        const accessToken = await getValidAccessTokenOrThrow(supabase, userId);
        const toLine = Array.isArray(to) ? to.join(', ') : String(to || '');
        const ccLine = Array.isArray(cc) ? cc.join(', ') : String(cc || '');
        const bccLine = Array.isArray(bcc) ? bcc.join(', ') : String(bcc || '');
        const headers: string[] = [];
        if (toLine) headers.push(`To: ${toLine}`);
        if (ccLine) headers.push(`Cc: ${ccLine}`);
        if (bccLine) headers.push(`Bcc: ${bccLine}`);
        headers.push(`Subject: ${subject}`);
        headers.push('MIME-Version: 1.0');
        headers.push('Content-Type: text/plain; charset="UTF-8"');
        const raw = btoa(headers.join('\r\n') + '\r\n\r\n' + (body || ''))
          .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        const resp = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ raw }),
        });
        if (!resp.ok) return json({ error: `Gmail send failed ${resp.status}` }, resp.status);
        const js = await resp.json();
        await sendConsole(supabase, userId, null, 'Email sent', 'info', 'gmail');
        return json({ ok: true, id: js?.id });
      }
      default:
        return json({ error: `Unknown action: ${action}` }, 400);
    }
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : 'Unknown error' }, 500);
  }
});



