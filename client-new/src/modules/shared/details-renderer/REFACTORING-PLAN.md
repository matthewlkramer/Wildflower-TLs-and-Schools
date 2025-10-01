# Details Renderer Refactoring Plan

## Overview
The `details-renderer.tsx` file has grown to 3,925 lines. This refactoring will modularize it into smaller, focused modules while maintaining backward compatibility.

## Current Structure Analysis

### Main Components (Lines)
- `DetailsRenderer` (214-319): Main component
- `DetailCard` (720-1086): Card editor/display component
- `DetailTable/DetailList` (1483-2973): Combined table/list component (renders as cards when kind='list')
- `DetailMap` (2974-3071): Map display component
- `TabContent` (357-441): Tab content renderer

### Supporting Functions
- Utility functions (59-191): Normalization, formatting, URL handling
- Select options hooks (457-719): Data fetching for dropdowns
- Reference labels hook (3552-3665): Fetching display labels
- Render functions (1225-1482, 3126-3373): Display/edit renderers
- Save helpers (3423-3551): Data persistence

### Dependencies
- Supabase client for data operations
- AG-Grid for table display
- Material UI for tabs and switches
- Custom UI components (Button, Select, Input)
- Validation utilities
- Generated types and enums

## Refactoring Strategy

### Phase 1: Extract Utilities ✅
- [x] Create `utils.ts` with formatting, normalization functions
- [x] Create `cache.ts` for option caching
- [x] Create `hooks/` directory for custom hooks

### Phase 2: Extract Components (Current)
- [ ] Create `components/DetailCard/` with:
  - `DetailCard.tsx`: Main card component
  - `CardEditor.tsx`: Edit mode logic
  - `CardDisplay.tsx`: Display mode logic
- [ ] Create `components/DetailTableList/` with:
  - `DetailTableList.tsx`: Main component that handles both table and list views
  - `TableView.tsx`: Table rendering logic
  - `ListView.tsx`: Card-based list rendering logic
  - `ListCard.tsx`: Individual list card component
  - `CellRenderers.tsx`: Custom cell renderers
  - `RowActions.tsx`: Row action handlers
- [ ] Create `components/DetailMap.tsx`
- [ ] Create `components/TabContent.tsx`

### Phase 3: Extract Services
- [ ] Create `services/save-service.ts`: Save operations
- [ ] Create `services/fetch-service.ts`: Data fetching
- [ ] Create `services/validation-service.ts`: Field validation

### Phase 4: Extract Renderers
- [ ] Create `renderers/field-renderer.tsx`: Field display
- [ ] Create `renderers/editor-renderer.tsx`: Field editing
- [ ] Create `renderers/attachment-renderer.tsx`: File handling

### Phase 5: Optimize and Clean
- [ ] Remove duplicated code
- [ ] Add proper TypeScript types
- [ ] Add error boundaries
- [ ] Add loading states
- [ ] Add tests

## Migration Approach

1. **Incremental Migration**: Move one component at a time
2. **Backward Compatible**: Keep original file working during migration
3. **Test Coverage**: Add tests for each new module
4. **Type Safety**: Improve TypeScript types as we go

## File Structure After Refactoring

```
details-renderer/
├── index.tsx                 # Main export
├── types.ts                  # Consolidated types
├── utils.ts                  # Utility functions ✅
├── cache.ts                  # Caching logic ✅
├── hooks/                    # Custom hooks ✅
│   ├── index.ts             ✅
│   ├── useSelectOptions.ts  ✅
│   └── useReferenceLabels.ts ✅
├── components/
│   ├── DetailCard/
│   │   ├── index.tsx
│   │   ├── DetailCard.tsx
│   │   ├── CardEditor.tsx
│   │   └── CardDisplay.tsx
│   ├── DetailTable/
│   │   ├── index.tsx
│   │   ├── DetailTable.tsx
│   │   ├── TableConfig.ts
│   │   └── CellRenderers.tsx
│   ├── DetailMap.tsx
│   └── TabContent.tsx
├── services/
│   ├── save-service.ts
│   ├── fetch-service.ts
│   └── validation-service.ts
└── renderers/
    ├── field-renderer.tsx
    ├── editor-renderer.tsx
    └── attachment-renderer.tsx
```

## Benefits

1. **Maintainability**: Easier to find and modify specific functionality
2. **Reusability**: Components can be used independently
3. **Performance**: Better code splitting and lazy loading
4. **Testing**: Easier to unit test individual modules
5. **Type Safety**: Better TypeScript integration
6. **Developer Experience**: Faster development and debugging

## Next Steps

1. Complete Phase 2: Extract DetailCard component
2. Update imports in existing code to use new modules
3. Add tests for extracted modules
4. Continue with Phase 3-5

## Notes

- Keep the original file working until all migrations are complete
- Document any API changes
- Consider performance implications of module boundaries
- Coordinate with team on breaking changes