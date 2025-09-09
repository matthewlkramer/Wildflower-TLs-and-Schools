#!/usr/bin/env node
require('dotenv').config();
const { readFileSync } = require('fs');
const { join } = require('path');

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

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

function extractFieldMappingsFromSchema() {
  console.log('📖 Reading current schema.ts...');
  
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
      if (tableName === 'Qbo school codes') tableName = 'QBO School Codes';
      if (tableName === 'Ages grades') tableName = 'Ages-Grades';
      if (tableName === 'Email addresses') tableName = 'Email Addresses';
      if (tableName === 'Partners copy') tableName = 'Partners copy';
      
      // Extract both the field mappings and the raw field names
      const fieldNameRegex = /(\w+):\s*"([^"]+)"/g;
      const fields = new Map(); // camelCase -> original name
      
      let fieldMatch;
      while ((fieldMatch = fieldNameRegex.exec(fieldsBlock)) !== null) {
        const camelCaseName = fieldMatch[1];
        const originalName = fieldMatch[2];
        fields.set(camelCaseName, originalName);
      }
      
      fieldMappings.set(tableName, fields);
    }
    
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
    console.error('❌ Error fetching metadata:', error);
    process.exit(1);
  }
}

async function debugFieldMatching() {
  console.log('🔍 Debugging field matching...');
  
  const fieldMappings = extractFieldMappingsFromSchema();
  const unpopulatedRecords = await fetchUnpopulatedRecords();
  
  console.log('\n📊 Field Mapping Debug Analysis:');
  console.log('=================================\n');
  
  // Group by field type to see patterns
  const byFieldType = new Map();
  
  for (const record of unpopulatedRecords.slice(0, 30)) { // First 30 for analysis
    const fields = record.fields;
    const tableName = fields['Table Name'];
    const fieldName = fields['Field Name'];
    const fieldType = fields['Field Type'];
    
    if (!byFieldType.has(fieldType)) {
      byFieldType.set(fieldType, []);
    }
    
    // Generate what we think the camelCase name should be
    const generatedCamelCase = generateFieldName(fieldName, tableName);
    
    // Check if this table exists in our schema
    const tableFields = fieldMappings.get(tableName);
    const tableExists = tableFields !== undefined;
    
    // If table exists, check if field exists (either by camelCase key or by original value)
    let fieldFoundByCamelCase = false;
    let fieldFoundByOriginal = false;
    let actualCamelCaseInSchema = null;
    
    if (tableExists) {
      fieldFoundByCamelCase = tableFields.has(generatedCamelCase);
      
      // Check if the original field name appears as a value in the mapping
      for (const [camelCase, originalName] of tableFields.entries()) {
        if (originalName === fieldName) {
          fieldFoundByOriginal = true;
          actualCamelCaseInSchema = camelCase;
          break;
        }
      }
    }
    
    byFieldType.get(fieldType).push({
      tableName,
      fieldName,
      generatedCamelCase,
      actualCamelCaseInSchema,
      tableExists,
      fieldFoundByCamelCase,
      fieldFoundByOriginal
    });
  }
  
  // Analyze each field type
  for (const [fieldType, records] of byFieldType.entries()) {
    console.log(`\n🔍 Field Type: ${fieldType} (${records.length} examples)`);
    console.log('─'.repeat(50));
    
    for (let i = 0; i < Math.min(5, records.length); i++) {
      const r = records[i];
      console.log(`\n  📝 ${r.tableName}.${r.fieldName}`);
      console.log(`     Generated camelCase: "${r.generatedCamelCase}"`);
      console.log(`     Table exists in schema: ${r.tableExists}`);
      console.log(`     Field found by camelCase: ${r.fieldFoundByCamelCase}`);
      console.log(`     Field found by original name: ${r.fieldFoundByOriginal}`);
      if (r.actualCamelCaseInSchema) {
        console.log(`     Actual camelCase in schema: "${r.actualCamelCaseInSchema}"`);
        console.log(`     Difference: Generated="${r.generatedCamelCase}" vs Actual="${r.actualCamelCaseInSchema}"`);
      }
    }
    
    if (records.length > 5) {
      console.log(`     ... and ${records.length - 5} more examples`);
    }
  }
  
  // Show some actual schema field mappings for comparison
  console.log('\n\n📋 Sample Schema Field Mappings:');
  console.log('=================================\n');
  
  let count = 0;
  for (const [tableName, fields] of fieldMappings.entries()) {
    if (count >= 3) break;
    console.log(`${tableName}:`);
    let fieldCount = 0;
    for (const [camelCase, original] of fields.entries()) {
      if (fieldCount >= 5) {
        console.log(`  ... and ${fields.size - 5} more fields`);
        break;
      }
      console.log(`  ${camelCase}: "${original}"`);
      fieldCount++;
    }
    console.log('');
    count++;
  }
}

debugFieldMatching().catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});