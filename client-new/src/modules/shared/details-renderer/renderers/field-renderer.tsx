import React from 'react';
import type { FieldMetadata, TableColumnMeta } from '../../detail-types';
import { formatCurrencyUSD } from '@/lib/utils';

/**
 * Renders a display value based on field metadata
 * This is a placeholder that will be expanded with the full implementation
 * from details-renderer.tsx
 */
export function renderDisplayValue(
  value: any,
  meta?: FieldMetadata | TableColumnMeta,
  row?: any,
  selectOptions?: Array<{ value: string; label: string }>
): React.ReactNode {
  // Handle null/undefined
  if (value === null || value === undefined) {
    return <span style={{ color: '#cbd5e1' }}>—</span>;
  }

  // Handle arrays
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <span style={{ color: '#cbd5e1' }}>—</span>;
    }

    // For select options, map values to labels
    if (selectOptions) {
      const labels = value.map(v => {
        const option = selectOptions.find(opt => opt.value === String(v));
        return option ? option.label : String(v);
      });
      return labels.join(', ');
    }

    return value.map(v => String(v)).join(', ');
  }

  // Handle booleans
  if (typeof value === 'boolean') {
    return value ? '✓' : '✗';
  }

  // Handle currency fields
  const fieldName = (meta as any)?.field;
  if (fieldName && typeof value === 'number') {
    const fname = fieldName.toLowerCase();
    if (fname.includes('amount') || fname.includes('price') || fname.includes('cost') ||
        fname.includes('fee') || fname.includes('revenue') || fname.includes('budget')) {
      return formatCurrencyUSD(value);
    }
  }

  // Handle select options
  if (selectOptions) {
    const option = selectOptions.find(opt => opt.value === String(value));
    if (option) return option.label;
  }

  // Handle dates
  if (typeof value === 'string') {
    // Check if it looks like a date
    if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
      try {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          // If it has time component
          if (value.includes('T') || value.includes(' ')) {
            return date.toLocaleString();
          }
          // Date only
          return date.toLocaleDateString();
        }
      } catch {
        // Fall through to string rendering
      }
    }
  }

  // Default: convert to string
  return String(value);
}