
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
import { Instagram, Facebook, AlertCircle } from "lucide-react";
import { ConnectedAccountsMap } from "./types";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  const [showDemoAlert, setShowDemoAlert] = useState(true);

  const handleConnect = async (platform: string) => {
    setConnecting(platform);
    
    // Simulate OAuth connection process
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onConnect(platform);
    setConnecting(null);
    
    toast({
      title: `חשבון ${getPlatformName(platform)} חובר בהצלחה`,
      description: "חיבור זה הוא למטרות הדגמה בלבד ולא מחבר חשבון אמיתי",
    });
  };

  const getPlatformName = (platform: string): string => {
    switch (platform) {
      case "instagram": return "Instagram";
      case "facebook": return "Facebook";
      case "tiktok": return "TikTok";
      default: return platform;
    }
  };

  const TikTokIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-.88-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1.04-.1z" fill="currentColor"/>
    </svg>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">חיבור חשבונות מדיה חברתית</DialogTitle>
          <DialogDescription className="text-center">
            חבר את חשבונות המדיה החברתית שלך כדי לנהל אותם במקום אחד
          </DialogDescription>
        </DialogHeader>
        
        {showDemoAlert && (
          <Alert variant="default" className="bg-muted/50 mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              זוהי גרסת הדגמה. לחיצה על כפתור "חבר חשבון" תדמה חיבור בלבד ולא תחבר חשבון אמיתי.
              <Button 
                variant="link" 
                className="p-0 h-auto text-xs underline ms-1" 
                onClick={() => setShowDemoAlert(false)}
              >
                הסתר
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between border-b pb-3">
            <Button
              disabled={connecting === "instagram"}
              onClick={() => handleConnect("instagram")}
              variant={connectedAccounts.instagram ? "secondary" : "outline"}
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
              variant={connectedAccounts.facebook ? "secondary" : "outline"}
              className="gap-2"
            >
              <Facebook size={18} />
              {connecting === "facebook" ? "מתחבר..." : connectedAccounts.facebook ? "מחובר" : "חבר חשבון"}
            </Button>
            <span className="font-medium">Facebook</span>
          </div>
          
          <div className="flex items-center justify-between">
            <Button
              disabled={connecting === "tiktok"}
              onClick={() => handleConnect("tiktok")}
              variant={connectedAccounts.tiktok ? "secondary" : "outline"} 
              className="gap-2"
            >
              <TikTokIcon />
              {connecting === "tiktok" ? "מתחבר..." : connectedAccounts.tiktok ? "מחובר" : "חבר חשבון"}
            </Button>
            <span className="font-medium">TikTok</span>
          </div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>סגור</Button>
          <Button onClick={() => onOpenChange(false)}>שמור שינויים</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectionModal;
