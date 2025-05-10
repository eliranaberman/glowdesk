
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Client } from '@/types/clients';
import { getClients } from '@/services/clientService';
import TableLoadingSkeleton from './TableLoadingSkeleton';
import ClientTableRow from './ClientTableRow';
import EmptyState from './EmptyState';

interface ClientsTableProps {
  onError: (error: string) => void;
  search?: string;
  status?: string | null;
  sortBy?: string;
  sortOrder?: string;
}

const ClientsTable = ({ 
  onError, 
  search = '', 
  status = null,
  sortBy = 'registration_date', 
  sortOrder = 'desc'
}: ClientsTableProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<Client[]>([]);
  const [totalClients, setTotalClients] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

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
        setLoading(false);
      } catch (error: any) {
        console.error('Error loading clients:', error.message);
        onError(error.message);
        setLoading(false);
      }
    };

    fetchClients();
  }, [search, status, sortBy, sortOrder, currentPage, onError]);

  const handleViewClient = (id: string) => {
    navigate(`/clients/${id}`);
  };

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>לקוח</TableHead>
            <TableHead>טלפון</TableHead>
            <TableHead>תאריך הצטרפות</TableHead>
            <TableHead>סטטוס</TableHead>
            <TableHead>נציג מטפל</TableHead>
            <TableHead className="w-[100px]">פעולות</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableLoadingSkeleton />
          ) : clients.length === 0 ? (
            <EmptyState />
          ) : (
            clients.map((client) => (
              <ClientTableRow 
                key={client.id}
                client={client}
                onRowClick={handleViewClient}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClientsTable;
