
import React from 'react';
import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom';

import Layout from '../components/layout/Layout';
import Dashboard from '../pages/Dashboard';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import NotFound from '../pages/NotFound';
import Customers from '../pages/Customers';
import NewCustomer from '../pages/customers/NewCustomer';
import ViewCustomer from '../pages/customers/ViewCustomer';
import EditCustomer from '../pages/customers/EditCustomerPage';
import AppointmentCalendar from '../pages/AppointmentCalendar';
import Settings from '../pages/Settings';
import NewAppointment from '../pages/scheduling/NewAppointment';
import EditAppointment from '../pages/scheduling/EditAppointment';
import Scheduling from '../pages/Scheduling';
import Expenses from '../pages/Expenses';
import Inventory from '../pages/Inventory';
import NewInventoryItem from '../pages/inventory/NewInventoryItem';
import InitialSetupPage from '../pages/InitialSetupPage';
import PortfolioPage from '../pages/PortfolioPage';
import Tasks from '../pages/Tasks';
import Notifications from '../pages/Notifications';
import ClientsPage from '../pages/clients/ClientsPage';
import NewClientPage from '../pages/clients/NewClientPage';
import ClientDetailPage from '../pages/clients/ClientDetailPage';
import EditClientPage from '../pages/clients/EditClientPage';
import NewActivityPage from '../pages/clients/NewActivityPage';
import OnlineBooking from '../pages/OnlineBooking';
import UserManagement from '../pages/UserManagement';
import UserRolesPage from '../pages/UserRolesPage';
import UserProfilePage from '../pages/UserProfilePage';
import LoyaltyPage from '../pages/LoyaltyPage';
import Reports from '../pages/Reports';
import SocialMedia from '../pages/SocialMedia';
import SocialMediaMeta from '../pages/SocialMediaMeta';
import AIAssistant from '../pages/AIAssistant';
import NewPayment from '../pages/payments/NewPayment';
import MarketingPage from '../pages/marketing/MarketingPage';
import MarketingTemplates from '../pages/marketing/MarketingTemplates';
import NewTemplateForm from '../pages/marketing/NewTemplateForm';
import EditTemplateForm from '../pages/marketing/EditTemplateForm';
import NewCampaignForm from '../pages/marketing/NewCampaignForm';
import EditCampaignForm from '../pages/marketing/EditCampaignForm';

// Import our new financial management pages
import BusinessManagement from '../pages/finances/BusinessManagement';
import Revenues from '../pages/finances/Revenues';
import CashFlow from '../pages/finances/CashFlow';
import FinancialReports from '../pages/finances/FinancialReports';
import BusinessInsights from '../pages/finances/BusinessInsights';

// Import auth wrapper
import ProtectedRouteWrapper from '../components/auth/ProtectedRouteWrapper';

// Define ProtectedRouteProps type since we can't import it
interface ProtectedRouteProps {
  isAuthenticated: boolean;
  authenticationPath: string;
  redirectPath: string;
  setRedirectPath: () => void;
}

// Default auth settings for most routes
const defaultProtectedRouteProps: ProtectedRouteProps = {
  isAuthenticated: true,
  authenticationPath: '/login',
  redirectPath: '/dashboard',
  setRedirectPath: () => {},
};

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/dashboard" replace />,
      },
      {
        // Protected routes that require authentication
        path: '/',
        element: <ProtectedRouteWrapper {...defaultProtectedRouteProps}>
          <></>
        </ProtectedRouteWrapper>,
        children: [
          {
            path: '/dashboard',
            element: <Dashboard />,
          },
          // Customer paths
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
          // Client paths
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
          // Scheduling paths
          {
            path: '/scheduling',
            element: <Scheduling />,
          },
          {
            path: '/calendar',
            element: <AppointmentCalendar />,
          },
          {
            path: '/scheduling/new',
            element: <NewAppointment />,
          },
          {
            path: '/scheduling/:id',
            element: <EditAppointment />,
          },
          // System management
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
            path: '/portfolio',
            element: <PortfolioPage />,
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
          // Social Media
          {
            path: '/social-media',
            element: <SocialMedia />,
          },
          {
            path: '/social-media/meta',
            element: <SocialMediaMeta />,
          },
          // User Management
          {
            path: '/users',
            element: <UserManagement />,
          },
          {
            path: '/users/roles',
            element: <UserRolesPage />,
          },
          {
            path: '/profile',
            element: <UserProfilePage />,
          },
          // AI Assistant
          {
            path: '/ai-assistant',
            element: <AIAssistant />,
          },
          // Payments
          {
            path: '/payments/new',
            element: <NewPayment />,
          },
          // Marketing
          {
            path: '/marketing',
            element: <MarketingPage />,
          },
          {
            path: '/marketing/templates',
            element: <MarketingTemplates />,
          },
          {
            path: '/marketing/templates/new',
            element: <NewTemplateForm />,
          },
          {
            path: '/marketing/templates/:id',
            element: <EditTemplateForm />,
          },
          {
            path: '/marketing/campaigns/new',
            element: <NewCampaignForm />,
          },
          {
            path: '/marketing/campaigns/:id',
            element: <EditCampaignForm />,
          },
          // Financial Management (new)
          {
            path: '/finances',
            element: <BusinessManagement />,
          },
          {
            path: '/finances/revenues',
            element: <Revenues />,
          },
          {
            path: '/finances/cashflow',
            element: <CashFlow />,
          },
          {
            path: '/finances/reports',
            element: <FinancialReports />,
          },
          {
            path: '/finances/insights',
            element: <BusinessInsights />,
          },
        ],
      },
      // Public routes (setup wizard)
      {
        path: '/setup',
        element: <InitialSetupPage />,
      },
      // Public Online Booking
      {
        path: '/online-booking',
        element: <OnlineBooking />,
      },
    ],
  },
  // Authentication routes (outside the main layout)
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
  // Catch-all for 404s
  {
    path: '*',
    element: <NotFound />,
  },
];

const router = createBrowserRouter(routes);

export default router;
