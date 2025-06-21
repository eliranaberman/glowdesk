
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { 
  RefreshCw, 
  Plus, 
  CheckCircle, 
  Loader2,
  Download,
  Apple,
  Calendar,
  Info
} from 'lucide-react';
import { 
  getUserCalendarConnections, 
  initiateGoogleCalendarAuth
} from '@/services/calendarService';
import { 
  downloadMultipleAppointmentsFile,
  ExportTimeRange 
} from '@/services/appleCalendarService';
import type { CalendarConnection } from '@/services/calendarService';

const CalendarSyncDropdown = () => {
  const [connections, setConnections] = useState<CalendarConnection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const loadConnections = async () => {
    if (!isOpen) return; // Only load when dropdown is opened
    
    try {
      setIsLoading(true);
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
    if (isOpen) {
      loadConnections();
    }
  }, [isOpen]);

  // Listen for OAuth callback messages
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
        toast({
          title: 'הצלחה!',
          description: 'Google Calendar חובר בהצלחה',
        });
        loadConnections();
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
      
      const popup = window.open(
        authUrl, 
        'google-oauth', 
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );

      if (!popup) {
        throw new Error('החלון הקופץ נחסם. אנא אפשר חלונות קופצים ונסה שוב.');
      }
      
      toast({
        title: 'חיבור ל-Google Calendar',
        description: 'נפתח חלון חדש לאישור הרשאות Google',
      });

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

  const handleExport = async (timeRange: ExportTimeRange, rangeName: string) => {
    setIsExporting(true);
    try {
      await downloadMultipleAppointmentsFile(timeRange);
      toast({
        title: 'ייצוא הושלם בהצלחה!',
        description: `פגישות יוצאו ל${rangeName}`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: 'שגיאה בייצוא',
        description: 'לא ניתן לייצא את הפגישות',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const googleConnection = connections.find(c => c.calendar_type === 'google');

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          <span className="hidden sm:inline">סנכרון</span>
          {googleConnection && (
            <Badge variant="default" className="bg-green-100 text-green-800 text-xs h-4 px-1">
              <CheckCircle className="h-2 w-2" />
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b">
            <RefreshCw className="h-4 w-4" />
            <h3 className="font-medium">סנכרון וייצוא</h3>
          </div>

          {/* Google Calendar Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Google Calendar</span>
              </div>
              {googleConnection ? (
                <div className="flex items-center gap-1">
                  <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    מחובר
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={loadConnections}
                    disabled={isLoading}
                    className="h-6 w-6 p-0"
                  >
                    <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              ) : (
                <Button 
                  size="sm" 
                  onClick={handleGoogleConnect} 
                  disabled={isConnecting}
                  className="h-7 text-xs"
                >
                  {isConnecting ? (
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  ) : (
                    <Plus className="h-3 w-3 mr-1" />
                  )}
                  התחבר
                </Button>
              )}
            </div>

            {googleConnection && (
              <div className="text-xs text-muted-foreground bg-green-50 p-2 rounded">
                ✅ הפגישות מסונכרנות אוטומטית
              </div>
            )}
          </div>

          {/* Export Section */}
          <div className="space-y-3 border-t pt-3">
            <div className="flex items-center gap-2">
              <Apple className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium">ייצוא ליומן</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleExport({ type: 'week' }, 'השבוע')}
                disabled={isExporting}
                className="text-xs h-8"
              >
                <Download className="h-3 w-3 mr-1" />
                השבוע
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleExport({ type: 'month' }, 'החודש')}
                disabled={isExporting}
                className="text-xs h-8"
              >
                <Download className="h-3 w-3 mr-1" />
                החודש
              </Button>
            </div>

            {isExporting && (
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" />
                מייצא פגישות...
              </div>
            )}
          </div>

          {/* Help Text */}
          <div className="text-xs text-muted-foreground bg-blue-50 p-2 rounded border-t">
            <div className="flex items-start gap-1">
              <Info className="h-3 w-3 mt-0.5 text-blue-600" />
              <div>
                <div className="font-medium text-blue-900">טיפ:</div>
                <div>לחץ על הקובץ שהורד לייבוא ביומן הטלפון</div>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CalendarSyncDropdown;
