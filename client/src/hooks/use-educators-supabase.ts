import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Educator } from "@shared/schema.generated";

// Fetch educators for the main grid from Supabase view `grid_educators`.
// Assumes the view exposes fields compatible with `Educator` used by the grid.
export function useEducatorsSupabase() {
  const query = useQuery<Educator[]>({
    queryKey: ["supabase/grid_educators"],
    queryFn: async () => {
      const pageSize = 1000;
      let offset = 0;
      let all: any[] = [];
      // Page through all rows to bypass the 1000-row default limit
      // Use a deterministic order for stable pagination
      for (;;) {
        const { data, error } = await supabase
          .from("grid_educators")
          .select("*")
          .order("id", { ascending: true })
          .range(offset, offset + pageSize - 1);
        if (error) throw error;
        const chunk = data || [];
        all = all.concat(chunk);
        if (chunk.length < pageSize) break;
        offset += pageSize;
      }
      // Dev log to verify pagination in browser console
      try { if (import.meta.env.DEV) console.log('[grid_educators] fetched rows:', all.length); } catch {}
      const rows = (all || []) as unknown as Educator[];
      // Server-side view now guarantees one row per id
      return rows.filter((e: any) => !e?.archived);
    },
    staleTime: 30 * 60 * 1000,
    gcTime: 2 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    placeholderData: (prev) => prev as any,
  });

  const fields = Array.isArray(query.data) && query.data.length > 0
    ? Object.keys(query.data[0] as any)
    : [];

  return {
    data: query.data,
    isLoading: query.isLoading || query.isFetching,
    error: query.error,
    fields,
  };
}
