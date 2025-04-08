
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, PieChart } from "lucide-react";
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart as RechartsLineChart, Line, PieChart as RechartsPieChart, Pie, Cell } from "recharts";

// Data type for analytics
interface AnalyticsData {
  followers: { name: string; count: number }[];
  engagement: { name: string; rate: number }[];
  posts: { name: string; count: number }[];
  colors: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
}

interface AnalyticsContentProps {
  analyticsData?: AnalyticsData;
}

const AnalyticsContent = ({ analyticsData }: AnalyticsContentProps) => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");

  // Use default colors if not provided
  const colors = analyticsData?.colors || {
    primary: "#606c38", // oliveGreen
    secondary: "#e07a5f", // softRose
    tertiary: "#ddbea9", // roseGold
  };

  // Mock platform data
  const platformData = [
    { name: "Instagram", followers: 1250, engagement: 7.5, posts: 45, color: colors.primary },
    { name: "Facebook", followers: 950, engagement: 5.2, posts: 35, color: colors.secondary },
    { name: "TikTok", followers: 720, engagement: 8.3, posts: 28, color: colors.tertiary },
    { name: "Twitter", followers: 520, engagement: 4.1, posts: 25, color: "#90BE6D" }
  ];

  // Mock follower growth data
  const followerGrowthData = analyticsData?.followers || [
    { name: "ינואר", count: 320 },
    { name: "פברואר", count: 350 },
    { name: "מרץ", count: 410 },
    { name: "אפריל", count: 490 },
    { name: "מאי", count: 550 },
    { name: "יוני", count: 590 },
  ];

  // Mock engagement rate data
  const engagementRateData = analyticsData?.engagement || [
    { name: "ינואר", rate: 5.2 },
    { name: "פברואר", rate: 5.8 },
    { name: "מרץ", rate: 6.5 },
    { name: "אפריל", rate: 7.2 },
    { name: "מאי", rate: 8.0 },
    { name: "יוני", rate: 8.5 },
  ];

  // Mock post frequency data
  const postFrequencyData = analyticsData?.posts || [
    { name: "ינואר", count: 10 },
    { name: "פברואר", count: 12 },
    { name: "מרץ", count: 14 },
    { name: "אפריל", count: 15 },
    { name: "מאי", count: 18 },
    { name: "יוני", count: 16 },
  ];

  // Top performing content
  const topContent = [
    {
      id: 1,
      title: "טיפים לשמירה על לק ג'ל",
      platform: "Instagram",
      engagement: 245,
      date: "15/6/2025",
    },
    {
      id: 2,
      title: "עיצובי קיץ חדשים",
      platform: "Facebook",
      engagement: 198,
      date: "02/6/2025",
    },
    {
      id: 3,
      title: "מבצע מיוחד לחג",
      platform: "Instagram",
      engagement: 172,
      date: "10/5/2025",
    },
  ];

  return (
    <div className="space-y-6" dir="rtl">
      <div className="grid gap-4 md:grid-cols-4">
        {platformData.map((platform) => (
          <Card key={platform.name} className={`${selectedPlatform === platform.name.toLowerCase() ? 'ring-2 ring-primary' : ''}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{platform.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">עוקבים:</span>
                  <span className="font-medium">{platform.followers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">אחוז מעורבות:</span>
                  <span className="font-medium">{platform.engagement}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">פוסטים:</span>
                  <span className="font-medium">{platform.posts}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Follower Growth */}
        <Card>
          <CardHeader>
            <CardTitle>גידול במספר העוקבים</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={followerGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip labelFormatter={(label) => `חודש: ${label}`} />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    name="מספר עוקבים"
                    stroke={colors.primary} 
                    activeDot={{ r: 8 }} 
                    strokeWidth={2}
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Engagement Rate */}
        <Card>
          <CardHeader>
            <CardTitle>אחוזי מעורבות</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={engagementRateData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip labelFormatter={(label) => `חודש: ${label}`} />
                  <Bar 
                    dataKey="rate" 
                    name="אחוז מעורבות"
                    fill={colors.secondary} 
                    radius={[4, 4, 0, 0]}
                    fillOpacity={0.7}
                  />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Post Frequency */}
        <Card>
          <CardHeader>
            <CardTitle>תדירות פרסום</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={postFrequencyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip labelFormatter={(label) => `חודש: ${label}`} />
                  <Bar 
                    dataKey="count" 
                    name="מספר פוסטים"
                    fill={colors.tertiary} 
                    radius={[4, 4, 0, 0]}
                    fillOpacity={0.7}
                  />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Platform Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>התפלגות לפי פלטפורמה</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="h-[300px] w-full max-w-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={platformData}
                    dataKey="followers"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label={(entry) => entry.name}
                  >
                    {platformData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} עוקבים`, '']} />
                  <Legend layout="vertical" verticalAlign="middle" align="right" />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Content */}
      <Card>
        <CardHeader>
          <CardTitle>תוכן מצליח במיוחד</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topContent.map((content) => (
              <div
                key={content.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-medium">{content.platform.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium">{content.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {content.platform} • {content.date}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary">{content.engagement}</p>
                  <p className="text-xs text-muted-foreground">אינטראקציות</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsContent;
