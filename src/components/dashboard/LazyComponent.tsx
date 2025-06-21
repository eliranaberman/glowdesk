
import React from 'react';
import { useLazyLoading } from '@/hooks/use-lazy-loading';
import { SkeletonCard } from '@/components/ui/skeleton';

interface LazyComponentProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  threshold?: number;
  className?: string;
}

const LazyComponent: React.FC<LazyComponentProps> = ({ 
  children, 
  fallback = <SkeletonCard />, 
  threshold = 0.1,
  className = ""
}) => {
  const { elementRef, isVisible } = useLazyLoading(threshold);

  return (
    <div ref={elementRef} className={className}>
      {isVisible ? children : fallback}
    </div>
  );
};

export default LazyComponent;
