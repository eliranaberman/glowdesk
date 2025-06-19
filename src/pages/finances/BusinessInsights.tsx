
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { DateRange } from 'react-day-picker';

import BusinessKPICards from '@/components/business-insights/BusinessKPICards';
import ServiceDistributionChart from '@/components/business-insights/ServiceDistributionChart';
import RevenueChart from '@/components/business-insights/RevenueChart';
import MotivationalMessage from '@/components/business-insights/MotivationalMessage';
import DateRangePicker from '@/components/business-insights/DateRangePicker';

import {
  getBusinessKPIs,
  getServiceDistribution,
  getTimeSeriesData,
  getMotivationalMessage,
  TimeFrame,
  BusinessKPI,
  ServiceDistribution,
  TimeSeriesData
} from '@/services/businessInsightsService';

const BusinessInsights = () => {
  const [activeTimeFrame, setActiveTimeFrame] = useState<TimeFrame>('daily');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [customDateRange, setCustomDateRange] = useState(false);

  // Queries for different data types
  const { data: kpis, isLoading: isLoadingKPIs } = useQuery({
    queryKey: ['business-kpis', activeTimeFrame, dateRange],
    queryFn: () => getBusinessKPIs(activeTimeFrame),
    refetchOnWindowFocus: false,
  });

  const { data: serviceDistribution, isLoading: isLoadingServices } = useQuery({
    queryKey: ['service-distribution', activeTimeFrame, dateRange],
    queryFn: () => getServiceDistribution(activeTimeFrame),
    refetchOnWindowFocus: false,
  });

  const { data: timeSeriesData, isLoading: isLoadingTimeSeries } = useQuery({
    queryKey: ['time-series', activeTimeFrame, dateRange],
    queryFn: () => getTimeSeriesData(activeTimeFrame),
    refetchOnWindowFocus: false,
  });

  const isLoading = isLoadingKPIs || isLoadingServices || isLoadingTimeSeries;

  const handleExportPDF = async () => {
    toast.info('תכונת ייצוא PDF תהיה זמינה בקרוב!');
  };

  const getPageTitle = () => {
    switch (activeTimeFrame) {
      case 'daily': return 'התובנות העסקיות שלך - נתוני היום';
      case 'weekly': return 'התובנות העסקיות שלך - נתוני השבוע';
      case 'monthly': return 'התובנות העסקיות שלך - נתוני החודש';
    }
  };

  const getTabLabel = (timeFrame: TimeFrame) => {
    switch (timeFrame) {
      case 'daily': return 'יומי';
      case 'weekly': return 'שבועי';
      case 'monthly': return 'חודשי';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDF4EF] to-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-right">
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#3A1E14' }}>
              {getPageTitle()}
            </h1>
            <p className="text-muted-foreground">
              ניתוח מפורט של הביצועים העסקיים שלך עם תובנות מעמיקות ומותאמות אישית
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-2">
            <DateRangePicker 
              dateRange={dateRange}
              onDateRangeChange={(range) => {
                setDateRange(range);
                setCustomDateRange(!!range);
              }}
            />
            <Button
              onClick={handleExportPDF}
              variant="outline"
              className="bg-white border-[#9C6B50] hover:bg-[#FDF4EF]"
              style={{ color: '#9C6B50' }}
            >
              <Download className="h-4 w-4 mr-2" />
              ייצוא PDF
            </Button>
          </div>
        </div>

        {/* Motivational Message */}
        {kpis && (
          <MotivationalMessage message={getMotivationalMessage(kpis, activeTimeFrame)} />
        )}

        {/* Time Frame Tabs */}
        <Card className="bg-white/70 border-none shadow-soft">
          <CardContent className="p-0">
            <Tabs 
              value={activeTimeFrame} 
              onValueChange={(value) => setActiveTimeFrame(value as TimeFrame)}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3 bg-[#F6BE9A]/20 rounded-t-lg">
                <TabsTrigger 
                  value="monthly"
                  className="data-[state=active]:bg-[#9C6B50] data-[state=active]:text-white"
                >
                  {getTabLabel('monthly')}
                </TabsTrigger>
                <TabsTrigger 
                  value="weekly"
                  className="data-[state=active]:bg-[#9C6B50] data-[state=active]:text-white"
                >
                  {getTabLabel('weekly')}
                </TabsTrigger>
                <TabsTrigger 
                  value="daily"
                  className="data-[state=active]:bg-[#9C6B50] data-[state=active]:text-white"
                >
                  {getTabLabel('daily')}
                </TabsTrigger>
              </TabsList>

              {/* Loading State */}
              {isLoading && (
                <div className="p-8 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#9C6B50' }} />
                  <span className="mr-2 text-lg" style={{ color: '#3A1E14' }}>טוען נתונים...</span>
                </div>
              )}

              {/* Content for each time frame */}
              {!isLoading && (
                <>
                  <TabsContent value="daily" className="p-6 space-y-6">
                    {kpis && <BusinessKPICards kpis={kpis} timeFrame="daily" />}
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {timeSeriesData && (
                        <RevenueChart data={timeSeriesData} timeFrame="daily" />
                      )}
                      {serviceDistribution && (
                        <ServiceDistributionChart data={serviceDistribution} timeFrame="daily" />
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="weekly" className="p-6 space-y-6">
                    {kpis && <BusinessKPICards kpis={kpis} timeFrame="weekly" />}
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {timeSeriesData && (
                        <RevenueChart data={timeSeriesData} timeFrame="weekly" />
                      )}
                      {serviceDistribution && (
                        <ServiceDistributionChart data={serviceDistribution} timeFrame="weekly" />
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="monthly" className="p-6 space-y-6">
                    {kpis && <BusinessKPICards kpis={kpis} timeFrame="monthly" />}
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {timeSeriesData && (
                        <RevenueChart data={timeSeriesData} timeFrame="monthly" />
                      )}
                      {serviceDistribution && (
                        <ServiceDistributionChart data={serviceDistribution} timeFrame="monthly" />
                      )}
                    </div>
                  </TabsContent>
                </>
              )}
            </Tabs>
          </CardContent>
        </Card>

        {/* Additional Insights */}
        {!isLoading && kpis && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-[#9C6B50]/10 to-[#F6BE9A]/20 border-none shadow-soft">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-right" style={{ color: '#3A1E14' }}>
                  טיפ מקצועי
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-right">
                  {kpis.cancellationRate > 15 
                    ? "שיעור הביטולים גבוה - שקלי להטמיע מדיניות ביטולים חדשה"
                    : "שיעור הביטולים נמוך - מצוין! המשיכי כך"}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[#69493F]/10 to-[#9C6B50]/20 border-none shadow-soft">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-right" style={{ color: '#3A1E14' }}>
                  הזדמנות לצמיחה
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-right">
                  {kpis.repeatBookings < 5 
                    ? "הגדלת מספר הלקוחות החוזרים יכולה להכפיל את ההכנסות"
                    : "יש לך בסיס לקוחות נאמן - זה הזמן להרחיב!"}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[#F6BE9A]/20 to-[#FDF4EF] border-none shadow-soft">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-right" style={{ color: '#3A1E14' }}>
                  המלצה אישית
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-right">
                  {activeTimeFrame === 'daily' && kpis.peakHour
                    ? `השעה ${kpis.peakHour} היא הכי עמוסה - שקלי להוסיף מחירון מיוחד`
                    : "נסי להציע חבילות טיפולים משולבות להגדלת הרווחיות"}
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessInsights;
