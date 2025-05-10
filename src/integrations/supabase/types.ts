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
      calendar_connections: {
        Row: {
          access_token: string | null
          calendar_email: string
          calendar_id: string | null
          calendar_type: string
          connected_at: string
          created_at: string
          id: string
          is_active: boolean
          last_sync_at: string | null
          refresh_token: string | null
          token_expiry: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token?: string | null
          calendar_email: string
          calendar_id?: string | null
          calendar_type: string
          connected_at?: string
          created_at?: string
          id?: string
          is_active?: boolean
          last_sync_at?: string | null
          refresh_token?: string | null
          token_expiry?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string | null
          calendar_email?: string
          calendar_id?: string | null
          calendar_type?: string
          connected_at?: string
          created_at?: string
          id?: string
          is_active?: boolean
          last_sync_at?: string | null
          refresh_token?: string | null
          token_expiry?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      client_activity: {
        Row: {
          activity_type: string | null
          client_id: string | null
          created_at: string | null
          created_by: string | null
          id: string
          notes: string | null
        }
        Insert: {
          activity_type?: string | null
          client_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          notes?: string | null
        }
        Update: {
          activity_type?: string | null
          client_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_activity_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_services: {
        Row: {
          client_id: string
          created_at: string
          created_by: string | null
          description: string
          id: string
          price: number
          service_date: string
        }
        Insert: {
          client_id: string
          created_at?: string
          created_by?: string | null
          description: string
          id?: string
          price: number
          service_date?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          created_by?: string | null
          description?: string
          id?: string
          price?: number
          service_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_services_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          assigned_rep: string | null
          birthday: string | null
          created_at: string | null
          email: string | null
          full_name: string
          gender: string | null
          id: string
          notes: string | null
          phone: string | null
          phone_number: string | null
          registration_date: string | null
          status: string | null
          tags: string | null
        }
        Insert: {
          assigned_rep?: string | null
          birthday?: string | null
          created_at?: string | null
          email?: string | null
          full_name: string
          gender?: string | null
          id?: string
          notes?: string | null
          phone?: string | null
          phone_number?: string | null
          registration_date?: string | null
          status?: string | null
          tags?: string | null
        }
        Update: {
          assigned_rep?: string | null
          birthday?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string
          gender?: string | null
          id?: string
          notes?: string | null
          phone?: string | null
          phone_number?: string | null
          registration_date?: string | null
          status?: string | null
          tags?: string | null
        }
        Relationships: []
      }
      coupon_assignments: {
        Row: {
          assigned_at: string | null
          client_id: string | null
          coupon_id: string | null
          id: string
          redeemed: boolean | null
        }
        Insert: {
          assigned_at?: string | null
          client_id?: string | null
          coupon_id?: string | null
          id?: string
          redeemed?: boolean | null
        }
        Update: {
          assigned_at?: string | null
          client_id?: string | null
          coupon_id?: string | null
          id?: string
          redeemed?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "coupon_assignments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupon_assignments_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          code: string
          created_at: string | null
          created_by: string | null
          description: string | null
          discount_percentage: number | null
          id: string
          title: string
          valid_until: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          discount_percentage?: number | null
          id?: string
          title: string
          valid_until?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          discount_percentage?: number | null
          id?: string
          title?: string
          valid_until?: string | null
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          category: string
          created_at: string | null
          created_by: string | null
          date: string
          description: string | null
          has_invoice: boolean | null
          id: string
          invoice_file_path: string | null
          payment_method: string | null
          vendor: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string | null
          created_by?: string | null
          date?: string
          description?: string | null
          has_invoice?: boolean | null
          id?: string
          invoice_file_path?: string | null
          payment_method?: string | null
          vendor: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string | null
          created_by?: string | null
          date?: string
          description?: string | null
          has_invoice?: boolean | null
          id?: string
          invoice_file_path?: string | null
          payment_method?: string | null
          vendor?: string
        }
        Relationships: []
      }
      inventory_items: {
        Row: {
          category: string
          cost: number
          created_at: string | null
          created_by: string | null
          entry_date: string
          expiry_date: string | null
          id: string
          name: string
          quantity: number
          status: string
          updated_at: string | null
        }
        Insert: {
          category: string
          cost: number
          created_at?: string | null
          created_by?: string | null
          entry_date?: string
          expiry_date?: string | null
          id?: string
          name: string
          quantity?: number
          status?: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          cost?: number
          created_at?: string | null
          created_by?: string | null
          entry_date?: string
          expiry_date?: string | null
          id?: string
          name?: string
          quantity?: number
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      marketing_campaigns: {
        Row: {
          created_by: string | null
          id: string
          name: string
          scheduled_at: string | null
          status: string | null
          template_id: string | null
        }
        Insert: {
          created_by?: string | null
          id?: string
          name: string
          scheduled_at?: string | null
          status?: string | null
          template_id?: string | null
        }
        Update: {
          created_by?: string | null
          id?: string
          name?: string
          scheduled_at?: string | null
          status?: string | null
          template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "marketing_campaigns_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "marketing_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      marketing_messages: {
        Row: {
          campaign_id: string | null
          client_id: string | null
          id: string
          sent_at: string | null
          status: string | null
        }
        Insert: {
          campaign_id?: string | null
          client_id?: string | null
          id?: string
          sent_at?: string | null
          status?: string | null
        }
        Update: {
          campaign_id?: string | null
          client_id?: string | null
          id?: string
          sent_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "marketing_messages_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "marketing_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketing_messages_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      marketing_templates: {
        Row: {
          content: string
          created_at: string | null
          created_by: string | null
          id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          created_at: string
          id: string
          sms_fallback_enabled: boolean
          updated_at: string
          user_id: string
          whatsapp_enabled: boolean
        }
        Insert: {
          created_at?: string
          id?: string
          sms_fallback_enabled?: boolean
          updated_at?: string
          user_id: string
          whatsapp_enabled?: boolean
        }
        Update: {
          created_at?: string
          id?: string
          sms_fallback_enabled?: boolean
          updated_at?: string
          user_id?: string
          whatsapp_enabled?: boolean
        }
        Relationships: []
      }
      portfolio_items: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          image_url: string
          title: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          image_url: string
          title: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          image_url?: string
          title?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          created_at: string
          data: Json
          description: string | null
          format: string
          generated_at: string
          id: string
          time_frame: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data: Json
          description?: string | null
          format: string
          generated_at?: string
          id?: string
          time_frame: string
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json
          description?: string | null
          format?: string
          generated_at?: string
          id?: string
          time_frame?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      revenues: {
        Row: {
          amount: number
          created_at: string | null
          created_by: string | null
          customer_id: string | null
          date: string
          description: string | null
          id: string
          payment_method: string | null
          service_id: string | null
          source: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          created_by?: string | null
          customer_id?: string | null
          date?: string
          description?: string | null
          id?: string
          payment_method?: string | null
          service_id?: string | null
          source: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          created_by?: string | null
          customer_id?: string | null
          date?: string
          description?: string | null
          id?: string
          payment_method?: string | null
          service_id?: string | null
          source?: string
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          created_at: string | null
          id: string
          permission: string
          resource: string
          role: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          permission: string
          resource: string
          role: string
        }
        Update: {
          created_at?: string | null
          id?: string
          permission?: string
          resource?: string
          role?: string
        }
        Relationships: []
      }
      social_media_accounts: {
        Row: {
          access_token: string
          account_id: string
          account_name: string
          created_at: string
          id: string
          platform: string
          token_expires_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token: string
          account_id: string
          account_name: string
          created_at?: string
          id?: string
          platform: string
          token_expires_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string
          account_id?: string
          account_name?: string
          created_at?: string
          id?: string
          platform?: string
          token_expires_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      social_media_posts: {
        Row: {
          account_id: string
          caption: string | null
          created_at: string
          external_post_id: string | null
          id: string
          image_url: string | null
          platform: string
          published_at: string | null
          scheduled_for: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          account_id: string
          caption?: string | null
          created_at?: string
          external_post_id?: string | null
          id?: string
          image_url?: string | null
          platform: string
          published_at?: string | null
          scheduled_for?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          account_id?: string
          caption?: string | null
          created_at?: string
          external_post_id?: string | null
          id?: string
          image_url?: string | null
          platform?: string
          published_at?: string | null
          scheduled_for?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assigned_user_id: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          priority: string
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_user_id?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_user_id?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_user_id_fkey"
            columns: ["assigned_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_mfa_settings: {
        Row: {
          created_at: string | null
          mfa_enabled: boolean | null
          mfa_method: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          mfa_enabled?: boolean | null
          mfa_method?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          mfa_enabled?: boolean | null
          mfa_method?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_permission: {
        Args: { user_id: string; resource: string; required_permission: string }
        Returns: boolean
      }
      has_role: {
        Args: { user_id: string; required_role: string }
        Returns: boolean
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
    Enums: {},
  },
} as const
