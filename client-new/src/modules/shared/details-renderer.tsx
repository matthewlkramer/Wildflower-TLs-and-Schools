import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Tabs, Tab, Box } from '@mui/material';

import { supabase } from '@/lib/supabase/client';
import { isEmail, normalizeEmail, isPhoneE164, normalizePhoneToE164, isEIN, normalizeEIN } from './validators';

import {

  type DetailTabSpec,

  type DetailCardBlock,

  type DetailTableBlock,

  type DetailMapBlock,

  type LookupException,

  type FieldMetadataMap,

  type FieldMetadata,

  type FieldLookup,

  type TableColumnMeta,

} from './detail-types';

import { mergeTableColumnMeta, mergeFieldMetadata } from './schema-metadata';

import { saveCardValues, type ExceptionMap, type WriteTarget } from '../educators/helpers/write-helpers';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';



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



export type DetailsRendererProps = {

  entityId: string;

  details: any;

  tabs: DetailTabSpec[];

  resolveTitle: (details: any, entityId: string) => string;

  defaultTabId?: string;

  fieldMeta?: FieldMetadataMap;

};



export function DetailsRenderer({ entityId, details, tabs, resolveTitle, defaultTabId, fieldMeta }: DetailsRendererProps) {

  const safeTabs = Array.isArray(tabs) ? tabs : [];

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

      {/* OPTION 1: Pill/Button Style - Modern rounded tabs */}
      { <Box sx={{ marginBottom: 3, padding: '8px', backgroundColor: '#e0f2f1', borderRadius: '12px', display: 'inline-flex' }}>
        <Tabs 
          value={active} 
          onChange={(event, newValue) => setActive(newValue)}
          sx={{
            minHeight: 40,
            '& .MuiTabs-indicator': {
              display: 'none',
            },
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.875rem',
              color: '#475569',
              minHeight: 36,
              borderRadius: '8px',
              margin: '0 4px',
              padding: '6px 16px',
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
      </Box> }

      {/* OPTION 2: Classic Folder Tabs - Traditional file folder appearance */}
      {/* <Box sx={{ marginBottom: 2 }}>
        <Tabs 
          value={active} 
          onChange={(event, newValue) => setActive(newValue)}
          sx={{
            minHeight: 42,
            '& .MuiTabs-indicator': {
              display: 'none',
            },
            '& .MuiTabs-flexContainer': {
              borderBottom: '2px solid #d0d5dd',
            },
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.9rem',
              color: '#64748b',
              backgroundColor: '#e2e8f0',
              minHeight: 42,
              border: '1px solid #d0d5dd',
              borderBottom: 'none',
              borderRadius: '8px 8px 0 0',
              marginRight: '4px',
              '&.Mui-selected': {
                color: '#1f2937',
                fontWeight: 600,
                backgroundColor: '#ffffff',
                borderColor: '#d0d5dd',
                borderBottom: '2px solid #ffffff',
                marginBottom: '-2px',
                zIndex: 1,
              },
              '&:hover': {
                backgroundColor: '#f1f5f9',
              },
              '&.Mui-selected:hover': {
                backgroundColor: '#ffffff',
              },
            },
          }}
        >
          {safeTabs.map((tab) => (
            <Tab key={tab.id} label={tab.label} value={tab.id} />
          ))}
        </Tabs>
      </Box> */}

      {/* OPTION 3: Underline Only - Minimal clean style */}
      {/*<Box sx={{ borderBottom: 2, borderColor: '#e2e8f0', marginBottom: 3 }}>
        <Tabs 
          value={active} 
          onChange={(event, newValue) => setActive(newValue)}
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: '#0f8a8d',
              height: 3,
              borderRadius: '3px 3px 0 0',
            },
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.9rem',
              color: '#64748b',
              minHeight: 44,
              padding: '12px 20px',
              '&.Mui-selected': {
                color: '#0f8a8d',
                fontWeight: 600,
              },
              '&:hover': {
                color: '#334155',
                backgroundColor: 'rgba(15, 138, 141, 0.04)',
              },
            },
          }}
        >
          {safeTabs.map((tab) => (
            <Tab key={tab.id} label={tab.label} value={tab.id} />
          ))}
        </Tabs>
      </Box>*/}

      {/* OPTION 4: Segmented Control - iOS style toggle */}
      {/* <Box sx={{ marginBottom: 3 }}>
        <Box sx={{ 
          display: 'inline-flex', 
          backgroundColor: '#ffffff', 
          padding: '4px',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <Tabs 
            value={active} 
            onChange={(event, newValue) => setActive(newValue)}
            sx={{
              minHeight: 36,
              '& .MuiTabs-indicator': {
                display: 'none',
              },
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.875rem',
                color: '#64748b',
                minHeight: 36,
                borderRadius: '6px',
                padding: '6px 20px',
                margin: '0 2px',
                transition: 'all 0.2s',
                '&.Mui-selected': {
                  color: '#0f8a8d',
                  backgroundColor: '#f0fafa',
                  fontWeight: 600,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                },
                '&:hover': {
                  backgroundColor: '#f9fafb',
                },
                '&.Mui-selected:hover': {
                  backgroundColor: '#e0f2f1',
                },
              },
            }}
          >
            {safeTabs.map((tab) => (
              <Tab key={tab.id} label={tab.label} value={tab.id} />
            ))}
          </Tabs>
        </Box>
      </Box>*/ }

      {/* OPTION 5: Card Style - Each tab as a card */}
      {/* <Box sx={{ display: 'flex', gap: 1, marginBottom: 3, flexWrap: 'wrap' }}>
        {safeTabs.map((tab) => (
          <Box
            key={tab.id}
            onClick={() => setActive(tab.id)}
            sx={{
              padding: '10px 20px',
              backgroundColor: active === tab.id ? '#ffffff' : '#f8fafc',
              border: active === tab.id ? '2px solid #0f8a8d' : '2px solid #e2e8f0',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: active === tab.id ? 600 : 500,
              fontSize: '0.9rem',
              color: active === tab.id ? '#0f8a8d' : '#64748b',
              boxShadow: active === tab.id ? '0 2px 8px rgba(15,138,141,0.15)' : 'none',
              transition: 'all 0.2s',
              '&:hover': {
                backgroundColor: '#ffffff',
                borderColor: active === tab.id ? '#0f8a8d' : '#cbd5e1',
                transform: 'translateY(-1px)',
              },
            }}
          >
            {tab.label}
          </Box>
        ))}
      </Box> */}

      {safeTabs.map((tab) => (

        <React.Fragment key={tab.id}>

          {tab.id === active ? (

            <TabContent tab={tab} entityId={entityId} details={details} fieldMeta={fieldMeta} />

          ) : null}

        </React.Fragment>

      ))}

    </div>

  );

}



function TabContent({ tab, entityId, details, fieldMeta }: { tab: DetailTabSpec; entityId: string; details: any; fieldMeta?: FieldMetadataMap }) {

  return (

    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>

      {tab.blocks.map((block, index) => {

        const width = block.width ?? (block.kind === 'table' ? 'full' : 'half');

        const containerStyle: React.CSSProperties = {

          flex: width === 'full' ? '1 1 100%' : '1 1 calc(50% - 12px)',

          minWidth: width === 'full' ? '100%' : '260px',

        };



        if (block.kind === 'card') {

          return (

            <div key={`${tab.id}-card-${index}`} style={containerStyle}>

              <DetailCard

                block={block}

                tab={tab}

                entityId={entityId}

                details={details}

                fieldMeta={fieldMeta}

              />

            </div>

          );

        }

        if (block.kind === 'table') {

          return (

            <div key={`${tab.id}-table-${index}`} style={containerStyle}>

              <DetailTable block={block} entityId={entityId} />

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



function useSelectOptions(

  fields: readonly string[],

  getMetaForField: (field: string) => FieldMetadata | undefined,

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



      if (meta.edit?.enumName) {

        const cached = ENUM_OPTION_CACHE.get(meta.edit.enumName);

        if (cached) {

          baseMap[field] = cached;

        } else {

          const list = enumsToFetch.get(meta.edit.enumName);

          if (list) list.push(field);

          else enumsToFetch.set(meta.edit.enumName, [field]);

        }

      }



      if (meta.lookup) {

        const key = buildLookupKey(meta.lookup);

        const cached = LOOKUP_OPTION_CACHE.get(key);

        if (cached) {

          baseMap[field] = cached;

        } else {

          const entry = lookupsToFetch.get(key);

          if (entry) entry.fields.push(field);

          else lookupsToFetch.set(key, { fields: [field], lookup: meta.lookup });

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

        const { data, error } = await (supabase as any).rpc('enum_values', { enum_type: enumName });

        if (!error && Array.isArray(data)) {

          const options = data.map((entry: any) => {

            const rawValue = entry.value ?? entry.name ?? entry;

            const rawLabel = entry.label ?? rawValue;

            const value = normalizeOptionValue(rawValue);

            const label = normalizeOptionValue(rawLabel);

            return { value, label };

          });

          ENUM_OPTION_CACHE.set(enumName, options);

          for (const field of enumFields) {

            updates[field] = options;

          }

        }

      }



      for (const [lookupKey, { fields: lookupFields, lookup }] of lookupsToFetch.entries()) {

        const query = lookup.schema

          ? (supabase as any).schema(lookup.schema).from(lookup.table)

          : (supabase as any).from(lookup.table);

        const { data, error } = await query

          .select(`${lookup.valueColumn}, ${lookup.labelColumn}`)

          .order(lookup.labelColumn, { ascending: true });

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



function DetailCard({ block, tab, entityId, details, fieldMeta }: { block: DetailCardBlock; tab: DetailTabSpec; entityId: string; details: any; fieldMeta?: FieldMetadataMap }) {

  const [editing, setEditing] = React.useState(false);

  const [values, setValues] = React.useState<Record<string, any>>(() => getInitialValues(block.fields, details));

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

    (field: string) => resolvedFieldMeta[field] ?? fieldMeta?.[field],

    [resolvedFieldMeta, fieldMeta],

  );



  const selectOptionsMap = useSelectOptions(block.fields, getMetaForField);



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

    const explicitTarget = block.editSource;

    if (explicitTarget) {

      await saveCardValues(explicitTarget, entityId, sanitized, tab.writeToExceptions);

      setEditing(false);

      return;

    }

    const grouped = groupFieldUpdates(block.fields, sanitized, resolvedFieldMeta, tab.writeToExceptions);

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



  const canEditAnyField = block.fields.some((field) => Boolean(getMetaForField(field)?.edit));



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

          const label = meta?.label ?? formatLabel(field);

          const value = values[field];

          const editableField = Boolean(meta?.edit);

          const selectOptions = selectOptionsMap[field] ?? getCachedOptionsForMeta(meta);

          return (

            <div key={field} style={{ fontSize: 14 }}>

              <div style={{ color: '#64748b', fontSize: 12 }}>{label}</div>

              {editing && editableField ? (

                renderEditor(field, value, (next) => handleFieldChange(field, next), meta, selectOptions)

              ) : (

                <div>{renderDisplayValue(value, meta, referenceLabels[field], selectOptions)}</div>

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



  if (hasOptions) {

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
        <div style={{ display: 'grid', gap: 4, maxHeight: 180, overflowY: 'auto', padding: 2, border: '1px solid #e2e8f0', borderRadius: 4 }}>
          {selectOptions.map((option) => {
            const checked = selectedSet.has(option.value);
            return (
              <label key={option.value} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => {
                    const next = new Set(selectedSet);
                    if (e.target.checked) next.add(option.value);
                    else next.delete(option.value);
                    onChange(Array.from(next));
                  }}
                />
                <span>{option.label}</span>
              </label>
            );
          })}
        </div>
      );

    }

    const normalized = current == null ? '' : normalizeOptionValue(current);
    const match = selectOptions!.find((opt) => opt.value === normalized || opt.label === normalized);
    const stringValue = match ? match.value : normalized;

    return (
      <select value={stringValue} onChange={(event) => onChange(event.target.value || null)}>
        <option value="">--</option>
        {selectOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
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
      const selectedSet = new Set(value);
      return (
        <div style={{ display: 'grid', gap: 4, maxHeight: 180, overflowY: 'auto', padding: 2, border: '1px solid #e2e8f0', borderRadius: 4 }}>
          {selectOptions!.map((option) => {
            const checked = selectedSet.has(option.value) || selectedSet.has(option.label);
            return (
              <label key={option.value} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => {
                    const next = new Set(Array.from(selectedSet));
                    if (e.target.checked) next.add(option.value);
                    else {
                      next.delete(option.value);
                      next.delete(option.label);
                    }
                    onChange(Array.from(next).filter((v) => v !== ''));
                  }}
                />
                <span>{option.label}</span>
              </label>
            );
          })}
        </div>
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

    return <div style={{ color: '#64748b', fontSize: 12 }}>Attachments are read-only.</div>;

  }



  if (isArray) {

    const value = Array.isArray(current) ? current.join(', ') : current ?? '';

    return (

      <input

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

      <input

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

    return <input type="date" value={value} onChange={(event) => onChange(event.target.value || null)} />;

  }



  if (multiline) {
    return (
      <textarea
        value={current ?? ''}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        style={{ width: '100%', minHeight: 80, resize: 'vertical' }}
      />
    );
  }



  return <input value={current ?? ''} onChange={(event) => onChange(event.target.value)} />;

}



function DetailTable({ block, entityId }: { block: DetailTableBlock; entityId: string }) {

  const [rows, setRows] = React.useState<any[]>([]);

  const [loading, setLoading] = React.useState<boolean>(false);

  const [refreshToken, setRefreshToken] = React.useState<number>(0);

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

      setLoading(true);

      const { schema, table, fkColumn } = block.source;

      const query = schema && schema !== 'public'

        ? (supabase as any).schema(schema).from(table)

        : (supabase as any).from(table);

      const { data, error } = await query.select('*').eq(fkColumn, entityId).limit(200);

      if (isMounted && !error) {

        setRows(data || []);

      }

      if (isMounted) setLoading(false);

    }

    fetchRows();

    return () => {

      isMounted = false;

    };

  }, [block.source.schema, block.source.table, block.source.fkColumn, entityId, refreshToken]);



  const columnMetaMap = React.useMemo(() => {

    const manualMeta = new Map<string, TableColumnMeta>();

    if (block.columnMeta) {

      for (const meta of block.columnMeta) {

        manualMeta.set(meta.field, meta);

      }

    }

    const resolved = new Map<string, TableColumnMeta>();

    for (const column of block.columns) {

      const merged = mergeTableColumnMeta({

        schema: block.source.schema,

        table: block.source.table,

        column,

        manual: manualMeta.get(column),

      });

      resolved.set(column, merged);

    }

    return resolved;

  }, [block.columnMeta, block.columns, block.source.schema, block.source.table]);



  return (

    <>
      <div style={{ border: '1px solid #e2e8f0', borderRadius: 6 }}>

      <div style={{ padding: 8, borderBottom: '1px solid #e2e8f0', fontWeight: 600 }}>{block.title ?? ''}</div>

      <div style={{ overflowX: 'auto' }}>

        <table style={{ width: '100%', fontSize: 14 }}>

          <thead>

            <tr>

              {block.columns.map((column) => {

                const meta = columnMetaMap.get(column);

                return (

                  <th key={column} style={{ textAlign: 'left', padding: 6, borderBottom: '1px solid #e2e8f0' }}>

                    {meta?.label ?? formatLabel(column)}

                  </th>

                );

              })}

              {block.rowActions && block.rowActions.length > 0 ? <th style={{ width: 60 }}></th> : null}

            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>

                <td colSpan={block.columns.length + (block.rowActions && block.rowActions.length > 0 ? 1 : 0)} style={{ padding: 6 }}>

                  Loadingï¿½

                </td>

              </tr>

            ) : rows.length === 0 ? (

              <tr>

                <td colSpan={block.columns.length + (block.rowActions && block.rowActions.length > 0 ? 1 : 0)} style={{ padding: 6, color: '#64748b' }}>

                  No records.

                </td>

              </tr>

            ) : (

              rows.map((row, index) => (

                <tr key={index}>

                  {block.columns.map((column) => {

                    const meta = columnMetaMap.get(column);

                    const selectOptions = getCachedOptionsForMeta(meta);

                    return (

                      <td key={column} style={{ padding: 6, borderBottom: '1px solid #f1f5f9' }}>

                        {renderDisplayValue(row[column], meta, undefined, selectOptions)}

                      </td>

                    );

                  })}

                  {block.rowActions && block.rowActions.length > 0 ? (

                    <td style={{ padding: 6 }}>

                      <Select
                        value=""
                        onValueChange={(value) => {
                          // Handle action selection
                          console.log('Action selected:', value);
                        }}
                        onOpenChange={(open) => {
                          // Reset value when closing
                          if (!open) {
                            // Value is already empty since we don't maintain state
                          }
                        }}
                      >
                        <SelectTrigger 
                          className="w-[85px] text-xs border-slate-300 hover:border-slate-400 focus:ring-1 focus:ring-slate-400"
                          style={{ height: '24px', minHeight: '24px', padding: '2px 8px', fontSize: '12px' }}
                          onMouseDown={(event) => event.stopPropagation()}
                          onMouseUp={(event) => event.stopPropagation()}
                          onClick={(event) => event.stopPropagation()}
                        >
                          <SelectValue placeholder="Actions" />
                        </SelectTrigger>
                        <SelectContent 
                          className="bg-white border border-slate-200 shadow-lg z-50"
                          style={{ 
                            backgroundColor: '#ffffff', 
                            border: '1px solid #e2e8f0', 
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', 
                            zIndex: 9999 
                          }}
                        >
                          {block.rowActions.map((action) => {
                            const value = typeof action === 'string' ? action : action.id;
                            const label = typeof action === 'string' ? formatLabel(action) : action.label;
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

      {block.tableActions && block.tableActions.length > 0 ? (

        <div style={{ padding: 8, borderTop: '1px solid #e2e8f0' }}>

          {block.tableActions.map((action, idx) => {
            const label = Array.isArray(block.tableActionLabels) && block.tableActionLabels[idx]
              ? block.tableActionLabels[idx]!
              : formatLabel(action);
            const value = typeof action === 'string' ? action : (action as any);
            const handleClick = async () => {
              const actionId = typeof action === 'string' ? action : String(action);
              const { schema, table, fkColumn } = block.source;
              const rel = schema && schema !== 'public' ? `${schema}.${table}` : table;
              if (actionId === 'addEmail' && table === 'email_addresses') {
                setNewEmail("");
                setNewEmailCategory("");
                setNewEmailPrimary(false);
                setNewEmailValid(true);
                setAddEmailError("");
                setShowAddEmail(true);
                return;
              }
              // Fallback generic create: insert bare row with FK when sensible
              try {
                const payload: any = { [fkColumn]: entityId };
                await (supabase as any).from(rel).insert(payload);
                setRefreshToken((t) => t + 1);
              } catch {}
            };
            return (
              <Button key={value} onClick={handleClick} variant="outline" size="sm" className="mr-2">{label}</Button>
            );
          })}

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
                  const { schema, table, fkColumn } = block.source;
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

  const lat = latField ? details?.[latField] : undefined;

  const lng = lngField ? details?.[lngField] : undefined;

  const label = labelField ? details?.[labelField] : undefined;



  return (

    <div style={{ border: '1px solid #e2e8f0', borderRadius: 6, padding: 10 }}>

      <div style={{ fontWeight: 600, marginBottom: 6 }}>{block.title ?? 'Location'}</div>

      <div style={{ fontSize: 14 }}>Latitude: {lat ?? '-'}</div>

      <div style={{ fontSize: 14 }}>Longitude: {lng ?? '-'}</div>

      {labelField ? <div style={{ fontSize: 14 }}>Address: {label ?? '-'}</div> : null}

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

    const resolved = selectOptions && selectOptions.length > 0

      ? value

          .map((entry) => optionLabelFor(entry) ?? normalizeOptionValue(entry))

          .filter((entry) => entry !== '')

      : value.map((entry) => normalizeOptionValue(entry));

    return resolved.length > 0 ? resolved.join(', ') : placeholder;

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

    const attachments = Array.isArray(value) ? value : [value];

    return (

      <div>

        {attachments.filter(Boolean).map((att: any, idx: number) => {

          if (typeof att === 'string') {

            return (

              <div key={idx}>

                <a href={att} target="_blank" rel="noreferrer">

                  {att}

                </a>

              </div>

            );

          }

          if (att && typeof att === 'object') {

            const url = att.url ?? att.href ?? att.link ?? att.download_url;

            const label = att.name ?? att.filename ?? url ?? 'attachment';

            if (url) {

              return (

                <div key={idx}>

                  <a href={String(url)} target="_blank" rel="noreferrer">

                    {label}

                  </a>

                </div>

              );

            }

            return <div key={idx}>{JSON.stringify(att)}</div>;

          }

          return null;

        })}

      </div>

    );

  }

  if (value instanceof Date) return value.toISOString();

  if (Array.isArray(value)) return value.length > 0 ? value.join(', ') : placeholder;

  if (typeof value === 'object') return JSON.stringify(value);



  // Get the field name to check for currency/percentage fields

  const fieldName = meta && 'field' in meta ? meta.field : '';



  // Format currency fields (amount, amount_issued, etc.)

  if (baseType === 'number' && (fieldName === 'amount' || fieldName === 'amount_issued' ||

      fieldName === 'total_grants_issued' || fieldName === 'total_loans_issued')) {

    const numValue = typeof value === 'number' ? value : parseFloat(value);

    if (!isNaN(numValue)) {

      return new Intl.NumberFormat('en-US', {

        style: 'currency',

        currency: 'USD',

        minimumFractionDigits: 0,

        maximumFractionDigits: 0

      }).format(numValue);

    }

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



function groupFieldUpdates(

  fields: string[],

  values: Record<string, any>,

  fieldMeta?: FieldMetadataMap,

  tabExceptions?: LookupException[],

): Array<{ writeTo: WriteTarget; payload: Record<string, any>; exceptions?: ExceptionMap[] }> {

  if (!fieldMeta) return [];

  const groups = new Map<string, { writeTo: WriteTarget; payload: Record<string, any>; exceptions: ExceptionMap[] }>();

  for (const field of fields) {

    const meta = fieldMeta[field];

    if (!meta?.edit) continue;

    const { schema, table, pk, column, exceptions } = meta.edit;

    const key = `${schema ?? 'public'}|${table}|${pk ?? 'id'}`;

    let entry = groups.get(key);

    if (!entry) {

      entry = { writeTo: { schema, table, pk }, payload: {}, exceptions: [] };

      groups.set(key, entry);

    }

    entry.payload[column ?? field] = values[field];

    if (column && column !== field) {

      entry.exceptions.push({ field, mapsToField: column });

    }

    if (exceptions) {

      entry.exceptions.push(...exceptions);

    }

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



