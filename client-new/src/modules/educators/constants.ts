// Grid section
import type { ColumnVisibility, GridValueKind, GridColumnConfig, DetailCardBlock, DetailTableBlock, DetailTabSpec as SharedDetailTabSpec } from '../shared/detail-types';
import { ROW_ACTIONS, TABLE_ACTIONS, TABLE_COLUMNS } from '../shared/detail-presets';

export type { ColumnVisibility, GridValueKind } from '../shared/detail-types';
export type EducatorColumnConfig = GridColumnConfig;
export type DetailCardSpec = DetailCardBlock;
export type DetailTableSpec = DetailTableBlock;
export type DetailTabSpec = SharedDetailTabSpec;

export const EDUCATOR_GRID: EducatorColumnConfig[] = [
  { field: 'full_name', headerName: 'Name', visibility: 'show', order: 1, valueType: 'string', sortKey: true },
  { field: 'discovery_status', headerName: 'Discovery Status', visibility: 'show', order: 5, valueType: 'select', selectOptions: ['In Process', 'Complete'] },
  { field: 'active_school', headerName: 'Active School', visibility: 'hide', order: 3, valueType: 'string' },
  { field: 'current_role', headerName: 'Current Role', visibility: 'hide', order: 4, valueType: 'select', lookupField: 'ref_roles.role_short' },
  { field: 'current_role_at_active_school', headerName: 'Current Role at Active School', visibility: 'show', order: 2, valueType: 'string' },
  { field: 'race_ethnicity_display', headerName: 'Race/Ethnicity', visibility: 'show', order: 6, valueType: 'multi', lookupField: 'ref_race_and_ethnicity.english_short' },
  { field: 'indiv_type', headerName: 'Type', visibility: 'show', order: 8, valueType: 'select', selectOptions: ['Educator', 'Community Member'] },
  { field: 'has_montessori_cert', headerName: 'Montessori Certified', visibility: 'show', order: 7, valueType: 'boolean' },
  { field: 'id', headerName: 'ID', visibility: 'suppress' },
  { field: 'kanban_group', headerName: 'Kanban Group', visibility: 'suppress', kanbanKey: true },
];

export const EDUCATOR_KANBAN_CONSTANTS_TABLE = 'ref_educator_statuses';

export const EDUCATOR_DETAIL_TABS: DetailTabSpec[] = [
  {
    id: 'overview',
    label: 'Overview',
    blocks: [
      { kind: 'card', title: 'Name and Contact Info', fields: ['full_name', 'primary_phone', 'primary_email'], editable: false },
      { kind: 'card', title: 'Current Role and School', fields: ['current_role', 'active_school'], editable: false },
      { kind: 'card', title: 'SSJ and Training', fields: ['discovery_status', 'assigned_partner', 'has_montessori_cert', 'mont_cert_summary'], editable: false },
      { kind: 'card', title: 'Recent Activity', fields: ['most_recent_fillout_form_date', 'most_recent_event_name', 'most_recent_event_date', 'most_recent_note', 'most_recent_note_date', 'most_recent_note_from'], editable: false },
    ],
  },
  {
    id: 'name_and_background',
    label: 'Name and Background',
    // Default write target for editable cards
    writeTo: { schema: 'public', table: 'people', pk: 'id' },
    // race_ethnicity_display is a transformed display; map back to enum keys via ref table
    writeToExceptions: [
      {
        field: 'race_ethnicity_display',
        mapsToField: 'race_ethnicity',
        viaLookup: {
          schema: 'public',
          table: 'ref_race_and_ethnicity',
          labelColumn: 'english_short',
          keyColumn: 'category'
        }
      }
    ],
    blocks: [
      { kind: 'card', title: 'Name', fields: ['first_name', 'nickname', 'middle_name', 'last_name', 'pronunciation'], editable: true },
      { kind: 'card', title: 'Background', fields: ['race_ethnicity_display', 'race_ethnicity_other', 'educ_attainment', 'hh_income', 'childhood_income', 'indiv_type'], editable: true}, 
      { kind: 'card', title: 'Gender', fields: ['gender', 'gender_other', 'pronouns', 'pronouns_other', 'lgbtqia'], editable: true},
      { kind: 'card', title: 'Languages', fields: ['primary_languages', 'other_languages'], editable: true},
    ],
  },
  {
    id: 'contact_info',
    label: 'Contact Information',
    writeTo: { schema: 'public', table: 'people', pk: 'id' },
    blocks: [
      { kind: 'table', title: 'Emails', source: { table: 'email_addresses', schema: 'public', fkColumn: 'people_id' }, columns: ['email_address', 'category', 'is_primary', 'is_valid'], rowActions: ['inline_edit', 'toggle_primary', 'toggle_valid'], tableActions: ['addEmail'] },
      { kind: 'card', title: 'Phone', fields: ['primary_phone', 'primary_phone_other_info', 'secondary_phone', 'secondary_phone_other_info'], editable: true},
      { kind: 'card', title: 'Address', fields: ['home_address'], editable: true},
    ],
  },
  {
    id: 'schools',
    label: 'Schools',
    blocks: [
      { kind: 'table', title: 'Schools', source: { table: 'details_associations', schema: 'public', fkColumn: 'people_id' }, columns: ['school_name', 'role', 'start_date', 'end_date', 'currently_active', 'stage_status'], rowActions: ['inline_edit', 'modal_view', 'end_stint','archive'], tableActions: ['addStint', 'addEducatorAndStint'] },
    ],
  },
  {
    id: 'certifications',
    label: 'Certifications',
    blocks: [
      { kind: 'table', title: 'Montessori Certifications', source: { table: 'montessori_certs', schema: 'public', fkColumn: 'people_id' }, columns: ['year', 'training_center', 'association', 'macte_accredited', 'cert_completion_status', 'cert_level', 'admin_credential', 'assistant_training'], rowActions: ['inline_edit', 'modal_view', 'archive'], tableActions: ['addTraining'] },
    ],
  },
  {
    id: 'early_cultivation',
    label: 'Early Cultivation',
    writeTo: { schema: 'public', table: 'people_educator_early_cultivation', pk: 'people_id' },
    blocks: [
      { kind: 'card', title: 'Progress', fields: ['discovery_status', 'assigned_partner'], editable: true },
      { kind: 'card', title: 'First Contact', fields: ['first_contact_ages', 'first_contact_governance_model', 'first_contact_interests', 'first_contact_notes_on_pre_wf_employment', 'first_contact_wf_employment_status', 'first_contact_willingness_to_relocate', 'first_contact_form_notes'], editable: true },
      { kind: 'card', title: 'Ops Guide Prefs', fields: ['opsguide_checklist', 'opsguide_fundraising_opps', 'opsguide_meeting_prefs', 'opsguide_request_pertinent_info', 'opsguide_support_type_needed'], editable: true },
      { kind: 'card', title: 'Inquiry Routing', fields: ['sendgrid_template_selected', 'sendgrid_send_date'], editable: true },
      { kind: 'card', title: 'Follow Up', fields: ['person_responsible_for_follow_up', 'one_on_one_scheduling_status', 'personal_email_sent', 'personal_email_sent_date'], editable: true },
      { kind: 'card', title: 'Other', fields: ['target_geo_combined', 'self_reflection_doc'], editable: true },
    ],
  },
  {
    id: 'events',
    label: 'Events',
    blocks: [
      { kind: 'table', title: 'Events', source: { table: 'event_attendance', schema: 'public', fkColumn: 'people_id' }, columns: ['event_name', 'registration_date', 'attended_event'], rowActions: ['inline_edit'], tableActions: ['addEvent'] },
    ],
  },
  {
    id: 'systems',
    label: 'Systems',
    writeTo: { schema: 'public', table: 'people_systems', pk: 'people_id' },
    blocks: [
      { kind: 'card', title: 'Systems', fields: ['on_connected', 'on_slack', 'in_tl_google_grp', 'in_wf_directory', 'who_initiated_tl_removal', 'on_natl_website', 'gsuite_roles'], editable: true },
    ],
  },
  {
    id: 'action_steps',
    label: 'Action Steps',
    blocks: [
      { kind: 'table', title: 'Action Steps', source: { table: 'action_steps', schema: 'public', fkColumn: 'people_id' }, columns: [...TABLE_COLUMNS.actionSteps], rowActions: [...ROW_ACTIONS.actionSteps], tableActions: [...TABLE_ACTIONS.actionSteps] },
    ],
  },
  {
    id: 'notes',
    label: 'Notes',
    blocks: [
      { kind: 'table', title: 'Notes', source: { table: 'notes', schema: 'public', fkColumn: 'people_id' }, columns: [...TABLE_COLUMNS.notesBasic], rowActions: [...ROW_ACTIONS.notesCamel], tableActions: [...TABLE_ACTIONS.notes] },
    ],
  },
  {
    id: 'google_sync',
    label: 'Google Sync',
    writeTo: { schema: 'public', table: 'people', pk: 'id' },
    blocks: [
      { kind: 'card', title: 'Google Sync Settings', fields: ['exclude_from_calendar_logging'], editable: true},
      { kind: 'table', title: 'Gmails', source: { table: 'g_emails', schema: 'gsync', fkColumn: 'people_id' }, columns: [...TABLE_COLUMNS.gmail], rowActions: [...ROW_ACTIONS.modalViewPrivate] },
      { kind: 'table', title: 'Calendar Events', source: { table: 'g_events', schema: 'gsync', fkColumn: 'people_id' }, columns: [...TABLE_COLUMNS.calendarEvents], rowActions: [...ROW_ACTIONS.modalViewPrivate] },
    ],
  },
];







