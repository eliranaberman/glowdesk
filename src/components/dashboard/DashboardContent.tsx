
import React, { Suspense } from 'react';
import { usePermissions } from '@/hooks/use-permissions';
import PermissionGuard from '@/components/auth/PermissionGuard';
import BusinessAnalytics from '@/components/dashboard/BusinessAnalytics';
import LoadingFallback from '@/components/dashboard/LoadingFallback';

const DailySummary = React.lazy(() => import('../dashboard/DailySummary'));
const RecentAppointments = React.lazy(() => import('../dashboard/RecentAppointments'));
const BusinessInsights = React.lazy(() => import('../dashboard/BusinessInsights'));
const CashFlowForecast = React.lazy(() => import('../dashboard/CashFlowForecast'));
const LoyaltyProgram = React.lazy(() => import('../dashboard/LoyaltyProgram'));
const MarketingMessages = React.lazy(() => import('../dashboard/MarketingMessages'));
const InactiveClientsAlert = React.lazy(() => import('../dashboard/InactiveClientsAlert'));
const AnalyticsCharts = React.lazy(() => import('../dashboard/AnalyticsCharts'));

interface DashboardContentProps {
  appointments: any[];
  dailyData: {
    customers: number;
    hours: number;
    revenue: number;
    deficiencies: string[];
  };
  monthlyData: any[];
  retentionData: any[];
  servicesData: any[];
  bookingsData: any[];
}

const DashboardContent = ({
  appointments,
  dailyData,
  monthlyData,
  retentionData,
  servicesData,
  bookingsData
}: DashboardContentProps) => {
  const { isAdmin, isOwner } = usePermissions();
  const hasFinanceAccess = isAdmin || isOwner;

  return (
    <>
      {/* Business Analytics Section - Only visible to users with finance permissions */}
      {hasFinanceAccess && (
        <PermissionGuard requiredResource="finances" requiredPermission="read" showLoadingState={false}>
          <div className="mb-8">
            <Suspense fallback={<LoadingFallback />}>
              <BusinessAnalytics timeFrame="month" />
            </Suspense>
          </div>
        </PermissionGuard>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <div className="flex flex-col gap-6 order-first">
          <Suspense fallback={<LoadingFallback />}>
            <DailySummary 
              customers={dailyData.customers}
              hours={dailyData.hours}
              revenue={dailyData.revenue}
              deficiencies={dailyData.deficiencies}
            />
          </Suspense>
          <Suspense fallback={<LoadingFallback />}>
            <RecentAppointments appointments={appointments} />
          </Suspense>
        </div>
        
        <div className="flex flex-col gap-6">
          <Suspense fallback={<LoadingFallback />}>
            <BusinessInsights />
            <CashFlowForecast />
          </Suspense>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <Suspense fallback={<LoadingFallback />}>
          <MarketingMessages />
          <LoyaltyProgram />
        </Suspense>
      </div>
      
      <Suspense fallback={<LoadingFallback />}>
        <InactiveClientsAlert />
      </Suspense>
      
      <div className="mb-6 md:mb-8">
        <Suspense fallback={<LoadingFallback />}>
          <AnalyticsCharts 
            monthlyData={monthlyData}
            retentionData={retentionData}
            servicesData={servicesData}
            bookingsData={bookingsData}
          />
        </Suspense>
      </div>
    </>
  );
};

export default DashboardContent;
