import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type Client = Tables<'clients'>;
export type ClientInsert = TablesInsert<'clients'>;
export type ClientUpdate = TablesUpdate<'clients'>;
export type ClientActivity = Tables<'client_activity'>;
export type ClientService = Tables<'client_services'>;

// Helper function to safely cast database types to our TypeScript types
const castClientActivity = (activity: any): import('@/types/clients').ClientActivity => {
  return {
    ...activity,
    type: activity.type as import('@/types/clients').ActivityType,
  };
};

const castClient = (client: any): import('@/types/clients').Client => {
  return {
    ...client,
    gender: client.gender as import('@/types/clients').ClientGender,
    status: client.status as import('@/types/clients').ClientStatus,
    tags: typeof client.tags === 'string' ? client.tags.split(',').filter(Boolean) : (client.tags || []),
    preferred_treatment: client.preferred_treatment,
    visit_count: client.visit_count || 0,
  };
};

// UUID validation function
const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

// Main client operations
export const getClients = async (
  search?: string,
  status?: string,
  sortBy: string = 'registration_date',
  sortOrder: string = 'desc',
  page: number = 1,
  pageSize: number = 20
) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not authenticated');

  console.log('Fetching clients for user:', user.user.id);

  let query = supabase
    .from('clients')
    .select(`
      *,
      assigned_rep_user:users!clients_assigned_rep_fkey(
        id,
        full_name,
        avatar_url
      )
    `, { count: 'exact' })
    .eq('user_id', user.user.id);

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,phone_number.ilike.%${search}%`);
  }

  if (status) {
    query = query.eq('status', status);
  }

  query = query.order(sortBy, { ascending: sortOrder === 'asc' });

  const { data, error, count } = await query
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (error) {
    console.error('Error fetching clients:', error);
    throw error;
  }
  
  console.log('Fetched clients:', data?.length || 0, 'Total count:', count);
  
  const clients = (data || []).map(castClient);
  return { clients, count: count || 0 };
};

export const getClient = async (id: string) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not authenticated');

  // Validate UUID format before making the request
  if (!isValidUUID(id)) {
    throw new Error('Invalid client ID format');
  }

  console.log('Fetching client from database with ID:', id);

  const { data, error } = await supabase
    .from('clients')
    .select(`
      *,
      assigned_rep_user:users!clients_assigned_rep_fkey(
        id,
        full_name,
        avatar_url
      )
    `)
    .eq('id', id)
    .eq('user_id', user.user.id)
    .maybeSingle();

  if (error) {
    console.error('Supabase error:', error);
    throw error;
  }
  
  if (!data) {
    console.log('No client found with ID:', id);
    return null;
  }

  console.log('Client found:', data.full_name);
  return castClient(data);
};

export const createClient = async (client: Omit<import('@/types/clients').Client, 'id' | 'created_at' | 'updated_at'>) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not authenticated');

  // Convert tags array to string for database storage
  const clientData = {
    ...client,
    tags: Array.isArray(client.tags) ? client.tags.join(',') : client.tags,
    user_id: user.user.id,
    assigned_rep: user.user.id,
    preferred_treatment: client.preferred_treatment,
    visit_count: client.visit_count || 0
  };

  const { data, error } = await supabase
    .from('clients')
    .insert(clientData)
    .select()
    .single();

  if (error) throw error;
  return castClient(data);
};

export const updateClient = async (id: string, updates: Partial<import('@/types/clients').Client>) => {
  console.log('🔄 updateClient called with:', { id, updates });
  
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not authenticated');
  
  console.log('👤 Authenticated user:', user.user.id);

  // Validate UUID format
  if (!isValidUUID(id)) {
    console.error('❌ Invalid UUID format:', id);
    throw new Error('Invalid client ID format');
  }
  console.log('✅ Valid UUID format:', id);

  // Filter out computed fields and system fields that shouldn't be updated
  const { assigned_rep_user, created_at, updated_at, id: clientId, ...filteredUpdates } = updates;
  
  // Convert tags array to string for database storage
  const updateData = {
    ...filteredUpdates,
    tags: Array.isArray(filteredUpdates.tags) ? filteredUpdates.tags.join(',') : filteredUpdates.tags,
    preferred_treatment: filteredUpdates.preferred_treatment,
    visit_count: filteredUpdates.visit_count
  };
  
  console.log('📝 Update data prepared:', updateData);

  const { data, error } = await supabase
    .from('clients')
    .update(updateData)
    .eq('id', id)
    .eq('user_id', user.user.id)
    .select()
    .single();

  console.log('🔍 Supabase response:', { data, error });

  if (error) {
    console.error('❌ Supabase error details:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    });
    throw error;
  }
  
  console.log('✅ Client updated successfully:', data);
  return castClient(data);
};

export const deleteClient = async (id: string) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not authenticated');

  // Validate UUID format
  if (!isValidUUID(id)) {
    throw new Error('Invalid client ID format');
  }

  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id)
    .eq('user_id', user.user.id);

  if (error) throw error;
};

// Client services operations
export const getClientServices = async (clientId: string) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not authenticated');

  // Validate UUID format
  if (!isValidUUID(clientId)) {
    throw new Error('Invalid client ID format');
  }

  const { data, error } = await supabase
    .from('client_services')
    .select('*')
    .eq('client_id', clientId)
    .eq('created_by', user.user.id)
    .order('service_date', { ascending: false });

  if (error) throw error;
  return data;
};

export const createClientService = async (service: Omit<TablesInsert<'client_services'>, 'created_by'>) => {
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
};

// Client activity operations  
export const getClientActivities = async (clientId: string) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not authenticated');

  // Validate UUID format
  if (!isValidUUID(clientId)) {
    throw new Error('Invalid client ID format');
  }

  const { data, error } = await supabase
    .from('client_activity')
    .select(`
      *,
      created_by_user:users!client_activity_created_by_fkey(
        id,
        full_name,
        avatar_url
      )
    `)
    .eq('client_id', clientId)
    .eq('created_by', user.user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(castClientActivity);
};

export const createClientActivity = async (activity: Omit<import('@/types/clients').ClientActivity, 'id' | 'created_at'>) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('client_activity')
    .insert({
      client_id: activity.client_id,
      type: activity.type,
      description: activity.description,
      date: activity.date,
      created_by: user.user.id
    })
    .select()
    .single();

  if (error) throw error;
  return castClientActivity(data);
};

// Keep the service object for backward compatibility
export const clientService = {
  getClients,
  getClient,
  createClient,
  updateClient,
  deleteClient,
  getClientServices,
  createClientService,
  getClientActivities,
  createClientActivity
};
