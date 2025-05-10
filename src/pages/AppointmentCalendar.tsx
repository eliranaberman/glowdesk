
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isWeekend, isSameMonth } from 'date-fns';
import { he } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const AppointmentCalendar = () => {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Mock appointments data
  const mockAppointments = [
    { date: '2025-04-10', count: 3 },
    { date: '2025-04-15', count: 2 },
    { date: '2025-04-20', count: 1 },
    { date: '2025-04-22', count: 4 },
    { date: '2025-04-28', count: 2 },
  ];

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentMonth(prevDate => subMonths(prevDate, 1));
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(prevDate => addMonths(prevDate, 1));
  };

  // Generate array of days for current month view
  const monthDays = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  // Handle day click
  const handleDayClick = (date: Date) => {
    navigate(`/scheduling?date=${format(date, 'yyyy-MM-dd')}`);
  };

  // Check if a day has appointments
  const getAppointmentsForDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return mockAppointments.find(appt => appt.date === dateStr);
  };

  // Day name headers (starting from Sunday in Hebrew)
  const dayNames = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];

  return (
    <div className="container mx-auto py-6" dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">לוח שנה</h1>
        <Button 
          variant="default"
          onClick={() => navigate('/scheduling/new')}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          פגישה חדשה
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>פגישות - {format(currentMonth, 'MMMM yyyy', { locale: he })}</CardTitle>
          <div className="flex items-center space-x-2 space-x-reverse">
            <Button 
              variant="outline" 
              size="icon"
              onClick={prevMonth}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setCurrentMonth(new Date())}
            >
              <span className="sr-only">החודש הנוכחי</span>
              <CalendarIcon className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={nextMonth}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((day) => (
              <div 
                key={day} 
                className="text-center font-medium text-sm py-1"
              >
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for days before the start of the month */}
            {Array.from({ length: monthDays[0].getDay() }).map((_, i) => (
              <div key={`empty-start-${i}`} className="h-24 rounded-md p-2"></div>
            ))}
            
            {/* Actual days of the month */}
            {monthDays.map((day) => {
              const appointmentsForDay = getAppointmentsForDay(day);
              return (
                <div 
                  key={day.toISOString()}
                  className={cn(
                    "min-h-[6rem] rounded-md border p-2 transition-all cursor-pointer hover:bg-muted/50",
                    isToday(day) && "bg-yellow-50 border-yellow-200",
                    isWeekend(day) && "bg-gray-50",
                    !isSameMonth(day, currentMonth) && "opacity-50"
                  )}
                  onClick={() => handleDayClick(day)}
                >
                  <div className="flex justify-between items-start">
                    <span className={cn(
                      "text-sm font-medium",
                      isToday(day) && "text-primary bg-primary/10 rounded-full w-6 h-6 flex items-center justify-center"
                    )}>
                      {format(day, 'd')}
                    </span>
                    {appointmentsForDay && (
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        {appointmentsForDay.count} פגישות
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
            
            {/* Empty cells for days after the end of the month */}
            {Array.from({ length: (6 - monthDays[monthDays.length - 1].getDay()) % 7 }).map((_, i) => (
              <div key={`empty-end-${i}`} className="h-24 rounded-md p-2"></div>
            ))}
          </div>
          
          <div className="flex justify-center mt-4 text-sm text-muted-foreground">
            לחץ על יום כלשהו כדי לצפות בפגישות באותו היום
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentCalendar;
