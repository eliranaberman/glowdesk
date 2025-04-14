
import { useState } from 'react';
import { Client } from '@/types/clients';
import { format } from 'date-fns';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Phone, MessageSquare, Edit } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ActivityTimeline from './ActivityTimeline';
import UserBadge from './UserBadge';
import { useNavigate } from 'react-router-dom';

interface ClientCardProps {
  client: Client;
  expanded?: boolean;
}

const ClientCard = ({ client, expanded = false }: ClientCardProps) => {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const navigate = useNavigate();

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'lead': return 'warm';
      case 'inactive': return 'destructive';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'פעיל';
      case 'lead': return 'ליד';
      case 'inactive': return 'לא פעיל';
      default: return status;
    }
  };

  const getAvatarFallback = (name: string) => {
    if (!name) return '?';
    const nameParts = name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
  };

  const handleEditClient = () => {
    navigate(`/clients/edit/${client.id}`);
  };

  const handleAddActivity = () => {
    navigate(`/clients/${client.id}/activity/new`);
  };

  return (
    <Card className="mb-4 overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="size-10 bg-primary/10">
              <AvatarImage src={client.assigned_rep_user?.avatar_url} />
              <AvatarFallback>{getAvatarFallback(client.full_name)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{client.full_name}</CardTitle>
              <div className="flex items-center text-sm text-muted-foreground">
                <span dir="ltr" className="text-right">{client.phone_number}</span>
                {client.email && (
                  <>
                    <span className="mx-2">•</span>
                    <span className="truncate max-w-[200px]">{client.email}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <Badge variant={getStatusBadgeVariant(client.status)}>
            {getStatusLabel(client.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">תאריך הצטרפות</p>
            <p>{format(new Date(client.registration_date), 'dd/MM/yyyy')}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">נציג מטפל</p>
            {client.assigned_rep_user ? (
              <UserBadge user={client.assigned_rep_user} />
            ) : (
              <p>-</p>
            )}
          </div>
          {client.tags && client.tags.length > 0 && (
            <div className="col-span-1 md:col-span-2">
              <p className="text-sm font-medium text-muted-foreground mb-1">תגיות</p>
              <div className="flex flex-wrap gap-1">
                {client.tags.map((tag, index) => (
                  <Badge key={index} variant="soft">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {client.notes && (
            <div className="col-span-1 md:col-span-2">
              <p className="text-sm font-medium text-muted-foreground mb-1">הערות</p>
              <div className="p-2 bg-muted/20 rounded-md text-sm">
                <p className="whitespace-pre-wrap">{client.notes}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2 pb-2 border-t">
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => window.open(`tel:${client.phone_number}`, '_blank')}
          >
            <Phone className="size-4" /> חייג
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => window.open(`sms:${client.phone_number}`, '_blank')}
          >
            <MessageSquare className="size-4" /> שלח הודעה
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={handleEditClient}
          >
            <Edit className="size-4" /> ערוך
          </Button>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="size-4" /> הסתר פעילות
            </>
          ) : (
            <>
              <ChevronDown className="size-4" /> הצג פעילות
            </>
          )}
        </Button>
      </CardFooter>
      
      {isExpanded && (
        <div className="border-t p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium">היסטוריית פעילות</h3>
            <Button size="sm" variant="outline" onClick={handleAddActivity}>
              הוסף פעילות
            </Button>
          </div>
          <ActivityTimeline clientId={client.id} />
        </div>
      )}
    </Card>
  );
};

export default ClientCard;
