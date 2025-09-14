// Generated schema information based on database structure
// This file provides additional type helpers and utilities

import type { Database } from './database.types';

// Table type helpers
export type Tables = Database['public']['Tables'];
export type Views = Database['public']['Views'];
export type Functions = Database['public']['Functions'];

// Individual table types
export type School = Tables['schools']['Row'];
export type SchoolInsert = Tables['schools']['Insert'];
export type SchoolUpdate = Tables['schools']['Update'];

export type Educator = Tables['people']['Row'];
export type EducatorInsert = Tables['people']['Insert'];
export type EducatorUpdate = Tables['people']['Update'];

export type Association = Tables['details_associations']['Row'];
export type AssociationInsert = Tables['details_associations']['Insert'];
export type AssociationUpdate = Tables['details_associations']['Update'];

export type Email = Tables['z_g_emails']['Row'];
export type Event = Tables['z_g_events']['Row'];

export type GovernanceDoc = Tables['governance_docs']['Row'];
export type NineNinety = Tables['nine_nineties']['Row'];

// UI View types
export type UIGridSchool = Views['ui_grid_schools']['Row'];
export type UIDetailsSchool = Views['ui_details_school']['Row'];
export type UIGridEducator = Views['ui_grid_educators']['Row'];
export type UIDetailsEducator = Views['ui_details_educator']['Row'];
export type UISchoolEmail = Views['ui_school_emails']['Row'];
export type UISchoolEvent = Views['ui_school_events']['Row'];
export type UIEducatorEmail = Views['ui_educator_emails']['Row'];
export type UIEducatorEvent = Views['ui_educator_events']['Row'];

// Function types
export type UpdateSchoolFieldArgs = Functions['update_school_field']['Args'];
export type UpdateEducatorFieldArgs = Functions['update_educator_field']['Args'];

// Field mappings for camelCase conversion
export const SCHOOL_FIELD_MAP = {
  // Database field -> UI field
  short_name: 'shortName',
  governance_model: 'governanceModel',
  ages_served: 'agesServed',
  membership_status: 'membershipStatus',
  projected_open: 'projectedOpen',
  physical_address: 'physicalAddress',
  mailing_address: 'mailingAddress',
  created_at: 'createdAt',
  updated_at: 'updatedAt',
} as const;

export const EDUCATOR_FIELD_MAP = {
  // Database field -> UI field
  full_name: 'fullName',
  first_name: 'firstName',
  last_name: 'lastName',
  middle_name: 'middleName',
  primary_email: 'primaryEmail',
  non_wildflower_email: 'nonWildflowerEmail',
  primary_phone: 'primaryPhone',
  secondary_phone: 'secondaryPhone',
  home_address: 'homeAddress',
  discovery_status: 'discoveryStatus',
  has_montessori_cert: 'hasMontessoriCert',
  race_ethnicity: 'raceEthnicity',
  race_ethnicity_display: 'raceEthnicityDisplay',
  primary_languages: 'primaryLanguages',
  other_languages: 'otherLanguages',
  kanban_group: 'kanbanGroup',
  kanban_order: 'kanbanOrder',
  inactive_flag: 'inactiveFlag',
  created_at: 'createdAt',
  updated_at: 'updatedAt',
} as const;

export const ASSOCIATION_FIELD_MAP = {
  // Database field -> UI field
  people_id: 'peopleId',
  school_id: 'schoolId',
  start_date: 'startDate',
  end_date: 'endDate',
  currently_active: 'currentlyActive',
  created_at: 'createdAt',
  updated_at: 'updatedAt',
} as const;

// Helper functions for field conversion
export function convertSchoolToUI(school: School): UIDetailsSchool {
  return {
    ...school,
    shortName: school.short_name,
    governanceModel: school.governance_model,
    agesServed: school.ages_served,
    membershipStatus: school.membership_status,
    projectedOpen: school.projected_open,
    physicalAddress: school.physical_address,
    mailingAddress: school.mailing_address,
  } as UIDetailsSchool;
}

export function convertEducatorToUI(educator: Educator): UIDetailsEducator {
  return {
    ...educator,
    fullName: educator.full_name,
    firstName: educator.first_name,
    lastName: educator.last_name,
    middleName: educator.middle_name,
    primaryEmail: educator.primary_email,
    nonWildflowerEmail: educator.non_wildflower_email,
    primaryPhone: educator.primary_phone,
    secondaryPhone: educator.secondary_phone,
    homeAddress: educator.home_address,
    discoveryStatus: educator.discovery_status,
    hasMontessoriCert: educator.has_montessori_cert,
    raceEthnicity: educator.race_ethnicity,
    raceEthnicityDisplay: educator.race_ethnicity_display,
    primaryLanguages: educator.primary_languages,
    otherLanguages: educator.other_languages,
    kanbanGroup: educator.kanban_group,
    kanbanOrder: educator.kanban_order,
  } as UIDetailsEducator;
}

// Constants for select options (can be expanded based on your data)
export const SCHOOL_STATUSES = [
  'Planning',
  'Opening',
  'Operating',
  'Closed',
  'On Hold'
] as const;

export const GOVERNANCE_MODELS = [
  'Teacher Led',
  'Board Governed',
  'Hybrid'
] as const;

export const DISCOVERY_STATUSES = [
  'Prospect',
  'Active',
  'On Hold',
  'Not a Fit',
  'Placed'
] as const;

export const KANBAN_GROUPS = [
  'New',
  'In Progress',
  'Ready',
  'Complete'
] as const;

export type SchoolStatus = typeof SCHOOL_STATUSES[number];
export type GovernanceModel = typeof GOVERNANCE_MODELS[number];
export type DiscoveryStatus = typeof DISCOVERY_STATUSES[number];
export type KanbanGroup = typeof KANBAN_GROUPS[number];