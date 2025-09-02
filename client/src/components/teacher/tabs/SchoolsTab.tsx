import { EducatorSchoolAssociationsTable } from "@/components/educator-school-associations-table";

export function SchoolsTab({ educatorId }: { educatorId: string }) {
  return (
    <div className="space-y-4">
      <EducatorSchoolAssociationsTable educatorId={educatorId} />
    </div>
  );
}

