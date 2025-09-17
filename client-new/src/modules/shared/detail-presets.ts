import type { TableColumnMeta } from './detail-types';

export const ROW_ACTIONS = {
  actionSteps: Object.freeze(['inline_edit', 'modal_view', 'mark_complete', 'archive'] as const),
  notes: Object.freeze(['inline_edit', 'modal_view', 'markPrivate', 'archive'] as const),
  modalViewPrivate: Object.freeze(['modalView', 'markPrivate'] as const),
} as const;

export const TABLE_ACTIONS = {
  actionSteps: Object.freeze(['addActionStep'] as const),
  notes: Object.freeze(['addNote'] as const),
} as const;

export const TABLE_COLUMNS = {
  actionSteps: Object.freeze(['item', 'assignee', 'item_status', 'assigned_date', 'due_date', 'completed_date'] as const),
  notes: Object.freeze(['note', 'created_by', 'created_date', 'private'] as const),
  gmail: Object.freeze(['sent_at', 'from', 'to_emails', 'cc_emails', 'subject'] as const),
  emailAddresses: Object.freeze(['email_address', 'category', 'is_primary','is_valid'] as const),
  calendarEvents: Object.freeze(['summary', 'start_date', 'attendees'] as const),
  educators: Object.freeze(['full_name', 'role', 'start_date', 'end_date', 'currently_active'] as const),
  educatorsOnCharters: Object.freeze(['school_name','full_name', 'role', 'start_date', 'end_date', 'currently_active'] as const),
  schools: Object.freeze(['school_name', 'role', 'start_date', 'end_date', 'currently_active', 'stage_status'] as const),
  schoolsOnCharters: Object.freeze(['full_name','school_name', 'role', 'start_date', 'end_date', 'currently_active', 'stage_status'] as const),
  locations: Object.freeze(['address', 'start_date', 'end_date', 'current_mail_address', 'current_physical_address'] as const),
  guides: Object.freeze(['email_or_name', 'type', 'start_date', 'end_date', 'active'] as const),
  grants: Object.freeze(['issue_date', 'amount', 'grant_status'] as const),
  loans: Object.freeze(['issue_date', 'amount_issued', 'interest_rate', 'maturity', 'vehicle'] as const),
  events: Object.freeze(['event_name', 'event_date', 'attended_event'] as const),
  montessoriCerts: Object.freeze(['year', 'association', 'cert_level'] as const),
  enrollment: Object.freeze(['school_year', 'enrolled_students_total', 'enrolled_frl', 'enrolled_ell', 'enrolled_sped', 'enrolled_bipoc'] as const),
  governanceDocs: Object.freeze(['document_name', 'document_type'] as const),
  nineNineties: Object.freeze(['form_year', 'pdf'] as const),
  schoolReports: Object.freeze(['school_year', 'report_type', 'atttachment'] as const),
  annualData: Object.freeze(['school_year', 'assessment_or_metric', 'metric_data', 'assessed_total'] as const),
  systems: Object.freeze(['on_connected', 'on_slack', 'in_tl_google_grp', 'in_wf_directory', 'who_initiated_tl_removal', 'on_natl_website', 'gsuite_roles'] as const),
} as const;

export const TABLE_COLUMN_META: Record<string, readonly TableColumnMeta[]> = {
  actionSteps: Object.freeze<TableColumnMeta[]>([
    { field: 'item', label: 'Item', type: 'string', multiline: true },
    { field: 'assignee', label: 'Assignee', type: 'string' }, //single-select - chooses from the guides table
    { field: 'item_status', label: 'Status', type: 'enum' },  //enum 'action_step_status'
    { field: 'assigned_date', label: 'Assigned Date', type: 'date' },
    { field: 'due_date', label: 'Due Date', type: 'date' },
    { field: 'completed_date', label: 'Completed Date', type: 'date' },
  ]),
  notes: Object.freeze<TableColumnMeta[]>([
    { field: 'note', label: 'Note', type: 'string', multiline: true },
    { field: 'created_by', label: 'Created By', type: 'string' }, //single-select - chooses from the guides table
    { field: 'created_date', label: 'Created Date', type: 'date' },
    { field: 'private', label: 'Private?', type: 'boolean' },
  ]),
  gmail: Object.freeze<TableColumnMeta[]>([
    { field: 'sent_at', label: 'Sent At', type: 'date' },
    { field: 'from', label: 'From', type: 'string' },
    { field: 'to_emails', label: 'To', type: 'string', array: true },
    { field: 'cc_emails', label: 'CC', type: 'string', array: true },
    { field: 'subject', label: 'Subject', type: 'string' },
  ]),
  emailAddresses: Object.freeze<TableColumnMeta[]>([
    { field: 'email_address', label: 'Email Address', type: 'string' },
    { field: 'category', label: 'Category', type: 'enum' }, //enum 'email_categories'
    { field: 'is_primary', label: 'Primary?', type: 'boolean' },
    { field: 'is_valid', label: 'Valid?', type: 'boolean' },
  ]),
  calendarEvents: Object.freeze<TableColumnMeta[]>([
    { field: 'summary', label: 'Summary', type: 'string' },
    { field: 'start_date', label: 'Start Date', type: 'date' },
    { field: 'attendees', label: 'Attendees', type: 'string', array: true },
  ]),
  educators: Object.freeze<TableColumnMeta[]>([
    { field: 'full_name', label: 'Full Name', type: 'string' },
    { field: 'role', label: 'Role', type: 'string' }, //multi-select - on ref_roles.value
    { field: 'start_date', label: 'Start Date', type: 'date' },
    { field: 'end_date', label: 'End Date', type: 'date' },
    { field: 'currently_active', label: 'Active?', type: 'boolean' },
  ]),
  schools: Object.freeze<TableColumnMeta[]>([
    { field: 'school_name', label: 'School Name', type: 'string' },
    { field: 'role', label: 'Role', type: 'enum' }, //multi-select - on ref_roles.value
    { field: 'start_date', label: 'Start Date', type: 'date' },
    { field: 'end_date', label: 'End Date', type: 'date' },
    { field: 'currently_active', label: 'Active?', type: 'boolean' },
    { field: 'stage_status', label: 'Stage/Status', type: 'string' },
  ]),
  locations: Object.freeze<TableColumnMeta[]>([
    { field: 'address', label: 'Address', type: 'string', multiline: true },
    { field: 'start_date', label: 'Start Date', type: 'date' },
    { field: 'end_date', label: 'End Date', type: 'date' },
    { field: 'current_mail_address', label: 'Current Mail Address?', type: 'boolean' },
    { field: 'current_physical_address', label: 'Current Physical Address?', type: 'boolean' },
  ]),
  guides: Object.freeze<TableColumnMeta[]>([
    { field: 'email_or_name', label: 'Email or Name', type: 'string' }, //single-select - chooses from the guides table
    { field: 'type', label: 'Type', type: 'enum' }, //enum 'guide_types'
    { field: 'start_date', label: 'Start Date', type: 'date' },
    { field: 'end_date', label: 'End Date', type: 'date' },
    { field: 'active', label: 'Active?', type: 'boolean' },
  ]),
  grants: Object.freeze<TableColumnMeta[]>([
    { field: 'issue_date', label: 'Issue Date', type: 'date' },
    { field: 'amount', label: 'Amount', type: 'number' },
    { field: 'grant_status', label: 'Grant Status', type: 'string' },
  ]),
  loans: Object.freeze<TableColumnMeta[]>([
    { field: 'issue_date', label: 'Issue Date', type: 'date' },
    { field: 'amount_issued', label: 'Amount', type: 'number' },
    { field: 'interest_rate', label: 'Interest Rate', type: 'number' },
    { field: 'maturity', label: 'Maturity', type: 'date' },
    { field: 'vehicle', label: 'Vehicle', type: 'string' },
  ]),
  events: Object.freeze<TableColumnMeta[]>([
    { field: 'event_name', label: 'Event Name', type: 'string' },
    { field: 'event_date', label: 'Event Date', type: 'date' },
    { field: 'attended_event', label: 'Attended?', type: 'boolean' },
  ]),
  montessoriCerts: Object.freeze<TableColumnMeta[]>([
    { field: 'year', label: 'Year', type: 'enum' },
    { field: 'association', label: 'Association', type: 'enum' },
    { field: 'cert_level', label: 'Status', type: 'enum' },
  ]),
  enrollment: Object.freeze<TableColumnMeta[]>([
    { field: 'school_year', label: 'School Year', type: 'string' },
    { field: 'enrolled_students_total', label: 'Total Students', type: 'number' },
    { field: 'enrolled_frl', label: 'Free/Reduced Lunch', type: 'number' },
    { field: 'enrolled_ell', label: 'ELL', type: 'number' },
    { field: 'enrolled_sped', label: 'SPED', type: 'number' },
    { field: 'enrolled_bipoc', label: 'BIPOC', type: 'number' },
  ]),
  governanceDocs: Object.freeze<TableColumnMeta[]>([
    { field: 'document_name', label: 'Document Name', type: 'string' },
    { field: 'document_type', label: 'Document Type', type: 'enum' },
  ]),
  nineNineties: Object.freeze<TableColumnMeta[]>([
    { field: 'form_year', label: 'Year', type: 'string' },
    { field: 'pdf', label: 'Document', type: 'attachment' },
  ]),
  schoolReports: Object.freeze<TableColumnMeta[]>([
    { field: 'school_year', label: 'School Year', type: 'string' },
    { field: 'report_type', label: 'Report Type', type: 'enum' },
    { field: 'atttachment', label: 'Attachment', type: 'attachment' },
  ]),
  annualData: Object.freeze<TableColumnMeta[]>([
    { field: 'school_year', label: 'School Year', type: 'string' },
    { field: 'assessment_or_metric', label: 'Assessment or Metric', type: 'number' },
    { field: 'metric_data', label: 'Value', type: 'string' },
    { field: 'assessed_total', label: 'Data Source', type: 'string' },
  ]),
  systems: Object.freeze<TableColumnMeta[]>([
    { field: 'on_connected', label: 'On Connected?', type: 'boolean' },
    { field: 'on_slack', label: 'On Slack?', type: 'boolean' },
    { field: 'in_tl_google_grp', label: 'In TL Google Group?', type: 'boolean' },
    { field: 'in_wf_directory', label: 'In WF Directory?', type: 'boolean' },
    { field: 'who_initiated_tl_removal', label: 'Who Initiated TL Removal?', type: 'string' },
    { field: 'on_natl_website', label: 'On National Website?', type: 'boolean' },
    { field: 'gsuite_roles', label: 'GSuite Roles', type: 'string', array: true },
  ]),
} as const;