
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SocialMediaMessage } from "./types";
import ReplyModal from "./ReplyModal";
import { Instagram, Facebook, MessageCircle } from "lucide-react";

type RecentMessagesPanelProps = {
  messages: SocialMediaMessage[];
};

const RecentMessagesPanel = ({ messages }: RecentMessagesPanelProps) => {
  const [selectedMessage, setSelectedMessage] = useState<SocialMediaMessage | null>(null);
  const [replyModalOpen, setReplyModalOpen] = useState(false);

  const handleReply = (message: SocialMediaMessage) => {
    setSelectedMessage(message);
    setReplyModalOpen(true);
  };

  // Helper function to get platform icon
  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "instagram":
        return <Instagram size={16} className="text-pink-500" />;
      case "facebook":
        return <Facebook size={16} className="text-blue-600" />;
      case "tiktok":
        return <TikTokIcon />;
      default:
        return <MessageCircle size={16} className="text-gray-500" />;
    }
  };

  return (
    <>
      <Card className="shadow-soft hover:shadow-soft-lg transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
          {/* Right button - "Load more" moved to right side */}
          <Button variant="outline" size="sm">
            טען עוד
          </Button>
          {/* Title in the center */}
          <CardTitle className="text-lg font-medium">הודעות אחרונות</CardTitle>
          {/* Left button - placeholder for visual balance */}
          <div className="w-[65px]" /> {/* Width to match the "טען עוד" button */}
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className="p-4 hover:bg-muted/20 transition-colors duration-200"
              >
                <div className="flex flex-row-reverse gap-4 items-start">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-border/30 bg-muted flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {message.sender_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-row-reverse items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium">
                          {message.sender_name}
                        </span>
                        {!message.is_read && (
                          <Badge variant="soft" className="h-2 w-2 p-0 rounded-full" />
                        )}
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground gap-1">
                        {getPlatformIcon(message.platform)}
                        <span>({message.platform})</span>
                      </div>
                    </div>
                    <p className="text-sm mb-3 text-right">{message.message_text}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {new Date(message.received_at).toLocaleDateString('he-IL')}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-1 h-auto hover:bg-transparent hover:underline text-xs text-muted-foreground"
                        onClick={() => handleReply(message)}
                      >
                        <MessageCircle size={14} className="ml-1.5" />
                        השב
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <ReplyModal 
        open={replyModalOpen} 
        onOpenChange={setReplyModalOpen} 
        message={selectedMessage} 
      />
    </>
  );
};

const TikTokIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-black">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-.88-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1.04-.1z" fill="currentColor"/>
  </svg>
);

export default RecentMessagesPanel;
