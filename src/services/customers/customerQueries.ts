
import { Customer } from './types';
import { mockCustomers } from './types';

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
