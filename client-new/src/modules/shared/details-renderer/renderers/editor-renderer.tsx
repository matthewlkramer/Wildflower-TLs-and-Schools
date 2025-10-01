import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { FieldMetadata, TableColumnMeta } from '../../detail-types';

/**
 * Renders an editor control based on field metadata
 * This is a placeholder that will be expanded with the full implementation
 * from details-renderer.tsx
 */
export function renderEditor(
  field: string,
  value: any,
  onChange: (value: any) => void,
  meta?: FieldMetadata | TableColumnMeta,
  selectOptions?: Array<{ value: string; label: string }>
): React.ReactNode {
  const type = (meta as any)?.type || 'string';
  const isArray = (meta as any)?.array || false;

  // Handle boolean fields
  if (type === 'boolean') {
    return (
      <input
        type="checkbox"
        checked={!!value}
        onChange={(e) => onChange(e.target.checked)}
        style={{ width: 20, height: 20, cursor: 'pointer' }}
      />
    );
  }

  // Handle select fields with options
  if (selectOptions && selectOptions.length > 0) {
    if (isArray) {
      // Multi-select
      const selectedValues = Array.isArray(value) ? value : [];
      return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {selectOptions.map((option) => (
            <label
              key={option.value}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '2px 6px',
                fontSize: 12,
                border: '1px solid #e2e8f0',
                borderRadius: 4,
                cursor: 'pointer',
                backgroundColor: selectedValues.includes(option.value) ? '#f0f9ff' : 'white'
              }}
            >
              <input
                type="checkbox"
                checked={selectedValues.includes(option.value)}
                onChange={(e) => {
                  if (e.target.checked) {
                    onChange([...selectedValues, option.value]);
                  } else {
                    onChange(selectedValues.filter((v: string) => v !== option.value));
                  }
                }}
                style={{ width: 14, height: 14 }}
              />
              {option.label}
            </label>
          ))}
        </div>
      );
    } else {
      // Single select
      return (
        <Select
          value={String(value ?? '')}
          onValueChange={onChange}
        >
          <SelectTrigger style={{ width: '100%', minWidth: 120 }}>
            <SelectValue placeholder="Select..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">None</SelectItem>
            {selectOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }
  }

  // Handle number fields
  if (type === 'number') {
    return (
      <Input
        type="number"
        value={value ?? ''}
        onChange={(e) => {
          const v = e.target.value;
          onChange(v === '' ? null : Number(v));
        }}
        style={{ width: '100%', minWidth: 80 }}
      />
    );
  }

  // Handle date fields
  if (type === 'date') {
    return (
      <Input
        type="date"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value || null)}
        style={{ width: '100%', minWidth: 140 }}
      />
    );
  }

  // Handle datetime fields
  if (type === 'datetime') {
    return (
      <Input
        type="datetime-local"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value || null)}
        style={{ width: '100%', minWidth: 180 }}
      />
    );
  }

  // Handle multiline text
  if ((meta as any)?.multiline) {
    return (
      <textarea
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value || null)}
        rows={3}
        style={{
          width: '100%',
          minWidth: 200,
          padding: 8,
          border: '1px solid #e2e8f0',
          borderRadius: 4,
          fontSize: 14,
          fontFamily: 'inherit',
          resize: 'vertical'
        }}
      />
    );
  }

  // Default: text input
  return (
    <Input
      type="text"
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value || null)}
      style={{ width: '100%', minWidth: 120 }}
    />
  );
}