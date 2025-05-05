
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  cost: number;
  entry_date: string;
  expiry_date?: string;
  status: string;
}

export const getInventoryItems = async (): Promise<InventoryItem[]> => {
  try {
    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching inventory items:', error);
    toast({
      title: 'שגיאה בטעינת מלאי',
      description: 'אירעה שגיאה בטעינת פריטי המלאי',
      variant: 'destructive',
    });
    return [];
  }
};

export const addInventoryItem = async (item: Omit<InventoryItem, 'id'>): Promise<InventoryItem | null> => {
  try {
    const { data, error } = await supabase
      .from('inventory_items')
      .insert([item])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        toast({
          title: 'הפריט כבר קיים',
          description: 'פריט עם אותו שם כבר קיים במערכת',
          variant: 'destructive',
        });
      } else {
        throw error;
      }
      return null;
    }

    toast({
      title: 'פריט נוסף בהצלחה',
      description: `${item.name} נוסף למלאי`,
    });

    return data;
  } catch (error) {
    console.error('Error adding inventory item:', error);
    toast({
      title: 'שגיאה בהוספת פריט',
      description: 'אירעה שגיאה בהוספת הפריט למלאי',
      variant: 'destructive',
    });
    return null;
  }
};

export const updateInventoryItem = async (id: string, item: Partial<InventoryItem>): Promise<InventoryItem | null> => {
  try {
    const { data, error } = await supabase
      .from('inventory_items')
      .update(item)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    toast({
      title: 'פריט עודכן בהצלחה',
      description: `${item.name || 'הפריט'} עודכן במלאי`,
    });

    return data;
  } catch (error) {
    console.error('Error updating inventory item:', error);
    toast({
      title: 'שגיאה בעדכון פריט',
      description: 'אירעה שגיאה בעדכון הפריט במלאי',
      variant: 'destructive',
    });
    return null;
  }
};

export const deleteInventoryItem = async (id: string, name: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('inventory_items')
      .delete()
      .eq('id', id);

    if (error) throw error;

    toast({
      title: 'פריט נמחק בהצלחה',
      description: `${name} הוסר מהמלאי`,
    });

    return true;
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    toast({
      title: 'שגיאה במחיקת פריט',
      description: 'אירעה שגיאה במחיקת הפריט מהמלאי',
      variant: 'destructive',
    });
    return false;
  }
};

export const calculateInventoryStatus = (quantity: number): 'תקין' | 'מלאי נמוך' | 'אזל במלאי' => {
  if (quantity === 0) return 'אזל במלאי';
  if (quantity <= 2) return 'מלאי נמוך';
  return 'תקין';
};

export const getLowStockItems = async (): Promise<InventoryItem[]> => {
  try {
    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .or('status.eq.מלאי נמוך,status.eq.אזל במלאי')
      .order('name');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching low stock items:', error);
    return [];
  }
};
