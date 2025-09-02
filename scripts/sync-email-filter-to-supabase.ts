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
  const unique = Array.from(new Set((emails || []).map(e => (e.email || '').trim().toLowerCase()).filter(Boolean)));
  const rows = unique.map(email => ({ email }));
  console.log(`Upserting ${rows.length} emails to email_filter_addresses...`);
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

