import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { School } from "@/types/schema.generated";

export function useSchoolsSupabase() {
  const query = useQuery<School[]>({
    queryKey: ["supabase/grid_school"],
    queryFn: async () => {
      const pageSize = 1000;
      let offset = 0;
      let all: any[] = [];
      for (;;) {
        const { data, error } = await supabase
          .from("grid_school")
          .select("*")
          .order("id", { ascending: true })
          .range(offset, offset + pageSize - 1);
        if (error) throw error;
        const chunk = data || [];
        all = all.concat(chunk);
        if (chunk.length < pageSize) break;
        offset += pageSize;
      }
      try { if (import.meta.env.DEV) console.log('[grid_school] fetched rows:', all.length); } catch {}
      const rows = (all || []) as unknown as School[];
      return rows.filter((s: any) => !s?.archived);
    },
    staleTime: 30 * 60 * 1000,
    gcTime: 2 * 60 * 1000 * 60,
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
