// Airtable Script to help track logo upload progress
// Run this in your Airtable Scripting block

// Get the Schools table
const table = base.getTable('Schools');
const query = await table.selectRecordsAsync({
    fields: ['Name', 'Short Name', 'Logo URL', 'Logo - main square', 'Logo - flower only', 'Logo - main rectangle']
});

// Filter schools with Logo URL but missing new logo fields
const schoolsNeedingLogos = query.records.filter(record => {
    const logoUrl = record.getCellValue('Logo URL');
    const mainSquare = record.getCellValue('Logo - main square');
    const flowerOnly = record.getCellValue('Logo - flower only');
    const mainRectangle = record.getCellValue('Logo - main rectangle');
    
    return logoUrl && (!mainSquare || !flowerOnly || !mainRectangle);
});

console.log(`Found ${schoolsNeedingLogos.length} schools needing logo uploads\n`);

// Create a tracking report
const report = [];

for (const record of schoolsNeedingLogos) {
    const name = record.getCellValue('Name');
    const shortName = record.getCellValue('Short Name');
    const logoUrl = record.getCellValue('Logo URL');
    const missing = [];
    
    if (!record.getCellValue('Logo - main square')) missing.push('Main Square');
    if (!record.getCellValue('Logo - flower only')) missing.push('Flower Only');
    if (!record.getCellValue('Logo - main rectangle')) missing.push('Main Rectangle');
    
    report.push({
        'School': name,
        'Short Name': shortName,
        'Missing Logos': missing.join(', '),
        'Logo URL': logoUrl
    });
}

// Display the report
output.table(report);

// Instructions for manual process
output.markdown(`
## Logo Upload Instructions

For each school listed above:
1. Click the **Logo URL** link to open the Google Drive folder
2. Navigate to **PNG → PNH_HighRes** folder
3. Look for these three logo types:
   - **Main Square**: Square format with flower + school name
   - **Flower Only**: Just the flower icon, no text
   - **Main Rectangle**: Horizontal format with flower + school name + "Wildflower"
4. Download each logo and upload to the corresponding Airtable field

**Pro tip**: Open multiple tabs to process several schools at once!
`);

// Optional: Create a button to open the next school's Logo URL
if (schoolsNeedingLogos.length > 0) {
    const firstSchool = schoolsNeedingLogos[0];
    const url = firstSchool.getCellValue('Logo URL');
    
    await input.buttonsAsync('Process Schools', [
        {label: `Open ${firstSchool.getCellValue('Short Name')} logos`, value: 'open', variant: 'primary'}
    ]);
    
    if (url) {
        output.markdown(`Opening: ${url}`);
        // Note: Airtable doesn't allow automatic URL opening for security
        output.markdown(`Please copy and paste this URL into your browser`);
    }
}