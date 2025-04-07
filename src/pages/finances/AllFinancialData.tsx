
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar, Download, FileSpreadsheet, Printer, Search, SlidersHorizontal, ChevronLeft, ChevronRight, Filter, TrendingUp, TrendingDown, BarChart4 } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const AllFinancialData = () => {
  const [dateRange, setDateRange] = useState('month');
  const [activeTab, setActiveTab] = useState('transactions');

  // Mock financial data
  const transactions = [
    { id: '1', date: '05/04/2025', type: 'income', category: 'טיפולים', customer: 'שרה כהן', description: 'מניקור ג׳ל', amount: 120 },
    { id: '2', date: '05/04/2025', type: 'income', category: 'טיפולים', customer: 'דנה לוי', description: 'פדיקור', amount: 140 },
    { id: '3', date: '04/04/2025', type: 'income', category: 'מוצרים', customer: 'יעל גלעדי', description: 'לק ומחזק', amount: 85 },
    { id: '4', date: '04/04/2025', type: 'expense', category: 'מלאי', customer: '-', description: 'רכישת חומרים', amount: -350 },
    { id: '5', date: '03/04/2025', type: 'income', category: 'טיפולים', customer: 'אורית כהן', description: 'בניית ציפורניים', amount: 200 },
    { id: '6', date: '03/04/2025', type: 'expense', category: 'ציוד', customer: '-', description: 'מנורת LED חדשה', amount: -250 },
    { id: '7', date: '02/04/2025', type: 'income', category: 'טיפולים', customer: 'נועה שמעון', description: 'מניקור רגיל', amount: 90 },
    { id: '8', date: '01/04/2025', type: 'expense', category: 'שכירות', customer: '-', description: 'שכירות חודשית', amount: -1500 },
  ];

  const monthlyData = [
    { name: 'ינואר', income: 10500, expenses: 6200, profit: 4300 },
    { name: 'פברואר', income: 11200, expenses: 6800, profit: 4400 },
    { name: 'מרץ', income: 12800, expenses: 7100, profit: 5700 },
    { name: 'אפריל', income: 13400, expenses: 7300, profit: 6100 },
    { name: 'מאי', income: 14200, expenses: 7400, profit: 6800 },
    { name: 'יוני', income: 15120, expenses: 7600, profit: 7520 },
  ];

  const categoryData = [
    { name: 'טיפולים', value: 68 },
    { name: 'מוצרים', value: 15 },
    { name: 'מנויים', value: 12 },
    { name: 'אחר', value: 5 },
  ];

  const incomeByCategory = [
    { name: 'מניקור', value: 5200 },
    { name: 'פדיקור', value: 3800 },
    { name: 'בניית ציפורניים', value: 4200 },
    { name: 'הסרת לק', value: 1900 },
    { name: 'מוצרים', value: 1600 },
  ];

  const expensesByCategory = [
    { name: 'שכירות', value: 3000 },
    { name: 'חומרים', value: 2100 },
    { name: 'משכורות', value: 1500 },
    { name: 'שיווק', value: 800 },
    { name: 'אחר', value: 400 },
  ];

  const totals = {
    income: transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
    expenses: Math.abs(transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)),
    get profit() { return this.income - this.expenses; }
  };

  const handleExportData = () => {
    alert('הנתונים מיוצאים לקובץ אקסל');
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold mb-1">נתונים פיננסיים</h1>
          <p className="text-muted-foreground">סקירה מקיפה של כל הנתונים הפיננסיים של העסק</p>
        </div>
        
        <div className="flex gap-2">
          {/* Date range buttons in RTL order - Day on right, Month on left */}
          <div className="filter-button-group flex">
            <Button 
              variant={dateRange === 'day' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setDateRange('day')}
              className={dateRange === 'day' ? "filter-button-active" : ""}
            >
              יום
            </Button>
            <Button 
              variant={dateRange === 'week' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setDateRange('week')}
              className={dateRange === 'week' ? "filter-button-active" : ""}
            >
              שבוע
            </Button>
            <Button 
              variant={dateRange === 'month' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setDateRange('month')}
              className={dateRange === 'month' ? "filter-button-active" : ""}
            >
              חודש
            </Button>
            <Button 
              variant={dateRange === 'quarter' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setDateRange('quarter')}
              className={dateRange === 'quarter' ? "filter-button-active" : ""}
            >
              רבעון
            </Button>
            <Button 
              variant={dateRange === 'year' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setDateRange('year')}
              className={dateRange === 'year' ? "filter-button-active" : ""}
            >
              שנה
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">הכנסות</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <div className="text-2xl font-bold">₪{totals.income.toLocaleString()}</div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <TrendingUp className="h-3.5 w-3.5 mr-1 text-green-500" />
                <span className="text-green-500">+8%</span>
                <span className="mr-1">מהתקופה הקודמת</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">הוצאות</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <div className="text-2xl font-bold">₪{totals.expenses.toLocaleString()}</div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <TrendingDown className="h-3.5 w-3.5 mr-1 text-red-500" />
                <span className="text-red-500">+3%</span>
                <span className="mr-1">מהתקופה הקודמת</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">רווח נקי</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <div className="text-2xl font-bold text-green-600">₪{totals.profit.toLocaleString()}</div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <TrendingUp className="h-3.5 w-3.5 mr-1 text-green-500" />
                <span className="text-green-500">+12%</span>
                <span className="mr-1">מהתקופה הקודמת</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-2 mt-4 justify-between items-center">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Calendar className="h-4 w-4 ml-1" />
            <span>01/04/2025</span>
            <span>-</span>
            <span>07/04/2025</span>
          </Button>
          
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Filter className="h-4 w-4 ml-1" />
            מסננים
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrintReport} className="flex items-center gap-1">
            <Printer className="h-4 w-4 ml-1" />
            הדפסה
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportData} className="flex items-center gap-1">
            <FileSpreadsheet className="h-4 w-4 ml-1" />
            ייצוא לאקסל
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportData} className="flex items-center gap-1">
            <Download className="h-4 w-4 ml-1" />
            PDF
          </Button>
        </div>
      </div>

      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="transactions">פעולות אחרונות</TabsTrigger>
          <TabsTrigger value="trends">מגמות פיננסיות</TabsTrigger>
          <TabsTrigger value="breakdown">פילוח הכנסות והוצאות</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transactions" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="סוג פעולה" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל הפעולות</SelectItem>
                  <SelectItem value="income">הכנסות</SelectItem>
                  <SelectItem value="expense">הוצאות</SelectItem>
                </SelectContent>
              </Select>
              
              <Select defaultValue="all">
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="קטגוריה" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל הקטגוריות</SelectItem>
                  <SelectItem value="treatments">טיפולים</SelectItem>
                  <SelectItem value="products">מוצרים</SelectItem>
                  <SelectItem value="rent">שכירות</SelectItem>
                  <SelectItem value="supplies">ציוד וחומרים</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="relative">
              <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="חיפוש..." 
                className="w-[200px] pr-9"
              />
            </div>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>תאריך</TableHead>
                    <TableHead>סוג</TableHead>
                    <TableHead>קטגוריה</TableHead>
                    <TableHead>לקוח/ספק</TableHead>
                    <TableHead>תיאור</TableHead>
                    <TableHead className="text-left">סכום</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>
                        <Badge variant={transaction.type === 'income' ? 'default' : 'outline'}>
                          {transaction.type === 'income' ? 'הכנסה' : 'הוצאה'}
                        </Badge>
                      </TableCell>
                      <TableCell>{transaction.category}</TableCell>
                      <TableCell>{transaction.customer}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell className={`text-left font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        ₪{Math.abs(transaction.amount).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <div className="flex items-center justify-center gap-2">
            <Button variant="outline" size="sm">
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
            <Button variant="outline" size="sm">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>מגמת הכנסות והוצאות חודשית</CardTitle>
              <CardDescription>השוואה של הכנסות, הוצאות ורווח לאורך זמן</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => `₪${value.toLocaleString()}`}
                      labelFormatter={(label) => `חודש: ${label}`} 
                    />
                    <Legend />
                    <Bar dataKey="income" name="הכנסות" fill="#8884d8" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="expenses" name="הוצאות" fill="#82ca9d" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="profit" name="רווח" fill="#ffc658" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>מדדי צמיחה</CardTitle>
              <CardDescription>מדדים עיקריים להערכת ביצועי העסק לאורך זמן</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlyData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => `₪${value.toLocaleString()}`}
                      labelFormatter={(label) => `חודש: ${label}`}  
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="profit" 
                      name="רווח נקי" 
                      stroke="#8884d8" 
                      activeDot={{ r: 8 }} 
                      strokeWidth={2} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="breakdown" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>פילוח הכנסות</CardTitle>
                <CardDescription>החלוקה של ההכנסות לפי קטגוריות</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {incomeByCategory.map((category, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-1">
                        <span>{category.name}</span>
                        <span>₪{category.value.toLocaleString()}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full">
                        <div 
                          className="h-2 rounded-full bg-primary" 
                          style={{ width: `${(category.value / incomeByCategory.reduce((sum, c) => sum + c.value, 0)) * 100}%` }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>פילוח הוצאות</CardTitle>
                <CardDescription>החלוקה של ההוצאות לפי קטגוריות</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {expensesByCategory.map((category, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-1">
                        <span>{category.name}</span>
                        <span>₪{category.value.toLocaleString()}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full">
                        <div 
                          className="h-2 rounded-full bg-destructive/70" 
                          style={{ width: `${(category.value / expensesByCategory.reduce((sum, c) => sum + c.value, 0)) * 100}%` }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>דוח רווחיות מפורט</CardTitle>
              <CardDescription>ניתוח מעמיק של הרווחיות בחתכים שונים</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>קטגוריה</TableHead>
                    <TableHead className="text-right">הכנסות</TableHead>
                    <TableHead className="text-right">הוצאות</TableHead>
                    <TableHead className="text-right">רווח</TableHead>
                    <TableHead className="text-right">אחוז רווחיות</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">טיפולים</TableCell>
                    <TableCell className="text-right">₪13,500</TableCell>
                    <TableCell className="text-right">₪5,200</TableCell>
                    <TableCell className="text-right">₪8,300</TableCell>
                    <TableCell className="text-right">61%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">מוצרים</TableCell>
                    <TableCell className="text-right">₪2,400</TableCell>
                    <TableCell className="text-right">₪1,600</TableCell>
                    <TableCell className="text-right">₪800</TableCell>
                    <TableCell className="text-right">33%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">שירותים אחרים</TableCell>
                    <TableCell className="text-right">₪1,200</TableCell>
                    <TableCell className="text-right">₪500</TableCell>
                    <TableCell className="text-right">₪700</TableCell>
                    <TableCell className="text-right">58%</TableCell>
                  </TableRow>
                  <TableRow className="font-semibold">
                    <TableCell>סה"כ</TableCell>
                    <TableCell className="text-right">₪17,100</TableCell>
                    <TableCell className="text-right">₪7,300</TableCell>
                    <TableCell className="text-right">₪9,800</TableCell>
                    <TableCell className="text-right">57%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AllFinancialData;
