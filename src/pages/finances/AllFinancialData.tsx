
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar, Download, Filter, Printer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LineChart, BarChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import PDFExport from '@/components/reports/PDFExport';

const AllFinancialData = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('month');
  const { toast } = useToast();

  const handleExport = () => {
    toast({
      title: "דוח הופק בהצלחה",
      description: "הקובץ ירד למחשב שלך",
    });
  };

  // מידע פיננסי לדוגמה
  const monthlyFinancialData = [
    { month: 'ינו׳', income: 10500, expenses: 6200, profit: 4300 },
    { month: 'פבר׳', income: 11200, expenses: 6800, profit: 4400 },
    { month: 'מרץ', income: 12800, expenses: 7100, profit: 5700 },
    { month: 'אפר׳', income: 13400, expenses: 7300, profit: 6100 },
    { month: 'מאי', income: 14200, expenses: 7400, profit: 6800 },
    { month: 'יוני', income: 15120, expenses: 7600, profit: 7520 },
    { month: 'יולי', income: 14800, expenses: 7500, profit: 7300 },
    { month: 'אוג׳', income: 15300, expenses: 7800, profit: 7500 },
    { month: 'ספט׳', income: 16100, expenses: 8100, profit: 8000 },
    { month: 'אוק׳', income: 16800, expenses: 8400, profit: 8400 },
    { month: 'נוב׳', income: 17200, expenses: 8600, profit: 8600 },
    { month: 'דצמ׳', income: 18500, expenses: 9200, profit: 9300 },
  ];

  const incomeByCategory = [
    { name: 'מניקור', value: 35000 },
    { name: 'פדיקור', value: 28000 },
    { name: 'אקריליק', value: 22000 },
    { name: 'לק ג\'ל', value: 19000 },
    { name: 'עיצוב ציפורניים', value: 12000 },
    { name: 'אחר', value: 7000 },
  ];

  const expensesByCategory = [
    { name: 'שכירות', value: 42000 },
    { name: 'חומרים', value: 26000 },
    { name: 'שכר עובדים', value: 32000 },
    { name: 'שיווק', value: 11000 },
    { name: 'חשבונות', value: 8000 },
    { name: 'אחר', value: 5000 },
  ];

  // מידע תזרים מזומנים
  const cashFlowData = [
    { date: '01/06', income: 520, expenses: 210, balance: 310 },
    { date: '02/06', income: 480, expenses: 180, balance: 300 },
    { date: '03/06', income: 590, expenses: 250, balance: 340 },
    { date: '04/06', income: 620, expenses: 320, balance: 300 },
    { date: '05/06', income: 710, expenses: 180, balance: 530 },
    { date: '06/06', income: 450, expenses: 120, balance: 330 },
    { date: '07/06', income: 0, expenses: 290, balance: -290 },
    { date: '08/06', income: 580, expenses: 210, balance: 370 },
    { date: '09/06', income: 640, expenses: 320, balance: 320 },
    { date: '10/06', income: 720, expenses: 280, balance: 440 },
    { date: '11/06', income: 550, expenses: 220, balance: 330 },
    { date: '12/06', income: 680, expenses: 310, balance: 370 },
    { date: '13/06', income: 690, expenses: 250, balance: 440 },
    { date: '14/06', income: 0, expenses: 350, balance: -350 },
  ];

  // דוחות אחרונים
  const recentReports = [
    { id: 1, name: 'דוח הכנסות חודשי', date: '01/06/2025', format: 'PDF' },
    { id: 2, name: 'ניתוח הוצאות רבעוני', date: '01/05/2025', format: 'Excel' },
    { id: 3, name: 'דוח מע״מ', date: '15/04/2025', format: 'PDF' },
    { id: 4, name: 'דוח רווחיות לפי לקוחות', date: '01/04/2025', format: 'PDF' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold mb-1">נתונים פיננסיים</h1>
          <p className="text-muted-foreground">צפייה וניתוח של כל הנתונים הפיננסיים בעסק</p>
        </div>
        
        <div className="flex gap-2">
          <Select defaultValue={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="בחרי טווח זמן" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">היום</SelectItem>
              <SelectItem value="week">שבוע אחרון</SelectItem>
              <SelectItem value="month">חודש אחרון</SelectItem>
              <SelectItem value="quarter">רבעון אחרון</SelectItem>
              <SelectItem value="year">שנה אחרונה</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4" dir="rtl">
        <TabsList className="grid grid-cols-3 md:grid-cols-5 lg:w-[600px] mx-auto">
          <TabsTrigger value="overview">סקירה כללית</TabsTrigger>
          <TabsTrigger value="income">הכנסות</TabsTrigger>
          <TabsTrigger value="expenses">הוצאות</TabsTrigger>
          <TabsTrigger value="cashflow">תזרים מזומנים</TabsTrigger>
          <TabsTrigger value="reports">דוחות</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">סה״כ הכנסות שנתי</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₪175,420</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center">
                  <span className="inline-block mr-1 text-emerald-500">+8.2%</span> משנה שעברה
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">סה״כ הוצאות שנתי</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₪92,400</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center">
                  <span className="inline-block mr-1 text-rose-500">+3.5%</span> משנה שעברה
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">רווח שנתי</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₪83,020</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center">
                  <span className="inline-block mr-1 text-emerald-500">+12.4%</span> משנה שעברה
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">תחזית שנתית</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₪190,000</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center">
                  <span className="inline-block mr-1 text-emerald-500">+9.5%</span> מהשנה הנוכחית
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>סקירה שנתית</CardTitle>
              <CardDescription>הכנסות, הוצאות ורווח בחלוקה חודשית</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyFinancialData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: any) => `₪${Number(value).toLocaleString()}`}
                  />
                  <Legend />
                  <Bar dataKey="income" name="הכנסות" fill="#606c38" />
                  <Bar dataKey="expenses" name="הוצאות" fill="#e07a5f" />
                  <Bar dataKey="profit" name="רווח" fill="#ddbea9" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>הכנסות לפי קטגוריה</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={incomeByCategory}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" />
                    <Tooltip formatter={(value: any) => `₪${Number(value).toLocaleString()}`} />
                    <Bar dataKey="value" name="הכנסות" fill="#EFCFD4" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>הוצאות לפי קטגוריה</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={expensesByCategory}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" />
                    <Tooltip formatter={(value: any) => `₪${Number(value).toLocaleString()}`} />
                    <Bar dataKey="value" name="הוצאות" fill="#FAD8C3" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="income" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>פירוט הכנסות</CardTitle>
                <CardDescription>ניתוח הכנסות מפורט לפי תקופה וסוגים</CardDescription>
              </div>
              <div>
                <PDFExport reportTitle="דוח הכנסות" reportType="income" />
              </div>
            </CardHeader>
            <CardContent>
              {/* תוכן דוח הכנסות יופיע כאן */}
              <div className="text-center py-10 text-muted-foreground">
                פירוט הכנסות מפורט יוצג כאן
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>פירוט הוצאות</CardTitle>
                <CardDescription>ניתוח הוצאות מפורט לפי תקופה וסוגים</CardDescription>
              </div>
              <div>
                <PDFExport reportTitle="דוח הוצאות" reportType="expenses" />
              </div>
            </CardHeader>
            <CardContent>
              {/* תוכן דוח הוצאות יופיע כאן */}
              <div className="text-center py-10 text-muted-foreground">
                פירוט הוצאות מפורט יוצג כאן
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cashflow" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>תזרים מזומנים</CardTitle>
              <CardDescription>תנועות כספים ומאזן יומי</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={cashFlowData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: any) => `₪${Number(value).toLocaleString()}`}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="income" name="הכנסות" stroke="#606c38" strokeWidth={2} />
                  <Line type="monotone" dataKey="expenses" name="הוצאות" stroke="#e07a5f" strokeWidth={2} />
                  <Line type="monotone" dataKey="balance" name="מאזן" stroke="#ddbea9" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>דוחות פיננסיים</CardTitle>
                <CardDescription>דוחות פיננסיים שנוצרו לאחרונה</CardDescription>
              </div>
              <Button onClick={handleExport}>
                <Download className="ml-2 h-4 w-4" />
                הפק דוח חדש
              </Button>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-right">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="p-3">שם הדוח</th>
                        <th className="p-3">תאריך</th>
                        <th className="p-3">פורמט</th>
                        <th className="p-3">פעולות</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentReports.map((report) => (
                        <tr key={report.id} className="border-t hover:bg-muted/30">
                          <td className="p-3">{report.name}</td>
                          <td className="p-3">{report.date}</td>
                          <td className="p-3">{report.format}</td>
                          <td className="p-3">
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4 ml-1" />
                                הורדה
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Printer className="h-4 w-4 ml-1" />
                                הדפסה
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AllFinancialData;
