import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type Revenue = Tables<'revenues'>;
export type RevenueInsert = TablesInsert<'revenues'>;
export type RevenueUpdate = TablesUpdate<'revenues'>;
export type RevenueCreate = Omit<RevenueInsert, 'created_by'>;

export const getRevenues = async () => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('revenues')
    .select('*')
    .eq('created_by', user.user.id)
    .order('date', { ascending: false });

  if (error) throw error;
  return data;
};

export const getRevenueById = async (id: string) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('revenues')
    .select('*')
    .eq('id', id)
    .eq('created_by', user.user.id)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const addRevenue = async (revenue: RevenueCreate) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('revenues')
    .insert({
      ...revenue,
      created_by: user.user.id
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateRevenue = async (id: string, updates: RevenueUpdate) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('revenues')
    .update(updates)
    .eq('id', id)
    .eq('created_by', user.user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteRevenue = async (id: string) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('revenues')
    .delete()
    .eq('id', id)
    .eq('created_by', user.user.id);

  if (error) throw error;
  return true; // Return boolean instead of void
};

export const getRevenuesByDateRange = async (startDate: string, endDate: string) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('revenues')
    .select('*')
    .eq('created_by', user.user.id)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: false });

  if (error) throw error;
  return data;
};

export const getRevenuesBySource = async (source: string) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('revenues')
    .select('*')
    .eq('source', source)
    .eq('created_by', user.user.id)
    .order('date', { ascending: false });

  if (error) throw error;
  return data;
};

export const getCurrentMonthRevenue = async () => {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
  return await getRevenuesByDateRange(
    firstDay.toISOString().split('T')[0],
    lastDay.toISOString().split('T')[0]
  );
};

// Keep the service object for backward compatibility
export const revenueService = {
  getRevenues,
  getRevenueById,
  createRevenue: addRevenue,
  updateRevenue,
  deleteRevenue,
  getRevenuesByDateRange,
  getRevenuesBySource,
  getCurrentMonthRevenue
};
