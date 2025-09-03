import {
  ACTION_STEPS_FIELDS as ASF,
  EDUCATORS_X_SCHOOLS_FIELDS as EXSF,
  LOCATIONS_FIELDS as LF,
} from "@shared/airtable-schema";

export function firstId(val: any): string | undefined {
  if (val === undefined || val === null || val === '') return undefined;
  if (Array.isArray(val)) return String(val[0] ?? '');
  return String(val);
}

export function toStringArray(val: any): string[] | undefined {
  if (val === undefined || val === null || val === '') return undefined;
  if (Array.isArray(val)) return val.map((v) => (v === undefined || v === null ? '' : String(v)));
  return [String(val)];
}

export function toNumber(val: any): number | undefined {
  if (val === undefined || val === null || val === '') return undefined;
  const n = Number(val);
  return isNaN(n) ? undefined : n;
}

export function toYesBool(val: any): boolean {
  if (typeof val === 'boolean') return val;
  if (typeof val === 'string') return val.trim().toLowerCase() === 'yes';
  return Boolean(val);
}

export function createdAt(fields: any): string {
  return String(fields["Created"] || fields["Created time"] || new Date().toISOString());
}

export function updatedAt(fields: any): string {
  return String(fields["Last Modified"] || fields["Last modified"] || fields["Last modified time"] || new Date().toISOString());
}

export function firstAttachment(attachments: any): { filename?: string; url?: string } | undefined {
  if (!Array.isArray(attachments) || attachments.length === 0) return undefined;
  const a = attachments[0] || {};
  return { filename: a.filename, url: a.url };
}

export function ffEq(fieldName: string, value: string): string {
  return `{${fieldName}} = '${value}'`;
}

