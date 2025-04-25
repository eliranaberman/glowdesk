
// This file re-exports all marketing services from their new locations
// to maintain backward compatibility with existing imports

export {
  getTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate
} from './marketing/templateService';

export {
  getCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  sendCampaign
} from './marketing/campaignService';

export {
  getMessagesByCampaignId
} from './marketing/messageService';

export {
  getCoupons,
  createCoupon,
  assignCouponToClients
} from './marketing/couponService';

// Mock implementation for getMarketingStats since it's not part of the refactored files yet
export const getMarketingStats = async () => {
  return {
    total_campaigns: 12,
    total_templates: 8,
    total_messages: 450,
    active_coupons: 5,
    redeemed_coupons: 120,
    monthly_stats: [
      {
        month: 'Jan',
        campaigns: 1,
        messages: 30,
        opens: 25,
        clicks: 10
      },
      {
        month: 'Feb',
        campaigns: 2,
        messages: 45,
        opens: 35,
        clicks: 15
      },
      {
        month: 'Mar',
        campaigns: 3,
        messages: 60,
        opens: 50,
        clicks: 20
      }
    ]
  };
};
