
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ClientService } from '@/types/clients';
import { getClientServices } from '@/services/clientService';
import { 
  Table, 
  TableBody, 
  TableCell,
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Receipt } from 'lucide-react';

interface ClientServicesListProps {
  clientId: string;
  refreshTrigger?: number;
}

const ClientServicesList = ({ clientId, refreshTrigger = 0 }: ClientServicesListProps) => {
  const [services, setServices] = useState<ClientService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getClientServices(clientId);
        setServices(data);
      } catch (err: any) {
        console.error('Error loading client services:', err);
        setError(err.message || 'Failed to load services');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [clientId, refreshTrigger]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const totalAmount = services.reduce((sum, service) => sum + service.price, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          שירותים והיסטורית תשלומים
        </CardTitle>
      </CardHeader>
      <CardContent>
        {services.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>אין שירותים להצגה</p>
          </div>
        ) : (
          <>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">תאריך</TableHead>
                    <TableHead className="text-right">תיאור</TableHead>
                    <TableHead className="text-left">מחיר</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell className="font-medium text-right">
                        {format(new Date(service.service_date), 'dd/MM/yyyy')}
                      </TableCell>
                      <TableCell className="text-right">{service.description}</TableCell>
                      <TableCell className="text-left">{formatPrice(service.price)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4 text-left font-semibold flex justify-between">
              <span>סה"כ:</span>
              <span>{formatPrice(totalAmount)}</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientServicesList;
