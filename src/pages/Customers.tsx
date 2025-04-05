
import { useState } from 'react';
import CustomerTable from '../components/customers/CustomerTable';
import { toast } from 'sonner';

const Customers = () => {
  // Mock customer data
  const [customers] = useState([
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      phone: '(555) 123-4567',
      lastAppointment: '2023-04-01',
      totalVisits: 8,
      totalSpent: 320,
      status: 'active' as const,
    },
    {
      id: '2',
      name: 'Emily Davis',
      email: 'emily.d@example.com',
      phone: '(555) 987-6543',
      lastAppointment: '2023-03-25',
      totalVisits: 12,
      totalSpent: 560,
      status: 'active' as const,
    },
    {
      id: '3',
      name: 'Lisa Wong',
      email: 'lisa.w@example.com',
      phone: '(555) 456-7890',
      lastAppointment: '2023-04-02',
      totalVisits: 5,
      totalSpent: 210,
      status: 'active' as const,
    },
    {
      id: '4',
      name: 'Maria Garcia',
      email: 'maria.g@example.com',
      phone: '(555) 234-5678',
      lastAppointment: '2023-02-15',
      totalVisits: 3,
      totalSpent: 120,
      status: 'inactive' as const,
    },
    {
      id: '5',
      name: 'Jennifer Miller',
      email: 'jennifer.m@example.com',
      phone: '(555) 876-5432',
      lastAppointment: '2023-03-10',
      totalVisits: 7,
      totalSpent: 290,
      status: 'active' as const,
    },
  ]);

  const handleEditCustomer = (id: string) => {
    // In a real application, this would open a modal or navigate to an edit page
    toast(`Editing customer with ID: ${id}`);
  };

  const handleDeleteCustomer = (id: string) => {
    // In a real application, this would prompt for confirmation before deletion
    toast(`Deleting customer with ID: ${id}`);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Customer Management</h1>
      <p className="text-muted-foreground mb-6">
        View and manage all your customers in one place.
      </p>

      <CustomerTable
        customers={customers}
        onEditCustomer={handleEditCustomer}
        onDeleteCustomer={handleDeleteCustomer}
      />
    </div>
  );
};

export default Customers;
