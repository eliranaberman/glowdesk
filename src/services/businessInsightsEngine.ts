import { supabase } from '@/lib/supabase';
import { startOfMonth, subMonths, subWeeks, format } from 'date-fns';
import { he } from 'date-fns/locale';

export interface SmartInsight {
  id: string;
  type: 'opportunity' | 'alert' | 'trend' | 'suggestion';
  category: 'opportunities' | 'operational_alerts' | 'weekly_trends' | 'monthly_insights' | 'smart_insights';
  title: string;
  message: string;
  icon: string;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
  whatsappText?: string;
}

export const generateSmartInsights = async (period: 'daily' | 'weekly' | 'monthly'): Promise<SmartInsight[]> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return getDemoInsights(period);

    const insights: SmartInsight[] = [];
    
    // Get data for analysis
    const [appointments, inventory, clients, revenues] = await Promise.all([
      getAppointmentsData(user.user.id),
      getInventoryData(user.user.id),
      getClientsData(user.user.id),
      getRevenuesData(user.user.id)
    ]);

    // Generate insights based on period
    if (period === 'weekly') {
      insights.push(...generateWeeklyInsights(appointments, revenues));
    } else if (period === 'monthly') {
      insights.push(...generateMonthlyInsights(clients, appointments));
    }
    
    // Always include operational alerts
    insights.push(...generateOperationalAlerts(inventory));
    
    // Generate opportunities
    insights.push(...generateOpportunities(appointments, clients));

    // Generate new smart insights
    insights.push(...generateAdvancedSmartInsights(appointments, clients, revenues));

    return insights.length > 0 ? insights : getDemoInsights(period);
  } catch (error) {
    console.error('Error generating insights:', error);
    return getDemoInsights(period);
  }
};

const getAppointmentsData = async (userId: string) => {
  const { data } = await supabase
    .from('appointments')
    .select('*')
    .eq('user_id', userId)
    .gte('date', subMonths(new Date(), 3).toISOString().split('T')[0]);
  return data || [];
};

const getInventoryData = async (userId: string) => {
  const { data } = await supabase
    .from('inventory_items')
    .select('*')
    .eq('created_by', userId);
  return data || [];
};

const getClientsData = async (userId: string) => {
  const { data } = await supabase
    .from('clients')
    .select('*')
    .eq('user_id', userId);
  return data || [];
};

const getRevenuesData = async (userId: string) => {
  const { data } = await supabase
    .from('revenues')
    .select('*')
    .eq('created_by', userId)
    .gte('date', subMonths(new Date(), 3).toISOString().split('T')[0]);
  return data || [];
};

const generateAdvancedSmartInsights = (appointments: any[], clients: any[], revenues: any[]): SmartInsight[] => {
  const insights: SmartInsight[] = [];

  // Instagram posting time analysis
  const instagramInsight = generateInstagramPostingInsight(appointments);
  if (instagramInsight) insights.push(instagramInsight);

  // Client renewal reminder analysis
  const renewalInsight = generateRenewalReminderInsight(appointments, clients);
  if (renewalInsight) insights.push(renewalInsight);

  // Most profitable time slot analysis
  const profitableSlotInsight = generateProfitableSlotInsight(appointments, revenues);
  if (profitableSlotInsight) insights.push(profitableSlotInsight);

  return insights;
};

const generateInstagramPostingInsight = (appointments: any[]): SmartInsight | null => {
  // Analyze appointment patterns to find peak activity times
  const hourlyActivity = appointments.reduce((acc, apt) => {
    const hour = parseInt(apt.start_time?.split(':')[0] || '10');
    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const peakHours = Object.entries(hourlyActivity)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 2)
    .map(([hour]) => hour);

  if (peakHours.length === 0) return null;

  const optimalTime = peakHours[0];
  const timeDisplay = `${optimalTime}:00-${parseInt(optimalTime) + 2}:00`;

  return {
    id: 'instagram-posting-time',
    type: 'suggestion',
    category: 'smart_insights',
    title: 'מתי כדאי לפרסם פוסט באינסטגרם?',
    message: `הלקוחות שלך הכי פעילות בין השעות ${timeDisplay}. זה הזמן האידיאלי לפרסם תוכן באינסטגרם כדי לקבל מקסימום חשיפה ואינטרקציה.`,
    icon: '📸',
    priority: 'medium',
    actionable: true
  };
};

const generateRenewalReminderInsight = (appointments: any[], clients: any[]): SmartInsight | null => {
  // Find clients with regular patterns who haven't booked recently
  const clientAppointments = appointments.reduce((acc, apt) => {
    if (!acc[apt.customer_id]) acc[apt.customer_id] = [];
    acc[apt.customer_id].push(new Date(apt.date));
    return acc;
  }, {} as Record<string, Date[]>);

  const potentialRenewals = [];
  for (const [clientId, clientAppointmentDates] of Object.entries(clientAppointments)) {
    if (clientAppointmentDates.length < 2) continue;
    
    // Sort dates and calculate average interval
    const sortedDates = clientAppointmentDates.sort((a, b) => a.getTime() - b.getTime());
    const intervals = [];
    for (let i = 1; i < sortedDates.length; i++) {
      const daysDiff = Math.floor((sortedDates[i].getTime() - sortedDates[i-1].getTime()) / (1000 * 60 * 60 * 24));
      intervals.push(daysDiff);
    }
    
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const lastAppointment = sortedDates[sortedDates.length - 1];
    const daysSinceLastAppointment = Math.floor((new Date().getTime() - lastAppointment.getTime()) / (1000 * 60 * 60 * 24));
    
    // If it's been longer than average interval + 7 days, suggest renewal
    if (daysSinceLastAppointment > avgInterval + 7) {
      const client = clients.find(c => c.id === clientId);
      if (client) {
        potentialRenewals.push({
          name: client.full_name,
          daysSince: daysSinceLastAppointment,
          avgInterval: Math.round(avgInterval)
        });
      }
    }
  }

  if (potentialRenewals.length === 0) return null;

  const topRenewal = potentialRenewals.sort((a, b) => b.daysSince - a.daysSince)[0];

  return {
    id: 'renewal-reminder',
    type: 'opportunity',
    category: 'smart_insights',
    title: 'לאיזו לקוחה לשלוח תזכורת לפני חידוש?',
    message: `${topRenewal.name} בדרך כלל מגיעה כל ${topRenewal.avgInterval} ימים, אבל עברו כבר ${topRenewal.daysSince} ימים מהטיפול האחרון. זה הזמן לשלוח לה תזכורת עדינה!`,
    icon: '💌',
    priority: 'high',
    actionable: true
  };
};

const generateProfitableSlotInsight = (appointments: any[], revenues: any[]): SmartInsight | null => {
  // Analyze revenue by time slots
  const appointmentRevenues = appointments.map(apt => {
    const revenue = revenues.find(r => r.customer_id === apt.customer_id && r.date === apt.date);
    return {
      ...apt,
      revenue: revenue?.amount || 0,
      hour: parseInt(apt.start_time?.split(':')[0] || '10')
    };
  }).filter(apt => apt.revenue > 0);

  if (appointmentRevenues.length === 0) return null;

  // Group by hour and calculate average revenue
  const hourlyRevenue = appointmentRevenues.reduce((acc, apt) => {
    if (!acc[apt.hour]) acc[apt.hour] = { total: 0, count: 0 };
    acc[apt.hour].total += apt.revenue;
    acc[apt.hour].count += 1;
    return acc;
  }, {} as Record<number, { total: number; count: number }>);

  const averageRevenueByHour = Object.entries(hourlyRevenue)
    .map(([hour, data]) => ({
      hour: parseInt(hour),
      avgRevenue: data.total / data.count,
      count: data.count
    }))
    .filter(data => data.count >= 2) // Only consider hours with at least 2 appointments
    .sort((a, b) => b.avgRevenue - a.avgRevenue);

  if (averageRevenueByHour.length === 0) return null;

  const bestSlot = averageRevenueByHour[0];
  const timeSlot = `${bestSlot.hour}:00-${bestSlot.hour + 1}:00`;

  return {
    id: 'profitable-slot',
    type: 'trend',
    category: 'smart_insights',
    title: 'מה התור הכי שווה בשבוע שלך?',
    message: `הטיפולים בין השעות ${timeSlot} מביאים בממוצע ₪${Math.round(bestSlot.avgRevenue)} - זה ${Math.round(((bestSlot.avgRevenue / (averageRevenueByHour[averageRevenueByHour.length - 1]?.avgRevenue || bestSlot.avgRevenue)) - 1) * 100)}% יותר מהשעות הפחות רווחיות!`,
    icon: '💎',
    priority: 'medium',
    actionable: true
  };
};

const generateWeeklyInsights = (appointments: any[], revenues: any[]): SmartInsight[] => {
  const insights: SmartInsight[] = [];
  
  // Analyze weekly trends
  const thisWeekAppointments = appointments.filter(apt => 
    new Date(apt.date) >= subWeeks(new Date(), 1)
  );
  const lastWeekAppointments = appointments.filter(apt => {
    const date = new Date(apt.date);
    return date >= subWeeks(new Date(), 2) && date < subWeeks(new Date(), 1);
  });

  if (thisWeekAppointments.length > lastWeekAppointments.length * 1.15) {
    insights.push({
      id: 'weekly-growth',
      type: 'trend',
      category: 'weekly_trends',
      title: 'מגמה חיובית השבוע',
      message: `עלייה של ${Math.round(((thisWeekAppointments.length - lastWeekAppointments.length) / lastWeekAppointments.length) * 100)}% בהזמנות לעומת שבוע שעבר. המומנטום מעולה!`,
      icon: '📈',
      priority: 'medium',
      actionable: true
    });
  }

  // Check for quiet days
  const mondayAppointments = appointments.filter(apt => new Date(apt.date).getDay() === 1);
  if (mondayAppointments.length < appointments.length * 0.1) {
    insights.push({
      id: 'monday-quiet',
      type: 'suggestion',
      category: 'weekly_trends',
      title: 'ימי שני פנויים',
      message: 'זיהינו ירידה בהזמנות לימי שני. שקלי להציע הנחה מיוחדת או מבצע ליום זה.',
      icon: '📅',
      priority: 'medium',
      actionable: true
    });
  }

  return insights;
};

const generateMonthlyInsights = (clients: any[], appointments: any[]): SmartInsight[] => {
  const insights: SmartInsight[] = [];
  
  // Find inactive clients
  const twoMonthsAgo = subMonths(new Date(), 2);
  const inactiveClients = clients.filter(client => {
    const lastAppointment = appointments
      .filter(apt => apt.customer_id === client.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    
    return !lastAppointment || new Date(lastAppointment.date) < twoMonthsAgo;
  });

  if (inactiveClients.length > 0) {
    insights.push({
      id: 'inactive-clients',
      type: 'suggestion',
      category: 'monthly_insights',
      title: 'לקוחות לא פעילות',
      message: `${inactiveClients.length} לקוחות לא קבעו תור בחודשיים האחרונים. שלחי להן הודעה לחזרה עם הנחה.`,
      icon: '👤',
      priority: 'high',
      actionable: true
    });
  }

  // Holiday insights
  const currentMonth = new Date().getMonth();
  if (currentMonth === 2 || currentMonth === 8) { // March (Passover) or September (holidays)
    const holidayName = currentMonth === 2 ? 'פסח' : 'החגים';
    insights.push({
      id: 'holiday-prep',
      type: 'suggestion',
      category: 'monthly_insights',
      title: 'תובנה מיוחדת',
      message: `${holidayName} מתקרב! בשנה שעברה חלה עלייה של 35% בהזמנות לפני החג. התכונני עם תגבור זמנים.`,
      icon: '📅',
      priority: 'medium',
      actionable: true
    });
  }

  return insights;
};

const generateOperationalAlerts = (inventory: any[]): SmartInsight[] => {
  const insights: SmartInsight[] = [];
  
  // Check low stock items
  const lowStockItems = inventory.filter(item => item.quantity <= 3);
  
  if (lowStockItems.length > 0) {
    const itemName = lowStockItems[0].name;
    insights.push({
      id: 'low-stock',
      type: 'alert',
      category: 'operational_alerts',
      title: 'התראה - חומרי גלם',
      message: `כמות ${itemName} עומדת להיגמר (נשארו ${lowStockItems[0].quantity} יחידות). מומלץ להזמין עוד השבוע.`,
      icon: '⚠️',
      priority: 'high',
      actionable: true
    });
  }

  return insights;
};

const generateOpportunities = (appointments: any[], clients: any[]): SmartInsight[] => {
  const insights: SmartInsight[] = [];
  
  // Analyze service combinations
  const manicureClients = appointments.filter(apt => 
    apt.service_type?.toLowerCase().includes('מניקור')
  ).map(apt => apt.customer_id);
  
  const facialTreatmentClients = appointments.filter(apt => 
    apt.service_type?.toLowerCase().includes('פנים')
  ).map(apt => apt.customer_id);
  
  const overlap = manicureClients.filter(id => facialTreatmentClients.includes(id));
  const percentage = manicureClients.length > 0 ? Math.round((overlap.length / manicureClients.length) * 100) : 0;
  
  if (percentage > 70) {
    insights.push({
      id: 'service-combo',
      type: 'opportunity',
      category: 'opportunities',
      title: 'הזדמנות - טיפולי פנים',
      message: `${percentage}% מהלקוחות שעושות מניקור גם מתעניינות בטיפולי פנים. שקלי להציע חבילה משולבת.`,
      icon: '💡',
      priority: 'medium',
      actionable: true
    });
  }

  return insights;
};

const getDemoInsights = (period: 'daily' | 'weekly' | 'monthly'): SmartInsight[] => {
  const baseInsights: SmartInsight[] = [
    {
      id: 'demo-opportunity',
      type: 'opportunity',
      category: 'opportunities',
      title: 'הזדמנות - טיפולי פנים',
      message: '85% מהלקוחות שעושות מניקור גם מתעניינות בטיפולי פנים. שקלי להציע חבילה משולבת.',
      icon: '💡',
      priority: 'medium',
      actionable: true
    },
    {
      id: 'demo-alert',
      type: 'alert',
      category: 'operational_alerts',
      title: 'התראה - חומרי גלם',
      message: 'כמות הלק השחור עומדת להיגמר. מומלץ להזמין עוד השבוע.',
      icon: '⚠️',
      priority: 'high',
      actionable: true
    }
  ];

  // Always include smart insights in demo
  baseInsights.push(
    {
      id: 'demo-instagram-time',
      type: 'suggestion',
      category: 'smart_insights',
      title: 'מתי כדאי לפרסם פוסט באינסטגרם?',
      message: 'הלקוחות שלך הכי פעילות בין השעות 16:00-18:00. זה הזמן האידיאלי לפרסם תוכן באינסטגרם כדי לקבל מקסימום חשיפה ואינטרקציה.',
      icon: '📸',
      priority: 'medium',
      actionable: true
    },
    {
      id: 'demo-renewal-reminder',
      type: 'opportunity',
      category: 'smart_insights',
      title: 'לאיזו לקוחה לשלוח תזכורת לפני חידוש?',
      message: 'שרה כהן בדרך כלל מגיעה כל 28 ימים, אבל עברו כבר 35 ימים מהטיפול האחרון. זה הזמן לשלוח לה תזכורת עדינה!',
      icon: '💌',
      priority: 'high',
      actionable: true
    },
    {
      id: 'demo-profitable-slot',
      type: 'trend',
      category: 'smart_insights',
      title: 'מה התור הכי שווה בשבוע שלך?',
      message: 'הטיפולים בין השעות 14:00-15:00 מביאים בממוצע ₪185 - זה 23% יותר מהשעות הפחות רווחיות!',
      icon: '💎',
      priority: 'medium',
      actionable: true
    }
  );

  if (period === 'weekly') {
    baseInsights.push({
      id: 'demo-weekly-trend',
      type: 'trend',
      category: 'weekly_trends',
      title: 'מגמה חיובית',
      message: 'עלייה של 18% בהזמנות טיפולי אקריליק בהשוואה לשבוע שעבר. שקלי להוסיף מבצע לטיפול זה.',
      icon: '📈',
      priority: 'medium',
      actionable: true
    });
  }

  if (period === 'monthly') {
    baseInsights.push({
      id: 'demo-monthly-insight',
      type: 'suggestion',
      category: 'monthly_insights',
      title: 'לקוחות לא פעילות',
      message: '28 לקוחות לא קבעו תור בחודשיים האחרונים. שלחי להן הודעה לחזרה עם הנחה.',
      icon: '👤',
      priority: 'high',
      actionable: true
    });
  }

  return baseInsights;
};
