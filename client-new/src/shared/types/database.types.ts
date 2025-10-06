export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  gsync: {
    Tables: {
      email_addresses_filtered_mv: {
        Row: {
          email_address: string | null
          created_at: string | null
          people_id: string | null
        }
        Insert: {
          email_address?: string | null
          created_at?: string | null
          people_id?: string | null
        }
        Update: {
          email_address?: string | null
          created_at?: string | null
          people_id?: string | null
        }
      }
      exclusion_emails: {
        Row: {
          email: string
          email_or_domain: string | null
        }
        Insert: {
          email?: string | null
          email_or_domain?: string | null
        }
        Update: {
          email?: string | null
          email_or_domain?: string | null
        }
      }
      g_email_attachments: {
        Row: {
          id: string
          user_id: string
          gmail_message_id: string
          attachment_id: string
          filename: string | null
          mime_type: string | null
          size_bytes: number | null
          content_base64: string | null
          created_at: string
          storage_path: string | null
        }
        Insert: {
          id?: string | null
          user_id?: string | null
          gmail_message_id?: string | null
          attachment_id?: string | null
          filename?: string | null
          mime_type?: string | null
          size_bytes?: number | null
          content_base64?: string | null
          created_at?: string | null
          storage_path?: string | null
        }
        Update: {
          id?: string | null
          user_id?: string | null
          gmail_message_id?: string | null
          attachment_id?: string | null
          filename?: string | null
          mime_type?: string | null
          size_bytes?: number | null
          content_base64?: string | null
          created_at?: string | null
          storage_path?: string | null
        }
      }
      g_emails: {
        Row: {
          user_id: string
          gmail_message_id: string
          thread_id: string | null
          from_email: string | null
          to_emails: unknown | null
          cc_emails: unknown | null
          bcc_emails: unknown | null
          subject: string | null
          body_text: string | null
          body_html: string | null
          sent_at: string | null
          created_at: string
          updated_at: string
          is_private: boolean | null
        }
        Insert: {
          user_id?: string | null
          gmail_message_id?: string | null
          thread_id?: string | null
          from_email?: string | null
          to_emails?: unknown | null
          cc_emails?: unknown | null
          bcc_emails?: unknown | null
          subject?: string | null
          body_text?: string | null
          body_html?: string | null
          sent_at?: string | null
          created_at?: string | null
          updated_at?: string | null
          is_private?: boolean | null
        }
        Update: {
          user_id?: string | null
          gmail_message_id?: string | null
          thread_id?: string | null
          from_email?: string | null
          to_emails?: unknown | null
          cc_emails?: unknown | null
          bcc_emails?: unknown | null
          subject?: string | null
          body_text?: string | null
          body_html?: string | null
          sent_at?: string | null
          created_at?: string | null
          updated_at?: string | null
          is_private?: boolean | null
        }
      }
      g_emails_addresses_unnested_mv: {
        Row: {
          gmail_message_id: string | null
          user_id: string | null
          address_row: unknown | null
          email_address: string | null
        }
        Insert: {
          gmail_message_id?: string | null
          user_id?: string | null
          address_row?: unknown | null
          email_address?: string | null
        }
        Update: {
          gmail_message_id?: string | null
          user_id?: string | null
          address_row?: unknown | null
          email_address?: string | null
        }
      }
      g_emails_full_bodies_to_download: {
        Row: {
          gmail_message_id: string | null
          user_id: string | null
          body_text: string | null
        }
        Insert: {
          gmail_message_id?: string | null
          user_id?: string | null
          body_text?: string | null
        }
        Update: {
          gmail_message_id?: string | null
          user_id?: string | null
          body_text?: string | null
        }
      }
      g_emails_minus_exclusions: {
        Row: {
          user_id: string | null
          gmail_message_id: string | null
          thread_id: string | null
          from_email: string | null
          to_emails: unknown | null
          cc_emails: unknown | null
          bcc_emails: unknown | null
          subject: string | null
          body_text: string | null
          body_html: string | null
          sent_at: string | null
          created_at: string | null
          updated_at: string | null
          is_private: boolean | null
        }
        Insert: {
          user_id?: string | null
          gmail_message_id?: string | null
          thread_id?: string | null
          from_email?: string | null
          to_emails?: unknown | null
          cc_emails?: unknown | null
          bcc_emails?: unknown | null
          subject?: string | null
          body_text?: string | null
          body_html?: string | null
          sent_at?: string | null
          created_at?: string | null
          updated_at?: string | null
          is_private?: boolean | null
        }
        Update: {
          user_id?: string | null
          gmail_message_id?: string | null
          thread_id?: string | null
          from_email?: string | null
          to_emails?: unknown | null
          cc_emails?: unknown | null
          bcc_emails?: unknown | null
          subject?: string | null
          body_text?: string | null
          body_html?: string | null
          sent_at?: string | null
          created_at?: string | null
          updated_at?: string | null
          is_private?: boolean | null
        }
      }
      g_emails_people_ids_mv: {
        Row: {
          people_id: string | null
          user_id: string | null
          gmail_message_id: string | null
        }
        Insert: {
          people_id?: string | null
          user_id?: string | null
          gmail_message_id?: string | null
        }
        Update: {
          people_id?: string | null
          user_id?: string | null
          gmail_message_id?: string | null
        }
      }
      g_emails_with_people_ids_mv: {
        Row: {
          gmail_message_id: string | null
          thread_id: string | null
          user_id: string | null
          people_id: string | null
          from_email: string | null
          to_emails: unknown | null
          cc_emails: unknown | null
          bcc_emails: unknown | null
          subject: string | null
          body_text: string | null
          body_html: string | null
          sent_at: string | null
          is_private: boolean | null
          school_id: string | null
          charter_id: string | null
        }
        Insert: {
          gmail_message_id?: string | null
          thread_id?: string | null
          user_id?: string | null
          people_id?: string | null
          from_email?: string | null
          to_emails?: unknown | null
          cc_emails?: unknown | null
          bcc_emails?: unknown | null
          subject?: string | null
          body_text?: string | null
          body_html?: string | null
          sent_at?: string | null
          is_private?: boolean | null
          school_id?: string | null
          charter_id?: string | null
        }
        Update: {
          gmail_message_id?: string | null
          thread_id?: string | null
          user_id?: string | null
          people_id?: string | null
          from_email?: string | null
          to_emails?: unknown | null
          cc_emails?: unknown | null
          bcc_emails?: unknown | null
          subject?: string | null
          body_text?: string | null
          body_html?: string | null
          sent_at?: string | null
          is_private?: boolean | null
          school_id?: string | null
          charter_id?: string | null
        }
      }
      g_emails_without_people_ids: {
        Row: {
          gmail_message_id: string | null
          thread_id: string | null
          user_id: string | null
          from_email: string | null
          to_emails: unknown | null
          cc_emails: unknown | null
          bcc_emails: unknown | null
          subject: string | null
          body_text: string | null
          body_html: string | null
          sent_at: string | null
          is_private: boolean | null
          school_id: string | null
          charter_id: string | null
        }
        Insert: {
          gmail_message_id?: string | null
          thread_id?: string | null
          user_id?: string | null
          from_email?: string | null
          to_emails?: unknown | null
          cc_emails?: unknown | null
          bcc_emails?: unknown | null
          subject?: string | null
          body_text?: string | null
          body_html?: string | null
          sent_at?: string | null
          is_private?: boolean | null
          school_id?: string | null
          charter_id?: string | null
        }
        Update: {
          gmail_message_id?: string | null
          thread_id?: string | null
          user_id?: string | null
          from_email?: string | null
          to_emails?: unknown | null
          cc_emails?: unknown | null
          bcc_emails?: unknown | null
          subject?: string | null
          body_text?: string | null
          body_html?: string | null
          sent_at?: string | null
          is_private?: boolean | null
          school_id?: string | null
          charter_id?: string | null
        }
      }
      g_event_attachments: {
        Row: {
          id: string
          user_id: string
          google_calendar_id: string
          google_event_id: string
          title: string | null
          mime_type: string | null
          file_url: string | null
          file_id: string | null
          icon_link: string | null
          identity_key: string | null
          created_at: string
          storage_path: string | null
        }
        Insert: {
          id?: string | null
          user_id?: string | null
          google_calendar_id?: string | null
          google_event_id?: string | null
          title?: string | null
          mime_type?: string | null
          file_url?: string | null
          file_id?: string | null
          icon_link?: string | null
          identity_key?: string | null
          created_at?: string | null
          storage_path?: string | null
        }
        Update: {
          id?: string | null
          user_id?: string | null
          google_calendar_id?: string | null
          google_event_id?: string | null
          title?: string | null
          mime_type?: string | null
          file_url?: string | null
          file_id?: string | null
          icon_link?: string | null
          identity_key?: string | null
          created_at?: string | null
          storage_path?: string | null
        }
      }
      g_events: {
        Row: {
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
          attendees: unknown | null
          is_private: boolean | null
        }
        Insert: {
          user_id?: string | null
          google_calendar_id?: string | null
          google_event_id?: string | null
          summary?: string | null
          description?: string | null
          start_time?: string | null
          end_time?: string | null
          organizer_email?: string | null
          location?: string | null
          status?: string | null
          created_at?: string | null
          updated_at?: string | null
          attendees?: unknown | null
          is_private?: boolean | null
        }
        Update: {
          user_id?: string | null
          google_calendar_id?: string | null
          google_event_id?: string | null
          summary?: string | null
          description?: string | null
          start_time?: string | null
          end_time?: string | null
          organizer_email?: string | null
          location?: string | null
          status?: string | null
          created_at?: string | null
          updated_at?: string | null
          attendees?: unknown | null
          is_private?: boolean | null
        }
      }
      g_events_attendees_unnested_mv: {
        Row: {
          google_event_id: string | null
          google_calendar_id: string | null
          user_id: string | null
          participant_type: string | null
          email_address: string | null
        }
        Insert: {
          google_event_id?: string | null
          google_calendar_id?: string | null
          user_id?: string | null
          participant_type?: string | null
          email_address?: string | null
        }
        Update: {
          google_event_id?: string | null
          google_calendar_id?: string | null
          user_id?: string | null
          participant_type?: string | null
          email_address?: string | null
        }
      }
      g_events_full_bodies_to_download: {
        Row: {
          google_event_id: string | null
          google_calendar_id: string | null
          user_id: string | null
          description: string | null
        }
        Insert: {
          google_event_id?: string | null
          google_calendar_id?: string | null
          user_id?: string | null
          description?: string | null
        }
        Update: {
          google_event_id?: string | null
          google_calendar_id?: string | null
          user_id?: string | null
          description?: string | null
        }
      }
      g_events_people_ids_mv: {
        Row: {
          people_id: string | null
          user_id: string | null
          google_calendar_id: string | null
          google_event_id: string | null
        }
        Insert: {
          people_id?: string | null
          user_id?: string | null
          google_calendar_id?: string | null
          google_event_id?: string | null
        }
        Update: {
          people_id?: string | null
          user_id?: string | null
          google_calendar_id?: string | null
          google_event_id?: string | null
        }
      }
      g_events_with_people_ids_mv: {
        Row: {
          google_calendar_id: string | null
          google_event_id: string | null
          user_id: string | null
          people_id: string | null
          organizer_email: string | null
          attendees: unknown | null
          location: string | null
          summary: string | null
          description: string | null
          start_time: string | null
          end_time: string | null
          is_private: boolean | null
          school_id: string | null
          charter_id: string | null
        }
        Insert: {
          google_calendar_id?: string | null
          google_event_id?: string | null
          user_id?: string | null
          people_id?: string | null
          organizer_email?: string | null
          attendees?: unknown | null
          location?: string | null
          summary?: string | null
          description?: string | null
          start_time?: string | null
          end_time?: string | null
          is_private?: boolean | null
          school_id?: string | null
          charter_id?: string | null
        }
        Update: {
          google_calendar_id?: string | null
          google_event_id?: string | null
          user_id?: string | null
          people_id?: string | null
          organizer_email?: string | null
          attendees?: unknown | null
          location?: string | null
          summary?: string | null
          description?: string | null
          start_time?: string | null
          end_time?: string | null
          is_private?: boolean | null
          school_id?: string | null
          charter_id?: string | null
        }
      }
      g_events_without_people_ids: {
        Row: {
          google_calendar_id: string | null
          google_event_id: string | null
          user_id: string | null
          organizer_email: string | null
          attendees: unknown | null
          location: string | null
          summary: string | null
          description: string | null
          start_time: string | null
          end_time: string | null
          is_private: boolean | null
          school_id: string | null
          charter_id: string | null
        }
        Insert: {
          google_calendar_id?: string | null
          google_event_id?: string | null
          user_id?: string | null
          organizer_email?: string | null
          attendees?: unknown | null
          location?: string | null
          summary?: string | null
          description?: string | null
          start_time?: string | null
          end_time?: string | null
          is_private?: boolean | null
          school_id?: string | null
          charter_id?: string | null
        }
        Update: {
          google_calendar_id?: string | null
          google_event_id?: string | null
          user_id?: string | null
          organizer_email?: string | null
          attendees?: unknown | null
          location?: string | null
          summary?: string | null
          description?: string | null
          start_time?: string | null
          end_time?: string | null
          is_private?: boolean | null
          school_id?: string | null
          charter_id?: string | null
        }
      }
      google_auth_tokens: {
        Row: {
          user_id: string
          access_token: string
          refresh_token: string
          expires_at: string
          updated_at: string
        }
        Insert: {
          user_id?: string | null
          access_token?: string | null
          refresh_token?: string | null
          expires_at?: string | null
          updated_at?: string | null
        }
        Update: {
          user_id?: string | null
          access_token?: string | null
          refresh_token?: string | null
          expires_at?: string | null
          updated_at?: string | null
        }
      }
      google_sync_history: {
        Row: {
          id: number
          started_at: string
          user_id: string | null
          start_of_sync_period: string | null
          end_of_sync_period: string | null
          object_type: unknown | null
          headers_fetched: number | null
          headers_fetch_successful: boolean | null
          headers_fetch_error: string | null
          backfill_downloads: number | null
          backfill_download_successful: boolean | null
          backfill_error: string | null
          initiator: unknown | null
        }
        Insert: {
          id?: number | null
          started_at?: string | null
          user_id?: string | null
          start_of_sync_period?: string | null
          end_of_sync_period?: string | null
          object_type?: unknown | null
          headers_fetched?: number | null
          headers_fetch_successful?: boolean | null
          headers_fetch_error?: string | null
          backfill_downloads?: number | null
          backfill_download_successful?: boolean | null
          backfill_error?: string | null
          initiator?: unknown | null
        }
        Update: {
          id?: number | null
          started_at?: string | null
          user_id?: string | null
          start_of_sync_period?: string | null
          end_of_sync_period?: string | null
          object_type?: unknown | null
          headers_fetched?: number | null
          headers_fetch_successful?: boolean | null
          headers_fetch_error?: string | null
          backfill_downloads?: number | null
          backfill_download_successful?: boolean | null
          backfill_error?: string | null
          initiator?: unknown | null
        }
      }
      google_sync_settings: {
        Row: {
          user_id: string
          sync_start_date: string
          updated_at: string
          backfill_batch_size: number | null
        }
        Insert: {
          user_id?: string | null
          sync_start_date?: string | null
          updated_at?: string | null
          backfill_batch_size?: number | null
        }
        Update: {
          user_id?: string | null
          sync_start_date?: string | null
          updated_at?: string | null
          backfill_batch_size?: number | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      address_rows: "from" | "to" | "cc" | "bcc"
      initiators: "system" | "user"
      object_types: "event" | "email"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      action_steps: {
        Row: {
          item: string | null
          assignee: string | null
          item_status: unknown | null
          id: string
          assigned_date: string | null
          due_date: string | null
          completed_date: string | null
          people_id: string | null
          school_id: string | null
          charter_id: string | null
          is_archived: boolean | null
          guide_email_or_name: string | null
        }
        Insert: {
          item?: string | null
          assignee?: string | null
          item_status?: unknown | null
          id?: string | null
          assigned_date?: string | null
          due_date?: string | null
          completed_date?: string | null
          people_id?: string | null
          school_id?: string | null
          charter_id?: string | null
          is_archived?: boolean | null
          guide_email_or_name?: string | null
        }
        Update: {
          item?: string | null
          assignee?: string | null
          item_status?: unknown | null
          id?: string | null
          assigned_date?: string | null
          due_date?: string | null
          completed_date?: string | null
          people_id?: string | null
          school_id?: string | null
          charter_id?: string | null
          is_archived?: boolean | null
          guide_email_or_name?: string | null
        }
      }
      advice: {
        Row: {
          id: number
          created_at: string
          stage: unknown | null
          advice_giver_people_id: string | null
          school_id: string | null
          charter_id: string | null
          advice_requested_date: string | null
          advice_given_date: string | null
          advice_text: string | null
          advice_doc: string | null
          advice_loop_closed_date: string | null
        }
        Insert: {
          id?: number | null
          created_at?: string | null
          stage?: unknown | null
          advice_giver_people_id?: string | null
          school_id?: string | null
          charter_id?: string | null
          advice_requested_date?: string | null
          advice_given_date?: string | null
          advice_text?: string | null
          advice_doc?: string | null
          advice_loop_closed_date?: string | null
        }
        Update: {
          id?: number | null
          created_at?: string | null
          stage?: unknown | null
          advice_giver_people_id?: string | null
          school_id?: string | null
          charter_id?: string | null
          advice_requested_date?: string | null
          advice_given_date?: string | null
          advice_text?: string | null
          advice_doc?: string | null
          advice_loop_closed_date?: string | null
        }
      }
      annual_assessment_and_metrics_data: {
        Row: {
          school_year: string | null
          assessment_or_metric: string | null
          metric_data: string | null
          assessed_total: number | null
          assessed_bipoc: number | null
          assessed_frl: number | null
          assessed_ell: number | null
          assessed_sped: number | null
          met_plus_total: number | null
          met_plus_bipoc: number | null
          met_plus_frl: number | null
          met_plus_ell: number | null
          met_plus_sped: number | null
          id: string
          charter_id: string | null
          school_id: string | null
          data_docs_object_ids: unknown | null
          data_docs_public_urls: unknown | null
        }
        Insert: {
          school_year?: string | null
          assessment_or_metric?: string | null
          metric_data?: string | null
          assessed_total?: number | null
          assessed_bipoc?: number | null
          assessed_frl?: number | null
          assessed_ell?: number | null
          assessed_sped?: number | null
          met_plus_total?: number | null
          met_plus_bipoc?: number | null
          met_plus_frl?: number | null
          met_plus_ell?: number | null
          met_plus_sped?: number | null
          id?: string | null
          charter_id?: string | null
          school_id?: string | null
          data_docs_object_ids?: unknown | null
          data_docs_public_urls?: unknown | null
        }
        Update: {
          school_year?: string | null
          assessment_or_metric?: string | null
          metric_data?: string | null
          assessed_total?: number | null
          assessed_bipoc?: number | null
          assessed_frl?: number | null
          assessed_ell?: number | null
          assessed_sped?: number | null
          met_plus_total?: number | null
          met_plus_bipoc?: number | null
          met_plus_frl?: number | null
          met_plus_ell?: number | null
          met_plus_sped?: number | null
          id?: string | null
          charter_id?: string | null
          school_id?: string | null
          data_docs_object_ids?: unknown | null
          data_docs_public_urls?: unknown | null
        }
      }
      annual_enrollment_and_demographics: {
        Row: {
          school_year: string | null
          enrolled_students_total: number | null
          enrolled_frl: number | null
          enrolled_bipoc: number | null
          enrolled_ell: number | null
          enrolled_sped: number | null
          charter_id: string | null
          school_id: string | null
          id: string
        }
        Insert: {
          school_year?: string | null
          enrolled_students_total?: number | null
          enrolled_frl?: number | null
          enrolled_bipoc?: number | null
          enrolled_ell?: number | null
          enrolled_sped?: number | null
          charter_id?: string | null
          school_id?: string | null
          id?: string | null
        }
        Update: {
          school_year?: string | null
          enrolled_students_total?: number | null
          enrolled_frl?: number | null
          enrolled_bipoc?: number | null
          enrolled_ell?: number | null
          enrolled_sped?: number | null
          charter_id?: string | null
          school_id?: string | null
          id?: string | null
        }
      }
      charter_applications: {
        Row: {
          old_id: string | null
          target_open: string | null
          support_timeline: string | null
          app_window: string | null
          authorizor: string | null
          num_students: number | null
          beg_age: unknown | null
          end_age: unknown | null
          loi_required: boolean | null
          loi_deadline: string | null
          loi_submitted: boolean | null
          loi_object_ids: unknown | null
          odds_authorization: string | null
          odds_on_time_open: string | null
          charter_app_roles_set: boolean | null
          charter_app_pm_plan_complete: boolean | null
          logic_model_complete: boolean | null
          comm_engagement_underway: boolean | null
          nonprofit_status: string | null
          app_deadline: string | null
          app_submitted: boolean | null
          joint_kickoff_meeting_date: string | null
          internal_support_meeting_date: string | null
          app_walkthrough_date: string | null
          capacity_intv_training_complete: boolean | null
          capacity_intv_proj_date: string | null
          capacity_intv_completed_date: string | null
          auth_decision: unknown | null
          design_advice_session_complete: boolean | null
          board_membership_signed_date: string | null
          design_album_object_ids: unknown | null
          budget_exercises_object_ids: unknown | null
          budget_final_object_ids: unknown | null
          most_recent_app: boolean | null
          app_status: unknown | null
          team: string | null
          opps_challenges: string | null
          id: string
          charter_id: string | null
          decision_expected_date: string | null
          is_archived: boolean | null
          loi_public_urls: unknown | null
          design_album_public_urls: unknown | null
          budget_exercises_public_urls: unknown | null
          budget_final_public_urls: unknown | null
        }
        Insert: {
          old_id?: string | null
          target_open?: string | null
          support_timeline?: string | null
          app_window?: string | null
          authorizor?: string | null
          num_students?: number | null
          beg_age?: unknown | null
          end_age?: unknown | null
          loi_required?: boolean | null
          loi_deadline?: string | null
          loi_submitted?: boolean | null
          loi_object_ids?: unknown | null
          odds_authorization?: string | null
          odds_on_time_open?: string | null
          charter_app_roles_set?: boolean | null
          charter_app_pm_plan_complete?: boolean | null
          logic_model_complete?: boolean | null
          comm_engagement_underway?: boolean | null
          nonprofit_status?: string | null
          app_deadline?: string | null
          app_submitted?: boolean | null
          joint_kickoff_meeting_date?: string | null
          internal_support_meeting_date?: string | null
          app_walkthrough_date?: string | null
          capacity_intv_training_complete?: boolean | null
          capacity_intv_proj_date?: string | null
          capacity_intv_completed_date?: string | null
          auth_decision?: unknown | null
          design_advice_session_complete?: boolean | null
          board_membership_signed_date?: string | null
          design_album_object_ids?: unknown | null
          budget_exercises_object_ids?: unknown | null
          budget_final_object_ids?: unknown | null
          most_recent_app?: boolean | null
          app_status?: unknown | null
          team?: string | null
          opps_challenges?: string | null
          id?: string | null
          charter_id?: string | null
          decision_expected_date?: string | null
          is_archived?: boolean | null
          loi_public_urls?: unknown | null
          design_album_public_urls?: unknown | null
          budget_exercises_public_urls?: unknown | null
          budget_final_public_urls?: unknown | null
        }
        Update: {
          old_id?: string | null
          target_open?: string | null
          support_timeline?: string | null
          app_window?: string | null
          authorizor?: string | null
          num_students?: number | null
          beg_age?: unknown | null
          end_age?: unknown | null
          loi_required?: boolean | null
          loi_deadline?: string | null
          loi_submitted?: boolean | null
          loi_object_ids?: unknown | null
          odds_authorization?: string | null
          odds_on_time_open?: string | null
          charter_app_roles_set?: boolean | null
          charter_app_pm_plan_complete?: boolean | null
          logic_model_complete?: boolean | null
          comm_engagement_underway?: boolean | null
          nonprofit_status?: string | null
          app_deadline?: string | null
          app_submitted?: boolean | null
          joint_kickoff_meeting_date?: string | null
          internal_support_meeting_date?: string | null
          app_walkthrough_date?: string | null
          capacity_intv_training_complete?: boolean | null
          capacity_intv_proj_date?: string | null
          capacity_intv_completed_date?: string | null
          auth_decision?: unknown | null
          design_advice_session_complete?: boolean | null
          board_membership_signed_date?: string | null
          design_album_object_ids?: unknown | null
          budget_exercises_object_ids?: unknown | null
          budget_final_object_ids?: unknown | null
          most_recent_app?: boolean | null
          app_status?: unknown | null
          team?: string | null
          opps_challenges?: string | null
          id?: string | null
          charter_id?: string | null
          decision_expected_date?: string | null
          is_archived?: boolean | null
          loi_public_urls?: unknown | null
          design_album_public_urls?: unknown | null
          budget_exercises_public_urls?: unknown | null
          budget_final_public_urls?: unknown | null
        }
      }
      charter_authorization_actions: {
        Row: {
          id: string
          charter_id: string | null
          action: string | null
          authorized_after_action: boolean | null
          action_date: string | null
          authorizer: string | null
          is_archived: boolean | null
        }
        Insert: {
          id?: string | null
          charter_id?: string | null
          action?: string | null
          authorized_after_action?: boolean | null
          action_date?: string | null
          authorizer?: string | null
          is_archived?: boolean | null
        }
        Update: {
          id?: string | null
          charter_id?: string | null
          action?: string | null
          authorized_after_action?: boolean | null
          action_date?: string | null
          authorizer?: string | null
          is_archived?: boolean | null
        }
      }
      charter_authorizers: {
        Row: {
          authorizer_name: string
          active: boolean
          charter_id: string
          start_of_authorization: string | null
          is_archived: boolean | null
        }
        Insert: {
          authorizer_name?: string | null
          active?: boolean | null
          charter_id?: string | null
          start_of_authorization?: string | null
          is_archived?: boolean | null
        }
        Update: {
          authorizer_name?: string | null
          active?: boolean | null
          charter_id?: string | null
          start_of_authorization?: string | null
          is_archived?: boolean | null
        }
      }
      charters: {
        Row: {
          old_id: string
          short_name: string | null
          full_name: string | null
          initial_target_geo: string | null
          landscape_analysis_object_ids: unknown | null
          application: string | null
          non_tl_roles: string | null
          cohorts: unknown | null
          status: unknown | null
          ein: string | null
          incorp_date: string | null
          current_fy_end: unknown | null
          non_discrimination_policy_on_website: boolean | null
          school_provided_1023: boolean | null
          guidestar_listing_requested: boolean | null
          partnership_with_wf: string | null
          first_site_opened_date: string | null
          website: string | null
          nonprofit_status: boolean | null
          id: string
          initial_target_planes: unknown | null
          initial_authorizer: string | null
          initial_authorization: string | null
          membership_status: string | null
          group_exemption_status: unknown | null
          is_archived: boolean | null
          landscape_analysis_public_urls: unknown | null
          application_object_ids: unknown | null
          application_public_urls: unknown | null
        }
        Insert: {
          old_id?: string | null
          short_name?: string | null
          full_name?: string | null
          initial_target_geo?: string | null
          landscape_analysis_object_ids?: unknown | null
          application?: string | null
          non_tl_roles?: string | null
          cohorts?: unknown | null
          status?: unknown | null
          ein?: string | null
          incorp_date?: string | null
          current_fy_end?: unknown | null
          non_discrimination_policy_on_website?: boolean | null
          school_provided_1023?: boolean | null
          guidestar_listing_requested?: boolean | null
          partnership_with_wf?: string | null
          first_site_opened_date?: string | null
          website?: string | null
          nonprofit_status?: boolean | null
          id?: string | null
          initial_target_planes?: unknown | null
          initial_authorizer?: string | null
          initial_authorization?: string | null
          membership_status?: string | null
          group_exemption_status?: unknown | null
          is_archived?: boolean | null
          landscape_analysis_public_urls?: unknown | null
          application_object_ids?: unknown | null
          application_public_urls?: unknown | null
        }
        Update: {
          old_id?: string | null
          short_name?: string | null
          full_name?: string | null
          initial_target_geo?: string | null
          landscape_analysis_object_ids?: unknown | null
          application?: string | null
          non_tl_roles?: string | null
          cohorts?: unknown | null
          status?: unknown | null
          ein?: string | null
          incorp_date?: string | null
          current_fy_end?: unknown | null
          non_discrimination_policy_on_website?: boolean | null
          school_provided_1023?: boolean | null
          guidestar_listing_requested?: boolean | null
          partnership_with_wf?: string | null
          first_site_opened_date?: string | null
          website?: string | null
          nonprofit_status?: boolean | null
          id?: string | null
          initial_target_planes?: unknown | null
          initial_authorizer?: string | null
          initial_authorization?: string | null
          membership_status?: string | null
          group_exemption_status?: unknown | null
          is_archived?: boolean | null
          landscape_analysis_public_urls?: unknown | null
          application_object_ids?: unknown | null
          application_public_urls?: unknown | null
        }
      }
      cohort_participation: {
        Row: {
          id: string
          created_at: string
          people_id: string | null
          school_id: string | null
          charter_id: string | null
          cohort: string | null
          participation_status: string | null
          is_archived: boolean | null
        }
        Insert: {
          id?: string | null
          created_at?: string | null
          people_id?: string | null
          school_id?: string | null
          charter_id?: string | null
          cohort?: string | null
          participation_status?: string | null
          is_archived?: boolean | null
        }
        Update: {
          id?: string | null
          created_at?: string | null
          people_id?: string | null
          school_id?: string | null
          charter_id?: string | null
          cohort?: string | null
          participation_status?: string | null
          is_archived?: boolean | null
        }
      }
      cohorts: {
        Row: {
          cohort_type: string | null
          start_date: string | null
          cohort_title: string
          end_date: string | null
          is_active: boolean | null
        }
        Insert: {
          cohort_type?: string | null
          start_date?: string | null
          cohort_title?: string | null
          end_date?: string | null
          is_active?: boolean | null
        }
        Update: {
          cohort_type?: string | null
          start_date?: string | null
          cohort_title?: string | null
          end_date?: string | null
          is_active?: boolean | null
        }
      }
      details_associations: {
        Row: {
          people_id: string | null
          school_id: string | null
          charter_id: string | null
          id: string | null
          created_date: string | null
          start_date: string | null
          end_date: string | null
          role: string | null
          show_in_educator_grid: boolean | null
          show_in_board_tables: boolean | null
          is_active: boolean | null
          full_name: string | null
          has_montessori_cert: boolean | null
          race_ethnicity: unknown | null
          school_name: string | null
          stage_status: string | null
          membership_status: string | null
          projected_open: string | null
          ages_served: unknown | null
          governance_model: unknown | null
        }
        Insert: {
          people_id?: string | null
          school_id?: string | null
          charter_id?: string | null
          id?: string | null
          created_date?: string | null
          start_date?: string | null
          end_date?: string | null
          role?: string | null
          show_in_educator_grid?: boolean | null
          show_in_board_tables?: boolean | null
          is_active?: boolean | null
          full_name?: string | null
          has_montessori_cert?: boolean | null
          race_ethnicity?: unknown | null
          school_name?: string | null
          stage_status?: string | null
          membership_status?: string | null
          projected_open?: string | null
          ages_served?: unknown | null
          governance_model?: unknown | null
        }
        Update: {
          people_id?: string | null
          school_id?: string | null
          charter_id?: string | null
          id?: string | null
          created_date?: string | null
          start_date?: string | null
          end_date?: string | null
          role?: string | null
          show_in_educator_grid?: boolean | null
          show_in_board_tables?: boolean | null
          is_active?: boolean | null
          full_name?: string | null
          has_montessori_cert?: boolean | null
          race_ethnicity?: unknown | null
          school_name?: string | null
          stage_status?: string | null
          membership_status?: string | null
          projected_open?: string | null
          ages_served?: unknown | null
          governance_model?: unknown | null
        }
      }
      details_charters: {
        Row: {
          id: string | null
          short_name: string | null
          full_name: string | null
          initial_target_geo: string | null
          non_tl_roles: string | null
          status: unknown | null
          ein: string | null
          incorp_date: string | null
          current_fy_end: unknown | null
          non_discrimination_policy_on_website: boolean | null
          school_provided_1023: boolean | null
          guidestar_listing_requested: boolean | null
          partnership_with_wf: string | null
          first_site_opened_date: string | null
          website: string | null
          nonprofit_status: boolean | null
          initial_target_planes: unknown | null
          authorizer: string | null
          target_open: string | null
          support_timeline: string | null
          app_window: string | null
          authorizor: string | null
          num_students: number | null
          beg_age: unknown | null
          end_age: unknown | null
          loi_required: boolean | null
          loi_deadline: string | null
          loi_submitted: boolean | null
          odds_authorization: string | null
          odds_on_time_open: string | null
          charter_app_roles_set: boolean | null
          charter_app_pm_plan_complete: boolean | null
          logic_model_complete: boolean | null
          comm_engagement_underway: boolean | null
          app_deadline: string | null
          app_submitted: boolean | null
          joint_kickoff_meeting_date: string | null
          internal_support_meeting_date: string | null
          app_walkthrough_date: string | null
          capacity_intv_training_complete: boolean | null
          capacity_intv_proj_date: string | null
          capacity_intv_completed_date: string | null
          auth_decision: unknown | null
          design_advice_session_complete: boolean | null
          board_membership_signed_date: string | null
          most_recent_app: boolean | null
          app_status: unknown | null
          team: string | null
          opps_challenges: string | null
          decision_expected_date: string | null
          action_date: string | null
          action: string | null
          total_grants_issued: number | null
          total_loans_issued: number | null
          current_cohort: string | null
        }
        Insert: {
          id?: string | null
          short_name?: string | null
          full_name?: string | null
          initial_target_geo?: string | null
          non_tl_roles?: string | null
          status?: unknown | null
          ein?: string | null
          incorp_date?: string | null
          current_fy_end?: unknown | null
          non_discrimination_policy_on_website?: boolean | null
          school_provided_1023?: boolean | null
          guidestar_listing_requested?: boolean | null
          partnership_with_wf?: string | null
          first_site_opened_date?: string | null
          website?: string | null
          nonprofit_status?: boolean | null
          initial_target_planes?: unknown | null
          authorizer?: string | null
          target_open?: string | null
          support_timeline?: string | null
          app_window?: string | null
          authorizor?: string | null
          num_students?: number | null
          beg_age?: unknown | null
          end_age?: unknown | null
          loi_required?: boolean | null
          loi_deadline?: string | null
          loi_submitted?: boolean | null
          odds_authorization?: string | null
          odds_on_time_open?: string | null
          charter_app_roles_set?: boolean | null
          charter_app_pm_plan_complete?: boolean | null
          logic_model_complete?: boolean | null
          comm_engagement_underway?: boolean | null
          app_deadline?: string | null
          app_submitted?: boolean | null
          joint_kickoff_meeting_date?: string | null
          internal_support_meeting_date?: string | null
          app_walkthrough_date?: string | null
          capacity_intv_training_complete?: boolean | null
          capacity_intv_proj_date?: string | null
          capacity_intv_completed_date?: string | null
          auth_decision?: unknown | null
          design_advice_session_complete?: boolean | null
          board_membership_signed_date?: string | null
          most_recent_app?: boolean | null
          app_status?: unknown | null
          team?: string | null
          opps_challenges?: string | null
          decision_expected_date?: string | null
          action_date?: string | null
          action?: string | null
          total_grants_issued?: number | null
          total_loans_issued?: number | null
          current_cohort?: string | null
        }
        Update: {
          id?: string | null
          short_name?: string | null
          full_name?: string | null
          initial_target_geo?: string | null
          non_tl_roles?: string | null
          status?: unknown | null
          ein?: string | null
          incorp_date?: string | null
          current_fy_end?: unknown | null
          non_discrimination_policy_on_website?: boolean | null
          school_provided_1023?: boolean | null
          guidestar_listing_requested?: boolean | null
          partnership_with_wf?: string | null
          first_site_opened_date?: string | null
          website?: string | null
          nonprofit_status?: boolean | null
          initial_target_planes?: unknown | null
          authorizer?: string | null
          target_open?: string | null
          support_timeline?: string | null
          app_window?: string | null
          authorizor?: string | null
          num_students?: number | null
          beg_age?: unknown | null
          end_age?: unknown | null
          loi_required?: boolean | null
          loi_deadline?: string | null
          loi_submitted?: boolean | null
          odds_authorization?: string | null
          odds_on_time_open?: string | null
          charter_app_roles_set?: boolean | null
          charter_app_pm_plan_complete?: boolean | null
          logic_model_complete?: boolean | null
          comm_engagement_underway?: boolean | null
          app_deadline?: string | null
          app_submitted?: boolean | null
          joint_kickoff_meeting_date?: string | null
          internal_support_meeting_date?: string | null
          app_walkthrough_date?: string | null
          capacity_intv_training_complete?: boolean | null
          capacity_intv_proj_date?: string | null
          capacity_intv_completed_date?: string | null
          auth_decision?: unknown | null
          design_advice_session_complete?: boolean | null
          board_membership_signed_date?: string | null
          most_recent_app?: boolean | null
          app_status?: unknown | null
          team?: string | null
          opps_challenges?: string | null
          decision_expected_date?: string | null
          action_date?: string | null
          action?: string | null
          total_grants_issued?: number | null
          total_loans_issued?: number | null
          current_cohort?: string | null
        }
      }
      details_educators: {
        Row: {
          id: string | null
          full_name: string | null
          first_name: string | null
          nickname: string | null
          middle_name: string | null
          last_name: string | null
          primary_phone: string | null
          primary_phone_other_info: string | null
          secondary_phone: string | null
          secondary_phone_other_info: string | null
          home_address: string | null
          educ_attainment: unknown | null
          primary_languages: unknown | null
          other_languages: unknown | null
          race_ethnicity: unknown | null
          race_ethnicity_other: string | null
          gender: unknown | null
          gender_other: string | null
          hh_income: unknown | null
          childhood_income: unknown | null
          lgbtqia: boolean | null
          pronouns: unknown | null
          pronouns_other: string | null
          indiv_type: string | null
          exclude_from_email_logging: boolean | null
          montessori_certs: unknown | null
          discovery_status: unknown | null
          assigned_partner: string | null
          first_contact_ages: string | null
          first_contact_governance_model: string | null
          first_contact_interests: string | null
          first_contact_notes_on_pre_wf_employment: string | null
          first_contact_wf_employment_status: string | null
          first_contact_willingness_to_relocate: string | null
          target_geo_combined: string | null
          opsguide_checklist: string | null
          opsguide_fundraising_opps: string | null
          opsguide_meeting_prefs: string | null
          opsguide_request_pertinent_info: string | null
          opsguide_support_type_needed: string | null
          sendgrid_template_selected: string | null
          sendgrid_send_date: string | null
          routed_to: string | null
          assigned_partner_override: string | null
          person_responsible_for_follow_up: string | null
          one_on_one_scheduling_status: string | null
          personal_email_sent: boolean | null
          personal_email_sent_date: string | null
          current_role_at_active_school: string | null
          current_role: string | null
          active_school: string | null
          kanban_group: string | null
          primary_email: string | null
          most_recent_fillout_form_id: string | null
          most_recent_fillout_form_date: string | null
          most_recent_event_name: string | null
          most_recent_event_date: string | null
          most_recent_note_id: string | null
          most_recent_note: string | null
          most_recent_note_date: string | null
          most_recent_note_from: string | null
        }
        Insert: {
          id?: string | null
          full_name?: string | null
          first_name?: string | null
          nickname?: string | null
          middle_name?: string | null
          last_name?: string | null
          primary_phone?: string | null
          primary_phone_other_info?: string | null
          secondary_phone?: string | null
          secondary_phone_other_info?: string | null
          home_address?: string | null
          educ_attainment?: unknown | null
          primary_languages?: unknown | null
          other_languages?: unknown | null
          race_ethnicity?: unknown | null
          race_ethnicity_other?: string | null
          gender?: unknown | null
          gender_other?: string | null
          hh_income?: unknown | null
          childhood_income?: unknown | null
          lgbtqia?: boolean | null
          pronouns?: unknown | null
          pronouns_other?: string | null
          indiv_type?: string | null
          exclude_from_email_logging?: boolean | null
          montessori_certs?: unknown | null
          discovery_status?: unknown | null
          assigned_partner?: string | null
          first_contact_ages?: string | null
          first_contact_governance_model?: string | null
          first_contact_interests?: string | null
          first_contact_notes_on_pre_wf_employment?: string | null
          first_contact_wf_employment_status?: string | null
          first_contact_willingness_to_relocate?: string | null
          target_geo_combined?: string | null
          opsguide_checklist?: string | null
          opsguide_fundraising_opps?: string | null
          opsguide_meeting_prefs?: string | null
          opsguide_request_pertinent_info?: string | null
          opsguide_support_type_needed?: string | null
          sendgrid_template_selected?: string | null
          sendgrid_send_date?: string | null
          routed_to?: string | null
          assigned_partner_override?: string | null
          person_responsible_for_follow_up?: string | null
          one_on_one_scheduling_status?: string | null
          personal_email_sent?: boolean | null
          personal_email_sent_date?: string | null
          current_role_at_active_school?: string | null
          current_role?: string | null
          active_school?: string | null
          kanban_group?: string | null
          primary_email?: string | null
          most_recent_fillout_form_id?: string | null
          most_recent_fillout_form_date?: string | null
          most_recent_event_name?: string | null
          most_recent_event_date?: string | null
          most_recent_note_id?: string | null
          most_recent_note?: string | null
          most_recent_note_date?: string | null
          most_recent_note_from?: string | null
        }
        Update: {
          id?: string | null
          full_name?: string | null
          first_name?: string | null
          nickname?: string | null
          middle_name?: string | null
          last_name?: string | null
          primary_phone?: string | null
          primary_phone_other_info?: string | null
          secondary_phone?: string | null
          secondary_phone_other_info?: string | null
          home_address?: string | null
          educ_attainment?: unknown | null
          primary_languages?: unknown | null
          other_languages?: unknown | null
          race_ethnicity?: unknown | null
          race_ethnicity_other?: string | null
          gender?: unknown | null
          gender_other?: string | null
          hh_income?: unknown | null
          childhood_income?: unknown | null
          lgbtqia?: boolean | null
          pronouns?: unknown | null
          pronouns_other?: string | null
          indiv_type?: string | null
          exclude_from_email_logging?: boolean | null
          montessori_certs?: unknown | null
          discovery_status?: unknown | null
          assigned_partner?: string | null
          first_contact_ages?: string | null
          first_contact_governance_model?: string | null
          first_contact_interests?: string | null
          first_contact_notes_on_pre_wf_employment?: string | null
          first_contact_wf_employment_status?: string | null
          first_contact_willingness_to_relocate?: string | null
          target_geo_combined?: string | null
          opsguide_checklist?: string | null
          opsguide_fundraising_opps?: string | null
          opsguide_meeting_prefs?: string | null
          opsguide_request_pertinent_info?: string | null
          opsguide_support_type_needed?: string | null
          sendgrid_template_selected?: string | null
          sendgrid_send_date?: string | null
          routed_to?: string | null
          assigned_partner_override?: string | null
          person_responsible_for_follow_up?: string | null
          one_on_one_scheduling_status?: string | null
          personal_email_sent?: boolean | null
          personal_email_sent_date?: string | null
          current_role_at_active_school?: string | null
          current_role?: string | null
          active_school?: string | null
          kanban_group?: string | null
          primary_email?: string | null
          most_recent_fillout_form_id?: string | null
          most_recent_fillout_form_date?: string | null
          most_recent_event_name?: string | null
          most_recent_event_date?: string | null
          most_recent_note_id?: string | null
          most_recent_note?: string | null
          most_recent_note_date?: string | null
          most_recent_note_from?: string | null
        }
      }
      details_schools: {
        Row: {
          id: string | null
          long_name: string | null
          short_name: string | null
          status: unknown | null
          governance_model: unknown | null
          prior_names: string | null
          narrative: string | null
          institutional_partner: string | null
          ages_served: unknown | null
          school_calendar: unknown | null
          school_sched: unknown | null
          school_email: string | null
          email_domain: string | null
          school_phone: string | null
          facebook: string | null
          instagram: string | null
          website: string | null
          number_of_classrooms: number | null
          pod: string | null
          enrollment_at_full_capacity: string | null
          flexible_tuition_model: string | null
          ein: string | null
          legal_name: string | null
          about: string | null
          about_spanish: string | null
          risk_factors: string | null
          watchlist: string | null
          program_focus: string | null
          loan_report_name: string | null
          current_fy_end: string | null
          incorporation_date: string | null
          guidestar_listing_requested: boolean | null
          nondiscrimination_policy_on_application: boolean | null
          nondiscrimination_policy_on_website: boolean | null
          qbo_school_codes: string | null
          membership_termination_steps: string | null
          legal_structure: unknown | null
          open_date: string | null
          charter_id: string | null
          public_funding: unknown | null
          founding_tls: unknown | null
          on_national_website: unknown | null
          domain_name: unknown | null
          nonprofit_path: unknown | null
          nonprofit_status: boolean | null
          google_voice: unknown | null
          website_tool: unknown | null
          budget_utility: unknown | null
          transparent_classroom: unknown | null
          admissions_system: unknown | null
          tc_admissions: unknown | null
          tc_recordkeeping: unknown | null
          gusto: unknown | null
          qbo: unknown | null
          business_insurance: unknown | null
          bill_account: string | null
          google_workspace_org_unit_path: string | null
          budget_link: string | null
          bookkeeper_or_accountant: string | null
          ssj_target_city: string | null
          ssj_target_state: unknown | null
          entered_visioning_date: string | null
          entered_planning_date: string | null
          entered_startup_date: string | null
          ssj_stage: unknown | null
          ssj_readiness_to_open_rating: unknown | null
          ssj_name_reserved: boolean | null
          ssj_has_partner: unknown | null
          ssj_board_development: unknown | null
          ssj_facility: unknown | null
          ssj_on_track_for_enrollment: unknown | null
          ssj_budget_ready_for_next_steps: unknown | null
          ssj_seeking_wf_funding: unknown | null
          ssj_advice_givers_tls: string | null
          ssj_advice_givers_partners: string | null
          ssj_fundraising_narrative: string | null
          ssj_pathway_to_funding: unknown | null
          ssj_total_startup_funding_needed: string | null
          ssj_loan_eligibility: string | null
          ssj_loan_approved_amt: string | null
          ssj_amount_raised: string | null
          ssj_gap_in_funding: string | null
          ssj_date_shared_with_n4g: string | null
          ssj_proj_open_school_year: string | null
          ssj_tool: unknown | null
          ssj_building4good_status: unknown | null
          building4good_firm_and_attorney: string | null
          visioning_album_complete: string | null
          logo_designer: unknown | null
          name_selection_proposal: string | null
          trademark_filed: boolean | null
          physical_address: string | null
          physical_lat: number | null
          physical_long: number | null
          mailing_address: string | null
          current_tls: string | null
          current_tls_race_ethnicity: unknown | null
          wf_tls_on_board: string | null
          current_cohort: string | null
          current_guide_name: string | null
          total_grants_issued: number | null
          total_loans_issued: number | null
          logo: string | null
          logo_square: string | null
          logo_rectangle: string | null
          logo_flower_only: string | null
          logo_full_url: string | null
          logo_square_full_url: string | null
          logo_rectangle_full_url: string | null
          logo_flower_only_full_url: string | null
        }
        Insert: {
          id?: string | null
          long_name?: string | null
          short_name?: string | null
          status?: unknown | null
          governance_model?: unknown | null
          prior_names?: string | null
          narrative?: string | null
          institutional_partner?: string | null
          ages_served?: unknown | null
          school_calendar?: unknown | null
          school_sched?: unknown | null
          school_email?: string | null
          email_domain?: string | null
          school_phone?: string | null
          facebook?: string | null
          instagram?: string | null
          website?: string | null
          number_of_classrooms?: number | null
          pod?: string | null
          enrollment_at_full_capacity?: string | null
          flexible_tuition_model?: string | null
          ein?: string | null
          legal_name?: string | null
          about?: string | null
          about_spanish?: string | null
          risk_factors?: string | null
          watchlist?: string | null
          program_focus?: string | null
          loan_report_name?: string | null
          current_fy_end?: string | null
          incorporation_date?: string | null
          guidestar_listing_requested?: boolean | null
          nondiscrimination_policy_on_application?: boolean | null
          nondiscrimination_policy_on_website?: boolean | null
          qbo_school_codes?: string | null
          membership_termination_steps?: string | null
          legal_structure?: unknown | null
          open_date?: string | null
          charter_id?: string | null
          public_funding?: unknown | null
          founding_tls?: unknown | null
          on_national_website?: unknown | null
          domain_name?: unknown | null
          nonprofit_path?: unknown | null
          nonprofit_status?: boolean | null
          google_voice?: unknown | null
          website_tool?: unknown | null
          budget_utility?: unknown | null
          transparent_classroom?: unknown | null
          admissions_system?: unknown | null
          tc_admissions?: unknown | null
          tc_recordkeeping?: unknown | null
          gusto?: unknown | null
          qbo?: unknown | null
          business_insurance?: unknown | null
          bill_account?: string | null
          google_workspace_org_unit_path?: string | null
          budget_link?: string | null
          bookkeeper_or_accountant?: string | null
          ssj_target_city?: string | null
          ssj_target_state?: unknown | null
          entered_visioning_date?: string | null
          entered_planning_date?: string | null
          entered_startup_date?: string | null
          ssj_stage?: unknown | null
          ssj_readiness_to_open_rating?: unknown | null
          ssj_name_reserved?: boolean | null
          ssj_has_partner?: unknown | null
          ssj_board_development?: unknown | null
          ssj_facility?: unknown | null
          ssj_on_track_for_enrollment?: unknown | null
          ssj_budget_ready_for_next_steps?: unknown | null
          ssj_seeking_wf_funding?: unknown | null
          ssj_advice_givers_tls?: string | null
          ssj_advice_givers_partners?: string | null
          ssj_fundraising_narrative?: string | null
          ssj_pathway_to_funding?: unknown | null
          ssj_total_startup_funding_needed?: string | null
          ssj_loan_eligibility?: string | null
          ssj_loan_approved_amt?: string | null
          ssj_amount_raised?: string | null
          ssj_gap_in_funding?: string | null
          ssj_date_shared_with_n4g?: string | null
          ssj_proj_open_school_year?: string | null
          ssj_tool?: unknown | null
          ssj_building4good_status?: unknown | null
          building4good_firm_and_attorney?: string | null
          visioning_album_complete?: string | null
          logo_designer?: unknown | null
          name_selection_proposal?: string | null
          trademark_filed?: boolean | null
          physical_address?: string | null
          physical_lat?: number | null
          physical_long?: number | null
          mailing_address?: string | null
          current_tls?: string | null
          current_tls_race_ethnicity?: unknown | null
          wf_tls_on_board?: string | null
          current_cohort?: string | null
          current_guide_name?: string | null
          total_grants_issued?: number | null
          total_loans_issued?: number | null
          logo?: string | null
          logo_square?: string | null
          logo_rectangle?: string | null
          logo_flower_only?: string | null
          logo_full_url?: string | null
          logo_square_full_url?: string | null
          logo_rectangle_full_url?: string | null
          logo_flower_only_full_url?: string | null
        }
        Update: {
          id?: string | null
          long_name?: string | null
          short_name?: string | null
          status?: unknown | null
          governance_model?: unknown | null
          prior_names?: string | null
          narrative?: string | null
          institutional_partner?: string | null
          ages_served?: unknown | null
          school_calendar?: unknown | null
          school_sched?: unknown | null
          school_email?: string | null
          email_domain?: string | null
          school_phone?: string | null
          facebook?: string | null
          instagram?: string | null
          website?: string | null
          number_of_classrooms?: number | null
          pod?: string | null
          enrollment_at_full_capacity?: string | null
          flexible_tuition_model?: string | null
          ein?: string | null
          legal_name?: string | null
          about?: string | null
          about_spanish?: string | null
          risk_factors?: string | null
          watchlist?: string | null
          program_focus?: string | null
          loan_report_name?: string | null
          current_fy_end?: string | null
          incorporation_date?: string | null
          guidestar_listing_requested?: boolean | null
          nondiscrimination_policy_on_application?: boolean | null
          nondiscrimination_policy_on_website?: boolean | null
          qbo_school_codes?: string | null
          membership_termination_steps?: string | null
          legal_structure?: unknown | null
          open_date?: string | null
          charter_id?: string | null
          public_funding?: unknown | null
          founding_tls?: unknown | null
          on_national_website?: unknown | null
          domain_name?: unknown | null
          nonprofit_path?: unknown | null
          nonprofit_status?: boolean | null
          google_voice?: unknown | null
          website_tool?: unknown | null
          budget_utility?: unknown | null
          transparent_classroom?: unknown | null
          admissions_system?: unknown | null
          tc_admissions?: unknown | null
          tc_recordkeeping?: unknown | null
          gusto?: unknown | null
          qbo?: unknown | null
          business_insurance?: unknown | null
          bill_account?: string | null
          google_workspace_org_unit_path?: string | null
          budget_link?: string | null
          bookkeeper_or_accountant?: string | null
          ssj_target_city?: string | null
          ssj_target_state?: unknown | null
          entered_visioning_date?: string | null
          entered_planning_date?: string | null
          entered_startup_date?: string | null
          ssj_stage?: unknown | null
          ssj_readiness_to_open_rating?: unknown | null
          ssj_name_reserved?: boolean | null
          ssj_has_partner?: unknown | null
          ssj_board_development?: unknown | null
          ssj_facility?: unknown | null
          ssj_on_track_for_enrollment?: unknown | null
          ssj_budget_ready_for_next_steps?: unknown | null
          ssj_seeking_wf_funding?: unknown | null
          ssj_advice_givers_tls?: string | null
          ssj_advice_givers_partners?: string | null
          ssj_fundraising_narrative?: string | null
          ssj_pathway_to_funding?: unknown | null
          ssj_total_startup_funding_needed?: string | null
          ssj_loan_eligibility?: string | null
          ssj_loan_approved_amt?: string | null
          ssj_amount_raised?: string | null
          ssj_gap_in_funding?: string | null
          ssj_date_shared_with_n4g?: string | null
          ssj_proj_open_school_year?: string | null
          ssj_tool?: unknown | null
          ssj_building4good_status?: unknown | null
          building4good_firm_and_attorney?: string | null
          visioning_album_complete?: string | null
          logo_designer?: unknown | null
          name_selection_proposal?: string | null
          trademark_filed?: boolean | null
          physical_address?: string | null
          physical_lat?: number | null
          physical_long?: number | null
          mailing_address?: string | null
          current_tls?: string | null
          current_tls_race_ethnicity?: unknown | null
          wf_tls_on_board?: string | null
          current_cohort?: string | null
          current_guide_name?: string | null
          total_grants_issued?: number | null
          total_loans_issued?: number | null
          logo?: string | null
          logo_square?: string | null
          logo_rectangle?: string | null
          logo_flower_only?: string | null
          logo_full_url?: string | null
          logo_square_full_url?: string | null
          logo_rectangle_full_url?: string | null
          logo_flower_only_full_url?: string | null
        }
      }
      developer_notes: {
        Row: {
          id: number
          created_at: string
          created_by: string | null
          notes_type: unknown | null
          focus_area: string | null
          comment: string | null
          user_priority: unknown | null
          developer_target_fix_date: string | null
          status: unknown | null
          screenshot_link: string | null
          logs: string | null
        }
        Insert: {
          id?: number | null
          created_at?: string | null
          created_by?: string | null
          notes_type?: unknown | null
          focus_area?: string | null
          comment?: string | null
          user_priority?: unknown | null
          developer_target_fix_date?: string | null
          status?: unknown | null
          screenshot_link?: string | null
          logs?: string | null
        }
        Update: {
          id?: number | null
          created_at?: string | null
          created_by?: string | null
          notes_type?: unknown | null
          focus_area?: string | null
          comment?: string | null
          user_priority?: unknown | null
          developer_target_fix_date?: string | null
          status?: unknown | null
          screenshot_link?: string | null
          logs?: string | null
        }
      }
      document_checklist: {
        Row: {
          document_name: string
          required_by: string | null
          order_within_group: number | null
          group: string | null
        }
        Insert: {
          document_name?: string | null
          required_by?: string | null
          order_within_group?: number | null
          group?: string | null
        }
        Update: {
          document_name?: string | null
          required_by?: string | null
          order_within_group?: number | null
          group?: string | null
        }
      }
      email_addresses: {
        Row: {
          id: string
          created_at: string
          people_id: string | null
          email_address: string
          category: unknown | null
          is_primary: boolean | null
          is_valid: boolean
          is_archived: boolean | null
          people_roles_associations_id: string | null
        }
        Insert: {
          id?: string | null
          created_at?: string | null
          people_id?: string | null
          email_address?: string | null
          category?: unknown | null
          is_primary?: boolean | null
          is_valid?: boolean | null
          is_archived?: boolean | null
          people_roles_associations_id?: string | null
        }
        Update: {
          id?: string | null
          created_at?: string | null
          people_id?: string | null
          email_address?: string | null
          category?: unknown | null
          is_primary?: boolean | null
          is_valid?: boolean | null
          is_archived?: boolean | null
          people_roles_associations_id?: string | null
        }
      }
      email_drafts: {
        Row: {
          id: string
          user_id: string
          to_emails: unknown | null
          cc_emails: unknown | null
          bcc_emails: unknown | null
          subject: string | null
          body: string | null
          updated_at: string
          sent: boolean | null
          sent_at: string | null
          is_archived: boolean | null
        }
        Insert: {
          id?: string | null
          user_id?: string | null
          to_emails?: unknown | null
          cc_emails?: unknown | null
          bcc_emails?: unknown | null
          subject?: string | null
          body?: string | null
          updated_at?: string | null
          sent?: boolean | null
          sent_at?: string | null
          is_archived?: boolean | null
        }
        Update: {
          id?: string | null
          user_id?: string | null
          to_emails?: unknown | null
          cc_emails?: unknown | null
          bcc_emails?: unknown | null
          subject?: string | null
          body?: string | null
          updated_at?: string | null
          sent?: boolean | null
          sent_at?: string | null
          is_archived?: boolean | null
        }
      }
      errors: {
        Row: {
          id: number
          created_at: string
          people_id: string | null
          school_id: string | null
          charter_id: string | null
          error_type: string | null
          resolved_datetime: string | null
        }
        Insert: {
          id?: number | null
          created_at?: string | null
          people_id?: string | null
          school_id?: string | null
          charter_id?: string | null
          error_type?: string | null
          resolved_datetime?: string | null
        }
        Update: {
          id?: number | null
          created_at?: string | null
          people_id?: string | null
          school_id?: string | null
          charter_id?: string | null
          error_type?: string | null
          resolved_datetime?: string | null
        }
      }
      event_attendance: {
        Row: {
          id: string
          people_id: string | null
          registration_date: string | null
          attended_event: boolean | null
          duration_at_event_in_minutes: number | null
          spanish_translation_needed: boolean | null
          event_name: string | null
          is_archived: boolean | null
        }
        Insert: {
          id?: string | null
          people_id?: string | null
          registration_date?: string | null
          attended_event?: boolean | null
          duration_at_event_in_minutes?: number | null
          spanish_translation_needed?: boolean | null
          event_name?: string | null
          is_archived?: boolean | null
        }
        Update: {
          id?: string | null
          people_id?: string | null
          registration_date?: string | null
          attended_event?: boolean | null
          duration_at_event_in_minutes?: number | null
          spanish_translation_needed?: boolean | null
          event_name?: string | null
          is_archived?: boolean | null
        }
      }
      event_list: {
        Row: {
          event_name: string
          event_date: string | null
          type: string | null
          is_archived: boolean | null
        }
        Insert: {
          event_name?: string | null
          event_date?: string | null
          type?: string | null
          is_archived?: boolean | null
        }
        Update: {
          event_name?: string | null
          event_date?: string | null
          type?: string | null
          is_archived?: boolean | null
        }
      }
      governance_docs: {
        Row: {
          doc_type: string | null
          id: string
          school_id: string | null
          charter_id: string | null
          is_archived: boolean | null
          upload_date: string | null
          governance_doc_public_urls: unknown | null
          governance_doc_object_ids: unknown | null
        }
        Insert: {
          doc_type?: string | null
          id?: string | null
          school_id?: string | null
          charter_id?: string | null
          is_archived?: boolean | null
          upload_date?: string | null
          governance_doc_public_urls?: unknown | null
          governance_doc_object_ids?: unknown | null
        }
        Update: {
          doc_type?: string | null
          id?: string | null
          school_id?: string | null
          charter_id?: string | null
          is_archived?: boolean | null
          upload_date?: string | null
          governance_doc_public_urls?: unknown | null
          governance_doc_object_ids?: unknown | null
        }
      }
      grants: {
        Row: {
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
          automation_step_trigger: unknown | null
          prelim_advice_request_timestamp: string | null
          full_advice_request_timestamp: string | null
          end_of_full_advice_window: string | null
          unsigned_grant_agreement_object_ids: unknown | null
          signed_grant_agreement_object_ids: unknown | null
          grant_advice: string | null
          id: string
          school_id: string | null
          charter_id: string | null
          people_id: string | null
          is_archived: boolean | null
          old_school_id: string | null
          signed_grant_agreement_public_urls: unknown | null
          unsigned_grant_agreement_public_urls: unknown | null
        }
        Insert: {
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
          automation_step_trigger?: unknown | null
          prelim_advice_request_timestamp?: string | null
          full_advice_request_timestamp?: string | null
          end_of_full_advice_window?: string | null
          unsigned_grant_agreement_object_ids?: unknown | null
          signed_grant_agreement_object_ids?: unknown | null
          grant_advice?: string | null
          id?: string | null
          school_id?: string | null
          charter_id?: string | null
          people_id?: string | null
          is_archived?: boolean | null
          old_school_id?: string | null
          signed_grant_agreement_public_urls?: unknown | null
          unsigned_grant_agreement_public_urls?: unknown | null
        }
        Update: {
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
          automation_step_trigger?: unknown | null
          prelim_advice_request_timestamp?: string | null
          full_advice_request_timestamp?: string | null
          end_of_full_advice_window?: string | null
          unsigned_grant_agreement_object_ids?: unknown | null
          signed_grant_agreement_object_ids?: unknown | null
          grant_advice?: string | null
          id?: string | null
          school_id?: string | null
          charter_id?: string | null
          people_id?: string | null
          is_archived?: boolean | null
          old_school_id?: string | null
          signed_grant_agreement_public_urls?: unknown | null
          unsigned_grant_agreement_public_urls?: unknown | null
        }
      }
      grid_charter: {
        Row: {
          id: string | null
          charter_name: string | null
          status: unknown | null
          non_tl_roles: string | null
          initial_target_geo: string | null
          initial_target_planes: unknown | null
          schools: unknown | null
          active_guides: unknown | null
        }
        Insert: {
          id?: string | null
          charter_name?: string | null
          status?: unknown | null
          non_tl_roles?: string | null
          initial_target_geo?: string | null
          initial_target_planes?: unknown | null
          schools?: unknown | null
          active_guides?: unknown | null
        }
        Update: {
          id?: string | null
          charter_name?: string | null
          status?: unknown | null
          non_tl_roles?: string | null
          initial_target_geo?: string | null
          initial_target_planes?: unknown | null
          schools?: unknown | null
          active_guides?: unknown | null
        }
      }
      grid_educator: {
        Row: {
          id: string | null
          full_name: string | null
          current_role_at_active_school: string | null
          current_role: string | null
          active_school: string | null
          active_school_id: string | null
          has_montessori_cert: boolean | null
          race_ethnicity: unknown | null
          discovery_status: unknown | null
          indiv_type: string | null
          assigned_partner: string | null
          assigned_partner_override: string | null
          kanban_group: string | null
        }
        Insert: {
          id?: string | null
          full_name?: string | null
          current_role_at_active_school?: string | null
          current_role?: string | null
          active_school?: string | null
          active_school_id?: string | null
          has_montessori_cert?: boolean | null
          race_ethnicity?: unknown | null
          discovery_status?: unknown | null
          indiv_type?: string | null
          assigned_partner?: string | null
          assigned_partner_override?: string | null
          kanban_group?: string | null
        }
        Update: {
          id?: string | null
          full_name?: string | null
          current_role_at_active_school?: string | null
          current_role?: string | null
          active_school?: string | null
          active_school_id?: string | null
          has_montessori_cert?: boolean | null
          race_ethnicity?: unknown | null
          discovery_status?: unknown | null
          indiv_type?: string | null
          assigned_partner?: string | null
          assigned_partner_override?: string | null
          kanban_group?: string | null
        }
      }
      grid_school: {
        Row: {
          id: string | null
          school_name: string | null
          stage_status: string | null
          current_tls: string | null
          people_id: unknown | null
          current_tl_pairs: Json | null
          current_tls_race_ethnicity: unknown | null
          membership_status: string | null
          open: string | null
          ages_served_rev: unknown | null
          governance_model: unknown | null
          active_guides: unknown | null
        }
        Insert: {
          id?: string | null
          school_name?: string | null
          stage_status?: string | null
          current_tls?: string | null
          people_id?: unknown | null
          current_tl_pairs?: Json | null
          current_tls_race_ethnicity?: unknown | null
          membership_status?: string | null
          open?: string | null
          ages_served_rev?: unknown | null
          governance_model?: unknown | null
          active_guides?: unknown | null
        }
        Update: {
          id?: string | null
          school_name?: string | null
          stage_status?: string | null
          current_tls?: string | null
          people_id?: unknown | null
          current_tl_pairs?: Json | null
          current_tls_race_ethnicity?: unknown | null
          membership_status?: string | null
          open?: string | null
          ages_served_rev?: unknown | null
          governance_model?: unknown | null
          active_guides?: unknown | null
        }
      }
      group_exemption_actions: {
        Row: {
          id: string
          created_at: string
          action_date: string | null
          action: string | null
          group_exemption_status_after_action: unknown | null
          notes: string | null
          school_id: string | null
          charter_id: string | null
        }
        Insert: {
          id?: string | null
          created_at?: string | null
          action_date?: string | null
          action?: string | null
          group_exemption_status_after_action?: unknown | null
          notes?: string | null
          school_id?: string | null
          charter_id?: string | null
        }
        Update: {
          id?: string | null
          created_at?: string | null
          action_date?: string | null
          action?: string | null
          group_exemption_status_after_action?: unknown | null
          notes?: string | null
          school_id?: string | null
          charter_id?: string | null
        }
      }
      guide_assignments: {
        Row: {
          old_id: string
          start_date: string | null
          end_date: string | null
          type: unknown | null
          is_active: boolean | null
          guide_id: string | null
          id: string
          school_id: string | null
          charter_id: string | null
          email_or_name: string | null
          is_archived: boolean | null
        }
        Insert: {
          old_id?: string | null
          start_date?: string | null
          end_date?: string | null
          type?: unknown | null
          is_active?: boolean | null
          guide_id?: string | null
          id?: string | null
          school_id?: string | null
          charter_id?: string | null
          email_or_name?: string | null
          is_archived?: boolean | null
        }
        Update: {
          old_id?: string | null
          start_date?: string | null
          end_date?: string | null
          type?: unknown | null
          is_active?: boolean | null
          guide_id?: string | null
          id?: string | null
          school_id?: string | null
          charter_id?: string | null
          email_or_name?: string | null
          is_archived?: boolean | null
        }
      }
      guides: {
        Row: {
          email_or_name: string
          old_id: string | null
          email: string | null
          is_active: boolean | null
          phone: string | null
          home_address: string | null
          birthdate: string | null
          image_url: string | null
          full_name: string | null
          short_name: string | null
          partner_roles: unknown | null
          is_archived: boolean | null
        }
        Insert: {
          email_or_name?: string | null
          old_id?: string | null
          email?: string | null
          is_active?: boolean | null
          phone?: string | null
          home_address?: string | null
          birthdate?: string | null
          image_url?: string | null
          full_name?: string | null
          short_name?: string | null
          partner_roles?: unknown | null
          is_archived?: boolean | null
        }
        Update: {
          email_or_name?: string | null
          old_id?: string | null
          email?: string | null
          is_active?: boolean | null
          phone?: string | null
          home_address?: string | null
          birthdate?: string | null
          image_url?: string | null
          full_name?: string | null
          short_name?: string | null
          partner_roles?: unknown | null
          is_archived?: boolean | null
        }
      }
      lead_routing_and_templates: {
        Row: {
          rule: string
          sendgrid_template_id: string | null
          language: string | null
          indiv_type: string | null
          us_or_intl: string | null
          geo_type: string | null
          states: string | null
          source: string | null
          growth_lead: string | null
          sender: string | null
          cc: string | null
          indiv_type_array: unknown | null
          language_array: unknown | null
          states_array: unknown | null
          us_or_intl_array: unknown | null
          is_archived: boolean | null
        }
        Insert: {
          rule?: string | null
          sendgrid_template_id?: string | null
          language?: string | null
          indiv_type?: string | null
          us_or_intl?: string | null
          geo_type?: string | null
          states?: string | null
          source?: string | null
          growth_lead?: string | null
          sender?: string | null
          cc?: string | null
          indiv_type_array?: unknown | null
          language_array?: unknown | null
          states_array?: unknown | null
          us_or_intl_array?: unknown | null
          is_archived?: boolean | null
        }
        Update: {
          rule?: string | null
          sendgrid_template_id?: string | null
          language?: string | null
          indiv_type?: string | null
          us_or_intl?: string | null
          geo_type?: string | null
          states?: string | null
          source?: string | null
          growth_lead?: string | null
          sender?: string | null
          cc?: string | null
          indiv_type_array?: unknown | null
          language_array?: unknown | null
          states_array?: unknown | null
          us_or_intl_array?: unknown | null
          is_archived?: boolean | null
        }
      }
      loans: {
        Row: {
          "Loan Key": string | null
          old_id: string | null
          amount_issued: number | null
          issue_date: string | null
          loan_status: unknown | null
          loan_docs_object_ids: unknown | null
          notes: string | null
          maturity: string | null
          interest_rate: number | null
          use_of_proceeds: unknown | null
          vehicle: unknown | null
          school_id: string | null
          id: string
          charter_id: string | null
          is_archived: boolean | null
          loan_docs_public_urls: unknown | null
        }
        Insert: {
          "Loan Key"?: string | null
          old_id?: string | null
          amount_issued?: number | null
          issue_date?: string | null
          loan_status?: unknown | null
          loan_docs_object_ids?: unknown | null
          notes?: string | null
          maturity?: string | null
          interest_rate?: number | null
          use_of_proceeds?: unknown | null
          vehicle?: unknown | null
          school_id?: string | null
          id?: string | null
          charter_id?: string | null
          is_archived?: boolean | null
          loan_docs_public_urls?: unknown | null
        }
        Update: {
          "Loan Key"?: string | null
          old_id?: string | null
          amount_issued?: number | null
          issue_date?: string | null
          loan_status?: unknown | null
          loan_docs_object_ids?: unknown | null
          notes?: string | null
          maturity?: string | null
          interest_rate?: number | null
          use_of_proceeds?: unknown | null
          vehicle?: unknown | null
          school_id?: string | null
          id?: string | null
          charter_id?: string | null
          is_archived?: boolean | null
          loan_docs_public_urls?: unknown | null
        }
      }
      locations: {
        Row: {
          charter_id: string | null
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
          lease_end_date: string | null
          id: string
          school_id: string | null
          mailable: boolean | null
          physical: boolean | null
          is_archived: boolean | null
          lease_object_ids: unknown | null
          lease_public_urls: unknown | null
        }
        Insert: {
          charter_id?: string | null
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
          lease_end_date?: string | null
          id?: string | null
          school_id?: string | null
          mailable?: boolean | null
          physical?: boolean | null
          is_archived?: boolean | null
          lease_object_ids?: unknown | null
          lease_public_urls?: unknown | null
        }
        Update: {
          charter_id?: string | null
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
          lease_end_date?: string | null
          id?: string | null
          school_id?: string | null
          mailable?: boolean | null
          physical?: boolean | null
          is_archived?: boolean | null
          lease_object_ids?: unknown | null
          lease_public_urls?: unknown | null
        }
      }
      logo_urls_by_school: {
        Row: {
          school_id: string | null
          short_name: string | null
          logo: string | null
          logo_square: string | null
          logo_rectangle: string | null
          logo_flower_only: string | null
          logo_full_url: string | null
          logo_square_full_url: string | null
          logo_rectangle_full_url: string | null
          logo_flower_only_full_url: string | null
        }
        Insert: {
          school_id?: string | null
          short_name?: string | null
          logo?: string | null
          logo_square?: string | null
          logo_rectangle?: string | null
          logo_flower_only?: string | null
          logo_full_url?: string | null
          logo_square_full_url?: string | null
          logo_rectangle_full_url?: string | null
          logo_flower_only_full_url?: string | null
        }
        Update: {
          school_id?: string | null
          short_name?: string | null
          logo?: string | null
          logo_square?: string | null
          logo_rectangle?: string | null
          logo_flower_only?: string | null
          logo_full_url?: string | null
          logo_square_full_url?: string | null
          logo_rectangle_full_url?: string | null
          logo_flower_only_full_url?: string | null
        }
      }
      mailing_lists: {
        Row: {
          sub_name: string
          name: string | null
          slug: string | null
          type: string | null
          google_group_id: string
          is_archived: boolean | null
        }
        Insert: {
          sub_name?: string | null
          name?: string | null
          slug?: string | null
          type?: string | null
          google_group_id?: string | null
          is_archived?: boolean | null
        }
        Update: {
          sub_name?: string | null
          name?: string | null
          slug?: string | null
          type?: string | null
          google_group_id?: string | null
          is_archived?: boolean | null
        }
      }
      membership_actions: {
        Row: {
          id: string
          action_date: string | null
          action: unknown | null
          membership_status_after_action: string | null
          school_id: string | null
          attachments: string | null
          notes: string | null
          agreement_version: string | null
          charter_id: string | null
          created_at: string | null
          is_archived: boolean | null
        }
        Insert: {
          id?: string | null
          action_date?: string | null
          action?: unknown | null
          membership_status_after_action?: string | null
          school_id?: string | null
          attachments?: string | null
          notes?: string | null
          agreement_version?: string | null
          charter_id?: string | null
          created_at?: string | null
          is_archived?: boolean | null
        }
        Update: {
          id?: string | null
          action_date?: string | null
          action?: unknown | null
          membership_status_after_action?: string | null
          school_id?: string | null
          attachments?: string | null
          notes?: string | null
          agreement_version?: string | null
          charter_id?: string | null
          created_at?: string | null
          is_archived?: boolean | null
        }
      }
      montessori_certs: {
        Row: {
          year: string | null
          training_center: string | null
          trainer: string | null
          association: unknown | null
          macte_accredited: boolean | null
          cert_completion_status: unknown | null
          created_date: string | null
          admin_credential: boolean | null
          assistant_training: boolean | null
          people_id: string | null
          id: string
          is_archived: boolean | null
          cert_level: unknown | null
        }
        Insert: {
          year?: string | null
          training_center?: string | null
          trainer?: string | null
          association?: unknown | null
          macte_accredited?: boolean | null
          cert_completion_status?: unknown | null
          created_date?: string | null
          admin_credential?: boolean | null
          assistant_training?: boolean | null
          people_id?: string | null
          id?: string | null
          is_archived?: boolean | null
          cert_level?: unknown | null
        }
        Update: {
          year?: string | null
          training_center?: string | null
          trainer?: string | null
          association?: unknown | null
          macte_accredited?: boolean | null
          cert_completion_status?: unknown | null
          created_date?: string | null
          admin_credential?: boolean | null
          assistant_training?: boolean | null
          people_id?: string | null
          id?: string | null
          is_archived?: boolean | null
          cert_level?: unknown | null
        }
      }
      nine_nineties: {
        Row: {
          form_year: string | null
          notes: string | null
          ai_derived_revenue: string | null
          ai_derived_EOY: string | null
          id: string
          school_id: string | null
          charter_id: string | null
          is_archived: boolean | null
          nine_nineties_public_urls: unknown | null
          nine_nineties_object_ids: unknown | null
        }
        Insert: {
          form_year?: string | null
          notes?: string | null
          ai_derived_revenue?: string | null
          ai_derived_EOY?: string | null
          id?: string | null
          school_id?: string | null
          charter_id?: string | null
          is_archived?: boolean | null
          nine_nineties_public_urls?: unknown | null
          nine_nineties_object_ids?: unknown | null
        }
        Update: {
          form_year?: string | null
          notes?: string | null
          ai_derived_revenue?: string | null
          ai_derived_EOY?: string | null
          id?: string | null
          school_id?: string | null
          charter_id?: string | null
          is_archived?: boolean | null
          nine_nineties_public_urls?: unknown | null
          nine_nineties_object_ids?: unknown | null
        }
      }
      notes: {
        Row: {
          title: string | null
          created_date: string | null
          created_by: string | null
          is_private: boolean | null
          id: string
          school_id: string | null
          people_id: string | null
          charter_id: string | null
          action_step_id: string | null
          charter_application_id: string | null
          governance_doc_id: string | null
          grant_id: string | null
          loan_id: string | null
          nine_ninety_id: string | null
          ssj_fillout_form_id: string | null
          montessori_cert_id: string | null
          is_archived: boolean | null
          full_text: string | null
        }
        Insert: {
          title?: string | null
          created_date?: string | null
          created_by?: string | null
          is_private?: boolean | null
          id?: string | null
          school_id?: string | null
          people_id?: string | null
          charter_id?: string | null
          action_step_id?: string | null
          charter_application_id?: string | null
          governance_doc_id?: string | null
          grant_id?: string | null
          loan_id?: string | null
          nine_ninety_id?: string | null
          ssj_fillout_form_id?: string | null
          montessori_cert_id?: string | null
          is_archived?: boolean | null
          full_text?: string | null
        }
        Update: {
          title?: string | null
          created_date?: string | null
          created_by?: string | null
          is_private?: boolean | null
          id?: string | null
          school_id?: string | null
          people_id?: string | null
          charter_id?: string | null
          action_step_id?: string | null
          charter_application_id?: string | null
          governance_doc_id?: string | null
          grant_id?: string | null
          loan_id?: string | null
          nine_ninety_id?: string | null
          ssj_fillout_form_id?: string | null
          montessori_cert_id?: string | null
          is_archived?: boolean | null
          full_text?: string | null
        }
      }
      open_date_revisions: {
        Row: {
          id: string
          created_at: string
          school_id: string | null
          proj_open_date: string | null
          prior_proj_open_date: string | null
          notes: string | null
          charter_id: string | null
        }
        Insert: {
          id?: string | null
          created_at?: string | null
          school_id?: string | null
          proj_open_date?: string | null
          prior_proj_open_date?: string | null
          notes?: string | null
          charter_id?: string | null
        }
        Update: {
          id?: string | null
          created_at?: string | null
          school_id?: string | null
          proj_open_date?: string | null
          prior_proj_open_date?: string | null
          notes?: string | null
          charter_id?: string | null
        }
      }
      people: {
        Row: {
          first_name: string | null
          middle_name: string | null
          last_name: string | null
          nickname: string | null
          primary_phone: string | null
          secondary_phone: string | null
          google_groups: string | null
          home_address: string | null
          source_other: string | null
          tc_userid: string | null
          educ_attainment: unknown | null
          other_languages: unknown | null
          race_ethnicity_other: string | null
          hh_income: unknown | null
          childhood_income: unknown | null
          gender: unknown | null
          gender_other: string | null
          lgbtqia: boolean | null
          pronouns: unknown | null
          pronouns_other: string | null
          last_modified: string | null
          created: string | null
          indiv_type: string | null
          created_by: string | null
          tags: string | null
          exclude_from_email_logging: boolean | null
          id: string
          race_ethnicity: unknown | null
          source: unknown | null
          full_name: string | null
          primary_phone_other_info: string | null
          secondary_phone_other_info: string | null
          primary_languages: unknown | null
          is_archived: boolean | null
          montessori_certs: unknown | null
          headshot_object_ids: unknown | null
          headshot_public_urls: unknown | null
        }
        Insert: {
          first_name?: string | null
          middle_name?: string | null
          last_name?: string | null
          nickname?: string | null
          primary_phone?: string | null
          secondary_phone?: string | null
          google_groups?: string | null
          home_address?: string | null
          source_other?: string | null
          tc_userid?: string | null
          educ_attainment?: unknown | null
          other_languages?: unknown | null
          race_ethnicity_other?: string | null
          hh_income?: unknown | null
          childhood_income?: unknown | null
          gender?: unknown | null
          gender_other?: string | null
          lgbtqia?: boolean | null
          pronouns?: unknown | null
          pronouns_other?: string | null
          last_modified?: string | null
          created?: string | null
          indiv_type?: string | null
          created_by?: string | null
          tags?: string | null
          exclude_from_email_logging?: boolean | null
          id?: string | null
          race_ethnicity?: unknown | null
          source?: unknown | null
          full_name?: string | null
          primary_phone_other_info?: string | null
          secondary_phone_other_info?: string | null
          primary_languages?: unknown | null
          is_archived?: boolean | null
          montessori_certs?: unknown | null
          headshot_object_ids?: unknown | null
          headshot_public_urls?: unknown | null
        }
        Update: {
          first_name?: string | null
          middle_name?: string | null
          last_name?: string | null
          nickname?: string | null
          primary_phone?: string | null
          secondary_phone?: string | null
          google_groups?: string | null
          home_address?: string | null
          source_other?: string | null
          tc_userid?: string | null
          educ_attainment?: unknown | null
          other_languages?: unknown | null
          race_ethnicity_other?: string | null
          hh_income?: unknown | null
          childhood_income?: unknown | null
          gender?: unknown | null
          gender_other?: string | null
          lgbtqia?: boolean | null
          pronouns?: unknown | null
          pronouns_other?: string | null
          last_modified?: string | null
          created?: string | null
          indiv_type?: string | null
          created_by?: string | null
          tags?: string | null
          exclude_from_email_logging?: boolean | null
          id?: string | null
          race_ethnicity?: unknown | null
          source?: unknown | null
          full_name?: string | null
          primary_phone_other_info?: string | null
          secondary_phone_other_info?: string | null
          primary_languages?: unknown | null
          is_archived?: boolean | null
          montessori_certs?: unknown | null
          headshot_object_ids?: unknown | null
          headshot_public_urls?: unknown | null
        }
      }
      people_educator_early_cultivation: {
        Row: {
          old_id: string
          discovery_status: unknown | null
          assigned_partner: string | null
          montessori_lead_guide_trainings: string | null
          training_grants: string | null
          on_school_board: string | null
          first_contact_willingness_to_relocate: string | null
          first_contact_governance_model: string | null
          first_contact_notes_on_pre_wf_employment: string | null
          first_contact_form_notes: string | null
          first_contact_wf_employment_status: string | null
          first_contact_ages: string | null
          first_contact_interests: string | null
          target_city: string | null
          target_state: string | null
          target_geo_combined: string | null
          target_intl: string | null
          opsguide_meeting_prefs: string | null
          opsguide_checklist: string | null
          opsguide_request_pertinent_info: string | null
          opsguide_support_type_needed: string | null
          opsguide_fundraising_opps: string | null
          people_id: string
          notes: string | null
          sendgrid_template_selected: string | null
          sendgrid_send_date: string | null
          routed_to: string | null
          assigned_partner_override: string | null
          person_responsible_for_follow_up: string | null
          one_on_one_scheduling_status: string | null
          personal_email_sent: boolean | null
          personal_email_sent_date: string | null
          is_archived: boolean | null
          self_reflection_object_ids: unknown | null
          self_reflection_public_urls: unknown | null
        }
        Insert: {
          old_id?: string | null
          discovery_status?: unknown | null
          assigned_partner?: string | null
          montessori_lead_guide_trainings?: string | null
          training_grants?: string | null
          on_school_board?: string | null
          first_contact_willingness_to_relocate?: string | null
          first_contact_governance_model?: string | null
          first_contact_notes_on_pre_wf_employment?: string | null
          first_contact_form_notes?: string | null
          first_contact_wf_employment_status?: string | null
          first_contact_ages?: string | null
          first_contact_interests?: string | null
          target_city?: string | null
          target_state?: string | null
          target_geo_combined?: string | null
          target_intl?: string | null
          opsguide_meeting_prefs?: string | null
          opsguide_checklist?: string | null
          opsguide_request_pertinent_info?: string | null
          opsguide_support_type_needed?: string | null
          opsguide_fundraising_opps?: string | null
          people_id?: string | null
          notes?: string | null
          sendgrid_template_selected?: string | null
          sendgrid_send_date?: string | null
          routed_to?: string | null
          assigned_partner_override?: string | null
          person_responsible_for_follow_up?: string | null
          one_on_one_scheduling_status?: string | null
          personal_email_sent?: boolean | null
          personal_email_sent_date?: string | null
          is_archived?: boolean | null
          self_reflection_object_ids?: unknown | null
          self_reflection_public_urls?: unknown | null
        }
        Update: {
          old_id?: string | null
          discovery_status?: unknown | null
          assigned_partner?: string | null
          montessori_lead_guide_trainings?: string | null
          training_grants?: string | null
          on_school_board?: string | null
          first_contact_willingness_to_relocate?: string | null
          first_contact_governance_model?: string | null
          first_contact_notes_on_pre_wf_employment?: string | null
          first_contact_form_notes?: string | null
          first_contact_wf_employment_status?: string | null
          first_contact_ages?: string | null
          first_contact_interests?: string | null
          target_city?: string | null
          target_state?: string | null
          target_geo_combined?: string | null
          target_intl?: string | null
          opsguide_meeting_prefs?: string | null
          opsguide_checklist?: string | null
          opsguide_request_pertinent_info?: string | null
          opsguide_support_type_needed?: string | null
          opsguide_fundraising_opps?: string | null
          people_id?: string | null
          notes?: string | null
          sendgrid_template_selected?: string | null
          sendgrid_send_date?: string | null
          routed_to?: string | null
          assigned_partner_override?: string | null
          person_responsible_for_follow_up?: string | null
          one_on_one_scheduling_status?: string | null
          personal_email_sent?: boolean | null
          personal_email_sent_date?: string | null
          is_archived?: boolean | null
          self_reflection_object_ids?: unknown | null
          self_reflection_public_urls?: unknown | null
        }
      }
      people_roles_associations: {
        Row: {
          loan_fund: boolean | null
          who_initiated_tl_removal: string | null
          gsuite_roles: unknown | null
          is_active: boolean | null
          school_id: string | null
          people_id: string | null
          id: string
          created_date: string | null
          start_date: string | null
          end_date: string | null
          role: string | null
          charter_id: string | null
          authorizer_id: string | null
          is_archived: boolean | null
          tl_membership_acknowledgement_date: string | null
          tl_membership_acknowledgement_doc_object_ids: unknown | null
          tl_membership_acknowledgement_doc_public_urls: unknown | null
        }
        Insert: {
          loan_fund?: boolean | null
          who_initiated_tl_removal?: string | null
          gsuite_roles?: unknown | null
          is_active?: boolean | null
          school_id?: string | null
          people_id?: string | null
          id?: string | null
          created_date?: string | null
          start_date?: string | null
          end_date?: string | null
          role?: string | null
          charter_id?: string | null
          authorizer_id?: string | null
          is_archived?: boolean | null
          tl_membership_acknowledgement_date?: string | null
          tl_membership_acknowledgement_doc_object_ids?: unknown | null
          tl_membership_acknowledgement_doc_public_urls?: unknown | null
        }
        Update: {
          loan_fund?: boolean | null
          who_initiated_tl_removal?: string | null
          gsuite_roles?: unknown | null
          is_active?: boolean | null
          school_id?: string | null
          people_id?: string | null
          id?: string | null
          created_date?: string | null
          start_date?: string | null
          end_date?: string | null
          role?: string | null
          charter_id?: string | null
          authorizer_id?: string | null
          is_archived?: boolean | null
          tl_membership_acknowledgement_date?: string | null
          tl_membership_acknowledgement_doc_object_ids?: unknown | null
          tl_membership_acknowledgement_doc_public_urls?: unknown | null
        }
      }
      people_systems: {
        Row: {
          on_connected: boolean | null
          on_slack: unknown | null
          in_tl_google_grp: unknown | null
          in_wf_directory: unknown | null
          who_initiated_tl_removal: string | null
          on_natl_website: unknown | null
          gsuite_roles: unknown | null
          people_id: string | null
          id: string
          is_archived: boolean | null
        }
        Insert: {
          on_connected?: boolean | null
          on_slack?: unknown | null
          in_tl_google_grp?: unknown | null
          in_wf_directory?: unknown | null
          who_initiated_tl_removal?: string | null
          on_natl_website?: unknown | null
          gsuite_roles?: unknown | null
          people_id?: string | null
          id?: string | null
          is_archived?: boolean | null
        }
        Update: {
          on_connected?: boolean | null
          on_slack?: unknown | null
          in_tl_google_grp?: unknown | null
          in_wf_directory?: unknown | null
          who_initiated_tl_removal?: string | null
          on_natl_website?: unknown | null
          gsuite_roles?: unknown | null
          people_id?: string | null
          id?: string | null
          is_archived?: boolean | null
        }
      }
      preview_people_duplicates: {
        Row: {
          full_name_new: string | null
          canonical_id: string | null
          duplicate_ids: unknown | null
        }
        Insert: {
          full_name_new?: string | null
          canonical_id?: string | null
          duplicate_ids?: unknown | null
        }
        Update: {
          full_name_new?: string | null
          canonical_id?: string | null
          duplicate_ids?: unknown | null
        }
      }
      primary_emails: {
        Row: {
          email_address: string | null
          category: unknown | null
          people_id: string | null
        }
        Insert: {
          email_address?: string | null
          category?: unknown | null
          people_id?: string | null
        }
        Update: {
          email_address?: string | null
          category?: unknown | null
          people_id?: string | null
        }
      }
      school_reports_and_submissions: {
        Row: {
          id: string | null
          charter_id: string | null
          report_type: string | null
          report_docs_object_ids: unknown | null
          school_year: string | null
          is_archived: boolean | null
          report_docs_public_urls: unknown | null
        }
        Insert: {
          id?: string | null
          charter_id?: string | null
          report_type?: string | null
          report_docs_object_ids?: unknown | null
          school_year?: string | null
          is_archived?: boolean | null
          report_docs_public_urls?: unknown | null
        }
        Update: {
          id?: string | null
          charter_id?: string | null
          report_type?: string | null
          report_docs_object_ids?: unknown | null
          school_year?: string | null
          is_archived?: boolean | null
          report_docs_public_urls?: unknown | null
        }
      }
      school_ssj_data: {
        Row: {
          school_id: string
          ssj_target_city: string | null
          ssj_target_state: unknown | null
          entered_visioning_date: string | null
          entered_planning_date: string | null
          entered_startup_date: string | null
          ssj_stage: unknown | null
          ssj_readiness_to_open_rating: unknown | null
          ssj_name_reserved: boolean | null
          ssj_has_partner: unknown | null
          ssj_board_development: unknown | null
          ssj_facility: unknown | null
          ssj_on_track_for_enrollment: unknown | null
          ssj_budget_ready_for_next_steps: unknown | null
          ssj_seeking_wf_funding: unknown | null
          ssj_advice_givers_tls: string | null
          ssj_advice_givers_partners: string | null
          ssj_fundraising_narrative: string | null
          ssj_pathway_to_funding: unknown | null
          ssj_total_startup_funding_needed: string | null
          ssj_loan_eligibility: string | null
          ssj_loan_approved_amt: string | null
          ssj_amount_raised: string | null
          ssj_gap_in_funding: string | null
          ssj_date_shared_with_n4g: string | null
          ssj_proj_open_school_year: string | null
          ssj_tool: unknown | null
          ssj_building4good_status: unknown | null
          building4good_firm_and_attorney: string | null
          visioning_album_complete: string | null
          visioning_album: string | null
          logo_designer: unknown | null
          name_selection_proposal: string | null
          trademark_filed: boolean | null
          ssj_ops_guide_support_track: unknown | null
          is_archived: boolean | null
          visioning_advice_loop_closed: boolean | null
          planning_advice_loop_closed: boolean | null
        }
        Insert: {
          school_id?: string | null
          ssj_target_city?: string | null
          ssj_target_state?: unknown | null
          entered_visioning_date?: string | null
          entered_planning_date?: string | null
          entered_startup_date?: string | null
          ssj_stage?: unknown | null
          ssj_readiness_to_open_rating?: unknown | null
          ssj_name_reserved?: boolean | null
          ssj_has_partner?: unknown | null
          ssj_board_development?: unknown | null
          ssj_facility?: unknown | null
          ssj_on_track_for_enrollment?: unknown | null
          ssj_budget_ready_for_next_steps?: unknown | null
          ssj_seeking_wf_funding?: unknown | null
          ssj_advice_givers_tls?: string | null
          ssj_advice_givers_partners?: string | null
          ssj_fundraising_narrative?: string | null
          ssj_pathway_to_funding?: unknown | null
          ssj_total_startup_funding_needed?: string | null
          ssj_loan_eligibility?: string | null
          ssj_loan_approved_amt?: string | null
          ssj_amount_raised?: string | null
          ssj_gap_in_funding?: string | null
          ssj_date_shared_with_n4g?: string | null
          ssj_proj_open_school_year?: string | null
          ssj_tool?: unknown | null
          ssj_building4good_status?: unknown | null
          building4good_firm_and_attorney?: string | null
          visioning_album_complete?: string | null
          visioning_album?: string | null
          logo_designer?: unknown | null
          name_selection_proposal?: string | null
          trademark_filed?: boolean | null
          ssj_ops_guide_support_track?: unknown | null
          is_archived?: boolean | null
          visioning_advice_loop_closed?: boolean | null
          planning_advice_loop_closed?: boolean | null
        }
        Update: {
          school_id?: string | null
          ssj_target_city?: string | null
          ssj_target_state?: unknown | null
          entered_visioning_date?: string | null
          entered_planning_date?: string | null
          entered_startup_date?: string | null
          ssj_stage?: unknown | null
          ssj_readiness_to_open_rating?: unknown | null
          ssj_name_reserved?: boolean | null
          ssj_has_partner?: unknown | null
          ssj_board_development?: unknown | null
          ssj_facility?: unknown | null
          ssj_on_track_for_enrollment?: unknown | null
          ssj_budget_ready_for_next_steps?: unknown | null
          ssj_seeking_wf_funding?: unknown | null
          ssj_advice_givers_tls?: string | null
          ssj_advice_givers_partners?: string | null
          ssj_fundraising_narrative?: string | null
          ssj_pathway_to_funding?: unknown | null
          ssj_total_startup_funding_needed?: string | null
          ssj_loan_eligibility?: string | null
          ssj_loan_approved_amt?: string | null
          ssj_amount_raised?: string | null
          ssj_gap_in_funding?: string | null
          ssj_date_shared_with_n4g?: string | null
          ssj_proj_open_school_year?: string | null
          ssj_tool?: unknown | null
          ssj_building4good_status?: unknown | null
          building4good_firm_and_attorney?: string | null
          visioning_album_complete?: string | null
          visioning_album?: string | null
          logo_designer?: unknown | null
          name_selection_proposal?: string | null
          trademark_filed?: boolean | null
          ssj_ops_guide_support_track?: unknown | null
          is_archived?: boolean | null
          visioning_advice_loop_closed?: boolean | null
          planning_advice_loop_closed?: boolean | null
        }
      }
      schools: {
        Row: {
          long_name: string | null
          old_id: string
          short_name: string | null
          status: unknown | null
          governance_model: unknown | null
          prior_names: string | null
          narrative: string | null
          primary_contact_id: string | null
          institutional_partner: string | null
          logo_url: string | null
          school_calendar: unknown | null
          planning_album_object_id: string | null
          tc_school_id: string | null
          school_email: string | null
          email_domain: string | null
          school_phone: string | null
          facebook: string | null
          instagram: string | null
          website: string | null
          on_national_website: unknown | null
          domain_name: unknown | null
          google_voice: unknown | null
          website_tool: unknown | null
          budget_utility: unknown | null
          transparent_classroom: unknown | null
          admissions_system: unknown | null
          tc_admissions: unknown | null
          tc_recordkeeping: unknown | null
          gusto: unknown | null
          qbo: unknown | null
          business_insurance: unknown | null
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
          budget_link: string | null
          bookkeeper_or_accountant: string | null
          risk_factors: string | null
          watchlist: string | null
          program_focus: string | null
          loan_report_name: string | null
          current_fy_end: string | null
          incorporation_date: string | null
          guidestar_listing_requested: boolean | null
          legal_name: string | null
          nondiscrimination_policy_on_application: boolean | null
          nondiscrimination_policy_on_website: boolean | null
          qbo_school_codes: string | null
          membership_termination_steps: string | null
          automation_notes: string | null
          legal_structure: unknown | null
          open_date: string | null
          id: string
          charter_id: string | null
          school_sched: unknown | null
          public_funding: unknown | null
          founding_tls: unknown | null
          is_archived: boolean | null
          membership_status: string | null
          projected_open: string | null
          ages_served: unknown | null
          logo_square: string | null
          logo_flower_only: string | null
          logo_rectangle: string | null
          nonprofit_status: boolean | null
          nonprofit_path: unknown | null
          signed_membership_agreement_date: string | null
          membership_revoked_date: string | null
          membership_agreement_version: string | null
          visioning_album_object_id: string | null
          logo: string | null
          visioning_album_public_url: string | null
          planning_album_public_url: string | null
          visioning_album_public_urls: unknown | null
          visioning_album_object_ids: unknown | null
          planning_album_object_ids: unknown | null
          planning_album_public_urls: unknown | null
        }
        Insert: {
          long_name?: string | null
          old_id?: string | null
          short_name?: string | null
          status?: unknown | null
          governance_model?: unknown | null
          prior_names?: string | null
          narrative?: string | null
          primary_contact_id?: string | null
          institutional_partner?: string | null
          logo_url?: string | null
          school_calendar?: unknown | null
          planning_album_object_id?: string | null
          tc_school_id?: string | null
          school_email?: string | null
          email_domain?: string | null
          school_phone?: string | null
          facebook?: string | null
          instagram?: string | null
          website?: string | null
          on_national_website?: unknown | null
          domain_name?: unknown | null
          google_voice?: unknown | null
          website_tool?: unknown | null
          budget_utility?: unknown | null
          transparent_classroom?: unknown | null
          admissions_system?: unknown | null
          tc_admissions?: unknown | null
          tc_recordkeeping?: unknown | null
          gusto?: unknown | null
          qbo?: unknown | null
          business_insurance?: unknown | null
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
          budget_link?: string | null
          bookkeeper_or_accountant?: string | null
          risk_factors?: string | null
          watchlist?: string | null
          program_focus?: string | null
          loan_report_name?: string | null
          current_fy_end?: string | null
          incorporation_date?: string | null
          guidestar_listing_requested?: boolean | null
          legal_name?: string | null
          nondiscrimination_policy_on_application?: boolean | null
          nondiscrimination_policy_on_website?: boolean | null
          qbo_school_codes?: string | null
          membership_termination_steps?: string | null
          automation_notes?: string | null
          legal_structure?: unknown | null
          open_date?: string | null
          id?: string | null
          charter_id?: string | null
          school_sched?: unknown | null
          public_funding?: unknown | null
          founding_tls?: unknown | null
          is_archived?: boolean | null
          membership_status?: string | null
          projected_open?: string | null
          ages_served?: unknown | null
          logo_square?: string | null
          logo_flower_only?: string | null
          logo_rectangle?: string | null
          nonprofit_status?: boolean | null
          nonprofit_path?: unknown | null
          signed_membership_agreement_date?: string | null
          membership_revoked_date?: string | null
          membership_agreement_version?: string | null
          visioning_album_object_id?: string | null
          logo?: string | null
          visioning_album_public_url?: string | null
          planning_album_public_url?: string | null
          visioning_album_public_urls?: unknown | null
          visioning_album_object_ids?: unknown | null
          planning_album_object_ids?: unknown | null
          planning_album_public_urls?: unknown | null
        }
        Update: {
          long_name?: string | null
          old_id?: string | null
          short_name?: string | null
          status?: unknown | null
          governance_model?: unknown | null
          prior_names?: string | null
          narrative?: string | null
          primary_contact_id?: string | null
          institutional_partner?: string | null
          logo_url?: string | null
          school_calendar?: unknown | null
          planning_album_object_id?: string | null
          tc_school_id?: string | null
          school_email?: string | null
          email_domain?: string | null
          school_phone?: string | null
          facebook?: string | null
          instagram?: string | null
          website?: string | null
          on_national_website?: unknown | null
          domain_name?: unknown | null
          google_voice?: unknown | null
          website_tool?: unknown | null
          budget_utility?: unknown | null
          transparent_classroom?: unknown | null
          admissions_system?: unknown | null
          tc_admissions?: unknown | null
          tc_recordkeeping?: unknown | null
          gusto?: unknown | null
          qbo?: unknown | null
          business_insurance?: unknown | null
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
          budget_link?: string | null
          bookkeeper_or_accountant?: string | null
          risk_factors?: string | null
          watchlist?: string | null
          program_focus?: string | null
          loan_report_name?: string | null
          current_fy_end?: string | null
          incorporation_date?: string | null
          guidestar_listing_requested?: boolean | null
          legal_name?: string | null
          nondiscrimination_policy_on_application?: boolean | null
          nondiscrimination_policy_on_website?: boolean | null
          qbo_school_codes?: string | null
          membership_termination_steps?: string | null
          automation_notes?: string | null
          legal_structure?: unknown | null
          open_date?: string | null
          id?: string | null
          charter_id?: string | null
          school_sched?: unknown | null
          public_funding?: unknown | null
          founding_tls?: unknown | null
          is_archived?: boolean | null
          membership_status?: string | null
          projected_open?: string | null
          ages_served?: unknown | null
          logo_square?: string | null
          logo_flower_only?: string | null
          logo_rectangle?: string | null
          nonprofit_status?: boolean | null
          nonprofit_path?: unknown | null
          signed_membership_agreement_date?: string | null
          membership_revoked_date?: string | null
          membership_agreement_version?: string | null
          visioning_album_object_id?: string | null
          logo?: string | null
          visioning_album_public_url?: string | null
          planning_album_public_url?: string | null
          visioning_album_public_urls?: unknown | null
          visioning_album_object_ids?: unknown | null
          planning_album_object_ids?: unknown | null
          planning_album_public_urls?: unknown | null
        }
      }
      ssj_fillout_forms: {
        Row: {
          old_id: string | null
          form_type: unknown | null
          first_name: string | null
          last_name: string | null
          full_name: string | null
          email: string | null
          "Link to Start a School": string | null
          race_ethnicity: string | null
          race_ethnicity_other: string | null
          lgbtqia: string | null
          pronouns: string | null
          pronouns_other: string | null
          gender: string | null
          gender_other: string | null
          current_income: string | null
          language_primary: string | null
          language_primary_other: string | null
          message: string | null
          charter_interest: string | null
          email_1: string | null
          contact_type: string | null
          mont_cert_question: string | null
          cert_processing_status: string | null
          currently_montessori_certified: string | null
          currently_seeking_mont_cert: string | null
          "Temp - M Cert Cert 1": string | null
          "Montessori Certification Certifier 1": string | null
          "Temp - M Cert Year 1": string | null
          "Montessori Certification Year 1": string | null
          "Temp - M Cert Level 1": string | null
          "Montessori Certification Level 1": string | null
          "Temp - M Cert Cert 2": string | null
          "Montessori Certification Certifier 2": string | null
          "Temp - M Cert Year 2": string | null
          "Montessori Certification Year 2": string | null
          "Temp - M Cert Level 2": string | null
          "Montessori Certification Level 2": string | null
          "Temp - M Cert Cert 3": string | null
          "Montessori Certification Certifier 3": string | null
          "Temp - M Cert Year 3": string | null
          "Montessori Certification Year 3": string | null
          "Temp - M Cert Level 3": string | null
          "Montessori Certification Level 3": string | null
          "Temp - M Cert Cert 4": string | null
          "Montessori Certification Certifier 4": string | null
          "Temp - M Cert Year 4": string | null
          "Montessori Certification Year 4": string | null
          "Temp - M Cert Level 4": string | null
          "Montessori Certification Level 4": string | null
          city: string | null
          city_standardized: string | null
          state: string | null
          state_abbrev: string | null
          country: string | null
          city2: string | null
          state2: string | null
          country2: string | null
          target_geo: string | null
          age_targets: string | null
          educator_interests: string | null
          educator_interests_other: string | null
          community_member_interest: string | null
          want_helping_sourcing_teachers: string | null
          community_desc: string | null
          community_member_self_description: string | null
          want_communications: string | null
          source_type: string | null
          source_other: string | null
          source_detail: string | null
          source_campaign: string | null
          created_date: string | null
          sendgrid_template: string | null
          sendgrid_date_sent: string | null
          routed_to: string | null
          assigned_partner_override: string | null
          email_sent_by_initial_outreacher: string | null
          one_on_one_status: string | null
          initial_outreacher: string | null
          follow_upper: string | null
          id: string
          people_id: string | null
          is_archived: boolean | null
        }
        Insert: {
          old_id?: string | null
          form_type?: unknown | null
          first_name?: string | null
          last_name?: string | null
          full_name?: string | null
          email?: string | null
          "Link to Start a School"?: string | null
          race_ethnicity?: string | null
          race_ethnicity_other?: string | null
          lgbtqia?: string | null
          pronouns?: string | null
          pronouns_other?: string | null
          gender?: string | null
          gender_other?: string | null
          current_income?: string | null
          language_primary?: string | null
          language_primary_other?: string | null
          message?: string | null
          charter_interest?: string | null
          email_1?: string | null
          contact_type?: string | null
          mont_cert_question?: string | null
          cert_processing_status?: string | null
          currently_montessori_certified?: string | null
          currently_seeking_mont_cert?: string | null
          "Temp - M Cert Cert 1"?: string | null
          "Montessori Certification Certifier 1"?: string | null
          "Temp - M Cert Year 1"?: string | null
          "Montessori Certification Year 1"?: string | null
          "Temp - M Cert Level 1"?: string | null
          "Montessori Certification Level 1"?: string | null
          "Temp - M Cert Cert 2"?: string | null
          "Montessori Certification Certifier 2"?: string | null
          "Temp - M Cert Year 2"?: string | null
          "Montessori Certification Year 2"?: string | null
          "Temp - M Cert Level 2"?: string | null
          "Montessori Certification Level 2"?: string | null
          "Temp - M Cert Cert 3"?: string | null
          "Montessori Certification Certifier 3"?: string | null
          "Temp - M Cert Year 3"?: string | null
          "Montessori Certification Year 3"?: string | null
          "Temp - M Cert Level 3"?: string | null
          "Montessori Certification Level 3"?: string | null
          "Temp - M Cert Cert 4"?: string | null
          "Montessori Certification Certifier 4"?: string | null
          "Temp - M Cert Year 4"?: string | null
          "Montessori Certification Year 4"?: string | null
          "Temp - M Cert Level 4"?: string | null
          "Montessori Certification Level 4"?: string | null
          city?: string | null
          city_standardized?: string | null
          state?: string | null
          state_abbrev?: string | null
          country?: string | null
          city2?: string | null
          state2?: string | null
          country2?: string | null
          target_geo?: string | null
          age_targets?: string | null
          educator_interests?: string | null
          educator_interests_other?: string | null
          community_member_interest?: string | null
          want_helping_sourcing_teachers?: string | null
          community_desc?: string | null
          community_member_self_description?: string | null
          want_communications?: string | null
          source_type?: string | null
          source_other?: string | null
          source_detail?: string | null
          source_campaign?: string | null
          created_date?: string | null
          sendgrid_template?: string | null
          sendgrid_date_sent?: string | null
          routed_to?: string | null
          assigned_partner_override?: string | null
          email_sent_by_initial_outreacher?: string | null
          one_on_one_status?: string | null
          initial_outreacher?: string | null
          follow_upper?: string | null
          id?: string | null
          people_id?: string | null
          is_archived?: boolean | null
        }
        Update: {
          old_id?: string | null
          form_type?: unknown | null
          first_name?: string | null
          last_name?: string | null
          full_name?: string | null
          email?: string | null
          "Link to Start a School"?: string | null
          race_ethnicity?: string | null
          race_ethnicity_other?: string | null
          lgbtqia?: string | null
          pronouns?: string | null
          pronouns_other?: string | null
          gender?: string | null
          gender_other?: string | null
          current_income?: string | null
          language_primary?: string | null
          language_primary_other?: string | null
          message?: string | null
          charter_interest?: string | null
          email_1?: string | null
          contact_type?: string | null
          mont_cert_question?: string | null
          cert_processing_status?: string | null
          currently_montessori_certified?: string | null
          currently_seeking_mont_cert?: string | null
          "Temp - M Cert Cert 1"?: string | null
          "Montessori Certification Certifier 1"?: string | null
          "Temp - M Cert Year 1"?: string | null
          "Montessori Certification Year 1"?: string | null
          "Temp - M Cert Level 1"?: string | null
          "Montessori Certification Level 1"?: string | null
          "Temp - M Cert Cert 2"?: string | null
          "Montessori Certification Certifier 2"?: string | null
          "Temp - M Cert Year 2"?: string | null
          "Montessori Certification Year 2"?: string | null
          "Temp - M Cert Level 2"?: string | null
          "Montessori Certification Level 2"?: string | null
          "Temp - M Cert Cert 3"?: string | null
          "Montessori Certification Certifier 3"?: string | null
          "Temp - M Cert Year 3"?: string | null
          "Montessori Certification Year 3"?: string | null
          "Temp - M Cert Level 3"?: string | null
          "Montessori Certification Level 3"?: string | null
          "Temp - M Cert Cert 4"?: string | null
          "Montessori Certification Certifier 4"?: string | null
          "Temp - M Cert Year 4"?: string | null
          "Montessori Certification Year 4"?: string | null
          "Temp - M Cert Level 4"?: string | null
          "Montessori Certification Level 4"?: string | null
          city?: string | null
          city_standardized?: string | null
          state?: string | null
          state_abbrev?: string | null
          country?: string | null
          city2?: string | null
          state2?: string | null
          country2?: string | null
          target_geo?: string | null
          age_targets?: string | null
          educator_interests?: string | null
          educator_interests_other?: string | null
          community_member_interest?: string | null
          want_helping_sourcing_teachers?: string | null
          community_desc?: string | null
          community_member_self_description?: string | null
          want_communications?: string | null
          source_type?: string | null
          source_other?: string | null
          source_detail?: string | null
          source_campaign?: string | null
          created_date?: string | null
          sendgrid_template?: string | null
          sendgrid_date_sent?: string | null
          routed_to?: string | null
          assigned_partner_override?: string | null
          email_sent_by_initial_outreacher?: string | null
          one_on_one_status?: string | null
          initial_outreacher?: string | null
          follow_upper?: string | null
          id?: string | null
          people_id?: string | null
          is_archived?: boolean | null
        }
      }
      storage_object_id_path: {
        Row: {
          id: string | null
          bucket_id: string | null
          name: string | null
        }
        Insert: {
          id?: string | null
          bucket_id?: string | null
          name?: string | null
        }
        Update: {
          id?: string | null
          bucket_id?: string | null
          name?: string | null
        }
      }
      zref_assessments_and_metrics: {
        Row: {
          value: string
        }
        Insert: {
          value?: string | null
        }
        Update: {
          value?: string | null
        }
      }
      zref_certifications: {
        Row: {
          value: string
          ages: unknown | null
          lead_guide_training: boolean | null
          admin_training: boolean | null
          synonyms: unknown | null
        }
        Insert: {
          value?: string | null
          ages?: unknown | null
          lead_guide_training?: boolean | null
          admin_training?: boolean | null
          synonyms?: unknown | null
        }
        Update: {
          value?: string | null
          ages?: unknown | null
          lead_guide_training?: boolean | null
          admin_training?: boolean | null
          synonyms?: unknown | null
        }
      }
      zref_charter_authorizer_actions: {
        Row: {
          value: string
          label: string | null
        }
        Insert: {
          value?: string | null
          label?: string | null
        }
        Update: {
          value?: string | null
          label?: string | null
        }
      }
      zref_charter_statuses: {
        Row: {
          value: unknown
          label: string | null
          order: number | null
        }
        Insert: {
          value?: unknown | null
          label?: string | null
          order?: number | null
        }
        Update: {
          value?: unknown | null
          label?: string | null
          order?: number | null
        }
      }
      zref_educator_statuses: {
        Row: {
          value: string
          order: number | null
          kanban_visibility: unknown | null
          label: string | null
        }
        Insert: {
          value?: string | null
          order?: number | null
          kanban_visibility?: unknown | null
          label?: string | null
        }
        Update: {
          value?: string | null
          order?: number | null
          kanban_visibility?: unknown | null
          label?: string | null
        }
      }
      zref_errors: {
        Row: {
          value: string
        }
        Insert: {
          value?: string | null
        }
        Update: {
          value?: string | null
        }
      }
      zref_event_types: {
        Row: {
          value: string
        }
        Insert: {
          value?: string | null
        }
        Update: {
          value?: string | null
        }
      }
      zref_gov_docs: {
        Row: {
          value: string
          label: string
          required_to_transition_to_startup: boolean | null
          required_to_open: boolean | null
        }
        Insert: {
          value?: string | null
          label?: string | null
          required_to_transition_to_startup?: boolean | null
          required_to_open?: boolean | null
        }
        Update: {
          value?: string | null
          label?: string | null
          required_to_transition_to_startup?: boolean | null
          required_to_open?: boolean | null
        }
      }
      zref_membership_agreement_versions: {
        Row: {
          value: string
          start_date: string | null
          end_date: string | null
        }
        Insert: {
          value?: string | null
          start_date?: string | null
          end_date?: string | null
        }
        Update: {
          value?: string | null
          start_date?: string | null
          end_date?: string | null
        }
      }
      zref_membership_statuses: {
        Row: {
          value: string
        }
        Insert: {
          value?: string | null
        }
        Update: {
          value?: string | null
        }
      }
      zref_one_on_one_status: {
        Row: {
          value: string
          label: string | null
        }
        Insert: {
          value?: string | null
          label?: string | null
        }
        Update: {
          value?: string | null
          label?: string | null
        }
      }
      zref_planes: {
        Row: {
          value: unknown
          credentials: unknown | null
          synonyms: unknown | null
          age_ranges: unknown | null
          age_spans: unknown | null
          label: string | null
        }
        Insert: {
          value?: unknown | null
          credentials?: unknown | null
          synonyms?: unknown | null
          age_ranges?: unknown | null
          age_spans?: unknown | null
          label?: string | null
        }
        Update: {
          value?: unknown | null
          credentials?: unknown | null
          synonyms?: unknown | null
          age_ranges?: unknown | null
          age_spans?: unknown | null
          label?: string | null
        }
      }
      zref_public_funding_sources: {
        Row: {
          value: string
          description: string | null
          planes: unknown | null
          label: string | null
        }
        Insert: {
          value?: string | null
          description?: string | null
          planes?: unknown | null
          label?: string | null
        }
        Update: {
          value?: string | null
          description?: string | null
          planes?: unknown | null
          label?: string | null
        }
      }
      zref_race_and_ethnicity: {
        Row: {
          value: unknown
          label_long: string | null
          label_long_spanish: string | null
          label: string | null
        }
        Insert: {
          value?: unknown | null
          label_long?: string | null
          label_long_spanish?: string | null
          label?: string | null
        }
        Update: {
          value?: unknown | null
          label_long?: string | null
          label_long_spanish?: string | null
          label?: string | null
        }
      }
      zref_roles: {
        Row: {
          value: string
          label: string
          contexts: unknown | null
          show_in_educator_grid: boolean | null
          show_in_board_tables: boolean | null
        }
        Insert: {
          value?: string | null
          label?: string | null
          contexts?: unknown | null
          show_in_educator_grid?: boolean | null
          show_in_board_tables?: boolean | null
        }
        Update: {
          value?: string | null
          label?: string | null
          contexts?: unknown | null
          show_in_educator_grid?: boolean | null
          show_in_board_tables?: boolean | null
        }
      }
      zref_school_years: {
        Row: {
          value: string
          fiscal_year: string
          starting_calendar_year: string
          ending_calendar_year: string
          start_date: string | null
          end_date: string | null
        }
        Insert: {
          value?: string | null
          fiscal_year?: string | null
          starting_calendar_year?: string | null
          ending_calendar_year?: string | null
          start_date?: string | null
          end_date?: string | null
        }
        Update: {
          value?: string | null
          fiscal_year?: string | null
          starting_calendar_year?: string | null
          ending_calendar_year?: string | null
          start_date?: string | null
          end_date?: string | null
        }
      }
      zref_sources: {
        Row: {
          value: string
        }
        Insert: {
          value?: string | null
        }
        Update: {
          value?: string | null
        }
      }
      zref_stage_statuses: {
        Row: {
          value: string
          order: number | null
          kanban_visibility: unknown
          label: string | null
        }
        Insert: {
          value?: string | null
          order?: number | null
          kanban_visibility?: unknown | null
          label?: string | null
        }
        Update: {
          value?: string | null
          order?: number | null
          kanban_visibility?: unknown | null
          label?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      action_step_status: "Complete" | "Incomplete"
      active_inactive: "Active" | "Inactive" | "Removed"
      admissions_system_options: "TC" | "School Cues"
      advice_panel_stages: "Visioning" | "Planning"
      age_spans: "0-1" | "1-3" | "3-6" | "6-9" | "9-12" | "12-15" | "15-18"
      "ages-grades": "Infants" | "Toddlers" | "PK3" | "PK4" | "K" | "1st" | "2nd" | "3rd" | "4th" | "5th" | "6th" | "7th" | "8th" | "9th" | "10th" | "11th" | "12th"
      authorizor_decisions: "Approved" | "Approved, with contingency" | "Deferred decision" | "Denied"
      automation_step_trigger: "Request prelim advice for $3k+" | "Request full advice" | "Waiting for prelim advice" | "Waiting for full advice" | "Proceed" | "Processing" | "Waiting for prereqs" | "Complete"
      budget_utility_options: "WF v4"
      business_insurance_options: "Alliant" | "other (in process w/ Alliant)" | "other"
      certification_completion_status: "Certified" | "Training"
      charter_app_status: "Pre application" | "Preparing application" | "Awaiting decision" | "Authorized, preparing to open"
      charter_status: "Awaiting start of cohort" | "Open" | "Paused" | "Applying" | "Approved - Year 0" | "Application Submitted - Waiting"
      cohort_type: "Charter" | "Blooms"
      dev_note_type: "crash" | "unexpected search results" | "unexpected behavior" | "UI refinement" | "new functionality request" | "other"
      developmental_planes: "Infants" | "Toddlers" | "Primary" | "Lower Elementary" | "Upper Elementary" | "Adolescent / JH" | "High School"
      discovery_statuses: "Complete" | "In process" | "Paused"
      domain_name_options: "internal" | "external"
      educ_attainment_options: "Did not graduate high school" | "Graduated high school or GED" | "Some college or two-year degree" | "Graduated college (four-year degree)" | "Some graduate school" | "Completed graduate school"
      email_address_categories: "personal" | "work - non-wildflower" | "work - wildflower school" | "work - wildflower foundation" | "school"
      fiscal_year_end: "06/30" | "12/31"
      gender_categories: "Female" | "Male" | "Gender Non-Conforming" | "Other"
      google_voice_options: "internal license" | "external license"
      governance_models: "Independent" | "Charter" | "Community Partnership" | "District" | "Exploring Charter" | "NULL"
      group_exemption_status: "Active" | "Never part of group exemption" | "Withdrawn" | "Applying" | "Issues"
      gsuite_roles_options: "School Admin - School Orgs"
      guide_types: "Ops Guide" | "Entrepreneur" | "Equity Coach" | "Open Schools Support"
      gusto_options: "yes (under WF)" | "yes (independent)" | "yes" | "no- local system" | "no"
      high_med_low: "Low" | "Medium" | "High"
      income_categories: "Very low" | "Low" | "Middle" | "Upper" | "Prefer not to respond"
      kanban_visibility: "expanded" | "collapsed" | "suppressed"
      languages: "English" | "Spanish - Español" | "Mandarin - 中文" | "Hindi - हिन्दी" | "French - Français" | "Japanese - 日本語" | "Arabic - العَرَبِيَّة" | "Urdu - اُردُو" | "Hungarian - Hungarian" | "Haitian Creole - Kreyol Ayisyen" | "Gujarati - ગુજરાતી" | "Fujian- Fujian" | "Russian - русский язык" | "Korean - 한국어" | "Cantonese - Gwóngdūng wá" | "Tai-Kadai - ไทย / ພາສາລາວ" | "Portuguese - Português" | "Tami - தமிழ்" | "Burmese - မြန်မာစာ" | "Yoruba" | "Other"
      legal_structure_options: "Independent organization" | "Part of another organization" | "Part of a charter" | "Multiple WF schools in a single entity"
      loan_status_options: "Interest Only Period" | "Paid Off" | "Principal Repayment Period"
      loan_vehicle_options: "LF II" | "Sep" | "Spring Point" | "TWF" | "TWF->LF II"
      location_types: "Mailing address - no physical school" | "Physical address - does not receive mail" | "School address and mailing address"
      logo_designer_options: "internal design" | "external design"
      membership_action_options: "Signed Membership Agreement" | "Withdrew from Network" | "Sent Termination Letter"
      membership_statuses: "Member" | "Non-member" | "Affiliated non-member"
      montessori_associations: "AMI" | "AMS" | "IMC" | "MEPI" | "PAMS" | "Independent" | "Other"
      nonprofit_paths: "Group exemption" | "Direct" | "Charter" | "Partner"
      nps: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10"
      on_national_website_options: "added" | "removed" | "ready to add"
      partner_roles: "TL" | "Affiliate of Charter Partner" | "Ops Guide" | "Teacher Leader" | "Foundation Partner" | "Regional Entrepreneur" | "School Supports Partner" | "Finance Administrator"
      pronouns: "he/him/his" | "she/her/hers" | "they/them/theirs" | "other"
      qbo_options: "internal license - active" | "external license" | "Not WF - Unknown software"
      race_ethnicity_categories: "african_american" | "asian_american" | "hispanic" | "middle_eastern" | "native_american" | "pacific_islander" | "white" | "other"
      role_contexts: "Independent school" | "Charter" | "Foundation" | "External"
      school_calendar_options: "9-month" | "10-month" | "Year-round"
      school_roles: "Teacher Leader" | "Emerging Teacher Leader" | "Founder" | "Classroom Staff" | "Fellow" | "Other"
      school_schedule_options: "Before Care" | "Morning Care" | "Afternoon Care" | "After Care"
      school_statuses: "Emerging" | "Open" | "Paused" | "Disaffiliated" | "Permanently Closed" | "Placeholder"
      ssj_board_dev_status: "No board" | "Board is forming, 1-2 mtgs" | "Board is developed and engaged, 3+ mtgs"
      ssj_budget_ready_for_next_steps_enum: "No" | "Unsure" | "Yes"
      ssj_building4good_status_enum: "Matched" | "Requested" | "Upcoming"
      ssj_cohort_status_enum: "Left Cohort" | "Returning for Later Cohort" | "Switched Ops Guide Supports" | "Transitioned to Charter Application Supports"
      ssj_facility_enum: "Purchased building" | "Searching, intending to buy" | "Searching, intending to rent" | "Identified prospect(s)" | "Signed lease" | "Unsure"
      ssj_form_type: "Get Involved" | "Start a School"
      ssj_has_partner_enum: "No partner" | "Partnership established" | "Partnership In development"
      ssj_on_track_for_enrollment_enum: "Maybe (process is ready, no prospective students)" | "No (process unclear/unpublished, limited/no family engagement)" | "Yes - tuition published, plan and community engagement underway"
      ssj_ops_guide_support_track_enum: "Cohort" | "1:1 support"
      ssj_pathway_to_funding_enum: "Maybe, prospects identified but not secured" | "No, startup funding unlikely" | "Yes, full funding likely"
      ssj_seeking_wf_funding_enum: "No" | "Yes, grant" | "Yes, grant; Yes, loan" | "Yes, loan" | "Yes, loan; Yes, grant"
      ssj_stages: "Visioning" | "Planning" | "Startup" | "Year 1" | "Complete"
      ssj_tool_enum: "Charter Slides" | "Google Slides" | "My Wildflower - Sensible Default" | "Platform Pilot"
      state_abbreviation_enum: "AL" | "AK" | "AZ" | "AR" | "CA" | "CO" | "CT" | "DE" | "DC" | "FL" | "GA" | "HI" | "ID" | "IL" | "IN" | "IA" | "KS" | "KY" | "LA" | "ME" | "MD" | "MA" | "MI" | "MN" | "MS" | "MO" | "MT" | "NE" | "NV" | "NH" | "NJ" | "NM" | "NY" | "NC" | "ND" | "OH" | "OK" | "OR" | "PA" | "RI" | "SC" | "SD" | "TN" | "TX" | "UT" | "VT" | "VA" | "WA" | "WV" | "WI" | "WY" | "PR"
      tc_admissions_options: "v1" | "yes"
      tc_recordkeeping_options: "yes (under WF)"
      transparent_classroom_options: "Internal license" | "Internal License - removed" | "External license" | "Other record keeping system"
      use_of_proceeds_options: "Combine 2 loans" | "Expansion" | "Move" | "Operations" | "Renovations / Construction" | "Security deposit" | "Start-up"
      website_tool_options: "external platform" | "wordpress v1" | "wordpress v2" | "wordpress original" | "Wix v1" | "Wix v2"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          id: string
          name: string
          owner: string | null
          created_at: string | null
          updated_at: string | null
          public: boolean | null
          avif_autodetection: boolean | null
          file_size_limit: number | null
          allowed_mime_types: unknown | null
          owner_id: string | null
          type: unknown
        }
        Insert: {
          id?: string | null
          name?: string | null
          owner?: string | null
          created_at?: string | null
          updated_at?: string | null
          public?: boolean | null
          avif_autodetection?: boolean | null
          file_size_limit?: number | null
          allowed_mime_types?: unknown | null
          owner_id?: string | null
          type?: unknown | null
        }
        Update: {
          id?: string | null
          name?: string | null
          owner?: string | null
          created_at?: string | null
          updated_at?: string | null
          public?: boolean | null
          avif_autodetection?: boolean | null
          file_size_limit?: number | null
          allowed_mime_types?: unknown | null
          owner_id?: string | null
          type?: unknown | null
        }
      }
      buckets_analytics: {
        Row: {
          id: string
          type: unknown
          format: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string | null
          type?: unknown | null
          format?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string | null
          type?: unknown | null
          format?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      migrations: {
        Row: {
          id: number
          name: unknown
          hash: unknown
          executed_at: string | null
        }
        Insert: {
          id?: number | null
          name?: unknown | null
          hash?: unknown | null
          executed_at?: string | null
        }
        Update: {
          id?: number | null
          name?: unknown | null
          hash?: unknown | null
          executed_at?: string | null
        }
      }
      objects: {
        Row: {
          id: string
          bucket_id: string | null
          name: string | null
          owner: string | null
          created_at: string | null
          updated_at: string | null
          last_accessed_at: string | null
          metadata: Json | null
          path_tokens: unknown | null
          version: string | null
          owner_id: string | null
          user_metadata: Json | null
          level: number | null
        }
        Insert: {
          id?: string | null
          bucket_id?: string | null
          name?: string | null
          owner?: string | null
          created_at?: string | null
          updated_at?: string | null
          last_accessed_at?: string | null
          metadata?: Json | null
          path_tokens?: unknown | null
          version?: string | null
          owner_id?: string | null
          user_metadata?: Json | null
          level?: number | null
        }
        Update: {
          id?: string | null
          bucket_id?: string | null
          name?: string | null
          owner?: string | null
          created_at?: string | null
          updated_at?: string | null
          last_accessed_at?: string | null
          metadata?: Json | null
          path_tokens?: unknown | null
          version?: string | null
          owner_id?: string | null
          user_metadata?: Json | null
          level?: number | null
        }
      }
      prefixes: {
        Row: {
          bucket_id: string
          name: string
          level: number
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          bucket_id?: string | null
          name?: string | null
          level?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          bucket_id?: string | null
          name?: string | null
          level?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      s3_multipart_uploads: {
        Row: {
          id: string
          in_progress_size: number
          upload_signature: string
          bucket_id: string
          key: string
          version: string
          owner_id: string | null
          created_at: string
          user_metadata: Json | null
        }
        Insert: {
          id?: string | null
          in_progress_size?: number | null
          upload_signature?: string | null
          bucket_id?: string | null
          key?: string | null
          version?: string | null
          owner_id?: string | null
          created_at?: string | null
          user_metadata?: Json | null
        }
        Update: {
          id?: string | null
          in_progress_size?: number | null
          upload_signature?: string | null
          bucket_id?: string | null
          key?: string | null
          version?: string | null
          owner_id?: string | null
          created_at?: string | null
          user_metadata?: Json | null
        }
      }
      s3_multipart_uploads_parts: {
        Row: {
          id: string
          upload_id: string
          size: number
          part_number: number
          bucket_id: string
          key: string
          etag: string
          owner_id: string | null
          version: string
          created_at: string
        }
        Insert: {
          id?: string | null
          upload_id?: string | null
          size?: number | null
          part_number?: number | null
          bucket_id?: string | null
          key?: string | null
          etag?: string | null
          owner_id?: string | null
          version?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string | null
          upload_id?: string | null
          size?: number | null
          part_number?: number | null
          bucket_id?: string | null
          key?: string | null
          etag?: string | null
          owner_id?: string | null
          version?: string | null
          created_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      buckettype: "STANDARD" | "ANALYTICS"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[keyof Database]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof Database["public"]["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof Database
}
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof Database["public"]["CompositeTypes"]
    ? Database["public"]["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
