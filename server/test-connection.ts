import { base } from "./airtable-schema";

async function testAirtableConnection() {
  try {
    console.log("Testing Airtable connection...");
    
    // Test educators
    console.log("Fetching educators...");
    const educators = await base("Educators").select({
      maxRecords: 3
    }).all();
    
    console.log(`Found ${educators.length} educators:`);
    educators.forEach(educator => {
      console.log(`- ${educator.fields["Full Name"]} (${educator.id})`);
    });

    // Test schools
    console.log("\nFetching schools...");
    const schools = await base("Schools").select({
      maxRecords: 3
    }).all();
    
    console.log(`Found ${schools.length} schools:`);
    schools.forEach(school => {
      console.log(`- ${school.fields["Name"]} (${school.id})`);
    });

    console.log("\nAirtable connection successful!");
    
  } catch (error) {
    console.error("Error testing Airtable connection:", error);
  }
}

testAirtableConnection();