import type { RowActionId } from './detail-types';

export type OwnershipMatchKind = 'user_id' | 'email' | 'organizer';

export type ToggleOwnershipRule = {
  field: string;
  match: OwnershipMatchKind;
  allowAdminOverride?: boolean;
};

export type ModalActionConfig = {
  type: 'modal';
  mode: 'view' | 'edit';
  fields?: 'tableColumns' | 'all' | readonly string[];
  title?: string;
};

export type ToggleActionConfig = {
  type: 'toggle';
  field: string;
  trueValue?: any;
  falseValue?: any;
  ownership?: ToggleOwnershipRule;
  timestampField?: string;
  setTimestampWhenTrue?: boolean;
};

export type ToggleCompleteActionConfig = {
  type: 'toggle_complete';
  statusField: string;
  completeValue: any;
  incompleteValue: any;
  completedDateField?: string;
};

export type NavigateActionConfig = {
  type: 'navigate';
  target: 'educator' | 'school' | 'charter' | 'location' | 'guide';
  pathTemplate?: string;
  idField?: string;
};

export type EndStintActionConfig = {
  type: 'end_stint';
  activeField: string;
  endDateField: string;
  setEndDateToNow?: boolean;
  additionalUpdates?: Record<string, any>;
};

export type ArchiveActionConfig = {
  type: 'archive';
  field: string;
  archivedValue?: any;
};

export type MakePrimaryActionConfig = {
  type: 'make_primary';
  field: string;
  groupField: string;
  trueValue?: any;
  falseValue?: any;
};

export type EmailActionConfig = {
  type: 'email';
  emailField?: string;
  nameField?: string;
};

export type CreateNoteConfig = {
  createType: 'note';
  table: string;
  schema?: string;
  textField: string;
  fkField: string;
  fkSourceField?: string;
  useEntityId?: boolean;
  defaults?: Record<string, any>;
  createdByField?: string;
  createdAtField?: string;
  privateField?: string;
};

export type CreateTaskConfig = {
  createType: 'task';
  table: string;
  schema?: string;
  textField: string;
  fkField: string;
  fkSourceField?: string;
  useEntityId?: boolean;
  assignedToField: string;
  dueDateField: string;
  assignedByField?: string;
  createdAtField?: string;
  statusField?: string;
  completeValue?: any;
  incompleteValue?: any;
  defaults?: Record<string, any>;
};

export type CreateActionConfig = {
  type: 'create';
  config: CreateNoteConfig | CreateTaskConfig;
};

export type RowActionConfig =
  | ModalActionConfig
  | ToggleActionConfig
  | ToggleCompleteActionConfig
  | NavigateActionConfig
  | EndStintActionConfig
  | ArchiveActionConfig
  | MakePrimaryActionConfig
  | EmailActionConfig
  | CreateActionConfig;

export type DetailActionPreset = {
  schema?: string;
  table: string;
  fkColumn?: string;
  primaryKey?: string;
  inlineFields?: 'tableColumns' | readonly string[];
  modalFields?: 'all' | readonly string[];
  rowActions: Partial<Record<RowActionId, RowActionConfig>>;
};

const DEFAULT_SCHEMA = 'public';

const PRESETS: DetailActionPreset[] = [
  {
    table: 'notes',
    primaryKey: 'id',
    rowActions: {
      inline_edit: { type: 'modal', mode: 'edit', fields: 'tableColumns' }, 
      view_in_modal: { type: 'modal', mode: 'view', fields: 'all' },
      toggle_private_public: {
        type: 'toggle',
        field: 'is_private',
        trueValue: true,
        falseValue: false,
        ownership: { field: 'created_by', match: 'email', allowAdminOverride: true },
      },
      archive: { type: 'archive', field: 'is_archived', archivedValue: true },
    },
  },
  {
    table: 'action_steps',
    primaryKey: 'id',
    rowActions: {
      inline_edit: { type: 'modal', mode: 'edit', fields: 'tableColumns' },
      view_in_modal: { type: 'modal', mode: 'view', fields: 'all' },
      toggle_complete: {
        type: 'toggle_complete',
        statusField: 'item_status', 
        completeValue: 'Complete',
        incompleteValue: 'Incomplete',
        completedDateField: 'completed_date',
      },
      archive: { type: 'archive', field: 'is_archived', archivedValue: true },
    },
  },
  {
    table: 'email_addresses',
    primaryKey: 'id',
    rowActions: {
      inline_edit: { type: 'modal', mode: 'edit', fields: 'tableColumns' },
      make_primary: { type: 'make_primary', field: 'is_primary', groupField: 'people_id', trueValue: true, falseValue: false },
      toggle_valid: { type: 'toggle', field: 'is_valid', trueValue: true, falseValue: false },
    },
  },
  {
    table: 'details_associations',
    fkColumn: 'people_id',
    primaryKey: 'id',
    rowActions: {
      inline_edit: { type: 'modal', mode: 'edit', fields: 'tableColumns' }, 
      view_in_modal: { type: 'modal', mode: 'view', fields: 'all' },
      end_stint: { type: 'end_stint', activeField: 'is_active', endDateField: 'end_date', setEndDateToNow: true },
      archive: { type: 'archive', field: 'is_archived', archivedValue: true },
    },
  },
  {
    table: 'details_associations',
    fkColumn: 'school_id',
    primaryKey: 'id',
    rowActions: {
      inline_edit: { type: 'modal', mode: 'edit', fields: 'tableColumns' },
      view_in_modal: { type: 'modal', mode: 'view', fields: 'all' },
      end_stint: { type: 'end_stint', activeField: 'is_active', endDateField: 'end_date', setEndDateToNow: true },
      archive: { type: 'archive', field: 'is_archived', archivedValue: true },
    },
  },
  {
    table: 'details_educators',
    fkColumn: 'charter_id',
    primaryKey: 'id',
    rowActions: {
      inline_edit: { type: 'modal', mode: 'edit', fields: 'tableColumns' },
      view_in_modal: { type: 'modal', mode: 'view', fields: 'all' },
      end_stint: { type: 'end_stint', activeField: 'is_active', endDateField: 'end_date', setEndDateToNow: true },
    },
  },
  {
    table: 'details_schools',
    fkColumn: 'charter_id',
    primaryKey: 'id',
    rowActions: {
      inline_edit: { type: 'modal', mode: 'edit', fields: 'tableColumns' },
      view_in_modal: { type: 'modal', mode: 'view', fields: 'all' },
      end_stint: { type: 'end_stint', activeField: 'is_active', endDateField: 'end_date', setEndDateToNow: true },
    },
  },
  {
    table: 'educators',
    fkColumn: 'school_id',
    primaryKey: 'id',
    inlineFields: ['role', 'start_date', 'end_date', 'currently_active'],
    rowActions: {
      inline_edit: { type: 'modal', mode: 'edit', fields: ['role', 'start_date', 'end_date', 'currently_active'] },
      jump_to_modal: { type: 'navigate', target: 'educator', idField: 'id' },
      email: { type: 'email', emailField: 'primary_email', nameField: 'full_name' },
      add_note: {
        type: 'create',
        config: {
          createType: 'note',
          table: 'notes',
          textField: 'note',
          fkField: 'people_id',
          fkSourceField: 'id',
          createdByField: 'created_by',
          createdAtField: 'created_date',
          privateField: 'is_private',
          defaults: { is_private: false },
        },
      },
      add_task: {
        type: 'create',
        config: {
          createType: 'task',
          table: 'action_steps',
          textField: 'item',
          fkField: 'people_id',
          fkSourceField: 'id',
          assignedToField: 'assignee',
          assignedByField: 'created_by',
          dueDateField: 'due_date',
          createdAtField: 'assigned_date',
          statusField: 'item_status',
          incompleteValue: 'Incomplete',
          completeValue: 'Complete',
        },
      },
      end_stint: { type: 'end_stint', activeField: 'is_active', endDateField: 'end_date', setEndDateToNow: true },
      archive: { type: 'archive', field: 'is_archived', archivedValue: true },
    },
  },
  {
    table: 'annual_enrollment_and_demographics',
    primaryKey: 'id',
    rowActions: {
      inline_edit: { type: 'modal', mode: 'edit', fields: 'tableColumns' },
    },
  },
  {
    table: 'locations',
    fkColumn: 'school_id',
    primaryKey: 'id',
    rowActions: {
      inline_edit: { type: 'modal', mode: 'edit', fields: 'tableColumns' },
      view_in_modal: { type: 'modal', mode: 'view', fields: 'all' },
      jump_to_modal: { type: 'navigate', target: 'location', idField: 'id', pathTemplate: '/locations/{id}' },
      end_stint: { type: 'end_stint', activeField: 'is_active', endDateField: 'end_date', setEndDateToNow: true },
      archive: { type: 'archive', field: 'is_archived', archivedValue: true },
    },
  },
  {
    table: 'guide_assignments',
    fkColumn: 'school_id',
    primaryKey: 'id',
    rowActions: {
      inline_edit: { type: 'modal', mode: 'edit', fields: 'tableColumns' },
    },
  },
  {
    table: 'montessori_certs',
    primaryKey: 'id',
    rowActions: {
      inline_edit: { type: 'modal', mode: 'edit', fields: 'tableColumns' },
      view_in_modal: { type: 'modal', mode: 'view', fields: 'all' },
      archive: { type: 'archive', field: 'is_archived', archivedValue: true },
    },
  },
  {
    table: 'governance_docs',
    primaryKey: 'id',
    rowActions: {
      view_in_modal: { type: 'modal', mode: 'view', fields: 'all' },
      archive: { type: 'archive', field: 'is_archived', archivedValue: true },

    },
  },
  {
    table: 'nine_nineties',
    primaryKey: 'id',
    rowActions: {
      view_in_modal: { type: 'modal', mode: 'view', fields: 'all' },
      archive: { type: 'archive', field: 'is_archived', archivedValue: true },
    },
  },
  {
    table: 'grants',
    primaryKey: 'id',
    rowActions: {
      inline_edit: { type: 'modal', mode: 'edit', fields: 'tableColumns' },
      view_in_modal: { type: 'modal', mode: 'view', fields: 'all' },
      archive: { type: 'archive', field: 'is_archived', archivedValue: true },
    },
  },
  {
    table: 'loans',
    primaryKey: 'id',
    rowActions: {
      view_in_modal: { type: 'modal', mode: 'view', fields: 'all' },
    },
  },
  {
    schema: 'gsync',
    table: 'g_emails',
    primaryKey: 'id',
    rowActions: {
      view_in_modal: { type: 'modal', mode: 'view', fields: 'all' },
      toggle_private_public: {
        type: 'toggle',
        field: 'is_private',
        trueValue: true,
        falseValue: false,
        ownership: { field: 'user_id', match: 'user_id', allowAdminOverride: true },
      },
    },
  },
  {
    schema: 'gsync',
    table: 'g_events',
    primaryKey: 'id',
    rowActions: {
      view_in_modal: { type: 'modal', mode: 'view', fields: 'all' },
      toggle_private_public: {
        type: 'toggle',
        field: 'is_private',
        trueValue: true,
        falseValue: false,
        ownership: { field: 'organizer', match: 'organizer', allowAdminOverride: true },
      },
    },
  },
];

export function findDetailActionPreset(schema: string | undefined, table: string, fkColumn?: string): DetailActionPreset | undefined {
  const targetSchema = schema ?? DEFAULT_SCHEMA;
  const matches = PRESETS.filter((preset) => (preset.schema ?? DEFAULT_SCHEMA) === targetSchema && preset.table === table);
  if (matches.length === 0) return undefined;
  if (fkColumn) {
    const exact = matches.find((preset) => preset.fkColumn === fkColumn);
    if (exact) return exact;
  }
  return matches.find((preset) => preset.fkColumn === undefined) ?? matches[0];
}
