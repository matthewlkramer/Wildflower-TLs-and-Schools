export function json(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
export const ts = () => new Date().toISOString();

