
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const prefs = await getNotificationPreferences();
        setPreferences(prefs);
      } catch (error) {
        console.error('Error fetching preferences:', error);
        toast({
          title: "שגיאה",
          description: "לא ניתן היה לטעון את הגדרות ההתראות",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, [toast]);

  const handleSave = async () => {
    if (!preferences) return;

    setSaving(true);
    try {
      await upsertNotificationPreferences(preferences);
      toast({
        title: "נשמר בהצלחה",
        description: "הגדרות ההתראות עודכנו",
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: "שגיאה",
        description: "לא ניתן היה לשמור את ההגדרות",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const updatePreference = (key: keyof NotificationPreferences, value: boolean) => {
    if (!preferences) return;
    setPreferences({ ...preferences, [key]: value });
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
      <CardContent className="space-y-6">
        {/* Channel Preferences */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">ערוצי תקשורת</h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-4 w-4 text-green-600" />
              <Label htmlFor="whatsapp">וואטסאפ</Label>
            </div>
            <Switch
              id="whatsapp"
              checked={preferences.whatsapp_enabled}
              onCheckedChange={(checked) => updatePreference('whatsapp_enabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-blue-600" />
              <Label htmlFor="sms">SMS</Label>
            </div>
            <Switch
              id="sms"
              checked={preferences.sms_enabled}
              onCheckedChange={(checked) => updatePreference('sms_enabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-gray-600" />
              <Label htmlFor="email">אימייל</Label>
            </div>
            <Switch
              id="email"
              checked={preferences.email_enabled}
              onCheckedChange={(checked) => updatePreference('email_enabled', checked)}
            />
          </div>
        </div>

        {/* Notification Types */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">סוגי התראות</h3>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="appointment-reminders">תזכורות לפגישות</Label>
            <Switch
              id="appointment-reminders"
              checked={preferences.appointment_reminders_enabled}
              onCheckedChange={(checked) => updatePreference('appointment_reminders_enabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="daily-summary">סיכום יומי</Label>
            <Switch
              id="daily-summary"
              checked={preferences.daily_summary_enabled}
              onCheckedChange={(checked) => updatePreference('daily_summary_enabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="expense-reminder">תזכורת הוצאות</Label>
            <Switch
              id="expense-reminder"
              checked={preferences.expense_reminder_enabled}
              onCheckedChange={(checked) => updatePreference('expense_reminder_enabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="appointment-changes">שינויים בפגישות</Label>
            <Switch
              id="appointment-changes"
              checked={preferences.appointment_changes_enabled}
              onCheckedChange={(checked) => updatePreference('appointment_changes_enabled', checked)}
            />
          </div>
        </div>

        <Button onClick={handleSave} disabled={saving} className="w-full">
          {saving ? 'שומר...' : 'שמור הגדרות'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
