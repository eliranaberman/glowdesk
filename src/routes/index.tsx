
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

// Import all the main pages
import Dashboard from '../pages/Dashboard';
import AIAssistant from '../pages/AIAssistant';
import Tasks from '../pages/Tasks';
import Expenses from '../pages/Expenses';
import Reports from '../pages/Reports';
import Notifications from '../pages/Notifications';
import Settings from '../pages/Settings';
import UserManagement from '../pages/UserManagement';
import UserRolesPage from '../pages/UserRolesPage';
import UserProfilePage from '../pages/UserProfilePage';
import LoyaltyPage from '../pages/LoyaltyPage';
import SocialMedia from '../pages/SocialMedia';
import SocialMediaMeta from '../pages/SocialMediaMeta';
import PortfolioPage from '../pages/PortfolioPage';

// Create additional main routes for pages that should be directly accessible
const additionalMainRoutes: RouteObject[] = [
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
];

// Combine all protected routes
const createProtectedRoutes = (): RouteObject[] => {
  // Combine all the routes that need authentication
  return [
    ...additionalMainRoutes,
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
