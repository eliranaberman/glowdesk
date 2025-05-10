
import { supabase } from '@/lib/supabase';

export interface CalendarConnection {
  id: string;
  user_id: string;
  calendar_type: 'google' | 'apple' | 'outlook';
  calendar_id: string | null;
  calendar_email: string;
  access_token: string | null;
  refresh_token: string | null;
  token_expiry: string | null;
  connected_at: string;
  last_sync_at: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Get calendar connections for the current user
export const getUserCalendarConnections = async (): Promise<CalendarConnection[]> => {
  const { data, error } = await supabase
    .from('calendar_connections')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching calendar connections:', error);
    throw new Error(error.message);
  }
  
  return data || [];
};

// Create a new calendar connection
export const createCalendarConnection = async (connection: Omit<CalendarConnection, 'id' | 'created_at' | 'updated_at' | 'connected_at'>): Promise<CalendarConnection> => {
  const { data, error } = await supabase
    .from('calendar_connections')
    .insert(connection)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating calendar connection:', error);
    throw new Error(error.message);
  }
  
  return data;
};

// Update an existing calendar connection
export const updateCalendarConnection = async (id: string, updates: Partial<CalendarConnection>): Promise<CalendarConnection> => {
  const { data, error } = await supabase
    .from('calendar_connections')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating calendar connection:', error);
    throw new Error(error.message);
  }
  
  return data;
};

// Delete a calendar connection
export const deleteCalendarConnection = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('calendar_connections')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting calendar connection:', error);
    throw new Error(error.message);
  }
};

// Generate an ICS file content for an appointment
export const generateIcsFileContent = (appointment: any): string => {
  const startDate = new Date(`${appointment.date}T${appointment.start_time}`);
  const endDate = new Date(`${appointment.date}T${appointment.end_time}`);
  
  const formatDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };
  
  // Basic ICS format
  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Chen Mizrahi Salon//Booking System//EN
CALSCALE:GREGORIAN
BEGIN:VEVENT
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:${appointment.service_type}
DESCRIPTION:Appointment with ${appointment.customer?.full_name || 'Customer'}
STATUS:CONFIRMED
TRANSP:OPAQUE
END:VEVENT
END:VCALENDAR`;
};

// Sync appointment with external calendar
export const syncAppointmentWithCalendar = async (appointmentId: string, calendarConnectionId: string): Promise<void> => {
  try {
    // Call the calendar-sync edge function
    const { data, error } = await supabase.functions.invoke('calendar-sync', {
      body: {
        action: 'sync',
        appointmentId,
        calendarConnectionId
      }
    });
    
    if (error) {
      console.error('Calendar sync error:', error);
      throw new Error(error.message);
    }
    
    console.log('Calendar sync successful:', data);
  } catch (error) {
    console.error('Error syncing with calendar:', error);
    throw error;
  }
};

// Download ICS file for an appointment
export const downloadIcsFile = (appointment: any): void => {
  const icsContent = generateIcsFileContent(appointment);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `appointment-${appointment.id}.ics`);
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Connect to Google Calendar
export const connectToGoogle = async (): Promise<void> => {
  try {
    // In a real implementation, this would redirect to Google OAuth
    // For now, we'll mock a successful connection
    const mockConnection = {
      user_id: 'current-user-id',
      calendar_type: 'google' as const,
      calendar_email: 'user@example.com',
      calendar_id: 'primary',
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token',
      token_expiry: new Date(Date.now() + 3600 * 1000).toISOString()
    };
    
    await createCalendarConnection(mockConnection);
    console.log('Successfully connected to Google Calendar');
  } catch (error) {
    console.error('Error connecting to Google Calendar:', error);
    throw new Error('Failed to connect to Google Calendar');
  }
};

// Disconnect calendar
export const disconnectCalendar = async (connectionId: string): Promise<void> => {
  try {
    await deleteCalendarConnection(connectionId);
    console.log('Successfully disconnected calendar');
  } catch (error) {
    console.error('Error disconnecting calendar:', error);
    throw new Error('Failed to disconnect calendar');
  }
};
