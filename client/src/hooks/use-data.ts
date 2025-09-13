// Deprecated: prefer specific hooks
// - Grid: useGridEducators/useGridTeachers, useGridSchools, useGridCharters
// - Details: useDetailEducators, useDetailSchools, useDetailCharters
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { set } from "date-fns";

type Entity = 'educators' | 'schools' | 'charters';
type Kind = 'grid' | 'details';

function viewName(entity: Entity, kind: Kind) {
  if (kind === 'grid') {
    if (entity === 'educators') return 'grid_educator';
    if (entity === 'schools') return 'grid_school';
    return 'grid_charter';
  }
  if (entity === 'educators') return 'details_educators';
  if (entity === 'schools') return 'details_schools';
  return 'details_charters';
}

export function useData(entity: Entity, kind: Kind, id?: string) {
  const key = ["supabase/useData", entity, kind, id];
  return useQuery<any[]>({
    queryKey: key,
    enabled: kind === 'grid' ? true : !!id,
    queryFn: async () => {
      const view = viewName(entity, kind);
      if (kind === 'details') {
        const { data, error } = await supabase.from(view).select('*').eq('id', id!).single();
        if (error) throw error;
        return [normalize(entity, data)];
      }
      // grid: fetch all with simple paging
      const pageSize = 1000;
      let offset = 0;
      let all: any[] = [];
      for (;;) {
        const { data, error } = await supabase
          .from(view)
          .select('*')
          .order('id', { ascending: true })
          .range(offset, offset + pageSize - 1);
        if (error) throw error;
        const chunk = data || [];
        all = all.concat(chunk);
        if (chunk.length < pageSize) break;
        offset += pageSize;
      }
      return all.map((r) => normalize(entity, r));
    },
    staleTime: 30 * 60 * 1000,
    gcTime: 2 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    placeholderData: (prev) => prev as any,
  });
}

function normalize(entity: Entity, row: any) {
  if (!row || typeof row !== 'object') return row;
  const out: any = { ...row };
  const setIfMissing = (key: string, ...alts: string[]) => {
    if (out[key] !== undefined && out[key] !== null) return;
    for (const a of alts) { if (row[a] !== undefined && row[a] !== null) { out[key] = row[a]; return; } }
  };
  if (entity === 'educators') {
    setIfMissing('fullName', 'full_name', 'name');
    setIfMissing('firstName', 'first_name');
    setIfMissing('lastName', 'last_name');
    setIfMissing('primaryPhone', 'primary_phone');
    setIfMissing('montessoriCertified', 'has_montessori_cert');
    setIfMissing('activeSchool', 'active_school');
    setIfMissing('currentRole', 'current_role');
    setIfMissing('activeSchoolStageStatus', 'active_school_stage_status', 'stage_status');
    return out;
  }
  if (entity === 'schools') {
    setIfMissing('name', 'long_name');
    setIfMissing('shortName', 'short_name');
    setIfMissing('governanceModel', 'governance_model');
    setIfMissing('schoolCalendar', 'school_calendar');
    setIfMissing('schoolSchedule', 'school_sched');
    setIfMissing('email', 'school_email');
    setIfMissing('phone', 'school_phone');
    setIfMissing('logoUrl', 'logo_url');
    return out;
  }
  // charters
  setIfMissing('shortName', 'short_name');
  setIfMissing('fullName', 'full_name');
  setIfMissing('status', 'status');
  return out;
}
