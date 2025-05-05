
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ImageUploader } from './ImageUploader';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { createPortfolioItem } from '@/services/portfolioService';
import { PortfolioItemFormData } from '@/types/portfolio';

const formSchema = z.object({
  title: z.string().min(2, { message: 'יש להזין כותרת של לפחות 2 תווים' }),
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) return;
    if (!selectedImage) {
      alert('יש לבחור תמונה');
      return;
    }

    setIsSubmitting(true);
    
    const formData: PortfolioItemFormData = {
      title: values.title,
      description: values.description || '',
      image: selectedImage,
    };

    const result = await createPortfolioItem(formData, user.id);
    
    setIsSubmitting(false);
    
    if (result.success) {
      form.reset();
      setSelectedImage(null);
      onSuccess();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <ImageUploader
          onImageSelected={setSelectedImage}
          className="mb-6"
        />
        
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>כותרת</FormLabel>
              <FormControl>
                <Input placeholder="הזן כותרת לתמונה" {...field} />
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
              <FormLabel>תיאור</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="הזן תיאור (לא חובה)" 
                  className="resize-none"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            ביטול
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !selectedImage}
          >
            {isSubmitting ? 'מעלה...' : 'הוספה לגלריה'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
