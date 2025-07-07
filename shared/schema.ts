import { z } from "zod";

// Airtable-based schema for Wildflower Schools
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
}

export interface School {
  id: string; // Airtable record ID
  name: string;
  shortName?: string;
  priorNames?: string;
  logo?: string;
  logoMainSquare?: string;
  logoFlowerOnly?: string;
  logoMainRectangle?: string;
  logoUrl?: string;
  programFocus?: string;
  schoolCalendar?: string;
  schoolSchedule?: string;
  leftNetworkDate?: string;
  leftNetworkReason?: string;
  membershipStatus?: string;
  founders?: string[];
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
  numberOfClassrooms?: string;
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
  website?: string;
  instagram?: string;
  facebook?: string;


  // Membership
  membershipAgreementDate?: string;
  signedMembershipAgreement?: string;
  agreementVersion?: string;
  membershipFeeStatus?: string;
  membershipFeeAmount?: number;
  membershipTerminationLetter?: string;

  // Legal entity
  legalStructure?: string;
  EIN?: string;
  legalName?: string;
  incorporationDate?: string;
  currentFYEnd?: string;
  nonprofitStatus?: string;
  groupExemptionStatus?: string;
  groupExemptionDateGranted?: string;
  groupExemptionDateWithdrawn?: string;
  dateReceivedGroupExemption?: string;
  dateWithdrawnGroupExemption?: string;
  


  // SSJ/OSS Data
  ssjStage?: string;
  ssjTool?: string;
  ssjOriginalProjectedOpenDate?: string;
  ssjProjOpenSchoolYear?: string;
  ssjProjectedOpen?: string;

  enteredVisioningDate?: string;
  enteredPlanningDate?: string;
  enteredStartupDate?: string;
  ssjHasETLPartner?: string;
  ssjOpsGuideTrack?: string[];
  ssjReadinessRating?: string;
  
  ssjFacility?: string;
  ssjB4GStatus?: string;
  ssjDateSharedWithN4G?: string;
  building4GoodFirm?: string;

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
  activeAssignedPartnerEmail?: string;
  activeAssignedPartnerOverride?: string;
  activeAssignedPartnerShortName?: string;
  
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
  role?: string[];
  status?: string;
  stageStatus?: string;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
  created?: string;
  lastModified?: string;
}

export interface Location {
  id: string; // Airtable record ID
  schoolId: string;
  address?: string;
  currentPhysicalAddress?: boolean;
  currentMailingAddress?: boolean;
  locationType?: string;
  startDate?: string;
  endDate?: string;
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
  docType?: string;
  doc?: string;
  docUrl?: string;
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
  headline?: string;
  lastModified?: string;
}

export interface EducatorNote {
  id: string; // Airtable record ID
  educatorId: string;
  dateCreated?: string;
  createdBy?: string;
  notes?: string;
  category?: string;
  priority?: string;
  created?: string;
  lastModified?: string;
}

// Note: MontessoriCertification and EventAttendance interfaces are defined later in the file to avoid duplicates

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
  status?: string;
  notes?: string;
  created?: string;
  lastModified?: string;
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
});

export const schoolSchema = z.object({
  name: z.string().min(1, "School name is required"),
  shortName: z.string().optional(),
  priorNames: z.string().optional(),
  logo: z.string().optional(),
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
  website: z.string().url("Invalid URL format").optional().or(z.literal("")),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
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
  schoolType: z.string().optional(),
  governanceModel: z.string().optional(),
  status: z.string().optional(),
  stageStatus: z.string().optional(),
  openDate: z.string().optional(),
  enrollmentCap: z.number().optional(),
  currentEnrollment: z.number().optional(),
  membershipFeeStatus: z.string().optional(),
  membershipFeeAmount: z.number().optional(),
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
  programFocus: z.string().optional(),
  numberOfClassrooms: z.string().optional(),
  leftNetworkDate: z.string().optional(),
  leftNetworkReason: z.string().optional(),
  publicFundingSources: z.array(z.string()).optional(),
  activePhysicalAddress: z.string().optional(),
  activeLatitude: z.number().optional(),
  activeLongitude: z.number().optional(),
  // SSJ/OSS Data
  ssjStage: z.string().optional(),
  ssjTargetCity: z.string().optional(),
  ssjTargetState: z.string().optional(),
  ssjOriginalProjectedOpenDate: z.string().optional(),
  ssjProjOpenSchoolYear: z.string().optional(),
  ssjProjectedOpen: z.string().optional(),
  riskFactors: z.array(z.string()).optional(),
  watchlist: z.array(z.string()).optional(),
  errors: z.array(z.string()).optional(),
  groupExemptionStatus: z.string().optional(),
  groupExemptionDateGranted: z.string().optional(),
  groupExemptionDateWithdrawn: z.string().optional(),
  ssjBoardDevelopment: z.string().optional(),
  enteredVisioningDate: z.string().optional(),
  enteredPlanningDate: z.string().optional(),
  enteredStartupDate: z.string().optional(),
  ssjHasETLPartner: z.string().optional(),
  ssjOpsGuideTrack: z.array(z.string()).optional(),
  ssjReadinessRating: z.string().optional(),
  ssjFacility: z.string().optional(),
  building4GoodFirm: z.string().optional(),
  ssjTotalStartupFunding: z.string().optional(),
  ssjFundraisingNarrative: z.string().optional(),
  planningAlbum: z.string().optional(),
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
});

export const educatorSchoolAssociationSchema = z.object({
  educatorId: z.string().min(1, "Educator ID is required"),
  schoolId: z.string().min(1, "School ID is required"),
  schoolShortName: z.string().optional(),
  role: z.string().optional(),
  status: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  isPrimary: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export const locationSchema = z.object({
  schoolId: z.string().min(1, "School ID is required"),
  address: z.string().optional(),
  currentPhysicalAddress: z.boolean().optional(),
  currentMailingAddress: z.boolean().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
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
  schoolId: z.string().min(1, "School ID is required"),
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

export const emailAddressSchema = z.object({
  educatorId: z.string().optional(),
  email: z.string().email("Invalid email format").optional(),
  type: z.string().optional(),
  isPrimary: z.boolean().optional(),
  status: z.string().optional(),
  notes: z.string().optional(),
});

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

// SSJ Fillout Forms
export interface SSJFilloutForm {
  id: string; // Airtable record ID
  educatorId?: string;
  formName?: string;
  formType?: string;
  dateSubmitted?: string;
  status?: string;
  submissionId?: string;
  responseData?: any;
  notes?: string;
  created?: string;
  lastModified?: string;
}

// Montessori Certifications
export interface MontessoriCertification {
  id: string; // Airtable record ID
  educatorId?: string;
  certificationLevel?: string;
  certificationStatus?: string;
  certifier?: string;
  trainingProgram?: string;
  dateReceived?: string;
  expirationDate?: string;
  certificationNumber?: string;
  notes?: string;
  created?: string;
  lastModified?: string;
}

// Event Attendance
export interface EventAttendance {
  id: string; // Airtable record ID
  educatorId?: string;
  eventName?: string;
  eventType?: string;
  eventDate?: string;
  attendanceStatus?: string;
  registrationDate?: string;
  completionStatus?: string;
  certificateIssued?: boolean;
  notes?: string;
  created?: string;
  lastModified?: string;
}

// Grant interface
export interface Grant {
  id: string; // Airtable record ID
  schoolId: string;
  amount?: number;
  issuedDate?: string;
  issuedBy?: string;
  status?: string;
}

// Loan interface
export interface Loan {
  id: string; // Airtable record ID
  schoolId: string;
  amount?: number;
  status?: string;
  interestRate?: number;
}

// School Note interface
export interface SchoolNote {
  id: string; // Airtable record ID
  schoolId: string;
  dateCreated?: string;
  createdBy?: string;
  notes?: string;
  isPrivate?: boolean;
}

// Action Step interface
export interface ActionStep {
  id: string; // Airtable record ID
  schoolId: string;
  assignedDate?: string;
  assignee?: string;
  item?: string;
  status?: string;
  dueDate?: string;
  isCompleted?: boolean;
}

// 990s interface
export interface Tax990 {
  id: string; // Airtable record ID
  schoolId: string;
  year?: string;
  attachment?: string;
  attachmentUrl?: string;
}

// Governance Document interface
export interface GovernanceDocument {
  id: string; // Airtable record ID
  schoolId: string;
  docType?: string;
  doc?: string;
  dateEntered?: string;
}

export const ssjFilloutFormSchema = z.object({
  educatorId: z.string().optional(),
  formName: z.string().optional(),
  formType: z.string().optional(),
  dateSubmitted: z.string().optional(),
  status: z.string().optional(),
  submissionId: z.string().optional(),
  responseData: z.any().optional(),
  notes: z.string().optional(),
});

export const montessoriCertificationSchema = z.object({
  educatorId: z.string().optional(),
  certificationLevel: z.string().optional(),
  certificationStatus: z.string().optional(),
  certifier: z.string().optional(),
  trainingProgram: z.string().optional(),
  dateReceived: z.string().optional(),
  expirationDate: z.string().optional(),
  certificationNumber: z.string().optional(),
  notes: z.string().optional(),
});

export const eventAttendanceSchema = z.object({
  educatorId: z.string().optional(),
  eventName: z.string().optional(),
  eventType: z.string().optional(),
  eventDate: z.string().optional(),
  attendanceStatus: z.string().optional(),
  registrationDate: z.string().optional(),
  completionStatus: z.string().optional(),
  certificateIssued: z.boolean().optional(),
  notes: z.string().optional(),
});

export const educatorNoteSchema = z.object({
  educatorId: z.string().optional(),
  dateCreated: z.string().optional(),
  createdBy: z.string().optional(),
  notes: z.string().optional(),
  category: z.string().optional(),
  priority: z.string().optional(),
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
export type InsertMembershipFeeByYear = z.infer<typeof membershipFeeByYearSchema>;
export type InsertMembershipFeeUpdate = z.infer<typeof membershipFeeUpdateSchema>;
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

// Legacy schemas for backward compatibility
export const insertTeacherSchema = educatorSchema;
export const insertSchoolSchema = schoolSchema;
export const insertTeacherSchoolAssociationSchema = educatorSchoolAssociationSchema;


