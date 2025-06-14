
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { TrendingUp, Calendar, DollarSign, Receipt, CheckCircle } from 'lucide-react';
import { getAppointments } from '@/services/appointmentService';
import { format, startOfDay, endOfDay } from 'date-fns';

const DailySummaryNotification = () => {
  const today = new Date();
  const startOfToday = startOfDay(today);
  const endOfToday = endOfDay(today);

  const { data: todaysAppointments, isLoading } = useQuery({
    queryKey: ['appointments', 'today-summary'],
    queryFn: () => getAppointments({
      date_from: startOfToday,
      date_to: endOfToday,
      status: 'completed'
    })
  });

  const completedAppointments = todaysAppointments?.filter(app => app.status === 'completed') || [];
  const totalRevenue = completedAppointments.length * 150; // Mock calculation
  const totalClients = completedAppointments.length;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            סיכום יומי
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Only show if there are completed appointments today
  if (completedAppointments.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          סיכום יומי - {format(today, 'dd/MM/yyyy')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>יום עבודה מוצלח!</AlertTitle>
          <AlertDescription>
            סיימת את היום עם {totalClients} לקוחות ורווח של ₪{totalRevenue}
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-blue-700">
              <Calendar className="h-4 w-4" />
              <span className="text-sm font-medium">פגישות היום</span>
            </div>
            <p className="text-xl font-bold text-blue-900">{totalClients}</p>
          </div>

          <div className="bg-green-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-green-700">
              <DollarSign className="h-4 w-4" />
              <span className="text-sm font-medium">הכנסות היום</span>
            </div>
            <p className="text-xl font-bold text-green-900">₪{totalRevenue}</p>
          </div>
        </div>

        {completedAppointments.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">לקוחות שטופלו היום:</h4>
            <div className="space-y-1">
              {completedAppointments.slice(0, 3).map((appointment, index) => (
                <div key={appointment.id} className="text-sm text-muted-foreground">
                  • {appointment.customer?.full_name || 'לקוח'} - {appointment.service_type}
                </div>
              ))}
              {completedAppointments.length > 3 && (
                <div className="text-sm text-muted-foreground">
                  ועוד {completedAppointments.length - 3} לקוחות...
                </div>
              )}
            </div>
          </div>
        )}

        <Alert className="bg-orange-50 border-orange-200">
          <Receipt className="h-4 w-4" />
          <AlertDescription className="text-orange-700">
            זכרי להזין את ההוצאות מהיום בעמוד ההוצאות
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default DailySummaryNotification;
