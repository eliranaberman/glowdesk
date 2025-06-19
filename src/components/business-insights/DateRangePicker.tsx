
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';

interface DateRangePickerProps {
  onDateRangeChange: (range: DateRange | undefined) => void;
  dateRange: DateRange | undefined;
}

const DateRangePicker = ({ onDateRangeChange, dateRange }: DateRangePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const formatDateRange = (range: DateRange | undefined) => {
    if (!range?.from) return "בחר טווח תאריכים";
    if (!range.to) return format(range.from, 'dd/MM/yyyy');
    return `${format(range.from, 'dd/MM/yyyy')} - ${format(range.to, 'dd/MM/yyyy')}`;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full md:w-auto justify-between bg-white border-[#F6BE9A] hover:bg-[#FDF4EF]"
          style={{ color: '#3A1E14' }}
        >
          <span>{formatDateRange(dateRange)}</span>
          <CalendarIcon className="h-4 w-4 mr-2" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white" align="start">
        <Calendar
          mode="range"
          selected={dateRange}
          onSelect={(range) => {
            onDateRangeChange(range);
            if (range?.from && range?.to) {
              setIsOpen(false);
            }
          }}
          numberOfMonths={2}
          className="rounded-md border-0"
        />
      </PopoverContent>
    </Popover>
  );
};

export default DateRangePicker;
