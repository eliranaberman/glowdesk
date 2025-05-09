
import { useState, useEffect } from 'react';
import CustomerTable from './CustomerTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CustomerAddModal from './CustomerAddModal';
import CustomerSearch from './CustomerSearch';

interface CustomerListViewProps {
  customers?: any[];
  onError: (error: string) => void;
  onDeleteCustomer?: (id: string) => void;
}

const CustomerListView = ({ 
  customers = [], 
  onError,
  onDeleteCustomer 
}: CustomerListViewProps) => {
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filteredCustomers, setFilteredCustomers] = useState(customers);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCustomers(customers);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = customers.filter(customer => 
      (customer.full_name && customer.full_name.toLowerCase().includes(query)) ||
      (customer.phone_number && customer.phone_number.includes(query)) ||
      (customer.phone && customer.phone.includes(query)) ||
      (customer.email && customer.email.toLowerCase().includes(query))
    );
    
    setFilteredCustomers(filtered);
  }, [searchQuery, customers]);

  const handleAddCustomer = () => {
    setIsAddModalOpen(true);
  };

  const handleDeleteCustomer = (id: string) => {
    if (onDeleteCustomer) {
      onDeleteCustomer(id);
    }
  };

  const handleAddSuccess = () => {
    // Reload customers list via parent component
    if (onDeleteCustomer) {
      onDeleteCustomer("refresh"); // Using this as a signal to refresh the list
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <CustomerSearch onSearch={handleSearch} initialValue={searchQuery} />
        
        <Button onClick={handleAddCustomer} className="flex items-center gap-2 whitespace-nowrap">
          <Plus size={16} />
          הוסף לקוח/ה
        </Button>
      </div>

      <CustomerTable 
        customers={filteredCustomers} 
        onDelete={handleDeleteCustomer}
        searchQuery={searchQuery}
      />
      
      <CustomerAddModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />
    </div>
  );
};

export default CustomerListView;
