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
      app_settings: {
        Row: {
          commission_percentage: number
          id: string
          personal_premium_price: number
          personal_pro_price: number
          student_premium_price: number
          updated_at: string
        }
        Insert: {
          commission_percentage?: number
          id?: string
          personal_premium_price?: number
          personal_pro_price?: number
          student_premium_price?: number
          updated_at?: string
        }
        Update: {
          commission_percentage?: number
          id?: string
          personal_premium_price?: number
          personal_pro_price?: number
          student_premium_price?: number
          updated_at?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          entity: string
          entity_id: string | null
          id: string
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          entity: string
          entity_id?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          entity?: string
          entity_id?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      badges: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          level: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          level?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          level?: string
          name?: string
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
      comments: {
        Row: {
          content: string
          created_at: string
          id: string
          post_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          post_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      commissions: {
        Row: {
          amount: number
          created_at: string
          generated_at: string
          id: string
          personal_id: string
          status: string
          student_id: string
          subscription_id: string | null
        }
        Insert: {
          amount?: number
          created_at?: string
          generated_at?: string
          id?: string
          personal_id: string
          status?: string
          student_id: string
          subscription_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          generated_at?: string
          id?: string
          personal_id?: string
          status?: string
          student_id?: string
          subscription_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "commissions_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      exercises: {
        Row: {
          created_at: string
          id: string
          name: string
          notes: string | null
          order_position: number
          reps: string
          rest_time: number
          sets: number
          updated_at: string
          workout_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          notes?: string | null
          order_position?: number
          reps?: string
          rest_time?: number
          sets?: number
          updated_at?: string
          workout_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          notes?: string | null
          order_position?: number
          reps?: string
          rest_time?: number
          sets?: number
          updated_at?: string
          workout_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercises_workout_id_fkey"
            columns: ["workout_id"]
            isOneToOne: false
            referencedRelation: "workouts"
            referencedColumns: ["id"]
          },
        ]
      }
      gps_points: {
        Row: {
          accuracy: number | null
          activity_id: string
          altitude: number | null
          created_at: string
          id: string
          latitude: number
          longitude: number
          recorded_at: string
          speed: number | null
          user_id: string
        }
        Insert: {
          accuracy?: number | null
          activity_id: string
          altitude?: number | null
          created_at?: string
          id?: string
          latitude: number
          longitude: number
          recorded_at?: string
          speed?: number | null
          user_id: string
        }
        Update: {
          accuracy?: number | null
          activity_id?: string
          altitude?: number | null
          created_at?: string
          id?: string
          latitude?: number
          longitude?: number
          recorded_at?: string
          speed?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gps_points_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "running_activities"
            referencedColumns: ["id"]
          },
        ]
      }
      influencer_commissions: {
        Row: {
          amount: number
          created_at: string
          id: string
          influencer_id: string
          period_month: string | null
          referral_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          influencer_id: string
          period_month?: string | null
          referral_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          influencer_id?: string
          period_month?: string | null
          referral_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "influencer_commissions_influencer_id_fkey"
            columns: ["influencer_id"]
            isOneToOne: false
            referencedRelation: "influencers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "influencer_commissions_referral_id_fkey"
            columns: ["referral_id"]
            isOneToOne: false
            referencedRelation: "influencer_referrals"
            referencedColumns: ["id"]
          },
        ]
      }
      influencer_referrals: {
        Row: {
          created_at: string
          id: string
          influencer_id: string
          referred_user_id: string
          status: string
          subscription_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          influencer_id: string
          referred_user_id: string
          status?: string
          subscription_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          influencer_id?: string
          referred_user_id?: string
          status?: string
          subscription_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "influencer_referrals_influencer_id_fkey"
            columns: ["influencer_id"]
            isOneToOne: false
            referencedRelation: "influencers"
            referencedColumns: ["id"]
          },
        ]
      }
      influencers: {
        Row: {
          code: string
          commission_rate: number
          created_at: string
          current_balance: number
          display_name: string | null
          id: string
          pending_balance: number
          status: string
          total_earned: number
          updated_at: string
          user_id: string
        }
        Insert: {
          code: string
          commission_rate?: number
          created_at?: string
          current_balance?: number
          display_name?: string | null
          id?: string
          pending_balance?: number
          status?: string
          total_earned?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          code?: string
          commission_rate?: number
          created_at?: string
          current_balance?: number
          display_name?: string | null
          id?: string
          pending_balance?: number
          status?: string
          total_earned?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      mood_logs: {
        Row: {
          created_at: string
          id: string
          logged_at: string
          mood: number
          notes: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          logged_at?: string
          mood: number
          notes?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          logged_at?: string
          mood?: number
          notes?: string | null
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          title?: string
          type?: string
          user_id?: string
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
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          partner_id: string
          title: string
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          partner_id?: string
          title?: string
          type?: string | null
          updated_at?: string | null
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
      personal_students: {
        Row: {
          created_at: string
          end_date: string | null
          id: string
          personal_id: string
          start_date: string
          status: string
          student_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          id?: string
          personal_id: string
          start_date?: string
          status?: string
          student_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_date?: string | null
          id?: string
          personal_id?: string
          start_date?: string
          status?: string
          student_id?: string
          updated_at?: string
        }
        Relationships: []
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
      posts: {
        Row: {
          comments_count: number
          content: string
          created_at: string
          deleted_at: string | null
          id: string
          image_url: string | null
          likes_count: number
          updated_at: string
          user_id: string
        }
        Insert: {
          comments_count?: number
          content: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          image_url?: string | null
          likes_count?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          comments_count?: number
          content?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          image_url?: string | null
          likes_count?: number
          updated_at?: string
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
      rankings: {
        Row: {
          city: string | null
          created_at: string
          id: string
          period: string
          position: number
          score: number
          updated_at: string
          user_id: string
        }
        Insert: {
          city?: string | null
          created_at?: string
          id?: string
          period?: string
          position?: number
          score?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          city?: string | null
          created_at?: string
          id?: string
          period?: string
          position?: number
          score?: number
          updated_at?: string
          user_id?: string
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
          updated_at: string | null
        }
        Insert: {
          commission_rate?: number | null
          created_at?: string | null
          id?: string
          is_lifetime?: boolean | null
          partner_id: string
          referred_user_id: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          commission_rate?: number | null
          created_at?: string | null
          id?: string
          is_lifetime?: boolean | null
          partner_id?: string
          referred_user_id?: string
          status?: string | null
          updated_at?: string | null
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
      running_activities: {
        Row: {
          activity_type: string
          avg_pace: number | null
          avg_speed: number | null
          calories: number
          created_at: string
          distance_km: number
          duration_seconds: number
          end_time: string | null
          id: string
          map_image_url: string | null
          notes: string | null
          route_polyline: string | null
          shub_score_delta: number
          start_time: string
          updated_at: string
          user_id: string
          xp_earned: number
        }
        Insert: {
          activity_type?: string
          avg_pace?: number | null
          avg_speed?: number | null
          calories?: number
          created_at?: string
          distance_km?: number
          duration_seconds?: number
          end_time?: string | null
          id?: string
          map_image_url?: string | null
          notes?: string | null
          route_polyline?: string | null
          shub_score_delta?: number
          start_time?: string
          updated_at?: string
          user_id: string
          xp_earned?: number
        }
        Update: {
          activity_type?: string
          avg_pace?: number | null
          avg_speed?: number | null
          calories?: number
          created_at?: string
          distance_km?: number
          duration_seconds?: number
          end_time?: string | null
          id?: string
          map_image_url?: string | null
          notes?: string | null
          route_polyline?: string | null
          shub_score_delta?: number
          start_time?: string
          updated_at?: string
          user_id?: string
          xp_earned?: number
        }
        Relationships: []
      }
      shub_scores: {
        Row: {
          created_at: string
          discipline_score: number
          id: string
          mood_score: number
          score_date: string
          sleep_score: number
          total_score: number
          user_id: string
          water_score: number
          workout_score: number
        }
        Insert: {
          created_at?: string
          discipline_score?: number
          id?: string
          mood_score?: number
          score_date?: string
          sleep_score?: number
          total_score?: number
          user_id: string
          water_score?: number
          workout_score?: number
        }
        Update: {
          created_at?: string
          discipline_score?: number
          id?: string
          mood_score?: number
          score_date?: string
          sleep_score?: number
          total_score?: number
          user_id?: string
          water_score?: number
          workout_score?: number
        }
        Relationships: []
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
      streaks: {
        Row: {
          best_streak: number
          created_at: string
          current_streak: number
          id: string
          last_activity_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          best_streak?: number
          created_at?: string
          current_streak?: number
          id?: string
          last_activity_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          best_streak?: number
          created_at?: string
          current_streak?: number
          id?: string
          last_activity_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          billing_cycle: string
          created_at: string
          expires_at: string | null
          id: string
          plan_type: string
          price: number
          started_at: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          billing_cycle?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          plan_type: string
          price?: number
          started_at?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          billing_cycle?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          plan_type?: string
          price?: number
          started_at?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_id: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          badge_id: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          badge_id?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
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
          updated_at: string | null
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
          updated_at?: string | null
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
          updated_at?: string | null
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
      wallets: {
        Row: {
          balance: number
          created_at: string
          id: string
          pending_balance: number
          personal_id: string
          total_earned: number
          updated_at: string
        }
        Insert: {
          balance?: number
          created_at?: string
          id?: string
          pending_balance?: number
          personal_id: string
          total_earned?: number
          updated_at?: string
        }
        Update: {
          balance?: number
          created_at?: string
          id?: string
          pending_balance?: number
          personal_id?: string
          total_earned?: number
          updated_at?: string
        }
        Relationships: []
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
          difficulty: string | null
          duration_minutes: number | null
          estimated_calories: number | null
          exercises: Json | null
          id: string
          intensity: string | null
          is_active: boolean
          personal_id: string | null
          student_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          duration_minutes?: number | null
          estimated_calories?: number | null
          exercises?: Json | null
          id?: string
          intensity?: string | null
          is_active?: boolean
          personal_id?: string | null
          student_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          duration_minutes?: number | null
          estimated_calories?: number | null
          exercises?: Json | null
          id?: string
          intensity?: string | null
          is_active?: boolean
          personal_id?: string | null
          student_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_partner_stats: { Args: { p_id: string }; Returns: Json }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "student" | "personal" | "admin" | "influencer"
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
      app_role: ["student", "personal", "admin", "influencer"],
    },
  },
} as const
