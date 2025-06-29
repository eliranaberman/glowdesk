
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { Client } from '@/types/clients';
import { getClients, deleteClient } from '@/services/clientService';
import ClientsTableView from '@/components/clients/ClientsTableView';
import ClientsFilter from '@/components/clients/ClientsFilter';
import { useToast } from "@/hooks/use-toast";
import ClientsTableMobile from '@/components/clients/ClientsTableMobile';
import { useIsMobile } from '@/hooks/use-mobile';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const ClientsPage = () => {
  const isMobile = useIsMobile();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('registration_date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [totalClients, setTotalClients] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const { toast } = useToast();

  console.log('ClientsPage render - clients count:', clients.length, 'loading:', loading, 'error:', error);

  const fetchData = useCallback(async () => {
    console.log('Fetching clients with filters:', { search, status, sortBy, sortOrder });
    setLoading(true);
    setError(null);
    
    try {
      const { clients: data, count } = await getClients(
        search || undefined, 
        status || undefined, 
        sortBy, 
        sortOrder, 
        currentPage, 
        pageSize
      );
      
      console.log('Fetched clients:', data.length, 'Total:', count);
      setClients(data);
      setTotalClients(count);
    } catch (err: any) {
      console.error('Error fetching clients:', err);
      setError(err.message || 'Failed to fetch clients');
      toast({
        title: "שגיאה",
        description: "נכשל בטעינת רשימת הלקוחות",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [search, status, sortBy, sortOrder, currentPage, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDeleteClient = async (id: string) => {
    try {
      await deleteClient(id);
      setClients(prev => prev.filter(client => client.id !== id));
      setTotalClients(prev => prev - 1);
      toast({
        title: "הצלחה",
        description: "הלקוח נמחק בהצלחה",
      });
    } catch (err: any) {
      console.error('Error deleting client:', err);
      setError(err.message || 'Failed to delete client');
      toast({
        title: "שגיאה",
        description: "נכשל במחיקת הלקוח",
        variant: "destructive",
      });
    }
  };

  const handleFilterChange = (searchTerm: string, statusFilter: string | null, sortByField: string, sortOrderField: string) => {
    console.log('Filter changed:', { searchTerm, statusFilter, sortByField, sortOrderField });
    setSearch(searchTerm);
    setStatus(statusFilter);
    setSortBy(sortByField);
    setSortOrder(sortOrderField);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-4 px-4 max-w-7xl" dir="rtl">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-4 px-4 max-w-7xl" dir="rtl">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-right">ניהול לקוחות</h1>
          <Link to="/clients/new">
            <Button className="w-full sm:w-auto min-h-[44px] flex items-center justify-center gap-2">
              <UserPlus className="h-4 w-4" />
              הוספת לקוח חדש
            </Button>
          </Link>
        </div>
        
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
        
        <Button onClick={fetchData} className="mt-4">
          נסה שוב
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4 px-4 max-w-7xl" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-right">ניהול לקוחות</h1>
        <Link to="/clients/new">
          <Button className="w-full sm:w-auto min-h-[44px] flex items-center justify-center gap-2">
            <UserPlus className="h-4 w-4" />
            הוספת לקוח חדש
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        <ClientsFilter onFilterChange={handleFilterChange} />

        {/* Direct rendering instead of MobileResponsiveTable to debug */}
        {isMobile ? (
          <div className="mobile-table-container min-h-[400px]">
            <ClientsTableMobile
              clients={clients}
              onDeleteClient={handleDeleteClient}
            />
          </div>
        ) : (
          <div className="desktop-table-container min-h-[400px]">
            <ClientsTableView
              clients={clients}
              totalClients={totalClients}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              onDeleteClient={handleDeleteClient}
              loading={false}
            />
          </div>
        )}

        {/* Debug information */}
        <div className="mt-4 p-4 bg-gray-100 rounded text-sm">
          <p>Debug Info:</p>
          <p>Clients count: {clients.length}</p>
          <p>Total clients: {totalClients}</p>
          <p>Is mobile: {isMobile ? 'Yes' : 'No'}</p>
          <p>Loading: {loading ? 'Yes' : 'No'}</p>
          <p>Error: {error || 'None'}</p>
        </div>
      </div>
    </div>
  );
};

export default ClientsPage;
