import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";
import { pgTable, serial, text, integer, decimal, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Airtable-based schema for Wildflower Schools
// Charter interface for Charters table
export interface Charter {
  id: string; // Airtable record ID
  shortName?: string;
  fullName?: string;
  initialTargetCommunity?: string;
  projectedOpen?: string;
  initialTargetAges?: string;
  status?: string;
  created?: string;
  lastModified?: string;
}

export interface CharterRole {
  id: string;
  charterId: string;
  role?: string;
  name?: string;
  currentlyActive?: boolean;
  created?: string;
  lastModified?: string;
}

export interface CharterApplication {
  id: string;
  charterId: string;
  applicationName?: string;
  targetOpen?: string;
  status?: string;
  submissionDate?: string;
  created?: string;
  lastModified?: string;
}

export interface CharterAuthorizerContact {
  id: string;
  charterId: string;
  name?: string;
  organization?: string;
  email?: string;
  phone?: string;
  role?: string;
  title?: string;
  currentlyActive?: boolean;
  created?: string;
  lastModified?: string;
}

export interface ReportSubmission {
  id: string;
  charterId: string;
  reportType?: string;
  dueDate?: string;
  submissionDate?: string;
  status?: string;
  schoolYear?: string;
  attachments?: string[];
  created?: string;
  lastModified?: string;
}

export interface AssessmentData {
  id: string;
  charterId: string;
  assessmentType?: string;
  testDate?: string;
  results?: string;
  grade?: string;
  schoolId?: string;
  numberAssessed?: number;
  created?: string;
  lastModified?: string;
}

export interface CharterNote {
  id: string;
  charterId: string;
  headline?: string;
  notes?: string;
  createdBy?: string;
  dateEntered?: string;
  private?: boolean;
  created?: string;
  lastModified?: string;
}

export interface CharterActionStep {
  id: string;
  charterId: string;
  description?: string;
  assignee?: string;
  dueDate?: string;
  status?: string;
  complete?: boolean;
  completedDate?: string;
  created?: string;
  lastModified?: string;
}

export interface CharterGovernanceDocument {
  id: string;
  charterId: string;
  docType?: string;
  doc?: string;
  docUrl?: string;
  dateEntered?: string;
  created?: string;
  lastModified?: string;
}

export interface Charter990 {
  id: string;
  charterId: string;
  year?: string;
  docUrl?: string;
  notes?: string;
  shortName?: string;
  dateEntered?: string;
  created?: string;
  lastModified?: string;
}

export interface Educator {
  id: string; // Airtable record ID
  fullName?: string;
  firstName?: string;
  nickname?: string;
  middleName?: string;
  lastName: string;
  primaryPhone?: string;
  secondaryPhone?: string;
  homeAddress?: string;
  currentPrimaryEmailAddress?: string;

  // Demographics
  pronouns?: string;
  pronounsOther?: string;
  gender?: string;
  genderOther?: string;
  raceEthnicity?: string[];
  raceEthnicityOther?: string;
  lgbtqia?: boolean;
  primaryLanguage?: string[];
  otherLanguages?: string[];
  educationalAttainment?: string;
  householdIncome?: string;
  incomeBackground?: string;
  individualType?: string;
  
  montessoriCertified?: boolean;
  montessoriLeadGuideTrainings?: string[];

  discoveryStatus?: string;
  assignedPartner?: string[];
  assignedPartnerEmail?: string[];
  
  activeSchool?: string[];
  currentRole?: string[];
  activeSchoolStageStatus?: string[];

  
  targetCity?: string;
  targetState?: string;
  targetGeoCombined?: string;
  targetIntl?: string;
  firstContactNotesOnPreWildflowerEmployment?: string;
  firstContactWFSchoolEmploymentStatus?: string;
  firstContactRelocate?: string;
  firstContactGovernance?: string;
  firstContactAges?: string[];
  firstContactInterests?: string;

  // Early Cultivation Data
  source?: string;
  sendgridTemplateSelected?: string;
  sendgridSendDate?: string;
  routedTo?: string;
  assignedPartnerOverride?: string;
  personalEmailSent?: boolean;
  personalEmailSentDate?: string;
  personResponsibleForFollowUp?: string;
  oneOnOneSchedulingStatus?: string;
  
  opsGuideMeetingPrefTime?: string;
  opsGuideSpecificsChecklist?: string[];
  opsGuideReqPertinentInfo?: string[];
  opsGuideSupportTypeNeeded?: string[];
  opsGuideFundraisingOps?: string;
  activeHolaspirit?: boolean;
  holaspiritMemberID?: string;
  tcUserID?: string;
  inactiveFlag?: boolean;
  created?: string;
  lastModified?: string;
  createdBy?: string;
  archived?: boolean;
  // Additional fields surfaced from schema
  assignedPartnerShortName?: string;
  boardService?: string[];
  cohorts?: string[];
  excludeFromEmailLogging?: boolean;
  onSchoolBoard?: boolean;
  pronunciation?: string;
  raceAndEthnicity?: string;
  selfReflection?: string;
  sourceOther?: string;
}

export interface School {
  id: string; // Airtable record ID
  name: string;
  shortName?: string;
  priorNames?: string;
  assignedPartner?: string[];
  charterId?: string;
  logo?: string;
  logoMainSquare?: string;
  logoFlowerOnly?: string;
  logoMainRectangle?: string;
  logoUrl?: string;
  programFocus?: string[];
  schoolCalendar?: string;
  schoolSchedule?: string;
  leftNetworkDate?: string;
  leftNetworkReason?: string;
  membershipStatus?: string;
  founders?: string[];
  foundersFullNames?: string[]; // Derived full names from Founders List
  currentTLs?: string[];
  currentGuides?: string[];
  narrative?: string;
  institutionalPartner?: string;
  about?: string;
  aboutSpanish?: string;
  agesServed?: string[];
  governanceModel?: string;
  status?: string;
  stageStatus?: string;  
  openDate?: string;
  enrollmentCap?: number;
  currentEnrollment?: number;
  numberOfClassrooms?: number;
  publicFundingSources?: string[];
  flexibleTuition?: string;
  activePodMember?: string;

  // Location
  activePhysicalAddress?: string;
  currentPhysicalAddress?: boolean; // Added for Airtable checkbox field
  currentMailingAddress?: boolean; // Added for Airtable checkbox field
  activeLocationCity?: string;
  activeLocationState?: string;
  locality?: string;
  activeLatitude?: number;
  activeLongitude?: number;
  ssjTargetCity?: string;
  ssjTargetState?: string;

  // Contact info
  phone?: string;
  email?: string;
  domain?: string;
  emailDomain?: string;
  domainName?: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  archived?: boolean;


  // Membership
  membershipAgreementDate?: string;
  signedMembershipAgreement?: string;
  agreementVersion?: string;
//  membershipFeeStatus?: string;
//  membershipFeeAmount?: number;
  membershipTerminationLetter?: string;
  primaryContactEmail?: string;

  // Legal entity
  legalStructure?: string;
  EIN?: string;
  legalName?: string;
  incorporationDate?: string;
  currentFYEnd?: string;
  nonprofitStatus?: string;
  groupExemptionStatus?: string;
  dateReceivedGroupExemption?: string;
  dateWithdrawnGroupExemption?: string;
  nondiscriminationOnApplication?: string;
  nondiscriminationOnWebsite?: string;
  onNationalWebsite?: boolean;
  tcSchoolId?: string;
  // ssjTool?: string;
  createdBy?: string;
  


  // SSJ/OSS Data
  ssjStage?: string;
  ssjOriginalProjectedOpenDate?: string;
  ssjProjOpenSchoolYear?: string;
  ssjProjectedOpen?: string;

  enteredVisioningDate?: string;
  enteredPlanningDate?: string;
  enteredStartupDate?: string;
  
  ssjFacility?: string;
  ssjB4GStatus?: string;
  ssjDateSharedWithN4G?: string;
  building4GoodFirm?: string;
  ssjHasETLPartner?: string;
  ssjOpsGuideTrack?: string[];
  ssjReadinessRating?: string;
  ssjFundingGap?: string;
  ssjAmountRaised?: string;
  ssjLoanApprovedAmount?: string;
  ssjLoanEligibility?: string;
  ssjViableFundingPath?: string;
  ssjTotalStartupFundingReq?: string;
  ssjFundraisingNarrative?: string;
  ssjPlanningForWFFunding?: string;

  ssjBudgetReady?: string;
  ssjEnrollmentOnTrack?: string;
  ssjCohortStatus?: string;
  ssjBoardDevelopment?: string;
  ssjNameReserved?: string;
  ssjNextBigDecision?: string;
  
  planningAlbum?: string;
  visioningAlbum?: string;
  visioningAlbumComplete?: boolean;
  cohorts?: string[];

  riskFactors?: string[];
  watchlist?: string[];
  errors?: string[];
  
  // Systems
  googleVoice?: string;
  budgetUtility?: string;
  admissionsSystem?: string;
  qbo?: string;
  websiteTool?: string;
  logoDesigner?: string;
  transparentClassroom?: string;
  tcAdmissions?: string;
  tcRecordkeeping?: string;
  gusto?: string;
  businessInsurance?: string;
  nameSelectionProposal?: string;
  trademarkFiled?: string;
  billComAccount?: string;
  googleWorkspacePath?: string;
  budgetLink?: string;
  bookkeeper?: string;
  selfReflection?: string;
  inactiveFlag?: string;

  lastModified?: string;
  createdTime?: string;
}

export interface EducatorSchoolAssociation {
  id: string;
  educatorId: string;
  schoolId: string;
  schoolShortName?: string;
  educatorName?: string;
  role?: string[];
  status?: string;
  stageStatus?: string;
  startDate?: string;
  endDate?: string;
  emailAtSchool?: string;
  isActive?: boolean;
  created?: string;
  lastModified?: string;
}

export interface Location {
  id: string; // Airtable record ID
  schoolId: string;
  charterId?: string;
  address?: string;
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  neighborhood?: string;
  sqFt?: number;
  maxOccupancy?: number;
  latitude?: number;
  longitude?: number;
  currentPhysicalAddress?: boolean;
  currentMailingAddress?: boolean;
  locationType?: string;
  startDate?: string;
  endDate?: string;
  coLocationType?: string;
  coLocationPartner?: string;
  censusTract?: string;
  qualLICT?: boolean;
  leaseEndDate?: string;
  lease?: string;
  timeZone?: string;
  created?: string;
  lastModified?: string;
}

export interface GuideAssignment {
  id: string; // Airtable record ID
  schoolId: string;
  guideId: string;
  guideShortName?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
  created?: string;
  lastModified?: string;
}

export interface GovernanceDocument {
  id: string; // Airtable record ID
  schoolId: string;
  charterId: string;
  docType?: string;
  doc?: string;
  docUrl?: string;
  docNote?: string;
  dateEntered?: string;
  created?: string;
  lastModified?: string;
}

export interface SchoolNote {
  id: string; // Airtable record ID
  schoolId: string;
  dateCreated?: string;
  createdBy?: string;
  notes?: string;
}

export interface EducatorNote {
  id: string; // Airtable record ID
  educatorId: string;
  dateCreated?: string;
  createdBy?: string;
  notes?: string;
  isPrivate?: boolean;
}

export interface Grant {
  id: string; // Airtable record ID
  schoolId: string;
  amount?: number;
  issuedDate?: string;
  issuedByShortName?: string;
  status?: string;
  timeOfGrantLegalName?: string;
  timeOfGrantTLs?: string;
  timeOfGrantAddress?: string;
  timeOfGrantEIN?: string;
  timeOfGrantNonprofitStatus?: string;
  timeOfGrantMembershipStatus?: string;
  timeOfGrant501c3Proof?: string;
  fundingSource?: string;
  grantPurpose?: string;
  grantPeriod?: string;
  accountingNotes?: string;
  textLedgerEntry?: string;
  automationStep?: string;
  prelimAdviceRequestTime?: string;
  fullAdviceRequestTime?: string;
  unsignedGrantAgreement?: string;
  signedGrantAgreement?: string;
  created?: string;
  lastModified?: string;
}

export interface Loan {
  id: string; // Airtable record ID
  schoolId: string;
  amount?: number;
  status?: string;
  interestRate?: number;
  maturityDate?: string;
  approxOutstanding?: number;
  notes?: string;
  paperwork?: string;
  created?: string;
  lastModified?: string;
}

export interface EmailAddress {
  id: string; // Airtable record ID
  educatorId?: string;
  email?: string;
  type?: string;
  isPrimary?: boolean;
  isActive?: boolean;
}


// SSJ Fillout Forms
export interface SSJFilloutForm {
  id: string; // Airtable record ID
  educatorId?: string;
  formVersion?: string;
  dateSubmitted?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
  raceEthnicity?: string;
  raceEthnicityOther?: string;
  lgbtqia?: boolean;
  pronouns?: string;
  pronounsOther?: string;
  gender?: string;
  genderStandardized?: string;
  genderOther?: string;
  hhIncome?: string;
  primaryLanguage?: string;
  primaryLanguageOther?: string;
  message?: string;
  isInterestedinCharter?: boolean;
  contactType?: string;
  contactTypeStandardized?: string;
  montessoriCertQuestion?: string;
  certProcessingStatus?: string;
  isMontessoriCertified?: boolean;
  isSeekingMontessoriCertification?: boolean;
  temp1Cert?: string;
  temp2Cert?: string;
  temp3Cert?: string;
  temp4Cert?: string;
  temp1Level?: string;
  temp2Level?: string;
  temp3Level?: string;
  temp4Level?: string;
  temp1Year?: string;
  temp2Year?: string;
  temp3Year?: string;
  temp4Year?: string;
  montCert1Cert?: string;
  montCert2Cert?: string;
  montCert3Cert?: string;
  montCert4Cert?: string;
  montCert1Level?: string;
  montCert2Level?: string;
  montCert3Level?: string;
  montCert4Level?: string;
  montCert1Year?: string;
  montCert2Year?: string;
  montCert3Year?: string;
  montCert4Year?: string;
  city?: string;
  cityStandardized?: string;
  state?: string;
  stateStandardized?: string;
  country?: string;
  city2?: string;
  state2?: string;
  country2?: string;
  targetGeo?: string;
  initialEdInterestsAge?: string;
  initialEdInterestsEducators?: string;
  initialEdInterestsEducatorsOther?: string;
  commMemInterests?: string;
  commMemInterestsOther?: string;
  commMemSupportFindingTeachers?: boolean;
  commMemCommunityInfo?: string;
  commMemSelfInfo?: string;
  receiveComms?: boolean;
  source?: string;
  sourceOther?: string;
  mktgSource?: string;
  mktgSourceCampaign?: string;
  initialEdInterestCharter?: boolean;
  assignedPartner?: string;
  sendGridTemplateId?: string;
  sendGridSentDate?: string;
  routedTo?: string;
  assignedPartnerOverride?: string;
  emailSentByInitOutreacher?: boolean;
  oneOnOneStatus?: string;
  initialOutreacher?: string;
  personResponsibleForFollowUp?: string;
  sourceForNonTLs?: string;
}

// Montessori Certifications
export interface MontessoriCertification {
  id: string; // Airtable record ID
  educatorId?: string;
  certificationLevel?: string;
  certificationStatus?: string;
  certificationLevels?: string[];
  certifier?: string;
  certifierOther?: string;
  yearReceived?: string;
  created?: string;
  lastModified?: string;
}

// Event Attendance
export interface EventAttendance {
  id: string; // Airtable record ID
  educatorId?: string;
  eventName?: string;
  eventDate?: string;
  attended?: boolean;
  registered?: boolean;
  registrationDate?: string;
}


// Zod schemas for validation
export const educatorSchema = z.object({
  fullName: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  middleName: z.string().optional(),
  nickname: z.string().optional(),
  primaryPhone: z.string().optional(),
  secondaryPhone: z.string().optional(),
  homeAddress: z.string().optional(),
  pronouns: z.string().optional(),
  pronounsOther: z.string().optional(),
  gender: z.string().optional(),
  genderOther: z.string().optional(),
  raceEthnicity: z.array(z.string()).optional(),
  raceEthnicityOther: z.string().optional(),
  primaryLanguage: z.array(z.string()).optional(),
  otherLanguages: z.array(z.string()).optional(),
  educationalAttainment: z.string().optional(),
  montessoriCertified: z.boolean().optional(),
  certificationLevels: z.array(z.string()).optional(),
  certifier: z.array(z.string()).optional(),
  montessoriLeadGuideTrainings: z.array(z.string()).optional(),
  currentRole: z.array(z.string()).optional(),
  discoveryStatus: z.string().optional(),
  assignedPartner: z.array(z.string()).optional(),
  assignedPartnerEmail: z.array(z.string()).optional(),
  householdIncome: z.string().optional(),
  incomeBackground: z.string().optional(),
  individualType: z.string().optional(),
  targetCity: z.string().optional(),
  firstContactWFSchoolEmploymentStatus: z.string().optional(),
  firstContactNotesOnPreWildflowerEmployment: z.string().optional(),
  firstContactInitialInterestInGovernanceModel: z.array(z.string()).optional(),
  // Early Cultivation Data
  source: z.string().optional(),
  sendgridTemplateSelected: z.string().optional(),
  sendgridSendDate: z.string().optional(),
  routedTo: z.string().optional(),
  assignedPartnerOverride: z.string().optional(),
  personalEmailSent: z.boolean().optional(),
  personalEmailSentDate: z.string().optional(),
  personResponsibleForFollowUp: z.string().optional(),
  oneOnOneSchedulingStatus: z.string().optional(),
  activeHolaspirit: z.boolean().optional(),
  holaspiritMemberID: z.string().optional(),
  tcUserID: z.string().optional(),
  alsoAPartner: z.boolean().optional(),
  onSchoolBoard: z.string().optional(),
  everATLInAnOpenSchool: z.boolean().optional(),
  archived: z.boolean().optional(),
});

export const schoolSchema = z.object({
  name: z.string().min(1, "School name is required"),
  shortName: z.string().optional(),
  priorNames: z.string().optional(),
  logo: z.string().optional(),
  logoMainSquare: z.string().optional(),
  logoFlowerOnly: z.string().optional(),
  logoMainRectangle: z.string().optional(),
  logoUrl: z.string().optional(),
  currentPhysicalAddress: z.boolean().optional(),
  currentMailingAddress: z.boolean().optional(),
  activeLocationCity: z.string().optional(),
  activeLocationState: z.string().optional(),
  targetCity: z.string().optional(),
  targetState: z.string().optional(),
  locality: z.string().optional(),
  targetCommunity: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  website: z.string().optional().or(z.literal("")),
  domain: z.string().optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  archived: z.boolean().optional(),
  narrative: z.string().optional(),
  institutionalPartner: z.string().optional(),
  opened: z.string().optional(),
  membershipStatus: z.string().optional(),
  founders: z.array(z.string()).optional(),
  membershipAgreementDate: z.string().optional(),
  signedMembershipAgreement: z.string().optional(),
  agreementVersion: z.string().optional(),
  about: z.string().optional(),
  aboutSpanish: z.string().optional(),
  agesServed: z.array(z.string()).optional(),
  programFocus: z.array(z.string()).optional(),
  schoolCalendar: z.string().optional(),
  schoolSchedule: z.string().optional(),
  flexibleTuition: z.string().optional(),
  schoolType: z.string().optional(),
  governanceModel: z.string().optional(),
  status: z.string().optional(),
  stageStatus: z.string().optional(),
  openDate: z.string().optional(),
  enrollmentCap: z.number().optional(),
  currentEnrollment: z.number().optional(),
  membershipFeeStatus: z.string().optional(),
  membershipFeeAmount: z.number().optional(),
  membershipTerminationLetter: z.string().optional(),
  publicFunding: z.boolean().optional(),
  charterStatus: z.string().optional(),
  authorizer: z.string().optional(),
  demographics: z.any().optional(),
  assessmentData: z.any().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  timezone: z.string().optional(),
  currentTLs: z.union([z.string(), z.number()]).optional(),
  currentGuides: z.array(z.string()).optional(),

  numberOfClassrooms: z.number().optional(),
  leftNetworkDate: z.string().optional(),
  leftNetworkReason: z.string().optional(),
  publicFundingSources: z.array(z.string()).optional(),
  activePhysicalAddress: z.string().optional(),
  activeLatitude: z.number().optional(),
  activeLongitude: z.number().optional(),
  // SSJ/OSS Data
  ssjStage: z.string().optional(),
  ssjTool: z.string().optional(),
  ssjTargetCity: z.string().optional(),
  ssjTargetState: z.string().optional(),
  ssjOriginalProjectedOpenDate: z.string().optional(),
  ssjProjOpenSchoolYear: z.string().optional(),
  ssjProjectedOpen: z.string().optional(),
  riskFactors: z.array(z.string()).optional(),
  watchlist: z.array(z.string()).optional(),
  errors: z.array(z.string()).optional(),
  activeAssignedPartnerEmail: z.string().optional(),
  activeAssignedPartnerOverride: z.string().optional(),
  activeAssignedPartnerShortName: z.string().optional(),
  groupExemptionStatus: z.string().optional(),
  dateReceivedGroupExemption: z.string().optional(),
  dateWithdrawnGroupExemption: z.string().optional(),
  legalStructure: z.string().optional(),
  EIN: z.string().optional(),
  legalName: z.string().optional(),
  incorporationDate: z.string().optional(),
  currentFYEnd: z.string().optional(),
  nonprofitStatus: z.string().optional(),
  ssjBoardDevelopment: z.string().optional(),
  enteredVisioningDate: z.string().optional(),
  enteredPlanningDate: z.string().optional(),
  enteredStartupDate: z.string().optional(),
  ssjHasETLPartner: z.string().optional(),
  ssjOpsGuideTrack: z.array(z.string()).optional(),
  ssjReadinessRating: z.string().optional(),
  ssjFacility: z.string().optional(),
  ssjB4GStatus: z.string().optional(),
  ssjDateSharedWithN4G: z.string().optional(),
  building4GoodFirm: z.string().optional(),
  ssjFundingGap: z.string().optional(),
  ssjAmountRaised: z.string().optional(),
  ssjLoanApprovedAmount: z.string().optional(),
  ssjLoanEligibility: z.string().optional(),
  ssjViableFundingPath: z.string().optional(),
  ssjTotalStartupFundingReq: z.string().optional(),
  ssjTotalStartupFunding: z.string().optional(),
  ssjFundraisingNarrative: z.string().optional(),
  ssjPlanningForWFFunding: z.string().optional(),
  ssjBudgetReady: z.string().optional(),
  ssjEnrollmentOnTrack: z.string().optional(),
  ssjCohortStatus: z.string().optional(),
  ssjNameReserved: z.string().optional(),
  ssjNextBigDecision: z.string().optional(),
  planningAlbum: z.string().optional(),
  visioningAlbum: z.string().optional(),
  visioningAlbumComplete: z.boolean().optional(),
  activePodMember: z.string().optional(),
  cohorts: z.array(z.string()).optional(),
  // Systems
  googleVoice: z.string().optional(),
  budgetUtility: z.string().optional(),
  admissionsSystem: z.string().optional(),
  qbo: z.string().optional(),
  websiteTool: z.string().optional(),
  logoDesigner: z.string().optional(),
  transparentClassroom: z.string().optional(),
  tcAdmissions: z.string().optional(),
  tcRecordkeeping: z.string().optional(),
  gusto: z.string().optional(),
  businessInsurance: z.string().optional(),
  nameSelectionProposal: z.string().optional(),
  trademarkFiled: z.string().optional(),
  billComAccount: z.string().optional(),
  googleWorkspacePath: z.string().optional(),
  budgetLink: z.string().optional(),
  bookkeeper: z.string().optional(),
  selfReflection: z.string().optional(),
  firstContactRelocate: z.string().optional(),
  firstContactGovernance: z.string().optional(),
  firstContactPreWFEmployment: z.string().optional(),
  firstContactWFSchoolEmployee: z.string().optional(),
  firstContactAges: z.array(z.string()).optional(),
  firstContactInterests: z.string().optional(),
  opsGuideMeetingPrefTime: z.string().optional(),
  opsGuideSpecificsChecklist: z.array(z.string()).optional(),
  opsGuideReqPertinentInfo: z.array(z.string()).optional(),
  opsGuideSupportTypeNeeded: z.array(z.string()).optional(),
  opsGuideFundraisingOps: z.string().optional(),
  inactiveFlag: z.string().optional(),
  createdTime: z.string().optional(),
  lastModified: z.string().optional(),
});

export const educatorSchoolAssociationSchema = z.object({
  educatorId: z.string().min(1, "Educator ID is required"),
  schoolId: z.string().min(1, "School ID is required"),
  schoolShortName: z.string().optional(),
  role: z.array(z.string()).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  emailAtSchool: z.string().optional(),
  isPrimary: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export const locationSchema = z.object({
  schoolId: z.string().optional(),
  charterId: z.string().optional(),
  address: z.string().optional(),
  currentPhysicalAddress: z.boolean().optional(),
  currentMailingAddress: z.boolean().optional(),
  locationType: z.string().optional(),
  colocationType: z.string().optional(),
  colocationPartner: z.string().optional(),
  neighborhood: z.string().optional(),
  sqFeet: z.number().optional(),
  maxStudents: z.number().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  leaseEndDate: z.string().optional(),
  lease: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  censusTract: z.string().optional(),
  qualLICT: z.boolean().optional(),
});

export const guideAssignmentSchema = z.object({
  schoolId: z.string().min(1, "School ID is required"),
  guideId: z.string().min(1, "Guide ID is required"),
  guideShortName: z.string().optional(),
  type: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const governanceDocumentSchema = z.object({
  schoolId: z.string().optional(),
  charterId: z.string().optional(),
  docType: z.string().optional(),
  doc: z.string().optional(),
  dateEntered: z.string().optional(),
});

export const schoolNoteSchema = z.object({
  schoolId: z.string().min(1, "School ID is required"),
  dateCreated: z.string().optional(),
  createdBy: z.string().optional(),
  notes: z.string().optional(),
});

export const grantSchema = z.object({
  schoolId: z.string().min(1, "School ID is required"),
  amount: z.number().optional(),
  issuedDate: z.string().optional(),
  issuedBy: z.string().optional(),
  status: z.string().optional(),
});

export const loanSchema = z.object({
  schoolId: z.string().min(1, "School ID is required"),
  amount: z.number().optional(),
  status: z.string().optional(),
  interestRate: z.number().optional(),
});

/*
export const membershipFeeByYearSchema = z.object({
  schoolId: z.string().min(1, "School ID is required"),
  schoolYear: z.string().min(1, "School year is required"),
  feeAmount: z.number().optional(),
  status: z.string().optional(),
  dueDate: z.string().optional(),
  datePaid: z.string().optional(),
  paymentMethod: z.string().optional(),
  notes: z.string().optional(),
});

export const membershipFeeUpdateSchema = z.object({
  schoolId: z.string().min(1, "School ID is required"),
  schoolYear: z.string().optional(),
  updateDate: z.string().optional(),
  updatedBy: z.string().optional(),
  updateType: z.string().optional(),
  previousValue: z.string().optional(),
  newValue: z.string().optional(),
  notes: z.string().optional(),
});
*/

export const emailAddressSchema = z.object({
  educatorId: z.string().optional(),
  email: z.string().email("Invalid email format").optional(),
  type: z.string().optional(),
  isPrimary: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

/* 
export interface MembershipFeeByYear {
  id: string;
  schoolId: string;
  schoolYear: string;
  feeAmount?: number;
  status?: string;
  dueDate?: string;
  datePaid?: string;
  paymentMethod?: string;
  notes?: string;
  likelihoodOfPaying?: number;
}

export interface MembershipFeeUpdate {
  id: string;
  schoolId: string;
  schoolYear?: string;
  updateDate?: string;
  updatedBy?: string;
  updateType?: string;
  previousValue?: string;
  newValue?: string;
  notes?: string;
  attachment?: string;
}
*/

export const ssjFilloutFormSchema = z.object({
  educatorId: z.string().optional(),
  formVersion: z.string().optional(),
  dateSubmitted: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  fullName: z.string().optional(),
  email: z.string().optional(),
  raceEthnicity: z.string().optional(),
  raceEthnicityOther: z.string().optional(),
  lgbtqia: z.boolean().optional(),
  pronouns: z.string().optional(),
  pronounsOther: z.string().optional(),
  gender: z.string().optional(),
  genderStandardized: z.string().optional(),
  genderOther: z.string().optional(),
  hhIncome: z.string().optional(),
  primaryLanguage: z.string().optional(),
  primaryLanguageOther: z.string().optional(),
  message: z.string().optional(),
  isInterestedinCharter: z.boolean().optional(),
  contactType: z.string().optional(),
  contactTypeStandardized: z.string().optional(),
  montessoriCertQuestion: z.string().optional(),
  certProcessingStatus: z.string().optional(),
  isMontessoriCertified: z.boolean().optional(),
  isSeekingMontessoriCertification: z.boolean().optional(),
  temp1Cert: z.string().optional(),
  temp2Cert: z.string().optional(),
  temp3Cert: z.string().optional(),
  temp4Cert: z.string().optional(),
  temp1Level: z.string().optional(),
  temp2Level: z.string().optional(),
  temp3Level: z.string().optional(),
  temp4Level: z.string().optional(),
  temp1Year: z.string().optional(),
  temp2Year: z.string().optional(),
  temp3Year: z.string().optional(),
  temp4Year: z.string().optional(),
  montCert1Cert: z.string().optional(),
  montCert2Cert: z.string().optional(),
  montCert3Cert: z.string().optional(),
  montCert4Cert: z.string().optional(),
  montCert1Level: z.string().optional(),
  montCert2Level: z.string().optional(),
  montCert3Level: z.string().optional(),
  montCert4Level: z.string().optional(),
  montCert1Year: z.string().optional(),
  montCert2Year: z.string().optional(),
  montCert3Year: z.string().optional(),
  montCert4Year: z.string().optional(),
  city: z.string().optional(),
  cityStandardized: z.string().optional(),
  state: z.string().optional(),
  stateStandardized: z.string().optional(),
  country: z.string().optional(),
  city2: z.string().optional(),
  state2: z.string().optional(),
  country2: z.string().optional(),
  targetGeo: z.string().optional(),
  initialEdInterestsAge: z.string().optional(),
  initialEdInterestsEducators: z.string().optional(),
  initialEdInterestsEducatorsOther: z.string().optional(),
  commMemInterests: z.string().optional(),
  commMemInterestsOther: z.string().optional(),
  commMemSupportFindingTeachers: z.boolean().optional(),
  commMemCommunityInfo: z.string().optional(),
  commMemSelfInfo: z.string().optional(),
  receiveComms: z.boolean().optional(),
  source: z.string().optional(),
  sourceOther: z.string().optional(),
  mktgSource: z.string().optional(),
  mktgSourceCampaign: z.string().optional(),
  initialEdInterestCharter: z.boolean().optional(),
  assignedPartner: z.string().optional(),
  sendGridTemplateId: z.string().optional(),
  sendGridSentDate: z.string().optional(),
  routedTo: z.string().optional(),
  assignedPartnerOverride: z.string().optional(),
  emailSentByInitOutreacher: z.boolean().optional(),
  oneOnOneStatus: z.string().optional(),
  initialOutreacher: z.string().optional(),
  personResponsibleForFollowUp: z.string().optional(),
  sourceForNonTLs: z.string().optional(),
});

export const montessoriCertificationSchema = z.object({
  educatorId: z.string().optional(),
  certificationLevel: z.string().optional(),
  certificationStatus: z.string().optional(),
  certifier: z.string().optional(),
  yearReceived: z.string().optional(),
});

export const eventAttendanceSchema = z.object({
  educatorId: z.string().optional(),
  eventName: z.string().optional(),
  eventDate: z.string().optional(),
  attended: z.boolean().optional(),
  registered: z.boolean().optional(),
  registrationDate: z.string().optional(),
});

export const educatorNoteSchema = z.object({
  educatorId: z.string().optional(),
  dateCreated: z.string().optional(),
  createdBy: z.string().optional(),
  notes: z.string().optional(),
  isPrivate: z.boolean().optional(),
});


export type InsertEducator = z.infer<typeof educatorSchema>;
export type InsertSchool = z.infer<typeof schoolSchema>;
export type InsertEducatorSchoolAssociation = z.infer<typeof educatorSchoolAssociationSchema>;
export type InsertLocation = z.infer<typeof locationSchema>;
export type InsertGuideAssignment = z.infer<typeof guideAssignmentSchema>;
export type InsertGovernanceDocument = z.infer<typeof governanceDocumentSchema>;
export type InsertSchoolNote = z.infer<typeof schoolNoteSchema>;

// Action Step Schema
export const actionStepSchema = z.object({
  schoolId: z.string(),
  assignedDate: z.string().optional(),
  assignee: z.string().optional(),
  item: z.string().optional(),
  status: z.string().optional(),
  dueDate: z.string().optional(),
  isCompleted: z.boolean().optional(),
});

export const tax990Schema = z.object({
  schoolId: z.string(),
  year: z.string().optional(),
  attachment: z.string().optional(),
  attachmentUrl: z.string().optional(),
});

export type InsertActionStep = z.infer<typeof actionStepSchema>;
export type InsertTax990 = z.infer<typeof tax990Schema>;
export type InsertGrant = z.infer<typeof grantSchema>;
export type InsertLoan = z.infer<typeof loanSchema>;
//export type InsertMembershipFeeByYear = z.infer<typeof membershipFeeByYearSchema>;
//export type InsertMembershipFeeUpdate = z.infer<typeof membershipFeeUpdateSchema>;
export type InsertEmailAddress = z.infer<typeof emailAddressSchema>;
export type InsertSSJFilloutForm = z.infer<typeof ssjFilloutFormSchema>;
export type InsertMontessoriCertification = z.infer<typeof montessoriCertificationSchema>;
export type InsertEventAttendance = z.infer<typeof eventAttendanceSchema>;
export type InsertEducatorNote = z.infer<typeof educatorNoteSchema>;

// Legacy types for backward compatibility
export type Teacher = Educator;
export type InsertTeacher = InsertEducator;
export type TeacherSchoolAssociation = EducatorSchoolAssociation;
export type InsertTeacherSchoolAssociation = InsertEducatorSchoolAssociation;
export type ActionStep = CharterActionStep;
export type Tax990 = Charter990;

// Legacy schemas for backward compatibility
export const insertTeacherSchema = educatorSchema;
export const insertSchoolSchema = schoolSchema;
export const insertTeacherSchoolAssociationSchema = educatorSchoolAssociationSchema;

// Re-export loan schema items to maintain import compatibility
export {
  // tables
  borrowers,
  loanApplications,
  loans,
  loanPayments,
  loanDocuments,
  loanCovenants,
  loanCommitteeReviews,
  capitalSources,
  quarterlyReports,
  reportSchedules,
  quarterlyReportReminders,
  promissoryNoteTemplates,
  templateFields,
  generatedDocuments,
  // types
  type InsertBorrower,
  type Borrower,
  type InsertLoanApplication,
  type LoanApplication,
  type InsertLoan,
  type Loan,
  type InsertLoanPayment,
  type LoanPayment,
  type InsertLoanDocument,
  type LoanDocument,
  type InsertLoanCovenant,
  type LoanCovenant,
  type InsertLoanCommitteeReview,
  type LoanCommitteeReview,
  type InsertCapitalSource,
  type CapitalSource,
  type InsertQuarterlyReport,
  type QuarterlyReport,
  type InsertReportSchedule,
  type ReportSchedule,
  type InsertQuarterlyReportReminder,
  type QuarterlyReportReminder,
  type InsertPromissoryNoteTemplate,
  type PromissoryNoteTemplate,
  type InsertTemplateField,
  type TemplateField,
  type InsertGeneratedDocument,
  type GeneratedDocument,
} from "./loan-schema";

// Backward-compatible aliases
export type InsertLoanRecord = import("./loan-schema").InsertLoan;
export type LoanRecord = import("./loan-schema").Loan;
