
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Download, RefreshCw, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CalendarConnection = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const handleConnect = async () => {
    setIsConnecting(true);
    // Simulate connection process
    setTimeout(() => {
      setIsConnected(!isConnected);
      setIsConnecting(false);
      toast({
        title: isConnected ? "היומן נותק" : "היומן התחבר בהצלחה",
        description: isConnected ? 
          "היומן של Google נותק מהמערכת" : 
          "הפגישות שלך יסונכרנו עם Google Calendar"
      });
    }, 2000);
  };

  const handleExport = () => {
    toast({
      title: "מייצא נתונים",
      description: "הנתונים מיוצאים לקובץ Excel..."
    });
  };

  return (
    <Card className="h-24">
      <CardContent className="p-4">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <h3 className="font-medium text-sm">סנכרון יומן</h3>
                <p className="text-xs text-muted-foreground">
                  {isConnected ? 'מחובר ל-Google Calendar' : 'לא מחובר'}
                </p>
              </div>
            </div>
            {isConnected && <CheckCircle className="h-4 w-4 text-green-500" />}
          </div>
          
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleExport}
              className="h-8 px-3 text-xs"
            >
              <Download className="h-3 w-3 ml-1" />
              יצוא
            </Button>
            <Button 
              size="sm"
              onClick={handleConnect}
              disabled={isConnecting}
              className="h-8 px-3 text-xs"
            >
              {isConnecting ? (
                <RefreshCw className="h-3 w-3 animate-spin ml-1" />
              ) : (
                <Calendar className="h-3 w-3 ml-1" />
              )}
              {isConnected ? 'נתק' : 'חבר'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarConnection;
