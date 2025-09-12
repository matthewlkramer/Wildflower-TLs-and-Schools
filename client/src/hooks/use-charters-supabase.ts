import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Charter } from "@shared/schema.generated";

export function useChartersSupabase() {
  const query = useQuery<Charter[]>({
    queryKey: ["supabase/grid_charter"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("grid_charter")
        .select("*");
      if (error) throw error;
      const rows = (data || []) as unknown as Charter[];
      return rows.filter((c: any) => !c?.archived);
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

