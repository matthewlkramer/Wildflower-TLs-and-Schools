import React, { useState } from 'react';
import { ListCard } from './ListCard';
import type { ListViewProps } from './types';

export function ListView({
  rows,
  layout,
  columns,
  columnMetaMap,
  loading,
  onRowAction,
  rowActions
}: ListViewProps) {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const toggleRowExpansion = (index: number) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  if (loading) {
    return (
      <div style={{ padding: '24px 12px', textAlign: 'center' }}>
        <div style={{ color: '#64748b', fontSize: 14 }}>Loading...</div>
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div style={{ padding: '24px 12px', textAlign: 'center' }}>
        <div style={{ color: '#94a3b8', fontSize: 14 }}>No records found.</div>
      </div>
    );
  }

  // Check if we have expandable content
  const hasExpandableContent = layout?.bodyFields && layout.bodyFields.length > 0;

  return (
    <div style={{ padding: 12 }}>
      {/* Expand/Collapse All button if we have expandable content */}
      {hasExpandableContent && rows.length > 1 && (
        <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={() => {
              if (expandedRows.size === rows.length) {
                setExpandedRows(new Set());
              } else {
                setExpandedRows(new Set(rows.map((_, i) => i)));
              }
            }}
            style={{
              padding: '6px 12px',
              fontSize: 12,
              border: '1px solid #e2e8f0',
              borderRadius: 4,
              background: 'white',
              cursor: 'pointer',
              color: '#64748b'
            }}
          >
            {expandedRows.size === rows.length ? 'Collapse All' : 'Expand All'}
          </button>
        </div>
      )}

      {/* Render list cards */}
      {rows.map((row, index) => (
        <ListCard
          key={index}
          row={row}
          index={index}
          layout={layout}
          columns={columns}
          columnMetaMap={columnMetaMap}
          onAction={onRowAction}
          isExpanded={expandedRows.has(index)}
          onToggleExpand={hasExpandableContent ? () => toggleRowExpansion(index) : undefined}
        />
      ))}
    </div>
  );
}