export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      action_steps: {
        Row: {
          assigned_date: string | null
          assignee: string | null
          charter_id: string | null
          completed_date: string | null
          due_date: string | null
          guide_email_or_name: string | null
          id: string
          is_archived: boolean | null
          item: string | null
          item_status: Database["public"]["Enums"]["action_step_status"] | null
          people_id: string | null
          school_id: string | null
        }
        Insert: {
          assigned_date?: string | null
          assignee?: string | null
          charter_id?: string | null
          completed_date?: string | null
          due_date?: string | null
          guide_email_or_name?: string | null
          id?: string
          is_archived?: boolean | null
          item?: string | null
          item_status?: Database["public"]["Enums"]["action_step_status"] | null
          people_id?: string | null
          school_id?: string | null
        }
        Update: {
          assigned_date?: string | null
          assignee?: string | null
          charter_id?: string | null
          completed_date?: string | null
          due_date?: string | null
          guide_email_or_name?: string | null
          id?: string
          is_archived?: boolean | null
          item?: string | null
          item_status?: Database["public"]["Enums"]["action_step_status"] | null
          people_id?: string | null
          school_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "action_steps_charter_id_fkey"
            columns: ["charter_id"]
            isOneToOne: false
            referencedRelation: "charters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "action_steps_charter_id_fkey"
            columns: ["charter_id"]
            isOneToOne: false
            referencedRelation: "details_charters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "action_steps_charter_id_fkey"
            columns: ["charter_id"]
            isOneToOne: false
            referencedRelation: "grid_charter"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "action_steps_guide_email_or_name_fkey"
            columns: ["guide_email_or_name"]
            isOneToOne: false
            referencedRelation: "guides"
            referencedColumns: ["email_or_name"]
          },
          {
            foreignKeyName: "action_steps_people_id_fkey"
            columns: ["people_id"]
            isOneToOne: false
            referencedRelation: "details_educators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "action_steps_people_id_fkey"
            columns: ["people_id"]
            isOneToOne: false
            referencedRelation: "grid_educator"
            referencedColumns: ["id"]
          },
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
            referencedRelation: "details_schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "action_steps_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "grid_school"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "action_steps_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "logo_urls_by_school"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "action_steps_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      advice: {
        Row: {
          advice_doc: string | null
          advice_given_date: string | null
          advice_giver_people_id: string | null
          advice_loop_closed_date: string | null
          advice_requested_date: string | null
          advice_text: string | null
          charter_id: string | null
          created_at: string
          id: number
          school_id: string | null
          stage: Database["public"]["Enums"]["advice_panel_stages"] | null
        }
        Insert: {
          advice_doc?: string | null
          advice_given_date?: string | null
          advice_giver_people_id?: string | null
          advice_loop_closed_date?: string | null
          advice_requested_date?: string | null
          advice_text?: string | null
          charter_id?: string | null
          created_at?: string
          id?: number
          school_id?: string | null
          stage?: Database["public"]["Enums"]["advice_panel_stages"] | null
        }
        Update: {
          advice_doc?: string | null
          advice_given_date?: string | null
          advice_giver_people_id?: string | null
          advice_loop_closed_date?: string | null
          advice_requested_date?: string | null
          advice_text?: string | null
          charter_id?: string | null
          created_at?: string
          id?: number
          school_id?: string | null
          stage?: Database["public"]["Enums"]["advice_panel_stages"] | null
        }
        Relationships: [
          {
            foreignKeyName: "advice_advice_giver_people_id_fkey"
            columns: ["advice_giver_people_id"]
            isOneToOne: false
            referencedRelation: "details_educators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advice_advice_giver_people_id_fkey"
            columns: ["advice_giver_people_id"]
            isOneToOne: false
            referencedRelation: "grid_educator"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advice_advice_giver_people_id_fkey"
            columns: ["advice_giver_people_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advice_charter_id_fkey"
            columns: ["charter_id"]
            isOneToOne: false
            referencedRelation: "charters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advice_charter_id_fkey"
            columns: ["charter_id"]
            isOneToOne: false
            referencedRelation: "details_charters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advice_charter_id_fkey"
            columns: ["charter_id"]
            isOneToOne: false
            referencedRelation: "grid_charter"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advice_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "details_schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advice_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "grid_school"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advice_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "logo_urls_by_school"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "advice_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      annual_assessment_and_metrics_data: {
        Row: {
          assessed_bipoc: number | null
          assessed_ell: number | null
          assessed_frl: number | null
          assessed_sped: number | null
          assessed_total: number | null
          assessment_or_metric: string | null
          charter_id: string | null
          id: string
          met_plus_bipoc: number | null
          met_plus_ell: number | null
          met_plus_frl: number | null
          met_plus_sped: number | null
          met_plus_total: number | null
          metric_data: string | null
          school_id: string | null
          school_year: string | null
        }
        Insert: {
          assessed_bipoc?: number | null
          assessed_ell?: number | null
          assessed_frl?: number | null
          assessed_sped?: number | null
          assessed_total?: number | null
          assessment_or_metric?: string | null
          charter_id?: string | null
          id?: string
          met_plus_bipoc?: number | null
          met_plus_ell?: number | null
          met_plus_frl?: number | null
          met_plus_sped?: number | null
          met_plus_total?: number | null
          metric_data?: string | null
          school_id?: string | null
          school_year?: string | null
        }
        Update: {
          assessed_bipoc?: number | null
          assessed_ell?: number | null
          assessed_frl?: number | null
          assessed_sped?: number | null
          assessed_total?: number | null
          assessment_or_metric?: string | null
          charter_id?: string | null
          id?: string
          met_plus_bipoc?: number | null
          met_plus_ell?: number | null
          met_plus_frl?: number | null
          met_plus_sped?: number | null
          met_plus_total?: number | null
          metric_data?: string | null
          school_id?: string | null
          school_year?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "annual_assessment_and_metrics_data_charter_id_fkey"
            columns: ["charter_id"]
            isOneToOne: false
            referencedRelation: "charters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "annual_assessment_and_metrics_data_charter_id_fkey"
            columns: ["charter_id"]
            isOneToOne: false
            referencedRelation: "details_charters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "annual_assessment_and_metrics_data_charter_id_fkey"
            columns: ["charter_id"]
            isOneToOne: false
            referencedRelation: "grid_charter"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "annual_assessment_and_metrics_data_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "details_schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "annual_assessment_and_metrics_data_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "grid_school"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "annual_assessment_and_metrics_data_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "logo_urls_by_school"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "annual_assessment_and_metrics_data_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      annual_enrollment_and_demographics: {
        Row: {
          charter_id: string | null
          enrolled_bipoc: number | null
          enrolled_ell: number | null
          enrolled_frl: number | null
          enrolled_sped: number | null
          enrolled_students_total: number | null
          id: string
          school_id: string | null
          school_year: string | null
        }
        Insert: {
          charter_id?: string | null
          enrolled_bipoc?: number | null
          enrolled_ell?: number | null
          enrolled_frl?: number | null
          enrolled_sped?: number | null
          enrolled_students_total?: number | null
          id?: string
          school_id?: string | null
          school_year?: string | null
        }
        Update: {
          charter_id?: string | null
          enrolled_bipoc?: number | null
          enrolled_ell?: number | null
          enrolled_frl?: number | null
          enrolled_sped?: number | null
          enrolled_students_total?: number | null
          id?: string
          school_id?: string | null
          school_year?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "annual_enrollment_and_demographics_charter_id_fkey"
            columns: ["charter_id"]
            isOneToOne: false
            referencedRelation: "charters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "annual_enrollment_and_demographics_charter_id_fkey"
            columns: ["charter_id"]
            isOneToOne: false
            referencedRelation: "details_charters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "annual_enrollment_and_demographics_charter_id_fkey"
            columns: ["charter_id"]
            isOneToOne: false
            referencedRelation: "grid_charter"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "annual_enrollment_and_demographics_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "details_schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "annual_enrollment_and_demographics_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "grid_school"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "annual_enrollment_and_demographics_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "logo_urls_by_school"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "annual_enrollment_and_demographics_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      charter_applications: {
        Row: {
          app_deadline: string | null
          app_status: Database["public"]["Enums"]["charter_app_status"] | null
          app_submitted: boolean | null
          app_walkthrough_date: string | null
          app_window: string | null
          auth_decision:
            | Database["public"]["Enums"]["authorizor_decisions"]
            | null
          authorizor: string | null
          beg_age: Database["public"]["Enums"]["ages-grades"] | null
          board_membership_signed_date: string | null
          budget_exercises: string | null
          budget_final: string | null
          capacity_intv_completed_date: string | null
          capacity_intv_proj_date: string | null
          capacity_intv_training_complete: boolean | null
          charter_app_pm_plan_complete: boolean | null
          charter_app_roles_set: boolean | null
          charter_id: string | null
          comm_engagement_underway: boolean | null
          decision_expected_date: string | null
          design_advice_session_complete: boolean | null
          design_album: string | null
          end_age: Database["public"]["Enums"]["ages-grades"] | null
          id: string
          internal_support_meeting_date: string | null
          is_archived: boolean | null
          joint_kickoff_meeting_date: string | null
          logic_model_complete: boolean | null
          loi: string | null
          loi_deadline: string | null
          loi_doc: string | null
          loi_required: boolean | null
          loi_submitted: boolean | null
          most_recent_app: boolean | null
          nonprofit_status: string | null
          num_students: number | null
          odds_authorization: string | null
          odds_on_time_open: string | null
          old_id: string | null
          opps_challenges: string | null
          support_timeline: string | null
          target_open: string | null
          team: string | null
        }
        Insert: {
          app_deadline?: string | null
          app_status?: Database["public"]["Enums"]["charter_app_status"] | null
          app_submitted?: boolean | null
          app_walkthrough_date?: string | null
          app_window?: string | null
          auth_decision?:
            | Database["public"]["Enums"]["authorizor_decisions"]
            | null
          authorizor?: string | null
          beg_age?: Database["public"]["Enums"]["ages-grades"] | null
          board_membership_signed_date?: string | null
          budget_exercises?: string | null
          budget_final?: string | null
          capacity_intv_completed_date?: string | null
          capacity_intv_proj_date?: string | null
          capacity_intv_training_complete?: boolean | null
          charter_app_pm_plan_complete?: boolean | null
          charter_app_roles_set?: boolean | null
          charter_id?: string | null
          comm_engagement_underway?: boolean | null
          decision_expected_date?: string | null
          design_advice_session_complete?: boolean | null
          design_album?: string | null
          end_age?: Database["public"]["Enums"]["ages-grades"] | null
          id?: string
          internal_support_meeting_date?: string | null
          is_archived?: boolean | null
          joint_kickoff_meeting_date?: string | null
          logic_model_complete?: boolean | null
          loi?: string | null
          loi_deadline?: string | null
          loi_doc?: string | null
          loi_required?: boolean | null
          loi_submitted?: boolean | null
          most_recent_app?: boolean | null
          nonprofit_status?: string | null
          num_students?: number | null
          odds_authorization?: string | null
          odds_on_time_open?: string | null
          old_id?: string | null
          opps_challenges?: string | null
          support_timeline?: string | null
          target_open?: string | null
          team?: string | null
        }
        Update: {
          app_deadline?: string | null
          app_status?: Database["public"]["Enums"]["charter_app_status"] | null
          app_submitted?: boolean | null
          app_walkthrough_date?: string | null
          app_window?: string | null
          auth_decision?:
            | Database["public"]["Enums"]["authorizor_decisions"]
            | null
          authorizor?: string | null
          beg_age?: Database["public"]["Enums"]["ages-grades"] | null
          board_membership_signed_date?: string | null
          budget_exercises?: string | null
          budget_final?: string | null
          capacity_intv_completed_date?: string | null
          capacity_intv_proj_date?: string | null
          capacity_intv_training_complete?: boolean | null
          charter_app_pm_plan_complete?: boolean | null
          charter_app_roles_set?: boolean | null
          charter_id?: string | null
          comm_engagement_underway?: boolean | null
          decision_expected_date?: string | null
          design_advice_session_complete?: boolean | null
          design_album?: string | null
          end_age?: Database["public"]["Enums"]["ages-grades"] | null
          id?: string
          internal_support_meeting_date?: string | null
          is_archived?: boolean | null
          joint_kickoff_meeting_date?: string | null
          logic_model_complete?: boolean | null
          loi?: string | null
          loi_deadline?: string | null
          loi_doc?: string | null
          loi_required?: boolean | null
          loi_submitted?: boolean | null
          most_recent_app?: boolean | null
          nonprofit_status?: string | null
          num_students?: number | null
          odds_authorization?: string | null
          odds_on_time_open?: string | null
          old_id?: string | null
          opps_challenges?: string | null
          support_timeline?: string | null
          target_open?: string | null
          team?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "charter_applications_charter_id_fkey"
            columns: ["charter_id"]
            isOneToOne: false
            referencedRelation: "charters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "charter_applications_charter_id_fkey"
            columns: ["charter_id"]
            isOneToOne: false
            referencedRelation: "details_charters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "charter_applications_charter_id_fkey"
            columns: ["charter_id"]
            isOneToOne: false
            referencedRelation: "grid_charter"
            referencedColumns: ["id"]
          },
        ]
      }
      charter_authorization_actions: {
        Row: {
          action: string | null
          action_date: string | null
          authorized_after_action: boolean | null
          authorizer: string | null
          charter_id: string | null
          id: string
          is_archived: boolean | null
        }
        Insert: {
          action?: string | null
          action_date?: string | null
          authorized_after_action?: boolean | null
          authorizer?: string | null
          charter_id?: string | null
          id?: string
          is_archived?: boolean | null
        }
        Update: {
          action?: string | null
          action_date?: string | null
          authorized_after_action?: boolean | null
          authorizer?: string | null
          charter_id?: string | null
          id?: string
          is_archived?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "charter_authorization_actions_authorizer_fkey"
            columns: ["authorizer"]
            isOneToOne: false
            referencedRelation: "charter_authorizers"
            referencedColumns: ["authorizer_name"]
          },
        ]
      }
      charter_authorizers: {
        Row: {
          active: boolean
          authorizer_name: string
          charter_id: string
          is_archived: boolean | null
          start_of_authorization: string | null
        }
        Insert: {
          active: boolean
          authorizer_name: string
          charter_id: string
          is_archived?: boolean | null
          start_of_authorization?: string | null
        }
        Update: {
          active?: boolean
          authorizer_name?: string
          charter_id?: string
          is_archived?: boolean | null
          start_of_authorization?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "charter_authorizers_charter_id_fkey"
            columns: ["charter_id"]
            isOneToOne: false
            referencedRelation: "charters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "charter_authorizers_charter_id_fkey"
            columns: ["charter_id"]
            isOneToOne: false
            referencedRelation: "details_charters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "charter_authorizers_charter_id_fkey"
            columns: ["charter_id"]
            isOneToOne: false
            referencedRelation: "grid_charter"
            referencedColumns: ["id"]
          },
        ]
      }
      charters: {
        Row: {
          application: string | null
          cohorts: string[] | null
          current_fy_end: Database["public"]["Enums"]["fiscal_year_end"] | null
          ein: string | null
          first_site_opened_date: string | null
          full_name: string | null
          group_exemption_status:
            | Database["public"]["Enums"]["group_exemption_status"]
            | null
          guidestar_listing_requested: boolean | null
          id: string
          incorp_date: string | null
          initial_authorization: string | null
          initial_authorizer: string | null
          initial_target_geo: string | null
          initial_target_planes:
            | Database["public"]["Enums"]["developmental_planes"][]
            | null
          is_archived: boolean | null
          landscape_analysis: string | null
          membership_status: string | null
          non_discrimination_policy_on_website: boolean | null
          non_tl_roles: string | null
          nonprofit_status: boolean | null
          old_id: string
          partnership_with_wf: string | null
          school_provided_1023: boolean | null
          short_name: string | null
          status: Database["public"]["Enums"]["charter_status"] | null
          website: string | null
        }
        Insert: {
          application?: string | null
          cohorts?: string[] | null
          current_fy_end?: Database["public"]["Enums"]["fiscal_year_end"] | null
          ein?: string | null
          first_site_opened_date?: string | null
          full_name?: string | null
          group_exemption_status?:
            | Database["public"]["Enums"]["group_exemption_status"]
            | null
          guidestar_listing_requested?: boolean | null
          id?: string
          incorp_date?: string | null
          initial_authorization?: string | null
          initial_authorizer?: string | null
          initial_target_geo?: string | null
          initial_target_planes?:
            | Database["public"]["Enums"]["developmental_planes"][]
            | null
          is_archived?: boolean | null
          landscape_analysis?: string | null
          membership_status?: string | null
          non_discrimination_policy_on_website?: boolean | null
          non_tl_roles?: string | null
          nonprofit_status?: boolean | null
          old_id: string
          partnership_with_wf?: string | null
          school_provided_1023?: boolean | null
          short_name?: string | null
          status?: Database["public"]["Enums"]["charter_status"] | null
          website?: string | null
        }
        Update: {
          application?: string | null
          cohorts?: string[] | null
          current_fy_end?: Database["public"]["Enums"]["fiscal_year_end"] | null
          ein?: string | null
          first_site_opened_date?: string | null
          full_name?: string | null
          group_exemption_status?:
            | Database["public"]["Enums"]["group_exemption_status"]
            | null
          guidestar_listing_requested?: boolean | null
          id?: string
          incorp_date?: string | null
          initial_authorization?: string | null
          initial_authorizer?: string | null
          initial_target_geo?: string | null
          initial_target_planes?:
            | Database["public"]["Enums"]["developmental_planes"][]
            | null
          is_archived?: boolean | null
          landscape_analysis?: string | null
          membership_status?: string | null
          non_discrimination_policy_on_website?: boolean | null
          non_tl_roles?: string | null
          nonprofit_status?: boolean | null
          old_id?: string
          partnership_with_wf?: string | null
          school_provided_1023?: boolean | null
          short_name?: string | null
          status?: Database["public"]["Enums"]["charter_status"] | null
          website?: string | null
        }
        Relationships: []
      }
      cohort_participation: {
        Row: {
          charter_id: string | null
          cohort: string | null
          created_at: string
          id: string
          is_archived: boolean | null
          participation_status: string | null
          people_id: string | null
          school_id: string | null
        }
        Insert: {
          charter_id?: string | null
          cohort?: string | null
          created_at?: string
          id?: string
          is_archived?: boolean | null
          participation_status?: string | null
          people_id?: string | null
          school_id?: string | null
        }
        Update: {
          charter_id?: string | null
          cohort?: string | null
          created_at?: string
          id?: string
          is_archived?: boolean | null
          participation_status?: string | null
          people_id?: string | null
          school_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cohort_participation_cohort_fkey"
            columns: ["cohort"]
            isOneToOne: false
            referencedRelation: "cohorts"
            referencedColumns: ["cohort_title"]
          },
        ]
      }
      cohorts: {
        Row: {
          cohort_title: string
          cohort_type: string | null
          end_date: string | null
          is_active: boolean | null
          start_date: string | null
        }
        Insert: {
          cohort_title?: string
          cohort_type?: string | null
          end_date?: string | null
          is_active?: boolean | null
          start_date?: string | null
        }
        Update: {
          cohort_title?: string
          cohort_type?: string | null
          end_date?: string | null
          is_active?: boolean | null
          start_date?: string | null
        }
        Relationships: []
      }
      developer_notes: {
        Row: {
          comment: string | null
          created_at: string
          created_by: string | null
          developer_target_fix_date: string | null
          focus_area: string | null
          id: number
          logs: string | null
          notes_type: Database["public"]["Enums"]["dev_note_type"][] | null
          screenshot_link: string | null
          status: Database["public"]["Enums"]["action_step_status"] | null
          user_priority: Database["public"]["Enums"]["high_med_low"] | null
        }
        Insert: {
          comment?: string | null
          created_at?: string
          created_by?: string | null
          developer_target_fix_date?: string | null
          focus_area?: string | null
          id?: number
          logs?: string | null
          notes_type?: Database["public"]["Enums"]["dev_note_type"][] | null
          screenshot_link?: string | null
          status?: Database["public"]["Enums"]["action_step_status"] | null
          user_priority?: Database["public"]["Enums"]["high_med_low"] | null
        }
        Update: {
          comment?: string | null
          created_at?: string
          created_by?: string | null
          developer_target_fix_date?: string | null
          focus_area?: string | null
          id?: number
          logs?: string | null
          notes_type?: Database["public"]["Enums"]["dev_note_type"][] | null
          screenshot_link?: string | null
          status?: Database["public"]["Enums"]["action_step_status"] | null
          user_priority?: Database["public"]["Enums"]["high_med_low"] | null
        }
        Relationships: []
      }
      document_checklist: {
        Row: {
          document_name: string
          group: string | null
          order_within_group: number | null
          required_by: string | null
        }
        Insert: {
          document_name: string
          group?: string | null
          order_within_group?: number | null
          required_by?: string | null
        }
        Update: {
          document_name?: string
          group?: string | null
          order_within_group?: number | null
          required_by?: string | null
        }
        Relationships: []
      }
      email_addresses: {
        Row: {
          category:
            | Database["public"]["Enums"]["email_address_categories"]
            | null
          created_at: string
          email_address: string
          id: string
          is_archived: boolean | null
          is_primary: boolean | null
          is_valid: boolean
          people_id: string | null
          people_roles_associations_id: string | null
        }
        Insert: {
          category?:
            | Database["public"]["Enums"]["email_address_categories"]
            | null
          created_at?: string
          email_address: string
          id?: string
          is_archived?: boolean | null
          is_primary?: boolean | null
          is_valid?: boolean
          people_id?: string | null
          people_roles_associations_id?: string | null
        }
        Update: {
          category?:
            | Database["public"]["Enums"]["email_address_categories"]
            | null
          created_at?: string
          email_address?: string
          id?: string
          is_archived?: boolean | null
          is_primary?: boolean | null
          is_valid?: boolean
          people_id?: string | null
          people_roles_associations_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_addresses_people_id_fkey"
            columns: ["people_id"]
            isOneToOne: false
            referencedRelation: "details_educators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_addresses_people_id_fkey"
            columns: ["people_id"]
            isOneToOne: false
            referencedRelation: "grid_educator"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_addresses_people_id_fkey"
            columns: ["people_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_addresses_people_roles_associations_id_fkey"
            columns: ["people_roles_associations_id"]
            isOneToOne: false
            referencedRelation: "details_associations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_addresses_people_roles_associations_id_fkey"
            columns: ["people_roles_associations_id"]
            isOneToOne: false
            referencedRelation: "people_roles_associations"
            referencedColumns: ["id"]
          },
        ]
      }
      email_drafts: {
        Row: {
          bcc_emails: string[] | null
          body: string | null
          cc_emails: string[] | null
          id: string
          is_archived: boolean | null
          sent: boolean | null
          sent_at: string | null
          subject: string | null
          to_emails: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bcc_emails?: string[] | null
          body?: string | null
          cc_emails?: string[] | null
          id?: string
          is_archived?: boolean | null
          sent?: boolean | null
          sent_at?: string | null
          subject?: string | null
          to_emails?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bcc_emails?: string[] | null
          body?: string | null
          cc_emails?: string[] | null
          id?: string
          is_archived?: boolean | null
          sent?: boolean | null
          sent_at?: string | null
          subject?: string | null
          to_emails?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      errors: {
        Row: {
          charter_id: string | null
          created_at: string
          error_type: string | null
          id: number
          people_id: string | null
          resolved_datetime: string | null
          school_id: string | null
        }
        Insert: {
          charter_id?: string | null
          created_at?: string
          error_type?: string | null
          id?: number
          people_id?: string | null
          resolved_datetime?: string | null
          school_id?: string | null
        }
        Update: {
          charter_id?: string | null
          created_at?: string
          error_type?: string | null
          id?: number
          people_id?: string | null
          resolved_datetime?: string | null
          school_id?: string | null
        }
        Relationships: []
      }
      event_attendance: {
        Row: {
          attended_event: boolean | null
          duration_at_event_in_minutes: number | null
          event_name: string | null
          id: string
          is_archived: boolean | null
          people_id: string | null
          registration_date: string | null
          spanish_translation_needed: boolean | null
        }
        Insert: {
          attended_event?: boolean | null
          duration_at_event_in_minutes?: number | null
          event_name?: string | null
          id?: string
          is_archived?: boolean | null
          people_id?: string | null
          registration_date?: string | null
          spanish_translation_needed?: boolean | null
        }
        Update: {
          attended_event?: boolean | null
          duration_at_event_in_minutes?: number | null
          event_name?: string | null
          id?: string
          is_archived?: boolean | null
          people_id?: string | null
          registration_date?: string | null
          spanish_translation_needed?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "event_attendance_event_name_fkey"
            columns: ["event_name"]
            isOneToOne: false
            referencedRelation: "event_list"
            referencedColumns: ["event_name"]
          },
          {
            foreignKeyName: "event_attendance_people_id_fkey"
            columns: ["people_id"]
            isOneToOne: false
            referencedRelation: "details_educators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_attendance_people_id_fkey"
            columns: ["people_id"]
            isOneToOne: false
            referencedRelation: "grid_educator"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_attendance_people_id_fkey"
            columns: ["people_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      event_list: {
        Row: {
          event_date: string | null
          event_name: string
          is_archived: boolean | null
          type: string | null
        }
        Insert: {
          event_date?: string | null
          event_name: string
          is_archived?: boolean | null
          type?: string | null
        }
        Update: {
          event_date?: string | null
          event_name?: string
          is_archived?: boolean | null
          type?: string | null
        }
        Relationships: []
      }
      governance_docs: {
        Row: {
          charter_id: string | null
          doc_type: string | null
          id: string
          is_archived: boolean | null
          object_id: string | null
          pdf: string | null
          school_id: string | null
          upload_date: string | null
        }
        Insert: {
          charter_id?: string | null
          doc_type?: string | null
          id?: string
          is_archived?: boolean | null
          object_id?: string | null
          pdf?: string | null
          school_id?: string | null
          upload_date?: string | null
        }
        Update: {
          charter_id?: string | null
          doc_type?: string | null
          id?: string
          is_archived?: boolean | null
          object_id?: string | null
          pdf?: string | null
          school_id?: string | null
          upload_date?: string | null
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
            foreignKeyName: "governance_docs_charter_id_fkey"
            columns: ["charter_id"]
            isOneToOne: false
            referencedRelation: "details_charters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "governance_docs_charter_id_fkey"
            columns: ["charter_id"]
            isOneToOne: false
            referencedRelation: "grid_charter"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "governance_docs_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "details_schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "governance_docs_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "grid_school"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "governance_docs_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "logo_urls_by_school"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "governance_docs_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      grants: {
        Row: {
          accounting_notes: string | null
          actual_501c3_proof: string | null
          actual_ein: string | null
          actual_mailing_address: string | null
          actual_membership_status: string | null
          actual_nonprofit_status: string | null
          actual_school_legal_name: string | null
          actual_tl_emails: string | null
          actual_tls: string | null
          amount: number | null
          automation_step_trigger:
            | Database["public"]["Enums"]["automation_step_trigger"]
            | null
          bill_account: string | null
          charter_id: string | null
          end_of_full_advice_window: string | null
          full_advice_request_timestamp: string | null
          funding_period: string | null
          funding_purpose: string | null
          funding_source: string | null
          grant_advice: string | null
          grant_status: string | null
          guide_first_name: string | null
          id: string
          is_archived: boolean | null
          issue_date: string | null
          issued_by: string | null
          label: string | null
          ledger_entry: string | null
          notes: string | null
          old_school_id: string | null
          people_id: string | null
          prelim_advice_request_timestamp: string | null
          qbo_number: number | null
          ready_to_accept_flag: string | null
          ready_to_issue_grant_letter_flag: string | null
          "School Grant Name": string | null
          school_id: string | null
          signed_grant_agreement: string | null
          unsigned_grant_agreement: string | null
        }
        Insert: {
          accounting_notes?: string | null
          actual_501c3_proof?: string | null
          actual_ein?: string | null
          actual_mailing_address?: string | null
          actual_membership_status?: string | null
          actual_nonprofit_status?: string | null
          actual_school_legal_name?: string | null
          actual_tl_emails?: string | null
          actual_tls?: string | null
          amount?: number | null
          automation_step_trigger?:
            | Database["public"]["Enums"]["automation_step_trigger"]
            | null
          bill_account?: string | null
          charter_id?: string | null
          end_of_full_advice_window?: string | null
          full_advice_request_timestamp?: string | null
          funding_period?: string | null
          funding_purpose?: string | null
          funding_source?: string | null
          grant_advice?: string | null
          grant_status?: string | null
          guide_first_name?: string | null
          id?: string
          is_archived?: boolean | null
          issue_date?: string | null
          issued_by?: string | null
          label?: string | null
          ledger_entry?: string | null
          notes?: string | null
          old_school_id?: string | null
          people_id?: string | null
          prelim_advice_request_timestamp?: string | null
          qbo_number?: number | null
          ready_to_accept_flag?: string | null
          ready_to_issue_grant_letter_flag?: string | null
          "School Grant Name"?: string | null
          school_id?: string | null
          signed_grant_agreement?: string | null
          unsigned_grant_agreement?: string | null
        }
        Update: {
          accounting_notes?: string | null
          actual_501c3_proof?: string | null
          actual_ein?: string | null
          actual_mailing_address?: string | null
          actual_membership_status?: string | null
          actual_nonprofit_status?: string | null
          actual_school_legal_name?: string | null
          actual_tl_emails?: string | null
          actual_tls?: string | null
          amount?: number | null
          automation_step_trigger?:
            | Database["public"]["Enums"]["automation_step_trigger"]
            | null
          bill_account?: string | null
          charter_id?: string | null
          end_of_full_advice_window?: string | null
          full_advice_request_timestamp?: string | null
          funding_period?: string | null
          funding_purpose?: string | null
          funding_source?: string | null
          grant_advice?: string | null
          grant_status?: string | null
          guide_first_name?: string | null
          id?: string
          is_archived?: boolean | null
          issue_date?: string | null
          issued_by?: string | null
          label?: string | null
          ledger_entry?: string | null
          notes?: string | null
          old_school_id?: string | null
          people_id?: string | null
          prelim_advice_request_timestamp?: string | null
          qbo_number?: number | null
          ready_to_accept_flag?: string | null
          ready_to_issue_grant_letter_flag?: string | null
          "School Grant Name"?: string | null
          school_id?: string | null
          signed_grant_agreement?: string | null
          unsigned_grant_agreement?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "grants_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "details_schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grants_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "grid_school"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grants_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "logo_urls_by_school"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "grants_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      group_exemption_actions: {
        Row: {
          action: string | null
          action_date: string | null
          charter_id: string | null
          created_at: string
          group_exemption_status_after_action:
            | Database["public"]["Enums"]["group_exemption_status"]
            | null
          id: string
          is_archived: boolean | null
          notes: string | null
          school_id: string | null
        }
        Insert: {
          action?: string | null
          action_date?: string | null
          charter_id?: string | null
          created_at?: string
          group_exemption_status_after_action?:
            | Database["public"]["Enums"]["group_exemption_status"]
            | null
          id?: string
          is_archived?: boolean | null
          notes?: string | null
          school_id?: string | null
        }
        Update: {
          action?: string | null
          action_date?: string | null
          charter_id?: string | null
          created_at?: string
          group_exemption_status_after_action?:
            | Database["public"]["Enums"]["group_exemption_status"]
            | null
          id?: string
          is_archived?: boolean | null
          notes?: string | null
          school_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_exemption_actions_charter_id_fkey"
            columns: ["charter_id"]
            isOneToOne: false
            referencedRelation: "charters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_exemption_actions_charter_id_fkey"
            columns: ["charter_id"]
            isOneToOne: false
            referencedRelation: "details_charters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_exemption_actions_charter_id_fkey"
            columns: ["charter_id"]
            isOneToOne: false
            referencedRelation: "grid_charter"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_exemption_actions_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "details_schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_exemption_actions_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "grid_school"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_exemption_actions_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "logo_urls_by_school"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "group_exemption_actions_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      guide_assignments: {
        Row: {
          charter_id: string | null
          email_or_name: string | null
          end_date: string | null
          guide_id: string | null
          id: string
          is_active: boolean | null
          is_archived: boolean | null
          old_id: string
          school_id: string | null
          start_date: string | null
          type: Database["public"]["Enums"]["guide_types"] | null
        }
        Insert: {
          charter_id?: string | null
          email_or_name?: string | null
          end_date?: string | null
          guide_id?: string | null
          id?: string
          is_active?: boolean | null
          is_archived?: boolean | null
          old_id: string
          school_id?: string | null
          start_date?: string | null
          type?: Database["public"]["Enums"]["guide_types"] | null
        }
        Update: {
          charter_id?: string | null
          email_or_name?: string | null
          end_date?: string | null
          guide_id?: string | null
          id?: string
          is_active?: boolean | null
          is_archived?: boolean | null
          old_id?: string
          school_id?: string | null
          start_date?: string | null
          type?: Database["public"]["Enums"]["guide_types"] | null
        }
        Relationships: [
          {
            foreignKeyName: "guide_assignments_charter_id_fkey"
            columns: ["charter_id"]
            isOneToOne: false
            referencedRelation: "charters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guide_assignments_charter_id_fkey"
            columns: ["charter_id"]
            isOneToOne: false
            referencedRelation: "details_charters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guide_assignments_charter_id_fkey"
            columns: ["charter_id"]
            isOneToOne: false
            referencedRelation: "grid_charter"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guide_assignments_email_or_name_fkey"
            columns: ["email_or_name"]
            isOneToOne: false
            referencedRelation: "guides"
            referencedColumns: ["email_or_name"]
          },
          {
            foreignKeyName: "guide_assignments_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "details_schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guide_assignments_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "grid_school"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guide_assignments_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "logo_urls_by_school"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "guide_assignments_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      guides: {
        Row: {
          birthdate: string | null
          email: string | null
          email_or_name: string
          full_name: string | null
          home_address: string | null
          image_url: string | null
          is_active: boolean | null
          is_archived: boolean | null
          old_id: string | null
          partner_roles: Database["public"]["Enums"]["partner_roles"][] | null
          phone: string | null
          short_name: string | null
        }
        Insert: {
          birthdate?: string | null
          email?: string | null
          email_or_name: string
          full_name?: string | null
          home_address?: string | null
          image_url?: string | null
          is_active?: boolean | null
          is_archived?: boolean | null
          old_id?: string | null
          partner_roles?: Database["public"]["Enums"]["partner_roles"][] | null
          phone?: string | null
          short_name?: string | null
        }
        Update: {
          birthdate?: string | null
          email?: string | null
          email_or_name?: string
          full_name?: string | null
          home_address?: string | null
          image_url?: string | null
          is_active?: boolean | null
          is_archived?: boolean | null
          old_id?: string | null
          partner_roles?: Database["public"]["Enums"]["partner_roles"][] | null
          phone?: string | null
          short_name?: string | null
        }
        Relationships: []
      }
      lead_routing_and_templates: {
        Row: {
          cc: string | null
          geo_type: string | null
          growth_lead: string | null
          indiv_type: string | null
          indiv_type_array: string[] | null
          is_archived: boolean | null
          language: string | null
          language_array: Database["public"]["Enums"]["languages"][] | null
          rule: string
          sender: string | null
          sendgrid_template_id: string | null
          source: string | null
          states: string | null
          states_array:
            | Database["public"]["Enums"]["state_abbreviation_enum"][]
            | null
          us_or_intl: string | null
          us_or_intl_array: string[] | null
        }
        Insert: {
          cc?: string | null
          geo_type?: string | null
          growth_lead?: string | null
          indiv_type?: string | null
          indiv_type_array?: string[] | null
          is_archived?: boolean | null
          language?: string | null
          language_array?: Database["public"]["Enums"]["languages"][] | null
          rule: string
          sender?: string | null
          sendgrid_template_id?: string | null
          source?: string | null
          states?: string | null
          states_array?:
            | Database["public"]["Enums"]["state_abbreviation_enum"][]
            | null
          us_or_intl?: string | null
          us_or_intl_array?: string[] | null
        }
        Update: {
          cc?: string | null
          geo_type?: string | null
          growth_lead?: string | null
          indiv_type?: string | null
          indiv_type_array?: string[] | null
          is_archived?: boolean | null
          language?: string | null
          language_array?: Database["public"]["Enums"]["languages"][] | null
          rule?: string
          sender?: string | null
          sendgrid_template_id?: string | null
          source?: string | null
          states?: string | null
          states_array?:
            | Database["public"]["Enums"]["state_abbreviation_enum"][]
            | null
          us_or_intl?: string | null
          us_or_intl_array?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_routing_and_templates_growth_lead_fkey"
            columns: ["growth_lead"]
            isOneToOne: false
            referencedRelation: "guides"
            referencedColumns: ["email"]
          },
        ]
      }
      loans: {
        Row: {
          amount_issued: number | null
          charter_id: string | null
          id: string
          interest_rate: number | null
          is_archived: boolean | null
          issue_date: string | null
          "Loan Key": string | null
          loan_docs: string | null
          loan_status: Database["public"]["Enums"]["loan_status_options"] | null
          maturity: string | null
          notes: string | null
          old_id: string | null
          school_id: string | null
          use_of_proceeds:
            | Database["public"]["Enums"]["use_of_proceeds_options"]
            | null
          vehicle: Database["public"]["Enums"]["loan_vehicle_options"] | null
        }
        Insert: {
          amount_issued?: number | null
          charter_id?: string | null
          id?: string
          interest_rate?: number | null
          is_archived?: boolean | null
          issue_date?: string | null
          "Loan Key"?: string | null
          loan_docs?: string | null
          loan_status?:
            | Database["public"]["Enums"]["loan_status_options"]
            | null
          maturity?: string | null
          notes?: string | null
          old_id?: string | null
          school_id?: string | null
          use_of_proceeds?:
            | Database["public"]["Enums"]["use_of_proceeds_options"]
            | null
          vehicle?: Database["public"]["Enums"]["loan_vehicle_options"] | null
        }
        Update: {
          amount_issued?: number | null
          charter_id?: string | null
          id?: string
          interest_rate?: number | null
          is_archived?: boolean | null
          issue_date?: string | null
          "Loan Key"?: string | null
          loan_docs?: string | null
          loan_status?:
            | Database["public"]["Enums"]["loan_status_options"]
            | null
          maturity?: string | null
          notes?: string | null
          old_id?: string | null
          school_id?: string | null
          use_of_proceeds?:
            | Database["public"]["Enums"]["use_of_proceeds_options"]
            | null
          vehicle?: Database["public"]["Enums"]["loan_vehicle_options"] | null
        }
        Relationships: [
          {
            foreignKeyName: "loans_charter_id_fkey"
            columns: ["charter_id"]
            isOneToOne: false
            referencedRelation: "charters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loans_charter_id_fkey"
            columns: ["charter_id"]
            isOneToOne: false
            referencedRelation: "details_charters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loans_charter_id_fkey"
            columns: ["charter_id"]
            isOneToOne: false
            referencedRelation: "grid_charter"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loans_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "details_schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loans_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "grid_school"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loans_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "logo_urls_by_school"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "loans_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          address: string | null
          census_tract: string | null
          charter_id: string | null
          city: string | null
          co_location_partner: string | null
          co_location_type: string | null
          country: string | null
          created_datetime: string | null
          current_mail_address: boolean | null
          current_physical_address: boolean | null
          end_date: string | null
          geocode_last_run_at: string | null
          id: string
          is_archived: boolean | null
          lat: number | null
          lease_docs: string[] | null
          lease_end_date: string | null
          long: number | null
          mailable: boolean | null
          max_students: number | null
          modified_datetime: string | null
          neighborhood: string | null
          physical: boolean | null
          qualified_low_income_tract: boolean | null
          school_id: string | null
          sq_ft: number | null
          start_date: string | null
          state: string | null
          street: string | null
          zip: string | null
        }
        Insert: {
          address?: string | null
          census_tract?: string | null
          charter_id?: string | null
          city?: string | null
          co_location_partner?: string | null
          co_location_type?: string | null
          country?: string | null
          created_datetime?: string | null
          current_mail_address?: boolean | null
          current_physical_address?: boolean | null
          end_date?: string | null
          geocode_last_run_at?: string | null
          id?: string
          is_archived?: boolean | null
          lat?: number | null
          lease_docs?: string[] | null
          lease_end_date?: string | null
          long?: number | null
          mailable?: boolean | null
          max_students?: number | null
          modified_datetime?: string | null
          neighborhood?: string | null
          physical?: boolean | null
          qualified_low_income_tract?: boolean | null
          school_id?: string | null
          sq_ft?: number | null
          start_date?: string | null
          state?: string | null
          street?: string | null
          zip?: string | null
        }
        Update: {
          address?: string | null
          census_tract?: string | null
          charter_id?: string | null
          city?: string | null
          co_location_partner?: string | null
          co_location_type?: string | null
          country?: string | null
          created_datetime?: string | null
          current_mail_address?: boolean | null
          current_physical_address?: boolean | null
          end_date?: string | null
          geocode_last_run_at?: string | null
          id?: string
          is_archived?: boolean | null
          lat?: number | null
          lease_docs?: string[] | null
          lease_end_date?: string | null
          long?: number | null
          mailable?: boolean | null
          max_students?: number | null
          modified_datetime?: string | null
          neighborhood?: string | null
          physical?: boolean | null
          qualified_low_income_tract?: boolean | null
          school_id?: string | null
          sq_ft?: number | null
          start_date?: string | null
          state?: string | null
          street?: string | null
          zip?: string | null
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
            foreignKeyName: "locations_charter_id_fkey"
            columns: ["charter_id"]
            isOneToOne: false
            referencedRelation: "details_charters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "locations_charter_id_fkey"
            columns: ["charter_id"]
            isOneToOne: false
            referencedRelation: "grid_charter"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "locations_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "details_schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "locations_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "grid_school"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "locations_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "logo_urls_by_school"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "locations_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      mailing_lists: {
        Row: {
          google_group_id: string
          is_archived: boolean | null
          name: string | null
          slug: string | null
          sub_name: string
          type: string | null
        }
        Insert: {
          google_group_id: string
          is_archived?: boolean | null
          name?: string | null
          slug?: string | null
          sub_name: string
          type?: string | null
        }
        Update: {
          google_group_id?: string
          is_archived?: boolean | null
          name?: string | null
          slug?: string | null
          sub_name?: string
          type?: string | null
        }
        Relationships: []
      }
      membership_actions: {
        Row: {
          action:
            | Database["public"]["Enums"]["membership_action_options"]
            | null
          action_date: string | null
          agreement_version: string | null
          attachments: string | null
          charter_id: string | null
          created_at: string | null
          id: string
          is_archived: boolean | null
          membership_status_after_action: string | null
          notes: string | null
          school_id: string | null
        }
        Insert: {
          action?:
            | Database["public"]["Enums"]["membership_action_options"]
            | null
          action_date?: string | null
          agreement_version?: string | null
          attachments?: string | null
          charter_id?: string | null
          created_at?: string | null
          id?: string
          is_archived?: boolean | null
          membership_status_after_action?: string | null
          notes?: string | null
          school_id?: string | null
        }
        Update: {
          action?:
            | Database["public"]["Enums"]["membership_action_options"]
            | null
          action_date?: string | null
          agreement_version?: string | null
          attachments?: string | null
          charter_id?: string | null
          created_at?: string | null
          id?: string
          is_archived?: boolean | null
          membership_status_after_action?: string | null
          notes?: string | null
          school_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "membership_actions_charter_id_fkey"
            columns: ["charter_id"]
            isOneToOne: false
            referencedRelation: "charters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "membership_actions_charter_id_fkey"
            columns: ["charter_id"]
            isOneToOne: false
            referencedRelation: "details_charters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "membership_actions_charter_id_fkey"
            columns: ["charter_id"]
            isOneToOne: false
            referencedRelation: "grid_charter"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "membership_actions_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "details_schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "membership_actions_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "grid_school"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "membership_actions_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "logo_urls_by_school"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "membership_actions_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      montessori_certs: {
        Row: {
          admin_credential: boolean | null
          assistant_training: boolean | null
          association:
            | Database["public"]["Enums"]["montessori_associations"]
            | null
          cert_completion_status:
            | Database["public"]["Enums"]["certification_completion_status"]
            | null
          cert_level: Database["public"]["Enums"]["age_spans"][] | null
          created_date: string | null
          id: string
          is_archived: boolean | null
          macte_accredited: boolean | null
          people_id: string | null
          trainer: string | null
          training_center: string | null
          year: string | null
        }
        Insert: {
          admin_credential?: boolean | null
          assistant_training?: boolean | null
          association?:
            | Database["public"]["Enums"]["montessori_associations"]
            | null
          cert_completion_status?:
            | Database["public"]["Enums"]["certification_completion_status"]
            | null
          cert_level?: Database["public"]["Enums"]["age_spans"][] | null
          created_date?: string | null
          id?: string
          is_archived?: boolean | null
          macte_accredited?: boolean | null
          people_id?: string | null
          trainer?: string | null
          training_center?: string | null
          year?: string | null
        }
        Update: {
          admin_credential?: boolean | null
          assistant_training?: boolean | null
          association?:
            | Database["public"]["Enums"]["montessori_associations"]
            | null
          cert_completion_status?:
            | Database["public"]["Enums"]["certification_completion_status"]
            | null
          cert_level?: Database["public"]["Enums"]["age_spans"][] | null
          created_date?: string | null
          id?: string
          is_archived?: boolean | null
          macte_accredited?: boolean | null
          people_id?: string | null
          trainer?: string | null
          training_center?: string | null
          year?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "montessori_certs_people_id_fkey"
            columns: ["people_id"]
            isOneToOne: false
            referencedRelation: "details_educators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "montessori_certs_people_id_fkey"
            columns: ["people_id"]
            isOneToOne: false
            referencedRelation: "grid_educator"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "montessori_certs_people_id_fkey"
            columns: ["people_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      nine_nineties: {
        Row: {
          ai_derived_EOY: string | null
          ai_derived_revenue: string | null
          charter_id: string | null
          doc: string | null
          form_year: string | null
          id: string
          is_archived: boolean | null
          notes: string | null
          object_id: string | null
          pdf: string | null
          school_id: string | null
        }
        Insert: {
          ai_derived_EOY?: string | null
          ai_derived_revenue?: string | null
          charter_id?: string | null
          doc?: string | null
          form_year?: string | null
          id?: string
          is_archived?: boolean | null
          notes?: string | null
          object_id?: string | null
          pdf?: string | null
          school_id?: string | null
        }
        Update: {
          ai_derived_EOY?: string | null
          ai_derived_revenue?: string | null
          charter_id?: string | null
          doc?: string | null
          form_year?: string | null
          id?: string
          is_archived?: boolean | null
          notes?: string | null
          object_id?: string | null
          pdf?: string | null
          school_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "990s_charter_id_fkey"
            columns: ["charter_id"]
            isOneToOne: false
            referencedRelation: "charters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "990s_charter_id_fkey"
            columns: ["charter_id"]
            isOneToOne: false
            referencedRelation: "details_charters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "990s_charter_id_fkey"
            columns: ["charter_id"]
            isOneToOne: false
            referencedRelation: "grid_charter"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "990s_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "details_schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "990s_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "grid_school"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "990s_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "logo_urls_by_school"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "990s_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          action_step_id: string | null
          charter_application_id: string | null
          charter_id: string | null
          created_by: string | null
          created_date: string | null
          full_text: string | null
          governance_doc_id: string | null
          grant_id: string | null
          id: string
          is_archived: boolean | null
          is_private: boolean | null
          loan_id: string | null
          montessori_cert_id: string | null
          nine_ninety_id: string | null
          people_id: string | null
          school_id: string | null
          ssj_fillout_form_id: string | null
          title: string | null
        }
        Insert: {
          action_step_id?: string | null
          charter_application_id?: string | null
          charter_id?: string | null
          created_by?: string | null
          created_date?: string | null
          full_text?: string | null
          governance_doc_id?: string | null
          grant_id?: string | null
          id?: string
          is_archived?: boolean | null
          is_private?: boolean | null
          loan_id?: string | null
          montessori_cert_id?: string | null
          nine_ninety_id?: string | null
          people_id?: string | null
          school_id?: string | null
          ssj_fillout_form_id?: string | null
          title?: string | null
        }
        Update: {
          action_step_id?: string | null
          charter_application_id?: string | null
          charter_id?: string | null
          created_by?: string | null
          created_date?: string | null
          full_text?: string | null
          governance_doc_id?: string | null
          grant_id?: string | null
          id?: string
          is_archived?: boolean | null
          is_private?: boolean | null
          loan_id?: string | null
          montessori_cert_id?: string | null
          nine_ninety_id?: string | null
          people_id?: string | null
          school_id?: string | null
          ssj_fillout_form_id?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notes_action_step_id_fkey"
            columns: ["action_step_id"]
            isOneToOne: false
            referencedRelation: "action_steps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_charter_application_id_fkey"
            columns: ["charter_application_id"]
            isOneToOne: false
            referencedRelation: "charter_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_governance_doc_id_fkey"
            columns: ["governance_doc_id"]
            isOneToOne: false
            referencedRelation: "governance_docs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_grant_id_fkey"
            columns: ["grant_id"]
            isOneToOne: false
            referencedRelation: "grants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_loan_id_fkey"
            columns: ["loan_id"]
            isOneToOne: false
            referencedRelation: "loans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_montessori_cert_id_fkey"
            columns: ["montessori_cert_id"]
            isOneToOne: false
            referencedRelation: "montessori_certs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_nine_ninety_id_fkey"
            columns: ["nine_ninety_id"]
            isOneToOne: false
            referencedRelation: "nine_nineties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_ssj_fillout_form_id_fkey"
            columns: ["ssj_fillout_form_id"]
            isOneToOne: false
            referencedRelation: "details_educators"
            referencedColumns: ["most_recent_fillout_form_id"]
          },
          {
            foreignKeyName: "notes_ssj_fillout_form_id_fkey"
            columns: ["ssj_fillout_form_id"]
            isOneToOne: false
            referencedRelation: "ssj_fillout_forms"
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
            foreignKeyName: "school_notes_charter_id_fkey"
            columns: ["charter_id"]
            isOneToOne: false
            referencedRelation: "details_charters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_notes_charter_id_fkey"
            columns: ["charter_id"]
            isOneToOne: false
            referencedRelation: "grid_charter"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_notes_people_id_fkey"
            columns: ["people_id"]
            isOneToOne: false
            referencedRelation: "details_educators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_notes_people_id_fkey"
            columns: ["people_id"]
            isOneToOne: false
            referencedRelation: "grid_educator"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_notes_people_id_fkey"
            columns: ["people_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_notes_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "details_schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_notes_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "grid_school"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_notes_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "logo_urls_by_school"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "school_notes_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      open_date_revisions: {
        Row: {
          charter_id: string | null
          created_at: string
          id: string
          is_archived: boolean | null
          notes: string | null
          prior_proj_open_date: string | null
          proj_open_date: string | null
          school_id: string | null
        }
        Insert: {
          charter_id?: string | null
          created_at?: string
          id?: string
          is_archived?: boolean | null
          notes?: string | null
          prior_proj_open_date?: string | null
          proj_open_date?: string | null
          school_id?: string | null
        }
        Update: {
          charter_id?: string | null
          created_at?: string
          id?: string
          is_archived?: boolean | null
          notes?: string | null
          prior_proj_open_date?: string | null
          proj_open_date?: string | null
          school_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "open_date_revisions_charter_id_fkey"
            columns: ["charter_id"]
            isOneToOne: false
            referencedRelation: "charters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "open_date_revisions_charter_id_fkey"
            columns: ["charter_id"]
            isOneToOne: false
            referencedRelation: "details_charters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "open_date_revisions_charter_id_fkey"
            columns: ["charter_id"]
            isOneToOne: false
            referencedRelation: "grid_charter"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "open_date_revisions_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "details_schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "open_date_revisions_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "grid_school"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "open_date_revisions_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "logo_urls_by_school"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "open_date_revisions_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      people: {
        Row: {
          childhood_income:
            | Database["public"]["Enums"]["income_categories"]
            | null
          created: string | null
          created_by: string | null
          educ_attainment:
            | Database["public"]["Enums"]["educ_attainment_options"]
            | null
          exclude_from_email_logging: boolean | null
          first_name: string | null
          full_name: string | null
          gender: Database["public"]["Enums"]["gender_categories"] | null
          gender_other: string | null
          google_groups: string | null
          hh_income: Database["public"]["Enums"]["income_categories"] | null
          home_address: string | null
          id: string
          indiv_type: string | null
          is_archived: boolean | null
          last_modified: string | null
          last_name: string | null
          lgbtqia: boolean | null
          middle_name: string | null
          montessori_certs: Database["public"]["Enums"]["age_spans"][] | null
          nickname: string | null
          other_languages: Database["public"]["Enums"]["languages"][] | null
          primary_languages: Database["public"]["Enums"]["languages"][] | null
          primary_phone: string | null
          primary_phone_other_info: string | null
          pronouns: Database["public"]["Enums"]["pronouns"] | null
          pronouns_other: string | null
          race_ethnicity:
            | Database["public"]["Enums"]["race_ethnicity_categories"][]
            | null
          race_ethnicity_other: string | null
          secondary_phone: string | null
          secondary_phone_other_info: string | null
          source: string[] | null
          source_other: string | null
          tags: string | null
          tc_userid: string | null
        }
        Insert: {
          childhood_income?:
            | Database["public"]["Enums"]["income_categories"]
            | null
          created?: string | null
          created_by?: string | null
          educ_attainment?:
            | Database["public"]["Enums"]["educ_attainment_options"]
            | null
          exclude_from_email_logging?: boolean | null
          first_name?: string | null
          full_name?: string | null
          gender?: Database["public"]["Enums"]["gender_categories"] | null
          gender_other?: string | null
          google_groups?: string | null
          hh_income?: Database["public"]["Enums"]["income_categories"] | null
          home_address?: string | null
          id: string
          indiv_type?: string | null
          is_archived?: boolean | null
          last_modified?: string | null
          last_name?: string | null
          lgbtqia?: boolean | null
          middle_name?: string | null
          montessori_certs?: Database["public"]["Enums"]["age_spans"][] | null
          nickname?: string | null
          other_languages?: Database["public"]["Enums"]["languages"][] | null
          primary_languages?: Database["public"]["Enums"]["languages"][] | null
          primary_phone?: string | null
          primary_phone_other_info?: string | null
          pronouns?: Database["public"]["Enums"]["pronouns"] | null
          pronouns_other?: string | null
          race_ethnicity?:
            | Database["public"]["Enums"]["race_ethnicity_categories"][]
            | null
          race_ethnicity_other?: string | null
          secondary_phone?: string | null
          secondary_phone_other_info?: string | null
          source?: string[] | null
          source_other?: string | null
          tags?: string | null
          tc_userid?: string | null
        }
        Update: {
          childhood_income?:
            | Database["public"]["Enums"]["income_categories"]
            | null
          created?: string | null
          created_by?: string | null
          educ_attainment?:
            | Database["public"]["Enums"]["educ_attainment_options"]
            | null
          exclude_from_email_logging?: boolean | null
          first_name?: string | null
          full_name?: string | null
          gender?: Database["public"]["Enums"]["gender_categories"] | null
          gender_other?: string | null
          google_groups?: string | null
          hh_income?: Database["public"]["Enums"]["income_categories"] | null
          home_address?: string | null
          id?: string
          indiv_type?: string | null
          is_archived?: boolean | null
          last_modified?: string | null
          last_name?: string | null
          lgbtqia?: boolean | null
          middle_name?: string | null
          montessori_certs?: Database["public"]["Enums"]["age_spans"][] | null
          nickname?: string | null
          other_languages?: Database["public"]["Enums"]["languages"][] | null
          primary_languages?: Database["public"]["Enums"]["languages"][] | null
          primary_phone?: string | null
          primary_phone_other_info?: string | null
          pronouns?: Database["public"]["Enums"]["pronouns"] | null
          pronouns_other?: string | null
          race_ethnicity?:
            | Database["public"]["Enums"]["race_ethnicity_categories"][]
            | null
          race_ethnicity_other?: string | null
          secondary_phone?: string | null
          secondary_phone_other_info?: string | null
          source?: string[] | null
          source_other?: string | null
          tags?: string | null
          tc_userid?: string | null
        }
        Relationships: []
      }
      people_educator_early_cultivation: {
        Row: {
          assigned_partner: string | null
          assigned_partner_override: string | null
          discovery_status:
            | Database["public"]["Enums"]["discovery_statuses"]
            | null
          first_contact_ages: string | null
          first_contact_form_notes: string | null
          first_contact_governance_model: string | null
          first_contact_interests: string | null
          first_contact_notes_on_pre_wf_employment: string | null
          first_contact_wf_employment_status: string | null
          first_contact_willingness_to_relocate: string | null
          is_archived: boolean | null
          montessori_lead_guide_trainings: string | null
          notes: string | null
          old_id: string
          on_school_board: string | null
          one_on_one_scheduling_status: string | null
          opsguide_checklist: string | null
          opsguide_fundraising_opps: string | null
          opsguide_meeting_prefs: string | null
          opsguide_request_pertinent_info: string | null
          opsguide_support_type_needed: string | null
          people_id: string
          person_responsible_for_follow_up: string | null
          personal_email_sent: boolean | null
          personal_email_sent_date: string | null
          routed_to: string | null
          self_reflection_doc: string | null
          sendgrid_send_date: string | null
          sendgrid_template_selected: string | null
          target_city: string | null
          target_geo_combined: string | null
          target_intl: string | null
          target_state: string | null
          training_grants: string | null
        }
        Insert: {
          assigned_partner?: string | null
          assigned_partner_override?: string | null
          discovery_status?:
            | Database["public"]["Enums"]["discovery_statuses"]
            | null
          first_contact_ages?: string | null
          first_contact_form_notes?: string | null
          first_contact_governance_model?: string | null
          first_contact_interests?: string | null
          first_contact_notes_on_pre_wf_employment?: string | null
          first_contact_wf_employment_status?: string | null
          first_contact_willingness_to_relocate?: string | null
          is_archived?: boolean | null
          montessori_lead_guide_trainings?: string | null
          notes?: string | null
          old_id: string
          on_school_board?: string | null
          one_on_one_scheduling_status?: string | null
          opsguide_checklist?: string | null
          opsguide_fundraising_opps?: string | null
          opsguide_meeting_prefs?: string | null
          opsguide_request_pertinent_info?: string | null
          opsguide_support_type_needed?: string | null
          people_id: string
          person_responsible_for_follow_up?: string | null
          personal_email_sent?: boolean | null
          personal_email_sent_date?: string | null
          routed_to?: string | null
          self_reflection_doc?: string | null
          sendgrid_send_date?: string | null
          sendgrid_template_selected?: string | null
          target_city?: string | null
          target_geo_combined?: string | null
          target_intl?: string | null
          target_state?: string | null
          training_grants?: string | null
        }
        Update: {
          assigned_partner?: string | null
          assigned_partner_override?: string | null
          discovery_status?:
            | Database["public"]["Enums"]["discovery_statuses"]
            | null
          first_contact_ages?: string | null
          first_contact_form_notes?: string | null
          first_contact_governance_model?: string | null
          first_contact_interests?: string | null
          first_contact_notes_on_pre_wf_employment?: string | null
          first_contact_wf_employment_status?: string | null
          first_contact_willingness_to_relocate?: string | null
          is_archived?: boolean | null
          montessori_lead_guide_trainings?: string | null
          notes?: string | null
          old_id?: string
          on_school_board?: string | null
          one_on_one_scheduling_status?: string | null
          opsguide_checklist?: string | null
          opsguide_fundraising_opps?: string | null
          opsguide_meeting_prefs?: string | null
          opsguide_request_pertinent_info?: string | null
          opsguide_support_type_needed?: string | null
          people_id?: string
          person_responsible_for_follow_up?: string | null
          personal_email_sent?: boolean | null
          personal_email_sent_date?: string | null
          routed_to?: string | null
          self_reflection_doc?: string | null
          sendgrid_send_date?: string | null
          sendgrid_template_selected?: string | null
          target_city?: string | null
          target_geo_combined?: string | null
          target_intl?: string | null
          target_state?: string | null
          training_grants?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "people_educator_details_people_id_fkey"
            columns: ["people_id"]
            isOneToOne: true
            referencedRelation: "details_educators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "people_educator_details_people_id_fkey"
            columns: ["people_id"]
            isOneToOne: true
            referencedRelation: "grid_educator"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "people_educator_details_people_id_fkey"
            columns: ["people_id"]
            isOneToOne: true
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "people_educator_early_cultiva_person_responsible_for_follo_fkey"
            columns: ["person_responsible_for_follow_up"]
            isOneToOne: false
            referencedRelation: "guides"
            referencedColumns: ["email_or_name"]
          },
          {
            foreignKeyName: "people_educator_early_cultivatio_assigned_partner_override_fkey"
            columns: ["assigned_partner_override"]
            isOneToOne: false
            referencedRelation: "guides"
            referencedColumns: ["email_or_name"]
          },
        ]
      }
      people_roles_associations: {
        Row: {
          authorizer_id: string | null
          charter_id: string | null
          created_date: string | null
          end_date: string | null
          gsuite_roles:
            | Database["public"]["Enums"]["gsuite_roles_options"]
            | null
          id: string
          is_active: boolean | null
          is_archived: boolean | null
          loan_fund: boolean | null
          people_id: string | null
          role: string | null
          school_id: string | null
          start_date: string | null
          tl_membership_acknowledgement_date: string | null
          tl_membership_acknowledgement_doc: string | null
          who_initiated_tl_removal: string | null
        }
        Insert: {
          authorizer_id?: string | null
          charter_id?: string | null
          created_date?: string | null
          end_date?: string | null
          gsuite_roles?:
            | Database["public"]["Enums"]["gsuite_roles_options"]
            | null
          id: string
          is_active?: boolean | null
          is_archived?: boolean | null
          loan_fund?: boolean | null
          people_id?: string | null
          role?: string | null
          school_id?: string | null
          start_date?: string | null
          tl_membership_acknowledgement_date?: string | null
          tl_membership_acknowledgement_doc?: string | null
          who_initiated_tl_removal?: string | null
        }
        Update: {
          authorizer_id?: string | null
          charter_id?: string | null
          created_date?: string | null
          end_date?: string | null
          gsuite_roles?:
            | Database["public"]["Enums"]["gsuite_roles_options"]
            | null
          id?: string
          is_active?: boolean | null
          is_archived?: boolean | null
          loan_fund?: boolean | null
          people_id?: string | null
          role?: string | null
          school_id?: string | null
          start_date?: string | null
          tl_membership_acknowledgement_date?: string | null
          tl_membership_acknowledgement_doc?: string | null
          who_initiated_tl_removal?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "educatorsXschools_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "details_schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "educatorsXschools_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "grid_school"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "educatorsXschools_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "logo_urls_by_school"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "educatorsXschools_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "people_roles_associations_people_id_fkey"
            columns: ["people_id"]
            isOneToOne: false
            referencedRelation: "details_educators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "people_roles_associations_people_id_fkey"
            columns: ["people_id"]
            isOneToOne: false
            referencedRelation: "grid_educator"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "people_roles_associations_people_id_fkey"
            columns: ["people_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "people_roles_join_charter_id_fkey"
            columns: ["charter_id"]
            isOneToOne: false
            referencedRelation: "charters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "people_roles_join_charter_id_fkey"
            columns: ["charter_id"]
            isOneToOne: false
            referencedRelation: "details_charters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "people_roles_join_charter_id_fkey"
            columns: ["charter_id"]
            isOneToOne: false
            referencedRelation: "grid_charter"
            referencedColumns: ["id"]
          },
        ]
      }
      people_systems: {
        Row: {
          gsuite_roles:
            | Database["public"]["Enums"]["gsuite_roles_options"]
            | null
          id: string
          in_tl_google_grp:
            | Database["public"]["Enums"]["active_inactive"]
            | null
          in_wf_directory: Database["public"]["Enums"]["active_inactive"] | null
          is_archived: boolean | null
          on_connected: boolean | null
          on_natl_website: Database["public"]["Enums"]["active_inactive"] | null
          on_slack: Database["public"]["Enums"]["active_inactive"] | null
          people_id: string | null
          who_initiated_tl_removal: string | null
        }
        Insert: {
          gsuite_roles?:
            | Database["public"]["Enums"]["gsuite_roles_options"]
            | null
          id: string
          in_tl_google_grp?:
            | Database["public"]["Enums"]["active_inactive"]
            | null
          in_wf_directory?:
            | Database["public"]["Enums"]["active_inactive"]
            | null
          is_archived?: boolean | null
          on_connected?: boolean | null
          on_natl_website?:
            | Database["public"]["Enums"]["active_inactive"]
            | null
          on_slack?: Database["public"]["Enums"]["active_inactive"] | null
          people_id?: string | null
          who_initiated_tl_removal?: string | null
        }
        Update: {
          gsuite_roles?:
            | Database["public"]["Enums"]["gsuite_roles_options"]
            | null
          id?: string
          in_tl_google_grp?:
            | Database["public"]["Enums"]["active_inactive"]
            | null
          in_wf_directory?:
            | Database["public"]["Enums"]["active_inactive"]
            | null
          is_archived?: boolean | null
          on_connected?: boolean | null
          on_natl_website?:
            | Database["public"]["Enums"]["active_inactive"]
            | null
          on_slack?: Database["public"]["Enums"]["active_inactive"] | null
          people_id?: string | null
          who_initiated_tl_removal?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "people_systems_people_id_fkey"
            columns: ["people_id"]
            isOneToOne: false
            referencedRelation: "details_educators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "people_systems_people_id_fkey"
            columns: ["people_id"]
            isOneToOne: false
            referencedRelation: "grid_educator"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "people_systems_people_id_fkey"
            columns: ["people_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      school_reports_and_submissions: {
        Row: {
          attachments: string | null
          charter_id: string | null
          id: string | null
          is_archived: boolean | null
          report_type: string | null
          school_year: string | null
        }
        Insert: {
          attachments?: string | null
          charter_id?: string | null
          id?: string | null
          is_archived?: boolean | null
          report_type?: string | null
          school_year?: string | null
        }
        Update: {
          attachments?: string | null
          charter_id?: string | null
          id?: string | null
          is_archived?: boolean | null
          report_type?: string | null
          school_year?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "school_reports_and_submissions_charter_id_fkey"
            columns: ["charter_id"]
            isOneToOne: false
            referencedRelation: "charters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_reports_and_submissions_charter_id_fkey"
            columns: ["charter_id"]
            isOneToOne: false
            referencedRelation: "details_charters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_reports_and_submissions_charter_id_fkey"
            columns: ["charter_id"]
            isOneToOne: false
            referencedRelation: "grid_charter"
            referencedColumns: ["id"]
          },
        ]
      }
      school_ssj_data: {
        Row: {
          building4good_firm_and_attorney: string | null
          entered_planning_date: string | null
          entered_startup_date: string | null
          entered_visioning_date: string | null
          is_archived: boolean | null
          logo_designer:
            | Database["public"]["Enums"]["logo_designer_options"]
            | null
          name_selection_proposal: string | null
          planning_advice_loop_closed: boolean | null
          school_id: string
          ssj_advice_givers_partners: string | null
          ssj_advice_givers_tls: string | null
          ssj_amount_raised: string | null
          ssj_board_development:
            | Database["public"]["Enums"]["ssj_board_dev_status"]
            | null
          ssj_budget_ready_for_next_steps:
            | Database["public"]["Enums"]["ssj_budget_ready_for_next_steps_enum"]
            | null
          ssj_building4good_status:
            | Database["public"]["Enums"]["ssj_building4good_status_enum"]
            | null
          ssj_date_shared_with_n4g: string | null
          ssj_facility: Database["public"]["Enums"]["ssj_facility_enum"] | null
          ssj_fundraising_narrative: string | null
          ssj_gap_in_funding: string | null
          ssj_has_partner:
            | Database["public"]["Enums"]["ssj_has_partner_enum"]
            | null
          ssj_loan_approved_amt: string | null
          ssj_loan_eligibility: string | null
          ssj_name_reserved: boolean | null
          ssj_on_track_for_enrollment:
            | Database["public"]["Enums"]["ssj_on_track_for_enrollment_enum"]
            | null
          ssj_ops_guide_support_track:
            | Database["public"]["Enums"]["ssj_ops_guide_support_track_enum"]
            | null
          ssj_pathway_to_funding:
            | Database["public"]["Enums"]["ssj_pathway_to_funding_enum"]
            | null
          ssj_proj_open_school_year: string | null
          ssj_readiness_to_open_rating:
            | Database["public"]["Enums"]["high_med_low"]
            | null
          ssj_seeking_wf_funding:
            | Database["public"]["Enums"]["ssj_seeking_wf_funding_enum"]
            | null
          ssj_stage: Database["public"]["Enums"]["ssj_stages"] | null
          ssj_target_city: string | null
          ssj_target_state:
            | Database["public"]["Enums"]["state_abbreviation_enum"]
            | null
          ssj_tool: Database["public"]["Enums"]["ssj_tool_enum"] | null
          ssj_total_startup_funding_needed: string | null
          trademark_filed: boolean | null
          visioning_advice_loop_closed: boolean | null
          visioning_album: string | null
          visioning_album_complete: string | null
        }
        Insert: {
          building4good_firm_and_attorney?: string | null
          entered_planning_date?: string | null
          entered_startup_date?: string | null
          entered_visioning_date?: string | null
          is_archived?: boolean | null
          logo_designer?:
            | Database["public"]["Enums"]["logo_designer_options"]
            | null
          name_selection_proposal?: string | null
          planning_advice_loop_closed?: boolean | null
          school_id: string
          ssj_advice_givers_partners?: string | null
          ssj_advice_givers_tls?: string | null
          ssj_amount_raised?: string | null
          ssj_board_development?:
            | Database["public"]["Enums"]["ssj_board_dev_status"]
            | null
          ssj_budget_ready_for_next_steps?:
            | Database["public"]["Enums"]["ssj_budget_ready_for_next_steps_enum"]
            | null
          ssj_building4good_status?:
            | Database["public"]["Enums"]["ssj_building4good_status_enum"]
            | null
          ssj_date_shared_with_n4g?: string | null
          ssj_facility?: Database["public"]["Enums"]["ssj_facility_enum"] | null
          ssj_fundraising_narrative?: string | null
          ssj_gap_in_funding?: string | null
          ssj_has_partner?:
            | Database["public"]["Enums"]["ssj_has_partner_enum"]
            | null
          ssj_loan_approved_amt?: string | null
          ssj_loan_eligibility?: string | null
          ssj_name_reserved?: boolean | null
          ssj_on_track_for_enrollment?:
            | Database["public"]["Enums"]["ssj_on_track_for_enrollment_enum"]
            | null
          ssj_ops_guide_support_track?:
            | Database["public"]["Enums"]["ssj_ops_guide_support_track_enum"]
            | null
          ssj_pathway_to_funding?:
            | Database["public"]["Enums"]["ssj_pathway_to_funding_enum"]
            | null
          ssj_proj_open_school_year?: string | null
          ssj_readiness_to_open_rating?:
            | Database["public"]["Enums"]["high_med_low"]
            | null
          ssj_seeking_wf_funding?:
            | Database["public"]["Enums"]["ssj_seeking_wf_funding_enum"]
            | null
          ssj_stage?: Database["public"]["Enums"]["ssj_stages"] | null
          ssj_target_city?: string | null
          ssj_target_state?:
            | Database["public"]["Enums"]["state_abbreviation_enum"]
            | null
          ssj_tool?: Database["public"]["Enums"]["ssj_tool_enum"] | null
          ssj_total_startup_funding_needed?: string | null
          trademark_filed?: boolean | null
          visioning_advice_loop_closed?: boolean | null
          visioning_album?: string | null
          visioning_album_complete?: string | null
        }
        Update: {
          building4good_firm_and_attorney?: string | null
          entered_planning_date?: string | null
          entered_startup_date?: string | null
          entered_visioning_date?: string | null
          is_archived?: boolean | null
          logo_designer?:
            | Database["public"]["Enums"]["logo_designer_options"]
            | null
          name_selection_proposal?: string | null
          planning_advice_loop_closed?: boolean | null
          school_id?: string
          ssj_advice_givers_partners?: string | null
          ssj_advice_givers_tls?: string | null
          ssj_amount_raised?: string | null
          ssj_board_development?:
            | Database["public"]["Enums"]["ssj_board_dev_status"]
            | null
          ssj_budget_ready_for_next_steps?:
            | Database["public"]["Enums"]["ssj_budget_ready_for_next_steps_enum"]
            | null
          ssj_building4good_status?:
            | Database["public"]["Enums"]["ssj_building4good_status_enum"]
            | null
          ssj_date_shared_with_n4g?: string | null
          ssj_facility?: Database["public"]["Enums"]["ssj_facility_enum"] | null
          ssj_fundraising_narrative?: string | null
          ssj_gap_in_funding?: string | null
          ssj_has_partner?:
            | Database["public"]["Enums"]["ssj_has_partner_enum"]
            | null
          ssj_loan_approved_amt?: string | null
          ssj_loan_eligibility?: string | null
          ssj_name_reserved?: boolean | null
          ssj_on_track_for_enrollment?:
            | Database["public"]["Enums"]["ssj_on_track_for_enrollment_enum"]
            | null
          ssj_ops_guide_support_track?:
            | Database["public"]["Enums"]["ssj_ops_guide_support_track_enum"]
            | null
          ssj_pathway_to_funding?:
            | Database["public"]["Enums"]["ssj_pathway_to_funding_enum"]
            | null
          ssj_proj_open_school_year?: string | null
          ssj_readiness_to_open_rating?:
            | Database["public"]["Enums"]["high_med_low"]
            | null
          ssj_seeking_wf_funding?:
            | Database["public"]["Enums"]["ssj_seeking_wf_funding_enum"]
            | null
          ssj_stage?: Database["public"]["Enums"]["ssj_stages"] | null
          ssj_target_city?: string | null
          ssj_target_state?:
            | Database["public"]["Enums"]["state_abbreviation_enum"]
            | null
          ssj_tool?: Database["public"]["Enums"]["ssj_tool_enum"] | null
          ssj_total_startup_funding_needed?: string | null
          trademark_filed?: boolean | null
          visioning_advice_loop_closed?: boolean | null
          visioning_album?: string | null
          visioning_album_complete?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "school_ssj_data_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: true
            referencedRelation: "details_schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_ssj_data_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: true
            referencedRelation: "grid_school"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_ssj_data_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: true
            referencedRelation: "logo_urls_by_school"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "school_ssj_data_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: true
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      schools: {
        Row: {
          about: string | null
          about_spanish: string | null
          admissions_system:
            | Database["public"]["Enums"]["admissions_system_options"]
            | null
          ages_served: Database["public"]["Enums"]["age_spans"][] | null
          automation_notes: string | null
          bill_account: string | null
          bookkeeper_or_accountant: string | null
          budget_link: string | null
          budget_utility:
            | Database["public"]["Enums"]["budget_utility_options"]
            | null
          business_insurance:
            | Database["public"]["Enums"]["business_insurance_options"]
            | null
          charter_id: string | null
          created: string | null
          created_by: string | null
          current_fy_end: string | null
          domain_name: Database["public"]["Enums"]["domain_name_options"] | null
          ein: string | null
          email_domain: string | null
          enrollment_at_full_capacity: string | null
          facebook: string | null
          flexible_tuition_model: string | null
          founding_tls: string[] | null
          google_voice:
            | Database["public"]["Enums"]["google_voice_options"]
            | null
          google_workspace_org_unit_path: string | null
          governance_model:
            | Database["public"]["Enums"]["governance_models"]
            | null
          guidestar_listing_requested: boolean | null
          gusto: Database["public"]["Enums"]["gusto_options"] | null
          id: string
          incorporation_date: string | null
          instagram: string | null
          institutional_partner: string | null
          is_archived: boolean | null
          last_modified: string | null
          last_modified_by: string | null
          legal_name: string | null
          legal_structure:
            | Database["public"]["Enums"]["legal_structure_options"]
            | null
          loan_report_name: string | null
          logo: string | null
          logo_flower_only: string | null
          logo_rectangle: string | null
          logo_square: string | null
          logo_url: string | null
          long_name: string | null
          membership_agreement_version: string | null
          membership_revoked_date: string | null
          membership_status: string | null
          membership_termination_steps: string | null
          narrative: string | null
          nondiscrimination_policy_on_application: boolean | null
          nondiscrimination_policy_on_website: boolean | null
          nonprofit_path: Database["public"]["Enums"]["nonprofit_paths"] | null
          nonprofit_status: boolean | null
          number_of_classrooms: number | null
          old_id: string
          on_national_website:
            | Database["public"]["Enums"]["on_national_website_options"]
            | null
          open_date: string | null
          planning_album: string | null
          pod: string | null
          primary_contact_id: string | null
          prior_names: string | null
          program_focus: string | null
          projected_open: string | null
          public_funding: string[] | null
          qbo: Database["public"]["Enums"]["qbo_options"] | null
          qbo_school_codes: string | null
          risk_factors: string | null
          school_calendar:
            | Database["public"]["Enums"]["school_calendar_options"]
            | null
          school_email: string | null
          school_phone: string | null
          school_sched:
            | Database["public"]["Enums"]["school_schedule_options"][]
            | null
          short_name: string | null
          signed_membership_agreement_date: string | null
          status: Database["public"]["Enums"]["school_statuses"] | null
          tc_admissions:
            | Database["public"]["Enums"]["tc_admissions_options"]
            | null
          tc_recordkeeping:
            | Database["public"]["Enums"]["tc_recordkeeping_options"]
            | null
          tc_school_id: string | null
          transparent_classroom:
            | Database["public"]["Enums"]["transparent_classroom_options"]
            | null
          visioning_album: string | null
          watchlist: string | null
          website: string | null
          website_tool:
            | Database["public"]["Enums"]["website_tool_options"]
            | null
        }
        Insert: {
          about?: string | null
          about_spanish?: string | null
          admissions_system?:
            | Database["public"]["Enums"]["admissions_system_options"]
            | null
          ages_served?: Database["public"]["Enums"]["age_spans"][] | null
          automation_notes?: string | null
          bill_account?: string | null
          bookkeeper_or_accountant?: string | null
          budget_link?: string | null
          budget_utility?:
            | Database["public"]["Enums"]["budget_utility_options"]
            | null
          business_insurance?:
            | Database["public"]["Enums"]["business_insurance_options"]
            | null
          charter_id?: string | null
          created?: string | null
          created_by?: string | null
          current_fy_end?: string | null
          domain_name?:
            | Database["public"]["Enums"]["domain_name_options"]
            | null
          ein?: string | null
          email_domain?: string | null
          enrollment_at_full_capacity?: string | null
          facebook?: string | null
          flexible_tuition_model?: string | null
          founding_tls?: string[] | null
          google_voice?:
            | Database["public"]["Enums"]["google_voice_options"]
            | null
          google_workspace_org_unit_path?: string | null
          governance_model?:
            | Database["public"]["Enums"]["governance_models"]
            | null
          guidestar_listing_requested?: boolean | null
          gusto?: Database["public"]["Enums"]["gusto_options"] | null
          id?: string
          incorporation_date?: string | null
          instagram?: string | null
          institutional_partner?: string | null
          is_archived?: boolean | null
          last_modified?: string | null
          last_modified_by?: string | null
          legal_name?: string | null
          legal_structure?:
            | Database["public"]["Enums"]["legal_structure_options"]
            | null
          loan_report_name?: string | null
          logo?: string | null
          logo_flower_only?: string | null
          logo_rectangle?: string | null
          logo_square?: string | null
          logo_url?: string | null
          long_name?: string | null
          membership_agreement_version?: string | null
          membership_revoked_date?: string | null
          membership_status?: string | null
          membership_termination_steps?: string | null
          narrative?: string | null
          nondiscrimination_policy_on_application?: boolean | null
          nondiscrimination_policy_on_website?: boolean | null
          nonprofit_path?: Database["public"]["Enums"]["nonprofit_paths"] | null
          nonprofit_status?: boolean | null
          number_of_classrooms?: number | null
          old_id: string
          on_national_website?:
            | Database["public"]["Enums"]["on_national_website_options"]
            | null
          open_date?: string | null
          planning_album?: string | null
          pod?: string | null
          primary_contact_id?: string | null
          prior_names?: string | null
          program_focus?: string | null
          projected_open?: string | null
          public_funding?: string[] | null
          qbo?: Database["public"]["Enums"]["qbo_options"] | null
          qbo_school_codes?: string | null
          risk_factors?: string | null
          school_calendar?:
            | Database["public"]["Enums"]["school_calendar_options"]
            | null
          school_email?: string | null
          school_phone?: string | null
          school_sched?:
            | Database["public"]["Enums"]["school_schedule_options"][]
            | null
          short_name?: string | null
          signed_membership_agreement_date?: string | null
          status?: Database["public"]["Enums"]["school_statuses"] | null
          tc_admissions?:
            | Database["public"]["Enums"]["tc_admissions_options"]
            | null
          tc_recordkeeping?:
            | Database["public"]["Enums"]["tc_recordkeeping_options"]
            | null
          tc_school_id?: string | null
          transparent_classroom?:
            | Database["public"]["Enums"]["transparent_classroom_options"]
            | null
          visioning_album?: string | null
          watchlist?: string | null
          website?: string | null
          website_tool?:
            | Database["public"]["Enums"]["website_tool_options"]
            | null
        }
        Update: {
          about?: string | null
          about_spanish?: string | null
          admissions_system?:
            | Database["public"]["Enums"]["admissions_system_options"]
            | null
          ages_served?: Database["public"]["Enums"]["age_spans"][] | null
          automation_notes?: string | null
          bill_account?: string | null
          bookkeeper_or_accountant?: string | null
          budget_link?: string | null
          budget_utility?:
            | Database["public"]["Enums"]["budget_utility_options"]
            | null
          business_insurance?:
            | Database["public"]["Enums"]["business_insurance_options"]
            | null
          charter_id?: string | null
          created?: string | null
          created_by?: string | null
          current_fy_end?: string | null
          domain_name?:
            | Database["public"]["Enums"]["domain_name_options"]
            | null
          ein?: string | null
          email_domain?: string | null
          enrollment_at_full_capacity?: string | null
          facebook?: string | null
          flexible_tuition_model?: string | null
          founding_tls?: string[] | null
          google_voice?:
            | Database["public"]["Enums"]["google_voice_options"]
            | null
          google_workspace_org_unit_path?: string | null
          governance_model?:
            | Database["public"]["Enums"]["governance_models"]
            | null
          guidestar_listing_requested?: boolean | null
          gusto?: Database["public"]["Enums"]["gusto_options"] | null
          id?: string
          incorporation_date?: string | null
          instagram?: string | null
          institutional_partner?: string | null
          is_archived?: boolean | null
          last_modified?: string | null
          last_modified_by?: string | null
          legal_name?: string | null
          legal_structure?:
            | Database["public"]["Enums"]["legal_structure_options"]
            | null
          loan_report_name?: string | null
          logo?: string | null
          logo_flower_only?: string | null
          logo_rectangle?: string | null
          logo_square?: string | null
          logo_url?: string | null
          long_name?: string | null
          membership_agreement_version?: string | null
          membership_revoked_date?: string | null
          membership_status?: string | null
          membership_termination_steps?: string | null
          narrative?: string | null
          nondiscrimination_policy_on_application?: boolean | null
          nondiscrimination_policy_on_website?: boolean | null
          nonprofit_path?: Database["public"]["Enums"]["nonprofit_paths"] | null
          nonprofit_status?: boolean | null
          number_of_classrooms?: number | null
          old_id?: string
          on_national_website?:
            | Database["public"]["Enums"]["on_national_website_options"]
            | null
          open_date?: string | null
          planning_album?: string | null
          pod?: string | null
          primary_contact_id?: string | null
          prior_names?: string | null
          program_focus?: string | null
          projected_open?: string | null
          public_funding?: string[] | null
          qbo?: Database["public"]["Enums"]["qbo_options"] | null
          qbo_school_codes?: string | null
          risk_factors?: string | null
          school_calendar?:
            | Database["public"]["Enums"]["school_calendar_options"]
            | null
          school_email?: string | null
          school_phone?: string | null
          school_sched?:
            | Database["public"]["Enums"]["school_schedule_options"][]
            | null
          short_name?: string | null
          signed_membership_agreement_date?: string | null
          status?: Database["public"]["Enums"]["school_statuses"] | null
          tc_admissions?:
            | Database["public"]["Enums"]["tc_admissions_options"]
            | null
          tc_recordkeeping?:
            | Database["public"]["Enums"]["tc_recordkeeping_options"]
            | null
          tc_school_id?: string | null
          transparent_classroom?:
            | Database["public"]["Enums"]["transparent_classroom_options"]
            | null
          visioning_album?: string | null
          watchlist?: string | null
          website?: string | null
          website_tool?:
            | Database["public"]["Enums"]["website_tool_options"]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "schools_charter_id_fkey"
            columns: ["charter_id"]
            isOneToOne: false
            referencedRelation: "charters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schools_charter_id_fkey"
            columns: ["charter_id"]
            isOneToOne: false
            referencedRelation: "details_charters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schools_charter_id_fkey"
            columns: ["charter_id"]
            isOneToOne: false
            referencedRelation: "grid_charter"
            referencedColumns: ["id"]
          },
        ]
      }
      ssj_fillout_forms: {
        Row: {
          age_targets: string | null
          assigned_partner_override: string | null
          cert_processing_status: string | null
          charter_interest: string | null
          city: string | null
          city_standardized: string | null
          city2: string | null
          community_desc: string | null
          community_member_interest: string | null
          community_member_self_description: string | null
          contact_type: string | null
          country: string | null
          country2: string | null
          created_date: string | null
          current_income: string | null
          currently_montessori_certified: string | null
          currently_seeking_mont_cert: string | null
          educator_interests: string | null
          educator_interests_other: string | null
          email: string | null
          email_1: string | null
          email_sent_by_initial_outreacher: string | null
          first_name: string | null
          follow_upper: string | null
          form_type: Database["public"]["Enums"]["ssj_form_type"] | null
          full_name: string | null
          gender: string | null
          gender_other: string | null
          id: string
          initial_outreacher: string | null
          is_archived: boolean | null
          language_primary: string | null
          language_primary_other: string | null
          last_name: string | null
          lgbtqia: string | null
          "Link to Start a School": string | null
          message: string | null
          mont_cert_question: string | null
          "Montessori Certification Certifier 1": string | null
          "Montessori Certification Certifier 2": string | null
          "Montessori Certification Certifier 3": string | null
          "Montessori Certification Certifier 4": string | null
          "Montessori Certification Level 1": string | null
          "Montessori Certification Level 2": string | null
          "Montessori Certification Level 3": string | null
          "Montessori Certification Level 4": string | null
          "Montessori Certification Year 1": string | null
          "Montessori Certification Year 2": string | null
          "Montessori Certification Year 3": string | null
          "Montessori Certification Year 4": string | null
          old_id: string | null
          one_on_one_status: string | null
          people_id: string | null
          pronouns: string | null
          pronouns_other: string | null
          race_ethnicity: string | null
          race_ethnicity_other: string | null
          routed_to: string | null
          sendgrid_date_sent: string | null
          sendgrid_template: string | null
          source_campaign: string | null
          source_detail: string | null
          source_other: string | null
          source_type: string | null
          state: string | null
          state_abbrev: string | null
          state2: string | null
          target_geo: string | null
          "Temp - M Cert Cert 1": string | null
          "Temp - M Cert Cert 2": string | null
          "Temp - M Cert Cert 3": string | null
          "Temp - M Cert Cert 4": string | null
          "Temp - M Cert Level 1": string | null
          "Temp - M Cert Level 2": string | null
          "Temp - M Cert Level 3": string | null
          "Temp - M Cert Level 4": string | null
          "Temp - M Cert Year 1": string | null
          "Temp - M Cert Year 2": string | null
          "Temp - M Cert Year 3": string | null
          "Temp - M Cert Year 4": string | null
          want_communications: string | null
          want_helping_sourcing_teachers: string | null
        }
        Insert: {
          age_targets?: string | null
          assigned_partner_override?: string | null
          cert_processing_status?: string | null
          charter_interest?: string | null
          city?: string | null
          city_standardized?: string | null
          city2?: string | null
          community_desc?: string | null
          community_member_interest?: string | null
          community_member_self_description?: string | null
          contact_type?: string | null
          country?: string | null
          country2?: string | null
          created_date?: string | null
          current_income?: string | null
          currently_montessori_certified?: string | null
          currently_seeking_mont_cert?: string | null
          educator_interests?: string | null
          educator_interests_other?: string | null
          email?: string | null
          email_1?: string | null
          email_sent_by_initial_outreacher?: string | null
          first_name?: string | null
          follow_upper?: string | null
          form_type?: Database["public"]["Enums"]["ssj_form_type"] | null
          full_name?: string | null
          gender?: string | null
          gender_other?: string | null
          id?: string
          initial_outreacher?: string | null
          is_archived?: boolean | null
          language_primary?: string | null
          language_primary_other?: string | null
          last_name?: string | null
          lgbtqia?: string | null
          "Link to Start a School"?: string | null
          message?: string | null
          mont_cert_question?: string | null
          "Montessori Certification Certifier 1"?: string | null
          "Montessori Certification Certifier 2"?: string | null
          "Montessori Certification Certifier 3"?: string | null
          "Montessori Certification Certifier 4"?: string | null
          "Montessori Certification Level 1"?: string | null
          "Montessori Certification Level 2"?: string | null
          "Montessori Certification Level 3"?: string | null
          "Montessori Certification Level 4"?: string | null
          "Montessori Certification Year 1"?: string | null
          "Montessori Certification Year 2"?: string | null
          "Montessori Certification Year 3"?: string | null
          "Montessori Certification Year 4"?: string | null
          old_id?: string | null
          one_on_one_status?: string | null
          people_id?: string | null
          pronouns?: string | null
          pronouns_other?: string | null
          race_ethnicity?: string | null
          race_ethnicity_other?: string | null
          routed_to?: string | null
          sendgrid_date_sent?: string | null
          sendgrid_template?: string | null
          source_campaign?: string | null
          source_detail?: string | null
          source_other?: string | null
          source_type?: string | null
          state?: string | null
          state_abbrev?: string | null
          state2?: string | null
          target_geo?: string | null
          "Temp - M Cert Cert 1"?: string | null
          "Temp - M Cert Cert 2"?: string | null
          "Temp - M Cert Cert 3"?: string | null
          "Temp - M Cert Cert 4"?: string | null
          "Temp - M Cert Level 1"?: string | null
          "Temp - M Cert Level 2"?: string | null
          "Temp - M Cert Level 3"?: string | null
          "Temp - M Cert Level 4"?: string | null
          "Temp - M Cert Year 1"?: string | null
          "Temp - M Cert Year 2"?: string | null
          "Temp - M Cert Year 3"?: string | null
          "Temp - M Cert Year 4"?: string | null
          want_communications?: string | null
          want_helping_sourcing_teachers?: string | null
        }
        Update: {
          age_targets?: string | null
          assigned_partner_override?: string | null
          cert_processing_status?: string | null
          charter_interest?: string | null
          city?: string | null
          city_standardized?: string | null
          city2?: string | null
          community_desc?: string | null
          community_member_interest?: string | null
          community_member_self_description?: string | null
          contact_type?: string | null
          country?: string | null
          country2?: string | null
          created_date?: string | null
          current_income?: string | null
          currently_montessori_certified?: string | null
          currently_seeking_mont_cert?: string | null
          educator_interests?: string | null
          educator_interests_other?: string | null
          email?: string | null
          email_1?: string | null
          email_sent_by_initial_outreacher?: string | null
          first_name?: string | null
          follow_upper?: string | null
          form_type?: Database["public"]["Enums"]["ssj_form_type"] | null
          full_name?: string | null
          gender?: string | null
          gender_other?: string | null
          id?: string
          initial_outreacher?: string | null
          is_archived?: boolean | null
          language_primary?: string | null
          language_primary_other?: string | null
          last_name?: string | null
          lgbtqia?: string | null
          "Link to Start a School"?: string | null
          message?: string | null
          mont_cert_question?: string | null
          "Montessori Certification Certifier 1"?: string | null
          "Montessori Certification Certifier 2"?: string | null
          "Montessori Certification Certifier 3"?: string | null
          "Montessori Certification Certifier 4"?: string | null
          "Montessori Certification Level 1"?: string | null
          "Montessori Certification Level 2"?: string | null
          "Montessori Certification Level 3"?: string | null
          "Montessori Certification Level 4"?: string | null
          "Montessori Certification Year 1"?: string | null
          "Montessori Certification Year 2"?: string | null
          "Montessori Certification Year 3"?: string | null
          "Montessori Certification Year 4"?: string | null
          old_id?: string | null
          one_on_one_status?: string | null
          people_id?: string | null
          pronouns?: string | null
          pronouns_other?: string | null
          race_ethnicity?: string | null
          race_ethnicity_other?: string | null
          routed_to?: string | null
          sendgrid_date_sent?: string | null
          sendgrid_template?: string | null
          source_campaign?: string | null
          source_detail?: string | null
          source_other?: string | null
          source_type?: string | null
          state?: string | null
          state_abbrev?: string | null
          state2?: string | null
          target_geo?: string | null
          "Temp - M Cert Cert 1"?: string | null
          "Temp - M Cert Cert 2"?: string | null
          "Temp - M Cert Cert 3"?: string | null
          "Temp - M Cert Cert 4"?: string | null
          "Temp - M Cert Level 1"?: string | null
          "Temp - M Cert Level 2"?: string | null
          "Temp - M Cert Level 3"?: string | null
          "Temp - M Cert Level 4"?: string | null
          "Temp - M Cert Year 1"?: string | null
          "Temp - M Cert Year 2"?: string | null
          "Temp - M Cert Year 3"?: string | null
          "Temp - M Cert Year 4"?: string | null
          want_communications?: string | null
          want_helping_sourcing_teachers?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ssj_fillout_forms_people_id_fkey"
            columns: ["people_id"]
            isOneToOne: false
            referencedRelation: "details_educators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ssj_fillout_forms_people_id_fkey"
            columns: ["people_id"]
            isOneToOne: false
            referencedRelation: "grid_educator"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ssj_fillout_forms_people_id_fkey"
            columns: ["people_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      details_associations: {
        Row: {
          ages_served: Database["public"]["Enums"]["age_spans"][] | null
          charter_id: string | null
          created_date: string | null
          end_date: string | null
          full_name: string | null
          governance_model:
            | Database["public"]["Enums"]["governance_models"]
            | null
          has_montessori_cert: boolean | null
          id: string | null
          is_active: boolean | null
          membership_status: string | null
          people_id: string | null
          projected_open: string | null
          race_ethnicity:
            | Database["public"]["Enums"]["race_ethnicity_categories"][]
            | null
          role: string | null
          school_id: string | null
          school_name: string | null
          show_in_board_tables: boolean | null
          show_in_educator_grid: boolean | null
          stage_status: string | null
          start_date: string | null
        }
        Relationships: [
          {
            foreignKeyName: "educatorsXschools_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "details_schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "educatorsXschools_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "grid_school"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "educatorsXschools_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "logo_urls_by_school"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "educatorsXschools_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "people_roles_associations_people_id_fkey"
            columns: ["people_id"]
            isOneToOne: false
            referencedRelation: "details_educators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "people_roles_associations_people_id_fkey"
            columns: ["people_id"]
            isOneToOne: false
            referencedRelation: "grid_educator"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "people_roles_associations_people_id_fkey"
            columns: ["people_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "people_roles_join_charter_id_fkey"
            columns: ["charter_id"]
            isOneToOne: false
            referencedRelation: "charters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "people_roles_join_charter_id_fkey"
            columns: ["charter_id"]
            isOneToOne: false
            referencedRelation: "details_charters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "people_roles_join_charter_id_fkey"
            columns: ["charter_id"]
            isOneToOne: false
            referencedRelation: "grid_charter"
            referencedColumns: ["id"]
          },
        ]
      }
      details_charters: {
        Row: {
          action: string | null
          action_date: string | null
          app_deadline: string | null
          app_status: Database["public"]["Enums"]["charter_app_status"] | null
          app_submitted: boolean | null
          app_walkthrough_date: string | null
          app_window: string | null
          application: string | null
          auth_decision:
            | Database["public"]["Enums"]["authorizor_decisions"]
            | null
          authorizer: string | null
          authorizor: string | null
          beg_age: Database["public"]["Enums"]["ages-grades"] | null
          board_membership_signed_date: string | null
          budget_exercises: string | null
          budget_final: string | null
          capacity_intv_completed_date: string | null
          capacity_intv_proj_date: string | null
          capacity_intv_training_complete: boolean | null
          charter_app_pm_plan_complete: boolean | null
          charter_app_roles_set: boolean | null
          comm_engagement_underway: boolean | null
          current_cohort: string | null
          current_fy_end: Database["public"]["Enums"]["fiscal_year_end"] | null
          decision_expected_date: string | null
          design_advice_session_complete: boolean | null
          design_album: string | null
          ein: string | null
          end_age: Database["public"]["Enums"]["ages-grades"] | null
          first_site_opened_date: string | null
          full_name: string | null
          guidestar_listing_requested: boolean | null
          id: string | null
          incorp_date: string | null
          initial_target_geo: string | null
          initial_target_planes:
            | Database["public"]["Enums"]["developmental_planes"][]
            | null
          internal_support_meeting_date: string | null
          joint_kickoff_meeting_date: string | null
          landscape_analysis: string | null
          logic_model_complete: boolean | null
          loi: string | null
          loi_deadline: string | null
          loi_required: boolean | null
          loi_submitted: boolean | null
          most_recent_app: boolean | null
          non_discrimination_policy_on_website: boolean | null
          non_tl_roles: string | null
          nonprofit_status: boolean | null
          num_students: number | null
          odds_authorization: string | null
          odds_on_time_open: string | null
          opps_challenges: string | null
          partnership_with_wf: string | null
          school_provided_1023: boolean | null
          short_name: string | null
          status: Database["public"]["Enums"]["charter_status"] | null
          support_timeline: string | null
          target_open: string | null
          team: string | null
          total_grants_issued: number | null
          total_loans_issued: number | null
          website: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cohort_participation_cohort_fkey"
            columns: ["current_cohort"]
            isOneToOne: false
            referencedRelation: "cohorts"
            referencedColumns: ["cohort_title"]
          },
        ]
      }
      details_educators: {
        Row: {
          active_school: string | null
          assigned_partner: string | null
          assigned_partner_override: string | null
          childhood_income:
            | Database["public"]["Enums"]["income_categories"]
            | null
          current_role: string | null
          current_role_at_active_school: string | null
          discovery_status:
            | Database["public"]["Enums"]["discovery_statuses"]
            | null
          educ_attainment:
            | Database["public"]["Enums"]["educ_attainment_options"]
            | null
          exclude_from_email_logging: boolean | null
          first_contact_ages: string | null
          first_contact_governance_model: string | null
          first_contact_interests: string | null
          first_contact_notes_on_pre_wf_employment: string | null
          first_contact_wf_employment_status: string | null
          first_contact_willingness_to_relocate: string | null
          first_name: string | null
          full_name: string | null
          gender: Database["public"]["Enums"]["gender_categories"] | null
          gender_other: string | null
          hh_income: Database["public"]["Enums"]["income_categories"] | null
          home_address: string | null
          id: string | null
          indiv_type: string | null
          kanban_group: string | null
          last_name: string | null
          lgbtqia: boolean | null
          middle_name: string | null
          montessori_certs: Database["public"]["Enums"]["age_spans"][] | null
          most_recent_event_date: string | null
          most_recent_event_name: string | null
          most_recent_fillout_form_date: string | null
          most_recent_fillout_form_id: string | null
          most_recent_note: string | null
          most_recent_note_date: string | null
          most_recent_note_from: string | null
          most_recent_note_id: string | null
          nickname: string | null
          one_on_one_scheduling_status: string | null
          opsguide_checklist: string | null
          opsguide_fundraising_opps: string | null
          opsguide_meeting_prefs: string | null
          opsguide_request_pertinent_info: string | null
          opsguide_support_type_needed: string | null
          other_languages: Database["public"]["Enums"]["languages"][] | null
          person_responsible_for_follow_up: string | null
          personal_email_sent: boolean | null
          personal_email_sent_date: string | null
          primary_email: string | null
          primary_languages: Database["public"]["Enums"]["languages"][] | null
          primary_phone: string | null
          primary_phone_other_info: string | null
          pronouns: Database["public"]["Enums"]["pronouns"] | null
          pronouns_other: string | null
          race_ethnicity:
            | Database["public"]["Enums"]["race_ethnicity_categories"][]
            | null
          race_ethnicity_other: string | null
          routed_to: string | null
          secondary_phone: string | null
          secondary_phone_other_info: string | null
          sendgrid_send_date: string | null
          sendgrid_template_selected: string | null
          target_geo_combined: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_attendance_event_name_fkey"
            columns: ["most_recent_event_name"]
            isOneToOne: false
            referencedRelation: "event_list"
            referencedColumns: ["event_name"]
          },
          {
            foreignKeyName: "people_educator_early_cultiva_person_responsible_for_follo_fkey"
            columns: ["person_responsible_for_follow_up"]
            isOneToOne: false
            referencedRelation: "guides"
            referencedColumns: ["email_or_name"]
          },
          {
            foreignKeyName: "people_educator_early_cultivatio_assigned_partner_override_fkey"
            columns: ["assigned_partner_override"]
            isOneToOne: false
            referencedRelation: "guides"
            referencedColumns: ["email_or_name"]
          },
        ]
      }
      details_schools: {
        Row: {
          about: string | null
          about_spanish: string | null
          admissions_system:
            | Database["public"]["Enums"]["admissions_system_options"]
            | null
          ages_served: Database["public"]["Enums"]["age_spans"][] | null
          bill_account: string | null
          bookkeeper_or_accountant: string | null
          budget_link: string | null
          budget_utility:
            | Database["public"]["Enums"]["budget_utility_options"]
            | null
          building4good_firm_and_attorney: string | null
          business_insurance:
            | Database["public"]["Enums"]["business_insurance_options"]
            | null
          charter_id: string | null
          current_cohort: string | null
          current_fy_end: string | null
          current_guide_name: string | null
          current_tls: string | null
          current_tls_race_ethnicity:
            | Database["public"]["Enums"]["race_ethnicity_categories"][]
            | null
          domain_name: Database["public"]["Enums"]["domain_name_options"] | null
          ein: string | null
          email_domain: string | null
          enrollment_at_full_capacity: string | null
          entered_planning_date: string | null
          entered_startup_date: string | null
          entered_visioning_date: string | null
          facebook: string | null
          flexible_tuition_model: string | null
          founding_tls: string[] | null
          google_voice:
            | Database["public"]["Enums"]["google_voice_options"]
            | null
          google_workspace_org_unit_path: string | null
          governance_model:
            | Database["public"]["Enums"]["governance_models"]
            | null
          guidestar_listing_requested: boolean | null
          gusto: Database["public"]["Enums"]["gusto_options"] | null
          id: string | null
          incorporation_date: string | null
          instagram: string | null
          institutional_partner: string | null
          legal_name: string | null
          legal_structure:
            | Database["public"]["Enums"]["legal_structure_options"]
            | null
          loan_report_name: string | null
          logo: string | null
          logo_designer:
            | Database["public"]["Enums"]["logo_designer_options"]
            | null
          logo_flower_only: string | null
          logo_flower_only_full_url: string | null
          logo_full_url: string | null
          logo_rectangle: string | null
          logo_rectangle_full_url: string | null
          logo_square: string | null
          logo_square_full_url: string | null
          long_name: string | null
          mailing_address: string | null
          membership_termination_steps: string | null
          name_selection_proposal: string | null
          narrative: string | null
          nondiscrimination_policy_on_application: boolean | null
          nondiscrimination_policy_on_website: boolean | null
          nonprofit_path: Database["public"]["Enums"]["nonprofit_paths"] | null
          nonprofit_status: boolean | null
          number_of_classrooms: number | null
          on_national_website:
            | Database["public"]["Enums"]["on_national_website_options"]
            | null
          open_date: string | null
          physical_address: string | null
          physical_lat: number | null
          physical_long: number | null
          pod: string | null
          prior_names: string | null
          program_focus: string | null
          public_funding: string[] | null
          qbo: Database["public"]["Enums"]["qbo_options"] | null
          qbo_school_codes: string | null
          risk_factors: string | null
          school_calendar:
            | Database["public"]["Enums"]["school_calendar_options"]
            | null
          school_email: string | null
          school_phone: string | null
          school_sched:
            | Database["public"]["Enums"]["school_schedule_options"][]
            | null
          short_name: string | null
          ssj_advice_givers_partners: string | null
          ssj_advice_givers_tls: string | null
          ssj_amount_raised: string | null
          ssj_board_development:
            | Database["public"]["Enums"]["ssj_board_dev_status"]
            | null
          ssj_budget_ready_for_next_steps:
            | Database["public"]["Enums"]["ssj_budget_ready_for_next_steps_enum"]
            | null
          ssj_building4good_status:
            | Database["public"]["Enums"]["ssj_building4good_status_enum"]
            | null
          ssj_date_shared_with_n4g: string | null
          ssj_facility: Database["public"]["Enums"]["ssj_facility_enum"] | null
          ssj_fundraising_narrative: string | null
          ssj_gap_in_funding: string | null
          ssj_has_partner:
            | Database["public"]["Enums"]["ssj_has_partner_enum"]
            | null
          ssj_loan_approved_amt: string | null
          ssj_loan_eligibility: string | null
          ssj_name_reserved: boolean | null
          ssj_on_track_for_enrollment:
            | Database["public"]["Enums"]["ssj_on_track_for_enrollment_enum"]
            | null
          ssj_pathway_to_funding:
            | Database["public"]["Enums"]["ssj_pathway_to_funding_enum"]
            | null
          ssj_proj_open_school_year: string | null
          ssj_readiness_to_open_rating:
            | Database["public"]["Enums"]["high_med_low"]
            | null
          ssj_seeking_wf_funding:
            | Database["public"]["Enums"]["ssj_seeking_wf_funding_enum"]
            | null
          ssj_stage: Database["public"]["Enums"]["ssj_stages"] | null
          ssj_target_city: string | null
          ssj_target_state:
            | Database["public"]["Enums"]["state_abbreviation_enum"]
            | null
          ssj_tool: Database["public"]["Enums"]["ssj_tool_enum"] | null
          ssj_total_startup_funding_needed: string | null
          status: Database["public"]["Enums"]["school_statuses"] | null
          tc_admissions:
            | Database["public"]["Enums"]["tc_admissions_options"]
            | null
          tc_recordkeeping:
            | Database["public"]["Enums"]["tc_recordkeeping_options"]
            | null
          total_grants_issued: number | null
          total_loans_issued: number | null
          trademark_filed: boolean | null
          transparent_classroom:
            | Database["public"]["Enums"]["transparent_classroom_options"]
            | null
          visioning_album_complete: string | null
          watchlist: string | null
          website: string | null
          website_tool:
            | Database["public"]["Enums"]["website_tool_options"]
            | null
          wf_tls_on_board: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cohort_participation_cohort_fkey"
            columns: ["current_cohort"]
            isOneToOne: false
            referencedRelation: "cohorts"
            referencedColumns: ["cohort_title"]
          },
          {
            foreignKeyName: "schools_charter_id_fkey"
            columns: ["charter_id"]
            isOneToOne: false
            referencedRelation: "charters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schools_charter_id_fkey"
            columns: ["charter_id"]
            isOneToOne: false
            referencedRelation: "details_charters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schools_charter_id_fkey"
            columns: ["charter_id"]
            isOneToOne: false
            referencedRelation: "grid_charter"
            referencedColumns: ["id"]
          },
        ]
      }
      docs_urls: {
        Row: {
          doc_type: string | null
          gov_doc_full_url: string | null
          object_id: string | null
          school_id: string | null
          short_name: string | null
          upload_date: string | null
        }
        Relationships: []
      }
      grid_charter: {
        Row: {
          active_guides: string[] | null
          charter_name: string | null
          id: string | null
          initial_target_geo: string | null
          initial_target_planes:
            | Database["public"]["Enums"]["developmental_planes"][]
            | null
          non_tl_roles: string | null
          schools: string[] | null
          status: Database["public"]["Enums"]["charter_status"] | null
        }
        Relationships: []
      }
      grid_educator: {
        Row: {
          active_school: string | null
          active_school_id: string | null
          assigned_partner: string | null
          assigned_partner_override: string | null
          current_role: string | null
          current_role_at_active_school: string | null
          discovery_status:
            | Database["public"]["Enums"]["discovery_statuses"]
            | null
          full_name: string | null
          has_montessori_cert: boolean | null
          id: string | null
          indiv_type: string | null
          kanban_group: string | null
          race_ethnicity:
            | Database["public"]["Enums"]["race_ethnicity_categories"][]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "people_educator_early_cultivatio_assigned_partner_override_fkey"
            columns: ["assigned_partner_override"]
            isOneToOne: false
            referencedRelation: "guides"
            referencedColumns: ["email_or_name"]
          },
        ]
      }
      grid_school: {
        Row: {
          active_guides: string[] | null
          ages_served_rev: Database["public"]["Enums"]["age_spans"][] | null
          current_tl_pairs: Json | null
          current_tls: string | null
          current_tls_race_ethnicity:
            | Database["public"]["Enums"]["race_ethnicity_categories"][]
            | null
          governance_model:
            | Database["public"]["Enums"]["governance_models"]
            | null
          id: string | null
          membership_status: string | null
          open: string | null
          people_id: string[] | null
          school_name: string | null
          stage_status: string | null
        }
        Relationships: []
      }
      logo_urls_by_school: {
        Row: {
          logo: string | null
          logo_flower_only: string | null
          logo_flower_only_full_url: string | null
          logo_full_url: string | null
          logo_rectangle: string | null
          logo_rectangle_full_url: string | null
          logo_square: string | null
          logo_square_full_url: string | null
          school_id: string | null
          short_name: string | null
        }
        Relationships: []
      }
      preview_people_duplicates: {
        Row: {
          canonical_id: string | null
          duplicate_ids: string[] | null
          full_name_new: string | null
        }
        Relationships: []
      }
      primary_emails: {
        Row: {
          category:
            | Database["public"]["Enums"]["email_address_categories"]
            | null
          email_address: string | null
          people_id: string | null
        }
        Insert: {
          category?:
            | Database["public"]["Enums"]["email_address_categories"]
            | null
          email_address?: string | null
          people_id?: string | null
        }
        Update: {
          category?:
            | Database["public"]["Enums"]["email_address_categories"]
            | null
          email_address?: string | null
          people_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_addresses_people_id_fkey"
            columns: ["people_id"]
            isOneToOne: false
            referencedRelation: "details_educators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_addresses_people_id_fkey"
            columns: ["people_id"]
            isOneToOne: false
            referencedRelation: "grid_educator"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_addresses_people_id_fkey"
            columns: ["people_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      all_uuids_exist_in_storage: {
        Args: { ids: string[] }
        Returns: boolean
      }
      compute_stage_status: {
        Args: {
          p_stage: Database["public"]["Enums"]["ssj_stages"]
          p_status: Database["public"]["Enums"]["school_statuses"]
        }
        Returns: string
      }
      end_of_planning_checklist: {
        Args: { p_school_id: string }
        Returns: boolean
      }
      end_of_startup_checklist: {
        Args: { p_school_id: string }
        Returns: boolean
      }
      enum_values: {
        Args: { enum_type: string }
        Returns: {
          label: string
          value: string
        }[]
      }
    }
    Enums: {
      action_step_status: "Complete" | "Incomplete"
      active_inactive: "Active" | "Inactive" | "Removed"
      admissions_system_options: "TC" | "School Cues"
      advice_panel_stages: "Visioning" | "Planning"
      age_spans: "0-1" | "1-3" | "3-6" | "6-9" | "9-12" | "12-15" | "15-18"
      "ages-grades":
        | "Infants"
        | "Toddlers"
        | "PK3"
        | "PK4"
        | "K"
        | "1st"
        | "2nd"
        | "3rd"
        | "4th"
        | "5th"
        | "6th"
        | "7th"
        | "8th"
        | "9th"
        | "10th"
        | "11th"
        | "12th"
      authorizor_decisions:
        | "Approved"
        | "Approved, with contingency"
        | "Deferred decision"
        | "Denied"
      automation_step_trigger:
        | "Request prelim advice for $3k+"
        | "Request full advice"
        | "Waiting for prelim advice"
        | "Waiting for full advice"
        | "Proceed"
        | "Processing"
        | "Waiting for prereqs"
        | "Complete"
      budget_utility_options: "WF v4"
      business_insurance_options:
        | "Alliant"
        | "other (in process w/ Alliant)"
        | "other"
      certification_completion_status: "Certified" | "Training"
      charter_app_status:
        | "Pre application"
        | "Preparing application"
        | "Awaiting decision"
        | "Authorized, preparing to open"
      charter_status:
        | "Awaiting start of cohort"
        | "Open"
        | "Paused"
        | "Applying"
        | "Approved - Year 0"
        | "Application Submitted - Waiting"
      cohort_type: "Charter" | "Blooms"
      dev_note_type:
        | "crash"
        | "unexpected search results"
        | "unexpected behavior"
        | "UI refinement"
        | "new functionality request"
        | "other"
      developmental_planes:
        | "Infants"
        | "Toddlers"
        | "Primary"
        | "Lower Elementary"
        | "Upper Elementary"
        | "Adolescent / JH"
        | "High School"
      discovery_statuses: "Complete" | "In process" | "Paused"
      domain_name_options: "internal" | "external"
      educ_attainment_options:
        | "Did not graduate high school"
        | "Graduated high school or GED"
        | "Some college or two-year degree"
        | "Graduated college (four-year degree)"
        | "Some graduate school"
        | "Completed graduate school"
      email_address_categories:
        | "personal"
        | "work - non-wildflower"
        | "work - wildflower school"
        | "work - wildflower foundation"
        | "school"
      fiscal_year_end: "06/30" | "12/31"
      gender_categories: "Female" | "Male" | "Gender Non-Conforming" | "Other"
      google_voice_options: "internal license" | "external license"
      governance_models:
        | "Independent"
        | "Charter"
        | "Community Partnership"
        | "District"
        | "Exploring Charter"
        | "NULL"
      group_exemption_status:
        | "Active"
        | "Never part of group exemption"
        | "Withdrawn"
        | "Applying"
        | "Issues"
      gsuite_roles_options: "School Admin - School Orgs"
      guide_types:
        | "Ops Guide"
        | "Entrepreneur"
        | "Equity Coach"
        | "Open Schools Support"
      gusto_options:
        | "yes (under WF)"
        | "yes (independent)"
        | "yes"
        | "no- local system"
        | "no"
      high_med_low: "Low" | "Medium" | "High"
      income_categories:
        | "Very low"
        | "Low"
        | "Middle"
        | "Upper"
        | "Prefer not to respond"
      kanban_visibility: "expanded" | "collapsed" | "suppressed"
      languages:
        | "English"
        | "Spanish - Espa├▒ol"
        | "Mandarin - Σ╕¡µûç"
        | "Hindi - αñ╣αñ┐αñ¿αÑìαñªαÑÇ"
        | "French - Fran├ºais"
        | "Japanese - µùÑµ£¼Φ¬₧"
        | "Arabic - ╪º┘ä╪╣┘Ä╪▒┘Ä╪¿┘É┘è┘Ä┘æ╪⌐"
        | "Urdu - ╪º┘Å╪▒╪»┘Å┘ê"
        | "Hungarian - Hungarian"
        | "Haitian Creole - Kreyol Ayisyen"
        | "Gujarati - α¬ùα½üα¬£α¬░α¬╛α¬ñα½Ç"
        | "Fujian- Fujian"
        | "Russian - ╤Ç╤â╤ü╤ü╨║╨╕╨╣ ╤Å╨╖╤ï╨║"
        | "Korean - φò£Ω╡¡∞û┤"
        | "Cantonese - Gw├│ngd┼½ng w├í"
        | "Tai-Kadai - α╣äα╕ùα╕ó / α║₧α║▓α║¬α║▓α║Ñα║▓α║º"
        | "Portuguese - Portugu├¬s"
        | "Tami - α«ñα««α«┐α«┤α»ì"
        | "Burmese - ßÇÖßÇ╝ßÇößÇ║ßÇÖßÇ¼ßÇàßÇ¼"
        | "Yoruba"
        | "Other"
      legal_structure_options:
        | "Independent organization"
        | "Part of another organization"
        | "Part of a charter"
        | "Multiple WF schools in a single entity"
      loan_status_options:
        | "Interest Only Period"
        | "Paid Off"
        | "Principal Repayment Period"
      loan_vehicle_options:
        | "LF II"
        | "Sep"
        | "Spring Point"
        | "TWF"
        | "TWF->LF II"
      location_types:
        | "Mailing address - no physical school"
        | "Physical address - does not receive mail"
        | "School address and mailing address"
      logo_designer_options: "internal design" | "external design"
      membership_action_options:
        | "Signed Membership Agreement"
        | "Withdrew from Network"
        | "Sent Termination Letter"
      membership_statuses: "Member" | "Non-member" | "Affiliated non-member"
      montessori_associations:
        | "AMI"
        | "AMS"
        | "IMC"
        | "MEPI"
        | "PAMS"
        | "Independent"
        | "Other"
      nonprofit_paths: "Group exemption" | "Direct" | "Charter" | "Partner"
      nps: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10"
      on_national_website_options: "added" | "removed" | "ready to add"
      partner_roles:
        | "TL"
        | "Affiliate of Charter Partner"
        | "Ops Guide"
        | "Teacher Leader"
        | "Foundation Partner"
        | "Regional Entrepreneur"
        | "School Supports Partner"
        | "Finance Administrator"
      pronouns: "he/him/his" | "she/her/hers" | "they/them/theirs" | "other"
      qbo_options:
        | "internal license - active"
        | "external license"
        | "Not WF - Unknown software"
      race_ethnicity_categories:
        | "african_american"
        | "asian_american"
        | "hispanic"
        | "middle_eastern"
        | "native_american"
        | "pacific_islander"
        | "white"
        | "other"
      role_contexts:
        | "Independent school"
        | "Charter"
        | "Foundation"
        | "External"
      school_calendar_options: "9-month" | "10-month" | "Year-round"
      school_roles:
        | "Teacher Leader"
        | "Emerging Teacher Leader"
        | "Founder"
        | "Classroom Staff"
        | "Fellow"
        | "Other"
      school_schedule_options:
        | "Before Care"
        | "Morning Care"
        | "Afternoon Care"
        | "After Care"
      school_statuses:
        | "Emerging"
        | "Open"
        | "Paused"
        | "Disaffiliated"
        | "Permanently Closed"
        | "Placeholder"
      ssj_board_dev_status:
        | "No board"
        | "Board is forming, 1-2 mtgs"
        | "Board is developed and engaged, 3+ mtgs"
      ssj_budget_ready_for_next_steps_enum: "No" | "Unsure" | "Yes"
      ssj_building4good_status_enum: "Matched" | "Requested" | "Upcoming"
      ssj_cohort_status_enum:
        | "Left Cohort"
        | "Returning for Later Cohort"
        | "Switched Ops Guide Supports"
        | "Transitioned to Charter Application Supports"
      ssj_facility_enum:
        | "Purchased building"
        | "Searching, intending to buy"
        | "Searching, intending to rent"
        | "Identified prospect(s)"
        | "Signed lease"
        | "Unsure"
      ssj_form_type: "Get Involved" | "Start a School"
      ssj_has_partner_enum:
        | "No partner"
        | "Partnership established"
        | "Partnership In development"
      ssj_on_track_for_enrollment_enum:
        | "Maybe (process is ready, no prospective students)"
        | "No (process unclear/unpublished, limited/no family engagement)"
        | "Yes - tuition published, plan and community engagement underway"
      ssj_ops_guide_support_track_enum: "Cohort" | "1:1 support"
      ssj_pathway_to_funding_enum:
        | "Maybe, prospects identified but not secured"
        | "No, startup funding unlikely"
        | "Yes, full funding likely"
      ssj_seeking_wf_funding_enum:
        | "No"
        | "Yes, grant"
        | "Yes, grant; Yes, loan"
        | "Yes, loan"
        | "Yes, loan; Yes, grant"
      ssj_stages: "Visioning" | "Planning" | "Startup" | "Year 1" | "Complete"
      ssj_tool_enum:
        | "Charter Slides"
        | "Google Slides"
        | "My Wildflower - Sensible Default"
        | "Platform Pilot"
      state_abbreviation_enum:
        | "AL"
        | "AK"
        | "AZ"
        | "AR"
        | "CA"
        | "CO"
        | "CT"
        | "DE"
        | "DC"
        | "FL"
        | "GA"
        | "HI"
        | "ID"
        | "IL"
        | "IN"
        | "IA"
        | "KS"
        | "KY"
        | "LA"
        | "ME"
        | "MD"
        | "MA"
        | "MI"
        | "MN"
        | "MS"
        | "MO"
        | "MT"
        | "NE"
        | "NV"
        | "NH"
        | "NJ"
        | "NM"
        | "NY"
        | "NC"
        | "ND"
        | "OH"
        | "OK"
        | "OR"
        | "PA"
        | "RI"
        | "SC"
        | "SD"
        | "TN"
        | "TX"
        | "UT"
        | "VT"
        | "VA"
        | "WA"
        | "WV"
        | "WI"
        | "WY"
        | "PR"
      tc_admissions_options: "v1" | "yes"
      tc_recordkeeping_options: "yes (under WF)"
      transparent_classroom_options:
        | "Internal license"
        | "Internal License - removed"
        | "External license"
        | "Other record keeping system"
      use_of_proceeds_options:
        | "Combine 2 loans"
        | "Expansion"
        | "Move"
        | "Operations"
        | "Renovations / Construction"
        | "Security deposit"
        | "Start-up"
      website_tool_options:
        | "external platform"
        | "wordpress v1"
        | "wordpress v2"
        | "wordpress original"
        | "Wix v1"
        | "Wix v2"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      action_step_status: ["Complete", "Incomplete"],
      active_inactive: ["Active", "Inactive", "Removed"],
      admissions_system_options: ["TC", "School Cues"],
      advice_panel_stages: ["Visioning", "Planning"],
      age_spans: ["0-1", "1-3", "3-6", "6-9", "9-12", "12-15", "15-18"],
      "ages-grades": [
        "Infants",
        "Toddlers",
        "PK3",
        "PK4",
        "K",
        "1st",
        "2nd",
        "3rd",
        "4th",
        "5th",
        "6th",
        "7th",
        "8th",
        "9th",
        "10th",
        "11th",
        "12th",
      ],
      authorizor_decisions: [
        "Approved",
        "Approved, with contingency",
        "Deferred decision",
        "Denied",
      ],
      automation_step_trigger: [
        "Request prelim advice for $3k+",
        "Request full advice",
        "Waiting for prelim advice",
        "Waiting for full advice",
        "Proceed",
        "Processing",
        "Waiting for prereqs",
        "Complete",
      ],
      budget_utility_options: ["WF v4"],
      business_insurance_options: [
        "Alliant",
        "other (in process w/ Alliant)",
        "other",
      ],
      certification_completion_status: ["Certified", "Training"],
      charter_app_status: [
        "Pre application",
        "Preparing application",
        "Awaiting decision",
        "Authorized, preparing to open",
      ],
      charter_status: [
        "Awaiting start of cohort",
        "Open",
        "Paused",
        "Applying",
        "Approved - Year 0",
        "Application Submitted - Waiting",
      ],
      cohort_type: ["Charter", "Blooms"],
      dev_note_type: [
        "crash",
        "unexpected search results",
        "unexpected behavior",
        "UI refinement",
        "new functionality request",
        "other",
      ],
      developmental_planes: [
        "Infants",
        "Toddlers",
        "Primary",
        "Lower Elementary",
        "Upper Elementary",
        "Adolescent / JH",
        "High School",
      ],
      discovery_statuses: ["Complete", "In process", "Paused"],
      domain_name_options: ["internal", "external"],
      educ_attainment_options: [
        "Did not graduate high school",
        "Graduated high school or GED",
        "Some college or two-year degree",
        "Graduated college (four-year degree)",
        "Some graduate school",
        "Completed graduate school",
      ],
      email_address_categories: [
        "personal",
        "work - non-wildflower",
        "work - wildflower school",
        "work - wildflower foundation",
        "school",
      ],
      fiscal_year_end: ["06/30", "12/31"],
      gender_categories: ["Female", "Male", "Gender Non-Conforming", "Other"],
      google_voice_options: ["internal license", "external license"],
      governance_models: [
        "Independent",
        "Charter",
        "Community Partnership",
        "District",
        "Exploring Charter",
        "NULL",
      ],
      group_exemption_status: [
        "Active",
        "Never part of group exemption",
        "Withdrawn",
        "Applying",
        "Issues",
      ],
      gsuite_roles_options: ["School Admin - School Orgs"],
      guide_types: [
        "Ops Guide",
        "Entrepreneur",
        "Equity Coach",
        "Open Schools Support",
      ],
      gusto_options: [
        "yes (under WF)",
        "yes (independent)",
        "yes",
        "no- local system",
        "no",
      ],
      high_med_low: ["Low", "Medium", "High"],
      income_categories: [
        "Very low",
        "Low",
        "Middle",
        "Upper",
        "Prefer not to respond",
      ],
      kanban_visibility: ["expanded", "collapsed", "suppressed"],
      languages: [
        "English",
        "Spanish - Espa├▒ol",
        "Mandarin - Σ╕¡µûç",
        "Hindi - αñ╣αñ┐αñ¿αÑìαñªαÑÇ",
        "French - Fran├ºais",
        "Japanese - µùÑµ£¼Φ¬₧",
        "Arabic - ╪º┘ä╪╣┘Ä╪▒┘Ä╪¿┘É┘è┘Ä┘æ╪⌐",
        "Urdu - ╪º┘Å╪▒╪»┘Å┘ê",
        "Hungarian - Hungarian",
        "Haitian Creole - Kreyol Ayisyen",
        "Gujarati - α¬ùα½üα¬£α¬░α¬╛α¬ñα½Ç",
        "Fujian- Fujian",
        "Russian - ╤Ç╤â╤ü╤ü╨║╨╕╨╣ ╤Å╨╖╤ï╨║",
        "Korean - φò£Ω╡¡∞û┤",
        "Cantonese - Gw├│ngd┼½ng w├í",
        "Tai-Kadai - α╣äα╕ùα╕ó / α║₧α║▓α║¬α║▓α║Ñα║▓α║º",
        "Portuguese - Portugu├¬s",
        "Tami - α«ñα««α«┐α«┤α»ì",
        "Burmese - ßÇÖßÇ╝ßÇößÇ║ßÇÖßÇ¼ßÇàßÇ¼",
        "Yoruba",
        "Other",
      ],
      legal_structure_options: [
        "Independent organization",
        "Part of another organization",
        "Part of a charter",
        "Multiple WF schools in a single entity",
      ],
      loan_status_options: [
        "Interest Only Period",
        "Paid Off",
        "Principal Repayment Period",
      ],
      loan_vehicle_options: [
        "LF II",
        "Sep",
        "Spring Point",
        "TWF",
        "TWF->LF II",
      ],
      location_types: [
        "Mailing address - no physical school",
        "Physical address - does not receive mail",
        "School address and mailing address",
      ],
      logo_designer_options: ["internal design", "external design"],
      membership_action_options: [
        "Signed Membership Agreement",
        "Withdrew from Network",
        "Sent Termination Letter",
      ],
      membership_statuses: ["Member", "Non-member", "Affiliated non-member"],
      montessori_associations: [
        "AMI",
        "AMS",
        "IMC",
        "MEPI",
        "PAMS",
        "Independent",
        "Other",
      ],
      nonprofit_paths: ["Group exemption", "Direct", "Charter", "Partner"],
      nps: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
      on_national_website_options: ["added", "removed", "ready to add"],
      partner_roles: [
        "TL",
        "Affiliate of Charter Partner",
        "Ops Guide",
        "Teacher Leader",
        "Foundation Partner",
        "Regional Entrepreneur",
        "School Supports Partner",
        "Finance Administrator",
      ],
      pronouns: ["he/him/his", "she/her/hers", "they/them/theirs", "other"],
      qbo_options: [
        "internal license - active",
        "external license",
        "Not WF - Unknown software",
      ],
      race_ethnicity_categories: [
        "african_american",
        "asian_american",
        "hispanic",
        "middle_eastern",
        "native_american",
        "pacific_islander",
        "white",
        "other",
      ],
      role_contexts: [
        "Independent school",
        "Charter",
        "Foundation",
        "External",
      ],
      school_calendar_options: ["9-month", "10-month", "Year-round"],
      school_roles: [
        "Teacher Leader",
        "Emerging Teacher Leader",
        "Founder",
        "Classroom Staff",
        "Fellow",
        "Other",
      ],
      school_schedule_options: [
        "Before Care",
        "Morning Care",
        "Afternoon Care",
        "After Care",
      ],
      school_statuses: [
        "Emerging",
        "Open",
        "Paused",
        "Disaffiliated",
        "Permanently Closed",
        "Placeholder",
      ],
      ssj_board_dev_status: [
        "No board",
        "Board is forming, 1-2 mtgs",
        "Board is developed and engaged, 3+ mtgs",
      ],
      ssj_budget_ready_for_next_steps_enum: ["No", "Unsure", "Yes"],
      ssj_building4good_status_enum: ["Matched", "Requested", "Upcoming"],
      ssj_cohort_status_enum: [
        "Left Cohort",
        "Returning for Later Cohort",
        "Switched Ops Guide Supports",
        "Transitioned to Charter Application Supports",
      ],
      ssj_facility_enum: [
        "Purchased building",
        "Searching, intending to buy",
        "Searching, intending to rent",
        "Identified prospect(s)",
        "Signed lease",
        "Unsure",
      ],
      ssj_form_type: ["Get Involved", "Start a School"],
      ssj_has_partner_enum: [
        "No partner",
        "Partnership established",
        "Partnership In development",
      ],
      ssj_on_track_for_enrollment_enum: [
        "Maybe (process is ready, no prospective students)",
        "No (process unclear/unpublished, limited/no family engagement)",
        "Yes - tuition published, plan and community engagement underway",
      ],
      ssj_ops_guide_support_track_enum: ["Cohort", "1:1 support"],
      ssj_pathway_to_funding_enum: [
        "Maybe, prospects identified but not secured",
        "No, startup funding unlikely",
        "Yes, full funding likely",
      ],
      ssj_seeking_wf_funding_enum: [
        "No",
        "Yes, grant",
        "Yes, grant; Yes, loan",
        "Yes, loan",
        "Yes, loan; Yes, grant",
      ],
      ssj_stages: ["Visioning", "Planning", "Startup", "Year 1", "Complete"],
      ssj_tool_enum: [
        "Charter Slides",
        "Google Slides",
        "My Wildflower - Sensible Default",
        "Platform Pilot",
      ],
      state_abbreviation_enum: [
        "AL",
        "AK",
        "AZ",
        "AR",
        "CA",
        "CO",
        "CT",
        "DE",
        "DC",
        "FL",
        "GA",
        "HI",
        "ID",
        "IL",
        "IN",
        "IA",
        "KS",
        "KY",
        "LA",
        "ME",
        "MD",
        "MA",
        "MI",
        "MN",
        "MS",
        "MO",
        "MT",
        "NE",
        "NV",
        "NH",
        "NJ",
        "NM",
        "NY",
        "NC",
        "ND",
        "OH",
        "OK",
        "OR",
        "PA",
        "RI",
        "SC",
        "SD",
        "TN",
        "TX",
        "UT",
        "VT",
        "VA",
        "WA",
        "WV",
        "WI",
        "WY",
        "PR",
      ],
      tc_admissions_options: ["v1", "yes"],
      tc_recordkeeping_options: ["yes (under WF)"],
      transparent_classroom_options: [
        "Internal license",
        "Internal License - removed",
        "External license",
        "Other record keeping system",
      ],
      use_of_proceeds_options: [
        "Combine 2 loans",
        "Expansion",
        "Move",
        "Operations",
        "Renovations / Construction",
        "Security deposit",
        "Start-up",
      ],
      website_tool_options: [
        "external platform",
        "wordpress v1",
        "wordpress v2",
        "wordpress original",
        "Wix v1",
        "Wix v2",
      ],
    },
  },
} as const
