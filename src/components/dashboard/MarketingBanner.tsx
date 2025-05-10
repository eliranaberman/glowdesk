
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface MarketingBannerProps {
  title: string;
  description: string;
  buttonText: string;
  linkTo: string;
  gradientFrom: string;
  gradientTo: string;
  borderColor: string;
}

const MarketingBanner = ({
  title,
  description,
  buttonText,
  linkTo,
  gradientFrom,
  gradientTo,
  borderColor,
}: MarketingBannerProps) => {
  const isMobile = useIsMobile();

  return (
    <div className={`bg-gradient-to-r from-${gradientFrom} to-${gradientTo} border border-${borderColor} rounded-xl p-4 md:p-6 shadow-soft`}>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
        <div className="mb-4 md:mb-0">
          <h2 className="text-lg md:text-xl font-display font-medium text-deepNavy mb-2">{title}</h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
            {description}
          </p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <Link to={linkTo} className="w-full md:w-auto">
            <Button variant="warm" size={isMobile ? "default" : "lg"} className="font-display w-full md:w-auto">
              {buttonText}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MarketingBanner;
