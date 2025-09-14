import { z } from 'zod';

// Basic Zod schemas for validation - will be generated automatically later
export const schoolInsertSchema = z.object({
  name: z.string().min(1, 'School name is required').optional(),
  short_name: z.string().optional(),
  about: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  governance_model: z.string().optional(),
  ages_served: z.array(z.string()).optional(),
  status: z.string().optional(),
});

export const schoolUpdateSchema = schoolInsertSchema.partial();

export const educatorInsertSchema = z.object({
  first_name: z.string().min(1, 'First name is required').optional(),
  last_name: z.string().min(1, 'Last name is required').optional(),
  full_name: z.string().optional(),
  primary_email: z.string().email('Invalid email').optional().or(z.literal('')),
  non_wildflower_email: z.string().email('Invalid email').optional().or(z.literal('')),
  primary_phone: z.string().optional(),
  home_address: z.string().optional(),
});

export const educatorUpdateSchema = educatorInsertSchema.partial();

export const associationInsertSchema = z.object({
  people_id: z.string().min(1, 'Educator is required'),
  school_id: z.string().min(1, 'School is required'),
  role: z.array(z.string()).optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  currently_active: z.boolean().optional(),
});

export const associationUpdateSchema = associationInsertSchema.partial();

// Field-level update schema
export const fieldUpdateSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  field: z.string().min(1, 'Field name is required'),
  value: z.any(),
});

export type SchoolInsert = z.infer<typeof schoolInsertSchema>;
export type SchoolUpdate = z.infer<typeof schoolUpdateSchema>;
export type EducatorInsert = z.infer<typeof educatorInsertSchema>;
export type EducatorUpdate = z.infer<typeof educatorUpdateSchema>;
export type AssociationInsert = z.infer<typeof associationInsertSchema>;
export type AssociationUpdate = z.infer<typeof associationUpdateSchema>;
export type FieldUpdate = z.infer<typeof fieldUpdateSchema>;