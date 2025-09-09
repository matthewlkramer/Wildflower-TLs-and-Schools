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

async function checkMetadataFields() {
  const records = await fetchMetadata();
  
  console.log('\n🔍 Checking for problematic field names...\n');
  
  const problems = [];
  
  for (const record of records) {
    const fields = record.fields;
    const includeInWFTLS = fields['Include in WFTLS'];
    
    // Only check fields marked as included
    if (includeInWFTLS !== 'true') continue;
    
    const tableName = fields['Table Name'];
    const fieldName = fields['Field Name'];
    const fieldNameInWFTLS = fields['Field Name in WFTLS'];
    
    // Check for missing or problematic field names
    if (!fieldNameInWFTLS || fieldNameInWFTLS.trim() === '') {
      problems.push({
        table: tableName,
        field: fieldName,
        issue: 'Missing Field Name in WFTLS',
        value: fieldNameInWFTLS
      });
    } else if (fieldNameInWFTLS.includes(' ')) {
      problems.push({
        table: tableName,
        field: fieldName,
        issue: 'Field Name in WFTLS contains spaces',
        value: fieldNameInWFTLS
      });
    } else if (/^[0-9]/.test(fieldNameInWFTLS)) {
      problems.push({
        table: tableName,
        field: fieldName,
        issue: 'Field Name in WFTLS starts with number',
        value: fieldNameInWFTLS
      });
    } else if (!/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(fieldNameInWFTLS)) {
      problems.push({
        table: tableName,
        field: fieldName,
        issue: 'Field Name in WFTLS contains invalid characters',
        value: fieldNameInWFTLS
      });
    }
  }
  
  if (problems.length > 0) {
    console.log(`❌ Found ${problems.length} problematic field names:\n`);
    
    // Group by issue type
    const byIssue = {};
    for (const p of problems) {
      if (!byIssue[p.issue]) {
        byIssue[p.issue] = [];
      }
      byIssue[p.issue].push(p);
    }
    
    for (const [issue, items] of Object.entries(byIssue)) {
      console.log(`\n${issue} (${items.length} fields):`);
      console.log('─'.repeat(50));
      
      for (let i = 0; i < Math.min(10, items.length); i++) {
        const item = items[i];
        console.log(`  ${item.table}.${item.field}`);
        console.log(`    Value: "${item.value}"`);
      }
      
      if (items.length > 10) {
        console.log(`  ... and ${items.length - 10} more`);
      }
    }
  } else {
    console.log('✅ All field names look valid!');
  }
  
  // Also check for fields that ARE included and show a sample
  console.log('\n📋 Sample of included fields with their WFTLS names:');
  console.log('─'.repeat(60));
  
  let count = 0;
  for (const record of records) {
    const fields = record.fields;
    if (fields['Include in WFTLS'] === 'true' && count < 20) {
      const tableName = fields['Table Name'];
      const fieldName = fields['Field Name'];
      const fieldNameInWFTLS = fields['Field Name in WFTLS'];
      
      console.log(`${tableName}.${fieldName}`);
      console.log(`  → "${fieldNameInWFTLS}"`);
      count++;
    }
  }
}

checkMetadataFields().catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});