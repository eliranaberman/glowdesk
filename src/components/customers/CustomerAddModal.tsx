
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Form validation schema
const customerSchema = z.object({
  full_name: z.string().min(2, { message: "שם חייב להכיל לפחות 2 תווים" }),
  phone_number: z
    .string()
    .regex(/^0(5[^7]|[2-4]|[8-9]|7[0-9])-?[0-9]{7}$/, { 
      message: "נא להזין מספר טלפון ישראלי תקין (לדוגמא: 050-1234567)" 
    }),
  email: z.string().email({ message: "אימייל לא תקין" }).optional().or(z.literal('')),
  birthday: z.string().optional().or(z.literal('')),
});

type FormValues = z.infer<typeof customerSchema>;

interface CustomerAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CustomerAddModal = ({ isOpen, onClose, onSuccess }: CustomerAddModalProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      full_name: "",
      phone_number: "",
      email: "",
      birthday: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      
      // Prepare data for insertion
      const customerData = {
        full_name: values.full_name,
        phone_number: values.phone_number,
        email: values.email || null,
        birthday: values.birthday || null,
        registration_date: new Date().toISOString().split('T')[0],
        status: 'active',
      };
      
      // Insert to Supabase
      const { error } = await supabase
        .from('clients')
        .insert([customerData]);
      
      if (error) throw error;
      
      // Show success message
      toast({
        title: "לקוח נוסף בהצלחה",
        description: `${values.full_name} נוסף/ה לרשימת הלקוחות`,
      });
      
      // Reset form and close modal
      form.reset();
      onSuccess();
      onClose();
      
    } catch (error: any) {
      console.error('Error adding customer:', error);
      toast({
        variant: "destructive",
        title: "שגיאה בהוספת לקוח",
        description: error.message || "אירעה שגיאה בעת הוספת הלקוח",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent dir="rtl" className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-right text-xl font-bold">הוספת לקוח חדש</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 text-right">
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>שם מלא *</FormLabel>
                  <FormControl>
                    <Input placeholder="הכנס שם מלא" {...field} />
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
                  <FormLabel>מספר טלפון *</FormLabel>
                  <FormControl>
                    <Input placeholder="הכנס מספר טלפון (050-1234567)" {...field} dir="ltr" />
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
                    <Input placeholder="הכנס כתובת אימייל" type="email" {...field} dir="ltr" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="birthday"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>תאריך לידה</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                ביטול
              </Button>
              
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "מוסיף..." : "הוסף לקוח"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerAddModal;
