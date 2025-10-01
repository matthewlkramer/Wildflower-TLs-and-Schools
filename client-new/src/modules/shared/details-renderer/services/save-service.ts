import { supabase } from '@/lib/supabase/client';
import type { WriteTarget } from '../../detail-types';

export interface SaveOptions {
  target: WriteTarget;
  primaryKeyValue: string | number;
  updater: Record<string, any>;
  exceptions?: Array<{
    field: string;
    target: WriteTarget;
  }>;
}

export interface SaveResult {
  data?: any;
  error?: string;
}

/**
 * Save values to a database table with support for exception fields
 */
export async function saveValues(options: SaveOptions): Promise<SaveResult> {
  const { target, primaryKeyValue, updater, exceptions = [] } = options;

  try {
    // Separate main fields from exception fields
    const mainFields: Record<string, any> = {};
    const exceptionMap = new Map<string, WriteTarget>();

    for (const exc of exceptions) {
      exceptionMap.set(exc.field, exc.target);
    }

    for (const [field, value] of Object.entries(updater)) {
      if (!exceptionMap.has(field)) {
        mainFields[field] = value;
      }
    }

    // Save main fields
    if (Object.keys(mainFields).length > 0) {
      const client = target.schema && target.schema !== 'public' ?
        (supabase as any).schema(target.schema) :
        supabase;

      const pk = target.primaryKey || 'id';

      const { error } = await client
        .from(target.table)
        .update(mainFields)
        .eq(pk, primaryKeyValue);

      if (error) {
        return { error: error.message };
      }
    }

    // Save exception fields
    for (const exc of exceptions) {
      const value = updater[exc.field];
      if (value !== undefined) {
        const client = exc.target.schema && exc.target.schema !== 'public' ?
          (supabase as any).schema(exc.target.schema) :
          supabase;

        const pk = exc.target.primaryKey || 'id';

        const { error } = await client
          .from(exc.target.table)
          .update({ [exc.field]: value })
          .eq(pk, primaryKeyValue);

        if (error) {
          return { error: `Failed to save ${exc.field}: ${error.message}` };
        }
      }
    }

    return { data: true };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'An error occurred while saving'
    };
  }
}

/**
 * Create a new record in a database table
 */
export async function createRecord(
  target: WriteTarget,
  data: Record<string, any>
): Promise<SaveResult> {
  try {
    const client = target.schema && target.schema !== 'public' ?
      (supabase as any).schema(target.schema) :
      supabase;

    const { data: created, error } = await client
      .from(target.table)
      .insert(data)
      .select()
      .single();

    if (error) {
      return { error: error.message };
    }

    return { data: created };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'An error occurred while creating record'
    };
  }
}

/**
 * Delete a record from a database table
 */
export async function deleteRecord(
  target: WriteTarget,
  primaryKeyValue: string | number
): Promise<SaveResult> {
  try {
    const client = target.schema && target.schema !== 'public' ?
      (supabase as any).schema(target.schema) :
      supabase;

    const pk = target.primaryKey || 'id';

    const { error } = await client
      .from(target.table)
      .delete()
      .eq(pk, primaryKeyValue);

    if (error) {
      return { error: error.message };
    }

    return { data: true };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'An error occurred while deleting'
    };
  }
}

/**
 * Batch update multiple records
 */
export async function batchUpdate(
  target: WriteTarget,
  updates: Array<{ id: string | number; data: Record<string, any> }>
): Promise<SaveResult> {
  try {
    const client = target.schema && target.schema !== 'public' ?
      (supabase as any).schema(target.schema) :
      supabase;

    const pk = target.primaryKey || 'id';

    // Process updates one by one (Supabase doesn't have batch update)
    for (const update of updates) {
      const { error } = await client
        .from(target.table)
        .update(update.data)
        .eq(pk, update.id);

      if (error) {
        return { error: `Failed to update record ${update.id}: ${error.message}` };
      }
    }

    return { data: true };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'An error occurred during batch update'
    };
  }
}