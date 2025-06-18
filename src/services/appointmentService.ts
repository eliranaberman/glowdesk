import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type Appointment = Tables<'appointments'> & {
  clients?: {
    id: string;
    full_name: string;
    email: string;
    phone?: string;
    phone_number?: string;
  };
  client?: {
    id: string;
    full_name: string;
    email: string;
    phone?: string;
    phone_number?: string;
  };
};
export type AppointmentInsert = TablesInsert<'appointments'>;
export type AppointmentUpdate = TablesUpdate<'appointments'>;

export interface AppointmentFormData {
  customer_id: string;
  employee_id?: string | null;
  service_type: string;
  date: Date;
  start_time: string;
  end_time: string;
  status: 'scheduled' | 'cancelled' | 'completed';
  notes?: string | null;
}

export const getAppointments = async (filters?: {
  date_from?: Date;
  date_to?: Date;
  status?: string;
}) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not authenticated');

  let query = supabase
    .from('appointments')
    .select(`
      *,
      clients!appointments_customer_id_fkey(
        id,
        full_name,
        email,
        phone,
        phone_number
      )
    `)
    .eq('user_id', user.user.id);

  if (filters?.date_from) {
    query = query.gte('date', filters.date_from.toISOString().split('T')[0]);
  }

  if (filters?.date_to) {
    query = query.lte('date', filters.date_to.toISOString().split('T')[0]);
  }

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  query = query.order('date', { ascending: true })
              .order('start_time', { ascending: true });

  const { data, error } = await query;

  if (error) throw error;
  
  // Map clients to client for backward compatibility
  return (data || []).map(appointment => ({
    ...appointment,
    client: appointment.clients
  }));
};

export const getAppointmentById = async (id: string) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('appointments')
    .select(`
      *,
      clients!appointments_customer_id_fkey(
        id,
        full_name,
        email,
        phone,
        phone_number
      )
    `)
    .eq('id', id)
    .eq('user_id', user.user.id)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const createAppointment = async (appointment: AppointmentFormData) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('appointments')
    .insert({
      ...appointment,
      date: appointment.date.toISOString().split('T')[0],
      user_id: user.user.id
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateAppointment = async (id: string, updates: Partial<AppointmentFormData>) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not authenticated');

  const updateData = {
    ...updates,
    ...(updates.date && { date: updates.date.toISOString().split('T')[0] })
  };

  const { data, error } = await supabase
    .from('appointments')
    .update(updateData)
    .eq('id', id)
    .eq('user_id', user.user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteAppointment = async (id: string) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('appointments')
    .delete()
    .eq('id', id)
    .eq('user_id', user.user.id);

  if (error) throw error;
};

// Additional functions that are expected by components
export const getEmployees = async () => {
  // Mock implementation - replace with actual employee data if needed
  return [
    { id: '1', name: 'Chen Mizrahi' },
    { id: '2', name: 'עובד נוסף' }
  ];
};

export const getUniqueServiceTypes = async () => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('appointments')
    .select('service_type')
    .eq('user_id', user.user.id);

  if (error) throw error;

  const uniqueTypes = [...new Set((data || []).map(item => item.service_type))];
  return uniqueTypes.length > 0 ? uniqueTypes : [
    'מניקור ג\'ל',
    'בניית ציפורניים',
    'פדיקור',
    'לק ג\'ל',
    'טיפול פנים'
  ];
};

export const syncAppointmentWithCalendar = async (appointmentId: string, calendarId: string) => {
  // Mock implementation for calendar sync
  console.log('Syncing appointment', appointmentId, 'with calendar', calendarId);
  return { success: true };
};

export const downloadIcsFile = (appointmentData: any) => {
  // Mock implementation for ICS download
  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Chen Mizrahi//Appointment//EN
BEGIN:VEVENT
UID:${Date.now()}@chenmizrahi.com
DTSTART:${appointmentData.date.replace(/-/g, '')}T${appointmentData.start_time.replace(':', '')}00
DTEND:${appointmentData.date.replace(/-/g, '')}T${appointmentData.end_time.replace(':', '')}00
SUMMARY:${appointmentData.service_type}
DESCRIPTION:Appointment with ${appointmentData.customer?.full_name || 'Client'}
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icsContent], { type: 'text/calendar' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'appointment.ics';
  link.click();
  window.URL.revokeObjectURL(url);
};

export const generateMockAppointments = () => {
  // Mock implementation
  return [];
};

// Keep the service object for backward compatibility
export const appointmentService = {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getEmployees,
  getUniqueServiceTypes,
  syncAppointmentWithCalendar,
  downloadIcsFile,
  generateMockAppointments
};
