
import { useState } from 'react';
import { BarChart, LineChart, PieChart, Bar, Line, Pie, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface MonthlyData {
  name: string;
  income: number;
  expenses: number;
}

interface ValueData {
  name: string;
  value: number;
}

interface ColoredValueData extends ValueData {
  color: string;
}

interface AnalyticsChartsProps {
  monthlyData?: MonthlyData[];
  retentionData?: ValueData[];
  servicesData?: ColoredValueData[];
  bookingsData?: ValueData[];
}

const AnalyticsCharts = ({
  monthlyData = [],
  retentionData = [],
  servicesData = [],
  bookingsData = []
}: AnalyticsChartsProps) => {
  const [activeChart, setActiveChart] = useState('monthly');

  // מגמת ההזמנות נתונים
  const bookingsStats = {
    total: bookingsData.reduce((sum, item) => sum + item.value, 0),
    max: Math.max(...bookingsData.map(item => item.value)),
    average: bookingsData.reduce((sum, item) => sum + item.value, 0) / bookingsData.length
  };

  return (
    <Card className="border border-border/40">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base md:text-lg">נתונים אנליטיים</CardTitle>
        <Tabs defaultValue={activeChart} value={activeChart} onValueChange={setActiveChart} dir="rtl">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="monthly" className="text-xs md:text-sm">הכנסה חודשית</TabsTrigger>
            <TabsTrigger value="services" className="text-xs md:text-sm">שירותים פופולרים</TabsTrigger>
            <TabsTrigger value="retention" className="text-xs md:text-sm">שימור לקוחות</TabsTrigger>
            <TabsTrigger value="bookings" className="text-xs md:text-sm">מגמת הזמנות</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="pt-4 h-80">
        <TabsContent value="monthly" className="h-full">
          <div className="h-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData.map(item => ({
                  ...item,
                  profit: item.income - item.expenses
                }))}
                margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => `₪${value.toLocaleString()}`}
                  labelFormatter={(label) => `חודש: ${label}`}
                />
                <Bar dataKey="income" name="הכנסות" fill="#606c38" />
                <Bar dataKey="expenses" name="הוצאות" fill="#e07a5f" />
                <Bar dataKey="profit" name="רווח" fill="#ddbea9" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
        
        <TabsContent value="services" className="h-full">
          <div className="h-full flex flex-col md:flex-row">
            <div className="flex-1 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={servicesData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {servicesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => `${value}%`}
                    labelFormatter={(label) => `שירות: ${label}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="md:w-36 mt-4 md:mt-0 md:mr-4 flex flex-col justify-center">
              <h4 className="text-sm font-medium text-muted-foreground mb-4">התפלגות השירותים</h4>
              <div className="space-y-2">
                {servicesData.map((service, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: service.color }}></div>
                    <span className="text-xs">{service.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="retention" className="h-full">
          <div className="h-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={retentionData}
                margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis domain={[60, 100]} />
                <Tooltip 
                  formatter={(value: number) => `${value}%`}
                  labelFormatter={(label) => `חודש: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  name="אחוז שימור"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        <TabsContent value="bookings" className="h-full">
          <div className="h-full flex flex-col md:flex-row">
            <div className="flex-1 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={bookingsData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => `${value} הזמנות`}
                    labelFormatter={(label) => `תאריך: ${label}`}
                  />
                  <Bar dataKey="value" name="הזמנות" fill="#EFCFD4" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="md:w-36 mt-4 md:mt-0 md:mr-4 flex flex-col justify-center space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs">סה"כ חודשי:</span>
                  <span className="font-medium">{bookingsStats.total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs">מקסימום:</span>
                  <span className="font-medium">{bookingsStats.max}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs">ממוצע יומי:</span>
                  <span className="font-medium">{bookingsStats.average.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </CardContent>
    </Card>
  );
};

export default AnalyticsCharts;
