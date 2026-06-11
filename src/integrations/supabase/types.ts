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
      ai_insights: {
        Row: {
          category: string | null
          content: string
          created_at: string | null
          id: string
          is_read: boolean | null
          user_id: string
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          user_id: string
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      challenge_participations: {
        Row: {
          challenge_id: string
          created_at: string | null
          id: string
          progress_percent: number | null
          status: string | null
          user_id: string
        }
        Insert: {
          challenge_id: string
          created_at?: string | null
          id?: string
          progress_percent?: number | null
          status?: string | null
          user_id: string
        }
        Update: {
          challenge_id?: string
          created_at?: string | null
          id?: string
          progress_percent?: number | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenge_participations_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      challenges: {
        Row: {
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          start_date: string | null
          title: string
          type: string | null
          xp_reward: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          start_date?: string | null
          title: string
          type?: string | null
          xp_reward?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          start_date?: string | null
          title?: string
          type?: string | null
          xp_reward?: number | null
        }
        Relationships: []
      }
      partner_notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          partner_id: string
          title: string
          type: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          partner_id: string
          title: string
          type?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          partner_id?: string
          title?: string
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partner_notifications_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partner_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_profiles: {
        Row: {
          active_premium_count: number | null
          affiliate_code: string | null
          created_at: string | null
          current_balance: number | null
          id: string
          partner_level: number | null
          pending_balance: number | null
          status: string | null
          students_count: number | null
          total_earned: number | null
          updated_at: string | null
        }
        Insert: {
          active_premium_count?: number | null
          affiliate_code?: string | null
          created_at?: string | null
          current_balance?: number | null
          id: string
          partner_level?: number | null
          pending_balance?: number | null
          status?: string | null
          students_count?: number | null
          total_earned?: number | null
          updated_at?: string | null
        }
        Update: {
          active_premium_count?: number | null
          affiliate_code?: string | null
          created_at?: string | null
          current_balance?: number | null
          id?: string
          partner_level?: number | null
          pending_balance?: number | null
          status?: string | null
          students_count?: number | null
          total_earned?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partner_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pillars_data: {
        Row: {
          agua: number | null
          created_at: string | null
          date: string
          humor: number | null
          id: string
          nutricao: number | null
          sono: number | null
          total_score: number | null
          treino: number | null
          user_id: string
        }
        Insert: {
          agua?: number | null
          created_at?: string | null
          date?: string
          humor?: number | null
          id?: string
          nutricao?: number | null
          sono?: number | null
          total_score?: number | null
          treino?: number | null
          user_id: string
        }
        Update: {
          agua?: number | null
          created_at?: string | null
          date?: string
          humor?: number | null
          id?: string
          nutricao?: number | null
          sono?: number | null
          total_score?: number | null
          treino?: number | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          goals: string[] | null
          id: string
          nickname: string | null
          shub_score: number | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          goals?: string[] | null
          id: string
          nickname?: string | null
          shub_score?: number | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          goals?: string[] | null
          id?: string
          nickname?: string | null
          shub_score?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      referrals: {
        Row: {
          commission_rate: number | null
          created_at: string | null
          id: string
          is_lifetime: boolean | null
          partner_id: string
          referred_user_id: string
          status: string | null
        }
        Insert: {
          commission_rate?: number | null
          created_at?: string | null
          id?: string
          is_lifetime?: boolean | null
          partner_id: string
          referred_user_id: string
          status?: string | null
        }
        Update: {
          commission_rate?: number | null
          created_at?: string | null
          id?: string
          is_lifetime?: boolean | null
          partner_id?: string
          referred_user_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referrals_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partner_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sleep_logs: {
        Row: {
          awake_minutes: number | null
          created_at: string | null
          date: string
          deep_sleep_minutes: number | null
          id: string
          light_sleep_minutes: number | null
          rem_sleep_minutes: number | null
          score: number | null
          stages_data: Json | null
          total_minutes: number | null
          user_id: string
        }
        Insert: {
          awake_minutes?: number | null
          created_at?: string | null
          date?: string
          deep_sleep_minutes?: number | null
          id?: string
          light_sleep_minutes?: number | null
          rem_sleep_minutes?: number | null
          score?: number | null
          stages_data?: Json | null
          total_minutes?: number | null
          user_id: string
        }
        Update: {
          awake_minutes?: number | null
          created_at?: string | null
          date?: string
          deep_sleep_minutes?: number | null
          id?: string
          light_sleep_minutes?: number | null
          rem_sleep_minutes?: number | null
          score?: number | null
          stages_data?: Json | null
          total_minutes?: number | null
          user_id?: string
        }
        Relationships: []
      }
      wallet_transactions: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          id: string
          partner_id: string
          reference_id: string | null
          status: string | null
          type: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          id?: string
          partner_id: string
          reference_id?: string | null
          status?: string | null
          type: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
          partner_id?: string
          reference_id?: string | null
          status?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallet_transactions_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partner_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      water_logs: {
        Row: {
          amount_ml: number
          created_at: string | null
          date: string
          id: string
          user_id: string
        }
        Insert: {
          amount_ml: number
          created_at?: string | null
          date?: string
          id?: string
          user_id: string
        }
        Update: {
          amount_ml?: number
          created_at?: string | null
          date?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      workout_logs: {
        Row: {
          calories_burned: number | null
          created_at: string | null
          date: string
          duration_actual: number | null
          id: string
          notes: string | null
          user_id: string
          workout_id: string | null
        }
        Insert: {
          calories_burned?: number | null
          created_at?: string | null
          date?: string
          duration_actual?: number | null
          id?: string
          notes?: string | null
          user_id: string
          workout_id?: string | null
        }
        Update: {
          calories_burned?: number | null
          created_at?: string | null
          date?: string
          duration_actual?: number | null
          id?: string
          notes?: string | null
          user_id?: string
          workout_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workout_logs_workout_id_fkey"
            columns: ["workout_id"]
            isOneToOne: false
            referencedRelation: "workouts"
            referencedColumns: ["id"]
          },
        ]
      }
      workouts: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          duration_minutes: number | null
          estimated_calories: number | null
          exercises: Json | null
          id: string
          intensity: string | null
          title: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          estimated_calories?: number | null
          exercises?: Json | null
          id?: string
          intensity?: string | null
          title: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          estimated_calories?: number | null
          exercises?: Json | null
          id?: string
          intensity?: string | null
          title?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_partner_stats: { Args: { p_id: string }; Returns: Json }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
