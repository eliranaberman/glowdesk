
import { useState } from 'react';
import CustomerTable from '../components/customers/CustomerTable';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const Customers = () => {
  const navigate = useNavigate();
  // Mock customer data
  const [customers] = useState([
    {
      id: '1',
      name: 'שרה כהן',
      email: 'sarah.j@example.com',
      phone: '(555) 123-4567',
      lastAppointment: '2023-04-01',
      totalVisits: 8,
      totalSpent: 320,
      status: 'active' as const,
    },
    {
      id: '2',
      name: 'אמילי דייויס',
      email: 'emily.d@example.com',
      phone: '(555) 987-6543',
      lastAppointment: '2023-03-25',
      totalVisits: 12,
      totalSpent: 560,
      status: 'active' as const,
    },
    {
      id: '3',
      name: 'ליאת ונג',
      email: 'lisa.w@example.com',
      phone: '(555) 456-7890',
      lastAppointment: '2023-04-02',
      totalVisits: 5,
      totalSpent: 210,
      status: 'active' as const,
    },
    {
      id: '4',
      name: 'מריה גארסיה',
      email: 'maria.g@example.com',
      phone: '(555) 234-5678',
      lastAppointment: '2023-02-15',
      totalVisits: 3,
      totalSpent: 120,
      status: 'inactive' as const,
    },
    {
      id: '5',
      name: 'ג\'ניפר מילר',
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
    toast(`עריכת לקוח עם מזהה: ${id}`);
  };

  const handleDeleteCustomer = (id: string) => {
    // In a real application, this would prompt for confirmation before deletion
    toast(`מחיקת לקוח עם מזהה: ${id}`);
  };

  const handleAddCustomer = () => {
    navigate('/customers/new');
  };

  return (
    <div dir="rtl">
      <h1 className="text-2xl font-bold mb-4">ניהול לקוחות</h1>
      <p className="text-muted-foreground mb-6">
        צפה ונהל את כל הלקוחות שלך במקום אחד.
      </p>

      <CustomerTable
        customers={customers}
        onEditCustomer={handleEditCustomer}
        onDeleteCustomer={handleDeleteCustomer}
        onAddCustomer={handleAddCustomer}
      />
    </div>
  );
};

export default Customers;
