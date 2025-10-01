import { view, tab, card, table } from '../shared/views/builders';
import type { ViewSpec } from '../shared/views/types';
import type { GridColumnConfig, FieldMetadataMap } from '../shared/detail-types';

// Grid + Kanban
export const EDUCATOR_GRID: GridColumnConfig[] = [
  { field: 'full_name', headerName: 'Name', sortKey: true },
  { field: 'current_role_at_active_school', headerName: 'Role at Curr. School' },
  { field: 'active_school', headerName: 'Curr. School', visibility: 'hide' },
  { field: 'current_role', headerName: 'Curr. Role', visibility: 'hide', valueType: 'select' },
  { field: 'discovery_status', headerName: 'Discovery', valueType: 'select', selectOptions: ['In Process', 'Complete'] },
  { field: 'race_ethnicity', headerName: 'Race/Ethnicity', valueType: 'multi', lookupField: 'ref_race_and_ethnicity.english_short' },
  { field: 'has_montessori_cert', headerName: 'Trained?', valueType: 'boolean' },
  { field: 'indiv_type', headerName: 'Type', valueType: 'select', selectOptions: ['Educator', 'Community Member'] },
  { field: 'id', headerName: 'ID', visibility: 'suppress' },
  { field: 'active_school_id', headerName: 'Active School ID', visibility: 'suppress' },
  { field: 'kanban_group', headerName: 'Kanban Group', visibility: 'suppress', kanbanKey: true },
];

export const EDUCATOR_KANBAN_CONSTANTS_TABLE = 'ref_educator_statuses';

// Field metadata (non-defaults only)
export const EDUCATOR_FIELD_METADATA: FieldMetadataMap = {
  full_name: { editable: false },
  primary_phone_other_info: { label: 'Extension or other info (for Primary Phone)' },
  secondary_phone_other_info: { label: 'Extension or other info (for Secondary Phone)' },
  home_address: { multiline: true },
  educ_attainment: { label: 'Educational Attainment' },
  race_ethnicity: { label: 'Race/Ethnicity', lookup: { table: 'ref_race_and_ethnicity', valueColumn: 'category', labelColumn: 'english_short' } },
  // Show the free-text field when the selected value includes "other" (handle both cases defensively)
  race_ethnicity_other: { label: 'Race/Ethnicity - if Other, please specify', visibleIf: { field: 'race_ethnicity', in: ['other', 'Other'] } },
  gender_other: { label: 'Gender - if Other, please specify', visibleIf: { field: 'gender', in: ['Other'] } },
  // Drive select for HH Income (renderer infers enum)
  hh_income: { label: 'Household Income' },
  lgbtqia: { label: 'LGBTQIA+' },
  // Pronouns enum uses lowercase 'other' in the database
  pronouns_other: { label: 'Pronouns - if other, please specify' , visibleIf: { field: 'pronouns', in: ['other'] } },
  // Not an enum in DB; offer common options
  indiv_type: { label: 'Type', options: ['Educator', 'Community Member'] },
  assigned_partner: { editable: false },
  first_contact_ages: { label: 'Initial Interest: Ages' },
  first_contact_governance_model: { label: 'Initial Interest: Governance Model' },
  first_contact_interests: { label: 'Initial Interest' },
  first_contact_notes_on_pre_wf_employment: { label: 'Notes on Pre-WF Employment' },
  first_contact_wf_employment_status: { label: 'Notes on WF Employment Status at first contact' },
  first_contact_willingness_to_relocate: { label: 'Initial Willingness to Relocate' },
  target_geo_combined: { label: 'Target Geography' },
  self_reflection_doc: { label: 'Self Reflection Document', type: 'attachment' },
  opsguide_initial_contact_date: { label: 'Ops Guide - Initial Contact Date' },
  opsguide_checklist: { label: 'Ops Guide - Checklist' },
  opsguide_fundraising_opps: { label: 'Ops Guide - Fundraising Opportunities' },
  opsguide_meeting_prefs: { label: 'Ops Guide - Meeting Preferences' },
  opsguide_request_pertinent_info: { label: 'Ops Guide - Request Pertinent Info' },
  opsguide_support_type_needed: { label: 'Ops Guide - Support Type Needed' },
  routed_to: { lookup: { table: 'guides', valueColumn: 'email_or_name', labelColumn: 'email_or_name' } },
  assigned_partner_override: { lookup: { table: 'guides', valueColumn: 'email_or_name', labelColumn: 'email_or_name' } },
  person_responsible_for_follow_up: { lookup: { table: 'guides', valueColumn: 'email_or_name', labelColumn: 'email_or_name' } },
  one_on_one_scheduling_status: { label: 'One-on-One Scheduling Status', lookup: { schema: 'ref_tables', table: 'ref_one_on_one_status', valueColumn: 'value', labelColumn: 'label' } },
  current_role_at_active_school: { label: 'Current Role at Active School', editable: false },
  current_role: { editable: false },
  active_school: { editable: false },
  has_montessori_cert: { label: 'Montessori Certified?', type: 'boolean', editable: false },
  cert_levels_rev: { label: 'Montessori Certifications' },
  primary_email: { editable: false },
  most_recent_fillout_form_date: { editable: false },
  most_recent_event_name: { editable: false },
  most_recent_event_date: { editable: false },
  most_recent_note: { editable: false },
  most_recent_note_date: { editable: false },
  most_recent_note_from: { editable: false },
};

// Create Educator Modal configuration (declarative)
// Inserts into people; related records (emails) via postInsert
export const ADD_NEW_EDUCATOR_INPUT = [
  { id: 'full_name', required: true },
  { id: 'primary_phone' },
  { id: 'home_address', multiline: true },
  { id: 'race_ethnicity' },
  {
    id: 'personal_email',
    label: 'Personal Email',
    directWrite: false,
    postInsert: { table: 'email_addresses', columns: { people_id: '$newId', email_address: 'personal_email' , category: 'Personal' } },
  },
] as const;

export const EDUCATOR_VIEW_SPEC: ViewSpec = view(
  'educators',
  tab(
    'overview',
    'Overview',
    card(['full_name', 'primary_phone', 'primary_email'], { title: 'Name and Contact Info' }),
    card(['current_role', 'active_school'], { title: 'Current Role and School' }),
    card(['discovery_status', 'assigned_partner', 'montessori_certs'], { title: 'SSJ and Training' }),
    card(['most_recent_fillout_form_date', 'most_recent_event_name', 'most_recent_event_date', 'most_recent_note', 'most_recent_note_date', 'most_recent_note_from'], { title: 'Recent Activity' }),
  ),
  tab(
    'name_and_background',
    'Name/Background',
    card(['first_name', 'nickname', 'middle_name', 'last_name', 'pronunciation'], { title: 'Name', editable: true }),
    card(['race_ethnicity', 'race_ethnicity_other', 'educ_attainment', 'hh_income', 'childhood_income', 'indiv_type'], { title: 'Background', editable: true }),
    card(['gender', 'gender_other', 'pronouns', 'pronouns_other', 'lgbtqia'], { title: 'Gender', editable: true }),
    card(['primary_languages', 'other_languages'], { title: 'Languages', editable: true }),
  ),
  tab(
    'contact_info',
    'Contact Info',
    table('educatorEmails', { title: 'Emails' }),
    card(['primary_phone', 'primary_phone_other_info', 'secondary_phone', 'secondary_phone_other_info'], { title: 'Phone', editable: true }),
    card(['home_address'], { title: 'Address', editable: true }),
  ),
  tab('schools', 'Schools', table('educatorSchools')),
  tab('certifications', 'Certs', table('educatorMontessoriCerts')),
  tab(
    'early_cultivation',
    'Early Cultivation',
    card(['discovery_status', 'assigned_partner', 'target_geo_combined', 'self_reflection_doc'], { title: 'Progress', editable: true }),
    card(['first_contact_ages', 'first_contact_governance_model', 'first_contact_interests', 'first_contact_notes_on_pre_wf_employment', 'first_contact_wf_employment_status', 'first_contact_willingness_to_relocate'], { title: 'First Contact', editable: true }),
    card(['opsguide_checklist', 'opsguide_fundraising_opps', 'opsguide_meeting_prefs', 'opsguide_request_pertinent_info', 'opsguide_support_type_needed'], { title: 'Ops Guide Prefs', editable: true }),
    card(['sendgrid_template_selected', 'sendgrid_send_date', 'person_responsible_for_follow_up', 'one_on_one_scheduling_status', 'personal_email_sent', 'personal_email_sent_date'], { title: 'Follow Up', editable: true }),
  ),
  tab('events', 'Events', table('educatorEvents')),
  tab('systems', 'Systems', card(['on_connected', 'on_slack', 'in_tl_google_grp', 'in_wf_directory', 'who_initiated_tl_removal', 'on_natl_website', 'gsuite_roles'], { editable: true })),
  tab('notes', 'Notes', table('educatorNotes')),
  tab('actionSteps', 'Action Steps', table('educatorActionSteps')),
  tab('google_sync', 'Gmail/gCal', table('educatorGmails', { title: 'Gmails', width: 'half' }), table('educatorCalendarEvents', { title: 'Calendar Events', width: 'half' })),
);
