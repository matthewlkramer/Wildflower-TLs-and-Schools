import { getAirtableSchema } from './airtable-schema';

async function testAirtableConnection() {
  try {
    console.log('Testing Airtable connection...');
    console.log('API Key:', process.env.AIRTABLE_API_KEY ? 'Present' : 'Missing');
    console.log('Base ID:', process.env.AIRTABLE_BASE_ID ? 'Present' : 'Missing');
    
    const schema = await getAirtableSchema();
    console.log('Schema fetched successfully:');
    console.log(JSON.stringify(schema, null, 2));
  } catch (error) {
    console.error('Error testing Airtable connection:', error);
  }
}

testAirtableConnection();