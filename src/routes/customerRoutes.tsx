
import { RouteObject } from 'react-router-dom';
import Customers from '../pages/Customers';
import NewCustomer from '../pages/customers/NewCustomer';
import ViewCustomer from '../pages/customers/ViewCustomer';
import EditCustomer from '../pages/customers/EditCustomerPage';

export const customerRoutes: RouteObject[] = [
  {
    path: '/customers',
    element: <Customers />,
  },
  {
    path: '/customers/new',
    element: <NewCustomer />,
  },
  {
    path: '/customers/:id',
    element: <ViewCustomer />,
  },
  {
    path: '/customers/:id/edit',
    element: <EditCustomer />,
  },
];
