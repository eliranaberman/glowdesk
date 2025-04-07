
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import PDFExport from "@/components/reports/PDFExport";
import ReportGenerator from "@/components/reports/ReportGenerator";
import { useToast } from "@/hooks/use-toast";
import { jsPDF } from "jspdf";

const Reports = () => {
  const [reportType, setReportType] = useState("finance");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [period, setPeriod] = useState("monthly");
  const { toast } = useToast();

  const getReportTitle = () => {
    let title = "";
    
    switch (reportType) {
      case "finance":
        title = "דוח פיננסי";
        break;
      case "customers":
        title = "דוח לקוחות";
        break;
      case "inventory":
        title = "דוח מלאי";
        break;
      case "appointments":
        title = "דוח תורים";
        break;
      default:
        title = "דוח";
    }
    
    if (date) {
      if (period === "daily") {
        title += ` - ${format(date, "dd/MM/yyyy")}`;
      } else if (period === "monthly") {
        title += ` - ${format(date, "MM/yyyy")}`;
      } else if (period === "yearly") {
        title += ` - ${format(date, "yyyy")}`;
      }
    }
    
    return title;
  };

  const handleGenerateReport = () => {
    toast({
      title: "דוח נוצר בהצלחה",
      description: `ה${getReportTitle()} מוכן לצפייה והורדה`,
    });
  };

  // נוסיף תמיכה ב-jspdf בעת טעינת הדף
  const loadJSPDF = () => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.async = true;
    document.body.appendChild(script);
    
    const autoTableScript = document.createElement('script');
    autoTableScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.28/jspdf.plugin.autotable.min.js';
    autoTableScript.async = true;
    document.body.appendChild(autoTableScript);
  };

  // נטען את jspdf כשהדף נטען
  useState(() => {
    loadJSPDF();
  });

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold mb-2">דוחות</h1>
        <p className="text-muted-foreground">
          צפייה וייצוא דוחות עסקיים לפי תאריכים וקטגוריות
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_300px]">
        <Card className="order-2 md:order-1">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>תצוגת דוח: {getReportTitle()}</CardTitle>
                <CardDescription>
                  {period === "daily" && "דוח יומי"}
                  {period === "monthly" && "דוח חודשי"}
                  {period === "yearly" && "דוח שנתי"}
                </CardDescription>
              </div>
              <PDFExport reportTitle={getReportTitle()} reportType={reportType} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md p-4">
              <ReportGenerator 
                reportType={reportType} 
                period={period} 
                date={date} 
              />
            </div>
            
            <div className="mt-4 text-sm text-muted-foreground text-center">
              <p>הדוחות נשמרים באופן אוטומטי במערכת למשך 12 חודשים.</p>
              <p>ניתן להוריד דוחות ישנים יותר מארכיון הדוחות.</p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6 order-1 md:order-2">
          <Card>
            <CardHeader>
              <CardTitle>הגדרות דוח</CardTitle>
              <CardDescription>בחרו את סוג הדוח ותקופת הזמן</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">סוג דוח</label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue placeholder="בחרו סוג דוח" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="finance">דוח פיננסי</SelectItem>
                    <SelectItem value="customers">דוח לקוחות</SelectItem>
                    <SelectItem value="inventory">דוח מלאי</SelectItem>
                    <SelectItem value="appointments">דוח תורים</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">תקופת זמן</label>
                <Tabs defaultValue="monthly" value={period} onValueChange={setPeriod}>
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="daily">יומי</TabsTrigger>
                    <TabsTrigger value="monthly">חודשי</TabsTrigger>
                    <TabsTrigger value="yearly">שנתי</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">תאריך</label>
                <div className="border rounded-md p-1">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => date > new Date()}
                    showOutsideDays={false}
                  />
                </div>
              </div>

              <Button className="w-full" onClick={handleGenerateReport}>הפק דוח</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>דוחות אחרונים</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { title: "דוח פיננסי - 03/2025", date: "01/04/2025" },
                  { title: "דוח לקוחות - 03/2025", date: "01/04/2025" },
                  { title: "דוח פיננסי - 02/2025", date: "01/03/2025" },
                  { title: "דוח מלאי - 02/2025", date: "01/03/2025" },
                ].map((report, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center p-2 hover:bg-accent/40 rounded-md cursor-pointer"
                  >
                    <span className="font-medium">{report.title}</span>
                    <span className="text-sm text-muted-foreground">{report.date}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Reports;
