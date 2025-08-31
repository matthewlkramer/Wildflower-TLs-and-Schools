#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const baseId = process.env.AIRTABLE_BASE_ID;
const apiKey = process.env.AIRTABLE_API_KEY;
if (!baseId || !apiKey) {
  console.error('Set AIRTABLE_BASE_ID and AIRTABLE_API_KEY in env');
  process.exit(1);
}

const url = `https://api.airtable.com/v0/meta/bases/${baseId}/tables`;

async function run() {
  const resp = await fetch(url, { headers: { Authorization: `Bearer ${apiKey}` } });
  if (!resp.ok) {
    console.error('Failed to fetch Airtable schema:', resp.status, resp.statusText);
    process.exit(2);
  }
  const data = await resp.json();
  const tables = (data?.tables || []).map(t => ({
    id: t.id,
    name: t.name,
    fields: (t.fields || []).map(f => ({
      id: f.id,
      name: f.name,
      type: f.type,
      options: f.options || undefined
    }))
  }));
  const out = { baseId, baseName: data?.name || 'Airtable Base', tables };
  const schemaPath = path.join(process.cwd(), 'schema.txt');
  fs.writeFileSync(schemaPath, JSON.stringify(out, null, 2), 'utf-8');
  console.log('Wrote', schemaPath, `(tables: ${tables.length})`);
}

run().catch(err => { console.error(err); process.exit(1); });

