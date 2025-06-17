
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Bell, MessageSquare, Mail, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getNotificationPreferences, upsertNotificationPreferences, NotificationPreferences } from '@/services/notificationPreferencesService';

const NotificationSettings = () => {
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPreferences = async () => {
      setLoading(true);
      try {
        const prefs = await getNotificationPreferences();
        setPreferences(prefs);
      } catch (error) {
        console.error('Error fetching preferences:', error);
        // Set default preferences if fetch fails
        setPreferences({
          email_appointments: true,
          sms_appointments: true,
          email_reminders: true,
          sms_reminders: false,
          email_marketing: false,
          sms_marketing: false,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, []);

  const handleSave = async () => {
    if (!preferences) return;
    
    setSaving(true);
    try {
      await upsertNotificationPreferences(preferences);
      toast({
        title: "נשמר בהצלחה",
        description: "הגדרות ההתראות עודכנו"
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: "שגיאה",
        description: "לא ניתן היה לשמור את ההגדרות",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const updatePreference = (key: keyof NotificationPreferences, value: boolean) => {
    if (!preferences) return;
    setPreferences({
      ...preferences,
      [key]: value
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            הגדרות התראות
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!preferences) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          הגדרות התראות
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-appointments" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              התראות אימייל לפגישות
            </Label>
            <Switch
              id="email-appointments"
              checked={preferences.email_appointments}
              onCheckedChange={(checked) => updatePreference('email_appointments', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="sms-appointments" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              התראות SMS לפגישות
            </Label>
            <Switch
              id="sms-appointments"
              checked={preferences.sms_appointments}
              onCheckedChange={(checked) => updatePreference('sms_appointments', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="email-reminders" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              תזכורות באימייל
            </Label>
            <Switch
              id="email-reminders"
              checked={preferences.email_reminders}
              onCheckedChange={(checked) => updatePreference('email_reminders', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="sms-reminders" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              תזכורות SMS
            </Label>
            <Switch
              id="sms-reminders"
              checked={preferences.sms_reminders}
              onCheckedChange={(checked) => updatePreference('sms_reminders', checked)}
            />
          </div>
        </div>

        <Button onClick={handleSave} disabled={saving} className="w-full">
          {saving ? "שומר..." : "שמור הגדרות"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
