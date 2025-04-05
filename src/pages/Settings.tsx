
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";

const Settings = () => {
  const [businessInfo, setBusinessInfo] = useState({
    name: "By Chen Mizrahi",
    address: "רח׳ בן גוריון 132, תל אביב",
    phone: "054-1234567",
    email: "chen@nailsalon.co.il",
    website: "www.chen-nails.co.il",
  });

  const [bookingSettings, setBookingSettings] = useState({
    allowOnlineBooking: true,
    advanceBookingDays: "14",
    minTimeSlot: "30",
    workStartTime: "09:00",
    workEndTime: "18:00",
    workDays: [0, 1, 2, 3, 4], // Sunday to Thursday
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    reminderHours: "24",
  });

  const handleBusinessInfoUpdate = () => {
    toast({
      title: "פרטי העסק עודכנו",
      description: "פרטי העסק עודכנו בהצלחה"
    });
  };

  const handleBookingSettingsUpdate = () => {
    toast({
      title: "הגדרות קביעת התורים עודכנו",
      description: "הגדרות קביעת התורים עודכנו בהצלחה"
    });
  };

  const handleNotificationSettingsUpdate = () => {
    toast({
      title: "הגדרות התראות עודכנו",
      description: "הגדרות התראות עודכנו בהצלחה"
    });
  };

  return (
    <div dir="rtl">
      <h1 className="text-2xl font-bold mb-4">הגדרות</h1>
      <p className="text-muted-foreground mb-6">
        עדכן את הגדרות המערכת והעסק שלך.
      </p>

      <Tabs defaultValue="business" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="business">פרטי העסק</TabsTrigger>
          <TabsTrigger value="booking">הגדרות קביעת תורים</TabsTrigger>
          <TabsTrigger value="notifications">הגדרות התראות</TabsTrigger>
        </TabsList>

        <TabsContent value="business">
          <Card>
            <CardHeader>
              <CardTitle>פרטי העסק</CardTitle>
              <CardDescription>
                עדכן את פרטי העסק שלך שיוצגו ללקוחות.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="business-name">שם העסק</Label>
                <Input 
                  id="business-name" 
                  value={businessInfo.name} 
                  onChange={(e) => setBusinessInfo({...businessInfo, name: e.target.value})}
                />
              </div>
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="business-address">כתובת</Label>
                <Input 
                  id="business-address" 
                  value={businessInfo.address} 
                  onChange={(e) => setBusinessInfo({...businessInfo, address: e.target.value})}
                />
              </div>
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="business-phone">טלפון</Label>
                <Input 
                  id="business-phone" 
                  value={businessInfo.phone} 
                  onChange={(e) => setBusinessInfo({...businessInfo, phone: e.target.value})}
                />
              </div>
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="business-email">אימייל</Label>
                <Input 
                  id="business-email" 
                  type="email" 
                  value={businessInfo.email} 
                  onChange={(e) => setBusinessInfo({...businessInfo, email: e.target.value})}
                />
              </div>
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="business-website">אתר אינטרנט</Label>
                <Input 
                  id="business-website" 
                  value={businessInfo.website} 
                  onChange={(e) => setBusinessInfo({...businessInfo, website: e.target.value})}
                />
              </div>
              <Button onClick={handleBusinessInfoUpdate}>שמור שינויים</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="booking">
          <Card>
            <CardHeader>
              <CardTitle>הגדרות קביעת תורים</CardTitle>
              <CardDescription>
                נהל את האפשרויות לקביעת תורים באתר.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="allow-online-booking" className="flex-1">
                  אפשר קביעת תורים אונליין
                </Label>
                <Switch 
                  id="allow-online-booking" 
                  checked={bookingSettings.allowOnlineBooking} 
                  onCheckedChange={(checked) => setBookingSettings({...bookingSettings, allowOnlineBooking: checked})}
                />
              </div>
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="advance-booking-days">ימים מראש לקביעת תורים</Label>
                <Input 
                  id="advance-booking-days" 
                  type="number" 
                  value={bookingSettings.advanceBookingDays} 
                  onChange={(e) => setBookingSettings({...bookingSettings, advanceBookingDays: e.target.value})}
                />
              </div>
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="min-time-slot">אורך התור המינימלי (דקות)</Label>
                <Input 
                  id="min-time-slot" 
                  type="number" 
                  value={bookingSettings.minTimeSlot} 
                  onChange={(e) => setBookingSettings({...bookingSettings, minTimeSlot: e.target.value})}
                />
              </div>
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="work-start-time">שעת תחילת עבודה</Label>
                <Input 
                  id="work-start-time" 
                  type="time" 
                  value={bookingSettings.workStartTime} 
                  onChange={(e) => setBookingSettings({...bookingSettings, workStartTime: e.target.value})}
                />
              </div>
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="work-end-time">שעת סיום עבודה</Label>
                <Input 
                  id="work-end-time" 
                  type="time" 
                  value={bookingSettings.workEndTime} 
                  onChange={(e) => setBookingSettings({...bookingSettings, workEndTime: e.target.value})}
                />
              </div>
              <Button onClick={handleBookingSettingsUpdate}>שמור שינויים</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>הגדרות התראות</CardTitle>
              <CardDescription>
                נהל את ההתראות שנשלחות ללקוחות.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications" className="flex-1">
                  התראות במייל
                </Label>
                <Switch 
                  id="email-notifications" 
                  checked={notificationSettings.emailNotifications} 
                  onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, emailNotifications: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="sms-notifications" className="flex-1">
                  התראות SMS
                </Label>
                <Switch 
                  id="sms-notifications" 
                  checked={notificationSettings.smsNotifications} 
                  onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, smsNotifications: checked})}
                />
              </div>
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="reminder-hours">שעות לפני הפגישה לשליחת תזכורת</Label>
                <Input 
                  id="reminder-hours" 
                  type="number" 
                  value={notificationSettings.reminderHours} 
                  onChange={(e) => setNotificationSettings({...notificationSettings, reminderHours: e.target.value})}
                />
              </div>
              <Button onClick={handleNotificationSettingsUpdate}>שמור שינויים</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
