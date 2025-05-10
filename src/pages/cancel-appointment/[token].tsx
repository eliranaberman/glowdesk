
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CheckCircle, XCircle } from 'lucide-react';

const CancelAppointment = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cancelAppointment = async () => {
      try {
        setIsLoading(true);
        // In a real app, here you would call an API to validate the token and cancel the appointment
        // For now, we'll simulate a successful cancellation after a short delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simulating success
        setIsSuccess(true);
      } catch (err) {
        console.error('Error canceling appointment:', err);
        setError('שגיאה בביטול הפגישה. אנא נסה שוב מאוחר יותר או צור קשר עם המספרה.');
        toast.error('שגיאה בביטול הפגישה');
      } finally {
        setIsLoading(false);
      }
    };

    cancelAppointment();
  }, [token]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">ביטול פגישה</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          {isLoading ? (
            <div className="text-center p-6">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p>מבטל את הפגישה...</p>
            </div>
          ) : isSuccess ? (
            <div className="text-center p-6">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">הפגישה בוטלה בהצלחה</h2>
              <p className="text-gray-600 mb-6">
                תודה שעדכנת אותנו. ניתן לקבוע פגישה חדשה בכל עת.
              </p>
              <Button onClick={() => navigate('/online-booking')} className="w-full">
                קביעת פגישה חדשה
              </Button>
            </div>
          ) : (
            <div className="text-center p-6">
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">שגיאה בביטול הפגישה</h2>
              <p className="text-red-600 mb-6">{error}</p>
              <Button onClick={() => navigate('/')} variant="outline" className="w-full">
                חזרה לדף הבית
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CancelAppointment;
