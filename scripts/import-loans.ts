import { parse } from 'csv-parse/sync';
import { readFileSync } from 'fs';
import { db } from '../server/db';
import { borrowers, loans } from '../shared/schema';

interface LoanCSVRow {
  'School #': string;
  'Loan #': string;
  'School': string;
  'State': string;
  'Address': string;
  'Census Tract': string;
  '2015 CDFI Tract': string;
  '2020 CDFI Tract': string;
  'School CDFI Tract': string;
  'DAC': string;
  'Charter': string;
  'Current TM': string;
  'Any TM': string;
  'CC Desert': string;
  '% LITP': string;
  '% African American': string;
  '% Latino': string;
  'School HP': string;
  'School PP': string;
  'BIPOC TL?': string;
  'LI TL?': string;
  'Woman TL': string;
  'Climate Disadvantaged': string;
  'Amount Issued': string;
  'Amount Outstanding': string;
  'Fiscal Year': string;
  'Calendar Year': string;
  'Issue Date': string;
  'Maturity Date': string;
  'Rate': string;
  'Use of Proceeds': string;
  'Notes': string;
  'Email 1': string;
  'Email 2': string;
  'Email 3': string;
}

function parseBoolean(value: string): boolean | null {
  if (!value || value.trim() === '' || value.toLowerCase() === 'n/a') return null;
  const cleanValue = value.trim().toLowerCase();
  return cleanValue === 'yes' || cleanValue === 'true' || cleanValue === '1';
}

function parsePercentage(value: string): number | null {
  if (!value || value.trim() === '' || value.toLowerCase() === 'n/a') return null;
  const cleanValue = value.replace('%', '').replace(',', '').trim();
  const parsed = parseFloat(cleanValue);
  return isNaN(parsed) ? null : parsed;
}

function parseAmount(value: string): number | null {
  if (!value || value.trim() === '' || value.includes('$-') || value.trim() === '$ -') return null;
  const cleanValue = value.replace(/[$,\s]/g, '').trim();
  const parsed = parseFloat(cleanValue);
  return isNaN(parsed) ? null : parsed;
}

function parseDate(value: string): Date | null {
  if (!value || value.trim() === '') return null;
  
  // Handle various date formats from the CSV
  const cleanValue = value.trim();
  
  // Handle MM/DD/YYYY or M/D/YYYY formats
  if (cleanValue.includes('/')) {
    const [month, day, year] = cleanValue.split('/');
    const fullYear = year.length === 2 ? `20${year}` : year;
    return new Date(`${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
  }
  
  // Handle MM/DD/YY formats
  const date = new Date(cleanValue);
  return isNaN(date.getTime()) ? null : date;
}

function parseInterestRate(value: string): number | null {
  if (!value || value.trim() === '') return null;
  const cleanValue = value.replace('%', '').trim();
  const parsed = parseFloat(cleanValue);
  return isNaN(parsed) ? null : parsed / 100; // Convert percentage to decimal
}

async function importLoans() {
  try {
    console.log('Starting loan import from CSV...');
    
    // Read and parse CSV, skipping the first few metadata rows
    const csvContent = readFileSync('attached_assets/Wildflower Loan and Grant Tracking - Sunlight New Tracker_1752774683740.csv', 'utf-8');
    
    // Split into lines and find the header row
    const lines = csvContent.split('\n');
    let headerRowIndex = -1;
    
    // Look for the row that starts with "School #"
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith('School #')) {
        headerRowIndex = i;
        break;
      }
    }
    
    if (headerRowIndex === -1) {
      throw new Error('Could not find header row starting with "School #"');
    }
    
    console.log(`Found header row at line ${headerRowIndex + 1}`);
    
    // Rejoin from header row onwards
    const csvData = lines.slice(headerRowIndex).join('\n');
    
    const records = parse(csvData, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    console.log(`Found ${records.length} rows in CSV`);

    // Track schools and loans to avoid duplicates
    const schoolsMap = new Map<string, number>();
    const importedLoans: any[] = [];

    for (const record of records) {
      // Skip rows without loan number or school name
      if (!record['Loan #'] || !record['School'] || record['School'].trim() === '') {
        continue;
      }

      // Skip summary/calculation rows at the bottom
      if (record['School #'] === '' && record['School'] === '') {
        continue;
      }

      console.log(`Processing: ${record['School']} - Loan #${record['Loan #']}`);

      let borrowerId: number;

      // Check if we've already created this school/borrower
      const schoolKey = record['School'].trim();
      if (schoolsMap.has(schoolKey)) {
        borrowerId = schoolsMap.get(schoolKey)!;
      } else {
        // Create new borrower (school)
        const [borrower] = await db.insert(borrowers).values({
          name: record['School'].trim(),
          type: 'school',
          schoolId: record['School #'] ? `WF-${record['School #']}` : null,
          businessAddress: record['Address']?.trim() || null,
          state: record['State']?.trim() || null,
          schoolNumber: record['School #'] ? parseInt(record['School #']) : null,
          censusTract: record['Census Tract']?.trim() || null,
          
          // CDFI eligibility
          cdfiTract2015: parseBoolean(record['2015 CDFI Tract']),
          cdfiTract2020: parseBoolean(record['2020 CDFI Tract']),
          schoolCdfiTract: parseBoolean(record['School CDFI Tract']),
          disadvantagedCommunity: parseBoolean(record['DAC']),
          climateDisadvantaged: parseBoolean(record['Climate Disadvantaged']),
          
          // School characteristics
          isCharter: parseBoolean(record['Charter']),
          currentTeacherMentoring: parseBoolean(record['Current TM']),
          anyTeacherMentoring: parseBoolean(record['Any TM']),
          childcareDesert: parseBoolean(record['CC Desert']),
          
          // Demographics
          percentLowIncomeTransition: parsePercentage(record['% LITP']),
          percentAfricanAmerican: parsePercentage(record['% African American']),
          percentLatino: parsePercentage(record['% Latino']),
          
          // School characteristics
          schoolHighPoverty: parseBoolean(record['School HP']),
          schoolHighPotential: parseBoolean(record['School PP']),
          bipocTeacherLeader: parseBoolean(record['BIPOC TL?']),
          lowIncomeTeacherLeader: parseBoolean(record['LI TL?']),
          womanTeacherLeader: parseBoolean(record['Woman TL']),
          
          // Contact information
          email1: record['Email 1']?.trim() || null,
          email2: record['Email 2']?.trim() || null,
          email3: record['Email 3']?.trim() || null,
        }).returning();
        
        borrowerId = borrower.id;
        schoolsMap.set(schoolKey, borrowerId);
        console.log(`Created borrower: ${record['School']} (ID: ${borrowerId})`);
      }

      // Create loan
      const principalAmount = parseAmount(record['Amount Issued']);
      const currentBalance = parseAmount(record['Amount Outstanding']);
      const interestRate = parseInterestRate(record['Rate']);
      
      if (principalAmount === null) {
        console.log(`Skipping loan ${record['Loan #']} - no principal amount`);
        continue;
      }

      const [loan] = await db.insert(loans).values({
        loanNumber: `WF-${record['Loan #']}`,
        borrowerId: borrowerId,
        principalAmount: principalAmount.toString(),
        currentPrincipalBalance: (currentBalance || principalAmount).toString(),
        interestRate: interestRate || 0,
        termMonths: 84, // Default 7 year term, can be updated later
        status: currentBalance && currentBalance > 0 ? 'active' : (currentBalance === 0 ? 'paid_off' : 'active'),
        
        // CSV-specific fields
        fiscalYear: record['Fiscal Year'] ? parseInt(record['Fiscal Year']) : null,
        calendarYear: record['Calendar Year'] ? parseInt(record['Calendar Year']) : null,
        issueDate: parseDate(record['Issue Date']),
        useOfProceeds: record['Use of Proceeds']?.trim() || null,
        notes: record['Notes']?.trim() || null,
        originationDate: parseDate(record['Issue Date']),
        maturityDate: parseDate(record['Maturity Date']),
        
        // Set origination status based on loan state
        originationStatus: 'funded', // These are all existing loans
        fundsDistributed: true,
        fundsDistributedDate: parseDate(record['Issue Date']),
      }).returning();

      importedLoans.push(loan);
      console.log(`Created loan: ${loan.loanNumber} for $${principalAmount}`);
    }

    console.log(`\nImport completed successfully!`);
    console.log(`- Created ${schoolsMap.size} borrowers`);
    console.log(`- Created ${importedLoans.length} loans`);
    console.log(`- Total principal amount: $${importedLoans.reduce((sum, loan) => sum + parseFloat(loan.principalAmount), 0).toLocaleString()}`);

  } catch (error) {
    console.error('Error importing loans:', error);
    throw error;
  }
}

// Run the import
importLoans().catch(console.error);