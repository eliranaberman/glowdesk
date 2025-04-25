
// Marketing template related types
export interface MarketingTemplate {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export type MarketingTemplateCreate = Omit<MarketingTemplate, 'id' | 'created_at' | 'updated_at'>;
export type MarketingTemplateUpdate = Partial<Omit<MarketingTemplate, 'id' | 'created_at' | 'updated_at' | 'created_by'>>;

// Marketing campaign related types
export type CampaignStatus = 'draft' | 'scheduled' | 'sent' | 'failed';

export interface MarketingCampaign {
  id: string;
  name: string;
  template_id: string;
  scheduled_at: string | null;
  status: CampaignStatus;
  created_by: string;
  template?: MarketingTemplate | {
    id: string;
    title: string;
  };
  messages_count?: number;
  delivered_count?: number;
  opened_count?: number;
  clicked_count?: number;
  failed_count?: number;
}

export type MarketingCampaignCreate = Omit<MarketingCampaign, 'id' | 'template' | 'messages_count' | 'delivered_count' | 'opened_count' | 'clicked_count' | 'failed_count'>;
export type MarketingCampaignUpdate = Partial<Omit<MarketingCampaign, 'id' | 'created_by' | 'template' | 'messages_count' | 'delivered_count' | 'opened_count' | 'clicked_count' | 'failed_count'>>;

// Marketing message related types
export type MessageStatus = 'pending' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'failed';

export interface MarketingMessage {
  id: string;
  campaign_id: string;
  client_id: string;
  status: MessageStatus;
  sent_at: string | null;
  delivered_at?: string | null;
  opened_at?: string | null;
  clicked_at?: string | null;
  error_message?: string | null;
  client?: {
    id: string;
    full_name: string;
    email: string;
    phone_number: string;
  };
}

export type MarketingMessageCreate = Omit<MarketingMessage, 'id' | 'delivered_at' | 'opened_at' | 'clicked_at' | 'client'>;
export type MarketingMessageUpdate = Partial<Omit<MarketingMessage, 'id' | 'campaign_id' | 'client_id' | 'client'>>;

// Coupon related types
export interface Coupon {
  id: string;
  title: string;
  code?: string;
  description: string | null;
  discount_percentage: number;
  valid_until: string;
  created_at: string;
  created_by: string;
  assigned_count?: number;
  redeemed_count?: number;
}

export type CouponCreate = Omit<Coupon, 'id' | 'created_at' | 'assigned_count' | 'redeemed_count'>;
export type CouponUpdate = Partial<Omit<Coupon, 'id' | 'created_at' | 'created_by' | 'assigned_count' | 'redeemed_count'>>;

// Coupon assignment related types
export interface CouponAssignment {
  id: string;
  coupon_id: string;
  client_id: string;
  assigned_at: string;
  redeemed: boolean;
  redeemed_at?: string | null;
  coupon?: Coupon;
  client?: {
    id: string;
    full_name: string;
    email: string;
    phone_number: string;
  };
}

export type CouponAssignmentCreate = Omit<CouponAssignment, 'id' | 'assigned_at' | 'redeemed_at' | 'coupon' | 'client'>;
export type CouponAssignmentUpdate = Pick<CouponAssignment, 'redeemed' | 'redeemed_at'>;

// Analytics related types
export interface CampaignAnalytics {
  campaign_id: string;
  total_messages: number;
  delivered: number;
  opened: number;
  clicked: number;
  failed: number;
  delivery_rate: number;
  open_rate: number;
  click_rate: number;
}

export interface MarketingStats {
  total_campaigns: number;
  total_templates: number;
  total_messages: number;
  active_coupons: number;
  redeemed_coupons: number;
  monthly_stats: {
    month: string;
    campaigns: number;
    messages: number;
    opens: number;
    clicks: number;
  }[];
}
