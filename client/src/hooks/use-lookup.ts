import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Educator, School } from "@shared/schema";

export function useEducatorLookup() {
  const { data: educators = [] } = useQuery<Educator[]>({ queryKey: ["/api/educators"] });
  const educatorByName = useMemo(() => {
    const m = new Map<string, string>();
    (educators || []).forEach((e) => {
      const name = (e.fullName || `${e.firstName || ''} ${e.lastName || ''}`.trim());
      if (!name) return;
      m.set(name.toLowerCase(), e.id);
    });
    return m;
  }, [educators]);
  const idForName = (name?: string | null) => name ? educatorByName.get(String(name).toLowerCase()) : undefined;
  return { educators, educatorByName, idForName } as const;
}

export function useSchoolLookup() {
  const { data: schools = [] } = useQuery<School[]>({ queryKey: ["/api/schools"] });
  const schoolByName = useMemo(() => {
    const m = new Map<string, string>();
    (schools || []).forEach((s) => {
      const names = [s.name, s.shortName].filter(Boolean) as string[];
      names.forEach((n) => m.set(n.toLowerCase(), s.id));
    });
    return m;
  }, [schools]);
  const idForName = (name?: string | null) => name ? schoolByName.get(String(name).toLowerCase()) : undefined;
  return { schools, schoolByName, idForName } as const;
}

