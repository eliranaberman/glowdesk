
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Appointment {
  id: string;
  customer: string;
  service: string;
  startTime: string; // Format: '09:00'
  duration: number; // Duration in minutes
  color?: string;
}

interface GanttChartProps {
  appointments: Appointment[];
  date: Date;
  onDateChange: (date: Date) => void;
}

const HOURS = Array.from({ length: 11 }, (_, i) => i + 8); // 8 AM to 6 PM
const CELL_HEIGHT = 60; // Height of appointment cell in pixels

const GanttChart = ({ appointments, date, onDateChange }: GanttChartProps) => {
  const [view, setView] = useState<'day' | 'week'>('day');
  
  // Helper function to calculate position and height based on time
  const getAppointmentStyle = (startTime: string, duration: number) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const startHour = hours + minutes / 60;
    const startPosition = (startHour - 8) * CELL_HEIGHT; // 8 AM is the start time
    const height = (duration / 60) * CELL_HEIGHT;
    
    return {
      top: `${startPosition}px`,
      height: `${height}px`,
    };
  };
  
  // Format the date nicely
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);

  // Navigation functions
  const nextDay = () => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + 1);
    onDateChange(newDate);
  };

  const prevDay = () => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() - 1);
    onDateChange(newDate);
  };

  const today = () => {
    onDateChange(new Date());
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Appointments</CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className={cn(
              view === 'day' && 'bg-primary text-primary-foreground hover:bg-primary/90'
            )}
            onClick={() => setView('day')}
          >
            Day
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              view === 'week' && 'bg-primary text-primary-foreground hover:bg-primary/90'
            )}
            onClick={() => setView('week')}
          >
            Week
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4 mt-2">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={prevDay}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span>{formattedDate}</span>
            </div>
            <Button variant="outline" size="icon" onClick={nextDay}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline" size="sm" onClick={today}>
            Today
          </Button>
        </div>

        <div className="border rounded-lg mt-4 overflow-hidden">
          <div className="gantt-container relative overflow-x-auto">
            <div className="gantt-timeline grid grid-cols-1 border-b">
              <div className="hours-header flex border-b">
                {HOURS.map((hour) => (
                  <div key={hour} className="hour-cell flex-1 text-center py-2 text-xs font-medium">
                    {hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
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
                      className="absolute border-l h-full"
                      style={{left: `${(hour - 8) * (100 / 10)}%`}}
                    ></div>
                  ))}
                </div>

                {/* Appointments */}
                {appointments.map((appointment) => {
                  const style = getAppointmentStyle(appointment.startTime, appointment.duration);
                  
                  return (
                    <div
                      key={appointment.id}
                      className="absolute left-0 right-0 mx-1 rounded-md p-2 transition-all hover:ring-2 hover:ring-primary cursor-pointer"
                      style={{
                        ...style,
                        backgroundColor: appointment.color || 'var(--nail-200)',
                      }}
                    >
                      <p className="font-medium text-sm truncate">{appointment.customer}</p>
                      <p className="text-xs truncate">{appointment.service}</p>
                      <p className="text-xs opacity-70">{appointment.startTime} ({appointment.duration} min)</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GanttChart;
