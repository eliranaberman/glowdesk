
import { Helmet } from 'react-helmet-async';
import { Gallery } from '@/components/portfolio/Gallery';
import PermissionGuard from '@/components/auth/PermissionGuard';

const PortfolioPage = () => {
  return (
    <PermissionGuard>
      <Helmet>
        <title>גלריה | GlowDesk</title>
      </Helmet>
      <Gallery />
    </PermissionGuard>
  );
};

export default PortfolioPage;
