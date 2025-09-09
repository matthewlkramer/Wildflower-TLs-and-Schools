#!/usr/bin/env node
require('dotenv').config();
const { writeFileSync } = require('fs');
const { join } = require('path');

// Configuration
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const OUTPUT_DIR = join(process.cwd(), 'shared');
const OUTPUT_FILE = join(OUTPUT_DIR, 'schema.ts');

if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
  console.error('❌ Please set AIRTABLE_API_KEY and AIRTABLE_BASE_ID in your .env file');
  process.exit(1);
}

// Map of table names to our desired TypeScript types
const TABLE_TYPE_MAPPING = {
  'Schools': 'School',
  'Educators': 'Educator', 
  'Locations': 'Location',
  'Educators x Schools': 'EducatorSchoolAssociation',
  'Governance docs': 'GovernanceDocument',
  '990s': 'Charter990',
  'School notes': 'CharterNote',
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

// Map zod types to TypeScript types
function mapZodTypeToTS(zodType, fieldOptions = {}) {
  switch (zodType) {
    case 'string':
      return 'string';
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'email':
      return 'string';
    case 'url':
      return 'string';
    case 'enum':
      // For enum types, we'll use string for now since we don't have access to the actual choices
      return 'string';
    case 'array':
      return 'string[]';
    case 'object':
      return '{ id: string; name: string; email: string }';
    case 'any':
      return 'any';
    default:
      return 'any';
  }
}

async function fetchMetadataRecords() {
  console.log('🔍 Fetching metadata from Airtable...');
  
  try {
    const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Metadata`, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch metadata: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`✅ Found ${data.records.length} metadata records`);
    return data.records;
  } catch (error) {
    console.error('❌ Error fetching metadata:', error);
    process.exit(1);
  }
}

async function generateSchemaFromMetadata() {
  console.log('🚀 Generating schema from metadata table...');
  console.log(`📋 Base ID: ${AIRTABLE_BASE_ID}`);
  
  const metadataRecords = await fetchMetadataRecords();
  
  // Group records by table name and filter for WFTLS inclusion
  const tableFields = new Map();
  
  for (const record of metadataRecords) {
    const fields = record.fields;
    const tableName = fields['Table Name'];
    const fieldName = fields['Field Name'];
    const includeInWFTLS = fields['Include in WFTLS'];
    const fieldNameInWFTLS = fields['Field Name in WFTLS'];
    const displayNameInWFTLS = fields['Display Name in WFTLS'];
    const isRequiredInWFTLS = fields['Is Required in WFTLS'];
    const zodType = fields['Zod Type'];
    
    if (!includeInWFTLS || !tableName || !fieldName) continue;
    
    if (!tableFields.has(tableName)) {
      tableFields.set(tableName, []);
    }
    
    tableFields.get(tableName).push({
      originalName: fieldName,
      fieldName: fieldNameInWFTLS || fieldName,
      displayName: displayNameInWFTLS || fieldName,
      isRequired: isRequiredInWFTLS || false,
      zodType: zodType || 'string',
    });
  }
  
  console.log(`✅ Found ${tableFields.size} tables with metadata`);
  
  // Generate TypeScript schema
  let schemaContent = `// Generated schema from Airtable Metadata table
// Generated on ${new Date().toISOString()}
// Base ID: ${AIRTABLE_BASE_ID}

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

  // Generate field mappings
  for (const [tableName, fields] of tableFields.entries()) {
    let constName = tableName.toUpperCase()
      .replace(/\s+/g, '_')
      .replace(/[^A-Z0-9_]/g, '_')
      .replace(/__+/g, '_') + '_FIELDS';
    
    // Fix names that start with numbers (invalid JavaScript identifiers)
    if (/^[0-9]/.test(constName)) {
      constName = '_' + constName;
    }
    
    schemaContent += `\nexport const ${constName} = {\n`;
    
    for (const field of fields) {
      const key = field.fieldName;
      schemaContent += `  ${key}: "${field.originalName}",\n`;
    }
    
    schemaContent += `} as const;\n`;
  }

  // Generate TypeScript interfaces
  schemaContent += `\n// Generated Table Interfaces\n`;
  
  const processedTypes = [];
  
  for (const [tableName, fields] of tableFields.entries()) {
    const typeName = TABLE_TYPE_MAPPING[tableName] || 
                     tableName.replace(/\s+/g, '')
                              .replace(/[^a-zA-Z0-9_$]/g, '_')
                              .replace(/^[0-9]/, '_$&')
                              .replace(/__+/g, '_');
    
    console.log(`📝 Generating interface for ${typeName} (${fields.length} fields)`);
    
    schemaContent += `\n// ${tableName} table\n`;
    schemaContent += `export interface ${typeName} extends BaseRecord {\n`;
    
    // Generate fields
    for (const field of fields) {
      const fieldType = mapZodTypeToTS(field.zodType);
      const optional = !field.isRequired;
      
      schemaContent += `  ${field.fieldName}${optional ? '?' : ''}: ${fieldType};\n`;
    }
    
    schemaContent += `}\n`;
    processedTypes.push(typeName);
  }

  // Add exports
  schemaContent += `\n// Table name to type mapping\n`;
  schemaContent += `export const TABLE_TYPE_MAPPING = ${JSON.stringify(TABLE_TYPE_MAPPING, null, 2)} as const;\n`;
  
  schemaContent += `\n// All generated table types\n`;
  schemaContent += `export type AirtableRecord = \n`;
  schemaContent += processedTypes.map(type => `  | ${type}`).join('\n');
  schemaContent += ';\n';

  // Add loan schema re-exports (keeping compatibility)
  schemaContent += `
// Loan-related re-exports for backwards compatibility
export type { Loan, LoanPayment } from './loan-schema';
`;

  // Write the schema file
  writeFileSync(OUTPUT_FILE, schemaContent);

  console.log(`📁 Schema written to: ${OUTPUT_FILE}`);
  console.log(`🎯 Generated ${processedTypes.length} interfaces from ${tableFields.size} tables`);
  console.log('✨ Metadata-driven schema generation complete!');
  
  return true;
}

// Run the generator
generateSchemaFromMetadata()
  .then(success => {
    if (success) {
      console.log('✨ Schema generation from metadata completed successfully!');
      process.exit(0);
    } else {
      console.error('💥 Schema generation from metadata failed!');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('💥 Unexpected error:', error);
    process.exit(1);
  });