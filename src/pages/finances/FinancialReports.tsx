
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReportsGenerator from '@/components/finances/ReportsGenerator';
import PermissionGuard from '@/components/auth/PermissionGuard';

const FinancialReports = () => {
  return (
    <PermissionGuard requiredResource="finances" requiredPermission="read" redirectTo="/dashboard">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">דוחות פיננסיים</h1>
        
        <Tabs defaultValue="generate" className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="generate">יצירת דוחות</TabsTrigger>
            <TabsTrigger value="saved">דוחות שנשמרו</TabsTrigger>
          </TabsList>
          
          <TabsContent value="generate" className="space-y-6">
            <ReportsGenerator />
          </TabsContent>
          
          <TabsContent value="saved" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-right">דוחות שנשמרו</CardTitle>
                <CardDescription className="text-right">
                  רשימת הדוחות שיצרת ושמרת במערכת
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground">אין דוחות שמורים כרגע</p>
                <p className="text-sm text-muted-foreground mt-2">צור דוח חדש בלשונית "יצירת דוחות" ושמור אותו</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PermissionGuard>
  );
};

export default FinancialReports;
