
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Message } from "./types";
import ReplyModal from "./ReplyModal";
import { Instagram, Facebook, Twitter, MessageCircle } from "lucide-react";

type RecentMessagesPanelProps = {
  messages: Message[];
};

const RecentMessagesPanel = ({ messages }: RecentMessagesPanelProps) => {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyModalOpen, setReplyModalOpen] = useState(false);

  const handleReply = (message: Message) => {
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
      case "twitter":
        return <Twitter size={16} className="text-blue-400" />;
      default:
        return <MessageCircle size={16} className="text-gray-500" />;
    }
  };

  return (
    <>
      <Card className="shadow-soft hover:shadow-soft-lg transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
          <Button variant="outline" size="sm">
            טען עוד
          </Button>
          <CardTitle className="text-lg text-center mx-auto">הודעות אחרונות</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className="p-4 hover:bg-muted/20 transition-colors duration-200"
              >
                <div className="flex gap-3 items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">
                        {message.sender}
                      </span>
                      <div className="flex items-center text-xs text-muted-foreground gap-1">
                        {getPlatformIcon(message.platform)}
                        <span>({message.platform})</span>
                      </div>
                      {!message.read && (
                        <Badge variant="soft" className="h-2 w-2 p-0 rounded-full mr-1" />
                      )}
                    </div>
                    <p className="text-sm mb-2 text-muted-foreground">{message.message}</p>
                    <div className="flex items-center justify-between">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-0 h-auto hover:bg-transparent hover:underline text-xs text-muted-foreground"
                        onClick={() => handleReply(message)}
                      >
                        <MessageCircle size={14} className="ml-1" />
                        השב
                      </Button>
                      <span className="text-xs text-muted-foreground">{message.time}</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <img 
                      src={message.avatar} 
                      alt={message.sender} 
                      className="w-full h-full object-cover" 
                    />
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

export default RecentMessagesPanel;
