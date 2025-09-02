/**
 * Contact tab provides email, phone, and address information for the educator.
 * Email addresses are managed via `EmailAddressesTable` while other fields are
 * rendered using `EntityCard` within a detail grid layout.
 */
import { TableCard } from "@/components/shared/TableCard";
import { EmailAddressesTable } from "@/components/email-addresses-table";
import { DetailGrid } from "@/components/shared/DetailGrid";
import { EntityCard } from "@/components/shared/EntityCard";
import type { Teacher } from "@shared/schema";

export function ContactTab({ teacher }: { teacher: Teacher }) {
  return (
    <>
      <TableCard title="Email Addresses">
        <EmailAddressesTable educatorId={teacher.id} />
      </TableCard>
      <DetailGrid className="mt-6">
        <EntityCard
          title="Phone & Address"
          columns={2}
          fields={[
            { key: 'primaryPhone', label: 'Primary Phone', type: 'text', value: (teacher as any)?.primaryPhone ?? '' },
            { key: 'secondaryPhone', label: 'Secondary Phone', type: 'text', value: (teacher as any)?.secondaryPhone ?? '' },
            { key: 'homeAddress', label: 'Home Address', type: 'textarea', value: (teacher as any)?.homeAddress ?? '' },
          ]}
        />
      </DetailGrid>
    </>
  );
}

