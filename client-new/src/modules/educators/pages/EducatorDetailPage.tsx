import React, { useState } from 'react';
import { useEducatorDetails } from '../api/queries';
import { EDUCATOR_DETAIL_TABS } from '../constants';
import { saveCardValues } from '../helpers/write-helpers';
import { supabase } from '@/lib/supabase/client';

export function EducatorDetailPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const { data, isLoading } = useEducatorDetails(id);

  if (isLoading) return <div>Loading educator...</div>;
  if (!data) return <div>Not found</div>;

  const d = data as any;
  return <EducatorDetailsTabs educatorId={id} details={d} />;
}

function EducatorDetailsTabs({ educatorId, details }: { educatorId: string; details: any }) {
  const [active, setActive] = useState<string>(EDUCATOR_DETAIL_TABS[0]?.id ?? 'overview');
  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>{details.full_name ?? details.name ?? educatorId}</h1>
      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid #e2e8f0', marginBottom: 12 }}>
        {EDUCATOR_DETAIL_TABS.map((t) => (
          <button key={t.id} onClick={() => setActive(t.id)} style={{
            padding: '6px 10px', border: 'none', background: 'transparent', cursor: 'pointer',
            borderBottom: active === t.id ? '2px solid #2563eb' : '2px solid transparent', color: active === t.id ? '#1e40af' : '#475569'
          }}>{t.label}</button>
        ))}
      </div>
      {EDUCATOR_DETAIL_TABS.map((t) => active === t.id && (
        <TabContent key={t.id} tabIndex={t.id} educatorId={educatorId} details={details} />
      ))}
    </div>
  );
}

function TabContent({ tabIndex, educatorId, details }: { tabIndex: string; educatorId: string; details: any }) {
  const tab = EDUCATOR_DETAIL_TABS.find((t) => t.id === tabIndex)!;
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {tab.blocks.map((b, i) => b.kind === 'card'
        ? <DetailCard key={i} card={b as any} tabId={tab.id} educatorId={educatorId} details={details} />
        : <DetailTable key={i} table={b as any} educatorId={educatorId} />
      )}
    </div>
  );
}

function DetailCard({ card, tabId, educatorId, details }: { card: any; tabId: string; educatorId: string; details: any }) {
  const tab = EDUCATOR_DETAIL_TABS.find((t) => t.id === tabId)! as any;
  const [editing, setEditing] = useState(false);
  const [values, setValues] = useState<Record<string, any>>(() => {
    const v: Record<string, any> = {};
    for (const f of card.fields) v[f] = (details as any)[f];
    return v;
  });
  const onChange = (f: string, val: any) => setValues((prev) => ({ ...prev, [f]: val }));
  const target = card.editSource || tab.writeTo;
  async function onSave() {
    if (!target) { setEditing(false); return; }
    await saveCardValues(target, educatorId, values, tab.writeToExceptions);
    setEditing(false);
  }
  return (
    <div style={{ border: '1px solid #e2e8f0', borderRadius: 6, padding: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ fontWeight: 600 }}>{card.title}</div>
        {card.editable && (
          editing ? (
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={onSave}>Save</button>
              <button onClick={() => setEditing(false)}>Cancel</button>
            </div>
          ) : (
            <button onClick={() => setEditing(true)}>Edit</button>
          )
        )}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 8 }}>
        {card.fields.map((f: string) => (
          <div key={f} style={{ fontSize: 14 }}>
            <div style={{ color: '#64748b', fontSize: 12 }}>{f}</div>
            {editing ? (
              Array.isArray(values[f]) ? (
                <input value={(values[f] || []).join(', ')} onChange={(e) => onChange(f, e.target.value.split(',').map((s: string) => s.trim()))} />
              ) : typeof values[f] === 'boolean' ? (
                <input type="checkbox" checked={!!values[f]} onChange={(e) => onChange(f, e.target.checked)} />
              ) : (
                <input value={values[f] ?? ''} onChange={(e) => onChange(f, e.target.value)} />
              )
            ) : (
              <div>{renderValue(values[f])}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function renderValue(v: any) {
  if (v == null) return '-';
  if (Array.isArray(v)) return v.join(', ');
  if (typeof v === 'object') return JSON.stringify(v);
  return String(v);
}

function DetailTable({ table, educatorId }: { table: any; educatorId: string }) {
  const [rows, setRows] = React.useState<any[]>([]);
  React.useEffect(() => {
    (async () => {
      const { schema, table: tbl, fkColumn } = table.source;
      const qb = schema && schema !== 'public'
        ? (supabase as any).schema(schema).from(tbl)
        : (supabase as any).from(tbl);
      const { data, error } = await qb
        .select('*')
        .eq(fkColumn, educatorId)
        .limit(200);
      if (!error) setRows(data || []);
    })();
  }, [table.source.schema, table.source.table, table.source.fkColumn, educatorId]);

  return (
    <div style={{ border: '1px solid #e2e8f0', borderRadius: 6 }}>
      <div style={{ padding: 8, borderBottom: '1px solid #e2e8f0', fontWeight: 600 }}>{table.title || 'Items'}</div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', fontSize: 14 }}>
          <thead>
            <tr>
              {table.columns.map((c: string) => (<th key={c} style={{ textAlign: 'left', padding: 6, borderBottom: '1px solid #e2e8f0' }}>{c}</th>))}
              {table.rowActions && table.rowActions.length > 0 ? <th style={{ width: 60 }}></th> : null}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={idx}>
                {table.columns.map((c: string) => (
                  <td key={c} style={{ padding: 6, borderBottom: '1px solid #f1f5f9' }}>{renderValue(r[c])}</td>
                ))}
                {table.rowActions && table.rowActions.length > 0 ? (
                  <td style={{ padding: 6 }}>
                    <select defaultValue="" onChange={() => {}}>
                      <option value="" disabled>Actions</option>
                      {table.rowActions.map((a: string) => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {table.tableActions && table.tableActions.length > 0 && (
        <div style={{ padding: 8, borderTop: '1px solid #e2e8f0' }}>
          {table.tableActions.map((a: string) => (
            <button key={a} style={{ marginRight: 8 }}>{a}</button>
          ))}
        </div>
      )}
    </div>
  );
}
