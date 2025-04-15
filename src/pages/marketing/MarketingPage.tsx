
import { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TemplatesList } from '@/components/marketing/TemplatesList';
import { CampaignsList } from '@/components/marketing/CampaignsList';
import { CouponsList } from '@/components/marketing/CouponsList';
import { MarketingAnalytics } from '@/components/marketing/MarketingAnalytics';
import { Loader2, Mail, Tag, BarChart3, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { getMarketingStats } from '@/services/marketingService';
import { MarketingStats } from '@/types/marketing';

const MarketingPage = () => {
  const [activeTab, setActiveTab] = useState('templates');
  const [stats, setStats] = useState<MarketingStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadStats = async () => {
      try {
        setIsLoading(true);
        const data = await getMarketingStats();
        setStats(data);
      } catch (error) {
        console.error('Error loading marketing stats:', error);
        toast({
          title: 'שגיאה בטעינת נתוני שיווק',
          description: 'אירעה שגיאה בטעינת הנתונים, אנא נסה שנית',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, [toast]);

  const handleCreateNew = () => {
    switch (activeTab) {
      case 'templates':
        navigate('/marketing/templates/new');
        break;
      case 'campaigns':
        navigate('/marketing/campaigns/new');
        break;
      case 'coupons':
        navigate('/marketing/coupons/new');
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <Button
          onClick={handleCreateNew}
          className="flex items-center gap-2"
          size="sm"
        >
          <Plus size={16} />
          {activeTab === 'templates' && 'תבנית חדשה'}
          {activeTab === 'campaigns' && 'קמפיין חדש'}
          {activeTab === 'coupons' && 'קופון חדש'}
          {activeTab === 'analytics' && 'דוח חדש'}
        </Button>
        <h1 className="text-2xl font-medium">שיווק וקמפיינים</h1>
        <div className="w-[100px]" />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">תבניות</p>
                      <p className="text-2xl font-bold">{stats.total_templates}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">קמפיינים</p>
                      <p className="text-2xl font-bold">{stats.total_campaigns}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center">
                      <Mail className="h-6 w-6 text-secondary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">הודעות שנשלחו</p>
                      <p className="text-2xl font-bold">{stats.total_messages}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                      <Mail className="h-6 w-6 text-yellow-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">קופונים פעילים</p>
                      <p className="text-2xl font-bold">{stats.active_coupons}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                      <Tag className="h-6 w-6 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="analytics" className="text-xs md:text-base">אנליטיקס</TabsTrigger>
              <TabsTrigger value="coupons" className="text-xs md:text-base">קופונים</TabsTrigger>
              <TabsTrigger value="campaigns" className="text-xs md:text-base">קמפיינים</TabsTrigger>
              <TabsTrigger value="templates" className="text-xs md:text-base">תבניות</TabsTrigger>
            </TabsList>

            <TabsContent value="templates">
              <TemplatesList />
            </TabsContent>

            <TabsContent value="campaigns">
              <CampaignsList />
            </TabsContent>

            <TabsContent value="coupons">
              <CouponsList />
            </TabsContent>

            <TabsContent value="analytics">
              <MarketingAnalytics stats={stats} />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default MarketingPage;
