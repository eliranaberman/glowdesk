
import { useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ContentGenerationForm from "./marketing-tools/ContentGenerationForm";
import GeneratedContent from "./marketing-tools/GeneratedContent";
import MarketingBenefits from "./marketing-tools/MarketingBenefits";

const AIMarketingTools = () => {
  const [platform, setPlatform] = useState("facebook");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string[]>([]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Input section - Now on the right */}
      <div className="md:col-span-1 order-2 md:order-1">
        <Card className="shadow-soft hover:shadow-soft-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-lg font-display">כלי שיווק חכמים</CardTitle>
            <CardDescription>הזינו את פרטי העסק שלכם ואנו ניצור תוכן שיווקי מותאם אישית</CardDescription>
          </CardHeader>
          <ContentGenerationForm 
            onGenerateContent={setGeneratedContent}
            isGenerating={isGenerating}
            setIsGenerating={setIsGenerating}
          />
        </Card>
      </div>

      {/* Output section - Now on the left */}
      <div className="md:col-span-2 order-1 md:order-2">
        <Card className="shadow-soft hover:shadow-soft-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-lg font-display">הצעות לתוכן מותאם אישית</CardTitle>
            <CardDescription>תוכן שיווקי מותאם אישית עבור העסק שלך</CardDescription>
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
