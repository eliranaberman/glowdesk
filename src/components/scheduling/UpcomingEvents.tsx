import { useQuery } from '@tanstack/react-query';
import { getAppointments, Appointment } from '@/services/appointmentService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BellRing, FilePlus2, Loader2, AlertCircle, Clock, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { format, parse, differenceInHours, differenceInMinutes } from 'date-fns';
const UpcomingEvents = () => {
  const isSunday = new Date().getDay() === 0;
  const now = new Date();
  const today = new Date();
  const {
    data: appointments,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['appointments', 'today'],
    queryFn: () => getAppointments({
      date_from: today,
      date_to: today,
      status: 'scheduled'
    })
  });
  const upcomingAppointments = appointments?.map(app => {
    const startTime = parse(`${app.date} ${app.start_time}`, 'yyyy-MM-dd HH:mm', new Date());
    return {
      ...app,
      startTime
    };
  }).filter(app => app.startTime > now).sort((a, b) => a.startTime.getTime() - b.startTime.getTime()).slice(0, 3); // Show only next 3 appointments

  const getTimeUntilAppointment = (appointmentTime: Date) => {
    const hoursUntil = differenceInHours(appointmentTime, now);
    const minutesUntil = differenceInMinutes(appointmentTime, now);
    if (hoursUntil >= 24) {
      return `מחר`;
    } else if (hoursUntil >= 1) {
      return `בעוד ${hoursUntil} שעות`;
    } else if (minutesUntil > 0) {
      return `בעוד ${minutesUntil} דקות`;
    } else {
      return 'עכשיו';
    }
  };
  const getUrgencyVariant = (appointmentTime: Date) => {
    const minutesUntil = differenceInMinutes(appointmentTime, now);
    if (minutesUntil <= 30) return 'destructive';
    return 'default';
  };
  if (isLoading) {
    return <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellRing className="h-5 w-5" />
            התראות ועדכונים
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-2 py-4 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>טוען עדכונים...</span>
          </div>
        </CardContent>
      </Card>;
  }
  if (isError) {
    return;
  }
  const hasUpcomingAppointments = upcomingAppointments && upcomingAppointments.length > 0;
  if (!isSunday && !hasUpcomingAppointments) {
    return null;
  }
  return <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BellRing className="h-5 w-5" />
          התראות ועדכונים
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isSunday && <Alert>
            <FilePlus2 className="h-4 w-4" />
            <AlertTitle>תזכורת שבועית</AlertTitle>
            <AlertDescription className="flex justify-between items-center flex-wrap gap-2">
              <span>אל תשכחי להזין את ההוצאות מהשבוע האחרון.</span>
              <Button asChild variant="outline" size="sm">
                <Link to="/expenses">להזנת הוצאות</Link>
              </Button>
            </AlertDescription>
          </Alert>}
        
        {hasUpcomingAppointments && <>
            {upcomingAppointments.map((app: Appointment & {
          startTime: Date;
        }) => {
          const timeUntil = getTimeUntilAppointment(app.startTime);
          const urgency = getUrgencyVariant(app.startTime);
          return <Alert key={app.id} variant={urgency}>
                  <Clock className="h-4 w-4" />
                  <AlertTitle className="flex items-center justify-between">
                    <span>פגישה קרובה</span>
                    <span className="text-sm font-normal">{timeUntil}</span>
                  </AlertTitle>
                  <AlertDescription>
                    <div className="flex items-center gap-2 mt-1">
                      <User className="h-3 w-3" />
                      <span><strong>{app.client?.full_name || 'לקוח'}</strong></span>
                    </div>
                    <div className="mt-1 text-sm">
                      {app.service_type} • {format(app.startTime, 'HH:mm')}
                    </div>
                  </AlertDescription>
                </Alert>;
        })}
            
            {appointments && appointments.length > 3 && <div className="text-center">
                <Button asChild variant="outline" size="sm">
                  <Link to="/scheduling">צפה בכל הפגישות</Link>
                </Button>
              </div>}
          </>}
        
        {!hasUpcomingAppointments && !isSunday && <p className="text-sm text-muted-foreground text-center py-2">
            אין פגישות קרובות להיום.
          </p>}
      </CardContent>
    </Card>;
};
export default UpcomingEvents;