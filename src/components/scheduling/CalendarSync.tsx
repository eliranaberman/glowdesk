import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { AlertCircle, Calendar, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

import { connectToGoogle, disconnectCalendar, getUserCalendarConnections } from '@/services/calendarService';
import { 
  NotificationPreference, 
  getUserNotificationPreferences,
  upsertNotificationPreferences
} from '@/services/notificationService';
import { useIsMobile } from '@/hooks/use-mobile';

const CalendarSync = () => {
  const isMobile = useIsMobile();
  const [isConnected, setIsConnected] = useState(false);
  const [calendarConnections, setCalendarConnections] = useState<any[]>([]);
  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreference | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [whatsappEnabled, setWhatsappEnabled] = useState(true);
  const [smsFallbackEnabled, setSmsFallbackEnabled] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Load calendar connections
        const connections = await getUserCalendarConnections();
        setCalendarConnections(connections);
        setIsConnected(connections.length > 0);
        
        // Load notification preferences
        const prefs = await getUserNotificationPreferences();
        setNotificationPreferences(prefs);
        setWhatsappEnabled(prefs.whatsapp_enabled);
        setSmsFallbackEnabled(prefs.sms_fallback_enabled);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('שגיאה בטעינת הנתונים');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleGoogleConnect = async () => {
    setIsSyncing(true);
    try {
      await connectToGoogle();
      toast.success('התחברת בהצלחה לגוגל');
      
      // Refresh connections
      const connections = await getUserCalendarConnections();
      setCalendarConnections(connections);
      setIsConnected(connections.length > 0);
    } catch (error) {
      console.error('Error connecting to Google:', error);
      toast.error('שגיאה בחיבור לגוגל');
    } finally {
      setIsSyncing(false);
    }
  };
  
  const handleDisconnect = async (connectionId: string) => {
    setIsSyncing(true);
    try {
      await disconnectCalendar(connectionId);
      toast.success('התנתקת בהצלחה מלוח השנה');
      
      // Refresh connections
      const connections = await getUserCalendarConnections();
      setCalendarConnections(connections);
      setIsConnected(connections.length > 0);
    } catch (error) {
      console.error('Error disconnecting calendar:', error);
      toast.error('שגיאה בהתנתקות מלוח השנה');
    } finally {
      setIsSyncing(false);
    }
  };
  
  const handleWhatsappToggle = async (enabled: boolean) => {
    setWhatsappEnabled(enabled);
    await updateNotificationSettings({ whatsapp_enabled: enabled });
  };
  
  const handleSmsFallbackToggle = async (enabled: boolean) => {
    setSmsFallbackEnabled(enabled);
    await updateNotificationSettings({ sms_fallback_enabled: enabled });
  };
  
  const updateNotificationSettings = async (preferences: Partial<NotificationPreference>) => {
    try {
      await upsertNotificationPreferences(preferences);
      toast.success('העדפות התראות עודכנו בהצלחה');
      
      // Refresh preferences
      const prefs = await getUserNotificationPreferences();
      setNotificationPreferences(prefs);
      setWhatsappEnabled(prefs.whatsapp_enabled);
      setSmsFallbackEnabled(prefs.sms_fallback_enabled);
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      toast.error('שגיאה בעדכון העדפות התראות');
    }
  };
  
  return (
    <div>
      <CardHeader className={isMobile ? 'pb-2 px-3 pt-3' : ''}>
        <CardTitle className={isMobile ? 'text-lg' : ''}>סנכרון לוח שנה והתראות</CardTitle>
        <CardDescription className={isMobile ? 'text-xs' : ''}>
          סנכרן את הפגישות שלך עם גוגל קלנדר ונהל את ההתראות שלך.
        </CardDescription>
      </CardHeader>
      <CardContent className={isMobile ? 'px-3' : ''}>
        {isLoading ? (
          <div className="text-center py-4">טוען...</div>
        ) : (
          <div className="space-y-4">
            {calendarConnections.length > 0 ? (
              calendarConnections.map((connection) => (
                <div key={connection.id} className="flex items-center justify-between">
                  <div>
                    <p className={`font-medium ${isMobile ? 'text-sm' : ''}`}>{connection.calendar_email}</p>
                    <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
                      סונכרן באמצעות {connection.calendar_type === 'google' ? 'Google' : 'Other'}
                    </p>
                  </div>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    disabled={isSyncing}
                    onClick={() => handleDisconnect(connection.id)}
                    className={isMobile ? 'text-xs' : ''}
                  >
                    התנתק
                  </Button>
                </div>
              ))
            ) : (
              <div className="space-y-2">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    לא מחובר לחשבון גוגל.
                  </AlertDescription>
                </Alert>
                <Button 
                  onClick={handleGoogleConnect} 
                  disabled={isSyncing}
                  className={isMobile ? 'text-sm w-full' : ''}
                >
                  חבר לגוגל
                </Button>
              </div>
            )}
            
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="whatsapp" className={`text-right ${isMobile ? 'text-sm' : ''}`}>
                    אפשר התראות WhatsApp
                  </Label>
                  <p className={`text-sm text-muted-foreground ${isMobile ? 'text-xs' : ''}`}>
                    קבל התראות על הפגישות שלך ישירות ל-WhatsApp.
                  </p>
                </div>
                <Switch 
                  id="whatsapp" 
                  checked={whatsappEnabled} 
                  onCheckedChange={handleWhatsappToggle}
                  disabled={isLoading}
                />
              </div>
              
              <div className="mt-2 flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="smsFallback" className={`text-right ${isMobile ? 'text-sm' : ''}`}>
                    אפשר SMS כגיבוי
                  </Label>
                  <p className={`text-sm text-muted-foreground ${isMobile ? 'text-xs' : ''}`}>
                    אם הודעת WhatsApp לא נשלחה, נשלח SMS במקום.
                  </p>
                </div>
                <Switch 
                  id="smsFallback" 
                  checked={smsFallbackEnabled} 
                  onCheckedChange={handleSmsFallbackToggle}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className={`border-t bg-muted/50 ${isMobile ? 'px-3 py-2' : 'px-6 py-4'}`}>
        <p className={`text-muted-foreground text-xs ${isMobile ? 'text-xs' : ''}`}>
          <Info className="inline-block h-4 w-4 ml-1 align-middle" />
          ההתראות ישלחו 24 שעות ושלוש שעות לפני מועד הפגישה.
        </p>
      </CardFooter>
    </div>
  );
};

export default CalendarSync;
