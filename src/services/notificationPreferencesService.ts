
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

// Get user notification preferences
export const getNotificationPreferences = async (): Promise<NotificationPreferences | null> => {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) {
    return null;
  }
  
  const { data, error } = await supabase
    .from('notification_preferences')
    .select('*')
    .eq('user_id', user.user.id)
    .maybeSingle();
  
  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching notification preferences:', error);
    throw new Error(error.message);
  }
  
  return data || null;
};

// Create or update notification preferences
export const upsertNotificationPreferences = async (preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences> => {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) {
    throw new Error('User not authenticated');
  }
  
  const { data: existing } = await supabase
    .from('notification_preferences')
    .select('id')
    .eq('user_id', user.user.id)
    .maybeSingle();
  
  let result;
  if (existing) {
    const { data, error } = await supabase
      .from('notification_preferences')
      .update({
        ...preferences,
        updated_at: new Date().toISOString()
      })
      .eq('id', existing.id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating notification preferences:', error);
      throw new Error(error.message);
    }
    
    result = data;
  } else {
    const { data, error } = await supabase
      .from('notification_preferences')
      .insert({
        user_id: user.user.id,
        ...preferences
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating notification preferences:', error);
      throw new Error(error.message);
    }
    
    result = data;
  }
  
  return result;
};

// Log notification
export const logNotification = async (log: Omit<NotificationLog, 'id' | 'user_id' | 'created_at'>): Promise<NotificationLog> => {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) {
    throw new Error('User not authenticated');
  }
  
  const { data, error } = await supabase
    .from('notification_logs')
    .insert({
      user_id: user.user.id,
      ...log
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error logging notification:', error);
    throw new Error(error.message);
  }
  
  return data;
};

// Get notification logs
export const getNotificationLogs = async (type?: string): Promise<NotificationLog[]> => {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) {
    return [];
  }
  
  let query = supabase
    .from('notification_logs')
    .select('*')
    .eq('user_id', user.user.id)
    .order('created_at', { ascending: false });
  
  if (type) {
    query = query.eq('notification_type', type);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching notification logs:', error);
    throw new Error(error.message);
  }
  
  return data || [];
};
