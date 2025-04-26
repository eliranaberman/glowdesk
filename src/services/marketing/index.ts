export * from './templateService';
export * from './campaignService';
export * from './messageService';
export * from './couponService';

import { populateMarketingSamples } from '@/utils/marketingSamples';

export const initializeMarketingData = async () => {
  try {
    // Check if we already have data
    const existingTemplates = await getTemplates();
    const existingCampaigns = await getCampaigns();
    
    if (existingTemplates.length === 0 || existingCampaigns.length === 0) {
      await populateMarketingSamples();
    }
  } catch (error) {
    console.error('Error initializing marketing data:', error);
  }
};
