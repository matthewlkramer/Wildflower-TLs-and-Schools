// Minimal Supabase Edge Function for Google Calendar OAuth + status wiring
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { json, ts } from "@shared/http.ts";
import { preflight } from "@shared/cors.ts";
import { sendConsole } from "@shared/log.ts";
import { exchangeCode, getValidAccessTokenOrThrow, getValidAccessToken } from "@shared/google-auth.ts";
import { setSyncStatus, setPeriodStatus } from "@shared/progress.ts";

// Revision marker to verify deployed version in GET response and logs
const REVISION = (() => {
  const envRev = Deno.env.get('RELEASE_REV')
    || Deno.env.get('COMMIT_SHA')
    || Deno.env.get('VERCEL_GIT_COMMIT_SHA')
    || Deno.env.get('SUPABASE_FUNCTIONS_REV');
  return `gcal-sync-${envRev || new Date().toISOString()}`;
})();

const SCOPES = [
  // Request combined scopes so a single auth covers Gmail + Calendar
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/calendar.readonly",
  "https://www.googleapis.com/auth/drive.readonly"
].join(' ');

serve(async (req) => {
  const pf = preflight(req);
  if (pf) return pf;
  if (req.method === 'GET') {
    try { console.log('[gcal-sync] GET healthcheck', { revision: REVISION, now: ts() }); } catch {}
    return json({ ok: true, function: 'gcal-sync', revision: REVISION, now: ts() });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { action, code, redirect_uri, redirectUri, suppress_match } = body || {};
    const finalRedirect = redirect_uri || redirectUri || Deno.env.get('GOOGLE_REDIRECT_URI') || '';

    const authHeader = req.headers.get('Authorization') ?? '';
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseAnon = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const supabaseAuth = createClient(supabaseUrl, supabaseAnon, { global: { headers: { Authorization: authHeader } } });
    const { data: authData, error: authErr } = await supabaseAuth.auth.getUser();
    let userId = authData?.user?.id as string | undefined;
    if (!userId) {
      // Fallback: try to decode JWT locally just to extract sub
      try {
        const m = authHeader.match(/^Bearersummary: sanitizeText(e.summary || null),s+(.+)$/i);
        const token = m ? m[1] : '';
        const [, payload] = token.split('.') as [string, string];
        const jsonStr = atob(payload.replace(/-/g,'+').replace(/_/g,'/'));
        const parsed: any = JSON.parse(jsonStr);
        userId = parsed?.sub;
      } catch (_) {
        // ignore
      }
      if (!userId) return json({ error: 'Unauthorized' }, 401);
    }

    const serviceRole = Deno.env.get('SERVICE_ROLE_KEY') ?? '';
    // User-context clients (forward Authorization) for reads that rely on auth.uid()
    const supabase = createClient(supabaseUrl, serviceRole, { global: { headers: { Authorization: authHeader } } });
    const supabaseGsync = createClient(supabaseUrl, serviceRole, { db: { schema: 'gsync' }, global: { headers: { Authorization: authHeader } } });
    // Service-role clients for privileged writes (do not forward user Authorization)
    const supabaseSrv = createClient(supabaseUrl, serviceRole);
    const supabaseSrvGsync = createClient(supabaseUrl, serviceRole, { db: { schema: 'gsync' } });

    // No matching or allowlist here; DB jobs handle linking later.

    switch (action) {
      case 'get_synced_through': {
        // Return the max(start_time) for this user's events as the synced-through timestamp
        const { data: rows } = await supabaseGsync
          .from('g_events')
          .select('start_time')
          .eq('user_id', userId)
          .order('start_time', { ascending: false })
          .limit(1);
        const iso = rows?.[0]?.start_time ?? null;
        return json({ calendar_synced_through: iso });
      }
      case 'get_auth_url': {
        const clientId = Deno.env.get('GOOGLE_CLIENT_ID');
        if (!clientId) return json({ error: 'Missing Google Client ID' }, 500);
        const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}` +
          `&redirect_uri=${encodeURIComponent(finalRedirect)}` +
          `&scope=${encodeURIComponent(SCOPES)}` +
          `&response_type=code&access_type=offline&prompt=consent&include_granted_scopes=true` +
          `&state=gcal-sync`;
        return json({ auth_url: url, scopes_requested: SCOPES });
      }
      case 'exchange_code': {
        await exchangeCode(supabaseGsync, code, userId, finalRedirect);
        await sendConsole(supabase, userId,summary: sanitizeText(e.summary || null), 'Google tokens saved', 'milestone', 'calendar');
        return json({ ok: true });
      }
      case 'get_connection_status': {
        const tok = await getValidAccessToken(supabaseGsync, userId);
        if (tok) return json({ connected: true });
        // Fallback: consider connected if a token row exists (access or refresh)
        const { data: trow } = await supabaseGsync
          .from('google_auth_tokens')
          .select('user_id, access_token, refresh_token')
          .eq('user_id', userId)
          .maybeSingle();
        return json({ connected: !!trow });
      }

      case 'token_health': {
        const accessValid = !!(await getValidAccessToken(supabaseGsync, userId));
        const { data: trow } = await supabaseGsync
          .from('google_auth_tokens')
          .select('refresh_token, expires_at')
          .eq('user_id', userId)
          .maybeSingle();
        const refreshPresent = !!(trow?.refresh_token);
        return json({ accessValid, refreshPresent, expires_at: trow?.expires_at ?? null });
      }
      case 'fetch_headers_range': {
        try {
          const nowIso = ts();
          const { data: settings } = await supabaseGsync.from('google_sync_settings').select('sync_start_date').eq('user_id', userId).single();
          const calendarId = 'primary';
          let accessToken: string;
          try {
            accessToken = await getValidAccessTokenOrThrow(supabaseGsync, userId);
          } catch (e: any) {
            try {
              const { data: trow } = await supabaseGsync
                .from('google_auth_tokens')
                .select('user_id, expires_at, access_token, refresh_token')
                .eq('user_id', userId)
                .maybeSingle();
              const exists = !!trow;
              const hasAccess = !!(trow as any)?.access_token;
              const hasRefresh = !!(trow as any)?.refresh_token;
              return json({ ok: false, source: 'token', error: e?.message || 'No valid access token', exists, hasAccess, hasRefresh, expires_at: (trow as any)?.expires_at ?? null }, 401);
            } catch {
              return json({ ok: false, source: 'token', error: e?.message || 'No valid access token' }, 401);
            }
          }
          const start = settings?.sync_start_date ? new Date(settings.sync_start_date) : new Date();
          const timeMin = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate())).toISOString();
          const timeMax = new Date().toISOString();
          // History row (user-initiated)
          let histId: number | null = null;
          try {
            const { data: hist } = await supabaseSrvGsync
              .from('google_sync_history')
              .insert({ user_id: userId, start_of_sync_period: timeMin, end_of_sync_period: nowIso, object_type: 'event', initiator: 'user', started_at: nowIso } as any)
              .select('id')
              .single();
            histId = (hist as any)?.id ?? null;
          } catch {}
          let pageToken: string | undefined;
          let upserted = 0;
          const upsert = async (rows: any[]) => {
            if (!rows.length) return;
            const { error } = await supabaseSrvGsync
              .from('g_events')
              .upsert(rows, { onConflict: 'user_id,google_event_id' } as any);
            if (error) {
              throw new Error(`upsert g_events failed: ${error.message}`);
            }
            upserted += rows.length;
          };
          do {
            const url = new URL(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`);
            url.searchParams.set('singleEvents', 'true');
            url.searchParams.set('orderBy', 'startTime');
            url.searchParams.set('timeMin', timeMin);
            url.searchParams.set('timeMax', timeMax);
            url.searchParams.set('maxResults', '250');
            if (pageToken) url.searchParams.set('pageToken', pageToken);
            const resp = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
            if (!resp.ok) return json({ ok: false, source: 'calendar-list', status: resp.status, error: `calendar list error ${resp.status}` });
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
                summary: e.summary ||summary: sanitizeText(e.summary || null),
                description: e.description ||summary: sanitizeText(e.summary || null),
                start_time: start,
                end_time: end,
                organizer_email: e.organizer?.email ||summary: sanitizeText(e.summary || null),
                attendees: attendeeEmails.length ? attendeeEmails :summary: sanitizeText(e.summary || null),
                location: e.location ||summary: sanitizeText(e.summary || null),
                status: e.status ||summary: sanitizeText(e.summary || null),
                updated_at: ts(),
              };
            });
            await upsert(rows);
          } while (pageToken);
          try { if (histId) await supabaseSrvGsync.from('google_sync_history').update({ headers_fetched: upserted, headers_fetch_successful: true }).eq('id', histId); } catch {}
          return json({ ok: true, upserted });
        } catch (e: any) {
          try {
            await supabaseSrvGsync
              .from('google_sync_history')
              .insert({ user_id: userId, object_type: 'event', initiator: 'user', started_at: ts(), headers_fetch_successful: false, headers_fetch_error: e?.message || 'fetch headers failed' } as any);
          } catch {}
          return json({ ok: false, source: 'exception', error: e?.message || 'fetch headers failed' });
        }
      }
      case 'refresh_matching_views': {
        try {
          const r = await supabaseGsync.rpc('refresh_calendar_matching_views', {} as any);
          if (r.error) {
            const msg = r.error.message || '';
            const details = (r.error as any).details || null;
            // If RPC or underlying MV is missing or ownership blocks refresh, return a clear hint
            return json({ ok: false, source: 'rpc', error: msg, details, hint: 'Ensure gsync.refresh_calendar_matching_views exists and refreshes the correct MVs owned by a privileged role.' });
          }
          return json({ ok: true });
        } catch (e: any) {
          return json({ ok: false, source: 'exception', error: e?.message || 'failed to refresh calendar views' });
        }
      }
      case 'backfill_from_view': {
        // Download event details + attachments from a view and update base rows
        try {
          const accessToken = await getValidAccessTokenOrThrow(supabase, userId);
          const batch = Math.max(1, Math.min(100, Number((body && body.limit) || 100)));
          const { data: rows, error } = await supabaseGsync
            .from('g_events_full_bodies_to_download')
            .select('user_id, google_event_id, google_calendar_id')
            .eq('user_id', userId)
            .limit(batch);
          if (error) return json({ ok: false, source: 'select', error: error.message });
          // History row (user-initiated) from min/max of selected events
          let histId: number | null = null;
          try {
            const ids = (rows || []).map((r: any) => r.google_event_id);
            let startIso: string | null = null; let endIso: string | null = ts();
            if (ids.length) {
              const { data: b1 } = await supabaseGsync.from('g_events').select('start_time').eq('user_id', userId).in('google_event_id', ids).order('start_time', { ascending: true }).limit(1);
              const { data: b2 } = await supabaseGsync.from('g_events').select('start_time').eq('user_id', userId).in('google_event_id', ids).order('start_time', { ascending: false }).limit(1);
              startIso = (b1 && b1[0]?.start_time) || null;
              endIso = (b2 && b2[0]?.start_time) || endIso;
            }
            const { data: ins } = await supabase.from('gsync.google_sync_history').insert({ user_id: userId, start_of_sync_period: startIso, end_of_sync_period: endIso, object_type: 'event', initiator: 'user', started_at: ts() } as any).select('id').single();
            histId = (ins as any)?.id ?? null;
          } catch {}
          let updated = 0;
          for (const r of rows || []) {
            const eid = (r as any).google_event_id as string;
            const calId = (r as any).google_calendar_id || 'primary';
            if (!eid) continue;
            const url = new URL(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calId)}/events/${encodeURIComponent(eid)}`);
            const resp = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
            if (!resp.ok) continue;
            const ev: any = await resp.json();
            // Update summary/description if desired (optional)
            const summary = ev.summary || null;
            const description = ev.description || null;
            await supabase
              .from('gsync.g_events')
              .update({ summary, description, updated_at: ts() })
              .eq('user_id', userId)
              .eq('google_calendar_id', calId)
              .eq('google_event_id', eid);
            // Download attachments from Drive if present
            const atts: any[] = Array.isArray(ev.attachments) ? ev.attachments : [];
            if (atts.length) {
              try { await supabase.storage.createBucket('gcal-attachments', { public: false }); } catch {}
            }
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
              await supabase
                .from('gsync.g_event_attachments')
                .upsert({
                  user_id: userId,
                  google_calendar_id: calId,
                  google_event_id: eid,
                  title: a.title ||summary: sanitizeText(e.summary || null),
                  mime_type: a.mimeType ||summary: sanitizeText(e.summary || null),
                  file_url: a.fileUrl ||summary: sanitizeText(e.summary || null),
                  file_id: a.fileId ||summary: sanitizeText(e.summary || null),
                  icon_link: a.iconLink ||summary: sanitizeText(e.summary || null),
                  storage_path: storagePath,
                } as any, { onConflict: 'user_id,google_calendar_id,google_event_id,file_id' } as any);
            }
            updated++;
          }
          // If likely end of stream, refresh final MV (best-effort)
          if (updated < batch) {
            try { await supabaseGsync.rpc('refresh_events_with_people_ids', {} as any); } catch {}
          }
          try { if (histId) await supabase.from('gsync.google_sync_history').update({ backfill_downloads: updated, backfill_download_successful: true }).eq('id', histId); } catch {}
          return json({ ok: true, updated });
        } catch (e: any) {
          try {
            await supabase
              .from('gsync.google_sync_history')
              .insert({ user_id: userId, object_type: 'event', initiator: 'user', started_at: ts(), backfill_download_successful: false, backfill_error: e?.message || 'backfill from view failed' } as any);
          } catch {}
          return json({ ok: false, source: 'exception', error: e?.message || 'backfill from view failed' });
        }
      }
      default:
        return json({ error: `Unknown action: ${action}` }, 400);
    }
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

