
import { createCampaign } from '@/services/marketing/campaignService';
import { createCoupon } from '@/services/marketing/couponService';
import { getTemplates } from '@/services/marketing/templateService';
import { MarketingCampaignCreate, CouponCreate } from '@/types/marketing';

const sampleCampaigns: MarketingCampaignCreate[] = [
  {
    name: "קמפיין קיץ 2024",
    status: "draft",
    scheduled_at: "2024-06-01T10:00:00",
    created_by: "system",
    template_id: "" // Will be set dynamically
  },
  {
    name: "מבצע חזרה מחופשה",
    status: "scheduled",
    scheduled_at: "2024-08-15T09:00:00",
    created_by: "system",
    template_id: "" // Will be set dynamically
  },
  {
    name: "קמפיין חגים תשפ״ה",
    status: "draft",
    scheduled_at: "2024-09-01T10:00:00",
    created_by: "system",
    template_id: "" // Will be set dynamically
  },
  {
    name: "מבצע סוף שנה 2024",
    status: "draft",
    scheduled_at: "2024-12-15T09:00:00",
    created_by: "system",
    template_id: "" // Will be set dynamically
  }
];

const sampleCoupons: CouponCreate[] = [
  {
    title: "הנחת היכרות ללקוחות חדשות",
    code: "WELCOME25",
    discount_percentage: 25,
    description: "25% הנחה על הטיפול הראשון - תקף לחודש מיום ההנפקה",
    valid_until: "2024-12-31",
    created_by: "system"
  },
  {
    title: "מבצע יום הולדת",
    code: "BIRTHDAY40",
    discount_percentage: 40,
    description: "40% הנחה על כל הטיפולים - תקף בחודש יום ההולדת",
    valid_until: "2024-12-31",
    created_by: "system"
  },
  {
    title: "חבילת VIP זוגית",
    code: "VIPFRIENDS",
    discount_percentage: 30,
    description: "30% הנחה על טיפול זוגי - הטבה מיוחדת לחברות מועדון",
    valid_until: "2024-12-31",
    created_by: "system"
  },
  {
    title: "הטבת חברה מביאה חברה",
    code: "FRIEND50",
    discount_percentage: 50,
    description: "50% הנחה ללקוחה חדשה בהמלצת לקוחה קיימת",
    valid_until: "2024-12-31",
    created_by: "system"
  },
  {
    title: "מבצע השקה מיוחד",
    code: "LAUNCH35",
    discount_percentage: 35,
    description: "35% הנחה על כל השירותים - מבצע השקה חד פעמי",
    valid_until: "2024-12-31",
    created_by: "system"
  }
];

export const populateMarketingSamples = async () => {
  try {
    // First create all coupons
    for (const coupon of sampleCoupons) {
      await createCoupon(coupon);
    }
    
    // Then create campaigns and link them to templates
    const templates = await getTemplates();
    
    if (templates.length >= sampleCampaigns.length) {
      for (let i = 0; i < sampleCampaigns.length; i++) {
        const campaign = {
          ...sampleCampaigns[i],
          template_id: templates[i].id
        };
        await createCampaign(campaign);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error populating marketing samples:', error);
    return false;
  }
};
