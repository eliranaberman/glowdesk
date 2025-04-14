
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { AlertCircle, Database, Plus } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import ClientsFilter from '@/components/clients/ClientsFilter';
import ClientCard from '@/components/clients/ClientCard';
import { Client } from '@/types/clients';
import { getClients } from '@/services/clientService';
import { Skeleton } from '@/components/ui/skeleton';

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
        const { clients, count } = await getClients(
          search, 
          status || undefined, 
          sortBy, 
          sortOrder,
          currentPage,
          pageSize
        );
        setClients(clients);
        setTotalClients(count);
        setError(null);
      } catch (error: any) {
        console.error('Error loading clients:', error.message);
        setError(error.message);
      } finally {
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

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">ניהול לקוחות</h1>
          <p className="text-muted-foreground">
            צפה ונהל את רשימת הלקוחות שלך
          </p>
        </div>

        <Button onClick={handleAddClient} className="flex gap-1">
          <Plus className="size-4" />
          לקוח חדש
        </Button>
      </div>

      <ClientsFilter 
        onFilterChange={handleFilterChange}
      />

      {error ? (
        <div className="space-y-4">
          {isTableMissingError ? (
            <Alert variant="destructive">
              <Database className="h-4 w-4" />
              <AlertTitle>שגיאה בטעינת הלקוחות</AlertTitle>
              <AlertDescription className="space-y-2">
                <p>טבלת הלקוחות לא קיימת במסד הנתונים. עליך ליצור טבלה בשם "clients" בסופאבייס.</p>
                <p className="text-sm mt-2">
                  השגיאה המלאה: {error}
                </p>
              </AlertDescription>
            </Alert>
          ) : (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>שגיאה בטעינת הלקוחות</AlertTitle>
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          )}
          <Button onClick={() => setError(null)}>נסה שוב</Button>
        </div>
      ) : loading ? (
        <div className="space-y-4 mt-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 w-full rounded-lg" />
          ))}
        </div>
      ) : clients.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-lg border">
          <h3 className="text-lg font-medium mb-2">אין לקוחות עדיין</h3>
          <p className="text-muted-foreground mb-4">התחל להוסיף לקוחות למערכת</p>
          <Button onClick={handleAddClient}>הוסף לקוח ראשון</Button>
        </div>
      ) : (
        <div className="space-y-4 mt-4">
          {clients.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))}
          
          {totalClients > pageSize && (
            <div className="flex justify-center mt-6">
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                >
                  הקודם
                </Button>
                <div className="flex items-center px-3 bg-muted rounded">
                  עמוד {currentPage} מתוך {Math.ceil(totalClients / pageSize)}
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={currentPage >= Math.ceil(totalClients / pageSize)}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                >
                  הבא
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ClientsPage;
