/*
  Update one school's Website/Facebook/Instagram by name contains.
  Usage examples:
    tsx scripts/update-one-social.ts --name="Magnolia Blossom Montessori" --instagram="https://www.instagram.com/magnolia_montessori/"
*/
import 'dotenv/config';
import Airtable from 'airtable';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
  console.error('Missing AIRTABLE_API_KEY or AIRTABLE_BASE_ID');
  process.exit(1);
}

const args = process.argv.slice(2);
function getArg(k: string): string | undefined {
  const hit = args.find(a => a.startsWith(`--${k}=`));
  return hit ? hit.substring(k.length + 3) : undefined;
}

const nameContains = getArg('name');
const website = getArg('website');
const facebook = getArg('facebook');
const instagram = getArg('instagram');

if (!nameContains) {
  console.error('Missing --name=...');
  process.exit(1);
}
if (!website && !facebook && !instagram) {
  console.error('Provide at least one of --website/--facebook/--instagram');
  process.exit(1);
}

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

async function run() {
  const escaped = nameContains.replace(/'/g, "\\'");
  const formula = `FIND('${escaped}', {Name}&'')>0`;
  const records = await base('Schools').select({ filterByFormula: formula, maxRecords: 5 }).all();
  if (records.length === 0) {
    console.error('No records matched');
    process.exit(2);
  }
  if (records.length > 1) {
    console.error('Multiple records matched; refusing to update. Matches:');
    for (const r of records) console.error(`- ${r.get('Name') || r.get('School Name')} (${r.id})`);
    process.exit(3);
  }

  const rec = records[0];
  const fields: Record<string, any> = {};
  if (website) fields['Website'] = website;
  if (facebook) fields['Facebook'] = facebook;
  if (instagram) fields['Instagram'] = instagram;

  await base('Schools').update([{ id: rec.id, fields }]);
  console.log('Updated', rec.id, rec.get('Name') || rec.get('School Name'), fields);
}

run().catch(err => { console.error(err); process.exit(1); });
