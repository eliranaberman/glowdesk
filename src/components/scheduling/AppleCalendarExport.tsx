
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { 
  Download,
  Apple,
  Calendar,
  Info,
  CheckCircle,
  Clock
} from 'lucide-react';
import { 
  downloadMultipleAppointmentsFile,
  ExportTimeRange 
} from '@/services/appleCalendarService';
import { Separator } from '@/components/ui/separator';

const AppleCalendarExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [lastExport, setLastExport] = useState<{ date: Date; count: number } | null>(null);
  const { toast } = useToast();

  const handleExport = async (timeRange: ExportTimeRange, rangeName: string) => {
    setIsExporting(true);
    try {
      await downloadMultipleAppointmentsFile(timeRange);
      
      const exportResult = await import('@/services/appleCalendarService').then(
        service => service.exportMultipleAppointments(timeRange)
      );
      
      if (exportResult.success) {
        setLastExport({ date: new Date(), count: exportResult.appointmentCount || 0 });
        toast({
          title: 'ייצוא הושלם בהצלחה!',
          description: `${exportResult.appointmentCount} פגישות יוצאו ל${rangeName}`,
        });
      }
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: 'שגיאה בייצוא',
        description: error.message || 'לא ניתן לייצא את הפגישות',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Apple className="h-5 w-5 text-gray-600" />
          ייצוא ל-Apple Calendar / Samsung
        </CardTitle>
        <CardDescription>
          ייצא את הפגישות שלך כקובץ ICS לייבוא ביומן הטלפון
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Export Options */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">בחר טווח לייצוא:</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              onClick={() => handleExport({ type: 'week' }, 'השבוע')}
              disabled={isExporting}
              className="flex items-center gap-2 h-12"
            >
              <Download className="h-4 w-4" />
              <div className="text-right">
                <div className="font-medium">השבוע הקרוב</div>
                <div className="text-xs text-muted-foreground">ראשון עד שבת</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => handleExport({ type: 'month' }, 'החודש')}
              disabled={isExporting}
              className="flex items-center gap-2 h-12"
            >
              <Download className="h-4 w-4" />
              <div className="text-right">
                <div className="font-medium">החודש הנוכחי</div>
                <div className="text-xs text-muted-foreground">כל הפגישות בחודש</div>
              </div>
            </Button>
          </div>
        </div>

        {/* Last Export Status */}
        {lastExport && (
          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <div className="text-sm">
              <span className="font-medium">ייצוא אחרון:</span> {lastExport.count} פגישות, {' '}
              <span className="text-muted-foreground">
                {lastExport.date.toLocaleString('he-IL')}
              </span>
            </div>
          </div>
        )}

        <Separator />

        {/* Instructions */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription className="text-sm">
            <div className="space-y-2">
              <div className="font-medium">הנחיות לייבוא ביומן:</div>
              <div className="space-y-1 text-xs">
                <div><strong>iPhone:</strong> לחץ על הקובץ שהורדת ← "הוסף ליומן" ← בחר יומן</div>
                <div><strong>Samsung:</strong> פתח את אפליקציית "יומן" ← הגדרות ← ייבא ← בחר קובץ</div>
                <div><strong>אנדרואיד:</strong> Google Calendar ← הגדרות ← ייבא ← בחר קובץ ICS</div>
              </div>
            </div>
          </AlertDescription>
        </Alert>

        {/* Important Notes */}
        <Alert>
          <Clock className="h-4 w-4" />
          <AlertDescription className="text-sm">
            <div className="space-y-1">
              <div className="font-medium">חשוב לזכור:</div>
              <div className="text-xs text-muted-foreground">
                הייצוא הוא חד-כיווני. שינויים בפגישות באתר לא יתעדכנו אוטומטית ביומן הטלפון. 
                יש לייצא מחדש אחרי שינויים.
              </div>
            </div>
          </AlertDescription>
        </Alert>

        {/* Loading State */}
        {isExporting && (
          <div className="flex items-center justify-center gap-2 py-4">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm text-muted-foreground">מייצא פגישות...</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AppleCalendarExport;
