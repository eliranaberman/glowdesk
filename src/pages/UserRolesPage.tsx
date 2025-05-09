
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { usePermissions } from '@/hooks/use-permissions';
import PermissionGuard from '@/components/auth/PermissionGuard';
import { Badge } from '@/components/ui/badge';
import { 
  AssignRoleTable, 
  RolePermissionsTable,
  RoleDescriptions
} from '@/components/users/roles';
import { 
  Shield, 
  Users, 
  KeyRound, 
  RefreshCcw,
} from 'lucide-react';

const UserRolesPage = () => {
  const { toast } = useToast();
  const { isAdmin, isOwner } = usePermissions();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <PermissionGuard requiredRole="admin" redirectTo="/dashboard">
      <Layout>
        <Helmet>
          <title>ניהול תפקידים והרשאות | GlowDesk</title>
        </Helmet>
        
        <div className="container mx-auto py-6 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">ניהול תפקידים והרשאות</h1>
              <p className="text-muted-foreground">
                הגדר תפקידים והרשאות למשתמשים במערכת
              </p>
            </div>
            
            <div className="flex gap-2 mt-4 md:mt-0">
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-2"
                onClick={() => {
                  setIsLoading(true);
                  setTimeout(() => {
                    setIsLoading(false);
                    toast({
                      title: "המערכת עודכנה",
                      description: "כל נתוני התפקידים וההרשאות נטענו מחדש",
                    });
                  }, 1000);
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <RefreshCcw className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCcw className="h-4 w-4" />
                )}
                רענן נתונים
              </Button>
            </div>
          </div>

          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-medium">הסבר על תפקידים במערכת</CardTitle>
              <CardDescription>
                מידע על התפקידים הקיימים במערכת וההרשאות שלהם
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RoleDescriptions />
            </CardContent>
          </Card>

          <Tabs defaultValue="assign-roles" className="w-full">
            <TabsList className="grid grid-cols-2 w-full md:w-[400px] mb-6">
              <TabsTrigger value="assign-roles" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>הקצאת תפקידים</span>
              </TabsTrigger>
              <TabsTrigger value="permissions" className="flex items-center gap-2">
                <KeyRound className="h-4 w-4" />
                <span>ניהול הרשאות</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="assign-roles" className="space-y-4">
              <Card className="border shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-medium">הקצאת תפקידים למשתמשים</CardTitle>
                  <CardDescription>
                    שיוך תפקידים למשתמשים במערכת
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AssignRoleTable />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="permissions" className="space-y-4">
              <Card className="border shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-medium">הרשאות לפי תפקידים</CardTitle>
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
      </Layout>
    </PermissionGuard>
  );
};

export default UserRolesPage;
