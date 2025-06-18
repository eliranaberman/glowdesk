
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type Client = Tables<'clients'>;
export type ClientInsert = TablesInsert<'clients'>;
export type ClientUpdate = TablesUpdate<'clients'>;

export const clientService = {
  async getClients() {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('full_name', { ascending: true });

    if (error) throw error;
    return data;
  },

  async getClientById(id: string) {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async createClient(client: Omit<ClientInsert, 'user_id'>) {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('clients')
      .insert({
        ...client,
        user_id: user.user.id,
        assigned_rep: user.user.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateClient(id: string, updates: ClientUpdate) {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteClient(id: string) {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getClientServices(clientId: string) {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('client_services')
      .select('*')
      .eq('client_id', clientId)
      .order('service_date', { ascending: false });

    if (error) throw error;
    return data;
  },

  async createClientService(service: Omit<TablesInsert<'client_services'>, 'created_by'>) {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('client_services')
      .insert({
        ...service,
        created_by: user.user.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getClientActivity(clientId: string) {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('client_activity')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async createClientActivity(activity: Omit<TablesInsert<'client_activity'>, 'created_by'>) {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('client_activity')
      .insert({
        ...activity,
        created_by: user.user.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
