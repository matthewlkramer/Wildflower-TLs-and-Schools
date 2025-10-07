import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/shared/types/database.types';

const url = import.meta.env.VITE_SUPABASE_URL as string;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Single client shared across schemas to avoid multiple GoTrueClient instances
export const supabase = createClient<Database>(url, anon, {
  auth: { persistSession: true, autoRefreshToken: true, storageKey: 'wf-primary-auth' },
});

// Helper to access y-prefixed tables in public schema (formerly gsync schema)
export const fromGsync = (table: string) => {
  // Map old table names to new y-prefixed names
  const tableMap: Record<string, string> = {
    'g_emails': 'yg_emails',
    'g_events': 'yg_events',
    'g_email_attachments': 'yg_email_attachments',
    'g_event_attachments': 'yg_event_attachments',
    'google_auth_tokens': 'ygoogle_auth_tokens',
    'google_sync_history': 'ygoogle_sync_history',
    'google_sync_settings': 'ygoogle_sync_settings',
    'email_addresses_filtered_mv': 'yemail_addresses_filtered_mv',
    'exclusion_emails': 'yexclusion_emails',
    'g_emails_addresses_unnested_mv': 'yg_emails_addresses_unnested_mv',
    'g_emails_full_bodies_to_download': 'yg_emails_full_bodies_to_download',
    'g_emails_minus_exclusions': 'yg_emails_minus_exclusions',
    'g_emails_people_ids_mv': 'yg_emails_people_ids_mv',
    'g_emails_with_people_ids_mv': 'yg_emails_with_people_ids_mv',
    'g_emails_without_people_ids': 'yg_emails_without_people_ids',
    'g_events_attendees_unnested_mv': 'yg_events_attendees_unnested_mv',
    'g_events_full_bodies_to_download': 'yg_events_full_bodies_to_download',
    'g_events_people_ids_mv': 'yg_events_people_ids_mv',
    'g_events_with_people_ids_mv': 'yg_events_with_people_ids_mv',
    'g_events_without_people_ids': 'yg_events_without_people_ids'
  };

  const newTableName = tableMap[table] || `y${table}`;
  return supabase.from(newTableName);
};

// Expose client in dev so you can use it from the browser console
if (import.meta.env.DEV) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).supabase = supabase;
}
