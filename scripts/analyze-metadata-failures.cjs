#!/usr/bin/env node
require('dotenv').config();

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
  console.error('❌ Please set AIRTABLE_API_KEY and AIRTABLE_BASE_ID in your .env file');
  process.exit(1);
}

async function fetchMetadataRecords() {
  console.log('🔍 Fetching all metadata records...');
  
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
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    } while (offset);
    
    console.log(`✅ Found ${allRecords.length} total metadata records`);
    return allRecords;
  } catch (error) {
    console.error('❌ Error fetching Metadata table:', error);
    process.exit(1);
  }
}

async function analyzeFailures() {
  const records = await fetchMetadataRecords();
  
  let populated = 0;
  let unpopulated = 0;
  let unpopulatedRecords = [];
  
  console.log('\n📊 Analysis Results:');
  console.log('==================');
  
  for (const record of records) {
    const fields = record.fields;
    const hasWFTLSData = fields['Include in WFTLS'] !== undefined;
    
    if (hasWFTLSData) {
      populated++;
    } else {
      unpopulated++;
      unpopulatedRecords.push({
        id: record.id,
        tableName: fields['Table Name'],
        fieldName: fields['Field Name'],
        fieldType: fields['Field Type']
      });
    }
  }
  
  console.log(`📈 Populated records: ${populated}`);
  console.log(`📉 Unpopulated records: ${unpopulated}`);
  console.log(`📊 Total records: ${records.length}`);
  
  if (unpopulatedRecords.length > 0) {
    console.log('\n❌ Unpopulated Records (first 20):');
    console.log('==================================');
    
    for (let i = 0; i < Math.min(20, unpopulatedRecords.length); i++) {
      const record = unpopulatedRecords[i];
      console.log(`${i + 1}. ${record.tableName}.${record.fieldName} (${record.fieldType}) - ID: ${record.id}`);
    }
    
    if (unpopulatedRecords.length > 20) {
      console.log(`... and ${unpopulatedRecords.length - 20} more`);
    }
    
    // Group by table to see patterns
    console.log('\n📋 Unpopulated Records by Table:');
    console.log('==============================');
    
    const byTable = {};
    unpopulatedRecords.forEach(record => {
      if (!byTable[record.tableName]) {
        byTable[record.tableName] = 0;
      }
      byTable[record.tableName]++;
    });
    
    Object.entries(byTable)
      .sort((a, b) => b[1] - a[1])
      .forEach(([tableName, count]) => {
        console.log(`${tableName}: ${count} unpopulated fields`);
      });
  }
}

analyzeFailures().catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});