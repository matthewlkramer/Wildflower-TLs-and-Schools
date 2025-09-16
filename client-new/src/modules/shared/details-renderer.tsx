import React from 'react';
import { supabase } from '@/lib/supabase/client';
import {
  type DetailTabSpec,
  type DetailCardBlock,
  type DetailTableBlock,
  type DetailMapBlock,
  type LookupException,
} from './detail-types';
import { saveCardValues, type ExceptionMap } from '../educators/helpers/write-helpers';

export type DetailsRendererProps = {
  entityId: string;
  details: any;
  tabs: DetailTabSpec[];
  resolveTitle: (details: any, entityId: string) => string;
  defaultTabId?: string;
};

export function DetailsRenderer({ entityId, details, tabs, resolveTitle, defaultTabId }: DetailsRendererProps) {
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
            <TabContent tab={tab} entityId={entityId} details={details} />
          ) : null}
        </React.Fragment>
      ))}
    </div>
  );
}

function TabContent({ tab, entityId, details }: { tab: DetailTabSpec; entityId: string; details: any }) {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {tab.blocks.map((block, index) => {
        if (block.kind === 'card') {
          return (
            <DetailCard
              key={`${tab.id}-card-${index}`}
              block={block}
              tab={tab}
              entityId={entityId}
              details={details}
            />
          );
        }
        if (block.kind === 'table') {
          return (
            <DetailTable
              key={`${tab.id}-table-${index}`}
              block={block}
              entityId={entityId}
            />
          );
        }
        if (block.kind === 'map') {
          return <DetailMap key={`${tab.id}-map-${index}`} block={block} details={details} />;
        }
        return null;
      })}
    </div>
  );
}

function DetailCard({ block, tab, entityId, details }: { block: DetailCardBlock; tab: DetailTabSpec; entityId: string; details: any }) {
  const [editing, setEditing] = React.useState(false);
  const [values, setValues] = React.useState<Record<string, any>>(() => getInitialValues(block.fields, details));

  React.useEffect(() => {
    setValues(getInitialValues(block.fields, details));
  }, [block.fields, details]);

  const onChange = (field: string, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const writeTarget = block.editSource || tab.writeTo;
  const exceptionList: ExceptionMap[] | undefined = mergeExceptions(tab.writeToExceptions, block.editSource?.exceptions);

  async function handleSave() {
    if (!writeTarget) {
      setEditing(false);
      return;
    }
    await saveCardValues(writeTarget, entityId, values, exceptionList);
    setEditing(false);
  }

  return (
    <div style={{ border: '1px solid #e2e8f0', borderRadius: 6, padding: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ fontWeight: 600 }}>{block.title}</div>
        {block.editable ? (
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
        {block.fields.map((field) => (
          <div key={field} style={{ fontSize: 14 }}>
            <div style={{ color: '#64748b', fontSize: 12 }}>{formatLabel(field)}</div>
            {editing ? renderEditor(field, values[field], (val) => onChange(field, val)) : (
              <div>{renderValue(values[field])}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function renderEditor(field: string, current: any, onChange: (next: any) => void) {
  if (Array.isArray(current)) {
    return (
      <input
        value={current.join(', ')}
        onChange={(event) => onChange(event.target.value.split(',').map((part) => part.trim()).filter(Boolean))}
      />
    );
  }
  if (typeof current === 'boolean') {
    return <input type="checkbox" checked={!!current} onChange={(event) => onChange(event.target.checked)} />;
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
      if (!isMounted) return;
      if (!error) {
        setRows(data || []);
      }
      setLoading(false);
    }
    fetchRows();
    return () => {
      isMounted = false;
    };
  }, [block.source.schema, block.source.table, block.source.fkColumn, entityId]);

  return (
    <div style={{ border: '1px solid #e2e8f0', borderRadius: 6 }}>
      <div style={{ padding: 8, borderBottom: '1px solid #e2e8f0', fontWeight: 600 }}>{block.title || 'Items'}</div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', fontSize: 14 }}>
          <thead>
            <tr>
              {block.columns.map((column) => (
                <th key={column} style={{ textAlign: 'left', padding: 6, borderBottom: '1px solid #e2e8f0' }}>
                  {formatLabel(column)}
                </th>
              ))}
              {block.rowActions && block.rowActions.length > 0 ? <th style={{ width: 60 }}></th> : null}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={block.columns.length + (block.rowActions && block.rowActions.length > 0 ? 1 : 0)} style={{ padding: 6 }}>
                  Loading…
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
                      {renderValue(row[column])}
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
      <div style={{ fontWeight: 600, marginBottom: 6 }}>{block.title || 'Location'}</div>
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

function renderValue(value: any): React.ReactNode {
  if (value == null || value === '') return <span style={{ color: '#94a3b8' }}>-</span>;
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.length > 0 ? value.join(', ') : <span style={{ color: '#94a3b8' }}>-</span>;
  if (typeof value === 'object') return JSON.stringify(value);
  if (value === true) return 'Yes';
  if (value === false) return 'No';
  return String(value);
}

function formatLabel(field: string): string {
  return field
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function mergeExceptions(tabLevel: LookupException[] | undefined, cardLevel: LookupException[] | undefined): ExceptionMap[] | undefined {
  const combined = [...(tabLevel ?? []), ...(cardLevel ?? [])];
  return combined.length > 0 ? (combined as ExceptionMap[]) : undefined;
}


