// Temporary database types - will be auto-generated later
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      people: {
        Row: Record<string, Json>
        Insert: Record<string, Json>
        Update: Record<string, Json>
      }
      schools: {
        Row: Record<string, Json>
        Insert: Record<string, Json>
        Update: Record<string, Json>
      }
      details_associations: {
        Row: Record<string, Json>
        Insert: Record<string, Json>
        Update: Record<string, Json>
      }
      z_g_emails: {
        Row: Record<string, Json>
        Insert: Record<string, Json>
        Update: Record<string, Json>
      }
      z_g_events: {
        Row: Record<string, Json>
        Insert: Record<string, Json>
        Update: Record<string, Json>
      }
      governance_docs: {
        Row: Record<string, Json>
        Insert: Record<string, Json>
        Update: Record<string, Json>
      }
      nine_nineties: {
        Row: Record<string, Json>
        Insert: Record<string, Json>
        Update: Record<string, Json>
      }
    }
    Views: {
      ui_grid_schools: {
        Row: Record<string, Json>
      }
      ui_details_school: {
        Row: Record<string, Json>
      }
      ui_grid_educators: {
        Row: Record<string, Json>
      }
      ui_details_educator: {
        Row: Record<string, Json>
      }
      ui_school_emails: {
        Row: Record<string, Json>
      }
      ui_school_events: {
        Row: Record<string, Json>
      }
    }
    Functions: {
      update_school_field: {
        Args: { school_id: string; field: string; value: Json }
        Returns: boolean
      }
      update_educator_field: {
        Args: { educator_id: string; field: string; value: Json }
        Returns: boolean
      }
    }
  }
}