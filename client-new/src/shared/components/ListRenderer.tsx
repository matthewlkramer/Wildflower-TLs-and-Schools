import React from 'react';
import { Button } from '@/shared/components/ui/button';
import type { RenderableTableData, RenderableRow, CellValue } from '../table-service';
import type { DetailListLayout } from '../detail-types';

export type ListRendererProps = {
  data: RenderableTableData;
  layout?: DetailListLayout;
  onRowAction?: (rowId: any, actionId: string) => Promise<void>;
  onTableAction?: (actionId: string) => Promise<void>;
  className?: string;
};

export const ListRenderer: React.FC<ListRendererProps> = ({
  data,
  layout,
  onRowAction,
  onTableAction,
  className = '',
}) => {
  const renderFieldValue = (
    cell: CellValue,
    row: RenderableRow,
    showLabel: boolean = false
  ): React.ReactNode => {
    if (!cell.display) return null;

    const content = (
      <>
        {/* Handle link to field (e.g., doc_type links to pdf field) */}
        {cell.linkToField && row.cells[cell.linkToField] ? (
          <a
            href={row.cells[cell.linkToField].raw}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {cell.display}
          </a>
        ) : cell.attachment && cell.raw ? (
          <a
            href={cell.raw}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            📎 {cell.display}
          </a>
        ) : (
          <span className={cell.multiline ? "whitespace-pre-wrap" : ""}>
            {cell.display}
          </span>
        )}
      </>
    );

    return showLabel ? (
      <div className="flex" style={{ gap: 6 }}>
        <span style={{ fontWeight: 500, color: '#64748b', fontSize: 12 }} className="min-w-0 flex-shrink-0">
          {getFieldLabel(cell, data)}:
        </span>
        <span className="min-w-0" style={{ fontSize: 12 }}>{content}</span>
      </div>
    ) : content;
  };

  const renderCard = (row: RenderableRow): React.ReactNode => {
    const {
      titleField,
      subtitleFields = [],
      bodyFields = [],
      badgeFields = [],
      footerFields = [],
      showFieldLabels = false,
      attachmentFields = [],
      bodyFieldFullWidth = false,
    } = layout || {};

    return (
      <div
        style={{
          background: '#fff',
          borderRadius: 8,
          boxShadow: '0 4px 16px rgba(15,23,42,0.06)',
          padding: 16,
          fontSize: 12
        }}
      >
        {/* Title */}
        {titleField && row.cells[titleField] && (
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12, color: '#0f172a' }}>
            {renderFieldValue(row.cells[titleField], row)}
          </div>
        )}

        {/* Subtitle and Badges Row */}
        {(subtitleFields.length > 0 || badgeFields.length > 0) && (
          <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
            <div className="flex flex-col" style={{ gap: 4 }}>
              {subtitleFields.map(field =>
                row.cells[field] && (
                  <div key={field} style={{ color: '#64748b', fontSize: 12 }}>
                    {renderFieldValue(row.cells[field], row, showFieldLabels)}
                  </div>
                )
              )}
            </div>
            {badgeFields.length > 0 && (
              <div className="flex" style={{ gap: 6 }}>
                {badgeFields.map(field =>
                  row.cells[field] && (
                    <span
                      key={field}
                      style={{
                        padding: '2px 8px',
                        background: '#f1f5f9',
                        color: '#475569',
                        borderRadius: 12,
                        fontSize: 11
                      }}
                    >
                      {renderFieldValue(row.cells[field], row)}
                    </span>
                  )
                )}
              </div>
            )}
          </div>
        )}

        {/* Body Fields */}
        {bodyFields.length > 0 && (
          <div className={`grid ${
            bodyFieldFullWidth ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'
          }`} style={{ gap: 8, marginBottom: 12 }}>
            {bodyFields.map(field =>
              row.cells[field] && (
                <div key={field} style={{ fontSize: 12 }}>
                  {renderFieldValue(row.cells[field], row, showFieldLabels)}
                </div>
              )
            )}
          </div>
        )}

        {/* Attachment Fields */}
        {attachmentFields.length > 0 && (
          <div className="flex flex-wrap" style={{ gap: 6, marginBottom: 12 }}>
            {attachmentFields.map(field =>
              row.cells[field] && (
                <div key={field}>
                  {renderFieldValue(row.cells[field], row)}
                </div>
              )
            )}
          </div>
        )}

        {/* Footer and Actions */}
        <div
          className="flex items-center justify-between"
          style={{
            paddingTop: 12,
            borderTop: '1px solid #e2e8f0',
            marginTop: 12
          }}
        >
          <div className="flex flex-wrap" style={{ gap: 12, fontSize: 11, color: '#64748b' }}>
            {footerFields.map(field =>
              row.cells[field] && (
                <span key={field}>
                  {renderFieldValue(row.cells[field], row, showFieldLabels)}
                </span>
              )
            )}
          </div>

          {/* Row Actions */}
          {data.spec.rowActions.length > 0 && (
            <div className="flex" style={{ gap: 4 }}>
              {data.spec.rowActions.map(actionId => (
                <Button
                  key={actionId}
                  size="sm"
                  variant="outline"
                  onClick={() => onRowAction?.(row.id, actionId)}
                  className="h-7 px-2 text-xs"
                >
                  {getRowActionIcon(actionId)}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
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
    <div className={`list-renderer ${className}`}>
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

      {/* List Cards */}
      <div className="space-y-4">
        {data.rows.length === 0 ? (
          <div className="text-center p-8 text-gray-500 bg-gray-50 rounded-lg">
            No records found
          </div>
        ) : (
          data.rows.map(row => (
            <div key={row.id}>
              {renderCard(row)}
            </div>
          ))
        )}
      </div>

      {/* Footer info */}
      {data.totalCount !== undefined && (
        <div className="mt-6 text-sm text-gray-500 text-center">
          Showing {data.rows.length} of {data.totalCount} records
        </div>
      )}
    </div>
  );
};

// Helper function to get field label
function getFieldLabel(cell: CellValue, data: RenderableTableData): string {
  // Find the column definition for this field
  const column = data.spec.columns.find(col => col.field in data.rows[0]?.cells);
  return column?.label || cell.display;
}

// Helper functions for row action icons

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