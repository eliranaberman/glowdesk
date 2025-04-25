
import { Facebook, Instagram, MessageCircle, SendHorizonal, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

interface GeneratedContentProps {
  content: string[];
  platform: string;
  businessName?: string;
}

const GeneratedContent = ({ content, platform, businessName }: GeneratedContentProps) => {
  return (
    <CardContent className="space-y-4">
      {content.length > 0 ? (
        <div className="space-y-4">
          {content.map((contentItem, index) => (
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
              <p className="text-sm whitespace-pre-line">{contentItem}</p>
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
  );
};

export default GeneratedContent;
