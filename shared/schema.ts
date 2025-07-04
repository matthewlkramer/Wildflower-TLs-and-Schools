import { z } from "zod";

// Airtable-based schema for Wildflower Schools
export interface Educator {
  id: string; // Airtable record ID
  fullName: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  nickname?: string;
  primaryPhone?: string;
  secondaryPhone?: string;
  homeAddress?: string;
  pronouns?: string;
  gender?: string;
  raceEthnicity?: string[];
  primaryLanguage?: string[];
  otherLanguages?: string[];
  educationalAttainment?: string;
  montessoriCertified?: boolean;
  certificationLevels?: string[];
  certifier?: string[];
  montessoriLeadGuideTrainings?: string[];
  currentRole?: string[];
  discoveryStatus?: string;
  assignedPartner?: string[];
  assignedPartnerEmail?: string[];
  householdIncome?: string;
  incomeBackground?: string;
  individualType?: string;
  onboardingExperience?: string;
  currentlyActiveAtSchool?: boolean;
  allSchools?: string[];
  currentlyActiveSchool?: string[];
  schoolStatuses?: string[];
  startupStageForActiveSchool?: string[];
  targetCity?: string;
  firstContactWFSchoolEmploymentStatus?: string;
  firstContactNotesOnPreWildflowerEmployment?: string;
  firstContactInitialInterestInGovernanceModel?: string[];
  activeHolaspirit?: boolean;
  holaspiritMemberID?: string;
  tcUserID?: string;
  alsoAPartner?: boolean;
  onSchoolBoard?: string;
  everATLInAnOpenSchool?: boolean;
  created?: string;
  lastModified?: string;
  createdBy?: string;
}

export interface School {
  id: string; // Airtable record ID
  name: string;
  shortName?: string;
  fullName?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  targetCommunity?: string;
  phone?: string;
  email?: string;
  website?: string;
  grades?: string[];
  agesServed?: string[];
  schoolType?: string;
  governanceModel?: string;
  status?: string;
  openDate?: string;
  targetOpenDate?: string;
  enrollmentCap?: number;
  currentEnrollment?: number;
  tuitionRange?: string;
  membershipFeeStatus?: string;
  membershipFeeAmount?: number;
  publicFunding?: boolean;
  charterStatus?: string;
  authorizer?: string;
  demographics?: any;
  assessmentData?: any;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  created?: string;
  lastModified?: string;
  createdBy?: string;
  currentTLs?: string | number;
}

export interface EducatorSchoolAssociation {
  id: string;
  educatorId: string;
  schoolId: string;
  role?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  isPrimary?: boolean;
  isActive?: boolean;
  created?: string;
  lastModified?: string;
}

export interface Location {
  id: string; // Airtable record ID
  schoolId: string;
  address?: string;
  currentPhysicalAddress?: string;
  currentMailingAddress?: string;
  startDate?: string;
  endDate?: string;
  created?: string;
  lastModified?: string;
}

// Zod schemas for validation
export const educatorSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  middleName: z.string().optional(),
  nickname: z.string().optional(),
  primaryPhone: z.string().optional(),
  secondaryPhone: z.string().optional(),
  homeAddress: z.string().optional(),
  pronouns: z.string().optional(),
  gender: z.string().optional(),
  raceEthnicity: z.array(z.string()).optional(),
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
  onboardingExperience: z.string().optional(),
  currentlyActiveAtSchool: z.boolean().optional(),
  allSchools: z.array(z.string()).optional(),
  currentlyActiveSchool: z.array(z.string()).optional(),
  schoolStatuses: z.array(z.string()).optional(),
  startupStageForActiveSchool: z.array(z.string()).optional(),
  targetCity: z.string().optional(),
  firstContactWFSchoolEmploymentStatus: z.string().optional(),
  firstContactNotesOnPreWildflowerEmployment: z.string().optional(),
  firstContactInitialInterestInGovernanceModel: z.array(z.string()).optional(),
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
  fullName: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  targetCommunity: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  website: z.string().url("Invalid URL format").optional().or(z.literal("")),
  grades: z.array(z.string()).optional(),
  agesServed: z.array(z.string()).optional(),
  schoolType: z.string().optional(),
  governanceModel: z.string().optional(),
  status: z.string().optional(),
  openDate: z.string().optional(),
  targetOpenDate: z.string().optional(),
  enrollmentCap: z.number().optional(),
  currentEnrollment: z.number().optional(),
  tuitionRange: z.string().optional(),
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
});

export const educatorSchoolAssociationSchema = z.object({
  educatorId: z.string().min(1, "Educator ID is required"),
  schoolId: z.string().min(1, "School ID is required"),
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
  currentPhysicalAddress: z.string().optional(),
  currentMailingAddress: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type InsertEducator = z.infer<typeof educatorSchema>;
export type InsertSchool = z.infer<typeof schoolSchema>;
export type InsertEducatorSchoolAssociation = z.infer<typeof educatorSchoolAssociationSchema>;
export type InsertLocation = z.infer<typeof locationSchema>;

// Legacy types and schemas for backward compatibility (renaming teachers to educators)
export type Teacher = Educator;
export type InsertTeacher = InsertEducator;
export type TeacherSchoolAssociation = EducatorSchoolAssociation;
export type InsertTeacherSchoolAssociation = InsertEducatorSchoolAssociation;

// Legacy schema exports
export const insertTeacherSchema = educatorSchema;
export const insertSchoolSchema = schoolSchema;
export const insertTeacherSchoolAssociationSchema = educatorSchoolAssociationSchema;
