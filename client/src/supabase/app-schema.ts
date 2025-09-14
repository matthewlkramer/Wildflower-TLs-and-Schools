import { z } from 'zod';

// -------------------------------------------------
// Core options pulled from Supabase enums
// -------------------------------------------------
export const SCHOOLS_OPTIONS_AGESSERVED = [
  '0-3', '3-6', '6-9', '9-12', '12-15', '15-18',
] as const;

export const SCHOOLS_OPTIONS_GOVERNANCEMODEL = [
  'Independent',
  'Charter',
  'Community Partnership',
  'District',
  'Exploring Charter',
] as const; // omit 'NULL' from enum for UI

// -------------------------------------------------
// Schools
// -------------------------------------------------

export interface School {
  id: string;
  // Names (views expose multiple variants; base table likely stores name/shortName)
  name?: string | null;
  shortName?: string | null;
  school_name?: string | null; // grid view label

  // Status/Stage (from views/related tables)
  status?: string | null;
  stage_status?: string | null;
  membershipStatus?: string | null;
  projected_open?: string | null; // date string

  // Contact/info
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  about?: string | null;

  // Classification
  governanceModel?: (typeof SCHOOLS_OPTIONS_GOVERNANCEMODEL)[number] | string | null;
  agesServed?: (typeof SCHOOLS_OPTIONS_AGESSERVED)[number][] | string[] | null;
  all_ages_served?: string | null; // grid view string

  // Misc
  currentTLs?: string[] | string | null;
  archived?: boolean | null;

  // Anything else from views
  [key: string]: unknown;
}

export const SCHOOLS_SCHEMA = z.object({
  name: z.string().trim().min(1, 'School name is required').optional(),
  shortName: z.string().trim().optional(),
  agesServed: z.array(z.enum(SCHOOLS_OPTIONS_AGESSERVED)).optional().default([]),
  governanceModel: z.enum(SCHOOLS_OPTIONS_GOVERNANCEMODEL).optional(),
  about: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Enter a valid email').optional().or(z.literal('')),
  website: z.string().optional(),
  membershipStatus: z.string().optional(),
});

export type SchoolInsert = z.infer<typeof SCHOOLS_SCHEMA>;
export type SchoolUpdate = Partial<SchoolInsert>;

// -------------------------------------------------
// Educators (people)
// -------------------------------------------------

export interface Educator {
  id: string;
  fullName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  nonWildflowerEmail?: string | null;
  primaryPhone?: string | null;
  homeAddress?: string | null;

  // Display-only fields used in grids/views
  has_montessori_cert?: boolean | null;
  race_ethnicity_display?: string | null;
  discovery_status?: string | null;
  indiv_type?: string | null;
  kanban_group?: string | null;
  kanban_order?: number | null;
  archived?: boolean | null;

  [key: string]: unknown;
}

export const EDUCATORS_SCHEMA = z.object({
  fullName: z.string().optional(), // computed server-side sometimes
  firstName: z.string().trim().optional(),
  lastName: z.string().trim().optional(),
  nonWildflowerEmail: z.string().email('Enter a valid email').optional().or(z.literal('')),
  primaryPhone: z.string().optional(),
  homeAddress: z.string().optional(),
});

export type EducatorInsert = z.infer<typeof EDUCATORS_SCHEMA>;
export type EducatorUpdate = Partial<EducatorInsert>;

// -------------------------------------------------
// Row mappers (from details_* views) → camelCase
// -------------------------------------------------

export function mapDetailsEducatorRow(row: Record<string, any> | null | undefined): Educator | null {
  if (!row) return null;
  const out: any = { ...row };
  const setIfMissing = (key: string, ...alts: string[]) => {
    if (out[key] !== undefined && out[key] !== null) return;
    for (const a of alts) { if (row[a] !== undefined && row[a] !== null) { out[key] = row[a]; return; } }
  };
  setIfMissing('fullName', 'full_name', 'name');
  setIfMissing('firstName', 'first_name');
  setIfMissing('lastName', 'last_name');
  setIfMissing('middleName', 'middle_name');
  setIfMissing('nickname', 'nickname');
  setIfMissing('discoveryStatus', 'discovery_status');
  setIfMissing('primaryPhone', 'primary_phone');
  setIfMissing('primaryPhoneOtherInfo', 'primary_phone_other_info');
  setIfMissing('secondaryPhone', 'secondary_phone');
  setIfMissing('secondaryPhoneOtherInfo', 'secondary_phone_other_info');
  setIfMissing('homeAddress', 'home_address');
  setIfMissing('pronouns', 'pronouns');
  setIfMissing('pronounsOther', 'pronouns_other');
  setIfMissing('gender','gender');
  setIfMissing('genderOther', 'gender_other');
  setIfMissing('lgbtqia','lgbtqia');
  setIfMissing('raceEthnicity', 'race_ethnicity');
  setIfMissing('raceEthnicityOther', 'race_ethnicity_other');
  setIfMissing('primaryLanguages', 'primary_languages');
  setIfMissing('otherLanguages', 'other_languages');
  setIfMissing('educationalAttainment', 'educ_attainment');
  setIfMissing('householdIncome', 'hh_income');
  setIfMissing('incomeBackground', 'childhood_income');
  setIfMissing('indivType', 'indiv_type');
  setIfMissing('excludeFromEmailLogging', 'exclude_from_email_logging');
  setIfMissing('inactiveFlag', 'inactive_flag');
  setIfMissing('firstContactAges', 'first_contact_ages');
  setIfMissing('firstContactGovernance', 'first_contact_governance_model');
  setIfMissing('firstContactInterests', 'first_contact_interests');
  setIfMissing('firstContactNotesOnPreWildflowerEmployment', 'first_contact_notes_on_pre_wf_employment');
  setIfMissing('firstContactWFSchoolEmploymentStatus', 'first_contact_wf_employment_status');
  setIfMissing('firstContactRelocate', 'first_contact_willingness_to_relocate');
  setIfMissing('firstContactFormNotes', 'first_contact_form_notes');
  setIfMissing('opsGuideSpecificsChecklist', 'opsguide_checklist');
  setIfMissing('opsGuideFundraisingOps', 'opsguide_fundraising_opps');
  setIfMissing('opsGuideMeetingPrefTime', 'opsguide_meeting_prefs');
  setIfMissing('opsGuideReqPertinentInfo', 'opsguide_request_pertinent_info');
  setIfMissing('opsGuideSupportTypeNeeded', 'opsguide_support_type_needed');
  setIfMissing('targetGeo', 'target_geo_combined');
  setIfMissing('selfReflectionDoc', 'self_reflection_doc');
  setIfMissing('sendGridTemplateSelected', 'sendgrid_template_selected');
  setIfMissing('sendGridSendDate', 'sendgrid_send_date');
  setIfMissing('routedTo', 'routed_to');
  setIfMissing('assignedPartnerOverride', 'assigned_partner_override');
  setIfMissing('personResponsibleForFollowUp', 'person_responsible_for_follow_up');
  setIfMissing('oneOnOneSchedulingStatus', 'one_on_one_scheduling_status');
  setIfMissing('personalEmailSent', 'personal_email_sent');
  setIfMissing('personalEmailSentDate', 'personal_email_sent_date');
  setIfMissing('currentRole', 'current_role');
  setIfMissing('activeSchool', 'active_school');
  setIfMissing('currentRoleAtActiveSchool', 'current_role_at_active_school');
  setIfMissing('montessoriCertified', 'has_montessori_cert');
  setIfMissing('activeSchoolStageStatus', 'stage_status');
  setIfMissing('kanbanGroup', 'kanban_group');
  setIfMissing('kanbanOrder', 'kanban_order');
  setIfMissing('certSummary', 'cert_summary');
  setIfMissing('primaryEmail', 'primary_email');
  setIfMissing('mostRecentFilloutFormDate', 'most_recent_fillout_form_date');
  setIfMissing('mostRecentEventName', 'most_recent_event_name');
  setIfMissing('mostRecentEventDate', 'most_recent_event_date');
  setIfMissing('mostRecentNote', 'most_recent_note');
  setIfMissing('mostRecentNoteDate', 'most_recent_note_date');
  setIfMissing('mostRecentNoteFrom', 'most_recent_note_from');
  return out as Educator;
}

// -------------------------------------------------
// Educator-School Associations (people_roles_associations)
// -------------------------------------------------

export interface EducatorSchoolAssociation {
  id?: string;
  schoolId: string;
  educatorId: string;
  role?: string[] | null; // UI uses array of role shorts
  startDate?: string | null; // ISO date string
  endDate?: string | null;
  emailAtSchool?: string | null;
  isActive?: boolean | null;
}

export const EDUCATOR_SCHOOL_ASSOCIATION_SCHEMA = z.object({
  schoolId: z.string().min(1, 'School is required'),
  educatorId: z.string().min(1, 'Educator is required'),
  role: z.array(z.string()).optional(),
  startDate: z.string().optional(),
  emailAtSchool: z.string().email('Enter a valid email').optional().or(z.literal('')),
  isActive: z.boolean().optional(),
});

export type EducatorSchoolAssociationInsert = z.infer<typeof EDUCATOR_SCHOOL_ASSOCIATION_SCHEMA>;
export type EducatorSchoolAssociationUpdate = Partial<EducatorSchoolAssociationInsert>;

export function mapDetailsSchoolRow(row: Record<string, any> | null | undefined): School | null {
  if (!row) return null;
  const out: any = { ...row };
  const setIfMissing = (key: string, ...alts: string[]) => {
    if (out[key] !== undefined && out[key] !== null) return;
    for (const a of alts) { if (row[a] !== undefined && row[a] !== null) { out[key] = row[a]; return; } }
  };
  setIfMissing('longName', 'long_name');
  setIfMissing('shortName', 'short_name');
  setIfMissing('status', 'status');
  setIfMissing('governanceModel', 'governance_model');
  setIfMissing('priorNames', 'prior_names');
  setIfMissing('programFocus', 'program_focus');
  setIfMissing('narrative', 'narrative');
  setIfMissing('institutionalPartner', 'institutional_partner');
  setIfMissing('agesServed', 'ages_served');
  setIfMissing('planningAlbum', 'planning_album');
  setIfMissing('numberOfClassrooms', 'number_of_classrooms');
  setIfMissing('enrollmentCap', 'enrollment_at_full_capacity');
  setIfMissing('schoolCalendar', 'school_calendar');
  setIfMissing('schoolSchedule', 'school_sched');
  setIfMissing('schoolEmail', 'school_email');
  setIfMissing('schoolPhone', 'school_phone');
  setIfMissing('emailDomain', 'email_domain','domain_name');
  setIfMissing('website', 'website');
  setIfMissing('facebook', 'facebook');
  setIfMissing('instagram', 'instagram');
  setIfMissing('pod', 'pod');
  setIfMissing('flexibleTuitionModel', 'flexible_tuition_model');
  setIfMissing('about', 'about');
  setIfMissing('aboutSpanish', 'about_spanish');
  setIfMissing('riskFactors', 'risk_factors');
  setIfMissing('watchList', 'watch_list');
  setIfMissing('legalStructure', 'legal_structure');
  setIfMissing('legalName', 'legal_name');
  setIfMissing('loanReportName', 'loan_report_name');
  setIfMissing('EIN', 'ein');
  setIfMissing('currentFYEnd', 'current_fy_end');
  setIfMissing('incorporationDate', 'incorporation_date');
  setIfMissing('guidestarListingRequested', 'guidestar_listing_requested');
  setIfMissing('nondiscriminationPolicyOnWebsite', 'nondiscrimination_policy_on_website');
  setIfMissing('nondiscriminationPolicyOnApplication', 'nondiscrimination_policy_on_application');
  setIfMissing('qboSchoolCodes', 'qbo_school_codes');
  setIfMissing('membershipTerminationSteps', 'membership_termination_steps');
  setIfMissing('charterId', 'charter_id');
  setIfMissing('publicFunding', 'public_funding');
  setIfMissing('foundingTLs', 'founding_tls');
  setIfMissing('onNationalWebsite', 'on_national_website');
  setIfMissing('googleVoice', 'google_voice');
  setIfMissing('websiteTool', 'website_tool');
  setIfMissing('budgetUtility', 'budget_utility');
  setIfMissing('transparentClassroom', 'transparent_classroom');
  setIfMissing('admissionsSystem', 'admissions_system');
  setIfMissing('tcAdmissions', 'tc_admissions');
  setIfMissing('tcRecordKeeping', 'tc_recordkeeping');
  setIfMissing('nonprofitStatus', 'nonprofit_status');
  setIfMissing('openDate', 'open_date');
  setIfMissing('projectedOpen', 'projected_open', 'proj_open_date');
  setIfMissing('cohort', 'current_cohort');
  setIfMissing('guideName', 'current_guide_name');
  setIfMissing('logo', 'logo');
  setIfMissing('logoUrl', 'logo_url');
  setIfMissing('gusto', 'gusto');
  setIfMissing('qbo', 'qbo');
  setIfMissing('businessInsurance', 'business_insurance');
  setIfMissing('billAccount', 'bill_account');
  setIfMissing('googleWorkspaceOrgUnitPath', 'google_workspace_org_unit_path');
  setIfMissing('budgetLink', 'budget_link');
  setIfMissing('bookkeeperOrAccountant', 'bookkeeper_or_accountant');
  setIfMissing('ssjTargetCity', 'ssj_target_city');
  setIfMissing('ssjTargetState', 'ssj_target_state');
  setIfMissing('enteredVisioningDate', 'entered_visioning_date');
  setIfMissing('enteredPlanningDate', 'entered_planning_date');
  setIfMissing('enteredStartupDate', 'entered_startup_date');
  setIfMissing('ssjStage', 'ssj_stage');
  setIfMissing('ssjReadinessToOpenRating', 'ssj_readiness_to_open_rating');
  setIfMissing('ssjNameReserved', 'ssj_name_reserved');
  setIfMissing('ssjHasPartner', 'ssj_has_partner');
  setIfMissing('ssjBoardDevelopment', 'ssj_board_development');
  setIfMissing('ssjFacility', 'ssj_facility');
  setIfMissing('ssjOnTrackForEnrollment', 'ssj_on_track_for_enrollment');
  setIfMissing('ssjBudgetReadyForNextSteps', 'ssj_budget_ready_for_next_steps');
  setIfMissing('ssjSeekingWFFunding', 'ssj_seeking_wf_funding');
  setIfMissing('ssjAdviceGiversTLs', 'ssj_advice_givers_tls');
  setIfMissing('ssjAdviceGiversPartners', 'ssj_advice_givers_partners');
  setIfMissing('ssjFundraisingNarrative', 'ssj_fundraising_narrative');
  setIfMissing('ssjPathwayToFunding', 'ssj_pathway_to_funding');
  setIfMissing('ssjTotalStartupFundingNeeded', 'ssj_total_startup_funding_needed');
  setIfMissing('ssjLoanEligibility', 'ssj_loan_eligibility');
  setIfMissing('ssjLoanApprovedAmt', 'ssj_loan_approved_amt');
  setIfMissing('ssjAmountRaised', 'ssj_amount_raised');
  setIfMissing('ssjGapInFunding', 'ssj_gap_in_funding');
  setIfMissing('ssjDateSharedWithN4G', 'ssj_date_shared_with_n4g');
  setIfMissing('ssjProjOpenSchoolYear', 'ssj_proj_open_school_year');
  setIfMissing('ssjTool', 'ssj_tool');
  setIfMissing('ssjBuilding4GoodStatus', 'ssj_building4good_status');
  setIfMissing('building4GoodFirmAndAttorney', 'building4good_firm_and_attorney');
  setIfMissing('visioningAlbumComplete', 'visioning_album_complete');
  setIfMissing('visioningAlbum', 'visioning_album');
  setIfMissing('logoDesigner', 'logo_designer');
  setIfMissing('nameSelectionProposal', 'name_selection_proposal');
  setIfMissing('trademarkFiled', 'trademark_filed');
  setIfMissing('ssjOpsGuideSupportTrack', 'ssj_ops_guide_support_track');
  setIfMissing('membershipStatus', 'membership_status_after_action');
  setIfMissing('physicalAddress', 'physical_address');
  setIfMissing('physicalLat', 'physical_lat');
  setIfMissing('physicalLong', 'physical_long');
  setIfMissing('mailingAddress', 'mailing_address');
  setIfMissing('currentCohort', 'current_cohort');
  setIfMissing('guideName', 'current_guide_name');
  setIfMissing('totalGrantsIssued', 'total_grants_issued');
  setIfMissing('totalLoansIssued', 'total_loans_issued');
  return out as School;
}

// -------------------------------------------------
// Charters (grid view-backed; minimal shape for UI typing)
// -------------------------------------------------

export interface Charter {
  id: string;
  shortName?: string | null;
  fullName?: string | null;
  city?: string | null;
  status?: string | null;
  assignedPartner?: string | null;
  [key: string]: unknown;
}

// Back-compat aliases frequently used in components
export type Teacher = Educator;
export interface TeacherSchoolAssociation extends EducatorSchoolAssociation {}

// Misc referenced entity stubs for typing only (extend as needed)
export interface SchoolNote { id: string; [key: string]: unknown }
export interface ActionStep { id: string; [key: string]: unknown }
export interface GovernanceDocument { id: string; [key: string]: unknown }
export interface ReportSubmission { id: string; [key: string]: unknown }
export interface EventAttendance { id: string; [key: string]: unknown }
export interface EmailAddress { id: string; [key: string]: unknown }
export interface CharterApplication { id: string; [key: string]: unknown }
export interface CharterAuthorizerContact { id: string; [key: string]: unknown }
export interface NineNineties { id: string; [key: string]: unknown }
export interface AssessmentData { id: string; [key: string]: unknown }
export interface CharterRole { id: string; [key: string]: unknown }
export interface SSJFilloutForm { id: string; [key: string]: unknown }
export interface Grant { id: string; [key: string]: unknown }
export interface Location { id: string; [key: string]: unknown }
export interface Tax990 { id: string; [key: string]: unknown }

export function mapDetailsCharterRow(row: Record<string, any> | null | undefined): Charter | null {
  if (!row) return null;
  const out: any = { ...row };
  const setIfMissing = (key: string, ...alts: string[]) => {
    if (out[key] !== undefined && out[key] !== null) return;
    for (const a of alts) { if (row[a] !== undefined && row[a] !== null) { out[key] = row[a]; return; } }
  };
  setIfMissing('shortName', 'short_name');
  setIfMissing('fullName', 'full_name');
  setIfMissing('status', 'status');
  setIfMissing('initialTargetAges', 'initial_target_ages');
  setIfMissing('initialTargetCommunity', 'initial_target_community');
  setIfMissing('projectedOpen', 'projected_open');
  return out as Charter;
}
