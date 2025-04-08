
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
import { ScrollArea } from "@/components/ui/scroll-area";
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
      <DialogContent className="sm:max-w-3xl max-h-[95vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-center mb-4 text-xl font-bold">
            שיחה עם {message.sender} ({message.platform})
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 flex-1 overflow-hidden">
          {/* Increased size of message display area */}
          <ScrollArea className="bg-muted/20 rounded-lg h-[400px] border border-border/50 shadow-inner">
            <div className="p-6 space-y-8">
              {/* Original message with improved styling */}
              <div className="flex gap-4 items-start">
                <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border-2 border-primary/20">
                  <img src={message.avatar} alt={message.sender} className="w-full h-full object-cover" />
                </div>
                <div className="bg-muted/40 p-6 rounded-lg max-w-[80%]">
                  <p className="text-lg font-medium mb-2">{message.sender}</p>
                  <p className="text-lg leading-relaxed mb-3">{message.message}</p>
                  <span className="text-sm text-muted-foreground">{message.time}</span>
                </div>
              </div>
              
              {/* Simulated previous thread with improved styling */}
              {message.id % 2 === 0 && (
                <>
                  <div className="flex justify-end mb-8">
                    <div className="bg-primary/10 p-6 rounded-lg max-w-[80%]">
                      <p className="text-lg leading-relaxed mb-3">תודה שפנית אלינו! איך נוכל לעזור?</p>
                      <span className="text-sm text-muted-foreground">09:46</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 items-start">
                    <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border-2 border-primary/20">
                      <img src={message.avatar} alt={message.sender} className="w-full h-full object-cover" />
                    </div>
                    <div className="bg-muted/40 p-6 rounded-lg max-w-[80%]">
                      <p className="text-lg leading-relaxed mb-3">{message.message}</p>
                      <span className="text-sm text-muted-foreground">{message.time}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
          
          <div className="space-y-3">
            <Textarea 
              placeholder="הקלד את התגובה שלך כאן..." 
              className="min-h-[120px] text-base p-4"
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
        
        <DialogFooter className="mt-4">
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
