import type { ColumnVisibility, GridValueKind, GridColumnConfig, DetailCardBlock, DetailTableBlock, DetailMapBlock, DetailTabSpec as SharedDetailTabSpec } from '../shared/detail-types';

export type { ColumnVisibility, GridValueKind } from '../shared/detail-types';
export type CharterColumnConfig = GridColumnConfig;
export type DetailCardSpec = DetailCardBlock;
export type DetailTableSpec = DetailTableBlock;
export type DetailMapSpec = DetailMapBlock;
export type DetailTabSpec = SharedDetailTabSpec;

export const CHARTER_GRID: CharterColumnConfig[] = [
  { field: 'charter_name', headerName: 'Name', visibility: 'show', order: 1, valueType: 'string', sortKey: true },
  { field: 'status', headerName: 'Status', visibility: 'show', order: 2, valueType: 'select',enumName: 'charter_status', kanbanKey: true },
  { field: 'proj_open', headerName: 'Projected open', visibility: 'show', order: 3, valueType: 'date' },
  { field: 'non_tl_roles', headerName: 'Non-TL leadership', visibility: 'show', order: 4, valueType: 'string' },
  { field: 'initial_target_planes', headerName: 'Target planes', visibility: 'show', order: 5, valueType: 'multi', enumName: 'developmental_planes' },
  { field: 'initial_target_geo', headerName: 'Target geography', visibility: 'show', order: 6, valueType: 'string' },
  { field: 'id', headerName: 'ID', visibility: 'suppress' }
];    

export const CHARTER_KANBAN_CONSTANTS_TABLE = 'ref_charter_statuses';

export const CHARTER_DETAIL_TABS: DetailTabSpec[] = [
  {
    id: 'overview',
    label: 'Overview',
    writeTo: { schema: 'public', table: 'charters', pk: 'id' },
    blocks: [
      { kind: 'card', title: 'Name(s)', fields: ['short_name', 'full_name'], editable: true },
      { kind: 'card', title: 'Status', fields: ['status','membership_status','currently_authorized','authorizer'], editable: false },
      { kind: 'card', title: 'People', fields: ['non_tl_roles'], editable: true },
      { kind: 'card', title: 'Support', fields: ['current_cohort','support_timeline'], editable: false },
      { kind: 'card', title: 'Grants and Loans', fields: ['total_grants_issued', 'total_loans_issued'], editable: false },
      { kind: 'card', title: 'Initial Vision', fields: ['initial_target_geo','initial_target_planes'], editable: true },
    ],
  },
  {
    id: 'details',
    label: 'Details',
    writeTo: { schema: 'public', table: 'charters', pk: 'id' },
    blocks: [
      { kind: 'card', title: 'Legal entity', fields: ['ein','incorp_date','current_fy_end'], editable: true },
      { kind: 'card', title: 'Nonprofit status', fields: ['nonprofit_status','group_exemption_status'], editable: true },
      { kind: 'table', title: 'Authorizer actions', source: { table: 'charter_authorizer_actions', schema: 'public', fkColumn: 'charter_id' }, columns: ['action','action_date','authorized_after_action'], rowActions: ['modal_view'], tableActions: ['addAction'] },
      { kind: 'card', title: 'Other', fields: ['non_discrimination_policy_on_website','school_provided_1023','guidestart_listing_requested','partnership_with_wf', 'first_site_opened_date', 'website'], editable: true },
    ],
  },
  {
    id: 'app_details',
    label: 'Application Details',
    writeTo: { schema: 'public', table: 'charter_applications', pk: 'id' },
    blocks: [
      { kind: 'card', title: 'Overall', fields: ['app_window','authorizer','decision_expected_date','target_open','auth_decision','proj_open_date'], editable: true },
      { kind: 'card', title: 'Requirements', fields: ['loi_required'], editable: true },
      { kind: 'card', title: 'Deadlines', fields: ['loi_deadline', 'loi_submitted','app_deadline','app_submitted'], editable: true },
      { kind: 'card', title: 'Students/Ages', fields: ['num_students','beg_age','end_age'], editable: true },
      { kind: 'card', title: 'Docs', fields: ['loi','landscape_analysis','design_album','application'], editable: true },
      { kind: 'card', title: 'Budgets', fields: ['budget_exercises','budget_final'], editable: true },
      { kind: 'card', title: 'People', fields: ['team'], editable: true }
      { kind: 'card', title: 'Checklist', fields: ['charter_app_roles_set','charter_app_pm_plan_complete','logic_model_complete','comm_engagement_underway'], editable: true },
      { kind: 'card', title: 'Schedule', fields: ['joint_kickoff_meeting_date','internal_support_meeting_date','app_walkthrough_date','capacity_intv_training_date','capacity_intv_proj_complete','capacity_intv_completed_date','design_advice_session_complete','board_membership_signed_date'], editable: true },

  },
  {
    id: 'educators',
    label: 'Educators',
    blocks: [
      { kind: 'table', title: 'Educators', source: { table: 'details_educators', schema: 'public', fkColumn: 'charter_id' }, columns: ['educator_name', 'role_at_school', 'start_date', 'end_date', 'currently_active', 'stage_status'], rowActions: ['inline_edit', 'modal_view', 'end_stint'], tableActions: ['addStint', 'addEducatorAndStint'] },
    ],
  },
  {
    id: 'schools',
    label: 'Schools',
    blocks: [
      { kind: 'table', title: 'Schools', source: { table: 'details_schools', schema: 'public', fkColumn: 'charter_id' }, columns: ['school_name', 'start_date', 'end_date', 'currently_active', 'stage_status'], rowActions: ['inline_edit', 'modal_view', 'end_stint'], tableActions: ['addStint', 'addEducatorAndStint'] },
    ],
  },
  {
    id: 'enrollment',
    label: 'Enrollment',
    blocks: [
      { kind: 'table', title: '', source: { table: 'annual_enrollment_and_demographics', schema: 'public', fkColumn: 'charter_id' }, columns: ['school_year','enrolled_students_total','enrolled_frl','enrolled_bipoc','enrolled_ell','enrolled_sped'],rowActions: ['inline_edit'], tableActions: ['addEnrollmentData'] },
    ],
  },
  {
    id: 'docs',
    label: 'Documents',
    blocks: [
      { kind: 'table', title: 'Governance Docs', source: { table: 'governance_docs', schema: 'public', fkColumn: 'charter_id' }, columns: ['doc_type','pdf'],rowActions: ['archive'], tableActions: ['addGovDoc'] },
      { kind: 'table', title: '990s', source: { table: 'nine_nineties', schema: 'public', fkColumn: 'charter_id' }, columns: ['form_year','pdf'],rowActions: ['archive'], tableActions: ['addSchoolDoc'] },
    ],
  },
  
  {
    id: 'reports_and_results',
    label: 'Reports and Results',
    blocks: [
      { kind: 'table', title: '', source: { table: 'school_reports_and_submissions', schema: 'public', fkColumn: 'charter_id' }, columns: ['school_year','report_type','attachment'],rowActions: ['modal_view'], tableActions: ['addReport'] },
      { kind: 'table', title: '', source: { table: 'annual_assessment_and_metrics_data', schema: 'public', fkColumn: 'charter_id' }, columns: ['school_year','assessment_or_metric','metric_data'],rowActions: ['modal_view'], tableActions: ['addData'] },
    ],
  },
  
  {
    id: 'grant_and_loans',
    label: 'Grants and Loans',
    blocks: [
      { kind: 'table', title: 'Grants', source: { table: 'grants', schema: 'public', fkColumn: 'charter_id' }, columns: ['issue_date','grant_status','amount'],rowActions: ['inline_edit', 'modal_view'], tableActions: ['addGrant'] },
      { kind: 'table', title: 'Loans', source: { table: 'loans', schema: 'public', fkColumn: 'charter_id' }, columns: ['issue_date','amount_issued'],rowActions: ['modal_view']},
    ],
  },
  {
    id: 'guides',
    label: 'Guides',
    blocks: [
      { kind: 'table', title: '', source: { table: 'guide_assignments', schema: 'public', fkColumn: 'charter_id' }, columns: ['email_or_name','type','start_date','end_date', 'active'],rowActions: ['inline_edit'], tableActions: ['addGuideLink','addNewGuide'] },
    ],
  },
  {
    id: 'action_steps',
    label: 'Action Steps',
    blocks: [
      { kind: 'table', title: 'Action Steps', source: { schema: 'public', table: 'action_steps', fkColumn: 'charter_id' }, columns: [...TABLE_COLUMNS.actionSteps], rowActions: [...ROW_ACTIONS.actionSteps], tableActions: [...TABLE_ACTIONS.actionSteps] },
    ],
  },
  {
    id: 'notes',
    label: 'Notes',
    blocks: [
      { kind: 'table', title: 'Notes', source: { schema: 'public', table: 'notes', fkColumn: 'charter_id' }, columns: [...TABLE_COLUMNS.notesWithBody], rowActions: [...ROW_ACTIONS.notesSnake], tableActions: [...TABLE_ACTIONS.notes] },
    ],
  },
  {
    id: 'google_sync',
    label: 'Google Sync',
    writeTo: { schema: 'public', table: 'people', pk: 'id' },
    blocks: [
      { kind: 'card', title: 'Google Sync Settings', fields: ['exclude_from_calendar_logging'], editable: true },
      { kind: 'table', title: 'Gmails', source: { table: 'g_emails', schema: 'gsync', fkColumn: 'charter_id' }, columns: ['sent_at', 'from', 'to_emails', 'cc_emails', 'subject'], rowActions: ['modalView', 'markPrivate'] },
      { kind: 'table', title: 'Calendar Events', source: { table: 'g_events', schema: 'gsync', fkColumn: 'charter_id' }, columns: ['summary', 'start_date', 'attendees'], rowActions: ['modalView', 'markPrivate'] },
    ],
  },
];


