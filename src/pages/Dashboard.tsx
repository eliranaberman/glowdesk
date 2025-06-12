
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
      icon: <Calendar className="h-4 w-4" />,
      change: {
        value: "+15% מהחודש הקודם",
        positive: true
      }
    },
    {
      title: "לקוחות פעילים",
      value: "145",
      icon: <Users className="h-4 w-4" />,
      change: {
        value: "+8% מהחודש הקודם",
        positive: true
      }
    },
    {
      title: "הכנסות החודש",
      value: "₪12,450",
      icon: <DollarSign className="h-4 w-4" />,
      change: {
        value: "+23% מהחודש הקודם",
        positive: true
      }
    },
    {
      title: "ממוצע דירוג",
      value: "4.8",
      icon: <Star className="h-4 w-4" />,
      change: {
        value: "מתוך 5 כוכבים",
        positive: true
      }
    }
  ];

  const todayAppointments = [
    {
      id: "1",
      customer: "שרה כהן",
      service: "מניקור ופדיקור",
      time: "09:00",
      price: 120,
      status: "completed" as const
    },
    {
      id: "2",
      customer: "מיכל לוי",
      service: "בנייה בג'ל",
      time: "10:30",
      price: 150,
      status: "completed" as const
    },
    {
      id: "3",
      customer: "רונית שמש",
      service: "טיפוח ציפורניים",
      time: "13:00",
      price: 80,
      status: "upcoming" as const
    },
    {
      id: "4",
      customer: "דנה אברהם",
      service: "עיצוב נוכחי",
      time: "14:30",
      price: 100,
      status: "upcoming" as const
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
          <DailySummary 
            customers={12}
            hours={8}
            revenue={1250}
            deficiencies={["לק ג'ל אדום", "מגבות נקיות", "אקססוריז לעיצוב"]}
          />
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
