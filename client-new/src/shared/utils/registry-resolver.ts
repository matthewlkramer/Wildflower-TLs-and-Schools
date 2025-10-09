/**
 * Registry Resolver - Converts registry config to formats used by services
 * This bridges the new registry system with existing card/table services
 */

import type { FieldRegistry, CompleteFieldConfig } from './field-registry';
import type { FieldMetadataMap } from '../types/detail-types';

/**
 * Convert field registry to FieldMetadataMap format
 * Used to pass registry config to card-service
 */
export function registryToFieldMetadata(
  registry: FieldRegistry,
  fieldNames?: string[]
): FieldMetadataMap {
  const fields = fieldNames
    ? fieldNames.map(f => registry.get(f as any))
    : registry.getVisibleFields();

  const metadata: FieldMetadataMap = {};

  for (const field of fields) {
    metadata[field.field] = {
      label: field.label,
      type: field.type as any,
      array: field.array,
      multiline: field.multiline,
      width: field.width,
      lookupTable: field.lookupTable || field.lookup?.table,
      editable: field.editable,
      writeTable: field.sourceTable,
      linksTo: field.linksTo,
    };
  }

  return metadata;
}

/**
 * Convert field config to table column metadata
 * Used for table/list presets
 */
export function fieldToColumnMeta(field: CompleteFieldConfig) {
  return {
    field: field.field,
    label: field.label,
    type: field.type,
    lookupTable: field.lookupTable || field.lookup?.table,
    multiline: field.multiline,
    width: field.width,
    linkToAttachmentArray: field.linksTo?.type === 'array' ? field.linksTo.field : undefined,
    linkToAttachment: field.linksTo?.type === 'single' ? field.linksTo.field : undefined,
    visibility: field.visibility === 'suppress' ? 'suppress' : undefined,
    update: field.editable ? 'yes' : 'no',
  };
}

/**
 * Create a list preset from field registry
 * Automatically generates column configs from registry
 */
export function createListPresetFromRegistry(config: {
  registry: FieldRegistry;
  fields: Array<{
    name: string;
    layout?: 'title' | 'subtitle' | 'body' | 'badge' | 'footer';
  }>;
  title?: string;
  orderBy?: { column: string; ascending: boolean };
  rowActions?: readonly string[];
  tableActions?: readonly Array<{ id: string; label: string }>;
  readSource?: string;
  cardLimit?: number;
}) {
  const columns = config.fields.map(({ name, layout }) => {
    const field = config.registry.get(name as any);
    return {
      ...fieldToColumnMeta(field),
      listLayout: layout,
    };
  });

  return {
    title: config.title,
    orderBy: config.orderBy ? [config.orderBy] : undefined,
    cardLimit: config.cardLimit || 50,
    readSource: config.readSource || config.registry['tableName'],
    columns,
    rowActions: config.rowActions,
    tableActions: config.tableActions,
  };
}

/**
 * Get field metadata for a specific list of fields
 * Convenience helper for passing to services
 */
export function getFieldMetadataForFields(
  registry: FieldRegistry,
  fieldNames: string[]
): FieldMetadataMap {
  return registryToFieldMetadata(registry, fieldNames);
}
