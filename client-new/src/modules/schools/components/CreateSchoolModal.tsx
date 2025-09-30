import React from 'react';
import { supabase } from '@/lib/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ADD_NEW_SCHOOL_INPUT } from '../views';
import { getColumnMetadata, getEnumName, findForeignKeyColumn } from '../../shared/schema-metadata';

type Option = { value: string; label: string };

function normalizeAbbrev(label: string): string {
  const words = label.split(' ').map((w) => {
    const lower = w.toLowerCase();
    if (lower === 'ssj') return 'SSJ';
    if (lower === 'tl') return 'TL';
    if (lower === 'tls') return 'TLs';
    if (lower === 'fy') return 'FY';
    return w;
  });
  return words.join(' ');
}

export function CreateSchoolModal({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated?: (id: string) => void }) {
  const [values, setValues] = React.useState<Record<string, any>>({});
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string>('');
  type PersonLite = { id: string; full_name: string; primary_email?: string };
  type NewTL = { full_name: string; personal_email: string; primary_phone?: string; home_address?: string; race_ethnicity: string[]; montessori_trained?: boolean };
  const [existingTLs, setExistingTLs] = React.useState<PersonLite[]>([]);
  const [newTLs, setNewTLs] = React.useState<NewTL[]>([]);
  const addNewTL = () => setNewTLs((prev) => [...prev, { full_name: '', personal_email: '', primary_phone: '', home_address: '', race_ethnicity: [], montessori_trained: false }]);
  const removeNewTL = (idx: number) => setNewTLs((prev) => prev.filter((_, i) => i !== idx));
  const updateNewTL = (idx: number, patch: Partial<NewTL>) => setNewTLs((prev) => prev.map((t, i) => (i === idx ? { ...t, ...patch } : t)));

  const set = (k: string, v: any) => setValues((prev) => ({ ...prev, [k]: v }));

  const [optionsMap, setOptionsMap] = React.useState<Record<string, Option[]>>({});

  React.useEffect(() => {
    if (!open) return;
    setValues((prev) => prev || {});
  }, [open]);

  const submit = async () => {
    setLoading(true); setError('');
    try {
      // Insert base school columns from spec
      const base: Record<string, any> = {};
      for (const item of (ADD_NEW_SCHOOL_INPUT as readonly any[])) {
        const id = item.id as string;
        const direct = item.directWrite !== false;
        const writeTable = item.writeTable as string | undefined;
        const writeTo = item.writeTo as any | undefined;
        if (!direct) continue;
        if (writeTable) continue;
        if (writeTo && writeTo.table && writeTo.table !== 'schools') continue;
        if (values[id] !== undefined) base[writeTo?.column ?? id] = values[id];
      }
      const { data: ins, error: insErr } = await (supabase as any).from('schools').insert(base).select('id').single();
      if (insErr) throw insErr;
      const newId = String(ins.id);

      // Upsert groups by writeTable
      const groups: Record<string, Record<string, any>> = {};
      for (const item of (ADD_NEW_SCHOOL_INPUT as readonly any[])) {
        const id = item.id as string;
        const direct = item.directWrite !== false;
        const table = item.writeTable as string | undefined;
        if (!direct || !table) continue;
        if (values[id] === undefined) continue;
        (groups[table] ||= {})[id] = values[id];
      }
      for (const [table, payload] of Object.entries(groups)) {
        const pk = findForeignKeyColumn({ schema: undefined, table, parentSchema: undefined, parentTable: 'schools', parentPk: 'id' }) || 'school_id';
        const up = { [pk]: newId, ...payload } as any;
        const { error: upErr } = await (supabase as any).from(table).upsert(up, { onConflict: pk }).select();
        if (upErr) throw upErr;
      }

      // Post-insert rows
      for (const item of (ADD_NEW_SCHOOL_INPUT as readonly any[])) {
        if (!item.postInsert) continue;
        const { table, columns } = item.postInsert as { table: string; columns: Record<string, string> };
        const row: Record<string, any> = {};
        for (const [col, src] of Object.entries(columns)) row[col] = src === '$newId' ? newId : values[src];
        const { error: piErr } = await (supabase as any).from(table).insert(row).select();
        if (piErr) throw piErr;
      }

      // TL associations
      if (existingTLs.length > 0) {
        const payload = existingTLs.map((p) => ({ people_id: p.id, school_id: newId, role: 'TL', is_active: true, start_date: new Date().toISOString() }));
        const { error: praErr } = await (supabase as any).from('people_roles_associations').insert(payload).select();
        if (praErr) throw praErr;
      }
      for (const tl of newTLs) {
        const { data: pRes, error: pErr } = await (supabase as any).from('people').insert({ id: crypto.randomUUID(), full_name: tl.full_name || null, primary_phone: tl.primary_phone || null, home_address: tl.home_address || null, race_ethnicity: (tl.race_ethnicity && tl.race_ethnicity.length) ? tl.race_ethnicity : null, indiv_type: 'Educator' }).select('id').single();
        if (pErr) throw pErr;
        const personId = pRes.id as string;
        if (tl.personal_email && tl.personal_email.includes('@')) {
          await (supabase as any).from('email_addresses').insert({ email_address: tl.personal_email, is_primary: true, is_valid: true, people_id: personId }).select();
        }
        if (tl.montessori_trained) {
          await (supabase as any).from('montessori_certs').insert({ people_id: personId }).select();
        }
        const { error: praErr2 } = await (supabase as any).from('people_roles_associations').insert({ people_id: personId, school_id: newId, role: 'TL', is_active: true, start_date: new Date().toISOString() }).select();
        if (praErr2) throw praErr2;
      }

      onCreated?.(newId);
      onClose();
    } catch (e: any) {
      setError(e?.message || 'Failed to create school');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  // Simple modal shell
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60 }} onClick={onClose}>
      <div style={{ width: 720, maxWidth: '95vw', maxHeight: '90vh', overflow: 'auto', background: '#ffffff', borderRadius: 8, boxShadow: '0 16px 36px rgba(15,23,42,0.35)' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #e2e8f0', fontWeight: 600 }}>Create School</div>
        <div style={{ padding: 16, display: 'grid', gap: 12 }}>
          {/* Spec-driven fields */}
          {(ADD_NEW_SCHOOL_INPUT as readonly any[]).map((item: any) => {
            const id = item.id as string;
            const visible = !item.visibleIf || (function evalVisibleIf(expr: any): boolean {
              if (!expr) return true;
              if (expr.anyOf) return expr.anyOf.some((e: any) => evalVisibleIf(e));
              if (expr.allOf) return expr.allOf.every((e: any) => evalVisibleIf(e));
              const { field, eq, in: arr, notEmpty } = expr;
              const val = values[field];
              if (notEmpty) return val !== undefined && val !== null && String(val).trim() !== '' && (!(Array.isArray(val)) || val.length > 0);
              if (arr) return arr.includes(val);
              if (eq !== undefined) return val === eq;
              return true;
            })(item.visibleIf);
            if (!visible) return null;
            const label = item.label || (id.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()));
            const type = item.type as string | undefined;
            const lookup = item.lookup as any | undefined;
            const enumName = (!type && !lookup && !item.writeTable) ? (getEnumName(undefined, 'schools', id) || undefined) : undefined;
            if (type === 'boolean') return <FieldCheckbox key={id} label={label} checked={!!values[id]} onChange={(v) => set(id, v)} />;
            if (type === 'select' && lookup) {
              if (!optionsMap[id]) (async () => {
                const rel = lookup.schema ? `${lookup.schema}.${lookup.table}` : lookup.table;
                const { data, error } = await (supabase as any).from(rel).select(`${lookup.valueColumn}, ${lookup.labelColumn}`).order(lookup.labelColumn, { ascending: true });
                if (!error && Array.isArray(data)) setOptionsMap((prev) => ({ ...prev, [id]: data.map((r: any) => ({ value: String(r[lookup.valueColumn]), label: String(r[lookup.labelColumn]) })) }));
              })();
              return <FieldSelect key={id} label={label} options={optionsMap[id] || []} value={values[id] || ''} onChange={(v) => set(id, v)} />;
            }
            if (enumName) {
              const cm = getColumnMetadata(undefined, 'schools', id) as any;
              const opts = optionsMap[id] || [];
              if (!optionsMap[id]) (async () => {
                const { data, error } = await (supabase as any).rpc('enum_values', { enum_type: enumName });
                if (!error && Array.isArray(data)) setOptionsMap((prev) => ({ ...prev, [id]: data.map((r: any) => ({ value: String(r.value ?? r), label: String(r.value ?? r) })) }));
              })();
              if (cm?.isArray) return <FieldMultiEnum key={id} label={label} options={opts} value={Array.isArray(values[id]) ? values[id] : []} onChange={(v) => set(id, v)} />;
              return <FieldSelect key={id} label={label} options={opts} value={values[id] || ''} onChange={(v) => set(id, v)} />;
            }
            if (item.multiline) return <FieldTextarea key={id} label={label} value={values[id] || ''} onChange={(v) => set(id, v)} />;
            if (id.toLowerCase().includes('date')) return <FieldDate key={id} label={label} value={values[id] || ''} onChange={(v) => set(id, v)} />;
            return <FieldText key={id} label={label} value={values[id] || ''} onChange={(v) => set(id, v)} />;
          })}

          {/* TL assignment */}
          <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid #e2e8f0' }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>Assign Teacher-Leaders (TLs)</div>
            <PeopleSearch onAdd={(p) => setExistingTLs((prev) => prev.some((x) => x.id === p.id) ? prev : [...prev, p])} />
            {existingTLs.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                {existingTLs.map((p) => (
                  <span key={p.id} style={{ fontSize: 12, border: '1px solid #cbd5e1', borderRadius: 12, padding: '2px 8px', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    {p.full_name} {p.primary_email ? `(${p.primary_email})` : ''}
                    <button onClick={() => setExistingTLs((prev) => prev.filter((x) => x.id !== p.id))} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}>×</button>
                  </span>
                ))}
              </div>
            ) : null}
            <div style={{ marginTop: 12 }}>
              <Button variant="secondary" onClick={() => { addNewTL(); }}>Add New TL</Button>
            </div>
            {newTLs.map((tl, idx) => (
              <div key={idx} style={{ marginTop: 12, padding: 12, border: '1px dashed #cbd5e1', borderRadius: 8 }}>
                <div style={{ display: 'grid', gap: 8 }}>
                  <FieldText label={`Full Name`} value={tl.full_name} onChange={(v) => updateNewTL(idx, { full_name: v })} />
                  <FieldText label={`Personal Email`} value={tl.personal_email} onChange={(v) => updateNewTL(idx, { personal_email: v })} />
                  <FieldText label={`Primary Phone`} value={tl.primary_phone || ''} onChange={(v) => updateNewTL(idx, { primary_phone: v })} />
                  <FieldTextarea label={`Home Address`} value={tl.home_address || ''} onChange={(v) => updateNewTL(idx, { home_address: v })} />
                  <RaceMultiSelect value={tl.race_ethnicity} onChange={(v) => updateNewTL(idx, { race_ethnicity: v })} />
                  <div>
                    <FieldCheckbox label="Montessori Trained" checked={!!tl.montessori_trained} onChange={(v) => updateNewTL(idx, { montessori_trained: v })} />
                  </div>
                </div>
                <div style={{ marginTop: 8 }}>
                  <Button variant="ghost" onClick={() => removeNewTL(idx)}>Remove</Button>
                </div>
              </div>
            ))}
          </div>

          

          {error ? <div style={{ color: '#b91c1c', fontSize: 12 }}>{error}</div> : null}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: 12, borderTop: '1px solid #e2e8f0' }}>
          <Button variant="outline" size="sm" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button size="sm" onClick={submit} disabled={loading}>Create School</Button>
        </div>
      </div>
    </div>
  );
}

function FieldText({ label, value, onChange, required = false, maxLength, placeholder }: { label: string; value: string; onChange: (v: string) => void; required?: boolean; maxLength?: number; placeholder?: string }) {
  return (
    <label style={{ display: 'grid', gap: 6 }}>
      <span style={{ fontSize: 12, color: '#475569' }}>{label}{required ? ' *' : ''}</span>
      <Input className="h-8 px-3" value={value} maxLength={maxLength} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function FieldTextarea({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label style={{ display: 'grid', gap: 6 }}>
      <span style={{ fontSize: 12, color: '#475569' }}>{label}</span>
      <textarea className="wf-textarea" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} rows={4} style={{ width: '100%', resize: 'vertical', border: '1px solid #cbd5e1', borderRadius: 6, padding: 8 }} />
    </label>
  );
}

function FieldDate({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label style={{ display: 'grid', gap: 6 }}>
      <span style={{ fontSize: 12, color: '#475569' }}>{label}</span>
      <Input type="date" className="h-8 px-3" value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function FieldCheckbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span style={{ fontSize: 12, color: '#475569' }}>{label}</span>
    </label>
  );
}

function FieldSelect({ label, options, value, onChange, placeholder }: { label: string; options: Option[]; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label style={{ display: 'grid', gap: 6 }}>
      <span style={{ fontSize: 12, color: '#475569' }}>{label}</span>
      <Select value={value} onValueChange={(v) => onChange(v)}>
        <SelectTrigger className="h-8 px-3"><SelectValue placeholder={placeholder || 'Select...'} /></SelectTrigger>
        <SelectContent>{options.map((o) => (<SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>))}</SelectContent>
      </Select>
    </label>
  );
}

function FieldEnum({ label, enumName, value, onChange, required }: { label: string; enumName: string; value: string; onChange: (v: string) => void; required?: boolean }) {
  const [options, setOptions] = React.useState<Option[]>([]);
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await (supabase as any).rpc('enum_values', { enum_type: enumName });
      if (!cancelled && !error && Array.isArray(data)) setOptions(data.map((r: any) => ({ value: String(r.value ?? r), label: String(r.value ?? r) })));
    })();
    return () => { cancelled = true; };
  }, [enumName]);
  return <FieldSelect label={required ? `${label} *` : label} options={options} value={value} onChange={onChange} />;
}

function FieldMultiEnum({ label, options, value, onChange }: { label: string; options: Option[]; value: string[]; onChange: (v: string[]) => void }) {
  // Simple multi-select as checkboxes for now
  const set = (val: string, checked: boolean) => {
    const s = new Set(value || []);
    if (checked) s.add(val); else s.delete(val);
    onChange(Array.from(s.values()));
  };
  return (
    <div>
      <div style={{ fontSize: 12, color: '#475569', marginBottom: 6 }}>{label}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {options.map((o) => (
          <label key={o.value} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, border: '1px solid #cbd5e1', borderRadius: 6, padding: '2px 6px' }}>
            <input type="checkbox" checked={value?.includes(o.value)} onChange={(e) => set(o.value, e.target.checked)} />
            <span style={{ fontSize: 12 }}>{o.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function PeopleSearch({ onAdd }: { onAdd: (p: { id: string; full_name: string; primary_email?: string }) => void }) {
  const [q, setQ] = React.useState('');
  const [results, setResults] = React.useState<{ id: string; full_name: string; primary_email?: string }[]>([]);
  React.useEffect(() => {
    let cancelled = false;
    if (!q || q.length < 2) { setResults([]); return; }
    (async () => {
      const { data, error } = await (supabase as any)
        .from('people')
        .select('id, full_name, email_addresses:email_addresses!left(email_address)')
        .ilike('full_name', `%${q}%`)
        .limit(20);
      if (!cancelled && !error && Array.isArray(data)) {
        const normalized = (data as any[]).map((r) => ({ id: r.id, full_name: r.full_name || r.id, primary_email: (r as any).email_addresses?.[0]?.email_address }));
        setResults(normalized);
      }
    })();
    return () => { cancelled = true; };
  }, [q]);
  return (
    <div>
      <FieldText label="Search existing TLs by name" value={q} onChange={setQ} />
      {results.length > 0 ? (
        <div style={{ border: '1px solid #e2e8f0', borderRadius: 6, marginTop: 6, maxHeight: 180, overflow: 'auto' }}>
          {results.map((r) => (
            <div key={r.id} style={{ padding: '6px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: 13 }}>
                {r.full_name} {r.primary_email ? <span style={{ color: '#64748b' }}>({r.primary_email})</span> : null}
              </div>
              <Button size="sm" variant="secondary" onClick={() => onAdd(r)}>Add</Button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function RaceMultiSelect({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [opts, setOpts] = React.useState<Option[]>([]);
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await (supabase as any).from('ref_race_and_ethnicity').select('value, english_label_short').order('english_label_short', { ascending: true });
      if (!cancelled && !error && Array.isArray(data)) setOpts(data.map((r: any) => ({ value: String(r.value), label: String(r.english_label_short || r.value) })));
    })();
    return () => { cancelled = true; };
  }, []);
  const set = (val: string, checked: boolean) => {
    const s = new Set(value || []);
    if (checked) s.add(val); else s.delete(val);
    onChange(Array.from(s.values()));
  };
  return (
    <div>
      <div style={{ fontSize: 12, color: '#475569', marginBottom: 6 }}>Race/Ethnicity</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {opts.map((o) => (
          <label key={o.value} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, border: '1px solid #cbd5e1', borderRadius: 6, padding: '2px 6px' }}>
            <input type="checkbox" checked={value?.includes(o.value)} onChange={(e) => set(o.value, e.target.checked)} />
            <span style={{ fontSize: 12 }}>{o.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
