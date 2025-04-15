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
    let query = supabase
      .from('clients')
      .select('*', { count: 'exact' });

    if (search) {
      query = query.or(
        `full_name.ilike.%${search}%,phone_number.ilike.%${search}%,email.ilike.%${search}%`
      );
    }

    if (status) {
      query = query.eq('status', status);
    }

    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    const from = (page - 1) * pageSize;
    query = query.range(from, from + pageSize - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    const clients = data as Client[];
    const repIds = clients
      .filter(client => client.assigned_rep)
      .map(client => client.assigned_rep);

    if (repIds.length > 0) {
      const { data: reps, error: repsError } = await supabase
        .from('users')
        .select('id, full_name, avatar_url')
        .in('id', repIds);

      if (repsError) {
        console.warn('Error fetching assigned reps:', repsError);
      } else if (reps) {
        clients.forEach(client => {
          if (client.assigned_rep) {
            const rep = reps.find(r => r.id === client.assigned_rep);
            if (rep) {
              client.assigned_rep_user = {
                id: rep.id,
                full_name: rep.full_name,
                avatar_url: rep.avatar_url
              };
            }
          }
        });
      }
    }

    return {
      clients,
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

    const client = data as Client;

    if (client.assigned_rep) {
      const { data: repData, error: repError } = await supabase
        .from('users')
        .select('id, full_name, avatar_url')
        .eq('id', client.assigned_rep)
        .single();

      if (!repError && repData) {
        client.assigned_rep_user = {
          id: repData.id,
          full_name: repData.full_name,
          avatar_url: repData.avatar_url
        };
      }
    }

    return client;
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

    const activities = data as ClientActivity[];
    
    const userIds = activities
      .filter(activity => activity.created_by)
      .map(activity => activity.created_by);
    
    if (userIds.length > 0) {
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id, full_name, avatar_url')
        .in('id', userIds);

      if (!usersError && users) {
        activities.forEach(activity => {
          if (activity.created_by) {
            const user = users.find(u => u.id === activity.created_by);
            if (user) {
              activity.created_by_user = {
                id: user.id,
                full_name: user.full_name,
                avatar_url: user.avatar_url
              };
            }
          }
        });
      }
    }

    return activities;
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
