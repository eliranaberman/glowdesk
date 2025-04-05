
import { useState } from 'react';
import { DollarSign, Upload, FileText, FileImage } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { he } from 'date-fns/locale';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

// Define form schema
const formSchema = z.object({
  date: z.date({
    required_error: "יש לבחור תאריך",
  }),
  amount: z.string().min(1, { message: "יש להזין סכום" }),
  category: z.string().min(1, { message: "יש לבחור קטגוריה" }),
  description: z.string().optional(),
  vendor: z.string().min(1, { message: "יש להזין שם ספק" }),
});

// Example expense categories
const expenseCategories = [
  "חומרים", "ציוד", "שכירות", "שיווק", "משכורות", "הכשרה", "אחר"
];

// Example expenses data
const exampleExpenses = [
  { 
    id: "1", 
    date: new Date(2025, 3, 1), 
    amount: "450", 
    category: "חומרים", 
    description: "רכישת חומרים לטיפולים", 
    vendor: "ספק א",
    hasInvoice: true
  },
  { 
    id: "2", 
    date: new Date(2025, 3, 5), 
    amount: "1200", 
    category: "שכירות", 
    description: "תשלום שכירות חודשי", 
    vendor: "בעל הנכס",
    hasInvoice: true
  },
  { 
    id: "3", 
    date: new Date(2025, 3, 10), 
    amount: "350", 
    category: "שיווק", 
    description: "פרסום בפייסבוק", 
    vendor: "פייסבוק",
    hasInvoice: false
  },
];

const Expenses = () => {
  const { toast } = useToast();
  const [expenses, setExpenses] = useState(exampleExpenses);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const newExpense = {
      id: (expenses.length + 1).toString(),
      date: values.date,
      amount: values.amount,
      category: values.category,
      description: values.description || "",
      vendor: values.vendor,
      hasInvoice: !!selectedFile
    };
    
    setExpenses([...expenses, newExpense]);
    form.reset();
    setSelectedFile(null);
    setOpenAddDialog(false);
    
    toast({
      title: "הוצאה נוספה בהצלחה",
      description: `הוצאה בסך ${values.amount} ₪ נוספה`,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    
    if (file) {
      toast({
        title: "קובץ נבחר",
        description: `${file.name} הועלה בהצלחה`,
      });
      setOpenUploadDialog(false);
    }
  };

  // Calculate total expenses
  const totalExpenses = expenses.reduce((total, expense) => total + parseFloat(expense.amount), 0);

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">ניהול הוצאות</h1>
        <div className="flex gap-2">
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
                                  <CalendarIcon className="ml-auto h-4 w-4" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
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
          
          <Dialog open={openUploadDialog} onOpenChange={setOpenUploadDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Upload className="h-4 w-4" />
                העלאת חשבוניות
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="text-right">העלאת חשבוניות</DialogTitle>
                <DialogDescription className="text-right">
                  העלה חשבונית דיגיטלית או צילום של חשבונית פיזית
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="flex flex-col items-center gap-2 p-8 border-dashed">
                    <FileText className="h-12 w-12 text-muted-foreground" />
                    <span>חשבונית דיגיטלית</span>
                    <span className="text-xs text-muted-foreground">.pdf</span>
                  </Button>
                  <Button variant="outline" className="flex flex-col items-center gap-2 p-8 border-dashed">
                    <FileImage className="h-12 w-12 text-muted-foreground" />
                    <span>צילום חשבונית</span>
                    <span className="text-xs text-muted-foreground">.jpg, .png</span>
                  </Button>
                </div>
                <div className="mt-2">
                  <Input 
                    type="file" 
                    accept=".pdf,.jpg,.jpeg,.png" 
                    onChange={handleFileChange}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" className="w-full" disabled={!selectedFile}>
                  העלאה
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">סה"כ הוצאות</CardTitle>
            <CardDescription>סה"כ ההוצאות החודשיות</CardDescription>
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
            <div className="text-2xl font-bold">שכירות</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">חשבוניות שהועלו</CardTitle>
            <CardDescription>מספר החשבוניות שהועלו למערכת</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expenses.filter(e => e.hasInvoice).length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>הוצאות אחרונות</CardTitle>
          <CardDescription>רשימת ההוצאות האחרונות של העסק</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="text-xs uppercase bg-muted">
                <tr>
                  <th scope="col" className="px-6 py-3">תאריך</th>
                  <th scope="col" className="px-6 py-3">ספק</th>
                  <th scope="col" className="px-6 py-3">קטגוריה</th>
                  <th scope="col" className="px-6 py-3">תיאור</th>
                  <th scope="col" className="px-6 py-3">סכום</th>
                  <th scope="col" className="px-6 py-3">חשבונית</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense.id} className="bg-card border-b">
                    <td className="px-6 py-4">{format(expense.date, "dd/MM/yyyy")}</td>
                    <td className="px-6 py-4">{expense.vendor}</td>
                    <td className="px-6 py-4">{expense.category}</td>
                    <td className="px-6 py-4">{expense.description || "—"}</td>
                    <td className="px-6 py-4 font-medium">₪{parseFloat(expense.amount).toFixed(2)}</td>
                    <td className="px-6 py-4">
                      {expense.hasInvoice ? (
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <FileText className="h-4 w-4" />
                        </Button>
                      ) : (
                        <span className="text-muted-foreground">אין</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Expenses;
