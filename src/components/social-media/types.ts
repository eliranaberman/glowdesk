
import { MarketingStats } from "@/types/marketing";

export interface ConnectedAccountsMap {
  instagram: boolean;
  facebook: boolean;
  twitter: boolean;
  tiktok: boolean;
}

export interface DashboardContentProps {
  connectedAccounts: ConnectedAccountsMap;
  connectPlatform: (platform: string) => void;
  handleOpenInbox: () => void;
  messages: any[];
  marketingStats?: MarketingStats | null;
  isLoading?: boolean;
}

export interface InboxContentProps {
  // Add props as needed
}

export interface AnalyticsContentProps {
  analyticsData: {
    followers: { name: string; count: number }[];
    engagement: { name: string; rate: number }[];
    posts: { name: string; count: number }[];
    colors: {
      primary: string;
      secondary: string;
      tertiary: string;
    };
  };
  marketingStats?: MarketingStats | null;
  isLoading?: boolean;
}

export interface PostCreationPanelProps {
  // Add props as needed
}

export interface AIMarketingToolsProps {
  // Add props as needed
}

export interface ConnectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  connectedAccounts: ConnectedAccountsMap;
  onConnect: (platform: string) => void;
}

export interface RecentMessagesPanelProps {
  messages: Message[];
}

export interface InboxStatusPanelProps {
  handleOpenInbox: () => void;
}

// Add the missing Message interface
export interface Message {
  id: number;
  platform: string;
  sender: string;
  message: string;
  time: string;
  read: boolean;
  avatar: string;
}
