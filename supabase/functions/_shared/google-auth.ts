import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import { json, ts } from "./http.ts";

async function fetchToken(params: Record<string, string>) {
  const body = new URLSearchParams(params);
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!res.ok) throw new Error(`Token endpoint error: ${res.status}`);
  return await res.json();
}

export async function exchangeCode(supabase: SupabaseClient, code: string, userId: string, redirectUri: string) {
  const clientId = Deno.env.get('GOOGLE_CLIENT_ID') ?? '';
  const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET') ?? '';
  if (!clientId || !clientSecret) throw new Error('Missing Google OAuth env');

  const token = await fetchToken({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  });

  const expiresAt = new Date(Date.now() + (token.expires_in ?? 3600) * 1000).toISOString();
  // Using y-prefixed table in public schema
  const { error } = await supabase.from('ygoogle_auth_tokens').upsert({
    user_id: userId,
    access_token: token.access_token,
    refresh_token: token.refresh_token,
    expires_at: expiresAt,
    updated_at: ts(),
  });
  if (error) throw new Error(`save tokens failed: ${error.message}`);
  return { ok: true };
}

export async function refreshAccessToken(supabase: SupabaseClient, userId: string) {
  const clientId = Deno.env.get('GOOGLE_CLIENT_ID') ?? '';
  const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET') ?? '';
  const { data, error: selErr } = await supabase.from('ygoogle_auth_tokens').select('refresh_token').eq('user_id', userId).single();
  if (selErr) throw new Error(`read refresh token failed: ${selErr.message}`);
  if (!data?.refresh_token) throw new Error('No refresh token');
  const token = await fetchToken({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: data.refresh_token,
    grant_type: 'refresh_token',
  });
  const expiresAt = new Date(Date.now() + (token.expires_in ?? 3600) * 1000).toISOString();
  const { error: upErr } = await supabase.from('ygoogle_auth_tokens').upsert({
    user_id: userId,
    access_token: token.access_token,
    refresh_token: data.refresh_token,
    expires_at: expiresAt,
    updated_at: ts(),
  });
  if (upErr) throw new Error(`save refreshed token failed: ${upErr.message}`);
  return token.access_token as string;
}

export async function getValidAccessToken(supabase: SupabaseClient, userId: string) {
  const { data } = await supabase.from('ygoogle_auth_tokens').select('access_token, expires_at').eq('user_id', userId).single();
  if (!data) return null;
  const expiresAt = new Date(data.expires_at ?? 0).getTime();
  if (Date.now() + 60_000 >= expiresAt) {
    try { return await refreshAccessToken(supabase, userId); } catch { return null; }
  }
  return data.access_token as string;
}

export async function getValidAccessTokenOrThrow(supabase: SupabaseClient, userId: string) {
  const tok = await getValidAccessToken(supabase, userId);
  if (!tok) throw new Error('No valid access token');
  return tok;
}
