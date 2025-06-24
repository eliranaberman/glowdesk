
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
        className="absolute rounded-xl border-0 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer animate-fade-in backdrop-blur-sm"
        style={{
          backgroundColor: appointment.color || '#FEF7CD',
          left: `${left}%`,
          width: `${width}%`,
          top: `${top}%`,
          height: `${cardHeight}%`,
          minHeight: isMobile ? '35px' : '45px',
          minWidth: isMobile ? '80px' : '110px',
          zIndex: appointment.verticalPosition || 1
        }}
        onClick={() => handleAppointmentClick(appointment)}
      >
        <div className={`${isMobile ? 'p-1.5' : 'p-2'} h-full flex flex-col overflow-hidden`}>
          <div className="flex-1">
            <p className={`font-semibold truncate text-gray-800 ${isMobile ? 'text-[10px]' : 'text-xs'}`}>{appointment.customer}</p>
            <p className={`truncate text-gray-600 ${isMobile ? 'text-[8px]' : 'text-[10px]'}`}>{appointment.service}</p>
          </div>
          <div className="flex items-center justify-between mt-auto">
            <div className={`flex items-center opacity-80 gap-1 text-gray-700 ${isMobile ? 'text-[8px]' : 'text-[10px]'}`}>
              <Clock className={isMobile ? 'h-2 w-2' : 'h-2.5 w-2.5'} />
              <span>{formatAppointmentTime(appointment.startTime)}</span>
            </div>
            {appointment.price && (
              <Badge variant="outline" className={`bg-white/80 font-medium px-1.5 py-0.5 border-0 shadow-sm ${isMobile ? 'text-[8px]' : 'text-[9px]'}`}>
                {appointment.price}
              </Badge>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderTimeGrid = () => (
    <div className="hours-header flex border-b bg-gradient-to-r from-pink-50/30 to-purple-50/30 backdrop-blur-sm sticky top-0 z-10">
      {HOURS.map((hour) => (
        <div 
          key={hour} 
          className={`hour-cell text-center py-3 font-medium text-gray-700 ${isMobile ? 'text-[10px]' : 'text-sm'}`}
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
    <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-pink-50/20 overflow-hidden">
      <CardHeader className={`flex flex-row items-center justify-between pb-4 bg-gradient-to-r from-pink-50/50 to-purple-50/50 backdrop-blur-sm ${isMobile ? 'px-4 py-3' : 'px-6 py-4'}`} dir="rtl">
        <CardTitle className={`font-bold text-gray-800 ${isMobile ? 'text-lg' : 'text-2xl'}`}>📅 לוח פגישות</CardTitle>
        <div className="flex items-center gap-3">
          <div className="flex rounded-xl overflow-hidden border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <Button
              variant={view === 'day' ? 'default' : 'ghost'}
              size={isMobile ? "sm" : "sm"}
              className={cn(
                "rounded-none border-0 transition-all duration-300 font-medium",
                view === 'day' 
                  ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-md hover:from-pink-500 hover:to-purple-500' 
                  : 'text-gray-600 hover:bg-pink-50/50 hover:text-pink-600',
                isMobile && 'px-3 text-xs h-9'
              )}
              onClick={() => setView('day')}
            >
              יום
            </Button>
            <Button
              variant={view === 'week' ? 'default' : 'ghost'}
              size={isMobile ? "sm" : "sm"}
              className={cn(
                "rounded-none border-0 transition-all duration-300 font-medium",
                view === 'week' 
                  ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-md hover:from-pink-500 hover:to-purple-500' 
                  : 'text-gray-600 hover:bg-pink-50/50 hover:text-pink-600',
                isMobile && 'px-3 text-xs h-9'
              )}
              onClick={() => setView('week')}
            >
              שבוע
            </Button>
            <Button
              variant={view === 'month' ? 'default' : 'ghost'}
              size={isMobile ? "sm" : "sm"}
              className={cn(
                "rounded-none border-0 transition-all duration-300 font-medium",
                view === 'month' 
                  ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-md hover:from-pink-500 hover:to-purple-500' 
                  : 'text-gray-600 hover:bg-pink-50/50 hover:text-pink-600',
                isMobile && 'px-3 text-xs h-9'
              )}
              onClick={() => setView('month')}
            >
              חודש
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className={`flex items-center justify-between border-b bg-gradient-to-r from-pink-50/30 to-purple-50/30 backdrop-blur-sm ${isMobile ? 'p-3' : 'p-5'}`} dir="rtl">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={prevPeriod} className={cn(
              "border-0 shadow-md bg-white/80 backdrop-blur-sm hover:bg-pink-50 hover:scale-105 transition-all duration-300",
              isMobile ? "h-8 w-8" : "h-9 w-9"
            )}>
              <ChevronRight className={isMobile ? "h-3 w-3" : "h-4 w-4"} />
            </Button>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn(
                  "flex items-center gap-2 border-0 shadow-md bg-white/80 backdrop-blur-sm hover:bg-pink-50 hover:scale-105 transition-all duration-300",
                  isMobile ? 'px-2 py-1.5 h-8 text-xs' : 'px-4 py-2'
                )}>
                  <CalendarIcon className={isMobile ? "h-3 w-3" : "h-4 w-4"} />
                  <span className={`font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>{getViewTitle()}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border-0 shadow-xl" align="center">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => newDate && onDateChange(newDate)}
                  className="pointer-events-auto bg-white/95 backdrop-blur-md rounded-xl"
                />
              </PopoverContent>
            </Popover>
            
            <Button variant="outline" size="icon" onClick={nextPeriod} className={cn(
              "border-0 shadow-md bg-white/80 backdrop-blur-sm hover:bg-pink-50 hover:scale-105 transition-all duration-300",
              isMobile ? "h-8 w-8" : "h-9 w-9"
            )}>
              <ChevronLeft className={isMobile ? "h-3 w-3" : "h-4 w-4"} />
            </Button>
          </div>
          
          <Button variant="outline" size={isMobile ? "sm" : "sm"} onClick={goToToday} className={cn(
            "border-0 shadow-md bg-white/80 backdrop-blur-sm hover:bg-pink-50 hover:scale-105 transition-all duration-300 font-medium",
            isMobile ? 'text-[10px] px-3 h-8' : 'text-sm px-4'
          )}>
            🏠 היום
          </Button>
        </div>

        <div className="border-t rounded-b-xl overflow-hidden bg-gradient-to-br from-white to-pink-50/10">
          {view === 'day' ? (
            <div className="gantt-container relative overflow-x-auto min-h-[600px] bg-gradient-to-br from-white to-pink-50/20">
              {renderTimeGrid()}
              <div className={`relative ${isMobile ? 'h-[450px]' : 'h-[600px]'} p-3`}>
                {HOURS.map((hour, index) => (
                  <div 
                    key={`hour-${hour}`}
                    className="absolute border-r border-pink-100/50 h-full"
                    style={{ 
                      left: `${(index / HOURS.length) * 100}%`,
                      top: 0
                    }}
                  />
                ))}
                
                {isCurrentTimeVisible && (
                  <div 
                    className="absolute w-full h-0.5 bg-gradient-to-r from-red-400 to-pink-400 shadow-lg z-20 animate-pulse"
                    style={{ left: `${currentTimePos}%`, top: '50%' }}
                  />
                )}
                
                {processedAppointments.length === 0 ? (
                  <div className={`flex justify-center items-center h-full text-gray-500 ${isMobile ? 'text-sm' : 'text-lg'}`}>
                    <div className="text-center space-y-2">
                      <div className="text-4xl">🌸</div>
                      <div>אין פגישות להיום</div>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full h-full">
                    {processedAppointments.map(appointment => renderAppointment(appointment, 100 / HOURS.length))}
                  </div>
                )}
              </div>
            </div>
          ) : view === 'week' ? (
            <div className="week-view bg-gradient-to-br from-white to-pink-50/10">
              <div className="grid grid-cols-7 bg-gradient-to-r from-pink-50/30 to-purple-50/30 border-b">
                {DAYS_OF_WEEK.map((day, index) => (
                  <div key={day} className={`text-center py-3 font-medium border-l last:border-l-0 text-gray-700 ${isMobile ? 'text-[10px]' : 'text-sm'}`}>
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
                        "min-h-full border-l last:border-l-0 transition-all duration-300",
                        isToday && "bg-gradient-to-b from-pink-50/50 to-purple-50/30",
                        isMobile ? "p-1.5" : "p-3"
                      )}
                    >
                      <div 
                        className={cn(
                          "text-center mb-2 rounded-full flex items-center justify-center mx-auto cursor-pointer transition-all duration-300 hover:scale-110 font-medium",
                          isToday 
                            ? "bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-lg" 
                            : "hover:bg-pink-100",
                          isMobile ? "w-6 h-6 text-xs" : "w-8 h-8 text-sm"
                        )}
                        onClick={() => {
                          onDateChange(dayDate);
                          setView('day');
                        }}
                      >
                        {dayDate.getDate()}
                      </div>
                      
                      <div className={isMobile ? "space-y-1" : "space-y-1.5"}>
                        {dayAppointments.length === 0 ? (
                          <div className={`text-center text-gray-400 mt-4 ${isMobile ? 'text-[9px]' : 'text-xs'}`}>
                            אין פגישות
                          </div>
                        ) : (
                          dayAppointments.map(appointment => (
                            <div
                              key={appointment.id}
                              className={`rounded-xl border-0 shadow-md hover:shadow-lg hover:scale-105 cursor-pointer text-right bg-white/90 backdrop-blur-sm animate-fade-in transition-all duration-300 ${isMobile ? 'p-1.5 mb-1' : 'p-2.5'}`}
                              style={{
                                backgroundColor: appointment.color || '#FEF7CD',
                              }}
                              onClick={() => handleAppointmentClick(appointment)}
                            >
                              <div className={`font-semibold truncate text-gray-800 ${isMobile ? 'text-[9px]' : 'text-xs'}`}>{appointment.customer}</div>
                              <div className={`opacity-75 truncate text-gray-600 ${isMobile ? 'text-[8px]' : 'text-xs'}`}>{appointment.service}</div>
                              <div className="flex items-center justify-between mt-1">
                                <div className={`flex items-center gap-1 opacity-80 text-gray-600 ${isMobile ? 'text-[8px]' : 'text-xs'}`}>
                                  <Clock className={isMobile ? "h-2 w-2" : "h-3 w-3"} />
                                  <span>{appointment.startTime}</span>
                                </div>
                                {appointment.price && (
                                  <Badge variant="outline" className={`bg-white/80 border-0 shadow-sm ${isMobile ? 'text-[8px] px-1 py-0' : 'text-xs'}`}>
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
            <div className="month-view bg-gradient-to-br from-white to-pink-50/10">
              <div className="grid grid-cols-7 bg-gradient-to-r from-pink-50/30 to-purple-50/30 border-b">
                {DAYS_OF_WEEK.map((day) => (
                  <div key={day} className={`text-center py-3 font-medium text-gray-700 ${isMobile ? 'text-[10px]' : 'text-sm'}`}>
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
                        className={`border text-muted-foreground ${isMobile ? 'min-h-[60px] p-1 bg-gray-50/30' : 'min-h-[100px] p-2 bg-gray-50/50'}`}
                      >
                        <div className={`text-right opacity-40 ${isMobile ? 'text-xs' : 'text-sm'}`}>{prevDate.getDate()}</div>
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
                        "border min-h-[100px] hover:bg-pink-50/30 cursor-pointer transition-all duration-300",
                        isToday && "bg-gradient-to-b from-pink-50/50 to-purple-50/30",
                        !isSameMonth(dayDate, date) && "bg-gray-50/30 text-muted-foreground",
                        isMobile && "min-h-[60px] p-1"
                      )}
                      onClick={() => {
                        onDateChange(dayDate);
                        setView('day');
                      }}
                    >
                      <div className={cn(
                        "text-right font-medium rounded-full float-right mb-1 flex items-center justify-center transition-all duration-300 hover:scale-110",
                        isToday 
                          ? "bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-lg" 
                          : "hover:bg-pink-100",
                        isMobile ? "w-5 h-5 text-xs" : "w-7 h-7 text-sm"
                      )}>
                        {dayDate.getDate()}
                      </div>
                      
                      <div className="clear-both">
                        {dayAppointments.length > 0 ? (
                          <div className={isMobile ? "mt-1" : "mt-2"}>
                            {dayAppointments.length > (isMobile ? 1 : 2) ? (
                              <>
                                <div 
                                  className={`truncate text-right rounded-lg border-0 shadow-sm hover:shadow-md transition-all duration-300 ${isMobile ? 'text-[8px] p-1 mb-1' : 'text-xs p-1.5 mb-1.5'}`}
                                  style={{ backgroundColor: dayAppointments[0].color || '#FEF7CD' }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAppointmentClick(dayAppointments[0]);
                                  }}
                                >
                                  <span className="font-medium">{dayAppointments[0].startTime}</span> {dayAppointments[0].customer}
                                </div>
                                <div className={`text-center font-medium text-pink-600 ${isMobile ? 'text-[8px]' : 'text-xs'}`}>
                                  +{dayAppointments.length - 1} עוד
                                </div>
                              </>
                            ) : (
                              dayAppointments.map(app => (
                                <div 
                                  key={app.id}
                                  className={`rounded-lg mb-1 truncate text-right border-0 shadow-sm hover:shadow-md transition-all duration-300 ${isMobile ? 'text-[8px] p-1' : 'text-xs p-1.5'}`}
                                  style={{ backgroundColor: app.color || '#FEF7CD' }}
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
          <DialogContent className={`text-right border-0 shadow-2xl bg-gradient-to-br from-white to-pink-50/30 backdrop-blur-md ${isMobile ? 'max-w-[320px]' : 'max-w-md'}`}>
            <DialogHeader>
              <DialogTitle className={`text-gray-800 ${isMobile ? "text-lg" : "text-xl"}`}>💅 {selectedAppointment.customer}</DialogTitle>
              <DialogDescription className="text-gray-600">
                פרטי פגישה מלאים
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 mt-4">
              <div className="flex items-center gap-2 justify-end">
                <Badge variant="outline" className="bg-white/80 border-0 shadow-sm">
                  {selectedAppointment.service}
                </Badge>
                {selectedAppointment.price && (
                  <Badge variant="secondary" className="bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 border-0">
                    {selectedAppointment.price}
                  </Badge>
                )}
              </div>
              
              <Separator className="bg-gradient-to-r from-pink-200 to-purple-200" />
              
              <div className="grid grid-cols-2 gap-4 text-right">
                <div className="bg-white/60 rounded-lg p-3">
                  <p className={`font-medium text-gray-600 mb-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>📅 תאריך</p>
                  <p className={`text-gray-800 font-semibold ${isMobile ? 'text-sm' : ''}`}>{selectedAppointment.date ? format(selectedAppointment.date, 'dd/MM/yyyy') : 'לא צוין'}</p>
                </div>
                <div className="bg-white/60 rounded-lg p-3">
                  <p className={`font-medium text-gray-600 mb-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>🕐 שעה</p>
                  <p className={`text-gray-800 font-semibold ${isMobile ? 'text-sm' : ''}`}>{selectedAppointment.startTime}</p>
                </div>
                <div className="bg-white/60 rounded-lg p-3 col-span-2">
                  <p className={`font-medium text-gray-600 mb-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>⏱️ משך זמן</p>
                  <p className={`text-gray-800 font-semibold ${isMobile ? 'text-sm' : ''}`}>{selectedAppointment.duration} דקות</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between gap-3 mt-6">
              <Button 
                variant="destructive" 
                size={isMobile ? "sm" : "sm"} 
                onClick={handleDeleteAppointment} 
                className="gap-1.5 shadow-md hover:shadow-lg transition-all duration-300"
              >
                <Trash2 className={isMobile ? "h-3 w-3" : "h-4 w-4"} />
                {isMobile ? 'מחק' : 'מחק פגישה'}
              </Button>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size={isMobile ? "sm" : "default"} 
                  onClick={() => setIsAppointmentDetailsOpen(false)}
                  className="border-0 shadow-md hover:shadow-lg bg-white/80 hover:bg-pink-50 transition-all duration-300"
                >
                  סגור
                </Button>
                <Button 
                  size={isMobile ? "sm" : "default"} 
                  onClick={handleEditAppointment}
                  className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 shadow-md hover:shadow-lg transition-all duration-300"
                >
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
