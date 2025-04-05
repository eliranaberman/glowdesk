
import { useState } from 'react';
import GanttChart from '../components/scheduling/GanttChart';
import CalendarSync from '../components/scheduling/CalendarSync';

const Scheduling = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Mock appointments data with dates
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const dayAfterTomorrow = new Date();
  dayAfterTomorrow.setDate(today.getDate() + 2);

  const appointments = [
    {
      id: '1',
      customer: 'שרה כהן',
      service: 'מניקור ג\'ל',
      startTime: '10:00',
      duration: 60,
      color: 'rgba(198, 113, 211, 0.3)', // Light purple
      date: today,
    },
    {
      id: '2',
      customer: 'אמילי לוי',
      service: 'אקריליק מלא',
      startTime: '12:30',
      duration: 90,
      color: 'rgba(181, 75, 194, 0.3)', // Medium purple
      date: today,
    },
    {
      id: '3',
      customer: 'ליאת ונג',
      service: 'פדיקור',
      startTime: '14:00',
      duration: 75,
      color: 'rgba(156, 61, 167, 0.3)', // Dark purple
      date: today,
    },
    {
      id: '4',
      customer: 'מיכל אברהם',
      service: 'לק ג\'ל',
      startTime: '11:00',
      duration: 45,
      color: 'rgba(198, 113, 211, 0.3)',
      date: tomorrow,
    },
    {
      id: '5',
      customer: 'רחל גולן',
      service: 'בניית ציפורניים',
      startTime: '13:00',
      duration: 120,
      color: 'rgba(181, 75, 194, 0.3)',
      date: tomorrow,
    },
    {
      id: '6',
      customer: 'דנה ישראלי',
      service: 'טיפול יופי',
      startTime: '10:30',
      duration: 90,
      color: 'rgba(156, 61, 167, 0.3)',
      date: dayAfterTomorrow,
    },
  ];

  return (
    <div dir="rtl">
      <h1 className="text-2xl font-bold mb-4">לוח פגישות</h1>
      <p className="text-muted-foreground mb-6">
        ניהול הפגישות שלך וארגון היום בצורה יעילה.
      </p>

      <div className="space-y-6">
        <CalendarSync />
        
        <GanttChart
          appointments={appointments}
          date={selectedDate}
          onDateChange={setSelectedDate}
        />
      </div>
    </div>
  );
};

export default Scheduling;
