import fs from 'fs';
import path from 'path';
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

const OUT_PATH = path.join('src', 'shared', 'types', 'database.types.ts');

async function generateDatabaseTypes() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials');
    process.exit(1);
  }

  console.log('🌐 Fetching schema from edge function...');

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data, error } = await supabase.functions.invoke('schema-types-export', {
    method: 'GET'
  });

  if (error) {
    console.error('❌ Edge function error:', error);
    process.exit(1);
  }

  if (!data || !data.tables) {
    console.error('❌ No schema data received');
    process.exit(1);
  }

  console.log(`✅ Fetched schema with ${data.tables.length} tables across schemas:`, data.requested_schemas);

  // Generate TypeScript database types
  const typeDefinition = generateTypeScriptTypes(data);

  // Write to file
  fs.writeFileSync(OUT_PATH, typeDefinition);
  console.log(`✅ Generated database types to ${OUT_PATH}`);
}

function generateTypeScriptTypes(schemaData: any): string {
  const { tables, columns_by_table, enums_by_type } = schemaData;

  let output = `export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
`;

  // Group tables by schema
  const tablesBySchema: Record<string, any[]> = {};
  for (const table of tables) {
    if (!tablesBySchema[table.schema_name]) {
      tablesBySchema[table.schema_name] = [];
    }
    tablesBySchema[table.schema_name].push(table);
  }

  // Generate each schema
  for (const [schemaName, schemaTables] of Object.entries(tablesBySchema)) {
    output += `  ${schemaName}: {\n`;
    output += `    Tables: {\n`;

    // Generate tables for this schema
    for (const table of schemaTables) {
      const tableKey = `${table.schema_name}.${table.table_name}`;
      const tableCols = columns_by_table[tableKey] || [];

      output += `      ${table.table_name}: {\n`;
      output += `        Row: {\n`;

      // Generate columns
      for (const col of tableCols) {
        const tsType = mapPostgresTypeToTS(col.data_type, col.is_nullable);
        output += `          ${col.column_name}: ${tsType}\n`;
      }

      output += `        }\n`;
      output += `        Insert: {\n`;

      // Generate insert types (same as Row but optional)
      for (const col of tableCols) {
        const tsType = mapPostgresTypeToTS(col.data_type, true); // All optional for insert
        output += `          ${col.column_name}?: ${tsType}\n`;
      }

      output += `        }\n`;
      output += `        Update: {\n`;

      // Generate update types (same as insert)
      for (const col of tableCols) {
        const tsType = mapPostgresTypeToTS(col.data_type, true);
        output += `          ${col.column_name}?: ${tsType}\n`;
      }

      output += `        }\n`;
      output += `      }\n`;
    }

    output += `    }\n`;
    output += `    Views: {\n`;
    output += `      [_ in never]: never\n`;
    output += `    }\n`;
    output += `    Functions: {\n`;
    output += `      [_ in never]: never\n`;
    output += `    }\n`;
    output += `    Enums: {\n`;

    // Generate enums for this schema
    for (const [enumKey, enumValues] of Object.entries(enums_by_type)) {
      const [enumSchema, enumName] = enumKey.split('.');
      if (enumSchema === schemaName) {
        const values = (enumValues as any[]).map(e => `"${e.enum_label}"`).join(' | ');
        output += `      ${enumName}: ${values}\n`;
      }
    }

    output += `    }\n`;
    output += `    CompositeTypes: {\n`;
    output += `      [_ in never]: never\n`;
    output += `    }\n`;
    output += `  }\n`;
  }

  output += `}\n\n`;

  // Add helper types
  output += `type PublicSchema = Database[keyof Database]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof Database["public"]["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof Database
}
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof Database["public"]["CompositeTypes"]
    ? Database["public"]["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
`;

  return output;
}

function mapPostgresTypeToTS(pgType: string, isNullable: boolean): string {
  let baseType: string;

  switch (pgType) {
    case 'text':
    case 'varchar':
    case 'char':
    case 'character varying':
    case 'character':
    case 'uuid':
      baseType = 'string';
      break;
    case 'integer':
    case 'int4':
    case 'int8':
    case 'bigint':
    case 'smallint':
    case 'int2':
    case 'numeric':
    case 'decimal':
    case 'real':
    case 'float4':
    case 'double precision':
    case 'float8':
      baseType = 'number';
      break;
    case 'boolean':
    case 'bool':
      baseType = 'boolean';
      break;
    case 'timestamp':
    case 'timestamp without time zone':
    case 'timestamp with time zone':
    case 'timestamptz':
    case 'date':
    case 'time':
    case 'time without time zone':
    case 'time with time zone':
    case 'timetz':
      baseType = 'string';
      break;
    case 'json':
    case 'jsonb':
      baseType = 'Json';
      break;
    case 'bytea':
      baseType = 'string';
      break;
    case 'ARRAY':
      baseType = 'unknown[]';
      break;
    default:
      if (pgType.startsWith('_')) {
        // Array type
        const elementType = mapPostgresTypeToTS(pgType.substring(1), false);
        baseType = `${elementType}[]`;
      } else {
        baseType = 'unknown';
      }
  }

  return isNullable ? `${baseType} | null` : baseType;
}

generateDatabaseTypes().catch(console.error);