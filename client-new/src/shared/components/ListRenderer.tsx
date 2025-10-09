import React from 'react';
import { Button } from '@/shared/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
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

    // If this is a boolean badge with a preset config
    if (badgeConfig) {
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
    }

    // For non-boolean badges, just render the display value
    if (!field.value.display) return null;

    return (
      <span
        style={{
          display: 'inline-block',
          padding: '2px 8px',
          borderRadius: 4,
          fontSize: 11,
          fontWeight: 500,
          backgroundColor: '#e0e7ff',
          color: '#3730a3',
        }}
      >
        {field.value.display}
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
    // Check if showLabel is explicitly set in field config, otherwise use the parameter
    const shouldShowLabel = field.showLabel !== undefined ? field.showLabel : showLabel;

    // Check if this field should be rendered as a badge
    if (isBadgeField) {
      const badge = renderBadge(fieldName, field);
      if (!badge) return null;

      return shouldShowLabel ? (
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
        ) : field.value.type === 'url' && field.value.raw ? (
          <a
            href={field.value.raw.startsWith('http') ? field.value.raw : `https://${field.value.raw}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {field.value.display}
          </a>
        ) : fieldName.toLowerCase().includes('email') && field.value.raw && typeof field.value.raw === 'string' && field.value.raw.includes('@') ? (
          <a
            href={`/email/compose?to=${encodeURIComponent(field.value.raw)}`}
            className="text-blue-600 hover:underline"
          >
            {field.value.display}
          </a>
        ) : (
          <span className={field.value.multiline ? "whitespace-pre-wrap" : ""}>
            {field.value.display}
          </span>
        )}
      </>
    );

    return shouldShowLabel ? (
      <div className="flex" style={{ gap: 6 }}>
        <span style={{ fontWeight: 500, color: '#64748b', fontSize: 12 }} className="min-w-0 flex-shrink-0">
          {field.label}:
        </span>
        <span className="min-w-0" style={{ fontSize: 12 }}>{content}</span>
      </div>
    ) : <span style={{ fontSize: 12 }}>{content}</span>;
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
      logoField,
      containerWidth = 'half',
    } = layout || {};

    const columnCount = containerWidth === 'full' ? 3 : 2;

    const logoUrl = logoField && row.fields[logoField]?.value.raw;
    const hasLogo = !!logoUrl;

    // Check if this is an association card
    // - People/School associations: has both full_name and school_name
    // - Guide assignments: has start_date, end_date, and is_active (from guide_assignments table)
    const isAssociationCard = !!(
      (row.fields['full_name'] && row.fields['school_name']) || // educators/schools associations
      (row.fields['start_date'] && row.fields['end_date'] && row.fields['is_active'] && row.fields['type']) // guide assignments
    );

    return (
      <div
        style={{
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: 6,
          padding: 10,
          fontSize: 12,
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: hasLogo ? '180px 1fr' : '1fr',
          gap: 12,
        }}
      >
        {/* Left Column: Logo and Title */}
        {hasLogo && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
            <img
              src={logoUrl}
              alt=""
              style={{
                width: '100%',
                height: 'auto',
                maxWidth: 160,
                maxHeight: 160,
                objectFit: 'contain',
                borderRadius: 8,
                border: '1px solid #e2e8f0',
              }}
              onError={(e) => {
                console.error('Logo failed to load:', logoUrl);
                e.currentTarget.style.display = 'none';
              }}
            />
            {titleField && row.fields[titleField] && (
              <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a', textAlign: 'center', wordBreak: 'break-word', width: '100%' }}>
                {renderFieldValue(titleField, row.fields[titleField], row)}
              </div>
            )}
          </div>
        )}

        {/* Right Column: All Other Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Row Actions - positioned in upper right */}
          {data.rowActions && data.rowActions.length > 0 && (
            <div style={{ position: 'absolute', top: 6, right: 6 }}>
              <RowActionsMenu
                actions={[...data.rowActions]}
                onAction={(actionId) => onRowAction?.(row.id, actionId)}
              />
            </div>
          )}

          {/* Title (when no logo) */}
          {!hasLogo && titleField && row.fields[titleField] && (
            <div style={{ marginBottom: badgeFields.length > 0 ? 4 : (subtitleFields.length > 0 ? 4 : (bodyFields.length > 0 ? 6 : 0)) }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: '#0f172a', paddingRight: 32 }}>
                {renderFieldValue(titleField, row.fields[titleField], row)}
              </div>
            </div>
          )}

        {/* Badge Fields Row (below title, above subtitle) */}
        {badgeFields.length > 0 && (
          <div className="flex flex-wrap" style={{ gap: 4, marginBottom: subtitleFields.length > 0 ? 4 : (bodyFields.length > 0 ? 6 : 0) }}>
            {badgeFields.map(field => {
              const badge = row.fields[field] && renderFieldValue(field, row.fields[field], row, false, true);
              return badge ? <React.Fragment key={field}>{badge}</React.Fragment> : null;
            })}
          </div>
        )}

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
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: bodyFieldFullWidth ? '1fr' : `repeat(${columnCount}, 1fr)`,
              gap: 12,
              alignItems: 'start'
            }}
          >
            {columnCount === 2 ? (
              isAssociationCard ? (
                <>
                  {/* Column 1: All general fields (2-column association layout) */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {bodyFields.filter(f => !['role', 'start_date', 'end_date', 'is_active', 'type'].includes(f)).map(field =>
                      row.fields[field] && (
                        <div key={field} style={{ fontSize: 11 }}>
                          {renderFieldValue(field, row.fields[field], row, !hideLabelsForFields.includes(field), false)}
                        </div>
                      )
                    )}
                  </div>

                  {/* Column 2: Association box (2-column layout) */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                    border: '1px solid #cbd5e1',
                    borderRadius: 6,
                    padding: 10,
                    backgroundColor: '#f8fafc'
                  }}>
                    {/* Association header for people/school associations */}
                    {(() => {
                      const personName = row.fields['full_name']?.value.display;
                      const schoolName = row.fields['school_name']?.value.display;

                      if (personName && schoolName) {
                        return (
                          <div style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: '#475569',
                            marginBottom: 4
                          }}>
                            {personName} @ {schoolName}
                          </div>
                        );
                      }
                      return null;
                    })()}

                    {/* Association fields */}
                    {['role', 'start_date', 'end_date', 'type'].map(field =>
                      bodyFields.includes(field) && row.fields[field] && (
                        <div key={field} style={{ fontSize: 11 }}>
                          {renderFieldValue(field, row.fields[field], row, !hideLabelsForFields.includes(field), false)}
                        </div>
                      )
                    )}

                    {/* is_active badge */}
                    {row.fields['is_active'] && (
                      <div style={{ fontSize: 11 }}>
                        {renderFieldValue('is_active', row.fields['is_active'], row, false, true)}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* Column 1: First half of fields (2-column non-association layout) */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {bodyFields.slice(0, Math.ceil(bodyFields.length / 2)).map(field =>
                      row.fields[field] && (
                        <div key={field} style={{ fontSize: 11 }}>
                          {renderFieldValue(field, row.fields[field], row, !hideLabelsForFields.includes(field), false)}
                        </div>
                      )
                    )}
                  </div>

                  {/* Column 2: Second half of fields (2-column non-association layout) */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {bodyFields.slice(Math.ceil(bodyFields.length / 2)).map(field =>
                      row.fields[field] && (
                        <div key={field} style={{ fontSize: 11 }}>
                          {renderFieldValue(field, row.fields[field], row, !hideLabelsForFields.includes(field), false)}
                        </div>
                      )
                    )}
                  </div>
                </>
              )
            ) : (
              <>
                {/* Column 1: General fields (3-column layout) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {bodyFields.filter(f => !['role', 'start_date', 'end_date', 'is_active', 'type'].includes(f)).slice(0, Math.ceil(bodyFields.filter(f => !['role', 'start_date', 'end_date', 'is_active', 'type'].includes(f)).length / 2)).map(field =>
                    row.fields[field] && (
                      <div key={field} style={{ fontSize: 11 }}>
                        {renderFieldValue(field, row.fields[field], row, !hideLabelsForFields.includes(field), false)}
                      </div>
                    )
                  )}
                </div>

                {/* Column 2: More general fields (3-column layout) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {bodyFields.filter(f => !['role', 'start_date', 'end_date', 'is_active', 'type'].includes(f)).slice(Math.ceil(bodyFields.filter(f => !['role', 'start_date', 'end_date', 'is_active', 'type'].includes(f)).length / 2)).map(field =>
                    row.fields[field] && (
                      <div key={field} style={{ fontSize: 11 }}>
                        {renderFieldValue(field, row.fields[field], row, !hideLabelsForFields.includes(field), false)}
                      </div>
                    )
                  )}
                </div>

                {/* Column 3: Association box (3-column layout) */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                  border: '1px solid #cbd5e1',
                  borderRadius: 6,
                  padding: 10,
                  backgroundColor: '#f8fafc'
                }}>
                  {/* Association header for people/school associations */}
                  {(() => {
                    const personName = row.fields['full_name']?.value.display;
                    const schoolName = row.fields['school_name']?.value.display;

                    if (personName && schoolName) {
                      return (
                        <div style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: '#475569',
                          marginBottom: 4
                        }}>
                          {personName} @ {schoolName}
                        </div>
                      );
                    }
                    return null;
                  })()}

                  {/* Association fields */}
                  {['role', 'start_date', 'end_date', 'type'].map(field =>
                    bodyFields.includes(field) && row.fields[field] && (
                      <div key={field} style={{ fontSize: 11 }}>
                        {renderFieldValue(field, row.fields[field], row, !hideLabelsForFields.includes(field), false)}
                      </div>
                    )
                  )}

                  {/* is_active badge */}
                  {row.fields['is_active'] && (
                    <div style={{ fontSize: 11 }}>
                      {renderFieldValue('is_active', row.fields['is_active'], row, false, true)}
                    </div>
                  )}
                </div>
              </>
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
          <Select value="" onValueChange={(value) => value && onTableAction?.(value)}>
            <SelectTrigger className="h-7 w-32 text-xs" style={{ fontWeight: 'normal', fontSize: 11 }}>
              <SelectValue placeholder="Actions" />
            </SelectTrigger>
            <SelectContent>
              {data.tableActions.map(action => (
                <SelectItem key={action.id} value={action.id} className="text-xs">
                  {action.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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