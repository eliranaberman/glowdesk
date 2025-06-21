
import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Loader2, 
  LayoutDashboard, 
  MessageSquare, 
  Send, 
  BarChart3, 
  BrainCircuit, 
  ArrowRight,
  Settings
} from "lucide-react";
import DashboardContent from "@/components/social-media/DashboardContent";
import InboxContent from "@/components/social-media/InboxContent";
import PostCreationPanel from "@/components/social-media/PostCreationPanel";
import AnalyticsContent from "@/components/social-media/AnalyticsContent";
import AIMarketingTools from "@/components/social-media/AIMarketingTools";
import MetaConnectionPanel from "@/components/social-media/MetaConnectionPanel";
import UnifiedInbox from "@/components/social-media/UnifiedInbox";
import { ConnectedAccountsMap, SocialMediaMessage } from "@/components/social-media/types";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { getMarketingStats } from "@/services/marketing/messageService";
import { fetchUserMessages, getUnreadMessagesCount, markMessageAsRead, replyToMessage } from "@/services/socialMediaMessagesService";
import { getUnreadCount } from "@/services/metaIntegrationService";
import { MarketingStats } from "@/types/marketing";
import { useIsMobile } from "@/hooks/use-mobile";

const SocialMedia = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccountsMap>({
    instagram: false,
    facebook: false,
    tiktok: false,
  });
  const [messages, setMessages] = useState<SocialMediaMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [marketingStats, setMarketingStats] = useState<MarketingStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();

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
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Load real unread count from Meta integration
        const realUnreadCount = await getUnreadCount();
        setUnreadCount(realUnreadCount);
        
        // Load marketing stats if needed
        if (activeTab === "dashboard" || activeTab === "analytics") {
          const statsData = await getMarketingStats();
          setMarketingStats(statsData);
        }
        
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "שגיאה בטעינת נתונים",
          description: "אירעה שגיאה בטעינת הנתונים, אנא נסה שנית"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
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

  const handleMarkAsRead = async (messageId: string) => {
    const success = await markMessageAsRead(messageId);
    if (success) {
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, is_read: true } : msg
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const handleReply = async (messageId: string, reply: string) => {
    const success = await replyToMessage(messageId, reply);
    if (success) {
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, reply_text: reply, replied_at: new Date().toISOString(), is_read: true } 
          : msg
      ));
      toast({
        title: "תגובה נשלחה בהצלחה",
        description: "התגובה שלך נשלחה ללקוח"
      });
    }
  };

  const handleButtonAction = () => {
    switch (activeTab) {
      case "dashboard":
        setActiveTab("connections");
        break;
      case "inbox":
        toast({
          title: "סימון הודעות כנקראו",
          description: "כל ההודעות סומנו כנקראו בהצלחה"
        });
        break;
      case "posts":
        toast({
          title: "יצירת פוסט",
          description: "תכונה זו תהיה זמינה בקרוב"
        });
        break;
      case "analytics":
        navigate("/marketing");
        break;
      case "ai-tools":
        toast({
          title: "כלי AI",
          description: "כלי השיווק AI יהיו זמינים בקרוב"
        });
        break;
      case "connections":
        toast({
          title: "הגדרות חיבור",
          description: "נהל את חיבורי המדיה החברתית שלך"
        });
        break;
    }
  };

  const getButtonText = () => {
    switch (activeTab) {
      case "dashboard": return "נהל חיבורים";
      case "inbox": return "סמן הכל כנקרא";
      case "posts": return "פוסט חדש";
      case "analytics": return "דשבורד שיווק";
      case "ai-tools": return "צור תוכן עם AI";
      case "connections": return "רענן חיבורים";
      default: return "פעולה";
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-6" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-xl sm:text-2xl font-semibold text-center sm:text-right tracking-tight">מדיה חברתית ושיווק</h1>
        
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 order-first sm:order-none">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center justify-center gap-2 h-10 sm:h-8 text-sm"
            onClick={() => navigate('/marketing')}
          >
            <ArrowRight size={16} />
            לדשבורד קמפיינים
          </Button>
          
          <Button 
            variant="secondary" 
            size="sm" 
            className="flex items-center justify-center gap-2 h-10 sm:h-8 text-sm"
            onClick={handleButtonAction}
          >
            <Plus size={16} />
            {getButtonText()}
          </Button>
        </div>
      </div>

      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={`grid gap-1 w-full mb-4 ${isMobile ? 'grid-cols-3 h-auto' : 'grid-cols-6 h-10'}`}>
          <TabsTrigger 
            value="dashboard" 
            className={`text-xs sm:text-sm py-2 sm:py-2.5 font-medium flex gap-1 sm:gap-2 justify-center ${isMobile ? 'min-h-[44px] flex-col' : ''}`}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span className={isMobile ? 'text-xs' : ''}>דשבורד</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="connections" 
            className={`text-xs sm:text-sm py-2 sm:py-2.5 font-medium flex gap-1 sm:gap-2 justify-center ${isMobile ? 'min-h-[44px] flex-col' : ''}`}
          >
            <Settings className="h-4 w-4" />
            <span className={isMobile ? 'text-xs' : ''}>חיבורים</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="inbox" 
            className={`text-xs sm:text-sm py-2 sm:py-2.5 font-medium flex gap-1 sm:gap-2 justify-center relative ${isMobile ? 'min-h-[44px] flex-col' : ''}`}
          >
            <MessageSquare className="h-4 w-4" />
            <span className={isMobile ? 'text-xs' : ''}>הודעות</span>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </TabsTrigger>
          
          {!isMobile && (
            <>
              <TabsTrigger value="posts" className="text-sm py-2.5 font-medium flex gap-2 justify-center">
                <Send className="h-4 w-4" />
                <span>פרסום</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="text-sm py-2.5 font-medium flex gap-2 justify-center">
                <BarChart3 className="h-4 w-4" />
                <span>אנליטיקס</span>
              </TabsTrigger>
              <TabsTrigger value="ai-tools" className="text-sm py-2.5 font-medium flex gap-2 justify-center">
                <BrainCircuit className="h-4 w-4" />
                <span>כלי AI</span>
              </TabsTrigger>
            </>
          )}
        </TabsList>

        {/* Mobile secondary tabs */}
        {isMobile && (
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            <Button
              variant={activeTab === "posts" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("posts")}
              className="flex items-center gap-2 whitespace-nowrap min-h-[40px]"
            >
              <Send className="h-4 w-4" />
              פרסום
            </Button>
            <Button
              variant={activeTab === "analytics" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("analytics")}
              className="flex items-center gap-2 whitespace-nowrap min-h-[40px]"
            >
              <BarChart3 className="h-4 w-4" />
              אנליטיקס
            </Button>
            <Button
              variant={activeTab === "ai-tools" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("ai-tools")}
              className="flex items-center gap-2 whitespace-nowrap min-h-[40px]"
            >
              <BrainCircuit className="h-4 w-4" />
              כלי AI
            </Button>
          </div>
        )}

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

        <TabsContent value="connections">
          <MetaConnectionPanel />
        </TabsContent>

        <TabsContent value="inbox">
          <UnifiedInbox />
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
    </div>
  );
};

export default SocialMedia;
