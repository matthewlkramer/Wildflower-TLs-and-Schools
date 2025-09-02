import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

type AuthUser = {
  id: string;
  email: string;
  name?: string | null;
};

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function enforceDomain(): Promise<boolean> {
    try {
      const { data } = await supabase.auth.getUser();
      const email = data.user?.email || '';
      if (!email) return false;
      if (!email.endsWith('@wildflowerschools.org')) {
        await supabase.auth.signOut();
        setUser(null);
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session?.user) {
          const ok = await enforceDomain();
          if (!mounted) return;
          if (ok) {
            setUser({ id: data.session.user.id, email: data.session.user.email || '', name: data.session.user.user_metadata?.name });
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    const { data: sub } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const ok = await enforceDomain();
        if (ok) {
          setUser({ id: session.user.id, email: session.user.email || '', name: session.user.user_metadata?.name });
        } else {
          setUser(null);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });
    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, []);

  const loginWithGoogle = async () => {
    const redirectTo = window.location.origin + '/';
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        queryParams: { hd: 'wildflowerschools.org', prompt: 'consent' },
      },
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const value = useMemo(() => ({
    user,
    isLoading,
    isAuthenticated: !!user,
    loginWithGoogle,
    logout,
  }), [user, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
