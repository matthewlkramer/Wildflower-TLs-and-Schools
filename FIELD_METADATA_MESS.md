# Field Metadata Architecture Problems

## The Current Mess

We have **4+ different places** where field configuration is defined, with overlapping and inconsistent properties:

### 1. **SCHOOL_FIELD_METADATA** (in views.ts)
```typescript
export const SCHOOL_FIELD_METADATA: FieldMetadataMap = {
  logo: { type: 'attachment' },
  object_id: { type: 'attachment' },
  planning_album: { writeTable: 'school_ssj_data', type: 'attachment' },
  ein: { label: 'EIN' },
  about: { multiline: true },
  // ... ~40 more fields
};
```
**Purpose:** View-specific overrides for detail pages
**Problem:** Mixed concerns - has both display config (label, multiline) and data config (type, writeTable)

### 2. **Table List Presets** (in table-list-presets.ts)
```typescript
governanceDocs: {
  columns: [
    {
      field: 'doc_type',
      label: 'Document Type',
      lookupTable: 'zref_gov_docs',
      linkToAttachmentArray: 'governance_doc_public_urls',
      listLayout: 'title'
    },
    { field: 'upload_date', label: 'Upload Date', listLayout: 'subtitle' },
    { field: 'governance_doc_public_urls', visibility: 'suppress' },
  ],
  rowActions: ['view_in_modal', 'archive'],
  tableActions: [{id: 'addGovDoc', label: 'Add Document'}],
}
```
**Purpose:** Configuration for table/list blocks
**Problem:** Mixes field config, layout config, and action config all in one place

### 3. **Grid Column Config** (in views.ts)
```typescript
export const SCHOOL_GRID: GridColumnConfig[] = [
  { field: 'school_name', headerName: 'Name', sortKey: true },
  { field: 'stage_status', headerName: 'Stage/Status', valueType: 'select', lookupField: 'zref_stage_statuses.value', kanbanKey: true },
  // ... different structure entirely!
];
```
**Purpose:** Grid/kanban page configuration
**Problem:** Completely different schema than table presets (headerName vs label, valueType vs type, etc.)

### 4. **Generated Field Metadata** (from database schema)
```typescript
// Generated in enums.generated.ts from database
export const FIELD_TYPES: Record<string, FieldMeta> = {
  'schools.about': {
    type: 'string',
    isNullable: true,
    hasDefault: false
  },
  // ... 468 fields generated
};
```
**Purpose:** Type information from database schema
**Problem:** Disconnected from manual metadata; needs manual overrides

### 5. **ResolvedTableColumn** (runtime type in table-spec-resolver)
```typescript
export type ResolvedTableColumn = {
  field: string;
  label: string;
  type?: 'string' | 'number' | 'boolean' | 'date' | 'enum' | 'attachment';
  lookup?: FieldLookup;
  attachment?: boolean;  // ← Redundant with type!
  linkToField?: string;
  linkToAttachmentArray?: string;
  maxArrayEntries?: number;
  multiline?: boolean;
  width?: string;
  update?: 'no' | 'yes' | 'newOnly';
  editable: boolean;
  array?: boolean;
  // ... 15+ properties!
};
```
**Purpose:** Runtime column configuration after resolution
**Problem:** Accumulated cruft - has both `type: 'attachment'` AND `attachment: boolean`

### 6. **CardField** (in card-service)
```typescript
export type CardField = {
  field: string;
  label: string;
  value: FieldValue;
  metadata: FieldMetadata;
  linkToAttachmentArray?: string; // ← Added separately!
};
```
**Purpose:** Rendered field for cards/lists
**Problem:** linkToAttachmentArray lives here instead of in metadata

## Problems Summary

### 1. **Duplication & Inconsistency**
- `label` vs `headerName`
- `type` vs `valueType`
- `lookupTable` vs `lookupField` vs `lookup`
- `attachment: true` vs `type: 'attachment'`
- `linkToAttachment` vs `linkToField` vs `linkToAttachmentArray`

### 2. **Scattered Configuration**
To configure a single field like `doc_type`, you need to touch:
1. Table preset (label, lookupTable, linkToAttachmentArray, listLayout)
2. Maybe SCHOOL_FIELD_METADATA (if needs multiline or writeTable)
3. Maybe grid config (if shown on grid page)
4. Generated types (database schema)

### 3. **No Single Source of Truth**
- Which config wins? Preset? Field metadata? Generated?
- Resolution order is unclear
- Merge logic scattered across 3+ resolvers

### 4. **Type Confusion**
```typescript
// Is this an attachment field?
field.type === 'attachment'  // Option 1
field.attachment === true     // Option 2
field.metadata?.type === 'attachment'  // Option 3
field.linkToAttachment  // Option 4?
field.linkToAttachmentArray  // Option 5??
```

### 5. **No Validation**
- No schema validation on configs
- Typos in field names not caught
- Invalid `linkToAttachmentArray` points to non-existent field

## Proposed Solution: Unified Field Registry

### New Structure:

```typescript
// 1. Single field registry per module
export const SCHOOL_FIELDS = {
  doc_type: {
    // Core
    type: 'lookup' as const,
    lookup: { table: 'zref_gov_docs', value: 'value', label: 'label' },

    // Display
    label: 'Document Type',

    // Relationships
    linksTo: { field: 'governance_doc_public_urls', type: 'attachmentArray' },

    // Edit
    editable: true,
    required: false,
  },

  governance_doc_public_urls: {
    type: 'attachmentArray' as const,
    visibility: 'suppress',
    editable: false,
  },

  planning_album: {
    type: 'attachment' as const,
    label: 'Planning Album',
    sourceTable: 'school_ssj_data', // Instead of writeTable
    bucket: 'planning-albums',
  },

  about: {
    type: 'text' as const,
    multiline: true,
    maxLength: 5000,
  },
} as const satisfies FieldRegistry;

// 2. View configs reference the registry
export const GOVERNANCE_DOCS_VIEW = {
  table: 'governance_docs',
  fields: [
    { key: 'doc_type', layout: 'title' },
    { key: 'upload_date', layout: 'subtitle' },
    { key: 'governance_doc_public_urls' }, // Auto-suppressed
  ],
  actions: {
    row: ['view', 'archive'],
    table: ['add'],
  },
} as const;

// 3. Grid config also references registry
export const SCHOOL_GRID = {
  fields: [
    { key: 'school_name', sortable: true },
    { key: 'stage_status', kanbanKey: true },
  ],
} as const;
```

### Benefits:

1. **Single source of truth** - All field config in one place
2. **Consistent naming** - No more label vs headerName confusion
3. **Type safety** - `as const satisfies FieldRegistry` validates at compile time
4. **Reusability** - Field config shared across views, grids, tables
5. **Clarity** - linksTo relationship explicit
6. **Validation** - Can validate linkTo points to real field
7. **Less duplication** - View configs just reference field keys

### Migration Path:

1. Create field registries (SCHOOL_FIELDS, EDUCATOR_FIELDS, etc.)
2. Update one view at a time to reference registry
3. Build compatibility layer for old configs
4. Gradually migrate all views
5. Remove old config formats

## Immediate Wins (No Migration Needed):

### 1. Standardize Property Names
Pick ONE and stick to it:
- `label` (not headerName)
- `lookup` (not lookupTable or lookupField)
- `type: 'attachment'` (remove separate `attachment: boolean`)
- `linksTo` (unify linkToField, linkToAttachment, linkToAttachmentArray)

### 2. Move linkToAttachmentArray to Metadata
```typescript
// Instead of CardField having it separately
field.metadata.linksTo = { field: 'governance_doc_public_urls', type: 'array' }
```

### 3. Create Field Config Validator
```typescript
function validateFieldConfig(config: any) {
  // Check for typos
  // Check linkTo points to real field
  // Check lookup table exists
  // etc.
}
```

### 4. Document Current State
Add JSDoc to each config file explaining:
- What it's for
- What takes precedence
- Migration plan

## Recommendation:

**Start small:**
1. Fix immediate inconsistencies (attachment boolean vs type)
2. Move linkToAttachmentArray into field metadata
3. Standardize property names in NEW configs
4. Document current architecture clearly

**Long term:**
- Design unified field registry
- Build migration tools
- Gradually migrate one module at a time

This is a big refactor but the payoff is huge - much easier to maintain and debug.
