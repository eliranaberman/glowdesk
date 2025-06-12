import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export type UserRole = 'admin' | 'owner' | 'employee' | 'social_manager' | 'finance_manager';

export interface UserRoleMapping {
  id: string;
  user_id: string;
  role: UserRole;
}

export interface UserWithRoles {
  id: string;
  email: string;
  full_name?: string;
  roles: UserRole[];
  created_at?: string; // Added this property
}

export interface Permission {
  id: string;
  role: string;
  resource: string;
  permission: string;
}

export const getUserRoles = async (userId: string): Promise<UserRole[]> => {
  try {
    console.log('Fetching roles for user:', userId);
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching user roles:', error);
      // במקרה של שגיאה, נחזיר רשימה ריקה במקום להשליך שגיאה
      return [];
    }
    
    console.log('User roles fetched:', data);
    return data?.map(r => r.role as UserRole) || [];
  } catch (error) {
    console.error('Error fetching user roles:', error);
    return [];
  }
};

export const hasRole = async (userId: string, requiredRole: UserRole): Promise<boolean> => {
  try {
    console.log('Checking if user has role:', { userId, requiredRole });
    
    // נשתמש בשאילתה ישירה במקום ב-RPC כדי להימנע מבעיות RLS
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', requiredRole)
      .limit(1);

    if (error) {
      console.error('Error checking role:', error);
      return false;
    }
    
    const hasRoleResult = (data && data.length > 0);
    console.log('Has role result:', hasRoleResult);
    return hasRoleResult;
  } catch (error) {
    console.error('Error checking role:', error);
    return false;
  }
};

export const hasPermission = async (
  userId: string, 
  resource: string, 
  permission: string
): Promise<boolean> => {
  try {
    console.log('Checking permission:', { userId, resource, permission });
    
    // נשתמש בשאילתה ישירה עם JOIN
    const { data, error } = await supabase
      .from('user_roles')
      .select(`
        role,
        role_permissions!inner(
          resource,
          permission
        )
      `)
      .eq('user_id', userId)
      .eq('role_permissions.resource', resource)
      .eq('role_permissions.permission', permission)
      .limit(1);

    if (error) {
      console.error('Error checking permission:', error);
      return false;
    }
    
    const hasPermissionResult = (data && data.length > 0);
    console.log('Has permission result:', hasPermissionResult);
    return hasPermissionResult;
  } catch (error) {
    console.error('Error checking permission:', error);
    return false;
  }
};

export const assignRole = async (userId: string, role: UserRole): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_roles')
      .insert({ user_id: userId, role })
      .select();

    if (error) {
      if (error.code === '23505') { // Duplicate key violation
        toast({
          title: 'תפקיד כבר קיים',
          description: `המשתמש כבר משויך לתפקיד ${role}`,
          variant: 'destructive',
        });
      } else {
        throw error;
      }
      return false;
    }

    toast({
      title: 'תפקיד נוסף בהצלחה',
      description: `תפקיד ${role} נוסף למשתמש בהצלחה`,
    });

    return true;
  } catch (error) {
    console.error('Error assigning role:', error);
    toast({
      title: 'שגיאה בהוספת תפקיד',
      description: 'אירעה שגיאה בהוספת תפקיד למשתמש',
      variant: 'destructive',
    });
    return false;
  }
};

export const removeRole = async (userId: string, role: UserRole): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId)
      .eq('role', role);

    if (error) throw error;

    toast({
      title: 'תפקיד הוסר בהצלחה',
      description: `תפקיד ${role} הוסר מהמשתמש בהצלחה`,
    });

    return true;
  } catch (error) {
    console.error('Error removing role:', error);
    toast({
      title: 'שגיאה בהסרת תפקיד',
      description: 'אירעה שגיאה בהסרת תפקיד מהמשתמש',
      variant: 'destructive',
    });
    return false;
  }
};

export const getAllUsers = async (): Promise<UserWithRoles[]> => {
  try {
    // Get all users from auth.users
    const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) throw usersError;
    
    const users = usersData.users.map(user => ({
      id: user.id,
      email: user.email || '',
      full_name: user.user_metadata?.full_name,
      roles: [] as UserRole[],
      created_at: user.created_at // Include created_at from users data
    }));
    
    // Get all role assignments
    const { data: rolesData, error: rolesError } = await supabase
      .from('user_roles')
      .select('user_id, role');
      
    if (rolesError) throw rolesError;
    
    // Add roles to each user
    rolesData?.forEach(roleMapping => {
      const user = users.find(u => u.id === roleMapping.user_id);
      if (user) {
        user.roles.push(roleMapping.role as UserRole);
      }
    });
    
    return users;
  } catch (error) {
    console.error('Error fetching all users with roles:', error);
    return [];
  }
};

export const getAvailablePermissions = async (): Promise<Permission[]> => {
  try {
    const { data, error } = await supabase
      .from('role_permissions')
      .select('*');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching available permissions:', error);
    return [];
  }
};

export const addPermission = async (
  role: string, 
  resource: string, 
  permission: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('role_permissions')
      .insert({ role, resource, permission });

    if (error) {
      if (error.code === '23505') { // Duplicate key violation
        return false; // Permission already exists
      }
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error adding permission:', error);
    toast({
      title: 'שגיאה בהוספת הרשאה',
      description: 'אירעה שגיאה בהוספת הרשאה לתפקיד',
      variant: 'destructive',
    });
    return false;
  }
};

export const removePermission = async (
  role: string, 
  resource: string, 
  permission: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('role_permissions')
      .delete()
      .eq('role', role)
      .eq('resource', resource)
      .eq('permission', permission);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error removing permission:', error);
    toast({
      title: 'שגיאה בהסרת הרשאה',
      description: 'אירעה שגיאה בהסרת הרשאה מתפקיד',
      variant: 'destructive',
    });
    return false;
  }
};
