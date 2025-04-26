
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateRangeSelectorProps {
  dateRange: DateRange;
  onSelect: (dateRange: DateRange | undefined) => void;
}

const DateRangeSelector = ({ dateRange, onSelect }: DateRangeSelectorProps) => {
  return (
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
          onSelect={onSelect}
          numberOfMonths={2}
          className="p-3 pointer-events-auto"
        />
      </PopoverContent>
    </Popover>
  );
};

export default DateRangeSelector;
