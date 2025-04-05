
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowRight } from 'lucide-react';

const NewPayment = () => {
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState({
    customer: '',
    amount: '',
    service: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: '',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setPaymentData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('תשלום נרשם בהצלחה');
    navigate('/');
  };

  // Mock customer options
  const customers = [
    { id: '1', name: 'שרה כהן' },
    { id: '2', name: 'אמילי לוי' },
    { id: '3', name: 'ליאת ונג' },
    { id: '4', name: 'מיכל אברהם' },
    { id: '5', name: 'רחל גולן' }
  ];

  // Mock service options
  const services = [
    { id: '1', name: 'מניקור ג\'ל', price: '120' },
    { id: '2', name: 'אקריליק מלא', price: '180' },
    { id: '3', name: 'פדיקור', price: '140' },
    { id: '4', name: 'לק ג\'ל', price: '100' },
    { id: '5', name: 'בניית ציפורניים', price: '220' }
  ];

  // Payment methods
  const paymentMethods = [
    { id: 'cash', name: 'מזומן' },
    { id: 'credit', name: 'כרטיס אשראי' },
    { id: 'transfer', name: 'העברה בנקאית' },
    { id: 'bit', name: 'ביט/פייבוקס' },
  ];

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
        <h1 className="text-2xl font-bold">רישום תשלום חדש</h1>
      </div>
      
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>פרטי תשלום</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customer">לקוח</Label>
              <Select 
                value={paymentData.customer} 
                onValueChange={(value) => handleSelectChange('customer', value)}
              >
                <SelectTrigger id="customer">
                  <SelectValue placeholder="בחר לקוח" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="service">שירות</Label>
              <Select 
                value={paymentData.service}
                onValueChange={(value) => {
                  const selectedService = services.find(s => s.id === value);
                  handleSelectChange('service', value);
                  if (selectedService) {
                    setPaymentData(prev => ({ ...prev, amount: selectedService.price }));
                  }
                }}
              >
                <SelectTrigger id="service">
                  <SelectValue placeholder="בחר שירות" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name} - ₪{service.price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">סכום (₪)</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  value={paymentData.amount}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">תאריך</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={paymentData.date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentMethod">אמצעי תשלום</Label>
              <Select 
                value={paymentData.paymentMethod} 
                onValueChange={(value) => handleSelectChange('paymentMethod', value)}
              >
                <SelectTrigger id="paymentMethod">
                  <SelectValue placeholder="בחר אמצעי תשלום" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method.id} value={method.id}>
                      {method.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">הערות</Label>
              <Input
                id="notes"
                name="notes"
                value={paymentData.notes}
                onChange={handleChange}
                placeholder="הערות נוספות לתשלום"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => navigate('/')}>
              ביטול
            </Button>
            <Button type="submit">רשום תשלום</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default NewPayment;
