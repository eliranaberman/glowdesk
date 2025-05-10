
import React from 'react';
import { createBrowserRouter, RouteObject } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { AuthLayout, createMainRoutes, notFoundRoute } from './routeUtils';
import { authRoutes } from './authRoutes';
import { customerRoutes } from './customerRoutes';
import { clientRoutes } from './clientRoutes';
import { schedulingRoutes } from './schedulingRoutes';
import { managementRoutes } from './managementRoutes';
import { marketingRoutes } from './marketingRoutes';
import { financeRoutes } from './financeRoutes';
import { publicRoutes } from './publicRoutes';

// Combine all protected routes
const createProtectedRoutes = () => {
  // Combine all the routes that need authentication
  return [
    ...customerRoutes,
    ...clientRoutes,
    ...schedulingRoutes,
    ...managementRoutes,
    ...marketingRoutes,
    ...financeRoutes,
  ];
};

// Create the main routes structure
const mainRoutes = createMainRoutes(<Outlet />);

// Add all protected routes to the main routes structure
if (mainRoutes.children) {
  // Find the protected routes container (the one with ProtectedRouteWrapper)
  const protectedRoutesContainer = mainRoutes.children.find(
    route => route.path === '/' && route.element
  );

  // Add all protected routes to the container
  if (protectedRoutesContainer && protectedRoutesContainer.children) {
    // Ensure all routes added here are properly typed with required path
    protectedRoutesContainer.children.push(
      ...createProtectedRoutes().filter(route => route.path !== undefined)
    );
  }

  // Add public routes directly to the main layout
  // Filter out any routes without a path
  const validPublicRoutes = publicRoutes.filter(route => route.path !== undefined);
  mainRoutes.children.push(...validPublicRoutes);
}

// Create the final routes array
const routes: RouteObject[] = [
  {
    element: <AuthLayout />,
    children: [
      mainRoutes,
      ...authRoutes,
      notFoundRoute,
    ]
  }
];

const router = createBrowserRouter(routes);

export default router;
