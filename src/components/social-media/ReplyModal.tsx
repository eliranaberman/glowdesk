
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
import { Send, Image, FileText, Smile } from "lucide-react";
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
      <DialogContent className={`max-w-3xl w-[calc(100%-32px)] mx-auto flex flex-col h-auto max-h-[90vh] p-5 ${isMobile ? 'gap-3' : 'gap-4'}`}>
        <DialogHeader className="border-b pb-3 mb-3">
          <DialogTitle className="text-center text-xl">
            שיחה עם {message.sender}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          {/* Message display area with improved sizing and scrolling */}
          <ScrollArea className="flex-1 bg-muted/10 rounded-lg border border-border/50 shadow-inner mb-4">
            <div className="p-4 space-y-6">
              {/* Original message */}
              <div className="flex gap-3 items-start">
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-primary/20">
                  <img src={message.avatar} alt={message.sender} className="w-full h-full object-cover" />
                </div>
                <div className="bg-muted/30 p-4 rounded-lg flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">{message.time}</span>
                    <p className="font-medium">{message.sender}</p>
                  </div>
                  <p className="text-base mb-1">{message.message}</p>
                </div>
              </div>
              
              {/* Simulated previous thread if it exists */}
              {message.id % 2 === 0 && (
                <>
                  <div className="flex justify-end">
                    <div className="bg-primary/10 p-4 rounded-lg max-w-[85%]">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-muted-foreground">09:46</span>
                        <p className="font-medium">אתה</p>
                      </div>
                      <p className="text-base">תודה שפנית אלינו! איך נוכל לעזור?</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 items-start">
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-primary/20">
                      <img src={message.avatar} alt={message.sender} className="w-full h-full object-cover" />
                    </div>
                    <div className="bg-muted/30 p-4 rounded-lg flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-muted-foreground">{message.time}</span>
                        <p className="font-medium">{message.sender}</p>
                      </div>
                      <p className="text-base">{message.message}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
          
          <div className="border rounded-lg bg-card shadow-sm">
            <Textarea 
              placeholder="הקלד את התגובה שלך כאן..." 
              className="min-h-[100px] text-base p-3 border-0 focus-visible:ring-0 resize-none"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
            />
            
            <div className="flex items-center justify-between p-2 border-t">
              <div className="flex gap-1">
                <Button type="button" variant="ghost" size="sm" className="rounded-full w-8 h-8 p-0">
                  <Image size={16} />
                  <span className="sr-only">צרף תמונה</span>
                </Button>
                <Button type="button" variant="ghost" size="sm" className="rounded-full w-8 h-8 p-0">
                  <FileText size={16} />
                  <span className="sr-only">צרף קובץ</span>
                </Button>
                <Button type="button" variant="ghost" size="sm" className="rounded-full w-8 h-8 p-0">
                  <Smile size={16} />
                  <span className="sr-only">הוסף אימוג'י</span>
                </Button>
              </div>
              <Button 
                onClick={handleSendReply}
                disabled={sending || !reply.trim()}
                size="sm"
                className="gap-1.5"
              >
                <Send size={14} />
                {sending ? "שולח..." : "שלח"}
              </Button>
            </div>
          </div>
        </div>
        
        <DialogFooter className="pt-2 mt-auto">
          <Button 
            onClick={() => onOpenChange(false)} 
            variant="outline"
            className={`${isMobile ? 'flex-1' : ''}`}
          >
            סגור
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReplyModal;
