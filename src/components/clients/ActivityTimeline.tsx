
import { useEffect, useState } from 'react';
import { ClientActivity } from '@/types/clients';
import { getClientActivities } from '@/services/clientService';
import { Skeleton } from '@/components/ui/skeleton';
import { Phone, MessageSquare, ShoppingBag, User } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import UserBadge from './UserBadge';

interface ActivityTimelineProps {
  clientId: string;
}

const ActivityTimeline = ({ clientId }: ActivityTimelineProps) => {
  const [activities, setActivities] = useState<ClientActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const data = await getClientActivities(clientId);
        setActivities(data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching activities:', err);
        setError(err.message || 'Failed to load activities');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [clientId]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'call': return <Phone className="size-4" />;
      case 'message': return <MessageSquare className="size-4" />;
      case 'purchase': return <ShoppingBag className="size-4" />;
      case 'visit': return <User className="size-4" />;
      default: return null;
    }
  };

  const getActivityTypeLabel = (type: string) => {
    switch (type) {
      case 'call': return 'שיחת טלפון';
      case 'message': return 'הודעה';
      case 'purchase': return 'רכישה';
      case 'visit': return 'ביקור';
      default: return type;
    }
  };

  const getActivityBadgeVariant = (type: string) => {
    switch (type) {
      case 'call': return 'secondary';
      case 'message': return 'soft';
      case 'purchase': return 'success';
      case 'visit': return 'warm';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4 text-destructive">
        <p>שגיאה בטעינת פעילויות: {error}</p>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        <p>אין פעילויות לקוח עדיין</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex gap-4 pb-4 border-b last:border-0 border-border/30">
          <div className="pt-1">
            {activity.created_by_user && (
              <UserBadge user={activity.created_by_user} showAvatar={true} />
            )}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap justify-between items-start gap-2">
              <div className="flex items-center gap-2">
                <Badge variant={getActivityBadgeVariant(activity.type)} className="flex gap-1 items-center">
                  {getActivityIcon(activity.type)}
                  {getActivityTypeLabel(activity.type)}
                </Badge>
                <p className="text-xs text-muted-foreground">
                  {/* Use created_at if date field is unavailable */}
                  {format(new Date(activity.created_at || activity.date), 'dd/MM/yyyy HH:mm')}
                </p>
              </div>
            </div>
            <p className="mt-2">{activity.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityTimeline;
