// Daily cron: for each connected user, ingest last 24h Gmail headers and Calendar events,
// refresh matches across full history, then backfill subjects/bodies/attachments for
// any matched emails still missing them.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { json, ts, sleep } from "@shared/http.ts";
import { sendConsole } from "@shared/log.ts";
import { getValidAccessTokenOrThrow } from "@shared/google-auth.ts";

const GMAIL_BATCH = Number(Deno.env.get('DAILY_GMAIL_PAGE_SIZE') || 100);
const BACKFILL_BATCH = Number(Deno.env.get('DAILY_BACKFILL_BATCH') || 100);
const CALENDAR_ID = Deno.env.get('DAILY_CALENDAR_ID') || 'primary';

// Gmail search expects YYYY/MM/DD for date boundaries
const fmtDate = (d: Date) => `${d.getUTCFullYear()}/${String(d.getUTCMonth() + 1).padStart(2,'0')}/${String(d.getUTCDate()).padStart(2,'0')}`;

serve(async (req) => {
  if (req.method === 'GET') return json({ ok: true, function: 'daily-cron', now: ts() });
  const cronSecret = Deno.env.get('CRON_SECRET') || '';
  if (!cronSecret || req.headers.get('X-Cron-Secret') !== cronSecret) return json({ error: 'Forbidden' }, 403);

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const serviceRole = Deno.env.get('SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, serviceRole);

    // Process all users that have Google tokens
    const { data: users } = await supabase.from('ygoogle_auth_tokens').select('user_id');
    // Catch-up queues removed; no prioritization
    const queuedSet = new Set<string>();
    const now = new Date();

    let usersProcessed = 0;

    for (const u of (users || [])) {
      const userId = u.user_id as string;
      const runId = crypto.randomUUID();
      // Compute window starts per object type based on last successful import minus 24h
      const getSince = async (objectType: 'email' | 'event') => {
        try {
          const { data: hist } = await supabase
            .from('ygoogle_sync_history')
            .select('end_of_sync_period, started_at, headers_fetch_successful')
            .eq('user_id', userId)
            .eq('object_type', objectType)
            .eq('headers_fetch_successful', true)
            .order('id', { ascending: false })
            .limit(1);
          const row = Array.isArray(hist) ? hist[0] : null;
          const endIso = row?.end_of_sync_period as string | null | undefined;
          const startIso = row?.started_at as string | null | undefined;
          const base = endIso ? new Date(endIso) : (startIso ? new Date(startIso) : new Date(now.getTime() - 24 * 3600 * 1000));
          return new Date(base.getTime() - 24 * 3600 * 1000);
        } catch {
          return new Date(now.getTime() - 24 * 3600 * 1000);
        }
      };
      const sinceEmail = await getSince('email');
      const sinceEvent = await getSince('event');
      await sendConsole(supabase, userId, runId, `Daily sync windows: email from ${fmtDate(sinceEmail)}; event from ${fmtDate(sinceEvent)}`, 'info', 'gmail');

      // Acquire token once; refresh helper inside getValidAccessTokenOrThrow ensures validity
      const accessToken = await getValidAccessTokenOrThrow(supabase, userId);

      // 1) Gmail: ingest last 24h headers only
      try {
        const q = `after:${fmtDate(sinceEmail)}`;
        let pageToken: string | undefined = undefined;
        let stored = 0;
        const extractEmail = (s?: string): string | null => {
          if (!s) return null;
          const m = s.match(/<([^>]+)>/);
          const raw = (m ? m[1] : s).trim().toLowerCase();
          return raw.replace(/^mailto:/, '').replace(/^\"|\"$/g, '');
        };
        const splitAddresses = (v?: string): string[] => (!v ? [] : v.split(',').map(a => extractEmail(a) || '').filter(Boolean));
        const parseHeaders = (headers: any[]): Record<string, string> => {
          const map: Record<string, string> = {};
          for (const h of headers || []) { const k = (h?.name || '').toLowerCase(); if (!k) continue; map[k] = h?.value || ''; }
          return map;
        };
        do {
          const url = new URL('https://gmail.googleapis.com/gmail/v1/users/me/messages');
          url.searchParams.set('q', q);
          url.searchParams.set('maxResults', String(GMAIL_BATCH));
          if (pageToken) url.searchParams.set('pageToken', pageToken);
          const listRes = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
          if (!listRes.ok) break;
          const listJson: any = await listRes.json();
          const ids: string[] = (listJson.messages || []).map((m: any) => m.id);
          pageToken = listJson.nextPageToken;
          const rows: any[] = [];
          for (const id of ids) {
            const det = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}?format=metadata&metadataHeaders=From&metadataHeaders=To&metadataHeaders=Cc&metadataHeaders=Bcc&metadataHeaders=Date`, { headers: { Authorization: `Bearer ${accessToken}` } });
            if (!det.ok) continue;
            const msg: any = await det.json();
            const headers = parseHeaders(msg.payload?.headers || []);
            const from = extractEmail(headers['from']) || '';
            const to = splitAddresses(headers['to']);
            const cc = splitAddresses(headers['cc']);
            const bcc = splitAddresses(headers['bcc']);
            const sentAt = (headers['date'] ? new Date(headers['date']) : null)?.toISOString() ?? null;
            rows.push({
              user_id: userId,
              gmail_message_id: msg.id,
              thread_id: msg.threadId,
              from_email: from,
              to_emails: to,
              cc_emails: cc,
              bcc_emails: bcc,
              subject: null,
              body_text: null,
              body_html: null,
              sent_at: sentAt,
              updated_at: ts(),
            });
          }
          if (rows.length) {
            await supabase.from('yg_emails').upsert(rows, { onConflict: 'user_id,gmail_message_id' } as any);
            stored += rows.length;
          }
          await sleep(150);
        } while (pageToken);
        await sendConsole(supabase, userId, runId, `Daily Gmail: stored ${stored} headers`, 'info', 'gmail');
        try {
          await supabase
            .from('ygoogle_sync_history')
            .insert({
              user_id: userId,
              start_of_sync_period: since.toISOString(),
              end_of_sync_period: now.toISOString(),
              object_type: 'email',
              headers_fetched: stored,
              headers_fetch_successful: true,
              initiator: 'system',
              started_at: ts(),
            } as any);
        } catch {}
      } catch (e) {
        await sendConsole(supabase, userId, runId, `Daily Gmail failed: ${e instanceof Error ? e.message : String(e)}`,'error','gmail');
      }

      // 1b) Gmail backlog catch-up older than 24h (idempotent upserts)
      try {
        // Determine user start date
        const { data: settings } = await supabase.from('ygoogle_sync_settings').select('sync_start_date').eq('user_id', userId).single();
        const START = settings?.sync_start_date ? new Date(settings.sync_start_date) : null;
        if (START) {
          const olderThanQ = `after:${fmtDate(START)} older_than:1d`;
          let pageToken: string | undefined = undefined;
          let processed = 0;
          const MAX = queuedSet.has(userId)
            ? Number(Deno.env.get('DAILY_CATCHUP_MAX_MESSAGES_BOOST') || 10000)
            : Number(Deno.env.get('DAILY_CATCHUP_MAX_MESSAGES') || 3000);
          do {
            const url = new URL('https://gmail.googleapis.com/gmail/v1/users/me/messages');
            url.searchParams.set('q', olderThanQ);
            url.searchParams.set('maxResults', String(GMAIL_BATCH));
            if (pageToken) url.searchParams.set('pageToken', pageToken);
            const listRes = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
            if (!listRes.ok) break;
            const listJson: any = await listRes.json();
            const ids: string[] = (listJson.messages || []).map((m: any) => m.id);
            pageToken = listJson.nextPageToken;
            const rows: any[] = [];
            for (const id of ids) {
              const det = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}?format=metadata&metadataHeaders=From&metadataHeaders=To&metadataHeaders=Cc&metadataHeaders=Bcc&metadataHeaders=Date`, { headers: { Authorization: `Bearer ${accessToken}` } });
              if (!det.ok) continue;
              const msg: any = await det.json();
              const headers = parseHeaders(msg.payload?.headers || []);
              const from = extractEmail(headers['from']) || '';
              const to = splitAddresses(headers['to']);
              const cc = splitAddresses(headers['cc']);
              const bcc = splitAddresses(headers['bcc']);
              const sentAt = (headers['date'] ? new Date(headers['date']) : null)?.toISOString() ?? null;
              rows.push({ user_id: userId, gmail_message_id: msg.id, thread_id: msg.threadId, from_email: from, to_emails: to, cc_emails: cc, bcc_emails: bcc, sent_at: sentAt, updated_at: ts() });
            }
            if (rows.length) await supabase.from('yg_emails').upsert(rows, { onConflict: 'user_id,gmail_message_id', ignoreDuplicates: true } as any);
            processed += rows.length;
            if (!pageToken || processed >= MAX) break;
            await sleep(120);
          } while (true);
          if (processed) await sendConsole(supabase, userId, runId, `Daily Gmail catch-up processed ${processed} messages`, 'info', 'gmail');
        }
      } catch (e) {
        await sendConsole(supabase, userId, runId, `Daily Gmail catch-up failed: ${e instanceof Error ? e.message : String(e)}`,'error','gmail');
      }

      // 2) Calendar: ingest last 24h events
      try {
        const timeMin = sinceEvent.toISOString();
        const timeMax = now.toISOString();
        let pageToken: string | undefined = undefined;
        let processed = 0;
        do {
          const url = new URL(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events`);
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
              google_calendar_id: CALENDAR_ID,
              google_event_id: e.id,
              summary: sanitizeText(e.summary || null),
              description: sanitizeText(e.description || null),
              start_time: start,
              end_time: end,
              organizer_email: e.organizer?.email || null,
              attendees: attendeeEmails.length ? attendeeEmails : null,
              location: e.location || null,
              status: e.status || null,
              updated_at: ts(),
            };
          });
          if (rows.length) await supabase.from('yg_events').upsert(rows, { onConflict: 'user_id,google_event_id', ignoreDuplicates: true } as any);
          processed += rows.length;
          await sleep(150);
        } while (pageToken);
        await sendConsole(supabase, userId, runId, `Daily Calendar: upserted ~${processed} events`, 'info', 'calendar');
        try {
          await supabase
            .from('ygoogle_sync_history')
            .insert({
              user_id: userId,
              start_of_sync_period: sinceEvent.toISOString(),
              end_of_sync_period: now.toISOString(),
              object_type: 'event',
              headers_fetched: processed,
              headers_fetch_successful: true,
              initiator: 'system',
              started_at: ts(),
            } as any);
        } catch {}
      } catch (e) {
        await sendConsole(supabase, userId, runId, `Daily Calendar failed: ${e instanceof Error ? e.message : String(e)}`,'error','calendar');
      }

      // Calendar: refresh matching views and backfill from view (attachments)
      try {
        try { await supabase.from('ygoogle_sync_history').insert({ user_id: userId, start_of_sync_period: sinceEvent.toISOString(), end_of_sync_period: now.toISOString(), object_type: 'event', initiator: 'system', started_at: ts() } as any); } catch {}
        try { await supabase.rpc('refresh_calendar_matching_views' as any); } catch {}
        const CALB = Math.max(1, Math.min(200, Number(Deno.env.get('DAILY_GCAL_BACKFILL') || 50)));
        const { data: evs } = await supabase
          .from('yg_events_full_bodies_to_download')
          .select('user_id, google_event_id, google_calendar_id')
          .eq('user_id', userId)
          .limit(CALB);
        let evUpd = 0;
        for (const r of (evs || [])) {
          const eid = (r as any).google_event_id as string;
          const calId = (r as any).google_calendar_id || CALENDAR_ID;
          if (!eid) continue;
          const url = new URL(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calId)}/events/${encodeURIComponent(eid)}`);
          const resp = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
          if (!resp.ok) continue;
          const ev: any = await resp.json();
          const summary = ev.summary || null;
          const description = ev.description || null;
          await supabase.from('yg_events').update({ summary, description, updated_at: ts() }).eq('user_id', userId).eq('google_calendar_id', calId).eq('google_event_id', eid);
          const atts: any[] = Array.isArray(ev.attachments) ? ev.attachments : [];
          if (atts.length) { try { await supabase.storage.createBucket('gcal-attachments', { public: false }); } catch {} }
          for (const a of atts) {
            const fid = a.fileId as string | undefined;
            let storagePath: string | null = null;
            if (fid) {
              const driveUrl = `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fid)}?alt=media`;
              const dres = await fetch(driveUrl, { headers: { Authorization: `Bearer ${accessToken}` } });
              if (dres.ok) {
                const blob = await dres.blob();
                const safe = (a.title || fid || 'attachment').replace(/[^a-zA-Z0-9._-]+/g, '_');
                const key = `${userId}/${calId}/${eid}/${fid}-${safe}`;
                await supabase.storage.from('gcal-attachments').upload(key, blob, { upsert: true, contentType: (a.mimeType || undefined) as any });
                storagePath = key;
              }
            }
            await supabase.from('yg_event_attachments').upsert({
              user_id: userId,
              google_calendar_id: calId,
              google_event_id: eid,
              title: a.title || null,
              mime_type: a.mimeType || null,
              file_url: a.fileUrl || null,
              file_id: a.fileId || null,
              icon_link: a.iconLink || null,
              storage_path: storagePath,
            } as any, { onConflict: 'user_id,google_calendar_id,google_event_id,file_id' } as any);
          }
          evUpd++;
        }
        if (evUpd < CALB) { try { await supabase.rpc('refresh_events_with_people_ids' as any); } catch {} }
      } catch {}

      // 2b) Calendar backlog catch-up older than 24h
      try {
        const { data: settings } = await supabase.from('ygoogle_sync_settings').select('sync_start_date').eq('user_id', userId).single();
        const START = settings?.sync_start_date ? new Date(settings.sync_start_date) : null;
        if (START) {
          const timeMin = new Date(Date.UTC(START.getUTCFullYear(), START.getUTCMonth(), START.getUTCDate())).toISOString();
          const timeMax = since.toISOString();
          let pageToken: string | undefined = undefined;
          let processed = 0;
          const MAX = queuedSet.has(userId)
            ? Number(Deno.env.get('DAILY_CATCHUP_MAX_EVENTS_BOOST') || 20000)
            : Number(Deno.env.get('DAILY_CATCHUP_MAX_EVENTS') || 6000);
          do {
            const url = new URL(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events`);
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
              return { user_id: userId, google_calendar_id: CALENDAR_ID, google_event_id: e.id, summary: sanitizeText(e.summary || null), description: sanitizeText(e.description || null), start_time: start, end_time: end, organizer_email: e.organizer?.email || null, attendees: attendeeEmails.length ? attendeeEmails : null, location: e.location || null, status: e.status || null, updated_at: ts() };
            });
            if (rows.length) await supabase.from('yg_events').upsert(rows, { onConflict: 'user_id,google_event_id' } as any);
            processed += rows.length;
            if (!pageToken || processed >= MAX) break;
            await sleep(120);
          } while (true);
          if (processed) await sendConsole(supabase, userId, runId, `Daily Calendar catch-up processed ~${processed} events`, 'info', 'calendar');
        }
      } catch (e) {
        await sendConsole(supabase, userId, runId, `Daily Calendar catch-up failed: ${e instanceof Error ? e.message : String(e)}`,'error','calendar');
      }

      // 3) Refresh matches across all history (emails and events)
      try {
        const { error: e1 } = await supabase.rpc('refresh_g_emails_matches', { p_user_id: userId, p_since: null, p_merge: true } as any);
        const { error: e2 } = await supabase.rpc('refresh_g_events_matches', { p_user_id: userId, p_since: null, p_merge: true } as any);
        if (e1) await sendConsole(supabase, userId, runId, `Email match refresh error: ${e1.message}`,'error','gmail');
        if (e2) await sendConsole(supabase, userId, runId, `Event match refresh error: ${e2.message}`,'error','calendar');
        if (!e1 && !e2) await sendConsole(supabase, userId, runId, `Matches refreshed across history`, 'info', 'gmail');
      } catch (e) {
        await sendConsole(supabase, userId, runId, `Match refresh failed: ${e instanceof Error ? e.message : String(e)}`,'error','gmail');
      }

      // 4) Backfill subjects/bodies/attachments for any matched emails missing them (full history, batched)
      try {
        const token2 = await getValidAccessTokenOrThrow(supabase, userId);
        // Note: select rows missing subject OR body_text
        const { data: rows } = await supabase
          .from('yg_emails')
          .select('gmail_message_id, matched_educator_ids, subject, body_text')
          .eq('user_id', userId)
          .or('subject.is.null,body_text.is.null')
          .order('updated_at', { ascending: false })
          .limit(BACKFILL_BATCH * 2);
        let done = 0;
        for (const r of rows || []) {
          const ids = (r as any).matched_educator_ids as string[] | null;
          if (!ids || ids.length === 0) continue;
          if (done >= BACKFILL_BATCH) break;
          const mid = (r as any).gmail_message_id as string;
          const fullRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${mid}?format=full`, { headers: { Authorization: `Bearer ${token2}` } });
          if (!fullRes.ok) continue;
          const full = await fullRes.json();
          // Subject
          let subject = '';
          for (const h of (full?.payload?.headers || [])) { if ((h?.name || '').toLowerCase() === 'subject') { subject = h?.value || ''; break; } }
          // Bodies + attachments
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
              if (attachId || node.filename) attachments.push({ id: attachId || `${mid}-${attachments.length}`, filename: node.filename, mimeType: mime || undefined, size: node.body?.size });
            }
            return { text: text || undefined, html: html || undefined, attachments };
          };
          const bodies = extractParts(full.payload);
          await supabase.from('yg_emails').update({ subject: subject || (r as any).subject || null, body_text: bodies.text || null, body_html: bodies.html || null, updated_at: ts() }).eq('user_id', userId).eq('gmail_message_id', mid);
          try { await supabase.storage.createBucket('gmail-attachments', { public: false }); } catch {}
          for (const a of (bodies.attachments || [])) {
            if (!a.id) continue;
            const attRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${mid}/attachments/${a.id}`, { headers: { Authorization: `Bearer ${token2}` } });
            if (!attRes.ok) continue;
            const att = await attRes.json();
            const contentBase64 = (att?.data || '').replace(/-/g, '+').replace(/_/g, '/');
            const bin = Uint8Array.from(atob(contentBase64), c => c.charCodeAt(0));
            const key = `${userId}/${mid}/${a.id}-${(a.filename || 'attachment').replace(/[^a-zA-Z0-9._-]+/g,'_')}`;
            await supabase.storage.from('gmail-attachments').upload(key, new Blob([bin], { type: a.mimeType || 'application/octet-stream' }), { upsert: true });
            await supabase.from('yg_email_attachments').upsert({
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
          if (done % 10 === 0) await sleep(100);
        }
        await sendConsole(supabase, userId, runId, `Daily Backfill: updated ${done} messages`, 'info', 'gmail');
        try {
          await supabase
            .from('ygoogle_sync_history')
            .insert({
              user_id: userId,
              start_of_sync_period: since.toISOString(),
              end_of_sync_period: now.toISOString(),
              object_type: 'email',
              backfill_downloads: done,
              backfill_download_successful: true,
              initiator: 'system',
              started_at: ts(),
            } as any);
        } catch {}
      } catch (e) {
        await sendConsole(supabase, userId, runId, `Daily backfill failed: ${e instanceof Error ? e.message : String(e)}`,'error','gmail');
      }

      // No catch-up queue to update
      usersProcessed++;
      await sleep(100);
    }

    return json({ ok: true, usersProcessed, window: { since: since.toISOString(), now: now.toISOString() } });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : 'Unknown error' }, 500);
  }
});


function sanitizeText(input: any): any {
  if (input == null) return null;
  try {
    let s = String(input).normalize('NFKC');
    s = s.replace(/\u00A0/g, ' ');
    s = s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '');
    return s;
  } catch { return input; }
}

