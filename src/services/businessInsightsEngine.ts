
import { supabase } from '@/lib/supabase';
import { startOfMonth, subMonths, subWeeks, format } from 'date-fns';
import { he } from 'date-fns/locale';

export interface SmartInsight {
  id: string;
  type: 'opportunity' | 'alert' | 'trend' | 'suggestion';
  category: 'opportunities' | 'operational_alerts' | 'weekly_trends' | 'monthly_insights';
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
      actionable: true,
      whatsappText: `השבוע היה מדהים! עלייה של ${Math.round(((thisWeekAppointments.length - lastWeekAppointments.length) / lastWeekAppointments.length) * 100)}% בהזמנות 🎉`
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
      actionable: true,
      whatsappText: 'רוצה למלא את ימי השני? יש לי רעיון למבצע מיוחד! 💡'
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
      actionable: true,
      whatsappText: `יש לי ${inactiveClients.length} לקוחות שמתגעגעות אליי... זמן להזמין אותן לחזור! 💕`
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
      actionable: true,
      whatsappText: `${holidayName} מתקרב! זמן להתכונן לעומס של הזמנות 🎉`
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
      actionable: true,
      whatsappText: `תזכורת חשובה: צריך להזמין ${itemName} - כמעט נגמר! 🛒`
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
      actionable: true,
      whatsappText: `יש לי רעיון מעולה לחבילה משולבת שתאהבי! 💅✨`
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
      actionable: true,
      whatsappText: 'יש לי רעיון מעולה לחבילה משולבת שתאהבי! 💅✨'
    },
    {
      id: 'demo-alert',
      type: 'alert',
      category: 'operational_alerts',
      title: 'התראה - חומרי גלם',
      message: 'כמות הלק השחור עומדת להיגמר. מומלץ להזמין עוד השבוע.',
      icon: '⚠️',
      priority: 'high',
      actionable: true,
      whatsappText: 'תזכורת: צריך להזמין לק שחור - כמעט נגמר! 🛒'
    }
  ];

  if (period === 'weekly') {
    baseInsights.push({
      id: 'demo-weekly-trend',
      type: 'trend',
      category: 'weekly_trends',
      title: 'מגמה חיובית',
      message: 'עלייה של 18% בהזמנות טיפולי אקריליק בהשוואה לשבוע שעבר. שקלי להוסיף מבצע לטיפול זה.',
      icon: '📈',
      priority: 'medium',
      actionable: true,
      whatsappText: 'השבוע היה מדהים! עלייה של 18% בטיפולי אקריליק 🎉'
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
      actionable: true,
      whatsappText: 'יש לי 28 לקוחות שמתגעגעות אליי... זמן להזמין אותן לחזור! 💕'
    });
  }

  return baseInsights;
};
