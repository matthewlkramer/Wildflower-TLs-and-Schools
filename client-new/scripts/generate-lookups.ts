import fs from 'fs';
import path from 'path';
import ts from 'typescript';

type LookupConfig = {
  table: string;
  valueColumn: string;
  labelColumn: string;
  schema?: string;
  description?: string;
};

type TableInfo = {
  name: string;
  columns: string[];
  primaryKey?: string;
  relationships: Array<{
    column: string;
    referencedTable: string;
    referencedColumn: string;
  }>;
};

const SRC_PATH = path.join('src', 'types', 'database.types.ts');
const OUT_PATH = path.join('src', 'generated', 'lookups.generated.ts');

// Common label column patterns to try
const LABEL_COLUMN_PATTERNS = [
  'name', 'full_name', 'short_name', 'long_name', 'title', 'label',
  'english_label_short', 'english_label', 'description', 'email',
  'email_or_name', 'address'
];

// Manual overrides for complex cases
const MANUAL_OVERRIDES: Record<string, { primaryKey?: string; labelColumn?: string; skip?: boolean }> = {
  // Tables with non-standard primary keys
  'cohorts': { primaryKey: 'cohort_title', labelColumn: 'cohort_title' },
  'guides': { primaryKey: 'email_or_name', labelColumn: 'email_or_name' },

  // Special label column mappings
  'ref_race_and_ethnicity': { labelColumn: 'english_label_short' },
  'people': { labelColumn: 'full_name' },
  'schools': { labelColumn: 'short_name' },
  'charters': { labelColumn: 'short_name' },

  // Better label columns
  'email_addresses': { labelColumn: 'email_address' },
  'grants': { labelColumn: 'label' },
  'guide_assignments': { labelColumn: 'email_or_name' },
  'notes': { labelColumn: 'title' },
  'ssj_fillout_forms': { labelColumn: 'full_name' },
  'mailing_lists': { labelColumn: 'name' },
  'locations': { labelColumn: 'address' },

  // ref_tables that also have enums (enum for values, ref_table for display labels)
  'ref_race_and_ethnicity': { labelColumn: 'english_label_short' },

  // Tables to skip (not useful as lookups)
  'action_steps': { skip: true },
  'advice': { skip: true },
  'annual_assessment_and_metrics_data': { skip: true },
  'cohort_participation': { skip: true },
  'charter_authorization_actions': { skip: true },
  'charter_authorizers': { skip: true },
  'developer_notes': { skip: true },
  'document_checklist': { skip: true },
  'email_drafts': { skip: true },
  'errors': { skip: true },
  'event_attendance': { skip: true },
  'group_exemption_actions': { skip: true },
  'membership_actions': { skip: true },
  'montessori_certs': { skip: true },
  'nine_nineties': { skip: true },
  'open_date_revisions': { skip: true },
  'people_educator_early_cultivation': { skip: true },
  'people_systems': { skip: true },
  'school_reports_and_submissions': { skip: true },
};

function readSource(filePath: string): ts.SourceFile {
  const code = fs.readFileSync(filePath, 'utf8');
  return ts.createSourceFile(filePath, code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
}

function extractTablesFromSchema(sourceFile: ts.SourceFile): { public: TableInfo[], ref_tables: TableInfo[] } {
  const tables = { public: [] as TableInfo[], ref_tables: [] as TableInfo[] };

  function visitNode(node: ts.Node) {
    // Look for schema definitions like "public: { Tables: { ... } }"
    if (ts.isPropertySignature(node) &&
        ts.isIdentifier(node.name) &&
        (node.name.text === 'public' || node.name.text === 'ref_tables') &&
        ts.isTypeLiteralNode(node.type)) {

      const schemaName = node.name.text as 'public' | 'ref_tables';

      // Look for Tables property within this schema
      for (const schemaProp of node.type.members) {
        if (ts.isPropertySignature(schemaProp) &&
            ts.isIdentifier(schemaProp.name) &&
            schemaProp.name.text === 'Tables' &&
            ts.isTypeLiteralNode(schemaProp.type)) {

          // Extract each table from Tables
          for (const tableProp of schemaProp.type.members) {
            if (ts.isPropertySignature(tableProp) && ts.isIdentifier(tableProp.name)) {
              const tableName = tableProp.name.text;
              const tableInfo = extractTableInfo(tableName, tableProp);
              if (tableInfo) {
                tables[schemaName].push(tableInfo);
              }
            }
          }
        }
      }
    }

    ts.forEachChild(node, visitNode);
  }

  visitNode(sourceFile);
  return tables;
}

function extractTableInfo(tableName: string, tableProp: ts.PropertySignature): TableInfo | null {
  if (!ts.isTypeLiteralNode(tableProp.type)) return null;

  const columns: string[] = [];
  const relationships: Array<{ column: string; referencedTable: string; referencedColumn: string; }> = [];

  // Look for Row property to get column names
  for (const prop of tableProp.type.members) {
    if (ts.isPropertySignature(prop) &&
        ts.isIdentifier(prop.name) &&
        prop.name.text === 'Row' &&
        ts.isTypeLiteralNode(prop.type)) {

      // Extract column names from Row type
      for (const colProp of prop.type.members) {
        if (ts.isPropertySignature(colProp) && ts.isIdentifier(colProp.name)) {
          columns.push(colProp.name.text);
        }
      }
    }

    // Extract relationships
    if (ts.isPropertySignature(prop) &&
        ts.isIdentifier(prop.name) &&
        prop.name.text === 'Relationships' &&
        ts.isArrayTypeNode(prop.type)) {

      // This would need more complex parsing to extract relationship details
      // For now, we'll rely on the manual configuration
    }
  }

  // Determine primary key
  let primaryKey = 'id'; // Default assumption
  if (columns.includes('id')) {
    primaryKey = 'id';
  } else if (columns.includes(`${tableName}_id`)) {
    primaryKey = `${tableName}_id`;
  } else {
    // Try to find a column that looks like a primary key
    const candidateKeys = columns.filter(col =>
      col.endsWith('_id') ||
      col === tableName ||
      col === `${tableName}_title` ||
      col === `${tableName}_name`
    );
    if (candidateKeys.length > 0) {
      primaryKey = candidateKeys[0];
    }
  }

  return {
    name: tableName,
    columns,
    primaryKey,
    relationships
  };
}

function determineLabelColumn(table: TableInfo, schema: 'public' | 'ref_tables'): string {
  const { name, columns, primaryKey } = table;

  // Check manual overrides first
  const override = MANUAL_OVERRIDES[name];
  if (override?.labelColumn) {
    return override.labelColumn;
  }

  // For ref_tables, try standard patterns
  if (schema === 'ref_tables') {
    if (columns.includes('english_label_short')) return 'english_label_short';
    if (columns.includes('label')) return 'label';
    if (columns.includes('value')) return 'value'; // Fallback to value
  }

  // Try common label column patterns
  for (const pattern of LABEL_COLUMN_PATTERNS) {
    if (columns.includes(pattern)) {
      return pattern;
    }
  }

  // Fallback to primary key
  return primaryKey || 'id';
}

function shouldSkipTable(tableName: string): boolean {
  // Skip if manually marked to skip
  if (MANUAL_OVERRIDES[tableName]?.skip) return true;

  // Skip view tables (they're for reading, not lookup)
  if (tableName.startsWith('grid_') || tableName.startsWith('details_')) return true;

  // Skip join/association tables
  if (tableName.includes('_') && (
    tableName.endsWith('_data') ||
    tableName.endsWith('_metrics') ||
    tableName.includes('participation') ||
    tableName.includes('association')
  )) return true;

  return false;
}

function generateLookupsFromTables(tables: { public: TableInfo[], ref_tables: TableInfo[] }): Record<string, LookupConfig> {
  const lookups: Record<string, LookupConfig> = {};

  // Process public tables
  for (const table of tables.public) {
    if (shouldSkipTable(table.name)) continue;

    const override = MANUAL_OVERRIDES[table.name];
    const primaryKey = override?.primaryKey || table.primaryKey || 'id';
    const labelColumn = determineLabelColumn(table, 'public');

    lookups[table.name] = {
      table: table.name,
      valueColumn: primaryKey,
      labelColumn,
      description: `Auto-detected public table lookup for ${table.name}`
    };
  }

  // Process ref_tables (from AST)
  for (const table of tables.ref_tables) {
    if (shouldSkipTable(table.name)) continue;

    const labelColumn = determineLabelColumn(table, 'ref_tables');

    lookups[table.name] = {
      table: table.name,
      valueColumn: 'value',
      labelColumn,
      schema: 'ref_tables',
      description: `Auto-detected ref_tables lookup for ${table.name}`
    };
  }

  // Add known ref_tables as fallback (if not found in AST)
  // These follow the standard ref_tables pattern: value (PK), label (display)
  const knownRefTables = [
    'ref_age_spans',
    'ref_educator_statuses',
    'ref_governance_models',
    'ref_membership_statuses',
    'ref_one_on_one_status',
    'ref_race_and_ethnicity',
    'ref_roles',
    'ref_stage_statuses',
  ];

  for (const refTable of knownRefTables) {
    if (!lookups[refTable]) {
      lookups[refTable] = {
        table: refTable,
        valueColumn: 'value',
        labelColumn: 'label',
        schema: 'ref_tables',
        description: `Known ref_tables lookup for ${refTable} (fallback)`
      };
    }
  }

  // Note: Some tables like ref_race_and_ethnicity are both enums AND ref_tables
  // The enum provides the stored values, but we still need ref_table lookups for display labels

  return lookups;
}

function generateTypeScriptCode(lookups: Record<string, LookupConfig>, stats: { autoDetected: number; manual: number }): string {
  const lookupEntries = Object.entries(lookups)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, config]) => {
      const schemaStr = config.schema ? `\n    schema: '${config.schema}',` : '';
      const descStr = config.description ? `\n    // ${config.description}` : '';

      return `  '${key}': {${descStr}
    table: '${config.table}',
    valueColumn: '${config.valueColumn}',
    labelColumn: '${config.labelColumn}',${schemaStr}
  }`;
    })
    .join(',\n');

  return `// AUTO-GENERATED by scripts/generate-lookups.ts. Do not edit.
// Run "npm run gen:lookups" to regenerate.
// Auto-detected: ${stats.autoDetected} tables, Manual overrides: ${stats.manual} tables

export type LookupConfig = {
  table: string;
  valueColumn: string;
  labelColumn: string;
  schema?: string;
};

export type LookupKey = keyof typeof GENERATED_LOOKUPS;

// Generated lookup configurations from database schema
export const GENERATED_LOOKUPS = {
${lookupEntries}
} as const;

// Helper function to get lookup config by key
export function getLookupConfig(key: LookupKey): LookupConfig {
  return GENERATED_LOOKUPS[key];
}

// Helper function to build cache key for lookup
export function buildLookupCacheKey(lookup: LookupConfig): string {
  const schema = lookup.schema ?? 'public';
  return \`\${schema}|\${lookup.table}|\${lookup.valueColumn}|\${lookup.labelColumn}\`;
}

// All available lookup keys
export const LOOKUP_KEYS = Object.keys(GENERATED_LOOKUPS) as LookupKey[];
`;
}

function main() {
  try {
    console.log('🔍 Parsing database types from', SRC_PATH);

    const sourceFile = readSource(SRC_PATH);
    const tables = extractTablesFromSchema(sourceFile);

    console.log('📋 Found tables:');
    console.log(`   - ${tables.public.length} public tables`);
    console.log(`   - ${tables.ref_tables.length} ref_tables`);

    // Generate lookups
    const lookups = generateLookupsFromTables(tables);

    // Calculate stats
    const manualOverrides = Object.keys(MANUAL_OVERRIDES).filter(key => !MANUAL_OVERRIDES[key].skip);
    const autoDetected = Object.keys(lookups).length - manualOverrides.length;

    console.log('\n🎯 Generated lookups:');
    console.log(`   - ${autoDetected} auto-detected tables`);
    console.log(`   - ${manualOverrides.length} manual overrides`);
    console.log(`   - ${Object.keys(lookups).length} total lookup configurations`);

    // Show some specific detections
    console.log('\n🔧 Key detections:');
    if (lookups.cohorts) {
      console.log(`   - cohorts: PK='${lookups.cohorts.valueColumn}', label='${lookups.cohorts.labelColumn}'`);
    }
    if (lookups.guides) {
      console.log(`   - guides: PK='${lookups.guides.valueColumn}', label='${lookups.guides.labelColumn}'`);
    }
    if (lookups.ref_race_and_ethnicity) {
      console.log(`   - ref_race_and_ethnicity: value='${lookups.ref_race_and_ethnicity.valueColumn}', label='${lookups.ref_race_and_ethnicity.labelColumn}'`);
    }

    // Ensure generated directory exists
    const genDir = path.dirname(OUT_PATH);
    if (!fs.existsSync(genDir)) {
      fs.mkdirSync(genDir, { recursive: true });
    }

    const code = generateTypeScriptCode(lookups, { autoDetected, manual: manualOverrides.length });
    fs.writeFileSync(OUT_PATH, code, 'utf8');

    console.log(`\n✅ Generated lookups to ${OUT_PATH}`);

  } catch (error) {
    console.error('❌ Error generating lookups:', error);
    process.exit(1);
  }
}

// Run if this file is executed directly
main();