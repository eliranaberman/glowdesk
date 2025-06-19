
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  TrendingUp, 
  Users, 
  Calculator, 
  XCircle, 
  Repeat, 
  Clock, 
  Calendar as CalendarIcon,
  Download,
  Lightbulb
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import KPICard from '@/components/insights/KPICard';
import ServiceDistributionChart from '@/components/insights/ServiceDistributionChart';
import MotivationalMessage from '@/components/insights/MotivationalMessage';
import { 
  getBusinessMetrics, 
  getDateRange, 
  getMotivationalMessage,
  BusinessMetrics 
} from '@/services/businessInsightsService';

const BusinessInsightsPage = () => {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [metrics, setMetrics] = useState<BusinessMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  console.log('BusinessInsightsPage rendering...', { activeTab, selectedDate });

  const loadMetrics = async () => {
    console.log('Loading metrics...', { activeTab, selectedDate });
    setLoading(true);
    try {
      const dateRange = getDateRange(activeTab, selectedDate);
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
  }, [activeTab, selectedDate]);

  const handleExportPDF = () => {
    toast({
      title: "ייצוא PDF",
      description: "הפיצ'ר בפיתוח - ייהיה זמין בקרוב!",
    });
  };

  const getPeriodLabel = () => {
    const dateRange = getDateRange(activeTab, selectedDate);
    switch (activeTab) {
      case 'daily':
        return format(selectedDate, 'dd/MM/yyyy', { locale: he });
      case 'weekly':
        return `${format(dateRange.start, 'dd/MM', { locale: he })} - ${format(dateRange.end, 'dd/MM/yyyy', { locale: he })}`;
      case 'monthly':
        return format(selectedDate, 'MMMM yyyy', { locale: he });
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold mb-1">התובנות העסקיות שלך</h1>
            <p className="text-muted-foreground">מעקב אחר הביצועים והצמיחה שלך</p>
          </div>
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-right">
          <h1 className="text-2xl font-semibold mb-1 text-[#3A1E14]">התובנות העסקיות שלך</h1>
          <p className="text-muted-foreground">מעקב אחר הביצועים והצמיחה שלך</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button onClick={handleExportPDF} variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            ייצוא PDF
          </Button>
          
          <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <CalendarIcon className="h-4 w-4" />
                {getPeriodLabel()}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  if (date) {
                    setSelectedDate(date);
                    setDatePickerOpen(false);
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Motivational Message */}
      {metrics && (
        <MotivationalMessage 
          message={getMotivationalMessage(metrics)} 
        />
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="grid grid-cols-3 mb-6 w-full max-w-md mx-auto">
          <TabsTrigger value="daily" className="order-3">יומי</TabsTrigger>
          <TabsTrigger value="weekly" className="order-2">שבועי</TabsTrigger>
          <TabsTrigger value="monthly" className="order-1">חודשי</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-6">
          {metrics && (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <KPICard
                  title="הכנסות היום"
                  value={metrics.totalRevenue}
                  icon={TrendingUp}
                  variant="primary"
                  trend={{ value: metrics.revenueGrowth, label: "לעומת אתמול" }}
                />
                <KPICard
                  title="לקוחות"
                  value={metrics.totalClients}
                  icon={Users}
                  variant="secondary"
                  trend={{ value: metrics.clientGrowth, label: "לעומת אתמול" }}
                />
                <KPICard
                  title="ממוצע ללקוחה"
                  value={`₪${metrics.averagePerClient.toFixed(0)}`}
                  icon={Calculator}
                  variant="accent"
                />
                <KPICard
                  title="שעת שיא"
                  value={metrics.peakHour}
                  subtitle="השעה העמוסה ביותר"
                  icon={Clock}
                />
              </div>
              
              <div className="grid gap-6 lg:grid-cols-2">
                <ServiceDistributionChart 
                  data={metrics.treatmentDistribution}
                  title="טיפולי היום"
                />
                <Card>
                  <CardHeader>
                    <CardTitle className="text-right">סטטיסטיקות נוספות</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-[#3A1E14]">{metrics.cancellationRate.toFixed(1)}%</span>
                      <span className="text-muted-foreground">שיעור ביטולים</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-[#3A1E14]">{metrics.repeatCustomers}</span>
                      <span className="text-muted-foreground">לקוחות חוזרות</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="weekly" className="space-y-6">
          {metrics && (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <KPICard
                  title="הכנסות השבוע"
                  value={metrics.totalRevenue}
                  icon={TrendingUp}
                  variant="primary"
                  trend={{ value: metrics.revenueGrowth, label: "לעומת שבוע קודם" }}
                />
                <KPICard
                  title="לקוחות"
                  value={metrics.totalClients}
                  icon={Users}
                  variant="secondary"
                  trend={{ value: metrics.clientGrowth, label: "לעומת שבוע קודם" }}
                />
                <KPICard
                  title="ממוצע ללקוחה"
                  value={`₪${metrics.averagePerClient.toFixed(0)}`}
                  icon={Calculator}
                  variant="accent"
                />
                <KPICard
                  title="יום שיא"
                  value={metrics.peakDay}
                  subtitle="היום העמוס ביותר"
                  icon={CalendarIcon}
                />
              </div>
              
              <div className="grid gap-6 lg:grid-cols-2">
                <ServiceDistributionChart 
                  data={metrics.treatmentDistribution}
                  title="טיפולי השבוע"
                />
                <Card>
                  <CardHeader>
                    <CardTitle className="text-right">סיכום השבוע</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-[#3A1E14]">{metrics.cancellationRate.toFixed(1)}%</span>
                      <span className="text-muted-foreground">שיעור ביטולים</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-[#3A1E14]">{metrics.repeatCustomers}</span>
                      <span className="text-muted-foreground">לקוחות חוזרות</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-[#3A1E14]">{metrics.peakHour}</span>
                      <span className="text-muted-foreground">שעת שיא</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="monthly" className="space-y-6">
          {metrics && (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <KPICard
                  title="הכנסות החודש"
                  value={metrics.totalRevenue}
                  icon={TrendingUp}
                  variant="primary"
                  trend={{ value: metrics.revenueGrowth, label: "לעומת חודש קודם" }}
                />
                <KPICard
                  title="לקוחות"
                  value={metrics.totalClients}
                  icon={Users}
                  variant="secondary"
                  trend={{ value: metrics.clientGrowth, label: "לעומת חודש קודם" }}
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
              
              <div className="grid gap-6 lg:grid-cols-2">
                <ServiceDistributionChart 
                  data={metrics.treatmentDistribution}
                  title="טיפולי החודש"
                />
                <Card>
                  <CardHeader>
                    <CardTitle className="text-right">סיכום החודש</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-[#3A1E14]">{metrics.cancellationRate.toFixed(1)}%</span>
                        <span className="text-muted-foreground">שיעור ביטולים</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-[#3A1E14]">{metrics.peakDay}</span>
                        <span className="text-muted-foreground">יום שיא</span>
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessInsightsPage;
