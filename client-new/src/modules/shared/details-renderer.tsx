import React from 'react';
import ReactDOM from 'react-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Tabs, Tab, Box, FormControlLabel, Switch } from '@mui/material';

import { supabase } from '@/lib/supabase/client';
import { isEmail, normalizeEmail, isPhoneE164, normalizePhoneToE164, isEIN, normalizeEIN } from './validators';

import {
  type DetailTabSpec,
  type DetailCardBlock,
  type DetailTableBlock,
  type DetailListBlock,
  type DetailListLayout,
  type DetailMapBlock,
  type LookupException,
  type FieldMetadataMap,
  type FieldMetadata,
  type FieldLookup,
  type TableColumnMeta,
  type TableOrderBy,
  type FilterExpr,
  type VisibleIf,
} from './detail-types';
import type { ViewSpec } from './views/types';
import { asTabs as asTabsFromView } from './views/types';

import { mergeTableColumnMeta, mergeFieldMetadata, getColumnMetadata } from './schema-metadata';
import { getDefaultForTable } from './write-targets';
import { findForeignKeyColumn } from './schema-metadata';

import { saveCardValues, type ExceptionMap, type WriteTarget } from '../educators/helpers/write-helpers';
import { formatCurrencyUSD } from '@/lib/utils';
import { ENUM_OPTIONS, FIELD_TYPES } from './enums.generated';
import { getRowActionLabel, formatActionLabel } from './actions/registry';
import { getTableActionLabel } from './actions/table-actions';
import { handleTableAction as handleTableActionClick } from './actions/table-handlers';
import { handleRowAction } from './actions/handlers';
import { TABLE_PRESETS } from './table-presets';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';



type SelectOption = { value: string; label: string };



const ENUM_OPTION_CACHE = new Map<string, SelectOption[]>();

const LOOKUP_OPTION_CACHE = new Map<string, SelectOption[]>();

const DEFAULT_SCHEMA = 'public';




const normalizeOptionValue = (value: unknown): string => String(value ?? '');



const asSelectOptions = (values: readonly (string | number)[]): SelectOption[] =>

  values.map((value) => {

    const normalized = normalizeOptionValue(value);

    return { value: normalized, label: normalized };

  });



const buildLookupKey = (lookup: FieldLookup): string => {

  const schema = lookup.schema ?? DEFAULT_SCHEMA;

  return `${schema}|${lookup.table}|${lookup.valueColumn}|${lookup.labelColumn}`;

};


// Try to convert a storage path/object to a public URL using Supabase Storage.
// Accepts
// - string URLs (returned as-is)
// - string storage references in the form "bucket/path/to/file"
// - objects with { url|href|link|download_url } (returned as-is)
// - objects with { bucket, path|key|name }
function toPublicUrl(maybe: any): string | undefined {
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
        if (bucket && path) {
          const res = (supabase as any).storage.from(bucket).getPublicUrl(path);
          const url = res?.data?.publicUrl as string | undefined;
          return url || undefined;
        }
      }
      return undefined;
    }
    if (typeof maybe === 'object') {
      const direct = (maybe as any).url || (maybe as any).href || (maybe as any).link || (maybe as any).download_url;
      if (typeof direct === 'string') return String(direct);
      const bucket = (maybe as any).bucket || (maybe as any).bucket_id || (maybe as any).bucketName;
      const path = (maybe as any).path || (maybe as any).key || (maybe as any).name;
      if (bucket && path) {
        const res = (supabase as any).storage.from(String(bucket)).getPublicUrl(String(path));
        const url = res?.data?.publicUrl as string | undefined;
        return url || undefined;
      }
    }
  } catch {}
  return undefined;
}

function isFileLikePath(s: string): boolean {
  if (!s) return false;
  const str = String(s);
  if (/^https?:\/\//i.test(str)) return true;
  // Common file extensions
  if (/\.(pdf|png|jpe?g|gif|svg|webp|docx?|xlsx?|pptx?|txt|csv|zip)$/i.test(str)) return true;
  return false;
}

function normalizeAttachmentEntries(input: any): any[] {
  if (input == null || input === '') return [];
  if (typeof input === 'string') {
    const trimmed = input.trim();
    if (!trimmed) return [];
    if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
      try {
        const parsed = JSON.parse(trimmed);
        return normalizeAttachmentEntries(parsed);
      } catch {
        return [trimmed];
      }
    }
    return [trimmed];
  }
  if (Array.isArray(input)) {
    return input.flatMap((entry) => normalizeAttachmentEntries(entry));
  }
  if (typeof input === 'object') {
    return [input];
  }
  return [input];
}

function resolveAttachmentDisplay(raw: any): { url?: string; label: string } {
  if (raw == null) return { label: '' };
  if (typeof raw === 'string') {
    const href = toPublicUrl(raw) || raw;
    return { url: href, label: raw };
  }
  if (typeof raw === 'object') {
    const url =
      toPublicUrl(raw) ||
      (raw as any).url ||
      (raw as any).href ||
      (raw as any).link ||
      (raw as any).download_url;
    const label =
      (raw as any).name ||
      (raw as any).filename ||
      (raw as any).title ||
      (raw as any).label ||
      url ||
      'attachment';
    return { url: url ? String(url) : undefined, label: String(label ?? 'attachment') };
  }
  const str = String(raw);
  const href = toPublicUrl(str) || (isFileLikePath(str) ? str : undefined);
  return { url: href, label: str };
}

function attachmentToEditorValue(raw: any): string | null {
  const { url, label } = resolveAttachmentDisplay(raw);
  if (url) return url;
  return label ? String(label) : null;
}



export type DetailsRendererProps = {

  entityId: string;

  details: any;

  tabs?: DetailTabSpec[];
  view?: ViewSpec;

  resolveTitle: (details: any, entityId: string) => string;

  defaultTabId?: string;

  fieldMeta?: FieldMetadataMap;
  // Default write target for fields without explicit edit config
  defaultWriteTo?: any;
  // Ordered list of tables to probe for implicit write targets (first match wins)
  defaultWriteOrder?: string[];
};



export function DetailsRenderer({ entityId, details, tabs, view, resolveTitle, defaultTabId, fieldMeta, defaultWriteTo, defaultWriteOrder }: DetailsRendererProps) {

  const computedTabs: DetailTabSpec[] = React.useMemo(() => {
    if (Array.isArray(tabs) && tabs.length > 0) return tabs;
    if (view && (view as any).tabs) return asTabsFromView(view);
    return [];
  }, [tabs, view]);

  const safeTabs = Array.isArray(computedTabs) ? computedTabs : [];

  const initialTab = React.useMemo(() => {

    if (defaultTabId && safeTabs.some((t) => t.id === defaultTabId)) return defaultTabId;

    return safeTabs[0]?.id ?? '';

  }, [defaultTabId, safeTabs]);



  const [active, setActive] = React.useState<string>(initialTab);

  React.useEffect(() => {

    if (!safeTabs.some((t) => t.id === active) && safeTabs.length > 0) {

      setActive(safeTabs[0].id);

    }

  }, [active, safeTabs]);



  const title = resolveTitle(details, entityId);

  const queryClient = useQueryClient();



  return (

    <div>

      <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>{title}</h1>

      <Box sx={{ marginBottom: 1.5, padding: '4px', backgroundColor: '#e0f2f1', borderRadius: '10px', display: 'inline-flex' }}>
        <Tabs 
          value={active} 
          onChange={(event, newValue) => setActive(newValue)}
          sx={{
            minHeight: 32,
            '& .MuiTabs-indicator': {
              display: 'none',
            },
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.8rem',
              color: '#475569',
              minHeight: 28,
              borderRadius: '6px',
              margin: '0 2px',
              padding: '4px 10px',
              transition: 'all 0.2s',
              '&.Mui-selected': {
                color: '#ffffff',
                backgroundColor: '#0f8a8d',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              },
              '&:hover': {
                backgroundColor: 'rgba(15, 138, 141, 0.08)',
              },
              '&.Mui-selected:hover': {
                backgroundColor: '#0b6e71',
              },
            },
          }}
        >
          {safeTabs.map((tab) => (
            <Tab key={tab.id} label={tab.label} value={tab.id} />
          ))}
        </Tabs>
      </Box>

      {safeTabs.map((tab) => (

        <React.Fragment key={tab.id}>

          {tab.id === active ? (

            <TabContent tab={tab} entityId={entityId} details={details} fieldMeta={fieldMeta} defaultWriteTo={defaultWriteTo} />

          ) : null}

        </React.Fragment>

      ))}

    </div>

  );

}

// Apply a simple filter expression to a Supabase query builder
function applyFilterExprToQuery(q: any, expr: FilterExpr): any {
  if ((expr as any).eq) {
    const { column, value } = (expr as any).eq;
    return q.eq(column, value);
  }
  if ((expr as any).neq) {
    const { column, value } = (expr as any).neq;
    return q.neq(column, value);
  }
  if ((expr as any).or) {
    const parts: string[] = [];
    for (const sub of (expr as any).or as FilterExpr[]) {
      if ((sub as any).eq) {
        const { column, value } = (sub as any).eq;
        const v = value === true ? 'true' : value === false ? 'false' : String(value);
        parts.push(`${column}.eq.${v}`);
      } else if ((sub as any).neq) {
        const { column, value } = (sub as any).neq;
        const v = value === true ? 'true' : value === false ? 'false' : String(value);
        parts.push(`${column}.neq.${v}`);
      }
    }
    if (parts.length) return q.or(parts.join(','));
    return q;
  }
  if ((expr as any).and) {
    let out = q;
    for (const sub of (expr as any).and as FilterExpr[]) {
      out = applyFilterExprToQuery(out, sub);
    }
    return out;
  }
  return q;
}



function TabContent({ tab, entityId, details, fieldMeta, defaultWriteTo, defaultWriteOrder }: { tab: DetailTabSpec; entityId: string; details: any; fieldMeta?: FieldMetadataMap; defaultWriteTo?: WriteTarget; defaultWriteOrder?: string[] }) {

  return (

    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>

      {tab.blocks.map((block, index) => {

        const width = block.width ?? (block.kind === 'table' ? 'full' : block.kind === 'list' ? 'half' : 'half');

        const containerStyle: React.CSSProperties = {

          flex: width === 'full' ? '1 1 100%' : '1 1 calc(50% - 12px)',

          minWidth: width === 'full' ? '100%' : '260px',

        };



        // Evaluate visibility conditions if any
        const visibleIf: VisibleIf | undefined = (block as any).visibleIf;
        if (visibleIf && !evaluateVisibleIf(visibleIf, details)) {
          return null;
        }

        if (block.kind === 'card') {

          return (

            <div key={`${tab.id}-card-${index}`} style={containerStyle}>
              <DetailCard
                block={block}
                tab={tab}
                entityId={entityId}
                details={details}
                fieldMeta={fieldMeta}
                defaultWriteTo={defaultWriteTo}
                defaultWriteOrder={defaultWriteOrder}
              />

            </div>

          );

        }

        if (block.kind === 'table' || block.kind === 'list') {

          return (

            <div key={`${tab.id}-${block.kind}-${index}`} style={containerStyle}>

              <DetailTable block={block as DetailTableBlock | DetailListBlock} entityId={entityId} />

            </div>

          );

        }

        if (block.kind === 'map') {

          return (

            <div key={`${tab.id}-map-${index}`} style={containerStyle}>

              <DetailMap block={block} details={details} />

            </div>

          );

        }

        return null;

      })}

    </div>

  );

}

function evaluateVisibleIf(v: VisibleIf, details: any): boolean {
  const evalClause = (c: any): boolean => {
    const val = details?.[c.field];
    if (c.notEmpty) return val != null && String(val).trim() !== '' && !(Array.isArray(val) && val.length === 0);
    if (c.eq !== undefined) return val === c.eq;
    if (Array.isArray(c.in)) return c.in.includes(val);
    return !!val;
  };
  if ((v as any).anyOf) return ((v as any).anyOf as any[]).some(evalClause);
  if ((v as any).allOf) return ((v as any).allOf as any[]).every(evalClause);
  return evalClause(v as any);
}



function useSelectOptions(

  fields: readonly string[],

  getMetaForField: (field: string) => FieldMetadata | undefined,

  defaultWriteTo?: any,
  defaultWriteOrder?: string[],

) {

  const [optionsMap, setOptionsMap] = React.useState<Record<string, SelectOption[]>>({});

  const fieldsKey = React.useMemo(() => fields.join('|'), [fields]);



  React.useEffect(() => {

    if (!fields.length) {

      setOptionsMap({});

      return;

    }



    const baseMap: Record<string, SelectOption[]> = {};

    const enumsToFetch = new Map<string, string[]>();

    const lookupsToFetch = new Map<string, { fields: string[]; lookup: FieldLookup }>();



    for (const field of fields) {

      const meta = getMetaForField(field);

      if (!meta) continue;



      if (Array.isArray(meta.options) && meta.options.length > 0) {

        baseMap[field] = asSelectOptions(meta.options);

        continue;

      }



      // Explicit enum on meta (either at column level or edit config)
      const declaredEnum = (meta as any).enumName || meta.edit?.enumName;
      if (declaredEnum) {
        const cached = ENUM_OPTION_CACHE.get(declaredEnum);
        if (cached) {
          baseMap[field] = cached;
        } else if (Array.isArray(ENUM_OPTIONS[declaredEnum]) && ENUM_OPTIONS[declaredEnum]!.length) {
          const options = asSelectOptions(ENUM_OPTIONS[declaredEnum]!);
          ENUM_OPTION_CACHE.set(declaredEnum, options);
          baseMap[field] = options;
        } else {
          const list = enumsToFetch.get(declaredEnum);
          if (list) list.push(field);
          else enumsToFetch.set(declaredEnum, [field]);
        }
      }



      if (meta.lookup) {
        const lk = { ...meta.lookup } as any;
        if (!lk.schema && typeof lk.table === 'string' && lk.table.startsWith('ref_')) {
          console.log(`[DEBUG] Setting ref_tables schema for field ${field}, table: ${lk.table}`);
          lk.schema = 'ref_tables';
        }
        const key = buildLookupKey(lk);
        const cached = LOOKUP_OPTION_CACHE.get(key);
        if (cached) {
          baseMap[field] = cached;
        } else {
          const entry = lookupsToFetch.get(key);
          if (entry) entry.fields.push(field);
          else lookupsToFetch.set(key, { fields: [field], lookup: lk });
        }
      }

      // Fallback: infer enum from schema when not specified in meta
      if (!baseMap[field] && !meta.options && !meta.lookup && !declaredEnum) {
        const column = meta.edit?.column ?? field;
        let inferred: string | undefined;
        // 1) metadata tables (schema snapshot)
        if (defaultWriteOrder && defaultWriteOrder.length) {
          for (const t of defaultWriteOrder) {
            const cm = getColumnMetadata(undefined, t, column) as any;
            if (cm?.enumRef?.name) { inferred = cm.enumRef.name as string; break; }
          }
        } else if (defaultWriteTo) {
          const cm = getColumnMetadata(defaultWriteTo.schema, defaultWriteTo.table, column) as any;
          inferred = cm?.enumRef?.name as string | undefined;
        }
        // 2) generated types map
        if (!inferred) {
          const tables = defaultWriteOrder && defaultWriteOrder.length ? defaultWriteOrder : (defaultWriteTo?.table ? [defaultWriteTo.table] : []);
          for (const t of tables) {
            const key = `public.${t}.${column}`;
            const info = FIELD_TYPES[key];
            if (info?.baseType === 'enum' && info.enumName) { inferred = info.enumName; break; }
          }
        }
        if (inferred) {
          if (Array.isArray(ENUM_OPTIONS[inferred]) && ENUM_OPTIONS[inferred]!.length) {
            const options = asSelectOptions(ENUM_OPTIONS[inferred]!);
            ENUM_OPTION_CACHE.set(inferred, options);
            baseMap[field] = options;
          } else {
            const list = enumsToFetch.get(inferred);
            if (list) list.push(field);
            else enumsToFetch.set(inferred, [field]);
          }
        }
      }

    }



    setOptionsMap((prev) => {

      const next: Record<string, SelectOption[]> = {};

      for (const field of fields) {

        if (baseMap[field]) next[field] = baseMap[field];

        else if (prev[field]) next[field] = prev[field];

      }

      return next;

    });



    if (enumsToFetch.size === 0 && lookupsToFetch.size === 0) {

      return;

    }



    let cancelled = false;



    async function load() {

      const updates: Record<string, SelectOption[]> = {};



      for (const [enumName, enumFields] of enumsToFetch.entries()) {
        let options: SelectOption[] | undefined;
        const fromMap = ENUM_OPTIONS[enumName];
        if (Array.isArray(fromMap) && fromMap.length) {
          options = asSelectOptions(fromMap);
        } else {
          const { data, error } = await (supabase as any).rpc('enum_values', { enum_type: enumName });
          if (!error && Array.isArray(data)) {
            options = data.map((entry: any) => {
              const rawValue = entry.value ?? entry.name ?? entry;
              const rawLabel = entry.label ?? rawValue;
              const value = normalizeOptionValue(rawValue);
              const label = normalizeOptionValue(rawLabel);
              return { value, label };
            });
          }
        }
        if (options && options.length) {
          ENUM_OPTION_CACHE.set(enumName, options);
          for (const field of enumFields) updates[field] = options;
        }
      }



      for (const [lookupKey, { fields: lookupFields, lookup }] of lookupsToFetch.entries()) {
        const schemaName = lookup.schema || (typeof lookup.table === 'string' && lookup.table.startsWith('ref_') ? 'ref_tables' : undefined);

        // Debug log for ref_tables access
        if (lookup.table && lookup.table.startsWith('ref_')) {
          console.log(`[DEBUG] Accessing ref_table: ${lookup.table}, schema: ${schemaName}, lookup.schema: ${lookup.schema}`);
        }

        const query = schemaName && schemaName !== 'public'
          ? (supabase as any).schema(schemaName).from(lookup.table)
          : (supabase as any).from(lookup.table);

        const { data, error } = await query

          .select(`${lookup.valueColumn}, ${lookup.labelColumn}`)

          .order(lookup.labelColumn, { ascending: true });

        // Debug log for API calls
        if (lookup.table && lookup.table.startsWith('ref_')) {
          console.log(`[DEBUG] API call result for ${lookup.table} (schema: ${schemaName}):`, { error: error?.message, dataLength: data?.length });
        }

        if (!error && Array.isArray(data)) {

          const options = data

            .map((row: any) => {

              const value = normalizeOptionValue(row[lookup.valueColumn]);

              const labelSource = row[lookup.labelColumn];

              const label = labelSource == null || labelSource === '' ? value : normalizeOptionValue(labelSource);

              return { value, label };

            })

            .filter((option) => option.value !== '');

          LOOKUP_OPTION_CACHE.set(lookupKey, options);

          for (const field of lookupFields) {

            updates[field] = options;

          }

        }

      }



      if (!cancelled && Object.keys(updates).length > 0) {

        setOptionsMap((prev) => ({ ...prev, ...updates }));

      }

    }



    load();



    return () => {

      cancelled = true;

    };

  }, [fieldsKey, getMetaForField]);



  return optionsMap;

}



function DetailCard({ block, tab, entityId, details, fieldMeta, defaultWriteTo, defaultWriteOrder }: { block: DetailCardBlock; tab: DetailTabSpec; entityId: string; details: any; fieldMeta?: FieldMetadataMap; defaultWriteTo?: WriteTarget; defaultWriteOrder?: string[] }) {

  const [editing, setEditing] = React.useState(false);

  const [values, setValues] = React.useState<Record<string, any>>(() => getInitialValues(block.fields, details));
  const [displayOverrides, setDisplayOverrides] = React.useState<Record<string, any>>({});

  const queryClient = useQueryClient();



  React.useEffect(() => {

    setValues(getInitialValues(block.fields, details));

  }, [block.fields, details]);




  const resolvedFieldMeta = React.useMemo<FieldMetadataMap>(() => {

    if (!fieldMeta) return {};

    const map: FieldMetadataMap = {};

    const fallbackSchema = block.editSource?.schema;

    const fallbackTable = block.editSource?.table;

    for (const field of block.fields) {

      const manual = fieldMeta[field];

      if (!manual) continue;

      map[field] =

        mergeFieldMetadata({

          field,

          manual,

          schema: fallbackSchema,

          table: fallbackTable,

        }) ?? manual;

    }

    return map;

  }, [block.editSource?.schema, block.editSource?.table, block.fields, fieldMeta]);



  const getMetaForField = React.useCallback(
    (field: string) => {
      const manual = resolvedFieldMeta[field] ?? fieldMeta?.[field];
      if (manual) {
        // Enrich manual meta with inferred type/array from default write targets when missing
        if ((manual.type == null || manual.array == null)) {
          let cm: any | undefined;
          if (defaultWriteOrder && defaultWriteOrder.length) {
            for (const t of defaultWriteOrder) {
              const found = getColumnMetadata(undefined, t, (manual.edit?.column ?? field));
              if (found) { cm = found; break; }
            }
          } else if (defaultWriteTo) {
            cm = getColumnMetadata(defaultWriteTo.schema, defaultWriteTo.table, (manual.edit?.column ?? field));
          }
          if (cm) {
            const isEnum = !!cm?.enumRef;
            const type: any = manual.type ?? (isEnum ? 'enum' : (cm?.baseType === 'boolean' ? 'boolean' : (cm?.baseType === 'number' ? 'number' : 'string')));
            const array = manual.array ?? !!cm.isArray;
            return { ...manual, type, array } as FieldMetadata;
          }
        }
        return manual;
      }
      // Try default write order tables first
      if (defaultWriteOrder && defaultWriteOrder.length) {
        for (const t of defaultWriteOrder) {
          const cm: any = getColumnMetadata(undefined, t, field);
          if (cm) {
            const isEnum = !!cm?.enumRef;
            const type: any = isEnum ? 'enum' : (cm?.baseType === 'boolean' ? 'boolean' : (cm?.baseType === 'number' ? 'number' : 'string'));
            return { type, array: !!cm.isArray } as FieldMetadata;
          }
        }
      }
      // Fallback: single default write target
      if (defaultWriteTo) {
        const cm: any = getColumnMetadata(defaultWriteTo.schema, defaultWriteTo.table, field);
        if (cm) {
          const isEnum = !!cm?.enumRef;
          const type: any = isEnum ? 'enum' : (cm?.baseType === 'boolean' ? 'boolean' : (cm?.baseType === 'number' ? 'number' : 'string'));
          return { type, array: !!cm.isArray } as FieldMetadata;
        }
      }
      return undefined;
    },
    [resolvedFieldMeta, fieldMeta, defaultWriteOrder, defaultWriteTo],
  );

  React.useEffect(() => {
    const overrides: Record<string, any> = {};
    for (const field of block.fields) {
      const meta = getMetaForField(field);
      if (meta?.type === 'attachment') {
        const fullKey = `${field}_full_url`;
        if (fullKey in details && details[fullKey] != null && details[fullKey] !== '') {
          overrides[field] = details[fullKey];
        }
      }
    }
    setDisplayOverrides(overrides);
  }, [block.fields, details, getMetaForField]);

  function columnAllowsEdit(meta?: TableColumnMeta): boolean {
    if (!meta) return true;
    const upd = (meta as any).update as 'no' | 'yes' | 'newOnly' | undefined;
    if (upd === 'no' || upd === 'newOnly') return false;
    if ((meta as any).edit === false) return false;
    return true;
  }

  function columnIncludeInCreate(meta?: TableColumnMeta): boolean {
    if (!meta) return true;
    const upd = (meta as any).update as 'no' | 'yes' | 'newOnly' | undefined;
    if (upd === 'no') return false;
    return true;
  }



  const selectOptionsMap = useSelectOptions(block.fields, getMetaForField, defaultWriteTo, defaultWriteOrder);



  const handleFieldChange = React.useCallback((field: string, next: any) => {

    setValues((prev) => ({ ...prev, [field]: next }));

  }, []);



  const referenceLabels = useReferenceLabels(block.fields, values, resolvedFieldMeta);



  const handleSave = React.useCallback(async () => {

    // sanitize arrays to avoid sending empty strings to enum[] columns
    const sanitized: Record<string, any> = {};
    for (const key of Object.keys(values)) {
      const val = (values as any)[key];
      sanitized[key] = Array.isArray(val) ? (val as any[]).filter((v) => v !== '') : val;
    }

    // Validate and normalize phone numbers and EINs before saving
    try {
      for (const key of Object.keys(sanitized)) {
        const raw = sanitized[key];
        if (raw == null || raw === '') continue;
        const meta = getMetaForField(key);
        const label = String(meta?.label ?? key);
        const lname = label.toLowerCase();
        const kname = String(key).toLowerCase();
        const isPhoneField = kname.includes('phone') || lname.includes('phone');
        const isEinField = kname === 'ein' || lname.includes('ein');
        if (isPhoneField) {
          const str = String(raw).trim();
          const normalized = normalizePhoneToE164(str);
          if (!normalized || !isPhoneE164(normalized)) {
            alert(`${label}: please enter a valid phone number`);
            return;
          }
          sanitized[key] = normalized;
        } else if (isEinField) {
          const str = String(raw).trim();
          const normalized = normalizeEIN(str);
          if (!normalized || !isEIN(normalized)) {
            alert(`${label}: please enter a valid EIN`);
            return;
          }
          sanitized[key] = normalized;
        }
      }
    } catch (_) {
      // fall through; safety net to avoid blocking save due to unexpected validator errors
    }

    const explicitTarget = block.editSource;

    if (explicitTarget) {

      await saveCardValues(explicitTarget, entityId, sanitized, tab.writeToExceptions);

      setEditing(false);

      return;

    }

    const grouped = groupFieldUpdates(block.fields, sanitized, resolvedFieldMeta, tab.writeToExceptions, defaultWriteTo);

    if (grouped.length === 0) {

      setEditing(false);

      return;

    }

    for (const { writeTo, payload, exceptions } of grouped) {

      await saveCardValues(writeTo, entityId, payload, exceptions && exceptions.length ? exceptions : undefined);

    }

    setEditing(false);

    // Invalidate detail queries so the latest values are fetched immediately
    try {
      await queryClient.invalidateQueries({
        predicate: (q) => {
          const key = q.queryKey as any[];
          if (!Array.isArray(key) || key.length === 0) return false;
          const head = String(key[0] ?? '');
          const id = key[1];
          return head.startsWith('details/') && (id === entityId);
        },
      });
    } catch {}

  }, [block.editSource, block.fields, entityId, resolvedFieldMeta, tab.writeToExceptions, values, queryClient]);



  const canEditAnyField = block.fields.some((field) => {
    const meta = getMetaForField(field);
    if (meta?.editable === false) return false;
    if (meta?.edit) return true;
    if (defaultWriteTo) {
      const cm = getColumnMetadata(defaultWriteTo.schema, defaultWriteTo.table, meta?.edit?.column ?? field);
      if (cm) return true;
    }
    return false;
  });



  return (

    <div style={{ border: '1px solid #e2e8f0', borderRadius: 6, padding: 10 }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>

        <div style={{ fontWeight: 600 }}>{block.title ?? ''}</div>

        {block.editable && canEditAnyField ? (

          editing ? (

            <div style={{ display: 'flex', gap: 8 }}>

              <Button onClick={handleSave} variant="primary" size="sm">Save</Button>

              <Button onClick={() => setEditing(false)} variant="outline" size="sm">Cancel</Button>

            </div>

          ) : (

            <Button onClick={() => setEditing(true)} variant="outline" size="sm">Edit</Button>

          )

        ) : null}

      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8 }}>

        {block.fields.map((field) => {

          const meta = getMetaForField(field);

          const label = meta?.label ?? labelFromField(field);

          // Field-level visibility (evaluated against current values)
          if (meta?.visibleIf && !evaluateVisibleIf(meta.visibleIf, values)) return null;

          const rawValue = values[field];
          const displayValue = displayOverrides[field] ?? rawValue;

          // Determine if this field is editable when card is in editing mode
          let editableField = false;
          if (meta?.editable === false) {
            editableField = false;
          } else if (meta?.edit) {
            editableField = true;
          } else if ((meta as any)?.writeTable) {
            const t = (meta as any).writeTable as string;
            const cm = getColumnMetadata(undefined, t, field);
            editableField = !!cm;
          } else if (defaultWriteOrder && defaultWriteOrder.length) {
            for (const t of defaultWriteOrder) {
              const cm = getColumnMetadata(undefined, t, field);
              if (cm) { editableField = true; break; }
            }
          } else if (defaultWriteTo) {
            const cm = getColumnMetadata(defaultWriteTo.schema, defaultWriteTo.table, field);
            editableField = !!cm;
          }
          

          const selectOptions = selectOptionsMap[field] ?? getCachedOptionsForMeta(meta);

          return (

            <div key={field} style={{ fontSize: 12 }}>

              <div style={{ color: '#64748b', fontSize: 12 }}>{label}</div>

              {editing && editableField ? (

                renderEditor(field, rawValue, (next) => handleFieldChange(field, next), meta, selectOptions)

              ) : (

                <div style={{ fontSize: 12 }}>
                  {field === 'most_recent_note' && typeof rawValue === 'string' && rawValue ? (
                    details?.most_recent_note_id ? (
                      <MostRecentNoteLinkById noteId={String(details.most_recent_note_id)} title={String(rawValue)} />
                    ) : (
                      <MostRecentNoteLink entityDetails={details} entityId={entityId} title={String(rawValue)} />
                    )
                  ) : field === 'most_recent_fillout_form_date' && typeof rawValue === 'string' && rawValue && details?.most_recent_fillout_form_id ? (
                    <MostRecentFilloutFormLink formId={String(details.most_recent_fillout_form_id)} title={String(rawValue)} />
                  ) : (
                    renderDisplayValue(displayValue, meta, referenceLabels[field], selectOptions)
                  )}
                </div>

              )}

            </div>

          );

        })}

      </div>

    </div>

  );

}



function getCachedOptionsForMeta(meta?: FieldMetadata | TableColumnMeta): SelectOption[] | undefined {

  if (!meta) return undefined;

  if (Array.isArray(meta.options) && meta.options.length > 0) {

    return asSelectOptions(meta.options);

  }

  if ('edit' in meta && (meta as FieldMetadata).edit?.enumName) {

    const enumName = (meta as FieldMetadata).edit?.enumName;

    if (enumName) {

      const cached = ENUM_OPTION_CACHE.get(enumName);

      if (cached) return cached;

    }

  }

  if (meta.lookup) {

    const cached = LOOKUP_OPTION_CACHE.get(buildLookupKey(meta.lookup));

    if (cached) return cached;

  }

  return undefined;

}


// Simple multi-select dropdown that looks like a standard select
// and opens a white dropdown panel with checkbox items.
function MultiSelectDropdown({
  value,
  options,
  onChange,
  placeholder = '--',
  disabled = false,
}: {
  value: string[];
  options: SelectOption[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current) return;
      if (e.target instanceof Node && ref.current.contains(e.target)) return;
      setOpen(false);
    }
    if (open) document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  const selectedSet = React.useMemo(() => new Set(value.filter(Boolean)), [value]);
  const summary = React.useMemo(() => {
    if (selectedSet.size === 0) return placeholder;
    const labels: string[] = [];
    for (const opt of options) {
      if (selectedSet.has(opt.value) || selectedSet.has(opt.label)) labels.push(opt.label);
    }
    const text = labels.join(', ');
    return text.length > 60 ? text.slice(0, 57) + '...' : text || String(selectedSet.size);
  }, [options, selectedSet, placeholder]);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((v) => !v)}
        className="wf-multi-select-trigger flex h-8 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 text-left text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-1 focus:ring-slate-950 disabled:opacity-70"
      >
        <span className="truncate">{disabled ? 'Loading...' : summary}</span>
        <span className="ml-2 opacity-60">v</span>
      </button>
      {open
        ? ReactDOM.createPortal(
            (() => {
              const rect = ref.current?.getBoundingClientRect();
              const style: React.CSSProperties = rect
                ? { position: 'fixed', left: rect.left, top: rect.bottom + 4, width: rect.width, zIndex: 99999 }
                : { position: 'fixed', left: 0, top: 0, zIndex: 99999 };
              return (
                <div
                  className="wf-multi-select-content max-h-56 overflow-auto rounded-md bg-white shadow-md"
                  style={{ ...style, padding: 0, fontSize: 10, lineHeight: '12px', border: '1px solid #e2e8f0' }}
                >
                  {options.map((opt) => {
                    const checked = selectedSet.has(opt.value) || selectedSet.has(opt.label);
                    return (
                      <label
                        key={opt.value}
                        className="flex cursor-pointer items-center px-2 hover:bg-slate-100"
                        style={{ paddingTop: 1, paddingBottom: 1, margin: 0, lineHeight: '12px', height: 14, minHeight: 14, gap: 0 }}
                      >
                        <input
                          type="checkbox"
                          className="h-3 w-3"
                          style={{ margin: 0, transform: 'scale(0.8)', transformOrigin: 'left center' }}
                          checked={checked}
                          onChange={(e) => {
                            const next = new Set(Array.from(selectedSet));
                            if (e.target.checked) next.add(opt.value);
                            else {
                              next.delete(opt.value);
                              next.delete(opt.label);
                            }
                            onChange(Array.from(next));
                          }}
                        />
                        <span className="truncate" style={{ fontSize: 10, lineHeight: '12px', display: 'inline-block' }}>{opt.label}</span>
                      </label>
                    );
                  })}
                </div>
              );
            })(),
            document.body
          )
        : null}
    </div>
  );
}



function renderEditor(

  field: string,

  current: any,

  onChange: (value: any) => void,

  meta?: FieldMetadata,

  selectOptions?: SelectOption[],

) {

  const baseType = meta?.type ?? 'string';

  const isArray = meta?.array === true;

  const multiline = meta?.multiline === true;

  const hasOptions = Array.isArray(selectOptions) && selectOptions.length > 0;



  if (meta?.reference) {

    return <div style={{ color: '#64748b' }}>Reference fields are read-only.</div>;

  }



  if (baseType === 'enum' || hasOptions) {

    if (isArray) {

      const rawArray = Array.isArray(current)
        ? current.map((entry) => normalizeOptionValue(entry)).filter((v) => v !== '')
        : current != null
        ? [normalizeOptionValue(current)].filter((v) => v !== '')
        : [];

      const selectedSet = new Set(
        rawArray.map((entry) => {
          const match = selectOptions!.find((opt) => opt.value === entry || opt.label === entry);
          return match ? match.value : entry;
        })
      );

      return (
        <MultiSelectDropdown
          value={Array.from(selectedSet)}
          options={selectOptions || []}
          onChange={(vals) => onChange(vals)}
        />
      );

    }

    const normalized = current == null ? '' : normalizeOptionValue(current);
    const options = selectOptions || [];
    const match = options.find((opt) => opt.value === normalized || opt.label === normalized);
    const stringValue = match ? match.value : normalized;

    return (
      <Select value={stringValue} onValueChange={(val) => onChange(val || null)}>
        <SelectTrigger size="sm" className="bg-white text-slate-900">
          <SelectValue placeholder="--" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          {(selectOptions || []).map((option) => (
            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    );

  }

  // If the field is declared as enum or has a lookup configured, prefer a select UI
  // even if options haven't finished loading yet (render a disabled select as a hint).
  const expectsSelect = Boolean((meta?.edit as any)?.enumName) || Boolean(meta?.lookup);
  if (expectsSelect) {
    if (isArray) {
      const value = Array.isArray(current)
        ? current.map((entry) => normalizeOptionValue(entry)).filter((v) => v !== '')
        : current != null
        ? [normalizeOptionValue(current)].filter((v) => v !== '')
        : [];
      if (!hasOptions) {
        return <div style={{ color: '#64748b', fontSize: 12 }}>Loading…</div>;
      }
      return (
        <MultiSelectDropdown
          value={value}
          options={selectOptions!}
          onChange={(vals) => onChange(vals)}
        />
      );
    }
    const stringValue = current == null ? '' : normalizeOptionValue(current);
    return (
      <select value={stringValue} disabled={!hasOptions} onChange={(event) => onChange(event.target.value || null)}>
        {(!hasOptions ? [{ value: '', label: 'Loading…' }] : [{ value: '', label: '--' }, ...selectOptions!]).map((option) => (
          <option key={option.value} value={option.value} disabled={option.label === 'Loading…'}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }



  if (baseType === 'boolean') {

    return <input type="checkbox" checked={!!current} onChange={(event) => onChange(event.target.checked)} />;

  }



  if (baseType === 'attachment') {

    const normalized = normalizeAttachmentEntries(current);
    const editorValues = normalized
      .map((entry) => attachmentToEditorValue(entry))
      .filter((v): v is string => typeof v === 'string' && v.length > 0);

    if ((Array.isArray(current) && current.length > 1) || editorValues.length > 1) {
      const textValue = editorValues.join('\n');
      return (
        <textarea
          value={textValue}
          onChange={(e) => {
            const lines = e.target.value
              .split(/\r?\n/)
              .map((s) => s.trim())
              .filter(Boolean);
            onChange(lines.length > 0 ? lines : null);
          }}
          rows={3}
          style={{ width: '100%', minHeight: 60, resize: 'vertical' }}
          placeholder="One URL per line"
        />
      );
    }

    const value = editorValues[0] ?? (typeof current === 'string' ? current : '');
    return (
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <Input
          className="h-8 px-3"
          placeholder="https://..."
          value={value}
          onChange={(e) => onChange(e.target.value ? e.target.value : null)}
        />
        {value ? (
          <Button size="sm" variant="outline" onClick={() => onChange(null)}>Clear</Button>
        ) : null}
      </div>
    );

  

  }



  if (isArray) {

    const value = Array.isArray(current) ? current.join(', ') : current ?? '';

    return (

      <Input
        className="h-8 px-3"

        value={value}

        onChange={(event) => {

          const parts = event.target.value

            .split(',')

            .map((part) => part.trim())

            .filter(Boolean);

          onChange(parts);

        }}

      />

    );

  }



  if (baseType === 'number') {

    const value = current ?? '';

    return (

      <Input
        className="h-8 px-3"

        type="number"

        value={value}

        onChange={(event) =>

          onChange(event.target.value === '' ? undefined : Number(event.target.value))

        }

      />

    );

  }



  if (baseType === 'date') {

    const value = current ? String(current).slice(0, 10) : '';

    return <Input className="h-8 px-3" type="date" value={value} onChange={(event) => onChange(event.target.value || null)} />;

  }



  if (multiline) {
    return (
      <textarea
        value={current ?? ''}
        onChange={(event) => onChange(event.target.value)}
        rows={field === 'item' || field === 'text' ? 8 : 4}
        style={{ width: '100%', minHeight: field === 'item' || field === 'text' ? 140 : 80, resize: 'vertical' }}
      />
    );
  }



  return <Input className="h-8 px-3" value={current ?? ''} onChange={(event) => onChange(event.target.value)} />;

}



function DetailTable({ block, entityId }: { block: DetailTableBlock | DetailListBlock; entityId: string }) {

  // Resolve preset (if provided) into an effective config
  const effective = React.useMemo(() => {
    const preset = (block as any).preset ? (TABLE_PRESETS as any)[(block as any).preset] : undefined;
    // Merge, with explicit block values taking precedence over preset
    return {
      ...preset,
      ...block,
      readSource: (block as any).readSource ?? preset?.readSource,
      writeDefaults: (block as any).writeDefaults ?? preset?.writeDefaults,
      columns: (block as any).columns ?? preset?.columns ?? [],
      rowActions: (block as any).rowActions ?? preset?.rowActions ?? [],
      tableActions: (block as any).tableActions ?? preset?.tableActions ?? [],
      tableActionLabels: (block as any).tableActionLabels ?? preset?.tableActionLabels ?? [],
      baseFilter: (block as any).baseFilter ?? (preset as any)?.baseFilter,
    } as DetailTableBlock & any;
  }, [block]);

  const isListVariant = block.kind === 'list';
  const listLayout = isListVariant ? ((effective as any).listLayout as DetailListLayout | undefined) : undefined;

  const [rows, setRows] = React.useState<any[]>([]);

  const [loading, setLoading] = React.useState<boolean>(false);

  const [refreshToken, setRefreshToken] = React.useState<number>(0);
  const [optionsVersion, setOptionsVersion] = React.useState<number>(0);
  const [editingRow, setEditingRow] = React.useState<number | null>(null);
  const [editingValues, setEditingValues] = React.useState<any>({});
  const [listExpansion, setListExpansion] = React.useState<Record<string, { addresses: boolean; body: boolean }>>({});
  // Config-driven toggles
  const toggles: any[] = React.useMemo(() => (effective as any).toggles ?? [], [effective]);
  const [toggleState, setToggleState] = React.useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    for (const t of (toggles as any[])) init[(t as any).id] = !!(t as any).defaultOn;
    return init;
  });
  React.useEffect(() => {
    const init: Record<string, boolean> = {};
    for (const t of (toggles as any[])) init[(t as any).id] = !!(t as any).defaultOn;
    setToggleState(init);
  }, [JSON.stringify(toggles)]);
  const columnAllowsEditLocal = (meta?: TableColumnMeta): boolean => {
    if (!meta) return true;
    const upd = (meta as any).update as 'no' | 'yes' | 'newOnly' | undefined;
    if (upd === 'no' || upd === 'newOnly') return false;
    if ((meta as any).edit === false) return false;
    return true;
  };
  const columnIncludeInCreateLocal = (meta?: TableColumnMeta): boolean => {
    if (!meta) return true;
    const upd = (meta as any).update as 'no' | 'yes' | 'newOnly' | undefined;
    if (upd === 'no') return false;
    return true;
  };

  // Lightweight Guide modal (fetch by email_or_name)
  const [showGuideModal, setShowGuideModal] = React.useState<boolean>(false);
  const [guideKey, setGuideKey] = React.useState<string>("");
  const [guideLoading, setGuideLoading] = React.useState<boolean>(false);
  const [guideData, setGuideData] = React.useState<any>(null);
  const [guideError, setGuideError] = React.useState<string>("");

  const openGuideModal = async (key: string) => {
    setGuideKey(key);
    setGuideLoading(true);
    setGuideError("");
    setShowGuideModal(true);
    try {
      const { data, error } = await (supabase as any).from('guides').select('*').eq('email_or_name', key).maybeSingle();
      if (error) throw error;
      setGuideData(data);
    } catch (e: any) {
      setGuideError(e?.message || 'Unable to load guide');
    } finally {
      setGuideLoading(false);
    }
  };
  const [showCreate, setShowCreate] = React.useState<boolean>(false);
  const [createTitle, setCreateTitle] = React.useState<string>("Add Record");
  // Ensure select options exist for a given meta (enum or lookup)
  async function ensureOptionsForMeta(meta?: FieldMetadata | TableColumnMeta) {
    try {
      if (!meta) return;
      const enumName = (meta as any)?.enumName || (meta as any)?.edit?.enumName;
      if (enumName && !ENUM_OPTION_CACHE.get(enumName)) {
        let opts: SelectOption[] | undefined;
        const local = ENUM_OPTIONS[enumName];
        if (Array.isArray(local) && local.length) {
          opts = asSelectOptions(local);
        } else {
          const { data, error } = await (supabase as any).rpc('enum_values', { enum_type: enumName });
          if (!error && Array.isArray(data)) {
            opts = data.map((entry: any) => {
              const raw = entry?.value ?? entry?.name ?? entry;
              const s = String(raw ?? '');
              return s ? ({ value: s, label: s } as SelectOption) : null;
            }).filter(Boolean) as SelectOption[];
          }
        }
        if (opts && opts.length) {
          ENUM_OPTION_CACHE.set(enumName, opts);
          setOptionsVersion((v) => v + 1);
        }
      }
      const lookup = (meta as any)?.lookup as FieldLookup | undefined;
      if (lookup) {
        // Infer schema for ref_* tables if not specified
        const normalizedLookup: FieldLookup = {
          ...lookup,
          schema: lookup.schema || (typeof lookup.table === 'string' && lookup.table.startsWith('ref_') ? 'ref_tables' : lookup.schema),
        };
        const key = buildLookupKey(normalizedLookup);
        if (!LOOKUP_OPTION_CACHE.get(key)) {
          const client = normalizedLookup.schema && normalizedLookup.schema !== 'public' ? (supabase as any).schema(normalizedLookup.schema) : (supabase as any);
          const { data, error } = await client.from(normalizedLookup.table).select(`${normalizedLookup.valueColumn}, ${normalizedLookup.labelColumn}`).order(normalizedLookup.labelColumn, { ascending: true });
          if (!error && Array.isArray(data)) {
            const opts = (data as any[]).map((row) => {
              const v = row?.[normalizedLookup.valueColumn];
              const l = row?.[normalizedLookup.labelColumn];
              const sv = String(v ?? '');
              const sl = String(l ?? sv);
              return sv ? ({ value: sv, label: sl } as SelectOption) : null;
            }).filter(Boolean) as SelectOption[];
            LOOKUP_OPTION_CACHE.set(key, opts);
            setOptionsVersion((v) => v + 1);
          }
        }
      }
    } catch {}
  }
  const [createValues, setCreateValues] = React.useState<Record<string, any>>({});
  const [createSaving, setCreateSaving] = React.useState<boolean>(false);
  const [createError, setCreateError] = React.useState<string>("");

  // Simple view-in-modal for table rows
  const [viewRowIndex, setViewRowIndex] = React.useState<number | null>(null);

  // Lightweight modal state for adding an email row
  const [showAddEmail, setShowAddEmail] = React.useState<boolean>(false);
  const [newEmail, setNewEmail] = React.useState<string>("");
  const [newEmailCategory, setNewEmailCategory] = React.useState<string>("");
  const [newEmailPrimary, setNewEmailPrimary] = React.useState<boolean>(false);
  const [newEmailValid, setNewEmailValid] = React.useState<boolean>(true);
  const [savingNewEmail, setSavingNewEmail] = React.useState<boolean>(false);
  const [addEmailError, setAddEmailError] = React.useState<string>("");
  const [emailCategoryOptions, setEmailCategoryOptions] = React.useState<SelectOption[]>([]);
  const [loadingEmailCategories, setLoadingEmailCategories] = React.useState<boolean>(false);

  // Load enum options for email address categories when the add-email modal opens
  React.useEffect(() => {
    if (!showAddEmail) return;
    let cancelled = false;
    async function loadCategories() {
      setLoadingEmailCategories(true);
      const { data, error } = await (supabase as any).rpc('enum_values', { enum_type: 'email_address_categories' });
      if (!cancelled) {
        if (!error && Array.isArray(data)) {
          const opts = data.map((entry: any) => {
            const rawValue = entry.value ?? entry.name ?? entry;
            const rawLabel = entry.label ?? rawValue;
            return { value: String(rawValue), label: String(rawLabel) } as SelectOption;
          });
          setEmailCategoryOptions(opts);
        } else {
          setEmailCategoryOptions([]);
        }
        setLoadingEmailCategories(false);
      }
    }
    loadCategories();
    return () => {
      cancelled = true;
    };
  }, [showAddEmail]);



  React.useEffect(() => {

    let isMounted = true;

    async function fetchRows() {

      async function hydrateDocUrls(tableName: string, rows: any[]): Promise<any[]> {
        if (!Array.isArray(rows) || rows.length === 0) return rows;
        try {
          if (tableName === 'governance_docs') {
            const missing = rows.filter((row: any) => !row?.pdf && row?.school_id);
            if (missing.length === 0) return rows;
            const schoolIds = Array.from(new Set(missing.map((row: any) => row.school_id).filter(Boolean)));
            const docTypes = Array.from(new Set(missing.map((row: any) => row.doc_type).filter(Boolean)));
            if (schoolIds.length === 0 || docTypes.length === 0) return rows;
            const { data: urlRows, error: urlError } = await (supabase as any)
              .from('docs_urls')
              .select('school_id, doc_type, gov_doc_full_url')
              .in('school_id', schoolIds)
              .in('doc_type', docTypes)
              .neq('gov_doc_full_url', null);
            if (urlError || !Array.isArray(urlRows)) return rows;
            const map = new Map<string, string>();
            for (const entry of urlRows as any[]) {
              const schoolId = entry?.school_id as string | undefined;
              const docType = entry?.doc_type as string | undefined;
              const rawUrl = typeof entry?.gov_doc_full_url === 'string' ? entry.gov_doc_full_url.trim() : '';
              if (!schoolId || !docType || !rawUrl || rawUrl.endsWith('/')) continue;
              map.set(`${schoolId}::${docType}`, rawUrl);
            }
            if (map.size === 0) return rows;
            return rows.map((row: any) => {
              if (row?.pdf) return row;
              const key = `${row?.school_id}::${row?.doc_type}`;
              const url = map.get(key);
              return url ? { ...row, pdf: url } : row;
            });
          }
          if (tableName === 'nine_nineties') {
            const missing = rows.filter((row: any) => !row?.pdf && row?.school_id);
            if (missing.length === 0) return rows;
            const schoolIds = Array.from(new Set(missing.map((row: any) => row.school_id).filter(Boolean)));
            const years = Array.from(new Set(missing
              .map((row: any) => row?.form_year ?? row?.upload_date ?? row?.tax_year)
              .filter((value: any) => value != null)
              .map((value: any) => String(value))));
            if (schoolIds.length === 0 || years.length === 0) return rows;
            const { data: urlRows, error: urlError } = await (supabase as any)
              .from('docs_urls')
              .select('school_id, upload_date, gov_doc_full_url')
              .in('school_id', schoolIds)
              .in('upload_date', years)
              .ilike('doc_type', '990%')
              .neq('gov_doc_full_url', null);
            if (urlError || !Array.isArray(urlRows)) return rows;
            const map = new Map<string, string>();
            for (const entry of urlRows as any[]) {
              const schoolId = entry?.school_id as string | undefined;
              const uploadYear = entry?.upload_date != null ? String(entry.upload_date) : undefined;
              const rawUrl = typeof entry?.gov_doc_full_url === 'string' ? entry.gov_doc_full_url.trim() : '';
              if (!schoolId || !uploadYear || !rawUrl || rawUrl.endsWith('/')) continue;
              map.set(`${schoolId}::${uploadYear}`, rawUrl);
            }
            if (map.size === 0) return rows;
            return rows.map((row: any) => {
              if (row?.pdf) return row;
              const key = `${row?.school_id}::${String(row?.form_year ?? '')}`;
              const url = map.get(key);
              return url ? { ...row, pdf: url } : row;
            });
          }
        } catch (err) {
          console.warn('Unable to hydrate doc URLs', err);
        }
        return rows;
      }

      setLoading(true);

      const readSource = (effective as any).readSource ?? (effective as any).source;
      if (!readSource || !readSource.table) {
        // No backing table configured; skip fetch to avoid runtime error
        setRows([]);
        setLoading(false);
        return;
      }
      const { schema, table, fkColumn } = readSource;

      const query = schema && schema !== 'public'

        ? (supabase as any).schema(schema).from(table)

        : (supabase as any).from(table);

      let q = query.select('*').eq(fkColumn, entityId);
      // Apply base filter if configured
      const baseFilter = (effective as any).baseFilter as FilterExpr | undefined;
      if (baseFilter) {
        q = applyFilterExprToQuery(q, baseFilter);
      }
      // Apply active toggles
      const activeToggles = (toggles as any[]).filter((t) => toggleState[(t as any).id]);
      for (const t of activeToggles) {
        q = applyFilterExprToQuery(q, (t as any).expr);
      }

      const orderByConfig = Array.isArray((effective as any).orderBy) ? ((effective as any).orderBy as TableOrderBy[]) : undefined;
      const applyOrder = (query: any) => {
        if (!orderByConfig || orderByConfig.length === 0) return query;
        let ordered = query;
        for (const order of orderByConfig) {
          if (!order || !order.column) continue;
          ordered = ordered.order(order.column, { ascending: order.ascending !== false });
        }
        return ordered;
      };

      const maxRows = typeof (effective as any).limit === 'number' && (effective as any).limit > 0 ? (effective as any).limit : 200;

      let orderedQuery = applyOrder(q);
      let { data, error } = await orderedQuery.limit(maxRows);
      if (!error && Array.isArray(data) && data.length === 0) {
        const asNum = Number(entityId);
        if (!Number.isNaN(asNum)) {
          let fallbackQuery = applyOrder(query.select('*').eq(fkColumn, asNum));
          const res2 = await fallbackQuery.limit(maxRows);
          if (!res2.error) {
            data = res2.data as any[];
            error = undefined as any;
          }
        }
      }

      if (isMounted && !error) {

        let processed = (data as any[]) || [];
        processed = await hydrateDocUrls(table, processed);

        if (isMounted) {
          setRows(processed);
        }

      }

      if (isMounted) setLoading(false);

    }

    fetchRows();

    return () => {

      isMounted = false;

    };

  }, [((effective as any).readSource ?? (effective as any).source)?.schema, ((effective as any).readSource ?? (effective as any).source)?.table, ((effective as any).readSource ?? (effective as any).source)?.fkColumn, entityId, refreshToken, JSON.stringify(toggleState)]);



  const columnMetaMap = React.useMemo(() => {
    const cols = (effective as any).columns ?? [];
    const columnNames = (cols as any[]).map((c: any) => (typeof c === 'string' ? c : c.field));
    const manualMeta = new Map<string, TableColumnMeta>();
    for (const c of cols) {
      if (typeof c !== 'string') manualMeta.set(c.field, c);
    }
    const resolvedMap = new Map<string, TableColumnMeta>();
    const src = (effective as any).readSource ?? (effective as any).source;
    const schema = src?.schema;
    const table = src?.table as string | undefined;
    if (!table) return resolvedMap;
    for (const column of columnNames) {
      const merged = mergeTableColumnMeta({ schema, table, column, manual: manualMeta.get(column) });
      resolvedMap.set(column, merged);
    }
    return resolvedMap;
  }, [ (effective as any).columns, ((effective as any).readSource ?? (effective as any).source)?.schema, ((effective as any).readSource ?? (effective as any).source)?.table]);

  const columnOrder = React.useMemo(() => {
    const cols = (effective as any).columns ?? [];
    return ((cols as any[]) || []).map((c: any) => (typeof c === 'string' ? c : c.field));
  }, [(effective as any).columns]);

  function hasRenderableValue(value: any): boolean {
    if (value === null || value === undefined) return false;
    if (Array.isArray(value)) return value.some((entry) => hasRenderableValue(entry));
    if (typeof value === 'string') return value.trim() !== '';
    return true;
  }

  const renderListCards = () => {
    if (!isListVariant) return null;
    if (loading) {
      return <div style={{ padding: 8, fontSize: 13, color: '#64748b' }}>Loading...</div>;
    }
    if (rows.length === 0) {
      return <div style={{ padding: 8, fontSize: 13, color: '#64748b' }}>No records.</div>;
    }

    const layout = listLayout;
    const safeColumns = columnOrder;
    const readSource = ((effective as any).readSource ?? (effective as any).source) as { table?: string } | undefined;
    const listSourceTable = readSource?.table ? String(readSource.table) : undefined;
    const isGmailList = Boolean(listSourceTable && listSourceTable.toLowerCase().includes('g_email'));
    const isBodyField = (field?: string) => typeof field === 'string' && field.toLowerCase().includes('body');
    const isAddressField = (field?: string) => {
      if (!field) return false;
      const key = field.toLowerCase();
      if (key === 'from' || key === 'to' || key === 'cc' || key === 'bcc' || key === 'reply_to') return true;
      if (key.endsWith('_email') || key.endsWith('_emails')) return true;
      if (key.includes('recipient') || key.includes('address')) return true;
      return false;
    };
    const getFieldLabel = (field: string, meta?: TableColumnMeta) => meta?.label ?? labelFromField(field);
    const valueToPreview = (value: any): string => {
      if (value === null || value === undefined) return '';
      if (Array.isArray(value)) {
        return value
          .map((entry) => valueToPreview(entry))
          .filter((entry) => entry.trim().length > 0)
          .join(', ');
      }
      if (typeof value === 'string') return value;
      if (typeof value === 'number' || typeof value === 'boolean') return String(value);
      if (value && typeof value === 'object') {
        const possible = ['label', 'value', 'name'] as const;
        for (const key of possible) {
          const candidate = (value as Record<string, unknown>)[key];
          if (typeof candidate === 'string' && candidate.trim().length > 0) return candidate;
        }
        try {
          return JSON.stringify(value);
        } catch {
          return '';
        }
      }
      return String(value);
    };
    const buildPreviewText = (value: any, limit = 200): string => {
      const plain = valueToPreview(value).replace(/\s+/g, ' ').trim();
      if (!plain) return '';
      if (plain.length <= limit) return plain;
      return `${plain.slice(0, limit).trimEnd()}...`;
    };


    return (
      <div style={{ display: 'grid', gap: 12 }}>
        {rows.map((row, index) => {
          const claimed = new Set<string>();
          const takeField = (field?: string) => {
            if (!field) return undefined;
            if (!safeColumns.includes(field)) return undefined;
            if (claimed.has(field)) return undefined;
            claimed.add(field);
            return field;
          };
          const takeFields = (fields?: readonly string[]) => {
            const list: string[] = [];
            if (!fields) return list;
            for (const field of fields) {
              const picked = takeField(field);
              if (picked) list.push(picked);
            }
            return list;
          };

          let titleField = layout?.titleField ? takeField(layout.titleField) : undefined;
          if (!titleField) {
            titleField = takeField(safeColumns[0]);
          }

          const subtitleFields = takeFields(layout?.subtitleFields);
          const badgeFields = takeFields(layout?.badgeFields);
          const footerFields = takeFields(layout?.footerFields);

          let bodyFields: string[] = [];
          if (layout?.bodyFields && layout.bodyFields.length) {
            bodyFields = takeFields(layout.bodyFields);
          } else {
            bodyFields = safeColumns.filter((field) => {
              if (claimed.has(field)) return false;
              claimed.add(field);
              return true;
            });
          }

          const showLabels = layout?.showFieldLabels !== false;

          const attachmentFields = Array.isArray((layout as any)?.attachmentFields) ? takeFields((layout as any).attachmentFields as any) : [];
          const bodyFieldFullWidth = Boolean((layout as any)?.bodyFieldFullWidth);

          const tryHrefForAttachment = (field: string, value: any, rowObj: any): string | undefined => {
            // Use resolveAttachmentDisplay first
            const { url } = resolveAttachmentDisplay(value);
            if (url) return url;
            // Try common sibling naming conventions
            const base = field.replace(/_id$/i, '');
            const altKeys = [
              `${field}_url`, `${field}_full_url`, `${field}_download_url`,
              `${base}_url`, `${base}_full_url`, `${base}_download_url`
            ];
            for (const k of altKeys) {
              const v = rowObj?.[k];
              if (typeof v === 'string' && v) {
                const href = toPublicUrl(v) || (v.startsWith('http') ? v : undefined);
                if (href) return href;
              }
            }
            // As a last resort, turn raw strings that look like URLs into links
            if (typeof value === 'string' && value.startsWith('http')) return value;
            return undefined;
          };
          const getEffectiveValue = (field: string) =>
            editingRow === index && Object.prototype.hasOwnProperty.call(editingValues, field)
              ? editingValues[field]
              : row?.[field];
          const buildDisplay = (field: string) => {
            const meta = columnMetaMap.get(field);
            const value = getEffectiveValue(field);
            if (!hasRenderableValue(value)) {
              return { field, meta, node: null as React.ReactNode | null, value };
            }
            const selectOptions = getCachedOptionsForMeta(meta);
            const node = renderDisplayValue(value, meta, undefined, selectOptions);
            return { field, meta, node, value };
          };

          const titleDisplay = titleField ? buildDisplay(titleField) : null;
          const subtitleDisplays = subtitleFields.map(buildDisplay).filter((entry) => entry.node != null);
          const badgeDisplays = badgeFields.map(buildDisplay).filter((entry) => entry.node != null);
          const bodyDisplays = bodyFields.map(buildDisplay).filter((entry) => entry.node != null);
          const footerDisplays = footerFields.map(buildDisplay).filter((entry) => entry.node != null);

          const rowKey = row?.id ?? row?.uuid ?? `${index}`;
          const rowKeyString = String(rowKey);
          const expansion = listExpansion[rowKeyString] ?? { addresses: false, body: false };
          const toggleExpansion = (segment: 'addresses' | 'body') => {
            setListExpansion((prev) => {
              const prevEntry = prev[rowKeyString] ?? { addresses: false, body: false };
              return { ...prev, [rowKeyString]: { ...prevEntry, [segment]: !prevEntry[segment] } };
            });
          };

          let subtitleDisplaysToRender = subtitleDisplays;
          let badgeDisplaysToRender = badgeDisplays;
          let bodyDisplaysToRender = bodyDisplays;
          let gmailAddressSection: React.ReactNode = null;
          let bodyFullWidthSection: React.ReactNode = null;
          if (!isGmailList && bodyFieldFullWidth) {
            const pick = (layout?.bodyFields && layout.bodyFields.length ? layout.bodyFields[0] : (bodyFields.find((f) => /body/i.test(f)) || bodyFields[0])) as string | undefined;
            if (pick) {
              bodyDisplaysToRender = bodyDisplaysToRender.filter((e) => e.field !== pick);
              const meta = columnMetaMap.get(pick);
              const value = (editingRow === index && Object.prototype.hasOwnProperty.call(editingValues, pick) ? (editingValues as any)[pick] : (row as any)?.[pick]);
              const selectOptions = getCachedOptionsForMeta(meta);
              const node = hasRenderableValue(value) ? renderDisplayValue(value, meta, undefined, selectOptions) : null;
              bodyFullWidthSection = (
                <div style={{ fontSize: 13, color: '#0f172a', whiteSpace: 'pre-wrap' }}>
                  {node ?? <span style={{ color: '#94a3b8' }}>--</span>}
                </div>
              );
            }
          }
          let gmailBodySection: React.ReactNode = null;
          let gmailPrivateIndicator: React.ReactNode = null;

          if (isGmailList) {
            subtitleDisplaysToRender = [];
            badgeDisplaysToRender = badgeDisplays.filter((entry) => entry.field !== 'is_private');
            bodyDisplaysToRender = bodyDisplays.filter(
              (entry) => !isAddressField(entry.field) && !isBodyField(entry.field)
            );

            const addressFieldOrder: string[] = [];
            const pushAddressField = (field?: string) => {
              if (!field) return;
              if (!safeColumns.includes(field)) return;
              if (!isAddressField(field)) return;
              if (addressFieldOrder.includes(field)) return;
              addressFieldOrder.push(field);
            };
            pushAddressField('from');
            (layout?.subtitleFields ?? []).forEach(pushAddressField);
            (layout?.bodyFields ?? []).forEach(pushAddressField);
            safeColumns.forEach(pushAddressField);

            const addressEntries = addressFieldOrder
              .map((field) => {
                const meta = columnMetaMap.get(field);
                if (!meta) return null;
                const value = getEffectiveValue(field);
                const selectOptions = getCachedOptionsForMeta(meta);
                const node = hasRenderableValue(value) ? renderDisplayValue(value, meta, undefined, selectOptions) : null;
                return { field, meta, node, value };
              })
              .filter(Boolean) as { field: string; meta: TableColumnMeta; node: React.ReactNode | null; value: any }[];

            if (addressEntries.length) {
              const fromEntry = addressEntries.find((entry) => entry.field === 'from');
              const otherAddressEntries = addressEntries.filter((entry) => entry.field !== 'from');
              const additionalCount = otherAddressEntries.filter((entry) => hasRenderableValue(entry.value)).length;
              const fromPreview = buildPreviewText(fromEntry?.value ?? '', 160) || '--';
              const addressSummary =
                additionalCount > 0 ? `From ${fromPreview} +${additionalCount} more` : `From ${fromPreview}`;

              gmailAddressSection = (
                <div style={{ display: 'grid', gap: 6 }}>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      toggleExpansion('addresses');
                    }}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%',
                      padding: 0,
                      border: 'none',
                      background: 'none',
                      fontSize: 13,
                      color: '#0f172a',
                      cursor: 'pointer',
                    }}
                  >
                    <span style={{ fontWeight: 500, textAlign: 'left' }}>{addressSummary}</span>
                    <span style={{ fontSize: 12, color: '#64748b' }}>{expansion.addresses ? 'Hide' : 'Show'}</span>
                  </button>
                  {expansion.addresses ? (
                    <div
                      style={{
                        display: 'grid',
                        gap: 6,
                        padding: '8px 10px',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: 6,
                      }}
                    >
                      {addressEntries.map((entry) => {
                        if (!hasRenderableValue(entry.value) && entry.field !== 'from') return null;
                        const label = getFieldLabel(entry.field, entry.meta);
                        const valueNode = hasRenderableValue(entry.value)
                          ? entry.node ?? buildPreviewText(entry.value, 160)
                          : <span style={{ color: '#94a3b8' }}>--</span>;
                        return (
                          <div
                            key={entry.field}
                            style={
                              showLabels
                                ? { display: 'grid', gridTemplateColumns: '90px 1fr', gap: 8, alignItems: 'start' }
                                : { display: 'block' }
                            }
                          >
                            {showLabels ? (
                              <div style={{ fontSize: 12, color: '#94a3b8' }}>{label}</div>
                            ) : null}
                            <div style={{ fontSize: 12, color: '#0f172a', wordBreak: 'break-word' }}>{valueNode}</div>
                          </div>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              );
            }

            const bodyFieldOrder: string[] = [];
            const pushBodyField = (field?: string) => {
              if (!field) return;
              if (!safeColumns.includes(field)) return;
              if (!isBodyField(field)) return;
              if (bodyFieldOrder.includes(field)) return;
              bodyFieldOrder.push(field);
            };
            (layout?.bodyFields ?? []).forEach(pushBodyField);
            safeColumns.forEach(pushBodyField);
            
            let bodyField = bodyFieldOrder[0];
            if (!bodyField) {
              const r: any = row as any;
              if (r && typeof r === 'object') {
                if (typeof r['body_text'] !== 'undefined') bodyField = 'body_text';
                else if (typeof r['body'] !== 'undefined') bodyField = 'body';
                else if (typeof r['text_body'] !== 'undefined') bodyField = 'text_body';
              }
            }


            if (bodyField) {
              const meta = columnMetaMap.get(bodyField);
              const value = getEffectiveValue(bodyField);
                const selectOptions = getCachedOptionsForMeta(meta);
                const node = hasRenderableValue(value) ? renderDisplayValue(value, meta, undefined, selectOptions) : null;
                const preview = buildPreviewText(value, 360) || '--';
                gmailBodySection = (
                  <div style={{ display: 'grid', gap: 6 }}>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        toggleExpansion('body');
                      }}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                        padding: 0,
                        border: 'none',
                        background: 'none',
                        fontSize: 13,
                        color: '#0f172a',
                        cursor: 'pointer',
                      }}
                    >
                      <span style={{ fontWeight: 500, textAlign: 'left' }}>Message</span>
                      <span style={{ fontSize: 12, color: '#64748b' }}>{expansion.body ? 'Hide' : 'Show'}</span>
                    </button>
                    {expansion.body ? (
                      <div style={{ fontSize: 13, color: '#0f172a', whiteSpace: 'pre-wrap' }}>
                        {node ?? <span style={{ color: '#94a3b8' }}>--</span>}
                      </div>
                    ) : (
                      <div style={{ fontSize: 12, color: '#475569' }}>{preview}</div>
                    )}
                  </div>
                );
            }

            const privateMeta = columnMetaMap.get('is_private');
            const privateEditable = columnAllowsEditLocal(privateMeta as any);
            const privateValue =
              editingRow === index && Object.prototype.hasOwnProperty.call(editingValues, 'is_private')
                ? Boolean(editingValues.is_private)
                : Boolean(row?.is_private);

            if (editingRow === index && privateEditable) {
              gmailPrivateIndicator = (
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#0f172a' }}>
                  <input
                    type="checkbox"
                    checked={privateValue}
                    onChange={(event) => {
                      const next = event.target.checked;
                      setEditingValues((prev: any) => ({ ...prev, is_private: next }));
                    }}
                    onClick={(event) => event.stopPropagation()}
                  />
                  <span>Private</span>
                </label>
              );
            } else if (privateValue) {
              gmailPrivateIndicator = <span style={{ fontSize: 12, fontWeight: 500, color: '#334155' }}>Private</span>;
            }
          }

          return (
            <div
              key={`${rowKey}-${index}`}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                padding: 12,
                background: '#ffffff',
                boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
                display: 'grid',
                gap: 8,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ flex: '1 1 auto', minWidth: 0 }}>
                  {titleField ? (
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 600,
                        color: '#0f172a',
                        marginBottom: subtitleDisplaysToRender.length > 0 || Boolean(gmailAddressSection) ? 4 : 0,
                      }}
                    >
                      {titleDisplay?.node ?? <span style={{ color: '#94a3b8' }}>--</span>}
                    </div>
                  ) : null}
                  {subtitleDisplaysToRender.length ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: 12, color: '#475569' }}>
                      {subtitleDisplaysToRender.map(({ field, meta, node }) => (
                        <span key={field} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <span style={{ color: '#94a3b8' }}>{meta?.label ?? labelFromField(field)}:</span>
                          <span style={{ color: '#0f172a' }}>{node}</span>
                        </span>
                      ))}
                    </div>
                  ) : null}
                  {gmailAddressSection}
                </div>
                {(effective as any).rowActions && (effective as any).rowActions.length > 0 ? (
                  <Select
                    value=""
                    onValueChange={async (value) => {
                      await handleRowAction({
                        actionId: value as any,
                        row,
                        index,
                        effective,
                        setEditingRow,
                        setEditingValues,
                        setViewRowIndex,
                        setRefreshToken,
                      });
                    }}
                  >
                    <SelectTrigger
                      className="w-[92px] text-xs border-slate-300 hover:border-slate-400 focus:ring-1 focus:ring-slate-400 [&_svg]:hidden"
                      style={{ height: '24px', minHeight: '24px', padding: '2px 8px', fontSize: '12px' }}
                      onMouseDown={(event) => event.stopPropagation()}
                      onMouseUp={(event) => event.stopPropagation()}
                      onClick={(event) => event.stopPropagation()}
                    >
                      <SelectValue placeholder="Actions" />
                      <span style={{ marginLeft: 6, opacity: 0.9 }}>v</span>
                    </SelectTrigger>
                    <SelectContent
                      className="bg-white border border-slate-200 shadow-lg z-50"
                      style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', zIndex: 9999 }}
                    >
                      {(effective as any).rowActions.map((action: any) => {
                        const value = typeof action === 'string' ? action : action.id;
                        const label = typeof action === 'string' ? getRowActionLabel(action as any) : action.label;
                        return (
                          <SelectItem
                            key={value}
                            value={value}
                            className="text-xs"
                            style={{ backgroundColor: '#ffffff', color: '#1f2937', fontSize: '11px', padding: '4px 8px' }}
                          >
                            {label}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                ) : null}
              </div>
              {attachmentFields.length ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, fontSize: 12 }}>
                  {attachmentFields.map((field) => {
                    const meta = columnMetaMap.get(field);
                    const raw = (row as any)?.[field];
                    if (raw == null) return null;
                    const entries = normalizeAttachmentEntries(raw);
                    if (entries.length === 0) return null;
                    return (
                      <div key={field} style={{ display: 'flex', alignItems: 'baseline', gap: 6, flexWrap: 'wrap' }}>
                        {showLabels ? (<div style={{ fontSize: 12, color: '#94a3b8' }}>{meta?.label ?? labelFromField(field)}:</div>) : null}
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          {entries.map((entry, idx) => {
                            const disp = resolveAttachmentDisplay(entry);
                            const href = disp.url || tryHrefForAttachment(field, entry, row);
                            const label = disp.label || 'attachment';
                            return href ? (
                              <a key={String(idx)} href={href} target="_blank" rel="noreferrer" style={{ color: '#0ea5e9', textDecoration: 'underline' }}>{label}</a>
                            ) : (
                              <span key={String(idx)} style={{ color: '#0f172a' }}>{label}</span>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : null}
              {badgeDisplaysToRender.length ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, fontSize: 12 }}>
                  {badgeDisplaysToRender.map(({ field, node }) => (
                    <span
                      key={field}
                      style={{
                        padding: '2px 8px',
                        borderRadius: 999,
                        background: '#eff6ff',
                        color: '#1e3a8a',
                        border: '1px solid #bfdbfe',
                      }}
                    >
                      {node}
                    </span>
                  ))}
                </div>
              ) : null}
              {bodyFullWidthSection}\n              {bodyDisplaysToRender.length ? (
                <div style={{ display: 'grid', gap: 8 }}>
                  {bodyDisplaysToRender.map(({ field, meta, node }) => (
                    <div
                      key={field}
                      style={
                        showLabels
                          ? { display: 'grid', gridTemplateColumns: '150px 1fr', gap: 8, alignItems: 'start' }
                          : { display: 'block' }
                      }
                    >
                      {showLabels ? (
                        <div style={{ fontSize: 12, color: '#94a3b8' }}>{meta?.label ?? labelFromField(field)}</div>
                      ) : null}
                      <div style={{ fontSize: 13, color: '#0f172a', whiteSpace: 'pre-wrap' }}>{node}</div>
                    </div>
                  ))}
                </div>
              ) : null}
              {gmailBodySection}
              {footerDisplays.length ? (
                <div style={{ fontSize: 12, color: '#64748b', display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                  {footerDisplays.map(({ field, meta, node }) => (
                    <span key={field}>
                      <span style={{ color: '#94a3b8' }}>{meta?.label ?? labelFromField(field)}:</span>{' '}
                      <span>{node}</span>
                    </span>
                  ))}
                </div>
              ) : null}
              {gmailPrivateIndicator ? (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>{gmailPrivateIndicator}</div>
              ) : null}
            </div>
          );
        })}
      </div>
    );
  };

  // Ensure select/lookup options are available for table inline editors
  React.useEffect(() => {
    let cancelled = false;
    async function loadColumnOptions() {
      try {
        // Collect enum names and lookups from column meta
        const enums = new Set<string>();
        const lookups: { key: string; lookup: FieldLookup; meta: TableColumnMeta }[] = [];
        for (const [field, meta] of columnMetaMap.entries()) {
          const enumName = (meta as any)?.enumName || (meta as any)?.edit?.enumName;
          if (enumName && !ENUM_OPTION_CACHE.get(enumName)) enums.add(enumName);
          if (meta.lookup) {
            const key = buildLookupKey(meta.lookup);
            if (!LOOKUP_OPTION_CACHE.get(key)) lookups.push({ key, lookup: meta.lookup, meta });
          }
        }
        // Load enums
        for (const enumName of enums) {
          let opts: SelectOption[] | undefined;
          const local = ENUM_OPTIONS[enumName];
          if (Array.isArray(local) && local.length) {
            opts = asSelectOptions(local);
          } else {
            const { data, error } = await (supabase as any).rpc('enum_values', { enum_type: enumName });
            if (!cancelled && !error && Array.isArray(data)) {
              opts = data
                .map((entry: any) => {
                  const raw = entry?.value ?? entry?.name ?? entry;
                  const s = String(raw ?? '');
                  return s ? ({ value: s, label: s } as SelectOption) : null;
                })
                .filter(Boolean) as SelectOption[];
            }
          }
          if (opts && opts.length) ENUM_OPTION_CACHE.set(enumName, opts);
        }
        // Load lookups
        for (const { key, lookup, meta } of lookups) {
          const schema = lookup.schema || (typeof lookup.table === 'string' && lookup.table.startsWith('ref_') ? 'ref_tables' : undefined);
          const table = lookup.table;
          const valueCol = lookup.valueColumn;
          const labelCol = lookup.labelColumn;
          const client = schema && schema !== 'public' ? (supabase as any).schema(schema) : (supabase as any);
          let q: any = client.from(table).select(`${valueCol}, ${labelCol}`).order(labelCol, { ascending: true });
          if (table === 'guides') q = q.eq('is_active', true);
          const filter = (meta as any)?.lookupFilter as { column: string; value: any } | undefined;
          if (filter && filter.column !== undefined) {
            q = q.eq(filter.column, filter.value);
          }
          const { data, error } = await q;
          if (!cancelled && !error && Array.isArray(data)) {
            const opts = (data as any[])
              .map((row) => {
                const v = row?.[valueCol];
                const l = row?.[labelCol];
                const sv = String(v ?? '');
                const sl = String(l ?? sv);
                return sv ? ({ value: sv, label: sl } as SelectOption) : null;
              })
              .filter(Boolean) as SelectOption[];
            LOOKUP_OPTION_CACHE.set(key, opts);
          }
        }
      } catch {}
    }
    loadColumnOptions();
    // Nudge a re-render when options are (likely) available
    const timer = window.setTimeout(() => setOptionsVersion((v) => v + 1), 0);
    return () => { cancelled = true; window.clearTimeout(timer); };
  }, [Array.from(columnMetaMap.keys()).join('|')]);



  return (

    <>
      <div style={{ border: '1px solid #e2e8f0', borderRadius: 6 }}>

      <div style={{ padding: 8, borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ fontWeight: 600 }}>{(effective as any).title ?? ''}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {(toggles as any[]).map((t) => (
            <FormControlLabel
              key={(t as any).id}
              control={<Switch size="small" checked={!!toggleState[(t as any).id]} onChange={(e) => setToggleState((s) => ({ ...s, [(t as any).id]: e.target.checked }))} />}
              label={(t as any).label}
              sx={{ m: 0, '& .MuiFormControlLabel-label': { fontSize: 12, color: '#475569' } }}
            />
          ))}
          {(effective as any).tableActions && (effective as any).tableActions.length > 0 ? (
            <div>
              {(effective as any).tableActions.map((action: any, idx: number) => {
              const label = Array.isArray((effective as any).tableActionLabels) && (effective as any).tableActionLabels[idx]
                ? (effective as any).tableActionLabels[idx]!
                : getTableActionLabel(String(action));
              const handleClick = async () => {
                const actionId = typeof action === 'string' ? action : String(action);
                const handled = await handleTableActionClick({
                  actionId,
                  effective,
                  columnMetaMap,
                  ensureOptionsForMeta,
                  setShowAddEmail,
                  setCreateValues,
                  setCreateError,
                  setCreateTitle: (t) => setCreateTitle((label || t || 'Add Record')),
                  setShowCreate,
                });
                if (handled) return;
              };
              return (
                <Button key={String(action)} onClick={handleClick} variant="outline" size="sm" className="ml-2">
                  {label}
                </Button>
              );
            })}
            </div>
          ) : null}
        </div>
      </div>

      {isListVariant ? (
        <div style={{ padding: 12 }}>
          {renderListCards()}
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>

          <table style={{ width: '100%', fontSize: 14 }}>

          <thead>

            <tr>

              {(((effective as any).columns) ?? []).map((c: any) => {
                const column = typeof c === 'string' ? c : c.field;

                const meta = columnMetaMap.get(column);

                const headerStyle: React.CSSProperties = { textAlign: 'left', padding: 6, borderBottom: '1px solid #e2e8f0' };
                if (meta && (meta as any).width !== undefined) {
                  headerStyle.width = (meta as any).width as any;
                }
                return (

                  <th key={column} style={headerStyle}>

                    {meta?.label ?? labelFromField(column)}

                  </th>

                );

              })}

              {(effective as any).rowActions && (effective as any).rowActions.length > 0 ? <th style={{ width: 60 }}></th> : null}

            </tr>

          </thead>

          <tbody>

              {loading ? (

              <tr>

                <td colSpan={(((effective as any).columns?.length) ?? 0) + (((effective as any).rowActions && (effective as any).rowActions.length > 0) ? 1 : 0)} style={{ padding: 6 }}>

                  Loading...

                </td>

              </tr>

            ) : rows.length === 0 ? (

              <tr>

                <td colSpan={(((effective as any).columns?.length) ?? 0) + (((effective as any).rowActions && (effective as any).rowActions.length > 0) ? 1 : 0)} style={{ padding: 6, color: '#64748b' }}>

                  No records.

                </td>

              </tr>

            ) : (

              rows.map((row, index) => (

                <tr key={index}>

                  {(((effective as any).columns) ?? []).map((c: any) => {
                    const column = typeof c === 'string' ? c : c.field;

                    const meta = columnMetaMap.get(column);

                    const selectOptions = getCachedOptionsForMeta(meta);

                    const cellStyle: React.CSSProperties = { padding: 6, borderBottom: '1px solid #f1f5f9', verticalAlign: 'top' };
                    if (meta && (meta as any).width !== undefined) {
                      cellStyle.width = (meta as any).width as any;
                      cellStyle.maxWidth = (meta as any).width as any;
                    }
                    if ((meta as any)?.multiline || (meta as any)?.array) {
                      cellStyle.whiteSpace = 'normal';
                      cellStyle.wordBreak = 'break-word';
                    }
                    return (

                      <td key={column} style={cellStyle}>

                        {editingRow === index && columnAllowsEditLocal(meta as any) ? (
                          renderEditor(
                            column,
                            editingValues[column] ?? row[column],
                            (next) => setEditingValues((prev: any) => ({ ...prev, [column]: next })),
                            meta as any,
                            selectOptions
                          )
                        ) : (
                          (() => {
                            const m = meta as any;
                            const lf: string | undefined = m?.linkToField;
                            const cell = row[column];
                            if (lf && typeof cell === 'string') {
                              const linkVal: any = (row as any)[lf];
                              let href: string | undefined;
                              if (typeof linkVal === 'string') href = toPublicUrl(linkVal) || linkVal;
                              else if (linkVal && typeof linkVal === 'object') href = toPublicUrl(linkVal);
                              if (href) return (<a href={String(href)} target="_blank" rel="noreferrer" style={{ color: '#0ea5e9', textDecoration: 'underline' }}>{String(cell)}</a>);
                            }
                            return renderDisplayValue(cell, meta, undefined, selectOptions);
                          })()
                        )}

                      </td>

                    );

                  })}

                  {(effective as any).rowActions && (effective as any).rowActions.length > 0 ? (
                    <td style={{ padding: 6 }}>
                      <Select
                        value=""
                        onValueChange={async (value) => {
                          await handleRowAction({
                            actionId: value as any,
                            row,
                            index,
                            effective,
                            setEditingRow,
                            setEditingValues,
                            setViewRowIndex,
                            setRefreshToken,
                          });
                        }}
                      >
                        <SelectTrigger 
                          className="w-[92px] text-xs border-slate-300 hover:border-slate-400 focus:ring-1 focus:ring-slate-400 [&_svg]:hidden"
                          style={{ height: '24px', minHeight: '24px', padding: '2px 8px', fontSize: '12px' }}
                          onMouseDown={(event) => event.stopPropagation()}
                          onMouseUp={(event) => event.stopPropagation()}
                          onClick={(event) => event.stopPropagation()}
                        >
                          <SelectValue placeholder="Actions" />
                          <span style={{ marginLeft: 6, opacity: 0.9 }}>▼</span>
                        </SelectTrigger>
                        <SelectContent 
                          className="bg-white border border-slate-200 shadow-lg z-50"
                          style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', zIndex: 9999 }}
                        >
                          {(effective as any).rowActions.map((action: any) => {
                              const value = typeof action === 'string' ? action : action.id;
                              const label = typeof action === 'string' ? getRowActionLabel(action as any) : action.label;
                              return (
                              <SelectItem 
                                key={value}
                                value={value}
                                className="text-xs"
                                style={{ backgroundColor: '#ffffff', color: '#1f2937', fontSize: '11px', padding: '4px 8px' }}
                              >
                                {label}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </td>
                  ) : null}

                </tr>

              ))

            )}

          </tbody>

        </table>

        </div>
      )}


      {editingRow !== null ? (
        <div style={{ padding: 8, borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button
            variant="primary"
            size="sm"
            onClick={async () => {
              try {
                const wr: any = (effective as any).writeDefaults;
                const row = rows[editingRow!];
                if (!row) { setEditingRow(null); setEditingValues({}); return; }
                // Group updates by target (schema, table, pk)
                const groups = new Map<string, { schema?: string; table: string; pk: string; payload: Record<string, any> }>();
                for (const c of ((((effective as any).columns) ?? []) as any[])) {
                  const col = typeof c === 'string' ? c : c.field;
                  if (!(col in editingValues)) continue;
                  const meta = columnMetaMap.get(col) as any;
                  if (!columnIncludeInCreateLocal(meta as any)) return null;
                  const wt = meta?.writeTo as any;
                  const table = wt?.table ?? wr?.table; if (!table) continue;
                  const schema = wt?.schema ?? wr?.schema;
                  const pk = wt?.pk ?? wr?.pkColumn ?? 'id';
                  const key = `${schema || 'public'}|${table}|${pk}`;
                  if (!groups.has(key)) groups.set(key, { schema, table, pk, payload: {} });
                  const outCol = wt?.column ?? col;
                  groups.get(key)!.payload[outCol] = editingValues[col];
                }
                for (const { schema, table, pk, payload } of groups.values()) {
                  const pkValue = (row as any)[pk];
                  const client = schema && schema !== 'public' ? (supabase as any).schema(schema) : (supabase as any);
                  const { error } = await client.from(table).update(payload).eq(pk, pkValue);
                  if (error) throw error;
                }
                setEditingRow(null);
                setEditingValues({});
                setRefreshToken((t) => t + 1);
              } catch (err) {
                console.error('Inline save failed', err);
                alert('Unable to save changes.');
              }
            }}
          >
            Save
          </Button>
          <Button variant="outline" size="sm" onClick={() => { setEditingRow(null); setEditingValues({}); }}>
            Cancel
          </Button>
        </div>
      ) : null}

      {showCreate ? (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}
          onClick={() => !createSaving && setShowCreate(false)}
        >
          <div
            style={{ minWidth: 560, maxWidth: '90vw', maxHeight: '90vh', overflow: 'auto', background: '#ffffff', borderRadius: 8, boxShadow: '0 12px 32px rgba(15,23,42,0.2)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #e2e8f0', fontWeight: 600 }}>
              <span>{createTitle}</span>
              <button type="button" onClick={() => !createSaving && setShowCreate(false)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }}>×</button>
            </div>
            <div style={{ padding: 16, display: 'grid', gap: 10 }}>
              {(((effective as any).columns) ?? []).map((c: any) => {
                const field = typeof c === 'string' ? c : c.field;
                const meta = columnMetaMap.get(field);
                if (!columnIncludeInCreateLocal(meta as any)) return null;
                const selectOptions = getCachedOptionsForMeta(meta);
                return (
                  <label key={field} style={{ display: 'grid', gap: 6 }}>
                    <span style={{ fontSize: 12, color: '#334155' }}>{meta?.label ?? labelFromField(field)}</span>
                    {renderEditor(field, createValues[field], (next) => setCreateValues((prev) => ({ ...prev, [field]: next })), meta as any, selectOptions)}
                  </label>
                );
              })}
              {createError ? <div style={{ color: '#dc2626', fontSize: 12 }}>{createError}</div> : null}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
                <Button variant="outline" size="sm" onClick={() => !createSaving && setShowCreate(false)}>Cancel</Button>
                <Button
                  variant="primary"
                  size="sm"
                  disabled={createSaving}
                  onClick={async () => {
                    setCreateError('');
                    setCreateSaving(true);
                    try {
                      const rs = (effective as any).readSource ?? (effective as any).source;
                      const wr = (effective as any).writeDefaults as any;
                      if (!rs?.table && !wr?.table) throw new Error('No write target configured');
                      const fkColumn = rs?.fkColumn;
                      const targetSchema = wr?.schema;
                      const targetTable = wr?.table ?? rs?.table;
                      const client = targetSchema && targetSchema !== 'public' ? (supabase as any).schema(targetSchema) : (supabase as any);
                      const payload: any = {};
                      if (fkColumn) payload[fkColumn] = entityId;
                      for (const c of (((effective as any).columns) ?? [])) {
                        const col = typeof c === 'string' ? c : c.field;
                        const meta = columnMetaMap.get(col);
                        if (!columnIncludeInCreateLocal(meta as any)) continue;
                        if (createValues[col] !== undefined) payload[col] = createValues[col];
                      }
                      // Apply sensible defaults if not set
                      if ('item_status' in (payload as any) === false && ((effective as any).columns as any[]).some((c:any)=> (typeof c==='string'?c:c.field)==='item_status')) {
                        payload['item_status'] = 'Incomplete';
                      }
                      if ('assigned_date' in (payload as any) === false && ((effective as any).columns as any[]).some((c:any)=> (typeof c==='string'?c:c.field)==='assigned_date')) {
                        payload['assigned_date'] = new Date().toISOString().slice(0,10);
                      }
                      if ('created_date' in (payload as any) === false && ((effective as any).columns as any[]).some((c:any)=> (typeof c==='string'?c:c.field)==='created_date')) {
                        payload['created_date'] = new Date().toISOString().slice(0,10);
                      }
                      // created_by default to current user if available
                      if ('created_by' in (payload as any) === false && ((effective as any).columns as any[]).some((c:any)=> (typeof c==='string'?c:c.field)==='created_by')) {
                        try {
                          const { data } = await (supabase as any).auth.getUser();
                          const u = data?.user;
                          if (u?.email) payload['created_by'] = u.email;
                          else if (u?.id) payload['created_by'] = u.id;
                        } catch {}
                      }
                      const { error } = await client.from(targetTable).insert(payload);
                      if (error) throw error;
                      setShowCreate(false);
                      setCreateSaving(false);
                      setRefreshToken((t) => t + 1);
                    } catch (e: any) {
                      setCreateSaving(false);
                      setCreateError(e?.message || 'Unable to create record.');
                    }
                  }}
                >
                  {createSaving ? 'Saving…' : 'Save'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {viewRowIndex !== null ? (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}
          onClick={() => setViewRowIndex(null)}
        >
          <div
            style={{ minWidth: 480, maxWidth: '90vw', maxHeight: '90vh', overflow: 'auto', background: '#ffffff', borderRadius: 8, boxShadow: '0 12px 32px rgba(15,23,42,0.2)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #e2e8f0', fontWeight: 600 }}>
              <span>View Record</span>
              <button type="button" onClick={() => setViewRowIndex(null)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }}>x</button>
            </div>
            <div style={{ padding: 16, display: 'grid', gap: 8 }}>
              {(() => {
                const r = rows[viewRowIndex!];
                if (!r) return <div style={{ color: '#64748b', fontSize: 12 }}>Record unavailable.</div>;
                const allFields = Object.keys(r as any);
                return allFields.map((field: string) => {
                  const meta = columnMetaMap.get(field);
                  const label = meta?.label ?? labelFromField(field);
                  return (
                    <div key={field} style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 8, alignItems: 'baseline' }}>
                      <div style={{ fontSize: 12, color: '#334155' }}>{label}</div>
                      <div style={{ fontSize: 13, color: '#0f172a' }}>{renderDisplayValue((r as any)[field], meta as any)}</div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      ) : null}
    </div>
    
    {showAddEmail ? (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
        }}
        onClick={() => !savingNewEmail && setShowAddEmail(false)}
      >
        <div
          style={{
            minWidth: 420,
            maxWidth: '90vw',
            background: '#ffffff',
            borderRadius: 8,
            boxShadow: '0 12px 32px rgba(15, 23, 42, 0.2)',
            overflow: 'hidden',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #e2e8f0', fontWeight: 600 }}>
            <span>Add Email</span>
            <button type="button" onClick={() => !savingNewEmail && setShowAddEmail(false)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }}>×</button>
          </div>
          <div style={{ padding: 16, display: 'grid', gap: 10 }}>
            <label style={{ display: 'grid', gap: 6 }}>
              <span style={{ fontSize: 12, color: '#334155' }}>Email Address</span>
              <input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="name@example.org" style={{ border: '1px solid #e2e8f0', borderRadius: 6, padding: '6px 10px' }} />
            </label>
            <label style={{ display: 'grid', gap: 6 }}>
              <span style={{ fontSize: 12, color: '#334155' }}>Category (optional)</span>
              <select
                value={newEmailCategory}
                onChange={(e) => setNewEmailCategory(e.target.value)}
                style={{ border: '1px solid #e2e8f0', borderRadius: 6, padding: '6px 10px', height: 34 }}
              >
                <option value="">--</option>
                {emailCategoryOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              {loadingEmailCategories ? <span style={{ fontSize: 11, color: '#64748b' }}>Loading categories…</span> : null}
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" checked={newEmailPrimary} onChange={(e) => setNewEmailPrimary(e.target.checked)} />
              <span style={{ fontSize: 13 }}>Primary</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" checked={newEmailValid} onChange={(e) => setNewEmailValid(e.target.checked)} />
              <span style={{ fontSize: 13 }}>Valid</span>
            </label>
            {addEmailError ? <div style={{ color: '#dc2626', fontSize: 12 }}>{addEmailError}</div> : null}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
              <Button variant="outline" size="sm" onClick={() => !savingNewEmail && setShowAddEmail(false)}>Cancel</Button>
              <Button
                variant="primary"
                size="sm"
                disabled={savingNewEmail}
                onClick={async () => {
                  setAddEmailError('');
                  let email = newEmail.trim();
                  if (!email) { setAddEmailError('Email is required'); return; }
                  if (!isEmail(email)) { setAddEmailError('Please enter a valid email'); return; }
                  email = normalizeEmail(email);
                  setSavingNewEmail(true);
                  const { schema, table, fkColumn } = block.readSource!;
                  const rel = schema && schema !== 'public' ? `${schema}.${table}` : table;
                  const payload: any = { [fkColumn]: entityId, email_address: email, is_valid: !!newEmailValid, is_primary: !!newEmailPrimary };
                  if (newEmailCategory.trim()) payload.category = newEmailCategory.trim();
                  const { error } = await (supabase as any).from(rel).insert(payload);
                  setSavingNewEmail(false);
                  if (error) { setAddEmailError(error.message || String(error)); return; }
                  setShowAddEmail(false);
                  setRefreshToken((t) => t + 1);
                }}
              >
                {savingNewEmail ? 'Saving…' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    ) : null}

    </>

  );

}



function DetailMap({ block, details }: { block: DetailMapBlock; details: any }) {
  const latField = block.fields[0];
  const lngField = block.fields[1];
  const labelField = block.fields[2];

  const rawLat = latField ? details?.[latField] : undefined;
  const rawLng = lngField ? details?.[lngField] : undefined;
  const label = labelField ? details?.[labelField] : undefined;

  const lat = rawLat != null && rawLat !== '' ? Number(rawLat) : NaN;
  const lng = rawLng != null && rawLng !== '' ? Number(rawLng) : NaN;

  // Prefer coordinates when both are numeric; otherwise fall back to address label
  let src = '';
  if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
    const q = encodeURIComponent(`${lat},${lng}`);
    src = `https://maps.google.com/maps?q=${q}&z=13&output=embed`;
  } else if (typeof label === 'string' && label.trim().length > 0) {
    const q = encodeURIComponent(label.trim());
    src = `https://maps.google.com/maps?q=${q}&z=13&output=embed`;
  }

  return (
    <div style={{ border: '1px solid #e2e8f0', borderRadius: 6, padding: 10 }}>
      <div style={{ fontWeight: 600, marginBottom: 6 }}>{block.title ?? 'Location'}</div>
      {src ? (
        <div style={{ position: 'relative', width: '100%', height: 300, borderRadius: 6, overflow: 'hidden', background: '#f8fafc' }}>
          <iframe
            title={(block.title ?? 'Location') + ' map'}
            src={src}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          {/* Top-left info box showing address/label */}
          {typeof label === 'string' && label.trim().length > 0 ? (
            <div
              style={{
                position: 'absolute',
                top: 8,
                left: 8,
                background: '#ffffff',
                color: '#0f172a',
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                padding: '6px 10px',
                fontSize: 12,
                boxShadow: '0 8px 16px rgba(15, 23, 42, 0.08)',
                maxWidth: '70%',
                pointerEvents: 'none',
              }}
            >
              {label}
            </div>
          ) : null}
          {/* Centered custom marker using logo if available */}
          {(() => {
            const logoUrl = (details?.logo_url || details?.logo) as string | undefined;
            const size = 40;
            return (
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -100%)',
                  width: size,
                  height: size,
                  borderRadius: 8,
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 6px 14px rgba(0,0,0,0.15)',
                  pointerEvents: 'none',
                }}
              >
                {logoUrl ? (
                  <img src={logoUrl} alt="School logo" style={{ maxWidth: '88%', maxHeight: '88%', objectFit: 'contain', borderRadius: 4 }} />
                ) : (
                  <div style={{ width: 10, height: 10, borderRadius: 999, background: '#0f8a8d' }} />
                )}
              </div>
            );
          })()}
        </div>
      ) : (
        <div style={{ fontSize: 13, color: '#64748b' }}>No location to display.</div>
      )}
    </div>
  );
}



function getInitialValues(fields: string[], details: any) {

  const acc: Record<string, any> = {};

  for (const field of fields) {

    acc[field] = details?.[field];

  }

  return acc;

}



// Normalize Gmail body/subject text to fix mojibake and HTML entities
function normalizeTextForEmail(input: string): string {
  if (input == null) return '';
  let text = String(input);
  // Decode basic HTML entities
  try {
    const div = document.createElement('div');
    div.innerHTML = text;
    const decoded = (div.textContent || div.innerText || '') as string;
    if (decoded) text = decoded;
  } catch {}
  // Remove zero-width chars
  text = text.replace(/[\u200B-\u200D\uFEFF]/g, '');
  // If typical mojibake sequences exist, attempt Latin1->UTF8 fix
  const looksMojibake = /(?:Ã\.|Â|â€™|â€œ|â€\u001d|â€“|â€”|â€¢)/.test(text);
  if (looksMojibake && typeof TextDecoder !== 'undefined') {
    try {
      const bytes = new Uint8Array(text.length);
      for (let i = 0; i < text.length; i++) bytes[i] = text.charCodeAt(i) & 0xff;
      const fixed = new TextDecoder('utf-8', { fatal: false }).decode(bytes);
      if (fixed && fixed !== text) text = fixed;
    } catch {}
  }
  // Clean up a few common leftovers
  text = text
    .replace(/\u00A0/g, ' ')
    .replace(/\s{3,}/g, ' ')
    .trim();
  return text;
}

function maybeNormalizeEmailField(fieldName: string | undefined, value: string): string {
  const f = (fieldName || '').toLowerCase();
  if (f === 'subject' || f === 'body_text' || f === 'body' || f === 'text_body') {
    return normalizeTextForEmail(value);
  }
  return value;
}
function renderDisplayValue(

  value: any,

  meta?: FieldMetadata | TableColumnMeta,

  referenceLabels?: string[],

  selectOptions?: SelectOption[],

) {

  const placeholder = <span style={{ color: '#94a3b8' }}>-</span>;

  const isArray = Boolean(meta && 'array' in meta && meta.array);

  const baseType = meta?.type ?? 'string';



  if ((value == null || value === '') && (!isArray || !Array.isArray(value))) {

    return placeholder;

  }



  if (referenceLabels && referenceLabels.length > 0) {

    return referenceLabels.join(', ');

  }



  const optionLabelFor = (raw: any): string | undefined => {

    if (!selectOptions || selectOptions.length === 0) return undefined;

    const normalized = normalizeOptionValue(raw);

    return selectOptions.find((option) => option.value === normalized)?.label;

  };



  if (isArray && Array.isArray(value)) {

    if (value.length === 0) return placeholder;

    const allStrings = value.every((v: any) => typeof v === 'string');
    if (allStrings && value.some((v: any) => isFileLikePath(String(v)))) {
      return (
        <div>
          {value.map((v: any, idx: number) => {
            const href = toPublicUrl(v) || String(v);
            const label = String(v);
            return (
              <div key={idx}>
                <a href={href} target="_blank" rel="noreferrer">{label}</a>
              </div>
            );
          })}
        </div>
      );
    }

    const resolved = selectOptions && selectOptions.length > 0

      ? value

          .map((entry) => optionLabelFor(entry) ?? normalizeOptionValue(entry))

          .filter((entry) => entry !== '')

      : value.map((entry) => normalizeOptionValue(entry));

    const maxEntries = typeof (meta as any)?.maxArrayEntries === 'number' ? (meta as any).maxArrayEntries : undefined;
    let displayValues = resolved;
    if (typeof maxEntries === 'number' && maxEntries > 0 && resolved.length > maxEntries) {
      const limited = resolved.slice(0, maxEntries);
      const remaining = resolved.length - maxEntries;
      limited.push(`+${remaining} more`);
      displayValues = limited;
    }

    return displayValues.length > 0 ? displayValues.join(', ') : placeholder;

  }



  const optionLabel = optionLabelFor(value);

  if (optionLabel !== undefined) {

    return optionLabel;

  }



  if (meta && 'reference' in meta && meta.reference) {

    if (Array.isArray(value)) {

      return value.length > 0 ? value.join(', ') : placeholder;

    }

    if (value == null || value === '') {

      return placeholder;

    }

  }



  if (baseType === 'boolean') return value ? 'Yes' : 'No';

  if (baseType === 'attachment') {
    const attachments = normalizeAttachmentEntries(value);
    if (attachments.length === 0) {
      return placeholder;
    }
    return (
      <div>
        {attachments.map((att: any, idx: number) => {
          const { url, label } = resolveAttachmentDisplay(att);
          if (url) {
            return (
              <div key={idx}>
                <a href={url} target="_blank" rel="noreferrer" style={{ display: 'inline-block', maxWidth: 160 }}>
                  <img src={url} alt={label || 'attachment'} style={{ maxWidth: '160px', maxHeight: '120px', borderRadius: 6, display: 'block' }} />
                </a>
              </div>
            );
          }
          if (label) {
            return (
              <div key={idx} style={{ fontSize: 12, color: '#475569' }}>{label}</div>
            );
          }
          return null;
        })}
      </div>
    );
  }

  if (value instanceof Date) {
    const y = value.getFullYear();
    const m = value.getMonth() + 1;
    const d = value.getDate();
    return `${m}/${d}/${y}`;
  }

  if (Array.isArray(value)) return value.length > 0 ? value.join(', ') : placeholder;

  if (typeof value === 'object') return JSON.stringify(value);

  // Linkify file-like string values
  if (typeof value === 'string' && isFileLikePath(value)) {
    const href = toPublicUrl(value) || value;
    return (
      <a href={href} target="_blank" rel="noreferrer">{String(value)}</a>
    );
  }



    // Get the field name to check for currency/percentage fields

  const fieldName = meta && 'field' in meta ? (meta as any).field : '';

  // For email subject/body fields, normalize special chars and mojibake
  if (typeof value === 'string') {
    const normalized = maybeNormalizeEmailField(fieldName, value);
    if (!isFileLikePath(normalized)) {
      if (normalized !== value) return normalized;
    }
  }

  // fieldName declared above (normalized block)

  // Format date strings as M/D/YYYY when type is date or value looks like a date
  if (
    baseType === 'date' ||
    (typeof value === 'string' && /^(\d{4})-(\d{2})-(\d{2})(?:[T\s].*)?$/.test(String(value)))
  ) {
    const m = String(value).match(/^(\d{4})-(\d{2})-(\d{2})(?:[T\s].*)?$/);
    if (m) {
      const y = Number(m[1]);
      const mm = Number(m[2]);
      const dd = Number(m[3]);
      if (!Number.isNaN(y) && !Number.isNaN(mm) && !Number.isNaN(dd)) {
        return `${mm}/${dd}/${y}`;
      }
    }
  }



  // Format currency fields (amount, amount_issued, etc.)

  if (
    baseType === 'number' && (
      fieldName === 'amount' ||
      fieldName === 'amount_issued' ||
      fieldName === 'total_grants_issued' ||
      fieldName === 'total_loans_issued'
    )
  ) {
    const formatted = formatCurrencyUSD(value as any, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    if (formatted) return formatted;
  }



  // Format percentage field (interest_rate only)

  if (baseType === 'number' && fieldName === 'interest_rate') {

    const numValue = typeof value === 'number' ? value : parseFloat(value);

    if (!isNaN(numValue)) {

      // Multiply by 100 if the value is less than 1 (assuming it's a decimal)

      const percentValue = numValue < 1 ? numValue * 100 : numValue;

      return percentValue.toFixed(0) + '%';

    }

  }



  return String(value);

}



function formatLabel(field: string): string {

  return field

    .replace(/_/g, ' ')

    .replace(/\s+/g, ' ')

    .trim()

    .replace(/\w/g, (char) => char.toUpperCase());

}

function normalizeAbbrev(label: string): string {
  const words = label.split(' ').map((w) => {
    const lower = w.toLowerCase();
    if (lower === 'ssj') return 'SSJ';
    if (lower === 'tl') return 'TL';
    if (lower === 'tls') return 'TLs';
    if (lower === 'fy') return 'FY';
    if (lower === 'id') return 'ID';
    if (lower === 'ein') return 'EIN';
    if (lower === 'loi') return 'LOI';
    if (lower === 'url') return 'URL';
    if (lower === 'pm') return 'PM';
    if (lower === 'wf') return 'WF';
    if (lower === 'gcal') return 'gCal';
    if (lower === 'gmail') return 'Gmail';
    if (lower === 'gsuite') return 'G Suite';
    return w;
  });
  return words.join(' ');
}

// Build a human-friendly label from a field id, applying Title Case and
// then fixing common abbreviations without lowercasing the rest of the words.
function labelFromField(field: string): string {
  const sepNormalized = String(field)
    .replace(/[._-]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .trim()
    .toLowerCase()
    .replace(/\b([a-z])/g, (_: any, c: string) => c.toUpperCase());
  return normalizeAbbrev(sepNormalized);
}



function groupFieldUpdates(

  fields: string[],

  values: Record<string, any>,

  fieldMeta?: FieldMetadataMap,

  tabExceptions?: LookupException[],
  defaultWriteTo?: WriteTarget,

): Array<{ writeTo: WriteTarget; payload: Record<string, any>; exceptions?: ExceptionMap[] }> {
  const groups = new Map<string, { writeTo: WriteTarget; payload: Record<string, any>; exceptions: ExceptionMap[] }>();

  for (const field of fields) {

    const meta = fieldMeta?.[field];

    if (meta?.editable === false) continue;

    // Resolve write target via explicit edit, shorthand writeTable, or defaultWriteTo
    let target: WriteTarget | undefined;
    let columnName: string | undefined;
    if (meta?.edit) {
      target = { schema: meta.edit.schema, table: meta.edit.table, pk: meta.edit.pk };
      columnName = meta.edit.column ?? field;
    } else if ((meta as any)?.writeTable) {
      const table = (meta as any).writeTable as string;
      const pk = inferPkForTable(table, defaultWriteTo);
      target = { table, pk };
      columnName = field;
    }

    if (!target) {
      if (defaultWriteTo) {
        const cm = getColumnMetadata(defaultWriteTo.schema, defaultWriteTo.table, field);
        if (cm) {
          const key = `${defaultWriteTo.schema ?? 'public'}|${defaultWriteTo.table}|${defaultWriteTo.pk ?? 'id'}`;
          let entry = groups.get(key);
          if (!entry) {
            entry = { writeTo: { ...defaultWriteTo }, payload: {}, exceptions: [] };
            groups.set(key, entry);
          }
          entry.payload[field] = values[field];
        }
      }
      continue;
    }

    // With target resolved
    const key = `${target.schema ?? 'public'}|${target.table}|${target.pk ?? 'id'}`;
    let entry = groups.get(key);
    if (!entry) {
      entry = { writeTo: target, payload: {}, exceptions: [] };
      groups.set(key, entry);
    }
    entry.payload[columnName ?? field] = values[field];
    if ((columnName ?? field) !== field) {
      entry.exceptions.push({ field, mapsToField: columnName });
    }

    // Note: additional exceptions can be provided at tab level below

  }

  if (tabExceptions && tabExceptions.length > 0) {

    for (const entry of groups.values()) {

      const relevant = tabExceptions.filter((ex) => ex.field in entry.payload);

      if (relevant.length) entry.exceptions.push(...relevant);

    }

  }

  return Array.from(groups.values()).map(({ writeTo, payload, exceptions }) => ({

    writeTo,

    payload,

    exceptions: dedupeExceptions(exceptions),

  }));

}

function inferPkForTable(table: string, fallbackParent?: { schema?: string; table: string; pk?: string }): string | undefined {
  // Prefer schema-based inference when we know the parent table
  if (fallbackParent) {
    const fk = findForeignKeyColumn({ schema: undefined, table, parentSchema: fallbackParent.schema, parentTable: fallbackParent.table, parentPk: fallbackParent.pk ?? 'id' });
    if (fk) return fk;
  }
  // Fallback to explicit defaults map
  const def = getDefaultForTable(table);
  if (def?.pk) return def.pk;
  return undefined;
}



function dedupeExceptions(exceptions: ExceptionMap[]): ExceptionMap[] {

  if (!exceptions || exceptions.length === 0) return [];

  const seen = new Set<string>();

  const result: ExceptionMap[] = [];

  for (const ex of exceptions) {

    const key = JSON.stringify(ex);

    if (seen.has(key)) continue;

    seen.add(key);

    result.push(ex);

  }

  return result;

}



function useReferenceLabels(

  fields: string[],

  values: Record<string, any>,

  fieldMeta?: FieldMetadataMap,

): Record<string, string[]> {

  const [labels, setLabels] = React.useState<Record<string, string[]>>({});

  React.useEffect(() => {

    if (!fieldMeta) return;

    const metaMap = fieldMeta;

    let cancelled = false;

    const references = fields.filter((field) => Boolean(metaMap[field]?.reference));

    if (references.length === 0) return;



    async function load() {

      const updates: Record<string, string[]> = {};

      for (const field of references) {

        const meta = metaMap[field];

        const reference = meta?.reference;

        if (!reference) continue;

        const rawValue = values[field];

        const valueArray = Array.isArray(rawValue) ? rawValue : rawValue != null ? [rawValue] : [];

        if (valueArray.length === 0) {

          updates[field] = [];

          continue;

        }

        const uniqueValues = Array.from(new Set(valueArray.map((val) => String(val))));

        const valueColumn = reference.valueColumn || 'id';

        const labelColumn = reference.labelColumn;

        const query = reference.schema

          ? (supabase as any).schema(reference.schema).from(reference.table)

          : (supabase as any).from(reference.table);

        const { data, error } = await query

          .select(`${valueColumn}, ${labelColumn}`)

          .in(valueColumn, uniqueValues);

        if (!error && data && Array.isArray(data)) {

          const map = new Map<string, string>();

          for (const row of data) {

            map.set(String(row[valueColumn]), String(row[labelColumn]));

          }

          updates[field] = valueArray.map((val) => map.get(String(val)) ?? String(val));

        }

      }

      if (!cancelled && Object.keys(updates).length > 0) {

        setLabels((prev) => ({ ...prev, ...updates }));

      }

    }



    load();

    return () => {

      cancelled = true;

    };

  }, [fields, JSON.stringify(values), fieldMeta]);



  return labels;

}




// Lightweight link + modal to show the most recent note for an entity
function MostRecentNoteLink({ entityDetails, entityId, title }: { entityDetails: any; entityId: string; title: string }) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string>("");
  const [note, setNote] = React.useState<any>(null);

  const load = async () => {
    setLoading(true);
    setError("");
    setNote(null);
    try {
      const fkCandidates = ['people_id', 'school_id', 'charter_id'];
      // Build OR filter across likely fk columns
      const ors = fkCandidates.map((k) => `${k}.eq.${entityId}`).join(',');
      const { data, error } = await (supabase as any)
        .from('notes')
        .select('*')
        .or(ors)
        .order('created_date', { ascending: false })
        .limit(1);
      if (error) throw error;
      setNote((data && data[0]) || null);
    } catch (e: any) {
      setError(e?.message || 'Unable to load note');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => { setOpen(true); void load(); }}
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          margin: 0,
          fontSize: 12,
          color: '#0ea5e9',
          cursor: 'pointer',
          textDecoration: 'underline',
        }}
        title="View full note"
      >
        {title}
      </button>

      {open ? (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60 }}
          onClick={() => setOpen(false)}
        >
          <div
            style={{ minWidth: 560, maxWidth: '90vw', maxHeight: '90vh', overflow: 'auto', background: '#ffffff', borderRadius: 8, boxShadow: '0 12px 32px rgba(15,23,42,0.2)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #e2e8f0', fontWeight: 600 }}>
              <span>Most Recent Note</span>
              <button type="button" onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }}>x</button>
            </div>
            <div style={{ padding: 16, display: 'grid', gap: 10 }}>
              {loading ? (
                <div style={{ fontSize: 12, color: '#64748b' }}>Loading note.</div>
              ) : error ? (
                <div style={{ fontSize: 12, color: '#dc2626' }}>{error}</div>
              ) : note ? (
                <>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>
                    {String((note as any).title ?? (note as any).subject ?? title)}
                  </div>
                  <div style={{ whiteSpace: 'pre-wrap', fontSize: 13, color: '#111827' }}>
                    {String((note as any).full_text ?? (note as any).text ?? '')}
                  </div>
                </>
              ) : (
                <div style={{ fontSize: 12, color: '#64748b' }}>No note found.</div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

// Link + modal: load note by id (view-only)
function MostRecentNoteLinkById({ noteId, title }: { noteId?: string; title: string }) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string>("");
  const [note, setNote] = React.useState<any>(null);

  const load = async () => {
    if (!noteId) { setError('Note id is missing'); setNote(null); return; }
    setLoading(true);
    setError("");
    setNote(null);
    try {
      const { data, error } = await (supabase as any)
        .from('notes')
        .select('*')
        .eq('id', noteId)
        .maybeSingle();
      if (error) throw error;
      setNote(data || null);
    } catch (e: any) {
      setError(e?.message || 'Unable to load note');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => { setOpen(true); void load(); }}
        style={{ background: 'none', border: 'none', padding: 0, margin: 0, fontSize: 12, color: '#0ea5e9', cursor: 'pointer', textDecoration: 'underline' }}
        title="View full note"
      >
        {title}
      </button>
      {open ? (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60 }} onClick={() => setOpen(false)}>
          <div style={{ minWidth: 560, maxWidth: '90vw', maxHeight: '90vh', overflow: 'auto', background: '#ffffff', borderRadius: 8, boxShadow: '0 12px 32px rgba(15,23,42,0.2)' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #e2e8f0', fontWeight: 600 }}>
              <span>Most Recent Note</span>
              <button type="button" onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }}>x</button>
            </div>
            <div style={{ padding: 16, display: 'grid', gap: 10 }}>
              {loading ? (
                <div style={{ fontSize: 12, color: '#64748b' }}>Loading note.</div>
              ) : error ? (
                <div style={{ fontSize: 12, color: '#dc2626' }}>{error}</div>
              ) : note ? (
                <>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{String((note as any).title ?? (note as any).subject ?? title)}</div>
                  <div style={{ whiteSpace: 'pre-wrap', fontSize: 13, color: '#111827' }}>{String((note as any).full_text ?? (note as any).text ?? '')}</div>
                </>
              ) : (
                <div style={{ fontSize: 12, color: '#64748b' }}>No note found.</div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

// Link + modal: load fillout form by id (view-only)
function MostRecentFilloutFormLink({ formId, title }: { formId?: string; title: string }) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string>("");
  const [form, setForm] = React.useState<any>(null);

  const load = async () => {
    if (!formId) { setError('Form id is missing'); setForm(null); return; }
    setLoading(true);
    setError("");
    setForm(null);
    try {
      const { data, error } = await (supabase as any)
        .from('ssj_fillout_forms')
        .select('*')
        .eq('id', formId)
        .maybeSingle();
      if (error) throw error;
      setForm(data || null);
    } catch (e: any) {
      setError(e?.message || 'Unable to load form');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => { setOpen(true); void load(); }}
        style={{ background: 'none', border: 'none', padding: 0, margin: 0, fontSize: 12, color: '#0ea5e9', cursor: 'pointer', textDecoration: 'underline' }}
        title="View fillout form"
      >
        {title}
      </button>
      {open ? (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60 }} onClick={() => setOpen(false)}>
          <div style={{ minWidth: 560, maxWidth: '90vw', maxHeight: '90vh', overflow: 'auto', background: '#ffffff', borderRadius: 8, boxShadow: '0 12px 32px rgba(15,23,42,0.2)' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #e2e8f0', fontWeight: 600 }}>
              <span>Most Recent Fillout Form</span>
              <button type="button" onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }}>x</button>
            </div>
            <div style={{ padding: 16, display: 'grid', gap: 10 }}>
              {loading ? (
                <div style={{ fontSize: 12, color: '#64748b' }}>Loading form.</div>
              ) : error ? (
                <div style={{ fontSize: 12, color: '#dc2626' }}>{error}</div>
              ) : form ? (
                <div style={{ display: 'grid', gap: 8 }}>
                  {Object.entries(form as any).map(([k, v]) => (
                    <div key={k} style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 8, alignItems: 'start' }}>
                      <div style={{ fontSize: 12, color: '#64748b' }}>{k}</div>
                      <div style={{ fontSize: 13, color: '#111827', whiteSpace: 'pre-wrap' }}>
                        {Array.isArray(v) ? v.join(', ') : (typeof v === 'object' && v !== null ? JSON.stringify(v, null, 2) : String(v ?? ''))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: 12, color: '#64748b' }}>No form found.</div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}






































