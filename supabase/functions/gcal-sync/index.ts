// Minimal Supabase Edge Function for Google Calendar OAuth + status wiring
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { json, ts } from "@shared/http.ts";
import { preflight } from "@shared/cors.ts";
import { sendConsole } from "@shared/log.ts";
import { exchangeCode, getValidAccessToken } from "@shared/google-auth.ts";
import { setSyncStatus } from "@shared/progress.ts";

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
        await setSyncStatus(supabase, userId, { sync_status: 'running', started_at: ts(), error_message: null });
        await sendConsole(supabase, userId, crypto.randomUUID(), 'Starting Calendar sync...', 'milestone', 'calendar');
        await sendConsole(supabase, userId, null, 'Auto-paused (placeholder sync).', 'milestone', 'calendar');
        await setSyncStatus(supabase, userId, { sync_status: 'paused' });
        return json({ ok: true, message: 'Sync started (placeholder)' });
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
