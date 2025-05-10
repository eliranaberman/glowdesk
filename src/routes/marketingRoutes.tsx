
import { RouteObject } from 'react-router-dom';
import MarketingPage from '../pages/marketing/MarketingPage';
import MarketingTemplates from '../pages/marketing/MarketingTemplates';
import NewTemplateForm from '../pages/marketing/NewTemplateForm';
import EditTemplateForm from '../pages/marketing/EditTemplateForm';
import NewCampaignForm from '../pages/marketing/NewCampaignForm';
import EditCampaignForm from '../pages/marketing/EditCampaignForm';
import SocialMedia from '../pages/SocialMedia';
import SocialMediaMeta from '../pages/SocialMediaMeta';

export const marketingRoutes: RouteObject[] = [
  {
    path: '/social-media',
    element: <SocialMedia />,
  },
  {
    path: '/social-media/meta',
    element: <SocialMediaMeta />,
  },
  {
    path: '/marketing',
    element: <MarketingPage />,
  },
  {
    path: '/marketing/templates',
    element: <MarketingTemplates />,
  },
  {
    path: '/marketing/templates/new',
    element: <NewTemplateForm />,
  },
  {
    path: '/marketing/templates/:id',
    element: <EditTemplateForm />,
  },
  {
    path: '/marketing/campaigns/new',
    element: <NewCampaignForm />,
  },
  {
    path: '/marketing/campaigns/:id',
    element: <EditCampaignForm />,
  },
];
