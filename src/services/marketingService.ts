import { supabase } from '@/integrations/supabase/client';
import {
  MarketingTemplate, MarketingTemplateCreate, MarketingTemplateUpdate,
  MarketingCampaign, MarketingCampaignCreate, MarketingCampaignUpdate,
  MarketingMessage, MarketingMessageCreate, MarketingMessageUpdate,
  Coupon, CouponCreate, CouponUpdate,
  CouponAssignment, CouponAssignmentCreate, CouponAssignmentUpdate,
  CampaignAnalytics, MarketingStats, CampaignStatus, MessageStatus
} from '@/types/marketing';
import { Client } from '@/types/clients';

// Template services
export const getTemplates = async (): Promise<MarketingTemplate[]> => {
  try {
    const { data, error } = await supabase
      .from('marketing_templates')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching templates:', error);
    throw error;
  }
};

export const getTemplateById = async (id: string): Promise<MarketingTemplate | null> => {
  try {
    const { data, error } = await supabase
      .from('marketing_templates')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error fetching template ${id}:`, error);
    throw error;
  }
};

export const createTemplate = async (template: MarketingTemplateCreate): Promise<MarketingTemplate> => {
  try {
    const { data, error } = await supabase
      .from('marketing_templates')
      .insert(template)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating template:', error);
    throw error;
  }
};

export const updateTemplate = async (id: string, updates: MarketingTemplateUpdate): Promise<MarketingTemplate> => {
  try {
    const { data, error } = await supabase
      .from('marketing_templates')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error updating template ${id}:`, error);
    throw error;
  }
};

export const deleteTemplate = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('marketing_templates')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error(`Error deleting template ${id}:`, error);
    throw error;
  }
};

// Campaign services
export const getCampaigns = async (): Promise<MarketingCampaign[]> => {
  try {
    const { data, error } = await supabase
      .from('marketing_campaigns')
      .select(`
        *,
        template:template_id(id, title)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    // Cast the status to CampaignStatus since we know the values match
    return (data || []).map(campaign => ({
      ...campaign,
      status: campaign.status as CampaignStatus
    }));
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    throw error;
  }
};

export const getCampaignById = async (id: string): Promise<MarketingCampaign | null> => {
  try {
    const { data, error } = await supabase
      .from('marketing_campaigns')
      .select(`
        *,
        template:template_id(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (data) {
      return {
        ...data,
        status: data.status as CampaignStatus
      };
    }
    return null;
  } catch (error) {
    console.error(`Error fetching campaign ${id}:`, error);
    throw error;
  }
};

export const createCampaign = async (campaign: MarketingCampaignCreate): Promise<MarketingCampaign> => {
  try {
    const { data, error } = await supabase
      .from('marketing_campaigns')
      .insert(campaign)
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      status: data.status as CampaignStatus
    };
  } catch (error) {
    console.error('Error creating campaign:', error);
    throw error;
  }
};

export const updateCampaign = async (id: string, updates: MarketingCampaignUpdate): Promise<MarketingCampaign> => {
  try {
    const { data, error } = await supabase
      .from('marketing_campaigns')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      status: data.status as CampaignStatus
    };
  } catch (error) {
    console.error(`Error updating campaign ${id}:`, error);
    throw error;
  }
};

export const deleteCampaign = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('marketing_campaigns')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error(`Error deleting campaign ${id}:`, error);
    throw error;
  }
};

// Message services
export const getMessagesByCampaignId = async (campaignId: string): Promise<MarketingMessage[]> => {
  try {
    const { data, error } = await supabase
      .from('marketing_messages')
      .select(`
        *,
        client:client_id(id, full_name, email, phone_number)
      `)
      .eq('campaign_id', campaignId)
      .order('sent_at', { ascending: false });

    if (error) throw error;
    // Cast the status to MessageStatus
    return (data || []).map(message => ({
      ...message,
      status: message.status as MessageStatus
    }));
  } catch (error) {
    console.error(`Error fetching messages for campaign ${campaignId}:`, error);
    throw error;
  }
};

// Coupon services
export const getCoupons = async (): Promise<Coupon[]> => {
  try {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    // Explicitly cast to Coupon[] and ensure code is always a string
    return (data || []).map(coupon => ({
      ...coupon,
      code: coupon.code ?? '' // Use nullish coalescing to provide empty string if null/undefined
    } as Coupon));
  } catch (error) {
    console.error('Error fetching coupons:', error);
    throw error;
  }
};

export const createCoupon = async (coupon: CouponCreate): Promise<Coupon> => {
  try {
    const { data, error } = await supabase
      .from('coupons')
      .insert(coupon)
      .select()
      .single();

    if (error) throw error;
    // Explicitly cast to Coupon and ensure code is always a string
    return {
      ...data,
      code: data.code ?? '' // Use nullish coalescing to provide empty string if null/undefined
    } as Coupon;
  } catch (error) {
    console.error('Error creating coupon:', error);
    throw error;
  }
};

export const assignCouponToClients = async (
  couponId: string, 
  clientIds: string[]
): Promise<CouponAssignment[]> => {
  try {
    const assignments = clientIds.map(clientId => ({
      coupon_id: couponId,
      client_id: clientId,
      redeemed: false
    }));

    const { data, error } = await supabase
      .from('coupon_assignments')
      .insert(assignments)
      .select();

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error(`Error assigning coupon ${couponId} to clients:`, error);
    throw error;
  }
};

// Marketing analytics
export const getMarketingStats = async (): Promise<MarketingStats> => {
  try {
    // Get campaign count
    const { count: campaignCount } = await supabase
      .from('marketing_campaigns')
      .select('*', { count: 'exact', head: true });

    // Get template count
    const { count: templateCount } = await supabase
      .from('marketing_templates')
      .select('*', { count: 'exact', head: true });

    // Get message count
    const { count: messageCount } = await supabase
      .from('marketing_messages')
      .select('*', { count: 'exact', head: true });

    // Get active coupon count (valid_until > now)
    const { count: activeCouponCount } = await supabase
      .from('coupons')
      .select('*', { count: 'exact', head: true })
      .gt('valid_until', new Date().toISOString());

    // Get redeemed coupon count
    const { count: redeemedCouponCount } = await supabase
      .from('coupon_assignments')
      .select('*', { count: 'exact', head: true })
      .eq('redeemed', true);

    // Generate monthly stats for the last 6 months
    const monthlyStats = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      
      const monthStart = month.toISOString();
      const monthEnd = nextMonth.toISOString();
      
      // Campaigns in this month
      const { count: monthCampaigns } = await supabase
        .from('marketing_campaigns')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', monthStart)
        .lt('created_at', monthEnd);
      
      // Messages in this month
      const { count: monthMessages } = await supabase
        .from('marketing_messages')
        .select('*', { count: 'exact', head: true })
        .gte('sent_at', monthStart)
        .lt('sent_at', monthEnd);
      
      monthlyStats.push({
        month: month.toLocaleDateString('he-IL', { month: 'long', year: 'numeric' }),
        campaigns: monthCampaigns || 0,
        messages: monthMessages || 0,
        opens: 0,
        clicks: 0
      });
    }

    return {
      total_campaigns: campaignCount || 0,
      total_templates: templateCount || 0,
      total_messages: messageCount || 0,
      active_coupons: activeCouponCount || 0,
      redeemed_coupons: redeemedCouponCount || 0,
      monthly_stats: monthlyStats
    };
  } catch (error) {
    console.error('Error getting marketing stats:', error);
    throw error;
  }
};

export const sendCampaign = async (campaignId: string): Promise<boolean> => {
  try {
    // Update campaign status to sent
    await updateCampaign(campaignId, { status: 'sent' });
    
    return true;
  } catch (error) {
    console.error(`Error sending campaign ${campaignId}:`, error);
    throw error;
  }
};
