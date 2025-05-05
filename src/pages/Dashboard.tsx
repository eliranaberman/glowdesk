
import React, { useState, useEffect, Suspense } from 'react';
import { CalendarClock, Users, DollarSign, TrendingUp, Bot } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from '@/hooks/use-mobile';
import { initializeMarketingData } from '@/services/marketing';

const DailySummary = React.lazy(() => import('../components/dashboard/DailySummary'));
const RecentAppointments = React.lazy(() => import('../components/dashboard/RecentAppointments'));
const BusinessInsights = React.lazy(() => import('../components/dashboard/BusinessInsights'));
const CashFlowForecast = React.lazy(() => import('../components/dashboard/CashFlowForecast'));
const LoyaltyProgram = React.lazy(() => import('@/components/dashboard/LoyaltyProgram'));
const MarketingMessages = React.lazy(() => import('@/components/dashboard/MarketingMessages'));
const InactiveClientsAlert = React.lazy(() => import('@/components/dashboard/InactiveClientsAlert'));
const AnalyticsCharts = React.lazy(() => import('@/components/dashboard/AnalyticsCharts'));

const LoadingFallback = () => (
  <div className="animate-pulse p-6 bg-card rounded-xl shadow-soft">
    <div className="h-8 w-48 bg-muted rounded mb-4"></div>
    <div className="space-y-3">
      <div className="h-4 bg-muted rounded w-full"></div>
      <div className="h-4 bg-muted rounded w-5/6"></div>
    </div>
  </div>
);

const Dashboard = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const initData = async () => {
      await initializeMarketingData();
    };
    
    initData();
  }, []);
  
  const stats = [
    { title: 'סך הכל לקוחות', value: '176', icon: <Users className="h-5 w-5 text-primary" />, change: { value: '12%', positive: true } },
    { title: 'פגישות חודשיות', value: '126', icon: <CalendarClock className="h-5 w-5 text-primary" />, change: { value: '5%', positive: true } },
    { title: 'הכנסה חודשית', value: '₪15,120', icon: <DollarSign className="h-5 w-5 text-primary" />, change: { value: '8%', positive: true } },
    { title: 'ערך ממוצע לשירות', value: '₪120', icon: <TrendingUp className="h-5 w-5 text-primary" />, change: { value: '3%', positive: false } },
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

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in" dir="rtl">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            change={stat.change}
          />
        ))}
      </div>

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
      
      <div className="border rounded-xl p-4 md:p-6 shadow-soft hover:shadow-soft-lg transition-all duration-300 bg-warmBeige/10">
        <h2 className="text-base md:text-lg font-display font-medium mb-4 md:mb-6 flex items-center">
          <span className="bg-softRose/40 w-1 h-6 rounded mr-2"></span>
          פעולות מהירות
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
          <Link to="/scheduling/new" className="bg-card hover:bg-accent/20 p-4 md:p-5 rounded-xl cursor-pointer transition-all duration-300 shadow-soft hover:shadow-soft-lg flex flex-col transform hover:-translate-y-1">
            <h3 className="font-medium text-primary mb-1">פגישה חדשה</h3>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">תזמון פגישה ללקוח חדש</p>
          </Link>
          <Link to="/customers/new" className="bg-card hover:bg-accent/20 p-4 md:p-5 rounded-xl cursor-pointer transition-all duration-300 shadow-soft hover:shadow-soft-lg flex flex-col transform hover:-translate-y-1">
            <h3 className="font-medium text-primary mb-1">הוספת לקוח</h3>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">יצירת פרופיל לקוח חדש</p>
          </Link>
          <Link to="/payments/new" className="bg-card hover:bg-accent/20 p-4 md:p-5 rounded-xl cursor-pointer transition-all duration-300 shadow-soft hover:shadow-soft-lg flex flex-col transform hover:-translate-y-1">
            <h3 className="font-medium text-primary mb-1">רישום תשלום</h3>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">תיעוד עסקה חדשה</p>
          </Link>
          <Link to="/inventory/new" className="bg-card hover:bg-accent/20 p-4 md:p-5 rounded-xl cursor-pointer transition-all duration-300 shadow-soft hover:shadow-soft-lg flex flex-col transform hover:-translate-y-1">
            <h3 className="font-medium text-primary mb-1">עדכון מלאי</h3>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">רישום מוצרים חדשים או חוסרים</p>
          </Link>
          <Link to="/ai-assistant" className="bg-card hover:bg-accent/20 p-4 md:p-5 rounded-xl cursor-pointer transition-all duration-300 shadow-soft hover:shadow-soft-lg flex flex-col transform hover:-translate-y-1">
            <h3 className="font-medium text-primary mb-1">העוזרת החכמה</h3>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">ייעוץ אישי מבוסס AI</p>
          </Link>
        </div>
      </div>

      <div className="bg-gradient-to-r from-warmBeige to-softRose/20 border border-softRose/20 rounded-xl p-4 md:p-6 shadow-soft">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
          <div className="mb-4 md:mb-0">
            <h2 className="text-lg md:text-xl font-display font-medium text-deepNavy mb-2">מערכת קביעת פגישות אונליין</h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
              אפשרו ללקוחות שלכם לקבוע פגישות אונליין בקלות, והתראות יסונכרנו ישירות ללוח השנה שלכם.
            </p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <Link to="/online-booking" className="w-full md:w-auto">
              <Button variant="warm" size={isMobile ? "default" : "lg"} className="font-display w-full md:w-auto">
                קביעת פגישות אונליין
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-accent/30 to-accent/10 border border-accent/20 rounded-xl p-4 md:p-6 shadow-soft">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
          <div className="mb-4 md:mb-0 flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-display font-medium text-deepNavy mb-1">העוזרת החכמה שלך</h2>
              <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
                פנה לעוזרת החכמה לעזרה בניהול העסק, תזכורות ללקוחות, פוסטים לרשתות חברתיות ועוד.
              </p>
            </div>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <Link to="/ai-assistant" className="w-full md:w-auto">
              <Button variant="warm" size={isMobile ? "default" : "lg"} className="font-display w-full md:w-auto group">
                <Bot className="h-5 w-5 mr-2 group-hover:animate-pulse" />
                התחל לדבר עם העוזרת
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
