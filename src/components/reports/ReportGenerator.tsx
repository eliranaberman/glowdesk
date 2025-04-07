
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const ReportGenerator = () => {
  const [reportName, setReportName] = useState("");
  const [reportType, setReportType] = useState("");
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [format, setFormat] = useState("pdf");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    if (!reportName || !reportType || !dateRange.from) {
      toast.error("נא למלא את כל השדות הנדרשים");
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      toast.success(`הדוח "${reportName}" הורד בהצלחה`);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="report-name">שם הדוח</Label>
              <Input
                id="report-name"
                placeholder="הזן שם לדוח"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="report-type">סוג דוח</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger id="report-type">
                  <SelectValue placeholder="בחר סוג דוח" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">הכנסות</SelectItem>
                  <SelectItem value="clients">לקוחות</SelectItem>
                  <SelectItem value="services">שירותים</SelectItem>
                  <SelectItem value="inventory">מלאי</SelectItem>
                  <SelectItem value="schedule">לוח זמנים</SelectItem>
                  <SelectItem value="expenses">הוצאות</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>טווח תאריכים</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-right font-normal",
                      !dateRange.from && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="ml-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {new Intl.DateTimeFormat("he-IL").format(dateRange.from)} -{" "}
                          {new Intl.DateTimeFormat("he-IL").format(dateRange.to)}
                        </>
                      ) : (
                        new Intl.DateTimeFormat("he-IL").format(dateRange.from)
                      )
                    ) : (
                      <span>בחר טווח תאריכים</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="format">פורמט</Label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger id="format">
                  <SelectValue placeholder="בחר פורמט" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Button 
          className="w-full mt-6" 
          onClick={handleGenerate} 
          disabled={isGenerating}
        >
          {isGenerating ? (
            <span className="flex items-center">
              <div className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
              מכין דו״ח...
            </span>
          ) : (
            <><Download className="ml-2 h-4 w-4" /> הורד דוח מותאם אישית</>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ReportGenerator;
