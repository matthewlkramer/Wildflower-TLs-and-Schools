import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { storage } from '../server/simple-storage';

async function main() {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env');
    process.exit(1);
  }
  const supabase = createClient(url, serviceKey);

  const emails = await storage.getEmailAddresses();
  // Keep the most recent educatorId seen per normalized email
  const map = new Map<string, { email: string; educator_id: string | null }>();
  for (const rec of (emails || [])) {
    const email = (rec.email || '').trim().toLowerCase();
    if (!email) continue;
    const educator_id = rec.educatorId || null;
    map.set(email, { email, educator_id });
  }
  const rows = Array.from(map.values());
  console.log(`Upserting ${rows.length} emails to email_filter_addresses (with educator_id)...`);
  for (let i = 0; i < rows.length; i += 500) {
    const chunk = rows.slice(i, i + 500);
    const { error } = await supabase.from('email_filter_addresses').upsert(chunk, { onConflict: 'email' });
    if (error) throw error;
  }
  console.log('Done');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
