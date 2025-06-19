
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Clock, 
  Users, 
  TrendingUp, 
  Instagram, 
  MessageCircle, 
  DollarSign,
  Lightbulb 
} from 'lucide-react';

interface SmartInsight {
  id: string;
  type: 'timing' | 'client' | 'profit' | 'social';
  title: string;
  message: string;
  action?: string;
  priority: 'high' | 'medium' | 'low';
  icon: React.ReactNode;
}

const SmartInsights = () => {
  const [insights, setInsights] = useState<SmartInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateSmartInsights();
  }, []);

  const generateSmartInsights = () => {
    setLoading(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const generatedInsights: SmartInsight[] = [
        {
          id: '1',
          type: 'social',
          title: 'זמן אופטימלי לפרסום באינסטגרם',
          message: 'הלקוחות שלך הכי פעילות באינסטגרם בימי ג׳ בשעה 19:00-21:00. פרסום בזמן הזה יגדיל את הreach ב-45%',
          action: 'תזמני פוסט',
          priority: 'high',
          icon: <Instagram className="h-4 w-4" />
        },
        {
          id: '2',
          type: 'client',
          title: 'לקוחות לתזכורת',
          message: '12 לקוחות לא קבעו תור במהלך חודשיים. שלחי להן הודעה עם הנחה של 15% - צפי לחזרה של 70%',
          action: 'שלחי תזכורות',
          priority: 'high',
          icon: <MessageCircle className="h-4 w-4" />
        },
        {
          id: '3',
          type: 'profit',
          title: 'התור הכי רווחי שלך',
          message: 'טיפולי ג׳ל עם עיצוב מניבים הכי הרבה רווח (ממוצע 180 ש"ח, זמן 1.5 שעות). מומלץ להציע יותר מהם',
          action: 'עדכני מחירון',
          priority: 'medium',
          icon: <DollarSign className="h-4 w-4" />
        },
        {
          id: '4',
          type: 'timing',
          title: 'דפוס שבועי מעניין',
          message: 'ימי שני הם הכי פנויים שלך (רק 30% תפוסה). שקלי להציע "מבצע יום שני" - 20% הנחה',
          action: 'צרי מבצע',
          priority: 'medium',
          icon: <Clock className="h-4 w-4" />
        },
        {
          id: '5',
          type: 'client',
          title: 'לקוחות VIP',
          message: '8 לקוחות מגיעות כל שבועיים באופן קבוע ומוציאות ממוצע של 250 ש"ח. הן המקור הכנסה העיקרי שלך',
          action: 'תכנני מבצע VIP',
          priority: 'low',
          icon: <Users className="h-4 w-4" />
        }
      ];
      
      setInsights(generatedInsights);
      setLoading(false);
    }, 1500);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'דחוף';
      case 'medium': return 'בינוני';
      case 'low': return 'נמוך';
      default: return '';
    }
  };

  return (
    <Card className="w-full" dir="rtl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-nail-500" />
          תובנות חכמות מהAI
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          ההמלצות שלנו מבוססות על ניתוח נתונים מתקדם של ההתנהגות שלך ושל הלקוחות
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-muted/50 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border border-nail-200 hover:border-nail-300 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="p-2 bg-nail-100 rounded-full">
                          {insight.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-sm">{insight.title}</h4>
                            <Badge variant={getPriorityColor(insight.priority)} className="text-xs">
                              {getPriorityText(insight.priority)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {insight.message}
                          </p>
                        </div>
                      </div>
                      {insight.action && (
                        <Button size="sm" variant="outline" className="whitespace-nowrap">
                          {insight.action}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
        
        <div className="text-center pt-4">
          <Button
            variant="outline"
            onClick={generateSmartInsights}
            disabled={loading}
            className="gap-2"
          >
            <Lightbulb className="h-4 w-4" />
            {loading ? 'מחשב תובנות...' : 'חדש תובנות'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartInsights;
