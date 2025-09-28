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
    { field: 'doc_type', label: 'Document Type', type: 'string', lookup: { table: 'ref_gov_docs', valueColumn: 'value', labelColumn: 'value' } },
    { field: 'pdf', label: 'PDF', type: 'attachment' },
  ],

  nine_nineties: [
    { field: 'form_year', label: 'Year', type: 'string', lookup: { table: 'school_years', valueColumn: 'starting_calendar_year', labelColumn: 'starting_calendar_year' } },
    { field: 'pdf', label: 'Document', type: 'attachment' },
  ],

  enrollment: [
    { field: 'school_year', label: 'School Year', type: 'string' , lookup: { table: 'ref_school_years', valueColumn: 'value', labelColumn: 'value' }  },
    { field: 'enrolled_students_total', label: 'Total Students', type: 'number' },
    { field: 'enrolled_frl', label: 'Free/Reduced Lunch', type: 'number' },
    { field: 'enrolled_ell', label: 'ELL', type: 'number' },
    { field: 'enrolled_sped', label: 'SPED', type: 'number' },
    { field: 'enrolled_bipoc', label: 'BIPOC', type: 'number' },
  ],

  guideAssignments: [
    { field: 'email_or_name', label: 'Email or Name', type: 'string' , lookup: { table: 'guides', valueColumn: 'email_or_name', labelColumn: 'email_or_name' }  },
    { field: 'type', label: 'Type', type: 'enum', enumName: 'guide_types' },
    { field: 'start_date', label: 'Start Date', type: 'date' },
    { field: 'end_date', label: 'End Date', type: 'date' },
    { field: 'is_active', label: 'Active?', type: 'boolean' },
  ]
};

export const TABLE_PRESETS = {
  // Charter module presets
  charterAuthorizerActions: {
    readSource: { table: 'charter_authorization_actions', fkColumn: 'charter_id' },
    writeDefaults: { table: 'charter_authorization_actions', pkColumn: 'id' },
    columns: [
      { field: 'action', label: 'Action', type: 'string' },
      { field: 'action_date', label: 'Action Date', type: 'date' },
      { field: 'authorized_after_action', label: 'Authorized After?', type: 'boolean' },
    ] as const,
    rowActions: ['view_in_modal'] as const,
  },


  charterEducators: {
    readSource: { table: 'details_associations', fkColumn: 'charter_id' },
    writeDefaults: { table: 'people_roles_associations', pkColumn: 'id' },
    columns: [
      { field: 'school_name', label: 'School', type: 'string' , update: 'newOnly'},
      ...TABLE_COLUMNS.educators,
    ] as const,
    rowActions: ['inline_edit', 'view_in_modal', 'jump_to_modal', 'end_stint', 'email', 'add_note','add_task','archive'] as const,
  },



  charterSchools: {
    readSource: { table: 'details_associations', fkColumn: 'charter_id' },
    writeDefaults: { table: 'people_roles_associations', pkColumn: 'id' },
    columns: [
      { field: 'full_name', label: 'Educator', type: 'string', update: 'newOnly' },
      ...TABLE_COLUMNS.schools
    ],
    rowActions: ['inline_edit', 'view_in_modal', 'jump_to_modal', 'end_stint', 'add_note','add_task','archive'] as const,
  },


  charterGmails: {
    readSource: { schema: 'gsync', table: 'g_emails_with_people_ids_mv', fkColumn: 'charter_id' },
    writeDefaults: { schema: 'gsync', table: 'g_emails_with_people_ids_mv', pkColumn: 'id' },
    columns: [...TABLE_COLUMNS.gmails] as const,
    rowActions: ['view_in_modal', 'toggle_private_public', 'email'] as const,
  },



  charterCalendarEvents: {
    readSource: { schema: 'gsync', table: 'g_events_with_people_ids_mv', fkColumn: 'charter_id' },
    writeDefaults: { schema: 'gsync', table: 'g_events_with_people_ids_mv', pkColumn: 'id' },
    columns: [...TABLE_COLUMNS.calendarEvents] as const,
    rowActions: ['view_in_modal', 'toggle_private_public'] as const,
  },



  charterActionSteps: {
    readSource: { table: 'action_steps', fkColumn: 'charter_id' },
    writeDefaults: { table: 'action_steps', pkColumn: 'id' },
    columns: [...TABLE_COLUMNS.actionSteps] as const,
    rowActions: ['inline_edit', 'view_in_modal', 'toggle_complete', 'archive'] as const,
    tableActions: ['addActionStep'] as const,
    tableActionLabels: ['Add Action Step'] as const,
  },



  charterNotes: {
    readSource: { table: 'notes', fkColumn: 'charter_id' },
    writeDefaults: { table: 'notes', pkColumn: 'id' },
    columns: [...TABLE_COLUMNS.notes] as const,
    rowActions: ['inline_edit', 'view_in_modal', 'toggle_private_public', 'archive'] as const,
    tableActions: ['addNote'] as const,
    tableActionLabels: ['Add Note'] as const,
  },

  // Charter recurring tables


  charterGrants: {
    readSource: { table: 'grants', fkColumn: 'charter_id' },
    writeDefaults: { table: 'grants', pkColumn: 'id' },
    columns: [...TABLE_COLUMNS.grants] as const,
    rowActions: ['inline_edit', 'view_in_modal','archive'] as const,
    tableActions: ['addGrant'] as const,
    tableActionLabels: ['Add Grant'] as const,
  },


  charterLoans: {
    readSource: { table: 'loans', fkColumn: 'charter_id' },
    writeDefaults: { table: 'loans', pkColumn: 'id' },
    columns: [...TABLE_COLUMNS.loans] as const,
    rowActions: ['view_in_modal'] as const,
    tableActionLabels: [] as const,
  },


  charterGovernanceDocs: {
    readSource: { table: 'governance_docs', fkColumn: 'charter_id' },
    writeDefaults: { table: 'governance_docs', pkColumn: 'id' },
    columns: [...TABLE_COLUMNS.governance_docs] as const,
    rowActions: ['view_in_modal', 'archive'] as const,
    tableActions: ['addGovDoc'] as const,
    tableActionLabels: ['Add Document'] as const,
  },



  charterNineNineties: {
    readSource: { table: 'nine_nineties', fkColumn: 'charter_id' },
    writeDefaults: { table: 'nine_nineties', pkColumn: 'id' },
    columns: [...TABLE_COLUMNS.nine_nineties] as const,
    rowActions: ['view_in_modal', 'archive'] as const,
    tableActions: ['addNineNinety'] as const,
    tableActionLabels: ['Add 990'] as const,
  },

  charterReports: {
    readSource: { table: 'school_reports_and_submissions', fkColumn: 'charter_id' },
    writeDefaults: { table: 'school_reports_and_submissions', pkColumn: 'id' },
    columns: [
      { field: 'school_year', label: 'School Year', type: 'string', lookup: { table: 'ref_school_years', valueColumn: 'value', labelColumn: 'value' } },
      { field: 'report_type', label: 'Report Type', type: 'string' },
      { field: 'attachment', label: 'Attachment', type: 'attachment' },
    ] as const,
    rowActions: ['view_in_modal','archive'] as const,
    tableActions: ['addReport'] as const,
    tableActionLabels: ['Add Report'] as const,
  },

  charterAnnualData: {
    readSource: { table: 'annual_assessment_and_metrics_data', fkColumn: 'charter_id' },
    writeDefaults: { table: 'annual_assessment_and_metrics_data', pkColumn: 'id' },
    columns: [
      { field: 'school_year', label: 'School Year', type: 'string', lookup: { table: 'ref_school_years', valueColumn: 'value', labelColumn: 'value' } },
      { field: 'assessment_or_metric', label: 'Assessment/Metric', type: 'string' , lookup: { table: 'ref_assessments_and_metrics', valueColumn: 'value', labelColumn: 'value' }  },
      { field: 'metric_data', label: 'Value', type: 'string' },
    ] as const,
    rowActions: ['view_in_modal','archive'] as const,
    tableActions: ['addData'] as const,
    tableActionLabels: ['Add Data'] as const,
  },

  charterEnrollment: {
    readSource: { table: 'annual_enrollment_and_demographics', fkColumn: 'charter_id' },
    writeDefaults: { table: 'annual_enrollment_and_demographics', pkColumn: 'id' },
    columns: [...TABLE_COLUMNS.enrollment] as const,
    rowActions: ['inline_edit', 'view_in_modal','archive'] as const,
    tableActions: ['addEnrollmentData'] as const,
    tableActionLabels: ['Add Data'] as const,
  },

  charterGuideAssignments: {
    readSource: { table: 'guide_assignments', fkColumn: 'charter_id' },
    writeDefaults: { table: 'guide_assignments', pkColumn: 'id' },
    columns: [...TABLE_COLUMNS.guideAssignments] as const,
    rowActions: ['inline_edit', 'view_in_modal', 'jump_to_modal', 'end_stint', 'archive'] as const,
    tableActions: ['addGuideLink', 'addNewGuide'] as const,
    tableActionLabels: ['Assign Guide', 'Add Guide & Assignment'] as const,
  },

  // Educator module presets
  educatorEmails: {
    readSource: { table: 'email_addresses', fkColumn: 'people_id' },
    writeDefaults: { table: 'email_addresses', pkColumn: 'id' },
    columns: [
      { field: 'email_address', label: 'Email Address', type: 'string' },
      { field: 'category', label: 'Category', type: 'enum', enumName: 'email_address_categories' },
      { field: 'is_primary', label: 'Primary?', type: 'boolean' },
      { field: 'is_valid', label: 'Valid?', type: 'boolean' },
    ] as const,
    rowActions: ['inline_edit', 'make_primary', 'toggle_valid', 'email','archive'] as const,
    tableActions: ['addEmail'] as const,
    tableActionLabels: ['Add Email'] as const,
  },

  educatorSchools: {
    readSource: { table: 'details_associations', fkColumn: 'people_id' },
    writeDefaults: { table: 'people_roles_associations', pkColumn: 'id' },
    columns: [...TABLE_COLUMNS.schools] as const,
    rowActions: ['inline_edit', 'view_in_modal', 'jump_to_modal', 'end_stint', 'archive'] as const,
    tableActions: ['addStintAtSchool', 'addSchoolAndStint'] as const,
    tableActionLabels: ['Add Role at School', 'Add School & Role'] as const,
  },

  educatorMontessoriCerts: {
    readSource: { table: 'montessori_certs', fkColumn: 'people_id' },
    writeDefaults: { table: 'montessori_certs', pkColumn: 'id' },
    columns: [
      { field: 'year', label: 'Year', type: 'string' },
      { field: 'association', label: 'Association', type: 'enum', enumName: 'montessori_associations' },
      { field: 'cert_level', label: 'Status', type: 'enum', enumName: 'age_spans_rev' },
      { field: 'cert_completion_status', label: 'Status', type: 'enum', enumName: 'certification_completion_status' },
      { field: 'macte_accredited', label: 'MACTE?', type: 'boolean' },
      { field: 'trainer', label: 'Trainer', type: 'string' },
      { field: 'training_center', label: 'Training Center', type: 'string' },
      { field: 'admin_credential', label: 'Admin Credential?', type: 'boolean' },
      { field: 'assistant_training', label: 'Assistant Training?', type: 'boolean' },
    ] as const,
    rowActions: ['inline_edit', 'view_in_modal', 'archive'] as const,
    tableActions: ['addTraining'] as const,
    tableActionLabels: ['Add Certification'] as const,
  },

  educatorEvents: {
    readSource: { table: 'event_attendance', fkColumn: 'people_id' },
    writeDefaults: { table: 'event_attendance', pkColumn: 'id' },
    columns: [
      { field: 'event_name', label: 'Event Name', type: 'string', lookup: { table: 'event_list', valueColumn: 'event_name', labelColumn: 'event_name' } },
      { field: 'event_date', label: 'Event Date', type: 'date' },
      { field: 'attended_event', label: 'Attended?', type: 'boolean' },
      { field: 'registration_date', label: 'Registration Date', type: 'date' },
    ] as const,
    rowActions: ['inline_edit', 'view_in_modal', 'archive'] as const,
    tableActions: ['addEvent'] as const,
    tableActionLabels: ['Add Attendance at Event'] as const,
  },

  educatorActionSteps: {
    readSource: { table: 'action_steps', fkColumn: 'people_id' },
    writeDefaults: { table: 'action_steps', pkColumn: 'id' },
    columns: [...TABLE_COLUMNS.actionSteps] as const,
    rowActions: ['inline_edit', 'view_in_modal', 'toggle_complete', 'archive'] as const,
    tableActions: ['addActionStep'] as const,
    tableActionLabels: ['Add Action Step'] as const,
  },

  educatorNotes: {
    readSource: { table: 'notes', fkColumn: 'people_id' },
    writeDefaults: { table: 'notes', pkColumn: 'id' },
    columns: [...TABLE_COLUMNS.notes] as const,
    rowActions: ['inline_edit', 'view_in_modal', 'toggle_private_public', 'archive'] as const,
    tableActions: ['addNote'] as const,
    tableActionLabels: ['Add Note'] as const,
  },

  educatorGmails: {
    readSource: { schema: 'gsync', table: 'g_emails_with_people_ids_mv', fkColumn: 'people_id' },
    writeDefaults: { schema: 'gsync', table: 'g_emails_with_people_ids_mv', pkColumn: 'id' },
    columns: [...TABLE_COLUMNS.gmails] as const,
    rowActions: ['view_in_modal', 'toggle_private_public','email'] as const,
  },

  educatorCalendarEvents: {
    readSource: { schema: 'gsync', table: 'g_events_with_people_ids_mv', fkColumn: 'people_id' },
    writeDefaults: { schema: 'gsync', table: 'g_events_with_people_ids_mv', pkColumn: 'id' },
    columns: [...TABLE_COLUMNS.calendarEvents] as const,
    rowActions: ['view_in_modal', 'toggle_private_public'] as const,
  },

  // School module presets
  schoolNotes: {
    readSource: { table: 'notes', fkColumn: 'school_id' },
    writeDefaults: { table: 'notes', pkColumn: 'id' },
    columns: [...TABLE_COLUMNS.notes] as const,
    rowActions: ['inline_edit', 'view_in_modal', 'toggle_private_public','archive'] as const,
    tableActions: ['addNote'] as const,
    tableActionLabels: ['Add Note'] as const,
  },

  schoolGmails: {
    readSource: { schema: 'gsync', table: 'g_emails_with_people_ids_mv', fkColumn: 'school_id' },
    writeDefaults: { schema: 'gsync', table: 'g_emails_with_people_ids_mv', pkColumn: 'id' },
    columns: [...TABLE_COLUMNS.gmails] as const,
    rowActions: ['view_in_modal', 'toggle_private_public','email'] as const,
  },

  schoolCalendarEvents: {
    readSource: { schema: 'gsync', table: 'g_events_with_people_ids_mv', fkColumn: 'school_id' },
    writeDefaults: { schema: 'gsync', table: 'g_events_with_people_ids_mv', pkColumn: 'id' },
    columns: [...TABLE_COLUMNS.calendarEvents] as const,
    rowActions: ['view_in_modal', 'toggle_private_public'] as const,
  },

  schoolEducators: {
    readSource: { table: 'details_associations', fkColumn: 'school_id' },
    writeDefaults: { table: 'people_roles_associations', pkColumn: 'id' },
    columns: [...TABLE_COLUMNS.educators] as const,
    rowActions: ['inline_edit', 'view_in_modal', 'jump_to_modal', 'end_stint', 'email','archive'] as const,
    tableActions: ['addExistingEducatorToSchool','addNewEducatorToSchool'] as const,
    tableActionLabels: ['Add Existing Educator','Add New Educator'] as const,
  },

  // School recurring tables
  schoolGrants: {
    readSource: { table: 'grants', fkColumn: 'school_id' },
    writeDefaults: { table: 'grants', pkColumn: 'id' },
    columns: [...TABLE_COLUMNS.grants] as const,
    rowActions: ['inline_edit', 'view_in_modal', 'archive'] as const,
    tableActions: ['addGrant'] as const,
    tableActionLabels: ['Add Grant'] as const,
  },

  schoolLoans: {
    readSource: { table: 'loans', fkColumn: 'school_id' },
    writeDefaults: { table: 'loans', pkColumn: 'id' },
    columns: [...TABLE_COLUMNS.loans] as const,
    rowActions: ['view_in_modal'] as const,
    tableActionLabels: [] as const,
  },

  schoolLocations: {
    readSource: { table: 'locations', fkColumn: 'school_id' },
    writeDefaults: { table: 'locations', pkColumn: 'id' },
    columns: [
      { field: 'address', label: 'Address', type: 'string', multiline: true },
      { field: 'start_date', label: 'Start Date', type: 'date' },
      { field: 'end_date', label: 'End Date', type: 'date' },
      { field: 'current_mail_address', label: 'Current Mail Address?', type: 'boolean' },
      { field: 'current_physical_address', label: 'Current Physical Address?', type: 'boolean' },
    ] as const,
    rowActions: ['inline_edit','view_in_modal', 'end_occupancy', 'archive'] as const,
    tableActions: ['addLocation'] as const,
    tableActionLabels: ['Add Location'] as const,
  },

  schoolGovernanceDocs: {
    readSource: { table: 'governance_docs', fkColumn: 'school_id' },
    writeDefaults: { table: 'governance_docs', pkColumn: 'id' },
    columns: [...TABLE_COLUMNS.governance_docs] as const,
    rowActions: ['inline_edit', 'view_in_modal'] as const,
    tableActions: ['addDocument'] as const,
    tableActionLabels: ['Add Document'] as const,
  },

  schoolNineNineties: {
    readSource: { table: 'nine_nineties', fkColumn: 'school_id' },
    writeDefaults: { table: 'nine_nineties', pkColumn: 'id' },
    columns: [...TABLE_COLUMNS.nine_nineties] as const,
    rowActions: ['archive'] as const,
    tableActions: ['addNineNinety'] as const,
    tableActionLabels: ['Add 990'] as const,
  },

  schoolEnrollment: {
    readSource: { table: 'annual_enrollment_and_demographics', fkColumn: 'school_id' },
    writeDefaults: { table: 'annual_enrollment_and_demographics', pkColumn: 'id' },
    columns: [...TABLE_COLUMNS.enrollment]   as const,
    rowActions: ['inline_edit'] as const,
    tableActions: ['addRecord'] as const,
    tableActionLabels: ['Add Data'] as const,
  },

  schoolGuideAssignments: {
    readSource: { table: 'guide_assignments', fkColumn: 'school_id' },
    writeDefaults: { table: 'guide_assignments', pkColumn: 'id' },
    columns: [...TABLE_COLUMNS.guideAssignments] as const,
    rowActions: ['inline_edit','view_in_modal','jump_to_modal','end_stint','archive'] as const,
    tableActions: ['addGuideLink', 'addNewGuide'] as const,
    tableActionLabels: ['Assign Guide', 'Add Guide & Assignment'] as const,
  },

  schoolActionSteps: {
    readSource: { table: 'action_steps', fkColumn: 'school_id' },
    writeDefaults: { table: 'action_steps', pkColumn: 'id' },
    columns: [...TABLE_COLUMNS.actionSteps] as const,
    rowActions: ['inline_edit', 'view_in_modal', 'toggle_complete', 'archive'] as const,
    tableActions: ['addActionStep'] as const,
    tableActionLabels: ['Add Action Step'] as const,
  },
} as const;

export type TablePresetId = keyof typeof TABLE_PRESETS;

