import { EducatorNotesTable } from "@/components/educator-notes-table";

export function NotesTab({ educatorId }: { educatorId: string }) {
  return (
    <div className="space-y-4">
      <EducatorNotesTable educatorId={educatorId} />
    </div>
  );
}

