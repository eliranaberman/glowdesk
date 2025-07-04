import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { MessageSquare, Settings, Bell, FileText } from 'lucide-react';

interface WhatsAppSettings {
  id?: string;
  business_whatsapp_number: string;
  business_name: string;
  business_address: string;
  preferred_send_time: string;
  reminder_hours_before: number;
  timezone: string;
  auto_reminders_enabled: boolean;
  confirmation_required: boolean;
}

interface MessageTemplate {
  id?: string;
  template_type: string;
  template_name: string;
  content: string;
  is_default: boolean;
}

const WhatsAppSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<WhatsAppSettings>({
    business_whatsapp_number: '',
    business_name: '',
    business_address: '',
    preferred_send_time: '09:00',
    reminder_hours_before: 24,
    timezone: 'Asia/Jerusalem',
    auto_reminders_enabled: true,
    confirmation_required: true,
  });
  
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      loadSettings();
      loadTemplates();
    }
  }, [user]);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('user_whatsapp_settings')
        .select('*')
        .eq('user_id', user!.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading settings:', error);
        toast.error('שגיאה בטעינת ההגדרות');
        return;
      }

      if (data) {
        setSettings({
          ...data,
          preferred_send_time: data.preferred_send_time?.substring(0, 5) || '09:00'
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('שגיאה בטעינת ההגדרות');
    } finally {
      setLoading(false);
    }
  };

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('message_templates')
        .select('*')
        .eq('user_id', user!.id)
        .order('template_type', { ascending: true });

      if (error) {
        console.error('Error loading templates:', error);
        return;
      }

      setTemplates(data || []);
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('user_whatsapp_settings')
        .upsert({
          ...settings,
          user_id: user!.id,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving settings:', error);
        toast.error('שגיאה בשמירת ההגדרות');
        return;
      }

      toast.success('ההגדרות נשמרו בהצלחה');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('שגיאה בשמירת ההגדרות');
    } finally {
      setSaving(false);
    }
  };

  const saveTemplate = async (template: MessageTemplate) => {
    try {
      const { error } = await supabase
        .from('message_templates')
        .upsert({
          ...template,
          user_id: user!.id,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving template:', error);
        toast.error('שגיאה בשמירת התבנית');
        return;
      }

      toast.success('התבנית נשמרה בהצלחה');
      loadTemplates();
      setSelectedTemplate(null);
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('שגיאה בשמירת התבנית');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">טוען הגדרות...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <MessageSquare className="h-8 w-8" />
          הגדרות WhatsApp
        </h1>
        <p className="text-muted-foreground mt-2">
          נהלי את הגדרות WhatsApp של העסק שלך ותבניות ההודעות
        </p>
      </div>

      <Tabs defaultValue="settings" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            הגדרות כלליות
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            תבניות הודעות
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            התראות
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>פרטי העסק</CardTitle>
              <CardDescription>
                הגדרי את פרטי העסק שלך עבור הודעות WhatsApp
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="business_name">שם העסק</Label>
                  <Input
                    id="business_name"
                    value={settings.business_name}
                    onChange={(e) => setSettings({...settings, business_name: e.target.value})}
                    placeholder="לדוגמה: סלון יופי רחל"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business_whatsapp_number">מספר WhatsApp של העסק</Label>
                  <Input
                    id="business_whatsapp_number"
                    value={settings.business_whatsapp_number}
                    onChange={(e) => setSettings({...settings, business_whatsapp_number: e.target.value})}
                    placeholder="לדוגמה: 0501234567"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="business_address">כתובת העסק</Label>
                <Input
                  id="business_address"
                  value={settings.business_address}
                  onChange={(e) => setSettings({...settings, business_address: e.target.value})}
                  placeholder="לדוגמה: רחוב הרצל 1, תל אביב"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="preferred_send_time">שעת שליחה מועדפת</Label>
                  <Input
                    id="preferred_send_time"
                    type="time"
                    value={settings.preferred_send_time}
                    onChange={(e) => setSettings({...settings, preferred_send_time: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reminder_hours_before">שעות לפני התור לתזכורת</Label>
                  <Input
                    id="reminder_hours_before"
                    type="number"
                    value={settings.reminder_hours_before}
                    onChange={(e) => setSettings({...settings, reminder_hours_before: parseInt(e.target.value)})}
                    min="1"
                    max="168"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>תזכורות אוטומטיות</Label>
                  <p className="text-sm text-muted-foreground">
                    שלח תזכורות אוטומטיות ללקוחות
                  </p>
                </div>
                <Switch
                  checked={settings.auto_reminders_enabled}
                  onCheckedChange={(checked) => setSettings({...settings, auto_reminders_enabled: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>דרישת אישור</Label>
                  <p className="text-sm text-muted-foreground">
                    בקש מהלקוחות לאשר את התור
                  </p>
                </div>
                <Switch
                  checked={settings.confirmation_required}
                  onCheckedChange={(checked) => setSettings({...settings, confirmation_required: checked})}
                />
              </div>

              <Button onClick={saveSettings} disabled={saving}>
                {saving ? 'שומר...' : 'שמור הגדרות'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>תבניות הודעות</CardTitle>
                <CardDescription>
                  נהלי את תבניות ההודעות שלך עבור תזכורות ואישורים
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {['reminder', 'confirmation', 'cancellation'].map((type) => {
                    const template = templates.find(t => t.template_type === type && t.is_default);
                    const typeNames = {
                      reminder: 'תזכורת תור',
                      confirmation: 'בקשת אישור',
                      cancellation: 'אישור ביטול'
                    };
                    
                    return (
                      <div key={type} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium">{typeNames[type as keyof typeof typeNames]}</h3>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedTemplate(template || {
                              template_type: type,
                              template_name: `תבנית ${typeNames[type as keyof typeof typeNames]}`,
                              content: '',
                              is_default: true
                            })}
                          >
                            עריכה
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {template?.content.substring(0, 100)}...
                        </p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {selectedTemplate && (
              <Card>
                <CardHeader>
                  <CardTitle>עריכת תבנית</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="template_name">שם התבנית</Label>
                    <Input
                      id="template_name"
                      value={selectedTemplate.template_name}
                      onChange={(e) => setSelectedTemplate({
                        ...selectedTemplate,
                        template_name: e.target.value
                      })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="template_content">תוכן ההודעה</Label>
                    <Textarea
                      id="template_content"
                      value={selectedTemplate.content}
                      onChange={(e) => setSelectedTemplate({
                        ...selectedTemplate,
                        content: e.target.value
                      })}
                      rows={6}
                      placeholder="השתמשי במשתנים כמו {customer_name}, {date}, {time}, {service}, {address}"
                    />
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    <p><strong>משתנים זמינים:</strong></p>
                    <p>• {'{customer_name}'} - שם הלקוח</p>
                    <p>• {'{date}'} - תאריך התור</p>
                    <p>• {'{time}'} - שעת התור</p>
                    <p>• {'{service}'} - סוג השירות</p>
                    <p>• {'{address}'} - כתובת העסק</p>
                    <p>• {'{business_name}'} - שם העסק</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={() => saveTemplate(selectedTemplate)}>
                      שמור תבנית
                    </Button>
                    <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                      ביטול
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>יומן התראות</CardTitle>
              <CardDescription>
                עקבי אחר ההודעות שנשלחו והתגובות שהתקבלו
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                יומן ההתראות יהיה זמין בקרוב...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WhatsAppSettings;