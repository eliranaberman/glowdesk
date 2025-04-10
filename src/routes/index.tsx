
import { Navigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Dashboard from "@/pages/Dashboard";
import Customers from "@/pages/Customers";
import NewCustomer from "@/pages/customers/NewCustomer";
import EditCustomer from "@/pages/customers/EditCustomer";
import Scheduling from "@/pages/Scheduling";
import NewAppointment from "@/pages/scheduling/NewAppointment";
import EditAppointment from "@/pages/scheduling/EditAppointment";
import Reports from "@/pages/Reports";
import Inventory from "@/pages/Inventory";
import NewInventoryItem from "@/pages/inventory/NewInventoryItem";
import Tasks from "@/pages/Tasks";
import OnlineBooking from "@/pages/OnlineBooking";
import NotFound from "@/pages/NotFound";
import Settings from "@/pages/Settings";
import Notifications from "@/pages/Notifications";
import NewPayment from "@/pages/payments/NewPayment";
import Expenses from "@/pages/Expenses";
import SocialMedia from "@/pages/SocialMedia";
import LoyaltyPage from "@/pages/LoyaltyPage";
import CashFlow from "@/pages/finances/CashFlow";
import BusinessInsights from "@/pages/finances/BusinessInsights";
import MarketingTemplates from "@/pages/marketing/MarketingTemplates";
import FinancialReports from "@/pages/finances/FinancialReports";
import UserManagement from "@/pages/UserManagement";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import ProtectedRouteWrapper from "@/components/auth/ProtectedRouteWrapper";

export const authRoutes = [
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password", element: <ResetPassword /> },
];

// Helper function to wrap components with Layout and ProtectedRouteWrapper
const wrapWithLayout = (Component: React.ComponentType) => (
  <ProtectedRouteWrapper>
    <Layout>
      <Component />
    </Layout>
  </ProtectedRouteWrapper>
);

export const protectedRoutes = [
  { path: "/", element: <Navigate to="/dashboard" replace /> },
  { path: "/dashboard", element: wrapWithLayout(Dashboard) },
  { path: "/customers", element: wrapWithLayout(Customers) },
  { path: "/customers/new", element: wrapWithLayout(NewCustomer) },
  { path: "/customers/edit/:id", element: wrapWithLayout(EditCustomer) },
  { path: "/scheduling", element: wrapWithLayout(Scheduling) },
  { path: "/scheduling/new", element: wrapWithLayout(NewAppointment) },
  { path: "/scheduling/edit/:id", element: wrapWithLayout(EditAppointment) },
  { path: "/reports", element: wrapWithLayout(Reports) },
  { path: "/inventory", element: wrapWithLayout(Inventory) },
  { path: "/inventory/new", element: wrapWithLayout(NewInventoryItem) },
  { path: "/expenses", element: wrapWithLayout(Expenses) },
  { path: "/tasks", element: wrapWithLayout(Tasks) },
  { path: "/social-media", element: wrapWithLayout(SocialMedia) },
  { path: "/loyalty", element: wrapWithLayout(LoyaltyPage) },
  { path: "/notifications", element: wrapWithLayout(Notifications) },
  { path: "/settings", element: wrapWithLayout(Settings) },
  { path: "/online-booking", element: wrapWithLayout(OnlineBooking) },
  { path: "/payments/new", element: wrapWithLayout(NewPayment) },
  { path: "/user-management", element: wrapWithLayout(UserManagement) },
  { path: "/finances/cash-flow", element: wrapWithLayout(CashFlow) },
  { path: "/finances/insights", element: wrapWithLayout(BusinessInsights) },
  { path: "/finances/reports", element: wrapWithLayout(FinancialReports) },
  { path: "/marketing/templates", element: wrapWithLayout(MarketingTemplates) },
];

export const fallbackRoute = { path: "*", element: <NotFound /> };

export const allRoutes = [...authRoutes, ...protectedRoutes, fallbackRoute];
