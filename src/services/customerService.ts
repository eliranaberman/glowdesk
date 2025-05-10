// Mock customer service

export interface Customer {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  phone_number?: string; // Adding phone_number property
  status: 'active' | 'inactive' | 'lead'; // Make status a union type
  loyalty_level?: 'gold' | 'silver' | 'bronze' | 'none';
  tags?: string[];
  created_at: string;
  updated_at: string;
  notes?: string; // Adding notes property
  registration_date?: string; // Adding registration_date
  last_appointment?: string; // Adding last_appointment
}

export interface CustomerFormData {
  full_name: string;
  email: string;
  phone_number: string;
  status: 'active' | 'inactive' | 'lead';
  loyalty_level: 'gold' | 'silver' | 'bronze' | 'none';
  notes?: string;
  registration_date: Date;
  last_appointment?: Date | null;
  tags?: string[];
}

// Mock data
const mockCustomers: Customer[] = [
  {
    id: 'cust1',
    full_name: 'שרה כהן',
    email: 'sarah@example.com',
    phone: '050-1234567',
    phone_number: '050-1234567',
    status: 'active',
    loyalty_level: 'gold',
    tags: ['vip', 'regular'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    notes: 'לקוחה ותיקה',
    registration_date: new Date('2023-01-15').toISOString(),
    last_appointment: new Date('2023-05-20').toISOString()
  },
  {
    id: 'cust2',
    full_name: 'אמילי לוי',
    email: 'emily@example.com',
    phone: '050-2345678',
    phone_number: '050-2345678',
    status: 'active',
    loyalty_level: 'silver',
    tags: ['new'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    notes: '',
    registration_date: new Date('2023-03-10').toISOString(),
    last_appointment: new Date('2023-06-05').toISOString()
  },
  {
    id: 'cust3',
    full_name: 'ליאת ונג',
    email: 'liat@example.com',
    phone: '050-3456789',
    phone_number: '050-3456789',
    status: 'inactive',
    loyalty_level: 'bronze',
    tags: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    notes: 'לקוחה לא פעילה',
    registration_date: new Date('2023-02-20').toISOString(),
    last_appointment: new Date('2023-04-15').toISOString()
  },
  {
    id: 'cust4',
    full_name: 'מיכל אברהם',
    email: 'michal@example.com',
    phone: '050-4567890',
    phone_number: '050-4567890',
    status: 'lead',
    loyalty_level: 'none',
    tags: ['interested'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    notes: 'לקוחה פוטנציאלית',
    registration_date: new Date('2023-05-01').toISOString()
  },
  {
    id: 'cust5',
    full_name: 'רחל גולן',
    email: 'rachel@example.com',
    phone: '050-5678901',
    phone_number: '050-5678901',
    status: 'active',
    loyalty_level: 'gold',
    tags: ['vip'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    notes: 'לקוחה ותיקה ו-VIP',
    registration_date: new Date('2022-11-15').toISOString(),
    last_appointment: new Date('2023-06-25').toISOString()
  }
];

// Get customers with filtering options
export const getCustomers = async (filters: {
  search?: string;
  status?: string;
  loyalty_level?: string;
  tags?: string[];
  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
}): Promise<Customer[]> => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
  
  let filteredCustomers = [...mockCustomers];
  
  // Apply filters
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filteredCustomers = filteredCustomers.filter(customer => 
      customer.full_name.toLowerCase().includes(searchLower) ||
      customer.email.toLowerCase().includes(searchLower) ||
      customer.phone.includes(filters.search)
    );
  }
  
  if (filters.status && filters.status !== 'all') {
    filteredCustomers = filteredCustomers.filter(customer => customer.status === filters.status);
  }
  
  if (filters.loyalty_level && filters.loyalty_level !== 'all') {
    filteredCustomers = filteredCustomers.filter(customer => customer.loyalty_level === filters.loyalty_level);
  }
  
  if (filters.tags && filters.tags.length > 0) {
    filteredCustomers = filteredCustomers.filter(customer => 
      customer.tags?.some(tag => filters.tags?.includes(tag))
    );
  }
  
  // Sort customers
  if (filters.sort_by) {
    filteredCustomers.sort((a, b) => {
      const fieldA = (a as any)[filters.sort_by!];
      const fieldB = (b as any)[filters.sort_by!];
      
      if (fieldA < fieldB) return filters.sort_direction === 'desc' ? 1 : -1;
      if (fieldA > fieldB) return filters.sort_direction === 'desc' ? -1 : 1;
      return 0;
    });
  }
  
  return filteredCustomers;
};

// Get a single customer by ID
export const getCustomerById = async (id: string): Promise<Customer> => {
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
  
  const customer = mockCustomers.find(c => c.id === id);
  
  if (!customer) {
    throw new Error('Customer not found');
  }
  
  return { ...customer };
};

// Add missing functions to create and update customers
export const createCustomer = async (data: CustomerFormData): Promise<Customer> => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay

  // Create a new customer object
  const newCustomer: Customer = {
    id: 'cust' + Date.now(), // Generate a mock ID
    full_name: data.full_name,
    email: data.email,
    phone: data.phone_number,
    phone_number: data.phone_number,
    status: data.status,
    loyalty_level: data.loyalty_level,
    tags: data.tags || [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    notes: data.notes,
    registration_date: data.registration_date.toISOString(),
    last_appointment: data.last_appointment ? data.last_appointment.toISOString() : undefined
  };

  // Add to mock data (in a real app, this would be sent to a server)
  mockCustomers.push(newCustomer);

  return newCustomer;
};

// Export updateCustomer function
export const updateCustomer = async (id: string, data: Partial<CustomerFormData>): Promise<Customer> => {
  await new Promise(resolve => setTimeout(resolve, 400)); // Simulate API delay

  const customerIndex = mockCustomers.findIndex(c => c.id === id);
  if (customerIndex === -1) {
    throw new Error('Customer not found');
  }

  // Update the customer
  const updatedCustomer = {
    ...mockCustomers[customerIndex],
    ...data,
    updated_at: new Date().toISOString(),
    // Handle date conversions
    registration_date: data.registration_date ? data.registration_date.toISOString() : mockCustomers[customerIndex].registration_date,
    last_appointment: data.last_appointment ? data.last_appointment.toISOString() : mockCustomers[customerIndex].last_appointment
  };

  // Update in mock data
  mockCustomers[customerIndex] = updatedCustomer as Customer;

  return updatedCustomer as Customer;
};
