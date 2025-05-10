
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getUserRoles, 
  hasPermission, 
  hasRole,
  type UserRole 
} from '@/services/userRolesService';

// Update UserRole to include finance_manager
export type ExtendedUserRole = UserRole | 'finance_manager';

interface PermissionHook {
  // Role checking
  userRoles: ExtendedUserRole[];
  isAdmin: boolean;
  isOwner: boolean;
  isEmployee: boolean;
  isSocialManager: boolean;
  isFinanceManager: boolean;
  checkRole: (role: ExtendedUserRole) => boolean;
  
  // Permission checking
  loading: boolean;
  canRead: (resource: string) => Promise<boolean>;
  canWrite: (resource: string) => Promise<boolean>;
  canDelete: (resource: string) => Promise<boolean>;
  checkPermission: (resource: string, permission: string) => Promise<boolean>;
}

export const usePermissions = (): PermissionHook => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userRoles, setUserRoles] = useState<ExtendedUserRole[]>([]);

  useEffect(() => {
    const fetchUserRoles = async () => {
      if (!user?.id) {
        setUserRoles([]);
        setLoading(false);
        return;
      }

      try {
        const roles = await getUserRoles(user.id) as ExtendedUserRole[];
        setUserRoles(roles);
      } catch (error) {
        console.error('Error fetching user roles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRoles();
  }, [user?.id]);

  // Role checking helpers
  const isAdmin = userRoles.includes('admin');
  const isOwner = userRoles.includes('owner');
  const isEmployee = userRoles.includes('employee');
  const isSocialManager = userRoles.includes('social_manager');
  const isFinanceManager = userRoles.includes('finance_manager');

  const checkRole = (role: ExtendedUserRole): boolean => {
    return userRoles.includes(role);
  };

  // Permission checking helpers
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
    isFinanceManager,
    checkRole,
    loading,
    canRead,
    canWrite,
    canDelete,
    checkPermission
  };
};

export default usePermissions;
