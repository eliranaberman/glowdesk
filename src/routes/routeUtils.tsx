
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from '@/contexts/auth';
import Layout from '@/components/layout/Layout';
import ProtectedRouteWrapper from '@/components/auth/ProtectedRouteWrapper';
import NotFound from '@/pages/NotFound';
import Dashboard from '@/pages/Dashboard';

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

// Create main application layout with protected routes
export const createMainRoutes = (children: React.ReactNode) => ({
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
      ]
    }
  ]
});

// Create catch-all route for 404s
export const notFoundRoute = {
  path: '*',
  element: <NotFound />,
};
