
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Calendar, AlertCircle, MessageSquare, Clock, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

// Generate Hebrew formatted date 
const formatHebrewDate = (date: Date) => {
  return new Intl.DateTimeFormat('he-IL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const Notifications = () => {
  // Mock notification data
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const twoDaysAgo = new Date(now);
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  const [allNotifications, setAllNotifications] = useState([
    {
      id: '1',
      type: 'appointment',
      title: 'פגישה חדשה',
      message: 'נקבעה פגישה חדשה עם רחל כהן',
      date: now,
      read: false,
    },
    {
      id: '2',
      type: 'inventory',
      title: 'התראת מלאי',
      message: 'לק ג\'ל אדום - נותרו רק 2 יחידות במלאי',
      date: now,
      read: false,
    },
    {
      id: '3',
      type: 'message',
      title: 'הודעה חדשה',
      message: 'התקבלה הודעה חדשה מנועה לוי',
      date: yesterday,
      read: false,
    },
    {
      id: '4',
      type: 'reminder',
      title: 'תזכורת',
      message: 'להזמין מלאי חדש עבור חומרי אקרילים',
      date: yesterday,
      read: false,
    },
    {
      id: '5',
      type: 'appointment',
      title: 'פגישה בוטלה',
      message: 'הפגישה עם מיכל אזולאי בוטלה',
      date: twoDaysAgo,
      read: true,
    },
    {
      id: '6',
      type: 'message',
      title: 'הודעה חדשה',
      message: 'התקבלה הודעה חדשה מדנה ישראלי',
      date: twoDaysAgo,
      read: true,
    },
  ]);

  const unreadNotifications = allNotifications.filter(n => !n.read);
  const appointmentNotifications = allNotifications.filter(n => n.type === 'appointment');
  const inventoryNotifications = allNotifications.filter(n => n.type === 'inventory');
  const messageNotifications = allNotifications.filter(n => n.type === 'message');

  const markAllAsRead = () => {
    const updatedNotifications = allNotifications.map(n => ({
      ...n,
      read: true
    }));
    setAllNotifications(updatedNotifications);
    toast({
      title: "כל ההתראות סומנו כנקראו",
    });
  };

  const markAsRead = (id: string) => {
    const updatedNotifications = allNotifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    setAllNotifications(updatedNotifications);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case 'inventory':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case 'message':
        return <MessageSquare className="h-5 w-5 text-green-500" />;
      case 'reminder':
        return <Clock className="h-5 w-5 text-purple-500" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const NotificationItem = ({ notification }: { notification: typeof allNotifications[0] }) => (
    <div className={`p-4 border-b last:border-none hover:bg-accent/50 transition-colors ${!notification.read ? 'bg-accent/20' : ''}`}>
      <div className="flex">
        <div className="p-1.5 bg-background rounded-full border shadow-sm">
          {getNotificationIcon(notification.type)}
        </div>
        <div className="flex-1 mr-3">
          <div className="flex items-center justify-between mb-1">
            <div className="font-medium flex items-center">
              {notification.title}
              {!notification.read && (
                <Badge variant="secondary" className="mr-2 px-1.5 py-0">חדש</Badge>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              {formatHebrewDate(notification.date)}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{notification.message}</p>
          {!notification.read && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-2 h-8" 
              onClick={() => markAsRead(notification.id)}
            >
              <Check className="h-4 w-4 mr-1" />
              סמן כנקראה
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">התראות</h1>
          <p className="text-muted-foreground">
            נהל את כל ההתראות והעדכונים שלך.
          </p>
        </div>
        {unreadNotifications.length > 0 && (
          <Button variant="outline" onClick={markAllAsRead}>
            סמן הכל כנקרא
          </Button>
        )}
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full md:w-auto">
          <TabsTrigger value="all" className="relative">
            הכל
            {unreadNotifications.length > 0 && (
              <Badge variant="secondary" className="absolute -top-2 -left-2 min-w-5 h-5 flex items-center justify-center">
                {unreadNotifications.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="appointments">פגישות</TabsTrigger>
          <TabsTrigger value="inventory">מלאי</TabsTrigger>
          <TabsTrigger value="messages">הודעות</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>כל ההתראות</CardTitle>
              <CardDescription>
                כל ההתראות והעדכונים שלך.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y rounded-md border">
                {allNotifications.length > 0 ? (
                  allNotifications.map(notification => (
                    <NotificationItem key={notification.id} notification={notification} />
                  ))
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-muted-foreground">אין התראות חדשות.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle>התראות פגישות</CardTitle>
              <CardDescription>
                התראות הקשורות לפגישות שלך.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y rounded-md border">
                {appointmentNotifications.length > 0 ? (
                  appointmentNotifications.map(notification => (
                    <NotificationItem key={notification.id} notification={notification} />
                  ))
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-muted-foreground">אין התראות חדשות לפגישות.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>התראות מלאי</CardTitle>
              <CardDescription>
                התראות על מלאי נמוך או פריטים שאזלו.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y rounded-md border">
                {inventoryNotifications.length > 0 ? (
                  inventoryNotifications.map(notification => (
                    <NotificationItem key={notification.id} notification={notification} />
                  ))
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-muted-foreground">אין התראות מלאי חדשות.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle>הודעות</CardTitle>
              <CardDescription>
                הודעות מלקוחות וחברי צוות.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y rounded-md border">
                {messageNotifications.length > 0 ? (
                  messageNotifications.map(notification => (
                    <NotificationItem key={notification.id} notification={notification} />
                  ))
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-muted-foreground">אין הודעות חדשות.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Notifications;
