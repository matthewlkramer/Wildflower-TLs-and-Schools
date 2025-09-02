/**
 * Educator “Schools” tab. Hosts the `EducatorSchoolAssociationsTable` which
 * lists all school association records for the given educator id. The table
 * supports adding new associations, editing fields such as role and stage, and
 * deleting existing links. It is the authoritative view of where an educator is
 * or has been placed. This tab provides spacing but defers all heavy lifting to
 * the table component.
 */
import { EducatorSchoolAssociationsTable } from "@/components/educator-school-associations-table";

export function SchoolsTab({ educatorId }: { educatorId: string }) {
  return (
    <div className="space-y-4">
      <EducatorSchoolAssociationsTable educatorId={educatorId} />
    </div>
  );
}

