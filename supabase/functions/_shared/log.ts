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
  // Messages table was removed; fall back to console logging only
  try { console.log(`[${syncType}] ${level}:`, message, { userId, runId, at: ts() }); } catch {}
}

export function logDebugErr(...args: any[]) {
  try { console.error('[debug-err]', ...args); } catch {}
}
