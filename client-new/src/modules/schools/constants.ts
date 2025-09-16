// Config model: field name, display name, visibility, order, and value type/options.
import type { ColumnVisibility, GridValueKind, GridColumnConfig, DetailCardBlock, DetailTableBlock, DetailMapBlock, DetailTabSpec as SharedDetailTabSpec } from '../shared/detail-types';
import { ROW_ACTIONS, TABLE_ACTIONS, TABLE_COLUMNS } from '../shared/detail-presets';

export type { ColumnVisibility, GridValueKind } from '../shared/detail-types';
export type SchoolColumnConfig = GridColumnConfig;
export type DetailCardSpec = DetailCardBlock;
export type DetailTableSpec = DetailTableBlock;
export type DetailMapSpec = DetailMapBlock;
export type DetailTabSpec = SharedDetailTabSpec;

export const SCHOOL_GRID: SchoolColumnConfig[] = [
  { field: 'school_name', headerName: 'Name', visibility: 'show', order: 1, valueType: 'string' , sortKey: true},
  { field: 'stage_status', headerName: 'Stage/Status', visibility: 'show', order: 2, valueType: 'select', lookupField: 'ref_stage_statuses' , kanbanKey: true },
  { field: 'current_tls', headerName: 'Status', visibility: 'show', order: 4, valueType: 'string' },
  { field: 'governance_model', headerName: 'City', visibility: 'show', order: 6, valueType: 'select', enumName: 'governance_models' },
  { field: 'ages_served', headerName: 'Ages served', visibility: 'show', order: 5, valueType: 'multi', enumName: 'age_spans' },
  { field: 'membership_status', headerName: 'Membership status', visibility: 'show', order: 5, valueType: 'select', lookupField: 'ref_membership_statuses' },
  { field: 'projected_open', headerName: 'Projected open', visibility: 'show', order: 3, valueType: 'date' },
  { field: 'id', headerName: 'ID', visibility: 'suppress' }
];

export const SCHOOL_KANBAN_CONSTANTS_TABLE = 'ref_stage_statuses';

export const SCHOOL_DETAIL_TABS: DetailTabSpec[] = [
  {
    id: 'overview',
    label: 'Overview',
    writeTo: { schema: 'public', table: 'schools', pk: 'id' },
    blocks: [
      { kind: 'map', title: 'Location', fields: ['physical_lat','physical_long','physical_address'] },
      { kind: 'card', title: 'Name(s)', fields: ['short_name', 'long_name', 'prior_names','founding_tls'], editable: true },
      { kind: 'card', title: 'Status', fields: ['stage_status', 'open_date','membership_status'], editable: false },
      { kind: 'card', title: 'About', fields: ['about','about_spanish'], editable: true },
      { kind: 'card', title: 'Support', fields: ['current_tls','current_guide_name','current_cohort'], editable: false },
      { kind: 'card', title: 'School Model', fields: ['governance_model','public_funding','program_focus','institutional_partner','ages_served', 'number_of_classrooms','enrollment_at_full_capacity'], editable: true },
      { kind: 'card', title: 'Contact Info', fields: ['school_email', 'school_phone', 'domain_name', 'website', 'facebook', 'instagram'], editable: true },
      { kind: 'card', title: 'Grants and Loans', fields: ['total_grants_issued', 'total_loans_issued'], editable: false },
      { kind: 'card', title: 'Warnings', fields: ['risk_factors','watchlist'], editable: true },
    ],
  },
  {
    id: 'details',
    label: 'Details',
    writeTo: { schema: 'public', table: 'schools', pk: 'id' },
    blocks: [
      { kind: 'card', title: 'Legal entity', fields: ['status','legal_structure','ein','incorporation_date','current_fy_end','loan_report_name'], editable: true },
      { kind: 'card', title: 'Nonprofit status', fields: ['nonprofit_status'], editable: true },
      { kind: 'table', title: 'Group exemption status', source: { table: 'group_exemption_actions', schema: 'public', fkColumn: 'school_id' }, columns: ['created_at','action','group_exemption_status_after_action'], rowActions: ['modal_view','archive'], tableActions: ['addGroupExemptionAction'] },
      { kind: 'table', title: 'Membership status', source: { table: 'membership_actions', schema: 'public', fkColumn: 'school_id' }, columns: ['action_date','action','membership_status_after_action','agreement_version','attachments'], rowActions: ['modal_view','archive'], tableActions: ['addMembershipAction'] },
      { kind: 'card', title: 'Founders', fields: ['founders'], editable: true },
      { kind: 'card', title: 'Boards + Ops', fields: ['board_members', 'ops_committee', 'fundraising_committee'], editable: true },
      { kind: 'card', title: 'Logo(s)', fields: ['logo','logo_url'], editable: true },
    ],
  },
  {
    id: 'ssj',
    label: 'SSJ',
    writeTo: { schema: 'public', table: 'schools_ssj_data', pk: 'id' },
    blocks: [
      { kind: 'card', title: 'Target location', fields: ['ssj_target_city','ssj_target_state'], editable: true },
      { kind: 'card', title: 'Milestones', fields: ['entered_visioning_date','visioning_album_complete','visioning_album','entered_planning_date','planning_album','entered_startup_date'], editable: true },
      { kind: 'card', title: 'Readiness', fields: ['ssj_ops_guide_support_track','ssj_readiness_to_open_rating', 'ssj_has_partner','ssj_board_development','ssj_on_track_for_enrollment'], editable: true },
      { kind: 'card', title: 'Branding', fields: ['ssj_name_reserved','name_selection_proposal','trademark_files','logo_designer','on_national_website'], editable: true },
      { kind: 'card', title: 'Facilities', fields: ['ssj_facility','ssj_building4good_status','date_shared_with_n4g','building4good_firm_and_attorney'], editable: true },
      { kind: 'card', title: 'Fundraising', fields: ['ssj_budget_ready_for_next_steps','ssj_seeking_wf_funding','ssj_fundraising_narrative','ssj_pathway_to_funding','ssj_total_startup_funding_needed','ssj_loan_eligibility','ssj_loan_approved_amt','ssj_amount_raised','ssj_gap_in_funding'], editable: true },
    ],
  },
  {
    id: 'systems',
    label: 'Systems & Ops',
    writeTo: { schema: 'public', table: 'schools', pk: 'id' },
    blocks: [
      { kind: 'card', title: 'Systems', fields: ['google_workspace_org_unit_path','transparent_classroom','admissions_system'], editable: true },
      { kind: 'card', title: 'Operations', fields: ['gsuite_roles','google_voice','website_tool','tc_recordkeeping','tc_admissions','business_insurance'], editable: true },
      { kind: 'card', title: 'Finance', fields: ['budget_utility','budget_link','qbo','bill_account','gusto','bookkeeper_or_accountant','qbo_school_codes'], editable: true },
      { kind: 'card', title: 'Compliance', fields: ['guidestar_listing_requested','nondiscrimination_policy_on_application','nondiscrimination_policy_on_website'], editable: true },
    ],
  },
  {
    id: 'educators',
    label: 'Educators',
    writeTo: { schema: 'public', table: 'people', pk: 'id' },
    blocks: [
      { kind: 'table', title: 'Educators', source: { table: 'educators', schema: 'public', fkColumn: 'school_id' }, columns: ['full_name','role'], rowActions: ['inline_edit', 'view_educators','email','add_note','add_task','end_link','archive'], tableActions: ['addExistingEducatorToSchool','addNewEducatorToSchool'] },
    ],
  },

  {
    id: 'enrollment',
    label: 'Enrollment & Demographics',
    writeTo: { schema: 'public', table: 'annual_enrollment_and_demographics', pk: 'school_id' },
    blocks: [
      { kind: 'table', title: 'Annual Enrollment', source: { table: 'annual_enrollment_and_demographics', schema: 'public', fkColumn: 'school_id' }, columns: ['school_year','enrolled_students_total','enrolled_bipoc','enrolled_frl','enrolled_sped','enrolled_ell'], rowActions: ['inline_edit'], tableActions: ['addRecord'] },
    ],
  },
  {
    id: 'grants_and_loans',
    label: 'Grants and Loans',
    blocks: [
      { kind: 'table', title: 'Loans', source: { table: 'loans', schema: 'public', fkColumn: 'school_id' }, columns: ['issue_date','amount_issued','loan_status'], rowActions: ['modal_view']},
      { kind: 'table', title: 'Grants', source: { table: 'grants', schema: 'public', fkColumn: 'school_id' }, columns: ['issue_date','amount','grant_status'], rowActions: ['inline_edit','modal_view','archive'], tableActions: ['addGrant'] },

    ],
  },
  {
    id: 'locations',
    label: 'Locations',
    blocks: [
      { kind: 'table', title: '', source: { table: 'locations', schema: 'public', fkColumn: 'school_id' }, columns: ['address','start_date','end_date','current_mail_address','current_physical_address','lease_end_date'], rowActions: ['modal_view', 'inline_edit','end_occupancy', 'archive'], tableActions: ['addLocation'] },
    ],
  },
  {
    id: 'guides',
    label: 'Guides',
    blocks: [
      { kind: 'table', title: 'Guide Assignments', source: { table: 'guide_assignments', schema: 'public', fkColumn: 'school_id' }, columns: ['email_or_name','type','start_date','end_date','active'], rowActions: ['inline_edit'], tableActions: ['addGuideLink','addNewGuide'] }
    ],
  },
  {
    id: 'documents',
    label: 'Documents',
    blocks: [
      { kind: 'table', title: 'Documents', source: { table: 'governance_docs', schema: 'public', fkColumn: 'school_id' }, columns: ['document','uploaded_at','notes'], rowActions: ['inline_edit','modal_view'], tableActions: ['addDocument'] },
      { kind: 'table', title: '990s', source: { table: 'nine_nineties', schema: 'public', fkColumn: 'school_id' }, columns: ['form_year','pdf'], rowActions: ['archive'], tableActions: ['addSchoolDoc'] },
    ],
  },
  {
    id: 'action_steps',
    label: 'Action Steps',
    blocks: [
      { kind: 'table', title: 'Action Steps', source: { table: 'action_steps', schema: 'public', fkColumn: 'school_id' }, columns: [...TABLE_COLUMNS.actionSteps], rowActions: [...ROW_ACTIONS.actionSteps], tableActions: [...TABLE_ACTIONS.actionSteps] },
    ],
  },
  {
    id: 'notes',
    label: 'Notes',
    blocks: [
      { kind: 'table', title: 'Notes', source: { table: 'notes', schema: 'public', fkColumn: 'school_id' }, columns: [...TABLE_COLUMNS.notesWithBody], rowActions: [...ROW_ACTIONS.notesSnake], tableActions: [...TABLE_ACTIONS.notes] },
    ],
  },
  {
    id: 'google_sync',
    label: 'Google Sync',
    blocks: [
      { kind: 'table', title: 'Gmails', source: { table: 'g_emails', schema: 'gsync', fkColumn: 'people_id' }, columns: [...TABLE_COLUMNS.gmail], rowActions: [...ROW_ACTIONS.modalViewPrivate] },
      { kind: 'table', title: 'Calendar Events', source: { table: 'g_events', schema: 'gsync', fkColumn: 'people_id' }, columns: [...TABLE_COLUMNS.calendarEvents], rowActions: [...ROW_ACTIONS.modalViewPrivate] },
    ],
  },

];







