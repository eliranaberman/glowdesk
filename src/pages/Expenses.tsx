import { useState, useEffect } from 'react';
import { DollarSign, Upload, FileText, Trash2, Filter, Calendar, Plus } from 'lucide-react';
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
import { he } from 'date-fns/locale';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow
} from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useAuth } from '@/contexts/AuthContext';
import {
  getExpenses,
  getExpensesByDateRange,
  getExpensesByCategory,
  addExpense,
  deleteExpense,
  uploadInvoice,
  getExpenseCategories,
  type Expense
} from '@/services/expensesService';

const formSchema = z.object({
  date: z.date({
    required_error: "יש לבחור תאריך",
  }),
  amount: z.string().min(1, { message: "יש להזין סכום" }),
  category: z.string().min(1, { message: "יש לבחור קטגוריה" }),
  description: z.string().optional(),
  vendor: z.string().min(1, { message: "יש להזין שם ספק" }),
  payment_method: z.string().optional(),
});

const Expenses = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [canModifyExpenses, setCanModifyExpenses] = useState(true); 
  const [expenseCategories, setExpenseCategories] = useState<string[]>([
    "חומרים", "ציוד", "שכירות", "שיווק", "משכורות", "הכשרה", "אחר"
  ]);
  const [filterCategory, setFilterCategory] = useState<string>('');
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
    },
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      try {
        // Check if there are saved expenses in localStorage
        const savedExpenses = localStorage.getItem('expenses');
        if (savedExpenses) {
          const parsedExpenses = JSON.parse(savedExpenses);
          setExpenses(parsedExpenses);
        } else {
          // Add sample expenses for new users (6 total)
          const sampleExpenses: Expense[] = [
            {
              id: '1',
              amount: 450,
              category: 'חומרים',
              vendor: 'חנות הציפורניים',
              description: 'לק ג\'ל צבעוני וקובצי',
              date: '2025-01-10',
              payment_method: 'אשראי',
              has_invoice: true,
              invoice_file_path: null
            },
            {
              id: '2',
              amount: 220,
              category: 'ציוד',
              vendor: 'BeautyPro',
              description: 'מנורת UV חדשה',
              date: '2025-01-08',
              payment_method: 'מזומן',
              has_invoice: false,
              invoice_file_path: null
            },
            {
              id: '3',
              amount: 180,
              category: 'שיווק',
              vendor: 'פייסבוק',
              description: 'פרסום במדיה חברתית',
              date: '2025-01-05',
              payment_method: 'אשראי',
              has_invoice: true,
              invoice_file_path: null
            },
            {
              id: '4',
              amount: 320,
              category: 'חומרים',
              vendor: 'נייל אקספרס',
              description: 'אצטון ותכשירי ניקוי',
              date: '2025-01-03',
              payment_method: 'העברה בנקאית',
              has_invoice: true,
              invoice_file_path: null
            },
            {
              id: '5',
              amount: 150,
              category: 'הכשרה',
              vendor: 'אקדמיית יופי',
              description: 'קורס טכניקות חדשות',
              date: '2025-01-01',
              payment_method: 'אשראי',
              has_invoice: false,
              invoice_file_path: null
            },
            {
              id: '6',
              amount: 280,
              category: 'אחר',
              vendor: 'חברת ביטוח',
              description: 'ביטוח עסק שנתי',
              date: '2024-12-28',
              payment_method: 'העברה בנקאית',
              has_invoice: true,
              invoice_file_path: null
            }
          ];
          setExpenses(sampleExpenses);
          localStorage.setItem('expenses', JSON.stringify(sampleExpenses));
        }
        
        const categories = await getExpenseCategories();
        if (categories.length > 0) {
          setExpenseCategories(categories);
        }
      } catch (error) {
        console.error('Error loading expenses:', error);
        toast({
          title: "שגיאה בטעינת הוצאות",
          description: "אירעה שגיאה בטעינת רשימת ההוצאות",
          variant: "destructive",
        });
      }
      
      setLoading(false);
    };
    
    loadData();
  }, [toast]);

  useEffect(() => {
    const applyFilters = async () => {
      setLoading(true);
      
      try {
        let filteredExpenses: Expense[] = [];
        
        if (filterDateRange.from && filterDateRange.to) {
          const fromStr = format(filterDateRange.from, 'yyyy-MM-dd');
          const toStr = format(filterDateRange.to, 'yyyy-MM-dd');
          filteredExpenses = await getExpensesByDateRange(fromStr, toStr);
        }
        
        if (filterCategory) {
          if (filteredExpenses.length > 0) {
            filteredExpenses = filteredExpenses.filter(e => e.category === filterCategory);
          } else {
            filteredExpenses = await getExpensesByCategory(filterCategory);
          }
        }
        
        if (!filterCategory && !filterDateRange.from && !filterDateRange.to) {
          filteredExpenses = await getExpenses();
        }
        
        setExpenses(filteredExpenses);
      } catch (error) {
        console.error('Error applying filters:', error);
        toast({
          title: "שגיאה בסינון",
          description: "אירעה שגיאה בסינון ההוצאות",
          variant: "destructive",
        });
      }
      
      setLoading(false);
    };
    
    applyFilters();
  }, [filterCategory, filterDateRange, toast]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const newExpense = {
        amount: parseFloat(values.amount),
        category: values.category,
        vendor: values.vendor,
        description: values.description || "",
        date: format(values.date, 'yyyy-MM-dd'),
        payment_method: values.payment_method
      };
      
      const addedExpense = await addExpense(newExpense);
      
      if (addedExpense) {
        setExpenses([addedExpense, ...expenses]);
        
        if (selectedFile && addedExpense.id) {
          await uploadInvoice(selectedFile, addedExpense.id);
        }
        
        form.reset();
        setSelectedFile(null);
        setOpenAddDialog(false);
      }
    } catch (error) {
      console.error('Error adding expense:', error);
      toast({
        title: "שגיאה בהוספת הוצאה",
        description: "אירעה שגיאה בהוספת ההוצאה",
        variant: "destructive",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    
    if (file) {
      toast({
        title: "קובץ נבחר",
        description: `${file.name} נבחר בהצלחה`,
      });
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      const success = await deleteExpense(id);
      if (success) {
        setExpenses(expenses.filter(expense => expense.id !== id));
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast({
        title: "שגיאה במחיקת הוצאה",
        description: "אירעה שגיאה במחיקת ההוצאה",
        variant: "destructive",
      });
    }
  };

  const clearFilters = () => {
    setFilterCategory('');
    setFilterDateRange({
      from: undefined,
      to: undefined,
    });
  };

  const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);

  return (
    <div className="space-y-6 p-6" dir="rtl">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">ניהול הוצאות</h1>
        <div className="flex gap-2">
          {canModifyExpenses && (
            <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  הוסף הוצאה
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[95vw] sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>הוספת הוצאה חדשה</DialogTitle>
                  <DialogDescription>
                    הזן את פרטי ההוצאה החדשה להוספה למערכת
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>תאריך</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className={`w-full justify-between ${!field.value && "text-muted-foreground"}`}
                                  >
                                    {field.value ? format(field.value, "P", { locale: he }) : "בחר תאריך"}
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
                            <FormLabel>סכום (₪)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="100" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="vendor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>שם ספק</FormLabel>
                          <FormControl>
                            <Input placeholder="הזן שם ספק" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>קטגוריה</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="בחר קטגוריה" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {expenseCategories.map(category => (
                                <SelectItem key={category} value={category}>
                                  {category}
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
                          <FormLabel>אמצעי תשלום</FormLabel>
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
                          <FormLabel>תיאור (אופציונלי)</FormLabel>
                          <FormControl>
                            <Textarea placeholder="הזן תיאור להוצאה" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div>
                      <Label htmlFor="invoice-upload" className="block mb-2">חשבונית (אופציונלי)</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="invoice-upload"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleFileChange}
                        />
                      </div>
                      {selectedFile && (
                        <p className="text-sm text-muted-foreground mt-1">
                          נבחר: {selectedFile.name}
                        </p>
                      )}
                    </div>
                    <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                      <Button type="submit" className="w-full">שמור הוצאה</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">סה"כ הוצאות</CardTitle>
            <CardDescription>סה"כ ההוצאות המוצגות</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₪{totalExpenses.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">קטגוריה מובילה</CardTitle>
            <CardDescription>קטגוריית ההוצאה הגבוהה ביותר</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {expenses.length > 0 
                ? [...new Set(expenses.map(e => e.category))]
                  .map(cat => ({
                    category: cat,
                    total: expenses
                      .filter(e => e.category === cat)
                      .reduce((sum, e) => sum + e.amount, 0)
                  }))
                  .sort((a, b) => b.total - a.total)[0]?.category || "—"
                : "—"
              }
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">חשבוניות</CardTitle>
            <CardDescription>מספר ההוצאות עם חשבוניות</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {expenses.filter(e => e.has_invoice).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>רשימת הוצאות</CardTitle>
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
                  <TableHead>תאריך</TableHead>
                  <TableHead>ספק</TableHead>
                  <TableHead>קטגוריה</TableHead>
                  <TableHead>תיאור</TableHead>
                  <TableHead>סכום</TableHead>
                  <TableHead>חשבונית</TableHead>
                  {canModifyExpenses && (
                    <TableHead>פעולות</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={canModifyExpenses ? 7 : 6} className="text-center py-8">
                      לא נמצאו הוצאות
                    </TableCell>
                  </TableRow>
                ) : (
                  expenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>
                        {format(new Date(expense.date), "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell>{expense.vendor}</TableCell>
                      <TableCell>{expense.category}</TableCell>
                      <TableCell>{expense.description || "—"}</TableCell>
                      <TableCell className="font-medium">₪{expense.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        {expense.has_invoice ? (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => {
                              if (expense.invoice_file_path) {
                                window.open(expense.invoice_file_path, '_blank');
                              }
                            }}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                        ) : (
                          <span className="text-muted-foreground">אין</span>
                        )}
                      </TableCell>
                      {canModifyExpenses && (
                        <TableCell>
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
                                  פעולה זו לא ניתנת לביטול. ההוצאה תימחק לצמיתות מרשימת ההוצאות שלך.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>ביטול</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteExpense(expense.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
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
  );
};

export default Expenses;
