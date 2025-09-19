import type { TableColumnMeta, RowActionId } from './detail-types';
import { TABLE_COLUMNS, TABLE_COLUMN_META, ROW_ACTIONS } from './detail-presets';

export type TablePreset = {
  source: {
    schema?: string;
    table: string;
    fkColumn: string;
  };
  columns: readonly string[];
  columnMeta?: readonly TableColumnMeta[];
  rowActions?: readonly RowActionId[];
  tableActions?: readonly string[];
  tableActionLabels?: readonly string[];
};

export const TABLE_PRESETS = {
  // Charter module presets
  charterAuthorizerActions: {
    source: { table: 'charter_authorization_actions', fkColumn: 'charter_id' },
    columns: ['action', 'action_date', 'authorized_after_action'] as const,
    rowActions: ['view_in_modal'] as const,
  },

  educatorsOnCharters: {
    source: { table: 'details_associations', fkColumn: 'charter_id' },
    columns: [...TABLE_COLUMNS.educatorsOnCharters],
    columnMeta: TABLE_COLUMN_META.educatorsOnCharters,
    rowActions: ['inline_edit', 'view_in_modal', 'end_stint','archive'] as const,
  },

  schoolsOnCharters: {
    source: { table: 'details_associations', fkColumn: 'charter_id' },
    columns: [...TABLE_COLUMNS.schoolsOnCharters],
    columnMeta: TABLE_COLUMN_META.schoolsOnCharters,
    rowActions: ['inline_edit', 'view_in_modal', 'end_stint','archive'] as const,
  },

  charterGmails: {
    source: { schema: 'gsync', table: 'g_emails', fkColumn: 'charter_id' },
    columns: [...TABLE_COLUMNS.gmail],
    columnMeta: TABLE_COLUMN_META.gmail,
    rowActions: [...ROW_ACTIONS.withPrivacy],
  },

  charterCalendarEvents: {
    source: { schema: 'gsync', table: 'g_events', fkColumn: 'charter_id' },
    columns: [...TABLE_COLUMNS.calendarEvents],
    columnMeta: TABLE_COLUMN_META.calendarEvents,
    rowActions: [...ROW_ACTIONS.withPrivacy],
  },

  // Charter recurring tables
  charterGrants: {
    source: { table: 'grants', fkColumn: 'charter_id' },
    columns: [...TABLE_COLUMNS.grants],
    columnMeta: TABLE_COLUMN_META.grants,
    rowActions: ['inline_edit', 'view_in_modal'] as const,
    tableActions: ['addGrant'] as const,
    tableActionLabels: ['Add Grant'] as const,
  },

  charterLoans: {
    source: { table: 'loans', fkColumn: 'charter_id' },
    columns: ['issue_date', 'amount_issued'] as const,
    rowActions: ['view_in_modal'] as const,
    tableActionLabels: [] as const,
  },

  charterGovernanceDocs: {
    source: { table: 'governance_docs', fkColumn: 'charter_id' },
    columns: ['doc_type', 'pdf'] as const,
    rowActions: ['archive'] as const,
    tableActions: ['addGovDoc'] as const,
    tableActionLabels: ['Add Document'] as const,
  },

  charterNineNineties: {
    source: { table: 'nine_nineties', fkColumn: 'charter_id' },
    columns: [...TABLE_COLUMNS.nineNineties],
    columnMeta: TABLE_COLUMN_META.nineNineties,
    rowActions: ['archive'] as const,
    tableActions: ['addNineNinety'] as const,
    tableActionLabels: ['Add 990'] as const,
  },

  charterReports: {
    source: { table: 'school_reports_and_submissions', fkColumn: 'charter_id' },
    columns: ['school_year', 'report_type', 'attachment'] as const,
    rowActions: ['view_in_modal'] as const,
    tableActions: ['addReport'] as const,
    tableActionLabels: ['Add Report'] as const,
  },

  charterAnnualData: {
    source: { table: 'annual_assessment_and_metrics_data', fkColumn: 'charter_id' },
    columns: ['school_year', 'assessment_or_metric', 'metric_data'] as const,
    rowActions: ['view_in_modal'] as const,
    tableActions: ['addData'] as const,
    tableActionLabels: ['Add Data'] as const,
  },

  charterEnrollment: {
    source: { table: 'annual_enrollment_and_demographics', fkColumn: 'charter_id' },
    columns: [...TABLE_COLUMNS.enrollment],
    columnMeta: TABLE_COLUMN_META.enrollment,
    rowActions: ['inline_edit'] as const,
    tableActions: ['addEnrollmentData'] as const,
    tableActionLabels: ['Add Data'] as const,
  },

  charterGuideAssignments: {
    source: { table: 'guide_assignments', fkColumn: 'charter_id' },
    columns: [...TABLE_COLUMNS.guides],
    columnMeta: TABLE_COLUMN_META.guides,
    rowActions: ['inline_edit'] as const,
    tableActions: ['addGuideLink', 'addNewGuide'] as const,
    tableActionLabels: ['Assign Guide', 'Add Guide & Assignment'] as const,
  },

  // Educator module presets
  educatorEmails: {
    source: { table: 'email_addresses', fkColumn: 'people_id' },
    columns: [...TABLE_COLUMNS.emailAddresses],
    columnMeta: TABLE_COLUMN_META.emailAddresses,
    rowActions: ['inline_edit', 'make_primary', 'toggle_valid'] as const,
    tableActions: ['addEmail'] as const,
    tableActionLabels: ['Add Email'] as const,
  },

  educatorSchools: {
    source: { table: 'details_associations', fkColumn: 'people_id' },
    columns: [...TABLE_COLUMNS.schools],
    columnMeta: TABLE_COLUMN_META.schools,
    rowActions: ['inline_edit', 'view_in_modal', 'end_stint', 'archive'] as const,
    tableActions: ['addStintAtSchool', 'addSchoolAndStint'] as const,
    tableActionLabels: ['Add Role at School', 'Add School & Role'] as const,

  },

  educatorMontessoriCerts: {
    source: { table: 'montessori_certs', fkColumn: 'people_id' },
    columns: [...TABLE_COLUMNS.montessoriCerts],
    columnMeta: TABLE_COLUMN_META.montessoriCerts,
    rowActions: ['inline_edit', 'view_in_modal', 'archive'] as const,
    tableActions: ['addTraining'] as const,
    tableActionLabels: ['Add Certification'] as const,
  },

  educatorEvents: {
    source: { table: 'event_attendance', fkColumn: 'people_id' },
    columns: [...TABLE_COLUMNS.events],
    columnMeta: TABLE_COLUMN_META.events,
    rowActions: ['inline_edit'] as const,
    tableActions: ['addEvent'] as const,
    tableActionLabels: ['Add Event Attendance'] as const,
  },

  educatorActionSteps: {
    source: { table: 'action_steps', fkColumn: 'people_id' },
    columns: [...TABLE_COLUMNS.actionSteps],
    columnMeta: TABLE_COLUMN_META.actionSteps,
    rowActions: [...ROW_ACTIONS.actionSteps],
    tableActions: ['addActionStep'] as const,
    tableActionLabels: ['Add Action Step'] as const,
  },

  educatorNotes: {
    source: { table: 'notes', fkColumn: 'people_id' },
    columns: [...TABLE_COLUMNS.notes],
    columnMeta: TABLE_COLUMN_META.notes,
    rowActions: [...ROW_ACTIONS.notes],
    tableActions: ['addNote'] as const,
    tableActionLabels: ['Add Note'] as const,
  },

  educatorGmails: {
    source: { schema: 'gsync', table: 'g_emails', fkColumn: 'people_id' },
    columns: [...TABLE_COLUMNS.gmail],
    columnMeta: TABLE_COLUMN_META.gmail,
    rowActions: [...ROW_ACTIONS.withPrivacy],
  },

  educatorCalendarEvents: {
    source: { schema: 'gsync', table: 'g_events', fkColumn: 'people_id' },
    columns: [...TABLE_COLUMNS.calendarEvents],
    columnMeta: TABLE_COLUMN_META.calendarEvents,
    rowActions: [...ROW_ACTIONS.withPrivacy],
  },

  // School module presets
  schoolNotes: {
    source: { table: 'notes', fkColumn: 'school_id' },
    columns: [...TABLE_COLUMNS.notes],
    columnMeta: TABLE_COLUMN_META.notes,
    rowActions: [...ROW_ACTIONS.notes],
    tableActions: ['addNote'] as const,
    tableActionLabels: ['Add Note'] as const,
  },

  schoolGmails: {
    source: { schema: 'gsync', table: 'g_emails', fkColumn: 'school_id' },
    columns: [...TABLE_COLUMNS.gmail],
    columnMeta: TABLE_COLUMN_META.gmail,
    rowActions: [...ROW_ACTIONS.withPrivacy],
  },

  schoolCalendarEvents: {
    source: { schema: 'gsync', table: 'g_events', fkColumn: 'school_id' },
    columns: [...TABLE_COLUMNS.calendarEvents],
    columnMeta: TABLE_COLUMN_META.calendarEvents,
    rowActions: [...ROW_ACTIONS.withPrivacy],
  },

  // School recurring tables
  schoolGrants: {
    source: { table: 'grants', fkColumn: 'school_id' },
    columns: [...TABLE_COLUMNS.grants],
    columnMeta: TABLE_COLUMN_META.grants,
    rowActions: ['inline_edit', 'view_in_modal', 'archive'] as const,
    tableActions: ['addGrant'] as const,
    tableActionLabels: ['Add Grant'] as const,
  },

  schoolLoans: {
    source: { table: 'loans', fkColumn: 'school_id' },
    columns: [...TABLE_COLUMNS.loans],
    columnMeta: TABLE_COLUMN_META.loans,
    rowActions: ['view_in_modal'] as const,
    tableActionLabels: [] as const,
  },

  schoolLocations: {
    source: { table: 'locations', fkColumn: 'school_id' },
    columns: [...TABLE_COLUMNS.locations],
    columnMeta: TABLE_COLUMN_META.locations,
    rowActions: ['view_in_modal', 'inline_edit', 'end_occupancy', 'archive'] as const,
    tableActions: ['addLocation'] as const,
    tableActionLabels: ['Add Location'] as const,
  },

  schoolGovernanceDocs: {
    source: { table: 'governance_docs', fkColumn: 'school_id' },
    columns: [...TABLE_COLUMNS.governanceDocs],
    columnMeta: TABLE_COLUMN_META.governanceDocs,
    rowActions: ['inline_edit', 'view_in_modal'] as const,
    tableActions: ['addDocument'] as const,
    tableActionLabels: ['Add Document'] as const,
  },

  schoolNineNineties: {
    source: { table: 'nine_nineties', fkColumn: 'school_id' },
    columns: [...TABLE_COLUMNS.nineNineties],
    columnMeta: TABLE_COLUMN_META.nineNineties,
    rowActions: ['archive'] as const,
    tableActions: ['addNineNinety'] as const,
    tableActionLabels: ['Add 990'] as const,
  },

  schoolEnrollment: {
    source: { table: 'annual_enrollment_and_demographics', fkColumn: 'school_id' },
    columns: [...TABLE_COLUMNS.enrollment],
    columnMeta: TABLE_COLUMN_META.enrollment,
    rowActions: ['inline_edit'] as const,
    tableActions: ['addRecord'] as const,
    tableActionLabels: ['Add Data'] as const,
  },

  schoolGuideAssignments: {
    source: { table: 'guide_assignments', fkColumn: 'school_id' },
    columns: [...TABLE_COLUMNS.guides],
    columnMeta: TABLE_COLUMN_META.guides,
    rowActions: ['inline_edit'] as const,
    tableActions: ['addGuideLink', 'addNewGuide'] as const,
    tableActionLabels: ['Assign Guide', 'Add Guide & Assignment'] as const,
  },
} as const;

export type TablePresetId = keyof typeof TABLE_PRESETS;
