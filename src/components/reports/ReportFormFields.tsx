
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRange } from "react-day-picker";
import DateRangeSelector from "./DateRangeSelector";

interface ReportFormFieldsProps {
  reportName: string;
  setReportName: (value: string) => void;
  reportType: string;
  setReportType: (value: string) => void;
  format: string;
  setFormat: (value: string) => void;
  dateRange: DateRange;
  setDateRange: (dateRange: DateRange) => void;
}

const ReportFormFields = ({
  reportName,
  setReportName,
  reportType,
  setReportType,
  format,
  setFormat,
  dateRange,
  setDateRange,
}: ReportFormFieldsProps) => {
  return (
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
          <DateRangeSelector dateRange={dateRange} onSelect={setDateRange} />
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
  );
};

export default ReportFormFields;
