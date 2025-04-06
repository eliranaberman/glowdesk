
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Message } from "./types";
import ReplyModal from "./ReplyModal";

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

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <Button variant="outline" size="sm" className="mr-auto">
            טען עוד
          </Button>
          <CardTitle className="text-lg text-center mx-auto">הודעות אחרונות</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="flex gap-3 items-start border-b pb-3 last:border-0 text-right">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <img src={message.avatar} alt={message.sender} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col flex-1 gap-1 text-right">
                  <div className="flex items-center gap-2 w-full">
                    {!message.read && (
                      <Badge variant="soft" className="h-2 w-2 p-0 rounded-full" />
                    )}
                    <span className="font-medium">{message.sender} ({message.platform})</span>
                    <span className="text-sm text-muted-foreground mr-auto">{message.time}</span>
                  </div>
                  <p className="text-sm text-right">{message.message}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="self-start mt-1"
                    onClick={() => handleReply(message)}
                  >
                    השב
                  </Button>
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
