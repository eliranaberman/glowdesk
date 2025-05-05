
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import UserTable from '@/components/users/UserTable';
import UserFilters from '@/components/users/UserFilters';
import { Button } from '@/components/ui/button';
import { Loader2, UserPlus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  getAllUsers, 
  assignRole, 
  removeRole,
  hasRole,
  type UserWithRoles
} from '@/services/userRolesService';
import { usePermissions } from '@/hooks/use-permissions';

// User interface to define the structure of a user object
export interface User {
  id: string;
  email: string;
  user_metadata: {
    full_name: string;
  };
  app_metadata: {
    role?: string;
  };
  created_at: string;
  last_sign_in_at: string | null;
  banned_until: string | null;
}

const UserManagement = () => {
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserWithRoles[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isAdmin, isOwner } = usePermissions();

  // Check if current user is admin
  const checkAdminAccess = async () => {
    try {
      if (!user?.id) {
        toast({
          title: "נדרשת התחברות",
          description: "יש להתחבר תחילה למערכת",
          variant: "destructive",
        });
        navigate('/login');
        return false;
      }

      const isUserAdmin = await hasRole(user.id, 'admin');
      const isUserOwner = await hasRole(user.id, 'owner');

      if (!isUserAdmin && !isUserOwner) {
        toast({
          title: "אין הרשאת גישה",
          description: "רק למנהלי המערכת יש גישה לדף זה",
          variant: "destructive",
        });
        navigate('/');
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error checking admin access:', error);
      navigate('/');
      return false;
    }
  };

  // Fetch all users from Supabase
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const isAdmin = await checkAdminAccess();
      if (!isAdmin) return;

      const usersWithRoles = await getAllUsers();
      
      if (usersWithRoles) {
        setUsers(usersWithRoles);
        setFilteredUsers(usersWithRoles);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "שגיאה בטעינת משתמשים",
        description: "אירעה שגיאה בטעינת רשימת המשתמשים. אנא נסה שוב מאוחר יותר.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Apply filters to users
  const applyFilters = () => {
    let result = [...users];
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(user => 
        user.email.toLowerCase().includes(term) || 
        (user.full_name?.toLowerCase().includes(term) || '')
      );
    }
    
    // Apply status filter
    // Note: We'd need to add this logic if we track user status

    // Apply role filter
    if (roleFilter !== 'all') {
      result = result.filter(user => 
        user.roles.includes(roleFilter as any)
      );
    }
    
    setFilteredUsers(result);
  };

  // Handle user role changes
  const handleRoleChange = async (userId: string, role: string, isAdding: boolean) => {
    try {
      let success;
      
      if (isAdding) {
        success = await assignRole(userId, role as any);
      } else {
        success = await removeRole(userId, role as any);
      }
      
      if (success) {
        // Update local state to show the change
        setUsers(prevUsers => 
          prevUsers.map(user => {
            if (user.id === userId) {
              const roles = isAdding 
                ? [...user.roles, role as any]
                : user.roles.filter(r => r !== role);
              
              return { ...user, roles };
            }
            return user;
          })
        );
        
        // Apply filters to the updated list
        applyFilters();
      }
    } catch (error) {
      console.error('Error changing user role:', error);
      toast({
        title: "שגיאה בעדכון הרשאות",
        description: "אירעה שגיאה בעדכון הרשאות המשתמש",
        variant: "destructive",
      });
    }
  };

  // Effect for initial load
  useEffect(() => {
    fetchUsers();
  }, []);

  // Effect for filtering
  useEffect(() => {
    applyFilters();
  }, [searchTerm, statusFilter, roleFilter, users]);

  // If not loading but no users, show no users message
  const showNoUsers = !isLoading && filteredUsers.length === 0;

  return (
    <>
      <Helmet>
        <title>ניהול משתמשים | GlowDesk</title>
      </Helmet>
      
      <div className="container mx-auto py-6 space-y-6">
        <div className="text-center md:text-right">
          <h1 className="text-2xl font-bold">ניהול משתמשים</h1>
          <p className="text-muted-foreground">צפייה וניהול של כל המשתמשים במערכת</p>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <CardTitle>משתמשי המערכת</CardTitle>
                <CardDescription>סה"כ {filteredUsers.length} משתמשים</CardDescription>
              </div>
              <Button variant="outline" className="mt-2 sm:mt-0">
                <UserPlus className="mr-2 h-4 w-4" />
                הזמן משתמש חדש
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <UserFilters 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              roleFilter={roleFilter}
              setRoleFilter={setRoleFilter}
            />
            
            {isLoading ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="mr-2">טוען משתמשים...</span>
              </div>
            ) : showNoUsers ? (
              <div className="text-center py-10">
                <p className="text-muted-foreground">לא נמצאו משתמשים התואמים את החיפוש</p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setRoleFilter('all');
                  }}
                  className="mt-4"
                >
                  נקה סינון
                </Button>
              </div>
            ) : (
              <UserTable 
                users={filteredUsers}
                onRoleChange={handleRoleChange}
                currentUserId={user?.id}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default UserManagement;
