// Refresh email_filter_addresses from Airtable "Email Addresses" once-off or via scheduler
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

type AirtableRecord = { id: string; fields: Record<string, any> };

async function fetchAllAirtableRows(baseId: string, tableName: string, apiKey: string): Promise<AirtableRecord[]> {
  const out: AirtableRecord[] = [];
  let offset: string | undefined = undefined;
  do {
    const url = new URL(`https://api.airtable.com/v0/${encodeURIComponent(baseId)}/${encodeURIComponent(tableName)}`);
    url.searchParams.set('pageSize', '100');
    if (offset) url.searchParams.set('offset', offset);
    const res = await fetch(url, { headers: { Authorization: `Bearer ${apiKey}` } });
    if (!res.ok) throw new Error(`Airtable HTTP ${res.status}`);
    const js: any = await res.json();
    (js.records || []).forEach((r: any) => out.push({ id: r.id, fields: r.fields || {} }));
    offset = js.offset;
  } while (offset);
  return out;
}

function normalizeEmail(raw: string | undefined): string | null {
  if (!raw) return null;
  const m = raw.match(/<([^>]+)>/);
  const s = (m ? m[1] : raw).trim().toLowerCase();
  if (!s) return null;
  return s.replace(/^mailto:/, '');
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method === 'GET') return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const serviceRole = Deno.env.get('SERVICE_ROLE_KEY') ?? Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const AIRTABLE_API_KEY = Deno.env.get('AIRTABLE_API_KEY') ?? '';
    const AIRTABLE_BASE_ID = Deno.env.get('AIRTABLE_BASE_ID') ?? '';
    const AIRTABLE_EMAIL_TABLE = Deno.env.get('AIRTABLE_EMAIL_TABLE') ?? 'Email Addresses';
    if (!supabaseUrl || !serviceRole) throw new Error('Missing SUPABASE_URL or SERVICE_ROLE_KEY');
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) throw new Error('Missing AIRTABLE_API_KEY or AIRTABLE_BASE_ID');
    const supabase = createClient(supabaseUrl, serviceRole);

    // Pull all email rows
    const rows = await fetchAllAirtableRows(AIRTABLE_BASE_ID, AIRTABLE_EMAIL_TABLE, AIRTABLE_API_KEY);

    // Build unique map by normalized email
    const map = new Map<string, { email: string; educator_id: string | null }>();
    for (const r of rows) {
      const fields = r.fields || {};
      const email = normalizeEmail(String(fields['Email Address'] || ''));
      if (!email) continue;
      const educatorId = (fields['educator_id'] || fields['Educator Id'] || fields['Educator ID'] || null) ? String(fields['educator_id'] || fields['Educator Id'] || fields['Educator ID']) : null;
      map.set(email, { email, educator_id: educatorId });
    }

    const values = Array.from(map.values());
    if (values.length === 0) {
      return new Response(JSON.stringify({ error: 'No Email Addresses fetched from Airtable; aborting refresh' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Truncate then upsert for a clean refresh
    await supabase.from('email_filter_addresses').delete().neq('email', '');
    // chunk inserts
    const chunk = 500;
    for (let i = 0; i < values.length; i += chunk) {
      const slice = values.slice(i, i + chunk);
      const { error } = await supabase.from('email_filter_addresses').upsert(slice, { onConflict: 'email' });
      if (error) throw error;
    }

    return new Response(JSON.stringify({ ok: true, upserted: values.length }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || 'Error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
