
import { Client } from '@/types/clients';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { format } from 'date-fns';

interface ClientDetailsPanelProps {
  client: Client;
}

const ClientDetailsPanel = ({ client }: ClientDetailsPanelProps) => {
  const getGenderLabel = (gender?: string) => {
    switch (gender) {
      case 'male': return 'זכר';
      case 'female': return 'נקבה';
      case 'other': return 'אחר';
      default: return 'לא צוין';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>פרטי לקוח</CardTitle>
        <CardDescription>פרטים אישיים ומידע נוסף</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">שם מלא</p>
            <p>{client.full_name}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-muted-foreground">מספר טלפון</p>
            <p dir="ltr" className="text-right">{client.phone_number}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-muted-foreground">אימייל</p>
            <p className="break-words">{client.email}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-muted-foreground">מגדר</p>
            <p>{getGenderLabel(client.gender)}</p>
          </div>
          
          {client.birthday && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">תאריך לידה</p>
              <p>{format(new Date(client.birthday), 'dd/MM/yyyy')}</p>
            </div>
          )}
          
          <div>
            <p className="text-sm font-medium text-muted-foreground">תאריך הצטרפות</p>
            <p>{format(new Date(client.registration_date), 'dd/MM/yyyy')}</p>
          </div>

          {client.assigned_rep_user && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">נציג מטפל</p>
              <p>{client.assigned_rep_user.full_name}</p>
            </div>
          )}
        </div>
        
        {client.notes && (
          <div className="pt-2">
            <p className="text-sm font-medium text-muted-foreground mb-1">הערות</p>
            <div className="p-3 bg-muted/20 rounded-md">
              <p className="whitespace-pre-wrap">{client.notes}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientDetailsPanel;
