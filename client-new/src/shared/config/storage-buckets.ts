/**
 * Mapping of field names to Supabase storage bucket names
 */
export const STORAGE_BUCKET_MAPPING: Record<string, string> = {
  // Logo fields
  logo: 'logos',
  logo_square: 'logos',
  logo_flower_only: 'logos',
  logo_rectangle: 'logos',

  // Self-reflection documents
  self_reflection_doc: 'self-reflections',

  // Albums
  planning_album: 'albums',
  visioning_album: 'albums',

  // Membership agreements
  membership_agreement: 'membership-agreements',
  membership_agreement_doc: 'membership-agreements',

  // Leases (for location table)
  lease_docs: 'leases',
};

/**
 * Mapping of table names to storage buckets for generic fields like object_id
 */
export const TABLE_BUCKET_MAPPING: Record<string, string> = {
  governance_docs: 'governance-docs',
  nine_nineties: '990s',
  self_reflections: 'self-reflections',
  membership_agreements: 'membership-agreements',
};

/**
 * Get the storage bucket for a given field name
 * Returns 'attachments' as default if no specific bucket is found
 */
export function getStorageBucket(fieldName: string, tableName?: string): string {
  // First check field-specific mapping
  if (STORAGE_BUCKET_MAPPING[fieldName]) {
    return STORAGE_BUCKET_MAPPING[fieldName];
  }

  // For generic fields like object_id, check table-specific mapping
  if (fieldName === 'object_id' && tableName && TABLE_BUCKET_MAPPING[tableName]) {
    return TABLE_BUCKET_MAPPING[tableName];
  }

  return 'attachments';
}
