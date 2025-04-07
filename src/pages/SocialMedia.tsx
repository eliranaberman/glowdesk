
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import DashboardContent from "@/components/social-media/DashboardContent";
import InboxContent from "@/components/social-media/InboxContent";
import PostCreationPanel from "@/components/social-media/PostCreationPanel";
import AnalyticsContent from "@/components/social-media/AnalyticsContent";
import ConnectionModal from "@/components/social-media/ConnectionModal";
import AIMarketingTools from "@/components/social-media/AIMarketingTools";
import { ConnectedAccountsMap } from "@/components/social-media/types";

const SocialMedia = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isConnectionModalOpen, setIsConnectionModalOpen] = useState(false);
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccountsMap>({
    instagram: false,
    facebook: false,
    twitter: false,
    tiktok: false,
  });

  // Mock data for demonstration purposes
  const messages = [
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

  const connectPlatform = (platform: string) => {
    // Toggle the connection state for the platform
    setConnectedAccounts(prev => ({
      ...prev,
      [platform]: !prev[platform]
    }));
  };

  const handleOpenInbox = () => {
    // Change the active tab to the inbox using the state
    setActiveTab("inbox");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button 
          variant="soft" 
          size="sm" 
          className="flex items-center gap-1"
          onClick={() => setIsConnectionModalOpen(true)}
        >
          <Plus size={16} />
          חבר חשבון
        </Button>
        <h1 className="text-2xl font-medium text-center mx-auto">מדיה חברתית ושיווק</h1>
        <div className="w-[85px]" /> {/* Spacer for visual balance */}
      </div>

      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full" dir="rtl">
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="dashboard" className="text-xs md:text-base">דשבורד</TabsTrigger>
          <TabsTrigger value="inbox" className="text-xs md:text-base">תיבת הודעות</TabsTrigger>
          <TabsTrigger value="posts" className="text-xs md:text-base">פרסום פוסטים</TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs md:text-base">אנליטיקס</TabsTrigger>
          <TabsTrigger value="ai-tools" className="text-xs md:text-base">כלי שיווק AI</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard">
          <DashboardContent 
            connectedAccounts={connectedAccounts}
            connectPlatform={connectPlatform}
            handleOpenInbox={handleOpenInbox}
            messages={messages}
          />
        </TabsContent>

        {/* Inbox Tab */}
        <TabsContent value="inbox">
          <InboxContent />
        </TabsContent>

        {/* Posts Tab */}
        <TabsContent value="posts">
          <PostCreationPanel />
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <AnalyticsContent />
        </TabsContent>
        
        {/* AI Marketing Tools Tab */}
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
