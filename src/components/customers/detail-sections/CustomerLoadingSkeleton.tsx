
import { Skeleton } from '@/components/ui/skeleton';

const CustomerLoadingSkeleton = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-10 w-24" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-[400px] w-full rounded-lg" />
        <Skeleton className="h-[400px] w-full rounded-lg" />
        <Skeleton className="h-[200px] w-full rounded-lg md:col-span-2" />
      </div>
    </div>
  );
};

export default CustomerLoadingSkeleton;
