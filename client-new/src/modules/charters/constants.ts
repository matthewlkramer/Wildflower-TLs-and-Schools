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
export type CharterColumnConfig = GridColumnConfig;
export type DetailCardSpec = DetailCardBlock;
export type DetailTableSpec = DetailTableBlock;
export type DetailMapSpec = DetailMapBlock;
export type DetailTabSpec = DetailTabConfig;

export const CHARTER_GRID: CharterColumnConfig[] = [
  { field: 'short_name', headerName: 'Charter', visibility: 'show', order: 1, valueType: 'string', sortKey: true },
  { field: 'status', headerName: 'Status', visibility: 'show', order: 2, valueType: 'string' },
  { field: 'target_open', headerName: 'Target Open', visibility: 'show', order: 3, valueType: 'date' },
  { field: 'currently_authorized', headerName: 'Authorized', visibility: 'show', order: 4, valueType: 'boolean' },
  { field: 'membership_status', headerName: 'Membership', visibility: 'hide', order: 5, valueType: 'string' },
  { field: 'initial_target_geo', headerName: 'Target Geography', visibility: 'hide', order: 6, valueType: 'string' },
  { field: 'initial_target_planes', headerName: 'Target Planes', visibility: 'hide', order: 7, valueType: 'multi' },
  { field: 'authorizer_name', headerName: 'Authorizer', visibility: 'hide', order: 8, valueType: 'string' },
  { field: 'support_timeline', headerName: 'Support Timeline', visibility: 'hide', order: 9, valueType: 'string' },
  { field: 'total_grants_issued', headerName: 'Total Grants', visibility: 'hide', order: 10, valueType: 'number' },
  { field: 'total_loans_issued', headerName: 'Total Loans', visibility: 'hide', order: 11, valueType: 'number' },
  { field: 'id', headerName: 'ID', visibility: 'suppress' },
];

export const CHARTER_KANBAN_GROUPING_FIELD = 'status';
export const CHARTER_KANBAN_CONSTANTS_TABLE = 'ref_charter_statuses';

export const CHARTER_DETAIL_TABS: DetailTabSpec[] = [
  {
    id: 'overview',
    label: 'Overview',
    writeTo: { schema: 'public', table: 'charters', pk: 'id' },
    blocks: [
      { kind: 'map', title: 'Primary Location', fields: ['physical_lat', 'physical_long', 'physical_address'] },
      { kind: 'card', title: 'Identity', fields: ['short_name', 'full_name', 'status', 'currently_authorized', 'membership_status'], editable: false },
      { kind: 'card', title: 'Pipeline', fields: ['target_open', 'initial_target_geo', 'initial_target_planes', 'support_timeline'], editable: true },
      { kind: 'card', title: 'Team & Support', fields: ['non_tl_roles', 'current_cohort', 'total_grants_issued', 'total_loans_issued'], editable: false },
    ],
  },
  {
    id: 'details',
    label: 'Details',
    writeTo: { schema: 'public', table: 'charters', pk: 'id' },
    blocks: [
      { kind: 'card', title: 'Legal & Financial', fields: ['ein', 'incorp_date', 'current_fy_end', 'nonprofit_status', 'group_exemption_status', 'partnership_with_wf', 'first_site_opened_date'], editable: true },
      { kind: 'card', title: 'Online Presence', fields: ['website', 'landscape_analysis', 'application'], editable: true },
      { kind: 'card', title: 'Addresses', fields: ['mailing_address'], editable: false },
    ],
  },
  {
    id: 'application',
    label: 'Application',
    blocks: [
      { kind: 'card', title: 'Status', fields: ['app_status', 'most_recent_app', 'app_window', 'app_deadline', 'app_submitted', 'loi_required', 'loi_deadline', 'loi_submitted'], editable: false },
      { kind: 'card', title: 'Planning', fields: ['key_dates', 'milestones', 'team', 'opps_challenges'], editable: false },
      { kind: 'card', title: 'Forecast', fields: ['num_students', 'beg_age', 'end_age', 'odds_authorization', 'odds_on_time_open', 'decision_expected_date', 'target_open'], editable: false },
      { kind: 'card', title: 'Artifacts', fields: ['design_album', 'budget_exercises', 'budget_final', 'loi'], editable: false },
    ],
  },
  {
    id: 'authorizer',
    label: 'Authorizer',
    blocks: [
      { kind: 'card', title: 'Authorizer', fields: ['authorizer_name', 'active'], editable: false },
      { kind: 'card', title: 'Latest Action', fields: ['action', 'action_date', 'currently_authorized', 'membership_status'], editable: false },
    ],
  },
  {
    id: 'schools',
    label: 'Schools',
    blocks: [
      { kind: 'table', title: 'Associated Schools', source: { schema: 'public', table: 'details_schools', fkColumn: 'charter_id' }, columns: ['school_name', 'stage_status', 'projected_open', 'current_cohort', 'current_guide_name'], rowActions: ['inline_edit'], tableActions: ['addSchool'] },
    ],
  },
  {
    id: 'documents',
    label: 'Documents',
    blocks: [
      { kind: 'table', title: 'Governance Docs', source: { schema: 'public', table: 'governance_docs', fkColumn: 'charter_id' }, columns: ['doc_type', 'pdf'], rowActions: ['download', 'archive'], tableActions: ['addGovernanceDoc'] },
      { kind: 'table', title: '990 Filings', source: { schema: 'public', table: 'nine_nineties', fkColumn: 'charter_id' }, columns: ['form_year', 'pdf'], rowActions: ['download', 'archive'], tableActions: ['addFiling'] },
      { kind: 'table', title: 'Reports & Metrics', source: { schema: 'public', table: 'school_reports_and_submissions', fkColumn: 'charter_id' }, columns: ['school_year', 'report_type', 'attachments'], rowActions: ['view'], tableActions: ['addReport'] },
    ],
  },
  {
    id: 'funding',
    label: 'Funding',
    blocks: [
      { kind: 'table', title: 'Grants', source: { schema: 'public', table: 'grants', fkColumn: 'charter_id' }, columns: ['issue_date', 'grant_status', 'amount'], rowActions: ['inline_edit', 'view'], tableActions: ['addGrant'] },
      { kind: 'table', title: 'Loans', source: { schema: 'public', table: 'loans', fkColumn: 'charter_id' }, columns: ['issue_date', 'amount_issued', 'loan_status'], rowActions: ['view'], tableActions: ['addLoan'] },
    ],
  },
  {
    id: 'action_steps',
    label: 'Action Steps',
    blocks: [
      { kind: 'table', title: 'Action Steps', source: { schema: 'public', table: 'action_steps', fkColumn: 'charter_id' }, columns: ['item', 'assignee', 'item_status', 'assigned_date', 'due_date', 'completed_date'], rowActions: ['inline_edit', 'mark_complete', 'archive'], tableActions: ['addActionStep'] },
    ],
  },
  {
    id: 'notes',
    label: 'Notes',
    blocks: [
      { kind: 'table', title: 'Notes', source: { schema: 'public', table: 'notes', fkColumn: 'charter_id' }, columns: ['created_date', 'created_by', 'note', 'private'], rowActions: ['inline_edit', 'mark_private', 'archive'], tableActions: ['addNote'] },
    ],
  },
  {
    id: 'emails',
    label: 'Emails & Events',
    blocks: [
      { kind: 'table', title: 'Gmails', source: { schema: 'gsync', table: 'g_emails', fkColumn: 'charter_id' }, columns: ['sent_at', 'from', 'to_emails', 'subject'], rowActions: ['view', 'mark_private'] },
      { kind: 'table', title: 'Calendar Events', source: { schema: 'gsync', table: 'g_events', fkColumn: 'charter_id' }, columns: ['summary', 'start_date', 'attendees'], rowActions: ['view', 'mark_private'] },
    ],
  },
];
