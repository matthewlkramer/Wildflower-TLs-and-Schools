import type { TableColumnMeta } from '../detail-types';
import { COLUMN_TEMPLATES } from './registry';

export type TemplateKey = keyof typeof COLUMN_TEMPLATES;

// Get a full column template array by key
export function cols(template: TemplateKey): readonly TableColumnMeta[] {
  return COLUMN_TEMPLATES[template];
}

// Pick a subset of columns by field name in defined order
export function pick(template: TemplateKey, fields: readonly string[]): readonly TableColumnMeta[] {
  const map = new Map(COLUMN_TEMPLATES[template].map((c) => [c.field, c] as const));
  return fields.map((f) => map.get(f)).filter(Boolean) as TableColumnMeta[];
}

