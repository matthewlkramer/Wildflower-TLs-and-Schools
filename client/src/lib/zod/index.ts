import { z } from 'zod';
import type { Database } from '@/types/database.types';

// Complete Zod schemas based on database schema
export const schoolInsertSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'School name is required').nullable().optional(),
  short_name: z.string().nullable().optional(),
  about: z.string().nullable().optional(),
  email: z.string().email('Invalid email').nullable().optional(),
  phone: z.string().nullable().optional(),
  website: z.string().url('Invalid URL').nullable().optional(),
  governance_model: z.string().nullable().optional(),
  ages_served: z.array(z.string()).nullable().optional(),
  status: z.string().nullable().optional(),
  membership_status: z.string().nullable().optional(),
  projected_open: z.string().nullable().optional(),
  physical_address: z.string().nullable().optional(),
  mailing_address: z.string().nullable().optional(),
  archived: z.boolean().nullable().optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

export const schoolUpdateSchema = schoolInsertSchema.partial();

export const educatorInsertSchema = z.object({
  id: z.string().uuid().optional(),
  first_name: z.string().min(1, 'First name is required').nullable().optional(),
  last_name: z.string().min(1, 'Last name is required').nullable().optional(),
  middle_name: z.string().nullable().optional(),
  full_name: z.string().nullable().optional(),
  primary_email: z.string().email('Invalid email').nullable().optional(),
  non_wildflower_email: z.string().email('Invalid email').nullable().optional(),
  primary_phone: z.string().nullable().optional(),
  secondary_phone: z.string().nullable().optional(),
  home_address: z.string().nullable().optional(),
  discovery_status: z.string().nullable().optional(),
  has_montessori_cert: z.boolean().nullable().optional(),
  race_ethnicity: z.string().nullable().optional(),
  race_ethnicity_display: z.string().nullable().optional(),
  primary_languages: z.array(z.string()).nullable().optional(),
  other_languages: z.array(z.string()).nullable().optional(),
  kanban_group: z.string().nullable().optional(),
  kanban_order: z.number().int().nullable().optional(),
  inactive_flag: z.boolean().nullable().optional(),
  pronouns: z.string().nullable().optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

export const educatorUpdateSchema = educatorInsertSchema.partial();

export const associationInsertSchema = z.object({
  id: z.string().uuid().optional(),
  people_id: z.string().uuid('Valid educator ID required').nullable().optional(),
  school_id: z.string().uuid('Valid school ID required').nullable().optional(),
  role: z.array(z.string()).nullable().optional(),
  start_date: z.string().nullable().optional(),
  end_date: z.string().nullable().optional(),
  currently_active: z.boolean().nullable().optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

export const associationUpdateSchema = associationInsertSchema.partial();

// Field-level update schema
export const fieldUpdateSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  field: z.string().min(1, 'Field name is required'),
  value: z.any(),
});

// Type exports based on database schema
export type SchoolRow = Database['public']['Tables']['schools']['Row'];
export type SchoolInsert = Database['public']['Tables']['schools']['Insert'];
export type SchoolUpdate = Database['public']['Tables']['schools']['Update'];

export type EducatorRow = Database['public']['Tables']['people']['Row'];
export type EducatorInsert = Database['public']['Tables']['people']['Insert'];
export type EducatorUpdate = Database['public']['Tables']['people']['Update'];

export type AssociationRow = Database['public']['Tables']['details_associations']['Row'];
export type AssociationInsert = Database['public']['Tables']['details_associations']['Insert'];
export type AssociationUpdate = Database['public']['Tables']['details_associations']['Update'];

export type EmailRow = Database['public']['Tables']['z_g_emails']['Row'];
export type EventRow = Database['public']['Tables']['z_g_events']['Row'];

// UI View types
export type UIGridSchool = Database['public']['Views']['ui_grid_schools']['Row'];
export type UIDetailsSchool = Database['public']['Views']['ui_details_school']['Row'];
export type UIGridEducator = Database['public']['Views']['ui_grid_educators']['Row'];
export type UIDetailsEducator = Database['public']['Views']['ui_details_educator']['Row'];

// Inferred Zod types
export type SchoolInsertForm = z.infer<typeof schoolInsertSchema>;
export type SchoolUpdateForm = z.infer<typeof schoolUpdateSchema>;
export type EducatorInsertForm = z.infer<typeof educatorInsertSchema>;
export type EducatorUpdateForm = z.infer<typeof educatorUpdateSchema>;
export type AssociationInsertForm = z.infer<typeof associationInsertSchema>;
export type AssociationUpdateForm = z.infer<typeof associationUpdateSchema>;
export type FieldUpdate = z.infer<typeof fieldUpdateSchema>;