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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      community_questions: {
        Row: {
          answer: string | null
          created_at: string
          id: string
          question: string
          status: string
          updated_at: string
          user_name: string | null
        }
        Insert: {
          answer?: string | null
          created_at?: string
          id?: string
          question: string
          status?: string
          updated_at?: string
          user_name?: string | null
        }
        Update: {
          answer?: string | null
          created_at?: string
          id?: string
          question?: string
          status?: string
          updated_at?: string
          user_name?: string | null
        }
        Relationships: []
      }
      daily_wisdom: {
        Row: {
          id: string
          reference_am: string
          reference_en: string
          updated_at: string
          verse_am: string
          verse_en: string
        }
        Insert: {
          id?: string
          reference_am?: string
          reference_en?: string
          updated_at?: string
          verse_am?: string
          verse_en?: string
        }
        Update: {
          id?: string
          reference_am?: string
          reference_en?: string
          updated_at?: string
          verse_am?: string
          verse_en?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          category: string
          created_at: string
          file_url: string
          id: string
          title: string
          title_am: string | null
        }
        Insert: {
          category?: string
          created_at?: string
          file_url: string
          id?: string
          title: string
          title_am?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          file_url?: string
          id?: string
          title?: string
          title_am?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string
          description: string | null
          description_am: string | null
          event_date: string | null
          event_time: string | null
          event_type: string
          id: string
          location: string | null
          location_am: string | null
          recurring: boolean
          title: string
          title_am: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          description_am?: string | null
          event_date?: string | null
          event_time?: string | null
          event_type?: string
          id?: string
          location?: string | null
          location_am?: string | null
          recurring?: boolean
          title: string
          title_am?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          description_am?: string | null
          event_date?: string | null
          event_time?: string | null
          event_type?: string
          id?: string
          location?: string | null
          location_am?: string | null
          recurring?: boolean
          title?: string
          title_am?: string | null
        }
        Relationships: []
      }
      gallery: {
        Row: {
          category: string
          created_at: string
          id: string
          image_url: string
          title: string
          title_am: string | null
        }
        Insert: {
          category?: string
          created_at?: string
          id?: string
          image_url: string
          title: string
          title_am?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          image_url?: string
          title?: string
          title_am?: string | null
        }
        Relationships: []
      }
      hymns: {
        Row: {
          artist: string
          audio_url: string | null
          created_at: string
          duration: string | null
          id: string
          title: string
        }
        Insert: {
          artist?: string
          audio_url?: string | null
          created_at?: string
          duration?: string | null
          id?: string
          title: string
        }
        Update: {
          artist?: string
          audio_url?: string | null
          created_at?: string
          duration?: string | null
          id?: string
          title?: string
        }
        Relationships: []
      }
      members: {
        Row: {
          age: number | null
          baptismal_father: string | null
          christian_name: string | null
          created_at: string
          department: string | null
          full_name: string
          id: string
          phone: string | null
          status: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          age?: number | null
          baptismal_father?: string | null
          christian_name?: string | null
          created_at?: string
          department?: string | null
          full_name: string
          id?: string
          phone?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          age?: number | null
          baptismal_father?: string | null
          christian_name?: string | null
          created_at?: string
          department?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      posts: {
        Row: {
          author_id: string | null
          category: string
          content: string | null
          created_at: string
          id: string
          level: string | null
          published: boolean | null
          reading_time: number | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          category?: string
          content?: string | null
          created_at?: string
          id?: string
          level?: string | null
          published?: boolean | null
          reading_time?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          category?: string
          content?: string | null
          created_at?: string
          id?: string
          level?: string | null
          published?: boolean | null
          reading_time?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      prayer_requests: {
        Row: {
          created_at: string
          id: string
          is_anonymous: boolean | null
          name: string
          prayer_text: string
          status: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_anonymous?: boolean | null
          name: string
          prayer_text: string
          status?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_anonymous?: boolean | null
          name?: string
          prayer_text?: string
          status?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          christian_name: string | null
          created_at: string
          full_name: string | null
          id: string
          language: string | null
          phone: string | null
          theme: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          christian_name?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          language?: string | null
          phone?: string | null
          theme?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          christian_name?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          language?: string | null
          phone?: string | null
          theme?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          active: boolean
          created_at: string
          goal_amount: number
          id: string
          name: string
          name_am: string | null
          raised_amount: number
        }
        Insert: {
          active?: boolean
          created_at?: string
          goal_amount?: number
          id?: string
          name: string
          name_am?: string | null
          raised_amount?: number
        }
        Update: {
          active?: boolean
          created_at?: string
          goal_amount?: number
          id?: string
          name?: string
          name_am?: string | null
          raised_amount?: number
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          id: string
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string
          value?: string
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
