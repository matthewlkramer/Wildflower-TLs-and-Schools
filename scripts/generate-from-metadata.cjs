#!/usr/bin/env node
require('dotenv').config();
const { writeFileSync } = require('fs');
const { join } = require('path');

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const OUTPUT_DIR = join(process.cwd(), 'shared');

if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
  console.error('❌ Please set AIRTABLE_API_KEY and AIRTABLE_BASE_ID in your .env file');
  process.exit(1);
}

// Map validation types to Zod validators
function getZodValidation(zodType, validationType) {
  let baseType;
  
  switch (zodType) {
    case 'string':
      baseType = 'z.string()';
      break;
    case 'number':
      baseType = 'z.number()';
      break;
    case 'boolean':
      baseType = 'z.boolean()';
      break;
    case 'email':
      return 'z.string().email()';
    case 'url':
      return 'z.string().url()';
    case 'array':
      baseType = 'z.array(z.string())';
      break;
    case 'object':
      baseType = 'z.object({ id: z.string(), name: z.string(), email: z.string() })';
      break;
    case 'enum':
      baseType = 'z.string()'; // Will be replaced with actual enum values if available
      break;
    case 'any':
    default:
      baseType = 'z.any()';
      break;
  }
  
  // Apply validation type modifiers
  if (validationType && zodType === 'string') {
    switch (validationType.toLowerCase()) {
      case 'phone':
      case 'phone number':
        return 'z.string().regex(/^[\\+]?[1-9]?\\d{1,14}$/, "Invalid phone number")';
      case 'date':
        return 'z.string().datetime().or(z.string().regex(/^\\d{4}-\\d{2}-\\d{2}$/, "Invalid date format"))';
      case 'datetime':
        return 'z.string().datetime()';
      case 'uuid':
        return 'z.string().uuid()';
      case 'slug':
        return 'z.string().regex(/^[a-z0-9-]+$/, "Invalid slug format")';
      default:
        return baseType;
    }
  }
  
  return baseType;
}

// Map table names to TypeScript interface names
function getTypeName(tableName) {
  const mapping = {
    'Schools': 'School',
    'Educators': 'Educator', 
    'Locations': 'Location',
    'Educators x Schools': 'EducatorSchoolAssociation',
    'Governance docs': 'GovernanceDocument',
    '990s': 'Charter990',
    'School notes': 'SchoolNote',
    'Charters': 'Charter',
    'Loans': 'Loan',
    'Loan payments': 'LoanPayment',
    'Events': 'Event',
    'Event attendance': 'EventAttendance',
    'Action steps': 'ActionStep',
    'Grants': 'Grant',
    'Grants Advice Log': 'GrantAdviceLog',
    'Mailing lists': 'MailingList',
    'Montessori Certs': 'MontessoriCert',
    'SSJ Typeforms: Start a School': 'SSJTypeform',
    'SSJ Fillout Forms': 'SSJFilloutForm',
    'Guides': 'Guide',
    'Guides Assignments': 'GuideAssignment',
    'Educator notes': 'EducatorNote',
    'Training Grants': 'TrainingGrant',
    'Public funding': 'PublicFunding',
    'Event types': 'EventType',
    'QBO School Codes': 'QBOSchoolCode',
    'Montessori Cert Levels': 'MontessoriCertLevel',
    'Montessori Certifiers': 'MontessoriCertifier',
    'Montessori Certifiers - old list': 'MontessoriCertifierOld',
    'Race and Ethnicity': 'RaceAndEthnicity',
    'Board Service': 'BoardService',
    'Lead Routing and Templates': 'LeadRoutingTemplate',
    'States Aliases': 'StateAlias',
    'Membership termination steps': 'MembershipTerminationStep',
    'Membership termination steps and dates': 'MembershipTerminationStepDate',
    'Cohorts': 'Cohort',
    'Marketing sources mapping': 'MarketingSourceMapping',
    'Marketing source options': 'MarketingSourceOption',
    'Annual enrollment and demographics': 'AnnualEnrollmentDemographic',
    'Charter roles': 'CharterRole',
    'Charter authorizers and contacts': 'CharterAuthorizerContact',
    'Reports and submissions': 'ReportSubmission',
    'Assessments': 'Assessment',
    'Assessment data': 'AssessmentData',
    'Charter applications': 'CharterApplication',
    'Ages-Grades': 'AgeGrade',
    'Supabase join 990 with school': 'Supabase990School',
    'Email Addresses': 'EmailAddress',
    'Partners copy': 'Partner',
  };
  
  return mapping[tableName] || tableName.replace(/\s+/g, '')
    .replace(/[^a-zA-Z0-9_$]/g, '_')
    .replace(/^[0-9]/, '_$&')
    .replace(/__+/g, '_');
}

// Map Zod types to TypeScript types
function mapZodTypeToTS(zodType, validationType) {
  switch (zodType) {
    case 'string':
    case 'email':
    case 'url':
      return 'string';
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'array':
      return 'string[]';
    case 'object':
      return '{ id: string; name: string; email: string }';
    case 'enum':
      return 'string'; // Will be replaced with actual enum if available
    case 'any':
    default:
      return 'any';
  }
}

async function fetchMetadata() {
  console.log('🔍 Fetching metadata from Airtable...');
  
  let allRecords = [];
  let offset = null;
  
  try {
    do {
      const url = new URL(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Metadata`);
      if (offset) {
        url.searchParams.set('offset', offset);
      }
      
      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch metadata: ${response.statusText}`);
      }

      const data = await response.json();
      allRecords = allRecords.concat(data.records);
      offset = data.offset;
      
      if (offset) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } while (offset);
    
    console.log(`✅ Found ${allRecords.length} metadata records`);
    return allRecords;
  } catch (error) {
    console.error('❌ Error fetching metadata:', error);
    process.exit(1);
  }
}

async function generateMetadataDrivenFiles() {
  console.log('🚀 Generating metadata-driven schema and storage files...');
  
  const metadataRecords = await fetchMetadata();
  
  // Group records by table name and filter for included fields
  const tableFields = new Map();
  const allIncludedFields = [];
  
  for (const record of metadataRecords) {
    const fields = record.fields;
    const tableName = fields['Table Name'];
    const fieldName = fields['Field Name'];
    const includeInWFTLS = fields['Include in WFTLS'];
    
    // Skip records with missing essential data
    if (!tableName || !fieldName) {
      console.log(`⚠️  Skipping record with missing data: Table="${tableName}", Field="${fieldName}"`);
      continue;
    }
    
    // Only process fields marked as true
    if (includeInWFTLS !== 'true') continue;
    
    const fieldInfo = {
      originalName: fieldName,
      fieldNameInWFTLS: fields['Field Name in WFTLS'] || fieldName,
      displayName: fields['Display Name in WFTLS'] || fieldName,
      isRequired: fields['Is Required in WFTLS'] === true,
      zodType: fields['Zod Type'] || 'string',
      validationType: fields['Validation type'] || null,
      fieldType: fields['Field Type'] || null,
      fieldOptions: fields['Field Options'] || null,
    };
    
    if (!tableFields.has(tableName)) {
      tableFields.set(tableName, []);
      console.log(`📝 Started processing table: ${tableName}`);
    } else {
      console.log(`📝 Adding field to existing table: ${tableName} (field: ${fieldInfo.fieldNameInWFTLS})`);
    }
    
    tableFields.get(tableName).push(fieldInfo);
    allIncludedFields.push({ tableName, ...fieldInfo });
  }
  
  console.log(`✅ Found ${tableFields.size} tables with ${allIncludedFields.length} included fields`);
  
  // Generate schema.ts
  await generateSchema(tableFields);
  
  // Generate generic storage
  await generateGenericStorage(tableFields);
  
  console.log('✨ Metadata-driven generation complete!');
}

async function generateSchema(tableFields) {
  console.log('📝 Generating schema.ts...');
  
  let schemaContent = `// Generated schema from Airtable Metadata table
// Generated on ${new Date().toISOString()}
// This file is auto-generated. Do not edit manually.

import { z } from 'zod';

// Base utility types
export interface BaseRecord {
  id: string;
  created: string;
  lastModified: string;
}

// Utility types for complex fields
export interface AirtableAttachment {
  id: string;
  filename: string;
  url: string;
  type: string;
  size: number;
}

export interface AirtableUser {
  id: string;
  name: string;
  email: string;
}

// Search and location interfaces
export interface SearchableRecord extends BaseRecord {
  searchTerms?: string[];
}

export interface LocationBased {
  latitude?: number;
  longitude?: number;
  address?: string;
  city?: string;
  state?: string;
}

// Utility functions
export function createBaseTransformer<T extends BaseRecord>(
  record: any,
  customFields: Partial<T>
): T {
  return {
    id: record.id,
    created: String(record.fields?.Created || record.fields?.['Created time'] || new Date().toISOString()),
    lastModified: String(record.fields?.['Last Modified'] || record.fields?.['Last modified'] || record.fields?.['Last modified time'] || new Date().toISOString()),
    ...customFields,
  } as T;
}

export function firstId(val: any): string | undefined {
  if (val === undefined || val === null || val === '') return undefined;
  if (Array.isArray(val)) return String(val[0] ?? '');
  return String(val);
}

export function toNumber(val: any): number | undefined {
  if (val === undefined || val === null || val === '') return undefined;
  const n = Number(val);
  return isNaN(n) ? undefined : n;
}

export function toStringArray(val: any): string[] | undefined {
  if (val === undefined || val === null || val === '') return undefined;
  if (Array.isArray(val)) return val.map((v) => String(v || ''));
  return [String(val)];
}

export function toYesBool(val: any): boolean {
  if (typeof val === 'boolean') return val;
  if (typeof val === 'string') return val.trim().toLowerCase() === 'yes';
  return Boolean(val);
}

export function firstAttachment(attachments: any): { filename?: string; url?: string } | undefined {
  if (!Array.isArray(attachments) || attachments.length === 0) return undefined;
  const a = attachments[0] || {};
  return { filename: a.filename, url: a.url };
}

export function createdAt(fields: any): string {
  return String(fields["Created"] || fields["Created time"] || new Date().toISOString());
}

export function updatedAt(fields: any): string {
  return String(fields["Last Modified"] || fields["Last modified"] || fields["Last modified time"] || new Date().toISOString());
}

// Generated Field Mappings
`;

  // Generate field mappings (ensure no duplicates)
  const processedTables = new Set();
  
  for (const [tableName, fields] of tableFields.entries()) {
    console.log(`🔄 Processing table for field mappings: "${tableName}" (${fields.length} fields)`);
    
    // Skip if we've already processed this table
    if (processedTables.has(tableName)) {
      console.log(`⚠️  Skipping duplicate table: ${tableName}`);
      continue;
    }
    
    processedTables.add(tableName);
    
    let constName = tableName.toUpperCase()
      .replace(/\s+/g, '_')
      .replace(/[^A-Z0-9_]/g, '_')
      .replace(/__+/g, '_') + '_FIELDS';
    
    // Fix names that start with numbers
    if (/^[0-9]/.test(constName)) {
      constName = '_' + constName;
    }
    
    schemaContent += `\nexport const ${constName} = {\n`;
    
    for (const field of fields) {
      // Ensure field name is a valid JavaScript identifier
      let fieldKey = field.fieldNameInWFTLS;
      if (/^[0-9]/.test(fieldKey)) {
        fieldKey = '_' + fieldKey;
      }
      schemaContent += `  ${fieldKey}: "${field.originalName}",\n`;
    }
    
    schemaContent += `} as const;\n`;
  }

  // Generate field options constants for singleSelect and multipleSelect fields
  schemaContent += `\n// Generated Field Options Constants\n`;
  
  const fieldOptionsMap = new Map(); // To track unique options by table and field
  
  for (const [tableName, fields] of tableFields.entries()) {
    for (const field of fields) {
      if ((field.fieldType === 'singleSelect' || field.fieldType === 'multipleSelect') && field.fieldOptions) {
        const tableKey = tableName.toUpperCase().replace(/\s+/g, '_').replace(/[^A-Z0-9_]/g, '_').replace(/__+/g, '_');
        const fieldKey = field.fieldNameInWFTLS.toUpperCase().replace(/[^A-Z0-9_]/g, '_');
        let constantName = `${tableKey}_OPTIONS_${fieldKey}`;
        
        // Handle names starting with numbers
        if (/^[0-9]/.test(constantName)) {
          constantName = '_' + constantName;
        }
        
        // Parse the options (comma-separated)
        const options = field.fieldOptions.split(',').map(opt => opt.trim()).filter(opt => opt.length > 0);
        
        if (options.length > 0) {
          const uniqueKey = `${tableName}:${field.fieldNameInWFTLS}`;
          if (!fieldOptionsMap.has(uniqueKey)) {
            fieldOptionsMap.set(uniqueKey, constantName);
            
            schemaContent += `export const ${constantName} = [\n`;
            options.forEach(option => {
              schemaContent += `  "${option}",\n`;
            });
            schemaContent += `] as const;\n\n`;
          }
        }
      }
    }
  }

  // Generate Zod schemas
  schemaContent += `// Generated Zod Validation Schemas\n`;
  
  const processedZodSchemas = new Set();
  
  for (const [tableName, fields] of tableFields.entries()) {
    // Skip if we've already processed this table's schema
    if (processedZodSchemas.has(tableName)) {
      continue;
    }
    
    processedZodSchemas.add(tableName);
    
    const typeName = getTypeName(tableName);
    let schemaName = tableName.toUpperCase()
      .replace(/\s+/g, '_')
      .replace(/[^A-Z0-9_]/g, '_')
      .replace(/__+/g, '_') + '_SCHEMA';
    
    if (/^[0-9]/.test(schemaName)) {
      schemaName = '_' + schemaName;
    }
    
    schemaContent += `\nexport const ${schemaName} = z.object({\n`;
    schemaContent += `  id: z.string(),\n`;
    schemaContent += `  created: z.string(),\n`;
    schemaContent += `  lastModified: z.string(),\n`;
    
    for (const field of fields) {
      // Skip base record fields that are already added
      let fieldKey = field.fieldNameInWFTLS;
      if (/^[0-9]/.test(fieldKey)) {
        fieldKey = '_' + fieldKey;
      }
      
      // Skip if this is a base record field (already added above)
      if (fieldKey === 'id' || fieldKey === 'created' || fieldKey === 'lastModified') {
        continue;
      }
      
      const zodValidation = getZodValidation(field.zodType, field.validationType);
      const optional = field.isRequired ? '' : '.optional()';
      schemaContent += `  ${fieldKey}: ${zodValidation}${optional},\n`;
    }
    
    schemaContent += `});\n`;
  }

  // Generate TypeScript interfaces
  schemaContent += `\n// Generated Table Interfaces\n`;
  
  const processedTypes = [];
  const processedInterfaces = new Set();
  
  for (const [tableName, fields] of tableFields.entries()) {
    // Skip if we've already processed this table's interface
    if (processedInterfaces.has(tableName)) {
      continue;
    }
    
    processedInterfaces.add(tableName);
    
    const typeName = getTypeName(tableName);
    
    schemaContent += `\n// ${tableName} table\n`;
    schemaContent += `export interface ${typeName} extends BaseRecord {\n`;
    
    for (const field of fields) {
      // Skip base record fields that are already inherited
      let fieldKey = field.fieldNameInWFTLS;
      if (/^[0-9]/.test(fieldKey)) {
        fieldKey = '_' + fieldKey;
      }
      
      // Skip if this is a base record field (inherited from BaseRecord)
      if (fieldKey === 'id' || fieldKey === 'created' || fieldKey === 'lastModified') {
        continue;
      }
      
      const fieldType = mapZodTypeToTS(field.zodType, field.validationType);
      const optional = field.isRequired ? '' : '?';
      schemaContent += `  ${fieldKey}${optional}: ${fieldType};\n`;
    }
    
    schemaContent += `}\n`;
    processedTypes.push(typeName);
  }

  // Add table type mapping and union type
  schemaContent += `\n// Table name to type mapping\n`;
  const tableTypeMapping = {};
  for (const [tableName, fields] of tableFields.entries()) {
    tableTypeMapping[tableName] = getTypeName(tableName);
  }
  schemaContent += `export const TABLE_TYPE_MAPPING = ${JSON.stringify(tableTypeMapping, null, 2)} as const;\n`;
  
  schemaContent += `\n// All generated table types\n`;
  schemaContent += `export type AirtableRecord = \n`;
  schemaContent += processedTypes.map(type => `  | ${type}`).join('\n');
  schemaContent += ';\n';

  // Add loan schema re-exports for backwards compatibility
  schemaContent += `\n// Loan-related re-exports for backwards compatibility\nexport type { Loan, LoanPayment } from './loan-schema';\n`;

  // Write the schema file
  const schemaPath = join(OUTPUT_DIR, 'schema.ts');
  writeFileSync(schemaPath, schemaContent);
  
  console.log(`✅ Schema written to: ${schemaPath}`);
  console.log(`   📊 Generated ${processedTypes.length} interfaces`);
  console.log(`   📋 Generated ${tableFields.size} field mappings`);
  console.log(`   🔍 Generated ${tableFields.size} Zod validation schemas`);
}

async function generateGenericStorage(tableFields) {
  console.log('📝 Generating updated generic-storage.ts...');
  
  // Read existing generic-storage.ts to preserve the generic functions
  const { readFileSync } = require('fs');
  const existingPath = join(process.cwd(), 'server', 'generic-storage.ts');
  
  let existingContent = '';
  try {
    existingContent = readFileSync(existingPath, 'utf8');
  } catch (error) {
    console.log('   ℹ️  No existing generic-storage.ts found, creating new one');
  }
  
  let storageContent = `// Generated generic storage with metadata-driven table configuration
// Generated on ${new Date().toISOString()}
// This file is auto-generated. Do not edit manually.

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../shared/schema';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

const client = postgres(connectionString);
export const db = drizzle(client, { schema });

// Cache configuration
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const cache = new Map<string, { data: any; expires: number }>();

function getCacheKey(table: string, operation: string, params?: any): string {
  return \`\${table}:\${operation}:\${params ? JSON.stringify(params) : 'all'}\`;
}

function setCache(key: string, data: any): void {
  cache.set(key, { data, expires: Date.now() + CACHE_TTL });
}

function getCache(key: string): any {
  const cached = cache.get(key);
  if (cached && cached.expires > Date.now()) {
    return cached.data;
  }
  cache.delete(key);
  return null;
}

function invalidateCache(pattern: string): void {
  for (const key of cache.keys()) {
    if (key.startsWith(pattern)) {
      cache.delete(key);
    }
  }
}

// Generated table configuration from metadata
export const TABLE_CONFIG = {
`;

  // Generate table configs from metadata
  for (const [tableName, fields] of tableFields.entries()) {
    const typeName = getTypeName(tableName);
    let constName = tableName.toUpperCase()
      .replace(/\s+/g, '_')
      .replace(/[^A-Z0-9_]/g, '_')
      .replace(/__+/g, '_') + '_FIELDS';
    
    if (/^[0-9]/.test(constName)) {
      constName = '_' + constName;
    }
    
    storageContent += `  '${tableName}': {
    airtableTable: '${tableName}',
    fieldMapping: schema.${constName},
    transformer: (record: any): schema.${typeName} => schema.createBaseTransformer(record, {
      ${fields.slice(0, 5).map(field => 
        `${field.fieldNameInWFTLS}: record.fields?.['${field.originalName}']`
      ).join(',\n      ')},
      // Add more field transformations as needed
    }),
    cacheEnabled: true,
  },
`;
  }

  storageContent += `} as const;

// Generic CRUD operations
export async function getAll<T>(tableName: string): Promise<T[]> {
  const cacheKey = getCacheKey(tableName, 'getAll');
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const config = TABLE_CONFIG[tableName];
  if (!config) {
    throw new Error(\`Table configuration not found for: \${tableName}\`);
  }

  try {
    // Implement Airtable API call here
    const records = []; // Placeholder - implement actual Airtable API call
    const transformed = records.map(config.transformer);
    
    if (config.cacheEnabled) {
      setCache(cacheKey, transformed);
    }
    
    return transformed;
  } catch (error) {
    console.error(\`Error fetching from \${tableName}:\`, error);
    throw error;
  }
}

export async function getById<T>(tableName: string, id: string): Promise<T | null> {
  const cacheKey = getCacheKey(tableName, 'getById', id);
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const config = TABLE_CONFIG[tableName];
  if (!config) {
    throw new Error(\`Table configuration not found for: \${tableName}\`);
  }

  try {
    // Implement Airtable API call here
    const record = null; // Placeholder - implement actual Airtable API call
    if (!record) return null;
    
    const transformed = config.transformer(record);
    
    if (config.cacheEnabled) {
      setCache(cacheKey, transformed);
    }
    
    return transformed as T;
  } catch (error) {
    console.error(\`Error fetching \${id} from \${tableName}:\`, error);
    throw error;
  }
}

// Convenience methods for each table
`;

  // Generate convenience methods
  for (const [tableName, fields] of tableFields.entries()) {
    const methodName = tableName.toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[^a-zA-Z0-9]/g, '');
    const typeName = getTypeName(tableName);
    
    storageContent += `export const get${typeName}s = () => getAll<schema.${typeName}>('${tableName}');
export const get${typeName}ById = (id: string) => getById<schema.${typeName}>('${tableName}', id);
`;
  }

  // Write the storage file
  const storagePath = join(process.cwd(), 'server', 'generic-storage-metadata.ts');
  writeFileSync(storagePath, storageContent);
  
  console.log(`✅ Generic storage written to: ${storagePath}`);
  console.log(`   📊 Generated ${tableFields.size} table configurations`);
  console.log(`   🔧 Generated ${tableFields.size * 2} convenience methods`);
}

// Run the generator
generateMetadataDrivenFiles().catch(error => {
  console.error('💥 Generation failed:', error);
  process.exit(1);
});