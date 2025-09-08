import { base } from "./airtable-schema";
import { firstId, toStringArray, toNumber, toYesBool, createdAt, updatedAt, firstAttachment, ffEq } from "./storage/util";
import { transformLocationRecord } from "./storage/locations";
import { transformEXSRecord } from "./storage/exs";
import { transformGovernanceDocument, transformCharterGovernanceDocument, transformCharter990, transformTax990, transformCharterNote } from "./storage/governance";
import { transformActionStepRecord } from "./storage/action-steps";
import { cache } from "./cache";
import { handleError } from "./error-handler";
import { AIRTABLE_TABLES as AT } from "@shared/airtable-tables";
import type { 
  Charter,
  Educator, 
  School, 
  EducatorSchoolAssociation, 
  Location,
  GuideAssignment,
  GovernanceDocument,
  SchoolNote,
  Grant,
  Loan,
//  MembershipFeeByYear,
//  MembershipFeeUpdate,
  EmailAddress,
  ActionStep,
  CharterRole,
  CharterApplication,
  CharterAuthorizerContact,
  ReportSubmission,
  AssessmentData,
  CharterNote,
  CharterActionStep,
  CharterGovernanceDocument,
  Charter990,
  InsertEducator, 
  InsertSchool, 
  InsertEducatorSchoolAssociation,
  InsertLocation,
  InsertGuideAssignment,
  InsertGovernanceDocument,
  InsertSchoolNote,
  InsertGrant,
  InsertLoan,
//  InsertMembershipFeeByYear,
//  InsertMembershipFeeUpdate,
  InsertEmailAddress,
  SSJFilloutForm,
  InsertSSJFilloutForm,
  MontessoriCertification,
  InsertMontessoriCertification,
  EventAttendance,
  InsertEventAttendance,
  EducatorNote,
  InsertEducatorNote,
  Teacher,
  TeacherSchoolAssociation,
  InsertTeacher,
  InsertTeacherSchoolAssociation,
  Tax990
} from "@shared/schema";
import {
  SCHOOLS_FIELDS as SF,
  EDUCATORS_FIELDS as EF,
  CHARTERS_FIELDS as CHF,
  EDUCATORS_X_SCHOOLS_FIELDS as EXSF,
  LOCATIONS_FIELDS as LF,
  GUIDES_ASSIGNMENTS_FIELDS as GASF,
  GRANTS_FIELDS as GF,
  LOANS_FIELDS as LNF,
  GOVERNANCE_DOCS_FIELDS as GDF,
  SCHOOL_NOTES_FIELDS as SNF,
  _990S_FIELDS as N9F,
  ACTION_STEPS_FIELDS as ASF,
  EMAIL_ADDRESSES_FIELDS as EAF,
  MONTESSORI_CERTS_FIELDS as MCF,
  MONTESSORI_CERTIFIERS_FIELDS as MCFI,
  EVENT_ATTENDANCE_FIELDS as EATF,
  EVENTS_FIELDS as EVF,
  EDUCATOR_NOTES_FIELDS as ENF,
  SSJ_FILLOUT_FORMS_FIELDS as SJF,
  CHARTER_ROLES_FIELDS as CRF,
  CHARTER_APPLICATIONS_FIELDS as CAF,
  CHARTER_AUTHORIZERS_AND_CONTACTS_FIELDS as CACF,
  REPORTS_AND_SUBMISSIONS_FIELDS as RSF,
  ASSESSMENT_DATA_FIELDS as ADF,
} from "@shared/airtable-schema";

export interface IStorage {
  // Charter operations
  getCharters(): Promise<Charter[]>;
  getCharter(id: string): Promise<Charter | undefined>;

  // Educator operations
  getEducators(): Promise<Educator[]>;
  getEducator(id: string): Promise<Educator | undefined>;
  getEducatorByEmail(email: string): Promise<Educator | undefined>;
  createEducator(educator: InsertEducator): Promise<Educator>;
  updateEducator(id: string, educator: Partial<InsertEducator>): Promise<Educator | undefined>;
  deleteEducator(id: string): Promise<boolean>;
  
  // School operations
  getSchools(): Promise<School[]>;
  getSchool(id: string): Promise<School | undefined>;
  createSchool(school: InsertSchool): Promise<School>;
  updateSchool(id: string, school: Partial<InsertSchool>): Promise<School | undefined>;
  deleteSchool(id: string): Promise<boolean>;
  
  // Educator-School Association operations
  getEducatorSchoolAssociations(): Promise<EducatorSchoolAssociation[]>;
  getEducatorAssociations(educatorId: string): Promise<EducatorSchoolAssociation[]>;
  getSchoolAssociations(schoolId: string): Promise<EducatorSchoolAssociation[]>;
  createEducatorSchoolAssociation(association: InsertEducatorSchoolAssociation): Promise<EducatorSchoolAssociation>;
  updateEducatorSchoolAssociation(id: string, association: Partial<InsertEducatorSchoolAssociation>): Promise<EducatorSchoolAssociation | undefined>;
  deleteEducatorSchoolAssociation(id: string): Promise<boolean>;

  // Location operations
  getLocations(): Promise<Location[]>;
  getLocation(id: string): Promise<Location | undefined>;
  getLocationsBySchoolId(schoolId: string): Promise<Location[]>;
  createLocation(location: InsertLocation): Promise<Location>;
  updateLocation(id: string, location: Partial<InsertLocation>): Promise<Location | undefined>;
  deleteLocation(id: string): Promise<boolean>;

  // Guide assignment operations
  getGuideAssignments(): Promise<GuideAssignment[]>;
  getGuideAssignment(id: string): Promise<GuideAssignment | undefined>;
  getGuideAssignmentsBySchoolId(schoolId: string): Promise<GuideAssignment[]>;
  createGuideAssignment(assignment: InsertGuideAssignment): Promise<GuideAssignment>;
  updateGuideAssignment(id: string, assignment: Partial<InsertGuideAssignment>): Promise<GuideAssignment | undefined>;
  deleteGuideAssignment(id: string): Promise<boolean>;

  // Governance document operations
  getGovernanceDocuments(): Promise<GovernanceDocument[]>;
  getGovernanceDocument(id: string): Promise<GovernanceDocument | undefined>;
  getGovernanceDocumentsBySchoolId(schoolId: string): Promise<GovernanceDocument[]>;
  createGovernanceDocument(document: InsertGovernanceDocument): Promise<GovernanceDocument>;
  updateGovernanceDocument(id: string, document: Partial<InsertGovernanceDocument>): Promise<GovernanceDocument | undefined>;
  deleteGovernanceDocument(id: string): Promise<boolean>;

  // School note operations
  getSchoolNotes(): Promise<SchoolNote[]>;
  getSchoolNote(id: string): Promise<SchoolNote | undefined>;
  getSchoolNotesBySchoolId(schoolId: string): Promise<SchoolNote[]>;
  createSchoolNote(note: InsertSchoolNote): Promise<SchoolNote>;
  updateSchoolNote(id: string, note: Partial<InsertSchoolNote>): Promise<SchoolNote | undefined>;
  deleteSchoolNote(id: string): Promise<boolean>;

  // Grant operations
  getGrants(): Promise<Grant[]>;
  getGrant(id: string): Promise<Grant | undefined>;
  getGrantsBySchoolId(schoolId: string): Promise<Grant[]>;
  createGrant(grant: InsertGrant): Promise<Grant>;
  updateGrant(id: string, grant: Partial<InsertGrant>): Promise<Grant | undefined>;
  deleteGrant(id: string): Promise<boolean>;

  // Loan operations
  getLoans(): Promise<Loan[]>;
  getLoan(id: string): Promise<Loan | undefined>;
  getLoansBySchoolId(schoolId: string): Promise<Loan[]>;
  createLoan(loan: InsertLoan): Promise<Loan>;
  updateLoan(id: string, loan: Partial<InsertLoan>): Promise<Loan | undefined>;
  deleteLoan(id: string): Promise<boolean>;

  /*
  // Membership fee by year operations
  getMembershipFeesByYear(): Promise<MembershipFeeByYear[]>;
  getMembershipFeeByYear(id: string): Promise<MembershipFeeByYear | undefined>;
  getMembershipFeesBySchoolId(schoolId: string): Promise<MembershipFeeByYear[]>;
  createMembershipFeeByYear(fee: InsertMembershipFeeByYear): Promise<MembershipFeeByYear>;
  updateMembershipFeeByYear(id: string, fee: Partial<InsertMembershipFeeByYear>): Promise<MembershipFeeByYear | undefined>;
  deleteMembershipFeeByYear(id: string): Promise<boolean>;

  // Membership fee update operations
  getMembershipFeeUpdates(): Promise<MembershipFeeUpdate[]>;
  getMembershipFeeUpdate(id: string): Promise<MembershipFeeUpdate | undefined>;
  getMembershipFeeUpdatesBySchoolId(schoolId: string): Promise<MembershipFeeUpdate[]>;
  getMembershipFeeUpdatesBySchoolIdAndYear(schoolId: string, schoolYear: string): Promise<MembershipFeeUpdate[]>;
  createMembershipFeeUpdate(update: InsertMembershipFeeUpdate): Promise<MembershipFeeUpdate>;
  updateMembershipFeeUpdate(id: string, update: Partial<InsertMembershipFeeUpdate>): Promise<MembershipFeeUpdate | undefined>;
  deleteMembershipFeeUpdate(id: string): Promise<boolean>;
*/
  // Email address operations
  getEmailAddresses(): Promise<EmailAddress[]>;
  getEmailAddress(id: string): Promise<EmailAddress | undefined>;
  getEmailAddressesByEducatorId(educatorId: string): Promise<EmailAddress[]>;
  createEmailAddress(emailAddress: InsertEmailAddress): Promise<EmailAddress>;
  updateEmailAddress(id: string, emailAddress: Partial<InsertEmailAddress>): Promise<EmailAddress | undefined>;
  deleteEmailAddress(id: string): Promise<boolean>;

  // SSJ Fillout Forms operations
  getSSJFilloutForms(): Promise<SSJFilloutForm[]>;
  getSSJFilloutForm(id: string): Promise<SSJFilloutForm | undefined>;
  getSSJFilloutFormsByEducatorId(educatorId: string): Promise<SSJFilloutForm[]>;
  createSSJFilloutForm(form: InsertSSJFilloutForm): Promise<SSJFilloutForm>;
  updateSSJFilloutForm(id: string, form: Partial<InsertSSJFilloutForm>): Promise<SSJFilloutForm | undefined>;
  deleteSSJFilloutForm(id: string): Promise<boolean>;

  // Montessori Certifications operations
  getMontessoriCertifications(): Promise<MontessoriCertification[]>;
  getMontessoriCertification(id: string): Promise<MontessoriCertification | undefined>;
  getMontessoriCertificationsByEducatorId(educatorId: string): Promise<MontessoriCertification[]>;
  createMontessoriCertification(certification: InsertMontessoriCertification): Promise<MontessoriCertification>;
  updateMontessoriCertification(id: string, certification: Partial<InsertMontessoriCertification>): Promise<MontessoriCertification | undefined>;
  deleteMontessoriCertification(id: string): Promise<boolean>;

  // Event Attendance operations
  getEventAttendances(): Promise<EventAttendance[]>;
  getEventAttendance(id: string): Promise<EventAttendance | undefined>;
  getEventAttendancesByEducatorId(educatorId: string): Promise<EventAttendance[]>;
  createEventAttendance(attendance: InsertEventAttendance): Promise<EventAttendance>;
  updateEventAttendance(id: string, attendance: Partial<InsertEventAttendance>): Promise<EventAttendance | undefined>;
  deleteEventAttendance(id: string): Promise<boolean>;

  // Educator Notes operations
  getEducatorNotes(): Promise<EducatorNote[]>;
  getEducatorNote(id: string): Promise<EducatorNote | undefined>;
  getEducatorNotesByEducatorId(educatorId: string): Promise<EducatorNote[]>;
  createEducatorNote(note: InsertEducatorNote): Promise<EducatorNote>;
  updateEducatorNote(id: string, note: Partial<InsertEducatorNote>): Promise<EducatorNote | undefined>;
  deleteEducatorNote(id: string): Promise<boolean>;

  // Action Step operations
  getActionStepsBySchoolId(schoolId: string): Promise<ActionStep[]>;
  getActionStepsByUserId(userId: string): Promise<ActionStep[]>;
  createActionStep(schoolId: string, data: { item: string; assignee?: string; dueDate?: string; status?: string }): Promise<ActionStep>;
  updateActionStep(id: string, data: { item?: string; assignee?: string; dueDate?: string; status?: string }): Promise<ActionStep | undefined>;
  deleteActionStep(id: string): Promise<boolean>;
  getSchoolsByUserId(userId: string): Promise<School[]>;

  // Legacy methods for backward compatibility
  getTeachers(): Promise<Teacher[]>;
  getTeacher(id: string): Promise<Teacher | undefined>;
  getTeacherByEmail(email: string): Promise<Teacher | undefined>;
  createTeacher(teacher: InsertTeacher): Promise<Teacher>;
  updateTeacher(id: string, teacher: Partial<InsertTeacher>): Promise<Teacher | undefined>;
  deleteTeacher(id: string): Promise<boolean>;
  getTeacherSchoolAssociations(): Promise<TeacherSchoolAssociation[]>;
  getTeacherAssociations(teacherId: string): Promise<TeacherSchoolAssociation[]>;
  createTeacherSchoolAssociation(association: InsertTeacherSchoolAssociation): Promise<TeacherSchoolAssociation>;
  updateTeacherSchoolAssociation(id: string, association: Partial<InsertTeacherSchoolAssociation>): Promise<TeacherSchoolAssociation | undefined>;
  deleteTeacherSchoolAssociation(id: string): Promise<boolean>;

  // Charter-related operations
  getSchoolsByCharterId(charterId: string): Promise<School[]>;
  getCharterRolesByCharterId(charterId: string): Promise<CharterRole[]>;
  
  // Metadata operations
  getMetadata(): Promise<any[]>;
  getSchoolFieldOptions(): Promise<any>;
  getCharterApplicationsByCharterId(charterId: string): Promise<CharterApplication[]>;
  getCharterAuthorizerContactsByCharterId(charterId: string): Promise<CharterAuthorizerContact[]>;
  getReportSubmissionsByCharterId(charterId: string): Promise<ReportSubmission[]>;
  getAssessmentDataByCharterId(charterId: string): Promise<AssessmentData[]>;
  getCharterNotesByCharterId(charterId: string): Promise<CharterNote[]>;
  getCharterActionStepsByCharterId(charterId: string): Promise<CharterActionStep[]>;
  getCharterGovernanceDocumentsByCharterId(charterId: string): Promise<CharterGovernanceDocument[]>;
  getCharter990sByCharterId(charterId: string): Promise<Charter990[]>;
  getEducatorSchoolAssociationsByCharterId(charterId: string): Promise<EducatorSchoolAssociation[]>;
}

export class SimpleAirtableStorage implements IStorage {
  // --------------------
  // Shared helpers (DRY)
  // --------------------
  // helpers moved to server/storage/util.ts
  // Helper method to transform Airtable record to Charter
  private transformCharterRecord(record: any): Charter {
    const fields = record.fields;
    
    return {
      id: record.id,
      shortName: fields[CHF.Short_Name] || undefined,
      fullName: fields[CHF.Full_name] || undefined,
      initialTargetCommunity: fields[CHF.Initial_target_community] || undefined,
      projectedOpen: fields[CHF.Projected_open] || undefined,
      initialTargetAges: fields[CHF.Initial_target_ages] || undefined,
      status: fields[CHF.Status] || undefined,
      created: fields["Created"] || fields["Created time"] || undefined,
      lastModified: fields["Last Modified"] || fields["Last modified"] || undefined,
    };
  }

  // Charter operations
  async getCharters(): Promise<Charter[]> {
    // Check cache first
    const cacheKey = 'charters:all';
    const cached = cache.get<Charter[]>(cacheKey);
    if (cached) {
      console.log('[Cache Hit] Charters');
      return cached;
    }

    try {
      const records = await base(AT.CHARTERS).select().all();
      const charters = records.map(record => this.transformCharterRecord(record));
      
      // Cache the results
      cache.set(cacheKey, charters);
      console.log('[Cache Miss] Charters - fetched from Airtable');
      
      return charters;
    } catch (error) {
      const errorInfo = handleError(error);
      console.error("Error fetching charters from Airtable:", errorInfo.message);
      throw error;
    }
  }

  async getCharter(id: string): Promise<Charter | undefined> {
    try {
      const record = await base(AT.CHARTERS).find(id);
      return this.transformCharterRecord(record);
    } catch (error) {
      console.error(`Error fetching charter ${id} from Airtable:`, error);
      return undefined;
    }
  }

  // Helper method to transform Airtable record to Educator
  private transformEducatorRecord(record: any): Educator {
    const fields = record.fields;
    
    return {
      id: record.id,
      fullName: fields[EF.Full_Name] || undefined,
      firstName: fields[EF.First_Name] || undefined,
      nickname: fields[EF.Nickname] || undefined,
      middleName: fields[EF.Middle_Name] || undefined,
      lastName: fields[EF.Last_Name] || undefined,
      primaryPhone: fields[EF.Primary_phone] || undefined,
      secondaryPhone: fields[EF.Secondary_phone] || undefined,
      currentPrimaryEmailAddress: fields[EF.Current_Primary_Email_Address] || undefined,  
      currentRoleSchool: fields[EF.Current_Role_School_for_UI] || undefined,
      homeAddress: fields[EF.Home_Address] || undefined,
      pronouns: fields[EF.Pronouns] || undefined,
      pronounsOther: fields[EF.Pronouns___Other] || undefined,
      gender: fields[EF.Gender] || undefined,
      genderOther: fields[EF.Gender___Other] || undefined,
      raceEthnicity: fields[EF.Race___Ethnicity] || undefined,
      raceEthnicityOther: fields[EF.Race___Ethnicity___Other] || undefined,
      lgbtqia: fields[EF.LGBTQIA] === 'Yes' || fields[EF.LGBTQIA] === true,
      primaryLanguage: toStringArray(fields[EF.Primary_Language]),
      otherLanguages: toStringArray(fields[EF.Other_languages]),
      householdIncome: fields[EF.Household_Income] || undefined,
      incomeBackground: fields[EF.Income_Background] || undefined,
      individualType: fields[EF.Individual_Type] || undefined,

      educationalAttainment: fields[EF.Educational_Attainment] || undefined,
      montessoriCertified: toYesBool(fields[EF.Montessori_Certified]),
      montessoriLeadGuideTrainings: toStringArray(fields[EF.Montessori_lead_guide_trainings]),

      currentRole: toStringArray(fields[EF.Current_Role]),
      activeSchool: toStringArray(fields[EF.Currently_Active_School]),
      activeSchoolStageStatus: toStringArray(fields[EF.Stage_Status_for_Active_School]),
      discoveryStatus: fields[EF.Discovery_status] || undefined,
      kanban: fields[EF.Kanban] || undefined,

      assignedPartner: toStringArray(fields[EF.Assigned_Partner]),
      assignedPartnerEmail: toStringArray(fields[EF.Assigned_Partner_Email]),
      personResponsibleForFollowUp: fields[EF.Person_responsible_for_follow_up] || undefined,

      firstContactRelocate: fields[EF.First_contact___Willingness_to_relocate] || '',
      firstContactGovernance: fields[EF.First_contact___Initial_Interest_in_Governance_Model] || '',
      firstContactNotesOnPreWildflowerEmployment: fields[EF.First_contact___Notes_on_pre_Wildflower_employment] || '',
      firstContactWFSchoolEmploymentStatus: fields[EF.First_contact___WF_School_employment_status] || '',
      firstContactAges: toStringArray(fields[EF.First_contact___initial_interest_in_ages]) || [],
      firstContactInterests: fields[EF.First_contact___initial_interests] || '',

      targetCity: fields[EF.Target_city] || undefined,
      targetState: fields[EF.Target_state] || undefined,
      targetGeoCombined: fields[EF.Target_geo_combined] || undefined,
      targetIntl: fields[EF.Target___international] || undefined,

      // Early Cultivation Data - Updated field mappings based on SSJ form data
    //  source: fields[EF.Source] || undefined,
    //  sendgridTemplateSelected: fields[EF.SendGrid_template_id] || undefined,
    //  sendgridSendDate: fields[EF.SendGrid_sent_date] || undefined,
    //  routedTo: fields[EF.Routed_To] || undefined,
    //  assignedPartnerOverride: fields[EF.Assigned_Partner_Override] || undefined,
    //  personalEmailSent: fields[EF.Email_sent_by_Initial_Outreacher_] === 'Yes',
    //  personalEmailSentDate: undefined,
    //  personResponsibleForFollowUp: fields[EF.Person_responsible_for_follow_up] || undefined,
    //  oneOnOneSchedulingStatus: undefined,
      opsGuideMeetingPrefTime: fields[EF.Ops_Guide_Meeting_Preference_Time] || '',
      opsGuideSpecificsChecklist: fields[EF.Ops_Guide_Specifics_Checklist] || [],
      opsGuideReqPertinentInfo: fields[EF.Ops_Guide_Request_Pertinent_Info] || [],
      opsGuideSupportTypeNeeded: fields[EF.Ops_Guide_Support_Type_Needed] || [],
      opsGuideFundraisingOps: fields[EF.Ops_Guide_Any_fundraising_opportunities_] || '',
      tcUserID: fields[EF.TC_User_ID] || undefined,
      inactiveFlag: fields[EF.Inactive_Flag] === true,
      created: fields[EF.Created] || undefined,
      lastModified: fields[EF.Last_Modified] || undefined,
      createdBy: fields[EF.Created_By]?.name || undefined,
      archived: fields[EF.Archived] === true,
      assignedPartnerShortName: fields[EF.Assigned_Partner_Short_Name] || undefined,
      boardService: fields[EF.Board_Service] || undefined,
      cohorts: fields[EF.Cohorts] || undefined,
      excludeFromEmailLogging: fields[EF.Exclude_from_email_logging] === true,
      onSchoolBoard: fields[EF.On_school_board] === true,
      pronunciation: fields[EF.Pronunciation] || undefined,
      raceAndEthnicity: fields[EF.Race_and_Ethnicity] || undefined,
      selfReflection: fields[EF.Self_reflection] || undefined,
      sourceOther: fields[EF.Source___other] || undefined,
    };
  }

  // Helper method to transform Airtable record to School
  private transformSchoolRecord(record: any): School {
    const fields = record.fields;
    

    return {
      id: record.id,
      name: fields[SF.Name] || "",
      shortName: fields[SF.Short_Name] || undefined,
      logo: fields[SF.Logo]?.[0]?.url || undefined,
      logoMainSquare: fields[SF.Logo___main_square]?.[0]?.url || undefined,
      logoFlowerOnly: fields[SF.Logo___flower_only]?.[0]?.url || undefined,
      logoMainRectangle: fields[SF.Logo___main_rectangle]?.[0]?.url || undefined,
      logoUrl: fields[SF.Logo_URL] || undefined,
      currentPhysicalAddress: fields[SF.Current_Physical_Address] || undefined,
      currentMailingAddress: fields[SF.Current_Mailing_Address] || undefined,
      activeLatitude: fields[SF.activeLatitude] ? parseFloat(String(fields[SF.activeLatitude])) : undefined,
      activeLongitude: fields[SF.activeLongitude] ? parseFloat(String(fields[SF.activeLongitude])) : undefined,
      ssjTargetCity: fields[SF.SSJ___Target_City] || null,
      ssjTargetState: fields[SF.SSJ___Target_State] || null,
      locality: (fields[SF.Current_Physical_Address___City]
        ? `${fields[SF.Current_Physical_Address___City]}${fields[SF.Current_Physical_Address___State] ? ', ' + fields[SF.Current_Physical_Address___State] : ''}`
        : fields[SF.SSJ___Target_City]
          ? `${fields[SF.SSJ___Target_City]}${fields[SF.SSJ___Target_State] ? ', ' + fields[SF.SSJ___Target_State] : ''}`
          : ''),
      phone: fields[SF.School_Phone] || undefined,
      email: fields[SF.School_Email] || undefined,
      emailDomain: fields[SF.Email_Domain] || undefined,
      domainName: fields[SF.Domain_Name] || undefined,
      website: fields[SF.Website] || undefined,
      instagram: fields[SF.Instagram] || undefined,
      facebook: fields[SF.Facebook] || undefined,
      archived: fields[SF.Archived] === true,
      priorNames: fields[SF.Prior_Names] || '',
      narrative: fields[SF.Narrative] || '',
      institutionalPartner: fields[SF.Institutional_partner] || null,
      membershipStatus: fields[SF.Membership_Status] || '',
      founders: fields[SF.Founders] || [],
      foundersFullNames: fields[SF.Founders_Full_Names] || [],
      membershipAgreementDate: fields[SF.Membership_Agreement_date] || '',
      signedMembershipAgreement: fields[SF.Signed_Membership_Agreement] || '',
      agreementVersion: fields[SF.Agreement_Version_] || '',
      membershipTerminationLetter: fields[SF.Membership_termination_letter] || '',
      primaryContactEmail: fields[SF.Primary_Contact_Email] || '',
      about: fields[SF.About] || '',
      aboutSpanish: fields[SF.About_Spanish] || '',
      agesServed: fields[SF.Ages_served] || undefined,
      governanceModel: fields[SF.Governance_Model] || undefined,
      status: fields[SF.School_Status] || undefined,
      stageStatus: fields[SF.Stage_Status] || undefined,
      openDate: fields[SF.Opened] || undefined,
      enrollmentCap: fields[SF.Enrollment_at_Full_Capacity] || undefined,
      lastModified: fields[SF.Last_Modified] || undefined,
      currentTLs: fields[SF.Current_TLs] || undefined,
      currentGuides: fields[SF.Current_Guides] || [],
      publicFundingSources: fields[SF.Public_funding_sources] || [],
      programFocus: fields[SF.Program_Focus] || undefined,
      numberOfClassrooms: fields[SF.Number_of_classrooms] || undefined,
      leftNetworkDate: fields[SF.Left_Network_Date] || undefined,
      leftNetworkReason: fields[SF.Left_Network_Reason] || undefined,
      schoolCalendar: fields[SF.School_calendar] || undefined,
      schoolSchedule: fields[SF.School_schedule] || undefined,

      // membershipFeeStatus: fields["Membership Fee Status"] || undefined,

      // --- SSJ/OSS Data ---
      ssjStage: fields[SF.SSJ_Stage] || '',
      ssjOriginalProjectedOpenDate: fields[SF.SSJ___Original_Projected_Open_Date] || '',
      ssjProjOpenSchoolYear: fields[SF.SSJ___Proj_Open_School_Year] || '',
      ssjProjectedOpen: fields[SF.SSJ___Projected_Open] || '',
     
      riskFactors: fields[SF.Risk_Factors] || [],
      watchlist: fields[SF.Watchlist] || [],
      errors: fields[SF.Errors] || [],
  
      // Nonprofit status
      groupExemptionStatus: fields[SF.Group_exemption_status] || '',
      dateReceivedGroupExemption: fields[SF.Date_received_group_exemption] || '',
      dateWithdrawnGroupExemption: fields[SF.Date_withdrawn_from_Group_Exemption] || '',
      nondiscriminationOnApplication: fields[SF.Nondiscrimination_Policy_on_Application] || '',
      nondiscriminationOnWebsite: fields[SF.Nondiscrimination_Policy_on_Website] || '',
      onNationalWebsite: fields[SF.On_national_website] === true || String(fields[SF.On_national_website] || '').toLowerCase() === 'yes',
      ssjTool: fields[SF.SSJ___SSJ_Tool] || '',
      tcSchoolId: fields[SF.TC_school_ID] || '',
      createdBy: fields[SF.Created_By]?.name || fields[SF.Created_By] || undefined,
      charterId: (Array.isArray(fields[SF.charter_id]) ? String((fields[SF.charter_id] as any[])[0] || '') : String(fields[SF.charter_id] || '')) || undefined,

      ssjFacility: fields[SF.SSJ___Facility] || '',
      ssjB4GStatus: fields[SF.SSJ___Building4Good_Status] || '',
      ssjDateSharedWithN4G: fields[SF.SSJ___Date_shared_with_N4G__from_SSJ_Process_Details_] || '',
      building4GoodFirm: fields[SF.Building4Good_Firm___Attorney] || '',
      ssjFundingGap: fields[SF.SSJ___Gap_in_Funding] || '',
      ssjAmountRaised: fields[SF.SSJ___Amount_raised] || '',
      ssjLoanApprovedAmount: fields[SF.SSJ___Loan_approved_amt] || '',
      ssjLoanEligibility: fields[SF.SSJ___Loan_eligibility] || '',
      ssjViableFundingPath: fields[SF.SSJ___Does_the_school_have_a_viable_pathway_to_funding_] || '',
      ssjHasETLPartner: fields[SF.SSJ___Has_the_ETL_identified_a_partner_] || '',
      ssjOpsGuideTrack: fields[SF.SSJ___Ops_Guide_Support_Track] || [],
      ssjReadinessRating: fields[SF.SSJ___Readiness_to_Open_Rating] || '',
      ssjTotalStartupFundingReq: fields[SF.SSJ___Total_Startup_Funding_Needed] || '',
      ssjFundraisingNarrative: fields[SF.SSJ___Fundraising_narrative] || '',
      ssjPlanningForWFFunding: fields[SF.SSJ___Is_the_school_planning_to_apply_for_internal_Wildflower_funding_] || '',

      ssjBudgetReady: fields[SF.SSJ___Is_the_budget_at_a_stage_that_will_allow_the_ETL_s__to_take_their_next_steps_] || '',
      ssjEnrollmentOnTrack: fields[SF.SSJ___Is_the_team_on_track_for_their_enrollment_goals_] || '',
      ssjCohortStatus: fields[SF.SSJ___Cohort_Status] || '',
      ssjBoardDevelopment: fields[SF.SSJ___Board_development] || '',
      ssjNameReserved: fields[SF.SSJ___Name_Reserved] || '',
      ssjNextBigDecision: fields[SF.SSJ___What_is_the_next_big_decision_or_action_this_school_is_working_on_] || '',

      enteredVisioningDate: fields[SF.Entered_Visioning_Date] || '',
      enteredPlanningDate: fields[SF.Entered_Planning_Date] || '',
      enteredStartupDate: fields[SF.Entered_Startup_Date] || '',

      planningAlbum: fields[SF.Planning_album] || '',
      visioningAlbum: fields[SF.Visioning_album] || '',
      visioningAlbumComplete: fields[SF.Visioning_album_complete] || '',
//      activePodMember: '',
      cohorts: fields[SF.Cohorts] || [],

      // --- Systems ---
      googleVoice: fields[SF.Google_Voice] || '',
      budgetUtility: fields[SF.Budget_Utility] || '',
      admissionsSystem: fields[SF.Admissions_System] || '',
      qbo: fields[SF.QBO] || '',
      websiteTool: fields[SF.Website_tool] || '',
      logoDesigner: fields[SF.Logo_designer] || '',
      transparentClassroom: fields[SF.Transparent_Classroom] || '',
      tcAdmissions: fields[SF.TC_Admissions] || '',
      tcRecordkeeping: fields[SF.TC_Recordkeeping] || '',
      gusto: fields[SF.Gusto] || '',
      businessInsurance: fields[SF.Business_Insurance] || '',
      nameSelectionProposal: fields[SF.Name_Selection_Proposal] || '',
      trademarkFiled: fields[SF.Trademark_filed] || '',
      billComAccount: fields[SF.Bill_com_account] || '',
      googleWorkspacePath: fields[SF.Google_Workspace_Org_Unit_Path] || '',
      budgetLink: fields[SF.Budget_Link] || '',
      bookkeeper: fields[SF.Bookkeeper___Accountant] || '',
      createdTime: record.createdTime,
      
      // --- Legal Entity Fields ---
      legalStructure: fields[SF.Legal_structure] || undefined,
      currentFYEnd: fields[SF.Current_FY_end] || undefined,
      EIN: fields[SF.EIN] || undefined,
      legalName: fields[SF.Legal_Name] || undefined,
      incorporationDate: fields[SF.Incorporation_Date] || undefined,
      nonprofitStatus: fields[SF.Nonprofit_status] || undefined,
    };
  }

  // Reusable transformer for Locations
  private transformLocationRecord(record: any): Location {
    const f = record.fields;
    const schoolId = firstId(f[LF.school_id] ?? f[LF.School]);
    return {
      id: record.id,
      schoolId: schoolId || '',
      charterId: firstId(f[LF.charter_id]),
      address: String(f[LF.Address] || ''),
      city: String(f[LF.City] || ''),
      state: String(f[LF.State] || ''),
      postalCode: String(f[LF.Postal_code] || ''),
      country: String(f[LF.Country] || ''),
      neighborhood: String(f[LF.Neighborhood] || ''),
      sqFt: toNumber(f[LF.Square_feet]),
      maxOccupancy: toNumber(f[LF.Max_Students_Licensed_For]),
      latitude: toNumber(f[LF.Latitude]),
      longitude: toNumber(f[LF.Longitude]),
      currentPhysicalAddress: Boolean(f[LF.Current_physical_address_]),
      currentMailingAddress: Boolean(f[LF.Current_mailing_address_]),
      locationType: String(f[LF.Location_type] || ''),
      startDate: String(f[LF.Start_of_time_at_location] || ''),
      endDate: String(f[LF.End_of_time_at_location] || ''),
      coLocationType: String(f[LF.Co_Location_Type] || ''),
      coLocationPartner: String(f[LF.Co_Location_Partner_] || ''),
      censusTract: String(f[LF.Census_Tract] || ''),
      qualLICT: toYesBool(f[LF.Qualified_Low_Income_Census_Tract]),
      leaseEndDate: String(f[LF.Lease_End_Date] || ''),
      lease: String(f[LF.Lease] || ''),
      timeZone: String(f[LF.Time_Zone] || ''),
      created: createdAt(f),
      lastModified: updatedAt(f),
    };
  }

  // Reusable transformer for Educators x Schools associations
  private transformEXSRecord(
    record: any,
    opts?: { schoolMap?: Map<string, string>; educatorMap?: Map<string, string> }
  ): EducatorSchoolAssociation {
    const f = record.fields;
    const educatorId = firstId(f[EXSF.educator_id]) || '';
    const schoolId = firstId(f[EXSF.school_id]) || '';
    const role = f[EXSF.Roles] ? [String(f[EXSF.Roles])] : [];
    return {
      id: record.id,
      educatorId,
      schoolId,
      schoolShortName: opts?.schoolMap?.get(schoolId) || '',
      educatorName: opts?.educatorMap?.get(educatorId) || '',
      role,
      status: String(f[EXSF.Stage_Status] || ''),
      startDate: String(f[EXSF.Start_Date] || ''),
      endDate: String(f[EXSF.End_Date] || ''),
      emailAtSchool: String(f[EXSF.Email_at_School] || ''),
      isActive: f[EXSF.Currently_Active] === true || f[EXSF.Currently_Active] === 'true',
      created: String(f[EXSF.Created] || new Date().toISOString()),
      lastModified: String(f[EXSF.Created] || new Date().toISOString()),
    };
  }

  // Educator operations
  async getEducators(): Promise<Educator[]> {
    // Check cache first
    const cacheKey = 'educators:all';
    const cached = cache.get<Educator[]>(cacheKey);
    if (cached) {
      console.log('[Cache Hit] Educators');
      return cached;
    }

    try {
      const records = await base(AT.EDUCATORS).select().all();
      const educators = records.map(record => this.transformEducatorRecord(record));
      
      // Cache the results
      cache.set(cacheKey, educators);
      console.log('[Cache Miss] Educators - fetched from Airtable');
      
      return educators;
    } catch (error) {
      const errorInfo = handleError(error);
      console.error("Error fetching educators from Airtable:", errorInfo.message);
      throw error;
    }
  }

  async getEducator(id: string): Promise<Educator | undefined> {
    try {
      const record = await base(AT.EDUCATORS).find(id);
      return this.transformEducatorRecord(record);
    } catch (error) {
      console.error(`Error fetching educator ${id} from Airtable:`, error);
      return undefined;
    }
  }

  async getEducatorByEmail(email: string): Promise<Educator | undefined> {
    try {
      const records = await base(AT.EDUCATORS).select({
        filterByFormula: `{${EF.Current_Primary_Email_Address}} = "${email}"`
      }).all();
      
      if (records.length > 0) {
        return this.transformEducatorRecord(records[0]);
      }
      return undefined;
    } catch (error) {
      console.error(`Error fetching educator by email ${email} from Airtable:`, error);
      return undefined;
    }
  }

  async createEducator(educator: InsertEducator): Promise<Educator> {
    try {
      const record = await base(AT.EDUCATORS).create({
        [EF.First_Name]: educator.firstName,
        [EF.Last_Name]: educator.lastName
      });
      
      return this.transformEducatorRecord(record);
    } catch (error) {
      console.error("Error creating educator in Airtable:", error);
      throw error;
    }
  }

  async updateEducator(id: string, educator: Partial<InsertEducator>): Promise<Educator | undefined> {
    try {
      const updateFields: any = {};
      
      if (educator.firstName !== undefined) updateFields[EF.First_Name] = educator.firstName;
      if (educator.lastName !== undefined) updateFields[EF.Last_Name] = educator.lastName;
      if (educator.fullName !== undefined) updateFields[EF.Full_Name] = educator.fullName;
      if (educator.archived !== undefined) updateFields[EF.Archived] = educator.archived;
      if (educator.discoveryStatus !== undefined) updateFields[EF.Discovery_status] = educator.discoveryStatus as any;
      if (educator.kanban !== undefined) updateFields[EF.Kanban] = (educator.kanban === null ? null : educator.kanban) as any;

      const record = await base(AT.EDUCATORS).update(id, updateFields);
      return this.transformEducatorRecord(record);
    } catch (error) {
      console.error(`Error updating educator ${id} in Airtable:`, error);
      return undefined;
    }
  }

  async deleteEducator(id: string): Promise<boolean> {
    try {
      await base(AT.EDUCATORS).update(id, { [EF.Archived]: true } as any);
      try { cache.invalidate('educators:all'); } catch {}
      return true;
    } catch (error) {
      console.error(`Error soft-deleting educator ${id}:`, error);
      return false;
    }
  }

  // School operations
  async getSchools(): Promise<School[]> {
    // Check cache first
    const cacheKey = 'schools:all';
    const cached = cache.get<School[]>(cacheKey);
    if (cached) {
      console.log('[Cache Hit] Schools');
      return cached;
    }

    try {
      const records = await base(AT.SCHOOLS).select().all();
      
      const schools = records.map(record => {
        try {
          return this.transformSchoolRecord(record);
        } catch (error) {
          console.error(`Error transforming school ${record.id} (${record.fields[SF.Name]}):`, error);
          // Return a minimal school object to prevent dropping
          return {
            id: record.id,
            name: record.fields[SF.Name] || "Unknown",
            shortName: record.fields[SF.Short_Name] || undefined,
            locality: "",
            membershipStatus: "",
            status: "",
            stageStatus: "",
            currentTLs: [],
            currentGuides: [],
            publicFundingSources: [],
            riskFactors: [],
            watchlist: [],
            errors: [],
            cohorts: [],
            founders: [],
          } as School;
        }
      });
      
      // Cache the results
      cache.set(cacheKey, schools);
      console.log(`[Cache Miss] Schools - fetched ${schools.length} schools from Airtable`);
      
      return schools;
    } catch (error) {
      console.error("Error fetching schools from Airtable:", error);
      throw error;
    }
  }

  async getSchool(id: string): Promise<School | undefined> {
    try {
      const record = await base(AT.SCHOOLS).find(id);
      return this.transformSchoolRecord(record);
    } catch (error) {
      console.error(`Error fetching school ${id} from Airtable:`, error);
      return undefined;
    }
  }

  async createSchool(school: InsertSchool): Promise<School> {
    try {
      const createFields: any = {
        "Name": school.name,
      };
      
      // Add optional fields if they exist
      if (school.shortName) createFields["Short Name"] = school.shortName;
      if (school.agesServed && school.agesServed.length > 0) createFields["Ages Served"] = school.agesServed;
      if (school.governanceModel) createFields["Governance Model"] = school.governanceModel;
      if (school.about) createFields["About"] = school.about;
      if (school.phone) createFields["School Phone"] = school.phone;
      if (school.email) createFields["School Email"] = school.email;
      if (school.website) createFields["Website"] = school.website;
      if (school.membershipStatus) createFields["Membership Status"] = school.membershipStatus;
      // TODO: Add SSJ Target City/State fields with correct Airtable field names
      // if (school.ssjTargetCity) createFields["SSJ Target City"] = school.ssjTargetCity;
      // if (school.ssjTargetState) createFields["SSJ Target State"] = school.ssjTargetState;
      
      const record = await base(AT.SCHOOLS).create(createFields);
      
      // Invalidate cache immediately after creation
      cache.invalidate('schools:all');
      
      return this.transformSchoolRecord(record);
    } catch (error) {
      console.error("Error creating school in Airtable:", error);
      throw error;
    }
  }

  async updateSchool(id: string, school: Partial<InsertSchool>): Promise<School | undefined> {
    try {
      const updateFields: any = {};
      
      // Helper function to check if value should be included
      const hasValue = (value: any): boolean => {
        if (value === undefined || value === null) return false;
        if (value === '') return false;
        if (Array.isArray(value) && value.length === 0) return false;
        return true;
      };
      
      // Only map fields with actual values - exclude empty strings and empty arrays
      if (hasValue(school.name)) updateFields[SF.Name] = school.name;
      if (hasValue(school.shortName)) updateFields[SF.Short_Name] = school.shortName;
      if (hasValue(school.phone)) updateFields[SF.School_Phone] = school.phone;
      if (hasValue(school.email)) updateFields[SF.School_Email] = school.email;
      if (hasValue(school.website)) updateFields[SF.Website] = school.website;
      if (hasValue(school.instagram)) updateFields[SF.Instagram] = school.instagram;
      if (hasValue(school.facebook)) updateFields[SF.Facebook] = school.facebook;
      if (hasValue(school.membershipStatus)) updateFields[SF.Membership_Status] = school.membershipStatus;
      if (hasValue(school.agesServed)) updateFields[SF.Ages_served] = school.agesServed as any;
      if (hasValue(school.governanceModel)) updateFields[SF.Governance_Model] = school.governanceModel;
      if (school.archived !== undefined) updateFields["Archived"] = school.archived;
      if (hasValue(school.programFocus)) updateFields[SF.Program_Focus] = school.programFocus as any;
      if (hasValue(school.numberOfClassrooms)) updateFields[SF.Number_of_classrooms] = school.numberOfClassrooms as any;
      if (hasValue(school.legalStructure)) updateFields[SF.Legal_structure] = school.legalStructure;
      if (hasValue(school.EIN)) updateFields[SF.EIN] = school.EIN;
      if (hasValue(school.legalName)) updateFields[SF.Legal_Name] = school.legalName;
      if (hasValue(school.incorporationDate)) updateFields[SF.Incorporation_Date] = school.incorporationDate;
      if (hasValue(school.nonprofitStatus)) updateFields[SF.Nonprofit_status] = school.nonprofitStatus;
      if (hasValue(school.currentFYEnd)) updateFields[SF.Current_FY_end] = school.currentFYEnd;
      if (hasValue(school.groupExemptionStatus)) updateFields[SF.Group_exemption_status] = school.groupExemptionStatus;
      if (hasValue(school.dateReceivedGroupExemption)) updateFields[SF.Date_received_group_exemption] = school.dateReceivedGroupExemption;
      if (hasValue(school.dateWithdrawnGroupExemption)) updateFields[SF.Date_withdrawn_from_Group_Exemption] = school.dateWithdrawnGroupExemption;
      if (hasValue(school.businessInsurance)) updateFields[SF.Business_Insurance] = school.businessInsurance;
      if (hasValue(school.billComAccount)) updateFields[SF.Bill_com_account] = school.billComAccount;
      
      // Handle enrollment capacity with number conversion
      if (school.enrollmentCap !== undefined && school.enrollmentCap !== '') {
        const enrollmentNum = parseInt(school.enrollmentCap.toString());
        if (!isNaN(enrollmentNum)) {
          updateFields[SF.Enrollment_at_Full_Capacity] = enrollmentNum;
        }
      }

      console.log('Sending to Airtable:', Object.keys(updateFields));
      const record = await base(AT.SCHOOLS).update(id, updateFields);
      return this.transformSchoolRecord(record);
    } catch (error) {
      console.error(`Error updating school ${id} in Airtable:`, error);
      return undefined;
    }
  }

  async deleteSchool(id: string): Promise<boolean> {
    try {
      await base(AT.SCHOOLS).update(id, { Archived: true } as any);
      try { cache.invalidate('schools:all'); } catch {}
      return true;
    } catch (error) {
      console.error(`Error soft-deleting school ${id}:`, error);
      return false;
    }
  }

  // Metadata operations
  async getMetadata(): Promise<any[]> {
    // Return Airtable base schema (tables + fields) via Meta API
    try {
      const { getAirtableSchema } = await import('./airtable-schema');
      const data: any = await getAirtableSchema();
      const tables = Array.isArray(data?.tables) ? data.tables : [];
      return tables.map((t: any) => ({
        id: t.id,
        name: t.name,
        fields: Array.isArray(t.fields)
          ? t.fields.map((f: any) => ({
              id: f.id,
              name: f.name,
              type: f.type,
              options: f.options || undefined,
            }))
          : [],
      }));
    } catch (error) {
      console.warn('Warning: Unable to fetch Airtable metadata:', error);
      return [];
    }
  }

  async getSchoolFieldOptions(): Promise<any> {
    const cacheKey = 'school-field-options';
    const cached = cache.get<any>(cacheKey);
    if (cached) {
      console.log('[Cache Hit] School Field Options');
      return cached;
    }

    // Field options extracted from actual Airtable metadata (47 dropdown fields total)
    const fieldOptions = {
      // Status fields
      status: ["Emerging","Open","Paused","Closing","Permanently Closed","Disaffiliating", "Disaffiliated", "Placeholder"],
      ssjStage: ["Visioning", "Planning", "Startup", "Year 1", "Complete"],
      stageStatus: ["Visioning","Planning","Startup", "Year 1", "Open", "Permanently Closed", "Disaffiliated", "Paused"],
      membershipStatus: ["Member school", "Affiliated non-member", "Membership terminated"],
      
      // Governance and Legal  
      governanceModel: ["Independent", "District", "Charter", "Exploring Charter", "Community Partnership"],
      legalStructure: ["Independent organization", "Part of a charter", "Part of another organization", "Multiple WF schools in a single entity"],
      nonprofitStatus: ["group exemption", "independent", "for profit", "Partnership", "Under Charter 501c3"],
      groupExemptionStatus: ["Applying", "Active", "Issues", "Withdrawn", "Other - Not part of exemption"],
      
      // Program Details
      agesServed: ["Parent-child", "Infants", "Toddlers", "Primary", "Lower Elementary", "Upper Elementary", "Adolescent / JH", "High School"],
      programFocus: ["Inclusion", "Lab School", "Nature Based", "Dual Language", "Conversion into WF"],
      schoolCalendar: ["9-month", "10-month", "Year-round"],
      
      // Financial and Admin
      currentFYEnd: ["6/30", "7/31", "8/31", "12/31"],
      businessInsurance: ["Alliant", "other", "other (in process w/ Alliant)"],
      
      // Systems and Tools
      qbo: ["internal license - active", "internal license - closed out", "external license", "other accounting software", "Not WF - Unknown software"],
      gusto: ["yes (under WF)", "no", "yes (independent)", "yes", "no- local system"],
      tcRecordkeeping: ["yes (under WF)"],
      tcAdmissions: ["yes", "v1"],
      admissionsSystem: ["TC", "Other", "School Cues"],
      transparentClassroom: ["Internal license", "External license", "Other record keeping system", "Internal License - removed"],
      budgetUtility: ["WF v4"],
      
      // Network and Communication
      onNationalWebsite: ["yes", "no"],
      domainName: ["WF-managed", "School-managed", "None"],
      googleVoice: ["yes", "no"],
      
      // Support and Tracking
      activePodMember: ["yes", "no"],
      pod: ["Pod A", "Pod B", "Pod C", "Pod D"],
      agreementVersion: ["v1", "v2", "v3"],
      
      // Risk Management
      riskFactors: ["Financial", "Enrollment", "Leadership", "Governance", "Facility", "Other"],
      watchlist: ["High", "Medium", "Low"],
      leftNetworkReason: ["Closure", "Conversion", "Merger", "Other"],
      
      // Operational
      errors: ["No mailing address", "More than one active mailing address", "More than one active physical address", "No active TLs", "Multiple active guides", "Emerging with no active guide", "Duplicate"],
      ssjOpsGuideTrack: ["Track 1", "Track 2", "Track 3"],
      
      // Staff and Professional
      logoDesigner: ["WF Design Team", "External", "School-created"],
      bookkeeper: ["WF Bookkeeper", "External Bookkeeper", "School Managed"],

      archived: ["True", "False"]
    };

    cache.set(cacheKey, fieldOptions, 60 * 60 * 1000); // 1 hour cache
    console.log('[Cache Miss] School Field Options - generated from schema');
    return fieldOptions;
  }

  // Educator-School Association operations (simplified)
  async getEducatorSchoolAssociations(): Promise<EducatorSchoolAssociation[]> {
    try {
      // Query the "Educators x Schools" table
      const records = await base(AT.EDUCATORS_X_SCHOOLS).select().all();
      
      return records.map(record => this.transformEXSRecord(record));
    } catch (error) {
      console.error('Error fetching educator school associations:', error);
      return [];
    }
  }

  async getEducatorAssociations(educatorId: string): Promise<EducatorSchoolAssociation[]> {
    try {
      // Query the "Educators x Schools" table filtered by educator_id field
      const records = await base(AT.EDUCATORS_X_SCHOOLS).select({
        filterByFormula: `{${EXSF.educator_id}} = '${educatorId}'`
      }).all();
      
      // Get all schools to map school IDs to short names
      const schools = await this.getSchools();
      const schoolMap = new Map(schools.map(school => [school.id, school.shortName || school.name]));
      
      return records.map(record => this.transformEXSRecord(record, { schoolMap }));
    } catch (error) {
      console.error(`Error fetching educator associations for ${educatorId}:`, error);
      return [];
    }
  }

  async getSchoolAssociations(schoolId: string): Promise<EducatorSchoolAssociation[]> {
    try {
      // Query the "Educators x Schools" table filtered by school_id (lookup-safe)
      const records = await base(AT.EDUCATORS_X_SCHOOLS).select({
        filterByFormula: `FIND('${schoolId}', ARRAYJOIN({${EXSF.school_id}}))`
      }).all();
      
      // Get all schools to map school IDs to short names
      const schools = await this.getSchools();
      const schoolMap = new Map(schools.map(school => [school.id, school.shortName || school.name]));
      
      // Get all educators to map educator IDs to full names
      const educators = await this.getEducators();
      const educatorMap = new Map(educators.map(educator => [educator.id, educator.fullName || `${educator.firstName} ${educator.lastName}`]));
      
      return records.map(record => this.transformEXSRecord(record, { schoolMap, educatorMap }));
    } catch (error) {
      console.error(`Error fetching school associations for ${schoolId}:`, error);
      return [];
    }
  }

  async createEducatorSchoolAssociation(association: InsertEducatorSchoolAssociation): Promise<EducatorSchoolAssociation> {
    try {
      console.log("Creating association in Airtable:", association);
      
      // Try different field names for the link fields
      // Common patterns: "Educator", "School", "Educators", "Schools"
      const record = await base(AT.EDUCATORS_X_SCHOOLS).create([{
        fields: {
          [EXSF.Educator]: [association.educatorId],
          [EXSF.School]: [association.schoolId],
          [EXSF.Roles]: association.role && association.role.length > 0 ? association.role[0] : undefined,
          [EXSF.Start_Date]: association.startDate || undefined,
          [EXSF.End_Date]: association.endDate || undefined,
          [EXSF.Currently_Active]: association.isActive !== undefined ? association.isActive : true,
          [EXSF.Email_at_School]: association.emailAtSchool || undefined,
        }
      }]);
      
      console.log("Association created successfully:", record[0].id);
      
      // Return the created association
      return {
        id: record[0].id,
        educatorId: association.educatorId,
        schoolId: association.schoolId,
        role: association.role || [],
        startDate: association.startDate || '',
        endDate: association.endDate || '',
        isActive: association.isActive !== undefined ? association.isActive : true,
        emailAtSchool: association.emailAtSchool || '',
        created: new Date().toISOString(),
        lastModified: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error creating educator school association:", error);
      
      // If that fails, try other common field names
      if (error.message && error.message.includes('cannot accept a value')) {
        try {
          console.log("Trying alternative field names...");
          const record = await base(AT.EDUCATORS_X_SCHOOLS).create([{
            fields: {
              "Educators": [association.educatorId], // Try "Educators" as link field
              "Schools": [association.schoolId],     // Try "Schools" as link field
              "Roles": association.role && association.role.length > 0 ? association.role[0] : undefined,
              "Start Date": association.startDate || undefined,
              "End Date": association.endDate || undefined,
              "Currently Active": association.isActive !== undefined ? association.isActive : true,
              "Email at School": association.emailAtSchool || undefined,
            }
          }]);
          
          console.log("Association created successfully with alternative field names:", record[0].id);
          
          return {
            id: record[0].id,
            educatorId: association.educatorId,
            schoolId: association.schoolId,
            role: association.role || [],
            startDate: association.startDate || '',
            endDate: association.endDate || '',
            isActive: association.isActive !== undefined ? association.isActive : true,
            emailAtSchool: association.emailAtSchool || '',
            created: new Date().toISOString(),
            lastModified: new Date().toISOString(),
          };
        } catch (error2) {
          console.error("Both attempts failed:", error2);
          throw error2;
        }
      }
      
      throw error;
    }
  }

  async updateEducatorSchoolAssociation(id: string, association: Partial<InsertEducatorSchoolAssociation>): Promise<EducatorSchoolAssociation | undefined> {
    try {
      console.log("Updating association in Airtable:", id, association);
      
      const updateFields: any = {};
      
      if (association.role !== undefined) updateFields[EXSF.Roles] = association.role && association.role.length > 0 ? association.role[0] : undefined;
      if (association.startDate !== undefined) updateFields[EXSF.Start_Date] = association.startDate;
      if (association.endDate !== undefined) updateFields[EXSF.End_Date] = association.endDate;
      if (association.isActive !== undefined) updateFields[EXSF.Currently_Active] = association.isActive;
      if (association.emailAtSchool !== undefined) updateFields[EXSF.Email_at_School] = association.emailAtSchool;
      
      const record = await base(AT.EDUCATORS_X_SCHOOLS).update(id, updateFields);
      console.log("Association updated successfully:", record.id);
      
      // Return the updated association
      return {
        id: record.id,
        educatorId: Array.isArray(record.fields[EXSF.educator_id]) ? String((record.fields[EXSF.educator_id] as any[])[0]) : String(record.fields[EXSF.educator_id] || ''),
        schoolId: Array.isArray(record.fields[EXSF.school_id]) ? String((record.fields[EXSF.school_id] as any[])[0]) : String(record.fields[EXSF.school_id] || ''),
        role: record.fields[EXSF.Roles] ? [String(record.fields[EXSF.Roles])] : [],
        startDate: String(record.fields[EXSF.Start_Date] || ''),
        endDate: String(record.fields[EXSF.End_Date] || ''),
        isActive: record.fields[EXSF.Currently_Active] === true || record.fields[EXSF.Currently_Active] === "true",
        emailAtSchool: String(record.fields[EXSF.Email_at_School] || ''),
        created: String(record.fields[EXSF.Created] || new Date().toISOString()),
        lastModified: String(record.fields[EXSF.Created] || new Date().toISOString()),
      };
    } catch (error) {
      console.error("Error updating educator school association:", error);
      throw error;
    }
  }

  async deleteEducatorSchoolAssociation(id: string): Promise<boolean> {
    try {
      await base(AT.EDUCATORS_X_SCHOOLS).destroy(id);
      return true;
    } catch (error) {
      console.error(`Error deleting educator-school association ${id}:`, error);
      return false;
    }
  }

  // Legacy methods for backward compatibility
  async getTeachers(): Promise<Teacher[]> {
    return this.getEducators();
  }

  async getTeacher(id: string): Promise<Teacher | undefined> {
    return this.getEducator(id);
  }

  async getTeacherByEmail(email: string): Promise<Teacher | undefined> {
    return this.getEducatorByEmail(email);
  }

  async createTeacher(teacher: InsertTeacher): Promise<Teacher> {
    return this.createEducator(teacher);
  }

  async updateTeacher(id: string, teacher: Partial<InsertTeacher>): Promise<Teacher | undefined> {
    return this.updateEducator(id, teacher);
  }

  async deleteTeacher(id: string): Promise<boolean> {
    return this.deleteEducator(id);
  }

  async getTeacherSchoolAssociations(): Promise<TeacherSchoolAssociation[]> {
    return this.getEducatorSchoolAssociations();
  }

  async getTeacherAssociations(teacherId: string): Promise<TeacherSchoolAssociation[]> {
    return this.getEducatorAssociations(teacherId);
  }

  async createTeacherSchoolAssociation(association: InsertTeacherSchoolAssociation): Promise<TeacherSchoolAssociation> {
    return this.createEducatorSchoolAssociation(association);
  }

  async updateTeacherSchoolAssociation(id: string, association: Partial<InsertTeacherSchoolAssociation>): Promise<TeacherSchoolAssociation | undefined> {
    return this.updateEducatorSchoolAssociation(id, association);
  }

  async deleteTeacherSchoolAssociation(id: string): Promise<boolean> {
    return this.deleteEducatorSchoolAssociation(id);
  }

  // Location operations (mock implementation for now)
  async getLocations(): Promise<Location[]> {
    try {
      console.log("Fetching all locations from Airtable...");
      const records = await base(AT.LOCATIONS).select().all();
      console.log(`Found ${records.length} location records`);
      
      if (records.length > 0) {
        console.log("Sample location record fields:", Object.keys(records[0].fields));
        console.log("Sample location record:", records[0].fields);
      }
      
      return records.map(record => {
        const schoolId = record.fields[LF.school_id] || record.fields[LF.School];
        return {
          id: record.id,
          schoolId: Array.isArray(schoolId) ? String((schoolId as any[])[0] || '') : String(schoolId || ''),
          address: String(record.fields[LF.Address] || ''),
          city: String(record.fields[LF.City] || ''),
          state: String(record.fields[LF.State] || ''),
          postalCode: String(record.fields[LF.Postal_code] || ''),
          country: String(record.fields[LF.Country] || ''),
          neighborhood: String(record.fields[LF.Neighborhood] || ''),
          sqFt: record.fields[LF.Square_feet] ? Number(record.fields[LF.Square_feet]) : undefined,
          maxOccupancy: record.fields[LF.Max_Students_Licensed_For] ? Number(record.fields[LF.Max_Students_Licensed_For]) : undefined,
          latitude: record.fields[LF.Latitude] ? Number(record.fields[LF.Latitude]) : undefined,
          longitude: record.fields[LF.Longitude] ? Number(record.fields[LF.Longitude]) : undefined,
          currentPhysicalAddress: Boolean(record.fields[LF.Current_physical_address_]),
          currentMailingAddress: Boolean(record.fields[LF.Current_mailing_address_]),
          locationType: String(record.fields[LF.Location_type] || ''),
          startDate: String(record.fields[LF.Start_of_time_at_location] || ''),
          endDate: String(record.fields[LF.End_of_time_at_location] || ''),
          coLocationType: String(record.fields[LF.Co_Location_Type] || ''),
          coLocationPartner: String(record.fields[LF.Co_Location_Partner_] || ''),
          censusTract: String(record.fields[LF.Census_Tract] || ''),
          qualLICT: String(record.fields[LF.Qualified_Low_Income_Census_Tract] || '').toUpperCase() === 'YES',
          leaseEndDate: String(record.fields[LF.Lease_End_Date] || ''),
          lease: String(record.fields[LF.Lease] || ''),
          timeZone: String(record.fields[LF.Time_Zone] || ''),
          charterId: Array.isArray(record.fields[LF.charter_id]) ? String((record.fields[LF.charter_id] as any[])[0] || '') : String(record.fields[LF.charter_id] || ''),
          created: String(record.fields[LF.Created] || new Date().toISOString()),
          lastModified: String(record.fields[LF.Last_Modified] || new Date().toISOString()),
        };
      });
    } catch (error) {
      console.error("Error fetching locations:", error);
      return [];
    }
  }

  async getLocation(id: string): Promise<Location | undefined> {
    const locations = await this.getLocations();
    return locations.find(location => location.id === id);
  }

  async getLocationsBySchoolId(schoolId: string): Promise<Location[]> {
    try {
      // Fetch school for additional matching keys (Short Name, Name) and fallback address
      let schoolName: string | undefined;
      let schoolShortName: string | undefined;
      let schoolActiveAddress: string | undefined;
      let schoolCreated: string | undefined;
      let schoolLastModified: string | undefined;
      try {
        const srec = await base(AT.SCHOOLS).find(schoolId);
        schoolName = String(srec.fields[SF.Name] || '');
        schoolShortName = String(srec.fields[SF.Short_Name] || '');
        schoolActiveAddress = String(srec.fields[SF.Current_Physical_Address] || srec.fields[SF.Current_Mailing_Address] || srec.fields[SF.Current_Physical_Address] || '');
        schoolCreated = String(srec.fields[SF.Created] || '');
        schoolLastModified = String(srec.fields[SF.Last_Modified] || '');
      } catch {}

      // Fetch and filter in code to reliably match linked record IDs or lookups
      const records = await base(AT.LOCATIONS).select().all();
      const filtered = records.filter((record: any) => {
        const link = record.fields[LF.School];
        const sid = record.fields[LF.school_id];
        const locShort = record.fields[LF.Short_Name];
        const locName = record.fields[SF.Name];
        const linkMatches = Array.isArray(link) ? link.includes(schoolId) : (String(link) === String(schoolId));
        const idMatches = (sid && String(sid) === String(schoolId));
        const shortMatches = schoolShortName && String(locShort || '') === schoolShortName;
        const nameMatches = schoolName && String(locName || '') === schoolName;
        return Boolean(linkMatches || idMatches || shortMatches || nameMatches);
      });

      const mapped = filtered.map(record => {
        const schoolField = record.fields[LF.School];
        const address = record.fields[LF.Address];
        const currentPhysical = record.fields[LF.Current_physical_address_];
        const currentMailing = record.fields[LF.Current_mailing_address_];
        const startDate = record.fields[LF.Start_of_time_at_location];
        const endDate = record.fields[LF.End_of_time_at_location];
        const created = record.fields[LF.Created];
        const lastModified = record.fields[LF.Last_Modified];
        
        return {
          id: record.id,
          schoolId: Array.isArray(schoolField) ? String(schoolField[0] || '') : String(schoolField || ''),
          address: String(address || ''),
          city: String(record.fields[LF.City] || ''),
          state: String(record.fields[LF.State] || ''),
          postalCode: String(record.fields[LF.Postal_code] || ''),
          country: String(record.fields[LF.Country] || ''),
          neighborhood: String(record.fields[LF.Neighborhood] || ''),
          sqFt: record.fields[LF.Square_feet] ? Number(record.fields[LF.Square_feet]) : undefined,
          maxOccupancy: record.fields[LF.Max_Students_Licensed_For] ? Number(record.fields[LF.Max_Students_Licensed_For]) : undefined,
          latitude: record.fields[LF.Latitude] ? Number(record.fields[LF.Latitude]) : undefined,
          longitude: record.fields[LF.Longitude] ? Number(record.fields[LF.Longitude]) : undefined,
          currentPhysicalAddress: Boolean(currentPhysical),
          currentMailingAddress: Boolean(currentMailing),
          locationType: String(record.fields[LF.Location_type] || ''),
          startDate: String(startDate || ''),
          endDate: String(endDate || ''),
          coLocationType: String(record.fields[LF.Co_Location_Type] || ''),
          coLocationPartner: String(record.fields[LF.Co_Location_Partner_] || ''),
          censusTract: String(record.fields[LF.Census_Tract] || ''),
          qualLICT: String(record.fields[LF.Qualified_Low_Income_Census_Tract] || '').toUpperCase() === 'YES',
          leaseEndDate: String(record.fields[LF.Lease_End_Date] || ''),
          lease: String(record.fields[LF.Lease] || ''),
          timeZone: String(record.fields[LF.Time_Zone] || ''),
          charterId: Array.isArray(record.fields[LF.charter_id]) ? String((record.fields[LF.charter_id] as any[])[0] || '') : String(record.fields[LF.charter_id] || ''),
          created: String(created || new Date().toISOString()),
          lastModified: String(lastModified || new Date().toISOString()),
        };
      });

      // Fallback: if no rows found, synthesize a single location from School summary fields
      if (mapped.length === 0 && schoolActiveAddress) {
        return [{
          id: `school-${schoolId}-active-location`,
          schoolId,
          address: schoolActiveAddress,
          currentPhysicalAddress: true,
          currentMailingAddress: false,
          startDate: '',
          endDate: '',
          created: schoolCreated || new Date().toISOString(),
          lastModified: schoolLastModified || new Date().toISOString(),
        }];
      }
      return mapped;
    } catch (error) {
      console.error(`Error fetching locations for ${schoolId}:`, error);
      return [];
    }
  }

  async createLocation(location: InsertLocation): Promise<Location> {
    try {
      console.log("Creating location in Airtable:", location);
      
      const record = await base(AT.LOCATIONS).create({
        [LF.School]: [location.schoolId],
        [LF.Address]: location.address,
        [LF.Start_of_time_at_location]: location.startDate || undefined,
        [LF.End_of_time_at_location]: location.endDate || undefined,
      });
      
      console.log("Location created successfully with school link:", record.id);
      
      return {
        id: record.id,
        schoolId: location.schoolId,
        address: location.address,
        currentPhysicalAddress: location.currentPhysicalAddress,
        currentMailingAddress: location.currentMailingAddress,
        startDate: location.startDate || '',
        endDate: location.endDate || '',
        created: new Date().toISOString(),
        lastModified: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error creating location:", error);
      throw error;
    }
  }

  async updateLocation(id: string, location: Partial<InsertLocation>): Promise<Location | undefined> {
    try {
      console.log("Updating location in Airtable:", id, location);
      
      const updateFields: any = {};
      
      if (location.address !== undefined) updateFields[LF.Address] = location.address;
      if (location.currentPhysicalAddress !== undefined) updateFields[LF.Current_physical_address_] = location.currentPhysicalAddress;
      if (location.currentMailingAddress !== undefined) updateFields[LF.Current_mailing_address_] = location.currentMailingAddress;
      if (location.startDate !== undefined) updateFields[LF.Start_of_time_at_location] = location.startDate || undefined;
      if (location.endDate !== undefined) updateFields[LF.End_of_time_at_location] = location.endDate || undefined;
      
      const record = await base(AT.LOCATIONS).update(id, updateFields);
      console.log("Location updated successfully:", record.id);
      
      return {
        id: record.id,
        schoolId: Array.isArray(record.fields[LF.School]) ? String((record.fields[LF.School] as any[])[0] || '') : String(record.fields[LF.School] || ''),
        address: String(record.fields[LF.Address] || ''),
        currentPhysicalAddress: Boolean(record.fields[LF.Current_physical_address_]),
        currentMailingAddress: Boolean(record.fields[LF.Current_mailing_address_]),
        startDate: String(record.fields[LF.Start_of_time_at_location] || ''),
        endDate: String(record.fields[LF.End_of_time_at_location] || ''),
        created: String(record.fields[LF.Created] || new Date().toISOString()),
        lastModified: String(record.fields[LF.Last_Modified] || new Date().toISOString()),
      };
    } catch (error) {
      console.error("Error updating location:", error);
      throw error;
    }
  }

  async deleteLocation(id: string): Promise<boolean> {
    try {
      console.log("Deleting location from Airtable:", id);
      
      await base(AT.LOCATIONS).destroy(id);
      console.log("Location deleted successfully:", id);
      
      return true;
    } catch (error) {
      console.error("Error deleting location:", error);
      throw error;
    }
  }

  // Guide assignment operations
  async getGuideAssignments(): Promise<GuideAssignment[]> {
    try {
      const records = await base(AT.GUIDES_ASSIGNMENTS).select().all();
      return records.map(record => {
        const schoolId = record.fields[GASF.school_id] || record.fields[GASF.School];
        const guideId = record.fields[GASF.Partner] || record.fields[GASF.Guide_short_name];
        return {
          id: record.id,
          schoolId: Array.isArray(schoolId) ? String(schoolId[0] || '') : String(schoolId || ''),
          guideId: String(guideId || ''),
          guideShortName: String(record.fields[GASF.Guide_short_name] || ''),
          type: String(record.fields[GASF.Type] || ''),
          startDate: String(record.fields[GASF.Start_date] || ''),
          endDate: String(record.fields[GASF.End_date] || ''),
          isActive: Boolean(record.fields[GASF.Currently_active]),
          created: String(record.fields["Created"] || new Date().toISOString()),
          lastModified: String(record.fields["Last Modified"] || new Date().toISOString()),
        };
      });
    } catch (error) {
      console.error('Error fetching guide assignments:', error);
      return [];
    }
  }

  async getGuideAssignment(id: string): Promise<GuideAssignment | undefined> {
    try {
      const record = await base(AT.GUIDES_ASSIGNMENTS).find(id);
      const schoolId = record.fields[GASF.school_id] || record.fields[GASF.School];
      const guideId = record.fields[GASF.Partner] || record.fields[GASF.Guide_short_name];
      return {
        id: record.id,
        schoolId: Array.isArray(schoolId) ? String(schoolId[0] || '') : String(schoolId || ''),
        guideId: String(guideId || ''),
        guideShortName: String(record.fields[GASF.Guide_short_name] || ''),
        type: String(record.fields[GASF.Type] || ''),
        startDate: String(record.fields[GASF.Start_date] || ''),
        endDate: String(record.fields[GASF.End_date] || ''),
        isActive: Boolean(record.fields[GASF.Currently_active]),
        created: String(record.fields["Created"] || new Date().toISOString()),
        lastModified: String(record.fields["Last Modified"] || new Date().toISOString()),
      };
    } catch (error) {
      console.error('Error fetching guide assignment:', error);
      return undefined;
    }
  }

  async getGuideAssignmentsBySchoolId(schoolId: string): Promise<GuideAssignment[]> {
    try {
      // Try to query the "Guides Assignments" table filtered by schoolId
      const records = await base(AT.GUIDES_ASSIGNMENTS).select({
        filterByFormula: `{${GASF.school_id}} = '${schoolId}'`
      }).all();
      
      return records.map(record => {
        const schoolId = record.fields[GASF.school_id];
        const guideId = record.fields[GASF.Partner] || record.fields[GASF.Guide_short_name];
        const guideShortName = record.fields[GASF.Guide_short_name];
        const type = record.fields[GASF.Type];
        const startDate = record.fields[GASF.Start_date];
        const endDate = record.fields[GASF.End_date];
        const isActive = record.fields[GASF.Currently_active];
        const created = record.fields["Created"];
        const lastModified = record.fields["Last Modified"];
        
        return {
          id: record.id,
          schoolId: Array.isArray(schoolId) ? String(schoolId[0] || '') : String(schoolId || ''),
          guideId: String(guideId || ''),
          guideShortName: String(guideShortName || ''),
          type: String(type || ''),
          startDate: String(startDate || ''),
          endDate: String(endDate || ''),
          isActive: Boolean(isActive),
          created: String(created || new Date().toISOString()),
          lastModified: String(lastModified || new Date().toISOString()),
        };
      });
    } catch (error: any) {
      if (error.error === 'NOT_AUTHORIZED' || error.statusCode === 403) {
        console.warn(`Access denied to "Guides Assignments" table. This table may not exist in your Airtable base or the API key may not have permission to access it.`);
      } else {
        console.error(`Error fetching guide assignments for ${schoolId}:`, error);
      }
      return [];
    }
  }

  async createGuideAssignment(assignment: InsertGuideAssignment): Promise<GuideAssignment> {
    const recs = await base(AT.GUIDES_ASSIGNMENTS).create([{
      fields: {
        [GASF.School]: [assignment.schoolId],
        [GASF.Partner]: assignment.guideId,
        [GASF.Guide_short_name]: assignment.guideShortName,
        [GASF.Type]: assignment.type,
        [GASF.Start_date]: assignment.startDate || undefined,
        [GASF.End_date]: assignment.endDate || undefined,
        [GASF.Currently_active]: assignment.isActive ?? true,
      }
    }]);
    const record = recs[0];
    return (await this.getGuideAssignment(record.id))!;
  }

  async updateGuideAssignment(id: string, assignment: Partial<InsertGuideAssignment>): Promise<GuideAssignment | undefined> {
    const fields: any = {};
    if (assignment.schoolId !== undefined) fields[GASF.School] = [assignment.schoolId];
    if (assignment.guideId !== undefined) fields[GASF.Partner] = assignment.guideId;
    if (assignment.guideShortName !== undefined) fields[GASF.Guide_short_name] = assignment.guideShortName;
    if (assignment.type !== undefined) fields[GASF.Type] = assignment.type;
    if (assignment.startDate !== undefined) fields[GASF.Start_date] = assignment.startDate || undefined;
    if (assignment.endDate !== undefined) fields[GASF.End_date] = assignment.endDate || undefined;
    if (assignment.isActive !== undefined) fields[GASF.Currently_active] = assignment.isActive;
    const record = await base(AT.GUIDES_ASSIGNMENTS).update(id, fields);
    return (await this.getGuideAssignment(record.id))!;
  }

  async deleteGuideAssignment(id: string): Promise<boolean> {
    await base(AT.GUIDES_ASSIGNMENTS).destroy(id);
    return true;
  }

  // Governance document operations
  async getGovernanceDocuments(): Promise<GovernanceDocument[]> {
    try {
      const records = await base(AT.GOVERNANCE_DOCS).select().all();
      return records.map(transformGovernanceDocument);
    } catch (error) {
      console.error('Error fetching governance documents:', error);
      return [];
    }
  }

  async getGovernanceDocument(id: string): Promise<GovernanceDocument | undefined> {
    try {
      const record = await base(AT.GOVERNANCE_DOCS).find(id);
      return transformGovernanceDocument(record);
    } catch (error) {
      console.error('Error fetching governance document:', error);
      return undefined;
    }
  }

  async getGovernanceDocumentsBySchoolId(schoolId: string): Promise<GovernanceDocument[]> {
    try {
      const formula = `FIND('${schoolId}', ARRAYJOIN({${GDF.school_id}}))`;
      const records = await base(AT.GOVERNANCE_DOCS).select({ filterByFormula: formula }).all();
      return records.map(transformGovernanceDocument);
    } catch (error) {
      const errorInfo = handleError(error);
      if (errorInfo.statusCode === 403) {
        console.warn(`Access denied to "Governance docs" table. This table may not exist in your Airtable base or the API key may not have permission to access it.`);
      } else {
        console.error(`Error fetching governance documents for ${schoolId}:`, errorInfo.message);
      }
      return [];
    }
  }

  async createGovernanceDocument(document: InsertGovernanceDocument): Promise<GovernanceDocument> {
    const recs = await base(AT.GOVERNANCE_DOCS).create([{
      fields: {
        [GDF.School]: [document.schoolId],
        [GDF.Document_type]: document.docType,
        [GDF.Date]: document.dateEntered || undefined,
        [GDF.Doc_Link]: document.doc || undefined,
      }
    }]);
    const record = recs[0];
    return transformGovernanceDocument(record);
  }

  async updateGovernanceDocument(id: string, document: Partial<InsertGovernanceDocument>): Promise<GovernanceDocument | undefined> {
    const fields: any = {};
    if (document.schoolId !== undefined) fields[GDF.School] = [document.schoolId];
    if (document.docType !== undefined) fields[GDF.Document_type] = document.docType;
    if (document.dateEntered !== undefined) fields[GDF.Date] = document.dateEntered || undefined;
    if (document.doc !== undefined) fields[GDF.Doc_Link] = document.doc || undefined;
    const record = await base(AT.GOVERNANCE_DOCS).update(id, fields);
    return transformGovernanceDocument(record);
  }

  async deleteGovernanceDocument(id: string): Promise<boolean> {
    await base(AT.GOVERNANCE_DOCS).destroy(id);
    return true;
  }

  // School note operations
  async getSchoolNotes(): Promise<SchoolNote[]> {
    try {
      const table = base('School Notes');
      const records = await table.select().all();
      return records.map(record => this.transformSchoolNoteRecord(record));
    } catch (error) {
      console.error('Error fetching school notes:', error);
      return [];
    }
  }

  async getSchoolNote(id: string): Promise<SchoolNote | undefined> {
    const notes = await this.getSchoolNotes();
    return notes.find(note => note.id === id);
  }

  async getSchoolNotesBySchoolId(schoolId: string): Promise<SchoolNote[]> {
    try {
      const table = base('School Notes');
      const records = await table.select({
        filterByFormula: `{${SNF.school_id}} = "${schoolId}"`
      }).all();
      return records.map(record => this.transformSchoolNoteRecord(record));
    } catch (error) {
      console.error('Error fetching school notes by school ID:', error);
      return [];
    }
  }

  async getActionStepsBySchoolId(schoolId: string): Promise<ActionStep[]> {
    console.log(`=== ACTION STEPS DEBUG for school ${schoolId} ===`);
    
    try {
      // First, let's check all records to see what fields are available
      const allRecords = await base("Action steps").select({
        maxRecords: 10
      }).all();
      
      console.log(`Total action steps records checked: ${allRecords.length}`);
      if (allRecords.length > 0) {
        console.log('Action step fields available:', Object.keys(allRecords[0].fields));
        
        // Debug all records to see which schools they belong to
        allRecords.forEach((record, index) => {
          const schools = record.fields[ASF.Schools];
          const schoolShortName = record.fields[ASF.School_Short_Name];
          const item = record.fields[ASF.Item];
          console.log(`Record ${index + 1}: Schools=${JSON.stringify(schools)}, Short Name=${JSON.stringify(schoolShortName)}, Item="${String(item).substring(0, 50)}..."`);
        });
      } else {
        console.log('NO ACTION STEPS FOUND IN TABLE AT ALL');
        return [];
      }
      
      // Try multiple filtering approaches with better debugging
      let records = [];
      
      try {
        // 1. Direct Schools field match
        console.log(`Trying direct Schools field filter for ${schoolId}`);
        records = await base("Action steps").select({
          filterByFormula: `{${ASF.Schools}} = '${schoolId}'`
        }).all();
        console.log(`Found ${records.length} records using direct Schools field`);
        
        // 2. FIND function on Schools field (for linked records)
        if (records.length === 0) {
          console.log(`Trying FIND function for ${schoolId}`);
          records = await base("Action steps").select({
            filterByFormula: `FIND('${schoolId}', ARRAYJOIN({${ASF.Schools}})) > 0`
          }).all();
          console.log(`Found ${records.length} records using FIND with Schools field`);
        }
        
        // 3. Check school_id field as fallback
        if (records.length === 0) {
          console.log(`Trying school_id field filter for ${schoolId}`);
          records = await base("Action steps").select({
            filterByFormula: `FIND('${schoolId}', ARRAYJOIN({${ASF.school_id}})) > 0`
          }).all();
          console.log(`Found ${records.length} records using school_id field`);
        }
        
        // 4. Get all records and manually check their school associations
        if (records.length === 0) {
          console.log(`Getting all action steps to manually check school associations`);
          const allActionSteps = await base("Action steps").select().all();
          console.log(`Total action steps in database: ${allActionSteps.length}`);
          
          records = allActionSteps.filter(record => {
            const schools = record.fields[ASF.Schools];
            const schoolIds = record.fields[ASF.school_id];
            
            // Check if this record is associated with our school
            if (Array.isArray(schools) && schools.includes(schoolId)) {
              return true;
            }
            if (Array.isArray(schoolIds) && schoolIds.includes(schoolId)) {
              return true;
            }
            return false;
          });
          
          console.log(`Found ${records.length} records after manual filtering`);
        }
        
      } catch (fieldError) {
        console.log('Action steps filtering failed:', fieldError);
      }
      
      console.log(`Final result: ${records.length} action steps found for school ${schoolId}`);
      
      return records.map(transformActionStepRecord);
    } catch (error) {
      console.error(`ERROR in action steps for ${schoolId}:`, error);
      return [];
    }
  }

  // User-specific action steps for dashboard
  async getActionStepsByUserId(userId: string): Promise<ActionStep[]> {
    try {
      // Get all action steps and filter by assignee
      const allActionSteps = await base("Action steps").select().all();
      
      // Filter records where the user is the assignee
      const userActionSteps = allActionSteps.filter(record => {
        const assigneeField = record.fields[ASF.Assignee];
        const assigneeShortName = record.fields[ASF.Assignee_Short_Name];
        
        // Check if user ID matches in either assignee field
        if (Array.isArray(assigneeField) && assigneeField.includes(userId)) {
          return true;
        }
        if (assigneeShortName === userId) {
          return true;
        }
        return false;
      });
      
      return userActionSteps.map(transformActionStepRecord);
    } catch (error) {
      console.error(`ERROR in action steps for user ${userId}:`, error);
      return [];
    }
  }

  async createActionStep(schoolId: string, data: { item: string; assignee?: string; dueDate?: string; status?: string }): Promise<ActionStep> {
    const fields: any = {
      [ASF.Item]: data.item,
      [ASF.Status]: data.status || 'Pending',
      [ASF.Due_date]: data.dueDate || undefined,
      [ASF.Schools]: [schoolId],
      [ASF.school_id]: [schoolId],
    };
    if (data.assignee) fields[ASF.Assignee_Short_Name] = data.assignee;
    const record = await base('Action steps').create(fields);
    return {
      id: record.id,
      schoolId,
      assignedDate: String(record.fields[ASF.Assigned_date] || ''),
      assignee: String(record.fields[ASF.Assignee_Short_Name] || data.assignee || ''),
      item: String(record.fields[ASF.Item] || data.item || ''),
      status: String(record.fields[ASF.Status] || data.status || 'Pending'),
      dueDate: String(record.fields[ASF.Due_date] || data.dueDate || ''),
      isCompleted: (record.fields[ASF.Status] as any) === 'Completed',
    };
  }

  // User-specific schools for dashboard
  async getSchoolsByUserId(userId: string): Promise<School[]> {
    try {
      // Get all guide assignments (past or current) where user is a guide
      const guideAssignments = await base("Guides Assignments").select({
        filterByFormula: `{${GASF.Partner}} = '${userId}'`
      }).all();
      
      // Extract school IDs from guide assignments
      const schoolIds = new Set<string>();
      guideAssignments.forEach(record => {
        const schoolField = record.fields[GASF.School] as any;
        if (Array.isArray(schoolField) && schoolField[0]) {
          schoolIds.add(String(schoolField[0]));
        } else if (schoolField) {
          schoolIds.add(String(schoolField));
        }
      });
      
      // Also get schools where user is the assigned partner
      const allSchools = await this.getSchools();
      allSchools.forEach(school => {
        const ap = school.assignedPartner;
        if (Array.isArray(ap) && ap.includes(userId)) {
          schoolIds.add(school.id);
        }
      });
      
      // Return schools that match the collected IDs
      return allSchools.filter(school => schoolIds.has(school.id));
    } catch (error) {
      console.error(`ERROR fetching schools for user ${userId}:`, error);
      return [];
    }
  }

  // ETLs/TLs for user: educators meeting TL role criteria at user's schools (past/current guide assignments)
  // OR where user is assigned partner or person responsible for follow up
  async getTlsByUserId(userId: string): Promise<Educator[]> {
    try {
      // 1) Collect schools where user has past or current guide assignments
      const guideAssignments = await base("Guides Assignments").select({
        filterByFormula: `{${GASF.Partner}} = '${userId}'`
      }).all();
      const schoolIds = new Set<string>();
      guideAssignments.forEach(rec => {
        const s = rec.fields[GASF.School] as any;
        if (Array.isArray(s) && s[0]) schoolIds.add(String(s[0]));
        else if (s) schoolIds.add(String(s));
      });

      // 2) Build educatorId -> set of schoolIds via associations
      const associations = await this.getEducatorSchoolAssociations();
      const eduToSchools = new Map<string, Set<string>>();
      for (const a of associations) {
        if (!a.educatorId || !a.schoolId) continue;
        let set = eduToSchools.get(a.educatorId);
        if (!set) { set = new Set<string>(); eduToSchools.set(a.educatorId, set); }
        set.add(a.schoolId);
      }

      // 3) Fetch all educators and filter per rules
      const allEducators = await this.getEducators();
      const result: Educator[] = [];
      const seen = new Set<string>();
      const isTlRole = (roles?: string[] | string) => {
        const arr = Array.isArray(roles) ? roles : (roles ? [roles] : []);
        return arr.some(r => String(r).includes('Teacher Leader') || String(r).includes('Emerging Teacher Leader'));
      };
      for (const e of allEducators) {
        if (!e || !e.id) continue;
        let include = false;
        // A) TL role at user's schools
        if (isTlRole(e.currentRole)) {
          const set = eduToSchools.get(e.id);
          if (set && Array.from(set).some(id => schoolIds.has(id))) include = true;
        }
        // B) User is assigned partner or person responsible for follow up
        const assigned = Array.isArray(e.assignedPartner) ? e.assignedPartner : (e.assignedPartner ? [e.assignedPartner] : []);
        if (assigned.includes(userId)) include = true;
        const pr = (e as any).personResponsibleForFollowUp;
        if (pr && String(pr) === String(userId)) include = true;

        if (include && !seen.has(e.id)) { seen.add(e.id); result.push(e); }
      }
      return result;
    } catch (error) {
      console.error(`ERROR fetching TLs for user ${userId}:`, error);
      return [];
    }
  }

  async createSchoolNote(note: InsertSchoolNote): Promise<SchoolNote> {
    const recs = await base('School notes').create([{
      fields: {
        [SNF.school_id]: note.schoolId,
        [SNF.Notes]: note.notes,
        [SNF.Date_created]: note.dateCreated || undefined,
        [SNF.Created_by]: note.createdBy || undefined,
      }
    }]);
    return this.transformSchoolNoteRecord(recs[0]);
  }

  async updateActionStep(id: string, data: { item?: string; assignee?: string; dueDate?: string; status?: string }): Promise<ActionStep | undefined> {
    const fields: any = {};
    if (data.item !== undefined) fields[ASF.Item] = data.item;
    if (data.status !== undefined) fields[ASF.Status] = data.status;
    if (data.dueDate !== undefined) fields[ASF.Due_date] = data.dueDate || undefined;
    if (data.assignee !== undefined) fields[ASF.Assignee_Short_Name] = data.assignee || undefined;
    const record = await base('Action steps').update(id, fields);
    return transformActionStepRecord(record);
  }

  async deleteActionStep(id: string): Promise<boolean> {
    await base('Action steps').destroy(id);
    return true;
  }

  async updateSchoolNote(id: string, note: Partial<InsertSchoolNote>): Promise<SchoolNote | undefined> {
    const fields: any = {};
    if (note.schoolId !== undefined) fields[SNF.school_id] = note.schoolId;
    if (note.notes !== undefined) fields[SNF.Notes] = note.notes;
    if (note.dateCreated !== undefined) fields[SNF.Date_created] = note.dateCreated || undefined;
    if (note.createdBy !== undefined) fields[SNF.Created_by] = note.createdBy || undefined;
    const record = await base('School notes').update(id, fields);
    return this.transformSchoolNoteRecord(record);
  }

  async deleteSchoolNote(id: string): Promise<boolean> {
    await base('School notes').destroy(id);
    return true;
  }

  // Grant operations
  async getGrants(): Promise<Grant[]> {
    try {
      const records = await base(AT.GRANTS).select().all();
      return records.map(record => {
        const schoolId = record.fields[GF.school_id] || record.fields[GF.School];
        return {
          id: record.id,
          schoolId: Array.isArray(schoolId) ? String(schoolId[0] || '') : String(schoolId || ''),
          amount: Number(record.fields[GF.Amount] || 0),
          issuedDate: String(record.fields[GF.Issue_Date] || ''),
          issuedByShortName: String(record.fields[GF.Issued_by_Short_Name] || ''),
          status: String(record.fields[GF.Grant_Status] || ''),
          created: String(record.fields['Created'] || new Date().toISOString()),
          lastModified: String(record.fields['Last Modified'] || new Date().toISOString()),
        };
      });
    } catch (error) {
      console.error('Error fetching grants:', error);
      return [];
    }
  }

  async getGrant(id: string): Promise<Grant | undefined> {
    try {
      const record = await base(AT.GRANTS).find(id);
      const schoolId = record.fields[GF.school_id] || record.fields[GF.School];
      return {
        id: record.id,
        schoolId: Array.isArray(schoolId) ? String(schoolId[0] || '') : String(schoolId || ''),
        amount: Number(record.fields[GF.Amount] || 0),
        issuedDate: String(record.fields[GF.Issue_Date] || ''),
        issuedByShortName: String(record.fields[GF.Issued_by_Short_Name] || ''),
        status: String(record.fields[GF.Grant_Status] || ''),
        created: String(record.fields['Created'] || new Date().toISOString()),
        lastModified: String(record.fields['Last Modified'] || new Date().toISOString()),
      };
    } catch (error) {
      console.error('Error fetching grant:', error);
      return undefined;
    }
  }

  async getGrantsBySchoolId(schoolId: string): Promise<Grant[]> {
    try {
      // Query the "Grants" table filtered by schoolId
      const records = await base("Grants").select({
        filterByFormula: `{${GF.school_id}} = '${schoolId}'`
      }).all();
      
      return records.map(record => {
        const schoolId = record.fields[GF.school_id];
        const amount = record.fields[GF.Amount];
        const issueDate = record.fields[GF.Issue_Date];
        const status = record.fields[GF.Grant_Status];
        const created = record.fields["Created"]; // not enumerated in constants
        const lastModified = record.fields["Last Modified"]; // not enumerated in constants
        
        return {
          id: record.id,
          schoolId: Array.isArray(schoolId) ? String(schoolId[0] || '') : String(schoolId || ''),
          amount: Number(amount || 0),
          issuedDate: String(issueDate || ''),
          issuedBy: 'Wildflower Foundation', // Default since field doesn't exist
          status: String(status || ''),
          created: String(created || new Date().toISOString()),
          lastModified: String(lastModified || new Date().toISOString()),
        };
      });
    } catch (error) {
      console.error(`Error fetching grants for ${schoolId}:`, error);
      return [];
    }
  }

  async createGrant(grant: InsertGrant): Promise<Grant> {
    const recs = await base(AT.GRANTS).create([{
      fields: {
        [GF.school_id]: grant.schoolId,
        [GF.Amount]: grant.amount,
        [GF.Issue_Date]: grant.issuedDate || undefined,
        [GF.Grant_Status]: grant.status || undefined,
      }
    }]);
    return (await this.getGrant(recs[0].id))!;
  }

  async updateGrant(id: string, grant: Partial<InsertGrant>): Promise<Grant | undefined> {
    const fields: any = {};
    if (grant.schoolId !== undefined) fields[GF.school_id] = grant.schoolId;
    if (grant.amount !== undefined) fields[GF.Amount] = grant.amount;
    if (grant.issuedDate !== undefined) fields[GF.Issue_Date] = grant.issuedDate || undefined;
    if (grant.status !== undefined) fields[GF.Grant_Status] = grant.status || undefined;
    const record = await base(AT.GRANTS).update(id, fields);
    return (await this.getGrant(record.id))!;
  }

  async deleteGrant(id: string): Promise<boolean> {
    await base(AT.GRANTS).destroy(id);
    return true;
  }

  // Loan operations
  async getLoans(): Promise<Loan[]> {
    try {
      const records = await base(AT.LOANS).select().all();
      return records.map(record => {
        const schoolId = record.fields[LNF.school_id] || record.fields[LNF.School];
        return {
          id: record.id,
          schoolId: Array.isArray(schoolId) ? String(schoolId[0] || '') : String(schoolId || ''),
          amount: Number(record.fields[LNF.Amount_Issued] || 0),
          status: String(record.fields[LNF.Loan_Status] || ''),
          interestRate: Number(record.fields[LNF.Interest_Rate] || 0),
          created: String(record.fields['Created'] || record.fields[LNF.Effective_Issue_Date] || new Date().toISOString()),
          lastModified: String(record.fields['Last Modified'] || new Date().toISOString()),
        };
      });
    } catch (error) {
      console.error('Error fetching loans:', error);
      return [];
    }
  }

  async getLoan(id: string): Promise<Loan | undefined> {
    try {
      const record = await base(AT.LOANS).find(id);
      const schoolId = record.fields[LNF.school_id] || record.fields[LNF.School];
      return {
        id: record.id,
        schoolId: Array.isArray(schoolId) ? String(schoolId[0] || '') : String(schoolId || ''),
        amount: Number(record.fields[LNF.Amount_Issued] || 0),
        status: String(record.fields[LNF.Loan_Status] || ''),
        interestRate: Number(record.fields[LNF.Interest_Rate] || 0),
        created: String(record.fields['Created'] || record.fields[LNF.Effective_Issue_Date] || new Date().toISOString()),
        lastModified: String(record.fields['Last Modified'] || new Date().toISOString()),
      };
    } catch (error) {
      console.error('Error fetching loan:', error);
      return undefined;
    }
  }

  async getLoansBySchoolId(schoolId: string): Promise<Loan[]> {
    try {
      // Query the "Loans" table filtered by schoolId
      const records = await base("Loans").select({
        filterByFormula: `{${LNF.school_id}} = '${schoolId}'`
      }).all();
      
      return records.map(record => {
        const schoolId = record.fields[LNF.school_id];
        const amount = record.fields[LNF.Amount_Issued];
        const status = record.fields[LNF.Loan_Status];
        const issueDate = record.fields[LNF.Effective_Issue_Date];
        const created = record.fields["Created"]; // not enumerated
        const lastModified = record.fields["Last Modified"]; // not enumerated
        
        return {
          id: record.id,
          schoolId: Array.isArray(schoolId) ? String(schoolId[0] || '') : String(schoolId || ''),
          amount: Number(amount || 0),
          status: String(status || ''),
          interestRate: 0, // Field doesn't exist in this table
          created: String(created || issueDate || new Date().toISOString()),
          lastModified: String(lastModified || new Date().toISOString()),
        };
      });
    } catch (error) {
      console.error(`Error fetching loans for ${schoolId}:`, error);
      return [];
    }
  }

  async createLoan(loan: InsertLoan): Promise<Loan> {
    const recs = await base(AT.LOANS).create([{
      fields: {
        [LNF.school_id]: loan.schoolId,
        [LNF.Amount_Issued]: loan.amount,
        [LNF.Loan_Status]: loan.status || undefined,
        [LNF.Interest_Rate]: loan.interestRate || undefined,
      }
    }]);
    return (await this.getLoan(recs[0].id))!;
  }

  async updateLoan(id: string, loan: Partial<InsertLoan>): Promise<Loan | undefined> {
    const fields: any = {};
    if (loan.schoolId !== undefined) fields[LNF.school_id] = loan.schoolId;
    if (loan.amount !== undefined) fields[LNF.Amount_Issued] = loan.amount;
    if (loan.status !== undefined) fields[LNF.Loan_Status] = loan.status || undefined;
    if (loan.interestRate !== undefined) fields[LNF.Interest_Rate] = loan.interestRate || undefined;
    const record = await base(AT.LOANS).update(id, fields);
    return (await this.getLoan(record.id))!;
  }

  async deleteLoan(id: string): Promise<boolean> {
    await base(AT.LOANS).destroy(id);
    return true;
  }

  // Email address operations
  async getEmailAddresses(): Promise<EmailAddress[]> {
    try {
      const records = await selectAll('Email Addresses');
      return records.map(r => this.transformEmailAddressRecord(r));
    } catch (error) {
      console.warn('Warning: Unable to fetch Email Addresses table - table may not exist or may require permissions');
      return [];
    }
  }

  async getEmailAddress(id: string): Promise<EmailAddress | undefined> {
    try {
      const record = await findById('Email Addresses', id);
      return this.transformEmailAddressRecord(record);
    } catch (error) {
      console.warn(`Warning: Unable to fetch email address ${id}:`, error);
      return undefined;
    }
  }

  async getEmailAddressesByEducatorId(educatorId: string): Promise<EmailAddress[]> {
    try {
      const records = await selectByFormula('Email Addresses', `{${EAF.educator_id}} = '${educatorId}'`);
      return records.map(r => this.transformEmailAddressRecord(r));
    } catch (error) {
      console.warn(`Warning: Unable to fetch email addresses for educator ${educatorId}:`, error);
      return [];
    }
  }

  async createEmailAddress(emailAddress: InsertEmailAddress): Promise<EmailAddress> {
    const rec = await createRecord('Email Addresses', {
      [EAF.educator_id]: emailAddress.educatorId,
      [EAF.Email_Address]: emailAddress.email,
      [EAF.Email_Type]: emailAddress.type || 'Personal',
      [EAF.Current_Primary_Email]: emailAddress.isPrimary || false,
      [EAF.Active_]: true,
    });
    return this.transformEmailAddressRecord(rec);
  }

  async updateEmailAddress(id: string, emailAddress: Partial<InsertEmailAddress>): Promise<EmailAddress | undefined> {
    const fields: any = {};
    if (emailAddress.educatorId !== undefined) fields[EAF.educator_id] = emailAddress.educatorId;
    if (emailAddress.email !== undefined) fields[EAF.Email_Address] = emailAddress.email;
    if (emailAddress.type !== undefined) fields[EAF.Email_Type] = emailAddress.type;
    if (emailAddress.isPrimary !== undefined) fields[EAF.Current_Primary_Email] = emailAddress.isPrimary;
    if (emailAddress.isActive !== undefined) fields[EAF.Active_] = emailAddress.isActive;
    const record = await updateRecord('Email Addresses', id, fields);
    return this.transformEmailAddressRecord(record);
  }

  async deleteEmailAddress(id: string): Promise<boolean> {
    await deleteRecord('Email Addresses', id);
    return true;
  }

  // SSJ Fillout Forms operations
  async getSSJFilloutForms(): Promise<SSJFilloutForm[]> {
    try {
      const records = await base('SSJ Fillout Forms').select().all();
      return records.map(record => this.transformSSJFilloutFormRecord(record));
    } catch (error) {
      console.warn('Warning: Unable to fetch SSJ fillout forms:', error);
      return [];
    }
  }

  async getSSJFilloutForm(id: string): Promise<SSJFilloutForm | undefined> {
    const forms = await this.getSSJFilloutForms();
    return forms.find(form => form.id === id);
  }

  async getSSJFilloutFormsByEducatorId(educatorId: string): Promise<SSJFilloutForm[]> {
    try {
      const records = await base('SSJ Fillout Forms').select({
        filterByFormula: `{educator_id} = '${educatorId}'`
      }).all();
      
      return records.map(record => this.transformSSJFilloutFormRecord(record));
    } catch (error) {
      console.warn(`Warning: Unable to fetch SSJ fillout forms for educator ${educatorId}:`, error);
      return [];
    }
  }

  async createSSJFilloutForm(_form: InsertSSJFilloutForm): Promise<SSJFilloutForm> {
    throw new Error('SSJ Fillout Forms are view-only; creation not supported');
  }

  async updateSSJFilloutForm(_id: string, _form: Partial<InsertSSJFilloutForm>): Promise<SSJFilloutForm | undefined> {
    throw new Error('SSJ Fillout Forms are view-only; updates not supported');
  }

  async deleteSSJFilloutForm(_id: string): Promise<boolean> {
    throw new Error('SSJ Fillout Forms are view-only; deletion not supported');
  }

  private transformSSJFilloutFormRecord(record: any): SSJFilloutForm {
    const fields = record.fields;
    

    
    return {
      id: record.id,
      educatorId: fields[SJF.educator_id] || undefined,
      formVersion: fields[SJF.Form_version] || 'Get Involved',
      dateSubmitted: fields[SJF.Entry_Date] || undefined,
      firstName: fields[SJF.First_Name] || undefined,
      lastName: fields[SJF.Last_Name] || undefined,
      fullName: fields[SJF.Full_Name] || undefined,
      email: fields[SJF.Email] || undefined,
      raceEthnicity: fields[SJF.Socio_Economic__Race___Ethnicity] || undefined,
      raceEthnicityOther: fields[SJF.Socio_Economic__Race___Ethnicity_Other] || undefined,
      lgbtqia: fields[SJF.Socio_Economic__LGBTQIA_Identifying__from_Email_] || undefined,
      pronouns: fields[SJF.Socio_Economic__Pronouns] || undefined,
      pronounsOther: fields[SJF.Socio_Economic__Pronouns_Other] || undefined,
      gender: fields[SJF.Socio_Economic__Gender] || undefined,
      genderStandardized: fields[SJF.Gender_standardized] || undefined,
      genderOther: fields[SJF.Socio_Economic__Gender_Other] || undefined,
      hhIncome: fields[SJF.Socio_Economic__Household_Income] || undefined,
      primaryLanguage: fields[SJF.Primary_Language] || undefined,
      primaryLanguageOther: fields[SJF.Primary_Language_Other] || undefined,
      message: fields[SJF.Message] || undefined,
      isInterestedinCharter: fields[SJF.Is_Interested_in_Charter] || undefined,
      contactType: fields[SJF.Contact_Type] || undefined,
      contactTypeStandardized: fields[SJF.Contact_Type_Standardized] || undefined,
      montessoriCertQuestion: fields[SJF.Montessori_Cert_Question] || undefined,
      certProcessingStatus: fields[SJF.Status_of_Processing_Montessori_Certs] || undefined,
      isMontessoriCertified: fields[SJF.Is_Montessori_Certified] || undefined,
      isSeekingMontessoriCertification: fields[SJF.Is_Seeking_Montessori_Certification] || undefined,
      temp1Cert: fields[SJF.Temp___M_Cert_Cert_1] || undefined,
      temp2Cert: fields[SJF.Temp___M_Cert_Cert_2] || undefined,
      temp3Cert: fields[SJF.Temp___M_Cert_Cert_3] || undefined,
      temp4Cert: fields[SJF.Temp___M_Cert_Cert_4] || undefined,
      temp1Level: fields[SJF.Temp___M_Cert_Level_1] || undefined,
      temp2Level: fields[SJF.Temp___M_Cert_Level_2] || undefined,
      temp3Level: fields[SJF.Temp___M_Cert_Level_3] || undefined,
      temp4Level: fields[SJF.Temp___M_Cert_Level_4] || undefined,
      temp1Year: fields[SJF.Temp___M_Cert_Year_1] || undefined,
      temp2Year: fields[SJF.Temp___M_Cert_Year_2] || undefined,
      temp3Year: fields[SJF.Temp___M_Cert_Year_3] || undefined,
      temp4Year: fields[SJF.Temp___M_Cert_Year_4] || undefined,
      montCert1Cert: fields[SJF.Montessori_Certification_Certifier_1] || undefined,
      montCert2Cert: fields[SJF.Montessori_Certification_Certifier_2] || undefined,
      montCert3Cert: fields[SJF.Montessori_Certification_Certifier_3] || undefined,
      montCert4Cert: fields[SJF.Montessori_Certification_Certifier_4] || undefined,
      montCert1Level: fields[SJF.Montessori_Certification_Level_1] || undefined,
      montCert2Level: fields[SJF.Montessori_Certification_Level_2] || undefined,
      montCert3Level: fields[SJF.Montessori_Certification_Level_3] || undefined,
      montCert4Level: fields[SJF.Montessori_Certification_Level_4] || undefined,
      montCert1Year: fields[SJF.Montessori_Certification_Year_1] || undefined,
      montCert2Year: fields[SJF.Montessori_Certification_Year_2] || undefined,
      montCert3Year: fields[SJF.Montessori_Certification_Year_3] || undefined,
      montCert4Year: fields[SJF.Montessori_Certification_Year_4] || undefined,
      city: fields[SJF.City] || undefined,
      cityStandardized: fields[SJF.City_Standardized] || undefined,
      state: fields[SJF.State] || undefined,
      stateStandardized: fields[SJF.State_Standardized] || undefined,
      country: fields[SJF.Country] || undefined,
      city2: fields[SJF.City_2] || undefined,
      state2: fields[SJF.State_2] || undefined,
      country2: fields[SJF.Country_2] || undefined,
      targetGeo: fields[SJF.Age_Classrooms_Interested_In_Offering] || undefined,
      initialEdInterestsAge: fields[SJF.Age_Classrooms_Interested_In_Offering] || undefined,
      initialEdInterestsEducators: fields[SJF.Educator_Interests] || undefined,
      initialEdInterestsEducatorsOther: fields[SJF.Educator_Interests_Other] || undefined,
      commMemInterests: fields[SJF.Community_Member_Interest] || undefined,
      commMemInterestsOther: fields[SJF.Community_Member_Community_Info] || undefined,
      commMemSupportFindingTeachers: fields[SJF.Community_Member_Support_Finding_Teachers] || undefined,
      commMemCommunityInfo: fields[SJF.Community_Member_Community_Info] || undefined,
      commMemSelfInfo: fields[SJF.Community_Member_Self_Info] || undefined,
      receiveComms: fields[SJF.Receive_Communications] || undefined,
      source: fields[SJF.Source] || undefined,
      sourceOther: fields[SJF.Source___other] || undefined,
      mktgSource: fields[SJF.Marketing_Source] || undefined,
      mktgSourceCampaign: fields[SJF.Marketing_Campaign] || undefined,
      initialEdInterestCharter: fields[SJF.Interested_in_charter] || undefined,
      assignedPartner: fields[SJF.Assigned_Partner__from_Educators_] || undefined,
      sendGridTemplateId: fields[SJF.SendGrid_template_id] || undefined,
      sendGridSentDate: fields[SJF.SendGrid_sent_date] || undefined,
      routedTo: fields[SJF.Routed_To] || undefined,
      assignedPartnerOverride: fields[SJF.Assigned_Partner_Override] || undefined,
      emailSentByInitOutreacher: fields[SJF.Email_sent_by_Initial_Outreacher_] || undefined,
      oneOnOneStatus: fields[SJF.One_on_one_status] || undefined,
      initialOutreacher: fields[SJF.Initial_Outreacher] || undefined,
      personResponsibleForFollowUp: fields[SJF.Person_responsible_for_follow_up] || undefined,
      sourceForNonTLs: fields[SJF.Source_for_non_TLs] || undefined,
      // duplicates removed; values already set above
      responseData: fields[SJF.Message] || fields["Response Data"] || undefined,
      notes: fields["Notes"] || fields["notes"] || undefined,
      created: fields[SJF.Entry_Date] || fields["Created time"] || new Date().toISOString(),
      lastModified: fields["Last Modified"] || fields["Last modified time"] || new Date().toISOString(),
    };
  }

  private transformEmailAddressRecord(record: any): EmailAddress {
    const fields = record.fields;
    
    return {
      id: record.id,
      educatorId: fields[EAF.educator_id] || undefined,
      email: fields[EAF.Email_Address] || fields["email"] || undefined,
      type: fields[EAF.Email_Type] || fields["type"] || fields["Category"] || 'Personal',
      isPrimary: fields[EAF.Current_Primary_Email] === true,
      isActive: fields[EAF.Active_] || undefined
    };
  }

  // Montessori Certifications implementation
  async getMontessoriCertifications(): Promise<MontessoriCertification[]> {
    try {
      const table = base('Montessori Certs');
      const records = await table.select().all();
      return records.map(record => this.transformMontessoriCertificationRecord(record));
    } catch (error) {
      console.warn('Montessori Certs table not accessible:', error);
      return [];
    }
  }

  async getMontessoriCertification(id: string): Promise<MontessoriCertification | undefined> {
    try {
      const table = base('Montessori Certs');
      const record = await table.find(id);
      return this.transformMontessoriCertificationRecord(record);
    } catch (error) {
      console.warn('Montessori Cert not found:', error);
      return undefined;
    }
  }

  async getMontessoriCertificationsByEducatorId(educatorId: string): Promise<MontessoriCertification[]> {
    try {
      const table = base('Montessori Certs');
      const records = await table.select({
        filterByFormula: `{${MCF.educator_id}} = "${educatorId}"`
      }).all();
      const certifiersTable = base('Montessori Certifiers');
      const oldCertifiersTable = base('Montessori Certifiers - old list');
      const result = await Promise.all(records.map(async (record) => {
        const baseCert = this.transformMontessoriCertificationRecord(record);
        const link = record.fields[MCF.Certifier];
        const certifierId = Array.isArray(link) ? link[0] : link;
        let abbreviation: string | undefined = undefined;
        if (certifierId) {
          try {
            const certRec = await certifiersTable.find(certifierId);
            abbreviation = certRec?.fields?.[MCFI.Abbreviation] || undefined;
          } catch (e) {
            try {
              const oldRec = await oldCertifiersTable.find(certifierId);
              abbreviation = oldRec?.fields?.[MCFI.Abbreviation] || undefined;
            } catch {}
          }
        }
        return { ...baseCert, certifier: abbreviation ?? baseCert.certifier };
      }));
      return result;
    } catch (error) {
      console.warn('Error fetching Montessori Certifications by educator ID:', error);
      return [];
    }
  }

  async createMontessoriCertification(certification: InsertMontessoriCertification): Promise<MontessoriCertification> {
    const newCertification: MontessoriCertification = {
      id: `cert_${Date.now()}`,
      educatorId: certification.educatorId,
      certificationLevel: certification.certificationLevel,
      expirationDate: certification.expirationDate,
      notes: certification.notes,
      created: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };
    return newCertification;
  }

  async updateMontessoriCertification(id: string, certification: Partial<InsertMontessoriCertification>): Promise<MontessoriCertification | undefined> {
    const existing = await this.getMontessoriCertification(id);
    if (!existing) return undefined;
    
    return {
      ...existing,
      ...certification,
      lastModified: new Date().toISOString(),
    };
  }

  async deleteMontessoriCertification(id: string): Promise<boolean> {
    return true;
  }

  private transformMontessoriCertificationRecord(record: any): MontessoriCertification {
    const fields = record.fields;
    
    return {
      id: record.id,
      educatorId: Array.isArray(fields[MCF.educator_id]) ? (fields[MCF.educator_id] as any[])[0] : fields[MCF.educator_id] || undefined,
      certificationLevel: fields[MCF.Level] || undefined,
      certificationStatus: fields[MCF.Certification_Status] || undefined,
      certificationLevels: fields[MCF.Certification_Levels] || undefined,
      certifier: fields[MCF.Certifier] || fields[MCF.Abbreviation] || undefined,
      certifierOther: fields[MCF.Certifier___Other] || undefined,
      yearReceived: fields[MCF.Year_Certified] || undefined,
      created: fields[MCF.Created] || fields["Created time"] || undefined,
    };
  }

  // Event Attendance implementation
  async getEventAttendances(): Promise<EventAttendance[]> {
    try {
      const table = base('Event attendance');
      const records = await table.select().all();

      const eventsTable = base('Events');
      const result = await Promise.all(records.map(async (record) => {
        const baseAtt = this.transformEventAttendanceRecord(record);
        const link = record.fields[EATF.Event];
        const eventId = Array.isArray(link) ? link[0] : link;
        let eventName: string | undefined = undefined;
        let eventDate: string | undefined = undefined;
        if (eventId) {
          try {
            const ev = await eventsTable.find(eventId);
            eventName = ev.fields[EVF.Event_Name] || ev.fields['Name'] || eventId;
            eventDate = ev.fields[EVF.Date] || undefined;
          } catch (e) {
            try {
              const fallback = await eventsTable.select({ filterByFormula: `RECORD_ID() = "${eventId}"` }).firstPage();
              const ev = fallback?.[0];
              if (ev) {
                eventName = ev.fields[EVF.Event_Name] || ev.fields['Name'] || eventId;
                eventDate = ev.fields[EVF.Date] || undefined;
              } else {
                eventName = eventId;
              }
            } catch {
              eventName = eventId;
            }
          }
        }
        return { ...baseAtt, eventName, eventDate } as EventAttendance;
      }));

      return result;
    } catch (error) {
      console.warn('Event attendance table not accessible:', error);
      return [];
    }
  }

  async getEventAttendance(id: string): Promise<EventAttendance | undefined> {
    try {
      const table = base('Event attendance');
      const record = await table.find(id);
      const baseAtt = this.transformEventAttendanceRecord(record);
      const eventsTable = base('Events');
      const link = record.fields[EATF.Event];
      const eventId = Array.isArray(link) ? link[0] : link;
      let eventName: string | undefined = undefined;
      let eventDate: string | undefined = undefined;
      if (eventId) {
        try {
          const ev = await eventsTable.find(eventId);
          eventName = ev.fields[EVF.Event_Name] || ev.fields['Name'] || eventId;
          eventDate = ev.fields[EVF.Date] || undefined;
        } catch (e) {
          try {
            const fallback = await eventsTable.select({ filterByFormula: `RECORD_ID() = "${eventId}"` }).firstPage();
            const ev = fallback?.[0];
            if (ev) {
              eventName = ev.fields[EVF.Event_Name] || ev.fields['Name'] || eventId;
              eventDate = ev.fields[EVF.Date] || undefined;
            } else {
              eventName = eventId;
            }
          } catch {
            eventName = eventId;
          }
        }
      }
      return { ...baseAtt, eventName, eventDate } as EventAttendance;
    } catch (error) {
      console.warn('Event attendance record not found:', error);
      return undefined;
    }
  }

  async getEventAttendancesByEducatorId(educatorId: string): Promise<EventAttendance[]> {
    try {
      const table = base('Event attendance');
      const records = await table.select({
        filterByFormula: `{${EATF.educator_id}} = "${educatorId}"`
      }).all();

      const eventsTable = base('Events');
      const result = await Promise.all(records.map(async (record) => {
        const baseAtt = this.transformEventAttendanceRecord(record);
        const link = record.fields[EATF.Event];
        const eventId = Array.isArray(link) ? link[0] : link;
        let eventName: string | undefined = undefined;
        let eventDate: string | undefined = undefined;
        if (eventId) {
          try {
            const ev = await eventsTable.find(eventId);
            eventName = ev.fields[EVF.Event_Name] || ev.fields['Name'] || eventId;
            eventDate = ev.fields[EVF.Date] || undefined;
          } catch (e) {
            try {
              const fallback = await eventsTable.select({ filterByFormula: `RECORD_ID() = "${eventId}"` }).firstPage();
              const ev = fallback?.[0];
              if (ev) {
                eventName = ev.fields[EVF.Event_Name] || ev.fields['Name'] || eventId;
                eventDate = ev.fields[EVF.Date] || undefined;
              } else {
                eventName = eventId;
              }
            } catch {
              eventName = eventId;
            }
          }
        }
        return { ...baseAtt, eventName, eventDate } as EventAttendance;
      }));

      return result;
    } catch (error) {
      console.warn('Error fetching Event Attendance by educator ID:', error);
      return [];
    }
  }

  async createEventAttendance(attendance: InsertEventAttendance): Promise<EventAttendance> {
    const newAttendance: EventAttendance = {
      id: `event_${Date.now()}`,
      educatorId: attendance.educatorId,
      eventName: attendance.eventName,
      eventDate: attendance.eventDate,
      attended: attendance.attended,
      registered: attendance.registered,
      registrationDate: attendance.registrationDate,
    };
    return newAttendance;
  }

  async updateEventAttendance(id: string, attendance: Partial<InsertEventAttendance>): Promise<EventAttendance | undefined> {
    const existing = await this.getEventAttendance(id);
    if (!existing) return undefined;
    
    return {
      ...existing,
      ...attendance,
      lastModified: new Date().toISOString(),
    };
  }

  async deleteEventAttendance(id: string): Promise<boolean> {
    return true;
  }

  private transformEventAttendanceRecord(record: any): EventAttendance {
    const fields = record.fields;
    return {
      id: record.id,
      educatorId: fields[EATF.educator_id] || undefined,
      // Event name/date will be populated by join in callers
      attended: fields[EATF.Attended] || undefined,
      registered: fields[EATF.Registered] || undefined,
      registrationDate: fields[EATF.Registration_Date] || undefined,
    };
  }

  // Educator Notes implementation
  async getEducatorNotes(): Promise<EducatorNote[]> {
    try {
      const table = base('Educator notes');
      const records = await table.select().all();
      return records.map(record => this.transformEducatorNoteRecord(record));
    } catch (error) {
      console.warn('Educator notes table not accessible:', error);
      return [];
    }
  }

  async getEducatorNote(id: string): Promise<EducatorNote | undefined> {
    try {
      const table = base('Educator notes');
      const record = await table.find(id);
      return this.transformEducatorNoteRecord(record);
    } catch (error) {
      console.warn('Educator note not found:', error);
      return undefined;
    }
  }

  async getEducatorNotesByEducatorId(educatorId: string): Promise<EducatorNote[]> {
    try {
      const table = base('Educator notes');
      const records = await table.select({
        filterByFormula: `{${ENF.educator_id}} = "${educatorId}"`
      }).all();
      return records.map(record => this.transformEducatorNoteRecord(record));
    } catch (error) {
      console.warn('Error fetching Educator Notes by educator ID:', error);
      return [];
    }
  }

  async createEducatorNote(note: InsertEducatorNote): Promise<EducatorNote> {
    const recs = await base('Educator notes').create([{
      fields: {
        [ENF.educator_id]: note.educatorId,
        [ENF.Date]: note.dateCreated || new Date().toISOString(),
        [ENF.Created_by]: note.createdBy || undefined,
        [ENF.Notes]: note.notes,
        [ENF.Private]: note.isPrivate || false,
      }
    }]);
    return this.transformEducatorNoteRecord(recs[0]);
  }

  async updateEducatorNote(id: string, note: Partial<InsertEducatorNote>): Promise<EducatorNote | undefined> {
    const fields: any = {};
    if (note.educatorId !== undefined) fields[ENF.educator_id] = note.educatorId;
    if (note.dateCreated !== undefined) fields[ENF.Date] = note.dateCreated || undefined;
    if (note.createdBy !== undefined) fields[ENF.Created_by] = note.createdBy || undefined;
    if (note.notes !== undefined) fields[ENF.Notes] = note.notes;
    if (note.isPrivate !== undefined) fields[ENF.Private] = note.isPrivate;
    const record = await base('Educator notes').update(id, fields);
    return this.transformEducatorNoteRecord(record);
  }

  async deleteEducatorNote(id: string): Promise<boolean> {
    await base('Educator notes').destroy(id);
    return true;
  }

  private transformEducatorNoteRecord(record: any): EducatorNote {
    const fields = record.fields;
    return {
      id: record.id,
      educatorId: fields[ENF.educator_id] || undefined,
      dateCreated: fields[ENF.Date] || undefined,
      createdBy: fields[ENF.Created_by] || undefined,
      notes: fields[ENF.Notes] || undefined,
      isPrivate: fields[ENF.Private] || undefined,
    };
  }
  /*
  // Membership fee methods (read-only)
  async getMembershipFeesByYear(): Promise<MembershipFeeByYear[]> {
    try {
      const table = base('Membership fee school x year');
      const records = await table.select().all();
      return records.map(record => this.transformMembershipFeeByYearRecord(record));
    } catch (error) {
      console.warn('Membership fee school x year table not accessible:', error);
      return [];
    }
  }

  async getMembershipFeeByYear(id: string): Promise<MembershipFeeByYear | undefined> {
    try {
      const table = base('Membership fee school x year');
      const record = await table.find(id);
      return this.transformMembershipFeeByYearRecord(record);
    } catch (error) {
      console.warn('Membership fee record not found or inaccessible:', error);
      return undefined;
    }
  }

  async getMembershipFeesBySchoolId(schoolId: string): Promise<MembershipFeeByYear[]> {
    try {
      const table = base('Membership fee school x year');
      
      // Try Airtable formula filtering first
      try {
        const records = await table.select({
          filterByFormula: `FIND("${schoolId}", ARRAYJOIN({School})) > 0`
        }).all();
        
        if (records.length > 0) {
          return records.map(record => this.transformMembershipFeeByYearRecord(record));
        }
      } catch (formulaError) {
        console.log('Airtable formula filtering failed, falling back to manual filtering');
      }
      
      // Fallback to manual filtering if formula doesn't work
      const allRecords = await table.select().all();
      const matchingRecords = allRecords.filter(record => {
        const school = record.fields["School"];
        return Array.isArray(school) && school.includes(schoolId);
      });
      
      return matchingRecords.map(record => this.transformMembershipFeeByYearRecord(record));
    } catch (error) {
      console.error('Error fetching membership fees by school ID:', error);
      return [];
    }
  }

  async createMembershipFeeByYear(_fee: InsertMembershipFeeByYear): Promise<MembershipFeeByYear> {
    throw new Error('Create membership fee not supported via API');
  }

  async updateMembershipFeeByYear(_id: string, _fee: Partial<InsertMembershipFeeByYear>): Promise<MembershipFeeByYear | undefined> {
    throw new Error('Update membership fee not supported via API');
  }

  async deleteMembershipFeeByYear(_id: string): Promise<boolean> {
    throw new Error('Delete membership fee not supported via API');
  }

  private transformMembershipFeeByYearRecord(record: any): MembershipFeeByYear {
    const fields = record.fields;
    
    return {
      id: record.id,
      schoolId: Array.isArray(fields["school_id (from School)"]) ? fields["school_id (from School)"][0] : 
                Array.isArray(fields["School"]) ? fields["School"][0] : fields["School"] || undefined,
      schoolYear: fields["School year"] || undefined,
      feeAmount: fields["Initial fee"] || fields["Revised amount"] || undefined,
      status: fields["Current exemption status"] || undefined,
      dueDate: fields["End date (from School year)"] || undefined,
      notes: fields["Notes"] || undefined,
      likelihoodOfPaying: fields["Likelihood of paying"] || undefined,
    };
  }

  // Membership fee update operations implementation
  async getMembershipFeeUpdates(): Promise<MembershipFeeUpdate[]> {
    try {
      const table = base('Membership Fee Updates');
      const records = await table.select().all();
      return records.map(record => this.transformMembershipFeeUpdateRecord(record));
    } catch (error) {
      console.error('Error fetching membership fee updates:', error);
      return [];
    }
  }

  async getMembershipFeeUpdate(id: string): Promise<MembershipFeeUpdate | undefined> {
    try {
      const table = base('Membership Fee Updates');
      const record = await table.find(id);
      return this.transformMembershipFeeUpdateRecord(record);
    } catch (error) {
      console.error('Error fetching membership fee update:', error);
      return undefined;
    }
  }

  async getMembershipFeeUpdatesBySchoolId(schoolId: string): Promise<MembershipFeeUpdate[]> {
    try {
      // First get all membership fee records for this school
      const membershipFees = await this.getMembershipFeesBySchoolId(schoolId);
      const feeRecordIds = membershipFees.map(fee => fee.id);
      
      if (feeRecordIds.length === 0) {
        return [];
      }
      
      // Then get updates that reference these fee records
      const table = base('Membership Fee Updates');
      const allRecords = await table.select().all();
      
      const records = allRecords.filter(record => {
        const feeRecord = record.fields["Fee Record"];
        return Array.isArray(feeRecord) && feeRecord.some(id => feeRecordIds.includes(id));
      });
      
      return records.map(record => this.transformMembershipFeeUpdateRecord(record));
    } catch (error) {
      console.error('Error fetching membership fee updates by school ID:', error);
      return [];
    }
  }

  async getMembershipFeeUpdatesBySchoolIdAndYear(schoolId: string, schoolYear: string): Promise<MembershipFeeUpdate[]> {
    try {
      const table = base('Membership Fee Updates');
      const records = await table.select({
        filterByFormula: `AND({schools} = "${schoolId}", {School Year} = "${schoolYear}")`
      }).all();
      return records.map(record => this.transformMembershipFeeUpdateRecord(record));
    } catch (error) {
      console.error('Error fetching membership fee updates by school ID and year:', error);
      return [];
    }
  }

  async createMembershipFeeUpdate(update: InsertMembershipFeeUpdate): Promise<MembershipFeeUpdate> {
    const newUpdate: MembershipFeeUpdate = {
      id: `fee_update_${Date.now()}`,
      schoolId: update.schoolId,
      schoolYear: update.schoolYear,
      updateDate: update.updateDate,
      updateType: update.updateType,
      previousValue: update.previousValue,
      newValue: update.newValue,
      updatedBy: update.updatedBy,
      notes: update.notes,
    };
    return newUpdate;
  }

  async updateMembershipFeeUpdate(id: string, update: Partial<InsertMembershipFeeUpdate>): Promise<MembershipFeeUpdate | undefined> {
    const existing = await this.getMembershipFeeUpdate(id);
    if (!existing) return undefined;
    
    return {
      ...existing,
      ...update,
    };
  }

  async deleteMembershipFeeUpdate(id: string): Promise<boolean> {
    return true;
  }

  private transformMembershipFeeUpdateRecord(record: any): MembershipFeeUpdate {
    const fields = record.fields;
    return {
      id: record.id,
      schoolId: undefined, // This table doesn't directly link to schools
      schoolYear: undefined,
      updateDate: fields["Date"] || undefined,
      updateType: fields["Update type"] || undefined,
      previousValue: undefined,
      newValue: fields["New percent"] || undefined,
      updatedBy: undefined,
      notes: undefined,
    };
  }
  */
  private transformSchoolNoteRecord(record: any): SchoolNote {
    const fields = record.fields;
/*    
    // Extract headline properly - Airtable returns objects with structure { state: 'generated', value: 'text', isStale: false }
    let headline = fields["Headline (Notes)"];
    if (headline && typeof headline === 'object') {
      // If it's an array, take the first element
      if (Array.isArray(headline)) {
        headline = headline[0];
      }
      // If it's still an object, extract the value property (common for generated Airtable fields)
      if (typeof headline === 'object') {
        headline = headline.value || headline.text || JSON.stringify(headline);
      }
    }
*/
    return {
      id: record.id,
      schoolId: fields[SNF.school_id] || undefined,
      dateCreated: fields[SNF.Date_created] || undefined,
      createdBy: fields[SNF.Partner_Short_Name] || undefined,
      notes: fields[SNF.Notes] || undefined,
    };
  }

  async getTax990sBySchoolId(schoolId: string): Promise<Tax990[]> {
    try {
      const table = base('990s');
      const records = await table.select({
        filterByFormula: `{${N9F.school_id}} = "${schoolId}"`
      }).all();
      return records.map(record => this.transformTax990Record(record));
    } catch (error) {
      console.error('Error fetching 990s by school ID:', error);
      return [];
    }
  }

  private transformTax990Record(record: any): Tax990 {
    const fields = record.fields;
    const pdfField = fields[N9F.PDF];
    let attachment = "";
    let attachmentUrl = "";
    
    if (Array.isArray(pdfField) && pdfField.length > 0) {
      try {
        const attachmentObj = pdfField[0];
        attachment = attachmentObj.filename || "";
        attachmentUrl = attachmentObj.url || "";
      } catch (error) {
        console.warn('Error processing 990 PDF attachment:', error);
      }
    }
    
    return {
      id: record.id,
      schoolId: fields[N9F.school_id] || undefined,
      year: fields[N9F._990_Reporting_Year] || undefined,
      attachment: attachment || undefined,
      attachmentUrl: attachmentUrl || undefined,
    };
  }
  
  // Charter-related operations
  async getSchoolsByCharterId(charterId: string): Promise<School[]> {
    try {
      const schools = await this.getSchools();
      return schools.filter(school => school.charterId === charterId);
    } catch (error) {
      console.error('Error fetching schools by charter ID:', error);
      return [];
    }
  }

  async getCharterRolesByCharterId(charterId: string): Promise<CharterRole[]> {
    try {
      const records = await base("Charter roles").select({
        filterByFormula: `{${CRF.charter_id}} = '${charterId}'`
      }).all();
      
      return records.map(record => ({
        id: record.id,
        charterId: String(record.fields[CRF.charter_id] || ''),
        role: String(record.fields[CRF.Role] || ''),
        name: String(record.fields[CRF.Name] || ''),
        currentlyActive: Boolean(record.fields[CRF.Currently_active]),
        created: String(record.fields["Created"] || new Date().toISOString()),
        lastModified: String(record.fields["Last Modified"] || new Date().toISOString()),
      }));
    } catch (error) {
      console.error('Error fetching charter roles:', error);
      return [];
    }
  }

  async getCharterApplicationsByCharterId(charterId: string): Promise<CharterApplication[]> {
    try {
      const records = await base("Charter applications").select({
        filterByFormula: `{${CAF.charter_id}} = '${charterId}'`
      }).all();
      
      return records.map(record => ({
        id: record.id,
        charterId: String(record.fields[CAF.charter_id] || ''),
        applicationName: String(record.fields[CAF.Full_Name] || ''),
        targetOpen: String(record.fields[CAF.Target_open] || ''),
        status: String(record.fields[CAF.Status] || ''),
        submissionDate: String(record.fields["Submission Date"] || ''),
        created: String(record.fields["Created"] || new Date().toISOString()),
        lastModified: String(record.fields["Last Modified"] || new Date().toISOString()),
      }));
    } catch (error) {
      console.error('Error fetching charter applications:', error);
      return [];
    }
  }

  async getCharterAuthorizerContactsByCharterId(charterId: string): Promise<CharterAuthorizerContact[]> {
    try {
      const records = await base("Charter authorizers and contacts").select({
        filterByFormula: `{${CACF.charter_id}} = '${charterId}'`
      }).all();
      
      return records.map(record => ({
        id: record.id,
        charterId: String(record.fields[CACF.charter_id] || ''),
        name: String(record.fields[CACF.Contact] || record.fields[CACF.Authorizer] || ''),
        organization: String(record.fields["Organization"] || ''),
        email: String(record.fields[CACF.Email] || ''),
        phone: String(record.fields[CACF.Phone] || ''),
        role: String(record.fields[CRF.Role] || ''),
        title: String(record.fields[CACF.Title] || ''),
        currentlyActive: Boolean(record.fields[CACF.Currently_active]),
        created: String(record.fields["Created"] || new Date().toISOString()),
        lastModified: String(record.fields["Last Modified"] || new Date().toISOString()),
      }));
    } catch (error) {
      console.error('Error fetching charter authorizer contacts:', error);
      return [];
    }
  }

  async getReportSubmissionsByCharterId(charterId: string): Promise<ReportSubmission[]> {
    try {
      const records = await base("Reports and submissions").select({
        filterByFormula: `{${RSF.charter_id}} = '${charterId}'`
      }).all();
      
      return records.map(record => ({
        id: record.id,
        charterId: String(record.fields[RSF.charter_id] || ''),
        reportType: String(record.fields[RSF.Report_type] || ''),
        dueDate: String(record.fields["Due Date"] || ''),
        submissionDate: String(record.fields["Submission Date"] || ''),
        status: String(record.fields["Status"] || ''),
        schoolYear: String(record.fields[RSF.School_year] || ''),
        attachments: Array.isArray(record.fields[RSF.Attachments]) ? (record.fields[RSF.Attachments] as any[]).map(a => a?.url || a?.name || String(a)) : [],
        created: String(record.fields["Created"] || new Date().toISOString()),
        lastModified: String(record.fields["Last Modified"] || new Date().toISOString()),
      }));
    } catch (error) {
      console.error('Error fetching report submissions:', error);
      return [];
    }
  }

  async getAssessmentDataByCharterId(charterId: string): Promise<AssessmentData[]> {
    try {
      const records = await base("Assessment data").select({
        filterByFormula: `{${ADF.charter_id}} = '${charterId}'`
      }).all();
      
      return records.map(record => ({
        id: record.id,
        charterId: String(record.fields[ADF.charter_id] || ''),
        assessmentType: String(record.fields[ADF.Assessment] || record.fields["Assessment Type"] || ''),
        testDate: String(record.fields[ADF.Year] || record.fields["Test Date"] || ''),
        results: String(record.fields[ADF.Other_data] || record.fields["Results"] || ''),
        grade: String(record.fields["Grade"] || ''),
        schoolId: String(record.fields[ADF.school_id] || ''),
        numberAssessed: Number(record.fields[ADF.Number_assessed] || 0),
        created: String(record.fields["Created"] || new Date().toISOString()),
        lastModified: String(record.fields["Last Modified"] || new Date().toISOString()),
      }));
    } catch (error) {
      console.error('Error fetching assessment data:', error);
      return [];
    }
  }

  async getCharterNotesByCharterId(charterId: string): Promise<CharterNote[]> {
    try {
      const records = await base("School notes").select({
        filterByFormula: `{${SNF.charter_id}} = '${charterId}'`
      }).all();
      return records.map(transformCharterNote);
    } catch (error) {
      console.error('Error fetching charter notes:', error);
      return [];
    }
  }

  async getCharterActionStepsByCharterId(charterId: string): Promise<CharterActionStep[]> {
    try {
      const records = await base("Action steps").select({
        filterByFormula: `{${ASF.charter_id}} = '${charterId}'`
      }).all();
      
      return records.map(record => ({
        id: record.id,
        charterId: String(record.fields[ASF.charter_id] || ''),
        description: String(record.fields[ASF.Item] || ''),
        assignee: String(record.fields[ASF.Assignee_Short_Name] || ''),
        dueDate: String(record.fields[ASF.Due_date] || ''),
        completedDate: String(record.fields[ASF.Completed_date] || ''),
        status: String(record.fields[ASF.Status] || ''),
        complete: String(record.fields[ASF.Status] || '').toLowerCase() === 'complete',
        created: String(record.fields["Created"] || new Date().toISOString()),
        lastModified: String(record.fields["Last Modified"] || new Date().toISOString()),
      }));
    } catch (error) {
      console.error('Error fetching charter action steps:', error);
      return [];
    }
  }

  async getCharterGovernanceDocumentsByCharterId(charterId: string): Promise<CharterGovernanceDocument[]> {
    try {
      const records = await base(AT.GOVERNANCE_DOCS).select({
        filterByFormula: `{${GDF.charter_id}} = '${charterId}'`
      }).all();
      return records.map(transformCharterGovernanceDocument);
    } catch (error) {
      console.error('Error fetching charter governance documents:', error);
      return [];
    }
  }

  async getCharter990sByCharterId(charterId: string): Promise<Charter990[]> {
    try {
      const records = await base("990s").select({
        filterByFormula: `{${N9F.charter_id}} = '${charterId}'`
      }).all();
      return records.map(transformCharter990);
    } catch (error) {
      console.error('Error fetching charter 990s:', error);
      return [];
    }
  }

  async getEducatorSchoolAssociationsByCharterId(charterId: string): Promise<EducatorSchoolAssociation[]> {
    try {
      const records = await base("Educators x Schools").select({
        filterByFormula: `{${EXSF.charter_id}} = '${charterId}'`
      }).all();
      
      return records.map(record => this.transformEXSRecord(record));
    } catch (error) {
      console.error('Error fetching educator school associations by charter ID:', error);
      return [];
    }
  }
}

export const storage = new SimpleAirtableStorage();

