
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { MessageCircle, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import InsightCard from './InsightCard';
import { generateSmartInsights, SmartInsight } from '@/services/businessInsightsEngine';

interface InsightsGridProps {
  period: 'daily' | 'weekly' | 'monthly';
}

const InsightsGrid = ({ period }: InsightsGridProps) => {
  const [insights, setInsights] = useState<SmartInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    loadInsights();
  }, [period]);

  const loadInsights = async () => {
    setLoading(true);
    try {
      const data = await generateSmartInsights(period);
      setInsights(data);
    } catch (error) {
      console.error('Error loading insights:', error);
      toast({
        title: "שגיאה בטעינת תובנות",
        description: "לא ניתן לטעון את התובנות כרגע",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppShare = (text: string) => {
    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "שותף בוואטסאפ",
      description: "התובנה נפתחת בוואטסאפ",
    });
  };

  const handleShareAllInsights = () => {
    const allInsightsText = insights
      .filter(insight => insight.whatsappText)
      .map((insight, index) => `${index + 1}. ${insight.whatsappText}`)
      .join('\n\n');
    
    if (allInsightsText) {
      handleWhatsAppShare(`התובנות העסקיות שלי להיום:\n\n${allInsightsText}`);
    }
  };

  const getFilteredInsights = () => {
    if (activeTab === 'all') return insights;
    
    const categoryMap: Record<string, string> = {
      'opportunities': 'opportunities',
      'alerts': 'operational_alerts',
      'trends': 'weekly_trends',
      'monthly': 'monthly_insights'
    };
    
    return insights.filter(insight => insight.category === categoryMap[activeTab]);
  };

  const filteredInsights = getFilteredInsights();
  const hasActionableInsights = insights.some(insight => insight.actionable && insight.whatsappText);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-right flex items-center justify-end gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            תובנות עסקיות חכמות
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-24 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {hasActionableInsights && (
              <Button
                onClick={handleShareAllInsights}
                className="gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white"
                size="sm"
              >
                <MessageCircle className="h-4 w-4" />
                שלח הכל לוואטסאפ
              </Button>
            )}
          </div>
          <div className="text-right">
            <CardTitle className="text-lg flex items-center justify-end gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              תובנות עסקיות חכמות
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              המלצות והתראות מבוססות נתונים
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-6 w-full">
            <TabsTrigger value="all" className="order-4">הכל</TabsTrigger>
            <TabsTrigger value="opportunities" className="order-3">הזדמנויות</TabsTrigger>
            <TabsTrigger value="alerts" className="order-2">התראות</TabsTrigger>
            <TabsTrigger value="trends" className="order-1">מגמות</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab}>
            {filteredInsights.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredInsights.map((insight) => (
                  <InsightCard
                    key={insight.id}
                    insight={insight}
                    onWhatsAppShare={handleWhatsAppShare}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-muted-foreground">
                  אין תובנות זמינות בקטגוריה זו כרגע
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default InsightsGrid;
