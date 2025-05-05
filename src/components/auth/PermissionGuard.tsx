
import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/use-permissions';
import { useToast } from '@/hooks/use-toast';

interface PermissionGuardProps {
  children: ReactNode;
  requiredResource?: string;
  requiredPermission?: 'read' | 'write' | 'delete';
  requiredRole?: 'admin' | 'owner' | 'employee' | 'social_manager';
  redirectTo?: string;
}

const PermissionGuard = ({
  children,
  requiredResource,
  requiredPermission = 'read',
  requiredRole,
  redirectTo = '/',
}: PermissionGuardProps) => {
  const { user } = useAuth();
  const { checkRole, checkPermission, isAdmin, isOwner } = usePermissions();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkAccess = async () => {
      if (!user) {
        setHasAccess(false);
        return;
      }

      // Admins and owners have full access to everything
      if (isAdmin || isOwner) {
        setHasAccess(true);
        return;
      }

      // Check for required role
      if (requiredRole && checkRole(requiredRole)) {
        setHasAccess(true);
        return;
      }

      // Check for required resource and permission
      if (requiredResource && requiredPermission) {
        const hasPermission = await checkPermission(requiredResource, requiredPermission);
        setHasAccess(hasPermission);
        return;
      }

      // If no specific requirements, allow access
      setHasAccess(true);
    };

    checkAccess();
  }, [user, requiredResource, requiredPermission, requiredRole, checkPermission, checkRole, isAdmin, isOwner]);

  // Show loading state while checking permissions
  if (hasAccess === null) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent"></div>
        <span className="mr-2">בודק הרשאות...</span>
      </div>
    );
  }

  // If no access, redirect and show toast
  if (!hasAccess) {
    // Show toast message
    toast({
      title: "אין הרשאת גישה",
      description: "אין לך הרשאות לצפייה בדף זה",
      variant: "destructive",
    });

    // Redirect to specified page
    return <Navigate to={redirectTo} replace />;
  }

  // If has access, render children
  return <>{children}</>;
};

export default PermissionGuard;
