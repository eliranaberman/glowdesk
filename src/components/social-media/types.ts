
export type Message = {
  id: number;
  platform: string;
  sender: string;
  message: string;
  time: string;
  read: boolean;
  avatar: string;
};

export type ConnectedAccountsMap = {
  [key: string]: boolean;
};

export type AnalyticsData = {
  totalReach: number;
  engagementRate: number;
  followerGrowth: number;
  totalPosts: number;
  platformData: {
    [platform: string]: {
      impressions: number;
      likes: number;
      shares: number;
      comments: number;
      clickThroughRate: number;
    };
  };
};

export type PostData = {
  id: number;
  platform: string;
  date: string;
  caption: string;
  impressions: number;
  engagement: number;
  linkClicks: number;
  status: "published" | "scheduled";
  image?: string;
};
