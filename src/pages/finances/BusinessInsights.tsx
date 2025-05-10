
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Download, LineChart as LineChartIcon, BarChart as BarChartIcon, PieChart as PieChartIcon } from 'lucide-react';
import PermissionGuard from '@/components/auth/PermissionGuard';

const REVENUE_BY_SERVICE = [
  { name: 'מניקור ג\'ל', value: 8500, color: '#EFCFD4' },
  { name: 'פדיקור', value: 6200, color: '#FAD8C3' },
  { name: 'אקריליק', value: 4800, color: '#F5F0EB' },
  { name: 'לק', value: 3500, color: '#D8E2DC' },
  { name: 'עיצוב', value: 1200, color: '#FFE5D9' },
];

const REVENUE_BY_TECHNICIAN = [
  { name: 'שירה', value: 9800 },
  { name: 'רונית', value: 7600 },
  { name: 'מיכל', value: 6200 },
  { name: 'דנה', value: 4500 },
];

const MONTHLY_TRENDS = [
  { month: 'ינואר', revenue: 18000, clients: 92 },
  { month: 'פברואר', revenue: 19500, clients: 98 },
  { month: 'מרץ', revenue: 17800, clients: 88 },
  { month: 'אפריל', revenue: 20100, clients: 102 },
  { month: 'מאי', revenue: 21500, clients: 108 },
  { month: 'יוני', revenue: 24200, clients: 115 },
];

const CUSTOMER_RETENTION = [
  { month: 'ינואר', new: 18, returning: 74 },
  { month: 'פברואר', new: 22, returning: 76 },
  { month: 'מרץ', new: 16, returning: 72 },
  { month: 'אפריל', new: 25, returning: 77 },
  { month: 'מאי', new: 20, returning: 88 },
  { month: 'יוני', new: 24, returning: 91 },
];

const BusinessInsights = () => {
  const [timeframe, setTimeframe] = useState('month');
  const [visualization, setVisualization] = useState<'bar' | 'line' | 'pie'>('bar');
  
  const getChartByType = (type: 'bar' | 'line' | 'pie', data: any[], dataKey: string, nameKey: string = 'name') => {
    switch (type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={nameKey} />
              <YAxis />
              <Tooltip formatter={(value) => [`₪${value}`]} />
              <Legend />
              <Bar dataKey={dataKey} fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={nameKey} />
              <YAxis />
              <Tooltip formatter={(value) => [`₪${value}`]} />
              <Legend />
              <Line type="monotone" dataKey={dataKey} stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey={dataKey}
                nameKey={nameKey}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || `#${Math.floor(Math.random()*16777215).toString(16)}`} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`₪${value}`]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
    }
  };
  
  return (
    <PermissionGuard requiredResource="finances" requiredPermission="read" redirectTo="/dashboard">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">תובנות עסקיות</h1>
          <div className="flex gap-2">
            <Select value={timeframe} onValueChange={setTimeframe}>
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
              יצא דוח תובנות
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-right">מספר לקוחות חודשי</CardTitle>
              <CardDescription className="text-right">מספר הלקוחות בחודש האחרון</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-right">115</div>
              <div className="flex items-center mt-2">
                <span className="text-sm text-green-500 font-medium">+6%</span>
                <span className="text-sm text-muted-foreground mr-2">מהחודש הקודם</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-right">הכנסה ממוצעת ללקוח</CardTitle>
              <CardDescription className="text-right">ממוצע הכנסה ללקוח בחודש</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-right">₪210</div>
              <div className="flex items-center mt-2">
                <span className="text-sm text-green-500 font-medium">+8%</span>
                <span className="text-sm text-muted-foreground mr-2">מהחודש הקודם</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-right">שיעור החזרה</CardTitle>
              <CardDescription className="text-right">אחוז הלקוחות החוזרים</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-right">79%</div>
              <div className="flex items-center mt-2">
                <span className="text-sm text-green-500 font-medium">+3%</span>
                <span className="text-sm text-muted-foreground mr-2">מהחודש הקודם</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="revenue" className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="revenue">הכנסות</TabsTrigger>
            <TabsTrigger value="services">שירותים</TabsTrigger>
            <TabsTrigger value="technicians">טכנאיות</TabsTrigger>
            <TabsTrigger value="customers">לקוחות</TabsTrigger>
          </TabsList>
          
          <TabsContent value="revenue" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-right">מגמת הכנסות לאורך זמן</CardTitle>
                  <CardDescription className="text-right">הכנסות חודשיות במהלך השנה</CardDescription>
                </div>
                <div className="flex gap-1">
                  <Button variant={visualization === 'bar' ? 'default' : 'ghost'} size="icon" onClick={() => setVisualization('bar')}>
                    <BarChartIcon className="h-4 w-4" />
                  </Button>
                  <Button variant={visualization === 'line' ? 'default' : 'ghost'} size="icon" onClick={() => setVisualization('line')}>
                    <LineChartIcon className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {getChartByType(visualization === 'pie' ? 'line' : visualization, MONTHLY_TRENDS, 'revenue', 'month')}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-right">הכנסות לפי סוג שירות</CardTitle>
                  <CardDescription className="text-right">התפלגות הכנסות לפי סוג שירות</CardDescription>
                </div>
                <div className="flex gap-1">
                  <Button variant={visualization === 'bar' ? 'default' : 'ghost'} size="icon" onClick={() => setVisualization('bar')}>
                    <BarChartIcon className="h-4 w-4" />
                  </Button>
                  <Button variant={visualization === 'pie' ? 'default' : 'ghost'} size="icon" onClick={() => setVisualization('pie')}>
                    <PieChartIcon className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {getChartByType(visualization === 'line' ? 'bar' : visualization, REVENUE_BY_SERVICE, 'value')}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-right">השוואת מחירים מול השוק</CardTitle>
                <CardDescription className="text-right">
                  השוואת מחירי השירותים שלך מול ממוצע השוק
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative overflow-x-auto">
                  <table className="w-full text-sm text-right">
                    <thead className="text-xs uppercase bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3">שירות</th>
                        <th scope="col" className="px-6 py-3">המחיר שלך</th>
                        <th scope="col" className="px-6 py-3">ממוצע שוק</th>
                        <th scope="col" className="px-6 py-3">הפרש</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white border-b">
                        <td className="px-6 py-4">מניקור ג'ל</td>
                        <td className="px-6 py-4">₪120</td>
                        <td className="px-6 py-4">₪110</td>
                        <td className="px-6 py-4 text-green-600">+9%</td>
                      </tr>
                      <tr className="bg-white border-b">
                        <td className="px-6 py-4">פדיקור</td>
                        <td className="px-6 py-4">₪140</td>
                        <td className="px-6 py-4">₪130</td>
                        <td className="px-6 py-4 text-green-600">+8%</td>
                      </tr>
                      <tr className="bg-white border-b">
                        <td className="px-6 py-4">אקריליק</td>
                        <td className="px-6 py-4">₪180</td>
                        <td className="px-6 py-4">₪190</td>
                        <td className="px-6 py-4 text-rose-600">-5%</td>
                      </tr>
                      <tr className="bg-white border-b">
                        <td className="px-6 py-4">לק</td>
                        <td className="px-6 py-4">₪90</td>
                        <td className="px-6 py-4">₪85</td>
                        <td className="px-6 py-4 text-green-600">+6%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="technicians" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-right">הכנסות לפי טכנאית</CardTitle>
                  <CardDescription className="text-right">התפלגות הכנסות לפי טכנאית</CardDescription>
                </div>
                <div className="flex gap-1">
                  <Button variant={visualization === 'bar' ? 'default' : 'ghost'} size="icon" onClick={() => setVisualization('bar')}>
                    <BarChartIcon className="h-4 w-4" />
                  </Button>
                  <Button variant={visualization === 'pie' ? 'default' : 'ghost'} size="icon" onClick={() => setVisualization('pie')}>
                    <PieChartIcon className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {getChartByType(visualization === 'line' ? 'bar' : visualization, REVENUE_BY_TECHNICIAN, 'value')}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-right">ניתוח ביצועי טכנאיות</CardTitle>
                <CardDescription className="text-right">
                  השוואת ביצועים, דירוגי לקוחות וסטטיסטיקות
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative overflow-x-auto">
                  <table className="w-full text-sm text-right">
                    <thead className="text-xs uppercase bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3">טכנאית</th>
                        <th scope="col" className="px-6 py-3">תורים בחודש</th>
                        <th scope="col" className="px-6 py-3">הכנסות</th>
                        <th scope="col" className="px-6 py-3">דירוג</th>
                        <th scope="col" className="px-6 py-3">אחוז ביטולים</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white border-b">
                        <td className="px-6 py-4 font-medium">שירה</td>
                        <td className="px-6 py-4">48</td>
                        <td className="px-6 py-4">₪9,800</td>
                        <td className="px-6 py-4">4.9 / 5</td>
                        <td className="px-6 py-4">3.2%</td>
                      </tr>
                      <tr className="bg-white border-b">
                        <td className="px-6 py-4 font-medium">רונית</td>
                        <td className="px-6 py-4">38</td>
                        <td className="px-6 py-4">₪7,600</td>
                        <td className="px-6 py-4">4.7 / 5</td>
                        <td className="px-6 py-4">4.5%</td>
                      </tr>
                      <tr className="bg-white border-b">
                        <td className="px-6 py-4 font-medium">מיכל</td>
                        <td className="px-6 py-4">32</td>
                        <td className="px-6 py-4">₪6,200</td>
                        <td className="px-6 py-4">4.8 / 5</td>
                        <td className="px-6 py-4">3.8%</td>
                      </tr>
                      <tr className="bg-white border-b">
                        <td className="px-6 py-4 font-medium">דנה</td>
                        <td className="px-6 py-4">22</td>
                        <td className="px-6 py-4">₪4,500</td>
                        <td className="px-6 py-4">4.5 / 5</td>
                        <td className="px-6 py-4">5.2%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="customers" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-right">לקוחות חדשים לעומת לקוחות חוזרים</CardTitle>
                  <CardDescription className="text-right">ניתוח נאמנות לקוחות לאורך זמן</CardDescription>
                </div>
                <div className="flex gap-1">
                  <Button variant={visualization === 'bar' ? 'default' : 'ghost'} size="icon" onClick={() => setVisualization('bar')}>
                    <BarChartIcon className="h-4 w-4" />
                  </Button>
                  <Button variant={visualization === 'line' ? 'default' : 'ghost'} size="icon" onClick={() => setVisualization('line')}>
                    <LineChartIcon className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={CUSTOMER_RETENTION}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="new" name="לקוחות חדשים" stackId="a" fill="#8884d8" />
                    <Bar dataKey="returning" name="לקוחות חוזרים" stackId="a" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-right">מקורות הפניה של לקוחות</CardTitle>
                <CardDescription className="text-right">מאיפה מגיעים הלקוחות החדשים שלך</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'מדיה חברתית', value: 45, color: '#8884d8' },
                        { name: 'הפניית חבר', value: 25, color: '#82ca9d' },
                        { name: 'אתר אינטרנט', value: 15, color: '#ffc658' },
                        { name: 'שיווק אחר', value: 10, color: '#ff8042' },
                        { name: 'לקוחות מזדמנים', value: 5, color: '#0088FE' }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[
                        { name: 'מדיה חברתית', value: 45, color: '#8884d8' },
                        { name: 'הפניית חבר', value: 25, color: '#82ca9d' },
                        { name: 'אתר אינטרנט', value: 15, color: '#ffc658' },
                        { name: 'שיווק אחר', value: 10, color: '#ff8042' },
                        { name: 'לקוחות מזדמנים', value: 5, color: '#0088FE' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PermissionGuard>
  );
};

export default BusinessInsights;
