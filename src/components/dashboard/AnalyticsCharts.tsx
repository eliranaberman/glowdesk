
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart, PieChart } from "lucide-react";
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart as RechartsLineChart, Line } from "recharts";

// Define types for the props
interface AnalyticsChartsProps {
  monthlyData?: Array<{ name: string; income: number; expenses: number; }>;
  retentionData?: Array<{ name: string; value: number; }>;
  servicesData?: Array<{ name: string; value: number; color: string; }>;
  bookingsData?: Array<{ name: string; value: number; }>;
}

// Default data if no props are provided
const mockAnalyticsData = [
  { name: "ינואר", הכנסות: 4000, הוצאות: 2400 },
  { name: "פברואר", הכנסות: 3000, הוצאות: 2200 },
  { name: "מרץ", הכנסות: 5000, הוצאות: 2600 },
  { name: "אפריל", הכנסות: 4500, הוצאות: 2800 },
  { name: "מאי", הכנסות: 6000, הוצאות: 3000 },
  { name: "יוני", הכנסות: 5500, הוצאות: 2900 }
];

const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({
  monthlyData,
  retentionData,
  servicesData,
  bookingsData
}) => {
  // Transform monthly data if provided to match the format expected by the charts
  const chartData = monthlyData ? monthlyData.map(item => ({
    name: item.name,
    הכנסות: item.income,
    הוצאות: item.expenses
  })) : mockAnalyticsData;

  // Cash flow forecast colors (matching CashFlowForecast component)
  const incomeColor = "#606c38"; // oliveGreen
  const expensesColor = "#e07a5f"; // softRose
  const profitColor = "#ddbea9"; // roseGold

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>נתונים כספיים</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="bar" className="w-full">
          <TabsList className="mb-4 grid grid-cols-3">
            <TabsTrigger value="bar" className="flex items-center gap-1.5">
              <BarChart className="h-4 w-4" />
              גרף עמודות
            </TabsTrigger>
            <TabsTrigger value="line" className="flex items-center gap-1.5">
              <LineChart className="h-4 w-4" />
              גרף קווי
            </TabsTrigger>
            <TabsTrigger value="comparison" className="flex items-center gap-1.5">
              <PieChart className="h-4 w-4" />
              השוואה
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="bar">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => `₪${value}`} 
                    labelFormatter={(label) => `חודש: ${label}`}
                  />
                  <Legend 
                    formatter={(value) => <span style={{marginRight: 10}}>{value}</span>}
                    align="right" 
                  />
                  <Bar dataKey="הכנסות" fill={incomeColor} fillOpacity={0.7} />
                  <Bar dataKey="הוצאות" fill={expensesColor} fillOpacity={0.7} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="line">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => `₪${value}`} 
                    labelFormatter={(label) => `חודש: ${label}`}
                  />
                  <Legend 
                    formatter={(value) => <span style={{marginRight: 10}}>{value}</span>}
                    align="right" 
                  />
                  <Line type="monotone" dataKey="הכנסות" stroke={incomeColor} activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="הוצאות" stroke={expensesColor} />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="comparison">
            <div className="flex gap-4 flex-col md:flex-row">
              <div className="flex-1 border rounded-lg p-4">
                <h3 className="font-medium mb-3 text-center">יחס הכנסות/הוצאות</h3>
                <div className="space-y-4">
                  {chartData.map((month) => (
                    <div key={month.name} className="space-y-1">
                      <div className="flex justify-between">
                        <span>{month.name}</span>
                        <span>יחס: {(month.הכנסות / month.הוצאות).toFixed(1)}</span>
                      </div>
                      <div className="bg-muted h-2 rounded-full">
                        <div 
                          className="h-2 rounded-full" 
                          style={{ width: `${Math.min(100, (month.הכנסות / month.הוצאות) * 50)}%`, backgroundColor: incomeColor }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1 border rounded-lg p-4">
                <h3 className="font-medium mb-3 text-center">סיכום שנתי</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>סה״כ הכנסות:</span>
                    <span className="font-bold">
                      ₪{chartData.reduce((sum, month) => sum + month.הכנסות, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>סה״כ הוצאות:</span>
                    <span className="font-bold">
                      ₪{chartData.reduce((sum, month) => sum + month.הוצאות, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span>רווח נקי:</span>
                    <span className="font-bold" style={{ color: incomeColor }}>
                      ₪{(chartData.reduce((sum, month) => sum + month.הכנסות - month.הוצאות, 0)).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AnalyticsCharts;
