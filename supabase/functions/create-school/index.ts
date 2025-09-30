import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { json, ts } from "@shared/http.ts";
import { preflight } from "@shared/cors.ts";

type Values = Record<string, any>;

serve(async (req) => {
  const pf = preflight(req);
  if (pf) return pf;
  if (req.method === 'GET') {
    return json({ ok: true, function: 'create-school', at: ts() });
  }
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  try {
    const body = await req.json().catch(() => ({}));
    const values: Values = body?.values || {};

    // Required base fields
    const required = ['legal_name', 'long_name', 'short_name', 'governance_model'];
    for (const k of required) {
      const v = values[k];
      if (v == null || v === '') return json({ ok: false, error: `Missing required field: ${k}` }, 400);
    }

    // Auth contexts
    const authHeader = req.headers.get('Authorization') ?? '';
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const anon = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const serviceRole = Deno.env.get('SERVICE_ROLE_KEY') ?? '';

    // User-context for reading if needed
    const supabaseAuth = createClient(supabaseUrl, anon, { global: { headers: { Authorization: authHeader } } });
    const { data: authData } = await supabaseAuth.auth.getUser();
    const userId = authData?.user?.id as string | undefined;
    if (!userId) return json({ ok: false, error: 'Unauthorized' }, 401);

    // Privileged client for writes
    const supabase = createClient(supabaseUrl, serviceRole);

    // Build base school record. Ensure status defaults to 'Emerging'.
    const school: Record<string, any> = {
      legal_name: values.legal_name,
      long_name: values.long_name,
      short_name: values.short_name,
      governance_model: values.governance_model,
      ages_served: Array.isArray(values.ages_served) ? values.ages_served : (values.ages_served ? [values.ages_served] : null),
      program_focus: values.program_focus ?? null,
      charter_id: values.charter_id ?? null,
      status: values.status ?? 'Emerging',
    };

    // Insert school
    const { data: created, error: errCreate } = await supabase
      .from('schools')
      .insert(school)
      .select('id')
      .single();
    if (errCreate) return json({ ok: false, step: 'insert_school', error: errCreate.message }, 400);
    const newId = (created as any).id as string;

    const rollbacks: Array<() => Promise<void>> = [];

    // open_date_revisions
    if (values.proj_open_date) {
      const { error } = await supabase.from('open_date_revisions').insert({ school_id: newId, proj_open_date: values.proj_open_date });
      if (error) { await supabase.from('schools').delete().eq('id', newId); return json({ ok: false, step: 'open_date_revisions', error: error.message }, 400); }
      rollbacks.push(async () => { await supabase.from('open_date_revisions').delete().eq('school_id', newId).eq('proj_open_date', values.proj_open_date); });
    }

    // cohort_participation
    if (values.cohort) {
      const { error } = await supabase.from('cohort_participation').insert({ school_id: newId, cohort: values.cohort });
      if (error) { await supabase.from('schools').delete().eq('id', newId); return json({ ok: false, step: 'cohort_participation', error: error.message }, 400); }
      rollbacks.push(async () => { await supabase.from('cohort_participation').delete().eq('school_id', newId).eq('cohort', values.cohort); });
    }

    // locations
    if (values.school_address) {
      const loc: any = { school_id: newId, address: String(values.school_address) };
      if (typeof values.current_mail_address === 'boolean') loc.current_mail_address = values.current_mail_address;
      if (typeof values.current_physical_address === 'boolean') loc.current_physical_address = values.current_physical_address;
      const { error } = await supabase.from('locations').insert(loc);
      if (error) { await supabase.from('schools').delete().eq('id', newId); return json({ ok: false, step: 'locations', error: error.message }, 400); }
      rollbacks.push(async () => { await supabase.from('locations').delete().eq('school_id', newId).eq('address', values.school_address); });
    }

    // schools_ssj_data: target city/state
    if (values.ssj_target_city || values.ssj_target_state) {
      const row: any = { school_id: newId };
      if (values.ssj_target_city) row.ssj_target_city = String(values.ssj_target_city);
      if (values.ssj_target_state) row.ssj_target_state = String(values.ssj_target_state);
      const { error } = await supabase.from('schools_ssj_data').upsert(row, { onConflict: 'school_id' });
      if (error) { await supabase.from('schools').delete().eq('id', newId); return json({ ok: false, step: 'schools_ssj_data', error: error.message }, 400); }
      // Best-effort rollback
      rollbacks.push(async () => { await supabase.from('schools_ssj_data').delete().eq('school_id', newId); });
    }

    // guide_assignments
    const guidesToInsert: any[] = [];
    if (values.assigned_ops_guide) guidesToInsert.push({ school_id: newId, email_or_name: values.assigned_ops_guide, type: 'Ops Guide', is_active: true });
    if (values.assigned_entrepreneur_guide) guidesToInsert.push({ school_id: newId, email_or_name: values.assigned_entrepreneur_guide, type: 'Entrepreneur', is_active: true });
    if (guidesToInsert.length) {
      const { error } = await supabase.from('guide_assignments').insert(guidesToInsert);
      if (error) { await supabase.from('schools').delete().eq('id', newId); return json({ ok: false, step: 'guide_assignments', error: error.message }, 400); }
      rollbacks.push(async () => { await supabase.from('guide_assignments').delete().eq('school_id', newId); });
    }

    return json({ ok: true, id: newId });
  } catch (e: any) {
    return json({ ok: false, error: e?.message || 'unexpected error' }, 500);
  }
});
