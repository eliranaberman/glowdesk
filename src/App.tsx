import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { useEffect, Suspense } from "react";
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
import UserManagement from "./pages/UserManagement";

// Auth pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Auth context
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRouteWrapper from "./components/auth/ProtectedRouteWrapper";

console.log("🔄 App component is being loaded");

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  useEffect(() => {
    console.log("🔄 App component mounted");
    
    // Check if we're on the root route
    if (window.location.pathname === '/') {
      console.log("📍 Currently on root route");
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="rtl text-right">
          <Toaster />
          <Sonner />
          <HelmetProvider>
            <Suspense fallback={<div>Loading...</div>}>
              <BrowserRouter>
                <AuthProvider>
                  <Routes>
                    {/* Auth Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    
                    {/* Protected Routes */}
                    <Route 
                      path="/" 
                      element={
                        <ProtectedRouteWrapper>
                          <Layout>
                            <Dashboard />
                          </Layout>
                        </ProtectedRouteWrapper>
                      } 
                    />
                  <Route path="/customers" element={
                    <ProtectedRouteWrapper>
                      <Layout>
                        <Customers />
                      </Layout>
                    </ProtectedRouteWrapper>
                  } />
                  <Route path="/customers/new" element={
                    <ProtectedRouteWrapper>
                      <Layout>
                        <NewCustomer />
                      </Layout>
                    </ProtectedRouteWrapper>
                  } />
                  <Route path="/customers/edit/:id" element={
                    <ProtectedRouteWrapper>
                      <Layout>
                        <EditCustomer />
                      </Layout>
                    </ProtectedRouteWrapper>
                  } />
                  <Route path="/scheduling" element={
                    <ProtectedRouteWrapper>
                      <Layout>
                        <Scheduling />
                      </Layout>
                    </ProtectedRouteWrapper>
                  } />
                  <Route path="/scheduling/new" element={
                    <ProtectedRouteWrapper>
                      <Layout>
                        <NewAppointment />
                      </Layout>
                    </ProtectedRouteWrapper>
                  } />
                  <Route path="/scheduling/edit/:id" element={
                    <ProtectedRouteWrapper>
                      <Layout>
                        <EditAppointment />
                      </Layout>
                    </ProtectedRouteWrapper>
                  } />
                  <Route path="/reports" element={
                    <ProtectedRouteWrapper>
                      <Layout>
                        <Reports />
                      </Layout>
                    </ProtectedRouteWrapper>
                  } />
                  <Route path="/inventory" element={
                    <ProtectedRouteWrapper>
                      <Layout>
                        <Inventory />
                      </Layout>
                    </ProtectedRouteWrapper>
                  } />
                  <Route path="/inventory/new" element={
                    <ProtectedRouteWrapper>
                      <Layout>
                        <NewInventoryItem />
                      </Layout>
                    </ProtectedRouteWrapper>
                  } />
                  <Route path="/expenses" element={
                    <ProtectedRouteWrapper>
                      <Layout>
                        <Expenses />
                      </Layout>
                    </ProtectedRouteWrapper>
                  } />
                  <Route path="/tasks" element={
                    <ProtectedRouteWrapper>
                      <Layout>
                        <Tasks />
                      </Layout>
                    </ProtectedRouteWrapper>
                  } />
                  <Route path="/social-media" element={
                    <ProtectedRouteWrapper>
                      <Layout>
                        <SocialMedia />
                      </Layout>
                    </ProtectedRouteWrapper>
                  } />
                  <Route path="/loyalty" element={
                    <ProtectedRouteWrapper>
                      <Layout>
                        <LoyaltyPage />
                      </Layout>
                    </ProtectedRouteWrapper>
                  } />
                  <Route path="/notifications" element={
                    <ProtectedRouteWrapper>
                      <Layout>
                        <Notifications />
                      </Layout>
                    </ProtectedRouteWrapper>
                  } />
                  <Route path="/settings" element={
                    <ProtectedRouteWrapper>
                      <Layout>
                        <Settings />
                      </Layout>
                    </ProtectedRouteWrapper>
                  } />
                  <Route path="/online-booking" element={
                    <ProtectedRouteWrapper>
                      <Layout>
                        <OnlineBooking />
                      </Layout>
                    </ProtectedRouteWrapper>
                  } />
                  <Route path="/payments/new" element={
                    <ProtectedRouteWrapper>
                      <Layout>
                        <NewPayment />
                      </Layout>
                    </ProtectedRouteWrapper>
                  } />
                  <Route path="/user-management" element={
                    <ProtectedRouteWrapper>
                      <Layout>
                        <UserManagement />
                      </Layout>
                    </ProtectedRouteWrapper>
                  } />
                  <Route path="/finances/cash-flow" element={
                    <ProtectedRouteWrapper>
                      <Layout>
                        <CashFlow />
                      </Layout>
                    </ProtectedRouteWrapper>
                  } />
                  <Route path="/finances/insights" element={
                    <ProtectedRouteWrapper>
                      <Layout>
                        <BusinessInsights />
                      </Layout>
                    </ProtectedRouteWrapper>
                  } />
                  <Route path="/finances/reports" element={
                    <ProtectedRouteWrapper>
                      <Layout>
                        <FinancialReports />
                      </Layout>
                    </ProtectedRouteWrapper>
                  } />
                  <Route path="/marketing/templates" element={
                    <ProtectedRouteWrapper>
                      <Layout>
                        <MarketingTemplates />
                      </Layout>
                    </ProtectedRouteWrapper>
                  } />
                    
                    {/* Default route - catch all */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </AuthProvider>
              </BrowserRouter>
            </Suspense>
          </HelmetProvider>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
