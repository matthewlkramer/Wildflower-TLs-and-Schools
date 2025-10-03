import React from 'react';
import { Button } from '@/shared/components/ui/button';
import { RowActionsMenu } from './RowActionsMenu';
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
    fieldName: string,
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
          {getFieldLabel(fieldName, data)}:
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

    // Combine body fields and badge fields (badges should be shown with labels in body)
    const allBodyFields = [...bodyFields, ...badgeFields];

    return (
      <div
        style={{
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: 6,
          padding: 12,
          fontSize: 12
        }}
      >
        {/* Title */}
        {titleField && row.cells[titleField] && (
          <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8, color: '#0f172a' }}>
            {renderFieldValue(titleField, row.cells[titleField], row)}
          </div>
        )}

        {/* Subtitle */}
        {subtitleFields.length > 0 && (
          <div className="flex flex-col" style={{ gap: 4, marginBottom: allBodyFields.length > 0 ? 8 : 0 }}>
            {subtitleFields.map(field =>
              row.cells[field] && (
                <div key={field} style={{ color: '#64748b', fontSize: 12 }}>
                  {renderFieldValue(field, row.cells[field], row, true)}
                </div>
              )
            )}
          </div>
        )}

        {/* Body Fields (including former badge fields, all with labels) */}
        {allBodyFields.length > 0 && (
          <div className={`grid ${
            bodyFieldFullWidth ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'
          }`} style={{ gap: 8, marginBottom: 8 }}>
            {allBodyFields.map(field =>
              row.cells[field] && (
                <div key={field} style={{ fontSize: 12 }}>
                  {renderFieldValue(field, row.cells[field], row, true)}
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
                  {renderFieldValue(field, row.cells[field], row, true)}
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
                  {renderFieldValue(field, row.cells[field], row, true)}
                </span>
              )
            )}
          </div>

          {/* Row Actions */}
          {data.spec.rowActions.length > 0 && (
            <RowActionsMenu
              actions={data.spec.rowActions}
              onAction={(actionId) => onRowAction?.(row.id, actionId)}
            />
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
    <div
      className={className}
      style={{
        background: '#e0f2f1',
        borderRadius: 8,
        boxShadow: '0 4px 16px rgba(15,23,42,0.06)',
        overflow: 'hidden'
      }}
    >
      {/* Container Header with Title and Actions */}
      <div
        className="flex items-center justify-between"
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid #e2e8f0'
        }}
      >
        <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: 0 }}>
          {data.spec.title || 'List'}
        </h3>
        {data.spec.tableActions && data.spec.tableActions.length > 0 && (
          <div className="flex" style={{ gap: 6 }}>
            {data.spec.tableActions.map(action => (
              <Button
                key={action.id}
                variant="outline"
                size="sm"
                onClick={() => onTableAction?.(action.id)}
                className="h-7 px-2 text-xs"
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* List Cards */}
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {data.rows.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 32, color: '#64748b', fontSize: 12 }}>
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
        <div style={{ padding: '8px 16px', borderTop: '1px solid #e2e8f0', fontSize: 11, color: '#64748b', textAlign: 'center' }}>
          Showing {data.rows.length} of {data.totalCount} records
        </div>
      )}
    </div>
  );
};

// Helper function to get field label - finds the column label from the spec
function getFieldLabel(fieldName: string, data: RenderableTableData): string {
  const column = data.spec.columns.find(col => col.field === fieldName);
  return column?.label || fieldName;
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