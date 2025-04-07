
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Send, Users, FileText, ArrowRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const MarketingMessages = () => {
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [customMessage, setCustomMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Message templates
  const templates = [
    { 
      id: "welcome", 
      name: "הודעת ברוכים הבאים", 
      content: "היי [שם], תודה שבחרת בנו! נשמח לראות אותך שוב בקרוב."
    },
    { 
      id: "followup", 
      name: "הודעת מעקב אחרי טיפול", 
      content: "היי [שם], איך את מרגישה עם הטיפול? נשמח לשמוע ממך!"
    },
    { 
      id: "comeback", 
      name: "הזמנה לחזור", 
      content: "היי [שם], מתגעגעים אלייך! רוצה לקבוע תור לטיפול הבא?"
    },
    { 
      id: "birthday", 
      name: "הודעת יום הולדת", 
      content: "היי [שם], יום הולדת שמח! קבלי 10% הנחה בתור ליום ההולדת שלך."
    },
    { 
      id: "promotion", 
      name: "הודעת מבצע", 
      content: "היי [שם], יש לנו מבצע מיוחד! קבלי 20% הנחה על הטיפול הבא שלך בהזמנה עד סוף החודש."
    }
  ];

  // Customer groups
  const customerGroups = [
    { id: "all", name: "כל הלקוחות", count: 176 },
    { id: "regular", name: "לקוחות קבועים", count: 84 },
    { id: "new", name: "לקוחות חדשים", count: 32 },
    { id: "inactive", name: "לקוחות לא פעילים", count: 60 },
    { id: "birthday", name: "ימי הולדת החודש", count: 14 },
  ];

  // Recent campaigns
  const recentCampaigns = [
    { id: "1", name: "מבצע סוף החודש", sentTo: 120, opened: 76, date: "28/03/2025" },
    { id: "2", name: "הזמנה לחזור", sentTo: 45, opened: 22, date: "15/03/2025" },
    { id: "3", name: "ברכות ליום האישה", sentTo: 150, opened: 112, date: "08/03/2025" },
  ];

  const handleSendMessage = () => {
    const template = templates.find(t => t.id === selectedTemplate);
    const group = customerGroups.find(g => g.id === selectedGroup);
    
    if (!template || !group) {
      toast.error("נא לבחור תבנית וקבוצת לקוחות");
      return;
    }

    toast.success(`נשלח "${template.name}" ל-${group.count} לקוחות`);
    setDialogOpen(false);
  };

  const handleCustomMessage = () => {
    if (!customMessage || !selectedGroup) {
      toast.error("נא להזין הודעה ולבחור קבוצת לקוחות");
      return;
    }

    const group = customerGroups.find(g => g.id === selectedGroup);
    toast.success(`הודעה אישית נשלחה ל-${group?.count} לקוחות`);
    setCustomMessage("");
    setDialogOpen(false);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center">
              <Send className="h-5 w-5 ml-2 text-primary" />
              הודעות שיווקיות
            </CardTitle>
            <CardDescription>
              שליחת עדכונים ומבצעים ללקוחות
            </CardDescription>
          </div>
          <Link to="/marketing">
            <Button variant="ghost" size="sm" className="gap-1">
              לניהול קמפיינים
              <ArrowRight className="h-4 w-4 mr-1" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="templates" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="templates">תבניות מוכנות</TabsTrigger>
            <TabsTrigger value="campaigns">קמפיינים קודמים</TabsTrigger>
          </TabsList>
          
          <TabsContent value="templates" className="space-y-4">
            <div className="border rounded-lg p-4 space-y-4">
              <h3 className="font-medium mb-2">תבניות זמינות</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {templates.slice(0, 4).map((template) => (
                  <div
                    key={template.id}
                    className="border rounded-lg p-3 cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => {
                      setSelectedTemplate(template.id);
                      setDialogOpen(true);
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{template.name}</h4>
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{template.content}</p>
                  </div>
                ))}
              </div>

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>שליחת הודעה שיווקית</DialogTitle>
                    <DialogDescription>
                      בחר למי לשלוח את ההודעה
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    {selectedTemplate && (
                      <div className="border rounded-lg p-3 bg-muted/20">
                        <h4 className="font-medium text-sm mb-2">
                          {templates.find(t => t.id === selectedTemplate)?.name}
                        </h4>
                        <p className="text-sm">
                          {templates.find(t => t.id === selectedTemplate)?.content}
                        </p>
                      </div>
                    )}
                    {!selectedTemplate && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">הודעה מותאמת אישית</p>
                        <Textarea
                          placeholder="הזן את ההודעה שלך כאן..."
                          value={customMessage}
                          onChange={(e) => setCustomMessage(e.target.value)}
                          rows={4}
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                      <p className="text-sm font-medium">שלח ל:</p>
                      <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                        <SelectTrigger>
                          <SelectValue placeholder="בחר קבוצת לקוחות" />
                        </SelectTrigger>
                        <SelectContent>
                          {customerGroups.map((group) => (
                            <SelectItem key={group.id} value={group.id}>
                              {group.name} ({group.count})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>
                      ביטול
                    </Button>
                    <Button onClick={selectedTemplate ? handleSendMessage : handleCustomMessage}>
                      <Send className="ml-2 h-4 w-4" />
                      שלח הודעה
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <FileText className="h-4 w-4 ml-2" />
                    יצירת תבנית חדשה
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>יצירת תבנית חדשה</DialogTitle>
                    <DialogDescription>
                      צור תבנית הודעה מותאמת אישית
                    </DialogDescription>
                  </DialogHeader>
                  {/* Dialog content for creating a new template */}
                </DialogContent>
              </Dialog>
            </div>
            
            <Button className="w-full">
              <Send className="h-4 w-4 ml-2" />
              שלח הודעה לכל הלקוחות
            </Button>
          </TabsContent>
          
          <TabsContent value="campaigns" className="space-y-4">
            <div className="space-y-3">
              {recentCampaigns.map((campaign) => (
                <div key={campaign.id} className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium">{campaign.name}</p>
                    <div className="flex items-center mt-1">
                      <Users className="h-3 w-3 text-muted-foreground ml-1" />
                      <span className="text-xs text-muted-foreground">{campaign.sentTo} נשלחו</span>
                      <span className="text-xs text-muted-foreground mx-1">•</span>
                      <span className="text-xs text-green-600">{campaign.opened} נפתחו</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{campaign.date}</p>
                    <Button variant="ghost" size="sm" className="mt-1">
                      שלח שוב
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="outline" className="w-full">
              <ArrowRight className="h-4 w-4 ml-2" />
              צפה בכל הקמפיינים
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MarketingMessages;
