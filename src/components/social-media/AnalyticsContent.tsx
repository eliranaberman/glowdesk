import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, PieChart } from "lucide-react";
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart as RechartsLineChart, Line, PieChart as RechartsPieChart, Pie, Cell } from "recharts";

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

  const colors = {
    primary: "#606c38",
    secondary: "#e07a5f",
    tertiary: "#ddbea9",
    income: "#606c38",
    expenses: "#e07a5f",
    profit: "#ddbea9"
  };

  const platformData = [
    { name: "Instagram", followers: 1250, engagement: 7.5, posts: 45, color: colors.income },
    { name: "Facebook", followers: 950, engagement: 5.2, posts: 35, color: colors.expenses },
    { name: "TikTok", followers: 720, engagement: 8.3, posts: 28, color: colors.profit },
    { name: "Twitter", followers: 520, engagement: 4.1, posts: 25, color: "#90BE6D" }
  ];

  const followerGrowthData = analyticsData?.followers || [
    { name: "ינואר", count: 320 },
    { name: "פברואר", count: 350 },
    { name: "מרץ", count: 410 },
    { name: "אפריל", count: 490 },
    { name: "מאי", count: 550 },
    { name: "יוני", count: 590 },
  ];

  const engagementRateData = analyticsData?.engagement || [
    { name: "ינואר", rate: 5.2 },
    { name: "פברואר", rate: 5.8 },
    { name: "מרץ", rate: 6.5 },
    { name: "אפריל", rate: 7.2 },
    { name: "מאי", rate: 8.0 },
    { name: "יוני", rate: 8.5 },
  ];

  const postFrequencyData = analyticsData?.posts || [
    { name: "ינואר", count: 10 },
    { name: "פברואר", count: 12 },
    { name: "מרץ", count: 14 },
    { name: "אפריל", count: 15 },
    { name: "מאי", count: 18 },
    { name: "יוני", count: 16 },
  ];

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

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius * 1.6;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill={platformData[index].color}
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-xs font-semibold"
        style={{ textShadow: '0px 0px 2px rgba(255,255,255,0.7)' }}
      >
        {name}
      </text>
    );
  };

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
                  <Tooltip labelFormatter={(label) => `חודש: ${label}`} formatter={(value) => [`${value} עוקבים`, ``]} />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    name="מספר עוקבים"
                    stroke={colors.income}
                    activeDot={{ r: 8 }} 
                    strokeWidth={2}
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

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
                  <Tooltip labelFormatter={(label) => `חודש: ${label}`} formatter={(value) => [`${value}%`, ``]} />
                  <Bar 
                    dataKey="rate" 
                    name="אחוז מעורבות"
                    fill={colors.expenses}
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
                  <Tooltip labelFormatter={(label) => `חודש: ${label}`} formatter={(value) => [`${value} פוסטים`, ``]} />
                  <Bar 
                    dataKey="count" 
                    name="מספר פוסטים"
                    fill={colors.profit}
                    radius={[4, 4, 0, 0]}
                    fillOpacity={0.7}
                  />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>התפלגות לפי פלטפורמה</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={platformData}
                    dataKey="followers"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    fill="#8884d8"
                    labelLine={true}
                    label={renderCustomizedLabel}
                  >
                    {platformData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} עוקבים`, '']} />
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

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
                  <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center ml-3">
                    <span className="text-sm font-medium">{content.platform.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium">{content.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {content.platform} • {content.date}
                    </p>
                  </div>
                </div>
                <div className="text-left">
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
