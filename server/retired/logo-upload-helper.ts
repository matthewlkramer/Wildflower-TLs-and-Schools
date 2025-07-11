import fs from 'fs';
import path from 'path';

const LOGO_DIR = './school-logos';

// Generate a CSV that can be used with Airtable's CSV import feature
async function generateLogoMappingCSV(): Promise<void> {
  const schoolFolders = fs.readdirSync(LOGO_DIR).filter(f => 
    fs.statSync(path.join(LOGO_DIR, f)).isDirectory() && f !== 'example-school'
  );

  const csvRows = ['School Short Name,Main Square File,Flower Only File,Main Rectangle File'];

  for (const folderName of schoolFolders) {
    const schoolPath = path.join(LOGO_DIR, folderName);
    const files = fs.readdirSync(schoolPath);
    
    const mainSquare = files.find(f => f.includes('square') && !f.includes('flower'));
    const flowerOnly = files.find(f => f.includes('flower') && f.includes('only'));
    const mainRectangle = files.find(f => f.includes('rectangle'));
    
    csvRows.push(`"${folderName}","${mainSquare || ''}","${flowerOnly || ''}","${mainRectangle || ''}"`);
  }

  fs.writeFileSync('logo-mapping.csv', csvRows.join('\n'));
  console.log('Created logo-mapping.csv');
}

// Alternative: Create an Airtable scripting block code
function generateAirtableScript(): void {
  const script = `// Airtable Scripting Block Code
// This script helps you manually select and upload logo files

const table = base.getTable('Schools');
const query = await table.selectRecordsAsync({
    fields: ['Name', 'Short Name', 'Logo - main square', 'Logo - flower only', 'Logo - main rectangle']
});

// Filter schools without complete logos
const schoolsNeedingLogos = query.records.filter(record => {
    return !record.getCellValue('Logo - main square') || 
           !record.getCellValue('Logo - flower only') || 
           !record.getCellValue('Logo - main rectangle');
});

output.markdown(\`Found \${schoolsNeedingLogos.length} schools needing logos\`);

// Process one school at a time
for (const record of schoolsNeedingLogos) {
    const schoolName = record.getCellValue('Name');
    const shortName = record.getCellValue('Short Name');
    
    output.markdown(\`## \${schoolName} (\${shortName})\`);
    
    const shouldProcess = await input.buttonsAsync(\`Process \${shortName}?\`, [
        {label: 'Yes', value: 'yes', variant: 'primary'},
        {label: 'Skip', value: 'skip'}
    ]);
    
    if (shouldProcess === 'skip') continue;
    
    // For each logo type
    const logoTypes = [
        {field: 'Logo - main square', description: 'Square format with flower + school name'},
        {field: 'Logo - flower only', description: 'Just the flower icon, no text'},
        {field: 'Logo - main rectangle', description: 'Horizontal with flower + name + "Wildflower"'}
    ];
    
    const updates = {};
    
    for (const logoType of logoTypes) {
        if (!record.getCellValue(logoType.field)) {
            output.markdown(\`### Upload \${logoType.field}\`);
            output.markdown(\`Description: \${logoType.description}\`);
            
            // Note: You'll need to manually upload the file to Airtable
            output.markdown(\`Please manually:\n1. Click on the record\n2. Upload the appropriate logo to "\${logoType.field}"\n3. Come back here to continue\`);
            
            await input.buttonsAsync('Continue when uploaded', [{label: 'Done', value: 'done'}]);
        }
    }
}

output.markdown('✅ All schools processed!');
`;

  fs.writeFileSync('airtable-logo-upload-script.js', script);
  console.log('Created airtable-logo-upload-script.js');
}

// Main function
async function main() {
  console.log('Checking for logo files...\n');
  
  if (!fs.existsSync(LOGO_DIR)) {
    console.log('❌ No school-logos directory found.');
    console.log('Please upload your logo files to the school-logos directory first.');
    console.log('\nExpected structure:');
    console.log('school-logos/');
    console.log('  ├── yagrumo/');
    console.log('  │   ├── main-square.png');
    console.log('  │   ├── flower-only.png');
    console.log('  │   └── main-rectangle.png');
    return;
  }

  const schoolFolders = fs.readdirSync(LOGO_DIR).filter(f => 
    fs.statSync(path.join(LOGO_DIR, f)).isDirectory() && f !== 'example-school'
  );

  if (schoolFolders.length === 0) {
    console.log('❌ No school folders found.');
    console.log('Please organize logos in folders named by school short name.');
    return;
  }

  console.log(`✅ Found ${schoolFolders.length} schools with logos:\n`);
  
  // List all schools and their files
  schoolFolders.forEach(school => {
    console.log(`📁 ${school}/`);
    const files = fs.readdirSync(path.join(LOGO_DIR, school));
    files.forEach(file => console.log(`   - ${file}`));
    console.log('');
  });

  // Generate helpful files
  await generateLogoMappingCSV();
  generateAirtableScript();
  
  console.log('\n✅ Generated helper files:');
  console.log('   - logo-mapping.csv (for tracking)');
  console.log('   - airtable-logo-upload-script.js (for Airtable scripting block)');
  console.log('\nNext steps:');
  console.log('1. Upload your logo files to a cloud service (Google Drive, Dropbox, etc.)');
  console.log('2. Make sure files are publicly accessible');
  console.log('3. Use the Airtable scripting block code to systematically update each school');
  console.log('\nOR manually upload files directly in Airtable using the CSV as a guide.');
}

main().catch(console.error);