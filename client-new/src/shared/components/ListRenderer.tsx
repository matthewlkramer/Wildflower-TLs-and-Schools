import React from 'react';
import { Button } from '@/shared/components/ui/button';
import { RowActionsMenu } from './RowActionsMenu';
import type { RenderableListData, RenderableListRow, CardField } from '../services/card-service';
import type { DetailListLayout } from '../types/detail-types';
import { BADGE_PRESETS } from '../config/badge-presets';
import { TABLE_LIST_PRESETS } from '../config/table-list-presets';

export type ListRendererProps = {
  data: RenderableListData;
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
  const renderBadge = (fieldName: string, field: CardField): React.ReactNode | null => {
    const badgeConfig = BADGE_PRESETS[fieldName];
    if (!badgeConfig) return null;

    const value = field.value.raw;

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

  const renderFieldValue = (
    fieldName: string,
    field: CardField,
    row: RenderableListRow,
    showLabel: boolean = false,
    isBadgeField: boolean = false
  ): React.ReactNode => {
    // Check if this field should be rendered as a badge
    if (isBadgeField) {
      const badge = renderBadge(fieldName, field);
      if (!badge) return null;

      return showLabel ? (
        <div className="flex" style={{ gap: 6 }}>
          <span style={{ fontWeight: 500, color: '#64748b', fontSize: 12 }} className="min-w-0 flex-shrink-0">
            {field.label}:
          </span>
          <span className="min-w-0">{badge}</span>
        </div>
      ) : badge;
    }

    if (!field.value.display) return null;

    // Check if this field links to an attachment array (multiple files)
    const attachmentArrayField = field.linkToAttachmentArray;
    const attachmentUrls = attachmentArrayField && row.fields[attachmentArrayField]?.value.raw;

    const content = (
      <>
        {/* Handle links to attachment arrays (governance_docs, nine_nineties) */}
        {attachmentArrayField && Array.isArray(attachmentUrls) && attachmentUrls.length > 0 ? (
          <span className="flex flex-wrap" style={{ gap: 6 }}>
            {attachmentUrls.map((url: string, index: number) => (
              <a
                key={index}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {field.value.display} {attachmentUrls.length > 1 ? `(${index + 1})` : ''}
              </a>
            ))}
          </span>
        ) : field.value.type === 'attachment' && field.value.raw ? (
          <a
            href={field.value.raw}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            📎 {field.value.display}
          </a>
        ) : (
          <span className={field.value.multiline ? "whitespace-pre-wrap" : ""}>
            {field.value.display}
          </span>
        )}
      </>
    );

    return showLabel ? (
      <div className="flex" style={{ gap: 6 }}>
        <span style={{ fontWeight: 500, color: '#64748b', fontSize: 12 }} className="min-w-0 flex-shrink-0">
          {field.label}:
        </span>
        <span className="min-w-0" style={{ fontSize: 12 }}>{content}</span>
      </div>
    ) : content;
  };

  const renderCard = (row: RenderableListRow): React.ReactNode => {
    const {
      titleField,
      subtitleFields = [],
      bodyFields = [],
      badgeFields = [],
      footerFields = [],
      showFieldLabels = false,
      attachmentFields = [],
      bodyFieldFullWidth = false,
      hideLabelsForFields = [],
    } = layout || {};

    console.log('[ListRenderer] Rendering card, row.fields keys:', Object.keys(row.fields));
    console.log('[ListRenderer] Title field:', titleField, row.fields[titleField!]);

    return (
      <div
        style={{
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: 6,
          padding: 10,
          fontSize: 12,
          position: 'relative',
        }}
      >
        {/* Row Actions - positioned in upper right */}
        {data.rowActions && data.rowActions.length > 0 && (
          <div style={{ position: 'absolute', top: 6, right: 6 }}>
            <RowActionsMenu
              actions={[...data.rowActions]}
              onAction={(actionId) => onRowAction?.(row.id, actionId)}
            />
          </div>
        )}

        {/* Title and Badges Row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: subtitleFields.length > 0 ? 4 : (bodyFields.length > 0 ? 6 : 0) }}>
          {/* Title */}
          {titleField && row.fields[titleField] && (
            <div style={{ fontWeight: 600, fontSize: 13, color: '#0f172a', paddingRight: 32, flex: 1, minWidth: 0 }}>
              {renderFieldValue(titleField, row.fields[titleField], row)}
            </div>
          )}

          {/* Badge Fields (rendered as badges) - moved up to title row */}
          {badgeFields.length > 0 && (
            <div className="flex flex-wrap" style={{ gap: 4, flexShrink: 0 }}>
              {badgeFields.map(field => {
                const badge = row.fields[field] && renderFieldValue(field, row.fields[field], row, false, true);
                return badge ? <div key={field}>{badge}</div> : null;
              })}
            </div>
          )}
        </div>

        {/* Subtitle */}
        {subtitleFields.length > 0 && (
          <div className="flex flex-col" style={{ gap: 2, marginBottom: bodyFields.length > 0 ? 6 : 0 }}>
            {subtitleFields.map(field =>
              row.fields[field] && (
                <div key={field} style={{ color: '#64748b', fontSize: 11 }}>
                  {renderFieldValue(field, row.fields[field], row, true)}
                </div>
              )
            )}
          </div>
        )}

        {/* Body Fields */}
        {bodyFields.length > 0 && (
          <div className={`grid ${
            bodyFieldFullWidth ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'
          }`} style={{ gap: 6 }}>
            {bodyFields.map(field =>
              row.fields[field] && (
                <div key={field} style={{ fontSize: 11 }}>
                  {renderFieldValue(field, row.fields[field], row, !hideLabelsForFields.includes(field), false)}
                </div>
              )
            )}
          </div>
        )}

        {/* Attachment Fields */}
        {attachmentFields.length > 0 && (
          <div className="flex flex-wrap" style={{ gap: 6, marginBottom: 8 }}>
            {attachmentFields.map(field =>
              row.fields[field] && (
                <div key={field}>
                  {renderFieldValue(field, row.fields[field], row, true)}
                </div>
              )
            )}
          </div>
        )}

        {/* Footer */}
        {footerFields.length > 0 && (
          <div className="flex flex-wrap" style={{ gap: 12, fontSize: 11, color: '#64748b', marginTop: 8 }}>
            {footerFields.map(field =>
              row.fields[field] && (
                <span key={field}>
                  {renderFieldValue(field, row.fields[field], row, true)}
                </span>
              )
            )}
          </div>
        )}
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
        background: '#fff',
        borderRadius: 8,
        boxShadow: '0 4px 16px rgba(15,23,42,0.06)',
        overflow: 'hidden'
      }}
    >
      {/* Container Header with Title and Actions */}
      <div
        className="flex items-center justify-between"
        style={{
          padding: '10px 12px',
          borderBottom: '1px solid #e2e8f0'
        }}
      >
        <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: 0 }}>
          {TABLE_LIST_PRESETS[data.preset as keyof typeof TABLE_LIST_PRESETS]?.title || 'List'}
        </h3>
        {data.tableActions && data.tableActions.length > 0 && (
          <div className="flex" style={{ gap: 6 }}>
            {data.tableActions.map(action => (
              <Button
                key={action.id}
                variant="outline"
                size="sm"
                onClick={() => onTableAction?.(action.id)}
                style={{ fontSize: 11, height: 26, padding: '0 10px' }}
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* List Cards */}
      <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
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
        <div style={{ padding: '8px 12px', borderTop: '1px solid #e2e8f0', fontSize: 11, color: '#64748b', textAlign: 'center' }}>
          Showing {data.rows.length} of {data.totalCount} records
        </div>
      )}
    </div>
  );
};

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