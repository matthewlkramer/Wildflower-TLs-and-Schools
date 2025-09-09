#!/usr/bin/env node
require('dotenv').config();

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
  console.error('❌ Please set AIRTABLE_API_KEY and AIRTABLE_BASE_ID in your .env file');
  process.exit(1);
}

// Field requirements based on zod schemas (from current schema.ts)
const REQUIRED_FIELDS = {
  'Schools': ['Name'],
  'Educators': ['Current_Primary_Email_Address'],
  'Educators x Schools': ['educator_id', 'school_id'],
  'Locations': ['school_id'],
  'Guides Assignments': ['school_id', 'guide_id'],
  'School notes': ['school_id'],
  'Grants': ['school_id'],
  'Loans': ['school_id'],
  'Action steps': ['school_id'],
  '990s': ['school_id'],
};

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
  'autonumber': 'number',
  'autoNumber': 'number'
};

// Generate field name for WFTLS (camelCase)
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

// Generate display name
function generateDisplayName(originalName, tableName) {
  return originalName
    .replace(/[_]{2,}/g, ' ') // Replace multiple underscores with space
    .replace(/_/g, ' ') // Replace underscores with spaces
    .trim();
}

// Determine zod type
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
    
    // Filter for unpopulated records (null or undefined in "Include in WFTLS")
    const unpopulated = allRecords.filter(record => 
      record.fields['Include in WFTLS'] === null || 
      record.fields['Include in WFTLS'] === undefined
    );
    
    console.log(`✅ Found ${unpopulated.length} unpopulated records out of ${allRecords.length} total`);
    return unpopulated;
  } catch (error) {
    console.error('❌ Error fetching Metadata table:', error);
    process.exit(1);
  }
}

async function updateMetadataRecordWithRetry(recordId, updates, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
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

      if (response.ok) {
        return await response.json();
      }
      
      if (response.status === 503 && attempt < retries) {
        console.log(`   ⏳ Service unavailable, retrying in ${attempt * 2} seconds...`);
        await new Promise(resolve => setTimeout(resolve, attempt * 2000));
        continue;
      }
      
      const errorText = await response.text();
      console.error(`   ❌ Failed (attempt ${attempt}): ${response.status} ${response.statusText}`);
      if (attempt === retries) {
        console.error(`      Error details:`, errorText.substring(0, 200));
      }
      
    } catch (error) {
      console.error(`   ❌ Error (attempt ${attempt}):`, error.message);
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, attempt * 2000));
      }
    }
  }
  
  return null;
}

async function completeMetadataPopulation() {
  console.log('🚀 Completing metadata population with all required fields...');
  console.log('   This will populate: Include in WFTLS, Field Name in WFTLS,');
  console.log('   Display Name in WFTLS, Is Required in WFTLS, and Zod Type\n');
  
  // Get unpopulated metadata records
  const unpopulatedRecords = await fetchUnpopulatedRecords();
  
  if (unpopulatedRecords.length === 0) {
    console.log('✨ All metadata records are already populated!');
    return;
  }
  
  let successCount = 0;
  let failureCount = 0;
  const failedRecords = [];
  
  console.log(`📝 Processing ${unpopulatedRecords.length} records...\n`);
  
  for (let i = 0; i < unpopulatedRecords.length; i++) {
    const record = unpopulatedRecords[i];
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

    // Generate all the metadata fields
    const wftlsFieldName = generateFieldName(fieldName, tableName);
    const displayName = generateDisplayName(fieldName, tableName);
    const isRequired = REQUIRED_FIELDS[tableName]?.includes(fieldName) || false;
    const zodType = determineZodType(fieldType, fieldOptions);
    
    // All these remaining fields are used in the schema, so Include in WFTLS = true
    const updates = {
      'Include in WFTLS': 'true',
      'Field Name in WFTLS': wftlsFieldName,
      'Display Name in WFTLS': displayName,
      'Is Required in WFTLS': isRequired,
      'Zod Type': zodType
    };
    
    console.log(`[${i + 1}/${unpopulatedRecords.length}] ${tableName}.${fieldName}`);
    console.log(`   → Field Name: "${wftlsFieldName}"`);
    console.log(`   → Display Name: "${displayName}"`);
    console.log(`   → Required: ${isRequired}`);
    console.log(`   → Zod Type: ${zodType}`);
    
    const result = await updateMetadataRecordWithRetry(record.id, updates);
    
    if (result) {
      console.log(`   ✅ Successfully updated\n`);
      successCount++;
    } else {
      console.log(`   ❌ Failed to update after retries\n`);
      failureCount++;
      failedRecords.push({
        id: record.id,
        table: tableName,
        field: fieldName
      });
    }
    
    // Add small delay between records to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 Final Results:');
  console.log('='.repeat(60));
  console.log(`✅ Successfully updated: ${successCount} records`);
  console.log(`❌ Failed to update: ${failureCount} records`);
  
  if (failedRecords.length > 0) {
    console.log('\n⚠️ Failed records that need manual attention:');
    failedRecords.forEach(r => {
      console.log(`   - ${r.table}.${r.field} (ID: ${r.id})`);
    });
    
    // Save failed records to a file for reference
    const fs = require('fs');
    const failedRecordsFile = 'failed-metadata-updates.json';
    fs.writeFileSync(failedRecordsFile, JSON.stringify(failedRecords, null, 2));
    console.log(`\n💾 Failed records saved to ${failedRecordsFile} for reference`);
  } else {
    console.log('\n🎉 All records successfully populated!');
  }
}

completeMetadataPopulation().catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});