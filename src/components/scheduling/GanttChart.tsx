
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, addDays, startOfWeek, endOfWeek, addMonths, startOfMonth, endOfMonth, isWithinInterval, isSameDay, isSameMonth } from 'date-fns';
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
  verticalPosition?: number; // For managing overlapping appointments
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
  
  // Convert startTime string to percentage position on timeline
  const getAppointmentPosition = (startTime: string) => {
    // Parse the time to get hours and minutes
    const [hoursStr, minutesStr] = startTime.split(':');
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
    
    // Calculate position based on 8:00 being the start (hours - 8)
    const hourPosition = hours - 8; // Subtract 8 as our timeline starts at 8:00
    const minutePercentage = minutes / 60;
    
    // Calculate percentage position on the timeline
    return (hourPosition + minutePercentage) / HOURS.length * 100;
  };
  
  // Calculate width based on appointment duration
  const getAppointmentWidth = (duration: number) => {
    const hourWidth = 100 / HOURS.length;
    return (duration / 60) * hourWidth;
  };

  const viewDates = useMemo(() => {
    if (view === 'day') {
      return [date];
    } else if (view === 'week') {
      const start = startOfWeek(date, { weekStartsOn: 0 });
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

  const filteredAppointments = useMemo(() => {
    if (view === 'day') {
      return appointments.filter(appointment => {
        if (appointment.date) {
          return isSameDay(appointment.date, date);
        }
        return true;
      });
    } else {
      return appointments.filter(appointment => {
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
        return isSameDay(new Date(), date);
      });
    }
  }, [appointments, view, date]);

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

  const formatHour = (hour: number) => {
    return `${hour.toString().padStart(2, '0')}:00`;
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsAppointmentDetailsOpen(true);
  };

  const handleEditAppointment = () => {
    if (selectedAppointment) {
      navigate(`/scheduling/edit/${selectedAppointment.id}`);
    }
  };

  const handleDeleteAppointment = () => {
    if (selectedAppointment) {
      setIsAppointmentDetailsOpen(false);
      setSelectedAppointment(null);
    }
  };

  // Get the current time position on the timeline
  const getCurrentTimePosition = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // Check if current time is within our timeline bounds
    if (currentHour < 8 || currentHour >= 24) {
      return -1; // Out of bounds
    }
    
    // Calculate position based on 8:00 being the start
    const hourPosition = currentHour - 8;
    const minutePercentage = currentMinute / 60;
    
    // Calculate percentage position on the timeline
    return (hourPosition + minutePercentage) / HOURS.length * 100;
  };

  // Sort appointments by time for proper display
  const sortedAppointments = useMemo(() => {
    return [...filteredAppointments].sort((a, b) => {
      // First convert startTime string to minutes past midnight for easy comparison
      const getMinutes = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
      };
      
      const timeA = getMinutes(a.startTime);
      const timeB = getMinutes(b.startTime);
      
      return timeA - timeB; // Sort chronologically
    });
  }, [filteredAppointments]);

  // Calculate vertical positions to prevent overlaps
  const getAppointmentVerticalPosition = (appointment: Appointment, index: number) => {
    // Find which appointments overlap with the current one
    const overlappingAppointments = sortedAppointments.filter((app, i) => {
      if (i >= index) return false; // Only check previous appointments
      
      // Parse appointment times and calculate end times
      const getTimeInMinutes = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
      };
      
      const appStartMinutes = getTimeInMinutes(app.startTime);
      const appEndMinutes = appStartMinutes + app.duration;
      
      const currentStartMinutes = getTimeInMinutes(appointment.startTime);
      const currentEndMinutes = currentStartMinutes + appointment.duration;
      
      // Check if appointments overlap in time
      return (currentStartMinutes < appEndMinutes && appStartMinutes < currentEndMinutes);
    });
    
    // Get rows already used by overlapping appointments
    const usedRows = overlappingAppointments.map(app => app.verticalPosition || 0);
    
    // Find first available row
    let row = 0;
    while (usedRows.includes(row)) {
      row++;
    }
    
    // Store the calculated vertical position
    appointment.verticalPosition = row;
    
    // Return percentage value for CSS positioning
    return row * 33; // 33% of height per row
  };

  return (
    <Card className="shadow-md border-muted overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2 bg-white" dir="rtl">
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
                <div className="hours-header flex border-b bg-muted/10">
                  {HOURS.map((hour) => (
                    <div 
                      key={hour} 
                      className="hour-cell text-center py-2 text-xs font-medium"
                      style={{ width: `${100 / HOURS.length}%` }}
                    >
                      {formatHour(hour)}
                    </div>
                  ))}
                </div>

                <div className="relative h-[600px] p-2">
                  {HOURS.map((hour, index) => (
                    <div 
                      key={`hour-${hour}`}
                      className="absolute border-r border-muted/30 h-full"
                      style={{ 
                        left: `${(index / HOURS.length) * 100}%`,
                        top: 0
                      }}
                    />
                  ))}

                  {isSameDay(date, new Date()) && (
                    <>
                      {getCurrentTimePosition() >= 0 && (
                        <div 
                          className="absolute h-full border-r-2 border-red-500 z-10"
                          style={{ 
                            left: `${getCurrentTimePosition()}%` 
                          }}
                        >
                          <div className="absolute -left-2 -top-1 h-4 w-4 rounded-full bg-red-500"></div>
                        </div>
                      )}
                    </>
                  )}

                  {sortedAppointments.length === 0 ? (
                    <div className="flex justify-center items-center h-full text-muted-foreground">
                      אין פגישות להיום
                    </div>
                  ) : (
                    <div className="relative w-full h-full">
                      {sortedAppointments.map((appointment, index) => {
                        // Calculate position based on startTime
                        const leftPosition = getAppointmentPosition(appointment.startTime);
                        const width = getAppointmentWidth(appointment.duration);
                        
                        // Calculate vertical position to prevent overlaps
                        const verticalPosition = getAppointmentVerticalPosition(appointment, index);
                        
                        return (
                          <div
                            key={appointment.id}
                            className="absolute rounded-md border shadow-sm transition-all hover:shadow-md hover:ring-1 hover:ring-primary cursor-pointer"
                            style={{
                              backgroundColor: appointment.color || '#E5DEFF',
                              left: `${leftPosition}%`,
                              width: `${width}%`,
                              top: `${verticalPosition}%`,
                              height: '30%',
                              minWidth: '120px',
                            }}
                            onClick={() => handleAppointmentClick(appointment)}
                          >
                            <div className="p-2 h-full flex flex-col overflow-hidden">
                              <div className="flex-1">
                                <p className="font-medium text-sm truncate text-gray-800">{appointment.customer}</p>
                                <p className="text-xs truncate text-gray-600">{appointment.service}</p>
                              </div>
                              <div className="flex items-center justify-between mt-auto">
                                <div className="flex items-center text-xs opacity-80 gap-1 text-gray-700">
                                  <Clock className="h-3 w-3" />
                                  <span>{appointment.startTime}</span>
                                </div>
                                {appointment.price && (
                                  <Badge variant="outline" className="bg-white/70 text-xs font-medium">
                                    {appointment.price}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
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
                  // Get appointments for this day and sort by time
                  const dayAppointments = appointments
                    .filter(app => app.date ? isSameDay(app.date, dayDate) : false)
                    .sort((a, b) => {
                      const timeA = a.startTime.split(':').map(Number);
                      const timeB = b.startTime.split(':').map(Number);
                      
                      if (timeA[0] !== timeB[0]) {
                        return timeA[0] - timeB[0]; // Sort by hour
                      }
                      return timeA[1] - timeB[1]; // Then by minute
                    });
                  
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
                          "text-center mb-2 p-1 rounded-full w-8 h-8 flex items-center justify-center mx-auto cursor-pointer",
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
                              className="rounded-md p-2 border border-white/20 shadow-sm hover:shadow-md hover:ring-1 hover:ring-primary cursor-pointer text-right text-xs bg-white"
                              style={{
                                backgroundColor: appointment.color || '#E5DEFF',
                              }}
                              onClick={() => handleAppointmentClick(appointment)}
                            >
                              <div className="font-medium truncate">{appointment.customer}</div>
                              <div className="opacity-75 truncate">{appointment.service}</div>
                              <div className="flex items-center justify-between mt-1">
                                <div className="flex items-center gap-1 opacity-80">
                                  <Clock className="h-3 w-3" />
                                  <span>{appointment.startTime}</span>
                                </div>
                                {appointment.price && (
                                  <Badge variant="outline" className="bg-white/70 text-xs">
                                    {appointment.price}
                                  </Badge>
                                )}
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
                
                {viewDates.map((dayDate) => {
                  const isToday = isSameDay(dayDate, new Date());
                  // Get and sort appointments for this day
                  const dayAppointments = appointments
                    .filter(app => app.date ? isSameDay(app.date, dayDate) : false)
                    .sort((a, b) => {
                      const timeA = a.startTime.split(':').map(Number);
                      const timeB = b.startTime.split(':').map(Number);
                      return timeA[0] * 60 + timeA[1] - (timeB[0] * 60 + timeB[1]);
                    });
                  
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
                        "text-right font-medium text-sm w-6 h-6 flex items-center justify-center rounded-full float-right mb-1",
                        isToday && "bg-primary text-primary-foreground"
                      )}>
                        {dayDate.getDate()}
                      </div>
                      
                      <div className="clear-both">
                        {dayAppointments.length > 0 ? (
                          <div className="mt-1">
                            {dayAppointments.length > 2 ? (
                              <>
                                <div 
                                  className="text-xs p-1 mb-1 truncate text-right rounded-md border border-white/20 shadow-sm" 
                                  style={{ backgroundColor: dayAppointments[0].color || '#E5DEFF' }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAppointmentClick(dayAppointments[0]);
                                  }}
                                >
                                  <span className="font-medium">{dayAppointments[0].startTime}</span> {dayAppointments[0].customer}
                                </div>
                                <div className="text-xs text-center">
                                  +{dayAppointments.length - 1} עוד
                                </div>
                              </>
                            ) : (
                              dayAppointments.map(app => (
                                <div 
                                  key={app.id}
                                  className="text-xs p-1 rounded-md mb-1 truncate text-right border border-white/20 shadow-sm" 
                                  style={{ backgroundColor: app.color || '#E5DEFF' }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAppointmentClick(app);
                                  }}
                                >
                                  <span className="font-medium">{app.startTime}</span> {app.customer}
                                </div>
                              ))
                            )}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </CardContent>

      {selectedAppointment && (
        <Dialog open={isAppointmentDetailsOpen} onOpenChange={setIsAppointmentDetailsOpen}>
          <DialogContent className="text-right max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl">{selectedAppointment.customer}</DialogTitle>
              <DialogDescription>
                פרטי פגישה
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 mt-2">
              <div className="flex items-center gap-2 justify-end">
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
              
              <div className="grid grid-cols-2 gap-4 text-right">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">תאריך</p>
                  <p>{selectedAppointment.date ? format(selectedAppointment.date, 'dd/MM/yyyy') : 'לא צוין'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">שעה</p>
                  <p>{selectedAppointment.startTime}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">משך</p>
                  <p>{selectedAppointment.duration} דקות</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between gap-2 mt-6">
              <Button variant="destructive" size="sm" onClick={handleDeleteAppointment} className="gap-1">
                <Trash2 className="h-4 w-4" />
                מחק
              </Button>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsAppointmentDetailsOpen(false)}>
                  סגור
                </Button>
                <Button onClick={handleEditAppointment} className="gap-1">
                  <Edit className="h-4 w-4" />
                  ערוך
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};

export default GanttChart;
