
import { RouteObject } from 'react-router-dom';
import Settings from '../pages/Settings';
import Expenses from '../pages/Expenses';
import Inventory from '../pages/Inventory';
import NewInventoryItem from '../pages/inventory/NewInventoryItem';
import Tasks from '../pages/Tasks';
import Notifications from '../pages/Notifications';
import LoyaltyPage from '../pages/LoyaltyPage';
import Reports from '../pages/Reports';
import UserManagement from '../pages/UserManagement';
import UserRolesPage from '../pages/UserRolesPage';
import UserProfilePage from '../pages/UserProfilePage';
import AIAssistant from '../pages/AIAssistant';
import NewPayment from '../pages/payments/NewPayment';

export const managementRoutes: RouteObject[] = [
  {
    path: '/settings',
    element: <Settings />,
  },
  {
    path: '/expenses',
    element: <Expenses />,
  },
  {
    path: '/inventory',
    element: <Inventory />,
  },
  {
    path: '/inventory/new',
    element: <NewInventoryItem />,
  },
  {
    path: '/tasks',
    element: <Tasks />,
  },
  {
    path: '/notifications',
    element: <Notifications />,
  },
  {
    path: '/loyalty',
    element: <LoyaltyPage />,
  },
  {
    path: '/reports',
    element: <Reports />,
  },
  {
    path: '/users',
    element: <UserManagement />,
  },
  {
    path: '/user-roles',
    element: <UserRolesPage />,
  },
  {
    path: '/user-profile',
    element: <UserProfilePage />,
  },
  {
    path: '/ai-assistant',
    element: <AIAssistant />,
  },
  {
    path: '/payments/new',
    element: <NewPayment />,
  },
];
