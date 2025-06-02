
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ImageUploader } from './ImageUploader';
import { createPortfolioItem } from '@/services/portfolioService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, X } from 'lucide-react';

const formSchema = z.object({
  title: z.string().min(1, 'כותרת היא שדה חובה'),
  description: z.string().optional(),
});

interface PortfolioItemFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const PortfolioItemForm = ({ onSuccess, onCancel }: PortfolioItemFormProps) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!selectedImage) {
      toast({
        title: "תמונה נדרשת",
        description: "אנא בחר תמונה להעלאה",
        variant: "destructive"
      });
      return;
    }

    if (!user?.id) {
      toast({
        title: "שגיאת אימות",
        description: "יש להתחבר למערכת",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createPortfolioItem(
        {
          ...values,
          image: selectedImage,
        },
        user.id
      );

      if (result.success) {
        onSuccess();
        form.reset();
        setSelectedImage(null);
      }
    } catch (error) {
      console.error('Error creating portfolio item:', error);
      toast({
        title: "שגיאה בהעלאת הפריט",
        description: "אנא נסה שוב מאוחר יותר",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Image Upload Section */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-900">תמונה *</label>
        <ImageUploader
          onImageSelected={setSelectedImage}
          className="w-full"
        />
      </div>

      {/* Form Section */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium text-gray-900">כותרת *</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="הזן כותרת לתמונה..." 
                    {...field}
                    className="rounded-xl border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium text-gray-900">תיאור (אופציונלי)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="הוסף תיאור לתמונה..."
                    rows={4}
                    {...field}
                    className="rounded-xl border-gray-300 focus:border-pink-500 focus:ring-pink-500 resize-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              disabled={isSubmitting || !selectedImage}
              className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl py-3 font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                  מעלה...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 ml-2" />
                  שמור בגלריה
                </>
              )}
            </Button>
            
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="px-6 py-3 rounded-xl border-gray-300 hover:bg-gray-50"
              disabled={isSubmitting}
            >
              <X className="h-4 w-4 ml-2" />
              ביטול
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
