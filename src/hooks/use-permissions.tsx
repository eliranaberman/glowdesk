
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getUserRoles, 
  hasPermission, 
  hasRole,
  type UserRole 
} from '@/services/userRolesService';

interface PermissionHook {
  userRoles: UserRole[];
  isAdmin: boolean;
  isOwner: boolean;
  isEmployee: boolean;
  isSocialManager: boolean;
  checkRole: (role: UserRole) => boolean;
  
  loading: boolean;
  canRead: (resource: string) => Promise<boolean>;
  canWrite: (resource: string) => Promise<boolean>;
  canDelete: (resource: string) => Promise<boolean>;
  checkPermission: (resource: string, permission: string) => Promise<boolean>;
}

export const usePermissions = (): PermissionHook => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);

  useEffect(() => {
    const fetchUserRoles = async () => {
      if (!user?.id) {
        setUserRoles([]);
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching roles for user in hook:', user.id);
        const roles = await getUserRoles(user.id);
        console.log('Roles received in hook:', roles);
        setUserRoles(roles);
      } catch (error) {
        console.error('Error fetching user roles in hook:', error);
        // במקרה של שגיאה, נניח שהמשתמש הוא employee רגיל
        setUserRoles(['employee']);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRoles();
  }, [user?.id]);

  const isAdmin = userRoles.includes('admin');
  const isOwner = userRoles.includes('owner');
  const isEmployee = userRoles.includes('employee');
  const isSocialManager = userRoles.includes('social_manager');

  const checkRole = (role: UserRole): boolean => {
    return userRoles.includes(role);
  };

  const checkPermission = async (resource: string, permission: string): Promise<boolean> => {
    if (!user?.id) return false;
    
    // Admins and owners have all permissions
    if (isAdmin || isOwner) return true;
    
    return await hasPermission(user.id, resource, permission);
  };

  const canRead = async (resource: string): Promise<boolean> => {
    return checkPermission(resource, 'read');
  };

  const canWrite = async (resource: string): Promise<boolean> => {
    return checkPermission(resource, 'write');
  };

  const canDelete = async (resource: string): Promise<boolean> => {
    return checkPermission(resource, 'delete');
  };

  return {
    userRoles,
    isAdmin,
    isOwner,
    isEmployee,
    isSocialManager,
    checkRole,
    loading,
    canRead,
    canWrite,
    canDelete,
    checkPermission
  };
};

export default usePermissions;
