import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

const url = import.meta.env.VITE_SUPABASE_URL as string;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Single client shared across schemas to avoid multiple GoTrueClient instances
export const supabase = createClient<Database>(url, anon, {
  auth: { persistSession: true, autoRefreshToken: true, storageKey: 'wf-primary-auth' },
});

// Helper to access gsync schema via table-qualified names
export const fromGsync = (table: string) => (supabase as any).schema('gsync').from(table);

// Expose client in dev so you can use it from the browser console
if (import.meta.env.DEV) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).supabase = supabase;
}
