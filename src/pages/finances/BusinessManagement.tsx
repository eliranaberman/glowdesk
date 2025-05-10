
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { usePermissions } from '@/hooks/use-permissions';
import { useAuth } from '@/contexts/AuthContext';
import PermissionGuard from '@/components/auth/PermissionGuard';

const BusinessManagement = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useAuth();
  const { canWrite } = usePermissions();
  const [canModifyFinancialData, setCanModifyFinancialData] = useState(false);
  
  React.useEffect(() => {
    const checkPermissions = async () => {
      if (user?.id) {
        const hasWritePermission = await canWrite('finances');
        setCanModifyFinancialData(hasWritePermission);
      }
    };

    checkPermissions();
  }, [user, canWrite]);

  return (
    <PermissionGuard requiredResource="finances" requiredPermission="read" redirectTo="/dashboard">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">ניהול פיננסי</h1>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              יצא נתונים
            </Button>
            {canModifyFinancialData && (
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                הוסף עסקה
              </Button>
            )}
          </div>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="overview">סקירה כללית</TabsTrigger>
            <TabsTrigger value="revenues">הכנסות</TabsTrigger>
            <TabsTrigger value="expenses">הוצאות</TabsTrigger>
            <TabsTrigger value="reports">דוחות</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-right">הכנסה חודשית</CardTitle>
                  <CardDescription className="text-right">סך הכנסות החודש הנוכחי</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-right">₪22,500</div>
                  <div className="flex items-center mt-2">
                    <span className="text-sm text-green-500 font-medium">+15%</span>
                    <span className="text-sm text-muted-foreground mr-2">מהחודש שעבר</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-right">הוצאה חודשית</CardTitle>
                  <CardDescription className="text-right">סך הוצאות החודש הנוכחי</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-right">₪11,200</div>
                  <div className="flex items-center mt-2">
                    <span className="text-sm text-rose-500 font-medium">+4%</span>
                    <span className="text-sm text-muted-foreground mr-2">מהחודש שעבר</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-right">רווח חודשי</CardTitle>
                  <CardDescription className="text-right">רווח נקי בחודש הנוכחי</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-right">₪11,300</div>
                  <div className="flex items-center mt-2">
                    <span className="text-sm text-green-500 font-medium">+26%</span>
                    <span className="text-sm text-muted-foreground mr-2">מהחודש שעבר</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-right">סקירה פיננסית</CardTitle>
                <CardDescription className="text-right">
                  מצב פיננסי כולל של העסק
                </CardDescription>
              </CardHeader>
              <CardContent className="text-right">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">סקירת רווח והפסד</h3>
                    <div className="relative overflow-x-auto">
                      <table className="w-full text-sm text-right">
                        <thead className="text-xs uppercase bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3">קטגוריה</th>
                            <th scope="col" className="px-6 py-3">סכום</th>
                            <th scope="col" className="px-6 py-3">השוואה</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="bg-white border-b">
                            <td className="px-6 py-3 font-medium">סה"כ הכנסות</td>
                            <td className="px-6 py-3">₪22,500</td>
                            <td className="px-6 py-3 text-green-500">+15% מהחודש הקודם</td>
                          </tr>
                          <tr className="bg-white border-b">
                            <td className="px-6 py-3 font-medium">סה"כ הוצאות</td>
                            <td className="px-6 py-3">₪11,200</td>
                            <td className="px-6 py-3 text-rose-500">+4% מהחודש הקודם</td>
                          </tr>
                          <tr className="bg-white border-b">
                            <td className="px-6 py-3 font-medium">רווח נקי</td>
                            <td className="px-6 py-3 font-bold">₪11,300</td>
                            <td className="px-6 py-3 text-green-500">+26% מהחודש הקודם</td>
                          </tr>
                          <tr className="bg-white border-b">
                            <td className="px-6 py-3 font-medium">שולי רווח</td>
                            <td className="px-6 py-3">50.2%</td>
                            <td className="px-6 py-3 text-green-500">+9% מהחודש הקודם</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">הוצאות לפי קטגוריה</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>חומרים</span>
                          <span>₪4,500 (40%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-primary rounded-full h-2" style={{ width: '40%' }}></div>
                        </div>
                        
                        <div className="flex justify-between">
                          <span>שכירות</span>
                          <span>₪3,000 (27%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-primary rounded-full h-2" style={{ width: '27%' }}></div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>שיווק</span>
                          <span>₪2,200 (20%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-primary rounded-full h-2" style={{ width: '20%' }}></div>
                        </div>
                        
                        <div className="flex justify-between">
                          <span>אחר</span>
                          <span>₪1,500 (13%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-primary rounded-full h-2" style={{ width: '13%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-6">
                    <Button asChild variant="outline">
                      <Link to="/finances/reports">
                        <FileText className="mr-2 h-4 w-4" />
                        צפה בדוחות מפורטים
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="revenues" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-right">ניהול הכנסות</CardTitle>
                <CardDescription className="text-right">
                  צפייה וניהול של כל הכנסות העסק
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-right mb-6">
                  <p>לניהול מלא של ההכנסות, בקר בעמוד ניהול ההכנסות</p>
                </div>
                <div className="flex justify-end">
                  <Button asChild>
                    <Link to="/finances/revenues">
                      נהל הכנסות
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expenses" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-right">ניהול הוצאות</CardTitle>
                <CardDescription className="text-right">
                  צפייה וניהול של כל הוצאות העסק
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-right mb-6">
                  <p>לניהול מלא של ההוצאות, בקר בעמוד ניהול ההוצאות</p>
                </div>
                <div className="flex justify-end">
                  <Button asChild>
                    <Link to="/expenses">
                      נהל הוצאות
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-right">דוחות פיננסיים</CardTitle>
                <CardDescription className="text-right">
                  הפקת דוחות פיננסיים מותאמים אישית
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-right mb-6">
                  <p>להפקת דוחות פיננסיים מפורטים, בקר בעמוד הדוחות הפיננסיים</p>
                </div>
                <div className="flex justify-end">
                  <Button asChild>
                    <Link to="/finances/reports">
                      הפק דוחות
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PermissionGuard>
  );
};

export default BusinessManagement;
