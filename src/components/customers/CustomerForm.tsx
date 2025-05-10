
import { useParams, useNavigate } from 'react-router-dom';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCustomerForm } from './hooks/useCustomerForm';
import CustomerBasicInfoSection from './form-sections/CustomerBasicInfoSection';
import CustomerDatesSection from './form-sections/CustomerDatesSection';
import CustomerTagsSection from './form-sections/CustomerTagsSection';
import CustomerNotesSection from './form-sections/CustomerNotesSection';

interface CustomerFormProps {
  isEdit?: boolean;
}

const CustomerForm = ({ isEdit = false }: CustomerFormProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { 
    form, 
    loading, 
    tags, 
    newTag, 
    setNewTag, 
    onSubmit, 
    addTag, 
    removeTag 
  } = useCustomerForm(isEdit ? id : undefined);
  
  return (
    <div className="max-w-3xl mx-auto" dir="rtl">
      <Card>
        <CardHeader>
          <CardTitle>
            {isEdit ? 'עריכת פרטי לקוח' : 'הוספת לקוח חדש'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Info Section */}
              <CustomerBasicInfoSection form={form} />
              
              {/* Dates Section */}
              <CustomerDatesSection form={form} />
              
              {/* Tags Section */}
              <CustomerTagsSection 
                tags={tags}
                newTag={newTag}
                setNewTag={setNewTag}
                addTag={addTag}
                removeTag={removeTag}
              />
              
              {/* Notes Section */}
              <CustomerNotesSection form={form} />
              
              {/* Submit & Cancel Buttons */}
              <div className="flex justify-end gap-2">
                <Button type="submit" disabled={loading}>
                  {isEdit ? 'עדכון פרטים' : 'הוספת לקוח'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/customers')}
                >
                  ביטול
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerForm;
