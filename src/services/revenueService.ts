
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Revenue {
  id: string;
  amount: number;
  source: string;
  description?: string;
  date: string;
  created_by: string;
  payment_method?: string;
  customer_id?: string;
  service_id?: string;
}

export interface RevenueCreate extends Omit<Revenue, 'id'> {
  id?: string;
}

export const getRevenues = async (): Promise<Revenue[]> => {
  try {
    const { data, error } = await supabase
      .from('revenues')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching revenues:', error);
    toast({
      title: 'שגיאה בטעינת הכנסות',
      description: 'אירעה שגיאה בטעינת רשימת ההכנסות',
      variant: 'destructive',
    });
    return [];
  }
};

export const getRevenuesByDateRange = async (startDate: string, endDate: string): Promise<Revenue[]> => {
  try {
    const { data, error } = await supabase
      .from('revenues')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching revenues by date range:', error);
    toast({
      title: 'שגיאה בטעינת הכנסות',
      description: 'אירעה שגיאה בטעינת רשימת ההכנסות לפי טווח תאריכים',
      variant: 'destructive',
    });
    return [];
  }
};

export const getRevenuesBySource = async (source: string): Promise<Revenue[]> => {
  try {
    const { data, error } = await supabase
      .from('revenues')
      .select('*')
      .eq('source', source)
      .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching revenues by source:', error);
    toast({
      title: 'שגיאה בטעינת הכנסות',
      description: `אירעה שגיאה בטעינת רשימת ההכנסות למקור "${source}"`,
      variant: 'destructive',
    });
    return [];
  }
};

export const addRevenue = async (revenue: RevenueCreate): Promise<Revenue | null> => {
  try {
    const { data, error } = await supabase
      .from('revenues')
      .insert([revenue])
      .select()
      .single();

    if (error) throw error;

    toast({
      title: 'הכנסה נוספה בהצלחה',
      description: `הכנסה בסך ${revenue.amount} ₪ נוספה`,
    });

    return data;
  } catch (error) {
    console.error('Error adding revenue:', error);
    toast({
      title: 'שגיאה בהוספת הכנסה',
      description: 'אירעה שגיאה בהוספת ההכנסה',
      variant: 'destructive',
    });
    return null;
  }
};

export const updateRevenue = async (id: string, revenue: Partial<Revenue>): Promise<Revenue | null> => {
  try {
    const { data, error } = await supabase
      .from('revenues')
      .update(revenue)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    toast({
      title: 'הכנסה עודכנה בהצלחה',
      description: `הכנסה עודכנה`,
    });

    return data;
  } catch (error) {
    console.error('Error updating revenue:', error);
    toast({
      title: 'שגיאה בעדכון הכנסה',
      description: 'אירעה שגיאה בעדכון ההכנסה',
      variant: 'destructive',
    });
    return null;
  }
};

export const deleteRevenue = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('revenues')
      .delete()
      .eq('id', id);

    if (error) throw error;

    toast({
      title: 'הכנסה נמחקה בהצלחה',
      description: 'ההכנסה נמחקה בהצלחה',
    });

    return true;
  } catch (error) {
    console.error('Error deleting revenue:', error);
    toast({
      title: 'שגיאה במחיקת הכנסה',
      description: 'אירעה שגיאה במחיקת ההכנסה',
      variant: 'destructive',
    });
    return false;
  }
};

export const getRevenueSummaryByMonth = async (year: number): Promise<Record<string, number>> => {
  try {
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;
    
    const { data, error } = await supabase
      .from('revenues')
      .select('amount, date')
      .gte('date', startDate)
      .lte('date', endDate);

    if (error) throw error;

    // Group by month and sum
    const summary: Record<string, number> = {};
    for (let month = 0; month < 12; month++) {
      const monthName = new Date(year, month, 1).toLocaleString('he', { month: 'long' });
      summary[monthName] = 0;
    }

    data.forEach(revenue => {
      const date = new Date(revenue.date);
      const monthName = date.toLocaleString('he', { month: 'long' });
      summary[monthName] = (summary[monthName] || 0) + Number(revenue.amount);
    });

    return summary;
  } catch (error) {
    console.error('Error generating revenue summary:', error);
    return {};
  }
};

// Calculate total revenue for the current month
export const getCurrentMonthRevenue = async (): Promise<number> => {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
  
  try {
    const { data, error } = await supabase
      .from('revenues')
      .select('amount')
      .gte('date', firstDay)
      .lte('date', lastDay);

    if (error) throw error;
    
    return data.reduce((sum, item) => sum + Number(item.amount), 0);
  } catch (error) {
    console.error('Error calculating current month revenue:', error);
    return 0;
  }
};
