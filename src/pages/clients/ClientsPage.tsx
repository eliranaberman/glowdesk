import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { Client } from '@/types/clients';
import { getAllClients, deleteClient } from '@/services/clientsService';
import ClientsTableView from '@/components/clients/ClientsTableView';
import ClientsFilter from '@/components/clients/ClientsFilter';
import { useToast } from "@/hooks/use-toast";
import ClientsTableMobile from '@/components/clients/ClientsTableMobile';
import MobileResponsiveTable from '@/components/ui/mobile-responsive-table';
import { useIsMobile } from '@/hooks/use-mobile';

const ClientsPage = () => {
  const isMobile = useIsMobile();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllClients();
      setClients(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch clients');
      toast({
        title: "Error",
        description: "Failed to load clients",
        variant: "destructive",
      })
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDeleteClient = async (id: string) => {
    try {
      await deleteClient(id);
      setClients(clients.filter(client => client.id !== id));
      toast({
        title: "Success",
        description: "Client deleted successfully",
      })
    } catch (err: any) {
      setError(err.message || 'Failed to delete client');
      toast({
        title: "Error",
        description: "Failed to delete client",
        variant: "destructive",
      })
    }
  };

  const filteredClients = clients.filter(client => {
    const searchRegex = new RegExp(searchTerm, 'i');
    const nameMatch = searchRegex.test(client.first_name + ' ' + client.last_name);
    const statusMatch = statusFilter ? client.status === statusFilter : true;

    return nameMatch && statusMatch;
  });

  const handleFilterClick = (status: string) => {
    setStatusFilter(status);
  };

  return (
    <div className="container mx-auto py-4 px-4 max-w-7xl" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-right">ניהול לקוחות</h1>
        <Button asChild className="w-full sm:w-auto min-h-[44px]">
          <Link to="/clients/new" className="flex items-center justify-center gap-2">
            <UserPlus className="h-4 w-4" />
            הוספת לקוח חדש
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        <ClientsFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onFilterClick={handleFilterClick}
        />

        <MobileResponsiveTable
          mobileComponent={
            <ClientsTableMobile
              clients={filteredClients}
              onDeleteClient={handleDeleteClient}
            />
          }
          className="min-h-[400px]"
        >
          <ClientsTableView
            clients={filteredClients}
            onDeleteClient={handleDeleteClient}
          />
        </MobileResponsiveTable>
      </div>
    </div>
  );
};

export default ClientsPage;
