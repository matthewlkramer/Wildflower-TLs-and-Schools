import type { TableColumnMeta, RowActionId } from './detail-types';
// Presets are now self-contained; no external column/action bundles

export type TablePreset = {
  readSource?: { schema?: string; table: string; fkColumn: string };
  writeDefaults?: { schema?: string; table: string; pk?: string; pkColumn?: string };
  columns?: readonly string[] | readonly TableColumnMeta[];
  rowActions?: readonly RowActionId[];
  tableActions?: readonly string[];
  tableActionLabels?: readonly string[];
};

const TABLE_COLUMNS = {
  educators: [
    { field: 'full_name', label: 'Educator', type: 'string' , update: 'newOnly'},
    { field: 'role', label: 'Role', type: 'string', array: true, lookup: { table: 'ref_roles', valueColumn: 'value', labelColumn: 'value' }},
    { field: 'start_date', label: 'Start Date', type: 'date' },
    { field: 'end_date', label: 'End Date', type: 'date' },
    { field: 'is_active', label: 'Active?', type: 'boolean' },
  ],

  schools: [
    { field: 'school_name', label: 'School', type: 'string', update: 'newOnly' },
    { field: 'role', label: 'Role', type: 'string', array: true, lookup: { table: 'ref_roles', valueColumn: 'value', labelColumn: 'value' } },
    { field: 'start_date', label: 'Start Date', type: 'date' },
    { field: 'end_date', label: 'End Date', type: 'date' },
    { field: 'is_active', label: 'Active?', type: 'boolean' },
    { field: 'stage_status', label: 'Stage/Status', type: 'string' , update: 'no'},
  ],

  gmails: [
    { field: 'sent_at', label: 'Sent At', type: 'date', update: 'no' },
    { field: 'from', label: 'From', type: 'string', update: 'no' },
    { field: 'to_emails', label: 'To', type: 'string', array: true, update: 'no' },
    { field: 'cc_emails', label: 'CC', type: 'string', array: true, update: 'no' },
    { field: 'subject', label: 'Subject', type: 'string', update: 'no' },
    { field: 'is_private', label: 'Private?', type: 'boolean' },
  ],

  calendarEvents: [
    { field: 'summary', label: 'Summary', type: 'string', update: 'no' },
    { field: 'start_date', label: 'Start Date', type: 'date', update: 'no' },
    { field: 'attendees', label: 'Attendees', type: 'string', array: true, update: 'no' },
    { field: 'is_private', label: 'Private?', type: 'boolean' },
  ],

  actionSteps: [
    { field: 'item', label: 'Item', type: 'string', multiline: true },
    { field: 'assignee', label: 'Assignee', type: 'string', lookup: { table: 'guides', valueColumn: 'email_or_name', labelColumn: 'email_or_name' }  },
    { field: 'item_status', label: 'Status', type: 'enum', enumName: 'action_step_status' },
    { field: 'assigned_date', label: 'Assigned Date', type: 'date' },
    { field: 'due_date', label: 'Due Date', type: 'date' },
    { field: 'completed_date', label: 'Completed Date', type: 'date' },
  ],

  notes: [
    { field: 'title', label: 'Title', type: 'string' },
    { field: 'full_text', label: 'Text', type: 'string', multiline: true },
    { field: 'created_by', label: 'Created By', type: 'string', lookup: { table: 'guides', valueColumn: 'email_or_name', labelColumn: 'email_or_name' } },
    { field: 'created_date', label: 'Created Date', type: 'date' },
    { field: 'is_private', label: 'Private?', type: 'boolean' },
  ],

  grants: [
    { field: 'issue_date', label: 'Issue Date', type: 'date' },
    { field: 'amount', label: 'Amount', type: 'number' },
    { field: 'grant_status', label: 'Grant Status', type: 'string' },
  ],

  loans: [
    { field: 'issue_date', label: 'Issue Date', type: 'date' },
    { field: 'amount_issued', label: 'Amount', type: 'number' },
  ],

  governance_docs: [
    { field: 'doc_type', label: 'Document Type', type: 'string' },
    { field: 'pdf', label: 'Document', type: 'attachment' },
  ],
governance_docs: [
    { field: 'doc_type', label: 'Document Type', type: 'string' },
    { field: 'pdf', label: 'Document', type: 'attachment' },




