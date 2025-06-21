
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Client } from '@/types/clients';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Mail, MessageSquare, Phone, User } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import UserBadge from './UserBadge';
import { openWhatsApp } from '@/utils/whatsappUtils';

interface ClientCardProps {
  client: Client;
  className?: string;
}

const ClientCard = ({ client, className }: ClientCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/clients/${client.id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-200';
      case 'lead':
        return 'bg-amber-500/10 text-amber-600 border-amber-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-600 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'פעילה';
      case 'lead': return 'ליד';
      case 'inactive': return 'לא פעילה';
      default: return status;
    }
  };

  return (
    <Card 
      className={cn(
        "overflow-hidden hover:border-primary/20 transition-all cursor-pointer",
        className
      )}
      onClick={handleClick}
    >
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <User className="h-6 w-6 text-primary/70" />
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-medium">{client.full_name}</h3>
                <Badge className={cn("font-normal", getStatusColor(client.status))}>
                  {getStatusText(client.status)}
                </Badge>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" />
                  <span dir="ltr">{client.phone_number}</span>
                </div>
                {client.email && (
                  <div className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" />
                    <span>{client.email}</span>
                  </div>
                )}
                {client.registration_date && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>
                      {format(new Date(client.registration_date), 'dd/MM/yyyy')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mr-auto">
            <Button variant="outline" size="sm" className="gap-1" onClick={(e) => {
              e.stopPropagation();
              window.open(`tel:${client.phone_number}`, '_blank');
            }}>
              <Phone className="h-3.5 w-3.5" />
              חייג
            </Button>
            <Button variant="outline" size="sm" className="gap-1" onClick={(e) => {
              e.stopPropagation();
              openWhatsApp(client.phone_number);
            }}>
              <MessageSquare className="h-3.5 w-3.5" />
              שלח הודעה
            </Button>
          </div>
        </div>

        {client.tags && client.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {client.tags.map((tag, index) => (
              <Badge 
                key={index} 
                variant="outline"
                className="bg-primary/5 hover:bg-primary/10"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {client.assigned_rep_user && (
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <span>נציגה מטפלת:</span>
            <UserBadge user={client.assigned_rep_user} />
          </div>
        )}
      </div>
    </Card>
  );
};

export default ClientCard;
