/**
 * Educator “Certifications” tab. A thin wrapper that renders the
 * `MontessoriCertificationsTable` for the current educator. That table queries
 * the server for all Montessori certification entries linked to the educator
 * id and supports adding, editing, and deleting rows. This tab itself adds only
 * spacing but establishes the contract that certifications are scoped by
 * `educatorId` supplied via props.
 */
import { MontessoriCertificationsTable } from "@/components/montessori-certifications-table";

export function CertsTab({ educatorId }: { educatorId: string }) {
  return (
    <div className="space-y-4">
      <MontessoriCertificationsTable educatorId={educatorId} />
    </div>
  );
}

