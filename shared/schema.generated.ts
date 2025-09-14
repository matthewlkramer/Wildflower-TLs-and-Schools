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

// UI View types
export type UIGridSchool = Views['ui_grid_schools']['Row'];
export type UIDetailsSchool = Views['ui_details_school']['Row'];
export type UIGridEducator = Views['ui_grid_educators']['Row'];
export type UIDetailsEducator = Views['ui_details_educator']['Row'];
export type UISchoolEmail = Views['ui_school_emails']['Row'];
export type UISchoolEvent = Views['ui_school_events']['Row'];
export type UIEducatorEmail = Views['ui_educator_emails']['Row'];
export type UIEducatorEvent = Views['ui_educator_events']['Row'];

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
export function convertSchoolToUI(school: School): any {
  // Convert database school row to UI format
  // Will be properly typed once views schema is available
  return {
    ...school,
    name: school.long_name || school.short_name,
    longName: school.long_name,
    shortName: school.short_name,
    governanceModel: school.governance_model,
    agesServed: school.ages_served,
    logoUrl: school.logo_url,
    schoolEmail: school.school_email,
    phone: school.school_phone,
    email: school.school_email,
    website: school.website,
    about: school.about,
    aboutSpanish: school.about_spanish,
    projectedOpen: school.open_date,
    membershipStatus: school.nonprofit_status, // Approximate mapping
    physicalAddress: null, // Will come from locations table
    mailingAddress: null, // Will come from locations table
    archived: false, // Not in current schema
    created_at: school.created || new Date().toISOString(),
    updated_at: school.last_modified || new Date().toISOString(),
  };
}

export function convertEducatorToUI(educator: Educator): any {
  // Convert database people row to UI format
  // Will be properly typed once views schema is available
  return {
    ...educator,
    fullName: educator.full_name,
    firstName: educator.first_name,
    lastName: educator.last_name,
    middleName: educator.middle_name,
    nickname: educator.nickname,
    primaryEmail: null, // Not in current people schema - comes from associations
    nonWildflowerEmail: null, // Not in current people schema
    primaryPhone: educator.primary_phone,
    secondaryPhone: educator.secondary_phone,
    homeAddress: educator.home_address,
    discoveryStatus: null, // Not in current people schema
    hasMontessoriCert: null, // Comes from montessori_certs table
    raceEthnicity: educator.race_ethnicity,
    raceEthnicityDisplay: null, // Computed field
    raceEthnicityOther: educator.race_ethnicity_other,
    primaryLanguages: educator.primary_languages,
    otherLanguages: educator.other_languages,
    educationalAttainment: educator.educ_attainment,
    householdIncome: educator.hh_income,
    incomeBackground: educator.childhood_income,
    gender: educator.gender,
    genderOther: educator.gender_other,
    lgbtqia: educator.lgbtqia,
    pronouns: educator.pronouns,
    pronounsOther: educator.pronouns_other,
    kanbanGroup: null, // Not in current people schema
    kanbanOrder: null, // Not in current people schema
    inactiveFlag: null, // Not in current people schema
    indivType: educator.indiv_type,
    excludeFromEmailLogging: educator.exclude_from_email_logging,
    targetGeo: null, // Not in current people schema
    tags: educator.tags,
    created_at: educator.created || new Date().toISOString(),
    updated_at: educator.last_modified || new Date().toISOString(),
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