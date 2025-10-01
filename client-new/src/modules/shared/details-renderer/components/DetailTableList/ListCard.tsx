import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { ListCardProps } from './types';
import { labelFromField } from '../../utils';
import { renderDisplayValue } from '../../renderers/field-renderer';

export function ListCard({
  row,
  index,
  layout,
  columns,
  columnMetaMap,
  onAction,
  isExpanded = false,
  onToggleExpand,
}: ListCardProps) {
  const getFieldLabel = (field: string) => {
    const meta = columnMetaMap.get(field);
    return meta?.label ?? labelFromField(field);
  };

  const renderFieldValue = (field: string, value: any) => {
    const meta = columnMetaMap.get(field);
    return renderDisplayValue(value, meta);
  };

  const hasValue = (value: any): boolean => {
    if (value === null || value === undefined) return false;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'string') return value.trim() !== '';
    return true;
  };

  if (!layout) {
    // Fallback: simple card with all fields
    return (
      <div style={{
        border: '1px solid #e2e8f0',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        backgroundColor: 'white'
      }}>
        {columns.map((field) => {
          const value = row[field];
          if (!hasValue(value)) return null;

          return (
            <div key={field} style={{ marginBottom: 8 }}>
              <span style={{ fontWeight: 500, color: '#64748b', fontSize: 12 }}>
                {getFieldLabel(field)}:
              </span>{' '}
              <span style={{ fontSize: 14 }}>{renderFieldValue(field, value)}</span>
            </div>
          );
        })}
      </div>
    );
  }

  // Structured card based on layout
  const {
    titleField,
    subtitleFields = [],
    bodyFields = [],
    badgeFields = [],
    footerFields = [],
    showFieldLabels = false,
    bodyFieldFullWidth = false
  } = layout;

  return (
    <div style={{
      border: '1px solid #e2e8f0',
      borderRadius: 8,
      padding: 16,
      marginBottom: 12,
      backgroundColor: 'white',
      transition: 'box-shadow 0.2s',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = 'none';
    }}
    >
      {/* Header section */}
      <div style={{ marginBottom: 12 }}>
        {/* Title */}
        {titleField && hasValue(row[titleField]) && (
          <div style={{
            fontSize: 16,
            fontWeight: 600,
            marginBottom: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span>{renderFieldValue(titleField, row[titleField])}</span>
            {bodyFields.length > 0 && onToggleExpand && (
              <button
                onClick={onToggleExpand}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 4,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
            )}
          </div>
        )}

        {/* Subtitle */}
        {subtitleFields.length > 0 && (
          <div style={{ fontSize: 14, color: '#64748b' }}>
            {subtitleFields.map((field, i) => {
              const value = row[field];
              if (!hasValue(value)) return null;
              return (
                <span key={field}>
                  {i > 0 && ' • '}
                  {showFieldLabels && `${getFieldLabel(field)}: `}
                  {renderFieldValue(field, value)}
                </span>
              );
            })}
          </div>
        )}

        {/* Badges */}
        {badgeFields.length > 0 && (
          <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {badgeFields.map((field) => {
              const value = row[field];
              if (!hasValue(value)) return null;

              // Determine badge color based on field name or value
              let bgColor = '#f1f5f9';
              let textColor = '#475569';

              if (field.includes('status') || field.includes('active')) {
                if (String(value).toLowerCase().includes('active') || value === true) {
                  bgColor = '#dcfce7';
                  textColor = '#166534';
                } else if (String(value).toLowerCase().includes('inactive') || value === false) {
                  bgColor = '#fee2e2';
                  textColor = '#991b1b';
                }
              }

              if (field.includes('private') && value === true) {
                bgColor = '#fef3c7';
                textColor = '#92400e';
              }

              return (
                <span
                  key={field}
                  style={{
                    backgroundColor: bgColor,
                    color: textColor,
                    padding: '2px 8px',
                    borderRadius: 4,
                    fontSize: 12,
                    fontWeight: 500
                  }}
                >
                  {showFieldLabels && `${getFieldLabel(field)}: `}
                  {renderFieldValue(field, value)}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* Body section - collapsible */}
      {bodyFields.length > 0 && isExpanded && (
        <div style={{
          borderTop: '1px solid #f1f5f9',
          paddingTop: 12,
          marginBottom: footerFields.length > 0 ? 12 : 0
        }}>
          {bodyFieldFullWidth ? (
            // Full width body fields (like note content)
            bodyFields.map((field) => {
              const value = row[field];
              if (!hasValue(value)) return null;

              return (
                <div key={field} style={{ marginBottom: 8 }}>
                  {showFieldLabels && (
                    <div style={{ fontWeight: 500, color: '#64748b', fontSize: 12, marginBottom: 4 }}>
                      {getFieldLabel(field)}
                    </div>
                  )}
                  <div style={{ fontSize: 14, whiteSpace: 'pre-wrap' }}>
                    {renderFieldValue(field, value)}
                  </div>
                </div>
              );
            })
          ) : (
            // Grid layout for body fields
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 12
            }}>
              {bodyFields.map((field) => {
                const value = row[field];
                if (!hasValue(value)) return null;

                return (
                  <div key={field}>
                    {showFieldLabels && (
                      <span style={{ fontWeight: 500, color: '#64748b', fontSize: 12 }}>
                        {getFieldLabel(field)}:{' '}
                      </span>
                    )}
                    <span style={{ fontSize: 14 }}>
                      {renderFieldValue(field, value)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Footer section */}
      {footerFields.length > 0 && (
        <div style={{
          borderTop: '1px solid #f1f5f9',
          paddingTop: 8,
          fontSize: 12,
          color: '#94a3b8',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            {footerFields.map((field, i) => {
              const value = row[field];
              if (!hasValue(value)) return null;
              return (
                <span key={field}>
                  {i > 0 && ' • '}
                  {showFieldLabels && `${getFieldLabel(field)}: `}
                  {renderFieldValue(field, value)}
                </span>
              );
            })}
          </div>

          {/* Actions */}
          {onAction && (
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => onAction('view', row, index)}
                style={{
                  padding: '4px 8px',
                  fontSize: 11,
                  border: '1px solid #cbd5e1',
                  borderRadius: 4,
                  background: 'white',
                  cursor: 'pointer'
                }}
              >
                View
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}