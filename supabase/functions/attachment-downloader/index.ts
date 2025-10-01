// functions/airtable-logo-sync/index.ts
// Deno + Supabase Edge Function
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
// ---------- Config (adjust if needed) ----------
const AIRTABLE_BASE_ID = "appJBT9a4f3b7hWQ2";
const AIRTABLE_TABLE_ID = "tblfdVLTc9ij4TaLh";
const AIRTABLE_FIELDS = [
  "Logo",
  "Logo - main square",
  "Logo - flower only",
  "Logo - main rectangle"
];
const FIELD_MAP = {
  "Logo": {
    dbField: "logo",
    subdir: "main"
  },
  "Logo - main square": {
    dbField: "logo_square",
    subdir: "square"
  },
  "Logo - flower only": {
    dbField: "logo_flower_only",
    subdir: "flower"
  },
  "Logo - main rectangle": {
    dbField: "logo_rectangle",
    subdir: "rectangle"
  }
};
// Match Airtable record to Supabase schools row using this column:
const MATCH_FIELD = "old_id"; // public.schools.airtable_id == Airtable record.id
// Storage
const BUCKET = "logos";
// Behavior flags (can be overridden by request JSON body: { onlyIfEmpty, limit, dryRun })
const DEFAULT_ONLY_IF_EMPTY = true; // if target column already set, skip
const DEFAULT_LIMIT = null; // null = all records
const DEFAULT_DRY_RUN = false; // true = no writes
// ---------- Env & Clients ----------
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, {
  auth: {
    persistSession: false
  }
});
const AIRTABLE_API_KEY = Deno.env.get("AIRTABLE_API_KEY") ?? Deno.env.get("AIRTABLE_PAT") ?? ""; // must be set via `supabase secrets set`
if (!AIRTABLE_API_KEY) console.warn("⚠️ AIRTABLE_API_KEY/AIRTABLE_PAT is not set.");
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS"
};
// ---------- Helpers ----------
const sanitize = (s)=>s.replaceAll("\\", "_").replaceAll("/", "_").replaceAll("..", "_").replaceAll(" ", "_").replace(/[^\w.\-]/g, "_");
async function ensureBucketExists() {
  const { data: existing, error } = await supabase.storage.getBucket(BUCKET);
  if (error && !existing) {
    // If getBucket fails because it doesn't exist, create it.
    const { error: createErr } = await supabase.storage.createBucket(BUCKET, {
      public: false,
      fileSizeLimit: "50MB"
    });
    if (createErr) throw createErr;
  }
}
async function listAirtablePage(offset, fields = AIRTABLE_FIELDS) {
  const url = new URL(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}`);
  for (const f of fields)url.searchParams.append("fields[]", f);
  url.searchParams.set("pageSize", "100");
  if (offset) url.searchParams.set("offset", offset);
  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`
    }
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Airtable list error: ${res.status} ${text}`);
  }
  const json = await res.json();
  return {
    records: json.records ?? [],
    offset: json.offset
  };
}
async function* iterateAirtableRecords(limit) {
  let seen = 0;
  let offset = undefined;
  while(true){
    const { records, offset: next } = await listAirtablePage(offset);
    for (const r of records){
      yield r;
      seen++;
      if (limit !== null && seen >= limit) return;
    }
    if (!next) break;
    offset = next;
  }
}
async function findSchoolByAirtableId(airtableId) {
  const { data, error } = await supabase.from("schools").select("id, logo, logo_square, logo_flower_only, logo_rectangle, " + MATCH_FIELD).eq(MATCH_FIELD, airtableId).maybeSingle();
  if (error) throw error;
  return data;
}
async function uploadToStorageAndGetId(path, bytes, contentType) {
  // Upload (upsert)
  const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, bytes, {
    contentType: contentType ?? "application/octet-stream",
    upsert: true
  });
  if (upErr) throw upErr;
  // Fetch UUID from storage.objects
  const { data: obj, error: idErr } = await supabase.schema("storage").from("objects").select("id").eq("bucket_id", BUCKET).eq("name", path).maybeSingle();
  if (idErr) throw idErr;
  if (!obj?.id) throw new Error(`Uploaded object not found for path: ${path}`);
  return obj.id;
}
async function fetchBytes(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed ${res.status} for ${url}`);
  const ab = await res.arrayBuffer();
  return new Uint8Array(ab);
}
function getFirstAttachment(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return null;
  const a = arr[0];
  if (!a?.url || !a?.filename) return null;
  return a;
}
// ---------- Handler ----------
serve(async (req)=>{
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders
    });
  }
  try {
    const body = await req.json().catch(()=>({}));
    const onlyIfEmpty = body.onlyIfEmpty ?? DEFAULT_ONLY_IF_EMPTY;
    const limit = body.limit ?? DEFAULT_LIMIT;
    const dryRun = body.dryRun ?? DEFAULT_DRY_RUN;
    await ensureBucketExists();
    const summary = {
      scanned: 0,
      matchedSchools: 0,
      skippedNoMatch: 0,
      uploaded: 0,
      updatedRows: 0,
      dryRun,
      onlyIfEmpty,
      errors: []
    };
    for await (const rec of iterateAirtableRecords(limit)){
      summary.scanned++;
      const school = await findSchoolByAirtableId(rec.id);
      if (!school) {
        summary.skippedNoMatch++;
        continue;
      }
      summary.matchedSchools++;
      const patch = {};
      let madeChange = false;
      // Process each logo field
      for (const fieldName of AIRTABLE_FIELDS){
        const mapping = FIELD_MAP[fieldName];
        const targetCol = mapping.dbField;
        // Respect onlyIfEmpty
        if (onlyIfEmpty && school[targetCol]) continue;
        const att = getFirstAttachment(rec.fields[fieldName]);
        if (!att) continue;
        // Download & upload
        const filename = sanitize(att.filename || "file");
        const subdir = mapping.subdir;
        const path = `${school.id}/${subdir}/${filename}`;
        if (!dryRun) {
          const bytes = await fetchBytes(att.url);
          const objectId = await uploadToStorageAndGetId(path, bytes, att.type);
          patch[targetCol] = objectId;
          summary.uploaded++;
          madeChange = true;
        } else {
          // Simulate
          patch[targetCol] = school[targetCol] ?? "SIMULATED_UUID";
        }
      }
      if (madeChange && !dryRun) {
        const { error: upErr } = await supabase.from("schools").update(patch).eq("id", school.id);
        if (upErr) {
          summary.errors.push(`Update failed for school ${school.id}: ${upErr.message}`);
        } else {
          summary.updatedRows++;
        }
      }
    }
    return new Response(JSON.stringify({
      ok: true,
      summary
    }, null, 2), {
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      },
      status: 200
    });
  } catch (err) {
    return new Response(JSON.stringify({
      ok: false,
      error: err?.message ?? String(err)
    }), {
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      },
      status: 500
    });
  }
});
