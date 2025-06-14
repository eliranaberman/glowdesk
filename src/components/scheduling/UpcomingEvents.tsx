
import { useQuery } from '@tanstack/react-query';
import { getAppointments, Appointment } from '@/services/appointmentService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { BellRing, FilePlus2, Loader2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { format, parse } from 'date-fns';

const UpcomingEvents = () => {
  const isSunday = new Date().getDay() === 0;

  const today = new Date();
  const { data: appointments, isLoading, isError, error } = useQuery({
    queryKey: ['appointments', 'today'],
    queryFn: () => getAppointments({
      date_from: today,
      date_to: today,
      status: 'scheduled'
    })
  });

  const upcomingAppointments = appointments
    ?.map(app => {
        const startTime = parse(`${app.date} ${app.start_time}`, 'yyyy-MM-dd HH:mm', new Date());
        return { ...app, startTime };
    })
    .filter(app => app.startTime > new Date())
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

  if (isLoading) {
    return (
      <Card>
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
      </Card>
    );
  }
  
  if (isError) {
     return (
        <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>שגיאה</AlertTitle>
            <AlertDescription>
                לא ניתן היה לטעון התראות: {(error as Error).message}
            </AlertDescription>
        </Alert>
     )
  }

  const hasUpcomingAppointments = upcomingAppointments && upcomingAppointments.length > 0;
  
  if (!isSunday && !hasUpcomingAppointments) {
    return null; // Don't render anything if there are no notifications
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BellRing className="h-5 w-5" />
          התראות ועדכונים
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isSunday && (
          <Alert>
            <FilePlus2 className="h-4 w-4" />
            <AlertTitle>תזכורת שבועית</AlertTitle>
            <AlertDescription className="flex justify-between items-center flex-wrap gap-2">
              <span>אל תשכחי להזין את ההוצאות מהשבוע האחרון.</span>
              <Button asChild variant="outline" size="sm">
                <Link to="/expenses">להזנת הוצאות</Link>
              </Button>
            </AlertDescription>
          </Alert>
        )}
        {hasUpcomingAppointments ? (
          upcomingAppointments.map((app: Appointment & { startTime: Date }) => (
            <Alert key={app.id} variant="default">
              <BellRing className="h-4 w-4" />
              <AlertTitle>פגישה קרובה</AlertTitle>
              <AlertDescription>
                תור עם <strong>{app.customer?.full_name || 'לקוח'}</strong> ({app.service_type}) בשעה {format(app.startTime, 'HH:mm')}.
              </AlertDescription>
            </Alert>
          ))
        ) : (
          !isSunday && <p className="text-sm text-muted-foreground text-center py-2">אין התראות חדשות להיום.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingEvents;
