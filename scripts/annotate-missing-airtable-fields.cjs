const fs = require('fs');
const path = require('path');

const AIRTABLE = path.join(__dirname, '..', 'shared', 'airtable-schema.ts');
const SCHEMA = path.join(__dirname, '..', 'shared', 'schema.ts');

function camelize(label) {
  return label
    .replace(/[^A-Za-z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .map((w, i) => (i === 0 ? w.toLowerCase() : w.slice(0, 1).toUpperCase() + w.slice(1).toLowerCase()))
    .join('');
}

function loadAirtableFields() {
  const src = fs.readFileSync(AIRTABLE, 'utf8');
  const regex = /export const\s+([A-Z0-9_]+)_FIELDS\s*=\s*\{([\s\S]*?)\n\};/g;
  const groups = {};
  let m;
  while ((m = regex.exec(src))) {
    const name = m[1];
    const body = m[2];
    const keyRegex = /\n\s*([A-Za-z0-9_]+)\s*:/g;
    const keys = new Set();
    let km;
    while ((km = keyRegex.exec(body))) {
      keys.add(km[1]);
    }
    groups[name] = Array.from(keys);
  }
  return groups;
}

function loadInterfaces() {
  const src = fs.readFileSync(SCHEMA, 'utf8');
  const regex = /(export interface\s+([A-Za-z0-9_]+)\s*\{)([\s\S]*?)(\n\})/g;
  const interfaces = [];
  let m;
  while ((m = regex.exec(src))) {
    const [full, header, name, body, close] = m;
    const propRegex = /\n\s*([A-Za-z_][A-Za-z0-9_]*)\??:\s*[^;]+;/g;
    const props = new Set();
    let pm;
    while ((pm = propRegex.exec(body))) {
      props.add(pm[1]);
    }
    interfaces.push({ name, start: m.index, end: m.index + full.length, header, body, close, props });
  }
  return { src: fs.readFileSync(SCHEMA, 'utf8'), interfaces };
}

const mapGroupToInterface = new Map([
  ['SCHOOLS', 'School'],
  ['EDUCATORS', 'Educator'],
  ['LOCATIONS', 'Location'],
  ['EDUCATORS_X_SCHOOLS', 'EducatorSchoolAssociation'],
  ['GUIDES_ASSIGNMENTS', 'GuideAssignment'],
  ['GOVERNANCE_DOCS', 'GovernanceDocument'],
  ['SCHOOL_NOTES', 'SchoolNote'],
  ['GRANTS', 'Grant'],
  ['LOANS', 'Loan'],
  ['_990S', 'Charter990'],
  ['ACTION_STEPS', 'CharterActionStep'],
  ['EMAIL_ADDRESSES', 'EmailAddress'],
]);

function main() {
  const groups = loadAirtableFields();
  const { src, interfaces } = loadInterfaces();
  let out = src;
  out = out.replace(/\n\s*\/\/ Missing Airtable fields:[^\n]*\n/g, '\n');

  interfaces
    .slice()
    .reverse()
    .forEach((iface) => {
      const groupEntry = Array.from(mapGroupToInterface.entries()).find(([, iname]) => iname === iface.name);
      if (!groupEntry) return;
      const [groupKey] = groupEntry;
      const keys = groups[groupKey] || [];
      if (!keys.length) return;
      const camelKeys = new Set(keys.map((k) => camelize(k)));
      const props = iface.props;
      const missing = Array.from(camelKeys).filter((ck) => !props.has(ck));
      if (!missing.length) return;
      const insertPos = iface.start + iface.header.length;
      const comment = `\n  // Missing Airtable fields: ${missing.sort().join(', ')}\n`;
      out = out.slice(0, insertPos) + comment + out.slice(insertPos);
    });

  fs.writeFileSync(SCHEMA, out, 'utf8');
  console.log("Annotated.");
}

main();


