
import { Customer, CustomerFormData, mockCustomers } from './types';

// Create a new customer
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

// Update an existing customer
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
