
import { supabase } from '@/lib/supabase';

export interface NotificationPreference {
  id: string;
  user_id: string;
  whatsapp_enabled: boolean;
  sms_fallback_enabled: boolean;
  created_at: string;
  updated_at: string;
}

// Get notification preferences for the current user
export const getUserNotificationPreferences = async (): Promise<NotificationPreference | null> => {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) {
    return null;
  }
  
  const { data, error } = await supabase
    .from('notification_preferences')
    .select('*')
    .eq('user_id', user.user.id)
    .maybeSingle();
  
  if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
    console.error('Error fetching notification preferences:', error);
    throw new Error(error.message);
  }
  
  return data || null;
};

// Create or update notification preferences
export const upsertNotificationPreferences = async (preferences: Partial<NotificationPreference>): Promise<NotificationPreference> => {
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
    // Update existing preferences
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
    // Create new preferences
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

// Send appointment notification via WhatsApp or SMS fallback
export const sendAppointmentNotification = async (appointmentId: string, notificationType: 'confirmation' | 'reminder' | 'cancellation'): Promise<void> => {
  try {
    const { data, error } = await supabase.functions.invoke('whatsapp-notification', {
      body: {
        appointmentId,
        notificationType
      }
    });
    
    if (error) {
      console.error('Notification error:', error);
      throw new Error(error.message);
    }
    
    console.log('Notification sent successfully:', data);
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};
