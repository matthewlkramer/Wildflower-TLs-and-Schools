// Generated generic storage with metadata-driven table configuration
// Generated on 2025-09-09T19:28:50.213Z
// This file is auto-generated. Do not edit manually.

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../shared/schema.generated';

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
    transformer: (record: any): schema.Partner => {
      const f = record.fields;
      return schema.createBaseTransformer(record, {
        roles: schema.toStringArray(f["Roles"]) || undefined,
        emailTemplates: String(f["Email templates"] || undefined) || undefined,
        educatorRecordIds: String(f["Educator Record IDs"] || undefined) || undefined,
        grants5: schema.toStringArray(f["Grants 5"]) || undefined,
        guideAssignments: String(f["Guide assignments"] || undefined) || undefined,
        shortName: String(f["Short name"] || undefined) || undefined,
        publicWebsiteActive: Boolean(f["Public website active"]) || undefined,
        websiteBio: String(f["Website bio"] || undefined) || undefined,
        educatorNotes: schema.toStringArray(f["Educator notes"]) || undefined,
        startDateFromStints: String(f["Start Date (from Stints)"] || undefined) || undefined,
        endDateFromStints: String(f["End Date (from Stints)"] || undefined) || undefined,
        currentlyActive: String(f["Currently active"] || undefined) || undefined,
        slackHandle: String(f["Slack handle"] || undefined) || undefined,
        actionSteps: schema.toStringArray(f["Action steps"]) || undefined,
        dob: String(f["DOB"] || undefined) || undefined,
        recordId: String(f["Record ID"] || undefined) || undefined,
        photo: schema.toStringArray(f["Photo"].map(att => att?.url).filter(Boolean)) || undefined,
        activeStint: schema.toStringArray(f["Active stint"]) || undefined,
        tls: schema.toStringArray(f["TLs"]) || undefined,
        phone: String(f["Phone"] || undefined) || undefined,
        papyrsProfile: String(f["Papyrs profile"] || undefined) || undefined,
        stintTypeFromStints: schema.toStringArray(f["Stint type (from Stints)"]) || undefined,
        name: String(f["Name"] || undefined) || undefined,
        homeAddress: String(f["Home address"] || undefined) || undefined,
        schools: schema.toStringArray(f["Schools"]) || undefined,
        schoolNotes: schema.toStringArray(f["School notes"]) || undefined,
        email: String(f["Email"] || undefined) || undefined,
        guidedSchoolRecordId: String(f["Guided School Record ID"] || undefined) || undefined,
        ssjProcessDetails: String(f["SSJ Process Details"] || undefined) || undefined,
        personalEmail: String(f["Personal Email"] || undefined) || undefined,
        syncedRecordId: String(f["Synced Record ID"] || undefined) || undefined,
        imageUrl: String(f["Image URL"] || undefined) || undefined,
        membershipTerminationStepsAndDates: String(f["Membership termination steps and dates"] || undefined) || undefined,
        copperUserid: String(f["Copper userID"] || undefined) || undefined,
        emailOrName: String(f["email or name"] || undefined) || undefined
      });
    },
    cacheEnabled: true,
  },
  'SSJ Fillout Forms': {
    airtableTable: 'SSJ Fillout Forms',
    fieldMapping: schema.SSJ_FILLOUT_FORMS_FIELDS,
    transformer: (record: any): schema.SSJFilloutForm => {
      const f = record.fields;
      return schema.createBaseTransformer(record, {
        isInterestedInCharterFromEmail: schema.toYesBool(f["Is Interested in Charter (from Email)"]) || undefined,
        tempMCertCert1: String(f["Temp - M Cert Cert 1"] || undefined) || undefined,
        socioeconomicGenderOther: String(f["Socio-Economic: Gender Other"] || undefined) || undefined,
        tempMCertLevel3: String(f["Temp - M Cert Level 3"] || undefined) || undefined,
        socioeconomicRaceEthnicityOther: String(f["Socio-Economic: Race & Ethnicity Other"] || undefined) || undefined,
        montessoriCertificationCertifier2: schema.toStringArray(f["Montessori Certification Certifier 2"]) || undefined,
        receiveCommunications: String(f["Receive Communications"] || undefined) || undefined,
        socioeconomicRaceEthnicity: schema.toStringArray(f["Socio-Economic: Race & Ethnicity"]) || undefined,
        communityMemberInterest: String(f["Community Member Interest"] || undefined) || undefined,
        montessoriCertificationYear3: String(f["Montessori Certification Year 3"] || undefined) || undefined,
        tempMCertYear4: String(f["Temp - M Cert Year 4"] || undefined) || undefined,
        statusOfProcessingMontessoriCerts: String(f["Status of Processing Montessori Certs"] || undefined) || undefined,
        tempMCertYear2: String(f["Temp - M Cert Year 2"] || undefined) || undefined,
        contactTypeStandardized: String(f["Contact Type standardized"] || undefined) || undefined,
        city: String(f["City"] || undefined) || undefined,
        marketingCampaign: String(f["Marketing Campaign"] || undefined) || undefined,
        stateStandardized: String(f["State Standardized"] || undefined) || undefined,
        montessoriCertQ: String(f["Montessori Cert Q"] || undefined) || undefined,
        tempMCertLevel4: String(f["Temp - M Cert Level 4"] || undefined) || undefined,
        primaryLanguage: String(f["Primary Language"] || undefined) || undefined,
        firstName: String(f["First Name"] || undefined) || undefined,
        initialOutreacher: String(f["Initial Outreacher"] || undefined) || undefined,
        country2: String(f["Country 2"] || undefined) || undefined,
        tempMCertCert3: String(f["Temp - M Cert Cert 3"] || undefined) || undefined,
        assignedPartnerOverride: String(f["Assigned Partner Override"] || undefined) || undefined,
        montessoriCertificationLevel1: schema.toStringArray(f["Montessori Certification Level 1"]) || undefined,
        state2: String(f["State 2"] || undefined) || undefined,
        socioeconomicHouseholdIncome: String(f["Socio-Economic: Household Income"] || undefined) || undefined,
        montessoriCertificationYear4: String(f["Montessori Certification Year 4"] || undefined) || undefined,
        routedTo: String(f["Routed To"] || undefined) || undefined,
        socioeconomicGender: String(f["Socio-Economic: Gender"] || undefined) || undefined,
        entryDate: String(f["Entry Date"] || undefined) || undefined,
        tempMCertLevel2: String(f["Temp - M Cert Level 2"] || undefined) || undefined,
        marketingSource: String(f["Marketing Source"] || undefined) || undefined,
        sendgridSentDate: String(f["SendGrid sent date"] || undefined) || undefined,
        city2: String(f["City 2"] || undefined) || undefined,
        ssjfilloutformid: String(f["ssj_fillout_form_id"] || undefined) || undefined,
        montessoriCertificationLevel3: schema.toStringArray(f["Montessori Certification Level 3"]) || undefined,
        montessoriCertificationYear2: String(f["Montessori Certification Year 2"] || undefined) || undefined,
        fullName: String(f["Full Name"] || undefined) || undefined,
        educatorInterestsOther: String(f["Educator Interests Other"] || undefined) || undefined,
        isSeekingMontessoriCertification: String(f["Is Seeking Montessori Certification"] || undefined) || undefined,
        email: String(f["Email"] || undefined) || undefined,
        sendgridTemplateId: String(f["SendGrid template id"] || undefined) || undefined,
        assignedPartnerFromEducators: String(f["Assigned Partner (from Educators)"] || undefined) || undefined,
        genderStandardized: String(f["Gender standardized"] || undefined) || undefined,
        educatorId: String(f["educator_id"] || undefined) || undefined,
        montessoriCertificationYear1: String(f["Montessori Certification Year 1"] || undefined) || undefined,
        montessoriCertificationCertifier1: schema.toStringArray(f["Montessori Certification Certifier 1"]) || undefined,
        tempMCertYear1: String(f["Temp - M Cert Year 1"] || undefined) || undefined,
        communityMemberCommunityInfo: String(f["Community Member Community Info"] || undefined) || undefined,
        communityMemberSupportFindingTeachers: Boolean(f["Community Member Support Finding Teachers"]) || undefined,
        sourceForNontls: String(f["Source for non-TLs"] || undefined) || undefined,
        formVersion: String(f["Form version"] || undefined) || undefined,
        socioeconomicLgbtqiaIdentifyingFromEmail: schema.toYesBool(f["Socio-Economic: LGBTQIA Identifying (from Email)"]) || undefined,
        tempMCertCert2: String(f["Temp - M Cert Cert 2"] || undefined) || undefined,
        communityMemberSelfInfo: String(f["Community Member Self Info"] || undefined) || undefined,
        ssjFilloutFormKey: String(f["SSJ FIllout Form key"] || undefined) || undefined,
        tempMCertYear3: String(f["Temp - M Cert Year 3"] || undefined) || undefined,
        educators: schema.toStringArray(f["Educators"]) || undefined,
        linkToStartASchool: schema.toStringArray(f["Link to Start a School"]) || undefined,
        personResponsibleForFollowUp: String(f["Person responsible for follow up"] || undefined) || undefined,
        socioeconomicPronounsOther: String(f["Socio-Economic: Pronouns Other"] || undefined) || undefined,
        country: String(f["Country"] || undefined) || undefined,
        emailSentByInitialOutreacher: schema.toYesBool(f["Email sent by Initial Outreacher?"]) || undefined,
        sourceOther: String(f["Source - other"] || undefined) || undefined,
        lastName: String(f["Last Name"] || undefined) || undefined,
        state: String(f["State"] || undefined) || undefined,
        socioeconomicPronouns: String(f["Socio-Economic: Pronouns"] || undefined) || undefined,
        contactType: String(f["Contact Type"] || undefined) || undefined,
        isMontessoriCertified: String(f["Is Montessori Certified"] || undefined) || undefined,
        tempMCertCert4: String(f["Temp - M Cert Cert 4"] || undefined) || undefined,
        montessoriCertificationLevel2: schema.toStringArray(f["Montessori Certification Level 2"]) || undefined,
        tempMCertLevel1: String(f["Temp - M Cert Level 1"] || undefined) || undefined,
        primaryLanguageOther: String(f["Primary Language Other"] || undefined) || undefined,
        oneOnOneStatus: String(f["One on one status"] || undefined) || undefined,
        interestedInCharter: Boolean(f["Interested in charter"]) || undefined,
        montessoriCertificationCertifier3: schema.toStringArray(f["Montessori Certification Certifier 3"]) || undefined,
        message: String(f["Message"] || undefined) || undefined,
        source: String(f["Source"] || undefined) || undefined,
        montessoriCertificationCertifier4: schema.toStringArray(f["Montessori Certification Certifier 4"]) || undefined
      });
    },
    cacheEnabled: true,
  },
  'Marketing sources mapping': {
    airtableTable: 'Marketing sources mapping',
    fieldMapping: schema.MARKETING_SOURCES_MAPPING_FIELDS,
    transformer: (record: any): schema.MarketingSourceMapping => {
      const f = record.fields;
      return schema.createBaseTransformer(record, {
        recid: String(f["recID"] || undefined) || undefined,
        educatorsOptions: String(f["Educators options"] || undefined) || undefined,
        educatorsOther: String(f["Educators other"] || undefined) || undefined,
        filloutOptions: String(f["Fillout options"] || undefined) || undefined
      });
    },
    cacheEnabled: true,
  },
  'Charter applications': {
    airtableTable: 'Charter applications',
    fieldMapping: schema.CHARTER_APPLICATIONS_FIELDS,
    transformer: (record: any): schema.CharterApplication => {
      const f = record.fields;
      return schema.createBaseTransformer(record, {
        capacityInterviewComplete: String(f["Capacity Interview Complete"] || undefined) || undefined,
        capacityInterviewProjectedDate: String(f["Capacity Interview Projected Date"] || undefined) || undefined,
        charter: schema.toStringArray(f["Charter"]) || undefined,
        letterOfIntentDeadline: String(f["Letter of Intent deadline"] || undefined) || undefined,
        nonprofitStatus: String(f["Nonprofit status"] || undefined) || undefined,
        authorizerDecisionRecd: String(f["Authorizer decision rec'd"] || undefined) || undefined,
        targetCommunityFromCharter: String(f["Target community (from Charter)"] || undefined) || undefined,
        finalBudget: schema.toStringArray(f["Final budget"].map(att => att?.url).filter(Boolean)) || undefined,
        currentTlDiscoveryStatus: String(f["Current TL discovery status"] || undefined) || undefined,
        likelihoodOfOpeningOnTime: String(f["Likelihood of opening on time"] || undefined) || undefined,
        authorizerDecision: String(f["Authorizer decision"] || undefined) || undefined,
        shortName: String(f["Short Name"] || undefined) || undefined,
        budgetPlanningExercises: schema.toStringArray(f["Budget planning exercises"].map(att => att?.url).filter(Boolean)) || undefined,
        fullName: String(f["Full Name"] || undefined) || undefined,
        charterappid: String(f["charter_app_id"] || undefined) || undefined,
        milestones: String(f["Milestones"] || undefined) || undefined,
        membershipStatusOfSchools: String(f["Membership status of schools"] || undefined) || undefined,
        grades: String(f["Grades"] || undefined) || undefined,
        charterAppKey: String(f["Charter App key"] || undefined) || undefined,
        letterOfIntentReqd: String(f["Letter of Intent req'd"] || undefined) || undefined,
        authorizerDecisionExpectedDate: String(f["Authorizer decision expected date"] || undefined) || undefined,
        keyDates: String(f["Key dates"] || undefined) || undefined,
        expectedDecision: String(f["Expected decision"] || undefined) || undefined,
        opportunitiesAndChallenges: String(f["Opportunities and challenges"] || undefined) || undefined,
        OfStudents: schema.toNumber(f["# of students"]) || undefined,
        appSubmissionDeadline: String(f["App submission deadline"] || undefined) || undefined,
        likelihoodOfAuthorization: String(f["Likelihood of authorization"] || undefined) || undefined,
        currentTlsFromSchoolsFromCharter: String(f["Current TLs (from Schools) (from Charter)"] || undefined) || undefined,
        landscapeAnalysisFromCharter: String(f["Landscape analysis (from Charter)"] || undefined) || undefined,
        charterAppProjectMgmtPlanComplete: Boolean(f["Charter app project mgmt plan complete"]) || undefined,
        appSubmitted: String(f["App submitted"] || undefined) || undefined,
        charterDesign: schema.toStringArray(f["Charter design"].map(att => att?.url).filter(Boolean)) || undefined,
        mostRecentApplication: Boolean(f["Most recent application"]) || undefined,
        boardMembershipAgreementSigned: String(f["Board membership agreement signed"] || undefined) || undefined,
        targetOpen: String(f["Target open"] || undefined) || undefined,
        beginningAge: schema.toStringArray(f["Beginning age"]) || undefined,
        cohortsFromCharter: String(f["Cohorts (from Charter)"] || undefined) || undefined,
        logicModelComplete: Boolean(f["Logic model complete"]) || undefined,
        endingAge: schema.toStringArray(f["Ending age"]) || undefined,
        charterDesignAdviceSessionComplete: String(f["Charter Design Advice Session Complete"] || undefined) || undefined,
        loi: schema.toStringArray(f["LOI"].map(att => att?.url).filter(Boolean)) || undefined,
        loiSubmitted: String(f["LOI submitted"] || undefined) || undefined,
        authorizer: String(f["Authorizer"] || undefined) || undefined,
        charterAppRolesIdd: Boolean(f["Charter app roles ID'd"]) || undefined,
        communityEngagementPlanLaunched: Boolean(f["Community engagement plan launched"]) || undefined,
        jointKickoffMeetingComplete: Boolean(f["Joint kickoff meeting complete"]) || undefined,
        supportTimeline: schema.toStringArray(f["Support timeline"].map(att => att?.url).filter(Boolean)) || undefined,
        status: String(f["Status"] || undefined) || undefined,
        capacityInterviewTrainingComplete: Boolean(f["Capacity interview training complete"]) || undefined,
        charterlevelMembershipAgreementSigned: String(f["Charter-level membership agreement signed"] || undefined) || undefined,
        charterAppWalkthrough: String(f["Charter app walkthrough"] || undefined) || undefined,
        tlMembershipAgreementSigned: String(f["TL membership agreement signed"] || undefined) || undefined,
        applicationWindow: String(f["Application window"] || undefined) || undefined,
        charterId: String(f["charter_id"] || ""),
        internalWfSupportLaunchMeeting: String(f["Internal WF support launch meeting"] || undefined) || undefined,
        jointKickoffMeeting: String(f["Joint kickoff meeting"] || undefined) || undefined
      });
    },
    cacheEnabled: true,
  },
  'Schools': {
    airtableTable: 'Schools',
    fieldMapping: schema.SCHOOLS_FIELDS,
    transformer: (record: any): schema.School => {
      const f = record.fields;
      return schema.createBaseTransformer(record, {
        numberOfClassrooms: schema.toNumber(f["Number of classrooms"]) || undefined,
        lease: String(f["Lease"] || undefined) || undefined,
        gusto: String(f["Gusto"] || undefined) || undefined,
        enrollmentAtFullCapacity: schema.toNumber(f["Enrollment at Full Capacity"]) || undefined,
        ssjIsTheSchoolPlanningToApplyForInternalWildflowerFunding: String(f["SSJ - Is the school planning to apply for internal Wildflower funding?"] || undefined) || undefined,
        guideEmail: String(f["Guide email"] || undefined) || undefined,
        locationid: String(f["location_id"] || undefined) || undefined,
        emailDomain: String(f["Email Domain"] || undefined) || undefined,
        ssjCohortStatus: String(f["SSJ - Cohort Status"] || undefined) || undefined,
        visioningAlbumComplete: Boolean(f["Visioning album complete"]) || undefined,
        transparentClassroom: String(f["Transparent Classroom"] || undefined) || undefined,
        ssjOriginalProjectedOpenDate: String(f["SSJ - Original Projected Open Date"] || undefined) || undefined,
        latinxFromFamilySurvey: String(f["Latinx (from Family Survey)"] || undefined) || undefined,
        logoUrl: String(f["Logo URL"] || undefined) || undefined,
        globalMajority: String(f["global majority"] || undefined) || undefined,
        ssjGapInFunding: String(f["SSJ - Gap in Funding"] || undefined) || undefined,
        planningAlbum: schema.toStringArray(f["Planning album"].map(att => att?.url).filter(Boolean)) || undefined,
        countOfActiveMailingAddresses: schema.toNumber(f["Count of Active Mailing Addresses"]) || undefined,
        websiteTool: String(f["Website tool"] || undefined) || undefined,
        charterId: String(f["charter_id"] || undefined) || undefined,
        schoolEmail: String(f["School Email"] || undefined) || undefined,
        ssjLoanEligibility: String(f["SSJ - Loan eligibility"] || undefined) || undefined,
        facebook: String(f["Facebook"] || undefined) || undefined,
        currentPhysicalAddress: String(f["Current Physical Address"] || undefined) || undefined,
        ssjProjOpenSchoolYearBackup: String(f["SSJ - Proj Open School Year - Backup"] || undefined) || undefined,
        primaryContactEmail: String(f["Primary Contact Email"] || undefined) || undefined,
        locations: schema.toStringArray(f["Locations"]) || undefined,
        frl: String(f["FRL"] || undefined) || undefined,
        guideassignmentid: String(f["guide_assignment_id"] || undefined) || undefined,
        opened: String(f["Opened"] || undefined) || undefined,
        governanceModel: String(f["Governance Model"] || undefined) || undefined,
        leaseEndDate: String(f["Lease End Date"] || undefined) || undefined,
        enteredPlanningDate: String(f["Entered Planning Date"] || undefined) || undefined,
        dateWithdrawnFromGroupExemption: String(f["Date withdrawn from Group Exemption"] || undefined) || undefined,
        nondiscriminationPolicyOnApplication: Boolean(f["Nondiscrimination Policy on Application"]) || undefined,
        ssjIsTheBudgetAtAStageThatWillAllowTheEtlsToTakeTheirNextSteps: String(f["SSJ - Is the budget at a stage that will allow the ETL(s) to take their next steps?"] || undefined) || undefined,
        emailAtSchoolFromEducatorsXSchools: String(f["Email at School (from Educators x Schools)"] || undefined) || undefined,
        mediumIncome: String(f["Medium Income"] || undefined) || undefined,
        legalName: String(f["Legal Name"] || undefined) || undefined,
        agreementVersion: String(f["Agreement Version "] || undefined) || undefined,
        familysurveyid: String(f["family_survey_id"] || undefined) || undefined,
        isThereA2022990: schema.toNumber(f["Is there a 2022 990?"]) || undefined,
        highIncomeFromFamilySurvey: String(f["High Income (from Family Survey)"] || undefined) || undefined,
        groupExemptionStatus: String(f["Group exemption status"] || undefined) || undefined,
        nineNinetiesAttachment: String(f["Nine Nineties attachment"] || undefined) || undefined,
        membershipAgreementDate: String(f["Membership Agreement date"] || undefined) || undefined,
        lowIncome: String(f["Low Income"] || undefined) || undefined,
        currentTls: String(f["Current TLs"] || undefined) || undefined,
        OfFormsSent: String(f["# of forms sent"] || undefined) || undefined,
        shortName: String(f["Short Name"] || undefined) || undefined,
        flexibleTuitionModel: Boolean(f["Flexible Tuition Model"]) || undefined,
        grantsWf: schema.toStringArray(f["Grants (WF)"]) || undefined,
        googleVoice: String(f["Google Voice"] || undefined) || undefined,
        grantid: String(f["grant_id"] || undefined) || undefined,
        schoolNotes: schema.toStringArray(f["School notes"]) || undefined,
        signedMembershipAgreement: schema.toStringArray(f["Signed Membership Agreement"].map(att => att?.url).filter(Boolean)) || undefined,
        ssjFacility: String(f["SSJ - Facility"] || undefined) || undefined,
        ssjTargetCity: String(f["SSJ - Target City"] || undefined) || undefined,
        nondiscriminationPolicyOnWebsite: Boolean(f["Nondiscrimination Policy on Website"]) || undefined,
        nativeAmericanFromFamilySurvey: String(f["Native American (from Family Survey)"] || undefined) || undefined,
        agesServed: schema.toStringArray(f["Ages served"]) || undefined,
        ssjIsTheTeamOnTrackForTheirEnrollmentGoals: String(f["SSJ - Is the team on track for their enrollment goals?"] || undefined) || undefined,
        building4goodFirmAttorney: String(f["Building4Good Firm & Attorney"] || undefined) || undefined,
        enteredVisioningDate: String(f["Entered Visioning Date"] || undefined) || undefined,
        primaryContactId: String(f["Primary Contact ID"] || undefined) || undefined,
        raceEthnicityFromEducatorViaEducatorsXSchools: String(f["Race & Ethnicity (from Educator) (via Educators x Schools)"] || undefined) || undefined,
        schoolStatus: String(f["School Status"] || undefined) || undefined,
        nineninetyid: String(f["nine_ninety_id"] || undefined) || undefined,
        leftNetworkDate: String(f["Left Network Date"] || undefined) || undefined,
        activeGuides: String(f["Active guides"] || undefined) || undefined,
        tcRecordkeeping: String(f["TC Recordkeeping"] || undefined) || undefined,
        lastModified: String(f["Last Modified"] || undefined) || undefined,
        ssjDoesTheSchoolHaveAViablePathwayToFunding: String(f["SSJ - Does the school have a viable pathway to funding?"] || undefined) || undefined,
        logo: schema.toStringArray(f["Logo"].map(att => att?.url).filter(Boolean)) || undefined,
        currentPhysicalAddressState: String(f["Current Physical Address - State"] || undefined) || undefined,
        created: String(f["Created"] || undefined) || undefined,
        billcomAccount: String(f["Bill.com account"] || undefined) || undefined,
        instagram: String(f["Instagram"] || undefined) || undefined,
        ein: String(f["EIN"] || undefined) || undefined,
        loanFromLoansIssueMethod: String(f["Loan (from Loans - Issue Method)"] || undefined) || undefined,
        currentPhysicalAddressCity: String(f["Current Physical Address - City"] || undefined) || undefined,
        bookkeeperAccountant: String(f["Bookkeeper / Accountant"] || undefined) || undefined,
        ssjLoanApprovedAmt: String(f["SSJ - Loan approved amt"] || undefined) || undefined,
        logoDesigner: String(f["Logo designer"] || undefined) || undefined,
        foundingDocuments: String(f["Founding Documents"] || undefined) || undefined,
        ssjDateSharedWithN4gFromSsjProcessDetails: String(f["SSJ - Date shared with N4G (from SSJ Process Details)"] || undefined) || undefined,
        tcAdmissions: String(f["TC Admissions"] || undefined) || undefined,
        ssjBuilding4goodStatus: String(f["SSJ - Building4Good Status"] || undefined) || undefined,
        narrative: String(f["Narrative"] || undefined) || undefined,
        currentMailingAddress: String(f["Current Mailing Address"] || undefined) || undefined,
        ssjTotalStartupFundingNeeded: String(f["SSJ - Total Startup Funding Needed"] || undefined) || undefined,
        schoolContactEmails: String(f["School Contact Emails"] || undefined) || undefined,
        OfAsianAmericanStudents: String(f["% of Asian American students"] || undefined) || undefined,
        budgetUtility: String(f["Budget Utility"] || undefined) || undefined,
        ssjWhatIsTheNextBigDecisionOrActionThisSchoolIsWorkingOn: String(f["SSJ - What is the next big decision or action this school is working on?"] || undefined) || undefined,
        dateReceivedGroupExemption: String(f["Date received group exemption"] || undefined) || undefined,
        pod: String(f["Pod"] || undefined) || undefined,
        legalStructure: String(f["Legal structure"] || undefined) || undefined,
        OfAfricanAmericanStudents: String(f["% of African American students"] || undefined) || undefined,
        archived: Boolean(f["Archived"]) || undefined,
        incorporationDate: String(f["Incorporation Date"] || undefined) || undefined,
        activelongitude: String(f["activeLongitude"] || undefined) || undefined,
        ssjSsjTool: String(f["SSJ - SSJ Tool"] || undefined) || undefined,
        leftNetworkReason: schema.toStringArray(f["Left Network Reason"]) || undefined,
        about: String(f["About"] || undefined) || undefined,
        ssjReadinessToOpenRating: String(f["SSJ - Readiness to Open Rating"] || undefined) || undefined,
        ssjFundraisingNarrative: String(f["SSJ - Fundraising narrative"] || undefined) || undefined,
        tcSchoolId: String(f["TC school ID"] || undefined) || undefined,
        ssjBoardDevelopment: String(f["SSJ - Board development"] || undefined) || undefined,
        charter: schema.toStringArray(f["Charter"]) || undefined,
        fullNameFromFoundersList: String(f["Full Name (from Founders List)"] || undefined) || undefined,
        institutionalPartner: String(f["Institutional partner"] || undefined) || undefined,
        primaryContacts: schema.toStringArray(f["Primary Contacts"]) || undefined,
        countofactiveguides: schema.toNumber(f["CountofActiveGuides"]) || undefined,
        schoolPhone: String(f["School Phone"] || undefined) || undefined,
        actionstepid: String(f["action_step_id"] || undefined) || undefined,
        charterShortName: String(f["Charter Short Name"] || undefined) || undefined,
        dedupeSchoolWith: String(f["Dedupe school with"] || undefined) || undefined,
        educatorsxschoolsid: String(f["educatorsXschools_id"] || undefined) || undefined,
        guidestarListingRequested: Boolean(f["GuideStar Listing Requested?"]) || undefined,
        whiteFromFamilySurvey: String(f["White (from Family Survey)"] || undefined) || undefined,
        priorNames: String(f["Prior Names"] || undefined) || undefined,
        guideAssignments: schema.toStringArray(f["Guide assignments"]) || undefined,
        schoolnoteid: String(f["school_note_id"] || undefined) || undefined,
        website: String(f["Website"] || undefined) || undefined,
        OfStudents: String(f["# of Students"] || undefined) || undefined,
        schoolSchedule: schema.toStringArray(f["School schedule"]) || undefined,
        ssjTargetState: String(f["SSJ - Target State"] || undefined) || undefined,
        domainName: String(f["Domain Name"] || undefined) || undefined,
        educators: String(f["Educators"] || undefined) || undefined,
        name: String(f["Name"] || ""),
        trademarkFiled: String(f["Trademark filed"] || undefined) || undefined,
        activelatitude: String(f["activeLatitude"] || undefined) || undefined,
        googleWorkspaceOrgUnitPath: String(f["Google Workspace Org Unit Path"] || undefined) || undefined,
        aboutSpanish: String(f["About Spanish"] || undefined) || undefined,
        loanid: String(f["loan_id"] || undefined) || undefined,
        loanReportName: String(f["Loan Report Name"] || undefined) || undefined,
        currentFyEnd: String(f["Current FY end"] || undefined) || undefined,
        ssjProjectedOpen: String(f["SSJ - Projected Open"] || undefined) || undefined,
        middleEastern: String(f["Middle Eastern"] || undefined) || undefined,
        businessInsurance: String(f["Business Insurance"] || undefined) || undefined,
        onNationalWebsite: String(f["On national website"] || undefined) || undefined,
        qbo: String(f["QBO"] || undefined) || undefined,
        ssjStage: String(f["SSJ Stage"] || undefined) || undefined,
        nonprofitStatus: String(f["Nonprofit status"] || undefined) || undefined,
        admissionsSystem: String(f["Admissions System"] || undefined) || undefined,
        ssjHasTheEtlIdentifiedAPartner: String(f["SSJ - Has the ETL identified a partner?"] || undefined) || undefined,
        ssjNameReserved: String(f["SSJ - Name Reserved"] || undefined) || undefined,
        pacificIslanderFromFamilySurvey: String(f["Pacific Islander (from Family Survey)"] || undefined) || undefined,
        countOfActivePhysicalAddresses: schema.toNumber(f["Count of Active Physical Addresses"]) || undefined,
        automationNotes: String(f["Automation notes"] || undefined) || undefined,
        membershipStatus: String(f["Membership Status"] || undefined) || undefined,
        enteredStartupDate: String(f["Entered Startup Date"] || undefined) || undefined,
        ssjAmountRaised: String(f["SSJ - Amount raised"] || undefined) || undefined,
        nameSelectionProposal: String(f["Name Selection Proposal"] || undefined) || undefined,
        schoolCalendar: String(f["School calendar"] || undefined) || undefined,
        educatorsXSchools: schema.toStringArray(f["Educators x Schools"]) || undefined
      });
    },
    cacheEnabled: true,
  },
  'Educators': {
    airtableTable: 'Educators',
    fieldMapping: schema.EDUCATORS_FIELDS,
    transformer: (record: any): schema.Educator => {
      const f = record.fields;
      return schema.createBaseTransformer(record, {
        householdIncome: String(f["Household Income"] || undefined) || undefined,
        otherLanguages: schema.toStringArray(f["Other languages"]) || undefined,
        statusForActiveSchool: String(f["Status for Active School"] || undefined) || undefined,
        assignedPartnerOverrideFromSsjFilloutForms: String(f["Assigned Partner Override (from SSJ Fillout Forms)"] || undefined) || undefined,
        trainingGrants: schema.toStringArray(f["Training Grants"]) || undefined,
        startupStageForActiveSchool: String(f["Startup Stage for Active School"] || undefined) || undefined,
        primaryContactFor: schema.toStringArray(f["Primary contact for"]) || undefined,
        activeHolaspirit: Boolean(f["Active Holaspirit"]) || undefined,
        nickname: String(f["Nickname"] || undefined) || undefined,
        educatorNotes: schema.toStringArray(f["Educator notes"]) || undefined,
        ssjfilloutformid: String(f["ssj_fillout_form_id"] || undefined) || undefined,
        routedTo: String(f["Routed to"] || undefined) || undefined,
        gender: String(f["Gender"] || undefined) || undefined,
        assignedPartner: schema.toStringArray(f["Assigned Partner"]) || undefined,
        firstContactNotesOnPrewildflowerEmployment: String(f["First contact - Notes on pre-Wildflower employment"] || undefined) || undefined,
        alsoAPartner: Boolean(f["Also a partner"]) || undefined,
        stagestatusForActiveSchool: String(f["Stage_Status for Active School"] || undefined) || undefined,
        montessoriLeadGuideTrainings: schema.toStringArray(f["Montessori lead guide trainings"]) || undefined,
        assignedPartnerEmail: String(f["Assigned Partner Email"] || undefined) || undefined,
        lastModified: String(f["Last Modified"] || undefined) || undefined,
        raceEthnicity: schema.toStringArray(f["Race & Ethnicity"]) || undefined,
        notesFromEducatorNotes: String(f["Notes (from Educator notes)"] || undefined) || undefined,
        montessoriCertifications: schema.toStringArray(f["Montessori Certifications"]) || undefined,
        targetInternational: String(f["Target - international"] || undefined) || undefined,
        genderOther: String(f["Gender - Other"] || undefined) || undefined,
        educatorsxschoolsid: String(f["educatorsXschools_id"] || undefined) || undefined,
        sourceOther: String(f["Source - other"] || undefined) || undefined,
        certifierFromMontessoriCertifications: String(f["Certifier (from Montessori Certifications)"] || undefined) || undefined,
        survey2022WildflowerNetworkSurvey: Boolean(f["survey - 2022 Wildflower Network Survey"]) || undefined,
        pronouns: String(f["Pronouns"] || undefined) || undefined,
        archived: Boolean(f["Archived"]) || undefined,
        educatorsAtSchools: schema.toStringArray(f["Educators at Schools"]) || undefined,
        currentPrimaryEmailAddress: String(f["Current Primary Email Address"] || undefined) || undefined,
        emailSentByInitialOutreacher: String(f["Email sent by initial outreacher"] || undefined) || undefined,
        secondaryPhone: String(f["Secondary phone"] || undefined) || undefined,
        pronunciation: String(f["Pronunciation"] || undefined) || undefined,
        eventsAttended: schema.toStringArray(f["Events attended"]) || undefined,
        currentlyActiveSchool: String(f["Currently Active School"] || undefined) || undefined,
        montessoriCertified: String(f["Montessori Certified"] || undefined) || undefined,
        firstContactInitialInterests: String(f["First contact - initial interests"] || undefined) || undefined,
        schoolAddress: String(f["School Address"] || undefined) || undefined,
        currentRole: String(f["Current Role"] || undefined) || undefined,
        middleName: String(f["Middle Name"] || undefined) || undefined,
        lgbtqia: String(f["LGBTQIA"] || undefined) || undefined,
        certificationLevelsFromMontessoriCertifications: String(f["Certification Levels (from Montessori Certifications)"] || undefined) || undefined,
        opsGuideRequestPertinentInfo: String(f["Ops Guide Request Pertinent Info"] || undefined) || undefined,
        activeSchoolAffiliationStatus: String(f["Active School Affiliation Status"] || undefined) || undefined,
        montessoricertid: String(f["montessori_cert_id"] || undefined) || undefined,
        pronounsOther: String(f["Pronouns - Other"] || undefined) || undefined,
        dedupeWith: String(f["Dedupe with"] || undefined) || undefined,
        lastName: String(f["Last Name"] || undefined) || undefined,
        educatornotesid: String(f["educator_notes_id"] || undefined) || undefined,
        raceEthnicityOther: String(f["Race & Ethnicity - Other"] || undefined) || undefined,
        targetState: String(f["Target state"] || undefined) || undefined,
        created: String(f["Created"] || undefined) || undefined,
        entryDateFromSsjFilloutForms: String(f["Entry Date (from SSJ Fillout Forms)"] || undefined) || undefined,
        tcUserId: String(f["TC User ID"] || undefined) || undefined,
        emailid: String(f["email_id"] || undefined) || undefined,
        countOfGetInvolvedForms: schema.toNumber(f["Count of Get Involved Forms"]) || undefined,
        contactFormDetailsFromSsjDataOnEducators: String(f["Contact Form Details (from SSJ data on educators)"] || undefined) || undefined,
        newsletterAndGroupSubscriptions: schema.toStringArray(f["Newsletter and Group Subscriptions"]) || undefined,
        homeAddress: String(f["Home Address"] || undefined) || undefined,
        cohorts: String(f["Cohorts"] || undefined) || undefined,
        source: schema.toStringArray(f["Source"]) || undefined,
        countoflinkedschools: schema.toNumber(f["CountofLinkedSchools"]) || undefined,
        educationalAttainment: String(f["Educational Attainment"] || undefined) || undefined,
        messageFromSsjFilloutForms: String(f["Message (from SSJ Fillout Forms)"] || undefined) || undefined,
        opsGuideAnyFundraisingOpportunities: String(f["Ops Guide Any fundraising opportunities?"] || undefined) || undefined,
        primaryLanguage: schema.toStringArray(f["Primary Language"]) || undefined,
        fullName: String(f["Full Name"] || undefined) || undefined,
        firstName: String(f["First Name"] || undefined) || undefined,
        onSchoolBoard: String(f["On school board"] || undefined) || undefined,
        discoveryStatus: String(f["Discovery status"] || undefined) || undefined,
        firstContactWfSchoolEmploymentStatus: String(f["First contact - WF School employment status"] || undefined) || undefined,
        primaryPhone: String(f["Primary phone"] || undefined) || undefined,
        activeSchoolRecordId: String(f["Active School Record ID"] || undefined) || undefined,
        individualType: String(f["Individual Type"] || undefined) || undefined,
        educatorId: String(f["educator_id"] || undefined) || undefined,
        onboardingExperience: String(f["Onboarding Experience"] || undefined) || undefined,
        firstContactWillingnessToRelocate: Boolean(f["First contact - Willingness to relocate"]) || undefined,
        assignedPartnerShortName: String(f["Assigned Partner Short Name"] || undefined) || undefined,
        targetCity: String(f["Target city"] || undefined) || undefined,
        schoolStatuses: String(f["School Statuses"] || undefined) || undefined,
        currentlyActiveAtASchool: String(f["Currently Active at a School?"] || undefined) || undefined,
        oneOnOneStatus: String(f["One on one status"] || undefined) || undefined,
        allSchools: String(f["All Schools"] || undefined) || undefined,
        ssjoldstartaschoolid: String(f["ssj_old_start_a_school_id"] || undefined) || undefined,
        excludeFromEmailLogging: Boolean(f["Exclude from email logging"]) || undefined,
        incomeBackground: String(f["Income Background"] || undefined) || undefined
      });
    },
    cacheEnabled: true,
  },
  'SSJ Typeforms: Start a School': {
    airtableTable: 'SSJ Typeforms: Start a School',
    fieldMapping: schema.SSJ_TYPEFORMS_START_A_SCHOOL_FIELDS,
    transformer: (record: any): schema.SSJTypeform => {
      const f = record.fields;
      return schema.createBaseTransformer(record, {
        ssjDataOnEducators: String(f["SSJ data on educators"] || undefined) || undefined,
        registeredFromEventAttendance: String(f["Registered (from Event attendance)"] || undefined) || undefined,
        firstName: String(f["First Name"] || undefined) || undefined,
        socioeconomicPrimaryLanguage: String(f["Socio-Economic: Primary Language"] || undefined) || undefined,
        receiveCommunications: Boolean(f["Receive Communications"]) || undefined,
        contactLocationState: String(f["Contact Location: State"] || undefined) || undefined,
        montessoriCertificationYear: String(f["Montessori Certification Year"] || undefined) || undefined,
        createdAt: String(f["Created At"] || undefined) || undefined,
        message: String(f["Message"] || undefined) || undefined,
        source: String(f["Source"] || undefined) || undefined,
        socioeconomicPronounsOther: String(f["Socio-Economic: Pronouns Other"] || undefined) || undefined,
        socioeconomicPronouns: String(f["Socio-Economic: Pronouns"] || undefined) || undefined,
        entryDate: String(f["Entry Date"] || undefined) || undefined,
        ssjFilloutFormGetInvolved2: String(f["SSJ Fillout Form: Get Involved 2"] || undefined) || undefined,
        tags: String(f["Tags"] || undefined) || undefined,
        educator: String(f["Educator"] || undefined) || undefined,
        schoolLocationCity: String(f["School Location: City"] || undefined) || undefined,
        ssjFilloutFormGetInvolved: String(f["SSJ Fillout Form: Get Involved"] || undefined) || undefined,
        schoolLocationState: String(f["School Location: State"] || undefined) || undefined,
        socioeconomicGender: String(f["Socio-Economic: Gender"] || undefined) || undefined,
        montessoriCertificationCertifier: String(f["Montessori Certification Certifier"] || undefined) || undefined,
        timeAtEventFromEventAttendance: String(f["Time at event (from Event attendance)"] || undefined) || undefined,
        socioeconomicRaceEthnicity: String(f["Socio-Economic: Race & Ethnicity"] || undefined) || undefined,
        schoolLocationCountry: String(f["School Location: Country"] || undefined) || undefined,
        initialInterestInGovernanceModel: String(f["Initial Interest in Governance Model"] || undefined) || undefined,
        socioeconomicRaceEthnicityOther: String(f["Socio-Economic: Race & Ethnicity Other"] || undefined) || undefined,
        ageClassroomsInterestedInOffering: String(f["Age Classrooms Interested In Offering"] || undefined) || undefined,
        isInterestedInCharter: Boolean(f["Is Interested in Charter"]) || undefined,
        attendedFromEventAttendance: String(f["Attended (from Event attendance)"] || undefined) || undefined,
        isSeekingMontessoriCertification: Boolean(f["Is Seeking Montessori Certification"]) || undefined,
        schoolLocationCommunity: String(f["School Location: Community"] || undefined) || undefined,
        equityReflection: String(f["Equity Reflection"] || undefined) || undefined,
        socioeconomicLgbtqiaIdentifying: String(f["Socio-Economic: LGBTQIA Identifying"] || undefined) || undefined,
        socioeconomicHouseholdIncome: String(f["Socio-Economic: Household Income"] || undefined) || undefined,
        contactLocationCountry: String(f["Contact Location: Country"] || undefined) || undefined,
        socioeconomicGenderOther: String(f["Socio-Economic: Gender Other"] || undefined) || undefined,
        hasInterestInJoiningAnotherSchool: Boolean(f["Has Interest in Joining Another School"]) || undefined,
        isWillingToMove: Boolean(f["Is Willing to Move"]) || undefined,
        contactLocationCity: String(f["Contact Location: City"] || undefined) || undefined,
        lastName: String(f["Last Name"] || undefined) || undefined,
        isMontessoriCertified: Boolean(f["Is Montessori Certified"]) || undefined,
        recordIdFromEventParticipantFromEventAttendance: String(f["Record ID (from Event Participant) (from Event attendance)"] || undefined) || undefined,
        montessoriCertificationLevels: String(f["Montessori Certification Levels"] || undefined) || undefined
      });
    },
    cacheEnabled: true,
  },
  'School notes': {
    airtableTable: 'School notes',
    fieldMapping: schema.SCHOOL_NOTES_FIELDS,
    transformer: (record: any): schema.SchoolNote => {
      const f = record.fields;
      return schema.createBaseTransformer(record, {
        schoolnoteid: String(f["school_note_id"] || undefined) || undefined,
        createdBy: schema.toStringArray(f["Created by"]) || undefined,
        schoolId: String(f["school_id"] || ""),
        partnerShortName: String(f["Partner Short Name"] || undefined) || undefined,
        headlineNotes: String(f["Headline (Notes)"] || undefined) || undefined,
        school: schema.toStringArray(f["School"]) || undefined,
        schoolNoteKey: String(f["School Note Key"] || undefined) || undefined,
        charterId: String(f["charter_id"] || undefined) || undefined,
        partnersCopy: schema.toStringArray(f["Partners copy"]) || undefined,
        notes: String(f["Notes"] || undefined) || undefined,
        dateCreated: String(f["Date created"] || undefined) || undefined,
        private: Boolean(f["Private"]) || undefined
      });
    },
    cacheEnabled: true,
  },
  'Membership termination steps': {
    airtableTable: 'Membership termination steps',
    fieldMapping: schema.MEMBERSHIP_TERMINATION_STEPS_FIELDS,
    transformer: (record: any): schema.MembershipTerminationStep => {
      const f = record.fields;
      return schema.createBaseTransformer(record, {
        initialTcCondition: String(f["Initial TC condition"] || undefined) || undefined,
        deactivateListservs: String(f["Deactivate listservs"] || undefined) || undefined,
        deactivateGsuiteTargetDate: String(f["Deactivate GSuite target date"] || undefined) || undefined,
        deactivateWildflowerschoolsorgProfile: String(f["Deactivate wildflowerschools.org profile"] || undefined) || undefined,
        deactivateWildflowerschoolsorgProfileTargetDate: String(f["Deactivate wildflowerschools.org profile target date"] || undefined) || undefined,
        deactivateWebsiteTargetDate: String(f["Deactivate website target date"] || undefined) || undefined,
        initialGustoCondition: String(f["Initial Gusto condition"] || undefined) || undefined,
        initialSlackCondition: String(f["Initial Slack condition"] || undefined) || undefined,
        deactivateSlackTargetDate: String(f["Deactivate Slack target date"] || undefined) || undefined,
        terminationTriggerDate: String(f["Termination trigger date"] || undefined) || undefined,
        initialQboCondition: String(f["Initial QBO condition"] || undefined) || undefined,
        deactivateListservsTargetDate: String(f["Deactivate listservs target date"] || undefined) || undefined,
        deactivateGroupExemption: String(f["Deactivate Group Exemption"] || undefined) || undefined,
        deactivateTc: String(f["Deactivate TC"] || undefined) || undefined,
        deactivateGroupExemptionTargetDate: String(f["Deactivate Group Exemption target date"] || undefined) || undefined,
        schoolContactEmailsFromSchool: String(f["School Contact Emails (from School)"] || undefined) || undefined,
        deactivateWebsite: String(f["Deactivate website"] || undefined) || undefined,
        deactivateSlack: String(f["Deactivate Slack"] || undefined) || undefined,
        initialWebsiteCondition: String(f["Initial website condition"] || undefined) || undefined,
        updateAirtableFields: String(f["Update Airtable fields"] || undefined) || undefined,
        deactivateGustoTargetDate: String(f["Deactivate Gusto target date"] || undefined) || undefined,
        initialGroupExemptionCondition: String(f["Initial Group Exemption condition"] || undefined) || undefined,
        deactivateGusto: String(f["Deactivate Gusto"] || undefined) || undefined,
        membershipTerminationLetterFromSchool: String(f["Membership termination letter (from School)"] || undefined) || undefined,
        deactivateQboTargetDate: String(f["Deactivate QBO target date"] || undefined) || undefined,
        deactivateQbo: String(f["Deactivate QBO"] || undefined) || undefined,
        deactivateGsuite: String(f["Deactivate GSuite"] || undefined) || undefined,
        deactivateTcTargetDate: String(f["Deactivate TC target date"] || undefined) || undefined
      });
    },
    cacheEnabled: true,
  },
  'Locations': {
    airtableTable: 'Locations',
    fieldMapping: schema.LOCATIONS_FIELDS,
    transformer: (record: any): schema.Location => {
      const f = record.fields;
      return schema.createBaseTransformer(record, {
        geocodeAutomationLastRunAt: String(f["Geocode Automation Last Run At"] || undefined) || undefined,
        country: String(f["Country"] || undefined) || undefined,
        qualifiedLowIncomeCensusTract: String(f["Qualified Low Income Census Tract"] || undefined) || undefined,
        street: String(f["Street"] || undefined) || undefined,
        address: String(f["Address"] || undefined) || undefined,
        lease: schema.toStringArray(f["Lease"].map(att => att?.url).filter(Boolean)) || undefined,
        timeZone: String(f["Time Zone"] || undefined) || undefined,
        endOfTimeAtLocation: String(f["End of time at location"] || undefined) || undefined,
        locationKey: String(f["Location Key"] || undefined) || undefined,
        censusTract: String(f["Census Tract"] || undefined) || undefined,
        squareFeet: schema.toNumber(f["Square feet"]) || undefined,
        neighborhood: String(f["Neighborhood"] || undefined) || undefined,
        schoolStatusFromSchool: String(f["School Status (from School)"] || undefined) || undefined,
        longitude: schema.toNumber(f["Longitude"]) || undefined,
        charter: schema.toStringArray(f["Charter"]) || undefined,
        state: String(f["State"] || undefined) || undefined,
        currentPhysicalAddress: Boolean(f["Current physical address?"]) || undefined,
        maxStudentsLicensedFor: schema.toNumber(f["Max Students Licensed For"]) || undefined,
        postalCode: String(f["Postal code"] || undefined) || undefined,
        latitude: schema.toNumber(f["Latitude"]) || undefined,
        leaseEndDate: String(f["Lease End Date"] || undefined) || undefined,
        locationid: String(f["location_id"] || undefined) || undefined,
        lastModified: String(f["Last Modified"] || undefined) || undefined,
        locationType: String(f["Location type"] || undefined) || undefined,
        school: schema.toStringArray(f["School"]) || undefined,
        charterId: String(f["charter_id"] || undefined) || undefined,
        city: String(f["City"] || undefined) || undefined,
        currentMailingAddress: Boolean(f["Current mailing address?"]) || undefined,
        inactiveWithoutEndDateOrActiveWithEndDate: String(f["Inactive without end date; or active with end date"] || undefined) || undefined,
        colocationType: String(f["Co-Location Type"] || undefined) || undefined,
        created: String(f["Created"] || undefined) || undefined,
        startOfTimeAtLocation: String(f["Start of time at location"] || undefined) || undefined,
        shortName: String(f["Short Name"] || undefined) || undefined,
        colocationPartner: String(f["Co-Location Partner "] || undefined) || undefined,
        schoolId: String(f["school_id"] || "")
      });
    },
    cacheEnabled: true,
  },
  'Event attendance': {
    airtableTable: 'Event attendance',
    fieldMapping: schema.EVENT_ATTENDANCE_FIELDS,
    transformer: (record: any): schema.EventAttendance => {
      const f = record.fields;
      return schema.createBaseTransformer(record, {
        ageClassroomsInterestedInOfferingFromEventParticipant: String(f["Age Classrooms Interested in Offering (from Event Participant)"] || undefined) || undefined,
        educatorsAtSchoolsFromEventParticipant: String(f["Educators at Schools (from Event Participant)"] || undefined) || undefined,
        startedSsjCompletedSsjTypeform: String(f["Started SSJ? (completed SSJ typeform)"] || undefined) || undefined,
        currentSchoolFromEventParticipant2: String(f["Current School (from Event Participant) 2"] || undefined) || undefined,
        ssjTypeformsStartASchoolFromEventParticipant: String(f["SSJ Typeforms: Start a School (from Event Participant)"] || undefined) || undefined,
        network: String(f["Network"] || undefined) || undefined,
        registrationDate: String(f["Registration Date"] || undefined) || undefined,
        countofloggedplanningsFromEventParticipant: String(f["CountofLoggedPlannings (from Event Participant)"] || undefined) || undefined,
        stageChangeFromDiscoveryToVisioningFromEventParticipant: String(f["Stage change from Discovery to Visioning (from Event Participant)"] || undefined) || undefined,
        entryDateFromStartASchoolFormFromEducators: String(f["Entry Date (from Start a School form) (from Educators)"] || undefined) || undefined,
        registered: Boolean(f["Registered"]) || undefined,
        attended: Boolean(f["Attended"]) || undefined,
        createdFromEventParticipant2: String(f["Created (from Event Participant) 2"] || undefined) || undefined,
        currentSchoolFromEventParticipant: String(f["Current School (from Event Participant)"] || undefined) || undefined,
        statusFromEventParticipant2: String(f["Status (from Event Participant) 2"] || undefined) || undefined,
        tlStoriesRace: String(f["TL Stories Race"] || undefined) || undefined,
        montessoriCertifiedFromEventParticipant: String(f["Montessori Certified (from Event Participant)"] || undefined) || undefined,
        tlStoriesQ1: String(f["TL Stories Q1"] || undefined) || undefined,
        tlStoriesQ2: String(f["TL Stories Q2"] || undefined) || undefined,
        sourceFromSsjTypeformsStartASchoolFromEventParticipant: String(f["Source (from SSJ Typeforms: Start a School) (from Event Participant)"] || undefined) || undefined,
        eventType: String(f["Event Type"] || undefined) || undefined,
        ageClassroomsInterestedInOfferingFromEventParticipant2: String(f["Age Classrooms Interested in Offering (from Event Participant) 2"] || undefined) || undefined,
        incomeBackgroundFromEventParticipant: String(f["Income Background (from Event Participant)"] || undefined) || undefined,
        phone: String(f["Phone"] || undefined) || undefined,
        hubFromEventParticipant2: String(f["Hub (from Event Participant) 2"] || undefined) || undefined,
        fullNameFromEventParticipant: String(f["Full Name (from Event Participant)"] || undefined) || undefined,
        countofloggeddiscoverFromEventParticipant: String(f["CountofLoggedDiscover (from Event Participant)"] || undefined) || undefined,
        educatorId: String(f["educator_id"] || ""),
        assignedPartnerFromEventParticipant2: String(f["Assigned Partner (from Event Participant) 2"] || undefined) || undefined,
        householdIncomeFromEventParticipant2: String(f["Household Income (from Event Participant) 2"] || undefined) || undefined,
        tlStoriesSchoolTarget: String(f["TL Stories School Target"] || undefined) || undefined,
        stageChangeFromVisioningToPlanningFromEventParticipant: String(f["Stage change from visioning to planning (from Event Participant)"] || undefined) || undefined,
        stageFromEventParticipant: String(f["Stage (from Event Participant)"] || undefined) || undefined,
        educatorsAtSchoolsFromEventParticipant2: String(f["Educators at Schools (from Event Participant) 2"] || undefined) || undefined,
        educatorRecordCreated: String(f["Educator record created"] || undefined) || undefined,
        eventName: String(f["Event Name"] || undefined) || undefined,
        timeAtEvent: schema.toNumber(f["Time at event"]) || undefined,
        schoolStatusFromEventParticipant: String(f["School Status (from Event Participant)"] || undefined) || undefined,
        eventAttendanceKey: String(f["Event Attendance key"] || undefined) || undefined,
        whenDidTheySwitchToVisioning: String(f["When did they switch to visioning"] || undefined) || undefined,
        raceEthnicityFromEventParticipant: String(f["Race & Ethnicity (from Event Participant)"] || undefined) || undefined,
        hubFromEventParticipant: String(f["Hub (from Event Participant)"] || undefined) || undefined,
        eventParticipant: schema.toStringArray(f["Event Participant"]) || undefined,
        statusFromEventParticipant: String(f["Status (from Event Participant)"] || undefined) || undefined,
        hubNameFromEventParticipant: String(f["Hub Name (from Event Participant)"] || undefined) || undefined,
        marketingSource: String(f["Marketing source"] || undefined) || undefined,
        householdIncomeFromEventParticipant: String(f["Household Income (from Event Participant)"] || undefined) || undefined,
        event: schema.toStringArray(f["Event"]) || undefined,
        incomeBackgroundFromEventParticipant2: String(f["Income Background (from Event Participant) 2"] || undefined) || undefined,
        assignedPartnerFromEventParticipant: String(f["Assigned Partner (from Event Participant)"] || undefined) || undefined,
        montessoriCertificationsFromEventParticipant: String(f["Montessori Certifications (from Event Participant)"] || undefined) || undefined,
        createdDate: String(f["Created date"] || undefined) || undefined,
        firstVisioningFromEventParticipant: String(f["First visioning (from Event Participant)"] || undefined) || undefined,
        raceEthnicityFromEventParticipant2: String(f["Race & Ethnicity (from Event Participant) 2"] || undefined) || undefined,
        tlStoriesType: String(f["TL Stories Type"] || undefined) || undefined,
        createdFromEventParticipant: String(f["Created (from Event Participant)"] || undefined) || undefined,
        countofloggedvisioningFromEventParticipant: schema.toNumber(f["CountofLoggedVisioning (from Event Participant)"]) || undefined,
        schoolStatusFromEventParticipant2: String(f["School Status (from Event Participant) 2"] || undefined) || undefined,
        needsSpanishTranslation: Boolean(f["needs spanish translation"]) || undefined
      });
    },
    cacheEnabled: true,
  },
  'Lead Routing and Templates': {
    airtableTable: 'Lead Routing and Templates',
    fieldMapping: schema.LEAD_ROUTING_AND_TEMPLATES_FIELDS,
    transformer: (record: any): schema.LeadRoutingTemplate => {
      const f = record.fields;
      return schema.createBaseTransformer(record, {
        state: String(f["State"] || undefined) || undefined,
        sendgridTemplateId: String(f["SendGrid Template ID"] || undefined) || undefined,
        geotype: String(f["Geo-type"] || undefined) || undefined,
        cc: String(f["cc"] || undefined) || undefined,
        source: String(f["Source"] || undefined) || undefined,
        name: String(f["Name"] || undefined) || undefined,
        sender: String(f["Sender"] || undefined) || undefined
      });
    },
    cacheEnabled: true,
  },
  'Cohorts': {
    airtableTable: 'Cohorts',
    fieldMapping: schema.COHORTS_FIELDS,
    transformer: (record: any): schema.Cohort => {
      const f = record.fields;
      return schema.createBaseTransformer(record, {
        charters: schema.toStringArray(f["Charters"]) || undefined,
        cohortName: String(f["Cohort Name"] || undefined) || undefined,
        schools: schema.toStringArray(f["Schools"]) || undefined,
        startDate: String(f["Start Date"] || undefined) || undefined,
        programType: String(f["Program Type"] || undefined) || undefined
      });
    },
    cacheEnabled: true,
  },
  'Events': {
    airtableTable: 'Events',
    fieldMapping: schema.EVENTS_FIELDS,
    transformer: (record: any): schema.Event => {
      const f = record.fields;
      return schema.createBaseTransformer(record, {
        date: String(f["Date"] || undefined) || undefined,
        eventName: String(f["Event Name"] || undefined) || undefined,
        type: schema.toStringArray(f["Type"]) || undefined,
        eventid: String(f["event_id"] || undefined) || undefined,
        attendees: schema.toStringArray(f["Attendees"]) || undefined
      });
    },
    cacheEnabled: true,
  },
  'Board Service': {
    airtableTable: 'Board Service',
    fieldMapping: schema.BOARD_SERVICE_FIELDS,
    transformer: (record: any): schema.BoardService => {
      const f = record.fields;
      return schema.createBaseTransformer(record, {
        communityMemberName: String(f["Community Member Name"] || undefined) || undefined,
        contactEmailFromEducator: String(f["Contact Email (from Educator)"] || undefined) || undefined,
        startDate: String(f["Start Date"] || undefined) || undefined,
        endDate: String(f["End Date"] || undefined) || undefined,
        communityMemberEmail: String(f["Community Member Email"] || undefined) || undefined,
        currentlyActive: Boolean(f["Currently Active"]) || undefined,
        chair: Boolean(f["Chair"]) || undefined
      });
    },
    cacheEnabled: true,
  },
  'Supabase join 990 with school': {
    airtableTable: 'Supabase join 990 with school',
    fieldMapping: schema.SUPABASE_JOIN_990_WITH_SCHOOL_FIELDS,
    transformer: (record: any): schema.Supabase990School => {
      const f = record.fields;
      return schema.createBaseTransformer(record, {
        shortname: String(f["short_name"] || undefined) || undefined,
        id: String(f["id"] || undefined) || undefined,
        nineNinetiesYear: String(f["Nine Nineties Year"] || undefined) || undefined
      });
    },
    cacheEnabled: true,
  },
  'Charters': {
    airtableTable: 'Charters',
    fieldMapping: schema.CHARTERS_FIELDS,
    transformer: (record: any): schema.Charter => {
      const f = record.fields;
      return schema.createBaseTransformer(record, {
        locationIdFromLocations: String(f["Location ID (from Locations)"] || undefined) || undefined,
        schools: schema.toStringArray(f["Schools"]) || undefined,
        charterAssessments: schema.toStringArray(f["Charter assessments"]) || undefined,
        incorporationDate: String(f["Incorporation Date"] || undefined) || undefined,
        status: String(f["Status"] || undefined) || undefined,
        shortName: String(f["Short Name"] || undefined) || undefined,
        contactEmailFromExternalInitiators: String(f["Contact Email (from External Initiator(s))"] || undefined) || undefined,
        cohorts: schema.toStringArray(f["Cohorts"]) || undefined,
        currentlyActiveFromNontlRoles: String(f["Currently active (from Non-TL roles)"] || undefined) || undefined,
        charterlevelMembershipAgreementSigned: String(f["Charter-level membership agreement signed"] || undefined) || undefined,
        landscapeAnalysis: schema.toStringArray(f["Landscape analysis"].map(att => att?.url).filter(Boolean)) || undefined,
        firstSiteOpened: String(f["First site opened"] || undefined) || undefined,
        targetOpenFromCharterApplications: String(f["Target open (from Charter applications)"] || undefined) || undefined,
        membershipStatusOfSchools: String(f["Membership status of schools"] || undefined) || undefined,
        nonprofitStatus: String(f["Nonprofit status"] || undefined) || undefined,
        currentTlsFromSchools: String(f["Current TLs (from Schools)"] || undefined) || undefined,
        linkedSchools: String(f["Linked Schools"] || undefined) || undefined,
        recordIdFromSchools: String(f["Record ID (from Schools)"] || undefined) || undefined,
        locations: schema.toStringArray(f["Locations"]) || undefined,
        supportTimeline: String(f["Support timeline"] || undefined) || undefined,
        application: schema.toStringArray(f["Application"].map(att => att?.url).filter(Boolean)) || undefined,
        initialTargetAges: String(f["Initial target ages"] || undefined) || undefined,
        nondiscriminationPolicyOnWebsite: Boolean(f["Nondiscrimination Policy on Website"]) || undefined,
        docIdFromSchoolGovernanceDocuments: String(f["Doc ID (from School governance documents)"] || undefined) || undefined,
        tlDiscoveryStatus: String(f["TL discovery status"] || undefined) || undefined,
        currentFyEnd: String(f["Current FY end"] || undefined) || undefined,
        guidestarListingRequested: Boolean(f["GuideStar Listing Requested?"]) || undefined,
        recidFromCharterApplications: String(f["recID (from Charter applications)"] || undefined) || undefined,
        dateReceivedGroupExemption: String(f["Date received group exemption"] || undefined) || undefined,
        nameFromNontlRoles: String(f["Name (from Non-TL roles)"] || undefined) || undefined,
        authorized: String(f["Authorized"] || undefined) || undefined,
        charterKey: String(f["Charter key"] || undefined) || undefined,
        projectedOpen: String(f["Projected open"] || undefined) || undefined,
        partnershipWithWfStarted: String(f["Partnership with WF started"] || undefined) || undefined,
        initialTargetCommunity: String(f["Initial target community"] || undefined) || undefined,
        nontlRoles: schema.toStringArray(f["Non-TL roles"]) || undefined,
        website: String(f["Website"] || undefined) || undefined,
        charterlevelMembershipAgreement: schema.toStringArray(f["Charter-level membership agreement"].map(att => att?.url).filter(Boolean)) || undefined,
        recidFromCharterAuthorizersAndContacts: String(f["recId (from Charter authorizers and contacts)"] || undefined) || undefined,
        schoolGovernanceDocuments: schema.toStringArray(f["School governance documents"]) || undefined,
        annualEnrollmentAndDemographics: schema.toStringArray(f["Annual enrollment and demographics"]) || undefined,
        recidFromSchoolReports: String(f["RecID (from School reports)"] || undefined) || undefined,
        schoolReports: schema.toStringArray(f["School reports"]) || undefined,
        groupExemptionStatus: String(f["Group Exemption Status"] || undefined) || undefined,
        nineNinetiesId: String(f["Nine nineties Record ID (from Nine nineties)"] || undefined) || undefined,
        charterId: String(f["charter_id"] || undefined) || undefined,
        schoolProvidedWith1023RecordkeepingRequirements: Boolean(f["School provided with 1023 recordkeeping requirements"]) || undefined,
        charterassessmentid: String(f["charter_assessment_id"] || undefined) || undefined,
        fullName: String(f["Full name"] || undefined) || undefined,
        ein: String(f["EIN"] || undefined) || undefined,
        roleFromNontlRoles: String(f["Role (from Non-TL roles)"] || undefined) || undefined,
        initialTargetAgesLink: schema.toStringArray(f["Initial target ages link"]) || undefined
      });
    },
    cacheEnabled: true,
  },
  'QBO School Codes': {
    airtableTable: 'QBO School Codes',
    fieldMapping: schema.QBO_SCHOOL_CODES_FIELDS,
    transformer: (record: any): schema.QBOSchoolCode => {
      const f = record.fields;
      return schema.createBaseTransformer(record, {
        customerIdInQbo: String(f["Customer ID in QBO"] || undefined) || undefined,
        schools: schema.toStringArray(f["Schools"]) || undefined,
        schoolNameInQbo: String(f["School Name in QBO"] || undefined) || undefined
      });
    },
    cacheEnabled: true,
  },
  'Action steps': {
    airtableTable: 'Action steps',
    fieldMapping: schema.ACTION_STEPS_FIELDS,
    transformer: (record: any): schema.ActionStep => {
      const f = record.fields;
      return schema.createBaseTransformer(record, {
        assigneeShortName: String(f["Assignee Short Name"] || undefined) || undefined,
        completedDate: String(f["Completed date"] || undefined) || undefined,
        schoolShortName: String(f["School Short Name"] || undefined) || undefined,
        partnersCopy: schema.toStringArray(f["Partners copy"]) || undefined,
        schoolStatus: String(f["School Status"] || undefined) || undefined,
        schools: schema.toStringArray(f["Schools"]) || undefined,
        actionstepid: String(f["action_step_id"] || undefined) || undefined,
        dueDate: String(f["Due date"] || undefined) || undefined,
        assignee: schema.toStringArray(f["Assignee"]) || undefined,
        ssjStage: String(f["SSJ Stage"] || undefined) || undefined,
        assignedDate: String(f["Assigned date"] || undefined) || undefined,
        schoolId: String(f["school_id"] || undefined) || undefined,
        charterId: String(f["charter_id"] || undefined) || undefined,
        status: String(f["Status"] || undefined) || undefined,
        item: String(f["Item"] || undefined) || undefined
      });
    },
    cacheEnabled: true,
  },
  'Guides': {
    airtableTable: 'Guides',
    fieldMapping: schema.GUIDES_FIELDS,
    transformer: (record: any): schema.Guide => {
      const f = record.fields;
      return schema.createBaseTransformer(record, {
        stintTypeFromStints: schema.toStringArray(f["Stint type (from Stints)"]) || undefined,
        educatorRecordIds: String(f["Educator Record IDs"] || undefined) || undefined,
        photo: schema.toStringArray(f["Photo"].map(att => att?.url).filter(Boolean)) || undefined,
        name: String(f["Name"] || undefined) || undefined,
        email: String(f["Email"] || undefined) || undefined,
        papyrsProfile: String(f["Papyrs profile"] || undefined) || undefined,
        phone: String(f["Phone"] || undefined) || undefined,
        educatorLog: String(f["Educator Log"] || undefined) || undefined,
        personalEmail: String(f["Personal Email"] || undefined) || undefined,
        imageUrl: String(f["Image URL"] || undefined) || undefined,
        slackHandle: String(f["Slack handle"] || undefined) || undefined,
        roles: schema.toStringArray(f["Roles"]) || undefined,
        dob: String(f["DOB"] || undefined) || undefined,
        copperUserid: String(f["Copper userID"] || undefined) || undefined,
        guideAssignments: schema.toStringArray(f["Guide assignments"]) || undefined,
        homeAddress: String(f["Home address"] || undefined) || undefined,
        emailOrName: String(f["email or name"] || undefined) || undefined,
        leadRouting: String(f["Lead Routing"] || undefined) || undefined,
        shortName: String(f["Short name"] || undefined) || undefined,
        membershipTerminationStepsAndDates: String(f["Membership termination steps and dates"] || undefined) || undefined,
        ssjProcessDetails: String(f["SSJ Process Details"] || undefined) || undefined,
        guidedSchoolRecordId: String(f["Guided School Record ID"] || undefined) || undefined,
        startDateFromStints: String(f["Start Date (from Stints)"] || undefined) || undefined,
        activeStint: schema.toStringArray(f["Active stint"]) || undefined,
        websiteBio: String(f["Website bio"] || undefined) || undefined,
        recordId: String(f["Record ID"] || undefined) || undefined,
        currentlyActive: String(f["Currently active"] || undefined) || undefined,
        endDateFromStints: String(f["End Date (from Stints)"] || undefined) || undefined,
        publicWebsiteActive: Boolean(f["Public website active"]) || undefined
      });
    },
    cacheEnabled: true,
  },
  'Charter roles': {
    airtableTable: 'Charter roles',
    fieldMapping: schema.CHARTER_ROLES_FIELDS,
    transformer: (record: any): schema.CharterRole => {
      const f = record.fields;
      return schema.createBaseTransformer(record, {
        charterApplications: schema.toStringArray(f["Charter applications"]) || undefined,
        email: String(f["Email"] || undefined) || undefined,
        title: String(f["Title"] || undefined) || undefined,
        charterId: String(f["charter_id"] || ""),
        raceEthnicityFromEducatorRecord: String(f["Race & Ethnicity (from Educator record)"] || undefined) || undefined,
        startDate: String(f["Start date"] || undefined) || undefined,
        role: schema.toStringArray(f["Role"]) || undefined,
        charterRoleKey: String(f["Charter role key"] || undefined) || undefined,
        currentPrimaryEmailAddressFromEducatorRecord: String(f["Current Primary Email Address (from Educator record)"] || undefined) || undefined,
        phone: String(f["Phone"] || undefined) || undefined,
        endDate: String(f["End date"] || undefined) || undefined,
        currentlyActive: Boolean(f["Currently active"]) || undefined,
        name: String(f["Name"] || undefined) || undefined,
        statusFromCharter: String(f["Status (from Charter)"] || undefined) || undefined,
        educatorRecord: schema.toStringArray(f["Educator record"]) || undefined,
        charterApplications2: String(f["Charter applications 2"] || undefined) || undefined,
        charterroleid: String(f["charter_role_id"] || undefined) || undefined,
        charter: schema.toStringArray(f["Charter"]) || undefined
      });
    },
    cacheEnabled: true,
  },
  'Montessori Certs': {
    airtableTable: 'Montessori Certs',
    fieldMapping: schema.MONTESSORI_CERTS_FIELDS,
    transformer: (record: any): schema.MontessoriCert => {
      const f = record.fields;
      return schema.createBaseTransformer(record, {
        certifierOther: String(f["Certifier - Other"] || undefined) || undefined,
        educatorId: String(f["educator_id"] || ""),
        level: String(f["Level"] || undefined) || undefined,
        yearCertified: String(f["Year Certified"] || undefined) || undefined,
        abbreviation: String(f["Abbreviation"] || undefined) || undefined,
        certificationStatus: String(f["Certification Status"] || undefined) || undefined,
        created: String(f["Created"] || undefined) || undefined
      });
    },
    cacheEnabled: true,
  },
  'Grants': {
    airtableTable: 'Grants',
    fieldMapping: schema.GRANTS_FIELDS,
    transformer: (record: any): schema.Grant => {
      const f = record.fields;
      return schema.createBaseTransformer(record, {
        proofOf501c3StatusAtTimeOfGrant: schema.toStringArray(f["Proof of 501(c)3 status at time of grant"].map(att => att?.url).filter(Boolean)) || undefined,
        grantStatus: String(f["Grant Status"] || undefined) || undefined,
        fundingPurposeForGrantAgreement: String(f["Funding purpose (for grant agreement)"] || undefined) || undefined,
        guideentrepreneurShortName: String(f["GuideEntrepreneur Short Name"] || undefined) || undefined,
        schoolContactEmailsFromSchool: String(f["School Contact Emails (from School)"] || undefined) || undefined,
        notes: String(f["Notes"] || undefined) || undefined,
        prelimAdviceRequestTime: String(f["Prelim advice request time"] || undefined) || undefined,
        haveDataToIssueGrantLetter: String(f["Have data to issue grant letter"] || undefined) || undefined,
        fullAdviceOpenObjections: schema.toNumber(f["Full Advice Open Objections"]) || undefined,
        mailingAddress: String(f["Mailing address"] || undefined) || undefined,
        issueDate: String(f["Issue Date"] || undefined) || undefined,
        signedGrantAgreement: schema.toStringArray(f["Signed Grant Agreement"].map(att => att?.url).filter(Boolean)) || undefined,
        fullAdviceRequestTime: String(f["Full advice request time"] || undefined) || undefined,
        fullAdviceYeses: schema.toNumber(f["Full Advice Yeses"]) || undefined,
        schoolId: String(f["school_id"] || ""),
        readyToAcceptGrant501c3Ein: String(f["Ready to accept grant (501c3 + EIN)"] || undefined) || undefined,
        grantid: String(f["grant_id"] || undefined) || undefined,
        prelimAdviceYeses: schema.toNumber(f["Prelim Advice Yeses"]) || undefined,
        fundingPeriodForGrantAgreement: String(f["Funding period (for grant agreement)"] || undefined) || undefined,
        tlsAtTimeOfGrant: String(f["TLs at time of grant"] || undefined) || undefined,
        membershipStatusFromSchool: String(f["Membership Status (from School)"] || undefined) || undefined,
        membershipStatusAtTimeOfGrant: String(f["Membership status at time of grant"] || undefined) || undefined,
        tlEmails: String(f["TL emails"] || undefined) || undefined,
        legalNameOfSchool: String(f["Legal Name of School"] || undefined) || undefined,
        legalNameAtTimeOfGrant: String(f["Legal Name at time of grant"] || undefined) || undefined,
        primaryContactsFromSchool: String(f["Primary Contacts (from School)"] || undefined) || undefined,
        accountingNotes: String(f["Accounting Notes"] || undefined) || undefined,
        tlEmailsAtTimeOfGrant: String(f["TL emails at time of grant"] || undefined) || undefined,
        ein: String(f["EIN"] || undefined) || undefined,
        daysSincePrelimAdviceRequest: String(f["Days since prelim advice request"] || undefined) || undefined,
        schoolGrantName: String(f["School Grant Name"] || undefined) || undefined,
        daysSinceFullAdviceRequest: String(f["Days since full advice request"] || undefined) || undefined,
        nonprofitStatus: String(f["Nonprofit status"] || undefined) || undefined,
        currentTls: String(f["Current TLs"] || undefined) || undefined,
        grantKey: String(f["Grant Key"] || undefined) || undefined,
        einAtTimeOfGrant: String(f["EIN at time of grant"] || undefined) || undefined,
        countOfActiveMailingAddressesFromSchool: schema.toNumber(f["Count of Active Mailing Addresses (from School)"]) || undefined,
        amount: schema.toNumber(f["Amount"]) || undefined,
        automationStepTrigger: String(f["Automation step trigger"] || undefined) || undefined,
        currentMailingAddressFromSchool: String(f["Current Mailing Address (from School)"] || undefined) || undefined,
        nonprofitStatusAtTimeOfGrant: String(f["Nonprofit status at time of grant"] || undefined) || undefined,
        currentTlsFirstNames: String(f["Current TLs first names"] || undefined) || undefined,
        school: schema.toStringArray(f["School"]) || undefined,
        textForLedgerEntry: String(f["Text for ledger entry"] || undefined) || undefined,
        label: String(f["Label"] || undefined) || undefined,
        fundingSource: String(f["Funding Source"] || undefined) || undefined,
        adviceWindow1WeekClosed: String(f["Advice window (1 week) closed"] || undefined) || undefined,
        issuedByName: String(f["Issued by Name"] || undefined) || undefined,
        logoFromSchool: String(f["Logo (from School)"] || undefined) || undefined,
        recipientNameFromQbo: String(f["Recipient name from QBO"] || undefined) || undefined,
        schoolShortName: String(f["School Short Name"] || undefined) || undefined,
        mailingAddressAtTimeOfGrant: String(f["Mailing address at time of grant"] || undefined) || undefined,
        unsignedGrantAgreement: schema.toStringArray(f["Unsigned Grant Agreement"].map(att => att?.url).filter(Boolean)) || undefined,
        billcom: String(f["Bill.com"] || undefined) || undefined,
        fundingHub: String(f["Funding Hub"] || undefined) || undefined,
        fullAdviceOpenQuestions: schema.toNumber(f["Full Advice Open Questions"]) || undefined,
        qbo: String(f["QBO #"] || undefined) || undefined,
        prelimAdvicePauses: schema.toNumber(f["Prelim Advice Pauses"]) || undefined,
        issuedByShortName: String(f["Issued by Short Name"] || undefined) || undefined,
        primaryContactEmailFromSchool: String(f["Primary Contact Email (from School)"] || undefined) || undefined
      });
    },
    cacheEnabled: true,
  },
  'Mailing lists': {
    airtableTable: 'Mailing lists',
    fieldMapping: schema.MAILING_LISTS_FIELDS,
    transformer: (record: any): schema.MailingList => {
      const f = record.fields;
      return schema.createBaseTransformer(record, {
        educatorLog: String(f["Educator Log"] || undefined) || undefined,
        type: String(f["Type"] || undefined) || undefined,
        slug: String(f["Slug"] || undefined) || undefined,
        name: String(f["Name"] || undefined) || undefined,
        googleGroupId: String(f["Google Group ID"] || undefined) || undefined
      });
    },
    cacheEnabled: true,
  },
  'Airtable Loan payments': {
    airtableTable: 'Airtable Loan payments',
    fieldMapping: schema.AIRTABLE_LOAN_PAYMENTS_FIELDS,
    transformer: (record: any): schema.AirtableLoanpayments => {
      const f = record.fields;
      return schema.createBaseTransformer(record, {
        amount: schema.toNumber(f["Amount"]) || undefined,
        paymentDate: String(f["Payment date"] || undefined) || undefined,
        school: schema.toStringArray(f["School"]) || undefined,
        shortName: String(f["Short Name"] || undefined) || undefined,
        paymentKey: String(f["Payment key"] || undefined) || undefined
      });
    },
    cacheEnabled: true,
  },
  'Airtable Loans': {
    airtableTable: 'Airtable Loans',
    fieldMapping: schema.AIRTABLE_LOANS_FIELDS,
    transformer: (record: any): schema.AirtableLoans => {
      const f = record.fields;
      return schema.createBaseTransformer(record, {
        schoolId: String(f["school_id"] || ""),
        loanPaperwork: schema.toStringArray(f["Loan paperwork"].map(att => att?.url).filter(Boolean)) || undefined,
        approximateOutstandingAmount: schema.toNumber(f["Approximate Outstanding Amount"]) || undefined,
        loanid: String(f["loan_id"] || undefined) || undefined,
        loanContactEmail1: String(f["Loan Contact Email 1"] || undefined) || undefined,
        loanStatus: String(f["Loan Status"] || undefined) || undefined,
        issueMethod: String(f["Issue Method"] || undefined) || undefined,
        loanKey: String(f["Loan Key"] || undefined) || undefined,
        school: schema.toStringArray(f["School"]) || undefined,
        interestRate: schema.toNumber(f["Interest Rate"]) || undefined,
        contactEmailFromEducatorFromEducatorsXSchoolsFromSchool: String(f["Contact email (from Educator) (from Educators x Schools) (from School)"] || undefined) || undefined,
        effectiveIssueDate: String(f["Effective Issue Date"] || undefined) || undefined,
        educatorsXSchools: schema.toStringArray(f["Educators x Schools"]) || undefined,
        amountIssued: schema.toNumber(f["Amount Issued"]) || undefined,
        useOfProceeds: String(f["Use of Proceeds"] || undefined) || undefined,
        notes: String(f["Notes"] || undefined) || undefined,
        loanContactEmail2: String(f["Loan Contact Email 2"] || undefined) || undefined,
        maturity: String(f["Maturity"] || undefined) || undefined
      });
    },
    cacheEnabled: true,
  },
  'Educator notes': {
    airtableTable: 'Educator notes',
    fieldMapping: schema.EDUCATOR_NOTES_FIELDS,
    transformer: (record: any): schema.EducatorNote => {
      const f = record.fields;
      return schema.createBaseTransformer(record, {
        notes: String(f["Notes"] || undefined) || undefined,
        private: Boolean(f["Private"]) || undefined,
        createdBy: schema.toStringArray(f["Created by"]) || undefined,
        partnersCopy: schema.toStringArray(f["Partners copy"]) || undefined,
        educator: schema.toStringArray(f["Educator"]) || undefined,
        educatornotesid: String(f["educator_notes_id"] || undefined) || undefined,
        educatorId: String(f["educator_id"] || ""),
        date: String(f["Date"] || undefined) || undefined,
        educatorNoteKey: String(f["Educator Note Key"] || undefined) || undefined,
        fullNameFromEducator: String(f["Full Name (from Educator)"] || undefined) || undefined
      });
    },
    cacheEnabled: true,
  },
  'Charter authorizers and contacts': {
    airtableTable: 'Charter authorizers and contacts',
    fieldMapping: schema.CHARTER_AUTHORIZERS_AND_CONTACTS_FIELDS,
    transformer: (record: any): schema.CharterAuthorizerContact => {
      const f = record.fields;
      return schema.createBaseTransformer(record, {
        authorizer: String(f["Authorizer"] || undefined) || undefined,
        charter: schema.toStringArray(f["Charter"]) || undefined,
        title: String(f["Title"] || undefined) || undefined,
        phone: String(f["Phone"] || undefined) || undefined,
        email: String(f["Email"] || undefined) || undefined,
        contact: String(f["Contact"] || undefined) || undefined,
        currentlyActive: Boolean(f["Currently active"]) || undefined,
        charterId: String(f["charter_id"] || undefined) || undefined,
        charterAuthorizerKey: String(f["Charter authorizer key"] || undefined) || undefined
      });
    },
    cacheEnabled: true,
  },
  'Assessment data': {
    airtableTable: 'Assessment data',
    fieldMapping: schema.ASSESSMENT_DATA_FIELDS,
    transformer: (record: any): schema.AssessmentData => {
      const f = record.fields;
      return schema.createBaseTransformer(record, {
        assessmentDataKey: String(f["Assessment Data key"] || undefined) || undefined,
        assessment: schema.toStringArray(f["Assessment"]) || undefined,
        metOrExceedsFrl: schema.toNumber(f["Met or exceeds - FRL"]) || undefined,
        numberAssessedEll: schema.toNumber(f["Number assessed - ELL"]) || undefined,
        year: schema.toStringArray(f["Year"]) || undefined,
        numberAssessedSped: schema.toNumber(f["Number assessed - SPED"]) || undefined,
        school: schema.toStringArray(f["School"]) || undefined,
        numberAssessed: schema.toNumber(f["Number assessed"]) || undefined,
        charterId: String(f["charter_id"] || undefined) || undefined,
        otherData: String(f["Other data"] || undefined) || undefined,
        metOrExceedsBipoc: schema.toNumber(f["Met or exceeds - BIPOC"]) || undefined,
        schoolid: String(f["school_id"] || undefined) || undefined,
        numberAssessedBipoc: schema.toNumber(f["Number assessed - BIPOC"]) || undefined,
        metOrExceedsAll: schema.toNumber(f["Met or exceeds - all"]) || undefined,
        assessmentdataid: String(f["assessment_data_id"] || undefined) || undefined,
        numberAssessedFrl: schema.toNumber(f["Number assessed - FRL"]) || undefined,
        charter: schema.toStringArray(f["Charter"]) || undefined,
        metOrExceedsSped: schema.toNumber(f["Met or exceeds - SPED"]) || undefined,
        metOrExceedsEll: schema.toNumber(f["Met or exceeds - ELL"]) || undefined
      });
    },
    cacheEnabled: true,
  },
  'Membership termination steps and dates': {
    airtableTable: 'Membership termination steps and dates',
    fieldMapping: schema.MEMBERSHIP_TERMINATION_STEPS_AND_DATES_FIELDS,
    transformer: (record: any): schema.MembershipTerminationStepDate => {
      const f = record.fields;
      return schema.createBaseTransformer(record, {
        fieldWithTargetDate: String(f["field with target date"] || undefined) || undefined,
        stepName: String(f["Step name"] || undefined) || undefined,
        dayOfProcess: schema.toNumber(f["Day of process"]) || undefined,
        responsiblePersonAtWf: String(f["Responsible person at WF"] || undefined) || undefined
      });
    },
    cacheEnabled: true,
  },
  'Educators x Schools': {
    airtableTable: 'Educators x Schools',
    fieldMapping: schema.EDUCATORS_X_SCHOOLS_FIELDS,
    transformer: (record: any): schema.EducatorSchoolAssociation => {
      const f = record.fields;
      return schema.createBaseTransformer(record, {
        edxschoolKey: String(f["edXschool key"] || undefined) || undefined,
        invitedTo2024Refresher: Boolean(f["Invited to 2024 Refresher"]) || undefined,
        whoInitiatedEtlRemoval: String(f["Who initiated E/TL removal?"] || undefined) || undefined,
        school: schema.toStringArray(f["School"]) || undefined,
        loanFund: Boolean(f["Loan Fund?"]) || undefined,
        loans: schema.toStringArray(f["Loans"]) || undefined,
        tlGift2022: Boolean(f["TL Gift 2022"]) || undefined,
        gsuiteRoles: String(f["GSuite Roles"] || undefined) || undefined,
        schoolShortName: String(f["School Short Name"] || undefined) || undefined,
        educator: schema.toStringArray(f["Educator"]) || undefined,
        onNationalWebsite: String(f["On National Website"] || undefined) || undefined,
        signedTlAcknowledgementCommitmentToMembership: Boolean(f["Signed TL Acknowledgement & Commitment to Membership"]) || undefined,
        emailStatus: String(f["Email Status"] || undefined) || undefined,
        ssjStage: String(f["SSJ Stage"] || undefined) || undefined,
        educatorId: String(f["educator_id"] || ""),
        firstNameFromEducator: String(f["First Name (from Educator)"] || undefined) || undefined,
        charterId: String(f["charter_id"] || undefined) || undefined,
        educatorFullName: String(f["Educator Full Name"] || undefined) || undefined,
        startDate: String(f["Start Date"] || undefined) || undefined,
        educatorsxschoolsid: String(f["educatorsXschools_id"] || undefined) || undefined,
        onWildflowerDirectory: String(f["On Wildflower Directory"] || undefined) || undefined,
        onTeacherLeaderGoogleGroup: String(f["On Teacher Leader Google Group"] || undefined) || undefined,
        montessoriCertifications: String(f["Montessori Certifications"] || undefined) || undefined,
        emailAtSchool: String(f["Email at School"] || undefined) || undefined,
        roles: schema.toStringArray(f["Roles"]) || undefined,
        stagestatus: String(f["Stage_Status"] || undefined) || undefined,
        schoolStatus: String(f["School Status"] || undefined) || undefined,
        currentlyActive: Boolean(f["Currently Active"]) || undefined,
        endDate: String(f["End Date"] || undefined) || undefined
      });
    },
    cacheEnabled: true,
  },
  'Nine nineties': {
    airtableTable: 'Nine nineties',
    fieldMapping: schema.NINE_NINETIES_FIELDS,
    transformer: (record: any): schema.Ninenineties => {
      const f = record.fields;
      return schema.createBaseTransformer(record, {
        supabaseid: String(f["supabase_id"] || undefined) || undefined,
        aiDerivedRevenue: schema.toNumber(f["AI Derived Revenue"]) || undefined,
        aiDerivedEoyDate: String(f["AI Derived EOY Date"] || undefined) || undefined,
        nineNinetiesReportingYear: String(f["Nine nineties Reporting Year"] || undefined) || undefined,
        schoolId: String(f["school_id"] || ""),
        charterId: String(f["charter_id"] || undefined) || undefined,
        notes: String(f["Notes"] || undefined) || undefined
      });
    },
    cacheEnabled: true,
  },
  'Governance docs': {
    airtableTable: 'Governance docs',
    fieldMapping: schema.GOVERNANCE_DOCS_FIELDS,
    transformer: (record: any): schema.GovernanceDocument => {
      const f = record.fields;
      return schema.createBaseTransformer(record, {
        documentType: String(f["Document type"] || undefined) || undefined,
        govdocid: String(f["govdoc_id"] || undefined) || undefined,
        date: String(f["Date"] || undefined) || undefined,
        docKey: String(f["Doc Key"] || undefined) || undefined,
        charterId: String(f["charter_id"] || undefined) || undefined,
        shortname: String(f["short_name"] || undefined) || undefined,
        docNotes: String(f["Doc notes"] || undefined) || undefined,
        docLink: String(f["Doc Link"] || undefined) || undefined,
        publicationLink: String(f["Publication link"] || undefined) || undefined,
        schoolId: String(f["school_id"] || undefined) || undefined,
        urlpdfExtensionFormula: String(f["url-->pdf extension formula"] || undefined) || undefined,
        school: schema.toStringArray(f["School"]) || undefined,
        documentPdf: schema.toStringArray(f["Document PDF"].map(att => att?.url).filter(Boolean)) || undefined,
        created: String(f["Created"] || undefined) || undefined,
        charter: schema.toStringArray(f["Charter"]) || undefined
      });
    },
    cacheEnabled: true,
  },
  'Guides Assignments': {
    airtableTable: 'Guides Assignments',
    fieldMapping: schema.GUIDES_ASSIGNMENTS_FIELDS,
    transformer: (record: any): schema.GuideAssignment => {
      const f = record.fields;
      return schema.createBaseTransformer(record, {
        currentlyActive: Boolean(f["Currently active"]) || undefined,
        guideShortName: String(f["Guide short name"] || undefined) || undefined,
        endDate: String(f["End date"] || undefined) || undefined,
        schoolShortName: String(f["School Short Name"] || undefined) || undefined,
        schoolId: String(f["school_id"] || ""),
        startDate: String(f["Start date"] || undefined) || undefined,
        type: String(f["Type"] || undefined) || undefined
      });
    },
    cacheEnabled: true,
  },
  'Training Grants': {
    airtableTable: 'Training Grants',
    fieldMapping: schema.TRAINING_GRANTS_FIELDS,
    transformer: (record: any): schema.TrainingGrant => {
      const f = record.fields;
      return schema.createBaseTransformer(record, {
        stageFromEducators: String(f["Stage (from Educators)"] || undefined) || undefined,
        trainingStatus: String(f["Training Status"] || undefined) || undefined,
        hubNameFromEducators: String(f["Hub Name (from Educators)"] || undefined) || undefined,
        trainingGrantAmount: schema.toNumber(f["Training Grant Amount"]) || undefined,
        statusFromEducators: String(f["Status (from Educators)"] || undefined) || undefined,
        trainingProgram: String(f["Training Program"] || undefined) || undefined,
        cohort: String(f["Cohort"] || undefined) || undefined,
        notes: String(f["Notes"] || undefined) || undefined,
        applied: Boolean(f["Applied?"]) || undefined,
        trainingGrantStatus: String(f["Training Grant Status"] || undefined) || undefined
      });
    },
    cacheEnabled: true,
  },
  'Reports and submissions': {
    airtableTable: 'Reports and submissions',
    fieldMapping: schema.REPORTS_AND_SUBMISSIONS_FIELDS,
    transformer: (record: any): schema.ReportSubmission => {
      const f = record.fields;
      return schema.createBaseTransformer(record, {
        charter: schema.toStringArray(f["Charter"]) || undefined,
        reportsid: String(f["reports_id"] || undefined) || undefined,
        attachments: schema.toStringArray(f["Attachments"].map(att => att?.url).filter(Boolean)) || undefined,
        schoolYear: schema.toStringArray(f["School year"]) || undefined,
        reportType: String(f["Report type"] || undefined) || undefined,
        charterId: String(f["charter_id"] || undefined) || undefined
      });
    },
    cacheEnabled: true,
  },
  'States Aliases': {
    airtableTable: 'States Aliases',
    fieldMapping: schema.STATES_ALIASES_FIELDS,
    transformer: (record: any): schema.StateAlias => {
      const f = record.fields;
      return schema.createBaseTransformer(record, {
        abbreviation: String(f["Abbreviation"] || undefined) || undefined,
        state: String(f["State"] || undefined) || undefined
      });
    },
    cacheEnabled: true,
  },
  'Public funding': {
    airtableTable: 'Public funding',
    fieldMapping: schema.PUBLIC_FUNDING_FIELDS,
    transformer: (record: any): schema.PublicFunding => {
      const f = record.fields;
      return schema.createBaseTransformer(record, {
        description: String(f["Description"] || undefined) || undefined,
        schools: schema.toStringArray(f["Schools"]) || undefined,
        name: String(f["Name"] || undefined) || undefined,
        relevantLevels: schema.toStringArray(f["Relevant levels"]) || undefined
      });
    },
    cacheEnabled: true,
  },
  'Annual enrollment and demographics': {
    airtableTable: 'Annual enrollment and demographics',
    fieldMapping: schema.ANNUAL_ENROLLMENT_AND_DEMOGRAPHICS_FIELDS,
    transformer: (record: any): schema.AnnualEnrollmentDemographic => {
      const f = record.fields;
      return schema.createBaseTransformer(record, {
        annualDataKey: String(f["Annual data key"] || undefined) || undefined,
        school: schema.toStringArray(f["School"]) || undefined,
        numberOfEnrolledStudentsFrl: schema.toNumber(f["Number of enrolled students - FRL"]) || undefined,
        numberOfEnrolledStudentsBipoc: schema.toNumber(f["Number of enrolled students - BIPOC"]) || undefined,
        charter: schema.toStringArray(f["Charter"]) || undefined,
        schoolId: String(f["school_id (from School)"] || undefined) || undefined,
        numberOfEnrolledStudentsSped: schema.toNumber(f["Number of enrolled students - SPED"]) || undefined,
        numberOfEnrolledStudentsAll: schema.toNumber(f["Number of enrolled students - all"]) || undefined,
        numberOfEnrolledStudentsEll: schema.toNumber(f["Number of enrolled students - ELL"]) || undefined,
        schoolYear: schema.toStringArray(f["School Year"]) || undefined,
        annualdataid: String(f["annual_data_id"] || undefined) || undefined
      });
    },
    cacheEnabled: true,
  },
  'Assessments': {
    airtableTable: 'Assessments',
    fieldMapping: schema.ASSESSMENTS_FIELDS,
    transformer: (record: any): schema.Assessment => {
      const f = record.fields;
      return schema.createBaseTransformer(record, {
        shortName: String(f["Short Name"] || undefined) || undefined,
        fullName: String(f["Full Name"] || undefined) || undefined,
        domain: String(f["Domain"] || undefined) || undefined,
        annualAssessmentImplementationsBySchool: schema.toStringArray(f["Annual Assessment Implementations by School"]) || undefined,
        grades: schema.toStringArray(f["Grades"]) || undefined
      });
    },
    cacheEnabled: true,
  },
  'Event types': {
    airtableTable: 'Event types',
    fieldMapping: schema.EVENT_TYPES_FIELDS,
    transformer: (record: any): schema.EventType => {
      const f = record.fields;
      return schema.createBaseTransformer(record, {
        events: schema.toStringArray(f["Events"]) || undefined,
        eventCategory: String(f["Event Category"] || undefined) || undefined
      });
    },
    cacheEnabled: true,
  },
  'Email Addresses': {
    airtableTable: 'Email Addresses',
    fieldMapping: schema.EMAIL_ADDRESSES_FIELDS,
    transformer: (record: any): schema.EmailAddress => {
      const f = record.fields;
      return schema.createBaseTransformer(record, {
        emailType: String(f["Email Type"] || undefined) || undefined,
        active: Boolean(f["Active?"]) || undefined,
        emailAddress: String(f["Email Address"] || undefined) || undefined,
        educatorId: String(f["educator_id"] || ""),
        educator: schema.toStringArray(f["Educator"]) || undefined,
        emailaddressid: String(f["email_address_id"] || undefined) || undefined,
        currentPrimaryEmail: Boolean(f["Current Primary Email"]) || undefined
      });
    },
    cacheEnabled: true,
  },
  'Montessori Certifiers - old list': {
    airtableTable: 'Montessori Certifiers - old list',
    fieldMapping: schema.MONTESSORI_CERTIFIERS_OLD_LIST_FIELDS,
    transformer: (record: any): schema.MontessoriCertifierOld => {
      const f = record.fields;
      return schema.createBaseTransformer(record, {
        name: String(f["Name"] || undefined) || undefined,
        ssjFilloutFormGetInvolved2: String(f["SSJ Fillout Form: Get Involved 2"] || undefined) || undefined,
        ssjFilloutFormGetInvolved: String(f["SSJ Fillout Form: Get Involved"] || undefined) || undefined,
        ssjFilloutFormGetInvolved4: String(f["SSJ Fillout Form: Get Involved 4"] || undefined) || undefined,
        abbreviation: String(f["Abbreviation"] || undefined) || undefined,
        ssjFilloutFormGetInvolved3: String(f["SSJ Fillout Form: Get Involved 3"] || undefined) || undefined
      });
    },
    cacheEnabled: true,
  },
  'Marketing source options': {
    airtableTable: 'Marketing source options',
    fieldMapping: schema.MARKETING_SOURCE_OPTIONS_FIELDS,
    transformer: (record: any): schema.MarketingSourceOption => {
      const f = record.fields;
      return schema.createBaseTransformer(record, {
        marketingSource: String(f["Marketing Source"] || undefined) || undefined,
        educators: schema.toStringArray(f["Educators"]) || undefined
      });
    },
    cacheEnabled: true,
  },
  'Montessori Cert Levels': {
    airtableTable: 'Montessori Cert Levels',
    fieldMapping: schema.MONTESSORI_CERT_LEVELS_FIELDS,
    transformer: (record: any): schema.MontessoriCertLevel => {
      const f = record.fields;
      return schema.createBaseTransformer(record, {
        name: String(f["Name"] || undefined) || undefined,
        educators: String(f["Educators"] || undefined) || undefined
      });
    },
    cacheEnabled: true,
  },
  'Race and Ethnicity': {
    airtableTable: 'Race and Ethnicity',
    fieldMapping: schema.RACE_AND_ETHNICITY_FIELDS,
    transformer: (record: any): schema.RaceAndEthnicity => {
      const f = record.fields;
      return schema.createBaseTransformer(record, {
        ssjFilloutFormGetInvolved: String(f["SSJ Fillout Form: Get Involved"] || undefined) || undefined,
        name: String(f["Name"] || undefined) || undefined
      });
    },
    cacheEnabled: true,
  },
  'Ages-Grades': {
    airtableTable: 'Ages-Grades',
    fieldMapping: schema.AGES_GRADES_FIELDS,
    transformer: (record: any): schema.AgeGrade => {
      const f = record.fields;
      return schema.createBaseTransformer(record, {
        name: String(f["Name"] || undefined) || undefined
      });
    },
    cacheEnabled: true,
  },
  'Montessori Certifiers': {
    airtableTable: 'Montessori Certifiers',
    fieldMapping: schema.MONTESSORI_CERTIFIERS_FIELDS,
    transformer: (record: any): schema.MontessoriCertifier => {
      const f = record.fields;
      return schema.createBaseTransformer(record, {
        abbreviation: String(f["Abbreviation"] || undefined) || undefined,
        name: String(f["Name"] || undefined) || undefined
      });
    },
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
export const getAirtableLoanpaymentss = () => getAll<schema.AirtableLoanpayments>('Airtable Loan payments');
export const getAirtableLoanpaymentsById = (id: string) => getById<schema.AirtableLoanpayments>('Airtable Loan payments', id);
export const getAirtableLoanss = () => getAll<schema.AirtableLoans>('Airtable Loans');
export const getAirtableLoansById = (id: string) => getById<schema.AirtableLoans>('Airtable Loans', id);
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
