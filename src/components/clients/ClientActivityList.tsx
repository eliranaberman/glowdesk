
import { ClientActivity } from '@/types/clients';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, MessageSquare, ShoppingBag, User } from 'lucide-react';
import { Badge } from '../ui/badge';

interface ClientActivityListProps {
  activities: ClientActivity[];
}

const ClientActivityList = ({ activities }: ClientActivityListProps) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'call':
        return <Phone className="size-4" />;
      case 'message':
        return <MessageSquare className="size-4" />;
      case 'purchase':
        return <ShoppingBag className="size-4" />;
      case 'visit':
        return <User className="size-4" />;
      default:
        return null;
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

  if (activities.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <p>אין פעילויות לקוח עדיין</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex gap-4 pb-4 border-b last:border-0 border-border/30">
          <div className="pt-1">
            <Avatar className="size-10">
              <AvatarImage 
                src={activity.created_by_user?.avatar_url} 
                alt={activity.created_by_user?.full_name || ''}
              />
              <AvatarFallback className="text-xs">
                {activity.created_by_user?.full_name?.[0] || '?'}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">
                    {activity.created_by_user?.full_name || 'משתמש לא ידוע'}
                  </p>
                  <Badge variant={getActivityBadgeVariant(activity.type)} className="flex gap-1 items-center">
                    {getActivityIcon(activity.type)}
                    {getActivityTypeLabel(activity.type)}
                  </Badge>
                </div>
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

export default ClientActivityList;
