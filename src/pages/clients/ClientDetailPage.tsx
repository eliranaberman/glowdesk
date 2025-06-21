
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getClient, getClientActivities } from '@/services/clientService';
import { Client, ClientActivity } from '@/types/clients';
import { useToast } from '@/hooks/use-toast';

// Import our components
import ClientHeader from '@/components/clients/ClientHeader';
import ClientDetailsPanel from '@/components/clients/ClientDetailsPanel';
import ServicesSection from '@/components/clients/ServicesSection';
import ActivitySection from '@/components/clients/ActivitySection';
import ClientErrorState from '@/components/clients/ClientErrorState';
import ClientNotFound from '@/components/clients/ClientNotFound';
import ClientLoadingState from '@/components/clients/ClientLoadingState';

// UUID validation function
const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

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
      if (!id) {
        setError('מזהה לקוח לא תקין');
        setLoading(false);
        return;
      }

      // Validate UUID format
      if (!isValidUUID(id)) {
        setError('מזהה לקוח לא תקין - נדרש UUID תקין');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('Fetching client with ID:', id);
        
        const clientData = await getClient(id);
        
        if (!clientData) {
          setError('לקוח לא נמצא');
          setLoading(false);
          return;
        }
        
        setClient(clientData);
        console.log('Client loaded successfully:', clientData.full_name);

        // Load activities
        try {
          const activitiesData = await getClientActivities(id);
          setActivities(activitiesData);
        } catch (activitiesError) {
          console.warn('Error loading activities:', activitiesError);
          // Continue without activities - don't break the whole page
        }
        
        setError(null);
      } catch (err: any) {
        console.error('Error loading client:', err);
        
        // Handle specific error types
        if (err.message?.includes('invalid input syntax for type uuid')) {
          setError('מזהה לקוח לא תקין');
        } else if (err.message?.includes('not found') || err.status === 404) {
          setError('לקוח לא נמצא במערכת');
        } else {
          setError(err.message || 'שגיאה בטעינת פרטי הלקוח');
        }
        
        toast({
          variant: "destructive",
          title: "שגיאה בטעינת פרטי לקוח",
          description: err.message || 'לא ניתן לטעון את פרטי הלקוח',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [id, toast]);

  // Show appropriate state based on loading/error
  if (loading) {
    return <ClientLoadingState />;
  }

  if (error) {
    return (
      <ClientErrorState 
        error={error} 
        onBack={() => navigate('/clients')}
      />
    );
  }

  if (!client) {
    return <ClientNotFound />;
  }

  return (
    <div>
      <Helmet>
        <title>{client.full_name} | Chen Mizrahi</title>
      </Helmet>

      <ClientHeader client={client} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <ServicesSection clientId={client.id} />
          <ActivitySection clientId={client.id} activities={activities} />
        </div>

        <div className="space-y-6">
          <ClientDetailsPanel client={client} />
        </div>
      </div>
    </div>
  );
};

export default ClientDetailPage;
