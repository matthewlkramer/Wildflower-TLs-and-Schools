import { sleep } from "./http.ts";

export async function apiCallWithOAuth(
  url: string | URL,
  accessToken: string,
  refresh: () => Promise<string | null>,
  init: RequestInit = {},
) {
  const doFetch = async (tok: string) => {
    const headers = new Headers(init.headers);
    headers.set('Authorization', `Bearer ${tok}`);
    return await fetch(url, { ...init, headers });
  };

  let res = await doFetch(accessToken);
  if (res.status === 401 || res.status === 403) {
    const newTok = await refresh();
    if (newTok) {
      await sleep(200);
      res = await doFetch(newTok);
    }
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}

