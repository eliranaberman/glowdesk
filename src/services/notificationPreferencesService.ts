
import { supabase } from '@/integrations/supabase/client';

export interface NotificationPreferences {
  id: string;
  user_id: string;
  whatsapp_enabled: boolean;
  sms_enabled: boolean;
  email_enabled: boolean;
  appointment_reminders_enabled: boolean;
  daily_summary_enabled: boolean;
  expense_reminder_enabled: boolean;
  appointment_changes_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface NotificationLog {
  id: string;
  user_id: string;
  appointment_id?: string;
  notification_type: 'reminder' | 'daily_summary' | 'expense_reminder' | 'appointment_change';
  channel: 'whatsapp' | 'sms' | 'email' | 'dashboard';
  status: 'pending' | 'sent' | 'failed';
  message_content?: string;
  scheduled_for?: string;
  sent_at?: string;
  error_message?: string;
  created_at: string;
}

// Get user notification preferences - use existing table structure
export const getNotificationPreferences = async (): Promise<NotificationPreferences | null> => {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) {
    return null;
  }
  
  // Check if the notification_preferences table exists and get data
  const { data, error } = await supabase
    .from('notification_preferences')
    .select('*')
    .eq('user_id', user.user.id)
    .maybeSingle();
  
  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching notification preferences:', error);
    
    // Return default preferences if table doesn't exist yet
    return {
      id: '',
      user_id: user.user.id,
      whatsapp_enabled: true,
      sms_enabled: false,
      email_enabled: true,
      appointment_reminders_enabled: true,
      daily_summary_enabled: true,
      expense_reminder_enabled: true,
      appointment_changes_enabled: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }
  
  // If data exists, map it to our interface with fallback values
  if (data) {
    return {
      id: data.id,
      user_id: data.user_id,
      whatsapp_enabled: data.whatsapp_enabled ?? true,
      sms_enabled: data.sms_fallback_enabled ?? false, // Map sms_fallback_enabled to sms_enabled
      email_enabled: true, // Default value since field doesn't exist yet
      appointment_reminders_enabled: true, // Default value since field doesn't exist yet
      daily_summary_enabled: true, // Default value since field doesn't exist yet
      expense_reminder_enabled: true, // Default value since field doesn't exist yet
      appointment_changes_enabled: true, // Default value since field doesn't exist yet
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  }
  
  // If no data exists, return default preferences
  return {
    id: '',
    user_id: user.user.id,
    whatsapp_enabled: true,
    sms_enabled: false,
    email_enabled: true,
    appointment_reminders_enabled: true,
    daily_summary_enabled: true,
    expense_reminder_enabled: true,
    appointment_changes_enabled: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
};

// Create or update notification preferences
export const upsertNotificationPreferences = async (preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences | null> => {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) {
    throw new Error('User not authenticated');
  }
  
  try {
    const { data: existing } = await supabase
      .from('notification_preferences')
      .select('id')
      .eq('user_id', user.user.id)
      .maybeSingle();
    
    // Map our interface fields to the actual database fields
    const dbData = {
      whatsapp_enabled: preferences.whatsapp_enabled,
      sms_fallback_enabled: preferences.sms_enabled, // Map sms_enabled to sms_fallback_enabled
      updated_at: new Date().toISOString()
    };
    
    let result;
    if (existing) {
      const { data, error } = await supabase
        .from('notification_preferences')
        .update(dbData)
        .eq('id', existing.id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating notification preferences:', error);
        return null;
      }
      
      result = data;
    } else {
      const { data, error } = await supabase
        .from('notification_preferences')
        .insert({
          user_id: user.user.id,
          ...dbData
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating notification preferences:', error);
        return null;
      }
      
      result = data;
    }
    
    // Convert back to our interface format
    return {
      id: result.id,
      user_id: result.user_id,
      whatsapp_enabled: result.whatsapp_enabled,
      sms_enabled: result.sms_fallback_enabled,
      email_enabled: true,
      appointment_reminders_enabled: true,
      daily_summary_enabled: true,
      expense_reminder_enabled: true,
      appointment_changes_enabled: true,
      created_at: result.created_at,
      updated_at: result.updated_at
    };
  } catch (error) {
    console.error('Database error:', error);
    return null;
  }
};

// Mock function for notification logs until table is available
export const logNotification = async (log: Omit<NotificationLog, 'id' | 'user_id' | 'created_at'>): Promise<boolean> => {
  try {
    console.log('Notification logged:', log);
    return true;
  } catch (error) {
    console.error('Error logging notification:', error);
    return false;
  }
};

// Mock function for getting notification logs until table is available
export const getNotificationLogs = async (type?: string): Promise<NotificationLog[]> => {
  try {
    console.log('Getting notification logs for type:', type);
    return [];
  } catch (error) {
    console.error('Error fetching notification logs:', error);
    return [];
  }
};
