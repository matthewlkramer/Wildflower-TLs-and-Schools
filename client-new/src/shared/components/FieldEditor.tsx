import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Input } from '@/shared/components/ui/input';
import type { SelectOption } from '../services/card-service';

// Generic field metadata type that works with both FieldValue and CellValue
export type FieldMetadata = {
  type: 'string' | 'number' | 'boolean' | 'date' | 'enum' | 'attachment' | 'array';
  options?: SelectOption[];
  multiline?: boolean;
};

export type FieldEditorProps = {
  value: any;
  fieldValue: FieldMetadata;
  onChange: (value: any) => void;
  className?: string;
};

/**
 * Shared field editor component that renders the appropriate input control
 * based on the field type (select, checkbox, date, textarea, text, number)
 */
export const FieldEditor: React.FC<FieldEditorProps> = ({
  value,
  fieldValue,
  onChange,
  className = '',
}) => {
  const { type, options, multiline } = fieldValue;

  // Array/Multi-select dropdown
  if (Array.isArray(value) && options && options.length > 0) {
    return (
      <MultiSelectDropdown
        value={value}
        options={options}
        onChange={onChange}
        className={className}
      />
    );
  }

  // Single-select dropdown for enum/lookup fields
  if (options && options.length > 0) {
    return (
      <Select
        value={String(value || '__null__')}
        onValueChange={(v) => onChange(v === '__null__' ? null : v)}
      >
        <SelectTrigger className={`h-8 text-xs ${className}`}>
          <SelectValue placeholder="--" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__null__">--</SelectItem>
          {options.map(option => (
            <SelectItem key={option.value} value={option.value} className="text-xs">
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  // Boolean checkbox
  if (type === 'boolean') {
    return (
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
          className="rounded border-gray-300"
          style={{ width: 14, height: 14 }}
        />
      </div>
    );
  }

  // Date input
  if (type === 'date') {
    const dateValue = value ? new Date(value).toISOString().split('T')[0] : '';
    return (
      <Input
        type="date"
        value={dateValue}
        onChange={(e) => onChange(e.target.value)}
        className={`h-8 text-xs ${className}`}
      />
    );
  }

  // Multiline textarea
  if (multiline) {
    return (
      <textarea
        value={String(value || '')}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full min-h-[60px] p-2 border border-gray-300 rounded-md resize-y text-xs ${className}`}
        rows={3}
      />
    );
  }

  // Number input
  if (type === 'number') {
    return (
      <Input
        type="number"
        value={String(value || '')}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`h-8 text-xs ${className}`}
      />
    );
  }

  // Regular text input
  return (
    <Input
      type="text"
      value={String(value || '')}
      onChange={(e) => onChange(e.target.value)}
      className={`h-8 text-xs ${className}`}
    />
  );
};

/**
 * Multi-select dropdown component for array fields
 */
type MultiSelectDropdownProps = {
  value: string[];
  options: SelectOption[];
  onChange: (value: string[]) => void;
  className?: string;
};

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  value,
  options,
  onChange,
  className = '',
}) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement | null>(null);
  const buttonRef = React.useRef<HTMLButtonElement | null>(null);
  const [dropdownStyle, setDropdownStyle] = React.useState<React.CSSProperties>({});

  React.useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current) return;
      if (e.target instanceof Node && ref.current.contains(e.target)) return;
      setOpen(false);
    }
    if (open) document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  React.useEffect(() => {
    if (open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: 'fixed',
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
        fontSize: 11,
      });
    }
  }, [open]);

  const selectedSet = React.useMemo(() => new Set(value.filter(Boolean)), [value]);

  const summary = React.useMemo(() => {
    if (selectedSet.size === 0) return '--';
    const labels: string[] = [];
    for (const opt of options) {
      if (selectedSet.has(opt.value) || selectedSet.has(opt.label)) {
        labels.push(opt.label);
      }
    }
    const text = labels.join(', ');
    return text.length > 60 ? text.slice(0, 57) + '...' : text || String(selectedSet.size);
  }, [options, selectedSet]);

  const toggleOption = (optValue: string) => {
    const newSet = new Set(selectedSet);
    if (newSet.has(optValue)) {
      newSet.delete(optValue);
    } else {
      newSet.add(optValue);
    }
    onChange(Array.from(newSet));
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex h-8 w-full items-center justify-between rounded-md border border-slate-300 px-3 text-left text-xs focus:outline-none ${className}`}
        style={{ backgroundColor: '#fff', color: '#000' }}
      >
        <span className="truncate" style={{ color: '#000' }}>{summary}</span>
        <span className="ml-2 opacity-60">▼</span>
      </button>
      {open && (
        <div
          className="z-[1000] max-h-56 overflow-auto rounded-md shadow-lg border border-slate-200"
          style={{ ...dropdownStyle, backgroundColor: '#fff' }}
        >
          {options.map((opt) => {
            const checked = selectedSet.has(opt.value) || selectedSet.has(opt.label);
            return (
              <label
                key={opt.value}
                className="flex cursor-pointer items-center hover:bg-slate-100"
                style={{ gap: 4, padding: '1px 6px', lineHeight: '16px' }}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleOption(opt.value)}
                  style={{ width: 12, height: 12, margin: 0 }}
                />
                <span style={{ fontSize: 11, lineHeight: '16px' }}>{opt.label}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
};
