import type {
  ColumnVisibility as ColumnVisibilityBase,
  GridValueKind as GridValueKindBase,
  GridColumnConfig,
  DetailCardBlock,
  DetailMapBlock,
  DetailTableBlock,
  DetailTabSpec as DetailTabConfig,
} from '../shared/detail-types';

export type ColumnVisibility = ColumnVisibilityBase;
export type GridValueKind = GridValueKindBase;
export type SchoolColumnConfig = GridColumnConfig;
export type DetailCardSpec = DetailCardBlock;
export type DetailTableSpec = DetailTableBlock;
export type DetailMapSpec = DetailMapBlock;
export type DetailTabSpec = DetailTabConfig;

export const SCHOOL_GRID: SchoolColumnConfig[] = [
  { field: 'school_name', headerName: 'School', visibility: 'show', order: 1, valueType: 'string', sortKey: true },
  { field: 'stage_status', headerName: 'Stage/Status', visibility: 'show', order: 2, valueType: 'string' },
  { field: 'projected_open', headerName: 'Projected Open', visibility: 'show', order: 3, valueType: 'date' },
  { field: 'membership_status', headerName: 'Membership', visibility: 'show', order: 4, valueType: 'string' },
  { field: 'governance_model', headerName: 'Governance Model', visibility: 'hide', order: 5, valueType: 'string' },
  { field: 'ages_served', headerName: 'Ages Served', visibility: 'hide', order: 6, valueType: 'multi' },
  { field: 'current_guide_name', headerName: 'Guide', visibility: 'hide', order: 7, valueType: 'string' },
  { field: 'current_cohort', headerName: 'Cohort', visibility: 'hide', order: 8, valueType: 'string' },
  { field: 'total_grants_issued', headerName: 'Total Grants Issued', visibility: 'hide', order: 9, valueType: 'number' },
  { field: 'total_loans_issued', headerName: 'Total Loans Issued', visibility: 'hide', order: 10, valueType: 'number' },
  { field: 'id', headerName: 'ID', visibility: 'suppress' },
];

export const SCHOOL_KANBAN_GROUPING_FIELD = 'stage_status';
export const SCHOOL_KANBAN_CONSTANTS_TABLE = 'ref_stage_statuses';

export const SCHOOL_DETAIL_TABS: DetailTabSpec[] = [
  {
    id: 'overview',
    label: 'Overview',
    writeTo: { schema: 'public', table: 'schools', pk: 'id' },
    blocks: [
      { kind: 'map', title: 'Primary Location', fields: ['physical_lat', 'physical_long', 'physical_address'] },
      { kind: 'card', title: 'Identity', fields: ['long_name', 'short_name', 'status', 'membership_status', 'projected_open', 'open_date'], editable: false },
      { kind: 'card', title: 'Highlights', fields: ['current_cohort', 'current_guide_name', 'total_grants_issued', 'total_loans_issued'], editable: false },
      { kind: 'card', title: 'Narrative', fields: ['about', 'about_spanish'], editable: true },
    ],
  },
  {
    id: 'program',
    label: 'Program',
    writeTo: { schema: 'public', table: 'schools', pk: 'id' },
    blocks: [
      { kind: 'card', title: 'Program Model', fields: ['governance_model', 'program_focus', 'institutional_partner', 'ages_served', 'number_of_classrooms', 'enrollment_at_full_capacity'], editable: true },
      { kind: 'card', title: 'Founding & Structure', fields: ['founding_tls', 'charter_id', 'legal_structure', 'incorporation_date', 'ein'], editable: true },
      { kind: 'card', title: 'Risk & Watchlist', fields: ['risk_factors', 'watchlist'], editable: true },
    ],
  },
  {
    id: 'contact',
    label: 'Contact',
    writeTo: { schema: 'public', table: 'schools', pk: 'id' },
    blocks: [
      { kind: 'card', title: 'Contact Info', fields: ['school_email', 'school_phone', 'website', 'domain_name', 'facebook', 'instagram'], editable: true },
      { kind: 'card', title: 'Mailing Address', fields: ['mailing_address'], editable: false },
    ],
  },
  {
    id: 'operations',
    label: 'Operations',
    writeTo: { schema: 'public', table: 'schools', pk: 'id' },
    blocks: [
      { kind: 'card', title: 'Systems', fields: ['school_calendar', 'school_sched', 'planning_album', 'flexible_tuition_model', 'google_voice', 'transparent_classroom', 'admissions_system', 'gusto', 'qbo', 'google_workspace_org_unit_path'], editable: true },
      { kind: 'card', title: 'Finance & Reporting', fields: ['loan_report_name', 'current_fy_end', 'public_funding', 'membership_termination_steps'], editable: true },
    ],
  },
  {
    id: 'ssj',
    label: 'SSJ',
    writeTo: { schema: 'public', table: 'school_ssj_data', pk: 'school_id' },
    blocks: [
      { kind: 'card', title: 'Stage', fields: ['ssj_stage', 'ssj_target_city', 'ssj_target_state', 'ssj_proj_open_school_year'], editable: true },
      { kind: 'card', title: 'Progress', fields: ['entered_visioning_date', 'entered_planning_date', 'entered_startup_date', 'ssj_name_reserved', 'ssj_has_partner'], editable: true },
      { kind: 'card', title: 'Funding', fields: ['ssj_total_startup_funding_needed', 'ssj_amount_raised', 'ssj_gap_in_funding', 'ssj_seeking_wf_funding'], editable: true },
    ],
  },
  {
    id: 'funding',
    label: 'Funding & Support',
    blocks: [
      { kind: 'table', title: 'Grants', source: { schema: 'public', table: 'grants', fkColumn: 'school_id' }, columns: ['issue_date', 'grant_status', 'amount'], rowActions: ['inline_edit', 'view'], tableActions: ['addGrant'] },
      { kind: 'table', title: 'Loans', source: { schema: 'public', table: 'loans', fkColumn: 'school_id' }, columns: ['issue_date', 'amount_issued', 'loan_status'], rowActions: ['view'], tableActions: ['addLoan'] },
      { kind: 'table', title: 'Guide Assignments', source: { schema: 'public', table: 'guide_assignments', fkColumn: 'school_id' }, columns: ['email_or_name', 'type', 'start_date', 'end_date', 'active'], rowActions: ['inline_edit', 'end_assignment'], tableActions: ['addGuide'] },
    ],
  },
  {
    id: 'locations',
    label: 'Locations',
    blocks: [
      { kind: 'table', title: 'Locations', source: { schema: 'public', table: 'locations', fkColumn: 'school_id' }, columns: ['address', 'start_date', 'end_date', 'current_physical_address', 'current_mail_address'], rowActions: ['inline_edit', 'archive'], tableActions: ['addLocation'] },
    ],
  },
  {
    id: 'enrollment',
    label: 'Enrollment',
    blocks: [
      { kind: 'table', title: 'Enrollment & Demographics', source: { schema: 'public', table: 'annual_enrollment_and_demographics', fkColumn: 'school_id' }, columns: ['school_year', 'enrolled_students_total', 'enrolled_frl', 'enrolled_bipoc', 'enrolled_ell', 'enrolled_sped'], rowActions: ['inline_edit'], tableActions: ['addEnrollmentRecord'] },
    ],
  },
  {
    id: 'documents',
    label: 'Documents',
    blocks: [
      { kind: 'table', title: 'Governance Docs', source: { schema: 'public', table: 'governance_docs', fkColumn: 'school_id' }, columns: ['doc_type', 'pdf'], rowActions: ['download', 'archive'], tableActions: ['addGovernanceDoc'] },
      { kind: 'table', title: '990 Filings', source: { schema: 'public', table: 'nine_nineties', fkColumn: 'school_id' }, columns: ['form_year', 'pdf'], rowActions: ['download', 'archive'], tableActions: ['addFiling'] },
    ],
  },
  {
    id: 'action_steps',
    label: 'Action Steps',
    blocks: [
      { kind: 'table', title: 'Action Steps', source: { schema: 'public', table: 'action_steps', fkColumn: 'school_id' }, columns: ['item', 'assignee', 'item_status', 'assigned_date', 'due_date', 'completed_date'], rowActions: ['inline_edit', 'mark_complete', 'archive'], tableActions: ['addActionStep'] },
    ],
  },
  {
    id: 'notes',
    label: 'Notes',
    blocks: [
      { kind: 'table', title: 'Notes', source: { schema: 'public', table: 'notes', fkColumn: 'school_id' }, columns: ['created_date', 'created_by', 'note', 'private'], rowActions: ['inline_edit', 'mark_private', 'archive'], tableActions: ['addNote'] },
    ],
  },
];
