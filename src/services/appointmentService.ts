
import { supabase } from '@/lib/supabase';
import { format, parseISO } from 'date-fns';
import { Customer, getCustomerById } from './customerService';

export interface Appointment {
  id: string;
  customer_id: string;
  employee_id: string | null;
  service_type: string;
  date: string; // YYYY-MM-DD
  start_time: string; // HH:MM
  end_time: string; // HH:MM
  status: 'scheduled' | 'cancelled' | 'completed';
  notes: string | null;
  customer?: Customer; // Optional customer data for frontend display
}

export interface AppointmentFormData {
  customer_id: string;
  employee_id: string | null;
  service_type: string;
  date: Date;
  start_time: string; // HH:MM
  end_time: string; // HH:MM
  status: 'scheduled' | 'cancelled' | 'completed';
  notes: string | null;
}

export interface AppointmentFilter {
  employee_id?: string | null;
  service_type?: string | null;
  status?: 'scheduled' | 'cancelled' | 'completed' | 'all';
  search?: string;
  date_from?: Date;
  date_to?: Date;
}

// Helper function to format dates for Supabase
const prepareDateFields = (data: any): any => {
  const result = { ...data };
  
  if (data.date instanceof Date) {
    result.date = format(data.date, 'yyyy-MM-dd');
  }
  
  return result;
};

// Get appointments with optional filters
export const getAppointments = async (filter: AppointmentFilter = {}): Promise<Appointment[]> => {
  let query = supabase.from('appointments').select(`
    *,
    customers:customer_id (id, full_name, email, phone_number)
  `);
  
  // Apply filters
  if (filter.employee_id) {
    query = query.eq('employee_id', filter.employee_id);
  }
  
  if (filter.service_type) {
    query = query.eq('service_type', filter.service_type);
  }
  
  if (filter.status && filter.status !== 'all') {
    query = query.eq('status', filter.status);
  }
  
  if (filter.date_from) {
    query = query.gte('date', format(filter.date_from, 'yyyy-MM-dd'));
  }
  
  if (filter.date_to) {
    query = query.lte('date', format(filter.date_to, 'yyyy-MM-dd'));
  }
  
  if (filter.search) {
    // We need to use the Supabase join capability to search by customer name
    query = query.textSearch('customers.full_name', filter.search, {
      type: 'websearch',
      config: 'english'
    });
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching appointments:', error);
    throw new Error(error.message);
  }
  
  // Format the appointments for frontend use
  const appointments = data?.map(appointment => ({
    ...appointment,
    customer: appointment.customers
  })) || [];
  
  return appointments;
};

// Get appointments for a specific customer
export const getAppointmentsByCustomerId = async (customerId: string): Promise<Appointment[]> => {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('customer_id', customerId)
    .order('date', { ascending: false });
  
  if (error) {
    console.error('Error fetching customer appointments:', error);
    throw new Error(error.message);
  }
  
  return data || [];
};

// Get a single appointment by ID
export const getAppointmentById = async (id: string): Promise<Appointment> => {
  const { data, error } = await supabase
    .from('appointments')
    .select(`
      *,
      customers:customer_id (id, full_name, email, phone_number)
    `)
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching appointment:', error);
    throw new Error(error.message);
  }
  
  if (!data) {
    throw new Error('Appointment not found');
  }
  
  const appointment = {
    ...data,
    customer: data.customers
  };
  
  return appointment;
};

// Create a new appointment
export const createAppointment = async (appointmentData: AppointmentFormData): Promise<Appointment> => {
  // Validate required fields
  if (!appointmentData.customer_id || !appointmentData.service_type || !appointmentData.date || !appointmentData.start_time) {
    throw new Error('Missing required appointment information');
  }
  
  const preparedAppointment = prepareDateFields(appointmentData);
  
  const { data, error } = await supabase
    .from('appointments')
    .insert(preparedAppointment)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating appointment:', error);
    throw new Error(error.message);
  }
  
  return data;
};

// Update an existing appointment
export const updateAppointment = async (id: string, updates: Partial<AppointmentFormData>): Promise<Appointment> => {
  const preparedUpdates = prepareDateFields(updates);
  
  const { data, error } = await supabase
    .from('appointments')
    .update(preparedUpdates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating appointment:', error);
    throw new Error(error.message);
  }
  
  return data;
};

// Update appointment status
export const updateAppointmentStatus = async (id: string, status: Appointment['status']): Promise<Appointment> => {
  const { data, error } = await supabase
    .from('appointments')
    .update({ status })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating appointment status:', error);
    throw new Error(error.message);
  }
  
  return data;
};

// Delete an appointment
export const deleteAppointment = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('appointments')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting appointment:', error);
    throw new Error(error.message);
  }
};

// Get all unique service types
export const getUniqueServiceTypes = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from('appointments')
    .select('service_type');
  
  if (error) {
    console.error('Error fetching service types:', error);
    throw new Error(error.message);
  }
  
  const serviceTypes = [...new Set(data?.map(item => item.service_type) || [])];
  return serviceTypes;
};

// Get all employees (simplified version - in a real app, this would connect to an employees table)
export const getEmployees = async (): Promise<{ id: string; name: string }[]> => {
  // This is a mock implementation. In a real application, you'd fetch from an employees table
  return [
    { id: 'emp-1', name: 'צ׳ן מזרחי' },
    { id: 'emp-2', name: 'מאיה כהן' },
    { id: 'emp-3', name: 'יעל לוי' }
  ];
};

// Calculate appointment duration in minutes
export const calculateDuration = (startTime: string, endTime: string): number => {
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  
  const startTotalMinutes = startHours * 60 + startMinutes;
  const endTotalMinutes = endHours * 60 + endMinutes;
  
  return endTotalMinutes - startTotalMinutes;
};

// Generate mock appointments for testing
export const generateMockAppointments = async (): Promise<void> => {
  // Get all customers to use for mock data
  const { data: customers, error: customersError } = await supabase
    .from('customers')
    .select('id, full_name');
    
  if (customersError) {
    console.error('Error fetching customers for mock data:', customersError);
    throw new Error(customersError.message);
  }
  
  if (!customers || customers.length === 0) {
    throw new Error('No customers found for generating mock appointments');
  }
  
  const serviceTypes = [
    'מניקור ג׳ל',
    'בניית ציפורניים',
    'פדיקור',
    'לק ג׳ל',
    'טיפול פנים'
  ];
  
  const statuses: Array<Appointment['status']> = ['scheduled', 'cancelled', 'completed'];
  const employees = await getEmployees();
  
  // Generate 30 random appointments
  const today = new Date();
  const mockAppointments = [];
  
  for (let i = 0; i < 30; i++) {
    // Random date within +/- 7 days from today
    const randomDayOffset = Math.floor(Math.random() * 14) - 7;
    const appointmentDate = new Date(today);
    appointmentDate.setDate(today.getDate() + randomDayOffset);
    
    // Random start time between 9:00 and 18:00
    const startHour = Math.floor(Math.random() * 9) + 9;
    const startMinute = Math.random() < 0.5 ? 0 : 30;
    const startTime = `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;
    
    // Random duration between 30 and 120 minutes
    const durationOptions = [30, 45, 60, 90, 120];
    const duration = durationOptions[Math.floor(Math.random() * durationOptions.length)];
    
    // Calculate end time
    const endHour = Math.floor(startHour + (startMinute + duration) / 60);
    const endMinute = (startMinute + duration) % 60;
    const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
    
    mockAppointments.push({
      customer_id: customers[Math.floor(Math.random() * customers.length)].id,
      employee_id: Math.random() < 0.8 ? employees[Math.floor(Math.random() * employees.length)].id : null,
      service_type: serviceTypes[Math.floor(Math.random() * serviceTypes.length)],
      date: format(appointmentDate, 'yyyy-MM-dd'),
      start_time: startTime,
      end_time: endTime,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      notes: Math.random() < 0.3 ? 'הערות לגבי הפגישה' : null
    });
  }
  
  // Insert mock appointments
  const { error } = await supabase
    .from('appointments')
    .insert(mockAppointments);
  
  if (error) {
    console.error('Error inserting mock appointments:', error);
    throw new Error(error.message);
  }
};
