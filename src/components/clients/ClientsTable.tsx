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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Phone, MessageSquare } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { openWhatsApp } from '@/utils/whatsappUtils';

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

  const handleEditClient = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/clients/edit/${id}`);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'lead': return 'warm';
      case 'inactive': return 'destructive';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'פעיל';
      case 'lead': return 'ליד';
      case 'inactive': return 'לא פעיל';
      default: return status;
    }
  };

  const getAvatarFallback = (client: Client) => {
    if (!client.full_name) return '?';
    const nameParts = client.full_name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return client.full_name[0].toUpperCase();
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
            Array(5).fill(0).map((_, i) => (
              <TableRow key={`skeleton-${i}`}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-[180px]" />
                  </div>
                </TableCell>
                <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                <TableCell><Skeleton className="h-6 w-[80px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                <TableCell><Skeleton className="h-8 w-[80px]" /></TableCell>
              </TableRow>
            ))
          ) : clients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                <div className="flex flex-col items-center justify-center space-y-2 text-muted-foreground">
                  <p>לא נמצאו לקוחות</p>
                  <Button variant="outline" size="sm" onClick={() => navigate('/clients/new')}>
                    הוסף לקוח חדש
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            clients.map((client) => (
              <TableRow 
                key={client.id} 
                className="cursor-pointer hover:bg-accent/30"
                onClick={() => handleViewClient(client.id)}
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="size-8 bg-primary/10">
                      <AvatarImage src={client.assigned_rep_user?.avatar_url} />
                      <AvatarFallback>{getAvatarFallback(client)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{client.full_name}</div>
                      <div className="text-xs text-muted-foreground">
                        {client.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell dir="ltr" className="text-right">{client.phone_number}</TableCell>
                <TableCell>
                  {client.registration_date ? format(new Date(client.registration_date), 'dd/MM/yyyy') : ''}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(client.status)}>
                    {getStatusLabel(client.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {client.assigned_rep_user?.full_name || '-'}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="size-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`tel:${client.phone_number}`, '_blank');
                      }}
                    >
                      <Phone className="size-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="size-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        openWhatsApp(client.phone_number);
                      }}
                    >
                      <MessageSquare className="size-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="size-8"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => handleEditClient(client.id, e)}>
                          ערוך פרטים
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/clients/${client.id}/activity/new`);
                          }}
                        >
                          הוסף פעילות
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClientsTable;
