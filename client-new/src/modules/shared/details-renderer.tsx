import React from 'react';
import { supabase } from '@/lib/supabase/client';
import {
  type DetailTabSpec,
  type DetailCardBlock,
  type DetailTableBlock,
  type DetailMapBlock,
  type LookupException,
  type FieldMetadataMap,
  type FieldMetadata,
  type TableColumnMeta,
} from './detail-types';
import { mergeTableColumnMeta, mergeFieldMetadata } from './schema-metadata';
import { saveCardValues, type ExceptionMap, type WriteTarget } from '../educators/helpers/write-helpers';

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

  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>{title}</h1>
      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid #e2e8f0', marginBottom: 12, overflowX: 'auto' }}>
        {safeTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            style={{
              padding: '6px 10px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              borderBottom: active === tab.id ? '2px solid #2563eb' : '2px solid transparent',
              color: active === tab.id ? '#1e40af' : '#475569',
              whiteSpace: 'nowrap',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
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

function DetailCard({ block, tab, entityId, details, fieldMeta }: { block: DetailCardBlock; tab: DetailTabSpec; entityId: string; details: any; fieldMeta?: FieldMetadataMap }) {
  const [editing, setEditing] = React.useState(false);
  const [values, setValues] = React.useState<Record<string, any>>(() => getInitialValues(block.fields, details));

  React.useEffect(() => {
    setValues(getInitialValues(block.fields, details));
  }, [block.fields, details]);

  const resolvedFieldMeta = React.useMemo<FieldMetadataMap>(() => {
    if (!fieldMeta) return {};
    const map: FieldMetadataMap = {};
    const fallbackSchema = block.editSource?.schema ?? tab.writeTo?.schema;
    const fallbackTable = block.editSource?.table ?? tab.writeTo?.table;
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
  }, [block.editSource?.schema, block.editSource?.table, block.fields, fieldMeta, tab.writeTo?.schema, tab.writeTo?.table]);

  const getMetaForField = React.useCallback(
    (field: string) => resolvedFieldMeta[field] ?? fieldMeta?.[field],
    [resolvedFieldMeta, fieldMeta],
  );

  const handleFieldChange = React.useCallback((field: string, next: any) => {
    setValues((prev) => ({ ...prev, [field]: next }));
  }, []);

  const [enumCache, setEnumCache] = React.useState<Record<string, string[]>>({});
  React.useEffect(() => {
    let cancelled = false;
    const needed = new Set<string>();
    for (const field of block.fields) {
      const meta = getMetaForField(field);
      const enumName = meta?.edit?.enumName;
      if (enumName && !enumCache[enumName]) {
        needed.add(enumName);
      }
    }
    if (needed.size === 0) return;
    async function load() {
      const updates: Record<string, string[]> = {};
      for (const enumName of needed) {
        const { data, error } = await (supabase as any).rpc('enum_values', { enum_type: enumName });
        if (!cancelled && !error && Array.isArray(data)) {
          updates[enumName] = data.map((entry: any) => entry.value ?? entry.name ?? entry);
        }
      }
      if (!cancelled && Object.keys(updates).length) {
        setEnumCache((prev) => ({ ...prev, ...updates }));
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [block.fields, getMetaForField, enumCache]);

  const enumOptionsForField = React.useCallback((field: string) => {
    const meta = getMetaForField(field);
    if (!meta) return undefined;
    if (meta.options) return meta.options;
    const enumName = meta.edit?.enumName;
    if (enumName) return enumCache[enumName];
    return undefined;
  }, [getMetaForField, enumCache]);

  const referenceLabels = useReferenceLabels(block.fields, values, resolvedFieldMeta);

  const handleSave = React.useCallback(async () => {
    const explicitTarget = block.editSource || tab.writeTo;
    if (explicitTarget) {
      await saveCardValues(explicitTarget, entityId, values, tab.writeToExceptions);
      setEditing(false);
      return;
    }
    const grouped = groupFieldUpdates(block.fields, values, resolvedFieldMeta, tab.writeToExceptions);
    if (grouped.length === 0) {
      setEditing(false);
      return;
    }
    for (const { writeTo, payload, exceptions } of grouped) {
      await saveCardValues(writeTo, entityId, payload, exceptions && exceptions.length ? exceptions : undefined);
    }
    setEditing(false);
  }, [block.editSource, block.fields, entityId, resolvedFieldMeta, tab.writeTo, tab.writeToExceptions, values]);

  const canEditAnyField = block.fields.some((field) => Boolean(getMetaForField(field)?.edit));

  return (
    <div style={{ border: '1px solid #e2e8f0', borderRadius: 6, padding: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ fontWeight: 600 }}>{block.title ?? ''}</div>
        {block.editable && canEditAnyField ? (
          editing ? (
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={handleSave}>Save</button>
              <button onClick={() => setEditing(false)}>Cancel</button>
            </div>
          ) : (
            <button onClick={() => setEditing(true)}>Edit</button>
          )
        ) : null}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8 }}>
        {block.fields.map((field) => {
          const meta = getMetaForField(field);
          const label = meta?.label ?? formatLabel(field);
          const value = values[field];
          const editableField = Boolean(meta?.edit);
          const enumOptions = enumOptionsForField(field);
          return (
            <div key={field} style={{ fontSize: 14 }}>
              <div style={{ color: '#64748b', fontSize: 12 }}>{label}</div>
              {editing && editableField ? (
                renderEditor(field, value, (next) => handleFieldChange(field, next), meta, enumOptions)
              ) : (
                <div>{renderDisplayValue(value, meta, referenceLabels[field])}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function renderEditor(
  field: string,
  current: any,
  onChange: (value: any) => void,
  meta?: FieldMetadata,
  enumOptions?: string[],
) {
  const baseType = meta?.type ?? 'string';
  const isArray = meta?.array === true;
  const multiline = meta?.multiline === true;

  if (baseType === 'boolean') {
    return <input type="checkbox" checked={!!current} onChange={(event) => onChange(event.target.checked)} />;
  }

  if (baseType === 'enum' && enumOptions && enumOptions.length > 0) {
    if (isArray) {
      const value = Array.isArray(current) ? current : current ? [current] : [];
      return (
        <select
          multiple
          value={value.map(String)}
          onChange={(event) => {
            const selected = Array.from(event.target.selectedOptions).map((opt) => opt.value);
            onChange(selected);
          }}
        >
          {enumOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }
    return (
      <select value={current ?? ''} onChange={(event) => onChange(event.target.value || null)}>
        <option value="">--</option>
        {enumOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }

  if (meta?.reference) {
    return <div style={{ color: '#64748b' }}>Reference fields are read-only.</div>;
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
          const parts = event.target.value.split(',').map((part) => part.trim()).filter(Boolean);
          onChange(parts);
        }}
      />
    );
  }

  if (baseType === 'number') {
    const value = current ?? '';
    return <input type="number" value={value} onChange={(event) => onChange(event.target.value === '' ? undefined : Number(event.target.value))} />;
  }

  if (baseType === 'date') {
    const value = current ? String(current).slice(0, 10) : '';
    return <input type="date" value={value} onChange={(event) => onChange(event.target.value || null)} />;
  }

  if (multiline) {
    return <textarea value={current ?? ''} onChange={(event) => onChange(event.target.value)} rows={3} />;
  }

  return <input value={current ?? ''} onChange={(event) => onChange(event.target.value)} />;
}

function DetailTable({ block, entityId }: { block: DetailTableBlock; entityId: string }) {
  const [rows, setRows] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

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
  }, [block.source.schema, block.source.table, block.source.fkColumn, entityId]);

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
                  {block.columns.map((column) => (
                    <td key={column} style={{ padding: 6, borderBottom: '1px solid #f1f5f9' }}>
                      {renderDisplayValue(row[column], columnMetaMap.get(column))}
                    </td>
                  ))}
                  {block.rowActions && block.rowActions.length > 0 ? (
                    <td style={{ padding: 6 }}>
                      <select defaultValue="" onChange={() => {}}>
                        <option value="" disabled>
                          Actions
                        </option>
                        {block.rowActions.map((action) => (
                          <option key={action} value={action}>
                            {formatLabel(action)}
                          </option>
                        ))}
                      </select>
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
          {block.tableActions.map((action) => (
            <button key={action} style={{ marginRight: 8 }}>{formatLabel(action)}</button>
          ))}
        </div>
      ) : null}
    </div>
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

function renderDisplayValue(value: any, meta?: FieldMetadata | TableColumnMeta, referenceLabels?: string[]) {
  const hasReference = Boolean(meta && 'reference' in meta && meta.reference);
  const isArray = Boolean(meta && 'array' in meta && meta.array);
  const baseType = meta?.type ?? 'string';
  if (value == null || value === '') return <span style={{ color: '#94a3b8' }}>-</span>;
  if (hasReference) {
    if (referenceLabels && referenceLabels.length > 0) return referenceLabels.join(', ');
    if (isArray && Array.isArray(value)) return value.join(', ');
  }

  if (isArray && Array.isArray(value)) {
    return value.length > 0 ? value.join(', ') : <span style={{ color: '#94a3b8' }}>-</span>;
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
  if (Array.isArray(value)) return value.length > 0 ? value.join(', ') : <span style={{ color: '#94a3b8' }}>-</span>;
  if (typeof value === 'object') return JSON.stringify(value);
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



