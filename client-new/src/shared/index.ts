/**
 * Central export point for all shared code
 * New simplified structure - everything in one place
 */

// ===== COMPONENTS =====
export { DetailsRenderer } from './components/DetailsRenderer';
export type { DetailsRendererProps } from './components/DetailsRenderer';
export { TableRenderer } from './components/TableRenderer';
export { ListRenderer } from './components/ListRenderer';
export { CardRenderer } from './components/CardRenderer';
export { GridBase } from './components/GridBase';
export { GridPageHeader } from './components/GridPageHeader';
export { createGridActionColumn } from './components/GridRowActionsCell';
export { default as KanbanBoard } from './components/KanbanBoard';
export { SavedViewsManager } from './components/SavedViewsManager';

// ===== SERVICES =====
export * from './services/table-service';
export * from './services/card-service';
export * from './services/table-spec-resolver';

// ===== CONFIGURATION =====
export * from './config/table-list-presets';

// ===== TYPES =====
export * from './types/detail-types';
export * from './types/database.types';

// ===== VIEW BUILDING =====
export * from './views/types';
export * from './views/builders';

// ===== ACTIONS =====
export * from './actions/handlers';
export * from './actions/table-handlers';

// ===== HOOKS =====
export * from './hooks/useSavedViews';

// ===== UTILITIES =====
export * from './utils';