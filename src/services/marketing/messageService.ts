
import { supabase } from '@/integrations/supabase/client';
import { MarketingMessage, MessageStatus } from '@/types/marketing';

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
    return (data || []).map(message => ({
      ...message,
      status: message.status as MessageStatus
    }));
  } catch (error) {
    console.error(`Error fetching messages for campaign ${campaignId}:`, error);
    throw error;
  }
};
