
import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, addDays, startOfWeek, endOfWeek, addMonths, startOfMonth, endOfMonth, isWithinInterval, isSameDay, isSameMonth, parse } from 'date-fns';
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
import { useIsMobile } from '@/hooks/use-mobile';

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

const HOURS = Array.from({ length: 12 }, (_, i) => i + 8); // 8:00 to 19:00
const CELL_HEIGHT = 60;
const DAYS_OF_WEEK = ['יום א׳', 'יום ב׳', 'יום ג׳', 'יום ד׳', 'יום ה׳', 'יום ו׳', 'שבת'];

const GanttChart = ({ appointments, date, onDateChange }: GanttChartProps) => {
  const isMobile = useIsMobile();
  const [view, setView] = useState<'day' | 'week' | 'month'>('day');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isAppointmentDetailsOpen, setIsAppointmentDetailsOpen] = useState(false);
  const [isCurrentTimeVisible, setIsCurrentTimeVisible] = useState<boolean>(false);
  const navigate = useNavigate();
  
  const getAppointmentPosition = (startTime: string): number => {
    const [hoursStr, minutesStr] = startTime.split(':');
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
    
    const hourPosition = hours - 8;
    const minutePercentage = minutes / 60;
    
    return (hourPosition + minutePercentage) / HOURS.length * 100;
  };

  const getAppointmentWidth = (duration: number): number => {
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

  const getCurrentTimePosition = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    if (currentHour < 8 || currentHour >= 24) {
      return -1; // Out of bounds
    }
    
    const hourPosition = currentHour - 8;
    const minutePercentage = currentMinute / 60;
    
    return (hourPosition + minutePercentage) / HOURS.length * 100;
  };

  const timeToMinutes = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const sortedAppointments = useMemo(() => {
    return [...filteredAppointments].sort((a, b) => {
      return timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
    });
  }, [filteredAppointments]);

  const calculateAppointmentSlots = (appointments: Appointment[]): Appointment[] => {
    if (!appointments.length) return [];

    const result = [...appointments];
    const slots: { [key: number]: number[] } = {};

    result.sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
    
    for (const appointment of result) {
      const startMinutes = timeToMinutes(appointment.startTime);
      const endMinutes = startMinutes + appointment.duration;
      
      let slotIndex = 0;
      while (true) {
        const isSlotAvailable = !slots[slotIndex]?.some(
          occupiedMinute => 
            occupiedMinute >= startMinutes && 
            occupiedMinute < endMinutes
        );
        
        if (isSlotAvailable) {
          if (!slots[slotIndex]) slots[slotIndex] = [];
          for (let min = startMinutes; min < endMinutes; min += 5) {
            slots[slotIndex].push(min);
          }
          appointment.verticalPosition = slotIndex;
          break;
        }
        
        slotIndex++;
      }
    }
    
    return result;
  };

  const slottedAppointments = useMemo(() => {
    return calculateAppointmentSlots(sortedAppointments);
  }, [sortedAppointments]);

  const weeklyAppointmentsByDay = useMemo(() => {
    if (view !== 'week') return [];
    
    return viewDates.map(dayDate => {
      const dayAppointments = filteredAppointments
        .filter(app => app.date ? isSameDay(app.date, dayDate) : false)
        .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
      
      return {
        date: dayDate,
        appointments: dayAppointments
      };
    });
  }, [filteredAppointments, viewDates, view]);

  const [currentTimePos, setCurrentTimePos] = useState<number>(getCurrentTimePosition());
  
  useEffect(() => {
    if (view !== 'day' || !isSameDay(date, new Date())) {
      setIsCurrentTimeVisible(false);
      return;
    }
    
    const updateCurrentTime = () => {
      const position = getCurrentTimePosition();
      setCurrentTimePos(position);
      setIsCurrentTimeVisible(position >= 0);
    };
    
    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 60000);
    
    return () => clearInterval(interval);
  }, [view, date]);

  const formatAppointmentTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  };

  const calculateOverlap = (appointments: Appointment[]): Appointment[] => {
    const sortedApps = [...appointments].sort((a, b) => {
      const timeA = parse(a.startTime, 'HH:mm', new Date()).getTime();
      const timeB = parse(b.startTime, 'HH:mm', new Date()).getTime();
      return timeA - timeB;
    });

    const processed: Appointment[] = [];
    const overlaps: { [key: string]: number } = {};

    sortedApps.forEach(app => {
      const appStart = parse(app.startTime, 'HH:mm', new Date()).getTime();
      const appEnd = appStart + (app.duration * 60 * 1000);
      
      let maxOverlap = 0;
      let column = 0;
      
      processed.forEach(existing => {
        const existingStart = parse(existing.startTime, 'HH:mm', new Date()).getTime();
        const existingEnd = existingStart + (existing.duration * 60 * 1000);
        
        if (appStart < existingEnd && appEnd > existingStart) {
          maxOverlap = Math.max(maxOverlap, (overlaps[existing.id] || 0) + 1);
        }
      });
      
      while (processed.some(existing => {
        const existingStart = parse(existing.startTime, 'HH:mm', new Date()).getTime();
        const existingEnd = existingStart + (existing.duration * 60 * 1000);
        return appStart < existingEnd && 
               appEnd > existingStart && 
               overlaps[existing.id] === column;
      })) {
        column++;
      }
      
      overlaps[app.id] = column;
      processed.push(app);
    });

    return sortedApps.map(app => ({
      ...app,
      verticalPosition: overlaps[app.id]
    }));
  };

  const renderAppointment = (appointment: Appointment, containerWidth: number) => {
    const left = getAppointmentPosition(appointment.startTime);
    const width = (appointment.duration / 60) * (100 / HOURS.length);
    const maxOverlap = Math.max(...appointments.map(a => a.verticalPosition || 0));
    const verticalGap = isMobile ? 0.5 : 1;
    const cardHeight = isMobile ? 
      (90 - (verticalGap * (maxOverlap + 1))) / (maxOverlap + 1) :
      (80 - (verticalGap * (maxOverlap + 1))) / (maxOverlap + 1);
    const top = appointment.verticalPosition ? 
      (appointment.verticalPosition * (cardHeight + verticalGap)) : 0;

    return (
      <div
        key={appointment.id}
        className="absolute rounded-md border shadow-sm transition-all hover:shadow-md hover:ring-1 hover:ring-primary cursor-pointer animate-fade-in"
        style={{
          backgroundColor: appointment.color || '#E5DEFF',
          left: `${left}%`,
          width: `${width}%`,
          top: `${top}%`,
          height: `${cardHeight}%`,
          minHeight: isMobile ? '30px' : '40px',
          minWidth: isMobile ? '70px' : '100px',
          zIndex: appointment.verticalPosition || 1
        }}
        onClick={() => handleAppointmentClick(appointment)}
      >
        <div className={`${isMobile ? 'p-1' : 'p-1.5'} h-full flex flex-col overflow-hidden`}>
          <div className="flex-1">
            <p className={`font-medium truncate text-gray-800 ${isMobile ? 'text-[9px]' : 'text-xs'}`}>{appointment.customer}</p>
            <p className={`truncate text-gray-600 ${isMobile ? 'text-[8px]' : 'text-[10px]'}`}>{appointment.service}</p>
          </div>
          <div className="flex items-center justify-between mt-auto">
            <div className={`flex items-center opacity-80 gap-1 text-gray-700 ${isMobile ? 'text-[8px]' : 'text-[10px]'}`}>
              <Clock className={isMobile ? 'h-2 w-2' : 'h-2.5 w-2.5'} />
              <span>{formatAppointmentTime(appointment.startTime)}</span>
            </div>
            {appointment.price && (
              <Badge variant="outline" className={`bg-white/70 font-medium px-1 py-0.5 ${isMobile ? 'text-[8px]' : 'text-[9px]'}`}>
                {appointment.price}
              </Badge>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderTimeGrid = () => (
    <div className="hours-header flex border-b bg-muted/10 sticky top-0 z-10">
      {HOURS.map((hour) => (
        <div 
          key={hour} 
          className={`hour-cell text-center py-2 font-medium ${isMobile ? 'text-[10px]' : 'text-xs'}`}
          style={{ width: `${100 / HOURS.length}%` }}
        >
          {`${hour.toString().padStart(2, '0')}${isMobile ? '' : ':00'}`}
        </div>
      ))}
    </div>
  );

  const processedAppointments = useMemo(() => {
    return calculateOverlap(filteredAppointments);
  }, [filteredAppointments]);

  return (
    <Card className="shadow-md border-muted overflow-hidden">
      <CardHeader className={`flex flex-row items-center justify-between pb-2 bg-white ${isMobile ? 'px-3 py-2' : ''}`} dir="rtl">
        <CardTitle className={`font-bold ${isMobile ? 'text-base' : 'text-xl'}`}>פגישות</CardTitle>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg overflow-hidden border">
            <Button
              variant={view === 'day' ? 'default' : 'outline'}
              size={isMobile ? "sm" : "sm"}
              className={cn(
                "rounded-none border-0",
                view === 'day' && 'bg-primary text-primary-foreground hover:bg-primary/90',
                isMobile && 'px-2 text-xs h-8'
              )}
              onClick={() => setView('day')}
            >
              יום
            </Button>
            <Button
              variant={view === 'week' ? 'default' : 'outline'}
              size={isMobile ? "sm" : "sm"}
              className={cn(
                "rounded-none border-0 border-r border-l",
                view === 'week' && 'bg-primary text-primary-foreground hover:bg-primary/90',
                isMobile && 'px-2 text-xs h-8'
              )}
              onClick={() => setView('week')}
            >
              שבוע
            </Button>
            <Button
              variant={view === 'month' ? 'default' : 'outline'}
              size={isMobile ? "sm" : "sm"}
              className={cn(
                "rounded-none border-0",
                view === 'month' && 'bg-primary text-primary-foreground hover:bg-primary/90',
                isMobile && 'px-2 text-xs h-8'
              )}
              onClick={() => setView('month')}
            >
              חודש
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className={`flex items-center justify-between border-b bg-muted/20 ${isMobile ? 'p-2' : 'p-4'}`} dir="rtl">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={prevPeriod} className={isMobile ? "h-7 w-7" : "h-8 w-8"}>
              <ChevronRight className={isMobile ? "h-3 w-3" : "h-4 w-4"} />
            </Button>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={`flex items-center gap-2 ${isMobile ? 'px-1.5 py-1 h-7 text-xs' : 'px-2'}`}>
                  <CalendarIcon className={isMobile ? "h-3 w-3" : "h-4 w-4"} />
                  <span className={`font-medium ${isMobile ? 'text-xs' : ''}`}>{getViewTitle()}</span>
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
            
            <Button variant="outline" size="icon" onClick={nextPeriod} className={isMobile ? "h-7 w-7" : "h-8 w-8"}>
              <ChevronLeft className={isMobile ? "h-3 w-3" : "h-4 w-4"} />
            </Button>
          </div>
          
          <Button variant="outline" size={isMobile ? "sm" : "sm"} onClick={goToToday} className={`${isMobile ? 'text-[10px] px-2 h-7' : 'text-xs px-3'}`}>
            היום
          </Button>
        </div>

        <div className="border-t rounded-b-lg overflow-hidden">
          {view === 'day' ? (
            <div className="gantt-container relative overflow-x-auto min-h-[600px] bg-white">
              {renderTimeGrid()}
              <div className={`relative ${isMobile ? 'h-[450px]' : 'h-[600px]'} p-2`}>
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
                
                {processedAppointments.length === 0 ? (
                  <div className={`flex justify-center items-center h-full text-muted-foreground ${isMobile ? 'text-sm' : ''}`}>
                    אין פגישות להיום
                  </div>
                ) : (
                  <div className="relative w-full h-full">
                    {processedAppointments.map(appointment => renderAppointment(appointment, 100 / HOURS.length))}
                  </div>
                )}
              </div>
            </div>
          ) : view === 'week' ? (
            <div className="week-view bg-white">
              <div className="grid grid-cols-7 bg-muted/10 border-b">
                {DAYS_OF_WEEK.map((day, index) => (
                  <div key={day} className={`text-center py-2 font-medium border-l last:border-l-0 ${isMobile ? 'text-[10px]' : 'text-sm'}`}>
                    {isMobile ? day.substring(0, 4) : day}
                  </div>
                ))}
              </div>

              <div className={`grid grid-cols-7 ${isMobile ? 'h-[450px]' : 'h-[600px]'} overflow-y-auto`}>
                {weeklyAppointmentsByDay.map(({ date: dayDate, appointments: dayAppointments }) => {
                  const isToday = isSameDay(dayDate, new Date());
                  
                  return (
                    <div 
                      key={dayDate.toISOString()} 
                      className={cn(
                        "min-h-full border-l last:border-l-0",
                        isToday && "bg-muted/10",
                        isMobile ? "p-1" : "p-2"
                      )}
                    >
                      <div 
                        className={cn(
                          "text-center mb-2 rounded-full flex items-center justify-center mx-auto cursor-pointer",
                          isToday && "bg-primary text-primary-foreground",
                          isMobile ? "w-6 h-6 text-xs" : "w-8 h-8"
                        )}
                        onClick={() => {
                          onDateChange(dayDate);
                          setView('day');
                        }}
                      >
                        {dayDate.getDate()}
                      </div>
                      
                      <div className={isMobile ? "space-y-0.5" : "space-y-1"}>
                        {dayAppointments.length === 0 ? (
                          <div className={`text-center text-muted-foreground mt-4 ${isMobile ? 'text-[9px]' : 'text-xs'}`}>
                            אין פגישות
                          </div>
                        ) : (
                          dayAppointments.map(appointment => (
                            <div
                              key={appointment.id}
                              className={`rounded-md border border-white/20 shadow-sm hover:shadow-md hover:ring-1 hover:ring-primary cursor-pointer text-right bg-white animate-fade-in ${isMobile ? 'p-1 mb-0.5' : 'p-2'}`}
                              style={{
                                backgroundColor: appointment.color || '#E5DEFF',
                              }}
                              onClick={() => handleAppointmentClick(appointment)}
                            >
                              <div className={`font-medium truncate ${isMobile ? 'text-[9px]' : 'text-xs'}`}>{appointment.customer}</div>
                              <div className={`opacity-75 truncate ${isMobile ? 'text-[8px]' : 'text-xs'}`}>{appointment.service}</div>
                              <div className="flex items-center justify-between mt-0.5">
                                <div className={`flex items-center gap-1 opacity-80 ${isMobile ? 'text-[8px]' : 'text-xs'}`}>
                                  <Clock className={isMobile ? "h-2 w-2" : "h-3 w-3"} />
                                  <span>{appointment.startTime}</span>
                                </div>
                                {appointment.price && (
                                  <Badge variant="outline" className={`bg-white/70 ${isMobile ? 'text-[8px] px-1 py-0' : 'text-xs'}`}>
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
                  <div key={day} className={`text-center py-2 font-medium ${isMobile ? 'text-[10px]' : 'text-sm'}`}>
                    {isMobile ? day.substring(0, 4) : day}
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
                        className={`border text-muted-foreground ${isMobile ? 'min-h-[60px] p-1 bg-muted/5' : 'min-h-[100px] p-2 bg-muted/5'}`}
                      >
                        <div className={`text-right opacity-50 ${isMobile ? 'text-xs' : 'text-sm'}`}>{prevDate.getDate()}</div>
                      </div>
                    );
                  }
                  return prevMonthDays;
                })()}
                
                {viewDates.map((dayDate) => {
                  const isToday = isSameDay(dayDate, new Date());
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
                        "border min-h-[100px] hover:bg-muted/10 cursor-pointer",
                        isToday && "bg-muted/10",
                        !isSameMonth(dayDate, date) && "bg-muted/5 text-muted-foreground",
                        isMobile && "min-h-[60px] p-1"
                      )}
                      onClick={() => {
                        onDateChange(dayDate);
                        setView('day');
                      }}
                    >
                      <div className={cn(
                        "text-right font-medium rounded-full float-right mb-1 flex items-center justify-center",
                        isToday && "bg-primary text-primary-foreground",
                        isMobile ? "w-5 h-5 text-xs" : "w-6 h-6 text-sm"
                      )}>
                        {dayDate.getDate()}
                      </div>
                      
                      <div className="clear-both">
                        {dayAppointments.length > 0 ? (
                          <div className={isMobile ? "mt-0.5" : "mt-1"}>
                            {dayAppointments.length > (isMobile ? 1 : 2) ? (
                              <>
                                <div 
                                  className={`truncate text-right rounded-md border border-white/20 shadow-sm ${isMobile ? 'text-[8px] p-0.5 mb-0.5' : 'text-xs p-1 mb-1'}`}
                                  style={{ backgroundColor: dayAppointments[0].color || '#E5DEFF' }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAppointmentClick(dayAppointments[0]);
                                  }}
                                >
                                  <span className="font-medium">{dayAppointments[0].startTime}</span> {dayAppointments[0].customer}
                                </div>
                                <div className={`text-center ${isMobile ? 'text-[8px]' : 'text-xs'}`}>
                                  +{dayAppointments.length - 1} עוד
                                </div>
                              </>
                            ) : (
                              dayAppointments.map(app => (
                                <div 
                                  key={app.id}
                                  className={`rounded-md mb-1 truncate text-right border border-white/20 shadow-sm ${isMobile ? 'text-[8px] p-0.5' : 'text-xs p-1'}`}
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
          <DialogContent className={`text-right ${isMobile ? 'max-w-[320px]' : 'max-w-md'}`}>
            <DialogHeader>
              <DialogTitle className={isMobile ? "text-lg" : "text-xl"}>{selectedAppointment.customer}</DialogTitle>
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
                  <p className={`font-medium text-muted-foreground mb-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>תאריך</p>
                  <p className={isMobile ? 'text-sm' : ''}>{selectedAppointment.date ? format(selectedAppointment.date, 'dd/MM/yyyy') : 'לא צוין'}</p>
                </div>
                <div>
                  <p className={`font-medium text-muted-foreground mb-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>שעה</p>
                  <p className={isMobile ? 'text-sm' : ''}>{selectedAppointment.startTime}</p>
                </div>
                <div>
                  <p className={`font-medium text-muted-foreground mb-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>משך</p>
                  <p className={isMobile ? 'text-sm' : ''}>{selectedAppointment.duration} דקות</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between gap-2 mt-6">
              <Button variant="destructive" size={isMobile ? "sm" : "sm"} onClick={handleDeleteAppointment} className="gap-1">
                <Trash2 className={isMobile ? "h-3 w-3" : "h-4 w-4"} />
                {isMobile ? 'מחק' : 'מחק פגישה'}
              </Button>
              
              <div className="flex gap-2">
                <Button variant="outline" size={isMobile ? "sm" : "default"} onClick={() => setIsAppointmentDetailsOpen(false)}>
                  סגור
                </Button>
                <Button size={isMobile ? "sm" : "default"} onClick={handleEditAppointment}>
                  <Edit className={`${isMobile ? 'h-3 w-3 mr-1' : 'h-4 w-4 mr-2'}`} />
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
