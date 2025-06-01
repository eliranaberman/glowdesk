
import React from 'react';
import { Navigate, Outlet, RouteObject } from 'react-router-dom';
import { AuthProvider } from '@/contexts/auth';
import Layout from '@/components/layout/Layout';
import ProtectedRouteWrapper from '@/components/auth/ProtectedRouteWrapper';
import NotFound from '@/pages/NotFound';
import Dashboard from '@/pages/Dashboard';
import AIAssistant from '@/pages/AIAssistant';
import Tasks from '@/pages/Tasks';
import Expenses from '@/pages/Expenses';
import Reports from '@/pages/Reports';
import Notifications from '@/pages/Notifications';
import Settings from '@/pages/Settings';
import UserManagement from '@/pages/UserManagement';
import UserRolesPage from '@/pages/UserRolesPage';
import UserProfilePage from '@/pages/UserProfilePage';
import LoyaltyPage from '@/pages/LoyaltyPage';
import SocialMedia from '@/pages/SocialMedia';
import SocialMediaMeta from '@/pages/SocialMediaMeta';
import PortfolioPage from '@/pages/PortfolioPage';
import Customers from '@/pages/Customers';
import Scheduling from '@/pages/Scheduling';
import AppointmentCalendar from '@/pages/AppointmentCalendar';
import NewAppointment from '@/pages/scheduling/NewAppointment';
import EditAppointment from '@/pages/scheduling/EditAppointment';
import MarketingTemplates from '@/pages/marketing/MarketingTemplates';
import NewTemplateForm from '@/pages/marketing/NewTemplateForm';
import EditTemplateForm from '@/pages/marketing/EditTemplateForm';

// Create an AuthLayout component that provides the AuthContext
export const AuthLayout = () => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
};

// Default auth settings for most routes
export const defaultProtectedRouteProps = {
  isAuthenticated: true,
  authenticationPath: '/login',
  redirectPath: '/dashboard',
  setRedirectPath: () => {},
};

// Define a type for the children prop to be more specific
type ChildrenProp = React.ReactNode;

// Create main application layout with protected routes
export const createMainRoutes = (children: ChildrenProp): RouteObject => ({
  path: '/',
  element: <Layout>{children}</Layout>,
  children: [
    {
      path: '/',
      element: <Navigate to="/dashboard" replace />,
    },
    {
      // Protected routes that require authentication
      path: '/',
      element: <ProtectedRouteWrapper {...defaultProtectedRouteProps}>
        <Outlet />
      </ProtectedRouteWrapper>,
      children: [
        {
          path: '/dashboard',
          element: <Dashboard />,
        },
        {
          path: '/ai-assistant',
          element: <AIAssistant />,
        },
        {
          path: '/tasks',
          element: <Tasks />,
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
          path: '/notifications',
          element: <Notifications />,
        },
        {
          path: '/settings',
          element: <Settings />,
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
          path: '/loyalty',
          element: <LoyaltyPage />,
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
          path: '/customers',
          element: <Customers />,
        },
        {
          path: '/clients',
          element: <Customers />,
        },
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
        // The children parameter will be inserted here by index.tsx
      ]
    }
  ]
});

// Create catch-all route for 404s
export const notFoundRoute: RouteObject = {
  path: '*',
  element: <NotFound />,
};
