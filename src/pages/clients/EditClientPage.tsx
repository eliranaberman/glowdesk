
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { ChevronRight, AlertCircle } from 'lucide-react';
import ClientForm from '@/components/clients/ClientForm';
import { Client } from '@/types/clients';
import { getClient, updateClient } from '@/services/clientService';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const EditClientPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  console.log('EditClientPage - Client ID from params:', id);
  console.log('EditClientPage - Current URL:', window.location.href);

  useEffect(() => {
    const fetchClient = async () => {
      if (!id) {
        console.error('No client ID provided in URL params');
        setError('לא נמצא מזהה לקוח בכתובת');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log('Fetching client with ID:', id);
        console.log('Calling getClient service...');
        
        const clientData = await getClient(id);
        console.log('Client data received from service:', clientData);
        
        if (!clientData) {
          console.error('No client data returned from service');
          setError('לקוח לא נמצא במערכת');
          return;
        }
        
        console.log('Setting client data:', clientData);
        setClient(clientData);
      } catch (err: any) {
        console.error('Error loading client:', err);
        console.error('Error details:', {
          message: err.message,
          stack: err.stack,
          name: err.name
        });
        setError(err.message || 'שגיאה בטעינת פרטי הלקוח');
        toast({
          variant: "destructive",
          title: "שגיאה בטעינת פרטי לקוח",
          description: err.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [id, toast]);

  const handleUpdateClient = async (clientData: Partial<Client>) => {
    if (!id) {
      console.error('No client ID available for update');
      return;
    }
    
    try {
      setSubmitting(true);
      console.log('Updating client with data:', clientData);
      console.log('Client ID for update:', id);
      
      const updatedClient = await updateClient(id, clientData);
      console.log('Client updated successfully:', updatedClient);
      
      toast({
        title: "פרטי הלקוח עודכנו",
        description: `פרטי הלקוח ${updatedClient.full_name} עודכנו בהצלחה`
      });
      
      navigate(`/clients/${id}`);
    } catch (error: any) {
      console.error('Error updating client:', error);
      console.error('Update error details:', {
        message: error.message,
        stack: error.stack,
        clientId: id,
        clientData: clientData
      });
      toast({
        variant: "destructive",
        title: "שגיאה בעדכון הלקוח",
        description: error.message || "אירעה שגיאה בעת עדכון פרטי הלקוח"
      });
    } finally {
      setSubmitting(false);
    }
  };

  console.log('Render state:', { loading, error, client: !!client, id });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
          <p className="text-muted-foreground">טוען פרטי לקוח...</p>
          <p className="text-xs text-muted-foreground">מזהה לקוח: {id}</p>
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
            <br />
            <small className="text-xs opacity-80">מזהה לקוח: {id}</small>
          </AlertDescription>
        </Alert>
        <div className="flex gap-2">
          <Button 
            onClick={() => navigate('/clients')} 
            variant="outline" 
            className="flex gap-2"
          >
            <ChevronRight className="h-4 w-4" />
            חזרה לרשימת הלקוחות
          </Button>
          <Button 
            onClick={() => window.location.reload()} 
            variant="default"
          >
            נסה שוב
          </Button>
        </div>
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
            <br />
            <small className="text-xs opacity-80">מזהה לקוח: {id}</small>
          </AlertDescription>
        </Alert>
        <Button 
          onClick={() => navigate('/clients')} 
          variant="outline" 
          className="flex gap-2"
        >
          <ChevronRight className="h-4 w-4" />
          חזרה לרשימת הלקוחות
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Helmet>
        <title>עריכת {client.full_name} | Chen Mizrahi</title>
      </Helmet>

      <Button 
        onClick={() => navigate(`/clients/${id}`)} 
        variant="outline" 
        className="mb-4 flex gap-2"
      >
        <ChevronRight className="h-4 w-4" />
        חזרה לפרטי הלקוח
      </Button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">עריכת לקוח</h1>
        <p className="text-muted-foreground">
          עדכון פרטי הלקוח {client.full_name}
        </p>
      </div>

      <ClientForm 
        onSubmit={handleUpdateClient} 
        isSubmitting={submitting}
        initialData={client}
      />
    </div>
  );
};

export default EditClientPage;
