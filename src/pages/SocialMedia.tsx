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
  Settings,
  Target
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
  
  const [messages, setMessages] = useState<SocialMediaMessage[]>([
    {
      id: "msg_1",
      user_id: "demo-user-1",
      platform: "facebook" as const,
      account_id: "fb_account_1",
      sender_id: "sender_1",
      sender_name: "שרה כהן",
      message_text: "שלום! אני מעוניינת לקבוע תור למניקור ג'ל. מתי יש לך פנוי השבוע?",
      message_type: "text",
      external_message_id: "fb_msg_1",
      thread_id: "fb_thread_1",
      is_read: false,
      received_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      replied_at: null,
      reply_text: null,
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "msg_2",
      user_id: "demo-user-1", 
      platform: "instagram" as const,
      account_id: "ig_account_1",
      sender_id: "sender_2",
      sender_name: "מיכל לוי",
      message_text: "ראיתי את התמונות שלך באינסטגרם, העבודה נראית מדהימה! כמה עולה טיפול מלא?",
      message_type: "text",
      external_message_id: "ig_msg_1",
      thread_id: "ig_thread_1",
      is_read: false,
      received_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
      replied_at: null,
      reply_text: null,
      created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "msg_3",
      user_id: "demo-user-1",
      platform: "facebook" as const,
      account_id: "fb_account_1",
      sender_id: "sender_3",
      sender_name: "דנה אברהם",
      message_text: "תודה על הטיפול הנפלא אתמול! הציפורניים נראות מושלמות. אשמח לקבוע את התור הבא.",
      message_type: "text",
      external_message_id: "fb_msg_2",
      thread_id: "fb_thread_2",
      is_read: true,
      received_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      replied_at: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
      reply_text: "תודה רבה דנה! אשמח לראות אותך שוב. מתי נוח לך לשבוע הבא?",
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "msg_4",
      user_id: "demo-user-1",
      platform: "instagram" as const,
      account_id: "ig_account_1",
      sender_id: "sender_4",
      sender_name: "יעל גולן",
      message_text: "איך אפשר לשמור על הג'ל יותר זמן? יש לך טיפים?",
      message_type: "text",
      external_message_id: "ig_msg_2",
      thread_id: "ig_thread_2",
      is_read: true,
      received_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      replied_at: null,
      reply_text: null,
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "msg_5",
      user_id: "demo-user-1",
      platform: "tiktok" as const,
      account_id: "tiktok_account_1",
      sender_id: "sender_5",
      sender_name: "נועה ברק",
      message_text: "ווואו! הסרטון שלך עם הטכניקות החדשות היה מעולה! איפה המכון שלך?",
      message_type: "text",
      external_message_id: "tiktok_msg_1",
      thread_id: "tiktok_thread_1",
      is_read: false,
      received_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      replied_at: null,
      reply_text: null,
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]);
  
  const [unreadCount, setUnreadCount] = useState(3); // 3 unread messages from demo
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
    const newUnreadCount = messages.filter(msg => !msg.is_read).length;
    setUnreadCount(newUnreadCount);
  }, [messages]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        const realUnreadCount = await getUnreadCount();
        setUnreadCount(realUnreadCount);
        
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
    setActiveTab("ai-tools");
  };

  const handleMarkAsRead = async (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, is_read: true } : msg
    ));
    
    try {
      await markMessageAsRead(messageId);
    } catch (error) {
      console.log("Could not mark message as read in database:", error);
    }
  };

  const handleReply = async (messageId: string, reply: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { 
            ...msg, 
            reply_text: reply, 
            replied_at: new Date().toISOString(), 
            is_read: true,
            updated_at: new Date().toISOString()
          } 
        : msg
    ));
    
    try {
      await replyToMessage(messageId, reply);
    } catch (error) {
      console.log("Could not send reply via service:", error);
    }
  };

  const handleButtonAction = () => {
    switch (activeTab) {
      case "ai-tools":
        setMessages(prev => prev.map(msg => ({ ...msg, is_read: true })));
        toast({
          title: "סימון הודעות כנקראו",
          description: "כל ההודעות סומנו כנקראו בהצלחה"
        });
        break;
      case "campaigns":
        toast({
          title: "יצירת פוסט",
          description: "תכונה זו תהיה זמינה בקרוב"
        });
        break;
      case "analytics":
        navigate("/marketing");
        break;
      case "posts":
        navigate("/marketing");
        break;
      case "inbox":
        toast({
          title: "כלי AI",
          description: "כלי השיווק AI יהיו זמינים בקרוב"
        });
        break;
      case "dashboard":
        toast({
          title: "הגדרות חיבור",
          description: "נהל את חיבורי המדיה החברתית שלך"
        });
        break;
    }
  };

  const getButtonText = () => {
    switch (activeTab) {
      case "ai-tools": return "סמן הכל כנקרא";
      case "campaigns": return "פוסט חדש";
      case "analytics": return "דשבורד שיווק";
      case "posts": return "נהל קמפיינים";
      case "inbox": return "צור תוכן עם AI";
      case "dashboard": return "רענן חיבורים";
      default: return null; // No button for connections
    }
  };

  const buttonText = getButtonText();

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-6" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:justify-center sm:items-center gap-4">
        <h1 className="text-xl sm:text-2xl font-semibold text-center tracking-tight">מדיה חברתית ושיווק</h1>
        
        {buttonText && (
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 justify-center items-center">
            <Button 
              variant="secondary" 
              size="sm" 
              className="flex items-center justify-center gap-1.5 h-10 sm:h-8 text-sm"
              onClick={handleButtonAction}
            >
              <Plus size={16} />
              {buttonText}
            </Button>
          </div>
        )}
      </div>

      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={`grid gap-1 w-full mb-4 mx-auto ${isMobile ? 'grid-cols-3 h-auto' : 'grid-cols-7 h-10'}`}>
          <TabsTrigger 
            value="connections" 
            className={`text-xs sm:text-sm py-2 sm:py-2.5 font-medium flex gap-1 sm:gap-1.5 justify-center items-center ${isMobile ? 'min-h-[44px] flex-col' : ''}`}
          >
            <Settings className="h-4 w-4" />
            <span className={isMobile ? 'text-xs' : ''}>חיבורים</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="ai-tools" 
            className={`text-xs sm:text-sm py-2 sm:py-2.5 font-medium flex gap-1 sm:gap-1.5 justify-center items-center relative ${isMobile ? 'min-h-[44px] flex-col' : ''}`}
          >
            <BrainCircuit className="h-4 w-4" />
            <span className={isMobile ? 'text-xs' : ''}>כלי AI</span>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </TabsTrigger>
          
          {!isMobile && (
            <>
              <TabsTrigger 
                value="campaigns" 
                className="text-sm py-2.5 font-medium flex gap-1.5 justify-center items-center"
              >
                <Target className="h-4 w-4" />
                <span>קמפיינים</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="analytics" 
                className="text-sm py-2.5 font-medium flex gap-1.5 justify-center items-center"
              >
                <BarChart3 className="h-4 w-4" />
                <span>אנליטיקס</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="posts" 
                className="text-sm py-2.5 font-medium flex gap-1.5 justify-center items-center"
              >
                <Send className="h-4 w-4" />
                <span>פרסום</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="inbox" 
                className="text-sm py-2.5 font-medium flex gap-1.5 justify-center items-center"
              >
                <MessageSquare className="h-4 w-4" />
                <span>הודעות</span>
              </TabsTrigger>
            </>
          )}
          
          <TabsTrigger 
            value="dashboard" 
            className={`text-xs sm:text-sm py-2 sm:py-2.5 font-medium flex gap-1 sm:gap-1.5 justify-center items-center ${isMobile ? 'min-h-[44px] flex-col' : ''}`}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span className={isMobile ? 'text-xs' : ''}>דשבורד</span>
          </TabsTrigger>
        </TabsList>

        {isMobile && (
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2 justify-center">
            <Button
              variant={activeTab === "campaigns" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("campaigns")}
              className="flex items-center justify-center gap-1.5 whitespace-nowrap min-h-[40px]"
            >
              <Target className="h-4 w-4" />
              קמפיינים
            </Button>
            <Button
              variant={activeTab === "analytics" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("analytics")}
              className="flex items-center justify-center gap-1.5 whitespace-nowrap min-h-[40px]"
            >
              <BarChart3 className="h-4 w-4" />
              אנליטיקס
            </Button>
            <Button
              variant={activeTab === "posts" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("posts")}
              className="flex items-center justify-center gap-1.5 whitespace-nowrap min-h-[40px]"
            >
              <Send className="h-4 w-4" />
              פרסום
            </Button>
            <Button
              variant={activeTab === "inbox" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("inbox")}
              className="flex items-center justify-center gap-1.5 whitespace-nowrap min-h-[40px]"
            >
              <MessageSquare className="h-4 w-4" />
              הודעות
            </Button>
          </div>
        )}

        <TabsContent value="connections">
          <MetaConnectionPanel />
        </TabsContent>

        <TabsContent value="ai-tools">
          <UnifiedInbox 
            messages={messages}
            onMarkAsRead={handleMarkAsRead}
            onReply={handleReply}
          />
        </TabsContent>

        <TabsContent value="campaigns">
          <PostCreationPanel />
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsContent 
            analyticsData={analyticsData}
            marketingStats={marketingStats}
            isLoading={isLoading}
          />
        </TabsContent>
        
        <TabsContent value="posts">
          <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
            <Target className="h-16 w-16 text-muted-foreground" />
            <h3 className="text-lg font-semibold">ניהול קמפיינים</h3>
            <p className="text-muted-foreground max-w-md">
              נהל את כל הקמפיינים השיווקיים שלך במקום אחד. צור, ערוך ושלח קמפיינים ללקוחות שלך.
            </p>
            <Button onClick={() => navigate('/marketing')} className="mt-4">
              <Target className="h-4 w-4 mr-2" />
              עבור לדשבורד קמפיינים
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="inbox">
          <AIMarketingTools />
        </TabsContent>

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
      </Tabs>
    </div>
  );
};

export default SocialMedia;
