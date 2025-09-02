/**
 * Schools tab for teacher detail. Renders the educator's school association
 * records using `EducatorSchoolAssociationsTable`, which manages fetching and
 * editing of associated schools.
 */
import { EducatorSchoolAssociationsTable } from "@/components/educator-school-associations-table";

export function SchoolsTab({ educatorId }: { educatorId: string }) {
  return (
    <div className="space-y-4">
      <EducatorSchoolAssociationsTable educatorId={educatorId} />
    </div>
  );
}

