// Generated database types based on schema information
// This replaces the placeholder types with real field definitions

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
          name: string | null
          short_name: string | null
          status: string | null
          governance_model: string | null
          ages_served: string[] | null
          membership_status: string | null
          projected_open: string | null
          about: string | null
          phone: string | null
          email: string | null
          website: string | null
          physical_address: string | null
          mailing_address: string | null
          archived: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name?: string | null
          short_name?: string | null
          status?: string | null
          governance_model?: string | null
          ages_served?: string[] | null
          membership_status?: string | null
          projected_open?: string | null
          about?: string | null
          phone?: string | null
          email?: string | null
          website?: string | null
          physical_address?: string | null
          mailing_address?: string | null
          archived?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          short_name?: string | null
          status?: string | null
          governance_model?: string | null
          ages_served?: string[] | null
          membership_status?: string | null
          projected_open?: string | null
          about?: string | null
          phone?: string | null
          email?: string | null
          website?: string | null
          physical_address?: string | null
          mailing_address?: string | null
          archived?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      people: {
        Row: {
          id: string
          full_name: string | null
          first_name: string | null
          last_name: string | null
          middle_name: string | null
          primary_email: string | null
          non_wildflower_email: string | null
          primary_phone: string | null
          secondary_phone: string | null
          home_address: string | null
          discovery_status: string | null
          has_montessori_cert: boolean | null
          race_ethnicity: string | null
          race_ethnicity_display: string | null
          primary_languages: string[] | null
          other_languages: string[] | null
          kanban_group: string | null
          kanban_order: number | null
          inactive_flag: boolean | null
          pronouns: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          full_name?: string | null
          first_name?: string | null
          last_name?: string | null
          middle_name?: string | null
          primary_email?: string | null
          non_wildflower_email?: string | null
          primary_phone?: string | null
          secondary_phone?: string | null
          home_address?: string | null
          discovery_status?: string | null
          has_montessori_cert?: boolean | null
          race_ethnicity?: string | null
          race_ethnicity_display?: string | null
          primary_languages?: string[] | null
          other_languages?: string[] | null
          kanban_group?: string | null
          kanban_order?: number | null
          inactive_flag?: boolean | null
          pronouns?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          first_name?: string | null
          last_name?: string | null
          middle_name?: string | null
          primary_email?: string | null
          non_wildflower_email?: string | null
          primary_phone?: string | null
          secondary_phone?: string | null
          home_address?: string | null
          discovery_status?: string | null
          has_montessori_cert?: boolean | null
          race_ethnicity?: string | null
          race_ethnicity_display?: string | null
          primary_languages?: string[] | null
          other_languages?: string[] | null
          kanban_group?: string | null
          kanban_order?: number | null
          inactive_flag?: boolean | null
          pronouns?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      details_associations: {
        Row: {
          id: string
          people_id: string | null
          school_id: string | null
          role: string[] | null
          start_date: string | null
          end_date: string | null
          currently_active: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          people_id?: string | null
          school_id?: string | null
          role?: string[] | null
          start_date?: string | null
          end_date?: string | null
          currently_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          people_id?: string | null
          school_id?: string | null
          role?: string[] | null
          start_date?: string | null
          end_date?: string | null
          currently_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "details_associations_people_id_fkey"
            columns: ["people_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "details_associations_school_id_fkey"
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
          email_id: string | null
          school_id: string | null
          people_id: string | null
          date: string | null
          subject: string | null
          from_email: string | null
          to_emails: string[] | null
          cc_emails: string[] | null
          body_text: string | null
          attachments_count: number | null
          created_at: string
        }
        Insert: {
          id?: string
          email_id?: string | null
          school_id?: string | null
          people_id?: string | null
          date?: string | null
          subject?: string | null
          from_email?: string | null
          to_emails?: string[] | null
          cc_emails?: string[] | null
          body_text?: string | null
          attachments_count?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          email_id?: string | null
          school_id?: string | null
          people_id?: string | null
          date?: string | null
          subject?: string | null
          from_email?: string | null
          to_emails?: string[] | null
          cc_emails?: string[] | null
          body_text?: string | null
          attachments_count?: number | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "z_g_emails_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "z_g_emails_people_id_fkey"
            columns: ["people_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          }
        ]
      }
      z_g_events: {
        Row: {
          id: string
          event_id: string | null
          school_id: string | null
          people_id: string | null
          summary: string | null
          description: string | null
          start_time: string | null
          end_time: string | null
          attendees_count: number | null
          location: string | null
          created_at: string
        }
        Insert: {
          id?: string
          event_id?: string | null
          school_id?: string | null
          people_id?: string | null
          summary?: string | null
          description?: string | null
          start_time?: string | null
          end_time?: string | null
          attendees_count?: number | null
          location?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string | null
          school_id?: string | null
          people_id?: string | null
          summary?: string | null
          description?: string | null
          start_time?: string | null
          end_time?: string | null
          attendees_count?: number | null
          location?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "z_g_events_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "z_g_events_people_id_fkey"
            columns: ["people_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          }
        ]
      }
      governance_docs: {
        Row: {
          id: string
          school_id: string | null
          document_type: string | null
          title: string | null
          url: string | null
          status: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          school_id?: string | null
          document_type?: string | null
          title?: string | null
          url?: string | null
          status?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          school_id?: string | null
          document_type?: string | null
          title?: string | null
          url?: string | null
          status?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
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
          school_id: string | null
          report_period: string | null
          data: Json | null
          submitted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          school_id?: string | null
          report_period?: string | null
          data?: Json | null
          submitted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          school_id?: string | null
          report_period?: string | null
          data?: Json | null
          submitted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "nine_nineties_school_id_fkey"
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
          physicalAddress: string | null
          mailingAddress: string | null
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
          primaryEmail: string | null
          nonWildflowerEmail: string | null
          primaryPhone: string | null
          secondaryPhone: string | null
          homeAddress: string | null
          discoveryStatus: string | null
          hasMontessoriCert: boolean | null
          raceEthnicity: string | null
          raceEthnicityDisplay: string | null
          primaryLanguages: string[] | null
          otherLanguages: string[] | null
          kanbanGroup: string | null
          kanbanOrder: number | null
          pronouns: string | null
          inactive_flag: boolean | null
          created_at: string
          updated_at: string
        }
        Relationships: []
      }
      ui_school_emails: {
        Row: {
          id: string
          email_id: string | null
          school_id: string | null
          people_id: string | null
          date: string | null
          subject: string | null
          from_email: string | null
          to_emails: string[] | null
          cc_emails: string[] | null
          body_text: string | null
          attachments_count: number | null
          created_at: string
        }
        Relationships: []
      }
      ui_school_events: {
        Row: {
          id: string
          event_id: string | null
          school_id: string | null
          people_id: string | null
          summary: string | null
          description: string | null
          start_time: string | null
          end_time: string | null
          attendees_count: number | null
          location: string | null
          created_at: string
        }
        Relationships: []
      }
      ui_educator_emails: {
        Row: {
          id: string
          email_id: string | null
          school_id: string | null
          people_id: string | null
          date: string | null
          subject: string | null
          from_email: string | null
          to_emails: string[] | null
          cc_emails: string[] | null
          body_text: string | null
          attachments_count: number | null
          created_at: string
        }
        Relationships: []
      }
      ui_educator_events: {
        Row: {
          id: string
          event_id: string | null
          school_id: string | null
          people_id: string | null
          summary: string | null
          description: string | null
          start_time: string | null
          end_time: string | null
          attendees_count: number | null
          location: string | null
          created_at: string
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