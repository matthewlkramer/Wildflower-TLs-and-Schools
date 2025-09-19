// Grid section
import type { ColumnVisibility, GridValueKind, GridColumnConfig, DetailCardBlock, DetailTableBlock, DetailTabSpec as SharedDetailTabSpec, FieldMetadataMap } from '../shared/detail-types';
import { ROW_ACTIONS, TABLE_ACTIONS, TABLE_COLUMNS, TABLE_COLUMN_META } from '../shared/detail-presets';
import { TABLE_PRESETS } from '../shared/table-presets';

export type { ColumnVisibility, GridValueKind } from '../shared/detail-types';
export type EducatorColumnConfig = GridColumnConfig;
export type DetailCardSpec = DetailCardBlock;
export type DetailTableSpec = DetailTableBlock;
export type DetailTabSpec = SharedDetailTabSpec;

export const EDUCATOR_GRID: EducatorColumnConfig[] = [
  { field: 'full_name', headerName: 'Name', valueType: 'string', sortKey: true },
  { field: 'current_role_at_active_school', headerName: 'Current Role at Active School', valueType: 'string' },
  { field: 'active_school', headerName: 'Active School', visibility: 'hide', valueType: 'string' },
  { field: 'current_role', headerName: 'Current Role', visibility: 'hide', valueType: 'select', lookupField: 'ref_roles.role_short' },
  { field: 'discovery_status', headerName: 'Discovery Status', valueType: 'select', selectOptions: ['In Process', 'Complete'] },
  { field: 'race_ethnicity', headerName: 'Race/Ethnicity', valueType: 'multi', lookupField: 'ref_race_and_ethnicity.english_short' },
  { field: 'has_montessori_cert', headerName: 'Montessori Certified', valueType: 'boolean' },
  { field: 'indiv_type', headerName: 'Type', valueType: 'select', selectOptions: ['Educator', 'Community Member'] },
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
    blocks: [
      { kind: 'card', title: 'Name', fields: ['first_name', 'nickname', 'middle_name', 'last_name', 'pronunciation'], editable: true },
      { kind: 'card', title: 'Background', fields: ['race_ethnicity', 'race_ethnicity_other', 'educ_attainment', 'hh_income', 'childhood_income', 'indiv_type'], editable: true}, 
      { kind: 'card', title: 'Gender', fields: ['gender', 'gender_other', 'pronouns', 'pronouns_other', 'lgbtqia'], editable: true},
      { kind: 'card', title: 'Languages', fields: ['primary_languages', 'other_languages'], editable: true},
    ],
  },
  {
    id: 'contact_info',
    label: 'Contact Info',
    blocks: [
      { kind: 'table', title: 'Emails', source: TABLE_PRESETS.educatorEmails.source, columns: [...TABLE_PRESETS.educatorEmails.columns], columnMeta: TABLE_PRESETS.educatorEmails.columnMeta, rowActions: [...(TABLE_PRESETS.educatorEmails.rowActions || [])], tableActions: [...(TABLE_PRESETS.educatorEmails.tableActions || [])], tableActionLabels: [...(TABLE_PRESETS.educatorEmails.tableActionLabels || [])] },
      { kind: 'card', title: 'Phone', fields: ['primary_phone', 'primary_phone_other_info', 'secondary_phone', 'secondary_phone_other_info'], editable: true},
      { kind: 'card', title: 'Address', fields: ['home_address'], editable: true},
    ],
  },
  {
    id: 'schools',
    label: 'Schools',
    blocks: [
      { kind: 'table', source: TABLE_PRESETS.educatorSchools.source, columns: [...TABLE_PRESETS.educatorSchools.columns], columnMeta: TABLE_PRESETS.educatorSchools.columnMeta, rowActions: [...(TABLE_PRESETS.educatorSchools.rowActions || [])], tableActions: [...(TABLE_PRESETS.educatorSchools.tableActions || [])], tableActionLabels: [...(TABLE_PRESETS.educatorSchools.tableActionLabels || [])] },
    ],
  },
  {
    id: 'certifications',
    label: 'Certs',
    blocks: [
      { kind: 'table', source: TABLE_PRESETS.educatorMontessoriCerts.source, columns: [...TABLE_PRESETS.educatorMontessoriCerts.columns], columnMeta: TABLE_PRESETS.educatorMontessoriCerts.columnMeta, rowActions: [...(TABLE_PRESETS.educatorMontessoriCerts.rowActions || [])], tableActions: [...(TABLE_PRESETS.educatorMontessoriCerts.tableActions || [])], tableActionLabels: [...(TABLE_PRESETS.educatorMontessoriCerts.tableActionLabels || [])] },
    ],
  },
  {
    id: 'early_cultivation',
    label: 'Early Cultivation',
    blocks: [
      { kind: 'card', title: 'Progress', fields: ['discovery_status', 'assigned_partner','target_geo_combined', 'self_reflection_doc'], editable: true },
      { kind: 'card', title: 'First Contact', fields: ['first_contact_ages', 'first_contact_governance_model', 'first_contact_interests', 'first_contact_notes_on_pre_wf_employment', 'first_contact_wf_employment_status', 'first_contact_willingness_to_relocate', 'first_contact_form_notes'], editable: true },
      { kind: 'card', title: 'Ops Guide Prefs', fields: ['opsguide_checklist', 'opsguide_fundraising_opps', 'opsguide_meeting_prefs', 'opsguide_request_pertinent_info', 'opsguide_support_type_needed'], editable: true },
      { kind: 'card', title: 'Follow Up', fields: ['sendgrid_template_selected', 'sendgrid_send_date','person_responsible_for_follow_up', 'one_on_one_scheduling_status', 'personal_email_sent', 'personal_email_sent_date'], editable: true },
    ],
  },
  {
    id: 'events',
    label: 'Events',
    blocks: [
      { kind: 'table', source: TABLE_PRESETS.educatorEvents.source, columns: [...TABLE_PRESETS.educatorEvents.columns], columnMeta: TABLE_PRESETS.educatorEvents.columnMeta, rowActions: [...(TABLE_PRESETS.educatorEvents.rowActions || [])], tableActions: [...(TABLE_PRESETS.educatorEvents.tableActions || [])], tableActionLabels: [...(TABLE_PRESETS.educatorEvents.tableActionLabels || [])] },
    ],
  },
  {
    id: 'systems',
    label: 'Systems',
    blocks: [
      { kind: 'card', fields: [...TABLE_COLUMNS.systems], editable: true },
    ],
  },
  {
    id: 'action_steps',
    label: 'Action Steps',
    blocks: [
      { kind: 'table', source: TABLE_PRESETS.educatorActionSteps.source, columns: [...TABLE_PRESETS.educatorActionSteps.columns], columnMeta: TABLE_PRESETS.educatorActionSteps.columnMeta, rowActions: [...(TABLE_PRESETS.educatorActionSteps.rowActions || [])], tableActions: [...(TABLE_PRESETS.educatorActionSteps.tableActions || [])], tableActionLabels: [...(TABLE_PRESETS.educatorActionSteps.tableActionLabels || [])] },
    ],
  },
  {
    id: 'notes',
    label: 'Notes',
    blocks: [
      { kind: 'table', source: TABLE_PRESETS.educatorNotes.source, columns: [...TABLE_PRESETS.educatorNotes.columns], columnMeta: TABLE_PRESETS.educatorNotes.columnMeta, rowActions: [...(TABLE_PRESETS.educatorNotes.rowActions || [])], tableActions: [...(TABLE_PRESETS.educatorNotes.tableActions || [])], tableActionLabels: [...(TABLE_PRESETS.educatorNotes.tableActionLabels || [])] },
    ],
  },
  {
    id: 'google_sync',
    label: 'gmail/gCal',
    blocks: [
      { kind: 'card', title: 'Google Sync Settings', fields: ['exclude_from_calendar_logging'], editable: true},
      { kind: 'table', title: 'Gmails', source: TABLE_PRESETS.educatorGmails.source, columns: [...TABLE_PRESETS.educatorGmails.columns], columnMeta: TABLE_PRESETS.educatorGmails.columnMeta, rowActions: [...(TABLE_PRESETS.educatorGmails.rowActions || [])] },
      { kind: 'table', title: 'Calendar Events', source: TABLE_PRESETS.educatorCalendarEvents.source, columns: [...TABLE_PRESETS.educatorCalendarEvents.columns], columnMeta: TABLE_PRESETS.educatorCalendarEvents.columnMeta, rowActions: [...(TABLE_PRESETS.educatorCalendarEvents.rowActions || [])] },
    ],
  },
];



export const EDUCATOR_FIELD_METADATA: FieldMetadataMap = {  
  'id': { label: 'ID', type: 'string' },  
  'full_name': { label: 'Full Name', type: 'string' },
  'first_name': { label: 'First Name', type: 'string', edit: { table: 'people' } },
  'nickname': { label: 'Nickname', type: 'string', edit: { table: 'people' } },
  'middle_name': { label: 'Middle Name', type: 'string', edit: { table: 'people' } },
  'last_name': { label: 'Last Name', type: 'string', edit: { table: 'people' } },
  'pronunciation': { label: 'Pronunciation', type: 'string', edit: { table: 'people' } },
  'primary_phone': { label: 'Primary Phone', type: 'string', edit: { table: 'people' } },
  'primary_phone_other_info': { label: 'Extension or other info (for Primary Phone)', type: 'string', edit: { table: 'people' } },
  'secondary_phone': { label: 'Secondary Phone', type: 'string', edit: { table: 'people' } },
  'secondary_phone_other_info': { label: 'Extension or other info (for Secondary Phone)', type: 'string', edit: { table: 'people' } },
  'home_address': { label: 'Home Address', type: 'string', multiline: true, edit: { table: 'people' } },
  'educ_attainment': { label: 'Educational Attainment', type: 'enum', edit: { table: 'people' , enumName: 'educ_attainment_options'} },
  'primary_languages': { label: 'Primary Languages', type: 'enum', array: true, edit: { table: 'people', enumName: 'languages' } },
  'other_languages': { label: 'Other Languages', type: 'enum', array: true, edit: { table: 'people' , enumName: 'languages'} },
  'race_ethnicity': { label: 'Race/Ethnicity', type: 'enum', array: true, edit: {table: 'people', enumName: 'race_ethnicity_categories'}, lookup: {table: 'ref_race_and_ethnicity', valueColumn: 'value', labelColumn: 'english_label_short'}},
  'race_ethnicity_other': { label: 'Race/Ethnicity - if Other, please specify', type: 'string', edit: { table: 'people' } },
  'gender': { label: 'Gender', type: 'enum', edit: { table: 'people' , enumName: 'gender_categories'} },
  'gender_other': { label: 'Gender - if Other, please specify', type: 'string', edit: { table: 'people' } },
  'hh_income': { label: 'Household Income', type: 'enum', edit: { table: 'people', enumName: 'income_categories' } },
  'childhood_income': { label: 'Childhood Income', type: 'enum', edit: { table: 'people', enumName: 'income_categories' } },
  'lgbtqia': { label: 'LGBTQIA+', type: 'boolean', edit: { table: 'people' } },
  'pronouns': { label: 'Pronouns', type: 'enum', edit: { table: 'people' , enumName: 'pronouns'} },
  'pronouns_other': { label: 'Pronouns - if Other, please specify', type: 'string', edit: { table: 'people' } },
  'indiv_type': { label: 'Type', type: 'string', edit: { table: 'people' } },
  'exclude_from_email_logging': { label: 'Exclude from Email Logging', type: 'boolean', edit: { table: 'people' } },
  'discovery_status': { label: 'Discovery Status', type: 'enum', edit: { table: 'people_educator_early_cultivation', pk: 'people_id' , enumName: 'discovery_statuses'} },
  'assigned_partner': { label: 'Assigned Partner', type: 'string', edit: { table: 'people_educator_early_cultivation', pk: 'people_id'} },
  'first_contact_ages': { label: 'Initial Interest: Ages', type: 'string', edit: { table: 'people_educator_early_cultivation', pk: 'people_id' } },
  'first_contact_governance_model': { label: 'Initial Interest: Governance Model', type: 'string', edit: { table: 'people_educator_early_cultivation', pk: 'people_id' } },
  'first_contact_interests': { label: 'Initial Interest', type: 'string', edit: { table: 'people_educator_early_cultivation', pk: 'people_id' } },
  'first_contact_notes_on_pre_wf_employment': { label: 'Notes on Pre-WF Employment', type: 'string', edit: { table: 'people_educator_early_cultivation', pk: 'people_id' } },
  'first_contact_wf_employment_status': { label: 'Notes on WF Employment Status at first contact', type: 'string', edit: { table: 'people_educator_early_cultivation', pk: 'people_id' } },
  'first_contact_willingness_to_relocate': { label: 'Initial Willingness to Relocate', type: 'boolean', edit: { table: 'people_educator_early_cultivation', pk: 'people_id' } },
  'first_contact_form_notes': { label: 'Initial Interest: Form Notes', type: 'string', edit: { table: 'people_educator_early_cultivation', pk: 'people_id' } },
  'target_geo_combined': { label: 'Target Geography', type: 'string', edit: { table: 'people_educator_early_cultivation', pk: 'people_id' } },
  'self_reflection_doc': { label: 'Self Reflection Document', type: 'attachment', edit: { table: 'people_educator_early_cultivation', pk: 'people_id' } },
  'opsguide_checklist': { label: 'Ops Guide - Checklist', type: 'boolean', edit: { table: 'people_educator_early_cultivation', pk: 'people_id' } },
  'opsguide_fundraising_opps': { label: 'Ops Guide - Fundraising Opportunities', type: 'string', array: true, edit: { table: 'people_educator_early_cultivation', pk: 'people_id' } },
  'opsguide_meeting_prefs': { label: 'Ops Guide - Meeting Preferences', type: 'string', array: true, edit: { table: 'people_educator_early_cultivation', pk: 'people_id' } },
  'opsguide_request_pertinent_info': { label: 'Ops Guide - Request Pertinent Info', type: 'string', array: true, edit: { table: 'people_educator_early_cultivation', pk: 'people_id' } },
  'opsguide_support_type_needed': { label: 'Ops Guide - Support Type Needed', type: 'string', array: true, edit: { table: 'people_educator_early_cultivation', pk: 'people_id' } },
  'sendgrid_template_selected': { label: 'SendGrid Template Selected', type: 'string', edit: { table: 'people_educator_early_cultivation', pk: 'people_id' } },
  'sendgrid_send_date': { label: 'SendGrid Send Date', type: 'date', edit: { table: 'people_educator_early_cultivation', pk: 'people_id' } },
  'routed_to': { label: 'Routed To', type: 'string', edit: { table: 'people_educator_early_cultivation', pk: 'people_id' },lookup: {table: 'guides', valueColumn: 'email_or_name', labelColumn: 'email_or_name'} },
  'assigned_partner_override': { label: 'Assigned Partner Override', type: 'string', edit: { table: 'people_educator_early_cultivation', pk: 'people_id'}, lookup: {table: 'guides', valueColumn: 'email_or_name', labelColumn: 'email_or_name'} },
  'person_responsible_for_follow_up': { label: 'Person Responsible for Follow Up', type: 'string', edit: { table: 'people_educator_early_cultivation', pk: 'people_id' ,}, lookup: {table: 'guides', valueColumn: 'email_or_name', labelColumn: 'email_or_name'} }, 
  'one_on_one_scheduling_status': { label: 'One-on-One Scheduling Status', type: 'string', edit: { table: 'people_educator_early_cultivation', pk: 'people_id' } },
  'personal_email_sent': { label: 'Personal Email Sent', type: 'boolean', edit: { table: 'people_educator_early_cultivation', pk: 'people_id' } },
  'personal_email_sent_date': { label: 'Personal Email Sent Date', type: 'date', edit: { table: 'people_educator_early_cultivation', pk: 'people_id' } },  
  'current_role_at_active_school': { label: 'Current Role at Active School', type: 'string' },  
  'current_role': { label: 'Current Role', type: 'string' },  
  'active_school': { label: 'Active School', type: 'string' },  
  'has_montessori_cert': { label: 'Montessori Certified?', type: 'boolean' },  
  'mont_cert_summary': { label: 'Montessori Certifications', type: 'string' },  
  'primary_email': { label: 'Primary Email', type: 'string' },  
  'most_recent_fillout_form_date': { label: 'Most Recent Fillout Form Date', type: 'date' },  
  'most_recent_event_name': { label: 'Most Recent Event Name', type: 'string' },  
  'most_recent_event_date': { label: 'Most Recent Event Date', type: 'date' },  
  'most_recent_note': { label: 'Most Recent Note', type: 'string' },  
  'most_recent_note_date': { label: 'Most Recent Note Date', type: 'date' },
  'on_connected': { label: 'On Connected', type: 'boolean', edit: { table: 'people_systems', pk: 'people_id' } },
  'on_slack': { label: 'On Slack', type: 'boolean', edit: { table: 'people_systems', pk: 'people_id' } },
  'in_tl_google_grp': { label: 'In TL Google Group', type: 'boolean', edit: { table: 'people_systems', pk: 'people_id' } },
  'in_wf_directory': { label: 'In WF Directory', type: 'boolean', edit: { table: 'people_systems', pk: 'people_id' } },
  'who_initiated_tl_removal': { label: 'Who Initiated TL Removal', type: 'string', edit: { table: 'people_systems', pk: 'people_id' } },
  'on_natl_website': { label: 'On National Website', type: 'enum', edit: { table: 'people_systems', pk: 'people_id',enumName: 'on_national_website_options' } },
  'gsuite_roles': { label: 'G Suite Roles', type: 'enum', edit: { table: 'people_systems', pk: 'people_id',enumName:'gsuite_roles_options' } },
  'most_recent_note_from': { label: 'Most Recent Note From', type: 'string' },
};
