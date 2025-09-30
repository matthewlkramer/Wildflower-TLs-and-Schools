// supabase/functions/socials-backfill/index.ts
// deno-lint-ignore-file no-explicit-any
/// <reference lib="deno.unstable" />
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
const DEFAULT_MODEL = Deno.env.get("OPENAI_MODEL") ?? "gpt-4.1-mini";
const CONF_THRESHOLD_DEFAULT = 0.9;
const sb = createClient(SUPABASE_URL, SERVICE_KEY);
// Base school fields (no city/state here—those come from `locations`)
const SCHOOL_SELECT = "id,status,long_name,short_name,legal_name,website,facebook,instagram";
const JSON_SCHEMA = {
  name: "socials",
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      facebook_url: {
        type: [
          "string",
          "null"
        ]
      },
      instagram_url: {
        type: [
          "string",
          "null"
        ]
      },
      confidence: {
        type: [
          "number",
          "null"
        ],
        minimum: 0,
        maximum: 1
      },
      confidence_facebook: {
        type: [
          "number",
          "null"
        ],
        minimum: 0,
        maximum: 1
      },
      confidence_instagram: {
        type: [
          "number",
          "null"
        ],
        minimum: 0,
        maximum: 1
      },
      rationale: {
        type: [
          "string",
          "null"
        ]
      },
      sources: {
        type: "array",
        items: {
          type: "string"
        },
        maxItems: 5
      }
    },
    required: [
      "facebook_url",
      "instagram_url"
    ]
  },
  strict: true
};
const sleep = (ms)=>new Promise((r)=>setTimeout(r, ms));
function normalizeSocialUrl(url, kind) {
  if (!url) return null;
  try {
    const u = new URL(url.trim());
    const host = u.hostname.toLowerCase().replace(/^www\./, "");
    const path = u.pathname.replace(/\/+$/, "");
    if (kind === "facebook") {
      if (!/(^|\.)facebook\.com$|(^|\.)fb\.com$/.test(host)) return null;
      u.searchParams.delete("ref");
      u.searchParams.delete("mibextid");
      return u.toString();
    }
    if (!/(^|\.)instagram\.com$/.test(host)) return null;
    const seg0 = path.split("/").filter(Boolean)[0] || "";
    if ([
      "p",
      "reel",
      "reels",
      "explore",
      "hashtag"
    ].includes(seg0)) return null;
    return `https://www.instagram.com/${seg0}/`;
  } catch  {
    return null;
  }
}
function deriveSearchName(names) {
  // Prefer a name containing “Montessori”; else first non-empty, strip parentheses
  const pick = names.find((n)=>/montessori/i.test(n)) || names.find((n)=>n && n.trim()) || "";
  return pick.replace(/\s*\([^)]*\)\s*/g, " ").replace(/\s+/g, " ").trim();
}
async function findSocials(
  input: { names: string[]; website?: string | null; tls: string[]; location?: string | null },
  model: string,
  diagnostics = false
): Promise<SocialsOut> {
  const searchName = deriveSearchName(input.names);
  const searchHints = [
    "Preferred search terms (try several):",
    `- "${searchName} ${input.location ?? ""} Wildflower Montessori"`,
    `- "${searchName} ${input.location ?? ""} site:facebook.com"`,
    `- "${searchName} ${input.location ?? ""} site:instagram.com"`,
    input.website ? `- "site:${new URL(input.website).hostname} instagram"` : null,
  ].filter(Boolean).join("\n");

  const instructions = [
    "Find the official Facebook and Instagram **profile** URLs for this school.",
    "Use school name, Wildflower context, location, and current TL/ETL names to disambiguate.",
    "Return profile pages only (no posts/reels/hashtags). Prefer exact matches for name, domain, and geography.",
    "If unsure, choose the best candidate and lower confidence.",
    "Output JSON only per schema."
  ].join("\n");

  const userInput = [
    `School names: ${input.names.filter(Boolean).join(" | ") || "(unknown)"}`,
    `Derived search name: ${searchName || "(unknown)"}`,
    `Location: ${input.location || "(unknown)"}`,
    `Official website: ${input.website || "(unknown)"}`,
    `Current TL/ETL names: ${input.tls.length ? input.tls.join(", ") : "(unknown)"}`,
    "",
    searchHints
  ].join("\n");

  // NEW: Responses API structured outputs now live under text.format
  const textFormat = {
    type: "json_schema",
    json_schema: {
      name: "socials",
      strict: true,
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          facebook_url:         { type: ["string","null"] },
          instagram_url:        { type: ["string","null"] },
          confidence:           { type: ["number","null"], minimum: 0, maximum: 1 },
          confidence_facebook:  { type: ["number","null"], minimum: 0, maximum: 1 },
          confidence_instagram: { type: ["number","null"], minimum: 0, maximum: 1 },
          rationale:            { type: ["string","null"] },
          sources:              { type: "array", items: { type: "string" }, maxItems: 5 }
        },
        required: ["facebook_url","instagram_url"]
      }
    }
  };

  let payload: any = {
    model,
    input: userInput,
    instructions,
    max_output_tokens: 320,
    tools: [{ type: "web_search" }],
    tool_choice: "auto",
    text: { format: textFormat }
  };

  let lastStatus = 0, lastErr = "";

  for (let attempt = 0; attempt < 3; attempt++) {
    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    lastStatus = r.status;
    const body = await r.text();

    if (r.ok) {
      const data = JSON.parse(body);
      let obj: any | null = null;
      if (data.output_text) { try { obj = JSON.parse(data.output_text); } catch {} }
      if (!obj && data.output) {
        const combined = (data.output as any[]).map(o => (o.content || []).map((c: any) => c.text || "").join("")).join("");
        try { obj = JSON.parse(combined); } catch {}
      }
      if (!obj) return { facebook: null, instagram: null, raw: diagnostics ? data : undefined };

      const fb = normalizeSocialUrl(obj.facebook_url, "facebook");
      const ig = normalizeSocialUrl(obj.instagram_url, "instagram");
      return {
        facebook: fb,
        instagram: ig,
        conf_fb: obj.confidence_facebook ?? null,
        conf_ig: obj.confidence_instagram ?? null,
        conf_overall: obj.confidence ?? null,
        raw: diagnostics ? obj : undefined
      };
    }

    // Fallbacks: if structured outputs aren't supported, drop text.format and retry.
    let errMsg = "";
    try {
      const errObj = JSON.parse(body);
      const apiErr = (errObj && errObj.error) ? errObj.error : {};
      errMsg = apiErr.message || body;
      if (/text\.format|response_format|json_schema|unsupported_parameter/i.test(errMsg) && payload.text) {
        delete payload.text;             // retry without schema enforcement
        continue;
      }
      if (r.status === 429 || r.status >= 500) {
        await sleep(500 * (attempt + 1));
        continue;
      }
    } catch {
      errMsg = body;
    }
    lastErr = errMsg;
    break;
  }

  return {
    facebook: null,
    instagram: null,
    diag: diagnostics ? { status: lastStatus, error: lastErr, bodySnippet: lastErr.slice(0, 400) } : undefined
  };
}

// ---------- data helpers ----------
/** TL/ETL names with is_active = true (no date windowing). */ async function fetchTLMap(schoolIds) {
  if (!schoolIds.length) return new Map();
  const { data, error } = await sb.from("people_roles_associations").select("school_id, role, is_active, people:people_id(full_name)").in("school_id", schoolIds).in("role", [
    "TL",
    "ETL"
  ]).eq("is_active", true);
  if (error) throw error;
  const map = new Map();
  for (const row of data ?? []){
    const name = row.people?.full_name || "";
    if (!name) continue;
    const arr = map.get(row.school_id) ?? [];
    if (!arr.includes(name)) arr.push(name);
    map.set(row.school_id, arr);
  }
  return map;
}
/** Candidate schools:
 *  - status = 'Open'
 *  - OR status = 'Emerging' AND school_ssj_data.ssj_stage IN ('Startup','Year 1')
 *  - If !force, only where facebook IS NULL AND instagram IS NULL
 *  - Optional filter by ids
 */ 
async function fetchSchools(opts: { limit: number; force: boolean; ids?: string[] }) {
  const onlyNulls = !opts.force;

  const applyCommon = (q: any) => {
    if (opts.ids && opts.ids.length) q = q.in("id", opts.ids);
    if (onlyNulls) q = q.is("facebook", null).is("instagram", null);
    return q;
  };

  // Open
  const { data: openData, error: openErr } = await applyCommon(
    sb.from("schools").select(SCHOOL_SELECT).eq("status", "Open")
  );
  if (openErr) throw openErr;

  // Emerging + stage filter via inner join
  const { data: emergData, error: emergErr } = await applyCommon(
    sb.from("schools")
      .select(SCHOOL_SELECT + ", school_ssj_data!inner(ssj_stage)")
      .eq("status", "Emerging")
      .in("school_ssj_data.ssj_stage", ["Startup", "Year 1"])
  );
  if (emergErr) throw emergErr;

  // Union de-dupe then limit
  const byId = new Map<string, any>();
  for (const r of (openData ?? []))  byId.set(r.id, r);
  for (const r of (emergData ?? [])) byId.set(r.id, r);

  return Array.from(byId.values()).slice(0, opts.limit);
}

/** Location map: pick locations.current_physical_address = true; if multiple, most recent by id. */ async function fetchLocationMap(schoolIds) {
  if (!schoolIds.length) return new Map();
  const { data, error } = await sb.from("locations").select("id,school_id,city,state,current_physical_address").in("school_id", schoolIds).eq("current_physical_address", true).order("id", {
    ascending: false
  }); // latest first
  if (error) throw error;
  const map = new Map();
  for (const row of data ?? []){
    if (map.has(row.school_id)) continue; // keep the latest one only
    const city = (row.city || "").toString().trim();
    const state = (row.state || "").toString().trim();
    const loc = [
      city,
      state
    ].filter(Boolean).join(", ");
    if (loc) map.set(row.school_id, loc);
  }
  return map;
}
// ---------- update & pool ----------
async function updateSchool(id, changes, dry) {
  if (dry) return {
    id,
    updated: false
  };
  const payload = {};
  if (typeof changes.facebook !== "undefined" && changes.facebook) payload.facebook = changes.facebook;
  if (typeof changes.instagram !== "undefined" && changes.instagram) payload.instagram = changes.instagram;
  if (!Object.keys(payload).length) return {
    id,
    updated: false
  };
  const { error } = await sb.from("schools").update(payload).eq("id", id);
  if (error) throw error;
  return {
    id,
    updated: true,
    payload
  };
}
async function runPool(items, limit, fn) {
  const results = [];
  let i = 0;
  const workers = Array(Math.min(limit, Math.max(1, items.length))).fill(0).map(async ()=>{
    while(i < items.length){
      const idx = i++;
      results[idx] = await fn(items[idx], idx);
    }
  });
  await Promise.all(workers);
  return results;
}
// ---------- handler ----------
serve(async (req)=>{
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, content-type",
        "Access-Control-Allow-Methods": "POST, OPTIONS"
      }
    });
  }
  try {
    const body = await req.json().catch(()=>({}));
    const limit = Math.max(1, Math.min(500, body.limit ?? 50));
    const force = !!(body.force ?? false);
    const dry = !!(body.dry_run ?? false);
    const ids = Array.isArray(body.ids) && body.ids.length ? body.ids : undefined;
    const model = body.model && String(body.model) || DEFAULT_MODEL;
    const parallel = Math.max(1, Math.min(8, body.parallel ?? 3));
    const confThresh = typeof body.confidence_threshold === "number" ? body.confidence_threshold : CONF_THRESHOLD_DEFAULT;
    const schools = await fetchSchools({
      limit,
      force,
      ids
    });
    if (!schools.length) return json({
      ok: true,
      processed: 0,
      updated: 0,
      skipped: 0,
      note: "No candidate schools."
    });
    const idList = schools.map((s)=>s.id);
    const [tlMap, locMap] = await Promise.all([
      fetchTLMap(idList),
      fetchLocationMap(idList)
    ]);
    const diagnostics = body && body.diagnostics === true;
    let updated = 0, skipped = 0;
    const rows = await runPool(schools, parallel, async (s)=>{
      const names = [
        s.long_name,
        s.short_name,
        s.legal_name
      ].filter(Boolean);
      const tls = tlMap.get(s.id) ?? [];
      const loc = locMap.get(s.id) ?? null;
      // TIP: try gpt-5-mini first; fall back to 4.1-mini if you hit access errors
      const mdl = model || "gpt-5-mini";
      const out = await findSocials({
        names,
        website: s.website,
        tls,
        location: loc
      }, mdl, diagnostics);
      const fbLow = (out.conf_fb ?? out.conf_overall ?? 0) < confThresh;
      const igLow = (out.conf_ig ?? out.conf_overall ?? 0) < confThresh;
      const facebook = out.facebook ? out.facebook + (fbLow ? "?" : "") : null;
      const instagram = out.instagram ? out.instagram + (igLow ? "?" : "") : null;
      const hasFB = !!s.facebook;
      const hasIG = !!s.instagram;
      const changes = {};
      if (facebook && (force || !hasFB)) changes.facebook = facebook;
      if (instagram && (force || !hasIG)) changes.instagram = instagram;
      if (!("facebook" in changes) && !("instagram" in changes)) {
        skipped++;
        return {
          id: s.id,
          action: "skip",
          names,
          location: loc,
          tls,
          found: {
            facebook,
            instagram
          },
          confidences: {
            fb: out.conf_fb,
            ig: out.conf_ig,
            overall: out.conf_overall
          },
          diag: out.diag
        };
      }
      try {
        const res = await updateSchool(s.id, changes, dry);
        if (res.updated) updated++;
        return {
          id: s.id,
          action: dry ? "dry-run" : "update",
          changes,
          confidences: {
            fb: out.conf_fb,
            ig: out.conf_ig,
            overall: out.conf_overall
          },
          diag: out.diag
        };
      } catch (e) {
        return {
          id: s.id,
          action: "error",
          error: String(e?.message || e),
          diag: out.diag
        };
      }
    });
    return json({
      ok: true,
      processed: schools.length,
      updated,
      skipped,
      dry_run: dry,
      model,
      confidence_threshold: confThresh,
      rows
    });
  } catch (e) {
    return json({
      ok: false,
      error: String(e?.message || e)
    }, 500);
  }
});
function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Connection": "keep-alive"
    }
  });
}
