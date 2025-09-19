import Airtable from 'airtable';
import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs/promises';
import path from 'node:path';

interface TableConfig {
  /** Human friendly name shown in logs */
  name?: string;
  /** Airtable table name */
  airtableTable: string;
  /** Optional Airtable view to scope queries */
  view?: string;
  /** Optional Airtable field (formula) containing the last modified time string */
  lastModifiedField?: string;
  /** Supabase table name */
  supabaseTable: string;
  /** Column in Supabase used to match rows */
  primaryKey: string;
  /** Optional column in Supabase to store the Airtable record id */
  airtableIdField?: string;
  /** If true use the Airtable record id as the Supabase primary key value */
  useAirtableRecordId?: boolean;
  /** Explicit field allow-list. If omitted all Airtable fields are copied */
  fields?: string[];
}

interface SyncConfig {
  /** Airtable base id. Falls back to AIRTABLE_BASE_ID env var */
  baseId?: string;
  /** Per-table sync configuration */
  tables: TableConfig[];
}

interface SyncState {
  [tableName: string]: {
    lastSyncedAt: string;
  };
}

interface ParsedArgs {
  configPath: string;
  statePath: string;
  dryRun: boolean;
}

interface FieldDifference {
  field: string;
  airtableValue: unknown;
  supabaseValue: unknown;
}

interface DiffReport {
  primaryKeyValue: string;
  lastModifiedTime: string | null;
  differences: FieldDifference[];
}

const DEFAULT_CONFIG_PATH = path.resolve(process.cwd(), 'scripts/airtable-sync.config.json');
const DEFAULT_STATE_PATH = path.resolve(process.cwd(), 'scripts/airtable-sync-state.json');

function parseArgs(): ParsedArgs {
  const args = process.argv.slice(2);
  const parsed: ParsedArgs = {
    configPath: DEFAULT_CONFIG_PATH,
    statePath: DEFAULT_STATE_PATH,
    dryRun: false,
  };

  for (const arg of args) {
    if (!arg.startsWith('--')) continue;
    const [flag, rawValue] = arg.slice(2).split('=');
    const value = rawValue ?? 'true';
    switch (flag) {
      case 'config':
        parsed.configPath = path.resolve(process.cwd(), value);
        break;
      case 'state':
        parsed.statePath = path.resolve(process.cwd(), value);
        break;
      case 'dry-run':
      case 'dryRun':
        parsed.dryRun = value === 'true';
        break;
      default:
        console.warn(`Unknown flag: --${flag}`);
    }
  }

  return parsed;
}

async function loadConfig(configPath: string): Promise<SyncConfig> {
  try {
    const raw = await fs.readFile(configPath, 'utf8');
    const config = JSON.parse(raw) as SyncConfig;
    if (!config.tables?.length) {
      throw new Error('Config must include at least one table definition.');
    }
    return config;
  } catch (error) {
    throw new Error(`Unable to read config at ${configPath}: ${(error as Error).message}`);
  }
}

async function loadState(statePath: string): Promise<SyncState> {
  try {
    const raw = await fs.readFile(statePath, 'utf8');
    return JSON.parse(raw) as SyncState;
  } catch (error) {
    return {};
  }
}

async function saveState(statePath: string, state: SyncState) {
  await fs.mkdir(path.dirname(statePath), { recursive: true });
  const payload = JSON.stringify(state, null, 2);
  await fs.writeFile(statePath, `${payload}\n`, 'utf8');
}

function assertEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return '' + value;
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return JSON.stringify(value);
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(',')}]`;
  }
  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b));
    return `{${entries.map(([key, val]) => `${key}:${stableStringify(val)}`).join(',')}}`;
  }
  return String(value);
}

function buildRow(record: Airtable.Record<any>, table: TableConfig) {
  const rawFields = record.fields as Record<string, unknown>;
  const fieldNames = table.fields ?? Object.keys(rawFields);
  const row: Record<string, unknown> = {};

  for (const fieldName of fieldNames) {
    if (Object.prototype.hasOwnProperty.call(rawFields, fieldName)) {
      row[fieldName] = rawFields[fieldName];
    } else {
      row[fieldName] = null;
    }
  }

  if (table.airtableIdField) {
    row[table.airtableIdField] = record.id;
  }

  if (table.useAirtableRecordId) {
    row[table.primaryKey] = record.id;
  } else if (!Object.prototype.hasOwnProperty.call(row, table.primaryKey)) {
    const pkValue = rawFields[table.primaryKey];
    if (pkValue !== undefined) {
      row[table.primaryKey] = pkValue;
    }
  }

  return row;
}

function getPrimaryKeyValue(record: Airtable.Record<any>, table: TableConfig) {
  if (table.useAirtableRecordId) {
    return record.id;
  }
  const rawFields = record.fields as Record<string, unknown>;
  const value = rawFields[table.primaryKey];
  if (value === undefined) {
    throw new Error(
      `Record ${record.id} from ${table.airtableTable} is missing primary key field ${table.primaryKey}`,
    );
  }
  return value as string | number;
}

function groupDifferences(reports: DiffReport[]): string {
  if (!reports.length) return '  No differences found.';
  const lines: string[] = [];
  for (const report of reports) {
    const header = `  • ${report.primaryKeyValue}${report.lastModifiedTime ? ` (last modified ${report.lastModifiedTime})` : ''}`;
    lines.push(header);
    for (const diff of report.differences) {
      const airtableValue = stableStringify(diff.airtableValue);
      const supabaseValue = stableStringify(diff.supabaseValue);
      lines.push(`      - ${diff.field}: Airtable=${airtableValue} | Supabase=${supabaseValue}`);
    }
  }
  return lines.join('\n');
}

async function run() {
  const args = parseArgs();
  const config = await loadConfig(args.configPath);
  const state = await loadState(args.statePath);

  const airtableApiKey = assertEnv('AIRTABLE_API_KEY');
  const airtableBaseId = config.baseId ?? assertEnv('AIRTABLE_BASE_ID');
  const supabaseUrl = assertEnv('SUPABASE_URL');
  const supabaseKey = assertEnv('SUPABASE_SERVICE_ROLE_KEY');

  const airtableBase = new Airtable({ apiKey: airtableApiKey }).base(airtableBaseId);
  const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });

  const newState: SyncState = { ...state };
  const summaryLines: string[] = [];

  for (const table of config.tables) {
    const label = table.name ?? table.supabaseTable;
    console.log(`\n=== Syncing ${label} ===`);

    const lastSyncedAt = state[table.supabaseTable]?.lastSyncedAt;
    const filterFormula = lastSyncedAt ? `IS_AFTER(LAST_MODIFIED_TIME(), '${lastSyncedAt}')` : undefined;

    const airtableRecords = await airtableBase(table.airtableTable)
      .select({
        view: table.view,
        filterByFormula: filterFormula,
      })
      .all();

    if (!airtableRecords.length) {
      console.log('  No Airtable changes detected.');
      newState[table.supabaseTable] = { lastSyncedAt: new Date().toISOString() };
      summaryLines.push(`${label}: inserted 0 new record(s); 0 record(s) with differences.`);
      continue;
    }

    const primaryKeyValues = airtableRecords.map((record) => getPrimaryKeyValue(record, table));

    const { data: existingRows, error: existingError } = await supabase
      .from(table.supabaseTable)
      .select()
      .in(table.primaryKey, primaryKeyValues);

    if (existingError) {
      throw new Error(`Supabase select failed for table ${table.supabaseTable}: ${existingError.message}`);
    }

    const supabaseByPk = new Map<string | number, Record<string, unknown>>();
    for (const row of existingRows ?? []) {
      const key = row[table.primaryKey] as string | number;
      supabaseByPk.set(key, row);
    }

    const rowsToInsert: Record<string, unknown>[] = [];
    const diffReports: DiffReport[] = [];

    for (const record of airtableRecords) {
      const pkValue = getPrimaryKeyValue(record, table);
      const supabaseRow = supabaseByPk.get(pkValue);
      if (!supabaseRow) {
        rowsToInsert.push(buildRow(record, table));
        continue;
      }

      const fieldsToCompare = table.fields ?? Object.keys(record.fields as Record<string, unknown>);
      const differences: FieldDifference[] = [];
      for (const fieldName of fieldsToCompare) {
        const airtableValue = (record.fields as Record<string, unknown>)[fieldName] ?? null;
        const supabaseValue = (supabaseRow as Record<string, unknown>)[fieldName] ?? null;
        if (stableStringify(airtableValue) !== stableStringify(supabaseValue)) {
          differences.push({ field: fieldName, airtableValue, supabaseValue });
        }
      }

      if (differences.length) {
        let lastModified: string | null = null;
        if (table.lastModifiedField) {
          const raw = (record.fields as Record<string, unknown>)[table.lastModifiedField];
          lastModified = typeof raw === 'string' ? raw : null;
        }
        diffReports.push({
          primaryKeyValue: String(pkValue),
          lastModifiedTime: lastModified,
          differences,
        });
      }
    }

    if (rowsToInsert.length) {
      console.log(`  Found ${rowsToInsert.length} new Airtable record(s) to insert.`);
      if (!args.dryRun) {
        const chunkSize = 50;
        for (let i = 0; i < rowsToInsert.length; i += chunkSize) {
          const chunk = rowsToInsert.slice(i, i + chunkSize);
          const { error: insertError } = await supabase.from(table.supabaseTable).insert(chunk);
          if (insertError) {
            throw new Error(`Supabase insert failed for table ${table.supabaseTable}: ${insertError.message}`);
          }
        }
      } else {
        console.log('  Dry run enabled – skipping inserts.');
      }
    } else {
      console.log('  No new Airtable records to insert.');
    }

    if (diffReports.length) {
      console.log('  Differences detected:');
      console.log(groupDifferences(diffReports));
    } else {
      console.log('  No field-level differences detected.');
    }

    newState[table.supabaseTable] = { lastSyncedAt: new Date().toISOString() };
    summaryLines.push(
      `${label}: inserted ${rowsToInsert.length} new record(s); ${diffReports.length} record(s) with differences.`,
    );
  }

  if (!args.dryRun) {
    await saveState(args.statePath, newState);
  } else {
    console.log('\nDry run mode – state file not updated.');
  }

  if (summaryLines.length) {
    console.log('\n=== Sync summary ===');
    for (const line of summaryLines) {
      console.log(`- ${line}`);
    }
  }
}

run().catch((error: unknown) => {
  if (error && typeof error === 'object' && 'message' in error) {
    console.error((error as { message: string }).message);
  } else {
    console.error(error);
  }
  process.exitCode = 1;
});
