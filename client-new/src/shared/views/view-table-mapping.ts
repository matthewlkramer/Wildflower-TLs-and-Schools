import type { ViewId } from './types';

/**
 * Maps view IDs to their source database tables/views.
 * Uses the details_* views which have all computed/joined fields.
 */
export const VIEW_TABLE_MAPPING: Record<ViewId, string> = {
  schools: 'details_schools',
  educators: 'details_educators',
  charters: 'details_charters',
};

/**
 * Get the source table name for a given view ID
 */
export function getViewSourceTable(viewId: ViewId): string {
  return VIEW_TABLE_MAPPING[viewId] || viewId;
}
