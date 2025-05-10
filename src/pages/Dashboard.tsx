
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { initializeMarketingData } from '@/services/marketing';
import StatsOverview from '@/components/dashboard/StatsOverview';
import DashboardContent from '@/components/dashboard/DashboardContent';
import QuickActions from '@/components/dashboard/QuickActions';
import MarketingBanner from '@/components/dashboard/MarketingBanner';
import AIAssistantBanner from '@/components/dashboard/AIAssistantBanner';

const Dashboard = () => {
  const { toast } = useToast();
  
  useEffect(() => {
    const initData = async () => {
      await initializeMarketingData();
    };
    
    initData();
  }, []);
  
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
      <StatsOverview />
      
      <DashboardContent 
        appointments={appointments}
        dailyData={dailyData}
        monthlyData={monthlyData}
        retentionData={retentionData}
        servicesData={servicesData}
        bookingsData={bookingsData}
      />
      
      <QuickActions />

      <MarketingBanner 
        title="מערכת קביעת פגישות אונליין"
        description="אפשרו ללקוחות שלכם לקבוע פגישות אונליין בקלות, והתראות יסונכרנו ישירות ללוח השנה שלכם."
        buttonText="קביעת פגישות אונליין"
        linkTo="/online-booking"
        gradientFrom="warmBeige"
        gradientTo="softRose/20"
        borderColor="softRose/20"
      />
      
      <AIAssistantBanner />
    </div>
  );
};

export default Dashboard;
