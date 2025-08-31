/*
  Script: AI-assisted fill of Website/Facebook/Instagram for Startup/Open schools
  - Reads schools from Airtable where {Stage_Status} is Startup or Open
  - For missing Website/Facebook/Instagram, gathers candidate links via DuckDuckGo
  - Uses OpenAI to select the best links from candidates
  - Default is dry-run (prints proposed changes). Pass --write to apply updates.
  - Options: --limit=N, --concurrency=N, --model=gpt-4o-mini
*/

import 'dotenv/config';
import Airtable from 'airtable';
import fetch from 'node-fetch';
import OpenAI from 'openai';

type CandidateSets = {
  website: string[];
  facebook: string[];
  instagram: string[];
};

type AiPick = {
  website?: string | null;
  facebook?: string | null;
  instagram?: string | null;
  reasoning?: string;
  confidence?: number; // 0..1
};

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
  console.error('Missing AIRTABLE_API_KEY or AIRTABLE_BASE_ID in environment');
  process.exit(1);
}
if (!OPENAI_API_KEY) {
  console.error('Missing OPENAI_API_KEY in environment');
  process.exit(1);
}

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const args = process.argv.slice(2);
const doWrite = args.includes('--write');
const limitArg = args.find(a => a.startsWith('--limit='));
const concurrencyArg = args.find(a => a.startsWith('--concurrency='));
const modelArg = args.find(a => a.startsWith('--model='));
const offsetArg = args.find(a => a.startsWith('--offset='));
const nameFilterArg = args.find(a => a.startsWith('--nameContains='));
const debug = args.includes('--debug');
const llmOnly = args.includes('--llm-only') || args.includes('--llmOnly');
const websiteFirst = args.includes('--website-first') || args.includes('--websiteFirst');
const findWebsite = args.includes('--find-website') || args.includes('--findWebsite');
const maxToProcess = limitArg ? Math.max(1, parseInt(limitArg.split('=')[1], 10) || 0) : undefined;
const offset = offsetArg ? Math.max(0, parseInt(offsetArg.split('=')[1], 10) || 0) : 0;
const concurrency = concurrencyArg ? Math.max(1, parseInt(concurrencyArg.split('=')[1], 10) || 2) : 2;
const model = modelArg ? modelArg.split('=')[1] : 'gpt-4o-mini';

function sleep(ms: number) { return new Promise(res => setTimeout(res, ms)); }

async function fetchWithTimeout(url: string, ms: number): Promise<string | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ms);
  try {
    const resp = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; WildflowerBot/1.0)' },
      // @ts-ignore node-fetch supports AbortController
      signal: controller.signal
    });
    if (!resp.ok) return null;
    return await resp.text();
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function normalizeFacebookUrl(u: string): string | null {
  try {
    const url = new URL(u, 'https://www.facebook.com');
    if (url.hostname.endsWith('facebook.com') || url.hostname.endsWith('m.facebook.com')) {
      url.hostname = 'www.facebook.com';
      url.protocol = 'https:';
    }
    // Strip tracking params
    url.searchParams.delete('utm_source');
    url.searchParams.delete('utm_medium');
    url.searchParams.delete('utm_campaign');
    url.searchParams.delete('__so__');
    url.searchParams.delete('__rv__');
    url.searchParams.delete('mibextid');
    return url.toString();
  } catch { return null; }
}

async function resolveInstagramProfileFromPost(u: string): Promise<string | null> {
  try {
    const html = await fetchWithTimeout(u, 8000);
    if (!html) return null;
    const reOwner = /\"owner\"\s*:\s*\{[^}]*\"username\"\s*:\s*\"([A-Za-z0-9_.]+)\"/;
    const m1 = reOwner.exec(html);
    if (m1 && m1[1]) {
      return `https://www.instagram.com/${m1[1]}/`;
    }
    const metaUser = /instagram:\/\/user\?username=([A-Za-z0-9_.]+)/.exec(html);
    if (metaUser && metaUser[1]) return `https://www.instagram.com/${metaUser[1]}/`;
    return null;
  } catch { return null; }
}

async function normalizeInstagramUrl(u: string): Promise<string | null> {
  try {
    const url = new URL(u, 'https://www.instagram.com');
    url.hostname = 'www.instagram.com';
    url.protocol = 'https:';
    url.search = '';
    url.hash = '';
    const parts = url.pathname.split('/').filter(Boolean);
    if (parts.length === 0) return 'https://www.instagram.com/';
    if (parts[0] === 'p' || parts[0] === 'reel' || parts[0] === 'tv') {
      const prof = await resolveInstagramProfileFromPost(url.toString());
      return prof;
    }
    const username = parts[0];
    return `https://www.instagram.com/${username}/`;
  } catch { return null; }
}

function isOrgWideSocial(u: string): boolean {
  try {
    const url = new URL(u);
    const host = url.hostname.toLowerCase();
    const path = url.pathname.toLowerCase();
    // Known org handles
    const orgHandles = [
      '/wildflowerschools',
      '/wildflowerschools.pr',
      '/wildflower.wmpsc',
    ];
    if (host.includes('facebook.com') || host.includes('instagram.com')) {
      if (orgHandles.some(h => path.startsWith(h))) return true;
    }
    return false;
  } catch { return false; }
}

function isTemplateOrGenericSocial(u: string): boolean {
  try {
    const url = new URL(u);
    const host = url.hostname.toLowerCase();
    const path = url.pathname.toLowerCase();
    if (!(host.includes('facebook.com') || host.includes('instagram.com'))) return true;
    const bannedHandles = [
      '/wix', '/facebook', '/instagram', '/help', '/policies', '/policy', '/privacy', '/terms', '/share', '/sharer', '/pages/create'
    ];
    if (bannedHandles.some(h => path.startsWith(h))) return true;
    // Also filter numeric/people pages if they look unrelated? Keep for now.
    return false;
  } catch { return true; }
}

function extractHttpLinks(html: string): string[] {
  const links: string[] = [];
  const hrefRe = /href=["']([^"']+)["']/g;
  let m: RegExpExecArray | null;
  while ((m = hrefRe.exec(html)) !== null) {
    try {
      const url = m[1];
      if (url.startsWith('http')) links.push(url);
      if (url.startsWith('/l/?kh=')) {
        // Bing redir sometimes
        const u = new URL('https://www.bing.com' + url);
        const target = u.searchParams.get('u');
        if (target && target.startsWith('http')) links.push(target);
      }
      if (url.includes('duckduckgo.com/l/?uddg=')) {
        const u = new URL(url);
        const target = u.searchParams.get('uddg');
        if (target) links.push(decodeURIComponent(target));
      }
    } catch {}
  }
  const filtered = links.filter(u => {
    // Exclude obvious assets and Bing infra
    if (/\.(css|png|jpg|jpeg|gif|svg|ico)(\?|$)/i.test(u)) return false;
    if (/^https?:\/\/r\.bing\.com\//.test(u)) return false;
    if (/^https?:\/\/rafd\.bing\.com\//.test(u)) return false;
    if (/^https?:\/\/th\.bing\.com\//.test(u)) return false;
    if (/^https?:\/\/www\.bing\.com\/$/.test(u)) return false;
    return true;
  });
  return Array.from(new Set(filtered));
}

async function searchLinks(query: string): Promise<string[]> {
  // Try DuckDuckGo HTML
  const ddgUrl = `https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
  const ddgHtml = await fetchWithTimeout(ddgUrl, 15000);
  if (ddgHtml) {
    const ddgLinks = extractHttpLinks(ddgHtml);
    if (ddgLinks.length) return ddgLinks;
  }
  // Fallback to Bing HTML
  const bingUrl = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
  const bingHtml = await fetchWithTimeout(bingUrl, 15000);
  if (bingHtml) {
    const bingLinks = extractHttpLinks(bingHtml);
    if (bingLinks.length) return bingLinks;
  }
  // Fallback to Brave Search HTML
  const braveUrl = `https://search.brave.com/search?q=${encodeURIComponent(query)}`;
  const braveHtml = await fetchWithTimeout(braveUrl, 15000);
  if (braveHtml) {
    const braveLinks = extractHttpLinks(braveHtml);
    if (braveLinks.length) return braveLinks;
  }
  return [];
}

function uniqueUrls(urls: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const u of urls) {
    try {
      const parsed = new URL(u);
      const key = parsed.hostname + parsed.pathname;
      if (!seen.has(key)) { seen.add(key); out.push(parsed.toString()); }
    } catch {}
  }
  return out;
}

function getDomain(url?: string): string | undefined {
  if (!url) return undefined;
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, '');
  } catch { return undefined; }
}

async function extractSocialsFromWebsite(url: string): Promise<{ facebook: string[]; instagram: string[] }> {
  try {
    const html = await fetchWithTimeout(url, 6000);
    if (!html) return { facebook: [], instagram: [] };
    const fb: string[] = [];
    const ig: string[] = [];
    const hrefRe = /href=["']([^"']+)["']/g;
    let m: RegExpExecArray | null;
    while ((m = hrefRe.exec(html)) !== null) {
      const link = m[1];
      if (/facebook\.com\//i.test(link)) {
        try {
          const abs = new URL(link, url).toString();
          const norm = normalizeFacebookUrl(abs);
          if (norm) fb.push(norm);
        } catch {}
      }
      if (/instagram\.com\//i.test(link)) {
        try {
          const abs = new URL(link, url).toString();
          const norm = await normalizeInstagramUrl(abs);
          if (norm) ig.push(norm);
        } catch {}
      }
    }
    const fbUnique = uniqueUrls(fb)
      .filter(u => !/\/share\/|sharer|login|help|policy|privacy|terms/i.test(u))
      .filter(u => !isOrgWideSocial(u))
      .filter(u => !isTemplateOrGenericSocial(u));
    const igUnique = uniqueUrls(ig)
      .filter(u => !/\/share\/|login|help|policy|privacy|terms/i.test(u))
      .filter(u => !isOrgWideSocial(u))
      .filter(u => !isTemplateOrGenericSocial(u));
    return { facebook: fbUnique, instagram: igUnique };
  } catch {
    return { facebook: [], instagram: [] };
  }
}

async function gatherCandidates(schoolName: string, city?: string, state?: string, existingWebsite?: string) : Promise<CandidateSets> {
  if (llmOnly) {
    return { website: [], facebook: [], instagram: [] };
  }
  if (websiteFirst && existingWebsite) {
    const fromSite = await extractSocialsFromWebsite(existingWebsite);
    return { website: [], facebook: fromSite.facebook, instagram: fromSite.instagram };
  }

  const quoted = `"${schoolName}"`;
  const loc = [city, state].filter(Boolean).join(' ').trim();
  const domain = getDomain(existingWebsite);

  const websiteQueries: string[] = [
    `${quoted} ${loc} site:wildflowerschools.org`.trim(),
    `${quoted} ${loc} official website`.trim(),
    `${quoted} ${loc} Montessori website`.trim(),
    `${schoolName} ${loc} website`.trim(),
  ];
  if (domain) {
    websiteQueries.push(`${quoted} site:${domain}`);
  }

  const facebookQueries: string[] = [
    `${quoted} ${loc} site:facebook.com`.trim(),
    `${schoolName} ${loc} Facebook`.trim(),
    `${quoted} ${loc} site:m.facebook.com`.trim(),
  ];
  if (domain) {
    facebookQueries.push(`${domain} site:facebook.com`);
  }

  const instagramQueries: string[] = [
    `${quoted} ${loc} site:instagram.com`.trim(),
    `${schoolName} ${loc} Instagram`.trim(),
    `${quoted} ${loc} site:instagram.com/${encodeURIComponent(schoolName.split(/\s+/).join(''))}`.trim(),
  ];
  if (domain) {
    instagramQueries.push(`${domain} site:instagram.com`);
  }

  const websiteResults: string[] = [];
  for (const q of websiteQueries) {
    websiteResults.push(...await searchLinks(q));
    await sleep(200);
  }
  const facebookResults: string[] = [];
  for (const q of facebookQueries) {
    facebookResults.push(...await searchLinks(q));
    await sleep(200);
  }
  const instagramResults: string[] = [];
  for (const q of instagramQueries) {
    instagramResults.push(...await searchLinks(q));
    await sleep(200);
  }

  if (existingWebsite) {
    const fromSite = await extractSocialsFromWebsite(existingWebsite);
    facebookResults.push(...fromSite.facebook);
    instagramResults.push(...fromSite.instagram);
  }

  return {
    website: uniqueUrls(websiteResults),
    facebook: uniqueUrls(facebookResults).filter(u => u.includes('facebook.com')),
    instagram: uniqueUrls(instagramResults).filter(u => u.includes('instagram.com')),
  };
}

function pickSocialLocal(candidates: string[], hostIncludes: string): string | undefined {
  const urls = candidates
    .map(u => { try { return new URL(u); } catch { return null; } })
    .filter((u): u is URL => !!u && u.hostname.includes(hostIncludes));
  const filtered = urls.filter(u => u.pathname && u.pathname !== '/' && !/login|share|intent|sharer|help|policy|privacy|terms/i.test(u.pathname));
  return (filtered[0] || urls[0])?.toString();
}

async function aiSelectBestLinks(params: {
  school: { id: string; name: string; city?: string; state?: string };
  existing: { website?: string; facebook?: string; instagram?: string };
  candidates: CandidateSets;
}): Promise<AiPick> {
  const { school, existing, candidates } = params;
  const system = `You help select official links (website, Facebook, Instagram) for a school.
- Prefer official school websites over third-party directories.
- Prefer wildflowerschools.org pages when clearly for the same school.
- For Facebook/Instagram, avoid generic home/login pages and choose the school's page.
- If uncertain, return null for that field.
- Output strict JSON: {"website": string|null, "facebook": string|null, "instagram": string|null, "confidence": number, "reasoning": string}`;

  const user = {
    role: 'user' as const,
    content: [
      {
        type: 'text',
        text: `School context:\n- Name: ${school.name}\n- City: ${school.city || ''}\n- State: ${school.state || ''}\nExisting:\n${JSON.stringify(existing, null, 2)}\n\nCandidates:\n${JSON.stringify(candidates, null, 2)}\n\nReturn JSON only.`
      }
    ]
  };

  const resp = await openai.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: system },
      user
    ],
    temperature: 0.2,
    response_format: { type: 'json_object' }
  });

  const raw = resp.choices?.[0]?.message?.content || '{}';
  try {
    const parsed = JSON.parse(raw);
    return parsed as AiPick;
  } catch (e) {
    return { website: null, facebook: null, instagram: null, confidence: 0, reasoning: 'Failed to parse JSON' };
  }
}

async function aiDirectSuggest(params: {
  school: { id: string; name: string; city?: string; state?: string };
  existing: { website?: string; facebook?: string; instagram?: string };
}): Promise<AiPick> {
  const { school, existing } = params;
  const system = `You select official links for a school using your knowledge.
- If you do not know a link, return null (do not guess).
- Prefer official school websites over directories.
- For Facebook/Instagram, return the school's page if you know it; else null.
- Output strict JSON: {"website": string|null, "facebook": string|null, "instagram": string|null, "confidence": number, "reasoning": string}`;

  const user = {
    role: 'user' as const,
    content: [
      {
        type: 'text',
        text: `School context:\n- Name: ${school.name}\n- City: ${school.city || ''}\n- State: ${school.state || ''}\nExisting:\n${JSON.stringify(existing, null, 2)}\n\nReturn JSON only.`
      }
    ]
  };

  const resp = await openai.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: system },
      user
    ],
    temperature: 0.1,
    response_format: { type: 'json_object' }
  });

  const raw = resp.choices?.[0]?.message?.content || '{}';
  try {
    const parsed = JSON.parse(raw);
    return parsed as AiPick;
  } catch (e) {
    return { website: null, facebook: null, instagram: null, confidence: 0, reasoning: 'Failed to parse JSON' };
  }
}

async function validateUrlLikely(url: string, schoolName: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    const resp = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; WildflowerBot/1.0)' },
      // @ts-ignore node-fetch supports AbortController
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (!resp.ok) return false;
    const ct = resp.headers.get('content-type') || '';
    if (!/text\/(html|plain)/i.test(ct)) return true;
    const text = (await resp.text()).slice(0, 200_000).toLowerCase();
    const tokens = schoolName.toLowerCase().split(/\s+/).filter(t => t.length > 3);
    const hits = tokens.filter(t => text.includes(t)).length;
    return hits >= Math.max(1, Math.floor(tokens.length / 3));
  } catch {
    return false;
  }
}

async function run() {
  const filterFormula = "OR(LOWER({Stage_Status})='startup', LOWER({Stage_Status})='open')";
  const toUpdate: Array<{ id: string; name: string; updates: Record<string, any>; ai: AiPick }> = [];
  const missingSummary: Array<{ id: string; name: string; missing: string[] }> = [];

  let records = await base('Schools')
    .select({ filterByFormula: filterFormula })
    .all();

  if (nameFilterArg) {
    const needle = nameFilterArg.split('=')[1].toLowerCase();
    records = records.filter(r => String(r.get('Name') || r.get('School Name') || '').toLowerCase().includes(needle));
  }

  const start = offset || 0;
  const end = maxToProcess ? start + maxToProcess : records.length;
  const filtered = records.slice(start, Math.min(end, records.length));
  console.log(`Found ${records.length} schools in Startup/Open. Processing ${filtered.length} with concurrency ${concurrency} using model ${model}...`);

  let index = 0;
  const lock = new Intl.DateTimeFormat(); // noop to keep TS happy in ESM

  async function worker(workerId: number) {
    while (true) {
      const i = index++;
      if (i >= filtered.length) break;
      const rec = filtered[i];
      const name = String(rec.get('Name') || rec.get('School Name') || rec.id);
      const website = String(rec.get('Website') || '') || undefined;
      const facebook = String(rec.get('Facebook') || '') || undefined;
      const instagram = String(rec.get('Instagram') || '') || undefined;
      const city = String(rec.get('City') || '') || undefined;
      const state = String(rec.get('State') || '') || undefined;

      const missing: string[] = [];
      if (!website) missing.push('Website');
      if (!facebook) missing.push('Facebook');
      if (!instagram) missing.push('Instagram');

      if (missing.length > 0) {
        if (websiteFirst && !website && !findWebsite) {
          console.log(`[${i + 1}/${filtered.length}] ${name} - skipped (no Website; website-first mode)`);
          continue;
        }
        missingSummary.push({ id: rec.id, name, missing });
        console.log(`[${i + 1}/${filtered.length}] ${name} - missing ${missing.join(', ')} (worker ${workerId})`);
        try {
          const updates: Record<string, any> = {};

          if (websiteFirst && website) {
            const fromSite = await extractSocialsFromWebsite(website);
            if (debug) console.log('From site for', name, fromSite);
            if (!facebook && fromSite.facebook.length) {
              const pick = pickSocialLocal(fromSite.facebook, 'facebook.com');
              if (pick) updates['Facebook'] = pick;
            }
            if (!instagram && fromSite.instagram.length) {
              const pick = pickSocialLocal(fromSite.instagram, 'instagram.com');
              if (pick) updates['Instagram'] = pick;
            }
            // Normalize existing socials too (convert mobile to www, post to profile root)
            if (facebook) {
              const norm = normalizeFacebookUrl(facebook);
              if (norm && norm !== facebook) updates['Facebook'] = norm;
            }
            if (instagram) {
              const normIg = await normalizeInstagramUrl(instagram);
              if (normIg && normIg !== instagram) updates['Instagram'] = normIg;
            }
          } else if (websiteFirst && !website && findWebsite) {
            const loc = [city, state].filter(Boolean).join(' ').trim();
            const queries = [
              `"${name}" ${loc} official website`,
              `"${name}" ${loc} Montessori website`,
              `${name} ${loc} website`,
              `"${name}" site:wildflowerschools.org`
            ];
            const siteLinks: string[] = [];
            for (const q of queries) {
              siteLinks.push(...await searchLinks(q));
              await sleep(200);
            }
            const urls = uniqueUrls(siteLinks)
              .map(u => { try { return new URL(u); } catch { return null; } })
              .filter((u): u is URL => !!u)
              .filter(u => !/(facebook|instagram|twitter|tiktok|chegg|wikipedia|youtube|yelp|niche|greatschools|indeed|glassdoor|linkedin)\.com$/i.test(u.hostname));
            const tokens = name.toLowerCase().split(/\s+/).filter(t => t.length > 2);
            const coreTokens = tokens.filter(t => !['the','school','site'].includes(t));
            let pickSite: URL | undefined = urls.find(u => u.hostname.includes('wildflowerschools.org')) as URL | undefined;
            if (!pickSite) pickSite = urls.find(u => tokens.some(t => u.hostname.toLowerCase().includes(t)));
            if (pickSite) {
              const site = pickSite.origin + pickSite.pathname;
              const ok = await validateUrlLikely(site, `${name} ${city || ''} ${state || ''}`.trim());
              const host = pickSite.hostname.toLowerCase();
              const tokensInHost = coreTokens.filter(t => host.includes(t)).length;
              const hostLooksRight = host.includes('montessori') || host.includes('wildflower') || tokensInHost >= 2;
              const accept = hostLooksRight && ok;
              if (ok) {
                if (accept) updates['Website'] = site;
              }
              const fromSite2 = await extractSocialsFromWebsite(site);
              if (!facebook && fromSite2.facebook.length) {
                const pick = pickSocialLocal(fromSite2.facebook, 'facebook.com');
                if (pick) updates['Facebook'] = pick;
              }
              if (!instagram && fromSite2.instagram.length) {
                const pick = pickSocialLocal(fromSite2.instagram, 'instagram.com');
                if (pick) updates['Instagram'] = pick;
              }
            }
          } else {
            let ai: AiPick;
            if (llmOnly) {
              ai = await aiDirectSuggest({
                school: { id: rec.id, name, city, state },
                existing: { website, facebook, instagram }
              });
            } else {
              const candidates = await gatherCandidates(name, city, state, website);
              if (debug) {
                console.log('Candidates for', name, candidates);
              }
              ai = await aiSelectBestLinks({
                school: { id: rec.id, name, city, state },
                existing: { website, facebook, instagram },
                candidates
              });
            }
            if (debug) {
              console.log('AI pick for', name, ai);
            }
            if (!website && ai.website) {
              const ok = await validateUrlLikely(ai.website, name);
              if (ok) updates['Website'] = ai.website;
            }
            if (!facebook && ai.facebook) {
              const ok = await validateUrlLikely(ai.facebook, name);
              if (ok) updates['Facebook'] = ai.facebook;
            }
            if (!instagram && ai.instagram) {
              const ok = await validateUrlLikely(ai.instagram, name);
              if (ok) updates['Instagram'] = ai.instagram;
            }
          }
          if (Object.keys(updates).length > 0) {
            // In website-first branch, ai may be undefined; provide minimal metadata
            const aiMeta: AiPick = { confidence: 0.95, reasoning: websiteFirst ? 'Extracted from school website' : 'AI-selected from candidates' };
            toUpdate.push({ id: rec.id, name, updates, ai: aiMeta });
          }
        } catch (e) {
          console.warn(`AI lookup failed for ${name}:`, (e as Error)?.message || e);
        }
      } else {
        // All fields set; in website-first mode, still normalize existing socials
        if (websiteFirst) {
          const updates: Record<string, any> = {};
          if (facebook) {
            const norm = normalizeFacebookUrl(facebook);
            if (norm && norm !== facebook) updates['Facebook'] = norm;
          }
          if (instagram) {
            const normIg = await normalizeInstagramUrl(instagram);
            if (normIg && normIg !== instagram) updates['Instagram'] = normIg;
          }
          if (Object.keys(updates).length > 0) {
            toUpdate.push({ id: rec.id, name, updates, ai: { confidence: 0.98, reasoning: 'Normalized social URLs' } });
          } else {
            console.log(`[${i + 1}/${filtered.length}] ${name} - all set`);
          }
        } else {
          console.log(`[${i + 1}/${filtered.length}] ${name} - all set`);
        }
      }

      // Be a bit gentle on rate limits
      await sleep(250);
    }
  }

  await Promise.all(Array.from({ length: concurrency }, (_, i) => worker(i + 1)));

  console.log(`Schools with missing fields: ${missingSummary.length}`);
  for (const m of missingSummary) {
    console.log(`- ${m.name} (${m.id}): missing ${m.missing.join(', ')}`);
  }

  console.log(`\nProposed updates (${toUpdate.length} records):`);
  for (const u of toUpdate) {
    console.log(`- ${u.name}:`, u.updates, '| AI:', { confidence: u.ai.confidence, reasoning: u.ai.reasoning?.slice(0, 140) });
  }

  if (!doWrite) {
    console.log('\nDry run complete. Re-run with --write to apply updates.');
    return;
  }

  // Apply updates in batches of 10
  const batchSize = 10;
  for (let i = 0; i < toUpdate.length; i += batchSize) {
    const batch = toUpdate.slice(i, i + batchSize);
    const payload = batch.map(b => ({ id: b.id, fields: b.updates }));
    await base('Schools').update(payload);
    console.log(`Updated ${Math.min(i + batchSize, toUpdate.length)}/${toUpdate.length}`);
    await sleep(500);
  }

  console.log('Done.');
}

run().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
