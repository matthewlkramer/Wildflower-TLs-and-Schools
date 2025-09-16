import type { Database } from '@/types/database.types';

// DB/view type aliases (no Zod schemas here)
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
