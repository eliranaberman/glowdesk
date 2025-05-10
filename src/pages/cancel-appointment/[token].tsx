import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useIsMobile } from '@/hooks/use-mobile';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { CancellationToken } from '@/types/cancellation';

interface AppointmentDetails {
  id: string;
  service_type: string;
  date: string;
  start_time: string;
  status: string;
  customer: {
    full_name: string;
  };
}

const CancelAppointmentPage = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLateCancellation, setIsLateCancellation] = useState(false);
  const [appointment, setAppointment] = useState<AppointmentDetails | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelReasonText, setCancelReasonText] = useState('');
  
  // Cancellation reasons
  const reasons = [
    { value: 'schedule_conflict', label: 'התנגשות בלוח הזמנים' },
    { value: 'feeling_unwell', label: 'לא מרגיש/ה טוב' },
    { value: 'emergency', label: 'מקרה חירום' },
    { value: 'transportation_issue', label: 'בעיית תחבורה' },
    { value: 'other', label: 'סיבה אחרת' },
  ];

  useEffect(() => {
    if (!token) {
      setError('קישור ביטול לא תקין');
      setLoading(false);
      return;
    }
    
    const fetchAppointmentDetails = async () => {
      try {
        // Use the edge function to validate the token and get appointment details
        // This avoids the need to directly query tables that might not be in the type system yet
        const { data, error } = await supabase.functions.invoke('appointment-cancellation', {
          body: { 
            token,
            action: 'validate'
          }
        });
        
        if (error || !data || data.error) {
          setError(data?.message || 'קישור ביטול לא תקין או פג תוקף');
          setLoading(false);
          return;
        }
        
        if (data.isExpired) {
          setError('קישור הביטול פג תוקף');
          setLoading(false);
          return;
        }
        
        if (data.isUsed) {
          setError('קישור הביטול כבר נוצל');
          setLoading(false);
          return;
        }
        
        if (data.isCancelled) {
          setError('הפגישה כבר בוטלה');
          setLoading(false);
          return;
        }
        
        // Set appointment data from the response
        setAppointment({
          id: data.appointment.id,
          service_type: data.appointment.service_type,
          date: data.appointment.date,
          start_time: data.appointment.start_time,
          status: data.appointment.status,
          customer: {
            full_name: data.appointment.customer_name
          }
        });
        
        setIsLateCancellation(data.isLateCancellation);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching appointment details:', err);
        setError('התרחשה שגיאה בעת טעינת פרטי הפגישה');
        setLoading(false);
      }
    };
    
    fetchAppointmentDetails();
  }, [token]);
  
  const handleCancellation = async () => {
    if (!token || !appointment) return;
    
    try {
      setCancelling(true);
      
      // Prepare reason text
      let finalReason = cancelReason;
      if (cancelReason === 'other' && cancelReasonText) {
        finalReason = cancelReasonText;
      }
      
      // Call the cancellation function
      const { data, error } = await supabase.functions.invoke('appointment-cancellation', {
        body: { 
          token, 
          reason: finalReason,
          action: 'cancel'
        }
      });
      
      if (error || !data || data.error) {
        toast.error('התרחשה שגיאה בעת ביטול הפגישה');
        console.error('Error cancelling appointment:', error || data?.error);
        setCancelling(false);
        return;
      }
      
      setSuccess(true);
      setIsLateCancellation(data.isLateCancellation);
      
      // Redirect after a delay
      setTimeout(() => {
        navigate('/');
      }, 5000);
    } catch (err) {
      console.error('Error cancelling appointment:', err);
      toast.error('התרחשה שגיאה בעת ביטול הפגישה');
      setCancelling(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size={isMobile ? 30 : 40} />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen p-4" dir="rtl">
        <Card className={`w-full ${isMobile ? 'max-w-sm' : 'max-w-md'}`}>
          <CardHeader>
            <div className="flex justify-center mb-2">
              <XCircle className="h-16 w-16 text-destructive" />
            </div>
            <CardTitle className="text-center">לא ניתן לבטל את הפגישה</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">{error}</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => navigate('/')}>
              חזרה לדף הבית
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  if (success) {
    return (
      <div className="flex justify-center items-center h-screen p-4" dir="rtl">
        <Card className={`w-full ${isMobile ? 'max-w-sm' : 'max-w-md'}`}>
          <CardHeader>
            <div className="flex justify-center mb-2">
              <CheckCircle className="h-16 w-16 text-success" />
            </div>
            <CardTitle className="text-center">הפגישה בוטלה בהצלחה</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center">
              הפגישה שלך ל{appointment?.service_type} ב-{new Date(appointment?.date || '').toLocaleDateString('he-IL')} בשעה {appointment?.start_time} בוטלה בהצלחה.
            </p>
            
            {isLateCancellation && (
              <Alert className="mt-4 bg-yellow-50 border-yellow-200">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertTitle className="text-yellow-800">ביטול מאוחר</AlertTitle>
                <AlertDescription className="text-yellow-700">
                  שים/י לב, הפגישה בוטלה פחות מ-6 שעות לפני מועד הפגישה. במקרים מסוימים, עשוי להיות חיוב על ביטול מאוחר.
                </AlertDescription>
              </Alert>
            )}
            
            <p className="text-center mt-4 text-muted-foreground">אתה תועבר לדף הבית בעוד מספר שניות...</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="flex justify-center items-center min-h-screen p-4" dir="rtl">
      <Card className={`w-full ${isMobile ? 'max-w-sm' : 'max-w-md'}`}>
        <CardHeader>
          <CardTitle className="text-center">ביטול פגישה</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label>סוג שירות</Label>
            <div className="p-2 bg-muted rounded-md">{appointment?.service_type}</div>
          </div>
          
          <div className="space-y-1">
            <Label>תאריך ושעה</Label>
            <div className="p-2 bg-muted rounded-md">
              {appointment && new Date(appointment.date).toLocaleDateString('he-IL')} בשעה {appointment?.start_time}
            </div>
          </div>
          
          <div className="space-y-1">
            <Label>לקוח/ה</Label>
            <div className="p-2 bg-muted rounded-md">{appointment?.customer?.full_name}</div>
          </div>
          
          {isLateCancellation && (
            <Alert className="mt-4 bg-yellow-50 border-yellow-200">
              <Clock className="h-4 w-4 text-yellow-600" />
              <AlertTitle className="text-yellow-800">ביטול מאוחר</AlertTitle>
              <AlertDescription className="text-yellow-700">
                שים/י לב, אתה מבטל/ת פחות מ-6 שעות לפני מועד הפגישה. במקרים מסוימים, עשוי להיות חיוב על ביטול מאוחר.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-1 pt-2">
            <Label htmlFor="cancel-reason">סיבת הביטול</Label>
            <Select 
              value={cancelReason} 
              onValueChange={setCancelReason}
            >
              <SelectTrigger id="cancel-reason" className={isMobile ? 'h-9' : ''}>
                <SelectValue placeholder="בחר סיבה" />
              </SelectTrigger>
              <SelectContent>
                {reasons.map((reason) => (
                  <SelectItem key={reason.value} value={reason.value}>
                    {reason.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {cancelReason === 'other' && (
            <div className="space-y-1">
              <Label htmlFor="cancel-reason-text">פירוט</Label>
              <Textarea
                id="cancel-reason-text"
                placeholder="נא לפרט את סיבת הביטול"
                value={cancelReasonText}
                onChange={(e) => setCancelReasonText(e.target.value)}
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => navigate('/')} disabled={cancelling}>
            ביטול
          </Button>
          <Button 
            onClick={handleCancellation} 
            disabled={cancelling || (cancelReason === 'other' && !cancelReasonText)}
          >
            {cancelling ? (
              <>
                <LoadingSpinner size={16} className="mr-2" />
                מבטל...
              </>
            ) : 'בטל פגישה'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CancelAppointmentPage;
