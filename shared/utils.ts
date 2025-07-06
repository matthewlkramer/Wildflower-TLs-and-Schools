// Utility functions for the Wildflower application

import { STATUS_TYPES, STATUS_COLORS } from './constants';

/**
 * Get the appropriate color class for a status badge
 */
export function getStatusColor(status: string): string {
  const normalizedStatus = status?.toLowerCase();
  
  if (STATUS_TYPES.CLOSED.some(s => normalizedStatus?.includes(s.toLowerCase()))) {
    return STATUS_COLORS.red;
  }
  if (STATUS_TYPES.VISIONING.some(s => normalizedStatus?.includes(s.toLowerCase()))) {
    return STATUS_COLORS.orange;
  }
  if (STATUS_TYPES.PLANNING.some(s => normalizedStatus?.includes(s.toLowerCase()))) {
    return STATUS_COLORS.yellow;
  }
  if (STATUS_TYPES.STARTUP.some(s => normalizedStatus?.includes(s.toLowerCase()))) {
    return STATUS_COLORS.green;
  }
  if (STATUS_TYPES.OPEN.some(s => normalizedStatus?.includes(s.toLowerCase()))) {
    return STATUS_COLORS.green;
  }
  if (STATUS_TYPES.PLACEHOLDER.some(s => normalizedStatus?.includes(s.toLowerCase()))) {
    return STATUS_COLORS.gray;
  }
  
  return STATUS_COLORS.default;
}

/**
 * Format a date string for display
 */
export function formatDate(dateString: string | undefined, fallback = '-'): string {
  if (!dateString) return fallback;
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return fallback;
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return fallback;
  }
}

/**
 * Format a phone number for display
 */
export function formatPhoneNumber(phone: string | undefined): string {
  if (!phone) return '';
  
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  return phone;
}

/**
 * Convert array to string for display
 */
export function arrayToString(arr: string[] | string | undefined, delimiter = ', '): string {
  if (!arr) return '';
  if (typeof arr === 'string') return arr;
  return arr.join(delimiter);
}

/**
 * Get the first item from an array or string
 */
export function getFirstItem<T>(value: T[] | T | undefined): T | undefined {
  if (!value) return undefined;
  if (Array.isArray(value)) return value[0];
  return value;
}

/**
 * Ensure a value is always an array
 */
export function ensureArray<T>(value: T[] | T | undefined): T[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return [value];
}

/**
 * Safe error message extraction
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  return 'An unknown error occurred';
}

/**
 * Check if a value is empty (null, undefined, empty string, or empty array)
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined || value === '') return true;
  if (Array.isArray(value) && value.length === 0) return true;
  return false;
}

/**
 * Create a debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return function (...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}