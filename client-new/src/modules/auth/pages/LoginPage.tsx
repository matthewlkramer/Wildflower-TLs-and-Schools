import React from 'react';
import { supabase } from '@/lib/supabase/client';

export function LoginPage() {
  async function signInGoogle() {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  }
  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded">
      <h1 className="text-xl font-semibold">Sign in</h1>
      <p className="mt-2 text-sm text-gray-600">Use your wildflowerschools.org account.</p>
      <button className="mt-4 px-4 py-2 border rounded" onClick={signInGoogle}>
        Continue with Google
      </button>
    </div>
  );
}

