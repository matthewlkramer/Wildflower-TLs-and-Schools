# Unified Field Registry Design

## Goal
Create a single source of truth for field configuration that **maximizes use of generated files** while allowing manual overrides.

## Generated Files We Have

### 1. `schema-metadata.generated.ts`
**Auto-updates when DB schema changes**
```typescript
schemaMetadata = {
  "public": {
    "governance_docs": {
      "columns": {
        "doc_type": {
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "references": []
        },
        "governance_doc_public_urls": {
          "baseType": "string",
          "isArray": true,  // ✅ Knows it's an array!
          "isNullable": true
        }
      }
    }
  }
}
```
**Provides:** Type, nullable, array, foreign keys

### 2. `lookups.generated.ts`
**Auto-updates when lookup tables change**
```typescript
GENERATED_LOOKUPS = {
  'zref_gov_docs': {
    table: 'zref_gov_docs',
    valueColumn: 'value',
    labelColumn: 'label',
  }
}
```
**Provides:** Lookup configs for reference tables

### 3. `enums.generated.ts`
**Auto-updates when enums change**
```typescript
FIELD_TYPES: Record<string, {
  baseType: 'string' | 'number' | 'boolean',
  enumName?: string,
  array?: boolean
}>
```
**Provides:** Base types and enum references

## The Unified Registry Architecture

### Layer 1: Generated Base (Auto-Updates)
```typescript
// utils/field-registry-base.ts
import { schemaMetadata } from '@/generated/schema-metadata.generated';
import { GENERATED_LOOKUPS } from '@/generated/lookups.generated';

/**
 * Get base field info from generated schema
 */
export function getGeneratedFieldInfo(table: string, field: string) {
  const meta = schemaMetadata.public[table]?.columns[field];
  if (!meta) return null;

  return {
    type: inferFieldType(meta),
    array: meta.isArray,
    nullable: meta.isNullable,
    lookup: inferLookup(meta, field),
  };
}

function inferFieldType(meta: any): FieldType {
  // If it's a foreign key, it's probably a lookup
  if (meta.references?.length > 0) return 'lookup';

  // Check for attachment patterns
  if (meta.column.includes('object_id')) return 'attachment';
  if (meta.column.includes('public_url') && meta.isArray) return 'attachmentArray';

  // Base types
  if (meta.baseType === 'boolean') return 'boolean';
  if (meta.baseType === 'number') return 'number';
  if (meta.enumRef) return 'enum';

  return 'string';
}

function inferLookup(meta: any, fieldName: string): LookupConfig | null {
  // Try to find in generated lookups
  if (fieldName.endsWith('_id')) {
    const tableName = fieldName.replace(/_id$/, '') + 's'; // school_id → schools
    if (GENERATED_LOOKUPS[tableName]) {
      return GENERATED_LOOKUPS[tableName];
    }
  }

  // Check field name patterns
  if (fieldName === 'doc_type') return GENERATED_LOOKUPS['zref_gov_docs'];

  return null;
}
```

### Layer 2: Manual Overrides (Your Control)
```typescript
// features/schools/field-registry.ts

import { createFieldRegistry } from '@/shared/utils/field-registry';

/**
 * School field configuration
 * ONLY define what differs from generated metadata
 */
export const SCHOOL_FIELDS = createFieldRegistry('schools', {
  // Override generated inference
  doc_type: {
    label: 'Document Type',  // Better label
    linksTo: {
      field: 'governance_doc_public_urls',
      type: 'array'
    }
  },

  governance_doc_public_urls: {
    // Generated knows: type='attachmentArray', array=true
    // We just add display config:
    label: 'Files',
    visibility: 'suppress',
  },

  planning_album: {
    // Generated knows: type='attachment'
    // We add data source:
    sourceTable: 'school_ssj_data',
    bucket: 'planning-albums',
  },

  about: {
    // Generated knows: type='string'
    // We add UI config:
    multiline: true,
    maxLength: 5000,
  },

  stage_status: {
    // Generated knows: type='lookup', references schools
    // We add:
    editable: false,  // Computed field
  },

  // Fields not in manual config use 100% generated metadata
});
```

### Layer 3: Registry API (Merges Layers)
```typescript
// shared/utils/field-registry.ts

/**
 * Creates a field registry that merges generated + manual config
 */
export function createFieldRegistry<T extends string>(
  tableName: string,
  manualConfig: Partial<Record<T, FieldConfig>>
) {
  return {
    /**
     * Get complete field config (generated + manual overrides)
     */
    get(fieldName: T): CompleteFieldConfig {
      // 1. Start with generated base
      const generated = getGeneratedFieldInfo(tableName, fieldName);

      // 2. Apply manual overrides
      const manual = manualConfig[fieldName] || {};

      // 3. Merge (manual wins)
      return {
        field: fieldName,
        table: tableName,

        // From generated (with manual override)
        type: manual.type || generated?.type || 'string',
        array: manual.array ?? generated?.array ?? false,
        nullable: manual.nullable ?? generated?.nullable ?? true,
        lookup: manual.lookup || generated?.lookup,

        // From manual only
        label: manual.label || humanizeFieldName(fieldName),
        multiline: manual.multiline,
        editable: manual.editable ?? true,
        sourceTable: manual.sourceTable,
        bucket: manual.bucket,
        linksTo: manual.linksTo,
        visibility: manual.visibility,

        // Validation
        maxLength: manual.maxLength,
        required: !generated?.nullable,
      };
    },

    /**
     * Get all fields for this table
     */
    getAllFields(): CompleteFieldConfig[] {
      const schemaFields = Object.keys(
        schemaMetadata.public[tableName]?.columns || {}
      );
      return schemaFields.map(f => this.get(f as T));
    },

    /**
     * Validate that linked fields exist
     */
    validate() {
      Object.entries(manualConfig).forEach(([field, config]) => {
        if (config.linksTo) {
          const targetExists = this.get(config.linksTo.field as T);
          if (!targetExists) {
            console.warn(
              `Field ${field} links to non-existent field: ${config.linksTo.field}`
            );
          }
        }
      });
    }
  };
}
```

### Layer 4: View Configs Reference Registry
```typescript
// features/schools/views.ts

import { SCHOOL_FIELDS } from './field-registry';

export const GOVERNANCE_DOCS_VIEW = {
  table: 'governance_docs',

  // Just reference field names - config comes from registry
  fields: [
    'doc_type',        // Registry provides: label, lookup, linksTo
    'upload_date',     // Registry provides: label, type
    // No need to list suppressed fields - registry handles it
  ],

  layout: {
    doc_type: 'title',
    upload_date: 'subtitle',
  },

  actions: {
    row: ['view', 'archive'],
    table: ['add'],
  },
};

// At runtime, resolve the view
const resolvedView = resolveView(GOVERNANCE_DOCS_VIEW, SCHOOL_FIELDS);
// resolvedView.fields[0] = {
//   field: 'doc_type',
//   label: 'Document Type',
//   type: 'lookup',
//   lookup: { table: 'zref_gov_docs', ... },
//   linksTo: { field: 'governance_doc_public_urls', type: 'array' }
// }
```

## Benefits

### ✅ Auto-Updates from Database
```typescript
// You change DB: add column "notes" to governance_docs
// Run: npm run gen:all
// Instantly available:
SCHOOL_FIELDS.get('notes')
// { field: 'notes', type: 'string', label: 'Notes', editable: true }
```

### ✅ Minimal Manual Config
```typescript
// BEFORE (duplicate everything):
const PRESET = {
  columns: [
    {
      field: 'doc_type',
      label: 'Document Type',
      type: 'string',
      lookupTable: 'zref_gov_docs',
      linkToAttachmentArray: 'governance_doc_public_urls',
      listLayout: 'title'
    }
  ]
};

// AFTER (only overrides):
const SCHOOL_FIELDS = {
  doc_type: {
    label: 'Document Type',  // Just this!
    linksTo: { field: 'governance_doc_public_urls', type: 'array' }
  }
};

const VIEW = {
  fields: ['doc_type'],  // Everything else inferred
  layout: { doc_type: 'title' }
};
```

### ✅ Type Safety
```typescript
// Registry knows all field names
type SchoolField = keyof typeof SCHOOL_FIELDS;

const field: SchoolField = 'doc_typo';  // ❌ Compile error!
const field: SchoolField = 'doc_type';  // ✅ Valid
```

### ✅ Validation
```typescript
// Validate all relationships at app startup
SCHOOL_FIELDS.validate();
// → Warning: doc_type links to 'governance_doc_public_urls_typo' which doesn't exist
```

### ✅ Single Source of Truth
```
Generated Schema (DB truth)
         ↓
   Field Registry (adds overrides)
         ↓
   ┌────────┼────────┐
   ↓        ↓        ↓
 Views    Grids   Tables
```

## Migration Path

### Phase 1: Create Infrastructure (1 week)
1. ✅ Add `linksTo` to FieldMetadata (done)
2. Build `field-registry-base.ts` with schema inference
3. Build `field-registry.ts` with merge logic
4. Create `SCHOOL_FIELDS` registry

### Phase 2: Migrate One View (test)
1. Pick simplest view (e.g., educators list)
2. Define minimal field overrides
3. Update view to reference fields by name
4. Test thoroughly

### Phase 3: Migrate All Views (incremental)
1. One view at a time
2. Keep old format working (backward compat)
3. Deprecate old properties
4. Remove when all migrated

### Phase 4: Expand (future)
1. Grid configs use registry
2. Form builders use registry
3. Auto-generate forms from registry
4. Add field-level permissions

## File Structure

```
src/
├── generated/                    # Auto-generated (DON'T EDIT)
│   ├── schema-metadata.generated.ts  ← DB truth
│   ├── lookups.generated.ts          ← Lookup configs
│   └── enums.generated.ts            ← Enum values
│
├── shared/
│   └── utils/
│       ├── field-registry-base.ts    ← Schema inference
│       └── field-registry.ts         ← Registry builder
│
└── features/
    └── schools/
        ├── field-registry.ts         ← SCHOOL_FIELDS (manual overrides)
        └── views.ts                  ← View configs (reference fields)
```

## Example: Full Flow

```typescript
// 1. You add column to DB
ALTER TABLE governance_docs ADD COLUMN reviewed_by TEXT;

// 2. Regenerate
npm run gen:all

// 3. Instantly available (no manual config needed!)
SCHOOL_FIELDS.get('reviewed_by')
// {
//   field: 'reviewed_by',
//   type: 'string',
//   label: 'Reviewed By',
//   editable: true,
//   nullable: true
// }

// 4. Add to view (just the field name)
export const GOVERNANCE_DOCS_VIEW = {
  fields: ['doc_type', 'upload_date', 'reviewed_by'],  // ← Add here
  layout: {
    doc_type: 'title',
    upload_date: 'subtitle',
    reviewed_by: 'body'  // ← And here
  }
};

// 5. Done! It renders with inferred config

// 6. Need to customize? Add override:
export const SCHOOL_FIELDS = {
  reviewed_by: {
    label: 'Reviewed By (Name)',  // Better label
    // Everything else stays inferred
  }
};
```

## Next Steps

Want me to:
1. **Build the infrastructure** (field-registry-base.ts, field-registry.ts)
2. **Create SCHOOL_FIELDS** as a proof of concept
3. **Migrate one view** (governance docs) to use the registry
4. **Document the API** for other developers

This approach means you'll spend minimal time on config and maximum time on features!
