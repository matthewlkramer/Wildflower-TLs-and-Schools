# Current Architecture Analysis

## Problem
Debugging attachment fields is taking too long because the service/renderer architecture is confusing and has unclear responsibilities.

## Current State (CONFUSING)

### Services
- **card-service.ts**: Loads data for card blocks
- **table-service.ts**: Loads data for BOTH table blocks AND list blocks (WHY?)

### Orchestrator
- **DetailsRenderer.tsx**: Main coordinator component
  - Renders banner, tabs, and layout
  - Contains mini-components: TableBlockRenderer, ListBlockRenderer, CardBlockRenderer, MapBlockRenderer
  - These mini-components load data from services and pass to renderers
  - Also handles: block width/visibility, title lookup from presets

### Renderers (Display Components)
- **CardRenderer.tsx**: Renders card blocks (2-column grid of fields)
- **TableRenderer.tsx**: Renders table blocks (spreadsheet with rows/columns)
- **ListRenderer.tsx**: Renders list blocks (vertical stack of mini-cards)
- **BannerRenderer.tsx**: Renders top banner with key fields
- **MapRenderer.tsx**: Renders Google Maps embed

### UI Components (Shared)
- **FieldEditor.tsx**: Renders input controls for editing (dropdowns, textareas, file uploads, etc.)
  - Used by: CardRenderer (editable mode), TableRenderer (inline editing)
  - NOT used by: ListRenderer (read-only display)
  - Purpose: Presentation layer only - handles UI for editing field values

### Hooks (UNUSED/LEGACY?)
- **useSelectOptions.ts**: React hook to fetch dropdown options (enums, lookups)
- **useReferenceLabels.ts**: React hook to fetch display labels for foreign key IDs
- **Status**: NOT currently imported by any component!
- **Why they exist**: Likely from old architecture before services were created
- **Should be deleted?**: Services (card-service, table-service) now handle this logic

### Data Flow (Current)
```
DetailsRenderer (orchestrator)
  ├── manages tabs, banner, layout, block width
  ├── CardBlockRenderer (mini-component)
  │     └─> cardService.loadCardData()
  │           └─> CardRenderer (display)
  │                 └─> FieldEditor (when editable)
  │
  ├── TableBlockRenderer (mini-component)
  │     └─> tableService.loadTableData()
  │           └─> TableRenderer (display)
  │                 └─> FieldEditor (inline editing)
  │
  └── ListBlockRenderer (mini-component)
        └─> tableService.loadTableData()  ❌ CONFUSING!
              └─> ListRenderer (display)
                    └─> (read-only, no FieldEditor)
```

**The layers:**
1. **DetailsRenderer** = Page orchestrator (tabs, layout, routing to block renderers)
2. **BlockRenderers** = Data loading layer (calls services, manages loading state)
3. **Services** = Data transformation (DB → typed objects with attachment processing)
4. **Display Renderers** = Pure presentation (CardRenderer, TableRenderer, ListRenderer)
5. **FieldEditor** = Input widget library (used by display renderers when editable)

**The problem:** ListBlockRenderer uses table-service even though ListRenderer displays cards

## The Problem

**ListRenderer uses TableService instead of having its own service**

This creates several issues:
1. Table service has to handle two different UI patterns (table vs list)
2. Attachment processing logic is duplicated in both card-service and table-service
3. Field metadata processing is duplicated
4. Debugging requires tracing through table-service even for list views
5. No clear separation of concerns

## Current Attachment Processing

### In card-service (for CardRenderer):
- Checks if field has `type: 'attachment'` in manual metadata
- Queries storage.objects to convert UUID → filename
- Converts filename → public URL
- Handles writeTable property to load from different tables

### In table-service (for TableRenderer AND ListRenderer):
- Checks if column has `attachment: true` OR `type === 'attachment'`
- Queries storage.objects to convert UUID → filename
- Converts filename → public URL
- Does NOT handle writeTable (only card-service does this)

**This is duplicate logic with subtle differences!**

## What We're Actually Rendering

Looking at the UI:
- **Card**: 2-column grid of field labels + values (for overview section)
- **Table**: Spreadsheet with columns and rows (for editing data)
- **List**: Mini-cards in a vertical list (for related entities like docs, educators)

## Root Cause

The list view is conceptually **a collection of mini-cards**, not a table. But it's using table-service which was designed for spreadsheet-style tables. This is architecturally wrong.

## Proposed Solutions

### Option 1: Create list-service.ts
- New service specifically for list blocks
- Uses same logic as card-service (since lists are mini-cards)
- ListBlockRenderer uses list-service instead of table-service
- Shares attachment processing logic with card-service

### Option 2: Merge list logic into card-service
- card-service handles both single cards and lists of cards
- Rename to entity-service or field-service
- ListBlockRenderer uses card-service
- TableRenderer keeps using table-service

### Option 3: Create shared attachment-processor.ts
- Extract attachment processing to shared module
- Both card-service and table-service import it
- Eliminates duplication
- Keep current service boundaries

## Recommendation

**Option 2: Merge list logic into card-service**

Why:
1. Lists ARE collections of cards - same data model
2. Eliminates service duplication
3. Attachment logic only lives in one place
4. card-service already handles writeTable
5. Clear mental model: card-service = field-based rendering, table-service = spreadsheet rendering

Changes needed:
1. Add `loadListData(preset, entityId)` method to card-service
2. Update ListBlockRenderer to use card-service instead of table-service
3. Remove list-specific logic from table-service over time

## Implementation Plan

1. Add loadListData to card-service that:
   - Takes a preset ID (like governanceDocs, nineNineties)
   - Loads multiple rows from the table
   - For each row, resolves fields like it does for cards
   - Returns array of {id, cells} where cells are CardFields

2. Update ListBlockRenderer to use cardService.loadListData

3. Update ListRenderer to work with CardField[] instead of CellValue[]

4. Test and verify all list blocks work

5. Clean up table-service to remove list-specific concerns

## Impact

- Clearer architecture: cards for field rendering, tables for spreadsheets
- Single place for attachment processing
- Easier debugging
- Better code reuse
