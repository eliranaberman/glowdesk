import {
  createBrowserRouter,
} from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Home from "@/pages/Home";
import ProtectedRoute from "./ProtectedRoute";
import Revenues from "@/pages/finances/Revenues";
import Expenses from "@/pages/Expenses";
import CashFlow from "@/pages/finances/CashFlow";
import Reports from "@/pages/finances/Reports";
import BusinessManagement from "@/pages/finances/BusinessManagement";
import Clients from "@/pages/clients/Clients";
import ClientDetails from "@/pages/clients/ClientDetails";
import Scheduling from "@/pages/scheduling/Scheduling";
import Settings from "@/pages/settings/Settings";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import Insights from "@/pages/Insights";
import DetailedInsights from "@/pages/DetailedInsights";
import BusinessInsights from '@/pages/finances/BusinessInsights';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <Home />
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
            <Clients />
          </ProtectedRoute>
        ),
      },
      {
        path: "/clients/:id",
        element: (
          <ProtectedRoute>
            <ClientDetails />
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
        path: "/insights",
        element: (
          <ProtectedRoute>
            <Insights />
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
      {
        path: "/finances/detailed-insights",
        element: (
          <ProtectedRoute>
            <DetailedInsights />
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
