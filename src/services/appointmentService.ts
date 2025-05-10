
// This is a mock service for handling appointments
import { toast } from 'sonner';

export interface AppointmentFormData {
  customer_id: string;
  employee_id: string | null;
  service_type: string;
  date: Date;
  start_time: string;
  end_time: string;
  status: string;
  notes: string | null;
}

export interface Appointment extends AppointmentFormData {
  id: string;
  created_at: string;
  updated_at: string;
  customer?: {
    id: string;
    full_name: string;
    phone: string;
  };
}

// Mock data store
let mockAppointments: Appointment[] = [];
let mockEmployees = [
  { id: 'emp1', name: 'חן מזרחי' },
  { id: 'emp2', name: 'דנה כהן' },
  { id: 'emp3', name: 'רותם לוי' },
];

const mockServiceTypes = [
  'מניקור ג\'ל',
  'פדיקור',
  'בניית ציפורניים',
  'לק ג\'ל',
  'טיפול פנים',
  'עיצוב גבות'
];

// Generate a UUID
const generateId = () => {
  return 'id-' + Math.random().toString(36).substr(2, 9);
};

// Format date to ISO string (YYYY-MM-DD)
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Get all employees
export const getEmployees = async () => {
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
  return mockEmployees;
};

// Get unique service types
export const getUniqueServiceTypes = async () => {
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
  return mockServiceTypes;
};

// Get appointments with filtering options
export const getAppointments = async (filters: {
  employee_id?: string | null;
  service_type?: string | null;
  status?: string;
  search?: string;
  date_from?: Date;
  date_to?: Date;
}) => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
  
  let filteredAppointments = [...mockAppointments];
  
  // Apply filters
  if (filters.employee_id) {
    filteredAppointments = filteredAppointments.filter(apt => apt.employee_id === filters.employee_id);
  }
  
  if (filters.service_type) {
    filteredAppointments = filteredAppointments.filter(apt => apt.service_type === filters.service_type);
  }
  
  if (filters.status && filters.status !== 'all') {
    filteredAppointments = filteredAppointments.filter(apt => apt.status === filters.status);
  }
  
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filteredAppointments = filteredAppointments.filter(apt => 
      apt.customer?.full_name.toLowerCase().includes(searchLower) ||
      apt.service_type.toLowerCase().includes(searchLower)
    );
  }
  
  if (filters.date_from && filters.date_to) {
    const fromDate = formatDate(filters.date_from);
    const toDate = formatDate(filters.date_to);
    
    filteredAppointments = filteredAppointments.filter(apt => {
      const aptDate = formatDate(new Date(apt.date));
      return aptDate >= fromDate && aptDate <= toDate;
    });
  }
  
  return filteredAppointments;
};

// Get a single appointment by ID
export const getAppointmentById = async (id: string): Promise<Appointment> => {
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
  
  const appointment = mockAppointments.find(apt => apt.id === id);
  
  if (!appointment) {
    throw new Error('Appointment not found');
  }
  
  return appointment;
};

// Create a new appointment
export const createAppointment = async (data: AppointmentFormData) => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
  
  const now = new Date().toISOString();
  const newAppointment: Appointment = {
    ...data,
    id: generateId(),
    created_at: now,
    updated_at: now,
    customer: {
      id: data.customer_id,
      full_name: 'לקוח #' + data.customer_id,
      phone: '050-0000000',
    }
  };
  
  mockAppointments.push(newAppointment);
  return newAppointment;
};

// Update an existing appointment
export const updateAppointment = async (id: string, data: AppointmentFormData) => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
  
  const index = mockAppointments.findIndex(apt => apt.id === id);
  
  if (index === -1) {
    throw new Error('Appointment not found');
  }
  
  const updatedAppointment: Appointment = {
    ...mockAppointments[index],
    ...data,
    updated_at: new Date().toISOString()
  };
  
  mockAppointments[index] = updatedAppointment;
  return updatedAppointment;
};

// Delete an appointment
export const deleteAppointment = async (id: string) => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
  
  const initialLength = mockAppointments.length;
  mockAppointments = mockAppointments.filter(apt => apt.id !== id);
  
  if (mockAppointments.length === initialLength) {
    throw new Error('Appointment not found');
  }
  
  return { success: true };
};

// Generate mock appointments data
export const generateMockAppointments = async () => {
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
  
  const currentDate = new Date();
  const mockCustomerIds = ['cust1', 'cust2', 'cust3', 'cust4', 'cust5'];
  const mockCustomerNames = ['שרה כהן', 'אמילי לוי', 'ליאת ונג', 'מיכל אברהם', 'רחל גולן'];
  const mockStatuses = ['scheduled', 'completed', 'cancelled'];
  
  // Clear existing mock data
  mockAppointments = [];
  
  // Generate appointments for the next 30 days
  for (let i = 0; i < 30; i++) {
    const appointmentDate = new Date(currentDate);
    appointmentDate.setDate(currentDate.getDate() + i);
    
    // Random number of appointments per day (2-6)
    const numAppointments = Math.floor(Math.random() * 5) + 2;
    
    for (let j = 0; j < numAppointments; j++) {
      // Generate random appointment data
      const customerId = mockCustomerIds[Math.floor(Math.random() * mockCustomerIds.length)];
      const customerName = mockCustomerNames[Math.floor(Math.random() * mockCustomerNames.length)];
      const employeeId = mockEmployees[Math.floor(Math.random() * mockEmployees.length)].id;
      const serviceType = mockServiceTypes[Math.floor(Math.random() * mockServiceTypes.length)];
      const status = mockStatuses[Math.floor(Math.random() * mockStatuses.length)];
      
      // Generate random start time between 9:00 and 18:00
      const hour = Math.floor(Math.random() * 9) + 9;
      const minute = Math.random() < 0.5 ? 0 : 30;
      const startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      
      // Generate end time (30, 60, or 90 minutes later)
      const durationMinutes = [30, 60, 90][Math.floor(Math.random() * 3)];
      const endHour = hour + Math.floor((minute + durationMinutes) / 60);
      const endMinute = (minute + durationMinutes) % 60;
      const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
      
      const now = new Date().toISOString();
      
      const appointment: Appointment = {
        id: generateId(),
        customer_id: customerId,
        employee_id: employeeId,
        service_type: serviceType,
        date: appointmentDate,
        start_time: startTime,
        end_time: endTime,
        status,
        notes: Math.random() < 0.3 ? 'הערה לגבי הפגישה' : null,
        created_at: now,
        updated_at: now,
        customer: {
          id: customerId,
          full_name: customerName,
          phone: '050-' + Math.floor(1000000 + Math.random() * 9000000)
        }
      };
      
      mockAppointments.push(appointment);
    }
  }
  
  return { success: true, count: mockAppointments.length };
};

// Mock function for calendar syncing
export const syncAppointmentWithCalendar = async (appointmentId: string, calendarId: string) => {
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
  console.log(`Syncing appointment ${appointmentId} with calendar ${calendarId}`);
  return { success: true };
};

// Mock function to generate ICS file
export const downloadIcsFile = (appointment: any) => {
  const { date, start_time, end_time, service_type, customer } = appointment;
  
  console.log('Downloading ICS file for:', { date, service_type, customer });
  
  // In a real app, this would generate an actual .ics file
  toast.success('קובץ .ics הורד בהצלחה');
};
