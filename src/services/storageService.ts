
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const createBucketIfNotExists = async (bucketName: string): Promise<boolean> => {
  try {
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase
      .storage
      .listBuckets();
      
    if (listError) {
      console.error('Error listing buckets:', listError);
      return false;
    }
    
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      // Due to RLS policies, we might not have permission to create buckets directly
      // So instead we'll check for bucket access
      try {
        // Try to list files in the bucket - if it doesn't exist, this will fail
        await supabase.storage.from(bucketName).list();
        console.log(`Storage bucket '${bucketName}' exists and is accessible`);
        return true;
      } catch (error) {
        console.log(`Storage bucket '${bucketName}' isn't accessible or doesn't exist`);
        console.error('Bucket access error:', error);
        // We don't show an error toast here as this is expected for new buckets
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error checking storage bucket:', error);
    // Only show the error toast when we encounter an unexpected error
    if (error instanceof Error && error.message !== 'new row violates row-level security policy') {
      toast({
        title: 'שגיאה בבדיקת מאגר קבצים',
        description: 'אירעה שגיאה בבדיקת מאגר הקבצים. נסה שוב מאוחר יותר.',
        variant: 'destructive',
      });
    }
    return false;
  }
};

export const initializeStorage = async (): Promise<void> => {
  // Check for necessary buckets when the app starts
  // But don't try to create them directly
  try {
    await createBucketIfNotExists('expenses');
    await createBucketIfNotExists('profile-images');
    console.log('Storage initialization complete');
  } catch (error) {
    console.error('Storage initialization error:', error);
  }
};
