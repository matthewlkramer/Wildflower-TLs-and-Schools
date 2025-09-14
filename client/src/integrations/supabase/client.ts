import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../../../shared/database.types';

const url = import.meta.env.VITE_SUPABASE_URL as string;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!url || !anon) {
  // eslint-disable-next-line no-console
  console.warn('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
}

// Typed Supabase client for end-to-end type safety
export const supabase = createClient<Database>(url, anon, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'wftls-auth',
  },
});

// Expose for dev console diagnostics
try {
  if (import.meta.env.DEV) {
    // @ts-ignore
    (window as any).supabase = supabase;
  }
} catch {}
