create schema if not exists "airtable";

create extension if not exists "wrappers" with schema "extensions";

create type "public"."action_step_status" as enum ('Complete', 'Incomplete');

create type "public"."active_inactive" as enum ('Active', 'Inactive', 'Removed');

create type "public"."age_spans" as enum ('0-3', '3-6', '6-9', '9-12', '12-15', '15-18');

create type "public"."ages-grades" as enum ('Infants', 'Toddlers', 'PK3', 'PK4', 'K', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th');

create type "public"."authorizor_decisions" as enum ('Approved', 'Approved, with contingency', 'Deferred decision', 'Denied');

create type "public"."automation_step_trigger" as enum ('Request prelim advice for $3k+', 'Request full advice', 'Waiting for prelim advice', 'Waiting for full advice', 'Proceed', 'Processing', 'Waiting for prereqs', 'Complete');

create type "public"."certification_completion_status" as enum ('Certified', 'Training');

create type "public"."charter_app_status" as enum ('Pre application', 'Preparing application', 'Awaiting decision', 'Authorized, preparing to open');

create type "public"."charter_status" as enum ('Awaiting start of cohort');

create type "public"."cohort_type" as enum ('Charter', 'Blooms');

create type "public"."developmental_planes" as enum ('Infants', 'Toddlers', 'Primary', 'Lower Elementary', 'Upper Elementary', 'Adolescent / JH', 'High School');

create type "public"."discovery_statuses" as enum ('Complete', 'In process', 'Paused');

create type "public"."educ_attainment_options" as enum ('Did not graduate high school', 'Graduated high school or GED', 'Some college or two-year degree', 'Graduated college (four-year degree)', 'Some graduate school', 'Completed graduate school');

create type "public"."email_address_categories" as enum ('personal', 'work - non-wildflower', 'work - wildflower school', 'work - wildflower foundation', 'school');

create type "public"."exemption_statuses" as enum ('Exempt', 'Non-exempt');

create type "public"."fee_change_types" as enum ('Change in exemption status', 'Change in fee', 'Change likelihood of payment');

create type "public"."fiscal_year_end" as enum ('06/30', '12/31');

create type "public"."gender_categories" as enum ('Female', 'Male', 'Gender Non-Conforming', 'Other');

create type "public"."governance_models" as enum ('Independent', 'Charter', 'Community Partnership', 'District', 'Exploring Charter', 'NULL');

create type "public"."group_exemption_status" as enum ('Active', 'Never part of group exemption', 'Withdrawn');

create type "public"."gsuite_roles_options" as enum ('School Admin - School Orgs');

create type "public"."guide_types" as enum ('Ops Guide', 'Entrepreneur', 'Equity Coach', 'Open Schools Support');

create type "public"."high_med_low" as enum ('Low', 'Medium', 'High');

create type "public"."income_categories" as enum ('Very low', 'Low', 'Middle', 'Upper', 'Prefer not to respond');

create type "public"."languages" as enum ('English', 'Spanish - Español', 'Mandarin - 中文', 'Hindi - हिन्दी', 'French - Français', 'Japanese - 日本語', 'Arabic - العَرَبِيَّة', 'Urdu - اُردُو', 'Hungarian - Hungarian', 'Haitian Creole - Kreyol Ayisyen', 'Gujarati - ગુજરાતી', 'Fujian- Fujian', 'Russian - русский язык', 'Korean - 한국어', 'Cantonese - Gwóngdūng wá', 'Tai-Kadai - ไทย / ພາສາລາວ', 'Portuguese - Português', 'Tami - தமிழ்', 'Burmese - မြန်မာစာ', 'Yoruba', 'Other');

create type "public"."loan_status_options" as enum ('Interest Only Period', 'Paid Off', 'Principal Repayment Period');

create type "public"."loan_vehicle_options" as enum ('LF II', 'Sep', 'Spring Point', 'TWF', 'TWF->LF II');

create type "public"."location_types" as enum ('Mailing address - no physical school', 'Physical address - does not receive mail', 'School address and mailing address');

create type "public"."logo_designer_options" as enum ('internal design', 'external design');

create type "public"."membership_statuses" as enum ('Member', 'Affiliated non-member');

create type "public"."montessori_associations" as enum ('AMI', 'AMS', 'IMC', 'MEPI', 'PAMS', 'Independent', 'Other');

create type "public"."nps" as enum ('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10');

create type "public"."ops_guide_support_track_options" as enum ('Cohort', '1:1 support');

create type "public"."partner_roles" as enum ('TL', 'Affiliate of Charter Partner', 'Ops Guide', 'Teacher Leader', 'Foundation Partner', 'Regional Entrepreneur', 'School Supports Partner', 'Finance Administrator');

create type "public"."pre_wf_employment_statuses" as enum ('1');

create type "public"."pronouns" as enum ('he/him/his', 'she/her/hers', 'they/them/theirs', 'other');

create type "public"."race_ethnicity_categories" as enum ('african_american', 'asian_american', 'hispanic', 'middle_eastern', 'native_american', 'pacific_islander', 'white', 'other');

create type "public"."school_calendar_options" as enum ('9-month', '10-month', 'Year-round');

create type "public"."school_roles" as enum ('Teacher Leader', 'Emerging Teacher Leader', 'Founder', 'Classroom Staff', 'Fellow', 'Other');

create type "public"."school_schedule_options" as enum ('Before Care', 'Morning Care', 'Afternoon Care', 'After Care');

create type "public"."school_ssj_data_ssj_on_track_for_enrollment_enum" as enum ('Maybe (process is ready, no prospective students)', 'No (process unclear/unpublished, limited/no family engagement)', 'Yes - tuition published, plan and community engagement underway');

create type "public"."school_statuses" as enum ('Emerging', 'Open', 'Paused', 'Disaffiliated', 'Permanently Closed', 'Placeholder');

create type "public"."ssj_board_dev_status" as enum ('No board', 'Board is forming, 1-2 mtgs', 'Board is developed and engaged, 3+ mtgs');

create type "public"."ssj_budget_ready_for_next_steps_enum" as enum ('No', 'Unsure', 'Yes');

create type "public"."ssj_building4good_status_enum" as enum ('Matched', 'Requested', 'Upcoming');

create type "public"."ssj_cohort_status_enum" as enum ('Left Cohort', 'Returning for Later Cohort', 'Switched Ops Guide Supports', 'Transitioned to Charter Application Supports');

create type "public"."ssj_date_shared_with_n4g_enum" as enum ('2020-01-15');

create type "public"."ssj_facility_enum" as enum ('Purchased building', 'Searching, intending to buy', 'Searching, intending to rent', 'Identified prospect(s)', 'Signed lease', 'Unsure');

create type "public"."ssj_form_type" as enum ('Get Involved', 'Start a School');

create type "public"."ssj_has_partner_enum" as enum ('No partner', 'Partnership established', 'Partnership In development');

create type "public"."ssj_pathway_to_funding_enum" as enum ('Maybe, prospects identified but not secured', 'No, startup funding unlikely', 'Yes, full funding likely');

create type "public"."ssj_seeking_wf_funding_enum" as enum ('No', 'Yes, grant', 'Yes, grant; Yes, loan', 'Yes, loan', 'Yes, loan; Yes, grant');

create type "public"."ssj_stages" as enum ('Visioning', 'Planning', 'Startup', 'Year 1', 'Complete');

create type "public"."ssj_tool_enum" as enum ('Charter Slides', 'Google Slides', 'My Wildflower - Sensible Default', 'Platform Pilot');

create type "public"."state_abbreviation_enum" as enum ('AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'PR');

create type "public"."training_types" as enum ('Lead Guide', 'Assistant', 'Administrator');

create type "public"."use_of_proceeds_options" as enum ('Combine 2 loans', 'Expansion', 'Move', 'Operations', 'Renovations / Construction', 'Security deposit', 'Start-up');

revoke delete on table "public"."email_filter_addresses" from "anon";

revoke insert on table "public"."email_filter_addresses" from "anon";

revoke references on table "public"."email_filter_addresses" from "anon";

revoke select on table "public"."email_filter_addresses" from "anon";

revoke trigger on table "public"."email_filter_addresses" from "anon";

revoke truncate on table "public"."email_filter_addresses" from "anon";

revoke update on table "public"."email_filter_addresses" from "anon";

revoke delete on table "public"."email_filter_addresses" from "authenticated";

revoke insert on table "public"."email_filter_addresses" from "authenticated";

revoke references on table "public"."email_filter_addresses" from "authenticated";

revoke select on table "public"."email_filter_addresses" from "authenticated";

revoke trigger on table "public"."email_filter_addresses" from "authenticated";

revoke truncate on table "public"."email_filter_addresses" from "authenticated";

revoke update on table "public"."email_filter_addresses" from "authenticated";

revoke delete on table "public"."email_filter_addresses" from "service_role";

revoke insert on table "public"."email_filter_addresses" from "service_role";

revoke references on table "public"."email_filter_addresses" from "service_role";

revoke select on table "public"."email_filter_addresses" from "service_role";

revoke trigger on table "public"."email_filter_addresses" from "service_role";

revoke truncate on table "public"."email_filter_addresses" from "service_role";

revoke update on table "public"."email_filter_addresses" from "service_role";

revoke delete on table "public"."g_email_backfill_queue" from "anon";

revoke insert on table "public"."g_email_backfill_queue" from "anon";

revoke references on table "public"."g_email_backfill_queue" from "anon";

revoke select on table "public"."g_email_backfill_queue" from "anon";

revoke trigger on table "public"."g_email_backfill_queue" from "anon";

revoke truncate on table "public"."g_email_backfill_queue" from "anon";

revoke update on table "public"."g_email_backfill_queue" from "anon";

revoke delete on table "public"."g_email_backfill_queue" from "authenticated";

revoke insert on table "public"."g_email_backfill_queue" from "authenticated";

revoke references on table "public"."g_email_backfill_queue" from "authenticated";

revoke select on table "public"."g_email_backfill_queue" from "authenticated";

revoke trigger on table "public"."g_email_backfill_queue" from "authenticated";

revoke truncate on table "public"."g_email_backfill_queue" from "authenticated";

revoke update on table "public"."g_email_backfill_queue" from "authenticated";

revoke delete on table "public"."g_email_backfill_queue" from "service_role";

revoke insert on table "public"."g_email_backfill_queue" from "service_role";

revoke references on table "public"."g_email_backfill_queue" from "service_role";

revoke select on table "public"."g_email_backfill_queue" from "service_role";

revoke trigger on table "public"."g_email_backfill_queue" from "service_role";

revoke truncate on table "public"."g_email_backfill_queue" from "service_role";

revoke update on table "public"."g_email_backfill_queue" from "service_role";

revoke delete on table "public"."g_email_sync_progress" from "anon";

revoke insert on table "public"."g_email_sync_progress" from "anon";

revoke references on table "public"."g_email_sync_progress" from "anon";

revoke select on table "public"."g_email_sync_progress" from "anon";

revoke trigger on table "public"."g_email_sync_progress" from "anon";

revoke truncate on table "public"."g_email_sync_progress" from "anon";

revoke update on table "public"."g_email_sync_progress" from "anon";

revoke delete on table "public"."g_email_sync_progress" from "authenticated";

revoke insert on table "public"."g_email_sync_progress" from "authenticated";

revoke references on table "public"."g_email_sync_progress" from "authenticated";

revoke select on table "public"."g_email_sync_progress" from "authenticated";

revoke trigger on table "public"."g_email_sync_progress" from "authenticated";

revoke truncate on table "public"."g_email_sync_progress" from "authenticated";

revoke update on table "public"."g_email_sync_progress" from "authenticated";

revoke delete on table "public"."g_email_sync_progress" from "service_role";

revoke insert on table "public"."g_email_sync_progress" from "service_role";

revoke references on table "public"."g_email_sync_progress" from "service_role";

revoke select on table "public"."g_email_sync_progress" from "service_role";

revoke trigger on table "public"."g_email_sync_progress" from "service_role";

revoke truncate on table "public"."g_email_sync_progress" from "service_role";

revoke update on table "public"."g_email_sync_progress" from "service_role";

revoke delete on table "public"."g_emails" from "anon";

revoke insert on table "public"."g_emails" from "anon";

revoke references on table "public"."g_emails" from "anon";

revoke select on table "public"."g_emails" from "anon";

revoke trigger on table "public"."g_emails" from "anon";

revoke truncate on table "public"."g_emails" from "anon";

revoke update on table "public"."g_emails" from "anon";

revoke delete on table "public"."g_emails" from "authenticated";

revoke insert on table "public"."g_emails" from "authenticated";

revoke references on table "public"."g_emails" from "authenticated";

revoke select on table "public"."g_emails" from "authenticated";

revoke trigger on table "public"."g_emails" from "authenticated";

revoke truncate on table "public"."g_emails" from "authenticated";

revoke update on table "public"."g_emails" from "authenticated";

revoke delete on table "public"."g_emails" from "service_role";

revoke insert on table "public"."g_emails" from "service_role";

revoke references on table "public"."g_emails" from "service_role";

revoke select on table "public"."g_emails" from "service_role";

revoke trigger on table "public"."g_emails" from "service_role";

revoke truncate on table "public"."g_emails" from "service_role";

revoke update on table "public"."g_emails" from "service_role";

revoke delete on table "public"."g_event_sync_progress" from "anon";

revoke insert on table "public"."g_event_sync_progress" from "anon";

revoke references on table "public"."g_event_sync_progress" from "anon";

revoke select on table "public"."g_event_sync_progress" from "anon";

revoke trigger on table "public"."g_event_sync_progress" from "anon";

revoke truncate on table "public"."g_event_sync_progress" from "anon";

revoke update on table "public"."g_event_sync_progress" from "anon";

revoke delete on table "public"."g_event_sync_progress" from "authenticated";

revoke insert on table "public"."g_event_sync_progress" from "authenticated";

revoke references on table "public"."g_event_sync_progress" from "authenticated";

revoke select on table "public"."g_event_sync_progress" from "authenticated";

revoke trigger on table "public"."g_event_sync_progress" from "authenticated";

revoke truncate on table "public"."g_event_sync_progress" from "authenticated";

revoke update on table "public"."g_event_sync_progress" from "authenticated";

revoke delete on table "public"."g_event_sync_progress" from "service_role";

revoke insert on table "public"."g_event_sync_progress" from "service_role";

revoke references on table "public"."g_event_sync_progress" from "service_role";

revoke select on table "public"."g_event_sync_progress" from "service_role";

revoke trigger on table "public"."g_event_sync_progress" from "service_role";

revoke truncate on table "public"."g_event_sync_progress" from "service_role";

revoke update on table "public"."g_event_sync_progress" from "service_role";

revoke delete on table "public"."g_events" from "anon";

revoke insert on table "public"."g_events" from "anon";

revoke references on table "public"."g_events" from "anon";

revoke select on table "public"."g_events" from "anon";

revoke trigger on table "public"."g_events" from "anon";

revoke truncate on table "public"."g_events" from "anon";

revoke update on table "public"."g_events" from "anon";

revoke delete on table "public"."g_events" from "authenticated";

revoke insert on table "public"."g_events" from "authenticated";

revoke references on table "public"."g_events" from "authenticated";

revoke select on table "public"."g_events" from "authenticated";

revoke trigger on table "public"."g_events" from "authenticated";

revoke truncate on table "public"."g_events" from "authenticated";

revoke update on table "public"."g_events" from "authenticated";

revoke delete on table "public"."g_events" from "service_role";

revoke insert on table "public"."g_events" from "service_role";

revoke references on table "public"."g_events" from "service_role";

revoke select on table "public"."g_events" from "service_role";

revoke trigger on table "public"."g_events" from "service_role";

revoke truncate on table "public"."g_events" from "service_role";

revoke update on table "public"."g_events" from "service_role";

revoke delete on table "public"."google_auth_tokens" from "anon";

revoke insert on table "public"."google_auth_tokens" from "anon";

revoke references on table "public"."google_auth_tokens" from "anon";

revoke select on table "public"."google_auth_tokens" from "anon";

revoke trigger on table "public"."google_auth_tokens" from "anon";

revoke truncate on table "public"."google_auth_tokens" from "anon";

revoke update on table "public"."google_auth_tokens" from "anon";

revoke delete on table "public"."google_auth_tokens" from "authenticated";

revoke insert on table "public"."google_auth_tokens" from "authenticated";

revoke references on table "public"."google_auth_tokens" from "authenticated";

revoke select on table "public"."google_auth_tokens" from "authenticated";

revoke trigger on table "public"."google_auth_tokens" from "authenticated";

revoke truncate on table "public"."google_auth_tokens" from "authenticated";

revoke update on table "public"."google_auth_tokens" from "authenticated";

revoke delete on table "public"."google_auth_tokens" from "service_role";

revoke insert on table "public"."google_auth_tokens" from "service_role";

revoke references on table "public"."google_auth_tokens" from "service_role";

revoke select on table "public"."google_auth_tokens" from "service_role";

revoke trigger on table "public"."google_auth_tokens" from "service_role";

revoke truncate on table "public"."google_auth_tokens" from "service_role";

revoke update on table "public"."google_auth_tokens" from "service_role";

revoke delete on table "public"."google_sync_messages" from "anon";

revoke insert on table "public"."google_sync_messages" from "anon";

revoke references on table "public"."google_sync_messages" from "anon";

revoke select on table "public"."google_sync_messages" from "anon";

revoke trigger on table "public"."google_sync_messages" from "anon";

revoke truncate on table "public"."google_sync_messages" from "anon";

revoke update on table "public"."google_sync_messages" from "anon";

revoke delete on table "public"."google_sync_messages" from "authenticated";

revoke insert on table "public"."google_sync_messages" from "authenticated";

revoke references on table "public"."google_sync_messages" from "authenticated";

revoke select on table "public"."google_sync_messages" from "authenticated";

revoke trigger on table "public"."google_sync_messages" from "authenticated";

revoke truncate on table "public"."google_sync_messages" from "authenticated";

revoke update on table "public"."google_sync_messages" from "authenticated";

revoke delete on table "public"."google_sync_messages" from "service_role";

revoke insert on table "public"."google_sync_messages" from "service_role";

revoke references on table "public"."google_sync_messages" from "service_role";

revoke select on table "public"."google_sync_messages" from "service_role";

revoke trigger on table "public"."google_sync_messages" from "service_role";

revoke truncate on table "public"."google_sync_messages" from "service_role";

revoke update on table "public"."google_sync_messages" from "service_role";


  create table "public"."action_steps" (
    "item" text,
    "assignee" text,
    "item_status" action_step_status,
    "id" uuid not null default gen_random_uuid(),
    "entity_id" uuid,
    "assigned_date" date,
    "due_date" date,
    "completed_date" date
      );



  create table "public"."annual_assessment_and_metrics_data" (
    "school_year" text,
    "assessment_or_metric" text,
    "metric_data" text,
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
    "id" uuid not null default gen_random_uuid(),
    "charter_id" uuid,
    "school_id" uuid
      );



  create table "public"."annual_enrollment_and_demographics" (
    "school_year" text,
    "enrolled_students_total" smallint,
    "enrolled_frl" smallint,
    "enrolled_bipoc" smallint,
    "enrolled_ell" smallint,
    "enrolled_sped" smallint,
    "charter_id" uuid,
    "school_id" uuid,
    "id" uuid not null default gen_random_uuid()
      );



  create table "public"."boolean" (
    "category" text not null,
    "english" text,
    "spanish" text
      );



  create table "public"."certifications" (
    "credential_level" text not null,
    "ages" age_spans[],
    "lead_guide_training" boolean,
    "admin_training" boolean,
    "synonyms" text[]
      );



  create table "public"."charter_applications" (
    "old_id" text,
    "full_name" text,
    "target_open" text,
    "support_timeline" text,
    "app_window" text,
    "key_dates" text,
    "milestones" text,
    "authorizor" text,
    "num_students" integer,
    "beg_age" "ages-grades",
    "end_age" "ages-grades",
    "loi_required" boolean,
    "loi_deadline" text,
    "loi_submitted" boolean,
    "loi" text,
    "odds_authorization" text,
    "odds_on_time_open" text,
    "charter_app_roles_set" boolean,
    "charter_app_pm_plan_complete" boolean,
    "logic_model_complete" boolean,
    "comm_engagement_underway" boolean,
    "nonprofit_status" text,
    "app_deadline" date,
    "app_submitted" boolean,
    "joint_kickoff_meeting_date" date,
    "internal_support_meeting_date" date,
    "app_walkthrough_date" date,
    "capacity_intv_training_complete" boolean,
    "capacity_intv_proj_date" date,
    "capacity_intv_completed_date" date,
    "auth_decision" authorizor_decisions,
    "design_advice_session_complete" boolean,
    "board_membership_signed_date" date,
    "design_album" text,
    "budget_exercises" text,
    "budget_final" text,
    "most_recent_app" boolean,
    "app_status" charter_app_status,
    "team" text,
    "opps_challenges" text,
    "charter_app_id" uuid not null default gen_random_uuid(),
    "charter" uuid,
    "decision_expected_date" date
      );



  create table "public"."charter_authorizers_and_contacts" (
    "authorizer_name" text,
    "contact_name" text,
    "title" text,
    "email" text,
    "phone" text,
    "active" boolean not null,
    "charter_id" uuid not null
      );



  create table "public"."charters" (
    "old_id" text not null,
    "short_name" text,
    "full_name" text,
    "initial_target_geo" text,
    "landscape_analysis" text,
    "application" text,
    "non_tl_roles" text,
    "proj_open" date,
    "cohorts" text[],
    "status" text,
    "group_exemption_status" active_inactive,
    "group_exemption_data_received" text,
    "ein" text,
    "incorp_date" date,
    "current_fy_end" fiscal_year_end,
    "non_discrimination_policy_on_website" boolean,
    "school_provided_1023" boolean,
    "guidestar_listing_requested" boolean,
    "partnership_with_wf" text,
    "authorized" boolean,
    "first_site_opened_date" date,
    "website" text,
    "nonprofit_status" boolean,
    "charter_membership_agreement" text,
    "charter_membership_agreement_signed_date" date,
    "charter_id" uuid not null default gen_random_uuid(),
    "initial_target_planes" developmental_planes[]
      );



  create table "public"."cohorts" (
    "name" text not null,
    "cohort_type" cohort_type,
    "start_date" date
      );



  create table "public"."educator_notes" (
    "notes" text,
    "created_date" date,
    "created_by" text,
    "private" boolean,
    "person_id" uuid,
    "educ_notes_id" uuid not null default gen_random_uuid()
      );



  create table "public"."email_addresses" (
    "email_addr_id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "person_id" uuid,
    "email_address" text,
    "category" email_address_categories,
    "primary" boolean
      );



  create table "public"."event_attendance" (
    "event_attd_id" uuid not null default gen_random_uuid(),
    "person_id" uuid,
    "event" text,
    "registration_date" date,
    "attended_event" boolean,
    "duration_at_event_in_minutes" smallint,
    "spanish_translation_needed" boolean
      );



  create table "public"."event_list" (
    "event_name" text not null,
    "event_date" date,
    "type" text
      );



  create table "public"."event_types" (
    "event_type" text not null
      );



  create table "public"."gender" (
    "category" text not null,
    "english" text,
    "spanish" text
      );



  create table "public"."governance_docs" (
    "school_name" text,
    "doc_type" text,
    "pdf" text,
    "id" uuid not null default gen_random_uuid(),
    "school_id" uuid,
    "charter_id" uuid
      );



  create table "public"."grants" (
    "actual_tls" text,
    "actual_school_legal_name" text,
    "actual_mailing_address" text,
    "actual_tl_emails" text,
    "actual_ein" text,
    "actual_nonprofit_status" text,
    "actual_membership_status" text,
    "ready_to_accept_flag" text,
    "ready_to_issue_grant_letter_flag" text,
    "bill_account" text,
    "guide_first_name" text,
    "School Grant Name" text,
    "grant_status" text,
    "amount" numeric,
    "issue_date" date,
    "funding_source" text,
    "issued_by" text,
    "label" text,
    "accounting_notes" text,
    "qbo_number" integer,
    "notes" text,
    "ledger_entry" text,
    "funding_purpose" text,
    "funding_period" text,
    "actual_501c3_proof" text,
    "automation_step_trigger" automation_step_trigger,
    "prelim_advice_request_timestamp" timestamp with time zone,
    "full_advice_request_timestamp" timestamp with time zone,
    "end_of_full_advice_window" text,
    "unsigned_grant_agreement" text,
    "signed_grant_agreement" text,
    "grant_advice" text,
    "grant_id" uuid not null default gen_random_uuid(),
    "school_id" uuid default gen_random_uuid()
      );



  create table "public"."guide_assignments" (
    "old_id" text not null,
    "start_date" date,
    "end_date" date,
    "type" guide_types,
    "active" boolean,
    "guide_id" uuid,
    "guide_assign_id" uuid not null default gen_random_uuid(),
    "school_id" uuid
      );



  create table "public"."guides" (
    "email_or_name" text,
    "old_id" text,
    "email" text,
    "currently_active" boolean,
    "phone" text,
    "home_address" text,
    "birthdate" text,
    "image_url" text,
    "full_name" text,
    "short_name" text,
    "guide_id" uuid not null default gen_random_uuid(),
    "partner_roles" partner_roles[]
      );



  create table "public"."imported_emails" (
    "matched_emails" text,
    "user" text,
    "from" text,
    "to" text,
    "cc" text,
    "email_date" date,
    "subject" text,
    "body" text,
    "attachments" text,
    "gmail_msg_id" text,
    "logged_timestamp" text,
    "school_id" uuid,
    "person_id" uuid,
    "email_id" uuid not null default gen_random_uuid()
      );



  create table "public"."imported_meetings" (
    "matched_emails" text,
    "start_timestamp" text,
    "end_timestamp" text,
    "title" text,
    "description" text,
    "all_attendees" text,
    "user" text,
    "meeting_id" uuid not null default gen_random_uuid(),
    "person_ids" text[],
    "school_ids" text[]
      );



  create table "public"."lead_routing_and_templates" (
    "segment_name" text not null,
    "sendgrid_template_id" text,
    "language" text[],
    "type" text[],
    "us_international" text[],
    "geo_type" text,
    "state" text[],
    "source" text,
    "growth_lead" text,
    "sender" text
      );



  create table "public"."loans" (
    "Loan Key" text,
    "loan_id" text,
    "amount_issued" integer,
    "issue_date" date,
    "loan_status" loan_status_options,
    "loan_docs" text,
    "notes" text,
    "maturity" date,
    "interest_rate" real,
    "use_of_proceeds" use_of_proceeds_options,
    "vehicle" loan_vehicle_options,
    "school_id" uuid
      );



  create table "public"."locations" (
    "charter_id" uuid,
    "current_mail_address" boolean,
    "current_physical_address" boolean,
    "start_date" date,
    "end_date" date,
    "co_location_type" text,
    "co_location_partner" text,
    "location_type" location_types,
    "address" text,
    "street" text,
    "city" text,
    "state" text,
    "country" text,
    "zip" text,
    "neighborhood" text,
    "sq_ft" smallint,
    "max_students" smallint,
    "lat" double precision,
    "long" double precision,
    "created_datetime" text,
    "modified_datetime" text,
    "geocode_last_run_at" text,
    "census_tract" text,
    "qualified_low_income_tract" boolean,
    "lease" text,
    "lease_end_date" date,
    "location_id" uuid not null default gen_random_uuid(),
    "school_id" uuid
      );



  create table "public"."mailing_lists" (
    "sub_name" text not null,
    "name" text,
    "slug" text,
    "type" text,
    "google_group_id" text
      );



  create table "public"."membership_fee_annual_records" (
    "990" text,
    "school_year" text,
    "nth year" text,
    "school_history_status" text,
    "initial_exemption_status" exemption_statuses,
    "revenue" text,
    "initial_fee" bigint,
    "estimated_likelihood_of_payment" text,
    "weighted_projection" bigint,
    "entity_id" uuid,
    "charter_id" uuid,
    "membership_fee_annual_rec_id" uuid not null default gen_random_uuid()
      );


alter table "public"."membership_fee_annual_records" enable row level security;


  create table "public"."membership_fee_change_log" (
    "update_type" fee_change_types,
    "explanation" text,
    "attachment" text,
    "link" text,
    "revised_fee_amount" numeric,
    "payment_amount" numeric,
    "update_date" text,
    "revised_likelihood" text,
    "new_exemption_status" exemption_statuses,
    "entity_id" uuid,
    "school_year" text,
    "mem_change_id" uuid not null default gen_random_uuid()
      );



  create table "public"."membership_termination_process_steps" (
    "step_name" text not null,
    "day_of_process" smallint,
    "responsible_person" text,
    "field_with_target_date" text
      );



  create table "public"."montessori_certs" (
    "year" text,
    "training_center" text,
    "trainer" text,
    "association" montessori_associations,
    "macte_accredited" boolean,
    "cert_completion_status" certification_completion_status,
    "created_date" date,
    "cert_level" age_spans[],
    "admin_credential" boolean,
    "assistant_training" boolean,
    "person_id" uuid,
    "id" uuid not null default gen_random_uuid()
      );



  create table "public"."nine_nineties" (
    "990_year" text,
    "link" text,
    "notes" text,
    "ai_derived_revenue" text,
    "ai_derived_EOY" text,
    "id" uuid not null default gen_random_uuid(),
    "school_id" uuid,
    "charter_id" uuid,
    "pdf" text
      );



  create table "public"."people" (
    "full_name" text,
    "first_name" text,
    "middle_name" text,
    "last_name" text,
    "nickname" text,
    "primary_phone" text,
    "secondary_phone" text,
    "google_groups" text,
    "home_address" text,
    "source_other" text,
    "tc_userid" text,
    "educ_attainment" educ_attainment_options,
    "primary_language" languages,
    "other_languages" languages[],
    "race_ethnicity_other" text,
    "hh_income" income_categories,
    "childhood_income" income_categories,
    "gender" gender_categories,
    "gender_other" text,
    "lgbtqia" boolean,
    "pronouns" pronouns,
    "pronouns_other" text,
    "last_modified" timestamp with time zone,
    "created" timestamp with time zone,
    "indiv_type" text,
    "created_by" text,
    "tags" text,
    "exclude_from_email_logging" boolean,
    "person_id" uuid not null,
    "race_ethnicity" race_ethnicity_categories[],
    "source" text[]
      );



  create table "public"."people_educator_details" (
    "old_id" text not null,
    "discovery_status" discovery_statuses,
    "assigned_partner" text,
    "montessori_lead_guide_trainings" text,
    "educator_notes_1" text,
    "training_grants" text,
    "survey_gathering_2022" text,
    "on_school_board" text,
    "first_contact_willingness_to_relocate" text,
    "first_contact_governance_model" text,
    "first_contact_notes_on_pre_wf_employment" text,
    "first_contact_form_notes" text,
    "first_contact_wf_employment_status" text,
    "first_contact_ages" text,
    "first_contact_interests" text,
    "target_city" text,
    "target_state" text,
    "target_geo_combined" text,
    "target_intl" text,
    "self_reflection_doc" text,
    "opsguide_meeting_prefs" text,
    "opsguide_checklist" text,
    "opsguide_request_pertinent_info" text,
    "opsguide_support_type_needed" text,
    "opsguide_fundraising_opps" text,
    "ped_id" uuid not null,
    "notes" text
      );



  create table "public"."people_roles_join" (
    "email_at_school" text,
    "loan_fund" boolean,
    "on_connected" boolean,
    "on_slack" active_inactive,
    "in_tl_google_grp" active_inactive,
    "in_wf_directory" active_inactive,
    "email_status" active_inactive,
    "who_initiated_tl_removal" text,
    "on_natl_website" active_inactive,
    "gsuite_roles" gsuite_roles_options,
    "currently_active" boolean,
    "school_id" uuid,
    "person_id" uuid,
    "prj_id" uuid not null,
    "created_date" date,
    "start_date" date,
    "end_date" date,
    "role" text,
    "founding_tl_role" boolean,
    "charter_id" uuid
      );



  create table "public"."planes" (
    "plane" text not null,
    "credentials" text[],
    "synonyms" text[],
    "age_ranges" "ages-grades"[]
      );



  create table "public"."public_funding_sources" (
    "name" text not null,
    "description" text,
    "planes" developmental_planes[]
      );



  create table "public"."race_and_ethnicity" (
    "category" text not null,
    "english" text,
    "spanish" text
      );



  create table "public"."roles" (
    "role" text not null,
    "role_type" text
      );



  create table "public"."school_notes" (
    "notes" text,
    "created_date" text,
    "created_by" text,
    "private" boolean,
    "sch_notes_id" uuid not null default gen_random_uuid(),
    "school_id" uuid
      );



  create table "public"."school_reports_and_submissions" (
    "id" text,
    "charter_id" uuid,
    "report_type" text,
    "attachments" text,
    "school_year" text
      );



  create table "public"."school_ssj_data" (
    "school_id" uuid not null,
    "cohorts" text[],
    "ssj_target_city" text,
    "ssj_target_state" state_abbreviation_enum,
    "ssj_projected_open" date,
    "ssj_original_projected_open_date" date,
    "entered_visioning_date" date,
    "entered_planning_date" date,
    "entered_startup_date" date,
    "ssj_stage" ssj_stages,
    "ssj_readiness_to_open_rating" high_med_low,
    "ssj_name_reserved" boolean,
    "ssj_has_partner" ssj_has_partner_enum,
    "ssj_board_development" ssj_board_dev_status,
    "ssj_facility" ssj_facility_enum,
    "ssj_cohort_status" ssj_cohort_status_enum,
    "ssj_on_track_for_enrollment" school_ssj_data_ssj_on_track_for_enrollment_enum,
    "ssj_budget_ready_for_next_steps" ssj_budget_ready_for_next_steps_enum,
    "ssj_seeking_wf_funding" ssj_seeking_wf_funding_enum,
    "ssj_advice_givers_tls" text,
    "ssj_advice_givers_partners" text,
    "ssj_fundraising_narrative" text,
    "ssj_pathway_to_funding" ssj_pathway_to_funding_enum,
    "ssj_total_startup_funding_needed" text,
    "ssj_loan_eligibility" text,
    "ssj_loan_approved_amt" text,
    "ssj_amount_raised" text,
    "ssj_gap_in_funding" text,
    "ssj_proj_open_school_year_backup" smallint,
    "ssj_date_shared_with_n4g" date,
    "ssj_proj_open_school_year" smallint,
    "ssj_tool" ssj_tool_enum,
    "ssj_building4good_status" ssj_building4good_status_enum,
    "building4good_firm_and_attorney" text,
    "visioning_album_complete" text,
    "visioning_album" text,
    "logo_designer" logo_designer_options,
    "name_selection_proposal" text,
    "trademark_filed" boolean,
    "ssj_ops_guide_support_track" ops_guide_support_track_options
      );



  create table "public"."school_years" (
    "school_year" text not null,
    "start_date" date,
    "end_date" date,
    "new_school_fee" numeric,
    "ongoing_school_fee" numeric
      );



  create table "public"."schools" (
    "long_name" text,
    "old_id" text not null,
    "short_name" text,
    "status" school_statuses,
    "governance_model" governance_models,
    "prior_names" text,
    "narrative" text,
    "primary_contact_id" text,
    "institutional_partner" text,
    "ages_served" age_spans[],
    "logo_url" text,
    "logo" text,
    "school_calendar" school_calendar_options,
    "left_network_reason" text,
    "signed_membership_agreement" text,
    "planning_album" text,
    "tc_school_id" text,
    "school_email" text,
    "email_domain" text,
    "school_phone" text,
    "facebook" text,
    "instagram" text,
    "website" text,
    "on_national_website" text,
    "domain_name" text,
    "nonprofit_status" text,
    "google_voice" text,
    "website_tool" text,
    "budget_utility" text,
    "transparent_classroom" text,
    "admissions_system" text,
    "tc_admissions" text,
    "tc_recordkeeping" text,
    "gusto" text,
    "qbo" text,
    "business_insurance" text,
    "bill_account" text,
    "number_of_classrooms" smallint,
    "created" date,
    "created_by" text,
    "last_modified" date,
    "last_modified_by" text,
    "pod" text,
    "family_survey_non_tc_data_2021_22" text,
    "enrollment_at_full_capacity" text,
    "google_workspace_org_unit_path" text,
    "family_surveys" text,
    "flexible_tuition_model" text,
    "ein" text,
    "agreement_version" text,
    "about" text,
    "about_spanish" text,
    "hero_image_url" text,
    "hero_image_2_url" text,
    "budget_link" text,
    "bookkeeper_or_accountant" text,
    "active_pod_member" text,
    "risk_factors" text,
    "watchlist" text,
    "program_focus" text,
    "loan_payments" text,
    "loan_report_name" text,
    "nine_nineties" text,
    "current_fy_end" text,
    "incorporation_date" text,
    "guidestar_listing_requested" text,
    "group_exemption_status" text,
    "date_received_group_exemption" date,
    "legal_name" text,
    "nondiscrimination_policy_on_application" text,
    "nondiscrimination_policy_on_website" text,
    "date_withdrawn_from_group_exemption" date,
    "qbo_school_codes" text,
    "membership_termination_steps" text,
    "membership_termination_letter" text,
    "automation_notes" text,
    "legal_structure" text,
    "open_date" date,
    "school_id" uuid not null default gen_random_uuid(),
    "left_network_date" date,
    "membership_agreement_signed_date" date,
    "charter_id" uuid,
    "school_sched" school_schedule_options[],
    "membership_status" membership_statuses,
    "public_funding" text[]
      );


alter table "public"."schools" enable row level security;


  create table "public"."sources" (
    "source" text not null
      );


alter table "public"."sources" enable row level security;


  create table "public"."ssj_fillout_forms" (
    "old_id" text,
    "form_type" ssj_form_type,
    "first_name" text,
    "last_name" text,
    "full_name" text,
    "email" text,
    "Link to Start a School" text,
    "race_ethnicity" text,
    "race_ethnicity_other" text,
    "lgbtqia" text,
    "pronouns" text,
    "pronouns_other" text,
    "gender" text,
    "gender_other" text,
    "current_income" text,
    "language_primary" text,
    "language_primary_other" text,
    "message" text,
    "charter_interest" text,
    "email_1" text,
    "contact_type" text,
    "mont_cert_question" text,
    "cert_processing_status" text,
    "currently_montessori_certified" text,
    "currently_seeking_mont_cert" text,
    "Temp - M Cert Cert 1" text,
    "Montessori Certification Certifier 1" text,
    "Temp - M Cert Year 1" text,
    "Montessori Certification Year 1" text,
    "Temp - M Cert Level 1" text,
    "Montessori Certification Level 1" text,
    "Temp - M Cert Cert 2" text,
    "Montessori Certification Certifier 2" text,
    "Temp - M Cert Year 2" text,
    "Montessori Certification Year 2" text,
    "Temp - M Cert Level 2" text,
    "Montessori Certification Level 2" text,
    "Temp - M Cert Cert 3" text,
    "Montessori Certification Certifier 3" text,
    "Temp - M Cert Year 3" text,
    "Montessori Certification Year 3" text,
    "Temp - M Cert Level 3" text,
    "Montessori Certification Level 3" text,
    "Temp - M Cert Cert 4" text,
    "Montessori Certification Certifier 4" text,
    "Temp - M Cert Year 4" text,
    "Montessori Certification Year 4" text,
    "Temp - M Cert Level 4" text,
    "Montessori Certification Level 4" text,
    "city" text,
    "city_standardized" text,
    "state" text,
    "state_abbrev" text,
    "country" text,
    "city2" text,
    "state2" text,
    "country2" text,
    "target_geo" text,
    "age_targets" text,
    "educator_interests" text,
    "educator_interests_other" text,
    "community_member_interest" text,
    "want_helping_sourcing_teachers" text,
    "community_desc" text,
    "community_member_self_description" text,
    "want_communications" text,
    "source_type" text,
    "source_other" text,
    "source_detail" text,
    "source_campaign" text,
    "created_date" timestamp with time zone,
    "sendgrid_template" text,
    "sendgrid_date_sent" text,
    "routed_to" text,
    "assigned_partner_override" text,
    "email_sent_by_initial_outreacher" text,
    "one_on_one_status" text,
    "initial_outreacher" text,
    "follow_upper" text,
    "ssj_form_id" uuid not null default gen_random_uuid(),
    "person_id" uuid
      );


CREATE UNIQUE INDEX "990s_pkey" ON public.nine_nineties USING btree (id);

CREATE UNIQUE INDEX action_steps_pkey ON public.action_steps USING btree (id);

CREATE UNIQUE INDEX annual_assessment_and_metrics_data_pkey ON public.annual_assessment_and_metrics_data USING btree (id);

CREATE UNIQUE INDEX annual_enrollment_and_demographics_pkey ON public.annual_enrollment_and_demographics USING btree (id);

CREATE UNIQUE INDEX boolean_pkey ON public."boolean" USING btree (category);

CREATE UNIQUE INDEX certifications_pkey ON public.certifications USING btree (credential_level);

CREATE UNIQUE INDEX charter_applications_pkey ON public.charter_applications USING btree (charter_app_id);

CREATE UNIQUE INDEX charter_authorizers_and_contacts_pkey ON public.charter_authorizers_and_contacts USING btree (charter_id, active);

CREATE UNIQUE INDEX charters_pkey ON public.charters USING btree (charter_id);

CREATE UNIQUE INDEX cohorts_pkey ON public.cohorts USING btree (name);

CREATE UNIQUE INDEX educator_notes_pkey ON public.educator_notes USING btree (educ_notes_id);

CREATE UNIQUE INDEX "educatorsXschools_pkey" ON public.people_roles_join USING btree (prj_id);

CREATE UNIQUE INDEX educators_duplicate_pkey ON public.people USING btree (person_id);

CREATE UNIQUE INDEX educators_pkey ON public.people_educator_details USING btree (ped_id);

CREATE UNIQUE INDEX email_addresses_email_address_key ON public.email_addresses USING btree (email_address);

CREATE UNIQUE INDEX email_addresses_pkey ON public.email_addresses USING btree (email_addr_id);

CREATE INDEX email_filter_addresses_email_norm_idx ON public.email_filter_addresses USING btree (normalize_email(email));

CREATE UNIQUE INDEX event_attendance_pkey ON public.event_attendance USING btree (event_attd_id);

CREATE UNIQUE INDEX event_list_pkey ON public.event_list USING btree (event_name);

CREATE UNIQUE INDEX event_types_pkey ON public.event_types USING btree (event_type);

CREATE UNIQUE INDEX gender_pkey ON public.gender USING btree (category);

CREATE UNIQUE INDEX governance_docs_pkey ON public.governance_docs USING btree (id);

CREATE UNIQUE INDEX grants_pkey ON public.grants USING btree (grant_id);

CREATE UNIQUE INDEX guide_assignments_pkey ON public.guide_assignments USING btree (guide_assign_id);

CREATE UNIQUE INDEX guides_pkey ON public.guides USING btree (guide_id);

CREATE UNIQUE INDEX guides_short_name_key ON public.guides USING btree (short_name);

CREATE UNIQUE INDEX imported_emails_pkey ON public.imported_emails USING btree (email_id);

CREATE UNIQUE INDEX imported_meetings_pkey ON public.imported_meetings USING btree (meeting_id);

CREATE UNIQUE INDEX lead_routing_and_templates_pkey ON public.lead_routing_and_templates USING btree (segment_name);

CREATE UNIQUE INDEX locations_pkey ON public.locations USING btree (location_id);

CREATE UNIQUE INDEX mailing_lists_pkey ON public.mailing_lists USING btree (sub_name);

CREATE UNIQUE INDEX membership_fee_annual_records_pkey ON public.membership_fee_annual_records USING btree (membership_fee_annual_rec_id);

CREATE UNIQUE INDEX membership_fee_change_log_pkey ON public.membership_fee_change_log USING btree (mem_change_id);

CREATE UNIQUE INDEX membership_termination_process_steps_pkey ON public.membership_termination_process_steps USING btree (step_name);

CREATE UNIQUE INDEX montessori_certs_pkey ON public.montessori_certs USING btree (id);

CREATE UNIQUE INDEX planes_pkey ON public.planes USING btree (plane);

CREATE UNIQUE INDEX public_funding_sources_pkey ON public.public_funding_sources USING btree (name);

CREATE UNIQUE INDEX race_and_ethnicity_pkey ON public.race_and_ethnicity USING btree (category);

CREATE UNIQUE INDEX roles_pkey ON public.roles USING btree (role);

CREATE UNIQUE INDEX "school notes_pkey" ON public.school_notes USING btree (sch_notes_id);

CREATE UNIQUE INDEX school_ssj_data_pkey ON public.school_ssj_data USING btree (school_id);

CREATE UNIQUE INDEX school_year_pkey ON public.school_years USING btree (school_year);

CREATE UNIQUE INDEX schools_pkey ON public.schools USING btree (school_id);

CREATE UNIQUE INDEX sources_pkey ON public.sources USING btree (source);

CREATE UNIQUE INDEX ssj_fillout_forms_pkey ON public.ssj_fillout_forms USING btree (ssj_form_id);

CREATE UNIQUE INDEX uq_annual_school_year_id ON public.membership_fee_annual_records USING btree (school_year, entity_id);

alter table "public"."action_steps" add constraint "action_steps_pkey" PRIMARY KEY using index "action_steps_pkey";

alter table "public"."annual_assessment_and_metrics_data" add constraint "annual_assessment_and_metrics_data_pkey" PRIMARY KEY using index "annual_assessment_and_metrics_data_pkey";

alter table "public"."annual_enrollment_and_demographics" add constraint "annual_enrollment_and_demographics_pkey" PRIMARY KEY using index "annual_enrollment_and_demographics_pkey";

alter table "public"."boolean" add constraint "boolean_pkey" PRIMARY KEY using index "boolean_pkey";

alter table "public"."certifications" add constraint "certifications_pkey" PRIMARY KEY using index "certifications_pkey";

alter table "public"."charter_applications" add constraint "charter_applications_pkey" PRIMARY KEY using index "charter_applications_pkey";

alter table "public"."charter_authorizers_and_contacts" add constraint "charter_authorizers_and_contacts_pkey" PRIMARY KEY using index "charter_authorizers_and_contacts_pkey";

alter table "public"."charters" add constraint "charters_pkey" PRIMARY KEY using index "charters_pkey";

alter table "public"."cohorts" add constraint "cohorts_pkey" PRIMARY KEY using index "cohorts_pkey";

alter table "public"."educator_notes" add constraint "educator_notes_pkey" PRIMARY KEY using index "educator_notes_pkey";

alter table "public"."email_addresses" add constraint "email_addresses_pkey" PRIMARY KEY using index "email_addresses_pkey";

alter table "public"."event_attendance" add constraint "event_attendance_pkey" PRIMARY KEY using index "event_attendance_pkey";

alter table "public"."event_list" add constraint "event_list_pkey" PRIMARY KEY using index "event_list_pkey";

alter table "public"."event_types" add constraint "event_types_pkey" PRIMARY KEY using index "event_types_pkey";

alter table "public"."gender" add constraint "gender_pkey" PRIMARY KEY using index "gender_pkey";

alter table "public"."governance_docs" add constraint "governance_docs_pkey" PRIMARY KEY using index "governance_docs_pkey";

alter table "public"."grants" add constraint "grants_pkey" PRIMARY KEY using index "grants_pkey";

alter table "public"."guide_assignments" add constraint "guide_assignments_pkey" PRIMARY KEY using index "guide_assignments_pkey";

alter table "public"."guides" add constraint "guides_pkey" PRIMARY KEY using index "guides_pkey";

alter table "public"."imported_emails" add constraint "imported_emails_pkey" PRIMARY KEY using index "imported_emails_pkey";

alter table "public"."imported_meetings" add constraint "imported_meetings_pkey" PRIMARY KEY using index "imported_meetings_pkey";

alter table "public"."lead_routing_and_templates" add constraint "lead_routing_and_templates_pkey" PRIMARY KEY using index "lead_routing_and_templates_pkey";

alter table "public"."locations" add constraint "locations_pkey" PRIMARY KEY using index "locations_pkey";

alter table "public"."mailing_lists" add constraint "mailing_lists_pkey" PRIMARY KEY using index "mailing_lists_pkey";

alter table "public"."membership_fee_annual_records" add constraint "membership_fee_annual_records_pkey" PRIMARY KEY using index "membership_fee_annual_records_pkey";

alter table "public"."membership_fee_change_log" add constraint "membership_fee_change_log_pkey" PRIMARY KEY using index "membership_fee_change_log_pkey";

alter table "public"."membership_termination_process_steps" add constraint "membership_termination_process_steps_pkey" PRIMARY KEY using index "membership_termination_process_steps_pkey";

alter table "public"."montessori_certs" add constraint "montessori_certs_pkey" PRIMARY KEY using index "montessori_certs_pkey";

alter table "public"."nine_nineties" add constraint "990s_pkey" PRIMARY KEY using index "990s_pkey";

alter table "public"."people" add constraint "educators_duplicate_pkey" PRIMARY KEY using index "educators_duplicate_pkey";

alter table "public"."people_educator_details" add constraint "educators_pkey" PRIMARY KEY using index "educators_pkey";

alter table "public"."people_roles_join" add constraint "educatorsXschools_pkey" PRIMARY KEY using index "educatorsXschools_pkey";

alter table "public"."planes" add constraint "planes_pkey" PRIMARY KEY using index "planes_pkey";

alter table "public"."public_funding_sources" add constraint "public_funding_sources_pkey" PRIMARY KEY using index "public_funding_sources_pkey";

alter table "public"."race_and_ethnicity" add constraint "race_and_ethnicity_pkey" PRIMARY KEY using index "race_and_ethnicity_pkey";

alter table "public"."roles" add constraint "roles_pkey" PRIMARY KEY using index "roles_pkey";

alter table "public"."school_notes" add constraint "school notes_pkey" PRIMARY KEY using index "school notes_pkey";

alter table "public"."school_ssj_data" add constraint "school_ssj_data_pkey" PRIMARY KEY using index "school_ssj_data_pkey";

alter table "public"."school_years" add constraint "school_year_pkey" PRIMARY KEY using index "school_year_pkey";

alter table "public"."schools" add constraint "schools_pkey" PRIMARY KEY using index "schools_pkey";

alter table "public"."sources" add constraint "sources_pkey" PRIMARY KEY using index "sources_pkey";

alter table "public"."ssj_fillout_forms" add constraint "ssj_fillout_forms_pkey" PRIMARY KEY using index "ssj_fillout_forms_pkey";

alter table "public"."annual_assessment_and_metrics_data" add constraint "annual_assessment_and_metrics_data_charter_id_fkey" FOREIGN KEY (charter_id) REFERENCES charters(charter_id) not valid;

alter table "public"."annual_assessment_and_metrics_data" validate constraint "annual_assessment_and_metrics_data_charter_id_fkey";

alter table "public"."annual_assessment_and_metrics_data" add constraint "annual_assessment_and_metrics_data_school_id_fkey" FOREIGN KEY (school_id) REFERENCES schools(school_id) not valid;

alter table "public"."annual_assessment_and_metrics_data" validate constraint "annual_assessment_and_metrics_data_school_id_fkey";

alter table "public"."annual_assessment_and_metrics_data" add constraint "annual_assessment_and_metrics_data_school_year_fkey" FOREIGN KEY (school_year) REFERENCES school_years(school_year) not valid;

alter table "public"."annual_assessment_and_metrics_data" validate constraint "annual_assessment_and_metrics_data_school_year_fkey";

alter table "public"."annual_enrollment_and_demographics" add constraint "annual_enrollment_and_demographics_charter_id_fkey" FOREIGN KEY (charter_id) REFERENCES charters(charter_id) not valid;

alter table "public"."annual_enrollment_and_demographics" validate constraint "annual_enrollment_and_demographics_charter_id_fkey";

alter table "public"."annual_enrollment_and_demographics" add constraint "annual_enrollment_and_demographics_school_id_fkey" FOREIGN KEY (school_id) REFERENCES schools(school_id) not valid;

alter table "public"."annual_enrollment_and_demographics" validate constraint "annual_enrollment_and_demographics_school_id_fkey";

alter table "public"."annual_enrollment_and_demographics" add constraint "annual_enrollment_and_demographics_school_year_fkey" FOREIGN KEY (school_year) REFERENCES school_years(school_year) not valid;

alter table "public"."annual_enrollment_and_demographics" validate constraint "annual_enrollment_and_demographics_school_year_fkey";

alter table "public"."charter_applications" add constraint "charter_applications_charter_fkey" FOREIGN KEY (charter) REFERENCES charters(charter_id) not valid;

alter table "public"."charter_applications" validate constraint "charter_applications_charter_fkey";

alter table "public"."charters" add constraint "ein_format_check" CHECK (((ein IS NULL) OR (ein ~ '^\d{2}-\d{7}$'::text))) not valid;

alter table "public"."charters" validate constraint "ein_format_check";

alter table "public"."educator_notes" add constraint "educator_notes_person_id_fkey" FOREIGN KEY (person_id) REFERENCES people(person_id) not valid;

alter table "public"."educator_notes" validate constraint "educator_notes_person_id_fkey";

alter table "public"."email_addresses" add constraint "email_addresses_email_address_key" UNIQUE using index "email_addresses_email_address_key";

alter table "public"."email_addresses" add constraint "email_addresses_person_id_fkey" FOREIGN KEY (person_id) REFERENCES people(person_id) not valid;

alter table "public"."email_addresses" validate constraint "email_addresses_person_id_fkey";

alter table "public"."event_attendance" add constraint "event_attendance_event_fkey" FOREIGN KEY (event) REFERENCES event_list(event_name) not valid;

alter table "public"."event_attendance" validate constraint "event_attendance_event_fkey";

alter table "public"."event_attendance" add constraint "event_attendance_person_id_fkey" FOREIGN KEY (person_id) REFERENCES people(person_id) not valid;

alter table "public"."event_attendance" validate constraint "event_attendance_person_id_fkey";

alter table "public"."event_list" add constraint "event_list_type_fkey" FOREIGN KEY (type) REFERENCES event_types(event_type) not valid;

alter table "public"."event_list" validate constraint "event_list_type_fkey";

alter table "public"."governance_docs" add constraint "governance_docs_charter_id_fkey" FOREIGN KEY (charter_id) REFERENCES charters(charter_id) not valid;

alter table "public"."governance_docs" validate constraint "governance_docs_charter_id_fkey";

alter table "public"."governance_docs" add constraint "governance_docs_school_id_fkey" FOREIGN KEY (school_id) REFERENCES schools(school_id) not valid;

alter table "public"."governance_docs" validate constraint "governance_docs_school_id_fkey";

alter table "public"."guide_assignments" add constraint "fk_guide_assignments_guide" FOREIGN KEY (guide_id) REFERENCES guides(guide_id) ON DELETE SET NULL not valid;

alter table "public"."guide_assignments" validate constraint "fk_guide_assignments_guide";

alter table "public"."guide_assignments" add constraint "guide_assignments_school_id_fkey" FOREIGN KEY (school_id) REFERENCES schools(school_id) not valid;

alter table "public"."guide_assignments" validate constraint "guide_assignments_school_id_fkey";

alter table "public"."guides" add constraint "guides_short_name_key" UNIQUE using index "guides_short_name_key";

alter table "public"."imported_emails" add constraint "imported_emails_person_id_fkey" FOREIGN KEY (person_id) REFERENCES people(person_id) not valid;

alter table "public"."imported_emails" validate constraint "imported_emails_person_id_fkey";

alter table "public"."imported_emails" add constraint "imported_emails_school_id_fkey" FOREIGN KEY (school_id) REFERENCES schools(school_id) not valid;

alter table "public"."imported_emails" validate constraint "imported_emails_school_id_fkey";

alter table "public"."loans" add constraint "loans_school_id_fkey" FOREIGN KEY (school_id) REFERENCES schools(school_id) not valid;

alter table "public"."loans" validate constraint "loans_school_id_fkey";

alter table "public"."locations" add constraint "locations_charter_id_fkey" FOREIGN KEY (charter_id) REFERENCES charters(charter_id) not valid;

alter table "public"."locations" validate constraint "locations_charter_id_fkey";

alter table "public"."membership_fee_annual_records" add constraint "membership_fee_annual_records_school_year_fkey" FOREIGN KEY (school_year) REFERENCES school_years(school_year) not valid;

alter table "public"."membership_fee_annual_records" validate constraint "membership_fee_annual_records_school_year_fkey";

alter table "public"."membership_fee_annual_records" add constraint "uq_annual_school_year_id" UNIQUE using index "uq_annual_school_year_id";

alter table "public"."membership_fee_change_log" add constraint "membership_fee_change_log_school_year_fkey" FOREIGN KEY (school_year) REFERENCES school_years(school_year) not valid;

alter table "public"."membership_fee_change_log" validate constraint "membership_fee_change_log_school_year_fkey";

alter table "public"."montessori_certs" add constraint "montessori_certs_person_id_fkey" FOREIGN KEY (person_id) REFERENCES people(person_id) not valid;

alter table "public"."montessori_certs" validate constraint "montessori_certs_person_id_fkey";

alter table "public"."nine_nineties" add constraint "990s_charter_id_fkey" FOREIGN KEY (charter_id) REFERENCES charters(charter_id) not valid;

alter table "public"."nine_nineties" validate constraint "990s_charter_id_fkey";

alter table "public"."nine_nineties" add constraint "990s_school_id_fkey" FOREIGN KEY (school_id) REFERENCES schools(school_id) not valid;

alter table "public"."nine_nineties" validate constraint "990s_school_id_fkey";

alter table "public"."people_educator_details" add constraint "people_educator_details_ped_id_fkey" FOREIGN KEY (ped_id) REFERENCES people(person_id) not valid;

alter table "public"."people_educator_details" validate constraint "people_educator_details_ped_id_fkey";

alter table "public"."people_roles_join" add constraint "educatorsXschools_school_id_fkey" FOREIGN KEY (school_id) REFERENCES schools(school_id) not valid;

alter table "public"."people_roles_join" validate constraint "educatorsXschools_school_id_fkey";

alter table "public"."people_roles_join" add constraint "people_roles_join_charter_id_fkey" FOREIGN KEY (charter_id) REFERENCES charters(charter_id) not valid;

alter table "public"."people_roles_join" validate constraint "people_roles_join_charter_id_fkey";

alter table "public"."people_roles_join" add constraint "people_schools_join_person_id_fkey" FOREIGN KEY (person_id) REFERENCES people(person_id) not valid;

alter table "public"."people_roles_join" validate constraint "people_schools_join_person_id_fkey";

alter table "public"."people_roles_join" add constraint "people_schools_join_role_fkey" FOREIGN KEY (role) REFERENCES roles(role) not valid;

alter table "public"."people_roles_join" validate constraint "people_schools_join_role_fkey";

alter table "public"."school_notes" add constraint "school_notes_school_id_fkey" FOREIGN KEY (school_id) REFERENCES schools(school_id) not valid;

alter table "public"."school_notes" validate constraint "school_notes_school_id_fkey";

alter table "public"."school_reports_and_submissions" add constraint "school_reports_and_submissions_charter_id_fkey" FOREIGN KEY (charter_id) REFERENCES charters(charter_id) not valid;

alter table "public"."school_reports_and_submissions" validate constraint "school_reports_and_submissions_charter_id_fkey";

alter table "public"."school_reports_and_submissions" add constraint "school_reports_and_submissions_school_year_fkey" FOREIGN KEY (school_year) REFERENCES school_years(school_year) not valid;

alter table "public"."school_reports_and_submissions" validate constraint "school_reports_and_submissions_school_year_fkey";

alter table "public"."school_ssj_data" add constraint "school_ssj_data_school_id_fkey" FOREIGN KEY (school_id) REFERENCES schools(school_id) ON DELETE CASCADE not valid;

alter table "public"."school_ssj_data" validate constraint "school_ssj_data_school_id_fkey";

alter table "public"."schools" add constraint "schools_charter_id_fkey" FOREIGN KEY (charter_id) REFERENCES charters(charter_id) not valid;

alter table "public"."schools" validate constraint "schools_charter_id_fkey";

alter table "public"."ssj_fillout_forms" add constraint "ssj_fillout_forms_person_id_fkey" FOREIGN KEY (person_id) REFERENCES people(person_id) not valid;

alter table "public"."ssj_fillout_forms" validate constraint "ssj_fillout_forms_person_id_fkey";

set check_function_bodies = off;

create or replace view "public"."all_active_roles" as  SELECT p.full_name,
    prj.role,
    prj.currently_active,
    prj.school_id,
    prj.prj_id
   FROM (people p
     JOIN people_roles_join prj ON ((p.person_id = prj.person_id)))
  WHERE (prj.currently_active = true)
UNION ALL
 SELECT g.full_name,
    (ga.type)::text AS role,
    ga.active AS currently_active,
    ga.school_id,
    ga.guide_assign_id AS prj_id
   FROM (guide_assignments ga
     JOIN guides g ON ((ga.guide_id = g.guide_id)))
  WHERE (ga.active = true);


create or replace view "public"."all_active_roles_new" as  SELECT p.full_name,
    prj.role,
    prj.currently_active,
    prj.school_id,
    prj.prj_id
   FROM (people p
     JOIN people_roles_join prj ON ((p.person_id = prj.person_id)))
  WHERE (prj.currently_active = true)
UNION ALL
 SELECT g.full_name,
    (ga.type)::text AS role,
    ga.active AS currently_active,
    ga.school_id,
    ga.guide_assign_id AS prj_id
   FROM (guide_assignments ga
     JOIN guides g ON ((ga.guide_id = g.guide_id)))
  WHERE (ga.active = true);


CREATE OR REPLACE FUNCTION public.check_public_funding_valid()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
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
$function$
;

create or replace view "public"."entities" as  SELECT schools.long_name,
    schools.short_name,
    (schools.status)::text AS status,
    (schools.governance_model)::text AS governance_model,
    schools.logo,
    schools.ein,
    schools.group_exemption_status,
    schools.open_date,
    schools.school_id AS entity_id,
    schools.left_network_date,
    schools.membership_status,
    schools.public_funding
   FROM schools
UNION ALL
 SELECT charters.full_name AS long_name,
    charters.short_name,
    charters.status,
    'Charter'::text AS governance_model,
    NULL::text AS logo,
    charters.ein,
    (charters.group_exemption_status)::text AS group_exemption_status,
    charters.first_site_opened_date AS open_date,
    charters.charter_id AS entity_id,
    NULL::date AS left_network_date,
    'Member'::membership_statuses AS membership_status,
    NULL::text[] AS public_funding
   FROM charters;


create or replace view "public"."founding_tls" as  SELECT DISTINCT prj.person_id,
    prj.school_id,
    p.full_name,
    prj.role,
    prj.founding_tl_role
   FROM (people_roles_join prj
     LEFT JOIN people p ON ((p.person_id = prj.person_id)))
  WHERE ((prj.founding_tl_role = true) AND ((prj.role = 'Teacher Leader'::text) OR (prj.role = 'Emerging Teacher Leader'::text)));


create or replace view "public"."guide_assignments_plus" as  SELECT ga.type,
    ga.start_date,
    ga.end_date,
    g.email,
    g.currently_active,
    g.full_name,
    g.short_name AS screen_name,
    ga.school_id,
    ga.guide_id,
    ga.guide_assign_id,
    s.short_name,
    s.long_name
   FROM ((guide_assignments ga
     JOIN guides g ON ((ga.guide_id = g.guide_id)))
     LEFT JOIN schools s ON ((ga.school_id = s.school_id)));


create or replace view "public"."membership_fee_updated_view" as  SELECT a.school_year,
    a."nth year",
    a.school_history_status,
    a.initial_exemption_status,
    a."990",
    a.revenue,
    a.initial_fee,
    a.estimated_likelihood_of_payment,
    a.weighted_projection,
    a.entity_id,
    a.membership_fee_annual_rec_id,
    e.short_name,
    e.long_name,
    COALESCE(pay.total_payments, (0)::numeric) AS total_payments,
    COALESCE(ex.latest_exemption_status, a.initial_exemption_status) AS latest_exemption_status,
    COALESCE(fe.latest_revised_fee_amount, (a.initial_fee)::numeric) AS latest_revised_fee_amount,
    COALESCE(li.latest_revised_likelihood, a.estimated_likelihood_of_payment) AS latest_revised_likelihood,
        CASE COALESCE(li.latest_revised_likelihood, a.estimated_likelihood_of_payment)
            WHEN '0%'::text THEN (0)::numeric
            WHEN '25%'::text THEN 0.25
            WHEN '50%'::text THEN 0.5
            WHEN '75%'::text THEN 0.75
            WHEN '100%'::text THEN (1)::numeric
            ELSE NULL::numeric
        END AS latest_revised_likelihood_numeric,
        CASE
            WHEN (COALESCE(ex.latest_exemption_status, a.initial_exemption_status) = 'Exempt'::exemption_statuses) THEN (0)::numeric
            ELSE (COALESCE(fe.latest_revised_fee_amount, (a.initial_fee)::numeric) *
            CASE COALESCE(li.latest_revised_likelihood, a.estimated_likelihood_of_payment)
                WHEN '0%'::text THEN (0)::numeric
                WHEN '25%'::text THEN 0.25
                WHEN '50%'::text THEN 0.5
                WHEN '75%'::text THEN 0.75
                WHEN '100%'::text THEN (1)::numeric
                ELSE NULL::numeric
            END)
        END AS latest_weighted_projection,
    (
        CASE
            WHEN (COALESCE(ex.latest_exemption_status, a.initial_exemption_status) = 'Exempt'::exemption_statuses) THEN (0)::numeric
            ELSE (COALESCE(fe.latest_revised_fee_amount, (a.initial_fee)::numeric) *
            CASE COALESCE(li.latest_revised_likelihood, a.estimated_likelihood_of_payment)
                WHEN '0%'::text THEN (0)::numeric
                WHEN '25%'::text THEN 0.25
                WHEN '50%'::text THEN 0.5
                WHEN '75%'::text THEN 0.75
                WHEN '100%'::text THEN (1)::numeric
                ELSE NULL::numeric
            END)
        END - COALESCE(pay.total_payments, (0)::numeric)) AS left_to_pay
   FROM (((((membership_fee_annual_records a
     LEFT JOIN LATERAL ( SELECT sum(c.payment_amount) AS total_payments
           FROM membership_fee_change_log c
          WHERE ((c.school_year = a.school_year) AND (c.entity_id = a.entity_id))) pay ON (true))
     LEFT JOIN LATERAL ( SELECT c.new_exemption_status
           FROM membership_fee_change_log c
          WHERE ((c.school_year = a.school_year) AND (c.entity_id = a.entity_id) AND (c.new_exemption_status IS NOT NULL))
          ORDER BY c.update_date DESC
         LIMIT 1) ex(latest_exemption_status) ON (true))
     LEFT JOIN LATERAL ( SELECT c.revised_fee_amount
           FROM membership_fee_change_log c
          WHERE ((c.school_year = a.school_year) AND (c.entity_id = a.entity_id) AND (c.revised_fee_amount IS NOT NULL))
          ORDER BY c.update_date DESC
         LIMIT 1) fe(latest_revised_fee_amount) ON (true))
     LEFT JOIN LATERAL ( SELECT c.revised_likelihood
           FROM membership_fee_change_log c
          WHERE ((c.school_year = a.school_year) AND (c.entity_id = a.entity_id) AND (c.revised_likelihood IS NOT NULL))
          ORDER BY c.update_date DESC
         LIMIT 1) li(latest_revised_likelihood) ON (true))
     LEFT JOIN entities e ON ((e.entity_id = a.entity_id)))
  ORDER BY e.short_name;


create or replace view "public"."mont_certs_complete_summary" as  SELECT p.full_name,
    p.person_id,
    string_agg(((((((COALESCE((m.association)::text, ''::text) || ' '::text) || COALESCE(array_to_string(COALESCE(m.cert_level, ARRAY[]::age_spans[]), ', '::text), ''::text)) || ' '::text) || '('::text) || COALESCE(m.year, '?'::text)) || ')'::text), ', '::text ORDER BY m.year) AS cert_summary
   FROM (montessori_certs m
     JOIN people p ON ((p.person_id = m.person_id)))
  WHERE (m.cert_completion_status = 'Certified'::certification_completion_status)
  GROUP BY p.full_name, p.person_id;


create or replace view "public"."mont_certs_in_process_summary" as  SELECT p.full_name,
    p.person_id,
    string_agg(((((COALESCE(array_to_string(COALESCE(m.cert_level, ARRAY[]::age_spans[]), ', '::text), ''::text) || '-'::text) || COALESCE((m.association)::text, ''::text)) || '-'::text) || COALESCE(m.year, ''::text)), ','::text ORDER BY m.year) AS cert_summary
   FROM (montessori_certs m
     JOIN people p ON ((p.person_id = m.person_id)))
  WHERE (m.cert_completion_status = 'Training'::certification_completion_status)
  GROUP BY p.full_name, p.person_id;


CREATE OR REPLACE FUNCTION public.normalize_email(raw text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE STRICT
AS $function$
  select case
           when raw is null then null
           -- extract foo@bar.com if "Name <foo@bar.com>"
           when raw ~ '<[^>]+>' then lower(trim(both ' ' from regexp_replace(raw, '.*<([^>]+)>.*', '\1')))
           else lower(trim(both ' ' from raw))
         end
$function$
;

create or replace view "public"."people_join_roles_plus" as  SELECT prj.role,
    prj.school_id,
    prj.charter_id,
    prj.start_date,
    prj.end_date,
    prj.currently_active,
    p.full_name,
    p.first_name,
    p.middle_name,
    p.last_name,
    p.nickname,
    p.primary_phone,
    p.secondary_phone,
    p.google_groups,
    p.home_address,
    p.source_other,
    p.tc_userid,
    p.educ_attainment,
    p.primary_language,
    p.other_languages,
    p.race_ethnicity_other,
    p.hh_income,
    p.childhood_income,
    p.gender,
    p.gender_other,
    p.lgbtqia,
    p.pronouns,
    p.pronouns_other,
    p.last_modified,
    p.created,
    p.indiv_type,
    p.created_by,
    p.tags,
    p.exclude_from_email_logging,
    p.person_id,
    p.race_ethnicity,
    p.source,
    s.short_name,
    c.short_name AS charter_short_name
   FROM (((people_roles_join prj
     LEFT JOIN people p ON ((prj.person_id = p.person_id)))
     LEFT JOIN schools s ON ((prj.school_id = s.school_id)))
     LEFT JOIN charters c ON ((prj.charter_id = c.charter_id)));


create or replace view "public"."preview_people_duplicates" as  WITH grouped AS (
         SELECT people.full_name,
            array_agg(people.person_id ORDER BY people.person_id) AS ids
           FROM people
          GROUP BY people.full_name
         HAVING (count(*) > 1)
        )
 SELECT grouped.full_name,
    grouped.ids[1] AS canonical_id,
    grouped.ids[2:array_length(grouped.ids, 1)] AS duplicate_ids
   FROM grouped;


create or replace view "public"."primary_emails" as  WITH email_candidates AS (
         SELECT prj.person_id,
            prj.email_at_school AS email_address,
            'school'::text AS source,
            'school'::email_address_categories AS category,
            1 AS priority
           FROM people_roles_join prj
          WHERE (prj.email_at_school IS NOT NULL)
        UNION ALL
         SELECT ea.person_id,
            ea.email_address,
            'primary'::text AS source,
            ea.category,
                CASE
                    WHEN (ea.category = 'personal'::email_address_categories) THEN 2
                    ELSE 3
                END AS priority
           FROM email_addresses ea
          WHERE (ea."primary" = true)
        UNION ALL
         SELECT ea.person_id,
            ea.email_address,
            'fallback'::text AS source,
            ea.category,
                CASE
                    WHEN (ea.category = 'personal'::email_address_categories) THEN 4
                    ELSE 5
                END AS priority
           FROM email_addresses ea
          WHERE (ea.email_address IS NOT NULL)
        ), ranked_emails AS (
         SELECT email_candidates.person_id,
            email_candidates.email_address,
            email_candidates.source,
            email_candidates.category,
            email_candidates.priority,
            row_number() OVER (PARTITION BY email_candidates.person_id ORDER BY email_candidates.priority) AS rn
           FROM email_candidates
        )
 SELECT ranked_emails.person_id,
    ranked_emails.email_address,
    ranked_emails.category
   FROM ranked_emails
  WHERE (ranked_emails.rn = 1);


create or replace view "public"."select_teacher" as  SELECT DISTINCT p.person_id,
    p.full_name AS educator_name,
    p.race_ethnicity,
    prj.role,
    s.short_name AS school_name
   FROM ((people p
     LEFT JOIN people_roles_join prj ON ((prj.person_id = p.person_id)))
     LEFT JOIN schools s ON ((prj.school_id = s.school_id)))
  WHERE ((prj.currently_active = true) AND (prj.role = ANY (ARRAY['Teacher Leader'::text, 'Emerging Teacher Leader'::text])));


create or replace view "public"."active_tls" as  SELECT p.person_id,
    p.full_name,
    pm.email_address,
    prj.prj_id,
    prj.role,
    prj.currently_active,
    p.race_ethnicity
   FROM ((people_roles_join prj
     LEFT JOIN people p ON ((p.person_id = prj.person_id)))
     LEFT JOIN primary_emails pm ON ((p.person_id = pm.person_id)))
  WHERE ((prj.currently_active = true) AND ((prj.role = 'Teacher Leader'::text) OR (prj.role = 'Emerging Teacher Leader'::text)));


create or replace view "public"."email_filter_addresses_filtered" as  SELECT email_filter_addresses.email,
    email_filter_addresses.last_synced_at,
    email_filter_addresses.educator_id
   FROM email_filter_addresses
  WHERE (NOT ((normalize_email(email_filter_addresses.email) ~~ '%@wildflowerschools.org'::text) OR (normalize_email(email_filter_addresses.email) ~~ '%@blackwildflowerschools.org'::text)));


create or replace view "public"."people_plus" as  SELECT p.person_id,
    p.full_name,
    p.first_name,
    p.middle_name,
    p.last_name,
    p.nickname,
    p.primary_phone,
    p.secondary_phone,
    p.google_groups,
    p.home_address,
    p.source_other,
    p.tc_userid,
    p.educ_attainment,
    p.primary_language,
    p.other_languages,
    p.race_ethnicity,
    p.race_ethnicity_other,
    p.hh_income,
    p.childhood_income,
    p.gender,
    p.gender_other,
    p.lgbtqia,
    p.pronouns,
    p.pronouns_other,
    p.last_modified,
    p.created,
    p.indiv_type,
    p.created_by,
    p.tags,
    p.exclude_from_email_logging,
    p.source,
    ped.ped_id,
    ped.discovery_status,
    string_agg(prj.role, ', '::text) AS active_roles,
    string_agg(s.short_name, ', '::text) AS active_schools,
    pe.email_address
   FROM ((((people p
     LEFT JOIN people_educator_details ped ON ((p.person_id = ped.ped_id)))
     LEFT JOIN people_roles_join prj ON ((prj.person_id = p.person_id)))
     LEFT JOIN schools s ON ((prj.school_id = s.school_id)))
     LEFT JOIN primary_emails pe ON ((p.person_id = pe.person_id)))
  WHERE prj.currently_active
  GROUP BY p.person_id, ped.ped_id, pe.email_address;


create or replace view "public"."people_plus_all" as  SELECT p.person_id,
    p.full_name,
    p.first_name,
    p.middle_name,
    p.last_name,
    p.nickname,
    p.primary_phone,
    p.secondary_phone,
    p.google_groups,
    p.home_address,
    p.source_other,
    p.tc_userid,
    p.educ_attainment,
    p.primary_language,
    p.other_languages,
    p.race_ethnicity,
    p.race_ethnicity_other,
    p.hh_income,
    p.childhood_income,
    p.gender,
    p.gender_other,
    p.lgbtqia,
    p.pronouns,
    p.pronouns_other,
    p.last_modified,
    p.created,
    p.indiv_type,
    p.created_by,
    p.tags,
    p.exclude_from_email_logging,
    p.source,
    ped.ped_id,
    ped.discovery_status,
    string_agg(prj.role, ', '::text) AS active_roles,
    string_agg(s.short_name, ', '::text) AS active_schools,
    string_agg(DISTINCT pe.email_address, ', '::text) AS email
   FROM ((((people p
     LEFT JOIN people_educator_details ped ON ((p.person_id = ped.ped_id)))
     LEFT JOIN people_roles_join prj ON ((prj.person_id = p.person_id)))
     LEFT JOIN schools s ON ((prj.school_id = s.school_id)))
     LEFT JOIN primary_emails pe ON ((p.person_id = pe.person_id)))
  GROUP BY p.person_id, ped.ped_id;


create or replace view "public"."people_plus_f_no_roles_and_inactive_roles" as  SELECT p.person_id,
    p.full_name,
    p.first_name,
    p.middle_name,
    p.last_name,
    p.nickname,
    p.primary_phone,
    p.secondary_phone,
    p.google_groups,
    p.home_address,
    p.source_other,
    p.tc_userid,
    p.educ_attainment,
    p.primary_language,
    p.other_languages,
    p.race_ethnicity,
    p.race_ethnicity_other,
    p.hh_income,
    p.childhood_income,
    p.gender,
    p.gender_other,
    p.lgbtqia,
    p.pronouns,
    p.pronouns_other,
    p.last_modified,
    p.created,
    p.indiv_type,
    p.created_by,
    p.tags,
    p.exclude_from_email_logging,
    p.source,
    ped.ped_id,
    ped.discovery_status,
    string_agg(prj.role, ', '::text) AS active_roles,
    string_agg(s.short_name, ', '::text) AS active_schools,
    string_agg(DISTINCT pe.email_address, ', '::text) AS email
   FROM ((((people p
     LEFT JOIN people_educator_details ped ON ((p.person_id = ped.ped_id)))
     LEFT JOIN people_roles_join prj ON ((prj.person_id = p.person_id)))
     LEFT JOIN schools s ON ((prj.school_id = s.school_id)))
     LEFT JOIN primary_emails pe ON ((p.person_id = pe.person_id)))
  WHERE ((prj.currently_active <> false) OR (prj.currently_active IS NULL))
  GROUP BY p.person_id, ped.ped_id;


create or replace view "public"."people_plus_w_active_roles" as  SELECT p.person_id,
    p.full_name,
    p.first_name,
    p.middle_name,
    p.last_name,
    p.nickname,
    p.primary_phone,
    p.secondary_phone,
    p.google_groups,
    p.home_address,
    p.source_other,
    p.tc_userid,
    p.educ_attainment,
    p.primary_language,
    p.other_languages,
    p.race_ethnicity,
    p.race_ethnicity_other,
    p.hh_income,
    p.childhood_income,
    p.gender,
    p.gender_other,
    p.lgbtqia,
    p.pronouns,
    p.pronouns_other,
    p.last_modified,
    p.created,
    p.indiv_type,
    p.created_by,
    p.tags,
    p.exclude_from_email_logging,
    p.source,
    ped.ped_id,
    ped.discovery_status,
    string_agg(prj.role, ', '::text) AS active_roles,
    string_agg(s.short_name, ', '::text) AS active_schools,
    string_agg(DISTINCT pe.email_address, ', '::text) AS email
   FROM ((((people p
     LEFT JOIN people_educator_details ped ON ((p.person_id = ped.ped_id)))
     LEFT JOIN people_roles_join prj ON ((prj.person_id = p.person_id)))
     LEFT JOIN schools s ON ((prj.school_id = s.school_id)))
     LEFT JOIN primary_emails pe ON ((p.person_id = pe.person_id)))
  WHERE prj.currently_active
  GROUP BY p.person_id, ped.ped_id;


create or replace view "public"."schools_plus" as  SELECT s.long_name,
    s.short_name,
    s.status,
    s.governance_model,
    s.prior_names,
    s.narrative,
    s.institutional_partner,
    s.ages_served,
    s.logo,
    s.school_calendar,
    s.left_network_reason,
    s.signed_membership_agreement,
    s.planning_album,
    s.school_email,
    s.email_domain,
    s.school_phone,
    s.facebook,
    s.instagram,
    s.website,
    s.on_national_website,
    s.domain_name,
    s.nonprofit_status,
    s.google_voice,
    s.website_tool,
    s.budget_utility,
    s.transparent_classroom,
    s.admissions_system,
    s.tc_admissions,
    s.tc_recordkeeping,
    s.gusto,
    s.qbo,
    s.business_insurance,
    s.bill_account,
    s.number_of_classrooms,
    s.created,
    s.created_by,
    s.last_modified,
    s.last_modified_by,
    s.pod,
    s.enrollment_at_full_capacity,
    s.google_workspace_org_unit_path,
    s.family_surveys,
    s.flexible_tuition_model,
    s.ein,
    s.agreement_version,
    s.about,
    s.about_spanish,
    s.hero_image_url,
    s.hero_image_2_url,
    s.budget_link,
    s.bookkeeper_or_accountant,
    s.active_pod_member,
    s.risk_factors,
    s.watchlist,
    s.program_focus,
    s.loan_report_name,
    s.nine_nineties,
    s.current_fy_end,
    s.incorporation_date,
    s.guidestar_listing_requested,
    s.group_exemption_status,
    s.date_received_group_exemption,
    s.legal_name,
    s.nondiscrimination_policy_on_application,
    s.nondiscrimination_policy_on_website,
    s.date_withdrawn_from_group_exemption,
    s.qbo_school_codes,
    s.membership_termination_steps,
    s.membership_termination_letter,
    s.automation_notes,
    s.legal_structure,
    s.open_date,
    s.school_id,
    s.left_network_date,
    s.membership_agreement_signed_date,
    s.charter_id,
    s.school_sched,
    s.membership_status,
    s.public_funding,
    loc.address,
    loc.lat,
    loc.long,
    agg.active_tls,
    agg.active_tl_emails,
    agg.active_tl_race,
    agg2.founding_tls,
    ssj.cohorts,
    ssj.ssj_target_city,
    ssj.ssj_target_state,
    ssj.ssj_projected_open,
    ssj.ssj_original_projected_open_date,
    ssj.entered_visioning_date,
    ssj.entered_planning_date,
    ssj.entered_startup_date,
    ssj.ssj_stage,
    ssj.ssj_readiness_to_open_rating,
    ssj.ssj_name_reserved,
    ssj.ssj_has_partner,
    ssj.ssj_board_development,
    ssj.ssj_facility,
    ssj.ssj_cohort_status,
    ssj.ssj_on_track_for_enrollment,
    ssj.ssj_budget_ready_for_next_steps,
    ssj.ssj_seeking_wf_funding,
    ssj.ssj_advice_givers_tls,
    ssj.ssj_advice_givers_partners,
    ssj.ssj_fundraising_narrative,
    ssj.ssj_pathway_to_funding,
    ssj.ssj_total_startup_funding_needed,
    ssj.ssj_loan_eligibility,
    ssj.ssj_loan_approved_amt,
    ssj.ssj_amount_raised,
    ssj.ssj_gap_in_funding,
    ssj.ssj_proj_open_school_year_backup,
    ssj.ssj_date_shared_with_n4g,
    ssj.ssj_proj_open_school_year,
    ssj.ssj_tool,
    ssj.ssj_building4good_status,
    ssj.building4good_firm_and_attorney,
    ssj.visioning_album_complete,
    ssj.visioning_album,
    ssj.logo_designer,
    ssj.name_selection_proposal,
    ssj.trademark_filed,
    ssj.ssj_ops_guide_support_track
   FROM ((((schools s
     LEFT JOIN school_ssj_data ssj ON ((ssj.school_id = s.school_id)))
     LEFT JOIN LATERAL ( SELECT l.address,
            l.lat,
            l.long
           FROM locations l
          WHERE ((l.school_id = s.school_id) AND (l.current_physical_address = true))
         LIMIT 1) loc ON (true))
     LEFT JOIN LATERAL ( SELECT string_agg(DISTINCT at.full_name, ', '::text) AS active_tls,
            string_agg(DISTINCT at.email_address, ', '::text) AS active_tl_emails,
            string_agg(DISTINCT (race.race)::text, ', '::text) AS active_tl_race
           FROM ((people_roles_join prj
             JOIN active_tls at ON ((at.person_id = prj.person_id)))
             LEFT JOIN LATERAL unnest(at.race_ethnicity) race(race) ON (true))
          WHERE (prj.school_id = s.school_id)) agg ON (true))
     LEFT JOIN LATERAL ( SELECT string_agg(DISTINCT ft.full_name, ', '::text) AS founding_tls
           FROM (people_roles_join prj
             JOIN founding_tls ft ON ((ft.person_id = prj.person_id)))
          WHERE (prj.school_id = s.school_id)) agg2 ON (true))
  WHERE (s.status <> 'Placeholder'::school_statuses);



  create policy "initial"
  on "public"."people_roles_join"
  as permissive
  for all
  to public
using (true)
with check (true);



  create policy "initial"
  on "public"."schools"
  as permissive
  for all
  to public
using (true)
with check (true);


CREATE TRIGGER validate_public_funding BEFORE INSERT OR UPDATE ON public.schools FOR EACH ROW EXECUTE FUNCTION check_public_funding_valid();


