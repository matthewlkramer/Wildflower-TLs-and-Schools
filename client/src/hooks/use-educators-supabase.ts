import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Educator } from "@shared/schema.generated";

// Fetch educators for the main grid from Supabase view `grid_educators`.
// Assumes the view exposes fields compatible with `Educator` used by the grid.
export function useEducatorsSupabase() {
  const query = useQuery<Educator[]>({
    queryKey: ["supabase/grid_educators"],
    queryFn: async () => {
      const fetchAll = async (view: string) => {
        const pageSize = 1000;
        let offset = 0;
        let all: any[] = [];
        for (;;) {
          const { data, error } = await supabase
            .from(view)
            .select("*")
            .order("id", { ascending: true })
            .range(offset, offset + pageSize - 1);
          if (error) throw error;
          const chunk = data || [];
          all = all.concat(chunk);
          if (chunk.length < pageSize) break;
          offset += pageSize;
        }
        try { if (import.meta.env.DEV) console.log(`[${view}] fetched rows:`, all.length); } catch {}
        return (all || []) as unknown as Educator[];
      };

      const candidates = ["grid_educators", "grid_educator"];
      let lastErr: any;
      for (const v of candidates) {
        try {
          const rows = await fetchAll(v);
          return rows.filter((e: any) => !e?.archived);
        } catch (e) {
          lastErr = e;
        }
      }
      throw lastErr;
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
