// Minimal Supabase Edge Function for Gmail OAuth + status wiring
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { json, ts, sleep } from "@shared/http.ts";
import { preflight } from "@shared/cors.ts";
import { sendConsole } from "@shared/log.ts";
import { exchangeCode, getValidAccessToken, getValidAccessTokenOrThrow } from "@shared/google-auth.ts";
import { setSyncStatus, setPeriodStatus } from "@shared/progress.ts";

const GMAIL_SCOPES = "https://www.googleapis.com/auth/gmail.readonly";

serve(async (req) => {
  const pf = preflight(req);
  if (pf) return pf;
  if (req.method === 'GET') return json({ ok: true, function: 'gmail-sync', now: ts() });

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

    // Helpers for filtering
    const INTERNAL_DOMAINS = ['wildflowerschools.org', 'blackwildflowers.org'];
    let allowSet: Set<string> | null = null;
    const getAllowSet = async (): Promise<Set<string>> => {
      if (allowSet) return allowSet;
      const { data } = await supabase.from('email_filter_addresses').select('email');
      allowSet = new Set((data || []).map((r: any) => String(r.email || '').toLowerCase()));
      return allowSet;
    };
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
    const isInternal = (email: string) => INTERNAL_DOMAINS.some(d => email.endsWith('@' + d));
    const matchAddresses = async (addresses: string[]): Promise<string[]> => {
      const set = await getAllowSet();
      const externals = addresses.filter(e => !isInternal(e));
      return externals.filter(e => set.has(e));
    };

    switch (action) {
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
        // Weekly batching from 2016-04-01
        const START = new Date(Date.UTC(2016, 3, 1));
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
          const addressUnion = Array.from(new Set([from, ...to, ...cc, ...bcc])).filter(Boolean);
          const matched = await matchAddresses(addressUnion);
          const keep = matched.length > 0;
          if (keep) {
            // fetch full for bodies
            const fullRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=full`, { headers: { Authorization: `Bearer ${accessToken}` } });
            let bodies = { text: undefined as string | undefined, html: undefined as string | undefined };
            if (fullRes.ok) {
              const full = await fullRes.json();
              bodies = extractParts(full.payload);
            }
            rows.push({
              user_id: userId,
              gmail_message_id: msg.id,
              thread_id: msg.threadId,
              from_email: from,
              to_emails: to,
              cc_emails: cc,
              bcc_emails: bcc,
              matched_emails: matched,
              subject,
              body_text: bodies.text || null,
              body_html: bodies.html || null,
              sent_at: sentAt,
              updated_at: ts(),
            });
            included++;
          } else {
            // store header-only minimal record to avoid re-checking
            rows.push({
              user_id: userId,
              gmail_message_id: msg.id,
              thread_id: msg.threadId,
              from_email: from,
              to_emails: to,
              cc_emails: cc,
              bcc_emails: bcc,
              matched_emails: matched,
              subject: null,
              body_text: null,
              body_html: null,
              sent_at: sentAt,
              updated_at: ts(),
            });
          }
          processed++;
          }
          if (rows.length) await supabase.from('g_emails').upsert(rows, { onConflict: 'gmail_message_id' });
        } while (pageToken);

        await sendConsole(supabase, userId, runId, `Processed ${processed} messages (${included} stored)`, 'milestone', 'gmail');
        await setPeriodStatus(
          supabase,
          'g_email_sync_progress',
          { user_id: userId, year, week },
          { sync_status: 'completed', processed_messages: included, completed_at: ts() },
          'user_id,year,week'
        );
        return json({ ok: true, message: 'Week synced' });
      }
      case 'rescan_matched_emails': {
        const limit = Math.max(1, Math.min(5000, Number((body && body.limit) || 1000)));
        // Select recent emails for this user; prefer ones missing matches
        const { data: rows } = await supabase
          .from('g_emails')
          .select('gmail_message_id, from_email, to_emails, cc_emails, bcc_emails, matched_emails, updated_at')
          .eq('user_id', userId)
          .order('updated_at', { ascending: false })
          .limit(limit);
        let updated = 0;
        const upserts: any[] = [];
        for (const r of rows || []) {
          const union = Array.from(new Set([
            (r.from_email || '').toLowerCase(),
            ...((r.to_emails || []).map((x: string) => (x || '').toLowerCase())),
            ...((r.cc_emails || []).map((x: string) => (x || '').toLowerCase())),
            ...((r.bcc_emails || []).map((x: string) => (x || '').toLowerCase())),
          ])).filter(Boolean);
          const matched = await matchAddresses(union);
          upserts.push({ user_id: userId, gmail_message_id: r.gmail_message_id, matched_emails: matched, updated_at: ts() });
          updated++;
        }
        if (upserts.length) await supabase.from('g_emails').upsert(upserts, { onConflict: 'gmail_message_id' });
        await sendConsole(supabase, userId, null, `Rescanned matched_emails for ${updated} messages`, 'info', 'gmail');
        return json({ ok: true, rescanned: updated });
      }
            case 'rescan_matches': {
        const { data: candidates } = await supabase
          .from('g_emails')
          .select('gmail_message_id, from_email, to_emails, cc_emails, bcc_emails')
          .eq('user_id', userId)
          .is('body_text', null)
          .limit(5000);
        const set = await getAllowSet();
        let enq = 0;
        for (const r of candidates || []) {
          const union = Array.from(new Set([
            (r.from_email || '').toLowerCase(),
            ...((r.to_emails || []).map((x: string) => (x || '').toLowerCase())),
            ...((r.cc_emails || []).map((x: string) => (x || '').toLowerCase())),
            ...((r.bcc_emails || []).map((x: string) => (x || '').toLowerCase())),
          ])).filter(Boolean);
          const externals = union.filter(e => !INTERNAL_DOMAINS.some(d => e.endsWith('@' + d)));
          if (externals.some(e => set.has(e))) {
            await supabase.from('g_email_backfill_queue').upsert({ user_id: userId, gmail_message_id: r.gmail_message_id } as any, { onConflict: 'user_id,gmail_message_id' } as any);
            enq++;
          }
        }
        return json({ ok: true, enqueued: enq });
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
          const bodies = extractParts(full.payload);
          await supabase.from('g_emails').update({ body_text: bodies.text || null, body_html: bodies.html || null, updated_at: ts() }).eq('user_id', userId).eq('gmail_message_id', mid);
          await supabase.from('g_email_backfill_queue').update({ status: 'done', last_attempt_at: ts(), attempts: 1, error_message: null }).eq('user_id', userId).eq('gmail_message_id', mid);
          done++;
        }
        return json({ ok: true, backfilled: done });
      }
      case 'pause_sync': {
        await sendConsole(supabase, userId, null, 'Sync paused', 'milestone', 'gmail');
        return json({ ok: true });
      }
      default:
        return json({ error: `Unknown action: ${action}` }, 400);
    }
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : 'Unknown error' }, 500);
  }
});



