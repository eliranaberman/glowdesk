
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ContentGenerationForm from "./marketing-tools/ContentGenerationForm";
import GeneratedContent from "./marketing-tools/GeneratedContent";
import MarketingBenefits from "./marketing-tools/MarketingBenefits";
import { Sparkles, MessageCircle } from "lucide-react";

const AIMarketingTools = () => {
  const [platform, setPlatform] = useState("facebook");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string[]>([]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Input section - Now on the right for RTL */}
      <div className="md:col-span-1 order-1 md:order-1">
        <Card className="h-full shadow-soft hover:shadow-soft-lg transition-all duration-300 border-roseGold/30 bg-warmBeige/30">
          <CardHeader className="pb-3 border-b border-border/10">
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl font-display text-roseGold">כלי שיווק חכמים</CardTitle>
              <Sparkles className="text-roseGold h-5 w-5" />
            </div>
            <CardDescription className="mt-1">הזינו את פרטי העסק שלכם ואנו ניצור תוכן שיווקי מותאם אישית</CardDescription>
          </CardHeader>
          <CardContent className="pt-5">
            <ContentGenerationForm 
              onGenerateContent={setGeneratedContent}
              isGenerating={isGenerating}
              setIsGenerating={setIsGenerating}
            />
          </CardContent>
        </Card>
      </div>

      {/* Output section - Now on the left for RTL view */}
      <div className="md:col-span-2 order-2 md:order-2">
        <Card className="h-full shadow-soft hover:shadow-soft-lg transition-all duration-300 border-mutedPeach/30">
          <CardHeader className="pb-3 border-b border-border/10">
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl font-display text-oliveGreen">הצעות לתוכן מותאם אישית</CardTitle>
              <MessageCircle className="text-oliveGreen h-5 w-5" />
            </div>
            <CardDescription className="mt-1">תוכן שיווקי מותאם אישית עבור העסק שלך</CardDescription>
          </CardHeader>
          <GeneratedContent 
            content={generatedContent}
            platform={platform}
          />
        </Card>
      </div>
      
      {/* Marketing benefits section */}
      <div className="md:col-span-3 order-3">
        <MarketingBenefits />
      </div>
    </div>
  );
};

export default AIMarketingTools;
