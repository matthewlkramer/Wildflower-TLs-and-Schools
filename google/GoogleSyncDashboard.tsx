// Note to Claude: can you dramatically simplify how the console polling is handled? Right now it is almost 300 lines of code with multiple levels of backup. Seems like there must be a simpler way


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

/** =========================
 *  Config
 *  ========================== */
const GMAIL_FN = "gmail-sync";
const CAL_FN = "gcal-sync";

const SYNC_MESSAGES_TABLE = "google_sync_messages";                    // unified table
const GMAIL_WEEKLY_TABLE = "g_email_sync_progress";        // one row per user/year/week
const CAL_MONTHLY_TABLE  = "g_event_sync_progress";    // one row per user/year/month

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

/** =========================
 *  Utils
 *  ========================== */
const fmtTime = (iso?: string) =>
  iso ? new Date(iso).toLocaleTimeString() : new Date().toLocaleTimeString();

export function GoogleSyncDashboard() {
  const { toast } = useToast();

  /** Shared connection */
  const [connected, setConnected] = useState(false);
  const [checkingConn, setCheckingConn] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [lastVerified, setLastVerified] = useState<string>("");

  /** Gmail (latest period row = current status) */
  const [gmailRow, setGmailRow] = useState<GmailProgressRow | null>(null);
  const gmailRunId = gmailRow?.current_run_id ?? gmailRow?.run_id ?? null;
  const gmailRunning = gmailRow?.sync_status === "running";
  const [gmailStarting, setGmailStarting] = useState(false);
  const [gmailPausing, setGmailPausing] = useState(false);
  const [gmailUserPaused, setGmailUserPaused] = useState(false);
  const [gmailSyncedThrough, setGmailSyncedThrough] = useState<string>("");

  /** Calendar (latest period row = current status) */
  const [calRow, setCalRow] = useState<CalendarProgressRow | null>(null);
  const calRunId = calRow?.current_run_id ?? calRow?.run_id ?? null;
  const calRunning = calRow?.sync_status === "running";
  const [calStarting, setCalStarting] = useState(false);
  const [calPausing, setCalPausing] = useState(false);
  const [calUserPaused, setCalUserPaused] = useState(false);
  const [calSyncedThrough, setCalSyncedThrough] = useState<string>("");
  
  /** Auto-restart cooldowns (24 hours after successful completion) */
  const [gmailCompletedAt, setGmailCompletedAt] = useState<Date | null>(null);
  const [calCompletedAt, setCalCompletedAt] = useState<Date | null>(null);

  /** Console (unified) */
  const [consoleRows, setConsoleRows] = useState<ConsoleRow[]>([]);
  const [consoleFilter, setConsoleFilter] = useState<ConsoleFilter>("all");
  const consoleEndRef = useRef<HTMLDivElement>(null);
  const componentMountISO = useRef<string>(new Date().toISOString());
  const autoRestartTimer = useRef<number | null>(null);

  // per-service dedup/pagination cursors for polling
  const seenIds = useRef<{ gmail: Set<string>; calendar: Set<string> }>({
    gmail: new Set(),
    calendar: new Set(),
  });
  const lastSeenAt = useRef<{ gmail: string | null; calendar: string | null }>({
    gmail: null,
    calendar: null,
  });
  const pollTimers = useRef<{ gmail: number | null; calendar: number | null }>({
    gmail: null,
    calendar: null,
  });

  /** Helpers */
  const authHeaders = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) throw new Error("Not authenticated");
    return { Authorization: `Bearer ${session.access_token}` };
  };

  const addConsole = (service: Service, message: string, created_at?: string) => {
    setConsoleRows(prev => [
      ...prev,
      {
        id: `${service}-${crypto.randomUUID()}`,
        service,
        message: `[${fmtTime(created_at)}] ${message}`,
        created_at: created_at ?? new Date().toISOString(),
      },
    ]);
  };

  const pushDbConsole = (service: Service, row: { id: string; message: string; created_at: string }) => {
    setConsoleRows(prev => [
      ...prev,
      { id: row.id, service, message: `[${fmtTime(row.created_at)}] ${row.message}`, created_at: row.created_at },
    ]);
  };

  const clearConsole = () => setConsoleRows([]);

  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [consoleRows]);

  /** Initial: connection + latest period status + "synced through" */
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      await checkConnection();
      await refreshGmailStatus();
      await refreshCalStatus();
      await loadSyncedThroughBadges();
    };
    load();

    // realtime: watch period tables for the user's rows and update "current" (latest) row
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      const uid = u.user?.id;
      if (!uid) return;

      const gmailChan = supabase
        .channel(`gmail-weekly-${uid}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: GMAIL_WEEKLY_TABLE, filter: `user_id=eq.${uid}` },
          () => { if (mounted) refreshGmailStatus(); }
        )
        .subscribe();

      const calChan = supabase
        .channel(`cal-monthly-${uid}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: CAL_MONTHLY_TABLE, filter: `user_id=eq.${uid}` },
          () => { if (mounted) refreshCalStatus(); }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(gmailChan);
        supabase.removeChannel(calChan);
      };
    })();

    return () => {
      mounted = false;
      if (pollTimers.current.gmail) window.clearTimeout(pollTimers.current.gmail);
      if (pollTimers.current.calendar) window.clearTimeout(pollTimers.current.calendar);
      if (autoRestartTimer.current) window.clearTimeout(autoRestartTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Realtime + polling for messages (Gmail) from unified table */
  useEffect(() => {
    if (!gmailRunId) {
      console.log("[DEBUG] Gmail subscription: no gmailRunId yet", { gmailRow });
      return;
    }

    console.log("[DEBUG] Setting up Gmail subscription for runId:", gmailRunId);
    let ch: ReturnType<typeof supabase.channel> | null = null;

    (async () => {
      const { data: u } = await supabase.auth.getUser();
      const uid = u.user?.id;
      if (!uid) return;

      console.log("[DEBUG] Gmail subscription filter:", `user_id=eq.${uid},run_id=eq.${gmailRunId},sync_type=eq.gmail`);

      // realtime: filter by user_id, run_id, sync_type='gmail'
      ch = supabase
        .channel(`sync-messages-gmail-${uid}-${gmailRunId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: SYNC_MESSAGES_TABLE,
            filter: `user_id=eq.${uid},run_id=eq.${gmailRunId},sync_type=eq.gmail`,
          },
          (payload) => {
            console.log("[DEBUG] Gmail realtime message received:", payload.new);
            const row: any = payload.new;
            if (!row?.id || !row?.message || !row?.created_at) return;
            if (seenIds.current.gmail.has(row.id)) return;
            seenIds.current.gmail.add(row.id);
            lastSeenAt.current.gmail = row.created_at;
            pushDbConsole("gmail", row);
            maybeAutoRestart("gmail", row.message, row.created_at);
          }
        )
        .subscribe((status) => {
          console.log("[DEBUG] Gmail subscription status:", status);
        });

      // polling backup
      const poll = async () => {
        // First, let's see ALL messages for this user to debug
        const debugQuery = await supabase
          .from(SYNC_MESSAGES_TABLE)
          .select("id, message, created_at, run_id, sync_type")
          .eq("user_id", uid)
          .order("created_at", { ascending: false })
          .limit(5);
        
        const { data: allMessages } = await debugQuery;
        console.log("[DEBUG] Latest 5 messages for user:", allMessages);
        console.log("[DEBUG] Looking for run_id:", gmailRunId);
        
        const q = supabase
          .from(SYNC_MESSAGES_TABLE)
          .select("id, message, created_at")
          .eq("user_id", uid)
          .eq("run_id", gmailRunId)
          .eq("sync_type", "gmail")
          .order("created_at", { ascending: true })
          .limit(200);

        if (lastSeenAt.current.gmail) {
          q.gt("created_at", lastSeenAt.current.gmail);
        }
        // Don't filter by component mount time - we want to see messages from the current run

        const { data: rows, error } = await q;
        console.log("[DEBUG] Gmail polling result:", { rows, error });
        
        if (rows?.length) {
          console.log("[DEBUG] Processing", rows.length, "polled Gmail messages");
          for (const r of rows) {
            if (seenIds.current.gmail.has(r.id)) continue;
            seenIds.current.gmail.add(r.id);
            lastSeenAt.current.gmail = r.created_at;
            pushDbConsole("gmail", r);
            maybeAutoRestart("gmail", r.message, r.created_at);
          }
        } else {
          console.log("[DEBUG] No new Gmail messages found in poll");
        }
        pollTimers.current.gmail = window.setTimeout(poll, 7000);
      };

      pollTimers.current.gmail = window.setTimeout(poll, 1000);
    })();

    return () => {
      if (ch) supabase.removeChannel(ch);
      if (pollTimers.current.gmail) window.clearTimeout(pollTimers.current.gmail);
    };
  }, [gmailRunId]);

  /** Realtime + polling for messages (Calendar) from unified table */
  useEffect(() => {
    if (!calRunId) {
      console.log("[DEBUG] Calendar subscription: no calRunId yet", { calRow });
      return;
    }

    console.log("[DEBUG] Setting up Calendar subscription for runId:", calRunId);
    let ch: ReturnType<typeof supabase.channel> | null = null;

    (async () => {
      const { data: u } = await supabase.auth.getUser();
      const uid = u.user?.id;
      if (!uid) return;
      
      console.log("[DEBUG] Calendar subscription filter:", `user_id=eq.${uid},run_id=eq.${calRunId},sync_type=eq.calendar`);

      ch = supabase
        .channel(`sync-messages-cal-${uid}-${calRunId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: SYNC_MESSAGES_TABLE,
            filter: `user_id=eq.${uid},run_id=eq.${calRunId},sync_type=eq.calendar`,
          },
          (payload) => {
            const row: any = payload.new;
            if (!row?.id || !row?.message || !row?.created_at) return;
            if (seenIds.current.calendar.has(row.id)) return;
            seenIds.current.calendar.add(row.id);
            lastSeenAt.current.calendar = row.created_at;
            pushDbConsole("calendar", row);
            maybeAutoRestart("calendar", row.message, row.created_at);
          }
        )
        .subscribe();

      const poll = async () => {
        // Debug: check what messages exist for calendar
        const debugQuery = await supabase
          .from(SYNC_MESSAGES_TABLE)
          .select("id, message, created_at, run_id, sync_type")
          .eq("user_id", uid)
          .eq("sync_type", "calendar")
          .order("created_at", { ascending: false })
          .limit(3);
        
        const { data: calMessages } = await debugQuery;
        console.log("[DEBUG] Latest 3 calendar messages:", calMessages);
        console.log("[DEBUG] Looking for cal run_id:", calRunId);
        
        const q = supabase
          .from(SYNC_MESSAGES_TABLE)
          .select("id, message, created_at")
          .eq("user_id", uid)
          .eq("run_id", calRunId)
          .eq("sync_type", "calendar")
          .order("created_at", { ascending: true })
          .limit(200);

        if (lastSeenAt.current.calendar) {
          q.gt("created_at", lastSeenAt.current.calendar);
        }
        // Don't filter by component mount time - we want to see messages from the current run

        const { data: rows, error } = await q;
        console.log("[DEBUG] Calendar polling result:", { rows, error });
        
        if (rows?.length) {
          console.log("[DEBUG] Processing", rows.length, "polled Calendar messages");
          for (const r of rows) {
            if (seenIds.current.calendar.has(r.id)) continue;
            seenIds.current.calendar.add(r.id);
            lastSeenAt.current.calendar = r.created_at;
            pushDbConsole("calendar", r);
            maybeAutoRestart("calendar", r.message, r.created_at);
          }
        } else {
          console.log("[DEBUG] No new Calendar messages found in poll");
        }
        pollTimers.current.calendar = window.setTimeout(poll, 10000);
      };

      pollTimers.current.calendar = window.setTimeout(poll, 1000);
    })();

    return () => {
      if (ch) supabase.removeChannel(ch);
      if (pollTimers.current.calendar) window.clearTimeout(pollTimers.current.calendar);
    };
  }, [calRunId]);

  /** ===== Connection + latest period status + badges ===== */
  const checkConnection = async () => {
    try {
      setCheckingConn(true);
      const headers = await authHeaders();
      // Tokens shared; Gmail function is enough to validate
      const { data, error } = await supabase.functions.invoke(GMAIL_FN, {
        body: { action: "get_connection_status" },
        headers,
      });
      if (error) {
        setConnected(false);
        setLastVerified("");
        return;
      }
      const ok = Boolean(data?.connected);
      setConnected(ok);
      setLastVerified(ok ? new Date().toLocaleString() : "");
    } catch {
      setConnected(false);
      setLastVerified("");
    } finally {
      setCheckingConn(false);
    }
  };

  const refreshGmailStatus = async () => {
    try {
      const { data: u } = await supabase.auth.getUser();
      const uid = u.user?.id;
      if (!uid) return;

      // latest (most recently started/updated) weekly row for the user
      const { data: rows } = await supabase
        .from(GMAIL_WEEKLY_TABLE)
        .select("*")
        .eq("user_id", uid)
        .order("started_at", { ascending: false, nullsFirst: false })
        .order("updated_at", { ascending: false, nullsFirst: false })
        .limit(1);

      setGmailRow(rows?.[0] ?? null);
    } catch {
      setGmailRow(null);
    }
  };

  const refreshCalStatus = async () => {
    try {
      const { data: u } = await supabase.auth.getUser();
      const uid = u.user?.id;
      if (!uid) return;

      // latest (most recently started/updated) monthly row for the user
      const { data: rows } = await supabase
        .from(CAL_MONTHLY_TABLE)
        .select("*")
        .eq("user_id", uid)
        .order("started_at", { ascending: false, nullsFirst: false })
        .order("updated_at", { ascending: false, nullsFirst: false })
        .limit(1);

      setCalRow(rows?.[0] ?? null);
    } catch {
      setCalRow(null);
    }
  };

  const loadSyncedThroughBadges = async () => {
    try {
      const { data: u } = await supabase.auth.getUser();
      const uid = u.user?.id;
      if (!uid) return;

      const { data: w } = await supabase
        .from(GMAIL_WEEKLY_TABLE)
        .select("year, week, completed_at")
        .eq("user_id", uid)
        .eq("sync_status", "completed")
        .order("year", { ascending: false })
        .order("week", { ascending: false })
        .limit(1);

      if (w?.[0]?.completed_at) {
        // Use completed_at timestamp if available
        const date = new Date(w[0].completed_at);
        setGmailSyncedThrough(date.toLocaleString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit' 
        }));
      } else if (w?.[0]?.year && w?.[0]?.week) {
        // Fall back to calculating from year/week
        const date = new Date(Date.UTC(w[0].year, 0, 1));
        const days = (w[0].week - 1) * 7;
        date.setUTCDate(date.getUTCDate() + days);
        setGmailSyncedThrough(date.toLocaleString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        }));
      } else {
        setGmailSyncedThrough("");
      }

      const { data: m } = await supabase
        .from(CAL_MONTHLY_TABLE)
        .select("year, month, sync_status, completed_at")
        .eq("user_id", uid)
        .in("sync_status", ["completed", "partial"])
        .order("year", { ascending: false })
        .order("month", { ascending: false })
        .limit(1);

      if (m?.[0]?.completed_at) {
        // Use completed_at timestamp if available
        const date = new Date(m[0].completed_at);
        setCalSyncedThrough(date.toLocaleString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit' 
        }));
      } else if (m?.[0]?.year && m?.[0]?.month) {
        // Fall back to last day of the month
        const date = new Date(m[0].year, m[0].month, 0); // Day 0 = last day of previous month
        setCalSyncedThrough(date.toLocaleString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        }));
      } else {
        setCalSyncedThrough("");
      }
    } catch {
      setGmailSyncedThrough("");
      setCalSyncedThrough("");
    }
  };

  /** ===== Auto-restart ===== */
  const maybeAutoRestart = (service: Service, message: string, created_at?: string) => {
    const lower = message.toLowerCase();
    
    // Check if this is a completion message
    const isCompletion = 
      lower.includes("✅ all weeks synced") ||
      lower.includes("✅ all months synced") ||
      lower.includes("sync completed successfully") ||
      lower.includes("nothing to do");
    
    // If sync completed successfully, set cooldown timestamp
    if (isCompletion) {
      const now = new Date();
      if (service === "gmail") {
        setGmailCompletedAt(now);
        console.log("[AUTO-RESTART] Gmail completed successfully, setting 24h cooldown until", new Date(now.getTime() + 24 * 60 * 60 * 1000));
      } else {
        setCalCompletedAt(now);
        console.log("[AUTO-RESTART] Calendar completed successfully, setting 24h cooldown until", new Date(now.getTime() + 24 * 60 * 60 * 1000));
      }
      return; // Don't auto-restart on completion
    }
    
    // Check if this is an auto-restart trigger
    const isTimeout =
      lower.includes("[auto-restart]") ||
      lower.includes("function call timed out") ||
      lower.includes("aborterror");
    if (!isTimeout) return;
    if (created_at && created_at < componentMountISO.current) return;

    if (autoRestartTimer.current) window.clearTimeout(autoRestartTimer.current);
    autoRestartTimer.current = window.setTimeout(async () => {
      if (service === "gmail") {
        if (gmailUserPaused) {
          addConsole("gmail", "🚫 Auto-restart cancelled — Gmail sync paused by user");
          return;
        }
        
        // Check if we're in cooldown period (24 hours after completion)
        if (gmailCompletedAt) {
          const hoursSinceCompletion = (new Date().getTime() - gmailCompletedAt.getTime()) / (1000 * 60 * 60);
          if (hoursSinceCompletion < 24) {
            addConsole("gmail", `Auto-restart skipped - cooldown active (${Math.round(24 - hoursSinceCompletion)}h remaining)`);
            console.log("[AUTO-RESTART] Gmail in cooldown, skipping auto-restart");
            return;
          }
        }
        
        await autoRestartGmail();
      } else {
        if (calUserPaused) {
          addConsole("calendar", "🚫 Auto-restart cancelled — Calendar sync paused by user");
          return;
        }
        
        // Check if we're in cooldown period (24 hours after completion)
        if (calCompletedAt) {
          const hoursSinceCompletion = (new Date().getTime() - calCompletedAt.getTime()) / (1000 * 60 * 60);
          if (hoursSinceCompletion < 24) {
            addConsole("calendar", `Auto-restart skipped - cooldown active (${Math.round(24 - hoursSinceCompletion)}h remaining)`);
            console.log("[AUTO-RESTART] Calendar in cooldown, skipping auto-restart");
            return;
          }
        }
        
        await autoRestartCal();
      }
    }, 1000);
  };

  /** ===== Actions: Connect/Disconnect ===== */
  const handleConnect = async () => {
    try {
      setConnecting(true);
      addConsole("gmail", "Initiating Google OAuth…");
      const headers = await authHeaders();
      const redirectUri = `${window.location.origin}/oauth/callback`;

      const { data, error } = await supabase.functions.invoke(GMAIL_FN, {
        body: { action: "get_auth_url", redirectUri },
        headers,
      });
      if (error) throw error;
      if (!data?.auth_url) throw new Error("No authorization URL received");
      window.location.href = data.auth_url;
    } catch (err: any) {
      addConsole("gmail", `Connection failed: ${err?.message || "Unknown error"}`);
      toast({ title: "Connection error", description: err?.message ?? "Unknown error", variant: "destructive" });
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setDisconnecting(true);
      addConsole("gmail", "Disconnecting Google account…");
      const { data: u } = await supabase.auth.getUser();
      if (u.user?.id) {
        await supabase.from("google_auth_tokens").delete().eq("user_id", u.user.id);
        setConnected(false);
        setLastVerified("");
        setGmailSyncedThrough("");
        setCalSyncedThrough("");
        addConsole("gmail", "Google account disconnected");
        toast({ title: "Disconnected", description: "Google account disconnected" });
      }
    } finally {
      setDisconnecting(false);
    }
  };

  /** ===== Actions: Gmail ===== */
  const startGmail = async () => {
    try {
      if (!connected) throw new Error("Connect Google first");
      setGmailStarting(true);
      setGmailUserPaused(false);
      setGmailCompletedAt(null); // Clear cooldown when manually starting
      addConsole("gmail", "Starting Gmail sync…");
      const headers = await authHeaders();

      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 180000);

      const { data, error } = await supabase.functions.invoke(GMAIL_FN, {
        body: { action: "start_sync" },
        headers,
        signal: controller.signal as any
      });

      window.clearTimeout(timeoutId);
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      // The run_id used by messages; keep it for realtime scoping
      if (data?.run_id) {
        console.log("[DEBUG] Gmail sync started with run_id:", data.run_id);
        // CRITICAL: Update the gmailRow with the new run_id to trigger subscriptions
        setGmailRow(prev => {
          const newRow = prev ? { ...prev, current_run_id: data.run_id, sync_status: "running" as SyncStatus } : { 
            user_id: "", 
            run_id: data.run_id, 
            current_run_id: data.run_id,
            year: new Date().getFullYear(),
            week: 0,
            sync_status: "running" as SyncStatus,
            error_message: null
          } as GmailProgressRow;
          console.log("[DEBUG] Updated gmailRow:", newRow);
          return newRow;
        });
        addConsole("gmail", `Run: ${String(data.run_id).slice(0, 8)}…`, data?.started_at);
      } else {
        console.log("[DEBUG] WARNING: No run_id returned from start_sync!", data);
      }
      addConsole("gmail", "Gmail sync started", data?.started_at);
      toast({ title: "Gmail sync", description: "Running" });

      // Don't refresh status immediately as it might overwrite our run_id
      // await refreshGmailStatus();
      await loadSyncedThroughBadges();
    } catch (err: any) {
      addConsole("gmail", `Start failed: ${err?.name === "AbortError" ? "Function timed out" : err?.message || "Unknown"}`);
      toast({ title: "Gmail start failed", description: err?.message ?? "Unknown error", variant: "destructive" });
    } finally {
      setGmailStarting(false);
    }
  };

  const pauseGmail = async () => {
    try {
      setGmailPausing(true);
      setGmailUserPaused(true);
      addConsole("gmail", "Pausing Gmail sync…");
      const headers = await authHeaders();
      const { error } = await supabase.functions.invoke(GMAIL_FN, {
        body: { action: "pause_sync" },
        headers,
      });
      if (error) throw error;
      addConsole("gmail", "Gmail sync paused");
      toast({ title: "Gmail paused" });

      await refreshGmailStatus();
      await loadSyncedThroughBadges();
    } catch (err: any) {
      addConsole("gmail", `Pause failed: ${err?.message || "Unknown error"}`);
      toast({ title: "Gmail pause failed", description: err?.message ?? "Unknown error", variant: "destructive" });
    } finally {
      setGmailPausing(false);
    }
  };

  const autoRestartGmail = async () => {
    try {
      setGmailStarting(true);
      setGmailUserPaused(false);
      addConsole("gmail", "🔄 Auto-restarting Gmail sync…");
      const headers = await authHeaders();
      const { data, error } = await supabase.functions.invoke(GMAIL_FN, {
        body: { action: "start_sync" },
        headers,
      });
      if (error) throw error;
      
      // CRITICAL: Update the gmailRow with the new run_id to trigger subscriptions
      if (data?.run_id) {
        setGmailRow(prev => prev ? { ...prev, current_run_id: data.run_id } : { 
          user_id: "", 
          run_id: data.run_id, 
          current_run_id: data.run_id,
          year: new Date().getFullYear(),
          week: 0,
          sync_status: "running",
          error_message: null
        } as GmailProgressRow);
      }
      addConsole("gmail", "✅ Gmail auto-restart successful");
      // Don't refresh status immediately as it might overwrite our run_id
      // await refreshGmailStatus();
      await loadSyncedThroughBadges();
    } catch (err: any) {
      addConsole("gmail", `❌ Gmail auto-restart failed: ${err?.message || "Unknown error"}`);
    } finally {
      setGmailStarting(false);
    }
  };

  /** ===== Actions: Calendar ===== */
  const startCalendar = async () => {
    try {
      if (!connected) throw new Error("Connect Google first");
      setCalStarting(true);
      setCalUserPaused(false);
      setCalCompletedAt(null); // Clear cooldown when manually starting
      addConsole("calendar", "Starting Calendar sync…");
      const headers = await authHeaders();

      const { data, error } = await supabase.functions.invoke(CAL_FN, {
        body: { action: "start_sync" },
        headers,
      });
      if (error) throw error;

      if (data?.run_id) {
        // CRITICAL: Update the calRow with the new run_id to trigger subscriptions
        setCalRow(prev => prev ? { ...prev, current_run_id: data.run_id } : { 
          user_id: "", 
          run_id: data.run_id, 
          current_run_id: data.run_id,
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1,
          sync_status: "running",
          error_message: null
        } as CalendarProgressRow);
        addConsole("calendar", `Run: ${String(data.run_id).slice(0, 8)}…`, data?.started_at);
      }
      addConsole("calendar", "Calendar sync started", data?.started_at);
      toast({ title: "Calendar sync", description: "Running" });

      // Don't refresh status immediately as it might overwrite our run_id
      // await refreshCalStatus();
      await loadSyncedThroughBadges();
    } catch (err: any) {
      addConsole("calendar", `Start failed: ${err?.message || "Unknown error"}`);
      toast({ title: "Calendar start failed", description: err?.message ?? "Unknown error", variant: "destructive" });
    } finally {
      setCalStarting(false);
    }
  };

  const pauseCalendar = async () => {
    try {
      setCalPausing(true);
      setCalUserPaused(true);
      addConsole("calendar", "Pausing Calendar sync…");
      const headers = await authHeaders();
      const { error } = await supabase.functions.invoke(CAL_FN, {
        body: { action: "pause_sync" },
        headers,
      });
      if (error) throw error;
      addConsole("calendar", "Calendar sync paused");
      toast({ title: "Calendar paused" });

      await refreshCalStatus();
      await loadSyncedThroughBadges();
    } catch (err: any) {
      addConsole("calendar", `Pause failed: ${err?.message || "Unknown error"}`);
      toast({ title: "Calendar pause failed", description: err?.message ?? "Unknown error", variant: "destructive" });
    } finally {
      setCalPausing(false);
    }
  };

  const autoRestartCal = async () => {
    try {
      setCalStarting(true);
      setCalUserPaused(false);
      addConsole("calendar", "🔄 Auto-restarting Calendar sync…");
      const headers = await authHeaders();
      const { data, error } = await supabase.functions.invoke(CAL_FN, {
        body: { action: "start_sync" },
        headers,
      });
      if (error) throw error;
      
      // CRITICAL: Update the calRow with the new run_id to trigger subscriptions
      if (data?.run_id) {
        setCalRow(prev => prev ? { ...prev, current_run_id: data.run_id } : { 
          user_id: "", 
          run_id: data.run_id, 
          current_run_id: data.run_id,
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1,
          sync_status: "running",
          error_message: null
        } as CalendarProgressRow);
      }
      addConsole("calendar", "✅ Calendar auto-restart successful");
      // Don't refresh status immediately as it might overwrite our run_id
      // await refreshCalStatus();
      await loadSyncedThroughBadges();
    } catch (err: any) {
      addConsole("calendar", `❌ Calendar auto-restart failed: ${err?.message || "Unknown error"}`);
    } finally {
      setCalStarting(false);
    }
  };

  /** ===== Derived for UI ===== */
  const calPercent = (() => {
    const t = calRow?.total_events ?? 0;
    const p = calRow?.processed_events ?? 0;
    if (!t || t < 0) return 0;
    return Math.min(100, Math.round((p / t) * 100));
  })();

  const filteredConsole = consoleRows.filter(r =>
    consoleFilter === "all" ? true : r.service === consoleFilter
  );

  /** ===== UI ===== */
  return (
    <Card className="p-4 space-y-3 max-w-xl">
      {/* Header + Connection */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Google Sync</h3>
          <Badge variant={connected ? "default" : "destructive"} className="text-xs">
            {connected ? <Wifi className="h-3 w-3 mr-1" /> : <WifiOff className="h-3 w-3 mr-1" />}
            {checkingConn ? "..." : connected ? "Connected" : "Disconnected"}
          </Badge>
        </div>
        <Button
          onClick={connected ? handleDisconnect : handleConnect}
          disabled={connecting || disconnecting || checkingConn}
          variant="outline"
          size="sm"
        >
          {connecting ? "Connecting..." : disconnecting ? "Disconnecting..." : connected ? "Disconnect" : "Connect"}
        </Button>
      </div>

      {/* Gmail & Calendar in compact grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Gmail */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Gmail</span>
            {gmailRunning && <Badge variant="default" className="text-xs">Running</Badge>}
            {!!gmailRow?.error_message && <Badge variant="destructive" className="text-xs">Error</Badge>}
          </div>
          {!!gmailSyncedThrough && (
            <p className="text-xs text-muted-foreground">Last: {gmailSyncedThrough}</p>
          )}
          <div className="flex gap-1">
            <Button 
              onClick={startGmail} 
              disabled={!connected || gmailRunning || gmailStarting} 
              size="sm" 
              variant={gmailRunning ? "outline" : "default"}
              className="flex-1"
            >
              <Play className="h-3 w-3" />
              <span className="ml-1 text-xs">{gmailStarting ? "..." : "Start"}</span>
            </Button>
            <Button 
              onClick={pauseGmail} 
              disabled={!gmailRunning || gmailPausing} 
              size="sm" 
              variant="outline"
              className="flex-1"
            >
              <Square className="h-3 w-3" />
              <span className="ml-1 text-xs">{gmailPausing ? "..." : "Stop"}</span>
            </Button>
          </div>
        </div>

        {/* Calendar */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Calendar</span>
            {calRunning && <Badge variant="default" className="text-xs">Running</Badge>}
            {!!calRow?.error_message && <Badge variant="destructive" className="text-xs">Error</Badge>}
          </div>
          {!!calSyncedThrough && (
            <p className="text-xs text-muted-foreground">Last: {calSyncedThrough}</p>
          )}
          {(calRow?.total_events ?? 0) > 0 && (
            <div className="space-y-1">
              <Progress value={calPercent} className="h-1" />
              <p className="text-xs text-muted-foreground">
                {(calRow?.processed_events ?? 0)}/{(calRow?.total_events ?? 0)}
              </p>
            </div>
          )}
          <div className="flex gap-1">
            <Button 
              onClick={startCalendar} 
              disabled={!connected || calRunning || calStarting} 
              size="sm" 
              variant={calRunning ? "outline" : "default"}
              className="flex-1"
            >
              <Play className="h-3 w-3" />
              <span className="ml-1 text-xs">{calStarting ? "..." : "Start"}</span>
            </Button>
            <Button 
              onClick={pauseCalendar} 
              disabled={!calRunning || calPausing} 
              size="sm" 
              variant="outline"
              className="flex-1"
            >
              <Square className="h-3 w-3" />
              <span className="ml-1 text-xs">{calPausing ? "..." : "Stop"}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Console */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Console</span>
          <select 
            className="text-xs border rounded px-2 py-1"
            value={consoleFilter}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "clear") {
                clearConsole();
                e.target.value = consoleFilter;
              } else {
                setConsoleFilter(val as ConsoleFilter);
              }
            }}
          >
            <option value="all">All Messages</option>
            <option value="gmail">Gmail Only</option>
            <option value="calendar">Calendar Only</option>
            <option disabled>──────────</option>
            <option value="clear">Clear Console</option>
          </select>
        </div>
        <div className="bg-black text-green-400 p-3 rounded font-mono text-xs h-32 overflow-y-auto">
          {filteredConsole.length === 0 ? (
            <div className="text-gray-500">No messages yet…</div>
          ) : (
            filteredConsole.map((r) => (
              <div key={r.id} className="mb-0.5">
                {r.service === "gmail" ? "📧" : "📅"} {r.message}
              </div>
            ))
          )}
          <div ref={consoleEndRef} />
        </div>
      </div>
    </Card>
  );
}
