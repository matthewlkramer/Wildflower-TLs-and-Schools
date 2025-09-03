export function json(body: unknown, status = 200, headers: Record<string, string> = {}) {
  const base = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  } as Record<string, string>;
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...base, ...headers },
  });
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
export const ts = () => new Date().toISOString();
