
import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, addDays, startOfWeek, endOfWeek, addMonths, startOfMonth, endOfMonth, isWithinInterval, isSameDay, isSameMonth, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from '@/components/ui/separator';

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
const DAYS_OF_WEEK = ['יום א׳', 'יום ב׳', 'יום ג׳', 'יום ד׳', 'יום ה׳', 'יום ו׳', 'שבת'];

const GanttChart = ({ appointments, date, onDateChange }: GanttChartProps) => {
  const [view, setView] = useState<'day' | 'week' | 'month'>('day');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isAppointmentDetailsOpen, setIsAppointmentDetailsOpen] = useState(false);
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

  // Get the formatted date based on current view and locale
  const getViewTitle = () => {
    if (view === 'day') {
      return new Intl.DateTimeFormat('he-IL', { 
        weekday: 'long',
        year: 'numeric',
        month: 'long', 
        day: 'numeric' 
      }).format(date);
    } else if (view === 'week') {
      const startDate = startOfWeek(date, { weekStartsOn: 0 });
      const endDate = endOfWeek(date, { weekStartsOn: 0 });
      return `${new Intl.DateTimeFormat('he-IL', { day: 'numeric' }).format(startDate)} - ${new Intl.DateTimeFormat('he-IL', { day: 'numeric', month: 'long', year: 'numeric' }).format(endDate)}`;
    } else if (view === 'month') {
      return new Intl.DateTimeFormat('he-IL', { month: 'long', year: 'numeric' }).format(date);
    }
    return '';
  };

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

  const goToToday = () => {
    onDateChange(new Date());
  };

  // Format hours in 24-hour format
  const formatHour = (hour: number) => {
    return `${hour.toString().padStart(2, '0')}:00`;
  };

  // Handle appointment click
  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsAppointmentDetailsOpen(true);
  };

  // Handle edit appointment
  const handleEditAppointment = () => {
    if (selectedAppointment) {
      navigate(`/scheduling/edit/${selectedAppointment.id}`);
    }
  };

  return (
    <Card className="shadow-md border-muted">
      <CardHeader className="flex flex-row items-center justify-between pb-2" dir="rtl">
        <CardTitle className="text-xl font-bold">פגישות</CardTitle>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg overflow-hidden border">
            <Button
              variant={view === 'day' ? 'default' : 'outline'}
              size="sm"
              className={cn(
                "rounded-none border-0",
                view === 'day' && 'bg-primary text-primary-foreground hover:bg-primary/90'
              )}
              onClick={() => setView('day')}
            >
              יום
            </Button>
            <Button
              variant={view === 'week' ? 'default' : 'outline'}
              size="sm"
              className={cn(
                "rounded-none border-0 border-r border-l",
                view === 'week' && 'bg-primary text-primary-foreground hover:bg-primary/90'
              )}
              onClick={() => setView('week')}
            >
              שבוע
            </Button>
            <Button
              variant={view === 'month' ? 'default' : 'outline'}
              size="sm"
              className={cn(
                "rounded-none border-0",
                view === 'month' && 'bg-primary text-primary-foreground hover:bg-primary/90'
              )}
              onClick={() => setView('month')}
            >
              חודש
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex items-center justify-between p-4 border-b bg-muted/20" dir="rtl">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={prevPeriod} className="h-8 w-8">
              <ChevronRight className="h-4 w-4" />
            </Button>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="px-2 flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  <span className="font-medium">{getViewTitle()}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => newDate && onDateChange(newDate)}
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            
            <Button variant="outline" size="icon" onClick={nextPeriod} className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
          
          <Button variant="outline" size="sm" onClick={goToToday} className="text-xs px-3">
            היום
          </Button>
        </div>

        <div className="border-t rounded-b-lg overflow-hidden">
          {view === 'day' ? (
            <div className="gantt-container relative overflow-x-auto min-h-[600px] bg-white">
              <div className="gantt-timeline">
                {/* Hour markers */}
                <div className="hours-header flex border-b bg-muted/10">
                  {HOURS.map((hour) => (
                    <div 
                      key={hour} 
                      className="hour-cell text-center py-2 text-xs font-medium w-[calc(100%/16)] border-l last:border-l-0"
                    >
                      {formatHour(hour)}
                    </div>
                  ))}
                </div>

                {/* Gantt Timeline */}
                <div className="relative h-[600px]">
                  {/* Hour lines */}
                  {HOURS.map((hour, index) => (
                    <div 
                      key={`hour-${hour}`}
                      className="absolute border-t border-muted/30 w-full"
                      style={{ top: `${(hour - 8) * CELL_HEIGHT}px` }}
                    >
                      <span className="absolute -top-3 right-1 text-xs font-medium text-muted-foreground">
                        {formatHour(hour)}
                      </span>
                    </div>
                  ))}

                  {/* Current time indicator */}
                  {isSameDay(date, new Date()) && (
                    <div 
                      className="absolute w-full border-t-2 border-red-500 z-10"
                      style={{ 
                        top: `${((new Date().getHours() - 8) + (new Date().getMinutes() / 60)) * CELL_HEIGHT}px` 
                      }}
                    >
                      <div className="absolute -top-2 -right-1 h-4 w-4 rounded-full bg-red-500"></div>
                    </div>
                  )}

                  {/* Appointments */}
                  {filteredAppointments.length === 0 ? (
                    <div className="flex justify-center items-center h-full text-muted-foreground">
                      אין פגישות להיום
                    </div>
                  ) : (
                    filteredAppointments.map((appointment, index) => {
                      const style = getAppointmentStyle(appointment.startTime, appointment.duration);
                      // Calculate horizontal positioning to avoid overlaps
                      const column = index % 3;
                      const width = Math.min(30, 90 / Math.min(filteredAppointments.length, 3));
                      
                      return (
                        <div
                          key={appointment.id}
                          className="absolute rounded-md p-3 transition-all hover:ring-2 hover:ring-primary cursor-pointer shadow-sm text-right"
                          style={{
                            ...style,
                            backgroundColor: appointment.color || 'var(--nail-200)',
                            right: `${column * width}%`,
                            width: `${width}%`,
                            zIndex: 5,
                          }}
                          onClick={() => handleAppointmentClick(appointment)}
                        >
                          <p className="font-medium text-sm truncate">{appointment.customer}</p>
                          <p className="text-xs truncate">{appointment.service}</p>
                          <div className="flex items-center text-xs opacity-80 mt-1 gap-1">
                            <Clock className="h-3 w-3" />
                            <span>
                              {appointment.startTime} ({appointment.duration} דקות)
                            </span>
                          </div>
                          {appointment.price && (
                            <Badge variant="outline" className="mt-1 bg-white/80 text-xs font-medium">
                              {appointment.price}
                            </Badge>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          ) : view === 'week' ? (
            <div className="week-view bg-white">
              <div className="grid grid-cols-7 bg-muted/10 border-b">
                {DAYS_OF_WEEK.map((day, index) => (
                  <div key={day} className="text-center py-2 font-medium text-sm border-l last:border-l-0">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 h-[600px] overflow-y-auto">
                {viewDates.map((dayDate) => {
                  const isToday = isSameDay(dayDate, new Date());
                  const dayAppointments = appointments.filter(app => 
                    app.date ? isSameDay(app.date, dayDate) : false
                  );
                  
                  return (
                    <div 
                      key={dayDate.toISOString()} 
                      className={cn(
                        "min-h-full border-l last:border-l-0 p-2",
                        isToday && "bg-muted/10"
                      )}
                    >
                      <div 
                        className={cn(
                          "text-center mb-2 p-1 rounded-full w-8 h-8 flex items-center justify-center mx-auto",
                          isToday && "bg-primary text-primary-foreground"
                        )}
                        onClick={() => {
                          onDateChange(dayDate);
                          setView('day');
                        }}
                      >
                        {dayDate.getDate()}
                      </div>
                      
                      <div className="space-y-1">
                        {dayAppointments.length === 0 ? (
                          <div className="text-xs text-center text-muted-foreground mt-4">
                            אין פגישות
                          </div>
                        ) : (
                          dayAppointments.map(appointment => (
                            <div
                              key={appointment.id}
                              className="rounded-md p-2 transition-all hover:ring-1 hover:ring-primary cursor-pointer shadow-sm text-right text-xs bg-white"
                              style={{
                                backgroundColor: appointment.color || 'var(--nail-200)',
                              }}
                              onClick={() => handleAppointmentClick(appointment)}
                            >
                              <div className="font-medium truncate">{appointment.customer}</div>
                              <div className="opacity-75 truncate">{appointment.service}</div>
                              <div className="flex items-center gap-1 mt-1 opacity-80">
                                <Clock className="h-3 w-3" />
                                <span>{appointment.startTime}</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="month-view bg-white">
              <div className="grid grid-cols-7 bg-muted/10 border-b">
                {DAYS_OF_WEEK.map((day) => (
                  <div key={day} className="text-center py-2 font-medium text-sm">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 auto-rows-fr">
                {/* Fill in the days from previous month if needed */}
                {(() => {
                  const firstDay = startOfMonth(date).getDay();
                  const prevMonthDays = [];
                  
                  for (let i = 0; i < firstDay; i++) {
                    const prevDate = addDays(startOfMonth(date), -(firstDay - i));
                    prevMonthDays.push(
                      <div 
                        key={`prev-${i}`} 
                        className="border min-h-[100px] p-2 bg-muted/5 text-muted-foreground"
                      >
                        <div className="text-right opacity-50 text-sm">{prevDate.getDate()}</div>
                      </div>
                    );
                  }
                  return prevMonthDays;
                })()}
                
                {/* Current month days */}
                {viewDates.map((dayDate) => {
                  const isToday = isSameDay(dayDate, new Date());
                  const dayAppointments = appointments.filter(app => 
                    app.date ? isSameDay(app.date, dayDate) : false
                  );
                  
                  return (
                    <div 
                      key={dayDate.toISOString()} 
                      className={cn(
                        "border min-h-[100px] p-2 hover:bg-muted/10 cursor-pointer",
                        isToday && "bg-muted/10",
                        !isSameMonth(dayDate, date) && "bg-muted/5 text-muted-foreground"
                      )}
                      onClick={() => {
                        onDateChange(dayDate);
                        setView('day');
                      }}
                    >
                      <div className={cn(
                        "text-right font-medium text-sm w-6 h-6 flex items-center justify-center rounded-full",
                        isToday && "bg-primary text-primary-foreground"
                      )}>
                        {dayDate.getDate()}
                      </div>
                      
                      {dayAppointments.length > 0 ? (
                        <div className="mt-1">
                          {dayAppointments.length > 2 ? (
                            <>
                              <div 
                                className="text-xs p-1 rounded mb-1 truncate text-right" 
                                style={{ backgroundColor: dayAppointments[0].color || 'var(--nail-200)' }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAppointmentClick(dayAppointments[0]);
                                }}
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
                                className="text-xs p-1 rounded mb-1 truncate text-right" 
                                style={{ backgroundColor: app.color || 'var(--nail-200)' }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAppointmentClick(app);
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
            </div>
          )}
        </div>
      </CardContent>

      {/* Appointment Details Dialog */}
      {selectedAppointment && (
        <Dialog open={isAppointmentDetailsOpen} onOpenChange={setIsAppointmentDetailsOpen}>
          <DialogContent className="text-right">
            <DialogHeader>
              <DialogTitle className="text-xl">{selectedAppointment.customer}</DialogTitle>
              <DialogDescription>
                פרטי פגישה
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-3 mt-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-white">
                  {selectedAppointment.service}
                </Badge>
                {selectedAppointment.price && (
                  <Badge variant="secondary">
                    {selectedAppointment.price}
                  </Badge>
                )}
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">תאריך</p>
                  <p>{selectedAppointment.date ? format(selectedAppointment.date, 'dd/MM/yyyy') : 'לא צוין'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">שעה</p>
                  <p>{selectedAppointment.startTime}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">משך</p>
                  <p>{selectedAppointment.duration} דקות</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsAppointmentDetailsOpen(false)}>
                סגור
              </Button>
              <Button onClick={handleEditAppointment}>
                ערוך פגישה
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};

export default GanttChart;
