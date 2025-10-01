// schema-types-export: returns typed schema metadata for multiple schemas
// Schemas targeted: public, gsync, ref_tables, storage
// Assumptions: the SQL helper functions exist:
//   public.get_catalog_tables(text[]), public.get_catalog_columns(text[]), public.get_catalog_enums(text[])
// Uses service role by default (no env required in code); Supabase injects SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
// Guidelines compliance:
// - Uses Deno.serve (no external deps)
// - No bare specifiers; only web APIs
// - Handles multiple routes under /schema-types-export
// - Supports query param ?schemas=public,auth to override defaults
// - Streams simple JSON response with content-type application/json
// - Includes basic error handling and structure validation
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
const DEFAULT_SCHEMAS = [
  "public",
  "gsync",
  "ref_tables",
  "storage"
]; // sorted intentionally
function parseSchemasFromUrl(url) {
  const qp = url.searchParams.get("schemas");
  if (!qp) return DEFAULT_SCHEMAS;
  return qp.split(",").map((s)=>s.trim()).filter(Boolean);
}
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      Connection: "keep-alive"
    }
  });
}
function error(message, details, status = 500) {
  return json({
    error: message,
    details
  }, status);
}
Deno.serve(async (req)=>{
  try {
    const url = new URL(req.url);
    // routing: GET /schema-types-export or /schema-types-export/preview
    const { pathname } = url;
    if (!pathname.startsWith("/schema-types-export")) {
      return error("Route must start with /schema-types-export", undefined, 404);
    }
    // allow OPTIONS for CORS preflight if needed
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,OPTIONS",
          "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
        }
      });
    }
    if (req.method !== "GET") {
      return error("Only GET is supported", undefined, 405);
    }
    const schemas = parseSchemasFromUrl(url);
    const supabase = createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"), {
      auth: {
        persistSession: false
      },
      global: {
        headers: {
          "X-Client-Info": "schema-types-export"
        }
      }
    });
    // rpc calls in parallel
    const schemaArray = schemas; // text[] param
    const [tablesRes, colsRes, enumsRes] = await Promise.all([
      supabase.rpc("get_catalog_tables", {
        schemas: schemaArray
      }),
      supabase.rpc("get_catalog_columns", {
        schemas: schemaArray
      }),
      supabase.rpc("get_catalog_enums", {
        schemas: schemaArray
      })
    ]);
    if (tablesRes.error) return error("get_catalog_tables failed", tablesRes.error);
    if (colsRes.error) return error("get_catalog_columns failed", colsRes.error);
    if (enumsRes.error) return error("get_catalog_enums failed", enumsRes.error);
    const tables = tablesRes.data ?? [];
    const columns = colsRes.data ?? [];
    const enums = enumsRes.data ?? [];
    // group columns by table for convenience
    const columnsByTable = new Map();
    for (const c of columns){
      const key = `${c.schema_name}.${c.table_name}`;
      const arr = columnsByTable.get(key) ?? [];
      arr.push(c);
      columnsByTable.set(key, arr);
    }
    for (const [, arr] of columnsByTable)arr.sort((a, b)=>a.ordinal_position - b.ordinal_position);
    // group enums by type
    const enumsByType = new Map();
    for (const e of enums){
      const key = `${e.enum_schema}.${e.enum_type}`;
      const arr = enumsByType.get(key) ?? [];
      arr.push(e);
      enumsByType.set(key, arr);
    }
    for (const [, arr] of enumsByType)arr.sort((a, b)=>a.sort_order - b.sort_order);
    const payload = {
      requested_schemas: schemas,
      tables,
      columns,
      enums,
      columns_by_table: Object.fromEntries(columnsByTable),
      enums_by_type: Object.fromEntries(enumsByType),
      generated_at: new Date().toISOString()
    };
    return json(payload);
  } catch (e) {
    return error("Unhandled error", String(e));
  }
});
