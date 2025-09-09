// Generated generic storage with metadata-driven table configuration
// Generated on 2025-09-09T17:55:35.631Z
// This file is auto-generated. Do not edit manually.

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../shared/schema';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

const client = postgres(connectionString);
export const db = drizzle(client, { schema });

// Cache configuration
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const cache = new Map<string, { data: any; expires: number }>();

function getCacheKey(table: string, operation: string, params?: any): string {
  return `${table}:${operation}:${params ? JSON.stringify(params) : 'all'}`;
}

function setCache(key: string, data: any): void {
  cache.set(key, { data, expires: Date.now() + CACHE_TTL });
}

function getCache(key: string): any {
  const cached = cache.get(key);
  if (cached && cached.expires > Date.now()) {
    return cached.data;
  }
  cache.delete(key);
  return null;
}

function invalidateCache(pattern: string): void {
  for (const key of cache.keys()) {
    if (key.startsWith(pattern)) {
      cache.delete(key);
    }
  }
}

// Generated table configuration from metadata
export const TABLE_CONFIG = {
  'Partners copy': {
    airtableTable: 'Partners copy',
    fieldMapping: schema.PARTNERS_COPY_FIELDS,
    transformer: (record: any): schema.Partner => schema.createBaseTransformer(record, {
      roles: record.fields?.['Roles'],
      emailTemplates: record.fields?.['Email templates'],
      educatorRecordIds: record.fields?.['Educator Record IDs'],
      grants5: record.fields?.['Grants 5'],
      guideAssignments: record.fields?.['Guide assignments'],
      // Add more field transformations as needed
    }),
    cacheEnabled: true,
  },
  'SSJ Fillout Forms': {
    airtableTable: 'SSJ Fillout Forms',
    fieldMapping: schema.SSJ_FILLOUT_FORMS_FIELDS,
    transformer: (record: any): schema.SSJFilloutForm => schema.createBaseTransformer(record, {
      isInterestedInCharterFromEmail: record.fields?.['Is Interested in Charter (from Email)'],
      tempMCertCert1: record.fields?.['Temp - M Cert Cert 1'],
      socioeconomicGenderOther: record.fields?.['Socio-Economic: Gender Other'],
      tempMCertLevel3: record.fields?.['Temp - M Cert Level 3'],
      socioeconomicRaceEthnicityOther: record.fields?.['Socio-Economic: Race & Ethnicity Other'],
      // Add more field transformations as needed
    }),
    cacheEnabled: true,
  },
  'Marketing sources mapping': {
    airtableTable: 'Marketing sources mapping',
    fieldMapping: schema.MARKETING_SOURCES_MAPPING_FIELDS,
    transformer: (record: any): schema.MarketingSourceMapping => schema.createBaseTransformer(record, {
      recid: record.fields?.['recID'],
      educatorsOptions: record.fields?.['Educators options'],
      educatorsOther: record.fields?.['Educators other'],
      filloutOptions: record.fields?.['Fillout options'],
      // Add more field transformations as needed
    }),
    cacheEnabled: true,
  },
  'Charter applications': {
    airtableTable: 'Charter applications',
    fieldMapping: schema.CHARTER_APPLICATIONS_FIELDS,
    transformer: (record: any): schema.CharterApplication => schema.createBaseTransformer(record, {
      capacityInterviewComplete: record.fields?.['Capacity Interview Complete'],
      capacityInterviewProjectedDate: record.fields?.['Capacity Interview Projected Date'],
      charter: record.fields?.['Charter'],
      letterOfIntentDeadline: record.fields?.['Letter of Intent deadline'],
      nonprofitStatus: record.fields?.['Nonprofit status'],
      // Add more field transformations as needed
    }),
    cacheEnabled: true,
  },
  'Schools': {
    airtableTable: 'Schools',
    fieldMapping: schema.SCHOOLS_FIELDS,
    transformer: (record: any): schema.School => schema.createBaseTransformer(record, {
      numberOfClassrooms: record.fields?.['Number of classrooms'],
      lease: record.fields?.['Lease'],
      gusto: record.fields?.['Gusto'],
      enrollmentAtFullCapacity: record.fields?.['Enrollment at Full Capacity'],
      ssjIsTheSchoolPlanningToApplyForInternalWildflowerFunding: record.fields?.['SSJ - Is the school planning to apply for internal Wildflower funding?'],
      // Add more field transformations as needed
    }),
    cacheEnabled: true,
  },
  'Educators': {
    airtableTable: 'Educators',
    fieldMapping: schema.EDUCATORS_FIELDS,
    transformer: (record: any): schema.Educator => schema.createBaseTransformer(record, {
      householdIncome: record.fields?.['Household Income'],
      otherLanguages: record.fields?.['Other languages'],
      statusForActiveSchool: record.fields?.['Status for Active School'],
      assignedPartnerOverrideFromSsjFilloutForms: record.fields?.['Assigned Partner Override (from SSJ Fillout Forms)'],
      trainingGrants: record.fields?.['Training Grants'],
      // Add more field transformations as needed
    }),
    cacheEnabled: true,
  },
  'SSJ Typeforms: Start a School': {
    airtableTable: 'SSJ Typeforms: Start a School',
    fieldMapping: schema.SSJ_TYPEFORMS_START_A_SCHOOL_FIELDS,
    transformer: (record: any): schema.SSJTypeform => schema.createBaseTransformer(record, {
      ssjDataOnEducators: record.fields?.['SSJ data on educators'],
      registeredFromEventAttendance: record.fields?.['Registered (from Event attendance)'],
      firstName: record.fields?.['First Name'],
      socioeconomicPrimaryLanguage: record.fields?.['Socio-Economic: Primary Language'],
      receiveCommunications: record.fields?.['Receive Communications'],
      // Add more field transformations as needed
    }),
    cacheEnabled: true,
  },
  'School notes': {
    airtableTable: 'School notes',
    fieldMapping: schema.SCHOOL_NOTES_FIELDS,
    transformer: (record: any): schema.SchoolNote => schema.createBaseTransformer(record, {
      schoolnoteid: record.fields?.['school_note_id'],
      createdBy: record.fields?.['Created by'],
      schoolId: record.fields?.['school_id'],
      partnerShortName: record.fields?.['Partner Short Name'],
      headlineNotes: record.fields?.['Headline (Notes)'],
      // Add more field transformations as needed
    }),
    cacheEnabled: true,
  },
  'Membership termination steps': {
    airtableTable: 'Membership termination steps',
    fieldMapping: schema.MEMBERSHIP_TERMINATION_STEPS_FIELDS,
    transformer: (record: any): schema.MembershipTerminationStep => schema.createBaseTransformer(record, {
      initialTcCondition: record.fields?.['Initial TC condition'],
      deactivateListservs: record.fields?.['Deactivate listservs'],
      deactivateGsuiteTargetDate: record.fields?.['Deactivate GSuite target date'],
      deactivateWildflowerschoolsorgProfile: record.fields?.['Deactivate wildflowerschools.org profile'],
      deactivateWildflowerschoolsorgProfileTargetDate: record.fields?.['Deactivate wildflowerschools.org profile target date'],
      // Add more field transformations as needed
    }),
    cacheEnabled: true,
  },
  'Locations': {
    airtableTable: 'Locations',
    fieldMapping: schema.LOCATIONS_FIELDS,
    transformer: (record: any): schema.Location => schema.createBaseTransformer(record, {
      geocodeAutomationLastRunAt: record.fields?.['Geocode Automation Last Run At'],
      country: record.fields?.['Country'],
      qualifiedLowIncomeCensusTract: record.fields?.['Qualified Low Income Census Tract'],
      street: record.fields?.['Street'],
      address: record.fields?.['Address'],
      // Add more field transformations as needed
    }),
    cacheEnabled: true,
  },
  'Event attendance': {
    airtableTable: 'Event attendance',
    fieldMapping: schema.EVENT_ATTENDANCE_FIELDS,
    transformer: (record: any): schema.EventAttendance => schema.createBaseTransformer(record, {
      ageClassroomsInterestedInOfferingFromEventParticipant: record.fields?.['Age Classrooms Interested in Offering (from Event Participant)'],
      educatorsAtSchoolsFromEventParticipant: record.fields?.['Educators at Schools (from Event Participant)'],
      startedSsjCompletedSsjTypeform: record.fields?.['Started SSJ? (completed SSJ typeform)'],
      currentSchoolFromEventParticipant2: record.fields?.['Current School (from Event Participant) 2'],
      ssjTypeformsStartASchoolFromEventParticipant: record.fields?.['SSJ Typeforms: Start a School (from Event Participant)'],
      // Add more field transformations as needed
    }),
    cacheEnabled: true,
  },
  'Lead Routing and Templates': {
    airtableTable: 'Lead Routing and Templates',
    fieldMapping: schema.LEAD_ROUTING_AND_TEMPLATES_FIELDS,
    transformer: (record: any): schema.LeadRoutingTemplate => schema.createBaseTransformer(record, {
      state: record.fields?.['State'],
      sendgridTemplateId: record.fields?.['SendGrid Template ID'],
      geotype: record.fields?.['Geo-type'],
      cc: record.fields?.['cc'],
      source: record.fields?.['Source'],
      // Add more field transformations as needed
    }),
    cacheEnabled: true,
  },
  'Cohorts': {
    airtableTable: 'Cohorts',
    fieldMapping: schema.COHORTS_FIELDS,
    transformer: (record: any): schema.Cohort => schema.createBaseTransformer(record, {
      charters: record.fields?.['Charters'],
      cohortName: record.fields?.['Cohort Name'],
      schools: record.fields?.['Schools'],
      startDate: record.fields?.['Start Date'],
      programType: record.fields?.['Program Type'],
      // Add more field transformations as needed
    }),
    cacheEnabled: true,
  },
  'Events': {
    airtableTable: 'Events',
    fieldMapping: schema.EVENTS_FIELDS,
    transformer: (record: any): schema.Event => schema.createBaseTransformer(record, {
      date: record.fields?.['Date'],
      eventName: record.fields?.['Event Name'],
      type: record.fields?.['Type'],
      eventid: record.fields?.['event_id'],
      attendees: record.fields?.['Attendees'],
      // Add more field transformations as needed
    }),
    cacheEnabled: true,
  },
  'Board Service': {
    airtableTable: 'Board Service',
    fieldMapping: schema.BOARD_SERVICE_FIELDS,
    transformer: (record: any): schema.BoardService => schema.createBaseTransformer(record, {
      communityMemberName: record.fields?.['Community Member Name'],
      contactEmailFromEducator: record.fields?.['Contact Email (from Educator)'],
      startDate: record.fields?.['Start Date'],
      endDate: record.fields?.['End Date'],
      communityMemberEmail: record.fields?.['Community Member Email'],
      // Add more field transformations as needed
    }),
    cacheEnabled: true,
  },
  'Supabase join 990 with school': {
    airtableTable: 'Supabase join 990 with school',
    fieldMapping: schema.SUPABASE_JOIN_990_WITH_SCHOOL_FIELDS,
    transformer: (record: any): schema.Supabase990School => schema.createBaseTransformer(record, {
      shortname: record.fields?.['short_name'],
      id: record.fields?.['id'],
      nineNinetiesYear: record.fields?.['Nine Nineties Year'],
      // Add more field transformations as needed
    }),
    cacheEnabled: true,
  },
  'Charters': {
    airtableTable: 'Charters',
    fieldMapping: schema.CHARTERS_FIELDS,
    transformer: (record: any): schema.Charter => schema.createBaseTransformer(record, {
      locationIdFromLocations: record.fields?.['Location ID (from Locations)'],
      schools: record.fields?.['Schools'],
      charterAssessments: record.fields?.['Charter assessments'],
      incorporationDate: record.fields?.['Incorporation Date'],
      status: record.fields?.['Status'],
      // Add more field transformations as needed
    }),
    cacheEnabled: true,
  },
  'QBO School Codes': {
    airtableTable: 'QBO School Codes',
    fieldMapping: schema.QBO_SCHOOL_CODES_FIELDS,
    transformer: (record: any): schema.QBOSchoolCode => schema.createBaseTransformer(record, {
      customerIdInQbo: record.fields?.['Customer ID in QBO'],
      schools: record.fields?.['Schools'],
      schoolNameInQbo: record.fields?.['School Name in QBO'],
      // Add more field transformations as needed
    }),
    cacheEnabled: true,
  },
  'Action steps': {
    airtableTable: 'Action steps',
    fieldMapping: schema.ACTION_STEPS_FIELDS,
    transformer: (record: any): schema.ActionStep => schema.createBaseTransformer(record, {
      assigneeShortName: record.fields?.['Assignee Short Name'],
      completedDate: record.fields?.['Completed date'],
      schoolShortName: record.fields?.['School Short Name'],
      partnersCopy: record.fields?.['Partners copy'],
      schoolStatus: record.fields?.['School Status'],
      // Add more field transformations as needed
    }),
    cacheEnabled: true,
  },
  'Guides': {
    airtableTable: 'Guides',
    fieldMapping: schema.GUIDES_FIELDS,
    transformer: (record: any): schema.Guide => schema.createBaseTransformer(record, {
      stintTypeFromStints: record.fields?.['Stint type (from Stints)'],
      educatorRecordIds: record.fields?.['Educator Record IDs'],
      photo: record.fields?.['Photo'],
      name: record.fields?.['Name'],
      email: record.fields?.['Email'],
      // Add more field transformations as needed
    }),
    cacheEnabled: true,
  },
  'Charter roles': {
    airtableTable: 'Charter roles',
    fieldMapping: schema.CHARTER_ROLES_FIELDS,
    transformer: (record: any): schema.CharterRole => schema.createBaseTransformer(record, {
      charterApplications: record.fields?.['Charter applications'],
      email: record.fields?.['Email'],
      title: record.fields?.['Title'],
      charterId: record.fields?.['charter_id'],
      raceEthnicityFromEducatorRecord: record.fields?.['Race & Ethnicity (from Educator record)'],
      // Add more field transformations as needed
    }),
    cacheEnabled: true,
  },
  'Montessori Certs': {
    airtableTable: 'Montessori Certs',
    fieldMapping: schema.MONTESSORI_CERTS_FIELDS,
    transformer: (record: any): schema.MontessoriCert => schema.createBaseTransformer(record, {
      certifierOther: record.fields?.['Certifier - Other'],
      educatorId: record.fields?.['educator_id'],
      level: record.fields?.['Level'],
      yearCertified: record.fields?.['Year Certified'],
      abbreviation: record.fields?.['Abbreviation'],
      // Add more field transformations as needed
    }),
    cacheEnabled: true,
  },
  'Grants': {
    airtableTable: 'Grants',
    fieldMapping: schema.GRANTS_FIELDS,
    transformer: (record: any): schema.Grant => schema.createBaseTransformer(record, {
      proofOf501c3StatusAtTimeOfGrant: record.fields?.['Proof of 501(c)3 status at time of grant'],
      grantStatus: record.fields?.['Grant Status'],
      fundingPurposeForGrantAgreement: record.fields?.['Funding purpose (for grant agreement)'],
      guideentrepreneurShortName: record.fields?.['GuideEntrepreneur Short Name'],
      schoolContactEmailsFromSchool: record.fields?.['School Contact Emails (from School)'],
      // Add more field transformations as needed
    }),
    cacheEnabled: true,
  },
  'Mailing lists': {
    airtableTable: 'Mailing lists',
    fieldMapping: schema.MAILING_LISTS_FIELDS,
    transformer: (record: any): schema.MailingList => schema.createBaseTransformer(record, {
      educatorLog: record.fields?.['Educator Log'],
      type: record.fields?.['Type'],
      slug: record.fields?.['Slug'],
      name: record.fields?.['Name'],
      googleGroupId: record.fields?.['Google Group ID'],
      // Add more field transformations as needed
    }),
    cacheEnabled: true,
  },
  'Loan payments': {
    airtableTable: 'Loan payments',
    fieldMapping: schema.LOAN_PAYMENTS_FIELDS,
    transformer: (record: any): schema.LoanPayment => schema.createBaseTransformer(record, {
      amount: record.fields?.['Amount'],
      paymentDate: record.fields?.['Payment date'],
      school: record.fields?.['School'],
      shortName: record.fields?.['Short Name'],
      paymentKey: record.fields?.['Payment key'],
      // Add more field transformations as needed
    }),
    cacheEnabled: true,
  },
  'Loans': {
    airtableTable: 'Loans',
    fieldMapping: schema.LOANS_FIELDS,
    transformer: (record: any): schema.Loan => schema.createBaseTransformer(record, {
      schoolId: record.fields?.['school_id'],
      loanPaperwork: record.fields?.['Loan paperwork'],
      approximateOutstandingAmount: record.fields?.['Approximate Outstanding Amount'],
      loanid: record.fields?.['loan_id'],
      loanContactEmail1: record.fields?.['Loan Contact Email 1'],
      // Add more field transformations as needed
    }),
    cacheEnabled: true,
  },
  'Educator notes': {
    airtableTable: 'Educator notes',
    fieldMapping: schema.EDUCATOR_NOTES_FIELDS,
    transformer: (record: any): schema.EducatorNote => schema.createBaseTransformer(record, {
      notes: record.fields?.['Notes'],
      private: record.fields?.['Private'],
      createdBy: record.fields?.['Created by'],
      partnersCopy: record.fields?.['Partners copy'],
      educator: record.fields?.['Educator'],
      // Add more field transformations as needed
    }),
    cacheEnabled: true,
  },
  'Charter authorizers and contacts': {
    airtableTable: 'Charter authorizers and contacts',
    fieldMapping: schema.CHARTER_AUTHORIZERS_AND_CONTACTS_FIELDS,
    transformer: (record: any): schema.CharterAuthorizerContact => schema.createBaseTransformer(record, {
      authorizer: record.fields?.['Authorizer'],
      charter: record.fields?.['Charter'],
      title: record.fields?.['Title'],
      phone: record.fields?.['Phone'],
      email: record.fields?.['Email'],
      // Add more field transformations as needed
    }),
    cacheEnabled: true,
  },
  'Assessment data': {
    airtableTable: 'Assessment data',
    fieldMapping: schema.ASSESSMENT_DATA_FIELDS,
    transformer: (record: any): schema.AssessmentData => schema.createBaseTransformer(record, {
      assessmentDataKey: record.fields?.['Assessment Data key'],
      assessment: record.fields?.['Assessment'],
      metOrExceedsFrl: record.fields?.['Met or exceeds - FRL'],
      numberAssessedEll: record.fields?.['Number assessed - ELL'],
      year: record.fields?.['Year'],
      // Add more field transformations as needed
    }),
    cacheEnabled: true,
  },
  'Membership termination steps and dates': {
    airtableTable: 'Membership termination steps and dates',
    fieldMapping: schema.MEMBERSHIP_TERMINATION_STEPS_AND_DATES_FIELDS,
    transformer: (record: any): schema.MembershipTerminationStepDate => schema.createBaseTransformer(record, {
      fieldWithTargetDate: record.fields?.['field with target date'],
      stepName: record.fields?.['Step name'],
      dayOfProcess: record.fields?.['Day of process'],
      responsiblePersonAtWf: record.fields?.['Responsible person at WF'],
      // Add more field transformations as needed
    }),
    cacheEnabled: true,
  },
  'Educators x Schools': {
    airtableTable: 'Educators x Schools',
    fieldMapping: schema.EDUCATORS_X_SCHOOLS_FIELDS,
    transformer: (record: any): schema.EducatorSchoolAssociation => schema.createBaseTransformer(record, {
      edxschoolKey: record.fields?.['edXschool key'],
      invitedTo2024Refresher: record.fields?.['Invited to 2024 Refresher'],
      whoInitiatedEtlRemoval: record.fields?.['Who initiated E/TL removal?'],
      school: record.fields?.['School'],
      loanFund: record.fields?.['Loan Fund?'],
      // Add more field transformations as needed
    }),
    cacheEnabled: true,
  },
  'Nine nineties': {
    airtableTable: 'Nine nineties',
    fieldMapping: schema.NINE_NINETIES_FIELDS,
    transformer: (record: any): schema.Ninenineties => schema.createBaseTransformer(record, {
      supabaseid: record.fields?.['supabase_id'],
      aiDerivedRevenue: record.fields?.['AI Derived Revenue'],
      aiDerivedEoyDate: record.fields?.['AI Derived EOY Date'],
      nineNinetiesReportingYear: record.fields?.['Nine nineties Reporting Year'],
      schoolId: record.fields?.['school_id'],
      // Add more field transformations as needed
    }),
    cacheEnabled: true,
  },
  'Governance docs': {
    airtableTable: 'Governance docs',
    fieldMapping: schema.GOVERNANCE_DOCS_FIELDS,
    transformer: (record: any): schema.GovernanceDocument => schema.createBaseTransformer(record, {
      documentType: record.fields?.['Document type'],
      govdocid: record.fields?.['govdoc_id'],
      date: record.fields?.['Date'],
      docKey: record.fields?.['Doc Key'],
      charterId: record.fields?.['charter_id'],
      // Add more field transformations as needed
    }),
    cacheEnabled: true,
  },
  'Guides Assignments': {
    airtableTable: 'Guides Assignments',
    fieldMapping: schema.GUIDES_ASSIGNMENTS_FIELDS,
    transformer: (record: any): schema.GuideAssignment => schema.createBaseTransformer(record, {
      currentlyActive: record.fields?.['Currently active'],
      guideShortName: record.fields?.['Guide short name'],
      endDate: record.fields?.['End date'],
      schoolShortName: record.fields?.['School Short Name'],
      schoolId: record.fields?.['school_id'],
      // Add more field transformations as needed
    }),
    cacheEnabled: true,
  },
  'Training Grants': {
    airtableTable: 'Training Grants',
    fieldMapping: schema.TRAINING_GRANTS_FIELDS,
    transformer: (record: any): schema.TrainingGrant => schema.createBaseTransformer(record, {
      stageFromEducators: record.fields?.['Stage (from Educators)'],
      trainingStatus: record.fields?.['Training Status'],
      hubNameFromEducators: record.fields?.['Hub Name (from Educators)'],
      trainingGrantAmount: record.fields?.['Training Grant Amount'],
      statusFromEducators: record.fields?.['Status (from Educators)'],
      // Add more field transformations as needed
    }),
    cacheEnabled: true,
  },
  'Reports and submissions': {
    airtableTable: 'Reports and submissions',
    fieldMapping: schema.REPORTS_AND_SUBMISSIONS_FIELDS,
    transformer: (record: any): schema.ReportSubmission => schema.createBaseTransformer(record, {
      charter: record.fields?.['Charter'],
      reportsid: record.fields?.['reports_id'],
      attachments: record.fields?.['Attachments'],
      schoolYear: record.fields?.['School year'],
      reportType: record.fields?.['Report type'],
      // Add more field transformations as needed
    }),
    cacheEnabled: true,
  },
  'States Aliases': {
    airtableTable: 'States Aliases',
    fieldMapping: schema.STATES_ALIASES_FIELDS,
    transformer: (record: any): schema.StateAlias => schema.createBaseTransformer(record, {
      abbreviation: record.fields?.['Abbreviation'],
      state: record.fields?.['State'],
      // Add more field transformations as needed
    }),
    cacheEnabled: true,
  },
  'Public funding': {
    airtableTable: 'Public funding',
    fieldMapping: schema.PUBLIC_FUNDING_FIELDS,
    transformer: (record: any): schema.PublicFunding => schema.createBaseTransformer(record, {
      description: record.fields?.['Description'],
      schools: record.fields?.['Schools'],
      name: record.fields?.['Name'],
      relevantLevels: record.fields?.['Relevant levels'],
      // Add more field transformations as needed
    }),
    cacheEnabled: true,
  },
  'Annual enrollment and demographics': {
    airtableTable: 'Annual enrollment and demographics',
    fieldMapping: schema.ANNUAL_ENROLLMENT_AND_DEMOGRAPHICS_FIELDS,
    transformer: (record: any): schema.AnnualEnrollmentDemographic => schema.createBaseTransformer(record, {
      annualDataKey: record.fields?.['Annual data key'],
      school: record.fields?.['School'],
      numberOfEnrolledStudentsFrl: record.fields?.['Number of enrolled students - FRL'],
      numberOfEnrolledStudentsBipoc: record.fields?.['Number of enrolled students - BIPOC'],
      charter: record.fields?.['Charter'],
      // Add more field transformations as needed
    }),
    cacheEnabled: true,
  },
  'Assessments': {
    airtableTable: 'Assessments',
    fieldMapping: schema.ASSESSMENTS_FIELDS,
    transformer: (record: any): schema.Assessment => schema.createBaseTransformer(record, {
      shortName: record.fields?.['Short Name'],
      fullName: record.fields?.['Full Name'],
      domain: record.fields?.['Domain'],
      annualAssessmentImplementationsBySchool: record.fields?.['Annual Assessment Implementations by School'],
      grades: record.fields?.['Grades'],
      // Add more field transformations as needed
    }),
    cacheEnabled: true,
  },
  'Event types': {
    airtableTable: 'Event types',
    fieldMapping: schema.EVENT_TYPES_FIELDS,
    transformer: (record: any): schema.EventType => schema.createBaseTransformer(record, {
      events: record.fields?.['Events'],
      eventCategory: record.fields?.['Event Category'],
      // Add more field transformations as needed
    }),
    cacheEnabled: true,
  },
  'Email Addresses': {
    airtableTable: 'Email Addresses',
    fieldMapping: schema.EMAIL_ADDRESSES_FIELDS,
    transformer: (record: any): schema.EmailAddress => schema.createBaseTransformer(record, {
      emailType: record.fields?.['Email Type'],
      active: record.fields?.['Active?'],
      emailAddress: record.fields?.['Email Address'],
      educatorId: record.fields?.['educator_id'],
      educator: record.fields?.['Educator'],
      // Add more field transformations as needed
    }),
    cacheEnabled: true,
  },
  'Montessori Certifiers - old list': {
    airtableTable: 'Montessori Certifiers - old list',
    fieldMapping: schema.MONTESSORI_CERTIFIERS_OLD_LIST_FIELDS,
    transformer: (record: any): schema.MontessoriCertifierOld => schema.createBaseTransformer(record, {
      name: record.fields?.['Name'],
      ssjFilloutFormGetInvolved2: record.fields?.['SSJ Fillout Form: Get Involved 2'],
      ssjFilloutFormGetInvolved: record.fields?.['SSJ Fillout Form: Get Involved'],
      ssjFilloutFormGetInvolved4: record.fields?.['SSJ Fillout Form: Get Involved 4'],
      abbreviation: record.fields?.['Abbreviation'],
      // Add more field transformations as needed
    }),
    cacheEnabled: true,
  },
  'Marketing source options': {
    airtableTable: 'Marketing source options',
    fieldMapping: schema.MARKETING_SOURCE_OPTIONS_FIELDS,
    transformer: (record: any): schema.MarketingSourceOption => schema.createBaseTransformer(record, {
      marketingSource: record.fields?.['Marketing Source'],
      educators: record.fields?.['Educators'],
      // Add more field transformations as needed
    }),
    cacheEnabled: true,
  },
  'Montessori Cert Levels': {
    airtableTable: 'Montessori Cert Levels',
    fieldMapping: schema.MONTESSORI_CERT_LEVELS_FIELDS,
    transformer: (record: any): schema.MontessoriCertLevel => schema.createBaseTransformer(record, {
      name: record.fields?.['Name'],
      educators: record.fields?.['Educators'],
      // Add more field transformations as needed
    }),
    cacheEnabled: true,
  },
  'Race and Ethnicity': {
    airtableTable: 'Race and Ethnicity',
    fieldMapping: schema.RACE_AND_ETHNICITY_FIELDS,
    transformer: (record: any): schema.RaceAndEthnicity => schema.createBaseTransformer(record, {
      ssjFilloutFormGetInvolved: record.fields?.['SSJ Fillout Form: Get Involved'],
      name: record.fields?.['Name'],
      // Add more field transformations as needed
    }),
    cacheEnabled: true,
  },
  'Ages-Grades': {
    airtableTable: 'Ages-Grades',
    fieldMapping: schema.AGES_GRADES_FIELDS,
    transformer: (record: any): schema.AgeGrade => schema.createBaseTransformer(record, {
      name: record.fields?.['Name'],
      // Add more field transformations as needed
    }),
    cacheEnabled: true,
  },
  'Montessori Certifiers': {
    airtableTable: 'Montessori Certifiers',
    fieldMapping: schema.MONTESSORI_CERTIFIERS_FIELDS,
    transformer: (record: any): schema.MontessoriCertifier => schema.createBaseTransformer(record, {
      abbreviation: record.fields?.['Abbreviation'],
      name: record.fields?.['Name'],
      // Add more field transformations as needed
    }),
    cacheEnabled: true,
  },
} as const;

// Generic CRUD operations
export async function getAll<T>(tableName: string): Promise<T[]> {
  const cacheKey = getCacheKey(tableName, 'getAll');
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const config = TABLE_CONFIG[tableName];
  if (!config) {
    throw new Error(`Table configuration not found for: ${tableName}`);
  }

  try {
    // Implement Airtable API call here
    const records = []; // Placeholder - implement actual Airtable API call
    const transformed = records.map(config.transformer);
    
    if (config.cacheEnabled) {
      setCache(cacheKey, transformed);
    }
    
    return transformed;
  } catch (error) {
    console.error(`Error fetching from ${tableName}:`, error);
    throw error;
  }
}

export async function getById<T>(tableName: string, id: string): Promise<T | null> {
  const cacheKey = getCacheKey(tableName, 'getById', id);
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const config = TABLE_CONFIG[tableName];
  if (!config) {
    throw new Error(`Table configuration not found for: ${tableName}`);
  }

  try {
    // Implement Airtable API call here
    const record = null; // Placeholder - implement actual Airtable API call
    if (!record) return null;
    
    const transformed = config.transformer(record);
    
    if (config.cacheEnabled) {
      setCache(cacheKey, transformed);
    }
    
    return transformed as T;
  } catch (error) {
    console.error(`Error fetching ${id} from ${tableName}:`, error);
    throw error;
  }
}

// Convenience methods for each table
export const getPartners = () => getAll<schema.Partner>('Partners copy');
export const getPartnerById = (id: string) => getById<schema.Partner>('Partners copy', id);
export const getSSJFilloutForms = () => getAll<schema.SSJFilloutForm>('SSJ Fillout Forms');
export const getSSJFilloutFormById = (id: string) => getById<schema.SSJFilloutForm>('SSJ Fillout Forms', id);
export const getMarketingSourceMappings = () => getAll<schema.MarketingSourceMapping>('Marketing sources mapping');
export const getMarketingSourceMappingById = (id: string) => getById<schema.MarketingSourceMapping>('Marketing sources mapping', id);
export const getCharterApplications = () => getAll<schema.CharterApplication>('Charter applications');
export const getCharterApplicationById = (id: string) => getById<schema.CharterApplication>('Charter applications', id);
export const getSchools = () => getAll<schema.School>('Schools');
export const getSchoolById = (id: string) => getById<schema.School>('Schools', id);
export const getEducators = () => getAll<schema.Educator>('Educators');
export const getEducatorById = (id: string) => getById<schema.Educator>('Educators', id);
export const getSSJTypeforms = () => getAll<schema.SSJTypeform>('SSJ Typeforms: Start a School');
export const getSSJTypeformById = (id: string) => getById<schema.SSJTypeform>('SSJ Typeforms: Start a School', id);
export const getSchoolNotes = () => getAll<schema.SchoolNote>('School notes');
export const getSchoolNoteById = (id: string) => getById<schema.SchoolNote>('School notes', id);
export const getMembershipTerminationSteps = () => getAll<schema.MembershipTerminationStep>('Membership termination steps');
export const getMembershipTerminationStepById = (id: string) => getById<schema.MembershipTerminationStep>('Membership termination steps', id);
export const getLocations = () => getAll<schema.Location>('Locations');
export const getLocationById = (id: string) => getById<schema.Location>('Locations', id);
export const getEventAttendances = () => getAll<schema.EventAttendance>('Event attendance');
export const getEventAttendanceById = (id: string) => getById<schema.EventAttendance>('Event attendance', id);
export const getLeadRoutingTemplates = () => getAll<schema.LeadRoutingTemplate>('Lead Routing and Templates');
export const getLeadRoutingTemplateById = (id: string) => getById<schema.LeadRoutingTemplate>('Lead Routing and Templates', id);
export const getCohorts = () => getAll<schema.Cohort>('Cohorts');
export const getCohortById = (id: string) => getById<schema.Cohort>('Cohorts', id);
export const getEvents = () => getAll<schema.Event>('Events');
export const getEventById = (id: string) => getById<schema.Event>('Events', id);
export const getBoardServices = () => getAll<schema.BoardService>('Board Service');
export const getBoardServiceById = (id: string) => getById<schema.BoardService>('Board Service', id);
export const getSupabase990Schools = () => getAll<schema.Supabase990School>('Supabase join 990 with school');
export const getSupabase990SchoolById = (id: string) => getById<schema.Supabase990School>('Supabase join 990 with school', id);
export const getCharters = () => getAll<schema.Charter>('Charters');
export const getCharterById = (id: string) => getById<schema.Charter>('Charters', id);
export const getQBOSchoolCodes = () => getAll<schema.QBOSchoolCode>('QBO School Codes');
export const getQBOSchoolCodeById = (id: string) => getById<schema.QBOSchoolCode>('QBO School Codes', id);
export const getActionSteps = () => getAll<schema.ActionStep>('Action steps');
export const getActionStepById = (id: string) => getById<schema.ActionStep>('Action steps', id);
export const getGuides = () => getAll<schema.Guide>('Guides');
export const getGuideById = (id: string) => getById<schema.Guide>('Guides', id);
export const getCharterRoles = () => getAll<schema.CharterRole>('Charter roles');
export const getCharterRoleById = (id: string) => getById<schema.CharterRole>('Charter roles', id);
export const getMontessoriCerts = () => getAll<schema.MontessoriCert>('Montessori Certs');
export const getMontessoriCertById = (id: string) => getById<schema.MontessoriCert>('Montessori Certs', id);
export const getGrants = () => getAll<schema.Grant>('Grants');
export const getGrantById = (id: string) => getById<schema.Grant>('Grants', id);
export const getMailingLists = () => getAll<schema.MailingList>('Mailing lists');
export const getMailingListById = (id: string) => getById<schema.MailingList>('Mailing lists', id);
export const getLoanPayments = () => getAll<schema.LoanPayment>('Loan payments');
export const getLoanPaymentById = (id: string) => getById<schema.LoanPayment>('Loan payments', id);
export const getLoans = () => getAll<schema.Loan>('Loans');
export const getLoanById = (id: string) => getById<schema.Loan>('Loans', id);
export const getEducatorNotes = () => getAll<schema.EducatorNote>('Educator notes');
export const getEducatorNoteById = (id: string) => getById<schema.EducatorNote>('Educator notes', id);
export const getCharterAuthorizerContacts = () => getAll<schema.CharterAuthorizerContact>('Charter authorizers and contacts');
export const getCharterAuthorizerContactById = (id: string) => getById<schema.CharterAuthorizerContact>('Charter authorizers and contacts', id);
export const getAssessmentDatas = () => getAll<schema.AssessmentData>('Assessment data');
export const getAssessmentDataById = (id: string) => getById<schema.AssessmentData>('Assessment data', id);
export const getMembershipTerminationStepDates = () => getAll<schema.MembershipTerminationStepDate>('Membership termination steps and dates');
export const getMembershipTerminationStepDateById = (id: string) => getById<schema.MembershipTerminationStepDate>('Membership termination steps and dates', id);
export const getEducatorSchoolAssociations = () => getAll<schema.EducatorSchoolAssociation>('Educators x Schools');
export const getEducatorSchoolAssociationById = (id: string) => getById<schema.EducatorSchoolAssociation>('Educators x Schools', id);
export const getNineninetiess = () => getAll<schema.Ninenineties>('Nine nineties');
export const getNineninetiesById = (id: string) => getById<schema.Ninenineties>('Nine nineties', id);
export const getGovernanceDocuments = () => getAll<schema.GovernanceDocument>('Governance docs');
export const getGovernanceDocumentById = (id: string) => getById<schema.GovernanceDocument>('Governance docs', id);
export const getGuideAssignments = () => getAll<schema.GuideAssignment>('Guides Assignments');
export const getGuideAssignmentById = (id: string) => getById<schema.GuideAssignment>('Guides Assignments', id);
export const getTrainingGrants = () => getAll<schema.TrainingGrant>('Training Grants');
export const getTrainingGrantById = (id: string) => getById<schema.TrainingGrant>('Training Grants', id);
export const getReportSubmissions = () => getAll<schema.ReportSubmission>('Reports and submissions');
export const getReportSubmissionById = (id: string) => getById<schema.ReportSubmission>('Reports and submissions', id);
export const getStateAliass = () => getAll<schema.StateAlias>('States Aliases');
export const getStateAliasById = (id: string) => getById<schema.StateAlias>('States Aliases', id);
export const getPublicFundings = () => getAll<schema.PublicFunding>('Public funding');
export const getPublicFundingById = (id: string) => getById<schema.PublicFunding>('Public funding', id);
export const getAnnualEnrollmentDemographics = () => getAll<schema.AnnualEnrollmentDemographic>('Annual enrollment and demographics');
export const getAnnualEnrollmentDemographicById = (id: string) => getById<schema.AnnualEnrollmentDemographic>('Annual enrollment and demographics', id);
export const getAssessments = () => getAll<schema.Assessment>('Assessments');
export const getAssessmentById = (id: string) => getById<schema.Assessment>('Assessments', id);
export const getEventTypes = () => getAll<schema.EventType>('Event types');
export const getEventTypeById = (id: string) => getById<schema.EventType>('Event types', id);
export const getEmailAddresss = () => getAll<schema.EmailAddress>('Email Addresses');
export const getEmailAddressById = (id: string) => getById<schema.EmailAddress>('Email Addresses', id);
export const getMontessoriCertifierOlds = () => getAll<schema.MontessoriCertifierOld>('Montessori Certifiers - old list');
export const getMontessoriCertifierOldById = (id: string) => getById<schema.MontessoriCertifierOld>('Montessori Certifiers - old list', id);
export const getMarketingSourceOptions = () => getAll<schema.MarketingSourceOption>('Marketing source options');
export const getMarketingSourceOptionById = (id: string) => getById<schema.MarketingSourceOption>('Marketing source options', id);
export const getMontessoriCertLevels = () => getAll<schema.MontessoriCertLevel>('Montessori Cert Levels');
export const getMontessoriCertLevelById = (id: string) => getById<schema.MontessoriCertLevel>('Montessori Cert Levels', id);
export const getRaceAndEthnicitys = () => getAll<schema.RaceAndEthnicity>('Race and Ethnicity');
export const getRaceAndEthnicityById = (id: string) => getById<schema.RaceAndEthnicity>('Race and Ethnicity', id);
export const getAgeGrades = () => getAll<schema.AgeGrade>('Ages-Grades');
export const getAgeGradeById = (id: string) => getById<schema.AgeGrade>('Ages-Grades', id);
export const getMontessoriCertifiers = () => getAll<schema.MontessoriCertifier>('Montessori Certifiers');
export const getMontessoriCertifierById = (id: string) => getById<schema.MontessoriCertifier>('Montessori Certifiers', id);
