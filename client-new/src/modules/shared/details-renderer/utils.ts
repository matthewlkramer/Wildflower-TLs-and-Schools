import { supabase } from '@/lib/supabase/client';
import { isEmail, normalizeEmail } from '../validators';
import type { FieldLookup, FieldMetadata, TableColumnMeta, FilterExpr, VisibleIf } from '../detail-types';

export type SelectOption = { value: string; label: string };

export const DEFAULT_SCHEMA = 'public';

export const normalizeOptionValue = (value: unknown): string => String(value ?? '');

export const asSelectOptions = (values: readonly (string | number)[]): SelectOption[] =>
  values.map((value) => {
    const normalized = normalizeOptionValue(value);
    return { value: normalized, label: normalized };
  });

export const buildLookupKey = (lookup: FieldLookup): string => {
  const schema = lookup.schema ?? DEFAULT_SCHEMA;
  return `${schema}|${lookup.table}|${lookup.valueColumn}|${lookup.labelColumn}`;
};

// Try to convert a storage path/object to a public URL using Supabase Storage.
export function toPublicUrl(maybe: any): string | undefined {
  try {
    if (!maybe) return undefined;
    if (typeof maybe === 'string') {
      const s = String(maybe);
      if (/^https?:\/\//i.test(s)) return s;
      // Heuristic: treat "bucket/path..." as a storage reference
      const idx = s.indexOf('/');
      if (idx > 0) {
        const bucket = s.slice(0, idx);
        const path = s.slice(idx + 1);
        const { data } = supabase.storage.from(bucket).getPublicUrl(path);
        if (data?.publicUrl) return data.publicUrl;
      }
    }
    if (maybe && typeof maybe === 'object') {
      const obj = maybe as any;
      if (obj.url || obj.href || obj.link || obj.download_url) {
        return String(obj.url || obj.href || obj.link || obj.download_url);
      }
      if (obj.bucket && (obj.path || obj.key || obj.name)) {
        const { data } = supabase.storage.from(obj.bucket).getPublicUrl(obj.path || obj.key || obj.name);
        if (data?.publicUrl) return data.publicUrl;
      }
    }
  } catch (e) {
    console.error('toPublicUrl error:', e);
  }
  return undefined;
}

export function isFileLikePath(s: string): boolean {
  const parts = s.split('/');
  const last = parts[parts.length - 1];
  const exts = ['.pdf', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.doc', '.docx', '.xls', '.xlsx', '.txt', '.csv'];
  return exts.some((ext) => last.toLowerCase().endsWith(ext));
}

export function normalizeAttachmentEntries(input: any): any[] {
  if (!input) return [];
  if (Array.isArray(input)) return input;
  if (typeof input === 'string') {
    try {
      const parsed = JSON.parse(input);
      if (Array.isArray(parsed)) return parsed;
      return [parsed];
    } catch {
      return [input];
    }
  }
  if (typeof input === 'object') return [input];
  return [input];
}

export function resolveAttachmentDisplay(raw: any): { url?: string; label: string } {
  const url = toPublicUrl(raw);
  let label = 'Attachment';
  if (typeof raw === 'string') {
    label = raw;
    if (raw.includes('/')) {
      const parts = raw.split('/');
      label = parts[parts.length - 1];
    }
  } else if (raw && typeof raw === 'object') {
    label = raw.label || raw.title || raw.name || raw.filename || raw.key || 'Document';
  }
  return { url, label };
}

export function attachmentToEditorValue(raw: any): string | null {
  if (!raw) return null;
  if (typeof raw === 'string') return raw;
  if (raw.url || raw.href || raw.link || raw.download_url) {
    return String(raw.url || raw.href || raw.link || raw.download_url);
  }
  if (raw.bucket && (raw.path || raw.key || raw.name)) {
    return `${raw.bucket}/${raw.path || raw.key || raw.name}`;
  }
  return JSON.stringify(raw);
}

export function evaluateVisibleIf(v: VisibleIf, details: any): boolean {
  const fieldValue = details?.[v.field];
  if (v.operator === '==' || v.operator === '=') return fieldValue == v.value;
  if (v.operator === '!=' || v.operator === '<>') return fieldValue != v.value;
  if (v.operator === 'in') {
    const vals = Array.isArray(v.value) ? v.value : [v.value];
    return vals.includes(fieldValue);
  }
  if (v.operator === 'not in') {
    const vals = Array.isArray(v.value) ? v.value : [v.value];
    return !vals.includes(fieldValue);
  }
  if (v.operator === 'is null') return fieldValue == null;
  if (v.operator === 'is not null') return fieldValue != null;
  return true;
}

export function applyFilterExprToQuery(q: any, expr: FilterExpr): any {
  const { col, operator, value } = expr;
  switch (operator) {
    case 'eq':
      return q.eq(col, value);
    case 'neq':
      return q.neq(col, value);
    case 'gt':
      return q.gt(col, value);
    case 'gte':
      return q.gte(col, value);
    case 'lt':
      return q.lt(col, value);
    case 'lte':
      return q.lte(col, value);
    case 'like':
      return q.like(col, value);
    case 'ilike':
      return q.ilike(col, value);
    case 'in':
      return q.in(col, value);
    case 'is':
      if (value === null) return q.is(col, value);
      return q.eq(col, value);
    case 'contains':
      return q.contains(col, value);
    case 'containedBy':
      return q.containedBy(col, value);
    case 'overlaps':
      return q.overlaps(col, value);
    default:
      console.warn('Unsupported filter operator:', operator);
      return q;
  }
}

export function normalizeTextForEmail(input: string): string {
  const str = String(input ?? '').trim().toLowerCase();
  if (isEmail(str)) return normalizeEmail(str);
  const stripped = str.replace(/\s+/g, '.');
  const cleaned = stripped.replace(/[^a-z0-9._@+-]/g, '');
  const dotsCleaned = cleaned.replace(/\.+/g, '.').replace(/^\.+|\.+$/g, '');
  return dotsCleaned || 'unknown';
}

export function maybeNormalizeEmailField(fieldName: string | undefined, value: string): string {
  if (fieldName && fieldName.toLowerCase().includes('email')) {
    return normalizeTextForEmail(value);
  }
  return value;
}

export function formatLabel(field: string): string {
  return field
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function normalizeAbbrev(label: string): string {
  const abbrevMap: { [key: string]: string } = {
    'Ssj': 'SSJ',
    'Tl': 'TL',
    'Ein': 'EIN',
    'Url': 'URL',
    'Api': 'API',
    'Id': 'ID',
    'Uuid': 'UUID',
    'Json': 'JSON',
    'Ceo': 'CEO',
    'Cfo': 'CFO',
    'Coo': 'COO',
    'Cto': 'CTO',
    'Hr': 'HR',
    'It': 'IT',
    'Pr': 'PR',
    'Roi': 'ROI',
    'Kpi': 'KPI',
    'Crm': 'CRM',
    'Erp': 'ERP',
    'Poc': 'POC'
  };

  let result = label;
  Object.entries(abbrevMap).forEach(([key, value]) => {
    const regex = new RegExp(`\\b${key}\\b`, 'g');
    result = result.replace(regex, value);
  });
  return result;
}

export function labelFromField(field: string): string {
  const formatted = formatLabel(field);
  const normalized = normalizeAbbrev(formatted);
  const cleaned = normalized.replace(/\s+/g, ' ').trim();
  return cleaned || field;
}

export function inferPkForTable(table: string, fallbackParent?: { schema?: string; table: string; pk?: string }): string | undefined {
  // Common patterns for primary keys
  if (table === 'cohorts') return 'cohort_title';
  if (table === 'guides') return 'email_or_name';

  // Default to 'id'
  return 'id';
}

export function getInitialValues(fields: string[], details: any) {
  const initialValues: Record<string, any> = {};
  for (const field of fields) {
    const value = details?.[field];
    if (value !== undefined) {
      initialValues[field] = value;
    }
  }
  return initialValues;
}