import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

// Minimal stubs for now; return counts and perform no-op matching.
export async function matchEmailsWeeklyGlobal(_supabase: SupabaseClient, _start: string, _end: string) {
  return 0;
}

export async function matchEventsGlobal(_supabase: SupabaseClient, _timeMin: string, _timeMax: string, _calendarId: string) {
  return 0;
}

