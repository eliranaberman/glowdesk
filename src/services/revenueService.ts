
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type Revenue = Tables<'revenues'>;
export type RevenueInsert = TablesInsert<'revenues'>;
export type RevenueUpdate = TablesUpdate<'revenues'>;

export const revenueService = {
  async getRevenues() {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('revenues')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getRevenueById(id: string) {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('revenues')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async createRevenue(revenue: Omit<RevenueInsert, 'created_by'>) {
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
  },

  async updateRevenue(id: string, updates: RevenueUpdate) {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('revenues')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteRevenue(id: string) {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('revenues')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getRevenuesByDateRange(startDate: string, endDate: string) {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('revenues')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getRevenuesBySource(source: string) {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('revenues')
      .select('*')
      .eq('source', source)
      .order('date', { ascending: false });

    if (error) throw error;
    return data;
  }
};
