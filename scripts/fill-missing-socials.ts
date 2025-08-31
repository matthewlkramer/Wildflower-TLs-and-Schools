/*
  Script: Fill missing Website/Facebook/Instagram for Startup/Open schools
  - Scans Airtable "Schools" where {Stage_Status} is Startup or Open
  - If Website/Facebook/Instagram are missing, attempts to find URLs via DuckDuckGo
  - Default is dry-run (prints proposed changes). Pass --write to apply updates.
*/

import 'dotenv/config';
import Airtable from 'airtable';
import fetch from 'node-fetch';

type SchoolRecord = {
  id: string;
  name: string;
  stageStatus?: string;
  website?: string;
  facebook?: string;
  instagram?: string;
};

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
  console.error('Missing AIRTABLE_API_KEY or AIRTABLE_BASE_ID in environment');
  process.exit(1);
}

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

const args = process.argv.slice(2);
const doWrite = args.includes('--write');
const limitArg = args.find(a => a.startsWith('--limit='));
const concurrencyArg = args.find(a => a.startsWith('--concurrency='));
const maxToProcess = limitArg ? Math.max(1, parseInt(limitArg.split('=')[1], 10) || 0) : undefined;
const concurrency = concurrencyArg ? Math.max(1, parseInt(concurrencyArg.split('=')[1], 10) || 3) : 3;

function sleep(ms: number) { return new Promise(res => setTimeout(res, ms)); }

async function duckDuckGoSearch(query: string): Promise<string[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  const url = `https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
  const resp = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; WildflowerBot/1.0)'
    },
    // @ts-ignore node-fetch supports AbortController
    signal: controller.signal
  });
  clearTimeout(timeout);
  if (!resp.ok) return [];
  const html = await resp.text();
  const links: string[] = [];
  const regex = /uddg=([^&"']+)/g;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(html)) !== null) {
    try {
      const decoded = decodeURIComponent(m[1]);
      if (decoded.startsWith('http')) {
        links.push(decoded);
      }
    } catch {}
  }
  return Array.from(new Set(links));
}

function pickWebsite(candidates: string[], schoolName: string): string | undefined {
  const nameTokens = schoolName.toLowerCase().split(/\s+/).filter(t => t.length > 2);
  const urls = candidates
    .map(u => { try { return new URL(u); } catch { return null; } })
    .filter((u): u is URL => !!u);
  // Prefer obvious candidates
  const byPriority = [
    (u: URL) => u.hostname.includes('wildflowerschools.org'),
    (u: URL) => nameTokens.some(t => u.hostname.includes(t))
  ];
  for (const pred of byPriority) {
    const hit = urls.find(pred);
    if (hit) return hit.toString();
  }
  return urls[0]?.toString();
}

function pickSocial(candidates: string[], hostIncludes: string): string | undefined {
  const urls = candidates
    .map(u => { try { return new URL(u); } catch { return null; } })
    .filter((u): u is URL => !!u && u.hostname.includes(hostIncludes));
  // Avoid links to login or generic home pages
  const filtered = urls.filter(u => u.pathname && u.pathname !== '/' && !/login|share|intent/.test(u.pathname));
  return (filtered[0] || urls[0])?.toString();
}

async function findLinks(name: string) {
  const results: { website?: string; facebook?: string; instagram?: string } = {};

  // Website
  try {
    // Prefer wildflowerschools.org pages first
    const wfLinks = await duckDuckGoSearch(`${name} site:wildflowerschools.org`);
    let pick = pickWebsite(wfLinks, name);
    if (!pick) {
      const links = await duckDuckGoSearch(`${name} Montessori website`);
      pick = pickWebsite(links, name);
    }
    if (pick) results.website = pick;
    await sleep(250);
  } catch {}

  // Facebook
  try {
    const links = await duckDuckGoSearch(`${name} site:facebook.com`);
    const pick = pickSocial(links, 'facebook.com');
    if (pick) results.facebook = pick;
    await sleep(250);
  } catch {}

  // Instagram
  try {
    const links = await duckDuckGoSearch(`${name} site:instagram.com`);
    const pick = pickSocial(links, 'instagram.com');
    if (pick) results.instagram = pick;
    await sleep(250);
  } catch {}

  return results;
}

async function run() {
  const filterFormula = "OR(LOWER({Stage_Status})='startup', LOWER({Stage_Status})='open')";
  const toUpdate: Array<{ id: string; name: string; updates: Record<string, any> }> = [];
  const missingSummary: Array<{ id: string; name: string; missing: string[] }> = [];

  const records = await base('Schools')
    .select({ filterByFormula: filterFormula })
    .all();

  const filtered = records.slice(0, maxToProcess ? maxToProcess : records.length);
  console.log(`Found ${records.length} schools in Startup/Open. Processing ${filtered.length} with concurrency ${concurrency}...`);

  let processed = 0;
  let index = 0;

  async function worker(workerId: number) {
    while (true) {
      const i = index++;
      if (i >= filtered.length) break;
      const rec = filtered[i];
      const name = String(rec.get('Name') || rec.get('School Name') || rec.id);
      const website = String(rec.get('Website') || '') || undefined;
      const facebook = String(rec.get('Facebook') || '') || undefined;
      const instagram = String(rec.get('Instagram') || '') || undefined;

      const missing: string[] = [];
      if (!website) missing.push('Website');
      if (!facebook) missing.push('Facebook');
      if (!instagram) missing.push('Instagram');

      if (missing.length > 0) {
        missingSummary.push({ id: rec.id, name, missing });
        console.log(`[${processed + 1}/${filtered.length}] ${name} – missing ${missing.join(', ')} (worker ${workerId})`);
        try {
          const found = await findLinks(name);
          const updates: Record<string, any> = {};
          if (!website && found.website) updates['Website'] = found.website;
          if (!facebook && found.facebook) updates['Facebook'] = found.facebook;
          if (!instagram && found.instagram) updates['Instagram'] = found.instagram;
          if (Object.keys(updates).length > 0) {
            toUpdate.push({ id: rec.id, name, updates });
          }
        } catch (e) {
          console.warn(`Lookup failed for ${name}:`, (e as Error)?.message || e);
        }
      } else {
        console.log(`[${processed + 1}/${filtered.length}] ${name} – all set`);
      }

      processed++;
    }
  }

  await Promise.all(Array.from({ length: concurrency }, (_, i) => worker(i + 1)));

  console.log(`Schools with missing fields: ${missingSummary.length}`);
  for (const m of missingSummary) {
    console.log(`- ${m.name} (${m.id}): missing ${m.missing.join(', ')}`);
  }

  console.log(`\nProposed updates (${toUpdate.length} records):`);
  for (const u of toUpdate) {
    console.log(`- ${u.name}:`, u.updates);
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
