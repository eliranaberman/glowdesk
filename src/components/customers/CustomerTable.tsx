import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Edit, Trash, Phone, Mail, Clock, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastAppointment: string;
  totalVisits: number;
  totalSpent: number;
  status: 'active' | 'inactive';
}

interface CustomerTableProps {
  customers: Customer[];
  onEditCustomer: (id: string) => void;
  onDeleteCustomer: (id: string) => void;
  onAddCustomer: () => void;
}

const CustomerTable = ({
  customers,
  onEditCustomer,
  onDeleteCustomer,
  onAddCustomer,
}: CustomerTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Customer>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    // Handle different types of fields appropriately
    if (sortField === 'totalSpent' || sortField === 'totalVisits') {
      return sortDirection === 'asc'
        ? a[sortField] - b[sortField]
        : b[sortField] - a[sortField];
    }

    if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (field: keyof Customer) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatusText = (status: 'active' | 'inactive') => {
    return status === 'active' ? 'פעיל' : 'לא פעיל';
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="חיפוש לקוחות..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
        </div>
        <Button onClick={onAddCustomer}>
          הוספת לקוח
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                onClick={() => handleSort('name')}
                className="cursor-pointer hover:bg-muted"
              >
                לקוח
              </TableHead>
              <TableHead 
                onClick={() => handleSort('lastAppointment')}
                className="cursor-pointer hover:bg-muted"
              >
                תור אחרון
              </TableHead>
              <TableHead 
                onClick={() => handleSort('totalVisits')}
                className="cursor-pointer hover:bg-muted text-right"
              >
                סה"כ ביקורים
              </TableHead>
              <TableHead 
                onClick={() => handleSort('totalSpent')}
                className="cursor-pointer hover:bg-muted text-center"
              >
                סה"כ תשלום מצטבר
              </TableHead>
              <TableHead 
                onClick={() => handleSort('status')}
                className="cursor-pointer hover:bg-muted"
              >
                סטטוס
              </TableHead>
              <TableHead className="text-right">פעולות</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedCustomers.length > 0 ? (
              sortedCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <div className="flex flex-col xs:flex-row gap-2 text-xs text-muted-foreground mt-1">
                        <div className="flex items-center">
                          <Mail className="h-3 w-3 ml-1" />
                          <span>{customer.email}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-3 w-3 ml-1" />
                          <span>{customer.phone}</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 ml-1 text-muted-foreground" />
                      <span>{customer.lastAppointment}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end">
                      <Clock className="h-3 w-3 ml-1 text-muted-foreground" />
                      <span>{customer.totalVisits}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-medium">
                    <span className="inline-block w-full text-center">₪{customer.totalSpent}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={customer.status === 'active' ? 'default' : 'secondary'}>
                      {getStatusText(customer.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEditCustomer(customer.id)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">עריכה</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDeleteCustomer(customer.id)}
                      >
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">מחיקה</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  לא נמצאו לקוחות
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CustomerTable;
