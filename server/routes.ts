import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./simple-storage";
import { cache } from "./cache";
import { educatorSchema, schoolSchema, educatorSchoolAssociationSchema, locationSchema, guideAssignmentSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Educator routes (primary)
  app.get("/api/educators", async (req, res) => {
    try {
      const educators = await storage.getEducators();
      res.json(educators);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch educators" });
    }
  });

  app.get("/api/educators/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const educator = await storage.getEducator(id);
      if (!educator) {
        return res.status(404).json({ message: "Educator not found" });
      }
      res.json(educator);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch educator" });
    }
  });

  app.post("/api/educators", async (req, res) => {
    try {
      const educatorData = educatorSchema.parse(req.body);
      const educator = await storage.createEducator(educatorData);
      res.status(201).json(educator);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid educator data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create educator" });
    }
  });

  app.put("/api/educators/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const educatorData = educatorSchema.partial().parse(req.body);
      const educator = await storage.updateEducator(id, educatorData);
      if (!educator) {
        return res.status(404).json({ message: "Educator not found" });
      }
      res.json(educator);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid educator data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update educator" });
    }
  });

  app.delete("/api/educators/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const deleted = await storage.deleteEducator(id);
      if (!deleted) {
        return res.status(404).json({ message: "Educator not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete educator" });
    }
  });

  // Teacher routes (legacy compatibility)
  app.get("/api/teachers", async (req, res) => {
    try {
      const teachers = await storage.getTeachers();
      res.json(teachers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch teachers" });
    }
  });

  app.get("/api/teachers/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const teacher = await storage.getTeacher(id);
      if (!teacher) {
        return res.status(404).json({ message: "Teacher not found" });
      }
      res.json(teacher);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch teacher" });
    }
  });

  app.post("/api/teachers", async (req, res) => {
    try {
      const teacherData = educatorSchema.parse(req.body);
      const teacher = await storage.createTeacher(teacherData);
      res.status(201).json(teacher);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid teacher data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create teacher" });
    }
  });

  app.put("/api/teachers/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const teacherData = educatorSchema.partial().parse(req.body);
      const teacher = await storage.updateTeacher(id, teacherData);
      if (!teacher) {
        return res.status(404).json({ message: "Teacher not found" });
      }
      res.json(teacher);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid teacher data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update teacher" });
    }
  });

  app.delete("/api/teachers/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const success = await storage.deleteTeacher(id);
      if (!success) {
        return res.status(404).json({ message: "Teacher not found" });
      }
      res.json({ message: "Teacher deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete teacher" });
    }
  });

  // School routes
  app.get("/api/schools", async (req, res) => {
    try {
      const schools = await storage.getSchools();
      res.json(schools);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch schools" });
    }
  });

  app.get("/api/schools/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const school = await storage.getSchool(id);
      if (!school) {
        return res.status(404).json({ message: "School not found" });
      }
      res.json(school);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch school" });
    }
  });

  app.post("/api/schools", async (req, res) => {
    try {
      const schoolData = schoolSchema.parse(req.body);
      const school = await storage.createSchool(schoolData);
      res.status(201).json(school);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid school data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create school" });
    }
  });

  app.put("/api/schools/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const schoolData = schoolSchema.partial().parse(req.body);
      const school = await storage.updateSchool(id, schoolData);
      if (!school) {
        return res.status(404).json({ message: "School not found" });
      }
      res.json(school);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid school data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update school" });
    }
  });

  app.delete("/api/schools/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const success = await storage.deleteSchool(id);
      if (!success) {
        return res.status(404).json({ message: "School not found" });
      }
      res.json({ message: "School deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete school" });
    }
  });

  // Teacher-School Association routes
  app.get("/api/teacher-associations/:teacherId", async (req, res) => {
    try {
      const teacherId = req.params.teacherId;
      const associations = await storage.getTeacherAssociations(teacherId);
      res.json(associations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch teacher associations" });
    }
  });

  app.get("/api/school-associations/:schoolId", async (req, res) => {
    try {
      const schoolId = req.params.schoolId;
      const associations = await storage.getSchoolAssociations(schoolId);
      res.json(associations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch school associations" });
    }
  });

  app.get("/api/educator-school-associations", async (req, res) => {
    try {
      const associations = await storage.getEducatorSchoolAssociations();
      res.json(associations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch educator school associations" });
    }
  });

  app.get("/api/educator-school-associations/educator/:educatorId", async (req, res) => {
    try {
      const educatorId = req.params.educatorId;
      const associations = await storage.getEducatorAssociations(educatorId);
      res.json(associations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch educator associations" });
    }
  });

  app.post("/api/teacher-school-associations", async (req, res) => {
    try {
      const associationData = educatorSchoolAssociationSchema.parse(req.body);
      const association = await storage.createTeacherSchoolAssociation(associationData);
      res.status(201).json(association);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid association data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create association" });
    }
  });

  app.delete("/api/teacher-school-associations/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const success = await storage.deleteTeacherSchoolAssociation(id);
      if (!success) {
        return res.status(404).json({ message: "Association not found" });
      }
      res.json({ message: "Association deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete association" });
    }
  });

  // Location routes
  app.get("/api/locations", async (req, res) => {
    try {
      const locations = await storage.getLocations();
      res.json(locations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch locations" });
    }
  });

  app.get("/api/locations/school/:schoolId", async (req, res) => {
    try {
      const schoolId = req.params.schoolId;
      const locations = await storage.getLocationsBySchoolId(schoolId);
      res.json(locations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch school locations" });
    }
  });

  app.get("/api/locations/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const location = await storage.getLocation(id);
      if (!location) {
        return res.status(404).json({ message: "Location not found" });
      }
      res.json(location);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch location" });
    }
  });

  app.post("/api/locations", async (req, res) => {
    try {
      const locationData = locationSchema.parse(req.body);
      const location = await storage.createLocation(locationData);
      res.status(201).json(location);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid location data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create location" });
    }
  });

  app.put("/api/locations/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const locationData = locationSchema.partial().parse(req.body);
      const location = await storage.updateLocation(id, locationData);
      if (!location) {
        return res.status(404).json({ message: "Location not found" });
      }
      res.json(location);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid location data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update location" });
    }
  });

  app.delete("/api/locations/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const success = await storage.deleteLocation(id);
      if (!success) {
        return res.status(404).json({ message: "Location not found" });
      }
      res.json({ message: "Location deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete location" });
    }
  });

  // Guide assignment routes
  app.get("/api/guide-assignments/school/:schoolId", async (req, res) => {
    try {
      const schoolId = req.params.schoolId;
      const assignments = await storage.getGuideAssignmentsBySchoolId(schoolId);
      res.json(assignments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch guide assignments" });
    }
  });

  app.post("/api/guide-assignments", async (req, res) => {
    try {
      const assignmentData = guideAssignmentSchema.parse(req.body);
      const assignment = await storage.createGuideAssignment(assignmentData);
      res.status(201).json(assignment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid guide assignment data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create guide assignment" });
    }
  });

  app.put("/api/guide-assignments/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const assignmentData = guideAssignmentSchema.partial().parse(req.body);
      const assignment = await storage.updateGuideAssignment(id, assignmentData);
      if (!assignment) {
        return res.status(404).json({ message: "Guide assignment not found" });
      }
      res.json(assignment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid guide assignment data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update guide assignment" });
    }
  });

  app.delete("/api/guide-assignments/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const success = await storage.deleteGuideAssignment(id);
      if (!success) {
        return res.status(404).json({ message: "Guide assignment not found" });
      }
      res.json({ message: "Guide assignment deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete guide assignment" });
    }
  });

  // Governance document routes
  app.get("/api/governance-documents/school/:schoolId", async (req, res) => {
    try {
      const schoolId = req.params.schoolId;
      const documents = await storage.getGovernanceDocumentsBySchoolId(schoolId);
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch governance documents" });
    }
  });

  app.get("/api/tax-990s/school/:schoolId", async (req, res) => {
    try {
      const schoolId = req.params.schoolId;
      const tax990s = await storage.getTax990sBySchoolId(schoolId);
      res.json(tax990s);
    } catch (error) {
      console.error('Error fetching 990s:', error);
      res.status(500).json({ error: 'Failed to fetch 990s' });
    }
  });

  app.patch("/api/tax-990s/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const tax990 = await storage.updateTax990(id, updates);
      if (!tax990) {
        return res.status(404).json({ message: "Tax 990 not found" });
      }
      res.json(tax990);
    } catch (error) {
      console.error("Error updating tax 990:", error);
      res.status(500).json({ message: "Failed to update tax 990" });
    }
  });

  app.delete("/api/tax-990s/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteTax990(id);
      if (!success) {
        return res.status(404).json({ message: "Tax 990 not found" });
      }
      res.json({ message: "Tax 990 deleted successfully" });
    } catch (error) {
      console.error("Error deleting tax 990:", error);
      res.status(500).json({ message: "Failed to delete tax 990" });
    }
  });

  app.post("/api/governance-documents", async (req, res) => {
    try {
      const { governanceDocumentSchema } = await import("@shared/schema");
      const validatedData = governanceDocumentSchema.parse(req.body);
      const document = await storage.createGovernanceDocument(validatedData);
      res.status(201).json(document);
    } catch (error) {
      res.status(400).json({ message: "Failed to create governance document" });
    }
  });

  app.patch("/api/governance-documents/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const { governanceDocumentSchema } = await import("@shared/schema");
      const validatedData = governanceDocumentSchema.partial().parse(req.body);
      const document = await storage.updateGovernanceDocument(id, validatedData);
      if (!document) {
        return res.status(404).json({ message: "Governance document not found" });
      }
      res.json(document);
    } catch (error) {
      res.status(500).json({ message: "Failed to update governance document" });
    }
  });

  app.delete("/api/governance-documents/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const success = await storage.deleteGovernanceDocument(id);
      if (!success) {
        return res.status(404).json({ message: "Governance document not found" });
      }
      res.json({ message: "Governance document deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete governance document" });
    }
  });

  // School note routes
  app.get("/api/school-notes/school/:schoolId", async (req, res) => {
    try {
      const schoolId = req.params.schoolId;
      const notes = await storage.getSchoolNotesBySchoolId(schoolId);
      res.json(notes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch school notes" });
    }
  });

  app.post("/api/school-notes", async (req, res) => {
    try {
      const { schoolNoteSchema } = await import("@shared/schema");
      const validatedData = schoolNoteSchema.parse(req.body);
      const note = await storage.createSchoolNote(validatedData);
      res.status(201).json(note);
    } catch (error) {
      res.status(400).json({ message: "Failed to create school note" });
    }
  });

  app.patch("/api/school-notes/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const { schoolNoteSchema } = await import("@shared/schema");
      const validatedData = schoolNoteSchema.partial().parse(req.body);
      const note = await storage.updateSchoolNote(id, validatedData);
      if (!note) {
        return res.status(404).json({ message: "School note not found" });
      }
      res.json(note);
    } catch (error) {
      res.status(500).json({ message: "Failed to update school note" });
    }
  });

  app.delete("/api/school-notes/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const success = await storage.deleteSchoolNote(id);
      if (!success) {
        return res.status(404).json({ message: "School note not found" });
      }
      res.json({ message: "School note deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete school note" });
    }
  });

  // Action Steps routes
  app.get("/api/action-steps/school/:schoolId", async (req, res) => {
    try {
      const schoolId = req.params.schoolId;
      const actionSteps = await storage.getActionStepsBySchoolId(schoolId);
      res.json(actionSteps);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch action steps" });
    }
  });

  // Grant routes
  app.get("/api/grants/school/:schoolId", async (req, res) => {
    try {
      const schoolId = req.params.schoolId;
      const grants = await storage.getGrantsBySchoolId(schoolId);
      res.json(grants);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch grants" });
    }
  });

  app.post("/api/grants", async (req, res) => {
    try {
      const { grantSchema } = await import("@shared/schema");
      const validatedData = grantSchema.parse(req.body);
      const grant = await storage.createGrant(validatedData);
      res.status(201).json(grant);
    } catch (error) {
      res.status(400).json({ message: "Failed to create grant" });
    }
  });

  app.patch("/api/grants/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const { grantSchema } = await import("@shared/schema");
      const validatedData = grantSchema.partial().parse(req.body);
      const grant = await storage.updateGrant(id, validatedData);
      if (!grant) {
        return res.status(404).json({ message: "Grant not found" });
      }
      res.json(grant);
    } catch (error) {
      res.status(500).json({ message: "Failed to update grant" });
    }
  });

  app.delete("/api/grants/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const success = await storage.deleteGrant(id);
      if (!success) {
        return res.status(404).json({ message: "Grant not found" });
      }
      res.json({ message: "Grant deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete grant" });
    }
  });

  // Loan routes
  app.get("/api/loans/school/:schoolId", async (req, res) => {
    try {
      const schoolId = req.params.schoolId;
      const loans = await storage.getLoansBySchoolId(schoolId);
      res.json(loans);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch loans" });
    }
  });

  app.post("/api/loans", async (req, res) => {
    try {
      const { loanSchema } = await import("@shared/schema");
      const validatedData = loanSchema.parse(req.body);
      const loan = await storage.createLoan(validatedData);
      res.status(201).json(loan);
    } catch (error) {
      res.status(400).json({ message: "Failed to create loan" });
    }
  });

  app.patch("/api/loans/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const { loanSchema } = await import("@shared/schema");
      const validatedData = loanSchema.partial().parse(req.body);
      const loan = await storage.updateLoan(id, validatedData);
      if (!loan) {
        return res.status(404).json({ message: "Loan not found" });
      }
      res.json(loan);
    } catch (error) {
      res.status(500).json({ message: "Failed to update loan" });
    }
  });

  app.delete("/api/loans/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const success = await storage.deleteLoan(id);
      if (!success) {
        return res.status(404).json({ message: "Loan not found" });
      }
      res.json({ message: "Loan deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete loan" });
    }
  });

  // Debug endpoint to check available tables
  app.get("/api/debug/tables", async (req, res) => {
    try {
      const response = await fetch(`https://api.airtable.com/v0/meta/bases/${process.env.AIRTABLE_BASE_ID}/tables`, {
        headers: {
          'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch schema: ${response.statusText}`);
      }
      
      const data = await response.json();
      res.json({
        tables: data.tables.map((table: any) => ({ 
          id: table.id, 
          name: table.name 
        }))
      });
    } catch (error) {
      console.error("Error fetching Airtable schema:", error);
      res.status(500).json({ error: "Failed to fetch tables" });
    }
  });

  // Email Address routes
  app.get("/api/email-addresses", async (req, res) => {
    try {
      const emailAddresses = await storage.getEmailAddresses();
      res.json(emailAddresses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch email addresses" });
    }
  });

  app.get("/api/email-addresses/educator/:educatorId", async (req, res) => {
    try {
      const educatorId = req.params.educatorId;
      const emailAddresses = await storage.getEmailAddressesByEducatorId(educatorId);
      res.json(emailAddresses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch email addresses for educator" });
    }
  });

  app.get("/api/email-addresses/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const emailAddress = await storage.getEmailAddress(id);
      if (!emailAddress) {
        return res.status(404).json({ message: "Email address not found" });
      }
      res.json(emailAddress);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch email address" });
    }
  });

  // SSJ Fillout Forms routes
  app.get("/api/ssj-fillout-forms", async (req, res) => {
    try {
      const forms = await storage.getSSJFilloutForms();
      res.json(forms);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch SSJ fillout forms" });
    }
  });

  app.get("/api/ssj-fillout-forms/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const form = await storage.getSSJFilloutForm(id);
      if (!form) {
        return res.status(404).json({ message: "SSJ fillout form not found" });
      }
      res.json(form);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch SSJ fillout form" });
    }
  });

  app.get("/api/ssj-fillout-forms/educator/:educatorId", async (req, res) => {
    try {
      const educatorId = req.params.educatorId;
      const forms = await storage.getSSJFilloutFormsByEducatorId(educatorId);
      res.json(forms);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch SSJ fillout forms for educator" });
    }
  });

  // Montessori Certifications routes
  app.get("/api/montessori-certifications/educator/:educatorId", async (req, res) => {
    try {
      const educatorId = req.params.educatorId;
      const certifications = await storage.getMontessoriCertificationsByEducatorId(educatorId);
      res.json(certifications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch Montessori certifications for educator" });
    }
  });

  // Event Attendance routes
  app.get("/api/event-attendance/educator/:educatorId", async (req, res) => {
    try {
      const educatorId = req.params.educatorId;
      const attendance = await storage.getEventAttendancesByEducatorId(educatorId);
      res.json(attendance);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch event attendance for educator" });
    }
  });

  // Educator Notes routes
  app.get("/api/educator-notes/educator/:educatorId", async (req, res) => {
    try {
      const educatorId = req.params.educatorId;
      const notes = await storage.getEducatorNotesByEducatorId(educatorId);
      res.json(notes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch educator notes for educator" });
    }
  });

  // Generic subtable route for dynamic table access
  app.get("/api/subtable/:tableName", async (req, res) => {
    try {
      const tableName = req.params.tableName;
      const queryParams = req.query;
      
      // Route to specific implementation based on table name
      switch (tableName) {
        case "Montessori Certs":
        case "Montessori%20Certs":
          if (queryParams.educator_id) {
            const certifications = await storage.getMontessoriCertificationsByEducatorId(queryParams.educator_id as string);
            return res.json(certifications);
          }
          break;
        case "Event Attendance":
          if (queryParams.educator_id) {
            const attendance = await storage.getEventAttendancesByEducatorId(queryParams.educator_id as string);
            return res.json(attendance);
          }
          break;
        case "Educator Notes":
          if (queryParams.educator_id) {
            const notes = await storage.getEducatorNotesByEducatorId(queryParams.educator_id as string);
            return res.json(notes);
          }
          break;
        case "Email Addresses":
          if (queryParams.educator_id) {
            const emails = await storage.getEmailAddressesByEducatorId(queryParams.educator_id as string);
            return res.json(emails);
          }
          break;
        case "SSJ Fillout Forms":
          if (queryParams.educator_id) {
            const forms = await storage.getSSJFilloutFormsByEducatorId(queryParams.educator_id as string);
            return res.json(forms);
          }
          break;
        case "Governance docs":
        case "Governance documents":
          if (queryParams.school_id) {
            const docs = await storage.getGovernanceDocumentsBySchoolId(queryParams.school_id as string);
            return res.json(docs);
          }
          break;
        case "Guides Assignments":
          if (queryParams.school_id) {
            const assignments = await storage.getGuideAssignmentsBySchoolId(queryParams.school_id as string);
            return res.json(assignments);
          }
          break;
        case "School Notes":
          if (queryParams.school_id) {
            const notes = await storage.getSchoolNotesBySchoolId(queryParams.school_id as string);
            return res.json(notes);
          }
          break;
        default:
          return res.status(404).json({ message: `Table '${tableName}' not supported` });
      }
      
      res.status(400).json({ message: "Missing required filter parameter" });
    } catch (error) {
      console.error(`Error fetching subtable ${req.params.tableName}:`, error);
      res.status(500).json({ message: `Failed to fetch ${req.params.tableName}` });
    }
  });

  // Membership Fee by Year routes
  app.get("/api/membership-fees-by-year", async (req, res) => {
    try {
      const fees = await storage.getMembershipFeesByYear();
      res.json(fees);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch membership fees by year" });
    }
  });

  app.get("/api/membership-fees-by-year/school/:schoolId", async (req, res) => {
    try {
      const schoolId = req.params.schoolId;
      const fees = await storage.getMembershipFeesBySchoolId(schoolId);
      res.json(fees);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch membership fees for school" });
    }
  });

  app.get("/api/membership-fees-by-year/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const fee = await storage.getMembershipFeeByYear(id);
      if (!fee) {
        return res.status(404).json({ message: "Membership fee not found" });
      }
      res.json(fee);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch membership fee" });
    }
  });

  // Membership Fee Updates routes
  app.get("/api/membership-fee-updates", async (req, res) => {
    try {
      const updates = await storage.getMembershipFeeUpdates();
      res.json(updates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch membership fee updates" });
    }
  });

  app.get("/api/membership-fee-updates/school/:schoolId", async (req, res) => {
    try {
      const schoolId = req.params.schoolId;
      const { schoolYear } = req.query;
      
      if (schoolYear) {
        const updates = await storage.getMembershipFeeUpdatesBySchoolIdAndYear(schoolId, schoolYear as string);
        res.json(updates);
      } else {
        const updates = await storage.getMembershipFeeUpdatesBySchoolId(schoolId);
        res.json(updates);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch membership fee updates for school" });
    }
  });

  app.get("/api/membership-fee-updates/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const update = await storage.getMembershipFeeUpdate(id);
      if (!update) {
        return res.status(404).json({ message: "Membership fee update not found" });
      }
      res.json(update);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch membership fee update" });
    }
  });

  // Cache statistics endpoint for monitoring
  app.get("/api/cache/stats", async (req, res) => {
    try {
      const stats = cache.getStats();
      res.json({
        ...stats,
        ttl: "5 minutes",
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get cache statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
