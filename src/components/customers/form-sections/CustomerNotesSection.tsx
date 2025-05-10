
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { CustomerFormValues } from '../schema/customerFormSchema';

interface CustomerNotesSectionProps {
  form: UseFormReturn<CustomerFormValues>;
}

const CustomerNotesSection = ({ form }: CustomerNotesSectionProps) => {
  return (
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
  );
};

export default CustomerNotesSection;
