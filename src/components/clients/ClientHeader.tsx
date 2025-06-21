
import { Client } from '@/types/clients';
import { format } from 'date-fns';
import { 
  Phone, 
  MessageSquare, 
  Edit, 
  ChevronRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { openWhatsApp } from '@/utils/whatsappUtils';

interface ClientHeaderProps {
  client: Client;
}

const ClientHeader = ({ client }: ClientHeaderProps) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/clients');
  };

  const handleEditClient = () => {
    navigate(`/clients/edit/${client.id}`);
  };

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

  const getAvatarFallback = (client: Client) => {
    if (!client.full_name) return '?';
    const nameParts = client.full_name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return client.full_name[0].toUpperCase();
  };

  return (
    <div className="mb-6">
      <Button 
        onClick={handleBackClick} 
        variant="back" 
        className="mb-4 flex gap-2"
      >
        <ChevronRight className="h-4 w-4" />
        חזרה לרשימת הלקוחות
      </Button>

      <div className="flex flex-col md:flex-row justify-between gap-4 md:items-start">
        <div className="flex items-start gap-4">
          <Avatar className="size-16 bg-primary/10 border">
            <AvatarImage src={client.assigned_rep_user?.avatar_url} />
            <AvatarFallback>{getAvatarFallback(client)}</AvatarFallback>
          </Avatar>
          
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{client.full_name}</h1>
              <Badge variant={getStatusBadgeVariant(client.status)}>
                {getStatusLabel(client.status)}
              </Badge>
            </div>
            
            <div className="mt-1 flex flex-col md:flex-row gap-4 md:gap-6">
              {client.email && (
                <p className="text-muted-foreground">{client.email}</p>
              )}
              {client.phone_number && (
                <p className="text-muted-foreground" dir="ltr">{client.phone_number}</p>
              )}
              {client.registration_date && (
                <p className="text-muted-foreground">
                  נרשם בתאריך: {format(new Date(client.registration_date), 'dd/MM/yyyy')}
                </p>
              )}
            </div>

            {client.tags && client.tags.length > 0 && (
              <div className="mt-2 flex gap-1 flex-wrap">
                {client.tags.map(tag => (
                  <Badge key={tag} variant="soft" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex shrink-0 gap-2 self-end md:self-start">
          <Button 
            variant="outline" 
            className="flex gap-2"
            onClick={() => window.open(`tel:${client.phone_number}`, '_blank')}
          >
            <Phone className="size-4" />
            התקשר
          </Button>
          <Button 
            variant="outline" 
            className="flex gap-2"
            onClick={() => openWhatsApp(client.phone_number)}
          >
            <MessageSquare className="size-4" />
            שלח הודעה
          </Button>
          <Button 
            onClick={handleEditClient}
            className="flex gap-2"
          >
            <Edit className="size-4" />
            ערוך פרטים
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClientHeader;
