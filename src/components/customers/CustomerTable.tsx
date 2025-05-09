
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
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface CustomerTableProps {
  customers: any[];
  onDelete?: (id: string) => void;
}

const CustomerTable = ({ customers, onDelete }: CustomerTableProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);

  const handleViewCustomer = (id: string) => {
    navigate(`/customers/${id}`);
  };

  const handleEditCustomer = (id: string) => {
    navigate(`/customers/${id}/edit`);
  };

  const openDeleteDialog = (id: string) => {
    setDeletingId(id);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setDeletingId(null);
  };

  const handleDeleteCustomer = async () => {
    if (!deletingId) return;
    
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', deletingId);
        
      if (error) throw error;
      
      toast({
        title: "הלקוח נמחק בהצלחה",
        description: "פרטי הלקוח הוסרו מהמערכת",
      });
      
      // Call the onDelete callback if provided
      if (onDelete) {
        onDelete(deletingId);
      }
    } catch (error: any) {
      console.error('Error deleting customer:', error);
      toast({
        variant: "destructive",
        title: "שגיאה במחיקת הלקוח",
        description: error.message || "לא ניתן למחוק את הלקוח כרגע",
      });
    } finally {
      closeDeleteDialog();
    }
  };

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">שם מלא</TableHead>
              <TableHead className="text-right">טלפון</TableHead>
              <TableHead className="text-right">אימייל</TableHead>
              <TableHead className="text-right">סטטוס</TableHead>
              <TableHead className="text-right">תאריך רישום</TableHead>
              <TableHead className="w-[120px] text-right">פעולות</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium text-right">{customer.full_name}</TableCell>
                <TableCell className="text-right">{customer.phone_number || customer.phone || "—"}</TableCell>
                <TableCell className="text-right">{customer.email || "—"}</TableCell>
                <TableCell className="text-right">
                  {customer.status ? (
                    <Badge variant={customer.status === "active" ? "outline" : "secondary"}>
                      {customer.status === "active" ? "פעיל" : customer.status}
                    </Badge>
                  ) : "—"}
                </TableCell>
                <TableCell className="text-right">
                  {customer.registration_date ? 
                    format(new Date(customer.registration_date), 'dd/MM/yyyy') : 
                    "—"}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1 justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openDeleteDialog(customer.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditCustomer(customer.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewCustomer(customer.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent dir="rtl" className="text-right">
          <AlertDialogHeader>
            <AlertDialogTitle>האם אתה בטוח שברצונך למחוק?</AlertDialogTitle>
            <AlertDialogDescription>
              פעולה זו אינה הפיכה. מחיקת הלקוח תסיר את כל הנתונים שלו מהמערכת.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex">
            <AlertDialogCancel className="mr-auto">ביטול</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCustomer} className="bg-red-500 hover:bg-red-700">
              מחק
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CustomerTable;
