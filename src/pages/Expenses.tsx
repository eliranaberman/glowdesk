
import { useState, useEffect } from 'react';
import { DollarSign, Upload, FileText, FileImage, Trash2, Filter, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge'; // Added Badge import
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
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow
} from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { usePermissions } from '@/hooks/use-permissions';
import { useAuth } from '@/contexts/AuthContext';
import {
  getExpenses,
  getExpensesByDateRange,
  getExpensesByCategory,
  addExpense,
  updateExpense,
  deleteExpense,
  uploadInvoice,
  getExpenseCategories,
  getExpenseSummaryByMonth,
  type Expense
} from '@/services/expensesService';

// Define form schema
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
  const { canWrite, canDelete } = usePermissions();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [openFilterDialog, setOpenFilterDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [canModifyExpenses, setCanModifyExpenses] = useState(false);
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
      
      // Load expenses
      const fetchedExpenses = await getExpenses();
      setExpenses(fetchedExpenses);
      
      // Load expense categories
      const categories = await getExpenseCategories();
      if (categories.length > 0) {
        setExpenseCategories(categories);
      }
      
      setLoading(false);
    };
    
    loadData();
  }, []);
  
  useEffect(() => {
    const checkPermissions = async () => {
      if (user?.id) {
        const hasWritePermission = await canWrite('expenses');
        setCanModifyExpenses(hasWritePermission);
      }
    };

    checkPermissions();
  }, [user, canWrite]);

  // Handle filtering
  useEffect(() => {
    const applyFilters = async () => {
      setLoading(true);
      
      let filteredExpenses: Expense[] = [];
      
      // Apply date range filter
      if (filterDateRange.from && filterDateRange.to) {
        const fromStr = format(filterDateRange.from, 'yyyy-MM-dd');
        const toStr = format(filterDateRange.to, 'yyyy-MM-dd');
        filteredExpenses = await getExpensesByDateRange(fromStr, toStr);
      }
      
      // Apply category filter (if both filters active, category filter applies on date-filtered results)
      if (filterCategory) {
        if (filteredExpenses.length > 0) {
          filteredExpenses = filteredExpenses.filter(e => e.category === filterCategory);
        } else {
          filteredExpenses = await getExpensesByCategory(filterCategory);
        }
      }
      
      // If no filters active, get all expenses
      if (!filterCategory && !filterDateRange.from && !filterDateRange.to) {
        filteredExpenses = await getExpenses();
      }
      
      setExpenses(filteredExpenses);
      setLoading(false);
    };
    
    applyFilters();
  }, [filterCategory, filterDateRange]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
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
      
      // Upload invoice if selected
      if (selectedFile && addedExpense.id) {
        await uploadInvoice(selectedFile, addedExpense.id);
      }
      
      form.reset();
      setSelectedFile(null);
      setOpenAddDialog(false);
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
    const canUserDelete = await canDelete('expenses');
    if (!canUserDelete) {
      toast({
        title: "אין הרשאות",
        description: "אין לך הרשאה למחוק הוצאות",
        variant: "destructive",
      });
      return;
    }
    
    const success = await deleteExpense(id);
    if (success) {
      setExpenses(expenses.filter(expense => expense.id !== id));
    }
  };

  const clearFilters = () => {
    setFilterCategory('');
    setFilterDateRange({
      from: undefined,
      to: undefined,
    });
  };

  // Calculate total expenses
  const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">ניהול הוצאות</h1>
        <div className="flex gap-2">
          {canModifyExpenses && (
            <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <DollarSign className="h-4 w-4" />
                  הוסף הוצאה
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="text-right">הוספת הוצאה חדשה</DialogTitle>
                  <DialogDescription className="text-right">
                    הזן את פרטי ההוצאה החדשה להוספה למערכת
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
                      name="vendor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-right">שם ספק</FormLabel>
                          <FormControl>
                            <Input placeholder="הזן שם ספק" {...field} className="text-right" />
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
                          <FormLabel className="text-right">קטגוריה</FormLabel>
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
                            <Textarea placeholder="הזן תיאור להוצאה" {...field} className="text-right" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div>
                      <Label htmlFor="invoice-upload" className="text-right block mb-2">חשבונית (אופציונלי)</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="invoice-upload"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleFileChange}
                          className="text-right"
                        />
                      </div>
                      {selectedFile && (
                        <p className="text-sm text-muted-foreground mt-1 text-right">
                          נבחר: {selectedFile.name}
                        </p>
                      )}
                    </div>
                    <DialogFooter>
                      <Button type="submit" className="w-full">שמור הוצאה</Button>
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
                סנן הוצאות
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-right">סינון הוצאות</DialogTitle>
                <DialogDescription className="text-right">
                  סנן את רשימת ההוצאות לפי תאריך או קטגוריה
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label className="text-right block">קטגוריה</Label>
                  <Select
                    value={filterCategory}
                    onValueChange={setFilterCategory}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="בחר קטגוריה" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">כל הקטגוריות</SelectItem>
                      {expenseCategories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
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
            <CardTitle className="text-lg text-right">סה"כ הוצאות</CardTitle>
            <CardDescription className="text-right">סה"כ ההוצאות המוצגות</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-right">₪{totalExpenses.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-right">קטגוריה מובילה</CardTitle>
            <CardDescription className="text-right">קטגוריית ההוצאה הגבוהה ביותר</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-right">
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
            <CardTitle className="text-lg text-right">חשבוניות</CardTitle>
            <CardDescription className="text-right">מספר ההוצאות עם חשבוניות</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-right">
              {expenses.filter(e => e.has_invoice).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-right">רשימת הוצאות</CardTitle>
          {(filterCategory || (filterDateRange.from && filterDateRange.to)) && (
            <div className="flex items-center gap-2 justify-end">
              <span className="text-sm text-muted-foreground">מסונן לפי:</span>
              {filterCategory && (
                <Badge variant="secondary" className="text-xs">
                  {filterCategory}
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
                  <TableHead className="text-right">ספק</TableHead>
                  <TableHead className="text-right">קטגוריה</TableHead>
                  <TableHead className="text-right">תיאור</TableHead>
                  <TableHead className="text-right">סכום</TableHead>
                  <TableHead className="text-right">חשבונית</TableHead>
                  {canModifyExpenses && (
                    <TableHead className="text-right">פעולות</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={canModifyExpenses ? 7 : 6} className="text-center py-8">
                      לא נמצאו הוצאות התואמות את החיפוש
                    </TableCell>
                  </TableRow>
                ) : (
                  expenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell className="text-right">
                        {format(new Date(expense.date), "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell className="text-right">{expense.vendor}</TableCell>
                      <TableCell className="text-right">{expense.category}</TableCell>
                      <TableCell className="text-right">{expense.description || "—"}</TableCell>
                      <TableCell className="text-right font-medium">₪{expense.amount.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
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
