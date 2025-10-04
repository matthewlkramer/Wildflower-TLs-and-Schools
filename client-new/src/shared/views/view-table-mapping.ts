import type { ViewId } from './types';

/**
 * Maps view IDs to their source database tables.
 * Some views use logical names (e.g., 'educators') while their data
 * comes from a different table (e.g., 'people').
 */
export const VIEW_TABLE_MAPPING: Record<ViewId, string> = {
  schools: 'details_schools',
  educators: 'people',
  charters: 'charters',
};

/**
 * Get the source table name for a given view ID
 */
export function getViewSourceTable(viewId: ViewId): string {
  return VIEW_TABLE_MAPPING[viewId] || viewId;
}
