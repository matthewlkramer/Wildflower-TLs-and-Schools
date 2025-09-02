import { AssociationGrid, type AssociationRow } from "@/components/associations/AssociationGrid";
import type { School, Teacher, TeacherSchoolAssociation } from "@shared/schema";

type Props = {
  school: School;
  associations: TeacherSchoolAssociation[];
  teachers: Teacher[];
  onUpdateAssociation: (associationId: string, data: any) => void;
  onEndStint: (associationId: string) => void;
  onDeleteAssociation: (associationId: string) => void;
};

export function SchoolTLsAssociationGrid({ school, associations, teachers, onUpdateAssociation, onEndStint, onDeleteAssociation }: Props) {
  const rows: AssociationRow[] = (associations || []).map((a) => {
    const t = teachers?.find((x) => x.id === a.educatorId);
    const roleStr = Array.isArray(a.role) ? (a.role as string[]).join(', ') : String(a.role || '');
    const roles = roleStr.split(',').map(s => s.trim()).filter(Boolean);
    return {
      id: a.id,
      educatorId: a.educatorId,
      educatorName: t?.fullName || ((t?.firstName && t?.lastName) ? `${t.firstName} ${t.lastName}` : (a as any).educatorName || a.educatorId),
      roles,
      startDate: a.startDate || null,
      endDate: a.endDate || null,
      isActive: !!a.isActive,
      emailAtSchool: (a as any)?.emailAtSchool || null,
      phone: t?.primaryPhone || null,
    };
  });

  return (
    <AssociationGrid
      mode="bySchool"
      rows={rows}
      onOpen={(row) => { if (row.educatorId) window.location.href = `/teacher/${row.educatorId}`; }}
      onEdit={(row) => onUpdateAssociation(row.id, {/* no-op for now */})}
      onEndStint={(row) => onEndStint(row.id)}
      onDelete={(row) => onDeleteAssociation(row.id)}
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
        onUpdateAssociation(rowId, body);
      }}
    />
  );
}
