
import { supabase } from '@/lib/supabase';
import {
  MarketingTemplate, MarketingTemplateCreate, MarketingTemplateUpdate,
  MarketingCampaign, MarketingCampaignCreate, MarketingCampaignUpdate,
  MarketingMessage, MarketingMessageCreate, MarketingMessageUpdate,
  Coupon, CouponCreate, CouponUpdate,
  CouponAssignment, CouponAssignmentCreate, CouponAssignmentUpdate,
  CampaignAnalytics, MarketingStats
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

    // Get message counts for each campaign
    const campaignsWithCounts = await Promise.all(
      (data || []).map(async (campaign) => {
        const { count: total } = await supabase
          .from('marketing_messages')
          .select('*', { count: 'exact', head: true })
          .eq('campaign_id', campaign.id);

        const { count: delivered } = await supabase
          .from('marketing_messages')
          .select('*', { count: 'exact', head: true })
          .eq('campaign_id', campaign.id)
          .in('status', ['delivered', 'opened', 'clicked']);

        const { count: opened } = await supabase
          .from('marketing_messages')
          .select('*', { count: 'exact', head: true })
          .eq('campaign_id', campaign.id)
          .in('status', ['opened', 'clicked']);

        const { count: clicked } = await supabase
          .from('marketing_messages')
          .select('*', { count: 'exact', head: true })
          .eq('campaign_id', campaign.id)
          .eq('status', 'clicked');

        const { count: failed } = await supabase
          .from('marketing_messages')
          .select('*', { count: 'exact', head: true })
          .eq('campaign_id', campaign.id)
          .eq('status', 'failed');

        return {
          ...campaign,
          messages_count: total || 0,
          delivered_count: delivered || 0,
          opened_count: opened || 0,
          clicked_count: clicked || 0,
          failed_count: failed || 0
        };
      })
    );

    return campaignsWithCounts;
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
      // Get message counts
      const { count: total } = await supabase
        .from('marketing_messages')
        .select('*', { count: 'exact', head: true })
        .eq('campaign_id', id);

      const { count: delivered } = await supabase
        .from('marketing_messages')
        .select('*', { count: 'exact', head: true })
        .eq('campaign_id', id)
        .in('status', ['delivered', 'opened', 'clicked']);

      const { count: opened } = await supabase
        .from('marketing_messages')
        .select('*', { count: 'exact', head: true })
        .eq('campaign_id', id)
        .in('status', ['opened', 'clicked']);

      const { count: clicked } = await supabase
        .from('marketing_messages')
        .select('*', { count: 'exact', head: true })
        .eq('campaign_id', id)
        .eq('status', 'clicked');

      const { count: failed } = await supabase
        .from('marketing_messages')
        .select('*', { count: 'exact', head: true })
        .eq('campaign_id', id)
        .eq('status', 'failed');

      return {
        ...data,
        messages_count: total || 0,
        delivered_count: delivered || 0,
        opened_count: opened || 0,
        clicked_count: clicked || 0,
        failed_count: failed || 0
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
    return data;
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
    return data;
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
    return data || [];
  } catch (error) {
    console.error(`Error fetching messages for campaign ${campaignId}:`, error);
    throw error;
  }
};

export const createMessage = async (message: MarketingMessageCreate): Promise<MarketingMessage> => {
  try {
    const { data, error } = await supabase
      .from('marketing_messages')
      .insert(message)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating message:', error);
    throw error;
  }
};

export const updateMessage = async (id: string, updates: MarketingMessageUpdate): Promise<MarketingMessage> => {
  try {
    const { data, error } = await supabase
      .from('marketing_messages')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error updating message ${id}:`, error);
    throw error;
  }
};

export const deleteMessage = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('marketing_messages')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error(`Error deleting message ${id}:`, error);
    throw error;
  }
};

// Campaign execution functions
export const createCampaignMessages = async (
  campaignId: string, 
  clientIds: string[], 
  templateContent: string
): Promise<void> => {
  try {
    const messages = clientIds.map(clientId => ({
      campaign_id: campaignId,
      client_id: clientId,
      status: 'pending' as const,
      sent_at: null,
      error_message: null
    }));

    const { error } = await supabase
      .from('marketing_messages')
      .insert(messages);

    if (error) throw error;
  } catch (error) {
    console.error(`Error creating messages for campaign ${campaignId}:`, error);
    throw error;
  }
};

export const sendCampaign = async (campaignId: string): Promise<boolean> => {
  try {
    // 1. Get the campaign
    const campaign = await getCampaignById(campaignId);
    if (!campaign || !campaign.template) {
      throw new Error('Campaign or template not found');
    }

    // 2. Get all pending messages for this campaign
    const { data: messages, error } = await supabase
      .from('marketing_messages')
      .select(`
        *,
        client:client_id(id, full_name, email, phone_number)
      `)
      .eq('campaign_id', campaignId)
      .eq('status', 'pending');

    if (error) throw error;
    
    // In a real application, you would use a messaging service like Twilio, SendGrid, etc.
    // For demonstration purposes, we'll simulate sending by updating the status
    
    // 3. Update campaign status to sending
    await updateCampaign(campaignId, { status: 'sent' });
    
    // 4. Mark all messages as sent
    const currentTime = new Date().toISOString();
    
    // In a real app, you would batch these updates or use a more efficient method
    await Promise.all((messages || []).map(async (message) => {
      // Simulate some messages failing randomly
      const success = Math.random() > 0.05; // 5% chance of failure
      
      await updateMessage(message.id, {
        status: success ? 'sent' : 'failed',
        sent_at: currentTime,
        error_message: success ? null : 'Simulated delivery failure'
      });
    }));

    return true;
  } catch (error) {
    console.error(`Error sending campaign ${campaignId}:`, error);
    
    // Update campaign status to failed
    await updateCampaign(campaignId, { status: 'failed' });
    
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

    // Get assignment counts for each coupon
    const couponsWithCounts = await Promise.all(
      (data || []).map(async (coupon) => {
        const { count: assigned } = await supabase
          .from('coupon_assignments')
          .select('*', { count: 'exact', head: true })
          .eq('coupon_id', coupon.id);

        const { count: redeemed } = await supabase
          .from('coupon_assignments')
          .select('*', { count: 'exact', head: true })
          .eq('coupon_id', coupon.id)
          .eq('redeemed', true);

        return {
          ...coupon,
          assigned_count: assigned || 0,
          redeemed_count: redeemed || 0
        };
      })
    );

    return couponsWithCounts;
  } catch (error) {
    console.error('Error fetching coupons:', error);
    throw error;
  }
};

export const getCouponById = async (id: string): Promise<Coupon | null> => {
  try {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (data) {
      const { count: assigned } = await supabase
        .from('coupon_assignments')
        .select('*', { count: 'exact', head: true })
        .eq('coupon_id', id);

      const { count: redeemed } = await supabase
        .from('coupon_assignments')
        .select('*', { count: 'exact', head: true })
        .eq('coupon_id', id)
        .eq('redeemed', true);

      return {
        ...data,
        assigned_count: assigned || 0,
        redeemed_count: redeemed || 0
      };
    }

    return null;
  } catch (error) {
    console.error(`Error fetching coupon ${id}:`, error);
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
    return data;
  } catch (error) {
    console.error('Error creating coupon:', error);
    throw error;
  }
};

export const updateCoupon = async (id: string, updates: CouponUpdate): Promise<Coupon> => {
  try {
    const { data, error } = await supabase
      .from('coupons')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error updating coupon ${id}:`, error);
    throw error;
  }
};

export const deleteCoupon = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('coupons')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error(`Error deleting coupon ${id}:`, error);
    throw error;
  }
};

// Coupon assignment services
export const getCouponAssignments = async (couponId: string): Promise<CouponAssignment[]> => {
  try {
    const { data, error } = await supabase
      .from('coupon_assignments')
      .select(`
        *,
        client:client_id(id, full_name, email, phone_number)
      `)
      .eq('coupon_id', couponId)
      .order('assigned_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error(`Error fetching assignments for coupon ${couponId}:`, error);
    throw error;
  }
};

export const getClientCoupons = async (clientId: string): Promise<CouponAssignment[]> => {
  try {
    const { data, error } = await supabase
      .from('coupon_assignments')
      .select(`
        *,
        coupon:coupon_id(*)
      `)
      .eq('client_id', clientId)
      .order('assigned_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error(`Error fetching coupons for client ${clientId}:`, error);
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

export const redeemCoupon = async (assignmentId: string): Promise<CouponAssignment> => {
  try {
    const { data, error } = await supabase
      .from('coupon_assignments')
      .update({
        redeemed: true,
        redeemed_at: new Date().toISOString()
      })
      .eq('id', assignmentId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error redeeming coupon assignment ${assignmentId}:`, error);
    throw error;
  }
};

// Analytics functions
export const getCampaignAnalytics = async (campaignId: string): Promise<CampaignAnalytics> => {
  try {
    const campaign = await getCampaignById(campaignId);
    if (!campaign) {
      throw new Error('Campaign not found');
    }

    return {
      campaign_id: campaignId,
      total_messages: campaign.messages_count || 0,
      delivered: campaign.delivered_count || 0,
      opened: campaign.opened_count || 0,
      clicked: campaign.clicked_count || 0,
      failed: campaign.failed_count || 0,
      delivery_rate: campaign.messages_count ? (campaign.delivered_count || 0) / campaign.messages_count : 0,
      open_rate: campaign.delivered_count ? (campaign.opened_count || 0) / campaign.delivered_count : 0,
      click_rate: campaign.opened_count ? (campaign.clicked_count || 0) / campaign.opened_count : 0
    };
  } catch (error) {
    console.error(`Error getting analytics for campaign ${campaignId}:`, error);
    throw error;
  }
};

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
      
      // Opens in this month
      const { count: monthOpens } = await supabase
        .from('marketing_messages')
        .select('*', { count: 'exact', head: true })
        .gte('opened_at', monthStart)
        .lt('opened_at', monthEnd)
        .not('opened_at', 'is', null);
      
      // Clicks in this month
      const { count: monthClicks } = await supabase
        .from('marketing_messages')
        .select('*', { count: 'exact', head: true })
        .gte('clicked_at', monthStart)
        .lt('clicked_at', monthEnd)
        .not('clicked_at', 'is', null);
      
      monthlyStats.push({
        month: month.toLocaleDateString('he-IL', { month: 'long', year: 'numeric' }),
        campaigns: monthCampaigns || 0,
        messages: monthMessages || 0,
        opens: monthOpens || 0,
        clicks: monthClicks || 0
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

// Helper function to process template content with client data
export const processTemplateContent = (content: string, client: Client): string => {
  let processedContent = content;
  
  // Replace common placeholder patterns
  processedContent = processedContent.replace(/{{שם}}/g, client.full_name || '');
  processedContent = processedContent.replace(/{{אימייל}}/g, client.email || '');
  processedContent = processedContent.replace(/{{טלפון}}/g, client.phone_number || '');
  
  // Handle other dynamic content - this would be expanded in a real application
  processedContent = processedContent.replace(/{{טיפול}}/g, 'טיפול');
  processedContent = processedContent.replace(/{{שעה}}/g, '12:00');
  processedContent = processedContent.replace(/{{הנחה}}/g, '15');
  processedContent = processedContent.replace(/{{הטבה}}/g, 'טיפול חינם');
  processedContent = processedContent.replace(/{{שם_החג}}/g, 'פסח');
  processedContent = processedContent.replace(/{{לינק}}/g, 'https://example.com/appointment');
  
  return processedContent;
};
