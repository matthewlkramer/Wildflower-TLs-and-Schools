import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useDetailsTeacher(id?: string) {
  return useQuery<{ [k: string]: any }>({
    queryKey: ["supabase/details_educators", id],
    enabled: !!id,
    queryFn: async () => {
      // Primary: details_educators
      let { data, error } = await supabase
        .from("details_educators")
        .select("*")
        .eq("id", id!)
        .single();
      if (!error && data) return normalizeEducatorRow(data as any);

      // Fallback: minimal row from grid_educator
      const grid = await supabase
        .from("grid_educator")
        .select("*")
        .eq("id", id!)
        .single();
      if (grid.error) throw grid.error;
      return normalizeEducatorRow(grid.data as any);
    },
  });
}

function normalizeEducatorRow(row: any) {
  if (!row || typeof row !== 'object') return row;
  const out: any = { ...row };
  const setIfMissing = (key: string, ...alts: string[]) => {
    if (out[key] !== undefined && out[key] !== null) return;
    for (const a of alts) {
      if (row[a] !== undefined && row[a] !== null) { out[key] = row[a]; return; }
    }
  };
  setIfMissing('fullName', 'full_name', 'name');
  setIfMissing('discoveryStatus', 'discovery_status');
  setIfMissing('currentRole', 'current_role', 'current_role_at_active_school');
  setIfMissing('montessoriCertified', 'has_montessori_cert', 'montessori_certified');
  setIfMissing('activeSchool', 'active_school');
  setIfMissing('activeSchoolStageStatus', 'active_school_stage_status');
  setIfMissing('currentlyActiveAtSchool', 'currently_active_at_school');
  setIfMissing('primaryPhone', 'primary_phone');
  setIfMissing('secondaryPhone', 'secondary_phone');
  setIfMissing('homeAddress', 'home_address');
  setIfMissing('pronouns', 'socioeconomic_pronouns', 'pronouns');
  setIfMissing('pronounsOther', 'socioeconomic_pronouns_other');
  setIfMissing('gender', 'socioeconomic_gender', 'gender');
  setIfMissing('genderOther', 'socioeconomic_gender_other');
  setIfMissing('lgbtqia', 'socioeconomic_lgbtqia_identifying');
  setIfMissing('raceEthnicity', 'race_ethnicity', 'socioeconomic_race_ethnicity');
  setIfMissing('raceEthnicityOther', 'socioeconomic_race_ethnicity_other');
  setIfMissing('primaryLanguage', 'primary_language');
  setIfMissing('otherLanguages', 'other_languages');
  setIfMissing('educationalAttainment', 'educ_attainment', 'educational_attainment');
  // Financial background
  setIfMissing('householdIncome', 'hh_income');
  setIfMissing('incomeBackground', 'childhood_income');
  setIfMissing('excludeFromEmailLogging', 'exclude_from_email_logging');
  setIfMissing('inactiveFlag', 'inactive_flag');
  // Languages (arrays)
  setIfMissing('primaryLanguage', 'primary_languages', 'primary_language');
  setIfMissing('otherLanguages', 'other_languages', 'other_language');
  // Early cultivation fields mapping to UI expectations
  setIfMissing('firstContactAges', 'first_contact_ages');
  setIfMissing('firstContactGovernance', 'first_contact_governance_model');
  setIfMissing('firstContactInterests', 'first_contact_interests');
  setIfMissing('firstContactNotesOnPreWildflowerEmployment', 'first_contact_notes_on_pre_wf_employment');
  setIfMissing('firstContactWFSchoolEmploymentStatus', 'first_contact_wf_employment_status');
  setIfMissing('firstContactRelocate', 'first_contact_willingness_to_relocate');
  setIfMissing('opsGuideSpecificsChecklist', 'opsguide_checklist');
  setIfMissing('opsGuideFundraisingOps', 'opsguide_fundraising_opps');
  setIfMissing('opsGuideMeetingPrefTime', 'opsguide_meeting_prefs');
  setIfMissing('opsGuideReqPertinentInfo', 'opsguide_request_pertinent_info');
  setIfMissing('opsGuideSupportTypeNeeded', 'opsguide_support_type_needed');
  setIfMissing('targetGeo', 'target_geo_combined');
  // Normalize arrays where expected
  const toArray = (v: any) => Array.isArray(v) ? v : (v ? [String(v)] : []);
  if (out.raceEthnicity !== undefined) out.raceEthnicity = toArray(out.raceEthnicity);
  if (out.primaryLanguage !== undefined) out.primaryLanguage = toArray(out.primaryLanguage);
  if (out.otherLanguages !== undefined) out.otherLanguages = toArray(out.otherLanguages);
  return out;
}

export function useDetailsSchool(id?: string) {
  return useQuery<{ [k: string]: any }>({
    queryKey: ["supabase/details_schools", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("details_schools")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data as any;
    },
  });
}

export function useDetailsCharter(id?: string) {
  return useQuery<{ [k: string]: any }>({
    queryKey: ["supabase/details_charters", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("details_charters")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data as any;
    },
  });
}
