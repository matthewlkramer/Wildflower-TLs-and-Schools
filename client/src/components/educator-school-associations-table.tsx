import { useQuery } from "@tanstack/react-query";
import type { EducatorSchoolAssociation } from "@shared/schema.generated";
import { AssociationGrid, type AssociationRow } from "@/components/associations/AssociationGrid";

interface EducatorSchoolAssociationsTableProps {
  educatorId: string;
}

export function EducatorSchoolAssociationsTable({ educatorId }: EducatorSchoolAssociationsTableProps) {
  const { data: associations = [], isLoading } = useQuery<EducatorSchoolAssociation[]>({
    queryKey: ["/api/educator-school-associations/educator", educatorId],
    queryFn: async () => {
      const response = await fetch(`/api/educator-school-associations/educator/${educatorId}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch educator school associations");
      return response.json();
    },
  });

  const rows: AssociationRow[] = (associations || []).map((a) => ({
    id: a.id,
    schoolId: a.schoolId,
    schoolShortName: (a as any).schoolShortName,
    roles: a.role as any,
    startDate: a.startDate || null,
    endDate: a.endDate || null,
    isActive: !!a.isActive,
    stageStatus: (a as any).stageStatus || null,
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
