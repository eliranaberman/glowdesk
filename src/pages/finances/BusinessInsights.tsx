
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, LineChart, Users, Calendar, Award, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart as RechartsLineChart, Line } from 'recharts';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const BusinessInsights = () => {
  const isMobile = useIsMobile();
  
  // Growth trends data
  const growthData = [
    { month: 'ינואר', clients: 124, sessions: 183, revenue: 10200 },
    { month: 'פברואר', clients: 132, sessions: 197, revenue: 11800 },
    { month: 'מרץ', clients: 141, sessions: 210, revenue: 12900 },
    { month: 'אפריל', clients: 158, sessions: 245, revenue: 14500 },
    { month: 'מאי', clients: 164, sessions: 258, revenue: 15100 },
    { month: 'יוני', clients: 176, sessions: 267, revenue: 16400 },
  ];

  // Service popularity data
  const servicePopularity = [
    { name: 'מניקור ג\'ל', value: 40 },
    { name: 'פדיקור', value: 25 },
    { name: 'אקריליק', value: 18 },
    { name: 'לק ג\'ל', value: 12 },
    { name: 'עיצוב', value: 5 },
  ];

  // Client retention data
  const retentionData = [
    { month: 'ינואר', rate: 68 },
    { month: 'פברואר', rate: 71 },
    { month: 'מרץ', rate: 72 },
    { month: 'אפריל', rate: 75 },
    { month: 'מאי', rate: 78 },
    { month: 'יוני', rate: 82 },
  ];

  // Key business metrics
  const keyMetrics = [
    {
      title: 'שיעור שימור לקוחות',
      value: '82%',
      change: '+5%',
      icon: <Users className="h-5 w-5 text-roseGold" />,
      trend: 'positive'
    },
    {
      title: 'הכנסה ממוצעת ללקוח',
      value: '₪480',
      change: '+8%',
      icon: <DollarSign className="h-5 w-5 text-mutedPeach" />,
      trend: 'positive'
    },
    {
      title: 'אחוז תפוסה',
      value: '76%',
      change: '+12%',
      icon: <Calendar className="h-5 w-5 text-deepNavy/70" />,
      trend: 'positive'
    },
    {
      title: 'ציון משוב לקוחות',
      value: '4.8/5',
      change: '+0.3',
      icon: <Award className="h-5 w-5 text-oliveGreen" />,
      trend: 'positive'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold mb-1">תובנות עסקיות</h1>
          <p className="text-muted-foreground">ניתוח מגמות וביצועים של העסק</p>
        </div>
        
        <div className="flex gap-2">
          <Button size="sm" variant="soft" className="gap-2">
            <LineChart className="h-4 w-4" />
            התאמה אישית
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {keyMetrics.map((metric, i) => (
          <Card key={i} className="elegant-card">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              {metric.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center">
                <span className={cn(
                  "inline-block mr-1",
                  metric.trend === 'positive' ? "text-oliveGreen" : "text-rose-500"
                )}>
                  {metric.change}
                </span> 
                מהחודש הקודם
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Growth Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="elegant-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 ml-2 text-deepNavy/70" />
              צמיחת הכנסות
            </CardTitle>
            <CardDescription>מגמות הכנסות ב-6 החודשים האחרונים</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={growthData} margin={{ top: 10, right: 10, bottom: 30, left: isMobile ? 10 : 30 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `₪${value / 1000}K`} />
                  <Tooltip 
                    formatter={(value) => [`₪${value}`, 'הכנסה']}
                    labelFormatter={(label) => `חודש: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#7D8E6E" 
                    strokeWidth={2}
                    dot={{ fill: '#7D8E6E', r: 4 }}
                    activeDot={{ r: 6, fill: '#7D8E6E', stroke: 'white', strokeWidth: 2 }}
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="elegant-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 ml-2 text-roseGold" />
              צמיחת לקוחות ופגישות
            </CardTitle>
            <CardDescription>מגמות לקוחות ופגישות לפי חודש</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={growthData}
                  margin={{ top: 10, right: 10, bottom: 30, left: isMobile ? 10 : 30 }}
                  barGap={4}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="clients" name="לקוחות" fill="#D4B499" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="sessions" name="פגישות" fill="#E6CCB9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Services & Retention */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="elegant-card">
          <CardHeader>
            <CardTitle>שירותים פופולריים</CardTitle>
            <CardDescription>התפלגות הזמנות שירותים לפי סוג</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {servicePopularity.map((service) => (
                <div key={service.name} className="flex flex-col">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{service.name}</span>
                    <span className="text-sm text-muted-foreground">{service.value}%</span>
                  </div>
                  <div className="w-full h-3 bg-muted/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-roseGold/80 rounded-full" 
                      style={{ width: `${service.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="elegant-card">
          <CardHeader>
            <CardTitle>שימור לקוחות</CardTitle>
            <CardDescription>אחוז שימור לקוחות לאורך זמן</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={retentionData} margin={{ top: 10, right: 10, bottom: 30, left: isMobile ? 10 : 30 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[60, 85]} tickFormatter={(value) => `${value}%`} />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'שיעור שימור']}
                    labelFormatter={(label) => `חודש: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="rate" 
                    stroke="#D4B499" 
                    strokeWidth={2}
                    dot={{ fill: '#D4B499', r: 4 }}
                    activeDot={{ r: 6, fill: '#D4B499', stroke: 'white', strokeWidth: 2 }}
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Insights */}
      <Card className="elegant-card border-r-4 border-r-oliveGreen">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <TrendingUp className="h-5 w-5 ml-2 text-oliveGreen" />
            תובנות מפתח
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="space-y-2">
              <h3 className="font-medium">שימור לקוחות</h3>
              <p className="text-sm text-muted-foreground">
                העלייה של 5% בשימור הלקוחות נובעת מתוכנית המועדון החדשה שהושקה לפני 3 חודשים.
              </p>
              <Button variant="link" size="sm" className="px-0 text-primary">
                פרטים נוספים
                <ArrowRight className="h-4 w-4 mr-1" />
              </Button>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">שירותים פופולריים</h3>
              <p className="text-sm text-muted-foreground">
                מניקור ג'ל נשאר השירות הפופולרי ביותר, עם גידול של 8% בהזמנות בחודש האחרון.
              </p>
              <Button variant="link" size="sm" className="px-0 text-primary">
                פרטים נוספים
                <ArrowRight className="h-4 w-4 mr-1" />
              </Button>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">הזדמנויות צמיחה</h3>
              <p className="text-sm text-muted-foreground">
                הרחבת היצע השירותים לפדיקור מקצועי עשויה להגדיל את ההכנסה הממוצעת ללקוח ב-15%.
              </p>
              <Button variant="link" size="sm" className="px-0 text-primary">
                פרטים נוספים
                <ArrowRight className="h-4 w-4 mr-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessInsights;
