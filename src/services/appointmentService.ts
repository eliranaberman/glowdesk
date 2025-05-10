
// Mock appointment service

export interface AppointmentFormData {
  customer_id: string;
  employee_id: string | null;
  service_type: string;
  date: Date;
  start_time: string;
  end_time: string;
  status: 'scheduled' | 'cancelled' | 'completed' | 'no_show'; // Define as a union type
  notes: string | null;
}

interface Appointment extends AppointmentFormData {
  id: string;
  created_at: string;
  updated_at: string;
  calendar_id?: string;
}

// Mock appointments data
const mockAppointments: Appointment[] = [
  {
    id: '1',
    customer_id: 'cust1',
    employee_id: 'emp1',
    service_type: 'מניקור ג\'ל',
    date: new Date('2025-04-10'),
    start_time: '10:00',
    end_time: '11:00',
    status: 'scheduled',
    notes: 'לקוחה ותיקה',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    customer_id: 'cust2',
    employee_id: 'emp2',
    service_type: 'אקריליק מלא',
    date: new Date('2025-04-10'),
    start_time: '12:30',
    end_time: '14:00',
    status: 'scheduled',
    notes: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    customer_id: 'cust3',
    employee_id: null,
    service_type: 'פדיקור',
    date: new Date('2025-04-10'),
    start_time: '14:00',
    end_time: '15:15',
    status: 'cancelled',
    notes: 'רגישה לחומרים מסוימים',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Get appointment by ID
export const getAppointmentById = async (id: string): Promise<Appointment> => {
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
  
  const appointment = mockAppointments.find(a => a.id === id);
  
  if (!appointment) {
    throw new Error('Appointment not found');
  }
  
  return { ...appointment };
};

// Create appointment
export const createAppointment = async (data: AppointmentFormData): Promise<Appointment> => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
  
  const newAppointment: Appointment = {
    id: Math.random().toString(36).substring(2, 9),
    ...data,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  mockAppointments.push(newAppointment);
  
  return newAppointment;
};

// Update appointment
export const updateAppointment = async (id: string, data: Partial<AppointmentFormData>): Promise<Appointment> => {
  await new Promise(resolve => setTimeout(resolve, 400)); // Simulate API delay
  
  const appointmentIndex = mockAppointments.findIndex(a => a.id === id);
  if (appointmentIndex === -1) {
    throw new Error('Appointment not found');
  }
  
  const updatedAppointment = {
    ...mockAppointments[appointmentIndex],
    ...data,
    updated_at: new Date().toISOString()
  };
  
  mockAppointments[appointmentIndex] = updatedAppointment;
  
  return updatedAppointment;
};

// Get all employees for the dropdown
export const getEmployees = async (): Promise<{ id: string; name: string }[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return [
    { id: 'emp1', name: 'ליאת כהן' },
    { id: 'emp2', name: 'מיכל לוי' },
    { id: 'emp3', name: 'דנה גולדברג' }
  ];
};

// Get unique service types
export const getUniqueServiceTypes = async (): Promise<string[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return [
    'מניקור ג׳ל',
    'בניית ציפורניים',
    'פדיקור',
    'לק ג׳ל',
    'טיפול פנים'
  ];
};

// Sync with calendar
export const syncAppointmentWithCalendar = async (
  appointmentId: string, 
  calendarId: string
): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // In real app, this would sync with external calendar
  // For now, just update the appointment with the calendar ID
  const appointment = mockAppointments.find(a => a.id === appointmentId);
  if (appointment) {
    appointment.calendar_id = calendarId;
  }
  
  return true;
};

// Download ICS file
export const downloadIcsFile = (appointmentData: {
  date: string;
  start_time: string;
  end_time: string;
  service_type: string;
  customer?: any;
}): void => {
  // In a real app, this would generate and download an .ics file
  console.log('Downloading ICS file for:', appointmentData);
  alert('בקשת הורדת קובץ ICS התקבלה. בגרסה זו, ההורדה היא סימולציה בלבד.');
};
