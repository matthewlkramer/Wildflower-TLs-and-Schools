import React from 'react';
import type { ColDef, ICellRendererParams } from 'ag-grid-community';
import { useQueryClient } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase/client';
import type { RowActionId } from '@/modules/shared/detail-types';
import { useAuth } from '@/modules/auth/auth-context';
import type { CreateNoteConfig, CreateTaskConfig } from '@/modules/shared/detail-actions-presets';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
  add_note: 'Add note',
  add_task: 'Add task',
  email: 'Email',
};

const GRID_ACTIONS: Record<GridRowEntity, RowActionId[]> = {
  educator: ['inline_edit', 'view_in_modal', 'email', 'add_note', 'add_task', 'archive'],
  school: ['inline_edit', 'view_in_modal', 'email', 'add_note', 'add_task', 'archive'],
  charter: ['inline_edit', 'view_in_modal', 'email', 'add_note', 'add_task', 'archive'],
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
      textField: 'note',
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
      assignedByField: 'created_by',
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
      textField: 'note',
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
      assignedByField: 'created_by',
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
      textField: 'note',
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
      assignedByField: 'created_by',
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
        window.alert('Unable to determine which record to link.');
        return;
      }
      const client = createTableClient(config.schema, config.table);
      try {
        setSubmitting(true);
        if (config.createType === 'note') {
          const noteConfig = config as CreateNoteConfig;
          const textValue = String(formValues[noteConfig.textField] ?? '').trim();
          if (!textValue) {
            window.alert('Please enter note text.');
            return;
          }
          const payload: Record<string, any> = {
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
            window.alert('Task text is required.');
            return;
          }
          const assigneeValue = formValues[taskConfig.assignedToField];
          if (!assigneeValue) {
            window.alert('Please select an assignee.');
            return;
          }
          const dueDateRaw = formValues[taskConfig.dueDateField];
          const dueDateValue = dueDateRaw ? String(dueDateRaw) : '';
          if (!dueDateValue) {
            window.alert('Please provide a due date.');
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
        window.alert('Unable to complete the request.');
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
          navigateToDetail(entity, data?.id, { action: 'inline_edit' });
          break;
        }
        case 'view_in_modal': {
          navigateToDetail(entity, data?.id, { action: 'view_in_modal' });
          break;
        }
        case 'email': {
          const email = findEmailAddress(data);
          if (!email) {
            window.alert('No email address is available for this record.');
            break;
          }
          if (typeof window !== 'undefined') {
            window.location.href = `mailto:${email}`;
          }
          break;
        }
        case 'add_note': {
          if (!data?.id) {
            window.alert('Unable to determine which record to open.');
            break;
          }
          setModalState({ action: 'add_note', entity, recordId: String(data.id), row: data ?? undefined });
          break;
        }
        case 'add_task': {
          if (!data?.id) {
            window.alert('Unable to determine which record to open.');
            break;
          }
          setModalState({ action: 'add_task', entity, recordId: String(data.id), row: data ?? undefined });
          break;
        }
        case 'archive': {
          await archiveRecord(entity, data as Record<string, any> | undefined);
          await queryClient.invalidateQueries({ queryKey: GRID_QUERY_KEYS[entity] });
          break;
        }
        default: {
          window.alert('This action is not implemented yet.');
          break;
        }
      }
    } finally {
      setValue('');
    }
  };

  return (
    <>
      <Select
        value={value}
        onValueChange={handleChange}
        onOpenChange={(open) => {
          if (!open) setValue('');
        }}
      >
        <SelectTrigger 
          className="w-[85px] text-xs border-slate-300 hover:border-slate-400 focus:ring-1 focus:ring-slate-400"
          style={{ height: '24px', minHeight: '24px', padding: '2px 8px', fontSize: '12px' }}
          onMouseDown={(event) => event.stopPropagation()}
          onMouseUp={(event) => event.stopPropagation()}
          onClick={(event) => event.stopPropagation()}
        >
          <SelectValue placeholder="Actions" />
        </SelectTrigger>
        <SelectContent 
          className="bg-white border border-slate-200 shadow-lg z-50"
          style={{ 
            backgroundColor: '#ffffff', 
            border: '1px solid #e2e8f0', 
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', 
            zIndex: 9999 
          }}
        >
          {actions.map((id) => (
            <SelectItem 
              key={id} 
              value={id} 
              className="text-xs"
              style={{ backgroundColor: '#ffffff', color: '#1f2937', fontSize: '11px', padding: '4px 8px' }}
            >
              {ACTION_LABELS[id]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
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

  return (
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
          minWidth: 360,
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
                return (
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span style={{ color: '#475569', fontSize: 12 }}>{formatLabel(noteConfig.textField)}</span>
                    <textarea
                      rows={3}
                      value={values[noteConfig.textField] ?? ''}
                      onChange={(event) => onChange(noteConfig.textField, event.target.value)}
                      autoFocus
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
                    <span>{formatLabel(field)}</span>
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
                    <span style={{ color: '#475569', fontSize: 12 }}>{formatLabel(taskConfig.textField)}</span>
                    <textarea
                      rows={3}
                      value={values[taskConfig.textField] ?? ''}
                      onChange={(event) => onChange(taskConfig.textField, event.target.value)}
                      autoFocus
                    />
                  </label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span style={{ color: '#475569', fontSize: 12 }}>{formatLabel(taskConfig.assignedToField)}</span>
                    <input
                      type="text"
                      value={values[taskConfig.assignedToField] ?? ''}
                      onChange={(event) => onChange(taskConfig.assignedToField, event.target.value)}
                    />
                  </label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span style={{ color: '#475569', fontSize: 12 }}>{formatLabel(taskConfig.dueDateField)}</span>
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
  );
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

async function archiveRecord(entity: GridRowEntity, record: Record<string, any> | null | undefined) {
  if (!record?.id) {
    window.alert('Unable to archive this record because it is missing an id.');
    return;
  }

  if (!window.confirm('Archive this record?')) return;
  const table = ARCHIVE_TABLES[entity];
  const client = supabase as any;
  const { error } = await client.from(table).update({ is_archived: true }).eq('id', record.id);

  if (error) {
    console.error('Failed to archive record', error);
    window.alert('Unable to archive this record.');
  }
}

function createTableClient(schema: string | undefined, table: string) {
  return schema ? (supabase as any).schema(schema).from(table) : (supabase as any).from(table);
}

function nowIso(): string {
  return new Date().toISOString();
}

function formatLabel(field: string): string {
  return field
    .split('_')
    .map((part) => (part.length > 0 ? part[0].toUpperCase() + part.slice(1) : part))
    .join(' ');
}

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
