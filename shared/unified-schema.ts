// Generated unified schema from Airtable
// Generated on 2025-09-08T18:54:44.640Z
// Base ID: appJBT9a4f3b7hWQ2

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


// Generated Field Mappings for Transformers

export const SCHOOLS_FIELDS = {
  Name: "Name",
  Ages_served: "Ages served",
  Race___Ethnicity__from_Educator___via_Educators_x_Schools_: "Race & Ethnicity (from Educator) (via Educators x Schools)",
  Governance_Model: "Governance Model",
  School_Status: "School Status",
  Current_Mailing_Address: "Current Mailing Address",
  Prior_Names: "Prior Names",
  Primary_Contacts: "Primary Contacts",
  Current_TLs: "Current TLs",
  Opened: "Opened",
  Logo_URL: "Logo URL",
  Logo: "Logo",
  Charter: "Charter",
  School_calendar: "School calendar",
  School_schedule: "School schedule",
  Left_Network_Date: "Left Network Date",
  Left_Network_Reason: "Left Network Reason",
  Membership_Agreement_date: "Membership Agreement date",
  Signed_Membership_Agreement: "Signed Membership Agreement",
  Email_Domain: "Email Domain",
  School_Phone: "School Phone",
  Facebook: "Facebook",
  Instagram: "Instagram",
  Website: "Website",
  Locations: "Locations",
  TC_school_ID: "TC school ID",
  Educators_x_Schools: "Educators x Schools",
  Planning_album: "Planning album",
  Guide_assignments: "Guide assignments",
  Business_Insurance: "Business Insurance",
  QBO: "QBO",
  Gusto: "Gusto",
  TC_Recordkeeping: "TC Recordkeeping",
  TC_Admissions: "TC Admissions",
  Admissions_System: "Admissions System",
  Transparent_Classroom: "Transparent Classroom",
  Budget_Utility: "Budget Utility",
  Website_tool: "Website tool",
  Google_Voice: "Google Voice",
  Nonprofit_status: "Nonprofit status",
  Logo_designer: "Logo designer",
  Domain_Name: "Domain Name",
  On_national_website: "On national website",
  Membership_Status: "Membership Status",
  School_Email: "School Email",
  Institutional_partner: "Institutional partner",
  Trademark_filed: "Trademark filed",
  Name_Selection_Proposal: "Name Selection Proposal",
  Grants__WF_: "Grants (WF)",
  School_notes: "School notes",
} as const;

export const CHARTERS_FIELDS = {
  Charter_key: "Charter key",
  charter_id: "charter_id",
  Short_Name: "Short Name",
  Full_name: "Full name",
  Initial_target_community: "Initial target community",
  Initial_target_ages_link: "Initial target ages link",
  Initial_target_ages: "Initial target ages",
  Landscape_analysis: "Landscape analysis",
  Application: "Application",
  Non_TL_roles: "Non-TL roles",
  Name__from_Non_TL_roles_: "Name (from Non-TL roles)",
  Role__from_Non_TL_roles_: "Role (from Non-TL roles)",
  Currently_active__from_Non_TL_roles_: "Currently active (from Non-TL roles)",
  Projected_open: "Projected open",
  Cohorts: "Cohorts",
  Status: "Status",
  Schools: "Schools",
  Record_ID__from_Schools_: "Record ID (from Schools)",
  Group_Exemption_Status: "Group Exemption Status",
  Date_received_group_exemption: "Date received group exemption",
  _990s: "990s",
  _990_Record_ID__from_990s_: "990 Record ID (from 990s)",
  EIN: "EIN",
  Incorporation_Date: "Incorporation Date",
  Current_FY_end: "Current FY end",
  School_governance_documents: "School governance documents",
  Doc_ID__from_School_governance_documents_: "Doc ID (from School governance documents)",
  Nondiscrimination_Policy_on_Website: "Nondiscrimination Policy on Website",
  School_provided_with_1023_recordkeeping_requirements: "School provided with 1023 recordkeeping requirements",
  GuideStar_Listing_Requested_: "GuideStar Listing Requested?",
  Membership_fee_school_x_year: "Membership fee school x year",
  recID__from_Membership_fee_school_x_year_: "recID (from Membership fee school x year)",
  Annual_enrollment_and_demographics: "Annual enrollment and demographics",
  Locations: "Locations",
  Location_ID__from_Locations_: "Location ID (from Locations)",
  Partnership_with_WF_started: "Partnership with WF started",
  Authorized: "Authorized",
  First_site_opened: "First site opened",
  Website: "Website",
  School_reports: "School reports",
  RecID__from_School_reports_: "RecID (from School reports)",
  Charter_assessments: "Charter assessments",
  charter_assessment_id: "charter_assessment_id",
  Charter_authorizers_and_contacts: "Charter authorizers and contacts",
  recId__from_Charter_authorizers_and_contacts_: "recId (from Charter authorizers and contacts)",
  Charter_applications: "Charter applications",
  recID__from_Charter_applications_: "recID (from Charter applications)",
  Nonprofit_status: "Nonprofit status",
  Charter_level_membership_agreement: "Charter-level membership agreement",
  Charter_level_membership_agreement_signed: "Charter-level membership agreement signed",
} as const;

export const LOCATIONS_FIELDS = {
  Location_Key: "Location Key",
  Inactive_without_end_date__or_active_with_end_date: "Inactive without end date; or active with end date",
  location_id: "location_id",
  School: "School",
  school_id: "school_id",
  Charter: "Charter",
  charter_id: "charter_id",
  Current_mailing_address_: "Current mailing address?",
  Current_physical_address_: "Current physical address?",
  Start_of_time_at_location: "Start of time at location",
  End_of_time_at_location: "End of time at location",
  Co_Location_Type: "Co-Location Type",
  Co_Location_Partner_: "Co-Location Partner ",
  Location_type: "Location type",
  Address: "Address",
  Street: "Street",
  City: "City",
  State: "State",
  Country: "Country",
  Postal_code: "Postal code",
  Neighborhood: "Neighborhood",
  Square_feet: "Square feet",
  Max_Students_Licensed_For: "Max Students Licensed For",
  Latitude: "Latitude",
  Longitude: "Longitude",
  Created: "Created",
  Last_Modified: "Last Modified",
  Geocode_Automation_Last_Run_At: "Geocode Automation Last Run At",
  School_Status__from_School_: "School Status (from School)",
  Census_Tract: "Census Tract",
  Qualified_Low_Income_Census_Tract: "Qualified Low Income Census Tract",
  Lease: "Lease",
  Lease_End_Date: "Lease End Date",
  Time_Zone: "Time Zone",
  Short_Name: "Short Name",
} as const;

export const EDUCATORS_FIELDS = {
  Full_Name: "Full Name",
  Discovery_status: "Discovery status",
  Race___Ethnicity: "Race & Ethnicity",
  Assigned_Partner: "Assigned Partner",
  Certification_Levels__from_Montessori_Certifications_: "Certification Levels (from Montessori Certifications)",
  Certifier__from_Montessori_Certifications_: "Certifier (from Montessori Certifications)",
  educator_id: "educator_id",
  First_Name: "First Name",
  Current_Role: "Current Role",
  Last_Name: "Last Name",
  Newsletter_and_Group_Subscriptions: "Newsletter and Group Subscriptions",
  survey___2022_Wildflower_Network_Survey: "survey - 2022 Wildflower Network Survey",
  Montessori_Certified: "Montessori Certified",
  Pronouns: "Pronouns",
  Other_languages: "Other languages",
  Assigned_Partner_Email: "Assigned Partner Email",
  Middle_Name: "Middle Name",
  Educators_at_Schools: "Educators at Schools",
  All_Schools: "All Schools",
  Currently_Active_School: "Currently Active School",
  Primary_contact_for: "Primary contact for",
  Active_School_Record_ID: "Active School Record ID",
  Home_Address: "Home Address",
  Source: "Source",
  Educator_notes: "Educator notes",
  Source___other: "Source - other",
  Active_Holaspirit: "Active Holaspirit",
  Holaspirit_memberID: "Holaspirit memberID",
  TC_User_ID: "TC User ID",
  Educational_Attainment: "Educational Attainment",
  Montessori_lead_guide_trainings: "Montessori lead guide trainings",
  Also_a_partner: "Also a partner",
  Nickname: "Nickname",
  Primary_Language: "Primary Language",
  Race___Ethnicity___Other: "Race & Ethnicity - Other",
  Household_Income: "Household Income",
  Income_Background: "Income Background",
  Gender: "Gender",
  Gender___Other: "Gender - Other",
  LGBTQIA: "LGBTQIA",
  Pronouns___Other: "Pronouns - Other",
  Notes__from_Educator_notes_: "Notes (from Educator notes)",
  Last_Modified: "Last Modified",
  Created: "Created",
  School_Statuses: "School Statuses",
  Active_School_Affiliation_Status: "Active School Affiliation Status",
  Events_attended: "Events attended",
  Montessori_Certifications: "Montessori Certifications",
  Training_Grants: "Training Grants",
  Platform_Educators___Partners: "Platform Educators & Partners",
} as const;

export const EDUCATORS_X_SCHOOLS_FIELDS = {
  edXschool_key: "edXschool key",
  School_Name: "School Name",
  Educator_Full_Name: "Educator Full Name",
  Race___Ethnicity__from_Educator_: "Race & Ethnicity (from Educator)",
  Roles: "Roles",
  Ages_served: "Ages served",
  SSJ_Stage: "SSJ Stage",
  Educator: "Educator",
  Email_at_School: "Email at School",
  School_Address: "School Address",
  School: "School",
  Loan_Fund_: "Loan Fund?",
  _21_22_Completed_Demographic_Info_: "21-22 Completed Demographic Info?",
  School_Status: "School Status",
  Currently_Active: "Currently Active",
  Opened__from_School_: "Opened (from School)",
  Start_Date: "Start Date",
  End_Date: "End Date",
  Income_background: "Income background",
  Gender__from_socio_economic_background_: "Gender (from socio-economic background)",
  Primary_Language__from_languages___socio_economic_background_: "Primary Language (from languages / socio-economic background)",
  LGBTQIA__from_Socio_economic_Background___from_Educator_: "LGBTQIA (from Socio-economic Background) (from Educator)",
  Montessori_Certifications: "Montessori Certifications",
  Montessori_Certified_: "Montessori Certified?",
  educatorsXschools_id: "educatorsXschools_id",
  educator_id: "educator_id",
  school_id: "school_id",
  TL_Gift_2022: "TL Gift 2022",
  Membership_Status: "Membership Status",
  Loan__from_Loans___Issue_Method___from_School_: "Loan (from Loans - Issue Method) (from School)",
  Governance_Model__from_School_: "Governance Model (from School)",
  Charter__from_School_: "Charter (from School)",
  On_Connected: "On Connected",
  On_Slack: "On Slack",
  On_Teacher_Leader_Google_Group: "On Teacher Leader Google Group",
  Platform_Educators_x_Schools: "Platform Educators x Schools",
  On_Wildflower_Directory: "On Wildflower Directory",
  Created: "Created",
  Entered_Visioning__from_School_: "Entered Visioning (from School)",
  Membership_Agreement_date__from_School_: "Membership Agreement date (from School)",
  Invited_to_2024_Refresher: "Invited to 2024 Refresher",
  Email_Status: "Email Status",
  Who_initiated_E_TL_removal_: "Who initiated E/TL removal?",
  On_National_Website: "On National Website",
  GSuite_Roles: "GSuite Roles",
  Loans: "Loans",
  Entered_Startup: "Entered Startup",
  Entered_Planning: "Entered Planning",
  School_Short_Name: "School Short Name",
  First_Name__from_Educator_: "First Name (from Educator)",
} as const;

export const GRANTS_FIELDS = {
  Grant_Key: "Grant Key",
  School: "School",
  school_id: "school_id",
  School_Short_Name: "School Short Name",
  Recipient_name_from_QBO: "Recipient name from QBO",
  TLs_at_time_of_grant: "TLs at time of grant",
  Legal_Name_at_time_of_grant: "Legal Name at time of grant",
  Mailing_address_at_time_of_grant: "Mailing address at time of grant",
  TL_emails_at_time_of_grant: "TL emails at time of grant",
  EIN_at_time_of_grant: "EIN at time of grant",
  Nonprofit_status_at_time_of_grant: "Nonprofit status at time of grant",
  Membership_status_at_time_of_grant: "Membership status at time of grant",
  Ready_to_accept_grant__501c3___EIN_: "Ready to accept grant (501c3 + EIN)",
  Have_data_to_issue_grant_letter: "Have data to issue grant letter",
  Bill_com: "Bill.com",
  GuideEntrepreneur_Short_Name: "GuideEntrepreneur Short Name",
  School_Grant_Name: "School Grant Name",
  Grant_Status: "Grant Status",
  Amount: "Amount",
  Issue_Date: "Issue Date",
  Funding_Source: "Funding Source",
  Issued_by: "Issued by",
  Issued_by_Short_Name: "Issued by Short Name",
  Label: "Label",
  Accounting_Notes: "Accounting Notes",
  QBO__: "QBO #",
  Notes: "Notes",
  Funding_Hub: "Funding Hub",
  Text_for_ledger_entry: "Text for ledger entry",
  Funding_purpose__for_grant_agreement_: "Funding purpose (for grant agreement)",
  Funding_period__for_grant_agreement_: "Funding period (for grant agreement)",
  Proof_of_501_c_3_status_at_time_of_grant: "Proof of 501(c)3 status at time of grant",
  Initiate_grant_process: "Initiate grant process",
  Automation_step_trigger: "Automation step trigger",
  Prelim_advice_request_time: "Prelim advice request time",
  Full_advice_request_time: "Full advice request time",
  Advice_window__1_week__closed: "Advice window (1 week) closed",
  Unsigned_Grant_Agreement: "Unsigned Grant Agreement",
  Signed_Grant_Agreement: "Signed Grant Agreement",
  Open_grant: "Open grant",
  Grants_Advice_Log: "Grants Advice Log",
  Prelim_Advice_Yeses: "Prelim Advice Yeses",
  Prelim_Advice_Pauses: "Prelim Advice Pauses",
  Full_Advice_Yeses: "Full Advice Yeses",
  Full_Advice_Open_Questions: "Full Advice Open Questions",
  Full_Advice_Open_Objections: "Full Advice Open Objections",
  Days_since_prelim_advice_request: "Days since prelim advice request",
  Days_since_full_advice_request: "Days since full advice request",
  grant_id: "grant_id",
  Count_of_Active_Mailing_Addresses__from_School_: "Count of Active Mailing Addresses (from School)",
} as const;

export const GRANTS_ADVICE_LOG_FIELDS = {
  grant_advice_id: "grant_advice_id",
  Grant: "Grant",
  Advice_Giver: "Advice Giver",
  Issued_by__from_Grant_: "Issued by (from Grant)",
  Step: "Step",
  Initial_Advice: "Initial Advice",
  Advice_Given___text: "Advice Given - text",
  Advice_Given___date: "Advice Given - date",
  Question_Resolved_Time: "Question Resolved Time",
  Objection_Cleared_Time: "Objection Cleared Time",
  Status: "Status",
  Partners_copy: "Partners copy",
} as const;

export const LOANS_FIELDS = {
  Loan_Key: "Loan Key",
  loan_id: "loan_id",
  School: "School",
  school_id: "school_id",
  Amount_Issued: "Amount Issued",
  Effective_Issue_Date: "Effective Issue Date",
  Loan_Status: "Loan Status",
  Approximate_Outstanding_Amount: "Approximate Outstanding Amount",
  Loan_paperwork: "Loan paperwork",
  Notes: "Notes",
  Maturity: "Maturity",
  Interest_Rate: "Interest Rate",
  Use_of_Proceeds: "Use of Proceeds",
  Issue_Method: "Issue Method",
  Contact_email__from_Educator___from_Educators_x_Schools___from_School_: "Contact email (from Educator) (from Educators x Schools) (from School)",
  Loan_Contact_Email_1: "Loan Contact Email 1",
  Loan_Contact_Email_2: "Loan Contact Email 2",
  Educators_x_Schools: "Educators x Schools",
} as const;

export const GOVERNANCE_DOCS_FIELDS = {
  Doc_Key: "Doc Key",
  govdoc_id: "govdoc_id",
  School: "School",
  charter_id: "charter_id",
  school_id: "school_id",
  short_name: "short_name",
  Document_type: "Document type",
  Date: "Date",
  Doc_notes: "Doc notes",
  Document_PDF: "Document PDF",
  EIN__from_School_: "EIN (from School)",
  Charter: "Charter",
  Doc_Link: "Doc Link",
  url___pdf_extension_formula: "url-->pdf extension formula",
  Publication_link: "Publication link",
  Created: "Created",
} as const;

export const _990S_FIELDS = {
  _990_key: "990 key",
  nine_ninety_id: "nine_ninety_id",
  School: "School",
  charter_id: "charter_id",
  school_id: "school_id",
  short_name: "short_name",
  supabase_id: "supabase_id",
  Legal_structure__from_School_: "Legal structure (from School)",
  Charter_key: "Charter key",
  Incorporation_Date__from_School_ID_: "Incorporation Date (from School ID)",
  EIN: "EIN",
  _990_Reporting_Year: "990 Reporting Year",
  link: "link",
  PDF: "PDF",
  Group_Exemption: "Group Exemption",
  Notes: "Notes",
  AI_Derived_Revenue: "AI Derived Revenue",
  AI_Derived_EOY_Date: "AI Derived EOY Date",
  Short_Name__from_School_ID_: "Short Name (from School ID)",
  url___pdf_extension_formula: "url-->pdf extension formula",
  Membership_fee_school_x_year: "Membership fee school x year",
} as const;

export const LOAN_PAYMENTS_FIELDS = {
  Payment_key: "Payment key",
  School: "School",
  Loan_Report_Name__from_School_ID_: "Loan Report Name (from School ID)",
  Payment_date: "Payment date",
  Amount: "Amount",
  Short_Name: "Short Name",
} as const;

export const EVENTS_FIELDS = {
  Event_Name: "Event Name",
  event_id: "event_id",
  Date: "Date",
  Type: "Type",
  Attendees: "Attendees",
} as const;

export const EVENT_ATTENDANCE_FIELDS = {
  Event_Attendance_key: "Event Attendance key",
  Event_Participant: "Event Participant",
  educator_id: "educator_id",
  Event: "Event",
  Event_Name: "Event Name",
  Registered: "Registered",
  Registration_Date: "Registration Date",
  Attended: "Attended",
  Time_at_event: "Time at event",
  Phone: "Phone",
  TL_Stories_Type: "TL Stories Type",
  TL_Stories_Race: "TL Stories Race",
  TL_Stories_School_Target: "TL Stories School Target",
  TL_Stories_Q1: "TL Stories Q1",
  TL_Stories_Q2: "TL Stories Q2",
  needs_spanish_translation: "needs spanish translation",
  Field_10: "Field 10",
  Field_11: "Field 11",
  Field_12: "Field 12",
  Field_13: "Field 13",
  Field_15: "Field 15",
  Field_16: "Field 16",
  Field_17: "Field 17",
  Field_18: "Field 18",
  Income_Background__from_Event_Participant_: "Income Background (from Event Participant)",
  Household_Income__from_Event_Participant_: "Household Income (from Event Participant)",
  Race___Ethnicity__from_Event_Participant_: "Race & Ethnicity (from Event Participant)",
  Current_School__from_Event_Participant_: "Current School (from Event Participant)",
  Educators_at_Schools__from_Event_Participant_: "Educators at Schools (from Event Participant)",
  Assigned_Partner__from_Event_Participant_: "Assigned Partner (from Event Participant)",
  Hub__from_Event_Participant_: "Hub (from Event Participant)",
  Age_Classrooms_Interested_in_Offering__from_Event_Participant_: "Age Classrooms Interested in Offering (from Event Participant)",
  School_Status__from_Event_Participant_: "School Status (from Event Participant)",
  Educator_record_created: "Educator record created",
  Montessori_Certifications__from_Event_Participant_: "Montessori Certifications (from Event Participant)",
  Hub_Name__from_Event_Participant_: "Hub Name (from Event Participant)",
  Stage__from_Event_Participant_: "Stage (from Event Participant)",
  Status__from_Event_Participant_: "Status (from Event Participant)",
  Stage_change_from_visioning_to_planning__from_Event_Participant_: "Stage change from visioning to planning (from Event Participant)",
  Stage_change_from_Discovery_to_Visioning__from_Event_Participant_: "Stage change from Discovery to Visioning (from Event Participant)",
  CountofLoggedPlannings__from_Event_Participant_: "CountofLoggedPlannings (from Event Participant)",
  CountofLoggedVisioning__from_Event_Participant_: "CountofLoggedVisioning (from Event Participant)",
  CountofLoggedDiscover__from_Event_Participant_: "CountofLoggedDiscover (from Event Participant)",
  When_did_they_switch_to_visioning: "When did they switch to visioning",
  SSJ_Typeforms__Start_a_School__from_Event_Participant_: "SSJ Typeforms: Start a School (from Event Participant)",
  Source__from_SSJ_Typeforms__Start_a_School___from_Event_Participant_: "Source (from SSJ Typeforms: Start a School) (from Event Participant)",
  Event_Type: "Event Type",
  Started_SSJ___completed_SSJ_typeform_: "Started SSJ? (completed SSJ typeform)",
  Marketing_source: "Marketing source",
  Network: "Network",
} as const;

export const MAILING_LISTS_FIELDS = {
  Subscription_ID: "Subscription ID",
  Record_ID: "Record ID",
  Name: "Name",
  Slug: "Slug",
  Type: "Type",
  Google_Group_ID: "Google Group ID",
  Educators: "Educators",
  Educator_Log: "Educator Log",
} as const;

export const MONTESSORI_CERTS_FIELDS = {
  Montessori_Cert_key: "Montessori Cert key",
  montessori_cert_id: "montessori_cert_id",
  Educator: "Educator",
  educator_id: "educator_id",
  Year_Certified: "Year Certified",
  Certification_Levels: "Certification Levels",
  Level: "Level",
  Field_12: "Field 12",
  Certifier: "Certifier",
  Abbreviation: "Abbreviation",
  Certifier___Other: "Certifier - Other",
  Certification_Status: "Certification Status",
  Created: "Created",
} as const;

export const SSJ_TYPEFORMS_START_A_SCHOOL_FIELDS = {
  Response_ID: "Response ID",
  Record_ID: "Record ID",
  SSJ_data_on_educators: "SSJ data on educators",
  Educator: "Educator",
  First_Name: "First Name",
  Last_Name: "Last Name",
  Email: "Email",
  Is_Montessori_Certified: "Is Montessori Certified",
  Is_Seeking_Montessori_Certification: "Is Seeking Montessori Certification",
  Montessori_Certification_Certifier: "Montessori Certification Certifier",
  Montessori_Certification_Year: "Montessori Certification Year",
  Montessori_Certification_Levels: "Montessori Certification Levels",
  School_Location__City: "School Location: City",
  School_Location__State: "School Location: State",
  School_Location__Country: "School Location: Country",
  School_Location__Community: "School Location: Community",
  Has_Interest_in_Joining_Another_School: "Has Interest in Joining Another School",
  Is_Willing_to_Move: "Is Willing to Move",
  Contact_Location__City: "Contact Location: City",
  Contact_Location__State: "Contact Location: State",
  Contact_Location__Country: "Contact Location: Country",
  Age_Classrooms_Interested_In_Offering: "Age Classrooms Interested In Offering",
  Socio_Economic__Race___Ethnicity: "Socio-Economic: Race & Ethnicity",
  Socio_Economic__Race___Ethnicity_Other: "Socio-Economic: Race & Ethnicity Other",
  Socio_Economic__LGBTQIA_Identifying: "Socio-Economic: LGBTQIA Identifying",
  Socio_Economic__Pronouns: "Socio-Economic: Pronouns",
  Socio_Economic__Pronouns_Other: "Socio-Economic: Pronouns Other",
  Socio_Economic__Gender: "Socio-Economic: Gender",
  Socio_Economic__Gender_Other: "Socio-Economic: Gender Other",
  Socio_Economic__Household_Income: "Socio-Economic: Household Income",
  Socio_Economic__Primary_Language: "Socio-Economic: Primary Language",
  Message: "Message",
  Equity_Reflection: "Equity Reflection",
  Receive_Communications: "Receive Communications",
  Source: "Source",
  Entry_Date: "Entry Date",
  Tags: "Tags",
  Created_At: "Created At",
  Month: "Month",
  Initial_Interest_in_Governance_Model: "Initial Interest in Governance Model",
  Is_Interested_in_Charter: "Is Interested in Charter",
  Event_attendance: "Event attendance",
  Record_ID__from_Event_Participant___from_Event_attendance_: "Record ID (from Event Participant) (from Event attendance)",
  Time_at_event__from_Event_attendance_: "Time at event (from Event attendance)",
  Attended__from_Event_attendance_: "Attended (from Event attendance)",
  Registered__from_Event_attendance_: "Registered (from Event attendance)",
  School_Location__Address: "School Location: Address",
  Contact_Location__Address: "Contact Location: Address",
  Educators: "Educators",
  SSJ_Fillout_Form__Get_Involved: "SSJ Fillout Form: Get Involved",
} as const;

export const SSJ_FILLOUT_FORMS_FIELDS = {
  SSJ_FIllout_Form_key: "SSJ FIllout Form key",
  ssj_fillout_form_id: "ssj_fillout_form_id",
  Form_version: "Form version",
  First_Name: "First Name",
  Last_Name: "Last Name",
  Full_Name: "Full Name",
  Email: "Email",
  Link_to_Start_a_School: "Link to Start a School",
  Socio_Economic__Race___Ethnicity: "Socio-Economic: Race & Ethnicity",
  Socio_Economic__Race___Ethnicity_Other: "Socio-Economic: Race & Ethnicity Other",
  Socio_Economic__LGBTQIA_Identifying__from_Email_: "Socio-Economic: LGBTQIA Identifying (from Email)",
  Socio_Economic__Pronouns: "Socio-Economic: Pronouns",
  Socio_Economic__Pronouns_Other: "Socio-Economic: Pronouns Other",
  Socio_Economic__Gender: "Socio-Economic: Gender",
  Gender_standardized: "Gender standardized",
  Socio_Economic__Gender_Other: "Socio-Economic: Gender Other",
  Socio_Economic__Household_Income: "Socio-Economic: Household Income",
  Primary_Language: "Primary Language",
  Primary_Language_Other: "Primary Language Other",
  Message: "Message",
  Is_Interested_in_Charter__from_Email_: "Is Interested in Charter (from Email)",
  Educators: "Educators",
  educator_id: "educator_id",
  Contact_Type: "Contact Type",
  Contact_Type_standardized: "Contact Type standardized",
  Montessori_Cert_Q: "Montessori Cert Q",
  Status_of_Processing_Montessori_Certs: "Status of Processing Montessori Certs",
  Is_Montessori_Certified: "Is Montessori Certified",
  Is_Seeking_Montessori_Certification: "Is Seeking Montessori Certification",
  Temp___M_Cert_Cert_1: "Temp - M Cert Cert 1",
  Montessori_Certification_Certifier_1: "Montessori Certification Certifier 1",
  Temp___M_Cert_Year_1: "Temp - M Cert Year 1",
  Montessori_Certification_Year_1: "Montessori Certification Year 1",
  Temp___M_Cert_Level_1: "Temp - M Cert Level 1",
  Montessori_Certification_Level_1: "Montessori Certification Level 1",
  Temp___M_Cert_Cert_2: "Temp - M Cert Cert 2",
  Montessori_Certification_Certifier_2: "Montessori Certification Certifier 2",
  Temp___M_Cert_Year_2: "Temp - M Cert Year 2",
  Montessori_Certification_Year_2: "Montessori Certification Year 2",
  Temp___M_Cert_Level_2: "Temp - M Cert Level 2",
  Montessori_Certification_Level_2: "Montessori Certification Level 2",
  Temp___M_Cert_Cert_3: "Temp - M Cert Cert 3",
  Montessori_Certification_Certifier_3: "Montessori Certification Certifier 3",
  Temp___M_Cert_Year_3: "Temp - M Cert Year 3",
  Montessori_Certification_Year_3: "Montessori Certification Year 3",
  Temp___M_Cert_Level_3: "Temp - M Cert Level 3",
  Montessori_Certification_Level_3: "Montessori Certification Level 3",
  Temp___M_Cert_Cert_4: "Temp - M Cert Cert 4",
  Montessori_Certification_Certifier_4: "Montessori Certification Certifier 4",
  Temp___M_Cert_Year_4: "Temp - M Cert Year 4",
} as const;

export const GUIDES_FIELDS = {
  email_or_name: "email or name",
  Record_ID: "Record ID",
  Email: "Email",
  Currently_active: "Currently active",
  Roles: "Roles",
  Photo: "Photo",
  Phone: "Phone",
  Home_address: "Home address",
  DOB: "DOB",
  TLs: "TLs",
  Educator_Record_IDs: "Educator Record IDs",
  Guide_assignments: "Guide assignments",
  Guided_School_Record_ID: "Guided School Record ID",
  Start_Date__from_Stints_: "Start Date (from Stints)",
  End_Date__from_Stints_: "End Date (from Stints)",
  Stint_type__from_Stints_: "Stint type (from Stints)",
  Active_stint: "Active stint",
  _2016_2017__from_Stints_: "2016-2017 (from Stints)",
  _2017_2018__from_Stints_: "2017-2018 (from Stints)",
  _2018_2019__from_Stints_: "2018-2019 (from Stints)",
  _2019_2020__from_Stints_: "2019-2020 (from Stints)",
  Educator_notes: "Educator notes",
  School_notes: "School notes",
  Website_bio: "Website bio",
  Slack_handle: "Slack handle",
  Papyrs_profile: "Papyrs profile",
  Copper_userID: "Copper userID",
  Public_website_active: "Public website active",
  Holaspirit_member_ID: "Holaspirit member ID",
  Image_URL: "Image URL",
  Name: "Name",
  Short_name: "Short name",
  Educator_Log: "Educator Log",
  Personal_Email: "Personal Email",
  Action_steps: "Action steps",
  SSJ_Process_Details: "SSJ Process Details",
  Schools: "Schools",
  Lead_Routing: "Lead Routing",
  Email_templates: "Email templates",
  Grants_5: "Grants 5",
  Membership_termination_steps_and_dates: "Membership termination steps and dates",
  Grants_Advice_Log: "Grants Advice Log",
  Key_Value_Pairs: "Key Value Pairs",
  Roadmap: "Roadmap",
  Roadmap_2: "Roadmap 2",
} as const;

export const GUIDES_ASSIGNMENTS_FIELDS = {
  Guide_Assignment_key: "Guide Assignment key",
  guide_assignment_id: "guide_assignment_id",
  School: "School",
  School_Short_Name: "School Short Name",
  school_id: "school_id",
  Partner: "Partner",
  Guide_short_name: "Guide short name",
  Start_date: "Start date",
  End_date: "End date",
  Type: "Type",
  Currently_active: "Currently active",
} as const;

export const SCHOOL_NOTES_FIELDS = {
  School_Note_Key: "School Note Key",
  school_note_id: "school_note_id",
  School: "School",
  charter_id: "charter_id",
  school_id: "school_id",
  Notes: "Notes",
  Date_created: "Date created",
  Created_by: "Created by",
  Partner_Short_Name: "Partner Short Name",
  Private: "Private",
  Headline__Notes_: "Headline (Notes)",
  Partners_copy: "Partners copy",
} as const;

export const EDUCATOR_NOTES_FIELDS = {
  Educator_Note_Key: "Educator Note Key",
  educator_notes_id: "educator_notes_id",
  Educator: "Educator",
  educator_id: "educator_id",
  Notes: "Notes",
  Date: "Date",
  Created_by: "Created by",
  Private: "Private",
  Full_Name__from_Educator_: "Full Name (from Educator)",
  Partners_copy: "Partners copy",
} as const;

export const TRAINING_GRANTS_FIELDS = {
  Training_Participant___Program: "Training Participant + Program",
  Educators: "Educators",
  Training_Program: "Training Program",
  Applied_: "Applied?",
  Training_Status: "Training Status",
  Cohort: "Cohort",
  Training_Grant_Status: "Training Grant Status",
  Training_Grant_Amount: "Training Grant Amount",
  Notes: "Notes",
  Status__from_Educators_: "Status (from Educators)",
  Stage__from_Educators_: "Stage (from Educators)",
  Hub_Name__from_Educators_: "Hub Name (from Educators)",
} as const;

export const PUBLIC_FUNDING_FIELDS = {
  Name: "Name",
  Description: "Description",
  Relevant_levels: "Relevant levels",
  Schools: "Schools",
  Schools_copy: "Schools copy",
} as const;

export const ACTION_STEPS_FIELDS = {
  Item: "Item",
  action_step_id: "action_step_id",
  Assignee: "Assignee",
  Assignee_Short_Name: "Assignee Short Name",
  Status: "Status",
  Assigned_date: "Assigned date",
  Due_date: "Due date",
  Schools: "Schools",
  charter_id: "charter_id",
  school_id: "school_id",
  School_Short_Name: "School Short Name",
  SSJ_Stage: "SSJ Stage",
  School_Status: "School Status",
  Completed_date: "Completed date",
  Partners_copy: "Partners copy",
} as const;

export const EVENT_TYPES_FIELDS = {
  Event_Category: "Event Category",
  Events: "Events",
} as const;

export const QBO_SCHOOL_CODES_FIELDS = {
  Customer_ID_in_QBO: "Customer ID in QBO",
  School_Name_in_QBO: "School Name in QBO",
  Schools: "Schools",
  Membership_fee_invoices: "Membership fee invoices",
  Membership_fee_credits: "Membership fee credits",
} as const;

export const MONTESSORI_CERT_LEVELS_FIELDS = {
  Name: "Name",
  Montessori_Certs: "Montessori Certs",
  SSJ_Fillout_Form__Get_Involved: "SSJ Fillout Form: Get Involved",
  SSJ_Fillout_Form__Get_Involved_2: "SSJ Fillout Form: Get Involved 2",
  SSJ_Fillout_Form__Get_Involved_3: "SSJ Fillout Form: Get Involved 3",
  SSJ_Fillout_Form__Get_Involved_4: "SSJ Fillout Form: Get Involved 4",
  Educators: "Educators",
  Educators_2: "Educators 2",
  Charters: "Charters",
  Educators_x_Schools: "Educators x Schools",
} as const;

export const MONTESSORI_CERTIFIERS_FIELDS = {
  Name: "Name",
  Abbreviation: "Abbreviation",
  Montessori_Certs: "Montessori Certs",
  SSJ_Fillout_Form__Get_Involved: "SSJ Fillout Form: Get Involved",
  SSJ_Fillout_Form__Get_Involved_2: "SSJ Fillout Form: Get Involved 2",
  SSJ_Fillout_Form__Get_Involved_3: "SSJ Fillout Form: Get Involved 3",
  SSJ_Fillout_Form__Get_Involved_4: "SSJ Fillout Form: Get Involved 4",
} as const;

export const MONTESSORI_CERTIFIERS_OLD_LIST_FIELDS = {
  Name: "Name",
  Abbreviation: "Abbreviation",
  SSJ_Fillout_Form__Get_Involved: "SSJ Fillout Form: Get Involved",
  SSJ_Fillout_Form__Get_Involved_2: "SSJ Fillout Form: Get Involved 2",
  SSJ_Fillout_Form__Get_Involved_3: "SSJ Fillout Form: Get Involved 3",
  SSJ_Fillout_Form__Get_Involved_4: "SSJ Fillout Form: Get Involved 4",
} as const;

export const RACE_AND_ETHNICITY_FIELDS = {
  Name: "Name",
  SSJ_Fillout_Form__Get_Involved: "SSJ Fillout Form: Get Involved",
  Educators: "Educators",
} as const;

export const BOARD_SERVICE_FIELDS = {
  Name: "Name",
  School: "School",
  Educator: "Educator",
  Community_Member_Name: "Community Member Name",
  Community_Member_Email: "Community Member Email",
  Contact_Email__from_Educator_: "Contact Email (from Educator)",
  Email: "Email",
  Start_Date: "Start Date",
  End_Date: "End Date",
  Currently_Active: "Currently Active",
  Chair: "Chair",
} as const;

export const LEAD_ROUTING_AND_TEMPLATES_FIELDS = {
  Name: "Name",
  SendGrid_Template_ID: "SendGrid Template ID",
  Language: "Language",
  Type: "Type",
  US___International: "US / International",
  Geo_type: "Geo-type",
  State: "State",
  Source: "Source",
  Growth_Lead: "Growth Lead",
  Sender: "Sender",
  cc: "cc",
} as const;

export const STATES_ALIASES_FIELDS = {
  State: "State",
  Abbreviation: "Abbreviation",
} as const;

export const MEMBERSHIP_TERMINATION_STEPS_FIELDS = {
  mem_term_step_id: "mem_term_step_id",
  School: "School",
  School_Contact_Emails__from_School_: "School Contact Emails (from School)",
  Membership_termination_letter__from_School_: "Membership termination letter (from School)",
  Termination_trigger_date: "Termination trigger date",
  Update_Airtable_fields: "Update Airtable fields",
  Deactivate_GSuite_target_date: "Deactivate GSuite target date",
  Deactivate_GSuite: "Deactivate GSuite",
  Initial_TC_condition: "Initial TC condition",
  Deactivate_TC_target_date: "Deactivate TC target date",
  Deactivate_TC: "Deactivate TC",
  Listservs: "Listservs",
  Deactivate_listservs_target_date: "Deactivate listservs target date",
  Deactivate_listservs: "Deactivate listservs",
  Initial_website_condition: "Initial website condition",
  Deactivate_website_target_date: "Deactivate website target date",
  Deactivate_website: "Deactivate website",
  Initial_QBO_condition: "Initial QBO condition",
  Deactivate_QBO_target_date: "Deactivate QBO target date",
  Deactivate_QBO: "Deactivate QBO",
  Initial_Slack_condition: "Initial Slack condition",
  Deactivate_Slack_target_date: "Deactivate Slack target date",
  Deactivate_Slack: "Deactivate Slack",
  Deactivate_wildflowerschools_org_profile: "Deactivate wildflowerschools.org profile",
  Initial_Group_Exemption_condition: "Initial Group Exemption condition",
  Deactivate_Group_Exemption_target_date: "Deactivate Group Exemption target date",
  Deactivate_Group_Exemption: "Deactivate Group Exemption",
  Initial_Gusto_condition: "Initial Gusto condition",
  Deactivate_Gusto_target_date: "Deactivate Gusto target date",
  Deactivate_Gusto: "Deactivate Gusto",
  Deactivate_wildflowerschools_org_profile_target_date: "Deactivate wildflowerschools.org profile target date",
} as const;

export const MEMBERSHIP_TERMINATION_STEPS_AND_DATES_FIELDS = {
  Step_name: "Step name",
  Day_of_process: "Day of process",
  Responsible_person_at_WF: "Responsible person at WF",
  field_with_target_date: "field with target date",
} as const;

export const COHORTS_FIELDS = {
  Cohort_Name: "Cohort Name",
  Program_Type: "Program Type",
  Start_Date: "Start Date",
  Schools: "Schools",
  Charters: "Charters",
} as const;

export const MARKETING_SOURCES_MAPPING_FIELDS = {
  recID: "recID",
  Fillout_options: "Fillout options",
  Educators_options: "Educators options",
  Educators_other: "Educators other",
} as const;

export const MARKETING_SOURCE_OPTIONS_FIELDS = {
  Marketing_Source: "Marketing Source",
  Educators: "Educators",
} as const;

export const ANNUAL_ENROLLMENT_AND_DEMOGRAPHICS_FIELDS = {
  Annual_data_key: "Annual data key",
  annual_data_id: "annual_data_id",
  Charter: "Charter",
  School: "School",
  school_id__from_School_: "school_id (from School)",
  School_Year: "School Year",
  Number_of_enrolled_students___all: "Number of enrolled students - all",
  Number_of_enrolled_students___FRL: "Number of enrolled students - FRL",
  Number_of_enrolled_students___BIPOC: "Number of enrolled students - BIPOC",
  Number_of_enrolled_students___ELL: "Number of enrolled students - ELL",
  Number_of_enrolled_students___SPED: "Number of enrolled students - SPED",
} as const;

export const CHARTER_ROLES_FIELDS = {
  Charter_role_key: "Charter role key",
  charter_role_id: "charter_role_id",
  Name: "Name",
  Charter: "Charter",
  charter_id: "charter_id",
  Charter_applications: "Charter applications",
  Role: "Role",
  Start_date: "Start date",
  End_date: "End date",
  Currently_active: "Currently active",
  Title: "Title",
  Educator_record: "Educator record",
  Current_Primary_Email_Address__from_Educator_record_: "Current Primary Email Address (from Educator record)",
  Email: "Email",
  Phone: "Phone",
  Race___Ethnicity__from_Educator_record_: "Race & Ethnicity (from Educator record)",
  Status__from_Charter_: "Status (from Charter)",
  Charter_applications_2: "Charter applications 2",
} as const;

export const CHARTER_AUTHORIZERS_AND_CONTACTS_FIELDS = {
  Charter_authorizer_key: "Charter authorizer key",
  Charter: "Charter",
  charter_id: "charter_id",
  Authorizer: "Authorizer",
  Contact: "Contact",
  Title: "Title",
  Email: "Email",
  Phone: "Phone",
  Currently_active: "Currently active",
} as const;

export const REPORTS_AND_SUBMISSIONS_FIELDS = {
  reports_id: "reports_id",
  Charter: "Charter",
  charter_id: "charter_id",
  Report_type: "Report type",
  Attachments: "Attachments",
  School_year: "School year",
} as const;

export const ASSESSMENTS_FIELDS = {
  Short_Name: "Short Name",
  Full_Name: "Full Name",
  Domain: "Domain",
  Grades: "Grades",
  Annual_Assessment_Implementations_by_School: "Annual Assessment Implementations by School",
} as const;

export const ASSESSMENT_DATA_FIELDS = {
  Assessment_Data_key: "Assessment Data key",
  assessment_data_id: "assessment_data_id",
  Charter: "Charter",
  charter_id: "charter_id",
  School: "School",
  school_id: "school_id",
  Year: "Year",
  Assessment: "Assessment",
  Other_data: "Other data",
  Number_assessed: "Number assessed",
  Number_assessed___BIPOC: "Number assessed - BIPOC",
  Number_assessed___FRL: "Number assessed - FRL",
  Number_assessed___ELL: "Number assessed - ELL",
  Number_assessed___SPED: "Number assessed - SPED",
  Met_or_exceeds___all: "Met or exceeds - all",
  Met_or_exceeds___BIPOC: "Met or exceeds - BIPOC",
  Met_or_exceeds___FRL: "Met or exceeds - FRL",
  Met_or_exceeds___ELL: "Met or exceeds - ELL",
  Met_or_exceeds___SPED: "Met or exceeds - SPED",
} as const;

export const CHARTER_APPLICATIONS_FIELDS = {
  Charter_App_key: "Charter App key",
  charter_app_id: "charter_app_id",
  Charter: "Charter",
  charter_id: "charter_id",
  Short_Name: "Short Name",
  Full_Name: "Full Name",
  Target_open: "Target open",
  Target_community__from_Charter_: "Target community (from Charter)",
  Support_timeline: "Support timeline",
  Landscape_analysis__from_Charter_: "Landscape analysis (from Charter)",
  Cohorts__from_Charter_: "Cohorts (from Charter)",
  Application_window: "Application window",
  Key_dates: "Key dates",
  Milestones: "Milestones",
  Authorizer: "Authorizer",
  __of_students: "# of students",
  Beginning_age: "Beginning age",
  Ending_age: "Ending age",
  Grades: "Grades",
  Letter_of_Intent_req_d: "Letter of Intent req'd",
  Letter_of_Intent_deadline: "Letter of Intent deadline",
  LOI_submitted: "LOI submitted",
  LOI: "LOI",
  Expected_decision: "Expected decision",
  Likelihood_of_authorization: "Likelihood of authorization",
  Likelihood_of_opening_on_time: "Likelihood of opening on time",
  Charter_app_roles_ID_d: "Charter app roles ID'd",
  Charter_app_project_mgmt_plan_complete: "Charter app project mgmt plan complete",
  Logic_model_complete: "Logic model complete",
  Community_engagement_plan_launched: "Community engagement plan launched",
  Nonprofit_status: "Nonprofit status",
  App_submission_deadline: "App submission deadline",
  App_submitted: "App submitted",
  Joint_kickoff_meeting: "Joint kickoff meeting",
  Joint_kickoff_meeting_complete: "Joint kickoff meeting complete",
  Internal_WF_support_launch_meeting: "Internal WF support launch meeting",
  Charter_app_walkthrough: "Charter app walkthrough",
  Capacity_interview_training_complete: "Capacity interview training complete",
  Capacity_Interview_Projected_Date: "Capacity Interview Projected Date",
  Capacity_Interview_Complete: "Capacity Interview Complete",
  Authorizer_decision_expected_date: "Authorizer decision expected date",
  Authorizer_decision_rec_d: "Authorizer decision rec'd",
  Authorizer_decision: "Authorizer decision",
  Charter_Design_Advice_Session_Complete: "Charter Design Advice Session Complete",
  Board_membership_agreement_signed: "Board membership agreement signed",
  TL_membership_agreement_signed: "TL membership agreement signed",
  Charter_design: "Charter design",
  Budget_planning_exercises: "Budget planning exercises",
  Final_budget: "Final budget",
  Most_recent_application: "Most recent application",
} as const;

export const AGES_GRADES_FIELDS = {
  Name: "Name",
  Charter_applications: "Charter applications",
  Charter_applications_2: "Charter applications 2",
} as const;

export const SUPABASE_JOIN_990_WITH_SCHOOL_FIELDS = {
  id: "id",
  _990_year: "990_year",
  short_name: "short_name",
} as const;

export const EMAIL_ADDRESSES_FIELDS = {
  Email_Address: "Email Address",
  Email_Type: "Email Type",
  Current_Primary_Email: "Current Primary Email",
  Active_: "Active?",
  Educator: "Educator",
  educator_id: "educator_id",
  email_address_id: "email_address_id",
} as const;

export const PARTNERS_COPY_FIELDS = {
  email_or_name: "email or name",
  Record_ID: "Record ID",
  Synced_Record_ID: "Synced Record ID",
  Email: "Email",
  Currently_active: "Currently active",
  Roles: "Roles",
  Photo: "Photo",
  Phone: "Phone",
  Home_address: "Home address",
  DOB: "DOB",
  TLs: "TLs",
  Educator_Record_IDs: "Educator Record IDs",
  Guide_assignments: "Guide assignments",
  Guided_School_Record_ID: "Guided School Record ID",
  Start_Date__from_Stints_: "Start Date (from Stints)",
  End_Date__from_Stints_: "End Date (from Stints)",
  Stint_type__from_Stints_: "Stint type (from Stints)",
  Active_stint: "Active stint",
  _2016_2017__from_Stints_: "2016-2017 (from Stints)",
  _2017_2018__from_Stints_: "2017-2018 (from Stints)",
  _2018_2019__from_Stints_: "2018-2019 (from Stints)",
  _2019_2020__from_Stints_: "2019-2020 (from Stints)",
  Educator_notes: "Educator notes",
  School_notes: "School notes",
  Website_bio: "Website bio",
  Slack_handle: "Slack handle",
  Papyrs_profile: "Papyrs profile",
  Copper_userID: "Copper userID",
  Public_website_active: "Public website active",
  Holaspirit_member_ID: "Holaspirit member ID",
  Image_URL: "Image URL",
  Name: "Name",
  Short_name: "Short name",
  Educator_Log: "Educator Log",
  Personal_Email: "Personal Email",
  Action_steps: "Action steps",
  SSJ_Process_Details: "SSJ Process Details",
  Schools: "Schools",
  Lead_Routing: "Lead Routing",
  Email_templates: "Email templates",
  Grants_5: "Grants 5",
  Membership_termination_steps_and_dates: "Membership termination steps and dates",
  Grants_Advice_Log: "Grants Advice Log",
  Key_Value_Pairs: "Key Value Pairs",
  Roadmap: "Roadmap",
  Roadmap_2: "Roadmap 2",
} as const;

// Generated Table Interfaces

// Schools table
export interface School extends BaseRecord {
  Name?: string;
  Ages_served?: ('Parent-child' | 'Infants' | 'Toddlers' | 'Primary' | 'Lower Elementary' | 'Upper Elementary' | 'Adolescent / JH' | 'High School')[];
  Race___Ethnicity__from_Educator___via_Educators_x_Schools_?: any;
  Governance_Model?: 'Independent' | 'District' | 'Charter' | 'Exploring Charter' | 'Community Partnership';
  School_Status?: 'Emerging' | 'Open' | 'Paused' | 'Closing' | 'Permanently Closed' | 'Disaffiliating' | 'Disaffiliated' | 'Placeholder';
  Current_Mailing_Address?: any;
  Prior_Names?: string;
  Primary_Contacts?: string[];
  Current_TLs?: any;
  Opened?: string;
  Logo_URL?: string;
  Logo?: Array<{ id: string; filename: string; url: string; type: string; size: number }>;
  Charter?: string[];
  School_calendar?: '9-month' | '10-month' | 'Year-round';
  School_schedule?: ('Before Care;Morning Care;Afternoon Care;After Care' | 'Before Care' | 'Morning Care' | 'Afternoon Care' | 'After Care')[];
  Left_Network_Date?: string;
  Left_Network_Reason?: ('Program absorbed' | 'Disaffiliated' | 'Role Alignment' | 'WF Alignment' | 'Organizational Sustainability' | 'Partnership' | 'No TL Identified' | 'No Montessori Training' | 'Personal Reasons' | 'Facility')[];
  Membership_Agreement_date?: string;
  Signed_Membership_Agreement?: Array<{ id: string; filename: string; url: string; type: string; size: number }>;
  Email_Domain?: string;
  School_Phone?: string;
  Facebook?: string;
  Instagram?: string;
  Website?: string;
  Locations?: string[];
  TC_school_ID?: string;
  Educators_x_Schools?: string[];
  Planning_album?: Array<{ id: string; filename: string; url: string; type: string; size: number }>;
  Guide_assignments?: string[];
  Business_Insurance?: 'Alliant' | 'other' | 'other (in process w/ Alliant)';
  QBO?: 'internal license - active' | 'internal license - closed out' | 'external license ' | 'other accounting software' | 'Not WF - Unknown software';
  Gusto?: 'yes (under WF)' | 'no' | 'yes (independent)' | 'yes' | 'no- local system';
  TC_Recordkeeping?: 'yes (under WF)';
  TC_Admissions?: 'yes' | 'v1';
  Admissions_System?: 'TC' | 'Other' | 'School Cues';
  Transparent_Classroom?: 'Internal license' | 'External license' | 'Other record keeping system' | 'Internal License - removed';
  Budget_Utility?: 'WF v4';
  Website_tool?: 'external platform' | 'wordpress original' | 'wordpress v1' | 'wordpress v2' | 'Wix v1' | 'Wix v2';
  Google_Voice?: 'internal license';
  Nonprofit_status?: 'group exemption' | 'independent' | 'for profit' | 'Partnership' | 'Under Charter 501c3';
  Logo_designer?: 'internal design' | 'external design';
  Domain_Name?: 'internal' | 'external';
  On_national_website?: 'added' | 'ready to add ' | 'ready to remove' | 'removed';
  Membership_Status?: 'Member school' | 'Affiliated non-member' | 'Membership terminated';
  School_Email?: string;
  Institutional_partner?: string;
  Trademark_filed?: 'Yes';
  Name_Selection_Proposal?: string;
  Grants__WF_?: string[];
  School_notes?: string[];
  Number_of_classrooms?: number;
  Created?: string;
  Created_By?: { id: string; name: string; email: string };
  Last_Modified?: string;
  Last_Modified_By?: { id: string; name: string; email: string };
  Pod?: 'Mass: Massbridge' | 'Mass: Broadway' | 'Mass: San Lorenzo' | 'Mid-Atlantic: Philadelphia' | 'Multistate 1' | 'CA Pod' | 'PR Pod' | 'Under discussion' | 'Charter Pod' | 'OceanBay Pod' | 'MidAtlantic Pod' | 'Fern Pod ' | 'CO Charter Pod';
  Short_Name?: string;
  Family_survey___schools?: string[];
  Family_survey_non_TC_data_2021_22?: string[];
  Enrollment_at_Full_Capacity?: number;
  school_id?: string | number | boolean;
  Google_Workspace_Org_Unit_Path?: string;
  Loan__from_Loans___Issue_Method_?: any;
  Family_Survey?: string[];
  __of_Students?: any;
  __of_forms_sent?: any;
  Low_Income?: any;
  Medium_Income?: any;
  FRL?: any;
  __of_Asian_American_students?: any;
  __of_African_American_students?: any;
  global_majority?: any;
  Pacific_Islander__from_Family_Survey_?: any;
  Native_American__from_Family_Survey_?: any;
  White__from_Family_Survey_?: any;
  Middle_Eastern?: any;
  Latinx__from_Family_Survey_?: any;
  High_Income__from_Family_Survey_?: any;
  Flexible_Tuition_Model?: boolean;
  Loans?: string[];
  EIN?: string;
  Guide_email?: any;
  Primary_Contact_Email?: any;
  Agreement_Version_?: 'Affiliation Agreement' | 'Network Membership Agreement ';
  About?: string;
  About_Spanish?: string;
  Hero_Image_Url?: string;
  Hero_Image_2_Url?: string;
  Narrative?: string;
  Platform_School?: string[];
  Budget_Link?: string;
  Bookkeeper___Accountant?: 'Staci Simon' | 'Unknown' | 'Josh\'s dad (Mr. Shanklin)';
  Active_Pod_Member?: 'Yes, regular attendee/role holder' | 'Somewhat, does not make all meetings' | 'Does not attend' | 'Not in a pod';
  Risk_Factors?: ('1 TL' | 'TL is only admin, not teacher' | 'Weak board' | 'Financially unstable' | 'Compliance concern (990, licensor, authorizor)' | 'Low enrollment' | 'Not engaged' | 'No risk factors!')[];
  Watchlist?: ('Multiple Risk Factors' | 'In Current Crisis' | 'Thinking about leaving the network' | 'In Transition' | '1st Year')[];
  Program_Focus?: ('Inclusion ' | 'Lab School' | 'Nature Based' | 'Dual Language' | 'Conversion into WF')[];
  Loan_payments?: string[];
  Loan_Report_Name?: string;
  _990s?: string[];
  Current_FY_end?: '6/30' | '7/31' | '8/31' | '12/31';
  Incorporation_Date?: string;
  GuideStar_Listing_Requested_?: boolean;
  Group_exemption_status?: 'Applying' | 'Active' | 'Issues' | 'Withdrawn' | 'Other - Not part of exemption';
  Date_received_group_exemption?: string;
  Legal_Name?: string;
  School_governance_documents?: string[];
  Nondiscrimination_Policy_on_Application?: boolean;
  Nondiscrimination_Policy_on_Website?: boolean;
  Is_there_a_2022_990_?: number;
  _2022_990_present_?: string | number | boolean;
  Date_withdrawn_from_Group_Exemption?: string;
  School_Contact_Emails?: any;
  _990_attachment?: any;
  Founding_Documents?: any;
  Lease?: any;
  Lease_End_Date?: any;
  Public_funding_sources?: string[];
  Action_steps?: string[];
  Membership_fee_records?: string;
  Cumulative_membership_fees_paid?: any;
  Cumulative_membership_fees_outstanding?: any;
  Current_year_fee?: any;
  QBO_School_Codes?: string[];
  Visioning_album?: Array<{ id: string; filename: string; url: string; type: string; size: number }>;
  Visioning_album_complete?: boolean;
  Building4Good_Firm___Attorney?: string;
  SSJ___Building4Good_Status?: 'Matched' | 'Requested' | 'Upcoming';
  SSJ___SSJ_Tool?: 'Google Slides ' | 'My Wildflower - Sensible Default' | 'Charter Slides' | 'Platform Pilot ';
  SSJ___Proj_Open_School_Year?: string | number | boolean;
  SSJ___Date_shared_with_N4G__from_SSJ_Process_Details_?: string;
  SSJ___Proj_Open_School_Year___Backup?: string;
  SSJ___Gap_in_Funding?: string;
  SSJ___Amount_raised?: string;
  SSJ___Loan_approved_amt?: string;
  SSJ___Loan_eligibility?: string;
  SSJ___Total_Startup_Funding_Needed?: string;
  SSJ___Does_the_school_have_a_viable_pathway_to_funding_?: 'No, startup funding unlikely' | 'Yes, full funding likely' | 'Maybe, prospects identified but not secured';
  SSJ___Fundraising_narrative?: string;
  SSJ___Advice_Givers__Partners_?: string[];
  SSJ___Advice_Givers__TLs_?: string[];
  SSJ___Is_the_school_planning_to_apply_for_internal_Wildflower_funding_?: 'No' | 'Yes, loan' | 'Yes, loan; Yes, grant' | 'Yes, grant' | 'Yes, grant; Yes, loan';
  SSJ___Is_the_budget_at_a_stage_that_will_allow_the_ETL_s__to_take_their_next_steps_?: 'Yes' | 'Unsure' | 'No';
  SSJ___Is_the_team_on_track_for_their_enrollment_goals_?: 'Yes (tuition published, plan enacted, community engagement full swing)' | 'No (process unclear/unpublished, limited/no family engagement)' | 'Maybe (process is ready, no prospective students)';
  SSJ___Cohort_Status?: 'Switched Ops Guide Supports' | 'Returning for Later Cohort' | 'Transitioned to Charter Application Supports' | 'Left Cohort';
  SSJ___Facility?: 'Signed lease' | 'Identified prospect(s)' | 'Purchased building' | 'Unsure' | 'Searching, intending to buy' | 'Searching, intending to rent';
  SSJ___Board_development?: 'No board' | 'Board is forming, 1-2 mtgs' | 'Board is developed and engaged, 3+ mtgs';
  SSJ___Has_the_ETL_identified_a_partner_?: 'Partnership established' | 'No partner' | 'Partnership In development ';
  SSJ___Name_Reserved?: 'reserved' | 'unknown';
  SSJ___What_is_the_next_big_decision_or_action_this_school_is_working_on_?: string;
  SSJ___Readiness_to_Open_Rating?: 'High' | 'Low' | 'Medium';
  SSJ_Stage?: 'Visioning' | 'Planning' | 'Startup' | 'Complete' | 'Year 1';
  Entered_Startup_Date?: string;
  Entered_Planning_Date?: string;
  Entered_Visioning_Date?: string;
  SSJ___Original_Projected_Open_Date?: string;
  SSJ___Target_City?: string;
  SSJ___Ops_Guide_Support_Track?: ('1:1 Support, 2024-2025 Blooms Cohort' | '2024-2025 Blooms Cohort, 1:1 Support' | '1:1 Support' | '2024-2025 Blooms Cohort' | '2025 January Blooms Cohort')[];
  SSJ___Projected_Open?: string;
  Current_TLs_first_names?: any;
  Count_of_Active_Mailing_Addresses?: number;
  Count_of_Active_Physical_Addresses?: number;
  Current_Physical_Address?: any;
  Errors?: ('No mailing address' | 'More than one active mailing address' | 'More than one active physical address' | 'No active TLs' | 'Multiple active guides' | 'Emerging with no active guide' | 'Duplicate')[];
  Bill_com_account?: string;
  Current_Physical_Address___City?: any;
  Current_Physical_Address___State?: any;
  SSJ___Target_State?: string;
  Emails?: string[];
  Board_Service?: string[];
  Last_Modified_Trigger?: string | number | boolean;
  Dedupe_school_with?: string;
  Create_stint_for_existing_educator_at_school?: string | number | boolean;
  Open_grants_link?: string | number | boolean;
  Open_school_link?: string | number | boolean;
  Open_school_interface?: any;
  Open_grants_interface?: any;
  Open_S_S__details?: string | number | boolean;
  Open_SSJ_details?: string | number | boolean;
  CountofActiveGuides?: number;
  Meetings?: string[];
  Membership_termination_steps?: string[];
  Membership_termination_letter?: Array<{ id: string; filename: string; url: string; type: string; size: number }>;
  Create_termination_record?: string | number | boolean;
  Fill_in_left_network_details?: string | number | boolean;
  Cohorts?: string[];
  Automation_notes?: string;
  Membership_fee_recs?: string[];
  Legal_structure?: 'Independent organization' | 'Part of a charter' | 'Part of another organization' | 'Multiple WF schools in a single entity';
  Charter_assessments?: string[];
  Annual_enrollment_and_demographics?: string[];
  Active_guides?: any;
  Create_guide_assignment?: string | number | boolean;
  Guide_assignment?: any;
  Current_TLs_discovery_status?: any;
  Primary_Contact_ID?: any;
  location_id?: any;
  educatorsXschools_id?: any;
  guide_assignment_id?: any;
  loan_id?: any;
  grant_id?: any;
  school_note_id?: any;
  family_survey_id?: any;
  nine_ninety_id?: any;
  action_step_id?: any;
  Stage_Status?: string | number | boolean;
  Charter_Short_Name?: any;
  Current_Guides?: any;
  activeLatitude?: any;
  activeLongitude?: any;
  Logo___main_square?: Array<{ id: string; filename: string; url: string; type: string; size: number }>;
  Logo___flower_only?: Array<{ id: string; filename: string; url: string; type: string; size: number }>;
  Logo___main_rectangle?: Array<{ id: string; filename: string; url: string; type: string; size: number }>;
  Educators?: string;
  charter_id?: any;
  Partners_copy?: string[];
  Email_at_School__from_Educators_x_Schools_?: any;
  Educators_x_Schools_2?: string[];
  Archived?: boolean;
  Founders_List?: string[];
  Full_Name__from_Founders_List_?: any;
}

// Charters table
export interface Charter extends BaseRecord {
  Charter_key?: string | number | boolean;
  charter_id?: string | number | boolean;
  Short_Name?: string;
  Full_name?: string;
  Initial_target_community?: string;
  Initial_target_ages_link?: string[];
  Initial_target_ages?: any;
  Landscape_analysis?: Array<{ id: string; filename: string; url: string; type: string; size: number }>;
  Application?: Array<{ id: string; filename: string; url: string; type: string; size: number }>;
  Non_TL_roles?: string[];
  Name__from_Non_TL_roles_?: any;
  Role__from_Non_TL_roles_?: any;
  Currently_active__from_Non_TL_roles_?: any;
  Projected_open?: string;
  Cohorts?: string[];
  Status?: 'Applying' | 'Application Submitted - Waiting ' | 'Approved -  Year 0' | 'Open' | 'Paused' | 'Awaiting start of cohort';
  Schools?: string[];
  Record_ID__from_Schools_?: any;
  Group_Exemption_Status?: 'Active' | 'Withdrawn' | 'Issues';
  Date_received_group_exemption?: string;
  _990s?: string[];
  _990_Record_ID__from_990s_?: any;
  EIN?: string;
  Incorporation_Date?: string;
  Current_FY_end?: '6/30' | '12/31' | '8/31' | '';
  School_governance_documents?: string[];
  Doc_ID__from_School_governance_documents_?: any;
  Nondiscrimination_Policy_on_Website?: boolean;
  School_provided_with_1023_recordkeeping_requirements?: boolean;
  GuideStar_Listing_Requested_?: boolean;
  Membership_fee_school_x_year?: string[];
  recID__from_Membership_fee_school_x_year_?: any;
  Annual_enrollment_and_demographics?: string[];
  Locations?: string[];
  Location_ID__from_Locations_?: any;
  Partnership_with_WF_started?: string;
  Authorized?: string;
  First_site_opened?: string;
  Website?: string;
  School_reports?: string[];
  RecID__from_School_reports_?: any;
  Charter_assessments?: string[];
  charter_assessment_id?: any;
  Charter_authorizers_and_contacts?: string[];
  recId__from_Charter_authorizers_and_contacts_?: any;
  Charter_applications?: string[];
  recID__from_Charter_applications_?: any;
  Nonprofit_status?: 'Intend to apply direct - not yet applied' | 'Awaiting IRS determination for direct 501c3' | 'Approved directly by IRS' | 'Intend to use group exemption - not yet approved' | 'Part of group exemption';
  Charter_level_membership_agreement?: Array<{ id: string; filename: string; url: string; type: string; size: number }>;
  Charter_level_membership_agreement_signed?: string;
  Support_timeline?: any;
  Target_open__from_Charter_applications_?: any;
  Contact_Email__from_External_Initiator_s__?: any;
  Current_TLs__from_Schools_?: any;
  Linked_Schools?: any;
  Total_Emerging_Schools__from_Schools_?: any;
  Total_Open_Schools__from_Schools_?: any;
  TL_discovery_status?: any;
  Membership_status_of_schools?: any;
}

// Locations table
export interface Location extends BaseRecord {
  Location_Key?: string | number | boolean;
  Inactive_without_end_date__or_active_with_end_date?: string | number | boolean;
  location_id?: string | number | boolean;
  School?: string[];
  school_id?: any;
  Charter?: string[];
  charter_id?: any;
  Current_mailing_address_?: boolean;
  Current_physical_address_?: boolean;
  Start_of_time_at_location?: string;
  End_of_time_at_location?: string;
  Co_Location_Type?: 'Church' | 'Affordable Housing' | 'Non Profit / Service Provider' | 'Community Center' | 'Shelter / Transitional Housing ';
  Co_Location_Partner_?: string;
  Location_type?: 'Mailing address - no physical school' | 'School address and mailing address' | 'Physical address - does not receive mail';
  Address?: string;
  Street?: string;
  City?: string;
  State?: string;
  Country?: string;
  Postal_code?: string;
  Neighborhood?: string;
  Square_feet?: number;
  Max_Students_Licensed_For?: number;
  Latitude?: number;
  Longitude?: number;
  Created?: string;
  Last_Modified?: string;
  Geocode_Automation_Last_Run_At?: string;
  School_Status__from_School_?: any;
  Census_Tract?: string;
  Qualified_Low_Income_Census_Tract?: 'YES' | 'NO' | 'Unknown';
  Lease?: Array<{ id: string; filename: string; url: string; type: string; size: number }>;
  Lease_End_Date?: string;
  Time_Zone?: 'Eastern Time (US & Canada)' | 'Central Time (US & Canada)' | 'Mountain Time (US & Canada)' | 'Pacific Time (US & Canada)' | 'Atlantic Time';
  Short_Name?: any;
}

// Educators table
export interface Educator extends BaseRecord {
  Full_Name?: string | number | boolean;
  Discovery_status?: 'Complete' | 'In process' | 'Paused';
  Race___Ethnicity?: ('White' | 'Asian' | 'Black' | 'Latino' | 'Native' | 'MENA' | 'Pacific Islander' | 'Other')[];
  Assigned_Partner?: string[];
  Certification_Levels__from_Montessori_Certifications_?: any;
  Certifier__from_Montessori_Certifications_?: any;
  educator_id?: string | number | boolean;
  First_Name?: string;
  Current_Role?: any;
  Last_Name?: string;
  Newsletter_and_Group_Subscriptions?: string[];
  survey___2022_Wildflower_Network_Survey?: boolean;
  Montessori_Certified?: any;
  Pronouns?: 'she/her/hers' | 'he/him/his' | 'other' | 'they/them/theirs';
  Other_languages?: ('English' | 'Spanish - EspañolSpanish' | 'French - Français' | 'Spanish - Español' | 'Urdu - اُردُو' | 'Japanese - 日本語' | 'Mandarin - 中文' | 'Arabic - العَرَبِيَّة' | 'Hindi - हिन्दी' | 'HungarianHungarian' | 'Haitian Creole - Kreyol Ayisyen' | 'Gujarati - ગુજરાતી' | 'FujianFujian' | 'Russian - русский язык' | 'Korean - 한국어' | 'Cantonese - Gwóngdūng wá' | 'Tai-Kadai (including Thai and Lao) - ไทย / ພາສາລາວ' | 'OtherHungarian' | 'Portuguese - Português' | 'Tami - தமிழ்' | 'Burmese - မြန်မာစာ' | 'OtherYoruba')[];
  Assigned_Partner_Email?: any;
  Middle_Name?: string;
  Educators_at_Schools?: string[];
  All_Schools?: any;
  Currently_Active_School?: any;
  Primary_contact_for?: string[];
  Active_School_Record_ID?: any;
  Home_Address?: string;
  Source?: string[];
  Educator_notes?: string[];
  Source___other?: string;
  Active_Holaspirit?: boolean;
  Holaspirit_memberID?: string;
  TC_User_ID?: string;
  Educational_Attainment?: 'Graduated high school or GED' | 'Completed graduate school' | 'Graduated college' | 'Some college' | 'Some graduate school' | 'Did not graduate high school';
  Montessori_lead_guide_trainings?: ('AMI Infants and Toddlers' | 'AMS (0-3)' | 'AMI Primary' | 'AMS Early childhood' | 'AMI Elementary' | 'AMS Lower elementary' | 'AMS Upper elementary' | 'AMI Adolescent' | 'AMS Lower secondary' | 'AMS Upper secondary' | 'Yes - type TBD')[];
  Also_a_partner?: boolean;
  Nickname?: string;
  Primary_Language?: ('English' | 'French - Français' | 'Spanish - Español' | 'Urdu - اُردُو' | 'Japanese - 日本語' | 'Mandarin - 中文' | 'Arabic - العَرَبِيَّة' | 'Hindi - हिन्दी' | 'Hungarian - Hungarian' | 'Haitian Creole - Kreyol Ayisyen' | 'Gujarati - ગુજરાતી' | 'Fujian- Fujian' | 'Russian - русский язык' | 'Korean - 한국어' | 'Cantonese - Gwóngdūng wá' | 'Tai-Kadai (including Thai and Lao) - ไทย / ພາສາລາວ' | 'Other - Hungarian' | 'Portuguese - Português' | 'Tami - தமிழ்' | 'Burmese - မြန်မာစာ' | 'Other- Yoruba' | 'A not-listed or more specific language')[];
  Race___Ethnicity___Other?: string;
  Household_Income?: 'Middle Income' | 'Lower Income' | 'Upper Income' | 'Prefer not to respond';
  Income_Background?: 'Middle Income' | 'Lower Income' | 'Upper Income';
  Gender?: 'Female' | 'Male' | 'Other' | 'Gender Non-Conforming' | 'Female/Woman' | 'Male/Man' | 'A not-listed or more specific gender identity' | 'Prefer not to respond';
  Gender___Other?: string;
  LGBTQIA?: 'TRUE' | 'FALSE';
  Pronouns___Other?: string;
  Notes__from_Educator_notes_?: any;
  Last_Modified?: string;
  Created?: string;
  School_Statuses?: any;
  Active_School_Affiliation_Status?: any;
  Events_attended?: string[];
  Montessori_Certifications?: string[];
  Training_Grants?: string[];
  Platform_Educators___Partners?: string[];
  Onboarding_Experience?: 'Standard SSJ' | 'Onboarded by School Supports' | 'Other';
  On_school_board?: string;
  Individual_Type?: 'Educator' | 'Community Member';
  School_Address?: any;
  Created_By?: { id: string; name: string; email: string };
  Primary_phone?: string;
  Secondary_phone?: string;
  Open_educator_interface?: any;
  emails?: string[];
  Startup_Stage_for_Active_School?: any;
  Ever_a_TL_in_an_open_school?: any;
  Currently_Active_at_a_School_?: any;
  Schools?: string[];
  SSJ_Fillout_Forms?: string[];
  First_contact___WF_School_employment_status?: 'Never employed by a Wildflower school, Never employed by a Wildflower school' | 'Never employed by a Wildflower school' | 'Active Teacher Leader' | 'Active School Staff' | 'Active School Staff, Active School Staff' | 'Not currently working at a Wildflower school - former TL' | 'Not currently working at a Wildflower school - former school staff';
  Contact_Form_Details__from_SSJ_data_on_educators_?: string;
  First_contact___Notes_on_pre_Wildflower_employment?: string;
  SSJ_Typeforms__Start_a_School__from_SSJ_data_on_educators_?: string[];
  Target_city?: string;
  First_contact___Initial_Interest_in_Governance_Model?: ('Charter' | 'Independent')[];
  First_contact___Willingness_to_relocate?: boolean;
  First_contact___initial_interest_in_ages?: string[];
  First_contact___initial_interests?: string;
  Target_state?: string;
  Target___international?: string;
  Tags?: ('Wildflower parent' | 'TFA alum')[];
  Exclude_from_email_logging?: boolean;
  Board_Service?: string[];
  Last_Modified_Trigger?: string | number | boolean;
  Dedupe_with?: string;
  Message__from_SSJ_Fillout_Forms_?: any;
  Entry_Date__from_SSJ_Fillout_Forms_?: any;
  Count_of_Get_Involved_Forms?: number;
  Errors?: ('Likely duplicate')[];
  Create_stint_for_existing_school?: string | number | boolean;
  Self_reflection?: Array<{ id: string; filename: string; url: string; type: string; size: number }>;
  Target_geo_combined?: string | number | boolean;
  Meetings?: string[];
  Cohorts?: any;
  Assigned_Partner_Override__from_SSJ_Fillout_Forms_?: any;
  Automations?: string;
  Ops_Guide_Meeting_Preference_Time?: ('During the day' | 'Evenings' | 'Weekends')[];
  Ops_Guide_Specifics_Checklist?: ('No partner' | 'Accelerated Timeline' | 'Career change' | 'No Montessori training' | 'Been in pipeline a long time' | 'Alignment / model questions' | 'Conversion school' | 'BIPOC led' | 'Team seems more vision-oriented (needs structure)' | 'Interested in charter' | 'Reach out to growth leads for more details')[];
  Ops_Guide_Request_Pertinent_Info?: string;
  Ops_Guide_Support_Type_Needed?: ('Visioning Cohort' | 'One on one ops guiding support' | 'Charter ops guide support for existing/authorized charters with WF')[];
  Ops_Guide_Any_fundraising_opportunities_?: string;
  Race_and_Ethnicity?: string[];
  Charter_admin_roles?: string[];
  educatorsXschools_id?: any;
  educator_notes_id?: any;
  montessori_cert_id?: any;
  email_id?: any;
  ssj_old_start_a_school_id?: any;
  ssj_fillout_form_id?: any;
  meeting_id?: any;
  Email_Addresses?: string[];
  Current_Primary_Email_Address?: any;
  Pronunciation?: string;
  Inactive_Flag?: string | number | boolean;
  CountofLinkedSchools?: number;
  FormerlyActive?: string | number | boolean;
  Most_recent_fillout_form?: any;
  Status_for_Active_School?: any;
  Stage_Status_for_Active_School?: any;
  Assigned_Partner_Short_Name?: any;
  Partners_copy?: string[];
  Archived?: boolean;
  Schools_2?: string[];
  Kanban?: string | number | boolean;
  One_on_one_status?: any;
  Email_sent_by_initial_outreacher?: any;
  Routed_to?: any;
  Current_Role_School_for_UI?: string | number | boolean;
}

// Educators x Schools table
export interface EducatorSchoolAssociation extends BaseRecord {
  edXschool_key?: string | number | boolean;
  School_Name?: any;
  Educator_Full_Name?: any;
  Race___Ethnicity__from_Educator_?: any;
  Roles?: ('TL' | 'ETL' | 'Classroom Staff' | 'Fellow' | 'Other')[];
  Ages_served?: any;
  SSJ_Stage?: any;
  Educator?: string[];
  Email_at_School?: string;
  School_Address?: any;
  School?: string[];
  Loan_Fund_?: boolean;
  _21_22_Completed_Demographic_Info_?: boolean;
  School_Status?: any;
  Currently_Active?: boolean;
  Opened__from_School_?: any;
  Start_Date?: string;
  End_Date?: string;
  Income_background?: any;
  Gender__from_socio_economic_background_?: any;
  Primary_Language__from_languages___socio_economic_background_?: any;
  LGBTQIA__from_Socio_economic_Background___from_Educator_?: any;
  Montessori_Certifications?: any;
  Montessori_Certified_?: any;
  educatorsXschools_id?: string | number | boolean;
  educator_id?: any;
  school_id?: any;
  TL_Gift_2022?: boolean;
  Membership_Status?: any;
  Loan__from_Loans___Issue_Method___from_School_?: any;
  Governance_Model__from_School_?: any;
  Charter__from_School_?: any;
  On_Connected?: boolean;
  On_Slack?: 'Active' | 'Removed';
  On_Teacher_Leader_Google_Group?: 'Active' | 'Removed';
  Platform_Educators_x_Schools?: string[];
  On_Wildflower_Directory?: 'Active' | 'Removed';
  Created?: string;
  Entered_Visioning__from_School_?: any;
  Membership_Agreement_date__from_School_?: any;
  Invited_to_2024_Refresher?: boolean;
  Email_Status?: 'Active' | 'Suspended';
  Who_initiated_E_TL_removal_?: string;
  On_National_Website?: 'Added' | 'Removed';
  GSuite_Roles?: 'School Admin - School Orgs';
  Loans?: string[];
  Entered_Startup?: any;
  Entered_Planning?: any;
  School_Short_Name?: any;
  First_Name__from_Educator_?: any;
  Create_educator_record?: any;
  Open_school_interface?: any;
  Open_TL_interface?: any;
  School_Cohort?: any;
  TL_discovery_status?: any;
  Stage_Status?: any;
  charter_id?: any;
  Signed_TL_Acknowledgement___Commitment_to_Membership?: boolean;
  Montessori_Cert_Levels?: string[];
  Montessori_Certs__from_Montessori_Cert_Levels_?: any;
  Schools?: string[];
  SSJ___Target_State__from_Schools_?: any;
  SSJ___Projected_Open__from_Schools_?: any;
  SSJ___Projected_Open__from_School_?: any;
  Current_Physical_Address___State__from_School_?: any;
  SSJ___Target_State__from_School_?: any;
  Current_Physical_Address___State__from_School__2?: any;
}

// Grants table
export interface Grants extends BaseRecord {
  Grant_Key?: string | number | boolean;
  School?: string[];
  school_id?: any;
  School_Short_Name?: any;
  Recipient_name_from_QBO?: string;
  TLs_at_time_of_grant?: string;
  Legal_Name_at_time_of_grant?: string;
  Mailing_address_at_time_of_grant?: string;
  TL_emails_at_time_of_grant?: string;
  EIN_at_time_of_grant?: string;
  Nonprofit_status_at_time_of_grant?: string;
  Membership_status_at_time_of_grant?: string;
  Ready_to_accept_grant__501c3___EIN_?: string | number | boolean;
  Have_data_to_issue_grant_letter?: string | number | boolean;
  Bill_com?: any;
  GuideEntrepreneur_Short_Name?: any;
  School_Grant_Name?: string;
  Grant_Status?: 'Issued' | 'Planned' | 'Did not receive' | '?' | 'Received' | 'X' | 'is';
  Amount?: number;
  Issue_Date?: string;
  Funding_Source?: 'Sep' | 'TWF - MN / Walton' | 'TWF - PR' | 'TWF - Walton' | 'TWF - Cambridge' | 'RWJF' | 'TWF - No Cal - advance' | 'TWF - Cambridge - advance' | 'TWF - Cambridge ' | 'TWF - MN' | 'Walton' | 'TWF - National' | 'TWF - No Ma' | 'Stranahan' | 'Nash' | 'TWF - No Cal - SSF' | 'TWF - CO - Constellation' | 'TWF - MN - PELSB' | 'TWF - NJ - Overdeck' | 'TWF - Mid-Atl' | 'VELA' | 'Individual Donor' | 'Passthrough' | 'COVID' | 'Seed Fund' | 'Scholler' | 'DEED' | 'DC' | 'Flamboyan Foundation';
  Issued_by?: string[];
  Issued_by_Short_Name?: any;
  Label?: 'Sep' | 'Betsy Symanietz' | 'Sara Hernandez' | 'Daniela Vasan' | 'Alia Perra' | 'Rachel Kelley-Cohen' | 'Erika McDowell' | 'Sunny Greenberg' | 'Erica Cantoni';
  Accounting_Notes?: 'OK' | '?' | 'IN QBO';
  QBO__?: string;
  Notes?: string;
  Funding_Hub?: string;
  Text_for_ledger_entry?: string;
  Funding_purpose__for_grant_agreement_?: string;
  Funding_period__for_grant_agreement_?: string;
  Proof_of_501_c_3_status_at_time_of_grant?: Array<{ id: string; filename: string; url: string; type: string; size: number }>;
  Initiate_grant_process?: any;
  Automation_step_trigger?: 'Cannot proceed without a grant amount' | 'Request prelim advice for $3k+' | 'Wait for prelim advice' | 'Pause at prelim advice' | 'Request full advice' | 'Wait for full advice' | 'Pause at full advice' | 'Objections' | 'Proceed' | 'Waiting for pre-reqs before proceeding' | 'Processing' | 'Complete';
  Prelim_advice_request_time?: string;
  Full_advice_request_time?: string;
  Advice_window__1_week__closed?: string | number | boolean;
  Unsigned_Grant_Agreement?: Array<{ id: string; filename: string; url: string; type: string; size: number }>;
  Signed_Grant_Agreement?: Array<{ id: string; filename: string; url: string; type: string; size: number }>;
  Open_grant?: any;
  Grants_Advice_Log?: string[];
  Prelim_Advice_Yeses?: number;
  Prelim_Advice_Pauses?: number;
  Full_Advice_Yeses?: number;
  Full_Advice_Open_Questions?: number;
  Full_Advice_Open_Objections?: number;
  Days_since_prelim_advice_request?: string | number | boolean;
  Days_since_full_advice_request?: string | number | boolean;
  grant_id?: string | number | boolean;
  Count_of_Active_Mailing_Addresses__from_School_?: any;
  Logo__from_School_?: any;
  Current_TLs?: any;
  Legal_Name_of_School?: any;
  Mailing_address?: any;
  TL_emails?: any;
  EIN?: any;
  Nonprofit_status?: any;
  Membership_Status__from_School_?: any;
  School_Contact_Emails__from_School_?: any;
  Current_TLs_first_names?: any;
  Issued_by_Name?: any;
  Prelim_Advice_Status_Rollup?: any;
  Full_Advice_Status_Rollup__from_Grants_Advice_Log_?: any;
  Prelim_Advice_Yes_Names?: any;
  Primary_Contact_Email__from_School_?: any;
  Primary_Contacts__from_School_?: any;
  Current_Mailing_Address__from_School_?: any;
  Partners_copy?: string[];
}

// Grants Advice Log table
export interface GrantsAdviceLog extends BaseRecord {
  grant_advice_id?: string | number | boolean;
  Grant?: string[];
  Advice_Giver?: string[];
  Issued_by__from_Grant_?: any;
  Step?: 'Prelim' | 'Full';
  Initial_Advice?: 'Support' | 'Question' | 'Objection';
  Advice_Given___text?: string;
  Advice_Given___date?: string;
  Question_Resolved_Time?: string;
  Objection_Cleared_Time?: string;
  Status?: string | number | boolean;
  Partners_copy?: string[];
}

// Loans table
export interface Loan extends BaseRecord {
  Loan_Key?: string | number | boolean;
  loan_id?: string | number | boolean;
  School?: string[];
  school_id?: any;
  Amount_Issued?: number;
  Effective_Issue_Date?: string;
  Loan_Status?: 'Interest Only Period' | 'Principal Repayment Period' | 'Paid Off' | '';
  Approximate_Outstanding_Amount?: number;
  Loan_paperwork?: Array<{ id: string; filename: string; url: string; type: string; size: number }>;
  Notes?: string;
  Maturity?: string;
  Interest_Rate?: number;
  Use_of_Proceeds?: 'Operations' | 'Start-up ' | 'Renovations / Construction' | 'Combine 2 loans' | 'Expansion' | 'Move' | 'Security deposit';
  Issue_Method?: 'Sep' | 'TWF' | 'TWF->LF II' | 'LF II' | 'Spring Point';
  Contact_email__from_Educator___from_Educators_x_Schools___from_School_?: any;
  Loan_Contact_Email_1?: string;
  Loan_Contact_Email_2?: string;
  Educators_x_Schools?: string[];
}

// Governance docs table
export interface GovernanceDocument extends BaseRecord {
  Doc_Key?: string | number | boolean;
  govdoc_id?: string | number | boolean;
  School?: string[];
  charter_id?: any;
  school_id?: any;
  short_name?: any;
  Document_type?: 'Articles of Incorporation' | 'Certificate of Incorporation' | 'EIN Letter' | 'Self management policy' | 'Nepotism policy' | 'Conflict of Interest policy' | 'Bylaws' | 'Document Retention Policy' | 'Whistleblower Policy' | 'Nondiscrimination Policy' | 'Membership Agreement' | 'Authorization Letter' | 'Group Exemption Status Notification to IRS' | 'Group Exemption Status Notification to School' | 'Group Exemption Status Withdrawn Notification to IRS' | 'IRS Determination Letter' | 'Acknowledgement & Commitment' | 'IRS Revocation Letter';
  Date?: string;
  Doc_notes?: string;
  Document_PDF?: Array<{ id: string; filename: string; url: string; type: string; size: number }>;
  EIN__from_School_?: any;
  Charter?: string[];
  Doc_Link?: string;
  url___pdf_extension_formula?: string;
  Publication_link?: string;
  Created?: string;
}

// 990s table
export interface Charter990 extends BaseRecord {
  _990_key?: string | number | boolean;
  nine_ninety_id?: string | number | boolean;
  School?: string[];
  charter_id?: any;
  school_id?: any;
  short_name?: any;
  supabase_id?: string;
  Legal_structure__from_School_?: any;
  Charter_key?: string[];
  Incorporation_Date__from_School_ID_?: any;
  EIN?: any;
  _990_Reporting_Year?: string;
  link?: string;
  PDF?: Array<{ id: string; filename: string; url: string; type: string; size: number }>;
  Group_Exemption?: any;
  Notes?: string;
  AI_Derived_Revenue?: number;
  AI_Derived_EOY_Date?: any;
  Short_Name__from_School_ID_?: any;
  url___pdf_extension_formula?: string | number | boolean;
  Membership_fee_school_x_year?: string[];
}

// Loan payments table
export interface LoanPayment extends BaseRecord {
  Payment_key?: string | number | boolean;
  School?: string[];
  Loan_Report_Name__from_School_ID_?: any;
  Payment_date?: string;
  Amount?: number;
  Short_Name?: any;
}

// Events table
export interface Event extends BaseRecord {
  Event_Name?: string;
  event_id?: string | number | boolean;
  Date?: string;
  Type?: string[];
  Attendees?: string[];
}

// Event attendance table
export interface EventAttendance extends BaseRecord {
  Event_Attendance_key?: string | number | boolean;
  Event_Participant?: string[];
  educator_id?: any;
  Event?: string[];
  Event_Name?: any;
  Registered?: boolean;
  Registration_Date?: string;
  Attended?: boolean;
  Time_at_event?: number;
  Phone?: string;
  TL_Stories_Type?: string;
  TL_Stories_Race?: string;
  TL_Stories_School_Target?: string;
  TL_Stories_Q1?: string;
  TL_Stories_Q2?: string;
  needs_spanish_translation?: boolean;
  Field_10?: 'Montessori Guide' | 'Parent / Guardian' | 'Current/Emerging Wildflower Teacher Leader (have started the Visioning process)' | 'Classroom Teacher' | 'School Administrator' | 'Other' | 'Wildflower Partner' | 'Classroom Teacher' | 'School Administrator' | 'Montessori Guide' | 'Current/Emerging Wildflower Teacher Leader (have started the Visioning process)' | 'Parent / Guardian';
  Field_11?: 'For me it is just a culture.' | 'South Asian' | 'White, queer woman' | 'I believe in an inclusive society which everyone feels accepted without any reference to the ethnicity, culture or other things.' | 'Asian' | 'i identify myself As Hispanic.' | 'Hispanic' | 'African American' | 'n/a' | 'Black Haitian American' | 'Black' | 'White' | 'I am a queer Black woman.' | 'white' | 'queer, white' | 'White; she/her/hers' | 'White woman' | 'Caucasian' | 'black' | 'White, cis female, gay' | 'I am an observant Jew and have worked in Jewish Montessori for many years' | 'Asian American' | 'white/ Caucasian' | 'Emerging wildflower teacher/Decended from ling line if Scottish teachers...Decade of teaching Montessori teaching';
  Field_12?: string;
  Field_13?: string;
  Field_15?: 'No' | 'Yes' | 'N/A';
  Field_16?: string;
  Field_17?: string;
  Field_18?: boolean;
  Income_Background__from_Event_Participant_?: any;
  Household_Income__from_Event_Participant_?: any;
  Race___Ethnicity__from_Event_Participant_?: any;
  Current_School__from_Event_Participant_?: any;
  Educators_at_Schools__from_Event_Participant_?: any;
  Assigned_Partner__from_Event_Participant_?: any;
  Hub__from_Event_Participant_?: any;
  Age_Classrooms_Interested_in_Offering__from_Event_Participant_?: any;
  School_Status__from_Event_Participant_?: any;
  Educator_record_created?: any;
  Montessori_Certifications__from_Event_Participant_?: any;
  Hub_Name__from_Event_Participant_?: any;
  Stage__from_Event_Participant_?: any;
  Status__from_Event_Participant_?: any;
  Stage_change_from_visioning_to_planning__from_Event_Participant_?: any;
  Stage_change_from_Discovery_to_Visioning__from_Event_Participant_?: any;
  CountofLoggedPlannings__from_Event_Participant_?: any;
  CountofLoggedVisioning__from_Event_Participant_?: any;
  CountofLoggedDiscover__from_Event_Participant_?: any;
  When_did_they_switch_to_visioning?: any;
  SSJ_Typeforms__Start_a_School__from_Event_Participant_?: any;
  Source__from_SSJ_Typeforms__Start_a_School___from_Event_Participant_?: any;
  Event_Type?: any;
  Started_SSJ___completed_SSJ_typeform_?: 'Yes' | 'No' | 'N/A';
  Marketing_source?: string;
  Network?: string;
  Age_Classrooms_Interested_in_Offering__from_Event_Participant__2?: any;
  Created__from_Event_Participant_?: any;
  Income_Background__from_Event_Participant__2?: any;
  Household_Income__from_Event_Participant__2?: any;
  Race___Ethnicity__from_Event_Participant__2?: any;
  Current_School__from_Event_Participant__2?: any;
  Educators_at_Schools__from_Event_Participant__2?: any;
  Hub__from_Event_Participant__2?: any;
  School_Status__from_Event_Participant__2?: any;
  Montessori_Certified__from_Event_Participant_?: any;
  Assigned_Partner__from_Event_Participant__2?: any;
  Stage__from_Event_Participant__2?: any;
  Status__from_Event_Participant__2?: any;
  Full_Name__from_Event_Participant_?: any;
  First_visioning__from_Event_Participant_?: any;
  SSJ_Typeforms__Start_a_School?: string[];
  Created_date?: any;
  Entry_Date__from_Start_a_School_form___from_Educators_?: any;
  Created__from_Event_Participant__2?: any;
  First_visioning__from_Event_Participant__2?: any;
}

// Mailing lists table
export interface Mailinglists extends BaseRecord {
  Subscription_ID?: string | number | boolean;
  Record_ID?: string | number | boolean;
  Name?: string;
  Slug?: string;
  Type?: 'Google Group';
  Google_Group_ID?: string;
  Educators?: string[];
  Educator_Log?: string;
}

// Montessori Certs table
export interface MontessoriCerts extends BaseRecord {
  Montessori_Cert_key?: string | number | boolean;
  montessori_cert_id?: string | number | boolean;
  Educator?: string[];
  educator_id?: any;
  Year_Certified?: number;
  Certification_Levels?: string[];
  Level?: any;
  Field_12?: string;
  Certifier?: string[];
  Abbreviation?: any;
  Certifier___Other?: string;
  Certification_Status?: 'Training' | 'Certified' | 'Paused' | 'Not certified';
  Created?: string;
}

// SSJ Typeforms: Start a School table
export interface SSJTypeforms_StartaSchool extends BaseRecord {
  Response_ID?: string | number | boolean;
  Record_ID?: string | number | boolean;
  SSJ_data_on_educators?: string;
  Educator?: string;
  First_Name?: string;
  Last_Name?: string;
  Email?: string;
  Is_Montessori_Certified?: boolean;
  Is_Seeking_Montessori_Certification?: boolean;
  Montessori_Certification_Certifier?: string;
  Montessori_Certification_Year?: number;
  Montessori_Certification_Levels?: string;
  School_Location__City?: string;
  School_Location__State?: string;
  School_Location__Country?: string;
  School_Location__Community?: string;
  Has_Interest_in_Joining_Another_School?: boolean;
  Is_Willing_to_Move?: boolean;
  Contact_Location__City?: string;
  Contact_Location__State?: string;
  Contact_Location__Country?: string;
  Age_Classrooms_Interested_In_Offering?: string;
  Socio_Economic__Race___Ethnicity?: string;
  Socio_Economic__Race___Ethnicity_Other?: string;
  Socio_Economic__LGBTQIA_Identifying?: string;
  Socio_Economic__Pronouns?: string;
  Socio_Economic__Pronouns_Other?: string;
  Socio_Economic__Gender?: string;
  Socio_Economic__Gender_Other?: string;
  Socio_Economic__Household_Income?: string;
  Socio_Economic__Primary_Language?: string;
  Message?: string;
  Equity_Reflection?: string;
  Receive_Communications?: boolean;
  Source?: string;
  Entry_Date?: string;
  Tags?: string;
  Created_At?: string;
  Month?: string | number | boolean;
  Initial_Interest_in_Governance_Model?: string;
  Is_Interested_in_Charter?: boolean;
  Event_attendance?: string[];
  Record_ID__from_Event_Participant___from_Event_attendance_?: any;
  Time_at_event__from_Event_attendance_?: any;
  Attended__from_Event_attendance_?: any;
  Registered__from_Event_attendance_?: any;
  School_Location__Address?: string | number | boolean;
  Contact_Location__Address?: string | number | boolean;
  Educators?: string[];
  SSJ_Fillout_Form__Get_Involved?: string;
  SSJ_Fillout_Form__Get_Involved_2?: string;
  SSJ_Fillout_Forms?: string[];
}

// SSJ Fillout Forms table
export interface SSJFilloutForms extends BaseRecord {
  SSJ_FIllout_Form_key?: string | number | boolean;
  ssj_fillout_form_id?: string | number | boolean;
  Form_version?: 'Get Involved' | 'Start a School';
  First_Name?: string;
  Last_Name?: string;
  Full_Name?: string | number | boolean;
  Email?: string;
  Link_to_Start_a_School?: string[];
  Socio_Economic__Race___Ethnicity?: ('African-American, Afro-Caribbean or Black' | 'American Indian or Alaska Native' | 'Asian-American' | 'Hispanic, Latino, or Spanish Origin' | 'Middle Eastern or North African' | 'Native Hawaiian or Other Pacific Islander' | 'White' | 'Other')[];
  Socio_Economic__Race___Ethnicity_Other?: string;
  Socio_Economic__LGBTQIA_Identifying__from_Email_?: any;
  Socio_Economic__Pronouns?: 'she/her/hers' | 'he/him/his' | 'they/them/theirs' | 'other';
  Socio_Economic__Pronouns_Other?: string;
  Socio_Economic__Gender?: 'Female/Woman' | 'Male/Man' | 'Gender Non-Conforming' | 'Prefer not to respond' | 'Other';
  Gender_standardized?: string | number | boolean;
  Socio_Economic__Gender_Other?: string;
  Socio_Economic__Household_Income?: 'Upper Income' | 'Middle Income' | 'Lower Income' | 'Prefer not to respond';
  Primary_Language?: 'English' | 'Spanish - Español' | 'Japanese - 日本語' | 'Mandarin - 中文' | 'French - Français' | 'Urdu - اُردُو' | 'Portugese' | 'Burmese - မြန်မာစာ' | 'Cantonese - Gwóngdūng wá' | 'Portuguese - Português' | 'Arabic - العَرَبِيَّة' | 'Hindi - हिन्दी' | 'A not-listed or more specific language';
  Primary_Language_Other?: string;
  Message?: string;
  Is_Interested_in_Charter__from_Email_?: any;
  Educators?: string[];
  educator_id?: any;
  Contact_Type?: 'Community member' | 'Educator' | 'Property owner';
  Contact_Type_standardized?: string | number | boolean;
  Montessori_Cert_Q?: 'I have completed Montessori training' | 'I have completed a Montessori training but I need another for my target age level' | 'I am currently going through Montessori training' | 'I am interested in pursuing Montessori training' | 'None of the above';
  Status_of_Processing_Montessori_Certs?: 'Completed' | 'Not Completed';
  Is_Montessori_Certified?: string | number | boolean;
  Is_Seeking_Montessori_Certification?: string | number | boolean;
  Temp___M_Cert_Cert_1?: string;
  Montessori_Certification_Certifier_1?: string[];
  Temp___M_Cert_Year_1?: number;
  Montessori_Certification_Year_1?: number;
  Temp___M_Cert_Level_1?: string;
  Montessori_Certification_Level_1?: string[];
  Temp___M_Cert_Cert_2?: string;
  Montessori_Certification_Certifier_2?: string[];
  Temp___M_Cert_Year_2?: number;
  Montessori_Certification_Year_2?: number;
  Temp___M_Cert_Level_2?: string;
  Montessori_Certification_Level_2?: string[];
  Temp___M_Cert_Cert_3?: string;
  Montessori_Certification_Certifier_3?: string[];
  Temp___M_Cert_Year_3?: number;
  Montessori_Certification_Year_3?: number;
  Temp___M_Cert_Level_3?: string;
  Montessori_Certification_Level_3?: string[];
  Temp___M_Cert_Cert_4?: string;
  Montessori_Certification_Certifier_4?: string[];
  Temp___M_Cert_Year_4?: number;
  Montessori_Certification_Year_4?: number;
  Temp___M_Cert_Level_4?: string;
  Montessori_Certification_Level_4?: string[];
  City?: string;
  City_Standardized?: string | number | boolean;
  State?: string;
  State_Standardized?: any;
  Country?: string;
  City_2?: string;
  State_2?: string;
  Country_2?: string;
  Target_Geography?: string | number | boolean;
  Age_Classrooms_Interested_In_Offering?: ('Infant/Toddler' | 'Primary/Early Childhood' | '6-9 Elementary' | '6-12 Elementary' | '9-12 Elementary' | '12-15 Secondary' | '15-18 Secondary')[];
  Educator_Interests?: ('Working at an open independent/private Wildflower school' | 'Working at an open Wildflower public charter school site' | 'Founding a new independent/private Wildflower school' | 'Founding a new public charter site in an authorized Wildflower charter school' | 'Founding a new public charter or joining a team founding a charter' | 'Partnering with my local district to open a program' | 'Founding or converting a lab school' | 'Founding a homeschool program' | 'Converting an existing education program into a Wildflower school' | 'Leading a co-op' | 'Other')[];
  Educator_Interests_Other?: string;
  Community_Member_Interest?: string;
  Community_Member_Support_Finding_Teachers?: boolean;
  Community_Member_Community_Info?: string;
  Community_Member_Self_Info?: string;
  Receive_Communications?: 'Yes' | 'No';
  Source?: 'Advertisement' | 'Indeed' | 'Direct Email' | 'Media' | 'RCG Talent Solutions' | 'Conference (AMI)' | 'Conference (AMS)' | 'Conference - Montessori Other' | 'Black Wildflowers Fund' | 'Referred by Partner Organization' | 'I Previously Worked at a Wildflower School' | 'Social Media' | 'Web Search (e.g., Google, ChatGPT)' | 'Referred by a Wildflower Teacher/Partner' | 'Family/Friend' | 'Word of Mouth' | 'Other' | 'ChatGPT' | 'Kanetria Doolin' | 'idealist.org' | 'National Center for Microschooling' | 'LinkedIn' | 'Google' | 'Sunlight ' | 'Chat GPT' | 'CW Impact Solutions';
  Source___other?: string;
  Marketing_Source?: string;
  Marketing_Campaign?: string;
  Interested_in_charter?: boolean;
  Entry_Date?: string;
  Month__for_leads_per_month_report_?: string | number | boolean;
  Assigned_Partner__from_Educators_?: any;
  SendGrid_template_id?: string;
  SendGrid_sent_date?: string;
  Routed_To?: string;
  Assigned_Partner_Override?: 'daniela.vasan@wildflowerschools.org' | 'N/A' | 'rachel.kelley-cohn@wildflowerschools.org' | 'jeana.olszewski@wildflowerschools.org' | 'angelica@wildflowerschools.org' | 'Brent Locke' | 'DUPLICATE';
  Email_sent_by_Initial_Outreacher_?: 'Yes' | 'No' | 'n/a';
  One_on_one_status?: 'Prospect did not reply to outreach' | 'Scheduling' | 'Scheduled' | 'Completed' | 'Prospect did not attend' | 'Not Interested' | 'N/A';
  Manual__type__run__?: string;
  Initial_Outreacher?: 'daniela.vasan@wildflowerschools.org' | 'N/A' | 'rachel.kelley-cohn@wildflowerschools.org' | 'jeana.olszewski@wildflowerschools.org' | 'angelica@wildflowerschools.org' | 'Brent Locke' | 'DUPLICATE' | 'Lisbeth';
  Person_responsible_for_follow_up?: 'daniela.vasan@wildflowerschools.org' | 'N/A' | 'rachel.kelley-cohn@wildflowerschools.org' | 'jeana.olszewski@wildflowerschools.org' | 'angelica@wildflowerschools.org' | 'Brent Locke' | 'DUPLICATE';
  Source_for_non_TLs?: 'Advertisement' | 'Indeed' | 'Direct Email' | 'Media' | 'RCG Talent Solutions' | 'Conference' | 'Black Wildflowers Fund' | 'Referred by Partner Organization' | 'I Previously Worked at a Wildflower School' | 'Social Media' | 'Web Search (e.g., Google, ChatGPT)' | 'Referred by a Wildflower Teacher/Partner' | 'Family/Friend' | 'Word of Mouth' | 'Other';
}

// Guides table
export interface Guides extends BaseRecord {
  email_or_name?: string;
  Record_ID?: string | number | boolean;
  Email?: string;
  Currently_active?: string;
  Roles?: ('Foundation Partner' | 'Teacher Leader' | 'Ops Guide' | 'School Supports Partner' | 'Finance Administrator' | 'Regional Entrepreneur' | 'TL' | 'Affiliate of Charter Partner')[];
  Photo?: Array<{ id: string; filename: string; url: string; type: string; size: number }>;
  Phone?: string;
  Home_address?: string;
  DOB?: string;
  TLs?: string[];
  Educator_Record_IDs?: any;
  Guide_assignments?: string[];
  Guided_School_Record_ID?: any;
  Start_Date__from_Stints_?: string;
  End_Date__from_Stints_?: string;
  Stint_type__from_Stints_?: ('Full time employee' | 'Part time eligible' | 'Part time ineligible' | 'Seasonal or temporary' | 'Dedicated contractor' | 'Other contractor' | 'Sponsored project' | 'Volunteer' | 'TL contractor' | 'Affiliate of Charter Partner')[];
  Active_stint?: ('Full time employee' | 'Part time eligible' | 'Part time ineligible' | 'Seasonal or temporary' | 'Dedicated contractor' | 'Other contractor' | 'Sponsored project' | 'Volunteer' | 'TL contractor' | 'Affiliate of Charter Partner')[];
  _2016_2017__from_Stints_?: string;
  _2017_2018__from_Stints_?: string;
  _2018_2019__from_Stints_?: string;
  _2019_2020__from_Stints_?: string;
  Educator_notes?: string[];
  School_notes?: string[];
  Website_bio?: string;
  Slack_handle?: string;
  Papyrs_profile?: string;
  Copper_userID?: string;
  Public_website_active?: boolean;
  Holaspirit_member_ID?: string;
  Image_URL?: string;
  Name?: string;
  Short_name?: string;
  Educator_Log?: string;
  Personal_Email?: string;
  Action_steps?: string[];
  SSJ_Process_Details?: string;
  Schools?: string[];
  Lead_Routing?: string;
  Email_templates?: string[];
  Grants_5?: string[];
  Membership_termination_steps_and_dates?: string;
  Grants_Advice_Log?: string[];
  Key_Value_Pairs?: string[];
  Roadmap?: string[];
  Roadmap_2?: string[];
}

// Guides Assignments table
export interface GuidesAssignments extends BaseRecord {
  Guide_Assignment_key?: string | number | boolean;
  guide_assignment_id?: string | number | boolean;
  School?: string[];
  School_Short_Name?: any;
  school_id?: any;
  Partner?: string[];
  Guide_short_name?: any;
  Start_date?: string;
  End_date?: string;
  Type?: 'Ops Guide' | 'Equity Coach' | 'Regional Entrepreneur' | 'Open Schools Support';
  Currently_active?: boolean;
}

// School notes table
export interface CharterNote extends BaseRecord {
  School_Note_Key?: string | number | boolean;
  school_note_id?: string | number | boolean;
  School?: string[];
  charter_id?: any;
  school_id?: any;
  Notes?: string;
  Date_created?: string;
  Created_by?: string[];
  Partner_Short_Name?: any;
  Private?: boolean;
  Headline__Notes_?: any;
  Partners_copy?: string[];
}

// Educator notes table
export interface Educatornotes extends BaseRecord {
  Educator_Note_Key?: string | number | boolean;
  educator_notes_id?: string | number | boolean;
  Educator?: string[];
  educator_id?: any;
  Notes?: string;
  Date?: string;
  Created_by?: string[];
  Private?: boolean;
  Full_Name__from_Educator_?: any;
  Partners_copy?: string[];
}

// Training Grants table
export interface TrainingGrants extends BaseRecord {
  Training_Participant___Program?: string | number | boolean;
  Educators?: string[];
  Training_Program?: 'Rising Tide';
  Applied_?: boolean;
  Training_Status?: 'Accepted' | 'In-Progress' | 'Complete' | 'Withdrew' | 'Incomplete application / did not apply';
  Cohort?: '2022 Primary';
  Training_Grant_Status?: 'Planned' | 'Issued' | 'Cancelled';
  Training_Grant_Amount?: number;
  Notes?: string;
  Status__from_Educators_?: any;
  Stage__from_Educators_?: any;
  Hub_Name__from_Educators_?: any;
}

// Public funding table
export interface Publicfunding extends BaseRecord {
  Name?: string;
  Description?: string;
  Relevant_levels?: ('Parent-child' | 'Infants' | 'Toddlers' | 'Primary' | 'Lower Elementary' | 'Upper Elementary' | 'Adolescent / JH' | 'High School')[];
  Schools?: string[];
  Schools_copy?: string;
}

// Action steps table
export interface ActionStep extends BaseRecord {
  Item?: string;
  action_step_id?: string | number | boolean;
  Assignee?: string[];
  Assignee_Short_Name?: any;
  Status?: 'Incomplete' | 'Complete';
  Assigned_date?: string;
  Due_date?: string;
  Schools?: string[];
  charter_id?: any;
  school_id?: any;
  School_Short_Name?: any;
  SSJ_Stage?: any;
  School_Status?: any;
  Completed_date?: string;
  Partners_copy?: string[];
}

// Event types table
export interface Eventtypes extends BaseRecord {
  Event_Category?: string;
  Events?: string[];
}

// QBO School Codes table
export interface QBOSchoolCodes extends BaseRecord {
  Customer_ID_in_QBO?: string;
  School_Name_in_QBO?: string;
  Schools?: string[];
  Membership_fee_invoices?: string[];
  Membership_fee_credits?: string[];
}

// Montessori Cert Levels table
export interface MontessoriCertLevels extends BaseRecord {
  Name?: string;
  Montessori_Certs?: string[];
  SSJ_Fillout_Form__Get_Involved?: string[];
  SSJ_Fillout_Form__Get_Involved_2?: string[];
  SSJ_Fillout_Form__Get_Involved_3?: string[];
  SSJ_Fillout_Form__Get_Involved_4?: string[];
  Educators?: string;
  Educators_2?: string[];
  Charters?: string[];
  Educators_x_Schools?: string[];
}

// Montessori Certifiers table
export interface MontessoriCertifiers extends BaseRecord {
  Name?: string;
  Abbreviation?: string;
  Montessori_Certs?: string[];
  SSJ_Fillout_Form__Get_Involved?: string[];
  SSJ_Fillout_Form__Get_Involved_2?: string[];
  SSJ_Fillout_Form__Get_Involved_3?: string[];
  SSJ_Fillout_Form__Get_Involved_4?: string[];
}

// Montessori Certifiers - old list table
export interface MontessoriCertifiers_oldlist extends BaseRecord {
  Name?: string;
  Abbreviation?: string;
  SSJ_Fillout_Form__Get_Involved?: string;
  SSJ_Fillout_Form__Get_Involved_2?: string;
  SSJ_Fillout_Form__Get_Involved_3?: string;
  SSJ_Fillout_Form__Get_Involved_4?: string;
}

// Race and Ethnicity table
export interface RaceandEthnicity extends BaseRecord {
  Name?: string;
  SSJ_Fillout_Form__Get_Involved?: string;
  Educators?: string[];
}

// Board Service table
export interface BoardService extends BaseRecord {
  Name?: string | number | boolean;
  School?: string[];
  Educator?: string[];
  Community_Member_Name?: string;
  Community_Member_Email?: string;
  Contact_Email__from_Educator_?: any;
  Email?: string | number | boolean;
  Start_Date?: string;
  End_Date?: string;
  Currently_Active?: boolean;
  Chair?: boolean;
}

// Lead Routing and Templates table
export interface LeadRoutingandTemplates extends BaseRecord {
  Name?: string;
  SendGrid_Template_ID?: string;
  Language?: ('English' | 'Spanish')[];
  Type?: ('Educator' | 'Community member')[];
  US___International?: ('U.S.' | 'International')[];
  Geo_type?: 'States';
  State?: string;
  Source?: string;
  Growth_Lead?: string[];
  Sender?: string;
  cc?: string;
}

// States Aliases table
export interface StatesAliases extends BaseRecord {
  State?: string;
  Abbreviation?: string;
}

// Membership termination steps table
export interface Membershipterminationsteps extends BaseRecord {
  mem_term_step_id?: string | number | boolean;
  School?: string[];
  School_Contact_Emails__from_School_?: any;
  Membership_termination_letter__from_School_?: any;
  Termination_trigger_date?: string;
  Update_Airtable_fields?: string;
  Deactivate_GSuite_target_date?: string;
  Deactivate_GSuite?: string;
  Initial_TC_condition?: string;
  Deactivate_TC_target_date?: string;
  Deactivate_TC?: string;
  Listservs?: ('teachers-leaders' | 'white' | 'af-am' | 'poc')[];
  Deactivate_listservs_target_date?: string;
  Deactivate_listservs?: string;
  Initial_website_condition?: string;
  Deactivate_website_target_date?: string;
  Deactivate_website?: string;
  Initial_QBO_condition?: 'In WF QBO with complete Master Admin' | 'In WF QBO without complete Master Admin' | 'Not in WF QBO';
  Deactivate_QBO_target_date?: string;
  Deactivate_QBO?: string;
  Initial_Slack_condition?: 'In WF Slack' | 'Not in WF Slack';
  Deactivate_Slack_target_date?: string;
  Deactivate_Slack?: string;
  Deactivate_wildflowerschools_org_profile?: string;
  Initial_Group_Exemption_condition?: string;
  Deactivate_Group_Exemption_target_date?: string;
  Deactivate_Group_Exemption?: string;
  Initial_Gusto_condition?: string;
  Deactivate_Gusto_target_date?: string;
  Deactivate_Gusto?: string;
  Deactivate_wildflowerschools_org_profile_target_date?: string;
}

// Membership termination steps and dates table
export interface Membershipterminationstepsanddates extends BaseRecord {
  Step_name?: string;
  Day_of_process?: number;
  Responsible_person_at_WF?: string;
  field_with_target_date?: string | number | boolean;
}

// Cohorts table
export interface Cohorts extends BaseRecord {
  Cohort_Name?: string | number | boolean;
  Program_Type?: 'Blooms' | 'Charter';
  Start_Date?: string;
  Schools?: string[];
  Charters?: string[];
}

// Marketing sources mapping table
export interface Marketingsourcesmapping extends BaseRecord {
  recID?: string | number | boolean;
  Fillout_options?: string;
  Educators_options?: string;
  Educators_other?: string;
}

// Marketing source options table
export interface Marketingsourceoptions extends BaseRecord {
  Marketing_Source?: string;
  Educators?: string[];
}

// Annual enrollment and demographics table
export interface Annualenrollmentanddemographics extends BaseRecord {
  Annual_data_key?: string | number | boolean;
  annual_data_id?: string | number | boolean;
  Charter?: string[];
  School?: string[];
  school_id__from_School_?: any;
  School_Year?: string[];
  Number_of_enrolled_students___all?: number;
  Number_of_enrolled_students___FRL?: number;
  Number_of_enrolled_students___BIPOC?: number;
  Number_of_enrolled_students___ELL?: number;
  Number_of_enrolled_students___SPED?: number;
}

// Charter roles table
export interface Charterroles extends BaseRecord {
  Charter_role_key?: string | number | boolean;
  charter_role_id?: string | number | boolean;
  Name?: string;
  Charter?: string[];
  charter_id?: any;
  Charter_applications?: string[];
  Role?: ('Initiator' | 'Lead admin' | 'Board chair' | 'Board member (non-chair)')[];
  Start_date?: string;
  End_date?: string;
  Currently_active?: boolean;
  Title?: string;
  Educator_record?: string[];
  Current_Primary_Email_Address__from_Educator_record_?: any;
  Email?: string;
  Phone?: string;
  Race___Ethnicity__from_Educator_record_?: any;
  Status__from_Charter_?: any;
  Charter_applications_2?: string;
}

// Charter authorizers and contacts table
export interface Charterauthorizersandcontacts extends BaseRecord {
  Charter_authorizer_key?: string | number | boolean;
  Charter?: string[];
  charter_id?: any;
  Authorizer?: string;
  Contact?: string;
  Title?: string;
  Email?: string;
  Phone?: string;
  Currently_active?: boolean;
}

// Reports and submissions table
export interface Reportsandsubmissions extends BaseRecord {
  reports_id?: string | number | boolean;
  Charter?: string[];
  charter_id?: any;
  Report_type?: 'Performance data' | 'Renewal report';
  Attachments?: Array<{ id: string; filename: string; url: string; type: string; size: number }>;
  School_year?: string[];
}

// Assessments table
export interface Assessments extends BaseRecord {
  Short_Name?: string;
  Full_Name?: string;
  Domain?: string;
  Grades?: ('PK3' | 'PK4' | 'K' | '1st' | '2nd' | '3rd' | '4th' | '5th' | '6th' | '7th' | '8th' | '9th' | '10th' | '11th' | '12th')[];
  Annual_Assessment_Implementations_by_School?: string[];
}

// Assessment data table
export interface Assessmentdata extends BaseRecord {
  Assessment_Data_key?: string | number | boolean;
  assessment_data_id?: string | number | boolean;
  Charter?: string[];
  charter_id?: any;
  School?: string[];
  school_id?: any;
  Year?: string[];
  Assessment?: string[];
  Other_data?: string;
  Number_assessed?: number;
  Number_assessed___BIPOC?: number;
  Number_assessed___FRL?: number;
  Number_assessed___ELL?: number;
  Number_assessed___SPED?: number;
  Met_or_exceeds___all?: number;
  Met_or_exceeds___BIPOC?: number;
  Met_or_exceeds___FRL?: number;
  Met_or_exceeds___ELL?: number;
  Met_or_exceeds___SPED?: number;
}

// Charter applications table
export interface Charterapplications extends BaseRecord {
  Charter_App_key?: string | number | boolean;
  charter_app_id?: string | number | boolean;
  Charter?: string[];
  charter_id?: any;
  Short_Name?: any;
  Full_Name?: any;
  Target_open?: string;
  Target_community__from_Charter_?: any;
  Support_timeline?: Array<{ id: string; filename: string; url: string; type: string; size: number }>;
  Landscape_analysis__from_Charter_?: any;
  Cohorts__from_Charter_?: any;
  Application_window?: string;
  Key_dates?: string | number | boolean;
  Milestones?: string | number | boolean;
  Authorizer?: string;
  __of_students?: number;
  Beginning_age?: string[];
  Ending_age?: string[];
  Grades?: string | number | boolean;
  Letter_of_Intent_req_d?: 'Required' | 'Allowed' | 'Does not apply';
  Letter_of_Intent_deadline?: string;
  LOI_submitted?: string;
  LOI?: Array<{ id: string; filename: string; url: string; type: string; size: number }>;
  Expected_decision?: string;
  Likelihood_of_authorization?: 'High' | 'Med-High' | 'Medium' | 'Med-Low' | 'Low';
  Likelihood_of_opening_on_time?: 'High' | 'Med-High' | 'Medium' | 'Med-Low' | 'Low';
  Charter_app_roles_ID_d?: boolean;
  Charter_app_project_mgmt_plan_complete?: boolean;
  Logic_model_complete?: boolean;
  Community_engagement_plan_launched?: boolean;
  Nonprofit_status?: any;
  App_submission_deadline?: string;
  App_submitted?: string;
  Joint_kickoff_meeting?: string;
  Joint_kickoff_meeting_complete?: boolean;
  Internal_WF_support_launch_meeting?: string;
  Charter_app_walkthrough?: string;
  Capacity_interview_training_complete?: boolean;
  Capacity_Interview_Projected_Date?: string;
  Capacity_Interview_Complete?: string;
  Authorizer_decision_expected_date?: string;
  Authorizer_decision_rec_d?: string;
  Authorizer_decision?: 'Approved' | 'Denied';
  Charter_Design_Advice_Session_Complete?: string;
  Board_membership_agreement_signed?: string;
  TL_membership_agreement_signed?: string;
  Charter_design?: Array<{ id: string; filename: string; url: string; type: string; size: number }>;
  Budget_planning_exercises?: Array<{ id: string; filename: string; url: string; type: string; size: number }>;
  Final_budget?: Array<{ id: string; filename: string; url: string; type: string; size: number }>;
  Most_recent_application?: boolean;
  Status?: 'Pre application' | 'Preparing application' | 'Awaiting decision' | 'Authorized, preparing to open' | 'Open' | 'Application denied';
  Current_TLs__from_Schools___from_Charter_?: any;
  Current_TL_discovery_status?: any;
  Charter_level_membership_agreement_signed?: any;
  Membership_status_of_schools?: any;
  Team_members?: string[];
  Team_members__excl__board_?: any;
  Board_members?: any;
  Opportunities_and_challenges?: string;
}

// Ages-Grades table
export interface Ages_Grades extends BaseRecord {
  Name?: string;
  Charter_applications?: string[];
  Charter_applications_2?: string[];
}

// Supabase join 990 with school table
export interface Supabasejoin990withschool extends BaseRecord {
  id: string;
  _990_year?: string;
  short_name?: string;
}

// Email Addresses table
export interface EmailAddresses extends BaseRecord {
  Email_Address?: string;
  Email_Type?: 'Personal' | 'Work (non-Wildflower)' | 'Work - Wildflower School' | 'Work - Wildflower Foundation';
  Current_Primary_Email?: boolean;
  Active_?: boolean;
  Educator?: string[];
  educator_id?: any;
  email_address_id?: string | number | boolean;
}

// Partners copy table
export interface Partnerscopy extends BaseRecord {
  email_or_name?: string;
  Record_ID?: string | number | boolean;
  Synced_Record_ID?: string;
  Email?: string;
  Currently_active?: string;
  Roles?: ('Foundation Partner' | 'Teacher Leader' | 'Ops Guide' | 'School Supports Partner' | 'Finance Administrator' | 'Regional Entrepreneur' | 'TL' | 'Affiliate of Charter Partner')[];
  Photo?: Array<{ id: string; filename: string; url: string; type: string; size: number }>;
  Phone?: string;
  Home_address?: string;
  DOB?: string;
  TLs?: string[];
  Educator_Record_IDs?: any;
  Guide_assignments?: string;
  Guided_School_Record_ID?: any;
  Start_Date__from_Stints_?: string;
  End_Date__from_Stints_?: string;
  Stint_type__from_Stints_?: ('Full time employee' | 'Part time eligible' | 'Part time ineligible' | 'Seasonal or temporary' | 'Dedicated contractor' | 'Other contractor' | 'Sponsored project' | 'Volunteer' | 'TL contractor' | 'Affiliate of Charter Partner')[];
  Active_stint?: ('Full time employee' | 'Part time eligible' | 'Part time ineligible' | 'Seasonal or temporary' | 'Dedicated contractor' | 'Other contractor' | 'Sponsored project' | 'Volunteer' | 'TL contractor' | 'Affiliate of Charter Partner')[];
  _2016_2017__from_Stints_?: string;
  _2017_2018__from_Stints_?: string;
  _2018_2019__from_Stints_?: string;
  _2019_2020__from_Stints_?: string;
  Educator_notes?: string[];
  School_notes?: string[];
  Website_bio?: string;
  Slack_handle?: string;
  Papyrs_profile?: string;
  Copper_userID?: string;
  Public_website_active?: boolean;
  Holaspirit_member_ID?: string;
  Image_URL?: string;
  Name?: string;
  Short_name?: string;
  Educator_Log?: string;
  Personal_Email?: string;
  Action_steps?: string[];
  SSJ_Process_Details?: string;
  Schools?: string[];
  Lead_Routing?: string;
  Email_templates?: string;
  Grants_5?: string[];
  Membership_termination_steps_and_dates?: string;
  Grants_Advice_Log?: string[];
  Key_Value_Pairs?: string[];
  Roadmap?: string[];
  Roadmap_2?: string[];
}

// Table name to type mapping
export const TABLE_TYPE_MAPPING = {
  "Schools": "School",
  "Educators": "Educator",
  "Locations": "Location",
  "Educators x Schools": "EducatorSchoolAssociation",
  "Governance docs": "GovernanceDocument",
  "990s": "Charter990",
  "School notes": "CharterNote",
  "Charters": "Charter",
  "Loans": "Loan",
  "Loan payments": "LoanPayment",
  "Events": "Event",
  "Event attendance": "EventAttendance",
  "Action steps": "ActionStep"
} as const;

// All generated table types
export type AirtableRecord = 
  | School
  | Charter
  | Location
  | Educator
  | EducatorSchoolAssociation
  | Grants
  | GrantsAdviceLog
  | Loan
  | GovernanceDocument
  | Charter990
  | LoanPayment
  | Event
  | EventAttendance
  | Mailinglists
  | MontessoriCerts
  | SSJTypeforms_StartaSchool
  | SSJFilloutForms
  | Guides
  | GuidesAssignments
  | CharterNote
  | Educatornotes
  | TrainingGrants
  | Publicfunding
  | ActionStep
  | Eventtypes
  | QBOSchoolCodes
  | MontessoriCertLevels
  | MontessoriCertifiers
  | MontessoriCertifiers_oldlist
  | RaceandEthnicity
  | BoardService
  | LeadRoutingandTemplates
  | StatesAliases
  | Membershipterminationsteps
  | Membershipterminationstepsanddates
  | Cohorts
  | Marketingsourcesmapping
  | Marketingsourceoptions
  | Annualenrollmentanddemographics
  | Charterroles
  | Charterauthorizersandcontacts
  | Reportsandsubmissions
  | Assessments
  | Assessmentdata
  | Charterapplications
  | Ages_Grades
  | Supabasejoin990withschool
  | EmailAddresses
  | Partnerscopy;

// School options arrays used by client
export const SCHOOLS_OPTIONS_SCHOOL_STATUS: string[] = [
  "Emerging",
  "Open", 
  "Paused",
  "Closing",
  "Permanently Closed",
  "Disaffiliating",
  "Disaffiliated",
  "Placeholder"
];

export const SCHOOLS_OPTIONS_AGES_SERVED: string[] = [
  "Parent-child",
  "Infants",
  "Toddlers",
  "Primary",
  "Lower Elementary",
  "Upper Elementary",
  "Adolescent / JH",
  "High School"
];

export const SCHOOLS_OPTIONS_GOVERNANCE_MODEL: string[] = [
  "Independent",
  "District",
  "Charter",
  "Exploring Charter",
  "Community Partnership"
];
