
// Mock calendar service

// Mock data
let mockCalendarConnections = [
  {
    id: 'conn1',
    user_id: 'user1',
    calendar_type: 'google',
    calendar_email: 'user@gmail.com',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Get calendar connections for the current user
export const getUserCalendarConnections = async () => {
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
  return [...mockCalendarConnections];
};

// Connect to Google Calendar
export const connectToGoogle = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
  
  // In a real app, this would redirect to Google OAuth
  // For the mock, we'll just add a new connection
  const newConnection = {
    id: 'conn' + Date.now(),
    user_id: 'user1',
    calendar_type: 'google',
    calendar_email: 'user@gmail.com',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  mockCalendarConnections.push(newConnection);
  
  return newConnection;
};

// Disconnect a calendar
export const disconnectCalendar = async (connectionId: string) => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
  
  // Remove the connection
  mockCalendarConnections = mockCalendarConnections.filter(conn => conn.id !== connectionId);
  
  return { success: true };
};
