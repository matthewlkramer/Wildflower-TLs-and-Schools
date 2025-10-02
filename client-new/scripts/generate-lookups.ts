import fs from 'fs';
import path from 'path';
import ts from 'typescript';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env.local
try {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    for (const line of envContent.split('\n')) {
      const [key, value] = line.split('=');
      if (key && value && !process.env[key]) {
        process.env[key] = value;
      }
    }
  }
} catch (err) {
  // Ignore env loading errors
}

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

const SRC_PATH = path.join('src', 'shared', 'types', 'database.types.ts');
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
    let primaryKey = override?.primaryKey || table.primaryKey || 'id';

    // For zref tables: if detected PK is 'id' but table doesn't have 'id' column and has 'value' column, use 'value'
    if (table.name.startsWith('zref_') && primaryKey === 'id' && !table.columns.includes('id') && table.columns.includes('value')) {
      primaryKey = 'value';
    }

    // For label column: use 'label' if it exists, otherwise use detected label column logic
    let labelColumn: string;
    if (override?.labelColumn) {
      labelColumn = override.labelColumn;
    } else if (table.columns.includes('label')) {
      labelColumn = 'label';
    } else {
      labelColumn = determineLabelColumn(table, 'public');
    }

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

  // No longer need fallback for ref_tables since they've been migrated to public schema as zref_ref_*

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

function convertEdgeFunctionDataToTables(schemaData: any): { public: TableInfo[], ref_tables: TableInfo[] } {
  const result = { public: [] as TableInfo[], ref_tables: [] as TableInfo[] };
  const { tables, columns_by_table, primary_keys_by_table } = schemaData;

  // Debug: check what primary_keys_by_table contains for a specific table
  if (primary_keys_by_table && primary_keys_by_table['public.zref_race_and_ethnicity']) {
    console.log('🔍 Debug: primary_keys_by_table for zref_race_and_ethnicity:',
      JSON.stringify(primary_keys_by_table['public.zref_race_and_ethnicity'], null, 2));
  } else {
    console.log('🔍 Debug: No primary key data found for zref_race_and_ethnicity');
    console.log('🔍 Available keys in primary_keys_by_table:', Object.keys(primary_keys_by_table || {}).filter(k => k.includes('zref')).slice(0, 5));
  }

  for (const table of tables) {
    const { schema_name, table_name, table_type } = table;

    // Skip views and materialized views for lookups
    if (table_type !== 'BASE TABLE') continue;

    // Get columns for this table
    const tableColumns = columns_by_table?.[`${schema_name}.${table_name}`] || [];
    const columnNames = tableColumns.map((col: any) => col.column_name);

    // Get primary key for this table
    const primaryKeys = primary_keys_by_table?.[`${schema_name}.${table_name}`] || [];
    // The edge function returns primary keys as an array of strings (column names)
    const primaryKey = primaryKeys.length > 0 ? primaryKeys[0] : undefined;

    // Debug: log tables without primary keys
    if (!primaryKey && table_name.startsWith('zref_')) {
      console.log(`⚠️  Table ${schema_name}.${table_name} has no primary key defined. Columns:`, columnNames);
    }

    // Create TableInfo with rich data
    const tableInfo: TableInfo = {
      name: table_name,
      columns: columnNames,
      primaryKey,
      relationships: [] // Could be populated from foreign_keys_by_table if needed
    };

    // Add to appropriate schema
    if (schema_name === 'public') {
      result.public.push(tableInfo);
    } else if (schema_name === 'ref_tables') {
      result.ref_tables.push(tableInfo);
    }
    // Note: gsync and storage schemas available but not used for lookups
  }

  return result;
}

async function fetchSchemaFromEdgeFunction(): Promise<{ public: TableInfo[], ref_tables: TableInfo[] } | null> {
  try {
    console.log('🌐 Fetching complete schema from edge function...');

    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.log('⚠️  No Supabase credentials found, falling back to local types file');
      return null;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase.functions.invoke('schema-types-export', {
      method: 'GET'
    });

    if (error) {
      console.log('⚠️  Edge function error, falling back to local types file:');
      console.log('   Error:', error.message);
      console.log('   Context:', error.context || 'No additional context');
      return null;
    }

    if (!data || !data.tables) {
      console.log('⚠️  No tables data from edge function, falling back to local types file');
      console.log('   Received data structure:', JSON.stringify(data, null, 2).substring(0, 500) + '...');
      return null;
    }

    console.log('✅ Successfully fetched schema from edge function');
    console.log(`   Found ${data.tables.length} tables across schemas:`, data.requested_schemas);

    // Log full response structure to see all available data
    const responseKeys = Object.keys(data);
    console.log('   Response contains keys:', responseKeys);

    if (data.columns) {
      console.log(`   Found ${data.columns.length} columns`);
      const sampleColumn = data.columns.find((c: any) => c.table_name === 'ref_race_and_ethnicity') || data.columns[0];
      if (sampleColumn) {
        console.log('   Sample column structure:', JSON.stringify(sampleColumn, null, 2));
      }
    }

    if (data.enums) {
      console.log(`   Found ${data.enums.length} enums`);
      const sampleEnum = data.enums[0];
      if (sampleEnum) {
        console.log('   Sample enum structure:', JSON.stringify(sampleEnum, null, 2));
      }
    }

    // Convert edge function table metadata to our TableInfo format
    return convertEdgeFunctionDataToTables(data);
  } catch (err) {
    console.log('⚠️  Error fetching from edge function, falling back to local types file:', err);
    return null;
  }
}

async function main() {
  try {
    // Try to fetch from edge function first
    let tables = await fetchSchemaFromEdgeFunction();

    // Fallback to local file
    if (!tables) {
      console.log('🔍 Parsing database types from', SRC_PATH);
      const sourceFile = readSource(SRC_PATH);
      tables = extractTablesFromSchema(sourceFile);
    }

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
main().catch((error) => {
  console.error('❌ Error in main:', error);
  process.exit(1);
});