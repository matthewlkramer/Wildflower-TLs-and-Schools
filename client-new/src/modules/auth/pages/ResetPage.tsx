import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export function ResetPage() {
  const [password, setPassword] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Supabase JS v2 auto-parses recovery tokens from URL hash when you call updateUser.
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) setError(error.message);
    else setDone(true);
  }

  if (done) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 border rounded">
        <h1 className="text-xl font-semibold">Password updated</h1>
        <p className="mt-2">You can now return to the login page.</p>
        <a className="underline mt-4 inline-block" href="/login">Go to Login</a>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="max-w-md mx-auto mt-10 p-6 border rounded">
      <h1 className="text-xl font-semibold">Reset password</h1>
      <input
        className="mt-4 w-full border px-3 py-2 rounded"
        type="password"
        placeholder="New password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <div className="mt-2 text-red-600 text-sm">{error}</div>}
      <button className="mt-4 px-4 py-2 border rounded" type="submit">Save</button>
    </form>
  );
}

