
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const LoadingFallback = () => (
  <Card className="animate-pulse p-6 bg-card rounded-xl shadow-soft">
    <CardHeader className="pb-4">
      <Skeleton className="h-8 w-48 bg-muted rounded mb-4" />
    </CardHeader>
    <CardContent className="space-y-3">
      <Skeleton className="h-4 bg-muted rounded w-full" />
      <Skeleton className="h-4 bg-muted rounded w-5/6" />
      <Skeleton className="h-4 bg-muted rounded w-3/4" />
    </CardContent>
  </Card>
);

export default LoadingFallback;
