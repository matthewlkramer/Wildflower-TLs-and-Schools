import { TABLE_LIST_PRESETS, type TablePreset } from '../config/table-list-presets';
import { GENERATED_LOOKUPS } from '@/generated/lookups.generated';
import { ENUM_OPTIONS, FIELD_TYPES } from '@/generated/enums.generated';
import { getColumnMetadata } from '@/generated/schema-metadata';
import type {
  TableColumnMeta,
  FieldLookup,
  FilterExpr
} from './detail-types';

export type ResolvedTableColumn = {
  field: string;
  label: string;
  type?: 'string' | 'number' | 'boolean' | 'date' | 'enum' | 'attachment';
  lookup?: FieldLookup;
  options?: string[];
  multiline?: boolean;
  width?: string;
  attachment?: boolean;
  maxArrayEntries?: number;
  linkToField?: string;
  linkToAttachmentArray?: string; // Points to a text[] field containing public URLs
  update?: 'no' | 'yes' | 'newOnly';
  writeTo?: { schema?: string; table: string; pk?: string; column?: string };
  array?: boolean;
  editable: boolean;
};

export type ResolvedTableSpec = {
  title?: string;
  readSource: string;
  readFilter?: FilterExpr;
  writeDefaults?: { table: string; pkColumn?: string };
  columns: ResolvedTableColumn[];
  rowActions: readonly string[];
  tableActions?: readonly import('../types/detail-types').TableActionSpec[];
  toggles?: readonly any[];
  orderBy?: readonly any[];
  limit?: number;
};

/**
 * Resolves a table preset ID into a complete, resolved table specification
 * by merging preset config, lookup info, generated metadata, and enum options.
 */
export function resolveTableSpec(presetId: string, module?: string): ResolvedTableSpec {
  const preset = TABLE_LIST_PRESETS[presetId as keyof typeof TABLE_LIST_PRESETS];
  if (!preset) {
    throw new Error(`Unknown table preset: ${presetId}`);
  }

  // Start with base configuration
  const resolved: ResolvedTableSpec = {
    title: preset.title,
    readSource: preset.readSource!,
    readFilter: (preset as any).readFilter,
    writeDefaults: (preset as any).writeDefaults,
    columns: [],
    rowActions: preset.rowActions || [],
    tableActions: (preset as any).tableActions || [],
    toggles: (preset as any).toggles,
    orderBy: undefined, // TODO: Add if needed
    limit: undefined,   // TODO: Add if needed
  };

  // Resolve columns
  const columnSpecs = preset.columns || [];
  resolved.columns = columnSpecs.map(col => resolveColumn(col, preset.readSource));

  return resolved;
}

/**
 * Resolves a single column specification by merging all metadata sources
 */
function resolveColumn(columnSpec: string | TableColumnMeta, readSource?: string): ResolvedTableColumn {
  const field = typeof columnSpec === 'string' ? columnSpec : columnSpec.field;
  const meta = typeof columnSpec === 'string' ? {} : columnSpec;

  // Get generated metadata for the field (schema and table inferred from readSource)
  let generatedMeta: any = undefined;
  if (readSource) {
    const [schema, table] = readSource.includes('.') ? readSource.split('.') : ['public', readSource];
    generatedMeta = getColumnMetadata(schema, table, field);
  }

  // Resolve lookup configuration
  let resolvedLookup: FieldLookup | undefined;
  if ((meta as any).lookupTable) {
    // Use lookupTable to get config from GENERATED_LOOKUPS
    const lookupConfig = GENERATED_LOOKUPS[(meta as any).lookupTable];
    if (lookupConfig) {
      resolvedLookup = {
        table: lookupConfig.table,
        valueColumn: lookupConfig.valueColumn,
        labelColumn: lookupConfig.labelColumn,
      };
    }
  } else if ((meta as any).lookup && typeof (meta as any).lookup === 'object') {
    resolvedLookup = (meta as any).lookup as FieldLookup;
  }

  // Resolve enum options
  let enumOptions: string[] | undefined;
  const enumName = generatedMeta?.enumName;
  if (enumName && ENUM_OPTIONS[enumName]) {
    enumOptions = [...ENUM_OPTIONS[enumName]]; // Copy to avoid readonly issues
  }

  // Resolve field type
  let fieldType: ResolvedTableColumn['type'];
  if (generatedMeta?.baseType) {
    fieldType = mapBaseType(generatedMeta.baseType);
  } else if (resolvedLookup || enumOptions) {
    fieldType = 'enum';
  } else if (FIELD_TYPES[field] && typeof FIELD_TYPES[field] === 'string') {
    const baseType = FIELD_TYPES[field] as any;
    fieldType = mapBaseType(baseType.baseType || baseType);
  }

  // Determine if field is editable
  const editable = (meta as any).update !== 'no' &&
                   (meta as any).edit !== false;

  return {
    field,
    label: (meta as any).label || labelFromField(field),
    type: fieldType,
    lookup: resolvedLookup,
    options: enumOptions,
    multiline: (meta as any).multiline,
    width: (meta as any).width,
    attachment: (meta as any).attachment,
    maxArrayEntries: (meta as any).maxArrayEntries,
    linkToField: (meta as any).linkToField || (meta as any).linkToAttachment,
    linkToAttachmentArray: (meta as any).linkToAttachmentArray,
    update: (meta as any).update || 'yes',
    writeTo: (meta as any).writeTo,
    array: generatedMeta?.isArray,
    editable,
  };
}

/**
 * Map schema base type to resolver field type
 */
function mapBaseType(baseType: string): ResolvedTableColumn['type'] {
  switch (baseType) {
    case 'boolean': return 'boolean';
    case 'number': return 'number';
    case 'string': return 'string';
    case 'enum': return 'enum';
    default: return 'string';
  }
}

/**
 * Convert a field name to a human-readable label
 */
function labelFromField(field: string): string {
  return field
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
    .replace(/Id$/, 'ID')
    .replace(/Url$/, 'URL')
    .replace(/Api$/, 'API');
}

