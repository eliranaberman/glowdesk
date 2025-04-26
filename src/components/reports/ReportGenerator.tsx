
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { DateRange } from "react-day-picker";
import ReportFormFields from "./ReportFormFields";

const ReportGenerator = () => {
  const [reportName, setReportName] = useState("");
  const [reportType, setReportType] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({
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
        <ReportFormFields
          reportName={reportName}
          setReportName={setReportName}
          reportType={reportType}
          setReportType={setReportType}
          format={format}
          setFormat={setFormat}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />

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
