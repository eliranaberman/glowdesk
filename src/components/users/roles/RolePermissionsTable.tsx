
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  addPermission,
  removePermission,
  getAvailablePermissions,
  Permission
} from '@/services/userRolesService';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

type ResourcePermission = {
  resource: string;
  permissions: {
    read: boolean;
    write: boolean;
    delete: boolean;
  };
};

type RolePermissionsMap = {
  admin: ResourcePermission[];
  owner: ResourcePermission[];
  employee: ResourcePermission[];
  social_manager: ResourcePermission[];
};

const resources = [
  'clients',
  'appointments',
  'inventory',
  'expenses',
  'tasks',
  'social_media',
  'marketing',
  'portfolio',
  'users',
  'reports',
];

const RolePermissionsTable = () => {
  const [permissionsMap, setPermissionsMap] = useState<RolePermissionsMap>({
    admin: [],
    owner: [],
    employee: [],
    social_manager: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      setIsLoading(true);
      const permissions = await getAvailablePermissions();
      
      // Initialize default structure
      const initialMap: RolePermissionsMap = {
        admin: resources.map(resource => ({
          resource,
          permissions: { read: false, write: false, delete: false }
        })),
        owner: resources.map(resource => ({
          resource,
          permissions: { read: false, write: false, delete: false }
        })),
        employee: resources.map(resource => ({
          resource,
          permissions: { read: false, write: false, delete: false }
        })),
        social_manager: resources.map(resource => ({
          resource,
          permissions: { read: false, write: false, delete: false }
        })),
      };
      
      // Fill with actual permissions
      permissions.forEach(permission => {
        const resourcePermissions = initialMap[permission.role as keyof RolePermissionsMap]?.find(
          r => r.resource === permission.resource
        );
        
        if (resourcePermissions && permission.permission in resourcePermissions.permissions) {
          resourcePermissions.permissions[permission.permission as keyof typeof resourcePermissions.permissions] = true;
        }
      });
      
      setPermissionsMap(initialMap);
    } catch (error) {
      console.error('Failed to fetch permissions:', error);
      toast({
        variant: 'destructive',
        title: 'שגיאה בטעינת הרשאות',
        description: 'אירעה שגיאה בטעינת הרשאות המערכת',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePermissionToggle = async (
    role: string,
    resource: string,
    permission: string,
    currentValue: boolean
  ) => {
    try {
      let success;
      
      if (currentValue) {
        // Remove permission
        success = await removePermission(role, resource, permission);
      } else {
        // Add permission
        success = await addPermission(role, resource, permission);
      }
      
      if (success) {
        // Update local state
        setPermissionsMap(prev => ({
          ...prev,
          [role]: prev[role as keyof RolePermissionsMap].map(res => 
            res.resource === resource 
              ? { 
                  ...res, 
                  permissions: { 
                    ...res.permissions, 
                    [permission]: !currentValue 
                  } 
                }
              : res
          )
        }));
      }
    } catch (error) {
      console.error('Failed to toggle permission:', error);
      toast({
        variant: 'destructive',
        title: 'שגיאה בעדכון הרשאה',
        description: 'אירעה שגיאה בעדכון הרשאות התפקיד',
      });
    }
  };

  const PermissionToggle = ({ 
    isGranted, 
    onChange 
  }: { 
    isGranted: boolean; 
    onChange: () => void; 
  }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={onChange}
      className="p-2 h-8 w-8"
    >
      {isGranted ? (
        <CheckCircle className="h-5 w-5 text-green-500" />
      ) : (
        <XCircle className="h-5 w-5 text-muted-foreground" />
      )}
    </Button>
  );

  const renderRoleTable = (role: keyof RolePermissionsMap, roleName: string) => (
    <div className="space-y-2">
      <h3 className="text-lg font-medium mb-2">{roleName}</h3>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">משאב</TableHead>
              <TableHead className="text-center">צפייה</TableHead>
              <TableHead className="text-center">עריכה</TableHead>
              <TableHead className="text-center">מחיקה</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {permissionsMap[role].map((resourcePerm) => (
              <TableRow key={`${role}-${resourcePerm.resource}`}>
                <TableCell className="font-medium">{resourcePerm.resource}</TableCell>
                <TableCell className="text-center">
                  <PermissionToggle
                    isGranted={resourcePerm.permissions.read}
                    onChange={() => handlePermissionToggle(
                      role, 
                      resourcePerm.resource, 
                      'read', 
                      resourcePerm.permissions.read
                    )}
                  />
                </TableCell>
                <TableCell className="text-center">
                  <PermissionToggle
                    isGranted={resourcePerm.permissions.write}
                    onChange={() => handlePermissionToggle(
                      role, 
                      resourcePerm.resource, 
                      'write', 
                      resourcePerm.permissions.write
                    )}
                  />
                </TableCell>
                <TableCell className="text-center">
                  <PermissionToggle
                    isGranted={resourcePerm.permissions.delete}
                    onChange={() => handlePermissionToggle(
                      role, 
                      resourcePerm.resource, 
                      'delete', 
                      resourcePerm.permissions.delete
                    )}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p>טוען הרשאות...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-8">
        {renderRoleTable('admin', 'מנהל מערכת (admin)')}
        {renderRoleTable('owner', 'בעל עסק (owner)')}
        {renderRoleTable('employee', 'עובד (employee)')}
        {renderRoleTable('social_manager', 'מנהל מדיה חברתית (social_manager)')}
      </div>
    </div>
  );
};

export default RolePermissionsTable;
