
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const NewAppointment = () => {
  const navigate = useNavigate();
  const [appointmentData, setAppointmentData] = useState({
    customer: '',
    service: '',
    date: '',
    time: '',
    duration: '60',
    price: '',
    notes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAppointmentData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setAppointmentData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real application, you would save the appointment data to your backend
    toast.success('פגישה נוצרה בהצלחה');
    navigate('/scheduling');
  };

  // Mock service options
  const services = [
    { id: '1', name: 'מניקור ג\'ל', duration: '60', price: '120' },
    { id: '2', name: 'אקריליק מלא', duration: '90', price: '180' },
    { id: '3', name: 'פדיקור', duration: '75', price: '140' },
    { id: '4', name: 'לק ג\'ל', duration: '45', price: '100' },
    { id: '5', name: 'בניית ציפורניים', duration: '120', price: '220' }
  ];

  // Mock customer options
  const customers = [
    { id: '1', name: 'שרה כהן' },
    { id: '2', name: 'אמילי לוי' },
    { id: '3', name: 'ליאת ונג' },
    { id: '4', name: 'מיכל אברהם' },
    { id: '5', name: 'רחל גולן' }
  ];

  return (
    <div dir="rtl" className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">יצירת פגישה חדשה</h1>
      
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>פרטי פגישה</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customer">לקוח</Label>
              <Select 
                value={appointmentData.customer} 
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
                value={appointmentData.service}
                onValueChange={(value) => {
                  const selectedService = services.find(s => s.id === value);
                  handleSelectChange('service', value);
                  if (selectedService) {
                    handleSelectChange('duration', selectedService.duration);
                    handleSelectChange('price', selectedService.price);
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
                <Label htmlFor="date">תאריך</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={appointmentData.date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">שעה</Label>
                <Input
                  id="time"
                  name="time"
                  type="time"
                  value={appointmentData.time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">משך (דקות)</Label>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  value={appointmentData.duration}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">מחיר (₪)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={appointmentData.price}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">הערות</Label>
              <Input
                id="notes"
                name="notes"
                value={appointmentData.notes}
                onChange={handleChange}
                placeholder="הערות לגבי הפגישה"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => navigate('/scheduling')}>
              ביטול
            </Button>
            <Button type="submit">צור פגישה</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default NewAppointment;
