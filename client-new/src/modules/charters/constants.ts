// Presets are self-contained
import { TABLE_PRESETS } from '../shared/table-presets';
import type { ColumnVisibility, GridValueKind, GridColumnConfig, DetailCardBlock, DetailTableBlock, DetailMapBlock, DetailTabSpec as SharedDetailTabSpec, FieldMetadataMap } from '../shared/detail-types';

export type { ColumnVisibility, GridValueKind } from '../shared/detail-types';
export type CharterColumnConfig = GridColumnConfig;
export type DetailCardSpec = DetailCardBlock;
export type DetailTableSpec = DetailTableBlock;
export type DetailMapSpec = DetailMapBlock;
export type DetailTabSpec = SharedDetailTabSpec;

export const CHARTER_GRID: CharterColumnConfig[] = [
  { field: 'charter_name', headerName: 'Name', visibility: 'show', valueType: 'string', sortKey: true },
  { field: 'status', headerName: 'Status', visibility: 'show', valueType: 'select', enumName: 'charter_status', kanbanKey: true },
  { field: 'proj_open', headerName: 'Projected open', visibility: 'show', valueType: 'date' },
  { field: 'non_tl_roles', headerName: 'Non-TL leadership', visibility: 'show', valueType: 'string' },
  { field: 'initial_target_planes', headerName: 'Target planes', visibility: 'show', valueType: 'multi', lookupField: 'ref_planes.label' },
  { field: 'initial_target_geo', headerName: 'Target geography', visibility: 'show', valueType: 'string' },
  { field: 'schools', headerName: 'Schools', visibility: 'show', valueType: 'multi' },
  { field: 'active_guides', headerName: 'Guides', visibility: 'show', valueType: 'multi' },
  { field: 'id', headerName: 'ID', visibility: 'suppress' }
];    

export const CHARTER_KANBAN_CONSTANTS_TABLE = 'ref_charter_statuses';

export const CHARTER_DETAIL_TABS: DetailTabSpec[] = [
  {
    id: 'overview',
    label: 'Overview',
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
    blocks: [
      { kind: 'card', title: 'Legal entity', fields: ['ein','incorp_date','current_fy_end'], editable: true },
      { kind: 'card', title: 'Nonprofit status', fields: ['nonprofit_status','group_exemption_status'], editable: true },
      { kind: 'table', title: 'Authorizer actions', preset: 'charterAuthorizerActions' },
      { kind: 'card', title: 'Other', fields: ['non_discrimination_policy_on_website','school_provided_1023','guidestart_listing_requested','partnership_with_wf', 'first_site_opened_date', 'website'], editable: true },
    ],
  },
  {
    id: 'app_details',
    label: 'App Details',
    blocks: [
      { kind: 'card', title: 'Overall', fields: ['app_window','authorizer','decision_expected_date','target_open','auth_decision','proj_open_date'], editable: true },
      { kind: 'card', title: 'Requirements', fields: ['loi_required'], editable: true },
      { kind: 'card', title: 'Deadlines', fields: ['loi_deadline', 'loi_submitted','app_deadline','app_submitted'], editable: true },
      { kind: 'card', title: 'Students/Ages', fields: ['num_students','beg_age','end_age'], editable: true },
      { kind: 'card', title: 'Docs', fields: ['loi','landscape_analysis','design_album','application'], editable: true },
      { kind: 'card', title: 'Budgets', fields: ['budget_exercises','budget_final'], editable: true },
      { kind: 'card', title: 'People', fields: ['team'], editable: true },
      { kind: 'card', title: 'Checklist', fields: ['charter_app_roles_set','charter_app_pm_plan_complete','logic_model_complete','comm_engagement_underway'], editable: true },
      { kind: 'card', title: 'Schedule', fields: ['joint_kickoff_meeting_date','internal_support_meeting_date','app_walkthrough_date','capacity_intv_training_date','capacity_intv_proj_complete','capacity_intv_completed_date','design_advice_session_complete','board_membership_signed_date'], editable: true },
    ],
  },
  {
    id: 'educators',
    label: 'Educators',
    blocks: [
      { kind: 'table',  preset: 'charterEducators' },
    ],
  },
  {
    id: 'schools',
    label: 'Schools',
    blocks: [
      { kind: 'table', preset: 'charterSchools' },
    ],
  },
  {
    id: 'enrollment',
    label: 'Enrollment',
    blocks: [
      { kind: 'table', preset: 'charterEnrollment' },
    ],
  },
  {
    id: 'docs',
    label: 'Docs',
    blocks: [
      { kind: 'table', title: 'Governance Docs', preset: 'charterGovernanceDocs' },
      { kind: 'table', title: '990s', preset: 'charterNineNineties' },
    ],
  },
  
  {
    id: 'reports_and_results',
    label: 'Reports',
    blocks: [
      { kind: 'table', title: '', preset: 'charterReports' },
      { kind: 'table', title: '', preset: 'charterAnnualData' },
    ],
  },
  
  {
    id: 'grant_and_loans',
    label: 'Grants & Loans',
    blocks: [
      { kind: 'table', title: 'Grants', preset: 'charterGrants' },
      { kind: 'table', title: 'Loans', preset: 'charterLoans' },
    ],
  },
  {
    id: 'guides',
    label: 'Guides',
    blocks: [
      { kind: 'table', preset: 'charterGuideAssignments' },
    ],
  },
  {
    id: 'action_steps',
    label: 'Action Steps',
    blocks: [
      { kind: 'table', preset: 'charterActionSteps' },
    ],
  },
  {
    id: 'notes',
    label: 'Notes',
    blocks: [
      { kind: 'table', preset: 'charterNotes' },
    ],
  },
  {
    id: 'google_sync',
    label: 'gmail/gCal',
    blocks: [
      { kind: 'card', title: 'Google Sync Settings', fields: ['exclude_from_calendar_logging'], editable: true },
      { kind: 'table', title: 'Gmails', preset: 'charterGmails' },
      { kind: 'table', title: 'Calendar Events', preset: 'charterCalendarEvents' },
    ],
  },
];


export const CHARTER_FIELD_METADATA: FieldMetadataMap = {
  'app_walkthrough_date': { label: 'Application Walkthrough Date', type: 'date', edit: { table: 'charter_applications', pk: 'charter_id' } },
  'app_window': { label: 'Application Window', type: 'string', edit: { table: 'charter_applications', pk: 'charter_id' } },
  'application': { label: 'Application Document', type: 'attachment', edit: { table: 'charter_applications', pk: 'charter_id' } },
  'auth_decision': { label: 'Authorization Decision', type: 'string', edit: { table: 'charter_applications', pk: 'charter_id' } },
  'authorizer': { label: 'Authorizer', type: 'string', edit: { table: 'charter_applications', pk: 'charter_id' }, lookup: { table: 'charter_authorizers', valueColumn: 'authorizer_name', labelColumn: 'authorizer_name' } },
  'beg_age': { label: 'Beginning Age', type: 'enum', edit: { table: 'charter_applications', pk: 'charter_id' , enumName: 'ages-grades' } },
  'board_membership_signed_date': { label: 'Board Membership Signed Date', type: 'date', edit: { table: 'charter_applications', pk: 'charter_id' } },
  'budget_exercises': { label: 'Budget Exercises', type: 'attachment', edit: { table: 'charter_applications', pk: 'charter_id' } },
  'budget_final': { label: 'Final Budget', type: 'attachment', edit: { table: 'charter_applications', pk: 'charter_id' } },
  'capacity_intv_completed_date': { label: 'Capacity Interview Completed Date', type: 'date', edit: { table: 'charter_applications', pk: 'charter_id' } },
  'capacity_intv_proj_complete': { label: 'Capacity Interview Projected Complete', type: 'date', edit: { table: 'charter_applications', pk: 'charter_id' } },
  'capacity_intv_training_date': { label: 'Capacity Interview Training Date', type: 'date', edit: { table: 'charter_applications', pk: 'charter_id' } },
  'charter_app_pm_plan_complete': { label: 'PM Plan Complete', type: 'boolean', edit: { table: 'charter_applications', pk: 'charter_id' } },
  'charter_app_roles_set': { label: 'Roles Set', type: 'boolean', edit: { table: 'charter_applications', pk: 'charter_id' } },
  'comm_engagement_underway': { label: 'Community Engagement Underway', type: 'boolean', edit: { table: 'charter_applications', pk: 'charter_id' } },
  'current_fy_end': { label: 'Current Fiscal Year End', type: 'enum', edit: { table: 'charters' , enumName: 'fiscal_year_end'} },
  'currently_authorized': { label: 'Currently Authorized', type: 'boolean', edit: { table: 'charters' } },
  'decision_expected_date': { label: 'Decision Expected Date', type: 'date', edit: { table: 'charter_applications', pk: 'charter_id' } },
  'design_advice_session_complete': { label: 'Design Advice Session Complete', type: 'boolean', edit: { table: 'charter_applications', pk: 'charter_id' } },
  'design_album': { label: 'Design Album', type: 'attachment', edit: { table: 'charter_applications', pk: 'charter_id' } },
  'ein': { label: 'EIN', type: 'string', edit: { table: 'charters' } },
  'end_age': { label: 'Ending Age', type: 'enum', edit: { table: 'charter_applications', pk: 'charter_id', enumName: 'ages-grades' } },
  'first_site_opened_date': { label: 'First Site Opened Date', type: 'date', edit: { table: 'charters' } },
  'full_name': { label: 'Full Name', type: 'string', edit: { table: 'charters' } },
  'group_exemption_status': { label: 'Group Exemption Status', type: 'enum', edit: { table: 'charters' , enumName: 'group_exemption_status'} },
  'guidestart_listing_requested': { label: 'Guidestar Listing Requested', type: 'boolean', edit: { table: 'charters' } },
  'incorp_date': { label: 'Incorporation Date', type: 'date', edit: { table: 'charters' } },
  'initial_target_geo': { label: 'Initial Target Geography', type: 'string', edit: { table: 'charters' } },
  'initial_target_planes': { label: 'Initial Target Planes', type: 'enum', array: true, edit: { table: 'charters' , enumName: 'developmental_planes'} },
  'internal_support_meeting_date': { label: 'Internal Support Meeting Date', type: 'date', edit: { table: 'charter_applications', pk: 'charter_id' } },
  'joint_kickoff_meeting_date': { label: 'Joint Kickoff Meeting Date', type: 'date', edit: { table: 'charter_applications', pk: 'charter_id' } },
  'landscape_analysis': { label: 'Landscape Analysis', type: 'attachment', edit: { table: 'charter_applications', pk: 'charter_id' } },
  'logic_model_complete': { label: 'Logic Model Complete', type: 'boolean', edit: { table: 'charter_applications', pk: 'charter_id' } },
  'loi': { label: 'LOI Document', type: 'attachment', edit: { table: 'charter_applications', pk: 'charter_id' } },
  'loi_deadline': { label: 'LOI Deadline', type: 'date', edit: { table: 'charter_applications', pk: 'charter_id' } },
  'loi_required': { label: 'LOI Required', type: 'boolean', edit: { table: 'charter_applications', pk: 'charter_id' } },
  'loi_submitted': { label: 'LOI Submitted', type: 'date', edit: { table: 'charter_applications', pk: 'charter_id' } },
  'membership_status': { label: 'Membership Status', type: 'string', edit: { table: 'charters' }, lookup: { table: 'ref_membership_statuses', valueColumn: 'value', labelColumn: 'value' } },
  'non_discrimination_policy_on_website': { label: 'Non-Discrimination Policy on Website', type: 'boolean', edit: { table: 'charters' } },
  'non_tl_roles': { label: 'Non-TL Roles', type: 'string', multiline: true, edit: { table: 'charters' } },
  'nonprofit_status': { label: 'Nonprofit Status', type: 'enum', edit: { table: 'charters' , enumName: 'nonprofit_status_rev'} },
  'num_students': { label: 'Projected Students', type: 'number', edit: { table: 'charter_applications', pk: 'charter_id' } },
  'opps_challenges': { label: 'Opportunities & Challenges', type: 'string', multiline: true, edit: { table: 'charter_applications', pk: 'charter_id' } },
  'partnership_with_wf': { label: 'Partnership with WF', type: 'string', edit: { table: 'charters' } },
  'proj_open_date': { label: 'Projected Open Date', type: 'date', edit: { table: 'charter_applications', pk: 'charter_id' } },
  'school_provided_1023': { label: 'School Provided 1023', type: 'boolean', edit: { table: 'charters' } },
  'short_name': { label: 'Short Name', type: 'string', edit: { table: 'charters' } },
  'status': { label: 'Status', type: 'enum', edit: { table: 'charters' , enumName: 'charter_status'} },
  'support_timeline': { label: 'Support Timeline', type: 'string', multiline: true, edit: { table: 'charters' } },
  'target_open': { label: 'Target Open Date', type: 'date', edit: { table: 'charter_applications', pk: 'charter_id' } },
  'team': { label: 'Team', type: 'string', multiline: true, edit: { table: 'charter_applications', pk: 'charter_id' } },
  'total_grants_issued': { label: 'Total Grants Issued', type: 'number' },
  'total_loans_issued': { label: 'Total Loans Issued', type: 'number' },
  'website': { label: 'Website', type: 'string', edit: { table: 'charters' } },
};

