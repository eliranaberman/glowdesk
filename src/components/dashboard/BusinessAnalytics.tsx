
import { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, CalendarClock, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

// These would typically come from an API/service in a real implementation
const MONTHLY_REVENUE_DATA = [
  { name: 'ינואר', revenue: 12500, expenses: 9000, profit: 3500 },
  { name: 'פברואר', revenue: 15000, expenses: 9500, profit: 5500 },
  { name: 'מרץ', revenue: 18000, expenses: 10000, profit: 8000 },
  { name: 'אפריל', revenue: 16000, expenses: 9800, profit: 6200 },
  { name: 'מאי', revenue: 19000, expenses: 10500, profit: 8500 },
  { name: 'יוני', revenue: 22000, expenses: 11000, profit: 11000 },
];

const DAILY_INCOME_DATA = [
  { name: 'יום א׳', income: 1200 },
  { name: 'יום ב׳', income: 1500 },
  { name: 'יום ג׳', income: 1800 },
  { name: 'יום ד׳', income: 1400 },
  { name: 'יום ה׳', income: 2200 },
  { name: 'יום ו׳', income: 2500 },
  { name: 'שבת', income: 0 },
];

const SERVICE_DISTRIBUTION = [
  { name: 'מניקור', value: 35, color: '#EFCFD4' },
  { name: 'פדיקור', value: 25, color: '#FAD8C3' },
  { name: 'אקריליק', value: 20, color: '#F5F0EB' },
  { name: 'לק', value: 15, color: '#D8E2DC' },
  { name: 'עיצוב', value: 5, color: '#FFE5D9' },
];

const TECHNICIAN_STATS = [
  { name: 'שירה', appointments: 38, revenue: 7600, rating: 4.9 },
  { name: 'רונית', appointments: 32, revenue: 6400, rating: 4.7 },
  { name: 'מיכל', appointments: 27, revenue: 5400, rating: 4.8 },
  { name: 'דנה', appointments: 23, revenue: 4600, rating: 4.5 },
];

const CANCELLATION_DATA = [
  { date: '01/06', scheduled: 12, completed: 10, cancelled: 1, noshow: 1 },
  { date: '02/06', scheduled: 15, completed: 13, cancelled: 2, noshow: 0 },
  { date: '03/06', scheduled: 10, completed: 8, cancelled: 1, noshow: 1 },
  { date: '04/06', scheduled: 14, completed: 12, cancelled: 1, noshow: 1 },
  { date: '05/06', scheduled: 16, completed: 15, cancelled: 1, noshow: 0 },
  { date: '06/06', scheduled: 18, completed: 16, cancelled: 2, noshow: 0 },
  { date: '07/06', scheduled: 13, completed: 11, cancelled: 1, noshow: 1 },
];

interface BusinessAnalyticsProps {
  timeFrame?: 'day' | 'week' | 'month' | 'year';
}

const BusinessAnalytics = ({ timeFrame = 'month' }: BusinessAnalyticsProps) => {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<'day' | 'week' | 'month' | 'year'>(timeFrame);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">ניתוח עסקי</h2>
        <Select 
          value={selectedTimeFrame}
          onValueChange={(value) => setSelectedTimeFrame(value as any)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="בחר טווח זמן" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">יום</SelectItem>
            <SelectItem value="week">שבוע</SelectItem>
            <SelectItem value="month">חודש</SelectItem>
            <SelectItem value="year">שנה</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">סך הכנסות החודש</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₪22,000</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-emerald-500">+15%</span> מהחודש הקודם
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">טיפולים החודש</CardTitle>
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">126</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-emerald-500">+8%</span> מהחודש הקודם
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">רווח חודשי</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₪11,000</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-emerald-500">+20%</span> מהחודש הקודם
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ממוצע ללקוח</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₪174</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-rose-500">-2%</span> מהחודש הקודם
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="revenue" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="revenue">הכנסות והוצאות</TabsTrigger>
          <TabsTrigger value="services">שירותים</TabsTrigger>
          <TabsTrigger value="technicians">טכנאיות</TabsTrigger>
          <TabsTrigger value="cancellations">ביטולים ואי הגעות</TabsTrigger>
        </TabsList>
        
        <TabsContent value="revenue" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>הכנסות והוצאות לפי חודש</CardTitle>
              <CardDescription>השוואת הכנסות, הוצאות ורווח</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  width={500}
                  height={300}
                  data={MONTHLY_REVENUE_DATA}
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
                  <Bar dataKey="revenue" name="הכנסות" fill="#8884d8" />
                  <Bar dataKey="expenses" name="הוצאות" fill="#82ca9d" />
                  <Bar dataKey="profit" name="רווח" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>הכנסות יומיות</CardTitle>
                <CardDescription>הכנסות לפי ימים בשבוע האחרון</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    width={500}
                    height={300}
                    data={DAILY_INCOME_DATA}
                    margin={{
                      top: 5,
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
                    <Line type="monotone" dataKey="income" name="הכנסה" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>התפלגות שירותים</CardTitle>
                <CardDescription>אחוז מסך ההכנסות החודשיות לפי שירות</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart width={400} height={300}>
                    <Pie
                      data={SERVICE_DISTRIBUTION}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {SERVICE_DISTRIBUTION.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="services" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>ביצועי שירותים</CardTitle>
              <CardDescription>ניתוח מכירות וביצועים לפי סוג שירות</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              {/* Service performance charts would go here */}
              <div className="flex h-full items-center justify-center">
                <p className="text-muted-foreground">נתונים מפורטים על שירותים יוצגו כאן</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="technicians" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>ביצועי טכנאיות</CardTitle>
              <CardDescription>השוואת פגישות, הכנסות ודירוגי לקוחות</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-right">
                  <thead className="text-xs uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3">טכנאית</th>
                      <th scope="col" className="px-6 py-3">פגישות</th>
                      <th scope="col" className="px-6 py-3">הכנסות</th>
                      <th scope="col" className="px-6 py-3">דירוג</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TECHNICIAN_STATS.map((tech, index) => (
                      <tr key={index} className="bg-white border-b">
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                          {tech.name}
                        </th>
                        <td className="px-6 py-4">{tech.appointments}</td>
                        <td className="px-6 py-4">₪{tech.revenue}</td>
                        <td className="px-6 py-4">{tech.rating}/5</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="cancellations" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>ביטולים ואי הגעות</CardTitle>
              <CardDescription>ניתוח ביטולים ואי הגעות בשבוע האחרון</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  width={500}
                  height={300}
                  data={CANCELLATION_DATA}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="scheduled" name="תורים מוזמנים" fill="#8884d8" />
                  <Bar dataKey="completed" name="תורים שהושלמו" fill="#82ca9d" />
                  <Bar dataKey="cancelled" name="ביטולים" fill="#ff8042" />
                  <Bar dataKey="noshow" name="אי הגעה" fill="#e60000" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end">
        <Button variant="outline">הורד דוח מפורט</Button>
      </div>
    </div>
  );
};

export default BusinessAnalytics;
