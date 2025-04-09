import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, Calendar, AlertTriangle, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CashFlowForecastProps {
  activeRange?: 'day' | 'week' | 'month';
}

const CashFlowForecast = ({ activeRange = 'week' }: CashFlowForecastProps) => {
  // Generate different forecast data based on the active range
  const getForecastData = () => {
    switch (activeRange) {
      case 'day':
        return [
          { date: '08:00', income: 150, expenses: 50, profit: 100, projected: false },
          { date: '10:00', income: 320, expenses: 70, profit: 250, projected: false },
          { date: '12:00', income: 480, expenses: 120, profit: 360, projected: false },
          { date: '14:00', income: 650, expenses: 180, profit: 470, projected: false },
          { date: '16:00', income: 760, expenses: 210, profit: 550, projected: true },
          { date: '18:00', income: 920, expenses: 260, profit: 660, projected: true },
          { date: '20:00', income: 1050, expenses: 290, profit: 760, projected: true },
        ];
      case 'week':
        return [
          { date: '04/08', income: 850, expenses: 300, profit: 550, projected: false },
          { date: '04/09', income: 920, expenses: 320, profit: 600, projected: false },
          { date: '04/10', income: 760, expenses: 290, profit: 470, projected: true },
          { date: '04/11', income: 650, expenses: 290, profit: 360, projected: true, note: "פסח - תנועה נמוכה" },
          { date: '04/12', income: 450, expenses: 290, profit: 160, projected: true, note: "חג" },
          { date: '04/13', income: 350, expenses: 200, profit: 150, projected: true, note: "שבת" },
          { date: '04/14', income: 820, expenses: 310, profit: 510, projected: true },
        ];
      case 'month':
        return [
          { date: 'שבוע 1', income: 3250, expenses: 1200, profit: 2050, projected: false },
          { date: 'שבוע 2', income: 4120, expenses: 1580, profit: 2540, projected: false },
          { date: 'שבוע 3', income: 3860, expenses: 1450, profit: 2410, projected: false },
          { date: 'שבוע 4', income: 3950, expenses: 1490, profit: 2460, projected: true },
          { date: 'שבוע 5', income: 4350, expenses: 1650, profit: 2700, projected: true, note: "חג - צפי לעליה" },
        ];
      default:
        return [
          { date: '04/08', income: 850, expenses: 300, profit: 550, projected: false },
          { date: '04/09', income: 920, expenses: 320, profit: 600, projected: false },
          { date: '04/10', income: 760, expenses: 290, profit: 470, projected: true },
          { date: '04/11', income: 650, expenses: 290, profit: 360, projected: true },
          { date: '04/12', income: 450, expenses: 290, profit: 160, projected: true },
          { date: '04/13', income: 350, expenses: 200, profit: 150, projected: true },
          { date: '04/14', income: 820, expenses: 310, profit: 510, projected: true },
        ];
    }
  };

  // Generate upcoming expenses based on active range
  const getUpcomingExpenses = () => {
    switch (activeRange) {
      case 'day':
        return [
          { id: '1', name: 'חשבון חשמל', date: '18:00 היום', amount: '₪450' },
          { id: '2', name: 'משלוח סחורה', date: '15:30 היום', amount: '₪280' },
          { id: '3', name: 'שכר שעתי', date: '20:00 היום', amount: '₪320' },
        ];
      case 'week':
        return [
          { id: '1', name: 'שכר דירה', date: '10/04/2025', amount: '₪3,500' },
          { id: '2', name: 'שכר עובדים', date: '05/04/2025', amount: '₪4,200' },
          { id: '3', name: 'הזמנת מלאי', date: '12/04/2025', amount: '₪1,800' },
        ];
      case 'month':
        return [
          { id: '1', name: 'שכר דירה', date: '10/04/2025', amount: '₪3,500' },
          { id: '2', name: 'שכר עובדים', date: '30/04/2025', amount: '₪16,800' },
          { id: '3', name: 'ביטוח עסק', date: '15/04/2025', amount: '₪2,350' },
          { id: '4', name: 'החזר הלוואה', date: '20/04/2025', amount: '₪4,500' },
        ];
      default:
        return [
          { id: '1', name: 'שכר דירה', date: '10/04/2025', amount: '₪3,500' },
          { id: '2', name: 'שכר עובדים', date: '05/04/2025', amount: '₪4,200' },
          { id: '3', name: 'הזמנת מלאי', date: '12/04/2025', amount: '₪1,800' },
        ];
    }
  };

  // Generate important notes based on active range
  const getImportantNotes = () => {
    switch (activeRange) {
      case 'day':
        return [
          { icon: <Calendar className="h-4 w-4 text-muted-foreground ml-2 mt-0.5" />, text: "פגישה עם ספק בשעה 16:00" },
          { icon: <TrendingUp className="h-4 w-4 text-oliveGreen ml-2 mt-0.5" />, text: "שעות השיא צפויות בין 17:00-19:00" },
        ];
      case 'week':
        return [
          { icon: <Calendar className="h-4 w-4 text-muted-foreground ml-2 mt-0.5" />, text: "פסח בשבת (12.04) - צפוי יום שקט יותר" },
          { icon: <TrendingUp className="h-4 w-4 text-oliveGreen ml-2 mt-0.5" />, text: "גידול של 15% בהזמנות לפני החג - הכן מלאי בהתאם" },
        ];
      case 'month':
        return [
          { icon: <Calendar className="h-4 w-4 text-muted-foreground ml-2 mt-0.5" />, text: "חגי ניסן (פסח) - תכנן את המלאי מראש" },
          { icon: <TrendingUp className="h-4 w-4 text-oliveGreen ml-2 mt-0.5" />, text: "צפי לעליה של 20% במכירות לקראת סוף החודש" },
          { icon: <AlertTriangle className="h-4 w-4 text-amber-500 ml-2 mt-0.5" />, text: "תשלומי מס רבעוניים בסוף החודש" },
        ];
      default:
        return [
          { icon: <Calendar className="h-4 w-4 text-muted-foreground ml-2 mt-0.5" />, text: "פסח בשבת (12.04) - צפוי יום שקט יותר" },
          { icon: <TrendingUp className="h-4 w-4 text-oliveGreen ml-2 mt-0.5" />, text: "גידול של 15% בהזמנות לפני החג - הכן מלאי בהתאם" },
        ];
    }
  };

  // Get appropriate title based on the active range
  const getTitleText = () => {
    switch (activeRange) {
      case 'day':
        return 'תחזית יומית';
      case 'week':
        return 'תחזית שבועית';
      case 'month':
        return 'תחזית חודשית';
      default:
        return 'תחזית שבועית';
    }
  };

  const forecastData = getForecastData();
  const upcomingExpenses = getUpcomingExpenses();
  const importantNotes = getImportantNotes();

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
              תחזית הכנסות והוצאות {activeRange === 'day' ? 'ליום הקרוב' : activeRange === 'week' ? 'לשבוע הקרוב' : 'לחודש הקרוב'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Cash flow chart */}
          <div className="border rounded-2xl p-4 bg-white shadow-card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">{getTitleText()}</h3>
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
                  data={forecastData}
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
                    fill="#606c38"
                    fillOpacity={0.7}
                    strokeWidth={2}
                  />
                  <Bar 
                    dataKey="expenses" 
                    className="expenses-bar" 
                    name="הוצאות"
                    radius={[4, 4, 0, 0]}
                    fill="#e07a5f"
                    fillOpacity={0.7}
                    strokeWidth={2}
                  />
                  <Bar 
                    dataKey="profit" 
                    className="profit-bar" 
                    name="רווח"
                    radius={[4, 4, 0, 0]}
                    fill="#ddbea9"
                    fillOpacity={0.7}
                    strokeWidth={2}
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
              {importantNotes.map((note, index) => (
                <li key={index} className="flex items-start">
                  {note.icon}
                  <span>{note.text}</span>
                </li>
              ))}
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
