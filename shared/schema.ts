// Generated schema from Airtable Metadata table
// Generated on 2025-09-09T17:55:35.627Z
// This file is auto-generated. Do not edit manually.

import { z } from 'zod';

// Base utility types
export interface BaseRecord {
  id: string;
  created: string;
  lastModified: string;
}

// Utility types for complex fields
export interface AirtableAttachment {
  id: string;
  filename: string;
  url: string;
  type: string;
  size: number;
}

export interface AirtableUser {
  id: string;
  name: string;
  email: string;
}

// Search and location interfaces
export interface SearchableRecord extends BaseRecord {
  searchTerms?: string[];
}

export interface LocationBased {
  latitude?: number;
  longitude?: number;
  address?: string;
  city?: string;
  state?: string;
}

// Utility functions
export function createBaseTransformer<T extends BaseRecord>(
  record: any,
  customFields: Partial<T>
): T {
  return {
    id: record.id,
    created: String(record.fields?.Created || record.fields?.['Created time'] || new Date().toISOString()),
    lastModified: String(record.fields?.['Last Modified'] || record.fields?.['Last modified'] || record.fields?.['Last modified time'] || new Date().toISOString()),
    ...customFields,
  } as T;
}

export function firstId(val: any): string | undefined {
  if (val === undefined || val === null || val === '') return undefined;
  if (Array.isArray(val)) return String(val[0] ?? '');
  return String(val);
}

export function toNumber(val: any): number | undefined {
  if (val === undefined || val === null || val === '') return undefined;
  const n = Number(val);
  return isNaN(n) ? undefined : n;
}

export function toStringArray(val: any): string[] | undefined {
  if (val === undefined || val === null || val === '') return undefined;
  if (Array.isArray(val)) return val.map((v) => String(v || ''));
  return [String(val)];
}

export function toYesBool(val: any): boolean {
  if (typeof val === 'boolean') return val;
  if (typeof val === 'string') return val.trim().toLowerCase() === 'yes';
  return Boolean(val);
}

export function firstAttachment(attachments: any): { filename?: string; url?: string } | undefined {
  if (!Array.isArray(attachments) || attachments.length === 0) return undefined;
  const a = attachments[0] || {};
  return { filename: a.filename, url: a.url };
}

export function createdAt(fields: any): string {
  return String(fields["Created"] || fields["Created time"] || new Date().toISOString());
}

export function updatedAt(fields: any): string {
  return String(fields["Last Modified"] || fields["Last modified"] || fields["Last modified time"] || new Date().toISOString());
}

// Generated Field Mappings

export const PARTNERS_COPY_FIELDS = {
  roles: "Roles",
  emailTemplates: "Email templates",
  educatorRecordIds: "Educator Record IDs",
  grants5: "Grants 5",
  guideAssignments: "Guide assignments",
  shortName: "Short name",
  publicWebsiteActive: "Public website active",
  websiteBio: "Website bio",
  educatorNotes: "Educator notes",
  startDateFromStints: "Start Date (from Stints)",
  endDateFromStints: "End Date (from Stints)",
  currentlyActive: "Currently active",
  slackHandle: "Slack handle",
  actionSteps: "Action steps",
  dob: "DOB",
  recordId: "Record ID",
  photo: "Photo",
  activeStint: "Active stint",
  tls: "TLs",
  phone: "Phone",
  papyrsProfile: "Papyrs profile",
  stintTypeFromStints: "Stint type (from Stints)",
  name: "Name",
  homeAddress: "Home address",
  schools: "Schools",
  schoolNotes: "School notes",
  email: "Email",
  guidedSchoolRecordId: "Guided School Record ID",
  ssjProcessDetails: "SSJ Process Details",
  personalEmail: "Personal Email",
  syncedRecordId: "Synced Record ID",
  imageUrl: "Image URL",
  membershipTerminationStepsAndDates: "Membership termination steps and dates",
  copperUserid: "Copper userID",
  emailOrName: "email or name",
} as const;

export const SSJ_FILLOUT_FORMS_FIELDS = {
  isInterestedInCharterFromEmail: "Is Interested in Charter (from Email)",
  tempMCertCert1: "Temp - M Cert Cert 1",
  socioeconomicGenderOther: "Socio-Economic: Gender Other",
  tempMCertLevel3: "Temp - M Cert Level 3",
  socioeconomicRaceEthnicityOther: "Socio-Economic: Race & Ethnicity Other",
  montessoriCertificationCertifier2: "Montessori Certification Certifier 2",
  receiveCommunications: "Receive Communications",
  socioeconomicRaceEthnicity: "Socio-Economic: Race & Ethnicity",
  communityMemberInterest: "Community Member Interest",
  montessoriCertificationYear3: "Montessori Certification Year 3",
  tempMCertYear4: "Temp - M Cert Year 4",
  statusOfProcessingMontessoriCerts: "Status of Processing Montessori Certs",
  tempMCertYear2: "Temp - M Cert Year 2",
  contactTypeStandardized: "Contact Type standardized",
  city: "City",
  marketingCampaign: "Marketing Campaign",
  stateStandardized: "State Standardized",
  montessoriCertQ: "Montessori Cert Q",
  tempMCertLevel4: "Temp - M Cert Level 4",
  primaryLanguage: "Primary Language",
  firstName: "First Name",
  initialOutreacher: "Initial Outreacher",
  country2: "Country 2",
  tempMCertCert3: "Temp - M Cert Cert 3",
  assignedPartnerOverride: "Assigned Partner Override",
  montessoriCertificationLevel1: "Montessori Certification Level 1",
  state2: "State 2",
  socioeconomicHouseholdIncome: "Socio-Economic: Household Income",
  montessoriCertificationYear4: "Montessori Certification Year 4",
  routedTo: "Routed To",
  socioeconomicGender: "Socio-Economic: Gender",
  entryDate: "Entry Date",
  tempMCertLevel2: "Temp - M Cert Level 2",
  marketingSource: "Marketing Source",
  sendgridSentDate: "SendGrid sent date",
  city2: "City 2",
  ssjfilloutformid: "ssj_fillout_form_id",
  montessoriCertificationLevel3: "Montessori Certification Level 3",
  montessoriCertificationYear2: "Montessori Certification Year 2",
  fullName: "Full Name",
  educatorInterestsOther: "Educator Interests Other",
  isSeekingMontessoriCertification: "Is Seeking Montessori Certification",
  email: "Email",
  sendgridTemplateId: "SendGrid template id",
  assignedPartnerFromEducators: "Assigned Partner (from Educators)",
  genderStandardized: "Gender standardized",
  educatorId: "educator_id",
  montessoriCertificationYear1: "Montessori Certification Year 1",
  montessoriCertificationCertifier1: "Montessori Certification Certifier 1",
  tempMCertYear1: "Temp - M Cert Year 1",
  communityMemberCommunityInfo: "Community Member Community Info",
  communityMemberSupportFindingTeachers: "Community Member Support Finding Teachers",
  sourceForNontls: "Source for non-TLs",
  formVersion: "Form version",
  socioeconomicLgbtqiaIdentifyingFromEmail: "Socio-Economic: LGBTQIA Identifying (from Email)",
  tempMCertCert2: "Temp - M Cert Cert 2",
  communityMemberSelfInfo: "Community Member Self Info",
  ssjFilloutFormKey: "SSJ FIllout Form key",
  tempMCertYear3: "Temp - M Cert Year 3",
  educators: "Educators",
  linkToStartASchool: "Link to Start a School",
  personResponsibleForFollowUp: "Person responsible for follow up",
  socioeconomicPronounsOther: "Socio-Economic: Pronouns Other",
  country: "Country",
  emailSentByInitialOutreacher: "Email sent by Initial Outreacher?",
  sourceOther: "Source - other",
  lastName: "Last Name",
  state: "State",
  socioeconomicPronouns: "Socio-Economic: Pronouns",
  contactType: "Contact Type",
  isMontessoriCertified: "Is Montessori Certified",
  tempMCertCert4: "Temp - M Cert Cert 4",
  montessoriCertificationLevel2: "Montessori Certification Level 2",
  tempMCertLevel1: "Temp - M Cert Level 1",
  primaryLanguageOther: "Primary Language Other",
  oneOnOneStatus: "One on one status",
  interestedInCharter: "Interested in charter",
  montessoriCertificationCertifier3: "Montessori Certification Certifier 3",
  message: "Message",
  source: "Source",
  montessoriCertificationCertifier4: "Montessori Certification Certifier 4",
} as const;

export const MARKETING_SOURCES_MAPPING_FIELDS = {
  recid: "recID",
  educatorsOptions: "Educators options",
  educatorsOther: "Educators other",
  filloutOptions: "Fillout options",
} as const;

export const CHARTER_APPLICATIONS_FIELDS = {
  capacityInterviewComplete: "Capacity Interview Complete",
  capacityInterviewProjectedDate: "Capacity Interview Projected Date",
  charter: "Charter",
  letterOfIntentDeadline: "Letter of Intent deadline",
  nonprofitStatus: "Nonprofit status",
  authorizerDecisionRecd: "Authorizer decision rec'd",
  targetCommunityFromCharter: "Target community (from Charter)",
  finalBudget: "Final budget",
  currentTlDiscoveryStatus: "Current TL discovery status",
  likelihoodOfOpeningOnTime: "Likelihood of opening on time",
  authorizerDecision: "Authorizer decision",
  shortName: "Short Name",
  budgetPlanningExercises: "Budget planning exercises",
  fullName: "Full Name",
  charterappid: "charter_app_id",
  milestones: "Milestones",
  membershipStatusOfSchools: "Membership status of schools",
  grades: "Grades",
  charterAppKey: "Charter App key",
  letterOfIntentReqd: "Letter of Intent req'd",
  authorizerDecisionExpectedDate: "Authorizer decision expected date",
  keyDates: "Key dates",
  expectedDecision: "Expected decision",
  opportunitiesAndChallenges: "Opportunities and challenges",
  OfStudents: "# of students",
  appSubmissionDeadline: "App submission deadline",
  likelihoodOfAuthorization: "Likelihood of authorization",
  currentTlsFromSchoolsFromCharter: "Current TLs (from Schools) (from Charter)",
  landscapeAnalysisFromCharter: "Landscape analysis (from Charter)",
  charterAppProjectMgmtPlanComplete: "Charter app project mgmt plan complete",
  appSubmitted: "App submitted",
  charterDesign: "Charter design",
  mostRecentApplication: "Most recent application",
  boardMembershipAgreementSigned: "Board membership agreement signed",
  targetOpen: "Target open",
  beginningAge: "Beginning age",
  cohortsFromCharter: "Cohorts (from Charter)",
  logicModelComplete: "Logic model complete",
  endingAge: "Ending age",
  charterDesignAdviceSessionComplete: "Charter Design Advice Session Complete",
  loi: "LOI",
  loiSubmitted: "LOI submitted",
  authorizer: "Authorizer",
  charterAppRolesIdd: "Charter app roles ID'd",
  communityEngagementPlanLaunched: "Community engagement plan launched",
  jointKickoffMeetingComplete: "Joint kickoff meeting complete",
  supportTimeline: "Support timeline",
  status: "Status",
  capacityInterviewTrainingComplete: "Capacity interview training complete",
  charterlevelMembershipAgreementSigned: "Charter-level membership agreement signed",
  charterAppWalkthrough: "Charter app walkthrough",
  tlMembershipAgreementSigned: "TL membership agreement signed",
  applicationWindow: "Application window",
  charterId: "charter_id",
  internalWfSupportLaunchMeeting: "Internal WF support launch meeting",
  jointKickoffMeeting: "Joint kickoff meeting",
} as const;

export const SCHOOLS_FIELDS = {
  numberOfClassrooms: "Number of classrooms",
  lease: "Lease",
  gusto: "Gusto",
  enrollmentAtFullCapacity: "Enrollment at Full Capacity",
  ssjIsTheSchoolPlanningToApplyForInternalWildflowerFunding: "SSJ - Is the school planning to apply for internal Wildflower funding?",
  guideEmail: "Guide email",
  locationid: "location_id",
  emailDomain: "Email Domain",
  ssjCohortStatus: "SSJ - Cohort Status",
  visioningAlbumComplete: "Visioning album complete",
  transparentClassroom: "Transparent Classroom",
  ssjOriginalProjectedOpenDate: "SSJ - Original Projected Open Date",
  latinxFromFamilySurvey: "Latinx (from Family Survey)",
  logoUrl: "Logo URL",
  globalMajority: "global majority",
  ssjGapInFunding: "SSJ - Gap in Funding",
  planningAlbum: "Planning album",
  countOfActiveMailingAddresses: "Count of Active Mailing Addresses",
  websiteTool: "Website tool",
  charterId: "charter_id",
  schoolEmail: "School Email",
  ssjLoanEligibility: "SSJ - Loan eligibility",
  facebook: "Facebook",
  currentPhysicalAddress: "Current Physical Address",
  ssjProjOpenSchoolYearBackup: "SSJ - Proj Open School Year - Backup",
  primaryContactEmail: "Primary Contact Email",
  locations: "Locations",
  frl: "FRL",
  guideassignmentid: "guide_assignment_id",
  opened: "Opened",
  governanceModel: "Governance Model",
  leaseEndDate: "Lease End Date",
  enteredPlanningDate: "Entered Planning Date",
  dateWithdrawnFromGroupExemption: "Date withdrawn from Group Exemption",
  nondiscriminationPolicyOnApplication: "Nondiscrimination Policy on Application",
  ssjIsTheBudgetAtAStageThatWillAllowTheEtlsToTakeTheirNextSteps: "SSJ - Is the budget at a stage that will allow the ETL(s) to take their next steps?",
  emailAtSchoolFromEducatorsXSchools: "Email at School (from Educators x Schools)",
  mediumIncome: "Medium Income",
  legalName: "Legal Name",
  agreementVersion: "Agreement Version ",
  familysurveyid: "family_survey_id",
  isThereA2022990: "Is there a 2022 990?",
  highIncomeFromFamilySurvey: "High Income (from Family Survey)",
  groupExemptionStatus: "Group exemption status",
  nineNinetiesAttachment: "Nine Nineties attachment",
  membershipAgreementDate: "Membership Agreement date",
  lowIncome: "Low Income",
  currentTls: "Current TLs",
  OfFormsSent: "# of forms sent",
  shortName: "Short Name",
  flexibleTuitionModel: "Flexible Tuition Model",
  grantsWf: "Grants (WF)",
  googleVoice: "Google Voice",
  grantid: "grant_id",
  schoolNotes: "School notes",
  signedMembershipAgreement: "Signed Membership Agreement",
  ssjFacility: "SSJ - Facility",
  ssjTargetCity: "SSJ - Target City",
  nondiscriminationPolicyOnWebsite: "Nondiscrimination Policy on Website",
  nativeAmericanFromFamilySurvey: "Native American (from Family Survey)",
  agesServed: "Ages served",
  ssjIsTheTeamOnTrackForTheirEnrollmentGoals: "SSJ - Is the team on track for their enrollment goals?",
  building4goodFirmAttorney: "Building4Good Firm & Attorney",
  enteredVisioningDate: "Entered Visioning Date",
  primaryContactId: "Primary Contact ID",
  raceEthnicityFromEducatorViaEducatorsXSchools: "Race & Ethnicity (from Educator) (via Educators x Schools)",
  schoolStatus: "School Status",
  nineninetyid: "nine_ninety_id",
  leftNetworkDate: "Left Network Date",
  activeGuides: "Active guides",
  tcRecordkeeping: "TC Recordkeeping",
  lastModified: "Last Modified",
  ssjDoesTheSchoolHaveAViablePathwayToFunding: "SSJ - Does the school have a viable pathway to funding?",
  logo: "Logo",
  currentPhysicalAddressState: "Current Physical Address - State",
  created: "Created",
  billcomAccount: "Bill.com account",
  instagram: "Instagram",
  ein: "EIN",
  loanFromLoansIssueMethod: "Loan (from Loans - Issue Method)",
  currentPhysicalAddressCity: "Current Physical Address - City",
  bookkeeperAccountant: "Bookkeeper / Accountant",
  ssjLoanApprovedAmt: "SSJ - Loan approved amt",
  logoDesigner: "Logo designer",
  foundingDocuments: "Founding Documents",
  ssjDateSharedWithN4gFromSsjProcessDetails: "SSJ - Date shared with N4G (from SSJ Process Details)",
  tcAdmissions: "TC Admissions",
  ssjBuilding4goodStatus: "SSJ - Building4Good Status",
  narrative: "Narrative",
  currentMailingAddress: "Current Mailing Address",
  ssjTotalStartupFundingNeeded: "SSJ - Total Startup Funding Needed",
  schoolContactEmails: "School Contact Emails",
  OfAsianAmericanStudents: "% of Asian American students",
  budgetUtility: "Budget Utility",
  ssjWhatIsTheNextBigDecisionOrActionThisSchoolIsWorkingOn: "SSJ - What is the next big decision or action this school is working on?",
  dateReceivedGroupExemption: "Date received group exemption",
  pod: "Pod",
  legalStructure: "Legal structure",
  OfAfricanAmericanStudents: "% of African American students",
  archived: "Archived",
  incorporationDate: "Incorporation Date",
  activelongitude: "activeLongitude",
  ssjSsjTool: "SSJ - SSJ Tool",
  leftNetworkReason: "Left Network Reason",
  about: "About",
  ssjReadinessToOpenRating: "SSJ - Readiness to Open Rating",
  ssjFundraisingNarrative: "SSJ - Fundraising narrative",
  tcSchoolId: "TC school ID",
  ssjBoardDevelopment: "SSJ - Board development",
  charter: "Charter",
  fullNameFromFoundersList: "Full Name (from Founders List)",
  institutionalPartner: "Institutional partner",
  primaryContacts: "Primary Contacts",
  countofactiveguides: "CountofActiveGuides",
  schoolPhone: "School Phone",
  actionstepid: "action_step_id",
  charterShortName: "Charter Short Name",
  dedupeSchoolWith: "Dedupe school with",
  educatorsxschoolsid: "educatorsXschools_id",
  guidestarListingRequested: "GuideStar Listing Requested?",
  whiteFromFamilySurvey: "White (from Family Survey)",
  priorNames: "Prior Names",
  guideAssignments: "Guide assignments",
  schoolnoteid: "school_note_id",
  website: "Website",
  OfStudents: "# of Students",
  schoolSchedule: "School schedule",
  ssjTargetState: "SSJ - Target State",
  domainName: "Domain Name",
  educators: "Educators",
  name: "Name",
  trademarkFiled: "Trademark filed",
  activelatitude: "activeLatitude",
  googleWorkspaceOrgUnitPath: "Google Workspace Org Unit Path",
  aboutSpanish: "About Spanish",
  loanid: "loan_id",
  loanReportName: "Loan Report Name",
  currentFyEnd: "Current FY end",
  ssjProjectedOpen: "SSJ - Projected Open",
  middleEastern: "Middle Eastern",
  businessInsurance: "Business Insurance",
  onNationalWebsite: "On national website",
  qbo: "QBO",
  ssjStage: "SSJ Stage",
  nonprofitStatus: "Nonprofit status",
  admissionsSystem: "Admissions System",
  ssjHasTheEtlIdentifiedAPartner: "SSJ - Has the ETL identified a partner?",
  ssjNameReserved: "SSJ - Name Reserved",
  pacificIslanderFromFamilySurvey: "Pacific Islander (from Family Survey)",
  countOfActivePhysicalAddresses: "Count of Active Physical Addresses",
  automationNotes: "Automation notes",
  membershipStatus: "Membership Status",
  enteredStartupDate: "Entered Startup Date",
  ssjAmountRaised: "SSJ - Amount raised",
  nameSelectionProposal: "Name Selection Proposal",
  schoolCalendar: "School calendar",
  educatorsXSchools: "Educators x Schools",
} as const;

export const EDUCATORS_FIELDS = {
  householdIncome: "Household Income",
  otherLanguages: "Other languages",
  statusForActiveSchool: "Status for Active School",
  assignedPartnerOverrideFromSsjFilloutForms: "Assigned Partner Override (from SSJ Fillout Forms)",
  trainingGrants: "Training Grants",
  startupStageForActiveSchool: "Startup Stage for Active School",
  primaryContactFor: "Primary contact for",
  activeHolaspirit: "Active Holaspirit",
  nickname: "Nickname",
  educatorNotes: "Educator notes",
  ssjfilloutformid: "ssj_fillout_form_id",
  routedTo: "Routed to",
  gender: "Gender",
  assignedPartner: "Assigned Partner",
  firstContactNotesOnPrewildflowerEmployment: "First contact - Notes on pre-Wildflower employment",
  alsoAPartner: "Also a partner",
  stagestatusForActiveSchool: "Stage_Status for Active School",
  montessoriLeadGuideTrainings: "Montessori lead guide trainings",
  assignedPartnerEmail: "Assigned Partner Email",
  lastModified: "Last Modified",
  raceEthnicity: "Race & Ethnicity",
  notesFromEducatorNotes: "Notes (from Educator notes)",
  montessoriCertifications: "Montessori Certifications",
  targetInternational: "Target - international",
  genderOther: "Gender - Other",
  educatorsxschoolsid: "educatorsXschools_id",
  sourceOther: "Source - other",
  certifierFromMontessoriCertifications: "Certifier (from Montessori Certifications)",
  survey2022WildflowerNetworkSurvey: "survey - 2022 Wildflower Network Survey",
  pronouns: "Pronouns",
  archived: "Archived",
  educatorsAtSchools: "Educators at Schools",
  currentPrimaryEmailAddress: "Current Primary Email Address",
  emailSentByInitialOutreacher: "Email sent by initial outreacher",
  secondaryPhone: "Secondary phone",
  pronunciation: "Pronunciation",
  eventsAttended: "Events attended",
  currentlyActiveSchool: "Currently Active School",
  montessoriCertified: "Montessori Certified",
  firstContactInitialInterests: "First contact - initial interests",
  schoolAddress: "School Address",
  currentRole: "Current Role",
  middleName: "Middle Name",
  lgbtqia: "LGBTQIA",
  certificationLevelsFromMontessoriCertifications: "Certification Levels (from Montessori Certifications)",
  opsGuideRequestPertinentInfo: "Ops Guide Request Pertinent Info",
  activeSchoolAffiliationStatus: "Active School Affiliation Status",
  montessoricertid: "montessori_cert_id",
  pronounsOther: "Pronouns - Other",
  dedupeWith: "Dedupe with",
  lastName: "Last Name",
  educatornotesid: "educator_notes_id",
  raceEthnicityOther: "Race & Ethnicity - Other",
  targetState: "Target state",
  created: "Created",
  entryDateFromSsjFilloutForms: "Entry Date (from SSJ Fillout Forms)",
  tcUserId: "TC User ID",
  emailid: "email_id",
  countOfGetInvolvedForms: "Count of Get Involved Forms",
  contactFormDetailsFromSsjDataOnEducators: "Contact Form Details (from SSJ data on educators)",
  newsletterAndGroupSubscriptions: "Newsletter and Group Subscriptions",
  homeAddress: "Home Address",
  cohorts: "Cohorts",
  source: "Source",
  countoflinkedschools: "CountofLinkedSchools",
  educationalAttainment: "Educational Attainment",
  messageFromSsjFilloutForms: "Message (from SSJ Fillout Forms)",
  opsGuideAnyFundraisingOpportunities: "Ops Guide Any fundraising opportunities?",
  primaryLanguage: "Primary Language",
  fullName: "Full Name",
  firstName: "First Name",
  onSchoolBoard: "On school board",
  discoveryStatus: "Discovery status",
  firstContactWfSchoolEmploymentStatus: "First contact - WF School employment status",
  primaryPhone: "Primary phone",
  activeSchoolRecordId: "Active School Record ID",
  individualType: "Individual Type",
  educatorId: "educator_id",
  onboardingExperience: "Onboarding Experience",
  firstContactWillingnessToRelocate: "First contact - Willingness to relocate",
  assignedPartnerShortName: "Assigned Partner Short Name",
  targetCity: "Target city",
  schoolStatuses: "School Statuses",
  currentlyActiveAtASchool: "Currently Active at a School?",
  oneOnOneStatus: "One on one status",
  allSchools: "All Schools",
  ssjoldstartaschoolid: "ssj_old_start_a_school_id",
  excludeFromEmailLogging: "Exclude from email logging",
  incomeBackground: "Income Background",
} as const;

export const SSJ_TYPEFORMS_START_A_SCHOOL_FIELDS = {
  ssjDataOnEducators: "SSJ data on educators",
  registeredFromEventAttendance: "Registered (from Event attendance)",
  firstName: "First Name",
  socioeconomicPrimaryLanguage: "Socio-Economic: Primary Language",
  receiveCommunications: "Receive Communications",
  contactLocationState: "Contact Location: State",
  montessoriCertificationYear: "Montessori Certification Year",
  createdAt: "Created At",
  message: "Message",
  source: "Source",
  socioeconomicPronounsOther: "Socio-Economic: Pronouns Other",
  socioeconomicPronouns: "Socio-Economic: Pronouns",
  entryDate: "Entry Date",
  ssjFilloutFormGetInvolved2: "SSJ Fillout Form: Get Involved 2",
  tags: "Tags",
  educator: "Educator",
  schoolLocationCity: "School Location: City",
  ssjFilloutFormGetInvolved: "SSJ Fillout Form: Get Involved",
  schoolLocationState: "School Location: State",
  socioeconomicGender: "Socio-Economic: Gender",
  montessoriCertificationCertifier: "Montessori Certification Certifier",
  timeAtEventFromEventAttendance: "Time at event (from Event attendance)",
  socioeconomicRaceEthnicity: "Socio-Economic: Race & Ethnicity",
  schoolLocationCountry: "School Location: Country",
  initialInterestInGovernanceModel: "Initial Interest in Governance Model",
  socioeconomicRaceEthnicityOther: "Socio-Economic: Race & Ethnicity Other",
  ageClassroomsInterestedInOffering: "Age Classrooms Interested In Offering",
  isInterestedInCharter: "Is Interested in Charter",
  attendedFromEventAttendance: "Attended (from Event attendance)",
  isSeekingMontessoriCertification: "Is Seeking Montessori Certification",
  schoolLocationCommunity: "School Location: Community",
  equityReflection: "Equity Reflection",
  socioeconomicLgbtqiaIdentifying: "Socio-Economic: LGBTQIA Identifying",
  socioeconomicHouseholdIncome: "Socio-Economic: Household Income",
  contactLocationCountry: "Contact Location: Country",
  socioeconomicGenderOther: "Socio-Economic: Gender Other",
  hasInterestInJoiningAnotherSchool: "Has Interest in Joining Another School",
  isWillingToMove: "Is Willing to Move",
  contactLocationCity: "Contact Location: City",
  lastName: "Last Name",
  isMontessoriCertified: "Is Montessori Certified",
  recordIdFromEventParticipantFromEventAttendance: "Record ID (from Event Participant) (from Event attendance)",
  montessoriCertificationLevels: "Montessori Certification Levels",
} as const;

export const SCHOOL_NOTES_FIELDS = {
  schoolnoteid: "school_note_id",
  createdBy: "Created by",
  schoolId: "school_id",
  partnerShortName: "Partner Short Name",
  headlineNotes: "Headline (Notes)",
  school: "School",
  schoolNoteKey: "School Note Key",
  charterId: "charter_id",
  partnersCopy: "Partners copy",
  notes: "Notes",
  dateCreated: "Date created",
  private: "Private",
} as const;

export const MEMBERSHIP_TERMINATION_STEPS_FIELDS = {
  initialTcCondition: "Initial TC condition",
  deactivateListservs: "Deactivate listservs",
  deactivateGsuiteTargetDate: "Deactivate GSuite target date",
  deactivateWildflowerschoolsorgProfile: "Deactivate wildflowerschools.org profile",
  deactivateWildflowerschoolsorgProfileTargetDate: "Deactivate wildflowerschools.org profile target date",
  deactivateWebsiteTargetDate: "Deactivate website target date",
  initialGustoCondition: "Initial Gusto condition",
  initialSlackCondition: "Initial Slack condition",
  deactivateSlackTargetDate: "Deactivate Slack target date",
  terminationTriggerDate: "Termination trigger date",
  initialQboCondition: "Initial QBO condition",
  deactivateListservsTargetDate: "Deactivate listservs target date",
  deactivateGroupExemption: "Deactivate Group Exemption",
  deactivateTc: "Deactivate TC",
  deactivateGroupExemptionTargetDate: "Deactivate Group Exemption target date",
  schoolContactEmailsFromSchool: "School Contact Emails (from School)",
  deactivateWebsite: "Deactivate website",
  deactivateSlack: "Deactivate Slack",
  initialWebsiteCondition: "Initial website condition",
  updateAirtableFields: "Update Airtable fields",
  deactivateGustoTargetDate: "Deactivate Gusto target date",
  initialGroupExemptionCondition: "Initial Group Exemption condition",
  deactivateGusto: "Deactivate Gusto",
  membershipTerminationLetterFromSchool: "Membership termination letter (from School)",
  deactivateQboTargetDate: "Deactivate QBO target date",
  deactivateQbo: "Deactivate QBO",
  deactivateGsuite: "Deactivate GSuite",
  deactivateTcTargetDate: "Deactivate TC target date",
} as const;

export const LOCATIONS_FIELDS = {
  geocodeAutomationLastRunAt: "Geocode Automation Last Run At",
  country: "Country",
  qualifiedLowIncomeCensusTract: "Qualified Low Income Census Tract",
  street: "Street",
  address: "Address",
  lease: "Lease",
  timeZone: "Time Zone",
  endOfTimeAtLocation: "End of time at location",
  locationKey: "Location Key",
  censusTract: "Census Tract",
  squareFeet: "Square feet",
  neighborhood: "Neighborhood",
  schoolStatusFromSchool: "School Status (from School)",
  longitude: "Longitude",
  charter: "Charter",
  state: "State",
  currentPhysicalAddress: "Current physical address?",
  maxStudentsLicensedFor: "Max Students Licensed For",
  postalCode: "Postal code",
  latitude: "Latitude",
  leaseEndDate: "Lease End Date",
  locationid: "location_id",
  lastModified: "Last Modified",
  locationType: "Location type",
  school: "School",
  charterId: "charter_id",
  city: "City",
  currentMailingAddress: "Current mailing address?",
  inactiveWithoutEndDateOrActiveWithEndDate: "Inactive without end date; or active with end date",
  colocationType: "Co-Location Type",
  created: "Created",
  startOfTimeAtLocation: "Start of time at location",
  shortName: "Short Name",
  colocationPartner: "Co-Location Partner ",
  schoolId: "school_id",
} as const;

export const EVENT_ATTENDANCE_FIELDS = {
  ageClassroomsInterestedInOfferingFromEventParticipant: "Age Classrooms Interested in Offering (from Event Participant)",
  educatorsAtSchoolsFromEventParticipant: "Educators at Schools (from Event Participant)",
  startedSsjCompletedSsjTypeform: "Started SSJ? (completed SSJ typeform)",
  currentSchoolFromEventParticipant2: "Current School (from Event Participant) 2",
  ssjTypeformsStartASchoolFromEventParticipant: "SSJ Typeforms: Start a School (from Event Participant)",
  network: "Network",
  registrationDate: "Registration Date",
  countofloggedplanningsFromEventParticipant: "CountofLoggedPlannings (from Event Participant)",
  stageChangeFromDiscoveryToVisioningFromEventParticipant: "Stage change from Discovery to Visioning (from Event Participant)",
  entryDateFromStartASchoolFormFromEducators: "Entry Date (from Start a School form) (from Educators)",
  registered: "Registered",
  attended: "Attended",
  createdFromEventParticipant2: "Created (from Event Participant) 2",
  currentSchoolFromEventParticipant: "Current School (from Event Participant)",
  statusFromEventParticipant2: "Status (from Event Participant) 2",
  tlStoriesRace: "TL Stories Race",
  montessoriCertifiedFromEventParticipant: "Montessori Certified (from Event Participant)",
  tlStoriesQ1: "TL Stories Q1",
  tlStoriesQ2: "TL Stories Q2",
  sourceFromSsjTypeformsStartASchoolFromEventParticipant: "Source (from SSJ Typeforms: Start a School) (from Event Participant)",
  eventType: "Event Type",
  ageClassroomsInterestedInOfferingFromEventParticipant2: "Age Classrooms Interested in Offering (from Event Participant) 2",
  incomeBackgroundFromEventParticipant: "Income Background (from Event Participant)",
  phone: "Phone",
  hubFromEventParticipant2: "Hub (from Event Participant) 2",
  fullNameFromEventParticipant: "Full Name (from Event Participant)",
  countofloggeddiscoverFromEventParticipant: "CountofLoggedDiscover (from Event Participant)",
  educatorId: "educator_id",
  assignedPartnerFromEventParticipant2: "Assigned Partner (from Event Participant) 2",
  householdIncomeFromEventParticipant2: "Household Income (from Event Participant) 2",
  tlStoriesSchoolTarget: "TL Stories School Target",
  stageChangeFromVisioningToPlanningFromEventParticipant: "Stage change from visioning to planning (from Event Participant)",
  stageFromEventParticipant: "Stage (from Event Participant)",
  educatorsAtSchoolsFromEventParticipant2: "Educators at Schools (from Event Participant) 2",
  educatorRecordCreated: "Educator record created",
  eventName: "Event Name",
  timeAtEvent: "Time at event",
  schoolStatusFromEventParticipant: "School Status (from Event Participant)",
  eventAttendanceKey: "Event Attendance key",
  whenDidTheySwitchToVisioning: "When did they switch to visioning",
  raceEthnicityFromEventParticipant: "Race & Ethnicity (from Event Participant)",
  hubFromEventParticipant: "Hub (from Event Participant)",
  eventParticipant: "Event Participant",
  statusFromEventParticipant: "Status (from Event Participant)",
  hubNameFromEventParticipant: "Hub Name (from Event Participant)",
  marketingSource: "Marketing source",
  householdIncomeFromEventParticipant: "Household Income (from Event Participant)",
  event: "Event",
  incomeBackgroundFromEventParticipant2: "Income Background (from Event Participant) 2",
  assignedPartnerFromEventParticipant: "Assigned Partner (from Event Participant)",
  montessoriCertificationsFromEventParticipant: "Montessori Certifications (from Event Participant)",
  createdDate: "Created date",
  firstVisioningFromEventParticipant: "First visioning (from Event Participant)",
  raceEthnicityFromEventParticipant2: "Race & Ethnicity (from Event Participant) 2",
  tlStoriesType: "TL Stories Type",
  createdFromEventParticipant: "Created (from Event Participant)",
  countofloggedvisioningFromEventParticipant: "CountofLoggedVisioning (from Event Participant)",
  schoolStatusFromEventParticipant2: "School Status (from Event Participant) 2",
  needsSpanishTranslation: "needs spanish translation",
} as const;

export const LEAD_ROUTING_AND_TEMPLATES_FIELDS = {
  state: "State",
  sendgridTemplateId: "SendGrid Template ID",
  geotype: "Geo-type",
  cc: "cc",
  source: "Source",
  name: "Name",
  sender: "Sender",
} as const;

export const COHORTS_FIELDS = {
  charters: "Charters",
  cohortName: "Cohort Name",
  schools: "Schools",
  startDate: "Start Date",
  programType: "Program Type",
} as const;

export const EVENTS_FIELDS = {
  date: "Date",
  eventName: "Event Name",
  type: "Type",
  eventid: "event_id",
  attendees: "Attendees",
} as const;

export const BOARD_SERVICE_FIELDS = {
  communityMemberName: "Community Member Name",
  contactEmailFromEducator: "Contact Email (from Educator)",
  startDate: "Start Date",
  endDate: "End Date",
  communityMemberEmail: "Community Member Email",
  currentlyActive: "Currently Active",
  chair: "Chair",
} as const;

export const SUPABASE_JOIN_990_WITH_SCHOOL_FIELDS = {
  shortname: "short_name",
  id: "id",
  nineNinetiesYear: "Nine Nineties Year",
} as const;

export const CHARTERS_FIELDS = {
  locationIdFromLocations: "Location ID (from Locations)",
  schools: "Schools",
  charterAssessments: "Charter assessments",
  incorporationDate: "Incorporation Date",
  status: "Status",
  shortName: "Short Name",
  contactEmailFromExternalInitiators: "Contact Email (from External Initiator(s))",
  cohorts: "Cohorts",
  currentlyActiveFromNontlRoles: "Currently active (from Non-TL roles)",
  charterlevelMembershipAgreementSigned: "Charter-level membership agreement signed",
  landscapeAnalysis: "Landscape analysis",
  firstSiteOpened: "First site opened",
  targetOpenFromCharterApplications: "Target open (from Charter applications)",
  membershipStatusOfSchools: "Membership status of schools",
  nonprofitStatus: "Nonprofit status",
  currentTlsFromSchools: "Current TLs (from Schools)",
  linkedSchools: "Linked Schools",
  recordIdFromSchools: "Record ID (from Schools)",
  locations: "Locations",
  supportTimeline: "Support timeline",
  application: "Application",
  initialTargetAges: "Initial target ages",
  nondiscriminationPolicyOnWebsite: "Nondiscrimination Policy on Website",
  docIdFromSchoolGovernanceDocuments: "Doc ID (from School governance documents)",
  tlDiscoveryStatus: "TL discovery status",
  currentFyEnd: "Current FY end",
  guidestarListingRequested: "GuideStar Listing Requested?",
  recidFromCharterApplications: "recID (from Charter applications)",
  dateReceivedGroupExemption: "Date received group exemption",
  nameFromNontlRoles: "Name (from Non-TL roles)",
  authorized: "Authorized",
  charterKey: "Charter key",
  projectedOpen: "Projected open",
  partnershipWithWfStarted: "Partnership with WF started",
  initialTargetCommunity: "Initial target community",
  nontlRoles: "Non-TL roles",
  website: "Website",
  charterlevelMembershipAgreement: "Charter-level membership agreement",
  recidFromCharterAuthorizersAndContacts: "recId (from Charter authorizers and contacts)",
  schoolGovernanceDocuments: "School governance documents",
  annualEnrollmentAndDemographics: "Annual enrollment and demographics",
  recidFromSchoolReports: "RecID (from School reports)",
  schoolReports: "School reports",
  groupExemptionStatus: "Group Exemption Status",
  nineNinetiesId: "Nine nineties Record ID (from Nine nineties)",
  charterId: "charter_id",
  schoolProvidedWith1023RecordkeepingRequirements: "School provided with 1023 recordkeeping requirements",
  charterassessmentid: "charter_assessment_id",
  fullName: "Full name",
  ein: "EIN",
  roleFromNontlRoles: "Role (from Non-TL roles)",
  initialTargetAgesLink: "Initial target ages link",
} as const;

export const QBO_SCHOOL_CODES_FIELDS = {
  customerIdInQbo: "Customer ID in QBO",
  schools: "Schools",
  schoolNameInQbo: "School Name in QBO",
} as const;

export const ACTION_STEPS_FIELDS = {
  assigneeShortName: "Assignee Short Name",
  completedDate: "Completed date",
  schoolShortName: "School Short Name",
  partnersCopy: "Partners copy",
  schoolStatus: "School Status",
  schools: "Schools",
  actionstepid: "action_step_id",
  dueDate: "Due date",
  assignee: "Assignee",
  ssjStage: "SSJ Stage",
  assignedDate: "Assigned date",
  schoolId: "school_id",
  charterId: "charter_id",
  status: "Status",
  item: "Item",
} as const;

export const GUIDES_FIELDS = {
  stintTypeFromStints: "Stint type (from Stints)",
  educatorRecordIds: "Educator Record IDs",
  photo: "Photo",
  name: "Name",
  email: "Email",
  papyrsProfile: "Papyrs profile",
  phone: "Phone",
  educatorLog: "Educator Log",
  personalEmail: "Personal Email",
  imageUrl: "Image URL",
  slackHandle: "Slack handle",
  roles: "Roles",
  dob: "DOB",
  copperUserid: "Copper userID",
  guideAssignments: "Guide assignments",
  homeAddress: "Home address",
  emailOrName: "email or name",
  leadRouting: "Lead Routing",
  shortName: "Short name",
  membershipTerminationStepsAndDates: "Membership termination steps and dates",
  ssjProcessDetails: "SSJ Process Details",
  guidedSchoolRecordId: "Guided School Record ID",
  startDateFromStints: "Start Date (from Stints)",
  activeStint: "Active stint",
  websiteBio: "Website bio",
  recordId: "Record ID",
  currentlyActive: "Currently active",
  endDateFromStints: "End Date (from Stints)",
  publicWebsiteActive: "Public website active",
} as const;

export const CHARTER_ROLES_FIELDS = {
  charterApplications: "Charter applications",
  email: "Email",
  title: "Title",
  charterId: "charter_id",
  raceEthnicityFromEducatorRecord: "Race & Ethnicity (from Educator record)",
  startDate: "Start date",
  role: "Role",
  charterRoleKey: "Charter role key",
  currentPrimaryEmailAddressFromEducatorRecord: "Current Primary Email Address (from Educator record)",
  phone: "Phone",
  endDate: "End date",
  currentlyActive: "Currently active",
  name: "Name",
  statusFromCharter: "Status (from Charter)",
  educatorRecord: "Educator record",
  charterApplications2: "Charter applications 2",
  charterroleid: "charter_role_id",
  charter: "Charter",
} as const;

export const MONTESSORI_CERTS_FIELDS = {
  certifierOther: "Certifier - Other",
  educatorId: "educator_id",
  level: "Level",
  yearCertified: "Year Certified",
  abbreviation: "Abbreviation",
  certificationStatus: "Certification Status",
  created: "Created",
} as const;

export const GRANTS_FIELDS = {
  proofOf501c3StatusAtTimeOfGrant: "Proof of 501(c)3 status at time of grant",
  grantStatus: "Grant Status",
  fundingPurposeForGrantAgreement: "Funding purpose (for grant agreement)",
  guideentrepreneurShortName: "GuideEntrepreneur Short Name",
  schoolContactEmailsFromSchool: "School Contact Emails (from School)",
  notes: "Notes",
  prelimAdviceRequestTime: "Prelim advice request time",
  haveDataToIssueGrantLetter: "Have data to issue grant letter",
  fullAdviceOpenObjections: "Full Advice Open Objections",
  mailingAddress: "Mailing address",
  issueDate: "Issue Date",
  signedGrantAgreement: "Signed Grant Agreement",
  fullAdviceRequestTime: "Full advice request time",
  fullAdviceYeses: "Full Advice Yeses",
  schoolId: "school_id",
  readyToAcceptGrant501c3Ein: "Ready to accept grant (501c3 + EIN)",
  grantid: "grant_id",
  prelimAdviceYeses: "Prelim Advice Yeses",
  fundingPeriodForGrantAgreement: "Funding period (for grant agreement)",
  tlsAtTimeOfGrant: "TLs at time of grant",
  membershipStatusFromSchool: "Membership Status (from School)",
  membershipStatusAtTimeOfGrant: "Membership status at time of grant",
  tlEmails: "TL emails",
  legalNameOfSchool: "Legal Name of School",
  legalNameAtTimeOfGrant: "Legal Name at time of grant",
  primaryContactsFromSchool: "Primary Contacts (from School)",
  accountingNotes: "Accounting Notes",
  tlEmailsAtTimeOfGrant: "TL emails at time of grant",
  ein: "EIN",
  daysSincePrelimAdviceRequest: "Days since prelim advice request",
  schoolGrantName: "School Grant Name",
  daysSinceFullAdviceRequest: "Days since full advice request",
  nonprofitStatus: "Nonprofit status",
  currentTls: "Current TLs",
  grantKey: "Grant Key",
  einAtTimeOfGrant: "EIN at time of grant",
  countOfActiveMailingAddressesFromSchool: "Count of Active Mailing Addresses (from School)",
  amount: "Amount",
  automationStepTrigger: "Automation step trigger",
  currentMailingAddressFromSchool: "Current Mailing Address (from School)",
  nonprofitStatusAtTimeOfGrant: "Nonprofit status at time of grant",
  currentTlsFirstNames: "Current TLs first names",
  school: "School",
  textForLedgerEntry: "Text for ledger entry",
  label: "Label",
  fundingSource: "Funding Source",
  adviceWindow1WeekClosed: "Advice window (1 week) closed",
  issuedByName: "Issued by Name",
  logoFromSchool: "Logo (from School)",
  recipientNameFromQbo: "Recipient name from QBO",
  schoolShortName: "School Short Name",
  mailingAddressAtTimeOfGrant: "Mailing address at time of grant",
  unsignedGrantAgreement: "Unsigned Grant Agreement",
  billcom: "Bill.com",
  fundingHub: "Funding Hub",
  fullAdviceOpenQuestions: "Full Advice Open Questions",
  qbo: "QBO #",
  prelimAdvicePauses: "Prelim Advice Pauses",
  issuedByShortName: "Issued by Short Name",
  primaryContactEmailFromSchool: "Primary Contact Email (from School)",
} as const;

export const MAILING_LISTS_FIELDS = {
  educatorLog: "Educator Log",
  type: "Type",
  slug: "Slug",
  name: "Name",
  googleGroupId: "Google Group ID",
} as const;

export const LOAN_PAYMENTS_FIELDS = {
  amount: "Amount",
  paymentDate: "Payment date",
  school: "School",
  shortName: "Short Name",
  paymentKey: "Payment key",
} as const;

export const LOANS_FIELDS = {
  schoolId: "school_id",
  loanPaperwork: "Loan paperwork",
  approximateOutstandingAmount: "Approximate Outstanding Amount",
  loanid: "loan_id",
  loanContactEmail1: "Loan Contact Email 1",
  loanStatus: "Loan Status",
  issueMethod: "Issue Method",
  loanKey: "Loan Key",
  school: "School",
  interestRate: "Interest Rate",
  contactEmailFromEducatorFromEducatorsXSchoolsFromSchool: "Contact email (from Educator) (from Educators x Schools) (from School)",
  effectiveIssueDate: "Effective Issue Date",
  educatorsXSchools: "Educators x Schools",
  amountIssued: "Amount Issued",
  useOfProceeds: "Use of Proceeds",
  notes: "Notes",
  loanContactEmail2: "Loan Contact Email 2",
  maturity: "Maturity",
} as const;

export const EDUCATOR_NOTES_FIELDS = {
  notes: "Notes",
  private: "Private",
  createdBy: "Created by",
  partnersCopy: "Partners copy",
  educator: "Educator",
  educatornotesid: "educator_notes_id",
  educatorId: "educator_id",
  date: "Date",
  educatorNoteKey: "Educator Note Key",
  fullNameFromEducator: "Full Name (from Educator)",
} as const;

export const CHARTER_AUTHORIZERS_AND_CONTACTS_FIELDS = {
  authorizer: "Authorizer",
  charter: "Charter",
  title: "Title",
  phone: "Phone",
  email: "Email",
  contact: "Contact",
  currentlyActive: "Currently active",
  charterId: "charter_id",
  charterAuthorizerKey: "Charter authorizer key",
} as const;

export const ASSESSMENT_DATA_FIELDS = {
  assessmentDataKey: "Assessment Data key",
  assessment: "Assessment",
  metOrExceedsFrl: "Met or exceeds - FRL",
  numberAssessedEll: "Number assessed - ELL",
  year: "Year",
  numberAssessedSped: "Number assessed - SPED",
  school: "School",
  numberAssessed: "Number assessed",
  charterId: "charter_id",
  otherData: "Other data",
  metOrExceedsBipoc: "Met or exceeds - BIPOC",
  schoolid: "school_id",
  numberAssessedBipoc: "Number assessed - BIPOC",
  metOrExceedsAll: "Met or exceeds - all",
  assessmentdataid: "assessment_data_id",
  numberAssessedFrl: "Number assessed - FRL",
  charter: "Charter",
  metOrExceedsSped: "Met or exceeds - SPED",
  metOrExceedsEll: "Met or exceeds - ELL",
} as const;

export const MEMBERSHIP_TERMINATION_STEPS_AND_DATES_FIELDS = {
  fieldWithTargetDate: "field with target date",
  stepName: "Step name",
  dayOfProcess: "Day of process",
  responsiblePersonAtWf: "Responsible person at WF",
} as const;

export const EDUCATORS_X_SCHOOLS_FIELDS = {
  edxschoolKey: "edXschool key",
  invitedTo2024Refresher: "Invited to 2024 Refresher",
  whoInitiatedEtlRemoval: "Who initiated E/TL removal?",
  school: "School",
  loanFund: "Loan Fund?",
  loans: "Loans",
  tlGift2022: "TL Gift 2022",
  gsuiteRoles: "GSuite Roles",
  schoolShortName: "School Short Name",
  educator: "Educator",
  onNationalWebsite: "On National Website",
  signedTlAcknowledgementCommitmentToMembership: "Signed TL Acknowledgement & Commitment to Membership",
  emailStatus: "Email Status",
  ssjStage: "SSJ Stage",
  educatorId: "educator_id",
  firstNameFromEducator: "First Name (from Educator)",
  charterId: "charter_id",
  educatorFullName: "Educator Full Name",
  startDate: "Start Date",
  educatorsxschoolsid: "educatorsXschools_id",
  onWildflowerDirectory: "On Wildflower Directory",
  onTeacherLeaderGoogleGroup: "On Teacher Leader Google Group",
  montessoriCertifications: "Montessori Certifications",
  emailAtSchool: "Email at School",
  roles: "Roles",
  stagestatus: "Stage_Status",
  schoolStatus: "School Status",
  currentlyActive: "Currently Active",
  endDate: "End Date",
} as const;

export const NINE_NINETIES_FIELDS = {
  supabaseid: "supabase_id",
  aiDerivedRevenue: "AI Derived Revenue",
  aiDerivedEoyDate: "AI Derived EOY Date",
  nineNinetiesReportingYear: "Nine nineties Reporting Year",
  schoolId: "school_id",
  charterId: "charter_id",
  notes: "Notes",
} as const;

export const GOVERNANCE_DOCS_FIELDS = {
  documentType: "Document type",
  govdocid: "govdoc_id",
  date: "Date",
  docKey: "Doc Key",
  charterId: "charter_id",
  shortname: "short_name",
  docNotes: "Doc notes",
  docLink: "Doc Link",
  publicationLink: "Publication link",
  schoolId: "school_id",
  urlpdfExtensionFormula: "url-->pdf extension formula",
  school: "School",
  documentPdf: "Document PDF",
  created: "Created",
  charter: "Charter",
} as const;

export const GUIDES_ASSIGNMENTS_FIELDS = {
  currentlyActive: "Currently active",
  guideShortName: "Guide short name",
  endDate: "End date",
  schoolShortName: "School Short Name",
  schoolId: "school_id",
  startDate: "Start date",
  type: "Type",
} as const;

export const TRAINING_GRANTS_FIELDS = {
  stageFromEducators: "Stage (from Educators)",
  trainingStatus: "Training Status",
  hubNameFromEducators: "Hub Name (from Educators)",
  trainingGrantAmount: "Training Grant Amount",
  statusFromEducators: "Status (from Educators)",
  trainingProgram: "Training Program",
  cohort: "Cohort",
  notes: "Notes",
  applied: "Applied?",
  trainingGrantStatus: "Training Grant Status",
} as const;

export const REPORTS_AND_SUBMISSIONS_FIELDS = {
  charter: "Charter",
  reportsid: "reports_id",
  attachments: "Attachments",
  schoolYear: "School year",
  reportType: "Report type",
  charterId: "charter_id",
} as const;

export const STATES_ALIASES_FIELDS = {
  abbreviation: "Abbreviation",
  state: "State",
} as const;

export const PUBLIC_FUNDING_FIELDS = {
  description: "Description",
  schools: "Schools",
  name: "Name",
  relevantLevels: "Relevant levels",
} as const;

export const ANNUAL_ENROLLMENT_AND_DEMOGRAPHICS_FIELDS = {
  annualDataKey: "Annual data key",
  school: "School",
  numberOfEnrolledStudentsFrl: "Number of enrolled students - FRL",
  numberOfEnrolledStudentsBipoc: "Number of enrolled students - BIPOC",
  charter: "Charter",
  schoolId: "school_id (from School)",
  numberOfEnrolledStudentsSped: "Number of enrolled students - SPED",
  numberOfEnrolledStudentsAll: "Number of enrolled students - all",
  numberOfEnrolledStudentsEll: "Number of enrolled students - ELL",
  schoolYear: "School Year",
  annualdataid: "annual_data_id",
} as const;

export const ASSESSMENTS_FIELDS = {
  shortName: "Short Name",
  fullName: "Full Name",
  domain: "Domain",
  annualAssessmentImplementationsBySchool: "Annual Assessment Implementations by School",
  grades: "Grades",
} as const;

export const EVENT_TYPES_FIELDS = {
  events: "Events",
  eventCategory: "Event Category",
} as const;

export const EMAIL_ADDRESSES_FIELDS = {
  emailType: "Email Type",
  active: "Active?",
  emailAddress: "Email Address",
  educatorId: "educator_id",
  educator: "Educator",
  emailaddressid: "email_address_id",
  currentPrimaryEmail: "Current Primary Email",
} as const;

export const MONTESSORI_CERTIFIERS_OLD_LIST_FIELDS = {
  name: "Name",
  ssjFilloutFormGetInvolved2: "SSJ Fillout Form: Get Involved 2",
  ssjFilloutFormGetInvolved: "SSJ Fillout Form: Get Involved",
  ssjFilloutFormGetInvolved4: "SSJ Fillout Form: Get Involved 4",
  abbreviation: "Abbreviation",
  ssjFilloutFormGetInvolved3: "SSJ Fillout Form: Get Involved 3",
} as const;

export const MARKETING_SOURCE_OPTIONS_FIELDS = {
  marketingSource: "Marketing Source",
  educators: "Educators",
} as const;

export const MONTESSORI_CERT_LEVELS_FIELDS = {
  name: "Name",
  educators: "Educators",
} as const;

export const RACE_AND_ETHNICITY_FIELDS = {
  ssjFilloutFormGetInvolved: "SSJ Fillout Form: Get Involved",
  name: "Name",
} as const;

export const AGES_GRADES_FIELDS = {
  name: "Name",
} as const;

export const MONTESSORI_CERTIFIERS_FIELDS = {
  abbreviation: "Abbreviation",
  name: "Name",
} as const;

// Generated Field Options Constants
export const SSJ_FILLOUT_FORMS_OPTIONS_RECEIVECOMMUNICATIONS = [
  "Yes",
  "No",
] as const;

export const SSJ_FILLOUT_FORMS_OPTIONS_STATUSOFPROCESSINGMONTESSORICERTS = [
  "Completed",
  "Not Completed",
] as const;

export const SSJ_FILLOUT_FORMS_OPTIONS_MONTESSORICERTQ = [
  "I have completed Montessori training",
  "I have completed a Montessori training but I need another for my target age level",
  "I am currently going through Montessori training",
  "I am interested in pursuing Montessori training",
  "None of the above",
] as const;

export const SSJ_FILLOUT_FORMS_OPTIONS_PRIMARYLANGUAGE = [
  "English",
  "Spanish - Español",
  "Japanese - 日本語",
  "Mandarin - 中文",
  "French - Français",
  "Urdu - اُردُو",
  "Portugese",
  "Burmese - မြန်မာစာ",
  "Cantonese - Gwóngdūng wá",
  "Portuguese - Português",
  "Arabic - العَرَبِيَّة",
  "Hindi - हिन्दी",
  "A not-listed or more specific language",
] as const;

export const SSJ_FILLOUT_FORMS_OPTIONS_INITIALOUTREACHER = [
  "daniela.vasan@wildflowerschools.org",
  "N/A",
  "rachel.kelley-cohn@wildflowerschools.org",
  "jeana.olszewski@wildflowerschools.org",
  "angelica@wildflowerschools.org",
  "Brent Locke",
  "DUPLICATE",
  "Lisbeth",
] as const;

export const SSJ_FILLOUT_FORMS_OPTIONS_ASSIGNEDPARTNEROVERRIDE = [
  "daniela.vasan@wildflowerschools.org",
  "N/A",
  "rachel.kelley-cohn@wildflowerschools.org",
  "jeana.olszewski@wildflowerschools.org",
  "angelica@wildflowerschools.org",
  "Brent Locke",
  "DUPLICATE",
] as const;

export const SSJ_FILLOUT_FORMS_OPTIONS_SOCIOECONOMICHOUSEHOLDINCOME = [
  "Upper Income",
  "Middle Income",
  "Lower Income",
  "Prefer not to respond",
] as const;

export const SSJ_FILLOUT_FORMS_OPTIONS_SOCIOECONOMICGENDER = [
  "Female/Woman",
  "Male/Man",
  "Gender Non-Conforming",
  "Prefer not to respond",
  "Other",
] as const;

export const SSJ_FILLOUT_FORMS_OPTIONS_SOURCEFORNONTLS = [
  "Advertisement",
  "Indeed",
  "Direct Email",
  "Media",
  "RCG Talent Solutions",
  "Conference",
  "Black Wildflowers Fund",
  "Referred by Partner Organization",
  "I Previously Worked at a Wildflower School",
  "Social Media",
  "Web Search (e.g.",
  "Google",
  "ChatGPT)",
  "Referred by a Wildflower Teacher/Partner",
  "Family/Friend",
  "Word of Mouth",
  "Other",
] as const;

export const SSJ_FILLOUT_FORMS_OPTIONS_FORMVERSION = [
  "Get Involved",
  "Start a School",
] as const;

export const SSJ_FILLOUT_FORMS_OPTIONS_PERSONRESPONSIBLEFORFOLLOWUP = [
  "daniela.vasan@wildflowerschools.org",
  "N/A",
  "rachel.kelley-cohn@wildflowerschools.org",
  "jeana.olszewski@wildflowerschools.org",
  "angelica@wildflowerschools.org",
  "Brent Locke",
  "DUPLICATE",
] as const;

export const SSJ_FILLOUT_FORMS_OPTIONS_EMAILSENTBYINITIALOUTREACHER = [
  "Yes",
  "No",
  "n/a",
] as const;

export const SSJ_FILLOUT_FORMS_OPTIONS_SOCIOECONOMICPRONOUNS = [
  "she/her/hers",
  "he/him/his",
  "they/them/theirs",
  "other",
] as const;

export const SSJ_FILLOUT_FORMS_OPTIONS_CONTACTTYPE = [
  "Community member",
  "Educator",
  "Property owner",
] as const;

export const SSJ_FILLOUT_FORMS_OPTIONS_ONEONONESTATUS = [
  "Prospect did not reply to outreach",
  "Scheduling",
  "Scheduled",
  "Completed",
  "Prospect did not attend",
  "Not Interested",
  "N/A",
] as const;

export const SSJ_FILLOUT_FORMS_OPTIONS_SOURCE = [
  "Advertisement",
  "Indeed",
  "Direct Email",
  "Media",
  "RCG Talent Solutions",
  "Conference (AMI)",
  "Conference (AMS)",
  "Conference - Montessori Other",
  "Black Wildflowers Fund",
  "Referred by Partner Organization",
  "I Previously Worked at a Wildflower School",
  "Social Media",
  "Web Search (e.g.",
  "Google",
  "ChatGPT)",
  "Referred by a Wildflower Teacher/Partner",
  "Family/Friend",
  "Word of Mouth",
  "Other",
  "ChatGPT",
  "Kanetria Doolin",
  "idealist.org",
  "National Center for Microschooling",
  "LinkedIn",
  "Google",
  "Sunlight",
  "Chat GPT",
  "CW Impact Solutions",
] as const;

export const CHARTER_APPLICATIONS_OPTIONS_LIKELIHOODOFOPENINGONTIME = [
  "High",
  "Med-High",
  "Medium",
  "Med-Low",
  "Low",
] as const;

export const CHARTER_APPLICATIONS_OPTIONS_AUTHORIZERDECISION = [
  "Approved",
  "Denied",
] as const;

export const CHARTER_APPLICATIONS_OPTIONS_LETTEROFINTENTREQD = [
  "Required",
  "Allowed",
  "Does not apply",
] as const;

export const CHARTER_APPLICATIONS_OPTIONS_LIKELIHOODOFAUTHORIZATION = [
  "High",
  "Med-High",
  "Medium",
  "Med-Low",
  "Low",
] as const;

export const CHARTER_APPLICATIONS_OPTIONS_STATUS = [
  "Pre application",
  "Preparing application",
  "Awaiting decision",
  "Authorized",
  "preparing to open",
  "Open",
  "Application denied",
] as const;

export const SCHOOLS_OPTIONS_GUSTO = [
  "yes (under WF)",
  "no",
  "yes (independent)",
  "yes",
  "no- local system",
] as const;

export const SCHOOLS_OPTIONS_SSJISTHESCHOOLPLANNINGTOAPPLYFORINTERNALWILDFLOWERFUNDING = [
  "No",
  "Yes",
  "loan",
  "Yes",
  "loan; Yes",
  "grant",
  "Yes",
  "grant",
  "Yes",
  "grant; Yes",
  "loan",
] as const;

export const SCHOOLS_OPTIONS_SSJCOHORTSTATUS = [
  "Switched Ops Guide Supports",
  "Returning for Later Cohort",
  "Transitioned to Charter Application Supports",
  "Left Cohort",
] as const;

export const SCHOOLS_OPTIONS_TRANSPARENTCLASSROOM = [
  "Internal license",
  "External license",
  "Other record keeping system",
  "Internal License - removed",
] as const;

export const SCHOOLS_OPTIONS_WEBSITETOOL = [
  "external platform",
  "wordpress original",
  "wordpress v1",
  "wordpress v2",
  "Wix v1",
  "Wix v2",
] as const;

export const SCHOOLS_OPTIONS_GOVERNANCEMODEL = [
  "Independent",
  "District",
  "Charter",
  "Exploring Charter",
  "Community Partnership",
] as const;

export const SCHOOLS_OPTIONS_SSJISTHEBUDGETATASTAGETHATWILLALLOWTHEETLSTOTAKETHEIRNEXTSTEPS = [
  "Yes",
  "Unsure",
  "No",
] as const;

export const SCHOOLS_OPTIONS_AGREEMENTVERSION = [
  "Affiliation Agreement",
  "Network Membership Agreement",
] as const;

export const SCHOOLS_OPTIONS_GROUPEXEMPTIONSTATUS = [
  "Applying",
  "Active",
  "Issues",
  "Withdrawn",
  "Other - Not part of exemption",
] as const;

export const SCHOOLS_OPTIONS_GOOGLEVOICE = [
  "internal license",
] as const;

export const SCHOOLS_OPTIONS_SSJFACILITY = [
  "Signed lease",
  "Identified prospect(s)",
  "Purchased building",
  "Unsure",
  "Searching",
  "intending to buy",
  "Searching",
  "intending to rent",
] as const;

export const SCHOOLS_OPTIONS_SSJISTHETEAMONTRACKFORTHEIRENROLLMENTGOALS = [
  "Yes (tuition published",
  "plan enacted",
  "community engagement full swing)",
  "No (process unclear/unpublished",
  "limited/no family engagement)",
  "Maybe (process is ready",
  "no prospective students)",
] as const;

export const SCHOOLS_OPTIONS_SCHOOLSTATUS = [
  "Emerging",
  "Open",
  "Paused",
  "Closing",
  "Permanently Closed",
  "Disaffiliating",
  "Disaffiliated",
  "Placeholder",
] as const;

export const SCHOOLS_OPTIONS_TCRECORDKEEPING = [
  "yes (under WF)",
] as const;

export const SCHOOLS_OPTIONS_SSJDOESTHESCHOOLHAVEAVIABLEPATHWAYTOFUNDING = [
  "No",
  "startup funding unlikely",
  "Yes",
  "full funding likely",
  "Maybe",
  "prospects identified but not secured",
] as const;

export const SCHOOLS_OPTIONS_BOOKKEEPERACCOUNTANT = [
  "Staci Simon",
  "Unknown",
  "Josh's dad (Mr. Shanklin)",
] as const;

export const SCHOOLS_OPTIONS_LOGODESIGNER = [
  "internal design",
  "external design",
] as const;

export const SCHOOLS_OPTIONS_TCADMISSIONS = [
  "yes",
  "v1",
] as const;

export const SCHOOLS_OPTIONS_SSJBUILDING4GOODSTATUS = [
  "Matched",
  "Requested",
  "Upcoming",
] as const;

export const SCHOOLS_OPTIONS_BUDGETUTILITY = [
  "WF v4",
] as const;

export const SCHOOLS_OPTIONS_POD = [
  "Mass: Massbridge",
  "Mass: Broadway",
  "Mass: San Lorenzo",
  "Mid-Atlantic: Philadelphia",
  "Multistate 1",
  "CA Pod",
  "PR Pod",
  "Under discussion",
  "Charter Pod",
  "OceanBay Pod",
  "MidAtlantic Pod",
  "Fern Pod",
  "CO Charter Pod",
] as const;

export const SCHOOLS_OPTIONS_LEGALSTRUCTURE = [
  "Independent organization",
  "Part of a charter",
  "Part of another organization",
  "Multiple WF schools in a single entity",
] as const;

export const SCHOOLS_OPTIONS_SSJSSJTOOL = [
  "Google Slides",
  "My Wildflower - Sensible Default",
  "Charter Slides",
  "Platform Pilot",
] as const;

export const SCHOOLS_OPTIONS_SSJREADINESSTOOPENRATING = [
  "High",
  "Low",
  "Medium",
] as const;

export const SCHOOLS_OPTIONS_SSJBOARDDEVELOPMENT = [
  "No board",
  "Board is forming",
  "1-2 mtgs",
  "Board is developed and engaged",
  "3+ mtgs",
] as const;

export const SCHOOLS_OPTIONS_DOMAINNAME = [
  "internal",
  "external",
] as const;

export const SCHOOLS_OPTIONS_TRADEMARKFILED = [
  "Yes",
] as const;

export const SCHOOLS_OPTIONS_CURRENTFYEND = [
  "6/30",
  "7/31",
  "8/31",
  "12/31",
] as const;

export const SCHOOLS_OPTIONS_BUSINESSINSURANCE = [
  "Alliant",
  "other",
  "other (in process w/ Alliant)",
] as const;

export const SCHOOLS_OPTIONS_ONNATIONALWEBSITE = [
  "added",
  "ready to add",
  "ready to remove",
  "removed",
] as const;

export const SCHOOLS_OPTIONS_QBO = [
  "internal license - active",
  "internal license - closed out",
  "external license",
  "other accounting software",
  "Not WF - Unknown software",
] as const;

export const SCHOOLS_OPTIONS_SSJSTAGE = [
  "Visioning",
  "Planning",
  "Startup",
  "Complete",
  "Year 1",
] as const;

export const SCHOOLS_OPTIONS_NONPROFITSTATUS = [
  "group exemption",
  "independent",
  "for profit",
  "Partnership",
  "Under Charter 501c3",
] as const;

export const SCHOOLS_OPTIONS_ADMISSIONSSYSTEM = [
  "TC",
  "Other",
  "School Cues",
] as const;

export const SCHOOLS_OPTIONS_SSJHASTHEETLIDENTIFIEDAPARTNER = [
  "Partnership established",
  "No partner",
  "Partnership In development",
] as const;

export const SCHOOLS_OPTIONS_SSJNAMERESERVED = [
  "reserved",
  "unknown",
] as const;

export const SCHOOLS_OPTIONS_MEMBERSHIPSTATUS = [
  "Member school",
  "Affiliated non-member",
  "Membership terminated",
] as const;

export const SCHOOLS_OPTIONS_SCHOOLCALENDAR = [
  "9-month",
  "10-month",
  "Year-round",
] as const;

export const EDUCATORS_OPTIONS_HOUSEHOLDINCOME = [
  "Middle Income",
  "Lower Income",
  "Upper Income",
  "Prefer not to respond",
] as const;

export const EDUCATORS_OPTIONS_GENDER = [
  "Female",
  "Male",
  "Other",
  "Gender Non-Conforming",
  "Female/Woman",
  "Male/Man",
  "A not-listed or more specific gender identity",
  "Prefer not to respond",
] as const;

export const EDUCATORS_OPTIONS_PRONOUNS = [
  "she/her/hers",
  "he/him/his",
  "other",
  "they/them/theirs",
] as const;

export const EDUCATORS_OPTIONS_LGBTQIA = [
  "TRUE",
  "FALSE",
] as const;

export const EDUCATORS_OPTIONS_EDUCATIONALATTAINMENT = [
  "Graduated high school or GED",
  "Completed graduate school",
  "Graduated college",
  "Some college",
  "Some graduate school",
  "Did not graduate high school",
] as const;

export const EDUCATORS_OPTIONS_DISCOVERYSTATUS = [
  "Complete",
  "In process",
  "Paused",
] as const;

export const EDUCATORS_OPTIONS_FIRSTCONTACTWFSCHOOLEMPLOYMENTSTATUS = [
  "Never employed by a Wildflower school",
  "Never employed by a Wildflower school",
  "Never employed by a Wildflower school",
  "Active Teacher Leader",
  "Active School Staff",
  "Active School Staff",
  "Active School Staff",
  "Not currently working at a Wildflower school - former TL",
  "Not currently working at a Wildflower school - former school staff",
] as const;

export const EDUCATORS_OPTIONS_INDIVIDUALTYPE = [
  "Educator",
  "Community Member",
] as const;

export const EDUCATORS_OPTIONS_ONBOARDINGEXPERIENCE = [
  "Standard SSJ",
  "Onboarded by School Supports",
  "Other",
] as const;

export const EDUCATORS_OPTIONS_INCOMEBACKGROUND = [
  "Middle Income",
  "Lower Income",
  "Upper Income",
] as const;

export const MEMBERSHIP_TERMINATION_STEPS_OPTIONS_INITIALSLACKCONDITION = [
  "In WF Slack",
  "Not in WF Slack",
] as const;

export const MEMBERSHIP_TERMINATION_STEPS_OPTIONS_INITIALQBOCONDITION = [
  "In WF QBO with complete Master Admin",
  "In WF QBO without complete Master Admin",
  "Not in WF QBO",
] as const;

export const LOCATIONS_OPTIONS_QUALIFIEDLOWINCOMECENSUSTRACT = [
  "YES",
  "NO",
  "Unknown",
] as const;

export const LOCATIONS_OPTIONS_TIMEZONE = [
  "Eastern Time (US & Canada)",
  "Central Time (US & Canada)",
  "Mountain Time (US & Canada)",
  "Pacific Time (US & Canada)",
  "Atlantic Time",
] as const;

export const LOCATIONS_OPTIONS_LOCATIONTYPE = [
  "Mailing address - no physical school",
  "School address and mailing address",
  "Physical address - does not receive mail",
] as const;

export const LOCATIONS_OPTIONS_COLOCATIONTYPE = [
  "Church",
  "Affordable Housing",
  "Non Profit / Service Provider",
  "Community Center",
  "Shelter / Transitional Housing",
] as const;

export const EVENT_ATTENDANCE_OPTIONS_STARTEDSSJCOMPLETEDSSJTYPEFORM = [
  "Yes",
  "No",
  "N/A",
] as const;

export const LEAD_ROUTING_AND_TEMPLATES_OPTIONS_GEOTYPE = [
  "States",
] as const;

export const COHORTS_OPTIONS_PROGRAMTYPE = [
  "Blooms",
  "Charter",
] as const;

export const CHARTERS_OPTIONS_STATUS = [
  "Applying",
  "Application Submitted - Waiting",
  "Approved -  Year 0",
  "Open",
  "Paused",
  "Awaiting start of cohort",
] as const;

export const CHARTERS_OPTIONS_NONPROFITSTATUS = [
  "Intend to apply direct - not yet applied",
  "Awaiting IRS determination for direct 501c3",
  "Approved directly by IRS",
  "Intend to use group exemption - not yet approved",
  "Part of group exemption",
] as const;

export const CHARTERS_OPTIONS_CURRENTFYEND = [
  "6/30",
  "12/31",
  "8/31",
] as const;

export const CHARTERS_OPTIONS_GROUPEXEMPTIONSTATUS = [
  "Active",
  "Withdrawn",
  "Issues",
] as const;

export const ACTION_STEPS_OPTIONS_STATUS = [
  "Incomplete",
  "Complete",
] as const;

export const MONTESSORI_CERTS_OPTIONS_CERTIFICATIONSTATUS = [
  "Training",
  "Certified",
  "Paused",
  "Not certified",
] as const;

export const GRANTS_OPTIONS_GRANTSTATUS = [
  "Issued",
  "Planned",
  "Did not receive",
  "?",
  "Received",
  "X",
  "is",
] as const;

export const GRANTS_OPTIONS_ACCOUNTINGNOTES = [
  "OK",
  "?",
  "IN QBO",
] as const;

export const GRANTS_OPTIONS_AUTOMATIONSTEPTRIGGER = [
  "Cannot proceed without a grant amount",
  "Request prelim advice for $3k+",
  "Wait for prelim advice",
  "Pause at prelim advice",
  "Request full advice",
  "Wait for full advice",
  "Pause at full advice",
  "Objections",
  "Proceed",
  "Waiting for pre-reqs before proceeding",
  "Processing",
  "Complete",
] as const;

export const GRANTS_OPTIONS_LABEL = [
  "Sep",
  "Betsy Symanietz",
  "Sara Hernandez",
  "Daniela Vasan",
  "Alia Perra",
  "Rachel Kelley-Cohen",
  "Erika McDowell",
  "Sunny Greenberg",
  "Erica Cantoni",
] as const;

export const GRANTS_OPTIONS_FUNDINGSOURCE = [
  "Sep",
  "TWF - MN / Walton",
  "TWF - PR",
  "TWF - Walton",
  "TWF - Cambridge",
  "RWJF",
  "TWF - No Cal - advance",
  "TWF - Cambridge - advance",
  "TWF - Cambridge",
  "TWF - MN",
  "Walton",
  "TWF - National",
  "TWF - No Ma",
  "Stranahan",
  "Nash",
  "TWF - No Cal - SSF",
  "TWF - CO - Constellation",
  "TWF - MN - PELSB",
  "TWF - NJ - Overdeck",
  "TWF - Mid-Atl",
  "VELA",
  "Individual Donor",
  "Passthrough",
  "COVID",
  "Seed Fund",
  "Scholler",
  "DEED",
  "DC",
  "Flamboyan Foundation",
] as const;

export const MAILING_LISTS_OPTIONS_TYPE = [
  "Google Group",
] as const;

export const LOANS_OPTIONS_LOANSTATUS = [
  "Interest Only Period",
  "Principal Repayment Period",
  "Paid Off",
] as const;

export const LOANS_OPTIONS_ISSUEMETHOD = [
  "Sep",
  "TWF",
  "TWF->LF II",
  "LF II",
  "Spring Point",
] as const;

export const LOANS_OPTIONS_USEOFPROCEEDS = [
  "Operations",
  "Start-up",
  "Renovations / Construction",
  "Combine 2 loans",
  "Expansion",
  "Move",
  "Security deposit",
] as const;

export const EDUCATORS_X_SCHOOLS_OPTIONS_GSUITEROLES = [
  "School Admin - School Orgs",
] as const;

export const EDUCATORS_X_SCHOOLS_OPTIONS_ONNATIONALWEBSITE = [
  "Added",
  "Removed",
] as const;

export const EDUCATORS_X_SCHOOLS_OPTIONS_EMAILSTATUS = [
  "Active",
  "Suspended",
] as const;

export const EDUCATORS_X_SCHOOLS_OPTIONS_ONWILDFLOWERDIRECTORY = [
  "Active",
  "Removed",
] as const;

export const EDUCATORS_X_SCHOOLS_OPTIONS_ONTEACHERLEADERGOOGLEGROUP = [
  "Active",
  "Removed",
] as const;

export const GOVERNANCE_DOCS_OPTIONS_DOCUMENTTYPE = [
  "Articles of Incorporation",
  "Certificate of Incorporation",
  "EIN Letter",
  "Self management policy",
  "Nepotism policy",
  "Conflict of Interest policy",
  "Bylaws",
  "Document Retention Policy",
  "Whistleblower Policy",
  "Nondiscrimination Policy",
  "Membership Agreement",
  "Authorization Letter",
  "Group Exemption Status Notification to IRS",
  "Group Exemption Status Notification to School",
  "Group Exemption Status Withdrawn Notification to IRS",
  "IRS Determination Letter",
  "Acknowledgement & Commitment",
  "IRS Revocation Letter",
] as const;

export const GUIDES_ASSIGNMENTS_OPTIONS_TYPE = [
  "Ops Guide",
  "Equity Coach",
  "Regional Entrepreneur",
  "Open Schools Support",
] as const;

export const TRAINING_GRANTS_OPTIONS_TRAININGSTATUS = [
  "Accepted",
  "In-Progress",
  "Complete",
  "Withdrew",
  "Incomplete application / did not apply",
] as const;

export const TRAINING_GRANTS_OPTIONS_TRAININGPROGRAM = [
  "Rising Tide",
] as const;

export const TRAINING_GRANTS_OPTIONS_COHORT = [
  "2022 Primary",
] as const;

export const TRAINING_GRANTS_OPTIONS_TRAININGGRANTSTATUS = [
  "Planned",
  "Issued",
  "Cancelled",
] as const;

export const REPORTS_AND_SUBMISSIONS_OPTIONS_REPORTTYPE = [
  "Performance data",
  "Renewal report",
] as const;

export const EMAIL_ADDRESSES_OPTIONS_EMAILTYPE = [
  "Personal",
  "Work (non-Wildflower)",
  "Work - Wildflower School",
  "Work - Wildflower Foundation",
] as const;

// Generated Zod Validation Schemas

export const PARTNERS_COPY_SCHEMA = z.object({
  id: z.string(),
  created: z.string(),
  lastModified: z.string(),
  roles: z.array(z.string()).optional(),
  emailTemplates: z.string().optional(),
  educatorRecordIds: z.string().optional(),
  grants5: z.array(z.string()).optional(),
  guideAssignments: z.string().optional(),
  shortName: z.string().optional(),
  publicWebsiteActive: z.boolean().optional(),
  websiteBio: z.string().optional(),
  educatorNotes: z.array(z.string()).optional(),
  startDateFromStints: z.string().optional(),
  endDateFromStints: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  currentlyActive: z.string().optional(),
  slackHandle: z.string().optional(),
  actionSteps: z.array(z.string()).optional(),
  dob: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  recordId: z.any().optional(),
  photo: z.array(z.string()).optional(),
  activeStint: z.array(z.string()).optional(),
  tls: z.array(z.string()).optional(),
  phone: z.string().regex(/^[\+]?[1-9]?\d{1,14}$/, "Invalid phone number").optional(),
  papyrsProfile: z.string().optional(),
  stintTypeFromStints: z.array(z.string()).optional(),
  name: z.string().optional(),
  homeAddress: z.string().optional(),
  schools: z.array(z.string()).optional(),
  schoolNotes: z.array(z.string()).optional(),
  email: z.string().email().optional(),
  guidedSchoolRecordId: z.string().optional(),
  ssjProcessDetails: z.string().optional(),
  personalEmail: z.string().email().optional(),
  syncedRecordId: z.string().optional(),
  imageUrl: z.string().optional(),
  membershipTerminationStepsAndDates: z.string().optional(),
  copperUserid: z.string().optional(),
  emailOrName: z.string().optional(),
});

export const SSJ_FILLOUT_FORMS_SCHEMA = z.object({
  id: z.string(),
  created: z.string(),
  lastModified: z.string(),
  isInterestedInCharterFromEmail: z.boolean().optional(),
  tempMCertCert1: z.string().optional(),
  socioeconomicGenderOther: z.string().optional(),
  tempMCertLevel3: z.string().optional(),
  socioeconomicRaceEthnicityOther: z.string().optional(),
  montessoriCertificationCertifier2: z.array(z.string()).optional(),
  receiveCommunications: z.string().optional(),
  socioeconomicRaceEthnicity: z.array(z.string()).optional(),
  communityMemberInterest: z.string().optional(),
  montessoriCertificationYear3: z.string().optional(),
  tempMCertYear4: z.string().optional(),
  statusOfProcessingMontessoriCerts: z.string().optional(),
  tempMCertYear2: z.string().optional(),
  contactTypeStandardized: z.any().optional(),
  city: z.string().optional(),
  marketingCampaign: z.string().optional(),
  stateStandardized: z.string().optional(),
  montessoriCertQ: z.string().optional(),
  tempMCertLevel4: z.string().optional(),
  primaryLanguage: z.string().optional(),
  firstName: z.string().optional(),
  initialOutreacher: z.string().optional(),
  country2: z.string().optional(),
  tempMCertCert3: z.string().optional(),
  assignedPartnerOverride: z.string().optional(),
  montessoriCertificationLevel1: z.array(z.string()).optional(),
  state2: z.string().optional(),
  socioeconomicHouseholdIncome: z.string().optional(),
  montessoriCertificationYear4: z.string().optional(),
  routedTo: z.string().email().optional(),
  socioeconomicGender: z.string().optional(),
  entryDate: z.string().datetime().optional(),
  tempMCertLevel2: z.string().optional(),
  marketingSource: z.string().optional(),
  sendgridSentDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  city2: z.string().optional(),
  ssjfilloutformid: z.any().optional(),
  montessoriCertificationLevel3: z.array(z.string()).optional(),
  montessoriCertificationYear2: z.string().optional(),
  fullName: z.any().optional(),
  educatorInterestsOther: z.string().optional(),
  isSeekingMontessoriCertification: z.any().optional(),
  email: z.string().email().optional(),
  sendgridTemplateId: z.string().optional(),
  assignedPartnerFromEducators: z.string().optional(),
  genderStandardized: z.any().optional(),
  educatorId: z.string().optional(),
  montessoriCertificationYear1: z.string().optional(),
  montessoriCertificationCertifier1: z.array(z.string()).optional(),
  tempMCertYear1: z.string().optional(),
  communityMemberCommunityInfo: z.string().optional(),
  communityMemberSupportFindingTeachers: z.boolean().optional(),
  sourceForNontls: z.string().optional(),
  formVersion: z.string().optional(),
  socioeconomicLgbtqiaIdentifyingFromEmail: z.boolean().optional(),
  tempMCertCert2: z.string().optional(),
  communityMemberSelfInfo: z.string().optional(),
  ssjFilloutFormKey: z.any().optional(),
  tempMCertYear3: z.string().optional(),
  educators: z.array(z.string()).optional(),
  linkToStartASchool: z.array(z.string()).optional(),
  personResponsibleForFollowUp: z.string().optional(),
  socioeconomicPronounsOther: z.string().optional(),
  country: z.string().optional(),
  emailSentByInitialOutreacher: z.boolean().optional(),
  sourceOther: z.string().optional(),
  lastName: z.string().optional(),
  state: z.string().optional(),
  socioeconomicPronouns: z.string().optional(),
  contactType: z.string().optional(),
  isMontessoriCertified: z.any().optional(),
  tempMCertCert4: z.string().optional(),
  montessoriCertificationLevel2: z.array(z.string()).optional(),
  tempMCertLevel1: z.string().optional(),
  primaryLanguageOther: z.string().optional(),
  oneOnOneStatus: z.string().optional(),
  interestedInCharter: z.boolean().optional(),
  montessoriCertificationCertifier3: z.array(z.string()).optional(),
  message: z.string().optional(),
  source: z.string().optional(),
  montessoriCertificationCertifier4: z.array(z.string()).optional(),
});

export const MARKETING_SOURCES_MAPPING_SCHEMA = z.object({
  id: z.string(),
  created: z.string(),
  lastModified: z.string(),
  recid: z.any().optional(),
  educatorsOptions: z.string().optional(),
  educatorsOther: z.string().optional(),
  filloutOptions: z.string().optional(),
});

export const CHARTER_APPLICATIONS_SCHEMA = z.object({
  id: z.string(),
  created: z.string(),
  lastModified: z.string(),
  capacityInterviewComplete: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  capacityInterviewProjectedDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  charter: z.array(z.string()).optional(),
  letterOfIntentDeadline: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  nonprofitStatus: z.string().optional(),
  authorizerDecisionRecd: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  targetCommunityFromCharter: z.string().optional(),
  finalBudget: z.array(z.string()).optional(),
  currentTlDiscoveryStatus: z.string().optional(),
  likelihoodOfOpeningOnTime: z.string().optional(),
  authorizerDecision: z.string().optional(),
  shortName: z.string().optional(),
  budgetPlanningExercises: z.array(z.string()).optional(),
  fullName: z.string().optional(),
  charterappid: z.any().optional(),
  milestones: z.any().optional(),
  membershipStatusOfSchools: z.string().optional(),
  grades: z.any().optional(),
  charterAppKey: z.any().optional(),
  letterOfIntentReqd: z.string().optional(),
  authorizerDecisionExpectedDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  keyDates: z.any().optional(),
  expectedDecision: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  opportunitiesAndChallenges: z.string().optional(),
  OfStudents: z.number().optional(),
  appSubmissionDeadline: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  likelihoodOfAuthorization: z.string().optional(),
  currentTlsFromSchoolsFromCharter: z.string().optional(),
  landscapeAnalysisFromCharter: z.string().optional(),
  charterAppProjectMgmtPlanComplete: z.boolean().optional(),
  appSubmitted: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  charterDesign: z.array(z.string()).optional(),
  mostRecentApplication: z.boolean().optional(),
  boardMembershipAgreementSigned: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  targetOpen: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  beginningAge: z.array(z.string()).optional(),
  cohortsFromCharter: z.string().optional(),
  logicModelComplete: z.boolean().optional(),
  endingAge: z.array(z.string()).optional(),
  charterDesignAdviceSessionComplete: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  loi: z.array(z.string()).optional(),
  loiSubmitted: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  authorizer: z.string().optional(),
  charterAppRolesIdd: z.boolean().optional(),
  communityEngagementPlanLaunched: z.boolean().optional(),
  jointKickoffMeetingComplete: z.boolean().optional(),
  supportTimeline: z.array(z.string()).optional(),
  status: z.string().optional(),
  capacityInterviewTrainingComplete: z.boolean().optional(),
  charterlevelMembershipAgreementSigned: z.string().optional(),
  charterAppWalkthrough: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  tlMembershipAgreementSigned: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  applicationWindow: z.string().optional(),
  charterId: z.string(),
  internalWfSupportLaunchMeeting: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  jointKickoffMeeting: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
});

export const SCHOOLS_SCHEMA = z.object({
  id: z.string(),
  created: z.string(),
  lastModified: z.string(),
  numberOfClassrooms: z.number().optional(),
  lease: z.string().optional(),
  gusto: z.string().optional(),
  enrollmentAtFullCapacity: z.number().optional(),
  ssjIsTheSchoolPlanningToApplyForInternalWildflowerFunding: z.string().optional(),
  guideEmail: z.array(z.string()).optional(),
  locationid: z.string().optional(),
  emailDomain: z.string().optional(),
  ssjCohortStatus: z.string().optional(),
  visioningAlbumComplete: z.boolean().optional(),
  transparentClassroom: z.string().optional(),
  ssjOriginalProjectedOpenDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  latinxFromFamilySurvey: z.string().optional(),
  logoUrl: z.string().url().optional(),
  globalMajority: z.string().optional(),
  ssjGapInFunding: z.string().optional(),
  planningAlbum: z.array(z.string()).optional(),
  countOfActiveMailingAddresses: z.number().optional(),
  websiteTool: z.string().optional(),
  charterId: z.string().optional(),
  schoolEmail: z.string().email().optional(),
  ssjLoanEligibility: z.string().optional(),
  facebook: z.string().optional(),
  currentPhysicalAddress: z.string().optional(),
  ssjProjOpenSchoolYearBackup: z.string().optional(),
  primaryContactEmail: z.array(z.string()).optional(),
  locations: z.array(z.string()).optional(),
  frl: z.string().optional(),
  guideassignmentid: z.string().optional(),
  opened: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  governanceModel: z.string().optional(),
  leaseEndDate: z.string().optional(),
  enteredPlanningDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  dateWithdrawnFromGroupExemption: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  nondiscriminationPolicyOnApplication: z.boolean().optional(),
  ssjIsTheBudgetAtAStageThatWillAllowTheEtlsToTakeTheirNextSteps: z.string().optional(),
  emailAtSchoolFromEducatorsXSchools: z.array(z.string()).optional(),
  mediumIncome: z.string().optional(),
  legalName: z.string().optional(),
  agreementVersion: z.string().optional(),
  familysurveyid: z.string().optional(),
  isThereA2022990: z.number().optional(),
  highIncomeFromFamilySurvey: z.string().optional(),
  groupExemptionStatus: z.string().optional(),
  nineNinetiesAttachment: z.string().optional(),
  membershipAgreementDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  lowIncome: z.string().optional(),
  currentTls: z.string().optional(),
  OfFormsSent: z.string().optional(),
  shortName: z.string().optional(),
  flexibleTuitionModel: z.boolean().optional(),
  grantsWf: z.array(z.string()).optional(),
  googleVoice: z.string().optional(),
  grantid: z.string().optional(),
  schoolNotes: z.array(z.string()).optional(),
  signedMembershipAgreement: z.array(z.string()).optional(),
  ssjFacility: z.string().optional(),
  ssjTargetCity: z.string().optional(),
  nondiscriminationPolicyOnWebsite: z.boolean().optional(),
  nativeAmericanFromFamilySurvey: z.string().optional(),
  agesServed: z.array(z.string()).optional(),
  ssjIsTheTeamOnTrackForTheirEnrollmentGoals: z.string().optional(),
  building4goodFirmAttorney: z.string().optional(),
  enteredVisioningDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  primaryContactId: z.string().optional(),
  raceEthnicityFromEducatorViaEducatorsXSchools: z.string().optional(),
  schoolStatus: z.string().optional(),
  nineninetyid: z.string().optional(),
  leftNetworkDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  activeGuides: z.string().optional(),
  tcRecordkeeping: z.string().optional(),
  ssjDoesTheSchoolHaveAViablePathwayToFunding: z.string().optional(),
  logo: z.array(z.string()).optional(),
  currentPhysicalAddressState: z.string().optional(),
  billcomAccount: z.string().optional(),
  instagram: z.string().optional(),
  ein: z.string().optional(),
  loanFromLoansIssueMethod: z.string().optional(),
  currentPhysicalAddressCity: z.string().optional(),
  bookkeeperAccountant: z.string().optional(),
  ssjLoanApprovedAmt: z.string().optional(),
  logoDesigner: z.string().optional(),
  foundingDocuments: z.string().optional(),
  ssjDateSharedWithN4gFromSsjProcessDetails: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  tcAdmissions: z.string().optional(),
  ssjBuilding4goodStatus: z.string().optional(),
  narrative: z.string().optional(),
  currentMailingAddress: z.string().optional(),
  ssjTotalStartupFundingNeeded: z.string().optional(),
  schoolContactEmails: z.array(z.string()).optional(),
  OfAsianAmericanStudents: z.string().optional(),
  budgetUtility: z.string().optional(),
  ssjWhatIsTheNextBigDecisionOrActionThisSchoolIsWorkingOn: z.string().optional(),
  dateReceivedGroupExemption: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  pod: z.string().optional(),
  legalStructure: z.string().optional(),
  OfAfricanAmericanStudents: z.string().optional(),
  archived: z.boolean().optional(),
  incorporationDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  activelongitude: z.string().optional(),
  ssjSsjTool: z.string().optional(),
  leftNetworkReason: z.array(z.string()).optional(),
  about: z.string().optional(),
  ssjReadinessToOpenRating: z.string().optional(),
  ssjFundraisingNarrative: z.string().optional(),
  tcSchoolId: z.string().optional(),
  ssjBoardDevelopment: z.string().optional(),
  charter: z.array(z.string()).optional(),
  fullNameFromFoundersList: z.string().optional(),
  institutionalPartner: z.string().optional(),
  primaryContacts: z.array(z.string()).optional(),
  countofactiveguides: z.number().optional(),
  schoolPhone: z.string().regex(/^[\+]?[1-9]?\d{1,14}$/, "Invalid phone number").optional(),
  actionstepid: z.string().optional(),
  charterShortName: z.string().optional(),
  dedupeSchoolWith: z.string().optional(),
  educatorsxschoolsid: z.string().optional(),
  guidestarListingRequested: z.boolean().optional(),
  whiteFromFamilySurvey: z.string().optional(),
  priorNames: z.string().optional(),
  guideAssignments: z.array(z.string()).optional(),
  schoolnoteid: z.string().optional(),
  website: z.string().url().optional(),
  OfStudents: z.string().optional(),
  schoolSchedule: z.array(z.string()).optional(),
  ssjTargetState: z.string().optional(),
  domainName: z.string().optional(),
  educators: z.string().optional(),
  name: z.string(),
  trademarkFiled: z.string().optional(),
  activelatitude: z.string().optional(),
  googleWorkspaceOrgUnitPath: z.string().optional(),
  aboutSpanish: z.string().optional(),
  loanid: z.string().optional(),
  loanReportName: z.string().optional(),
  currentFyEnd: z.string().optional(),
  ssjProjectedOpen: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  middleEastern: z.string().optional(),
  businessInsurance: z.string().optional(),
  onNationalWebsite: z.string().optional(),
  qbo: z.string().optional(),
  ssjStage: z.string().optional(),
  nonprofitStatus: z.string().optional(),
  admissionsSystem: z.string().optional(),
  ssjHasTheEtlIdentifiedAPartner: z.string().optional(),
  ssjNameReserved: z.string().optional(),
  pacificIslanderFromFamilySurvey: z.string().optional(),
  countOfActivePhysicalAddresses: z.number().optional(),
  automationNotes: z.string().optional(),
  membershipStatus: z.string().optional(),
  enteredStartupDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  ssjAmountRaised: z.string().optional(),
  nameSelectionProposal: z.string().url().optional(),
  schoolCalendar: z.string().optional(),
  educatorsXSchools: z.array(z.string()).optional(),
});

export const EDUCATORS_SCHEMA = z.object({
  id: z.string(),
  created: z.string(),
  lastModified: z.string(),
  householdIncome: z.string().optional(),
  otherLanguages: z.array(z.string()).optional(),
  statusForActiveSchool: z.string().optional(),
  assignedPartnerOverrideFromSsjFilloutForms: z.string().optional(),
  trainingGrants: z.array(z.string()).optional(),
  startupStageForActiveSchool: z.string().optional(),
  primaryContactFor: z.array(z.string()).optional(),
  activeHolaspirit: z.boolean().optional(),
  nickname: z.string().optional(),
  educatorNotes: z.array(z.string()).optional(),
  ssjfilloutformid: z.string().optional(),
  routedTo: z.string().optional(),
  gender: z.string().optional(),
  assignedPartner: z.array(z.string()).optional(),
  firstContactNotesOnPrewildflowerEmployment: z.string().optional(),
  alsoAPartner: z.boolean().optional(),
  stagestatusForActiveSchool: z.string().optional(),
  montessoriLeadGuideTrainings: z.array(z.string()).optional(),
  assignedPartnerEmail: z.string().email().optional(),
  raceEthnicity: z.array(z.string()).optional(),
  notesFromEducatorNotes: z.string().optional(),
  montessoriCertifications: z.array(z.string()).optional(),
  targetInternational: z.string().optional(),
  genderOther: z.string().optional(),
  educatorsxschoolsid: z.string().optional(),
  sourceOther: z.string().optional(),
  certifierFromMontessoriCertifications: z.string().optional(),
  survey2022WildflowerNetworkSurvey: z.boolean().optional(),
  pronouns: z.string().optional(),
  archived: z.boolean().optional(),
  educatorsAtSchools: z.array(z.string()).optional(),
  currentPrimaryEmailAddress: z.string().email().optional(),
  emailSentByInitialOutreacher: z.string().optional(),
  secondaryPhone: z.string().regex(/^[\+]?[1-9]?\d{1,14}$/, "Invalid phone number").optional(),
  pronunciation: z.string().optional(),
  eventsAttended: z.array(z.string()).optional(),
  currentlyActiveSchool: z.string().optional(),
  montessoriCertified: z.string().optional(),
  firstContactInitialInterests: z.string().optional(),
  schoolAddress: z.string().optional(),
  currentRole: z.string().optional(),
  middleName: z.string().optional(),
  lgbtqia: z.string().optional(),
  certificationLevelsFromMontessoriCertifications: z.string().optional(),
  opsGuideRequestPertinentInfo: z.string().optional(),
  activeSchoolAffiliationStatus: z.string().optional(),
  montessoricertid: z.string().optional(),
  pronounsOther: z.string().optional(),
  dedupeWith: z.string().optional(),
  lastName: z.string().optional(),
  educatornotesid: z.string().optional(),
  raceEthnicityOther: z.string().optional(),
  targetState: z.string().optional(),
  entryDateFromSsjFilloutForms: z.string().optional(),
  tcUserId: z.string().optional(),
  emailid: z.string().optional(),
  countOfGetInvolvedForms: z.number().optional(),
  contactFormDetailsFromSsjDataOnEducators: z.string().optional(),
  newsletterAndGroupSubscriptions: z.array(z.string()).optional(),
  homeAddress: z.string().optional(),
  cohorts: z.string().optional(),
  source: z.array(z.string()).optional(),
  countoflinkedschools: z.number().optional(),
  educationalAttainment: z.string().optional(),
  messageFromSsjFilloutForms: z.string().optional(),
  opsGuideAnyFundraisingOpportunities: z.string().optional(),
  primaryLanguage: z.array(z.string()).optional(),
  fullName: z.any().optional(),
  firstName: z.string().optional(),
  onSchoolBoard: z.string().optional(),
  discoveryStatus: z.string().optional(),
  firstContactWfSchoolEmploymentStatus: z.string().optional(),
  primaryPhone: z.string().regex(/^[\+]?[1-9]?\d{1,14}$/, "Invalid phone number").optional(),
  activeSchoolRecordId: z.string().optional(),
  individualType: z.string().optional(),
  educatorId: z.string().optional(),
  onboardingExperience: z.string().optional(),
  firstContactWillingnessToRelocate: z.boolean().optional(),
  assignedPartnerShortName: z.string().optional(),
  targetCity: z.string().optional(),
  schoolStatuses: z.string().optional(),
  currentlyActiveAtASchool: z.string().optional(),
  oneOnOneStatus: z.string().optional(),
  allSchools: z.string().optional(),
  ssjoldstartaschoolid: z.string().optional(),
  excludeFromEmailLogging: z.boolean().optional(),
  incomeBackground: z.string().optional(),
});

export const SSJ_TYPEFORMS_START_A_SCHOOL_SCHEMA = z.object({
  id: z.string(),
  created: z.string(),
  lastModified: z.string(),
  ssjDataOnEducators: z.string().optional(),
  registeredFromEventAttendance: z.string().optional(),
  firstName: z.string().optional(),
  socioeconomicPrimaryLanguage: z.string().optional(),
  receiveCommunications: z.boolean().optional(),
  contactLocationState: z.string().optional(),
  montessoriCertificationYear: z.string().optional(),
  createdAt: z.string().datetime().optional(),
  message: z.string().optional(),
  source: z.string().optional(),
  socioeconomicPronounsOther: z.string().optional(),
  socioeconomicPronouns: z.string().optional(),
  entryDate: z.string().datetime().optional(),
  ssjFilloutFormGetInvolved2: z.string().optional(),
  tags: z.string().optional(),
  educator: z.string().optional(),
  schoolLocationCity: z.string().optional(),
  ssjFilloutFormGetInvolved: z.string().optional(),
  schoolLocationState: z.string().optional(),
  socioeconomicGender: z.string().optional(),
  montessoriCertificationCertifier: z.string().optional(),
  timeAtEventFromEventAttendance: z.string().optional(),
  socioeconomicRaceEthnicity: z.string().optional(),
  schoolLocationCountry: z.string().optional(),
  initialInterestInGovernanceModel: z.string().optional(),
  socioeconomicRaceEthnicityOther: z.string().optional(),
  ageClassroomsInterestedInOffering: z.string().optional(),
  isInterestedInCharter: z.boolean().optional(),
  attendedFromEventAttendance: z.string().optional(),
  isSeekingMontessoriCertification: z.boolean().optional(),
  schoolLocationCommunity: z.string().optional(),
  equityReflection: z.string().optional(),
  socioeconomicLgbtqiaIdentifying: z.string().optional(),
  socioeconomicHouseholdIncome: z.string().optional(),
  contactLocationCountry: z.string().optional(),
  socioeconomicGenderOther: z.string().optional(),
  hasInterestInJoiningAnotherSchool: z.boolean().optional(),
  isWillingToMove: z.boolean().optional(),
  contactLocationCity: z.string().optional(),
  lastName: z.string().optional(),
  isMontessoriCertified: z.boolean().optional(),
  recordIdFromEventParticipantFromEventAttendance: z.string().optional(),
  montessoriCertificationLevels: z.string().optional(),
});

export const SCHOOL_NOTES_SCHEMA = z.object({
  id: z.string(),
  created: z.string(),
  lastModified: z.string(),
  schoolnoteid: z.any().optional(),
  createdBy: z.array(z.string()).optional(),
  schoolId: z.string(),
  partnerShortName: z.string().optional(),
  headlineNotes: z.string().optional(),
  school: z.array(z.string()).optional(),
  schoolNoteKey: z.any().optional(),
  charterId: z.string().optional(),
  partnersCopy: z.array(z.string()).optional(),
  notes: z.string().optional(),
  dateCreated: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  private: z.boolean().optional(),
});

export const MEMBERSHIP_TERMINATION_STEPS_SCHEMA = z.object({
  id: z.string(),
  created: z.string(),
  lastModified: z.string(),
  initialTcCondition: z.string().optional(),
  deactivateListservs: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  deactivateGsuiteTargetDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  deactivateWildflowerschoolsorgProfile: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  deactivateWildflowerschoolsorgProfileTargetDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  deactivateWebsiteTargetDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  initialGustoCondition: z.string().optional(),
  initialSlackCondition: z.string().optional(),
  deactivateSlackTargetDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  terminationTriggerDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  initialQboCondition: z.string().optional(),
  deactivateListservsTargetDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  deactivateGroupExemption: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  deactivateTc: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  deactivateGroupExemptionTargetDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  schoolContactEmailsFromSchool: z.array(z.string()).optional(),
  deactivateWebsite: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  deactivateSlack: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  initialWebsiteCondition: z.string().optional(),
  updateAirtableFields: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  deactivateGustoTargetDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  initialGroupExemptionCondition: z.string().optional(),
  deactivateGusto: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  membershipTerminationLetterFromSchool: z.string().optional(),
  deactivateQboTargetDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  deactivateQbo: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  deactivateGsuite: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  deactivateTcTargetDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
});

export const LOCATIONS_SCHEMA = z.object({
  id: z.string(),
  created: z.string(),
  lastModified: z.string(),
  geocodeAutomationLastRunAt: z.string().datetime().optional(),
  country: z.string().optional(),
  qualifiedLowIncomeCensusTract: z.string().optional(),
  street: z.string().optional(),
  address: z.string().optional(),
  lease: z.array(z.string()).optional(),
  timeZone: z.string().optional(),
  endOfTimeAtLocation: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  locationKey: z.any().optional(),
  censusTract: z.string().optional(),
  squareFeet: z.number().optional(),
  neighborhood: z.string().optional(),
  schoolStatusFromSchool: z.string().optional(),
  longitude: z.number().optional(),
  charter: z.array(z.string()).optional(),
  state: z.string().optional(),
  currentPhysicalAddress: z.boolean().optional(),
  maxStudentsLicensedFor: z.number().optional(),
  postalCode: z.string().optional(),
  latitude: z.number().optional(),
  leaseEndDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  locationid: z.any().optional(),
  locationType: z.string().optional(),
  school: z.array(z.string()).optional(),
  charterId: z.string().optional(),
  city: z.string().optional(),
  currentMailingAddress: z.boolean().optional(),
  inactiveWithoutEndDateOrActiveWithEndDate: z.any().optional(),
  colocationType: z.string().optional(),
  startOfTimeAtLocation: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  shortName: z.string().optional(),
  colocationPartner: z.string().optional(),
  schoolId: z.string(),
});

export const EVENT_ATTENDANCE_SCHEMA = z.object({
  id: z.string(),
  created: z.string(),
  lastModified: z.string(),
  ageClassroomsInterestedInOfferingFromEventParticipant: z.string().optional(),
  educatorsAtSchoolsFromEventParticipant: z.string().optional(),
  startedSsjCompletedSsjTypeform: z.string().optional(),
  currentSchoolFromEventParticipant2: z.string().optional(),
  ssjTypeformsStartASchoolFromEventParticipant: z.string().optional(),
  network: z.string().optional(),
  registrationDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  countofloggedplanningsFromEventParticipant: z.string().optional(),
  stageChangeFromDiscoveryToVisioningFromEventParticipant: z.string().optional(),
  entryDateFromStartASchoolFormFromEducators: z.string().optional(),
  registered: z.boolean().optional(),
  attended: z.boolean().optional(),
  createdFromEventParticipant2: z.string().optional(),
  currentSchoolFromEventParticipant: z.string().optional(),
  statusFromEventParticipant2: z.string().optional(),
  tlStoriesRace: z.string().optional(),
  montessoriCertifiedFromEventParticipant: z.string().optional(),
  tlStoriesQ1: z.string().optional(),
  tlStoriesQ2: z.string().optional(),
  sourceFromSsjTypeformsStartASchoolFromEventParticipant: z.string().optional(),
  eventType: z.string().optional(),
  ageClassroomsInterestedInOfferingFromEventParticipant2: z.string().optional(),
  incomeBackgroundFromEventParticipant: z.string().optional(),
  phone: z.string().regex(/^[\+]?[1-9]?\d{1,14}$/, "Invalid phone number").optional(),
  hubFromEventParticipant2: z.string().optional(),
  fullNameFromEventParticipant: z.string().optional(),
  countofloggeddiscoverFromEventParticipant: z.string().optional(),
  educatorId: z.string(),
  assignedPartnerFromEventParticipant2: z.string().optional(),
  householdIncomeFromEventParticipant2: z.string().optional(),
  tlStoriesSchoolTarget: z.string().optional(),
  stageChangeFromVisioningToPlanningFromEventParticipant: z.string().optional(),
  stageFromEventParticipant: z.string().optional(),
  educatorsAtSchoolsFromEventParticipant2: z.string().optional(),
  educatorRecordCreated: z.string().optional(),
  eventName: z.string().optional(),
  timeAtEvent: z.number().optional(),
  schoolStatusFromEventParticipant: z.string().optional(),
  eventAttendanceKey: z.any().optional(),
  whenDidTheySwitchToVisioning: z.string().optional(),
  raceEthnicityFromEventParticipant: z.string().optional(),
  hubFromEventParticipant: z.string().optional(),
  eventParticipant: z.array(z.string()).optional(),
  statusFromEventParticipant: z.string().optional(),
  hubNameFromEventParticipant: z.string().optional(),
  marketingSource: z.string().optional(),
  householdIncomeFromEventParticipant: z.string().optional(),
  event: z.array(z.string()).optional(),
  incomeBackgroundFromEventParticipant2: z.string().optional(),
  assignedPartnerFromEventParticipant: z.string().optional(),
  montessoriCertificationsFromEventParticipant: z.string().optional(),
  createdDate: z.string().optional(),
  firstVisioningFromEventParticipant: z.string().optional(),
  raceEthnicityFromEventParticipant2: z.string().optional(),
  tlStoriesType: z.string().optional(),
  createdFromEventParticipant: z.string().optional(),
  countofloggedvisioningFromEventParticipant: z.number().optional(),
  schoolStatusFromEventParticipant2: z.string().optional(),
  needsSpanishTranslation: z.boolean().optional(),
});

export const LEAD_ROUTING_AND_TEMPLATES_SCHEMA = z.object({
  id: z.string(),
  created: z.string(),
  lastModified: z.string(),
  state: z.string().optional(),
  sendgridTemplateId: z.string().optional(),
  geotype: z.string().optional(),
  cc: z.string().optional(),
  source: z.string().optional(),
  name: z.string().optional(),
  sender: z.string().email().optional(),
});

export const COHORTS_SCHEMA = z.object({
  id: z.string(),
  created: z.string(),
  lastModified: z.string(),
  charters: z.array(z.string()).optional(),
  cohortName: z.any().optional(),
  schools: z.array(z.string()).optional(),
  startDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  programType: z.string().optional(),
});

export const EVENTS_SCHEMA = z.object({
  id: z.string(),
  created: z.string(),
  lastModified: z.string(),
  date: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  eventName: z.string().optional(),
  type: z.array(z.string()).optional(),
  eventid: z.any().optional(),
  attendees: z.array(z.string()).optional(),
});

export const BOARD_SERVICE_SCHEMA = z.object({
  id: z.string(),
  created: z.string(),
  lastModified: z.string(),
  communityMemberName: z.string().optional(),
  contactEmailFromEducator: z.string().email().optional(),
  startDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  endDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  communityMemberEmail: z.string().email().optional(),
  currentlyActive: z.boolean().optional(),
  chair: z.boolean().optional(),
});

export const SUPABASE_JOIN_990_WITH_SCHOOL_SCHEMA = z.object({
  id: z.string(),
  created: z.string(),
  lastModified: z.string(),
  shortname: z.string().optional(),
  nineNinetiesYear: z.string().optional(),
});

export const CHARTERS_SCHEMA = z.object({
  id: z.string(),
  created: z.string(),
  lastModified: z.string(),
  locationIdFromLocations: z.string().optional(),
  schools: z.array(z.string()).optional(),
  charterAssessments: z.array(z.string()).optional(),
  incorporationDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  status: z.string().optional(),
  shortName: z.string().optional(),
  contactEmailFromExternalInitiators: z.string().email().optional(),
  cohorts: z.array(z.string()).optional(),
  currentlyActiveFromNontlRoles: z.string().optional(),
  charterlevelMembershipAgreementSigned: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  landscapeAnalysis: z.array(z.string()).optional(),
  firstSiteOpened: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  targetOpenFromCharterApplications: z.string().optional(),
  membershipStatusOfSchools: z.string().optional(),
  nonprofitStatus: z.string().optional(),
  currentTlsFromSchools: z.string().optional(),
  linkedSchools: z.string().optional(),
  recordIdFromSchools: z.string().optional(),
  locations: z.array(z.string()).optional(),
  supportTimeline: z.string().optional(),
  application: z.array(z.string()).optional(),
  initialTargetAges: z.string().optional(),
  nondiscriminationPolicyOnWebsite: z.boolean().optional(),
  docIdFromSchoolGovernanceDocuments: z.string().optional(),
  tlDiscoveryStatus: z.string().optional(),
  currentFyEnd: z.string().optional(),
  guidestarListingRequested: z.boolean().optional(),
  recidFromCharterApplications: z.string().optional(),
  dateReceivedGroupExemption: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  nameFromNontlRoles: z.string().optional(),
  authorized: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  charterKey: z.any().optional(),
  projectedOpen: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  partnershipWithWfStarted: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  initialTargetCommunity: z.string().optional(),
  nontlRoles: z.array(z.string()).optional(),
  website: z.string().url().optional(),
  charterlevelMembershipAgreement: z.array(z.string()).optional(),
  recidFromCharterAuthorizersAndContacts: z.string().optional(),
  schoolGovernanceDocuments: z.array(z.string()).optional(),
  annualEnrollmentAndDemographics: z.array(z.string()).optional(),
  recidFromSchoolReports: z.string().optional(),
  schoolReports: z.array(z.string()).optional(),
  groupExemptionStatus: z.string().optional(),
  nineNinetiesId: z.string().optional(),
  charterId: z.string().optional(),
  schoolProvidedWith1023RecordkeepingRequirements: z.boolean().optional(),
  charterassessmentid: z.string().optional(),
  fullName: z.string().optional(),
  ein: z.string().optional(),
  roleFromNontlRoles: z.string().optional(),
  initialTargetAgesLink: z.array(z.string()).optional(),
});

export const QBO_SCHOOL_CODES_SCHEMA = z.object({
  id: z.string(),
  created: z.string(),
  lastModified: z.string(),
  customerIdInQbo: z.string().optional(),
  schools: z.array(z.string()).optional(),
  schoolNameInQbo: z.string().optional(),
});

export const ACTION_STEPS_SCHEMA = z.object({
  id: z.string(),
  created: z.string(),
  lastModified: z.string(),
  assigneeShortName: z.string().optional(),
  completedDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  schoolShortName: z.string().optional(),
  partnersCopy: z.array(z.string()).optional(),
  schoolStatus: z.string().optional(),
  schools: z.array(z.string()).optional(),
  actionstepid: z.any().optional(),
  dueDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  assignee: z.array(z.string()).optional(),
  ssjStage: z.string().optional(),
  assignedDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  schoolId: z.string().optional(),
  charterId: z.string().optional(),
  status: z.string().optional(),
  item: z.string().optional(),
});

export const GUIDES_SCHEMA = z.object({
  id: z.string(),
  created: z.string(),
  lastModified: z.string(),
  stintTypeFromStints: z.array(z.string()).optional(),
  educatorRecordIds: z.string().optional(),
  photo: z.array(z.string()).optional(),
  name: z.string().optional(),
  email: z.string().email().optional(),
  papyrsProfile: z.string().optional(),
  phone: z.string().regex(/^[\+]?[1-9]?\d{1,14}$/, "Invalid phone number").optional(),
  educatorLog: z.string().optional(),
  personalEmail: z.string().email().optional(),
  imageUrl: z.string().optional(),
  slackHandle: z.string().optional(),
  roles: z.array(z.string()).optional(),
  dob: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  copperUserid: z.string().optional(),
  guideAssignments: z.array(z.string()).optional(),
  homeAddress: z.string().optional(),
  emailOrName: z.string().optional(),
  leadRouting: z.string().optional(),
  shortName: z.string().optional(),
  membershipTerminationStepsAndDates: z.string().optional(),
  ssjProcessDetails: z.string().optional(),
  guidedSchoolRecordId: z.string().optional(),
  startDateFromStints: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  activeStint: z.array(z.string()).optional(),
  websiteBio: z.string().optional(),
  recordId: z.any().optional(),
  currentlyActive: z.string().optional(),
  endDateFromStints: z.string().optional(),
  publicWebsiteActive: z.boolean().optional(),
});

export const CHARTER_ROLES_SCHEMA = z.object({
  id: z.string(),
  created: z.string(),
  lastModified: z.string(),
  charterApplications: z.array(z.string()).optional(),
  email: z.string().email().optional(),
  title: z.string().optional(),
  charterId: z.string(),
  raceEthnicityFromEducatorRecord: z.string().optional(),
  startDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  role: z.array(z.string()).optional(),
  charterRoleKey: z.any().optional(),
  currentPrimaryEmailAddressFromEducatorRecord: z.string().email().optional(),
  phone: z.string().regex(/^[\+]?[1-9]?\d{1,14}$/, "Invalid phone number").optional(),
  endDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  currentlyActive: z.boolean().optional(),
  name: z.string().optional(),
  statusFromCharter: z.string().optional(),
  educatorRecord: z.array(z.string()).optional(),
  charterApplications2: z.string().optional(),
  charterroleid: z.any().optional(),
  charter: z.array(z.string()).optional(),
});

export const MONTESSORI_CERTS_SCHEMA = z.object({
  id: z.string(),
  created: z.string(),
  lastModified: z.string(),
  certifierOther: z.string().optional(),
  educatorId: z.string(),
  level: z.string().optional(),
  yearCertified: z.string().optional(),
  abbreviation: z.string().optional(),
  certificationStatus: z.string().optional(),
});

export const GRANTS_SCHEMA = z.object({
  id: z.string(),
  created: z.string(),
  lastModified: z.string(),
  proofOf501c3StatusAtTimeOfGrant: z.array(z.string()).optional(),
  grantStatus: z.string().optional(),
  fundingPurposeForGrantAgreement: z.string().optional(),
  guideentrepreneurShortName: z.string().optional(),
  schoolContactEmailsFromSchool: z.array(z.string()).optional(),
  notes: z.string().optional(),
  prelimAdviceRequestTime: z.string().datetime().optional(),
  haveDataToIssueGrantLetter: z.any().optional(),
  fullAdviceOpenObjections: z.number().optional(),
  mailingAddress: z.string().optional(),
  issueDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  signedGrantAgreement: z.array(z.string()).optional(),
  fullAdviceRequestTime: z.string().datetime().optional(),
  fullAdviceYeses: z.number().optional(),
  schoolId: z.string(),
  readyToAcceptGrant501c3Ein: z.any().optional(),
  grantid: z.any().optional(),
  prelimAdviceYeses: z.number().optional(),
  fundingPeriodForGrantAgreement: z.string().optional(),
  tlsAtTimeOfGrant: z.string().optional(),
  membershipStatusFromSchool: z.string().optional(),
  membershipStatusAtTimeOfGrant: z.string().optional(),
  tlEmails: z.array(z.string()).optional(),
  legalNameOfSchool: z.string().optional(),
  legalNameAtTimeOfGrant: z.string().optional(),
  primaryContactsFromSchool: z.string().optional(),
  accountingNotes: z.string().optional(),
  tlEmailsAtTimeOfGrant: z.array(z.string()).optional(),
  ein: z.string().optional(),
  daysSincePrelimAdviceRequest: z.any().optional(),
  schoolGrantName: z.string().optional(),
  daysSinceFullAdviceRequest: z.any().optional(),
  nonprofitStatus: z.string().optional(),
  currentTls: z.string().optional(),
  grantKey: z.any().optional(),
  einAtTimeOfGrant: z.string().optional(),
  countOfActiveMailingAddressesFromSchool: z.number().optional(),
  amount: z.number().optional(),
  automationStepTrigger: z.string().optional(),
  currentMailingAddressFromSchool: z.string().optional(),
  nonprofitStatusAtTimeOfGrant: z.string().optional(),
  currentTlsFirstNames: z.string().optional(),
  school: z.array(z.string()).optional(),
  textForLedgerEntry: z.string().optional(),
  label: z.string().optional(),
  fundingSource: z.string().optional(),
  adviceWindow1WeekClosed: z.any().optional(),
  issuedByName: z.string().optional(),
  logoFromSchool: z.string().optional(),
  recipientNameFromQbo: z.string().optional(),
  schoolShortName: z.string().optional(),
  mailingAddressAtTimeOfGrant: z.string().optional(),
  unsignedGrantAgreement: z.array(z.string()).optional(),
  billcom: z.string().optional(),
  fundingHub: z.string().optional(),
  fullAdviceOpenQuestions: z.number().optional(),
  qbo: z.string().optional(),
  prelimAdvicePauses: z.number().optional(),
  issuedByShortName: z.string().optional(),
  primaryContactEmailFromSchool: z.array(z.string()).optional(),
});

export const MAILING_LISTS_SCHEMA = z.object({
  id: z.string(),
  created: z.string(),
  lastModified: z.string(),
  educatorLog: z.string().optional(),
  type: z.string().optional(),
  slug: z.string().optional(),
  name: z.string().optional(),
  googleGroupId: z.string().optional(),
});

export const LOAN_PAYMENTS_SCHEMA = z.object({
  id: z.string(),
  created: z.string(),
  lastModified: z.string(),
  amount: z.number().optional(),
  paymentDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  school: z.array(z.string()).optional(),
  shortName: z.string().optional(),
  paymentKey: z.any().optional(),
});

export const LOANS_SCHEMA = z.object({
  id: z.string(),
  created: z.string(),
  lastModified: z.string(),
  schoolId: z.string(),
  loanPaperwork: z.array(z.string()).optional(),
  approximateOutstandingAmount: z.number().optional(),
  loanid: z.any().optional(),
  loanContactEmail1: z.string().email().optional(),
  loanStatus: z.string().optional(),
  issueMethod: z.string().optional(),
  loanKey: z.any().optional(),
  school: z.array(z.string()).optional(),
  interestRate: z.number().optional(),
  contactEmailFromEducatorFromEducatorsXSchoolsFromSchool: z.array(z.string()).optional(),
  effectiveIssueDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  educatorsXSchools: z.array(z.string()).optional(),
  amountIssued: z.number().optional(),
  useOfProceeds: z.string().optional(),
  notes: z.string().optional(),
  loanContactEmail2: z.string().email().optional(),
  maturity: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
});

export const EDUCATOR_NOTES_SCHEMA = z.object({
  id: z.string(),
  created: z.string(),
  lastModified: z.string(),
  notes: z.string().optional(),
  private: z.boolean().optional(),
  createdBy: z.array(z.string()).optional(),
  partnersCopy: z.array(z.string()).optional(),
  educator: z.array(z.string()).optional(),
  educatornotesid: z.any().optional(),
  educatorId: z.string(),
  date: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  educatorNoteKey: z.any().optional(),
  fullNameFromEducator: z.string().optional(),
});

export const CHARTER_AUTHORIZERS_AND_CONTACTS_SCHEMA = z.object({
  id: z.string(),
  created: z.string(),
  lastModified: z.string(),
  authorizer: z.string().optional(),
  charter: z.array(z.string()).optional(),
  title: z.string().optional(),
  phone: z.string().regex(/^[\+]?[1-9]?\d{1,14}$/, "Invalid phone number").optional(),
  email: z.string().email().optional(),
  contact: z.string().optional(),
  currentlyActive: z.boolean().optional(),
  charterId: z.string().optional(),
  charterAuthorizerKey: z.any().optional(),
});

export const ASSESSMENT_DATA_SCHEMA = z.object({
  id: z.string(),
  created: z.string(),
  lastModified: z.string(),
  assessmentDataKey: z.any().optional(),
  assessment: z.array(z.string()).optional(),
  metOrExceedsFrl: z.number().optional(),
  numberAssessedEll: z.number().optional(),
  year: z.array(z.string()).optional(),
  numberAssessedSped: z.number().optional(),
  school: z.array(z.string()).optional(),
  numberAssessed: z.number().optional(),
  charterId: z.string().optional(),
  otherData: z.string().optional(),
  metOrExceedsBipoc: z.number().optional(),
  schoolid: z.string().optional(),
  numberAssessedBipoc: z.number().optional(),
  metOrExceedsAll: z.number().optional(),
  assessmentdataid: z.any().optional(),
  numberAssessedFrl: z.number().optional(),
  charter: z.array(z.string()).optional(),
  metOrExceedsSped: z.number().optional(),
  metOrExceedsEll: z.number().optional(),
});

export const MEMBERSHIP_TERMINATION_STEPS_AND_DATES_SCHEMA = z.object({
  id: z.string(),
  created: z.string(),
  lastModified: z.string(),
  fieldWithTargetDate: z.any().optional(),
  stepName: z.string().optional(),
  dayOfProcess: z.number().optional(),
  responsiblePersonAtWf: z.string().email().optional(),
});

export const EDUCATORS_X_SCHOOLS_SCHEMA = z.object({
  id: z.string(),
  created: z.string(),
  lastModified: z.string(),
  edxschoolKey: z.string().optional(),
  invitedTo2024Refresher: z.boolean().optional(),
  whoInitiatedEtlRemoval: z.string().optional(),
  school: z.array(z.string()).optional(),
  loanFund: z.boolean().optional(),
  loans: z.array(z.string()).optional(),
  tlGift2022: z.boolean().optional(),
  gsuiteRoles: z.string().optional(),
  schoolShortName: z.string().optional(),
  educator: z.array(z.string()).optional(),
  onNationalWebsite: z.string().optional(),
  signedTlAcknowledgementCommitmentToMembership: z.boolean().optional(),
  emailStatus: z.string().optional(),
  ssjStage: z.string().optional(),
  educatorId: z.string(),
  firstNameFromEducator: z.string().optional(),
  charterId: z.string().optional(),
  educatorFullName: z.string().optional(),
  startDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  educatorsxschoolsid: z.any().optional(),
  onWildflowerDirectory: z.string().optional(),
  onTeacherLeaderGoogleGroup: z.string().optional(),
  montessoriCertifications: z.string().optional(),
  emailAtSchool: z.string().email().optional(),
  roles: z.array(z.string()).optional(),
  stagestatus: z.string().optional(),
  schoolStatus: z.string().optional(),
  currentlyActive: z.boolean().optional(),
  endDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
});

export const NINE_NINETIES_SCHEMA = z.object({
  id: z.string(),
  created: z.string(),
  lastModified: z.string(),
  supabaseid: z.string().optional(),
  aiDerivedRevenue: z.number().optional(),
  aiDerivedEoyDate: z.string().optional(),
  nineNinetiesReportingYear: z.string().optional(),
  schoolId: z.string(),
  charterId: z.string().optional(),
  notes: z.string().optional(),
});

export const GOVERNANCE_DOCS_SCHEMA = z.object({
  id: z.string(),
  created: z.string(),
  lastModified: z.string(),
  documentType: z.string().optional(),
  govdocid: z.any().optional(),
  date: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  docKey: z.any().optional(),
  charterId: z.string().optional(),
  shortname: z.string().optional(),
  docNotes: z.string().optional(),
  docLink: z.string().optional(),
  publicationLink: z.string().optional(),
  schoolId: z.string().optional(),
  urlpdfExtensionFormula: z.string().url().optional(),
  school: z.array(z.string()).optional(),
  documentPdf: z.array(z.string()).optional(),
  charter: z.array(z.string()).optional(),
});

export const GUIDES_ASSIGNMENTS_SCHEMA = z.object({
  id: z.string(),
  created: z.string(),
  lastModified: z.string(),
  currentlyActive: z.boolean().optional(),
  guideShortName: z.string().optional(),
  endDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  schoolShortName: z.string().optional(),
  schoolId: z.string(),
  startDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")).optional(),
  type: z.string().optional(),
});

export const TRAINING_GRANTS_SCHEMA = z.object({
  id: z.string(),
  created: z.string(),
  lastModified: z.string(),
  stageFromEducators: z.string().optional(),
  trainingStatus: z.string().optional(),
  hubNameFromEducators: z.string().optional(),
  trainingGrantAmount: z.number().optional(),
  statusFromEducators: z.string().optional(),
  trainingProgram: z.string().optional(),
  cohort: z.string().optional(),
  notes: z.string().optional(),
  applied: z.boolean().optional(),
  trainingGrantStatus: z.string().optional(),
});

export const REPORTS_AND_SUBMISSIONS_SCHEMA = z.object({
  id: z.string(),
  created: z.string(),
  lastModified: z.string(),
  charter: z.array(z.string()).optional(),
  reportsid: z.any().optional(),
  attachments: z.array(z.string()).optional(),
  schoolYear: z.array(z.string()).optional(),
  reportType: z.string().optional(),
  charterId: z.string().optional(),
});

export const STATES_ALIASES_SCHEMA = z.object({
  id: z.string(),
  created: z.string(),
  lastModified: z.string(),
  abbreviation: z.string().optional(),
  state: z.string().optional(),
});

export const PUBLIC_FUNDING_SCHEMA = z.object({
  id: z.string(),
  created: z.string(),
  lastModified: z.string(),
  description: z.string().optional(),
  schools: z.array(z.string()).optional(),
  name: z.string().optional(),
  relevantLevels: z.array(z.string()).optional(),
});

export const ANNUAL_ENROLLMENT_AND_DEMOGRAPHICS_SCHEMA = z.object({
  id: z.string(),
  created: z.string(),
  lastModified: z.string(),
  annualDataKey: z.any().optional(),
  school: z.array(z.string()).optional(),
  numberOfEnrolledStudentsFrl: z.number().optional(),
  numberOfEnrolledStudentsBipoc: z.number().optional(),
  charter: z.array(z.string()).optional(),
  schoolId: z.string().optional(),
  numberOfEnrolledStudentsSped: z.number().optional(),
  numberOfEnrolledStudentsAll: z.number().optional(),
  numberOfEnrolledStudentsEll: z.number().optional(),
  schoolYear: z.array(z.string()).optional(),
  annualdataid: z.any().optional(),
});

export const ASSESSMENTS_SCHEMA = z.object({
  id: z.string(),
  created: z.string(),
  lastModified: z.string(),
  shortName: z.string().optional(),
  fullName: z.string().optional(),
  domain: z.string().optional(),
  annualAssessmentImplementationsBySchool: z.array(z.string()).optional(),
  grades: z.array(z.string()).optional(),
});

export const EVENT_TYPES_SCHEMA = z.object({
  id: z.string(),
  created: z.string(),
  lastModified: z.string(),
  events: z.array(z.string()).optional(),
  eventCategory: z.string().optional(),
});

export const EMAIL_ADDRESSES_SCHEMA = z.object({
  id: z.string(),
  created: z.string(),
  lastModified: z.string(),
  emailType: z.string().optional(),
  active: z.boolean().optional(),
  emailAddress: z.string().email().optional(),
  educatorId: z.string(),
  educator: z.array(z.string()).optional(),
  emailaddressid: z.string().optional(),
  currentPrimaryEmail: z.boolean().optional(),
});

export const MONTESSORI_CERTIFIERS_OLD_LIST_SCHEMA = z.object({
  id: z.string(),
  created: z.string(),
  lastModified: z.string(),
  name: z.string().optional(),
  ssjFilloutFormGetInvolved2: z.string().optional(),
  ssjFilloutFormGetInvolved: z.string().optional(),
  ssjFilloutFormGetInvolved4: z.string().optional(),
  abbreviation: z.string().optional(),
  ssjFilloutFormGetInvolved3: z.string().optional(),
});

export const MARKETING_SOURCE_OPTIONS_SCHEMA = z.object({
  id: z.string(),
  created: z.string(),
  lastModified: z.string(),
  marketingSource: z.string().optional(),
  educators: z.array(z.string()).optional(),
});

export const MONTESSORI_CERT_LEVELS_SCHEMA = z.object({
  id: z.string(),
  created: z.string(),
  lastModified: z.string(),
  name: z.string().optional(),
  educators: z.string().optional(),
});

export const RACE_AND_ETHNICITY_SCHEMA = z.object({
  id: z.string(),
  created: z.string(),
  lastModified: z.string(),
  ssjFilloutFormGetInvolved: z.string().optional(),
  name: z.string().optional(),
});

export const AGES_GRADES_SCHEMA = z.object({
  id: z.string(),
  created: z.string(),
  lastModified: z.string(),
  name: z.string().optional(),
});

export const MONTESSORI_CERTIFIERS_SCHEMA = z.object({
  id: z.string(),
  created: z.string(),
  lastModified: z.string(),
  abbreviation: z.string().optional(),
  name: z.string().optional(),
});

// Generated Table Interfaces

// Partners copy table
export interface Partner extends BaseRecord {
  roles?: string[];
  emailTemplates?: string;
  educatorRecordIds?: string;
  grants5?: string[];
  guideAssignments?: string;
  shortName?: string;
  publicWebsiteActive?: boolean;
  websiteBio?: string;
  educatorNotes?: string[];
  startDateFromStints?: string;
  endDateFromStints?: string;
  currentlyActive?: string;
  slackHandle?: string;
  actionSteps?: string[];
  dob?: string;
  recordId?: any;
  photo?: string[];
  activeStint?: string[];
  tls?: string[];
  phone?: string;
  papyrsProfile?: string;
  stintTypeFromStints?: string[];
  name?: string;
  homeAddress?: string;
  schools?: string[];
  schoolNotes?: string[];
  email?: string;
  guidedSchoolRecordId?: string;
  ssjProcessDetails?: string;
  personalEmail?: string;
  syncedRecordId?: string;
  imageUrl?: string;
  membershipTerminationStepsAndDates?: string;
  copperUserid?: string;
  emailOrName?: string;
}

// SSJ Fillout Forms table
export interface SSJFilloutForm extends BaseRecord {
  isInterestedInCharterFromEmail?: boolean;
  tempMCertCert1?: string;
  socioeconomicGenderOther?: string;
  tempMCertLevel3?: string;
  socioeconomicRaceEthnicityOther?: string;
  montessoriCertificationCertifier2?: string[];
  receiveCommunications?: string;
  socioeconomicRaceEthnicity?: string[];
  communityMemberInterest?: string;
  montessoriCertificationYear3?: string;
  tempMCertYear4?: string;
  statusOfProcessingMontessoriCerts?: string;
  tempMCertYear2?: string;
  contactTypeStandardized?: any;
  city?: string;
  marketingCampaign?: string;
  stateStandardized?: string;
  montessoriCertQ?: string;
  tempMCertLevel4?: string;
  primaryLanguage?: string;
  firstName?: string;
  initialOutreacher?: string;
  country2?: string;
  tempMCertCert3?: string;
  assignedPartnerOverride?: string;
  montessoriCertificationLevel1?: string[];
  state2?: string;
  socioeconomicHouseholdIncome?: string;
  montessoriCertificationYear4?: string;
  routedTo?: string;
  socioeconomicGender?: string;
  entryDate?: string;
  tempMCertLevel2?: string;
  marketingSource?: string;
  sendgridSentDate?: string;
  city2?: string;
  ssjfilloutformid?: any;
  montessoriCertificationLevel3?: string[];
  montessoriCertificationYear2?: string;
  fullName?: any;
  educatorInterestsOther?: string;
  isSeekingMontessoriCertification?: any;
  email?: string;
  sendgridTemplateId?: string;
  assignedPartnerFromEducators?: string;
  genderStandardized?: any;
  educatorId?: string;
  montessoriCertificationYear1?: string;
  montessoriCertificationCertifier1?: string[];
  tempMCertYear1?: string;
  communityMemberCommunityInfo?: string;
  communityMemberSupportFindingTeachers?: boolean;
  sourceForNontls?: string;
  formVersion?: string;
  socioeconomicLgbtqiaIdentifyingFromEmail?: boolean;
  tempMCertCert2?: string;
  communityMemberSelfInfo?: string;
  ssjFilloutFormKey?: any;
  tempMCertYear3?: string;
  educators?: string[];
  linkToStartASchool?: string[];
  personResponsibleForFollowUp?: string;
  socioeconomicPronounsOther?: string;
  country?: string;
  emailSentByInitialOutreacher?: boolean;
  sourceOther?: string;
  lastName?: string;
  state?: string;
  socioeconomicPronouns?: string;
  contactType?: string;
  isMontessoriCertified?: any;
  tempMCertCert4?: string;
  montessoriCertificationLevel2?: string[];
  tempMCertLevel1?: string;
  primaryLanguageOther?: string;
  oneOnOneStatus?: string;
  interestedInCharter?: boolean;
  montessoriCertificationCertifier3?: string[];
  message?: string;
  source?: string;
  montessoriCertificationCertifier4?: string[];
}

// Marketing sources mapping table
export interface MarketingSourceMapping extends BaseRecord {
  recid?: any;
  educatorsOptions?: string;
  educatorsOther?: string;
  filloutOptions?: string;
}

// Charter applications table
export interface CharterApplication extends BaseRecord {
  capacityInterviewComplete?: string;
  capacityInterviewProjectedDate?: string;
  charter?: string[];
  letterOfIntentDeadline?: string;
  nonprofitStatus?: string;
  authorizerDecisionRecd?: string;
  targetCommunityFromCharter?: string;
  finalBudget?: string[];
  currentTlDiscoveryStatus?: string;
  likelihoodOfOpeningOnTime?: string;
  authorizerDecision?: string;
  shortName?: string;
  budgetPlanningExercises?: string[];
  fullName?: string;
  charterappid?: any;
  milestones?: any;
  membershipStatusOfSchools?: string;
  grades?: any;
  charterAppKey?: any;
  letterOfIntentReqd?: string;
  authorizerDecisionExpectedDate?: string;
  keyDates?: any;
  expectedDecision?: string;
  opportunitiesAndChallenges?: string;
  OfStudents?: number;
  appSubmissionDeadline?: string;
  likelihoodOfAuthorization?: string;
  currentTlsFromSchoolsFromCharter?: string;
  landscapeAnalysisFromCharter?: string;
  charterAppProjectMgmtPlanComplete?: boolean;
  appSubmitted?: string;
  charterDesign?: string[];
  mostRecentApplication?: boolean;
  boardMembershipAgreementSigned?: string;
  targetOpen?: string;
  beginningAge?: string[];
  cohortsFromCharter?: string;
  logicModelComplete?: boolean;
  endingAge?: string[];
  charterDesignAdviceSessionComplete?: string;
  loi?: string[];
  loiSubmitted?: string;
  authorizer?: string;
  charterAppRolesIdd?: boolean;
  communityEngagementPlanLaunched?: boolean;
  jointKickoffMeetingComplete?: boolean;
  supportTimeline?: string[];
  status?: string;
  capacityInterviewTrainingComplete?: boolean;
  charterlevelMembershipAgreementSigned?: string;
  charterAppWalkthrough?: string;
  tlMembershipAgreementSigned?: string;
  applicationWindow?: string;
  charterId: string;
  internalWfSupportLaunchMeeting?: string;
  jointKickoffMeeting?: string;
}

// Schools table
export interface School extends BaseRecord {
  numberOfClassrooms?: number;
  lease?: string;
  gusto?: string;
  enrollmentAtFullCapacity?: number;
  ssjIsTheSchoolPlanningToApplyForInternalWildflowerFunding?: string;
  guideEmail?: string[];
  locationid?: string;
  emailDomain?: string;
  ssjCohortStatus?: string;
  visioningAlbumComplete?: boolean;
  transparentClassroom?: string;
  ssjOriginalProjectedOpenDate?: string;
  latinxFromFamilySurvey?: string;
  logoUrl?: string;
  globalMajority?: string;
  ssjGapInFunding?: string;
  planningAlbum?: string[];
  countOfActiveMailingAddresses?: number;
  websiteTool?: string;
  charterId?: string;
  schoolEmail?: string;
  ssjLoanEligibility?: string;
  facebook?: string;
  currentPhysicalAddress?: string;
  ssjProjOpenSchoolYearBackup?: string;
  primaryContactEmail?: string[];
  locations?: string[];
  frl?: string;
  guideassignmentid?: string;
  opened?: string;
  governanceModel?: string;
  leaseEndDate?: string;
  enteredPlanningDate?: string;
  dateWithdrawnFromGroupExemption?: string;
  nondiscriminationPolicyOnApplication?: boolean;
  ssjIsTheBudgetAtAStageThatWillAllowTheEtlsToTakeTheirNextSteps?: string;
  emailAtSchoolFromEducatorsXSchools?: string[];
  mediumIncome?: string;
  legalName?: string;
  agreementVersion?: string;
  familysurveyid?: string;
  isThereA2022990?: number;
  highIncomeFromFamilySurvey?: string;
  groupExemptionStatus?: string;
  nineNinetiesAttachment?: string;
  membershipAgreementDate?: string;
  lowIncome?: string;
  currentTls?: string;
  OfFormsSent?: string;
  shortName?: string;
  flexibleTuitionModel?: boolean;
  grantsWf?: string[];
  googleVoice?: string;
  grantid?: string;
  schoolNotes?: string[];
  signedMembershipAgreement?: string[];
  ssjFacility?: string;
  ssjTargetCity?: string;
  nondiscriminationPolicyOnWebsite?: boolean;
  nativeAmericanFromFamilySurvey?: string;
  agesServed?: string[];
  ssjIsTheTeamOnTrackForTheirEnrollmentGoals?: string;
  building4goodFirmAttorney?: string;
  enteredVisioningDate?: string;
  primaryContactId?: string;
  raceEthnicityFromEducatorViaEducatorsXSchools?: string;
  schoolStatus?: string;
  nineninetyid?: string;
  leftNetworkDate?: string;
  activeGuides?: string;
  tcRecordkeeping?: string;
  ssjDoesTheSchoolHaveAViablePathwayToFunding?: string;
  logo?: string[];
  currentPhysicalAddressState?: string;
  billcomAccount?: string;
  instagram?: string;
  ein?: string;
  loanFromLoansIssueMethod?: string;
  currentPhysicalAddressCity?: string;
  bookkeeperAccountant?: string;
  ssjLoanApprovedAmt?: string;
  logoDesigner?: string;
  foundingDocuments?: string;
  ssjDateSharedWithN4gFromSsjProcessDetails?: string;
  tcAdmissions?: string;
  ssjBuilding4goodStatus?: string;
  narrative?: string;
  currentMailingAddress?: string;
  ssjTotalStartupFundingNeeded?: string;
  schoolContactEmails?: string[];
  OfAsianAmericanStudents?: string;
  budgetUtility?: string;
  ssjWhatIsTheNextBigDecisionOrActionThisSchoolIsWorkingOn?: string;
  dateReceivedGroupExemption?: string;
  pod?: string;
  legalStructure?: string;
  OfAfricanAmericanStudents?: string;
  archived?: boolean;
  incorporationDate?: string;
  activelongitude?: string;
  ssjSsjTool?: string;
  leftNetworkReason?: string[];
  about?: string;
  ssjReadinessToOpenRating?: string;
  ssjFundraisingNarrative?: string;
  tcSchoolId?: string;
  ssjBoardDevelopment?: string;
  charter?: string[];
  fullNameFromFoundersList?: string;
  institutionalPartner?: string;
  primaryContacts?: string[];
  countofactiveguides?: number;
  schoolPhone?: string;
  actionstepid?: string;
  charterShortName?: string;
  dedupeSchoolWith?: string;
  educatorsxschoolsid?: string;
  guidestarListingRequested?: boolean;
  whiteFromFamilySurvey?: string;
  priorNames?: string;
  guideAssignments?: string[];
  schoolnoteid?: string;
  website?: string;
  OfStudents?: string;
  schoolSchedule?: string[];
  ssjTargetState?: string;
  domainName?: string;
  educators?: string;
  name: string;
  trademarkFiled?: string;
  activelatitude?: string;
  googleWorkspaceOrgUnitPath?: string;
  aboutSpanish?: string;
  loanid?: string;
  loanReportName?: string;
  currentFyEnd?: string;
  ssjProjectedOpen?: string;
  middleEastern?: string;
  businessInsurance?: string;
  onNationalWebsite?: string;
  qbo?: string;
  ssjStage?: string;
  nonprofitStatus?: string;
  admissionsSystem?: string;
  ssjHasTheEtlIdentifiedAPartner?: string;
  ssjNameReserved?: string;
  pacificIslanderFromFamilySurvey?: string;
  countOfActivePhysicalAddresses?: number;
  automationNotes?: string;
  membershipStatus?: string;
  enteredStartupDate?: string;
  ssjAmountRaised?: string;
  nameSelectionProposal?: string;
  schoolCalendar?: string;
  educatorsXSchools?: string[];
}

// Educators table
export interface Educator extends BaseRecord {
  householdIncome?: string;
  otherLanguages?: string[];
  statusForActiveSchool?: string;
  assignedPartnerOverrideFromSsjFilloutForms?: string;
  trainingGrants?: string[];
  startupStageForActiveSchool?: string;
  primaryContactFor?: string[];
  activeHolaspirit?: boolean;
  nickname?: string;
  educatorNotes?: string[];
  ssjfilloutformid?: string;
  routedTo?: string;
  gender?: string;
  assignedPartner?: string[];
  firstContactNotesOnPrewildflowerEmployment?: string;
  alsoAPartner?: boolean;
  stagestatusForActiveSchool?: string;
  montessoriLeadGuideTrainings?: string[];
  assignedPartnerEmail?: string;
  raceEthnicity?: string[];
  notesFromEducatorNotes?: string;
  montessoriCertifications?: string[];
  targetInternational?: string;
  genderOther?: string;
  educatorsxschoolsid?: string;
  sourceOther?: string;
  certifierFromMontessoriCertifications?: string;
  survey2022WildflowerNetworkSurvey?: boolean;
  pronouns?: string;
  archived?: boolean;
  educatorsAtSchools?: string[];
  currentPrimaryEmailAddress?: string;
  emailSentByInitialOutreacher?: string;
  secondaryPhone?: string;
  pronunciation?: string;
  eventsAttended?: string[];
  currentlyActiveSchool?: string;
  montessoriCertified?: string;
  firstContactInitialInterests?: string;
  schoolAddress?: string;
  currentRole?: string;
  middleName?: string;
  lgbtqia?: string;
  certificationLevelsFromMontessoriCertifications?: string;
  opsGuideRequestPertinentInfo?: string;
  activeSchoolAffiliationStatus?: string;
  montessoricertid?: string;
  pronounsOther?: string;
  dedupeWith?: string;
  lastName?: string;
  educatornotesid?: string;
  raceEthnicityOther?: string;
  targetState?: string;
  entryDateFromSsjFilloutForms?: string;
  tcUserId?: string;
  emailid?: string;
  countOfGetInvolvedForms?: number;
  contactFormDetailsFromSsjDataOnEducators?: string;
  newsletterAndGroupSubscriptions?: string[];
  homeAddress?: string;
  cohorts?: string;
  source?: string[];
  countoflinkedschools?: number;
  educationalAttainment?: string;
  messageFromSsjFilloutForms?: string;
  opsGuideAnyFundraisingOpportunities?: string;
  primaryLanguage?: string[];
  fullName?: any;
  firstName?: string;
  onSchoolBoard?: string;
  discoveryStatus?: string;
  firstContactWfSchoolEmploymentStatus?: string;
  primaryPhone?: string;
  activeSchoolRecordId?: string;
  individualType?: string;
  educatorId?: string;
  onboardingExperience?: string;
  firstContactWillingnessToRelocate?: boolean;
  assignedPartnerShortName?: string;
  targetCity?: string;
  schoolStatuses?: string;
  currentlyActiveAtASchool?: string;
  oneOnOneStatus?: string;
  allSchools?: string;
  ssjoldstartaschoolid?: string;
  excludeFromEmailLogging?: boolean;
  incomeBackground?: string;
}

// SSJ Typeforms: Start a School table
export interface SSJTypeform extends BaseRecord {
  ssjDataOnEducators?: string;
  registeredFromEventAttendance?: string;
  firstName?: string;
  socioeconomicPrimaryLanguage?: string;
  receiveCommunications?: boolean;
  contactLocationState?: string;
  montessoriCertificationYear?: string;
  createdAt?: string;
  message?: string;
  source?: string;
  socioeconomicPronounsOther?: string;
  socioeconomicPronouns?: string;
  entryDate?: string;
  ssjFilloutFormGetInvolved2?: string;
  tags?: string;
  educator?: string;
  schoolLocationCity?: string;
  ssjFilloutFormGetInvolved?: string;
  schoolLocationState?: string;
  socioeconomicGender?: string;
  montessoriCertificationCertifier?: string;
  timeAtEventFromEventAttendance?: string;
  socioeconomicRaceEthnicity?: string;
  schoolLocationCountry?: string;
  initialInterestInGovernanceModel?: string;
  socioeconomicRaceEthnicityOther?: string;
  ageClassroomsInterestedInOffering?: string;
  isInterestedInCharter?: boolean;
  attendedFromEventAttendance?: string;
  isSeekingMontessoriCertification?: boolean;
  schoolLocationCommunity?: string;
  equityReflection?: string;
  socioeconomicLgbtqiaIdentifying?: string;
  socioeconomicHouseholdIncome?: string;
  contactLocationCountry?: string;
  socioeconomicGenderOther?: string;
  hasInterestInJoiningAnotherSchool?: boolean;
  isWillingToMove?: boolean;
  contactLocationCity?: string;
  lastName?: string;
  isMontessoriCertified?: boolean;
  recordIdFromEventParticipantFromEventAttendance?: string;
  montessoriCertificationLevels?: string;
}

// School notes table
export interface SchoolNote extends BaseRecord {
  schoolnoteid?: any;
  createdBy?: string[];
  schoolId: string;
  partnerShortName?: string;
  headlineNotes?: string;
  school?: string[];
  schoolNoteKey?: any;
  charterId?: string;
  partnersCopy?: string[];
  notes?: string;
  dateCreated?: string;
  private?: boolean;
}

// Membership termination steps table
export interface MembershipTerminationStep extends BaseRecord {
  initialTcCondition?: string;
  deactivateListservs?: string;
  deactivateGsuiteTargetDate?: string;
  deactivateWildflowerschoolsorgProfile?: string;
  deactivateWildflowerschoolsorgProfileTargetDate?: string;
  deactivateWebsiteTargetDate?: string;
  initialGustoCondition?: string;
  initialSlackCondition?: string;
  deactivateSlackTargetDate?: string;
  terminationTriggerDate?: string;
  initialQboCondition?: string;
  deactivateListservsTargetDate?: string;
  deactivateGroupExemption?: string;
  deactivateTc?: string;
  deactivateGroupExemptionTargetDate?: string;
  schoolContactEmailsFromSchool?: string[];
  deactivateWebsite?: string;
  deactivateSlack?: string;
  initialWebsiteCondition?: string;
  updateAirtableFields?: string;
  deactivateGustoTargetDate?: string;
  initialGroupExemptionCondition?: string;
  deactivateGusto?: string;
  membershipTerminationLetterFromSchool?: string;
  deactivateQboTargetDate?: string;
  deactivateQbo?: string;
  deactivateGsuite?: string;
  deactivateTcTargetDate?: string;
}

// Locations table
export interface Location extends BaseRecord {
  geocodeAutomationLastRunAt?: string;
  country?: string;
  qualifiedLowIncomeCensusTract?: string;
  street?: string;
  address?: string;
  lease?: string[];
  timeZone?: string;
  endOfTimeAtLocation?: string;
  locationKey?: any;
  censusTract?: string;
  squareFeet?: number;
  neighborhood?: string;
  schoolStatusFromSchool?: string;
  longitude?: number;
  charter?: string[];
  state?: string;
  currentPhysicalAddress?: boolean;
  maxStudentsLicensedFor?: number;
  postalCode?: string;
  latitude?: number;
  leaseEndDate?: string;
  locationid?: any;
  locationType?: string;
  school?: string[];
  charterId?: string;
  city?: string;
  currentMailingAddress?: boolean;
  inactiveWithoutEndDateOrActiveWithEndDate?: any;
  colocationType?: string;
  startOfTimeAtLocation?: string;
  shortName?: string;
  colocationPartner?: string;
  schoolId: string;
}

// Event attendance table
export interface EventAttendance extends BaseRecord {
  ageClassroomsInterestedInOfferingFromEventParticipant?: string;
  educatorsAtSchoolsFromEventParticipant?: string;
  startedSsjCompletedSsjTypeform?: string;
  currentSchoolFromEventParticipant2?: string;
  ssjTypeformsStartASchoolFromEventParticipant?: string;
  network?: string;
  registrationDate?: string;
  countofloggedplanningsFromEventParticipant?: string;
  stageChangeFromDiscoveryToVisioningFromEventParticipant?: string;
  entryDateFromStartASchoolFormFromEducators?: string;
  registered?: boolean;
  attended?: boolean;
  createdFromEventParticipant2?: string;
  currentSchoolFromEventParticipant?: string;
  statusFromEventParticipant2?: string;
  tlStoriesRace?: string;
  montessoriCertifiedFromEventParticipant?: string;
  tlStoriesQ1?: string;
  tlStoriesQ2?: string;
  sourceFromSsjTypeformsStartASchoolFromEventParticipant?: string;
  eventType?: string;
  ageClassroomsInterestedInOfferingFromEventParticipant2?: string;
  incomeBackgroundFromEventParticipant?: string;
  phone?: string;
  hubFromEventParticipant2?: string;
  fullNameFromEventParticipant?: string;
  countofloggeddiscoverFromEventParticipant?: string;
  educatorId: string;
  assignedPartnerFromEventParticipant2?: string;
  householdIncomeFromEventParticipant2?: string;
  tlStoriesSchoolTarget?: string;
  stageChangeFromVisioningToPlanningFromEventParticipant?: string;
  stageFromEventParticipant?: string;
  educatorsAtSchoolsFromEventParticipant2?: string;
  educatorRecordCreated?: string;
  eventName?: string;
  timeAtEvent?: number;
  schoolStatusFromEventParticipant?: string;
  eventAttendanceKey?: any;
  whenDidTheySwitchToVisioning?: string;
  raceEthnicityFromEventParticipant?: string;
  hubFromEventParticipant?: string;
  eventParticipant?: string[];
  statusFromEventParticipant?: string;
  hubNameFromEventParticipant?: string;
  marketingSource?: string;
  householdIncomeFromEventParticipant?: string;
  event?: string[];
  incomeBackgroundFromEventParticipant2?: string;
  assignedPartnerFromEventParticipant?: string;
  montessoriCertificationsFromEventParticipant?: string;
  createdDate?: string;
  firstVisioningFromEventParticipant?: string;
  raceEthnicityFromEventParticipant2?: string;
  tlStoriesType?: string;
  createdFromEventParticipant?: string;
  countofloggedvisioningFromEventParticipant?: number;
  schoolStatusFromEventParticipant2?: string;
  needsSpanishTranslation?: boolean;
}

// Lead Routing and Templates table
export interface LeadRoutingTemplate extends BaseRecord {
  state?: string;
  sendgridTemplateId?: string;
  geotype?: string;
  cc?: string;
  source?: string;
  name?: string;
  sender?: string;
}

// Cohorts table
export interface Cohort extends BaseRecord {
  charters?: string[];
  cohortName?: any;
  schools?: string[];
  startDate?: string;
  programType?: string;
}

// Events table
export interface Event extends BaseRecord {
  date?: string;
  eventName?: string;
  type?: string[];
  eventid?: any;
  attendees?: string[];
}

// Board Service table
export interface BoardService extends BaseRecord {
  communityMemberName?: string;
  contactEmailFromEducator?: string;
  startDate?: string;
  endDate?: string;
  communityMemberEmail?: string;
  currentlyActive?: boolean;
  chair?: boolean;
}

// Supabase join 990 with school table
export interface Supabase990School extends BaseRecord {
  shortname?: string;
  nineNinetiesYear?: string;
}

// Charters table
export interface Charter extends BaseRecord {
  locationIdFromLocations?: string;
  schools?: string[];
  charterAssessments?: string[];
  incorporationDate?: string;
  status?: string;
  shortName?: string;
  contactEmailFromExternalInitiators?: string;
  cohorts?: string[];
  currentlyActiveFromNontlRoles?: string;
  charterlevelMembershipAgreementSigned?: string;
  landscapeAnalysis?: string[];
  firstSiteOpened?: string;
  targetOpenFromCharterApplications?: string;
  membershipStatusOfSchools?: string;
  nonprofitStatus?: string;
  currentTlsFromSchools?: string;
  linkedSchools?: string;
  recordIdFromSchools?: string;
  locations?: string[];
  supportTimeline?: string;
  application?: string[];
  initialTargetAges?: string;
  nondiscriminationPolicyOnWebsite?: boolean;
  docIdFromSchoolGovernanceDocuments?: string;
  tlDiscoveryStatus?: string;
  currentFyEnd?: string;
  guidestarListingRequested?: boolean;
  recidFromCharterApplications?: string;
  dateReceivedGroupExemption?: string;
  nameFromNontlRoles?: string;
  authorized?: string;
  charterKey?: any;
  projectedOpen?: string;
  partnershipWithWfStarted?: string;
  initialTargetCommunity?: string;
  nontlRoles?: string[];
  website?: string;
  charterlevelMembershipAgreement?: string[];
  recidFromCharterAuthorizersAndContacts?: string;
  schoolGovernanceDocuments?: string[];
  annualEnrollmentAndDemographics?: string[];
  recidFromSchoolReports?: string;
  schoolReports?: string[];
  groupExemptionStatus?: string;
  nineNinetiesId?: string;
  charterId?: string;
  schoolProvidedWith1023RecordkeepingRequirements?: boolean;
  charterassessmentid?: string;
  fullName?: string;
  ein?: string;
  roleFromNontlRoles?: string;
  initialTargetAgesLink?: string[];
}

// QBO School Codes table
export interface QBOSchoolCode extends BaseRecord {
  customerIdInQbo?: string;
  schools?: string[];
  schoolNameInQbo?: string;
}

// Action steps table
export interface ActionStep extends BaseRecord {
  assigneeShortName?: string;
  completedDate?: string;
  schoolShortName?: string;
  partnersCopy?: string[];
  schoolStatus?: string;
  schools?: string[];
  actionstepid?: any;
  dueDate?: string;
  assignee?: string[];
  ssjStage?: string;
  assignedDate?: string;
  schoolId?: string;
  charterId?: string;
  status?: string;
  item?: string;
}

// Guides table
export interface Guide extends BaseRecord {
  stintTypeFromStints?: string[];
  educatorRecordIds?: string;
  photo?: string[];
  name?: string;
  email?: string;
  papyrsProfile?: string;
  phone?: string;
  educatorLog?: string;
  personalEmail?: string;
  imageUrl?: string;
  slackHandle?: string;
  roles?: string[];
  dob?: string;
  copperUserid?: string;
  guideAssignments?: string[];
  homeAddress?: string;
  emailOrName?: string;
  leadRouting?: string;
  shortName?: string;
  membershipTerminationStepsAndDates?: string;
  ssjProcessDetails?: string;
  guidedSchoolRecordId?: string;
  startDateFromStints?: string;
  activeStint?: string[];
  websiteBio?: string;
  recordId?: any;
  currentlyActive?: string;
  endDateFromStints?: string;
  publicWebsiteActive?: boolean;
}

// Charter roles table
export interface CharterRole extends BaseRecord {
  charterApplications?: string[];
  email?: string;
  title?: string;
  charterId: string;
  raceEthnicityFromEducatorRecord?: string;
  startDate?: string;
  role?: string[];
  charterRoleKey?: any;
  currentPrimaryEmailAddressFromEducatorRecord?: string;
  phone?: string;
  endDate?: string;
  currentlyActive?: boolean;
  name?: string;
  statusFromCharter?: string;
  educatorRecord?: string[];
  charterApplications2?: string;
  charterroleid?: any;
  charter?: string[];
}

// Montessori Certs table
export interface MontessoriCert extends BaseRecord {
  certifierOther?: string;
  educatorId: string;
  level?: string;
  yearCertified?: string;
  abbreviation?: string;
  certificationStatus?: string;
}

// Grants table
export interface Grant extends BaseRecord {
  proofOf501c3StatusAtTimeOfGrant?: string[];
  grantStatus?: string;
  fundingPurposeForGrantAgreement?: string;
  guideentrepreneurShortName?: string;
  schoolContactEmailsFromSchool?: string[];
  notes?: string;
  prelimAdviceRequestTime?: string;
  haveDataToIssueGrantLetter?: any;
  fullAdviceOpenObjections?: number;
  mailingAddress?: string;
  issueDate?: string;
  signedGrantAgreement?: string[];
  fullAdviceRequestTime?: string;
  fullAdviceYeses?: number;
  schoolId: string;
  readyToAcceptGrant501c3Ein?: any;
  grantid?: any;
  prelimAdviceYeses?: number;
  fundingPeriodForGrantAgreement?: string;
  tlsAtTimeOfGrant?: string;
  membershipStatusFromSchool?: string;
  membershipStatusAtTimeOfGrant?: string;
  tlEmails?: string[];
  legalNameOfSchool?: string;
  legalNameAtTimeOfGrant?: string;
  primaryContactsFromSchool?: string;
  accountingNotes?: string;
  tlEmailsAtTimeOfGrant?: string[];
  ein?: string;
  daysSincePrelimAdviceRequest?: any;
  schoolGrantName?: string;
  daysSinceFullAdviceRequest?: any;
  nonprofitStatus?: string;
  currentTls?: string;
  grantKey?: any;
  einAtTimeOfGrant?: string;
  countOfActiveMailingAddressesFromSchool?: number;
  amount?: number;
  automationStepTrigger?: string;
  currentMailingAddressFromSchool?: string;
  nonprofitStatusAtTimeOfGrant?: string;
  currentTlsFirstNames?: string;
  school?: string[];
  textForLedgerEntry?: string;
  label?: string;
  fundingSource?: string;
  adviceWindow1WeekClosed?: any;
  issuedByName?: string;
  logoFromSchool?: string;
  recipientNameFromQbo?: string;
  schoolShortName?: string;
  mailingAddressAtTimeOfGrant?: string;
  unsignedGrantAgreement?: string[];
  billcom?: string;
  fundingHub?: string;
  fullAdviceOpenQuestions?: number;
  qbo?: string;
  prelimAdvicePauses?: number;
  issuedByShortName?: string;
  primaryContactEmailFromSchool?: string[];
}

// Mailing lists table
export interface MailingList extends BaseRecord {
  educatorLog?: string;
  type?: string;
  slug?: string;
  name?: string;
  googleGroupId?: string;
}

// Loan payments table
export interface LoanPayment extends BaseRecord {
  amount?: number;
  paymentDate?: string;
  school?: string[];
  shortName?: string;
  paymentKey?: any;
}

// Loans table
export interface Loan extends BaseRecord {
  schoolId: string;
  loanPaperwork?: string[];
  approximateOutstandingAmount?: number;
  loanid?: any;
  loanContactEmail1?: string;
  loanStatus?: string;
  issueMethod?: string;
  loanKey?: any;
  school?: string[];
  interestRate?: number;
  contactEmailFromEducatorFromEducatorsXSchoolsFromSchool?: string[];
  effectiveIssueDate?: string;
  educatorsXSchools?: string[];
  amountIssued?: number;
  useOfProceeds?: string;
  notes?: string;
  loanContactEmail2?: string;
  maturity?: string;
}

// Educator notes table
export interface EducatorNote extends BaseRecord {
  notes?: string;
  private?: boolean;
  createdBy?: string[];
  partnersCopy?: string[];
  educator?: string[];
  educatornotesid?: any;
  educatorId: string;
  date?: string;
  educatorNoteKey?: any;
  fullNameFromEducator?: string;
}

// Charter authorizers and contacts table
export interface CharterAuthorizerContact extends BaseRecord {
  authorizer?: string;
  charter?: string[];
  title?: string;
  phone?: string;
  email?: string;
  contact?: string;
  currentlyActive?: boolean;
  charterId?: string;
  charterAuthorizerKey?: any;
}

// Assessment data table
export interface AssessmentData extends BaseRecord {
  assessmentDataKey?: any;
  assessment?: string[];
  metOrExceedsFrl?: number;
  numberAssessedEll?: number;
  year?: string[];
  numberAssessedSped?: number;
  school?: string[];
  numberAssessed?: number;
  charterId?: string;
  otherData?: string;
  metOrExceedsBipoc?: number;
  schoolid?: string;
  numberAssessedBipoc?: number;
  metOrExceedsAll?: number;
  assessmentdataid?: any;
  numberAssessedFrl?: number;
  charter?: string[];
  metOrExceedsSped?: number;
  metOrExceedsEll?: number;
}

// Membership termination steps and dates table
export interface MembershipTerminationStepDate extends BaseRecord {
  fieldWithTargetDate?: any;
  stepName?: string;
  dayOfProcess?: number;
  responsiblePersonAtWf?: string;
}

// Educators x Schools table
export interface EducatorSchoolAssociation extends BaseRecord {
  edxschoolKey?: string;
  invitedTo2024Refresher?: boolean;
  whoInitiatedEtlRemoval?: string;
  school?: string[];
  loanFund?: boolean;
  loans?: string[];
  tlGift2022?: boolean;
  gsuiteRoles?: string;
  schoolShortName?: string;
  educator?: string[];
  onNationalWebsite?: string;
  signedTlAcknowledgementCommitmentToMembership?: boolean;
  emailStatus?: string;
  ssjStage?: string;
  educatorId: string;
  firstNameFromEducator?: string;
  charterId?: string;
  educatorFullName?: string;
  startDate?: string;
  educatorsxschoolsid?: any;
  onWildflowerDirectory?: string;
  onTeacherLeaderGoogleGroup?: string;
  montessoriCertifications?: string;
  emailAtSchool?: string;
  roles?: string[];
  stagestatus?: string;
  schoolStatus?: string;
  currentlyActive?: boolean;
  endDate?: string;
}

// Nine nineties table
export interface Ninenineties extends BaseRecord {
  supabaseid?: string;
  aiDerivedRevenue?: number;
  aiDerivedEoyDate?: string;
  nineNinetiesReportingYear?: string;
  schoolId: string;
  charterId?: string;
  notes?: string;
}

// Governance docs table
export interface GovernanceDocument extends BaseRecord {
  documentType?: string;
  govdocid?: any;
  date?: string;
  docKey?: any;
  charterId?: string;
  shortname?: string;
  docNotes?: string;
  docLink?: string;
  publicationLink?: string;
  schoolId?: string;
  urlpdfExtensionFormula?: string;
  school?: string[];
  documentPdf?: string[];
  charter?: string[];
}

// Guides Assignments table
export interface GuideAssignment extends BaseRecord {
  currentlyActive?: boolean;
  guideShortName?: string;
  endDate?: string;
  schoolShortName?: string;
  schoolId: string;
  startDate?: string;
  type?: string;
}

// Training Grants table
export interface TrainingGrant extends BaseRecord {
  stageFromEducators?: string;
  trainingStatus?: string;
  hubNameFromEducators?: string;
  trainingGrantAmount?: number;
  statusFromEducators?: string;
  trainingProgram?: string;
  cohort?: string;
  notes?: string;
  applied?: boolean;
  trainingGrantStatus?: string;
}

// Reports and submissions table
export interface ReportSubmission extends BaseRecord {
  charter?: string[];
  reportsid?: any;
  attachments?: string[];
  schoolYear?: string[];
  reportType?: string;
  charterId?: string;
}

// States Aliases table
export interface StateAlias extends BaseRecord {
  abbreviation?: string;
  state?: string;
}

// Public funding table
export interface PublicFunding extends BaseRecord {
  description?: string;
  schools?: string[];
  name?: string;
  relevantLevels?: string[];
}

// Annual enrollment and demographics table
export interface AnnualEnrollmentDemographic extends BaseRecord {
  annualDataKey?: any;
  school?: string[];
  numberOfEnrolledStudentsFrl?: number;
  numberOfEnrolledStudentsBipoc?: number;
  charter?: string[];
  schoolId?: string;
  numberOfEnrolledStudentsSped?: number;
  numberOfEnrolledStudentsAll?: number;
  numberOfEnrolledStudentsEll?: number;
  schoolYear?: string[];
  annualdataid?: any;
}

// Assessments table
export interface Assessment extends BaseRecord {
  shortName?: string;
  fullName?: string;
  domain?: string;
  annualAssessmentImplementationsBySchool?: string[];
  grades?: string[];
}

// Event types table
export interface EventType extends BaseRecord {
  events?: string[];
  eventCategory?: string;
}

// Email Addresses table
export interface EmailAddress extends BaseRecord {
  emailType?: string;
  active?: boolean;
  emailAddress?: string;
  educatorId: string;
  educator?: string[];
  emailaddressid?: string;
  currentPrimaryEmail?: boolean;
}

// Montessori Certifiers - old list table
export interface MontessoriCertifierOld extends BaseRecord {
  name?: string;
  ssjFilloutFormGetInvolved2?: string;
  ssjFilloutFormGetInvolved?: string;
  ssjFilloutFormGetInvolved4?: string;
  abbreviation?: string;
  ssjFilloutFormGetInvolved3?: string;
}

// Marketing source options table
export interface MarketingSourceOption extends BaseRecord {
  marketingSource?: string;
  educators?: string[];
}

// Montessori Cert Levels table
export interface MontessoriCertLevel extends BaseRecord {
  name?: string;
  educators?: string;
}

// Race and Ethnicity table
export interface RaceAndEthnicity extends BaseRecord {
  ssjFilloutFormGetInvolved?: string;
  name?: string;
}

// Ages-Grades table
export interface AgeGrade extends BaseRecord {
  name?: string;
}

// Montessori Certifiers table
export interface MontessoriCertifier extends BaseRecord {
  abbreviation?: string;
  name?: string;
}

// Table name to type mapping
export const TABLE_TYPE_MAPPING = {
  "Partners copy": "Partner",
  "SSJ Fillout Forms": "SSJFilloutForm",
  "Marketing sources mapping": "MarketingSourceMapping",
  "Charter applications": "CharterApplication",
  "Schools": "School",
  "Educators": "Educator",
  "SSJ Typeforms: Start a School": "SSJTypeform",
  "School notes": "SchoolNote",
  "Membership termination steps": "MembershipTerminationStep",
  "Locations": "Location",
  "Event attendance": "EventAttendance",
  "Lead Routing and Templates": "LeadRoutingTemplate",
  "Cohorts": "Cohort",
  "Events": "Event",
  "Board Service": "BoardService",
  "Supabase join 990 with school": "Supabase990School",
  "Charters": "Charter",
  "QBO School Codes": "QBOSchoolCode",
  "Action steps": "ActionStep",
  "Guides": "Guide",
  "Charter roles": "CharterRole",
  "Montessori Certs": "MontessoriCert",
  "Grants": "Grant",
  "Mailing lists": "MailingList",
  "Loan payments": "LoanPayment",
  "Loans": "Loan",
  "Educator notes": "EducatorNote",
  "Charter authorizers and contacts": "CharterAuthorizerContact",
  "Assessment data": "AssessmentData",
  "Membership termination steps and dates": "MembershipTerminationStepDate",
  "Educators x Schools": "EducatorSchoolAssociation",
  "Nine nineties": "Ninenineties",
  "Governance docs": "GovernanceDocument",
  "Guides Assignments": "GuideAssignment",
  "Training Grants": "TrainingGrant",
  "Reports and submissions": "ReportSubmission",
  "States Aliases": "StateAlias",
  "Public funding": "PublicFunding",
  "Annual enrollment and demographics": "AnnualEnrollmentDemographic",
  "Assessments": "Assessment",
  "Event types": "EventType",
  "Email Addresses": "EmailAddress",
  "Montessori Certifiers - old list": "MontessoriCertifierOld",
  "Marketing source options": "MarketingSourceOption",
  "Montessori Cert Levels": "MontessoriCertLevel",
  "Race and Ethnicity": "RaceAndEthnicity",
  "Ages-Grades": "AgeGrade",
  "Montessori Certifiers": "MontessoriCertifier"
} as const;

// All generated table types
export type AirtableRecord = 
  | Partner
  | SSJFilloutForm
  | MarketingSourceMapping
  | CharterApplication
  | School
  | Educator
  | SSJTypeform
  | SchoolNote
  | MembershipTerminationStep
  | Location
  | EventAttendance
  | LeadRoutingTemplate
  | Cohort
  | Event
  | BoardService
  | Supabase990School
  | Charter
  | QBOSchoolCode
  | ActionStep
  | Guide
  | CharterRole
  | MontessoriCert
  | Grant
  | MailingList
  | LoanPayment
  | Loan
  | EducatorNote
  | CharterAuthorizerContact
  | AssessmentData
  | MembershipTerminationStepDate
  | EducatorSchoolAssociation
  | Ninenineties
  | GovernanceDocument
  | GuideAssignment
  | TrainingGrant
  | ReportSubmission
  | StateAlias
  | PublicFunding
  | AnnualEnrollmentDemographic
  | Assessment
  | EventType
  | EmailAddress
  | MontessoriCertifierOld
  | MarketingSourceOption
  | MontessoriCertLevel
  | RaceAndEthnicity
  | AgeGrade
  | MontessoriCertifier;

