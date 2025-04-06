
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Instagram, Facebook, X, MessageSquare } from "lucide-react";
import { ConnectedAccountsMap } from "./types";
import { useToast } from "@/hooks/use-toast";

type ConnectionModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  connectedAccounts: ConnectedAccountsMap;
  onConnect: (platform: string) => void;
};

const ConnectionModal = ({ 
  open, 
  onOpenChange, 
  connectedAccounts, 
  onConnect 
}: ConnectionModalProps) => {
  const { toast } = useToast();
  const [connecting, setConnecting] = useState<string | null>(null);

  const handleConnect = async (platform: string) => {
    setConnecting(platform);
    
    // Simulate OAuth connection process
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onConnect(platform);
    setConnecting(null);
    
    toast({
      title: "חשבון מחובר בהצלחה",
      description: `חשבון ה${platform} שלך חובר בהצלחה`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">חיבור חשבונות מדיה חברתית</DialogTitle>
          <DialogDescription className="text-center">
            חבר את חשבונות המדיה החברתית שלך כדי לנהל אותם במקום אחד
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between border-b pb-3">
            <Button
              disabled={connecting === "instagram"}
              onClick={() => handleConnect("instagram")}
              variant={connectedAccounts.instagram ? "soft" : "outline"}
              className="gap-2"
            >
              <Instagram size={18} />
              {connecting === "instagram" ? "מתחבר..." : connectedAccounts.instagram ? "מחובר" : "חבר חשבון"}
            </Button>
            <span className="font-medium">Instagram</span>
          </div>
          
          <div className="flex items-center justify-between border-b pb-3">
            <Button
              disabled={connecting === "facebook"} 
              onClick={() => handleConnect("facebook")}
              variant={connectedAccounts.facebook ? "soft" : "outline"}
              className="gap-2"
            >
              <Facebook size={18} />
              {connecting === "facebook" ? "מתחבר..." : connectedAccounts.facebook ? "מחובר" : "חבר חשבון"}
            </Button>
            <span className="font-medium">Facebook</span>
          </div>
          
          <div className="flex items-center justify-between border-b pb-3">
            <Button
              disabled={connecting === "tiktok"}
              onClick={() => handleConnect("tiktok")}
              variant={connectedAccounts.tiktok ? "soft" : "outline"} 
              className="gap-2"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 20l3-4 3 4M10 4.5h4c3.771 0 5.657 0 6.828 1.172C22 6.843 22 8.729 22 12.5s0 5.657-1.172 6.828C19.657 20.5 17.771 20.5 14 20.5h-4c-3.771 0-5.657 0-6.828-1.172C2 18.157 2 16.271 2 12.5s0-5.657 1.172-6.828C4.343 4.5 6.229 4.5 10 4.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {connecting === "tiktok" ? "מתחבר..." : connectedAccounts.tiktok ? "מחובר" : "חבר חשבון"}
            </Button>
            <span className="font-medium">TikTok</span>
          </div>
          
          <div className="flex items-center justify-between">
            <Button
              disabled={connecting === "twitter"}
              onClick={() => handleConnect("twitter")}
              variant={connectedAccounts.twitter ? "soft" : "outline"} 
              className="gap-2"
            >
              <X size={18} />
              {connecting === "twitter" ? "מתחבר..." : connectedAccounts.twitter ? "מחובר" : "חבר חשבון"}
            </Button>
            <span className="font-medium">Twitter / X</span>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>סגור</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectionModal;
