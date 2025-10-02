import React, { useEffect, useMemo, useState } from 'react';
import { supabase, fromGsync } from '@/core/supabase/client';
import { Button } from '@/shared/components/ui/button';

const GMAIL_FN = 'gmail-sync';
const CAL_FN = 'gcal-sync';

// Progress/messages tables removed; rely on base tables + history

type SyncStatus = 'not_started' | 'running' | 'paused' | 'completed' | 'error';
type Service = 'gmail' | 'calendar';

type GmailProgressRow = {
  user_id: string;
  run_id: string | null;
  year: number;
  week: number;
  sync_status: SyncStatus;
  error_message: string | null;
  total_messages?: number | null;
  processed_messages?: number | null;
  started_at?: string | null;
  completed_at?: string | null;
  updated_at?: string | null;
  current_run_id?: string | null;
};

type CalendarProgressRow = {
  user_id: string;
  run_id: string | null;
  year: number;
  month: number;
  sync_status: SyncStatus;
  error_message: string | null;
  total_events?: number | null;
  processed_events?: number | null;
  started_at?: string | null;
  completed_at?: string | null;
  updated_at?: string | null;
  current_run_id?: string | null;
};

type ConsoleRow = {
  id: string;
  service: Service;
  message: string;
  created_at: string;
};

export type GoogleSyncNotification = { type: 'info' | 'error'; text: string };

export type GoogleSyncSummary = {
  gmailSyncedThrough: string;
  gmailMostRecent: string;
  calendarSyncedThrough: string;
  calendarMostRecent: string;
};

export interface GoogleSyncSectionProps {
  onNotify?: (note: GoogleSyncNotification) => void;
  onSyncSummary?: (summary: GoogleSyncSummary) => void;
  // Current sync start ISO (YYYY-MM-DD or full ISO). Used to decide if manual sync should unlock.
  syncStartIso?: string;
}

const buttonStyle: React.CSSProperties = {
  padding: '6px 10px',
  borderRadius: 4,
  border: '1px solid #cbd5e1',
  background: '#ffffff',
  color: '#0f172a',
  fontSize: 13,
};

const primaryButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  background: '#1d4ed8',
  border: '1px solid #1d4ed8',
  color: '#fff',
};

function disabledStyle(base: React.CSSProperties, disabled: boolean) {
  if (!disabled) return base;
  return { ...base, opacity: 0.6, cursor: 'not-allowed' };
}

const badgeStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '2px 6px',
  borderRadius: 12,
  border: '1px solid #d1d5db',
  background: '#f3f4f6',
  fontSize: 12,
};

const sectionCard: React.CSSProperties = {
  border: '1px solid #e2e8f0',
  borderRadius: 6,
  background: '#ffffff',
  color: '#0f172a',
  padding: 16,
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
};

function formatIso(iso?: string | null) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return '';
  }
}

function formatStatus(status?: SyncStatus | null) {
  if (!status) return 'unknown';
  return status.replace(/_/g, ' ');
}

export function GoogleSyncSection({ onNotify, onSyncSummary, syncStartIso }: GoogleSyncSectionProps) {
  const notify = (type: 'info' | 'error', text: string) => onNotify?.({ type, text });

  const [connected, setConnected] = useState(false);
  const [checkingConn, setCheckingConn] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [lastVerified, setLastVerified] = useState('');
  const [diag, setDiag] = useState<{ gmail: string; calendar: string }>({ gmail: '-', calendar: '-' });
  const [rev, setRev] = useState<{ gmail?: string; calendar?: string; at?: string }>({});
  const [revLoading, setRevLoading] = useState(false);
  const [test, setTest] = useState<{ gmail?: string; calendar?: string; at?: string }>({});
  const [testLoading, setTestLoading] = useState(false);
  const [health, setHealth] = useState<{ accessValid?: boolean; refreshPresent?: boolean; at?: string; error?: string }>({});

  const [gmailSyncedThrough, setGmailSyncedThrough] = useState('');
  const [gmailMostRecent, setGmailMostRecent] = useState('');

  const [calSyncedThrough, setCalSyncedThrough] = useState('');
  const [calMostRecent, setCalMostRecent] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [backfillBatch, setBackfillBatch] = useState<number>(100);
  const [gmailInitialDone, setGmailInitialDone] = useState(false);
  const [calInitialDone, setCalInitialDone] = useState(false);
  // Deprecated catch-up queue removed

  // Debug console removed for clean UI

  // Periodic background checks (every 2 minutes): connection + token health
  useEffect(() => {
    const id = window.setInterval(() => {
      checkConnection();
      // fire-and-forget token health
      (async () => {
        try {
          const base = (import.meta as any).env.VITE_SUPABASE_URL?.replace(/\/+$/, '') + '/functions/v1';
          const { data: { session } } = await supabase.auth.getSession();
          const token = session?.access_token || '';
          const headers: Record<string,string> = { 'Content-Type': 'application/json' };
          if (token) headers.Authorization = `Bearer ${token}`;
          const r = await fetch(`${base}/gcal-sync`, { method: 'POST', headers, body: JSON.stringify({ action: 'token_health' }) });
          const js = await r.json().catch(() => ({}));
          setHealth({ accessValid: !!js.accessValid, refreshPresent: !!js.refreshPresent, at: new Date().toLocaleString() } as any);
        } catch {}
      })();
    }, 120000);
    return () => window.clearInterval(id);
  }, []);

  const authHeaders = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (!token) throw new Error('You must be signed in to use Google sync.');
    return { Authorization: `Bearer ${token}` };
  };

  const addConsole = (_service: Service, message: string) => notify('info', message);

  const checkConnection = async () => {
    try {
      setCheckingConn(true);
      const headers = await authHeaders();
      const [gmailRes, calRes] = await Promise.allSettled([
        supabase.functions.invoke(GMAIL_FN, { body: { action: 'get_connection_status' }, headers }),
        supabase.functions.invoke(CAL_FN, { body: { action: 'get_connection_status' }, headers }),
      ]);
      const gmailOk = gmailRes.status === 'fulfilled' && Boolean((gmailRes.value as any)?.data?.connected);
      const calOk = calRes.status === 'fulfilled' && Boolean((calRes.value as any)?.data?.connected);
      const gmailDiag = gmailRes.status === 'fulfilled' ? `gmail-sync: ${gmailOk ? 'connected' : 'not connected'}` : `gmail-sync: error`;
      const calDiag = calRes.status === 'fulfilled' ? `gcal-sync: ${calOk ? 'connected' : 'not connected'}` : `gcal-sync: error`;
      let ok = gmailOk || calOk;
      // Fallback: if functions error or report not connected, check tokens table directly
      if (!ok) {
        const { data: u } = await supabase.auth.getUser();
        const uid = u.user?.id;
        if (uid) {
          const { data: tokenRow } = await (fromGsync('google_auth_tokens') as any)
            .select('user_id, expires_at')
            .eq('user_id', uid)
            .maybeSingle();
          if (tokenRow) ok = true;
          setDiag({ gmail: gmailDiag, calendar: calDiag });
        }
      } else {
        setDiag({ gmail: gmailDiag, calendar: calDiag });
      }
      setConnected(ok);
      setLastVerified(ok ? new Date().toLocaleString() : '');
      if (!ok) {
        notify('info', 'Google is not connected yet. Use "Connect Google" to authorize.');
      }
    } catch (e: any) {
      setConnected(false);
      setLastVerified('');
      notify('error', e?.message || 'Unable to verify Google connection.');
    } finally {
      setCheckingConn(false);
    }
  };

  const loadSyncedThroughBadges = async () => {
    try {
      const { data: u } = await supabase.auth.getUser();
      const uid = u.user?.id;
      if (!uid) return;

      const summary: GoogleSyncSummary = {
        gmailSyncedThrough: '',
        gmailMostRecent: '',
        calendarSyncedThrough: '',
        calendarMostRecent: '',
      };

      // Gmail base table aggregation
      try {
        const { data: g1 } = await (fromGsync('g_emails') as any)
          .select('sent_at, updated_at')
          .eq('user_id', uid)
          .order('sent_at', { ascending: false, nullsFirst: false })
          .limit(1);
        const { data: g2 } = await (fromGsync('g_emails') as any)
          .select('updated_at')
          .eq('user_id', uid)
          .order('updated_at', { ascending: false, nullsFirst: false })
          .limit(1);
        const sent = g1?.[0]?.sent_at || null;
        const upd = g2?.[0]?.updated_at || null;
        if (sent) {
          const d = new Date(sent);
          const through = `${d.getUTCMonth() + 1}/${d.getUTCDate()}/${d.getUTCFullYear()}`;
          setGmailSyncedThrough(through);
          summary.gmailSyncedThrough = through;
        } else { setGmailSyncedThrough(''); }
        setGmailMostRecent(upd ? new Date(upd).toLocaleString() : '');
        summary.gmailMostRecent = upd ? new Date(upd).toLocaleString() : '';
      } catch {}

      // Calendar base table aggregation
      try {
        const { data: c1 } = await (fromGsync('g_events') as any)
          .select('start_time, updated_at')
          .eq('user_id', uid)
          .order('start_time', { ascending: false, nullsFirst: false })
          .limit(1);
        const { data: c2 } = await (fromGsync('g_events') as any)
          .select('updated_at')
          .eq('user_id', uid)
          .order('updated_at', { ascending: false, nullsFirst: false })
          .limit(1);
        const start = c1?.[0]?.start_time || null;
        const upd2 = c2?.[0]?.updated_at || null;
        if (start) {
          const d = new Date(start);
          const through = `${d.getUTCMonth() + 1}/${d.getUTCDate()}/${d.getUTCFullYear()}`;
          setCalSyncedThrough(through);
          summary.calendarSyncedThrough = through;
        } else { setCalSyncedThrough(''); }
        setCalMostRecent(upd2 ? new Date(upd2).toLocaleString() : '');
        summary.calendarMostRecent = upd2 ? new Date(upd2).toLocaleString() : '';
      } catch {}

      onSyncSummary?.(summary);
    } catch (e: any) {
      notify('error', e?.message || 'Unable to load sync progress.');
    }
  };

  const loadBackfillBatch = async () => {
    const { data: u } = await supabase.auth.getUser();
    const uid = u.user?.id;
    if (!uid) return;
    const { data } = await (fromGsync('google_sync_settings') as any)
      .select('backfill_batch_size')
      .eq('user_id', uid)
      .maybeSingle();
    const val = Number(data?.backfill_batch_size || 100);
    if (!Number.isFinite(val) || val <= 0) setBackfillBatch(100);
    else setBackfillBatch(Math.min(500, Math.max(1, Math.floor(val))));
  };

  const refreshManualState = async () => {
    try {
      const { data: u } = await supabase.auth.getUser();
      const uid = u.user?.id;
      if (!uid) return;
      // Determine if a user-initiated fetch has completed for each service at or after current start
      const startIso = syncStartIso || undefined;
      let startDateFloor: Date | null = null;
      if (startIso) {
        const s = new Date(startIso);
        startDateFloor = new Date(Date.UTC(s.getUTCFullYear(), s.getUTCMonth(), s.getUTCDate()));
      }
      const within = (iso?: string | null) => {
        if (!startDateFloor) return true;
        if (!iso) return false;
        return new Date(iso) >= startDateFloor;
      };
      const { data: hist } = await (fromGsync('google_sync_history') as any)
        .select('object_type, headers_fetch_successful, start_of_sync_period')
        .eq('user_id', uid)
        .eq('initiator', 'user')
        .order('id', { ascending: false })
        .limit(50);
      const mailOk = (hist || []).some((r: any) => r.object_type === 'email' && r.headers_fetch_successful === true && within(r.start_of_sync_period));
      const calOk = (hist || []).some((r: any) => r.object_type === 'event' && r.headers_fetch_successful === true && within(r.start_of_sync_period));
      setGmailInitialDone(mailOk);
      setCalInitialDone(calOk);
    } catch {}
  };

  const refreshGmailStatus = async () => { await loadSyncedThroughBadges(); };
  const refreshCalStatus = async () => { await loadSyncedThroughBadges(); };

  const connectGoogle = async () => {
    setConnecting(true);
    try {
      const headers = await authHeaders();
      const redirectUri = `${window.location.origin}/settings`;
      // Request combined Gmail + Calendar scopes via Calendar function
      const { data, error } = await supabase.functions.invoke(CAL_FN, {
        body: { action: 'get_auth_url', redirectUri },
        headers,
      });
      if (error) throw new Error(error.message || 'Failed to request authorization URL');
      const url = data?.auth_url;
      if (!url) throw new Error('Authorization URL not returned. Check Supabase function configuration.');
      window.location.href = url;
    } catch (e: any) {
      notify('error', e?.message || 'Unable to start Google authorization.');
    } finally {
      setConnecting(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    // Clean UI: remove realtime subscriptions and debug polling

    const init = async () => {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get('code');
        const state = url.searchParams.get('state');
        if (code) {
          const headers = await authHeaders();
          const fn = state === 'gcal-sync' ? CAL_FN : GMAIL_FN;
          await supabase.functions.invoke(fn, {
            body: { action: 'exchange_code', code, redirectUri: `${window.location.origin}/settings` },
            headers,
          });
          url.searchParams.delete('code');
          url.searchParams.delete('state');
          window.history.replaceState({}, document.title, url.pathname + (url.search ? `?${url.searchParams.toString()}` : ''));
          notify('info', 'Google account connected.');
          setConnected(true);
          setLastVerified(new Date().toLocaleString());
          // Small delay to allow token upsert to commit before verification
          await new Promise((r) => setTimeout(r, 300));
        }
      } catch (e: any) {
        notify('error', e?.message || 'Failed to complete Google authorization.');
      }
      await checkConnection();
      // Re-check shortly after in case of eventual consistency
      setTimeout(() => { checkConnection(); }, 1000);
      setTimeout(() => { checkConnection(); }, 3000);
      await refreshGmailStatus();
      await refreshCalStatus();
      await refreshManualState();
    };

    init();
    loadBackfillBatch();

    return () => {
      mounted = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // When start date changes (e.g., moved earlier), re-evaluate manual sync gating
    refreshManualState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [syncStartIso]);

  const actionButton = (opts: { label: string; onClick: () => void | Promise<void>; service: Service; disabled?: boolean }) => (
    <button
      type="button"
      style={disabledStyle(buttonStyle, Boolean(opts.disabled))}
      onClick={async () => {
        try {
          await opts.onClick();
        } catch (e: any) {
          addConsole(opts.service, `${opts.label} failed: ${e?.message || String(e)}`);
        }
      }}
      disabled={opts.disabled}
    >
      {opts.label}
    </button>
  );

  const gmailStatus = useMemo(() => {
    if (!gmailSyncedThrough && !gmailMostRecent) return 'No runs yet';
    const parts = [
      gmailSyncedThrough ? `Synced through: ${gmailSyncedThrough}` : null,
      gmailMostRecent ? `Most recent: ${gmailMostRecent}` : null,
    ].filter(Boolean) as string[];
    return parts.join(' · ');
  }, [gmailSyncedThrough, gmailMostRecent]);

  const calendarStatus = useMemo(() => {
    if (!calSyncedThrough && !calMostRecent) return 'No runs yet';
    const parts = [
      calSyncedThrough ? `Synced through: ${calSyncedThrough}` : null,
      calMostRecent ? `Most recent: ${calMostRecent}` : null,
    ].filter(Boolean) as string[];
    return parts.join(' · ');
  }, [calSyncedThrough, calMostRecent]);

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ ...sectionCard, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <strong>Google Connection</strong>
          <span style={{ fontSize: 13, color: '#0f172a' }}>
            {checkingConn
              ? 'Checking connection...'
              : connected
                ? `Connected${lastVerified ? ` (verified ${lastVerified})` : ''}`
                : 'Not connected'}
          </span>
          <div style={{ fontSize: 11, color: '#475569' }}>
            <div>{diag.gmail}</div>
            <div>{diag.calendar}</div>
            {health?.at ? (
              <div style={{ marginTop: 4 }}>
                <div>token access valid: {String((health as any).accessValid)}</div>
                <div>token refresh present: {String((health as any).refreshPresent)}</div>
                <div>checked: {(health as any).at}</div>
              </div>
            ) : null}
          </div>
          <div style={{ marginTop: 8 }}>
            <button
              type="button"
              style={disabledStyle(buttonStyle, false)}
              onClick={() => setShowAdvanced((s) => !s)}
            >
              {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
            </button>
          </div>
          {showAdvanced && (
            <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <label style={{ fontSize: 12, color: '#334155' }}>Backfill batch size</label>
              <input
                type="number"
                min={1}
                max={500}
                value={backfillBatch}
                onChange={(e) => setBackfillBatch(Math.min(500, Math.max(1, Number(e.target.value) || 1)))}
                style={{ width: 80, padding: 4, border: '1px solid #cbd5e1', borderRadius: 4 }}
              />
              <button
                type="button"
                style={disabledStyle(buttonStyle, false)}
                onClick={async () => {
                  const { data: u } = await supabase.auth.getUser();
                  const uid = u.user?.id;
                  if (!uid) return;
                  const { error } = await (fromGsync('google_sync_settings') as any)
                    .upsert({ user_id: uid, backfill_batch_size: backfillBatch } as any, { onConflict: 'user_id' } as any);
                  if (error) notify('error', `Save failed: ${error.message}`);
                  else notify('info', 'Saved backfill batch size');
                }}
              >
                Save
              </button>
            </div>
          )}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {/* Recheck removed; connection auto-checks */}
          <button
            type="button"
            style={disabledStyle(primaryButtonStyle, connecting)}
            onClick={connectGoogle}
            disabled={connecting}
          >
            {connecting ? 'Opening...' : 'Connect Google'}
          </button>
          <button
            type="button"
            style={disabledStyle(buttonStyle, revLoading)}
            onClick={async () => {
              try {
                setRevLoading(true);
                const base = (import.meta as any).env.VITE_SUPABASE_URL?.replace(/\/+$/, '') + '/functions/v1';
                const { data: { session } } = await supabase.auth.getSession();
                const token = session?.access_token || '';
                const headers: Record<string,string> = {};
                if (token) headers.Authorization = `Bearer ${token}`;
                const req = (path: string) => fetch(`${base}${path}`, { headers }).then(async (r) => {
                  try { return await r.json(); } catch { return { error: `status ${r.status}` }; }
                });
                const [gr, cr] = await Promise.all([ req('/gmail-sync'), req('/gcal-sync') ]);
                setRev({
                  gmail: (gr && (gr.revision || gr.error)) || '-',
                  calendar: (cr && (cr.revision || cr.error)) || '-',
                  at: new Date().toLocaleString(),
                });
              } catch (e) {
                setRev({ gmail: 'error', calendar: 'error', at: new Date().toLocaleString() });
              } finally {
                setRevLoading(false);
              }
            }}
            disabled={revLoading}
          >
            {revLoading ? 'Checking…' : 'Check function revisions'}
          </button>
          <button
            type="button"
            style={disabledStyle(buttonStyle, testLoading)}
            onClick={async () => {
              try {
                setTestLoading(true);
                const base = (import.meta as any).env.VITE_SUPABASE_URL?.replace(/\/+$/, '') + '/functions/v1';
                const { data: { session } } = await supabase.auth.getSession();
                const token = session?.access_token || '';
                const headers: Record<string,string> = { 'Content-Type': 'application/json' };
                if (token) headers.Authorization = `Bearer ${token}`;
                const post = (path: string) => fetch(`${base}${path}`, { method: 'POST', headers, body: JSON.stringify({ action: 'get_connection_status' }) })
                  .then(async (r) => { try { return await r.json(); } catch { return { error: `status ${r.status}` }; } });
                const [gs, cs] = await Promise.all([ post('/gmail-sync'), post('/gcal-sync') ]);
                const fmt = (x: any) => (typeof x?.connected === 'boolean' ? String(x.connected) : (x?.error || 'unknown'));
                setTest({ gmail: fmt(gs), calendar: fmt(cs), at: new Date().toLocaleString() });
              } catch (_) {
                setTest({ gmail: 'error', calendar: 'error', at: new Date().toLocaleString() });
              } finally {
                setTestLoading(false);
              }
            }}
            disabled={testLoading}
          >
            {testLoading ? 'Testing…' : 'Test function status'}
          </button>
          <button
            type="button"
            style={disabledStyle(buttonStyle, false)}
            onClick={async () => {
              try {
                const base = (import.meta as any).env.VITE_SUPABASE_URL?.replace(/\/+$/, '') + '/functions/v1';
                const { data: { session } } = await supabase.auth.getSession();
                const token = session?.access_token || '';
                const headers: Record<string,string> = { 'Content-Type': 'application/json' };
                if (token) headers.Authorization = `Bearer ${token}`;
                const r = await fetch(`${base}/gcal-sync`, { method: 'POST', headers, body: JSON.stringify({ action: 'token_health' }) });
                const js = await r.json().catch(() => ({}));
                setDiag((d) => ({ ...d }));
                setHealth({ accessValid: !!js.accessValid, refreshPresent: !!js.refreshPresent, at: new Date().toLocaleString() } as any);
              } catch (e: any) {
                setHealth({ error: e?.message || 'error', at: new Date().toLocaleString() } as any);
              }
            }}
          >
            Check token health
          </button>
          {/* Force Reconnect removed for clean UI */}
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gap: 16,
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        }}
      >
        <div style={sectionCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong>Gmail</strong>
            {gmailSyncedThrough && (
              <span style={badgeStyle}>Synced through {gmailSyncedThrough}</span>
            )}
          </div>
          <span style={{ fontSize: 13, color: '#0f172a' }}>{gmailStatus}</span>
          {gmailMostRecent && (
            <span style={{ fontSize: 12, color: '#4b5563' }}>Most recent sync: {gmailMostRecent}</span>
          )}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {actionButton({
              label: 'Fetch Headers (all)',
              service: 'gmail',
              onClick: async () => {
                const headers = await authHeaders();
                const { data, error } = await supabase.functions.invoke(GMAIL_FN, { body: { action: 'fetch_headers_range' }, headers });
                if (error) {
                  addConsole('gmail', `Fetch headers error: ${error.message}`);
                } else if (data && data.ok === false) {
                  const msg = [data.source, data.status, data.error].filter(Boolean).join(' | ');
                  addConsole('gmail', `Fetch headers error: ${msg}`);
                } else {
                  addConsole('gmail', `Headers listed: ${data?.listed ?? '?'}`);
                  await refreshManualState();
                }
              },
              disabled: gmailInitialDone,
            })}
            {actionButton({
              label: 'Refresh Matching Views',
              service: 'gmail',
              onClick: async () => {
                const headers = await authHeaders();
                const { data, error } = await supabase.functions.invoke(GMAIL_FN, { body: { action: 'refresh_matching_views' }, headers });
                if (error) {
                  addConsole('gmail', `Refresh matching views error: ${error.message}`);
                } else if (data && data.ok === false) {
                  const parts = [data.source, data.error, data.details, data.hint].filter(Boolean).join(' | ');
                  addConsole('gmail', `Refresh matching views error: ${parts}`);
                } else {
                  addConsole('gmail', 'Matching views refreshed');
                }
              },
            })}
            {actionButton({
              label: 'Backfill Bodies (view)',
              service: 'gmail',
              onClick: async () => {
                const headers = await authHeaders();
                const { data, error } = await supabase.functions.invoke(GMAIL_FN, { body: { action: 'backfill_bodies_from_view', limit: backfillBatch }, headers });
                if (error) {
                  addConsole('gmail', `Backfill (view) error: ${error.message}`);
                } else {
                  const c = data?.candidates ?? '?';
                  const u = data?.updated ?? 0;
                  addConsole('gmail', `Backfill (view): candidates ${c}, updated ${u} (press again for next ${backfillBatch})`);
                }
              },
            })}
          </div>
          {/* */}
        </div>

        <div style={sectionCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong>Calendar</strong>
            {calSyncedThrough && (
              <span style={badgeStyle}>Synced through {calSyncedThrough}</span>
            )}
          </div>
          <span style={{ fontSize: 13, color: '#0f172a' }}>{calendarStatus}</span>
          {calMostRecent && (
            <span style={{ fontSize: 12, color: '#4b5563' }}>Most recent sync: {calMostRecent}</span>
          )}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {actionButton({
              label: 'Fetch Events (all)',
              service: 'calendar',
              onClick: async () => {
                const headers = await authHeaders();
                const { data, error } = await supabase.functions.invoke(CAL_FN, { body: { action: 'fetch_headers_range' }, headers });
                if (error) addConsole('calendar', `Fetch events error: ${error.message}`);
                else if (data && data.ok === false) addConsole('calendar', `Fetch events error: ${data?.source || ''} | ${data?.status || ''} | ${data?.error || ''}`);
                else {
                  addConsole('calendar', `Events upserted: ${data?.upserted ?? '?'}`);
                  await refreshManualState();
                }
              },
              disabled: calInitialDone,
            })}
            {actionButton({
              label: 'Refresh Calendar Views',
              service: 'calendar',
              onClick: async () => {
                const headers = await authHeaders();
                const { data, error } = await supabase.functions.invoke(CAL_FN, { body: { action: 'refresh_matching_views' }, headers });
                if (error) addConsole('calendar', `Refresh calendar views error: ${error.message}`);
                else if (data && data.ok === false) addConsole('calendar', `Refresh calendar views error: ${data?.source || ''} | ${data?.error || ''}`);
                else addConsole('calendar', 'Calendar views refreshed');
              },
            })}
            {actionButton({
              label: 'Backfill Events (view)',
              service: 'calendar',
              onClick: async () => {
                const headers = await authHeaders();
                const { data, error } = await supabase.functions.invoke(CAL_FN, { body: { action: 'backfill_from_view', limit: backfillBatch }, headers });
                if (error) addConsole('calendar', `Backfill events error: ${error.message}`);
                else addConsole('calendar', `Backfill events updated: ${data?.updated ?? 0} (press again for next ${backfillBatch})`);
              },
            })}
            {actionButton({
              label: 'Refresh Matches',
              service: 'calendar',
              onClick: async () => {
                const { data: u } = await supabase.auth.getUser();
                const uid = u.user?.id;
                if (!uid) throw new Error('Missing user id');
                await (supabase.rpc as any)('refresh_g_events_matches', { p_user_id: uid, p_since: null, p_merge: false });
                addConsole('calendar', 'Refresh matches triggered');
              },
            })}
          </div>
          {/* */}
        </div>
      </div>
    </section>
  );
}

export default GoogleSyncSection;


