
import { useState } from 'react';
import CustomerTable from './CustomerTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CustomerAddModal from './CustomerAddModal';

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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div></div>
        <Button onClick={handleAddCustomer} className="flex items-center gap-2">
          <Plus size={16} />
          הוסף לקוח/ה
        </Button>
      </div>

      <CustomerTable 
        customers={customers} 
        onDelete={handleDeleteCustomer}
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
