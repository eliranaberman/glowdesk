
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getClient, getClientActivities } from '@/services/clientService';
import { Client, ClientActivity } from '@/types/clients';
import { 
  AlertCircle, ChevronRight, ArrowLeft, 
  Phone, MessageSquare, Edit, Tag, Plus 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Alert, 
  AlertDescription, 
  AlertTitle 
} from '@/components/ui/alert';
import ClientActivityList from '@/components/clients/ClientActivityList';
import ClientDetailsPanel from '@/components/clients/ClientDetailsPanel';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';

const ClientDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [client, setClient] = useState<Client | null>(null);
  const [activities, setActivities] = useState<ClientActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClientData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const clientData = await getClient(id);
        setClient(clientData);

        const activitiesData = await getClientActivities(id);
        setActivities(activitiesData);
        
        setError(null);
      } catch (err: any) {
        console.error('Error loading client:', err.message);
        setError(err.message);
        toast({
          variant: "destructive",
          title: "שגיאה בטעינת פרטי לקוח",
          description: err.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [id, toast]);

  const handleBackClick = () => {
    navigate('/clients');
  };

  const handleEditClient = () => {
    navigate(`/clients/edit/${id}`);
  };

  const handleAddActivity = () => {
    navigate(`/clients/${id}/activity/new`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
          <p className="text-muted-foreground">טוען פרטי לקוח...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>שגיאה בטעינת פרטי הלקוח</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
        <Button onClick={handleBackClick} variant="back" className="flex gap-2">
          <ChevronRight className="h-4 w-4" />
          חזרה לרשימת הלקוחות
        </Button>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>לקוח לא נמצא</AlertTitle>
          <AlertDescription>
            לא נמצאו פרטי הלקוח המבוקש.
          </AlertDescription>
        </Alert>
        <Button onClick={handleBackClick} variant="back" className="flex gap-2">
          <ChevronRight className="h-4 w-4" />
          חזרה לרשימת הלקוחות
        </Button>
      </div>
    );
  }

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
    <div>
      <Helmet>
        <title>{client.full_name} | Chen Mizrahi</title>
      </Helmet>

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
              onClick={() => window.open(`sms:${client.phone_number}`, '_blank')}
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>פעילות לקוח</CardTitle>
                <CardDescription>היסטוריית פעילות ומעקב אחרי הלקוח</CardDescription>
              </div>
              <Button 
                onClick={handleAddActivity}
                variant="soft"
                className="flex gap-2"
              >
                <Plus className="size-4" />
                פעילות חדשה
              </Button>
            </CardHeader>
            <CardContent>
              <ClientActivityList activities={activities} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <ClientDetailsPanel client={client} />
        </div>
      </div>
    </div>
  );
};

export default ClientDetailPage;
