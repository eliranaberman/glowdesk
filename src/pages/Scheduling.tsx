
import { useState, useEffect } from 'react';
import GanttChart from '../components/scheduling/GanttChart';
import CalendarSync from '../components/scheduling/CalendarSync';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CalendarPlus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const Scheduling = () => {
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
    
    // Improved distribution of start times throughout the day
    const startTimes = [];
    for (let hour = 8; hour <= 19; hour++) { // 8:00 AM to 7:00 PM
      startTimes.push(`${hour.toString().padStart(2, '0')}:00`);
      startTimes.push(`${hour.toString().padStart(2, '0')}:30`);
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
          startTime: startTime,
          duration: service.duration,
          color: service.color,
          date: new Date(appointmentDate),
          price: `₪${service.price}`
        });
      }
    }
    
    return appointments;
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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">לוח פגישות</h1>
          <p className="text-muted-foreground">
            ניהול הפגישות שלך וארגון היום בצורה יעילה.
          </p>
        </div>
        
        <div className="flex gap-4 flex-col sm:flex-row">
          {/* Filter buttons - in RTL direction (Day on the right, Month on the left) */}
          <div className="flex rounded-full bg-secondary/50 p-1">
            <Button
              variant={activeFilter === 'day' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveFilter('day')}
              className="flex-1"
            >
              יום
            </Button>
            <Button
              variant={activeFilter === 'week' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveFilter('week')}
              className="flex-1"
            >
              שבוע
            </Button>
            <Button
              variant={activeFilter === 'month' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveFilter('month')}
              className="flex-1"
            >
              חודש
            </Button>
          </div>

          <Link to="/scheduling/new">
            <Button>
              <CalendarPlus className="h-4 w-4 ml-2" />
              פגישה חדשה
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="space-y-6">
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <CalendarSync />
          </CardContent>
        </Card>
        
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
