
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

// Initiate Google Calendar OAuth flow
export const initiateGoogleCalendarAuth = async (email: string): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke('calendar-sync', {
      body: {
        action: 'auth',
        email: email
      }
    });
    
    if (error) {
      console.error('Google auth initiation error:', error);
      throw new Error(error.message);
    }
    
    if (!data.authUrl) {
      throw new Error('No auth URL received');
    }
    
    return data.authUrl;
  } catch (error) {
    console.error('Error initiating Google Calendar auth:', error);
    throw error;
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

// Update appointment in external calendar
export const updateAppointmentInCalendar = async (appointmentId: string, calendarConnectionId: string): Promise<void> => {
  try {
    const { data, error } = await supabase.functions.invoke('calendar-sync', {
      body: {
        action: 'update',
        appointmentId,
        calendarConnectionId
      }
    });
    
    if (error) {
      console.error('Calendar update error:', error);
      throw new Error(error.message);
    }
    
    console.log('Calendar update successful:', data);
  } catch (error) {
    console.error('Error updating calendar:', error);
    throw error;
  }
};

// Delete appointment from external calendar
export const deleteAppointmentFromCalendar = async (appointmentId: string, calendarConnectionId: string): Promise<void> => {
  try {
    const { data, error } = await supabase.functions.invoke('calendar-sync', {
      body: {
        action: 'delete',
        appointmentId,
        calendarConnectionId
      }
    });
    
    if (error) {
      console.error('Calendar delete error:', error);
      throw new Error(error.message);
    }
    
    console.log('Calendar delete successful:', data);
  } catch (error) {
    console.error('Error deleting from calendar:', error);
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

// Handle OAuth redirect callback
export const handleOAuthCallback = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const authStatus = urlParams.get('auth');
  
  if (authStatus === 'success') {
    return { success: true, message: 'Google Calendar connected successfully!' };
  } else if (authStatus === 'error') {
    return { success: false, message: 'Failed to connect Google Calendar. Please try again.' };
  }
  
  return null;
};
