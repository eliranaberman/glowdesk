
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

  useEffect(() => {
    const fetchClient = async () => {
      if (!id) {
        console.error('No client ID provided');
        setError('לא נמצא מזהה לקוח');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log('Fetching client with ID:', id);
        
        const clientData = await getClient(id);
        console.log('Client data received:', clientData);
        
        if (!clientData) {
          setError('לקוח לא נמצא');
          return;
        }
        
        setClient(clientData);
      } catch (err: any) {
        console.error('Error loading client:', err);
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
    if (!id) return;
    
    try {
      setSubmitting(true);
      console.log('Updating client with data:', clientData);
      
      const updatedClient = await updateClient(id, clientData);
      console.log('Client updated successfully:', updatedClient);
      
      toast({
        title: "פרטי הלקוח עודכנו",
        description: `פרטי הלקוח ${updatedClient.full_name} עודכנו בהצלחה`
      });
      
      navigate(`/clients/${id}`);
    } catch (error: any) {
      console.error('Error updating client:', error);
      toast({
        variant: "destructive",
        title: "שגיאה בעדכון הלקוח",
        description: error.message || "אירעה שגיאה בעת עדכון פרטי הלקוח"
      });
    } finally {
      setSubmitting(false);
    }
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
