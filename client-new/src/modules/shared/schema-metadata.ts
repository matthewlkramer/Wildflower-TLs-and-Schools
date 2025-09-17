import type { DetailFieldType, TableColumnMeta, FieldMetadata } from "./detail-types";
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
    reference: manual?.reference,
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
