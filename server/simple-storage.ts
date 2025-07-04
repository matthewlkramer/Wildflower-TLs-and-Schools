import { base } from "./airtable-schema";
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
  InsertEducator, 
  InsertSchool, 
  InsertEducatorSchoolAssociation,
  InsertLocation,
  InsertGuideAssignment,
  InsertGovernanceDocument,
  InsertSchoolNote,
  InsertGrant,
  InsertLoan,
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
      lastName: fields["Last Name"] || undefined,
      middleName: fields["Middle Name"] || undefined,
      nickname: fields["Nickname"] || undefined,
      primaryPhone: fields["Primary phone"] || undefined,
      secondaryPhone: fields["Secondary phone"] || undefined,
      homeAddress: fields["Home Address"] || undefined,
      pronouns: fields["Pronouns"] || undefined,
      gender: fields["Gender"] || undefined,
      raceEthnicity: fields["Race & Ethnicity"] || undefined,
      primaryLanguage: fields["Primary Language"] || undefined,
      otherLanguages: fields["Other languages"] || undefined,
      educationalAttainment: fields["Educational Attainment"] || undefined,
      montessoriCertified: fields["Montessori Certified"] || false,
      certificationLevels: fields["Certification Levels (from Montessori Certifications)"] || undefined,
      certifier: fields["Certifier (from Montessori Certifications)"] || undefined,
      montessoriLeadGuideTrainings: fields["Montessori lead guide trainings"] || undefined,
      currentRole: fields["Current Role"] || undefined,
      discoveryStatus: fields["Discovery status"] || undefined,
      assignedPartner: fields["Assigned Partner"] || undefined,
      assignedPartnerEmail: fields["Assigned Partner Email"] || undefined,
      householdIncome: fields["Household Income"] || undefined,
      incomeBackground: fields["Income Background"] || undefined,
      individualType: fields["Individual Type"] || undefined,
      onboardingExperience: fields["Onboarding Experience"] || undefined,
      currentlyActiveAtSchool: fields["Currently Active at a School?"] ? fields["Currently Active at a School?"][0] === "Yes" : undefined,
      allSchools: fields["All Schools"] || undefined,
      currentlyActiveSchool: fields["Currently Active School"] || undefined,
      schoolStatuses: fields["School Statuses"] || undefined,
      startupStageForActiveSchool: fields["Stage_Status for Active School"] || 
                                   fields["stage_status for active school"] ||
                                   fields["Startup Stage for Active School"] || 
                                   fields["Stage Status for Active School"] ||
                                   undefined,
      targetCity: fields["Target city"] || undefined,
      firstContactWFSchoolEmploymentStatus: fields["First contact - WF School employment status"] || undefined,
      firstContactNotesOnPreWildflowerEmployment: fields["First contact - Notes on pre-Wildflower employment"] || undefined,
      firstContactInitialInterestInGovernanceModel: fields["First contact - Initial Interest in Governance Model"] || undefined,
      activeHolaspirit: fields["Active Holaspirit"] || false,
      holaspiritMemberID: fields["Holaspirit memberID"] || undefined,
      tcUserID: fields["TC User ID"] || undefined,
      alsoAPartner: fields["Also a partner"] || false,
      onSchoolBoard: fields["On school board"] || undefined,
      everATLInAnOpenSchool: fields["Ever a TL in an open school"] || false,
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
      fullName: fields["Full Name"] || undefined,
      logo: fields["Logo"]?.[0]?.url || undefined,
      address: fields["Address"] || undefined,
      city: fields["City"] || undefined,
      state: fields["State"] || undefined,
      zipCode: fields["ZIP Code"] || fields["Zip Code"] || undefined,
      targetCommunity: fields["Target community"] || undefined,
      phone: fields["Phone"] || undefined,
      email: fields["Email"] || undefined,
      website: fields["Website"] || undefined,
      grades: fields["Grades"] || undefined,
      agesServed: fields["Ages served"] || undefined,
      schoolType: fields["School Type"] || fields["Type"] || undefined,
      governanceModel: fields["Governance Model"] || undefined,
      status: fields["Stage_Status"] || 
              fields["Status"] || 
              fields["Stage/Status"] || 
              fields["Stage"] || 
              fields["School Status"] ||
              fields["Stage Status"] ||
              undefined,
      openDate: fields["Open Date"] || undefined,
      targetOpenDate: fields["Target Open Date"] || undefined,
      enrollmentCap: fields["Enrollment Cap"] || undefined,
      currentEnrollment: fields["Current Enrollment"] || undefined,
      tuitionRange: fields["Tuition Range"] || undefined,
      membershipFeeStatus: fields["Membership Fee Status"] || undefined,
      membershipFeeAmount: fields["Membership Fee Amount"] || undefined,
      publicFunding: fields["Public Funding"] || false,
      charterStatus: fields["Charter Status"] || undefined,
      authorizer: fields["Authorizer"] || undefined,
      demographics: fields["Demographics"] || undefined,
      assessmentData: fields["Assessment Data"] || undefined,
      latitude: fields["Latitude"] || undefined,
      longitude: fields["Longitude"] || undefined,
      timezone: fields["Timezone"] || undefined,
      created: fields["Created"] || undefined,
      lastModified: fields["Last Modified"] || undefined,
      createdBy: fields["Created By"]?.name || undefined,
      // Try different possible field names for Current TLs
      currentTLs: fields["Current TLs"] || 
                  fields["Current TL"] || 
                  fields["Current Teacher Leaders"] ||
                  fields["Teacher Leaders"] ||
                  fields["TLs"] ||
                  undefined,
    };
  }

  // Educator operations
  async getEducators(): Promise<Educator[]> {
    try {
      const records = await base("Educators").select().all();
      return records.map(record => this.transformEducatorRecord(record));
    } catch (error) {
      console.error("Error fetching educators from Airtable:", error);
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
        "Last Name": educator.lastName,
        "Full Name": educator.fullName,
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
    try {
      const records = await base("Schools").select().all();
      return records.map(record => this.transformSchoolRecord(record));
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
    // Return mock associations data
    const educators = await this.getEducators();
    const schools = await this.getSchools();
    
    if (educators.length === 0 || schools.length === 0) return [];
    
    // Create some sample associations
    return [
      {
        id: 'assoc_1',
        educatorId: educators[0]?.id || 'mock_educator_1',
        schoolId: schools[0]?.id || 'mock_school_1',
        role: 'Lead Teacher',
        startDate: '2023-01-01',
        endDate: undefined,
        isActive: true,
        created: new Date().toISOString(),
        lastModified: new Date().toISOString(),
      },
      {
        id: 'assoc_2',
        educatorId: educators[1]?.id || 'mock_educator_2',
        schoolId: schools[0]?.id || 'mock_school_1',
        role: 'Assistant Teacher',
        startDate: '2023-03-01',
        endDate: '2024-06-30',
        isActive: false,
        created: new Date().toISOString(),
        lastModified: new Date().toISOString(),
      }
    ];
  }

  async getEducatorAssociations(educatorId: string): Promise<EducatorSchoolAssociation[]> {
    const allAssociations = await this.getEducatorSchoolAssociations();
    return allAssociations.filter(assoc => assoc.educatorId === educatorId);
  }

  async getSchoolAssociations(schoolId: string): Promise<EducatorSchoolAssociation[]> {
    try {
      // Query the "Educators x Schools" table filtered by school
      const records = await base("Educators x Schools").select({
        filterByFormula: `{School} = '${schoolId}'`
      }).all();
      
      return records.map(record => ({
        id: record.id,
        educatorId: Array.isArray(record.fields["Educator"]) ? String(record.fields["Educator"][0]) : String(record.fields["Educator"] || ''),
        schoolId: Array.isArray(record.fields["School"]) ? String(record.fields["School"][0]) : String(record.fields["School"] || ''),
        role: String(record.fields["Role"] || ''),
        startDate: String(record.fields["Start date"] || ''),
        endDate: String(record.fields["End date"] || ''),
        isActive: record.fields["Status"] === 'Active',
        created: String(record.fields["Created"] || new Date().toISOString()),
        lastModified: String(record.fields["Last Modified"] || new Date().toISOString()),
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
      currentPhysicalAddress: school.address,
      currentMailingAddress: school.address,
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
      // Query the "Locations" table filtered by school
      const records = await base("Locations").select({
        filterByFormula: `{School} = '${schoolId}'`
      }).all();
      
      return records.map(record => {
        const school = record.fields["School"];
        const address = record.fields["Address"];
        const currentPhysicalAddress = record.fields["Current physical address"];
        const currentMailingAddress = record.fields["Current mailing address"];
        const startDate = record.fields["Start date"];
        const endDate = record.fields["End date"];
        const created = record.fields["Created"];
        const lastModified = record.fields["Last Modified"];
        
        return {
          id: record.id,
          schoolId: Array.isArray(school) ? String(school[0] || '') : String(school || ''),
          address: String(address || ''),
          currentPhysicalAddress: String(currentPhysicalAddress || ''),
          currentMailingAddress: String(currentMailingAddress || ''),
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
            currentPhysicalAddress: school.address,
            currentMailingAddress: school.address,
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
      // Query the "Guide assignments" table filtered by school
      const records = await base("Guide assignments").select({
        filterByFormula: `{School} = '${schoolId}'`
      }).all();
      
      return records.map(record => {
        const school = record.fields["School"];
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
          schoolId: Array.isArray(school) ? String(school[0] || '') : String(school || ''),
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
    } catch (error) {
      console.error(`Error fetching guide assignments for ${schoolId}:`, error);
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
      // Query the "Governance documents" table filtered by school
      // Note: This table might not be accessible or might not exist
      const records = await base("Governance documents").select({
        filterByFormula: `{School} = '${schoolId}'`
      }).all();
      
      return records.map(record => {
        const schoolId = record.fields["School"];
        const docType = record.fields["Doc type"];
        const doc = record.fields["Doc"];
        const dateEntered = record.fields["Date entered"];
        const created = record.fields["Created"];
        const lastModified = record.fields["Last Modified"];
        
        return {
          id: record.id,
          schoolId: Array.isArray(schoolId) ? String(schoolId[0] || '') : String(schoolId || ''),
          docType: String(docType || ''),
          doc: String(doc || ''),
          dateEntered: String(dateEntered || ''),
          created: String(created || new Date().toISOString()),
          lastModified: String(lastModified || new Date().toISOString()),
        };
      });
    } catch (error) {
      console.error(`Error fetching governance documents for ${schoolId}:`, error);
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
        created: new Date().toISOString(),
        lastModified: new Date().toISOString(),
      },
      {
        id: 'note_2',
        schoolId: schools[0]?.id || 'mock_school_1',
        dateCreated: '2024-03-20',
        createdBy: 'John Doe',
        notes: 'Follow-up meeting scheduled with board members. Need to review enrollment projections.',
        created: new Date().toISOString(),
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
      // Query the "Action steps" table filtered by school
      const records = await base("Action steps").select({
        filterByFormula: `{School} = '${schoolId}'`
      }).all();
      
      return records.map(record => {
        const school = record.fields["School"];
        const dateCreated = record.fields["Date created"];
        const createdBy = record.fields["Created by"];
        const notes = record.fields["Notes"];
        const created = record.fields["Created"];
        const lastModified = record.fields["Last Modified"];
        
        return {
          id: record.id,
          schoolId: Array.isArray(school) ? String(school[0] || '') : String(school || ''),
          dateCreated: String(dateCreated || ''),
          createdBy: String(createdBy || ''),
          notes: String(notes || ''),
          created: String(created || new Date().toISOString()),
          lastModified: String(lastModified || new Date().toISOString()),
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
      created: new Date().toISOString(),
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
        issuedBy: 'Education Foundation',
        status: 'Active',
        created: new Date().toISOString(),
        lastModified: new Date().toISOString(),
      },
      {
        id: 'grant_2',
        schoolId: schools[0]?.id || 'mock_school_1',
        amount: 25000,
        issuedDate: '2024-01-15',
        issuedBy: 'Local Community Fund',
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
      // Query the "Grants" table filtered by school
      const records = await base("Grants").select({
        filterByFormula: `{School} = '${schoolId}'`
      }).all();
      
      return records.map(record => {
        const school = record.fields["School"];
        const amount = record.fields["Amount"];
        const issuedDate = record.fields["Issued date"];
        const issuedBy = record.fields["Issued by"];
        const status = record.fields["Status"];
        const created = record.fields["Created"];
        const lastModified = record.fields["Last Modified"];
        
        return {
          id: record.id,
          schoolId: Array.isArray(school) ? String(school[0] || '') : String(school || ''),
          amount: Number(amount || 0),
          issuedDate: String(issuedDate || ''),
          issuedBy: String(issuedBy || ''),
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
      issuedBy: grant.issuedBy,
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
      // Query the "Loans" table filtered by school
      const records = await base("Loans").select({
        filterByFormula: `{School} = '${schoolId}'`
      }).all();
      
      return records.map(record => {
        const school = record.fields["School"];
        const amount = record.fields["Amount"];
        const status = record.fields["Status"];
        const interestRate = record.fields["Interest rate"];
        const created = record.fields["Created"];
        const lastModified = record.fields["Last Modified"];
        
        return {
          id: record.id,
          schoolId: Array.isArray(school) ? String(school[0] || '') : String(school || ''),
          amount: Number(amount || 0),
          status: String(status || ''),
          interestRate: Number(interestRate || 0),
          created: String(created || new Date().toISOString()),
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
}

export const storage = new SimpleAirtableStorage();