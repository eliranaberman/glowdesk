
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, MessageSquare, Send, PlusCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const MarketingMessages = () => {
  const [activeTab, setActiveTab] = useState('templates');
  const { toast } = useToast();

  const handleSendToAll = () => {
    toast({
      title: "פעולה הושלמה",
      description: "ההודעה נשלחה לכל הלקוחות בהצלחה!",
    });
  };

  const handleCreate = () => {
    toast({
      title: "יצירת תבנית חדשה",
      description: "המערכת מעבירה אותך לעמוד יצירת תבנית חדשה...",
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center">
              <MessageSquare className="h-5 w-5 ml-2 text-primary" />
              הודעות שיווקיות
            </CardTitle>
          </div>
          <Link to="/marketing/templates">
            <Button variant="ghost" size="sm" className="gap-1">
              לכל התבניות
              <ArrowRight className="h-4 w-4 mr-1" />
            </Button>
          </Link>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="templates" className="text-right order-2">תבניות מוכנות</TabsTrigger>
            <TabsTrigger value="campaigns" className="text-right order-1">קמפיינים קודמים</TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-4">
            <div className="grid gap-3">
              {["תזכורת לתור", "הצעה מיוחדת", "יום הולדת", "חגים"].map((template) => (
                <div
                  key={template}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/10 transition-colors"
                >
                  <Button variant="soft" size="sm">
                    <Send className="h-3.5 w-3.5 ml-1" />
                    שלח
                  </Button>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-muted-foreground ml-2" />
                    <span>{template}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2 justify-end">
              <Button onClick={handleSendToAll} className="order-2">
                שליחת הודעה לכל הלקוחות
              </Button>
              <Button variant="outline" onClick={handleCreate} className="flex items-center gap-1 order-1">
                <PlusCircle className="h-4 w-4 ml-1" />
                יצירת תבנית חדשה
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-4">
            <div className="space-y-3">
              {[
                { name: "הנחה לחג פסח", date: "15/03/2025", opened: "68%", clicks: "42%" },
                { name: "תזכורת לקוחות לא פעילים", date: "02/03/2025", opened: "55%", clicks: "28%" },
                { name: "השקת מוצרים חדשים", date: "18/02/2025", opened: "72%", clicks: "38%" }
              ].map((campaign) => (
                <div
                  key={campaign.name}
                  className="p-3 border rounded-lg hover:bg-accent/10 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{campaign.name}</span>
                    <span className="text-xs text-muted-foreground">{campaign.date}</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>אחוז פתיחה: {campaign.opened}</span>
                    <span>אחוז לחיצות: {campaign.clicks}</span>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="outline" className="w-full">
              <Mail className="h-4 w-4 ml-2" />
              צפייה בכל הקמפיינים הקודמים
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MarketingMessages;
