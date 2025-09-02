/**
 * Educator “Notes” tab. Wraps the `EducatorNotesTable` which loads all note
 * entries tied to the educator id. The table provides chronological sorting,
 * inline editing, and add/delete actions so staff can maintain a running log of
 * interactions. This tab itself supplies only layout spacing.
 */
import { EducatorNotesTable } from "@/components/educator-notes-table";

export function NotesTab({ educatorId }: { educatorId: string }) {
  return (
    <div className="space-y-4">
      <EducatorNotesTable educatorId={educatorId} />
    </div>
  );
}

