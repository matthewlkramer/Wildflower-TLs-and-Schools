import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import fetch from 'node-fetch';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const BASE_ID = 'appuLwZ7b7KZq0Wqa'; // Your Wildflower Schools base ID
const TABLE_NAME = 'Schools';
const LOGO_DIR = './school-logos';

interface SchoolRecord {
  id: string;
  fields: {
    'Short Name'?: string;
    'Name': string;
  };
}

interface UploadResult {
  school: string;
  field: string;
  success: boolean;
  error?: string;
}

async function getSchools(): Promise<SchoolRecord[]> {
  const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch schools: ${response.statusText}`);
  }

  const data = await response.json();
  return data.records;
}

async function uploadFileToAirtable(filePath: string): Promise<{ url: string; filename: string }> {
  // First, upload the file to Airtable's attachment service
  const fileStream = fs.createReadStream(filePath);
  const form = new FormData();
  form.append('file', fileStream);

  // Note: Airtable requires files to be publicly accessible or uploaded via their API
  // For now, we'll need to use a different approach
  
  // In a real implementation, you'd either:
  // 1. Upload to a cloud service (S3, Cloudinary) and get a public URL
  // 2. Use Airtable's attachment upload endpoint (which isn't publicly documented)
  
  // For this script, we'll need the files to be already hosted somewhere
  throw new Error('File upload requires files to be hosted publicly. Please upload files to a cloud service first.');
}

async function updateSchoolLogos(recordId: string, logos: { [key: string]: string }): Promise<void> {
  const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}/${recordId}`;
  
  const fields: any = {};
  if (logos.mainSquare) {
    fields['Logo - main square'] = [{ url: logos.mainSquare }];
  }
  if (logos.flowerOnly) {
    fields['Logo - flower only'] = [{ url: logos.flowerOnly }];
  }
  if (logos.mainRectangle) {
    fields['Logo - main rectangle'] = [{ url: logos.mainRectangle }];
  }

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fields }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to update record: ${error}`);
  }
}

async function processSchoolLogos(): Promise<UploadResult[]> {
  const results: UploadResult[] = [];

  try {
    // Get all schools from Airtable
    console.log('Fetching schools from Airtable...');
    const schools = await getSchools();
    const schoolMap = new Map<string, SchoolRecord>();
    
    // Create a map of short names to records
    schools.forEach(school => {
      const shortName = school.fields['Short Name'];
      if (shortName) {
        schoolMap.set(shortName.toLowerCase(), school);
      }
    });

    // Process each school folder
    const schoolFolders = fs.readdirSync(LOGO_DIR).filter(f => 
      fs.statSync(path.join(LOGO_DIR, f)).isDirectory() && f !== 'example-school'
    );

    console.log(`Found ${schoolFolders.length} school folders to process`);

    for (const folderName of schoolFolders) {
      const school = schoolMap.get(folderName.toLowerCase());
      
      if (!school) {
        results.push({
          school: folderName,
          field: 'all',
          success: false,
          error: 'School not found in Airtable',
        });
        continue;
      }

      const schoolPath = path.join(LOGO_DIR, folderName);
      const logos: { [key: string]: string } = {};

      // Check for each logo type
      const logoFiles = {
        mainSquare: ['main-square.png', 'main_square.png', 'square.png'],
        flowerOnly: ['flower-only.png', 'flower_only.png', 'flower.png'],
        mainRectangle: ['main-rectangle.png', 'main_rectangle.png', 'rectangle.png'],
      };

      for (const [logoType, possibleNames] of Object.entries(logoFiles)) {
        for (const fileName of possibleNames) {
          const filePath = path.join(schoolPath, fileName);
          if (fs.existsSync(filePath)) {
            // Note: You'll need to upload these files to a public URL first
            console.log(`Found ${logoType} for ${school.fields.Name}: ${fileName}`);
            results.push({
              school: school.fields.Name,
              field: logoType,
              success: false,
              error: 'Files need to be uploaded to a public URL first',
            });
            break;
          }
        }
      }
    }

  } catch (error) {
    console.error('Error processing logos:', error);
  }

  return results;
}

// Alternative approach: Generate a script to help with manual upload
async function generateUploadHelper(): Promise<void> {
  console.log('\n=== UPLOAD HELPER ===\n');
  console.log('Since direct file upload to Airtable requires files to be publicly hosted,');
  console.log('here are the steps to complete the upload:\n');
  
  console.log('1. Upload all logo files to a cloud service (Google Drive, Dropbox, etc.)');
  console.log('2. Make sure the files are publicly accessible');
  console.log('3. Use the following mapping to update Airtable:\n');

  const schoolFolders = fs.readdirSync(LOGO_DIR).filter(f => 
    fs.statSync(path.join(LOGO_DIR, f)).isDirectory() && f !== 'example-school'
  );

  for (const folderName of schoolFolders) {
    const schoolPath = path.join(LOGO_DIR, folderName);
    const files = fs.readdirSync(schoolPath);
    
    console.log(`\nSchool: ${folderName}`);
    files.forEach(file => {
      console.log(`  - ${file}`);
    });
  }
}

// Main execution
async function main() {
  if (!AIRTABLE_API_KEY) {
    console.error('ERROR: AIRTABLE_API_KEY environment variable is not set');
    return;
  }

  console.log('Starting logo upload process...\n');
  
  // Check if we have any school folders
  if (!fs.existsSync(LOGO_DIR)) {
    console.log('No school-logos directory found. Please upload your logo files first.');
    return;
  }

  const schoolFolders = fs.readdirSync(LOGO_DIR).filter(f => 
    fs.statSync(path.join(LOGO_DIR, f)).isDirectory() && f !== 'example-school'
  );

  if (schoolFolders.length === 0) {
    console.log('No school folders found in school-logos directory.');
    console.log('Please organize your logos according to the README.md instructions.');
    return;
  }

  console.log(`Found ${schoolFolders.length} schools with logos ready to process.`);
  
  await generateUploadHelper();
}

main().catch(console.error);