// /schema-types-export : typed schema metadata for multiple schemas
// Adds per-column keys/uniques/FKs & compact rollups
// Schemas default: public, gsync, ref_tables, storage
// Assumes the following SQL helpers exist (see §2):
//   public.get_catalog_tables(text[])
//   public.get_catalog_columns(text[])
//   public.get_catalog_enums(text[])
//   public.get_catalog_keys(text[])
//   public.get_catalog_fks(text[])
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
const DEFAULT_SCHEMAS = [
  "public",
  "gsync",
  "storage"
];
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
    const { pathname } = url;
    if (!pathname.startsWith("/schema-types-export")) {
      return error("Route must start with /schema-types-export", undefined, 404);
    }
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
    if (req.method !== "GET") return error("Only GET is supported", undefined, 405);
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
    // Fetch all catalogs in parallel
    const [tablesRes, colsRes, enumsRes, keysRes, fksRes] = await Promise.all([
      supabase.rpc("get_catalog_tables", {
        schemas
      }),
      supabase.rpc("get_catalog_columns", {
        schemas
      }),
      supabase.rpc("get_catalog_enums", {
        schemas
      }),
      supabase.rpc("get_catalog_keys", {
        schemas
      }),
      supabase.rpc("get_catalog_fks", {
        schemas
      })
    ]);
    if (tablesRes.error) return error("get_catalog_tables failed", tablesRes.error);
    if (colsRes.error) return error("get_catalog_columns failed", colsRes.error);
    if (enumsRes.error) return error("get_catalog_enums failed", enumsRes.error);
    if (keysRes.error) return error("get_catalog_keys failed", keysRes.error);
    if (fksRes.error) return error("get_catalog_fks failed", fksRes.error);
    const tables = tablesRes.data ?? [];
    const columns = colsRes.data ?? [];
    const enums = enumsRes.data ?? [];
    const keys = keysRes.data ?? [];
    const fks = fksRes.data ?? [];
    // ----- Group helpers -----
    const keyFor = (s, t)=>`${s}.${t}`;
    // columns_by_table
    const columnsByTable = new Map();
    for (const c of columns){
      const k = keyFor(c.schema_name, c.table_name);
      const arr = columnsByTable.get(k) ?? [];
      arr.push(c);
      columnsByTable.set(k, arr);
    }
    for (const [, arr] of columnsByTable){
      arr.sort((a, b)=>(a.ordinal_position ?? 0) - (b.ordinal_position ?? 0));
    }
    // enums_by_type → { "<schema>.<type>": [ {label, sort_order, ...}, ... ] }
    const enumsByType = new Map();
    for (const e of enums){
      const k = keyFor(e.enum_schema, e.enum_type);
      const arr = enumsByType.get(k) ?? [];
      arr.push(e);
      enumsByType.set(k, arr);
    }
    for (const [, arr] of enumsByType){
      arr.sort((a, b)=>(a.sort_order ?? 0) - (b.sort_order ?? 0));
    }
    // Primary keys & unique constraints
    // keys rows: { schema_name, table_name, constraint_name, constraint_type ('PRIMARY KEY'|'UNIQUE'), columns: text[] }
    const pkByTable = new Map();
    const uniqueByTable = new Map();
    const uniqueSingleByTable = new Map();
    for (const k of keys){
      const tkey = keyFor(k.schema_name, k.table_name);
      if (k.constraint_type === "PRIMARY KEY") {
        const set = pkByTable.get(tkey) ?? new Set();
        for (const col of k.columns ?? [])set.add(col);
        pkByTable.set(tkey, set);
      } else if (k.constraint_type === "UNIQUE") {
        const arr = uniqueByTable.get(tkey) ?? [];
        arr.push({
          constraint_name: k.constraint_name,
          columns: k.columns ?? []
        });
        uniqueByTable.set(tkey, arr);
        if ((k.columns?.length ?? 0) === 1) {
          const s = uniqueSingleByTable.get(tkey) ?? new Set();
          s.add(k.columns[0]);
          uniqueSingleByTable.set(tkey, s);
        }
      }
    }
    // Foreign keys (grouped and per column index)
    // fks rows: { schema_name, table_name, constraint_name, columns: text[], ref_schema, ref_table, ref_columns: text[] }
    const fksByTable = new Map();
    const fkColIndex = new Map(); // tableKey -> colName -> FK refs[]
    for (const fk of fks){
      const tkey = keyFor(fk.schema_name, fk.table_name);
      const entry = {
        constraint_name: fk.constraint_name,
        columns: fk.columns ?? [],
        references: {
          schema: fk.ref_schema,
          table: fk.ref_table,
          columns: fk.ref_columns ?? []
        }
      };
      // by table
      const arr = fksByTable.get(tkey) ?? [];
      arr.push(entry);
      fksByTable.set(tkey, arr);
      // per column mapping
      let tableMap = fkColIndex.get(tkey);
      if (!tableMap) {
        tableMap = new Map();
        fkColIndex.set(tkey, tableMap);
      }
      const cols = fk.columns ?? [];
      const rcols = fk.ref_columns ?? [];
      for(let i = 0; i < cols.length; i++){
        const c = cols[i];
        const rc = rcols[i];
        const list = tableMap.get(c) ?? [];
        list.push({
          constraint_name: fk.constraint_name,
          ref_schema: fk.ref_schema,
          ref_table: fk.ref_table,
          ref_column: rc,
          composite: cols.length > 1,
          composite_columns: cols,
          composite_ref_columns: rcols
        });
        tableMap.set(c, list);
      }
    }
    // Build enriched per-column metadata
    const columnsDetailedByTable = new Map();
    for (const [tkey, cols] of columnsByTable.entries()){
      const [schema_name, table_name] = tkey.split(".");
      const detailed = [];
      for (const c of cols){
        const pkSet = pkByTable.get(tkey) ?? new Set();
        const uniqSingles = uniqueSingleByTable.get(tkey) ?? new Set();
        const uniqConstraints = (uniqueByTable.get(tkey) ?? []).filter((u)=>(u.columns ?? []).includes(c.column_name));
        // normalize nullable flag (works if boolean or 'YES'/'NO')
        const isNullable = c.is_nullable === true || c.is_nullable === "YES" || c.is_nullable === "yes" || c.is_nullable === "t" || c.is_nullable === "true";
        const fkList = fkColIndex.get(tkey)?.get(c.column_name) ?? [];
        detailed.push({
          schema_name,
          table_name,
          column_name: c.column_name,
          ordinal_position: c.ordinal_position,
          data_type: c.data_type ?? c.udt_name ?? null,
          udt_schema: c.udt_schema ?? null,
          udt_name: c.udt_name ?? null,
          default: c.column_default ?? null,
          is_nullable: !!isNullable,
          is_primary_key: pkSet.has(c.column_name),
          is_unique: uniqSingles.has(c.column_name),
          unique_constraints: uniqConstraints.map((u)=>({
              constraint_name: u.constraint_name,
              columns: u.columns
            })),
          foreign_keys: fkList
        });
      }
      columnsDetailedByTable.set(tkey, detailed);
    }
    // Rollups as plain objects for easy JSON use
    const primaryKeysByTable = Object.fromEntries(Array.from(pkByTable.entries()).map(([k, set])=>[
        k,
        Array.from(set)
      ]));
    const uniqueConstraintsByTable = Object.fromEntries(Array.from(uniqueByTable.entries()).map(([k, arr])=>[
        k,
        arr
      ]));
    const foreignKeysByTable = Object.fromEntries(Array.from(fksByTable.entries()).map(([k, arr])=>[
        k,
        arr
      ]));
    const payload = {
      requested_schemas: schemas,
      generated_at: new Date().toISOString(),
      // raw lists
      tables,
      columns,
      enums,
      keys,
      foreign_keys: fks,
      // grouped / enriched
      columns_by_table: Object.fromEntries(columnsByTable),
      columns_detailed_by_table: Object.fromEntries(columnsDetailedByTable),
      enums_by_type: Object.fromEntries(enumsByType),
      primary_keys_by_table: primaryKeysByTable,
      unique_constraints_by_table: uniqueConstraintsByTable,
      foreign_keys_by_table: foreignKeysByTable
    };
    return json(payload);
  } catch (e) {
    return error("Unhandled error", String(e));
  }
});
