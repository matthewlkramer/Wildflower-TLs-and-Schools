# Metadata-Driven Schema & API System

This project uses a comprehensive metadata-driven architecture where the schema, storage layer, and API routes are automatically generated from Airtable metadata.

## Auto-Generated Files (DO NOT EDIT)

These files are automatically generated and will be overwritten:

- `shared/schema.generated.ts` - TypeScript interfaces, Zod schemas, field mappings, and options constants
- `server/generic-storage.generated.ts` - Database configuration, transformers, and convenience methods  
- `server/routes.generated.ts` - Complete CRUD API routes for all tables

## How It Works

1. **Metadata Source**: Airtable "Metadata" table contains field definitions with columns:
   - "Include in WFTLS" - whether to include the field
   - "Field Name in WFTLS" - camelCase field name for this app
   - "Display Name in WFTLS" - human-readable name
   - "Is Required in WFTLS" - whether field is required
   - "Zod Type" - TypeScript/Zod type (string, number, boolean, etc.)
   - "Field Options" - for singleSelect/multipleSelect fields, contains the actual choices

2. **Generation Script**: `scripts/generate-from-metadata.cjs`
   - Fetches metadata from Airtable
   - Generates TypeScript interfaces for 49 tables
   - Creates Zod validation schemas with proper validation
   - Generates field mapping objects for server-side transformations
   - Creates OPTIONS constants from actual Airtable choice fields
   - Generates complete transformer functions with type conversions
   - Generates full CRUD API routes for all tables

3. **Generated Output**:
   - **Schema**: 1,000+ fields across 49 tables with full type definitions
   - **Storage**: Complete transformers with proper type conversions (String, toNumber, firstId, etc.)
   - **Routes**: 245 CRUD endpoints (5 per table) with validation and error handling
   - **Constants**: Field options like `SCHOOLS_OPTIONS_SCHOOLSTATUS` with real values from Airtable
   - **Type Safety**: Automatic camelCase conversion and JavaScript identifier validation

## Usage

### Regenerating All Files
Run after changing metadata in Airtable:

```bash
node scripts/generate-from-metadata.cjs
```

This generates:
- `shared/schema.generated.ts` - Types and validation
- `server/generic-storage.generated.ts` - Data transformers  
- `server/routes.generated.ts` - API endpoints

### Using Generated Routes
```typescript
import { registerGeneratedRoutes } from './routes.generated';

// In your main routes file
export function registerAllRoutes(app: Express) {
  // Register all generated CRUD routes (5 per table)
  registerGeneratedRoutes(app);
  
  // Add custom routes for specific business logic
  app.get("/api/schools/user/:userId", customHandler);
}
```

### Generated API Endpoints
Every table gets 5 standardized endpoints:
- `GET /api/{resource}` - get all records
- `GET /api/{resource}/:id` - get by ID  
- `POST /api/{resource}` - create record
- `PUT /api/{resource}/:id` - update record
- `DELETE /api/{resource}/:id` - delete record

Examples: `/api/schools`, `/api/educators`, `/api/events`, etc.

## Benefits

### Code Reduction
- **Routes**: 2,424 lines → 473 lines (80% reduction)
- **Schema**: Eliminated hundreds of lines of manual type definitions
- **Storage**: Consolidated manual transformers into generated ones

### Automation & Consistency  
- ✅ Single source of truth (Airtable metadata)
- ✅ No more manual schema maintenance
- ✅ Real field options from Airtable choice fields
- ✅ Automatic validation and type safety
- ✅ Consistent API patterns across all tables
- ✅ Field changes automatically propagate through the system
- ✅ Complete type conversions for all Airtable field types

### Developer Experience
- ✅ Focus on business logic instead of repetitive CRUD
- ✅ Full TypeScript support with generated types
- ✅ Zod validation built-in for all endpoints  
- ✅ Consistent error handling and caching
- ✅ Clear separation of generated vs custom code

## Architecture

```
Airtable Metadata Table
         ↓
scripts/generate-from-metadata.cjs
         ↓
├── shared/schema.generated.ts      (Types & Validation)
├── server/generic-storage.generated.ts (Data Layer)
└── server/routes.generated.ts      (API Layer)
```

The system handles 49 tables with 1,000+ fields, generating complete CRUD operations with proper type safety and validation automatically.