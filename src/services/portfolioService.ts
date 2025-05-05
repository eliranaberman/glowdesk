
import { supabase } from '@/integrations/supabase/client';
import { PortfolioItem, PortfolioItemFormData } from '@/types/portfolio';
import { useToast } from '@/hooks/use-toast';

// Get all portfolio items
export const getPortfolioItems = async (): Promise<PortfolioItem[]> => {
  try {
    const { data, error } = await supabase
      .from('portfolio_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
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
    // Create a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload the file
    const { error: uploadError } = await supabase.storage
      .from('portfolio')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Get the public URL
    const { data } = supabase.storage
      .from('portfolio')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}

// Create a new portfolio item
export const createPortfolioItem = async (
  data: PortfolioItemFormData,
  userId: string
): Promise<{ success: boolean; error: string | null; item?: PortfolioItem }> => {
  const { toast } = useToast();
  try {
    if (!data.image) {
      return { success: false, error: 'תמונה נדרשת' };
    }

    // Upload the image
    const imageUrl = await uploadPortfolioImage(data.image, userId);
    if (!imageUrl) {
      return { success: false, error: 'שגיאה בהעלאת התמונה' };
    }

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

    if (error) throw error;

    toast({
      title: "פריט הועלה בהצלחה",
      description: "הפריט נוסף לגלריה"
    });

    return { success: true, error: null, item: itemData };
  } catch (error) {
    console.error('Error creating portfolio item:', error);
    toast({
      title: "שגיאה בהעלאת הפריט",
      description: "אנא נסו שוב מאוחר יותר",
      variant: "destructive"
    });
    return { 
      success: false, 
      error: 'התרחשה שגיאה בהעלאת הפריט. אנא נסו שוב מאוחר יותר.' 
    };
  }
}

// Delete a portfolio item
export const deletePortfolioItem = async (id: string): Promise<boolean> => {
  const { toast } = useToast();
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
