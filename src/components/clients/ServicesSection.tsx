
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import ClientServicesList from './ClientServicesList';
import ClientServiceForm from './ClientServiceForm';
import { useToast } from '@/hooks/use-toast';

interface ServicesSectionProps {
  clientId: string;
}

const ServicesSection = ({ clientId }: ServicesSectionProps) => {
  const { toast } = useToast();
  const [isServiceFormOpen, setIsServiceFormOpen] = useState(false);
  const [serviceRefreshTrigger, setServiceRefreshTrigger] = useState(0);

  const handleServiceAdded = () => {
    setServiceRefreshTrigger(prev => prev + 1);
    toast({
      title: "השירות נוסף בהצלחה",
      description: "פרטי השירות נשמרו במערכת",
    });
  };

  return (
    <>
      {/* Service Form Dialog */}
      <ClientServiceForm 
        clientId={clientId}
        isOpen={isServiceFormOpen}
        onClose={() => setIsServiceFormOpen(false)}
        onSuccess={handleServiceAdded}
      />

      {/* Service List Card */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">שירותים ותשלומים</h2>
        <Button 
          onClick={() => setIsServiceFormOpen(true)}
          className="flex gap-2"
        >
          <Plus className="size-4" />
          הוסף שירות חדש
        </Button>
      </div>
      <ClientServicesList 
        clientId={clientId} 
        refreshTrigger={serviceRefreshTrigger} 
      />
    </>
  );
};

export default ServicesSection;
