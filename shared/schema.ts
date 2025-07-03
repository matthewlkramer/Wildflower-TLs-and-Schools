import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const schools = pgTable("schools", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  type: text("type").notNull(), // Elementary, Middle School, High School
  established: integer("established").notNull(),
  status: text("status").notNull().default("Active"), // Active, Inactive
  phone: text("phone"),
  email: text("email"),
});

export const teachers = pgTable("teachers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  department: text("department").notNull(),
  subject: text("subject").notNull(),
  status: text("status").notNull().default("Active"), // Active, On Leave, Inactive
  startDate: text("start_date").notNull(),
  education: text("education"),
  certifications: text("certifications"),
  experience: integer("experience"),
  emergencyContact: text("emergency_contact"),
  biography: text("biography"),
});

export const teacherSchoolAssociations = pgTable("teacher_school_associations", {
  id: serial("id").primaryKey(),
  teacherId: integer("teacher_id").notNull(),
  schoolId: integer("school_id").notNull(),
  role: text("role").notNull(), // Primary, Secondary, Substitute
  startDate: text("start_date").notNull(),
  endDate: text("end_date"),
  isPrimary: boolean("is_primary").notNull().default(false),
});

export const insertSchoolSchema = createInsertSchema(schools).omit({
  id: true,
});

export const insertTeacherSchema = createInsertSchema(teachers).omit({
  id: true,
});

export const insertTeacherSchoolAssociationSchema = createInsertSchema(teacherSchoolAssociations).omit({
  id: true,
});

export type InsertSchool = z.infer<typeof insertSchoolSchema>;
export type School = typeof schools.$inferSelect;

export type InsertTeacher = z.infer<typeof insertTeacherSchema>;
export type Teacher = typeof teachers.$inferSelect;

export type InsertTeacherSchoolAssociation = z.infer<typeof insertTeacherSchoolAssociationSchema>;
export type TeacherSchoolAssociation = typeof teacherSchoolAssociations.$inferSelect;
