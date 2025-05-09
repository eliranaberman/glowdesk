
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

interface CustomerTableProps {
  customers: any[];
}

const CustomerTable = ({ customers }: CustomerTableProps) => {
  const navigate = useNavigate();

  const handleViewCustomer = (id: string) => {
    navigate(`/customers/${id}`);
  };

  const handleEditCustomer = (id: string) => {
    navigate(`/customers/${id}/edit`);
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>שם מלא</TableHead>
            <TableHead>טלפון</TableHead>
            <TableHead>אימייל</TableHead>
            <TableHead>סטטוס</TableHead>
            <TableHead>תאריך רישום</TableHead>
            <TableHead className="w-[100px]">פעולות</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell className="font-medium">{customer.full_name}</TableCell>
              <TableCell>{customer.phone_number || customer.phone || "—"}</TableCell>
              <TableCell>{customer.email || "—"}</TableCell>
              <TableCell>
                {customer.status ? (
                  <Badge variant={customer.status === "active" ? "outline" : "secondary"}>
                    {customer.status === "active" ? "פעיל" : customer.status}
                  </Badge>
                ) : "—"}
              </TableCell>
              <TableCell>
                {customer.registration_date ? 
                  format(new Date(customer.registration_date), 'dd/MM/yyyy') : 
                  "—"}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleViewCustomer(customer.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditCustomer(customer.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CustomerTable;
