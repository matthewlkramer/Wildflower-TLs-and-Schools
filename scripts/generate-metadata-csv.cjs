#!/usr/bin/env node
require('dotenv').config();
const fs = require('fs');
const path = require('path');

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

// Escape CSV field
function escapeCSV(field) {
  if (field === null || field === undefined) return '';
  field = String(field);
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    return '"' + field.replace(/"/g, '""') + '"';
  }
  return field;
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

async function generateMetadataCSV() {
  console.log('🚀 Generating CSV file with metadata for unpopulated records...\n');
  
  // Get unpopulated metadata records
  const unpopulatedRecords = await fetchUnpopulatedRecords();
  
  if (unpopulatedRecords.length === 0) {
    console.log('✨ All metadata records are already populated!');
    return;
  }
  
  // Create CSV header
  const csvLines = [];
  csvLines.push('Record ID,Table Name,Field Name,Include in WFTLS,Field Name in WFTLS,Display Name in WFTLS,Is Required in WFTLS,Zod Type');
  
  console.log(`📝 Processing ${unpopulatedRecords.length} records...\n`);
  
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

    // Generate all the metadata fields
    const wftlsFieldName = generateFieldName(fieldName, tableName);
    const displayName = generateDisplayName(fieldName, tableName);
    const isRequired = REQUIRED_FIELDS[tableName]?.includes(fieldName) || false;
    const zodType = determineZodType(fieldType, fieldOptions);
    
    // All these remaining fields are used in the schema, so Include in WFTLS = true
    const csvRow = [
      escapeCSV(record.id),
      escapeCSV(tableName),
      escapeCSV(fieldName),
      'true',  // Include in WFTLS
      escapeCSV(wftlsFieldName),
      escapeCSV(displayName),
      isRequired ? 'true' : 'false',
      escapeCSV(zodType)
    ].join(',');
    
    csvLines.push(csvRow);
  }
  
  // Write CSV file
  const csvContent = csvLines.join('\n');
  const csvFilePath = path.join(process.cwd(), 'metadata-updates.csv');
  fs.writeFileSync(csvFilePath, csvContent, 'utf8');
  
  console.log('✅ CSV file generated successfully!');
  console.log(`📁 File saved to: ${csvFilePath}`);
  console.log(`📊 Total records in CSV: ${unpopulatedRecords.length}`);
  
  console.log('\n📋 Instructions for importing to Airtable:');
  console.log('1. Open your Airtable base');
  console.log('2. Go to the Metadata table');
  console.log('3. Click the "..." menu in the top right');
  console.log('4. Select "Update records" or "CSV import"');
  console.log('5. Upload the metadata-updates.csv file');
  console.log('6. Map "Record ID" to the record ID field for matching');
  console.log('7. Map the other columns to their respective fields');
  console.log('8. Import the data\n');
  
  console.log('Note: The CSV contains only the unpopulated records.');
  console.log('All "Include in WFTLS" values are set to "true" since these');
  console.log('are all fields currently used in your schema.');
}

generateMetadataCSV().catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});