
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Customer, 
  CustomerFormData,
  getCustomerById, 
  createCustomer, 
  updateCustomer 
} from '@/services/customerService';
import { useToast } from '@/hooks/use-toast';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, parse } from 'date-fns';
import { X, Plus } from 'lucide-react';

// Form schema validation - update to match Customer type
const customerSchema = z.object({
  full_name: z.string().min(2, { message: "שם חייב להיות לפחות 2 תווים" }),
  email: z.string().email({ message: "יש להזין כתובת אימייל תקינה" }),
  phone_number: z.string().min(9, { message: "מספר טלפון חייב להיות לפחות 9 ספרות" }),
  status: z.enum(["active", "inactive", "lead"]),
  loyalty_level: z.enum(["bronze", "silver", "gold", "none"]),
  notes: z.string().optional(),
  registration_date: z.date(),
  last_appointment: z.date().optional().nullable(),
});

type CustomerFormValues = z.infer<typeof customerSchema> & { tags: string[] };

interface CustomerFormProps {
  isEdit?: boolean;
}

const CustomerForm = ({ isEdit = false }: CustomerFormProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  
  // Form setup
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      full_name: '',
      email: '',
      phone_number: '',
      status: 'active',
      loyalty_level: 'bronze',
      notes: '',
      registration_date: new Date(),
      last_appointment: null,
      tags: [],
    },
  });
  
  // Load customer data for edit mode
  useEffect(() => {
    const loadCustomer = async () => {
      if (!isEdit || !id) return;
      
      try {
        setLoading(true);
        const data = await getCustomerById(id);
        
        // Convert string dates to Date objects for the form
        const formattedData = {
          ...data,
          registration_date: data.registration_date ? new Date(data.registration_date) : new Date(),
          last_appointment: data.last_appointment ? new Date(data.last_appointment) : null,
        };
        
        // Set form values
        form.reset(formattedData);
        setTags(data.tags || []);
      } catch (error) {
        console.error('Error loading customer data:', error);
        toast({
          title: 'שגיאה בטעינת נתוני לקוח',
          description: 'אירעה שגיאה בטעינת נתוני הלקוח. אנא נסה שוב מאוחר יותר.',
          variant: 'destructive',
        });
        navigate('/customers');
      } finally {
        setLoading(false);
      }
    };
    
    loadCustomer();
  }, [isEdit, id, form, navigate, toast]);
  
  // Form submission
  const onSubmit = async (data: CustomerFormValues) => {
    try {
      setLoading(true);
      
      // Prepare data with required fields
      const customerData: CustomerFormData = {
        full_name: data.full_name,
        email: data.email,
        phone_number: data.phone_number,
        status: data.status,
        loyalty_level: data.loyalty_level,
        notes: data.notes || '',
        registration_date: data.registration_date,
        last_appointment: data.last_appointment,
        tags: tags,
      };
      
      if (isEdit && id) {
        // Update existing customer
        await updateCustomer(id, customerData);
        toast({
          title: 'לקוח עודכן בהצלחה',
          description: 'פרטי הלקוח עודכנו במערכת.',
        });
      } else {
        // Create new customer
        await createCustomer(customerData);
        toast({
          title: 'לקוח נוסף בהצלחה',
          description: 'הלקוח החדש נוסף למערכת.',
        });
      }
      
      navigate('/customers');
    } catch (error) {
      console.error('Error saving customer:', error);
      toast({
        title: 'שגיאה בשמירת לקוח',
        description: 'אירעה שגיאה בשמירת פרטי הלקוח. אנא נסה שוב מאוחר יותר.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Tag management
  const addTag = () => {
    if (!newTag.trim()) return;
    
    // Check if tag already exists
    if (!tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    } else {
      toast({
        title: 'תגית קיימת',
        description: 'תגית זו כבר קיימת.',
        variant: 'destructive',
      });
    }
  };
  
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  return (
    <div className="max-w-3xl mx-auto" dir="rtl">
      <Card>
        <CardHeader>
          <CardTitle>
            {isEdit ? 'עריכת פרטי לקוח' : 'הוספת לקוח חדש'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>שם מלא</FormLabel>
                      <FormControl>
                        <Input placeholder="הזן שם מלא" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>כתובת אימייל</FormLabel>
                      <FormControl>
                        <Input placeholder="user@example.com" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Phone */}
                <FormField
                  control={form.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>מספר טלפון</FormLabel>
                      <FormControl>
                        <Input placeholder="050-1234567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Status */}
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>סטטוס</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="בחר סטטוס" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">פעיל</SelectItem>
                          <SelectItem value="inactive">לא פעיל</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Loyalty Level */}
                <FormField
                  control={form.control}
                  name="loyalty_level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>רמת נאמנות</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="בחר רמת נאמנות" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="bronze">ברונזה</SelectItem>
                          <SelectItem value="silver">כסף</SelectItem>
                          <SelectItem value="gold">זהב</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Registration Date */}
                <FormField
                  control={form.control}
                  name="registration_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>תאריך רישום</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={`w-full text-right font-normal ${!field.value ? "text-muted-foreground" : ""}`}
                            >
                              {field.value ? (
                                format(field.value, "dd/MM/yyyy")
                              ) : (
                                <span>בחר תאריך</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
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
                
                {/* Last Appointment */}
                <FormField
                  control={form.control}
                  name="last_appointment"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>תאריך פגישה אחרון</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={`w-full text-right font-normal ${!field.value ? "text-muted-foreground" : ""}`}
                            >
                              {field.value ? (
                                format(field.value, "dd/MM/yyyy")
                              ) : (
                                <span>בחר תאריך</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={field.value || undefined}
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
              </div>
              
              {/* Tags */}
              <div>
                <FormLabel className="mb-2 block">תגיות</FormLabel>
                <div className="flex items-center mb-2">
                  <Input
                    placeholder="הזן תגית חדשה"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="max-w-xs ml-2"
                  />
                  <Button type="button" size="sm" onClick={addTag}>
                    <Plus className="h-4 w-4 ml-1" />
                    הוסף
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      {tag}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                  {tags.length === 0 && (
                    <p className="text-sm text-muted-foreground">אין תגיות</p>
                  )}
                </div>
              </div>
              
              {/* Notes */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>הערות פנימיות</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="הוסף הערות פנימיות כאן..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      הערות פנימיות גלויות רק לצוות המערכת
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Submit & Cancel Buttons */}
              <div className="flex justify-end gap-2">
                <Button type="submit" disabled={loading}>
                  {isEdit ? 'עדכון פרטים' : 'הוספת לקוח'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/customers')}
                >
                  ביטול
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerForm;
