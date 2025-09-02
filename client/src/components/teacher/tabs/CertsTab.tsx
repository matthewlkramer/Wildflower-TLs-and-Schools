import { MontessoriCertificationsTable } from "@/components/montessori-certifications-table";

export function CertsTab({ educatorId }: { educatorId: string }) {
  return (
    <div className="space-y-4">
      <MontessoriCertificationsTable educatorId={educatorId} />
    </div>
  );
}

