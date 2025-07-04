import { base } from "./airtable-schema";
import type { 
  Educator, 
  School, 
  EducatorSchoolAssociation, 
  Location,
  GuideAssignment,
  GovernanceDocument,
  InsertEducator, 
  InsertSchool, 
  InsertEducatorSchoolAssociation,
  InsertLocation,
  InsertGuideAssignment,
  InsertGovernanceDocument,
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
    return [];
  }

  async getEducatorAssociations(educatorId: string): Promise<EducatorSchoolAssociation[]> {
    return [];
  }

  async getSchoolAssociations(schoolId: string): Promise<EducatorSchoolAssociation[]> {
    return [];
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
    const locations = await this.getLocations();
    return locations.filter(location => location.schoolId === schoolId);
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
    // Mock implementation - return empty array for now
    return [];
  }

  async getGuideAssignment(id: string): Promise<GuideAssignment | undefined> {
    // Mock implementation - return undefined for now
    return undefined;
  }

  async getGuideAssignmentsBySchoolId(schoolId: string): Promise<GuideAssignment[]> {
    // Mock implementation - return empty array for now
    // In reality this would query an Airtable "Guide Assignments" table filtered by school
    return [];
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
    // Mock implementation - return empty array for now
    return [];
  }

  async getGovernanceDocument(id: string): Promise<GovernanceDocument | undefined> {
    // Mock implementation - return undefined for now
    return undefined;
  }

  async getGovernanceDocumentsBySchoolId(schoolId: string): Promise<GovernanceDocument[]> {
    // Mock implementation - return empty array for now
    // In reality this would query an Airtable "Governance Documents" table filtered by school
    return [];
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
}

export const storage = new SimpleAirtableStorage();