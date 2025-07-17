import { parse } from 'csv-parse/sync';
import { readFileSync } from 'fs';

async function debugCSV() {
  try {
    console.log('Reading CSV file...');
    
    // Read and parse CSV
    const csvContent = readFileSync('attached_assets/Wildflower Loan and Grant Tracking - Sunlight New Tracker_1752774683740.csv', 'utf-8');
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    console.log(`Found ${records.length} rows in CSV`);
    
    // Show the first record to see actual column names
    if (records.length > 0) {
      console.log('\nFirst record keys:');
      console.log(Object.keys(records[0]));
      
      console.log('\nFirst few complete records:');
      records.slice(0, 3).forEach((record, idx) => {
        console.log(`\n--- Record ${idx + 1} ---`);
        Object.entries(record).forEach(([key, value]) => {
          if (value && value.toString().trim() !== '') {
            console.log(`${key}: "${value}"`);
          }
        });
      });
      
      // Look for records with loan numbers
      console.log('\nLooking for records with loan numbers...');
      const loansWithNumbers = records.filter(record => 
        record['Loan #'] && 
        record['Loan #'].trim() !== '' && 
        record['School'] && 
        record['School'].trim() !== ''
      );
      
      console.log(`Found ${loansWithNumbers.length} records with both loan numbers and school names`);
      
      if (loansWithNumbers.length > 0) {
        console.log('\nFirst loan record:');
        const firstLoan = loansWithNumbers[0];
        Object.entries(firstLoan).forEach(([key, value]) => {
          if (value && value.toString().trim() !== '') {
            console.log(`${key}: "${value}"`);
          }
        });
      }
    }
    
  } catch (error) {
    console.error('Error debugging CSV:', error);
  }
}

debugCSV();