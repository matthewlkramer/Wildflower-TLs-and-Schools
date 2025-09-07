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
      // Optional domain enforcement: only enforce if VITE_AUTH_DOMAIN is set
      const allowed = (import.meta as any).env?.VITE_AUTH_DOMAIN as string | undefined;
      if (!allowed) return true;
      const allowedDomain = allowed.trim().toLowerCase();
      const ok = email.toLowerCase().endsWith(`@${allowedDomain}`);
      if (!ok) {
        // Do not force sign-out here to avoid auth loops; just deny
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }

  useEffect(() => {
    let mounted = true;
    // Inject Authorization bearer for all /api/* requests using current Supabase session
    // This makes API calls work with serverless functions (no server session persistence).
    const origFetch = window.fetch.bind(window);
    const apiBase = (import.meta as any).env?.VITE_API_BASE || '';
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      try {
        const url = typeof input === 'string' ? input : (input as URL).toString();
        const isApi = url.startsWith('/api') || (apiBase && url.startsWith(apiBase + '/api'));
        if (isApi) {
          const target = (apiBase && url.startsWith('/api')) ? (apiBase + url) : url;
          const { data: sessionData } = await supabase.auth.getSession();
          const token = sessionData.session?.access_token;
          if (token) {
            const headers = new Headers(init?.headers || {});
            if (!headers.has('Authorization')) headers.set('Authorization', `Bearer ${token}`);
            return origFetch(target, { ...init, headers, credentials: 'omit' });
          }
          return origFetch(target, { ...init, credentials: 'omit' });
        }
      } catch {}
      return origFetch(input, init);
    };
    // Server-session bridging removed: API uses Authorization headers only
    (async () => {
      try {
        // Guard against hanging network calls by timing out the initial session fetch
        const sessionResult = await Promise.race([
          supabase.auth.getSession(),
          new Promise<{ data: { session: any | null } }>((resolve) =>
            setTimeout(() => resolve({ data: { session: null } }), 5000)
          ),
        ]);
        const { data } = sessionResult as { data: { session: any | null } };
        if (data.session?.user) {
          const ok = await enforceDomain();
          if (!mounted) return;
          if (ok) {
            setUser({ id: data.session.user.id, email: data.session.user.email || '', name: data.session.user.user_metadata?.name });
            // No server-session bridging; Authorization headers are injected per request
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
          // No server-session bridging; Authorization headers are injected per request
        } else {
          setUser(null);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        // No server-session bridging; nothing to do on API logout
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
