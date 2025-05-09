
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface RoleContextType {
  userRoles: string[];
  hasRole: (role: string) => boolean;
  hasPermission: (resource: string, permission: string) => boolean;
  isLoading: boolean;
}

const RolesContext = createContext<RoleContextType | undefined>(undefined);

export const RolesProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [permissions, setPermissions] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserRoles = async () => {
      if (!user) {
        setUserRoles([]);
        setPermissions({});
        setIsLoading(false);
        return;
      }

      try {
        console.log("Fetching roles for user:", user.id);
        setIsLoading(true);
        
        // Fetch user roles
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        if (roleError) {
          throw roleError;
        }

        const roles = roleData.map(r => r.role);
        setUserRoles(roles);
        
        // Fetch permissions for these roles
        if (roles.length > 0) {
          const { data: permissionData, error: permissionError } = await supabase
            .from('role_permissions')
            .select('role, resource, permission')
            .in('role', roles);

          if (permissionError) {
            throw permissionError;
          }

          // Group permissions by resource
          const permMap: Record<string, string[]> = {};
          permissionData.forEach(p => {
            const key = `${p.resource}:${p.permission}`;
            if (!permMap[key]) {
              permMap[key] = [];
            }
          });
          
          setPermissions(permMap);
        }
      } catch (error) {
        console.error('Error fetching user roles and permissions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRoles();
  }, [user]);

  const hasRole = (role: string): boolean => {
    return userRoles.includes(role);
  };

  const hasPermission = (resource: string, permission: string): boolean => {
    const key = `${resource}:${permission}`;
    return !!permissions[key];
  };

  const value = {
    userRoles,
    hasRole,
    hasPermission,
    isLoading,
  };

  return (
    <RolesContext.Provider value={value}>{children}</RolesContext.Provider>
  );
};

export const useRoles = () => {
  const context = useContext(RolesContext);
  if (context === undefined) {
    throw new Error('useRoles must be used within a RolesProvider');
  }
  return context;
};
