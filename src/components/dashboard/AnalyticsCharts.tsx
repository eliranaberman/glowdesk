
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
  Cell,
  ReferenceLine
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUp, TrendingUp, CreditCard, DollarSign } from 'lucide-react';

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
  
  // Calculate average income for reference line
  const averageIncome = monthlyData.reduce((sum, item) => sum + item.income, 0) / monthlyData.length;
  
  // Calculate profit/loss data
  const profitData = monthlyData.map(item => ({
    name: item.name,
    profit: item.income - item.expenses,
    profitPercent: ((item.income - item.expenses) / item.income * 100).toFixed(1)
  }));
  
  // Custom gradient colors for the chart
  const incomeGradientId = "incomeGradient";
  const expenseGradientId = "expenseGradient";
  
  const chartConfig = {
    income: { label: "הכנסה", theme: { light: "#9b87f5", dark: "#9b87f5" } },
    expenses: { label: "הוצאות", theme: { light: "#f87171", dark: "#f87171" } },
    retention: { label: "שימור לקוחות", theme: { light: "#38bdf8", dark: "#38bdf8" } },
  };

  // Custom tooltip formatter for the income chart
  const incomeTooltipFormatter = (value: number, name: string) => {
    const formattedValue = new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0
    }).format(value);
    
    return [formattedValue, name === 'income' ? 'הכנסה' : 'הוצאות'];
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
          <Card className="border-t-4 border-t-primary shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <DollarSign className="h-6 w-6 text-primary" />
                    הכנסה והוצאה חודשית
                  </CardTitle>
                  <CardDescription className="text-base mt-1">
                    סקירת הביצועים הפיננסיים של העסק
                  </CardDescription>
                </div>
                <div className="bg-primary/10 p-2 rounded-lg flex items-center gap-1 text-primary font-medium">
                  <ArrowUp className="h-4 w-4" />
                  <span>8% מהחודש שעבר</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[450px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <defs>
                      <linearGradient id={incomeGradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#9b87f5" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#9b87f5" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id={expenseGradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f87171" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#f87171" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eaeaea" />
                    <XAxis 
                      dataKey="name" 
                      padding={{ left: 30, right: 30 }} 
                      tick={{ fill: '#888', fontSize: 12 }}
                    />
                    <YAxis 
                      tick={{ fill: '#888', fontSize: 12 }}
                      tickFormatter={(value) => `₪${value.toLocaleString()}`}
                    />
                    <Tooltip 
                      contentStyle={{
                        textAlign: 'right', 
                        direction: 'rtl',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        border: '1px solid #eaeaea'
                      }}
                      formatter={incomeTooltipFormatter}
                      labelFormatter={(label) => `חודש: ${label}`}
                    />
                    <Legend 
                      layout="horizontal" 
                      verticalAlign="top" 
                      align="right" 
                      wrapperStyle={{ paddingBottom: '10px' }}
                    />
                    <ReferenceLine 
                      y={averageIncome} 
                      stroke="#8884d8" 
                      strokeDasharray="3 3" 
                      label={{ 
                        value: 'ממוצע הכנסות', 
                        fill: '#8884d8', 
                        fontSize: 12,
                        position: 'right'
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="income" 
                      name="הכנסה" 
                      stroke="#9b87f5" 
                      strokeWidth={3}
                      fill={`url(#${incomeGradientId})`}
                      activeDot={{ r: 8, strokeWidth: 0, fill: '#9b87f5' }}
                      stackId="1"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="expenses" 
                      name="הוצאות" 
                      stroke="#f87171" 
                      strokeWidth={3}
                      fill={`url(#${expenseGradientId})`}
                      activeDot={{ r: 6, strokeWidth: 0, fill: '#f87171' }}
                      stackId="2"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              {/* Additional profit summary cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {profitData.slice(-3).map((item, index) => (
                  <div 
                    key={index} 
                    className="bg-secondary/20 p-4 rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-muted-foreground">{item.name}</h4>
                      <TrendingUp className={`h-4 w-4 ${item.profit > 0 ? 'text-green-500' : 'text-red-500'}`} />
                    </div>
                    <p className="text-2xl font-semibold mt-1">₪{item.profit.toLocaleString()}</p>
                    <div className="flex items-center gap-1 mt-1 text-xs">
                      <span className={item.profit > 0 ? 'text-green-500' : 'text-red-500'}>
                        {item.profitPercent}% רווח
                      </span>
                      <CreditCard className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </div>
                ))}
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
