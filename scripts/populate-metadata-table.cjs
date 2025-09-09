#!/usr/bin/env node
require('dotenv').config();

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
  console.error('❌ Please set AIRTABLE_API_KEY and AIRTABLE_BASE_ID in your .env file');
  process.exit(1);
}

// Tables that are actively used in WFTLS (from airtable-tables.ts)
const ACTIVE_TABLES = new Set([
  'Schools', 'Charters', 'Locations', 'Educators', 'Educators x Schools',
  'Grants', 'Grants Advice Log', 'Loans', 'Governance docs', '990s',
  'Loan payments', 'Events', 'Event attendance', 'Mailing lists',
  'Montessori Certs', 'SSJ Typeforms: Start a School', 'SSJ Fillout Forms',
  'Guides', 'Guides Assignments', 'School notes', 'Educator notes',
  'Training Grants', 'Public funding', 'Action steps', 'Event types',
  'QBO School Codes', 'Montessori Cert Levels', 'Montessori Certifiers',
  'Montessori Certifiers - old list', 'Race and Ethnicity', 'Board Service',
  'Lead Routing and Templates', 'States Aliases', 'Membership termination steps',
  'Membership termination steps and dates', 'Cohorts', 'Marketing sources mapping',
  'Marketing source options', 'Annual enrollment and demographics', 'Charter roles',
  'Charter authorizers and contacts', 'Reports and submissions', 'Assessments',
  'Assessment data', 'Charter applications', 'Ages-Grades',
  'Supabase join 990 with school', 'Email Addresses', 'Partners copy'
]);

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
  'autonumber': 'number'
};

async function fetchMetadataTable() {
  console.log('🔍 Fetching Metadata table from Airtable...');
  
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
      
      console.log(`📥 Fetched ${data.records.length} records (total: ${allRecords.length})`);
      
      // Add small delay to avoid rate limits
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
      throw new Error(`Failed to update record ${recordId}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`❌ Error updating record ${recordId}:`, error);
    return null;
  }
}

function generateFieldName(originalName, tableName) {
  // Convert field name to camelCase for use in TypeScript
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
  // Clean up the display name
  return originalName
    .replace(/[_]{2,}/g, ' ') // Replace multiple underscores with space
    .replace(/_/g, ' ') // Replace underscores with spaces
    .trim();
}

function determineZodType(fieldType, fieldOptions = {}) {
  const baseType = ZOD_TYPE_MAPPING[fieldType] || 'string';
  
  // Handle special cases
  if (fieldType === 'email') return 'email';
  if (fieldType === 'url') return 'url';
  if (fieldType === 'singleSelect' && fieldOptions.choices) return 'enum';
  if (fieldType === 'multipleSelects') return 'array';
  if (fieldType === 'multipleRecordLinks') return 'array';
  if (fieldType === 'multipleAttachments') return 'array';
  
  return baseType;
}

async function populateMetadataTable() {
  console.log('🚀 Starting metadata table population...');
  
  const metadataRecords = await fetchMetadataTable();
  let updatedCount = 0;
  let skippedCount = 0;

  // Debug: show first few records to understand structure
  if (metadataRecords.length > 0) {
    console.log('\n🔍 Sample metadata record structure:');
    const sample = metadataRecords[0].fields;
    console.log('Available fields:', Object.keys(sample));
    console.log('Sample record:', JSON.stringify(sample, null, 2));
  }

  for (const record of metadataRecords) {
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

    // Skip if already populated
    if (fields['Include in WFTLS'] !== undefined) {
      skippedCount++;
      if (skippedCount % 100 === 0) {
        console.log(`⏩ Skipped ${skippedCount} already populated records...`);
      }
      continue;
    }

    // Determine if this field should be included
    const includeInWFTLS = ACTIVE_TABLES.has(tableName);
    
    // Generate field name for WFTLS
    const wftlsFieldName = generateFieldName(fieldName, tableName);
    
    // Generate display name
    const displayName = generateDisplayName(fieldName, tableName);
    
    // Determine if required
    const isRequired = REQUIRED_FIELDS[tableName]?.includes(fieldName) || false;
    
    // Determine zod type
    const zodType = determineZodType(fieldType, fieldOptions);

    const updates = {
      'Include in WFTLS': includeInWFTLS,
      'Field Name in WFTLS': wftlsFieldName,
      'Display Name in WFTLS': displayName,
      'Is Required in WFTLS': isRequired,
      'Zod Type': zodType
    };

    console.log(`📝 Updating ${tableName}.${fieldName} -> Include: ${includeInWFTLS}, Field: ${wftlsFieldName}, Type: ${zodType}`);
    
    const result = await updateMetadataRecord(record.id, updates);
    if (result) {
      updatedCount++;
    }
    
    // Add small delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  console.log(`✅ Metadata population complete!`);
  console.log(`   📊 Updated: ${updatedCount} records`);
  console.log(`   ⏩ Skipped: ${skippedCount} records (already populated)`);
  console.log(`   🎯 Active Tables: ${ACTIVE_TABLES.size}`);
}

populateMetadataTable().catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});