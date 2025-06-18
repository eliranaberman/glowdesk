import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type InventoryItem = Tables<'inventory_items'>;
export type InventoryItemInsert = TablesInsert<'inventory_items'>;
export type InventoryItemUpdate = TablesUpdate<'inventory_items'>;

export const getInventoryItems = async () => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('inventory_items')
    .select('*')
    .eq('created_by', user.user.id)
    .order('entry_date', { ascending: false });

  if (error) throw error;
  return data;
};

export const getInventoryItemById = async (id: string) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('inventory_items')
    .select('*')
    .eq('id', id)
    .eq('created_by', user.user.id)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const addInventoryItem = async (item: Omit<InventoryItemInsert, 'created_by'>) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('inventory_items')
    .insert({
      ...item,
      created_by: user.user.id
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateInventoryItem = async (id: string, updates: InventoryItemUpdate) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('inventory_items')
    .update(updates)
    .eq('id', id)
    .eq('created_by', user.user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteInventoryItem = async (id: string) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('inventory_items')
    .delete()
    .eq('id', id)
    .eq('created_by', user.user.id);

  if (error) throw error;
};

export const getInventoryItemsByCategory = async (category: string) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('inventory_items')
    .select('*')
    .eq('category', category)
    .eq('created_by', user.user.id)
    .order('entry_date', { ascending: false });

  if (error) throw error;
  return data;
};

export const getLowStockItems = async (threshold: number = 5) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('inventory_items')
    .select('*')
    .lte('quantity', threshold)
    .eq('created_by', user.user.id)
    .order('quantity', { ascending: true });

  if (error) throw error;
  return data;
};

export const calculateInventoryStatus = async () => {
  const items = await getInventoryItems();
  const lowStockItems = await getLowStockItems();
  
  return {
    totalItems: items.length,
    lowStockCount: lowStockItems.length,
    totalValue: items.reduce((sum, item) => sum + (item.cost * item.quantity), 0)
  };
};

// Keep the service object for backward compatibility
export const inventoryService = {
  getInventoryItems,
  getInventoryItemById,
  createInventoryItem: addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  getInventoryItemsByCategory,
  getLowStockItems,
  calculateInventoryStatus
};
