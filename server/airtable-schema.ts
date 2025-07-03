import Airtable from "airtable";

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY
}).base(process.env.AIRTABLE_BASE_ID!);

export async function getAirtableSchema() {
  try {
    // Get base schema
    const response = await fetch(`https://api.airtable.com/v0/meta/bases/${process.env.AIRTABLE_BASE_ID}/tables`, {
      headers: {
        'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch schema: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Airtable schema:', error);
    throw error;
  }
}

export { base };