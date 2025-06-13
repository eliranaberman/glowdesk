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
  created_at?: string;
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
    
    // בדיקה אם המשתמש הוא admin - רק admins יכולים לראות תפקידים
    const { data: adminCheck, error: adminError } = await supabase
      .rpc('is_admin_user', { user_id: userId });

    if (adminError) {
      console.error('Error checking admin status:', adminError);
      // אם אין הרשאת admin, נחזיר רשימה ריקה
      return [];
    }

    if (!adminCheck) {
      console.log('User is not admin, returning empty roles array');
      return [];
    }

    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching user roles:', error);
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
    
    // בדיקה אם המשתמש הוא admin
    const { data: adminCheck, error: adminError } = await supabase
      .rpc('is_admin_user', { user_id: userId });

    if (adminError) {
      console.error('Error checking admin status:', adminError);
      return false;
    }

    if (!adminCheck) {
      console.log('User is not admin, cannot check roles');
      return false;
    }

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
    
    // תחילה נבדוק אם המשתמש הוא admin
    const { data: adminCheck, error: adminError } = await supabase
      .rpc('is_admin_user', { user_id: userId });

    if (adminError) {
      console.error('Error checking admin status:', adminError);
      return false;
    }

    // אם המשתמש הוא admin, יש לו הרשאה לכל
    if (adminCheck) {
      console.log('User is admin, granting permission');
      return true;
    }

    // אם לא admin, נוודא שיש לו הרשאה לצפות בתפקידים
    console.log('User is not admin, checking specific permissions');
    
    // לכל המשתמשים שאינם admin, נתן הרשאות בסיסיות
    const basicPermissions = [
      { resource: 'expenses', permission: 'read' },
      { resource: 'revenues', permission: 'read' },
      { resource: 'clients', permission: 'read' },
      { resource: 'appointments', permission: 'read' }
    ];

    const hasBasicPermission = basicPermissions.some(
      p => p.resource === resource && p.permission === permission
    );

    console.log('Has basic permission:', hasBasicPermission);
    return hasBasicPermission;
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
      if (error.code === '23505') {
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
    const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) throw usersError;
    
    const users = usersData.users.map(user => ({
      id: user.id,
      email: user.email || '',
      full_name: user.user_metadata?.full_name,
      roles: [] as UserRole[],
      created_at: user.created_at
    }));
    
    // נשיג תפקידים רק עבור admins
    const { data: rolesData, error: rolesError } = await supabase
      .from('user_roles')
      .select('user_id, role');
      
    if (rolesError) {
      console.error('Error fetching roles:', rolesError);
    } else {
      rolesData?.forEach(roleMapping => {
        const user = users.find(u => u.id === roleMapping.user_id);
        if (user) {
          user.roles.push(roleMapping.role as UserRole);
        }
      });
    }
    
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
      if (error.code === '23505') {
        return false;
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
