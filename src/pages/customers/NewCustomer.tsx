
import CustomerForm from '@/components/customers/CustomerForm';
import { Helmet } from 'react-helmet-async';

const NewCustomer = () => {
  return (
    <div>
      <Helmet>
        <title>הוספת לקוח חדש | Chen Mizrahi</title>
      </Helmet>

      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">הוספת לקוח חדש</h1>
        <p className="text-muted-foreground">
          הזן את פרטי הלקוח החדש
        </p>
      </div>

      <CustomerForm />
    </div>
  );
};

export default NewCustomer;
