
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ArrowRight, BarChart as BarChartIcon, LineChart as LineChartIcon, Lightbulb, TrendingUp } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';

const BusinessInsights = () => {
  const [activeTab, setActiveTab] = useState('goals');
  const navigate = useNavigate();

  // Mock data
  const performanceData = [
    { month: 'ינואר', revenue: 12400, target: 12000, clients: 45 },
    { month: 'פברואר', revenue: 13100, target: 12500, clients: 48 },
    { month: 'מרץ', revenue: 14200, target: 13000, clients: 52 },
    { month: 'אפריל', revenue: 13800, target: 13500, clients: 55 },
    { month: 'מאי', revenue: 15100, target: 14000, clients: 58 },
    { month: 'יוני', revenue: 15800, target: 14500, clients: 62 },
  ];

  // Key insights data
  const keyInsights = [
    {
      title: 'שעות שיא ביקוש',
      description: 'בין השעות 16:00-18:00 נרשם הביקוש הגבוה ביותר לטיפולים. שקלי להוסיף תורים בשעות אלה.',
      priority: 'high'
    },
    {
      title: 'לקוחות חוזרים',
      description: '68% מהלקוחות מגיעים לפחות פעם בחודשיים. יש מקום לשיפור בשיעור החזרה.',
      priority: 'medium'
    },
    {
      title: 'שירותים משולבים',
      description: 'לקוחות שמזמינות מניקור+פדיקור יחד מוציאות בממוצע 35% יותר מלקוחות שמזמינות טיפול בודד.',
      priority: 'high'
    },
  ];

  const goalData = [
    { name: 'הכנסה חודשית', current: 15800, target: 20000, percentage: 79 },
    { name: 'לקוחות חדשים', current: 12, target: 20, percentage: 60 },
    { name: 'שיעור חזרה', current: 68, target: 80, percentage: 85 },
    { name: 'טיפולים בשבוע', current: 32, target: 40, percentage: 80 },
  ];

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold mb-1">תובנות עסקיות</h1>
          <p className="text-muted-foreground">ניתוח הביצועים העסקיים שלך והצעות לשיפור</p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">ביצועים עסקיים</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="goals" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  יעדים
                </TabsTrigger>
                <TabsTrigger value="performance" className="flex items-center gap-2">
                  <BarChartIcon className="h-4 w-4" />
                  ביצועים
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="performance">
                <div className="h-[300px]" dir="ltr">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={performanceData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value: number) => [`₪${value}`, undefined]}
                        labelFormatter={(label) => `חודש: ${label}`}
                      />
                      <Bar dataKey="revenue" name="הכנסה" fill="#606c38" radius={[3, 3, 0, 0]} />
                      <Bar dataKey="target" name="יעד" fill="#ddbea9" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              
              <TabsContent value="goals">
                <div className="space-y-6">
                  {goalData.map((goal, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{goal.name}</span>
                        <span className="text-sm text-muted-foreground">{goal.current}/{goal.target}</span>
                      </div>
                      <Progress value={goal.percentage} className="h-2" />
                      <div className="flex justify-end">
                        <span className="text-xs text-muted-foreground">{goal.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Lightbulb className="h-5 w-5 ml-2 text-amber-500" />
              תובנות מפתח
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {keyInsights.map((insight, i) => (
                <div 
                  key={i} 
                  className={`p-4 rounded-lg border-r-4 ${
                    insight.priority === 'high' ? 'border-r-amber-400 bg-amber-50/30' : 
                    'border-r-blue-400 bg-blue-50/30'
                  }`}
                >
                  <h3 className="font-medium mb-1">{insight.title}</h3>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                </div>
              ))}
              
              <div className="pt-2 flex justify-end">
                <Link to="/finances/detailed-insights">
                  <Button variant="outline" className="gap-1">
                    לפרטים נוספים
                    <ArrowRight className="h-4 w-4 mr-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">מגמות לקוחות</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={performanceData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => [value, 'מספר לקוחות']}
                    labelFormatter={(label) => `חודש: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="clients" 
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }} 
                    name="לקוחות" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BusinessInsights;
