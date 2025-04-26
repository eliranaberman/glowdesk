
export * from './templateService';
export * from './campaignService';
export * from './messageService';
export * from './couponService';

import { getTemplates } from './templateService';
import { getCampaigns } from './campaignService';
import { populateMarketingSamples } from '@/utils/marketingSamples';

export const initializeMarketingData = async () => {
  try {
    console.log('Initializing marketing data...');
    
    // Check if we already have data
    const existingTemplates = await getTemplates();
    const existingCampaigns = await getCampaigns();
    
    console.log(`Found ${existingTemplates.length} templates and ${existingCampaigns.length} campaigns`);
    
    // If either templates or campaigns are empty, populate them
    if (existingTemplates.length === 0 || existingCampaigns.length === 0) {
      console.log('Populating marketing samples...');
      await populateMarketingSamples();
      console.log('Marketing samples populated successfully');
    }
  } catch (error) {
    console.error('Error initializing marketing data:', error);
  }
};
