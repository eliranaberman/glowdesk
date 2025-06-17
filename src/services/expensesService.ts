import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Expense {
  id: string;
  amount: number;
  category: string;
  vendor: string;
  payment_method?: string;
  description?: string;
  date: string;
  has_invoice: boolean;
  invoice_file_path?: string;
}

export interface ExpenseCreate extends Omit<Expense, 'id' | 'has_invoice'> {
  has_invoice?: boolean;
}

export const getExpenses = async (): Promise<Expense[]> => {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching expenses:', error);
    toast({
      title: 'שגיאה בטעינת הוצאות',
      description: 'אירעה שגיאה בטעינת רשימת ההוצאות',
      variant: 'destructive',
    });
    return [];
  }
};

export const getExpensesByDateRange = async (startDate: string, endDate: string): Promise<Expense[]> => {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching expenses by date range:', error);
    toast({
      title: 'שגיאה בטעינת הוצאות',
      description: 'אירעה שגיאה בטעינת רשימת ההוצאות לפי טווח תאריכים',
      variant: 'destructive',
    });
    return [];
  }
};

export const getExpensesByCategory = async (category: string): Promise<Expense[]> => {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('category', category)
      .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching expenses by category:', error);
    toast({
      title: 'שגיאה בטעינת הוצאות',
      description: `אירעה שגיאה בטעינת רשימת ההוצאות לקטגוריה "${category}"`,
      variant: 'destructive',
    });
    return [];
  }
};

export const addExpense = async (expense: ExpenseCreate): Promise<Expense | null> => {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .insert([expense])
      .select()
      .single();

    if (error) throw error;

    toast({
      title: 'הוצאה נוספה בהצלחה',
      description: `הוצאה בסך ${expense.amount} ₪ עבור ${expense.vendor} נוספה`,
    });

    return data;
  } catch (error) {
    console.error('Error adding expense:', error);
    toast({
      title: 'שגיאה בהוספת הוצאה',
      description: 'אירעה שגיאה בהוספת ההוצאה',
      variant: 'destructive',
    });
    return null;
  }
};

export const updateExpense = async (id: string, expense: Partial<Expense>): Promise<Expense | null> => {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .update(expense)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    toast({
      title: 'הוצאה עודכנה בהצלחה',
      description: `הוצאה עבור ${expense.vendor || ''} עודכנה`,
    });

    return data;
  } catch (error) {
    console.error('Error updating expense:', error);
    toast({
      title: 'שגיאה בעדכון הוצאה',
      description: 'אירעה שגיאה בעדכון ההוצאה',
      variant: 'destructive',
    });
    return null;
  }
};

export const deleteExpense = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id);

    if (error) throw error;

    toast({
      title: 'הוצאה נמחקה בהצלחה',
      description: 'ההוצאה נמחקה בהצלחה',
    });

    return true;
  } catch (error) {
    console.error('Error deleting expense:', error);
    toast({
      title: 'שגיאה במחיקת הוצאה',
      description: 'אירעה שגיאה במחיקת ההוצאה',
      variant: 'destructive',
    });
    return false;
  }
};

export const uploadInvoice = async (file: File, expenseId: string): Promise<string | null> => {
  try {
    console.log('Starting invoice upload for expense:', expenseId);
    console.log('File details:', { name: file.name, size: file.size, type: file.type });

    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'pdf';
    const fileName = `${expenseId}-${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = fileName;

    console.log('Uploading invoice to path:', filePath);

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('expenses')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      
      if (uploadError.message?.includes('duplicate')) {
        throw new Error('קובץ עם שם זהה כבר קיים');
      } else if (uploadError.message?.includes('size')) {
        throw new Error('גודל הקובץ גדול מדי');
      } else if (uploadError.message?.includes('permission')) {
        throw new Error('אין הרשאה להעלות קבצים');
      } else if (uploadError.message?.includes('bucket')) {
        throw new Error('בעיה בהגדרות אחסון');
      }
      
      throw new Error(`שגיאה בהעלאת החשבונית: ${uploadError.message}`);
    }

    console.log('Invoice uploaded successfully:', uploadData);

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('expenses')
      .getPublicUrl(filePath);

    if (!urlData.publicUrl) {
      throw new Error('שגיאה ביצירת קישור לחשבונית');
    }

    console.log('Public URL generated:', urlData.publicUrl);

    // Update expense with invoice path
    const { error: updateError } = await supabase
      .from('expenses')
      .update({ 
        invoice_file_path: urlData.publicUrl,
        has_invoice: true
      })
      .eq('id', expenseId);

    if (updateError) {
      console.error('Error updating expense with invoice path:', updateError);
      // Try to clean up uploaded file
      try {
        await supabase.storage.from('expenses').remove([filePath]);
      } catch (cleanupError) {
        console.error('Failed to cleanup uploaded file:', cleanupError);
      }
      throw new Error('שגיאה בעדכון פרטי החשבונית');
    }

    toast({
      title: "החשבונית הועלתה בהצלחה",
      description: "החשבונית נשמרה ונשמחה להוצאה"
    });

    return urlData.publicUrl;
  } catch (error: any) {
    console.error('Error uploading invoice:', error);
    
    const errorMessage = error.message || "שגיאה לא ידועה בהעלאת החשבונית";
    
    toast({
      title: "שגיאה בהעלאת החשבונית",
      description: errorMessage,
      variant: "destructive"
    });
    
    return null;
  }
};

export const getExpenseCategories = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .select('category')
      .order('category');

    if (error) throw error;
    
    // Extract unique categories
    const categories = [...new Set(data.map(item => item.category))];
    return categories;
  } catch (error) {
    console.error('Error fetching expense categories:', error);
    return ["חומרים", "ציוד", "שכירות", "שיווק", "משכורות", "הכשרה", "אחר"];
  }
};

export const getExpenseSummaryByMonth = async (year: number): Promise<Record<string, number>> => {
  try {
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;
    
    const { data, error } = await supabase
      .from('expenses')
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

    data.forEach(expense => {
      const date = new Date(expense.date);
      const monthName = date.toLocaleString('he', { month: 'long' });
      summary[monthName] = (summary[monthName] || 0) + Number(expense.amount);
    });

    return summary;
  } catch (error) {
    console.error('Error generating expense summary:', error);
    return {};
  }
};
