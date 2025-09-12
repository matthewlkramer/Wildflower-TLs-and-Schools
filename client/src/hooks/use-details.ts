import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useDetailsTeacher(id?: string) {
  return useQuery<{ [k: string]: any }>({
    queryKey: ["supabase/details_teachers", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("details_teachers")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data as any;
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
