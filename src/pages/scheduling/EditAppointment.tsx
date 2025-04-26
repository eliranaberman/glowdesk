
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const EditAppointment = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(true);
  const [appointmentData, setAppointmentData] = useState({
    customer: '',
    service: '',
    date: '',
    time: '',
    duration: '',
    price: '',
    notes: ''
  });

  useEffect(() => {
    // Simulate fetching appointment data
    setTimeout(() => {
      // Mock data based on ID
      const mockAppointments = {
        '1': { 
          customer: '1', 
          service: '1', 
          date: '2025-04-10', 
          time: '10:00', 
          duration: '60', 
          price: '120', 
          notes: 'לקוחה ותיקה' 
        },
        '2': { 
          customer: '2', 
          service: '2', 
          date: '2025-04-10', 
          time: '12:30', 
          duration: '90', 
          price: '180', 
          notes: '' 
        },
        '3': { 
          customer: '3', 
          service: '3', 
          date: '2025-04-10', 
          time: '14:00', 
          duration: '75', 
          price: '140', 
          notes: 'רגישה לחומרים מסוימים' 
        },
        '4': { 
          customer: '4', 
          service: '4', 
          date: '2025-04-11', 
          time: '11:00', 
          duration: '45', 
          price: '100', 
          notes: '' 
        },
        '5': { 
          customer: '5', 
          service: '5', 
          date: '2025-04-11', 
          time: '13:00', 
          duration: '120', 
          price: '220', 
          notes: 'לקוחה חדשה' 
        },
      };

      const appointment = mockAppointments[id as keyof typeof mockAppointments] || {
        customer: '',
        service: '',
        date: '',
        time: '',
        duration: '',
        price: '',
        notes: ''
      };
      
      setAppointmentData(appointment);
      setIsLoading(false);
    }, 500);
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAppointmentData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setAppointmentData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast.success('פגישה עודכנה בהצלחה');
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div dir="rtl" className={`${isMobile ? 'max-w-full' : 'max-w-2xl mx-auto'}`}>
      <div className={`flex items-center ${isMobile ? 'mb-3' : 'mb-6'}`}>
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className={`mr-2 ${isMobile ? 'p-1 h-8' : ''}`}
        >
          <ArrowRight className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} mr-1`} />
          חזור
        </Button>
        <h1 className={`font-bold ${isMobile ? 'text-lg' : 'text-2xl'}`}>עריכת פגישה</h1>
      </div>
      
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader className={isMobile ? 'px-4 py-3' : ''}>
            <CardTitle className={isMobile ? 'text-lg' : ''}>פרטי פגישה</CardTitle>
          </CardHeader>
          <CardContent className={`${isMobile ? 'px-4 py-2' : ''} space-y-4`}>
            <div className="space-y-2">
              <Label htmlFor="customer" className={isMobile ? 'text-sm' : ''}>לקוח</Label>
              <Select 
                value={appointmentData.customer} 
                onValueChange={(value) => handleSelectChange('customer', value)}
              >
                <SelectTrigger id="customer" className={isMobile ? 'h-8 text-sm' : ''}>
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
              <Label htmlFor="service" className={isMobile ? 'text-sm' : ''}>שירות</Label>
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
                <SelectTrigger id="service" className={isMobile ? 'h-8 text-sm' : ''}>
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
                <Label htmlFor="date" className={isMobile ? 'text-sm' : ''}>תאריך</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={appointmentData.date}
                  onChange={handleChange}
                  required
                  className={isMobile ? 'h-8 text-sm' : ''}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time" className={isMobile ? 'text-sm' : ''}>שעה</Label>
                <Input
                  id="time"
                  name="time"
                  type="time"
                  value={appointmentData.time}
                  onChange={handleChange}
                  required
                  className={isMobile ? 'h-8 text-sm' : ''}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration" className={isMobile ? 'text-sm' : ''}>משך (דקות)</Label>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  value={appointmentData.duration}
                  onChange={handleChange}
                  required
                  className={isMobile ? 'h-8 text-sm' : ''}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price" className={isMobile ? 'text-sm' : ''}>מחיר (₪)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={appointmentData.price}
                  onChange={handleChange}
                  required
                  className={isMobile ? 'h-8 text-sm' : ''}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className={isMobile ? 'text-sm' : ''}>הערות</Label>
              <Input
                id="notes"
                name="notes"
                value={appointmentData.notes}
                onChange={handleChange}
                placeholder="הערות לגבי הפגישה"
                className={isMobile ? 'h-8 text-sm' : ''}
              />
            </div>
          </CardContent>
          <CardFooter className={`flex justify-between ${isMobile ? 'px-4 py-3' : ''}`}>
            <Button 
              variant="outline" 
              type="button" 
              onClick={() => navigate('/scheduling')}
              className={isMobile ? 'text-sm h-8' : ''}
            >
              ביטול
            </Button>
            <Button 
              type="submit"
              className={isMobile ? 'text-sm h-8' : ''}
            >
              עדכן פגישה
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default EditAppointment;
