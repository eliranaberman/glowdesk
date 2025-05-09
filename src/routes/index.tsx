
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Layout from '@/components/layout/Layout';
import Dashboard from '@/pages/Dashboard';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import ResetPassword from '@/pages/auth/ResetPassword';
import NotFound from '@/pages/NotFound';
import Index from '@/pages/Index';
import Expenses from '@/pages/Expenses';
import Inventory from '@/pages/Inventory';
import NewInventoryItem from '@/pages/inventory/NewInventoryItem';
import Tasks from '@/pages/Tasks';
import Scheduling from '@/pages/Scheduling';
import NewAppointment from '@/pages/scheduling/NewAppointment';
import EditAppointment from '@/pages/scheduling/EditAppointment';
import Reports from '@/pages/Reports';
import Settings from '@/pages/Settings';
import LoyaltyPage from '@/pages/LoyaltyPage';
import SocialMedia from '@/pages/SocialMedia';
import SocialMediaMeta from '@/pages/SocialMediaMeta';
import AIAssistant from '@/pages/AIAssistant';
import Notifications from '@/pages/Notifications';
import PortfolioPage from '@/pages/PortfolioPage';
import MarketingTemplates from '@/pages/marketing/MarketingTemplates';
import NewTemplateForm from '@/pages/marketing/NewTemplateForm';
import EditTemplateForm from '@/pages/marketing/EditTemplateForm';
import MarketingPage from '@/pages/marketing/MarketingPage';
import NewCampaignForm from '@/pages/marketing/NewCampaignForm';
import EditCampaignForm from '@/pages/marketing/EditCampaignForm';
import ClientsPage from '@/pages/clients/ClientsPage';
import NewClientPage from '@/pages/clients/NewClientPage';
import EditClientPage from '@/pages/clients/EditClientPage';
import ClientDetailPage from '@/pages/clients/ClientDetailPage';
import NewActivityPage from '@/pages/clients/NewActivityPage';
import CashFlow from '@/pages/finances/CashFlow';
import BusinessInsights from '@/pages/finances/BusinessInsights';
import FinancialReports from '@/pages/finances/FinancialReports';
import NewPayment from '@/pages/payments/NewPayment';
import OnlineBooking from '@/pages/OnlineBooking';
import UserManagement from '@/pages/UserManagement';
import UserRolesPage from '@/pages/UserRolesPage';
import UserProfilePage from '@/pages/UserProfilePage';
import InitialSetupPage from '@/pages/InitialSetupPage';
import { ReactNode } from 'react';

interface RouteConfig {
  path: string;
  element: ReactNode;
}

// Public routes (accessible to unauthenticated users)
export const publicRoutes: RouteConfig[] = [
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
    path: '/',
    element: <Index />,
  },
];

// Protected routes (require authentication)
// These will be nested inside the Layout component
export const protectedRoutes = [
  {
    path: '/dashboard',
    element: <Dashboard />,
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
    path: '/settings',
    element: <Settings />,
  },
  {
    path: '/loyalty',
    element: <LoyaltyPage />,
  },
  {
    path: '/online-booking',
    element: <OnlineBooking />,
  },
  {
    path: '/social-media',
    element: <SocialMedia />,
  },
  {
    path: '/social-media-meta',
    element: <SocialMediaMeta />,
  },
  {
    path: '/portfolio',
    element: <PortfolioPage />,
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
    path: '/marketing/templates/edit/:id',
    element: <EditTemplateForm />,
  },
  {
    path: '/marketing/campaigns',
    element: <MarketingPage />,
  },
  {
    path: '/marketing/campaigns/new',
    element: <NewCampaignForm />,
  },
  {
    path: '/marketing/campaigns/edit/:id',
    element: <EditCampaignForm />,
  },
  {
    path: '/finances/cash-flow',
    element: <CashFlow />,
  },
  {
    path: '/finances/insights',
    element: <BusinessInsights />,
  },
  {
    path: '/finances/reports',
    element: <FinancialReports />,
  },
  {
    path: '/payments/new',
    element: <NewPayment />,
  },
  {
    path: '/ai-assistant',
    element: <AIAssistant />,
  },
  {
    path: '/notifications',
    element: <Notifications />,
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
    path: '/setup',
    element: <InitialSetupPage />,
  },
];

// Fallback route (404)
export const fallbackRoute: RouteConfig = {
  path: '*',
  element: <NotFound />,
};

// Create a layout wrapper for protected routes
const ProtectedLayout = () => {
  return (
    <ProtectedRoute>
      <Layout>
        <Outlet />
      </Layout>
    </ProtectedRoute>
  );
};

// Create the router with proper nesting for protected routes
const router = createBrowserRouter([
  // Public routes (no layout)
  ...publicRoutes,
  
  // Protected routes with layout
  {
    element: <ProtectedLayout />,
    children: protectedRoutes
  },
  
  // Fallback route
  fallbackRoute
]);

// Main Router component
export default function Router() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
