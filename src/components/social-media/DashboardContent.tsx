
import { useState } from "react";
import ConnectedAccountsPanel from "./ConnectedAccountsPanel";
import InboxStatusPanel from "./InboxStatusPanel";
import RecentMessagesPanel from "./RecentMessagesPanel";

type Message = {
  id: number;
  platform: string;
  sender: string;
  message: string;
  time: string;
  read: boolean;
  avatar: string;
};

type DashboardContentProps = {
  connectedAccounts: {[key: string]: boolean};
  connectPlatform: (platform: string) => void;
  handleOpenInbox: () => void;
  messages: Message[];
};

const DashboardContent = ({ 
  connectedAccounts, 
  connectPlatform, 
  handleOpenInbox,
  messages 
}: DashboardContentProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ConnectedAccountsPanel 
          connectedAccounts={connectedAccounts} 
          connectPlatform={connectPlatform} 
        />
        <InboxStatusPanel handleOpenInbox={handleOpenInbox} />
      </div>
      
      <RecentMessagesPanel messages={messages} />
    </div>
  );
};

export default DashboardContent;
