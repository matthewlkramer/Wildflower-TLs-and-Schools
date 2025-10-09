// Minimal Supabase Edge Function for Gmail OAuth + status wiring
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { json, ts, sleep } from "@shared/http.ts";
import { preflight } from "@shared/cors.ts";
import { sendConsole } from "@shared/log.ts";
import { exchangeCode, getValidAccessToken, getValidAccessTokenOrThrow, refreshAccessToken } from "@shared/google-auth.ts";
// Legacy progress utilities no longer used

// Revision marker to verify deployed version in GET response and logs
const REVISION = (() => {
  const envRev = Deno.env.get('RELEASE_REV')
    || Deno.env.get('COMMIT_SHA')
    || Deno.env.get('VERCEL_GIT_COMMIT_SHA')
    || Deno.env.get('SUPABASE_FUNCTIONS_REV');
  return `gmail-sync-${envRev || new Date().toISOString()}`;
})();

const GMAIL_SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/gmail.compose",
  "https://www.googleapis.com/auth/drive.readonly"
].join(' ');

serve(async (req) => {
  const pf = preflight(req);
  if (pf) return pf;
  if (req.method === 'GET') {
    try { console.log('[gmail-sync] GET healthcheck', { revision: REVISION, now: ts() }); } catch {}
    return json({ ok: true, function: 'gmail-sync', revision: REVISION, now: ts() });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { action, code, redirect_uri, redirectUri, suppress_match } = body || {};
    const finalRedirect = redirect_uri || redirectUri || Deno.env.get('GOOGLE_REDIRECT_URI') || '';

    const authHeader = req.headers.get('Authorization') ?? '';
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseAnon = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const supabaseAuth = createClient(supabaseUrl, supabaseAnon, { global: { headers: { Authorization: authHeader } } });
    const { data: authData } = await supabaseAuth.auth.getUser();
    let userId: string | undefined = authData?.user?.id as string | undefined;
    if (!userId) {
      try {
        const m = authHeader.match(/^Bearer\s+(.+)$/i);
        const token = m ? m[1] : '';
        const [, payload] = token.split('.') as [string, string];
        const jsonStr = atob(payload.replace(/-/g,'+').replace(/_/g,'/'));
        const parsed: any = JSON.parse(jsonStr);
        userId = parsed?.sub;
      } catch (_) {}
      if (!userId) return json({ error: 'Unauthorized' }, 401);
    }

    const serviceRole = Deno.env.get('SERVICE_ROLE_KEY') ?? '';
    // User-context clients (forward Authorization) for reads that rely on auth.uid()
    const supabase = createClient(supabaseUrl, serviceRole, { global: { headers: { Authorization: authHeader } } });
    // Service-role clients for privileged writes (do not forward user Authorization)
    const supabaseSrv = createClient(supabaseUrl, serviceRole);

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
      case 'refresh_matching_views': {
        try {
          const r = await supabase.rpc('refresh_email_matching_views', {} as any);
          if (r.error) return json({ ok: false, source: 'rpc', error: r.error.message, details: (r.error as any).details || null });
          return json({ ok: true, refreshed: true });
        } catch (e: any) {
          return json({ ok: false, source: 'exception', error: e?.message || 'failed to refresh matching views', hint: 'Define gsync.refresh_email_matching_views() or refresh materialized views manually' });
        }
      }
      case 'check_gmail_scope': {
        // Validate current token scopes and a minimal Gmail API call
        try {
          const tok = await getValidAccessToken(supabase, userId);
          if (!tok) {
            return json({ ok: false, error: 'No valid access token' });
          }
          let scopes: string[] = [];
          try {
            const ti = await fetch(`https://oauth2.googleapis.com/tokeninfo?access_token=${encodeURIComponent(tok)}`);
            const tj = await ti.json().catch(() => ({}));
            const sc = (tj?.scope || '') as string;
            scopes = sc ? sc.split(/[\s,]+/).filter(Boolean) : [];
          } catch (_) {}
          const testRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/labels', {
            headers: { Authorization: `Bearer ${tok}` },
          });
          let gmailError: string | null = null;
          if (!testRes.ok) {
            try {
              const ej = await testRes.json();
              gmailError = (ej?.error?.message || `gmail labels ${testRes.status}`);
            } catch {
              gmailError = `gmail labels ${testRes.status}`;
            }
          }
          return json({ ok: testRes.ok, scopes, gmailOk: testRes.ok, gmailStatus: testRes.status, gmailError });
        } catch (e: any) {
          return json({ ok: false, error: e?.message || 'scope check failed' }, 400);
        }
      }
      case 'get_synced_through': {
        // Return the max(sent_at) for this user's emails as the synced-through timestamp
        const { data: rows } = await supabase
          .from('yg_emails')
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
        if (tok) return json({ connected: true });
        const { data: trow } = await supabase
          .from('ygoogle_auth_tokens')
          .select('user_id, access_token, refresh_token')
          .eq('user_id', userId)
          .maybeSingle();
        return json({ connected: !!trow });
      }
      case 'fetch_headers_range': {
        try {
          const nowIso = ts();
          // Fetch Gmail message headers (From/To/Cc/Bcc/Date) from start date to now; no subjects/bodies
          // Optional body.since (ISO string); if absent, read from gsync.google_sync_settings
          const sinceIso = body?.since as string | undefined;
          const { data: settings } = await supabase
            .from('ygoogle_sync_settings')
            .select('sync_start_date')
            .eq('user_id', userId)
            .maybeSingle();
          const start = sinceIso ? new Date(sinceIso) : (settings?.sync_start_date ? new Date(settings.sync_start_date) : new Date());
          // Create history row (user-initiated)
          let histId: number | null = null;
          try {
            const { data: hist } = await supabaseSrv
              .from('ygoogle_sync_history')
              .insert({
                user_id: userId,
                start_of_sync_period: start.toISOString(),
                end_of_sync_period: nowIso,
                object_type: 'email',
                initiator: 'user',
                started_at: nowIso,
              } as any)
              .select('id')
              .single();
            histId = (hist as any)?.id ?? null;
          } catch {}
          const accessToken = await getValidAccessTokenOrThrow(supabase, userId);
          const fmt = (d: Date) => `${d.getUTCFullYear()}/${String(d.getUTCMonth() + 1).padStart(2,'0')}/${String(d.getUTCDate()).padStart(2,'0')}`;
          const q = `after:${fmt(start)}`;
          let pageToken: string | undefined = undefined;
          let listed = 0;
          const toInsert: any[] = [];
          const parseHeaders = (headers: any[]): Record<string, string> => {
            const map: Record<string, string> = {};
            for (const h of headers || []) { const k = (h?.name || '').toLowerCase(); if (!k) continue; map[k] = h?.value || ''; }
            return map;
          };
          const extractEmail = (s?: string): string | null => {
            if (!s) return null;
            const m = s.match(/<([^>]+)>/);
            const raw = (m ? m[1] : s).trim().toLowerCase();
            return raw.replace(/^mailto:/, '').replace(/^"|"$/g, '');
          };
          const splitAddresses = (v?: string): string[] => (!v ? [] : v.split(',').map(a => extractEmail(a) || '').filter(Boolean));
          const upsertBatch = async () => {
            if (!toInsert.length) return;
            const { error } = await supabaseSrv
              .from('yg_emails')
              .upsert(toInsert as any, { onConflict: 'user_id,gmail_message_id', ignoreDuplicates: true } as any);
            if (error) return json({ ok: false, source: 'upsert', status: 0, error: error.message });
            toInsert.length = 0;
          };
          const startTime = Date.now();
          do {
            const listUrl = new URL('https://gmail.googleapis.com/gmail/v1/users/me/messages');
            listUrl.searchParams.set('q', q);
            listUrl.searchParams.set('maxResults', '100');
            if (pageToken) listUrl.searchParams.set('pageToken', pageToken);
            const listRes = await fetch(listUrl, { headers: { Authorization: `Bearer ${accessToken}` } });
            if (!listRes.ok) {
              const txt = await listRes.text().catch(() => '');
              return json({ ok: false, source: 'gmail-list', status: listRes.status, error: `gmail list error ${listRes.status}`, body: txt });
            }
            const listJson: any = await listRes.json();
            const ids: string[] = (listJson.messages || []).map((m: any) => m.id);
            pageToken = listJson.nextPageToken;
            for (const id of ids) {
              const detUrl = `https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}?format=metadata&metadataHeaders=From&metadataHeaders=To&metadataHeaders=Cc&metadataHeaders=Bcc&metadataHeaders=Date`;
              const detRes = await fetch(detUrl, { headers: { Authorization: `Bearer ${accessToken}` } });
              if (!detRes.ok) continue;
              const msg: any = await detRes.json();
              const headers = parseHeaders(msg.payload?.headers || []);
              const from = extractEmail(headers['from']) || '';
              const to = splitAddresses(headers['to']);
              const cc = splitAddresses(headers['cc']);
              const bcc = splitAddresses(headers['bcc']);
              const sentAt = (headers['date'] ? new Date(headers['date']) : null)?.toISOString() ?? null;
              toInsert.push({
                user_id: userId,
                gmail_message_id: msg.id,
                thread_id: msg.threadId,
                from_email: from,
                to_emails: to,
                cc_emails: cc,
                bcc_emails: bcc,
                sent_at: sentAt,
                updated_at: ts(),
              });
              if (toInsert.length >= 200) { const r = await upsertBatch(); if (r) return r; }
            }
            listed += ids.length;
            if ((Date.now() - startTime) > 6 * 60_000) break; // keep under typical function timeout
          } while (pageToken);
          const r = await upsertBatch(); if (r) return r;
          try { if (histId) await supabaseSrv.from('ygoogle_sync_history').update({ headers_fetched: listed, headers_fetch_successful: true }).eq('id', histId); } catch {}
          return json({ ok: true, listed });
        } catch (e: any) {
          try {
            await supabaseSrv.from('ygoogle_sync_history').insert({
              user_id: userId,
              object_type: 'email',
              initiator: 'user',
              started_at: ts(),
              headers_fetch_successful: false,
              headers_fetch_error: e?.message || 'unknown error',
            } as any);
          } catch {}
          return json({ ok: false, source: 'exception', status: 0, error: e?.message || 'unknown error' });
        }
      }
      
  case 'backfill_bodies_from_view': {
    try {
      const accessToken = await getValidAccessTokenOrThrow(supabase, userId);
          const batch = Number(body?.limit ?? 100);
          const { data: rows, error } = await supabase
            .from('yg_emails_full_bodies_to_download')
            .select('user_id, gmail_message_id')
            .eq('user_id', userId)
            .limit(batch);
          if (error) return json({ ok: false, source: 'select', error: error.message });
          // History row for backfill (user-initiated); approximate period from min/max sent_at for selected rows
          let histId: number | null = null;
          try {
            const mids = (rows || []).map((r: any) => r.gmail_message_id);
            let startIso: string | null = null; let endIso: string | null = ts();
            if (mids.length) {
              const { data: bounds } = await supabase
                .from('yg_emails')
                .select('sent_at')
                .eq('user_id', userId)
                .in('gmail_message_id', mids)
                .order('sent_at', { ascending: true })
                .limit(1);
              const { data: bounds2 } = await supabase
                .from('yg_emails')
                .select('sent_at')
                .eq('user_id', userId)
                .in('gmail_message_id', mids)
                .order('sent_at', { ascending: false })
                .limit(1);
              startIso = (bounds && bounds[0]?.sent_at) || null;
              endIso = (bounds2 && bounds2[0]?.sent_at) || endIso;
            }
            const { data: ins } = await supabaseSrv
              .from('ygoogle_sync_history')
              .insert({ user_id: userId, start_of_sync_period: startIso, end_of_sync_period: endIso, object_type: 'email', initiator: 'user', started_at: ts() } as any)
              .select('id')
              .single();
            histId = (ins as any)?.id ?? null;
          } catch {}
          await sendConsole(supabase, userId, null, `Backfill(view): candidates ${rows?.length ?? 0}`, 'info', 'gmail');
          if (rows && rows.length) {
            const sample = (rows as any[]).slice(0, 3).map(r => (r as any).gmail_message_id).join(',');
            await sendConsole(supabase, userId, null, `Backfill(view): sample mids ${sample}`, 'info', 'gmail');
          }
          let updated = 0;
          const candidates = (rows?.length ?? 0);
          let sample = '' as string;
          for (const r of rows || []) {
            const mid = (r as any).gmail_message_id as string;
            if (!mid) continue;
            const resp = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${mid}?format=full`, { headers: { Authorization: `Bearer ${accessToken}` } });
            if (!resp.ok) {
              await sendConsole(supabase, userId, null, `Backfill(view): mid ${mid} failed HTTP ${resp.status}`, 'error', 'gmail');
              continue;
            }
            const js: any = await resp.json();
            // Extract subject/text/html and attachments
            let subject = '';
            for (const h of (js?.payload?.headers || [])) { if ((h?.name || '').toLowerCase() === 'subject') { subject = h?.value || ''; break; } }
            const stack = [js?.payload]; let text = '', html = '';
            const attachments: Array<{ id: string; filename?: string; mimeType?: string; size?: number }> = [];
            while (stack.length) {
              const node = stack.pop(); if (!node) continue; if (node.parts) stack.push(...node.parts);
              const mime = node.mimeType || ''; const data = node.body?.data;
              if (data) {
                const bytes = base64urlToBytes(data);
                const decoded = new TextDecoder('utf-8').decode(bytes);
                if (mime.includes('text/plain')) text += decoded;
                if (mime.includes('text/html')) html += decoded;
              }
              const attachId = node.body?.attachmentId;
              if (attachId || node.filename) {
                attachments.push({ id: attachId || `${mid}-${attachments.length}`, filename: node.filename, mimeType: mime || undefined, size: node.body?.size });
              }
            }
            const { error: upErr } = await supabaseSrv.from('yg_emails').update({ subject: sanitizeText(subject) || null, body_text: sanitizeText(text) || null, body_html: sanitizeText(html) || null, updated_at: ts() }).eq('user_id', userId).eq('gmail_message_id', mid);
            if (upErr) {
              await sendConsole(supabase, userId, null, `Backfill(view): update failed for ${mid}: ${upErr.message}`, 'error', 'gmail');
              continue;
            }
            // Ensure bucket exists and upload attachments
            try { await supabaseSrv.storage.createBucket('gmail-attachments', { public: false }); } catch {}
            for (const a of attachments) {
              if (!a.id) continue;
              const attRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${mid}/attachments/${a.id}`, { headers: { Authorization: `Bearer ${accessToken}` } });
              if (!attRes.ok) continue;
              const att = await attRes.json(); // { data: base64url, size }
              const contentBase64 = (att?.data || '').replace(/-/g, '+').replace(/_/g, '/');
              const bin = Uint8Array.from(atob(contentBase64), c => c.charCodeAt(0));
              const safeName = (a.filename || 'attachment').replace(/[^a-zA-Z0-9._-]+/g,'_');
              const key = `${userId}/${mid}/${a.id}-${safeName}`;
              await supabase.storage.from('gmail-attachments').upload(key, new Blob([bin], { type: a.mimeType || 'application/octet-stream' }), { upsert: true });
              await supabaseSrv.from('yg_email_attachments').upsert({
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
            updated++;
          }
          await sendConsole(supabase, userId, null, `Backfill(view): updated ${updated}`, 'info', 'gmail');
          // Update history
          try { if (histId) await supabaseSrv.from('ygoogle_sync_history').update({ backfill_downloads: updated, backfill_download_successful: true }).eq('id', histId); } catch {}
          // If we likely reached the end (updated < batch), trigger final MV refresh (best-effort)
          if (updated < batch) {
            try { await supabase.rpc('refresh_emails_with_people_ids', {} as any); } catch {}
          }
          return json({ ok: true, updated, candidates });
        } catch (e: any) {
          try {
            await supabaseSrv.from('ygoogle_sync_history').insert({ user_id: userId, object_type: 'email', initiator: 'user', started_at: ts(), backfill_download_successful: false, backfill_error: e?.message || 'backfill from view failed' } as any);
          } catch {}
          return json({ ok: false, source: 'exception', error: e?.message || 'backfill from view failed' });
        }
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

function base64urlToBytes(data: string): Uint8Array {
  try {
    let s = data.replace(/-/g, '+').replace(/_/g, '/');
    const pad = s.length % 4;
    if (pad) s += '='.repeat(4 - pad);
    const bin = atob(s);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes;
  } catch {
    return new Uint8Array();
  }
}

function sanitizeText(input: string | null | undefined): string | null {
  if (input == null) return null;
  try {
    let s = input.normalize('NFKC');
    s = s.replace(/\u00A0/g, ' ');
    // remove control chars except tab/newline/carriage-return
    s = s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '');
    return s;
  } catch {
    return input as any;
  }
}
