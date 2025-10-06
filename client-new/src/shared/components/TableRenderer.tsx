import React, { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { FieldEditor } from './FieldEditor';
import { RowActionsMenu } from './RowActionsMenu';
import type { RenderableTableData, RenderableRow, CellValue } from '../services/table-service';
import type { ResolvedTableColumn } from '../services/table-spec-resolver';
import { BADGE_PRESETS } from '../config/badge-presets';

export type TableRendererProps = {
  data: RenderableTableData;
  onEdit?: (rowId: any, field: string, value: any) => Promise<void>;
  onRowAction?: (rowId: any, actionId: string) => Promise<void>;
  onTableAction?: (actionId: string) => Promise<void>;
  className?: string;
};

export const TableRenderer: React.FC<TableRendererProps> = ({
  data,
  onEdit,
  onRowAction,
  onTableAction,
  className = '',
}) => {
  const [editingRow, setEditingRow] = useState<any>(null);
  const [editingValues, setEditingValues] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);

  const handleStartEdit = (row: RenderableRow) => {
    setEditingRow(row.id);
    setEditingValues(row.originalData);
  };

  const handleCancelEdit = () => {
    setEditingRow(null);
    setEditingValues({});
  };

  const handleSaveEdit = async () => {
    if (!editingRow || !onEdit) return;

    setSaving(true);
    try {
      // Save each changed field
      const originalRow = data.rows.find(r => r.id === editingRow);
      if (originalRow) {
        for (const [field, newValue] of Object.entries(editingValues)) {
          if (newValue !== originalRow.originalData[field]) {
            await onEdit(editingRow, field, newValue);
          }
        }
      }
      setEditingRow(null);
      setEditingValues({});
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setSaving(false);
    }
  };

  const renderCell = (row: RenderableRow, column: ResolvedTableColumn): React.ReactNode => {
    const cell = row.cells[column.field];
    const isEditing = editingRow === row.id;
    const currentValue = isEditing ? editingValues[column.field] : cell.raw;

    if (isEditing && cell.editable && onEdit) {
      return renderEditControl(column.field, currentValue, cell);
    }

    return renderDisplayValue(cell, row, column.field);
  };

  const renderEditControl = (field: string, value: any, cell: CellValue): React.ReactNode => {
    return (
      <FieldEditor
        value={value}
        fieldValue={cell}
        onChange={(newValue) => setEditingValues(prev => ({ ...prev, [field]: newValue }))}
      />
    );
  };

  const renderBadge = (fieldName: string, cell: CellValue): React.ReactNode | null => {
    const badgeConfig = BADGE_PRESETS[fieldName];
    if (!badgeConfig) return null;

    const value = cell.raw;

    // If value is false and no falseLabel, don't show badge
    if (!value && !badgeConfig.falseLabel) {
      return null;
    }

    const label = value ? badgeConfig.trueLabel : badgeConfig.falseLabel;
    if (!label) return null;

    // Determine badge color based on value
    const bgColor = value ? '#dcfce7' : '#fee2e2';
    const textColor = value ? '#166534' : '#991b1b';

    return (
      <span
        style={{
          display: 'inline-block',
          padding: '2px 8px',
          borderRadius: 4,
          fontSize: 11,
          fontWeight: 500,
          backgroundColor: bgColor,
          color: textColor,
        }}
      >
        {label}
      </span>
    );
  };

  const renderDisplayValue = (cell: CellValue, row: RenderableRow, fieldName?: string): React.ReactNode => {
    // Check if this field should be rendered as a badge
    if (fieldName && BADGE_PRESETS[fieldName]) {
      const badge = renderBadge(fieldName, cell);
      if (badge) return badge;
      // If badge returns null (e.g., false value with no falseLabel), fall through to regular display
      if (!BADGE_PRESETS[fieldName].falseLabel && !cell.raw) {
        return null;
      }
    }

    // Handle array fields with options as multiple badges
    if (cell.type === 'array' && Array.isArray(cell.raw) && cell.options && cell.options.length > 0) {
      const values = cell.raw;
      if (values.length === 0) return null;

      return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {values.map((value, index) => {
            const option = cell.options!.find(opt => opt.value === String(value));
            const label = option ? option.label : String(value);

            return (
              <span
                key={index}
                style={{
                  display: 'inline-block',
                  padding: '2px 8px',
                  borderRadius: 4,
                  fontSize: 11,
                  fontWeight: 500,
                  backgroundColor: '#e0f2fe',
                  color: '#075985',
                  whiteSpace: 'nowrap',
                }}
              >
                {label}
              </span>
            );
          })}
        </div>
      );
    }

    // Handle link to field (e.g., doc_type links to pdf field)
    if (cell.linkToField && row.cells[cell.linkToField]) {
      const linkUrl = row.cells[cell.linkToField].raw;
      if (linkUrl) {
        return (
          <a
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {cell.display}
          </a>
        );
      }
    }

    // Handle attachment display
    if (cell.attachment && cell.raw) {
      return (
        <a
          href={cell.raw}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          📎 {cell.display || 'Download'}
        </a>
      );
    }

    // Regular display
    return (
      <span className={cell.multiline ? "whitespace-pre-wrap" : ""}>
        {cell.display}
      </span>
    );
  };

  if (data.loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (data.error) {
    return (
      <div className="border border-red-200 bg-red-50 p-4 rounded">
        <div className="text-red-700">Error: {data.error}</div>
      </div>
    );
  }

  return (
    <div className={`table-renderer ${className}`}>
      {/* Table Actions */}
      {data.spec.tableActions && data.spec.tableActions.length > 0 && (
        <div className="mb-4 flex gap-2">
          {data.spec.tableActions.map(action => (
            <Button
              key={action.id}
              variant="outline"
              size="sm"
              onClick={() => onTableAction?.(action.id)}
            >
              {action.label}
            </Button>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              {data.spec.columns.map(column => (
                <th
                  key={column.field}
                  className="text-left p-3 font-medium text-gray-700"
                  style={{ width: column.width }}
                >
                  {column.label}
                </th>
              ))}
              {(data.spec.rowActions.length > 0 || onEdit) && (
                <th className="w-20"></th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.rows.length === 0 ? (
              <tr>
                <td
                  colSpan={data.spec.columns.length + (data.spec.rowActions.length > 0 ? 1 : 0)}
                  className="p-6 text-center text-gray-500"
                >
                  No records found
                </td>
              </tr>
            ) : (
              data.rows.map(row => (
                <tr key={row.id} className="border-b hover:bg-gray-50">
                  {data.spec.columns.map(column => (
                    <td
                      key={column.field}
                      className="p-3 align-top"
                      style={{
                        width: column.width,
                        maxWidth: column.width
                      }}
                    >
                      {renderCell(row, column)}
                    </td>
                  ))}
                  {(data.spec.rowActions.length > 0 || onEdit) && (
                    <td className="p-3 align-top">
                      <div className="flex gap-1">
                        {editingRow === row.id ? (
                          <>
                            <Button
                              size="sm"
                              onClick={handleSaveEdit}
                              disabled={saving}
                              className="h-7 px-2"
                            >
                              {saving ? '...' : '✓'}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCancelEdit}
                              disabled={saving}
                              className="h-7 px-2"
                            >
                              ✕
                            </Button>
                          </>
                        ) : (
                          <>
                            {onEdit && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStartEdit(row)}
                                className="h-7 px-2"
                              >
                                ✏️
                              </Button>
                            )}
                            {data.spec.rowActions.length > 0 && (
                              <RowActionsMenu
                                actions={[...data.spec.rowActions]}
                                onAction={(actionId) => onRowAction?.(row.id, actionId)}
                              />
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer info */}
      {data.totalCount !== undefined && (
        <div className="mt-4 text-sm text-gray-500">
          Showing {data.rows.length} of {data.totalCount} records
        </div>
      )}
    </div>
  );
};

// Helper functions for action icons

function getRowActionIcon(actionId: string): string {
  const icons: Record<string, string> = {
    inline_edit: '✏️',
    view_in_modal: '👁️',
    jump_to_modal: '🔗',
    toggle_complete: '✓',
    toggle_private_public: '🔒',
    toggle_valid: '✓',
    make_primary: '⭐',
    archive: '🗄️',
    end_stint: '⏹️',
    add_note: '📝',
    add_task: '✅',
    email: '✉️',
  };
  return icons[actionId] || '•';
}