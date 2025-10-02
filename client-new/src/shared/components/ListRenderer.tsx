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
      <div className="flex gap-2">
        <span className="font-medium text-gray-600 min-w-0 flex-shrink-0">
          {getFieldLabel(cell, data)}:
        </span>
        <span className="min-w-0">{content}</span>
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
      <div className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
        {/* Title */}
        {titleField && row.cells[titleField] && (
          <div className="font-semibold text-lg mb-2">
            {renderFieldValue(row.cells[titleField], row)}
          </div>
        )}

        {/* Subtitle and Badges Row */}
        {(subtitleFields.length > 0 || badgeFields.length > 0) && (
          <div className="flex items-center justify-between mb-3">
            <div className="flex flex-col gap-1">
              {subtitleFields.map(field =>
                row.cells[field] && (
                  <div key={field} className="text-gray-600">
                    {renderFieldValue(row.cells[field], row, showFieldLabels)}
                  </div>
                )
              )}
            </div>
            {badgeFields.length > 0 && (
              <div className="flex gap-2">
                {badgeFields.map(field =>
                  row.cells[field] && (
                    <span
                      key={field}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
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
          <div className={`grid gap-2 mb-3 ${
            bodyFieldFullWidth ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'
          }`}>
            {bodyFields.map(field =>
              row.cells[field] && (
                <div key={field} className="text-sm">
                  {renderFieldValue(row.cells[field], row, showFieldLabels)}
                </div>
              )
            )}
          </div>
        )}

        {/* Attachment Fields */}
        {attachmentFields.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
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
        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex flex-wrap gap-3 text-xs text-gray-500">
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
            <div className="flex gap-1">
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