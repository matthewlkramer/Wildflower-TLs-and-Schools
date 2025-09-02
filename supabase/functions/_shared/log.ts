import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import { ts } from "./http.ts";

export function log(level: 'info' | 'error' | 'debug', ...args: any[]) {
  try { console.log(`[${level}]`, ...args); } catch {}
}

export async function sendConsole(
  supabase: SupabaseClient,
  userId: string,
  runId: string | null,
  message: string,
  level: 'info' | 'milestone' | 'error' = 'info',
  syncType: 'gmail' | 'calendar' = 'gmail'
) {
  await supabase
    .from('google_sync_messages')
    .insert({ user_id: userId, run_id: runId, message, level, sync_type: syncType, created_at: ts() });
}

export function logDebugErr(...args: any[]) {
  try { console.error('[debug-err]', ...args); } catch {}
}

