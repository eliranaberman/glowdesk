
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Settings, Bell, MessageSquare, Mail, Phone } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { getNotificationPreferences, upsertNotificationPreferences } from '@/services/notificationPreferencesService';

const NotificationSettings = () => {
  const queryClient = useQueryClient();
  const [preferences, setPreferences] = useState({
    whatsapp_enabled: true,
    sms_enabled: false,
    email_enabled: true,
    appointment_reminders_enabled: true,
    daily_summary_enabled: true,
    expense_reminder_enabled: true,
    appointment_changes_enabled: true,
  });

  const { data: userPreferences, isLoading } = useQuery({
    queryKey: ['notification-preferences'],
    queryFn: getNotificationPreferences
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: upsertNotificationPreferences,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-preferences'] });
      toast({
        title: 'הגדרות נשמרו',
        description: 'העדפות ההתראות עודכנו בהצלחה',
      });
    },
    onError: (error) => {
      toast({
        title: 'שגיאה',
        description: 'לא ניתן היה לשמור את ההגדרות',
        variant: 'destructive',
      });
    }
  });

  useEffect(() => {
    if (userPreferences) {
      setPreferences({
        whatsapp_enabled: userPreferences.whatsapp_enabled,
        sms_enabled: userPreferences.sms_enabled,
        email_enabled: userPreferences.email_enabled,
        appointment_reminders_enabled: userPreferences.appointment_reminders_enabled,
        daily_summary_enabled: userPreferences.daily_summary_enabled,
        expense_reminder_enabled: userPreferences.expense_reminder_enabled,
        appointment_changes_enabled: userPreferences.appointment_changes_enabled,
      });
    }
  }, [userPreferences]);

  const handlePreferenceChange = (key: string, value: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    updatePreferencesMutation.mutate(preferences);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          הגדרות התראות
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Communication Channels */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">אמצעי תקשורת</h3>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="whatsapp" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-green-600" />
              וואטסאפ
            </Label>
            <Switch
              id="whatsapp"
              checked={preferences.whatsapp_enabled}
              onCheckedChange={(checked) => handlePreferenceChange('whatsapp_enabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="sms" className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-blue-600" />
              SMS
            </Label>
            <Switch
              id="sms"
              checked={preferences.sms_enabled}
              onCheckedChange={(checked) => handlePreferenceChange('sms_enabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-red-600" />
              אימייל
            </Label>
            <Switch
              id="email"
              checked={preferences.email_enabled}
              onCheckedChange={(checked) => handlePreferenceChange('email_enabled', checked)}
            />
          </div>
        </div>

        {/* Notification Types */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">סוגי התראות</h3>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="reminders" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              תזכורות לפגישות (24 שעות מראש)
            </Label>
            <Switch
              id="reminders"
              checked={preferences.appointment_reminders_enabled}
              onCheckedChange={(checked) => handlePreferenceChange('appointment_reminders_enabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="daily-summary">סיכום יומי</Label>
            <Switch
              id="daily-summary"
              checked={preferences.daily_summary_enabled}
              onCheckedChange={(checked) => handlePreferenceChange('daily_summary_enabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="expense-reminder">תזכורת להזנת הוצאות (שבועי)</Label>
            <Switch
              id="expense-reminder"
              checked={preferences.expense_reminder_enabled}
              onCheckedChange={(checked) => handlePreferenceChange('expense_reminder_enabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="appointment-changes">התראות על שינוי/ביטול תורים</Label>
            <Switch
              id="appointment-changes"
              checked={preferences.appointment_changes_enabled}
              onCheckedChange={(checked) => handlePreferenceChange('appointment_changes_enabled', checked)}
            />
          </div>
        </div>

        <Button 
          onClick={handleSave} 
          disabled={updatePreferencesMutation.isPending}
          className="w-full"
        >
          {updatePreferencesMutation.isPending ? 'שומר...' : 'שמור הגדרות'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
