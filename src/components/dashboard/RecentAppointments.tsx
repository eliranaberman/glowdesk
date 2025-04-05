
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Link } from 'react-router-dom';

interface Appointment {
  id: string;
  customer: string;
  service: string;
  time: string;
  price: number;
  status: 'completed' | 'upcoming' | 'cancelled';
}

interface RecentAppointmentsProps {
  appointments: Appointment[];
}

const RecentAppointments = ({ appointments }: RecentAppointmentsProps) => {
  const getStatusClass = (status: Appointment['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Appointment['status']) => {
    switch (status) {
      case 'completed':
        return 'הושלם';
      case 'upcoming':
        return 'מתוכנן';
      case 'cancelled':
        return 'בוטל';
      default:
        return status;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>פגישות אחרונות</CardTitle>
        <CardDescription>הפגישות האחרונות של הלקוחות שלך</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.length > 0 ? (
            appointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between py-3 border-b last:border-0">
                <div>
                  <h4 className="font-medium">{appointment.customer}</h4>
                  <p className="text-sm text-muted-foreground">{appointment.service}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{appointment.time}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusClass(appointment.status)}`}>
                      {getStatusText(appointment.status)}
                    </span>
                  </div>
                  <p className="text-sm font-semibold mt-1">₪{appointment.price}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-4">אין פגישות אחרונות</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/50 px-6 py-4">
        <Link to="/scheduling">
          <Button variant="ghost" className="w-full">
            צפה בכל הפגישות
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default RecentAppointments;
