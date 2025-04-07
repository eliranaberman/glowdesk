
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, Calendar, AlertTriangle, Cash } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ResponsiveBar } from 'recharts';

const CashFlowForecast = () => {
  // Mock data for cash flow forecasting
  const forecastData = [
    { date: '04/08', income: 850, expenses: 300, profit: 550, projected: false },
    { date: '04/09', income: 920, expenses: 320, profit: 600, projected: false },
    { date: '04/10', income: 760, expenses: 290, profit: 470, projected: true },
    { date: '04/11', income: 650, expenses: 290, profit: 360, projected: true, note: "פסח - תנועה נמוכה" },
    { date: '04/12', income: 450, expenses: 290, profit: 160, projected: true, note: "חג" },
    { date: '04/13', income: 350, expenses: 200, profit: 150, projected: true, note: "שבת" },
    { date: '04/14', income: 820, expenses: 310, profit: 510, projected: true },
  ];

  // Upcoming expenses
  const upcomingExpenses = [
    { id: '1', name: 'שכר דירה', date: '10/04/2025', amount: '₪3,500' },
    { id: '2', name: 'שכר עובדים', date: '05/04/2025', amount: '₪4,200' },
    { id: '3', name: 'הזמנת מלאי', date: '12/04/2025', amount: '₪1,800' },
  ];

  // Chart configuration
  const chartConfig = {
    income: {
      label: "הכנסות",
      theme: {
        light: "rgba(75, 192, 192, 0.7)",
        dark: "rgba(75, 192, 192, 0.7)",
      },
    },
    expenses: {
      label: "הוצאות",
      theme: {
        light: "rgba(255, 99, 132, 0.7)",
        dark: "rgba(255, 99, 132, 0.7)",
      },
    },
    profit: {
      label: "רווח",
      theme: {
        light: "rgba(153, 102, 255, 0.7)",
        dark: "rgba(153, 102, 255, 0.7)",
      },
    },
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center">
              <Cash className="h-5 w-5 ml-2 text-primary" />
              תחזית תזרים מזומנים
            </CardTitle>
            <CardDescription>
              תחזית הכנסות והוצאות לשבוע הקרוב
            </CardDescription>
          </div>
          <Link to="/finances/cash-flow">
            <Button variant="ghost" size="sm" className="gap-1">
              לכל הנתונים הפיננסיים
              <ArrowRight className="h-4 w-4 mr-1" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Cash flow chart */}
          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">תחזית שבועית</h3>
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-teal-500/70 rounded"></div>
                  <span>הכנסות</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-rose-500/70 rounded"></div>
                  <span>הוצאות</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-purple-500/70 rounded"></div>
                  <span>רווח</span>
                </div>
              </div>
            </div>

            <div className="h-[200px]" dir="ltr">
              <ChartContainer
                config={chartConfig}
                className="h-[200px]"
              >
                <ResponsiveBar
                  data={forecastData}
                  keys={["income", "expenses", "profit"]}
                  indexBy="date"
                  margin={{ top: 10, right: 10, bottom: 30, left: 40 }}
                  padding={0.3}
                  groupMode="grouped"
                  colors={({ id, data }) => {
                    if (id === "income") return "var(--color-income)";
                    if (id === "expenses") return "var(--color-expenses)";
                    return "var(--color-profit)";
                  }}
                  axisBottom={{
                    tickSize: 0,
                    tickPadding: 12,
                  }}
                  axisLeft={{
                    tickSize: 0,
                    tickPadding: 8,
                    tickValues: 5,
                  }}
                  axisTop={null}
                  axisRight={null}
                  enableGridY={true}
                  gridYValues={5}
                  enableLabel={false}
                  role="application"
                  ariaLabel="Cash flow forecast chart"
                  barComponent={({ data, ...rest }) => {
                    return (
                      <g 
                        opacity={data.projected ? 0.7 : 1}
                        style={{ 
                          strokeDasharray: data.projected ? "3,3" : "none",
                          stroke: data.projected ? "#888" : "none" 
                        }}
                        {...rest} 
                      />
                    );
                  }}
                  tooltip={({ id, value, color, data }) => (
                    <div className="bg-white px-2 py-1 border shadow text-xs rtl">
                      <div className="font-medium mb-1">{data.date}</div>
                      <div className="flex items-center justify-between gap-2">
                        <span>{chartConfig[id as keyof typeof chartConfig].label}:</span>
                        <span>₪{value}</span>
                      </div>
                      {data.note && (
                        <div className="text-xs text-red-500 mt-1">
                          <AlertTriangle className="inline h-3 w-3 mr-1" />
                          {data.note}
                        </div>
                      )}
                    </div>
                  )}
                />
              </ChartContainer>
            </div>
            <div className="flex justify-between items-center text-xs mt-2">
              <div>נתונים היסטוריים</div>
              <div>תחזית</div>
            </div>
          </div>

          {/* Important notes */}
          <div className="border rounded-lg p-4 bg-muted/20">
            <div className="flex items-center mb-3">
              <AlertTriangle className="h-4 w-4 text-amber-500 ml-2" />
              <h3 className="font-medium">תזכורות חשובות</h3>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <Calendar className="h-4 w-4 text-muted-foreground ml-2 mt-0.5" />
                <span>פסח בשבת (12.04) - צפוי יום שקט יותר</span>
              </li>
              <li className="flex items-start">
                <TrendingUp className="h-4 w-4 text-green-500 ml-2 mt-0.5" />
                <span>גידול של 15% בהזמנות לפני החג - הכן מלאי בהתאם</span>
              </li>
            </ul>
          </div>

          {/* Upcoming expenses */}
          <div>
            <h3 className="font-medium mb-3">הוצאות קרובות</h3>
            <div className="space-y-2">
              {upcomingExpenses.map((expense) => (
                <div key={expense.id} className="flex justify-between items-center p-2 border rounded-lg">
                  <div>
                    <p className="font-medium">{expense.name}</p>
                    <p className="text-xs text-muted-foreground">{expense.date}</p>
                  </div>
                  <p className="font-semibold">{expense.amount}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CashFlowForecast;
