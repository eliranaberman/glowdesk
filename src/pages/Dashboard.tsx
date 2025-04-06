
import { CalendarClock, Users, DollarSign, TrendingUp } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import DailySummary from '../components/dashboard/DailySummary';
import RecentAppointments from '../components/dashboard/RecentAppointments';
import AnalyticsCharts from '../components/dashboard/AnalyticsCharts';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from '@/hooks/use-mobile';

const Dashboard = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // Updated data with correct numbers and currency values
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

  // Analytics chart data
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
    { name: 'מניקור ג\'ל', value: 35, color: '#9b87f5' },
    { name: 'פדיקור', value: 25, color: '#38bdf8' },
    { name: 'אקריליק', value: 20, color: '#f87171' },
    { name: 'לק', value: 15, color: '#34d399' },
    { name: 'עיצוב', value: 5, color: '#fbbf24' },
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
    <div className="space-y-8" dir="rtl">
      {/* Key metrics section with enhanced styling */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      
      {/* Main data panels with improved spacing and consistency */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DailySummary 
          customers={dailyData.customers}
          hours={dailyData.hours}
          revenue={dailyData.revenue}
          deficiencies={dailyData.deficiencies}
        />
        <RecentAppointments appointments={appointments} />
      </div>
      
      {/* Analytics Charts Section - Moved below the daily summary and recent appointments */}
      <div className="mb-8">
        <AnalyticsCharts 
          monthlyData={monthlyData}
          retentionData={retentionData}
          servicesData={servicesData}
          bookingsData={bookingsData}
        />
      </div>
      
      {/* Quick actions section with enhanced visual styling */}
      <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <span className="bg-primary/10 w-1 h-6 rounded mr-2"></span>
          פעולות מהירות
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <Link to="/scheduling/new" className="bg-secondary hover:bg-secondary/80 p-4 rounded-lg cursor-pointer transition-colors duration-200 shadow-sm hover:shadow-md flex flex-col">
            <h3 className="font-medium text-primary">פגישה חדשה</h3>
            <p className="text-sm text-muted-foreground mt-1">תזמון פגישה ללקוח חדש</p>
          </Link>
          <Link to="/customers/new" className="bg-secondary hover:bg-secondary/80 p-4 rounded-lg cursor-pointer transition-colors duration-200 shadow-sm hover:shadow-md flex flex-col">
            <h3 className="font-medium text-primary">הוספת לקוח</h3>
            <p className="text-sm text-muted-foreground mt-1">יצירת פרופיל לקוח חדש</p>
          </Link>
          <Link to="/payments/new" className="bg-secondary hover:bg-secondary/80 p-4 rounded-lg cursor-pointer transition-colors duration-200 shadow-sm hover:shadow-md flex flex-col">
            <h3 className="font-medium text-primary">רישום תשלום</h3>
            <p className="text-sm text-muted-foreground mt-1">תיעוד עסקה חדשה</p>
          </Link>
          <Link to="/inventory/new" className="bg-secondary hover:bg-secondary/80 p-4 rounded-lg cursor-pointer transition-colors duration-200 shadow-sm hover:shadow-md flex flex-col">
            <h3 className="font-medium text-primary">עדכון מלאי</h3>
            <p className="text-sm text-muted-foreground mt-1">רישום מוצרים חדשים או חוסרים</p>
          </Link>
        </div>
      </div>

      {/* Promotional section with enhanced visual appeal */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-semibold text-purple-800 mb-2">מערכת קביעת פגישות אונליין</h2>
            <p className="text-muted-foreground max-w-2xl">
              אפשרו ללקוחות שלכם לקבוע פגישות אונליין בקלות, והתראות יסונכרנו ישירות ללוח השנה שלכם.
            </p>
          </div>
          <div className="flex gap-4">
            <Link to="/online-booking">
              <Button className="bg-purple-600 hover:bg-purple-700">
                קביעת פגישות אונליין
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
