import { getAirtableSchema } from './airtable-schema';

async function analyzeAirtableSchema() {
  try {
    const schema = await getAirtableSchema();
    
    // Find key tables
    const educators = schema.tables.find((t: any) => t.name === 'Educators');
    const schools = schema.tables.find((t: any) => t.name === 'Schools');
    const charters = schema.tables.find((t: any) => t.name === 'Charters');
    
    console.log('=== EDUCATORS TABLE ===');
    if (educators) {
      console.log('Fields:');
      educators.fields.forEach((field: any) => {
        console.log(`- ${field.name} (${field.type}): ${field.description || ''}`);
      });
    }
    
    console.log('\n=== SCHOOLS TABLE ===');
    if (schools) {
      console.log('Fields:');
      schools.fields.forEach((field: any) => {
        console.log(`- ${field.name} (${field.type}): ${field.description || ''}`);
      });
    }
    
    console.log('\n=== CHARTERS TABLE ===');
    if (charters) {
      console.log('Fields:');
      charters.fields.forEach((field: any) => {
        console.log(`- ${field.name} (${field.type}): ${field.description || ''}`);
      });
    }
    
    console.log('\n=== ALL TABLES ===');
    schema.tables.forEach((table: any) => {
      console.log(`${table.name} (${table.fields.length} fields)`);
    });
    
  } catch (error) {
    console.error('Error analyzing schema:', error);
  }
}

analyzeAirtableSchema();