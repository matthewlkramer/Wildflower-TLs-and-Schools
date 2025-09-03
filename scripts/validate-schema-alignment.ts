/**
 * Validates that Airtable field names referenced in server/simple-storage.ts
 * match the generated constants from shared/airtable-schema.ts (sourced from schema.txt).
 *
 * It scans simple-storage.ts for patterns like base("<Table>") and
 * record.fields["<Field>"] in the surrounding block, then compares each field
 * to the corresponding FIELDS constant for that table.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Map table display names to their exported constant prefix in shared/airtable-schema.ts
// Extend this map as needed for other tables
const TABLE_CONST_PREFIX: Record<string, string> = {
  'Schools': 'SCHOOLS_FIELDS',
  'Educators': 'EDUCATORS_FIELDS',
  'Educators x Schools': 'EDUCATORS_X_SCHOOLS_FIELDS',
  'Locations': 'LOCATIONS_FIELDS',
  'Guide assignments': 'GUIDE_ASSIGNMENTS_FIELDS',
  'School governance documents': 'SCHOOL_GOVERNANCE_DOCUMENTS_FIELDS',
  'School notes': 'SCHOOL_NOTES_FIELDS',
  'Grants (WF)': 'GRANTS_WF_FIELDS',
  'Loans': 'LOANS_FIELDS',
  '990s': 'N990S_FIELDS',
  'Charters': 'CHARTERS_FIELDS',
  'Governance docs': 'GOVERNANCE_DOCS_FIELDS',
  'Action steps': 'ACTION_STEPS_FIELDS',
};

function loadAirtableFieldsConstants(): Record<string, Set<string>> {
  const file = path.resolve(__dirname, '..', 'shared', 'airtable-schema.ts');
  const src = fs.readFileSync(file, 'utf8');
  const constants: Record<string, Set<string>> = {};
  // crude parse: find export const NAME_FIELDS = { ... } and collect values
  const regex = /export const\s+([A-Z0-9_]+)_FIELDS\s*=\s*\{([\s\S]*?)\}\s*as const;?/g;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(src))) {
    const name = m[1] + '_FIELDS';
    const body = m[2];
    const valueRegex = /:\s*"([^"]+)"/g;
    const vals = new Set<string>();
    let vm: RegExpExecArray | null;
    while ((vm = valueRegex.exec(body))) {
      vals.add(vm[1]);
    }
    constants[name] = vals;
  }
  return constants;
}

function scanSimpleStorage(): Array<{ table: string; fields: string[]; ctx: string }>{
  const file = path.resolve(__dirname, '..', 'server', 'simple-storage.ts');
  const src = fs.readFileSync(file, 'utf8');
  const results: Array<{ table: string; fields: string[]; ctx: string }> = [];
  const baseCallRegex = /base\(\"([^\"]+)\"\)\)[^\n]*\{([\s\S]*?)\n\s*\}\n/gm;
  let m: RegExpExecArray | null;
  while ((m = baseCallRegex.exec(src))) {
    const table = m[1];
    const block = m[2];
    const fieldRegex = /record\.fields\[\"([^\"]+)\"\]/g;
    const fields = new Set<string>();
    let fm: RegExpExecArray | null;
    while ((fm = fieldRegex.exec(block))) {
      fields.add(fm[1]);
    }
    if (fields.size) {
      results.push({ table, fields: [...fields], ctx: block.slice(0, 400) });
    }
  }
  return results;
}

function main() {
  const constants = loadAirtableFieldsConstants();
  const scans = scanSimpleStorage();
  const issues: string[] = [];
  for (const { table, fields } of scans) {
    const constName = TABLE_CONST_PREFIX[table];
    if (!constName) {
      issues.push(`No constant mapping for table: ${table}`);
      continue;
    }
    const allowed = constants[constName];
    if (!allowed) {
      issues.push(`Constant ${constName} not found in shared/airtable-schema.ts for table ${table}`);
      continue;
    }
    for (const f of fields) {
      if (!allowed.has(f)) {
        issues.push(`Table ${table}: field "${f}" not found in ${constName}`);
      }
    }
  }

  if (issues.length) {
    console.log('Schema alignment issues found:');
    for (const i of issues) console.log(' - ' + i);
    process.exitCode = 1;
  } else {
    console.log('All referenced Airtable fields in simple-storage.ts match shared/airtable-schema.ts');
  }
}

main();
