#!/usr/bin/env tsx

import ts from "typescript";
import { promises as fs } from "fs";
import path from "path";
import process from "process";
import { fileURLToPath } from "url";

type ColumnEntry = {
  schema: string;
  table: string;
  column: string;
  baseType: string;
  isArray: boolean;
  isNullable: boolean;
  enumRef: { schema: string; name: string } | null;
  references: Array<{ relation: string; referencedColumns: string[]; isOneToOne: boolean; schema?: string }>;
};

type TableEntry = {
  columns: Record<string, ColumnEntry>;
};

type SchemaEntry = Record<string, TableEntry>;

type GeneratedMetadata = Record<string, SchemaEntry>;

const DIRNAME = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(DIRNAME, "..");
const TYPES_PATH = path.resolve(ROOT, "src", "types", "database.types.ts");
const OUTPUT_PATH = path.resolve(ROOT, "src", "modules", "shared", "schema-metadata.generated.ts");
const TYPES_ARCHIVE_DIR = path.resolve(DIRNAME, "type_archives");
const SCHEMA_ARCHIVE_DIR = path.resolve(ROOT, "src", "modules", "shared", "schema-metadata.archives");

function formatTimestamp(date = new Date()): string {
  return date.toISOString().replace(/[:.]/g, '-');
}

async function ensureDir(dir: string): Promise<void> {
  await fs.mkdir(dir, { recursive: true });
}

async function pathExists(target: string): Promise<boolean> {
  try {
    await fs.stat(target);
    return true;
  } catch {
    return false;
  }
}


async function main() {
  const timestamp = formatTimestamp();
  const rawSourceText = await fs.readFile(TYPES_PATH, "utf8");
  const trimmed = rawSourceText.trim();
  const isWrappedBundle = trimmed.startsWith("{");

  await ensureDir(TYPES_ARCHIVE_DIR);
  const archivedTypesName = isWrappedBundle ? `database.types.${timestamp}.json` : `database.types.${timestamp}.ts`;
  const archivedTypesPath = path.resolve(TYPES_ARCHIVE_DIR, archivedTypesName);
  await fs.rename(TYPES_PATH, archivedTypesPath);

  let sourceText = rawSourceText;
  if (isWrappedBundle) {
    try {
      const parsed = JSON.parse(trimmed);
      if (typeof parsed.types === "string") {
        sourceText = parsed.types;
      } else {
        throw new Error("JSON bundle missing `types` string");
      }
    } catch (error) {
      console.error("Failed to parse database.types.ts JSON wrapper:", error);
      throw error;
    }
  }

  await fs.writeFile(TYPES_PATH, sourceText, "utf8");

  if (await pathExists(OUTPUT_PATH)) {
    await ensureDir(SCHEMA_ARCHIVE_DIR);
    const archivedSchemaPath = path.resolve(SCHEMA_ARCHIVE_DIR, `schema-metadata.generated.${timestamp}.ts`);
    await fs.rename(OUTPUT_PATH, archivedSchemaPath);
  }

  const sourceFile = ts.createSourceFile(TYPES_PATH, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);

  const databaseType = sourceFile.statements.find((node): node is ts.TypeAliasDeclaration => ts.isTypeAliasDeclaration(node) && node.name.text === "Database");
  if (!databaseType || !databaseType.type || !ts.isTypeLiteralNode(databaseType.type)) {
    throw new Error("Could not find Database type literal.");
  }

  const result: GeneratedMetadata = {};

  for (const schemaMember of databaseType.type.members) {
    if (!ts.isPropertySignature(schemaMember) || !schemaMember.type || !ts.isTypeLiteralNode(schemaMember.type)) continue;
    const schemaName = getPropertyName(schemaMember.name);
    if (!schemaName) continue;

    const tablesSignature = findProperty(schemaMember.type, "Tables");
    if (!tablesSignature || !tablesSignature.type || !ts.isTypeLiteralNode(tablesSignature.type)) continue;

    for (const tableMember of tablesSignature.type.members) {
      if (!ts.isPropertySignature(tableMember) || !tableMember.type || !ts.isTypeLiteralNode(tableMember.type)) continue;
      const tableName = getPropertyName(tableMember.name);
      if (!tableName) continue;

      const tableLiteral = tableMember.type;
      const rowSignature = findProperty(tableLiteral, "Row");
      if (!rowSignature || !rowSignature.type || !ts.isTypeLiteralNode(rowSignature.type)) continue;
      const relationshipsSignature = findProperty(tableLiteral, "Relationships");
      const relationships = relationshipsSignature?.type ? extractRelationships(relationshipsSignature.type) : {};

      for (const columnMember of rowSignature.type.members) {
        if (!ts.isPropertySignature(columnMember) || !columnMember.type) continue;
        const columnName = getPropertyName(columnMember.name);
        if (!columnName) continue;

        const columnInfo = analyseColumnType(columnMember.type);
        const references = relationships[columnName] ?? [];

        const entry: ColumnEntry = {
          schema: schemaName,
          table: tableName,
          column: columnName,
          baseType: columnInfo.baseType,
          isArray: columnInfo.isArray,
          isNullable: columnInfo.isNullable,
          enumRef: columnInfo.enumRef,
          references,
        };

        if (!result[schemaName]) result[schemaName] = {};
        if (!result[schemaName][tableName]) result[schemaName][tableName] = { columns: {} };
        result[schemaName][tableName].columns[columnName] = entry;
      }
    }
  }

  const header = "// AUTO-GENERATED FILE. DO NOT EDIT.\n" + "// Run \"pnpm tsx scripts/generate-schema-metadata.ts\" from client-new/ to regenerate.\n";
  const serialized = JSON.stringify(result, null, 2);
  const body = "export const schemaMetadata = " + serialized + " as const;\n";
  const types = `export type SchemaMetadata = typeof schemaMetadata;\n`
    + `export type ColumnMetadata = {\n`
    + `  schema: string;\n`
    + `  table: string;\n`
    + `  column: string;\n`
    + `  baseType: string;\n`
    + `  isArray: boolean;\n`
    + `  isNullable: boolean;\n`
    + `  enumRef: { schema: string; name: string } | null;\n`
    + `  references: Array<{ relation: string; referencedColumns: string[]; isOneToOne: boolean; schema?: string }>;\n`
    + `};\n`;
  const output = `${header}\n${body}\n${types}`;

  await fs.writeFile(OUTPUT_PATH, output, "utf8");
}

function getPropertyName(name: ts.PropertyName | ts.BindingName | undefined): string | undefined {
  if (!name) return undefined;
  if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)) return name.text;
  return undefined;
}

function findProperty(node: ts.TypeLiteralNode, name: string): ts.PropertySignature | undefined {
  return node.members.find((member): member is ts.PropertySignature => ts.isPropertySignature(member) && getPropertyName(member.name) === name);
}

type ColumnAnalysis = {
  baseType: string;
  isArray: boolean;
  isNullable: boolean;
  enumRef: { schema: string; name: string } | null;
};

function analyseColumnType(typeNode: ts.TypeNode): ColumnAnalysis {
  const state: ColumnAnalysis = { baseType: "string", isArray: false, isNullable: false, enumRef: null };
  visit(typeNode);
  return state;

  function visit(node: ts.TypeNode | undefined): void {
    if (!node) return;
    if (ts.isUnionTypeNode(node)) {
      for (const part of node.types) visit(part);
      return;
    }
    if (ts.isParenthesizedTypeNode(node)) {
      visit(node.type);
      return;
    }
    if (ts.isArrayTypeNode(node)) {
      state.isArray = true;
      visit(node.elementType);
      return;
    }
    if (ts.isTypeReferenceNode(node)) {
      const text = node.getText();
      if (text.startsWith("Array<")) {
        state.isArray = true;
        if (node.typeArguments?.[0]) visit(node.typeArguments[0]);
        return;
      }
      const enumMatch = text.match(/Database\[\"([^\"]+)\"\]\[\"Enums\"\]\[\"([^\"]+)\"\]/);
      if (enumMatch) {
        state.enumRef = { schema: enumMatch[1], name: enumMatch[2] };
        state.baseType = "enum";
        return;
      }
      if (/Json\b/.test(text)) {
        state.baseType = "json";
        return;
      }
    }
    if (ts.isLiteralTypeNode(node)) {
      if (node.literal.kind === ts.SyntaxKind.NullKeyword || node.literal.kind === ts.SyntaxKind.UndefinedKeyword) {
        state.isNullable = true;
        return;
      }
    }
    switch (node.kind) {
      case ts.SyntaxKind.BooleanKeyword:
        if (state.baseType !== "enum") state.baseType = "boolean";
        return;
      case ts.SyntaxKind.NumberKeyword:
        if (state.baseType !== "enum") state.baseType = "number";
        return;
      case ts.SyntaxKind.StringKeyword:
        if (!["enum", "number", "boolean"].includes(state.baseType)) state.baseType = "string";
        return;
      default:
        return;
    }
  }
}

type RelationshipMap = Record<string, Array<{ relation: string; referencedColumns: string[]; isOneToOne: boolean; schema?: string }>>;

function extractRelationships(typeNode: ts.TypeNode): RelationshipMap {
  const map: RelationshipMap = {};
  if (!ts.isTupleTypeNode(typeNode)) return map;

  for (const element of typeNode.elements) {
    if (!ts.isTypeLiteralNode(element)) continue;
    const columnsNode = findProperty(element, "columns");
    const relationNode = findProperty(element, "referencedRelation");
    const referencedColumnsNode = findProperty(element, "referencedColumns");
    const oneToOneNode = findProperty(element, "isOneToOne");
    const schemaNode = findProperty(element, "schema");

    const columns = columnsNode?.type ? extractStringArray(columnsNode.type) : [];
    const relation = relationNode?.type ? extractLiteralString(relationNode.type) : undefined;
    const referencedColumns = referencedColumnsNode?.type ? extractStringArray(referencedColumnsNode.type) : [];
    const isOneToOne = oneToOneNode?.type ? extractBoolean(oneToOneNode.type) : false;
    const schema = schemaNode?.type ? extractLiteralString(schemaNode.type) : undefined;

    if (!relation || columns.length === 0) continue;
    const reference = { relation, referencedColumns, isOneToOne, schema };
    for (const column of columns) {
      if (!map[column]) map[column] = [];
      map[column].push(reference);
    }
  }

  return map;
}

function extractStringArray(node: ts.TypeNode): string[] {
  if (ts.isTupleTypeNode(node)) {
    const values: string[] = [];
    for (const element of node.elements) {
      const value = extractLiteralString(element);
      if (value) values.push(value);
    }
    return values;
  }
  if (ts.isArrayTypeNode(node)) {
    const value = extractLiteralString(node.elementType);
    return value ? [value] : [];
  }
  if (ts.isUnionTypeNode(node)) {
    const values = node.types.flatMap((child) => extractStringArray(child));
    return Array.from(new Set(values));
  }
  const literal = extractLiteralString(node);
  return literal ? [literal] : [];
}

function extractLiteralString(node: ts.TypeNode): string | undefined {
  if (ts.isLiteralTypeNode(node) && ts.isStringLiteral(node.literal)) return node.literal.text;
  if (ts.isTemplateLiteralTypeNode(node)) return node.head.text;
  return undefined;
}

function extractBoolean(node: ts.TypeNode): boolean {
  if (ts.isLiteralTypeNode(node)) {
    if (node.literal.kind === ts.SyntaxKind.TrueKeyword) return true;
    if (node.literal.kind === ts.SyntaxKind.FalseKeyword) return false;
  }
  return false;
}

await main().catch((error) => {
  console.error("[generate-schema-metadata] failed:", error);
  process.exitCode = 1;
});

