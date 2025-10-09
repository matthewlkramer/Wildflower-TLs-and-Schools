import React from 'react';
import { supabase } from '@/core/supabase/client';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { getColumnMetadata, getEnumName, findForeignKeyColumn } from '@/generated/schema-metadata';

type Option = { value: string; label: string };

type CreateEntityModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated?: (id: string) => void;
  title: string;
  table: string;
  inputSpec: readonly any[];
};

export function CreateEntityModal({ open, onClose, onCreated, title, table, inputSpec }: CreateEntityModalProps) {
  const [values, setValues] = React.useState<Record<string, any>>({});
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string>('');
  const [optionsMap, setOptionsMap] = React.useState<Record<string, Option[]>>({});
  const [expandedSections, setExpandedSections] = React.useState<Record<string, boolean>>({});

  const set = (k: string, v: any) => setValues((prev) => ({ ...prev, [k]: v }));

  React.useEffect(() => {
    if (!open) return;
    setValues({});
    setExpandedSections({});
  }, [open]);

  // Resolve field references like $email.primary_email
  const resolveFieldReference = (ref: string, values: Record<string, any>): any => {
    if (!ref.startsWith('$')) return ref;

    const path = ref.slice(1); // Remove $
    const parts = path.split('.');

    if (parts.length === 1) {
      // Simple reference like $newId
      return ref; // Keep as-is for special handling in submit
    }

    // Nested reference like $email.primary_email
    const [parent, ...rest] = parts;
    const parentValue = values[parent];

    if (!parentValue || typeof parentValue !== 'object') return undefined;

    return rest.reduce((obj, key) => obj?.[key], parentValue);
  };

  const submit = async () => {
    setLoading(true);
    setError('');
    try {
      // Insert base record
      const base: Record<string, any> = {};
      const newId = crypto.randomUUID();

      // Handle ID field
      const hasIdColumn = inputSpec.some((item: any) => item.id === 'id');
      if (!hasIdColumn) {
        base.id = newId;
      }

      // Add indiv_type for people table
      if (table === 'people') {
        base.indiv_type = 'Educator';
      }

      for (const item of inputSpec) {
        const id = item.id as string;
        const direct = item.directWrite !== false;
        const writeTable = item.writeTable as string | undefined;
        const writeTo = item.writeTo as any | undefined;
        const hasNestedFields = item.fields && Array.isArray(item.fields);

        // Skip nested field groups - they're handled via postInsert
        if (hasNestedFields) continue;

        if (!direct) continue;
        if (writeTable) continue;
        if (writeTo && writeTo.table && writeTo.table !== table) continue;

        if (values[id] !== undefined) {
          base[writeTo?.column ?? id] = values[id];
        }
      }

      const { data: ins, error: insErr } = await (supabase as any)
        .from(table)
        .insert(base)
        .select('id')
        .single();

      if (insErr) throw insErr;
      const recordId = ins?.id || newId;

      // Upsert to related tables (writeTable)
      const groups: Record<string, Record<string, any>> = {};
      for (const item of inputSpec) {
        const id = item.id as string;
        const direct = item.directWrite !== false;
        const writeTable = item.writeTable as string | undefined;
        const hasNestedFields = item.fields && Array.isArray(item.fields);

        if (hasNestedFields) continue; // Skip nested - handled via postInsert

        if (!direct || !writeTable) continue;
        if (values[id] === undefined) continue;

        (groups[writeTable] ||= {})[id] = values[id];
      }

      for (const [targetTable, payload] of Object.entries(groups)) {
        const pk = findForeignKeyColumn({
          schema: undefined,
          table: targetTable,
          parentSchema: undefined,
          parentTable: table,
          parentPk: 'id'
        }) || `${table.replace(/s$/, '')}_id`;

        const up = { [pk]: recordId, ...payload } as any;
        const { error: upErr } = await (supabase as any).from(targetTable).upsert(up, { onConflict: pk }).select();
        if (upErr) throw upErr;
      }

      // Post-insert rows (including nested field groups)
      for (const item of inputSpec) {
        if (!item.postInsert) continue;

        const id = item.id as string;
        const groupValues = values[id];

        // Handle both single postInsert object and array of postInsert objects
        const postInserts = Array.isArray(item.postInsert) ? item.postInsert : [item.postInsert];

        for (const postInsertSpec of postInserts) {
          const { table: targetTable, columns } = postInsertSpec as { table: string; columns: Record<string, string> };
          const row: Record<string, any> = {};

          for (const [col, src] of Object.entries(columns)) {
            let value;

            if (src === '$newId') {
              value = recordId;
            } else if (src.startsWith('$') && src.includes('.')) {
              // Handle nested field references like $email.primary_email
              const parts = src.slice(1).split('.');
              const [groupId, fieldId] = parts;

              if (groupId === id && groupValues && typeof groupValues === 'object') {
                value = groupValues[fieldId];
              } else {
                value = resolveFieldReference(src, values);
              }
            } else if (src.startsWith('$')) {
              // Simple reference like $category
              const fieldId = src.slice(1);
              if (groupValues && typeof groupValues === 'object') {
                value = groupValues[fieldId];
              } else {
                value = values[fieldId];
              }
            } else {
              value = src; // Literal value
            }

            row[col] = value;
          }

          // Only insert if at least one non-ID, non-boolean value is provided
          const hasData = Object.entries(row).some(([k, v]) => {
            if (k.includes('_id')) return false;
            if (typeof v === 'boolean') return true; // Booleans are valid data
            return v !== undefined && v !== null && v !== '';
          });

          if (hasData) {
            const { error: piErr } = await (supabase as any).from(targetTable).insert(row).select();
            if (piErr) throw piErr;
          }
        }
      }

      onCreated?.(recordId);
      onClose();
    } catch (e: any) {
      setError(e?.message || `Failed to create ${title.toLowerCase()}`);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const renderFieldGroup = (item: any) => {
    const id = item.id as string;
    const label = item.label || formatLabel(id);
    const fields = item.fields as any[] || [];
    const isClickToOpen = item.visibility === 'clickToOpen';
    const isExpanded = expandedSections[id] || false;

    if (isClickToOpen) {
      return (
        <div key={id} style={{ border: '1px solid #e2e8f0', borderRadius: 6, padding: 12 }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }))}
            style={{ marginBottom: isExpanded ? 12 : 0 }}
          >
            {isExpanded ? '−' : '+'} {label}
          </Button>

          {isExpanded && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {fields.map((field: any) => renderField(field, id))}
            </div>
          )}
        </div>
      );
    }

    // Regular field group (always visible)
    return (
      <div key={id} style={{ border: '1px solid #e2e8f0', borderRadius: 6, padding: 12 }}>
        <div style={{ fontWeight: 600, marginBottom: 12, fontSize: 12, color: '#475569' }}>{label}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {fields.map((field: any) => renderField(field, id))}
        </div>
      </div>
    );
  };

  const renderField = (field: any, parentId?: string) => {
    const fieldId = field.id as string;
    const fullId = parentId ? `${parentId}.${fieldId}` : fieldId;
    const label = field.label || formatLabel(fieldId);
    const type = field.type as string | undefined;
    const lookupTable = field.lookupTable as string | undefined;
    const lookup = field.lookup as any | undefined;
    const enumName = field.enumName as string | undefined;
    const array = field.array as boolean | undefined;
    const isMulti = type === 'multi';
    const required = field.required as boolean | undefined;

    // Get/set value from nested object if parentId exists
    const getValue = () => {
      if (parentId) {
        const parentValue = values[parentId];
        return parentValue && typeof parentValue === 'object' ? parentValue[fieldId] : '';
      }
      return values[fieldId] || '';
    };

    const setValue = (v: any) => {
      if (parentId) {
        const parentValue = values[parentId] || {};
        set(parentId, { ...parentValue, [fieldId]: v });
      } else {
        set(fieldId, v);
      }
    };

    if (type === 'boolean') {
      return <FieldCheckbox key={fullId} label={label} checked={!!getValue()} onChange={setValue} />;
    }

    // Handle lookup with explicit valueColumn/labelColumn
    if (type === 'select' && lookup) {
      const optKey = `lookup_${lookup.table}_${fieldId}`;
      if (!optionsMap[optKey]) {
        loadLookupOptionsWithSpec(lookup, optKey, setOptionsMap);
      }
      return <FieldSelect key={fullId} label={label} placeholder={label} options={optionsMap[optKey] || []} value={getValue()} onChange={setValue} />;
    }

    // Handle lookupTable (shorthand)
    if (lookupTable) {
      const optKey = `${lookupTable}_${fieldId}`;
      if (!optionsMap[optKey]) {
        loadLookupOptionsFromTable(lookupTable, optKey, setOptionsMap, field.valueColumn, field.labelColumn);
      }

      if (array || isMulti) {
        return <div key={fullId} style={{ gridColumn: '1 / -1' }}><FieldMultiEnum label={label} options={optionsMap[optKey] || []} value={Array.isArray(getValue()) ? getValue() : []} onChange={setValue} /></div>;
      }

      // Use autocomplete for schools and people lookups
      if (lookupTable === 'schools' || lookupTable === 'people') {
        return <FieldAutocomplete key={fullId} label={label} placeholder={label} options={optionsMap[optKey] || []} value={getValue()} onChange={setValue} />;
      }

      return <FieldSelect key={fullId} label={label} placeholder={label} options={optionsMap[optKey] || []} value={getValue()} onChange={setValue} />;
    }

    // Handle enumName
    if (enumName) {
      const optKey = `enum_${enumName}`;
      if (!optionsMap[optKey]) {
        loadEnumOptions(enumName, optKey, setOptionsMap);
      }

      if (array || isMulti) {
        return <div key={fullId} style={{ gridColumn: '1 / -1' }}><FieldMultiEnum label={label} options={optionsMap[optKey] || []} value={Array.isArray(getValue()) ? getValue() : []} onChange={setValue} /></div>;
      }

      return <FieldSelect key={fullId} label={label} placeholder={label} options={optionsMap[optKey] || []} value={getValue()} onChange={setValue} />;
    }

    // Try to detect enum from schema for fields without explicit enumName
    if (!enumName && !lookupTable && !lookup) {
      // For nested fields, we can't auto-detect since we don't know the parent table
      // But we can try if parentId is not set
      const detectedEnum = !parentId ? getEnumName(undefined, table, fieldId) : null;
      if (detectedEnum) {
        const optKey = `enum_${detectedEnum}`;
        if (!optionsMap[optKey]) {
          loadEnumOptions(detectedEnum, optKey, setOptionsMap);
        }
        return <FieldSelect key={fullId} label={label} placeholder={label} options={optionsMap[optKey] || []} value={getValue()} onChange={setValue} />;
      }
    }

    if (field.multiline) {
      return <FieldTextarea key={fullId} label={label} value={getValue()} onChange={setValue} />;
    }

    if (type === 'date' || fieldId.toLowerCase().includes('date')) {
      const defaultValue = field.defaultValue === 'today' ? new Date().toISOString().split('T')[0] : '';
      return <FieldDate key={fullId} label={label} value={getValue() || defaultValue} onChange={setValue} />;
    }

    return <FieldText key={fullId} label={label} value={getValue()} onChange={setValue} required={required} />;
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15,23,42,0.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 60
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: 600,
          maxWidth: '95vw',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          background: '#ffffff',
          borderRadius: 8,
          boxShadow: '0 16px 36px rgba(15,23,42,0.35)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 16px',
          borderBottom: '1px solid #e2e8f0',
          fontWeight: 600
        }}>
          {title}
        </div>

        <div style={{ padding: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, overflowY: 'auto', flex: 1 }}>
          {inputSpec.map((item: any) => {
            const id = item.id as string;
            const visible = !item.visibleIf || evaluateVisibleIf(item.visibleIf, values);

            if (!visible) return null;

            // If item has nested fields, render as a group (spans full width)
            if (item.fields && Array.isArray(item.fields)) {
              return <div key={id} style={{ gridColumn: '1 / -1' }}>{renderFieldGroup(item)}</div>;
            }

            // Otherwise render as a single field
            return renderField(item);
          })}

          {error ? <div style={{ color: '#b91c1c', fontSize: 12, gridColumn: '1 / -1' }}>{error}</div> : null}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: 12, borderTop: '1px solid #e2e8f0' }}>
          <Button variant="outline" size="sm" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button size="sm" onClick={submit} disabled={loading}>
            {title}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Helper functions
function formatLabel(id: string): string {
  return id.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
}

function evaluateVisibleIf(expr: any, values: Record<string, any>): boolean {
  if (!expr) return true;
  if (expr.anyOf) return expr.anyOf.some((e: any) => evaluateVisibleIf(e, values));
  if (expr.allOf) return expr.allOf.every((e: any) => evaluateVisibleIf(e, values));

  const { field, eq, in: arr, notEmpty } = expr;
  const val = values[field];

  if (notEmpty) {
    return val !== undefined && val !== null && String(val).trim() !== '' &&
           (!Array.isArray(val) || val.length > 0);
  }
  if (arr) return arr.includes(val);
  if (eq !== undefined) return val === eq;

  return true;
}

async function loadLookupOptionsFromTable(
  lookupTable: string,
  optKey: string,
  setOptionsMap: React.Dispatch<React.SetStateAction<Record<string, Option[]>>>,
  customValueColumn?: string,
  customLabelColumn?: string
) {
  // Use custom columns if provided, otherwise determine by table name
  const labelColumn = customLabelColumn || (
    lookupTable === 'zref_states' ? 'name' :
    lookupTable.includes('people') || lookupTable.includes('school') ? 'long_name' :
    lookupTable.includes('guide') ? 'email_or_name' :
    'label'
  );
  const valueColumn = customValueColumn || (
    lookupTable === 'zref_states' ? 'abbreviation' :
    lookupTable.includes('people') || lookupTable.includes('school') ? 'id' :
    lookupTable.includes('guide') ? 'email_or_name' :
    'value'
  );

  let query = supabase
    .from(lookupTable)
    .select(`${valueColumn}, ${labelColumn}`)
    .order(labelColumn, { ascending: true });

  // Add filter for educator roles
  if (lookupTable === 'zref_roles') {
    query = query.eq('show_in_educator_grid', true);
  }

  const { data, error } = await query;

  if (error) {
    console.error(`Failed to load lookup ${lookupTable}:`, error);
    return;
  }

  if (Array.isArray(data)) {
    setOptionsMap((prev) => ({
      ...prev,
      [optKey]: data.map((r: any) => ({
        value: String(r[valueColumn]),
        label: String(r[labelColumn] || r[valueColumn])
      }))
    }));
  }
}

async function loadLookupOptionsWithSpec(
  lookup: { table: string; valueColumn: string; labelColumn: string; schema?: string },
  optKey: string,
  setOptionsMap: React.Dispatch<React.SetStateAction<Record<string, Option[]>>>
) {
  const { data, error } = await supabase
    .from(lookup.table)
    .select(`${lookup.valueColumn}, ${lookup.labelColumn}`)
    .order(lookup.labelColumn, { ascending: true });

  if (!error && Array.isArray(data)) {
    setOptionsMap((prev) => ({
      ...prev,
      [optKey]: data.map((r: any) => ({
        value: String(r[lookup.valueColumn]),
        label: String(r[lookup.labelColumn] || r[lookup.valueColumn])
      }))
    }));
  }
}

async function loadEnumOptions(enumName: string, optKey: string, setOptionsMap: React.Dispatch<React.SetStateAction<Record<string, Option[]>>>) {
  const { data, error } = await (supabase as any).rpc('enum_values', { enum_type: enumName });

  if (error) {
    console.error(`Failed to load enum ${enumName}:`, error);
    return;
  }

  if (Array.isArray(data)) {
    setOptionsMap((prev) => ({
      ...prev,
      [optKey]: data.map((r: any) => ({
        value: String(r.value ?? r),
        label: String(r.value ?? r)
      }))
    }));
  }
}

// Field components
function FieldText({ label, value, onChange, required = false }: { label: string; value: string; onChange: (v: string) => void; required?: boolean }) {
  const placeholder = required ? `${label} *` : label;
  return <Input className="h-8 px-3" placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />;
}

function FieldTextarea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <textarea
      className="wf-textarea"
      placeholder={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={4}
      style={{ width: '100%', resize: 'vertical', border: '1px solid #cbd5e1', borderRadius: 6, padding: 8, fontSize: 12 }}
    />
  );
}

function FieldDate({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return <Input type="date" className="h-8 px-3" placeholder={label} value={value} onChange={(e) => onChange(e.target.value)} />;
}

function FieldCheckbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span style={{ fontSize: 12, color: '#475569' }}>{label}</span>
    </label>
  );
}

function FieldSelect({ label, placeholder, options, value, onChange }: { label: string; placeholder?: string; options: Option[]; value: string; onChange: (v: string) => void }) {
  // Use native select temporarily to avoid z-index/portal issues in modal
  return (
    <select
      className="h-8 px-3 w-full rounded-md border border-slate-200 bg-white text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-slate-950"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">{placeholder || label || "Select..."}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

function FieldAutocomplete({ label, placeholder, options, value, onChange }: { label: string; placeholder?: string; options: Option[]; value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');

  const filtered = options.filter(o =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  const selectedLabel = options.find(o => o.value === value)?.label || '';

  return (
    <div className="relative">
      <Input
        className="h-8 px-3"
        placeholder={placeholder || label}
        value={open ? search : selectedLabel}
        onChange={(e) => {
          setSearch(e.target.value);
          if (!open) setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
      />
      {open && filtered.length > 0 && (
        <div
          className="absolute top-full left-0 right-0 mt-1 max-h-60 overflow-auto bg-white border border-slate-200 rounded-md shadow-md z-[9999]"
        >
          {filtered.slice(0, 100).map((o) => (
            <div
              key={o.value}
              className="px-3 py-1.5 text-xs cursor-pointer hover:bg-slate-100"
              onMouseDown={(e) => {
                e.preventDefault();
                onChange(o.value);
                setSearch('');
                setOpen(false);
              }}
            >
              {o.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FieldMultiEnum({ label, options, value, onChange }: { label: string; options: Option[]; value: string[]; onChange: (v: string[]) => void }) {
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
