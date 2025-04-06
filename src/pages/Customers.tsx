
import { useState, useEffect } from 'react';
import CustomerTable from '../components/customers/CustomerTable';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

// Import the mock customers from localStorage if available
const getInitialCustomers = () => {
  try {
    const savedCustomers = localStorage.getItem('mockCustomers');
    if (savedCustomers) {
      // We have saved customer data, use it to hydrate our customer list
      const customerData = JSON.parse(savedCustomers);
      
      // Convert to the format our component expects
      return Object.keys(customerData).map(id => {
        const customer = customerData[id];
        return {
          id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          lastAppointment: '2023-04-01',
          totalVisits: 8,
          totalSpent: 960,
          status: 'active' as const,
        };
      });
    }
  } catch (error) {
    console.error('Error loading customers from localStorage:', error);
  }
  
  // Fallback to default customers if no saved data or error
  return [
    {
      id: '1',
      name: 'שרה כהן',
      email: 'sarah.j@example.com',
      phone: '(555) 123-4567',
      lastAppointment: '2023-04-01',
      totalVisits: 8,
      totalSpent: 960,
      status: 'active' as const,
    },
    {
      id: '2',
      name: 'אמילי דייויס',
      email: 'emily.d@example.com',
      phone: '(555) 987-6543',
      lastAppointment: '2023-03-25',
      totalVisits: 12,
      totalSpent: 1440,
      status: 'active' as const,
    },
    {
      id: '3',
      name: 'ליאת ונג',
      email: 'lisa.w@example.com',
      phone: '(555) 456-7890',
      lastAppointment: '2023-04-02',
      totalVisits: 5,
      totalSpent: 600,
      status: 'active' as const,
    },
    {
      id: '4',
      name: 'מריה גארסיה',
      email: 'maria.g@example.com',
      phone: '(555) 234-5678',
      lastAppointment: '2023-02-15',
      totalVisits: 3,
      totalSpent: 360,
      status: 'inactive' as const,
    },
    {
      id: '5',
      name: 'ג\'ניפר מילר',
      email: 'jennifer.m@example.com',
      phone: '(555) 876-5432',
      lastAppointment: '2023-03-10',
      totalVisits: 7,
      totalSpent: 840,
      status: 'active' as const,
    },
  ];
};

const Customers = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState(getInitialCustomers());

  // Effect to refresh the customers list when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setCustomers(getInitialCustomers());
    };

    // Listen for storage events
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleEditCustomer = (id: string) => {
    navigate(`/customers/edit/${id}`);
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
