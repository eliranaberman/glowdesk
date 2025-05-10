import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon, Download, FileText, BarChart, PieChart, BarChartHorizontal } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { 
  generateRevenueReport, 
  generateExpensesReport, 
  generateCashFlowReport, 
  type TimeFrame,
  type ReportType 
} from '@/services/businessReportsService';

interface ReportsGeneratorProps {
  defaultTimeFrame?: TimeFrame;
  defaultReportType?: ReportType;
}

const ReportsGenerator = ({ 
  defaultTimeFrame = 'month', 
  defaultReportType = 'cashflow' 
}: ReportsGeneratorProps) => {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>(defaultTimeFrame);
  const [reportType, setReportType] = useState<ReportType>(defaultReportType);
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  const [exportFormat, setExportFormat] = useState<'csv' | 'pdf'>('csv');
  const { toast } = useToast();

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    setReportData(null);
    
    try {
      const filter = dateFrom && dateTo ? {
        startDate: format(dateFrom, 'yyyy-MM-dd'),
        endDate: format(dateTo, 'yyyy-MM-dd')
      } : undefined;
      
      let data;
      switch (reportType) {
        case 'revenue':
          data = await generateRevenueReport(timeFrame, filter);
          break;
        case 'expenses':
          data = await generateExpensesReport(timeFrame, filter);
          break;
        case 'cashflow':
          data = await generateCashFlowReport(timeFrame, filter);
          break;
        default:
          throw new Error('Unsupported report type');
      }
      
      setReportData(data);
      toast({
        title: 'הדוח נוצר בהצלחה',
        description: `דוח ${getReportTypeName(reportType)} נוצר בהצלחה`,
      });
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: 'שגיאה בהפקת הדוח',
        description: 'אירעה שגיאה בהפקת הדוח, אנא נסה שוב מאוחר יותר',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportReport = () => {
    if (!reportData) return;
    
    toast({
      title: 'מייצא דוח',
      description: `הדוח מיוצא בפורמט ${exportFormat.toUpperCase()}`,
    });
    
    // In a real implementation, this would generate and download the file
    // For now, we'll just show a toast
    setTimeout(() => {
      toast({
        title: 'הדוח יוצא בהצלחה',
        description: `הדוח ${getReportTypeName(reportType)} יוצא בפורמט ${exportFormat.toUpperCase()}`,
      });
    }, 1500);
  };

  const getReportTypeName = (type: ReportType): string => {
    switch (type) {
      case 'revenue':
        return 'הכנסות';
      case 'expenses':
        return 'הוצאות';
      case 'cashflow':
        return 'תזרים מזומנים';
      case 'appointments':
        return 'פגישות';
      case 'services':
        return 'שירותים';
      case 'clients':
        return 'לקוחות';
      default:
        return type;
    }
  };

  const getTimeFrameName = (frame: TimeFrame): string => {
    switch (frame) {
      case 'day':
        return 'יום';
      case 'week':
        return 'שבוע';
      case 'month':
        return 'חודש';
      case 'year':
        return 'שנה';
      default:
        return frame;
    }
  };
  
  const getReportIcon = (type: ReportType) => {
    switch (type) {
      case 'revenue':
        return <BarChart className="h-5 w-5 ml-2" />;
      case 'expenses':
        return <PieChart className="h-5 w-5 ml-2" />;
      case 'cashflow':
        return <BarChartHorizontal className="h-5 w-5 ml-2" />;
      default:
        return <FileText className="h-5 w-5 ml-2" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right flex items-center justify-end">
          {getReportIcon(reportType)}
          יצירת דוחות פיננסיים
        </CardTitle>
        <CardDescription className="text-right">
          הפק דוחות פיננסיים מותאמים אישית עבור העסק שלך
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue={reportType} className="w-full" onValueChange={(value) => setReportType(value as ReportType)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="cashflow">תזרים מזומנים</TabsTrigger>
            <TabsTrigger value="revenue">הכנסות</TabsTrigger>
            <TabsTrigger value="expenses">הוצאות</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label className="block text-right">תקופת דיווח</Label>
            <Select value={timeFrame} onValueChange={(value) => setTimeFrame(value as TimeFrame)}>
              <SelectTrigger>
                <SelectValue placeholder="בחר תקופה" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">יומי</SelectItem>
                <SelectItem value="week">שבועי</SelectItem>
                <SelectItem value="month">חודשי</SelectItem>
                <SelectItem value="year">שנתי</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-3">
            <Label className="block text-right">פורמט ייצוא</Label>
            <Select value={exportFormat} onValueChange={(value) => setExportFormat(value as 'csv' | 'pdf')}>
              <SelectTrigger>
                <SelectValue placeholder="בחר פורמט" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label className="block text-right">מתאריך</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between text-right"
                >
                  {dateFrom ? format(dateFrom, "dd/MM/yyyy") : "בחר תאריך התחלה"}
                  <CalendarIcon className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateFrom}
                  onSelect={setDateFrom}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-3">
            <Label className="block text-right">עד תאריך</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between text-right"
                >
                  {dateTo ? format(dateTo, "dd/MM/yyyy") : "בחר תאריך סיום"}
                  <CalendarIcon className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateTo}
                  onSelect={setDateTo}
                  disabled={(date) => dateFrom ? date < dateFrom : false}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div className="flex justify-center pt-4">
          <Button onClick={handleGenerateReport} className="w-full sm:w-auto" disabled={isGenerating}>
            {isGenerating ? 'מפיק דוח...' : 'הפק דוח'}
          </Button>
        </div>
        
        {isGenerating && (
          <div className="space-y-3">
            <Skeleton className="h-[20px] w-full" />
            <Skeleton className="h-[20px] w-[80%]" />
            <Skeleton className="h-[100px] w-full" />
          </div>
        )}
        
        {reportData && (
          <div className="border p-4 rounded-md">
            <h3 className="font-semibold mb-4 text-right flex items-center justify-end">
              <FileText className="h-4 w-4 ml-2" />
              {reportData.title}
            </h3>
            {reportType === 'cashflow' && reportData.summary && (
              <div className="mb-4 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-muted p-2 rounded text-right">
                    <span className="text-sm text-muted-foreground">הכנסות:</span>
                    <span className="font-semibold mr-2">₪{reportData.summary.totalRevenue.toFixed(2)}</span>
                  </div>
                  <div className="bg-muted p-2 rounded text-right">
                    <span className="text-sm text-muted-foreground">הוצאות:</span>
                    <span className="font-semibold mr-2">₪{reportData.summary.totalExpenses.toFixed(2)}</span>
                  </div>
                  <div className="bg-muted p-2 rounded text-right">
                    <span className="text-sm text-muted-foreground">רווח:</span>
                    <span className="font-semibold mr-2">₪{reportData.summary.profit.toFixed(2)}</span>
                  </div>
                  <div className="bg-muted p-2 rounded text-right">
                    <span className="text-sm text-muted-foreground">שולי רווח:</span>
                    <span className="font-semibold mr-2">{reportData.summary.profitMargin}</span>
                  </div>
                </div>
              </div>
            )}
            <div className="text-right mb-4">
              <p className="text-sm text-muted-foreground">דוח נוצר בתאריך: {format(new Date(reportData.generatedAt), "dd/MM/yyyy HH:mm")}</p>
            </div>
            <Button onClick={handleExportReport} variant="outline" className="w-full sm:w-auto">
              <Download className="h-4 w-4 ml-2" />
              ייצא כ-{exportFormat.toUpperCase()}
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <p className="text-sm text-muted-foreground">ניתן להפיק דוחות תקופתיים ולשמור אותם במערכת</p>
      </CardFooter>
    </Card>
  );
};

export default ReportsGenerator;
