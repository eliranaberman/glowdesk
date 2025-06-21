
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { AlertCircle, Plus, Table2, Grid3x3 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import ClientsAdvancedFilter, { ClientFilters } from '@/components/clients/ClientsAdvancedFilter';
import ClientsTableView from '@/components/clients/ClientsTableView';
import ClientCard from '@/components/clients/ClientCard';
import { Client } from '@/types/clients';
import { getClients } from '@/services/clientService';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

const ClientsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [filters, setFilters] = useState<ClientFilters>({
    search: '',
    status: null,
    treatmentType: null,
    dateFrom: null,
    dateTo: null,
    sortBy: 'registration_date',
    sortOrder: 'desc'
  });

  const handleAddClient = () => {
    navigate('/clients/new');
  };

  const handleFilterChange = (newFilters: ClientFilters) => {
    setFilters(newFilters);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    toast({
      variant: "destructive",
      title: "שגיאה בטעינת לקוחות",
      description: errorMessage,
    });
  };

  const isTableMissingError = error?.includes('relation "public.clients" does not exist');

  return (
    <div>
      <Helmet>
        <title>ניהול לקוחות | Chen Mizrahi</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-medium text-primary mb-2">ניהול לקוחות</h1>
            <p className="text-muted-foreground">
              נהלי את רשימת הלקוחות שלך בקלות ובמקצועיות
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center border rounded-lg p-1 bg-card shadow-soft">
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
                className="gap-1.5 px-3"
              >
                <Table2 className="size-4" />
                טבלה
              </Button>
              <Button
                variant={viewMode === 'cards' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('cards')}
                className="gap-1.5 px-3"
              >
                <Grid3x3 className="size-4" />
                כרטיסים
              </Button>
            </div>

            <Separator orientation="vertical" className="h-8" />

            <Button 
              onClick={handleAddClient} 
              className="flex gap-1.5 shadow-soft hover:shadow-soft-lg transition-all"
            >
              <Plus className="size-4" />
              לקוחה חדשה
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Advanced Filter */}
          <ClientsAdvancedFilter 
            onFilterChange={handleFilterChange}
          />

          {/* Error State */}
          {error && (
            <Alert variant="destructive" className="shadow-soft">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>שגיאה בטעינת לקוחות</AlertTitle>
              <AlertDescription>
                {isTableMissingError ? (
                  <>
                    <p>טבלת הלקוחות לא קיימת במסד הנתונים.</p>
                    <p className="mt-2">אנא פנה למפתח המערכת ליצירת הטבלה הנדרשת.</p>
                  </>
                ) : (
                  error
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Content */}
          {!error && (
            <>
              {viewMode === 'table' ? (
                <ClientsTableView 
                  filters={filters}
                  onError={handleError}
                />
              ) : (
                <div className="grid gap-4">
                  <div className="text-center py-8 text-muted-foreground">
                    <p>תצוגת כרטיסים זמינה בקרוב...</p>
                    <Button 
                      variant="outline" 
                      onClick={() => setViewMode('table')}
                      className="mt-2"
                    >
                      חזור לתצוגת טבלה
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientsPage;
