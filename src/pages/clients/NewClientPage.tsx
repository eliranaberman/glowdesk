
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import ClientForm from '@/components/clients/ClientForm';
import { Client } from '@/types/clients';
import { createClient } from '@/services/clientService';
import { useToast } from '@/components/ui/use-toast';

const NewClientPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleCreateClient = async (clientData: Partial<Client>) => {
    try {
      setLoading(true);
      
      // Add current timestamp to registration_date if not provided
      if (!clientData.registration_date) {
        clientData.registration_date = new Date().toISOString();
      }

      const newClient = await createClient(clientData as Omit<Client, 'id' | 'created_at' | 'updated_at'>);
      
      toast({
        title: "הלקוח נוצר בהצלחה",
        description: `הלקוח ${newClient.full_name} נוסף למערכת`
      });
      
      navigate(`/clients/${newClient.id}`);
    } catch (error: any) {
      console.error('Error creating client:', error);
      toast({
        variant: "destructive",
        title: "שגיאה ביצירת לקוח",
        description: error.message || "אירעה שגיאה בעת יצירת הלקוח"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Helmet>
        <title>לקוח חדש | Chen Mizrahi</title>
      </Helmet>

      <Button 
        onClick={() => navigate('/clients')} 
        variant="back" 
        className="mb-4 flex gap-2"
      >
        <ChevronRight className="h-4 w-4" />
        חזרה לרשימת הלקוחות
      </Button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">לקוח חדש</h1>
        <p className="text-muted-foreground">
          הוסף לקוח חדש למערכת
        </p>
      </div>

      <ClientForm 
        onSubmit={handleCreateClient} 
        isSubmitting={loading} 
      />
    </div>
  );
};

export default NewClientPage;
