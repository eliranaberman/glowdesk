
import CustomerForm from '@/components/customers/CustomerForm';
import { Helmet } from 'react-helmet-async';

const EditCustomer = () => {
  return (
    <div>
      <Helmet>
        <title>עריכת לקוח | Chen Mizrahi</title>
      </Helmet>

      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">עריכת פרטי לקוח</h1>
        <p className="text-muted-foreground">
          עדכן את פרטי הלקוח
        </p>
      </div>

      <CustomerForm isEdit />
    </div>
  );
};

export default EditCustomer;
