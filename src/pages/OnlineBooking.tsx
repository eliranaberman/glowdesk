
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const OnlineBooking = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [selectedService, setSelectedService] = useState('');

  // Sample available time slots
  const availableTimeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

  // Sample services
  const services = [
    { id: '1', name: 'מניקור ג\'ל', duration: 60, price: 120 },
    { id: '2', name: 'אקריליק מלא', duration: 90, price: 180 },
    { id: '3', name: 'פדיקור', duration: 75, price: 140 },
    { id: '4', name: 'לק ג\'ל', duration: 45, price: 100 },
    { id: '5', name: 'בניית ציפורניים', duration: 120, price: 220 },
  ];

  const handleTimeSelection = (time: string) => {
    setSelectedTime(time);
    setIsBookingModalOpen(true);
  };

  const handleBookingSubmit = () => {
    if (!customerName || !customerPhone || !selectedService) {
      toast({
        title: "שגיאה",
        description: "נא למלא את כל השדות הנדרשים",
        variant: "destructive"
      });
      return;
    }

    // Here you would integrate with your calendar service and create the appointment
    // For now, we'll just show a success message
    toast({
      title: "פגישה נקבעה בהצלחה",
      description: `הפגישה שלך ל${format(selectedDate!, 'dd/MM/yyyy')} בשעה ${selectedTime} עבור ${selectedService} נקבעה בהצלחה.`
    });

    // Reset form and close modal
    setIsBookingModalOpen(false);
    setSelectedTime(null);
    setCustomerName('');
    setCustomerPhone('');
    setCustomerEmail('');
    setSelectedService('');
  };

  return (
    <div className="container mx-auto py-6" dir="rtl">
      <h1 className="text-2xl font-bold mb-4">קביעת פגישה אונליין</h1>
      <p className="text-muted-foreground mb-6">
        בחרו תאריך ושעה מתאימים לפגישה שלכם.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <Card className="md:col-span-5 lg:col-span-4">
          <CardHeader>
            <CardTitle>בחירת תאריך</CardTitle>
            <CardDescription>בחרו תאריך לפגישה</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border pointer-events-auto mx-auto"
              disabled={(date) => {
                // Disable past dates and Saturdays (day 6)
                return date < new Date() || date.getDay() === 6;
              }}
            />
          </CardContent>
        </Card>

        <Card className="md:col-span-7 lg:col-span-8">
          <CardHeader>
            <CardTitle>שעות זמינות</CardTitle>
            <CardDescription>
              {selectedDate ? `בחרו שעה זמינה לתאריך ${format(selectedDate, 'dd/MM/yyyy')}` : 'בחרו תאריך תחילה'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 h-full">
              {availableTimeSlots.map((time) => (
                <Button
                  key={time}
                  variant="outline"
                  className="w-full"
                  onClick={() => handleTimeSelection(time)}
                >
                  {time}
                </Button>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <p className="text-sm text-muted-foreground">פנוי</p>
          </CardFooter>
        </Card>
      </div>

      <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
        <DialogContent className="sm:max-w-[425px]" dir="rtl">
          <DialogHeader>
            <DialogTitle>קביעת פגישה</DialogTitle>
            <DialogDescription>
              {selectedDate && selectedTime
                ? `לתאריך ${format(selectedDate, 'dd/MM/yyyy')} בשעה ${selectedTime}`
                : 'יש לבחור תאריך ושעה'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                שם
              </Label>
              <Input
                id="name"
                placeholder="ישראל ישראלי"
                className="col-span-3"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                טלפון
              </Label>
              <Input
                id="phone"
                placeholder="054-1234567"
                className="col-span-3"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                אימייל
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                className="col-span-3"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="service" className="text-right">
                שירות
              </Label>
              <select 
                id="service" 
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
              >
                <option value="">בחרו שירות</option>
                {services.map((service) => (
                  <option key={service.id} value={service.name}>
                    {service.name} - {service.duration} דקות - ₪{service.price}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBookingModalOpen(false)}>
              ביטול
            </Button>
            <Button onClick={handleBookingSubmit}>קבע פגישה</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OnlineBooking;
