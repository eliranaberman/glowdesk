
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, ArrowRight, TrendingUp, TrendingDown, AlertTriangle, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const BusinessInsights = () => {
  const [activeTab, setActiveTab] = useState('today');

  // Mock insights data
  const insights = {
    today: [
      {
        id: '1',
        type: 'suggestion',
        icon: <Lightbulb className="h-4 w-4 text-amber-500" />,
        title: 'הזדמנות - טיפולי פנים',
        message: '85% מהלקוחות שעושות מניקור גם מתעניינות בטיפולי פנים. שקלי להציע חבילה משולבת.',
        priority: 'medium',
      },
      {
        id: '2',
        type: 'alert',
        icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
        title: 'התראה - חומרי גלם',
        message: 'כמות הלק השחור עומדת להיגמר. מומלץ להזמין עוד השבוע.',
        priority: 'high',
      }
    ],
    week: [
      {
        id: '3',
        type: 'trend',
        icon: <TrendingUp className="h-4 w-4 text-green-500" />,
        title: 'מגמה חיובית',
        message: 'עלייה של 18% בהזמנת טיפולי אקריליק בהשוואה לשבוע שעבר. שקלי להוסיף מבצע לטיפול זה.',
        priority: 'medium',
      },
      {
        id: '4',
        type: 'suggestion',
        icon: <Clock className="h-4 w-4 text-blue-500" />,
        title: 'ימי שני פנויים',
        message: 'זיהינו ירידה בהזמנות לימי שני. שקלי להציע הנחה מיוחדת או מבצע ליום זה.',
        priority: 'medium',
      }
    ],
    month: [
      {
        id: '5',
        type: 'trend',
        icon: <TrendingDown className="h-4 w-4 text-red-500" />,
        title: 'לקוחות לא פעילים',
        message: '28 לקוחות לא קבעו תור בחודשיים האחרונים. שלחי להם הודעה לחזרה עם הנחה.',
        priority: 'high',
      },
      {
        id: '6',
        type: 'suggestion',
        icon: <Lightbulb className="h-4 w-4 text-amber-500" />,
        title: 'תובנה מיוחדת',
        message: 'פסח מתקרב. הזמנות גדלות ב-35% בשבוע שלפני החג. התכונני עם תוספת זמני טיפול.',
        priority: 'medium',
      }
    ],
  };

  // Mock inactive clients
  const inactiveClients = [
    { id: '1', name: 'מיטל אברהם', lastVisit: '60 ימים', treatments: 8 },
    { id: '2', name: 'דנה לוי', lastVisit: '45 ימים', treatments: 12 },
    { id: '3', name: 'רונית כהן', lastVisit: '90 ימים', treatments: 5 },
  ];

  const getInsightCardStyle = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-4 border-l-red-400 bg-red-50/30';
      case 'medium':
        return 'border-l-4 border-l-amber-400 bg-amber-50/30';
      default:
        return 'border-l-4 border-l-blue-400 bg-blue-50/30';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center">
              <Lightbulb className="h-5 w-5 ml-2 text-primary" />
              תובנות עסקיות
            </CardTitle>
            <CardDescription>
              המלצות ותובנות מבוססות נתונים לשיפור העסק
            </CardDescription>
          </div>
          <Link to="/insights">
            <Button variant="ghost" size="sm" className="gap-1">
              לכל התובנות
              <ArrowRight className="h-4 w-4 mr-1" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="today" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="today">היום</TabsTrigger>
            <TabsTrigger value="week">השבוע</TabsTrigger>
            <TabsTrigger value="month">החודש</TabsTrigger>
          </TabsList>
          
          <TabsContent value="today" className="space-y-4">
            {insights.today.map((insight) => (
              <div
                key={insight.id}
                className={cn("p-4 rounded-lg", getInsightCardStyle(insight.priority))}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{insight.icon}</div>
                  <div>
                    <h3 className="font-medium text-base">{insight.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{insight.message}</p>
                  </div>
                </div>
              </div>
            ))}

            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-3">לקוחות לא פעילים</h3>
              <div className="space-y-3">
                {inactiveClients.map((client) => (
                  <div key={client.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-sm">{client.name}</p>
                      <p className="text-xs text-muted-foreground">ביקור אחרון: לפני {client.lastVisit}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      שלח תזכורת
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="week" className="space-y-4">
            {insights.week.map((insight) => (
              <div
                key={insight.id}
                className={cn("p-4 rounded-lg", getInsightCardStyle(insight.priority))}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{insight.icon}</div>
                  <div>
                    <h3 className="font-medium text-base">{insight.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{insight.message}</p>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-3">ביצועי השבוע לפי יום</h3>
              <div className="space-y-3">
                {['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי'].map((day, index) => {
                  const value = [90, 50, 80, 75, 85, 95][index];
                  return (
                    <div key={day} className="flex items-center gap-2">
                      <span className="text-sm min-w-[80px]">{day}</span>
                      <Progress value={value} className="h-2 flex-1" />
                      <span className="text-xs text-muted-foreground min-w-[30px] text-left">
                        {value}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="month" className="space-y-4">
            {insights.month.map((insight) => (
              <div
                key={insight.id}
                className={cn("p-4 rounded-lg", getInsightCardStyle(insight.priority))}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{insight.icon}</div>
                  <div>
                    <h3 className="font-medium text-base">{insight.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{insight.message}</p>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-3">מגמות חודשיות</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">לקוחות חדשים</span>
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 text-green-500 ml-1" />
                    <span className="text-green-500 text-sm">+12%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">הכנסה חודשית</span>
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 text-green-500 ml-1" />
                    <span className="text-green-500 text-sm">+8%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">מספר טיפולים</span>
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 text-green-500 ml-1" />
                    <span className="text-green-500 text-sm">+5%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">ביטולי פגישות</span>
                  <div className="flex items-center">
                    <TrendingDown className="h-4 w-4 text-red-500 ml-1" />
                    <span className="text-red-500 text-sm">-3%</span>
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

export default BusinessInsights;
