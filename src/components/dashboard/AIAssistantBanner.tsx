
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Bot } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const AIAssistantBanner = () => {
  const isMobile = useIsMobile();

  return (
    <div className="bg-gradient-to-r from-accent/30 to-accent/10 border border-accent/20 rounded-xl p-4 md:p-6 shadow-soft">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
        <div className="mb-4 md:mb-0 flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <Bot className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-display font-medium text-deepNavy mb-1">העוזרת החכמה שלך</h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
              פנה לעוזרת החכמה לעזרה בניהול העסק, תזכורות ללקוחות, פוסטים לרשתות חברתיות ועוד.
            </p>
          </div>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <Link to="/ai-assistant" className="w-full md:w-auto">
            <Button variant="warm" size={isMobile ? "default" : "lg"} className="font-display w-full md:w-auto group">
              <Bot className="h-5 w-5 mr-2 group-hover:animate-pulse" />
              התחל לדבר עם העוזרת
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantBanner;
