
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { Button } from '@/components/ui/button';

interface AnalyticsChartsProps {
  monthlyData: {
    name: string;
    income: number;
    expenses: number;
  }[];
  retentionData: {
    name: string;
    value: number;
  }[];
  servicesData: {
    name: string;
    value: number;
    color: string;
  }[];
  bookingsData: {
    name: string;
    value: number;
  }[];
}

const AnalyticsCharts = ({
  monthlyData,
  retentionData,
  servicesData,
  bookingsData,
}: AnalyticsChartsProps) => {
  const [activeChart, setActiveChart] = useState('income');
  
  // Statistics for Order Trends (מגמת הזמנות)
  const totalBookings = bookingsData.reduce((sum, item) => sum + item.value, 0);
  const maxBooking = Math.max(...bookingsData.map(item => item.value));
  const avgBookings = totalBookings / bookingsData.length;

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="text-lg">נתונים אנליטיים</CardTitle>
        <CardDescription>ניתוח מגמות והכנסות של העסק</CardDescription>
        
        <div className="mt-2">
          <Tabs defaultValue="income" value={activeChart} onValueChange={setActiveChart}>
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="income" className="text-right">הכנסה חודשית</TabsTrigger>
              <TabsTrigger value="services" className="text-right">שירותים פופולריים</TabsTrigger>
              <TabsTrigger value="retention" className="text-right">שימור לקוחות</TabsTrigger>
              <TabsTrigger value="bookings" className="text-right">מגמת הזמנות</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {/* Income vs Expenses Chart */}
        <TabsContent value="income" className="h-80">
          <div className="mb-2 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-oliveGreen/90"></div>
                <span className="text-sm">הכנסות</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-softRose/90"></div>
                <span className="text-sm">הוצאות</span>
              </div>
            </div>
            
            <div className="space-x-1 rtl:space-x-reverse">
              <Button variant="filter" size="sm" className="text-xs">חודשי</Button>
              <Button variant="filter" size="sm" className="text-xs">רבעוני</Button>
              <Button variant="filter" size="sm" className="text-xs">שנתי</Button>
            </div>
          </div>
          <div className="h-[280px]" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [`₪${value}`, undefined]}
                  labelFormatter={(label) => `חודש: ${label}`}
                />
                <Bar dataKey="income" fill="#606c38" name="הכנסות" radius={[3, 3, 0, 0]} />
                <Bar dataKey="expenses" fill="#e07a5f" name="הוצאות" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
        
        {/* Popular Services Chart */}
        <TabsContent value="services" className="h-80">
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={servicesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {servicesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                <Tooltip formatter={(value: number) => [`${value}%`, undefined]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
        
        {/* Client Retention Chart */}
        <TabsContent value="retention" className="h-80">
          <div className="h-[320px]" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={retentionData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis domain={[50, 100]} />
                <Tooltip 
                  formatter={(value: number) => [`${value}%`, 'שימור']}
                  labelFormatter={(label) => `חודש: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
        
        {/* Bookings Trend Chart */}
        <TabsContent value="bookings" className="h-80">
          <div className="mb-6 grid grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg bg-card text-right">
              <p className="text-sm text-muted-foreground">סך הכל בחודש</p>
              <p className="text-xl font-semibold mt-1">{totalBookings}</p>
            </div>
            <div className="p-4 border rounded-lg bg-card text-right">
              <p className="text-sm text-muted-foreground">מקסימום</p>
              <p className="text-xl font-semibold mt-1">{maxBooking}</p>
            </div>
            <div className="p-4 border rounded-lg bg-card text-right">
              <p className="text-sm text-muted-foreground">ממוצע יומי</p>
              <p className="text-xl font-semibold mt-1">{avgBookings.toFixed(1)}</p>
            </div>
          </div>
          
          <div className="h-[220px]" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={bookingsData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [`${value} הזמנות`, undefined]}
                  labelFormatter={(label) => `יום: ${label}`}
                />
                <Bar dataKey="value" fill="#EFCFD4" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
      </CardContent>
    </Card>
  );
};

export default AnalyticsCharts;
