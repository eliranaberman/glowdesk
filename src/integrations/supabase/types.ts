export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          attendance_confirmed_at: string | null
          attendance_confirmed_by: string | null
          attendance_status: string | null
          calendar_sync_status: string | null
          cancel_reason: string | null
          cancelled_at: string | null
          confirmation_response: string | null
          confirmation_status: string | null
          confirmed_at: string | null
          created_at: string | null
          customer_id: string
          date: string
          employee_id: string | null
          end_time: string
          external_calendar_id: string | null
          id: string
          last_sync_at: string | null
          late_cancellation: boolean | null
          notes: string | null
          notification_sent_at: string | null
          payment_required: boolean | null
          reminder_24h_sent: boolean | null
          reminder_3h_sent: boolean | null
          reminder_sent_at: string | null
          service_type: string
          sms_notification_sent: boolean | null
          start_time: string
          status: string
          user_id: string | null
          whatsapp_notification_sent: boolean | null
        }
        Insert: {
          attendance_confirmed_at?: string | null
          attendance_confirmed_by?: string | null
          attendance_status?: string | null
          calendar_sync_status?: string | null
          cancel_reason?: string | null
          cancelled_at?: string | null
          confirmation_response?: string | null
          confirmation_status?: string | null
          confirmed_at?: string | null
          created_at?: string | null
          customer_id: string
          date: string
          employee_id?: string | null
          end_time: string
          external_calendar_id?: string | null
          id?: string
          last_sync_at?: string | null
          late_cancellation?: boolean | null
          notes?: string | null
          notification_sent_at?: string | null
          payment_required?: boolean | null
          reminder_24h_sent?: boolean | null
          reminder_3h_sent?: boolean | null
          reminder_sent_at?: string | null
          service_type: string
          sms_notification_sent?: boolean | null
          start_time: string
          status?: string
          user_id?: string | null
          whatsapp_notification_sent?: boolean | null
        }
        Update: {
          attendance_confirmed_at?: string | null
          attendance_confirmed_by?: string | null
          attendance_status?: string | null
          calendar_sync_status?: string | null
          cancel_reason?: string | null
          cancelled_at?: string | null
          confirmation_response?: string | null
          confirmation_status?: string | null
          confirmed_at?: string | null
          created_at?: string | null
          customer_id?: string
          date?: string
          employee_id?: string | null
          end_time?: string
          external_calendar_id?: string | null
          id?: string
          last_sync_at?: string | null
          late_cancellation?: boolean | null
          notes?: string | null
          notification_sent_at?: string | null
          payment_required?: boolean | null
          reminder_24h_sent?: boolean | null
          reminder_3h_sent?: boolean | null
          reminder_sent_at?: string | null
          service_type?: string
          sms_notification_sent?: boolean | null
          start_time?: string
          status?: string
          user_id?: string | null
          whatsapp_notification_sent?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      business_profiles: {
        Row: {
          business_address: string | null
          business_hours: Json | null
          business_name: string
          business_phone: string | null
          created_at: string | null
          id: string
          setup_completed: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          business_address?: string | null
          business_hours?: Json | null
          business_name: string
          business_phone?: string | null
          created_at?: string | null
          id?: string
          setup_completed?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          business_address?: string | null
          business_hours?: Json | null
          business_name?: string
          business_phone?: string | null
          created_at?: string | null
          id?: string
          setup_completed?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
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
      cancellation_tokens: {
        Row: {
          appointment_id: string
          created_at: string | null
          expires_at: string
          id: string
          token: string
          used: boolean | null
        }
        Insert: {
          appointment_id: string
          created_at?: string | null
          expires_at: string
          id?: string
          token: string
          used?: boolean | null
        }
        Update: {
          appointment_id?: string
          created_at?: string | null
          expires_at?: string
          id?: string
          token?: string
          used?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "cancellation_tokens_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      client_activity: {
        Row: {
          activity_type: string | null
          client_id: string | null
          created_at: string | null
          created_by: string | null
          date: string | null
          description: string | null
          id: string
          notes: string | null
          type: string | null
        }
        Insert: {
          activity_type?: string | null
          client_id?: string | null
          created_at?: string | null
          created_by?: string | null
          date?: string | null
          description?: string | null
          id?: string
          notes?: string | null
          type?: string | null
        }
        Update: {
          activity_type?: string | null
          client_id?: string | null
          created_at?: string | null
          created_by?: string | null
          date?: string | null
          description?: string | null
          id?: string
          notes?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_activity_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_activity_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
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
          preferred_treatment: string | null
          registration_date: string | null
          status: string | null
          tags: string | null
          updated_at: string | null
          user_id: string | null
          visit_count: number | null
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
          preferred_treatment?: string | null
          registration_date?: string | null
          status?: string | null
          tags?: string | null
          updated_at?: string | null
          user_id?: string | null
          visit_count?: number | null
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
          preferred_treatment?: string | null
          registration_date?: string | null
          status?: string | null
          tags?: string | null
          updated_at?: string | null
          user_id?: string | null
          visit_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_assigned_rep_fkey"
            columns: ["assigned_rep"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
      message_templates: {
        Row: {
          content: string
          created_at: string
          id: string
          is_default: boolean | null
          template_name: string
          template_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_default?: boolean | null
          template_name: string
          template_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_default?: boolean | null
          template_name?: string
          template_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notification_logs: {
        Row: {
          appointment_id: string | null
          channel: string
          created_at: string
          delivered_at: string | null
          error_message: string | null
          external_message_id: string | null
          id: string
          message_content: string
          notification_type: string
          phone_number: string | null
          read_at: string | null
          sent_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          appointment_id?: string | null
          channel: string
          created_at?: string
          delivered_at?: string | null
          error_message?: string | null
          external_message_id?: string | null
          id?: string
          message_content: string
          notification_type: string
          phone_number?: string | null
          read_at?: string | null
          sent_at?: string | null
          status?: string
          user_id: string
        }
        Update: {
          appointment_id?: string | null
          channel?: string
          created_at?: string
          delivered_at?: string | null
          error_message?: string | null
          external_message_id?: string | null
          id?: string
          message_content?: string
          notification_type?: string
          phone_number?: string | null
          read_at?: string | null
          sent_at?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_logs_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
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
      social_media_messages: {
        Row: {
          account_id: string
          created_at: string
          external_message_id: string
          id: string
          is_read: boolean | null
          message_text: string | null
          message_type: string | null
          platform: string
          received_at: string
          replied_at: string | null
          reply_text: string | null
          sender_id: string
          sender_name: string
          thread_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          account_id: string
          created_at?: string
          external_message_id: string
          id?: string
          is_read?: boolean | null
          message_text?: string | null
          message_type?: string | null
          platform: string
          received_at: string
          replied_at?: string | null
          reply_text?: string | null
          sender_id: string
          sender_name: string
          thread_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          account_id?: string
          created_at?: string
          external_message_id?: string
          id?: string
          is_read?: boolean | null
          message_text?: string | null
          message_type?: string | null
          platform?: string
          received_at?: string
          replied_at?: string | null
          reply_text?: string | null
          sender_id?: string
          sender_name?: string
          thread_id?: string | null
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
      social_media_webhooks: {
        Row: {
          account_id: string
          created_at: string
          id: string
          is_active: boolean | null
          platform: string
          subscription_fields: string[] | null
          updated_at: string
          user_id: string
          webhook_id: string | null
          webhook_url: string | null
        }
        Insert: {
          account_id: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          platform: string
          subscription_fields?: string[] | null
          updated_at?: string
          user_id: string
          webhook_id?: string | null
          webhook_url?: string | null
        }
        Update: {
          account_id?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          platform?: string
          subscription_fields?: string[] | null
          updated_at?: string
          user_id?: string
          webhook_id?: string | null
          webhook_url?: string | null
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
          user_id: string | null
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
          user_id?: string | null
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
          user_id?: string | null
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
      user_whatsapp_settings: {
        Row: {
          auto_reminders_enabled: boolean | null
          business_address: string | null
          business_name: string
          business_whatsapp_number: string
          confirmation_required: boolean | null
          created_at: string
          id: string
          preferred_send_time: string | null
          reminder_hours_before: number | null
          timezone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_reminders_enabled?: boolean | null
          business_address?: string | null
          business_name: string
          business_whatsapp_number: string
          confirmation_required?: boolean | null
          created_at?: string
          id?: string
          preferred_send_time?: string | null
          reminder_hours_before?: number | null
          timezone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_reminders_enabled?: boolean | null
          business_address?: string | null
          business_name?: string
          business_whatsapp_number?: string
          confirmation_required?: boolean | null
          created_at?: string
          id?: string
          preferred_send_time?: string | null
          reminder_hours_before?: number | null
          timezone?: string | null
          updated_at?: string
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
      is_admin_user: {
        Args: { user_id: string }
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
