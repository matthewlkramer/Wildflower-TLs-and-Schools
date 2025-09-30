export type TableDefault = { schema?: string; pk: string };

// Central mapping for common write targets and their primary key columns.
// Extend this as new tables are introduced to avoid heuristics.
export const TABLE_DEFAULTS: Record<string, TableDefault> = {
  // Core entities
  schools: { pk: 'id' },
  people: { pk: 'id' },
  charters: { pk: 'id' },

  // School sections
  schools_ssj_data: { pk: 'school_id' },
  locations: { pk: 'school_id' },
  cohort_participation: { pk: 'school_id' },
  open_date_revisions: { pk: 'school_id' },
  guide_assignments: { pk: 'id' },

  // Educator sections
  people_educator_early_cultivation: { pk: 'people_id' },
  people_systems: { pk: 'people_id' },
  email_addresses: { pk: 'id' },
  montessori_certs: { pk: 'id' },

  // Charter sections
  charter_applications: { pk: 'charter_id' },
};

export function getDefaultForTable(table: string | undefined): TableDefault | undefined {
  if (!table) return undefined;
  const key = table.toLowerCase();
  return TABLE_DEFAULTS[key];
}

