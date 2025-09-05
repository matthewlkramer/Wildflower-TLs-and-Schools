/**
 * Archived Settings page (snapshot).
 */
import { useEffect, useState } from "react";
import { usePageTitle } from "@/App";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { GoogleSyncDashboard } from "@/components/google/GoogleSyncDashboard";
import { Input } from "@/components/ui/input";

export default function SettingsArchived() {
  const { setPageTitle } = usePageTitle();
  const { user } = useAuth();
  const { toast } = useToast();
  const [sending, setSending] = useState(false);
  const [syncStart, setSyncStart] = useState<string>('');
  const [savingSync, setSavingSync] = useState(false);

  useEffect(() => { setPageTitle("Wildflower > Settings (Archived)"); }, [setPageTitle]);

  useEffect(() => {
    (async () => {
      try {
        if (!user?.id) return;
        const { data } = await supabase.from('google_sync_settings').select('sync_start_date').eq('user_id', user.id).single();
        const d = data?.sync_start_date ? new Date(data.sync_start_date) : new Date();
        const iso = d.toISOString().slice(0,10);
        setSyncStart(iso);
      } catch {}
    })();
  }, [user?.id]);

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h1 className="text-xl font-semibold text-slate-900 mb-2">Settings (Archived)</h1>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="space-y-3">
            <h2 className="text-sm font-medium text-slate-700">Account</h2>
            <p className="text-sm text-slate-500">Signed in as <span className="font-mono">{user?.email}</span></p>
            <div>
              <Button disabled={!user?.email || sending} onClick={async () => {
                if (!user?.email) return;
                try {
                  setSending(true);
                  const { error } = await supabase.auth.resetPasswordForEmail(user.email, { redirectTo: window.location.origin + "/reset" });
                  if (error) throw error;
                  toast({ title: "Password reset sent", description: `Check ${user.email} for a reset link.` });
                } catch (e: any) {
                  toast({ title: "Reset failed", description: e?.message ?? "Unable to send reset email", variant: "destructive" });
                } finally { setSending(false); }
              }}>{sending ? "Sending..." : "Send password reset email"}</Button>
            </div>
          </section>
          <section className="space-y-3">
            <h2 className="text-sm font-medium text-slate-700">Google Sync Range</h2>
            <div className="flex items-center gap-2">
              <Input type="date" value={syncStart} onChange={(e)=>setSyncStart(e.target.value)} className="w-48" />
              <Button size="sm" disabled={!syncStart || savingSync} onClick={async()=>{
                if (!user?.id || !syncStart) return;
                try {
                  setSavingSync(true);
                  const iso = new Date(syncStart+'T00:00:00Z').toISOString();
                  const { error } = await supabase.from('google_sync_settings').upsert({ user_id: user.id, sync_start_date: iso });
                  if (error) throw error;
                  toast({ title: 'Saved', description: 'Sync start date updated' });
                } catch (e:any) {
                  toast({ title: 'Save failed', description: e?.message || 'Unable to save', variant: 'destructive' });
                } finally { setSavingSync(false); }
              }}>{savingSync ? 'Saving…' : 'Save'}</Button>
            </div>
          </section>
        </div>
        <div className="mt-8">
          <h2 className="text-sm font-medium text-slate-700 mb-2">Google Sync</h2>
          <div className="border border-slate-200 rounded">
            <GoogleSyncDashboard />
          </div>
        </div>
      </div>
    </main>
  );
}

