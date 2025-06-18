
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type Appointment = Tables<'appointments'>;
export type AppointmentInsert = TablesInsert<'appointments'>;
export type AppointmentUpdate = TablesUpdate<'appointments'>;

export const appointmentService = {
  async getAppointments() {
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
      .order('date', { ascending: true })
      .order('start_time', { ascending: true });

    if (error) throw error;
    return data;
  },

  async getAppointmentById(id: string) {
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
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async createAppointment(appointment: Omit<AppointmentInsert, 'user_id'>) {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('appointments')
      .insert({
        ...appointment,
        user_id: user.user.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateAppointment(id: string, updates: AppointmentUpdate) {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('appointments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteAppointment(id: string) {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getAppointmentsByDateRange(startDate: string, endDate: string) {
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
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true })
      .order('start_time', { ascending: true });

    if (error) throw error;
    return data;
  },

  async getUpcomingAppointments(limit: number = 5) {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const today = new Date().toISOString().split('T')[0];
    
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
      .gte('date', today)
      .eq('status', 'scheduled')
      .order('date', { ascending: true })
      .order('start_time', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data;
  }
};
