
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Phone, MessageSquare, MoreHorizontal, Eye, Edit, UserPlus } from 'lucide-react';
import { Client } from '@/types/clients';
import { openWhatsApp } from '@/utils/whatsappUtils';
import { format } from 'date-fns';

interface ClientsTableViewProps {
  clients: Client[];
  totalClients: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onDeleteClient: (id: string) => void;
  loading: boolean;
}

const ClientsTableView = ({ 
  clients, 
  totalClients, 
  currentPage, 
  pageSize, 
  onPageChange, 
  onDeleteClient,
  loading 
}: ClientsTableViewProps) => {
  const navigate = useNavigate();

  const handleViewClient = (id: string) => {
    navigate(`/clients/${id}`);
  };

  const handleEditClient = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/clients/edit/${id}`);
  };

  const handleCall = (phoneNumber: string, event: React.MouseEvent) => {
    event.stopPropagation();
    window.open(`tel:${phoneNumber}`, '_self');
  };

  const handleWhatsApp = (phoneNumber: string, event: React.MouseEvent) => {
    event.stopPropagation();
    openWhatsApp(phoneNumber);
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
      case 'active': return 'פעילה';
      case 'lead': return 'ליד';
      case 'inactive': return 'לא פעילה';
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

  const formatPhoneNumber = (phone: string) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10 && cleaned.startsWith('05')) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  if (clients.length === 0) {
    return (
      <div className="text-center py-16 bg-card rounded-xl border shadow-soft">
        <UserPlus className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">לא נמצאו לקוחות</h3>
        <p className="text-muted-foreground mb-4">
          התחילי להוסיף לקוחות למערכת
        </p>
        <Button onClick={() => navigate('/clients/new')} className="shadow-soft hover:shadow-soft-lg transition-all">
          הוספת לקוחה חדשה
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-card shadow-soft overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-accent/5">
              <TableHead className="font-medium text-xs w-1/3">לקוחה</TableHead>
              <TableHead className="font-medium text-xs w-1/6">טלפון</TableHead>
              <TableHead className="font-medium text-xs hidden lg:table-cell w-1/6">טיפול מועדף</TableHead>
              <TableHead className="font-medium text-xs hidden sm:table-cell w-1/8">הצטרפות</TableHead>
              <TableHead className="font-medium text-xs hidden md:table-cell w-16 text-center">ביקורים</TableHead>
              <TableHead className="font-medium text-xs w-20">סטטוס</TableHead>
              <TableHead className="font-medium text-xs w-24">פעולות</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow 
                key={client.id} 
                className="cursor-pointer hover:bg-accent/10 transition-colors h-14"
                onClick={() => handleViewClient(client.id)}
              >
                <TableCell className="py-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="size-8 bg-primary/10 border border-primary/20">
                      <AvatarImage src={client.assigned_rep_user?.avatar_url} />
                      <AvatarFallback className="text-primary font-medium text-xs">
                        {getAvatarFallback(client)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-xs text-foreground truncate">
                        {client.full_name}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {client.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                
                <TableCell className="py-2">
                  <div dir="ltr" className="text-right font-mono text-xs">
                    {formatPhoneNumber(client.phone_number)}
                  </div>
                </TableCell>
                
                <TableCell className="hidden lg:table-cell py-2">
                  <div className="text-xs text-muted-foreground truncate">
                    {client.preferred_treatment || '-'}
                  </div>
                </TableCell>
                
                <TableCell className="hidden sm:table-cell py-2">
                  <div className="text-xs">
                    {client.registration_date 
                      ? format(new Date(client.registration_date), 'dd/MM/yy')
                      : '-'
                    }
                  </div>
                </TableCell>
                
                <TableCell className="hidden md:table-cell py-2 text-center">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    {client.visit_count || 0}
                  </span>
                </TableCell>
                
                <TableCell className="py-2">
                  <Badge variant={getStatusBadgeVariant(client.status)} className="text-xs px-2 py-0.5">
                    {getStatusLabel(client.status)}
                  </Badge>
                </TableCell>
                
                <TableCell className="py-2">
                  <div className="flex items-center gap-0.5">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="size-7 hover:bg-blue-50 hover:text-blue-600"
                      onClick={(e) => handleCall(client.phone_number, e)}
                      title="התקשר"
                    >
                      <Phone className="size-3.5" />
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="size-7 hover:bg-green-50 hover:text-green-600"
                      onClick={(e) => handleWhatsApp(client.phone_number, e)}
                      title="וואטסאפ"
                    >
                      <MessageSquare className="size-3.5" />
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="size-7 hover:bg-accent"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="size-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewClient(client.id);
                          }}
                          className="gap-2 text-xs"
                        >
                          <Eye className="size-3.5" />
                          צפייה בפרטים
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={(e) => handleEditClient(client.id, e)}
                          className="gap-2 text-xs"
                        >
                          <Edit className="size-3.5" />
                          ערוך פרטים
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteClient(client.id);
                          }}
                          className="gap-2 text-xs text-red-600"
                        >
                          <UserPlus className="size-3.5" />
                          מחק לקוח
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalClients > pageSize && (
        <div className="flex justify-center">
          <div className="flex items-center gap-2 bg-card rounded-lg border p-1 shadow-soft">
            <Button 
              variant="ghost" 
              size="sm"
              disabled={currentPage === 1}
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              className="hover:bg-accent text-xs"
            >
              הקודם
            </Button>
            <div className="flex items-center px-3 text-xs font-medium text-muted-foreground">
              עמוד {currentPage} מתוך {Math.ceil(totalClients / pageSize)}
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              disabled={currentPage >= Math.ceil(totalClients / pageSize)}
              onClick={() => onPageChange(currentPage + 1)}
              className="hover:bg-accent text-xs"
            >
              הבא
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsTableView;
