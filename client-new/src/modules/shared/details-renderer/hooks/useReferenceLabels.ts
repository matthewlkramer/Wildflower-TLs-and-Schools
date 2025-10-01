import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { DEFAULT_SCHEMA } from '../utils';

/**
 * Fetches display labels for reference values from the database
 * Used to show human-readable labels instead of IDs in table cells
 */
export function useReferenceLabels(
  value: string | number | null | undefined,
  refTable: string,
  refValueColumn: string,
  refLabelColumn: string,
  refSchema?: string
): string {
  const [label, setLabel] = useState<string>('');

  useEffect(() => {
    if (value == null || value === '') {
      setLabel('');
      return;
    }

    // Create a cache key for this reference lookup
    const cacheKey = `${refSchema || DEFAULT_SCHEMA}|${refTable}|${refValueColumn}|${value}`;

    // Check session storage for cached value
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      setLabel(cached);
      return;
    }

    // Fetch the label from the database
    const fetchLabel = async () => {
      try {
        const schema = refSchema ?? DEFAULT_SCHEMA;
        const query = supabase
          .schema(schema as any)
          .from(refTable)
          .select(refLabelColumn)
          .eq(refValueColumn, value)
          .single();

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching reference label:', error);
          setLabel(String(value));
          return;
        }

        if (data && data[refLabelColumn]) {
          const fetchedLabel = String(data[refLabelColumn]);
          setLabel(fetchedLabel);
          // Cache the result
          try {
            sessionStorage.setItem(cacheKey, fetchedLabel);
          } catch (e) {
            // Ignore storage errors
          }
        } else {
          setLabel(String(value));
        }
      } catch (err) {
        console.error('Error in useReferenceLabels:', err);
        setLabel(String(value));
      }
    };

    fetchLabel();
  }, [value, refTable, refValueColumn, refLabelColumn, refSchema]);

  return label;
}