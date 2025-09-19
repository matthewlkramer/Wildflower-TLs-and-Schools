import { supabase } from '@/lib/supabase/client';
import { getColumnMetadata } from '../../shared/schema-metadata';

export type WriteTarget = { schema?: string; table: string; pk?: string };
export type CardEditSource = WriteTarget & { exceptions?: ExceptionMap[] };

export type ExceptionMap = {
  field: string;
  mapsToField?: string;
  viaLookup?: { schema?: string; table: string; labelColumn: string; keyColumn: string };
};

// Given raw form values, apply exception mappings (e.g., map display labels back to enum keys)
export async function applyExceptions(
  payload: Record<string, any>,
  exceptions: ExceptionMap[] | undefined
): Promise<Record<string, any>> {
  if (!exceptions || exceptions.length === 0) return payload;
  const out: Record<string, any> = { ...payload };
  for (const ex of exceptions) {
    const srcField = ex.field;
    if (!(srcField in out)) continue;
    const value = out[srcField];
    const targetField = ex.mapsToField || srcField;
    if (ex.viaLookup && value != null) {
      const labels: string[] = Array.isArray(value)
        ? value
        : String(value)
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
      if (labels.length > 0) {
        const { table, schema, labelColumn, keyColumn } = ex.viaLookup;
        const rel = schema ? `${schema}.${table}` : table;
        const { data, error } = await (supabase as any)
          .from(rel)
          .select(`${labelColumn}, ${keyColumn}`)
          .in(labelColumn, labels);
        if (!error && Array.isArray(data)) {
          const keys = labels
            .map((lbl) => data.find((r: any) => String(r[labelColumn]) === lbl)?.[keyColumn])
            .filter((k) => k != null);
          out[targetField] = keys;
        } else {
          out[targetField] = labels; // fallback
        }
      }
    } else {
      out[targetField] = value;
    }
    if (targetField !== srcField) delete out[srcField];
  }
  return out;
}

export async function saveCardValues(
  writeTo: WriteTarget,
  educatorId: string,
  values: Record<string, any>,
  exceptions?: ExceptionMap[]
) {
  const tableRel = writeTo.schema ? `${writeTo.schema}.${writeTo.table}` : writeTo.table;
  const transformed = await applyExceptions(values, exceptions);
  // Filter out any fields that aren't actual columns on the target table to prevent 400s
  const filtered: Record<string, any> = {};
  for (const [k, v] of Object.entries(transformed)) {
    const cm = getColumnMetadata(writeTo.schema, writeTo.table, k);
    if (cm) filtered[k] = v;
  }
  const pk = writeTo.pk || 'id';
  const match = pk === 'id' ? ({ id: educatorId } as any) : ({ [pk]: educatorId } as any);
  const updateQuery = (supabase as any).from(tableRel).update(filtered).match(match).select();
  const { data, error } = await updateQuery;
  if (error) throw error;
  // If no row was updated and this is a child table keyed by a foreign pk, create it via upsert
  if ((!data || data.length === 0) && pk !== 'id') {
    const upsertPayload = { ...filtered, [pk]: educatorId } as any;
    const { error: upsertError } = await (supabase as any).from(tableRel).upsert(upsertPayload, { onConflict: pk }).select();
    if (upsertError) throw upsertError;
  }
}
