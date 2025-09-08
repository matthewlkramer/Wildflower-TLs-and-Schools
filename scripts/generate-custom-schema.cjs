#!/usr/bin/env node
require('dotenv').config();
const { writeFileSync } = require('fs');
const { join } = require('path');

// Configuration
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const OUTPUT_DIR = join(process.cwd(), 'shared');
const OUTPUT_FILE = join(OUTPUT_DIR, 'unified-schema.ts');

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
};

// Only include tables that are actually used (not commented out in airtable-tables.ts)
const USED_TABLES = [
  'Schools',
  'Charters', 
  'Locations',
  'Educators',
  'Educators x Schools',
  'Grants',
  'Grants Advice Log',
  'Loans',
  'Governance docs',
  '990s',
  'Loan payments',
  'Events',
  'Event attendance',
  'Mailing lists',
  'Montessori Certs',
  'SSJ Typeforms: Start a School',
  'SSJ Fillout Forms',
  'Guides',
  'Guides Assignments',
  'School notes',
  'Educator notes',
  'Training Grants',
  'Public funding',
  'Action steps',
  'Event types',
  'QBO School Codes',
  'Montessori Cert Levels',
  'Montessori Certifiers',
  'Montessori Certifiers - old list',
  'Race and Ethnicity',
  'Board Service',
  'Lead Routing and Templates',
  'States Aliases',
  'Membership termination steps',
  'Membership termination steps and dates',
  'Cohorts',
  'Marketing sources mapping',
  'Marketing source options',
  'Annual enrollment and demographics',
  'Charter roles',
  'Charter authorizers and contacts',
  'Reports and submissions',
  'Assessments',
  'Assessment data',
  'Charter applications',
  'Ages-Grades',
  'Supabase join 990 with school',
  'Email Addresses',
  'Partners copy',
];

function mapAirtableTypeToTS(fieldType, fieldOptions = {}) {
  switch (fieldType) {
    case 'singleLineText':
    case 'multilineText':
    case 'richText':
    case 'email':
    case 'url':
    case 'phoneNumber':
      return 'string';
    
    case 'number':
    case 'currency':
    case 'percent':
    case 'rating':
      return 'number';
    
    case 'checkbox':
      return 'boolean';
    
    case 'date':
    case 'dateTime':
      return 'string'; // ISO date strings
    
    case 'singleSelect':
      if (fieldOptions.choices && fieldOptions.choices.length > 0) {
        const choices = fieldOptions.choices.map(choice => `'${choice.name.replace(/'/g, "\\'")}'`).join(' | ');
        return choices;
      }
      return 'string';
    
    case 'multipleSelects':
      if (fieldOptions.choices && fieldOptions.choices.length > 0) {
        const choices = fieldOptions.choices.map(choice => `'${choice.name.replace(/'/g, "\\'")}'`).join(' | ');
        return `(${choices})[]`;
      }
      return 'string[]';
    
    case 'multipleRecordLinks':
      return 'string[]'; // Array of record IDs
    
    case 'multipleAttachments':
      return 'Array<{ id: string; filename: string; url: string; type: string; size: number }>';
    
    case 'rollup':
    case 'lookup':
      return 'any'; // These depend on the source field
    
    case 'formula':
      return 'string | number | boolean'; // Formulas can return various types
    
    case 'count':
      return 'number';
    
    case 'createdTime':
    case 'lastModifiedTime':
      return 'string';
    
    case 'createdBy':
    case 'lastModifiedBy':
      return '{ id: string; name: string; email: string }';
    
    case 'autonumber':
      return 'number';
    
    default:
      console.warn(`⚠️  Unknown field type: ${fieldType}`);
      return 'any';
  }
}

async function generateCustomSchema() {
  console.log('🚀 Generating custom unified schema from Airtable...');
  console.log(`📋 Base ID: ${AIRTABLE_BASE_ID}`);
  
  try {
    // Get base schema
    const response = await fetch(`https://api.airtable.com/v0/meta/bases/${AIRTABLE_BASE_ID}/tables`, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch schema: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`✅ Fetched schema for ${data.tables.length} tables`);

    // Generate TypeScript interfaces
    let schemaContent = `// Generated unified schema from Airtable
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

// Generated Field Mappings (will be populated during generation)
// This will be replaced with actual field mappings

// Generated Table Interfaces
`;

    // Generate interfaces for used tables first
    const processedTables = new Set();
    
    for (const tableName of USED_TABLES) {
      const table = data.tables.find(t => t.name === tableName);
      if (!table) {
        console.warn(`⚠️  Used table "${tableName}" not found`);
        continue;
      }
      
      const typeName = TABLE_TYPE_MAPPING[tableName] || 
                       tableName.replace(/\s+/g, '')
                                .replace(/[^a-zA-Z0-9_$]/g, '_')
                                .replace(/^[0-9]/, '_$&')
                                .replace(/__+/g, '_');
      console.log(`📝 Generating interface for ${typeName} (${table.fields.length} fields)`);
      
      schemaContent += `\n// ${tableName} table\n`;
      schemaContent += `export interface ${typeName} extends BaseRecord {\n`;
      
      // Generate fields
      for (const field of table.fields) {
        const fieldName = field.name.replace(/[^a-zA-Z0-9_$]/g, '_').replace(/^[0-9]/, '_$&');
        const fieldType = mapAirtableTypeToTS(field.type, field.options);
        
        // Make most fields optional since Airtable data can be sparse
        const optional = field.type !== 'autonumber' && fieldName !== 'id';
        
        schemaContent += `  ${fieldName}${optional ? '?' : ''}: ${fieldType};\n`;
      }
      
      schemaContent += `}\n`;
      processedTables.add(tableName);
    }

    // Only process the explicitly used tables - no automatic discovery

    // Add export of table mapping for runtime use
    schemaContent += `\n// Table name to type mapping\n`;
    schemaContent += `export const TABLE_TYPE_MAPPING = ${JSON.stringify(TABLE_TYPE_MAPPING, null, 2)} as const;\n`;
    
    schemaContent += `\n// All generated table types\n`;
    schemaContent += `export type AirtableRecord = \n`;
    const exportedTypes = Array.from(processedTables)
      .map(name => TABLE_TYPE_MAPPING[name] || 
                   name.replace(/\s+/g, '')
                       .replace(/[^a-zA-Z0-9_$]/g, '_')
                       .replace(/^[0-9]/, '_$&')
                       .replace(/__+/g, '_'))
      .filter(Boolean);
    schemaContent += exportedTypes.map(type => `  | ${type}`).join('\n');
    schemaContent += ';\n';

    // Generate field mappings and replace the placeholder
    let fieldMappings = '\n// Generated Field Mappings for Transformers\n';
    
    for (const table of data.tables) {
      if (!processedTables.has(table.name)) continue;
      
      let constName = table.name.toUpperCase()
        .replace(/\s+/g, '_')
        .replace(/[^A-Z0-9_]/g, '_')
        .replace(/__+/g, '_') + '_FIELDS';
      
      // Fix names that start with numbers (invalid JavaScript identifiers)
      if (/^[0-9]/.test(constName)) {
        constName = '_' + constName;
      }
      
      fieldMappings += `\nexport const ${constName} = {\n`;
      
      // Include the same fields we used for the interface (limited to 50)
      const fieldsToProcess = table.fields.slice(0, 50);
      
      for (const field of fieldsToProcess) {
        const key = field.name.replace(/[^a-zA-Z0-9_]/g, '_').replace(/^[0-9]/, '_$&');
        fieldMappings += `  ${key}: "${field.name}",\n`;
      }
      
      fieldMappings += `} as const;\n`;
    }
    
    // Replace the placeholder with actual field mappings
    schemaContent = schemaContent.replace(
      '// Generated Field Mappings (will be populated during generation)\n// This will be replaced with actual field mappings\n',
      fieldMappings
    );

    // Write the schema file
    writeFileSync(OUTPUT_FILE, schemaContent);

    console.log(`📁 Custom schema written to: ${OUTPUT_FILE}`);
    console.log(`🎯 Generated ${processedTables.size} interfaces from ${data.tables.length} tables`);
    console.log('✨ Next steps:');
    console.log('  1. Review the generated types');
    console.log('  2. Update imports across the codebase');
    console.log('  3. Test the unified schema');

    return true;
  } catch (error) {
    console.error('❌ Failed to generate custom schema:', error);
    return false;
  }
}

// Run the generator
generateCustomSchema()
  .then(success => {
    if (success) {
      console.log('✨ Custom schema generation completed successfully!');
      process.exit(0);
    } else {
      console.error('💥 Custom schema generation failed!');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('💥 Unexpected error:', error);
    process.exit(1);
  });