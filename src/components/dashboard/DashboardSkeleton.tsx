
import { SkeletonCard } from '@/components/ui/skeleton';

export const StatsSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {Array.from({ length: 4 }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export const ChartSkeleton = () => (
  <div className="rounded-xl border bg-card text-card-foreground shadow animate-pulse">
    <div className="p-6">
      <div className="space-y-3 mb-4">
        <div className="h-4 bg-muted rounded w-1/3"></div>
        <div className="h-3 bg-muted rounded w-1/2"></div>
      </div>
      <div className="h-64 bg-muted rounded"></div>
    </div>
  </div>
);

export const GridSkeleton = () => (
  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
    <div className="space-y-8">
      <SkeletonCard />
      <SkeletonCard />
    </div>
    <div className="space-y-8">
      <SkeletonCard />
      <SkeletonCard />
    </div>
  </div>
);
