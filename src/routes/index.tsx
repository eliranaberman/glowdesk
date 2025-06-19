
import {
  createBrowserRouter,
  Outlet
} from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Dashboard from "@/pages/Dashboard";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Revenues from "@/pages/finances/Revenues";
import Expenses from "@/pages/Expenses";
import CashFlow from "@/pages/finances/CashFlow";
import Reports from "@/pages/Reports";
import BusinessManagement from "@/pages/finances/BusinessManagement";
import { ClientsPage } from "@/pages/clients/ClientsPage";
import { ClientDetailPage } from "@/pages/clients/ClientDetailPage";
import Scheduling from "@/pages/Scheduling";
import Settings from "@/pages/Settings";
import { Login } from "@/pages/auth/Login";
import { Register } from "@/pages/auth/Register";
import { ForgotPassword } from "@/pages/auth/ForgotPassword";
import { ResetPassword } from "@/pages/auth/ResetPassword";
import BusinessInsights from '@/pages/finances/BusinessInsights';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout><Outlet /></Layout>,
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/finances/revenues",
        element: (
          <ProtectedRoute>
            <Revenues />
          </ProtectedRoute>
        ),
      },
      {
        path: "/expenses",
        element: (
          <ProtectedRoute>
            <Expenses />
          </ProtectedRoute>
        ),
      },
      {
        path: "/finances/cash-flow",
        element: (
          <ProtectedRoute>
            <CashFlow />
          </ProtectedRoute>
        ),
      },
      {
        path: "/finances/reports",
        element: (
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        ),
      },
      {
        path: "/finances/business-management",
        element: (
          <ProtectedRoute>
            <BusinessManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "/clients",
        element: (
          <ProtectedRoute>
            <ClientsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/clients/:id",
        element: (
          <ProtectedRoute>
            <ClientDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/scheduling",
        element: (
          <ProtectedRoute>
            <Scheduling />
          </ProtectedRoute>
        ),
      },
      {
        path: "/settings",
        element: (
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        ),
      },
      {
        path: "/finances/business-insights",
        element: (
          <ProtectedRoute>
            <BusinessInsights />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
]);

export default router;
