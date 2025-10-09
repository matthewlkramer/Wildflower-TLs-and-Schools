import { view, tab, card, table, list, map, banner } from '@/shared/views/builders';
import type { ViewSpec } from '@/shared/views/types';
import type { GridColumnConfig, FieldMetadataMap } from '@/shared/types/detail-types';

// Grid + Kanban
export const SCHOOL_GRID: GridColumnConfig[] = [
  { field: 'school_name', headerName: 'Name', sortKey: true},
  { field: 'stage_status', headerName: 'Stage/Status', valueType: 'select', lookupField: 'zref_stage_statuses.value' , kanbanKey: true },
  { field: 'current_tls', headerName: 'Curr. TLs' },
  { field: 'current_tls_race_ethnicity', headerName: 'TLs Race/ Ethnicity', valueType: 'multi', lookupField: 'zref_race_and_ethnicity.label' },
  { field: 'geography', headerName: 'Geography' },
  { field: 'governance_model', headerName: 'Model', valueType: 'select', enumName: 'governance_models' },
  { field: 'ages_served', headerName: 'Ages', valueType: 'multi', enumName: 'age_spans' },
  { field: 'membership_status', headerName: 'Member?', valueType: 'select', lookupField: 'zref_membership_statuses.value', visibility: 'hide' },
  { field: 'open', headerName: 'Open/Proj. open', valueType: 'date' },
  { field: 'active_guides', headerName: 'Guides', valueType: 'multi' },
  { field: 'tl_primary_emails', headerName: 'TL Emails', visibility: 'suppress', valueType: 'string' },
  { field: 'people_id', headerName: 'People ID', visibility: 'suppress'},
  { field: 'id', headerName: 'ID', visibility: 'suppress' }
];

export const SCHOOL_KANBAN_CONSTANTS_TABLE = 'zref_stage_statuses';

// Field metadata (only non-defaults retained)
export const SCHOOL_FIELD_METADATA: FieldMetadataMap = {
  about: { multiline: true },
  about_spanish: { label: 'About (Spanish)', multiline: true },
  address: { multiline: true},
  current_guide_name: { editable: false },
  current_tls: { editable: false },
  current_tls_race_ethnicity: { label: 'TLs Race/Ethnicity', lookupTable: 'zref_race_and_ethnicity', editable: false, array: true },
  ein: { label: 'EIN' },
  facebook: { type: 'url' },
  founding_tls: { lookupTable: 'people'},
  instagram: { type: 'url' },
  logo: { type: 'attachment', isImage: true },
  logo_square: { label: 'Logo (Square)', type: 'attachment', isImage: true },
  logo_flower_only: { label: 'Logo (Flower Only)', type: 'attachment', isImage: true },
  logo_rectangle: { label: 'Logo (Rectangle)', type: 'attachment', isImage: true },
  membership_agreement: { type: 'attachment' },
  object_id: { type: 'attachment' }, // Used by governance_docs, nine_nineties, etc.
  physical_lat: { label: 'Latitude', editable: false },
  physical_long: { label: 'Longitude', editable: false },
  planning_album: { writeTable: 'schools', type: 'attachment' },
  public_funding: { lookupTable: 'zref_public_funding_sources' },
  self_reflection_doc: { type: 'attachment' },
  stage_status: { editable: false },
  total_grants_issued: { editable: false },
  total_loans_issued: { editable: false },
  visioning_album: { type: 'attachment', writeTable: 'schools' },
  website: { type: 'url' },
  wf_tls_on_board: { editable: false },
};

// Create School Modal configuration (declarative)
export const ADD_NEW_SCHOOL_INPUT = [
  { id: 'long_name', label: 'Name', required: true },
  { id: 'short_name', required: true },
  { id: 'governance_model', enumName: 'governance_models', required: true },
  {
    id: 'charter_id',
    label: 'Charter',
    type: 'select',
    visibleIf: { field: 'governance_model', in: ['Charter', 'Exploring Charter'] },
    lookup: { table: 'charters', valueColumn: 'id', labelColumn: 'short_name' },
  },
  { id: 'ages_served', enumName: 'age_spans', type: 'multi' },
  { id: 'program_focus', multiline: true },
  {
    id: 'proj_open_date',
    label: 'Projected Open Date',
    directWrite: false,
    postInsert: { table: 'open_date_revisions', columns: { school_id: '$newId', proj_open_date: 'proj_open_date' } },
  },
  {
    id: 'cohort',
    label: 'Cohort',
    type: 'select',
    lookup: { table: 'cohorts', valueColumn: 'cohort_title', labelColumn: 'cohort_title' },
    directWrite: false,
    postInsert: { table: 'cohort_participation', columns: { school_id: '$newId', cohort: 'cohort' } },
  },
  {
    id: 'school_address', label: 'School Address', visibility: 'clickToOpen', fields:
      [{id: 'address', label: 'Address', multiline: true},{id: 'current_mail_address', label: 'Mailing Address?', type: 'boolean'},{id: 'current_physical_address', label: 'Physical Address?', type: 'boolean'}],
    directWrite: false,
    postInsert: { table: 'locations', columns: { school_id: '$newId', address: '$school_address', current_mail_address: '$current_mail_address', current_physical_address: '$current_physical_address' } },
  },
  { id: 'ssj_target_city', label: 'Target City', visibleIf: { field: 'school_address', notEmpty: false }, writeTable: 'schools_ssj_data' },
  { id: 'ssj_target_state', label: 'Target State', enumName: 'state_abbreviation_enum', visibleIf: { field: 'school_address', notEmpty: false }, writeTable: 'schools_ssj_data' },
  { id: 'guides', label: 'Guides', visibility: 'clickToOpen', fields:
    [{id: 'assigned_ops_guide', label: 'Ops Guide', lookupTable: 'guides', valueColumn: 'email_or_name', labelColumn: 'email_or_name'},{id: 'assigned_entrepreneur_guide', label: 'Entrepreneur Guide', lookupTable: 'guides', valueColumn: 'email_or_name', labelColumn: 'email_or_name'}],
    directWrite: false,
    postInsert: [{ table: 'guide_assignments', columns: { school_id: '$newId', email_or_name: '$assigned_ops_guide', type: 'Ops Guide', is_active: true } },{ table: 'guide_assignments', columns: { school_id: '$newId', email_or_name: '$assigned_entrepreneur_guide', type: 'Entrepreneur', is_active: true } } ],
  },
] as const;

export const SCHOOL_VIEW_SPEC: ViewSpec = view(
  'schools',
  SCHOOL_FIELD_METADATA,
  banner({image: 'logo_square', title: 'school_name', fields: [ 'stage_status', 'current_tls', 'current_guide_name']}),
  tab(
    'overview',
    'Overview',
    card(['short_name', 'long_name', 'prior_names'], { title: 'Name(s)', editable: true }),
    card(['founding_tls', 'open_date', 'membership_status', 'disaffiliation_date'], { title: 'History/Status' , editable: true }),
    map(['physical_lat', 'physical_long', 'physical_address'], { title: 'Location' }),
    card(['about', 'about_spanish'], { title: 'About', editable: true }),
    card(
      ['governance_model', 'public_funding', 'program_focus', 'institutional_partner', 'ages_served', 'number_of_classrooms', 'enrollment_at_full_capacity'],
      { title: 'School Model', editable: true },
    ),
    card(['legal_structure', 'ein', 'incorporation_date', 'current_fy_end', 'loan_report_name', 'nonprofit_path','nonprofit_status', 'group_exemption_status'], { title: 'Legal entity', editable: true }),
    card(['school_email', 'school_phone', 'website', 'facebook', 'instagram'], { title: 'Marketing & Comms', editable: true }),  
    card(['risk_factors', 'watchlist'], { title: 'Warnings', editable: false }),
    card(['logo', 'logo_square', 'logo_flower_only', 'logo_rectangle'], { title: 'Logo(s)', editable: true }),
  ),
  tab(
    'ssj',
    'SSJ',
    card(['ssj_target_city', 'ssj_target_state'], { title: 'Target location', editable: true }),
    card(['entered_visioning_date', 'visioning_album_complete', 'visioning_album', 'entered_planning_date', 'planning_album', 'entered_startup_date'], { title: 'Milestones', editable: true }),
    card(['ssj_readiness_to_open_rating', 'ssj_has_partner', 'ssj_board_development', 'ssj_on_track_for_enrollment'], { title: 'Readiness', editable: true }),
    card(['ssj_name_reserved', 'name_selection_proposal', 'trademark_files', 'logo_designer', 'on_national_website'], { title: 'Branding', editable: true }),
    card(['ssj_facility', 'ssj_building4good_status', 'date_shared_with_n4g', 'building4good_firm_and_attorney'], { title: 'Facilities', editable: true }),
    card(['ssj_budget_ready_for_next_steps', 'ssj_seeking_wf_funding', 'ssj_fundraising_narrative', 'ssj_pathway_to_funding', 'ssj_total_startup_funding_needed', 'ssj_loan_eligibility', 'ssj_loan_approved_amt', 'ssj_amount_raised', 'ssj_gap_in_funding'], { title: 'Fundraising', editable: true }),
    card(['business_insurance', 'budget_utility', 'bill_account'], { title: 'Systems', editable: true }),
    list('schools', 'advice', { width: 'half' })
  ),
  tab('educators_board', 'Educators & Board', list('schools', 'educators', { width: 'half' }), list('schools','boardMembers', { width: 'half' })),
  tab('enrollment_assessments', 'Annual Data', list('schools', 'enrollment', { width: 'half' }), list('schools', 'assessments', { width: 'half' })),
  tab('grants_loans', 'Grants & Loans', list('schools', 'grants', { width: 'half' }), list('schools', 'loans', { width: 'half' })),
  tab('locations', 'Locations', list('schools', 'locations',{width: 'full'})),
  tab('guides', 'Guides', list('schools','guideAssignments',{ width: 'full'})),
  tab('documents', 'Docs', list('schools', 'governanceDocs', { width: 'half' }), list('schools', 'nineNineties', { width: 'half' })),
  tab('actions_notes', 'Actions & Notes', list('schools', 'actionSteps', { width: 'half' }), list('schools', 'notes', { width: 'half' })),
  tab('google_sync', 'gmail/gCal', list('schools', 'gmails', { width: 'half' }), list('schools', 'gCal', { width: 'half' })),
  tab(
    'ops_guide_tab',
    'Ops Guide',
    card(['short_name', 'long_name', 'prior_names'], { title: 'Name(s)', editable: true }),
    card(['ssj_readiness_to_open_rating', 'proj_open_date','current_cohort'], { title: 'SSJ', editable: true }),
    card(['founding_tls', 'status', 'ssj_stage','open_date','membership_status'], { title: 'History/Status' , editable: true }),
    card(['governance_model','public_funding','program_focus','institutional_partner','ages_served', 'number_of_classrooms','enrollment_at_full_capacity'], { title: 'School Model', editable: true }),
    card(['school_email', 'school_phone','website','facebook','instagram'], { title: 'Contact Info', editable: true }),
    card(['budget_link', 'visioning_album', 'planning_album'], { title: 'Files', editable: true }),
    card(['risk_factors','watchlist'], { title: 'Warnings', editable: true }),
    list('schools', 'educators', { activeFilter: true, width:'half' }),
    list('schools', 'boardMembers', { activeFilter: true, width:'half' }),
    list('schools', 'guideAssignments', { activeFilter: true, width:'half' }),
    list('schools', 'locations', { activeFilter: true, width:'half' }),
    list('schools', 'advice', { width:'half' }),
  ),
);



