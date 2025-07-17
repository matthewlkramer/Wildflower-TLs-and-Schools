import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./simple-storage";
import { loanStorage } from "./loan-storage";
import { cache } from "./cache";
import { educatorSchema, schoolSchema, educatorSchoolAssociationSchema, locationSchema, guideAssignmentSchema } from "@shared/schema";
import { createInsertSchema } from "drizzle-zod";
import { 
  borrowers,
  loanApplications,
  loans,
  loanPayments,
  loanDocuments,
  loanCovenants,
  loanCommitteeReviews,
  capitalSources,
  quarterlyReports
} from "@shared/schema";
import {
  reportSchedules,
  quarterlyReportReminders,
  promissoryNoteTemplates,
  templateFields,
  generatedDocuments
} from "@shared/loan-schema";

// Create insert schemas for validation
const insertBorrowerSchema = createInsertSchema(borrowers);
const insertLoanApplicationSchema = createInsertSchema(loanApplications);
const insertLoanSchema = createInsertSchema(loans);
const insertLoanPaymentSchema = createInsertSchema(loanPayments);
const insertLoanDocumentSchema = createInsertSchema(loanDocuments);
const insertLoanCovenantSchema = createInsertSchema(loanCovenants);
const insertLoanCommitteeReviewSchema = createInsertSchema(loanCommitteeReviews);
const insertCapitalSourceSchema = createInsertSchema(capitalSources);
const insertQuarterlyReportSchema = createInsertSchema(quarterlyReports);
const insertReportScheduleSchema = createInsertSchema(reportSchedules);
const insertQuarterlyReportReminderSchema = createInsertSchema(quarterlyReportReminders);
const insertPromissoryNoteTemplateSchema = createInsertSchema(promissoryNoteTemplates);
const insertTemplateFieldSchema = createInsertSchema(templateFields);
const insertGeneratedDocumentSchema = createInsertSchema(generatedDocuments);
import { z } from "zod";

// Initialize Stripe
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

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

  // Charter routes
  app.get("/api/charters", async (req, res) => {
    try {
      const charters = await storage.getCharters();
      res.json(charters);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch charters" });
    }
  });

  app.get("/api/charters/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const charter = await storage.getCharter(id);
      if (!charter) {
        return res.status(404).json({ message: "Charter not found" });
      }
      res.json(charter);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch charter" });
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

  // User-specific schools for dashboard
  app.get("/api/schools/user/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const schools = await storage.getSchoolsByUserId(userId);
      res.json(schools);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user schools" });
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
        console.log('Validation errors:', error.errors);
        return res.status(400).json({ message: "Invalid school data", errors: error.errors });
      }
      console.error('School update error:', error);
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
      
      // Invalidate cache after successful deletion
      cache.invalidate('schools:all');
      
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

  app.put("/api/teacher-school-associations/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const associationData = educatorSchoolAssociationSchema.partial().parse(req.body);
      const association = await storage.updateTeacherSchoolAssociation(id, associationData);
      if (!association) {
        return res.status(404).json({ message: "Association not found" });
      }
      res.json(association);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid association data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update association" });
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

  // User-specific action steps for dashboard
  app.get("/api/action-steps/user/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const actionSteps = await storage.getActionStepsByUserId(userId);
      res.json(actionSteps);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user action steps" });
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

  // Metadata routes
  app.get("/api/metadata", async (req, res) => {
    try {
      const metadata = await storage.getMetadata();
      res.json(metadata);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch metadata" });
    }
  });

  app.get("/api/metadata/school-field-options", async (req, res) => {
    try {
      const options = await storage.getSchoolFieldOptions();
      res.json(options);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch school field options" });
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

  // Cache management endpoints
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

  app.post("/api/cache/clear", async (req, res) => {
    try {
      cache.invalidate();
      res.json({ message: "Cache cleared successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to clear cache" });
    }
  });

  // Charter-related routes
  
  // Schools filtered by charter
  app.get("/api/schools/charter/:charterId", async (req, res) => {
    try {
      const charterId = req.params.charterId;
      const schools = await storage.getSchoolsByCharterId(charterId);
      res.json(schools);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch charter schools" });
    }
  });

  // Charter roles
  app.get("/api/charter-roles/charter/:charterId", async (req, res) => {
    try {
      const charterId = req.params.charterId;
      const roles = await storage.getCharterRolesByCharterId(charterId);
      res.json(roles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch charter roles" });
    }
  });

  // Charter applications
  app.get("/api/charter-applications/charter/:charterId", async (req, res) => {
    try {
      const charterId = req.params.charterId;
      const applications = await storage.getCharterApplicationsByCharterId(charterId);
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch charter applications" });
    }
  });

  // Charter authorizer contacts
  app.get("/api/charter-authorizer-contacts/charter/:charterId", async (req, res) => {
    try {
      const charterId = req.params.charterId;
      const contacts = await storage.getCharterAuthorizerContactsByCharterId(charterId);
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch charter authorizer contacts" });
    }
  });

  // Charter reports
  app.get("/api/report-submissions/charter/:charterId", async (req, res) => {
    try {
      const charterId = req.params.charterId;
      const reports = await storage.getReportSubmissionsByCharterId(charterId);
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch charter reports" });
    }
  });

  // Charter assessments
  app.get("/api/assessment-data/charter/:charterId", async (req, res) => {
    try {
      const charterId = req.params.charterId;
      const assessments = await storage.getAssessmentDataByCharterId(charterId);
      res.json(assessments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch charter assessments" });
    }
  });

  // Charter notes
  app.get("/api/charter-notes/charter/:charterId", async (req, res) => {
    try {
      const charterId = req.params.charterId;
      const notes = await storage.getCharterNotesByCharterId(charterId);
      res.json(notes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch charter notes" });
    }
  });

  // Charter action steps
  app.get("/api/charter-action-steps/charter/:charterId", async (req, res) => {
    try {
      const charterId = req.params.charterId;
      const actionSteps = await storage.getCharterActionStepsByCharterId(charterId);
      res.json(actionSteps);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch charter action steps" });
    }
  });

  // Charter governance documents
  app.get("/api/charter-governance-documents/charter/:charterId", async (req, res) => {
    try {
      const charterId = req.params.charterId;
      const documents = await storage.getCharterGovernanceDocumentsByCharterId(charterId);
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch charter governance documents" });
    }
  });

  // Charter 990s
  app.get("/api/charter-990s/charter/:charterId", async (req, res) => {
    try {
      const charterId = req.params.charterId;
      const tax990s = await storage.getCharter990sByCharterId(charterId);
      res.json(tax990s);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch charter 990s" });
    }
  });

  // Charter educator associations
  app.get("/api/educator-school-associations/charter/:charterId", async (req, res) => {
    try {
      const charterId = req.params.charterId;
      const associations = await storage.getEducatorSchoolAssociationsByCharterId(charterId);
      res.json(associations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch charter educator associations" });
    }
  });

  // ==================== LOAN MANAGEMENT SYSTEM API ROUTES ====================
  
  // Loan Applications
  app.get("/api/loan-applications", async (req, res) => {
    try {
      const applications = await loanStorage.getLoanApplications();
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch loan applications" });
    }
  });

  app.get("/api/loan-applications/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const application = await loanStorage.getLoanApplication(id);
      if (!application) {
        return res.status(404).json({ message: "Loan application not found" });
      }
      res.json(application);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch loan application" });
    }
  });

  app.post("/api/loan-applications", async (req, res) => {
    try {
      const applicationData = insertLoanApplicationSchema.parse(req.body);
      const application = await loanStorage.createLoanApplication(applicationData);
      res.status(201).json(application);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid application data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create loan application" });
    }
  });

  app.put("/api/loan-applications/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = insertLoanApplicationSchema.partial().parse(req.body);
      const application = await loanStorage.updateLoanApplication(id, updateData);
      if (!application) {
        return res.status(404).json({ message: "Loan application not found" });
      }
      res.json(application);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid application data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update loan application" });
    }
  });

  app.delete("/api/loan-applications/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await loanStorage.deleteLoanApplication(id);
      if (!deleted) {
        return res.status(404).json({ message: "Loan application not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete loan application" });
    }
  });

  // Borrowers
  app.get("/api/borrowers", async (req, res) => {
    try {
      const borrowers = await loanStorage.getBorrowers();
      res.json(borrowers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch borrowers" });
    }
  });

  app.get("/api/borrowers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const borrower = await loanStorage.getBorrower(id);
      if (!borrower) {
        return res.status(404).json({ message: "Borrower not found" });
      }
      res.json(borrower);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch borrower" });
    }
  });

  app.post("/api/borrowers", async (req, res) => {
    try {
      const borrowerData = insertBorrowerSchema.parse(req.body);
      const borrower = await loanStorage.createBorrower(borrowerData);
      res.status(201).json(borrower);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid borrower data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create borrower" });
    }
  });

  app.put("/api/borrowers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = insertBorrowerSchema.partial().parse(req.body);
      const borrower = await loanStorage.updateBorrower(id, updateData);
      if (!borrower) {
        return res.status(404).json({ message: "Borrower not found" });
      }
      res.json(borrower);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid borrower data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update borrower" });
    }
  });

  // Loans
  app.get("/api/loans", async (req, res) => {
    try {
      const loans = await loanStorage.getLoans();
      
      // Fetch borrower data for each loan
      const loansWithBorrowers = await Promise.all(
        loans.map(async (loan) => {
          const borrower = await loanStorage.getBorrowerById(loan.borrowerId);
          return {
            ...loan,
            borrower: borrower || null
          };
        })
      );
      
      res.json(loansWithBorrowers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch loans" });
    }
  });

  app.get("/api/loans/number/:loanNumber", async (req, res) => {
    try {
      const loanNumber = req.params.loanNumber;
      const loan = await loanStorage.getLoanByNumber(loanNumber);
      if (!loan) {
        return res.status(404).json({ message: "Loan not found" });
      }
      res.json(loan);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch loan" });
    }
  });

  app.post("/api/loans", async (req, res) => {
    try {
      const loanData = insertLoanSchema.parse(req.body);
      const loan = await loanStorage.createLoan(loanData);
      res.status(201).json(loan);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid loan data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create loan" });
    }
  });

  // Loan Origination Workflow Routes (must come before parameterized routes)
  app.get("/api/loans/origination-pipeline", async (req, res) => {
    try {
      console.log("Fetching origination pipeline loans...");
      const loans = await loanStorage.getLoansInOrigination();
      console.log("Found loans:", loans?.length || 0);
      res.json(loans);
    } catch (error) {
      console.error("Error fetching origination pipeline:", error);
      console.error("Stack trace:", error.stack);
      res.status(500).json({ message: "Failed to fetch origination pipeline", error: error.message });
    }
  });

  app.get("/api/loans/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const loan = await loanStorage.getLoanById(id);
      if (!loan) {
        return res.status(404).json({ message: "Loan not found" });
      }
      
      // Get borrower details
      const borrower = await loanStorage.getBorrowerById(loan.borrowerId);
      const loanWithBorrower = { ...loan, borrower };
      
      res.json(loanWithBorrower);
    } catch (error) {
      console.error("Error fetching loan:", error);
      res.status(500).json({ message: "Failed to fetch loan" });
    }
  });

  app.put("/api/loans/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = insertLoanSchema.partial().parse(req.body);
      const loan = await loanStorage.updateLoan(id, updateData);
      if (!loan) {
        return res.status(404).json({ message: "Loan not found" });
      }
      res.json(loan);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid loan data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update loan" });
    }
  });



  app.post("/api/loans/:id/ach-setup", async (req, res) => {
    try {
      const loanId = parseInt(req.params.id);
      const { paymentMethodId, accountHolderName } = req.body;

      if (!paymentMethodId || !accountHolderName) {
        return res.status(400).json({ message: "Payment method ID and account holder name required" });
      }

      // Get loan details
      const loan = await loanStorage.getLoanById(loanId);
      if (!loan) {
        return res.status(404).json({ message: "Loan not found" });
      }

      const borrower = await loanStorage.getBorrowerById(loan.borrowerId);
      if (!borrower) {
        return res.status(404).json({ message: "Borrower not found" });
      }

      // Create or retrieve Stripe customer
      let customerId = loan.stripeCustomerId;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: borrower.primaryContactEmail || undefined,
          name: borrower.entityName,
          metadata: {
            borrowerId: borrower.id.toString(),
            loanId: loanId.toString(),
          },
        });
        customerId = customer.id;
      }

      // Attach payment method to customer
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
      });

      // Create ACH mandate
      const setupIntent = await stripe.setupIntents.create({
        customer: customerId,
        payment_method: paymentMethodId,
        usage: 'off_session',
        confirm: true,
        payment_method_types: ['us_bank_account'],
      });

      if (setupIntent.status !== 'succeeded') {
        return res.status(400).json({ message: "Failed to set up ACH mandate" });
      }

      // Update loan with Stripe details
      const updatedLoan = await loanStorage.completeLoanACHSetup(loanId, {
        customerId,
        bankAccountId: paymentMethodId,
      });

      res.json({
        success: true,
        loan: updatedLoan,
        setupIntent: setupIntent.id,
      });
    } catch (error) {
      console.error("Error setting up ACH:", error);
      res.status(500).json({ message: "Failed to set up ACH" });
    }
  });

  app.patch("/api/loans/:id/origination-status", async (req, res) => {
    try {
      const loanId = parseInt(req.params.id);
      const { status, ...updates } = req.body;

      const updatedLoan = await loanStorage.updateLoanOriginationStatus(loanId, status, updates);
      res.json(updatedLoan);
    } catch (error) {
      console.error("Error updating origination status:", error);
      res.status(500).json({ message: "Failed to update origination status" });
    }
  });

  // Loan Payments
  app.get("/api/loans/:loanId/payments", async (req, res) => {
    try {
      const loanId = parseInt(req.params.loanId);
      const payments = await loanStorage.getLoanPayments(loanId);
      res.json(payments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch loan payments" });
    }
  });

  app.post("/api/loan-payments", async (req, res) => {
    try {
      const paymentData = insertLoanPaymentSchema.parse(req.body);
      const payment = await loanStorage.createLoanPayment(paymentData);
      res.status(201).json(payment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid payment data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create loan payment" });
    }
  });

  app.put("/api/loan-payments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = insertLoanPaymentSchema.partial().parse(req.body);
      const payment = await loanStorage.updateLoanPayment(id, updateData);
      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }
      res.json(payment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid payment data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update loan payment" });
    }
  });

  // Loan Documents
  app.get("/api/loan-documents", async (req, res) => {
    try {
      const { loanId, applicationId } = req.query;
      const documents = await loanStorage.getLoanDocuments(
        loanId ? parseInt(loanId as string) : undefined,
        applicationId ? parseInt(applicationId as string) : undefined
      );
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch loan documents" });
    }
  });

  app.post("/api/loan-documents", async (req, res) => {
    try {
      const documentData = insertLoanDocumentSchema.parse(req.body);
      const document = await loanStorage.createLoanDocument(documentData);
      res.status(201).json(document);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid document data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create loan document" });
    }
  });

  app.put("/api/loan-documents/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = insertLoanDocumentSchema.partial().parse(req.body);
      const document = await loanStorage.updateLoanDocument(id, updateData);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      res.json(document);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid document data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update loan document" });
    }
  });

  // Loan Covenants
  app.get("/api/loans/:loanId/covenants", async (req, res) => {
    try {
      const loanId = parseInt(req.params.loanId);
      const covenants = await loanStorage.getLoanCovenants(loanId);
      res.json(covenants);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch loan covenants" });
    }
  });

  app.post("/api/loan-covenants", async (req, res) => {
    try {
      const covenantData = insertLoanCovenantSchema.parse(req.body);
      const covenant = await loanStorage.createLoanCovenant(covenantData);
      res.status(201).json(covenant);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid covenant data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create loan covenant" });
    }
  });

  app.put("/api/loan-covenants/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = insertLoanCovenantSchema.partial().parse(req.body);
      const covenant = await loanStorage.updateLoanCovenant(id, updateData);
      if (!covenant) {
        return res.status(404).json({ message: "Covenant not found" });
      }
      res.json(covenant);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid covenant data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update loan covenant" });
    }
  });

  // Loan Committee Reviews
  app.get("/api/loan-applications/:applicationId/reviews", async (req, res) => {
    try {
      const applicationId = parseInt(req.params.applicationId);
      const reviews = await loanStorage.getLoanCommitteeReviews(applicationId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch committee reviews" });
    }
  });

  app.post("/api/loan-committee-reviews", async (req, res) => {
    try {
      const reviewData = insertLoanCommitteeReviewSchema.parse(req.body);
      const review = await loanStorage.createLoanCommitteeReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid review data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create committee review" });
    }
  });

  app.put("/api/loan-committee-reviews/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = insertLoanCommitteeReviewSchema.partial().parse(req.body);
      const review = await loanStorage.updateLoanCommitteeReview(id, updateData);
      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }
      res.json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid review data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update committee review" });
    }
  });

  // Capital Sources
  app.get("/api/capital-sources", async (req, res) => {
    try {
      const sources = await loanStorage.getCapitalSources();
      res.json(sources);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch capital sources" });
    }
  });

  app.get("/api/capital-sources/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const source = await loanStorage.getCapitalSource(id);
      if (!source) {
        return res.status(404).json({ message: "Capital source not found" });
      }
      res.json(source);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch capital source" });
    }
  });

  app.post("/api/capital-sources", async (req, res) => {
    try {
      const sourceData = insertCapitalSourceSchema.parse(req.body);
      const source = await loanStorage.createCapitalSource(sourceData);
      res.status(201).json(source);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid capital source data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create capital source" });
    }
  });

  app.put("/api/capital-sources/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = insertCapitalSourceSchema.partial().parse(req.body);
      const source = await loanStorage.updateCapitalSource(id, updateData);
      if (!source) {
        return res.status(404).json({ message: "Capital source not found" });
      }
      res.json(source);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid capital source data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update capital source" });
    }
  });

  // Quarterly Reports
  app.get("/api/loans/:loanId/quarterly-reports", async (req, res) => {
    try {
      const loanId = parseInt(req.params.loanId);
      const reports = await loanStorage.getQuarterlyReports(loanId);
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch quarterly reports" });
    }
  });

  app.post("/api/quarterly-reports", async (req, res) => {
    try {
      const reportData = insertQuarterlyReportSchema.parse(req.body);
      const report = await loanStorage.createQuarterlyReport(reportData);
      res.status(201).json(report);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid report data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create quarterly report" });
    }
  });

  // Get quarterly reports for tracking (includes borrower names)
  app.get("/api/quarterly-reports/tracking", async (req, res) => {
    try {
      const reports = await loanStorage.getQuarterlyReportsForTracking();
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch quarterly reports tracking data" });
    }
  });

  // Get overdue quarterly reports
  app.get("/api/quarterly-reports/overdue", async (req, res) => {
    try {
      const reports = await loanStorage.getOverdueQuarterlyReports();
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch overdue quarterly reports" });
    }
  });

  // Generate quarterly reports for a period
  app.post("/api/quarterly-reports/generate", async (req, res) => {
    try {
      const { year, quarter } = req.body;
      if (!year || !quarter) {
        return res.status(400).json({ message: "Year and quarter are required" });
      }
      await loanStorage.generateQuarterlyReportsForPeriod(year, quarter);
      res.json({ message: "Quarterly reports generated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to generate quarterly reports" });
    }
  });

  // Report schedules routes
  app.get("/api/report-schedules", async (req, res) => {
    try {
      const schedules = await loanStorage.getReportSchedules();
      res.json(schedules);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch report schedules" });
    }
  });

  app.post("/api/report-schedules", async (req, res) => {
    try {
      const scheduleData = insertReportScheduleSchema.parse(req.body);
      const schedule = await loanStorage.createReportSchedule(scheduleData);
      res.status(201).json(schedule);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid schedule data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create report schedule" });
    }
  });

  app.put("/api/report-schedules/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = insertReportScheduleSchema.partial().parse(req.body);
      const schedule = await loanStorage.updateReportSchedule(id, updateData);
      if (!schedule) {
        return res.status(404).json({ message: "Schedule not found" });
      }
      res.json(schedule);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid schedule data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update report schedule" });
    }
  });

  app.delete("/api/report-schedules/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await loanStorage.deleteReportSchedule(id);
      if (!deleted) {
        return res.status(404).json({ message: "Schedule not found" });
      }
      res.json({ message: "Schedule deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete report schedule" });
    }
  });

  // Reminder routes
  app.get("/api/quarterly-reports/:id/reminders", async (req, res) => {
    try {
      const quarterlyReportId = parseInt(req.params.id);
      const reminders = await loanStorage.getQuarterlyReportReminders(quarterlyReportId);
      res.json(reminders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reminders" });
    }
  });



  app.put("/api/quarterly-reports/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = insertQuarterlyReportSchema.partial().parse(req.body);
      const report = await loanStorage.updateQuarterlyReport(id, updateData);
      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }
      res.json(report);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid report data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update quarterly report" });
    }
  });

  // Analytics and Dashboard Endpoints
  app.get("/api/loan-dashboard/summary", async (req, res) => {
    try {
      const summary = await loanStorage.getDashboardSummary();
      res.json(summary);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch loan summary" });
    }
  });

  app.get("/api/loan-dashboard/upcoming-payments", async (req, res) => {
    try {
      const days = req.query.days ? parseInt(req.query.days as string) : 30;
      const payments = await loanStorage.getUpcomingPayments(days);
      res.json(payments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch upcoming payments" });
    }
  });

  app.get("/api/loan-dashboard/overdue-payments", async (req, res) => {
    try {
      const payments = await loanStorage.getOverduePayments();
      res.json(payments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch overdue payments" });
    }
  });

  app.get("/api/loan-dashboard/covenant-violations", async (req, res) => {
    try {
      const violations = await loanStorage.getCovenantViolations();
      res.json(violations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch covenant violations" });
    }
  });

  // Promissory Note Template routes
  app.get("/api/promissory-note-templates", async (req, res) => {
    try {
      const templates = await loanStorage.getPromissoryNoteTemplates();
      res.json(templates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch promissory note templates" });
    }
  });

  app.get("/api/promissory-note-templates/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const template = await loanStorage.getPromissoryNoteTemplateById(id);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      res.json(template);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch template" });
    }
  });

  app.post("/api/promissory-note-templates", async (req, res) => {
    try {
      const templateData = insertPromissoryNoteTemplateSchema.parse(req.body);
      const template = await loanStorage.createPromissoryNoteTemplate(templateData);
      res.status(201).json(template);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid template data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create template" });
    }
  });

  app.put("/api/promissory-note-templates/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = insertPromissoryNoteTemplateSchema.partial().parse(req.body);
      const template = await loanStorage.updatePromissoryNoteTemplate(id, updateData);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      res.json(template);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid template data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update template" });
    }
  });

  app.post("/api/promissory-note-templates/:id/new-version", async (req, res) => {
    try {
      const originalId = parseInt(req.params.id);
      const { createdBy, ...updateData } = req.body;
      const newTemplate = await loanStorage.createNewTemplateVersion(originalId, updateData, createdBy);
      res.status(201).json(newTemplate);
    } catch (error) {
      res.status(500).json({ message: "Failed to create new template version" });
    }
  });

  // Template field routes
  app.get("/api/promissory-note-templates/:id/fields", async (req, res) => {
    try {
      const templateId = parseInt(req.params.id);
      const fields = await loanStorage.getTemplateFields(templateId);
      res.json(fields);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch template fields" });
    }
  });

  app.post("/api/template-fields", async (req, res) => {
    try {
      const fieldData = insertTemplateFieldSchema.parse(req.body);
      const field = await loanStorage.createTemplateField(fieldData);
      res.status(201).json(field);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid field data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create template field" });
    }
  });

  app.put("/api/template-fields/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = insertTemplateFieldSchema.partial().parse(req.body);
      const field = await loanStorage.updateTemplateField(id, updateData);
      if (!field) {
        return res.status(404).json({ message: "Field not found" });
      }
      res.json(field);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid field data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update template field" });
    }
  });

  app.delete("/api/template-fields/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await loanStorage.deleteTemplateField(id);
      if (!deleted) {
        return res.status(404).json({ message: "Field not found" });
      }
      res.json({ message: "Field deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete template field" });
    }
  });

  // Document generation routes
  app.post("/api/loans/:loanId/generate-promissory-note", async (req, res) => {
    try {
      const loanId = parseInt(req.params.loanId);
      const { templateId, fieldValues, generatedBy } = req.body;
      const document = await loanStorage.generatePromissoryNote(loanId, templateId, fieldValues, generatedBy);
      res.status(201).json(document);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate promissory note" });
    }
  });

  app.get("/api/loans/:loanId/documents", async (req, res) => {
    try {
      const loanId = parseInt(req.params.loanId);
      const documents = await loanStorage.getGeneratedDocuments(loanId);
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch generated documents" });
    }
  });

  // Template parsing utility
  app.post("/api/parse-template-fields", async (req, res) => {
    try {
      const { content } = req.body;
      const fields = loanStorage.parseTemplateFields(content);
      res.json({ fields });
    } catch (error) {
      res.status(500).json({ message: "Failed to parse template fields" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
