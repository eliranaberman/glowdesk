
import { supabase } from '@/integrations/supabase/client';
import { MarketingCampaign, MarketingCampaignCreate, MarketingCampaignUpdate, CampaignStatus } from '@/types/marketing';

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

export const sendCampaign = async (campaignId: string): Promise<boolean> => {
  try {
    await updateCampaign(campaignId, { status: 'sent' });
    return true;
  } catch (error) {
    console.error(`Error sending campaign ${campaignId}:`, error);
    throw error;
  }
};
