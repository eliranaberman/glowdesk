
import { supabase } from '@/lib/supabase';

export const checkAdminStatus = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single();

    if (!error && data && data.role === 'admin') {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};
