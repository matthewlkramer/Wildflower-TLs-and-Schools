/**
 * Field Registry Usage Examples
 *
 * This file shows how to use the new field registry system.
 * Delete this file once you're comfortable with the API.
 */

import { SCHOOL_FIELDS, GOVERNANCE_DOCS_FIELDS, NINE_NINETIES_FIELDS } from './field-registry';
import {
  registryToFieldMetadata,
  createListPresetFromRegistry,
} from '@/shared/utils/registry-resolver';

// ============================================================================
// EXAMPLE 1: Get a single field configuration
// ============================================================================

// Get complete config for 'doc_type' field
const docTypeConfig = GOVERNANCE_DOCS_FIELDS.get('doc_type');

console.log('doc_type configuration:', docTypeConfig);
// {
//   field: 'doc_type',
//   table: 'governance_docs',
//   label: 'Document Type',
//   type: 'lookup',
//   lookup: { table: 'zref_gov_docs', valueColumn: 'value', labelColumn: 'label' },
//   linksTo: { field: 'governance_doc_public_urls', type: 'array' },
//   editable: true,
//   nullable: true,
//   ...
// }

// ============================================================================
// EXAMPLE 2: Get all fields for a table
// ============================================================================

const allSchoolFields = SCHOOL_FIELDS.getAllFields();
console.log(`School has ${allSchoolFields.length} fields`);

const visibleFields = SCHOOL_FIELDS.getVisibleFields();
console.log(`${visibleFields.length} are visible`);

// ============================================================================
// EXAMPLE 3: Create a list preset from registry (NEW WAY)
// ============================================================================

// OLD WAY (lots of duplication):
/*
const OLD_GOVERNANCE_DOCS_PRESET = {
  title: 'Governance Docs',
  columns: [
    {
      field: 'doc_type',
      label: 'Document Type',
      lookupTable: 'zref_gov_docs',
      linkToAttachmentArray: 'governance_doc_public_urls',
      listLayout: 'title'
    },
    {
      field: 'upload_date',
      label: 'Upload Date',
      listLayout: 'subtitle'
    },
    { field: 'governance_doc_public_urls', visibility: 'suppress' },
  ],
  rowActions: ['view_in_modal', 'archive'],
  tableActions: [{id: 'addGovDoc', label: 'Add Document'}],
};
*/

// NEW WAY (registry provides config):
const NEW_GOVERNANCE_DOCS_PRESET = createListPresetFromRegistry({
  registry: GOVERNANCE_DOCS_FIELDS,
  title: 'Governance Docs',
  fields: [
    { name: 'doc_type', layout: 'title' },
    { name: 'upload_date', layout: 'subtitle' },
    { name: 'governance_doc_public_urls' }, // Auto-suppressed
    { name: 'governance_doc_object_ids' }, // Auto-suppressed
  ],
  orderBy: { column: 'upload_date', ascending: false },
  rowActions: ['view_in_modal', 'archive'],
  tableActions: [{ id: 'addGovDoc', label: 'Add Document' }],
});

console.log('Generated preset:', NEW_GOVERNANCE_DOCS_PRESET);

// ============================================================================
// EXAMPLE 4: Pass registry config to card-service
// ============================================================================

// When calling card-service, pass field metadata from registry
const fieldMetadata = registryToFieldMetadata(
  GOVERNANCE_DOCS_FIELDS,
  ['doc_type', 'upload_date', 'governance_doc_public_urls']
);

// Then use in service:
// await cardService.loadListData('governanceDocs', schoolId, 'school', false, fieldMetadata);

// ============================================================================
// EXAMPLE 5: Validate registry (catches errors early)
// ============================================================================

const validation = GOVERNANCE_DOCS_FIELDS.validate();
if (!validation.valid) {
  console.error('Registry validation errors:', validation.errors);
}
if (validation.warnings.length > 0) {
  console.warn('Registry warnings:', validation.warnings);
}

// ============================================================================
// EXAMPLE 6: Get registry summary (debugging)
// ============================================================================

console.log('Governance Docs Summary:', GOVERNANCE_DOCS_FIELDS.getSummary());
// {
//   table: 'governance_docs',
//   totalFields: 8,
//   visibleFields: 6,
//   suppressedFields: 2,
//   editableFields: 4,
//   fieldTypes: { string: 3, lookup: 1, date: 1, attachmentArray: 1, ... }
// }

// ============================================================================
// EXAMPLE 7: Field exists anywhere in DB (instant!)
// ============================================================================

// Add a new column to governance_docs in DB:
// ALTER TABLE governance_docs ADD COLUMN reviewed_by TEXT;

// Run: npm run gen:all

// Instantly available (no manual config needed!):
const reviewedByConfig = GOVERNANCE_DOCS_FIELDS.get('reviewed_by');
console.log(reviewedByConfig);
// {
//   field: 'reviewed_by',
//   label: 'Reviewed By',  // Auto-humanized
//   type: 'string',        // Auto-inferred
//   editable: true,        // Default
//   ...
// }

// ============================================================================
// EXAMPLE 8: Override generated config (when needed)
// ============================================================================

// If you want custom config, just add to field-registry.ts:
/*
export const GOVERNANCE_DOCS_FIELDS = createFieldRegistry('governance_docs', {
  // ...existing config...

  reviewed_by: {
    label: 'Reviewed By (Name)',  // Custom label
    lookupTable: 'people',         // It's actually a person lookup
  },
});
*/

// ============================================================================
// MIGRATION STRATEGY
// ============================================================================

/*
Phase 1: Use alongside old config (both work)
  - Registry exists
  - Old presets still work
  - New views can use registry

Phase 2: Migrate one view at a time
  - Convert governanceDocs preset to use registry
  - Test thoroughly
  - Repeat for other views

Phase 3: Remove old config
  - All views using registry
  - Delete old SCHOOL_FIELD_METADATA
  - Delete manual preset configs
  - Just have registry!
*/

export {
  NEW_GOVERNANCE_DOCS_PRESET,
  fieldMetadata,
};
