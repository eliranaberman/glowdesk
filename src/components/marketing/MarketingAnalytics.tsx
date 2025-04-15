
import { Card, CardContent } from '@/components/ui/card';
import { MarketingStats } from '@/types/marketing';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useState } from 'react';

interface MarketingAnalyticsProps {
  stats: MarketingStats | null;
}

export const MarketingAnalytics = ({ stats }: MarketingAnalyticsProps) => {
  const [chartTab, setChartTab] = useState('campaigns');

  if (!stats) {
    return null;
  }

  const campaignsData = stats.monthly_stats.map(month => ({
    name: month.month,
    campaigns: month.campaigns
  }));

  const messagesData = stats.monthly_stats.map(month => ({
    name: month.month,
    messages: month.messages,
    opens: month.opens,
    clicks: month.clicks
  }));

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">נתוני שיווק חודשיים</h3>
          
          <Tabs value={chartTab} onValueChange={setChartTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="campaigns">קמפיינים</TabsTrigger>
              <TabsTrigger value="messages">הודעות ומדדים</TabsTrigger>
            </TabsList>
            
            <TabsContent value="campaigns">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={campaignsData} margin={{ top: 20, right: 30, left: 0, bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}`, 'מספר קמפיינים']} />
                    <Bar dataKey="campaigns" fill="#606c38" name="קמפיינים" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="messages">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={messagesData} margin={{ top: 20, right: 30, left: 0, bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => {
                      const labels = {
                        messages: 'הודעות',
                        opens: 'נפתחו',
                        clicks: 'לחיצות'
                      };
                      return [`${value}`, labels[name as keyof typeof labels]];
                    }} />
                    <Legend />
                    <Line type="monotone" dataKey="messages" stroke="#606c38" name="הודעות" />
                    <Line type="monotone" dataKey="opens" stroke="#e07a5f" name="נפתחו" />
                    <Line type="monotone" dataKey="clicks" stroke="#ddbea9" name="לחיצות" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">שיעור פתיחה והקלקות</h3>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={messagesData} 
                  margin={{ top: 20, right: 30, left: 0, bottom: 30 }}
                  barGap={2}
                  barSize={20}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}`, 'מספר פעולות']} />
                  <Legend />
                  <Bar dataKey="opens" fill="#e07a5f" name="פתיחות" />
                  <Bar dataKey="clicks" fill="#ddbea9" name="לחיצות" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">שימוש בקופונים</h3>
            <div className="flex flex-col justify-between h-60">
              <div className="flex justify-between items-center h-1/2">
                <div className="text-center p-4">
                  <p className="text-sm text-muted-foreground">קופונים פעילים</p>
                  <p className="text-3xl font-bold">{stats.active_coupons}</p>
                </div>
                <div className="text-center p-4">
                  <p className="text-sm text-muted-foreground">קופונים שנוצלו</p>
                  <p className="text-3xl font-bold">{stats.redeemed_coupons}</p>
                </div>
              </div>
              <div className="text-center p-4 mt-4">
                <p className="text-sm text-muted-foreground">אחוז ניצול</p>
                <p className="text-4xl font-bold">
                  {stats.redeemed_coupons > 0 && stats.active_coupons > 0 
                    ? Math.round((stats.redeemed_coupons / (stats.redeemed_coupons + stats.active_coupons)) * 100)
                    : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
