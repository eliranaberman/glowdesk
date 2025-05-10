
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { 
  Customer, 
  CustomerFormData,
  getCustomerById, 
  createCustomer, 
  updateCustomer 
} from '@/services/customers';
import { customerSchema, CustomerFormValues } from '../schema/customerFormSchema';

export const useCustomerForm = (customerId?: string) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  
  // Form setup
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      full_name: '',
      email: '',
      phone_number: '',
      status: 'active',
      loyalty_level: 'bronze',
      notes: '',
      registration_date: new Date(),
      last_appointment: null,
      tags: [],
    },
  });
  
  // Load customer data for edit mode
  useEffect(() => {
    const loadCustomer = async () => {
      if (!customerId) return;
      
      try {
        setLoading(true);
        const data = await getCustomerById(customerId);
        
        // Convert string dates to Date objects for the form
        const formattedData = {
          ...data,
          registration_date: data.registration_date ? new Date(data.registration_date) : new Date(),
          last_appointment: data.last_appointment ? new Date(data.last_appointment) : null,
        };
        
        // Set form values
        form.reset(formattedData);
        setTags(data.tags || []);
      } catch (error) {
        console.error('Error loading customer data:', error);
        toast({
          title: 'שגיאה בטעינת נתוני לקוח',
          description: 'אירעה שגיאה בטעינת נתוני הלקוח. אנא נסה שוב מאוחר יותר.',
          variant: 'destructive',
        });
        navigate('/customers');
      } finally {
        setLoading(false);
      }
    };
    
    loadCustomer();
  }, [customerId, form, navigate, toast]);
  
  // Form submission
  const onSubmit = async (data: CustomerFormValues) => {
    try {
      setLoading(true);
      
      // Prepare data with required fields
      const customerData: CustomerFormData = {
        full_name: data.full_name,
        email: data.email,
        phone_number: data.phone_number,
        status: data.status,
        loyalty_level: data.loyalty_level,
        notes: data.notes || '',
        registration_date: data.registration_date,
        last_appointment: data.last_appointment,
        tags: tags,
      };
      
      if (customerId) {
        // Update existing customer
        await updateCustomer(customerId, customerData);
        toast({
          title: 'לקוח עודכן בהצלחה',
          description: 'פרטי הלקוח עודכנו במערכת.',
        });
      } else {
        // Create new customer
        await createCustomer(customerData);
        toast({
          title: 'לקוח נוסף בהצלחה',
          description: 'הלקוח החדש נוסף למערכת.',
        });
      }
      
      navigate('/customers');
    } catch (error) {
      console.error('Error saving customer:', error);
      toast({
        title: 'שגיאה בשמירת לקוח',
        description: 'אירעה שגיאה בשמירת פרטי הלקוח. אנא נסה שוב מאוחר יותר.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Tag management
  const addTag = () => {
    if (!newTag.trim()) return;
    
    // Check if tag already exists
    if (!tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    } else {
      toast({
        title: 'תגית קיימת',
        description: 'תגית זו כבר קיימת.',
        variant: 'destructive',
      });
    }
  };
  
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return {
    form,
    loading,
    tags,
    newTag,
    setNewTag,
    onSubmit,
    addTag,
    removeTag
  };
};
