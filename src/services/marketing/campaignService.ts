
import { supabase } from '@/integrations/supabase/client';
import { MarketingCampaign, MarketingCampaignCreate, MarketingCampaignUpdate, CampaignStatus } from '@/types/marketing';

// Use consistent system UUID for records created by the system
const SYSTEM_USER_ID = '00000000-0000-0000-0000-000000000000';

export const getCampaigns = async (): Promise<MarketingCampaign[]> => {
  try {
    const { data, error } = await supabase
      .from('marketing_campaigns')
      .select(`
        *,
        template:template_id (
          id,
          title,
          content
        )
      `)
      .order('scheduled_at', { ascending: false });

    if (error) throw error;
    
    // Properly cast status to CampaignStatus
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
        template:template_id (
          id,
          title,
          content
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    
    if (!data) return null;
    
    // Properly cast status to CampaignStatus
    return {
      ...data,
      status: data.status as CampaignStatus
    };
  } catch (error) {
    console.error(`Error fetching campaign ${id}:`, error);
    throw error;
  }
};

export const createCampaign = async (campaign: MarketingCampaignCreate): Promise<MarketingCampaign> => {
  try {
    // Ensure created_by is set to system UUID if not provided
    const campaignData = {
      ...campaign,
      created_by: campaign.created_by || SYSTEM_USER_ID
    };

    const { data, error } = await supabase
      .from('marketing_campaigns')
      .insert(campaignData)
      .select('*')
      .single();

    if (error) throw error;
    
    // Properly cast status to CampaignStatus
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
    
    // Properly cast status to CampaignStatus
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

export const sendCampaign = async (id: string): Promise<void> => {
  try {
    // Update campaign status to sent
    const { error: updateError } = await supabase
      .from('marketing_campaigns')
      .update({ status: 'sent' })
      .eq('id', id);

    if (updateError) throw updateError;
    
    // In a real application, here you would call a backend function to actually send the messages
    console.log(`Campaign ${id} marked as sent. In a real application, messages would be sent here.`);
  } catch (error) {
    console.error(`Error sending campaign ${id}:`, error);
    throw error;
  }
};
