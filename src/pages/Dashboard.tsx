import { CalendarClock, Users, DollarSign, TrendingUp } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import DailySummary from '../components/dashboard/DailySummary';
import RecentAppointments from '../components/dashboard/RecentAppointments';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  // Updated data with correct numbers and currency values
  const stats = [
    { title: 'סך הכל לקוחות', value: '176', icon: <Users className="h-5 w-5 text-primary" />, change: { value: '12%', positive: true } },
    { title: 'פגישות חודשיות', value: '126', icon: <CalendarClock className="h-5 w-5 text-primary" />, change: { value: '5%', positive: true } },
    { title: 'הכנסה חודשית', value: '₪10,680', icon: <DollarSign className="h-5 w-5 text-primary" />, change: { value: '8%', positive: true } },
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

  return (
    <div className="space-y-6" dir="rtl">
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
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DailySummary 
          customers={dailyData.customers}
          hours={dailyData.hours}
          revenue={dailyData.revenue}
          deficiencies={dailyData.deficiencies}
        />
        <RecentAppointments appointments={appointments} />
      </div>
      
      <div className="border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-2">פעולות מהירות</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <Link to="/scheduling/new" className="bg-secondary hover:bg-secondary/80 p-4 rounded-lg cursor-pointer transition-colors">
            <h3 className="font-medium">פגישה חדשה</h3>
            <p className="text-sm text-muted-foreground">תזמון פגישה ללקוח חדש</p>
          </Link>
          <Link to="/customers/new" className="bg-secondary hover:bg-secondary/80 p-4 rounded-lg cursor-pointer transition-colors">
            <h3 className="font-medium">הוספת לקוח</h3>
            <p className="text-sm text-muted-foreground">יצירת פרופיל לקוח חדש</p>
          </Link>
          <Link to="/payments/new" className="bg-secondary hover:bg-secondary/80 p-4 rounded-lg cursor-pointer transition-colors">
            <h3 className="font-medium">רישום תשלום</h3>
            <p className="text-sm text-muted-foreground">תיעוד עסקה חדשה</p>
          </Link>
          <Link to="/inventory/new" className="bg-secondary hover:bg-secondary/80 p-4 rounded-lg cursor-pointer transition-colors">
            <h3 className="font-medium">עדכון מלאי</h3>
            <p className="text-sm text-muted-foreground">רישום מוצרים חדשים או חוסרים</p>
          </Link>
        </div>
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-semibold text-purple-800 mb-2">מערכת קביעת פגישות אונליין</h2>
            <p className="text-muted-foreground">
              אפשרו ללקוחות שלכם לקבוע פגישות אונליין בקלות, והתראות יסונכרנו ישירות ללוח השנה שלכם.
            </p>
          </div>
          <Link to="/online-booking">
            <Button className="bg-purple-600 hover:bg-purple-700">
              קביעת פגישות אונליין
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
