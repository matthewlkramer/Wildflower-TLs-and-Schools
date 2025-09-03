// Minimal Supabase Edge Function for Google Calendar OAuth + status wiring
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { json, ts } from "@shared/http.ts";
import { preflight } from "@shared/cors.ts";
import { sendConsole } from "@shared/log.ts";
import { exchangeCode, getValidAccessTokenOrThrow } from "@shared/google-auth.ts";
import { setSyncStatus, setPeriodStatus } from "@shared/progress.ts";

const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

serve(async (req) => {
  const pf = preflight(req);
  if (pf) return pf;
  if (req.method === 'GET') return json({ ok: true, function: 'gcal-sync', now: ts() });

  try {
    const body = await req.json().catch(() => ({}));
    const { action, code, redirect_uri, redirectUri } = body || {};
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

    // Helpers to compute matches against allowlist
    const INTERNAL_DOMAINS = ['wildflowerschools.org', 'blackwildflowers.org'];
    let allowSet: Set<string> | null = null;
    const getAllowSet = async (): Promise<Set<string>> => {
      if (allowSet) return allowSet;
      const { data } = await supabase.from('email_filter_addresses').select('email');
      allowSet = new Set((data || []).map((r: any) => String(r.email || '').toLowerCase()));
      return allowSet;
    };
    const matchAddresses = async (emails: string[]): Promise<string[]> => {
      const set = await getAllowSet();
      const list = (emails || []).map(e => (e || '').toLowerCase()).filter(Boolean);
      const externals = list.filter(e => !INTERNAL_DOMAINS.some(d => e.endsWith('@' + d)));
      return externals.filter(e => set.has(e));
    };

    switch (action) {
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
        await exchangeCode(supabase, code, userId, finalRedirect);
        await sendConsole(supabase, userId, null, 'Google tokens saved', 'milestone', 'calendar');
        return json({ ok: true });
      }
      case 'get_connection_status': {
        const tok = await getValidAccessToken(supabase, userId);
        return json({ connected: !!tok });
      }
      case 'start_sync': {
        const START = new Date(Date.UTC(2016, 3, 1)); // 2016-04-01
        const now = new Date();
        const calendarId = 'primary';
        const accessToken = await getValidAccessTokenOrThrow(supabase, userId);

        // Find earliest month not completed
        const { data: prog } = await supabase
          .from('g_event_sync_progress')
          .select('year, month, sync_status')
          .eq('user_id', userId)
          .eq('calendar_id', calendarId)
          .order('year', { ascending: true })
          .order('month', { ascending: true });
        const pad2 = (n: number) => String(n).padStart(2, '0');
        const completed = new Set<string>();
        for (const p of (prog || [])) if (p.sync_status === 'completed') completed.add(`${p.year}-${pad2(p.month)}`);

        // Determine next month to process
        let cur = new Date(START);
        let target: { year: number; month: number } | null = null;
        let guard = 0;
        while (cur <= now && guard < 1200) {
          guard++;
          const y = cur.getUTCFullYear();
          const m = cur.getUTCMonth() + 1;
          const key = `${y}-${pad2(m)}`;
          if (!completed.has(key)) { target = { year: y, month: m }; break; }
          cur.setUTCMonth(cur.getUTCMonth() + 1);
        }
        if (!target) {
          await setSyncStatus(supabase, userId, { sync_status: 'paused' });
          return json({ ok: true, message: 'No pending months' });
        }
        const { year, month } = target;
        const runId = crypto.randomUUID();
        await setPeriodStatus(
          supabase,
          'g_event_sync_progress',
          { user_id: userId, calendar_id: calendarId, year, month },
          { sync_status: 'running', started_at: ts(), error_message: null, current_run_id: runId },
          'user_id,calendar_id,year,month'
        );
        // Do not mass-update all period rows via setSyncStatus; rely on period row status
        await sendConsole(supabase, userId, runId, `Calendar: processing ${year}-${pad2(month)}`, 'milestone', 'calendar');

        const monthStart = new Date(Date.UTC(year, month - 1, 1));
        const monthEnd = new Date(Date.UTC(year, month, 0, 23, 59, 59));
        const timeMin = monthStart.toISOString();
        const timeMax = monthEnd.toISOString();

        let pageToken: string | undefined = undefined;
        let processed = 0;
        do {
          const url = new URL(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`);
          url.searchParams.set('singleEvents', 'true');
          url.searchParams.set('orderBy', 'startTime');
          url.searchParams.set('timeMin', timeMin);
          url.searchParams.set('timeMax', timeMax);
          url.searchParams.set('maxResults', '250');
          if (pageToken) url.searchParams.set('pageToken', pageToken);
          const resp = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
          if (!resp.ok) throw new Error(`Calendar list error ${resp.status}`);
          const js: any = await resp.json();
          pageToken = js.nextPageToken;
          const events: any[] = js.items || [];
          const rows = await Promise.all(events.map(async (e: any) => {
            const start = e.start?.dateTime || (e.start?.date ? new Date(e.start.date).toISOString() : null);
            const end = e.end?.dateTime || (e.end?.date ? new Date(e.end.date).toISOString() : null);
            const organizer = (e.organizer?.email || '').toLowerCase();
            const attendeeEmails = (e.attendees || []).map((a: any) => (a?.email || '').toLowerCase()).filter(Boolean);
            const matched = await matchAddresses([organizer, ...attendeeEmails]);
            processed++;
            return {
              user_id: userId,
              google_calendar_id: calendarId,
              google_event_id: e.id,
              summary: e.summary || null,
              description: e.description || null,
              start_time: start,
              end_time: end,
              organizer_email: e.organizer?.email || null,
              attendees: e.attendees ? JSON.stringify(e.attendees) : null,
              location: e.location || null,
              status: e.status || null,
              matched_emails: matched,
              updated_at: ts(),
            };
          }));
          if (rows.length) await supabase.from('g_events').upsert(rows, { onConflict: 'user_id,google_calendar_id,google_event_id' } as any);
        } while (pageToken);

        await sendConsole(supabase, userId, runId, `Month ${year}-${pad2(month)}: processed ${processed} events`, 'milestone', 'calendar');
        await setPeriodStatus(
          supabase,
          'g_event_sync_progress',
          { user_id: userId, calendar_id: calendarId, year, month },
          { sync_status: 'completed', processed_events: processed, completed_at: ts() },
          'user_id,calendar_id,year,month'
        );
        // Do not mass-update all period rows to paused
        return json({ ok: true, message: 'Calendar month synced' });
      }
      case 'pause_sync': {
        await setSyncStatus(supabase, userId, { sync_status: 'paused' });
        await sendConsole(supabase, userId, null, 'Sync paused', 'milestone', 'calendar');
        return json({ ok: true });
      }
      default:
        return json({ error: `Unknown action: ${action}` }, 400);
    }
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : 'Unknown error' }, 500);
  }
});
