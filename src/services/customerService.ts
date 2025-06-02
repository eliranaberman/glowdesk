
// Assuming this file exists, let's update the Customer type and service functions
import { supabase } from '@/lib/supabase';
import { format, parse } from 'date-fns';

export interface Customer {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  registration_date: string; // Store as string in DB, but can convert to Date for UI
  last_appointment: string | null; // Store as string in DB, but can convert to Date for UI
  status: 'active' | 'inactive';
  notes: string;
  tags: string[];
  loyalty_level: 'bronze' | 'silver' | 'gold';
}

export interface CustomerFormData {
  full_name: string;
  email: string;
  phone_number: string;
  registration_date: Date;
  last_appointment: Date | null;
  status: 'active' | 'inactive';
  notes: string;
  tags: string[];
  loyalty_level: 'bronze' | 'silver' | 'gold';
}

export interface CustomerFilter {
  search: string;
  status: 'active' | 'inactive' | 'all';
  loyalty_level: 'bronze' | 'silver' | 'gold' | 'all';
  tags: string[];
  sort_by: 'registration_date' | 'last_appointment' | 'full_name';
  sort_direction: 'asc' | 'desc';
}

// Helper function to convert Date objects to strings for the database
const prepareDateFields = (data: any): any => {
  const result = { ...data };
  
  if (data.registration_date instanceof Date) {
    result.registration_date = format(data.registration_date, 'yyyy-MM-dd');
  }
  
  if (data.last_appointment instanceof Date) {
    result.last_appointment = format(data.last_appointment, 'yyyy-MM-dd');
  }
  
  return result;
};

// Helper function to convert string dates from the database to Date objects for the UI
const formatDatesForUI = (customer: Customer): CustomerFormData => {
  return {
    ...customer,
    registration_date: customer.registration_date 
      ? parse(customer.registration_date, 'yyyy-MM-dd', new Date())
      : new Date(),
    last_appointment: customer.last_appointment
      ? parse(customer.last_appointment, 'yyyy-MM-dd', new Date())
      : null
  };
};

// Get all customers with optional filtering
export const getCustomers = async (filter: CustomerFilter): Promise<Customer[]> => {
  let query = supabase.from('customers').select('*');
  
  // Apply search filter
  if (filter.search) {
    query = query.or(`full_name.ilike.%${filter.search}%,email.ilike.%${filter.search}%,phone_number.ilike.%${filter.search}%`);
  }
  
  // Apply status filter
  if (filter.status !== 'all') {
    query = query.eq('status', filter.status);
  }
  
  // Apply loyalty level filter
  if (filter.loyalty_level !== 'all') {
    query = query.eq('loyalty_level', filter.loyalty_level);
  }
  
  // Apply tags filter
  if (filter.tags.length > 0) {
    // This assumes the tags are stored as an array
    filter.tags.forEach(tag => {
      query = query.contains('tags', [tag]);
    });
  }
  
  // Apply sorting
  query = query.order(filter.sort_by, { ascending: filter.sort_direction === 'asc' });
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching customers:', error);
    throw new Error(error.message);
  }
  
  return data || [];
};

// Get a single customer by ID
export const getCustomerById = async (id: string): Promise<Customer> => {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching customer:', error);
    throw new Error(error.message);
  }
  
  if (!data) {
    throw new Error('Customer not found');
  }
  
  return data;
};

// Get a single customer by ID and format dates for UI
export const getCustomerFormDataById = async (id: string): Promise<CustomerFormData> => {
  const customer = await getCustomerById(id);
  return formatDatesForUI(customer);
};

// Create a new customer
export const createCustomer = async (customerData: CustomerFormData): Promise<Customer> => {
  // Ensure required fields are present
  if (!customerData.full_name || !customerData.email || !customerData.phone_number) {
    throw new Error('Missing required customer information');
  }
  
  const preparedCustomer = prepareDateFields(customerData);
  
  const { data, error } = await supabase
    .from('customers')
    .insert(preparedCustomer)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating customer:', error);
    throw new Error(error.message);
  }
  
  return data;
};

// Update an existing customer
export const updateCustomer = async (id: string, updates: Partial<CustomerFormData>): Promise<Customer> => {
  const preparedUpdates = prepareDateFields(updates);
  
  const { data, error } = await supabase
    .from('customers')
    .update(preparedUpdates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating customer:', error);
    throw new Error(error.message);
  }
  
  return data;
};

// Mark a customer as inactive
export const markCustomerInactive = async (id: string): Promise<Customer> => {
  const { data, error } = await supabase
    .from('customers')
    .update({ status: 'inactive' })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error marking customer inactive:', error);
    throw new Error(error.message);
  }
  
  return data;
};

// Send a reminder to a customer (placeholder implementation)
export const sendReminder = async (id: string, method: 'sms' | 'email'): Promise<boolean> => {
  // In a real application, this would connect to an SMS or email service
  console.log(`Sending ${method} reminder to customer ID: ${id}`);
  
  // Simulate a successful API call
  return new Promise(resolve => {
    setTimeout(() => resolve(true), 1000);
  });
};

// Get all unique tags used across customers
export const getUniqueTags = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from('customers')
    .select('tags');
  
  if (error) {
    console.error('Error fetching tags:', error);
    throw new Error(error.message);
  }
  
  // Extract and flatten all tags
  const allTags = data?.flatMap(customer => customer.tags || []) || [];
  
  // Remove duplicates
  return [...new Set(allTags)];
};
