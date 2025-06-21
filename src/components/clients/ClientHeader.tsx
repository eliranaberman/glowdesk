
import { Client } from '@/types/clients';
import { format } from 'date-fns';
import { 
  Phone, 
  Edit, 
  ChevronRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

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

  const handleWhatsAppMessage = () => {
    if (!client.phone_number) return;
    
    // Format phone number for WhatsApp - remove spaces, dashes, and add +972 if needed
    let phoneNumber = client.phone_number.replace(/[\s-()]/g, '');
    
    // If number starts with 0, replace with +972
    if (phoneNumber.startsWith('0')) {
      phoneNumber = '+972' + phoneNumber.substring(1);
    }
    // If number doesn't start with +, assume it's Israeli and add +972
    else if (!phoneNumber.startsWith('+')) {
      phoneNumber = '+972' + phoneNumber;
    }
    
    const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}`;
    window.open(whatsappUrl, '_blank');
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
            className="flex gap-2 bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
            onClick={handleWhatsAppMessage}
            disabled={!client.phone_number}
          >
            <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
            </svg>
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
