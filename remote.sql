

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE TYPE "public"."action_step_status" AS ENUM (
    'Complete',
    'Incomplete'
);


ALTER TYPE "public"."action_step_status" OWNER TO "postgres";


CREATE TYPE "public"."active_inactive" AS ENUM (
    'Active',
    'Inactive',
    'Removed'
);


ALTER TYPE "public"."active_inactive" OWNER TO "postgres";


CREATE TYPE "public"."age_spans" AS ENUM (
    '0-3',
    '3-6',
    '6-9',
    '9-12',
    '12-15',
    '15-18'
);


ALTER TYPE "public"."age_spans" OWNER TO "postgres";


CREATE TYPE "public"."ages-grades" AS ENUM (
    'Infants',
    'Toddlers',
    'PK3',
    'PK4',
    'K',
    '1st',
    '2nd',
    '3rd',
    '4th',
    '5th',
    '6th',
    '7th',
    '8th',
    '9th',
    '10th',
    '11th',
    '12th'
);


ALTER TYPE "public"."ages-grades" OWNER TO "postgres";


CREATE TYPE "public"."authorizor_decisions" AS ENUM (
    'Approved',
    'Approved, with contingency',
    'Deferred decision',
    'Denied'
);


ALTER TYPE "public"."authorizor_decisions" OWNER TO "postgres";


CREATE TYPE "public"."automation_step_trigger" AS ENUM (
    'Request prelim advice for $3k+',
    'Request full advice',
    'Waiting for prelim advice',
    'Waiting for full advice',
    'Proceed',
    'Processing',
    'Waiting for prereqs',
    'Complete'
);


ALTER TYPE "public"."automation_step_trigger" OWNER TO "postgres";


CREATE TYPE "public"."certification_completion_status" AS ENUM (
    'Certified',
    'Training'
);


ALTER TYPE "public"."certification_completion_status" OWNER TO "postgres";


CREATE TYPE "public"."charter_app_status" AS ENUM (
    'Pre application',
    'Preparing application',
    'Awaiting decision',
    'Authorized, preparing to open'
);


ALTER TYPE "public"."charter_app_status" OWNER TO "postgres";


CREATE TYPE "public"."charter_status" AS ENUM (
    'Awaiting start of cohort'
);


ALTER TYPE "public"."charter_status" OWNER TO "postgres";


CREATE TYPE "public"."cohort_type" AS ENUM (
    'Charter',
    'Blooms'
);


ALTER TYPE "public"."cohort_type" OWNER TO "postgres";


CREATE TYPE "public"."developmental_planes" AS ENUM (
    'Infants',
    'Toddlers',
    'Primary',
    'Lower Elementary',
    'Upper Elementary',
    'Adolescent / JH',
    'High School'
);


ALTER TYPE "public"."developmental_planes" OWNER TO "postgres";


CREATE TYPE "public"."discovery_statuses" AS ENUM (
    'Complete',
    'In process',
    'Paused'
);


ALTER TYPE "public"."discovery_statuses" OWNER TO "postgres";


CREATE TYPE "public"."educ_attainment_options" AS ENUM (
    'Did not graduate high school',
    'Graduated high school or GED',
    'Some college or two-year degree',
    'Graduated college (four-year degree)',
    'Some graduate school',
    'Completed graduate school'
);


ALTER TYPE "public"."educ_attainment_options" OWNER TO "postgres";


CREATE TYPE "public"."email_address_categories" AS ENUM (
    'personal',
    'work - non-wildflower',
    'work - wildflower school',
    'work - wildflower foundation',
    'school'
);


ALTER TYPE "public"."email_address_categories" OWNER TO "postgres";


CREATE TYPE "public"."exemption_statuses" AS ENUM (
    'Exempt',
    'Non-exempt'
);


ALTER TYPE "public"."exemption_statuses" OWNER TO "postgres";


CREATE TYPE "public"."fee_change_types" AS ENUM (
    'Change in exemption status',
    'Change in fee',
    'Change likelihood of payment'
);


ALTER TYPE "public"."fee_change_types" OWNER TO "postgres";


CREATE TYPE "public"."fiscal_year_end" AS ENUM (
    '06/30',
    '12/31'
);


ALTER TYPE "public"."fiscal_year_end" OWNER TO "postgres";


CREATE TYPE "public"."gender_categories" AS ENUM (
    'Female',
    'Male',
    'Gender Non-Conforming',
    'Other'
);


ALTER TYPE "public"."gender_categories" OWNER TO "postgres";


CREATE TYPE "public"."governance_models" AS ENUM (
    'Independent',
    'Charter',
    'Community Partnership',
    'District',
    'Exploring Charter',
    'NULL'
);


ALTER TYPE "public"."governance_models" OWNER TO "postgres";


CREATE TYPE "public"."group_exemption_status" AS ENUM (
    'Active',
    'Never part of group exemption',
    'Withdrawn'
);


ALTER TYPE "public"."group_exemption_status" OWNER TO "postgres";


CREATE TYPE "public"."gsuite_roles_options" AS ENUM (
    'School Admin - School Orgs'
);


ALTER TYPE "public"."gsuite_roles_options" OWNER TO "postgres";


CREATE TYPE "public"."guide_types" AS ENUM (
    'Ops Guide',
    'Entrepreneur',
    'Equity Coach',
    'Open Schools Support'
);


ALTER TYPE "public"."guide_types" OWNER TO "postgres";


CREATE TYPE "public"."high_med_low" AS ENUM (
    'Low',
    'Medium',
    'High'
);


ALTER TYPE "public"."high_med_low" OWNER TO "postgres";


CREATE TYPE "public"."income_categories" AS ENUM (
    'Very low',
    'Low',
    'Middle',
    'Upper',
    'Prefer not to respond'
);


ALTER TYPE "public"."income_categories" OWNER TO "postgres";


CREATE TYPE "public"."languages" AS ENUM (
    'English',
    'Spanish - Español',
    'Mandarin - 中文',
    'Hindi - हिन्दी',
    'French - Français',
    'Japanese - 日本語',
    'Arabic - العَرَبِيَّة',
    'Urdu - اُردُو',
    'Hungarian - Hungarian',
    'Haitian Creole - Kreyol Ayisyen',
    'Gujarati - ગુજરાતી',
    'Fujian- Fujian',
    'Russian - русский язык',
    'Korean - 한국어',
    'Cantonese - Gwóngdūng wá',
    'Tai-Kadai - ไทย / ພາສາລາວ',
    'Portuguese - Português',
    'Tami - தமிழ்',
    'Burmese - မြန်မာစာ',
    'Yoruba',
    'Other'
);


ALTER TYPE "public"."languages" OWNER TO "postgres";


CREATE TYPE "public"."loan_status_options" AS ENUM (
    'Interest Only Period',
    'Paid Off',
    'Principal Repayment Period'
);


ALTER TYPE "public"."loan_status_options" OWNER TO "postgres";


CREATE TYPE "public"."loan_vehicle_options" AS ENUM (
    'LF II',
    'Sep',
    'Spring Point',
    'TWF',
    'TWF->LF II'
);


ALTER TYPE "public"."loan_vehicle_options" OWNER TO "postgres";


CREATE TYPE "public"."location_types" AS ENUM (
    'Mailing address - no physical school',
    'Physical address - does not receive mail',
    'School address and mailing address'
);


ALTER TYPE "public"."location_types" OWNER TO "postgres";


CREATE TYPE "public"."logo_designer_options" AS ENUM (
    'internal design',
    'external design'
);


ALTER TYPE "public"."logo_designer_options" OWNER TO "postgres";


CREATE TYPE "public"."membership_statuses" AS ENUM (
    'Member',
    'Affiliated non-member'
);


ALTER TYPE "public"."membership_statuses" OWNER TO "postgres";


CREATE TYPE "public"."montessori_associations" AS ENUM (
    'AMI',
    'AMS',
    'IMC',
    'MEPI',
    'PAMS',
    'Independent',
    'Other'
);


ALTER TYPE "public"."montessori_associations" OWNER TO "postgres";


CREATE TYPE "public"."nps" AS ENUM (
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10'
);


ALTER TYPE "public"."nps" OWNER TO "postgres";


CREATE TYPE "public"."ops_guide_support_track_options" AS ENUM (
    'Cohort',
    '1:1 support'
);


ALTER TYPE "public"."ops_guide_support_track_options" OWNER TO "postgres";


CREATE TYPE "public"."partner_roles" AS ENUM (
    'TL',
    'Affiliate of Charter Partner',
    'Ops Guide',
    'Teacher Leader',
    'Foundation Partner',
    'Regional Entrepreneur',
    'School Supports Partner',
    'Finance Administrator'
);


ALTER TYPE "public"."partner_roles" OWNER TO "postgres";


CREATE TYPE "public"."pre_wf_employment_statuses" AS ENUM (
    '1'
);


ALTER TYPE "public"."pre_wf_employment_statuses" OWNER TO "postgres";


CREATE TYPE "public"."pronouns" AS ENUM (
    'he/him/his',
    'she/her/hers',
    'they/them/theirs',
    'other'
);


ALTER TYPE "public"."pronouns" OWNER TO "postgres";


CREATE TYPE "public"."race_ethnicity_categories" AS ENUM (
    'african_american',
    'asian_american',
    'hispanic',
    'middle_eastern',
    'native_american',
    'pacific_islander',
    'white',
    'other'
);


ALTER TYPE "public"."race_ethnicity_categories" OWNER TO "postgres";


CREATE TYPE "public"."school_calendar_options" AS ENUM (
    '9-month',
    '10-month',
    'Year-round'
);


ALTER TYPE "public"."school_calendar_options" OWNER TO "postgres";


CREATE TYPE "public"."school_roles" AS ENUM (
    'Teacher Leader',
    'Emerging Teacher Leader',
    'Founder',
    'Classroom Staff',
    'Fellow',
    'Other'
);


ALTER TYPE "public"."school_roles" OWNER TO "postgres";


CREATE TYPE "public"."school_schedule_options" AS ENUM (
    'Before Care',
    'Morning Care',
    'Afternoon Care',
    'After Care'
);


ALTER TYPE "public"."school_schedule_options" OWNER TO "postgres";


CREATE TYPE "public"."school_ssj_data_ssj_on_track_for_enrollment_enum" AS ENUM (
    'Maybe (process is ready, no prospective students)',
    'No (process unclear/unpublished, limited/no family engagement)',
    'Yes - tuition published, plan and community engagement underway'
);


ALTER TYPE "public"."school_ssj_data_ssj_on_track_for_enrollment_enum" OWNER TO "postgres";


CREATE TYPE "public"."school_statuses" AS ENUM (
    'Emerging',
    'Open',
    'Paused',
    'Disaffiliated',
    'Permanently Closed',
    'Placeholder'
);


ALTER TYPE "public"."school_statuses" OWNER TO "postgres";


CREATE TYPE "public"."ssj_board_dev_status" AS ENUM (
    'No board',
    'Board is forming, 1-2 mtgs',
    'Board is developed and engaged, 3+ mtgs'
);


ALTER TYPE "public"."ssj_board_dev_status" OWNER TO "postgres";


CREATE TYPE "public"."ssj_budget_ready_for_next_steps_enum" AS ENUM (
    'No',
    'Unsure',
    'Yes'
);


ALTER TYPE "public"."ssj_budget_ready_for_next_steps_enum" OWNER TO "postgres";


CREATE TYPE "public"."ssj_building4good_status_enum" AS ENUM (
    'Matched',
    'Requested',
    'Upcoming'
);


ALTER TYPE "public"."ssj_building4good_status_enum" OWNER TO "postgres";


CREATE TYPE "public"."ssj_cohort_status_enum" AS ENUM (
    'Left Cohort',
    'Returning for Later Cohort',
    'Switched Ops Guide Supports',
    'Transitioned to Charter Application Supports'
);


ALTER TYPE "public"."ssj_cohort_status_enum" OWNER TO "postgres";


CREATE TYPE "public"."ssj_date_shared_with_n4g_enum" AS ENUM (
    '2020-01-15'
);


ALTER TYPE "public"."ssj_date_shared_with_n4g_enum" OWNER TO "postgres";


CREATE TYPE "public"."ssj_facility_enum" AS ENUM (
    'Purchased building',
    'Searching, intending to buy',
    'Searching, intending to rent',
    'Identified prospect(s)',
    'Signed lease',
    'Unsure'
);


ALTER TYPE "public"."ssj_facility_enum" OWNER TO "postgres";


CREATE TYPE "public"."ssj_form_type" AS ENUM (
    'Get Involved',
    'Start a School'
);


ALTER TYPE "public"."ssj_form_type" OWNER TO "postgres";


CREATE TYPE "public"."ssj_has_partner_enum" AS ENUM (
    'No partner',
    'Partnership established',
    'Partnership In development'
);


ALTER TYPE "public"."ssj_has_partner_enum" OWNER TO "postgres";


CREATE TYPE "public"."ssj_pathway_to_funding_enum" AS ENUM (
    'Maybe, prospects identified but not secured',
    'No, startup funding unlikely',
    'Yes, full funding likely'
);


ALTER TYPE "public"."ssj_pathway_to_funding_enum" OWNER TO "postgres";


CREATE TYPE "public"."ssj_seeking_wf_funding_enum" AS ENUM (
    'No',
    'Yes, grant',
    'Yes, grant; Yes, loan',
    'Yes, loan',
    'Yes, loan; Yes, grant'
);


ALTER TYPE "public"."ssj_seeking_wf_funding_enum" OWNER TO "postgres";


CREATE TYPE "public"."ssj_stages" AS ENUM (
    'Visioning',
    'Planning',
    'Startup',
    'Year 1',
    'Complete'
);


ALTER TYPE "public"."ssj_stages" OWNER TO "postgres";


CREATE TYPE "public"."ssj_tool_enum" AS ENUM (
    'Charter Slides',
    'Google Slides',
    'My Wildflower - Sensible Default',
    'Platform Pilot'
);


ALTER TYPE "public"."ssj_tool_enum" OWNER TO "postgres";


CREATE TYPE "public"."state_abbreviation_enum" AS ENUM (
    'AL',
    'AK',
    'AZ',
    'AR',
    'CA',
    'CO',
    'CT',
    'DE',
    'DC',
    'FL',
    'GA',
    'HI',
    'ID',
    'IL',
    'IN',
    'IA',
    'KS',
    'KY',
    'LA',
    'ME',
    'MD',
    'MA',
    'MI',
    'MN',
    'MS',
    'MO',
    'MT',
    'NE',
    'NV',
    'NH',
    'NJ',
    'NM',
    'NY',
    'NC',
    'ND',
    'OH',
    'OK',
    'OR',
    'PA',
    'RI',
    'SC',
    'SD',
    'TN',
    'TX',
    'UT',
    'VT',
    'VA',
    'WA',
    'WV',
    'WI',
    'WY',
    'PR'
);


ALTER TYPE "public"."state_abbreviation_enum" OWNER TO "postgres";


CREATE TYPE "public"."training_types" AS ENUM (
    'Lead Guide',
    'Assistant',
    'Administrator'
);


ALTER TYPE "public"."training_types" OWNER TO "postgres";


CREATE TYPE "public"."use_of_proceeds_options" AS ENUM (
    'Combine 2 loans',
    'Expansion',
    'Move',
    'Operations',
    'Renovations / Construction',
    'Security deposit',
    'Start-up'
);


ALTER TYPE "public"."use_of_proceeds_options" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."check_public_funding_valid"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM unnest(NEW.public_funding) AS pf
    WHERE pf NOT IN (SELECT name FROM public_funding_sources)
  ) THEN
    RAISE EXCEPTION 'Invalid public_funding value in array';
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."check_public_funding_valid"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."normalize_email"("raw" "text") RETURNS "text"
    LANGUAGE "sql" IMMUTABLE STRICT
    AS $$
  select case
           when raw is null then null
           -- extract foo@bar.com if "Name <foo@bar.com>"
           when raw ~ '<[^>]+>' then lower(trim(both ' ' from regexp_replace(raw, '.*<([^>]+)>.*', '\1')))
           else lower(trim(both ' ' from raw))
         end
$$;


ALTER FUNCTION "public"."normalize_email"("raw" "text") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."action_steps" (
    "item" "text",
    "assignee" "text",
    "item_status" "public"."action_step_status",
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "entity_id" "uuid",
    "assigned_date" "date",
    "due_date" "date",
    "completed_date" "date"
);


ALTER TABLE "public"."action_steps" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."email_addresses" (
    "email_addr_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "person_id" "uuid",
    "email_address" "text",
    "category" "public"."email_address_categories",
    "primary" boolean
);


ALTER TABLE "public"."email_addresses" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."people" (
    "full_name" "text",
    "first_name" "text",
    "middle_name" "text",
    "last_name" "text",
    "nickname" "text",
    "primary_phone" "text",
    "secondary_phone" "text",
    "google_groups" "text",
    "home_address" "text",
    "source_other" "text",
    "tc_userid" "text",
    "educ_attainment" "public"."educ_attainment_options",
    "primary_language" "public"."languages",
    "other_languages" "public"."languages"[],
    "race_ethnicity_other" "text",
    "hh_income" "public"."income_categories",
    "childhood_income" "public"."income_categories",
    "gender" "public"."gender_categories",
    "gender_other" "text",
    "lgbtqia" boolean,
    "pronouns" "public"."pronouns",
    "pronouns_other" "text",
    "last_modified" timestamp with time zone,
    "created" timestamp with time zone,
    "indiv_type" "text",
    "created_by" "text",
    "tags" "text",
    "exclude_from_email_logging" boolean,
    "person_id" "uuid" NOT NULL,
    "race_ethnicity" "public"."race_ethnicity_categories"[],
    "source" "text"[]
);


ALTER TABLE "public"."people" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."people_roles_join" (
    "email_at_school" "text",
    "loan_fund" boolean,
    "on_connected" boolean,
    "on_slack" "public"."active_inactive",
    "in_tl_google_grp" "public"."active_inactive",
    "in_wf_directory" "public"."active_inactive",
    "email_status" "public"."active_inactive",
    "who_initiated_tl_removal" "text",
    "on_natl_website" "public"."active_inactive",
    "gsuite_roles" "public"."gsuite_roles_options",
    "currently_active" boolean,
    "school_id" "uuid",
    "person_id" "uuid",
    "prj_id" "uuid" NOT NULL,
    "created_date" "date",
    "start_date" "date",
    "end_date" "date",
    "role" "text",
    "founding_tl_role" boolean,
    "charter_id" "uuid"
);


ALTER TABLE "public"."people_roles_join" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."primary_emails" AS
 WITH "email_candidates" AS (
         SELECT "prj"."person_id",
            "prj"."email_at_school" AS "email_address",
            'school'::"text" AS "source",
            'school'::"public"."email_address_categories" AS "category",
            1 AS "priority"
           FROM "public"."people_roles_join" "prj"
          WHERE ("prj"."email_at_school" IS NOT NULL)
        UNION ALL
         SELECT "ea"."person_id",
            "ea"."email_address",
            'primary'::"text" AS "source",
            "ea"."category",
                CASE
                    WHEN ("ea"."category" = 'personal'::"public"."email_address_categories") THEN 2
                    ELSE 3
                END AS "priority"
           FROM "public"."email_addresses" "ea"
          WHERE ("ea"."primary" = true)
        UNION ALL
         SELECT "ea"."person_id",
            "ea"."email_address",
            'fallback'::"text" AS "source",
            "ea"."category",
                CASE
                    WHEN ("ea"."category" = 'personal'::"public"."email_address_categories") THEN 4
                    ELSE 5
                END AS "priority"
           FROM "public"."email_addresses" "ea"
          WHERE ("ea"."email_address" IS NOT NULL)
        ), "ranked_emails" AS (
         SELECT "email_candidates"."person_id",
            "email_candidates"."email_address",
            "email_candidates"."source",
            "email_candidates"."category",
            "email_candidates"."priority",
            "row_number"() OVER (PARTITION BY "email_candidates"."person_id" ORDER BY "email_candidates"."priority") AS "rn"
           FROM "email_candidates"
        )
 SELECT "ranked_emails"."person_id",
    "ranked_emails"."email_address",
    "ranked_emails"."category"
   FROM "ranked_emails"
  WHERE ("ranked_emails"."rn" = 1);


ALTER TABLE "public"."primary_emails" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."active_tls" AS
 SELECT "p"."person_id",
    "p"."full_name",
    "pm"."email_address",
    "prj"."prj_id",
    "prj"."role",
    "prj"."currently_active",
    "p"."race_ethnicity"
   FROM (("public"."people_roles_join" "prj"
     LEFT JOIN "public"."people" "p" ON (("p"."person_id" = "prj"."person_id")))
     LEFT JOIN "public"."primary_emails" "pm" ON (("p"."person_id" = "pm"."person_id")))
  WHERE (("prj"."currently_active" = true) AND (("prj"."role" = 'Teacher Leader'::"text") OR ("prj"."role" = 'Emerging Teacher Leader'::"text")));


ALTER TABLE "public"."active_tls" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."guide_assignments" (
    "old_id" "text" NOT NULL,
    "start_date" "date",
    "end_date" "date",
    "type" "public"."guide_types",
    "active" boolean,
    "guide_id" "uuid",
    "guide_assign_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "school_id" "uuid"
);


ALTER TABLE "public"."guide_assignments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."guides" (
    "email_or_name" "text",
    "old_id" "text",
    "email" "text",
    "currently_active" boolean,
    "phone" "text",
    "home_address" "text",
    "birthdate" "text",
    "image_url" "text",
    "full_name" "text",
    "short_name" "text",
    "guide_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "partner_roles" "public"."partner_roles"[]
);


ALTER TABLE "public"."guides" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."all_active_roles" AS
 SELECT "p"."full_name",
    "prj"."role",
    "prj"."currently_active",
    "prj"."school_id",
    "prj"."prj_id"
   FROM ("public"."people" "p"
     JOIN "public"."people_roles_join" "prj" ON (("p"."person_id" = "prj"."person_id")))
  WHERE ("prj"."currently_active" = true)
UNION ALL
 SELECT "g"."full_name",
    ("ga"."type")::"text" AS "role",
    "ga"."active" AS "currently_active",
    "ga"."school_id",
    "ga"."guide_assign_id" AS "prj_id"
   FROM ("public"."guide_assignments" "ga"
     JOIN "public"."guides" "g" ON (("ga"."guide_id" = "g"."guide_id")))
  WHERE ("ga"."active" = true);


ALTER TABLE "public"."all_active_roles" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."all_active_roles_new" AS
 SELECT "p"."full_name",
    "prj"."role",
    "prj"."currently_active",
    "prj"."school_id",
    "prj"."prj_id"
   FROM ("public"."people" "p"
     JOIN "public"."people_roles_join" "prj" ON (("p"."person_id" = "prj"."person_id")))
  WHERE ("prj"."currently_active" = true)
UNION ALL
 SELECT "g"."full_name",
    ("ga"."type")::"text" AS "role",
    "ga"."active" AS "currently_active",
    "ga"."school_id",
    "ga"."guide_assign_id" AS "prj_id"
   FROM ("public"."guide_assignments" "ga"
     JOIN "public"."guides" "g" ON (("ga"."guide_id" = "g"."guide_id")))
  WHERE ("ga"."active" = true);


ALTER TABLE "public"."all_active_roles_new" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."annual_assessment_and_metrics_data" (
    "school_year" "text",
    "assessment_or_metric" "text",
    "metric_data" "text",
    "assessed_total" smallint,
    "assessed_bipoc" smallint,
    "assessed_frl" smallint,
    "assessed_ell" smallint,
    "assessed_sped" smallint,
    "met_plus_total" smallint,
    "met_plus_bipoc" smallint,
    "met_plus_frl" smallint,
    "met_plus_ell" smallint,
    "met_plus_sped" smallint,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "charter_id" "uuid",
    "school_id" "uuid"
);


ALTER TABLE "public"."annual_assessment_and_metrics_data" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."annual_enrollment_and_demographics" (
    "school_year" "text",
    "enrolled_students_total" smallint,
    "enrolled_frl" smallint,
    "enrolled_bipoc" smallint,
    "enrolled_ell" smallint,
    "enrolled_sped" smallint,
    "charter_id" "uuid",
    "school_id" "uuid",
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


ALTER TABLE "public"."annual_enrollment_and_demographics" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."boolean" (
    "category" "text" NOT NULL,
    "english" "text",
    "spanish" "text"
);


ALTER TABLE "public"."boolean" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."certifications" (
    "credential_level" "text" NOT NULL,
    "ages" "public"."age_spans"[],
    "lead_guide_training" boolean,
    "admin_training" boolean,
    "synonyms" "text"[]
);


ALTER TABLE "public"."certifications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."charter_applications" (
    "old_id" "text",
    "full_name" "text",
    "target_open" "text",
    "support_timeline" "text",
    "app_window" "text",
    "key_dates" "text",
    "milestones" "text",
    "authorizor" "text",
    "num_students" integer,
    "beg_age" "public"."ages-grades",
    "end_age" "public"."ages-grades",
    "loi_required" boolean,
    "loi_deadline" "text",
    "loi_submitted" boolean,
    "loi" "text",
    "odds_authorization" "text",
    "odds_on_time_open" "text",
    "charter_app_roles_set" boolean,
    "charter_app_pm_plan_complete" boolean,
    "logic_model_complete" boolean,
    "comm_engagement_underway" boolean,
    "nonprofit_status" "text",
    "app_deadline" "date",
    "app_submitted" boolean,
    "joint_kickoff_meeting_date" "date",
    "internal_support_meeting_date" "date",
    "app_walkthrough_date" "date",
    "capacity_intv_training_complete" boolean,
    "capacity_intv_proj_date" "date",
    "capacity_intv_completed_date" "date",
    "auth_decision" "public"."authorizor_decisions",
    "design_advice_session_complete" boolean,
    "board_membership_signed_date" "date",
    "design_album" "text",
    "budget_exercises" "text",
    "budget_final" "text",
    "most_recent_app" boolean,
    "app_status" "public"."charter_app_status",
    "team" "text",
    "opps_challenges" "text",
    "charter_app_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "charter" "uuid",
    "decision_expected_date" "date"
);


ALTER TABLE "public"."charter_applications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."charter_authorizers_and_contacts" (
    "authorizer_name" "text",
    "contact_name" "text",
    "title" "text",
    "email" "text",
    "phone" "text",
    "active" boolean NOT NULL,
    "charter_id" "uuid" NOT NULL
);


ALTER TABLE "public"."charter_authorizers_and_contacts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."charters" (
    "old_id" "text" NOT NULL,
    "short_name" "text",
    "full_name" "text",
    "initial_target_geo" "text",
    "landscape_analysis" "text",
    "application" "text",
    "non_tl_roles" "text",
    "proj_open" "date",
    "cohorts" "text"[],
    "status" "text",
    "group_exemption_status" "public"."active_inactive",
    "group_exemption_data_received" "text",
    "ein" "text",
    "incorp_date" "date",
    "current_fy_end" "public"."fiscal_year_end",
    "non_discrimination_policy_on_website" boolean,
    "school_provided_1023" boolean,
    "guidestar_listing_requested" boolean,
    "partnership_with_wf" "text",
    "authorized" boolean,
    "first_site_opened_date" "date",
    "website" "text",
    "nonprofit_status" boolean,
    "charter_membership_agreement" "text",
    "charter_membership_agreement_signed_date" "date",
    "charter_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "initial_target_planes" "public"."developmental_planes"[],
    CONSTRAINT "ein_format_check" CHECK ((("ein" IS NULL) OR ("ein" ~ '^\d{2}-\d{7}$'::"text")))
);


ALTER TABLE "public"."charters" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."cohorts" (
    "name" "text" NOT NULL,
    "cohort_type" "public"."cohort_type",
    "start_date" "date"
);


ALTER TABLE "public"."cohorts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."educator_notes" (
    "notes" "text",
    "created_date" "date",
    "created_by" "text",
    "private" boolean,
    "person_id" "uuid",
    "educ_notes_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


ALTER TABLE "public"."educator_notes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."email_filter_addresses" (
    "email" "text" NOT NULL,
    "last_synced_at" timestamp with time zone DEFAULT "now"(),
    "educator_id" "text"
);


ALTER TABLE "public"."email_filter_addresses" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."email_filter_addresses_filtered" AS
 SELECT "email_filter_addresses"."email",
    "email_filter_addresses"."last_synced_at",
    "email_filter_addresses"."educator_id"
   FROM "public"."email_filter_addresses"
  WHERE (NOT (("public"."normalize_email"("email_filter_addresses"."email") ~~ '%@wildflowerschools.org'::"text") OR ("public"."normalize_email"("email_filter_addresses"."email") ~~ '%@blackwildflowerschools.org'::"text")));


ALTER TABLE "public"."email_filter_addresses_filtered" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."schools" (
    "long_name" "text",
    "old_id" "text" NOT NULL,
    "short_name" "text",
    "status" "public"."school_statuses",
    "governance_model" "public"."governance_models",
    "prior_names" "text",
    "narrative" "text",
    "primary_contact_id" "text",
    "institutional_partner" "text",
    "ages_served" "public"."age_spans"[],
    "logo_url" "text",
    "logo" "text",
    "school_calendar" "public"."school_calendar_options",
    "left_network_reason" "text",
    "signed_membership_agreement" "text",
    "planning_album" "text",
    "tc_school_id" "text",
    "school_email" "text",
    "email_domain" "text",
    "school_phone" "text",
    "facebook" "text",
    "instagram" "text",
    "website" "text",
    "on_national_website" "text",
    "domain_name" "text",
    "nonprofit_status" "text",
    "google_voice" "text",
    "website_tool" "text",
    "budget_utility" "text",
    "transparent_classroom" "text",
    "admissions_system" "text",
    "tc_admissions" "text",
    "tc_recordkeeping" "text",
    "gusto" "text",
    "qbo" "text",
    "business_insurance" "text",
    "bill_account" "text",
    "number_of_classrooms" smallint,
    "created" "date",
    "created_by" "text",
    "last_modified" "date",
    "last_modified_by" "text",
    "pod" "text",
    "family_survey_non_tc_data_2021_22" "text",
    "enrollment_at_full_capacity" "text",
    "google_workspace_org_unit_path" "text",
    "family_surveys" "text",
    "flexible_tuition_model" "text",
    "ein" "text",
    "agreement_version" "text",
    "about" "text",
    "about_spanish" "text",
    "hero_image_url" "text",
    "hero_image_2_url" "text",
    "budget_link" "text",
    "bookkeeper_or_accountant" "text",
    "active_pod_member" "text",
    "risk_factors" "text",
    "watchlist" "text",
    "program_focus" "text",
    "loan_payments" "text",
    "loan_report_name" "text",
    "nine_nineties" "text",
    "current_fy_end" "text",
    "incorporation_date" "text",
    "guidestar_listing_requested" "text",
    "group_exemption_status" "text",
    "date_received_group_exemption" "date",
    "legal_name" "text",
    "nondiscrimination_policy_on_application" "text",
    "nondiscrimination_policy_on_website" "text",
    "date_withdrawn_from_group_exemption" "date",
    "qbo_school_codes" "text",
    "membership_termination_steps" "text",
    "membership_termination_letter" "text",
    "automation_notes" "text",
    "legal_structure" "text",
    "open_date" "date",
    "school_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "left_network_date" "date",
    "membership_agreement_signed_date" "date",
    "charter_id" "uuid",
    "school_sched" "public"."school_schedule_options"[],
    "membership_status" "public"."membership_statuses",
    "public_funding" "text"[]
);


ALTER TABLE "public"."schools" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."entities" AS
 SELECT "schools"."long_name",
    "schools"."short_name",
    ("schools"."status")::"text" AS "status",
    ("schools"."governance_model")::"text" AS "governance_model",
    "schools"."logo",
    "schools"."ein",
    "schools"."group_exemption_status",
    "schools"."open_date",
    "schools"."school_id" AS "entity_id",
    "schools"."left_network_date",
    "schools"."membership_status",
    "schools"."public_funding"
   FROM "public"."schools"
UNION ALL
 SELECT "charters"."full_name" AS "long_name",
    "charters"."short_name",
    "charters"."status",
    'Charter'::"text" AS "governance_model",
    NULL::"text" AS "logo",
    "charters"."ein",
    ("charters"."group_exemption_status")::"text" AS "group_exemption_status",
    "charters"."first_site_opened_date" AS "open_date",
    "charters"."charter_id" AS "entity_id",
    NULL::"date" AS "left_network_date",
    'Member'::"public"."membership_statuses" AS "membership_status",
    NULL::"text"[] AS "public_funding"
   FROM "public"."charters";


ALTER TABLE "public"."entities" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."event_attendance" (
    "event_attd_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "person_id" "uuid",
    "event" "text",
    "registration_date" "date",
    "attended_event" boolean,
    "duration_at_event_in_minutes" smallint,
    "spanish_translation_needed" boolean
);


ALTER TABLE "public"."event_attendance" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."event_list" (
    "event_name" "text" NOT NULL,
    "event_date" "date",
    "type" "text"
);


ALTER TABLE "public"."event_list" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."event_types" (
    "event_type" "text" NOT NULL
);


ALTER TABLE "public"."event_types" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."founding_tls" AS
 SELECT DISTINCT "prj"."person_id",
    "prj"."school_id",
    "p"."full_name",
    "prj"."role",
    "prj"."founding_tl_role"
   FROM ("public"."people_roles_join" "prj"
     LEFT JOIN "public"."people" "p" ON (("p"."person_id" = "prj"."person_id")))
  WHERE (("prj"."founding_tl_role" = true) AND (("prj"."role" = 'Teacher Leader'::"text") OR ("prj"."role" = 'Emerging Teacher Leader'::"text")));


ALTER TABLE "public"."founding_tls" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."g_email_backfill_queue" (
    "user_id" "uuid" NOT NULL,
    "gmail_message_id" "text" NOT NULL,
    "enqueued_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "status" "text" DEFAULT 'queued'::"text",
    "attempts" integer DEFAULT 0 NOT NULL,
    "last_attempt_at" timestamp with time zone,
    "error_message" "text",
    CONSTRAINT "g_email_backfill_queue_status_check" CHECK (("status" = ANY (ARRAY['queued'::"text", 'done'::"text", 'error'::"text"])))
);


ALTER TABLE "public"."g_email_backfill_queue" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."g_email_sync_progress" (
    "user_id" "uuid" NOT NULL,
    "year" integer NOT NULL,
    "week" integer NOT NULL,
    "sync_status" "text" DEFAULT 'not_started'::"text",
    "error_message" "text",
    "total_messages" integer,
    "processed_messages" integer,
    "started_at" timestamp with time zone,
    "completed_at" timestamp with time zone,
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "current_run_id" "text",
    CONSTRAINT "g_email_sync_progress_sync_status_check" CHECK (("sync_status" = ANY (ARRAY['not_started'::"text", 'running'::"text", 'paused'::"text", 'completed'::"text", 'partial'::"text", 'error'::"text"])))
);


ALTER TABLE "public"."g_email_sync_progress" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."g_emails" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "gmail_message_id" "text" NOT NULL,
    "thread_id" "text",
    "from_email" "text",
    "to_emails" "text"[],
    "cc_emails" "text"[],
    "bcc_emails" "text"[],
    "subject" "text",
    "body_text" "text",
    "body_html" "text",
    "sent_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "matched_emails" "text"[],
    "matched_educator_ids" "text"[]
);


ALTER TABLE "public"."g_emails" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."g_event_sync_progress" (
    "user_id" "uuid" NOT NULL,
    "calendar_id" "text" NOT NULL,
    "year" integer NOT NULL,
    "month" integer NOT NULL,
    "sync_status" "text" DEFAULT 'not_started'::"text",
    "error_message" "text",
    "total_events" integer,
    "processed_events" integer,
    "last_sync_token" "text",
    "started_at" timestamp with time zone,
    "completed_at" timestamp with time zone,
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "current_run_id" "text",
    CONSTRAINT "g_event_sync_progress_sync_status_check" CHECK (("sync_status" = ANY (ARRAY['not_started'::"text", 'running'::"text", 'paused'::"text", 'completed'::"text", 'partial'::"text", 'error'::"text"])))
);


ALTER TABLE "public"."g_event_sync_progress" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."g_events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "google_calendar_id" "text" NOT NULL,
    "google_event_id" "text" NOT NULL,
    "summary" "text",
    "description" "text",
    "start_time" timestamp with time zone,
    "end_time" timestamp with time zone,
    "organizer_email" "text",
    "location" "text",
    "status" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "matched_emails" "text"[],
    "matched_educator_ids" "text"[],
    "attendees" "text"[]
);


ALTER TABLE "public"."g_events" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."gender" (
    "category" "text" NOT NULL,
    "english" "text",
    "spanish" "text"
);


ALTER TABLE "public"."gender" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."google_auth_tokens" (
    "user_id" "uuid" NOT NULL,
    "access_token" "text" NOT NULL,
    "refresh_token" "text" NOT NULL,
    "expires_at" timestamp with time zone NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."google_auth_tokens" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."google_sync_messages" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "run_id" "text",
    "sync_type" "text" NOT NULL,
    "level" "text" DEFAULT 'info'::"text",
    "message" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "google_sync_messages_sync_type_check" CHECK (("sync_type" = ANY (ARRAY['gmail'::"text", 'calendar'::"text"])))
);


ALTER TABLE "public"."google_sync_messages" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."governance_docs" (
    "school_name" "text",
    "doc_type" "text",
    "pdf" "text",
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "school_id" "uuid",
    "charter_id" "uuid"
);


ALTER TABLE "public"."governance_docs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."grants" (
    "actual_tls" "text",
    "actual_school_legal_name" "text",
    "actual_mailing_address" "text",
    "actual_tl_emails" "text",
    "actual_ein" "text",
    "actual_nonprofit_status" "text",
    "actual_membership_status" "text",
    "ready_to_accept_flag" "text",
    "ready_to_issue_grant_letter_flag" "text",
    "bill_account" "text",
    "guide_first_name" "text",
    "School Grant Name" "text",
    "grant_status" "text",
    "amount" numeric,
    "issue_date" "date",
    "funding_source" "text",
    "issued_by" "text",
    "label" "text",
    "accounting_notes" "text",
    "qbo_number" integer,
    "notes" "text",
    "ledger_entry" "text",
    "funding_purpose" "text",
    "funding_period" "text",
    "actual_501c3_proof" "text",
    "automation_step_trigger" "public"."automation_step_trigger",
    "prelim_advice_request_timestamp" timestamp with time zone,
    "full_advice_request_timestamp" timestamp with time zone,
    "end_of_full_advice_window" "text",
    "unsigned_grant_agreement" "text",
    "signed_grant_agreement" "text",
    "grant_advice" "text",
    "grant_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "school_id" "uuid" DEFAULT "gen_random_uuid"()
);


ALTER TABLE "public"."grants" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."guide_assignments_plus" AS
 SELECT "ga"."type",
    "ga"."start_date",
    "ga"."end_date",
    "g"."email",
    "g"."currently_active",
    "g"."full_name",
    "g"."short_name" AS "screen_name",
    "ga"."school_id",
    "ga"."guide_id",
    "ga"."guide_assign_id",
    "s"."short_name",
    "s"."long_name"
   FROM (("public"."guide_assignments" "ga"
     JOIN "public"."guides" "g" ON (("ga"."guide_id" = "g"."guide_id")))
     LEFT JOIN "public"."schools" "s" ON (("ga"."school_id" = "s"."school_id")));


ALTER TABLE "public"."guide_assignments_plus" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."imported_emails" (
    "matched_emails" "text",
    "user" "text",
    "from" "text",
    "to" "text",
    "cc" "text",
    "email_date" "date",
    "subject" "text",
    "body" "text",
    "attachments" "text",
    "gmail_msg_id" "text",
    "logged_timestamp" "text",
    "school_id" "uuid",
    "person_id" "uuid",
    "email_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


ALTER TABLE "public"."imported_emails" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."imported_meetings" (
    "matched_emails" "text",
    "start_timestamp" "text",
    "end_timestamp" "text",
    "title" "text",
    "description" "text",
    "all_attendees" "text",
    "user" "text",
    "meeting_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "person_ids" "text"[],
    "school_ids" "text"[]
);


ALTER TABLE "public"."imported_meetings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."lead_routing_and_templates" (
    "segment_name" "text" NOT NULL,
    "sendgrid_template_id" "text",
    "language" "text"[],
    "type" "text"[],
    "us_international" "text"[],
    "geo_type" "text",
    "state" "text"[],
    "source" "text",
    "growth_lead" "text",
    "sender" "text"
);


ALTER TABLE "public"."lead_routing_and_templates" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."loans" (
    "Loan Key" "text",
    "loan_id" "text",
    "amount_issued" integer,
    "issue_date" "date",
    "loan_status" "public"."loan_status_options",
    "loan_docs" "text",
    "notes" "text",
    "maturity" "date",
    "interest_rate" real,
    "use_of_proceeds" "public"."use_of_proceeds_options",
    "vehicle" "public"."loan_vehicle_options",
    "school_id" "uuid"
);


ALTER TABLE "public"."loans" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."locations" (
    "charter_id" "uuid",
    "current_mail_address" boolean,
    "current_physical_address" boolean,
    "start_date" "date",
    "end_date" "date",
    "co_location_type" "text",
    "co_location_partner" "text",
    "location_type" "public"."location_types",
    "address" "text",
    "street" "text",
    "city" "text",
    "state" "text",
    "country" "text",
    "zip" "text",
    "neighborhood" "text",
    "sq_ft" smallint,
    "max_students" smallint,
    "lat" double precision,
    "long" double precision,
    "created_datetime" "text",
    "modified_datetime" "text",
    "geocode_last_run_at" "text",
    "census_tract" "text",
    "qualified_low_income_tract" boolean,
    "lease" "text",
    "lease_end_date" "date",
    "location_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "school_id" "uuid"
);


ALTER TABLE "public"."locations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."mailing_lists" (
    "sub_name" "text" NOT NULL,
    "name" "text",
    "slug" "text",
    "type" "text",
    "google_group_id" "text"
);


ALTER TABLE "public"."mailing_lists" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."membership_fee_annual_records" (
    "school_year" "text",
    "nth year" "text",
    "school_history_status" "text",
    "initial_exemption_status" "public"."exemption_statuses",
    "990" "text",
    "revenue" "text",
    "initial_fee" bigint,
    "estimated_likelihood_of_payment" "text",
    "weighted_projection" bigint,
    "entity_id" "uuid",
    "charter_id" "uuid",
    "membership_fee_annual_rec_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


ALTER TABLE "public"."membership_fee_annual_records" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."membership_fee_change_log" (
    "update_type" "public"."fee_change_types",
    "explanation" "text",
    "attachment" "text",
    "link" "text",
    "revised_fee_amount" numeric,
    "payment_amount" numeric,
    "update_date" "text",
    "revised_likelihood" "text",
    "new_exemption_status" "public"."exemption_statuses",
    "entity_id" "uuid",
    "school_year" "text",
    "mem_change_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


ALTER TABLE "public"."membership_fee_change_log" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."membership_fee_updated_view" AS
 SELECT "a"."school_year",
    "a"."nth year",
    "a"."school_history_status",
    "a"."initial_exemption_status",
    "a"."990",
    "a"."revenue",
    "a"."initial_fee",
    "a"."estimated_likelihood_of_payment",
    "a"."weighted_projection",
    "a"."entity_id",
    "a"."membership_fee_annual_rec_id",
    "e"."short_name",
    "e"."long_name",
    COALESCE("pay"."total_payments", (0)::numeric) AS "total_payments",
    COALESCE("ex"."latest_exemption_status", "a"."initial_exemption_status") AS "latest_exemption_status",
    COALESCE("fe"."latest_revised_fee_amount", ("a"."initial_fee")::numeric) AS "latest_revised_fee_amount",
    COALESCE("li"."latest_revised_likelihood", "a"."estimated_likelihood_of_payment") AS "latest_revised_likelihood",
        CASE COALESCE("li"."latest_revised_likelihood", "a"."estimated_likelihood_of_payment")
            WHEN '0%'::"text" THEN (0)::numeric
            WHEN '25%'::"text" THEN 0.25
            WHEN '50%'::"text" THEN 0.5
            WHEN '75%'::"text" THEN 0.75
            WHEN '100%'::"text" THEN (1)::numeric
            ELSE NULL::numeric
        END AS "latest_revised_likelihood_numeric",
        CASE
            WHEN (COALESCE("ex"."latest_exemption_status", "a"."initial_exemption_status") = 'Exempt'::"public"."exemption_statuses") THEN (0)::numeric
            ELSE (COALESCE("fe"."latest_revised_fee_amount", ("a"."initial_fee")::numeric) *
            CASE COALESCE("li"."latest_revised_likelihood", "a"."estimated_likelihood_of_payment")
                WHEN '0%'::"text" THEN (0)::numeric
                WHEN '25%'::"text" THEN 0.25
                WHEN '50%'::"text" THEN 0.5
                WHEN '75%'::"text" THEN 0.75
                WHEN '100%'::"text" THEN (1)::numeric
                ELSE NULL::numeric
            END)
        END AS "latest_weighted_projection",
    (
        CASE
            WHEN (COALESCE("ex"."latest_exemption_status", "a"."initial_exemption_status") = 'Exempt'::"public"."exemption_statuses") THEN (0)::numeric
            ELSE (COALESCE("fe"."latest_revised_fee_amount", ("a"."initial_fee")::numeric) *
            CASE COALESCE("li"."latest_revised_likelihood", "a"."estimated_likelihood_of_payment")
                WHEN '0%'::"text" THEN (0)::numeric
                WHEN '25%'::"text" THEN 0.25
                WHEN '50%'::"text" THEN 0.5
                WHEN '75%'::"text" THEN 0.75
                WHEN '100%'::"text" THEN (1)::numeric
                ELSE NULL::numeric
            END)
        END - COALESCE("pay"."total_payments", (0)::numeric)) AS "left_to_pay"
   FROM ((((("public"."membership_fee_annual_records" "a"
     LEFT JOIN LATERAL ( SELECT "sum"("c"."payment_amount") AS "total_payments"
           FROM "public"."membership_fee_change_log" "c"
          WHERE (("c"."school_year" = "a"."school_year") AND ("c"."entity_id" = "a"."entity_id"))) "pay" ON (true))
     LEFT JOIN LATERAL ( SELECT "c"."new_exemption_status"
           FROM "public"."membership_fee_change_log" "c"
          WHERE (("c"."school_year" = "a"."school_year") AND ("c"."entity_id" = "a"."entity_id") AND ("c"."new_exemption_status" IS NOT NULL))
          ORDER BY "c"."update_date" DESC
         LIMIT 1) "ex"("latest_exemption_status") ON (true))
     LEFT JOIN LATERAL ( SELECT "c"."revised_fee_amount"
           FROM "public"."membership_fee_change_log" "c"
          WHERE (("c"."school_year" = "a"."school_year") AND ("c"."entity_id" = "a"."entity_id") AND ("c"."revised_fee_amount" IS NOT NULL))
          ORDER BY "c"."update_date" DESC
         LIMIT 1) "fe"("latest_revised_fee_amount") ON (true))
     LEFT JOIN LATERAL ( SELECT "c"."revised_likelihood"
           FROM "public"."membership_fee_change_log" "c"
          WHERE (("c"."school_year" = "a"."school_year") AND ("c"."entity_id" = "a"."entity_id") AND ("c"."revised_likelihood" IS NOT NULL))
          ORDER BY "c"."update_date" DESC
         LIMIT 1) "li"("latest_revised_likelihood") ON (true))
     LEFT JOIN "public"."entities" "e" ON (("e"."entity_id" = "a"."entity_id")))
  ORDER BY "e"."short_name";


ALTER TABLE "public"."membership_fee_updated_view" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."membership_termination_process_steps" (
    "step_name" "text" NOT NULL,
    "day_of_process" smallint,
    "responsible_person" "text",
    "field_with_target_date" "text"
);


ALTER TABLE "public"."membership_termination_process_steps" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."montessori_certs" (
    "year" "text",
    "training_center" "text",
    "trainer" "text",
    "association" "public"."montessori_associations",
    "macte_accredited" boolean,
    "cert_completion_status" "public"."certification_completion_status",
    "created_date" "date",
    "cert_level" "public"."age_spans"[],
    "admin_credential" boolean,
    "assistant_training" boolean,
    "person_id" "uuid",
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


ALTER TABLE "public"."montessori_certs" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."mont_certs_complete_summary" AS
 SELECT "p"."full_name",
    "p"."person_id",
    "string_agg"(((((((COALESCE(("m"."association")::"text", ''::"text") || ' '::"text") || COALESCE("array_to_string"(COALESCE("m"."cert_level", ARRAY[]::"public"."age_spans"[]), ', '::"text"), ''::"text")) || ' '::"text") || '('::"text") || COALESCE("m"."year", '?'::"text")) || ')'::"text"), ', '::"text" ORDER BY "m"."year") AS "cert_summary"
   FROM ("public"."montessori_certs" "m"
     JOIN "public"."people" "p" ON (("p"."person_id" = "m"."person_id")))
  WHERE ("m"."cert_completion_status" = 'Certified'::"public"."certification_completion_status")
  GROUP BY "p"."full_name", "p"."person_id";


ALTER TABLE "public"."mont_certs_complete_summary" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."mont_certs_in_process_summary" AS
 SELECT "p"."full_name",
    "p"."person_id",
    "string_agg"(((((COALESCE("array_to_string"(COALESCE("m"."cert_level", ARRAY[]::"public"."age_spans"[]), ', '::"text"), ''::"text") || '-'::"text") || COALESCE(("m"."association")::"text", ''::"text")) || '-'::"text") || COALESCE("m"."year", ''::"text")), ','::"text" ORDER BY "m"."year") AS "cert_summary"
   FROM ("public"."montessori_certs" "m"
     JOIN "public"."people" "p" ON (("p"."person_id" = "m"."person_id")))
  WHERE ("m"."cert_completion_status" = 'Training'::"public"."certification_completion_status")
  GROUP BY "p"."full_name", "p"."person_id";


ALTER TABLE "public"."mont_certs_in_process_summary" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."nine_nineties" (
    "990_year" "text",
    "link" "text",
    "notes" "text",
    "ai_derived_revenue" "text",
    "ai_derived_EOY" "text",
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "school_id" "uuid",
    "charter_id" "uuid",
    "pdf" "text"
);


ALTER TABLE "public"."nine_nineties" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."people_educator_details" (
    "old_id" "text" NOT NULL,
    "discovery_status" "public"."discovery_statuses",
    "assigned_partner" "text",
    "montessori_lead_guide_trainings" "text",
    "educator_notes_1" "text",
    "training_grants" "text",
    "survey_gathering_2022" "text",
    "on_school_board" "text",
    "first_contact_willingness_to_relocate" "text",
    "first_contact_governance_model" "text",
    "first_contact_notes_on_pre_wf_employment" "text",
    "first_contact_form_notes" "text",
    "first_contact_wf_employment_status" "text",
    "first_contact_ages" "text",
    "first_contact_interests" "text",
    "target_city" "text",
    "target_state" "text",
    "target_geo_combined" "text",
    "target_intl" "text",
    "self_reflection_doc" "text",
    "opsguide_meeting_prefs" "text",
    "opsguide_checklist" "text",
    "opsguide_request_pertinent_info" "text",
    "opsguide_support_type_needed" "text",
    "opsguide_fundraising_opps" "text",
    "ped_id" "uuid" NOT NULL,
    "notes" "text"
);


ALTER TABLE "public"."people_educator_details" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."people_join_roles_plus" AS
 SELECT "prj"."role",
    "prj"."school_id",
    "prj"."charter_id",
    "prj"."start_date",
    "prj"."end_date",
    "prj"."currently_active",
    "p"."full_name",
    "p"."first_name",
    "p"."middle_name",
    "p"."last_name",
    "p"."nickname",
    "p"."primary_phone",
    "p"."secondary_phone",
    "p"."google_groups",
    "p"."home_address",
    "p"."source_other",
    "p"."tc_userid",
    "p"."educ_attainment",
    "p"."primary_language",
    "p"."other_languages",
    "p"."race_ethnicity_other",
    "p"."hh_income",
    "p"."childhood_income",
    "p"."gender",
    "p"."gender_other",
    "p"."lgbtqia",
    "p"."pronouns",
    "p"."pronouns_other",
    "p"."last_modified",
    "p"."created",
    "p"."indiv_type",
    "p"."created_by",
    "p"."tags",
    "p"."exclude_from_email_logging",
    "p"."person_id",
    "p"."race_ethnicity",
    "p"."source",
    "s"."short_name",
    "c"."short_name" AS "charter_short_name"
   FROM ((("public"."people_roles_join" "prj"
     LEFT JOIN "public"."people" "p" ON (("prj"."person_id" = "p"."person_id")))
     LEFT JOIN "public"."schools" "s" ON (("prj"."school_id" = "s"."school_id")))
     LEFT JOIN "public"."charters" "c" ON (("prj"."charter_id" = "c"."charter_id")));


ALTER TABLE "public"."people_join_roles_plus" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."people_plus" AS
SELECT
    NULL::"uuid" AS "person_id",
    NULL::"text" AS "full_name",
    NULL::"text" AS "first_name",
    NULL::"text" AS "middle_name",
    NULL::"text" AS "last_name",
    NULL::"text" AS "nickname",
    NULL::"text" AS "primary_phone",
    NULL::"text" AS "secondary_phone",
    NULL::"text" AS "google_groups",
    NULL::"text" AS "home_address",
    NULL::"text" AS "source_other",
    NULL::"text" AS "tc_userid",
    NULL::"public"."educ_attainment_options" AS "educ_attainment",
    NULL::"public"."languages" AS "primary_language",
    NULL::"public"."languages"[] AS "other_languages",
    NULL::"public"."race_ethnicity_categories"[] AS "race_ethnicity",
    NULL::"text" AS "race_ethnicity_other",
    NULL::"public"."income_categories" AS "hh_income",
    NULL::"public"."income_categories" AS "childhood_income",
    NULL::"public"."gender_categories" AS "gender",
    NULL::"text" AS "gender_other",
    NULL::boolean AS "lgbtqia",
    NULL::"public"."pronouns" AS "pronouns",
    NULL::"text" AS "pronouns_other",
    NULL::timestamp with time zone AS "last_modified",
    NULL::timestamp with time zone AS "created",
    NULL::"text" AS "indiv_type",
    NULL::"text" AS "created_by",
    NULL::"text" AS "tags",
    NULL::boolean AS "exclude_from_email_logging",
    NULL::"text"[] AS "source",
    NULL::"uuid" AS "ped_id",
    NULL::"public"."discovery_statuses" AS "discovery_status",
    NULL::"text" AS "active_roles",
    NULL::"text" AS "active_schools",
    NULL::"text" AS "email_address";


ALTER TABLE "public"."people_plus" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."people_plus_all" AS
SELECT
    NULL::"uuid" AS "person_id",
    NULL::"text" AS "full_name",
    NULL::"text" AS "first_name",
    NULL::"text" AS "middle_name",
    NULL::"text" AS "last_name",
    NULL::"text" AS "nickname",
    NULL::"text" AS "primary_phone",
    NULL::"text" AS "secondary_phone",
    NULL::"text" AS "google_groups",
    NULL::"text" AS "home_address",
    NULL::"text" AS "source_other",
    NULL::"text" AS "tc_userid",
    NULL::"public"."educ_attainment_options" AS "educ_attainment",
    NULL::"public"."languages" AS "primary_language",
    NULL::"public"."languages"[] AS "other_languages",
    NULL::"public"."race_ethnicity_categories"[] AS "race_ethnicity",
    NULL::"text" AS "race_ethnicity_other",
    NULL::"public"."income_categories" AS "hh_income",
    NULL::"public"."income_categories" AS "childhood_income",
    NULL::"public"."gender_categories" AS "gender",
    NULL::"text" AS "gender_other",
    NULL::boolean AS "lgbtqia",
    NULL::"public"."pronouns" AS "pronouns",
    NULL::"text" AS "pronouns_other",
    NULL::timestamp with time zone AS "last_modified",
    NULL::timestamp with time zone AS "created",
    NULL::"text" AS "indiv_type",
    NULL::"text" AS "created_by",
    NULL::"text" AS "tags",
    NULL::boolean AS "exclude_from_email_logging",
    NULL::"text"[] AS "source",
    NULL::"uuid" AS "ped_id",
    NULL::"public"."discovery_statuses" AS "discovery_status",
    NULL::"text" AS "active_roles",
    NULL::"text" AS "active_schools",
    NULL::"text" AS "email";


ALTER TABLE "public"."people_plus_all" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."people_plus_f_no_roles_and_inactive_roles" AS
SELECT
    NULL::"uuid" AS "person_id",
    NULL::"text" AS "full_name",
    NULL::"text" AS "first_name",
    NULL::"text" AS "middle_name",
    NULL::"text" AS "last_name",
    NULL::"text" AS "nickname",
    NULL::"text" AS "primary_phone",
    NULL::"text" AS "secondary_phone",
    NULL::"text" AS "google_groups",
    NULL::"text" AS "home_address",
    NULL::"text" AS "source_other",
    NULL::"text" AS "tc_userid",
    NULL::"public"."educ_attainment_options" AS "educ_attainment",
    NULL::"public"."languages" AS "primary_language",
    NULL::"public"."languages"[] AS "other_languages",
    NULL::"public"."race_ethnicity_categories"[] AS "race_ethnicity",
    NULL::"text" AS "race_ethnicity_other",
    NULL::"public"."income_categories" AS "hh_income",
    NULL::"public"."income_categories" AS "childhood_income",
    NULL::"public"."gender_categories" AS "gender",
    NULL::"text" AS "gender_other",
    NULL::boolean AS "lgbtqia",
    NULL::"public"."pronouns" AS "pronouns",
    NULL::"text" AS "pronouns_other",
    NULL::timestamp with time zone AS "last_modified",
    NULL::timestamp with time zone AS "created",
    NULL::"text" AS "indiv_type",
    NULL::"text" AS "created_by",
    NULL::"text" AS "tags",
    NULL::boolean AS "exclude_from_email_logging",
    NULL::"text"[] AS "source",
    NULL::"uuid" AS "ped_id",
    NULL::"public"."discovery_statuses" AS "discovery_status",
    NULL::"text" AS "active_roles",
    NULL::"text" AS "active_schools",
    NULL::"text" AS "email";


ALTER TABLE "public"."people_plus_f_no_roles_and_inactive_roles" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."people_plus_w_active_roles" AS
SELECT
    NULL::"uuid" AS "person_id",
    NULL::"text" AS "full_name",
    NULL::"text" AS "first_name",
    NULL::"text" AS "middle_name",
    NULL::"text" AS "last_name",
    NULL::"text" AS "nickname",
    NULL::"text" AS "primary_phone",
    NULL::"text" AS "secondary_phone",
    NULL::"text" AS "google_groups",
    NULL::"text" AS "home_address",
    NULL::"text" AS "source_other",
    NULL::"text" AS "tc_userid",
    NULL::"public"."educ_attainment_options" AS "educ_attainment",
    NULL::"public"."languages" AS "primary_language",
    NULL::"public"."languages"[] AS "other_languages",
    NULL::"public"."race_ethnicity_categories"[] AS "race_ethnicity",
    NULL::"text" AS "race_ethnicity_other",
    NULL::"public"."income_categories" AS "hh_income",
    NULL::"public"."income_categories" AS "childhood_income",
    NULL::"public"."gender_categories" AS "gender",
    NULL::"text" AS "gender_other",
    NULL::boolean AS "lgbtqia",
    NULL::"public"."pronouns" AS "pronouns",
    NULL::"text" AS "pronouns_other",
    NULL::timestamp with time zone AS "last_modified",
    NULL::timestamp with time zone AS "created",
    NULL::"text" AS "indiv_type",
    NULL::"text" AS "created_by",
    NULL::"text" AS "tags",
    NULL::boolean AS "exclude_from_email_logging",
    NULL::"text"[] AS "source",
    NULL::"uuid" AS "ped_id",
    NULL::"public"."discovery_statuses" AS "discovery_status",
    NULL::"text" AS "active_roles",
    NULL::"text" AS "active_schools",
    NULL::"text" AS "email";


ALTER TABLE "public"."people_plus_w_active_roles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."planes" (
    "plane" "text" NOT NULL,
    "credentials" "text"[],
    "synonyms" "text"[],
    "age_ranges" "public"."ages-grades"[]
);


ALTER TABLE "public"."planes" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."preview_people_duplicates" AS
 WITH "grouped" AS (
         SELECT "people"."full_name",
            "array_agg"("people"."person_id" ORDER BY "people"."person_id") AS "ids"
           FROM "public"."people"
          GROUP BY "people"."full_name"
         HAVING ("count"(*) > 1)
        )
 SELECT "grouped"."full_name",
    "grouped"."ids"[1] AS "canonical_id",
    "grouped"."ids"[2:"array_length"("grouped"."ids", 1)] AS "duplicate_ids"
   FROM "grouped";


ALTER TABLE "public"."preview_people_duplicates" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."public_funding_sources" (
    "name" "text" NOT NULL,
    "description" "text",
    "planes" "public"."developmental_planes"[]
);


ALTER TABLE "public"."public_funding_sources" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."race_and_ethnicity" (
    "category" "text" NOT NULL,
    "english" "text",
    "spanish" "text"
);


ALTER TABLE "public"."race_and_ethnicity" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."roles" (
    "role" "text" NOT NULL,
    "role_type" "text"
);


ALTER TABLE "public"."roles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."school_notes" (
    "notes" "text",
    "created_date" "text",
    "created_by" "text",
    "private" boolean,
    "sch_notes_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "school_id" "uuid"
);


ALTER TABLE "public"."school_notes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."school_reports_and_submissions" (
    "id" "text",
    "charter_id" "uuid",
    "report_type" "text",
    "attachments" "text",
    "school_year" "text"
);


ALTER TABLE "public"."school_reports_and_submissions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."school_ssj_data" (
    "school_id" "uuid" NOT NULL,
    "cohorts" "text"[],
    "ssj_target_city" "text",
    "ssj_target_state" "public"."state_abbreviation_enum",
    "ssj_projected_open" "date",
    "ssj_original_projected_open_date" "date",
    "entered_visioning_date" "date",
    "entered_planning_date" "date",
    "entered_startup_date" "date",
    "ssj_stage" "public"."ssj_stages",
    "ssj_readiness_to_open_rating" "public"."high_med_low",
    "ssj_name_reserved" boolean,
    "ssj_has_partner" "public"."ssj_has_partner_enum",
    "ssj_board_development" "public"."ssj_board_dev_status",
    "ssj_facility" "public"."ssj_facility_enum",
    "ssj_cohort_status" "public"."ssj_cohort_status_enum",
    "ssj_on_track_for_enrollment" "public"."school_ssj_data_ssj_on_track_for_enrollment_enum",
    "ssj_budget_ready_for_next_steps" "public"."ssj_budget_ready_for_next_steps_enum",
    "ssj_seeking_wf_funding" "public"."ssj_seeking_wf_funding_enum",
    "ssj_advice_givers_tls" "text",
    "ssj_advice_givers_partners" "text",
    "ssj_fundraising_narrative" "text",
    "ssj_pathway_to_funding" "public"."ssj_pathway_to_funding_enum",
    "ssj_total_startup_funding_needed" "text",
    "ssj_loan_eligibility" "text",
    "ssj_loan_approved_amt" "text",
    "ssj_amount_raised" "text",
    "ssj_gap_in_funding" "text",
    "ssj_proj_open_school_year_backup" smallint,
    "ssj_date_shared_with_n4g" "date",
    "ssj_proj_open_school_year" smallint,
    "ssj_tool" "public"."ssj_tool_enum",
    "ssj_building4good_status" "public"."ssj_building4good_status_enum",
    "building4good_firm_and_attorney" "text",
    "visioning_album_complete" "text",
    "visioning_album" "text",
    "logo_designer" "public"."logo_designer_options",
    "name_selection_proposal" "text",
    "trademark_filed" boolean,
    "ssj_ops_guide_support_track" "public"."ops_guide_support_track_options"
);


ALTER TABLE "public"."school_ssj_data" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."school_years" (
    "school_year" "text" NOT NULL,
    "start_date" "date",
    "end_date" "date",
    "new_school_fee" numeric,
    "ongoing_school_fee" numeric
);


ALTER TABLE "public"."school_years" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."schools_plus" AS
 SELECT "s"."long_name",
    "s"."short_name",
    "s"."status",
    "s"."governance_model",
    "s"."prior_names",
    "s"."narrative",
    "s"."institutional_partner",
    "s"."ages_served",
    "s"."logo",
    "s"."school_calendar",
    "s"."left_network_reason",
    "s"."signed_membership_agreement",
    "s"."planning_album",
    "s"."school_email",
    "s"."email_domain",
    "s"."school_phone",
    "s"."facebook",
    "s"."instagram",
    "s"."website",
    "s"."on_national_website",
    "s"."domain_name",
    "s"."nonprofit_status",
    "s"."google_voice",
    "s"."website_tool",
    "s"."budget_utility",
    "s"."transparent_classroom",
    "s"."admissions_system",
    "s"."tc_admissions",
    "s"."tc_recordkeeping",
    "s"."gusto",
    "s"."qbo",
    "s"."business_insurance",
    "s"."bill_account",
    "s"."number_of_classrooms",
    "s"."created",
    "s"."created_by",
    "s"."last_modified",
    "s"."last_modified_by",
    "s"."pod",
    "s"."enrollment_at_full_capacity",
    "s"."google_workspace_org_unit_path",
    "s"."family_surveys",
    "s"."flexible_tuition_model",
    "s"."ein",
    "s"."agreement_version",
    "s"."about",
    "s"."about_spanish",
    "s"."hero_image_url",
    "s"."hero_image_2_url",
    "s"."budget_link",
    "s"."bookkeeper_or_accountant",
    "s"."active_pod_member",
    "s"."risk_factors",
    "s"."watchlist",
    "s"."program_focus",
    "s"."loan_report_name",
    "s"."nine_nineties",
    "s"."current_fy_end",
    "s"."incorporation_date",
    "s"."guidestar_listing_requested",
    "s"."group_exemption_status",
    "s"."date_received_group_exemption",
    "s"."legal_name",
    "s"."nondiscrimination_policy_on_application",
    "s"."nondiscrimination_policy_on_website",
    "s"."date_withdrawn_from_group_exemption",
    "s"."qbo_school_codes",
    "s"."membership_termination_steps",
    "s"."membership_termination_letter",
    "s"."automation_notes",
    "s"."legal_structure",
    "s"."open_date",
    "s"."school_id",
    "s"."left_network_date",
    "s"."membership_agreement_signed_date",
    "s"."charter_id",
    "s"."school_sched",
    "s"."membership_status",
    "s"."public_funding",
    "loc"."address",
    "loc"."lat",
    "loc"."long",
    "agg"."active_tls",
    "agg"."active_tl_emails",
    "agg"."active_tl_race",
    "agg2"."founding_tls",
    "ssj"."cohorts",
    "ssj"."ssj_target_city",
    "ssj"."ssj_target_state",
    "ssj"."ssj_projected_open",
    "ssj"."ssj_original_projected_open_date",
    "ssj"."entered_visioning_date",
    "ssj"."entered_planning_date",
    "ssj"."entered_startup_date",
    "ssj"."ssj_stage",
    "ssj"."ssj_readiness_to_open_rating",
    "ssj"."ssj_name_reserved",
    "ssj"."ssj_has_partner",
    "ssj"."ssj_board_development",
    "ssj"."ssj_facility",
    "ssj"."ssj_cohort_status",
    "ssj"."ssj_on_track_for_enrollment",
    "ssj"."ssj_budget_ready_for_next_steps",
    "ssj"."ssj_seeking_wf_funding",
    "ssj"."ssj_advice_givers_tls",
    "ssj"."ssj_advice_givers_partners",
    "ssj"."ssj_fundraising_narrative",
    "ssj"."ssj_pathway_to_funding",
    "ssj"."ssj_total_startup_funding_needed",
    "ssj"."ssj_loan_eligibility",
    "ssj"."ssj_loan_approved_amt",
    "ssj"."ssj_amount_raised",
    "ssj"."ssj_gap_in_funding",
    "ssj"."ssj_proj_open_school_year_backup",
    "ssj"."ssj_date_shared_with_n4g",
    "ssj"."ssj_proj_open_school_year",
    "ssj"."ssj_tool",
    "ssj"."ssj_building4good_status",
    "ssj"."building4good_firm_and_attorney",
    "ssj"."visioning_album_complete",
    "ssj"."visioning_album",
    "ssj"."logo_designer",
    "ssj"."name_selection_proposal",
    "ssj"."trademark_filed",
    "ssj"."ssj_ops_guide_support_track"
   FROM (((("public"."schools" "s"
     LEFT JOIN "public"."school_ssj_data" "ssj" ON (("ssj"."school_id" = "s"."school_id")))
     LEFT JOIN LATERAL ( SELECT "l"."address",
            "l"."lat",
            "l"."long"
           FROM "public"."locations" "l"
          WHERE (("l"."school_id" = "s"."school_id") AND ("l"."current_physical_address" = true))
         LIMIT 1) "loc" ON (true))
     LEFT JOIN LATERAL ( SELECT "string_agg"(DISTINCT "at"."full_name", ', '::"text") AS "active_tls",
            "string_agg"(DISTINCT "at"."email_address", ', '::"text") AS "active_tl_emails",
            "string_agg"(DISTINCT ("race"."race")::"text", ', '::"text") AS "active_tl_race"
           FROM (("public"."people_roles_join" "prj"
             JOIN "public"."active_tls" "at" ON (("at"."person_id" = "prj"."person_id")))
             LEFT JOIN LATERAL "unnest"("at"."race_ethnicity") "race"("race") ON (true))
          WHERE ("prj"."school_id" = "s"."school_id")) "agg" ON (true))
     LEFT JOIN LATERAL ( SELECT "string_agg"(DISTINCT "ft"."full_name", ', '::"text") AS "founding_tls"
           FROM ("public"."people_roles_join" "prj"
             JOIN "public"."founding_tls" "ft" ON (("ft"."person_id" = "prj"."person_id")))
          WHERE ("prj"."school_id" = "s"."school_id")) "agg2" ON (true))
  WHERE ("s"."status" <> 'Placeholder'::"public"."school_statuses");


ALTER TABLE "public"."schools_plus" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."select_teacher" AS
 SELECT DISTINCT "p"."person_id",
    "p"."full_name" AS "educator_name",
    "p"."race_ethnicity",
    "prj"."role",
    "s"."short_name" AS "school_name"
   FROM (("public"."people" "p"
     LEFT JOIN "public"."people_roles_join" "prj" ON (("prj"."person_id" = "p"."person_id")))
     LEFT JOIN "public"."schools" "s" ON (("prj"."school_id" = "s"."school_id")))
  WHERE (("prj"."currently_active" = true) AND ("prj"."role" = ANY (ARRAY['Teacher Leader'::"text", 'Emerging Teacher Leader'::"text"])));


ALTER TABLE "public"."select_teacher" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."sources" (
    "source" "text" NOT NULL
);


ALTER TABLE "public"."sources" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."ssj_fillout_forms" (
    "old_id" "text",
    "form_type" "public"."ssj_form_type",
    "first_name" "text",
    "last_name" "text",
    "full_name" "text",
    "email" "text",
    "Link to Start a School" "text",
    "race_ethnicity" "text",
    "race_ethnicity_other" "text",
    "lgbtqia" "text",
    "pronouns" "text",
    "pronouns_other" "text",
    "gender" "text",
    "gender_other" "text",
    "current_income" "text",
    "language_primary" "text",
    "language_primary_other" "text",
    "message" "text",
    "charter_interest" "text",
    "email_1" "text",
    "contact_type" "text",
    "mont_cert_question" "text",
    "cert_processing_status" "text",
    "currently_montessori_certified" "text",
    "currently_seeking_mont_cert" "text",
    "Temp - M Cert Cert 1" "text",
    "Montessori Certification Certifier 1" "text",
    "Temp - M Cert Year 1" "text",
    "Montessori Certification Year 1" "text",
    "Temp - M Cert Level 1" "text",
    "Montessori Certification Level 1" "text",
    "Temp - M Cert Cert 2" "text",
    "Montessori Certification Certifier 2" "text",
    "Temp - M Cert Year 2" "text",
    "Montessori Certification Year 2" "text",
    "Temp - M Cert Level 2" "text",
    "Montessori Certification Level 2" "text",
    "Temp - M Cert Cert 3" "text",
    "Montessori Certification Certifier 3" "text",
    "Temp - M Cert Year 3" "text",
    "Montessori Certification Year 3" "text",
    "Temp - M Cert Level 3" "text",
    "Montessori Certification Level 3" "text",
    "Temp - M Cert Cert 4" "text",
    "Montessori Certification Certifier 4" "text",
    "Temp - M Cert Year 4" "text",
    "Montessori Certification Year 4" "text",
    "Temp - M Cert Level 4" "text",
    "Montessori Certification Level 4" "text",
    "city" "text",
    "city_standardized" "text",
    "state" "text",
    "state_abbrev" "text",
    "country" "text",
    "city2" "text",
    "state2" "text",
    "country2" "text",
    "target_geo" "text",
    "age_targets" "text",
    "educator_interests" "text",
    "educator_interests_other" "text",
    "community_member_interest" "text",
    "want_helping_sourcing_teachers" "text",
    "community_desc" "text",
    "community_member_self_description" "text",
    "want_communications" "text",
    "source_type" "text",
    "source_other" "text",
    "source_detail" "text",
    "source_campaign" "text",
    "created_date" timestamp with time zone,
    "sendgrid_template" "text",
    "sendgrid_date_sent" "text",
    "routed_to" "text",
    "assigned_partner_override" "text",
    "email_sent_by_initial_outreacher" "text",
    "one_on_one_status" "text",
    "initial_outreacher" "text",
    "follow_upper" "text",
    "ssj_form_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "person_id" "uuid"
);


ALTER TABLE "public"."ssj_fillout_forms" OWNER TO "postgres";


ALTER TABLE ONLY "public"."nine_nineties"
    ADD CONSTRAINT "990s_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."action_steps"
    ADD CONSTRAINT "action_steps_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."annual_assessment_and_metrics_data"
    ADD CONSTRAINT "annual_assessment_and_metrics_data_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."annual_enrollment_and_demographics"
    ADD CONSTRAINT "annual_enrollment_and_demographics_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."boolean"
    ADD CONSTRAINT "boolean_pkey" PRIMARY KEY ("category");



ALTER TABLE ONLY "public"."certifications"
    ADD CONSTRAINT "certifications_pkey" PRIMARY KEY ("credential_level");



ALTER TABLE ONLY "public"."charter_applications"
    ADD CONSTRAINT "charter_applications_pkey" PRIMARY KEY ("charter_app_id");



ALTER TABLE ONLY "public"."charter_authorizers_and_contacts"
    ADD CONSTRAINT "charter_authorizers_and_contacts_pkey" PRIMARY KEY ("charter_id", "active");



ALTER TABLE ONLY "public"."charters"
    ADD CONSTRAINT "charters_pkey" PRIMARY KEY ("charter_id");



ALTER TABLE ONLY "public"."cohorts"
    ADD CONSTRAINT "cohorts_pkey" PRIMARY KEY ("name");



ALTER TABLE ONLY "public"."educator_notes"
    ADD CONSTRAINT "educator_notes_pkey" PRIMARY KEY ("educ_notes_id");



ALTER TABLE ONLY "public"."people_roles_join"
    ADD CONSTRAINT "educatorsXschools_pkey" PRIMARY KEY ("prj_id");



ALTER TABLE ONLY "public"."people"
    ADD CONSTRAINT "educators_duplicate_pkey" PRIMARY KEY ("person_id");



ALTER TABLE ONLY "public"."people_educator_details"
    ADD CONSTRAINT "educators_pkey" PRIMARY KEY ("ped_id");



ALTER TABLE ONLY "public"."email_addresses"
    ADD CONSTRAINT "email_addresses_email_address_key" UNIQUE ("email_address");



ALTER TABLE ONLY "public"."email_addresses"
    ADD CONSTRAINT "email_addresses_pkey" PRIMARY KEY ("email_addr_id");



ALTER TABLE ONLY "public"."email_filter_addresses"
    ADD CONSTRAINT "email_filter_addresses_pkey" PRIMARY KEY ("email");



ALTER TABLE ONLY "public"."event_attendance"
    ADD CONSTRAINT "event_attendance_pkey" PRIMARY KEY ("event_attd_id");



ALTER TABLE ONLY "public"."event_list"
    ADD CONSTRAINT "event_list_pkey" PRIMARY KEY ("event_name");



ALTER TABLE ONLY "public"."event_types"
    ADD CONSTRAINT "event_types_pkey" PRIMARY KEY ("event_type");



ALTER TABLE ONLY "public"."g_email_backfill_queue"
    ADD CONSTRAINT "g_email_backfill_queue_pkey" PRIMARY KEY ("user_id", "gmail_message_id");



ALTER TABLE ONLY "public"."g_email_sync_progress"
    ADD CONSTRAINT "g_email_sync_progress_pkey" PRIMARY KEY ("user_id", "year", "week");



ALTER TABLE ONLY "public"."g_emails"
    ADD CONSTRAINT "g_emails_gmail_message_id_key" UNIQUE ("gmail_message_id");



ALTER TABLE ONLY "public"."g_emails"
    ADD CONSTRAINT "g_emails_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."g_event_sync_progress"
    ADD CONSTRAINT "g_event_sync_progress_pkey" PRIMARY KEY ("user_id", "calendar_id", "year", "month");



ALTER TABLE ONLY "public"."g_events"
    ADD CONSTRAINT "g_events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."g_events"
    ADD CONSTRAINT "g_events_user_id_google_calendar_id_google_event_id_key" UNIQUE ("user_id", "google_calendar_id", "google_event_id");



ALTER TABLE ONLY "public"."gender"
    ADD CONSTRAINT "gender_pkey" PRIMARY KEY ("category");



ALTER TABLE ONLY "public"."google_auth_tokens"
    ADD CONSTRAINT "google_auth_tokens_pkey" PRIMARY KEY ("user_id");



ALTER TABLE ONLY "public"."google_sync_messages"
    ADD CONSTRAINT "google_sync_messages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."governance_docs"
    ADD CONSTRAINT "governance_docs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."grants"
    ADD CONSTRAINT "grants_pkey" PRIMARY KEY ("grant_id");



ALTER TABLE ONLY "public"."guide_assignments"
    ADD CONSTRAINT "guide_assignments_pkey" PRIMARY KEY ("guide_assign_id");



ALTER TABLE ONLY "public"."guides"
    ADD CONSTRAINT "guides_pkey" PRIMARY KEY ("guide_id");



ALTER TABLE ONLY "public"."guides"
    ADD CONSTRAINT "guides_short_name_key" UNIQUE ("short_name");



ALTER TABLE ONLY "public"."imported_emails"
    ADD CONSTRAINT "imported_emails_pkey" PRIMARY KEY ("email_id");



ALTER TABLE ONLY "public"."imported_meetings"
    ADD CONSTRAINT "imported_meetings_pkey" PRIMARY KEY ("meeting_id");



ALTER TABLE ONLY "public"."lead_routing_and_templates"
    ADD CONSTRAINT "lead_routing_and_templates_pkey" PRIMARY KEY ("segment_name");



ALTER TABLE ONLY "public"."locations"
    ADD CONSTRAINT "locations_pkey" PRIMARY KEY ("location_id");



ALTER TABLE ONLY "public"."mailing_lists"
    ADD CONSTRAINT "mailing_lists_pkey" PRIMARY KEY ("sub_name");



ALTER TABLE ONLY "public"."membership_fee_annual_records"
    ADD CONSTRAINT "membership_fee_annual_records_pkey" PRIMARY KEY ("membership_fee_annual_rec_id");



ALTER TABLE ONLY "public"."membership_fee_change_log"
    ADD CONSTRAINT "membership_fee_change_log_pkey" PRIMARY KEY ("mem_change_id");



ALTER TABLE ONLY "public"."membership_termination_process_steps"
    ADD CONSTRAINT "membership_termination_process_steps_pkey" PRIMARY KEY ("step_name");



ALTER TABLE ONLY "public"."montessori_certs"
    ADD CONSTRAINT "montessori_certs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."planes"
    ADD CONSTRAINT "planes_pkey" PRIMARY KEY ("plane");



ALTER TABLE ONLY "public"."public_funding_sources"
    ADD CONSTRAINT "public_funding_sources_pkey" PRIMARY KEY ("name");



ALTER TABLE ONLY "public"."race_and_ethnicity"
    ADD CONSTRAINT "race_and_ethnicity_pkey" PRIMARY KEY ("category");



ALTER TABLE ONLY "public"."roles"
    ADD CONSTRAINT "roles_pkey" PRIMARY KEY ("role");



ALTER TABLE ONLY "public"."school_notes"
    ADD CONSTRAINT "school notes_pkey" PRIMARY KEY ("sch_notes_id");



ALTER TABLE ONLY "public"."school_ssj_data"
    ADD CONSTRAINT "school_ssj_data_pkey" PRIMARY KEY ("school_id");



ALTER TABLE ONLY "public"."school_years"
    ADD CONSTRAINT "school_year_pkey" PRIMARY KEY ("school_year");



ALTER TABLE ONLY "public"."schools"
    ADD CONSTRAINT "schools_pkey" PRIMARY KEY ("school_id");



ALTER TABLE ONLY "public"."sources"
    ADD CONSTRAINT "sources_pkey" PRIMARY KEY ("source");



ALTER TABLE ONLY "public"."ssj_fillout_forms"
    ADD CONSTRAINT "ssj_fillout_forms_pkey" PRIMARY KEY ("ssj_form_id");



ALTER TABLE ONLY "public"."membership_fee_annual_records"
    ADD CONSTRAINT "uq_annual_school_year_id" UNIQUE ("school_year", "entity_id");



CREATE INDEX "email_filter_addresses_educator_idx" ON "public"."email_filter_addresses" USING "btree" ("educator_id");



CREATE INDEX "email_filter_addresses_email_norm_idx" ON "public"."email_filter_addresses" USING "btree" ("public"."normalize_email"("email"));



CREATE INDEX "g_email_backfill_queue_user_enqueued_idx" ON "public"."g_email_backfill_queue" USING "btree" ("user_id", "enqueued_at");



CREATE INDEX "g_emails_user_sent_idx" ON "public"."g_emails" USING "btree" ("user_id", "sent_at" DESC NULLS LAST);



CREATE INDEX "g_events_user_start_idx" ON "public"."g_events" USING "btree" ("user_id", "start_time" DESC NULLS LAST);



CREATE INDEX "google_sync_messages_user_created_idx" ON "public"."google_sync_messages" USING "btree" ("user_id", "created_at" DESC);



CREATE OR REPLACE VIEW "public"."people_plus" AS
 SELECT "p"."person_id",
    "p"."full_name",
    "p"."first_name",
    "p"."middle_name",
    "p"."last_name",
    "p"."nickname",
    "p"."primary_phone",
    "p"."secondary_phone",
    "p"."google_groups",
    "p"."home_address",
    "p"."source_other",
    "p"."tc_userid",
    "p"."educ_attainment",
    "p"."primary_language",
    "p"."other_languages",
    "p"."race_ethnicity",
    "p"."race_ethnicity_other",
    "p"."hh_income",
    "p"."childhood_income",
    "p"."gender",
    "p"."gender_other",
    "p"."lgbtqia",
    "p"."pronouns",
    "p"."pronouns_other",
    "p"."last_modified",
    "p"."created",
    "p"."indiv_type",
    "p"."created_by",
    "p"."tags",
    "p"."exclude_from_email_logging",
    "p"."source",
    "ped"."ped_id",
    "ped"."discovery_status",
    "string_agg"("prj"."role", ', '::"text") AS "active_roles",
    "string_agg"("s"."short_name", ', '::"text") AS "active_schools",
    "pe"."email_address"
   FROM (((("public"."people" "p"
     LEFT JOIN "public"."people_educator_details" "ped" ON (("p"."person_id" = "ped"."ped_id")))
     LEFT JOIN "public"."people_roles_join" "prj" ON (("prj"."person_id" = "p"."person_id")))
     LEFT JOIN "public"."schools" "s" ON (("prj"."school_id" = "s"."school_id")))
     LEFT JOIN "public"."primary_emails" "pe" ON (("p"."person_id" = "pe"."person_id")))
  WHERE "prj"."currently_active"
  GROUP BY "p"."person_id", "ped"."ped_id", "pe"."email_address";



CREATE OR REPLACE VIEW "public"."people_plus_all" AS
 SELECT "p"."person_id",
    "p"."full_name",
    "p"."first_name",
    "p"."middle_name",
    "p"."last_name",
    "p"."nickname",
    "p"."primary_phone",
    "p"."secondary_phone",
    "p"."google_groups",
    "p"."home_address",
    "p"."source_other",
    "p"."tc_userid",
    "p"."educ_attainment",
    "p"."primary_language",
    "p"."other_languages",
    "p"."race_ethnicity",
    "p"."race_ethnicity_other",
    "p"."hh_income",
    "p"."childhood_income",
    "p"."gender",
    "p"."gender_other",
    "p"."lgbtqia",
    "p"."pronouns",
    "p"."pronouns_other",
    "p"."last_modified",
    "p"."created",
    "p"."indiv_type",
    "p"."created_by",
    "p"."tags",
    "p"."exclude_from_email_logging",
    "p"."source",
    "ped"."ped_id",
    "ped"."discovery_status",
    "string_agg"("prj"."role", ', '::"text") AS "active_roles",
    "string_agg"("s"."short_name", ', '::"text") AS "active_schools",
    "string_agg"(DISTINCT "pe"."email_address", ', '::"text") AS "email"
   FROM (((("public"."people" "p"
     LEFT JOIN "public"."people_educator_details" "ped" ON (("p"."person_id" = "ped"."ped_id")))
     LEFT JOIN "public"."people_roles_join" "prj" ON (("prj"."person_id" = "p"."person_id")))
     LEFT JOIN "public"."schools" "s" ON (("prj"."school_id" = "s"."school_id")))
     LEFT JOIN "public"."primary_emails" "pe" ON (("p"."person_id" = "pe"."person_id")))
  GROUP BY "p"."person_id", "ped"."ped_id";



CREATE OR REPLACE VIEW "public"."people_plus_f_no_roles_and_inactive_roles" AS
 SELECT "p"."person_id",
    "p"."full_name",
    "p"."first_name",
    "p"."middle_name",
    "p"."last_name",
    "p"."nickname",
    "p"."primary_phone",
    "p"."secondary_phone",
    "p"."google_groups",
    "p"."home_address",
    "p"."source_other",
    "p"."tc_userid",
    "p"."educ_attainment",
    "p"."primary_language",
    "p"."other_languages",
    "p"."race_ethnicity",
    "p"."race_ethnicity_other",
    "p"."hh_income",
    "p"."childhood_income",
    "p"."gender",
    "p"."gender_other",
    "p"."lgbtqia",
    "p"."pronouns",
    "p"."pronouns_other",
    "p"."last_modified",
    "p"."created",
    "p"."indiv_type",
    "p"."created_by",
    "p"."tags",
    "p"."exclude_from_email_logging",
    "p"."source",
    "ped"."ped_id",
    "ped"."discovery_status",
    "string_agg"("prj"."role", ', '::"text") AS "active_roles",
    "string_agg"("s"."short_name", ', '::"text") AS "active_schools",
    "string_agg"(DISTINCT "pe"."email_address", ', '::"text") AS "email"
   FROM (((("public"."people" "p"
     LEFT JOIN "public"."people_educator_details" "ped" ON (("p"."person_id" = "ped"."ped_id")))
     LEFT JOIN "public"."people_roles_join" "prj" ON (("prj"."person_id" = "p"."person_id")))
     LEFT JOIN "public"."schools" "s" ON (("prj"."school_id" = "s"."school_id")))
     LEFT JOIN "public"."primary_emails" "pe" ON (("p"."person_id" = "pe"."person_id")))
  WHERE (("prj"."currently_active" <> false) OR ("prj"."currently_active" IS NULL))
  GROUP BY "p"."person_id", "ped"."ped_id";



CREATE OR REPLACE VIEW "public"."people_plus_w_active_roles" AS
 SELECT "p"."person_id",
    "p"."full_name",
    "p"."first_name",
    "p"."middle_name",
    "p"."last_name",
    "p"."nickname",
    "p"."primary_phone",
    "p"."secondary_phone",
    "p"."google_groups",
    "p"."home_address",
    "p"."source_other",
    "p"."tc_userid",
    "p"."educ_attainment",
    "p"."primary_language",
    "p"."other_languages",
    "p"."race_ethnicity",
    "p"."race_ethnicity_other",
    "p"."hh_income",
    "p"."childhood_income",
    "p"."gender",
    "p"."gender_other",
    "p"."lgbtqia",
    "p"."pronouns",
    "p"."pronouns_other",
    "p"."last_modified",
    "p"."created",
    "p"."indiv_type",
    "p"."created_by",
    "p"."tags",
    "p"."exclude_from_email_logging",
    "p"."source",
    "ped"."ped_id",
    "ped"."discovery_status",
    "string_agg"("prj"."role", ', '::"text") AS "active_roles",
    "string_agg"("s"."short_name", ', '::"text") AS "active_schools",
    "string_agg"(DISTINCT "pe"."email_address", ', '::"text") AS "email"
   FROM (((("public"."people" "p"
     LEFT JOIN "public"."people_educator_details" "ped" ON (("p"."person_id" = "ped"."ped_id")))
     LEFT JOIN "public"."people_roles_join" "prj" ON (("prj"."person_id" = "p"."person_id")))
     LEFT JOIN "public"."schools" "s" ON (("prj"."school_id" = "s"."school_id")))
     LEFT JOIN "public"."primary_emails" "pe" ON (("p"."person_id" = "pe"."person_id")))
  WHERE "prj"."currently_active"
  GROUP BY "p"."person_id", "ped"."ped_id";



CREATE OR REPLACE TRIGGER "validate_public_funding" BEFORE INSERT OR UPDATE ON "public"."schools" FOR EACH ROW EXECUTE FUNCTION "public"."check_public_funding_valid"();



ALTER TABLE ONLY "public"."nine_nineties"
    ADD CONSTRAINT "990s_charter_id_fkey" FOREIGN KEY ("charter_id") REFERENCES "public"."charters"("charter_id");



ALTER TABLE ONLY "public"."nine_nineties"
    ADD CONSTRAINT "990s_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("school_id");



ALTER TABLE ONLY "public"."annual_assessment_and_metrics_data"
    ADD CONSTRAINT "annual_assessment_and_metrics_data_charter_id_fkey" FOREIGN KEY ("charter_id") REFERENCES "public"."charters"("charter_id");



ALTER TABLE ONLY "public"."annual_assessment_and_metrics_data"
    ADD CONSTRAINT "annual_assessment_and_metrics_data_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("school_id");



ALTER TABLE ONLY "public"."annual_assessment_and_metrics_data"
    ADD CONSTRAINT "annual_assessment_and_metrics_data_school_year_fkey" FOREIGN KEY ("school_year") REFERENCES "public"."school_years"("school_year");



ALTER TABLE ONLY "public"."annual_enrollment_and_demographics"
    ADD CONSTRAINT "annual_enrollment_and_demographics_charter_id_fkey" FOREIGN KEY ("charter_id") REFERENCES "public"."charters"("charter_id");



ALTER TABLE ONLY "public"."annual_enrollment_and_demographics"
    ADD CONSTRAINT "annual_enrollment_and_demographics_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("school_id");



ALTER TABLE ONLY "public"."annual_enrollment_and_demographics"
    ADD CONSTRAINT "annual_enrollment_and_demographics_school_year_fkey" FOREIGN KEY ("school_year") REFERENCES "public"."school_years"("school_year");



ALTER TABLE ONLY "public"."charter_applications"
    ADD CONSTRAINT "charter_applications_charter_fkey" FOREIGN KEY ("charter") REFERENCES "public"."charters"("charter_id");



ALTER TABLE ONLY "public"."educator_notes"
    ADD CONSTRAINT "educator_notes_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "public"."people"("person_id");



ALTER TABLE ONLY "public"."people_roles_join"
    ADD CONSTRAINT "educatorsXschools_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("school_id");



ALTER TABLE ONLY "public"."email_addresses"
    ADD CONSTRAINT "email_addresses_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "public"."people"("person_id");



ALTER TABLE ONLY "public"."event_attendance"
    ADD CONSTRAINT "event_attendance_event_fkey" FOREIGN KEY ("event") REFERENCES "public"."event_list"("event_name");



ALTER TABLE ONLY "public"."event_attendance"
    ADD CONSTRAINT "event_attendance_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "public"."people"("person_id");



ALTER TABLE ONLY "public"."event_list"
    ADD CONSTRAINT "event_list_type_fkey" FOREIGN KEY ("type") REFERENCES "public"."event_types"("event_type");



ALTER TABLE ONLY "public"."guide_assignments"
    ADD CONSTRAINT "fk_guide_assignments_guide" FOREIGN KEY ("guide_id") REFERENCES "public"."guides"("guide_id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."governance_docs"
    ADD CONSTRAINT "governance_docs_charter_id_fkey" FOREIGN KEY ("charter_id") REFERENCES "public"."charters"("charter_id");



ALTER TABLE ONLY "public"."governance_docs"
    ADD CONSTRAINT "governance_docs_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("school_id");



ALTER TABLE ONLY "public"."guide_assignments"
    ADD CONSTRAINT "guide_assignments_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("school_id");



ALTER TABLE ONLY "public"."imported_emails"
    ADD CONSTRAINT "imported_emails_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "public"."people"("person_id");



ALTER TABLE ONLY "public"."imported_emails"
    ADD CONSTRAINT "imported_emails_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("school_id");



ALTER TABLE ONLY "public"."loans"
    ADD CONSTRAINT "loans_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("school_id");



ALTER TABLE ONLY "public"."locations"
    ADD CONSTRAINT "locations_charter_id_fkey" FOREIGN KEY ("charter_id") REFERENCES "public"."charters"("charter_id");



ALTER TABLE ONLY "public"."membership_fee_annual_records"
    ADD CONSTRAINT "membership_fee_annual_records_school_year_fkey" FOREIGN KEY ("school_year") REFERENCES "public"."school_years"("school_year");



ALTER TABLE ONLY "public"."membership_fee_change_log"
    ADD CONSTRAINT "membership_fee_change_log_school_year_fkey" FOREIGN KEY ("school_year") REFERENCES "public"."school_years"("school_year");



ALTER TABLE ONLY "public"."montessori_certs"
    ADD CONSTRAINT "montessori_certs_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "public"."people"("person_id");



ALTER TABLE ONLY "public"."people_educator_details"
    ADD CONSTRAINT "people_educator_details_ped_id_fkey" FOREIGN KEY ("ped_id") REFERENCES "public"."people"("person_id");



ALTER TABLE ONLY "public"."people_roles_join"
    ADD CONSTRAINT "people_roles_join_charter_id_fkey" FOREIGN KEY ("charter_id") REFERENCES "public"."charters"("charter_id");



ALTER TABLE ONLY "public"."people_roles_join"
    ADD CONSTRAINT "people_schools_join_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "public"."people"("person_id");



ALTER TABLE ONLY "public"."people_roles_join"
    ADD CONSTRAINT "people_schools_join_role_fkey" FOREIGN KEY ("role") REFERENCES "public"."roles"("role");



ALTER TABLE ONLY "public"."school_notes"
    ADD CONSTRAINT "school_notes_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("school_id");



ALTER TABLE ONLY "public"."school_reports_and_submissions"
    ADD CONSTRAINT "school_reports_and_submissions_charter_id_fkey" FOREIGN KEY ("charter_id") REFERENCES "public"."charters"("charter_id");



ALTER TABLE ONLY "public"."school_reports_and_submissions"
    ADD CONSTRAINT "school_reports_and_submissions_school_year_fkey" FOREIGN KEY ("school_year") REFERENCES "public"."school_years"("school_year");



ALTER TABLE ONLY "public"."school_ssj_data"
    ADD CONSTRAINT "school_ssj_data_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("school_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."schools"
    ADD CONSTRAINT "schools_charter_id_fkey" FOREIGN KEY ("charter_id") REFERENCES "public"."charters"("charter_id");



ALTER TABLE ONLY "public"."ssj_fillout_forms"
    ADD CONSTRAINT "ssj_fillout_forms_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "public"."people"("person_id");



CREATE POLICY "initial" ON "public"."people_roles_join" USING (true) WITH CHECK (true);



CREATE POLICY "initial" ON "public"."schools" USING (true) WITH CHECK (true);



ALTER TABLE "public"."membership_fee_annual_records" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."schools" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."sources" ENABLE ROW LEVEL SECURITY;


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON FUNCTION "public"."check_public_funding_valid"() TO "anon";
GRANT ALL ON FUNCTION "public"."check_public_funding_valid"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_public_funding_valid"() TO "service_role";



GRANT ALL ON FUNCTION "public"."normalize_email"("raw" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."normalize_email"("raw" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."normalize_email"("raw" "text") TO "service_role";



GRANT ALL ON TABLE "public"."action_steps" TO "anon";
GRANT ALL ON TABLE "public"."action_steps" TO "authenticated";
GRANT ALL ON TABLE "public"."action_steps" TO "service_role";



GRANT ALL ON TABLE "public"."email_addresses" TO "anon";
GRANT ALL ON TABLE "public"."email_addresses" TO "authenticated";
GRANT ALL ON TABLE "public"."email_addresses" TO "service_role";



GRANT ALL ON TABLE "public"."people" TO "anon";
GRANT ALL ON TABLE "public"."people" TO "authenticated";
GRANT ALL ON TABLE "public"."people" TO "service_role";



GRANT ALL ON TABLE "public"."people_roles_join" TO "anon";
GRANT ALL ON TABLE "public"."people_roles_join" TO "authenticated";
GRANT ALL ON TABLE "public"."people_roles_join" TO "service_role";



GRANT ALL ON TABLE "public"."primary_emails" TO "anon";
GRANT ALL ON TABLE "public"."primary_emails" TO "authenticated";
GRANT ALL ON TABLE "public"."primary_emails" TO "service_role";



GRANT ALL ON TABLE "public"."active_tls" TO "anon";
GRANT ALL ON TABLE "public"."active_tls" TO "authenticated";
GRANT ALL ON TABLE "public"."active_tls" TO "service_role";



GRANT ALL ON TABLE "public"."guide_assignments" TO "anon";
GRANT ALL ON TABLE "public"."guide_assignments" TO "authenticated";
GRANT ALL ON TABLE "public"."guide_assignments" TO "service_role";



GRANT ALL ON TABLE "public"."guides" TO "anon";
GRANT ALL ON TABLE "public"."guides" TO "authenticated";
GRANT ALL ON TABLE "public"."guides" TO "service_role";



GRANT ALL ON TABLE "public"."all_active_roles" TO "anon";
GRANT ALL ON TABLE "public"."all_active_roles" TO "authenticated";
GRANT ALL ON TABLE "public"."all_active_roles" TO "service_role";



GRANT ALL ON TABLE "public"."all_active_roles_new" TO "anon";
GRANT ALL ON TABLE "public"."all_active_roles_new" TO "authenticated";
GRANT ALL ON TABLE "public"."all_active_roles_new" TO "service_role";



GRANT ALL ON TABLE "public"."annual_assessment_and_metrics_data" TO "anon";
GRANT ALL ON TABLE "public"."annual_assessment_and_metrics_data" TO "authenticated";
GRANT ALL ON TABLE "public"."annual_assessment_and_metrics_data" TO "service_role";



GRANT ALL ON TABLE "public"."annual_enrollment_and_demographics" TO "anon";
GRANT ALL ON TABLE "public"."annual_enrollment_and_demographics" TO "authenticated";
GRANT ALL ON TABLE "public"."annual_enrollment_and_demographics" TO "service_role";



GRANT ALL ON TABLE "public"."boolean" TO "anon";
GRANT ALL ON TABLE "public"."boolean" TO "authenticated";
GRANT ALL ON TABLE "public"."boolean" TO "service_role";



GRANT ALL ON TABLE "public"."certifications" TO "anon";
GRANT ALL ON TABLE "public"."certifications" TO "authenticated";
GRANT ALL ON TABLE "public"."certifications" TO "service_role";



GRANT ALL ON TABLE "public"."charter_applications" TO "anon";
GRANT ALL ON TABLE "public"."charter_applications" TO "authenticated";
GRANT ALL ON TABLE "public"."charter_applications" TO "service_role";



GRANT ALL ON TABLE "public"."charter_authorizers_and_contacts" TO "anon";
GRANT ALL ON TABLE "public"."charter_authorizers_and_contacts" TO "authenticated";
GRANT ALL ON TABLE "public"."charter_authorizers_and_contacts" TO "service_role";



GRANT ALL ON TABLE "public"."charters" TO "anon";
GRANT ALL ON TABLE "public"."charters" TO "authenticated";
GRANT ALL ON TABLE "public"."charters" TO "service_role";



GRANT ALL ON TABLE "public"."cohorts" TO "anon";
GRANT ALL ON TABLE "public"."cohorts" TO "authenticated";
GRANT ALL ON TABLE "public"."cohorts" TO "service_role";



GRANT ALL ON TABLE "public"."educator_notes" TO "anon";
GRANT ALL ON TABLE "public"."educator_notes" TO "authenticated";
GRANT ALL ON TABLE "public"."educator_notes" TO "service_role";



GRANT ALL ON TABLE "public"."email_filter_addresses" TO "anon";
GRANT ALL ON TABLE "public"."email_filter_addresses" TO "authenticated";
GRANT ALL ON TABLE "public"."email_filter_addresses" TO "service_role";



GRANT ALL ON TABLE "public"."email_filter_addresses_filtered" TO "anon";
GRANT ALL ON TABLE "public"."email_filter_addresses_filtered" TO "authenticated";
GRANT ALL ON TABLE "public"."email_filter_addresses_filtered" TO "service_role";



GRANT ALL ON TABLE "public"."schools" TO "anon";
GRANT ALL ON TABLE "public"."schools" TO "authenticated";
GRANT ALL ON TABLE "public"."schools" TO "service_role";



GRANT ALL ON TABLE "public"."entities" TO "anon";
GRANT ALL ON TABLE "public"."entities" TO "authenticated";
GRANT ALL ON TABLE "public"."entities" TO "service_role";



GRANT ALL ON TABLE "public"."event_attendance" TO "anon";
GRANT ALL ON TABLE "public"."event_attendance" TO "authenticated";
GRANT ALL ON TABLE "public"."event_attendance" TO "service_role";



GRANT ALL ON TABLE "public"."event_list" TO "anon";
GRANT ALL ON TABLE "public"."event_list" TO "authenticated";
GRANT ALL ON TABLE "public"."event_list" TO "service_role";



GRANT ALL ON TABLE "public"."event_types" TO "anon";
GRANT ALL ON TABLE "public"."event_types" TO "authenticated";
GRANT ALL ON TABLE "public"."event_types" TO "service_role";



GRANT ALL ON TABLE "public"."founding_tls" TO "anon";
GRANT ALL ON TABLE "public"."founding_tls" TO "authenticated";
GRANT ALL ON TABLE "public"."founding_tls" TO "service_role";



GRANT ALL ON TABLE "public"."g_email_backfill_queue" TO "anon";
GRANT ALL ON TABLE "public"."g_email_backfill_queue" TO "authenticated";
GRANT ALL ON TABLE "public"."g_email_backfill_queue" TO "service_role";



GRANT ALL ON TABLE "public"."g_email_sync_progress" TO "anon";
GRANT ALL ON TABLE "public"."g_email_sync_progress" TO "authenticated";
GRANT ALL ON TABLE "public"."g_email_sync_progress" TO "service_role";



GRANT ALL ON TABLE "public"."g_emails" TO "anon";
GRANT ALL ON TABLE "public"."g_emails" TO "authenticated";
GRANT ALL ON TABLE "public"."g_emails" TO "service_role";



GRANT ALL ON TABLE "public"."g_event_sync_progress" TO "anon";
GRANT ALL ON TABLE "public"."g_event_sync_progress" TO "authenticated";
GRANT ALL ON TABLE "public"."g_event_sync_progress" TO "service_role";



GRANT ALL ON TABLE "public"."g_events" TO "anon";
GRANT ALL ON TABLE "public"."g_events" TO "authenticated";
GRANT ALL ON TABLE "public"."g_events" TO "service_role";



GRANT ALL ON TABLE "public"."gender" TO "anon";
GRANT ALL ON TABLE "public"."gender" TO "authenticated";
GRANT ALL ON TABLE "public"."gender" TO "service_role";



GRANT ALL ON TABLE "public"."google_auth_tokens" TO "anon";
GRANT ALL ON TABLE "public"."google_auth_tokens" TO "authenticated";
GRANT ALL ON TABLE "public"."google_auth_tokens" TO "service_role";



GRANT ALL ON TABLE "public"."google_sync_messages" TO "anon";
GRANT ALL ON TABLE "public"."google_sync_messages" TO "authenticated";
GRANT ALL ON TABLE "public"."google_sync_messages" TO "service_role";



GRANT ALL ON TABLE "public"."governance_docs" TO "anon";
GRANT ALL ON TABLE "public"."governance_docs" TO "authenticated";
GRANT ALL ON TABLE "public"."governance_docs" TO "service_role";



GRANT ALL ON TABLE "public"."grants" TO "anon";
GRANT ALL ON TABLE "public"."grants" TO "authenticated";
GRANT ALL ON TABLE "public"."grants" TO "service_role";



GRANT ALL ON TABLE "public"."guide_assignments_plus" TO "anon";
GRANT ALL ON TABLE "public"."guide_assignments_plus" TO "authenticated";
GRANT ALL ON TABLE "public"."guide_assignments_plus" TO "service_role";



GRANT ALL ON TABLE "public"."imported_emails" TO "anon";
GRANT ALL ON TABLE "public"."imported_emails" TO "authenticated";
GRANT ALL ON TABLE "public"."imported_emails" TO "service_role";



GRANT ALL ON TABLE "public"."imported_meetings" TO "anon";
GRANT ALL ON TABLE "public"."imported_meetings" TO "authenticated";
GRANT ALL ON TABLE "public"."imported_meetings" TO "service_role";



GRANT ALL ON TABLE "public"."lead_routing_and_templates" TO "anon";
GRANT ALL ON TABLE "public"."lead_routing_and_templates" TO "authenticated";
GRANT ALL ON TABLE "public"."lead_routing_and_templates" TO "service_role";



GRANT ALL ON TABLE "public"."loans" TO "anon";
GRANT ALL ON TABLE "public"."loans" TO "authenticated";
GRANT ALL ON TABLE "public"."loans" TO "service_role";



GRANT ALL ON TABLE "public"."locations" TO "anon";
GRANT ALL ON TABLE "public"."locations" TO "authenticated";
GRANT ALL ON TABLE "public"."locations" TO "service_role";



GRANT ALL ON TABLE "public"."mailing_lists" TO "anon";
GRANT ALL ON TABLE "public"."mailing_lists" TO "authenticated";
GRANT ALL ON TABLE "public"."mailing_lists" TO "service_role";



GRANT ALL ON TABLE "public"."membership_fee_annual_records" TO "anon";
GRANT ALL ON TABLE "public"."membership_fee_annual_records" TO "authenticated";
GRANT ALL ON TABLE "public"."membership_fee_annual_records" TO "service_role";



GRANT ALL ON TABLE "public"."membership_fee_change_log" TO "anon";
GRANT ALL ON TABLE "public"."membership_fee_change_log" TO "authenticated";
GRANT ALL ON TABLE "public"."membership_fee_change_log" TO "service_role";



GRANT ALL ON TABLE "public"."membership_fee_updated_view" TO "anon";
GRANT ALL ON TABLE "public"."membership_fee_updated_view" TO "authenticated";
GRANT ALL ON TABLE "public"."membership_fee_updated_view" TO "service_role";



GRANT ALL ON TABLE "public"."membership_termination_process_steps" TO "anon";
GRANT ALL ON TABLE "public"."membership_termination_process_steps" TO "authenticated";
GRANT ALL ON TABLE "public"."membership_termination_process_steps" TO "service_role";



GRANT ALL ON TABLE "public"."montessori_certs" TO "anon";
GRANT ALL ON TABLE "public"."montessori_certs" TO "authenticated";
GRANT ALL ON TABLE "public"."montessori_certs" TO "service_role";



GRANT ALL ON TABLE "public"."mont_certs_complete_summary" TO "anon";
GRANT ALL ON TABLE "public"."mont_certs_complete_summary" TO "authenticated";
GRANT ALL ON TABLE "public"."mont_certs_complete_summary" TO "service_role";



GRANT ALL ON TABLE "public"."mont_certs_in_process_summary" TO "anon";
GRANT ALL ON TABLE "public"."mont_certs_in_process_summary" TO "authenticated";
GRANT ALL ON TABLE "public"."mont_certs_in_process_summary" TO "service_role";



GRANT ALL ON TABLE "public"."nine_nineties" TO "anon";
GRANT ALL ON TABLE "public"."nine_nineties" TO "authenticated";
GRANT ALL ON TABLE "public"."nine_nineties" TO "service_role";



GRANT ALL ON TABLE "public"."people_educator_details" TO "anon";
GRANT ALL ON TABLE "public"."people_educator_details" TO "authenticated";
GRANT ALL ON TABLE "public"."people_educator_details" TO "service_role";



GRANT ALL ON TABLE "public"."people_join_roles_plus" TO "anon";
GRANT ALL ON TABLE "public"."people_join_roles_plus" TO "authenticated";
GRANT ALL ON TABLE "public"."people_join_roles_plus" TO "service_role";



GRANT ALL ON TABLE "public"."people_plus" TO "anon";
GRANT ALL ON TABLE "public"."people_plus" TO "authenticated";
GRANT ALL ON TABLE "public"."people_plus" TO "service_role";



GRANT ALL ON TABLE "public"."people_plus_all" TO "anon";
GRANT ALL ON TABLE "public"."people_plus_all" TO "authenticated";
GRANT ALL ON TABLE "public"."people_plus_all" TO "service_role";



GRANT ALL ON TABLE "public"."people_plus_f_no_roles_and_inactive_roles" TO "anon";
GRANT ALL ON TABLE "public"."people_plus_f_no_roles_and_inactive_roles" TO "authenticated";
GRANT ALL ON TABLE "public"."people_plus_f_no_roles_and_inactive_roles" TO "service_role";



GRANT ALL ON TABLE "public"."people_plus_w_active_roles" TO "anon";
GRANT ALL ON TABLE "public"."people_plus_w_active_roles" TO "authenticated";
GRANT ALL ON TABLE "public"."people_plus_w_active_roles" TO "service_role";



GRANT ALL ON TABLE "public"."planes" TO "anon";
GRANT ALL ON TABLE "public"."planes" TO "authenticated";
GRANT ALL ON TABLE "public"."planes" TO "service_role";



GRANT ALL ON TABLE "public"."preview_people_duplicates" TO "anon";
GRANT ALL ON TABLE "public"."preview_people_duplicates" TO "authenticated";
GRANT ALL ON TABLE "public"."preview_people_duplicates" TO "service_role";



GRANT ALL ON TABLE "public"."public_funding_sources" TO "anon";
GRANT ALL ON TABLE "public"."public_funding_sources" TO "authenticated";
GRANT ALL ON TABLE "public"."public_funding_sources" TO "service_role";



GRANT ALL ON TABLE "public"."race_and_ethnicity" TO "anon";
GRANT ALL ON TABLE "public"."race_and_ethnicity" TO "authenticated";
GRANT ALL ON TABLE "public"."race_and_ethnicity" TO "service_role";



GRANT ALL ON TABLE "public"."roles" TO "anon";
GRANT ALL ON TABLE "public"."roles" TO "authenticated";
GRANT ALL ON TABLE "public"."roles" TO "service_role";



GRANT ALL ON TABLE "public"."school_notes" TO "anon";
GRANT ALL ON TABLE "public"."school_notes" TO "authenticated";
GRANT ALL ON TABLE "public"."school_notes" TO "service_role";



GRANT ALL ON TABLE "public"."school_reports_and_submissions" TO "anon";
GRANT ALL ON TABLE "public"."school_reports_and_submissions" TO "authenticated";
GRANT ALL ON TABLE "public"."school_reports_and_submissions" TO "service_role";



GRANT ALL ON TABLE "public"."school_ssj_data" TO "anon";
GRANT ALL ON TABLE "public"."school_ssj_data" TO "authenticated";
GRANT ALL ON TABLE "public"."school_ssj_data" TO "service_role";



GRANT ALL ON TABLE "public"."school_years" TO "anon";
GRANT ALL ON TABLE "public"."school_years" TO "authenticated";
GRANT ALL ON TABLE "public"."school_years" TO "service_role";



GRANT ALL ON TABLE "public"."schools_plus" TO "anon";
GRANT ALL ON TABLE "public"."schools_plus" TO "authenticated";
GRANT ALL ON TABLE "public"."schools_plus" TO "service_role";



GRANT ALL ON TABLE "public"."select_teacher" TO "anon";
GRANT ALL ON TABLE "public"."select_teacher" TO "authenticated";
GRANT ALL ON TABLE "public"."select_teacher" TO "service_role";



GRANT ALL ON TABLE "public"."sources" TO "anon";
GRANT ALL ON TABLE "public"."sources" TO "authenticated";
GRANT ALL ON TABLE "public"."sources" TO "service_role";



GRANT ALL ON TABLE "public"."ssj_fillout_forms" TO "anon";
GRANT ALL ON TABLE "public"."ssj_fillout_forms" TO "authenticated";
GRANT ALL ON TABLE "public"."ssj_fillout_forms" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






RESET ALL;
