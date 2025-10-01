/**
 * Main entry point for the modularized details-renderer
 *
 * This file re-exports the main DetailsRenderer component while keeping
 * the original API intact. The implementation has been modularized
 * into separate modules for better maintainability.
 */

// Re-export the main component from the original file
// (Will eventually be replaced with a modular implementation)
export { DetailsRenderer, type DetailsRendererProps } from '../details-renderer';

// Export modular components
export * from './components/DetailCard';
export * from './components/DetailTableList';

// Export utilities and services
export * from './utils';
export * from './cache';
export * from './hooks';
export * from './services';
export * from './renderers/field-renderer';
export * from './renderers/editor-renderer';

// TODO: Complete modularization:
// - Replace main DetailsRenderer with modular version
// - Extract DetailMap component
// - Extract TabContent component
// - Integrate with generated lookups and field metadata