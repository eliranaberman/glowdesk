import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Bell, MessageSquare, Mail, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getNotificationPreferences, upsertNotificationPreferences, NotificationPreferences } from '@/services/notificationPreferencesService';
const NotificationSettings = () => {
  const {
    toast
  } = useToast();
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
          variant: "destructive"
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
    return <Card>
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
      </Card>;
  }
  if (!preferences) {
    return null;
  }
  return <Card>
      
      
    </Card>;
};
export default NotificationSettings;