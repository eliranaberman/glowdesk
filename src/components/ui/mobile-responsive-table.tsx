
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileResponsiveTableProps {
  children: React.ReactNode;
  mobileComponent: React.ReactNode;
  className?: string;
}

const MobileResponsiveTable = ({ 
  children, 
  mobileComponent, 
  className = "" 
}: MobileResponsiveTableProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className={`mobile-table-container ${className}`}>
        {mobileComponent}
      </div>
    );
  }

  return (
    <div className={`desktop-table-container ${className}`}>
      {children}
    </div>
  );
};

export default MobileResponsiveTable;
