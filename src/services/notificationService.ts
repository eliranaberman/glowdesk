
import { supabase } from '@/lib/supabase';

export type NotificationType = 'confirmation' | 'reminder_24h' | 'reminder_3h' | 'cancellation';

export interface NotificationResult {
  success: boolean;
  method?: 'whatsapp' | 'sms' | null;
  whatsappStatus: 'sent' | 'failed' | 'disabled';
  smsStatus: 'sent' | 'failed' | 'not_attempted';
}

export interface NotificationPreference {
  id: string;
  user_id: string;
  whatsapp_enabled: boolean;
  sms_fallback_enabled: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Send a notification for an appointment
 * @param appointmentId The ID of the appointment
 * @param notificationType The type of notification to send
 * @param customMessage Optional custom message to send
 * @param adminNotification Whether this is a notification for the admin
 * @returns Notification result
 */
export async function sendAppointmentNotification(
  appointmentId: string,
  notificationType: NotificationType,
  customMessage?: string,
  adminNotification = false
): Promise<NotificationResult> {
  try {
    const { data, error } = await supabase.functions.invoke('whatsapp-notification', {
      body: {
        appointmentId,
        notificationType,
        customMessage,
        adminNotification
      }
    });

    if (error) {
      console.error('Error sending notification:', error);
      throw new Error(`Failed to send ${notificationType} notification: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error in sendAppointmentNotification:', error);
    throw error;
  }
}

/**
 * Send a direct message to a phone number
 * @param phoneNumber The phone number to send the message to
 * @param message The message content
 * @returns Notification result
 */
export async function sendDirectMessage(
  phoneNumber: string,
  message: string
): Promise<NotificationResult> {
  try {
    const { data, error } = await supabase.functions.invoke('whatsapp-notification', {
      body: {
        phoneNumber,
        customMessage: message,
        notificationType: 'custom'
      }
    });

    if (error) {
      console.error('Error sending direct message:', error);
      throw new Error(`Failed to send message: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error in sendDirectMessage:', error);
    throw error;
  }
}

/**
 * Get notification preferences for the current user
 * @returns Notification preference settings
 */
export async function getUserNotificationPreferences(): Promise<NotificationPreference> {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', user.user.id)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching notification preferences:', error);
      throw error;
    }
    
    // Return default preferences if none exist
    if (!data) {
      return {
        id: '',
        user_id: user.user.id,
        whatsapp_enabled: true,
        sms_fallback_enabled: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
    
    return data;
  } catch (error) {
    console.error('Error in getUserNotificationPreferences:', error);
    throw error;
  }
}

/**
 * Update notification preferences for the current user
 * @param preferences The preference settings to update
 * @returns The updated notification preferences
 */
export async function upsertNotificationPreferences(
  preferences: Partial<Pick<NotificationPreference, 'whatsapp_enabled' | 'sms_fallback_enabled'>>
): Promise<NotificationPreference> {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }
    
    // Check if preferences exist for this user
    const { data: existingData } = await supabase
      .from('notification_preferences')
      .select('id')
      .eq('user_id', user.user.id)
      .maybeSingle();
    
    let result;
    
    if (existingData) {
      // Update existing preferences
      const { data, error } = await supabase
        .from('notification_preferences')
        .update({
          ...preferences,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingData.id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating notification preferences:', error);
        throw error;
      }
      
      result = data;
    } else {
      // Insert new preferences
      const { data, error } = await supabase
        .from('notification_preferences')
        .insert({
          user_id: user.user.id,
          ...preferences,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error inserting notification preferences:', error);
        throw error;
      }
      
      result = data;
    }
    
    return result;
  } catch (error) {
    console.error('Error in upsertNotificationPreferences:', error);
    throw error;
  }
}

/**
 * Process appointment reminders
 * This function manually triggers the appointment-reminders edge function
 * @returns Success status
 */
export async function processAppointmentReminders(): Promise<boolean> {
  try {
    const { data, error } = await supabase.functions.invoke('appointment-reminders', {
      body: {}
    });

    if (error) {
      console.error('Error processing appointment reminders:', error);
      throw new Error(`Failed to process reminders: ${error.message}`);
    }

    return data.success;
  } catch (error) {
    console.error('Error in processAppointmentReminders:', error);
    throw error;
  }
}

/**
 * Cancel an appointment using a cancellation token
 * @param token The cancellation token
 * @param reason Optional reason for cancellation
 * @returns Cancellation result
 */
export async function cancelAppointment(token: string, reason?: string): Promise<any> {
  try {
    const { data, error } = await supabase.functions.invoke('appointment-cancellation', {
      body: {
        token,
        reason
      }
    });

    if (error) {
      console.error('Error cancelling appointment:', error);
      throw new Error(`Failed to cancel appointment: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error in cancelAppointment:', error);
    throw error;
  }
}

/**
 * Generate a cancellation link for an appointment
 * @param appointmentId The appointment ID
 * @returns The cancellation link URL
 */
export async function generateCancellationLink(appointmentId: string): Promise<string> {
  try {
    // First create a cancellation token
    const { data, error } = await supabase
      .from('cancellation_tokens')
      .insert({
        appointment_id: appointmentId,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
      })
      .select('token')
      .single();
      
    if (error) {
      console.error('Error generating cancellation token:', error);
      throw new Error('Failed to generate cancellation link');
    }
    
    // Construct the cancellation URL
    const baseUrl = window.location.origin;
    return `${baseUrl}/cancel-appointment/${data.token}`;
  } catch (error) {
    console.error('Error in generateCancellationLink:', error);
    throw error;
  }
}
