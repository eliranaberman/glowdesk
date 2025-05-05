
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import { Gallery } from '@/components/portfolio/Gallery';
import PermissionGuard from '@/components/auth/PermissionGuard';

const PortfolioPage = () => {
  return (
    <PermissionGuard>
      <Layout>
        <Helmet>
          <title>גלריה | GlowDesk</title>
        </Helmet>
        <Gallery />
      </Layout>
    </PermissionGuard>
  );
};

export default PortfolioPage;
