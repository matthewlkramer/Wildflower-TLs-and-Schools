import { list } from '../views/builders';
import type { TableColumnMeta, TableActionSpec, RowActionId, TableToggleSpec, FilterExpr } from '../types/detail-types';
export type TablePreset = {
  title?: string;
  orderBy?: readonly { column: string; ascending: boolean }[] | { column: string; ascending: boolean };
  cardLimit?: number; // default 50
  readSource?: string;
  readFilter?: FilterExpr;
  write?: boolean; // default true
  writeDefaults?: { table: string; pkColumn?: string };
  columns?: readonly string[] | readonly TableColumnMeta[];
  rowActions?: readonly RowActionId[];
  tableActions?: readonly TableActionSpec[];
  toggles?: readonly TableToggleSpec[];
};



export const TABLE_LIST_PRESETS = {

  authorizerActions: {
    title: 'Authorizer Actions',
    orderBy: [{ column: 'action_date', ascending: false }] as const,
    cardLimit: 50,
    readSource: 'charter_authorization_actions',
    columns: [
      { field: 'action', lookupTable: 'zref_charter_authorizer_actions', listLayout: 'title'},
      { field: 'action_date', listLayout: 'body'},
      { field: 'authorized_after_action', label: 'Authorized After?', listLayout: 'body'},
    ] as const,
    rowActions: ['view_in_modal'] as const,
  },

  educators: {
    title: 'Educators',
    orderBy: { column: 'start_date', ascending: false } as const,
    cardLimit: 50,
    readSource: 'details_associations',
    readFilter: { eq: { column: 'show_in_educator_grid', value: true } },
    writeDefaults: { table: 'people_roles_associations', pkColumn: 'id' },
    columns: [
      { field: 'full_name', label: 'Educator', update: 'newOnly' ,listLayout: 'title'},
      { field: 'role', lookupTable: 'zref_roles', listLayout: 'subtitle' },
      { field: 'start_date', listLayout: 'body' },
      { field: 'end_date', listLayout: 'body' },
      { field: 'is_active', label: 'Active?', listLayout: 'badge' },
    ] as const,
    rowActions: ['inline_edit', 'view_in_modal', 'jump_to_modal', 'end_stint', 'email', 'add_note','add_task','archive'] as const,
    toggles: [ { id: 'active', label: 'Active only', expr: { eq: { column: 'is_active', value: true } }, defaultOn: true } ],
  },

  schools: {
    title: 'Schools',
    readSource: 'details_associations',
    readFilter: {eq: { column: 'show_in_educator_grid', value: true } },
    writeDefaults: { table: 'people_roles_associations', pkColumn: 'id' },
    columns: [
      { field: 'school_name', label: 'School', update: 'newOnly' , listLayout: 'title'},
      { field: 'stage_status', label: 'Stage/Status', update: 'no' , listLayout: 'subtitle'},
      { field: 'role', lookupTable: 'zref_roles', listLayout: 'body' },
      { field: 'start_date', listLayout: 'body' },
      { field: 'end_date', listLayout: 'body' },
      { field: 'is_active', label: 'Active?', listLayout: 'badge' },

    ] as const,
    rowActions: ['inline_edit', 'view_in_modal', 'jump_to_modal', 'end_stint', 'add_note','add_task','archive'] as const,
    toggles: [ { id: 'active', label: 'Active only', expr: { eq: { column: 'is_active', value: true } }, defaultOn: true } ],
  },

  gmails: {
    title: 'Gmail',
    orderBy: [{ column: 'sent_at', ascending: false }] as const,
    cardLimit: 50,
    readSource: 'yg_emails_with_people_ids_mv',
    writeDefaults: {table: 'yg_emails', pkColumn: 'id' },
    columns: [
      { field: 'sent_at', label: 'Sent', update: 'no', width: '120px' , listLayout: 'footer' },
      { field: 'subject', update: 'no', multiline: true, width: '320px' , listLayout: 'title' },
      { field: 'from', update: 'no', width: '200px' , listLayout: 'subtitle' },
      { field: 'to_emails', label: 'Recipients', update: 'no', maxArrayEntries: 2, multiline: true, width: '240px' , listLayout: 'body' },
      { field: 'cc_emails', label: 'CC', update: 'no', maxArrayEntries: 2, multiline: true, width: '200px' , listLayout: 'body' },
      { field: 'is_private', label: 'Private?', width: '90px' , listLayout: 'badge' },
    ] as const,
    rowActions: ['view_in_modal', 'toggle_private_public', 'email'] as const,
  },

  gCal: {
    title: 'gCal',
    orderBy: [{ column: 'start_time', ascending: false }] as const,
    cardLimit: 50,
    readSource: 'yg_events_with_people_ids_mv',
    writeDefaults: {table: 'yg_events', pkColumn: 'id' },
    columns: [
      { field: 'summary', update: 'no', listLayout: 'title' },
      { field: 'start_time', update: 'no', listLayout: 'body' },
      { field: 'attendees', update: 'no', listLayout: 'body' },
      { field: 'is_private', label: 'Private?', listLayout: 'badge' },
    ] as const,
    rowActions: ['view_in_modal', 'toggle_private_public'] as const,
  },

  actionSteps: {
    title: 'Action Steps',
    orderBy: [{ column: 'assigned_date', ascending: false }] as const,
    cardLimit: 50,
    readSource: 'action_steps',
    columns: [
      { field: 'item', label: 'Item', multiline: true , listLayout: 'title' },
      { field: 'assignee', label: 'Assignee', lookupTable: 'guides', listLayout: 'subtitle' },
      { field: 'item_status', label: 'Status', listLayout: 'badge' },
      { field: 'assigned_date', label: 'Assigned Date', listLayout: 'body' },
      { field: 'due_date', listLayout: 'body' },
      { field: 'completed_date', listLayout: 'body' },
    ] as const,
    rowActions: ['inline_edit', 'view_in_modal', 'toggle_complete', 'archive'] as const,
    tableActions: [{id: 'addActionStep', label: 'Add Action Step'}] as const
  },

  notes: {
    title: 'Notes',
    orderBy: [{ column: 'created_date', ascending: false }] as const,
    cardLimit: 50,
    readSource: 'notes',
    columns: [
      { field: 'title', label: 'Title' , listLayout: 'title'},
      { field: 'full_text', label: 'Text', multiline: true , listLayout: 'body', listFieldFullWidth: true },
      { field: 'created_by', label: 'Created By', lookupTable: 'guides', listLayout: 'subtitle' },
      { field: 'created_date', listLayout: 'footer' },
      { field: 'is_private', label: 'Private?' , listLayout: 'badge' },
    ] as const,
    rowActions: ['inline_edit', 'view_in_modal', 'toggle_private_public', 'archive'] as const,
    tableActions: [{id: 'addNote', label: 'Add Note'}] as const,
  },

  grants: {
    title: 'Grants',
    orderBy: [{ column: 'issue_date', ascending: false }] as const,
    cardLimit: 50,
    readSource: 'grants',
    columns: [
      { field: 'issue_date', listLayout: 'title' },
      { field: 'amount', label: 'Amount', listLayout: 'subtitle' },
      { field: 'grant_status', label: 'Grant Status', listLayout: 'body' },
      { field: 'ready_to_accept_flag', label: 'Ready to Accept?', listLayout: 'body' },
      { field: 'ready_to_issue_letter_flag', label: 'Ready to Issue Letter?', listLayout: 'body' },
    ] as const,
    rowActions: ['inline_edit', 'view_in_modal','archive'] as const,
    tableActions: [{id: 'addGrant', label: 'Add Grant'}] as const,
  },

  loans: {
    title: 'Loans',
    orderBy: [{ column: 'issue_date', ascending: false }] as const,
    cardLimit: 50,
    readSource: 'loans',
    write: false,
    columns: [
      { field: 'issue_date', listLayout: 'title' },
      { field: 'amount_issued', label: 'Amount', listLayout: 'subtitle' },
      { field: 'maturity', label: 'Maturity', listLayout: 'body' },
      { field: 'interest_rate', label: 'Interest Rate', listLayout: 'body' },
      { field: 'loan_status', label: 'Loan Status', listLayout: 'body' },
      { field: 'vehicle', label: 'Vehicle', listLayout: 'body' },
      { field: 'use_of_proceeds', label: 'Use of Proceeds', listLayout: 'body' },
      { field: 'loan_docs', label: 'Loan Docs', attachment: true, listLayout: 'attachment' },
    ] as const,
    rowActions: ['view_in_modal'] as const,
  },

  governanceDocs: {
    title: 'Governance Docs',
    orderBy: [{ column: 'upload_date', ascending: false }] as const,
    cardLimit: 50,
    readSource: 'governance_docs',
    columns: [
      { field: 'doc_type', label: 'Document Type', lookupTable: 'zref_gov_docs', linkToAttachmentArray: 'governance_doc_public_urls', listLayout: 'title'},
      { field: 'upload_date', label: 'Upload Date' , listLayout: 'subtitle'},
      { field: 'governance_doc_public_urls', label: 'Files', type: 'attachmentArray', visibility: 'suppress' },
      { field: 'governance_doc_object_ids', label: 'File IDs', visibility: 'suppress' },
    ] as const,
    rowActions: ['view_in_modal', 'archive'] as const,
    tableActions: [{id: 'addGovDoc', label: 'Add Document'}] as const,
  },

  nineNineties: {
    title: '990s',
    orderBy: [{ column: 'form_year', ascending: false }] as const,
    cardLimit: 50,
    readSource: 'nine_nineties',
    columns: [
      { field: 'form_year', label: 'Year', linkToAttachmentArray: 'nine_nineties_public_urls' , listLayout: 'title'},
      { field: 'nine_nineties_public_urls', label: 'Files', type: 'attachmentArray', visibility: 'suppress' },
      { field: 'nine_nineties_object_ids', label: 'File IDs', visibility: 'suppress' },
    ] as const,
    rowActions: ['view_in_modal', 'archive'] as const,
    tableActions: [{id: 'addNineNinety', label: 'Add 990'}] as const,
  },

  reports: {
    title: 'School Reports & Submissions',
    orderBy: [{ column: 'school_year', ascending: false }] as const,
    cardLimit: 50,
    readSource: 'school_reports_and_submissions',
    columns: [
      { field: 'school_year', lookupTable: 'zref_school_years', listLayout: 'subtitle'},
      { field: 'report_type', label: 'Report Type', linkToAttachment: 'object_id', listLayout: 'title'}
    ] as const,
    rowActions: ['view_in_modal','archive'] as const,
    tableActions: [{id: 'addReport', label: 'Add Report'}] as const,
  },

  assessments: {
    title: 'Assessments & Metrics',
    orderBy: [{ column: 'school_year', ascending: false }] as const,
    cardLimit: 50,
    readSource: 'annual_assessment_and_metrics_data',
    columns: [
      { field: 'school_year', lookupTable: 'zref_school_years', listLayout: 'subtitle'},
      { field: 'assessment_or_metric', label: 'Assessment/Metric', listLayout: 'title'},
      { field: 'metric_data', label: 'Value', listLayout: 'body'},
      { field: 'assessed_total', label: 'Assessed Total', listLayout: 'body'},
      { field: 'met_plus_total', label: 'Met Plus Total', listLayout: 'body'},

    ] as const,
    rowActions: ['view_in_modal','archive'] as const,
    tableActions: [{id: 'addData', label: 'Add Data'}] as const,
  },

  enrollment: {
    title: 'Enrollment',
    orderBy: [{ column: 'school_year', ascending: false }] as const,
    cardLimit: 50,
    readSource: 'annual_enrollment_and_demographics',
    columns: [
      { field: 'school_year', lookupTable: 'zref_school_years', listLayout: 'title'},
      { field: 'enrolled_students_total', label: 'Total Students', listLayout: 'body' },
      { field: 'enrolled_frl', label: 'Free/Reduced Lunch', listLayout: 'body' },
      { field: 'enrolled_ell', label: 'ELL', listLayout: 'body' },
      { field: 'enrolled_sped', label: 'SPED', listLayout: 'body' },
      { field: 'enrolled_bipoc', label: 'BIPOC', listLayout: 'body' },
    ] as const,
    rowActions: ['inline_edit', 'view_in_modal','archive'] as const,
    tableActions: [{id: 'addEnrollmentData', label: 'Add Data'}] as const,
  },

  guideAssignments: {
    title: 'Guide Assignments',
    orderBy: [{ column: 'start_date', ascending: false }] as const,
    cardLimit: 50,
    readSource: 'guide_assignments',
    columns: [
      { field: 'email_or_name', label: 'Email or Name', lookupTable: 'guides', listLayout: 'title'},
      { field: 'type', label: 'Type', listLayout: 'subtitle'},
      { field: 'start_date', listLayout: 'body'},
      { field: 'end_date', listLayout: 'body'},
      { field: 'is_active', label: 'Active?' , listLayout: 'badge'},
    ] as const,
    rowActions: ['inline_edit', 'view_in_modal', 'jump_to_modal', 'end_stint', 'archive'] as const,
    tableActions: [{id: 'addGuideLink', label: 'Assign Guide'}, {id: 'addNewGuide', label: 'Add Guide & Assignment'}] as const,
    toggles: [ { id: 'active', label: 'Active only', expr: { eq: { column: 'is_active', value: true } }, defaultOn: true } ],
  },

  boardMembers: {
    title: 'Board Members',
    orderBy: [{ column: 'start_date', ascending: false }] as const,
    cardLimit: 50,
    readSource: 'details_associations',
    readFilter: { eq: { column: 'show_in_board_tables', value: true } },
    writeDefaults: { table: 'people_roles_associations', pkColumn: 'id' },
    columns: [
      { field: 'full_name', label: 'Name', listLayout: 'title', update: 'newOnly' },
      { field: 'role', label: 'Role', lookupTable: 'zref_roles', listLayout: 'subtitle' },
      { field: 'start_date', listLayout: 'body' },
      { field: 'end_date', listLayout: 'body' },
      { field: 'is_active', label: 'Active?', listLayout: 'badge' },
    ] as const,
    rowActions: ['inline_edit', 'view_in_modal', 'jump_to_modal', 'end_stint', 'email','archive'] as const,
    tableActions: [{id: 'addPersonToBoard', label: 'Add Person to Board'}, {id: 'addNewPersonToBoard', label: 'Add New Person to Board'}] as const,
  },

  advice: {
    title: 'Advice',
    orderBy: [{ column: 'advice_requested_date', ascending: false }] as const,
    cardLimit: 50,
    readSource: 'advice',
    writeDefaults: { table: 'advice', pkColumn: 'id' },
    columns: [
      { field: 'advice_giver', label: 'Advice Giver', lookupTable: 'people', listLayout: 'title'},
      { field: 'advice_requested_date', label: 'Requested Date', listLayout: 'body' },
      { field: 'advice_given_date', label: 'Given Date', listLayout: 'body' },
      { field: 'advice_text', label: 'Advice Text', multiline: true, listLayout: 'body' },
      { field: 'advice_doc', label: 'Advice Document', listLayout: 'attachment', attachment: true },
    ] as const,
    rowActions: ['view_in_modal', 'archive'] as const
  },

  educatorEmails: {
    title: 'Email Addresses',
    orderBy: [{ column: 'is_primary', ascending: false }, { column: 'email_address', ascending: true }] as const,
    cardLimit: 50,
    readSource: 'email_addresses',  
    columns: [
      { field: 'email_address', label: 'Email Address', listLayout: 'title' },
      { field: 'category', label: 'Category', listLayout: 'subtitle' },
      { field: 'is_primary', label: 'Primary?', listLayout: 'badge' },
      { field: 'is_valid', label: 'Valid?', listLayout: 'badge' },
    ] as const,
    rowActions: ['inline_edit', 'make_primary', 'toggle_valid', 'email','archive'] as const,
    tableActions: [{id: 'addEmail', label: 'Add Email'}] as const,
  },

  educatorMontessoriCerts: {
    title: 'Montessori Certifications',
    orderBy: [{ column: 'year', ascending: false }] as const,
    cardLimit: 50,
    readSource: 'montessori_certs',
    columns: [
      { field: 'year', label: 'Year', listLayout: 'subtitle'},
      { field: 'association', label: 'Association', listLayout: 'body'},
      { field: 'cert_level', label: 'Level', lookupTable: 'zref_certifications', listLayout: 'title' },
      { field: 'cert_completion_status', label: 'Status', listLayout: 'badge'},
      { field: 'macte_accredited', label: 'MACTE?', listLayout: 'badge'},
      { field: 'trainer', label: 'Trainer', listLayout: 'body'},
      { field: 'training_center', label: 'Training Center', listLayout: 'body'},
      { field: 'admin_credential', label: 'Admin Credential?', listLayout: 'body'},
      { field: 'assistant_training', label: 'Assistant Training?', listLayout: 'body'},
    ] as const,
    rowActions: ['inline_edit', 'view_in_modal', 'archive'] as const,
    tableActions: [{id: 'addTraining', label: 'Add Certification'}] as const,
  },

  educatorEvents: {
    title: 'Events',
    orderBy: [{ column: 'event_date', ascending: false }] as const,
    cardLimit: 50,
    readSource: 'event_attendance',
    columns: [
      { field: 'event_name', label: 'Event Name', lookupTable: 'event_list', listLayout: 'title' },
    //  { field: 'event_date', label: 'Event Date'},
      { field: 'attended_event', label: 'Attended?', listLayout: 'badge' },
      { field: 'registration_date', label: 'Registration Date' , listLayout: 'body'},
    ] as const,
    rowActions: ['inline_edit', 'view_in_modal', 'archive'] as const,
    tableActions: [{id: 'addEvent', label: 'Add Attendance at Event'}] as const,
  },

  locations: {
    title: 'Locations',
    orderBy: [{ column: 'start_date', ascending: false }] as const,
    cardLimit: 50,
    readSource: 'locations',
    columns: [
      { field: 'address', label: 'Address', multiline: true, listLayout: 'title' },
      { field: 'start_date', listLayout: 'body' },
      { field: 'end_date', listLayout: 'body' },
      { field: 'current_mail_address', label: 'Current Mail Address?', listLayout: 'badge' },
      { field: 'current_physical_address', label: 'Current Physical Address?', listLayout: 'badge' },
    ] as const,
    rowActions: ['inline_edit','view_in_modal', 'end_occupancy', 'archive'] as const,
    tableActions: [{id: 'addLocation', label: 'Add Location'}] as const,
    toggles: [ { id: 'current', label: 'Current only', expr: { or: [ { eq: { column: 'current_physical_address', value: true } }, { eq: { column: 'current_mail_address', value: true } } ] }, defaultOn: true } ],
  }
};

export type TablePresetId = keyof typeof TABLE_LIST_PRESETS;
