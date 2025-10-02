import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env.local
try {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    for (const line of envContent.split('\n')) {
      const [key, value] = line.split('=');
      if (key && value && !process.env[key]) {
        process.env[key] = value;
      }
    }
  }
} catch (err) {
  // Ignore env loading errors
}

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.VITE_SUPABASE_ANON_KEY || ''
);

async function checkRefTables() {
  try {
    console.log('Checking if ref_tables exist in public schema...');

    // Try to access ref_membership_statuses from public schema
    const { data: membership, error: membershipError } = await supabase
      .from('ref_membership_statuses')
      .select('value')
      .limit(1);

    console.log('ref_membership_statuses in public:', { error: membershipError?.message, hasData: !!membership });

    console.log('\nChecking if ref_tables exist in ref_tables schema...');

    // Try to access ref_membership_statuses from ref_tables schema
    const { data: membershipRef, error: membershipRefError } = await supabase
      .schema('ref_tables')
      .from('ref_membership_statuses')
      .select('value')
      .limit(1);

    console.log('ref_membership_statuses in ref_tables schema:', { error: membershipRefError?.message, hasData: !!membershipRef });

    // Try to access ref_race_and_ethnicity from ref_tables schema
    const { data: raceRef, error: raceRefError } = await supabase
      .schema('ref_tables')
      .from('ref_race_and_ethnicity')
      .select('value, english_label_short')
      .limit(1);

    console.log('ref_race_and_ethnicity in ref_tables schema:', { error: raceRefError?.message, hasData: !!raceRef });

    // Try to access ref_stage_statuses from ref_tables schema
    const { data: stageRef, error: stageRefError } = await supabase
      .schema('ref_tables')
      .from('ref_stage_statuses')
      .select('value')
      .limit(1);

    console.log('ref_stage_statuses in ref_tables schema:', { error: stageRefError?.message, hasData: !!stageRef });

  } catch (error) {
    console.error('Error checking ref tables:', error);
  }
}

checkRefTables();