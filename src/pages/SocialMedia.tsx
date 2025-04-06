
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import DashboardContent from "@/components/social-media/DashboardContent";
import InboxContent from "@/components/social-media/InboxContent";
import PostCreationPanel from "@/components/social-media/PostCreationPanel";
import AnalyticsContent from "@/components/social-media/AnalyticsContent";

const SocialMedia = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [connectedAccounts, setConnectedAccounts] = useState<{[key: string]: boolean}>({
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
    // In a real implementation, this would open the OAuth flow
    // For demonstration, we're just toggling the state
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
    <div className="space-y-6 text-center">
      <div className="flex justify-between items-center">
        <Button variant="soft" size="sm" className="flex items-center gap-1">
          <Plus size={16} />
          חבר חשבון
        </Button>
        <h1 className="text-2xl font-medium text-center mx-auto">מדיה חברתית ושיווק</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" dir="rtl">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="dashboard">דשבורד</TabsTrigger>
          <TabsTrigger value="inbox">תיבת הודעות</TabsTrigger>
          <TabsTrigger value="posts">פרסום פוסטים</TabsTrigger>
          <TabsTrigger value="analytics">אנליטיקס</TabsTrigger>
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
      </Tabs>
    </div>
  );
};

export default SocialMedia;
