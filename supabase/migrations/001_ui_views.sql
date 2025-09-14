-- UI-optimized views for the Wildflower application
-- These views provide data specifically shaped for grid and detail UI components

-- UI view for school grid display
CREATE OR REPLACE VIEW ui_grid_schools AS
SELECT 
  s.id,
  s.name,
  s.short_name as "shortName",
  s.status,
  s.governance_model as "governanceModel", 
  s.ages_served as "agesServed",
  s.membership_status as "membershipStatus",
  s.projected_open as "projectedOpen",
  s.about,
  s.phone,
  s.email,
  s.website
FROM schools s
WHERE s.archived IS NOT TRUE;

-- UI view for school detail display  
CREATE OR REPLACE VIEW ui_details_school AS
SELECT 
  s.*,
  s.short_name as "shortName",
  s.governance_model as "governanceModel",
  s.ages_served as "agesServed", 
  s.membership_status as "membershipStatus",
  s.projected_open as "projectedOpen",
  s.physical_address as "physicalAddress",
  s.mailing_address as "mailingAddress"
FROM schools s;

-- UI view for educator grid display
CREATE OR REPLACE VIEW ui_grid_educators AS
SELECT 
  p.id,
  p.full_name as "fullName",
  p.first_name as "firstName", 
  p.last_name as "lastName",
  p.primary_email as "primaryEmail",
  p.primary_phone as "primaryPhone",
  p.discovery_status as "discoveryStatus",
  p.has_montessori_cert as "hasMontessoriCert",
  p.race_ethnicity_display as "raceEthnicityDisplay",
  p.kanban_group as "kanbanGroup",
  p.kanban_order as "kanbanOrder"
FROM people p
WHERE p.inactive_flag IS NOT TRUE;

-- UI view for educator detail display
CREATE OR REPLACE VIEW ui_details_educator AS
SELECT 
  p.*,
  p.full_name as "fullName",
  p.first_name as "firstName",
  p.last_name as "lastName", 
  p.middle_name as "middleName",
  p.primary_email as "primaryEmail",
  p.non_wildflower_email as "nonWildflowerEmail",
  p.primary_phone as "primaryPhone",
  p.secondary_phone as "secondaryPhone",
  p.home_address as "homeAddress",
  p.discovery_status as "discoveryStatus",
  p.has_montessori_cert as "hasMontessoriCert",
  p.race_ethnicity as "raceEthnicity",
  p.race_ethnicity_display as "raceEthnicityDisplay",
  p.primary_languages as "primaryLanguages",
  p.other_languages as "otherLanguages",
  p.kanban_group as "kanbanGroup",
  p.kanban_order as "kanbanOrder"
FROM people p;

-- Enable RLS on views if not already enabled
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE people ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (allow read access for authenticated users)
CREATE POLICY IF NOT EXISTS "Allow read access for authenticated users" ON schools
  FOR SELECT TO authenticated USING (true);

CREATE POLICY IF NOT EXISTS "Allow read access for authenticated users" ON people  
  FOR SELECT TO authenticated USING (true);

CREATE POLICY IF NOT EXISTS "Allow updates for authenticated users" ON schools
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY IF NOT EXISTS "Allow updates for authenticated users" ON people
  FOR UPDATE TO authenticated USING (true);

-- Grant permissions on views
GRANT SELECT ON ui_grid_schools TO authenticated;
GRANT SELECT ON ui_details_school TO authenticated;
GRANT SELECT ON ui_grid_educators TO authenticated;
GRANT SELECT ON ui_details_educator TO authenticated;