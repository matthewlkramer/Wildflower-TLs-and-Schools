import React from 'react';
import ReactDOM from 'react-dom';
import type { ColDef, ICellRendererParams } from 'ag-grid-community';
import { useQueryClient } from '@tanstack/react-query';

import { supabase } from '@/core/supabase/client';
import type { RowActionId } from '@/shared/types/detail-types';
import { useAuth } from '@/features/auth/auth-context';
import type { CreateNoteConfig, CreateTaskConfig } from '@/shared/types/detail-types';
import { formatFieldLabel } from '@/shared/utils/ui-utils';
import { RowActionsMenu } from '@/shared/components/RowActionsMenu';
import { useDialog } from '@/shared/components/ConfirmDialog';

type GridRowEntity = 'educator' | 'school' | 'charter';

type GridRowActionsCellParams = ICellRendererParams<any, any> & {
  entity: GridRowEntity;
};

// Local fallback for action labels to decouple from shared presets export
const ACTION_LABELS: Record<RowActionId, string> = {
  inline_edit: 'Edit inline',
  view_in_modal: 'View in modal',
  jump_to_modal: 'Jump to linked record',
  toggle_complete: 'Toggle complete',
  toggle_private_public: 'Toggle private/public',
  toggle_valid: 'Toggle valid',
  make_primary: 'Make primary',
  archive: 'Archive',
  end_stint: 'End stint',
  add_note: 'Add Note',
  add_task: 'Add Task',
  email: 'Email',
};

const GRID_ACTIONS: Record<GridRowEntity, RowActionId[]> = {
  educator: ['inline_edit', 'email', 'add_note', 'add_task', 'archive'],
  school: ['inline_edit', 'email', 'add_note', 'add_task', 'archive'],
  charter: ['add_note', 'add_task', 'archive'],
};

const CREATE_CONFIGS: Record<
  GridRowEntity,
  {
    add_note: CreateNoteConfig;
    add_task: CreateTaskConfig;
  }
> = {
  educator: {
    add_note: {
      createType: 'note',
      table: 'notes',
      titleField: 'title',
      textField: 'full_text',
      fkField: 'people_id',
      useEntityId: true,
      createdByField: 'created_by',
      createdAtField: 'created_date',
      privateField: 'is_private',
      defaults: { is_private: false },
    },
    add_task: {
      createType: 'task',
      table: 'action_steps',
      textField: 'item',
      fkField: 'people_id',
      useEntityId: true,
      assignedToField: 'assignee',
      assignedByField: 'assigned_by',
      dueDateField: 'due_date',
      createdAtField: 'assigned_date',
      statusField: 'item_status',
      incompleteValue: 'Incomplete',
      completeValue: 'Complete',
    },
  },
  school: {
    add_note: {
      createType: 'note',
      table: 'notes',
      titleField: 'title',
      textField: 'full_text',
      fkField: 'school_id',
      useEntityId: true,
      createdByField: 'created_by',
      createdAtField: 'created_date',
      privateField: 'is_private',
      defaults: { is_private: false },
    },
    add_task: {
      createType: 'task',
      table: 'action_steps',
      textField: 'item',
      fkField: 'school_id',
      useEntityId: true,
      assignedToField: 'assignee',
      assignedByField: 'assigned_by',
      dueDateField: 'due_date',
      createdAtField: 'assigned_date',
      statusField: 'item_status',
      incompleteValue: 'Incomplete',
      completeValue: 'Complete',
    },
  },
  charter: {
    add_note: {
      createType: 'note',
      table: 'notes',
      titleField: 'title',
      textField: 'full_text',
      fkField: 'charter_id',
      useEntityId: true,
      createdByField: 'created_by',
      createdAtField: 'created_date',
      privateField: 'is_private',
      defaults: { is_private: false },
    },
    add_task: {
      createType: 'task',
      table: 'action_steps',
      textField: 'item',
      fkField: 'charter_id',
      useEntityId: true,
      assignedToField: 'assignee',
      assignedByField: 'assigned_by',
      dueDateField: 'due_date',
      createdAtField: 'assigned_date',
      statusField: 'item_status',
      incompleteValue: 'Incomplete',
      completeValue: 'Complete',
    },
  },
};

const GRID_QUERY_KEYS: Record<GridRowEntity, readonly (string | number)[]> = {
  educator: ['view/grid_educator', 'all'],
  school: ['view/grid_school'],
  charter: ['view/grid_charter'],
};

// Grid views expose entity ids from these source tables;
// see client-new/src/types/database.types.ts for the archive columns.
const ARCHIVE_TABLES = {
  educator: 'people',
  school: 'schools',
  charter: 'charters',
} as const satisfies Record<GridRowEntity, string>;


type CreateActionState = {
  action: 'add_note' | 'add_task';
  entity: GridRowEntity;
  recordId: string;
  row: Record<string, any> | undefined;
};

export function GridRowActionsCell(params: GridRowActionsCellParams) {
  const { data, entity } = params;
  const queryClient = useQueryClient();
  const actions = GRID_ACTIONS[entity] ?? [];
  const [value, setValue] = React.useState('');
  const [modalState, setModalState] = React.useState<CreateActionState | null>(null);
  const [formValues, setFormValues] = React.useState<Record<string, any>>({});
  const [submitting, setSubmitting] = React.useState(false);
  const { user } = useAuth();
  const dialog = useDialog();

  React.useEffect(() => {
    if (!modalState) {
      setFormValues({});
      setSubmitting(false);
      return;
    }
    const config = CREATE_CONFIGS[modalState.entity][modalState.action];
    if (config.createType === 'note') {
      const noteConfig = config as CreateNoteConfig;
      setFormValues({
        ...(noteConfig.titleField ? { [noteConfig.titleField]: '' } : {}),
        [noteConfig.textField]: '',
        ...(noteConfig.privateField
          ? { [noteConfig.privateField]: Boolean(noteConfig.defaults?.[noteConfig.privateField]) }
          : {}),
      });
    } else {
      const taskConfig = config as CreateTaskConfig;
      setFormValues({
        [taskConfig.textField]: '',
        [taskConfig.assignedToField]: '',
        [taskConfig.dueDateField]: '',
      });
    }
    setSubmitting(false);
  }, [modalState]);

  const closeModal = React.useCallback(() => {
    if (submitting) return;
    setModalState(null);
  }, [submitting]);

  const handleModalSubmit = React.useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!modalState) return;
      const config = CREATE_CONFIGS[modalState.entity][modalState.action];
      const linkedId = (() => {
        if (config.useEntityId) return modalState.recordId;
        if (config.fkSourceField && modalState.row?.[config.fkSourceField] != null) return modalState.row[config.fkSourceField];
        if (modalState.row?.[config.fkField] != null) return modalState.row[config.fkField];
        return modalState.row?.id ?? modalState.recordId;
      })();
      if (linkedId == null || linkedId === '') {
        await dialog.alert('Unable to determine which record to link.', {
          title: 'Error',
          variant: 'error',
        });
        return;
      }
      const client = createTableClient(config.schema, config.table);
      try {
        setSubmitting(true);
        if (config.createType === 'note') {
          const noteConfig = config as CreateNoteConfig;
          const titleValue = noteConfig.titleField ? String(formValues[noteConfig.titleField] ?? '').trim() : '';
          const textValue = String(formValues[noteConfig.textField] ?? '').trim();
          if (noteConfig.titleField && !titleValue) {
            await dialog.alert('Please enter a note title.', {
              title: 'Required Field',
              variant: 'warning',
            });
            return;
          }
          if (!textValue) {
            await dialog.alert('Please enter note text.', {
              title: 'Required Field',
              variant: 'warning',
            });
            return;
          }
          const payload: Record<string, any> = {
            ...(noteConfig.titleField ? { [noteConfig.titleField]: titleValue } : {}),
            [noteConfig.textField]: textValue,
            [noteConfig.fkField]: linkedId,
            ...(noteConfig.defaults ?? {}),
          };
          if (noteConfig.createdByField) payload[noteConfig.createdByField] = user?.email ?? user?.id ?? null;
          if (noteConfig.createdAtField) payload[noteConfig.createdAtField] = nowIso();
          if (noteConfig.privateField) {
            const provided = Object.prototype.hasOwnProperty.call(formValues, noteConfig.privateField)
              ? Boolean(formValues[noteConfig.privateField])
              : Boolean(noteConfig.defaults?.[noteConfig.privateField]);
            payload[noteConfig.privateField] = provided;
          }
          const { error } = await client.insert(payload);
          if (error) throw error;
        } else {
          const taskConfig = config as CreateTaskConfig;
          const textValue = String(formValues[taskConfig.textField] ?? '').trim();
          if (!textValue) {
            await dialog.alert('Task text is required.', {
              title: 'Required Field',
              variant: 'warning',
            });
            return;
          }
          const assigneeValue = formValues[taskConfig.assignedToField];
          if (!assigneeValue) {
            await dialog.alert('Please select an assignee.', {
              title: 'Required Field',
              variant: 'warning',
            });
            return;
          }
          const dueDateRaw = formValues[taskConfig.dueDateField];
          const dueDateValue = dueDateRaw ? String(dueDateRaw) : '';
          if (!dueDateValue) {
            await dialog.alert('Please provide a due date.', {
              title: 'Required Field',
              variant: 'warning',
            });
            return;
          }
          const payload: Record<string, any> = {
            [taskConfig.textField]: textValue,
            [taskConfig.fkField]: linkedId,
            [taskConfig.assignedToField]: assigneeValue,
            [taskConfig.dueDateField]: dueDateValue,
            ...(taskConfig.defaults ?? {}),
          };
          if (taskConfig.assignedByField) payload[taskConfig.assignedByField] = user?.email ?? user?.id ?? null;
          if (taskConfig.createdAtField) payload[taskConfig.createdAtField] = nowIso();
          if (taskConfig.statusField) payload[taskConfig.statusField] = taskConfig.incompleteValue ?? null;
          const { error } = await client.insert(payload);
          if (error) throw error;
        }
        setModalState(null);
      } catch (error) {
        console.error('Failed to create record from grid action', error);
        await dialog.alert('Unable to complete the request.', {
          title: 'Error',
          variant: 'error',
        });
      } finally {
        setSubmitting(false);
      }
    },
    [formValues, modalState, user],
  );

  if (actions.length === 0) {
    return <span style={{ color: '#94a3b8' }}>-</span>;
  }

  const handleChange = async (selected: string) => {
    if (!selected) return;
    setValue(selected as RowActionId);

    try {
      switch (selected) {
        case 'inline_edit': {
          // For main grids, inline editing is disabled: open detail with intent
          navigateToDetail(entity, data?.id, { action: 'inline_edit' });
          break;
        }
        case 'view_in_modal': {
          navigateToDetail(entity, data?.id, { action: 'view_in_modal' });
          break;
        }
        case 'email': {
          const emails = await resolveEmailAddresses(data as any, entity);
          if (!emails || emails.length === 0) {
            await dialog.alert('No email address is available for this record.', {
              title: 'No Email',
              variant: 'warning',
            });
            break;
          }
          if (typeof window !== 'undefined') {
            const to = encodeURIComponent(emails.join(','));
            window.location.assign(`/email/compose?to=${to}`);
          }
          break;
        }
        case 'add_note': {
          if (!data?.id) {
            await dialog.alert('Unable to determine which record to open.', {
              title: 'Error',
              variant: 'error',
            });
            break;
          }
          setModalState({ action: 'add_note', entity, recordId: String(data.id), row: data ?? undefined });
          break;
        }
        case 'add_task': {
          if (!data?.id) {
            await dialog.alert('Unable to determine which record to open.', {
              title: 'Error',
              variant: 'error',
            });
            break;
          }
          setModalState({ action: 'add_task', entity, recordId: String(data.id), row: data ?? undefined });
          break;
        }
        case 'archive': {
          await archiveRecord(entity, data as Record<string, any> | undefined, dialog);
          await queryClient.invalidateQueries({ queryKey: GRID_QUERY_KEYS[entity] });
          break;
        }
        default: {
          await dialog.alert('This action is not implemented yet.', {
            title: 'Not Implemented',
            variant: 'warning',
          });
          break;
        }
      }
    } finally {
      setValue('');
    }
  };

  // Main grids: use RowActionsMenu component

  return (
    <>
      {dialog.DialogComponent}
      <RowActionsMenu
        actions={actions}
        onAction={handleChange}
      />
      {modalState ? (
        <CreateActionModal
          label={ACTION_LABELS[modalState.action]}
          config={CREATE_CONFIGS[modalState.entity][modalState.action]}
          values={formValues}
          submitting={submitting}
          onChange={(field, next) => setFormValues((prev) => ({ ...prev, [field]: next }))}
          onClose={closeModal}
          onSubmit={handleModalSubmit}
        />
      ) : null}
    </>
  );
}

function CreateActionModal({
  label,
  config,
  values,
  submitting,
  onChange,
  onClose,
  onSubmit,
}: {
  label: string;
  config: CreateNoteConfig | CreateTaskConfig;
  values: Record<string, any>;
  submitting: boolean;
  onChange: (field: string, value: any) => void;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  React.useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        if (!submitting) onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, submitting]);

  const isNote = config.createType === 'note';
  const [guideOptions, setGuideOptions] = React.useState<string[]>([]);
  React.useEffect(() => {
    if (isNote) return;
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await (supabase as any)
          .from('guides')
          .select('email_or_name, is_active')
          .eq('is_active', true)
          .order('email_or_name', { ascending: true });
        if (!cancelled && !error && Array.isArray(data)) {
          setGuideOptions((data as any[])
            .map((r) => String(r?.email_or_name ?? ''))
            .filter((s) => s.length > 0)
          );
        }
      } catch {}
    })();
    return () => { cancelled = true; };
  }, [isNote]);

  return (typeof document !== 'undefined' ? ReactDOM.createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 40,
      }}
      onClick={() => {
        if (!submitting) onClose();
      }}
    >
      <div
        style={{
          minWidth: 520,
          maxWidth: '90vw',
          background: '#ffffff',
          borderRadius: 8,
          boxShadow: '0 12px 32px rgba(15, 23, 42, 0.2)',
          overflow: 'hidden',
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 16px',
            borderBottom: '1px solid #e2e8f0',
            fontWeight: 600,
          }}
        >
          <span>{label}</span>
          <button type="button" onClick={onClose} disabled={submitting}>
            Close
          </button>
        </div>
        <form
          onSubmit={onSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16, fontSize: 14 }}
        >
          {isNote ? (
            <>
              {(() => {
                const noteConfig = config as CreateNoteConfig;
                if (!noteConfig.titleField) return null;
                return (
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span style={{ color: '#475569', fontSize: 12 }}>{formatFieldLabel(noteConfig.titleField)}</span>
                    <input
                      type="text"
                      value={values[noteConfig.titleField] ?? ''}
                      onChange={(event) => onChange(noteConfig.titleField, event.target.value)}
                      autoFocus
                    />
                  </label>
                );
              })()}
              {(() => {
                const noteConfig = config as CreateNoteConfig;
                return (
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span style={{ color: '#475569', fontSize: 12 }}>{formatFieldLabel(noteConfig.textField)}</span>
                    <textarea
                      rows={8}
                      value={values[noteConfig.textField] ?? ''}
                      onChange={(event) => onChange(noteConfig.textField, event.target.value)}
                      autoFocus={!noteConfig.titleField}
                      style={{ minHeight: 140 }}
                    />
                  </label>
                );
              })()}
              {(() => {
                const noteConfig = config as CreateNoteConfig;
                if (!noteConfig.privateField) return null;
                const field = noteConfig.privateField;
                return (
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input
                      type="checkbox"
                      checked={Boolean(values[field])}
                      onChange={(event) => onChange(field, event.target.checked)}
                    />
                    <span>{formatFieldLabel(field)}</span>
                  </label>
                );
              })()}
            </>
          ) : (
            (() => {
              const taskConfig = config as CreateTaskConfig;
              return (
                <>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span style={{ color: '#475569', fontSize: 12 }}>{formatFieldLabel(taskConfig.textField)}</span>
                    <textarea
                      rows={8}
                      value={values[taskConfig.textField] ?? ''}
                      onChange={(event) => onChange(taskConfig.textField, event.target.value)}
                      autoFocus
                      style={{ minHeight: 140 }}
                    />
                  </label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span style={{ color: '#475569', fontSize: 12 }}>{formatFieldLabel(taskConfig.assignedToField)}</span>
                    <select
                      value={values[taskConfig.assignedToField] ?? ''}
                      onChange={(event) => onChange(taskConfig.assignedToField, event.target.value)}
                      style={{
                        appearance: 'none',
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23475569' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 8px center',
                        paddingRight: '28px',
                      }}
                    >
                      <option value="">--</option>
                      {guideOptions.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span style={{ color: '#475569', fontSize: 12 }}>{formatFieldLabel(taskConfig.dueDateField)}</span>
                    <input
                      type="date"
                      value={values[taskConfig.dueDateField] ?? ''}
                      onChange={(event) => onChange(taskConfig.dueDateField, event.target.value)}
                    />
                  </label>
                </>
              );
            })()
          )}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  , document.body) : null);
}

export function createGridActionColumn(entity: GridRowEntity): ColDef<any> {
  return {
    headerName: '',
    colId: `__${entity}_actions`,
    valueGetter: () => null,
    cellRenderer: GridRowActionsCell as any,
    cellRendererParams: { entity },
    sortable: false,
    filter: false,
    suppressColumnsToolPanel: true,
    suppressFiltersToolPanel: true,
    suppressHeaderMenuButton: true,
    resizable: false,
    pinned: 'right',
    width: 90,
    minWidth: 85,
    maxWidth: 95,
    cellStyle: { 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: 0,
      borderLeft: 'none'
    },
    headerClass: 'no-left-border',
    cellClass: 'no-left-border',
    suppressMovable: true,
  };
}

function navigateToDetail(entity: GridRowEntity, identifier: any, options?: { action?: RowActionId; section?: string }) {
  if (!identifier) {
    // This function is called outside of React component, so we can't use dialog here
    // Keep the window.alert for now or handle this differently
    window.alert('Unable to determine which record to open.');
    return;
  }

  const basePath = getDetailPath(entity, identifier);
  const searchParams = new URLSearchParams();

  if (options?.action) searchParams.set('action', options.action);
  if (options?.section) searchParams.set('section', options.section);

  const query = searchParams.toString();
  const path = query ? `${basePath}?${query}` : basePath;

  if (typeof window !== 'undefined') {
    window.location.assign(path);
  }
}

async function archiveRecord(
  entity: GridRowEntity,
  record: Record<string, any> | null | undefined,
  dialog: ReturnType<typeof useDialog>
) {
  if (!record?.id) {
    await dialog.alert('Unable to archive this record because it is missing an id.', {
      title: 'Error',
      variant: 'error',
    });
    return;
  }

  const confirmed = await dialog.confirm('Are you sure you want to archive this record?', {
    title: 'Archive Record',
    confirmText: 'Archive',
    cancelText: 'Cancel',
    variant: 'warning',
  });

  if (!confirmed) return;

  const table = ARCHIVE_TABLES[entity];
  const client = supabase as any;
  const { error } = await client.from(table).update({ is_archived: true }).eq('id', record.id);

  if (error) {
    console.error('Failed to archive record', error);
    await dialog.alert('Unable to archive this record.', {
      title: 'Error',
      variant: 'error',
    });
  }
}

function createTableClient(schema: string | undefined, table: string) {
  return schema ? (supabase as any).schema(schema).from(table) : (supabase as any).from(table);
}

function nowIso(): string {
  return new Date().toISOString();
}

// Use centralized formatFieldLabel - removed duplicate function

function getDetailPath(entity: GridRowEntity, id: string | number): string {
  const identifier = encodeURIComponent(String(id));
  switch (entity) {
    case 'educator':
      return `/educators/${identifier}`;
    case 'school':
      return `/schools/${identifier}`;
    case 'charter':
      return `/charters/${identifier}`;
    default:
      return `/${identifier}`;
  }
}

function findEmailAddress(record: Record<string, any> | null | undefined): string | null {
  if (!record) return null;
  const candidateFields = ['primary_email', 'email', 'contact_email', 'school_email', 'charter_email'];
  for (const field of candidateFields) {
    const value = record[field];
    if (!value) continue;
    if (typeof value === 'string') return value;
    if (Array.isArray(value)) {
      const match = value.find((entry) => typeof entry === 'string' && entry.includes('@'));
      if (match) return match;
    }
  }
  return null;
}

async function resolveEmailAddresses(record: Record<string, any> | null | undefined, entity?: GridRowEntity): Promise<string[]> {
  if (!record) return [];

  // For schools, use the tl_primary_emails array field directly
  if (entity === 'school') {
    const primaryEmails = record['tl_primary_emails'];
    if (Array.isArray(primaryEmails) && primaryEmails.length > 0) {
      return primaryEmails.filter(Boolean).map((email: string) => email.trim());
    }
    return [];
  }

  // For educators, get single email
  const direct = findEmailAddress(record);
  if (direct) return [direct];

  let pid = record['people_id'] ?? record['person_id'] ?? record['educator_id'];
  if (pid == null && entity === 'educator' && record['id']) pid = record['id'];
  if (pid == null) return [];

  try {
    const { data, error } = await (supabase as any).from('primary_emails').select('email_address').eq('people_id', pid).maybeSingle();
    if (!error && data?.email_address) return [String(data.email_address)];
  } catch {}

  return [];
}

async function resolveEmailAddress(record: Record<string, any> | null | undefined, entity?: GridRowEntity): Promise<string | null> {
  const emails = await resolveEmailAddresses(record, entity);
  return emails.length > 0 ? emails[0] : null;
}
