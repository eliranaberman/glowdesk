
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, DollarSign, TrendingUp, Clock, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import StatCard from "@/components/dashboard/StatCard";
import RecentAppointments from "@/components/dashboard/RecentAppointments";
import BusinessInsights from "@/components/dashboard/BusinessInsights";
import DailySummary from "@/components/dashboard/DailySummary";
import InactiveClientsAlert from "@/components/dashboard/InactiveClientsAlert";
import LoyaltyProgram from "@/components/dashboard/LoyaltyProgram";
import MarketingMessages from "@/components/dashboard/MarketingMessages";
import BusinessAnalytics from "@/components/dashboard/BusinessAnalytics";
import AnalyticsCharts from "@/components/dashboard/AnalyticsCharts";
import CashFlowForecast from "@/components/dashboard/CashFlowForecast";

const Dashboard = () => {
  const { toast } = useToast();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const stats = [
    {
      title: "תורים היום",
      value: "12",
      change: "+15% מהחודש הקודם",
      icon: Calendar,
      trend: "up" as const,
      color: "text-primary"
    },
    {
      title: "לקוחות פעילים",
      value: "145",
      change: "+8% מהחודש הקודם",
      icon: Users,
      trend: "up" as const,
      color: "text-secondary"
    },
    {
      title: "הכנסות החודש",
      value: "₪12,450",
      change: "+23% מהחודש הקודם",
      icon: DollarSign,
      trend: "up" as const,
      color: "text-oliveGreen"
    },
    {
      title: "ממוצע דירוג",
      value: "4.8",
      change: "מתוך 5 כוכבים",
      icon: Star,
      trend: "stable" as const,
      color: "text-roseGold"
    }
  ];

  const todayAppointments = [
    {
      id: "1",
      time: "09:00",
      clientName: "שרה כהן",
      service: "מניקור ופדיקור",
      duration: 90,
      status: "confirmed" as const
    },
    {
      id: "2",
      time: "10:30",
      clientName: "מיכל לוי",
      service: "בנייה בג'ל",
      duration: 120,
      status: "confirmed" as const
    },
    {
      id: "3",
      time: "13:00",
      clientName: "רונית שמש",
      service: "טיפוח ציפורניים",
      duration: 60,
      status: "pending" as const
    },
    {
      id: "4",
      time: "14:30",
      clientName: "דנה אברהם",
      service: "עיצוב נוכחי",
      duration: 75,
      status: "confirmed" as const
    }
  ];

  return (
    <div dir="rtl" className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">דשבורד ראשי</h1>
          <p className="text-muted-foreground">
            {currentTime.toLocaleDateString('he-IL', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
            {' • '}
            {currentTime.toLocaleTimeString('he-IL', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to="/scheduling/new">תור חדש</Link>
          </Button>
          <Button asChild>
            <Link to="/clients/new">לקוח חדש</Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          <RecentAppointments appointments={todayAppointments} />
          <BusinessAnalytics />
          <AnalyticsCharts />
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          <DailySummary />
          <InactiveClientsAlert />
          <LoyaltyProgram />
          <MarketingMessages />
          <BusinessInsights />
          <CashFlowForecast />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
