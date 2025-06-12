
import { supabase } from '@/integrations/supabase/client';
import { PortfolioItem, PortfolioItemFormData } from '@/types/portfolio';
import { toast } from '@/hooks/use-toast';

// Get all portfolio items
export const getPortfolioItems = async (): Promise<PortfolioItem[]> => {
  try {
    console.log('Fetching portfolio items...');
    const { data, error } = await supabase
      .from('portfolio_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching portfolio items:', error);
      throw error;
    }
    
    console.log('Portfolio items fetched successfully:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('Error fetching portfolio items:', error);
    return [];
  }
}

// Upload an image to storage and return the URL
export const uploadPortfolioImage = async (
  file: File,
  userId: string
): Promise<string | null> => {
  try {
    console.log('Starting image upload for user:', userId);
    console.log('File details:', { name: file.name, size: file.size, type: file.type });
    
    // Create a unique file name with proper extension
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${userId}-${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = fileName;

    console.log('Uploading file to path:', filePath);

    // Upload the file to the public portfolio bucket
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('portfolio')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      
      if (uploadError.message?.includes('duplicate')) {
        throw new Error('קובץ עם שם זהה כבר קיים');
      }
      
      throw new Error(`שגיאה בהעלאת התמונה: ${uploadError.message}`);
    }

    console.log('File uploaded successfully:', uploadData);

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('portfolio')
      .getPublicUrl(filePath);

    if (!urlData.publicUrl) {
      throw new Error('שגיאה ביצירת קישור לתמונה');
    }

    console.log('Public URL generated:', urlData.publicUrl);
    return urlData.publicUrl;
  } catch (error: any) {
    console.error('Error uploading image:', error);
    
    const errorMessage = error.message || "שגיאה לא ידועה בהעלאת התמונה";
    
    toast({
      title: "שגיאה בהעלאת התמונה",
      description: errorMessage,
      variant: "destructive"
    });
    
    return null;
  }
}

// Create a new portfolio item
export const createPortfolioItem = async (
  data: PortfolioItemFormData,
  userId: string
): Promise<{ success: boolean; error: string | null; item?: PortfolioItem }> => {
  try {
    console.log('Creating portfolio item for user:', userId);
    console.log('Form data:', { 
      title: data.title, 
      description: data.description, 
      hasImage: !!data.image,
      imageSize: data.image?.size,
      imageType: data.image?.type
    });

    if (!data.image) {
      return { success: false, error: 'תמונה נדרשת' };
    }

    if (!data.title?.trim()) {
      return { success: false, error: 'כותרת נדרשת' };
    }

    // Upload the image first
    console.log('Uploading image...');
    const imageUrl = await uploadPortfolioImage(data.image, userId);
    if (!imageUrl) {
      return { success: false, error: 'שגיאה בהעלאת התמונה' };
    }

    console.log('Image uploaded successfully, creating portfolio item with URL:', imageUrl);

    // Create the portfolio item
    const { data: itemData, error } = await supabase
      .from('portfolio_items')
      .insert({
        title: data.title.trim(),
        description: data.description?.trim() || null,
        image_url: imageUrl,
        created_by: userId
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating portfolio item:', error);
      
      // If portfolio item creation fails, try to clean up the uploaded image
      try {
        const fileName = imageUrl.split('/').pop();
        if (fileName) {
          await supabase.storage.from('portfolio').remove([fileName]);
          console.log('Cleaned up uploaded image after portfolio item creation failure');
        }
      } catch (cleanupError) {
        console.error('Failed to cleanup uploaded image:', cleanupError);
      }
      
      throw error;
    }

    console.log('Portfolio item created successfully:', itemData);

    toast({
      title: "הצלחה!",
      description: "התמונה נוספה לגלריה בהצלחה"
    });

    return { success: true, error: null, item: itemData };
  } catch (error: any) {
    console.error('Error creating portfolio item:', error);
    
    const errorMessage = error.message || 'התרחשה שגיאה בהעלאת הפריט. אנא נסו שוב מאוחר יותר.';
    
    toast({
      title: "שגיאה בהעלאת הפריט",
      description: errorMessage,
      variant: "destructive"
    });
    
    return { 
      success: false, 
      error: errorMessage
    };
  }
}

// Delete a portfolio item
export const deletePortfolioItem = async (id: string): Promise<boolean> => {
  try {
    console.log('Deleting portfolio item:', id);
    
    // Get the item to find the image URL
    const { data: item } = await supabase
      .from('portfolio_items')
      .select('image_url')
      .eq('id', id)
      .single();

    if (item?.image_url) {
      // Extract the filename from the URL
      const url = new URL(item.image_url);
      const filePath = url.pathname.split('/').pop();
      
      if (filePath) {
        console.log('Deleting image file:', filePath);
        // Delete the file from storage
        const { error: storageError } = await supabase.storage
          .from('portfolio')
          .remove([filePath]);
          
        if (storageError) {
          console.error('Error deleting image file:', storageError);
          // Continue with item deletion even if file deletion fails
        }
      }
    }

    // Delete the portfolio item
    const { error } = await supabase
      .from('portfolio_items')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting portfolio item:', error);
      throw error;
    }

    console.log('Portfolio item deleted successfully');

    toast({
      title: "פריט נמחק בהצלחה",
      description: "הפריט הוסר מהגלריה"
    });

    return true;
  } catch (error: any) {
    console.error('Error deleting portfolio item:', error);
    toast({
      title: "שגיאה במחיקת הפריט",
      description: error.message || "אנא נסו שוב מאוחר יותר",
      variant: "destructive"
    });
    return false;
  }
}
