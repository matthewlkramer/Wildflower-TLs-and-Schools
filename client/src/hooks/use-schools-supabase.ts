import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { School } from "@shared/schema.generated";

export function useSchoolsSupabase() {
  const query = useQuery<School[]>({
    queryKey: ["supabase/grid_school"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("grid_school")
        .select("*");
      if (error) throw error;
      const rows = (data || []) as unknown as School[];
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

