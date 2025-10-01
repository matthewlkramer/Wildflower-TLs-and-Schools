import { supabase } from '@/lib/supabase/client';
import type { FilterExpr } from '../../detail-types';
import { applyFilterExprToQuery } from '../utils';

export interface FetchOptions {
  schema?: string;
  table: string;
  select?: string;
  filters?: FilterExpr[];
  orderBy?: Array<{
    column: string;
    ascending?: boolean;
  }>;
  limit?: number;
  single?: boolean;
}

export interface FetchResult<T = any> {
  data?: T;
  error?: string;
  count?: number;
}

/**
 * Fetch data from a Supabase table with filters and ordering
 */
export async function fetchTableData<T = any>(
  options: FetchOptions
): Promise<FetchResult<T[]>> {
  try {
    const {
      schema = 'public',
      table,
      select = '*',
      filters = [],
      orderBy = [],
      limit
    } = options;

    // Get the appropriate client
    const client = schema !== 'public' ?
      (supabase as any).schema(schema) :
      supabase;

    // Start query
    let query = client.from(table).select(select, { count: 'exact' });

    // Apply filters
    for (const filter of filters) {
      query = applyFilterExprToQuery(query, filter);
    }

    // Apply ordering
    for (const order of orderBy) {
      query = query.order(order.column, {
        ascending: order.ascending ?? true
      });
    }

    // Apply limit
    if (limit) {
      query = query.limit(limit);
    }

    // Execute query
    const { data, error, count } = await query;

    if (error) {
      return { error: error.message };
    }

    return {
      data: data || [],
      count: count ?? undefined
    };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'Failed to fetch data'
    };
  }
}

/**
 * Fetch a single record by primary key
 */
export async function fetchRecord<T = any>(
  options: {
    schema?: string;
    table: string;
    primaryKey?: string;
    primaryKeyValue: string | number;
    select?: string;
  }
): Promise<FetchResult<T>> {
  try {
    const {
      schema = 'public',
      table,
      primaryKey = 'id',
      primaryKeyValue,
      select = '*'
    } = options;

    const client = schema !== 'public' ?
      (supabase as any).schema(schema) :
      supabase;

    const { data, error } = await client
      .from(table)
      .select(select)
      .eq(primaryKey, primaryKeyValue)
      .single();

    if (error) {
      return { error: error.message };
    }

    return { data };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'Failed to fetch record'
    };
  }
}

/**
 * Fetch options for a lookup field (for dropdowns)
 */
export async function fetchLookupOptions(
  options: {
    schema?: string;
    table: string;
    valueColumn: string;
    labelColumn: string;
    orderBy?: string;
    filter?: FilterExpr;
  }
): Promise<Array<{ value: string; label: string }>> {
  try {
    const {
      schema = 'public',
      table,
      valueColumn,
      labelColumn,
      orderBy = labelColumn,
      filter
    } = options;

    const client = schema !== 'public' ?
      (supabase as any).schema(schema) :
      supabase;

    let query = client
      .from(table)
      .select(`${valueColumn}, ${labelColumn}`)
      .order(orderBy, { ascending: true });

    if (filter) {
      query = applyFilterExprToQuery(query, filter);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching lookup options:', error);
      return [];
    }

    if (!data) return [];

    return data.map((row: any) => ({
      value: String(row[valueColumn] ?? ''),
      label: String(row[labelColumn] ?? row[valueColumn] ?? '')
    }));
  } catch (err) {
    console.error('Error in fetchLookupOptions:', err);
    return [];
  }
}

/**
 * Fetch related records (for foreign key relationships)
 */
export async function fetchRelatedRecords<T = any>(
  options: {
    schema?: string;
    table: string;
    foreignKey: string;
    foreignKeyValue: string | number;
    select?: string;
    orderBy?: Array<{
      column: string;
      ascending?: boolean;
    }>;
    limit?: number;
  }
): Promise<FetchResult<T[]>> {
  const {
    schema,
    table,
    foreignKey,
    foreignKeyValue,
    select,
    orderBy,
    limit
  } = options;

  return fetchTableData<T>({
    schema,
    table,
    select,
    filters: [{
      col: foreignKey,
      operator: 'eq',
      value: foreignKeyValue
    }],
    orderBy,
    limit
  });
}

/**
 * Check if a value exists in a table (for uniqueness validation)
 */
export async function checkValueExists(
  options: {
    schema?: string;
    table: string;
    column: string;
    value: any;
    excludeId?: string | number;
    primaryKey?: string;
  }
): Promise<boolean> {
  try {
    const {
      schema = 'public',
      table,
      column,
      value,
      excludeId,
      primaryKey = 'id'
    } = options;

    const client = schema !== 'public' ?
      (supabase as any).schema(schema) :
      supabase;

    let query = client
      .from(table)
      .select(primaryKey)
      .eq(column, value);

    if (excludeId !== undefined) {
      query = query.neq(primaryKey, excludeId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error checking value existence:', error);
      return false;
    }

    return (data?.length ?? 0) > 0;
  } catch (err) {
    console.error('Error in checkValueExists:', err);
    return false;
  }
}