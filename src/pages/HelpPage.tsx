
import { Helmet } from 'react-helmet-async';
import { HelpContent } from '@/components/help/HelpContent';

const HelpPage = () => {
  return (
    <>
      <Helmet>
        <title>עזרה ומדריכים | GlowDesk</title>
      </Helmet>
      <HelpContent />
    </>
  );
};

export default HelpPage;
