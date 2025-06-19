import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Layout from '@/components/layout/Layout';
import Dashboard from '@/pages/Dashboard';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import ResetPassword from '@/pages/auth/ResetPassword';
import NotFound from '@/pages/NotFound';
import Index from '@/pages/Index';
import Expenses from '@/pages/Expenses';
import Inventory from '@/pages/Inventory';
import NewInventoryItem from '@/pages/inventory/NewInventoryItem';
import Tasks from '@/pages/Tasks';
import Scheduling from '@/pages/Scheduling';
import NewAppointment from '@/pages/scheduling/NewAppointment';
import EditAppointment from '@/pages/scheduling/EditAppointment';
import Reports from '@/pages/Reports';
import Settings from '@/pages/Settings';
import LoyaltyPage from '@/pages/LoyaltyPage';
import SocialMedia from '@/pages/SocialMedia';
import AIAssistant from '@/pages/AIAssistant';
import Notifications from '@/pages/Notifications';
import PortfolioPage from '@/pages/PortfolioPage';
import MarketingTemplates from '@/pages/marketing/MarketingTemplates';
import NewTemplateForm from '@/pages/marketing/NewTemplateForm';
import EditTemplateForm from '@/pages/marketing/EditTemplateForm';
import MarketingPage from '@/pages/marketing/MarketingPage';
import NewCampaignForm from '@/pages/marketing/NewCampaignForm';
import EditCampaignForm from '@/pages/marketing/EditCampaignForm';
import ClientsPage from '@/pages/clients/ClientsPage';
import NewClientPage from '@/pages/clients/NewClientPage';
import EditClientPage from '@/pages/clients/EditClientPage';
import ClientDetailPage from '@/pages/clients/ClientDetailPage';
import NewActivityPage from '@/pages/clients/NewActivityPage';
import CashFlow from '@/pages/finances/CashFlow';
import FinancialReports from '@/pages/finances/FinancialReports';
import NewPayment from '@/pages/payments/NewPayment';
import OnlineBooking from '@/pages/OnlineBooking';
import InitialSetupPage from '@/pages/InitialSetupPage';
import Customers from '@/pages/Customers';
import BusinessInsightsPage from '@/pages/BusinessInsightsPage';
import MagicToolsPage from "@/pages/MagicToolsPage";

// Create a layout wrapper for protected routes
const ProtectedLayout = () => {
  return (
    <ProtectedRoute>
      <Layout>
        <Outlet />
      </Layout>
    </ProtectedRoute>
  );
};

// Main Router component - no longer wraps with AuthProvider
export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes (no layout) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/" element={<Index />} />

      {/* Protected routes with layout */}
      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Client routes */}
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/clients/new" element={<NewClientPage />} />
        <Route path="/clients/:id" element={<ClientDetailPage />} />
        <Route path="/clients/:id/edit" element={<EditClientPage />} />
        <Route path="/clients/:id/activity/new" element={<NewActivityPage />} />
        <Route path="/customers" element={<Customers />} />
        
        {/* Scheduling routes */}
        <Route path="/scheduling" element={<Scheduling />} />
        <Route path="/scheduling/new" element={<NewAppointment />} />
        <Route path="/scheduling/edit/:id" element={<EditAppointment />} />
        
        {/* Tasks */}
        <Route path="/tasks" element={<Tasks />} />
        
        {/* Inventory and expenses */}
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/inventory/new" element={<NewInventoryItem />} />
        <Route path="/expenses" element={<Expenses />} />
        
        {/* Reports */}
        <Route path="/reports" element={<Reports />} />
        
        {/* Settings - Single unified settings page */}
        <Route path="/settings" element={<Settings />} />
        
        {/* Social media and marketing */}
        <Route path="/loyalty" element={<LoyaltyPage />} />
        <Route path="/online-booking" element={<OnlineBooking />} />
        <Route path="/social-media" element={<SocialMedia />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        
        {/* Marketing routes */}
        <Route path="/marketing" element={<MarketingPage />} /> 
        <Route path="/marketing/templates" element={<MarketingTemplates />} />
        <Route path="/marketing/templates/new" element={<NewTemplateForm />} />
        <Route path="/marketing/templates/edit/:id" element={<EditTemplateForm />} />
        <Route path="/marketing/campaigns" element={<MarketingPage />} />
        <Route path="/marketing/campaigns/new" element={<NewCampaignForm />} />
        <Route path="/marketing/campaigns/edit/:id" element={<EditCampaignForm />} />
        
        {/* Financial routes */}
        <Route path="/finances/cash-flow" element={<CashFlow />} />
        <Route path="/finances/reports" element={<FinancialReports />} />
        <Route path="/payments/new" element={<NewPayment />} />
        
        {/* Business Insights - New comprehensive page */}
        <Route path="/insights" element={<BusinessInsightsPage />} />
        
        {/* AI and notifications */}
        <Route path="/ai-assistant" element={<AIAssistant />} />
        <Route path="/notifications" element={<Notifications />} />
        
        {/* Setup */}
        <Route path="/setup" element={<InitialSetupPage />} />
      </Route>
      
      {/* Fallback route (404) */}
      <Route path="*" element={<NotFound />} />
      
      {/* Magic Tools Page */}
      <Route path="/magic-tools" element={<MagicToolsPage />} />
    </Routes>
  );
}
