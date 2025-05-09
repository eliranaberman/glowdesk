
import { useState } from 'react';
import CustomerTable from './CustomerTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CustomerListViewProps {
  customers?: any[];
  onError: (error: string) => void;
}

const CustomerListView = ({ customers = [], onError }: CustomerListViewProps) => {
  const navigate = useNavigate();
  
  const handleAddCustomer = () => {
    navigate('/customers/new');
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

      <CustomerTable customers={customers} />
    </div>
  );
};

export default CustomerListView;
