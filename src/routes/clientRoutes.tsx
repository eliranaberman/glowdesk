
import { RouteObject } from 'react-router-dom';
import ClientsPage from '../pages/clients/ClientsPage';
import NewClientPage from '../pages/clients/NewClientPage';
import ClientDetailPage from '../pages/clients/ClientDetailPage';
import EditClientPage from '../pages/clients/EditClientPage';
import NewActivityPage from '../pages/clients/NewActivityPage';

export const clientRoutes: RouteObject[] = [
  {
    path: 'clients',
    element: <ClientsPage />,
  },
  {
    path: 'clients/new',
    element: <NewClientPage />,
  },
  {
    path: 'clients/:id',
    element: <ClientDetailPage />,
  },
  {
    path: 'clients/:id/edit',
    element: <EditClientPage />,
  },
  {
    path: 'clients/:id/activity/new',
    element: <NewActivityPage />,
  },
];
