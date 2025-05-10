
import { supabase } from '@/lib/supabase';

export type NotificationType = 'confirmation' | 'reminder_24h' | 'reminder_3h' | 'cancellation';

export interface NotificationResult {
  success: boolean;
  method?: 'whatsapp' | 'sms' | null;
  whatsappStatus: 'sent' | 'failed' | 'disabled';
  smsStatus: 'sent' | 'failed' | 'not_attempted';
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
