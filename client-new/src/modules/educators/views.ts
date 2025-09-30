import { view, tab, card, table } from '../shared/views/builders';
import type { ViewSpec } from '../shared/views/types';

export const EDUCATOR_VIEW_SPEC: ViewSpec = view(
  'educators',
  tab(
    'overview',
    'Overview',
    card(['full_name', 'primary_phone', 'primary_email'], { title: 'Name and Contact Info', editable: false }),
    card(['current_role', 'active_school'], { title: 'Current Role and School', editable: false }),
    card(['discovery_status', 'assigned_partner', 'has_montessori_cert', 'mont_cert_summary'], { title: 'SSJ and Training', editable: false }),
    card(['most_recent_fillout_form_date', 'most_recent_event_name', 'most_recent_event_date', 'most_recent_note', 'most_recent_note_date', 'most_recent_note_from'], { title: 'Recent Activity', editable: false }),
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
);

