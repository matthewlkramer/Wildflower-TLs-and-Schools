// Generated schema information based on database structure
// This file provides additional type helpers and utilities

import type { Database } from './database.types';

// Table type helpers
export type Tables = Database['public']['Tables'];
export type Views = Database['public']['Views'];
export type Functions = Database['public']['Functions'];

// Individual table types
export type School = Tables['schools']['Row'];
export type SchoolInsert = Tables['schools']['Insert'];
export type SchoolUpdate = Tables['schools']['Update'];

export type Educator = Tables['people']['Row'];
export type EducatorInsert = Tables['people']['Insert'];
export type EducatorUpdate = Tables['people']['Update'];

export type Association = Tables['people_roles_associations']['Row'];
export type AssociationInsert = Tables['people_roles_associations']['Insert'];
export type AssociationUpdate = Tables['people_roles_associations']['Update'];

export type Email = Tables['z_g_emails']['Row'];
export type Event = Tables['z_g_events']['Row'];

export type GovernanceDoc = Tables['governance_docs']['Row'];
export type NineNinety = Tables['nine_nineties']['Row'];

// UI View types (based on actual views from schema)
export type GridSchool = Views['grid_school']['Row'];
export type DetailsSchool = Views['details_schools']['Row'];
export type GridEducator = Views['grid_educator']['Row'];
export type DetailsEducator = Views['details_educators']['Row'];
export type DetailsAssociation = Views['details_associations']['Row'];
export type DetailsCharter = Views['details_charters']['Row'];
export type GridCharter = Views['grid_charter']['Row'];
export type PrimaryEmail = Views['primary_emails']['Row'];

// Legacy aliases for backward compatibility
export type UIGridSchool = GridSchool;
export type UIDetailsSchool = DetailsSchool;
export type UIGridEducator = GridEducator;
export type UIDetailsEducator = DetailsEducator;

// Function types
export type UpdateSchoolFieldArgs = Functions['update_school_field']['Args'];
export type UpdateEducatorFieldArgs = Functions['update_educator_field']['Args'];

// Field mappings for camelCase conversion (based on actual schema)
export const SCHOOL_FIELD_MAP = {
  // Database field -> UI field
  long_name: 'longName',
  short_name: 'shortName',
  governance_model: 'governanceModel',
  ages_served: 'agesServed',
  logo_url: 'logoUrl',
  school_email: 'schoolEmail',
  email_domain: 'emailDomain',
  domain_name: 'domainName',
  school_phone: 'schoolPhone',
  on_national_website: 'onNationalWebsite',
  nonprofit_status: 'nonprofitStatus',
  google_voice: 'googleVoice',
  website_tool: 'websiteTool',
  budget_utility: 'budgetUtility',
  transparent_classroom: 'transparentClassroom',
  admissions_system: 'admissionsSystem',
  tc_admissions: 'tcAdmissions',
  tc_recordkeeping: 'tcRecordkeeping',
  business_insurance: 'businessInsurance',
  bill_account: 'billAccount',
  number_of_classrooms: 'numberOfClassrooms',
  created_by: 'createdBy',
  last_modified: 'lastModified',
  last_modified_by: 'lastModifiedBy',
  enrollment_at_full_capacity: 'enrollmentAtFullCapacity',
  google_workspace_org_unit_path: 'googleWorkspaceOrgUnitPath',
  flexible_tuition_model: 'flexibleTuitionModel',
  about_spanish: 'aboutSpanish',
  hero_image_url: 'heroImageUrl',
  hero_image_2_url: 'heroImage2Url',
  budget_link: 'budgetLink',
  bookkeeper_or_accountant: 'bookkeeperOrAccountant',
  risk_factors: 'riskFactors',
  program_focus: 'programFocus',
  loan_report_name: 'loanReportName',
  current_fy_end: 'currentFyEnd',
  incorporation_date: 'incorporationDate',
  guidestar_listing_requested: 'guidestarListingRequested',
  legal_name: 'legalName',
  nondiscrimination_policy_on_application: 'nondiscriminationPolicyOnApplication',
  nondiscrimination_policy_on_website: 'nondiscriminationPolicyOnWebsite',
  qbo_school_codes: 'qboSchoolCodes',
  membership_termination_steps: 'membershipTerminationSteps',
  automation_notes: 'automationNotes',
  legal_structure: 'legalStructure',
  open_date: 'openDate',
  charter_id: 'charterId',
  school_sched: 'schoolSched',
  public_funding: 'publicFunding',
  founding_tls: 'foundingTls',
} as const;

export const EDUCATOR_FIELD_MAP = {
  // Database field -> UI field (based on actual schema)
  full_name: 'fullName',
  first_name: 'firstName',
  last_name: 'lastName',
  middle_name: 'middleName',
  primary_phone: 'primaryPhone',
  secondary_phone: 'secondaryPhone',
  primary_phone_other_info: 'primaryPhoneOtherInfo',
  secondary_phone_other_info: 'secondaryPhoneOtherInfo',
  google_groups: 'googleGroups',
  home_address: 'homeAddress',
  source_other: 'sourceOther',
  tc_userid: 'tcUserid',
  educ_attainment: 'educAttainment',
  other_languages: 'otherLanguages',
  race_ethnicity_other: 'raceEthnicityOther',
  hh_income: 'hhIncome',
  childhood_income: 'childhoodIncome',
  gender_other: 'genderOther',
  pronouns_other: 'pronounsOther',
  last_modified: 'lastModified',
  indiv_type: 'indivType',
  created_by: 'createdBy',
  exclude_from_email_logging: 'excludeFromEmailLogging',
  race_ethnicity: 'raceEthnicity',
  primary_languages: 'primaryLanguages',
} as const;

export const ASSOCIATION_FIELD_MAP = {
  // Database field -> UI field (based on people_roles_associations table)
  people_id: 'peopleId',
  school_id: 'schoolId',
  charter_id: 'charterId',
  authorizer_id: 'authorizerId',
  role_specific_email: 'roleSpecificEmail',
  loan_fund: 'loanFund',
  email_status: 'emailStatus',
  who_initiated_tl_removal: 'whoInitiatedTlRemoval',
  gsuite_roles: 'gsuiteRoles',
  currently_active: 'currentlyActive',
  created_date: 'createdDate',
  start_date: 'startDate',
  end_date: 'endDate',
} as const;

// Helper functions for field conversion
export function convertSchoolToUI(school: School): DetailsSchool {
  // Convert database school row to details view format
  return {
    id: school.id,
    long_name: school.long_name,
    short_name: school.short_name,
    status: school.status,
    governance_model: school.governance_model,
    prior_names: school.prior_names,
    narrative: school.narrative,
    institutional_partner: school.institutional_partner,
    ages_served: school.ages_served,
    logo: school.logo,
    logo_url: school.logo_url,
    school_calendar: school.school_calendar,
    school_sched: school.school_sched,
    planning_album: school.planning_album,
    school_email: school.school_email,
    email_domain: school.email_domain,
    school_phone: school.school_phone,
    facebook: school.facebook,
    instagram: school.instagram,
    website: school.website,
    number_of_classrooms: school.number_of_classrooms,
    pod: school.pod,
    enrollment_at_full_capacity: school.enrollment_at_full_capacity,
    flexible_tuition_model: school.flexible_tuition_model,
    ein: school.ein,
    legal_name: school.legal_name,
    about: school.about,
    about_spanish: school.about_spanish,
    risk_factors: school.risk_factors,
    watchlist: school.watchlist,
    program_focus: school.program_focus,
    loan_report_name: school.loan_report_name,
    current_fy_end: school.current_fy_end,
    incorporation_date: school.incorporation_date,
    guidestar_listing_requested: school.guidestar_listing_requested,
    nondiscrimination_policy_on_application: school.nondiscrimination_policy_on_application,
    nondiscrimination_policy_on_website: school.nondiscrimination_policy_on_website,
    qbo_school_codes: school.qbo_school_codes,
    membership_termination_steps: school.membership_termination_steps,
    legal_structure: school.legal_structure,
    open_date: school.open_date,
    charter_id: school.charter_id,
    public_funding: school.public_funding,
    founding_tls: school.founding_tls,
    on_national_website: school.on_national_website,
    domain_name: school.domain_name,
    nonprofit_status: school.nonprofit_status,
    google_voice: school.google_voice,
    website_tool: school.website_tool,
    budget_utility: school.budget_utility,
    transparent_classroom: school.transparent_classroom,
    admissions_system: school.admissions_system,
    tc_admissions: school.tc_admissions,
    tc_recordkeeping: school.tc_recordkeeping,
    gusto: school.gusto,
    qbo: school.qbo,
    business_insurance: school.business_insurance,
    bill_account: school.bill_account,
    google_workspace_org_unit_path: school.google_workspace_org_unit_path,
    budget_link: school.budget_link,
    bookkeeper_or_accountant: school.bookkeeper_or_accountant,
    // These fields come from view joins and will be null for base table conversion
    membership_status: null,
    projected_open: null,
    physical_address: null,
    physical_lat: null,
    physical_long: null,
    mailing_address: null,
    current_cohort: null,
    current_guide_name: null,
    total_grants_issued: null,
    total_loans_issued: null,
  };
}

export function convertEducatorToUI(educator: Educator): DetailsEducator {
  // Convert database people row to details view format
  return {
    id: educator.id,
    full_name: educator.full_name,
    first_name: educator.first_name,
    nickname: educator.nickname,
    middle_name: educator.middle_name,
    last_name: educator.last_name,
    primary_phone: educator.primary_phone,
    primary_phone_other_info: educator.primary_phone_other_info,
    secondary_phone: educator.secondary_phone,
    secondary_phone_other_info: educator.secondary_phone_other_info,
    home_address: educator.home_address,
    educ_attainment: educator.educ_attainment,
    primary_languages: educator.primary_languages,
    other_languages: educator.other_languages,
    race_ethnicity_display: null, // Computed in view
    race_ethnicity_other: educator.race_ethnicity_other,
    gender: educator.gender,
    gender_other: educator.gender_other,
    hh_income: educator.hh_income,
    childhood_income: educator.childhood_income,
    lgbtqia: educator.lgbtqia,
    pronouns: educator.pronouns,
    pronouns_other: educator.pronouns_other,
    indiv_type: educator.indiv_type,
    exclude_from_email_logging: educator.exclude_from_email_logging,
    // These fields come from view joins and will be null for base table conversion
    discovery_status: null,
    assigned_partner: null,
    educator_notes_1: null,
    first_contact_ages: null,
    first_contact_governance_model: null,
    first_contact_interests: null,
    first_contact_notes_on_pre_wf_employment: null,
    first_contact_wf_employment_status: null,
    first_contact_willingness_to_relocate: null,
    first_contact_form_notes: null,
    target_geo_combined: null,
    self_reflection_doc: null,
    opsguide_checklist: null,
    opsguide_fundraising_opps: null,
    opsguide_meeting_prefs: null,
    opsguide_request_pertinent_info: null,
    opsguide_support_type_needed: null,
    sendgrid_template_selected: null,
    sendgrid_send_date: null,
    routed_to: null,
    assigned_partner_override: null,
    person_responsible_for_follow_up: null,
    one_on_one_scheduling_status: null,
    personal_email_sent: null,
    personal_email_sent_date: null,
    current_role_at_active_school: null,
    current_role: null,
    active_school: null,
    has_montessori_cert: null,
    kanban_group: null,
    kanban_order: null,
    mont_cert_summary: null,
    primary_email: null,
    most_recent_fillout_form_date: null,
    most_recent_event_name: null,
    most_recent_event_date: null,
    most_recent_note: null,
    most_recent_note_date: null,
    most_recent_note_from: null,
  };
}

// Constants for select options (can be expanded based on your data)
export const SCHOOL_STATUSES = [
  'Planning',
  'Opening',
  'Operating',
  'Closed',
  'On Hold'
] as const;

export const GOVERNANCE_MODELS = [
  'Teacher Led',
  'Board Governed',
  'Hybrid'
] as const;

export const DISCOVERY_STATUSES = [
  'Prospect',
  'Active',
  'On Hold',
  'Not a Fit',
  'Placed'
] as const;

export const KANBAN_GROUPS = [
  'New',
  'In Progress',
  'Ready',
  'Complete'
] as const;

export type SchoolStatus = typeof SCHOOL_STATUSES[number];
export type GovernanceModel = typeof GOVERNANCE_MODELS[number];
export type DiscoveryStatus = typeof DISCOVERY_STATUSES[number];
export type KanbanGroup = typeof KANBAN_GROUPS[number];