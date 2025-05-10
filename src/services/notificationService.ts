

// Mock notification service

export interface NotificationPreference {
  whatsapp_enabled: boolean;
  sms_fallback_enabled: boolean;
}

/**
 * Send a notification related to an appointment
 * @param appointmentId The ID of the appointment
 * @param type The type of notification to send
 * @returns Promise that resolves when notification is sent
 */
export const sendAppointmentNotification = async (
  appointmentId: string, 
  type: 'confirmation' | 'reminder' | 'cancellation'
): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
  
  // In a real app, this would send a notification through the appropriate channel
  console.log(`Sending ${type} notification for appointment ${appointmentId}`);
  
  return true;
};

/**
 * Set notification preferences for a user
 * @param userId User ID
 * @param preferences Preferences object
 */
export const setNotificationPreferences = async (
  userId: string,
  preferences: Partial<NotificationPreference>
): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
  
  // In a real app, this would update the user's notification preferences
  console.log(`Updated notification preferences for user ${userId}:`, preferences);
};

/**
 * Get notification preferences for a user
 * @param userId User ID
 */
export const getNotificationPreferences = async (
  userId: string
): Promise<NotificationPreference> => {
  await new Promise(resolve => setTimeout(resolve, 200)); // Simulate API delay
  
  // Default preferences
  return {
    whatsapp_enabled: true,
    sms_fallback_enabled: true
  };
};

/**
 * Get user notification preferences (alias for getNotificationPreferences)
 * @param userId User ID (optional)
 */
export const getUserNotificationPreferences = async (
  userId: string = 'current-user'
): Promise<NotificationPreference> => {
  return getNotificationPreferences(userId);
};

/**
 * Update or insert notification preferences
 * @param preferences Partial preferences to update
 * @param userId User ID (optional)
 */
export const upsertNotificationPreferences = async (
  preferences: Partial<NotificationPreference>,
  userId: string = 'current-user'
): Promise<void> => {
  return setNotificationPreferences(userId, preferences);
};
