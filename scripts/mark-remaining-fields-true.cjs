#!/usr/bin/env node
require('dotenv').config();

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
  console.error('❌ Please set AIRTABLE_API_KEY and AIRTABLE_BASE_ID in your .env file');
  process.exit(1);
}

// Use the SAME field name conversion as the existing schema generator
function generateSchemaFieldName(originalName) {
  return originalName.replace(/[^a-zA-Z0-9_$]/g, '_').replace(/^[0-9]/, '_$&');
}

// Extract field mappings from current schema.ts to see what we're actually importing
const { readFileSync } = require('fs');
const { join } = require('path');

function extractFieldMappingsFromSchema() {
  console.log('📖 Reading current schema.ts to extract field mappings...');
  
  try {
    const schemaPath = join(process.cwd(), 'shared', 'schema.ts');
    const schemaContent = readFileSync(schemaPath, 'utf8');
    
    // Find all field mapping constants
    const fieldMappingRegex = /export const ([A-Z_]+_FIELDS) = \{([^}]+)\}/g;
    const fieldMappings = new Map();
    
    let match;
    while ((match = fieldMappingRegex.exec(schemaContent)) !== null) {
      const constName = match[1];
      const fieldsBlock = match[2];
      
      // Convert constant name to table name
      let tableName = constName.replace('_FIELDS', '').replace(/^_/, '');
      if (tableName === '990S') {
        tableName = '990s';
      } else {
        tableName = tableName.split('_').map((word, index) => {
          if (index === 0) {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
          }
          return word.toLowerCase();
        }).join(' ');
      }
      
      // Handle special cases
      if (tableName === 'Educators x schools') tableName = 'Educators x Schools';
      if (tableName === 'Ssj typeforms start a school') tableName = 'SSJ Typeforms: Start a School';
      if (tableName === 'Ssj fillout forms') tableName = 'SSJ Fillout Forms';
      if (tableName === 'Governance docs') tableName = 'Governance docs';
      if (tableName === 'Qbo school codes') tableName = 'QBO School Codes';
      if (tableName === 'Ages grades') tableName = 'Ages-Grades';
      if (tableName === 'Email addresses') tableName = 'Email Addresses';
      if (tableName === 'Partners copy') tableName = 'Partners copy';
      
      // Extract field names from the mapping
      const fieldNameRegex = /(\w+):\s*"([^"]+)"/g;
      const fields = new Set();
      
      let fieldMatch;
      while ((fieldMatch = fieldNameRegex.exec(fieldsBlock)) !== null) {
        const airtableFieldName = fieldMatch[2];
        fields.add(airtableFieldName);
      }
      
      fieldMappings.set(tableName, fields);
      console.log(`✅ Found ${fields.size} fields for ${tableName}`);
    }
    
    console.log(`📊 Extracted field mappings for ${fieldMappings.size} tables`);
    return fieldMappings;
  } catch (error) {
    console.error('❌ Error reading schema.ts:', error);
    process.exit(1);
  }
}

async function fetchUnpopulatedRecords() {
  console.log('🔍 Fetching unpopulated metadata records...');
  
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
        throw new Error(`Failed to fetch Metadata table: ${response.statusText}`);
      }

      const data = await response.json();
      allRecords = allRecords.concat(data.records);
      offset = data.offset;
      
      if (offset) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } while (offset);
    
    // Filter for unpopulated records
    const unpopulated = allRecords.filter(record => 
      record.fields['Include in WFTLS'] === null || record.fields['Include in WFTLS'] === undefined
    );
    
    console.log(`✅ Found ${unpopulated.length} unpopulated records`);
    return unpopulated;
  } catch (error) {
    console.error('❌ Error fetching Metadata table:', error);
    process.exit(1);
  }
}

async function updateMetadataRecord(recordId, updates) {
  try {
    const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Metadata/${recordId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fields: updates
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Failed to update record ${recordId}: ${response.status} ${response.statusText}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`❌ Error updating record ${recordId}:`, error.message);
    return null;
  }
}

// Generate the other metadata fields using the same logic as the original populate script
function generateFieldName(originalName, tableName) {
  return originalName
    .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
    .split(/\s+/) // Split on whitespace
    .map((word, index) => {
      if (index === 0) return word.toLowerCase();
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join('');
}

function generateDisplayName(originalName, tableName) {
  return originalName
    .replace(/[_]{2,}/g, ' ') // Replace multiple underscores with space
    .replace(/_/g, ' ') // Replace underscores with spaces
    .trim();
}

// Common zod type mappings based on Airtable field types
const ZOD_TYPE_MAPPING = {
  'singleLineText': 'string',
  'multilineText': 'string', 
  'richText': 'string',
  'email': 'email',
  'url': 'url',
  'phoneNumber': 'string',
  'number': 'number',
  'currency': 'number',
  'percent': 'number',
  'rating': 'number',
  'checkbox': 'boolean',
  'date': 'string',
  'dateTime': 'string',
  'singleSelect': 'string',
  'multipleSelects': 'array',
  'multipleRecordLinks': 'array',
  'multipleAttachments': 'array',
  'rollup': 'any',
  'lookup': 'any',
  'formula': 'any',
  'count': 'number',
  'createdTime': 'string',
  'lastModifiedTime': 'string',
  'createdBy': 'object',
  'lastModifiedBy': 'object',
  'autonumber': 'number'
};

function determineZodType(fieldType, fieldOptions = {}) {
  const baseType = ZOD_TYPE_MAPPING[fieldType] || 'string';
  
  if (fieldType === 'email') return 'email';
  if (fieldType === 'url') return 'url';
  if (fieldType === 'singleSelect' && fieldOptions.choices) return 'enum';
  if (fieldType === 'multipleSelects') return 'array';
  if (fieldType === 'multipleRecordLinks') return 'array';
  if (fieldType === 'multipleAttachments') return 'array';
  
  return baseType;
}

async function markRemainingFieldsTrue() {
  console.log('🚀 Marking remaining unpopulated fields as true (they are used in schema)...');
  
  // Get field mappings from current schema
  const fieldMappings = extractFieldMappingsFromSchema();
  
  // Get unpopulated metadata records
  const unpopulatedRecords = await fetchUnpopulatedRecords();
  
  let updatedCount = 0;
  let notFoundCount = 0;
  
  for (const record of unpopulatedRecords) {
    const fields = record.fields;
    const tableName = fields['Table Name'];
    const fieldName = fields['Field Name'];
    const fieldType = fields['Field Type'];
    
    let fieldOptions = {};
    try {
      fieldOptions = fields['Field Options'] ? JSON.parse(fields['Field Options']) : {};
    } catch (e) {
      // Field Options might be plain text, not JSON
      fieldOptions = {};
    }

    // Check if this field is in our current schema
    const tableFields = fieldMappings.get(tableName);
    const isFieldUsed = tableFields && tableFields.has(fieldName);
    
    if (isFieldUsed) {
      // This field IS in our current schema, mark it as true and populate other fields
      console.log(`✅ Marking ${tableName}.${fieldName} as true (used in current schema)`);
      
      // Generate the other metadata fields
      const wftlsFieldName = generateFieldName(fieldName, tableName);
      const displayName = generateDisplayName(fieldName, tableName);
      const zodType = determineZodType(fieldType, fieldOptions);
      
      const updates = {
        'Include in WFTLS': 'true',
        'Field Name in WFTLS': wftlsFieldName,
        'Display Name in WFTLS': displayName,
        'Is Required in WFTLS': false, // Default to false, can be manually adjusted
        'Zod Type': zodType
      };
      
      const result = await updateMetadataRecord(record.id, updates);
      if (result) {
        updatedCount++;
      }
      
      // Add small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 30));
    } else {
      console.log(`❓ ${tableName}.${fieldName} not found in schema - this shouldn't happen`);
      notFoundCount++;
    }
  }
  
  console.log(`\n📊 Results:`);
  console.log(`   ✅ Marked as true: ${updatedCount} records`);
  console.log(`   ❓ Not found in schema: ${notFoundCount} records`);
  console.log('   🎉 All unpopulated records should now be handled!');
}

markRemainingFieldsTrue().catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});