/**
 * User settings page. On mount sets the page title. Currently displays the
 * signed-in user's email and tools for Google sync range.
 */
import { useEffect, useState } from "react";
import { usePageTitle } from "@/App";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

export default function Settings() {
  const { setPageTitle } = usePageTitle();
  const { user } = useAuth();
  const { toast } = useToast();
  const [sending, setSending] = useState(false);
  const [syncStart, setSyncStart] = useState<string>("");
  const [savingSync, setSavingSync] = useState(false);
  const [gmailThrough, setGmailThrough] = useState<string>("");
  const [calThrough, setCalThrough] = useState<string>("");

  useEffect(() => {
    setPageTitle("Wildflower > Settings");
  }, [setPageTitle]);

  useEffect(() => {
    (async () => {
      try {
        if (!user?.id) return;
        const { data } = await (supabase.from as any)("google_sync_settings")
          .select("sync_start_date")
          .eq("user_id", user.id)
          .single();
        const d = data?.sync_start_date ? new Date(data.sync_start_date) : new Date();
        const iso = d.toISOString().slice(0, 10);
        setSyncStart(iso);
      } catch {}
    })();
  }, [user?.id]);

  const refreshSyncedThrough = async () => {
    try {
      if (!user?.id) return;
      const { data: sess } = await supabase.auth.getSession();
      const token = sess.session?.access_token;
      if (!token) return;
      const headers = { Authorization: `Bearer ${token}` } as any;
      try {
        const res1 = await supabase.functions.invoke('gmail-sync', { body: { action: 'get_synced_through' }, headers });
        const iso1: string | null = (res1.data && (res1.data as any).gmail_synced_through) || null;
        if (iso1) setGmailThrough(new Date(iso1).toLocaleString());
      } catch {}
      try {
        const res2 = await supabase.functions.invoke('gcal-sync', { body: { action: 'get_synced_through' }, headers });
        const iso2: string | null = (res2.data && (res2.data as any).calendar_synced_through) || null;
        if (iso2) setCalThrough(new Date(iso2).toLocaleString());
      } catch {}
    } catch {}
  };

  useEffect(() => { refreshSyncedThrough(); }, [user?.id]);

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h1 className="text-xl font-semibold text-slate-900 mb-2">Settings</h1>
        <p className="text-slate-600 text-sm">Configure your preferences.</p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="space-y-3">
            <h2 className="text-sm font-medium text-slate-700">Google Sync Range</h2>
            <p className="text-sm text-slate-500">
              Set the earliest date to include when syncing Gmail and Calendar.
            </p>
            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={syncStart}
                onChange={(e) => setSyncStart(e.target.value)}
                className="w-48"
              />
              <Button
                size="sm"
                disabled={!syncStart || savingSync}
                onClick={async () => {
                  if (!user?.id || !syncStart) return;
                  try {
                    setSavingSync(true);
                    const iso = new Date(syncStart + "T00:00:00Z").toISOString();
                    // Read current start to determine if date moved earlier
                    const { data: cur } = await (supabase.from as any)("google_sync_settings")
                      .select("sync_start_date")
                      .eq("user_id", user.id)
                      .single();
                    const prevIso: string | null = cur?.sync_start_date || null;
                    const movedEarlier = !prevIso || new Date(iso) < new Date(prevIso);
                    const { error } = await (supabase.from as any)("google_sync_settings")
                      .upsert({ user_id: user.id, sync_start_date: iso });
                    if (error) throw error;
                    toast({ title: "Saved", description: "Sync start date updated" });
                    // If moved earlier, enqueue a server-side catch-up request (processed by nightly cron)
                    if (movedEarlier) {
                      try {
                        await (supabase.from as any)('sync_catchup_requests').upsert({ user_id: user.id, status: 'queued' } as any);
                        toast({ title: 'Catch-up queued', description: 'Historical ingest will run server-side.' });
                      } catch {}
                    }
                  } catch (e: any) {
                    toast({
                      title: "Save failed",
                      description: e?.message || "Unable to save",
                      variant: "destructive",
                    });
                  } finally {
                    setSavingSync(false);
                  }
                }}
              >
                {savingSync ? "Saving." : "Save"}
              </Button>
            </div>
          </section>
        </div>

        <div className="mt-8">
          <h2 className="text-sm font-medium text-slate-700 mb-2">Sync Status</h2>
          <div className="text-sm text-slate-600 space-y-2">
            <div>Gmail synced through: <span className="font-mono">{gmailThrough || '—'}</span></div>
            <div>Calendar synced through: <span className="font-mono">{calThrough || '—'}</span></div>
          </div>
        </div>
      </div>
    </main>
  );
}
