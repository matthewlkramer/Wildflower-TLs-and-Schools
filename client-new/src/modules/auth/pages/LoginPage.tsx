import React from 'react';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { useAuth } from '../auth-context';
import { useLocation } from 'wouter';

export function LoginPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  React.useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user, navigate]);
  async function signInGoogle() {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  }
  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded">
      <h1 className="text-xl font-semibold">Sign in</h1>
      <p className="mt-2 text-sm text-gray-600">Use your wildflowerschools.org account.</p>
      <Button className="mt-4" onClick={signInGoogle}>
        Continue with Google
      </Button>
    </div>
  );
}
