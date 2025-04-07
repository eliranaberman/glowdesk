
import { useState, useEffect } from 'react';
import GanttChart from '../components/scheduling/GanttChart';
import CalendarSync from '../components/scheduling/CalendarSync';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CalendarPlus } from 'lucide-react';

const Scheduling = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filteredAppointments, setFilteredAppointments] = useState<any[]>([]);

  // Mock appointments data with dates
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const dayAfterTomorrow = new Date();
  dayAfterTomorrow.setDate(today.getDate() + 2);

  const allAppointments = [
    {
      id: '1',
      customer: 'שרה כהן',
      service: 'מניקור ג\'ל',
      startTime: '10:00',
      duration: 60,
      color: 'rgba(198, 113, 211, 0.3)', // Light purple
      date: today,
      price: '₪120',
    },
    {
      id: '2',
      customer: 'אמילי לוי',
      service: 'אקריליק מלא',
      startTime: '12:30',
      duration: 90,
      color: 'rgba(181, 75, 194, 0.3)', // Medium purple
      date: today,
      price: '₪180',
    },
    {
      id: '3',
      customer: 'ליאת ונג',
      service: 'פדיקור',
      startTime: '14:00',
      duration: 75,
      color: 'rgba(156, 61, 167, 0.3)', // Dark purple
      date: today,
      price: '₪140',
    },
    {
      id: '4',
      customer: 'מיכל אברהם',
      service: 'לק ג\'ל',
      startTime: '11:00',
      duration: 45,
      color: 'rgba(198, 113, 211, 0.3)',
      date: tomorrow,
      price: '₪100',
    },
    {
      id: '5',
      customer: 'רחל גולן',
      service: 'בניית ציפורניים',
      startTime: '13:00',
      duration: 120,
      color: 'rgba(181, 75, 194, 0.3)',
      date: tomorrow,
      price: '₪220',
    },
    {
      id: '6',
      customer: 'דנה ישראלי',
      service: 'טיפול יופי',
      startTime: '10:30',
      duration: 90,
      color: 'rgba(156, 61, 167, 0.3)',
      date: dayAfterTomorrow,
      price: '₪160',
    },
    {
      id: '7',
      customer: 'יעל מור',
      service: 'מניקור ג\'ל',
      startTime: '09:00',
      duration: 60,
      color: 'rgba(198, 113, 211, 0.3)',
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3),
      price: '₪120',
    },
    {
      id: '8',
      customer: 'נופר דהן',
      service: 'פדיקור',
      startTime: '15:30',
      duration: 75,
      color: 'rgba(156, 61, 167, 0.3)',
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 4),
      price: '₪140',
    },
  ];

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">לוח פגישות</h1>
        <Link to="/scheduling/new">
          <Button>
            <CalendarPlus className="h-4 w-4 ml-2" />
            פגישה חדשה
          </Button>
        </Link>
      </div>
      <p className="text-muted-foreground mb-6">
        ניהול הפגישות שלך וארגון היום בצורה יעילה.
      </p>

      <div className="space-y-6">
        <CalendarSync />
        
        <GanttChart
          appointments={filteredAppointments}
          date={selectedDate}
          onDateChange={setSelectedDate}
        />
      </div>
    </div>
  );
};

export default Scheduling;
