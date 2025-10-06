/**
 * School Fields Registry
 *
 * ONLY define fields that need manual configuration.
 * All other fields automatically inherit from generated schema.
 *
 * To use: SCHOOL_FIELDS.get('field_name')
 */

import { createFieldRegistry } from '@/shared/utils/field-registry';

/**
 * Manual overrides for school-related fields
 * Most fields use 100% generated config - only override what's needed!
 */
export const SCHOOL_FIELDS = createFieldRegistry('schools', {
  // Attachments - single files
  logo: {
    label: 'Logo',
    type: 'attachment',
    bucket: 'logos',
  },

  logo_square: {
    label: 'Logo (Square)',
    type: 'attachment',
    bucket: 'logos',
  },

  logo_flower_only: {
    label: 'Logo (Flower Only)',
    type: 'attachment',
    bucket: 'logos',
  },

  logo_rectangle: {
    label: 'Logo (Rectangle)',
    type: 'attachment',
    bucket: 'logos',
  },

  membership_agreement: {
    label: 'Membership Agreement',
    type: 'attachment',
    bucket: 'membership-agreements',
  },

  self_reflection_doc: {
    label: 'Self Reflection Document',
    type: 'attachment',
    bucket: 'self-reflections',
  },

  planning_album: {
    label: 'Planning Album',
    type: 'attachment',
    bucket: 'albums',
  },

  visioning_album: {
    label: 'Visioning Album',
    type: 'attachment',
    bucket: 'albums',
  },

  // Text fields with special display
  about: {
    label: 'About',
    multiline: true,
    maxLength: 5000,
  },

  about_spanish: {
    label: 'About (Spanish)',
    multiline: true,
    maxLength: 5000,
  },

  address: {
    label: 'Address',
    multiline: true,
  },

  program_focus: {
    label: 'Program Focus',
    multiline: true,
  },

  // Labels for special fields
  ein: {
    label: 'EIN',
  },

  physical_lat: {
    label: 'Latitude',
    editable: false,
  },

  physical_long: {
    label: 'Longitude',
    editable: false,
  },

  // Computed/readonly fields
  stage_status: {
    label: 'Stage/Status',
    editable: false,
  },

  current_guide_name: {
    label: 'Current Guide',
    editable: false,
  },

  current_tls: {
    label: 'Current TLs',
    editable: false,
  },

  total_grants_issued: {
    label: 'Total Grants Issued',
    editable: false,
  },

  total_loans_issued: {
    label: 'Total Loans Issued',
    editable: false,
  },

  wf_tls_on_board: {
    label: 'WF TLs On Board',
    editable: false,
  },

  // Lookups (generated will infer most, but we can add labels)
  founding_tls: {
    label: 'Founding TLs',
    lookupTable: 'people',
  },
});

/**
 * Governance Docs fields (separate table)
 */
export const GOVERNANCE_DOCS_FIELDS = createFieldRegistry('governance_docs', {
  doc_type: {
    label: 'Document Type',
    lookupTable: 'zref_gov_docs',
    linksTo: {
      field: 'governance_doc_public_urls',
      type: 'array',
    },
  },

  upload_date: {
    label: 'Upload Date',
    type: 'date',
  },

  governance_doc_public_urls: {
    label: 'Files',
    type: 'attachmentArray',
    visibility: 'suppress', // Don't show as separate field
  },

  governance_doc_object_ids: {
    label: 'File IDs',
    visibility: 'suppress', // Internal use only
  },
});

/**
 * Nine Nineties fields (separate table)
 */
export const NINE_NINETIES_FIELDS = createFieldRegistry('nine_nineties', {
  form_year: {
    label: 'Year',
    linksTo: {
      field: 'nine_nineties_public_urls',
      type: 'array',
    },
  },

  nine_nineties_public_urls: {
    label: 'Files',
    type: 'attachmentArray',
    visibility: 'suppress',
  },

  nine_nineties_object_ids: {
    visibility: 'suppress',
  },

  ai_derived_revenue: {
    label: 'AI Derived Revenue',
    editable: false,
  },

  ai_derived_EOY: {
    label: 'AI Derived End of Year',
    editable: false,
  },
});

// Validate registries on import (dev mode only)
if (process.env.NODE_ENV === 'development') {
  const schoolValidation = SCHOOL_FIELDS.validate();
  if (!schoolValidation.valid) {
    console.error('[SCHOOL_FIELDS] Validation errors:', schoolValidation.errors);
  }
  if (schoolValidation.warnings.length > 0) {
    console.warn('[SCHOOL_FIELDS] Validation warnings:', schoolValidation.warnings);
  }

  const govDocsValidation = GOVERNANCE_DOCS_FIELDS.validate();
  if (!govDocsValidation.valid) {
    console.error('[GOVERNANCE_DOCS_FIELDS] Validation errors:', govDocsValidation.errors);
  }

  const nineNinetiesValidation = NINE_NINETIES_FIELDS.validate();
  if (!nineNinetiesValidation.valid) {
    console.error('[NINE_NINETIES_FIELDS] Validation errors:', nineNinetiesValidation.errors);
  }
}

// Export summaries for debugging
export function logFieldRegistrySummaries() {
  console.log('[SCHOOL_FIELDS]', SCHOOL_FIELDS.getSummary());
  console.log('[GOVERNANCE_DOCS_FIELDS]', GOVERNANCE_DOCS_FIELDS.getSummary());
  console.log('[NINE_NINETIES_FIELDS]', NINE_NINETIES_FIELDS.getSummary());
}
