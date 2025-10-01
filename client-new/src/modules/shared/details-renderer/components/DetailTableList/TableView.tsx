import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import type { TableViewProps } from './types';
import { labelFromField } from '../../utils';
import { renderDisplayValue } from '../../renderers/field-renderer';
import { renderEditor } from '../../renderers/editor-renderer';

export function TableView({
  rows,
  columns,
  columnMetaMap,
  loading,
  editingRow,
  editingValues,
  onEditRow,
  onSaveRow,
  onCancelEdit,
  onFieldChange,
  onRowAction,
  rowActions = []
}: TableViewProps) {
  const getFieldLabel = (field: string) => {
    const meta = columnMetaMap.get(field);
    return meta?.label ?? labelFromField(field);
  };

  const columnAllowsEdit = (meta?: any): boolean => {
    if (!meta) return true;
    const upd = meta.update as 'no' | 'yes' | 'newOnly' | undefined;
    if (upd === 'no' || upd === 'newOnly') return false;
    if (meta.edit === false) return false;
    return true;
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', fontSize: 14, borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {columns.map((column) => {
              const meta = columnMetaMap.get(column);
              const headerStyle: React.CSSProperties = {
                textAlign: 'left',
                padding: '8px 12px',
                borderBottom: '2px solid #e2e8f0',
                fontWeight: 600,
                color: '#475569',
                fontSize: 13
              };
              if (meta && (meta as any).width !== undefined) {
                headerStyle.width = (meta as any).width as any;
              }
              return (
                <th key={column} style={headerStyle}>
                  {getFieldLabel(column)}
                </th>
              );
            })}
            {rowActions.length > 0 && (
              <th style={{
                width: 100,
                padding: '8px 12px',
                borderBottom: '2px solid #e2e8f0',
                fontWeight: 600,
                color: '#475569',
                fontSize: 13
              }}>
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td
                colSpan={columns.length + (rowActions.length > 0 ? 1 : 0)}
                style={{
                  padding: '24px 12px',
                  textAlign: 'center',
                  color: '#64748b'
                }}
              >
                Loading...
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (rowActions.length > 0 ? 1 : 0)}
                style={{
                  padding: '24px 12px',
                  textAlign: 'center',
                  color: '#94a3b8'
                }}
              >
                No records found.
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <tr
                key={index}
                style={{
                  backgroundColor: editingRow === index ? '#f8fafc' : 'white',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (editingRow !== index) {
                    e.currentTarget.style.backgroundColor = '#fafbfc';
                  }
                }}
                onMouseLeave={(e) => {
                  if (editingRow !== index) {
                    e.currentTarget.style.backgroundColor = 'white';
                  }
                }}
              >
                {columns.map((column) => {
                  const meta = columnMetaMap.get(column);
                  const cellStyle: React.CSSProperties = {
                    padding: '8px 12px',
                    borderBottom: '1px solid #f1f5f9',
                    verticalAlign: 'top',
                    fontSize: 14
                  };

                  if (meta && (meta as any).width !== undefined) {
                    cellStyle.width = (meta as any).width as any;
                    cellStyle.maxWidth = (meta as any).width as any;
                  }

                  if ((meta as any)?.multiline || (meta as any)?.array) {
                    cellStyle.whiteSpace = 'normal';
                    cellStyle.wordBreak = 'break-word';
                  }

                  const isEditing = editingRow === index && columnAllowsEdit(meta);
                  const value = isEditing ?
                    (editingValues[column] ?? row[column]) :
                    row[column];

                  return (
                    <td key={column} style={cellStyle}>
                      {isEditing ? (
                        renderEditor(
                          column,
                          value,
                          (next) => onFieldChange(column, next),
                          meta
                        )
                      ) : (
                        renderDisplayValue(value, meta, row)
                      )}
                    </td>
                  );
                })}

                {rowActions.length > 0 && (
                  <td style={{
                    padding: '8px 12px',
                    borderBottom: '1px solid #f1f5f9',
                    verticalAlign: 'middle'
                  }}>
                    {editingRow === index ? (
                      <div style={{ display: 'flex', gap: 4 }}>
                        <Button
                          size="sm"
                          onClick={() => onSaveRow(index)}
                          style={{
                            height: 28,
                            fontSize: 12,
                            padding: '0 8px'
                          }}
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={onCancelEdit}
                          style={{
                            height: 28,
                            fontSize: 12,
                            padding: '0 8px'
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Select
                        value=""
                        onValueChange={(actionId) => {
                          if (actionId === 'edit') {
                            onEditRow(index);
                          } else if (onRowAction) {
                            onRowAction(actionId, row, index);
                          }
                        }}
                      >
                        <SelectTrigger
                          className="w-[92px] text-xs border-slate-300 hover:border-slate-400"
                          style={{
                            height: 28,
                            fontSize: 12
                          }}
                        >
                          <SelectValue placeholder="Actions" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="edit">Edit</SelectItem>
                          {rowActions.map((action: any) => (
                            <SelectItem key={action.id} value={action.id}>
                              {action.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}