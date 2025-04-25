
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';
import { MarketingStats } from '@/types/marketing';

interface MarketingAnalyticsProps {
  stats: MarketingStats | null;
}

export const MarketingAnalytics = ({ stats }: MarketingAnalyticsProps) => {
  if (!stats) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">סה״כ תבניות</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_templates}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">סה״כ קמפיינים</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_campaigns}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">הודעות שנשלחו</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_messages}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">קופונים פעילים</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active_coupons}</div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="pt-6">
        <CardHeader>
          <CardTitle>פעילות לפי חודש</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="campaigns">
            <TabsList className="w-full max-w-md grid grid-cols-3 mb-4">
              <TabsTrigger value="campaigns">קמפיינים</TabsTrigger>
              <TabsTrigger value="messages">הודעות</TabsTrigger>
              <TabsTrigger value="coupons">קופונים</TabsTrigger>
            </TabsList>
            
            <TabsContent value="campaigns">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stats.monthly_stats}
                    margin={{ top: 10, right: 10, left: 10, bottom: 30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" angle={-45} textAnchor="end" height={70} />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => [`${value} קמפיינים`, 'קמפיינים']}
                      labelFormatter={(label) => `חודש: ${label}`}
                    />
                    <Bar 
                      dataKey="campaigns" 
                      name="קמפיינים" 
                      fill="#606c38" 
                      radius={[4, 4, 0, 0]} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="messages">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={stats.monthly_stats}
                    margin={{ top: 10, right: 10, left: 10, bottom: 30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" angle={-45} textAnchor="end" height={70} />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => [`${value} הודעות`, 'הודעות']}
                      labelFormatter={(label) => `חודש: ${label}`}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="messages" 
                      name="הודעות שנשלחו" 
                      stroke="#e07a5f" 
                      strokeWidth={2}
                      activeDot={{ r: 8 }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="opens" 
                      name="הודעות שנפתחו" 
                      stroke="#ddbea9" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="coupons">
              <div className="flex justify-center items-center h-[200px]">
                <p className="text-muted-foreground">נתונים על קופונים יופיעו כאן</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
