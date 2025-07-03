import { 
  teachers, 
  schools, 
  teacherSchoolAssociations,
  type Teacher, 
  type School,
  type TeacherSchoolAssociation,
  type InsertTeacher, 
  type InsertSchool,
  type InsertTeacherSchoolAssociation
} from "@shared/schema";

export interface IStorage {
  // Teacher operations
  getTeachers(): Promise<Teacher[]>;
  getTeacher(id: number): Promise<Teacher | undefined>;
  getTeacherByEmail(email: string): Promise<Teacher | undefined>;
  createTeacher(teacher: InsertTeacher): Promise<Teacher>;
  updateTeacher(id: number, teacher: Partial<InsertTeacher>): Promise<Teacher | undefined>;
  deleteTeacher(id: number): Promise<boolean>;
  
  // School operations
  getSchools(): Promise<School[]>;
  getSchool(id: number): Promise<School | undefined>;
  createSchool(school: InsertSchool): Promise<School>;
  updateSchool(id: number, school: Partial<InsertSchool>): Promise<School | undefined>;
  deleteSchool(id: number): Promise<boolean>;
  
  // Teacher-School Association operations
  getTeacherSchoolAssociations(): Promise<TeacherSchoolAssociation[]>;
  getTeacherAssociations(teacherId: number): Promise<TeacherSchoolAssociation[]>;
  getSchoolAssociations(schoolId: number): Promise<TeacherSchoolAssociation[]>;
  createTeacherSchoolAssociation(association: InsertTeacherSchoolAssociation): Promise<TeacherSchoolAssociation>;
  deleteTeacherSchoolAssociation(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private teachers: Map<number, Teacher>;
  private schools: Map<number, School>;
  private teacherSchoolAssociations: Map<number, TeacherSchoolAssociation>;
  private currentTeacherId: number;
  private currentSchoolId: number;
  private currentAssociationId: number;

  constructor() {
    this.teachers = new Map();
    this.schools = new Map();
    this.teacherSchoolAssociations = new Map();
    this.currentTeacherId = 1;
    this.currentSchoolId = 1;
    this.currentAssociationId = 1;
    
    // Initialize with sample data
    this.initializeData();
  }

  private initializeData() {
    // Sample schools
    const sampleSchools: InsertSchool[] = [
      {
        name: "Cambridge School",
        address: "123 Main Street",
        city: "Cambridge",
        state: "MA",
        zipCode: "02138",
        type: "Elementary",
        established: 2015,
        status: "Active",
        phone: "(555) 123-4567",
        email: "info@cambridge.wildflower.org"
      },
      {
        name: "Boston Branch",
        address: "456 Oak Avenue",
        city: "Boston",
        state: "MA",
        zipCode: "02101",
        type: "Middle School",
        established: 2018,
        status: "Active",
        phone: "(555) 234-5678",
        email: "info@boston.wildflower.org"
      },
      {
        name: "Newton Campus",
        address: "789 Elm Street",
        city: "Newton",
        state: "MA",
        zipCode: "02459",
        type: "Elementary",
        established: 2020,
        status: "Active",
        phone: "(555) 345-6789",
        email: "info@newton.wildflower.org"
      }
    ];

    // Sample teachers
    const sampleTeachers: InsertTeacher[] = [
      {
        name: "Jane Smith",
        email: "jane.smith@wildflower.org",
        phone: "(555) 123-4567",
        department: "Mathematics",
        subject: "Mathematics",
        status: "Active",
        startDate: "2020-08-15",
        education: "M.Ed. Harvard University",
        certifications: "Elementary Mathematics, Special Education",
        experience: 10,
        emergencyContact: "John Smith (555) 987-6543",
        biography: "Jane Smith is a dedicated mathematics teacher with over 10 years of experience in elementary education. She specializes in making complex mathematical concepts accessible to young learners through innovative teaching methods."
      },
      {
        name: "Michael Davis",
        email: "michael.davis@wildflower.org",
        phone: "(555) 234-5678",
        department: "Science",
        subject: "Science",
        status: "Active",
        startDate: "2019-01-10",
        education: "B.S. Biology, M.Ed. Education",
        certifications: "Science Education, Laboratory Safety",
        experience: 8,
        emergencyContact: "Sarah Davis (555) 876-5432",
        biography: "Michael Davis brings enthusiasm and hands-on learning to science education."
      },
      {
        name: "Lisa Wilson",
        email: "lisa.wilson@wildflower.org",
        phone: "(555) 345-6789",
        department: "Arts",
        subject: "Art & Music",
        status: "On Leave",
        startDate: "2021-03-20",
        education: "B.F.A. Art Education",
        certifications: "Art Education, Music Theory",
        experience: 5,
        emergencyContact: "Robert Wilson (555) 765-4321",
        biography: "Lisa Wilson is passionate about fostering creativity in students through art and music."
      }
    ];

    // Create schools
    sampleSchools.forEach(school => {
      this.createSchool(school);
    });

    // Create teachers
    sampleTeachers.forEach(teacher => {
      this.createTeacher(teacher);
    });

    // Create associations
    this.createTeacherSchoolAssociation({
      teacherId: 1,
      schoolId: 1,
      role: "Primary",
      startDate: "2020-08-15",
      endDate: null,
      isPrimary: true
    });

    this.createTeacherSchoolAssociation({
      teacherId: 2,
      schoolId: 2,
      role: "Primary",
      startDate: "2019-01-10",
      endDate: null,
      isPrimary: true
    });

    this.createTeacherSchoolAssociation({
      teacherId: 3,
      schoolId: 3,
      role: "Primary",
      startDate: "2021-03-20",
      endDate: null,
      isPrimary: true
    });
  }

  // Teacher operations
  async getTeachers(): Promise<Teacher[]> {
    return Array.from(this.teachers.values());
  }

  async getTeacher(id: number): Promise<Teacher | undefined> {
    return this.teachers.get(id);
  }

  async getTeacherByEmail(email: string): Promise<Teacher | undefined> {
    return Array.from(this.teachers.values()).find(teacher => teacher.email === email);
  }

  async createTeacher(insertTeacher: InsertTeacher): Promise<Teacher> {
    const id = this.currentTeacherId++;
    const teacher: Teacher = { ...insertTeacher, id };
    this.teachers.set(id, teacher);
    return teacher;
  }

  async updateTeacher(id: number, updateData: Partial<InsertTeacher>): Promise<Teacher | undefined> {
    const teacher = this.teachers.get(id);
    if (!teacher) return undefined;
    
    const updatedTeacher = { ...teacher, ...updateData };
    this.teachers.set(id, updatedTeacher);
    return updatedTeacher;
  }

  async deleteTeacher(id: number): Promise<boolean> {
    return this.teachers.delete(id);
  }

  // School operations
  async getSchools(): Promise<School[]> {
    return Array.from(this.schools.values());
  }

  async getSchool(id: number): Promise<School | undefined> {
    return this.schools.get(id);
  }

  async createSchool(insertSchool: InsertSchool): Promise<School> {
    const id = this.currentSchoolId++;
    const school: School = { ...insertSchool, id };
    this.schools.set(id, school);
    return school;
  }

  async updateSchool(id: number, updateData: Partial<InsertSchool>): Promise<School | undefined> {
    const school = this.schools.get(id);
    if (!school) return undefined;
    
    const updatedSchool = { ...school, ...updateData };
    this.schools.set(id, updatedSchool);
    return updatedSchool;
  }

  async deleteSchool(id: number): Promise<boolean> {
    return this.schools.delete(id);
  }

  // Teacher-School Association operations
  async getTeacherSchoolAssociations(): Promise<TeacherSchoolAssociation[]> {
    return Array.from(this.teacherSchoolAssociations.values());
  }

  async getTeacherAssociations(teacherId: number): Promise<TeacherSchoolAssociation[]> {
    return Array.from(this.teacherSchoolAssociations.values()).filter(
      association => association.teacherId === teacherId
    );
  }

  async getSchoolAssociations(schoolId: number): Promise<TeacherSchoolAssociation[]> {
    return Array.from(this.teacherSchoolAssociations.values()).filter(
      association => association.schoolId === schoolId
    );
  }

  async createTeacherSchoolAssociation(insertAssociation: InsertTeacherSchoolAssociation): Promise<TeacherSchoolAssociation> {
    const id = this.currentAssociationId++;
    const association: TeacherSchoolAssociation = { ...insertAssociation, id };
    this.teacherSchoolAssociations.set(id, association);
    return association;
  }

  async deleteTeacherSchoolAssociation(id: number): Promise<boolean> {
    return this.teacherSchoolAssociations.delete(id);
  }
}

export const storage = new MemStorage();
