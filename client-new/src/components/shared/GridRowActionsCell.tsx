import React from 'react';
import ReactDOM from 'react-dom';
import type { ColDef, ICellRendererParams } from 'ag-grid-community';
import { useQueryClient } from '@tanstack/react-query';
import { Button as MButton, Menu, MenuItem } from '@mui/material';

import { supabase } from '@/lib/supabase/client';
import type { RowActionId } from '@/modules/shared/detail-types';
import { useAuth } from '@/modules/auth/auth-context';
import type { CreateNoteConfig, CreateTaskConfig } from '@/modules/shared/detail-types';

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
  educator: ['email', 'add_note', 'add_task', 'archive'],
  school: ['add_note', 'add_task', 'archive'],
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
          // For main grids, inline editing is disabled: open detail with intent
          navigateToDetail(entity, data?.id, { action: 'inline_edit' });
          break;
        }
        case 'view_in_modal': {
          navigateToDetail(entity, data?.id, { action: 'view_in_modal' });
          break;
        }
        case 'email': {
          const email = await resolveEmailAddress(data as any, entity);
          if (!email) {
            window.alert('No email address is available for this record.');
            break;
          }
          if (typeof window !== 'undefined') {
            const to = encodeURIComponent(email);
            window.location.assign(`/email/compose?to=${to}`);
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

  // Main grids: always show the Actions menu (no inline edit UI here)

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <MButton
        variant="contained"
        size="small"
        onClick={handleClick}
        sx={{
          height: 24,
          minHeight: 24,
          textTransform: 'none',
          fontSize: 14,
          fontFamily: 'inherit',
          fontWeight: 400,
          borderRadius: '6px',
          px: 1.5,
          boxShadow: 'none',
          backgroundColor: '#0f8a8d',
          color: '#ffffff',
          '&:hover': { 
            backgroundColor: '#0b6e71',
            boxShadow: 'none'
          },
        }}
        onMouseDown={(event) => event.stopPropagation()}
        onMouseUp={(event) => event.stopPropagation()}
      >
        Actions
        <span style={{ marginLeft: 8, opacity: 0.9 }}>▾</span>
      </MButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        elevation={2}
        MenuListProps={{ dense: true }}
        PaperProps={{ 
          sx: { 
            borderRadius: 1, 
            mt: 0.5,
            minWidth: 120
          } 
        }}
      >
        {actions.map((id) => (
          <MenuItem 
            key={id}
            onClick={() => {
              handleClose();
              handleChange(id);
            }}
            sx={{ 
              fontSize: '0.75rem', 
              py: 0.5, 
              minHeight: 'auto' 
            }}
          >
            {ACTION_LABELS[id]}
          </MenuItem>
        ))}
      </Menu>
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
                return (
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span style={{ color: '#475569', fontSize: 12 }}>{formatLabel(noteConfig.textField)}</span>
                    <textarea
                      rows={8}
                      value={values[noteConfig.textField] ?? ''}
                      onChange={(event) => onChange(noteConfig.textField, event.target.value)}
                      autoFocus
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
                      rows={8}
                      value={values[taskConfig.textField] ?? ''}
                      onChange={(event) => onChange(taskConfig.textField, event.target.value)}
                      autoFocus
                      style={{ minHeight: 140 }}
                    />
                  </label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span style={{ color: '#475569', fontSize: 12 }}>{formatLabel(taskConfig.assignedToField)}</span>
                    <select
                      value={values[taskConfig.assignedToField] ?? ''}
                      onChange={(event) => onChange(taskConfig.assignedToField, event.target.value)}
                    >
                      <option value="">--</option>
                      {guideOptions.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
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

async function resolveEmailAddress(record: Record<string, any> | null | undefined, entity?: GridRowEntity): Promise<string | null> {
  const direct = findEmailAddress(record);
  if (direct) return direct;
  if (!record) return null;
  let pid = record['people_id'] ?? record['person_id'] ?? record['educator_id'];
  if (pid == null && entity === 'educator' && record['id']) pid = record['id'];
  if (pid == null) return null;
  try {
    const { data, error } = await (supabase as any).from('primary_emails').select('email_address').eq('people_id', pid).maybeSingle();
    if (!error && data?.email_address) return String(data.email_address);
  } catch {}
  return null;
}
