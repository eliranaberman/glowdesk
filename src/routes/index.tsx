
import React from 'react';
import { createBrowserRouter, RouteObject } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { AuthLayout, createMainRoutes, notFoundRoute } from './routeUtils';
import { authRoutes } from './authRoutes';
import { customerRoutes } from './customerRoutes';
import { clientRoutes } from './clientRoutes';
import { schedulingRoutes, schedulingPublicRoutes } from './schedulingRoutes';
import { managementRoutes } from './managementRoutes';
import { marketingRoutes } from './marketingRoutes';
import { financeRoutes } from './financeRoutes';
import { publicRoutes } from './publicRoutes';

// Combine all protected routes
const createProtectedRoutes = (): RouteObject[] => {
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
    route => route.path === '/' && route.element && React.isValidElement(route.element)
  ) as RouteObject;

  // Add all protected routes to the container
  if (protectedRoutesContainer && protectedRoutesContainer.children) {
    protectedRoutesContainer.children = [
      ...protectedRoutesContainer.children,
      ...createProtectedRoutes()
    ];
  }

  // Add public routes directly to the main layout
  // Include both the regular public routes and the public scheduling routes
  mainRoutes.children = [
    ...mainRoutes.children,
    ...publicRoutes,
    ...schedulingPublicRoutes
  ];
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
