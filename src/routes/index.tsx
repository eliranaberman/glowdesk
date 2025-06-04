
import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Public pages
import Index from '@/pages/Index';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import ResetPassword from '@/pages/auth/ResetPassword';
import NotFound from '@/pages/NotFound';

// Protected pages
import Dashboard from '@/pages/Dashboard';
import Scheduling from '@/pages/Scheduling';
import ClientsPage from '@/pages/clients/ClientsPage';
import PortfolioPage from '@/pages/PortfolioPage';
import Tasks from '@/pages/Tasks';
import Inventory from '@/pages/Inventory';
import Expenses from '@/pages/Expenses';
import Reports from '@/pages/Reports';
import Settings from '@/pages/Settings';
import UserManagement from '@/pages/UserManagement';

// Add more protected routes as needed
import NewClientPage from '@/pages/clients/NewClientPage';
import ClientDetailPage from '@/pages/clients/ClientDetailPage';
import EditClientPage from '@/pages/clients/EditClientPage';
import NewActivityPage from '@/pages/clients/NewActivityPage';
import NewAppointment from '@/pages/scheduling/NewAppointment';
import EditAppointment from '@/pages/scheduling/EditAppointment';
import NewInventoryItem from '@/pages/inventory/NewInventoryItem';
import MarketingPage from '@/pages/marketing/MarketingPage';
import SocialMedia from '@/pages/SocialMedia';
import UserRolesPage from '@/pages/UserRolesPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/reset-password',
    element: <ResetPassword />,
  },
  {
    path: '/app',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
      {
        path: '/scheduling',
        element: <Scheduling />,
      },
      {
        path: '/scheduling/new',
        element: <NewAppointment />,
      },
      {
        path: '/scheduling/edit/:id',
        element: <EditAppointment />,
      },
      {
        path: '/clients',
        element: <ClientsPage />,
      },
      {
        path: '/clients/new',
        element: <NewClientPage />,
      },
      {
        path: '/clients/:id',
        element: <ClientDetailPage />,
      },
      {
        path: '/clients/:id/edit',
        element: <EditClientPage />,
      },
      {
        path: '/clients/:id/activity/new',
        element: <NewActivityPage />,
      },
      {
        path: '/portfolio',
        element: <PortfolioPage />,
      },
      {
        path: '/tasks',
        element: <Tasks />,
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
        path: '/expenses',
        element: <Expenses />,
      },
      {
        path: '/reports',
        element: <Reports />,
      },
      {
        path: '/marketing',
        element: <MarketingPage />,
      },
      {
        path: '/social-media',
        element: <SocialMedia />,
      },
      {
        path: '/user-management',
        element: <UserManagement />,
      },
      {
        path: '/user-roles',
        element: <UserRolesPage />,
      },
      {
        path: '/settings',
        element: <Settings />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
