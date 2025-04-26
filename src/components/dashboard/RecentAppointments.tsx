
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
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();

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
    <Card className={isMobile ? 'shadow-sm border-muted' : ''}>
      <CardHeader className={isMobile ? 'pb-2 px-3 pt-3' : ''}>
        <CardTitle className={isMobile ? 'text-lg' : ''}>פגישות אחרונות</CardTitle>
        <CardDescription className={isMobile ? 'text-xs' : ''}>הפגישות האחרונות של הלקוחות שלך</CardDescription>
      </CardHeader>
      <CardContent className={isMobile ? 'px-3' : ''}>
        <div className="space-y-2">
          {appointments.length > 0 ? (
            appointments.map((appointment) => (
              <div 
                key={appointment.id} 
                className={`flex items-center justify-between py-2 border-b last:border-0 ${isMobile ? 'text-sm' : ''}`}
              >
                <div className="truncate pr-2">
                  <h4 className={`font-medium ${isMobile ? 'text-sm' : ''}`}>{appointment.customer}</h4>
                  <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>{appointment.service}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="flex items-center gap-2 justify-end">
                    <span className={isMobile ? 'text-xs' : 'text-sm'}>{appointment.time}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusClass(appointment.status)} ${isMobile ? 'text-[10px] px-1.5 py-0.5' : ''}`}>
                      {getStatusText(appointment.status)}
                    </span>
                  </div>
                  <p className={`font-semibold mt-0.5 ${isMobile ? 'text-xs' : 'text-sm'}`}>₪{appointment.price}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-4">אין פגישות אחרונות</p>
          )}
        </div>
      </CardContent>
      <CardFooter className={`border-t bg-muted/50 ${isMobile ? 'px-3 py-2' : 'px-6 py-4'}`}>
        <Link to="/scheduling" className="w-full">
          <Button variant="ghost" className="w-full">
            צפה בכל הפגישות
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default RecentAppointments;
