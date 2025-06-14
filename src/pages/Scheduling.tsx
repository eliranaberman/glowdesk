
import { useState, useEffect } from 'react';
import GanttChart from '../components/scheduling/GanttChart';
import CalendarSync from '../components/scheduling/CalendarSync';
import UpcomingEvents from '../components/scheduling/UpcomingEvents';
import NotificationSettings from '../components/scheduling/NotificationSettings';
import DailySummaryNotification from '../components/scheduling/DailySummaryNotification';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CalendarPlus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

const Scheduling = () => {
  const isMobile = useIsMobile();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filteredAppointments, setFilteredAppointments] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState('day');

  // Generate random appointments for the next 30 days
  const generateRandomAppointments = () => {
    const currentDate = new Date();
    const appointments = [];
    
    // Extended list of client names
    const clientNames = [
      'שרה כהן', 'אמילי לוי', 'ליאת ונג', 'מיכל אברהם', 'רחל גולן',
      'דנה ישראלי', 'יעל מור', 'נופר דהן', 'טלי ברק', 'מירי אלון',
      'רוני שטרן', 'נועה אדלר', 'קרן לוי', 'דפנה גבאי', 'הילה שגיא',
      'מאיה ברגר', 'שירה אוחנה', 'איילת בן דוד', 'רותם זהבי', 'עדי מזרחי',
      'שני גרינברג', 'ליטל כץ', 'אורטל נחום', 'גלי אשכנזי', 'יפעת אוזן',
      'לירון פישר', 'ענבר חן', 'חני לויד', 'הודיה פרץ', 'עדן שפירא',
      'אביגיל מנחם', 'ספיר דנינו', 'אופיר יעקב', 'חן אסולין', 'ליאור גולדשטיין',
      'רבקה כהן', 'סיגל לוי', 'אורית שלום', 'נטע ברזילי', 'גלית גוטמן',
      'שלומית מלכה', 'מיטל יצחקי', 'תמי ממן', 'ורד אזולאי', 'טובה שמעוני'
    ];
    
    const services = [
      { name: 'מניקור ג\'ל', duration: 60, color: '#F2FCE2', price: 120 },
      { name: 'אקריליק מלא', duration: 90, color: '#FEF7CD', price: 180 },
      { name: 'פדיקור', duration: 75, color: '#FEC6A1', price: 140 },
      { name: 'לק ג\'ל', duration: 45, color: '#E5DEFF', price: 100 },
      { name: 'בניית ציפורניים', duration: 120, color: '#FFDEE2', price: 220 },
      { name: 'טיפול יופי', duration: 90, color: '#FDE1D3', price: 160 }
    ];
    
    // Business hours from 8:00 AM to 7:00 PM - generate proper time slots
    const startTimes = [];
    for (let hour = 8; hour <= 19; hour++) {
      startTimes.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour < 19) {  // Don't add 19:30 as it would go beyond business hours
        startTimes.push(`${hour.toString().padStart(2, '0')}:30`);
      }
    }
    
    // Create 30 days of random appointments with better time distribution
    for (let i = 0; i < 30; i++) {
      const appointmentDate = new Date(currentDate);
      appointmentDate.setDate(currentDate.getDate() + i);
      
      // Random number of appointments per day (2-6)
      const numAppointments = Math.floor(Math.random() * 5) + 2;
      const usedTimes = new Set();
      
      for (let j = 0; j < numAppointments; j++) {
        // Get unique time slots
        let startTime;
        do {
          startTime = startTimes[Math.floor(Math.random() * startTimes.length)];
        } while (usedTimes.has(startTime));
        usedTimes.add(startTime);
        
        const service = services[Math.floor(Math.random() * services.length)];
        const clientName = clientNames[Math.floor(Math.random() * clientNames.length)];
        
        appointments.push({
          id: `${i}-${j}`,
          customer: clientName,
          service: service.name,
          startTime: startTime, // Format: 'HH:MM'
          duration: service.duration,
          color: service.color,
          date: new Date(appointmentDate),
          price: `₪${service.price}`
        });
      }
    }
    
    // Sort appointments by date and time for consistency
    return appointments.sort((a, b) => {
      // First compare by date
      const dateComparison = a.date.getTime() - b.date.getTime();
      if (dateComparison !== 0) return dateComparison;
      
      // If same date, compare by time
      const getMinutes = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
      };
      
      return getMinutes(a.startTime) - getMinutes(b.startTime);
    });
  };
  
  // Mock appointments data
  const allAppointments = generateRandomAppointments();

  // Filter appointments whenever the selected date changes
  useEffect(() => {
    const filterAppointmentsByDate = () => {
      // Filter appointments for the selected date
      const filtered = allAppointments.filter(appointment => {
        if (!appointment.date) return false;
        
        return (
          appointment.date.getFullYear() === selectedDate.getFullYear() &&
          appointment.date.getMonth() === selectedDate.getMonth() &&
          appointment.date.getDate() === selectedDate.getDate()
        );
      });
      
      setFilteredAppointments(filtered);
    };

    filterAppointmentsByDate();
  }, [selectedDate]);

  return (
    <div dir="rtl">
      <div className={`flex flex-col ${isMobile ? 'gap-3 mb-4' : 'sm:flex-row sm:justify-between sm:items-center gap-4 mb-6'}`}>
        <div>
          <h1 className={`font-bold ${isMobile ? 'text-xl' : 'text-2xl'}`}>לוח פגישות</h1>
          <p className={`text-muted-foreground ${isMobile ? 'text-xs' : ''}`}>
            ניהול הפגישות שלך וארגון היום בצורה יעילה.
          </p>
        </div>
        
        <div className={`flex ${isMobile ? 'gap-2 flex-col' : 'gap-4 flex-col sm:flex-row'}`}>
          {/* Filter buttons - in RTL direction (Day on the right, Month on the left) */}
          <div className="flex rounded-full bg-secondary/50 p-1">
            <Button
              variant={activeFilter === 'day' ? 'default' : 'ghost'}
              size={isMobile ? "sm" : "sm"}
              onClick={() => setActiveFilter('day')}
              className="flex-1"
            >
              יום
            </Button>
            <Button
              variant={activeFilter === 'week' ? 'default' : 'ghost'}
              size={isMobile ? "sm" : "sm"}
              onClick={() => setActiveFilter('week')}
              className="flex-1"
            >
              שבוע
            </Button>
            <Button
              variant={activeFilter === 'month' ? 'default' : 'ghost'}
              size={isMobile ? "sm" : "sm"}
              onClick={() => setActiveFilter('month')}
              className="flex-1"
            >
              חודש
            </Button>
          </div>

          <Link to="/scheduling/new" className={isMobile ? 'w-full' : ''}>
            <Button className={isMobile ? 'w-full text-sm' : ''}>
              <CalendarPlus className={`${isMobile ? 'h-4 w-4 ml-1.5' : 'h-4 w-4 ml-2'}`} />
              פגישה חדשה
            </Button>
          </Link>
        </div>
      </div>
      
      <div className={`space-y-${isMobile ? '4' : '6'}`}>
        <UpcomingEvents />
        <DailySummaryNotification />
        <Card className={isMobile ? "shadow-sm" : "shadow-sm"}>
          <CardContent className={isMobile ? "p-3" : "p-4"}>
            <CalendarSync />
          </CardContent>
        </Card>
        <NotificationSettings />
        
        <GanttChart
          appointments={allAppointments}
          date={selectedDate}
          onDateChange={setSelectedDate}
        />
      </div>
    </div>
  );
};

export default Scheduling;
