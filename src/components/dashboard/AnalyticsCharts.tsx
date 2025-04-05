
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  bookingsData 
}: AnalyticsChartsProps) => {
  const isMobile = useIsMobile();
  
  const chartConfig = {
    income: { label: "הכנסה", theme: { light: "#9b87f5", dark: "#9b87f5" } },
    expenses: { label: "הוצאות", theme: { light: "#f87171", dark: "#f87171" } },
    retention: { label: "שימור לקוחות", theme: { light: "#38bdf8", dark: "#38bdf8" } },
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="income" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="income">הכנסה חודשית</TabsTrigger>
          <TabsTrigger value="retention">שימור לקוחות</TabsTrigger>
          <TabsTrigger value="services">שירותים פופולריים</TabsTrigger>
          <TabsTrigger value="bookings">מגמת הזמנות</TabsTrigger>
        </TabsList>

        <TabsContent value="income" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>הכנסה והוצאה חודשית</CardTitle>
              <CardDescription>סקירת הביצועים הפיננסיים של העסק</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ChartContainer config={chartConfig} className="w-full">
                  <AreaChart data={monthlyData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area type="monotone" dataKey="income" name="income" stroke="var(--color-income)" fill="var(--color-income)" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="expenses" name="expenses" stroke="var(--color-expenses)" fill="var(--color-expenses)" fillOpacity={0.3} />
                    <Legend />
                  </AreaChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="retention" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>שיעור שימור לקוחות</CardTitle>
              <CardDescription>אחוז הלקוחות החוזרים לאורך החודשים</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ChartContainer config={chartConfig} className="w-full">
                  <LineChart data={retentionData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="value" name="retention" stroke="var(--color-retention)" strokeWidth={2} />
                  </LineChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>שירותים פופולריים</CardTitle>
              <CardDescription>השירותים המבוקשים ביותר בעסק שלך</CardDescription>
            </CardHeader>
            <CardContent>
              <div className={`h-[300px] flex ${isMobile ? "flex-col" : "flex-row"} gap-4`}>
                <div className={isMobile ? "h-[200px] w-full" : "h-full w-1/2"}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={servicesData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={isMobile ? 60 : 80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {servicesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className={isMobile ? "h-[200px] w-full" : "h-full w-1/2"}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={servicesData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" />
                      <Tooltip />
                      <Bar dataKey="value" name="הזמנות">
                        {servicesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>מגמת הזמנות יומית</CardTitle>
              <CardDescription>כמות ההזמנות לפי ימים בחודש האחרון</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={bookingsData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" name="הזמנות" fill="#9b87f5" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsCharts;
