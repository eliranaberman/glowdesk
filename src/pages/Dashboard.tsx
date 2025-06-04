
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { StatCard } from '@/components/dashboard/StatCard';
import { RecentAppointments } from '@/components/dashboard/RecentAppointments';
import { DailySummary } from '@/components/dashboard/DailySummary';
import { BusinessAnalytics } from '@/components/dashboard/BusinessAnalytics';
import { InactiveClientsAlert } from '@/components/dashboard/InactiveClientsAlert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Calendar, DollarSign, Package, Camera, CheckSquare, TrendingUp, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getStorageStatus } from '@/services/storageService';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [storageReady, setStorageReady] = useState(true);

  useEffect(() => {
    // Check storage status on mount
    const checkStorage = async () => {
      const status = await getStorageStatus();
      setStorageReady(status.allReady);
      
      if (!status.allReady) {
        toast({
          title: "התראה על אחסון",
          description: "חלק מתכונות האחסון עשויות להיות מוגבלות",
          variant: "destructive"
        });
      }
    };

    checkStorage();
  }, [toast]);

  const quickActions = [
    {
      title: 'תור חדש',
      description: 'קבע תור חדש ללקוח',
      href: '/scheduling/new',
      icon: Calendar,
      color: 'bg-blue-500'
    },
    {
      title: 'לקוח חדש',
      description: 'הוסף לקוח חדש למערכת',
      href: '/clients/new',
      icon: Users,
      color: 'bg-green-500'
    },
    {
      title: 'הוסף לגלריה',
      description: 'העלה תמונה חדשה לגלריה',
      href: '/portfolio',
      icon: Camera,
      color: 'bg-purple-500'
    },
    {
      title: 'רשום הוצאה',
      description: 'רשום הוצאה חדשה',
      href: '/expenses',
      icon: DollarSign,
      color: 'bg-red-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 rounded-xl text-white p-6">
        <h1 className="text-3xl font-bold mb-2">
          ברוך הבא, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'משתמש יקר'}! 👋
        </h1>
        <p className="text-pink-100 text-lg">
          הדשבורד שלך מוכן - בואו נתחיל את היום בהצלחה
        </p>
      </div>

      {/* Storage Status Alert */}
      {!storageReady && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="flex items-center gap-3 pt-6">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <div>
              <p className="font-medium text-yellow-800">התראה על מצב האחסון</p>
              <p className="text-sm text-yellow-700">חלק מתכונות האחסון עשויות להיות מוגבלות. העלאת קבצים ותמונות עשויה להיות מוגבלת.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            פעולות מהירות
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-3 hover:shadow-md transition-all"
                onClick={() => navigate(action.href)}
              >
                <div className={`p-3 rounded-full ${action.color} text-white`}>
                  <action.icon className="h-6 w-6" />
                </div>
                <div className="text-center">
                  <p className="font-medium">{action.title}</p>
                  <p className="text-sm text-gray-500 mt-1">{action.description}</p>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="תורים היום"
          value="8"
          change="+2"
          icon={Calendar}
          trend="up"
        />
        <StatCard
          title="סה״כ לקוחות"
          value="156"
          change="+12"
          icon={Users}
          trend="up"
        />
        <StatCard
          title="הכנסות החודש"
          value="₪15,240"
          change="+8%"
          icon={DollarSign}
          trend="up"
        />
        <StatCard
          title="פריטי מלאי"
          value="47"
          change="-3"
          icon={Package}
          trend="down"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentAppointments />
        <DailySummary />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <BusinessAnalytics />
        </div>
        <InactiveClientsAlert />
      </div>
    </div>
  );
};

export default Dashboard;
