
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Send, Edit, Trash, Copy, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const MarketingTemplates = () => {
  const [activeTab, setActiveTab] = useState('existing');
  const [newTemplate, setNewTemplate] = useState({ name: '', content: '' });
  const { toast } = useToast();

  // Sample template data
  const templates = [
    { 
      id: '1', 
      name: 'תזכורת לתור', 
      content: 'שלום {{שם}}! רק להזכיר לך על התור שלך ל{{טיפול}} מחר בשעה {{שעה}}. מחכים לראותך!',
      usageCount: 32
    },
    { 
      id: '2', 
      name: 'הצעה מיוחדת', 
      content: 'היי {{שם}}, בגלל שאת לקוחה נאמנה, אנחנו מציעים לך {{הנחה}}% הנחה על הטיפול הבא! להזמנת תור: {{לינק}}',
      usageCount: 18
    },
    { 
      id: '3', 
      name: 'יום הולדת', 
      content: '{{שם}} יקרה! מזל טוב ליום הולדתך! כמתנת יום הולדת מאיתנו, קבלי {{הטבה}}. נשמח לראותך בקרוב!',
      usageCount: 24
    },
    { 
      id: '4', 
      name: 'חגים', 
      content: '{{שם}} יקרה, מאחלים לך חג {{שם_החג}} שמח! לרגל החג אנו מציעים {{הנחה}}% הנחה על כל הטיפולים!',
      usageCount: 15
    },
  ];

  const handleCreateTemplate = () => {
    if (newTemplate.name.trim() === '' || newTemplate.content.trim() === '') {
      toast({
        title: "שגיאה",
        description: "נא למלא את כל השדות",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "התבנית נוצרה בהצלחה",
      description: `התבנית "${newTemplate.name}" נשמרה במערכת`,
    });
    
    setNewTemplate({ name: '', content: '' });
    setActiveTab('existing');
  };

  const handleSendTemplate = (templateName: string) => {
    toast({
      title: "נשלח בהצלחה",
      description: `התבנית "${templateName}" נשלחה ללקוחות`,
    });
  };

  const handleDeleteTemplate = (templateId: string, templateName: string) => {
    toast({
      title: "התבנית נמחקה",
      description: `התבנית "${templateName}" הוסרה מהמערכת`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">תבניות הודעות</h1>
        <p className="text-muted-foreground">
          יצירה וניהול של תבניות הודעות לתקשורת עם לקוחות
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="h-5 w-5 ml-2" />
            תבניות הודעות
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="existing" className="text-right">תבניות קיימות</TabsTrigger>
              <TabsTrigger value="create" className="text-right">יצירת תבנית חדשה</TabsTrigger>
            </TabsList>
            
            <TabsContent value="existing" className="space-y-4">
              {templates.map((template) => (
                <div key={template.id} className="border rounded-xl p-4 bg-card hover:bg-accent/10">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-medium flex items-center">
                      {template.name}
                      <span className="text-xs text-muted-foreground mr-2">
                        ({template.usageCount} שימושים)
                      </span>
                    </h3>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive" 
                        onClick={() => handleDeleteTemplate(template.id, template.name)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm my-3 border-y py-3">{template.content}</p>
                  <div className="flex justify-end">
                    <Button 
                      variant="soft" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => handleSendTemplate(template.name)}
                    >
                      <Send className="h-3.5 w-3.5 ml-1.5" />
                      שלח הודעה
                    </Button>
                  </div>
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="create" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label htmlFor="template-name" className="block text-sm font-medium mb-1">
                    שם התבנית
                  </label>
                  <Input 
                    id="template-name" 
                    placeholder="לדוגמה: תזכורת לתור, הצעה מיוחדת" 
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <label htmlFor="template-content" className="block text-sm font-medium mb-1">
                    תוכן ההודעה
                  </label>
                  <p className="text-xs text-muted-foreground mb-2">
                    השתמשי במשתנים דינמיים כמו {{'{שם}'}} או {{'{טיפול}'}} שיוחלפו אוטומטית בערכים אמיתיים
                  </p>
                  <Textarea 
                    id="template-content" 
                    placeholder="תוכן ההודעה..."
                    rows={6}
                    value={newTemplate.content}
                    onChange={(e) => setNewTemplate({...newTemplate, content: e.target.value})}
                  />
                </div>
                
                <div className="flex justify-end pt-4">
                  <Button onClick={handleCreateTemplate}>
                    <PlusCircle className="h-4 w-4 ml-2" />
                    צור תבנית חדשה
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketingTemplates;
