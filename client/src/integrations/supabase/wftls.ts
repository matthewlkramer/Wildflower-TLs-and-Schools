import { supabase } from "./client";

// Central table names for Schools/Charters writes.
// These should point at the base writable tables (not grid/details views).
// If your project uses different names, adjust here.
const SCHOOLS_TABLE = "schools";
const CHARTERS_TABLE = "charters";
const EDUCATORS_TABLE = "educators";
const NOTES_TABLE = "notes";

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
    .from(EDUCATORS_TABLE)
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
