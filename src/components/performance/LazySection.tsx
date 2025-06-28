
import React, { Suspense } from 'react';
import { useLazyLoading } from '@/hooks/use-lazy-loading';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface LazySectionProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  threshold?: number;
  className?: string;
  minHeight?: string;
}

const DefaultSkeleton = () => (
  <Card className="animate-pulse">
    <CardContent className="p-6">
      <div className="space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="grid grid-cols-2 gap-4 mt-6">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const LazySection: React.FC<LazySectionProps> = ({ 
  children, 
  fallback = <DefaultSkeleton />, 
  threshold = 0.1,
  className = "",
  minHeight = "200px"
}) => {
  const { elementRef, isVisible } = useLazyLoading(threshold);

  return (
    <div 
      ref={elementRef} 
      className={className}
      style={{ minHeight: isVisible ? 'auto' : minHeight }}
    >
      <Suspense fallback={fallback}>
        {isVisible ? children : fallback}
      </Suspense>
    </div>
  );
};

export default LazySection;
