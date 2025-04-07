
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Download, Calendar as CalendarIcon, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnalyticsData, PostData } from "./types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

// Mock data
const mockAnalyticsData: AnalyticsData = {
  totalReach: 15280,
  engagementRate: 4.7,
  followerGrowth: 250,
  totalPosts: 28,
  platformData: {
    instagram: {
      impressions: 8750,
      likes: 1200,
      shares: 125,
      comments: 180,
      clickThroughRate: 5.6
    },
    facebook: {
      impressions: 4980,
      likes: 780,
      shares: 87,
      comments: 110,
      clickThroughRate: 3.9
    },
    tiktok: {
      impressions: 1250,
      likes: 200,
      shares: 45,
      comments: 32,
      clickThroughRate: 2.8
    },
    twitter: {
      impressions: 300,
      likes: 52,
      shares: 23,
      comments: 15,
      clickThroughRate: 1.2
    }
  }
};

const mockPostsData: PostData[] = [
  {
    id: 1,
    platform: "instagram",
    date: "05/04/2023",
    caption: "מבצע מיוחד לקיץ - 20% הנחה...",
    impressions: 1200,
    engagement: 8.7,
    linkClicks: 45,
    status: "published",
    image: "https://picsum.photos/seed/1/100"
  },
  {
    id: 2,
    platform: "facebook",
    date: "01/04/2023",
    caption: "טיפים לטיפול בציפורניים בקיץ...",
    impressions: 980,
    engagement: 6.2,
    linkClicks: 32,
    status: "published",
    image: "https://picsum.photos/seed/2/100"
  },
  {
    id: 3,
    platform: "instagram",
    date: "28/03/2023",
    caption: "מראה חדש לאביב...",
    impressions: 1550,
    engagement: 9.4,
    linkClicks: 58,
    status: "published",
    image: "https://picsum.photos/seed/3/100"
  },
  {
    id: 4,
    platform: "tiktok",
    date: "25/03/2023",
    caption: "טוטוריאל: איך ליצור עיצוב...",
    impressions: 870,
    engagement: 7.8,
    linkClicks: 12,
    status: "published",
    image: "https://picsum.photos/seed/4/100"
  },
  {
    id: 5,
    platform: "facebook",
    date: "15/04/2023",
    caption: "נפתחו תורים לחודש מאי...",
    impressions: 0,
    engagement: 0,
    linkClicks: 0,
    status: "scheduled",
    image: "https://picsum.photos/seed/5/100"
  }
];

const impressionsData = [
  { name: "ינואר", instagram: 4000, facebook: 2400, tiktok: 1800, twitter: 1000 },
  { name: "פברואר", instagram: 3000, facebook: 1398, tiktok: 2800, twitter: 800 },
  { name: "מרץ", instagram: 5000, facebook: 3800, tiktok: 1500, twitter: 1200 },
  { name: "אפריל", instagram: 2780, facebook: 3908, tiktok: 2500, twitter: 1100 },
  { name: "מאי", instagram: 1890, facebook: 4800, tiktok: 2800, twitter: 900 },
  { name: "יוני", instagram: 2390, facebook: 3800, tiktok: 3100, twitter: 1400 }
];

const engagementData = [
  { name: "ינואר", instagram: 2.8, facebook: 1.5, tiktok: 4.2, twitter: 0.8 },
  { name: "פברואר", instagram: 3.2, facebook: 1.9, tiktok: 5.1, twitter: 1.2 },
  { name: "מרץ", instagram: 4.5, facebook: 2.4, tiktok: 6.8, twitter: 1.1 },
  { name: "אפריל", instagram: 2.9, facebook: 3.1, tiktok: 5.3, twitter: 0.9 },
  { name: "מאי", instagram: 3.6, facebook: 2.7, tiktok: 4.9, twitter: 1.3 },
  { name: "יוני", instagram: 4.2, facebook: 3.0, tiktok: 6.2, twitter: 1.2 }
];

const AnalyticsContent = () => {
  const [activePlatformTab, setActivePlatformTab] = useState("all");
  const [metricView, setMetricView] = useState("impressions");
  const { toast } = useToast();

  const handleDownloadReport = () => {
    toast({
      title: "דוח מוכן להורדה",
      description: "הדוח הורד בהצלחה",
    });
  };

  const filteredPosts = activePlatformTab === "all" 
    ? mockPostsData 
    : mockPostsData.filter(post => post.platform === activePlatformTab);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button onClick={handleDownloadReport} variant="outline" className="gap-2">
          <Download size={16} />
          הורד דוח
        </Button>
        <h2 className="text-xl font-medium">אנליטיקס מדיה חברתית</h2>
        <div className="w-32" /> {/* Spacer for symmetry */}
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex flex-col items-center text-center">
            <h3 className="text-lg font-medium">סה״כ חשיפות</h3>
            <p className="text-3xl font-bold mt-2">{mockAnalyticsData.totalReach.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">ב-30 הימים האחרונים</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex flex-col items-center text-center">
            <h3 className="text-lg font-medium">אחוז מעורבות</h3>
            <p className="text-3xl font-bold mt-2">{mockAnalyticsData.engagementRate}%</p>
            <p className="text-xs text-muted-foreground mt-1">ממוצע לפוסט</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex flex-col items-center text-center">
            <h3 className="text-lg font-medium">צמיחת עוקבים</h3>
            <p className="text-3xl font-bold mt-2">+{mockAnalyticsData.followerGrowth}</p>
            <p className="text-xs text-muted-foreground mt-1">בחודש האחרון</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex flex-col items-center text-center">
            <h3 className="text-lg font-medium">סה״כ פוסטים</h3>
            <p className="text-3xl font-bold mt-2">{mockAnalyticsData.totalPosts}</p>
            <p className="text-xs text-muted-foreground mt-1">פורסמו או תוזמנו</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Platform Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">ביצועים לפי פלטפורמה</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={activePlatformTab} value={activePlatformTab} onValueChange={setActivePlatformTab} className="w-full">
            <TabsList className="grid grid-cols-5 mb-4">
              <TabsTrigger value="all">הכל</TabsTrigger>
              <TabsTrigger value="instagram">אינסטגרם</TabsTrigger>
              <TabsTrigger value="facebook">פייסבוק</TabsTrigger>
              <TabsTrigger value="tiktok">טיקטוק</TabsTrigger>
              <TabsTrigger value="twitter">טוויטר</TabsTrigger>
            </TabsList>
            
            <div className="mb-6">
              <Tabs defaultValue={metricView} value={metricView} onValueChange={setMetricView} className="w-full">
                <TabsList className="w-full grid grid-cols-2 mb-4">
                  <TabsTrigger value="impressions">חשיפות</TabsTrigger>
                  <TabsTrigger value="engagement">מעורבות</TabsTrigger>
                </TabsList>
                
                <TabsContent value="impressions">
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={impressionsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="instagram" name="אינסטגרם" fill="#E1306C" />
                        <Bar dataKey="facebook" name="פייסבוק" fill="#4267B2" />
                        <Bar dataKey="tiktok" name="טיקטוק" fill="#25F4EE" />
                        <Bar dataKey="twitter" name="טוויטר" fill="#1DA1F2" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
                
                <TabsContent value="engagement">
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={engagementData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="instagram" name="אינסטגרם" stroke="#E1306C" />
                        <Line type="monotone" dataKey="facebook" name="פייסבוק" stroke="#4267B2" />
                        <Line type="monotone" dataKey="tiktok" name="טיקטוק" stroke="#25F4EE" />
                        <Line type="monotone" dataKey="twitter" name="טוויטר" stroke="#1DA1F2" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Post Performance Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>ביצועי פוסטים</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1">
              <CalendarIcon size={16} />
              לפי תאריך
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <FileText size={16} />
              ייצא
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>פוסט</TableHead>
                <TableHead>פלטפורמה</TableHead>
                <TableHead>תאריך</TableHead>
                <TableHead>חשיפות</TableHead>
                <TableHead>מעורבות</TableHead>
                <TableHead>קליקים</TableHead>
                <TableHead>סטטוס</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="flex items-center gap-3">
                    {post.image && (
                      <div className="w-10 h-10 rounded overflow-hidden">
                        <img src={post.image} alt="Post" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <span className="line-clamp-1">{post.caption}</span>
                  </TableCell>
                  <TableCell>{post.platform}</TableCell>
                  <TableCell>{post.date}</TableCell>
                  <TableCell>{post.impressions.toLocaleString()}</TableCell>
                  <TableCell>{post.engagement}%</TableCell>
                  <TableCell>{post.linkClicks}</TableCell>
                  <TableCell>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {post.status === 'published' ? 'פורסם' : 'מתוזמן'}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredPosts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">לא נמצאו פוסטים להצגה</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsContent;
