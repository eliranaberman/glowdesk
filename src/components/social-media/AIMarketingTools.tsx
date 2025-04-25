import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Facebook, Instagram, MessageCircle, SendHorizonal, Sparkles, TrendingUp } from "lucide-react";

const AIMarketingTools = () => {
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [marketingGoal, setMarketingGoal] = useState("");
  const [platform, setPlatform] = useState("facebook");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string[]>([]);
  
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!businessName || !businessType || !marketingGoal) {
      toast({
        title: "חסרים פרטים",
        description: "אנא מלא/י את כל השדות המסומנים בכוכבית",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate API call with delay
    setTimeout(() => {
      // Mock responses based on platform
      const responses: {[key: string]: string[]} = {
        facebook: [
          `"${businessName} - המומחים בתחום ${businessType}. בואו לגלות את המבצעים המיוחדים החודש! #${businessType.replace(/\s/g, '')} #מקצוענות"`,
          `"אתם חייבים לראות את המוצרים החדשים שלנו ב-${businessName}! מתאימים בדיוק למטרה של ${marketingGoal}. כנסו לפרופיל לפרטים נוספים."`,
          `"כל מה שרציתם לדעת על ${businessType}, במקום אחד. צוות ${businessName} מזמין אתכם להתייעצות אישית. צרו קשר עוד היום!"`,
        ],
        instagram: [
          `"✨ ${businessName} ✨\n\nהמקום שלכם ל${businessType} באיכות הגבוהה ביותר!\n\nהשבוע בלבד: הטבות מיוחדות למעקבים חדשים!\n\n#${businessType.replace(/\s/g, '')} #${businessName.replace(/\s/g, '')}"`,
          `"מה הסוד שלנו ב-${businessName}? איכות ללא פשרות! 💯\n\nבואו לראות בעצמכם איך אנחנו משיגים את ${marketingGoal}.\n\nתייגו חברים שצריכים לראות את זה! 👇"`,
          `"חדש ב-${businessName}!\n\nשירות מיוחד שיעזור לכם להשיג ${marketingGoal} בקלות.\n\nלחצו על הלינק בביו להזמנת תור! ⏰"`,
        ],
        tiktok: [
          `"POV: גילית את ${businessName} ועכשיו החיים שלך השתנו לנצח 💫 #${businessType.replace(/\s/g, '')} #גילוימדהים"`,
          `"הסוד שהשפיענים לא רוצים שתדעו על ${businessType}! 🤫 ${businessName} חושפים הכל! #חשיפה #${businessName.replace(/\s/g, '')}"`,
          `"3 טיפים מ${businessName} שיעזרו לכם להשיג ${marketingGoal} ⚡ לייק ושמירה לצפייה אחר כך! #למידה #${businessType.replace(/\s/g, '')}"`,
        ],
      };
      
      setGeneratedContent(responses[platform] || []);
      setIsGenerating(false);
      
      toast({
        title: "התוכן נוצר בהצלחה!",
        description: "קיבלת 3 הצעות לפוסטים בהתאמה אישית",
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Output section - Now on the left */}
        <Card className="md:col-span-2 order-2 md:order-1">
          <CardHeader>
            <CardTitle>הצעות לתוכן מותאם אישית</CardTitle>
            <CardDescription>תוכן שיווקי מותאם אישית עבור {businessName || "העסק שלך"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {generatedContent.length > 0 ? (
              <div className="space-y-4">
                {generatedContent.map((content, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:bg-accent/10 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {platform === "facebook" && <Facebook size={16} />}
                        {platform === "instagram" && <Instagram size={16} />}
                        {platform === "tiktok" && (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 20l3-4 3 4M10 4.5h4c3.771 0 5.657 0 6.828 1.172C22 6.843 22 8.729 22 12.5s0 5.657-1.172 6.828C19.657 20.5 17.771 20.5 14 20.5h-4c-3.771 0-5.657 0-6.828-1.172C2 18.157 2 16.271 2 12.5s0-5.657 1.172-6.828C4.343 4.5 6.229 4.5 10 4.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                        <span className="font-medium">הצעה {index + 1}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" title="התאם את התוכן">
                          <MessageCircle size={16} />
                        </Button>
                        <Button variant="ghost" size="sm" title="העתק לפרסום">
                          <SendHorizonal size={16} />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm whitespace-pre-line">{content}</p>
                  </div>
                ))}
                
                <div className="pt-4 flex justify-between items-center">
                  <Button variant="outline" className="gap-2">
                    <TrendingUp size={16} />
                    ניתוח ביצועים
                  </Button>
                  <Button>יצירת עוד תוכן</Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <Sparkles className="w-12 h-12 mx-auto text-muted-foreground opacity-40 mb-4" />
                <h3 className="text-lg font-medium mb-2">טרם נוצר תוכן</h3>
                <p className="text-muted-foreground">
                  מלאו את הפרטים בטופס ולחצו על "צור תוכן שיווקי" כדי לקבל הצעות מותאמות אישית
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Input section - Now on the right */}
        <Card className="md:col-span-1 order-1 md:order-2">
          <CardHeader>
            <CardTitle>כלי שיווק חכמים</CardTitle>
            <CardDescription>הזינו את פרטי העסק שלכם ואנו ניצור תוכן שיווקי מותאם אישית</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">שם העסק *</Label>
              <Input 
                id="businessName" 
                placeholder="לדוגמה: סטודיו חן לציפורניים" 
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="businessType">תחום העסק *</Label>
              <Input 
                id="businessType" 
                placeholder="לדוגמה: עיצוב ציפורניים, קוסמטיקה" 
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="marketingGoal">מטרת השיווק *</Label>
              <Input 
                id="marketingGoal" 
                placeholder="לדוגמה: הגדלת לקוחות חדשים" 
                value={marketingGoal}
                onChange={(e) => setMarketingGoal(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>פלטפורמה</Label>
              <Tabs defaultValue={platform} value={platform} onValueChange={setPlatform} className="w-full">
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="facebook" className="flex items-center gap-1">
                    <Facebook size={16} />
                    Facebook
                  </TabsTrigger>
                  <TabsTrigger value="instagram" className="flex items-center gap-1">
                    <Instagram size={16} />
                    Instagram
                  </TabsTrigger>
                  <TabsTrigger value="tiktok" className="flex items-center gap-1">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
                      <path d="M9 20l3-4 3 4M10 4.5h4c3.771 0 5.657 0 6.828 1.172C22 6.843 22 8.729 22 12.5s0 5.657-1.172 6.828C19.657 20.5 17.771 20.5 14 20.5h-4c-3.771 0-5.657 0-6.828-1.172C2 18.157 2 16.271 2 12.5s0-5.657 1.172-6.828C4.343 4.5 6.229 4.5 10 4.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    TikTok
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <Button 
              onClick={handleGenerate} 
              className="w-full mt-4"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>מייצר תוכן...</>
              ) : (
                <>
                  <Sparkles className="mr-2" size={16} />
                  צור תוכן שיווקי
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Marketing tips/benefits section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-medium mb-2">תוכן מותאם אישית</h3>
              <p className="text-sm text-muted-foreground">תוכן המותאם במיוחד לעסק ולמטרות השיווק שלך, בחינם</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <MessageCircle className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-medium mb-2">עזרה מבוססת בינה מלאכותית</h3>
              <p className="text-sm text-muted-foreground">עזרה מבוססת AI לשיפור התוכן השיווקי שלך וייעול תהליכי העבודה</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-medium mb-2">ניתוח ביצועים</h3>
              <p className="text-sm text-muted-foreground">קבלו נתונים אנליטיים על הצלחת התוכן והשפעתו על העסק שלכם</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIMarketingTools;
