import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useDetailsTeacher(id?: string) {
  return useQuery<{ [k: string]: any }>({
    queryKey: ["supabase/details_educators", id],
    enabled: !!id,
    queryFn: async () => {
      // Primary: details_educators
      let { data, error } = await supabase
        .from("details_educators")
        .select("*")
        .eq("id", id!)
        .single();
      if (!error && data) return data as any;

      // Fallback: minimal row from grid_educator
      const grid = await supabase
        .from("grid_educator")
        .select("*")
        .eq("id", id!)
        .single();
      if (grid.error) throw grid.error;
      return grid.data as any;
    },
  });
}

export function useDetailsSchool(id?: string) {
  return useQuery<{ [k: string]: any }>({
    queryKey: ["supabase/details_schools", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("details_schools")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data as any;
    },
  });
}

export function useDetailsCharter(id?: string) {
  return useQuery<{ [k: string]: any }>({
    queryKey: ["supabase/details_charters", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("details_charters")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data as any;
    },
  });
}
