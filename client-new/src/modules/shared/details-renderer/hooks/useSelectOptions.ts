import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { ENUM_OPTIONS } from '../../enums.generated';
import { ENUM_OPTION_CACHE, LOOKUP_OPTION_CACHE } from '../cache';
import {
  asSelectOptions,
  buildLookupKey,
  normalizeOptionValue,
  DEFAULT_SCHEMA,
  type SelectOption
} from '../utils';
import type { FieldMetadata, TableColumnMeta, FieldLookup } from '../../detail-types';

export function useSelectOptions(
  meta?: FieldMetadata | TableColumnMeta,
  exception?: { lookup: FieldLookup } | null
): { options: SelectOption[]; loading: boolean; error: string | null } {
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!meta) {
      setOptions([]);
      return;
    }

    // 1. Check for cached options
    const cached = getCachedOptionsForMeta(meta);
    if (cached) {
      setOptions(cached);
      return;
    }

    // 2. Handle enum values
    if (meta.enum) {
      const enumOpts = ENUM_OPTIONS[meta.enum];
      if (enumOpts) {
        const selectOpts = asSelectOptions(enumOpts);
        ENUM_OPTION_CACHE.set(meta.enum, selectOpts);
        setOptions(selectOpts);
        return;
      }
    }

    // 3. Handle lookup configuration
    const lookup = exception?.lookup || meta.lookup;
    if (lookup) {
      const cacheKey = buildLookupKey(lookup);
      const cachedLookup = LOOKUP_OPTION_CACHE.get(cacheKey);
      if (cachedLookup) {
        setOptions(cachedLookup);
        return;
      }

      // Fetch lookup options from database
      setLoading(true);
      setError(null);

      const fetchOptions = async () => {
        try {
          const schema = lookup.schema ?? DEFAULT_SCHEMA;
          const query = supabase
            .schema(schema as any)
            .from(lookup.table)
            .select(`${lookup.valueColumn}, ${lookup.labelColumn}`)
            .order(lookup.labelColumn);

          const { data, error: fetchError } = await query;

          if (fetchError) {
            setError(fetchError.message);
            setOptions([]);
            return;
          }

          if (!data) {
            setOptions([]);
            return;
          }

          const selectOpts = data.map((row: any) => ({
            value: normalizeOptionValue(row[lookup.valueColumn]),
            label: String(row[lookup.labelColumn] ?? row[lookup.valueColumn] ?? ''),
          }));

          LOOKUP_OPTION_CACHE.set(cacheKey, selectOpts);
          setOptions(selectOpts);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to fetch options');
          setOptions([]);
        } finally {
          setLoading(false);
        }
      };

      fetchOptions();
      return;
    }

    // 4. Handle static options
    if (meta.options) {
      const selectOpts = asSelectOptions(meta.options);
      setOptions(selectOpts);
      return;
    }

    // 5. No options available
    setOptions([]);
  }, [meta, exception]);

  return { options, loading, error };
}

function getCachedOptionsForMeta(meta?: FieldMetadata | TableColumnMeta): SelectOption[] | undefined {
  if (!meta) return undefined;

  // Check enum cache
  if (meta.enum) {
    const cached = ENUM_OPTION_CACHE.get(meta.enum);
    if (cached) return cached;

    // Try to get from generated enums
    const enumOpts = ENUM_OPTIONS[meta.enum];
    if (enumOpts) {
      const selectOpts = asSelectOptions(enumOpts);
      ENUM_OPTION_CACHE.set(meta.enum, selectOpts);
      return selectOpts;
    }
  }

  // Check lookup cache
  if (meta.lookup) {
    const cacheKey = buildLookupKey(meta.lookup);
    const cached = LOOKUP_OPTION_CACHE.get(cacheKey);
    if (cached) return cached;
  }

  // Check static options
  if (meta.options) {
    return asSelectOptions(meta.options);
  }

  return undefined;
}