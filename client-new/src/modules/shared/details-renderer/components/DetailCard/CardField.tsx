import React from 'react';
import type { CardFieldProps } from './types';
import { labelFromField } from '../../utils';
import { renderDisplayValue } from '../../renderers/field-renderer';
import { renderEditor } from '../../renderers/editor-renderer';

export function CardField({
  field,
  value,
  meta,
  editing,
  onChange,
  selectOptions,
  displayOverride
}: CardFieldProps) {
  const label = meta?.label ?? labelFromField(field);
  const displayValue = displayOverride ?? value;

  // Skip if configured to be hidden
  if (meta?.hidden) return null;

  // Skip empty values when not editing (unless explicitly configured to show)
  if (!editing && !meta?.showWhenEmpty) {
    const isEmpty = value === null || value === undefined ||
      (typeof value === 'string' && value.trim() === '') ||
      (Array.isArray(value) && value.length === 0);
    if (isEmpty) return null;
  }

  const fieldStyle: React.CSSProperties = {
    marginBottom: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 4
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 500,
    color: '#64748b',
    marginBottom: 4
  };

  const valueStyle: React.CSSProperties = {
    fontSize: 14,
    color: '#1e293b',
    lineHeight: 1.5
  };

  // Handle full-width fields
  if (meta?.fullWidth) {
    fieldStyle.gridColumn = '1 / -1';
  }

  return (
    <div style={fieldStyle}>
      <div style={labelStyle}>
        {label}
        {meta?.required && editing && <span style={{ color: '#ef4444' }}> *</span>}
      </div>
      <div style={valueStyle}>
        {editing && onChange ? (
          renderEditor(field, value, onChange, meta, selectOptions)
        ) : (
          <div style={{
            ...(meta?.multiline && { whiteSpace: 'pre-wrap' })
          }}>
            {renderDisplayValue(displayValue, meta, null, selectOptions)}
          </div>
        )}
      </div>
    </div>
  );
}