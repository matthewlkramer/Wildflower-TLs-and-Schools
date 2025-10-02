import type { SelectOption } from './utils';

// Caches for performance
export const ENUM_OPTION_CACHE = new Map<string, SelectOption[]>();
export const LOOKUP_OPTION_CACHE = new Map<string, SelectOption[]>();

// Clear cache functions for when data changes
export function clearEnumCache(key?: string) {
  if (key) {
    ENUM_OPTION_CACHE.delete(key);
  } else {
    ENUM_OPTION_CACHE.clear();
  }
}

export function clearLookupCache(key?: string) {
  if (key) {
    LOOKUP_OPTION_CACHE.delete(key);
  } else {
    LOOKUP_OPTION_CACHE.clear();
  }
}

export function clearAllCaches() {
  ENUM_OPTION_CACHE.clear();
  LOOKUP_OPTION_CACHE.clear();
}

// Clear cache on startup to avoid stale ref_tables queries
if (typeof window !== 'undefined') {
  LOOKUP_OPTION_CACHE.clear();
  console.log('[DEBUG] Cleared lookup cache on startup');
}