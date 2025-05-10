
import { supabase } from '@/integrations/supabase/client';
import { format, subDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';
import { getCurrentMonthRevenue } from './revenueService';

export type TimeFrame = 'day' | 'week' | 'month' | 'year';
export type ReportType = 'revenue' | 'expenses' | 'cashflow' | 'appointments' | 'services' | 'clients';

export interface ReportFilter {
  startDate?: string;
  endDate?: string;
  technician?: string;
  service?: string;
  category?: string;
}

export interface ReportData {
  id: string;
  title: string;
  description: string;
  timeFrame: TimeFrame;
  type: ReportType;
  generatedAt: string;
  data: any;
  format: 'csv' | 'pdf' | 'json';
  user_id: string;
}

export interface ReportDataCreate extends Omit<ReportData, 'id' | 'generatedAt'> {}

// Get date range based on timeframe
export const getDateRangeForTimeFrame = (timeFrame: TimeFrame): { startDate: string, endDate: string } => {
  const today = new Date();
  
  switch (timeFrame) {
    case 'day':
      return {
        startDate: format(today, 'yyyy-MM-dd'),
        endDate: format(today, 'yyyy-MM-dd'),
      };
    case 'week':
      return {
        startDate: format(startOfWeek(today, { weekStartsOn: 0 }), 'yyyy-MM-dd'),
        endDate: format(endOfWeek(today, { weekStartsOn: 0 }), 'yyyy-MM-dd'),
      };
    case 'month':
      return {
        startDate: format(startOfMonth(today), 'yyyy-MM-dd'),
        endDate: format(endOfMonth(today), 'yyyy-MM-dd'),
      };
    case 'year':
      return {
        startDate: format(new Date(today.getFullYear(), 0, 1), 'yyyy-MM-dd'),
        endDate: format(new Date(today.getFullYear(), 11, 31), 'yyyy-MM-dd'),
      };
    default:
      return {
        startDate: format(subDays(today, 30), 'yyyy-MM-dd'),
        endDate: format(today, 'yyyy-MM-dd'),
      };
  }
};

// Generate revenue report
export const generateRevenueReport = async (timeFrame: TimeFrame, filter?: ReportFilter) => {
  const { startDate, endDate } = filter || getDateRangeForTimeFrame(timeFrame);
  
  try {
    const { data, error } = await supabase
      .from('revenues')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true });
      
    if (error) throw error;
    
    return {
      title: `דוח הכנסות - ${getTimeFrameName(timeFrame)}`,
      type: 'revenue' as ReportType,
      timeFrame,
      generatedAt: new Date().toISOString(),
      data,
    };
  } catch (error) {
    console.error('Error generating revenue report:', error);
    throw error;
  }
};

// Generate expenses report
export const generateExpensesReport = async (timeFrame: TimeFrame, filter?: ReportFilter) => {
  const { startDate, endDate } = filter || getDateRangeForTimeFrame(timeFrame);
  
  try {
    let query = supabase
      .from('expenses')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate);
      
    // Add category filter if specified
    if (filter?.category) {
      query = query.eq('category', filter.category);
    }
    
    const { data, error } = await query.order('date', { ascending: true });
      
    if (error) throw error;
    
    return {
      title: `דוח הוצאות - ${getTimeFrameName(timeFrame)}`,
      type: 'expenses' as ReportType,
      timeFrame,
      generatedAt: new Date().toISOString(),
      data,
    };
  } catch (error) {
    console.error('Error generating expenses report:', error);
    throw error;
  }
};

// Generate cash flow report (combining revenue and expenses)
export const generateCashFlowReport = async (timeFrame: TimeFrame, filter?: ReportFilter) => {
  try {
    const revenueReport = await generateRevenueReport(timeFrame, filter);
    const expensesReport = await generateExpensesReport(timeFrame, filter);
    
    // Calculate total revenue, expenses and profit
    const totalRevenue = revenueReport.data.reduce((sum: number, item: any) => sum + Number(item.amount), 0);
    const totalExpenses = expensesReport.data.reduce((sum: number, item: any) => sum + Number(item.amount), 0);
    const profit = totalRevenue - totalExpenses;
    
    // Combine the data for a day-by-day analysis
    const allDates = new Set([
      ...revenueReport.data.map((item: any) => item.date),
      ...expensesReport.data.map((item: any) => item.date),
    ]);
    
    const dailyData = Array.from(allDates).sort().map(date => {
      const dayRevenues = revenueReport.data.filter((item: any) => item.date === date);
      const dayExpenses = expensesReport.data.filter((item: any) => item.date === date);
      
      const dayRevenueTotal = dayRevenues.reduce((sum: number, item: any) => sum + Number(item.amount), 0);
      const dayExpensesTotal = dayExpenses.reduce((sum: number, item: any) => sum + Number(item.amount), 0);
      
      return {
        date,
        revenue: dayRevenueTotal,
        expenses: dayExpensesTotal,
        profit: dayRevenueTotal - dayExpensesTotal,
      };
    });
    
    return {
      title: `דוח תזרים מזומנים - ${getTimeFrameName(timeFrame)}`,
      type: 'cashflow' as ReportType,
      timeFrame,
      generatedAt: new Date().toISOString(),
      data: dailyData,
      summary: {
        totalRevenue,
        totalExpenses,
        profit,
        profitMargin: totalRevenue > 0 ? (profit / totalRevenue * 100).toFixed(2) + '%' : '0%',
      },
    };
  } catch (error) {
    console.error('Error generating cash flow report:', error);
    throw error;
  }
};

// Save a report to the database for future reference
export const saveReport = async (report: ReportDataCreate): Promise<string | null> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('reports')
      .insert([{
        ...report,
        generatedAt: new Date().toISOString(),
        user_id: userData.user.id
      }])
      .select();
      
    if (error) throw error;
    
    return data[0]?.id || null;
  } catch (error) {
    console.error('Error saving report:', error);
    return null;
  }
};

// Get a specific report by ID
export const getReport = async (reportId: string): Promise<ReportData | null> => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('id', reportId)
      .single();
      
    if (error) throw error;
    
    return data as unknown as ReportData;
  } catch (error) {
    console.error('Error retrieving report:', error);
    return null;
  }
};

// Get all reports for the current user
export const getUserReports = async (): Promise<ReportData[]> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('user_id', userData.user.id)
      .order('generated_at', { ascending: false });
      
    if (error) throw error;
    
    return (data as unknown as ReportData[]) || [];
  } catch (error) {
    console.error('Error retrieving user reports:', error);
    return [];
  }
};

// Helper function to get human-readable time frame names
export const getTimeFrameName = (timeFrame: TimeFrame): string => {
  switch (timeFrame) {
    case 'day':
      return 'היום';
    case 'week':
      return 'שבוע נוכחי';
    case 'month':
      return 'חודש נוכחי';
    case 'year':
      return 'שנה נוכחית';
    default:
      return timeFrame;
  }
};

// Get general business metrics
export const getBusinessMetrics = async (): Promise<any> => {
  try {
    // Get current month revenue
    const monthlyRevenue = await getCurrentMonthRevenue();
    
    // In a real implementation, you would fetch these from the database
    // Here we're returning mock data for demonstration
    return {
      monthlyRevenue,
      monthlyAppointments: 126,
      averageServicePrice: 174,
      clientRetentionRate: 82,
      cancellationRate: 4.2,
    };
  } catch (error) {
    console.error('Error fetching business metrics:', error);
    return {
      monthlyRevenue: 0,
      monthlyAppointments: 0,
      averageServicePrice: 0,
      clientRetentionRate: 0,
      cancellationRate: 0,
    };
  }
};
