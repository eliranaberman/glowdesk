
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <div className="rtl text-right">
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={
              <Layout>
                <Dashboard />
              </Layout>
            } />
            <Route path="/customers" element={
              <Layout>
                <Customers />
              </Layout>
            } />
            <Route path="/customers/new" element={
              <Layout>
                <NewCustomer />
              </Layout>
            } />
            <Route path="/customers/edit/:id" element={
              <Layout>
                <EditCustomer />
              </Layout>
            } />
            <Route path="/scheduling" element={
              <Layout>
                <Scheduling />
              </Layout>
            } />
            <Route path="/scheduling/new" element={
              <Layout>
                <NewAppointment />
              </Layout>
            } />
            <Route path="/scheduling/edit/:id" element={
              <Layout>
                <EditAppointment />
              </Layout>
            } />
            <Route path="/reports" element={
              <Layout>
                <Reports />
              </Layout>
            } />
            <Route path="/inventory" element={
              <Layout>
                <Inventory />
              </Layout>
            } />
            <Route path="/inventory/new" element={
              <Layout>
                <NewInventoryItem />
              </Layout>
            } />
            <Route path="/expenses" element={
              <Layout>
                <Expenses />
              </Layout>
            } />
            <Route path="/tasks" element={
              <Layout>
                <Tasks />
              </Layout>
            } />
            <Route path="/social-media" element={
              <Layout>
                <SocialMedia />
              </Layout>
            } />
            <Route path="/loyalty" element={
              <Layout>
                <LoyaltyPage />
              </Layout>
            } />
            <Route path="/notifications" element={
              <Layout>
                <Notifications />
              </Layout>
            } />
            <Route path="/settings" element={
              <Layout>
                <Settings />
              </Layout>
            } />
            <Route path="/online-booking" element={
              <Layout>
                <OnlineBooking />
              </Layout>
            } />
            <Route path="/payments/new" element={
              <Layout>
                <NewPayment />
              </Layout>
            } />
            {/* Financial pages */}
            <Route path="/finances/cash-flow" element={
              <Layout>
                <CashFlow />
              </Layout>
            } />
            <Route path="/finances/insights" element={
              <Layout>
                <BusinessInsights />
              </Layout>
            } />
            <Route path="/finances/reports" element={
              <Layout>
                <FinancialReports />
              </Layout>
            } />
            {/* Marketing pages */}
            <Route path="/marketing/templates" element={
              <Layout>
                <MarketingTemplates />
              </Layout>
            } />
            <Route path="*" element={
              <Layout>
                <NotFound />
              </Layout>
            } />
          </Routes>
        </BrowserRouter>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
