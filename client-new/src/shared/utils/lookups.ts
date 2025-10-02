export type LookupConfig = {
  table: string;
  pkColumn: string;
  labelColumn: string;
};

export const LOOKUPS: Record<string, LookupConfig> = {
  school_years: {table: 'zref_school_years', pkColumn: 'id', labelColumn: 'label' },
  race_ethnicity: {table: 'zref_race_and_ethnicity', pkColumn: 'value', labelColumn: 'label' },
  event_name: {table: 'zref_event_list', pkColumn: 'event_name', labelColumn: 'event_name' },
  role: {table: 'zref_roles', pkColumn: 'value', labelColumn: 'label' },
  assignee: {table: 'guides', pkColumn: 'email_or_name', labelColumn: 'email_or_name' },
  created_by: {table: 'guides', pkColumn: 'email_or_name', labelColumn: 'email_or_name' },
  email_or_name: {table: 'guides', pkColumn: 'email_or_name', labelColumn: 'email_or_name' },
  advice_giver: {table: 'people', pkColumn: 'id', labelColumn: 'full_name' },
  cert_level: {table: 'zref_montessori_cert_levels', pkColumn: 'value', labelColumn: 'label' },
};