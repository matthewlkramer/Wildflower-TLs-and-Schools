import { view, tab, card, table, list } from '@/shared/views/builders';
import type { ViewSpec } from '@/shared/views/types';
// Removed - consolidated into table-list-presets
import type { GridColumnConfig, FieldMetadataMap } from '@/shared/types/detail-types';

// Grid + Kanban
export const CHARTER_GRID: GridColumnConfig[] = [
  { field: 'charter_name', headerName: 'Name', sortKey: true },
  { field: 'status', headerName: 'Status', valueType: 'select', enumName: 'charter_status', kanbanKey: true },
  { field: 'proj_open', headerName: 'Projected open', valueType: 'date' },
  { field: 'non_tl_roles', headerName: 'Non-TL leadership' },
  { field: 'initial_target_planes', headerName: 'Target planes', valueType: 'multi', lookupField: 'zref_planes.label' },
  { field: 'initial_target_geo', headerName: 'Target geography' },
  { field: 'schools', headerName: 'Schools', valueType: 'multi' },
  { field: 'active_guides', headerName: 'Guides', valueType: 'multi' },
  { field: 'id', headerName: 'ID', visibility: 'suppress' }
];

export const CHARTER_KANBAN_CONSTANTS_TABLE = 'zref_charter_statuses';

// Gmail list options imported from shared presets

export const CHARTER_FIELD_METADATA: FieldMetadataMap = {
  application: { type: 'attachment' },
  auth_decision: { label: 'Authorization Decision'},
  authorizer: { lookup: { table: 'charter_authorizers', valueColumn: 'authorizer_name', labelColumn: 'authorizer_name' } },
  beg_age: { label: 'Beginning Age'},
  budget_exercises: { type: 'attachment'},
  budget_final: { label: 'Final Budget', type: 'attachment'},
  capacity_intv_completed_date: { label: 'Capacity Interview Completed Date'},
  capacity_intv_proj_complete: { label: 'Capacity Interview Projected Complete'},
  capacity_intv_training_date: { label: 'Capacity Interview Training Date'},
  charter_app_pm_plan_complete: { label: 'PM Plan Complete'},
  charter_app_roles_set: { label: 'Roles Set'},
  comm_engagement_underway: { label: 'Community Engagement Underway'},
  current_fy_end: { label: 'Current Fiscal Year End'},
  design_album: { type: 'attachment'},
  end_age: { label: 'Ending Age'},
  incorp_date: { label: 'Incorporation Date' },
  landscape_analysis: { type: 'attachment'},
  loi: { label: 'LOI Document', type: 'attachment'},
  loi_deadline: { label: 'LOI Deadline'},
  loi_required: { label: 'LOI Required'},
  loi_submitted: { label: 'LOI Submitted'},
  num_students: { label: 'Projected Students'},
  opps_challenges: { label: 'Opportunities & Challenges', multiline: true},
  proj_open_date: { label: 'Projected Open Date'},
  target_open: { label: 'Target Open Date'},
  team: { label: 'Team', type: 'string', multiline: true},
};

// Create Charter Modal configuration (declarative)
// Inserts into charters; some application fields can live in charter_applications
export const ADD_NEW_CHARTER_INPUT = [
  { id: 'short_name', required: true },
  { id: 'full_name', required: true },
  { id: 'status', required: true },
  { id: 'proj_open_date', label: 'Projected Open Date' },
  {
    id: 'authorizer',
    type: 'select',
    lookup: { table: 'charter_authorizers', valueColumn: 'authorizer_name', labelColumn: 'authorizer_name' },
    writeTable: 'charter_applications',
  },
] as const;

export const CHARTER_VIEW_SPEC: ViewSpec = view(
  'charters',
  tab(
    'overview',
    'Overview',
    card(['short_name', 'full_name'], { title: 'Name(s)', editable: true }),
    card(['status', 'membership_status', 'currently_authorized', 'authorizer'], { title: 'Status' }),
    card(['non_tl_roles'], { title: 'People', editable: true }),
    card(['current_cohort', 'support_timeline'], { title: 'Support' }),
    card(['total_grants_issued', 'total_loans_issued'], { title: 'Grants and Loans' }),
    card(['initial_target_geo', 'initial_target_planes'], { title: 'Initial Vision', editable: true }),
  ),
  tab(
    'details',
    'Details',
    card(['ein', 'incorp_date', 'current_fy_end'], { title: 'Legal entity', editable: true }),
    card(['nonprofit_status', 'group_exemption_status'], { title: 'Nonprofit status', editable: true }),
    table('charters', 'authorizerActions'),
    card(['non_discrimination_policy_on_website', 'school_provided_1023', 'guidestart_listing_requested', 'partnership_with_wf', 'first_site_opened_date', 'website'], { title: 'Other', editable: true }),
  ),
  tab(
    'app_details',
    'App Details',
    card(['app_window', 'authorizer', 'decision_expected_date', 'target_open', 'auth_decision', 'proj_open_date'], { title: 'Overall', editable: true }),
    card(['loi_required'], { title: 'Requirements', editable: true }),
    card(['loi_deadline', 'loi_submitted', 'app_deadline', 'app_submitted'], { title: 'Deadlines', editable: true }),
    card(['num_students', 'beg_age', 'end_age'], { title: 'Students/Ages', editable: true }),
    card(['loi', 'landscape_analysis', 'design_album', 'application'], { title: 'Docs', editable: true }),
    card(['budget_exercises', 'budget_final'], { title: 'Budgets', editable: true }),
    card(['team'], { title: 'People', editable: true }),
    card(['charter_app_roles_set', 'charter_app_pm_plan_complete', 'logic_model_complete', 'comm_engagement_underway'], { title: 'Checklist', editable: true }),
    card(['joint_kickoff_meeting_date','internal_support_meeting_date','app_walkthrough_date','capacity_intv_training_date','capacity_intv_proj_complete','capacity_intv_completed_date','design_advice_session_complete','board_membership_signed_date'], { title: 'Schedule', editable: true }),
  ),
  tab('educators', 'Educators', table('charters', 'educators')),
  tab('schools', 'Schools', table('charters', 'schools')),
  tab('enrollment_data', 'Annual Data', list('charters', 'enrollment'), list('charters', 'annualData')),
  tab('docs', 'Docs', table('charters', 'governanceDocs', 'half'), table('charters', 'nineNineties', 'half')),
  tab('action_notes', 'Actions & Notes', list('charters', 'actionSteps'), list('charters', 'notes')),
  tab('grants_loans', 'Grants & Loans', list('charters', 'grants'), list('charters', 'loans')),
  tab('google_sync', 'gmail/gCal', list('charters', 'gmails'), list('charters', 'gCal'))
);



