// Historical catch-up runner: fetches ALL Gmail headers and Calendar events
// from the user's configured sync_start_date up to now in one continuous pass,
// batched via API pagination. No matching/backfill here — nightly cron handles that.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { json, ts, sleep } from "@shared/http.ts";
import { preflight } from "@shared/cors.ts";
import { sendConsole } from "@shared/log.ts";
import { getValidAccessTokenOrThrow } from "@shared/google-auth.ts";

const fmtDate = (d: Date) => `${d.getUTCFullYear()}/${String(d.getUTCMonth() + 1).padStart(2, '0')}/${String(d.getUTCDate()).padStart(2, '0')}`;

serve(async (req) => {
  const pf = preflight(req);
  if (pf) return pf;
  if (req.method === 'GET') return json({ ok: true, function: 'run-sync', now: ts() });

  try {
    const body = await req.json().catch(() => ({}));
    const { action } = body || {};
    if (action !== 'historical_catchup') return json({ error: 'Unknown action' }, 400);

    // AuthN via user JWT; writes via service role
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

    // Determine START
    const { data: settings } = await supabase.from('google_sync_settings').select('sync_start_date').eq('user_id', userId).single();
    const START = settings?.sync_start_date ? new Date(settings.sync_start_date) : new Date();
    const now = new Date();
    if (START > now) return json({ ok: true, message: 'Start date is in the future; nothing to do' });

    const accessToken = await getValidAccessTokenOrThrow(supabase, userId);
    let gmailCount = 0;
    let gcalCount = 0;

    // Gmail catch-up: one continuous window from START -> now, metadata only
    try {
      const q = `after:${fmtDate(START)}`;
      let pageToken: string | undefined = undefined;
      const MAX = Number(Deno.env.get('CATCHUP_MAX_MESSAGES') || 5000);
      const parseHeaders = (headers: any[]): Record<string, string> => {
        const map: Record<string, string> = {};
        for (const h of headers || []) { const k = (h?.name || '').toLowerCase(); if (!k) continue; map[k] = h?.value || ''; }
        return map;
      };
      const extractEmail = (s?: string): string | null => {
        if (!s) return null;
        const m = s.match(/<([^>]+)>/);
        const raw = (m ? m[1] : s).trim().toLowerCase();
        return raw.replace(/^mailto:/, '').replace(/^\"|\"$/g, '');
      };
      const splitAddresses = (v?: string): string[] => (!v ? [] : v.split(',').map(a => extractEmail(a) || '').filter(Boolean));
      while (true) {
        const url = new URL('https://gmail.googleapis.com/gmail/v1/users/me/messages');
        url.searchParams.set('q', q);
        url.searchParams.set('maxResults', '100');
        if (pageToken) url.searchParams.set('pageToken', pageToken);
        const listRes = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
        if (!listRes.ok) break;
        const listJson: any = await listRes.json();
        const ids: string[] = (listJson.messages || []).map((m: any) => m.id);
        pageToken = listJson.nextPageToken;
        const rows: any[] = [];
        for (const id of ids) {
          const det = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}?format=metadata&metadataHeaders=From&metadataHeaders=To&metadataHeaders=Cc&metadataHeaders=Bcc&metadataHeaders=Subject&metadataHeaders=Date`, { headers: { Authorization: `Bearer ${accessToken}` } });
          if (!det.ok) continue;
          const msg: any = await det.json();
          const headers = parseHeaders(msg.payload?.headers || []);
          const from = extractEmail(headers['from']) || '';
          const to = splitAddresses(headers['to']);
          const cc = splitAddresses(headers['cc']);
          const bcc = splitAddresses(headers['bcc']);
          const subject = headers['subject'] || '';
          const sentAt = (headers['date'] ? new Date(headers['date']) : null)?.toISOString() ?? null;
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
        }
        if (rows.length) {
          await supabase.from('g_emails').upsert(rows, { onConflict: 'gmail_message_id' });
          gmailCount += rows.length;
        }
        if (!pageToken || gmailCount >= MAX) break;
        await sleep(120);
      }
    } catch {}

    // Calendar catch-up: full window START -> now
    try {
      const calendarId = 'primary';
      const timeMin = new Date(Date.UTC(START.getUTCFullYear(), START.getUTCMonth(), START.getUTCDate())).toISOString();
      const timeMax = now.toISOString();
      let pageToken: string | undefined = undefined;
      const MAX = Number(Deno.env.get('CATCHUP_MAX_EVENTS') || 10000);
      while (true) {
        const url = new URL(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`);
        url.searchParams.set('singleEvents', 'true');
        url.searchParams.set('orderBy', 'startTime');
        url.searchParams.set('timeMin', timeMin);
        url.searchParams.set('timeMax', timeMax);
        url.searchParams.set('maxResults', '250');
        if (pageToken) url.searchParams.set('pageToken', pageToken);
        const resp = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
        if (!resp.ok) break;
        const js: any = await resp.json();
        pageToken = js.nextPageToken;
        const events: any[] = js.items || [];
        const rows = events.map((e: any) => {
          const start = e.start?.dateTime || (e.start?.date ? new Date(e.start.date).toISOString() : null);
          const end = e.end?.dateTime || (e.end?.date ? new Date(e.end.date).toISOString() : null);
          const attendeeEmails = (e.attendees || []).map((a: any) => (a?.email || '').toLowerCase()).filter(Boolean);
          return {
            user_id: userId,
            google_calendar_id: calendarId,
            google_event_id: e.id,
            summary: e.summary || null,
            description: e.description || null,
            start_time: start,
            end_time: end,
            organizer_email: e.organizer?.email || null,
            attendees: attendeeEmails.length ? attendeeEmails : null,
            location: e.location || null,
            status: e.status || null,
            updated_at: ts(),
          };
        });
        if (rows.length) {
          await supabase.from('g_events').upsert(rows, { onConflict: 'user_id,google_calendar_id,google_event_id' } as any);
          gcalCount += rows.length;
        }
        if (!pageToken || gcalCount >= MAX) break;
        await sleep(120);
      }
    } catch {}

    await sendConsole(createClient(supabaseUrl, serviceRole), userId, null, `Historical catch-up done: emails=${gmailCount}, events=${gcalCount}`, 'info', 'gmail');
    return json({ ok: true, emails: gmailCount, events: gcalCount });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : 'Unknown error' }, 500);
  }
});
