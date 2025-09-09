#!/usr/bin/env node
require('dotenv').config();

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
  console.error('❌ Please set AIRTABLE_API_KEY and AIRTABLE_BASE_ID in your .env file');
  process.exit(1);
}

// Extract field mappings from current schema.ts to see what we're actually importing
const { readFileSync } = require('fs');
const { join } = require('path');

function extractFieldMappingsFromSchema() {
  console.log('📖 Reading current schema.ts to extract field mappings...');
  
  try {
    const schemaPath = join(process.cwd(), 'shared', 'schema.ts');
    const schemaContent = readFileSync(schemaPath, 'utf8');
    
    // Find all field mapping constants (e.g., SCHOOLS_FIELDS, EDUCATORS_FIELDS, etc.)
    const fieldMappingRegex = /export const ([A-Z_]+_FIELDS) = \{([^}]+)\}/g;
    const fieldMappings = new Map();
    
    let match;
    while ((match = fieldMappingRegex.exec(schemaContent)) !== null) {
      const constName = match[1];
      const fieldsBlock = match[2];
      
      // Extract table name from constant name (e.g., SCHOOLS_FIELDS -> Schools)
      let tableName = constName.replace('_FIELDS', '').replace(/^_/, '');
      
      // Convert back to table name format
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

async function fetchMetadataRecords() {
  console.log('🔍 Fetching metadata records...');
  
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
    
    console.log(`✅ Found ${allRecords.length} total metadata records`);
    return allRecords;
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

async function markUnusedFieldsFalse() {
  console.log('🚀 Marking unused fields as false...');
  
  // Get field mappings from current schema
  const fieldMappings = extractFieldMappingsFromSchema();
  
  // Get all metadata records
  const metadataRecords = await fetchMetadataRecords();
  
  let updatedCount = 0;
  let alreadySetCount = 0;
  let nullCount = 0;
  
  // Find records that are null and check if they should be false
  for (const record of metadataRecords) {
    const fields = record.fields;
    const tableName = fields['Table Name'];
    const fieldName = fields['Field Name'];
    const includeInWFTLS = fields['Include in WFTLS'];
    
    // Only process null records
    if (includeInWFTLS !== null && includeInWFTLS !== undefined) {
      alreadySetCount++;
      continue;
    }
    
    nullCount++;
    
    // Check if this field is in our current schema
    const tableFields = fieldMappings.get(tableName);
    const isFieldUsed = tableFields && tableFields.has(fieldName);
    
    if (!isFieldUsed) {
      // This field is not in our current schema, mark it as false
      console.log(`❌ Marking ${tableName}.${fieldName} as false (not in current schema)`);
      
      const result = await updateMetadataRecord(record.id, {
        'Include in WFTLS': 'false'
      });
      
      if (result) {
        updatedCount++;
      }
      
      // Add small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 30));
    } else {
      console.log(`✅ ${tableName}.${fieldName} is used in schema - leaving null for manual review`);
    }
  }
  
  console.log(`\n📊 Results:`);
  console.log(`   ✅ Already set (true/false): ${alreadySetCount} records`);
  console.log(`   ❓ Found null: ${nullCount} records`);
  console.log(`   ❌ Marked as false: ${updatedCount} records`);
  console.log(`   🔍 Remaining null for review: ${nullCount - updatedCount} records`);
}

markUnusedFieldsFalse().catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});