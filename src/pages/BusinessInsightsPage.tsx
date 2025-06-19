
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  TrendingUp, 
  Users, 
  Calculator, 
  Repeat, 
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import KPICard from '@/components/insights/KPICard';
import ServiceDistributionChart from '@/components/insights/ServiceDistributionChart';
import InsightsGrid from '@/components/insights/InsightsGrid';
import { 
  getBusinessMetrics, 
  getDateRange, 
  BusinessMetrics 
} from '@/services/businessInsightsService';

const BusinessInsightsPage = () => {
  const [metrics, setMetrics] = useState<BusinessMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  console.log('BusinessInsightsPage rendering...');

  const loadMetrics = async () => {
    console.log('Loading metrics...');
    setLoading(true);
    
    try {
      const dateRange = getDateRange('weekly', new Date());
      const data = await getBusinessMetrics(dateRange);
      console.log('Metrics loaded successfully:', data);
      setMetrics(data);
    } catch (error) {
      console.error('Error loading metrics:', error);
      toast({
        title: "שגיאה בטעינת נתונים",
        description: "לא ניתן לטעון את הנתונים כרגע",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 text-center" dir="rtl">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-1 text-[#3A1E14]">התובנות העסקיות שלך</h1>
          <p className="text-muted-foreground">מעקב אחר הביצועים והצמיחה שלך</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-1 text-[#3A1E14]">התובנות העסקיות שלך</h1>
        <p className="text-muted-foreground">מעקב אחר הביצועים והצמיחה שלך</p>
      </div>

      {/* KPI Cards */}
      {metrics && (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <KPICard
              title="הכנסות"
              value={metrics.totalRevenue}
              icon={TrendingUp}
              variant="primary"
              trend={{ value: metrics.revenueGrowth, label: "צמיחה" }}
            />
            <KPICard
              title="לקוחות"
              value={metrics.totalClients}
              icon={Users}
              variant="secondary"
              trend={{ value: metrics.clientGrowth, label: "צמיחה" }}
            />
            <KPICard
              title="ממוצע ללקוחה"
              value={`₪${metrics.averagePerClient.toFixed(0)}`}
              icon={Calculator}
              variant="accent"
            />
            <KPICard
              title="לקוחות חוזרות"
              value={metrics.repeatCustomers}
              subtitle={`${((metrics.repeatCustomers / metrics.totalClients) * 100).toFixed(0)}% מהלקוחות`}
              icon={Repeat}
            />
          </div>

          <InsightsGrid period="weekly" />
          
          <div className="grid gap-6 lg:grid-cols-2">
            <ServiceDistributionChart 
              data={metrics.treatmentDistribution}
              title="התפלגות הטיפולים"
            />
            <Card>
              <CardHeader>
                <CardTitle className="text-center">סיכום נוסף</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-[#3A1E14]">{metrics.cancellationRate.toFixed(1)}%</span>
                    <span className="text-muted-foreground">שיעור ביטולים</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-[#3A1E14]">{metrics.peakHour}</span>
                    <span className="text-muted-foreground">שעת שיא</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default BusinessInsightsPage;
