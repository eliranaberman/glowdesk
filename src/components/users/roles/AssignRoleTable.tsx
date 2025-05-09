
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  getAllUsers, 
  assignRole, 
  removeRole,
  UserWithRoles,
  UserRole
} from '@/services/userRolesService';
import { format } from 'date-fns';

const AssignRoleTable = () => {
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserWithRoles[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(
        user => user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (user.full_name && user.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const allUsers = await getAllUsers();
      setUsers(allUsers);
      setFilteredUsers(allUsers);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast({
        variant: 'destructive',
        title: 'שגיאה בטעינת משתמשים',
        description: 'אירעה שגיאה בטעינת רשימת המשתמשים',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleToggle = async (userId: string, role: UserRole, currentStatus: boolean) => {
    try {
      let success;
      
      if (currentStatus) {
        // Remove role
        success = await removeRole(userId, role);
      } else {
        // Add role
        success = await assignRole(userId, role);
      }
      
      if (success) {
        // Update local state
        setUsers(prevUsers => prevUsers.map(user => {
          if (user.id === userId) {
            const newRoles = currentStatus 
              ? user.roles.filter(r => r !== role) 
              : [...user.roles, role];
            
            return { ...user, roles: newRoles };
          }
          return user;
        }));
      }
    } catch (error) {
      console.error('Failed to toggle role:', error);
      toast({
        variant: 'destructive',
        title: 'שגיאה בעדכון תפקיד',
        description: 'אירעה שגיאה בעדכון תפקיד המשתמש',
      });
    }
  };

  const RoleButton = ({ userId, role, userRoles }: { userId: string, role: UserRole, userRoles: UserRole[] }) => {
    const hasRole = userRoles.includes(role);
    
    return (
      <Button
        variant={hasRole ? "default" : "outline"}
        size="sm"
        onClick={() => handleRoleToggle(userId, role, hasRole)}
        className={hasRole ? "opacity-100" : "opacity-70"}
      >
        {role}
      </Button>
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p>טוען משתמשים...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="חיפוש לפי שם או אימייל..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pr-10"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">משתמש</TableHead>
              <TableHead className="text-right">תאריך הצטרפות</TableHead>
              <TableHead className="text-right">תפקידים</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-10 text-muted-foreground">
                  לא נמצאו משתמשים התואמים את החיפוש
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{user.full_name || 'ללא שם'}</span>
                      <span className="text-sm text-muted-foreground">{user.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.created_at ? format(new Date(user.created_at), 'dd/MM/yyyy') : 'לא זמין'}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      <RoleButton userId={user.id} role="admin" userRoles={user.roles} />
                      <RoleButton userId={user.id} role="owner" userRoles={user.roles} />
                      <RoleButton userId={user.id} role="employee" userRoles={user.roles} />
                      <RoleButton userId={user.id} role="social_manager" userRoles={user.roles} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AssignRoleTable;
