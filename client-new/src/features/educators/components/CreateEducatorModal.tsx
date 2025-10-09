import React from 'react';
import { supabase } from '@/core/supabase/client';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { ADD_NEW_EDUCATOR_INPUT } from '../views';

type Option = { value: string; label: string };

export function CreateEducatorModal({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated?: (id: string) => void }) {
  const [values, setValues] = React.useState<Record<string, any>>({});
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string>('');
  const [raceOptions, setRaceOptions] = React.useState<Option[]>([]);

  const set = (k: string, v: any) => setValues((prev) => ({ ...prev, [k]: v }));

  React.useEffect(() => {
    if (!open) return;
    setValues({});
  }, [open]);

  // Load race/ethnicity options
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await (supabase as any).schema('ref_tables').from('ref_race_and_ethnicity').select('value, english_label_short').order('english_label_short', { ascending: true });
      if (!cancelled && !error && Array.isArray(data)) {
        setRaceOptions(data.map((r: any) => ({ value: String(r.value), label: String(r.english_label_short || r.value) })));
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const submit = async () => {
    setLoading(true);
    setError('');
    try {
      // Insert base person record
      const newId = crypto.randomUUID();
      const base: Record<string, any> = { id: newId, indiv_type: 'Educator' };

      for (const item of (ADD_NEW_EDUCATOR_INPUT as readonly any[])) {
        const id = item.id as string;
        const direct = item.directWrite !== false;
        if (!direct) continue;
        if (values[id] !== undefined) base[id] = values[id];
      }

      const { error: insErr } = await (supabase as any).from('people').insert(base).select('id').single();
      if (insErr) throw insErr;

      // Post-insert rows (email addresses, etc.)
      for (const item of (ADD_NEW_EDUCATOR_INPUT as readonly any[])) {
        if (!item.postInsert) continue;
        const { table, columns } = item.postInsert as { table: string; columns: Record<string, string> };
        const row: Record<string, any> = {};
        for (const [col, src] of Object.entries(columns)) {
          row[col] = src === '$newId' ? newId : values[src];
        }
        if (Object.values(row).some(v => v !== undefined && v !== null && v !== '')) {
          const { error: piErr } = await (supabase as any).from(table).insert(row).select();
          if (piErr) throw piErr;
        }
      }

      onCreated?.(newId);
      onClose();
    } catch (e: any) {
      setError(e?.message || 'Failed to create educator');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60 }} onClick={onClose}>
      <div style={{ width: 600, maxWidth: '95vw', maxHeight: '90vh', overflow: 'auto', background: '#ffffff', borderRadius: 8, boxShadow: '0 16px 36px rgba(15,23,42,0.35)' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #e2e8f0', fontWeight: 600 }}>
          Create Educator
        </div>
        <div style={{ padding: 16, display: 'grid', gap: 12 }}>
          {(ADD_NEW_EDUCATOR_INPUT as readonly any[]).map((item: any) => {
            const id = item.id as string;
            const label = item.label || (id.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()));
            const required = item.required || false;

            if (id === 'race_ethnicity') {
              return (
                <div key={id}>
                  <div style={{ fontSize: 12, color: '#475569', marginBottom: 6 }}>Race/Ethnicity</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    {raceOptions.map((o) => (
                      <label key={o.value} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, border: '1px solid #cbd5e1', borderRadius: 6, padding: '2px 6px' }}>
                        <input
                          type="checkbox"
                          checked={Array.isArray(values[id]) && values[id].includes(o.value)}
                          onChange={(e) => {
                            const current = Array.isArray(values[id]) ? values[id] : [];
                            const updated = e.target.checked
                              ? [...current, o.value]
                              : current.filter((v: string) => v !== o.value);
                            set(id, updated);
                          }}
                        />
                        <span style={{ fontSize: 12 }}>{o.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            }

            if (item.multiline) {
              return (
                <label key={id} style={{ display: 'grid', gap: 6 }}>
                  <span style={{ fontSize: 12, color: '#475569' }}>{label}{required ? ' *' : ''}</span>
                  <textarea
                    className="wf-textarea"
                    value={values[id] || ''}
                    onChange={(e) => set(id, e.target.value)}
                    rows={4}
                    style={{ width: '100%', resize: 'vertical', border: '1px solid #cbd5e1', borderRadius: 6, padding: 8 }}
                  />
                </label>
              );
            }

            return (
              <label key={id} style={{ display: 'grid', gap: 6 }}>
                <span style={{ fontSize: 12, color: '#475569' }}>{label}{required ? ' *' : ''}</span>
                <Input
                  className="h-8 px-3"
                  value={values[id] || ''}
                  onChange={(e) => set(id, e.target.value)}
                />
              </label>
            );
          })}

          {error ? <div style={{ color: '#b91c1c', fontSize: 12 }}>{error}</div> : null}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: 12, borderTop: '1px solid #e2e8f0' }}>
          <Button variant="outline" size="sm" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button size="sm" onClick={submit} disabled={loading}>Create Educator</Button>
        </div>
      </div>
    </div>
  );
}
