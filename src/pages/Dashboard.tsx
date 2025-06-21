
import React, { useState, useEffect, Suspense } from 'react';
import { CalendarClock, Users, DollarSign, TrendingUp, Plus, Calendar, UserPlus, CreditCard, Package } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from '@/hooks/use-mobile';
import { initializeMarketingData } from '@/services/marketing';
import { usePermissions } from '@/hooks/use-permissions';
import PermissionGuard from '@/components/auth/PermissionGuard';
import BusinessAnalytics from '@/components/dashboard/BusinessAnalytics';
import { HelpTooltip } from '@/components/ui/enhanced-tooltip';
import { SkeletonCard, SkeletonTable } from '@/components/ui/skeleton';

const DailySummary = React.lazy(() => import('../components/dashboard/DailySummary'));
const RecentAppointments = React.lazy(() => import('../components/dashboard/RecentAppointments'));
const BusinessInsights = React.lazy(() => import('../components/dashboard/BusinessInsights'));
const CashFlowForecast = React.lazy(() => import('../components/dashboard/CashFlowForecast'));
const LoyaltyProgram = React.lazy(() => import('@/components/dashboard/LoyaltyProgram'));
const MarketingMessages = React.lazy(() => import('@/components/dashboard/MarketingMessages'));
const InactiveClientsAlert = React.lazy(() => import('@/components/dashboard/InactiveClientsAlert'));
const AnalyticsCharts = React.lazy(() => import('@/components/dashboard/AnalyticsCharts'));

const LoadingFallback = () => <SkeletonCard />;

const Dashboard = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { isAdmin, isOwner } = usePermissions();
  const hasFinanceAccess = isAdmin || isOwner;
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const initData = async () => {
      setIsLoading(true);
      try {
        await initializeMarketingData();
      } catch (error) {
        toast({
          title: "שגיאה בטעינת הנתונים",
          description: "אנא נסי לרענן את הדף",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    initData();
  }, []);
  
  const stats = [
    { 
      title: 'סך הכל לקוחות', 
      value: '176', 
      icon: <Users className="h-5 w-5 text-primary" />, 
      change: { value: '12%', positive: true },
      description: 'לקוחות פעילות בחודש האחרון',
      onClick: () => toast({
        title: "מעבר לרשימת הלקוחות"
      })
    },
    { 
      title: 'פגישות חודשיות', 
      value: '126', 
      icon: <CalendarClock className="h-5 w-5 text-primary" />, 
      change: { value: '5%', positive: true },
      description: 'פגישות שהושלמו החודש',
      onClick: () => toast({
        title: "מעבר ליומן הפגישות"
      })
    },
    { 
      title: 'הכנסה חודשית', 
      value: '₪15,120', 
      icon: <DollarSign className="h-5 w-5 text-primary" />, 
      change: { value: '8%', positive: true },
      description: 'הכנסה נטו לאחר הוצאות',
      onClick: () => toast({
        title: "מעבר לדוח הכנסות"
      })
    },
    { 
      title: 'ערך ממוצע לשירות', 
      value: '₪120', 
      icon: <TrendingUp className="h-5 w-5 text-primary" />, 
      change: { value: '3%', positive: false },
      description: 'ממוצע הכנסה לטיפול',
      onClick: () => toast({
        title: "מעבר לניתוח שירותים"
      })
    },
  ];
  
  const appointments = [
    { id: '1', customer: 'שרה כהן', service: 'מניקור ג\'ל', time: 'היום, 10:00', price: 120, status: 'upcoming' as const },
    { id: '2', customer: 'אמילי לוי', service: 'אקריליק מלא', time: 'היום, 12:30', price: 180, status: 'upcoming' as const },
    { id: '3', customer: 'ליאת ונג', service: 'פדיקור', time: 'היום, 14:00', price: 140, status: 'upcoming' as const },
    { id: '4', customer: 'מריה אברהם', service: 'עיצוב ציפורניים', time: 'אתמול, 11:00', price: 120, status: 'completed' as const },
    { id: '5', customer: 'ג\'ניפר מילר', service: 'מניקור', time: 'אתמול, 15:30', price: 100, status: 'cancelled' as const },
  ];
  
  const dailyData = {
    customers: 8,
    hours: 7.5,
    revenue: 960,
    deficiencies: [
      'אצטון - בקבוק אחד נשאר',
      'לק לבן - כמות נמוכה',
      'מנורת UV זקוקה לניקוי',
    ]
  };

  const monthlyData = [
    { name: 'ינואר', income: 10500, expenses: 6200 },
    { name: 'פברואר', income: 11200, expenses: 6800 },
    { name: 'מרץ', income: 12800, expenses: 7100 },
    { name: 'אפריל', income: 13400, expenses: 7300 },
    { name: 'מאי', income: 14200, expenses: 7400 },
    { name: 'יוני', income: 15120, expenses: 7600 },
  ];

  const retentionData = [
    { name: 'ינואר', value: 65 },
    { name: 'פברואר', value: 68 },
    { name: 'מרץ', value: 72 },
    { name: 'אפריל', value: 75 },
    { name: 'מאי', value: 79 },
    { name: 'יוני', value: 82 },
  ];

  const servicesData = [
    { name: 'מניקור ג\'ל', value: 35, color: '#EFCFD4' },
    { name: 'פדיקור', value: 25, color: '#FAD8C3' },
    { name: 'אקריליק', value: 20, color: '#F5F0EB' },
    { name: 'לק', value: 15, color: '#D8E2DC' },
    { name: 'עיצוב', value: 5, color: '#FFE5D9' },
  ];

  const bookingsData = [
    { name: '01', value: 3 },
    { name: '05', value: 5 },
    { name: '10', value: 8 },
    { name: '15', value: 6 },
    { name: '20', value: 9 },
    { name: '25', value: 7 },
    { name: '30', value: 4 },
  ];

  const quickActions = [
    {
      title: "פגישה חדשה",
      description: "תזמון פגישה ללקוח חדש",
      icon: <Calendar className="h-5 w-5" />,
      to: "/scheduling/new",
      variant: "action" as const
    },
    {
      title: "הוספת לקוח",
      description: "יצירת פרופיל לקוח חדש",
      icon: <UserPlus className="h-5 w-5" />,
      to: "/clients/new",
      variant: "premium" as const
    },
    {
      title: "רישום תשלום",
      description: "תיעוד עסקה חדשה",
      icon: <CreditCard className="h-5 w-5" />,
      to: "/payments/new",
      variant: "success" as const
    },
    {
      title: "עדכון מלאי",
      description: "רישום מוצרים חדשים או חוסרים",
      icon: <Package className="h-5 w-5" />,
      to: "/inventory/new",
      variant: "warm" as const
    }
  ];

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in" dir="rtl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <SkeletonTable />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in" dir="rtl">
      {/* Stats Grid - Uniform and Aligned */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.title} className="h-full">
            <StatCard
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              change={stat.change}
              onClick={stat.onClick}
              description={stat.description}
              className="h-full"
            />
          </div>
        ))}
      </div>

      {/* Business Analytics Section */}
      {hasFinanceAccess && (
        <PermissionGuard requiredResource="finances" requiredPermission="read" showLoadingState={false}>
          <div className="w-full">
            <BusinessAnalytics timeFrame="month" />
          </div>
        </PermissionGuard>
      )}

      {/* Main Content Grid - Uniform Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="space-y-8">
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
        
        <div className="space-y-8">
          <Suspense fallback={<LoadingFallback />}>
            <BusinessInsights />
          </Suspense>
          <Suspense fallback={<LoadingFallback />}>
            <CashFlowForecast />
          </Suspense>
        </div>
      </div>
      
      {/* Marketing & Loyalty Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <Suspense fallback={<LoadingFallback />}>
          <MarketingMessages />
        </Suspense>
        <Suspense fallback={<LoadingFallback />}>
          <LoyaltyProgram />
        </Suspense>
      </div>
      
      {/* Inactive Clients Alert - Full Width */}
      <Suspense fallback={<LoadingFallback />}>
        <InactiveClientsAlert />
      </Suspense>
      
      {/* Analytics Charts - Full Width */}
      <div className="w-full">
        <Suspense fallback={<LoadingFallback />}>
          <AnalyticsCharts 
            monthlyData={monthlyData}
            retentionData={retentionData}
            servicesData={servicesData}
            bookingsData={bookingsData}
          />
        </Suspense>
      </div>
      
      {/* Quick Actions - Uniform Grid */}
      <div className="border rounded-xl p-6 shadow-soft hover:shadow-soft-lg transition-all duration-300 bg-gradient-to-br from-warmBeige/20 to-softRose/10">
        <h2 className="text-xl font-display font-medium mb-6 flex items-center justify-center">
          <span className="bg-gradient-to-r from-softRose to-roseGold w-1 h-6 rounded ml-3"></span>
          פעולות מהירות
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action) => (
            <Link key={action.title} to={action.to} className="block group h-full">
              <div className="bg-card hover:bg-gradient-to-br hover:from-warmBeige/30 hover:to-softRose/20 p-6 rounded-xl cursor-pointer transition-all duration-500 shadow-soft hover:shadow-elevated flex flex-col transform hover:-translate-y-2 border border-transparent hover:border-softRose/20 relative overflow-hidden h-full">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className="p-2 rounded-full bg-gradient-to-br from-softRose/20 to-roseGold/20 group-hover:from-softRose/30 group-hover:to-roseGold/30 transition-all duration-300 group-hover:scale-110 flex items-center justify-center">
                    {action.icon}
                  </div>
                  <h3 className="font-medium text-primary group-hover:text-deepNavy transition-colors duration-300 text-center">
                    {action.title}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground group-hover:text-deepNavy/70 transition-colors duration-300 flex-1 text-center">
                  {action.description}
                </p>
                
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Online Booking Section - Full Width, Elegant */}
      <div className="bg-gradient-to-r from-warmBeige via-softRose/20 to-roseGold/20 border border-softRose/30 rounded-xl p-8 shadow-elevated hover:shadow-hover transition-all duration-500 relative overflow-hidden group">
        <div className="flex flex-col items-center text-center gap-6 relative z-10">
          <div className="flex-1">
            <h2 className="text-2xl font-display font-medium text-deepNavy mb-3 group-hover:text-primary transition-colors duration-300">
              מערכת קביעת פגישות אונליין
            </h2>
            <p className="text-base text-muted-foreground max-w-2xl group-hover:text-deepNavy/70 transition-colors duration-300 leading-relaxed">
              אפשרו ללקוחות שלכם לקבוע פגישות אונליין בקלות, והתראות יסונכרנו ישירות ללוח השנה שלכם.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Link to="/online-booking">
              <Button 
                variant="premium" 
                size="lg"
                className="font-display group-hover:scale-105 transition-transform duration-300 px-8 py-4 inline-flex items-center justify-center gap-2"
              >
                <Calendar className="h-5 w-5" />
                קביעת פגישות אונליין
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-roseGold via-transparent to-mutedPeach" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
