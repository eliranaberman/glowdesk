import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
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

// Auth routes (accessible to unauthenticated users)
export const authRoutes: RouteConfig[] = [
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
export const protectedRoutes: RouteConfig[] = [
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/clients',
    element: (
      <ProtectedRoute>
        <ClientsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/clients/new',
    element: (
      <ProtectedRoute>
        <NewClientPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/clients/:id',
    element: (
      <ProtectedRoute>
        <ClientDetailPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/clients/:id/edit',
    element: (
      <ProtectedRoute>
        <EditClientPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/clients/:id/activity/new',
    element: (
      <ProtectedRoute>
        <NewActivityPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/scheduling',
    element: (
      <ProtectedRoute>
        <Scheduling />
      </ProtectedRoute>
    ),
  },
  {
    path: '/scheduling/new',
    element: (
      <ProtectedRoute>
        <NewAppointment />
      </ProtectedRoute>
    ),
  },
  {
    path: '/scheduling/edit/:id',
    element: (
      <ProtectedRoute>
        <EditAppointment />
      </ProtectedRoute>
    ),
  },
  {
    path: '/tasks',
    element: (
      <ProtectedRoute>
        <Tasks />
      </ProtectedRoute>
    ),
  },
  {
    path: '/inventory',
    element: (
      <ProtectedRoute>
        <Inventory />
      </ProtectedRoute>
    ),
  },
  {
    path: '/inventory/new',
    element: (
      <ProtectedRoute>
        <NewInventoryItem />
      </ProtectedRoute>
    ),
  },
  {
    path: '/expenses',
    element: (
      <ProtectedRoute>
        <Expenses />
      </ProtectedRoute>
    ),
  },
  {
    path: '/reports',
    element: (
      <ProtectedRoute>
        <Reports />
      </ProtectedRoute>
    ),
  },
  {
    path: '/settings',
    element: (
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    ),
  },
  {
    path: '/loyalty',
    element: (
      <ProtectedRoute>
        <LoyaltyPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/online-booking',
    element: (
      <ProtectedRoute>
        <OnlineBooking />
      </ProtectedRoute>
    ),
  },
  {
    path: '/social-media',
    element: (
      <ProtectedRoute>
        <SocialMedia />
      </ProtectedRoute>
    ),
  },
  {
    path: '/social-media-meta',
    element: (
      <ProtectedRoute>
        <SocialMediaMeta />
      </ProtectedRoute>
    ),
  },
  {
    path: '/portfolio',
    element: (
      <ProtectedRoute>
        <PortfolioPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/marketing/templates',
    element: (
      <ProtectedRoute>
        <MarketingTemplates />
      </ProtectedRoute>
    ),
  },
  {
    path: '/marketing/templates/new',
    element: (
      <ProtectedRoute>
        <NewTemplateForm />
      </ProtectedRoute>
    ),
  },
  {
    path: '/marketing/templates/edit/:id',
    element: (
      <ProtectedRoute>
        <EditTemplateForm />
      </ProtectedRoute>
    ),
  },
  {
    path: '/marketing/campaigns',
    element: (
      <ProtectedRoute>
        <MarketingPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/marketing/campaigns/new',
    element: (
      <ProtectedRoute>
        <NewCampaignForm />
      </ProtectedRoute>
    ),
  },
  {
    path: '/marketing/campaigns/edit/:id',
    element: (
      <ProtectedRoute>
        <EditCampaignForm />
      </ProtectedRoute>
    ),
  },
  {
    path: '/finances/cash-flow',
    element: (
      <ProtectedRoute>
        <CashFlow />
      </ProtectedRoute>
    ),
  },
  {
    path: '/finances/insights',
    element: (
      <ProtectedRoute>
        <BusinessInsights />
      </ProtectedRoute>
    ),
  },
  {
    path: '/finances/reports',
    element: (
      <ProtectedRoute>
        <FinancialReports />
      </ProtectedRoute>
    ),
  },
  {
    path: '/payments/new',
    element: (
      <ProtectedRoute>
        <NewPayment />
      </ProtectedRoute>
    ),
  },
  {
    path: '/ai-assistant',
    element: (
      <ProtectedRoute>
        <AIAssistant />
      </ProtectedRoute>
    ),
  },
  {
    path: '/notifications',
    element: (
      <ProtectedRoute>
        <Notifications />
      </ProtectedRoute>
    ),
  },
  {
    path: '/users',
    element: (
      <ProtectedRoute>
        <UserManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: '/user-roles',
    element: (
      <ProtectedRoute>
        <UserRolesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/user-profile',
    element: (
      <ProtectedRoute>
        <UserProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/setup',
    element: (
      <ProtectedRoute>
        <InitialSetupPage />
      </ProtectedRoute>
    ),
  },
];

// Fallback route (404)
export const fallbackRoute: RouteConfig = {
  path: '*',
  element: <NotFound />,
};

// Create the router with all routes
const router = createBrowserRouter([
  ...authRoutes,
  ...protectedRoutes,
  fallbackRoute
]);

// We keep the original Router export for backward compatibility 
// and to avoid breaking existing imports
export default function Router() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
