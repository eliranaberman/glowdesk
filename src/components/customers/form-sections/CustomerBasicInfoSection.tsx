
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { CustomerFormValues } from '../schema/customerFormSchema';

interface CustomerBasicInfoSectionProps {
  form: UseFormReturn<CustomerFormValues>;
}

const CustomerBasicInfoSection = ({ form }: CustomerBasicInfoSectionProps) => {
  return (
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
                <SelectItem value="lead">לקוח פוטנציאלי</SelectItem>
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
                <SelectItem value="none">ללא</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default CustomerBasicInfoSection;
