import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import { ts } from "./http.ts";

export async function setSyncStatus(
  supabase: SupabaseClient,
  userId: string,
  patch: { sync_status?: string | null; error_message?: string | null; started_at?: string | null; completed_at?: string | null }
) {
  // Update both gmail+calendar heads if present
  const now = ts();
  await supabase.from('g_email_sync_progress').update({ ...patch, updated_at: now }).eq('user_id', userId);
  await supabase.from('g_event_sync_progress').update({ ...patch, updated_at: now }).eq('user_id', userId);
}

export async function setPeriodStatus(
  supabase: SupabaseClient,
  table: 'g_email_sync_progress' | 'g_event_sync_progress',
  keys: Record<string, any>,
  patch: Record<string, any>,
  onConflict: string,
) {
  const row = { ...keys, ...patch, updated_at: ts() };
  await supabase.from(table).upsert(row, { onConflict });
}

