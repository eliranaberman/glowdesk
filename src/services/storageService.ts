
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const createBucketIfNotExists = async (bucketName: string): Promise<boolean> => {
  try {
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase
      .storage
      .listBuckets();
      
    if (listError) throw listError;
    
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      // Create the bucket if it doesn't exist
      const { error: createError } = await supabase
        .storage
        .createBucket(bucketName, {
          public: true, // Make files accessible via URL
          fileSizeLimit: 10485760, // 10MB file size limit
        });
      
      if (createError) throw createError;
      console.log(`Storage bucket '${bucketName}' created successfully`);
    }
    
    return true;
  } catch (error) {
    console.error('Error creating storage bucket:', error);
    toast({
      title: 'שגיאה ביצירת מאגר קבצים',
      description: 'אירעה שגיאה ביצירת מאגר הקבצים. נסה שוב מאוחר יותר.',
      variant: 'destructive',
    });
    return false;
  }
};

export const initializeStorage = async (): Promise<void> => {
  // Create necessary buckets when the app starts
  await createBucketIfNotExists('expenses');
  await createBucketIfNotExists('profile-images');
};
