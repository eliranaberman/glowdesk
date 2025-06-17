
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Info } from "lucide-react";
import { ConnectedAccountsMap } from "./types";
import ConnectionModal from "./ConnectionModal";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type ConnectedAccountsProps = {
  connectedAccounts: ConnectedAccountsMap;
  connectPlatform: (platform: string) => void;
};

const ConnectedAccountsPanel = ({ connectedAccounts, connectPlatform }: ConnectedAccountsProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Social media account data with follower counts - simulate real data
  const socialAccounts = [
    {
      id: "instagram",
      name: "Instagram",
      icon: <Instagram size={16} />,
      followers: connectedAccounts.instagram ? 2540 : 0,
      connected: connectedAccounts.instagram
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: <Facebook size={16} />,
      followers: connectedAccounts.facebook ? 1850 : 0,
      connected: connectedAccounts.facebook
    },
    {
      id: "tiktok",
      name: "TikTok",
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-.88-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1.04-.1z" fill="currentColor"/>
      </svg>,
      followers: connectedAccounts.tiktok ? 3200 : 0,
      connected: connectedAccounts.tiktok
    }
  ];

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">פלטפורמות מחוברות</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p className="max-w-xs text-xs">חיבור זה הוא למטרות הדגמה בלבד. מספרי העוקבים מוצגים לצורך סימולציה.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {socialAccounts.map((account, index) => (
              <div 
                key={account.id}
                className={`flex justify-between items-center ${
                  index < socialAccounts.length - 1 ? 'border-b pb-2' : ''
                }`}
              >
                <Button 
                  variant={account.connected ? "soft" : "outline"} 
                  className="gap-2"
                  onClick={() => setIsModalOpen(true)}
                >
                  {account.connected ? "מחובר" : "חבר חשבון"}
                  {account.icon}
                </Button>
                <div className="flex flex-col text-right">
                  <div className="flex items-center gap-1.5">
                    {account.icon}
                    <span className="font-medium">{account.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {account.connected 
                      ? `${account.followers.toLocaleString()} עוקבים` 
                      : "לא מחובר"}
                  </span>
                </div>
              </div>
            ))}
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
