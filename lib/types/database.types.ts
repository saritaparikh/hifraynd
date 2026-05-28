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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      companies: {
        Row: {
          created_at: string
          id: string
          industry: string | null
          name: string
          notes: string | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          industry?: string | null
          name: string
          notes?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          industry?: string | null
          name?: string
          notes?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      deliveries: {
        Row: {
          completed: boolean
          completed_at: string | null
          created_at: string
          description: string
          direction: Database["public"]["Enums"]["delivery_direction"]
          due_date: string | null
          id: string
          interaction_id: string | null
          person_id: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          description: string
          direction: Database["public"]["Enums"]["delivery_direction"]
          due_date?: string | null
          id?: string
          interaction_id?: string | null
          person_id: string
          user_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          description?: string
          direction?: Database["public"]["Enums"]["delivery_direction"]
          due_date?: string | null
          id?: string
          interaction_id?: string | null
          person_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "deliveries_interaction_id_fkey"
            columns: ["interaction_id"]
            isOneToOne: false
            referencedRelation: "interactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deliveries_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "persons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deliveries_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "persons_with_last_contact"
            referencedColumns: ["id"]
          },
        ]
      }
      interactions: {
        Row: {
          created_at: string
          id: string
          interaction_date: string
          notes: string | null
          person_id: string
          title: string | null
          type: Database["public"]["Enums"]["interaction_type"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          interaction_date: string
          notes?: string | null
          person_id: string
          title?: string | null
          type: Database["public"]["Enums"]["interaction_type"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          interaction_date?: string
          notes?: string | null
          person_id?: string
          title?: string | null
          type?: Database["public"]["Enums"]["interaction_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "interactions_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "persons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interactions_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "persons_with_last_contact"
            referencedColumns: ["id"]
          },
        ]
      }
      person_tags: {
        Row: {
          person_id: string
          tag_id: string
        }
        Insert: {
          person_id: string
          tag_id: string
        }
        Update: {
          person_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "person_tags_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "persons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "person_tags_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "persons_with_last_contact"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "person_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      persons: {
        Row: {
          cadence_days: number | null
          company_id: string | null
          created_at: string
          email: string | null
          first_name: string
          how_we_met: string | null
          id: string
          introduced_by: string | null
          job_search_relevant: boolean
          last_name: string
          linkedin_url: string | null
          location: string | null
          next_reach_out_date: string | null
          personal_notes: string | null
          phone: string | null
          professional_notes: string | null
          relationship_strength:
            | Database["public"]["Enums"]["relationship_strength"]
            | null
          relationship_type:
            | Database["public"]["Enums"]["relationship_type"][]
            | null
          status: Database["public"]["Enums"]["contact_status"]
          title: string | null
          updated_at: string
          user_id: string
          what_i_can_do_for_them: string | null
        }
        Insert: {
          cadence_days?: number | null
          company_id?: string | null
          created_at?: string
          email?: string | null
          first_name: string
          how_we_met?: string | null
          id?: string
          introduced_by?: string | null
          job_search_relevant?: boolean
          last_name: string
          linkedin_url?: string | null
          location?: string | null
          next_reach_out_date?: string | null
          personal_notes?: string | null
          phone?: string | null
          professional_notes?: string | null
          relationship_strength?:
            | Database["public"]["Enums"]["relationship_strength"]
            | null
          relationship_type?:
            | Database["public"]["Enums"]["relationship_type"][]
            | null
          status?: Database["public"]["Enums"]["contact_status"]
          title?: string | null
          updated_at?: string
          user_id: string
          what_i_can_do_for_them?: string | null
        }
        Update: {
          cadence_days?: number | null
          company_id?: string | null
          created_at?: string
          email?: string | null
          first_name?: string
          how_we_met?: string | null
          id?: string
          introduced_by?: string | null
          job_search_relevant?: boolean
          last_name?: string
          linkedin_url?: string | null
          location?: string | null
          next_reach_out_date?: string | null
          personal_notes?: string | null
          phone?: string | null
          professional_notes?: string | null
          relationship_strength?:
            | Database["public"]["Enums"]["relationship_strength"]
            | null
          relationship_type?:
            | Database["public"]["Enums"]["relationship_type"][]
            | null
          status?: Database["public"]["Enums"]["contact_status"]
          title?: string | null
          updated_at?: string
          user_id?: string
          what_i_can_do_for_them?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "persons_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "persons_introduced_by_fkey"
            columns: ["introduced_by"]
            isOneToOne: false
            referencedRelation: "persons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "persons_introduced_by_fkey"
            columns: ["introduced_by"]
            isOneToOne: false
            referencedRelation: "persons_with_last_contact"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          created_at: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      persons_with_last_contact: {
        Row: {
          cadence_days: number | null
          company_id: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          how_we_met: string | null
          id: string | null
          introduced_by: string | null
          job_search_relevant: boolean | null
          last_contact_date: string | null
          last_name: string | null
          linkedin_url: string | null
          location: string | null
          next_reach_out_date: string | null
          personal_notes: string | null
          phone: string | null
          professional_notes: string | null
          relationship_strength:
            | Database["public"]["Enums"]["relationship_strength"]
            | null
          relationship_type:
            | Database["public"]["Enums"]["relationship_type"][]
            | null
          status: Database["public"]["Enums"]["contact_status"] | null
          title: string | null
          updated_at: string | null
          user_id: string | null
          what_i_can_do_for_them: string | null
        }
        Relationships: [
          {
            foreignKeyName: "persons_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "persons_introduced_by_fkey"
            columns: ["introduced_by"]
            isOneToOne: false
            referencedRelation: "persons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "persons_introduced_by_fkey"
            columns: ["introduced_by"]
            isOneToOne: false
            referencedRelation: "persons_with_last_contact"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      contact_status: "potential" | "active" | "nurture" | "dormant"
      delivery_direction: "to_them" | "from_them"
      interaction_type: "email" | "call" | "in_person" | "other"
      relationship_strength: "strong" | "medium" | "casual"
      relationship_type:
        | "friend"
        | "former_colleague"
        | "current_colleague"
        | "mentor"
        | "mentee"
        | "recruiter"
        | "investor"
        | "acquaintance"
        | "other"
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
      contact_status: ["potential", "active", "nurture", "dormant"],
      delivery_direction: ["to_them", "from_them"],
      interaction_type: ["email", "call", "in_person", "other"],
      relationship_strength: ["strong", "medium", "casual"],
      relationship_type: [
        "friend",
        "former_colleague",
        "current_colleague",
        "mentor",
        "mentee",
        "recruiter",
        "investor",
        "acquaintance",
        "other",
      ],
    },
  },
} as const
