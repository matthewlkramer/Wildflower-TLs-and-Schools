import { supabase } from '@/core/supabase/client';

/**
 * Parse a table reference that may be schema-qualified (e.g., 'gsync.table_name')
 * Returns [schema, tableName]
 */
export function parseTableRef(tableRef: string): [string, string] {
  return tableRef.includes('.')
    ? tableRef.split('.') as [string, string]
    : ['public', tableRef];
}

/**
 * Create a Supabase query builder for a table, handling schema-qualified names
 */
export function fromTable(tableRef: string) {
  const [schema, table] = parseTableRef(tableRef);
  return schema !== 'public'
    ? supabase.schema(schema).from(table)
    : supabase.from(table);
}
