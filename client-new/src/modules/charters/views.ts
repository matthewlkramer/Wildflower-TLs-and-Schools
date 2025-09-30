import { view, tab, card, table } from '../shared/views/builders';
import type { ViewSpec } from '../shared/views/types';

export const CHARTER_VIEW_SPEC: ViewSpec = view(
  'charters',
  tab(
    'overview',
    'Overview',
    card(['short_name', 'full_name'], { title: 'Name(s)', editable: true }),
    card(['status', 'membership_status', 'currently_authorized', 'authorizer'], { title: 'Status', editable: false }),
    card(['non_tl_roles'], { title: 'People', editable: true }),
    card(['current_cohort', 'support_timeline'], { title: 'Support', editable: false }),
    card(['total_grants_issued', 'total_loans_issued'], { title: 'Grants and Loans', editable: false }),
    card(['initial_target_geo', 'initial_target_planes'], { title: 'Initial Vision', editable: true }),
  ),
  tab(
    'details',
    'Details',
    card(['ein', 'incorp_date', 'current_fy_end'], { title: 'Legal entity', editable: true }),
    card(['nonprofit_status', 'group_exemption_status'], { title: 'Nonprofit status', editable: true }),
    table('charterAuthorizerActions', { title: 'Authorizer actions' }),
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
  tab('educators', 'Educators', table('charterEducators')),
  tab('schools', 'Schools', table('charterSchools')),
  tab('enrollment', 'Enrollment', table('charterEnrollment')),
  tab('docs', 'Docs', table('charterGovernanceDocs', { title: 'Governance Docs' }), table('charterNineNineties', { title: '990s' })),
);

