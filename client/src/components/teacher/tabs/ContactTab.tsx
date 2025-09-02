/**
 * Educator “Contact” tab. Displays all communication channels for the teacher.
 * The first card is an `EmailAddressesTable` tied to the educator id which lets
 * users add or remove multiple email addresses with inline actions. Beneath it a
 * `DetailGrid` renders an `EntityCard` titled “Phone & Address” with three
 * read‑write fields: primary phone, secondary phone, and home address. Values are
 * passed directly from the `teacher` object and saved back through the card’s
 * built‑in editing controls. The layout uses two columns so phone numbers sit
 * side by side above the multiline address field.
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

