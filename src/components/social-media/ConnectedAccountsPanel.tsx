
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Instagram, Facebook, Twitter } from "lucide-react";
import { ConnectedAccountsMap } from "./types";
import ConnectionModal from "./ConnectionModal";

type ConnectedAccountsProps = {
  connectedAccounts: ConnectedAccountsMap;
  connectPlatform: (platform: string) => void;
};

const ConnectedAccountsPanel = ({ connectedAccounts, connectPlatform }: ConnectedAccountsProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Social media account data with follower counts
  const socialAccounts = [
    {
      id: "instagram",
      name: "Instagram",
      icon: <Instagram size={16} />,
      followers: 2540,
      connected: connectedAccounts.instagram
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: <Facebook size={16} />,
      followers: 1850,
      connected: connectedAccounts.facebook
    },
    {
      id: "twitter",
      name: "Twitter",
      icon: <Twitter size={16} />,
      followers: 780,
      connected: connectedAccounts.twitter
    },
    {
      id: "tiktok",
      name: "TikTok",
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 20l3-4 3 4M10 4.5h4c3.771 0 5.657 0 6.828 1.172C22 6.843 22 8.729 22 12.5s0 5.657-1.172 6.828C19.657 20.5 17.771 20.5 14 20.5h-4c-3.771 0-5.657 0-6.828-1.172C2 18.157 2 16.271 2 12.5s0-5.657 1.172-6.828C4.343 4.5 6.229 4.5 10 4.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>,
      followers: 3200,
      connected: connectedAccounts.tiktok
    }
  ];

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg text-center w-full">פלטפורמות מחוברות</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {socialAccounts.map((account, index) => (
              <div 
                key={account.id}
                className={`flex flex-row-reverse justify-between items-center ${
                  index < socialAccounts.length - 1 ? 'border-b pb-2' : ''
                }`}
              >
                <Button 
                  variant={account.connected ? "soft" : "outline"} 
                  className="gap-2"
                  onClick={() => setIsModalOpen(true)}
                >
                  {account.icon}
                  {account.connected ? "מחובר" : "חבר חשבון"}
                </Button>
                <div className="flex flex-col text-right">
                  <span className="font-medium">{account.name}</span>
                  <span className="text-xs text-muted-foreground">{account.followers.toLocaleString()} עוקבים</span>
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
