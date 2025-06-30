import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ExpenseFormTest } from '@/components/expenses/ExpenseFormTest';
import { PlusCircle, FileText, Calculator, TrendingUp, Download, Settings } from 'lucide-react';

interface Expense {
  id: string;
  amount: number;
  category: string;
  vendor: string;
  description?: string;
  date: string;
  payment_method?: string;
  created_at: string;
  created_by?: string;
  has_invoice?: boolean;
  invoice_file_path?: string;
}

const Expenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();

  const loadExpenses = async () => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('date', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error loading expenses:', error);
        toast({
          title: 'שגיאה',
          description: 'לא ניתן לטעון את רשימת ההוצאות',
          variant: 'destructive',
        });
        return;
      }

      setExpenses(data || []);
      
      // Calculate total expenses for current month
      const currentMonth = new Date().toISOString().slice(0, 7);
      const monthlyTotal = (data || [])
        .filter(expense => expense.date.startsWith(currentMonth))
        .reduce((sum, expense) => sum + expense.amount, 0);
      
      setTotalExpenses(monthlyTotal);
    } catch (error) {
      console.error('Failed to load expenses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const refreshExpenses = () => {
    setIsLoading(true);
    loadExpenses();
  };

  return (
    <div className="container mx-auto p-6 space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">ניהול הוצאות</h1>
          <p className="text-muted-foreground">
            נהל וקבע הוצאות עסקיות בצורה יעילה
          </p>
        </div>
        <div className="flex gap-2">
          <Button className="flex gap-2">
            <PlusCircle className="h-4 w-4" />
            הוספת הוצאה
          </Button>
          <Button onClick={refreshExpenses} variant="outline" className="flex gap-2">
            <Settings className="h-4 w-4" />
            בדיקת מערכת
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">הוצאות החודש</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₪{totalExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              סה"כ הוצאות החודש הנוכחי
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">מספר הוצאות</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expenses.length}</div>
            <p className="text-xs text-muted-foreground">
              הוצאות אחרונות במערכת
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ממוצע הוצאה</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₪{expenses.length > 0 ? Math.round(totalExpenses / expenses.length) : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              ממוצע להוצאה חודשית
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="add" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="add">הוספת הוצאה</TabsTrigger>
          <TabsTrigger value="list">רשימת הוצאות</TabsTrigger>
          <TabsTrigger value="test">בדיקת מערכת</TabsTrigger>
        </TabsList>

        <TabsContent value="add" className="space-y-4">
          <ExpenseFormTest />
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>הוצאות אחרונות</CardTitle>
              <CardDescription>
                {expenses.length > 0 ? `${expenses.length} הוצאות אחרונות` : 'אין הוצאות במערכת'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">טוען הוצאות...</div>
              ) : expenses.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  עדיין לא נוספו הוצאות למערכת
                </div>
              ) : (
                <div className="space-y-4">
                  {expenses.map((expense) => (
                    <div key={expense.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{expense.vendor}</h3>
                          <Badge variant="secondary">{expense.category}</Badge>
                          {expense.has_invoice && (
                            <Badge variant="outline" className="text-green-600">
                              <FileText className="h-3 w-3 mr-1" />
                              עם חשבונית
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {expense.description || 'ללא תיאור'}
                        </p>
                        <div className="flex items-center gap-4 mt-1">
                          <p className="text-xs text-muted-foreground">
                            {new Date(expense.date).toLocaleDateString('he-IL')}
                          </p>
                          {expense.invoice_file_path && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(expense.invoice_file_path, '_blank')}
                              className="text-xs h-auto p-1"
                            >
                              <Download className="h-3 w-3 mr-1" />
                              צפה בחשבונית
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-lg">₪{expense.amount.toLocaleString()}</div>
                        {expense.payment_method && (
                          <div className="text-xs text-muted-foreground">
                            {expense.payment_method}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="test" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>מצב המערכת</CardTitle>
              <CardDescription>
                בדיקת תקינות רכיבי המערכת השונים
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">חיבור בסיס נתונים</h3>
                  <Badge variant={user ? "default" : "destructive"}>
                    {user ? 'מחובר' : 'לא מחובר'}
                  </Badge>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">מספר הוצאות</h3>
                  <Badge variant="default">
                    {expenses.length} הוצאות
                  </Badge>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">משתמש מחובר</h3>
                  <Badge variant={user ? "default" : "secondary"}>
                    {user ? user.email : 'אורח'}
                  </Badge>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">טעינת נתונים</h3>
                  <Badge variant={isLoading ? "secondary" : "default"}>
                    {isLoading ? 'טוען...' : 'הושלם'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Expenses;
