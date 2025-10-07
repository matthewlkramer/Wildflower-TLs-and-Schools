import fs from 'fs';
import path from 'path';
import ts from 'typescript';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
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
  // Ignore
}

type EnumOptionsMap = Record<string, string[]>;

type FieldInfo = {
  baseType: 'string' | 'number' | 'boolean' | 'json' | 'enum' | 'unknown';
  enumName?: string;
  array?: boolean;
};

type FieldMap = Record<string, FieldInfo>;
type FieldToEnumMap = Record<string, string>; // field key -> enum name

const SRC_PATH = path.join('src', 'shared', 'types', 'database.types.ts');
const OUT_PATH = path.join('src', 'generated', 'enums.generated.ts');

function readSource(filePath: string): ts.SourceFile {
  const code = fs.readFileSync(filePath, 'utf8');
  return ts.createSourceFile(filePath, code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
}


function getPropertyName(name: ts.PropertyName): string | undefined {
  if (ts.isIdentifier(name)) return name.text;
  if (ts.isStringLiteral(name) || ts.isNumericLiteral(name)) return name.text;
  return undefined;
}

function extractFieldTypes(sourceFile: ts.SourceFile): FieldMap {
  const fieldMap: FieldMap = {};
  for (const stmt of sourceFile.statements) {
    if (ts.isTypeAliasDeclaration(stmt) && stmt.name.text === 'Database' && ts.isTypeLiteralNode(stmt.type)) {
      const publicType = getTypeLiteralProperty(stmt.type, 'public');
      if (!publicType) continue;
      const tablesType = getTypeLiteralProperty(publicType, 'Tables');
      if (!tablesType) continue;
      for (const member of tablesType.members) {
        if (!ts.isPropertySignature(member) || !member.type || !member.name) continue;
        const tableName = getPropertyName(member.name as ts.PropertyName);
        if (!tableName || !ts.isTypeLiteralNode(member.type)) continue;
        const rowType = getTypeLiteralProperty(member.type, 'Row');
        if (!rowType) continue;
        for (const column of rowType.members) {
          if (!ts.isPropertySignature(column) || !column.type || !column.name) continue;
          const columnName = getPropertyName(column.name as ts.PropertyName);
          if (!columnName) continue;
          const info = describeType(column.type, sourceFile);
          fieldMap[`public.${tableName}.${columnName}`] = info;
        }
      }
    }
  }
  return fieldMap;
}

function getTypeLiteralProperty(typeLiteral: ts.TypeLiteralNode, name: string): ts.TypeLiteralNode | undefined {
  for (const member of typeLiteral.members) {
    if (ts.isPropertySignature(member) && member.type && member.name) {
      const propName = getPropertyName(member.name as ts.PropertyName);
      if (propName === name) {
        if (ts.isTypeLiteralNode(member.type)) return member.type;
      }
    }
  }
  return undefined;
}

function stripNulls(node: ts.TypeNode): ts.TypeNode {
  if (ts.isUnionTypeNode(node)) {
    for (const part of node.types) {
      if (part.kind !== ts.SyntaxKind.NullKeyword && part.kind !== ts.SyntaxKind.UndefinedKeyword) {
        return stripNulls(part);
      }
    }
  }
  return node;
}

function describeType(typeNode: ts.TypeNode, source: ts.SourceFile): FieldInfo {
  const stripped = stripNulls(typeNode);
  let array = false;
  let base = stripped;
  if (ts.isArrayTypeNode(stripped)) {
    array = true;
    base = stripNulls(stripped.elementType);
  } else if (ts.isTypeReferenceNode(stripped) && stripped.typeArguments?.length === 1 && ts.isIdentifier(stripped.typeName) && stripped.typeName.text === 'Array') {
    array = true;
    base = stripNulls(stripped.typeArguments[0]);
  }

  const text = base.getText(source);
  const enumMatch = text.match(/Database\["public"\]\["Enums"\]\["([^"]+)"\]/);
  if (enumMatch) {
    return { baseType: 'enum', enumName: enumMatch[1], array };
  }

  switch (base.kind) {
    case ts.SyntaxKind.StringKeyword:
      return { baseType: 'string', array };
    case ts.SyntaxKind.NumberKeyword:
      return { baseType: 'number', array };
    case ts.SyntaxKind.BooleanKeyword:
      return { baseType: 'boolean', array };
    default:
      return { baseType: 'unknown', array };
  }
}

function extractEnumsFromDatabase(sourceFile: ts.SourceFile): EnumOptionsMap {
  const enums: EnumOptionsMap = {};

  for (const stmt of sourceFile.statements) {
    if (ts.isTypeAliasDeclaration(stmt) && stmt.name.text === 'Database' && ts.isTypeLiteralNode(stmt.type)) {
      // Find public schema
      const publicType = getTypeLiteralProperty(stmt.type, 'public');
      if (!publicType) continue;

      // Find Enums section
      const enumsType = getTypeLiteralProperty(publicType, 'Enums');
      if (!enumsType) continue;

      // Extract each enum
      for (const member of enumsType.members) {
        if (!ts.isPropertySignature(member) || !member.type || !member.name) continue;
        const enumName = getPropertyName(member.name as ts.PropertyName);
        if (!enumName) continue;

        // Parse union of string literals
        const values = extractUnionStringLiterals(member.type);
        if (values.length > 0) {
          enums[enumName] = values;
        }
      }
    }
  }

  return enums;
}

function extractUnionStringLiterals(typeNode: ts.TypeNode): string[] {
  const values: string[] = [];

  if (ts.isUnionTypeNode(typeNode)) {
    for (const part of typeNode.types) {
      if (ts.isLiteralTypeNode(part) && ts.isStringLiteral(part.literal)) {
        values.push(part.literal.text);
      }
    }
  } else if (ts.isLiteralTypeNode(typeNode) && ts.isStringLiteral(typeNode.literal)) {
    values.push(typeNode.literal.text);
  }

  return values;
}

async function fetchEnumMetadataFromEdgeFunction(): Promise<{ enums: EnumOptionsMap; fieldToEnum: FieldToEnumMap; fieldTypes: FieldMap } | null> {
  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return null;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase.functions.invoke('schema-types-export', {
      method: 'GET'
    });

    if (error || !data || !data.enums) {
      return null;
    }

    console.log(`📊 Fetched ${data.enums.length} enum values from edge function`);

    // Group enum values by enum type
    const enums: EnumOptionsMap = {};
    const fieldToEnum: FieldToEnumMap = {};
    const fieldTypes: FieldMap = {};

    for (const enumRow of data.enums) {
      const { enum_schema, enum_type, enum_label } = enumRow;

      if (!enums[enum_type]) {
        enums[enum_type] = [];
      }
      enums[enum_type].push(enum_label);
    }

    // Map columns to their enum types AND detect array fields
    if (data.columns_detailed_by_table) {
      for (const [tableKey, columns] of Object.entries(data.columns_detailed_by_table)) {
        for (const col of columns as any[]) {
          const fieldKey = `${col.schema_name}.${col.table_name}.${col.column_name}`;

          // Detect if this is an array field (PostgreSQL array types start with _)
          const isArray = col.udt_name?.startsWith('_') || col.data_type === 'ARRAY';

          // For array types, the udt_name starts with _ (e.g., _languages for languages[])
          // Strip the underscore to get the base type name
          let baseUdtName = col.udt_name;
          if (isArray && baseUdtName?.startsWith('_')) {
            baseUdtName = baseUdtName.substring(1); // Remove leading underscore
          }

          // Map to enum if it has one (check both with and without underscore)
          let enumName: string | undefined;
          if (baseUdtName && enums[baseUdtName]) {
            enumName = baseUdtName;
            fieldToEnum[fieldKey] = baseUdtName;
          }

          // Determine base type
          let baseType: FieldInfo['baseType'] = 'unknown';
          if (enumName) {
            baseType = 'enum';
          } else {
            switch (col.data_type) {
              case 'boolean':
                baseType = 'boolean';
                break;
              case 'integer':
              case 'bigint':
              case 'smallint':
              case 'numeric':
              case 'real':
              case 'double precision':
                baseType = 'number';
                break;
              case 'text':
              case 'character varying':
              case 'character':
              case 'uuid':
                baseType = 'string';
                break;
              case 'json':
              case 'jsonb':
                baseType = 'json';
                break;
            }
          }

          fieldTypes[fieldKey] = {
            baseType,
            enumName,
            array: isArray
          };
        }
      }
    }

    console.log(`✅ Created ${Object.keys(enums).length} enums, ${Object.keys(fieldToEnum).length} field-to-enum mappings, and ${Object.keys(fieldTypes).length} field types`);
    return { enums, fieldToEnum, fieldTypes };
  } catch (err) {
    console.log('⚠️  Error fetching enum metadata:', err);
    return null;
  }
}

async function generate() {
  const sourceFile = readSource(SRC_PATH);

  // Try to fetch enum data from edge function
  const edgeFunctionData = await fetchEnumMetadataFromEdgeFunction();

  let enums: EnumOptionsMap;
  let fieldToEnum: FieldToEnumMap = {};
  let fields: FieldMap;

  if (edgeFunctionData) {
    enums = edgeFunctionData.enums;
    fieldToEnum = edgeFunctionData.fieldToEnum;
    fields = edgeFunctionData.fieldTypes;
  } else {
    console.log('⚠️  Falling back to TypeScript type parsing');
    // Extract enums from Database["public"]["Enums"]
    enums = extractEnumsFromDatabase(sourceFile);
    // Extract field types from TypeScript
    fields = extractFieldTypes(sourceFile);
  }

  const file = `// AUTO-GENERATED by scripts/generate-field-metadata.ts. Do not edit.
export const ENUM_OPTIONS: Record<string, readonly string[]> = ${JSON.stringify(enums, null, 2)};
export const FIELD_TYPES: Record<string, { baseType: 'string' | 'number' | 'boolean' | 'json' | 'enum' | 'unknown'; enumName?: string; array?: boolean }> = ${JSON.stringify(fields, null, 2)};
export const FIELD_TO_ENUM: Record<string, string> = ${JSON.stringify(fieldToEnum, null, 2)};
`;
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, file, 'utf8');
  console.log(`✅ Wrote ${OUT_PATH} with ${Object.keys(enums).length} enums, ${Object.keys(fields).length} fields, and ${Object.keys(fieldToEnum).length} field-to-enum mappings`);
}

generate().catch(err => {
  console.error('Error generating field metadata:', err);
  process.exit(1);
});
