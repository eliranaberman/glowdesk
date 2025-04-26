import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { AlertCircle, Database, Plus, Search } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import ClientsFilter from '@/components/clients/ClientsFilter';
import ClientCard from '@/components/clients/ClientCard';
import { Client } from '@/types/clients';
import { getClients } from '@/services/clientService';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { sampleClients } from '@/utils/sampleClients';

const ClientsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<Client[]>([]);
  const [totalClients, setTotalClients] = useState(0);
  
  // Filter state
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('registration_date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        // For demo purposes, we'll use the sample clients
        setTimeout(() => {
          setClients(sampleClients as Client[]);
          setTotalClients(sampleClients.length);
          setLoading(false);
        }, 1000);
      } catch (error: any) {
        console.error('Error loading clients:', error.message);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchClients();
  }, [search, status, sortBy, sortOrder, currentPage]);

  const handleAddClient = () => {
    navigate('/clients/new');
  };

  const handleFilterChange = (search: string, status: string | null, sortBy: string, sortOrder: string) => {
    setSearch(search);
    setStatus(status);
    setSortBy(sortBy);
    setSortOrder(sortOrder);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const isTableMissingError = error?.includes('relation "public.clients" does not exist');

  return (
    <div>
      <Helmet>
        <title>ניהול לקוחות | Chen Mizrahi</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-medium text-primary mb-2">ניהול לקוחות</h1>
            <p className="text-muted-foreground">
              נהלי את רשימת הלקוחות שלך בקלות ובמקצועיות
            </p>
          </div>

          <Button onClick={handleAddClient} className="flex gap-2 shadow-soft hover:shadow-soft-lg transition-all">
            <Plus className="size-4" />
            לקוחה חדשה
          </Button>
        </div>

        <div className="grid gap-6">
          <div className="bg-card rounded-xl border shadow-soft p-4">
            <ClientsFilter 
              onFilterChange={handleFilterChange}
              className="border-0 shadow-none p-0"
            />
          </div>

          {error ? (
            <Alert variant="destructive" className="shadow-soft">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>שגיאה בטעינת לקוחות</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 w-full rounded-xl" />
              ))}
            </div>
          ) : clients.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-xl border shadow-soft">
              <h3 className="text-lg font-medium mb-2">אין לקוחות עדיין</h3>
              <p className="text-muted-foreground mb-4">התחילי להוסיף לקוחות למערכת</p>
              <Button onClick={handleAddClient} className="shadow-soft hover:shadow-soft-lg transition-all">
                הוספת לקוחה ראשונה
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {clients.map((client) => (
                <ClientCard key={client.id} client={client} className="shadow-soft hover:shadow-soft-lg transition-all" />
              ))}
              
              {totalClients > pageSize && (
                <div className="flex justify-center mt-6">
                  <div className="flex gap-2 bg-card rounded-lg border p-1">
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      className="border-0 hover:bg-accent"
                    >
                      הקודם
                    </Button>
                    <div className="flex items-center px-3 text-sm font-medium">
                      עמוד {currentPage} מתוך {Math.ceil(totalClients / pageSize)}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={currentPage >= Math.ceil(totalClients / pageSize)}
                      onClick={() => setCurrentPage(prev => prev + 1)}
                      className="border-0 hover:bg-accent"
                    >
                      הבא
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientsPage;
