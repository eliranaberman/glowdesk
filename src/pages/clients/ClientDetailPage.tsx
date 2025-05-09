
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getClient, getClientActivities } from '@/services/clientService';
import { Client, ClientActivity } from '@/types/clients';
import { useToast } from '@/components/ui/use-toast';

// Import our new components
import ClientHeader from '@/components/clients/ClientHeader';
import ClientDetailsPanel from '@/components/clients/ClientDetailsPanel';
import ServicesSection from '@/components/clients/ServicesSection';
import ActivitySection from '@/components/clients/ActivitySection';
import ClientErrorState from '@/components/clients/ClientErrorState';
import ClientNotFound from '@/components/clients/ClientNotFound';
import ClientLoadingState from '@/components/clients/ClientLoadingState';

const ClientDetailPage = () => {
  const { id } = useParams();
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

  // Show appropriate state based on loading/error
  if (loading) {
    return <ClientLoadingState />;
  }

  if (error) {
    return <ClientErrorState error={error} />;
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
