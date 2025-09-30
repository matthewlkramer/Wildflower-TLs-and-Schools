// Config model: field name, display name, visibility, order, and value type/options.
import type { ColumnVisibility, GridValueKind, GridColumnConfig } from '../shared/detail-types';

export type { ColumnVisibility, GridValueKind } from '../shared/detail-types';
export type SchoolColumnConfig = GridColumnConfig;
// Re-export moved items from views for backward compatibility (if any code still imports here)
export { SCHOOL_FIELD_METADATA, ADD_NEW_SCHOOL_INPUT } from './views';
