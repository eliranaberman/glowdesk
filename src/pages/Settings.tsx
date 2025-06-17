import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { UserRole, getUserRoles, getAllUsers, assignRole, removeRole, type UserWithRoles } from "@/services/userRolesService";
import { usePermissions } from "@/hooks/use-permissions";
import PermissionGuard from "@/components/auth/PermissionGuard";
import UserTable from "@/components/users/UserTable";
import UserFilters from "@/components/users/UserFilters";
import { AssignRoleTable, RolePermissionsTable, RoleDescriptions } from "@/components/users/roles";
import { 
  Loader2, 
  User2, 
  Save, 
  Mail, 
  Shield, 
  Briefcase, 
  PencilLine,
  Settings as SettingsIcon,
  Calendar,
  Bell,
  Users,
  KeyRound,
  Building,
  RefreshCcw,
  UserPlus
} from "lucide-react";

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { isAdmin, isOwner } = usePermissions();

  // Business info state
  const [businessInfo, setBusinessInfo] = useState({
    name: "By Chen Mizrahi",
    address: "רח׳ בן גוריון 132, תל אביב",
    phone: "054-1234567",
    email: "chen@nailsalon.co.il",
    website: "www.chen-nails.co.il",
  });

  // Booking settings state
  const [bookingSettings, setBookingSettings] = useState({
    allowOnlineBooking: true,
    advanceBookingDays: "14",
    minTimeSlot: "30",
    workStartTime: "09:00",
    workEndTime: "18:00",
    workDays: [0, 1, 2, 3, 4],
  });

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    reminderHours: "24",
  });

  // User profile state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // User management state
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserWithRoles[]>([]);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');

  // Load user profile
  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    setIsProfileLoading(true);
    try {
      if (!user) return;
      
      const { data: { user: userData } } = await supabase.auth.getUser();
      
      if (userData) {
        setEmail(userData.email || '');
        setFullName(userData.user_metadata?.full_name || '');
      }
      
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
      setIsProfileLoading(false);
    }
  };

  // Load users for management
  const fetchUsers = async () => {
    setIsUsersLoading(true);
    try {
      const usersWithRoles = await getAllUsers();
      
      if (usersWithRoles) {
        setUsers(usersWithRoles);
        setFilteredUsers(usersWithRoles);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "שגיאה בטעינת משתמשים",
        description: "אירעה שגיאה בטעינת רשימת המשתמשים",
        variant: "destructive",
      });
    } finally {
      setIsUsersLoading(false);
    }
  };

  // Filter users
  useEffect(() => {
    let result = [...users];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(user => 
        user.email.toLowerCase().includes(term) || 
        (user.full_name?.toLowerCase().includes(term) || '')
      );
    }
    
    if (roleFilter !== 'all') {
      result = result.filter(user => 
        user.roles.includes(roleFilter as any)
      );
    }
    
    setFilteredUsers(result);
  }, [searchTerm, statusFilter, roleFilter, users]);

  // Handlers
  const handleBusinessInfoUpdate = () => {
    toast({
      title: "פרטי העסק עודכנו",
      description: "פרטי העסק עודכנו בהצלחה"
    });
  };

  const handleBookingSettingsUpdate = () => {
    toast({
      title: "הגדרות קביעת התורים עודכנו",
      description: "הגדרות קביעת התורים עודכנו בהצלחה"
    });
  };

  const handleNotificationSettingsUpdate = () => {
    toast({
      title: "הגדרות התראות עודכנו",
      description: "הגדרות התראות עודכנו בהצלחה"
    });
  };

  const handleUpdateProfile = async () => {
    setIsUpdatingProfile(true);
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
      setIsUpdatingProfile(false);
    }
  };

  const handleRoleChange = async (userId: string, role: string, isAdding: boolean) => {
    try {
      let success;
      
      if (isAdding) {
        success = await assignRole(userId, role as any);
      } else {
        success = await removeRole(userId, role as any);
      }
      
      if (success) {
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

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'owner': return 'default';
      case 'employee': return 'secondary';
      case 'social_manager': return 'outline';
      default: return 'outline';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="h-3 w-3 ml-1" />;
      case 'owner': return <Briefcase className="h-3 w-3 ml-1" />;
      case 'employee': return <User2 className="h-3 w-3 ml-1" />;
      case 'social_manager': return <PencilLine className="h-3 w-3 ml-1" />;
      default: return null;
    }
  };

  return (
    <div dir="rtl">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <SettingsIcon className="h-6 w-6" />
            הגדרות מערכת
          </h1>
          <p className="text-muted-foreground">
            ניהול הגדרות העסק, המשתמשים והמערכת
          </p>
        </div>
      </div>

      <Tabs defaultValue="business" className="space-y-6">
        <TabsList className="grid grid-cols-2 lg:grid-cols-5 w-full">
          <TabsTrigger value="business" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            <span className="hidden sm:inline">פרטי העסק</span>
          </TabsTrigger>
          <TabsTrigger value="booking" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">קביעת תורים</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">התראות</span>
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User2 className="h-4 w-4" />
            <span className="hidden sm:inline">פרופיל</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">ניהול משתמשים</span>
          </TabsTrigger>
        </TabsList>

        {/* Business Info Tab */}
        <TabsContent value="business">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                פרטי העסק
              </CardTitle>
              <CardDescription>
                עדכן את פרטי העסק שלך שיוצגו ללקוחות
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="business-name">שם העסק</Label>
                <Input 
                  id="business-name" 
                  value={businessInfo.name} 
                  onChange={(e) => setBusinessInfo({...businessInfo, name: e.target.value})}
                />
              </div>
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="business-address">כתובת</Label>
                <Input 
                  id="business-address" 
                  value={businessInfo.address} 
                  onChange={(e) => setBusinessInfo({...businessInfo, address: e.target.value})}
                />
              </div>
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="business-phone">טלפון</Label>
                <Input 
                  id="business-phone" 
                  value={businessInfo.phone} 
                  onChange={(e) => setBusinessInfo({...businessInfo, phone: e.target.value})}
                />
              </div>
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="business-email">אימייל</Label>
                <Input 
                  id="business-email" 
                  type="email" 
                  value={businessInfo.email} 
                  onChange={(e) => setBusinessInfo({...businessInfo, email: e.target.value})}
                />
              </div>
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="business-website">אתר אינטרנט</Label>
                <Input 
                  id="business-website" 
                  value={businessInfo.website} 
                  onChange={(e) => setBusinessInfo({...businessInfo, website: e.target.value})}
                />
              </div>
              <Button onClick={handleBusinessInfoUpdate}>
                <Save className="h-4 w-4 ml-2" />
                שמור שינויים
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Booking Settings Tab */}
        <TabsContent value="booking">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                הגדרות קביעת תורים
              </CardTitle>
              <CardDescription>
                נהל את האפשרויות לקביעת תורים באתר
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="allow-online-booking" className="flex-1">
                  אפשר קביעת תורים אונליין
                </Label>
                <Switch 
                  id="allow-online-booking" 
                  checked={bookingSettings.allowOnlineBooking} 
                  onCheckedChange={(checked) => setBookingSettings({...bookingSettings, allowOnlineBooking: checked})}
                />
              </div>
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="advance-booking-days">ימים מראש לקביעת תורים</Label>
                <Input 
                  id="advance-booking-days" 
                  type="number" 
                  value={bookingSettings.advanceBookingDays} 
                  onChange={(e) => setBookingSettings({...bookingSettings, advanceBookingDays: e.target.value})}
                />
              </div>
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="min-time-slot">אורך התור המינימלי (דקות)</Label>
                <Input 
                  id="min-time-slot" 
                  type="number" 
                  value={bookingSettings.minTimeSlot} 
                  onChange={(e) => setBookingSettings({...bookingSettings, minTimeSlot: e.target.value})}
                />
              </div>
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="work-start-time">שעת תחילת עבודה</Label>
                <Input 
                  id="work-start-time" 
                  type="time" 
                  value={bookingSettings.workStartTime} 
                  onChange={(e) => setBookingSettings({...bookingSettings, workStartTime: e.target.value})}
                />
              </div>
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="work-end-time">שעת סיום עבודה</Label>
                <Input 
                  id="work-end-time" 
                  type="time" 
                  value={bookingSettings.workEndTime} 
                  onChange={(e) => setBookingSettings({...bookingSettings, workEndTime: e.target.value})}
                />
              </div>
              <Button onClick={handleBookingSettingsUpdate}>
                <Save className="h-4 w-4 ml-2" />
                שמור שינויים
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                הגדרות התראות
              </CardTitle>
              <CardDescription>
                נהל את ההתראות שנשלחות ללקוחות
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications" className="flex-1">
                  התראות במייל
                </Label>
                <Switch 
                  id="email-notifications" 
                  checked={notificationSettings.emailNotifications} 
                  onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, emailNotifications: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="sms-notifications" className="flex-1">
                  התראות SMS
                </Label>
                <Switch 
                  id="sms-notifications" 
                  checked={notificationSettings.smsNotifications} 
                  onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, smsNotifications: checked})}
                />
              </div>
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="reminder-hours">שעות לפני הפגישה לשליחת תזכורת</Label>
                <Input 
                  id="reminder-hours" 
                  type="number" 
                  value={notificationSettings.reminderHours} 
                  onChange={(e) => setNotificationSettings({...notificationSettings, reminderHours: e.target.value})}
                />
              </div>
              <Button onClick={handleNotificationSettingsUpdate}>
                <Save className="h-4 w-4 ml-2" />
                שמור שינויים
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Profile Tab */}
        <TabsContent value="profile">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User2 className="h-5 w-5" />
                    פרטי משתמש
                  </CardTitle>
                  <CardDescription>
                    המידע הבסיסי שלך במערכת
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center pt-6">
                  {isProfileLoading ? (
                    <div className="flex flex-col items-center">
                      <Loader2 className="h-8 w-8 animate-spin mb-4" />
                      <p>טוען פרטי משתמש...</p>
                    </div>
                  ) : (
                    <>
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
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>עדכון פרטי פרופיל</CardTitle>
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
                      <Label htmlFor="profile-email">כתובת דוא"ל</Label>
                      <Input
                        id="profile-email"
                        value={email}
                        disabled
                      />
                      <p className="text-sm text-muted-foreground">לא ניתן לשנות את כתובת הדוא"ל</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="profile-fullName">שם מלא</Label>
                      <Input
                        id="profile-fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="הזן את שמך המלא"
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={isUpdatingProfile}
                    >
                      {isUpdatingProfile ? (
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
        </TabsContent>

        {/* User Management Tab */}
        <TabsContent value="users">
          <PermissionGuard requiredRole="admin" redirectTo="/settings">
            <div className="space-y-6">
              {/* User Management Section */}
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        ניהול משתמשים
                      </CardTitle>
                      <CardDescription>סה"כ {filteredUsers.length} משתמשים</CardDescription>
                    </div>
                    <div className="flex gap-2 mt-2 sm:mt-0">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setIsUsersLoading(true);
                          setTimeout(() => {
                            fetchUsers();
                            toast({
                              title: "המערכת עודכנה",
                              description: "כל נתוני המשתמשים נטענו מחדש",
                            });
                          }, 1000);
                        }}
                        disabled={isUsersLoading}
                      >
                        {isUsersLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <RefreshCcw className="h-4 w-4" />
                        )}
                        רענן נתונים
                      </Button>
                      <Button variant="outline" size="sm">
                        <UserPlus className="mr-2 h-4 w-4" />
                        הזמן משתמש חדש
                      </Button>
                    </div>
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
                  
                  {isUsersLoading ? (
                    <div className="flex justify-center items-center py-10">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <span className="mr-2">טוען משתמשים...</span>
                    </div>
                  ) : filteredUsers.length === 0 ? (
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

              {/* Roles Management Section */}
              <Tabs defaultValue="role-descriptions" className="w-full">
                <TabsList className="grid grid-cols-3 w-full md:w-[500px]">
                  <TabsTrigger value="role-descriptions">תיאור תפקידים</TabsTrigger>
                  <TabsTrigger value="assign-roles">הקצאת תפקידים</TabsTrigger>
                  <TabsTrigger value="permissions">ניהול הרשאות</TabsTrigger>
                </TabsList>
                
                <TabsContent value="role-descriptions" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>הסבר על תפקידים במערכת</CardTitle>
                      <CardDescription>
                        מידע על התפקידים הקיימים במערכת וההרשאות שלהם
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <RoleDescriptions />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="assign-roles" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        הקצאת תפקידים למשתמשים
                      </CardTitle>
                      <CardDescription>
                        שיוך תפקידים למשתמשים במערכת
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <AssignRoleTable />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="permissions" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <KeyRound className="h-5 w-5" />
                        הרשאות לפי תפקידים
                      </CardTitle>
                      <CardDescription>
                        ניהול הרשאות גישה למשאבים לפי תפקיד
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <RolePermissionsTable />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </PermissionGuard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
