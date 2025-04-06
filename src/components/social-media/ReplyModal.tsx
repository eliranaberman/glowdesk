
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Message } from "./types";
import { Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ReplyModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: Message | null;
};

const ReplyModal = ({ open, onOpenChange, message }: ReplyModalProps) => {
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  if (!message) {
    return null;
  }

  const handleSendReply = async () => {
    if (!reply.trim()) {
      toast({
        title: "שגיאה",
        description: "אנא הזן הודעה לפני השליחה",
        variant: "destructive",
      });
      return;
    }
    
    setSending(true);
    
    // Simulate sending a response
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "הודעה נשלחה",
      description: `התגובה שלך נשלחה ל-${message.sender}`,
    });
    
    setReply("");
    setSending(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center mb-4">
            שיחה עם {message.sender} ({message.platform})
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-muted/30 p-3 rounded-lg max-h-[200px] overflow-y-auto">
            <div className="flex gap-3 items-start mb-4">
              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                <img src={message.avatar} alt={message.sender} className="w-full h-full object-cover" />
              </div>
              <div className="bg-muted/50 p-2 px-3 rounded-lg">
                <p className="text-sm font-medium">{message.sender}</p>
                <p className="text-sm">{message.message}</p>
                <span className="text-xs text-muted-foreground">{message.time}</span>
              </div>
            </div>
            
            {/* Simulated previous thread */}
            {message.id % 2 === 0 && (
              <>
                <div className="flex justify-end mb-4">
                  <div className="bg-primary/10 p-2 px-3 rounded-lg">
                    <p className="text-sm">תודה שפנית אלינו! איך נוכל לעזור?</p>
                    <span className="text-xs text-muted-foreground">09:46</span>
                  </div>
                </div>
                
                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                    <img src={message.avatar} alt={message.sender} className="w-full h-full object-cover" />
                  </div>
                  <div className="bg-muted/50 p-2 px-3 rounded-lg">
                    <p className="text-sm">{message.message}</p>
                    <span className="text-xs text-muted-foreground">{message.time}</span>
                  </div>
                </div>
              </>
            )}
          </div>
          
          <div className="space-y-2">
            <Textarea 
              placeholder="הקלד את התגובה שלך כאן..." 
              className="min-h-[100px]"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
            />
            
            <div className="flex justify-between">
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  הכנס תבנית
                </Button>
                <Button variant="outline" size="sm">
                  צרף מדיה
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="outline">
            ביטול
          </Button>
          <Button 
            onClick={handleSendReply} 
            disabled={sending}
            className="gap-2"
          >
            <Send size={16} />
            {sending ? "שולח..." : "שלח תגובה"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReplyModal;
