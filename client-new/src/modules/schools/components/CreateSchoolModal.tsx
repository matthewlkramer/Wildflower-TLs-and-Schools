import React from 'react';
import { supabase } from '@/lib/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ADD_NEW_SCHOOL_INPUT } from '../constants';

type Option = { value: string; label: string };

export function CreateSchoolModal({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated?: (id: string) => void }) {
  const [values, setValues] = React.useState<Record<string, any>>({});
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string>('');

  const set = (k: string, v: any) => setValues((prev) => ({ ...prev, [k]: v }));

  const [enumAgeOptions, setEnumAgeOptions] = React.useState<Option[]>([]);
  const [charterOptions, setCharterOptions] = React.useState<Option[]>([]);
  const [cohortOptions, setCohortOptions] = React.useState<Option[]>([]);
  const [guideOptions, setGuideOptions] = React.useState<Option[]>([]);

  React.useEffect(() => {
    if (!open) return;
    let cancelled = false;
    async function load() {
      try {
        const [ages, charters, cohorts, guides] = await Promise.all([
          (supabase as any).rpc('enum_values', { enum_type: 'age_spans_rev' }),
          (supabase as any).from('charters').select('id, short_name').order('short_name', { ascending: true }),
          (supabase as any).from('cohorts').select('cohort_title').order('cohort_title', { ascending: true }),
          (supabase as any).from('guides').select('email_or_name').order('email_or_name', { ascending: true }),
        ]);
        if (cancelled) return;
        if (!ages.error && Array.isArray(ages.data)) setEnumAgeOptions(ages.data.map((r: any) => ({ value: String(r.value ?? r), label: String(r.value ?? r) })));
        if (!charters.error && Array.isArray(charters.data)) setCharterOptions(charters.data.map((r: any) => ({ value: String(r.id), label: String(r.short_name ?? r.id) })));
        if (!cohorts.error && Array.isArray(cohorts.data)) setCohortOptions(cohorts.data.map((r: any) => ({ value: String(r.cohort_title), label: String(r.cohort_title) })));
        if (!guides.error && Array.isArray(guides.data)) setGuideOptions(guides.data.map((r: any) => ({ value: String(r.email_or_name), label: String(r.email_or_name) })));
      } catch {}
    }
    // Default status to Emerging if unset
    setValues((prev) => (prev?.status ? prev : { ...prev, status: 'Emerging' }));
    load();
    return () => { cancelled = true; };
  }, [open]);

  const submit = async () => {
    setLoading(true); setError('');
    try {
      // Always enforce default status Emerging on the server; client sends selected values only.
      const { data, error } = await (supabase as any).functions.invoke('create-school', { body: { values } });
      if (error) throw error;
      const newId = data?.id as string | undefined;
      if (!newId) throw new Error('Missing id');
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
          {/* Core fields */}
          <FieldText label="Full Legal Name" required value={values.legal_name || ''} onChange={(v) => set('legal_name', v)} />
          <FieldText label="Name" required value={values.long_name || ''} onChange={(v) => set('long_name', v)} />
          <FieldText label="Short Name" required value={values.short_name || ''} onChange={(v) => set('short_name', v)} />
          <FieldEnum label="Status" enumName="school_statuses" required value={values.status || 'Emerging'} onChange={(v) => set('status', v)} />

          <FieldEnum label="Governance Model" required enumName="governance_models" value={values.governance_model || ''} onChange={(v) => set('governance_model', v)} />

          {(values.governance_model === 'Charter' || values.governance_model === 'Exploring Charter') ? (
            <FieldSelect label="Charter" options={charterOptions} value={values.charter_id || ''} onChange={(v) => set('charter_id', v)} />
          ) : null}

          <FieldMultiEnum label="Ages Served" options={enumAgeOptions} value={Array.isArray(values.ages_served) ? values.ages_served : []} onChange={(v) => set('ages_served', v)} />

          <FieldTextarea label="Program Focus" value={values.program_focus || ''} onChange={(v) => set('program_focus', v)} />

          <FieldDate label="Projected Open Date" value={values.proj_open_date || ''} onChange={(v) => set('proj_open_date', v)} />

          <FieldSelect label="Cohort" options={cohortOptions} value={values.cohort || ''} onChange={(v) => set('cohort', v)} placeholder="Select cohort (optional)" />

          <FieldTextarea label="School Address" value={values.school_address || ''} onChange={(v) => set('school_address', v)} placeholder="Street, City, State ZIP" />
          {values.school_address ? (
            <div style={{ display: 'flex', gap: 12 }}>
              <FieldCheckbox label="Current Mailing Address?" checked={!!values.current_mail_address} onChange={(v) => set('current_mail_address', v)} />
              <FieldCheckbox label="Current Physical Address?" checked={!!values.current_physical_address} onChange={(v) => set('current_physical_address', v)} />
            </div>
          ) : null}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 180px', gap: 12 }}>
            <FieldText label="Target City" value={values.ssj_target_city || ''} onChange={(v) => set('ssj_target_city', v)} />
            <FieldText label="Target State (2-letter)" value={values.ssj_target_state || ''} onChange={(v) => set('ssj_target_state', v)} maxLength={2} />
          </div>

          <FieldSelect label="Assigned Ops Guide" options={guideOptions} value={values.assigned_ops_guide || ''} onChange={(v) => set('assigned_ops_guide', v)} placeholder="Optional" />
          <FieldSelect label="Assigned Entrepreneur Guide" options={guideOptions} value={values.assigned_entrepreneur_guide || ''} onChange={(v) => set('assigned_entrepreneur_guide', v)} placeholder="Optional" />

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
