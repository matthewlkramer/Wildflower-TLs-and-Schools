import { z } from 'zod';
import type { Database } from '@/types/database.types';

// Snake_case, form-focused schemas only. For data rows, use Database types directly.

// -------------------------------------------------
// School form (subset of editable fields)
// -------------------------------------------------
export type SchoolForm = Pick<
  Database['public']['Tables']['schools']['Row'],
  'long_name' | 'short_name' | 'governance_model' | 'ages_served' | 'about' | 'school_phone' | 'school_email' | 'website' | 'membership_status'
>;

export const SCHOOL_FORM_SCHEMA = z.object({
  long_name: z.string().min(1, 'Required').optional().nullable(),
  short_name: z.string().optional().nullable(),
  governance_model: z.string().optional().nullable(),
  ages_served: z.array(z.string()).optional().nullable(),
  about: z.string().optional().nullable(),
  school_phone: z.string().optional().nullable(),
  school_email: z.string().email('Invalid email').optional().nullable(),
  website: z.string().optional().nullable(),
  membership_status: z.string().optional().nullable(),
});

export type SchoolFormInput = z.infer<typeof SCHOOL_FORM_SCHEMA>;

// -------------------------------------------------
// Educator form (subset of editable fields)
// -------------------------------------------------
export type EducatorForm = Pick<
  Database['public']['Tables']['people']['Row'],
  'first_name' | 'last_name' | 'primary_phone' | 'home_address' | 'non_wildflower_email'
>;

export const EDUCATOR_FORM_SCHEMA = z.object({
  first_name: z.string().min(1, 'Required').optional().nullable(),
  last_name: z.string().min(1, 'Required').optional().nullable(),
  non_wildflower_email: z.string().email('Invalid email').optional().nullable(),
  primary_phone: z.string().optional().nullable(),
  home_address: z.string().optional().nullable(),
});

export type EducatorFormInput = z.infer<typeof EDUCATOR_FORM_SCHEMA>;
