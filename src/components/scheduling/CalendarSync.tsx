import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Calendar, Check, Download, RefreshCw, Trash2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  CalendarConnection, 
  getUserCalendarConnections, 
  updateCalendarConnection,
  deleteCalendarConnection,
  downloadIcsFile,
  initiateGoogleCalendarAuth,
  handleOAuthCallback
} from '@/services/calendarService';
import { 
  NotificationPreference, 
  getUserNotificationPreferences,
  upsertNotificationPreferences
} from '@/services/notificationService';

const CalendarSync = () => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('calendar');
  const [calendarEmail, setCalendarEmail] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [connections, setConnections] = useState<CalendarConnection[]>([]);
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreference | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDisconnectDialog, setShowDisconnectDialog] = useState(false);
  const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
    // Check for OAuth callback
    const callbackResult = handleOAuthCallback();
    if (callbackResult) {
      if (callbackResult.success) {
        toast({
          title: "הצלחה!",
          description: callbackResult.message,
        });
        // Reload data after successful auth
        loadData();
      } else {
        toast({
          title: "שגיאה",
          description: callbackResult.message,
          variant: "destructive"
        });
      }
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Load calendar connections
      const connectionsData = await getUserCalendarConnections();
      console.log('Loaded calendar connections:', connectionsData);
      setConnections(connectionsData);
      
      // Load notification preferences with error handling
      try {
        const prefsData = await getUserNotificationPreferences();
        console.log('Loaded notification preferences:', prefsData);
        setNotificationPrefs(prefsData);
      } catch (error) {
        console.error("Error loading notification preferences:", error);
        // Set default preferences if loading fails
        setNotificationPrefs({
          id: '',
          user_id: '',
          whatsapp_enabled: true,
          sms_fallback_enabled: true,
          created_at: '',
          updated_at: ''
        });
      }
    } catch (error) {
      console.error("Error loading calendar data:", error);
      toast({
        title: "שגיאה בטעינת נתונים",
        description: "לא ניתן לטעון את נתוני לוח השנה. נסה שוב מאוחר יותר.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectGoogle = async () => {
    if (!calendarEmail) {
      toast({
        title: "שגיאה",
        description: "נא להזין אימייל",
        variant: "destructive"
      });
      return;
    }

    setIsConnecting(true);
    try {
      console.log('Initiating Google Calendar auth for email:', calendarEmail);
      // Get OAuth URL from the edge function
      const authUrl = await initiateGoogleCalendarAuth(calendarEmail);
      console.log('Received auth URL:', authUrl);
      
      // Redirect to Google OAuth
      window.location.href = authUrl;
    } catch (error: any) {
      console.error("Error connecting to Google Calendar:", error);
      toast({
        title: "שגיאה בחיבור",
        description: error.message || "לא ניתן לחבר את לוח השנה. נסה שוב מאוחר יותר.",
        variant: "destructive"
      });
      setIsConnecting(false);
    }
  };

  const initiateDisconnect = (connectionId: string) => {
    setSelectedConnectionId(connectionId);
    setShowDisconnectDialog(true);
  };

  const handleDisconnect = async () => {
    if (!selectedConnectionId) return;
    
    setIsDisconnecting(true);
    try {
      await deleteCalendarConnection(selectedConnectionId);
      
      toast({
        title: "לוח שנה נותק",
        description: "לוח שנה נותק בהצלחה",
      });
      
      await loadData();
      setShowDisconnectDialog(false);
      setSelectedConnectionId(null);
    } catch (error: any) {
      console.error("Error disconnecting calendar:", error);
      toast({
        title: "שגיאה בניתוק",
        description: error.message || "לא ניתן לנתק את לוח השנה. נסה שוב מאוחר יותר.",
        variant: "destructive"
      });
    } finally {
      setIsDisconnecting(false);
    }
  };

  const handleToggleCalendarActive = async (connectionId: string, isActive: boolean) => {
    try {
      await updateCalendarConnection(connectionId, { is_active: isActive });
      
      toast({
        title: isActive ? "לוח שנה הופעל" : "לוח שנה הושבת",
        description: isActive ? "סנכרון לוח שנה הופעל בהצלחה" : "סנכרון לוח שנה הושבת בהצלחה",
      });
      
      await loadData();
    } catch (error: any) {
      console.error("Error toggling calendar active state:", error);
      toast({
        title: "שגיאה",
        description: error.message || "לא ניתן לעדכן את מצב הפעילות. נסה שוב מאוחר יותר.",
        variant: "destructive"
      });
    }
  };

  const handleToggleWhatsApp = async (enabled: boolean) => {
    try {
      await upsertNotificationPreferences({ whatsapp_enabled: enabled });
      
      toast({
        title: enabled ? "התראות WhatsApp הופעלו" : "התראות WhatsApp הושבתו",
        description: enabled ? "התראות WhatsApp יישלחו עבור פגישות" : "התראות WhatsApp לא יישלחו עבור פגישות",
      });
      
      await loadData();
    } catch (error: any) {
      console.error("Error toggling WhatsApp notifications:", error);
      toast({
        title: "שגיאה",
        description: error.message || "לא ניתן לעדכן את העדפות ההתראות. נסה שוב מאוחר יותר.",
        variant: "destructive"
      });
    }
  };

  const handleToggleSMSFallback = async (enabled: boolean) => {
    try {
      await upsertNotificationPreferences({ sms_fallback_enabled: enabled });
      
      toast({
        title: enabled ? "התראות SMS הופעלו" : "התראות SMS הושבתו",
        description: enabled ? "התראות SMS יישלחו כגיבוי אם WhatsApp אינו זמין" : "התראות SMS לא יישלחו כגיבוי",
      });
      
      await loadData();
    } catch (error: any) {
      console.error("Error toggling SMS fallback:", error);
      toast({
        title: "שגיאה",
        description: error.message || "לא ניתן לעדכן את העדפות ההתראות. נסה שוב מאוחר יותר.",
        variant: "destructive"
      });
    }
  };

  const renderCalendarContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
    }

    const googleConnections = connections.filter(conn => conn.calendar_type === 'google');

    return (
      <div className="space-y-4">
        {googleConnections.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-medium">חיבורי Google Calendar</h3>
            {googleConnections.map(connection => (
              <div key={connection.id} className="bg-muted/50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{connection.calendar_email}</span>
                    <div className="text-xs text-muted-foreground">
                      Google Calendar
                    </div>
                    <div className="text-xs mt-1">
                      {connection.last_sync_at ? 
                        `סנכרון אחרון: ${new Date(connection.last_sync_at).toLocaleString('he-IL')}` : 
                        'טרם סונכרן'}
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs">פעיל</span>
                      <Switch 
                        checked={connection.is_active}
                        onCheckedChange={(checked) => handleToggleCalendarActive(connection.id, checked)}
                      />
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => initiateDisconnect(connection.id)}
                      className="text-xs text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      נתק
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className={googleConnections.length > 0 ? "border-t pt-4" : ""}>
          <p className="text-sm font-medium mb-2">
            {googleConnections.length > 0 ? "חיבור Google Calendar נוסף" : "חיבור Google Calendar"}
          </p>
          <div className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="calendar-email" className="text-right">
                חשבון Google
              </Label>
              <Input
                id="calendar-email"
                type="email"
                placeholder="name@gmail.com"
                className="col-span-3"
                value={calendarEmail}
                onChange={(e) => setCalendarEmail(e.target.value)}
              />
            </div>
            
            <Button 
              onClick={handleConnectGoogle} 
              className="mt-2 w-full"
              disabled={isConnecting}
            >
              {isConnecting ? 'מתחבר...' : 'חבר לוח שנה'}
            </Button>
          </div>
        </div>

        <div className="mt-6 border-t pt-4">
          <p className="text-sm text-muted-foreground mb-2">לחילופין, ניתן לייצא את הפגישות כקובץ .ics:</p>
          <Button variant="outline" className="w-full">
            <Download className="w-4 h-4 mr-2" />
            הורד כקובץ .ics
          </Button>
        </div>
      </div>
    );
  };

  const renderNotificationsContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium">התראות WhatsApp</h3>
            <p className="text-sm text-muted-foreground">שלח התראות פגישות באמצעות WhatsApp</p>
          </div>
          <Switch 
            checked={notificationPrefs?.whatsapp_enabled ?? true}
            onCheckedChange={handleToggleWhatsApp}
          />
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium">גיבוי SMS</h3>
            <p className="text-sm text-muted-foreground">שלח SMS אם WhatsApp אינו זמין</p>
          </div>
          <Switch 
            checked={notificationPrefs?.sms_fallback_enabled ?? true}
            onCheckedChange={handleToggleSMSFallback}
          />
        </div>
        
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <div>
              <h4 className="text-sm font-medium text-amber-800">נדרש חיבור WhatsApp Business API</h4>
              <p className="text-xs text-amber-700 mt-1">
                כדי להשתמש בהתראות WhatsApp, יש לחבר את המערכת ל-WhatsApp Business API.
                צור קשר עם התמיכה לקבלת פרטים נוספים.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="border rounded-lg p-6" dir="rtl">
      <h2 className="text-xl font-semibold mb-4">סנכרון והתראות</h2>
      
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="calendar">לוח שנה</TabsTrigger>
          <TabsTrigger value="notifications">התראות</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar" className="space-y-4">
          {renderCalendarContent()}
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          {renderNotificationsContent()}
        </TabsContent>
      </Tabs>
      
      <Dialog open={showDisconnectDialog} onOpenChange={setShowDisconnectDialog}>
        <DialogContent className="sm:max-w-[425px]" dir="rtl">
          <DialogHeader>
            <DialogTitle>ניתוק לוח שנה</DialogTitle>
            <DialogDescription>
              האם אתה בטוח שברצונך לנתק את לוח השנה? פגישות לא יסונכרנו יותר.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDisconnectDialog(false)}>ביטול</Button>
            <Button 
              variant="destructive" 
              onClick={handleDisconnect}
              disabled={isDisconnecting}
            >
              {isDisconnecting ? 'מנתק...' : 'נתק'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarSync;
