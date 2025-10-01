import fs from 'fs';
import path from 'path';
import ts from 'typescript';

type EnumOptionsMap = Record<string, string[]>;

type FieldInfo = {
  baseType: 'string' | 'number' | 'boolean' | 'json' | 'enum' | 'unknown';
  enumName?: string;
  array?: boolean;
};

type FieldMap = Record<string, FieldInfo>;

const SRC_PATH = path.join('src', 'types', 'database.types.ts');
const OUT_PATH = path.join('src', 'modules', 'shared', 'enums.generated.ts');

function readSource(filePath: string): ts.SourceFile {
  const code = fs.readFileSync(filePath, 'utf8');
  return ts.createSourceFile(filePath, code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
}

function extractObjectLiteral(node: ts.Node, name: string): ts.ObjectLiteralExpression | undefined {
  if (ts.isVariableStatement(node)) {
    for (const decl of node.declarationList.declarations) {
      if (ts.isIdentifier(decl.name) && decl.name.text === name && decl.initializer) {
        let init = decl.initializer;
        if (ts.isAsExpression(init)) {
          init = init.expression;
        }
        if (ts.isObjectLiteralExpression(init)) {
          return init;
        }
      }
    }
  }
  return undefined;
}

function evaluateStringArray(node: ts.Node): string[] {
  if (!ts.isArrayLiteralExpression(node)) return [];
  const result: string[] = [];
  for (const element of node.elements) {
    if (ts.isStringLiteral(element)) {
      result.push(element.text);
    }
  }
  return result;
}

function extractEnumOptions(constantsLiteral: ts.ObjectLiteralExpression): EnumOptionsMap {
  const publicProp = getProperty(constantsLiteral, 'public');
  if (!publicProp || !ts.isObjectLiteralExpression(publicProp.initializer)) return {};
  const enumsProp = getProperty(publicProp.initializer, 'Enums');
  if (!enumsProp || !ts.isObjectLiteralExpression(enumsProp.initializer)) return {};

  const map: EnumOptionsMap = {};
  for (const prop of enumsProp.initializer.properties) {
    if (!ts.isPropertyAssignment(prop)) continue;
    const key = getPropertyName(prop.name);
    if (!key) continue;
    map[key] = evaluateStringArray(prop.initializer);
  }
  return map;
}

function getProperty(object: ts.ObjectLiteralExpression, name: string): ts.PropertyAssignment | undefined {
  for (const prop of object.properties) {
    if (ts.isPropertyAssignment(prop)) {
      const key = getPropertyName(prop.name);
      if (key === name) return prop;
    }
  }
  return undefined;
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

function generate() {
  const sourceFile = readSource(SRC_PATH);
  let enums: EnumOptionsMap = {};
  for (const stmt of sourceFile.statements) {
    const literal = extractObjectLiteral(stmt, 'Constants');
    if (literal) {
      enums = extractEnumOptions(literal);
      break;
    }
  }
  const fields = extractFieldTypes(sourceFile);

  const file = `// AUTO-GENERATED by scripts/generate-field-metadata.ts. Do not edit.
export const ENUM_OPTIONS: Record<string, readonly string[]> = ${JSON.stringify(enums, null, 2)};
export const FIELD_TYPES: Record<string, { baseType: 'string' | 'number' | 'boolean' | 'json' | 'enum' | 'unknown'; enumName?: string; array?: boolean }> = ${JSON.stringify(fields, null, 2)};
`;
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, file, 'utf8');
  console.log(`Wrote ${OUT_PATH} with ${Object.keys(enums).length} enums and ${Object.keys(fields).length} fields.`);
}

generate();
