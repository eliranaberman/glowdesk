
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileBarChart, FileText } from "lucide-react";

const Reports = () => {
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

  return (
    <div dir="rtl">
      <h1 className="text-2xl font-bold mb-4">דוחות</h1>
      <p className="text-muted-foreground mb-6">
        צפייה וניתוח ביצועי העסק שלך עם דוחות מפורטים.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">דו״ח הכנסות</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <FileBarChart className="h-8 w-8 text-primary" />
              </div>
              <Button size="sm">
                <Download className="h-4 w-4 mr-2" />
                הורדה
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">דו״ח שירותים מובילים</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <Button size="sm">
                <Download className="h-4 w-4 mr-2" />
                הורדה
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">דו״ח לקוחות</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <FileBarChart className="h-8 w-8 text-primary" />
              </div>
              <Button size="sm">
                <Download className="h-4 w-4 mr-2" />
                הורדה
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

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
                <Button variant="outline" size="sm">
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
