
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const CancelAppointment = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [appointmentInfo, setAppointmentInfo] = useState<{
    id: string;
    date: string;
    time: string;
    service: string;
  } | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  // Fetch appointment info by token
  useEffect(() => {
    const fetchAppointmentByToken = async () => {
      try {
        setLoading(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock response
        if (token && token.length > 5) {
          setAppointmentInfo({
            id: 'apt-' + token.substring(0, 5),
            date: new Date().toLocaleDateString('he-IL'),
            time: '14:00',
            service: 'מניקור ג׳ל'
          });
        } else {
          setError('הקישור לביטול הפגישה אינו תקין או שפג תוקפו.');
        }
      } catch (error) {
        console.error('Error fetching appointment:', error);
        setError('אירעה שגיאה בטעינת פרטי הפגישה. אנא נסה שוב מאוחר יותר.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAppointmentByToken();
  }, [token]);

  // Handle cancel appointment
  const handleCancelAppointment = async () => {
    try {
      setCancelling(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setCancelled(true);
      toast.success('הפגישה בוטלה בהצלחה');
      
      // In a real app, you would call an API to cancel the appointment
      
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error('אירעה שגיאה בביטול הפגישה. אנא נסה שוב מאוחר יותר.');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4" dir="rtl">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>טוען פרטי פגישה...</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4" dir="rtl">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <XCircle className="h-12 w-12 text-destructive mx-auto mb-2" />
            <CardTitle>קישור לא תקין</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">{error}</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => window.location.href = '/'} variant="outline">
              חזרה לדף הבית
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (cancelled) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4" dir="rtl">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
            <CardTitle>הפגישה בוטלה בהצלחה</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              הפגישה שלך בתאריך {appointmentInfo?.date} בשעה {appointmentInfo?.time} בוטלה.
              תוכל לקבוע פגישה חדשה בכל עת.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => window.location.href = '/'} variant="outline">
              חזרה לדף הבית
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4" dir="rtl">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">האם ברצונך לבטל את הפגישה?</CardTitle>
          <CardDescription className="text-center">
            אתה עומד לבטל את הפגישה הבאה:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-center">
            <p>
              <span className="font-medium">תאריך:</span> {appointmentInfo?.date}
            </p>
            <p>
              <span className="font-medium">שעה:</span> {appointmentInfo?.time}
            </p>
            <p>
              <span className="font-medium">שירות:</span> {appointmentInfo?.service}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button 
            onClick={handleCancelAppointment} 
            variant="destructive" 
            className="w-full" 
            disabled={cancelling}
          >
            {cancelling && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {cancelling ? 'מבטל פגישה...' : 'כן, בטל את הפגישה'}
          </Button>
          <Button 
            onClick={() => window.location.href = '/'} 
            variant="outline" 
            className="w-full"
            disabled={cancelling}
          >
            לא, שמור את הפגישה
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CancelAppointment;
