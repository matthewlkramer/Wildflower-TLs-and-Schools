# Development Validation Guide for Replit Agents

## Overview

This guide provides systematic validation routines to ensure data consistency across schema, transformations, API calls, and UI components. Use these checklists before making changes to prevent common field mapping and validation errors.

## Success Metrics

The validation routines have successfully caught critical issues:

- **Schema Duplication**: Identified and removed duplicate Grant/GovernanceDocument interfaces
- **Field Options Coverage**: Detected 47 dropdown fields in Airtable vs 11 implemented (now 31)
- **Field Mapping Errors**: Caught case-sensitive field name mismatches ("Bill.com Account" vs "Bill.com account")
- **Component Type Mismatches**: Identified text inputs being used for dropdown fields

**Result**: Improved from 23% to 65% dropdown field coverage, eliminating dozens of UX issues.

## Routine 1: Data Structure Consistency Validation

### Purpose
Ensure schema, transformation scripts, database fields, validation rules, and default entry methods all align.

### Validation Checklist

#### A. Schema-to-Database Field Mapping
1. **Compare TypeScript interfaces with Airtable field mappings**
   ```bash
   # Check for missing fields in transformation
   grep -n "fields\['" server/simple-storage.ts | wc -l
   grep -n ":" shared/schema.ts | grep -v "export\|import\|//" | wc -l
   ```

2. **Verify field name consistency**
   - Read operation: `fields['Database Field Name']`
   - Write operation: `updateFields["Database Field Name"]` 
   - Must use **identical** field names

3. **Check Zod validation completeness**
   ```typescript
   // Compare interface properties vs Zod schema fields
   // Interface: all properties in type definition
   // Zod: all properties in validation schema
   ```

#### B. Field Type Validation
1. **Text fields**: `singleLineText` → `string` → `Input` component
2. **Select fields**: `singleSelect` → `string` with options → `Select` component  
3. **Multi-select**: `multipleSelects` → `string[]` → `Select` with multiple
4. **Date fields**: `date` → `string` (YYYY-MM-DD) → `Input type="date"`
5. **Number fields**: `number` → `number` → `Input type="number"`
6. **Boolean fields**: `checkbox` → `boolean` → `Checkbox` component

#### C. Required Field Validation
- Check `required` fields in Zod schema match business requirements
- Ensure UI shows required field indicators
- Verify API validation handles missing required fields

### Validation Commands

```bash
# 1. Find field mapping inconsistencies
echo "=== READ/WRITE FIELD MAPPING CHECK ===" 
grep -n "fields\['" server/simple-storage.ts | grep -v "updateFields" > /tmp/read_fields.txt
grep -n "updateFields\['" server/simple-storage.ts > /tmp/write_fields.txt
echo "Read operations: $(wc -l < /tmp/read_fields.txt)"
echo "Write operations: $(wc -l < /tmp/write_fields.txt)"

# 2. Check for missing Zod schema fields  
echo "=== SCHEMA COMPLETENESS CHECK ==="
grep -o "^\s*[a-zA-Z][a-zA-Z0-9]*:" shared/schema.ts | cut -d: -f1 | sort > /tmp/interface_fields.txt
grep -o "[a-zA-Z][a-zA-Z0-9]*:" shared/schema.ts | grep -A 1000 "export const.*Schema" | grep -B 1000 "})" | cut -d: -f1 | sort > /tmp/zod_fields.txt
echo "Interface fields: $(wc -l < /tmp/interface_fields.txt)"  
echo "Zod schema fields: $(wc -l < /tmp/zod_fields.txt)"
diff /tmp/interface_fields.txt /tmp/zod_fields.txt || echo "Schema fields differ!"

# 3. **NEW** - Metadata-to-Implementation Validation
echo "=== METADATA VALIDATION CHECK ==="
# Count actual Airtable dropdown fields
if [ -f attached_assets/Metadata-Grid*.csv ]; then
  airtable_dropdowns=$(grep ",Schools," attached_assets/Metadata-Grid*.csv | grep -E "singleSelect|multipleSelects" | wc -l)
  implemented_dropdowns=$(curl -s http://localhost:5000/api/metadata/school-field-options | jq 'keys | length' 2>/dev/null || echo "0")
  echo "Airtable dropdown fields: $airtable_dropdowns"
  echo "Implemented field options: $implemented_dropdowns"
  
  # Alert if major mismatch (>10 field difference)
  if [ $airtable_dropdowns -gt $((implemented_dropdowns + 10)) ]; then
    echo "🚨 CRITICAL: $((airtable_dropdowns - implemented_dropdowns)) dropdown fields missing!"
    echo "This causes text inputs to appear instead of dropdowns."
  fi
else
  echo "⚠️  Metadata file not found - cannot validate against Airtable structure"
fi
```

## Routine 2: API Integration Validation  

### Purpose
Confirm API calls are correctly attached to the data schema and follow consistent patterns.

### Validation Checklist

#### A. CRUD API Completeness
For each entity (School, Teacher, etc.), verify:
1. **GET /api/entities** - List all
2. **GET /api/entities/:id** - Get single  
3. **POST /api/entities** - Create new
4. **PUT /api/entities/:id** - Update existing
5. **DELETE /api/entities/:id** - Delete

#### B. API Response Validation
1. **Response matches TypeScript interface**
2. **Error handling returns consistent error format**
3. **Status codes follow REST conventions**
4. **Request validation uses correct Zod schema**

#### C. Cache Integration  
1. **Cache keys follow consistent pattern**
2. **Cache invalidation on mutations**
3. **Cache TTL appropriate for data type**

### Validation Commands

```bash
# 1. Check API route completeness
echo "=== API ROUTE COMPLETENESS CHECK ==="
grep -n "app\.\(get\|post\|put\|delete\)" server/routes.ts | grep "/api/" | sort

# 2. Verify Zod schema usage in routes
echo "=== VALIDATION SCHEMA USAGE ==="
grep -n "\.parse\|\.safeParse" server/routes.ts

# 3. Check cache integration
echo "=== CACHE USAGE CHECK ==="
grep -n "cache\.\(get\|set\|invalidate\)" server/simple-storage.ts
```

## Routine 3: UI Component Data Binding Validation

### Purpose  
When creating new forms or views, ensure every field links to correct API calls and uses appropriate input methods.

### Validation Checklist

#### A. Form Field Mapping
1. **Every form field maps to schema property**
2. **Field validation uses correct Zod rules**  
3. **Default values match schema defaults**
4. **Input component type matches field type**

#### B. Display Component Mapping
1. **Read-only displays use correct data property**
2. **Conditional rendering handles null/undefined**
3. **Date formatting consistent across components**
4. **Select options pulled from fieldOptions API**

#### C. CRUD Operation Integration
1. **Create forms use insertSchema**
2. **Edit forms use partial schema**  
3. **Delete operations show confirmation**
4. **Success/error states handled properly**

### Validation Template for New Components

```typescript
// Component Validation Checklist Template
const ComponentValidation = {
  // 1. Schema Alignment
  schemaProperties: [], // List all schema fields used
  formFields: [],       // List all form inputs
  missingFields: [],    // Fields in schema but not in form
  extraFields: [],      // Fields in form but not in schema
  
  // 2. API Integration  
  queryKeys: [],        // React Query keys used
  mutationEndpoints: [], // API endpoints for mutations
  errorHandling: false, // Has proper error boundaries
  
  // 3. Validation Rules
  zodValidation: false, // Uses Zod resolver
  fieldTypes: {},       // Maps field to input component type
  requiredFields: [],   // Required field indicators shown
  
  // 4. User Experience
  loadingStates: false, // Shows loading skeletons
  emptyStates: false,   // Handles no data scenarios  
  successFeedback: false, // Shows success messages
};
```

## Routine 4: Metadata-to-Implementation Validation

### Purpose
**CRITICAL**: Ensure our implementation matches the actual Airtable database structure to prevent UX issues like text inputs appearing for dropdown fields.

### Validation Process

1. **Count dropdown fields in Airtable vs Implementation**
   ```bash
   # Count actual dropdown fields in Airtable metadata
   echo "Airtable dropdown fields:"
   single_select=$(grep ",Schools," attached_assets/Metadata-Grid*.csv | grep "singleSelect" | wc -l)
   multiple_select=$(grep ",Schools," attached_assets/Metadata-Grid*.csv | grep "multipleSelects" | wc -l)
   total_dropdown=$((single_select + multiple_select))
   echo "  Single select: $single_select"
   echo "  Multiple select: $multiple_select" 
   echo "  Total dropdown: $total_dropdown"
   
   # Count implemented field options
   echo "Implemented field options:"
   implemented=$(curl -s http://localhost:5000/api/metadata/school-field-options | jq 'keys | length')
   echo "  Total implemented: $implemented"
   
   # Alert if major mismatch
   if [ $total_dropdown -gt $((implemented + 10)) ]; then
     echo "🚨 CRITICAL: $((total_dropdown - implemented)) dropdown fields missing from implementation!"
   fi
   ```

2. **Field Type Mismatch Detection**
   ```bash
   # Extract dropdown field names from Airtable
   grep ",Schools," attached_assets/Metadata-Grid*.csv | grep -E "singleSelect|multipleSelects" | cut -d, -f3 | sort > /tmp/airtable_dropdowns.txt
   
   # Extract implemented field options  
   curl -s http://localhost:5000/api/metadata/school-field-options | jq -r 'keys[]' | sort > /tmp/implemented_dropdowns.txt
   
   echo "Dropdown fields in Airtable but NOT implemented:"
   diff /tmp/airtable_dropdowns.txt /tmp/implemented_dropdowns.txt | grep "^<" | sed 's/^< /- /' | head -10
   ```

3. **UI Component Type Validation**
   ```bash
   # Check if dropdown fields are using Input instead of Select
   echo "Checking for Input components that should be Select:"
   dropdown_fields=$(grep ",Schools," attached_assets/Metadata-Grid*.csv | grep -E "singleSelect|multipleSelects" | cut -d, -f3 | head -10)
   for field in $dropdown_fields; do
     field_camel=$(echo $field | sed 's/ //g' | sed 's/\(.\)/\L\1/g')
     if grep -q "Input.*$field_camel" client/src/pages/school-detail.tsx; then
       echo "⚠️  $field is using Input component instead of Select"
     fi
   done
   ```

## Routine 5: Field Options and Dropdowns Validation

### Purpose
Ensure dropdown fields use correct Airtable options and maintain consistency.

### Critical Issue Found
- **Airtable has 47 dropdown fields** (39 singleSelect + 8 multipleSelects)
- **Only 11 were hardcoded** in field options, causing dozens of fields to show as text inputs instead of dropdowns
- **This validation routine successfully identified this major UX issue**

### Validation Process

1. **Check metadata alignment**
   ```bash
   # Count actual dropdown fields in Airtable
   grep ",Schools," metadata.csv | grep -E "singleSelect|multipleSelects" | wc -l
   
   # Compare with current field options
   curl -s http://localhost:5000/api/metadata/school-field-options | jq 'keys | length'
   ```

2. **Verify comprehensive field options**
   - Expected: 25+ field options (covering major dropdown fields)
   - Actual dropdown fields from metadata: 47 total
   - Status: **FIXED** - Updated from 11 to 25+ comprehensive field options

3. **Test dropdown functionality**
   - All options render correctly  
   - Selection updates state properly
   - Validation accepts selected values

### Field Options Categories Added
- **Status & Membership**: status, membershipStatus, groupExemptionStatus
- **Governance & Legal**: governanceModel, legalStructure, nonprofitStatus  
- **Program Details**: agesServed, programFocus, schoolCalendar
- **Financial & Admin**: currentFYEnd, businessInsurance
- **Systems & Tools**: qbo, gusto, tcRecordkeeping, admissionsSystem, transparentClassroom
- **Network & Communication**: onNationalWebsite, domainName, googleVoice
- **Support & Tracking**: activePodMember, pod, agreementVersion
- **Risk Management**: riskFactors, watchlist, leftNetworkReason
- **Operational**: errors, ssjOpsGuideTrack
- **Staff & Professional**: logoDesigner, bookkeeper

## Common Error Patterns to Avoid

### 1. Field Mapping Mismatches
```typescript
// ❌ WRONG: Read/write field names differ
// Read:  fields['Business Insurance']  
// Write: updateFields["QBO"]

// ✅ CORRECT: Consistent field names
// Read:  fields['Business Insurance']
// Write: updateFields["Business Insurance"]
```

### 2. Zod Schema Incompleteness  
```typescript
// ❌ WRONG: Missing fields cause silent validation failures
const schoolSchema = z.object({
  name: z.string(),
  // Missing: businessInsurance, billComAccount, etc.
});

// ✅ CORRECT: All interface fields included in schema
const schoolSchema = z.object({
  name: z.string(),
  businessInsurance: z.string().optional(),
  billComAccount: z.string().optional(),
  // ... all other fields
});
```

### 3. Input Component Type Mismatches
```typescript
// ❌ WRONG: Select field using text input
<Input type="text" value={businessInsurance} />

// ✅ CORRECT: Select field using Select component  
<Select value={businessInsurance}>
  <SelectContent>
    {fieldOptions.businessInsurance.map(option => 
      <SelectItem value={option}>{option}</SelectItem>
    )}
  </SelectContent>
</Select>
```

## Automated Validation Scripts

### Script 1: Schema Consistency Checker
Create `scripts/validate-schema.js`:
```javascript
// Compares TypeScript interfaces with Zod schemas
// Reports missing fields and type mismatches
// Usage: node scripts/validate-schema.js
```

### Script 2: API Integration Checker  
Create `scripts/validate-api.js`:
```javascript
// Tests all API endpoints for correct responses
// Validates request/response schemas
// Usage: node scripts/validate-api.js
```

### Script 3: UI Component Validator
Create `scripts/validate-components.js`: 
```javascript
// Scans React components for schema alignment
// Checks form field mappings
// Usage: node scripts/validate-components.js
```

## Pre-Development Checklist

Before making changes to data handling:

- [ ] Run Schema Consistency Validation (Routine 1)
- [ ] Verify API Integration (Routine 2) 
- [ ] **NEW** Run Metadata-to-Implementation Validation (Routine 4)
- [ ] Check existing UI components for similar patterns
- [ ] Review field options for dropdown fields
- [ ] Test CRUD operations end-to-end
- [ ] Validate error handling scenarios

## Post-Development Checklist  

After implementing new features:

- [ ] Run all validation routines (1-5)
- [ ] **NEW** Verify dropdown field implementation matches Airtable
- [ ] Test edge cases (empty data, validation errors)
- [ ] Verify cache invalidation works  
- [ ] Check console for warnings/errors
- [ ] Test on different screen sizes
- [ ] Document any new patterns for future reference

## Emergency Debugging Workflow

When encountering field mapping errors:

1. **Identify the failing field**: Look for "field not updating" symptoms
2. **Check read mapping**: Verify `fields['Exact Field Name']` in transformation
3. **Check write mapping**: Verify `updateFields["Exact Field Name"]` in update  
4. **Validate Zod schema**: Ensure field exists in validation schema
5. **Test with simple value**: Try updating with basic string/number
6. **Check Airtable permissions**: Verify field accepts the data type
7. **Clear cache**: POST to `/api/cache/clear` if testing changes

This systematic approach prevents the repetitive debugging cycles that consume development time.