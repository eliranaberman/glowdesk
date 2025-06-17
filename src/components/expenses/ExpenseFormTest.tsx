
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { InvoiceUploader } from './InvoiceUploader';
import { uploadInvoice } from '@/services/expensesService';

export const ExpenseFormTest = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingInvoice, setIsUploadingInvoice] = useState(false);
  const [selectedInvoiceFile, setSelectedInvoiceFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    vendor: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'cash'
  });
  const { toast } = useToast();
  const { user } = useAuth();

  const categories = [
    'חומרי גלם',
    'ציוד מקצועי',
    'שיפוצים ותחזוקה',
    'שיווק ופרסום',
    'חשבונות חברה',
    'אחר'
  ];

  const paymentMethods = [
    { value: 'cash', label: 'מזומן' },
    { value: 'credit_card', label: 'כרטיס אשראי' },
    { value: 'bank_transfer', label: 'העברה בנקאית' },
    { value: 'check', label: 'צ\'ק' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast({
        title: 'שגיאה',
        description: 'עליך להיות מחובר כדי להוסיף הוצאה',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.amount || !formData.category || !formData.vendor) {
      toast({
        title: 'שגיאה',
        description: 'אנא מלא את כל השדות הנדרשים',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Submitting expense with data:', formData);
      
      // Create the expense first
      const { data: expenseData, error } = await supabase
        .from('expenses')
        .insert({
          amount: parseFloat(formData.amount),
          category: formData.category,
          vendor: formData.vendor,
          description: formData.description,
          date: formData.date,
          payment_method: formData.paymentMethod,
          created_by: user.id,
          has_invoice: !!selectedInvoiceFile
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Expense created successfully:', expenseData);

      // Upload invoice if file is selected
      if (selectedInvoiceFile && expenseData.id) {
        setIsUploadingInvoice(true);
        console.log('Uploading invoice file...');
        
        const uploadResult = await uploadInvoice(selectedInvoiceFile, expenseData.id);
        if (uploadResult) {
          console.log('Invoice uploaded successfully');
        } else {
          console.log('Invoice upload failed, but expense was created');
        }
        setIsUploadingInvoice(false);
      }

      toast({
        title: 'הוצאה נוספה בהצלחה',
        description: `הוצאה בסך ${formData.amount}₪ נוספה למערכת${selectedInvoiceFile ? ' עם חשבונית' : ''}`,
      });

      // Reset form
      setFormData({
        amount: '',
        category: '',
        vendor: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'cash'
      });
      setSelectedInvoiceFile(null);

    } catch (error) {
      console.error('Error adding expense:', error);
      toast({
        title: 'שגיאה בהוספת הוצאה',
        description: error.message || 'אירעה שגיאה לא צפויה',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
      setIsUploadingInvoice(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>בדיקת טופס הוצאות</CardTitle>
        <CardDescription>
          טופס זה מאפשר בדיקה של הוספת הוצאה חדשה למערכת
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">סכום (₪) *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="date">תאריך *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="category">קטגוריה *</Label>
              <Select 
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="בחר קטגוריה" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="vendor">ספק/חנות *</Label>
              <Input
                id="vendor"
                placeholder="שם הספק או החנות"
                value={formData.vendor}
                onChange={(e) => setFormData(prev => ({ ...prev, vendor: e.target.value }))}
                required
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="paymentMethod">אמצעי תשלום</Label>
              <Select 
                value={formData.paymentMethod}
                onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method.value} value={method.value}>
                      {method.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">תיאור</Label>
              <Textarea
                id="description"
                placeholder="תיאור נוסף על ההוצאה (אופציונלי)"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            {/* Invoice Upload Section */}
            <div className="md:col-span-2">
              <InvoiceUploader 
                onFileSelect={setSelectedInvoiceFile}
                isUploading={isUploadingInvoice}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={isSubmitting || isUploadingInvoice}
            >
              {isSubmitting ? 'מוסיף...' : isUploadingInvoice ? 'מעלה חשבונית...' : 'הוסף הוצאה'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
