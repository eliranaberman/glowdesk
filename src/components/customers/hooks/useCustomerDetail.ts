
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Customer, getCustomerById, updateCustomer } from '@/services/customerService';
import { format } from 'date-fns';

export const useCustomerDetail = (customerId: string | undefined) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [showTagDialog, setShowTagDialog] = useState(false);
  const [newTag, setNewTag] = useState('');
  
  // Load customer data
  useEffect(() => {
    const loadCustomer = async () => {
      if (!customerId) return;
      
      try {
        setLoading(true);
        const data = await getCustomerById(customerId);
        setCustomer(data);
        setNotes(data.notes || '');
      } catch (error) {
        console.error('Error loading customer:', error);
        toast({
          title: 'שגיאה בטעינת פרטי לקוח',
          description: 'אירעה שגיאה בטעינת פרטי הלקוח. אנא נסה שוב מאוחר יותר.',
          variant: 'destructive',
        });
        navigate('/customers');
      } finally {
        setLoading(false);
      }
    };
    
    loadCustomer();
  }, [customerId, navigate, toast]);
  
  // Save notes
  const saveNotes = async () => {
    if (!customer) return;
    
    try {
      await updateCustomer(customer.id, { notes });
      setCustomer({ ...customer, notes });
      
      toast({
        title: 'הערות נשמרו',
        description: 'הערות הלקוח עודכנו בהצלחה.',
      });
    } catch (error) {
      console.error('Error saving notes:', error);
      toast({
        title: 'שגיאה בשמירת הערות',
        description: 'אירעה שגיאה בשמירת ההערות. אנא נסה שוב מאוחר יותר.',
        variant: 'destructive',
      });
    }
  };
  
  // Handle tags
  const addTag = async () => {
    if (!customer || !newTag.trim()) return;
    
    const updatedTags = [...(customer.tags || [])];
    
    // Check if tag already exists
    if (!updatedTags.includes(newTag.trim())) {
      updatedTags.push(newTag.trim());
      
      try {
        await updateCustomer(customer.id, { tags: updatedTags });
        setCustomer({ ...customer, tags: updatedTags });
        setNewTag('');
        setShowTagDialog(false);
        
        toast({
          title: 'תגית נוספה',
          description: 'התגית נוספה בהצלחה.',
        });
      } catch (error) {
        console.error('Error adding tag:', error);
        toast({
          title: 'שגיאה בהוספת תגית',
          description: 'אירעה שגיאה בהוספת התגית. אנא נסה שוב מאוחר יותר.',
          variant: 'destructive',
        });
      }
    } else {
      toast({
        title: 'תגית קיימת',
        description: 'תגית זו כבר קיימת עבור לקוח זה.',
        variant: 'destructive',
      });
    }
  };
  
  const removeTag = async (tagToRemove: string) => {
    if (!customer) return;
    
    const updatedTags = customer.tags.filter(tag => tag !== tagToRemove);
    
    try {
      await updateCustomer(customer.id, { tags: updatedTags });
      setCustomer({ ...customer, tags: updatedTags });
      
      toast({
        title: 'תגית הוסרה',
        description: 'התגית הוסרה בהצלחה.',
      });
    } catch (error) {
      console.error('Error removing tag:', error);
      toast({
        title: 'שגיאה בהסרת תגית',
        description: 'אירעה שגיאה בהסרת התגית. אנא נסה שוב מאוחר יותר.',
        variant: 'destructive',
      });
    }
  };
  
  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'לא זמין';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch (error) {
      return dateString;
    }
  };
  
  // Get loyalty level text
  const getLoyaltyText = (level: string) => {
    switch (level) {
      case 'gold': return 'זהב';
      case 'silver': return 'כסף';
      case 'bronze': return 'ברונזה';
      default: return level;
    }
  };
  
  // Get status text
  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'פעיל';
      case 'inactive': return 'לא פעיל';
      case 'lead': return 'לקוח פוטנציאלי';
      default: return status;
    }
  };

  return {
    customer,
    loading,
    notes,
    setNotes,
    showTagDialog,
    setShowTagDialog,
    newTag,
    setNewTag,
    saveNotes,
    addTag,
    removeTag,
    formatDate,
    getLoyaltyText,
    getStatusText
  };
};
