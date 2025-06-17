
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar, 
  Plus, 
  CheckCircle, 
  Download,
  Apple,
  Smartphone,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { 
  getUserCalendarConnections, 
  initiateGoogleCalendarAuth
} from '@/services/calendarService';
import { downloadAppleCalendarFile } from '@/services/appleCalendarService';
import type { CalendarConnection } from '@/services/calendarService';

const CalendarConnection = () => {
  const [connections, setConnections] = useState<CalendarConnection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const loadConnections = async () => {
    try {
      const calendarConnections = await getUserCalendarConnections();
      setConnections(calendarConnections);
    } catch (error) {
      console.error('Error loading connections:', error);
      toast({
        title: 'שגיאה',
        description: 'לא ניתן לטעון את חיבורי הלוח',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadConnections();

    // Listen for OAuth callback messages
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
        toast({
          title: 'הצלחה!',
          description: 'Google Calendar חובר בהצלחה',
        });
        loadConnections(); // Refresh connections
        setIsConnecting(false);
      } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
        toast({
          title: 'שגיאה',
          description: 'לא ניתן להתחבר ל-Google Calendar',
          variant: 'destructive',
        });
        setIsConnecting(false);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [toast]);

  const handleGoogleConnect = async () => {
    setIsConnecting(true);
    try {
      const authUrl = await initiateGoogleCalendarAuth('user@example.com');
      
      // Open popup window for OAuth
      const popup = window.open(
        authUrl, 
        'google-oauth', 
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );

      // Check if popup was blocked
      if (!popup) {
        throw new Error('החלון הקופץ נחסם. אנא אפשר חלונות קופצים ונסה שוב.');
      }
      
      toast({
        title: 'חיבור ל-Google Calendar',
        description: 'נפתח חלון חדש לאישור הרשאות Google',
      });

      // Monitor popup
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          setIsConnecting(false);
        }
      }, 1000);

    } catch (error) {
      console.error('Error connecting to Google Calendar:', error);
      toast({
        title: 'שגיאה',
        description: error instanceof Error ? error.message : 'לא ניתן להתחבר ל-Google Calendar',
        variant: 'destructive',
      });
      setIsConnecting(false);
    }
  };

  // Mock appointment for demonstration
  const mockAppointment = {
    id: 'demo-appointment',
    service_type: 'מניקור ג\'ל',
    date: new Date().toISOString().split('T')[0],
    start_time: '10:00',
    end_time: '11:00',
    client: { full_name: 'לקוח לדוגמה' },
    notes: 'פגישה לדוגמה'
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-center gap-2 py-4">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>טוען...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const googleConnection = connections.find(c => c.calendar_type === 'google');

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="h-5 w-5" />
          סנכרון יומנים
        </CardTitle>
        <CardDescription>
          חבר את הפגישות שלך ליומן הטלפון
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Google Calendar */}
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center gap-3">
            <Calendar className="h-6 w-6 text-blue-600" />
            <div>
              <h3 className="font-medium text-sm">Google Calendar</h3>
              <p className="text-xs text-muted-foreground">
                סנכרון דו-כיווני אוטומטי
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {googleConnection ? (
              <div className="flex items-center gap-2">
                <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  מחובר
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={loadConnections}
                  disabled={isConnecting}
                >
                  <RefreshCw className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <Button 
                size="sm" 
                onClick={handleGoogleConnect} 
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                ) : (
                  <Plus className="h-3 w-3 mr-1" />
                )}
                התחבר
              </Button>
            )}
          </div>
        </div>

        {/* Apple Calendar */}
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center gap-3">
            <Apple className="h-6 w-6 text-gray-600" />
            <div>
              <h3 className="font-medium text-sm">Apple Calendar / Samsung</h3>
              <p className="text-xs text-muted-foreground">
                ייצוא פגישות ליומן הטלפון
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => downloadAppleCalendarFile(mockAppointment)}
            className="text-xs"
          >
            <Download className="h-3 w-3 mr-1" />
            ייצא
          </Button>
        </div>

        {/* Connection Status */}
        {connections.length > 0 && (
          <div className="pt-2 border-t">
            <p className="text-xs font-medium mb-2">חיבורים פעילים:</p>
            <div className="space-y-1">
              {connections.map((connection) => (
                <div key={connection.id} className="flex items-center justify-between text-xs">
                  <span>{connection.calendar_email}</span>
                  <Badge variant={connection.is_active ? "default" : "secondary"} className="text-xs">
                    {connection.is_active ? 'פעיל' : 'לא פעיל'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions for Google Calendar */}
        {googleConnection && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              ✅ <strong>Google Calendar מחובר:</strong> הפגישות יסונכרנו אוטומטיות דו-כיוונית
            </p>
          </div>
        )}

        {/* Instructions for Apple/Samsung */}
        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            📱 <strong>Apple/Samsung:</strong> לחץ "ייצא" והוסף את הקובץ ליומן הטלפון שלך
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarConnection;
