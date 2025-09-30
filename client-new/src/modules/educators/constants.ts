// Grid section
import type { GridColumnConfig, FieldMetadataMap } from '../shared/detail-types';

export type { ColumnVisibility, GridValueKind } from '../shared/detail-types';
export type EducatorColumnConfig = GridColumnConfig;
// Legacy detail tab types removed; views define tabs now.

// Grid and kanban constants now live in views.ts
export const EDUCATOR_FIELD_METADATA: FieldMetadataMap = {  
  'full_name': { editable: false},
  'primary_phone_other_info': { label: 'Extension or other info (for Primary Phone)'},
  'secondary_phone_other_info': { label: 'Extension or other info (for Secondary Phone)'},
  'home_address': { multiline: true },
  'educ_attainment': { label: 'Educational Attainment' },
  'race_ethnicity': { label: 'Race/Ethnicity', lookup: {table: 'ref_race_and_ethnicity', valueColumn: 'value', labelColumn: 'english_label_short'}},
  'race_ethnicity_other': { label: 'Race/Ethnicity - if Other, please specify', visibleIf: { field: 'race_ethnicity', in: ['Other'] } },
  'gender_other': { label: 'Gender - if Other, please specify', visibleIf: { field: 'gender', in: ['Other'] } },
  'hh_income': { label: 'Household Income'},
  'lgbtqia': { label: 'LGBTQIA+'},
  'pronouns_other': { label: 'Pronouns - if Other, please specify'},
  'indiv_type': { label: 'Type'},
  'discovery_status': { writeTable: 'people_educator_early_cultivation' },
  'assigned_partner': { editable: false},
  'first_contact_ages': { label: 'Initial Interest: Ages', writeTable: 'people_educator_early_cultivation'},
  'first_contact_governance_model': { label: 'Initial Interest: Governance Model', writeTable: 'people_educator_early_cultivation'},
  'first_contact_interests': { label: 'Initial Interest', writeTable: 'people_educator_early_cultivation'},
  'first_contact_notes_on_pre_wf_employment': { label: 'Notes on Pre-WF Employment', writeTable: 'people_educator_early_cultivation'},
  'first_contact_wf_employment_status': { label: 'Notes on WF Employment Status at first contact', writeTable: 'people_educator_early_cultivation' },
  'first_contact_willingness_to_relocate': { label: 'Initial Willingness to Relocate', writeTable: 'people_educator_early_cultivation' },
  'target_geo_combined': { label: 'Target Geography', writeTable: 'people_educator_early_cultivation' },
  'self_reflection_doc': { label: 'Self Reflection Document', type: 'attachment', writeTable: 'people_educator_early_cultivation' },
  'opsguide_initial_contact_date': { label: 'Ops Guide - Initial Contact Date', writeTable: 'people_educator_early_cultivation' },
  'opsguide_checklist': { label: 'Ops Guide - Checklist', writeTable: 'people_educator_early_cultivation' },
  'opsguide_fundraising_opps': { label: 'Ops Guide - Fundraising Opportunities', writeTable: 'people_educator_early_cultivation'} ,
  'opsguide_meeting_prefs': { label: 'Ops Guide - Meeting Preferences', writeTable: 'people_educator_early_cultivation' },
  'opsguide_request_pertinent_info': { label: 'Ops Guide - Request Pertinent Info', writeTable: 'people_educator_early_cultivation'},
  'opsguide_support_type_needed': { label: 'Ops Guide - Support Type Needed', writeTable: 'people_educator_early_cultivation'},
  'sendgrid_template_selected': { writeTable: 'people_educator_early_cultivation'},
  'sendgrid_send_date': { writeTable: 'people_educator_early_cultivation' },
  'routed_to': { writeTable: 'people_educator_early_cultivation', lookup: {table: 'guides', valueColumn: 'email_or_name', labelColumn: 'email_or_name'} },
  'assigned_partner_override': { writeTable: 'people_educator_early_cultivation', lookup: {table: 'guides', valueColumn: 'email_or_name', labelColumn: 'email_or_name'} },
  'person_responsible_for_follow_up': { writeTable: 'people_educator_early_cultivation', lookup: {table: 'guides', valueColumn: 'email_or_name', labelColumn: 'email_or_name'} }, 
  'one_on_one_scheduling_status': { label: 'One-on-One Scheduling Status', writeTable: 'people_educator_early_cultivation', lookup: { table: 'ref_one_on_one_status', valueColumn: 'value', labelColumn: 'label' } },
  'personal_email_sent': { writeTable: 'people_educator_early_cultivation'},
  'personal_email_sent_date': { writeTable: 'people_educator_early_cultivation'},  
  'current_role_at_active_school': { label: 'Current Role at Active School' , editable: false },  
  'current_role': { editable: false },  
  'active_school': { editable: false },  
  'has_montessori_cert': { label: 'Montessori Certified?', type: 'boolean' ,editable: false },  
  'cert_levels_rev': { label: 'Montessori Certifications'},  
  'primary_email': { editable: false },  
  'most_recent_fillout_form_date': { editable: false},  
  'most_recent_event_name': { editable: false},   
  'most_recent_event_date': { editable: false},   
  'most_recent_note': { editable: false},  
  'most_recent_note_date': { editable: false},
  'most_recent_note_from': { editable: false }
};
