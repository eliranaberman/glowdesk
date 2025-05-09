
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Form validation schema
const customerSchema = z.object({
  full_name: z.string().min(2, { message: "שם חייב להכיל לפחות 2 תווים" }),
  phone_number: z.string().optional(),
  email: z.string().email({ message: "אימייל לא תקין" }).optional().or(z.literal('')),
});

type FormValues = z.infer<typeof customerSchema>;

const CustomerEditForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      full_name: "",
      phone_number: "",
      email: "",
    },
  });

  // Fetch customer data
  useEffect(() => {
    const fetchCustomer = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          // Set form values from fetched data
          form.reset({
            full_name: data.full_name || '',
            phone_number: data.phone_number || data.phone || '',
            email: data.email || '',
          });
        }
      } catch (err: any) {
        console.error('Error loading customer:', err);
        setError(err.message);
        toast({
          variant: "destructive",
          title: "שגיאה בטעינת פרטי לקוח",
          description: err.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id, form, toast]);

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    if (!id) return;
    
    try {
      setSubmitting(true);
      setError(null);
      
      const { error } = await supabase
        .from('clients')
        .update({
          full_name: values.full_name,
          phone_number: values.phone_number,
          email: values.email,
        })
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "עדכון בוצע בהצלחה",
        description: "פרטי הלקוח עודכנו בהצלחה",
      });
      
      navigate('/customers');
    } catch (err: any) {
      console.error('Error updating customer:', err);
      setError(err.message);
      toast({
        variant: "destructive",
        title: "שגיאה בעדכון פרטי לקוח",
        description: err.message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto" dir="rtl">
      <Card>
        <CardHeader>
          <CardTitle className="text-right">עריכת פרטי לקוח</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>שגיאה</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 text-right">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>שם מלא</FormLabel>
                    <FormControl>
                      <Input placeholder="שם מלא" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>טלפון</FormLabel>
                    <FormControl>
                      <Input placeholder="טלפון" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>אימייל</FormLabel>
                    <FormControl>
                      <Input placeholder="אימייל" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? "מעדכן..." : "עדכן לקוח"}
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

export default CustomerEditForm;
