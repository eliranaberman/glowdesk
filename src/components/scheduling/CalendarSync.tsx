
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

const CalendarSync = () => {
  const [calendarType, setCalendarType] = useState<string>('');
  const [calendarEmail, setCalendarEmail] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const handleConnect = () => {
    if (!calendarType || !calendarEmail) {
      toast({
        title: "שגיאה",
        description: "נא להזין סוג לוח שנה ואימייל",
        variant: "destructive"
      });
      return;
    }

    // Here you would implement the actual calendar integration code
    // For now, we'll simulate a successful connection
    
    // In a real implementation, this would connect to Google Calendar API, 
    // Apple Calendar, or other calendar services
    
    setTimeout(() => {
      setIsConnected(true);
      toast({
        title: "לוח שנה מחובר",
        description: `לוח השנה מסוג ${calendarType} חובר בהצלחה`,
      });
    }, 1500);
  };

  const handleDisconnect = () => {
    // Here you would implement the code to disconnect from the calendar service
    setIsConnected(false);
    setCalendarType('');
    setCalendarEmail('');
    toast({
      title: "לוח שנה נותק",
      description: "לוח השנה נותק בהצלחה",
    });
  };

  return (
    <div className="border rounded-lg p-6" dir="rtl">
      <h2 className="text-xl font-semibold mb-4">סנכרון לוח שנה</h2>
      
      {!isConnected ? (
        <div className="grid gap-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="calendar-type" className="text-right">
              סוג לוח שנה
            </Label>
            <select
              id="calendar-type"
              className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={calendarType}
              onChange={(e) => setCalendarType(e.target.value)}
            >
              <option value="">בחרו סוג לוח שנה</option>
              <option value="Google Calendar">Google Calendar</option>
              <option value="Apple Calendar">Apple Calendar</option>
              <option value="Microsoft Outlook">Microsoft Outlook</option>
            </select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="calendar-email" className="text-right">
              אימייל
            </Label>
            <Input
              id="calendar-email"
              type="email"
              placeholder="name@example.com"
              className="col-span-3"
              value={calendarEmail}
              onChange={(e) => setCalendarEmail(e.target.value)}
            />
          </div>
          
          <Button onClick={handleConnect} className="mt-2 w-full">חבר לוח שנה</Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded p-4">
            <p className="text-green-800">
              לוח השנה מסוג {calendarType} מחובר בהצלחה עם החשבון {calendarEmail}
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              פגישות חדשות יסונכרנו אוטומטית ללוח השנה שלך.
            </p>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm">נתק</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]" dir="rtl">
                <DialogHeader>
                  <DialogTitle>ניתוק לוח שנה</DialogTitle>
                  <DialogDescription>
                    האם אתה בטוח שברצונך לנתק את לוח השנה? פגישות לא יסונכרנו יותר.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => {}}>ביטול</Button>
                  <Button variant="destructive" onClick={handleDisconnect}>נתק</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarSync;
