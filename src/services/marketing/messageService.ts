
import { supabase } from '@/integrations/supabase/client';
import { MarketingStats, MarketingMessage, MarketingMessageCreate, MarketingMessageUpdate, MessageStatus } from '@/types/marketing';

export const getMarketingMessages = async (campaignId: string): Promise<MarketingMessage[]> => {
  try {
    const { data, error } = await supabase
      .from('marketing_messages')
      .select(`
        *,
        client:clients(id, full_name, email, phone_number)
      `)
      .eq('campaign_id', campaignId)
      .order('sent_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(message => ({
      ...message,
      status: message.status as MessageStatus
    }));
  } catch (error) {
    console.error('Error fetching marketing messages:', error);
    throw error;
  }
};

export const createMarketingMessage = async (message: MarketingMessageCreate): Promise<MarketingMessage> => {
  try {
    const { data, error } = await supabase
      .from('marketing_messages')
      .insert(message)
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      status: data.status as MessageStatus
    };
  } catch (error) {
    console.error('Error creating marketing message:', error);
    throw error;
  }
};

export const updateMarketingMessage = async (id: string, updates: MarketingMessageUpdate): Promise<MarketingMessage> => {
  try {
    const { data, error } = await supabase
      .from('marketing_messages')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      status: data.status as MessageStatus
    };
  } catch (error) {
    console.error(`Error updating marketing message ${id}:`, error);
    throw error;
  }
};

export const getMarketingStats = async (): Promise<MarketingStats> => {
  try {
    // Get templates count
    const { count: templatesCount, error: templatesError } = await supabase
      .from('marketing_templates')
      .select('*', { count: 'exact', head: true });

    if (templatesError) throw templatesError;

    // Get campaigns count
    const { count: campaignsCount, error: campaignsError } = await supabase
      .from('marketing_campaigns')
      .select('*', { count: 'exact', head: true });

    if (campaignsError) throw campaignsError;

    // Get messages count
    const { count: messagesCount, error: messagesError } = await supabase
      .from('marketing_messages')
      .select('*', { count: 'exact', head: true });

    if (messagesError) throw messagesError;

    // Get coupons counts
    const { count: activeCouponsCount, error: activeCouponsError } = await supabase
      .from('coupons')
      .select('*', { count: 'exact', head: true })
      .gt('valid_until', new Date().toISOString());

    if (activeCouponsError) throw activeCouponsError;

    const { count: redeemedCouponsCount, error: redeemedCouponsError } = await supabase
      .from('coupon_assignments')
      .select('*', { count: 'exact', head: true })
      .eq('redeemed', true);

    if (redeemedCouponsError) throw redeemedCouponsError;

    // Generate monthly stats for the last 6 months
    const monthlyStats = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      const monthName = month.toLocaleString('default', { month: 'long' });
      
      // Sample data - in a real application, these would be queried from the database
      const campaigns = Math.floor(Math.random() * 5) + 1;
      const messages = Math.floor(Math.random() * 50) + campaigns * 10;
      const opens = Math.floor(messages * (0.4 + Math.random() * 0.3));
      const clicks = Math.floor(opens * (0.2 + Math.random() * 0.2));
      
      monthlyStats.push({
        month: monthName,
        campaigns,
        messages,
        opens,
        clicks
      });
    }

    return {
      total_templates: templatesCount || 0,
      total_campaigns: campaignsCount || 0,
      total_messages: messagesCount || 0,
      active_coupons: activeCouponsCount || 0,
      redeemed_coupons: redeemedCouponsCount || 0,
      monthly_stats: monthlyStats
    };
  } catch (error) {
    console.error('Error fetching marketing stats:', error);
    // Return empty stats object on error
    return {
      total_templates: 0,
      total_campaigns: 0,
      total_messages: 0,
      active_coupons: 0,
      redeemed_coupons: 0,
      monthly_stats: []
    };
  }
};
