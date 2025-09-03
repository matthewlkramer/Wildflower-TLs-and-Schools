/**
 * User settings page. On mount sets the page title. Currently displays the
 * signed‑in user’s email, placeholders for appearance and notification
 * preferences, and a button that calls `supabase.auth.resetPasswordForEmail`
 * to send a password reset link (redirecting to `/reset`). Future settings can
 * expand within the grid layout.
 */
import { useEffect, useState } from "react";
import { usePageTitle } from "@/App";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { GoogleSyncDashboard } from "@/components/google/GoogleSyncDashboard";

export default function Settings() {
  const { setPageTitle } = usePageTitle();
  const { user } = useAuth();
  const { toast } = useToast();
  const [sending, setSending] = useState(false);

  useEffect(() => {
    setPageTitle("Wildflower > Settings");
  }, [setPageTitle]);

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h1 className="text-xl font-semibold text-slate-900 mb-2">Settings</h1>
        <p className="text-slate-600 text-sm">Configure your preferences.</p>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="space-y-2">
            <h2 className="text-sm font-medium text-slate-700">Appearance</h2>
            <p className="text-sm text-slate-500">Theme selection coming soon.</p>
          </section>
          <section className="space-y-2">
            <h2 className="text-sm font-medium text-slate-700">Notifications</h2>
            <p className="text-sm text-slate-500">Notification preferences coming soon.</p>
          </section>
          <section className="space-y-3">
            <h2 className="text-sm font-medium text-slate-700">Account</h2>
            <p className="text-sm text-slate-500">Signed in as <span className="font-mono">{user?.email}</span></p>
            <div>
              <Button
                disabled={!user?.email || sending}
                onClick={async () => {
                  if (!user?.email) return;
                  try {
                    setSending(true);
                    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
                      redirectTo: window.location.origin + "/reset",
                    });
                    if (error) throw error;
                    toast({ title: "Password reset sent", description: `Check ${user.email} for a reset link.` });
                  } catch (e: any) {
                    toast({ title: "Reset failed", description: e?.message ?? "Unable to send reset email", variant: "destructive" });
                  } finally {
                    setSending(false);
                  }
                }}
              >
                {sending ? "Sending..." : "Send password reset email"}
              </Button>
              <p className="text-xs text-slate-500 mt-2">If you sign in with Google, manage your password via your Google account.</p>
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
