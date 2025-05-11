export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_audit_logs: {
        Row: {
          action_type: string
          admin_email: string | null
          browser: string | null
          cpu_cores: number | null
          created_at: string
          details: Json | null
          device_type: string | null
          id: string
          ip_address: string | null
          language: string | null
          memory: string | null
          network_type: string | null
          os: string | null
          platform: string | null
          screen_resolution: string | null
          timezone: string | null
          user_agent: string | null
        }
        Insert: {
          action_type: string
          admin_email?: string | null
          browser?: string | null
          cpu_cores?: number | null
          created_at?: string
          details?: Json | null
          device_type?: string | null
          id?: string
          ip_address?: string | null
          language?: string | null
          memory?: string | null
          network_type?: string | null
          os?: string | null
          platform?: string | null
          screen_resolution?: string | null
          timezone?: string | null
          user_agent?: string | null
        }
        Update: {
          action_type?: string
          admin_email?: string | null
          browser?: string | null
          cpu_cores?: number | null
          created_at?: string
          details?: Json | null
          device_type?: string | null
          id?: string
          ip_address?: string | null
          language?: string | null
          memory?: string | null
          network_type?: string | null
          os?: string | null
          platform?: string | null
          screen_resolution?: string | null
          timezone?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string | null
          password_hash: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name?: string | null
          password_hash?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          password_hash?: string
          updated_at?: string
        }
        Relationships: []
      }
      apartment_units: {
        Row: {
          area: number
          cadastre_payment_40p: number
          created_at: string
          floor_number: number
          id: string
          initial_payment_30p: number
          monthly_payment_8mo_30p: number
          price_per_sqm: number
          room_count: number
          total_price: number
          updated_at: string
        }
        Insert: {
          area: number
          cadastre_payment_40p: number
          created_at?: string
          floor_number: number
          id?: string
          initial_payment_30p: number
          monthly_payment_8mo_30p: number
          price_per_sqm: number
          room_count: number
          total_price: number
          updated_at?: string
        }
        Update: {
          area?: number
          cadastre_payment_40p?: number
          created_at?: string
          floor_number?: number
          id?: string
          initial_payment_30p?: number
          monthly_payment_8mo_30p?: number
          price_per_sqm?: number
          room_count?: number
          total_price?: number
          updated_at?: string
        }
        Relationships: []
      }
      commercial_offers: {
        Row: {
          applicant_type: string
          attachments: string[] | null
          company_name: string | null
          created_at: string
          description: string
          email: string
          full_name: string
          id: string
          phone: string
          status: string
          updated_at: string
        }
        Insert: {
          applicant_type: string
          attachments?: string[] | null
          company_name?: string | null
          created_at?: string
          description: string
          email: string
          full_name: string
          id?: string
          phone: string
          status?: string
          updated_at?: string
        }
        Update: {
          applicant_type?: string
          attachments?: string[] | null
          company_name?: string | null
          created_at?: string
          description?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          is_read: boolean | null
          message: string
          name: string
          subject: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_read?: boolean | null
          message: string
          name: string
          subject: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_read?: boolean | null
          message?: string
          name?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      departments: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      floor_apartment_prices: {
        Row: {
          created_at: string
          floor_number: number
          id: string
          price_per_sqm: number
          room_count: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          floor_number: number
          id?: string
          price_per_sqm: number
          room_count: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          floor_number?: number
          id?: string
          price_per_sqm?: number
          room_count?: number
          updated_at?: string
        }
        Relationships: []
      }
      floor_prices: {
        Row: {
          apartment_type: string
          created_at: string
          id: string
          price_per_sqm: number
          updated_at: string
        }
        Insert: {
          apartment_type: string
          created_at?: string
          id?: string
          price_per_sqm: number
          updated_at?: string
        }
        Update: {
          apartment_type?: string
          created_at?: string
          id?: string
          price_per_sqm?: number
          updated_at?: string
        }
        Relationships: []
      }
      future_projects: {
        Row: {
          completion_date: string | null
          cover_image: string | null
          created_at: string
          description: string
          description_en: string | null
          description_ru: string | null
          description_uz: string | null
          featured: boolean | null
          features: Json | null
          gallery_images: string[] | null
          id: string
          location: string | null
          location_en: string | null
          location_ru: string | null
          location_uz: string | null
          slug: string
          status: string
          title: string
          title_en: string | null
          title_ru: string | null
          title_uz: string | null
          updated_at: string
        }
        Insert: {
          completion_date?: string | null
          cover_image?: string | null
          created_at?: string
          description: string
          description_en?: string | null
          description_ru?: string | null
          description_uz?: string | null
          featured?: boolean | null
          features?: Json | null
          gallery_images?: string[] | null
          id?: string
          location?: string | null
          location_en?: string | null
          location_ru?: string | null
          location_uz?: string | null
          slug: string
          status?: string
          title: string
          title_en?: string | null
          title_ru?: string | null
          title_uz?: string | null
          updated_at?: string
        }
        Update: {
          completion_date?: string | null
          cover_image?: string | null
          created_at?: string
          description?: string
          description_en?: string | null
          description_ru?: string | null
          description_uz?: string | null
          featured?: boolean | null
          features?: Json | null
          gallery_images?: string[] | null
          id?: string
          location?: string | null
          location_en?: string | null
          location_ru?: string | null
          location_uz?: string | null
          slug?: string
          status?: string
          title?: string
          title_en?: string | null
          title_ru?: string | null
          title_uz?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          created_at: string | null
          date: string | null
          email: string
          id: string
          message: string
          name: string
          read: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date?: string | null
          email: string
          id?: string
          message: string
          name: string
          read?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
          read?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      news: {
        Row: {
          additional_images: string[] | null
          content: string
          created_at: string
          featured: boolean | null
          id: string
          image_url: string | null
          published_at: string
          summary: string
          title: string
          updated_at: string
          youtube_video_url: string | null
        }
        Insert: {
          additional_images?: string[] | null
          content: string
          created_at?: string
          featured?: boolean | null
          id?: string
          image_url?: string | null
          published_at?: string
          summary: string
          title: string
          updated_at?: string
          youtube_video_url?: string | null
        }
        Update: {
          additional_images?: string[] | null
          content?: string
          created_at?: string
          featured?: boolean | null
          id?: string
          image_url?: string | null
          published_at?: string
          summary?: string
          title?: string
          updated_at?: string
          youtube_video_url?: string | null
        }
        Relationships: []
      }
      partners: {
        Row: {
          created_at: string
          id: string
          logo_url: string | null
          name: string
          updated_at: string
          website_url: string
        }
        Insert: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name: string
          updated_at?: string
          website_url: string
        }
        Update: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
          updated_at?: string
          website_url?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          description: string
          id: string
          image_url: string | null
          location: string
          status: string
          title: string
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          image_url?: string | null
          location: string
          status: string
          title: string
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          location?: string
          status?: string
          title?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      staff_members: {
        Row: {
          bio: string | null
          created_at: string
          department_id: string | null
          email: string | null
          id: string
          image_url: string | null
          name: string
          phone: string | null
          position: string
          updated_at: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          department_id?: string | null
          email?: string | null
          id?: string
          image_url?: string | null
          name: string
          phone?: string | null
          position: string
          updated_at?: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          department_id?: string | null
          email?: string | null
          id?: string
          image_url?: string | null
          name?: string
          phone?: string | null
          position?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_members_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      tender_applications: {
        Row: {
          attachments: string[] | null
          company_name: string
          contact_name: string
          created_at: string
          email: string
          id: string
          message: string | null
          phone: string
          status: string
          tender_id: string | null
          updated_at: string
        }
        Insert: {
          attachments?: string[] | null
          company_name: string
          contact_name: string
          created_at?: string
          email: string
          id?: string
          message?: string | null
          phone: string
          status?: string
          tender_id?: string | null
          updated_at?: string
        }
        Update: {
          attachments?: string[] | null
          company_name?: string
          contact_name?: string
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          phone?: string
          status?: string
          tender_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tender_applications_tender_id_fkey"
            columns: ["tender_id"]
            isOneToOne: false
            referencedRelation: "tenders"
            referencedColumns: ["id"]
          },
        ]
      }
      tenders: {
        Row: {
          category: string | null
          created_at: string
          deadline: string | null
          description: string
          documents: string[] | null
          id: string
          requirements: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          deadline?: string | null
          description: string
          documents?: string[] | null
          id?: string
          requirements?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          deadline?: string | null
          description?: string
          documents?: string[] | null
          id?: string
          requirements?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      vacancies: {
        Row: {
          benefits: string | null
          created_at: string
          description: string
          employment_type: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          location: string | null
          remote_status: string | null
          requirements: string | null
          salary_range: string | null
          title: string
          updated_at: string
        }
        Insert: {
          benefits?: string | null
          created_at?: string
          description: string
          employment_type?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          location?: string | null
          remote_status?: string | null
          requirements?: string | null
          salary_range?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          benefits?: string | null
          created_at?: string
          description?: string
          employment_type?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          location?: string | null
          remote_status?: string | null
          requirements?: string | null
          salary_range?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      vacancy_applications: {
        Row: {
          attachments: string[] | null
          cover_letter: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string
          status: string
          updated_at: string
          vacancy_id: string | null
        }
        Insert: {
          attachments?: string[] | null
          cover_letter?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          phone: string
          status?: string
          updated_at?: string
          vacancy_id?: string | null
        }
        Update: {
          attachments?: string[] | null
          cover_letter?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string
          status?: string
          updated_at?: string
          vacancy_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vacancy_applications_vacancy_id_fkey"
            columns: ["vacancy_id"]
            isOneToOne: false
            referencedRelation: "vacancies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      verify_admin_credentials: {
        Args: { p_email: string; p_password: string }
        Returns: {
          id: string
          email: string
          name: string
        }[]
      }
    }
    Enums: {
      user_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["admin", "user"],
    },
  },
} as const
