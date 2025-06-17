
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SocialMediaMessage } from "./types";
import { Instagram, Facebook, MessageCircle, Send } from "lucide-react";

interface ReplyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: SocialMediaMessage | null;
  onSendReply?: (messageId: string, reply: string) => void;
}

const ReplyModal = ({ open, onOpenChange, message, onSendReply }: ReplyModalProps) => {
  const [replyText, setReplyText] = useState("");

  const handleSend = () => {
    if (!replyText.trim() || !message || !onSendReply) return;
    
    onSendReply(message.id, replyText);
    setReplyText("");
    onOpenChange(false);
  };

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

  if (!message) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-center">תגובה להודעה</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
            <div className="flex items-center gap-1">
              {getPlatformIcon(message.platform)}
              <span className="font-medium">{message.sender_name}</span>
            </div>
          </div>
          
          <div className="bg-muted/10 p-3 rounded-lg">
            <p className="text-sm">{message.message_text}</p>
            <span className="text-xs text-muted-foreground mt-1 block">
              {new Date(message.received_at).toLocaleString('he-IL')}
            </span>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">התגובה שלך:</label>
            <Textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="כתוב את תגובתך כאן..."
              className="min-h-[100px]"
            />
          </div>
          
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              ביטול
            </Button>
            <Button 
              onClick={handleSend}
              disabled={!replyText.trim()}
              className="flex items-center gap-2"
            >
              <Send size={16} />
              שלח תגובה
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const TikTokIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-black">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-.88-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1.04-.1z" fill="currentColor"/>
  </svg>
);

export default ReplyModal;
