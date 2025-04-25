
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { MarketingStats } from "@/types/marketing";
import { Loader2 } from "lucide-react";

interface AnalyticsContentProps {
  analyticsData: {
    followers: { name: string; count: number }[];
    engagement: { name: string; rate: number }[];
    posts: { name: string; count: number }[];
    colors: {
      primary: string;
      secondary: string;
      tertiary: string;
    };
  };
  marketingStats: MarketingStats | null;
  isLoading: boolean;
}

const AnalyticsContent = ({ analyticsData, marketingStats, isLoading }: AnalyticsContentProps) => {
  // Get last month's stats safely
  const getLastMonthStats = () => {
    if (!marketingStats?.monthly_stats || marketingStats.monthly_stats.length === 0) {
      return null;
    }
    return marketingStats.monthly_stats[marketingStats.monthly_stats.length - 1];
  };
  
  // Get safe values for stats
  const lastMonthStats = getLastMonthStats();
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="social">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="marketing">נתוני שיווק</TabsTrigger>
          <TabsTrigger value="social">מדיה חברתית</TabsTrigger>
        </TabsList>
        
        <TabsContent value="social" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  סה"כ עוקבים
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.followers[analyticsData.followers.length - 1].count}</div>
                <p className="text-xs text-muted-foreground">
                  +{analyticsData.followers[analyticsData.followers.length - 1].count - analyticsData.followers[analyticsData.followers.length - 2].count} מהחודש הקודם
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  אחוז מעורבות
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analyticsData.engagement[analyticsData.engagement.length - 1].rate}%
                </div>
                <p className="text-xs text-muted-foreground">
                  +{(analyticsData.engagement[analyticsData.engagement.length - 1].rate - analyticsData.engagement[analyticsData.engagement.length - 2].rate).toFixed(1)}% מהחודש הקודם
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  פוסטים
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.posts[analyticsData.posts.length - 1].count}</div>
                <p className="text-xs text-muted-foreground">
                  {analyticsData.posts[analyticsData.posts.length - 1].count > analyticsData.posts[analyticsData.posts.length - 2].count ? "+" : ""}
                  {analyticsData.posts[analyticsData.posts.length - 1].count - analyticsData.posts[analyticsData.posts.length - 2].count} מהחודש הקודם
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  תגובות חודשיות
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">428</div>
                <p className="text-xs text-muted-foreground">
                  +24 מהחודש הקודם
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>עוקבים לאורך זמן</CardTitle>
                <CardDescription>
                  מגמת הגידול במספר העוקבים בחצי השנה האחרונה
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={analyticsData.followers}
                      margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} עוקבים`, 'סה"כ']} />
                      <Area type="monotone" dataKey="count" stroke={analyticsData.colors.primary} fill={analyticsData.colors.primary} fillOpacity={0.2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>אחוזי מעורבות</CardTitle>
                <CardDescription>
                  אחוז המעורבות של העוקבים בחצי השנה האחרונה
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={analyticsData.engagement}
                      margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value}%`, 'אחוז מעורבות']} />
                      <Line type="monotone" dataKey="rate" stroke={analyticsData.colors.secondary} strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>ניתוח פוסטים לפי חודש</CardTitle>
              <CardDescription>
                כמות הפוסטים שפורסמו בכל חודש
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={analyticsData.posts}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} פוסטים`, 'כמות']} />
                    <Bar dataKey="count" fill={analyticsData.colors.tertiary} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="marketing" className="space-y-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      סה"כ קמפיינים
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{marketingStats?.total_campaigns || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      {lastMonthStats?.campaigns || 0} בחודש האחרון
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      הודעות שנשלחו
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{marketingStats?.total_messages || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      {lastMonthStats?.messages || 0} בחודש האחרון
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      אחוז פתיחה
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {lastMonthStats && lastMonthStats.messages > 0
                        ? Math.round((lastMonthStats.opens / lastMonthStats.messages) * 100)
                        : 0}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                      בחודש האחרון
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      קופונים פעילים
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{marketingStats?.active_coupons || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      {marketingStats?.redeemed_coupons || 0} מומשו
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>קמפיינים לפי חודש</CardTitle>
                    <CardDescription>
                      מספר הקמפיינים שנוצרו בכל חודש
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={marketingStats?.monthly_stats || []}
                          margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`${value} קמפיינים`, 'מספר']} />
                          <Bar dataKey="campaigns" fill={analyticsData.colors.primary} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>אנליטיקת הודעות</CardTitle>
                    <CardDescription>
                      סטטיסטיקות הודעות בחצי השנה האחרונה
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={marketingStats?.monthly_stats || []}
                          margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="messages" stroke={analyticsData.colors.primary} name="הודעות" />
                          <Line type="monotone" dataKey="opens" stroke={analyticsData.colors.secondary} name="נפתחו" />
                          <Line type="monotone" dataKey="clicks" stroke={analyticsData.colors.tertiary} name="לחיצות" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsContent;
