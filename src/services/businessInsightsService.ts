import { supabase } from '@/lib/supabase';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays, subWeeks, subMonths } from 'date-fns';

export interface BusinessMetrics {
  totalRevenue: number;
  totalClients: number;
  averagePerClient: number;
  cancellationRate: number;
  repeatCustomers: number;
  peakHour: string;
  peakDay: string;
  treatmentDistribution: { name: string; value: number; count: number }[];
  revenueGrowth: number;
  clientGrowth: number;
}

export interface DateRange {
  start: Date;
  end: Date;
}

export const getDateRange = (period: 'daily' | 'weekly' | 'monthly', date: Date = new Date()): DateRange => {
  switch (period) {
    case 'daily':
      return {
        start: startOfDay(date),
        end: endOfDay(date)
      };
    case 'weekly':
      return {
        start: startOfWeek(date, { weekStartsOn: 0 }),
        end: endOfWeek(date, { weekStartsOn: 0 })
      };
    case 'monthly':
      return {
        start: startOfMonth(date),
        end: endOfMonth(date)
      };
    default:
      return {
        start: startOfDay(date),
        end: endOfDay(date)
      };
  }
};

export const getBusinessMetrics = async (dateRange: DateRange, period: 'daily' | 'weekly' | 'monthly' = 'weekly'): Promise<BusinessMetrics> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const startDate = dateRange.start.toISOString().split('T')[0];
    const endDate = dateRange.end.toISOString().split('T')[0];

    console.log('Fetching data for date range:', { startDate, endDate });

    // Get revenues
    const { data: revenues } = await supabase
      .from('revenues')
      .select('*')
      .eq('created_by', user.user.id)
      .gte('date', startDate)
      .lte('date', endDate);

    // Get appointments for the period
    const { data: appointments } = await supabase
      .from('appointments')
      .select('*')
      .eq('user_id', user.user.id)
      .gte('date', startDate)
      .lte('date', endDate);

    console.log('Fetched data:', { revenues: revenues?.length || 0, appointments: appointments?.length || 0 });

    // If no data exists, return demo data
    if ((!revenues || revenues.length === 0) && (!appointments || appointments.length === 0)) {
      return getDemoMetrics(period);
    }

    // Calculate metrics with safe defaults
    const totalRevenue = revenues?.reduce((sum, rev) => sum + Number(rev.amount), 0) || 0;
    const totalAppointments = appointments?.length || 0;
    const cancelledAppointments = appointments?.filter(apt => apt.status === 'cancelled').length || 0;
    const cancellationRate = totalAppointments > 0 ? (cancelledAppointments / totalAppointments) * 100 : 0;

    // Unique clients in period
    const uniqueClientIds = new Set(appointments?.map(apt => apt.customer_id) || []);
    const totalClients = uniqueClientIds.size;
    const averagePerClient = totalClients > 0 ? totalRevenue / totalClients : 0;

    // Calculate repeat customers (clients with more than 1 appointment)
    const clientAppointmentCounts = new Map();
    appointments?.forEach(apt => {
      const count = clientAppointmentCounts.get(apt.customer_id) || 0;
      clientAppointmentCounts.set(apt.customer_id, count + 1);
    });
    const repeatCustomers = Array.from(clientAppointmentCounts.values()).filter(count => count > 1).length;

    // Calculate peak hour and day with safe defaults
    const hourCounts = new Map();
    const dayCounts = new Map();
    
    appointments?.forEach(apt => {
      if (apt.start_time) {
        const hour = apt.start_time.split(':')[0];
        hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1);
      }
      
      if (apt.date) {
        const dayOfWeek = new Date(apt.date).getDay();
        const dayNames = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
        const dayName = dayNames[dayOfWeek];
        dayCounts.set(dayName, (dayCounts.get(dayName) || 0) + 1);
      }
    });

    // Safe peak calculations
    const peakHourEntry = Array.from(hourCounts.entries()).reduce((a, b) => 
      hourCounts.get(a[0]) > hourCounts.get(b[0]) ? a : b, ['16', 0]
    );
    const peakHour = peakHourEntry ? peakHourEntry[0] : '16';

    const peakDayEntry = Array.from(dayCounts.entries()).reduce((a, b) => 
      dayCounts.get(a[0]) > dayCounts.get(b[0]) ? a : b, ['רביעי', 0]
    );
    const peakDay = peakDayEntry ? peakDayEntry[0] : 'רביעי';

    // Treatment distribution with safe defaults
    const treatmentCounts = new Map();
    appointments?.forEach(apt => {
      const service = apt.service_type || 'לא צוין';
      treatmentCounts.set(service, (treatmentCounts.get(service) || 0) + 1);
    });

    const treatmentDistribution = Array.from(treatmentCounts.entries()).map(([name, count]) => ({
      name,
      value: count,
      count
    }));

    // Calculate growth compared to previous period
    const previousRange = getPreviousDateRange(dateRange);
    const { data: previousRevenues } = await supabase
      .from('revenues')
      .select('*')
      .eq('created_by', user.user.id)
      .gte('date', previousRange.start.toISOString().split('T')[0])
      .lte('date', previousRange.end.toISOString().split('T')[0]);

    const { data: previousAppointments } = await supabase
      .from('appointments')
      .select('*')
      .eq('user_id', user.user.id)
      .gte('date', previousRange.start.toISOString().split('T')[0])
      .lte('date', previousRange.end.toISOString().split('T')[0]);

    const previousRevenue = previousRevenues?.reduce((sum, rev) => sum + Number(rev.amount), 0) || 0;
    const previousClientCount = new Set(previousAppointments?.map(apt => apt.customer_id) || []).size;

    const revenueGrowth = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0;
    const clientGrowth = previousClientCount > 0 ? ((totalClients - previousClientCount) / previousClientCount) * 100 : 0;

    return {
      totalRevenue,
      totalClients,
      averagePerClient,
      cancellationRate,
      repeatCustomers,
      peakHour: `${peakHour}:00`,
      peakDay,
      treatmentDistribution,
      revenueGrowth,
      clientGrowth
    };
  } catch (error) {
    console.error('Error in getBusinessMetrics:', error);
    // Return demo data on error
    return getDemoMetrics(period);
  }
};

const getDemoMetrics = (period: 'daily' | 'weekly' | 'monthly' = 'weekly'): BusinessMetrics => {
  switch (period) {
    case 'daily':
      return {
        totalRevenue: 1440, // 8 customers * 180 avg
        totalClients: 8,
        averagePerClient: 180,
        cancellationRate: 5.0,
        repeatCustomers: 4,
        peakHour: '14:00',
        peakDay: 'רביעי',
        treatmentDistribution: [
          { name: 'מניקור', value: 3, count: 3 },
          { name: 'פדיקור', value: 2, count: 2 },
          { name: 'ג\'ל', value: 2, count: 2 },
          { name: 'עיצוב', value: 1, count: 1 }
        ],
        revenueGrowth: 12.5,
        clientGrowth: 6.7
      };
    case 'weekly':
      return {
        totalRevenue: 7980, // 42 customers * 190 avg
        totalClients: 42,
        averagePerClient: 190,
        cancellationRate: 8.5,
        repeatCustomers: 33,
        peakHour: '16:00',
        peakDay: 'רביעי',
        treatmentDistribution: [
          { name: 'מניקור', value: 15, count: 15 },
          { name: 'פדיקור', value: 10, count: 10 },
          { name: 'ג\'ל', value: 12, count: 12 },
          { name: 'עיצוב', value: 5, count: 5 }
        ],
        revenueGrowth: 15.3,
        clientGrowth: 8.7
      };
    case 'monthly':
      return {
        totalRevenue: 15120, // 126 customers * 120 avg
        totalClients: 126,
        averagePerClient: 120,
        cancellationRate: 11.2,
        repeatCustomers: 94,
        peakHour: '15:00',
        peakDay: 'רביעי',
        treatmentDistribution: [
          { name: 'מניקור', value: 45, count: 45 },
          { name: 'פדיקור', value: 30, count: 30 },
          { name: 'ג\'ל', value: 35, count: 35 },
          { name: 'עיצוב', value: 16, count: 16 }
        ],
        revenueGrowth: 18.7,
        clientGrowth: 14.2
      };
    default:
      return getDemoMetrics('weekly');
  }
};

const getPreviousDateRange = (currentRange: DateRange): DateRange => {
  const duration = currentRange.end.getTime() - currentRange.start.getTime();
  const daysDiff = Math.ceil(duration / (1000 * 60 * 60 * 24));
  
  if (daysDiff <= 1) {
    return {
      start: subDays(currentRange.start, 1),
      end: subDays(currentRange.end, 1)
    };
  } else if (daysDiff <= 7) {
    return {
      start: subWeeks(currentRange.start, 1),
      end: subWeeks(currentRange.end, 1)
    };
  } else {
    return {
      start: subMonths(currentRange.start, 1),
      end: subMonths(currentRange.end, 1)
    };
  }
};

export const getMotivationalMessage = (metrics: BusinessMetrics): string => {
  const messages = {
    revenue: [
      `כל הכבוד! הכנסה של ₪${metrics.totalRevenue.toLocaleString()} זה הישג מרשים! 💪`,
      `יופי של תוצאות! ₪${metrics.totalRevenue.toLocaleString()} הכנסה מעידה על עבודה מקצועית 🌟`,
      `וואו! ₪${metrics.totalRevenue.toLocaleString()} הכנסה - ממשיכה לשבור שיאים! 🎉`
    ],
    growth: [
      `עלייה של ${metrics.revenueGrowth.toFixed(1)}% בהכנסות - אש! 🔥`,
      `כל הכבוד על הצמיחה של ${metrics.revenueGrowth.toFixed(1)}%! 📈`,
      `שיפור של ${metrics.revenueGrowth.toFixed(1)}% - המומנטום שלך מדהים! ⭐`
    ],
    clients: [
      `${metrics.totalClients} לקוחות חדשות - הפה מתפשט! 👸`,
      `כל הכבוד על ${metrics.totalClients} לקוחות! השירות שלך מדבר בעד עצמו 💅`,
      `${metrics.totalClients} לקוחות במה שעבר - זה הרבה אהבה! ❤️`
    ],
    demo: [
      `זהו דמו של המערכת - נתונים אמיתיים יוצגו כאן לאחר התחלת השימוש! 🌟`,
      `ברוכה הבאה למערכת התובנות העסקיות! בקרוב תראי כאן את הנתונים האמיתיים שלך 💪`,
      `המערכת מוכנה לעבודה - התחילי להכניס נתונים ותראי תובנות מדהימות! 🎉`
    ]
  };

  // Check if it's demo data for any period
  if ((metrics.totalRevenue === 1440 && metrics.totalClients === 8) ||
      (metrics.totalRevenue === 7980 && metrics.totalClients === 42) ||
      (metrics.totalRevenue === 15120 && metrics.totalClients === 126)) {
    return messages.demo[Math.floor(Math.random() * messages.demo.length)];
  }

  if (metrics.revenueGrowth > 10) {
    return messages.growth[Math.floor(Math.random() * messages.growth.length)];
  } else if (metrics.totalRevenue > 1000) {
    return messages.revenue[Math.floor(Math.random() * messages.revenue.length)];
  } else {
    return messages.clients[Math.floor(Math.random() * messages.clients.length)];
  }
};
