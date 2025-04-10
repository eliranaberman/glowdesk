
import CustomerDetailView from '@/components/customers/CustomerDetailView';
import { Helmet } from 'react-helmet-async';

const ViewCustomer = () => {
  return (
    <div>
      <Helmet>
        <title>פרטי לקוח | Chen Mizrahi</title>
      </Helmet>

      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">פרטי לקוח</h1>
        <p className="text-muted-foreground">
          צפה בכל המידע אודות הלקוח
        </p>
      </div>

      <CustomerDetailView />
    </div>
  );
};

export default ViewCustomer;
