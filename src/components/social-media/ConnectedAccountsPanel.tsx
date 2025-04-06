
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Instagram, Facebook, X } from "lucide-react";
import { ConnectedAccountsMap } from "./types";
import ConnectionModal from "./ConnectionModal";

type ConnectedAccountsProps = {
  connectedAccounts: ConnectedAccountsMap;
  connectPlatform: (platform: string) => void;
};

const ConnectedAccountsPanel = ({ connectedAccounts, connectPlatform }: ConnectedAccountsProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg text-center w-full">פלטפורמות מחוברות</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex flex-row-reverse justify-between items-center border-b pb-2">
              <Button 
                variant={connectedAccounts.instagram ? "soft" : "outline"} 
                className="gap-2"
                onClick={() => setIsModalOpen(true)}
              >
                <Instagram size={16} />
                {connectedAccounts.instagram ? "מחובר" : "חבר חשבון"}
              </Button>
              <div className="text-right">
                <span className="font-medium">אינסטגרם</span>
              </div>
            </div>
            
            <div className="flex flex-row-reverse justify-between items-center border-b pb-2">
              <Button 
                variant={connectedAccounts.facebook ? "soft" : "outline"} 
                className="gap-2"
                onClick={() => setIsModalOpen(true)}
              >
                <Facebook size={16} />
                {connectedAccounts.facebook ? "מחובר" : "חבר חשבון"}
              </Button>
              <div className="text-right">
                <span className="font-medium">פייסבוק</span>
              </div>
            </div>
            
            <div className="flex flex-row-reverse justify-between items-center border-b pb-2">
              <Button 
                variant={connectedAccounts.tiktok ? "soft" : "outline"} 
                className="gap-2"
                onClick={() => setIsModalOpen(true)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 20l3-4 3 4M10 4.5h4c3.771 0 5.657 0 6.828 1.172C22 6.843 22 8.729 22 12.5s0 5.657-1.172 6.828C19.657 20.5 17.771 20.5 14 20.5h-4c-3.771 0-5.657 0-6.828-1.172C2 18.157 2 16.271 2 12.5s0-5.657 1.172-6.828C4.343 4.5 6.229 4.5 10 4.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {connectedAccounts.tiktok ? "מחובר" : "חבר חשבון"}
              </Button>
              <div className="text-right">
                <span className="font-medium">טיקטוק</span>
              </div>
            </div>
            
            <div className="flex flex-row-reverse justify-between items-center pb-2">
              <Button 
                variant={connectedAccounts.twitter ? "soft" : "outline"} 
                className="gap-2"
                onClick={() => setIsModalOpen(true)}
              >
                <X size={16} />
                {connectedAccounts.twitter ? "מחובר" : "חבר חשבון"}
              </Button>
              <div className="text-right">
                <span className="font-medium">טוויטר / X</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <ConnectionModal 
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        connectedAccounts={connectedAccounts}
        onConnect={connectPlatform}
      />
    </>
  );
};

export default ConnectedAccountsPanel;
