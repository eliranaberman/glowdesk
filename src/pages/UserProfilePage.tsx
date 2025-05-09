
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { UserRole, getUserRoles } from '@/services/userRolesService';
import { Loader2, User2, Save, Mail, Shield, Briefcase, PencilLine } from 'lucide-react';

const UserProfilePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  
  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);
  
  const loadUserProfile = async () => {
    setIsLoading(true);
    try {
      if (!user) return;
      
      // Get user metadata
      const { data: { user: userData } } = await supabase.auth.getUser();
      
      if (userData) {
        setEmail(userData.email || '');
        setFullName(userData.user_metadata?.full_name || '');
      }
      
      // Get user roles
      const roles = await getUserRoles(user.id);
      setUserRoles(roles);
      
    } catch (error) {
      console.error('Error loading user profile:', error);
      toast({
        variant: 'destructive',
        title: 'שגיאה בטעינת פרופיל',
        description: 'אירעה שגיאה בטעינת פרטי המשתמש',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName }
      });
      
      if (error) throw error;
      
      toast({
        title: 'הפרופיל עודכן',
        description: 'פרטי המשתמש עודכנו בהצלחה',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: 'destructive',
        title: 'שגיאה בעדכון פרופיל',
        description: 'אירעה שגיאה בעדכון פרטי המשתמש',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'owner':
        return 'default';
      case 'employee':
        return 'secondary';
      case 'social_manager':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-3 w-3 ml-1" />;
      case 'owner':
        return <Briefcase className="h-3 w-3 ml-1" />;
      case 'employee':
        return <User2 className="h-3 w-3 ml-1" />;
      case 'social_manager':
        return <PencilLine className="h-3 w-3 ml-1" />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <p>טוען פרטי משתמש...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>פרופיל משתמש | GlowDesk</title>
      </Helmet>
      
      <div className="container mx-auto py-6 space-y-6">
        <h1 className="text-2xl font-bold mb-6">פרופיל משתמש</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <Card className="border shadow-sm h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium">פרטי משתמש</CardTitle>
                <CardDescription>
                  המידע הבסיסי שלך במערכת
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center pt-6">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src="/placeholder.svg" alt={fullName} />
                  <AvatarFallback>
                    {fullName.split(' ').map(name => name[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <h3 className="text-xl font-semibold">{fullName}</h3>
                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <Mail className="h-4 w-4 mr-1" />
                  <span>{email}</span>
                </div>
                
                <div className="flex flex-wrap gap-2 justify-center">
                  {userRoles.length > 0 ? (
                    userRoles.map(role => (
                      <Badge key={role} variant={getRoleBadgeVariant(role)}>
                        {getRoleIcon(role)}
                        {role}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">לא הוקצו תפקידים</span>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Edit Profile Card */}
          <div className="md:col-span-2">
            <Card className="border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium">עדכון פרטי פרופיל</CardTitle>
                <CardDescription>
                  עדכון הפרטים האישיים שלך במערכת
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdateProfile();
                }}>
                  <div className="space-y-2">
                    <Label htmlFor="email">כתובת דוא"ל</Label>
                    <Input
                      id="email"
                      value={email}
                      disabled
                    />
                    <p className="text-sm text-muted-foreground">לא ניתן לשנות את כתובת הדוא"ל</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fullName">שם מלא</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="הזן את שמך המלא"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        מעדכן...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        שמור שינויים
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfilePage;
