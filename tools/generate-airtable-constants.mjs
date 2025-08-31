#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const root = process.cwd();
const schemaPath = path.join(root, 'schema.txt');
if (!fs.existsSync(schemaPath)) {
  console.error('schema.txt not found at project root');
  process.exit(1);
}

/** @type {{baseId:string,baseName:string,tables:Array<{id:string,name:string,fields:Array<any>}>}} */
const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));

function sanitizeIdent(name) {
  return name.replace(/[^A-Za-z0-9_]/g, '_').replace(/^\d/, '_$&');
}

function tableConstName(tableName) {
  return sanitizeIdent(tableName).toUpperCase();
}

function generateConstants() {
  const lines = [];
  lines.push('// Auto-generated from schema.txt. Do not edit manually.');
  lines.push(`// Base: ${schema.baseName} (${schema.baseId})`);
  lines.push('');
  schema.tables.forEach(t => {
    const tn = tableConstName(t.name);
    lines.push(`// === ${t.name} ===`);
    lines.push(`export const ${tn}_FIELDS = {`);
    const seen = new Set();
    t.fields.forEach(f => {
      const key = sanitizeIdent(f.name);
      if (seen.has(key)) return;
      seen.add(key);
      const val = JSON.stringify(f.name);
      lines.push(`  ${key}: ${val},`);
    });
    lines.push('} as const;');
    const optionFields = t.fields.filter(f => f.type === 'singleSelect' || f.type === 'multipleSelects');
    optionFields.forEach(f => {
      const opts = (f.options?.choices || []).map(c => c.name);
      const constName = `${tn}_OPTIONS_${sanitizeIdent(f.name).toUpperCase()}`;
      lines.push(`export const ${constName}: string[] = ${JSON.stringify(opts, null, 2)};`);
    });
    lines.push('');
  });
  return lines.join('\n');
}

const outClient = path.join(root, 'client', 'src', 'constants', 'airtable-schema.ts');
const outShared = path.join(root, 'shared', 'airtable-schema.ts');
const contents = generateConstants();
fs.mkdirSync(path.dirname(outClient), { recursive: true });
fs.mkdirSync(path.dirname(outShared), { recursive: true });
fs.writeFileSync(outClient, contents, 'utf-8');
fs.writeFileSync(outShared, contents, 'utf-8');
console.log('Wrote', outClient);
console.log('Wrote', outShared);
