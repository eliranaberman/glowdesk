import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import DashboardContent from "@/components/social-media/DashboardContent";
import InboxContent from "@/components/social-media/InboxContent";
import PostCreationPanel from "@/components/social-media/PostCreationPanel";
import AnalyticsContent from "@/components/social-media/AnalyticsContent";
import ConnectionModal from "@/components/social-media/ConnectionModal";
import AIMarketingTools from "@/components/social-media/AIMarketingTools";
import { ConnectedAccountsMap, Message } from "@/components/social-media/types";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { getMarketingStats } from "@/services/marketingService";
import { MarketingStats } from "@/types/marketing";

const SocialMedia = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isConnectionModalOpen, setIsConnectionModalOpen] = useState(false);
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccountsMap>({
    instagram: false,
    facebook: false,
    twitter: false,
    tiktok: false,
  });
  const [marketingStats, setMarketingStats] = useState<MarketingStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const messages: Message[] = [
    {
      id: 1,
      platform: "instagram",
      sender: "sarah_nails_fan",
      message: "היי, האם יש לך פנוי לפגישה ביום שלישי?",
      time: "10:23",
      read: false,
      avatar: "https://picsum.photos/seed/1/64",
    },
    {
      id: 2,
      platform: "facebook",
      sender: "מיכל כהן",
      message: "מחיר לבנייה מלאה + לק ג'ל?",
      time: "08:45",
      read: true,
      avatar: "https://picsum.photos/seed/2/64",
    },
    {
      id: 3,
      platform: "instagram",
      sender: "beauty_trends",
      message: "אהבתי את העיצוב האחרון שפרסמת! אפשר לקבוע תור?",
      time: "יום אתמול",
      read: true,
      avatar: "https://picsum.photos/seed/3/64",
    },
  ];

  const analyticsData = {
    followers: [
      { name: "ינואר", count: 320 },
      { name: "פברואר", count: 350 },
      { name: "מרץ", count: 410 },
      { name: "אפריל", count: 490 },
      { name: "מאי", count: 550 },
      { name: "יוני", count: 590 },
    ],
    engagement: [
      { name: "ינואר", rate: 5.2 },
      { name: "פברואר", rate: 5.8 },
      { name: "מרץ", rate: 6.5 },
      { name: "אפריל", rate: 7.2 },
      { name: "מאי", rate: 8.0 },
      { name: "יוני", rate: 8.5 },
    ],
    posts: [
      { name: "ינואר", count: 10 },
      { name: "פברואר", count: 12 },
      { name: "מרץ", count: 14 },
      { name: "אפריל", count: 15 },
      { name: "מאי", count: 18 },
      { name: "יוני", count: 16 },
    ],
    colors: {
      primary: "#606c38",
      secondary: "#e07a5f",
      tertiary: "#ddbea9",
    }
  };

  useEffect(() => {
    const loadMarketingStats = async () => {
      if (activeTab === "dashboard" || activeTab === "analytics") {
        try {
          setIsLoading(true);
          const stats = await getMarketingStats();
          setMarketingStats(stats);
        } catch (error) {
          console.error("Error loading marketing stats:", error);
          toast({
            title: "שגיאה בטעינת נתוני שיווק",
            description: "��ירעה שגיאה בטעינת הנתונים, אנא נסה שנית"
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadMarketingStats();
  }, [activeTab, toast]);

  const connectPlatform = (platform: string) => {
    setConnectedAccounts(prev => ({
      ...prev,
      [platform]: !prev[platform]
    }));
  };

  const handleOpenInbox = () => {
    setActiveTab("inbox");
  };

  const handleButtonAction = () => {
    switch (activeTab) {
      case "dashboard":
        setIsConnectionModalOpen(true);
        break;
      case "inbox":
        toast({
          title: "סימון הודעות כנקראו",
          description: "כל ההודעות סומנו כנקראו בהצלחה"
        });
        break;
      case "posts":
        navigate("/social-media/create-post");
        break;
      case "analytics":
        navigate("/marketing");
        break;
      case "ai-tools":
        navigate("/social-media/ai-generate");
        break;
    }
  };

  const getButtonText = () => {
    switch (activeTab) {
      case "dashboard": return "חבר חשבון";
      case "inbox": return "סמן הכל כנקרא";
      case "posts": return "פוסט חדש";
      case "analytics": return "דשבורד שיווק";
      case "ai-tools": return "צור תוכן עם AI";
      default: return "פעולה";
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <Button 
          variant="secondary" 
          size="sm" 
          className="flex items-center gap-1"
          onClick={handleButtonAction}
        >
          <Plus size={16} />
          {getButtonText()}
        </Button>
        <h1 className="text-2xl font-semibold text-center mx-auto tracking-tight">מדיה חברתית ושיווק</h1>
        <div className="w-[85px]" />
      </div>

      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="space-y-2">
          <TabsList className="grid grid-cols-3 gap-2 w-full mb-2">
            <TabsTrigger value="posts" className="text-sm md:text-base py-2.5 font-medium">פרסום פוסטים</TabsTrigger>
            <TabsTrigger value="inbox" className="text-sm md:text-base py-2.5 font-medium">תיבת הודעות</TabsTrigger>
            <TabsTrigger value="dashboard" className="text-sm md:text-base py-2.5 font-medium">דשבורד</TabsTrigger>
          </TabsList>
          
          <TabsList className="grid grid-cols-2 gap-2 w-full mb-4">
            <TabsTrigger value="ai-tools" className="text-sm md:text-base py-2.5 font-medium">כלי שיווק AI</TabsTrigger>
            <TabsTrigger value="analytics" className="text-sm md:text-base py-2.5 font-medium">אנליטיקס</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="dashboard">
          <DashboardContent 
            connectedAccounts={connectedAccounts}
            connectPlatform={connectPlatform}
            handleOpenInbox={handleOpenInbox}
            messages={messages}
            marketingStats={marketingStats}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="inbox">
          <InboxContent />
        </TabsContent>

        <TabsContent value="posts">
          <PostCreationPanel />
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsContent 
            analyticsData={analyticsData} 
            marketingStats={marketingStats}
            isLoading={isLoading}
          />
        </TabsContent>
        
        <TabsContent value="ai-tools">
          <AIMarketingTools />
        </TabsContent>
      </Tabs>
      
      <ConnectionModal
        open={isConnectionModalOpen}
        onOpenChange={setIsConnectionModalOpen}
        connectedAccounts={connectedAccounts}
        onConnect={connectPlatform}
      />
    </div>
  );
};

export default SocialMedia;
