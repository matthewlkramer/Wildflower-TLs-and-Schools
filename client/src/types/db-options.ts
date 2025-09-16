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

export type Email = any;
export type Event = any;

export type Charter = Tables['charters']['Row'];
export type CharterInsert = Tables['charters']['Insert'];
export type CharterUpdate = Tables['charters']['Update'];

export type Note = Tables['notes']['Row'];
export type ActionStep = Tables['action_steps']['Row'];
export type Location = Tables['locations']['Row'];
export type Grant = Tables['grants']['Row'];

export type GovernanceDoc = Tables['governance_docs']['Row'];
export type NineNinety = Tables['nine_nineties']['Row'];

// Additional types wired to real tables in public.schema.txt
export type EventAttendance = Tables['event_attendance']['Row'];
export type EventAttendanceInsert = Tables['event_attendance']['Insert'];
export type EventAttendanceUpdate = Tables['event_attendance']['Update'];

export type EmailAddress = Tables['email_addresses']['Row'];
export type EmailAddressInsert = Tables['email_addresses']['Insert'];
export type EmailAddressUpdate = Tables['email_addresses']['Update'];

export type ReportSubmission = Tables['school_reports_and_submissions']['Row'];
export type ReportSubmissionInsert = Tables['school_reports_and_submissions']['Insert'];
export type ReportSubmissionUpdate = Tables['school_reports_and_submissions']['Update'];

export type GovernanceDocument = Tables['governance_docs']['Row'];
export type GovernanceDocumentInsert = Tables['governance_docs']['Insert'];
export type GovernanceDocumentUpdate = Tables['governance_docs']['Update'];

export type CharterAuthorizerContact = Tables['charter_authorizers']['Row'];
export type CharterAuthorizerContactInsert = Tables['charter_authorizers']['Insert'];
export type CharterAuthorizerContactUpdate = Tables['charter_authorizers']['Update'];

export type AssessmentData = Tables['annual_assessment_and_metrics_data']['Row'];
export type AssessmentDataInsert = Tables['annual_assessment_and_metrics_data']['Insert'];
export type AssessmentDataUpdate = Tables['annual_assessment_and_metrics_data']['Update'];

export type CharterApplication = Tables['charter_applications']['Row'];
export type CharterApplicationInsert = Tables['charter_applications']['Insert'];
export type CharterApplicationUpdate = Tables['charter_applications']['Update'];

export type NineNineties = NineNinety;

export type SSJFilloutForm = Tables['ssj_fillout_forms']['Row'];
export type SSJFilloutFormInsert = Tables['ssj_fillout_forms']['Insert'];
export type SSJFilloutFormUpdate = Tables['ssj_fillout_forms']['Update'];

export type MontessoriCertification = Tables['montessori_certs']['Row'];
export type MontessoriCertificationInsert = Tables['montessori_certs']['Insert'];
export type MontessoriCertificationUpdate = Tables['montessori_certs']['Update'];

// Enumerated options derived from database enums and ref_* tables
// Source: client/public.schema.txt and Supabase enum snapshots
export const ACTION_STEP_STATUS = [
  'Complete',
  'Incomplete',
] as const;

export const ACTIVE_INACTIVE = [
  'Active',
  'Inactive',
  'Removed',
] as const;

export const AGE_SPANS = [
  '0-3', '3-6', '6-9', '9-12', '12-15', '15-18',
] as const;

export const AGE_SPANS_REV = [
  '0-1', '1-3', '3-6', '6-9', '9-12', '12-15', '15-18',
] as const;

export const AGES_GRADES = [
  'Infants', 'Toddlers', 'PK3', 'PK4', 'K',
  '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th',
  '9th', '10th', '11th', '12th',
] as const;

export const AUTHORIZOR_DECISIONS = [
  'Approved',
  'Approved, with contingency',
  'Deferred decision',
  'Denied',
] as const;

export const AUTOMATION_STEP_TRIGGER = [
  'Request prelim advice for $3k+',
  'Request full advice',
  'Waiting for prelim advice',
  'Waiting for full advice',
  'Proceed',
  'Processing',
  'Waiting for prereqs',
  'Complete',
] as const;

export const EMAIL_ADDRESS_CATEGORIES = [
  'personal',
  'work - non-wildflower',
  'work - wildflower school',
  'work - wildflower foundation',
  'school',
] as const;

export const EXEMPTION_STATUSES = [
  'Exempt',
  'Non-exempt',
] as const;

export const FEE_CHANGE_TYPES = [
  'Change in exemption status',
  'Change in fee',
  'Change likelihood of payment',
] as const;

export const FISCAL_YEAR_END = [
  '06/30', '12/31',
] as const;

export const GENDER_CATEGORIES = [
  'Female', 'Male', 'Gender Non-Conforming', 'Other',
] as const;

export const GOVERNANCE_MODELS = [
  'Independent', 'Charter', 'Community Partnership', 'District', 'Exploring Charter',
] as const;

export const GROUP_EXEMPTION_STATUS = [
  'Active', 'Never part of group exemption', 'Withdrawn', 'Applying', 'Issues',
] as const;

export const GSUITE_ROLES_OPTIONS = [
  'School Admin - School Orgs',
] as const;

export const CERTIFICATION_COMPLETION_STATUS = [
  'Certified', 'Training',
] as const;

export const CHARTER_APP_STATUS = [
  'Pre application', 'Preparing application', 'Awaiting decision', 'Authorized, preparing to open',
] as const;

export const CHARTER_STATUS = [
  'Awaiting start of cohort',
] as const;

export const COHORT_TYPE = [
  'Charter', 'Blooms',
] as const;

export const DEVELOPMENTAL_PLANES = [
  'Infants', 'Toddlers', 'Primary', 'Lower Elementary', 'Upper Elementary', 'Adolescent / JH', 'High School',
] as const;

export const DISCOVERY_STATUSES = [
  'Complete', 'In process', 'Paused',
] as const;

export const EDUC_ATTAINMENT_OPTIONS = [
  'Did not graduate high school',
  'Graduated high school or GED',
  'Some college or two-year degree',
  'Graduated college (four-year degree)',
  'Some graduate school',
  'Completed graduate school',
] as const;

export const GUIDE_TYPES = [
  'Ops Guide', 'Entrepreneur', 'Equity Coach', 'Open Schools Support',
] as const;

export const HIGH_MED_LOW = [
  'Low', 'Medium', 'High',
] as const;

export const INCOME_CATEGORIES = [
  'Very low', 'Low', 'Middle', 'Upper', 'Prefer not to respond',
] as const;

export const LANGUAGES = [
  'English', 'Spanish - Español', 'Mandarin - 中文', 'Hindi - हिन्दी', 'French - Français', 'Japanese - 日本語',
  'Arabic - العربية', 'Urdu - اُردُو', 'Hungarian - Hungarian', 'Haitian Creole - Kreyol Ayisyen', 'Gujarati - ગુજરાતી',
  'Fujian - Fujian', 'Russian - русский язык', 'Korean - 한국어', 'Cantonese - Gwóngdūng wá',
  'Tai-Kadai - ไทย / ဗမာစာ', 'Portuguese - Português', 'Tami - தமிழ்', 'Burmese - မြန်မာစာ', 'Yoruba', 'Other',
] as const;

export const LOAN_STATUS_OPTIONS = [
  'Interest Only Period', 'Paid Off', 'Principal Repayment Period',
] as const;

export const LOAN_VEHICLE_OPTIONS = [
  'LF II', 'Sep', 'Spring Point', 'TWF', 'TWF->LF II',
] as const;

export const RACE_ETHNICITY_CATEGORIES = [
  'african_american', 'asian_american', 'hispanic', 'middle_eastern', 'native_american', 'pacific_islander', 'white', 'other',
] as const;

export const SCHOOL_CALENDAR_OPTIONS = [
  '9-month', '10-month', 'Year-round',
] as const;

export const SCHOOL_ROLES = [
  'Teacher Leader', 'Emerging Teacher Leader', 'Founder', 'Classroom Staff', 'Fellow', 'Other',
] as const;

export const SCHOOL_SCHEDULE_OPTIONS = [
  'Before Care', 'Morning Care', 'Afternoon Care', 'After Care',
] as const;

export const SCHOOL_SSJ_ON_TRACK_FOR_ENROLLMENT = [
  'Maybe (process is ready, no prospective students)',
  'No (process unclear/unpublished, limited/no family engagement)',
  'Yes - tuition published, plan and community engagement underway',
] as const;

export const SCHOOL_STATUSES = [
  'Emerging', 'Open', 'Paused', 'Disaffiliated', 'Permanently Closed', 'Placeholder',
] as const;

export const LOCATION_TYPES = [
  'Mailing address - no physical school',
  'Physical address - does not receive mail',
  'School address and mailing address',
] as const;

export const LOGO_DESIGNER_OPTIONS = [
  'internal design', 'external design',
] as const;

export const MONTESSORI_ASSOCIATIONS = [
  'AMI', 'AMS', 'IMC', 'MEPI', 'PAMS', 'Independent', 'Other',
] as const;

export const NPS_OPTIONS = [
  '0','1','2','3','4','5','6','7','8','9','10',
] as const;

export const OPS_GUIDE_SUPPORT_TRACK_OPTIONS = [
  'Cohort', '1:1 support',
] as const;

export const PARTNER_ROLES = [
  'TL', 'Affiliate of Charter Partner', 'Ops Guide', 'Teacher Leader', 'Foundation Partner',
  'Regional Entrepreneur', 'School Supports Partner', 'Finance Administrator',
] as const;

export const PRONOUNS = [
  'he/him/his', 'she/her/hers', 'they/them/theirs', 'other',
] as const;

export const USE_OF_PROCEEDS_OPTIONS = [
  'Combine 2 loans', 'Expansion', 'Move', 'Operations', 'Renovations / Construction', 'Security deposit', 'Start-up',
] as const;

export const MEMBERSHIP_ACTION_OPTIONS = [
  'Signed Membership Agreement', 'Withdrew from Network', 'Sent Termination Letter',
] as const;

export const SSJ_BOARD_DEV_STATUS = [
  'No board', 'Board is forming', '1-2 mtgs', 'Board is developed and engaged', '3+ mtgs',
] as const;

export const SSJ_BUDGET_READY_FOR_NEXT_STEPS = [
  'No', 'Unsure', 'Yes',
] as const;

export const SSJ_BUILDING4GOOD_STATUS = [
  'Matched', 'Requested', 'Upcoming',
] as const;

export const SSJ_COHORT_STATUS = [
  'Left Cohort', 'Returning for Later Cohort', 'Switched Ops Guide Supports', 'Transitioned to Charter Application Supports',
] as const;

export const SSJ_FACILITY = [
  'Purchased building', 'Searching, intending to buy', 'Searching, intending to rent', 'Identified prospect(s)', 'Signed lease', 'Unsure',
] as const;

export const SSJ_FORM_TYPE = [
  'Get Involved', 'Start a School',
] as const;

export const SSJ_HAS_PARTNER = [
  'No partner', 'Partnership established', 'Partnership In development',
] as const;

export const SSJ_PATHWAY_TO_FUNDING = [
  'Maybe, prospects identified but not secured',
  'No, startup funding unlikely',
  'Yes, full funding likely',
] as const;

export const SSJ_SEEKING_WF_FUNDING = [
  'No', 'Yes, grant', 'Yes, loan',
] as const;

export const SSJ_STAGES = [
  'Visioning', 'Planning', 'Startup', 'Year 1', 'Complete',
] as const;

export const SSJ_TOOL = [
  'Charter Slides', 'Google Slides', 'My Wildflower - Sensible Default', 'Platform Pilot',
] as const;

export const STATE_ABBREVIATION = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','DC','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','PR',
] as const;

export const TRAINING_TYPES = [
  'Lead Guide', 'Assistant', 'Administrator',
] as const;

// Back-compat constants used in UI
export const SCHOOLS_OPTIONS_AGESSERVED = AGE_SPANS;
export const SCHOOLS_OPTIONS_GOVERNANCEMODEL = GOVERNANCE_MODELS;
export const KANBAN_GROUPS = ['New','In Progress','Ready','Complete'] as const;

export type SchoolStatus = typeof SCHOOL_STATUSES[number];
export type GovernanceModel = typeof GOVERNANCE_MODELS[number];
export type DiscoveryStatus = typeof DISCOVERY_STATUSES[number];
export type KanbanGroup = typeof KANBAN_GROUPS[number];

// Useful union types for many enums
export type AgeSpan = typeof AGE_SPANS[number];
export type AgeSpanRev = typeof AGE_SPANS_REV[number];
export type AgesGrades = typeof AGES_GRADES[number];
export type GenderCategory = typeof GENDER_CATEGORIES[number];
export type RaceEthnicityCategory = typeof RACE_ETHNICITY_CATEGORIES[number];
export type Language = typeof LANGUAGES[number];
export type Pronouns = typeof PRONOUNS[number];
export type IncomeCategory = typeof INCOME_CATEGORIES[number];
export type SchoolCalendarOption = typeof SCHOOL_CALENDAR_OPTIONS[number];
export type SchoolScheduleOption = typeof SCHOOL_SCHEDULE_OPTIONS[number];
export type PartnerRole = typeof PARTNER_ROLES[number];
export type UseOfProceedsOption = typeof USE_OF_PROCEEDS_OPTIONS[number];
export type LoanVehicleOption = typeof LOAN_VEHICLE_OPTIONS[number];
export type LoanStatusOption = typeof LOAN_STATUS_OPTIONS[number];
