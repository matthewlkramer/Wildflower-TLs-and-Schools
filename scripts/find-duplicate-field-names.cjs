#!/usr/bin/env node
require('dotenv').config();

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

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

async function findDuplicateFieldNames() {
  const records = await fetchMetadata();
  
  console.log('\n🔍 Checking for duplicate Field Names in WFTLS within tables...\n');
  
  // Group by table name
  const tableFields = new Map();
  
  for (const record of records) {
    const fields = record.fields;
    const tableName = fields['Table Name'];
    const fieldName = fields['Field Name'];
    const includeInWFTLS = fields['Include in WFTLS'];
    const fieldNameInWFTLS = fields['Field Name in WFTLS'];
    
    // Only process included fields
    if (includeInWFTLS !== 'true' || !tableName || !fieldName) continue;
    
    if (!tableFields.has(tableName)) {
      tableFields.set(tableName, []);
    }
    
    tableFields.get(tableName).push({
      recordId: record.id,
      originalField: fieldName,
      wftlsField: fieldNameInWFTLS || 'MISSING',
    });
  }
  
  // Find duplicates within each table
  const duplicates = [];
  
  for (const [tableName, fields] of tableFields.entries()) {
    const wftlsFieldCount = new Map();
    
    // Count occurrences of each WFTLS field name
    for (const field of fields) {
      const count = wftlsFieldCount.get(field.wftlsField) || 0;
      wftlsFieldCount.set(field.wftlsField, count + 1);
    }
    
    // Find fields that appear more than once
    for (const [wftlsField, count] of wftlsFieldCount.entries()) {
      if (count > 1) {
        const duplicateFields = fields.filter(f => f.wftlsField === wftlsField);
        duplicates.push({
          tableName,
          wftlsField,
          count,
          fields: duplicateFields
        });
      }
    }
  }
  
  if (duplicates.length > 0) {
    console.log(`❌ Found ${duplicates.length} duplicate WFTLS field names:\n`);
    
    for (const dup of duplicates) {
      console.log(`Table: ${dup.tableName}`);
      console.log(`WFTLS Field: "${dup.wftlsField}" (${dup.count} occurrences)`);
      console.log(`Original fields:`);
      
      for (const field of dup.fields) {
        console.log(`  - "${field.originalField}" (Record ID: ${field.recordId})`);
      }
      console.log('');
    }
    
    console.log('💡 To fix: Update the "Field Name in WFTLS" column in Airtable to make each field unique within its table.');
    console.log('   For example: "lastModified" → "lastModified1", "lastModified2", etc.');
    
  } else {
    console.log('✅ No duplicate WFTLS field names found!');
  }
}

findDuplicateFieldNames().catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});