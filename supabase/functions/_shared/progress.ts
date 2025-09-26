import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import { ts } from "./http.ts";

export async function setSyncStatus(
  supabase: SupabaseClient,
  userId: string,
  patch: { sync_status?: string | null; error_message?: string | null; started_at?: string | null; completed_at?: string | null }
) {
  // Progress tables were removed; no-op
  try { console.log('[progress] setSyncStatus', { userId, patch, at: ts() }); } catch {}
}

export async function setPeriodStatus(
  supabase: SupabaseClient,
  table: 'g_email_sync_progress' | 'g_event_sync_progress',
  keys: Record<string, any>,
  patch: Record<string, any>,
  onConflict: string,
) {
  // Progress tables were removed; no-op
  try { console.log('[progress] setPeriodStatus', { table, keys, patch, onConflict, at: ts() }); } catch {}
}
