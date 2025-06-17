
import { MarketingStats } from "@/types/marketing";

export interface ConnectedAccountsMap {
  instagram: boolean;
  facebook: boolean;
  tiktok: boolean;
}

export interface DashboardContentProps {
  connectedAccounts: ConnectedAccountsMap;
  connectPlatform: (platform: string) => void;
  handleOpenInbox: () => void;
  messages: SocialMediaMessage[];
  marketingStats?: MarketingStats | null;
  isLoading?: boolean;
}

export interface InboxContentProps {
  messages: SocialMediaMessage[];
  onMarkAsRead: (messageId: string) => void;
  onReply: (messageId: string, reply: string) => void;
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
  messages: SocialMediaMessage[];
}

export interface InboxStatusPanelProps {
  handleOpenInbox: () => void;
  unreadCount: number;
}

// Updated Message interface to match new database structure
export interface SocialMediaMessage {
  id: string;
  user_id: string;
  platform: 'facebook' | 'instagram' | 'tiktok';
  account_id: string;
  sender_id: string;
  sender_name: string;
  message_text: string | null;
  message_type: 'text' | 'image' | 'video' | 'story_reply' | 'comment';
  external_message_id: string;
  thread_id: string | null;
  is_read: boolean;
  received_at: string;
  replied_at: string | null;
  reply_text: string | null;
  created_at: string;
  updated_at: string;
}

// Legacy Message interface for backwards compatibility
export interface Message {
  id: number;
  platform: string;
  sender: string;
  message: string;
  time: string;
  read: boolean;
  avatar: string;
}

export interface SocialMediaWebhook {
  id: string;
  user_id: string;
  platform: 'facebook' | 'instagram' | 'tiktok';
  account_id: string;
  webhook_id: string | null;
  webhook_url: string | null;
  subscription_fields: string[] | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
