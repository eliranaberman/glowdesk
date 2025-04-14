
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { AlertCircle, Database, Plus } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';
import ClientsTable from '@/components/clients/ClientsTable';
import ClientsFilter from '@/components/clients/ClientsFilter';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const ClientsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('registration_date');
  const [sortOrder, setSortOrder] = useState('desc');

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const retryLoading = () => {
    setError(null);
  };

  const isTableMissingError = error?.includes('relation "public.clients" does not exist');

  const handleAddClient = () => {
    navigate('/clients/new');
  };

  const handleFilterChange = (search: string, status: string | null, sortBy: string, sortOrder: string) => {
    setSearch(search);
    setStatus(status);
    setSortBy(sortBy);
    setSortOrder(sortOrder);
  };

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
          <Button onClick={retryLoading}>נסה שוב</Button>
        </div>
      ) : (
        <>
          <ClientsFilter 
            onFilterChange={handleFilterChange}
          />
          <ClientsTable 
            onError={handleError}
            search={search}
            status={status}
            sortBy={sortBy}
            sortOrder={sortOrder}
          />
        </>
      )}
    </div>
  );
};

export default ClientsPage;
