import { useQuery } from "@tanstack/react-query";
import type { EducatorSchoolAssociation } from "@shared/schema.generated";
import { AssociationGrid, type AssociationRow } from "@/components/associations/AssociationGrid";
import { supabase } from "@/integrations/supabase/client";

interface EducatorSchoolAssociationsTableProps {
  educatorId: string;
}

export function EducatorSchoolAssociationsTable({ educatorId }: EducatorSchoolAssociationsTableProps) {
  const { data: associations = [], isLoading } = useQuery<any[]>({
    queryKey: ["supabase/detail_associations", { educatorId }],
    enabled: !!educatorId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('detail_associations')
        .select('*')
        .eq('people_id', educatorId);
      if (error) throw error;
      return data || [];
    },
  });

  const rows: AssociationRow[] = (associations || []).map((a: any) => ({
    id: a.id,
    schoolId: a.school_id || a.schoolId,
    schoolShortName: a.school_short_name || a.schoolShortName,
    roles: (a.role || a.roles || a.role_at_school) as any,
    startDate: a.start_date || a.startDate || null,
    endDate: a.end_date || a.endDate || null,
    isActive: !!(a.is_active ?? a.isActive),
    stageStatus: a.stage_status || a.stageStatus || null,
  }));

  if (isLoading) {
    return <div className="text-sm text-slate-500">Loading…</div>;
  }
  if (!rows.length) {
    return (
      <div className="bg-slate-50 rounded-lg p-4">
        <p className="text-sm text-slate-500">No school associations found for this educator.</p>
      </div>
    );
  }

  return (
    <AssociationGrid
      mode="byEducator"
      rows={rows}
      onOpen={(row) => { if (row.schoolId) window.location.href = `/school/${row.schoolId}`; }}
      onChangeRow={(rowId, patch) => {
        const current = rows.find(r => r.id === rowId);
        if (!current) return;
        const roles = Array.isArray(patch.roles) ? patch.roles : (Array.isArray(current.roles) ? current.roles : []);
        const body: any = {
          role: roles,
          isActive: patch.isActive ?? current.isActive,
          startDate: patch.startDate ?? current.startDate,
          endDate: patch.endDate ?? current.endDate,
        };
        // Note: Updates remain on server endpoint until Supabase write path is defined
        fetch(`/api/teacher-school-associations/${rowId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(body),
        }).catch(() => {});
      }}
    />
  );
}
