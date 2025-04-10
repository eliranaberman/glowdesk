import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Customer,
  CustomerFilter,
  getCustomers,
  getUniqueTags,
  markCustomerInactive,
  sendReminder,
} from '@/services/customerService';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination';
import { useToast } from '@/hooks/use-toast';
import { Search, Filter, MoreVertical, Eye, Edit, Bell, X, Mail, Phone, Calendar, Tag } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

interface CustomerListViewProps {
  onError?: (errorMessage: string) => void;
}

const CustomerListView = ({ onError }: CustomerListViewProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAdmin } = useAuth();
  
  // State
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [tags, setTags] = useState<string[]>([]);
  const [showInactiveDialog, setShowInactiveDialog] = useState(false);
  const [customerToDeactivate, setCustomerToDeactivate] = useState<string | null>(null);
  const [showReminderDialog, setShowReminderDialog] = useState(false);
  const [reminderCustomerId, setReminderCustomerId] = useState<string | null>(null);
  
  // Filtering and pagination
  const [filter, setFilter] = useState<CustomerFilter>({
    search: '',
    status: 'all',
    loyalty_level: 'all',
    tags: [],
    sort_by: 'registration_date',
    sort_direction: 'desc',
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Load customers and tags
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const customersData = await getCustomers(filter);
        setCustomers(customersData);
        
        // Load tags only once
        if (tags.length === 0) {
          const tagsData = await getUniqueTags();
          setTags(tagsData);
        }
      } catch (error) {
        console.error('Error loading customers:', error);
        if (onError) {
          onError(error instanceof Error ? error.message : 'Failed to load customers');
        } else {
          toast({
            title: 'שגיאה בטעינת לקוחות',
            description: 'אירעה שגיאה בטעינת רשימת הלקוחות. אנא נסה שוב מאוחר יותר.',
            variant: 'destructive',
          });
        }
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [filter, toast, onError]);
  
  // Handle filter changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter({ ...filter, search: e.target.value });
    setCurrentPage(1);
  };
  
  const handleStatusChange = (value: string) => {
    setFilter({ 
      ...filter, 
      status: value as 'active' | 'inactive' | 'all' 
    });
    setCurrentPage(1);
  };
  
  const handleLoyaltyChange = (value: string) => {
    setFilter({ 
      ...filter, 
      loyalty_level: value as 'bronze' | 'silver' | 'gold' | 'all' 
    });
    setCurrentPage(1);
  };
  
  const handleSortChange = (value: string) => {
    const [field, direction] = value.split('-');
    setFilter({
      ...filter,
      sort_by: field as 'registration_date' | 'last_appointment' | 'full_name',
      sort_direction: direction as 'asc' | 'desc',
    });
    setCurrentPage(1);
  };
  
  // Handle actions
  const handleViewDetails = (id: string) => {
    navigate(`/customers/${id}`);
  };
  
  const handleEdit = (id: string) => {
    navigate(`/customers/edit/${id}`);
  };
  
  const openInactiveDialog = (id: string) => {
    setCustomerToDeactivate(id);
    setShowInactiveDialog(true);
  };
  
  const confirmMarkInactive = async () => {
    if (!customerToDeactivate) return;
    
    try {
      await markCustomerInactive(customerToDeactivate);
      
      // Update local state
      setCustomers(prevCustomers => 
        prevCustomers.map(customer => 
          customer.id === customerToDeactivate 
            ? { ...customer, status: 'inactive' } 
            : customer
        )
      );
      
      toast({
        title: 'לקוח הוגדר כלא פעיל',
        description: 'סטטוס הלקוח עודכן בהצלחה.',
      });
    } catch (error) {
      console.error('Error marking customer inactive:', error);
      if (onError) {
        onError(error instanceof Error ? error.message : 'Failed to update customer status');
      } else {
        toast({
          title: 'שגיאה בעדכון סטטוס',
          description: 'אירעה שגיאה בעדכון סטטוס הלקוח. אנא נסה שוב מאוחר יותר.',
          variant: 'destructive',
        });
      }
    } finally {
      setShowInactiveDialog(false);
      setCustomerToDeactivate(null);
    }
  };
  
  const openReminderDialog = (id: string) => {
    setReminderCustomerId(id);
    setShowReminderDialog(true);
  };
  
  const handleSendReminder = async (method: 'sms' | 'email') => {
    if (!reminderCustomerId) return;
    
    try {
      const result = await sendReminder(reminderCustomerId, method);
      
      toast({
        title: 'תזכורת נשלחה בהצלחה',
        description: `תזכורת נשלחה ללקוח באמצעות ${method === 'sms' ? 'הודעת טקסט' : 'אימייל'}.`,
      });
    } catch (error) {
      console.error(`Error sending ${method} reminder:`, error);
      if (onError) {
        onError(error instanceof Error ? error.message : `Failed to send ${method} reminder`);
      } else {
        toast({
          title: 'שגיאה בשליחת תזכורת',
          description: 'אירעה שגיאה בשליחת התזכורת. אנא נסה שוב מאוחר יותר.',
          variant: 'destructive',
        });
      }
    } finally {
      setShowReminderDialog(false);
      setReminderCustomerId(null);
    }
  };
  
  // Pagination
  const paginatedCustomers = customers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const totalPages = Math.ceil(customers.length / itemsPerPage);
  
  // Format date function
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'לא זמין';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch (error) {
      return dateString;
    }
  };
  
  // Render loading skeleton
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <Skeleton className="h-10 w-full sm:w-72" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-accent/10 p-3 border-b">
            <div className="grid grid-cols-5 gap-4">
              {Array(5).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-6 w-full" />
              ))}
            </div>
          </div>
          
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="p-4 border-b">
              <div className="grid grid-cols-5 gap-4">
                {Array(5).fill(0).map((_, j) => (
                  <Skeleton key={j} className="h-8 w-full" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4" dir="rtl">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="חיפוש לקוחות..."
            value={filter.search}
            onChange={handleSearchChange}
            className="pr-10"
          />
        </div>
        
        <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
          <Select onValueChange={handleStatusChange} defaultValue="all">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="סטטוס" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">כל הסטטוסים</SelectItem>
              <SelectItem value="active">פעיל</SelectItem>
              <SelectItem value="inactive">לא פעיל</SelectItem>
            </SelectContent>
          </Select>
          
          <Select onValueChange={handleLoyaltyChange} defaultValue="all">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="רמת נאמנות" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">כל הרמות</SelectItem>
              <SelectItem value="bronze">ברונזה</SelectItem>
              <SelectItem value="silver">כסף</SelectItem>
              <SelectItem value="gold">זהב</SelectItem>
            </SelectContent>
          </Select>
          
          <Select onValueChange={handleSortChange} defaultValue="registration_date-desc">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="מיון לפי" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="registration_date-desc">תאריך רישום ↓</SelectItem>
              <SelectItem value="registration_date-asc">תאריך רישום ↑</SelectItem>
              <SelectItem value="last_appointment-desc">תור אחרון ↓</SelectItem>
              <SelectItem value="last_appointment-asc">תור אחרון ↑</SelectItem>
              <SelectItem value="full_name-asc">שם (א-ת)</SelectItem>
              <SelectItem value="full_name-desc">שם (ת-א)</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={() => navigate('/customers/new')} className="gap-1">
            הוספת לקוח
          </Button>
        </div>
      </div>
      
      {/* Customer Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>לקוח</TableHead>
              <TableHead>תאריך אחרון</TableHead>
              <TableHead>תגיות</TableHead>
              <TableHead>רמת נאמנות</TableHead>
              <TableHead>סטטוס</TableHead>
              <TableHead className="text-left">פעולות</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCustomers.length > 0 ? (
              paginatedCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{customer.full_name}</p>
                      <div className="flex flex-col xs:flex-row gap-2 text-xs text-muted-foreground mt-1">
                        <div className="flex items-center">
                          <Mail className="h-3 w-3 ml-1" />
                          <span>{customer.email}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-3 w-3 ml-1" />
                          <span>{customer.phone_number}</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 ml-1 text-muted-foreground" />
                      <span>{formatDate(customer.last_appointment)}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      נרשם: {formatDate(customer.registration_date)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-[150px]">
                      {customer.tags && customer.tags.length > 0 ? (
                        customer.tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            <Tag className="h-2.5 w-2.5 ml-1" />
                            {tag}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground">אין תגיות</span>
                      )}
                      {customer.tags && customer.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{customer.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        customer.loyalty_level === 'gold' 
                          ? 'default' 
                          : customer.loyalty_level === 'silver' 
                            ? 'secondary' 
                            : 'outline'
                      }
                      className={
                        customer.loyalty_level === 'gold' 
                          ? 'bg-amber-500' 
                          : customer.loyalty_level === 'silver' 
                            ? 'bg-gray-300 text-primary' 
                            : 'border-amber-900/20 text-amber-900/70'
                      }
                    >
                      {customer.loyalty_level === 'gold' 
                        ? 'זהב' 
                        : customer.loyalty_level === 'silver' 
                          ? 'כסף' 
                          : 'ברונזה'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={customer.status === 'active' ? 'default' : 'secondary'}>
                      {customer.status === 'active' ? 'פעיל' : 'לא פעיל'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end space-x-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">פעולות</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(customer.id)}>
                            <Eye className="h-4 w-4 ml-2" />
                            צפייה בפרטים
                          </DropdownMenuItem>
                          
                          {isAdmin && (
                            <DropdownMenuItem onClick={() => handleEdit(customer.id)}>
                              <Edit className="h-4 w-4 ml-2" />
                              עריכה
                            </DropdownMenuItem>
                          )}
                          
                          <DropdownMenuItem onClick={() => openReminderDialog(customer.id)}>
                            <Bell className="h-4 w-4 ml-2" />
                            שליחת תזכורת
                          </DropdownMenuItem>
                          
                          {isAdmin && customer.status === 'active' && (
                            <DropdownMenuItem onClick={() => openInactiveDialog(customer.id)}>
                              <X className="h-4 w-4 ml-2" />
                              סימון כלא פעיל
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  לא נמצאו לקוחות שתואמים את החיפוש
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink 
                  isActive={page === currentPage}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
          </PaginationContent>
        </Pagination>
      )}
      
      {/* Dialogs */}
      <Dialog open={showInactiveDialog} onOpenChange={setShowInactiveDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>סימון לקוח כלא פעיל</DialogTitle>
            <DialogDescription>
              האם אתה בטוח שברצונך לסמן לקוח זה כלא פעיל? לקוחות שאינם פעילים לא יכולים לקבוע תורים חדשים.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:justify-start">
            <Button
              type="button"
              variant="default"
              onClick={confirmMarkInactive}
            >
              כן, סמן כלא פעיל
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowInactiveDialog(false)}
            >
              ביטול
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showReminderDialog} onOpenChange={setShowReminderDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>שליחת תזכורת</DialogTitle>
            <DialogDescription>
              בחר את שיטת שליחת התזכורת ללקוח
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-start mt-4">
            <Button
              variant="default"
              onClick={() => handleSendReminder('sms')}
            >
              <Phone className="h-4 w-4 ml-2" />
              שלח SMS
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSendReminder('email')}
            >
              <Mail className="h-4 w-4 ml-2" />
              שלח אימייל
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowReminderDialog(false)}
            >
              ביטול
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerListView;
