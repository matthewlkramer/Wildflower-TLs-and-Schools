/**
 * Educator “Contact” tab. Displays all communication channels for the teacher.
 * The first card is an `EmailAddressesTable` tied to the educator id which lets
 * users add or remove multiple email addresses with inline actions. Beneath it a
 * `DetailGrid` renders an `InfoCard` titled “Phone & Address” with three
 * read‑write fields: primary phone, secondary phone, and home address. Values are
 * passed directly from the `teacher` object and saved back through the card’s
 * built‑in editing controls. The layout uses two columns so phone numbers sit
 * side by side above the multiline address field.
 */
import React from 'react';
// Types handled inline to avoid import issues
import { EmailAddressesTable } from "@/components/email-addresses-table";
import { DetailGrid } from "@/components/shared/DetailGrid";
import { InfoCard } from "@/components/shared/InfoCard";

export function ContactTab({ teacher, onSave }: { teacher: any; onSave?: (vals: any)=>void }) {
  return (
    <>
      <EmailAddressesTable educatorId={teacher.id} />
      <DetailGrid className="mt-6">
        <InfoCard
          title="Phone"
          columns={2}
          fields={[
            { key: 'primaryPhone', label: 'Primary Phone', type: 'text', value: (teacher as any)?.primaryPhone ?? '' },
            { key: 'secondaryPhone', label: 'Secondary Phone', type: 'text', value: (teacher as any)?.secondaryPhone ?? '' },
          ]}
          onSave={(vals)=>onSave?.(vals)}
        />
        <InfoCard
          title="Address"
          columns={1}
          fields={[
            { key: 'homeAddress', label: 'Home Address', type: 'textarea', value: (teacher as any)?.homeAddress ?? '' },
          ]}
          onSave={(vals)=>onSave?.(vals)}
        />
      </DetailGrid>
    </>
  );
}
