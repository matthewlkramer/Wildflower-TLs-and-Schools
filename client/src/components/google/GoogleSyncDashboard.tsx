// Copied from /google/GoogleSyncDashboard.tsx to make it available within Vite root
// Source: google/GoogleSyncDashboard.tsx

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Wifi, WifiOff, Mail, Calendar as CalendarIcon,
  AlertCircle, Play, Pause, Square
} from "lucide-react";

const GMAIL_FN = "gmail-sync";
const CAL_FN = "gcal-sync";

const SYNC_MESSAGES_TABLE = "google_sync_messages";
const GMAIL_WEEKLY_TABLE = "g_email_sync_progress";
const CAL_MONTHLY_TABLE  = "g_event_sync_progress";

type SyncStatus = "not_started" | "running" | "paused" | "completed" | "error";
type Service = "gmail" | "calendar";

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

type ConsoleFilter = "all" | "gmail" | "calendar";

const fmtTime = (iso?: string) => iso ? new Date(iso).toLocaleTimeString() : new Date().toLocaleTimeString();

export function GoogleSyncDashboard() {
  const { toast } = useToast();

  const [connected, setConnected] = useState(false);
  const [checkingConn, setCheckingConn] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [lastVerified, setLastVerified] = useState<string>("");

  const [gmailRow, setGmailRow] = useState<GmailProgressRow | null>(null);
  const gmailRunId = gmailRow?.current_run_id ?? gmailRow?.run_id ?? null;
  const gmailRunning = gmailRow?.sync_status === "running";
  const [gmailStarting, setGmailStarting] = useState(false);
  const [gmailPausing, setGmailPausing] = useState(false);
  const [gmailUserPaused, setGmailUserPaused] = useState(false);
  const [gmailSyncedThrough, setGmailSyncedThrough] = useState<string>("");

  const [calRow, setCalRow] = useState<CalendarProgressRow | null>(null);
  const calRunId = calRow?.current_run_id ?? calRow?.run_id ?? null;
  const calRunning = calRow?.sync_status === "running";
  const [calStarting, setCalStarting] = useState(false);
  const [calPausing, setCalPausing] = useState(false);
  const [calUserPaused, setCalUserPaused] = useState(false);
  const [calSyncedThrough, setCalSyncedThrough] = useState<string>("");

  const [consoleRows, setConsoleRows] = useState<ConsoleRow[]>([]);
  const [consoleFilter, setConsoleFilter] = useState<ConsoleFilter>("all");
  const consoleEndRef = useRef<HTMLDivElement>(null);
  const componentMountISO = useRef<string>(new Date().toISOString());
  const autoRestartTimer = useRef<number | null>(null);

  const seenIds = useRef<{ gmail: Set<string>; calendar: Set<string> }>({ gmail: new Set(), calendar: new Set() });
  const lastSeenAt = useRef<{ gmail: string | null; calendar: string | null }>({ gmail: null, calendar: null });
  const pollTimers = useRef<{ gmail: number | null; calendar: number | null }>({ gmail: null, calendar: null });

  const authHeaders = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) throw new Error("Not authenticated");
    return { Authorization: `Bearer ${session.access_token}` };
  };

  const addConsole = (service: Service, message: string, created_at?: string) => {
    setConsoleRows(prev => [ ...prev, { id: `${service}-${crypto.randomUUID()}`, service, message: `[${fmtTime(created_at)}] ${message}` , created_at: created_at ?? new Date().toISOString() } ]);
  };
  const pushDbConsole = (service: Service, row: { id: string; message: string; created_at: string }) => {
    setConsoleRows(prev => [ ...prev, { id: row.id, service, message: `[${fmtTime(row.created_at)}] ${row.message}`, created_at: row.created_at } ]);
  };
  const clearConsole = () => setConsoleRows([]);

  useEffect(() => { consoleEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [consoleRows]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      // Handle OAuth return: exchange ?code for tokens
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get('code');
        const state = url.searchParams.get('state');
        if (code) {
          const headers = await authHeaders();
          const fn = state === 'gcal-sync' ? CAL_FN : GMAIL_FN;
          await supabase.functions.invoke(fn, { body: { action: 'exchange_code', code, redirectUri: window.location.origin + '/google-sync' }, headers });
          // Clean URL
          url.searchParams.delete('code');
          url.searchParams.delete('state');
          window.history.replaceState({}, document.title, url.pathname + (url.search ? '?' + url.searchParams.toString() : ''));
          setConnected(true);
        }
      } catch (e) {
        console.warn('[OAuth] exchange_code failed', e);
      }
      await checkConnection();
      await refreshGmailStatus();
      await refreshCalStatus();
      await loadSyncedThroughBadges();
    };
    load();

    (async () => {
      const { data: u } = await supabase.auth.getUser();
      const uid = u.user?.id;
      if (!uid) return;
      const gmailChan = supabase
        .channel(`gmail-weekly-${uid}`)
        .on("postgres_changes", { event: "*", schema: "public", table: GMAIL_WEEKLY_TABLE, filter: `user_id=eq.${uid}` }, () => { if (mounted) refreshGmailStatus(); })
        .subscribe();
      const calChan = supabase
        .channel(`cal-monthly-${uid}`)
        .on("postgres_changes", { event: "*", schema: "public", table: CAL_MONTHLY_TABLE, filter: `user_id=eq.${uid}` }, () => { if (mounted) refreshCalStatus(); })
        .subscribe();
      return () => { supabase.removeChannel(gmailChan); supabase.removeChannel(calChan); };
    })();

    return () => {
      mounted = false;
      if (pollTimers.current.gmail) window.clearTimeout(pollTimers.current.gmail);
      if (pollTimers.current.calendar) window.clearTimeout(pollTimers.current.calendar);
      if (autoRestartTimer.current) window.clearTimeout(autoRestartTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!gmailRunId) return;
    let ch: ReturnType<typeof supabase.channel> | null = null;
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      const uid = u.user?.id;
      if (!uid) return;
      ch = supabase
        .channel(`sync-messages-gmail-${uid}-${gmailRunId}`)
        .on("postgres_changes", { event: "INSERT", schema: "public", table: SYNC_MESSAGES_TABLE, filter: `user_id=eq.${uid},run_id=eq.${gmailRunId},sync_type=eq.gmail` }, (payload) => {
          const row: any = payload.new;
          if (!row?.id || !row?.message || !row?.created_at) return;
          if (seenIds.current.gmail.has(row.id)) return;
          seenIds.current.gmail.add(row.id);
          lastSeenAt.current.gmail = row.created_at;
          pushDbConsole("gmail", row);
          // maybeAutoRestart("gmail", row.message, row.created_at);
        })
        .subscribe();

      const poll = async () => {
        const { data: u } = await supabase.auth.getUser();
        const uid = u.user?.id;
        if (!uid) return;
        const q = supabase
          .from(SYNC_MESSAGES_TABLE)
          .select("id, message, created_at")
          .eq("user_id", uid)
          .eq("sync_type", "gmail")
          .order("created_at", { ascending: true })
          .limit(1000);
        const { data: rows } = await q;
        if (rows?.length) {
          for (const r of rows) {
            if (seenIds.current.gmail.has(r.id)) continue;
            seenIds.current.gmail.add(r.id);
            lastSeenAt.current.gmail = r.created_at;
            pushDbConsole("gmail", r);
          }
        }
        pollTimers.current.gmail = window.setTimeout(poll, 10000);
      };
      pollTimers.current.gmail = window.setTimeout(poll, 1000);
    })();
    return () => { if (ch) supabase.removeChannel(ch); if (pollTimers.current.gmail) window.clearTimeout(pollTimers.current.gmail); };
  }, [gmailRunId]);

  useEffect(() => {
    if (!calRunId) return;
    let ch: ReturnType<typeof supabase.channel> | null = null;
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      const uid = u.user?.id; if (!uid) return;
      ch = supabase
        .channel(`sync-messages-cal-${uid}-${calRunId}`)
        .on("postgres_changes", { event: "INSERT", schema: "public", table: SYNC_MESSAGES_TABLE, filter: `user_id=eq.${uid},run_id=eq.${calRunId},sync_type=eq.calendar` }, (payload) => {
          const row: any = payload.new;
          if (!row?.id || !row?.message || !row?.created_at) return;
          if (seenIds.current.calendar.has(row.id)) return;
          seenIds.current.calendar.add(row.id);
          lastSeenAt.current.calendar = row.created_at;
          pushDbConsole("calendar", row);
        })
        .subscribe();
      const poll = async () => {
        const { data: u } = await supabase.auth.getUser();
        const uid = u.user?.id; if (!uid) return;
        const { data: rows } = await supabase
          .from(SYNC_MESSAGES_TABLE)
          .select("id, message, created_at")
          .eq("user_id", uid)
          .eq("sync_type", "calendar")
          .order("created_at", { ascending: true })
          .limit(1000);
        if (rows?.length) {
          for (const r of rows) {
            if (seenIds.current.calendar.has(r.id)) continue;
            seenIds.current.calendar.add(r.id);
            lastSeenAt.current.calendar = r.created_at;
            pushDbConsole("calendar", r);
          }
        }
        pollTimers.current.calendar = window.setTimeout(poll, 10000);
      };
      pollTimers.current.calendar = window.setTimeout(poll, 1000);
    })();
    return () => { if (ch) supabase.removeChannel(ch); if (pollTimers.current.calendar) window.clearTimeout(pollTimers.current.calendar); };
  }, [calRunId]);

  const checkConnection = async () => {
    try {
      setCheckingConn(true);
      const headers = await authHeaders();
      const { data, error } = await supabase.functions.invoke(GMAIL_FN, { body: { action: "get_connection_status" }, headers });
      if (error) { setConnected(false); setLastVerified(""); return; }
      const ok = Boolean(data?.connected);
      setConnected(ok);
      setLastVerified(ok ? new Date().toLocaleString() : "");
    } catch { setConnected(false); setLastVerified(""); } finally { setCheckingConn(false); }
  };

  const refreshGmailStatus = async () => {
    const { data: u } = await supabase.auth.getUser();
    const uid = u.user?.id; if (!uid) return;
    const { data: rows } = await supabase
      .from(GMAIL_WEEKLY_TABLE)
      .select("*")
      .eq("user_id", uid)
      .order("started_at", { ascending: false, nullsFirst: false })
      .order("updated_at", { ascending: false, nullsFirst: false })
      .limit(1);
    setGmailRow(rows?.[0] ?? null);
  };

  const refreshCalStatus = async () => {
    const { data: u } = await supabase.auth.getUser();
    const uid = u.user?.id; if (!uid) return;
    const { data: rows } = await supabase
      .from(CAL_MONTHLY_TABLE)
      .select("*")
      .eq("user_id", uid)
      .order("started_at", { ascending: false, nullsFirst: false })
      .order("updated_at", { ascending: false, nullsFirst: false })
      .limit(1);
    setCalRow(rows?.[0] ?? null);
  };

  const loadSyncedThroughBadges = async () => {
    const { data: u } = await supabase.auth.getUser();
    const uid = u.user?.id; if (!uid) return;
    const { data: w } = await supabase
      .from(GMAIL_WEEKLY_TABLE)
      .select("year, week, completed_at")
      .eq("user_id", uid)
      .eq("sync_status", "completed")
      .order("year", { ascending: false })
      .order("week", { ascending: false })
      .limit(1);
    if (w?.[0]?.completed_at) {
      const date = new Date(w[0].completed_at);
      setGmailSyncedThrough(date.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }));
    }
    const { data: m } = await supabase
      .from(CAL_MONTHLY_TABLE)
      .select("year, month, completed_at")
      .eq("user_id", uid)
      .eq("sync_status", "completed")
      .order("year", { ascending: false })
      .order("month", { ascending: false })
      .limit(1);
    if (m?.[0]?.completed_at) {
      const date = new Date(m[0].completed_at);
      setCalSyncedThrough(date.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }));
    }
  };

  const connectGoogle = async () => {
    setConnecting(true);
    try {
      const headers = await authHeaders().catch(() => { throw new Error('You must be signed in to connect Google'); });
      const redirectUri = `${window.location.origin}/google-sync`;
      const { data, error } = await supabase.functions.invoke(GMAIL_FN, {
        body: { action: "get_auth_url", redirectUri },
        headers,
      });
      if (error) throw new Error(error.message || 'Failed to request authorization URL');
      const url = data?.auth_url;
      if (!url) throw new Error(data?.error || 'No authorization URL returned. Check server secrets and redirect URI.');
      window.location.href = url;
    } catch (e: any) {
      toast({ title: 'Google connect failed', description: e?.message || String(e), variant: 'destructive' });
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Card className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {connected ? <Wifi className="text-green-600" /> : <WifiOff className="text-red-600" />}
          <div>
            <div className="font-medium">Google Connection</div>
            <div className="text-sm text-muted-foreground">{connected ? `Verified ${lastVerified}` : 'Not connected'}</div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={checkConnection} variant="secondary" disabled={checkingConn}>{checkingConn ? 'Checking...' : 'Recheck'}</Button>
          <Button onClick={connectGoogle} disabled={connecting}>{connecting ? 'Opening...' : 'Connect Google'}</Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4 space-y-3">
          <div className="flex items-center gap-2"><Mail size={18} /><div className="font-semibold">Gmail</div></div>
          <div className="flex items-center gap-2">
            <Badge variant={gmailRunning ? 'default' : 'secondary'}>{gmailRow?.sync_status ?? 'not_started'}</Badge>
            {gmailSyncedThrough && <div className="text-xs text-muted-foreground">Synced through {gmailSyncedThrough}</div>}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={async()=>{
                try {
                  setGmailStarting(true);
                  const headers = await authHeaders();
                  const { data, error } = await supabase.functions.invoke(GMAIL_FN, { body: { action: 'start_sync' }, headers });
                  if (error) throw new Error(error.message || 'Failed to start Gmail sync');
                  toast({ title: 'Gmail sync started', description: data?.message || 'Processing…' });
                  // brief delay then refresh status
                  setTimeout(() => { refreshGmailStatus(); }, 300);
                } catch (e: any) {
                  toast({ title: 'Gmail start failed', description: e?.message || String(e), variant: 'destructive' });
                } finally {
                  setGmailStarting(false);
                }
              }}
              disabled={!connected || gmailRunning || gmailStarting}
            >{gmailRunning ? 'Running…' : (gmailStarting ? 'Starting…' : 'Start')}</Button>
            <Button
              onClick={async()=>{
                try {
                  setGmailPausing(true);
                  const headers = await authHeaders();
                  const { error } = await supabase.functions.invoke(GMAIL_FN, { body: { action: 'pause_sync' }, headers });
                  if (error) throw new Error(error.message || 'Failed to pause Gmail');
                  setTimeout(() => { refreshGmailStatus(); }, 300);
                } catch (e: any) {
                  toast({ title: 'Gmail pause failed', description: e?.message || String(e), variant: 'destructive' });
                } finally {
                  setGmailPausing(false);
                }
              }}
              variant="secondary"
              disabled={!gmailRunning || gmailPausing}
            >{gmailPausing ? 'Pausing…' : 'Pause'}</Button>
          </div>
          <div className="h-48 overflow-auto bg-muted/30 rounded p-2 text-xs font-mono">
            {consoleRows.filter(r=>r.service==='gmail').map(r=> (<div key={r.id}>{r.message}</div>))}
            <div ref={consoleEndRef} />
          </div>
        </Card>

        <Card className="p-4 space-y-3">
          <div className="flex items-center gap-2"><CalendarIcon size={18} /><div className="font-semibold">Calendar</div></div>
          <div className="flex items-center gap-2">
            <Badge variant={calRunning ? 'default' : 'secondary'}>{calRow?.sync_status ?? 'not_started'}</Badge>
            {calSyncedThrough && <div className="text-xs text-muted-foreground">Synced through {calSyncedThrough}</div>}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={async()=>{
                try {
                  setCalStarting(true);
                  const headers = await authHeaders();
                  const { data, error } = await supabase.functions.invoke(CAL_FN, { body: { action: 'start_sync' }, headers });
                  if (error) throw new Error(error.message || 'Failed to start Calendar sync');
                  toast({ title: 'Calendar sync started', description: data?.message || 'Processing…' });
                  setTimeout(() => { refreshCalStatus(); }, 300);
                } catch (e: any) {
                  toast({ title: 'Calendar start failed', description: e?.message || String(e), variant: 'destructive' });
                } finally {
                  setCalStarting(false);
                }
              }}
              disabled={!connected || calRunning || calStarting}
            >{calRunning ? 'Running…' : (calStarting ? 'Starting…' : 'Start')}</Button>
            <Button
              onClick={async()=>{
                try {
                  setCalPausing(true);
                  const headers = await authHeaders();
                  const { error } = await supabase.functions.invoke(CAL_FN, { body: { action: 'pause_sync' }, headers });
                  if (error) throw new Error(error.message || 'Failed to pause Calendar');
                  setTimeout(() => { refreshCalStatus(); }, 300);
                } catch (e: any) {
                  toast({ title: 'Calendar pause failed', description: e?.message || String(e), variant: 'destructive' });
                } finally {
                  setCalPausing(false);
                }
              }}
              variant="secondary"
              disabled={!calRunning || calPausing}
            >{calPausing ? 'Pausing…' : 'Pause'}</Button>
          </div>
          <div className="h-48 overflow-auto bg-muted/30 rounded p-2 text-xs font-mono">
            {consoleRows.filter(r=>r.service==='calendar').map(r=> (<div key={r.id}>{r.message}</div>))}
            <div ref={consoleEndRef} />
          </div>
        </Card>
      </div>
    </div>
  );
}

export default GoogleSyncDashboard;
