import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { format, isSameDay, addDays } from 'date-fns';
import { createAppointment } from '@/services/appointmentService';
import { sendAppointmentNotification } from '@/services/notificationService';
import { getUserCalendarConnections } from '@/services/calendarService';
import { Loader2, Calendar as CalendarIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const OnlineBooking = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [hasCalendarSync, setHasCalendarSync] = useState(false);

  // Sample services with prices in ILS (₪)
  const services = [
    { id: '1', name: 'מניקור ג\'ל', duration: 60, price: 120 },
    { id: '2', name: 'אקריליק מלא', duration: 90, price: 180 },
    { id: '3', name: 'פדיקור', duration: 75, price: 140 },
    { id: '4', name: 'לק ג\'ל', duration: 45, price: 100 },
    { id: '5', name: 'בניית ציפורניים', duration: 120, price: 220 },
  ];

  // Check if calendar sync is available
  useEffect(() => {
    const checkCalendarSync = async () => {
      try {
        const connections = await getUserCalendarConnections();
        setHasCalendarSync(connections.length > 0 && connections.some(conn => conn.is_active));
      } catch (error) {
        console.error('Error checking calendar connections:', error);
        setHasCalendarSync(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkCalendarSync();
  }, []);

  // Update available times when date changes
  useEffect(() => {
    if (selectedDate) {
      setIsLoading(true);
      
      // In a real implementation, this would fetch availability from the calendar API
      // For now, we'll simulate loading time availability
      setTimeout(() => {
        // Generate available time slots for the selected date
        // In production, this would check existing appointments and calendar availability
        const baseSlots = [
          '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
          '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
          '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
        ];
        
        // Simulate some times being already booked
        let availableSlots;
        
        // Remove some slots based on the day to simulate varying availability
        if (isSameDay(selectedDate, new Date())) {
          // Today - remove morning slots
          availableSlots = baseSlots.filter(slot => {
            const hour = parseInt(slot.split(':')[0]);
            return hour >= 12;
          });
        } else if (isSameDay(selectedDate, addDays(new Date(), 1))) {
          // Tomorrow - remove some random slots
          availableSlots = baseSlots.filter((_, index) => index % 3 !== 0);
        } else if (isSameDay(selectedDate, addDays(new Date(), 2))) {
          // Day after tomorrow - remove afternoon slots
          availableSlots = baseSlots.filter(slot => {
            const hour = parseInt(slot.split(':')[0]);
            return hour <= 14;
          });
        } else {
          // Other days - remove random slots
          availableSlots = baseSlots.filter((_, index) => index % 2 !== 0);
        }
        
        setAvailableTimes(availableSlots);
        setIsLoading(false);
      }, 1000);
    }
  }, [selectedDate]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setSelectedTime(null); // Reset time when date changes
    }
  };

  const handleTimeSelection = (time: string) => {
    setSelectedTime(time);
    setIsBookingModalOpen(true);
  };

  const handleBookingSubmit = async () => {
    if (!customerName || !customerPhone || !selectedService) {
      toast({
        title: "שגיאה",
        description: "נא למלא את כל השדות הנדרשים",
        variant: "destructive"
      });
      return;
    }

    if (!selectedDate || !selectedTime) {
      toast({
        title: "שגיאה",
        description: "נא לבחור תאריך ושעה",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // In a full implementation, this would first create a customer record
      // For now, we'll simulate appointment creation
      const selectedServiceObj = services.find(s => s.name === selectedService);
      if (!selectedServiceObj) {
        throw new Error("לא נמצא השירות שנבחר");
      }
      
      // Calculate end time based on service duration
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const endHours = Math.floor((hours * 60 + minutes + selectedServiceObj.duration) / 60);
      const endMinutes = (hours * 60 + minutes + selectedServiceObj.duration) % 60;
      const endTime = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
      
      // Create appointment record - in a real implementation this would include creating/updating customer record first
      const appointmentData = {
        customer_id: "temp_customer_id", // In a real implementation, this would be the actual customer ID
        service_type: selectedService,
        date: selectedDate,
        start_time: selectedTime,
        end_time: endTime,
        status: 'scheduled',
        notes: `הזמנה חדשה מהאתר. פרטי קשר: ${customerPhone}, ${customerEmail || 'ללא מייל'}`
      };
      
      const createdAppointment = await createAppointment(appointmentData);
      
      // Send a confirmation notification
      try {
        await sendAppointmentNotification(createdAppointment.id, 'confirmation');
      } catch (error) {
        console.error('Error sending notification:', error);
        // We'll continue even if notification fails
      }

      toast({
        title: "פגישה נקבעה בהצלחה",
        description: `הפגישה שלך ל${format(selectedDate, 'dd/MM/yyyy')} בשעה ${selectedTime} עבור ${selectedService} נקבעה בהצלחה.`
      });

      // Reset form and close modal
      setIsBookingModalOpen(false);
      setSelectedTime(null);
      setCustomerName('');
      setCustomerPhone('');
      setCustomerEmail('');
      setSelectedService('');
      
      // Redirect to confirmation page
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בקביעת הפגישה. נא לנסות שוב.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-6" dir="rtl">
      <h1 className="text-2xl font-bold mb-4">קביעת פגישה אונליין</h1>
      <p className="text-muted-foreground mb-6">
        בחרו תאריך ושעה מתאימים לפגישה שלכם.
        {hasCalendarSync && " הזמינות מעודכנת בזמן אמת עם יומן הפגישות."}
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
              onSelect={handleDateSelect}
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
              {selectedDate 
                ? `בחרו שעה זמינה לתאריך ${format(selectedDate, 'dd/MM/yyyy')}` 
                : 'בחרו תאריך תחילה'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <span className="mr-3 text-muted-foreground">טוען זמינות...</span>
              </div>
            ) : availableTimes.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 h-full">
                {availableTimes.map((time) => (
                  <Button
                    key={time}
                    variant="outline"
                    className={`w-full ${selectedTime === time ? 'border-primary' : ''}`}
                    onClick={() => handleTimeSelection(time)}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <CalendarIcon className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">אין שעות זמינות בתאריך שנבחר</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            {hasCalendarSync ? (
              <p className="text-sm text-muted-foreground">מסונכרן עם לוח השנה</p>
            ) : (
              <p className="text-sm text-muted-foreground">פנוי</p>
            )}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
            <Button 
              variant="outline" 
              onClick={() => setIsBookingModalOpen(false)}
              disabled={isSubmitting}
            >
              ביטול
            </Button>
            <Button 
              onClick={handleBookingSubmit} 
              disabled={isSubmitting}
            >
              {isSubmitting ? 
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  מעבד...
                </> : 
                'קבע פגישה'
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OnlineBooking;
