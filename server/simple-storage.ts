import { base } from "./airtable-schema";
import { cache } from "./cache";
import { handleError } from "./error-handler";
import type { 
  Educator, 
  School, 
  EducatorSchoolAssociation, 
  Location,
  GuideAssignment,
  GovernanceDocument,
  SchoolNote,
  Grant,
  Loan,
  MembershipFeeByYear,
  MembershipFeeUpdate,
  EmailAddress,
  InsertEducator, 
  InsertSchool, 
  InsertEducatorSchoolAssociation,
  InsertLocation,
  InsertGuideAssignment,
  InsertGovernanceDocument,
  InsertSchoolNote,
  InsertGrant,
  InsertLoan,
  InsertMembershipFeeByYear,
  InsertMembershipFeeUpdate,
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
  InsertTeacherSchoolAssociation
} from "@shared/schema";

export interface IStorage {
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
  deleteTeacherSchoolAssociation(id: string): Promise<boolean>;
}

export class SimpleAirtableStorage implements IStorage {
  // Helper method to transform Airtable record to Educator
  private transformEducatorRecord(record: any): Educator {
    const fields = record.fields;
    
    return {
      id: record.id,
      fullName: fields["Full Name"] || "",
      firstName: fields["First Name"] || undefined,
      nickname: fields["Nickname"] || undefined,
      middleName: fields["Middle Name"] || undefined,
      lastName: fields["Last Name"] || undefined,
      primaryPhone: fields["Primary phone"] || fields["Primary Phone"] || fields["Phone"] || undefined,
      secondaryPhone: fields["Secondary phone"] || fields["Secondary Phone"] || fields["Phone 2"] || undefined,
      homeAddress: fields["Home Address"] || undefined,
      pronouns: fields["Pronouns"] || undefined,
      pronounsOther: fields["Pronouns - Other"] || undefined,
      gender: fields["Gender"] || undefined,
      genderOther: fields["Gender - Other"] || undefined,
      raceEthnicity: fields["Race & Ethnicity"] || undefined,
      raceEthnicityOther: fields["Race & Ethnicity - Other"] || undefined,
      primaryLanguage: fields["Primary Language"] || undefined,
      otherLanguages: fields["Other languages"] || undefined,
      educationalAttainment: fields["Educational Attainment"] || undefined,
      montessoriCertified: fields["Montessori Certified"] || false,
      montessoriLeadGuideTrainings: fields["Montessori lead guide trainings"] || undefined,
      currentRole: fields["Current Role"] || undefined,
      discoveryStatus: fields["Discovery status"] || undefined,
      assignedPartner: fields["Assigned Partner"] || undefined,
      assignedPartnerEmail: fields["Assigned Partner Email"] || undefined,
      householdIncome: fields["Household Income"] || undefined,
      incomeBackground: fields["Income Background"] || undefined,
      individualType: fields["Individual Type"] || undefined,
      activeSchool: fields["Currently Active School"] || undefined,
      activeSchoolStageStatus: fields["Stage_Status for Active School"] || undefined,
      firstContactRelocate: fields['First Contact - Willingness to Relocate'] || '',
      firstContactGovernance: fields['First Contact - Initial Interest in Governance Model'] || '',
      firstContactNotesOnPreWildflowerEmployment: fields['First Contact - Notes on pre-Wildflower Employment'] || '',
      firstContactWFSchoolEmploymentStatus: fields['First Contact - WF School Employment Status'] || '',
      firstContactAges: fields['First Contact - initial interest in ages'] || [],
      firstContactInterests: fields['First Contact - Initial Interests'] || '',
      // Early Cultivation Data
      source: fields['Source'] || undefined,
      sendgridTemplateSelected: fields['SendGrid Template Selected'] || undefined,
      sendgridSendDate: fields['SendGrid Send Date'] || undefined,
      routedTo: fields['Routed To'] || undefined,
      assignedPartnerOverride: fields['Assigned Partner Override'] || undefined,
      personalEmailSent: fields['Personal Email Sent'] === true,
      personalEmailSentDate: fields['Personal Email Sent Date'] || undefined,
      personResponsibleForFollowUp: fields['Person Responsible for Follow Up'] || undefined,
      oneOnOneSchedulingStatus: fields['One on One Scheduling Status'] || undefined,
      opsGuideMeetingPrefTime: fields['Ops Guide Meeting Preferrence Time'] || '',
      opsGuideSpecificsChecklist: fields['Ops Guide Specifics Checklist'] || [],
      opsGuideReqPertinentInfo: fields['Ops Guide Request Pertinent Info'] || [],
      opsGuideSupportTypeNeeded: fields['Ops Guide Support Type Needed'] || [],
      opsGuideFundraisingOps: fields['Ops Guide Any fundraising opportunities?'] || '',
      activeHolaspirit: fields["Active Holaspirit"] || false,
      holaspiritMemberID: fields["Holaspirit memberID"] || undefined,
      tcUserID: fields["TC User ID"] || undefined,
      created: fields["Created"] || undefined,
      lastModified: fields["Last Modified"] || undefined,
      createdBy: fields["Created By"]?.name || undefined,
    };
  }

  // Helper method to transform Airtable record to School
  private transformSchoolRecord(record: any): School {
    const fields = record.fields;
    return {
      id: record.id,
      name: fields["Name"] || fields["School Name"] || "",
      shortName: fields["Short Name"] || undefined,
      logo: fields["Logo"]?.[0]?.url || undefined,
      currentPhysicalAddress: fields['Current Physical Address?'] === true,
      currentMailingAddress: fields['Current Mailing Address?'] === true,
      activePhysicalAddress: Array.isArray(fields['Current Physical Address - Address']) 
        ? fields['Current Physical Address - Address'].join(', ')
        : fields['Current Physical Address - Address'] || 
          (Array.isArray(fields['Current Physical Address']) 
            ? fields['Current Physical Address'].join(', ')
            : fields['Current Physical Address']),
      activeLocationCity: fields['Current Physical Address - City'],
      activeLocationState: fields['Current Physical Address - State'],
      activeLatitude: fields['activeLatitude'] ? parseFloat(fields['activeLatitude']) : undefined,
      activeLongitude: fields['activeLongitude'] ? parseFloat(fields['activeLongitude']) : undefined,
      ssjTargetCity: fields['SSJ - Target City'] || null,
      ssjTargetState: fields['SSJ - Target State'] || null,
      locality: (fields['Current Physical Address - City']
        ? `${fields['Current Physical Address - City']}${fields['Current Physical Address - State'] ? ', ' + fields['Current Physical Address - State'] : ''}`
        : fields['SSJ - Target City']
          ? `${fields['SSJ - Target City']}${fields['SSJ - Target State'] ? ', ' + fields['SSJ - Target State'] : ''}`
          : ''),
      phone: fields["Shool Phone"] || undefined,
      email: fields["School Email"] || undefined,
      website: fields["Website"] || undefined,
      instagram: fields["Instagram"] || undefined,
      facebook: fields["Facebook"] || undefined,
      priorNames: fields['Prior Names'] || '',
      narrative: fields['Narrative'] || '',
      institutionalPartner: fields['Institutional partner'] || null,
      membershipStatus: fields['Membership Status'] || '',
      founders: fields['Founders'] || [],
      membershipAgreementDate: fields['Membership Agreement date'] || '',
      signedMembershipAgreement: fields['Signed Membership Agreement'] || '',
      agreementVersion: fields['Agreement Version'] || '',
      about: fields['About'] || '',
      aboutSpanish: fields['About Spanish'] || '',
      agesServed: fields["Ages served"] || undefined,
      governanceModel: fields["Governance Model"] || undefined,
      status: fields["Stage_Status"] || undefined,
      stageStatus: fields["Stage_Status"] || undefined,
      openDate: fields["Open Date"] || undefined,
      enrollmentCap: fields["Enrollment at Full Capacity"] || undefined,
      lastModified: fields["Last Modified"] || undefined,
      currentTLs: fields["Current TLs"] || undefined,
      // --- SSJ/OSS Data ---
      ssjStage: fields['SSJ Stage'] || '',
      ssjOriginalProjectedOpenDate: fields['SSJ - Original Projected Open Date'] || '',
      ssjProjOpenSchoolYear: fields['SSJ - Proj Open School Year'] || '',
      ssjProjectedOpen: fields['SSJ - Projected Open'] || '',
      riskFactors: fields['Risk Factors'] || [],
      watchlist: fields['Watchlist'] || [],
      ssjBoardDevelopment: fields['SSJ - Board development'] || '',
      enteredVisioningDate: fields['Entered Visioning Date'] || '',
      enteredPlanningDate: fields['Entered Planning Date'] || '',
      enteredStartupDate: fields['Entered Startup Date'] || '',
      ssjHasETLPartner: fields['SSJ - Has the ETL identified a partner?'] || '',
      ssjOpsGuideTrack: fields['SSJ - Ops Guide Support Track'] || [],
      ssjReadinessRating: fields['SSJ - Readiness to Open Rating'] || '',
      ssjFacility: fields['SSJ - Facility'] || '',
      building4GoodFirm: fields['Building4Good Firm & Attorney'] || '',
      ssjTotalStartupFundingReq: fields['SSJ - Total Startup Funding Needed'] || '',
      ssjFundraisingNarrative: fields['SSJ - Fundraising narrative'] || '',
      planningAlbum: fields['Planning Album'] || '',
      activePodMember: fields['Active Pod Member'] || '',
      cohorts: fields['Cohorts'] || [],
      // --- Systems ---
      googleVoice: fields['Google Voice'] || '',
      budgetUtility: fields['Budget Utility'] || '',
      admissionsSystem: fields['Admissions System'] || '',
      qbo: fields['QBO'] || '',
      websiteTool: fields['Website tool'] || '',
      logoDesigner: fields['Logo designer'] || '',
      transparentClassroom: fields['Transparent Classroom'] || '',
      tcAdmissions: fields['TC Admissions'] || '',
      tcRecordkeeping: fields['TC Recordkeeping'] || '',
      gusto: fields['Gusto'] || '',
      businessInsurance: fields['Business Insurance'] || '',
      nameSelectionProposal: fields['Name Selection Proposal'] || '',
      trademarkFiled: fields['Trademark Filed'] || '',
      billComAccount: fields['Bill.com Account'] || '',
      googleWorkspacePath: fields['Google Workspace Org Unit Path'] || '',
      budgetLink: fields['Budget Link'] || '',
      bookkeeper: fields['Bookkeeper / Accountant'] || '',
      lgbtqia: fields['LGBTQIA'] === 'TRUE',
      excludeFromEmailLogging: fields['Exclude from email logging'],
      targetGeo: fields['Target geo combined'] || '',
      targetIntl: fields['Target - international'] || '',
      assignedPartnerEmail: fields['Assigned Partner Email'] || '',
      assignedPartnerOverride: fields['Assigned Partner Override'] || '',
      assignedPartnerShortName: fields['Assigned Partner Short Name'] || '',
      selfReflection: fields['Self-reflection'] || '',
      inactiveFlag: fields['Inactive Flag'] || '',
      createdTime: record.createdTime

      
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
      const records = await base("Educators").select().all();
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
      const record = await base("Educators").find(id);
      return this.transformEducatorRecord(record);
    } catch (error) {
      console.error(`Error fetching educator ${id} from Airtable:`, error);
      return undefined;
    }
  }

  async getEducatorByEmail(email: string): Promise<Educator | undefined> {
    try {
      const records = await base("Educators").select({
        filterByFormula: `{Primary email} = "${email}"`
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
      const record = await base("Educators").create({
        "First Name": educator.firstName,
        "Last Name": educator.lastName
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
      
      if (educator.firstName !== undefined) updateFields["First Name"] = educator.firstName;
      if (educator.lastName !== undefined) updateFields["Last Name"] = educator.lastName;
      if (educator.fullName !== undefined) updateFields["Full Name"] = educator.fullName;

      const record = await base("Educators").update(id, updateFields);
      return this.transformEducatorRecord(record);
    } catch (error) {
      console.error(`Error updating educator ${id} in Airtable:`, error);
      return undefined;
    }
  }

  async deleteEducator(id: string): Promise<boolean> {
    try {
      await base("Educators").destroy(id);
      return true;
    } catch (error) {
      console.error(`Error deleting educator ${id} from Airtable:`, error);
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
      const records = await base("Schools").select().all();
      const schools = records.map(record => this.transformSchoolRecord(record));
      
      // Cache the results
      cache.set(cacheKey, schools);
      console.log('[Cache Miss] Schools - fetched from Airtable');
      
      return schools;
    } catch (error) {
      console.error("Error fetching schools from Airtable:", error);
      throw error;
    }
  }

  async getSchool(id: string): Promise<School | undefined> {
    try {
      const record = await base("Schools").find(id);
      return this.transformSchoolRecord(record);
    } catch (error) {
      console.error(`Error fetching school ${id} from Airtable:`, error);
      return undefined;
    }
  }

  async createSchool(school: InsertSchool): Promise<School> {
    try {
      const record = await base("Schools").create({
        "Name": school.name,
      });
      
      return this.transformSchoolRecord(record);
    } catch (error) {
      console.error("Error creating school in Airtable:", error);
      throw error;
    }
  }

  async updateSchool(id: string, school: Partial<InsertSchool>): Promise<School | undefined> {
    try {
      const updateFields: any = {};
      
      if (school.name !== undefined) updateFields["Name"] = school.name;

      const record = await base("Schools").update(id, updateFields);
      return this.transformSchoolRecord(record);
    } catch (error) {
      console.error(`Error updating school ${id} in Airtable:`, error);
      return undefined;
    }
  }

  async deleteSchool(id: string): Promise<boolean> {
    try {
      await base("Schools").destroy(id);
      return true;
    } catch (error) {
      console.error(`Error deleting school ${id} from Airtable:`, error);
      return false;
    }
  }

  // Educator-School Association operations (simplified)
  async getEducatorSchoolAssociations(): Promise<EducatorSchoolAssociation[]> {
    try {
      // Query the "Educators x Schools" table
      const records = await base("Educators x Schools").select().all();
      
      return records.map(record => {
        const educatorId = record.fields["educator_id"];
        const schoolId = record.fields["school_id"];
        const roles = record.fields["Roles"];
        const created = record.fields["Created"];
        
        return {
          id: record.id,
          educatorId: Array.isArray(educatorId) ? String(educatorId[0] || '') : String(educatorId || ''),
          schoolId: Array.isArray(schoolId) ? String(schoolId[0] || '') : String(schoolId || ''),
          role: roles ? [String(roles)] : [], // Changed to array to match interface
          startDate: '', // Not available in this table
          endDate: '', // Not available in this table
          isActive: true, // Assume active if record exists
          created: String(created || new Date().toISOString()),
          lastModified: String(created || new Date().toISOString()),
        };
      });
    } catch (error) {
      console.error('Error fetching educator school associations:', error);
      return [];
    }
  }

  async getEducatorAssociations(educatorId: string): Promise<EducatorSchoolAssociation[]> {
    const allAssociations = await this.getEducatorSchoolAssociations();
    return allAssociations.filter(assoc => assoc.educatorId === educatorId);
  }

  async getSchoolAssociations(schoolId: string): Promise<EducatorSchoolAssociation[]> {
    try {
      // Query the "Educators x Schools" table filtered by school_id field
      const records = await base("Educators x Schools").select({
        filterByFormula: `{school_id} = '${schoolId}'`
      }).all();
      
      return records.map(record => ({
        id: record.id,
        educatorId: Array.isArray(record.fields["educator_id"]) ? String(record.fields["educator_id"][0]) : String(record.fields["educator_id"] || ''),
        schoolId: Array.isArray(record.fields["school_id"]) ? String(record.fields["school_id"][0]) : String(record.fields["school_id"] || ''),
        role: record.fields["Roles"] ? [String(record.fields["Roles"])] : [], // Changed to array
        startDate: String(record.fields["Start Date"] || ''),
        endDate: String(record.fields["End Date"] || ''),
        isActive: record.fields["Currently Active"] === true || record.fields["Currently Active"] === "true",
        created: String(record.fields["Created"] || new Date().toISOString()),
        lastModified: String(record.fields["Created"] || new Date().toISOString()),
      }));
    } catch (error) {
      console.error(`Error fetching school associations for ${schoolId}:`, error);
      return [];
    }
  }

  async createEducatorSchoolAssociation(association: InsertEducatorSchoolAssociation): Promise<EducatorSchoolAssociation> {
    throw new Error("Not implemented");
  }

  async deleteEducatorSchoolAssociation(id: string): Promise<boolean> {
    return false;
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

  async deleteTeacherSchoolAssociation(id: string): Promise<boolean> {
    return this.deleteEducatorSchoolAssociation(id);
  }

  // Location operations (mock implementation for now)
  async getLocations(): Promise<Location[]> {
    // For now, return mock data based on schools
    const schools = await this.getSchools();
    return schools.map((school, index) => ({
      id: `loc_${school.id}`,
      schoolId: school.id,
      address: school.address,
      currentPhysicalAddress: false,
      currentMailingAddress: false,
      startDate: '2023-01-01',
      endDate: undefined,
      created: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    })).filter(location => location.address); // Only include if has address
  }

  async getLocation(id: string): Promise<Location | undefined> {
    const locations = await this.getLocations();
    return locations.find(location => location.id === id);
  }

  async getLocationsBySchoolId(schoolId: string): Promise<Location[]> {
    try {
      // Query the "Locations" table filtered by school_id
      const records = await base("Locations").select({
        filterByFormula: `{school_id} = '${schoolId}'`
      }).all();
      
      return records.map(record => {
        const schoolId = record.fields["school_id"];
        const address = record.fields["Address"];
        const currentPhysical = record.fields["Current physical address?"];
        const currentMailing = record.fields["Current mailing address?"];
        const startDate = record.fields["Start of time at location"];
        const endDate = record.fields["End of time at location"];
        const created = record.fields["Created"];
        const lastModified = record.fields["Last Modified"];
        
        return {
          id: record.id,
          schoolId: Array.isArray(schoolId) ? String(schoolId[0] || '') : String(schoolId || ''),
          address: String(address || ''),
          currentPhysicalAddress: Boolean(currentPhysical),
          currentMailingAddress: Boolean(currentMailing),
          startDate: String(startDate || ''),
          endDate: String(endDate || ''),
          created: String(created || new Date().toISOString()),
          lastModified: String(lastModified || new Date().toISOString()),
        };
      });
    } catch (error) {
      console.error(`Error fetching locations for ${schoolId}:`, error);
      // Fallback to using school's address if locations table doesn't exist
      try {
        const school = await this.getSchool(schoolId);
        if (school && school.address) {
          return [{
            id: `fallback_${schoolId}`,
            schoolId: schoolId,
            address: school.address,
            currentPhysicalAddress: false,
            currentMailingAddress: false,
            startDate: '',
            endDate: '',
            created: new Date().toISOString(),
            lastModified: new Date().toISOString(),
          }];
        }
      } catch (fallbackError) {
        console.error(`Fallback location fetch failed:`, fallbackError);
      }
      return [];
    }
  }

  async createLocation(location: InsertLocation): Promise<Location> {
    // Mock implementation - in reality this would create in Airtable
    const newLocation: Location = {
      id: `loc_${Date.now()}`,
      ...location,
      created: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };
    return newLocation;
  }

  async updateLocation(id: string, location: Partial<InsertLocation>): Promise<Location | undefined> {
    // Mock implementation - in reality this would update in Airtable
    const existing = await this.getLocation(id);
    if (!existing) return undefined;
    
    return {
      ...existing,
      ...location,
      lastModified: new Date().toISOString(),
    };
  }

  async deleteLocation(id: string): Promise<boolean> {
    // Mock implementation - in reality this would delete from Airtable
    return true;
  }

  // Guide assignment operations
  async getGuideAssignments(): Promise<GuideAssignment[]> {
    const schools = await this.getSchools();
    if (schools.length === 0) return [];
    
    return [
      {
        id: 'guide_1',
        schoolId: schools[0]?.id || 'mock_school_1',
        guideId: 'guide_math_001',
        guideShortName: 'Elementary Math',
        type: 'Academic',
        startDate: '2023-09-01',
        endDate: '2024-06-30',
        isActive: true,
        created: new Date().toISOString(),
        lastModified: new Date().toISOString(),
      },
      {
        id: 'guide_2',
        schoolId: schools[0]?.id || 'mock_school_1',
        guideId: 'guide_reading_002',
        guideShortName: 'Reading Fundamentals',
        type: 'Language Arts',
        startDate: '2023-09-01',
        endDate: undefined,
        isActive: true,
        created: new Date().toISOString(),
        lastModified: new Date().toISOString(),
      }
    ];
  }

  async getGuideAssignment(id: string): Promise<GuideAssignment | undefined> {
    const assignments = await this.getGuideAssignments();
    return assignments.find(assignment => assignment.id === id);
  }

  async getGuideAssignmentsBySchoolId(schoolId: string): Promise<GuideAssignment[]> {
    try {
      // Try to query the "Guides Assignments" table filtered by schoolId
      const records = await base("Guides Assignments").select({
        filterByFormula: `{schoolId} = '${schoolId}'`
      }).all();
      
      return records.map(record => {
        const schoolId = record.fields["school_id"];
        const guideId = record.fields["Guide ID"];
        const guideShortName = record.fields["Guide short name"];
        const type = record.fields["Type"];
        const startDate = record.fields["Start date"];
        const endDate = record.fields["End date"];
        const isActive = record.fields["Is active"];
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
    // Mock implementation - in reality this would create in Airtable
    const newAssignment: GuideAssignment = {
      id: `mock_guide_${Date.now()}`,
      schoolId: assignment.schoolId,
      guideId: assignment.guideId,
      guideShortName: assignment.guideShortName,
      type: assignment.type,
      startDate: assignment.startDate,
      endDate: assignment.endDate,
      isActive: assignment.isActive,
      created: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };
    return newAssignment;
  }

  async updateGuideAssignment(id: string, assignment: Partial<InsertGuideAssignment>): Promise<GuideAssignment | undefined> {
    // Mock implementation - in reality this would update in Airtable
    const existing = await this.getGuideAssignment(id);
    if (!existing) return undefined;
    
    return {
      ...existing,
      ...assignment,
      lastModified: new Date().toISOString(),
    };
  }

  async deleteGuideAssignment(id: string): Promise<boolean> {
    // Mock implementation - in reality this would delete from Airtable
    return true;
  }

  // Governance document operations
  async getGovernanceDocuments(): Promise<GovernanceDocument[]> {
    const schools = await this.getSchools();
    if (schools.length === 0) return [];
    
    return [
      {
        id: 'doc_1',
        schoolId: schools[0]?.id || 'mock_school_1',
        docType: 'Bylaws',
        doc: 'School Bylaws 2023.pdf',
        dateEntered: '2023-01-15',
        created: new Date().toISOString(),
        lastModified: new Date().toISOString(),
      },
      {
        id: 'doc_2',
        schoolId: schools[0]?.id || 'mock_school_1',
        docType: 'Policy',
        doc: 'Student Handbook.pdf',
        dateEntered: '2023-08-30',
        created: new Date().toISOString(),
        lastModified: new Date().toISOString(),
      }
    ];
  }

  async getGovernanceDocument(id: string): Promise<GovernanceDocument | undefined> {
    const documents = await this.getGovernanceDocuments();
    return documents.find(doc => doc.id === id);
  }

  async getGovernanceDocumentsBySchoolId(schoolId: string): Promise<GovernanceDocument[]> {
    try {
      // Try to query the "Governance docs" table filtered by schoolId
      const records = await base("Governance docs").select({
        filterByFormula: `{schoolId} = '${schoolId}'`
      }).all();
      
      return records.map(record => {
        const schoolId = record.fields["school_id"];
        const docType = record.fields["Document type"];
        const dateEntered = record.fields["Date"];
        const created = record.fields["Created"];
        
        // Handle Document PDF attachment field - extract filename 
        const documentPDFField = record.fields["Document PDF"];
        let doc = "";
        if (Array.isArray(documentPDFField) && documentPDFField.length > 0) {
          try {
            const attachment = documentPDFField[0];
            // Access filename property directly
            doc = attachment?.filename || "Document";
          } catch (e) {
            doc = "Document";
          }
        }
        
        return {
          id: record.id,
          schoolId: Array.isArray(schoolId) ? String(schoolId[0] || '') : String(schoolId || ''),
          docType: String(docType || ''),
          doc: String(doc),
          dateEntered: String(dateEntered || ''),
          created: String(created || new Date().toISOString()),
          lastModified: String(created || new Date().toISOString()),
        };
      });
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
    // Mock implementation - in reality this would create in Airtable
    const newDocument: GovernanceDocument = {
      id: `mock_doc_${Date.now()}`,
      schoolId: document.schoolId,
      docType: document.docType,
      doc: document.doc,
      dateEntered: document.dateEntered,
      created: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };
    return newDocument;
  }

  async updateGovernanceDocument(id: string, document: Partial<InsertGovernanceDocument>): Promise<GovernanceDocument | undefined> {
    // Mock implementation - in reality this would update in Airtable
    const existing = await this.getGovernanceDocument(id);
    if (!existing) return undefined;
    
    return {
      ...existing,
      ...document,
      lastModified: new Date().toISOString(),
    };
  }

  async deleteGovernanceDocument(id: string): Promise<boolean> {
    // Mock implementation - in reality this would delete from Airtable
    return true;
  }

  // School note operations
  async getSchoolNotes(): Promise<SchoolNote[]> {
    const schools = await this.getSchools();
    if (schools.length === 0) return [];
    
    return [
      {
        id: 'note_1',
        schoolId: schools[0]?.id || 'mock_school_1',
        dateCreated: '2024-01-15',
        createdBy: 'Jane Smith',
        notes: 'Initial school assessment completed. Strong community support noted.',
        lastModified: new Date().toISOString(),
      },
      {
        id: 'note_2',
        schoolId: schools[0]?.id || 'mock_school_1',
        dateCreated: '2024-03-20',
        createdBy: 'John Doe',
        notes: 'Follow-up meeting scheduled with board members. Need to review enrollment projections.',
        lastModified: new Date().toISOString(),
      }
    ];
  }

  async getSchoolNote(id: string): Promise<SchoolNote | undefined> {
    const notes = await this.getSchoolNotes();
    return notes.find(note => note.id === id);
  }

  async getSchoolNotesBySchoolId(schoolId: string): Promise<SchoolNote[]> {
    try {
      // Query the "Action steps" table filtered by schoolId
      const records = await base("Action steps").select({
        filterByFormula: `{schoolId} = '${schoolId}'`
      }).all();
      
      return records.map(record => {
        const schoolId = record.fields["school_id"];
        const assignedDate = record.fields["Assigned date"];
        const assignee = record.fields["Assignee Short Name"];
        const item = record.fields["Item"];
        const status = record.fields["Status"];
        const dueDate = record.fields["Due date"];
        
        return {
          id: record.id,
          schoolId: Array.isArray(schoolId) ? String(schoolId[0] || '') : String(schoolId || ''),
          dateCreated: String(assignedDate || ''),
          createdBy: String(assignee || ''),
          notes: String(item || ''),
          created: String(assignedDate || new Date().toISOString()),
          lastModified: String(dueDate || new Date().toISOString()),
        };
      });
    } catch (error) {
      console.error(`Error fetching school notes for ${schoolId}:`, error);
      return [];
    }
  }

  async createSchoolNote(note: InsertSchoolNote): Promise<SchoolNote> {
    // Mock implementation - in reality this would create in Airtable
    const newNote: SchoolNote = {
      id: `mock_note_${Date.now()}`,
      schoolId: note.schoolId,
      dateCreated: note.dateCreated,
      createdBy: note.createdBy,
      notes: note.notes,
      lastModified: new Date().toISOString(),
    };
    return newNote;
  }

  async updateSchoolNote(id: string, note: Partial<InsertSchoolNote>): Promise<SchoolNote | undefined> {
    // Mock implementation - in reality this would update in Airtable
    const existing = await this.getSchoolNote(id);
    if (!existing) return undefined;
    
    return {
      ...existing,
      ...note,
      lastModified: new Date().toISOString(),
    };
  }

  async deleteSchoolNote(id: string): Promise<boolean> {
    // Mock implementation - in reality this would delete from Airtable
    return true;
  }

  // Grant operations
  async getGrants(): Promise<Grant[]> {
    const schools = await this.getSchools();
    if (schools.length === 0) return [];
    
    return [
      {
        id: 'grant_1',
        schoolId: schools[0]?.id || 'mock_school_1',
        amount: 50000,
        issuedDate: '2023-07-01',
        status: 'Active',
        created: new Date().toISOString(),
        lastModified: new Date().toISOString(),
      },
      {
        id: 'grant_2',
        schoolId: schools[0]?.id || 'mock_school_1',
        amount: 25000,
        issuedDate: '2024-01-15',
        status: 'Pending',
        created: new Date().toISOString(),
        lastModified: new Date().toISOString(),
      }
    ];
  }

  async getGrant(id: string): Promise<Grant | undefined> {
    const grants = await this.getGrants();
    return grants.find(grant => grant.id === id);
  }

  async getGrantsBySchoolId(schoolId: string): Promise<Grant[]> {
    try {
      // Query the "Grants" table filtered by schoolId
      const records = await base("Grants").select({
        filterByFormula: `{schoolId} = '${schoolId}'`
      }).all();
      
      return records.map(record => {
        const schoolId = record.fields["school_id"];
        const amount = record.fields["Amount"];
        const issueDate = record.fields["Issue Date"];
        const status = record.fields["Grant Status"];
        const created = record.fields["Created"];
        const lastModified = record.fields["Last Modified"];
        
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
    // Mock implementation - in reality this would create in Airtable
    const newGrant: Grant = {
      id: `mock_grant_${Date.now()}`,
      schoolId: grant.schoolId,
      amount: grant.amount,
      issuedDate: grant.issuedDate,
      status: grant.status,
      created: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };
    return newGrant;
  }

  async updateGrant(id: string, grant: Partial<InsertGrant>): Promise<Grant | undefined> {
    // Mock implementation - in reality this would update in Airtable
    const existing = await this.getGrant(id);
    if (!existing) return undefined;
    
    return {
      ...existing,
      ...grant,
      lastModified: new Date().toISOString(),
    };
  }

  async deleteGrant(id: string): Promise<boolean> {
    // Mock implementation - in reality this would delete from Airtable
    return true;
  }

  // Loan operations
  async getLoans(): Promise<Loan[]> {
    const schools = await this.getSchools();
    if (schools.length === 0) return [];
    
    return [
      {
        id: 'loan_1',
        schoolId: schools[0]?.id || 'mock_school_1',
        amount: 100000,
        status: 'Active',
        interestRate: 3.5,
        created: new Date().toISOString(),
        lastModified: new Date().toISOString(),
      },
      {
        id: 'loan_2',
        schoolId: schools[0]?.id || 'mock_school_1',
        amount: 75000,
        status: 'Paid',
        interestRate: 2.8,
        created: new Date().toISOString(),
        lastModified: new Date().toISOString(),
      }
    ];
  }

  async getLoan(id: string): Promise<Loan | undefined> {
    const loans = await this.getLoans();
    return loans.find(loan => loan.id === id);
  }

  async getLoansBySchoolId(schoolId: string): Promise<Loan[]> {
    try {
      // Query the "Loans" table filtered by schoolId
      const records = await base("Loans").select({
        filterByFormula: `{schoolId} = '${schoolId}'`
      }).all();
      
      return records.map(record => {
        const schoolId = record.fields["school_id"];
        const amount = record.fields["Amount Issued"];
        const status = record.fields["Loan Status"];
        const issueDate = record.fields["Effective Issue Date"];
        const created = record.fields["Created"];
        const lastModified = record.fields["Last Modified"];
        
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
    // Mock implementation - in reality this would create in Airtable
    const newLoan: Loan = {
      id: `mock_loan_${Date.now()}`,
      schoolId: loan.schoolId,
      amount: loan.amount,
      status: loan.status,
      interestRate: loan.interestRate,
      created: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };
    return newLoan;
  }

  async updateLoan(id: string, loan: Partial<InsertLoan>): Promise<Loan | undefined> {
    // Mock implementation - in reality this would update in Airtable
    const existing = await this.getLoan(id);
    if (!existing) return undefined;
    
    return {
      ...existing,
      ...loan,
      lastModified: new Date().toISOString(),
    };
  }

  async deleteLoan(id: string): Promise<boolean> {
    // Mock implementation - in reality this would delete from Airtable
    return true;
  }

  // Email address operations
  async getEmailAddresses(): Promise<EmailAddress[]> {
    try {
      const records = await base('Email Addresses').select().all();
      return records.map(record => this.transformEmailAddressRecord(record));
    } catch (error) {
      console.warn('Warning: Unable to fetch Email Addresses table - table may not exist or may require permissions');
      return [];
    }
  }

  async getEmailAddress(id: string): Promise<EmailAddress | undefined> {
    try {
      const record = await base('Email Addresses').find(id);
      return this.transformEmailAddressRecord(record);
    } catch (error) {
      console.warn(`Warning: Unable to fetch email address ${id}:`, error);
      return undefined;
    }
  }

  async getEmailAddressesByEducatorId(educatorId: string): Promise<EmailAddress[]> {
    try {
      const records = await base('Email Addresses').select({
        filterByFormula: `{educator_id} = '${educatorId}'`
      }).all();
      
      return records.map(record => this.transformEmailAddressRecord(record));
    } catch (error) {
      console.warn(`Warning: Unable to fetch email addresses for educator ${educatorId}:`, error);
      return [];
    }
  }

  async createEmailAddress(emailAddress: InsertEmailAddress): Promise<EmailAddress> {
    const newEmailAddress: EmailAddress = {
      id: `temp_${Date.now()}`,
      educatorId: emailAddress.educatorId,
      email: emailAddress.email,
      type: emailAddress.type,
      isPrimary: emailAddress.isPrimary,
      status: emailAddress.status,
      notes: emailAddress.notes,
      created: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };

    // Mock implementation - in reality this would create in Airtable
    return newEmailAddress;
  }

  async updateEmailAddress(id: string, emailAddress: Partial<InsertEmailAddress>): Promise<EmailAddress | undefined> {
    // Mock implementation - in reality this would update in Airtable
    const existing = await this.getEmailAddress(id);
    if (!existing) return undefined;
    
    return {
      ...existing,
      ...emailAddress,
      lastModified: new Date().toISOString(),
    };
  }

  async deleteEmailAddress(id: string): Promise<boolean> {
    // Mock implementation - in reality this would delete from Airtable
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

  async createSSJFilloutForm(form: InsertSSJFilloutForm): Promise<SSJFilloutForm> {
    const newForm: SSJFilloutForm = {
      id: `ssj_${Date.now()}`,
      educatorId: form.educatorId,
      formName: form.formName,
      formType: form.formType,
      dateSubmitted: form.dateSubmitted,
      status: form.status,
      submissionId: form.submissionId,
      responseData: form.responseData,
      notes: form.notes,
      created: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };
    return newForm;
  }

  async updateSSJFilloutForm(id: string, form: Partial<InsertSSJFilloutForm>): Promise<SSJFilloutForm | undefined> {
    // Mock implementation - in reality this would update in Airtable
    const existing = await this.getSSJFilloutForm(id);
    if (!existing) return undefined;
    
    return {
      ...existing,
      ...form,
      lastModified: new Date().toISOString(),
    };
  }

  async deleteSSJFilloutForm(id: string): Promise<boolean> {
    // Mock implementation - in reality this would delete from Airtable
    return true;
  }

  private transformSSJFilloutFormRecord(record: any): SSJFilloutForm {
    const fields = record.fields;
    return {
      id: record.id,
      educatorId: Array.isArray(fields["educator_id"]) ? fields["educator_id"][0] : fields["educator_id"] || undefined,
      formName: fields["Form Name"] || undefined,
      formType: fields["Form Type"] || undefined,
      dateSubmitted: fields["Date Submitted"] || undefined,
      status: fields["Status"] || undefined,
      submissionId: fields["Submission ID"] || undefined,
      responseData: fields["Response Data"] || undefined,
      notes: fields["Notes"] || undefined,
      created: fields["Created"] || record.get('Created'),
      lastModified: fields["Last Modified"] || record.get('Last Modified'),
    };
  }

  private transformEmailAddressRecord(record: any): EmailAddress {
    const fields = record.fields;
    return {
      id: record.id,
      educatorId: Array.isArray(fields["educator_id"]) ? fields["educator_id"][0] : fields["educator_id"] || undefined,
      email: fields["Email"] || fields["Email Address"] || undefined,
      type: fields["Type"] || undefined,
      isPrimary: fields["Primary"] === true || fields["Is Primary"] === true,
      status: fields["Status"] || undefined,
      notes: fields["Notes"] || undefined,
      created: fields["Created"] || record.get('Created'),
      lastModified: fields["Last Modified"] || record.get('Last Modified'),
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
        filterByFormula: `{educator_id} = "${educatorId}"`
      }).all();
      return records.map(record => this.transformMontessoriCertificationRecord(record));
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
      educatorId: Array.isArray(fields["educator_id"]) ? fields["educator_id"][0] : fields["educator_id"] || undefined,
      certificationLevel: fields["Certification Level"] || undefined,
      expirationDate: fields["Expiration Date"] || undefined,
      notes: fields["Notes"] || undefined,
      created: fields["Created"] || record.get('Created'),
      lastModified: fields["Last Modified"] || record.get('Last Modified'),
    };
  }

  // Event Attendance implementation
  async getEventAttendances(): Promise<EventAttendance[]> {
    try {
      const table = base('Event attendance');
      const records = await table.select().all();
      return records.map(record => this.transformEventAttendanceRecord(record));
    } catch (error) {
      console.warn('Event attendance table not accessible:', error);
      return [];
    }
  }

  async getEventAttendance(id: string): Promise<EventAttendance | undefined> {
    try {
      const table = base('Event attendance');
      const record = await table.find(id);
      return this.transformEventAttendanceRecord(record);
    } catch (error) {
      console.warn('Event attendance record not found:', error);
      return undefined;
    }
  }

  async getEventAttendancesByEducatorId(educatorId: string): Promise<EventAttendance[]> {
    try {
      const table = base('Event attendance');
      const records = await table.select({
        filterByFormula: `{educator_id} = "${educatorId}"`
      }).all();
      return records.map(record => this.transformEventAttendanceRecord(record));
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
      eventType: attendance.eventType,
      attendanceStatus: attendance.attendanceStatus,
      notes: attendance.notes,
      created: new Date().toISOString(),
      lastModified: new Date().toISOString(),
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
      educatorId: Array.isArray(fields["educator_id"]) ? fields["educator_id"][0] : fields["educator_id"] || undefined,
      eventName: fields["Event Name"] || fields["Event"] || undefined,
      eventDate: fields["Event Date"] || fields["Date"] || undefined,
      eventType: fields["Event Type"] || fields["Type"] || undefined,
      attendanceStatus: fields["Attendance Status"] || fields["Status"] || undefined,
      notes: fields["Notes"] || undefined,
      created: fields["Created"] || record.get('Created'),
      lastModified: fields["Last Modified"] || record.get('Last Modified'),
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
        filterByFormula: `{educator_id} = "${educatorId}"`
      }).all();
      return records.map(record => this.transformEducatorNoteRecord(record));
    } catch (error) {
      console.warn('Error fetching Educator Notes by educator ID:', error);
      return [];
    }
  }

  async createEducatorNote(note: InsertEducatorNote): Promise<EducatorNote> {
    const newNote: EducatorNote = {
      id: `note_${Date.now()}`,
      educatorId: note.educatorId || '',
      dateCreated: note.dateCreated || new Date().toISOString(),
      createdBy: note.createdBy,
      notes: note.notes,
      category: note.category,
      priority: note.priority,
      created: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };
    return newNote;
  }

  async updateEducatorNote(id: string, note: Partial<InsertEducatorNote>): Promise<EducatorNote | undefined> {
    const existing = await this.getEducatorNote(id);
    if (!existing) return undefined;
    
    return {
      ...existing,
      ...note,
      lastModified: new Date().toISOString(),
    };
  }

  async deleteEducatorNote(id: string): Promise<boolean> {
    return true;
  }

  private transformEducatorNoteRecord(record: any): EducatorNote {
    const fields = record.fields;
    return {
      id: record.id,
      educatorId: Array.isArray(fields["educator_id"]) ? fields["educator_id"][0] : fields["educator_id"] || undefined,
      dateCreated: fields["Date Created"] || fields["Date"] || undefined,
      createdBy: fields["Created By"] || fields["Author"] || undefined,
      notes: fields["Notes"] || fields["Note"] || undefined,
      category: fields["Category"] || undefined,
      priority: fields["Priority"] || undefined,
      created: fields["Created"] || record.get('Created'),
      lastModified: fields["Last Modified"] || record.get('Last Modified'),
    };
  }

  // Missing membership fee methods - stub implementations
  async getMembershipFeesByYear(): Promise<MembershipFeeByYear[]> {
    try {
      const base = Airtable.base(this.airtableBaseId);
      const table = base('Membership Fee by Year');
      const records = await table.select().all();
      return records.map(record => this.transformMembershipFeeByYearRecord(record));
    } catch (error) {
      console.warn('Membership Fee by Year table not accessible:', error);
      return [];
    }
  }

  async getMembershipFeeByYear(id: string): Promise<MembershipFeeByYear | undefined> {
    return undefined;
  }

  async getMembershipFeesBySchoolId(schoolId: string): Promise<MembershipFeeByYear[]> {
    return [];
  }

  async createMembershipFeeByYear(fee: InsertMembershipFeeByYear): Promise<MembershipFeeByYear> {
    throw new Error('Not implemented');
  }

  async updateMembershipFeeByYear(id: string, fee: Partial<InsertMembershipFeeByYear>): Promise<MembershipFeeByYear | undefined> {
    return undefined;
  }

  async deleteMembershipFeeByYear(id: string): Promise<boolean> {
    return false;
  }

  private transformMembershipFeeByYearRecord(record: any): MembershipFeeByYear {
    const fields = record.fields;
    return {
      id: record.id,
      schoolId: Array.isArray(fields["school_id"]) ? fields["school_id"][0] : fields["school_id"] || undefined,
      schoolYear: fields["School Year"] || undefined,
      notes: fields["Notes"] || undefined,
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
      const table = base('Membership Fee Updates');
      const records = await table.select({
        filterByFormula: `{school_id} = "${schoolId}"`
      }).all();
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
        filterByFormula: `AND({school_id} = "${schoolId}", {School Year} = "${schoolYear}")`
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
      schoolId: Array.isArray(fields["school_id"]) ? fields["school_id"][0] : fields["school_id"] || undefined,
      schoolYear: fields["School Year"] || undefined,
      updateDate: fields["Update Date"] || undefined,
      updateType: fields["Update Type"] || undefined,
      previousValue: fields["Previous Value"] || undefined,
      newValue: fields["New Value"] || undefined,
      updatedBy: fields["Updated By"] || undefined,
      notes: fields["Notes"] || undefined,
    };
  }
}

export const storage = new SimpleAirtableStorage();