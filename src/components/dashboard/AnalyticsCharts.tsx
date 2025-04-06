
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
import { ArrowUp, TrendingUp, CreditCard, DollarSign, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  
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
  
  // Updated colors for income (green) and expenses (red)
  const incomeColor = "#4ade80"; // A nice green color
  const expensesColor = "#f87171"; // Keeping the existing red
  
  const chartConfig = {
    income: { label: "הכנסה", theme: { light: incomeColor, dark: incomeColor } },
    expenses: { label: "הוצאות", theme: { light: expensesColor, dark: expensesColor } },
    retention: { label: "שימור לקוחות", theme: { light: "#38bdf8", dark: "#38bdf8" } },
  };

  // Custom tooltip formatter for the income chart
  const incomeTooltipFormatter = (value: number, name: string) => {
    const formattedValue = new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0
    }).format(value);
    
    // Fix the label here - "income" should be "הכנסה" not "הוצאות"
    return [formattedValue, name === 'income' ? 'הכנסה' : 'הוצאות'];
  };

  const handleInfoClick = () => {
    toast({
      title: "נתונים פיננסיים",
      description: "הנתונים מציגים את ההכנסות וההוצאות החודשיות של העסק",
    });
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="income" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="income" className="font-medium">הכנסה חודשית</TabsTrigger>
          <TabsTrigger value="retention" className="font-medium">שימור לקוחות</TabsTrigger>
          <TabsTrigger value="services" className="font-medium">שירותים פופולריים</TabsTrigger>
          <TabsTrigger value="bookings" className="font-medium">מגמת הזמנות</TabsTrigger>
        </TabsList>

        <TabsContent value="income" className="space-y-4">
          <Card className="border-t-4 border-t-primary/80 shadow-soft hover:shadow-soft-lg transition-shadow duration-300">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <DollarSign className="h-6 w-6 text-primary" />
                    הכנסה והוצאה חודשית
                    <button 
                      className="ml-2 text-muted-foreground hover:text-primary transition-colors"
                      onClick={handleInfoClick}
                    >
                      <Info className="h-4 w-4" />
                    </button>
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
                        <stop offset="5%" stopColor={incomeColor} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={incomeColor} stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id={expenseGradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={expensesColor} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={expensesColor} stopOpacity={0.1}/>
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
                      stroke="#38bdf8" 
                      strokeDasharray="3 3" 
                      label={{ 
                        value: 'ממוצע הכנסות', 
                        fill: '#38bdf8', 
                        fontSize: 12,
                        position: 'right'
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="income" 
                      name="הכנסה" 
                      stroke={incomeColor} 
                      strokeWidth={3}
                      fill={`url(#${incomeGradientId})`}
                      activeDot={{ r: 8, strokeWidth: 0, fill: incomeColor }}
                      stackId="1"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="expenses" 
                      name="הוצאות" 
                      stroke={expensesColor} 
                      strokeWidth={3}
                      fill={`url(#${expenseGradientId})`}
                      activeDot={{ r: 6, strokeWidth: 0, fill: expensesColor }}
                      stackId="2"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              {/* Additional profit summary cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                {profitData.slice(-3).map((item, index) => (
                  <div 
                    key={index} 
                    className="bg-secondary/10 p-4 rounded-lg border border-border/30 hover:border-primary/30 transition-colors"
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
          <Card className="border-t-4 border-t-accent/80 shadow-soft hover:shadow-soft-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                שיעור שימור לקוחות
                <button 
                  className="ml-2 text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => toast({
                    title: "שימור לקוחות",
                    description: "הנתונים מציגים את אחוז הלקוחות החוזרים לאורך החודשים",
                  })}
                >
                  <Info className="h-4 w-4" />
                </button>
              </CardTitle>
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
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      name="retention" 
                      stroke="var(--color-retention)" 
                      strokeWidth={2} 
                      activeDot={{ r: 8, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ChartContainer>
              </div>
              <div className="mt-4 flex justify-between items-center rounded-lg bg-secondary/10 p-3 border border-border/30">
                <div>
                  <p className="font-medium">ממוצע שימור חודשי</p>
                  <p className="text-sm text-muted-foreground">שישה חודשים אחרונים</p>
                </div>
                <div className="text-2xl font-semibold text-primary">{(retentionData.reduce((acc, item) => acc + item.value, 0) / retentionData.length).toFixed(1)}%</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <Card className="border-t-4 border-t-warmBeige shadow-soft hover:shadow-soft-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                שירותים פופולריים
                <button 
                  className="ml-2 text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => toast({
                    title: "שירותים פופולריים",
                    description: "התפלגות השירותים הפופולריים ביותר בעסק",
                  })}
                >
                  <Info className="h-4 w-4" />
                </button>
              </CardTitle>
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
                      <Tooltip contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        border: '1px solid #eaeaea'
                      }} />
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
                      <Tooltip contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        border: '1px solid #eaeaea'
                      }} />
                      <Bar dataKey="value" name="הזמנות">
                        {servicesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-5 gap-2">
                {servicesData.map((service, index) => (
                  <div 
                    key={index} 
                    className="flex flex-col items-center p-2 rounded-lg border border-border/30"
                    style={{ backgroundColor: `${service.color}30` }}
                  >
                    <div 
                      className="w-3 h-3 rounded-full mb-1" 
                      style={{ backgroundColor: service.color }}
                    ></div>
                    <span className="text-xs font-medium">{service.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-4">
          <Card className="border-t-4 border-t-softRose shadow-soft hover:shadow-soft-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                מגמת הזמנות יומית
                <button 
                  className="ml-2 text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => toast({
                    title: "מגמת הזמנות",
                    description: "הנתונים מציגים את כמות ההזמנות לפי ימים בחודש האחרון",
                  })}
                >
                  <Info className="h-4 w-4" />
                </button>
              </CardTitle>
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
                    <Tooltip contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                      border: '1px solid #eaeaea'
                    }} />
                    <Bar dataKey="value" name="הזמנות" fill="#9b87f5">
                      {/* Add hover effect by making each bar interactive */}
                      {bookingsData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill="#9b87f5"
                          fillOpacity={0.8}
                          className="hover:fill-opacity-100"
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/10 border border-border/30">
                  <p className="font-medium">ממוצע יומי</p>
                  <p className="text-lg font-semibold">{(bookingsData.reduce((acc, item) => acc + item.value, 0) / bookingsData.length).toFixed(1)}</p>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/10 border border-border/30">
                  <p className="font-medium">מקסימום</p>
                  <p className="text-lg font-semibold">{Math.max(...bookingsData.map(item => item.value))}</p>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/10 border border-border/30">
                  <p className="font-medium">סה"כ חודשי</p>
                  <p className="text-lg font-semibold">{bookingsData.reduce((acc, item) => acc + item.value, 0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsCharts;
