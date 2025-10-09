import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrencyUSD(
  value: number | string | null | undefined,
  opts: { minimumFractionDigits?: number; maximumFractionDigits?: number } = {}
): string {
  if (value == null || value === '') return '';
  const num = typeof value === 'number' ? value : parseFloat(String(value).replace(/[^0-9.-]/g, ''));
  if (!isFinite(num)) return String(value ?? '');
  const { minimumFractionDigits = 0, maximumFractionDigits = 0 } = opts;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(num);
}

/**
 * List of abbreviations that should remain all-caps when formatting labels
 */
const ABBREVIATIONS = [
  'TL', 'ETL', 'FY', 'EIN', 'SSJ', 'CEO', 'CFO', 'COO', 'CTO', 'ID', 'URL',
  'US', 'USA', 'WF', 'PK', 'K', 'LLC', 'INC', 'CORP', 'LTD', 'API',
  'HTML', 'CSS', 'PDF', 'ZIP', 'FRL', 'ELL', 'SPED', 'BIPOC', 'LGBTQIA',
  'AMS', 'AMI', 'MACTE', 'PO', 'IRS', 'W9', 'NCES', 'DOE', 'LEA'
];

/**
 * Abbreviations with special plural handling (e.g., TLs, ETLs)
 */
const PLURAL_ABBREVIATIONS: Record<string, string> = {
  'TLS': 'TLs',
  'ETLS': 'ETLs',
};

/**
 * Format a field name for display (e.g., 'current_tls' → 'Current TLs')
 * Preserves known abbreviations as all-caps
 */
export function formatFieldLabel(fieldName: string): string {
  return fieldName
    .split('_')
    .map(word => {
      const upper = word.toUpperCase();

      // Check if this is a special plural abbreviation
      if (PLURAL_ABBREVIATIONS[upper]) {
        return PLURAL_ABBREVIATIONS[upper];
      }

      // Check if this word is a known abbreviation
      if (ABBREVIATIONS.includes(upper)) {
        return upper;
      }

      // Otherwise, capitalize first letter only
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}