
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import MetaDashboard from '@/components/social-media/meta/MetaDashboard';
import PermissionGuard from '@/components/auth/PermissionGuard';

const SocialMediaMeta = () => {
  return (
    <PermissionGuard>
      <Layout>
        <Helmet>
          <title>חיבור Meta API | GlowDesk</title>
        </Helmet>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-center">ניהול חשבונות Meta</h1>
          <MetaDashboard />
        </div>
      </Layout>
    </PermissionGuard>
  );
};

export default SocialMediaMeta;
