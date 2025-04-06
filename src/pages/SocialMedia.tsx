
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Instagram, Facebook, MessageSquare, Plus, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const SocialMedia = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [connectedAccounts, setConnectedAccounts] = useState<{[key: string]: boolean}>({
    instagram: false,
    facebook: false,
    twitter: false,
    tiktok: false,
  });

  // Mock data for demonstration purposes
  const messages = [
    {
      id: 1,
      platform: "instagram",
      sender: "sarah_nails_fan",
      message: "היי, האם יש לך פנוי לפגישה ביום שלישי?",
      time: "10:23",
      read: false,
      avatar: "https://picsum.photos/seed/1/64",
    },
    {
      id: 2,
      platform: "facebook",
      sender: "מיכל כהן",
      message: "מחיר לבנייה מלאה + לק ג'ל?",
      time: "08:45",
      read: true,
      avatar: "https://picsum.photos/seed/2/64",
    },
    {
      id: 3,
      platform: "instagram",
      sender: "beauty_trends",
      message: "אהבתי את העיצוב האחרון שפרסמת! אפשר לקבוע תור?",
      time: "יום אתמול",
      read: true,
      avatar: "https://picsum.photos/seed/3/64",
    },
  ];

  const connectPlatform = (platform: string) => {
    // In a real implementation, this would open the OAuth flow
    // For demonstration, we're just toggling the state
    setConnectedAccounts(prev => ({
      ...prev,
      [platform]: !prev[platform]
    }));
  };

  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-between items-center">
        <Button variant="soft" size="sm" className="flex items-center gap-1">
          <Plus size={16} />
          חבר חשבון
        </Button>
        <h1 className="text-2xl font-medium">מדיה חברתית ושיווק</h1>
      </div>

      <Tabs defaultValue="dashboard" className="w-full" dir="rtl">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="dashboard">דשבורד</TabsTrigger>
          <TabsTrigger value="inbox">תיבת הודעות</TabsTrigger>
          <TabsTrigger value="posts">פרסום פוסטים</TabsTrigger>
          <TabsTrigger value="analytics">אנליטיקס</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg w-full text-center">פלטפורמות מחוברות</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-row-reverse justify-between items-center border-b pb-2">
                    <div className="text-center">
                      <span className="font-medium">אינסטגרם</span>
                    </div>
                    <Button 
                      variant={connectedAccounts.instagram ? "soft" : "outline"} 
                      className="gap-2"
                      onClick={() => connectPlatform("instagram")}
                    >
                      <Instagram size={16} />
                      {connectedAccounts.instagram ? "מחובר" : "חבר חשבון"}
                    </Button>
                  </div>
                  
                  <div className="flex flex-row-reverse justify-between items-center border-b pb-2">
                    <div className="text-center">
                      <span className="font-medium">פייסבוק</span>
                    </div>
                    <Button 
                      variant={connectedAccounts.facebook ? "soft" : "outline"} 
                      className="gap-2"
                      onClick={() => connectPlatform("facebook")}
                    >
                      <Facebook size={16} />
                      {connectedAccounts.facebook ? "מחובר" : "חבר חשבון"}
                    </Button>
                  </div>
                  
                  <div className="flex flex-row-reverse justify-between items-center border-b pb-2">
                    <div className="text-center">
                      <span className="font-medium">טיקטוק</span>
                    </div>
                    <Button variant="outline" className="gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 20l3-4 3 4M10 4.5h4c3.771 0 5.657 0 6.828 1.172C22 6.843 22 8.729 22 12.5s0 5.657-1.172 6.828C19.657 20.5 17.771 20.5 14 20.5h-4c-3.771 0-5.657 0-6.828-1.172C2 18.157 2 16.271 2 12.5s0-5.657 1.172-6.828C4.343 4.5 6.229 4.5 10 4.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      חבר חשבון
                    </Button>
                  </div>
                  
                  <div className="flex flex-row-reverse justify-between items-center pb-2">
                    <div className="text-center">
                      <span className="font-medium">טוויטר / X</span>
                    </div>
                    <Button variant="outline" className="gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      חבר חשבון
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-center pb-2">
                <CardTitle className="text-lg">סטטוס הודעות</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-row-reverse justify-between items-center">
                    <span className="font-medium">הודעות חדשות</span>
                    <Badge variant="soft">2 לא נקראו</Badge>
                  </div>
                  <div className="flex justify-between items-center text-center">
                    <span>1.2 שעות</span>
                    <span className="font-medium">זמן תגובה ממוצע</span>
                  </div>
                  <div className="flex justify-between items-center text-center">
                    <span>92%</span>
                    <span className="font-medium">שיעור מענה</span>
                  </div>
                  
                  <Button variant="warm" className="w-full mt-2">
                    <MessageSquare size={16} />
                    פתח תיבת הודעות
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Button variant="outline" size="sm">
                טען עוד
              </Button>
              <CardTitle className="text-lg mx-auto">הודעות אחרונות</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="flex gap-3 items-center border-b pb-3 last:border-0">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <img src={message.avatar} alt={message.sender} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col items-center flex-1 gap-1 text-center">
                      <div className="flex items-center gap-2 justify-center w-full">
                        {!message.read && (
                          <Badge variant="soft" className="h-2 w-2 p-0 rounded-full" />
                        )}
                        <span className="font-medium">{message.sender}</span>
                        <span className="text-sm text-muted-foreground">{message.time}</span>
                      </div>
                      <p className="text-sm">{message.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inbox Tab */}
        <TabsContent value="inbox">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">תיבת הודעות</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/40 rounded-lg p-8 text-center">
                <h3 className="text-lg font-medium mb-2">תיבת ההודעות תופיע כאן</h3>
                <p className="text-muted-foreground mb-4">חבר את חשבונות המדיה החברתית שלך כדי להתחיל</p>
                <Button variant="warm">
                  חבר חשבון
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Posts Tab */}
        <TabsContent value="posts">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <Button variant="soft">
                <Upload className="ml-2" size={16} />
                העלה מדיה
              </Button>
              <CardTitle className="mx-auto">פרסום פוסטים</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-center mb-1 text-sm">טקסט הפוסט</label>
                      <Textarea 
                        placeholder="הזן את הטקסט שלך כאן..." 
                        className="min-h-[120px]" 
                      />
                    </div>
                    <div>
                      <label className="block text-center mb-1 text-sm">האשטגים</label>
                      <Input placeholder="#nails #beauty #salon" />
                    </div>
                    <div>
                      <label className="block text-center mb-1 text-sm">מיקום</label>
                      <Input placeholder="הוסף מיקום (אופציונלי)" />
                    </div>
                    <div className="pt-2">
                      <label className="block text-center mb-2 text-sm">פלטפורמות לפרסום</label>
                      <div className="flex flex-wrap gap-2 justify-center">
                        <Badge variant="outline" className="cursor-pointer hover:bg-accent p-2">
                          טוויטר / X
                        </Badge>
                        <Badge variant="outline" className="cursor-pointer hover:bg-accent p-2">
                          טיקטוק
                        </Badge>
                        <Badge variant="warm" className="p-2">
                          פייסבוק
                        </Badge>
                        <Badge variant="soft" className="p-2">
                          אינסטגרם
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted/30 rounded-lg flex items-center justify-center p-4">
                  <div className="text-center">
                    <Upload size={32} className="mx-auto mb-2 text-muted-foreground" />
                    <p className="text-muted-foreground text-sm mb-2">גרור תמונות או וידאו לכאן</p>
                    <Button variant="outline" size="sm">בחר קבצים</Button>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between mt-6 pt-4 border-t">
                <Button variant="outline">
                  תזמן לפרסום
                </Button>
                <Button>
                  פרסם עכשיו
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">אנליטיקס</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/40 rounded-lg p-8 text-center">
                <h3 className="text-lg font-medium mb-2">האנליטיקס יופיע בקרוב</h3>
                <p className="text-muted-foreground">מידע על הביצועים של הפוסטים שלך יופיע כאן</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SocialMedia;
