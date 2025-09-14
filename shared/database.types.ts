// Generated database types from complete schema files
// Sources: client/gsync.schema.txt and client/public.schema.txt
// This provides complete, accurate type definitions for all tables

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      schools: {
        Row: {
          id: string
          old_id: string
          long_name: string | null
          short_name: string | null
          status: string | null
          governance_model: string | null
          prior_names: string | null
          narrative: string | null
          primary_contact_id: string | null
          institutional_partner: string | null
          ages_served: string[] | null
          logo_url: string | null
          logo: string | null
          school_calendar: string | null
          planning_album: string | null
          tc_school_id: string | null
          school_email: string | null
          email_domain: string | null
          domain_name: string | null
          school_phone: string | null
          facebook: string | null
          instagram: string | null
          website: string | null
          on_national_website: string | null
          nonprofit_status: string | null
          google_voice: string | null
          website_tool: string | null
          budget_utility: string | null
          transparent_classroom: string | null
          admissions_system: string | null
          tc_admissions: string | null
          tc_recordkeeping: string | null
          gusto: string | null
          qbo: string | null
          business_insurance: string | null
          bill_account: string | null
          number_of_classrooms: number | null
          created: string | null
          created_by: string | null
          last_modified: string | null
          last_modified_by: string | null
          pod: string | null
          enrollment_at_full_capacity: string | null
          google_workspace_org_unit_path: string | null
          flexible_tuition_model: string | null
          ein: string | null
          about: string | null
          about_spanish: string | null
          hero_image_url: string | null
          hero_image_2_url: string | null
          budget_link: string | null
          bookkeeper_or_accountant: string | null
          risk_factors: string | null
          watchlist: string | null
          program_focus: string | null
          loan_report_name: string | null
          current_fy_end: string | null
          incorporation_date: string | null
          guidestar_listing_requested: string | null
          legal_name: string | null
          nondiscrimination_policy_on_application: string | null
          nondiscrimination_policy_on_website: string | null
          qbo_school_codes: string | null
          membership_termination_steps: string | null
          automation_notes: string | null
          legal_structure: string | null
          open_date: string | null
          charter_id: string | null
          school_sched: string[] | null
          public_funding: string[] | null
          founding_tls: string[] | null
        }
        Insert: {
          id?: string
          old_id: string
          long_name?: string | null
          short_name?: string | null
          status?: string | null
          governance_model?: string | null
          prior_names?: string | null
          narrative?: string | null
          primary_contact_id?: string | null
          institutional_partner?: string | null
          ages_served?: string[] | null
          logo_url?: string | null
          logo?: string | null
          school_calendar?: string | null
          planning_album?: string | null
          tc_school_id?: string | null
          school_email?: string | null
          email_domain?: string | null
          domain_name?: string | null
          school_phone?: string | null
          facebook?: string | null
          instagram?: string | null
          website?: string | null
          on_national_website?: string | null
          nonprofit_status?: string | null
          google_voice?: string | null
          website_tool?: string | null
          budget_utility?: string | null
          transparent_classroom?: string | null
          admissions_system?: string | null
          tc_admissions?: string | null
          tc_recordkeeping?: string | null
          gusto?: string | null
          qbo?: string | null
          business_insurance?: string | null
          bill_account?: string | null
          number_of_classrooms?: number | null
          created?: string | null
          created_by?: string | null
          last_modified?: string | null
          last_modified_by?: string | null
          pod?: string | null
          enrollment_at_full_capacity?: string | null
          google_workspace_org_unit_path?: string | null
          flexible_tuition_model?: string | null
          ein?: string | null
          about?: string | null
          about_spanish?: string | null
          hero_image_url?: string | null
          hero_image_2_url?: string | null
          budget_link?: string | null
          bookkeeper_or_accountant?: string | null
          risk_factors?: string | null
          watchlist?: string | null
          program_focus?: string | null
          loan_report_name?: string | null
          current_fy_end?: string | null
          incorporation_date?: string | null
          guidestar_listing_requested?: string | null
          legal_name?: string | null
          nondiscrimination_policy_on_application?: string | null
          nondiscrimination_policy_on_website?: string | null
          qbo_school_codes?: string | null
          membership_termination_steps?: string | null
          automation_notes?: string | null
          legal_structure?: string | null
          open_date?: string | null
          charter_id?: string | null
          school_sched?: string[] | null
          public_funding?: string[] | null
          founding_tls?: string[] | null
        }
        Update: {
          id?: string
          old_id?: string
          long_name?: string | null
          short_name?: string | null
          status?: string | null
          governance_model?: string | null
          prior_names?: string | null
          narrative?: string | null
          primary_contact_id?: string | null
          institutional_partner?: string | null
          ages_served?: string[] | null
          logo_url?: string | null
          logo?: string | null
          school_calendar?: string | null
          planning_album?: string | null
          tc_school_id?: string | null
          school_email?: string | null
          email_domain?: string | null
          domain_name?: string | null
          school_phone?: string | null
          facebook?: string | null
          instagram?: string | null
          website?: string | null
          on_national_website?: string | null
          nonprofit_status?: string | null
          google_voice?: string | null
          website_tool?: string | null
          budget_utility?: string | null
          transparent_classroom?: string | null
          admissions_system?: string | null
          tc_admissions?: string | null
          tc_recordkeeping?: string | null
          gusto?: string | null
          qbo?: string | null
          business_insurance?: string | null
          bill_account?: string | null
          number_of_classrooms?: number | null
          created?: string | null
          created_by?: string | null
          last_modified?: string | null
          last_modified_by?: string | null
          pod?: string | null
          enrollment_at_full_capacity?: string | null
          google_workspace_org_unit_path?: string | null
          flexible_tuition_model?: string | null
          ein?: string | null
          about?: string | null
          about_spanish?: string | null
          hero_image_url?: string | null
          hero_image_2_url?: string | null
          budget_link?: string | null
          bookkeeper_or_accountant?: string | null
          risk_factors?: string | null
          watchlist?: string | null
          program_focus?: string | null
          loan_report_name?: string | null
          current_fy_end?: string | null
          incorporation_date?: string | null
          guidestar_listing_requested?: string | null
          legal_name?: string | null
          nondiscrimination_policy_on_application?: string | null
          nondiscrimination_policy_on_website?: string | null
          qbo_school_codes?: string | null
          membership_termination_steps?: string | null
          automation_notes?: string | null
          legal_structure?: string | null
          open_date?: string | null
          charter_id?: string | null
          school_sched?: string[] | null
          public_funding?: string[] | null
          founding_tls?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "schools_charter_id_fkey"
            columns: ["charter_id"]
            isOneToOne: false
            referencedRelation: "charters"
            referencedColumns: ["id"]
          }
        ]
      }
      people: {
        Row: {
          id: string
          first_name: string | null
          middle_name: string | null
          last_name: string | null
          nickname: string | null
          full_name: string | null
          primary_phone: string | null
          secondary_phone: string | null
          primary_phone_other_info: string | null
          secondary_phone_other_info: string | null
          google_groups: string | null
          home_address: string | null
          source_other: string | null
          tc_userid: string | null
          educ_attainment: string | null
          other_languages: string[] | null
          race_ethnicity_other: string | null
          hh_income: string | null
          childhood_income: string | null
          gender: string | null
          gender_other: string | null
          lgbtqia: boolean | null
          pronouns: string | null
          pronouns_other: string | null
          last_modified: string | null
          created: string | null
          indiv_type: string | null
          created_by: string | null
          tags: string | null
          exclude_from_email_logging: boolean | null
          race_ethnicity: string[] | null
          source: string[] | null
          primary_languages: string[] | null
        }
        Insert: {
          id: string
          first_name?: string | null
          middle_name?: string | null
          last_name?: string | null
          nickname?: string | null
          full_name?: string | null
          primary_phone?: string | null
          secondary_phone?: string | null
          primary_phone_other_info?: string | null
          secondary_phone_other_info?: string | null
          google_groups?: string | null
          home_address?: string | null
          source_other?: string | null
          tc_userid?: string | null
          educ_attainment?: string | null
          other_languages?: string[] | null
          race_ethnicity_other?: string | null
          hh_income?: string | null
          childhood_income?: string | null
          gender?: string | null
          gender_other?: string | null
          lgbtqia?: boolean | null
          pronouns?: string | null
          pronouns_other?: string | null
          last_modified?: string | null
          created?: string | null
          indiv_type?: string | null
          created_by?: string | null
          tags?: string | null
          exclude_from_email_logging?: boolean | null
          race_ethnicity?: string[] | null
          source?: string[] | null
          primary_languages?: string[] | null
        }
        Update: {
          id?: string
          first_name?: string | null
          middle_name?: string | null
          last_name?: string | null
          nickname?: string | null
          full_name?: string | null
          primary_phone?: string | null
          secondary_phone?: string | null
          primary_phone_other_info?: string | null
          secondary_phone_other_info?: string | null
          google_groups?: string | null
          home_address?: string | null
          source_other?: string | null
          tc_userid?: string | null
          educ_attainment?: string | null
          other_languages?: string[] | null
          race_ethnicity_other?: string | null
          hh_income?: string | null
          childhood_income?: string | null
          gender?: string | null
          gender_other?: string | null
          lgbtqia?: boolean | null
          pronouns?: string | null
          pronouns_other?: string | null
          last_modified?: string | null
          created?: string | null
          indiv_type?: string | null
          created_by?: string | null
          tags?: string | null
          exclude_from_email_logging?: boolean | null
          race_ethnicity?: string[] | null
          source?: string[] | null
          primary_languages?: string[] | null
        }
        Relationships: []
      }
      people_roles_associations: {
        Row: {
          id: string
          people_id: string | null
          school_id: string | null
          charter_id: string | null
          authorizer_id: string | null
          role: string | null
          role_specific_email: string | null
          loan_fund: boolean | null
          email_status: string | null
          who_initiated_tl_removal: string | null
          gsuite_roles: string | null
          currently_active: boolean | null
          created_date: string | null
          start_date: string | null
          end_date: string | null
        }
        Insert: {
          id: string
          people_id?: string | null
          school_id?: string | null
          charter_id?: string | null
          authorizer_id?: string | null
          role?: string | null
          role_specific_email?: string | null
          loan_fund?: boolean | null
          email_status?: string | null
          who_initiated_tl_removal?: string | null
          gsuite_roles?: string | null
          currently_active?: boolean | null
          created_date?: string | null
          start_date?: string | null
          end_date?: string | null
        }
        Update: {
          id?: string
          people_id?: string | null
          school_id?: string | null
          charter_id?: string | null
          authorizer_id?: string | null
          role?: string | null
          role_specific_email?: string | null
          loan_fund?: boolean | null
          email_status?: string | null
          who_initiated_tl_removal?: string | null
          gsuite_roles?: string | null
          currently_active?: boolean | null
          created_date?: string | null
          start_date?: string | null
          end_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "people_roles_associations_people_id_fkey"
            columns: ["people_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "educatorsXschools_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "people_roles_join_charter_id_fkey"
            columns: ["charter_id"]
            isOneToOne: false
            referencedRelation: "charters"
            referencedColumns: ["id"]
          }
        ]
      }
      notes: {
        Row: {
          id: string
          text: string | null
          created_date: string | null
          created_by: string | null
          private: boolean | null
          school_id: string | null
          people_id: string | null
          charter_id: string | null
        }
        Insert: {
          id?: string
          text?: string | null
          created_date?: string | null
          created_by?: string | null
          private?: boolean | null
          school_id?: string | null
          people_id?: string | null
          charter_id?: string | null
        }
        Update: {
          id?: string
          text?: string | null
          created_date?: string | null
          created_by?: string | null
          private?: boolean | null
          school_id?: string | null
          people_id?: string | null
          charter_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "school_notes_people_id_fkey"
            columns: ["people_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_notes_charter_id_fkey"
            columns: ["charter_id"]
            isOneToOne: false
            referencedRelation: "charters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_notes_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          }
        ]
      }
      action_steps: {
        Row: {
          id: string
          item: string | null
          assignee: string | null
          item_status: string | null
          entity_id: string | null
          assigned_date: string | null
          due_date: string | null
          completed_date: string | null
          people_id: string | null
          school_id: string | null
          charter_id: string | null
        }
        Insert: {
          id?: string
          item?: string | null
          assignee?: string | null
          item_status?: string | null
          entity_id?: string | null
          assigned_date?: string | null
          due_date?: string | null
          completed_date?: string | null
          people_id?: string | null
          school_id?: string | null
          charter_id?: string | null
        }
        Update: {
          id?: string
          item?: string | null
          assignee?: string | null
          item_status?: string | null
          entity_id?: string | null
          assigned_date?: string | null
          due_date?: string | null
          completed_date?: string | null
          people_id?: string | null
          school_id?: string | null
          charter_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "action_steps_people_id_fkey"
            columns: ["people_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "action_steps_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "action_steps_charter_id_fkey"
            columns: ["charter_id"]
            isOneToOne: false
            referencedRelation: "charters"
            referencedColumns: ["id"]
          }
        ]
      }
      locations: {
        Row: {
          id: string
          charter_id: string | null
          school_id: string | null
          current_mail_address: boolean | null
          current_physical_address: boolean | null
          start_date: string | null
          end_date: string | null
          co_location_type: string | null
          co_location_partner: string | null
          address: string | null
          street: string | null
          city: string | null
          state: string | null
          country: string | null
          zip: string | null
          neighborhood: string | null
          sq_ft: number | null
          max_students: number | null
          lat: number | null
          long: number | null
          created_datetime: string | null
          modified_datetime: string | null
          geocode_last_run_at: string | null
          census_tract: string | null
          qualified_low_income_tract: boolean | null
          lease: string | null
          lease_end_date: string | null
          mailable: boolean | null
          physical: boolean | null
        }
        Insert: {
          id?: string
          charter_id?: string | null
          school_id?: string | null
          current_mail_address?: boolean | null
          current_physical_address?: boolean | null
          start_date?: string | null
          end_date?: string | null
          co_location_type?: string | null
          co_location_partner?: string | null
          address?: string | null
          street?: string | null
          city?: string | null
          state?: string | null
          country?: string | null
          zip?: string | null
          neighborhood?: string | null
          sq_ft?: number | null
          max_students?: number | null
          lat?: number | null
          long?: number | null
          created_datetime?: string | null
          modified_datetime?: string | null
          geocode_last_run_at?: string | null
          census_tract?: string | null
          qualified_low_income_tract?: boolean | null
          lease?: string | null
          lease_end_date?: string | null
          mailable?: boolean | null
          physical?: boolean | null
        }
        Update: {
          id?: string
          charter_id?: string | null
          school_id?: string | null
          current_mail_address?: boolean | null
          current_physical_address?: boolean | null
          start_date?: string | null
          end_date?: string | null
          co_location_type?: string | null
          co_location_partner?: string | null
          address?: string | null
          street?: string | null
          city?: string | null
          state?: string | null
          country?: string | null
          zip?: string | null
          neighborhood?: string | null
          sq_ft?: number | null
          max_students?: number | null
          lat?: number | null
          long?: number | null
          created_datetime?: string | null
          modified_datetime?: string | null
          geocode_last_run_at?: string | null
          census_tract?: string | null
          qualified_low_income_tract?: boolean | null
          lease?: string | null
          lease_end_date?: string | null
          mailable?: boolean | null
          physical?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "locations_charter_id_fkey"
            columns: ["charter_id"]
            isOneToOne: false
            referencedRelation: "charters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "locations_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          }
        ]
      }
      z_g_emails: {
        Row: {
          id: string
          user_id: string
          gmail_message_id: string
          thread_id: string | null
          from_email: string | null
          to_emails: string[] | null
          cc_emails: string[] | null
          bcc_emails: string[] | null
          subject: string | null
          body_text: string | null
          body_html: string | null
          sent_at: string | null
          created_at: string
          updated_at: string
          matched_emails: string[] | null
          matched_educator_ids: string[] | null
        }
        Insert: {
          id?: string
          user_id: string
          gmail_message_id: string
          thread_id?: string | null
          from_email?: string | null
          to_emails?: string[] | null
          cc_emails?: string[] | null
          bcc_emails?: string[] | null
          subject?: string | null
          body_text?: string | null
          body_html?: string | null
          sent_at?: string | null
          created_at?: string
          updated_at?: string
          matched_emails?: string[] | null
          matched_educator_ids?: string[] | null
        }
        Update: {
          id?: string
          user_id?: string
          gmail_message_id?: string
          thread_id?: string | null
          from_email?: string | null
          to_emails?: string[] | null
          cc_emails?: string[] | null
          bcc_emails?: string[] | null
          subject?: string | null
          body_text?: string | null
          body_html?: string | null
          sent_at?: string | null
          created_at?: string
          updated_at?: string
          matched_emails?: string[] | null
          matched_educator_ids?: string[] | null
        }
        Relationships: []
      }
      z_g_events: {
        Row: {
          id: string
          user_id: string
          google_calendar_id: string
          google_event_id: string
          summary: string | null
          description: string | null
          start_time: string | null
          end_time: string | null
          organizer_email: string | null
          location: string | null
          status: string | null
          created_at: string
          updated_at: string
          matched_emails: string[] | null
          matched_educator_ids: string[] | null
          attendees: string[] | null
        }
        Insert: {
          id?: string
          user_id: string
          google_calendar_id: string
          google_event_id: string
          summary?: string | null
          description?: string | null
          start_time?: string | null
          end_time?: string | null
          organizer_email?: string | null
          location?: string | null
          status?: string | null
          created_at?: string
          updated_at?: string
          matched_emails?: string[] | null
          matched_educator_ids?: string[] | null
          attendees?: string[] | null
        }
        Update: {
          id?: string
          user_id?: string
          google_calendar_id?: string
          google_event_id?: string
          summary?: string | null
          description?: string | null
          start_time?: string | null
          end_time?: string | null
          organizer_email?: string | null
          location?: string | null
          status?: string | null
          created_at?: string
          updated_at?: string
          matched_emails?: string[] | null
          matched_educator_ids?: string[] | null
          attendees?: string[] | null
        }
        Relationships: []
      }
      governance_docs: {
        Row: {
          id: string
          doc_type: string | null
          pdf: string | null
          school_id: string | null
          charter_id: string | null
        }
        Insert: {
          id?: string
          doc_type?: string | null
          pdf?: string | null
          school_id?: string | null
          charter_id?: string | null
        }
        Update: {
          id?: string
          doc_type?: string | null
          pdf?: string | null
          school_id?: string | null
          charter_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "governance_docs_charter_id_fkey"
            columns: ["charter_id"]
            isOneToOne: false
            referencedRelation: "charters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "governance_docs_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          }
        ]
      }
      nine_nineties: {
        Row: {
          id: string
          form_year: string | null
          link: string | null
          notes: string | null
          ai_derived_revenue: string | null
          ai_derived_EOY: string | null
          school_id: string | null
          charter_id: string | null
          pdf: string | null
        }
        Insert: {
          id?: string
          form_year?: string | null
          link?: string | null
          notes?: string | null
          ai_derived_revenue?: string | null
          ai_derived_EOY?: string | null
          school_id?: string | null
          charter_id?: string | null
          pdf?: string | null
        }
        Update: {
          id?: string
          form_year?: string | null
          link?: string | null
          notes?: string | null
          ai_derived_revenue?: string | null
          ai_derived_EOY?: string | null
          school_id?: string | null
          charter_id?: string | null
          pdf?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "990s_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "990s_charter_id_fkey"
            columns: ["charter_id"]
            isOneToOne: false
            referencedRelation: "charters"
            referencedColumns: ["id"]
          }
        ]
      }
      charters: {
        Row: {
          id: string
          old_id: string
          short_name: string | null
          full_name: string | null
          initial_target_geo: string | null
          landscape_analysis: string | null
          application: string | null
          non_tl_roles: string | null
          cohorts: string[] | null
          status: string | null
          ein: string | null
          incorp_date: string | null
          current_fy_end: string | null
          non_discrimination_policy_on_website: boolean | null
          school_provided_1023: boolean | null
          guidestar_listing_requested: boolean | null
          partnership_with_wf: string | null
          first_site_opened_date: string | null
          website: string | null
          nonprofit_status: boolean | null
          initial_target_planes: string[] | null
        }
        Insert: {
          id?: string
          old_id: string
          short_name?: string | null
          full_name?: string | null
          initial_target_geo?: string | null
          landscape_analysis?: string | null
          application?: string | null
          non_tl_roles?: string | null
          cohorts?: string[] | null
          status?: string | null
          ein?: string | null
          incorp_date?: string | null
          current_fy_end?: string | null
          non_discrimination_policy_on_website?: boolean | null
          school_provided_1023?: boolean | null
          guidestar_listing_requested?: boolean | null
          partnership_with_wf?: string | null
          first_site_opened_date?: string | null
          website?: string | null
          nonprofit_status?: boolean | null
          initial_target_planes?: string[] | null
        }
        Update: {
          id?: string
          old_id?: string
          short_name?: string | null
          full_name?: string | null
          initial_target_geo?: string | null
          landscape_analysis?: string | null
          application?: string | null
          non_tl_roles?: string | null
          cohorts?: string[] | null
          status?: string | null
          ein?: string | null
          incorp_date?: string | null
          current_fy_end?: string | null
          non_discrimination_policy_on_website?: boolean | null
          school_provided_1023?: boolean | null
          guidestar_listing_requested?: boolean | null
          partnership_with_wf?: string | null
          first_site_opened_date?: string | null
          website?: string | null
          nonprofit_status?: boolean | null
          initial_target_planes?: string[] | null
        }
        Relationships: []
      }
      grants: {
        Row: {
          id: string
          actual_tls: string | null
          actual_school_legal_name: string | null
          actual_mailing_address: string | null
          actual_tl_emails: string | null
          actual_ein: string | null
          actual_nonprofit_status: string | null
          actual_membership_status: string | null
          ready_to_accept_flag: string | null
          ready_to_issue_grant_letter_flag: string | null
          bill_account: string | null
          guide_first_name: string | null
          "School Grant Name": string | null
          grant_status: string | null
          amount: number | null
          issue_date: string | null
          funding_source: string | null
          issued_by: string | null
          label: string | null
          accounting_notes: string | null
          qbo_number: number | null
          notes: string | null
          ledger_entry: string | null
          funding_purpose: string | null
          funding_period: string | null
          actual_501c3_proof: string | null
          automation_step_trigger: string | null
          prelim_advice_request_timestamp: string | null
          full_advice_request_timestamp: string | null
          end_of_full_advice_window: string | null
          unsigned_grant_agreement: string | null
          signed_grant_agreement: string | null
          grant_advice: string | null
          school_id: string | null
          charter_id: string | null
          people_id: string | null
        }
        Insert: {
          id?: string
          actual_tls?: string | null
          actual_school_legal_name?: string | null
          actual_mailing_address?: string | null
          actual_tl_emails?: string | null
          actual_ein?: string | null
          actual_nonprofit_status?: string | null
          actual_membership_status?: string | null
          ready_to_accept_flag?: string | null
          ready_to_issue_grant_letter_flag?: string | null
          bill_account?: string | null
          guide_first_name?: string | null
          "School Grant Name"?: string | null
          grant_status?: string | null
          amount?: number | null
          issue_date?: string | null
          funding_source?: string | null
          issued_by?: string | null
          label?: string | null
          accounting_notes?: string | null
          qbo_number?: number | null
          notes?: string | null
          ledger_entry?: string | null
          funding_purpose?: string | null
          funding_period?: string | null
          actual_501c3_proof?: string | null
          automation_step_trigger?: string | null
          prelim_advice_request_timestamp?: string | null
          full_advice_request_timestamp?: string | null
          end_of_full_advice_window?: string | null
          unsigned_grant_agreement?: string | null
          signed_grant_agreement?: string | null
          grant_advice?: string | null
          school_id?: string | null
          charter_id?: string | null
          people_id?: string | null
        }
        Update: {
          id?: string
          actual_tls?: string | null
          actual_school_legal_name?: string | null
          actual_mailing_address?: string | null
          actual_tl_emails?: string | null
          actual_ein?: string | null
          actual_nonprofit_status?: string | null
          actual_membership_status?: string | null
          ready_to_accept_flag?: string | null
          ready_to_issue_grant_letter_flag?: string | null
          bill_account?: string | null
          guide_first_name?: string | null
          "School Grant Name"?: string | null
          grant_status?: string | null
          amount?: number | null
          issue_date?: string | null
          funding_source?: string | null
          issued_by?: string | null
          label?: string | null
          accounting_notes?: string | null
          qbo_number?: number | null
          notes?: string | null
          ledger_entry?: string | null
          funding_purpose?: string | null
          funding_period?: string | null
          actual_501c3_proof?: string | null
          automation_step_trigger?: string | null
          prelim_advice_request_timestamp?: string | null
          full_advice_request_timestamp?: string | null
          end_of_full_advice_window?: string | null
          unsigned_grant_agreement?: string | null
          signed_grant_agreement?: string | null
          grant_advice?: string | null
          school_id?: string | null
          charter_id?: string | null
          people_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "grants_charter_id_fkey"
            columns: ["charter_id"]
            isOneToOne: false
            referencedRelation: "charters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grants_people_id_fkey"
            columns: ["people_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grants_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      ui_grid_schools: {
        Row: {
          id: string
          name: string | null
          shortName: string | null
          status: string | null
          governanceModel: string | null
          agesServed: string[] | null
          membershipStatus: string | null
          projectedOpen: string | null
          about: string | null
          phone: string | null
          email: string | null
          website: string | null
        }
        Relationships: []
      }
      ui_details_school: {
        Row: {
          id: string
          name: string | null
          longName: string | null
          shortName: string | null
          status: string | null
          governanceModel: string | null
          agesServed: string[] | null
          membershipStatus: string | null
          projectedOpen: string | null
          about: string | null
          aboutSpanish: string | null
          phone: string | null
          email: string | null
          website: string | null
          physicalAddress: string | null
          mailingAddress: string | null
          logoUrl: string | null
          heroImageUrl: string | null
          institutionalPartner: string | null
          nonprofitStatus: string | null
          ein: string | null
          legalName: string | null
          legalStructure: string | null
          incorporationDate: string | null
          currentFyEnd: string | null
          openDate: string | null
          numberOfClassrooms: number | null
          enrollmentAtFullCapacity: string | null
          schoolCalendar: string | null
          schoolSched: string[] | null
          programFocus: string | null
          flexibleTuitionModel: string | null
          pod: string | null
          riskFactors: string | null
          watchlist: string | null
          planningAlbum: string | null
          archived: boolean | null
          created_at: string
          updated_at: string
        }
        Relationships: []
      }
      ui_grid_educators: {
        Row: {
          id: string
          fullName: string | null
          firstName: string | null
          lastName: string | null
          primaryEmail: string | null
          primaryPhone: string | null
          discoveryStatus: string | null
          hasMontessoriCert: boolean | null
          raceEthnicityDisplay: string | null
          kanbanGroup: string | null
          kanbanOrder: number | null
          inactiveFlag: boolean | null
        }
        Relationships: []
      }
      ui_details_educator: {
        Row: {
          id: string
          fullName: string | null
          firstName: string | null
          lastName: string | null
          middleName: string | null
          nickname: string | null
          primaryEmail: string | null
          nonWildflowerEmail: string | null
          primaryPhone: string | null
          primaryPhoneOtherInfo: string | null
          secondaryPhone: string | null
          secondaryPhoneOtherInfo: string | null
          homeAddress: string | null
          discoveryStatus: string | null
          hasMontessoriCert: boolean | null
          raceEthnicity: string[] | null
          raceEthnicityDisplay: string | null
          raceEthnicityOther: string | null
          primaryLanguages: string[] | null
          otherLanguages: string[] | null
          educationalAttainment: string | null
          householdIncome: string | null
          incomeBackground: string | null
          gender: string | null
          genderOther: string | null
          lgbtqia: boolean | null
          pronouns: string | null
          pronounsOther: string | null
          kanbanGroup: string | null
          kanbanOrder: number | null
          inactiveFlag: boolean | null
          indivType: string | null
          excludeFromEmailLogging: boolean | null
          targetGeo: string | null
          tags: string | null
          created_at: string
          updated_at: string
        }
        Relationships: []
      }
      ui_school_emails: {
        Row: {
          id: string
          gmail_message_id: string
          thread_id: string | null
          from_email: string | null
          to_emails: string[] | null
          cc_emails: string[] | null
          subject: string | null
          body_text: string | null
          sent_at: string | null
          created_at: string
          matched_emails: string[] | null
          matched_educator_ids: string[] | null
        }
        Relationships: []
      }
      ui_school_events: {
        Row: {
          id: string
          google_event_id: string
          summary: string | null
          description: string | null
          start_time: string | null
          end_time: string | null
          organizer_email: string | null
          location: string | null
          status: string | null
          created_at: string
          matched_emails: string[] | null
          matched_educator_ids: string[] | null
          attendees: string[] | null
        }
        Relationships: []
      }
      ui_educator_emails: {
        Row: {
          id: string
          gmail_message_id: string
          thread_id: string | null
          from_email: string | null
          to_emails: string[] | null
          cc_emails: string[] | null
          subject: string | null
          body_text: string | null
          sent_at: string | null
          created_at: string
          matched_emails: string[] | null
          matched_educator_ids: string[] | null
        }
        Relationships: []
      }
      ui_educator_events: {
        Row: {
          id: string
          google_event_id: string
          summary: string | null
          description: string | null
          start_time: string | null
          end_time: string | null
          organizer_email: string | null
          location: string | null
          status: string | null
          created_at: string
          matched_emails: string[] | null
          matched_educator_ids: string[] | null
          attendees: string[] | null
        }
        Relationships: []
      }
    }
    Functions: {
      update_school_field: {
        Args: {
          school_id: string
          field_name: string
          field_value: Json
        }
        Returns: Json
      }
      update_educator_field: {
        Args: {
          educator_id: string
          field_name: string
          field_value: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}