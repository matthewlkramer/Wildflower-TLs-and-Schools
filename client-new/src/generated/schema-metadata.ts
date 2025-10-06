import type { DetailFieldType, TableColumnMeta, FieldMetadata } from "../shared/types/detail-types";
import { schemaMetadata } from "./schema-metadata.generated";
import type { ColumnMetadata } from "./schema-metadata.generated";

type SchemaRecord = Record<string, Record<string, { columns: Record<string, ColumnMetadata> }>>;

const schemaRecord: SchemaRecord = schemaMetadata as unknown as SchemaRecord;

const DEFAULT_SCHEMA = "public";

function resolveSchema(schema?: string) {
  return schema ?? DEFAULT_SCHEMA;
}

function mapBaseType(baseType: string): DetailFieldType {
  switch (baseType) {
    case "boolean":
      return "boolean";
    case "number":
      return "number";
    case "enum":
      return "enum";
    default:
      return "string";
  }
}

export function getColumnMetadata(schema: string | undefined, table: string, column: string): ColumnMetadata | undefined {
  const schemaKey = resolveSchema(schema);
  const schemaEntry = schemaRecord[schemaKey];
  if (!schemaEntry) return undefined;
  const tableEntry = schemaEntry[table];
  if (!tableEntry) return undefined;
  return tableEntry.columns[column];
}

/**
 * Find which table a column belongs to by searching through all tables
 * Returns the column metadata with table information
 */
export function findColumnMetadata(schema: string | undefined, column: string): (ColumnMetadata & { foundTable: string }) | undefined {
  const schemaKey = resolveSchema(schema);
  const schemaEntry = schemaRecord[schemaKey];
  if (!schemaEntry) return undefined;

  // Search through all tables in the schema
  for (const [tableName, tableEntry] of Object.entries(schemaEntry)) {
    const columnMeta = tableEntry.columns[column];
    if (columnMeta) {
      return { ...columnMeta, foundTable: tableName };
    }
  }

  return undefined;
}

export function listColumns(schema: string | undefined, table: string): Record<string, ColumnMetadata> | undefined {
  const schemaKey = resolveSchema(schema);
  const schemaEntry = schemaRecord[schemaKey];
  if (!schemaEntry) return undefined;
  const tableEntry = schemaEntry[table];
  return tableEntry?.columns;
}

// Try to infer the foreign key column in `table` that references parentTable.parentPk
export function findForeignKeyColumn(options: { schema?: string; table: string; parentSchema?: string; parentTable: string; parentPk: string }): string | undefined {
  const { schema, table, parentSchema, parentTable, parentPk } = options;
  const cols = listColumns(schema, table);
  if (!cols) return undefined;
  for (const [colName, meta] of Object.entries(cols)) {
    const refs = (meta as any).references as Array<{ relation: string; referencedColumns: string[]; isOneToOne?: boolean }> | undefined;
    if (!Array.isArray(refs)) continue;
    for (const r of refs) {
      // relation is the referenced table name (without schema)
      if (r.relation === parentTable && r.referencedColumns?.includes(parentPk)) return colName;
    }
  }
  return undefined;
}

export function getEnumName(schema: string | undefined, table: string, column: string): string | undefined {
  const cm = getColumnMetadata(schema, table, column) as any;
  return cm?.enumRef?.name as string | undefined;
}

export function mergeTableColumnMeta(options: {
  schema?: string;
  table: string;
  column: string;
  manual?: TableColumnMeta;
}): TableColumnMeta {
  const { schema, table, column, manual } = options;
  const columnInfo = getColumnMetadata(schema, table, column);
  const derived: TableColumnMeta = {
    field: manual?.field ?? column,
    label: manual?.label,
    type: manual?.type,
    array: manual?.array,
    multiline: manual?.multiline,
    options: manual?.options,
    enumName: manual?.enumName,
    lookup: manual?.lookup,
    reference: manual?.reference,
    edit: manual?.edit,
    update: (manual as any)?.update,
    writeTo: manual?.writeTo,
  };

  if (columnInfo) {
    if (!derived.type) {
      derived.type = mapBaseType(columnInfo.baseType);
    }
    if (derived.array === undefined) {
      derived.array = columnInfo.isArray;
    }
  }

  if (!derived.type) {
    derived.type = "string";
  }
  if (derived.array === undefined) {
    derived.array = false;
  }

  return derived;
}


export function mergeFieldMetadata(options: {
  field: string;
  manual?: FieldMetadata;
  schema?: string;
  table?: string;
}): FieldMetadata | undefined {
  const { field, manual, schema, table } = options;
  if (!manual) return undefined;
  const columnSchema = manual.edit?.schema ?? schema;
  const columnTable = manual.edit?.table ?? table;
  const columnName = manual.edit?.column ?? field;
  const columnInfo = columnTable ? getColumnMetadata(columnSchema, columnTable, columnName) : undefined;
  const merged: FieldMetadata = { ...manual };
  if (columnInfo) {
    if (!merged.type) {
      merged.type = mapBaseType(columnInfo.baseType);
    }
    if (merged.array === undefined) {
      merged.array = columnInfo.isArray;
    }
  }
  return merged;
}
