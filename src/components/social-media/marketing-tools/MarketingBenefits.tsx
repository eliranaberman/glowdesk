
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Sparkles, TrendingUp } from "lucide-react";

const MarketingBenefits = () => {
  const benefits = [
    {
      icon: <Sparkles className="h-5 w-5 text-primary" />,
      title: "תוכן מותאם אישית",
      description: "תוכן המותאם במיוחד לעסק ולמטרות השיווק שלך, בחינם"
    },
    {
      icon: <MessageCircle className="h-5 w-5 text-primary" />,
      title: "עזרה מבוססת בינה מלאכותית",
      description: "עזרה מבוססת AI לשיפור התוכן השיווקי שלך וייעול תהליכי העבודה"
    },
    {
      icon: <TrendingUp className="h-5 w-5 text-primary" />,
      title: "ניתוח ביצועים",
      description: "קבלו נתונים אנליטיים על הצלחת התוכן והשפעתו על העסק שלכם"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {benefits.map((benefit, index) => (
        <Card key={index}>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                {benefit.icon}
              </div>
              <h3 className="font-medium mb-2">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground">{benefit.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MarketingBenefits;
