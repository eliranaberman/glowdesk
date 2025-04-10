
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import UserTable from '@/components/users/UserTable';
import UserFilters from '@/components/users/UserFilters';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Check if current user is admin
  const checkAdminAccess = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user?.id)
        .single();

      if (error || !data || data.role !== 'admin') {
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

      const { data, error } = await supabase.auth.admin.listUsers();
      
      if (error) {
        throw error;
      }

      if (data) {
        setUsers(data.users as User[]);
        setFilteredUsers(data.users as User[]);
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
        (user.user_metadata?.full_name?.toLowerCase().includes(term) || '')
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(user => {
        if (statusFilter === 'active') {
          return !user.banned_until;
        } else {
          return user.banned_until;
        }
      });
    }
    
    // Apply role filter
    if (roleFilter !== 'all') {
      result = result.filter(user => 
        user.app_metadata?.role === roleFilter
      );
    }
    
    setFilteredUsers(result);
  };

  // Handle user actions (deactivate, promote, delete)
  const handleUserAction = async (actionType: string, userId: string) => {
    try {
      switch (actionType) {
        case 'deactivate':
          // Set banned_until to a future date (1 year from now)
          const banUntil = new Date();
          banUntil.setFullYear(banUntil.getFullYear() + 1);
          
          await supabase.auth.admin.updateUserById(
            userId,
            { user_metadata: { banned_until: banUntil.toISOString() } }
          );
          
          toast({
            title: "חשבון הושבת",
            description: "חשבון המשתמש הושבת בהצלחה",
          });
          break;
          
        case 'activate':
          await supabase.auth.admin.updateUserById(
            userId,
            { user_metadata: { banned_until: null } }
          );
          
          toast({
            title: "חשבון הופעל",
            description: "חשבון המשתמש הופעל בהצלחה",
          });
          break;
          
        case 'promote':
          await supabase.auth.admin.updateUserById(
            userId,
            { app_metadata: { role: 'admin' } }
          );
          
          // Also update user_roles table
          await supabase
            .from('user_roles')
            .upsert({ 
              user_id: userId, 
              role: 'admin' 
            });
          
          toast({
            title: "קידום בוצע",
            description: "המשתמש קודם לתפקיד מנהל בהצלחה",
          });
          break;
          
        case 'delete':
          await supabase.auth.admin.deleteUser(userId);
          
          toast({
            title: "חשבון נמחק",
            description: "חשבון המשתמש נמחק בהצלחה",
          });
          break;
          
        default:
          break;
      }
      
      // Refresh the user list
      fetchUsers();
    } catch (error) {
      console.error('Error performing user action:', error);
      toast({
        title: "שגיאה בביצוע הפעולה",
        description: "אירעה שגיאה בביצוע הפעולה. אנא נסה שוב.",
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
            <CardTitle>משתמשי המערכת</CardTitle>
            <CardDescription>סה"כ {filteredUsers.length} משתמשים</CardDescription>
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
                onUserAction={handleUserAction}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default UserManagement;
