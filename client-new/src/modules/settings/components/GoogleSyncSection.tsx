import React, { useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

const GMAIL_FN = 'gmail-sync';
const CAL_FN = 'gcal-sync';

const SYNC_MESSAGES_TABLE = 'google_sync_messages';
const GMAIL_WEEKLY_TABLE = 'g_email_sync_progress';
const CAL_MONTHLY_TABLE = 'g_event_sync_progress';

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
}

const buttonStyle: React.CSSProperties = {
  padding: '6px 10px',
  borderRadius: 4,
  border: '1px solid #cbd5f5',
  background: '#f8fafc',
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
  border: '1px solid #d1d5db',
  borderRadius: 6,
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

export function GoogleSyncSection({ onNotify, onSyncSummary }: GoogleSyncSectionProps) {
  const notify = (type: 'info' | 'error', text: string) => onNotify?.({ type, text });

  const [connected, setConnected] = useState(false);
  const [checkingConn, setCheckingConn] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [lastVerified, setLastVerified] = useState('');

  const [gmailRow, setGmailRow] = useState<GmailProgressRow | null>(null);
  const gmailRunId = gmailRow?.current_run_id ?? gmailRow?.run_id ?? null;
  const [gmailSyncedThrough, setGmailSyncedThrough] = useState('');
  const [gmailMostRecent, setGmailMostRecent] = useState('');

  const [calRow, setCalRow] = useState<CalendarProgressRow | null>(null);
  const calRunId = calRow?.current_run_id ?? calRow?.run_id ?? null;
  const [calSyncedThrough, setCalSyncedThrough] = useState('');
  const [calMostRecent, setCalMostRecent] = useState('');

  const [consoleRows, setConsoleRows] = useState<ConsoleRow[]>([]);
  const consoleEndRef = useRef<HTMLDivElement>(null);
  const pollTimers = useRef<{ gmail: number | null; calendar: number | null }>({ gmail: null, calendar: null });
  const seenIds = useRef<{ gmail: Set<string>; calendar: Set<string> }>({ gmail: new Set(), calendar: new Set() });

  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [consoleRows]);

  const authHeaders = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (!token) throw new Error('You must be signed in to use Google sync.');
    return { Authorization: `Bearer ${token}` };
  };

  const addConsole = (service: Service, message: string, created_at?: string) => {
    setConsoleRows(prev => [
      ...prev,
      {
        id: `${service}-${crypto.randomUUID()}`,
        service,
        message: `[${new Date(created_at ?? Date.now()).toLocaleTimeString()}] ${message}`,
        created_at: created_at ?? new Date().toISOString(),
      },
    ]);
  };

  const pushDbConsole = (service: Service, row: { id: string; message: string; created_at: string }) => {
    setConsoleRows(prev => {
      if (prev.some(r => r.id === row.id)) return prev;
      return [
        ...prev,
        {
          id: row.id,
          service,
          message: `[${new Date(row.created_at).toLocaleTimeString()}] ${row.message}`,
          created_at: row.created_at,
        },
      ];
    });
  };

  const checkConnection = async () => {
    try {
      setCheckingConn(true);
      const headers = await authHeaders();
      const { data, error } = await supabase.functions.invoke(GMAIL_FN, { body: { action: 'get_connection_status' }, headers });
      if (error) throw new Error(error.message || 'Unable to verify connection');
      const ok = Boolean(data?.connected);
      setConnected(ok);
      setLastVerified(ok ? new Date().toLocaleString() : '');
      if (!ok) {
        notify('info', 'Google is not connected yet. Use “Connect Google” to authorize.');
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

      const { data: gmailData } = await (supabase.from as any)(GMAIL_WEEKLY_TABLE)
        .select('year, week, completed_at, updated_at')
        .eq('user_id', uid)
        .eq('sync_status', 'completed')
        .order('year', { ascending: false })
        .order('week', { ascending: false })
        .limit(1);
      if (gmailData?.[0]) {
        const y = gmailData[0].year;
        const wk = gmailData[0].week;
        const base = new Date(Date.UTC(y, 0, 1 + (wk - 1) * 7));
        const dow = base.getUTCDay() || 7;
        const weekStart = new Date(base);
        if (dow <= 4) weekStart.setUTCDate(base.getUTCDate() - base.getUTCDay() + 1);
        else weekStart.setUTCDate(base.getUTCDate() + 8 - base.getUTCDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setUTCDate(weekStart.getUTCDate() + 6);
        const fmt = (d: Date) => `${d.getUTCMonth() + 1}/${d.getUTCDate()}/${d.getUTCFullYear()}`;
        const through = fmt(weekEnd);
        setGmailSyncedThrough(through);
        summary.gmailSyncedThrough = through;
        const mostRecent = gmailData[0].updated_at || gmailData[0].completed_at;
        const mostRecentFormatted = mostRecent ? new Date(mostRecent).toLocaleString() : '';
        setGmailMostRecent(mostRecentFormatted);
        summary.gmailMostRecent = mostRecentFormatted;
      } else {
        setGmailSyncedThrough('');
        setGmailMostRecent('');
      }

      const { data: calData } = await (supabase.from as any)(CAL_MONTHLY_TABLE)
        .select('year, month, completed_at, updated_at')
        .eq('user_id', uid)
        .eq('sync_status', 'completed')
        .order('year', { ascending: false })
        .order('month', { ascending: false })
        .limit(1);
      if (calData?.[0]) {
        const y = calData[0].year;
        const mo = calData[0].month;
        const monthEnd = new Date(Date.UTC(y, mo, 0));
        const fmt = (d: Date) => `${d.getUTCMonth() + 1}/${d.getUTCDate()}/${d.getUTCFullYear()}`;
        const through = fmt(monthEnd);
        setCalSyncedThrough(through);
        summary.calendarSyncedThrough = through;
        const mostRecent = calData[0].updated_at || calData[0].completed_at;
        const mostRecentFormatted = mostRecent ? new Date(mostRecent).toLocaleString() : '';
        setCalMostRecent(mostRecentFormatted);
        summary.calendarMostRecent = mostRecentFormatted;
      } else {
        setCalSyncedThrough('');
        setCalMostRecent('');
      }

      onSyncSummary?.(summary);
    } catch (e: any) {
      notify('error', e?.message || 'Unable to load sync progress.');
    }
  };

  const refreshGmailStatus = async () => {
    const { data: u } = await supabase.auth.getUser();
    const uid = u.user?.id;
    if (!uid) return;
    const { data: rows, error } = await (supabase.from as any)(GMAIL_WEEKLY_TABLE)
      .select('*')
      .eq('user_id', uid)
      .order('started_at', { ascending: false, nullsFirst: false })
      .order('updated_at', { ascending: false, nullsFirst: false })
      .limit(1);
    if (error) {
      notify('error', error.message || 'Unable to load Gmail sync status.');
      return;
    }
    setGmailRow(rows?.[0] ?? null);
    await loadSyncedThroughBadges();
  };

  const refreshCalStatus = async () => {
    const { data: u } = await supabase.auth.getUser();
    const uid = u.user?.id;
    if (!uid) return;
    const { data: rows, error } = await (supabase.from as any)(CAL_MONTHLY_TABLE)
      .select('*')
      .eq('user_id', uid)
      .order('started_at', { ascending: false, nullsFirst: false })
      .order('updated_at', { ascending: false, nullsFirst: false })
      .limit(1);
    if (error) {
      notify('error', error.message || 'Unable to load Calendar sync status.');
      return;
    }
    setCalRow(rows?.[0] ?? null);
    await loadSyncedThroughBadges();
  };

  const connectGoogle = async () => {
    setConnecting(true);
    try {
      const headers = await authHeaders();
      const redirectUri = `${window.location.origin}/settings`;
      const { data, error } = await supabase.functions.invoke(GMAIL_FN, {
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
    let gmailChan: ReturnType<typeof supabase.channel> | null = null;
    let calChan: ReturnType<typeof supabase.channel> | null = null;

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
        }
      } catch (e: any) {
        notify('error', e?.message || 'Failed to complete Google authorization.');
      }
      await checkConnection();
      await refreshGmailStatus();
      await refreshCalStatus();
    };

    const setupSubscriptions = async () => {
      const { data: u } = await supabase.auth.getUser();
      const uid = u.user?.id;
      if (!uid) return;
      gmailChan = supabase
        .channel(`gmail-weekly-${uid}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: GMAIL_WEEKLY_TABLE, filter: `user_id=eq.${uid}` }, () => {
          if (mounted) refreshGmailStatus();
        })
        .subscribe();
      calChan = supabase
        .channel(`cal-monthly-${uid}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: CAL_MONTHLY_TABLE, filter: `user_id=eq.${uid}` }, () => {
          if (mounted) refreshCalStatus();
        })
        .subscribe();
    };

    init();
    setupSubscriptions();

    return () => {
      mounted = false;
      if (gmailChan) supabase.removeChannel(gmailChan);
      if (calChan) supabase.removeChannel(calChan);
      if (pollTimers.current.gmail) window.clearTimeout(pollTimers.current.gmail);
      if (pollTimers.current.calendar) window.clearTimeout(pollTimers.current.calendar);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!gmailRunId) return;
    let channel: ReturnType<typeof supabase.channel> | null = null;
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      const uid = u.user?.id;
      if (!uid) return;
      channel = supabase
        .channel(`sync-messages-gmail-${uid}-${gmailRunId}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: SYNC_MESSAGES_TABLE, filter: `user_id=eq.${uid},run_id=eq.${gmailRunId},sync_type=eq.gmail` }, (payload) => {
          const row: any = payload.new;
          if (!row?.id || !row?.message || !row?.created_at) return;
          if (seenIds.current.gmail.has(row.id)) return;
          seenIds.current.gmail.add(row.id);
          pushDbConsole('gmail', row);
        })
        .subscribe();

      const poll = async () => {
        const { data: u2 } = await supabase.auth.getUser();
        const uid2 = u2.user?.id;
        if (!uid2) return;
        const { data: rows } = await (supabase.from as any)(SYNC_MESSAGES_TABLE)
          .select('id, message, created_at')
          .eq('user_id', uid2)
          .eq('sync_type', 'gmail')
          .order('created_at', { ascending: true })
          .limit(1000);
        if (rows?.length) {
          for (const r of rows) {
            if (seenIds.current.gmail.has(r.id)) continue;
            seenIds.current.gmail.add(r.id);
            pushDbConsole('gmail', r);
          }
        }
        pollTimers.current.gmail = window.setTimeout(poll, 10000);
      };
      pollTimers.current.gmail = window.setTimeout(poll, 1000);
    })();

    return () => {
      if (channel) supabase.removeChannel(channel);
      if (pollTimers.current.gmail) {
        window.clearTimeout(pollTimers.current.gmail);
        pollTimers.current.gmail = null;
      }
    };
  }, [gmailRunId]);

  useEffect(() => {
    if (!calRunId) return;
    let channel: ReturnType<typeof supabase.channel> | null = null;
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      const uid = u.user?.id;
      if (!uid) return;
      channel = supabase
        .channel(`sync-messages-cal-${uid}-${calRunId}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: SYNC_MESSAGES_TABLE, filter: `user_id=eq.${uid},run_id=eq.${calRunId},sync_type=eq.calendar` }, (payload) => {
          const row: any = payload.new;
          if (!row?.id || !row?.message || !row?.created_at) return;
          if (seenIds.current.calendar.has(row.id)) return;
          seenIds.current.calendar.add(row.id);
          pushDbConsole('calendar', row);
        })
        .subscribe();

      const poll = async () => {
        const { data: u2 } = await supabase.auth.getUser();
        const uid2 = u2.user?.id;
        if (!uid2) return;
        const { data: rows } = await (supabase.from as any)(SYNC_MESSAGES_TABLE)
          .select('id, message, created_at')
          .eq('user_id', uid2)
          .eq('sync_type', 'calendar')
          .order('created_at', { ascending: true })
          .limit(1000);
        if (rows?.length) {
          for (const r of rows) {
            if (seenIds.current.calendar.has(r.id)) continue;
            seenIds.current.calendar.add(r.id);
            pushDbConsole('calendar', r);
          }
        }
        pollTimers.current.calendar = window.setTimeout(poll, 10000);
      };
      pollTimers.current.calendar = window.setTimeout(poll, 1000);
    })();

    return () => {
      if (channel) supabase.removeChannel(channel);
      if (pollTimers.current.calendar) {
        window.clearTimeout(pollTimers.current.calendar);
        pollTimers.current.calendar = null;
      }
    };
  }, [calRunId]);

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
    if (!gmailRow) return 'No runs yet';
    const parts = [
      `Status: ${formatStatus(gmailRow.sync_status)}`,
      gmailRow.updated_at ? `Updated: ${formatIso(gmailRow.updated_at)}` : null,
      gmailRow.processed_messages != null && gmailRow.total_messages != null
        ? `Processed ${gmailRow.processed_messages}/${gmailRow.total_messages}`
        : null,
      gmailRow.error_message ? `Error: ${gmailRow.error_message}` : null,
    ].filter(Boolean);
    return parts.join(' • ');
  }, [gmailRow]);

  const calendarStatus = useMemo(() => {
    if (!calRow) return 'No runs yet';
    const parts = [
      `Status: ${formatStatus(calRow.sync_status)}`,
      calRow.updated_at ? `Updated: ${formatIso(calRow.updated_at)}` : null,
      calRow.processed_events != null && calRow.total_events != null
        ? `Processed ${calRow.processed_events}/${calRow.total_events}`
        : null,
      calRow.error_message ? `Error: ${calRow.error_message}` : null,
    ].filter(Boolean);
    return parts.join(' • ');
  }, [calRow]);

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ ...sectionCard, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <strong>Google Connection</strong>
          <span style={{ fontSize: 13, color: '#374151' }}>
            {checkingConn
              ? 'Checking connection...'
              : connected
                ? `Connected${lastVerified ? ` (verified ${lastVerified})` : ''}`
                : 'Not connected'}
          </span>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            type="button"
            style={disabledStyle(buttonStyle, checkingConn)}
            onClick={checkConnection}
            disabled={checkingConn}
          >
            {checkingConn ? 'Checking...' : 'Recheck'}
          </button>
          <button
            type="button"
            style={disabledStyle(primaryButtonStyle, connecting)}
            onClick={connectGoogle}
            disabled={connecting}
          >
            {connecting ? 'Opening...' : 'Connect Google'}
          </button>
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
          <span style={{ fontSize: 13, color: '#374151' }}>{gmailStatus}</span>
          {gmailMostRecent && (
            <span style={{ fontSize: 12, color: '#4b5563' }}>Most recent sync: {gmailMostRecent}</span>
          )}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {actionButton({
              label: 'Run Week',
              service: 'gmail',
              onClick: async () => {
                const headers = await authHeaders();
                await supabase.functions.invoke(GMAIL_FN, { body: { action: 'start_sync' }, headers });
                addConsole('gmail', 'Weekly sync started');
              },
            })}
            {actionButton({
              label: 'Backfill Bodies + Attachments',
              service: 'gmail',
              onClick: async () => {
                const headers = await authHeaders();
                await supabase.functions.invoke(GMAIL_FN, { body: { action: 'backfill_matched' }, headers });
                addConsole('gmail', 'Backfill started for matched emails');
              },
            })}
            {actionButton({
              label: 'Refresh Matches',
              service: 'gmail',
              onClick: async () => {
                const { data: u } = await supabase.auth.getUser();
                const uid = u.user?.id;
                if (!uid) throw new Error('Missing user id');
                await (supabase.rpc as any)('refresh_g_emails_matches', { p_user_id: uid, p_since: null, p_merge: false });
                addConsole('gmail', 'Refresh matches triggered');
              },
            })}
          </div>
          <div
            style={{
              maxHeight: 200,
              overflowY: 'auto',
              background: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: 4,
              padding: 8,
              fontFamily: 'monospace',
              fontSize: 12,
            }}
          >
            {consoleRows
              .filter((r) => r.service === 'gmail')
              .map((r) => (
                <div key={r.id}>{r.message}</div>
              ))}
            <div ref={consoleEndRef} />
          </div>
        </div>

        <div style={sectionCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong>Calendar</strong>
            {calSyncedThrough && (
              <span style={badgeStyle}>Synced through {calSyncedThrough}</span>
            )}
          </div>
          <span style={{ fontSize: 13, color: '#374151' }}>{calendarStatus}</span>
          {calMostRecent && (
            <span style={{ fontSize: 12, color: '#4b5563' }}>Most recent sync: {calMostRecent}</span>
          )}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {actionButton({
              label: 'Run Month',
              service: 'calendar',
              onClick: async () => {
                const headers = await authHeaders();
                await supabase.functions.invoke(CAL_FN, { body: { action: 'start_sync' }, headers });
                addConsole('calendar', 'Monthly sync started');
              },
            })}
            {actionButton({
              label: 'Backfill Attachments',
              service: 'calendar',
              onClick: async () => {
                const headers = await authHeaders();
                await supabase.functions.invoke(CAL_FN, { body: { action: 'backfill_event_attachments' }, headers });
                addConsole('calendar', 'Backfill attachments started');
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
          <div
            style={{
              maxHeight: 200,
              overflowY: 'auto',
              background: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: 4,
              padding: 8,
              fontFamily: 'monospace',
              fontSize: 12,
            }}
          >
            {consoleRows
              .filter((r) => r.service === 'calendar')
              .map((r) => (
                <div key={r.id}>{r.message}</div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default GoogleSyncSection;
