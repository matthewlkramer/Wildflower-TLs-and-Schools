import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useLocation } from 'wouter';

type AuthContextType = {
  user: { id: string; email: string } | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const WF_DOMAIN = '@wildflowerschools.org';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      const email = session?.user?.email ?? null;
      if (email && email.endsWith(WF_DOMAIN)) {
        if (isMounted) setUser({ id: session!.user.id, email });
      } else {
        if (email && !email.endsWith(WF_DOMAIN)) {
          await supabase.auth.signOut();
        }
        if (isMounted) setUser(null);
      }
      if (isMounted) setLoading(false);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const email = session?.user?.email ?? null;
      if (email && email.endsWith(WF_DOMAIN)) {
        setUser({ id: session!.user.id, email });
      } else {
        if (email && !email.endsWith(WF_DOMAIN)) {
          await supabase.auth.signOut();
        }
        setUser(null);
      }
      setLoading(false);
    });
    return () => {
      isMounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextType>(() => ({
    user,
    loading,
    signOut: async () => { await supabase.auth.signOut(); },
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();
  if (loading) return <div>Loading...</div>;
  if (!user) {
    // Redirect unauthenticated users to /login
    try { navigate('/login', { replace: true }); } catch {}
    return null;
  }
  return <>{children}</>;
}
