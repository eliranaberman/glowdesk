
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, Calendar, AlertTriangle, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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

  // Prepare data with visual styling for historical vs projected data
  const styledData = forecastData.map(item => ({
    ...item,
    incomeOpacity: item.projected ? 0.7 : 1,
    expensesOpacity: item.projected ? 0.7 : 1,
    profitOpacity: item.projected ? 0.7 : 1,
  }));

  // Upcoming expenses
  const upcomingExpenses = [
    { id: '1', name: 'שכר דירה', date: '10/04/2025', amount: '₪3,500' },
    { id: '2', name: 'שכר עובדים', date: '05/04/2025', amount: '₪4,200' },
    { id: '3', name: 'הזמנת מלאי', date: '12/04/2025', amount: '₪1,800' },
  ];

  return (
    <Card className="elegant-card overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center">
              <DollarSign className="h-5 w-5 ml-2 text-roseGold" />
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
          <div className="border rounded-2xl p-4 bg-white shadow-card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">תחזית שבועית</h3>
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-oliveGreen/90 rounded"></div>
                  <span>הכנסות</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-softRose/90 rounded"></div>
                  <span>הוצאות</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-roseGold/90 rounded"></div>
                  <span>רווח</span>
                </div>
              </div>
            </div>

            <div className="h-[200px]" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={styledData}
                  margin={{ top: 10, right: 10, bottom: 30, left: 40 }}
                  barGap={0}
                  barSize={20}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="date" tickSize={0} />
                  <YAxis tickSize={0} />
                  <Tooltip 
                    cursor={{fill: 'rgba(240, 240, 240, 0.2)'}}
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white px-3 py-2 border shadow-soft rounded-lg text-xs rtl">
                            <div className="font-medium mb-2 text-center border-b pb-1">{data.date}</div>
                            {payload.map((entry, index) => (
                              <div key={`item-${index}`} className="flex items-center justify-between gap-4 py-0.5">
                                <span className="font-medium">
                                  {entry.dataKey === 'income' ? 'הכנסות' :
                                   entry.dataKey === 'expenses' ? 'הוצאות' : 'רווח'}:
                                </span>
                                <span className="font-semibold">₪{entry.value}</span>
                              </div>
                            ))}
                            {data.note && (
                              <div className="text-xs text-destructive mt-2 pt-1 border-t flex items-center">
                                <AlertTriangle className="inline h-3 w-3 mr-1" />
                                {data.note}
                              </div>
                            )}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar 
                    dataKey="income" 
                    className="income-bar" 
                    name="הכנסות"
                    radius={[4, 4, 0, 0]}
                    stroke={styledData[0].projected ? "#888" : "transparent"}
                    strokeDasharray={styledData[0].projected ? "3 3" : "0"}
                    fillOpacity={0.7}
                  />
                  <Bar 
                    dataKey="expenses" 
                    className="expenses-bar" 
                    name="הוצאות"
                    radius={[4, 4, 0, 0]}
                    stroke={styledData[0].projected ? "#888" : "transparent"}
                    strokeDasharray={styledData[0].projected ? "3 3" : "0"}
                    fillOpacity={0.7}
                  />
                  <Bar 
                    dataKey="profit" 
                    className="profit-bar" 
                    name="רווח"
                    radius={[4, 4, 0, 0]}
                    stroke={styledData[0].projected ? "#888" : "transparent"}
                    strokeDasharray={styledData[0].projected ? "3 3" : "0"}
                    fillOpacity={0.7}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex justify-between items-center text-xs mt-3">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-gray-400 ml-1.5 rounded-sm"></div>
                <span>נתונים היסטוריים</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-gray-400 ml-1.5 rounded-sm border border-gray-500 border-dashed"></div>
                <span>תחזית</span>
              </div>
            </div>
          </div>

          {/* Important notes */}
          <div className="border rounded-2xl p-4 bg-warmBeige/30">
            <div className="flex items-center mb-3">
              <AlertTriangle className="h-4 w-4 text-amber-500 ml-2" />
              <h3 className="font-medium">תזכורות חשובות</h3>
            </div>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-start">
                <Calendar className="h-4 w-4 text-muted-foreground ml-2 mt-0.5" />
                <span>פסח בשבת (12.04) - צפוי יום שקט יותר</span>
              </li>
              <li className="flex items-start">
                <TrendingUp className="h-4 w-4 text-oliveGreen ml-2 mt-0.5" />
                <span>גידול של 15% בהזמנות לפני החג - הכן מלאי בהתאם</span>
              </li>
            </ul>
          </div>

          {/* Upcoming expenses */}
          <div>
            <h3 className="font-medium mb-3">הוצאות קרובות</h3>
            <div className="space-y-2">
              {upcomingExpenses.map((expense) => (
                <div 
                  key={expense.id} 
                  className="flex justify-between items-center p-3 border rounded-xl bg-white hover:bg-softGray/30 transition-colors"
                >
                  <div>
                    <p className="font-medium">{expense.name}</p>
                    <p className="text-xs text-muted-foreground">{expense.date}</p>
                  </div>
                  <p className="font-semibold text-primary">{expense.amount}</p>
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
