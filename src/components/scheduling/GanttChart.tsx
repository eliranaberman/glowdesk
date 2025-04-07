
import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, addDays, startOfWeek, endOfWeek, addMonths, startOfMonth, endOfMonth, isWithinInterval, isSameDay } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface Appointment {
  id: string;
  customer: string;
  service: string;
  startTime: string; // Format: '09:00'
  duration: number; // Duration in minutes
  color?: string;
  date?: Date; // Optional date field for week/month views
  price?: string;
}

interface GanttChartProps {
  appointments: Appointment[];
  date: Date;
  onDateChange: (date: Date) => void;
}

const HOURS = Array.from({ length: 16 }, (_, i) => i + 8); // 8:00 to 23:00
const CELL_HEIGHT = 60; // Height of appointment cell in pixels

const GanttChart = ({ appointments, date, onDateChange }: GanttChartProps) => {
  const [view, setView] = useState<'day' | 'week' | 'month'>('day');
  const navigate = useNavigate();
  
  // Helper function to calculate position and height based on time
  const getAppointmentStyle = (startTime: string, duration: number) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const startHour = hours + minutes / 60;
    const startPosition = (startHour - 8) * CELL_HEIGHT; // 8:00 is the start time
    const height = (duration / 60) * CELL_HEIGHT;
    
    return {
      top: `${startPosition}px`,
      height: `${height}px`,
    };
  };

  // Get dates for the current view
  const viewDates = useMemo(() => {
    if (view === 'day') {
      return [date];
    } else if (view === 'week') {
      const start = startOfWeek(date, { weekStartsOn: 0 }); // Sunday
      return Array.from({ length: 7 }, (_, i) => addDays(start, i));
    } else if (view === 'month') {
      const start = startOfMonth(date);
      const end = endOfMonth(date);
      const days = [];
      let currentDay = start;
      while (currentDay <= end) {
        days.push(new Date(currentDay));
        currentDay = addDays(currentDay, 1);
      }
      return days;
    }
    return [date];
  }, [view, date]);

  // Filter appointments for the current view
  const filteredAppointments = useMemo(() => {
    if (view === 'day') {
      // For day view, filter appointments for the selected date
      return appointments.filter(appointment => {
        if (appointment.date) {
          return isSameDay(appointment.date, date);
        }
        return true; // If no date specified, show on the current date
      });
    } else {
      // For week and month views, filter by date range
      return appointments.filter(appointment => {
        // If appointment has a date, check if it's in the current view
        if (appointment.date) {
          if (view === 'week') {
            return isWithinInterval(appointment.date, {
              start: startOfWeek(date, { weekStartsOn: 0 }),
              end: endOfWeek(date, { weekStartsOn: 0 })
            });
          } else if (view === 'month') {
            return isWithinInterval(appointment.date, {
              start: startOfMonth(date),
              end: endOfMonth(date)
            });
          }
        }
        // If no date specified, only show on the selected date
        return isSameDay(new Date(), date);
      });
    }
  }, [appointments, view, date]);
  
  // Format the date nicely
  const formattedDate = new Intl.DateTimeFormat('he-IL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);

  // Navigation functions
  const nextPeriod = () => {
    const newDate = new Date(date);
    if (view === 'day') {
      newDate.setDate(date.getDate() + 1);
    } else if (view === 'week') {
      newDate.setDate(date.getDate() + 7);
    } else if (view === 'month') {
      newDate.setMonth(date.getMonth() + 1);
    }
    onDateChange(newDate);
  };

  const prevPeriod = () => {
    const newDate = new Date(date);
    if (view === 'day') {
      newDate.setDate(date.getDate() - 1);
    } else if (view === 'week') {
      newDate.setDate(date.getDate() - 7);
    } else if (view === 'month') {
      newDate.setMonth(date.getMonth() - 1);
    }
    onDateChange(newDate);
  };

  const today = () => {
    onDateChange(new Date());
  };

  const getViewTitle = () => {
    if (view === 'day') {
      return formattedDate;
    } else if (view === 'week') {
      const startDate = startOfWeek(date, { weekStartsOn: 0 });
      const endDate = endOfWeek(date, { weekStartsOn: 0 });
      return `${new Intl.DateTimeFormat('he-IL', { month: 'long', day: 'numeric' }).format(startDate)} - ${new Intl.DateTimeFormat('he-IL', { month: 'long', day: 'numeric', year: 'numeric' }).format(endDate)}`;
    } else if (view === 'month') {
      return new Intl.DateTimeFormat('he-IL', { month: 'long', year: 'numeric' }).format(date);
    }
  };

  // Format hours in 24-hour format
  const formatHour = (hour: number) => {
    return `${hour.toString().padStart(2, '0')}:00`;
  };

  // Handle appointment click
  const handleAppointmentClick = (id: string) => {
    navigate(`/scheduling/edit/${id}`);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2" dir="rtl">
        <CardTitle>פגישות</CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className={cn(
              view === 'day' && 'bg-primary text-primary-foreground hover:bg-primary/90'
            )}
            onClick={() => setView('day')}
          >
            יום
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              view === 'week' && 'bg-primary text-primary-foreground hover:bg-primary/90'
            )}
            onClick={() => setView('week')}
          >
            שבוע
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              view === 'month' && 'bg-primary text-primary-foreground hover:bg-primary/90'
            )}
            onClick={() => setView('month')}
          >
            חודש
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4 mt-2" dir="rtl">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={prevPeriod}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <div className="flex items-center">
              <CalendarIcon className="ml-2 h-4 w-4" />
              <span>{getViewTitle()}</span>
            </div>
            <Button variant="outline" size="icon" onClick={nextPeriod}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline" size="sm" onClick={today}>
            היום
          </Button>
        </div>

        <div className="border rounded-lg mt-4 overflow-hidden">
          {view === 'day' ? (
            <div className="gantt-container relative overflow-x-auto">
              <div className="gantt-timeline grid grid-cols-1 border-b">
                <div className="hours-header flex border-b bg-muted/30">
                  {HOURS.map((hour) => (
                    <div key={hour} className="hour-cell flex-1 text-center py-2 text-sm font-medium border-r last:border-r-0">
                      {formatHour(hour)}
                    </div>
                  ))}
                </div>

                {/* Gantt Timeline */}
                <div className="relative h-[600px]">
                  {/* Time grid lines */}
                  <div className="absolute inset-0">
                    {HOURS.map((hour) => (
                      <div 
                        key={hour} 
                        className="absolute border-r h-full bg-muted/10"
                        style={{left: `${(hour - 8) * (100 / HOURS.length)}%`, width: `${100 / HOURS.length}%`}}
                      ></div>
                    ))}
                  </div>

                  {/* Hour markers (vertical lines) */}
                  {Array.from({ length: 16 }, (_, i) => i + 8).map((hour) => (
                    <div 
                      key={`hour-${hour}`}
                      className="absolute border-t border-muted w-full"
                      style={{ top: `${(hour - 8) * CELL_HEIGHT}px` }}
                    >
                      <span className="absolute -top-3 right-1 text-xs font-medium text-muted-foreground">
                        {formatHour(hour)}
                      </span>
                    </div>
                  ))}

                  {/* Appointments */}
                  {filteredAppointments.map((appointment, index) => {
                    const style = getAppointmentStyle(appointment.startTime, appointment.duration);
                    // Calculate horizontal positioning to avoid overlaps
                    const column = index % 3;
                    const width = Math.min(30, 90 / Math.min(filteredAppointments.length, 3));
                    
                    return (
                      <div
                        key={appointment.id}
                        className="absolute rounded-md p-3 transition-all hover:ring-2 hover:ring-primary cursor-pointer shadow-sm"
                        style={{
                          ...style,
                          backgroundColor: appointment.color || 'var(--nail-200)',
                          left: `${column * width}%`,
                          width: `${width}%`,
                          zIndex: 10 - index, // Higher index, lower z-index
                        }}
                        onClick={() => handleAppointmentClick(appointment.id)}
                      >
                        <p className="font-medium text-sm truncate">{appointment.customer}</p>
                        <p className="text-xs truncate">{appointment.service}</p>
                        <p className="text-xs opacity-70">{appointment.startTime} ({appointment.duration} דקות)</p>
                        {appointment.price && <p className="text-xs font-semibold">{appointment.price}</p>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : view === 'week' ? (
            <div className="grid grid-cols-7 gap-2 p-4" dir="rtl">
              {viewDates.map((dayDate) => (
                <div key={dayDate.toISOString()} className="border rounded p-2">
                  <h3 className="text-center font-medium mb-2">
                    {new Intl.DateTimeFormat('he-IL', { weekday: 'short' }).format(dayDate)}
                    <br />
                    {new Intl.DateTimeFormat('he-IL', { day: 'numeric' }).format(dayDate)}
                  </h3>
                  <div className="space-y-2">
                    {filteredAppointments
                      .filter(app => app.date ? isSameDay(app.date, dayDate) : false)
                      .map(appointment => (
                        <div
                          key={appointment.id}
                          className="rounded-md p-2 transition-all hover:ring-2 hover:ring-primary cursor-pointer shadow-sm"
                          style={{
                            backgroundColor: appointment.color || 'var(--nail-200)',
                          }}
                          onClick={() => handleAppointmentClick(appointment.id)}
                        >
                          <p className="font-medium text-sm truncate">{appointment.customer}</p>
                          <p className="text-xs truncate">{appointment.service}</p>
                          <p className="text-xs opacity-70">{appointment.startTime}</p>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-1 p-2" dir="rtl">
              {/* Month header (days of week) */}
              {['יום א׳', 'יום ב׳', 'יום ג׳', 'יום ד׳', 'יום ה׳', 'יום ו׳', 'שבת'].map((day) => (
                <div key={day} className="text-center font-medium p-2">
                  {day}
                </div>
              ))}
              
              {/* Month grid */}
              {viewDates.map((dayDate) => {
                const dayAppointments = filteredAppointments.filter(app => 
                  app.date ? isSameDay(app.date, dayDate) : false
                );
                
                return (
                  <div 
                    key={dayDate.toISOString()} 
                    className={cn(
                      "border min-h-[100px] p-1 hover:bg-accent/50 cursor-pointer",
                      isSameDay(dayDate, new Date()) && "bg-accent/20"
                    )}
                    onClick={() => {
                      onDateChange(dayDate);
                      setView('day');
                    }}
                  >
                    <div className="text-right font-medium text-sm">
                      {dayDate.getDate()}
                    </div>
                    {dayAppointments.length > 0 ? (
                      <div className="mt-1">
                        {dayAppointments.length > 2 ? (
                          <>
                            <div 
                              className="text-xs p-1 rounded mb-1 truncate" 
                              style={{ backgroundColor: dayAppointments[0].color || 'var(--nail-200)' }}
                            >
                              {dayAppointments[0].customer}
                            </div>
                            <div className="text-xs text-center">
                              +{dayAppointments.length - 1} עוד
                            </div>
                          </>
                        ) : (
                          dayAppointments.map(app => (
                            <div 
                              key={app.id}
                              className="text-xs p-1 rounded mb-1 truncate" 
                              style={{ backgroundColor: app.color || 'var(--nail-200)' }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAppointmentClick(app.id);
                              }}
                            >
                              {app.customer}
                            </div>
                          ))
                        )}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GanttChart;
