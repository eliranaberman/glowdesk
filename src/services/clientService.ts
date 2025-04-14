
import { supabase } from '@/lib/supabase';
import { Client, ClientActivity } from '@/types/clients';

export const getClients = async (
  search?: string,
  status?: string,
  sortBy: string = 'registration_date',
  sortOrder: string = 'desc',
  page: number = 1,
  pageSize: number = 20
) => {
  try {
    // Start with a basic query that doesn't try to join with assigned_rep
    let query = supabase
      .from('clients')
      .select('*', { count: 'exact' });

    // Apply search filter if provided
    if (search) {
      query = query.or(
        `full_name.ilike.%${search}%,phone_number.ilike.%${search}%,email.ilike.%${search}%`
      );
    }

    // Apply status filter if provided
    if (status) {
      query = query.eq('status', status);
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    const from = (page - 1) * pageSize;
    query = query.range(from, from + pageSize - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    // Map the result to include empty assigned_rep_user for now
    const clients = data.map(client => ({
      ...client,
      assigned_rep_user: client.assigned_rep ? { 
        id: client.assigned_rep,
        full_name: "Unknown Rep", 
        avatar_url: undefined
      } : undefined
    }));

    return {
      clients: clients as Client[],
      count: count || 0,
    };
  } catch (error) {
    console.error('Error fetching clients:', error);
    throw error;
  }
};

export const getClient = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    // Map to include empty assigned_rep_user
    const client = {
      ...data,
      assigned_rep_user: data.assigned_rep ? { 
        id: data.assigned_rep,
        full_name: "Unknown Rep", 
        avatar_url: undefined
      } : undefined
    };

    return client as Client;
  } catch (error) {
    console.error('Error fetching client:', error);
    throw error;
  }
};

export const createClient = async (client: Omit<Client, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .insert([client])
      .select();

    if (error) throw error;

    return data[0] as Client;
  } catch (error) {
    console.error('Error creating client:', error);
    throw error;
  }
};

export const updateClient = async (id: string, client: Partial<Client>) => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .update(client)
      .eq('id', id)
      .select();

    if (error) throw error;

    return data[0] as Client;
  } catch (error) {
    console.error('Error updating client:', error);
    throw error;
  }
};

export const deleteClient = async (id: string) => {
  try {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting client:', error);
    throw error;
  }
};

export const getClientActivities = async (clientId: string) => {
  try {
    const { data, error } = await supabase
      .from('client_activity')
      .select('*')
      .eq('client_id', clientId)
      .order('date', { ascending: false });

    if (error) throw error;

    // Map to include empty created_by_user
    const activities = data.map(activity => ({
      ...activity,
      created_by_user: activity.created_by ? {
        id: activity.created_by,
        full_name: "Unknown User",
        avatar_url: undefined
      } : undefined
    }));

    return activities as ClientActivity[];
  } catch (error) {
    console.error('Error fetching client activities:', error);
    throw error;
  }
};

export const createClientActivity = async (activity: Omit<ClientActivity, 'id'>) => {
  try {
    const { data, error } = await supabase
      .from('client_activity')
      .insert([activity])
      .select();

    if (error) throw error;

    return data[0] as ClientActivity;
  } catch (error) {
    console.error('Error creating client activity:', error);
    throw error;
  }
};
