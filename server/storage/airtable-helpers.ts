import { base } from '../airtable-base';

export type Fields = Record<string, any>;

export async function selectAll(tableName: string, options?: any) {
  const table = base(tableName);
  const records = await table.select(options || {}).all();
  return records;
}

export async function findById(tableName: string, id: string) {
  const table = base(tableName);
  const record = await table.find(id);
  return record;
}

export async function selectByFormula(tableName: string, formula: string) {
  const table = base(tableName);
  const records = await table.select({ filterByFormula: formula }).all();
  return records;
}

export async function createRecord(tableName: string, fields: Fields) {
  const table = base(tableName);
  const record = await table.create(fields as any);
  return record;
}

export async function updateRecord(tableName: string, id: string, fields: Fields) {
  const table = base(tableName);
  const record = await table.update(id, fields as any);
  return record;
}

export async function deleteRecord(tableName: string, id: string) {
  const table = base(tableName);
  await table.destroy(id);
  return true;
}

