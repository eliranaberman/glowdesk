
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, TrendingUp, TrendingDown } from 'lucide-react';
import { format } from 'date-fns';
import { getRevenuesByDateRange } from '@/services/revenueService';
import PermissionGuard from '@/components/auth/PermissionGuard';

const CashFlow = () => {
  const [periodFilter, setPeriodFilter] = useState('month');
  const [cashflowData, setCashflowData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    netCashflow: 0,
    trend: 0
  });
  
  // Sample data - in a real app this would come from an API
  const mockExpenses = [
    { date: "2023-06-01", amount: 500 },
    { date: "2023-06-05", amount: 1200 },
    { date: "2023-06-10", amount: 800 },
    { date: "2023-06-15", amount: 650 },
    { date: "2023-06-20", amount: 1000 },
    { date: "2023-06-25", amount: 750 },
  ];
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Get date range based on period filter
      const endDate = format(new Date(), 'yyyy-MM-dd');
      let startDate: string;
      
      switch (periodFilter) {
        case 'week':
          startDate = format(new Date(new Date().setDate(new Date().getDate() - 7)), 'yyyy-MM-dd');
          break;
        case 'month':
          startDate = format(new Date(new Date().setMonth(new Date().getMonth() - 1)), 'yyyy-MM-dd');
          break;
        case 'quarter':
          startDate = format(new Date(new Date().setMonth(new Date().getMonth() - 3)), 'yyyy-MM-dd');
          break;
        case 'year':
          startDate = format(new Date(new Date().setFullYear(new Date().getFullYear() - 1)), 'yyyy-MM-dd');
          break;
        default:
          startDate = format(new Date(new Date().setMonth(new Date().getMonth() - 1)), 'yyyy-MM-dd');
      }
      
      try {
        // Fetch real revenue data
        const revenueData = await getRevenuesByDateRange(startDate, endDate);
        
        // Group by date
        const revenueByDate = revenueData.reduce((acc: Record<string, number>, item: any) => {
          const date = item.date;
          acc[date] = (acc[date] || 0) + Number(item.amount);
          return acc;
        }, {});
        
        // Group expenses by date (using mock data for now)
        const expensesByDate = mockExpenses.reduce((acc: Record<string, number>, item: any) => {
          acc[item.date] = (acc[item.date] || 0) + Number(item.amount);
          return acc;
        }, {});
        
        // Combine all dates
        const allDates = [...new Set([...Object.keys(revenueByDate), ...Object.keys(expensesByDate)])].sort();
        
        // Create combined data set
        const combined = allDates.map(date => {
          const revenue = revenueByDate[date] || 0;
          const expenses = expensesByDate[date] || 0;
          return {
            date,
            revenue,
            expenses,
            netCash: revenue - expenses,
            formattedDate: format(new Date(date), 'dd/MM')
          };
        });
        
        setCashflowData(combined);
        
        // Calculate summary
        const totalRevenue = combined.reduce((sum, item) => sum + item.revenue, 0);
        const totalExpenses = combined.reduce((sum, item) => sum + item.expenses, 0);
        const netCashflow = totalRevenue - totalExpenses;
        
        // Calculate trend (simplified)
        const trend = netCashflow > 0 ? 5.2 : -2.8; // In a real app, this would be calculated more accurately
        
        setSummary({
          totalRevenue,
          totalExpenses,
          netCashflow,
          trend
        });
        
      } catch (error) {
        console.error('Error fetching cash flow data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [periodFilter]);
  
  return (
    <PermissionGuard requiredResource="finances" requiredPermission="read" redirectTo="/dashboard">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">תזרים מזומנים</h1>
          <div className="flex gap-2">
            <Select value={periodFilter} onValueChange={setPeriodFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="בחר תקופה" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">שבוע אחרון</SelectItem>
                <SelectItem value="month">חודש אחרון</SelectItem>
                <SelectItem value="quarter">רבעון אחרון</SelectItem>
                <SelectItem value="year">שנה אחרונה</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              יצא דוח
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-right">סך הכנסות</CardTitle>
              <CardDescription className="text-right">סך ההכנסות בתקופה</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-right">₪{summary.totalRevenue.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-right">סך הוצאות</CardTitle>
              <CardDescription className="text-right">סך ההוצאות בתקופה</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-right">₪{summary.totalExpenses.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-right">מאזן מזומנים</CardTitle>
              <CardDescription className="text-right">תזרים מזומנים נקי</CardDescription>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold text-right flex items-center justify-end ${summary.netCashflow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {summary.netCashflow >= 0 ? (
                  <TrendingUp className="h-5 w-5 mr-2" />
                ) : (
                  <TrendingDown className="h-5 w-5 mr-2" />
                )}
                ₪{summary.netCashflow.toLocaleString()}
              </div>
              <div className="flex items-center mt-2">
                <span className={`text-sm ${summary.trend >= 0 ? 'text-green-500' : 'text-rose-500'} font-medium`}>
                  {summary.trend >= 0 ? '+' : ''}{summary.trend}%
                </span>
                <span className="text-sm text-muted-foreground mr-2">שינוי מהתקופה הקודמת</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-right">תזרים מזומנים לאורך זמן</CardTitle>
            <CardDescription className="text-right">
              השוואה בין הכנסות והוצאות לאורך זמן
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={cashflowData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 10,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="formattedDate" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₪${value}`]} labelFormatter={(label) => `תאריך: ${label}`} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" name="הכנסות" stroke="#8884d8" strokeWidth={2} />
                  <Line type="monotone" dataKey="expenses" name="הוצאות" stroke="#82ca9d" strokeWidth={2} />
                  <Line type="monotone" dataKey="netCash" name="מאזן" stroke="#ffc658" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-right">השוואת הכנסות והוצאות</CardTitle>
            <CardDescription className="text-right">
              השוואה בין סך ההכנסות וההוצאות בתקופה הנוכחית
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    {
                      name: 'סיכום',
                      הכנסות: summary.totalRevenue,
                      הוצאות: summary.totalExpenses,
                      מאזן: summary.netCashflow,
                    }
                  ]}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₪${value}`]} />
                  <Legend />
                  <Bar dataKey="הכנסות" fill="#8884d8" />
                  <Bar dataKey="הוצאות" fill="#82ca9d" />
                  <Bar dataKey="מאזן" fill={summary.netCashflow >= 0 ? "#82ca9d" : "#ff8042"} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </PermissionGuard>
  );
};

export default CashFlow;
