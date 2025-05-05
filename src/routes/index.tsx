
import { ReactElement } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ProtectedRouteWrapper from '@/components/auth/ProtectedRouteWrapper';

// Pages
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import ResetPassword from '@/pages/auth/ResetPassword';
import Dashboard from '@/pages/Dashboard';
import Customers from '@/pages/Customers';
import NewCustomer from '@/pages/customers/NewCustomer';
import EditCustomer from '@/pages/customers/EditCustomer';
import ViewCustomer from '@/pages/customers/ViewCustomer';
import AppointmentCalendar from '@/pages/AppointmentCalendar';
import Scheduling from '@/pages/Scheduling';
import NewAppointment from '@/pages/scheduling/NewAppointment';
import EditAppointment from '@/pages/scheduling/EditAppointment';
import Reports from '@/pages/Reports';
import Inventory from '@/pages/Inventory';
import NewInventoryItem from '@/pages/inventory/NewInventoryItem';
import Expenses from '@/pages/Expenses';
import Tasks from '@/pages/Tasks';
import SocialMedia from '@/pages/SocialMedia';
import Notifications from '@/pages/Notifications';
import Settings from '@/pages/Settings';
import OnlineBooking from '@/pages/OnlineBooking';
import NewPayment from '@/pages/payments/NewPayment';
import CashFlow from '@/pages/finances/CashFlow';
import BusinessInsights from '@/pages/finances/BusinessInsights';
import PortfolioPage from '@/pages/PortfolioPage';
import NotFound from '@/pages/NotFound';
import Index from '@/pages/Index';
import MarketingPage from '@/pages/marketing/MarketingPage';
import MarketingTemplates from '@/pages/marketing/MarketingTemplates';
import NewTemplateForm from '@/pages/marketing/NewTemplateForm';
import EditTemplateForm from '@/pages/marketing/EditTemplateForm';
import NewCampaignForm from '@/pages/marketing/NewCampaignForm';
import EditCampaignForm from '@/pages/marketing/EditCampaignForm';
import LoyaltyPage from '@/pages/LoyaltyPage';
import UserManagement from '@/pages/UserManagement';
import ClientsPage from '@/pages/clients/ClientsPage';
import NewClientPage from '@/pages/clients/NewClientPage';
import EditClientPage from '@/pages/clients/EditClientPage';
import ClientDetailPage from '@/pages/clients/ClientDetailPage';
import NewActivityPage from '@/pages/clients/NewActivityPage';
import AIAssistant from '@/pages/AIAssistant';

interface RouteConfig {
  path: string;
  element: ReactElement;
}

// Public routes (no auth required)
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

// Routes that require authentication
export const protectedRoutes: RouteConfig[] = [
  {
    path: '/dashboard',
    element: (
      <ProtectedRouteWrapper>
        <Dashboard />
      </ProtectedRouteWrapper>
    ),
  },
  {
    path: '/customers',
    element: (
      <ProtectedRoute>
        <Customers />
      </ProtectedRoute>
    ),
  },
  {
    path: '/customers/new',
    element: (
      <ProtectedRoute>
        <NewCustomer />
      </ProtectedRoute>
    ),
  },
  {
    path: '/customers/edit/:id',
    element: (
      <ProtectedRoute>
        <EditCustomer />
      </ProtectedRoute>
    ),
  },
  {
    path: '/customers/:id',
    element: (
      <ProtectedRoute>
        <ViewCustomer />
      </ProtectedRoute>
    ),
  },
  {
    path: '/appointment-calendar',
    element: (
      <ProtectedRoute>
        <AppointmentCalendar />
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
    path: '/reports',
    element: (
      <ProtectedRoute>
        <Reports />
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
    path: '/tasks',
    element: (
      <ProtectedRoute>
        <Tasks />
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
    path: '/notifications',
    element: (
      <ProtectedRoute>
        <Notifications />
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
    path: '/online-booking',
    element: (
      <ProtectedRoute>
        <OnlineBooking />
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
    path: '/portfolio',
    element: (
      <ProtectedRoute>
        <PortfolioPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/marketing',
    element: (
      <ProtectedRoute>
        <MarketingPage />
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
    path: '/loyalty',
    element: (
      <ProtectedRoute>
        <LoyaltyPage />
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
    path: '/clients/edit/:id',
    element: (
      <ProtectedRoute>
        <EditClientPage />
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
    path: '/clients/:id/new-activity',
    element: (
      <ProtectedRoute>
        <NewActivityPage />
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
];

// Fallback route (404)
export const fallbackRoute: RouteConfig = {
  path: '*',
  element: <NotFound />,
};
