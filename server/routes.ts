import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./simple-storage";
import { educatorSchema, schoolSchema, educatorSchoolAssociationSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Teacher routes
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

  const httpServer = createServer(app);
  return httpServer;
}
