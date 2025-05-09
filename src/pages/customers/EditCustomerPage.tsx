
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import CustomerEditForm from '@/components/customers/CustomerEditForm';

const EditCustomerPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="text-right">
      <Helmet>
        <title>עריכת פרטי לקוח | Chen Mizrahi</title>
      </Helmet>

      <Button 
        onClick={() => navigate('/customers')} 
        variant="back" 
        className="mb-4 flex gap-2"
      >
        <ChevronRight className="h-4 w-4" />
        חזרה לרשימת הלקוחות
      </Button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">עריכת פרטי לקוח</h1>
        <p className="text-muted-foreground">
          עדכן את פרטי הלקוח השמורים במערכת
        </p>
      </div>
      
      <CustomerEditForm />
    </div>
  );
};

export default EditCustomerPage;
