import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

export async function upsertBatch(
  supabase: SupabaseClient,
  table: string,
  rows: any[],
  onConflict: string,
  chunkSize = 100
) {
  for (let i = 0; i < rows.length; i += chunkSize) {
    const slice = rows.slice(i, i + chunkSize);
    const { error } = await supabase.from(table).upsert(slice, { onConflict });
    if (error) throw error;
  }
}

