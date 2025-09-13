import { supabase } from "./client";

// Central table names for Schools/Charters writes.
// These should point at the base writable tables (not grid/details views).
// If your project uses different names, adjust here.
const SCHOOLS_TABLE = "schools";
const CHARTERS_TABLE = "charters";
const NOTES_TABLE = "notes";
const LOCATIONS_TABLE = "locations";
const ACTION_STEPS_TABLE = "action_steps";
const ANNUAL_ASSESSMENTS_TABLE = "annual_assessment_and_metrics_data";
const ANNUAL_ENROLLMENT_TABLE = "annual_enrollment_and_demographics";
const CHARTER_APPLICATIONS_TABLE = "charter_applications";
const CHARTER_AUTHORIZERS_TABLE = "charter_authorizers";
const COHORT_PARTICIPATION_TABLE  = "cohort_participation";
const COHORTS_TABLE = "cohorts";
const EMAIL_ADDRESSES_TABLE = "email_addresses";
const EMAIL_DRAFTS_TABLE = "email_drafts";
const EVENT_ATTENDANCE_TABLE = "event_attendance";
const EVENT_LIST_TABLE = "event_list";
const GOVERNANCE_DOCS_TABLE = "governance_docs";
const GRANTS_TABLE = "grants";
const GROUP_EXEMPTION_ACTIONS_TABLE = "group_exemption_actions";
const GUIDE_ASSIGNMENTS_TABLE = "guide_assignments";
const GUIDES_TABLE = "guides";
const LOANS_TABLE = "loans";
const MEMBERSHIP_ACTIONS_TABLE = "membership_actions";
const MONTESSORI_CERTS_TABLE = "montessori_certs";
const NINE_NINETIES_TABLE = "nine_nineties";
const OPEN_DATE_REVISIONS = "open_date_revisions";
const PEOPLE_TABLE = "people";
const PEOPLE_EDUCATOR_EARLY_CULTIVATION_TABLE = "people_educator_early_cultivation";
const PEOPLE_ROLES_ASSOCIATIONS_TABLE = "people_roles_associations";
const PEOPLE_SYSTEMS_TABLE = "people_systems";
const SCHOOL_REPORTS_TABLE = "school_reports_and_submissions";
const SCHOOL_SSJ_DATA_TABLE = "school_ssj_data";
const SSJ_FILLOUT_FORMS_TABLE = "ssj_fillout_forms";

export async function createSchool(payload: Record<string, any>) {
  const { data, error } = await supabase
    .from(SCHOOLS_TABLE)
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateSchool(id: string, patch: Record<string, any>) {
  const { data, error } = await supabase
    .from(SCHOOLS_TABLE)
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteSchool(id: string) {
  // Prefer soft-delete if supported by schema (archived flag)
  const { data, error } = await supabase
    .from(SCHOOLS_TABLE)
    .update({ archived: true })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateCharter(id: string, patch: Record<string, any>) {
  const { data, error } = await supabase
    .from(CHARTERS_TABLE)
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateEducator(id: string, patch: Record<string, any>) {
  const { data, error } = await supabase
    .from(PEOPLE_TABLE)
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function createNote(payload: Record<string, any>) {
  const { data, error } = await supabase
    .from(NOTES_TABLE)
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateNote(id: string, patch: Record<string, any>) {
  const { data, error } = await supabase
    .from(NOTES_TABLE)
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteNote(id: string) {
  const { error } = await supabase
    .from(NOTES_TABLE)
    .delete()
    .eq("id", id);
  if (error) throw error;
  return true;
}
