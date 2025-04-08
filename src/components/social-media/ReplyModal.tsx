
import { useState, useEffect } from "react";
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
import { useIsMobile } from "@/hooks/use-mobile";

type ReplyModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: Message | null;
};

const ReplyModal = ({ open, onOpenChange, message }: ReplyModalProps) => {
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Reset reply text when modal closes
  useEffect(() => {
    if (!open) {
      setReply("");
    }
  }, [open]);

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
      <DialogContent className={`sm:max-w-3xl max-h-[90vh] flex flex-col ${isMobile ? 'p-4 w-[95vw]' : ''}`}>
        <DialogHeader>
          <DialogTitle className="text-center mb-4 text-xl font-bold">
            שיחה עם {message.sender} ({message.platform})
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 flex-1 overflow-hidden">
          {/* Message display area with improved sizing and scrolling */}
          <ScrollArea className={`bg-muted/20 rounded-lg ${isMobile ? 'h-[35vh]' : 'h-[50vh]'} border border-border/50 shadow-inner`}>
            <div className="p-6 space-y-8">
              {/* Original message with improved styling */}
              <div className="flex gap-4 items-start">
                <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2 border-primary/20">
                  <img src={message.avatar} alt={message.sender} className="w-full h-full object-cover" />
                </div>
                <div className="bg-muted/40 p-6 rounded-lg max-w-[80%]">
                  <p className="text-xl font-medium mb-3">{message.sender}</p>
                  <p className="text-lg leading-relaxed mb-3">{message.message}</p>
                  <span className="text-sm text-muted-foreground">{message.time}</span>
                </div>
              </div>
              
              {/* Simulated previous thread */}
              {message.id % 2 === 0 && (
                <>
                  <div className="flex justify-end mb-8">
                    <div className="bg-primary/10 p-6 rounded-lg max-w-[80%]">
                      <p className="text-lg leading-relaxed mb-3">תודה שפנית אלינו! איך נוכל לעזור?</p>
                      <span className="text-sm text-muted-foreground">09:46</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 items-start">
                    <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2 border-primary/20">
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
              className={`min-h-[120px] text-base p-4 ${isMobile ? 'text-lg' : ''}`}
              value={reply}
              onChange={(e) => setReply(e.target.value)}
            />
            
            <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'justify-between'}`}>
              <div className={`flex gap-2 ${isMobile ? 'w-full justify-between' : ''}`}>
                <Button variant="outline" size={isMobile ? "sm" : "default"}>
                  הכנס תבנית
                </Button>
                <Button variant="outline" size={isMobile ? "sm" : "default"}>
                  צרף מדיה
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className={`mt-4 ${isMobile ? 'flex-col space-y-2' : ''}`}>
          <Button 
            onClick={() => onOpenChange(false)} 
            variant="outline"
            className={isMobile ? "w-full" : ""}
          >
            ביטול
          </Button>
          <Button 
            onClick={handleSendReply} 
            disabled={sending}
            className={`gap-2 ${isMobile ? "w-full" : ""}`}
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
