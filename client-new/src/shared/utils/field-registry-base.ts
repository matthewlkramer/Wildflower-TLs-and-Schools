/**
 * Field Registry Base - Infers field configuration from generated schema
 * This layer reads from generated files and provides smart defaults
 */

import { schemaMetadata } from '@/generated/schema-metadata.generated';
import { GENERATED_LOOKUPS, type LookupConfig } from '@/generated/lookups.generated';

export type FieldType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'date'
  | 'enum'
  | 'lookup'
  | 'attachment'
  | 'attachmentArray'
  | 'json';

export type GeneratedFieldInfo = {
  field: string;
  table: string;
  type: FieldType;
  array: boolean;
  nullable: boolean;
  lookup: LookupConfig | null;
  enumRef: string | null;
  foreignKeys: Array<{
    table: string;
    column: string;
  }>;
};

/**
 * Get base field information from generated schema metadata
 */
export function getGeneratedFieldInfo(
  table: string,
  field: string
): GeneratedFieldInfo | null {
  const columnMeta = schemaMetadata.public?.[table]?.columns?.[field];
  if (!columnMeta) {
    console.warn(`[field-registry] Field ${table}.${field} not found in generated schema`);
    return null;
  }

  const type = inferFieldType(table, field, columnMeta);
  const lookup = inferLookup(table, field, columnMeta);

  return {
    field,
    table,
    type,
    array: columnMeta.isArray || false,
    nullable: columnMeta.isNullable ?? true,
    lookup,
    enumRef: columnMeta.enumRef || null,
    foreignKeys: (columnMeta.references || []).map((ref: any) => ({
      table: ref.relation,
      column: ref.referencedColumns[0],
    })),
  };
}

/**
 * Infer the field type from schema metadata and naming patterns
 */
function inferFieldType(
  table: string,
  field: string,
  meta: any
): FieldType {
  // Check for attachment patterns
  if (field.includes('object_id') && !meta.isArray) {
    return 'attachment';
  }

  if (field.includes('object_ids') && meta.isArray) {
    return 'attachment'; // Still attachment, just array version
  }

  if (field.includes('public_url') && meta.isArray) {
    return 'attachmentArray';
  }

  // Check for enum reference
  if (meta.enumRef) {
    return 'enum';
  }

  // Check for foreign key relationships (likely lookup)
  if (meta.references?.length > 0) {
    // Skip self-references and archive flags
    if (!field.includes('is_archived') && !field.includes('archived_by')) {
      return 'lookup';
    }
  }

  // Check for common ID patterns (but not primary key 'id')
  if (field.endsWith('_id') && field !== 'id') {
    return 'lookup';
  }

  // Base type mapping
  switch (meta.baseType) {
    case 'boolean':
      return 'boolean';
    case 'number':
      return 'number';
    case 'json':
      return 'json';
    default:
      // Check for date patterns
      if (field.includes('date') || field.includes('_at') || field === 'created' || field === 'updated') {
        return 'date';
      }
      return 'string';
  }
}

/**
 * Infer lookup configuration from field metadata
 */
function inferLookup(
  table: string,
  field: string,
  meta: any
): LookupConfig | null {
  // Try exact match in generated lookups (e.g., 'doc_type')
  if (GENERATED_LOOKUPS[field]) {
    return GENERATED_LOOKUPS[field];
  }

  // Try removing '_id' suffix (e.g., 'school_id' → 'schools')
  if (field.endsWith('_id')) {
    const baseName = field.slice(0, -3); // Remove '_id'

    // Try plural
    const pluralName = baseName + 's';
    if (GENERATED_LOOKUPS[pluralName]) {
      return GENERATED_LOOKUPS[pluralName];
    }

    // Try singular
    if (GENERATED_LOOKUPS[baseName]) {
      return GENERATED_LOOKUPS[baseName];
    }
  }

  // Try using foreign key reference
  if (meta.references?.length > 0) {
    const refTable = meta.references[0].relation;
    if (GENERATED_LOOKUPS[refTable]) {
      return GENERATED_LOOKUPS[refTable];
    }
  }

  // Common field name patterns
  const lookupMappings: Record<string, string> = {
    'doc_type': 'zref_gov_docs',
    'stage_status': 'zref_stage_statuses',
    'membership_status': 'zref_membership_statuses',
    'governance_model': 'governance_models', // If this becomes a lookup table
  };

  const lookupTable = lookupMappings[field];
  if (lookupTable && GENERATED_LOOKUPS[lookupTable]) {
    return GENERATED_LOOKUPS[lookupTable];
  }

  return null;
}

/**
 * Get all fields for a table from generated schema
 */
export function getAllGeneratedFields(table: string): string[] {
  const columns = schemaMetadata.public?.[table]?.columns;
  if (!columns) {
    console.warn(`[field-registry] Table ${table} not found in generated schema`);
    return [];
  }
  return Object.keys(columns);
}

/**
 * Humanize field name (e.g., 'doc_type' → 'Doc Type')
 */
export function humanizeFieldName(field: string): string {
  return field
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Check if a field exists in the generated schema
 */
export function fieldExists(table: string, field: string): boolean {
  return schemaMetadata.public?.[table]?.columns?.[field] !== undefined;
}
