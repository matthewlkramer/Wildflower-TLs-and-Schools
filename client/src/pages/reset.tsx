import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';

function parseHashParams(hash: string) {
  const h = hash.replace(/^#/, '');
  const params = new URLSearchParams(h);
  const access_token = params.get('access_token') ?? undefined;
  const refresh_token = params.get('refresh_token') ?? undefined;
  const type = params.get('type') ?? undefined;
  return { access_token, refresh_token, type };
}

export default function ResetPasswordPage() {
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);
  const [, navigate] = useLocation();

  useEffect(() => {
    (async () => {
      try {
        // If arriving from email link, tokens are in hash
        if (window.location.hash) {
          const { access_token, refresh_token } = parseHashParams(window.location.hash);
          if (access_token && refresh_token) {
            await supabase.auth.setSession({ access_token, refresh_token });
            // Clean the hash for a cleaner URL
            history.replaceState(null, '', window.location.pathname);
          }
        }
        setReady(true);
      } catch (e) {
        setReady(true);
      }
    })();
  }, []);

  const submit = async () => {
    if (!password || password.length < 8) {
      toast({ title: 'Password too short', description: 'Use at least 8 characters', variant: 'destructive' });
      return;
    }
    if (password !== confirm) {
      toast({ title: 'Passwords do not match', description: 'Please re-enter', variant: 'destructive' });
      return;
    }
    try {
      setBusy(true);
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast({ title: 'Password updated', description: 'Please sign in with your new password.' });
      await supabase.auth.signOut();
      navigate('/login');
    } catch (e: any) {
      toast({ title: 'Update failed', description: e?.message ?? 'Unable to update password', variant: 'destructive' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-sm bg-white shadow rounded p-6 space-y-4">
        <h1 className="text-xl font-semibold">Reset password</h1>
        {!ready ? (
          <p className="text-sm text-muted-foreground">Preparing…</p>
        ) : (
          <>
            <div className="space-y-2">
              <label className="block text-sm text-slate-700">New password</label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm text-slate-700">Confirm password</label>
              <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••" />
            </div>
            <Button className="w-full" onClick={submit} disabled={busy}>{busy ? 'Updating…' : 'Update password'}</Button>
          </>
        )}
      </div>
    </div>
  );
}
