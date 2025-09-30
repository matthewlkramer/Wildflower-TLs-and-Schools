import type { TableColumnMeta } from '../detail-types';

// Domain Registry: canonical column templates reused across presets
// Keep UI semantics (labels, lookups, enums) centralized here.

export const COLUMN_TEMPLATES = {
  educators: [
    { field: 'full_name', label: 'Educator', type: 'string', update: 'newOnly' },
    { field: 'role', label: 'Role', type: 'string', array: true, lookup: { table: 'ref_roles', valueColumn: 'value', labelColumn: 'value' }, lookupFilter: { column: 'show_in_educator_grid', value: true } },
    { field: 'start_date', label: 'Start Date', type: 'date' },
    { field: 'end_date', label: 'End Date', type: 'date' },
    { field: 'is_active', label: 'Active?', type: 'boolean' },
  ] as readonly TableColumnMeta[],

  boardMembers: [
    { field: 'full_name', label: 'Name', type: 'string' },
    { field: 'role', label: 'Role', type: 'string', array: true, lookup: { table: 'ref_roles', valueColumn: 'value', labelColumn: 'value' }, lookupFilter: { column: 'show_in_board_tables', value: true } },
    { field: 'start_date', label: 'Start Date', type: 'date' },
    { field: 'end_date', label: 'End Date', type: 'date' },
    { field: 'is_active', label: 'Active?', type: 'boolean' },
  ] as readonly TableColumnMeta[],

  schools: [
    { field: 'school_name', label: 'School', type: 'string', update: 'newOnly' },
    { field: 'role', label: 'Role', type: 'select', array: true, lookup: { table: 'ref_roles', valueColumn: 'value', labelColumn: 'value' } },
    { field: 'start_date', label: 'Start Date', type: 'date' },
    { field: 'end_date', label: 'End Date', type: 'date' },
    { field: 'is_active', label: 'Active?', type: 'boolean' },
    { field: 'stage_status', label: 'Stage/Status', type: 'string', update: 'no' },
  ] as readonly TableColumnMeta[],

  gmails: [
    { field: 'sent_at', label: 'Sent At', type: 'date', update: 'no' },
    { field: 'from', label: 'From', type: 'string', update: 'no' },
    { field: 'to_emails', label: 'To', type: 'string', array: true, update: 'no' },
    { field: 'cc_emails', label: 'CC', type: 'string', array: true, update: 'no' },
    { field: 'subject', label: 'Subject', type: 'string', update: 'no' },
    { field: 'is_private', label: 'Private?', type: 'boolean' },
  ] as readonly TableColumnMeta[],

  calendarEvents: [
    { field: 'summary', label: 'Summary', type: 'string', update: 'no' },
    { field: 'start_date', label: 'Start Date', type: 'date', update: 'no' },
    { field: 'attendees', label: 'Attendees', type: 'string', array: true, update: 'no' },
    { field: 'is_private', label: 'Private?', type: 'boolean' },
  ] as readonly TableColumnMeta[],

  actionSteps: [
    { field: 'item', label: 'Item', type: 'string', multiline: true },
    { field: 'assignee', label: 'Assignee', type: 'string', lookup: { table: 'guides', valueColumn: 'email_or_name', labelColumn: 'email_or_name' } },
    { field: 'item_status', label: 'Status', type: 'enum', enumName: 'action_step_status' },
    { field: 'assigned_date', label: 'Assigned Date', type: 'date' },
    { field: 'due_date', label: 'Due Date', type: 'date' },
    { field: 'completed_date', label: 'Completed Date', type: 'date' },
  ] as readonly TableColumnMeta[],

  notes: [
    { field: 'title', label: 'Title', type: 'string' },
    { field: 'full_text', label: 'Text', type: 'string', multiline: true },
    { field: 'created_by', label: 'Created By', type: 'string', lookup: { table: 'guides', valueColumn: 'email_or_name', labelColumn: 'email_or_name' } },
    { field: 'created_date', label: 'Created Date', type: 'date' },
    { field: 'is_private', label: 'Private?', type: 'boolean' },
  ] as readonly TableColumnMeta[],

  grants: [
    { field: 'issue_date', label: 'Issue Date', type: 'date' },
    { field: 'amount', label: 'Amount', type: 'number' },
    { field: 'grant_status', label: 'Grant Status', type: 'string' },
  ] as readonly TableColumnMeta[],

  loans: [
    { field: 'issue_date', label: 'Issue Date', type: 'date' },
    { field: 'amount_issued', label: 'Amount', type: 'number' },
  ] as readonly TableColumnMeta[],

  governance_docs: [
    { field: 'doc_type', label: 'Document Type', type: 'string', linkToField: 'pdf' },
  ] as readonly TableColumnMeta[],

  nine_nineties: [
    { field: 'form_year', label: 'Year', type: 'string', linkToField: 'pdf' },
  ] as readonly TableColumnMeta[],

  enrollment: [
    { field: 'school_year', label: 'School Year', type: 'string', lookup: { table: 'ref_school_years', valueColumn: 'value', labelColumn: 'value' } },
    { field: 'enrolled_students_total', label: 'Total Students', type: 'number' },
    { field: 'enrolled_frl', label: 'Free/Reduced Lunch', type: 'number' },
    { field: 'enrolled_ell', label: 'ELL', type: 'number' },
    { field: 'enrolled_sped', label: 'SPED', type: 'number' },
    { field: 'enrolled_bipoc', label: 'BIPOC', type: 'number' },
  ] as readonly TableColumnMeta[],

  guideAssignments: [
    { field: 'email_or_name', label: 'Email or Name', type: 'string', lookup: { table: 'guides', valueColumn: 'email_or_name', labelColumn: 'email_or_name' } },
    { field: 'type', label: 'Type', type: 'enum', enumName: 'guide_types' },
    { field: 'start_date', label: 'Start Date', type: 'date' },
    { field: 'end_date', label: 'End Date', type: 'date' },
    { field: 'is_active', label: 'Active?', type: 'boolean' },
  ] as readonly TableColumnMeta[],

  advice: [
    { field: 'advice_giver', label: 'Advice Giver', type: 'string', lookup: { table: 'educators', valueColumn: 'id', labelColumn: 'full_name' } },
    { field: 'advice_requested_date', label: 'Requested Date', type: 'date' },
    { field: 'advice_given_date', label: 'Given Date', type: 'date' },
    { field: 'advice_text', label: 'Advice Text', type: 'string', multiline: true },
    { field: 'advice_doc', label: 'Advice Document', type: 'string' },
  ] as readonly TableColumnMeta[],
} as const;

