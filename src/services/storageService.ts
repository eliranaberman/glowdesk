
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const createBucketIfNotExists = async (bucketName: string): Promise<boolean> => {
  try {
    // Check if bucket exists by trying to list files in it
    const { data, error } = await supabase.storage.from(bucketName).list('', { limit: 1 });
    
    if (!error) {
      console.log(`Storage bucket '${bucketName}' exists and is accessible`);
      return true;
    }
    
    // If we get here, the bucket might not exist or we don't have access
    console.log(`Storage bucket '${bucketName}' isn't accessible or doesn't exist:`, error.message);
    return false;
  } catch (error) {
    console.error('Error checking storage bucket:', error);
    return false;
  }
};

export const initializeStorage = async (): Promise<void> => {
  // Check for necessary buckets when the app starts
  try {
    const expensesBucketExists = await createBucketIfNotExists('expenses');
    const portfolioBucketExists = await createBucketIfNotExists('portfolio');
    
    if (expensesBucketExists && portfolioBucketExists) {
      console.log('Storage initialization complete - all buckets available');
    } else {
      console.log('Storage initialization complete - some buckets may not be available:', {
        expenses: expensesBucketExists,
        portfolio: portfolioBucketExists
      });
    }
  } catch (error) {
    console.error('Storage initialization error:', error);
  }
};

// Initialize storage buckets status for user feedback
export const getStorageStatus = async () => {
  const expenses = await createBucketIfNotExists('expenses');
  const portfolio = await createBucketIfNotExists('portfolio');
  
  return {
    expenses,
    portfolio,
    allReady: expenses && portfolio
  };
};
