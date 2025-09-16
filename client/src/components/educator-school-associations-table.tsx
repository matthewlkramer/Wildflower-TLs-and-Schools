import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AssociationGrid, type AssociationRow } from "@/components/associations/AssociationGrid";
import { supabase } from "@/integrations/supabase/client";

interface EducatorSchoolAssociationsTableProps {
  educatorId: string;
}

export function EducatorSchoolAssociationsTable({ educatorId }: EducatorSchoolAssociationsTableProps) {
  const queryClient = useQueryClient();
  
  const { data: associations = [], isLoading } = useQuery<any[]>({
    queryKey: ["supabase/details_associations", { educatorId }],
    enabled: !!educatorId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('details_associations')
        .select('*')
        .eq('people_id', educatorId);
      if (error) throw error;
      return data || [];
    },
  });

  const updateAssociation = useMutation({
    mutationFn: async (args: any) => {
      const { id, data } = args as { id: string; data: any };
      const { error } = await supabase
        .from('details_associations')
        .update({
          role: data.roles,
          currently_active: data.isActive,
          start_date: data.startDate,
          end_date: data.endDate,
        })
        .eq('id', id);
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supabase/details_associations", { educatorId }] });
    },
  });

  const rows: AssociationRow[] = (associations || []).map((a: any) => ({
    id: a.id,
    schoolId: a.school_id || a.schoolId,
    schoolShortName: a.school_short_name || a.school_name || a.schoolShortName,
    roles: (a.role || a.roles || a.role_at_school) as any,
    startDate: a.start_date || a.startDate || null,
    endDate: a.end_date || a.endDate || null,
    isActive: !!(a.currently_active ?? a.isActive),
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
        updateAssociation.mutate({
          id: rowId,
          data: {
            roles,
            isActive: patch.isActive ?? current.isActive,
            startDate: patch.startDate ?? current.startDate,
            endDate: patch.endDate ?? current.endDate,
          }
        });
      }}
    />
  );
}
