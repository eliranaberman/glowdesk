
import { useState, useEffect } from 'react';
import { DollarSign, Upload, FileText, Filter, Calendar, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow
} from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { usePermissions } from '@/hooks/use-permissions';
import { useAuth } from '@/contexts/AuthContext';
import PermissionGuard from '@/components/auth/PermissionGuard';
import {
  getRevenues,
  getRevenuesByDateRange,
  getRevenuesBySource,
  addRevenue,
  updateRevenue,
  deleteRevenue,
  type Revenue,
  type RevenueCreate
} from '@/services/revenueService';

// Define form schema
const formSchema = z.object({
  date: z.date({
    required_error: "יש לבחור תאריך",
  }),
  amount: z.string().min(1, { message: "יש להזין סכום" }),
  source: z.string().min(1, { message: "יש לבחור מקור הכנסה" }),
  description: z.string().optional(),
  payment_method: z.string().optional(),
  customer_id: z.string().optional(),
  service_id: z.string().optional(),
});

const Revenues = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { canWrite, canDelete } = usePermissions();
  const [revenues, setRevenues] = useState<Revenue[]>([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openFilterDialog, setOpenFilterDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [canModifyRevenues, setCanModifyRevenues] = useState(false);
  const [revenueSources, setRevenueSources] = useState<string[]>([
    "שירותים", "מוצרים", "מנויים", "שוברי מתנה", "אחר"
  ]);
  const [filterSource, setFilterSource] = useState<string>('');
  const [filterDateRange, setFilterDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      payment_method: "",
    },
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      // Load revenues
      const fetchedRevenues = await getRevenues();
      setRevenues(fetchedRevenues);
      
      // In a complete implementation, we would also load revenue sources from backend
      setLoading(false);
    };
    
    loadData();
  }, []);
  
  useEffect(() => {
    const checkPermissions = async () => {
      if (user?.id) {
        const hasWritePermission = await canWrite('finances');
        setCanModifyRevenues(hasWritePermission);
      }
    };

    checkPermissions();
  }, [user, canWrite]);

  // Handle filtering
  useEffect(() => {
    const applyFilters = async () => {
      setLoading(true);
      
      let filteredRevenues: Revenue[] = [];
      
      // Apply date range filter
      if (filterDateRange.from && filterDateRange.to) {
        const fromStr = format(filterDateRange.from, 'yyyy-MM-dd');
        const toStr = format(filterDateRange.to, 'yyyy-MM-dd');
        filteredRevenues = await getRevenuesByDateRange(fromStr, toStr);
      }
      
      // Apply source filter
      if (filterSource) {
        if (filteredRevenues.length > 0) {
          filteredRevenues = filteredRevenues.filter(r => r.source === filterSource);
        } else {
          filteredRevenues = await getRevenuesBySource(filterSource);
        }
      }
      
      // If no filters active, get all revenues
      if (!filterSource && !filterDateRange.from && !filterDateRange.to) {
        filteredRevenues = await getRevenues();
      }
      
      setRevenues(filteredRevenues);
      setLoading(false);
    };
    
    applyFilters();
  }, [filterSource, filterDateRange]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user?.id) {
      toast({
        title: "שגיאה",
        description: "המשתמש אינו מחובר",
        variant: "destructive",
      });
      return;
    }
    
    const newRevenue: RevenueCreate = {
      amount: parseFloat(values.amount),
      source: values.source,
      description: values.description || "",
      date: format(values.date, 'yyyy-MM-dd'),
      payment_method: values.payment_method,
      created_by: user.id,
      customer_id: values.customer_id,
      service_id: values.service_id,
    };
    
    const addedRevenue = await addRevenue(newRevenue);
    
    if (addedRevenue) {
      setRevenues([addedRevenue, ...revenues]);
      form.reset();
      setOpenAddDialog(false);
    }
  };

  const handleDeleteRevenue = async (id: string) => {
    const canUserDelete = await canDelete('finances');
    if (!canUserDelete) {
      toast({
        title: "אין הרשאות",
        description: "אין לך הרשאה למחוק הכנסות",
        variant: "destructive",
      });
      return;
    }
    
    const success = await deleteRevenue(id);
    if (success) {
      setRevenues(revenues.filter(revenue => revenue.id !== id));
    }
  };

  const clearFilters = () => {
    setFilterSource('');
    setFilterDateRange({
      from: undefined,
      to: undefined,
    });
  };

  // Calculate total revenues
  const totalRevenues = revenues.reduce((total, revenue) => total + revenue.amount, 0);

  return (
    <PermissionGuard requiredResource="finances" requiredPermission="read" redirectTo="/dashboard">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">ניהול הכנסות</h1>
          <div className="flex gap-2">
            {canModifyRevenues && (
              <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <DollarSign className="h-4 w-4" />
                    הוסף הכנסה
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle className="text-right">הוספת הכנסה חדשה</DialogTitle>
                    <DialogDescription className="text-right">
                      הזן את פרטי ההכנסה החדשה להוספה למערכת
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="date"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel className="text-right">תאריך</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      className={`w-full text-right justify-between ${!field.value && "text-muted-foreground"}`}
                                    >
                                      {field.value ? format(field.value, "P") : "בחר תאריך"}
                                      <Calendar className="ml-auto h-4 w-4" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                  <CalendarComponent
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) => date > new Date()}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="amount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-right">סכום (₪)</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="100" {...field} className="text-right" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="source"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-right">מקור הכנסה</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="בחר מקור הכנסה" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {revenueSources.map(source => (
                                  <SelectItem key={source} value={source}>
                                    {source}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="payment_method"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-right">אמצעי תשלום</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="בחר אמצעי תשלום" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="אשראי">אשראי</SelectItem>
                                <SelectItem value="מזומן">מזומן</SelectItem>
                                <SelectItem value="העברה בנקאית">העברה בנקאית</SelectItem>
                                <SelectItem value="צ'ק">צ'ק</SelectItem>
                                <SelectItem value="אחר">אחר</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-right">תיאור (אופציונלי)</FormLabel>
                            <FormControl>
                              <Textarea placeholder="הזן תיאור להכנסה" {...field} className="text-right" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <DialogFooter>
                        <Button type="submit" className="w-full">שמור הכנסה</Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            )}
            
            <Dialog open={openFilterDialog} onOpenChange={setOpenFilterDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  סנן הכנסות
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-right">סינון הכנסות</DialogTitle>
                  <DialogDescription className="text-right">
                    סנן את רשימת ההכנסות לפי תאריך או מקור
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label className="text-right block">מקור הכנסה</Label>
                    <Select
                      value={filterSource}
                      onValueChange={setFilterSource}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="בחר מקור הכנסה" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">כל המקורות</SelectItem>
                        {revenueSources.map(source => (
                          <SelectItem key={source} value={source}>{source}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-right block">טווח תאריכים</Label>
                    <div className="flex flex-col space-y-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="justify-between text-right"
                          >
                            {filterDateRange.from ? (
                              format(filterDateRange.from, "dd/MM/yyyy")
                            ) : (
                              "תאריך התחלה"
                            )}
                            <Calendar className="h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={filterDateRange.from}
                            onSelect={(date) => setFilterDateRange(prev => ({ ...prev, from: date }))}
                            disabled={(date) => date > new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="justify-between text-right"
                          >
                            {filterDateRange.to ? (
                              format(filterDateRange.to, "dd/MM/yyyy")
                            ) : (
                              "תאריך סיום"
                            )}
                            <Calendar className="h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={filterDateRange.to}
                            onSelect={(date) => setFilterDateRange(prev => ({ ...prev, to: date }))}
                            disabled={(date) => 
                              (filterDateRange.from && date < filterDateRange.from) || date > new Date()
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
                <DialogFooter className="flex space-x-2 justify-end">
                  <Button variant="outline" onClick={clearFilters}>
                    נקה סינון
                  </Button>
                  <Button onClick={() => setOpenFilterDialog(false)}>
                    סנן
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-right">סה"כ הכנסות</CardTitle>
              <CardDescription className="text-right">סה"כ ההכנסות המוצגות</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-right">₪{totalRevenues.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-right">מקור מוביל</CardTitle>
              <CardDescription className="text-right">מקור ההכנסה הגבוה ביותר</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-right">
                {revenues.length > 0 
                  ? [...new Set(revenues.map(e => e.source))]
                    .map(src => ({
                      source: src,
                      total: revenues
                        .filter(e => e.source === src)
                        .reduce((sum, e) => sum + e.amount, 0)
                    }))
                    .sort((a, b) => b.total - a.total)[0]?.source || "—"
                  : "—"
                }
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-right">ממוצע חודשי</CardTitle>
              <CardDescription className="text-right">הכנסה ממוצעת לחודש</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-right">
                {revenues.length > 0 
                  ? (() => {
                      // Group by month and calculate average
                      const byMonth = revenues.reduce((acc, rev) => {
                        const month = rev.date.substring(0, 7); // Get YYYY-MM
                        if (!acc[month]) acc[month] = 0;
                        acc[month] += rev.amount;
                        return acc;
                      }, {} as Record<string, number>);
                      
                      const monthsCount = Object.keys(byMonth).length;
                      const total = Object.values(byMonth).reduce((sum, val) => sum + val, 0);
                      return monthsCount ? `₪${(total / monthsCount).toFixed(2)}` : "₪0.00";
                    })()
                  : "₪0.00"
                }
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-right">רשימת הכנסות</CardTitle>
            {(filterSource || (filterDateRange.from && filterDateRange.to)) && (
              <div className="flex items-center gap-2 justify-end">
                <span className="text-sm text-muted-foreground">מסונן לפי:</span>
                {filterSource && (
                  <Badge variant="secondary" className="text-xs">
                    {filterSource}
                  </Badge>
                )}
                {filterDateRange.from && filterDateRange.to && (
                  <Badge variant="secondary" className="text-xs">
                    {format(filterDateRange.from, "dd/MM/yyyy")} - {format(filterDateRange.to, "dd/MM/yyyy")}
                  </Badge>
                )}
                <Button variant="ghost" size="sm" onClick={clearFilters} className="h-6 px-2">
                  נקה סינון
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center p-8">
                <div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent"></div>
                <span className="mr-2">טוען נתונים...</span>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">תאריך</TableHead>
                    <TableHead className="text-right">מקור</TableHead>
                    <TableHead className="text-right">תיאור</TableHead>
                    <TableHead className="text-right">אמצעי תשלום</TableHead>
                    <TableHead className="text-right">סכום</TableHead>
                    {canModifyRevenues && (
                      <TableHead className="text-right">פעולות</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {revenues.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={canModifyRevenues ? 6 : 5} className="text-center py-8">
                        לא נמצאו הכנסות התואמות את החיפוש
                      </TableCell>
                    </TableRow>
                  ) : (
                    revenues.map((revenue) => (
                      <TableRow key={revenue.id}>
                        <TableCell className="text-right">
                          {format(new Date(revenue.date), "dd/MM/yyyy")}
                        </TableCell>
                        <TableCell className="text-right">{revenue.source}</TableCell>
                        <TableCell className="text-right">{revenue.description || "—"}</TableCell>
                        <TableCell className="text-right">{revenue.payment_method || "—"}</TableCell>
                        <TableCell className="text-right font-medium">₪{revenue.amount.toFixed(2)}</TableCell>
                        {canModifyRevenues && (
                          <TableCell className="text-right">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive/90 hover:bg-destructive/10">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>האם אתה בטוח?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    פעולה זו לא ניתנת לביטול. ההכנסה תימחק לצמיתות מרשימת ההכנסות שלך.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>ביטול</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteRevenue(revenue.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                    מחק
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </PermissionGuard>
  );
};

export default Revenues;
