
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
    
    // Create a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    console.log('Uploading file to path:', filePath);

    // Upload the file
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('portfolio')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    console.log('File uploaded successfully:', uploadData);

    // Get the public URL
    const { data } = supabase.storage
      .from('portfolio')
      .getPublicUrl(filePath);

    console.log('Public URL generated:', data.publicUrl);
    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    toast({
      title: "שגיאה בהעלאת התמונה",
      description: error.message || "אנא נסו שוב מאוחר יותר",
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
    console.log('Form data:', { title: data.title, description: data.description, hasImage: !!data.image });

    if (!data.image) {
      return { success: false, error: 'תמונה נדרשת' };
    }

    // Upload the image
    const imageUrl = await uploadPortfolioImage(data.image, userId);
    if (!imageUrl) {
      return { success: false, error: 'שגיאה בהעלאת התמונה' };
    }

    console.log('Image uploaded, creating portfolio item with URL:', imageUrl);

    // Create the portfolio item
    const { data: itemData, error } = await supabase
      .from('portfolio_items')
      .insert({
        title: data.title,
        description: data.description || null,
        image_url: imageUrl,
        created_by: userId
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating portfolio item:', error);
      throw error;
    }

    console.log('Portfolio item created successfully:', itemData);

    toast({
      title: "פריט הועלה בהצלחה",
      description: "הפריט נוסף לגלריה"
    });

    return { success: true, error: null, item: itemData };
  } catch (error) {
    console.error('Error creating portfolio item:', error);
    toast({
      title: "שגיאה בהעלאת הפריט",
      description: error.message || "אנא נסו שוב מאוחר יותר",
      variant: "destructive"
    });
    return { 
      success: false, 
      error: error.message || 'התרחשה שגיאה בהעלאת הפריט. אנא נסו שוב מאוחר יותר.' 
    };
  }
}

// Delete a portfolio item
export const deletePortfolioItem = async (id: string): Promise<boolean> => {
  try {
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
        // Delete the file from storage
        await supabase.storage
          .from('portfolio')
          .remove([filePath]);
      }
    }

    // Delete the portfolio item
    const { error } = await supabase
      .from('portfolio_items')
      .delete()
      .eq('id', id);

    if (error) throw error;

    toast({
      title: "פריט נמחק בהצלחה",
      description: "הפריט הוסר מהגלריה"
    });

    return true;
  } catch (error) {
    console.error('Error deleting portfolio item:', error);
    toast({
      title: "שגיאה במחיקת הפריט",
      description: "אנא נסו שוב מאוחר יותר",
      variant: "destructive"
    });
    return false;
  }
}
