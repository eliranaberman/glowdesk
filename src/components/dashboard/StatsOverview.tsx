
import React from 'react';
import StatCard from './StatCard';
import { Users, CalendarClock, DollarSign, TrendingUp } from 'lucide-react';

interface StatData {
  title: string;
  value: string;
  icon: React.ReactNode;
  change: { value: string; positive: boolean };
}

const StatsOverview = () => {
  const stats: StatData[] = [
    { title: 'סך הכל לקוחות', value: '176', icon: <Users className="h-5 w-5 text-primary" />, change: { value: '12%', positive: true } },
    { title: 'פגישות חודשיות', value: '126', icon: <CalendarClock className="h-5 w-5 text-primary" />, change: { value: '5%', positive: true } },
    { title: 'הכנסה חודשית', value: '₪15,120', icon: <DollarSign className="h-5 w-5 text-primary" />, change: { value: '8%', positive: true } },
    { title: 'ערך ממוצע לשירות', value: '₪120', icon: <TrendingUp className="h-5 w-5 text-primary" />, change: { value: '3%', positive: false } },
  ];

  return (
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
  );
};

export default StatsOverview;
