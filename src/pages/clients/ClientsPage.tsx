
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { AlertCircle, Plus, Filter } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import ClientsAdvancedFilter, { ClientFilters } from '@/components/clients/ClientsAdvancedFilter';
import ClientsTableView from '@/components/clients/ClientsTableView';
import { cn } from '@/lib/utils';

const ClientsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
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

          <Button 
            onClick={handleAddClient} 
            className="flex gap-1.5 shadow-soft hover:shadow-soft-lg transition-all"
          >
            <Plus className="size-4" />
            לקוחה חדשה
          </Button>
        </div>

        <div className="space-y-6">
          {/* Advanced Filter Toggle */}
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <Filter className="size-4" />
              סינון מתקדם
            </Button>
          </div>

          {/* Collapsible Advanced Filter */}
          <div className={cn(
            "transition-all duration-300 ease-in-out overflow-hidden",
            showAdvancedFilter ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          )}>
            <ClientsAdvancedFilter 
              onFilterChange={handleFilterChange}
              className="mb-6"
            />
          </div>

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

          {/* Table View */}
          {!error && (
            <ClientsTableView 
              filters={filters}
              onError={handleError}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientsPage;
