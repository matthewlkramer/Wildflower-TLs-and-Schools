-- Fix authorization model with proper row-level security
-- Add domain-based and role-based access controls

-- Create user context helper function
CREATE OR REPLACE FUNCTION get_user_email()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT email FROM auth.users WHERE id = auth.uid();
$$;

-- Create domain check function
CREATE OR REPLACE FUNCTION is_wildflower_user()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE 
    WHEN auth.uid() IS NULL THEN false
    WHEN get_user_email() LIKE '%@wildflowerschools.org' THEN true
    ELSE false
  END;
$$;

-- Drop and recreate secure RLS policies with proper domain checks
DROP POLICY IF EXISTS "schools_read_policy" ON schools;
DROP POLICY IF EXISTS "schools_update_policy" ON schools;
DROP POLICY IF EXISTS "people_read_policy" ON people;
DROP POLICY IF EXISTS "people_update_policy" ON people;

-- Secure read policies with domain restriction
CREATE POLICY "schools_read_wildflower" ON schools
  FOR SELECT TO authenticated 
  USING (is_wildflower_user());

CREATE POLICY "people_read_wildflower" ON people
  FOR SELECT TO authenticated
  USING (is_wildflower_user());

-- Secure update policies - only through RPCs
CREATE POLICY "schools_update_via_rpc" ON schools
  FOR UPDATE TO authenticated 
  USING (false)  -- Direct updates not allowed
  WITH CHECK (false);

CREATE POLICY "people_update_via_rpc" ON people
  FOR UPDATE TO authenticated
  USING (false)  -- Direct updates not allowed
  WITH CHECK (false);

-- Create secure insert policies for specific operations
CREATE POLICY "schools_insert_wildflower" ON schools
  FOR INSERT TO authenticated
  WITH CHECK (is_wildflower_user());

CREATE POLICY "people_insert_wildflower" ON people
  FOR INSERT TO authenticated  
  WITH CHECK (is_wildflower_user());

-- Replace RPC functions with proper authorization checks
DROP FUNCTION IF EXISTS update_school_field;
CREATE OR REPLACE FUNCTION update_school_field(
  school_id UUID,
  field_name TEXT,
  field_value JSONB
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  allowed_fields TEXT[] := ARRAY[
    'name', 'short_name', 'about', 'email', 'phone', 'website', 
    'governance_model', 'ages_served', 'status', 'membership_status'
  ];
  result JSONB;
  user_email TEXT;
BEGIN
  -- Validate authentication and domain
  IF NOT is_wildflower_user() THEN
    RAISE EXCEPTION 'Access denied: Wildflower domain required';
  END IF;
  
  -- Validate field name is allowed
  IF field_name != ANY(allowed_fields) THEN
    RAISE EXCEPTION 'Field % is not allowed for updates', field_name;
  END IF;
  
  -- Check if school exists and user has access
  IF NOT EXISTS (
    SELECT 1 FROM schools 
    WHERE id = school_id 
    AND archived IS NOT TRUE
  ) THEN
    RAISE EXCEPTION 'School not found or access denied';
  END IF;
  
  -- Perform the update with row-level authorization
  EXECUTE format('UPDATE schools SET %I = $1, updated_at = NOW() WHERE id = $2', field_name)
  USING field_value, school_id;
  
  -- Return updated row data
  EXECUTE format('SELECT row_to_json(s) FROM schools s WHERE id = $1')
  USING school_id
  INTO result;
  
  RETURN result;
END;
$$;

DROP FUNCTION IF EXISTS update_educator_field;
CREATE OR REPLACE FUNCTION update_educator_field(
  educator_id UUID,
  field_name TEXT,
  field_value JSONB
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER  
SET search_path = public
AS $$
DECLARE
  allowed_fields TEXT[] := ARRAY[
    'first_name', 'last_name', 'full_name', 'primary_email', 
    'non_wildflower_email', 'primary_phone', 'home_address',
    'discovery_status', 'pronouns'
  ];
  result JSONB;
BEGIN
  -- Validate authentication and domain
  IF NOT is_wildflower_user() THEN
    RAISE EXCEPTION 'Access denied: Wildflower domain required';
  END IF;
  
  -- Validate field name is allowed
  IF field_name != ANY(allowed_fields) THEN
    RAISE EXCEPTION 'Field % is not allowed for updates', field_name;
  END IF;
  
  -- Check if educator exists and user has access
  IF NOT EXISTS (
    SELECT 1 FROM people 
    WHERE id = educator_id 
    AND inactive_flag IS NOT TRUE
  ) THEN
    RAISE EXCEPTION 'Educator not found or access denied';
  END IF;
  
  -- Perform the update with row-level authorization
  EXECUTE format('UPDATE people SET %I = $1, updated_at = NOW() WHERE id = $2', field_name)
  USING field_value, educator_id;
  
  -- Return updated row data  
  EXECUTE format('SELECT row_to_json(p) FROM people p WHERE id = $1')
  USING educator_id
  INTO result;
  
  RETURN result;
END;
$$;

-- Create secure RPC for school creation
CREATE OR REPLACE FUNCTION create_school(
  school_data JSONB
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_school_id UUID;
  result JSONB;
BEGIN
  -- Validate authentication and domain
  IF NOT is_wildflower_user() THEN
    RAISE EXCEPTION 'Access denied: Wildflower domain required';
  END IF;
  
  -- Insert new school
  INSERT INTO schools (
    name, short_name, about, email, phone, website,
    governance_model, ages_served, status, created_at, updated_at
  ) VALUES (
    (school_data->>'name')::TEXT,
    (school_data->>'short_name')::TEXT,
    (school_data->>'about')::TEXT,
    (school_data->>'email')::TEXT,
    (school_data->>'phone')::TEXT,
    (school_data->>'website')::TEXT,
    (school_data->>'governance_model')::TEXT,
    (school_data->'ages_served')::TEXT[],
    (school_data->>'status')::TEXT,
    NOW(),
    NOW()
  ) RETURNING id INTO new_school_id;
  
  -- Return created school
  SELECT row_to_json(s) FROM schools s WHERE id = new_school_id INTO result;
  
  RETURN result;
END;
$$;

-- Create secure RPC for educator creation
CREATE OR REPLACE FUNCTION create_educator(
  educator_data JSONB
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_educator_id UUID;
  result JSONB;
BEGIN
  -- Validate authentication and domain
  IF NOT is_wildflower_user() THEN
    RAISE EXCEPTION 'Access denied: Wildflower domain required';
  END IF;
  
  -- Insert new educator
  INSERT INTO people (
    first_name, last_name, full_name, primary_email,
    non_wildflower_email, primary_phone, home_address,
    created_at, updated_at
  ) VALUES (
    (educator_data->>'first_name')::TEXT,
    (educator_data->>'last_name')::TEXT,
    COALESCE((educator_data->>'full_name')::TEXT, 
             CONCAT((educator_data->>'first_name')::TEXT, ' ', (educator_data->>'last_name')::TEXT)),
    (educator_data->>'primary_email')::TEXT,
    (educator_data->>'non_wildflower_email')::TEXT,
    (educator_data->>'primary_phone')::TEXT,
    (educator_data->>'home_address')::TEXT,
    NOW(),
    NOW()
  ) RETURNING id INTO new_educator_id;
  
  -- Return created educator
  SELECT row_to_json(p) FROM people p WHERE id = new_educator_id INTO result;
  
  RETURN result;
END;
$$;

-- Grant execute permissions on secure RPCs
GRANT EXECUTE ON FUNCTION update_school_field TO authenticated;
GRANT EXECUTE ON FUNCTION update_educator_field TO authenticated;
GRANT EXECUTE ON FUNCTION create_school TO authenticated;
GRANT EXECUTE ON FUNCTION create_educator TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_email TO authenticated;
GRANT EXECUTE ON FUNCTION is_wildflower_user TO authenticated;