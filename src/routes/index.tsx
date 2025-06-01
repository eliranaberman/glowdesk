
import React from 'react';
import { createBrowserRouter, RouteObject } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { AuthLayout, createMainRoutes, notFoundRoute } from './routeUtils';
import { authRoutes } from './authRoutes';
import { publicRoutes } from './publicRoutes';
import { schedulingPublicRoutes } from './schedulingRoutes';

// Create the main routes structure
const mainRoutes = createMainRoutes(<Outlet />);

// Add public routes directly to the main layout
if (mainRoutes.children) {
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
