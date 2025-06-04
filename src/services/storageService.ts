
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const createBucketIfNotExists = async (bucketName: string): Promise<boolean> => {
  try {
    // Check if bucket exists by trying to list files in it
    const { data, error } = await supabase.storage.from(bucketName).list();
    
    if (!error) {
      console.log(`Storage bucket '${bucketName}' exists and is accessible`);
      return true;
    }
    
    // If we get here, the bucket might not exist or we don't have access
    console.log(`Storage bucket '${bucketName}' isn't accessible or doesn't exist`);
    return false;
  } catch (error) {
    console.error('Error checking storage bucket:', error);
    return false;
  }
};

export const initializeStorage = async (): Promise<void> => {
  // Check for necessary buckets when the app starts
  try {
    await createBucketIfNotExists('expenses');
    await createBucketIfNotExists('portfolio');
    console.log('Storage initialization complete');
  } catch (error) {
    console.error('Storage initialization error:', error);
  }
};
