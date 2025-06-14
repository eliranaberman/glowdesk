import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar, 
  Plus, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink, 
  Download,
  Smartphone,
  Apple
} from 'lucide-react';
import { 
  getUserCalendarConnections, 
  initiateGoogleCalendarAuth,
  downloadIcsFile
} from '@/services/calendarService';
import { downloadAppleCalendarFile, openInAppleCalendar } from '@/services/appleCalendarService';
import { initiateFacebookAuth, getConnectedMetaAccounts } from '@/services/metaApiService';
import type { CalendarConnection } from '@/services/calendarService';
import type { MetaAccount } from '@/services/metaApiService';

const CalendarSync = () => {
  const [connections, setConnections] = useState<CalendarConnection[]>([]);
  const [metaAccounts, setMetaAccounts] = useState<MetaAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const loadConnections = async () => {
    try {
      const [calendarConnections, metaConnections] = await Promise.all([
        getUserCalendarConnections(),
        getConnectedMetaAccounts()
      ]);
      
      setConnections(calendarConnections);
      setMetaAccounts(metaConnections);
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
  }, []);

  const handleGoogleConnect = async () => {
    setIsConnecting(true);
    try {
      const authUrl = await initiateGoogleCalendarAuth('user@example.com');
      window.open(authUrl, '_blank', 'width=600,height=600');
      
      toast({
        title: 'חיבור ל-Google Calendar',
        description: 'נפתח חלון חדש לאישור הרשאות Google',
      });
    } catch (error) {
      console.error('Error connecting to Google Calendar:', error);
      toast({
        title: 'שגיאה',
        description: 'לא ניתן להתחבר ל-Google Calendar',
        variant: 'destructive',
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleMetaConnect = async () => {
    setIsConnecting(true);
    try {
      const response = await initiateFacebookAuth();
      if (response.success && response.authUrl) {
        window.open(response.authUrl, '_blank', 'width=600,height=600');
        
        toast({
          title: 'חיבור ל-Meta',
          description: 'נפתח חלון חדש לאישור הרשאות Facebook/WhatsApp',
        });
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('Error connecting to Meta:', error);
      toast({
        title: 'שגיאה',
        description: 'לא ניתן להתחבר ל-Meta',
        variant: 'destructive',
      });
    } finally {
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
    customer: { full_name: 'לקוח לדוגמה' },
    notes: 'פגישה לדוגמה'
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            סנכרון לוחות שנה
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">טוען...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            חיבורי לוח שנה
          </CardTitle>
          <CardDescription>
            נהל את החיבורים ללוחות השנה השונים שלך
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Google Calendar Section */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="font-medium">Google Calendar</h3>
                <p className="text-sm text-muted-foreground">
                  סנכרון אוטומטי עם יומן Google
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {connections.filter(c => c.calendar_type === 'google').length > 0 ? (
                <Badge variant="default" className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  מחובר
                </Badge>
              ) : (
                <Button onClick={handleGoogleConnect} disabled={isConnecting}>
                  <Plus className="h-4 w-4 mr-2" />
                  התחבר
                </Button>
              )}
            </div>
          </div>

          {/* Apple Calendar Section */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Apple className="h-8 w-8 text-gray-600" />
              <div>
                <h3 className="font-medium">Apple Calendar</h3>
                <p className="text-sm text-muted-foreground">
                  ייצוא פגישות ליומן Apple
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => downloadAppleCalendarFile(mockAppointment)}
              >
                <Download className="h-4 w-4 mr-2" />
                הורד .ics
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => openInAppleCalendar(mockAppointment)}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                פתח ביומן
              </Button>
            </div>
          </div>

          <Separator />

          {/* Meta Integration Section */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Smartphone className="h-8 w-8 text-blue-500" />
              <div>
                <h3 className="font-medium">Meta (Facebook/WhatsApp)</h3>
                <p className="text-sm text-muted-foreground">
                  חיבור לפייסבוק ו-WhatsApp Business
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {metaAccounts.length > 0 ? (
                <Badge variant="default" className="bg-blue-100 text-blue-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {metaAccounts.length} חשבונות
                </Badge>
              ) : (
                <Button onClick={handleMetaConnect} disabled={isConnecting}>
                  <Plus className="h-4 w-4 mr-2" />
                  התחבר
                </Button>
              )}
            </div>
          </div>

          {/* Connection Status */}
          {connections.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">חיבורים פעילים:</h4>
              <div className="space-y-2">
                {connections.map((connection) => (
                  <div key={connection.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">{connection.calendar_email}</span>
                    <Badge variant={connection.is_active ? "default" : "secondary"}>
                      {connection.is_active ? 'פעיל' : 'לא פעיל'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarSync;
