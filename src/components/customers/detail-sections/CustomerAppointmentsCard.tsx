
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface CustomerAppointmentsCardProps {
  customerId: string;
}

const CustomerAppointmentsCard = ({ customerId }: CustomerAppointmentsCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>היסטוריית פגישות</CardTitle>
        <CardDescription>
          הפגישות האחרונות של הלקוח
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-8 text-center">
          <p className="text-muted-foreground">פונקציונליות זו תהיה זמינה בקרוב</p>
          <Button 
            className="mt-4" 
            variant="outline"
            onClick={() => navigate('/scheduling/new', { state: { customerId } })}
          >
            קביעת פגישה חדשה
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerAppointmentsCard;
