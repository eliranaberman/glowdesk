
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ArrowRight } from 'lucide-react';

// Mock database of customers that will persist between renders
const mockCustomers = {
  '1': { name: 'שרה כהן', email: 'sarah.j@example.com', phone: '(555) 123-4567', notes: 'לקוחה ותיקה' },
  '2': { name: 'אמילי דייויס', email: 'emily.d@example.com', phone: '(555) 987-6543', notes: 'מעדיפה מניקור בלבד' },
  '3': { name: 'ליאת ונג', email: 'lisa.w@example.com', phone: '(555) 456-7890', notes: 'אלרגית ללק מסוג X' },
  '4': { name: 'מריה גארסיה', email: 'maria.g@example.com', phone: '(555) 234-5678', notes: '' },
  '5': { name: 'ג\'ניפר מילר', email: 'jennifer.m@example.com', phone: '(555) 876-5432', notes: 'מגיעה תמיד בזמן' },
};

const EditCustomer = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching customer data
    setTimeout(() => {
      const customer = mockCustomers[id as keyof typeof mockCustomers] || { name: '', email: '', phone: '', notes: '' };
      setCustomerData(customer);
      setIsLoading(false);
    }, 500);
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save the updated customer data to our mock database
    if (id) {
      mockCustomers[id as keyof typeof mockCustomers] = { ...customerData };
      
      // Update the customers list in localStorage to persist between page refreshes
      try {
        const customersJSON = JSON.stringify(mockCustomers);
        localStorage.setItem('mockCustomers', customersJSON);
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
      
      // Show success message
      toast.success('פרטי לקוח עודכנו בהצלחה');
      
      // Navigate back to customers list
      navigate('/customers');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mr-2"
        >
          <ArrowRight className="h-4 w-4 mr-1" />
          חזור
        </Button>
        <h1 className="text-2xl font-bold">עריכת פרטי לקוח</h1>
      </div>
      
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>פרטי לקוח</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">שם מלא</Label>
              <Input
                id="name"
                name="name"
                value={customerData.name}
                onChange={handleChange}
                placeholder="הכנס שם מלא"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">אימייל</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={customerData.email}
                onChange={handleChange}
                placeholder="example@mail.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">טלפון</Label>
              <Input
                id="phone"
                name="phone"
                value={customerData.phone}
                onChange={handleChange}
                placeholder="05X-XXXXXXX"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">הערות</Label>
              <Input
                id="notes"
                name="notes"
                value={customerData.notes}
                onChange={handleChange}
                placeholder="הערות אודות הלקוח"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => navigate('/customers')}>
              ביטול
            </Button>
            <Button type="submit">שמור שינויים</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default EditCustomer;
