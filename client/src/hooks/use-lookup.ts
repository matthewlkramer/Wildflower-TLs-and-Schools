import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useEducatorLookup() {
  const { data: educators = [] } = useQuery<any[]>({
    queryKey: ["supabase/grid_educator/lookup"],
    queryFn: async () => {
      const pageSize = 1000;
      let offset = 0;
      let all: any[] = [];
      for (;;) {
        const { data, error } = await supabase
          .from("grid_educator")
          .select("id, full_name")
          .order("id", { ascending: true })
          .range(offset, offset + pageSize - 1);
        if (error) throw error;
        const chunk = data || [];
        all = all.concat(chunk);
        if (chunk.length < pageSize) break;
        offset += pageSize;
      }
      return all;
    },
    staleTime: 30 * 60 * 1000,
    gcTime: 2 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    placeholderData: (prev) => prev as any,
  });
  const educatorByName = useMemo(() => {
    const m = new Map<string, string>();
    (educators || []).forEach((e: any) => {
      const name = (e.full_name || e.fullName || '').toString();
      if (!name) return;
      m.set(name.toLowerCase(), e.id);
    });
    return m;
  }, [educators]);
  const idForName = (name?: string | null) => name ? educatorByName.get(String(name).toLowerCase()) : undefined;
  return { educators, educatorByName, idForName } as const;
}

export function useSchoolLookup() {
  const { data: schools = [] } = useQuery<any[]>({
    queryKey: ["supabase/grid_school/lookup"],
    queryFn: async () => {
      const pageSize = 1000;
      let offset = 0;
      let all: any[] = [];
      for (;;) {
        const { data, error } = await supabase
          .from("grid_school")
          .select("id, school_name, short_name, name")
          .order("id", { ascending: true })
          .range(offset, offset + pageSize - 1);
        if (error) throw error;
        const chunk = data || [];
        all = all.concat(chunk);
        if (chunk.length < pageSize) break;
        offset += pageSize;
      }
      return all;
    },
    staleTime: 30 * 60 * 1000,
    gcTime: 2 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    placeholderData: (prev) => prev as any,
  });
  const schoolByName = useMemo(() => {
    const m = new Map<string, string>();
    (schools || []).forEach((s: any) => {
      const names = [s.school_name, s.short_name, s.name].filter(Boolean) as string[];
      names.forEach((n) => m.set(n.toLowerCase(), s.id));
    });
    return m;
  }, [schools]);
  const idForName = (name?: string | null) => name ? schoolByName.get(String(name).toLowerCase()) : undefined;
  return { schools, schoolByName, idForName } as const;
}
