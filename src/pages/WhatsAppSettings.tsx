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
import { MessageSquare, Settings, Bell, FileText, Phone, MapPin, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 sm:p-6 max-w-5xl">
        {/* Header Section - Centered */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl">
              <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              הגדרות WhatsApp
            </h1>
          </div>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            נהלי את הגדרות WhatsApp של העסק שלך ותבניות ההודעות בצורה מותאמת ונוחה
          </p>
        </div>

        <Tabs defaultValue="settings" className="space-y-6">
          {/* RTL Tabs - Right to Left Order */}
          <TabsList className="grid w-full grid-cols-3 h-12 sm:h-14 bg-muted/50 p-1 rounded-xl">
            <TabsTrigger 
              value="settings" 
              className="flex items-center justify-center gap-2 text-sm sm:text-base font-medium rounded-lg transition-all duration-200 data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <Settings className="h-4 w-4" />
              הגדרות כלליות
            </TabsTrigger>
            <TabsTrigger 
              value="templates" 
              className="flex items-center justify-center gap-2 text-sm sm:text-base font-medium rounded-lg transition-all duration-200 data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <FileText className="h-4 w-4" />
              תבניות הודעות
            </TabsTrigger>
            <TabsTrigger 
              value="notifications" 
              className="flex items-center justify-center gap-2 text-sm sm:text-base font-medium rounded-lg transition-all duration-200 data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <Bell className="h-4 w-4" />
              התראות
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="space-y-6">
            {/* Business Details Card */}
            <Card className="shadow-sm border-border/50">
              <CardHeader className="text-center pb-4">
                <CardTitle className="flex items-center justify-center gap-2 text-lg font-semibold">
                  <Settings className="h-5 w-5 text-primary" />
                  פרטי העסק
                </CardTitle>
                <CardDescription className="text-center">
                  הגדרי את פרטי העסק שלך עבור הודעות WhatsApp
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Business Name & WhatsApp Number - Centered Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {/* Business Name */}
                  <div className="space-y-2">
                    <Label htmlFor="business_name" className="flex items-center justify-center gap-2 text-sm font-medium">
                      <Settings className="h-4 w-4 text-muted-foreground" />
                      שם העסק
                    </Label>
                    <Input
                      id="business_name"
                      value={settings.business_name}
                      onChange={(e) => setSettings({...settings, business_name: e.target.value})}
                      placeholder="לדוגמה: סלון יופי רחל"
                      className="text-center h-11 bg-background border-border/70 focus:border-primary transition-colors"
                    />
                  </div>
                  
                  {/* WhatsApp Number */}
                  <div className="space-y-2">
                    <Label htmlFor="business_whatsapp_number" className="flex items-center justify-center gap-2 text-sm font-medium">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      מספר WhatsApp של העסק
                    </Label>
                    <Input
                      id="business_whatsapp_number"
                      value={settings.business_whatsapp_number}
                      onChange={(e) => setSettings({...settings, business_whatsapp_number: e.target.value})}
                      placeholder="לדוגמה: 0501234567"
                      className="text-center h-11 bg-background border-border/70 focus:border-primary transition-colors"
                      dir="ltr"
                    />
                  </div>
                </div>
                
                {/* Business Address - Full Width */}
                <div className="space-y-2">
                  <Label htmlFor="business_address" className="flex items-center justify-center gap-2 text-sm font-medium">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    כתובת העסק
                  </Label>
                  <Input
                    id="business_address"
                    value={settings.business_address}
                    onChange={(e) => setSettings({...settings, business_address: e.target.value})}
                    placeholder="לדוגמה: רחוב הרצל 1, תל אביב"
                    className="text-center h-11 bg-background border-border/70 focus:border-primary transition-colors"
                  />
                </div>

                {/* Time Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="preferred_send_time" className="flex items-center justify-center gap-2 text-sm font-medium">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      שעת שליחה מועדפת
                    </Label>
                    <Input
                      id="preferred_send_time"
                      type="time"
                      value={settings.preferred_send_time}
                      onChange={(e) => setSettings({...settings, preferred_send_time: e.target.value})}
                      className="text-center h-11 bg-background border-border/70 focus:border-primary transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reminder_hours_before" className="flex items-center justify-center gap-2 text-sm font-medium">
                      <AlertCircle className="h-4 w-4 text-muted-foreground" />
                      שעות לפני התור לתזכורת
                    </Label>
                    <Input
                      id="reminder_hours_before"
                      type="number"
                      value={settings.reminder_hours_before}
                      onChange={(e) => setSettings({...settings, reminder_hours_before: parseInt(e.target.value)})}
                      min="1"
                      max="168"
                      className="text-center h-11 bg-background border-border/70 focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                {/* Toggle Settings - Centered Layout */}
                <div className="space-y-4 pt-4 border-t border-border/50">
                  {/* Auto Reminders Toggle */}
                  <div className="flex items-center justify-center p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <Bell className="h-4 w-4 text-primary" />
                          <Label className="text-sm font-medium cursor-pointer">תזכורות אוטומטיות</Label>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          שלח תזכורות אוטומטיות ללקוחות לפני התורים
                        </p>
                      </div>
                      <Switch
                        checked={settings.auto_reminders_enabled}
                        onCheckedChange={(checked) => setSettings({...settings, auto_reminders_enabled: checked})}
                      />
                    </div>
                  </div>

                  {/* Confirmation Required Toggle */}
                  <div className="flex items-center justify-center p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                          <Label className="text-sm font-medium cursor-pointer">דרישת אישור</Label>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          בקש מהלקוחות לאשר את התור בהודעת התזכורת
                        </p>
                      </div>
                      <Switch
                        checked={settings.confirmation_required}
                        onCheckedChange={(checked) => setSettings({...settings, confirmation_required: checked})}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            {/* Message Templates Card */}
            <Card className="shadow-sm border-border/50">
              <CardHeader className="text-center pb-4">
                <CardTitle className="flex items-center justify-center gap-2 text-lg font-semibold">
                  <FileText className="h-5 w-5 text-primary" />
                  תבניות הודעות
                </CardTitle>
                <CardDescription className="text-center">
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
                    const icons = {
                      reminder: Bell,
                      confirmation: CheckCircle2,
                      cancellation: AlertCircle
                    };
                    const IconComponent = icons[type as keyof typeof icons];
                    
                    return (
                      <div key={type} className="border border-border/50 rounded-xl p-4 hover:bg-muted/30 transition-colors">
                        <div className="flex justify-center items-center mb-3">
                          <div className="flex items-center gap-2 text-center">
                            <IconComponent className="h-5 w-5 text-primary" />
                            <h3 className="font-medium text-foreground">{typeNames[type as keyof typeof typeNames]}</h3>
                          </div>
                        </div>
                        <div className="text-center mb-3">
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {template?.content ? `${template.content.substring(0, 80)}...` : 'לא הוגדרה תבנית עדיין'}
                          </p>
                        </div>
                        <div className="flex justify-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedTemplate(template || {
                              template_type: type,
                              template_name: `תבנית ${typeNames[type as keyof typeof typeNames]}`,
                              content: '',
                              is_default: true
                            })}
                            className="h-9 px-4 text-sm font-medium bg-background border-border/70 hover:bg-muted hover:border-primary transition-all"
                          >
                            עריכה
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Template Editor Modal */}
            {selectedTemplate && (
              <Card className="shadow-lg border-primary/20 bg-gradient-to-br from-background to-muted/30">
                <CardHeader className="text-center pb-4 border-b border-border/50">
                  <CardTitle className="flex items-center justify-center gap-2 text-lg font-semibold">
                    <FileText className="h-5 w-5 text-primary" />
                    עריכת תבנית
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="space-y-2">
                    <Label htmlFor="template_name" className="flex items-center justify-center gap-2 text-sm font-medium">
                      <Settings className="h-4 w-4 text-muted-foreground" />
                      שם התבנית
                    </Label>
                    <Input
                      id="template_name"
                      value={selectedTemplate.template_name}
                      onChange={(e) => setSelectedTemplate({
                        ...selectedTemplate,
                        template_name: e.target.value
                      })}
                      className="text-center h-11 bg-background border-border/70 focus:border-primary transition-colors"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="template_content" className="flex items-center justify-center gap-2 text-sm font-medium">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      תוכן ההודעה
                    </Label>
                    <Textarea
                      id="template_content"
                      value={selectedTemplate.content}
                      onChange={(e) => setSelectedTemplate({
                        ...selectedTemplate,
                        content: e.target.value
                      })}
                      rows={6}
                      placeholder="השתמשי במשתנים כמו {customer_name}, {date}, {time}, {service}, {address}"
                      className="text-center resize-none bg-background border-border/70 focus:border-primary transition-colors"
                    />
                  </div>
                  
                  {/* Variables Guide */}
                  <div className="p-4 rounded-lg bg-muted/40 border border-border/30 text-center">
                    <p className="font-medium text-sm mb-3 text-foreground">משתנים זמינים:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <p>• <code className="bg-background px-1 py-0.5 rounded text-foreground">{'{customer_name}'}</code> - שם הלקוח</p>
                      <p>• <code className="bg-background px-1 py-0.5 rounded text-foreground">{'{date}'}</code> - תאריך התור</p>
                      <p>• <code className="bg-background px-1 py-0.5 rounded text-foreground">{'{time}'}</code> - שעת התור</p>
                      <p>• <code className="bg-background px-1 py-0.5 rounded text-foreground">{'{service}'}</code> - סוג השירות</p>
                      <p>• <code className="bg-background px-1 py-0.5 rounded text-foreground">{'{address}'}</code> - כתובת העסק</p>
                      <p>• <code className="bg-background px-1 py-0.5 rounded text-foreground">{'{business_name}'}</code> - שם העסק</p>
                    </div>
                  </div>
                  
                  {/* Action Buttons - Centered */}
                  <div className="flex justify-center gap-3 pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedTemplate(null)}
                      className="h-11 px-6 bg-background border-border/70 hover:bg-muted hover:border-primary transition-all"
                    >
                      ביטול
                    </Button>
                    <Button 
                      onClick={() => saveTemplate(selectedTemplate)}
                      className="h-11 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all shadow-sm hover:shadow-md"
                    >
                      שמור תבנית
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            {/* Notifications Log Card */}
            <Card className="shadow-sm border-border/50">
              <CardHeader className="text-center pb-4">
                <CardTitle className="flex items-center justify-center gap-2 text-lg font-semibold">
                  <Bell className="h-5 w-5 text-primary" />
                  יומן התראות
                </CardTitle>
                <CardDescription className="text-center">
                  עקבי אחר ההודעות שנשלחו והתגובות שהתקבלו
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                    <Bell className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground text-sm">
                    יומן ההתראות יהיה זמין בקרוב...
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Prominent Save Button - Fixed at Bottom */}
          <div className="sticky bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t border-border/50 p-4 mt-8">
            <div className="max-w-5xl mx-auto">
              <Button 
                onClick={saveSettings} 
                disabled={saving}
                size="lg"
                className="w-full sm:w-auto sm:min-w-[200px] mx-auto block h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
              >
                {saving ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    שומר הגדרות...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    שמור הגדרות
                  </div>
                )}
              </Button>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default WhatsAppSettings;