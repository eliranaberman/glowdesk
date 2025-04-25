
import { useState } from "react";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContentGenerationFormProps {
  onGenerateContent: (content: string[]) => void;
  isGenerating: boolean;
  setIsGenerating: (value: boolean) => void;
}

const ContentGenerationForm = ({ onGenerateContent, isGenerating, setIsGenerating }: ContentGenerationFormProps) => {
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [marketingGoal, setMarketingGoal] = useState("");
  const [platform, setPlatform] = useState("facebook");
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
      
      onGenerateContent(responses[platform] || []);
      setIsGenerating(false);
      
      toast({
        title: "התוכן נוצר בהצלחה!",
        description: "קיבלת 3 הצעות לפוסטים בהתאמה אישית",
      });
    }, 2000);
  };

  return (
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
              Facebook
            </TabsTrigger>
            <TabsTrigger value="instagram" className="flex items-center gap-1">
              Instagram
            </TabsTrigger>
            <TabsTrigger value="tiktok" className="flex items-center gap-1">
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
  );
};

export default ContentGenerationForm;
