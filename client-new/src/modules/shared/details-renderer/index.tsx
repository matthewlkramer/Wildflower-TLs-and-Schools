/**
 * Main entry point for the modularized details-renderer
 *
 * This file re-exports the main DetailsRenderer component while keeping
 * the original API intact. The implementation is being gradually moved
 * to separate modules for better maintainability.
 */

// Re-export the main component from the original file for now
// This allows us to gradually refactor without breaking existing imports
export { DetailsRenderer, type DetailsRendererProps } from '../details-renderer';

// Export utilities that other modules might need
export * from './utils';
export * from './cache';
export * from './hooks';

// TODO: Gradually move components from details-renderer.tsx to these modules:
// - components/DetailCard.tsx
// - components/DetailTable.tsx
// - components/DetailMap.tsx
// - components/DetailList.tsx
// - components/TabContent.tsx
// - components/editors/
// - components/displays/
// - services/save-service.ts
// - services/fetch-service.ts