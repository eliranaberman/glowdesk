
import { supabase } from '@/integrations/supabase/client';
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays, subWeeks, subMonths } from 'date-fns';

export interface BusinessKPI {
  totalRevenue: number;
  totalClients: number;
  averagePerClient: number;
  cancellationRate: number;
  repeatBookings: number;
  peakHour: string;
  peakDay: string;
}

export interface ServiceDistribution {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

export interface TimeSeriesData {
  date: string;
  revenue: number;
  appointments: number;
  clients: number;
}

export type TimeFrame = 'daily' | 'weekly' | 'monthly';

const BRAND_COLORS = ['#9C6B50', '#F6BE9A', '#69493F', '#3A1E14', '#8B5A3C'];

// Get date ranges based on timeframe
const getDateRange = (timeFrame: TimeFrame) => {
  const now = new Date();
  
  switch (timeFrame) {
    case 'daily':
      return {
        start: startOfDay(now),
        end: endOfDay(now),
        previousStart: startOfDay(subDays(now, 1)),
        previousEnd: endOfDay(subDays(now, 1))
      };
    case 'weekly':
      return {
        start: startOfWeek(now, { weekStartsOn: 0 }),
        end: endOfWeek(now, { weekStartsOn: 0 }),
        previousStart: startOfWeek(subWeeks(now, 1), { weekStartsOn: 0 }),
        previousEnd: endOfWeek(subWeeks(now, 1), { weekStartsOn: 0 })
      };
    case 'monthly':
      return {
        start: startOfMonth(now),
        end: endOfMonth(now),
        previousStart: startOfMonth(subMonths(now, 1)),
        previousEnd: endOfMonth(subMonths(now, 1))
      };
  }
};

export const getBusinessKPIs = async (timeFrame: TimeFrame): Promise<BusinessKPI> => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not authenticated');

  const { start, end } = getDateRange(timeFrame);
  const startDate = format(start, 'yyyy-MM-dd');
  const endDate = format(end, 'yyyy-MM-dd');

  // Get revenues for the period
  const { data: revenues } = await supabase
    .from('revenues')
    .select('amount, date')
    .eq('created_by', user.user.id)
    .gte('date', startDate)
    .lte('date', endDate);

  // Get appointments for the period
  const { data: appointments } = await supabase
    .from('appointments')
    .select('id, customer_id, status, start_time, date')
    .eq('user_id', user.user.id)
    .gte('date', startDate)
    .lte('date', endDate);

  // Get unique clients
  const { data: clients } = await supabase
    .from('clients')
    .select('id, registration_date')
    .eq('user_id', user.user.id)
    .gte('registration_date', startDate)
    .lte('registration_date', endDate);

  // Calculate KPIs
  const totalRevenue = revenues?.reduce((sum, r) => sum + Number(r.amount), 0) || 0;
  const totalClients = clients?.length || 0;
  const averagePerClient = totalClients > 0 ? totalRevenue / totalClients : 0;
  
  const totalAppointments = appointments?.length || 0;
  const cancelledAppointments = appointments?.filter(a => a.status === 'cancelled').length || 0;
  const cancellationRate = totalAppointments > 0 ? (cancelledAppointments / totalAppointments) * 100 : 0;

  // Calculate repeat bookings (clients with more than one appointment)
  const clientBookingCounts = appointments?.reduce((acc, app) => {
    acc[app.customer_id] = (acc[app.customer_id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};
  
  const repeatBookings = Object.values(clientBookingCounts).filter(count => count > 1).length;

  // Find peak hour
  const hourCounts = appointments?.reduce((acc, app) => {
    const hour = app.start_time?.split(':')[0] || '00';
    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};
  
  const peakHour = Object.entries(hourCounts).sort(([,a], [,b]) => b - a)[0]?.[0] || '09';

  // Find peak day (for weekly/monthly views)
  const dayCounts = appointments?.reduce((acc, app) => {
    const day = format(new Date(app.date), 'EEEE');
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};
  
  const peakDay = Object.entries(dayCounts).sort(([,a], [,b]) => b - a)[0]?.[0] || 'Sunday';

  return {
    totalRevenue,
    totalClients,
    averagePerClient,
    cancellationRate,
    repeatBookings,
    peakHour: `${peakHour}:00`,
    peakDay
  };
};

export const getServiceDistribution = async (timeFrame: TimeFrame): Promise<ServiceDistribution[]> => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not authenticated');

  const { start, end } = getDateRange(timeFrame);
  const startDate = format(start, 'yyyy-MM-dd');
  const endDate = format(end, 'yyyy-MM-dd');

  const { data: appointments } = await supabase
    .from('appointments')
    .select('service_type')
    .eq('user_id', user.user.id)
    .gte('date', startDate)
    .lte('date', endDate);

  const serviceCounts = appointments?.reduce((acc, app) => {
    acc[app.service_type] = (acc[app.service_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const total = Object.values(serviceCounts).reduce((sum, count) => sum + count, 0);

  return Object.entries(serviceCounts).map(([name, value], index) => ({
    name,
    value,
    percentage: total > 0 ? Math.round((value / total) * 100) : 0,
    color: BRAND_COLORS[index % BRAND_COLORS.length]
  }));
};

export const getTimeSeriesData = async (timeFrame: TimeFrame): Promise<TimeSeriesData[]> => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not authenticated');

  const { start, end } = getDateRange(timeFrame);
  
  // Generate date series based on timeframe
  const dates = [];
  if (timeFrame === 'daily') {
    // Last 7 days for daily view
    for (let i = 6; i >= 0; i--) {
      dates.push(format(subDays(end, i), 'yyyy-MM-dd'));
    }
  } else if (timeFrame === 'weekly') {
    // Last 4 weeks for weekly view
    for (let i = 3; i >= 0; i--) {
      const weekStart = startOfWeek(subWeeks(end, i), { weekStartsOn: 0 });
      dates.push(format(weekStart, 'yyyy-MM-dd'));
    }
  } else {
    // Last 6 months for monthly view
    for (let i = 5; i >= 0; i--) {
      const monthStart = startOfMonth(subMonths(end, i));
      dates.push(format(monthStart, 'yyyy-MM-dd'));
    }
  }

  const data: TimeSeriesData[] = [];

  for (const date of dates) {
    let dateEnd = date;
    if (timeFrame === 'weekly') {
      dateEnd = format(endOfWeek(new Date(date), { weekStartsOn: 0 }), 'yyyy-MM-dd');
    } else if (timeFrame === 'monthly') {
      dateEnd = format(endOfMonth(new Date(date)), 'yyyy-MM-dd');
    }

    // Get revenues for this period
    const { data: revenues } = await supabase
      .from('revenues')
      .select('amount')
      .eq('created_by', user.user.id)
      .gte('date', date)
      .lte('date', dateEnd);

    // Get appointments for this period
    const { data: appointments } = await supabase
      .from('appointments')
      .select('id, customer_id')
      .eq('user_id', user.user.id)
      .gte('date', date)
      .lte('date', dateEnd);

    const revenue = revenues?.reduce((sum, r) => sum + Number(r.amount), 0) || 0;
    const appointmentCount = appointments?.length || 0;
    const uniqueClients = new Set(appointments?.map(a => a.customer_id)).size;

    data.push({
      date: timeFrame === 'daily' ? format(new Date(date), 'dd/MM') :
            timeFrame === 'weekly' ? `שבוע ${format(new Date(date), 'dd/MM')}` :
            format(new Date(date), 'MM/yyyy'),
      revenue,
      appointments: appointmentCount,
      clients: uniqueClients
    });
  }

  return data;
};

export const getMotivationalMessage = (kpis: BusinessKPI, timeFrame: TimeFrame): string => {
  const messages = {
    highRevenue: [
      "🎉 מדהים! ההכנסות שלך מטפסות לגבהים חדשים!",
      "✨ כל הכבוד! המקצועיות שלך משתלמת!",
      "🌟 פנטסטי! את באמת מובילה בתחום!"
    ],
    goodGrowth: [
      "📈 יפה! את בדרך הנכונה להצלחה!",
      "💫 נהדר! המאמצים שלך נושאים פרי!",
      "🎯 מצוין! ממשיכה להתקדם במקצועיות!"
    ],
    encouraging: [
      "💪 כל התחלה קשה - את בדרך הנכונה!",
      "🌱 זה הזמן לצמוח ולהתפתח!",
      "✨ כל יום הוא הזדמנות חדשה להצליח!"
    ]
  };

  if (kpis.totalRevenue > 1000) {
    return messages.highRevenue[Math.floor(Math.random() * messages.highRevenue.length)];
  } else if (kpis.totalClients > 5) {
    return messages.goodGrowth[Math.floor(Math.random() * messages.goodGrowth.length)];
  } else {
    return messages.encouraging[Math.floor(Math.random() * messages.encouraging.length)];
  }
};
