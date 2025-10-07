# Field Metadata Auto-Generation System

## Overview

This system automatically generates field metadata from your Supabase database schema, eliminating the need for manual field configuration in 95%+ of cases. Field types, enums, arrays, lookups, and relationships are all detected automatically.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Supabase Database                         │
│  • Tables, columns, types                                    │
│  • Enums (e.g., languages, gender_categories)               │
│  • Foreign keys & relationships                              │
│  • Array types (e.g., languages[])                          │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ Edge Function: schema-types-export
                 ↓
┌─────────────────────────────────────────────────────────────┐
│              Generator Scripts (3 total)                     │
├─────────────────────────────────────────────────────────────┤
│ 1. generate-database-types.ts                               │
│    → src/shared/types/database.types.ts                     │
│    • TypeScript types for all tables                        │
│                                                              │
│ 2. generate-field-metadata.ts                               │
│    → src/generated/enums.generated.ts                       │
│    • ENUM_OPTIONS: 75 enums with their values              │
│    • FIELD_TYPES: 1304 fields with type/array info         │
│    • FIELD_TO_ENUM: 153 field→enum mappings                │
│                                                              │
│ 3. generate-lookups.ts                                      │
│    → src/generated/lookups.generated.ts                     │
│    • GENERATED_LOOKUPS: 35 lookup table configs            │
│    • Foreign key relationships                              │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ Imported by
                 ↓
┌─────────────────────────────────────────────────────────────┐
│                   card-service.ts                            │
│  Merges auto-generated + manual metadata                    │
│  Returns complete field configurations                       │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ Used by
                 ↓
┌─────────────────────────────────────────────────────────────┐
│                 UI Components                                │
│  • FieldEditor (renders correct input type)                 │
│  • CardRenderer (displays cards)                            │
│  • TableRenderer (displays tables)                          │
└─────────────────────────────────────────────────────────────┘
```

## What's Auto-Detected

### 1. Field Types
- **Boolean**: `lgbtqia: boolean`
- **Number**: `enrollment: integer`
- **String**: `full_name: text`
- **Date**: `created_at: timestamp`
- **JSON**: `metadata: jsonb`

### 2. Enums
Automatically detects PostgreSQL enums and maps them to fields:
```sql
-- Database definition
CREATE TYPE languages AS ENUM ('English', 'Spanish', 'French', ...);
```
```typescript
// Auto-generated mapping
FIELD_TO_ENUM['public.details_educators.primary_languages'] = 'languages';
ENUM_OPTIONS['languages'] = ['English', 'Spanish', 'French', ...];
```

### 3. Arrays
Detects PostgreSQL array types (identified by `_` prefix in `udt_name`):
```sql
-- Database definition
primary_languages languages[] DEFAULT '{}'::languages[]
```
```typescript
// Auto-detected
FIELD_TYPES['public.details_educators.primary_languages'] = {
  baseType: 'enum',
  enumName: 'languages',
  array: true  // ← Auto-detected!
};
```

### 4. Foreign Key Lookups
```sql
-- Database definition
founding_tls uuid REFERENCES people(id)
```
```typescript
// Auto-generated
GENERATED_LOOKUPS['people'] = {
  table: 'people',
  valueColumn: 'id',
  labelColumn: 'full_name'
};
```

## Manual Overrides (When Needed)

Only override when you need to customize:

### Labels
```typescript
// features/educators/views.ts
export const EDUCATOR_FIELD_METADATA: FieldMetadataMap = {
  educ_attainment: { label: 'Educational Attainment' },
  hh_income: { label: 'Household Income' },
};
```

### Lookup Tables (Business Logic)
```typescript
// When the database relationship doesn't capture the intent
export const SCHOOL_FIELD_METADATA: FieldMetadataMap = {
  public_funding: { lookupTable: 'zref_public_funding_sources' },
  founding_tls: { lookupTable: 'people' },
};
```

### Special Behaviors
```typescript
export const SCHOOL_FIELD_METADATA: FieldMetadataMap = {
  stage_status: { editable: false },          // Computed field
  about: { multiline: true },                 // Textarea instead of input
  logo: { type: 'attachment' },               // File upload
  visioning_album: {
    type: 'attachment',
    writeTable: 'school_ssj_data'            // Write to different table
  },
};
```

### Conditional Visibility
```typescript
export const EDUCATOR_FIELD_METADATA: FieldMetadataMap = {
  race_ethnicity_other: {
    label: 'Race/Ethnicity - if Other, please specify',
    visibleIf: { field: 'race_ethnicity', in: ['other', 'Other'] }
  },
  gender_other: {
    label: 'Gender - if Other, please specify',
    visibleIf: { field: 'gender', in: ['Other'] }
  },
};
```

## Regenerating Metadata

When you change the database schema:

```bash
# Regenerate all metadata (recommended)
npm run gen:all

# Or run individually
npm run gen:types    # Database TypeScript types
npm run gen:enums    # Enum values and field type mappings
npm run gen:lookups  # Foreign key lookup configurations
```

## How It Works

### 1. Edge Function Fetches Schema
The `schema-types-export` edge function queries PostgreSQL system catalogs:
- `information_schema.tables`
- `information_schema.columns`
- `pg_enum` (for enum values)
- `pg_constraint` (for foreign keys)

### 2. Generator Scripts Process Data

**generate-field-metadata.ts** is the key:
```typescript
// Detects array types by underscore prefix
const isArray = col.udt_name?.startsWith('_') || col.data_type === 'ARRAY';

// Strips underscore to get base type
// _languages → languages
let baseUdtName = col.udt_name;
if (isArray && baseUdtName?.startsWith('_')) {
  baseUdtName = baseUdtName.substring(1);
}

// Maps to enum if it exists
if (baseUdtName && enums[baseUdtName]) {
  enumName = baseUdtName;
  fieldToEnum[fieldKey] = baseUdtName;
}
```

### 3. Card Service Merges Metadata

**card-service.ts** resolution order (highest to lowest priority):
1. Manual `enumName` from field metadata
2. Manual `lookupTable` from field metadata
3. Schema `enumRef` (true PostgreSQL enum types)
4. `FIELD_TO_ENUM` mapping (for array enums)
5. Foreign key references
6. `FIELD_TYPES` for base types (boolean, number, etc.)

## File Structure

```
client-new/
├── scripts/                          # Generator scripts
│   ├── generate-database-types.ts    # TypeScript types
│   ├── generate-field-metadata.ts    # Enums & field types
│   └── generate-lookups.ts           # Lookup configs
│
├── src/
│   ├── generated/                    # Auto-generated (don't edit!)
│   │   ├── enums.generated.ts        # 75 enums, 1304 fields, 153 mappings
│   │   ├── lookups.generated.ts      # 35 lookup configs
│   │   └── schema-metadata.generated.ts
│   │
│   ├── shared/
│   │   ├── types/
│   │   │   └── database.types.ts     # TypeScript types for tables
│   │   │
│   │   └── services/
│   │       └── card-service.ts       # Merges auto + manual metadata
│   │
│   └── features/
│       ├── educators/
│       │   └── views.ts              # EDUCATOR_FIELD_METADATA (manual overrides)
│       └── schools/
│           └── views.ts              # SCHOOL_FIELD_METADATA (manual overrides)
```

## Examples

### Example 1: Adding a New Field

```sql
-- 1. Add column to database
ALTER TABLE schools ADD COLUMN parent_organization TEXT;
```

```bash
# 2. Regenerate metadata
npm run gen:all
```

```typescript
// 3. Field is instantly available! No code changes needed.
// Auto-detected as:
// - type: 'string'
// - editable: true
// - nullable: true
// - label: 'Parent Organization' (auto-humanized)
```

### Example 2: Adding a New Enum Field

```sql
-- 1. Create enum in database
CREATE TYPE school_types AS ENUM ('Public', 'Private', 'Charter');

-- 2. Add column using the enum
ALTER TABLE schools ADD COLUMN school_type school_types;
```

```bash
# 3. Regenerate
npm run gen:all
```

```typescript
// 4. Field is auto-detected as:
// - type: 'enum'
// - enumName: 'school_types'
// - options: ['Public', 'Private', 'Charter']
// - Renders as dropdown automatically!
```

### Example 3: Adding an Array Enum Field

```sql
-- 1. Add array enum column
ALTER TABLE educators ADD COLUMN certifications certification_types[];
```

```bash
# 2. Regenerate
npm run gen:all
```

```typescript
// 3. Field is auto-detected as:
// - type: 'enum'
// - enumName: 'certification_types'
// - array: true
// - Renders as multi-select dropdown automatically!
```

## Statistics

**Current auto-detection coverage:**
- **75 enums** with values
- **1,304 fields** with type information
- **153 field-to-enum mappings**
- **35 lookup configurations**
- **~95% of fields** require zero manual configuration

**Manual overrides needed for:**
- Custom labels (~20 fields)
- Lookup table specifications (~10 fields)
- Special behaviors (attachments, multiline, editable:false) (~15 fields)
- Conditional visibility (~5 fields)

**Total: ~50 manual overrides out of 1,304 fields (3.8%)**

## Key Benefits

1. **Automatic Updates**: Database changes flow to UI automatically
2. **Type Safety**: Generated TypeScript types prevent errors
3. **Minimal Boilerplate**: Only specify what differs from defaults
4. **Single Source of Truth**: Database schema drives everything
5. **Developer Friendly**: Add a column, run `gen:all`, done!

## Troubleshooting

### Enum dropdown not showing options?
1. Check if field is mapped: `FIELD_TO_ENUM['public.table.field']`
2. Check if enum exists: `ENUM_OPTIONS['enum_name']`
3. Regenerate: `npm run gen:enums`

### Array field showing as single-select?
1. Check `FIELD_TYPES['public.table.field'].array` is `true`
2. Verify database column is array type: `field_name type[]`
3. Regenerate: `npm run gen:enums`

### Lookup not working?
1. Check `GENERATED_LOOKUPS['table_name']` exists
2. Add manual override: `fieldName: { lookupTable: 'table_name' }`
3. Regenerate: `npm run gen:lookups`

## Future Enhancements

Potential additions if needed:
- Column comments → help text
- Check constraints → validation rules
- Default values → form defaults
- Required fields (NOT NULL) → validation
