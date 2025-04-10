
import { supabase } from '@/lib/supabase';

export interface Customer {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  registration_date: string;
  last_appointment: string | null;
  status: 'active' | 'inactive';
  notes: string | null;
  tags: string[];
  loyalty_level: 'bronze' | 'silver' | 'gold';
}

export interface CustomerFilter {
  search?: string;
  status?: 'active' | 'inactive' | 'all';
  loyalty_level?: 'bronze' | 'silver' | 'gold' | 'all';
  tags?: string[];
  sort_by?: 'registration_date' | 'last_appointment' | 'full_name';
  sort_direction?: 'asc' | 'desc';
}

// Get all customers with optional filtering
export const getCustomers = async (filter?: CustomerFilter) => {
  console.log('Fetching customers with filter:', filter);
  
  let query = supabase
    .from('customers')
    .select('*');

  if (filter) {
    // Apply search filter
    if (filter.search) {
      query = query.or(
        `full_name.ilike.%${filter.search}%,email.ilike.%${filter.search}%,phone_number.ilike.%${filter.search}%`
      );
    }

    // Apply status filter
    if (filter.status && filter.status !== 'all') {
      query = query.eq('status', filter.status);
    }

    // Apply loyalty level filter
    if (filter.loyalty_level && filter.loyalty_level !== 'all') {
      query = query.eq('loyalty_level', filter.loyalty_level);
    }

    // Apply tags filter
    if (filter.tags && filter.tags.length > 0) {
      query = query.contains('tags', filter.tags);
    }

    // Apply sorting
    if (filter.sort_by) {
      const direction = filter.sort_direction || 'desc';
      query = query.order(filter.sort_by, { ascending: direction === 'asc' });
    } else {
      // Default sort by most recent registration
      query = query.order('registration_date', { ascending: false });
    }
  } else {
    // Default sort by most recent registration
    query = query.order('registration_date', { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }

  return data as Customer[];
};

// Get a single customer by ID
export const getCustomerById = async (id: string) => {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching customer:', error);
    throw error;
  }

  return data as Customer;
};

// Create a new customer
export const createCustomer = async (customer: Omit<Customer, 'id'>) => {
  const { data, error } = await supabase
    .from('customers')
    .insert([customer])
    .select();

  if (error) {
    console.error('Error creating customer:', error);
    throw error;
  }

  return data[0] as Customer;
};

// Update an existing customer
export const updateCustomer = async (id: string, updates: Partial<Customer>) => {
  const { data, error } = await supabase
    .from('customers')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating customer:', error);
    throw error;
  }

  return data[0] as Customer;
};

// Delete a customer
export const deleteCustomer = async (id: string) => {
  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting customer:', error);
    throw error;
  }

  return true;
};

// Mark customer as inactive
export const markCustomerInactive = async (id: string) => {
  return updateCustomer(id, { status: 'inactive' });
};

// Get all unique tags
export const getUniqueTags = async () => {
  const { data, error } = await supabase
    .from('customers')
    .select('tags');

  if (error) {
    console.error('Error fetching tags:', error);
    throw error;
  }

  // Flatten and deduplicate tags
  const allTags = data.flatMap(customer => customer.tags || []);
  const uniqueTags = [...new Set(allTags)];
  
  return uniqueTags;
};

// Send reminder to customer (placeholder function)
export const sendReminder = async (customerId: string, method: 'sms' | 'email') => {
  console.log(`Sending ${method} reminder to customer ${customerId}`);
  
  // In a real implementation, this would connect to an SMS or email service
  // For now, we'll just simulate a successful API call
  
  return { success: true, message: `${method === 'sms' ? 'SMS' : 'Email'} sent successfully` };
};
