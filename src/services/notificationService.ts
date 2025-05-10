
// Mock notification service

export interface NotificationPreference {
  id?: string;
  user_id?: string;
  whatsapp_enabled: boolean;
  sms_fallback_enabled: boolean;
  email_enabled?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Mock data
let mockNotificationPreferences: NotificationPreference = {
  id: 'pref1',
  user_id: 'user1',
  whatsapp_enabled: true,
  sms_fallback_enabled: true,
  email_enabled: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

// Get notification preferences for the current user
export const getUserNotificationPreferences = async (): Promise<NotificationPreference> => {
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
  return { ...mockNotificationPreferences };
};

// Update notification preferences
export const upsertNotificationPreferences = async (
  preferences: Partial<NotificationPreference>
): Promise<NotificationPreference> => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
  
  mockNotificationPreferences = {
    ...mockNotificationPreferences,
    ...preferences,
    updated_at: new Date().toISOString()
  };
  
  return { ...mockNotificationPreferences };
};

// Send notification for an appointment
export const sendAppointmentNotification = async (
  appointmentId: string,
  type: 'confirmation' | 'reminder' | 'cancellation'
): Promise<{ success: boolean }> => {
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
  
  console.log(`Sending ${type} notification for appointment ${appointmentId}`);
  
  return { success: true };
};
