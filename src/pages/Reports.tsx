
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Calendar, Users, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ReportGenerator from "../components/reports/ReportGenerator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  // Mock report data
  const recentReports = [
    {
      id: "1",
      name: "סיכום הכנסות חודשי",
      date: "31/03/2025",
      type: "כספים",
    },
    {
      id: "2",
      name: "ניתוח לקוחות",
      date: "28/03/2025",
      type: "לקוחות",
    },
    {
      id: "3",
      name: "מלאי מוצרים",
      date: "25/03/2025",
      type: "מלאי",
    },
  ];

  const reportTypes = [
    {
      id: "revenue",
      name: "דו״ח הכנסות",
      icon: <DollarSign className="h-8 w-8 text-primary" />,
      description: "סיכום של כל ההכנסות שלך לפי יום, שבוע, או חודש",
    },
    {
      id: "services",
      name: "דו״ח שירותים מובילים",
      icon: <FileText className="h-8 w-8 text-primary" />,
      description: "סקירה של השירותים הפופולריים ביותר והרווחיים ביותר",
    },
    {
      id: "clients",
      name: "דו״ח לקוחות",
      icon: <Users className="h-8 w-8 text-primary" />,
      description: "ניתוח בסיס הלקוחות שלך, כולל לקוחות חדשים וחוזרים",
    },
    {
      id: "schedule",
      name: "דו״ח לוח זמנים",
      icon: <Calendar className="h-8 w-8 text-primary" />,
      description: "סיכום הפגישות שלך וניתוח של זמני השיא",
    },
  ];

  const handleDownload = (reportId: string) => {
    setSelectedReport(reportId);
    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      setSelectedReport(null);
      toast({
        title: "הצלחה",
        description: "הדו״ח הורד בהצלחה"
      });
    }, 1500);
  };

  return (
    <div dir="rtl">
      <h1 className="text-2xl font-bold mb-4">דוחות</h1>
      <p className="text-muted-foreground mb-6">
        צפייה וניתוח ביצועי העסק שלך עם דוחות מפורטים.
      </p>

      <Tabs defaultValue="standard" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="standard">דוחות סטנדרטיים</TabsTrigger>
          <TabsTrigger value="custom">דוחות מותאמים אישית</TabsTrigger>
        </TabsList>

        <TabsContent value="standard">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {reportTypes.map((report) => (
              <Card key={report.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{report.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center">
                      <div className="ml-2">{report.icon}</div>
                      <p className="text-sm text-muted-foreground">{report.description}</p>
                    </div>
                    <Button size="sm" 
                      onClick={() => handleDownload(report.id)}
                      disabled={isGenerating && selectedReport === report.id}
                      className="w-full"
                    >
                      {isGenerating && selectedReport === report.id ? (
                        <span className="flex items-center">
                          <div className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
                          מכין דו״ח...
                        </span>
                      ) : (
                        <><Download className="h-4 w-4 ml-2" /> הורדה</>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="custom">
          <ReportGenerator />
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>דוחות אחרונים</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentReports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 cursor-pointer"
              >
                <div className="flex items-center">
                  <FileText className="h-5 w-5 ml-3 text-primary" />
                  <div>
                    <p className="font-medium">{report.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {report.type} • {report.date}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleDownload(report.id)}>
                  <Download className="h-4 w-4 ml-1" /> הורד
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
