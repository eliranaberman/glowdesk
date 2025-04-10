
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import NewCustomer from "./pages/customers/NewCustomer";
import EditCustomer from "./pages/customers/EditCustomer";
import Scheduling from "./pages/Scheduling";
import NewAppointment from "./pages/scheduling/NewAppointment";
import EditAppointment from "./pages/scheduling/EditAppointment";
import Reports from "./pages/Reports";
import Inventory from "./pages/Inventory";
import NewInventoryItem from "./pages/inventory/NewInventoryItem";
import Tasks from "./pages/Tasks";
import OnlineBooking from "./pages/OnlineBooking";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
import NewPayment from "./pages/payments/NewPayment";
import Expenses from "./pages/Expenses";
import SocialMedia from "./pages/SocialMedia";
import LoyaltyPage from "./pages/LoyaltyPage";
import CashFlow from "./pages/finances/CashFlow";
import BusinessInsights from "./pages/finances/BusinessInsights";
import MarketingTemplates from "./pages/marketing/MarketingTemplates";
import FinancialReports from "./pages/finances/FinancialReports";

// Auth pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Auth context
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <div className="rtl text-right">
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              
              {/* Protected Routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/customers" element={
                <ProtectedRoute>
                  <Layout>
                    <Customers />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/customers/new" element={
                <ProtectedRoute>
                  <Layout>
                    <NewCustomer />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/customers/edit/:id" element={
                <ProtectedRoute>
                  <Layout>
                    <EditCustomer />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/scheduling" element={
                <ProtectedRoute>
                  <Layout>
                    <Scheduling />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/scheduling/new" element={
                <ProtectedRoute>
                  <Layout>
                    <NewAppointment />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/scheduling/edit/:id" element={
                <ProtectedRoute>
                  <Layout>
                    <EditAppointment />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/reports" element={
                <ProtectedRoute>
                  <Layout>
                    <Reports />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/inventory" element={
                <ProtectedRoute>
                  <Layout>
                    <Inventory />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/inventory/new" element={
                <ProtectedRoute>
                  <Layout>
                    <NewInventoryItem />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/expenses" element={
                <ProtectedRoute>
                  <Layout>
                    <Expenses />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/tasks" element={
                <ProtectedRoute>
                  <Layout>
                    <Tasks />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/social-media" element={
                <ProtectedRoute>
                  <Layout>
                    <SocialMedia />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/loyalty" element={
                <ProtectedRoute>
                  <Layout>
                    <LoyaltyPage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/notifications" element={
                <ProtectedRoute>
                  <Layout>
                    <Notifications />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Layout>
                    <Settings />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/online-booking" element={
                <ProtectedRoute>
                  <Layout>
                    <OnlineBooking />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/payments/new" element={
                <ProtectedRoute>
                  <Layout>
                    <NewPayment />
                  </Layout>
                </ProtectedRoute>
              } />
              {/* Financial pages */}
              <Route path="/finances/cash-flow" element={
                <ProtectedRoute>
                  <Layout>
                    <CashFlow />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/finances/insights" element={
                <ProtectedRoute>
                  <Layout>
                    <BusinessInsights />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/finances/reports" element={
                <ProtectedRoute>
                  <Layout>
                    <FinancialReports />
                  </Layout>
                </ProtectedRoute>
              } />
              {/* Marketing pages */}
              <Route path="/marketing/templates" element={
                <ProtectedRoute>
                  <Layout>
                    <MarketingTemplates />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
