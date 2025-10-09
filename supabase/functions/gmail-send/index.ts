// Gmail send/draft edge function
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { json } from "@shared/http.ts";
import { preflight } from "@shared/cors.ts";
import { getValidAccessTokenOrThrow } from "@shared/google-auth.ts";

serve(async (req) => {
  const pf = preflight(req);
  if (pf) return pf;

  try {
    const body = await req.json().catch(() => ({}));
    const { from, to = [], cc = [], bcc = [], subject = '', body: emailBody = '', draft = false } = body || {};

    const authHeader = req.headers.get('Authorization') ?? '';
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseAnon = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseAnon, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: authData } = await supabase.auth.getUser();
    let userId: string | undefined = authData?.user?.id as string | undefined;

    if (!userId) {
      // Fallback: try to extract from JWT
      try {
        const m = authHeader.match(/^Bearer\s+(.+)$/i);
        const token = m ? m[1] : '';
        const [, payload] = token.split('.') as [string, string];
        const jsonStr = atob(payload.replace(/-/g,'+').replace(/_/g,'/'));
        const parsed: any = JSON.parse(jsonStr);
        userId = parsed?.sub;
      } catch (_) {}
      if (!userId) {
        return json({ error: 'Unauthorized' }, 401);
      }
    }

    const accessToken = await getValidAccessTokenOrThrow(supabase, userId);

    // Convert to/cc/bcc to arrays if they're strings
    const toArray = Array.isArray(to) ? to : (to ? [to] : []);
    const ccArray = Array.isArray(cc) ? cc : (cc ? [cc] : []);
    const bccArray = Array.isArray(bcc) ? bcc : (bcc ? [bcc] : []);

    // Build RFC 2822 message
    const headers: string[] = [];
    if (from) headers.push(`From: ${from}`);
    if (toArray.length) headers.push(`To: ${toArray.join(', ')}`);
    if (ccArray.length) headers.push(`Cc: ${ccArray.join(', ')}`);
    if (bccArray.length) headers.push(`Bcc: ${bccArray.join(', ')}`);
    headers.push(`Subject: ${subject}`);
    headers.push('MIME-Version: 1.0');
    headers.push('Content-Type: text/plain; charset="UTF-8"');

    const raw = btoa(headers.join('\r\n') + '\r\n\r\n' + (emailBody || ''))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    if (draft) {
      // Create draft
      const resp = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/drafts', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: { raw }
        }),
      });

      if (!resp.ok) {
        const errorText = await resp.text();
        console.error('Gmail draft error:', resp.status, errorText);
        let errorMsg = `Gmail draft failed ${resp.status}`;
        try {
          const errJson = JSON.parse(errorText);
          if (errJson?.error?.message) {
            errorMsg = errJson.error.message;
          }
        } catch {}
        return json({ error: errorMsg, details: errorText }, resp.status);
      }

      const result = await resp.json();
      return json({ ok: true, draft: true, id: result?.id });
    } else {
      // Send email
      const resp = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ raw }),
      });

      if (!resp.ok) {
        const errorText = await resp.text();
        return json({ error: `Gmail send failed ${resp.status}: ${errorText}` }, resp.status);
      }

      const result = await resp.json();
      return json({ ok: true, sent: true, id: result?.id });
    }
  } catch (e) {
    console.error('gmail-send error:', e);
    return json({ error: e instanceof Error ? e.message : 'Unknown error' }, 500);
  }
});
