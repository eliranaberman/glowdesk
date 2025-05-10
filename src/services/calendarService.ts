

// Mock calendar service

export interface CalendarConnection {
  id: string;
  user_id: string;
  calendar_type: 'google' | 'apple' | 'outlook';
  calendar_email: string;
  calendar_id: string | null;
  access_token: string | null;
  refresh_token: string | null;
  is_active: boolean;
  connected_at: string;
  last_sync_at: string | null;
}

// Mock data
let mockCalendarConnections: CalendarConnection[] = [
  {
    id: 'conn1',
    user_id: 'user1',
    calendar_type: 'google',
    calendar_email: 'test@example.com',
    calendar_id: 'primary',
    access_token: 'mock_token',
    refresh_token: 'mock_refresh_token',
    is_active: true,
    connected_at: new Date().toISOString(),
    last_sync_at: new Date().toISOString()
  }
];

/**
 * Connect to Google Calendar
 */
export const connectToGoogle = async (): Promise<{ id: string }> => {
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
  
  const newConnection: CalendarConnection = {
    id: `conn${Date.now()}`,
    user_id: 'current_user',
    calendar_type: 'google',
    calendar_email: 'user@example.com',
    calendar_id: 'primary',
    access_token: 'new_mock_token',
    refresh_token: 'new_mock_refresh_token',
    is_active: true,
    connected_at: new Date().toISOString(),
    last_sync_at: null
  };
  
  mockCalendarConnections.push(newConnection);
  
  return { id: newConnection.id };
};

/**
 * Get user calendar connections
 */
export const getUserCalendarConnections = async (): Promise<CalendarConnection[]> => {
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
  return [...mockCalendarConnections];
};

/**
 * Disconnect calendar
 */
export const disconnectCalendar = async (connectionId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
  
  mockCalendarConnections = mockCalendarConnections.filter(conn => conn.id !== connectionId);
};
